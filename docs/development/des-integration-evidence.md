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
| `bun run check` | Running full integrated gate; its test phase passed 699 tests across 78 files. Remaining examples/build/consumer result must be recorded after completion. |

`scripts/examples.ts` now runs all fifteen DES scripts; the development typecheck includes both example directories. Packed consumer coverage exercises every new public kernel, causal successor scheduling, World attachment, lifecycle, time weighting, event diagnostics and gamma continuation in Bun, Node and ambient-free TypeScript. Its full execution is pending the running check, not assumed from source.

## Independent review and browser status

The first Antigravity `gemini-3.8-flash` high design review requested changes. [Findings and responses](des-design-review.md) distinguish already-fixed concurrent text, implementation corrections and pending re-approval. Native code recheck and independent screenshot inspection are separate from the implementing/refactoring agents. No final substantial review approval is claimed yet.

Configured Playwright MCP Chromium was attempted and aborted at startup: the SUID sandbox helper `/usr/local/libexec/codex-playwright/chrome_sandbox` was not configured as root-owned mode 4755. No system security settings were changed. T3's actual Chrome preview worked, so browser verification proceeded there on the Svelte host at port 3211, with its own isolated tab. This is real-browser verification, not a source-only replacement; the configured MCP launch itself remains unverified.

All ten Setup/step/Run/Pause flows and forty desktop/narrow light/dark screenshots are captured. Independent inspection detected screenshots taken before theme styles settled; the verifier reproduced correct stable colors and is replacing all forty captures after an explicit settle before reinspection. Browser action/live/keyboard/model-switching checks and final independent visual approval remain pending. Final paths/results belong in the browser manifest and separate review reports.
