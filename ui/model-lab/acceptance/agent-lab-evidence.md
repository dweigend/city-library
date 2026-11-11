# Agent Lab refactor evidence

Status: modular replacement implemented; final checks and evidence are recorded below. This is bounded delivery, not full A3/A4/A7 or NetLogo parity.

Historical verification: 5 November 2026. The results below are retained from that delivery, not a fresh check run. [Frozen examples](agent-lab-examples.md), [assignment and review decisions](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/agent-lab-refactor.md#review-responses-and-decisions) and [source provenance](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/netlogo-reference-sources.md) remain versioned.

## Gaps to track

Before this work, spatial movement, Grid/Field, occupancy, field diffusion and generic statistics have no delivered public runtime. New slices must report only their actual closure, not full A3/A4/A7 completion. NetLogo MT RNG compatibility, general advanced activation, full storage/continuation and experiment-runner delivery remain separate capabilities. A renderer or partial snapshot does not provide those contracts.

## Delivered closure and review remediation

- Headless Space/Agent movement, orientation, distance/perception, canonical Grid/Field lookup/neighbors/occupancy/diffusion and World Grid membership; public gini/histogram. Frozen author examples and targeted regressions exercise these bounded operations.
- Shared typed UI components and neutral network/grid/spatial/chart/inspector adapters; automatic paired-entry catalog, independent view state, model actions and cleanup. Legacy Agend_Lab runtime and source-specific projection/layout tests were retired. Their relevant snapshot, layout, selection and lifecycle regressions are covered by new public examples, catalog tests and real-browser checks; the original playback regression is retained against the shared module.
- Four reference entries and both Wolf modes. Model rules remain headless; generic core contains no reference-model imports. Adapted source notices stay with reference ports and archives, excluded from core package files.
- Astra's model audit reproduced two bugs: Voting double-read validation and grass-history availability across live mode changes. Fixed with materialize-once validation and per-sample grassAvailable metadata plus projection filtering; targeted regressions pass. This is author remediation, not independent re-approval.
- Argon's core audit reproduced clipping roundoff/invalid-origin movement, wrapped-endpoint admission, coordinate accessor handling, arity/undefined inconsistencies and statistics option/source validation bugs. Corrected with focused regressions. String sources now reject. Internal nominal Grid membership is retained to preserve sound typed payload admission without any; the suggested any-based replacement was not adopted. The reference does not prohibit private framework identity bookkeeping.
- Plain coordinate records currently use strict own-data x/y/z validation, consistent with creation options; canonical Agent/Field position sources are accepted. Structural Position values carrying extra ordinary metadata require explicit coordinate projection in this bounded runtime. This is an interoperability limitation requiring an explicit broader contract decision, not a claim of complete structural parity.

## Executed target/browser evidence

Real Chromium checks at desktop 1280 × 800 and mobile 390 × 844 covered all four default setups/progressed runs, both Wolf modes, Run/Pause, live/draft inputs, validation, catalog rebuild switching, layout/keyboard selection, responsive sizing and selective actual light/dark emulation. No complete accessibility or cross-browser certification is claimed.

Root also smoke-tested the replacement server on port 3100 with Preferential Attachment Setup and 10 steps (12 nodes/11 edges), dark/light theme switching and no console errors. Network labels now use the shared muted token and update on preference changes. Detailed browser logs and screenshots are local artifacts under `.local/development-archive/`. All owned browser tabs are closed after checks.

Final executed `bun run check` passed after review fixes: all three TypeScript configurations, 103 tests across 13 files, 35 public example scripts, browser-target build/declarations and packed Bun/Node/ambient-free TypeScript consumer. The packed consumer additionally executes spatial wrapping, typed Grid admission, canonical occupancy, conservative diffusion and histogram/Gini through the installed package. No UI or reference sources enter that archive.

Remaining library work: paths/canMove/gradients, general geometry namespace, advanced activation/MT compatibility, Graph/Input/Agenda World participation, generic Input/stats.describe/alignment/History, study execution/storage/continuation and further graph algorithms. The model-owned bounded histories are not delivery of generic storage.History. Current neutral glyphs, independent layout and RNG differ intentionally from NetLogo; see provenance/deviation records.

See the [documentation policy](README.md) for local artifact retention.
