# Urban Heat checks

Implementation evidence recorded on 2026-11-10. Work is confined to `models/city-heat/` and `tests/public-contracts/city-heat/`. No shared source, configuration, lockfile, dependency manifest, branch or commit was changed.

## Example-first record

The four numbered assertion scripts and `contract.md` were written before runtime implementation. Their SHA-256 hashes were stored in `tests/public-contracts/city-heat/SHA256SUMS`. The initial command `bun tests/public-contracts/city-heat/01-setup.ts` failed with `Cannot find module '../../../models/city-heat/model.ts'`, as expected before implementation. Assertions were not changed to accommodate runtime behavior.

## Executed commands

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-heat/01-setup.ts` | Passed after implementation: default inputs, initial state, stable block IDs and zero-step purity. |
| `bun tests/public-contracts/city-heat/02-hourly-budget.ts` | Passed: hand-calculated first two temperatures/fluxes, interval energy, stored energy, balance residual and sample ordering. |
| `bun tests/public-contracts/city-heat/03-policy.ts` | Passed: full shade/water response, no instantaneous heat change, atomic invalid policy and subsequent dry response. |
| `bun tests/public-contracts/city-heat/04-validation-and-isolation.ts` | Passed: invalid values/counts, forbidden policy keys, deterministic batching, independent snapshots, history bounds and long-run forcing boundaries. |
| `bun test tests/public-contracts/city-heat/behavior.test.ts` | Passed: 4 tests, 12,815 expectations; accessor rejection without evaluation, unchanged state after failure, mutable snapshot isolation, equilibrium, history eviction and every extreme forcing/initial-temperature combination over 200 hours. |
| `sha256sum -c tests/public-contracts/city-heat/SHA256SUMS` | Passed: all four frozen scripts unchanged. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. The checkout has no `node_modules/.bin`. No dependencies were installed in the shared checkout. |
| `tsc --noEmit --project tsconfig.json` | Blocked, exit 1: TS2688 missing type definitions for `bun`, `svelte`, `vite/client`. This is not a successful substitute typecheck. |

The public scripts exercise source imports through `city-library` and the model's public factory/actions. They do not establish a new published package entry or a packed-consumer result. Full repository tests/build were not run.

## UI source review

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs instructions. Read root `components.json`, existing original models and the public UI reference. Reused the shared UI declaration rather than authoring components, CSS, icons, DOM handlers or layout machinery. No shadcn component or block is introduced.

Loaded web-design-guidelines and fetched its current upstream rules successfully with `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Source review of `ui.ts` confirms labelled views/monitors, numeric monitor getters with display-only formatting, central indexed colors, text temperature labels in addition to color, an accessible spatial description, stable IDs and explicit model-action live bindings. No source finding remains within this declaration. Focus, contrast, touch behavior, responsive layout and rendered labels remain unverified; source review is not UI acceptance.

## Pending central acceptance

Browser interaction and screenshot work is deliberately reserved for central coordination to avoid shared-browser contention. No browser session was opened and no screenshot review is claimed.

- Required: Setup; single and multiple hourly steps; Run/Pause; live shade/water edits; policy effect on subsequent temperature; block selection and inspector; setup restart and history reset; invalid input feedback; keyboard interaction and visible focus.
- Required screenshots: desktop at least 1366×768 and narrow 390×844, both light and dark themes, including initial and advanced/intervened states. No screenshot paths exist yet.
- Required: independent inspection of the actual screenshots, findings/responses and explicit approval. No independent reviewer was started by this implementation agent.
- Required: rerun `bun run typecheck` after the coordinator supplies the repository dependencies; resolve any resulting errors before integration acceptance.

## Shared integration notes

No library APIs, dependencies or runtime coupling to another new city model are needed. The normal public-contract runner discovers numbered scripts by glob, so no runner edit is needed for its full run. Its `--city` filter selects `city-simulation`, so the coordinator may decide separately whether to extend that shared filter. Any catalog/index documentation and PLAN integration belong to the coordinator. Browser discovery of this model must be checked centrally.

The original synthetic rule and exact reuse comparisons are documented in `contract.md`. Passing arithmetic checks supports this bounded teaching mechanism only; no scientific validation, real-city calibration, source-model equivalence or UI acceptance is claimed.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: shadeFraction=1 produced hour 1 mean surface 29.75 °C and zero heat-budget residual.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-heat-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Constant sun and air drove all blocks to one red color (review L3). Synthetic day/night drivers, per-block heat capacity, sun-scaled evapotranspiration with irrigation water, defaults shade 0 and peak sun 800 W/m². A fixed continuous color scale with a color bar; negative zero is normalized in display (review L7). Two expected values were mistranscribed during derivation (28.53 → 28.52, 33.42 → 33.41; exact 28.5249 and 33.4147) and corrected before acceptance; the model equals the independent calculator bit for bit.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:16:13+00:00. SHA-256 at that moment:

```text
2ff53824ac2a1dcc637b7c580cc3d1d4e199669d40d019486dddfd0fa2c05286  tests/public-contracts/city-heat/01-setup.ts
9b280b06bf403971951e86b2d495dc8690e5b1bdd0103d4d25ed73ffa2303a03  tests/public-contracts/city-heat/02-hourly-budget.ts
0d0a4ec7e84b36d8f1d0ec42233e2ec6022984b61e2a358ba7afef3e78c0a5cd  tests/public-contracts/city-heat/03-policy.ts
30a3a2dfc784b53e9e71e2615d1747067d05087b5f10450dcc093ab70a3d3a06  tests/public-contracts/city-heat/04-validation-and-isolation.ts
```
Corrections before acceptance: city-heat transcription correction before acceptance: 28.53->28.52 (exact 28.5249), 33.42->33.41 (exact 33.4147); model equals independent calculator bit-for-bit

There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
2ff53824ac2a1dcc637b7c580cc3d1d4e199669d40d019486dddfd0fa2c05286  tests/public-contracts/city-heat/01-setup.ts
a688ee732209d19a9d2bfa66e00cf2b8630be1370ef9a4a9aecfaa15f5f2a123  tests/public-contracts/city-heat/02-hourly-budget.ts
a15f53739c8af8d3b018b61e1321bfe8173a3fe7c6e2c9c3dc71d78d6644326f  tests/public-contracts/city-heat/03-policy.ts
30a3a2dfc784b53e9e71e2615d1747067d05087b5f10450dcc093ab70a3d3a06  tests/public-contracts/city-heat/04-validation-and-isolation.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
