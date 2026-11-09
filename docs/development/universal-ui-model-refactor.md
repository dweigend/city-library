# Independent universal UI model/script refactor

This pass is independent of the universal UI implementation and migration authors. Scope: review the accepted Phase A/B authoring changes, the three new DES collection helpers and representative large migrated declarations. The assigned source ownership was limited to the three office/charging/goods scene helpers and two confirmed synthetic decorations in PSO/Vision. Shared runtime, models, tests, frozen examples, migration manifests and registry files were not edited. The original refactor-model-scripts and refactor-library skills, their shared workflow and decision examples, the full coding standards and [accepted decisions](universal-ui-decisions.md) apply.

## Retain useful code

The three new DES helpers need no additional extraction or formatting:

- `officeScene` directly declares model-owned waiting order, in-service/completed identities and separate anonymous clerk capacity. Its short status filters explain the domain membership. A shared filter/mapping wrapper would hide that visible distinction.
- `chargingScene` already gives the repeated vehicle projection a meaningful `vehicleItem` name. It preserves the actual Resource waiting order, priority diamond, ordinary rectangle and cancelled/completed status rows. The `vehicles[number - 1]` lookup relies on the model's admitted sequential number and stable non-deleting array; no unnecessary validation layer or second registry is warranted.
- `bufferScene` visibly maps each Store-owned snapshot to exact crate IDs. The three short maps concern different ownership states. A generic item builder would reduce characters while making the source of order less obvious.

All three keep the central `collectionDiagram` defaults rather than introducing local spacing, symbol, packing or annotation constants. No scene helper source was changed by this pass.

The independent audit/migration reports cover all 146 pairs; this pass reread representative larger bindings rather than appropriating a new exhaustive semantic approval. Taxi's explicit demand groups and labels remain useful, Wolf/Sheep retains its mode-dependent grass control and unavailable monitor values, Heat retains its min/max and NetLogo mapping, and Traffic retains its explicit model action for pointer car selection and physical follow-camera transform. Their new single `change` forwards clarify the common write operation. Additional nesting, computed configuration or a builder would make these examples harder to read.

Taxi's pre-existing `histogram` helper still calculates bins from detached trip observations in `ui.ts`. This is recorded ownership debt for a separate bounded model-observation change, not silently moved or recalibrated during live-write migration. Source formulas, histogram edges, RNG calls and scientific units are unchanged here. Signaling-game's fixed role positions communicate protocol structure and were deliberately retained.

## Separate intentional selection correction

Two source-audited presentation glyphs now use the existing `selectable: false` flag:

1. PSO `id: "highlight"` marks a best-position overlay; it is not another particle.
2. Vision `id: fov-${a.id}` draws a translucent field-of-view overlay; it is not another fish.

Their x/y, size, formula, color, ID and painter order are unchanged. Actual particle, fish and food projections keep default selectability. Vision's existing inspector compatibility for a legacy FOV ID is retained; removing it would provide no necessary benefit. The shared canvas owns pointer/nearest/keyboard/chooser exclusion, so these two scripts add no event plumbing. This is a deliberate presentation-selection correction, separate from a behavior-preserving refactor.

Before editing, copies of both complete UI files were saved. Removing only the newly added `selectable: false` line from each result restores the original bytes exactly. These were the only source edits by this pass. Browser QA was notified before editing and after the tested commit; actual selection/flow/image rechecks are its separate gate.

## Independent before/after evidence

A fresh headless process captured 29 complete fixtures before and after this pass:

- Office, charging and goods default cumulative steps 0/1/3, including complete observations and exported scene projections.
- Zero populations, full capacity, retained occupancy above capacity, maximum populations/capacities, priority arrival/cancellation and Store full/blocked/collected transitions.
- PSO and Vision complete model observations at cumulative steps 0/1/3, including their exposed `randomState`, actual IDs and array order.

All 29 serialized fixtures are byte-identical. SHA256 of both complete files:

`7821bb6cec52ce7508eb533bab7a30a86c0381b1149210f311fd8c20657eb216`

Each DES projection was also called twice against the same observation and checked against a new `read()` to detect projection mutation. Temporary session artifacts are `/tmp/universal-ui-model-refactor-probe.ts` and `/tmp/universal-ui-model-refactor-{before,after}.json`. They are session evidence, not a new public continuation API. The independent all-146 baseline/replay and 98 exposed RNG snapshots remain separately owned evidence.

A separate fresh TypeScript AST comparison read every one of the **82** migrated `ui.ts` programs from baseline `a78bd2359e7a12ac537be131ca8d3023c4b718eb` and current source. After removing only the explicitly migrated old setters/new `change` property and the two separately proved selectable flags, all 82 complete programs are equal. This preserves projections, labels, groups, getter overrides, enabled predicates, scientific expressions and unrelated actions at syntax-tree level. The temporary probe is `/tmp/universal-ui-model-refactor-ast.ts`; it reused the already installed TypeScript parser without adding a dependency. This static check complements runtime dispatch/browser evidence; it does not replace it.

## Executed checks

- `bun test tests/universal-collections.test.ts tests/universal-live-changes.test.ts tests/ui-des-scene-kernel.test.ts tests/des-scenes-a.test.ts tests/des-scene-parity.test.ts`: **27 passed, 0 failed, 318,473 assertions**.
- All five frozen `examples/ui-live-changes/0*.ts` and all five frozen `examples/ui-collections/0*.ts`: passed unchanged.
- Both public example TypeScript configurations: passed, including negative cases.
- Frozen civic office, EV charging and goods-buffer headless model scripts: passed unchanged.
- `bun run typecheck`: passed, including Svelte **0 errors, 0 warnings**.
- Exact 29-fixture equality, two-file flag-only equality and 82-program normalized AST equality: passed.
- `git diff --check`: passed.

This report claims independent readability review, exact source/fixture preservation and the two intentional nonselectable-overlay edits. It does not claim acceptance of its own source edits by another reviewer, browser playback, pointer behavior, image approval, calibrated science or full-session continuation. Those independent gates remain coordinator-owned.
