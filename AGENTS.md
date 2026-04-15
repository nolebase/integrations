# Nolebase Integrations Agent Guide

Concise but detailed reference for contributors working across the `nolebase/integrations` monorepo. Improve code when you touch it; avoid one-off patterns.

## Tech Stack (by surface)

- **Docs app (`docs/`)**: VitePress 2 (alpha), Vue 3, UnoCSS, TypeScript, Vite.
- **Packages (`packages/*`)**: TypeScript ESM libraries, mostly VitePress plugins, Markdown-It plugins, and Vue UI components.
- **Tooling**: pnpm workspace, Vitest, ESLint (Antfu + UnoCSS presets), unbuild, UnoCSS.
- **Release/maintenance**: changelogithub, bumpp, taze, simple-git-hooks.

## Structure & Responsibilities

- **Root workspace**
  - `package.json`: root scripts for lint/typecheck/build/test across workspace.
  - `pnpm-workspace.yaml`: workspace package globs + shared version catalogs.
  - `uno.config.ts`: shared UnoCSS shortcuts/rules.
  - `vitest.config.ts`: root test discovery.
- **Docs app**
  - `docs/`: documentation site for all integrations and packages.
- **Packages**
  - `packages/integrations`: aggregate integration package.
  - `packages/vitepress-plugin-*`: VitePress plugin family.
  - `packages/markdown-it-*`: Markdown-It plugin family.
  - `packages/ui`, `packages/ui-asciinema`, `packages/ui-rive-canvas`: Vue UI components.
  - `packages/unconfig-vitepress`: VitePress config helpers.
- **Build/CI/Lint**
  - `.github/workflows`: CI pipelines.
  - `eslint.config.ts`: lint and formatting policy.

## Key Path Index (what lives where)

- `docs/`: VitePress docs app and demo content.
- `packages/integrations`: umbrella package for integrations.
- `packages/markdown-it-bi-directional-links`: bi-directional link plugin for Markdown-It.
- `packages/markdown-it-element-transform`: element transform plugin for Markdown-It.
- `packages/markdown-it-unlazy-img`: image optimization/lazy-loading helper plugin for Markdown-It.
- `packages/ui`: shared Vue UI components.
- `packages/ui-asciinema`: Asciinema Vue UI integration.
- `packages/ui-rive-canvas`: Rive Canvas Vue UI integration.
- `packages/unconfig-vitepress`: VitePress-oriented config utilities.
- `packages/vitepress-plugin-breadcrumbs`: breadcrumbs plugin.
- `packages/vitepress-plugin-enhanced-mark`: enhanced mark/highlight plugin.
- `packages/vitepress-plugin-enhanced-readabilities`: readability enhancement plugin.
- `packages/vitepress-plugin-git-changelog`: git changelog integration plugin.
- `packages/vitepress-plugin-graph-view`: graph view plugin.
- `packages/vitepress-plugin-highlight-targeted-heading`: targeted heading highlight plugin.
- `packages/vitepress-plugin-index`: page/content index plugin.
- `packages/vitepress-plugin-inline-link-preview`: inline link preview plugin.
- `packages/vitepress-plugin-meta`: meta extraction plugin.
- `packages/vitepress-plugin-og-image`: OG image generation plugin.
- `packages/vitepress-plugin-page-properties`: page properties plugin.
- `packages/vitepress-plugin-sidebar`: sidebar enhancement plugin.
- `packages/vitepress-plugin-thumbnail-hash`: thumbnail hash plugin.

## Commands (pnpm with filters)

> Use pnpm workspace filters to scope tasks. Replace the filter with a real workspace package name (e.g. `@nolebase/ui`, `@nolebase/vitepress-plugin-meta`, `@nolebase/markdown-it-unlazy-img`).

- **Install**
  - `pnpm install`
- **Typecheck**
  - Root: `pnpm typecheck`
  - Target package: `pnpm -F <package.json name> typecheck`
  - Example: `pnpm -F @nolebase/ui typecheck`
- **Unit tests (Vitest)**
  - Root: `pnpm test:run`
  - Target file: `pnpm exec vitest run <path/to/test-file>`
  - Target package: `pnpm -F <package.json name> exec vitest run`
- **Lint**
  - `pnpm lint`
  - `pnpm lint:fix`
- **Build**
  - Root: `pnpm build`
  - Target package: `pnpm -F <package.json name> build`
  - Example: `pnpm -F @nolebase/vitepress-plugin-meta build`

## Development Practices

- Favor clear module boundaries; shared logic goes in `packages/`.
- Keep runtime entrypoints lean; move heavy logic into services/modules.
- Prefer functional patterns + DI (`injeca`) for testability.
- Use Valibot for schema validation; keep schemas close to their consumers.
- Use Eventa (`@moeru/eventa`) for structured IPC/RPC contracts where needed.
- Use `errorMessageFrom(error)` from `@moeru/std` to extract error messages instead of manual patterns like `error instanceof Error ? error.message : String(error)`. Pair with `?? 'fallback'` when a default is needed.
- Do not add backward-compatibility guards. If extended support is required, write refactor docs and spin up another Codex or Claude Code instance via shell command to complete the implementation with clear instructions and the expected post-refactor shape.
- If the refactor scope is small, do a progressive refactor step by step.
- When modifying code, always check for opportunities to do small, minimal progressive refactors alongside the change.

## Styling & Components

- Prefer Vue v-bind class arrays for readability when working with UnoCSS & tailwindcss: do `:class="['px-2 py-1','flex items-center','bg-white/50 dark:bg-black/50']"`, don't do `class="px-2 py-1 flex items-center bg-white/50 dark:bg-black/50"`, don't do `px="2" py="1" flex="~ items-center" bg="white/50 dark:black/50"`; avoid long inline `class=""`. Refactor legacy when you touch it.
- Use/extend UnoCSS shortcuts/rules in `uno.config.ts`; add new shortcuts/rules/plugins there when standardizing styles. Prefer UnoCSS over Tailwind.
- Build primitives on `@proj-airi/ui` (reka-ui) instead of raw DOM; see [`docs/ai/context/ui-components.md`](docs/ai/context/ui-components.md) for the full component API reference and `packages/ui/src/components/Form` for implementation patterns.
- **When adding or updating components in `packages/ui`**, update [`docs/ai/context/ui-components.md`](docs/ai/context/ui-components.md) to reflect the change (props, slots, emits, description).
- Use Iconify icon sets; avoid bespoke SVGs.
- Animations: keep intuitive, lively, and readable.
- `useDark` (VueUse): set `disableTransition: false` or use existing composables in `packages/ui`.

## Testing Practices

- Vitest per project; keep runs targeted for speed.
- For any investigated bug or issue, try to reproduce it first with a test-only reproduction before changing production code. Prefer a unit test; if that is not possible, use the smallest higher-level automated test that can still reproduce the problem.
- When an issue reproduction test is possible, include the tracker identifier in the test case name:
  - GitHub issues: include `Issue #<number>`
  - Internal bugs tracked in Linear: include the Linear issue key
- Add the actual report link as a comment directly above the regression test:
  - GitHub issue URL for GitHub reports
  - Discord message or thread URL for IM reports
  - Linear issue URL for internal bugs
- Mock IPC/services with `vi.fn`/`vi.mock`; do not rely on real Electron runtime.
- For external providers/services, add both mock-based tests and integration-style tests (with env guards) when feasible. You can mock imports with Vitest.
- Grow component/e2e coverage progressively (Vitest browser env where possible). Use `expect` and assert mock calls/params.
- When writing tests, prefer line-by-line `expect` or assertion statements.
- Avoid writing tests for impossible runtime states, such as `expect` against constants that never change, or asserting object mutations that can only happen inside the same Vitest case setup.
- Avoid mocking `globalThis` or built-in modules by directly using `Object.defineProperty(...)`. If needed, use `node:worker_threads` to load another worker and simulate that situation, or build a mini CLI to reproduce and verify behavior. For DOM and Web Platform APIs, prefer Vitest browser mode instead of hard-mocking platform internals. If tests already use those patterns, progressively refactor them.

## TypeScript / IPC / Tools

- Keep JSON Schemas provider-compliant (explicit `type: object`, required fields; avoid unbounded records).
- Favor functional patterns + DI (`injeca`); avoid new class hierarchies unless extending browser APIs (classes are harder to mock/test).
- Centralize Eventa contracts; use `@moeru/eventa` for all events.
- When a user asks to use a specific tool or dependency, first check Context7 docs with the search tool, then inspect actual usage of the dependency in this repo.
- If multiple names are returned from Context7 without a clear distinction, ask the user to choose or confirm the desired one.
- If docs conflict with typecheck results, inspect the dependency source under `node_modules` to diagnose root cause and fix types/bugs.

## i18n

- Add/modify translations in each package's local `src/locales` directory (for example, `packages/vitepress-plugin-enhanced-readabilities/src/locales`) and keep locale changes colocated with the owning package.

## CSS/UNO

- Use/extend UnoCSS shortcuts in `uno.config.ts`.
- Prefer grouped class arrays for readability; refactor legacy inline strings when possible.

## Naming & Comments

- File names: kebab-case.
- Avoid classes unless extending runtime/browser APIs; FP + DI is easier to test/mock.
- Add clear, concise comments for utils, math, OS-interaction, algorithm, shared, and architectural functions that explain what the function does.
- When using a workaround, add a `// NOTICE:` comment explaining why, the root cause, and any source context. If validated via `node_modules` inspection or external sources (e.g., GitHub), include relevant line references and links in code-formatted text.
- When moving/refactoring/fixing/updating code, keep existing comments intact and move them with the code. If a comment is truly unnecessary, replace it with a comment stating it previously described X and why it was removed.
- Avoid stubby/hacky scaffolding; prefer small refactors that leave code cleaner.
- Use markers:
  - `// TODO:` follow-ups
  - `// REVIEW:` concerns/needs another eye
  - `// NOTICE:` magic numbers, hacks, important context, external references/links

## PR / Workflow Tips

- Rebase pulls; branch naming `username/feat/short-name`; clear commit messages (gitmoji optional).
- Summarize changes, how tested (commands), and follow-ups.
- Improve legacy you touch; avoid one-off patterns.
- Keep changes scoped; use workspace filters (`pnpm -F <workspace> <script>`).
- Maintain structured `README.md` documentation for each `packages/` and `apps/` entry, covering what it does, how to use it, when to use it, and when not to use it.
- Always run `pnpm typecheck` and `pnpm lint:fix` after finishing a task.
- Use Conventional Commits for commit messages (e.g., `feat: add runner reconnect backoff`).
- For new feature requirements or requirement-related tasks involving `node:*` built-in modules, DOM operations, Vue composables, React hooks, Vite plugins, or GitHub Actions workflows, always do deep research for suitable existing libraries or open source modules first. Before choosing any library, always ask the user to choose and help judge which option is right. Never choose generalized utility libraries on your own (for example, `es-toolkit`, utilities from `github.com/unjs`, or tiny tools from `github.com/tinylib`) without explicit user confirmation. If the user is working spec-driven, list candidate choices in a clear and concise Markdown comparison table.
- Before planning or writing new utilities/functions, always search for existing internal implementations first. If the logic could become shared utilities, proactively propose that shared approach to users and developers.

## TypeScript Coding Regulations

These guidelines apply to all TypeScript code across the monorepo:

- Do not create commits during implementation for this spec.
- For implemented modules, use Vitest whenever possible to verify behavior and passing tests.
- During test implementation, every workaround must include a clear and easy-to-understand `// NOTICE:` comment for reference.
- Use the following workaround comment format whenever a workaround is introduced:
  ```ts
  // NOTICE:
  // Why this workaround is needed.
  // Root cause summary.
  // Source/context (file, issue, URL, or node_modules reference).
  // Removal condition (when it can be safely deleted).
  ```
- Prefer type generics wherever possible. Do not use `any`. Only use `as unknown as <target expected type>` when avoiding it is nearly impossible and the type cannot be fixed safely.
- For every module export (internal or package-level), include clear `/** ... */` JSDoc that explains:
  - What the function does.
  - When to use it.
  - What to expect.
- Use the following JSDoc format for exported functions/classes/types:
  ```ts
  /**
   * One-line summary of behavior.
   *
   * Use when:
   * - Scenario A
   * - Scenario B
   *
   * Expects:
   * - Input assumptions and ordering guarantees
   *
   * Returns:
   * - Output shape and guarantees
   */
  ```
- For functions that include workarounds, include a `NOTICE:` explanation.
- For `describe`, `it`, and all `expect*` usage in tests, include examples by using `@example`.
- For all exported interfaces, especially configurable options, document:
  - What each interface/option does.
  - When to use it.
  - The use cases it is intended for.
  - `@default` for every option that has a default value.
- For all runner, CLI, and high-level orchestrator code (exported or not), `/** ... */` JSDoc is required and must include a clear ASCII call-stack diagram using `{@link ...}` references where applicable.
- Use this call-stack section format in orchestrator/runner/CLI JSDoc:
  ```ts
  /**
   * ...
   *
   * Call stack:
   *
   * collectEvalEntries (../runner)
   *   -> {@link createRunnerSchedule}
   *     -> {@link createMatrixCombinations}
   *       -> {@link VievalScheduledTask}[]
   */
  ```
- Wherever math, OS, exec, process, args, networking, files, or directories are involved, add comments explaining the purpose and why the code is needed.
- Prefer `es-toolkit` first when creating utilities.
- For error handling, prefer `@moeru/std` patterns whenever possible.
- For all normalizers (exported or not) that normalize outputs, formats, filenames, or values (excluding config default normalization), add `/** ... */` with before/after examples.
- Use this normalizer documentation format:
  ```ts
  /**
   * Normalizes <target>.
   *
   * Before:
   * - "ExampleInput"
   *
   * After:
   * - "example-output"
   */
  ```
- Do not move everything into constants. One-time or two-time constants should remain near usage (typically near the top after imports) with clear `/** ... */` explaining why.
- For configurable options with defaults, prefer `@moeru/std` merge functions and define defaults as documented objects when possible, instead of broad standalone constants.
- For retry, backoff, and limit values, do not use one standalone constant to cover everything.
- Avoid hardcoded Unix/macOS/Windows path literals; prefer path-safe array arguments and cross-platform handling.
- For test cases, do not rely on smoke-only tests. Reproduce bugs/failures before patching, then keep comments explaining root cause and fix rationale.
- Use this root-cause block format in regression tests when relevant:
  ```ts
  // ROOT CAUSE:
  //
  // If XXXX, some XXX case happens.
  // This happens because where line ...
  //
  // <before-patch behavior/code>
  //
  // We fixed this by XXX, XXX, XXX.
  // <after-patch behavior/code>
  ```
- Do not split modules into sections using separators like `========`; split into modules instead, except for types/interfaces used nowhere else.
- Do not overuse table-driven style. In many cases, keep table arrays inline and map directly with `.map(...)`.
- Prefer early returns, keep functions simple, and limit nesting to one or two levels.
