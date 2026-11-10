# Independent visual-change behavior verification

This independent pass checked that the ten mechanism visualizations preserve the existing headless behavior. It did not edit model, UI, test, runtime or dependency files. Actual browser rendering and image legibility are separate workers' evidence, not established by these shell checks.

## Checked source boundary

The checked branch was `feat/mesa-mechanisms` in `/home/david/.t3/worktrees/city-library/t3-4fc992c0`, at HEAD `5f940189c333c0f765b287d1ad2b0a030ac752fa`. The working tree also contained the coordinator's presentation-only removal of numeric labels for nongranted Residential Occupancy markers. That UI change was present throughout this pass. The untracked image-review report belonged to a concurrent worker. No model/runtime source delta appeared during the pass. While the report was being written, the coordinator adjusted only the Zoning UI panel height/caption inset after an actual-image finding. The verifier reran the ten-model comparison, full typecheck, all43 focused tests and explicit Svelte build after that presentation delta; those repeated gates also passed.

The comparison baseline was Git revision `44272279e22a82deb162589f892ec058c50994d8`, before the corrected mechanism views. The original keys remain binding; new detached observation keys are additive.

## Independent trajectory and purity comparison

For each of the ten entries, the verifier loaded the baseline model from `git show 4427227:studies/<slug>/model.ts` into a temporary file outside the repository. Only import locations were remapped to the same repository's unchanged root library, definition types and parameter validation. The file was removed in a finally block. No extra checkout was created and no actual `model.ts` was replaced.

Baseline and current captures ran in separate fresh Bun processes with identical inputs: seed17 where the model accepts a seed, otherwise its defaults. They recorded JSON-compatible detached observations after cumulative requested advances of 0,1,3,10,30,130. Finite models retain their normal terminal tick instead of being forced past completion. Every original key, array length and scalar value was compared recursively, including opaque object IDs without normalization. Added current keys were allowed.

The current process also imported each public UI entry without browser globals, checked that its inert mount contract existed, and made three repeated observation reads and calls to exported `*Data`, `*Nodes` and `*Map` projections at every boundary. The observation before and after those calls was identical. Future trajectories still matched the baseline, covering the inspected seeded draw continuation as well as tick/state effects.

All ten comparisons passed:

| Entry | Original values and IDs | Repeated reads/projections |
| --- | --- | --- |
| Neighborhood heat intervention | Exact match | Unchanged |
| Household energy demand | Exact match | Unchanged |
| Residential occupancy | Exact match | Unchanged |
| Pedestrian crossing phases | Exact match | Unchanged |
| Solar battery microgrid | Exact match | Unchanged |
| Stormwater retention | Exact match | Unchanged |
| Urban tree watering | Exact match | Unchanged |
| Household recycling behavior | Exact match | Unchanged |
| Zoning scenario comparison | Exact match | Unchanged |
| Workplace/household membership | Exact match | Unchanged |

The independent temporary harness and capture files are under `/tmp/mesa-visual-independent/`. These are verification aids rather than new package or model APIs. The coordinator's earlier shorter capture was not reused as proof for this independently recreated baseline.

## Contract checks

Source inspection of all ten headless model imports found only public headless library contracts and the existing experiment definition/parameter modules. No UI, DOM, Canvas, Svelte, SpatialData or GraphNodeData import/type was introduced into these models. Their added observations expose ordinary detached values: actual Grid coordinates, capacities, model-owned interval balances, tree moisture capacity, actual planned runs and semantic node kinds.

The focused tests verify actual centered field geometry and detached snapshots; a fixed heat color domain across widths/time; fixed moisture colors across populations; household aggregate/per-household agreement; battery and basin interval conservation; readonly catchment observations; repeated-read seeded continuation; sole Resource reservation status ownership; crossing stage positions; stable recycling layout; exact completed zoning slot counts and actual plan metadata; and membership reassignment changing canonical edges without moving model geography. These are bounded behavior checks, not scientific validation.

## Executed commands and results

- `python3 /tmp/mesa-visual-independent/compare.py`: all ten baseline/trajectory/read/projection comparisons passed at the six requested boundaries, with no ID normalization.
- `bun run typecheck`: passed all configured TypeScript projects and Svelte checks; Svelte reported 0 errors and 0 warnings.
- `bun test tests/heat-projection.test.ts tests/resource-projection.test.ts tests/social-projection.test.ts tests/spatial-models.test.ts tests/model-occupancy.test.ts tests/domain-integration.test.ts`: **43 tests passed, 0 failed, 403 assertions**.
- Each unchanged script in `tests/public-contracts/model-measurements`, `tests/public-contracts/model-dynamics` and `tests/public-contracts/graph-attachment` executed through Bun: **all 14 public scripts passed**.
- `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte`: passed in 1.85 seconds, then passed again in1.42 seconds after the late Zoning panel/caption change. The existing chunk-size advisory remains; it is not a build failure.
- A direct import/source scan found no UI/browser dependencies in the ten headless model files. UI imports were also executed in the fresh Bun comparison processes without DOM globals.

No runtime behavior defect or regression was found in this pass, and no assertion or baseline was weakened. The expensive unchanged whole-project baseline was not repeated; this pass reports only the targeted commands it actually executed.

## Limits

This approval concerns the inspected behavior, import boundaries and targeted shell checks. It does not approve visual clarity from source, all possible inputs, every future RNG state, complete accessibility, empirical city predictions or full NetLogo compatibility. Browser, actual-canvas-pixel, independent-image and substantive visual-transfer review gates remain separate. The JSON-compatible observation comparison is not a general snapshot/continuation codec test.
