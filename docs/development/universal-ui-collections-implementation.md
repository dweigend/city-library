# Collection projection implementation

The accepted synthesis and five Phase B public scripts were frozen in `9de6da8` before this runtime. This implementation extends the existing UI data pipeline; it does not add a view kind, renderer, scheduler, domain owner or per-model layout API. Shared public exports and `SpatialAgent.selectable` typing were coordinated with their owners.

## Reused modules and new responsibility

`ui/views/collections.ts` owns pure `collectionDiagram(rows)`, `CollectionRow` and `CollectionItem`. It imports only existing detached spatial types and the shared scientific palette. One set of named diagram tokens determines wrapping, annotation lines, glyph dimensions and unit-outline bounds. Layout coordinates are presentation units, not World/Grid positions. The helper returns ordinary `SpatialData` for the existing canvas, geometry, labels, descriptions, validation, resize and disposal paths.

The discriminated rows preserve distinct meanings. Identified items retain every input ID and supplied array placement, with explicit supplied/unordered description and no sorting or queue-policy inference. Anonymous counts are exact visible numbers, not fabricated selected people. Capacity reports exact used/capacity/unit and excess independently of every item row. Small integer quantities use nonselectable unit outlines; larger or fractional quantities use a symbolic frame and exact text, avoiding allocation proportional to an arbitrary quantity. Excess remains explicit. No person-to-slot assignment is invented.

The helper normalizes into detached records without modifying inputs. It rejects unknown fields/discriminants/orders/shapes, incompatible quantity/item fields, invalid ranges, duplicate row or item IDs, and collisions with deterministic length-prefixed decoration IDs. Own accessors, inherited required-field accessors and decorated/sparse arrays cannot execute hidden callbacks. Empty input yields a finite empty scene and `No collections`. Labels wrap through the shared defaults; item collections are complete rather than sliced at 200.

The existing canvas now excludes `selectable: false` symbols from mixed painted-bound pointer hits, legacy nearest-agent selection and keyboard enumeration. Explicitly nonselectable agents do not prevent the keyboard from reaching existing cells. The old circle/triangle and rectangle/diamond dispatch rules, rectangle-only extent contract, pointer drawing, coalesced resize frame, cancellation and stale-callback guards are retained. Boundary validation rejects nonboolean selectable values before updating the last valid scene.

## Executed source checks

- `bunx tsc --noEmit -p tsconfig.ui.json`: passed.
- `bun test tests/universal-collections.test.ts tests/ui-des-scene-kernel.test.ts`: 12 passed, 0 failed, 105 assertions.
- All five frozen `examples/ui-collections/0*.ts` public scripts: passed headlessly with original assertions after the separate office observation was integrated.
- `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json`: passed, including original negative type cases.
- The initial complete five-script attempt stopped at `02-priority-and-retained-capacity.ts` because the separately owned office observation had not yet added `waitingResidents`. That pending integration was reported; the later full five-script replay passed after the model owner supplied the actual detached Resource snapshot. No assertion was weakened.

The new helper tests exercise 1,200 identities, exact zero/fractional/maximum finite capacity, nonallocation for enormous anonymous quantities, neutral and explicit colors, order, detached mutations, duplicate/generated identity collisions and callback-free validation. Existing geometry assertions continue to cover painted bounds and numerical overflow. The public browser exercises are not claimed to have run in these headless commands.

This author implementation report is separate from the coordinator's full typecheck, independent tests/refactor/source review, both-host browser selection/paging/lifecycle checks and screenshot acceptance. No browser, whole-catalog or scientific-calibration approval is asserted here.
