# AGENTS.md — OriginOS_web

## 1. Environment

- OS: Windows 11
- Shell: PowerShell 5.1 — no `&&`/`||`, no bash syntax. Use `;` to chain commands.
- Language runtime: Python 3.x via `python` (static file server only), no Node.js, no build step. Vanilla HTML/CSS/JS in browser.
- Serve + verify: `python server.py` (defaults to port 8000, opens browser), or `python server.py 8000`
- No package manager, no lockfile, no dependencies.

Rules:

- Use dedicated file tools (`read`/`edit`/`write`) for file changes. Never hand-roll writes with shell redirects.
- Prefer specialized tools over raw shell where one exists.
- Quote paths with spaces. Keep command output small (`| Select-Object -First 20`).

## 2. Repository Facts

- What this repo is in one line: OriginOS web clone — static browser-based phone/desktop OS simulation (OOSP open source project).
- Entry point: `index.html` (loads `style.css`, `all.js`, `data.js`, plus per-app scripts: `calc.js`, `music.js`, `pass.js`, `loading.js`, `watchstop.js`, `js/`, `phone_sys_toast.js`).
- Layout:
  - `index.html` -> app shell / entry point
  - `css/` -> stylesheets
  - `js/` -> shared JS modules
  - `controls_center/`, `settings_app/`, `templates/` -> OS UI surfaces (control center, settings, templates)
  - `originos_data/` -> static data/assets
  - root `*.js` (`all.js`, `data.js`, `calc.js`, `music.js`, etc.) -> per-app logic loaded by index
  - `server.py` -> zero-dependency static HTTP server for local preview
  - `archive/` -> legacy/frozen code, do not modify unless asked
- Imports / module resolution gotcha: plain `<script>` tags, no bundler, no ESM imports. Load order in `index.html` matters — match existing global-script style.
- Dependencies: zero third-party deps.
- Config / env: none. No `.env`, no secrets.

## 3. Speed Rules

These are deliberate. Follow them without asking.

1. **A trivial request gets a trivial edit.**
   Rename, typo, label, log line, default, doc line: edit the file and report.
   That is the whole task. Do NOT survey the codebase, plan out loud, hunt for
   other occurrences unless asked, refactor anything unasked, or ask for
   confirmation on an easily-reversible change. Stop when done.

2. **Scripts vs edits.**
   Known text replacements → use `edit` (with `replaceAll` when appropriate).
   Use a script only when the result depends on computation over unread input:
   bulk multi-file edits, generated content, data reshaping. Reusable scripts
   belong in `js/`; never leave a throwaway script in the repo root.

3. **One command, not a pipeline.**
   Issue the single command that answers the question. Prefer filtered,
   limited output over full tree dumps or whole-file reads.

4. **Never block on questions.**
   Make the reasonable call, implement it, state the assumption in one line.
   Ask only when the answer would change files expensively to undo.

5. **Batch, then report.**
   Independent tool calls go in one block. No progress narration between them.
   End with a short summary: what changed, in which files, plus anything
   deliberately left alone.

## 4. Verify Before You Claim Done

- **Syntax/smoke check fast:** `python -c "import ast; ast.parse(open('server.py').read())"` for server changes. For JS, open DevTools console after `python server.py` — no test runner exists.
- **Run tests when behavior changed:** no test suite. Verify manually: start server, load `http://localhost:8000`, check console for errors.
- **Never claim success from editing alone.** Read back the edited region after any constrained edit. Report evidence (command + result).
- **Do not launch long-running / blocking things** (dev servers, GUI, watch mode) to "verify" unless the user explicitly asked. `server.py` auto-opens a browser — note that.

## 5. Self-Review: Find the Cons, Then Fix Them (mandatory after every edit)

After implementing a feature or fix and verifying it, do a second pass
*without being asked*:

1. **Adversarial review (brief, in-head):** list the cons of what you just did:
   edge cases, error paths, regressions, null/undefined, global-script
   namespace collisions, script load order, browser compat, accessibility,
   performance of DOM updates.
2. **Fix automatically:** address every load-bearing issue you found (correctness,
   crash, data loss). For minor/polish issues, fix them too if the fix
   is small and safe — do not ask first.
3. **Report honestly:** state hypotheses considered, what you checked, what you
   fixed on the second pass, and anything you deliberately left (with reason).
   If evidence contradicts an earlier claim, say so and trust the evidence.
4. **Scope guard:** do not expand scope beyond the cons of *this* change
   (no drive-by refactors). If you spot a larger architectural problem, note it
   in one line as future work instead of rebuilding it now.

## 6. When These Rules Do Not Apply

If the task is large, architectural, or explicitly asks for tests/build/design,
that overrides the speed rules. Read the relevant files properly first. Speed
means not doing unnecessary work, not doing necessary work badly.
