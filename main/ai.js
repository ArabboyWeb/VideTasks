/* ===================================
   TASKFLOW AI - OpenRouter API Module
   =================================== */

const TaskFlowAI = (() => {
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    const MODELS = {
        fast: 'stepfun/step-3.5-flash:free',
        reasoning: 'nvidia/nemotron-3-super-120b-a12b:free',
        chat: 'z-ai/glm-4.5-air:free',
        planner: 'nvidia/nemotron-3-super-120b-a12b:free',
    };

    const FALLBACK_CHAIN = [
        'nvidia/nemotron-3-super-120b-a12b:free',
        'stepfun/step-3.5-flash:free',
        'z-ai/glm-4.5-air:free',
    ];

    function getApiKey() {
        const apiKey = (
            localStorage.getItem('taskflow_api_key') ||
            sessionStorage.getItem('taskflow_api_key') ||
            window.__TASKFLOW_API_KEY__ ||
            ''
        ).trim();
        if (!apiKey) {
            throw new Error('Add your OpenRouter API key in Settings to use AI features.');
        }
        return apiKey;
    }

    function normalizePriority(value) {
        const priority = String(value || '').toLowerCase();
        return ['low', 'medium', 'high'].includes(priority) ? priority : 'medium';
    }

    function normalizeCategory(value) {
        const category = String(value || '').toLowerCase();
        return ['personal', 'work', 'shopping', 'health'].includes(category) ? category : 'personal';
    }

    function normalizeDate(value) {
        return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) ? value : null;
    }

    async function callAPI(model, messages, options = {}) {
        const body = {
            model,
            messages,
            temperature: options.temperature ?? 0.7,
            max_tokens: options.max_tokens ?? 1024,
            stream: options.stream ?? false,
        };

        const externalSignal = options.signal || null;
        const internalController = new AbortController();
        const timeoutMs = options.timeout || 30000;
        const abortForwarder = () => internalController.abort();

        if (externalSignal) {
            externalSignal.addEventListener('abort', abortForwarder, { once: true });
        }

        const timeoutId = setTimeout(() => internalController.abort(), timeoutMs);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getApiKey()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: internalController.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errText = await response.text().catch(() => 'Unknown error');
                if (response.status === 401 || response.status === 403) {
                    throw new Error('The OpenRouter API key is missing or invalid. Update it in Settings.');
                }
                throw new Error(`API Error (${response.status}): ${errText}`);
            }

            if (options.stream) {
                if (!response.body) {
                    throw new Error('Streaming is not available for this response.');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let fullText = '';
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim() === 'data: [DONE]') {
                            return fullText;
                        }

                        if (!line.startsWith('data: ')) {
                            continue;
                        }

                        try {
                            const data = JSON.parse(line.slice(6));
                            const content = data.choices?.[0]?.delta?.content;
                            if (!content) continue;
                            fullText += content;
                            if (typeof options.onChunk === 'function') {
                                options.onChunk(content, fullText);
                            }
                        } catch (err) {
                            // Ignore partial SSE frames.
                        }
                    }
                }

                return fullText;
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || '';
        } catch (err) {
            clearTimeout(timeoutId);

            if (err.name === 'AbortError') {
                if (externalSignal?.aborted) {
                    throw new DOMException('Request aborted', 'AbortError');
                }
                throw new Error('AI request timed out. Please try again.');
            }

            throw err;
        } finally {
            if (externalSignal) {
                externalSignal.removeEventListener('abort', abortForwarder);
            }
        }
    }

    async function callWithFallback(primaryModel, messages, options = {}) {
        const modelsToTry = [primaryModel, ...FALLBACK_CHAIN.filter(model => model !== primaryModel)];

        for (const model of modelsToTry) {
            try {
                return await callAPI(model, messages, options);
            } catch (err) {
                if (
                    err.name === 'AbortError' ||
                    /api key/i.test(err.message) ||
                    /401|403/.test(err.message)
                ) {
                    throw err;
                }

                console.warn(`Model ${model} failed:`, err.message);
            }
        }

        throw new Error('All AI models are currently unavailable. Please try again later.');
    }

    function parseAIJSON(text) {
        if (!text) throw new Error('Empty response');

        const cleaned = String(text)
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();

        const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            try {
                return JSON.parse(arrayMatch[0]);
            } catch (err) {
                // Fall through.
            }
        }

        const objectMatch = cleaned.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            try {
                return JSON.parse(objectMatch[0]);
            } catch (err) {
                // Fall through.
            }
        }

        return JSON.parse(cleaned);
    }

    async function smartParseTask(userInput, options = {}) {
        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const messages = [
            {
                role: 'system',
                content: `You are an intelligent task extraction AI for a to-do app. Today is ${dayOfWeek}, ${today}. Tomorrow is ${tomorrowStr}.

Your job:
1. Split multi-task input into separate actionable tasks.
2. Clean each title into a short action.
3. Infer category: personal, work, shopping, or health.
4. Infer priority: low, medium, or high.
5. Infer due date when explicitly mentioned.
6. Add a one-sentence description.

Return only valid JSON:
[{"title":"...","description":"...","category":"personal|work|shopping|health","priority":"low|medium|high","dueDate":"YYYY-MM-DD or null"}]`
            },
            { role: 'user', content: userInput }
        ];

        try {
            const result = await callWithFallback(MODELS.reasoning, messages, {
                temperature: 0.3,
                max_tokens: 800,
                ...options,
            });

            let parsed = parseAIJSON(result);
            if (!Array.isArray(parsed)) parsed = [parsed];
            if (parsed.length === 0) throw new Error('AI returned no tasks.');

            return parsed.map(task => ({
                title: (task.title || '').trim() || userInput,
                description: (task.description || '').trim(),
                category: normalizeCategory(task.category),
                priority: normalizePriority(task.priority),
                dueDate: normalizeDate(task.dueDate),
            }));
        } catch (err) {
            console.warn('Smart parse failed:', err.message, '- using fallback');
            return [{
                title: userInput,
                description: '',
                category: 'personal',
                priority: 'medium',
                dueDate: null,
            }];
        }
    }

    async function breakdownTask(taskTitle, taskDescription = '', options = {}) {
        const messages = [
            {
                role: 'system',
                content: 'You break down tasks into actionable subtasks. Return only a valid JSON array of 3-6 short, specific subtasks.'
            },
            {
                role: 'user',
                content: `Break down this task: "${taskTitle}"${taskDescription ? `\nDetails: ${taskDescription}` : ''}`
            }
        ];

        try {
            const result = await callWithFallback(MODELS.reasoning, messages, {
                temperature: 0.5,
                max_tokens: 512,
                ...options,
            });

            let subtasks = parseAIJSON(result);
            if (!Array.isArray(subtasks)) subtasks = [subtasks];

            if (subtasks.length === 0) {
                throw new Error('Invalid subtask format');
            }

            return subtasks
                .map(item => typeof item === 'string' ? item : item.title || String(item))
                .slice(0, 8);
        } catch (err) {
            console.warn('Task breakdown failed:', err.message);
            throw new Error('Could not break down this task. Please try again.');
        }
    }

    async function chatWithAI(userMessage, taskContext, chatHistory = [], options = {}) {
        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const systemPrompt = `You are TaskFlow AI, a productivity assistant for a to-do app. Today is ${dayOfWeek}, ${today}.

You can perform task actions. When an action is needed, append one JSON block at the end:
[ACTIONS: [{"cmd":"add_task","data":{"title":"Buy milk","category":"shopping","priority":"high","dueDate":null}}]]

Supported commands:
1. add_task -> {title, category, priority, dueDate, description}
2. delete_task -> {id}
3. toggle_task -> {id}
4. clear_completed -> {}
5. search_tasks -> {query}

Current task context:
${taskContext}

Respond conversationally first. Keep responses concise.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-10),
            { role: 'user', content: userMessage }
        ];

        try {
            return await callWithFallback(MODELS.reasoning, messages, {
                temperature: 0.6,
                max_tokens: 1200,
                ...options,
            });
        } catch (err) {
            if (err.name === 'AbortError') throw err;
            throw new Error(err.message || 'AI assistant is temporarily unavailable. Please try again.');
        }
    }

    async function suggestDailyPlan(taskContext, options = {}) {
        const today = new Date().toISOString().split('T')[0];
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const messages = [
            {
                role: 'system',
                content: `You are a productivity planner. Today is ${dayOfWeek}, ${today}. Create a concise daily plan with a short intro sentence, a numbered list of 3-6 items with time estimates, and one closing sentence. Prioritize overdue and high-priority work.`
            },
            {
                role: 'user',
                content: `Here are my current tasks:\n${taskContext}\n\nPlease plan my day.`
            }
        ];

        try {
            return await callWithFallback(MODELS.planner, messages, {
                temperature: 0.6,
                max_tokens: 600,
                ...options,
            });
        } catch (err) {
            throw new Error(err.message || 'Could not generate a daily plan. Please try again.');
        }
    }

    async function suggestTasks(taskContext, options = {}) {
        const messages = [
            {
                role: 'system',
                content: 'Based on the user\'s current tasks, suggest 3-5 additional useful tasks. Return only valid JSON: [{"title":"...","category":"personal|work|shopping|health","priority":"low|medium|high"}]'
            },
            {
                role: 'user',
                content: `My current tasks:\n${taskContext}\n\nSuggest related tasks I might be missing.`
            }
        ];

        try {
            const result = await callWithFallback(MODELS.reasoning, messages, {
                temperature: 0.7,
                max_tokens: 512,
                ...options,
            });

            const parsed = parseAIJSON(result);
            const suggestions = Array.isArray(parsed) ? parsed : [parsed];

            return suggestions.map(task => ({
                title: (task.title || '').trim(),
                category: normalizeCategory(task.category),
                priority: normalizePriority(task.priority),
            })).filter(task => task.title);
        } catch (err) {
            throw new Error(err.message || 'Could not generate suggestions. Please try again.');
        }
    }

    async function generateSchedule(taskContext, options = {}) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentHour = now.getHours();

        const messages = [
            {
                role: 'system',
                content: `You are an expert productivity scheduler. Today is ${dayOfWeek}, ${today}. Current time is about ${currentHour}:00.

Create a realistic time-blocked schedule for the rest of today.

Rules:
1. Start from ${currentHour + 1}:00 and end by about 22:00.
2. Use estimated durations such as 30min, 1h, 1.5h, or 2h.
3. Prioritize high-priority tasks.
4. Add short breaks.
5. Group similar categories when possible.
6. Include a meal break if it makes sense.

Return only valid JSON:
[{"time":"09:00","endTime":"10:00","title":"...","category":"work|personal|shopping|health|break","priority":"high|medium|low","duration":"1h","notes":"brief tip"}]`
            },
            {
                role: 'user',
                content: `Here are my pending tasks:\n${taskContext}\n\nCreate my schedule.`
            }
        ];

        try {
            const result = await callWithFallback(MODELS.planner, messages, {
                temperature: 0.5,
                max_tokens: 1200,
                ...options,
            });

            let parsed = parseAIJSON(result);
            if (!Array.isArray(parsed)) parsed = [parsed];

            return parsed.map(block => ({
                time: block.time || '??:??',
                endTime: block.endTime || '',
                title: block.title || 'Untitled',
                category: block.category || 'personal',
                priority: normalizePriority(block.priority),
                duration: block.duration || '30min',
                notes: block.notes || '',
            }));
        } catch (err) {
            throw new Error(err.message || 'Could not generate schedule. Please try again.');
        }
    }

    function buildTaskContext(todos) {
        if (!Array.isArray(todos) || todos.length === 0) {
            return 'No tasks yet.';
        }

        return todos.map(todo => {
            const status = todo.completed ? 'Completed' : (todo.inProgress ? 'In Progress' : 'Pending');
            const description = todo.description || 'No description';
            const dueDate = todo.dueDate || 'No due date';
            const category = normalizeCategory(todo.category);
            const priority = normalizePriority(todo.priority);
            const subtaskCount = Array.isArray(todo.subtasks) ? todo.subtasks.length : 0;

            return `${todo.id} | ${status} | ${todo.title} | Category: ${category} | Priority: ${priority} | Due: ${dueDate} | Subtasks: ${subtaskCount} | Details: ${description}`;
        }).join('\n');
    }

    return {
        smartParseTask,
        breakdownTask,
        chatWithAI,
        suggestDailyPlan,
        suggestTasks,
        generateSchedule,
        buildTaskContext,
    };
})();
