# Discrete-event integration evidence

This record separates accepted contracts, source evidence, executed target checks and independent review. It does not establish Salabim parity or calibrated city predictions.

## Baseline and authorization

- Worktree: the T3-provided isolated checkout; base `cc6d5c3136c07cda94d5a4449b6e384c435f6ad4`.
- Owned local branch: `feat/salabim-concepts`.
- Implementation, scoped agents, research, independent reviews, tests, refactoring and local commits are authorized. Push, pull requests and merging main are not authorized.
- Initial working tree was clean. README and its approved diagram are preserved.
- Bun 1.4.2 and Node 26.8.2 were inspected. `bun install --frozen-lockfile` passed.
- The root package initially exported no Agenda, process, queue, resource, store or observation recorder. Existing Random includes uniform, normal, exponential and Poisson.

## Preparation

Binding architecture, terminology, coding standards, model/UI authoring references and Git workflow govern this work. The global frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines skills were read.

The requested refactor skills are absent in this checkout, but their exact counterparts were found and read at the original repository's `.agents/skills/refactor-library/SKILL.md` and `.agents/skills/refactor-model-scripts/SKILL.md`, including their shared workflow and decision examples. They were not fabricated or installed here.

Scientific source evidence is recorded independently in [Salabim concepts](../research/salabim-concepts.md). [DES contracts](des-contract.md) owns the additive execution decision and public semantics. [City examples](des-examples.md) owns the exact three focused and seven combined model inventory.

## Acceptance status

The five core scripts were frozen at `1570b64`; five phase-A city pairs at `0ea94f1`, five phase-B pairs at `73a3bf9`. Initial runs failed at missing public exports, without mocks or disabled assertions. Independent native pre-freeze review found two missing Graph node admissions; these were fixed before the model commits. Public syntax and expected results then froze before runtime.

Runtime commits `1a4f004`, `9699aa5` and `e624416` deliver Agenda, ServiceQueue, Resource, Store, Signal, EventTrace, TimeWeighted and explicit Random extensions. Mesa's lifecycle and World attachment (`acaa243`, `69ed507`) were integrated normally, preserving their preceding example history. Later normal merges preserve both tracks' exports, model suites and packed consumers. README and its approved diagram remain unchanged.

Successful single-event extraction keeps Agenda time at the event timestamp, including the last due event. Empty `next` moves to the horizon. Public example 01, duplicate-Agent lifecycle tests, both guarded timeout orders and all ten city-model scripts pass on the integrated target. Full-state continuation and whole-Salabim parity are not delivered.

## Executed target checks

| Check | Actual result / limit |
| --- | --- |
| `bun run typecheck` | Passed, including Svelte: 0 errors, 0 warnings. |
| `bun test tests/des-adversarial.test.ts tests/random-normal.test.ts tests/random-exponential-poisson.test.ts` | 49 passed, 417 assertions after World attachment. |
| Five `examples/des/` scripts and ten numbered `examples/des-models/` scripts | All pass with original expected-result assertions. |
| `bun scripts/des-mm1-check.ts` | Eight predeclared replications; all five engineering tolerances passed. Utilization's 95% interval excludes the analytic target and is reported without changing seeds/tolerances. See the scientific report. |
| Independent refactor | Commit `7773dd9`: all forty pre/post observations match, ten scripts and 49 focused tests pass. Full typecheck passed. |
| `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte` | Passed; existing bundle-size warning remains. |
| `bun run check` | Typecheck, 699 tests across 78 files, all registered examples and library build passed. The command failed only at packed-consumer TypeScript checking after Bun/Node execution because a prior literal narrowing survived a twoPhase callback. The normally merged Mesa correction reads a fresh measurement; `bun run consumer` then passed Bun, Node ESM and ambient-free TypeScript. This is a repaired component gate, not a claim that the original failed command passed. |
| Post-merge `bun test tests/mesa-integration.test.ts` | 8 passed, 41 assertions; covers cross-track event/activation/History composition and budget exhaustion without a completed interval. Together with the prior test run this verifies all 707 integrated tests in two runs. |
| Final `bun run typecheck` and explicit Svelte build after the sole maintenance-label edit | Passed, Svelte 0 errors / 0 warnings; build passed in 2.21s with the existing bundle-size warning. |

`scripts/examples.ts` now runs all fifteen DES scripts; the development typecheck includes both example directories. Packed consumer coverage exercises every new public kernel, causal successor scheduling, World attachment, lifecycle, time weighting, event diagnostics and gamma continuation in Bun, Node and ambient-free TypeScript. Both tracks' packed-consumer blocks remain active after normal merges.

Mesa independently reports one complete `bun run check` passing all 707 tests, examples, build and consumers on the combined implementation; its [testing record](../mesa-expansion/independent-testing.md) is counterpart evidence, separate from the executions above. The later merge contains only documentation and presentation corrections, with affected type/build/browser checks rerun rather than repeating the costly unchanged baseline examples.

## Independent review and browser status

The first Antigravity `gemini-3.8-flash` high design review requested changes. [Findings and responses](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/des-design-review.md) distinguish fixes from approval. The new [final Gemini recheck](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/des-gemini-final-review.md) independently approved DES design, transfer and source scope and resolved all seven objections. Its executed checks include 49 focused tests, all fifteen scripts, typecheck and packed consumer. Native code recheck and independent screenshot inspection remain separate from the implementing/refactoring agents.

Configured Playwright MCP Chromium was attempted and aborted at startup: the SUID sandbox helper `/usr/local/libexec/codex-playwright/chrome_sandbox` was not configured as root-owned mode 4755. No system security settings were changed. T3's actual Chrome preview worked, so browser verification proceeded there on the Svelte host at port 3211, with its own isolated tab. This is real-browser verification, not a source-only replacement; the configured MCP launch itself remains unverified.

All ten Setup/step/Run/Pause flows, relevant actions/live/setup controls, keyboard focus/dismissal, model switching, invalid setup and local table scrolling passed. [The browser report](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/des-browser-review.md) records the executed results. [The manifest](des-browser-evidence/manifest.json) contains forty primary desktop/narrow light/dark captures and two supplemental narrow states, original artifact paths, CSS versus PNG dimensions and SHA-256 hashes.

Independent inspection first detected screenshots taken before theme styles settled. All forty were recaptured after 500ms plus two animation frames. Reopening overwritten paths also exposed stale image-tool caching; the independent reviewer reopened unique originals and checked their byte equality. A suspected persistent empty dark panel was withdrawn after the unique image showed all markers. No CSS/renderer change was made for capture artifacts.

A real narrow Labels-on overlap in machine maintenance was fixed only by projecting its numeric identity; status remains in the ledger. Commit `fff49c4` contains that presentation correction, affected-flow rechecks and new screenshots. Frozen example 10, final typecheck and Svelte build passed after the edit. Independent screenshot report `8f27ac3` [approves all 42 final captured states](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/des-screenshot-review.md), with no visual finding open. The author's browser report and independent approval remain separate. All owned browser tabs were closed.

## Late shared canvas correction and acceptance

The stopped development server later reported `ResizeObserver loop completed with undelivered notifications`; exit 143 itself indicates SIGTERM and does not establish an application crash. Empty snapshot console entries had not detected the window errors. A listener installed before Setup reproduced two maintenance errors in the coordinator's probe and five in Mesa's independent probe. Canvas buffer writes changed the observed parent's height during observer delivery. Commit `11d78f7` coalesces those resize writes and drawing into one browser animation frame, guards disposed state and cancels a pending frame on disposal. It changes no domain rule, tick, Random draw or public API.

The prior Gemini DES source approval is not claimed to cover this late host fix. [Independent canvas review](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/des-canvas-resize-review.md), commit `68d10d5`, approves its source/lifecycle scope after 19 existing UI tests / 108 assertions and real public-UI probes. Disposal while resizing produced no detached buffer writes or model steps; a replacement projection remained current. The report candidly records one warning from a deliberately adversarial caller invoking its own synchronous action from its own observer callback, outside normal host paths. No universal callback-arrangement guarantee is inferred.

The browser verifier then installed window-error and unhandled-rejection listeners before Setup for all ten models: **80 viewport changes, Setup/step/timed Run/Pause, zero window errors and zero unhandled rejections in that exact scope**. Three instrumented spatial catalog-disposal checks produced zero detached draws/errors. Commit `d210cd0` records [the full follow-up](des-browser-evidence/resize-followup.json) and replaces the twelve affected spatial images. Independent image review `83a39e7` inspected their unique originals and hashes and approved them without new findings. Current visual acceptance is all forty primary plus two supplemental states; the other 28 primary and two supplemental captures retain their earlier unaffected approval.

Post-fix `bun run typecheck` passed with Svelte 0 errors / 0 warnings; the explicit Svelte build passed in 1.99s. Native source review `8d4a8a5`, final Gemini DES approval and the separate late-host review all retain their stated scope. The initial review findings, independent refactor and scientific evidence remain separate records.

The authorized Salabim integration is locally complete with these documented limits: configured Playwright MCP launch is blocked by the sandbox setup, while actual T3 Chrome browser verification is complete; no city calibration, full Salabim parity or complete-state continuation is claimed. No implementation/review gate remains open for this slice. No push, PR, package publication or main merge occurred.
