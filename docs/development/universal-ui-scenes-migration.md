# Three DES scenes use the shared collection projection

This scoped implementation follows the accepted [universal UI decisions](universal-ui-decisions.md) and Phase B example-first freeze `9de6da8`. It changes only the office, charging and goods scene helpers plus one additive office observation. Their existing `ui.ts` declarations, public actions, scientific rules and exported projection names remain unchanged. Shared projection implementation and independent runtime/browser acceptance have separate owners.

## Reuse and author-facing changes

All three helpers return existing `SpatialData` through public `collectionDiagram` from the existing UI entry. They no longer calculate scene width, wrapping, slot extents, symbol sizes, annotation coordinates or decorative IDs. Those defaults belong to the single shared projection and existing canvas pipeline. The three local helpers now contain 93 physical lines instead of 209. Fewer lines are a consequence of removing duplicated presentation responsibilities, not a target or permission to hide domain rules.

| Scene | Model-owned data used | Intentional presentation change |
| --- | --- | --- |
| `officeScene` | Actual ordered Resource waiting owners; resident grant/release ledger; Resource busy and clerk capacity | Separate waiting, in-service and completed identities from anonymous clerk-capacity units. Resident circles retain `resident:n`; no resident is placed into an invented numbered desk. |
| `chargingScene` | Actual Resource `waitingVehicles`; vehicle grant/release/cancel status; active units and charger capacity | Keep policy-sorted waiting order and every `vehicle:n` across states. Priority vehicles are diamonds rather than a second selectable `priority:n` marker; ordinary vehicles are rectangles. The description states this distinction. Capacity is a separate anonymous row. |
| `bufferScene` | Actual Store waiting puts, stored crates and collected deliveries; stored count and bounded capacity | Preserve exact `crate:n` identities through the three ownership states, with blocked/stored supplied order. Store capacity is a separate anonymous row; crates are not assigned to numbered physical storage slots. |

Rows explicitly use the existing `scientificPalette` statuses. Capacity uses neutral anonymous symbols so duplicated visual capacity cannot be mistaken for extra service people or crates. All capacity decorations are nonselectable; identified entities retain their IDs. Retained overcapacity is reported exactly by the shared helper. The display does not equate the number of identified items with arbitrary Resource units, perform queue sorting, infer physical geometry, hide completed entities or truncate large populations.

Waiting order is declared `supplied` only for snapshots supplied by Resource/Store. In-service and completed ledgers are collections, not newly claimed queue policies. Minutes remain the model time unit; clerk capacity is expressed in the frozen example's seats, chargers in vehicles and the buffer in indivisible crates. No battery, traffic or physical storage calibration is introduced.

## Additive office observation

The sole model-source edit is:

```ts
waitingResidents: desks.waiting.map((request) => request.owner),
```

It executes only while reading the already-owned Resource queue and returns a fresh array. There is no parallel waiting cache, ordering rule, event, counter or mutable reference. Existing observation fields, actions, validation, capacity policy, timing and history remain unchanged. The model uses no Random stream, so this addition consumes no RNG draws.

Before the edit, a fresh process saved fourteen complete old-field observations: default times 0/1/3; three occupied desks reduced to capacity one; arrival during retained service; completion, capacity increase and draining; and maximum 100-resident/10-clerk setup with shrink and later completion. The same probe after the addition removed only `waitingResidents` before comparison. Both files are byte-identical, SHA256:

`633fc9c6eba314c52dd383d24a147be9f332b9328d9356981ce17515fd2c268f`

Session artifacts and repeatable probe are in `/tmp/universal-ui-scenes-migration/{office-snapshots.ts,office-before.json,office-after.json}`. These temporary files are not portable repository fixtures. The frozen Phase B script independently asserts the exact new waiting owners `[3]` under retained capacity and detached-array behavior. Existing public model scripts remain the portable behavioral contracts.

## Executed checks

- All five frozen `examples/ui-collections/0*.ts` scripts executed in Bun: passed unchanged.
- `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json`: passed, including negative discriminant/unit/order assertions.
- All ten `examples/des-models/01..10` scripts executed in Bun: passed unchanged.
- `bunx tsc --noEmit -p tsconfig.ui.json`: passed on the integrated UI and experiment sources.
- Temporary semantic probe: 303 projections across maximum office/charging/buffer configurations through times 0–100 passed. Every actual resident/vehicle/produced crate appeared exactly once among selectable identities; generated capacity decorations were excluded; bounds were finite, IDs unique and observations unchanged after repeated projection. The probe also checked actual EV priority order `[4,2,3]`, cancellation `[4,3]`, diamond priority shape, Store transitions `[3,1,2]` → `[2,3,1]`, detached office owners and exact `3 of 1 seats` / `2 excess` description.
- `git diff --check`: passed.

These are author checks. They do not claim independent source approval, browser rendering, screen-reader certification, screenshot acceptance or complete RNG continuation for unrelated models.

## Earlier presentation-specific tests requiring coordinator disposition

The old scene suites were executed honestly: `bun test tests/des-scenes-a.test.ts tests/des-scene-parity.test.ts` produced **6 passed, 4 failed, 208,523 assertions**. The failures identify intentional portrayal changes, not model regressions:

1. `des-scenes-a.test.ts:23` expects a `desk:` decorative prefix. The new shared capacity row uses its own nonselectable IDs and does not invent assigned desks. Later description assertions in that test also use the old prose (`3 in service`, `2 retained`); the new row summary gives exact counts and excess instead.
2. `des-scenes-a.test.ts:37` expects the first priority vehicle to have a greater x coordinate. The shared layout preserves supplied queue order in ordinary left-to-right placement, reversing the old negative-x layout direction. Its later `priority:` marker assertion is replaced conceptually by the same vehicle's diamond shape.
3. `des-scenes-a.test.ts:49` expects a `slot:` decorative prefix. Actual crate identities, colors and Store transitions are retained; anonymous capacity is no longer an assigned physical slot layout.
4. `des-scene-parity.test.ts:74` first stops at the old `desk:` prefix; its later `charger:` and `slot:` expectations likewise describe the previous implementation. Counts should distinguish identified items from nonselectable capacity decoration rather than infer public identity from a private packing prefix.

No test or frozen example was edited by this scoped owner. The coordinator and independent test owner must explicitly reconcile these presentation expectations with the accepted new contract while retaining complete entity/color/capacity/order checks. Bus, parcel, spatial-service and elevator tests passed in that run; their scenes were not changed here.
