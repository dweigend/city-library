# Urban Material Cycles checks

Executed in the shared checkout on 2026-11-10. These are author checks, not independent acceptance or scientific validation.

## Frozen public contracts

Before `model.ts` existed, four complete assertion scripts and `contract.md` were written. The initial command `bun tests/public-contracts/city-materials/01-setup.ts` failed with the expected missing-model-module error. `frozen-scripts.sha256` records the scripts before implementation; no assertions were changed afterwards.

| Executed command | Result |
| --- | --- |
| `bun tests/public-contracts/city-materials/01-setup.ts` | Passed: canonical setup, defaults, zero-step no-op. |
| `bun tests/public-contracts/city-materials/02-material-balance.ts` | Passed: exact first two days and daily/cumulative conservation. |
| `bun tests/public-contracts/city-materials/03-policy-intervention.ts` | Passed: atomic live policy, unchanged time/history, exact day-three recovery. |
| `bun tests/public-contracts/city-materials/04-validation-and-observations.ts` | Passed: rejected inputs/actions/steps, deterministic independent instances, detached frozen observations, 366-sample history. |
| `sha256sum -c models/city-materials/evidence/frozen-scripts.sha256` | All four files OK. |
| `bun test tests/public-contracts/city-materials/behavior.test.ts` | 6 passed, 0 failed; 7018 assertions. Zero capacity, available-mass cap, complete reuse, no recovery, empty system, fractional conservation and atomic rejection of invalid policy data. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. The checkout has no `node_modules/.bin`; dependencies were not installed or changed within this model task. No TypeScript/Svelte pass claimed. |

The fractional test advances 1000 days at generation 0.3 kg/day, capacity 0.4 kg/day, initial stock 0.7 kg, reuse 0.17 and recycling 0.63. All flows remain nonnegative and absolute balance error stays below 1e-8 kg. This checks numerical bookkeeping, not empirical accuracy.

## UI source review

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs. Read the web-design-guidelines skill and fetched its current Vercel rules via `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Source review covers only `models/city-materials/ui.ts`: one standard `defineUI` declaration, labelled inputs/monitors/views with units, central `indexedColor` palette, no CSS, custom Svelte, DOM access or numeric domain calculations. No source-level issue remains in that scope. This is not browser or independent design approval.

## Pending central verification

Browser interactions and screenshot capture are intentionally reserved for the coordinator to avoid shared browser contention. No browser acceptance is claimed. Required checks remain:

- Setup defaults, Step/Run/Pause, restart and live policy intervention in Agent Lab.
- Desktop at least 1366×768 and narrow 390×844, both light and dark themes; inspect graph labels, charts, controls and overflow.
- Keyboard/focus and validation behavior through shared controls.
- Independent inspection of the actual screenshots, with findings/responses recorded separately from approval.
- Independent substantial design/transfer review as required by project instructions; no reviewer or child agent was started here.
- Repeat repository typecheck after central dependency setup; shared contract-runner registration and model index documentation if required by integration.

Only `models/city-materials/` and `tests/public-contracts/city-materials/` are owned by this implementation. No branch change, commit, push or shared-file edit was made. The coordinator must add any shared runner/model-list entries; the model uses the existing discoverable `model.ts`/`ui.ts` layout.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-materials-desktop-light.png`
- `/tmp/city-materials-desktop-dark.png`
- `/tmp/city-materials-narrow-light.png`
- `/tmp/city-materials-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

Editorial TypeScript correction: the throwing `reuseFraction` getter in the fourth public script now declares return type `number`. Assertion syntax and expected failure are preserved; its recorded original freeze hash necessarily differs. The script was rerun successfully.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: collectionCapacity=0 produced day 1 with 120 kg uncollected, no reuse/recycling/disposal and zero mass-balance error.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-materials-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Steady flows; series labels were lower-case (review L7) and `setPolicy({ reuseFraction: undefined })` reset to the default (review L1). A synthetic festival pulse (`pulseExtraKg`, `pulseStartDay`, `pulseDays`), live `wasteGeneration`, backlog peak and clearance day. Defaults: capacity 120, reuse 0.1, recycling 0.4, initial stock 0.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:25:54+00:00. SHA-256 at that moment:

```text
9e24f78d214246ac5b1ea9704c597137b740abb6e525bcce85b9acd42319a1b7  tests/public-contracts/city-materials/01-setup.ts
536f1686e91b5408dfd922647c3bcda1b37621f210e3b3cc0c9bda757573243f  tests/public-contracts/city-materials/02-material-balance.ts
43466869319ee63dcd5b37755b703b1bb2d073248cd25878249746d67afc2282  tests/public-contracts/city-materials/03-policy-intervention.ts
0b6fc4b153dab89fa4c3c1b0b35c66382822daa082eb215a376626ed474dee28  tests/public-contracts/city-materials/04-validation-and-observations.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
9e24f78d214246ac5b1ea9704c597137b740abb6e525bcce85b9acd42319a1b7  tests/public-contracts/city-materials/01-setup.ts
536f1686e91b5408dfd922647c3bcda1b37621f210e3b3cc0c9bda757573243f  tests/public-contracts/city-materials/02-material-balance.ts
43466869319ee63dcd5b37755b703b1bb2d073248cd25878249746d67afc2282  tests/public-contracts/city-materials/03-policy-intervention.ts
0b6fc4b153dab89fa4c3c1b0b35c66382822daa082eb215a376626ed474dee28  tests/public-contracts/city-materials/04-validation-and-observations.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
