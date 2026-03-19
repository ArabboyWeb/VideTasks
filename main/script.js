/* ===================================
   TASKFLOW — Premium JavaScript + AI
   =================================== */
document.addEventListener('DOMContentLoaded', () => {

    // ========== DOM References ==========
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = themeToggle.querySelector('.theme-label');
    const sidebarExportBtn = document.getElementById('export-data');
    const sidebarImportBtn = document.getElementById('import-data');
    const sidebarImportFile = document.getElementById('import-file');

    const levelBadge = document.getElementById('level-badge');
    const xpText = document.getElementById('xp-text');
    const xpBarFill = document.getElementById('xp-bar-fill');

    const navItems = document.querySelectorAll('.nav-item[data-view]');
    const catItems = document.querySelectorAll('.nav-item[data-category]');

    const viewTitle = document.getElementById('view-title');
    const dateDisplay = document.getElementById('date-display');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const taskCountEl = document.getElementById('task-count');
    const toolbarEl = document.querySelector('.toolbar');
    const taskScrollArea = document.getElementById('task-scroll-area');

    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');

    // Stats
    const statTotal = document.getElementById('stat-total');
    const statDone = document.getElementById('stat-done');
    const statPending = document.getElementById('stat-pending');
    const statOverdue = document.getElementById('stat-overdue');

    // Badges
    const badgeAll = document.getElementById('badge-all');
    const badgeToday = document.getElementById('badge-today');
    const badgeUpcoming = document.getElementById('badge-upcoming');
    const badgeCompleted = document.getElementById('badge-completed');
    const badgePersonal = document.getElementById('badge-personal');
    const badgeWork = document.getElementById('badge-work');
    const badgeShopping = document.getElementById('badge-shopping');
    const badgeHealth = document.getElementById('badge-health');

    // Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const openAddModal = document.getElementById('open-add-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const todoForm = document.getElementById('todo-form');
    const inputTitle = document.getElementById('task-title');
    const inputDesc = document.getElementById('task-description');
    const inputCategory = document.getElementById('task-category');
    const inputPriority = document.getElementById('task-priority');
    const inputDue = document.getElementById('task-due');
    const inputRecurrence = document.getElementById('task-recurrence');

    // Settings
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsClose = document.getElementById('settings-close');
    const apiKeyInput = document.getElementById('api-key-input');
    const settingsSaveBtn = document.getElementById('settings-saveBtn');
    const settingsExportBtn = document.getElementById('settings-export-data');
    const settingsImportBtn = document.getElementById('settings-import-data');
    const settingsImportFile = document.getElementById('settings-import-file');

    // Insights
    const insightsView = document.getElementById('insights-view');
    const heatmapContainer = document.getElementById('productivity-heatmap');
    const categoryBars = document.getElementById('category-bars');
    const aiReviewContent = document.getElementById('ai-review-content');
    const btnGenerateReview = document.getElementById('btn-generate-review');

    // Smart Add (AI)
    const smartAddForm = document.getElementById('smart-add-form');
    const smartAddInput = document.getElementById('smart-add-input');
    const smartAddBtn = document.getElementById('smart-add-btn');
    const voiceInputBtn = document.getElementById('voice-input-btn');
    const smartAddStatus = document.getElementById('smart-add-status');

    // AI Chat Panel
    const aiChatPanel = document.getElementById('ai-chat-panel');
    const aiChatOverlay = document.getElementById('ai-chat-overlay');
    const openAiChat = document.getElementById('open-ai-chat');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiChatForm = document.getElementById('ai-chat-form');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatMessages = document.getElementById('ai-chat-messages');

    // AI Chips
    const aiChips = document.querySelectorAll('.ai-chip');

    // Zen Flow
    const zenOverlay = document.getElementById('zen-flow-overlay');
    const zenCloseBtn = document.getElementById('zen-flow-close');
    const zenTaskTitle = document.getElementById('zen-task-title');
    const zenTaskMeta = document.getElementById('zen-task-meta');
    const zenTimerDisplay = document.getElementById('zen-timer');
    const zenTimerBar = document.getElementById('zen-timer-bar');
    const zenStartBtn = document.getElementById('zen-start');
    const zenSkipBtn = document.getElementById('zen-skip');
    const zenCompleteBtn = document.getElementById('zen-complete');
    const zenQuote = document.getElementById('zen-quote');
    const navZenFlow = document.getElementById('nav-zen-flow');

    // Scheduler
    const scheduleOverlay = document.getElementById('schedule-overlay');
    const scheduleCloseBtn = document.getElementById('schedule-close');
    const scheduleGenBtn = document.getElementById('schedule-generate');
    const scheduleTimeline = document.getElementById('schedule-timeline');
    const scheduleDateEl = document.getElementById('schedule-date');
    const navSchedule = document.getElementById('nav-schedule');

    // Wisp
    const wispContainer = document.getElementById('wisp-container');
    const wispMoodEl = document.getElementById('wisp-mood');
    const wispSpeechEl = document.getElementById('wisp-speech');

    // Kanban
    const viewToggleBtn = document.getElementById('view-toggle-btn');
    const listView = document.getElementById('list-view');
    const kanbanView = document.getElementById('kanban-view');
    const kanbanTodo = document.getElementById('kanban-todo');
    const kanbanProgress = document.getElementById('kanban-progress');
    const kanbanDone = document.getElementById('kanban-done');

    // ========== INSIGHTS DASHBOARD ==========
    function renderInsights() {
        if (!heatmapContainer || !categoryBars) return;

        // 1. Heatmap (30 days)
        const days = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            days.push(d.toISOString().split('T')[0]);
        }
        
        // Count completions per day
        const completionsMap = {};
        todos.filter(t => t.completed).forEach(t => {
            const d = t.completedAt || t.dueDate || t.createdAt;
            const day = new Date(d).toISOString().split('T')[0];
            completionsMap[day] = (completionsMap[day] || 0) + 1;
        });

        heatmapContainer.innerHTML = '<div class="heatmap-grid">' + days.map(d => {
            const count = completionsMap[d] || 0;
            let level = 0;
            if (count >= 5) level = 4;
            else if (count >= 3) level = 3;
            else if (count >= 1) level = 2;
            const label = count === 1 ? 'task' : 'tasks';
            return `<div class="heatmap-day" data-level="${level}" title="${count} completed ${label} on ${d}"></div>`;
        }).join('') + '</div>';

        // 2. Category Breakdown
        const cats = { work: 0, personal: 0, shopping: 0, health: 0 };
        todos.forEach(t => { if (cats[t.category] !== undefined) cats[t.category]++; });
        const total = Object.values(cats).reduce((a,b)=>a+b, 0) || 1;
        
        categoryBars.innerHTML = Object.entries(cats).map(([cat, count]) => {
            const percentage = Math.round((count / total) * 100);
            let color = 'var(--text-primary)';
            if (cat === 'work') color = '#3b82f6';
            if (cat === 'personal') color = '#8b5cf6';
            if (cat === 'health') color = '#f43f5e';
            if (cat === 'shopping') color = '#10b981';
            
            return `
            <div class="cat-bar-row">
                <div class="cat-bar-label">${cat}</div>
                <div class="cat-bar-track">
                    <div class="cat-bar-fill" style="width: ${percentage}%; background: ${color}"></div>
                </div>
                <div class="cat-bar-value">${percentage}%</div>
            </div>`;
        }).join('');
    }

    async function generateInsightsReview() {
        if (!aiReviewContent) return;
        btnGenerateReview.disabled = true;
        btnGenerateReview.textContent = 'Analyzing...';
        aiReviewContent.innerHTML = '<span class="typing-cursor"></span>';
        
        try {
            const ctx = TaskFlowAI.buildTaskContext(todos);
            const prompt = "You are an analytical productivity coach. Briefly review the user's tasks. Summarize what they've accomplished, point out any trends or neglected areas (like health or high priority items), and give 2 short actionable tips for next week. Keep it very short, encouraging, and format with markdown bullets.";
            
            let lastReviewRender = 0;
            const fullReply = await TaskFlowAI.chatWithAI(prompt, ctx, [], {
                stream: true,
                onChunk: (chunk, full) => {
                    const now = Date.now();
                    if (now - lastReviewRender > 65) {
                        const clean = full.replace(/\[ACTIONS:.*$/s, '');
                        aiReviewContent.innerHTML = renderMarkdown(clean);
                        lastReviewRender = now;
                    }
                }
            });
            // Ensure final render is guaranteed
            aiReviewContent.innerHTML = renderMarkdown(fullReply.replace(/\[ACTIONS:.*$/s, ''));
        } catch(err) {
            aiReviewContent.textContent = 'Could not generate review: ' + err.message;
        } finally {
            btnGenerateReview.disabled = false;
            btnGenerateReview.textContent = 'Generate Review';
        }
    }

    // ========== State ==========
    let currentChatController = null;
    let isAiChatting = false;

    // ========== State Management Integrity Wrapper ==========
    function safeLoadStore(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            const parsed = JSON.parse(raw);
            if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
            return parsed;
        } catch (e) {
            console.error(`[TaskFlow] Corrupted LocalStorage for key: ${key}. Resetting structural memory.`, e);
            localStorage.removeItem(key);
            return fallback;
        }
    }

    function normalizeCategoryValue(value) {
        const category = String(value || '').toLowerCase();
        return ['personal', 'work', 'shopping', 'health'].includes(category) ? category : 'personal';
    }

    function normalizePriorityValue(value) {
        const priority = String(value || '').toLowerCase();
        return ['low', 'medium', 'high'].includes(priority) ? priority : 'medium';
    }

    function normalizeRecurrenceValue(value) {
        const recurrence = String(value || '').toLowerCase();
        return ['none', 'daily', 'weekly', 'monthly'].includes(recurrence) ? recurrence : 'none';
    }

    function normalizeTodoRecord(todo) {
        const source = todo && typeof todo === 'object' ? todo : {};
        return {
            ...source,
            category: normalizeCategoryValue(source.category),
            priority: normalizePriorityValue(source.priority),
            recurrence: normalizeRecurrenceValue(source.recurrence),
            dueDate: /^\d{4}-\d{2}-\d{2}$/.test(String(source.dueDate || '')) ? source.dueDate : null,
            completed: Boolean(source.completed),
            completedAt: source.completed ? (source.completedAt || source.createdAt || new Date().toISOString()) : null,
            inProgress: Boolean(source.inProgress),
            subtasks: Array.isArray(source.subtasks) ? source.subtasks : [],
        };
    }

    let todos = safeLoadStore('taskflow_todos', []).map(normalizeTodoRecord);
    if (todos.length === 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        const tmrwStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        todos = [
            { id: 'd1', title: 'Complete Executive Summary', description: 'Finish the draft for the Q3 report.', category: 'work', priority: 'high', dueDate: todayStr, recurrence: 'none', completed: false, createdAt: new Date().toISOString(), subtasks: [{title: 'Draft section 1', completed: true}, {title: 'Review with team', completed: false}] },
            { id: 'd2', title: 'Morning 5km Run', description: 'Focus on breathing rhythm.', category: 'health', priority: 'high', dueDate: todayStr, recurrence: 'daily', completed: false, createdAt: new Date().toISOString() },
            { id: 'd3', title: 'Whole Foods Grocery Run', description: 'Matcha powder, almond milk, spinach.', category: 'shopping', priority: 'medium', dueDate: tmrwStr, recurrence: 'weekly', completed: false, createdAt: new Date().toISOString() },
            { id: 'd4', title: 'Read 30 pages of "Deep Work"', description: 'Focus on the structural chapters.', category: 'personal', priority: 'low', dueDate: tmrwStr, recurrence: 'none', completed: false, createdAt: new Date().toISOString() },
            { id: 'd5', title: 'Drink 2 Liters of Water', description: 'Stay hydrated today.', category: 'health', priority: 'medium', dueDate: todayStr, recurrence: 'daily', completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
            { id: 'd6', title: 'Optimize Landing Page SEO', description: 'Add meta tags and compress images.', category: 'work', priority: 'medium', dueDate: todayStr, recurrence: 'none', completed: true, completedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
        ];
        localStorage.setItem('taskflow_todos', JSON.stringify(todos));
    }
    
    let chatHistory = safeLoadStore('taskflow_chat', []);
    let currentView = 'all';
    let currentCategory = null;
    let searchQuery = '';
    let sortMode = 'newest';
    let theme = localStorage.getItem('taskflow_theme') || 'dark';
    let draggedItem = null;

    let activePomodoroId = null;
    let pomodoroTimeLeft = 25 * 60;
    let pomodoroInterval = null;

    let userXp = parseInt(localStorage.getItem('taskflow_xp')) || 0;

    // Zen Flow state
    let zenCurrentTask = null;
    let zenTimerInterval = null;
    let zenTimeLeft = 25 * 60;
    let zenTimerRunning = false;

    let currentViewMode = 'list'; // 'list' or 'kanban'
    let kanbanDropzonesBound = false;

    const WISP_SPEECHES = {
        happy: ["You're doing great! Keep it up! ✨", "Tasks are flowing! 🎉", "Productivity mode: ON 💪"],
        excited: ["WOW! You're on fire! 🔥", "Unstoppable! 🚀", "Level up! I'm so proud! 🌟"],
        calm: ["Let's get started! 🌿", "Ready when you are 😊", "A fresh start awaits ☕"],
        sleepy: ["*yawn* Any tasks today? 😴", "I'm getting lonely... 💤", "Need tasks to stay awake... 🥱"],
        worried: ["Overdue tasks need attention! ⚡", "Don't forget your deadlines! 😟", "Let's tackle those overdue ones first! 🏃"]
    };

    const ZEN_QUOTES = [
        '"The key is not to prioritize what\'s on your schedule, but to schedule your priorities." — Stephen Covey',
        '"Focus on being productive instead of busy." — Tim Ferriss',
        '"Do the hard jobs first. The easy jobs will take care of themselves." — Dale Carnegie',
        '"It is not enough to be busy. The question is: what are we busy about?" — Thoreau',
        '"You don\'t need more time. You need more focus."',
        '"Action is the foundational key to all success." — Picasso',
        '"Start where you are. Use what you have. Do what you can." — Arthur Ashe',
    ];

    // ========== Init ==========
    applyTheme(theme);
    setDate();
    updateGamificationUI();
    updateWisp();
    render();
    bindEvents();

    // ========== Event Binding ==========
    function bindEvents() {
        // Sidebar
        sidebarToggle.addEventListener('click', toggleSidebar);
        mobileMenuBtn.addEventListener('click', openMobileSidebar);
        sidebarOverlay.addEventListener('click', closeMobileSidebar);

        // Theme
        themeToggle.addEventListener('click', toggleTheme);

        // Data Management
        bindExportControl(sidebarExportBtn);
        bindExportControl(settingsExportBtn);
        bindImportControl(sidebarImportBtn, sidebarImportFile);
        bindImportControl(settingsImportBtn, settingsImportFile);

        // Nav Views
        navItems.forEach(btn => btn.addEventListener('click', () => {
            setActiveNav(btn);
            currentView = btn.dataset.view;
            currentCategory = null;
            viewTitle.textContent = btn.querySelector('span:not(.nav-badge)').textContent.trim();
            if (currentView === 'insights') {
                setWorkspaceMode(false);
                insightsView.style.display = 'block';
                renderInsights();
            } else {
                setWorkspaceMode(true);
                insightsView.style.display = 'none';
                render();
            }
        }));

        // Nav Categories
        catItems.forEach(btn => btn.addEventListener('click', () => {
            setActiveNav(btn);
            currentCategory = btn.dataset.category;
            currentView = 'all';
            viewTitle.textContent = capitalize(currentCategory);
            setWorkspaceMode(true);
            insightsView.style.display = 'none';
            render();
        }));

        // Search
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = e.target.value.toLowerCase().trim();
                render();
            }, 250);
        });

        // Sort
        sortSelect.addEventListener('change', (e) => {
            sortMode = e.target.value;
            render();
        });

        // Clear completed
        clearCompletedBtn.addEventListener('click', clearCompleted);

        // Settings Modal
        if (settingsToggle) settingsToggle.addEventListener('click', () => {
            apiKeyInput.value = localStorage.getItem('taskflow_api_key')
                || sessionStorage.getItem('taskflow_api_key')
                || window.__TASKFLOW_API_KEY__
                || '';
            settingsOverlay.classList.add('open');
            closeMobileSidebar();
        });
        if (settingsClose) settingsClose.addEventListener('click', () => settingsOverlay.classList.remove('open'));
        if (settingsSaveBtn) settingsSaveBtn.addEventListener('click', () => {
            const newKey = apiKeyInput.value.trim();
            if (newKey) {
                localStorage.setItem('taskflow_api_key', newKey);
                sessionStorage.setItem('taskflow_api_key', newKey);
            } else {
                localStorage.removeItem('taskflow_api_key');
                sessionStorage.removeItem('taskflow_api_key');
            }
            settingsOverlay.classList.remove('open');
            alert('Settings saved successfully!');
        });
        if (settingsOverlay) settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) settingsOverlay.classList.remove('open');
        });

        // Insights AI Review
        if (btnGenerateReview) btnGenerateReview.addEventListener('click', generateInsightsReview);

        // Modal
        openAddModal.addEventListener('click', openModal);
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Form submit (manual add)
        todoForm.addEventListener('submit', handleAddTodo);

        // Smart Add (AI)
        smartAddForm.addEventListener('submit', handleSmartAdd);
        if (voiceInputBtn) {
            voiceInputBtn.addEventListener('click', toggleVoiceInput);
        }

        // Todo list events
        todoList.addEventListener('click', handleTodoClick);
        todoList.addEventListener('focusout', handleEditBlur);
        todoList.addEventListener('keydown', handleEditKey);

        // AI Chat Panel
        openAiChat.addEventListener('click', openChatPanel);
        aiChatClose.addEventListener('click', closeChatPanel);
        aiChatOverlay.addEventListener('click', closeChatPanel);
        aiChatForm.addEventListener('submit', handleChatSend);

        // AI Chips — pass both the action data attribute AND the chip element
        aiChips.forEach(chip => chip.addEventListener('click', () => {
            const action = chip.dataset.action;
            handleAiChip(action, chip);
        }));

        // Zen Flow
        if (navZenFlow) navZenFlow.addEventListener('click', openZenFlow);
        if (zenCloseBtn) zenCloseBtn.addEventListener('click', closeZenFlow);
        if (zenStartBtn) zenStartBtn.addEventListener('click', toggleZenTimer);
        if (zenSkipBtn) zenSkipBtn.addEventListener('click', zenSkipTask);
        if (zenCompleteBtn) zenCompleteBtn.addEventListener('click', zenMarkComplete);

        // Scheduler
        if (navSchedule) navSchedule.addEventListener('click', openScheduler);
        if (scheduleCloseBtn) scheduleCloseBtn.addEventListener('click', closeScheduler);
        if (scheduleGenBtn) scheduleGenBtn.addEventListener('click', generateAISchedule);

        // View Toggle (List / Kanban)
        if (viewToggleBtn) viewToggleBtn.addEventListener('click', toggleViewMode);

        // Wisp click for speech
        if (wispContainer) wispContainer.addEventListener('click', showWispSpeech);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (modalOverlay.classList.contains('open')) closeModal();
                if (aiChatPanel.classList.contains('open')) closeChatPanel();
                if (zenOverlay && zenOverlay.classList.contains('open')) closeZenFlow();
                if (scheduleOverlay && scheduleOverlay.classList.contains('open')) closeScheduler();
            }
            if (e.key === '/' && !isTypingTarget(e.target)) {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // ========== Theme ==========
    function applyTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        themeLabel.textContent = t === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    function bindExportControl(button) {
        if (button) button.addEventListener('click', exportData);
    }

    function bindImportControl(button, input) {
        if (!button || !input) return;
        button.addEventListener('click', () => input.click());
        input.addEventListener('change', importData);
    }

    function setWorkspaceMode(showTaskViews) {
        if (toolbarEl) toolbarEl.style.display = showTaskViews ? 'flex' : 'none';
        if (taskScrollArea) taskScrollArea.style.display = showTaskViews ? 'flex' : 'none';
    }

    function isTypingTarget(target) {
        if (!target) return false;
        return target.matches('input, textarea, select') || Boolean(target.closest('[contenteditable="true"]'));
    }

    async function ensureNotificationPermission() {
        if (!('Notification' in window)) return false;
        if (Notification.permission === 'granted') return true;
        if (Notification.permission === 'denied') return false;

        try {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (err) {
            console.warn('Notification permission request failed:', err);
            return false;
        }
    }

    function toggleTheme() {
        theme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('taskflow_theme', theme);
        applyTheme(theme);
    }

    // ========== Sidebar ==========
    function toggleSidebar() { sidebar.classList.toggle('collapsed'); }
    function openMobileSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('open');
    }
    function closeMobileSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('open');
    }
    function setActiveNav(btn) {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        closeMobileSidebar();
    }

    // ========== Date ==========
    function setDate() {
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // ========== Modal ==========
    function openModal() {
        modalOverlay.classList.add('open');
        setTimeout(() => inputTitle.focus(), 100);
    }
    function closeModal() {
        modalOverlay.classList.remove('open');
        todoForm.reset();
    }

    // ========== CRUD ==========
    function handleAddTodo(e) {
        e.preventDefault();
        const title = inputTitle.value.trim();
        if (!title) return;

        addTodo({
            title,
            description: inputDesc.value.trim(),
            category: inputCategory.value,
            priority: inputPriority.value,
            dueDate: inputDue.value || null,
            recurrence: inputRecurrence.value,
        });
        closeModal();
    }

    function addTodo(data) {
        const todo = {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
            title: data.title,
            description: data.description || '',
            category: normalizeCategoryValue(data.category),
            priority: normalizePriorityValue(data.priority),
            dueDate: /^\d{4}-\d{2}-\d{2}$/.test(String(data.dueDate || '')) ? data.dueDate : null,
            recurrence: normalizeRecurrenceValue(data.recurrence),
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
            subtasks: data.subtasks || [],
        };
        todos.unshift(todo);
        save();
        render();
        return todo;
    }

    function toggleTodo(id) {
        let recurrenceGenerated = false;
        todos = todos.map(t => {
            if (t.id !== id) return t;

            const willComplete = !t.completed;
            const nextTodo = {
                ...t,
                completed: willComplete,
                completedAt: willComplete ? new Date().toISOString() : null,
                inProgress: false,
            };

            if (willComplete) {
                addXP(10);
                if (t.recurrence && t.recurrence !== 'none') {
                    generateRecurringTask(nextTodo);
                    recurrenceGenerated = true;
                }
            } else {
                addXP(-10);
            }

            return nextTodo;
        });
        save();
        render();
        if (recurrenceGenerated) {
            setTimeout(() => alert('Recurring task automatically created for next date!'), 300);
        }
    }

    function generateRecurringTask(task) {
        if (!task.dueDate) return;
        const d = new Date(task.dueDate);
        if (task.recurrence === 'daily') d.setDate(d.getDate() + 1);
        else if (task.recurrence === 'weekly') d.setDate(d.getDate() + 7);
        else if (task.recurrence === 'monthly') d.setMonth(d.getMonth() + 1);
        
        const newDate = d.toISOString().split('T')[0];
        const nextTask = {
            ...task,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            completed: false,
            completedAt: null,
            inProgress: false,
            dueDate: newDate,
            createdAt: new Date().toISOString()
        };
        todos.push(nextTask);
    }

    function deleteTodo(el, id) {
        el.classList.add('removing');
        el.addEventListener('transitionend', () => {
            todos = todos.filter(t => t.id !== id);
            save();
            render();
        }, { once: true });
    }

    function clearCompleted() {
        const items = document.querySelectorAll('.todo-item.completed');
        if (items.length === 0) return;
        items.forEach(el => el.classList.add('removing'));
        setTimeout(() => {
            todos = todos.filter(t => !t.completed);
            save();
            render();
        }, 250);
    }

    function handleTodoClick(e) {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const id = item.dataset.id;

        // Checkbox
        if (e.target.closest('.checkbox-container input[type="checkbox"]')) {
            toggleTodo(id);
            return;
        }

        // Delete
        if (e.target.closest('.delete-btn')) {
            deleteTodo(item, id);
            return;
        }

        // AI Breakdown
        if (e.target.closest('.ai-btn')) {
            handleAiBreakdown(item, id);
            return;
        }

        // Subtask checkbox
        if (e.target.closest('.subtask-checkbox')) {
            const stIndex = parseInt(e.target.dataset.stindex);
            toggleSubtask(id, stIndex);
            return;
        }

        // Pomodoro
        if (e.target.closest('.pomodoro-btn')) {
            togglePomodoro(id);
            return;
        }
    }

    function handleEditBlur(e) {
        if (e.target.classList.contains('todo-title')) {
            const id = e.target.closest('.todo-item').dataset.id;
            const newText = e.target.textContent.trim();
            if (!newText) {
                todos = todos.filter(t => t.id !== id);
            } else {
                todos = todos.map(t => t.id === id ? { ...t, title: newText } : t);
            }
            save();
        }
    }

    function handleEditKey(e) {
        if (e.target.classList.contains('todo-title') && e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    }

    // ========== Subtasks ==========
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function playDopaminePop() {
        if (!AudioContextClass) return;
        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function toggleSubtask(todoId, subtaskIndex) {
        todos = todos.map(t => {
            if (t.id === todoId && t.subtasks && t.subtasks[subtaskIndex] !== undefined) {
                const newSubtasks = [...t.subtasks];
                newSubtasks[subtaskIndex] = {
                    ...newSubtasks[subtaskIndex],
                    completed: !newSubtasks[subtaskIndex].completed
                };
                if (newSubtasks[subtaskIndex].completed) {
                    playDopaminePop();
                }
                return { ...t, subtasks: newSubtasks };
            }
            return t;
        });
        save();
        render();
    }

    // ========== Pomodoro Focus Engine ==========
    function togglePomodoro(id) {
        if (activePomodoroId === id) {
            // Stop current
            clearInterval(pomodoroInterval);
            activePomodoroId = null;
            pomodoroInterval = null;
            render();
            return;
        }

        // Start new
        if (pomodoroInterval) clearInterval(pomodoroInterval);
        activePomodoroId = id;
        pomodoroTimeLeft = 25 * 60;
        ensureNotificationPermission();

        render();

        pomodoroInterval = setInterval(() => {
            pomodoroTimeLeft--;
            if (pomodoroTimeLeft <= 0) {
                clearInterval(pomodoroInterval);
                activePomodoroId = null;
                pomodoroInterval = null;
                runPomodoroComplete(id);
            }
            updatePomodoroDisplay();
        }, 1000);
    }

    function runPomodoroComplete(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Pomodoro Complete!', { body: todo.title + ' is done for now. Take a break.' });
            } else {
                alert(`🍅 Pomodoro complete for: ${todo.title}`);
            }
        }
        render();
    }

    function updatePomodoroDisplay() {
        const el = document.getElementById('pomodoro-display-' + activePomodoroId);
        if (el) {
            const m = Math.floor(pomodoroTimeLeft / 60).toString().padStart(2, '0');
            const s = (Math.floor(pomodoroTimeLeft % 60)).toString().padStart(2, '0');
            el.textContent = `⏱️ ${m}:${s}`;
        }
    }

    // ========== AI: Smart Add ==========
    async function handleSmartAdd(e) {
        e.preventDefault();
        const text = smartAddInput.value.trim();
        if (!text) return;

        smartAddBtn.disabled = true;
        setSmartStatus('🤖 AI is analyzing your input...', 'ai-thinking');

        try {
            // smartParseTask now returns an ARRAY of tasks
            const parsedTasks = await TaskFlowAI.smartParseTask(text);

            if (!parsedTasks || parsedTasks.length === 0) {
                throw new Error('AI could not extract any tasks from your input.');
            }

            // Add each parsed task
            parsedTasks.forEach(taskData => addTodo(taskData));
            smartAddInput.value = '';

            if (parsedTasks.length === 1) {
                const t = parsedTasks[0];
                setSmartStatus(
                    `Added "${t.title}" as ${capitalize(t.category)} with ${capitalize(t.priority)} priority${t.dueDate ? `, due ${formatDate(t.dueDate)}` : ''}.`,
                    'ai-success'
                );
            } else {
                setSmartStatus(`Added ${parsedTasks.length} tasks from that note.`, 'ai-success');
            }
            setTimeout(() => setSmartStatus(''), 5000);
            return;

            // Build a nice summary with Confidence Badge
            const rawConfidence = Math.floor(Math.random() * 8) + 92; // 92-99%
            const badge = `<span class="ai-confidence high">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ${rawConfidence}% Confident
            </span>`;

            if (parsedTasks.length === 1) {
                const t = parsedTasks[0];
                setSmartStatus(
                    `${badge}<br>✅ Added: "${t.title}" → ${capitalize(t.category)}, ${capitalize(t.priority)} priority${t.dueDate ? ', due ' + formatDate(t.dueDate) : ''}`,
                    'ai-success'
                );
            } else {
                const titles = parsedTasks.map(t => `"${t.title}"`).join(', ');
                setSmartStatus(
                    `${badge}<br>✅ AI created ${parsedTasks.length} tasks: ${titles}`,
                    'ai-success'
                );
            }
            setTimeout(() => setSmartStatus(''), 5000);
        } catch (err) {
            setSmartStatus('❌ ' + err.message, 'ai-error');
            setTimeout(() => setSmartStatus(''), 5000);
        } finally {
            smartAddBtn.disabled = false;
        }
    }


    function setSmartStatus(msg, cls = '') {
        const normalized = String(msg || '')
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/^[^A-Za-z0-9"]+/, '')
            .trim();
        smartAddStatus.textContent = normalized;
        smartAddStatus.className = 'smart-add-status ' + cls;
    }

    // ========== Voice Input (Web Speech API) ==========
    let recognition = null;
    let isListening = false;

    function toggleVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setSmartStatus('❌ Speech recognition not supported in this browser.', 'ai-error');
            setTimeout(() => setSmartStatus(''), 5000);
            return;
        }

        if (isListening) {
            if (recognition) recognition.stop();
            return;
        }

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isListening = true;
            voiceInputBtn.classList.add('listening');
            smartAddInput.placeholder = 'Listening...';
            setSmartStatus('🎙️ Speak your task...', '');
        };

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            smartAddInput.value = transcript;
            // Auto submit
            smartAddForm.dispatchEvent(new Event('submit', { cancelable: true }));
        };

        recognition.onerror = (e) => {
            console.error('Speech recognition error:', e.error);
            setSmartStatus('❌ Voice input failed: ' + e.error, 'ai-error');
            setTimeout(() => setSmartStatus(''), 5000);
        };

        recognition.onend = () => {
            isListening = false;
            voiceInputBtn.classList.remove('listening');
            smartAddInput.placeholder = 'Try: "buy groceries tomorrow high priority" or "team meeting Friday work"';
        };

        try {
            recognition.start();
        } catch (err) {
            console.error('Failed to start recognition', err);
        }
    }

    // ========== AI: Task Breakdown ==========
    async function handleAiBreakdown(itemEl, todoId) {
        const todo = todos.find(t => t.id === todoId);
        if (!todo || itemEl.classList.contains('ai-breakdown-loading')) return;
        if (todo.subtasks && todo.subtasks.length > 0) return; // Already has subtasks

        itemEl.classList.add('ai-breakdown-loading');

        try {
            const subtaskTitles = await TaskFlowAI.breakdownTask(todo.title, todo.description);
            const subtasks = subtaskTitles.map(title => ({ title, completed: false }));

            todos = todos.map(t =>
                t.id === todoId ? { ...t, subtasks } : t
            );
            save();
            render();
        } catch (err) {
            console.error('Breakdown failed:', err);
            alert('Could not break down task: ' + err.message);
        } finally {
            itemEl.classList.remove('ai-breakdown-loading');
        }
    }

    // ========== AI: Chat Panel ==========
    function openChatPanel() {
        aiChatPanel.classList.add('open');
        aiChatOverlay.classList.add('open');
        setTimeout(() => aiChatInput.focus(), 200);
    }

    function closeChatPanel() {
        aiChatPanel.classList.remove('open');
        aiChatOverlay.classList.remove('open');
    }

    // ========== AI Chat Helpers ==========
    function getTaskContext() {
        return TaskFlowAI.buildTaskContext(todos);
    }

    function toggleAiSendBtn(stopping) {
        const sendBtn = document.getElementById('ai-chat-send');
        if (!sendBtn) return;
        if (stopping) {
            sendBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;
            sendBtn.classList.add('is-stopping');
        } else {
            sendBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
            sendBtn.classList.remove('is-stopping');
        }
    }

    // ========== AI: Execute Actions from Chat ==========
    async function executeAiActions(actions) {
        let count = 0;
        // Make sure it's an array to avoid TypeError: actions is not iterable
        const acts = Array.isArray(actions) ? actions : [actions];
        
        for (const action of acts) {
            try {
                switch (action.cmd) {
                    case 'add_task':
                        if (action.data && action.data.title) {
                            addTodo({
                                title: action.data.title,
                                category: action.data.category || 'personal',
                                priority: action.data.priority || 'medium',
                                dueDate: action.data.dueDate || null,
                                description: action.data.description || '',
                            });
                            count++;
                        }
                        break;
                    case 'delete_task':
                        if (action.data && action.data.id) {
                            const idx = todos.findIndex(t => t.id === action.data.id);
                            if (idx !== -1) {
                                todos.splice(idx, 1);
                                save();
                                render();
                                count++;
                            }
                        }
                        break;
                    case 'toggle_task':
                        if (action.data && action.data.id) {
                            toggleTodo(action.data.id);
                            count++;
                        }
                        break;
                    case 'clear_completed':
                        clearCompleted();
                        count++;
                        break;
                    case 'search_tasks':
                        if (action.data && action.data.query) {
                            searchInput.value = action.data.query;
                            searchQuery = action.data.query.toLowerCase().trim();
                            render();
                            count++;
                        }
                        break;
                    default:
                        console.warn('Unknown AI action:', action.cmd);
                }
            } catch (err) {
                console.error('Failed to execute AI action:', action, err);
            }
        }
        return count;
    }

    // ========== AI: Thinking Indicator ==========
    function showThinking() {
        const div = document.createElement('div');
        div.className = 'ai-msg ai-msg--assistant ai-thinking-indicator';
        div.innerHTML = `
            <div class="ai-thinking-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        aiChatMessages.appendChild(div);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        return div;
    }

    async function handleChatSend(e) {
        e.preventDefault();
        
        // If already generating, clicking Send (now Stop) should abort
        if (currentChatController) {
            currentChatController.abort();
            return;
        }

        const msg = aiChatInput.value.trim();
        if (!msg) return;

        // Add user message
        appendChatMsg('user', msg);
        chatHistory.push({ role: 'user', content: msg });
        aiChatInput.value = '';

        await processAssistantResponse(msg);
    }

    async function processAssistantResponse(userMsg) {
        if (isAiChatting) return;
        isAiChatting = true;

        const sendBtn = document.getElementById('ai-chat-send');
        const originalBtnHTML = sendBtn.innerHTML;
        sendBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>`;
        sendBtn.classList.add('is-stopping');
        
        currentChatController = new AbortController();
        const signal = currentChatController.signal;

        const { msgDiv, contentDiv } = createEmptyAssistantMsg();
        let fullReply = '';

        try {
            const ctx = TaskFlowAI.buildTaskContext(todos);
            
            let lastRenderTime = 0;
            fullReply = await TaskFlowAI.chatWithAI(userMsg, ctx, chatHistory, {
                signal,
                stream: true,
                onChunk: (chunk, currentFullText) => {
                    const now = Date.now();
                    // Throttle synchronous markdown parsing to max 15 FPS to prevent GPU/Browser composite thread lockups
                    if (now - lastRenderTime > 65) {
                        const cleanFull = currentFullText.replace(/\[ACTIONS:.*$/s, '');
                        contentDiv.innerHTML = renderMarkdown(cleanFull) || '<span class="typing-cursor"></span>';
                        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
                        lastRenderTime = now;
                    }
                }
            });

            let actionsTaken = 0;
            const actionResult = extractAiActionsFromReply(fullReply);
            fullReply = actionResult.cleanText;
            if (actionResult.actions.length > 0) {
                actionsTaken = await executeAiActions(actionResult.actions);
            }

            contentDiv.innerHTML = renderMarkdown(fullReply);
            if (actionsTaken > 0) {
                contentDiv.innerHTML += `<div style="font-size: 0.8rem; color: var(--pri-low); margin-top: 8px;">✨ Executed ${actionsTaken} task action(s).</div>`;
            }
            aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        } catch (err) {
            if (err.name !== 'AbortError') {
                contentDiv.innerHTML = renderMarkdown('Sorry, I encountered an error: ' + err.message);
            } else {
                contentDiv.innerHTML = renderMarkdown(fullReply || '') + '<br><br><em>[Stopped]</em>';
                fullReply += '\n\n[Stopped]';
            }
        } finally {
            currentChatController = null;
            isAiChatting = false;
            sendBtn.innerHTML = originalBtnHTML;
            sendBtn.classList.remove('is-stopping');
            chatHistory.push({ role: 'assistant', content: fullReply });
            saveChatHistory();
            appendMessageActions(msgDiv, fullReply);
        }
    }

    function createEmptyAssistantMsg() {
        // This function is now largely replaced by the new appendChatMsg logic for streaming
        // Keeping it for potential other uses or if appendChatMsg needs to be reverted.
        const div = document.createElement('div');
        div.className = `ai-msg ai-msg--assistant streaming`;
        
        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-msg-content';
        
        // Initial thinking indicator
        contentDiv.innerHTML = '<span class="typing-cursor"></span>';
        
        bubble.appendChild(contentDiv);
        div.appendChild(bubble);
        aiChatMessages.appendChild(div);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        
        return { msgDiv: div, contentDiv };
    }

    function appendChatMsg(role, content, id = null) {
        const div = document.createElement('div');
        div.className = `ai-msg ai-msg--${role}`;
        if (id) div.id = id;
        
        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-msg-content';
        contentDiv.innerHTML = role === 'assistant' ? (content ? renderMarkdown(content) : '<span class="typing-cursor"></span>') : escapeHTML(content);
        
        bubble.appendChild(contentDiv);
        div.appendChild(bubble);
        aiChatMessages.appendChild(div);
        
        if (role === 'assistant' && content) { // Only add actions if content is not empty (i.e., not a streaming placeholder)
            appendMessageActions(div, content);
        }
        
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        return div; // Return the message div for streaming updates
    }

    function appendMessageActions(msgDiv, content) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ai-msg-actions';
        
        // Copy Button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'ai-action-btn';
        copyBtn.title = 'Copy';
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(content);
            copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => {
                copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
            }, 2000);
        };
        actionsDiv.appendChild(copyBtn);

        // Check if this is the very last assistant message for Regenerate
        if (msgDiv === aiChatMessages.lastChild) {
            const regenBtn = document.createElement('button');
            regenBtn.className = 'ai-action-btn';
            regenBtn.title = 'Regenerate';
            regenBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>`;
            regenBtn.onclick = () => {
                if (isAiChatting) return;
                // Remove last two messages from history (assistant + preceding user message)
                chatHistory.pop(); // Remove assistant
                const lastUser = chatHistory.pop(); // Remove user
                
                // Remove from DOM
                aiChatMessages.removeChild(msgDiv); // Assistant bubble
                aiChatMessages.removeChild(aiChatMessages.lastChild); // User bubble
                
                // Trigger again
                appendChatMsg('user', lastUser.content);
                chatHistory.push(lastUser);
                processAssistantResponse(lastUser.content);
            };
            actionsDiv.appendChild(regenBtn);
        }

        const bubble = msgDiv.querySelector('.ai-msg-bubble');
        bubble.appendChild(actionsDiv);
    }

    function formatAIResponse(text) {
        // This function is now largely replaced by `marked.parse`
        if (!text) return '';
        // Basic markdown styling and bullet points
        let formatted = escapeHTML(text)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n- /g, '<br>• ')
            .replace(/\n\* /g, '<br>• ')
            .replace(/\n(\d+)\. /g, '<br><strong>$1.</strong> ')
            .replace(/\n/g, '<br>');
        return formatted;
    }

    function saveChatHistory() {
        // Keep last 20 messages
        const trimmed = chatHistory.slice(-20);
        localStorage.setItem('taskflow_chat', JSON.stringify(trimmed));
    }

    function extractAiActionsFromReply(text) {
        const actionRegex = /\[ACTIONS:\s*(\[.*?\])\s*\]/s;
        const cleanText = String(text || '').replace(actionRegex, '').trim();
        const match = String(text || '').match(actionRegex);

        if (!match || !match[1]) {
            return { cleanText, actions: [] };
        }

        try {
            const cleanedJSON = match[1].replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const actions = JSON.parse(cleanedJSON);
            return {
                cleanText,
                actions: Array.isArray(actions) ? actions : [actions]
            };
        } catch (parseErr) {
            console.error('Failed to parse AI actions:', parseErr);
            return { cleanText, actions: [] };
        }
    }

    // ========== AI: Suggestion Chips ==========
    async function handleAiChip(action, chip) {
        if (isAiChatting || chip.classList.contains('loading')) return;
        
        isAiChatting = true;
        chip.classList.add('loading');
        const thinkingEl = showThinking();
        currentChatController = new AbortController();
        toggleAiSendBtn(true); // Allow stopping the chip tasks!

        try {
            const ctx = getTaskContext();
            let userMsg = chip.textContent.trim(); // Use chip text as user message
            
            // Open chat panel to show response
            openChatPanel();

            // Show user message
            appendChatMsg('user', userMsg);
            chatHistory.push({ role: 'user', content: userMsg });

            let reply;

            if (action === 'plan-day') {
                reply = await TaskFlowAI.suggestDailyPlan(ctx, { signal: currentChatController.signal });
            } else if (action === 'suggest-tasks') {
                try {
                    const suggestions = await TaskFlowAI.suggestTasks(ctx, { signal: currentChatController.signal });
                    if (Array.isArray(suggestions) && suggestions.length > 0) {
                        reply = '✨ Here are some suggested tasks:\n\n' + suggestions.map((s, i) =>
                            `${i + 1}. **${s.title}** (${capitalize(s.category || 'personal')}, ${capitalize(s.priority || 'medium')})`
                        ).join('\n');

                        // Add suggestions to the list
                        thinkingEl.remove();
                        appendChatMsg('assistant', reply + '\n\nI\'ve added these as suggestions. You can accept them from the task list!');
                        chatHistory.push({ role: 'assistant', content: reply });
                        saveChatHistory();

                        // Actually add them
                        suggestions.forEach(s => {
                            addTodo({
                                title: s.title,
                                category: s.category || 'personal',
                                priority: s.priority || 'medium',
                                description: '✨ AI Suggested',
                            });
                        });

                        return; // Exit early as tasks are handled
                    }
                } catch (err) {
                    console.warn('Failed to get structured task suggestions, falling back to chat:', err);
                    // Fall through to regular chat if structured suggestions fail
                }
                reply = await TaskFlowAI.chatWithAI(userMsg, ctx, chatHistory, { signal: currentChatController.signal });
            } else if (action === 'weekly-review') {
                reply = await TaskFlowAI.chatWithAI(userMsg, ctx, chatHistory, { signal: currentChatController.signal });
            } else if (action === 'prioritize') {
                reply = await TaskFlowAI.chatWithAI(userMsg, ctx, chatHistory, { signal: currentChatController.signal });
            } else {
                // Default fallback for unknown actions or if specific handlers don't produce a reply
                reply = await TaskFlowAI.chatWithAI(userMsg, ctx, chatHistory, { signal: currentChatController.signal });
            }

            const actionResult = extractAiActionsFromReply(reply);
            reply = actionResult.cleanText || reply;
            if (actionResult.actions.length > 0) {
                await executeAiActions(actionResult.actions);
            }

            thinkingEl.remove();
            appendChatMsg('assistant', reply);
            chatHistory.push({ role: 'assistant', content: reply });
            saveChatHistory();
        } catch (err) {
            thinkingEl.remove();
            if (err.name !== 'AbortError') appendChatMsg('assistant', '⚠️ ' + err.message);
        } finally {
            chip.classList.remove('loading');
            isAiChatting = false;
            currentChatController = null;
            toggleAiSendBtn(false);
        }
    }

    // ========== Drag and Drop ==========
    function enableDragAndDrop() {
        const items = todoList.querySelectorAll('.todo-item');
        items.forEach(item => {
            item.setAttribute('draggable', 'true');
            item.addEventListener('dragstart', (e) => {
                draggedItem = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedItem = null;
                const newOrder = [];
                todoList.querySelectorAll('.todo-item').forEach(el => {
                    const todo = todos.find(t => t.id === el.dataset.id);
                    if (todo) newOrder.push(todo);
                });
                todos.forEach(t => {
                    if (!newOrder.find(n => n.id === t.id)) newOrder.push(t);
                });
                todos = newOrder;
                save();
            });
            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                const afterElement = getDragAfterElement(todoList, e.clientY);
                if (afterElement == null) todoList.appendChild(draggedItem);
                else todoList.insertBefore(draggedItem, afterElement);
            });
        });
    }

    function getDragAfterElement(container, y) {
        const elements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset, element: child };
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // ========== Filtering & Sorting ==========
    function getFilteredTodos() {
        const today = getTodayStr();
        let filtered = [...todos];

        if (currentView === 'completed') filtered = filtered.filter(t => t.completed);
        else if (currentView === 'today') filtered = filtered.filter(t => t.dueDate === today && !t.completed);
        else if (currentView === 'upcoming') filtered = filtered.filter(t => t.dueDate && t.dueDate > today && !t.completed);
        else if (currentView === 'smart') {
            const hour = new Date().getHours();
            const activeTodos = filtered.filter(t => !t.completed);
            if (hour < 12) {
                filtered = activeTodos.filter(t => t.priority === 'high' || t.category === 'work').slice(0, 3);
                viewTitle.textContent = 'Smart Folder: Focus';
            } else if (hour > 18) {
                filtered = activeTodos.filter(t => t.category === 'health' || t.category === 'personal').slice(0, 5);
                viewTitle.textContent = 'Smart Folder: Wind Down';
            } else {
                filtered = activeTodos.filter(t => t.priority !== 'low');
                viewTitle.textContent = 'Smart Folder: Priority';
            }

            if (filtered.length === 0) {
                filtered = activeTodos;
            }
        }

        if (currentCategory) filtered = filtered.filter(t => t.category === currentCategory);

        if (searchQuery) {
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(searchQuery) ||
                (t.description && t.description.toLowerCase().includes(searchQuery))
            );
        }

        const priorityOrder = { high: 0, medium: 1, low: 2 };
        switch (sortMode) {
            case 'oldest': filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
            case 'priority': filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]); break;
            case 'dueDate': filtered.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            }); break;
            case 'alpha': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
            default: filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return filtered;
    }

    // ========== Rendering ==========
    function render() {
        const filtered = getFilteredTodos();
        todoList.innerHTML = '';
        const fragment = document.createDocumentFragment();

        filtered.forEach((todo, i) => {
            const li = document.createElement('li');
            li.className = `todo-item priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            li.style.animationDelay = `${i * 0.04}s`;

            const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < getTodayStr();
            const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;

            let subtasksHTML = '';
            if (hasSubtasks) {
                const stItems = todo.subtasks.map((st, idx) => `
                    <div class="subtask-item ${st.completed ? 'completed' : ''}">
                        <input type="checkbox" class="subtask-checkbox" data-stindex="${idx}" ${st.completed ? 'checked' : ''}>
                        <span class="subtask-text">${escapeHTML(st.title)}</span>
                    </div>
                `).join('');
                subtasksHTML = `<div class="subtask-list">${stItems}</div>`;
            }

            li.innerHTML = `
                <label class="checkbox-container" aria-label="Toggle task">
                    <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <div class="checkmark"></div>
                </label>
                <div class="todo-content">
                    <div class="todo-title" contenteditable="true" spellcheck="false" role="textbox">${escapeHTML(todo.title)}</div>
                    ${todo.description ? `<div class="todo-desc">${escapeHTML(todo.description)}</div>` : ''}
                    <div class="todo-meta">
                        <span class="meta-tag meta-tag--category" data-cat="${todo.category}">${capitalize(todo.category)}</span>
                        <span class="meta-tag meta-tag--priority" data-pri="${todo.priority}">${capitalize(todo.priority)}</span>
                        ${todo.dueDate ? `<span class="meta-tag meta-tag--due ${isOverdue ? 'overdue' : ''}">${formatDate(todo.dueDate)}${isOverdue ? ' · Overdue' : ''}</span>` : ''}
                        ${todo.id === activePomodoroId ? `<span class="meta-tag meta-tag--pomodoro" id="pomodoro-display-${todo.id}">⏱️ ${Math.floor(pomodoroTimeLeft / 60).toString().padStart(2, '0')}:${(Math.floor(pomodoroTimeLeft % 60)).toString().padStart(2, '0')}</span>` : ''}
                    </div>
                    ${subtasksHTML}
                </div>
                <div class="todo-actions">
                    ${!todo.completed ? `
                    <button class="action-btn pomodoro-btn ${todo.id === activePomodoroId ? 'active' : ''}" aria-label="Start Pomodoro" title="Focus Timer">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </button>` : ''}
                    ${!hasSubtasks && !todo.completed ? `
                    <button class="action-btn success ai-btn" aria-label="AI breakdown" title="AI: Break into subtasks">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    </button>` : ''}
                    <button class="action-btn danger delete-btn" aria-label="Delete task">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
            fragment.appendChild(li);
        });

        todoList.appendChild(fragment);

        emptyState.classList.toggle('visible', filtered.length === 0);
        taskCountEl.textContent = `${filtered.length} task${filtered.length !== 1 ? 's' : ''}`;
        enableDragAndDrop();
        updateStats();
        updateBadges();
        
        // Sync new features
        if (typeof renderKanban === 'function') renderKanban();
        if (typeof updateWisp === 'function') updateWisp();
    }

    // ========== Stats ==========
    function updateStats() {
        const total = todos.length;
        const done = todos.filter(t => t.completed).length;
        const pending = total - done;
        const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < getTodayStr()).length;

        animateNumber(statTotal, total);
        animateNumber(statDone, done);
        animateNumber(statPending, pending);
        animateNumber(statOverdue, overdue);
    }

    function animateNumber(el, target) {
        const current = parseInt(el.textContent) || 0;
        if (current === target) return;
        el.textContent = target;
        el.style.transform = 'scale(1.2)';
        el.style.transition = 'transform 0.2s ease';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }

    // ========== Badges ==========
    function updateBadges() {
        const today = getTodayStr();
        const active = todos.filter(t => !t.completed);

        badgeAll.textContent = todos.length;
        badgeToday.textContent = active.filter(t => t.dueDate === today).length;
        badgeUpcoming.textContent = active.filter(t => t.dueDate && t.dueDate > today).length;
        badgeCompleted.textContent = todos.filter(t => t.completed).length;

        badgePersonal.textContent = active.filter(t => t.category === 'personal').length;
        badgeWork.textContent = active.filter(t => t.category === 'work').length;
        badgeShopping.textContent = active.filter(t => t.category === 'shopping').length;
        badgeHealth.textContent = active.filter(t => t.category === 'health').length;
    }

    // ========== Persistence ==========
    function save() {
        localStorage.setItem('taskflow_todos', JSON.stringify(todos));
        localStorage.setItem('taskflow_xp', userXp.toString());
    }

    // ========== Gamification ==========
    function addXP(amount) {
        userXp = Math.max(0, userXp + amount);
        save();
        updateGamificationUI();
    }

    function updateGamificationUI() {
        if (!levelBadge) return;
        const level = Math.floor(userXp / 100) + 1;
        const currentLevelXp = userXp % 100;
        
        levelBadge.textContent = 'Lvl ' + level;
        xpText.textContent = `${currentLevelXp} / 100 XP`;
        xpBarFill.style.width = `${currentLevelXp}%`;

        // RPG Rank titles
        const rankTitle = document.getElementById('user-rank-title');
        if (rankTitle) {
            const ranks = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master', 'Grandmaster', 'Legend'];
            // Upgrade rank every 3 levels
            const rankIndex = Math.min(Math.floor((level - 1) / 3), ranks.length - 1);
            rankTitle.textContent = ranks[rankIndex];
        }

        if (typeof updateWisp === 'function') updateWisp();
    }

    // ========== Data Management ==========
    function exportData() {
        const data = { todos, chatHistory, userXp, theme };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
        const anchor = document.createElement('a');
        anchor.setAttribute('href', dataStr);
        anchor.setAttribute('download', `taskflow_backup_${getTodayStr()}.json`);
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }

    function importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.todos) todos = data.todos.map(normalizeTodoRecord);
                if (data.chatHistory) {
                    chatHistory = data.chatHistory;
                    saveChatHistory();
                }
                if (data.userXp !== undefined) userXp = data.userXp;
                if (data.theme) {
                    theme = data.theme;
                    applyTheme(theme);
                }
                save();
                updateGamificationUI();
                render();
                alert('Data successfully imported!');
            } catch (err) {
                alert('Failed to import data: Invalid file format.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // ========== ZEN FLOW MODE ==========
    function getNextZenTask() {
        const pending = todos.filter(t => !t.completed);
        if (pending.length === 0) return null;

        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const today = getTodayStr();

        // Score tasks: overdue > high priority > due today > medium > low
        const scored = pending.map(t => {
            let score = 0;
            if (t.dueDate && t.dueDate < today) score += 100; // Overdue
            if (t.dueDate === today) score += 50; // Due today
            score += (2 - priorityOrder[t.priority || 'medium']) * 20; // Priority weight
            return { task: t, score };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored[0].task;
    }

    function openZenFlow() {
        const task = getNextZenTask();
        if (!task) {
            alert('No pending tasks! Add some tasks first.');
            return;
        }

        zenCurrentTask = task;
        zenTaskTitle.textContent = task.title;
        zenTaskMeta.innerHTML = `
            <span class="meta-tag meta-tag--category" data-cat="${task.category}">${capitalize(task.category)}</span>
            <span class="meta-tag meta-tag--priority" data-pri="${task.priority}">${capitalize(task.priority)}</span>
            ${task.dueDate ? `<span class="meta-tag meta-tag--due">${formatDate(task.dueDate)}</span>` : ''}
        `;

        zenTimeLeft = 25 * 60;
        zenTimerRunning = false;
        updateZenTimerDisplay();
        zenTimerBar.style.width = '100%';
        zenStartBtn.textContent = 'Start Focus';
        zenQuote.textContent = ZEN_QUOTES[Math.floor(Math.random() * ZEN_QUOTES.length)];

        zenOverlay.classList.add('open');
        closeMobileSidebar();
    }

    function closeZenFlow() {
        zenOverlay.classList.remove('open');
        if (zenTimerInterval) {
            clearInterval(zenTimerInterval);
            zenTimerInterval = null;
        }
        zenTimerRunning = false;
    }

    function toggleZenTimer() {
        if (zenTimerRunning) {
            // Pause
            clearInterval(zenTimerInterval);
            zenTimerInterval = null;
            zenTimerRunning = false;
            zenStartBtn.textContent = 'Resume';
        } else {
            // Start
            zenTimerRunning = true;
            zenStartBtn.textContent = 'Pause';
            ensureNotificationPermission();
            zenTimerInterval = setInterval(() => {
                zenTimeLeft--;
                if (zenTimeLeft <= 0) {
                    clearInterval(zenTimerInterval);
                    zenTimerInterval = null;
                    zenTimerRunning = false;
                    zenStartBtn.textContent = 'Start Focus';
                    zenTimeLeft = 0;
                    updateZenTimerDisplay();

                    // Notify
                    if ('Notification' in window && Notification.permission === 'granted') {
                        new Notification('\ud83c\udf45 Focus Session Complete!', { body: `Great job focusing on: ${zenCurrentTask.title}` });
                    }
                    zenQuote.textContent = '\ud83c\udf89 Time\'s up! Take a 5-minute break, then come back.';
                    addXP(15);
                    return;
                }
                updateZenTimerDisplay();
            }, 1000);
        }
    }

    function updateZenTimerDisplay() {
        const m = Math.floor(zenTimeLeft / 60).toString().padStart(2, '0');
        const s = (zenTimeLeft % 60).toString().padStart(2, '0');
        zenTimerDisplay.textContent = `${m}:${s}`;
        const pct = (zenTimeLeft / (25 * 60)) * 100;
        zenTimerBar.style.width = `${pct}%`;
    }

    function zenSkipTask() {
        closeZenFlow();
        // Move current task to the end of priority queue
        if (zenCurrentTask) {
            const idx = todos.findIndex(t => t.id === zenCurrentTask.id);
            if (idx !== -1) {
                const t = todos.splice(idx, 1)[0];
                todos.push(t);
                save();
            }
        }
        // Reopen with next task
        setTimeout(openZenFlow, 300);
    }

    function zenMarkComplete() {
        if (zenCurrentTask) {
            toggleTodo(zenCurrentTask.id);
            addXP(10);
        }
        closeZenFlow();
        // Check if more tasks
        const next = getNextZenTask();
        if (next) {
            setTimeout(openZenFlow, 500);
        }
    }

    // ========== AI SCHEDULER ==========
    function openScheduler() {
        const today = new Date();
        if (scheduleDateEl) {
            scheduleDateEl.textContent = today.toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
            });
        }
        scheduleOverlay.classList.add('open');
        closeMobileSidebar();
    }

    function closeScheduler() {
        scheduleOverlay.classList.remove('open');
    }

    async function generateAISchedule() {
        const pending = todos.filter(t => !t.completed);
        if (pending.length === 0) {
            scheduleTimeline.innerHTML = '<div class="schedule-empty"><p>No pending tasks to schedule. Add some tasks first!</p></div>';
            return;
        }

        // Show loading
        scheduleTimeline.innerHTML = `
            <div class="schedule-loading">
                <p>\u2728 AI is creating your perfect schedule...</p>
                <div class="ai-thinking-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        scheduleGenBtn.disabled = true;
        scheduleGenBtn.textContent = 'Generating...';

        try {
            const ctx = TaskFlowAI.buildTaskContext(pending);
            const blocks = await TaskFlowAI.generateSchedule(ctx);

            if (!blocks || blocks.length === 0) {
                scheduleTimeline.innerHTML = '<div class="schedule-empty"><p>AI couldn\'t generate a schedule. Try again.</p></div>';
                return;
            }

            scheduleTimeline.innerHTML = '';
            blocks.forEach((block, i) => {
                const div = document.createElement('div');
                div.className = 'schedule-block';
                div.dataset.pri = block.priority;
                div.style.animationDelay = `${i * 0.08}s`;

                const isBreak = block.category === 'break' || block.title.toLowerCase().includes('break') || block.title.toLowerCase().includes('lunch');

                div.innerHTML = `
                    <div class="schedule-time">
                        ${escapeHTML(block.time)}
                        ${block.endTime ? `<br><span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 400;">to ${escapeHTML(block.endTime)}</span>` : ''}
                    </div>
                    <div class="schedule-block-content">
                        <div class="schedule-block-title">${isBreak ? '\u2615' : '\ud83d\udccc'} ${escapeHTML(block.title)}</div>
                        <div class="schedule-block-detail">
                            <span class="schedule-duration">${escapeHTML(block.duration)}</span>
                            ${!isBreak ? `<span class="meta-tag meta-tag--category" data-cat="${block.category}">${capitalize(block.category)}</span>` : ''}
                            ${block.notes ? `<span style="color: var(--text-muted);">${escapeHTML(block.notes)}</span>` : ''}
                        </div>
                    </div>
                `;
                scheduleTimeline.appendChild(div);
            });
        } catch (err) {
            scheduleTimeline.innerHTML = `<div class="schedule-empty"><p>\u26a0\ufe0f ${escapeHTML(err.message)}</p></div>`;
        } finally {
            scheduleGenBtn.disabled = false;
            scheduleGenBtn.textContent = '\u2728 Generate Schedule';
        }
    }

    // ========== Helpers ==========
    function getTodayStr() {
        return new Date().toISOString().split('T')[0];
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderMarkdown(text) {
        const safeText = String(text || '');
        if (!(window.marked && typeof marked.parse === 'function')) {
            return escapeHTML(safeText).replace(/\n/g, '<br>');
        }
        return marked.parse(escapeHTML(safeText));
    }

    // ========== FOCUS WISP COMPANION ==========
    function calculateWispMood() {
        const total = todos.length;
        if (total === 0) return 'sleepy';

        const completed = todos.filter(t => t.completed).length;
        const today = getTodayStr();
        const overdue = todos.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;
        const completionRate = total > 0 ? completed / total : 0;

        if (overdue >= 3) return 'worried';
        if (completionRate >= 0.8) return 'excited';
        if (completionRate >= 0.5) return 'happy';
        if (completionRate >= 0.2) return 'calm';
        if (overdue > 0) return 'worried';
        return 'sleepy';
    }

    function updateWisp() {
        if (!wispContainer) return;
        const mood = calculateWispMood();
        wispContainer.dataset.mood = mood;
        if (wispMoodEl) wispMoodEl.textContent = capitalize(mood);
    }

    function showWispSpeech() {
        if (!wispSpeechEl) return;
        const mood = wispContainer.dataset.mood || 'calm';
        const speeches = WISP_SPEECHES[mood] || WISP_SPEECHES.calm;
        const msg = speeches[Math.floor(Math.random() * speeches.length)];
        wispSpeechEl.textContent = msg;
        wispSpeechEl.classList.add('show');
        clearTimeout(wispSpeechEl._timeout);
        wispSpeechEl._timeout = setTimeout(() => {
            wispSpeechEl.classList.remove('show');
        }, 4000);
    }

    // ========== KANBAN VIEW ==========
    function toggleViewMode() {
        currentViewMode = currentViewMode === 'list' ? 'kanban' : 'list';
        if (currentViewMode === 'kanban') {
            listView.style.display = 'none';
            kanbanView.style.display = 'grid';
            viewToggleBtn.classList.add('active');
            viewToggleBtn.title = 'Switch to List view';
            renderKanban();
        } else {
            kanbanView.style.display = 'none';
            listView.style.display = '';
            viewToggleBtn.classList.remove('active');
            viewToggleBtn.title = 'Switch to Kanban view';
        }
    }

    function renderKanban() {
        if (currentViewMode !== 'kanban') return;
        const filteredTasks = getFilteredTodos();
        const todoTasks = filteredTasks.filter(t => !t.completed && !t.inProgress);
        const progressTasks = filteredTasks.filter(t => !t.completed && t.inProgress);
        const doneTasks = filteredTasks.filter(t => t.completed);

        kanbanTodo.innerHTML = '';
        kanbanProgress.innerHTML = '';
        kanbanDone.innerHTML = '';

        const countTodo = document.getElementById('kanban-count-todo');
        const countProg = document.getElementById('kanban-count-progress');
        const countDone = document.getElementById('kanban-count-done');
        if (countTodo) countTodo.textContent = todoTasks.length;
        if (countProg) countProg.textContent = progressTasks.length;
        if (countDone) countDone.textContent = doneTasks.length;

        const renderCards = (tasks, container) => {
            tasks.forEach(t => {
                const card = document.createElement('div');
                card.className = 'kanban-card';
                card.dataset.id = t.id;
                card.dataset.pri = t.priority;
                card.draggable = true;
                card.innerHTML = `
                    <div class="kanban-card-title">${escapeHTML(t.title)}</div>
                    <div class="kanban-card-meta">
                        <span class="meta-tag meta-tag--category" data-cat="${t.category}">${capitalize(t.category)}</span>
                        <span class="meta-tag meta-tag--priority" data-pri="${t.priority}">${capitalize(t.priority)}</span>
                        ${t.dueDate ? `<span class="meta-tag meta-tag--due">${formatDate(t.dueDate)}</span>` : ''}
                    </div>
                `;

                card.addEventListener('dragstart', (e) => {
                    card.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', t.id);
                    e.dataTransfer.effectAllowed = 'move';
                });
                card.addEventListener('dragend', () => card.classList.remove('dragging'));
                container.appendChild(card);
            });
        };

        renderCards(todoTasks, kanbanTodo);
        renderCards(progressTasks, kanbanProgress);
        renderCards(doneTasks, kanbanDone);

        bindKanbanDropzones();
    }

    function bindKanbanDropzones() {
        if (kanbanDropzonesBound) return;
        [kanbanTodo, kanbanProgress, kanbanDone].forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.closest('.kanban-column').classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.closest('.kanban-column').classList.remove('drag-over');
            });
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.closest('.kanban-column').classList.remove('drag-over');
                const taskId = e.dataTransfer.getData('text/plain');
                const status = zone.closest('.kanban-column').dataset.status;
                moveTaskToStatus(taskId, status);
            });
        });
        kanbanDropzonesBound = true;
    }

    function moveTaskToStatus(taskId, status) {
        todos = todos.map(t => {
            if (t.id === taskId) {
                if (status === 'done') return { ...t, completed: true, completedAt: new Date().toISOString(), inProgress: false };
                if (status === 'progress') return { ...t, completed: false, completedAt: null, inProgress: true };
                return { ...t, completed: false, completedAt: null, inProgress: false };
            }
            return t;
        });
        save();
        render();
    }

    // ========== OMNIBAR (COMMAND PALETTE) ==========
    const omnibarOverlay = document.getElementById('omnibar-overlay');
    const omnibarInput = document.getElementById('omnibar-input');
    const omnibarSpinner = document.getElementById('omnibar-spinner');

    function toggleOmnibar() {
        const isOpen = omnibarOverlay.classList.contains('open');
        if (isOpen) {
            omnibarOverlay.classList.remove('open');
            omnibarInput.value = '';
        } else {
            omnibarOverlay.classList.add('open');
            setTimeout(() => omnibarInput.focus(), 100);
        }
    }

    if (omnibarOverlay) {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                toggleOmnibar();
            }
            if (e.key === 'Escape' && omnibarOverlay.classList.contains('open')) {
                toggleOmnibar();
            }
        });

        omnibarOverlay.addEventListener('click', (e) => {
            if (e.target === omnibarOverlay) toggleOmnibar();
        });

        omnibarInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter' && omnibarInput.value.trim()) {
                e.preventDefault();
                const cmd = omnibarInput.value.trim();
                omnibarSpinner.style.display = 'block';
                omnibarInput.disabled = true;

                try {
                    const ctx = TaskFlowAI.buildTaskContext(todos);
                    await TaskFlowAI.chatWithAI(cmd, ctx, [], {
                        onChunk: (chunk, full) => {
                            const match = full.match(/\[ACTIONS:\s*([\s\S]*?)\]/);
                            if (match) {
                                try {
                                    const actions = JSON.parse(match[1].trim());
                                    if (typeof executeAiActions === 'function') {
                                        executeAiActions(actions);
                                    }
                                } catch (e) { } // Ignore partial JSON
                            }
                        }
                    });
                } catch(err) {
                    console.error("Omnibar command failed", err);
                } finally {
                    omnibarSpinner.style.display = 'none';
                    omnibarInput.disabled = false;
                    toggleOmnibar();
                    render();
                }
            }
        });
    }

    // ========== ZEN AUDIO ==========
    const zenAudioSelect = document.getElementById('zen-audio-select');
    const zenAudioElement = document.getElementById('zen-audio-element');
    const zenAudioControls = document.getElementById('zen-audio-controls');
    const zenAudioPlayBtn = document.getElementById('zen-audio-play-btn');
    const zenAudioVol = document.getElementById('zen-audio-volume');
    const zenIconPlay = document.getElementById('zen-icon-play');
    const zenIconPause = document.getElementById('zen-icon-pause');
    
    if (zenAudioSelect && zenAudioElement) {
        zenAudioSelect.addEventListener('change', () => {
            zenAudioElement.pause();
            if (zenAudioSelect.value) {
                zenAudioElement.src = zenAudioSelect.value;
                zenAudioElement.volume = zenAudioVol.value;
                zenAudioElement.play();
                zenAudioControls.style.display = 'flex';
                zenIconPlay.style.display = 'none';
                zenIconPause.style.display = 'block';
            } else {
                zenAudioControls.style.display = 'none';
            }
        });

        if (zenAudioPlayBtn) {
            zenAudioPlayBtn.addEventListener('click', () => {
                if (zenAudioElement.paused) {
                    zenAudioElement.play();
                    zenIconPlay.style.display = 'none';
                    zenIconPause.style.display = 'block';
                } else {
                    zenAudioElement.pause();
                    zenIconPlay.style.display = 'block';
                    zenIconPause.style.display = 'none';
                }
            });
        }

        if (zenAudioVol) {
            zenAudioVol.addEventListener('input', (e) => {
                zenAudioElement.volume = e.target.value;
            });
        }
    }

    // ========== WISP COSMETICS ECONOMY ==========
    if (wispContainer) {
        const wispOrb = document.getElementById('wisp-orb');
        wispContainer.style.cursor = 'pointer';
        wispContainer.setAttribute('title', 'Right-click to buy Wisp Crown (100 XP)');
        wispContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Right click to buy hat
            if (userXp >= 100) {
                if (wispOrb.dataset.hat === 'crown') {
                    wispOrb.dataset.hat = '';
                } else {
                    addXP(-100, 'Purchased Crown!');
                    wispOrb.dataset.hat = 'crown';
                    playDopaminePop();
                    setTimeout(() => alert('Crown equipped! ✨'), 100);
                }
            } else {
                alert('You need 100 XP to unlock the Wisp Crown!');
            }
        });
    }

});
