# Neighborhood Services checks

Run on 2026-11-10 with Bun 1.4.2, in the shared checkout based on `42a289785ee3c9879800d2dd7e8532d04032a7ab`. Only `models/city-services/` and `tests/public-contracts/city-services/` were written. No branch changes, commits, pushes, dependency installations or shared-file edits were performed.

## Example-first record

The four public scripts and `contract.md` were written before `model.ts` or `ui.ts`. An initial `bun tests/public-contracts/city-services/01-setup.ts` exited 1 with the expected missing `model.ts` error. The first implementation passed setup but the remaining scripts caught `geometry.distance` rejecting household/facility records with extra `id` fields. The implementation was corrected to pass explicit `{ x, y }` positions. No assertion was edited or weakened.

Frozen hashes, confirmed unchanged after execution:

| Script | SHA-256 |
| --- | --- |
| `01-setup.ts` | `8512d71b75f53d0cbab159b5f5573ebae738d642dd79fc4d23e55d49da42b9c0` |
| `02-first-steps.ts` | `48bd5f170efada27a0e4d68c166a0443fed1332802dc376b1ac025d3826a8851` |
| `03-policy.ts` | `7c1d1ddafc6b58a79d0624c5c84ec21d795d35d0ffb8d3b5510ee8daf51c879e` |
| `04-validation-snapshots.ts` | `80c42eba789a15ac1807b3fb83cef370d548a16b3713703cd3e90af3799fcbdb` |

## Executed shell checks

| Command | Result |
| --- | --- |
| `bun tests/public-contracts/city-services/01-setup.ts` | Passed: defaults, fixed geometry/IDs, inert setup, zero-step behavior. |
| `bun tests/public-contracts/city-services/02-first-steps.ts` | Passed: hand-calculated assignments/distances, daily and cumulative conservation, repeated daily capacity. |
| `bun tests/public-contracts/city-services/03-policy.ts` | Passed: next-day capacity/radius interventions, retained previous-day results, zero capacity. |
| `bun tests/public-contracts/city-services/04-validation-snapshots.ts` | Passed: boundary failures, deterministic independent instances, detached observations and failure atomicity. |
| `bun test models/city-services/model.test.ts` | Passed: 4 tests, 0 failures, 1375 expectations. Covers farther available facilities, distance/capacity distinction, 35 capacity/radius combinations over four days and 120-sample history eviction after 125 days. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. `node_modules/.bin` is absent. No TypeScript/Svelte pass claimed. |
| `sha256sum tests/public-contracts/city-services/*.ts` | Matched all four frozen hashes. |

## UI source review and pending acceptance

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs guidance. Read the central UI reference and existing component configuration. The model adds no components, CSS, host hooks, dependencies or framework state. `ui.ts` uses only public defineUI, indexedColor, Observation and SpatialData exports. Numerical access and distance measurements stay in `model.ts`; UI code projects positions, relationships and text.

Fetched the current Vercel Web Interface Guidelines via `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` for the web-design-guidelines source checkpoint. Source inspection found no custom DOM, styles, gestures, forms, icons or theme overrides to audit in this declaration. Labels identify units, next-day control timing, household/hub symbols and individual household served counts. This source inspection establishes no rendered UI or accessibility acceptance.

Browser interactions, desktop (at least 1366×768) and narrow (390×844) screenshots in light/dark themes, keyboard/focus behavior, selection and independent screenshot inspection are **pending central coordination**, as instructed to avoid browser contention. No screenshots were captured and no independent review or UI acceptance is claimed. Substantial design/transfer review is also not independently approved here.

Suggested centrally coordinated flow: discover Neighborhood Services, Setup, Step (6 served/6 unmet), select a household, set capacity to 2, verify day-1 results remain, Step (12/0), set radius to 1, Step (6/6), set capacity to 0, Step (0/12), Run/Pause and Setup recovery. Inspect map/table/chart readability, light/dark contrast and overflow at both sizes.

## Coordinator integration

The existing public-contract runner's glob already includes these four scripts; the existing model discovery scans paired `model.ts`/`ui.ts`, so no runner or registration edit is required. The coordinator owns any shared `models/README.md` entry, PLAN/evidence reconciliation and dependency setup/typecheck rerun. This original model must remain outside the fixed NetLogo acceptance ledger. Scientific validation, road-network access, persistent school enrollment and coupling with other city models are outside this slice.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: capacityPerFacility=0 produced day 1 with zero served, twelve unmet requests and zero use at all six facilities.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-services-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Four households and two hubs gave identical 6/6 results every day. Sixteen households, a central versus distributed layout at equal capacity, nearest-first allocation and separate `full`/`too-far` outcomes. Input `capacityPerFacility` becomes `capacityPerKind`; `setCapacityPerFacility` is replaced by `setPolicy`; `setMaxDistanceKm` remains.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:04:19+00:00. SHA-256 at that moment:

```text
242b931d1a80a345e35ac5fdbb6129d1585aad14899e2aa9474990973f8119de  tests/public-contracts/city-services/01-setup.ts
aca41158cffca8d47cb84eb873fab5abb41b6140acda5548c126c165a219cf66  tests/public-contracts/city-services/02-first-steps.ts
a2331eeb9fab1b7d64f805abd29356416c6d80c1ee6181d90f229ad446fcb19b  tests/public-contracts/city-services/03-policy.ts
96fffe21ee1bb3aca866aee0cb5ba2e7e2ad8e19185bf14cb11f674647db8dd0  tests/public-contracts/city-services/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
242b931d1a80a345e35ac5fdbb6129d1585aad14899e2aa9474990973f8119de  tests/public-contracts/city-services/01-setup.ts
aca41158cffca8d47cb84eb873fab5abb41b6140acda5548c126c165a219cf66  tests/public-contracts/city-services/02-first-steps.ts
a2331eeb9fab1b7d64f805abd29356416c6d80c1ee6181d90f229ad446fcb19b  tests/public-contracts/city-services/03-policy.ts
96fffe21ee1bb3aca866aee0cb5ba2e7e2ad8e19185bf14cb11f674647db8dd0  tests/public-contracts/city-services/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
