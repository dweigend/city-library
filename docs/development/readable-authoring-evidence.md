# Readable experiment authoring

This slice makes experiment files easier to read while keeping the model in charge of its state and rules. The UI library now supplies typed field bindings, ordinary setup defaults, flat groups and the presentation helpers that real experiments needed. No second modeling language or model-specific host branch was added.

## What changed

- All 125 UI entries were inspected. Simple fields use setup strings; live controls use field-keyed bindings with explicit model actions. Longer projections sit below the declaration. Legacy arrays remain compatible.
- Taxi Cabs uses five public control groups and headless occupancy/income reporters. Its private mount/DOM patch and host fallback are gone.
- Taxi, Traffic Grid/Goal and Tijuana show their execution flow upfront. Seeded behavior, tick/step distinctions and state ownership were preserved. This is a focused model refactor, not a claim that every model has had a complete readability review.
- Monitor formatting remains presentation-only. Charts can name categories, axes and units, show signed grouped bars and keep labels readable on narrow screens. Scientific colors are preserved.
- Reader documentation starts with the motivation: an open, composable system for investigating city choices and sustainability questions. Run/model-writing paths are separate from API contracts and historical evidence.

## Contracts before implementation

Four Taxi observation scripts were committed in `44efd4c` before `9a4203c`. Five UI author tasks were committed in `b7a972c`; later refreezes corrected browser helpers, asynchronous settling and diagnostic-comment positions without weakening scientific or syntax expectations. Original manifests remain in the example README. The scripts run in the regular check, with compile-only negative contracts checked separately from real-browser interactions.

## Executed checks

The [post-correction full check](authoring-boundary-final-checks/checks.json) passed 583 tests / 150789 expectations, all 224 public scripts, TypeScript/Svelte checks, library build and the actual packed Bun/Node/ambient-free TypeScript consumer. The Svelte production build passed with its existing emitted chunk-size warnings.

Actual Chromium checks covered both adapters' five author tasks, overlap/getter precedence and nine additional chart/error/restart cases each. The fresh Svelte catalog smoke executed 125 setups and 124 valid one-step actions; Tijuana retained its cityscape precondition. Six richer model flows covered typed live edits, restart and switching away from a running instance. A separate styled legacy Lab check exercised Taxi/Wealth, including all 45 Taxi demand fields through scrolling on a narrow viewport.

The browser work found real failures rather than relying on typechecks: reactive error loops, a stale error after restart, tiny chart labels, stale network theme colors and the two later callback-error boundaries. Each has retained evidence and a focused correction. T3 capture dimensions and the configured Playwright MCP sandbox-start failure are recorded; successful exact-size captures used a separate local Chromium context without changing system permissions.

## Independent findings and scope

Gemini 3.8 Flash high and Astra high supplied independent design and implementation feedback. Both fresh targeted source rechecks close the callback-boundary correction `d069be3`; [Astra](authoring-review/astra-boundary-recheck.md) and [Gemini](authoring-review/gemini-boundary-recheck.md) retain the exact scope. Initial findings and responses remain alongside them.

A non-implementing agent opened the actual images and reviewed corrections: [authoring/reference states](authoring-review/independent-visual-review.md), [Svelte callback failures and recovery](authoring-review/callback-boundary-visual-review.md), and [styled legacy production flows](authoring-review/production-legacy-visual-review.md). These are limited visual approvals, not accessibility certification or scientific model validation. The legacy diagnostic error path still allows partial rendering; the Svelte current-state correction does not extend that guarantee to legacy.

## Still separate from this slice

The fixed 200-model scope, per-model scientific/independent acceptance, later-batch ledger reconciliation and the interpretation of direct public domain-procedure access remain open. Further targeted review of long model scripts should use the four refactored models as references, without imposing a line limit or exporting every implementation helper. Main integration requires an agreed delivery scope and explicit user authorization. See PLAN for current tasks and remote CI state.
