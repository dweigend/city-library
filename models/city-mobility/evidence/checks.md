# Urban Mobility checks

Baseline: `42a289785ee3c9879800d2dd7e8532d04032a7ab`.

## Example-first freeze

Four assertion scripts and `contract.md` were written before `model.ts`. Initial command `bun tests/public-contracts/city-mobility/01-setup.ts` failed because `model.ts` did not exist. No stub or disabled assertion was used.

Frozen SHA-256:

```text
b0d5e4a8ac2c81b6cbfb167173478123c57886ac4bfbb28d9b6edcbd7d24e006  01-setup.ts
64171a5feae93c18705cf4b1bd7a6e08ddf5abcb8c2a05e336c6295d2dd105db  02-first-steps.ts
749c7f221772f1b521f067c1c983713424ddcd0a68c2dc0beca5e1d5edb1cfa3  03-policy.ts
55907c64fe0133423d87ac4bc0054a751ce4e5b1a3e84502a3e95eeb83b7a9de  04-validation-snapshots.ts
```

## UI acceptance

Pending central coordination: real-browser setup, stepping, Run/Pause, live penalty change, dispatch, selection and resulting state; desktop ≥1366×768 and narrow 390×844 screenshots in light/dark themes; independent review of actual screenshots and any follow-up fixes. No browser session was opened by this implementation worker. No visual, accessibility, scientific or independent acceptance is claimed.

## Integration

No shared files modified. The normal `bun run contracts` glob already discovers the four numbered scripts. Its `--city` filter only includes `city-simulation`, so `contracts:city` does not include this model. Coordinator owns any desired filter change and the shared model catalog documentation. No new package exports or dependencies are required.

## Executed technical checks (2026-11-10)

| Command | Result |
| --- | --- |
| `bun tests/public-contracts/city-mobility/01-setup.ts` | Passed after implementation |
| `bun tests/public-contracts/city-mobility/02-first-steps.ts` | Passed |
| `bun tests/public-contracts/city-mobility/03-policy.ts` | Passed |
| `bun tests/public-contracts/city-mobility/04-validation-snapshots.ts` | Passed |
| `bun test tests/public-contracts/city-mobility/behavior.test.ts` | 3 passed, 0 failed, 431 expectations |
| `sha256sum tests/public-contracts/city-mobility/0*.ts` | All four hashes still match the pre-runtime freeze |
| `bun run typecheck` (first run) | Failed: owned missing Graph edge-state constructor arguments plus concurrent diagnostics outside this scope. Owned errors fixed using public `edgeState` options. |
| `bun run typecheck` (second run) | Failed only outside this model: `city-air-noise/model.ts:81,84` possibly undefined fields; `city-stormwater/ui.ts:67` missing closing brace. No Mobility diagnostics. Other models were still being written; these are run-time observations of checkout diagnostics, not final findings against their owners. |
| Isolated `node_modules/.bin/tsc --project <temporary-config> --noEmit` | Passed. Config extended the root tsconfig, included `models/city-mobility/**/*.ts` and `tests/public-contracts/city-mobility/**/*.ts`, and had `exclude: []`. Temporary config was created under owned evidence and removed afterwards. This checks model, UI declaration and tests with their public dependency graph. |
| `git diff --check -- models/city-mobility tests/public-contracts/city-mobility` | Exit 0; files are new/untracked so this does not establish a staged patch whitespace review. |

The first attempt to place the isolated config under `/tmp` could not resolve Bun/Svelte/Vite type packages (TS2688). Placing its temporary directory under the owned evidence directory allowed normal ancestor dependency resolution. No shared configuration changed.

All four contracts and focused tests were rerun after the final model code fix. Focused checks cover 110 mixed departures, per-link used/waiting counts against actual trip status, lifetime conservation, complete draining, nested snapshot mutation isolation, action/history timing and bounded history eviction. The standard four-trip case verifies a true capacity queue and hand-calculated first steps.

Documentation correction after implementation: the contract now names the actual public routing call `Graph.allDistances` rather than `Graph.distances`. This changes neither the routing semantics nor any frozen assertion.

## UI source QA

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte, write-docs and web-design-guidelines skills. Read the current Vercel Web Interface Guidelines via a read-only fetch on 2026-11-10. Source review found no remaining model-level UI issue: one shared `defineUI`, explicit labels and action setters, central indexed scientific color, numeric formatting only in UI, headless measurements, detached observations, no DOM/CSS/framework code or additional state owner. The network intentionally shows only car edges so the walking path and car bypass do not overlap at the same endpoints; stop inspection reports both modes. This is author source review only. Host focus, keyboard behavior, responsiveness, light/dark appearance and actual rendering remain unverified pending central browser work and independent screenshot review.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: An initial carPenalty=20 input was outside the declared maximum 10 and therefore did not apply to the domain. Dispatching four additional trips still completed eight car trips; this was not evidence of a walking-mode intervention. A valid carPenalty=5 intervention was subsequently checked, as recorded below.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-mobility-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Static routing never used the bypass, edge width was unbounded up to ~121 px (review L2) and a revision-1 test used carPenalty 20 above its maximum of 10. Choice is now queue-aware over main road, bypass and walking, with a 60-minute peak (`departuresPerMinute`), live road capacity (`Resource.setCapacity` retain) and walking time (`setPolicy`). Defaults: initialTrips 0, carCapacity 5. Rendering uses fixed, bounded widths. No Braess claim.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T16:55:49+00:00. SHA-256 at that moment:

```text
304ba1c5596da2b4dea6c0d155bda61dc3e132e9ba3418f0e9ce7d32060a0dd4  tests/public-contracts/city-mobility/01-setup.ts
7e550e507008f10b0309e38ab1d07d286532522296b61aa17d855bcdbaa6f2fc  tests/public-contracts/city-mobility/02-first-steps.ts
31e0de3463a27b81a16f59e96bb17f7b84cb0dbb39abaed88dbe6fb11432a36f  tests/public-contracts/city-mobility/03-policy.ts
7ce4d97d81b52670ce332237e1efb8055d9baf9027c5b8f4b0c68fabba9a4aed  tests/public-contracts/city-mobility/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
304ba1c5596da2b4dea6c0d155bda61dc3e132e9ba3418f0e9ce7d32060a0dd4  tests/public-contracts/city-mobility/01-setup.ts
7e550e507008f10b0309e38ab1d07d286532522296b61aa17d855bcdbaa6f2fc  tests/public-contracts/city-mobility/02-first-steps.ts
31e0de3463a27b81a16f59e96bb17f7b84cb0dbb39abaed88dbe6fb11432a36f  tests/public-contracts/city-mobility/03-policy.ts
7ce4d97d81b52670ce332237e1efb8055d9baf9027c5b8f4b0c68fabba9a4aed  tests/public-contracts/city-mobility/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
