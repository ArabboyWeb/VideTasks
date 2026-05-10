# Codex Instructions

You are working on Vide Tasks AI, a static web task app. Treat it like a serious product, not a demo.

## Engineering Style

- Act as a senior web app engineer: read existing files before changing behavior, keep edits scoped, and preserve user changes.
- Prefer safe, reversible edits. Do not delete large feature blocks unless the user explicitly asks for removal and the behavior is understood.
- Use `rg` for search and `apply_patch` for manual edits.
- Avoid unrelated refactors. Fix the issue in front of you and leave the codebase cleaner than you found it.

## Product Direction

- The app should feel premium, calm, and minimal.
- Prioritize the core workflow: add tasks, manage tasks, search, filter, sort, and use AI assistance.
- Remove or hide visual noise unless it clearly improves task management.
- Keep the interface dense enough for daily use, with clear hierarchy and no decorative clutter.

## Frontend Standards

- Mobile must be first-class. Check sidebar, modals, chat, task rows, toolbar, and long text at narrow widths.
- Avoid translucent overlays or blur effects that make the UI look washed out.
- Keep text inside controls from overflowing. Use stable dimensions and responsive wrapping.
- Use restrained color, solid surfaces, clean borders, and purposeful spacing.
- Prefer existing HTML/CSS/JS patterns in this repo over introducing build tools or frameworks.

## Safety

- Do not add user-facing personal API key fields. AI access is developer/provider-owned and should move behind a backend or proxy before production.
- Do not break localStorage compatibility for existing task data.
- If a visible feature is removed from the UI, make sure its JS listeners remain harmless or are guarded.
