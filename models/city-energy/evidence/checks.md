# Urban Energy Supply checks

Date: 2026-11-10. Repository baseline: `42a289785ee3c9879800d2dd7e8532d04032a7ab`. Bun: 1.4.2. Implementation scope is `models/city-energy/` and `tests/public-contracts/city-energy/`; no shared source, runner, dependency, configuration, branch or commit changes were made.

## Example-first evidence

Before `model.ts` existed, the four public scripts and `contract.md` were written and frozen. `bun tests/public-contracts/city-energy/01-setup.ts` initially failed with `Cannot find module '../../../models/city-energy/model.ts'`, as expected for the absent runtime. `SHA256SUMS` was generated before runtime implementation and later verified unchanged. The additional `behavior.test.ts` supplements these contracts and is not part of that frozen set.

## Executed checks

| Command | Result |
| --- | --- |
| `bun tests/public-contracts/city-energy/01-setup.ts` | Passed: defaults, zero-flow setup, initial storage, no-op advance. |
| `bun tests/public-contracts/city-energy/02-hourly-balance.ts` | Passed: exact first hours/daylight transition, balances, energy/power/network bounds, no simultaneous battery charge and discharge over 72 hours. |
| `bun tests/public-contracts/city-energy/03-policy.ts` | Passed: shortages and atomic next-interval network intervention with unchanged past flows/history. |
| `bun tests/public-contracts/city-energy/04-validation-and-isolation.ts` | Passed: rejected input/count/action values, deterministic batched execution, independent frozen observations/instances, zero-capacity case, bounded history. |
| `bun test tests/public-contracts/city-energy/behavior.test.ts` | Passed: 3 tests, 3611 assertions; 720 fractional-input hours, storage bounds and residual tolerances, cumulative shortages, full-battery curtailment, unknown-key/accessor rejection and partial live changes. |
| `sha256sum -c tests/public-contracts/city-energy/SHA256SUMS` | Passed: all four frozen script hashes match. |
| `bun run typecheck` | Blocked, exit 127: the configured Svelte check reports `svelte-check: command not found`. `node_modules/.bin` is absent. No dependencies were installed or shared files changed. This is not a TypeScript pass. |

## UI source review and pending acceptance

The frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs skills were applied. The web-design-guidelines skill was read; its latest upstream rules were retrieved using `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Source review of `ui.ts` found no custom components, DOM access, CSS, local literal colors, duplicated controls or domain calculations. All views use the public `defineUI` API and central `indexedColor` palette. Controls explicitly call `setNetworkCapacity`. This source review does not establish visual or accessibility acceptance.

Browser work is deliberately deferred to central coordination to avoid shared-browser contention. Pending: actual catalog discovery/setup, Step/Run/Pause, both live network-capacity controls, error handling, table/chart rendering, keyboard navigation and focus, narrow overflow, desktop screenshots at least 1366×768 and narrow screenshots at 390×844, both light and dark themes, and independent inspection of the captured screenshots. No screenshots or independent review were performed by this implementation agent. UI acceptance remains open. Substantial-design independent review, if required by coordination, also remains open.

## Integration needs and limits

No new library API, package export, dependency or shared runtime edit is required. The coordinator should register the four public scripts in any explicit central contract runner and update the shared model index/PLAN as appropriate; those files are outside this agent's ownership. Catalog integration and production UI build remain unverified here. Restore the existing project's dependencies centrally, then rerun `bun run typecheck`.

Reuse/provenance decisions are recorded in `contract.md`. The headless checks establish synthetic dispatch and energy-accounting behavior only. They establish no scientific validation against measured city demand, physical electrical networks or real heat systems.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-energy-desktop-light.png`
- `/tmp/city-energy-desktop-dark.png`
- `/tmp/city-energy-narrow-light.png`
- `/tmp/city-energy-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

Coordinator annotated the throwing accessor in the supplementary behavior test with return type `number`; all three behavior tests passed again (3611 expectations). Frozen public scripts were not edited.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: electricityNetworkCapacityKw=0 produced hour 1 with 2 kWh unmet electricity and zero balance residuals; the readable table showed no electricity import.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-energy-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

A square-wave day without an evening problem. Solar now follows a half-sine, demand has an evening peak, battery power 4 kW and import limit 5 kW are defaults, and the new live input `flexibleShare` shifts evening demand to midday. Daily totals `today`/`lastDay` added. Interval charts exclude the setup sample (review L5).

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:07:13+00:00. SHA-256 at that moment:

```text
634681d192156ea678eb0865f4d99cb96625b69244632077761791b73d0ff97c  tests/public-contracts/city-energy/01-setup.ts
a16e8b804f6db4ea72663da1aacfd0d90d0ede9ee538f7d3987dccf602c3fb4e  tests/public-contracts/city-energy/02-hourly-balance.ts
5f2611ba5888de5780680d1b6ce4e1d4d415366b4d0520f3c38831626bd88911  tests/public-contracts/city-energy/03-policy.ts
80718b13f29d0f216d2ebdaa037f317369f7b25a31d0c6d58fe5533c5edae8f6  tests/public-contracts/city-energy/04-validation-and-isolation.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
634681d192156ea678eb0865f4d99cb96625b69244632077761791b73d0ff97c  tests/public-contracts/city-energy/01-setup.ts
a16e8b804f6db4ea72663da1aacfd0d90d0ede9ee538f7d3987dccf602c3fb4e  tests/public-contracts/city-energy/02-hourly-balance.ts
5f2611ba5888de5780680d1b6ce4e1d4d415366b4d0520f3c38831626bd88911  tests/public-contracts/city-energy/03-policy.ts
80718b13f29d0f216d2ebdaa037f317369f7b25a31d0c6d58fe5533c5edae8f6  tests/public-contracts/city-energy/04-validation-and-isolation.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
