# Independent universal UI tests and model parity

This independent test pass verifies the implemented authoring changes against the accepted [decisions](universal-ui-decisions.md), both frozen five-script authoring phases and the complete pre-migration [baseline](universal-ui-baseline.md). The reviewer did not implement or refactor the UI runtime, change a model, or alter a frozen public script. Browser and actual-image acceptance remain separate gates.

## Public consumers and adversarial behavior

`tests/universal-ui-adversarial.test.ts` adds nine independent cases. Both public UI entries expose the same pure `collectionDiagram` capability and accept inert typed declarations. Public collection consumers cover unknown fields and discriminants, incompatible union fields, sparse arrays, accessor rejection without evaluation, duplicate and decoration-colliding identities, exact supplied order, detached output, item/row color precedence, fractional and retained capacity, zero and large anonymous counts, and 1,200 complete identified items. Every retained item remains inside finite diagram bounds and selectable by default; anonymous capacity cannot become a person or assigned seat.

Two deliberately identified internal boundary checks supplement those public consumers. The shared authoring normalizer verifies descriptor decoding, fresh single-own-key writes, exact hyphenated input keys, local-set precedence, independent model instances, no hidden step, invalid-input rejection before either action, and unchanged legacy setters. The existing shared table page kernel verifies complete row coverage at 0, 1, 199, 200, 201, 400, 401 and 1,200 rows; exact ranges, previous/next flags, large signed requested-page clamping, shrinking data and no input mutation. These kernel tests are not presented as public authoring APIs or replacements for actual DOM event, paging, selection or lifecycle checks.

Selectable validation separately preserves omission as the old default and rejects nonboolean flags. Actual pointer/keyboard behavior, chooser behavior where present, redraw scheduling and both rendered table hosts belong to the independent browser evidence.

## Finding and correction

The initial public adversarial probe found an inherited-array-method defect in `collectionDiagram`. A valid `Array` subclass overriding `map()` could execute its own code and return an empty array: one actual identified item disappeared and the helper reported `No collections`. The original standalone probe recorded one override invocation. This is distinct from an intentional presentation change or clarity refactor.

The coordinator assigned the runtime correction to the independent UI refactor owner. Commit `f8143bd` now validates own indexed data descriptors and copies their values into a plain detached array before normalizing. Valid subclasses retain their actual contents. Inherited methods, iterators, constructor accessors and species hooks do not execute. The preceding clarity-only refactor is separately committed as `bbfd5ee`; it is not credited with fixing this defect.

The new regression poisons inherited `map`, `constructor` and iterator getters on both the outer rows and nested items arrays, and separately supplies an `Array` subclass species getter. It requires the exact supplied identities and zero hook evaluations. The corrected implementation passes. This testing agent made no runtime correction.

## Approved presentation-test reconciliation

Only `tests/des-scenes-a.test.ts` and the service-scene part of `tests/des-scene-parity.test.ts` changed. Their original model, transport, spatial-service, elevator, population, geometry and repeated-projection assertions remain active. No frozen example changed.

| Earlier presentation expectation | New equally explicit invariant | Accepted reason |
| --- | --- | --- |
| Office `desk:` decoration prefix and one nominal desk after capacity shrinks | All four residents still appear once. Anonymous decorations represent three used units, one nominal neutral unit and two excess units; exact `3 of 1 seats` / `2 excess` text; model/read purity remains asserted. | Capacity is independent of assigned resident identity; retained claims remain visible. |
| Office `3 in service` / `2 retained` prose | Exact `Residents in service: 3 items` and `Clerk capacity: 3 of 1 seats; 2 excess above capacity` summaries | The shared row summary preserves quantities without keeping obsolete local prose. |
| Priority vehicle has a larger x coordinate, plus a second `priority:` marker | The first supplied priority vehicle is left of the next ordinary vehicle; actual waiting IDs equal the Resource-owned `waitingVehicles` array. The same canonical vehicle is a diamond, ordinary vehicles are rectangles, and each vehicle appears exactly once. | Shared ordinary left-to-right layout replaces local reversed placement and duplicate marker identities. |
| Goods `slot:` decoration prefix | Anonymous capacity has exactly the model's capacity units, exactly `stored` filled units and an exact unit-bearing capacity summary. All actual crate identities, blocked/admitted colors and transitions remain asserted. | Store quantities do not imply assigned physical slots. |
| Service parity infers capacity by `desk:` / `charger:` / `slot:` prefixes | Capacity is counted by explicit `selectable: false`; occupied/excess totals and actual queue order are checked across all sampled model steps. | Public semantics replace private packing-ID conventions. |

Assertion coverage increased: the office retained-capacity distinction, actual Resource queue order, filled capacity and canonical priority shape now have direct checks. Neither scientific expectations nor accepted public model behavior were removed to accommodate the new runtime.

## Complete 146-model replay

A fresh-process replay captured all 146 models at requested cumulative steps 0, 1 and 3 on source head `9bc4a3409992011130c92389d45a7a9225375e18`. Every unchanged default factory and headless UI import passed, with no failures or timeouts. The later shared-array and table-host corrections do not change any model source.

The comparison removes **only** `des-civic-office` frame `observation.waitingResidents`, the explicitly approved new detached Resource-owner snapshot. It requires that field to be present, be a unique list of positive resident numbers, match the actual waiting count and reference waiting residents. This does not reconstruct or claim a queue policy from the ledger; the frozen public example and new scene tests independently check the actual supplied order. No IDs, other observation fields, collection order, numbers or timestamps are normalized.

| Comparison | Result |
| --- | --- |
| Raw full observations, without normalization | 145 / 146 exact; only the approved office addition differs |
| Complete original observation fields after the single approved removal | 146 / 146 exact |
| Models exposing `randomState` | 98 |
| Exact exposed RNG-state points compared | 294 / 294 equal |
| Exported DES scene projections | Eight unchanged; office, EV and goods intentionally changed |
| Non-exported ordinary UI callbacks | Not claimed as headless projection coverage |

The original baseline remains `/tmp/universal-ui-baseline/before/`. New complete captures are `/tmp/universal-ui-baseline/after-universal/`. The narrowly scoped comparison command is:

```sh
python3 /tmp/universal-ui-baseline/compare-universal.py \
  /tmp/universal-ui-baseline/after-universal
```

It writes `comparison-approved-office-addition.json`, SHA256 `caf4944431aa8cbba201027812b6ed929a836bc6e7dfe454abed3ec2f91074e7`. The after-manifest SHA256 is `dfd26246ce4bd1cffda2240432140cce49735468279a611818e86afd3116aaea`. These large compressed session artifacts are local evidence, not portable package fixtures. The committed adversarial suites and frozen public examples provide repeatable source gates. RNG equality applies to the exposed sampled states; it does not establish unexposed RNG continuation for the other 48 models or complete simulation restoration.

## Executed checks

- `bun test tests/universal-ui-adversarial.test.ts tests/universal-live-changes.test.ts tests/universal-collections.test.ts tests/des-scenes-a.test.ts tests/des-scene-parity.test.ts tests/ui-des-scene-kernel.test.ts`: **36 passed, 0 failed, 322,342 assertions** against the corrected source.
- `bunx tsc --noEmit -p tsconfig.dev.json`: passed. The first attempt identified two mistakes in the new test's typing (a required static `override` and Bun's mutable/readonly expectation overload); both were corrected without changing runtime expectations.
- `bunx tsc --noEmit -p examples/ui-live-changes/tsconfig.json` and `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json`: passed, including their unchanged negative type cases.
- All **35** numbered public scripts from the two new authoring phases, earlier five spatial scripts, five core DES scripts, ten DES model scripts and five elevator scripts: passed. Actual outcomes are in `/tmp/universal-ui-baseline/public-examples.json`.
- `sha256sum -c SHA256SUMS` in both new authoring directories: all files passed, including frozen scripts, negative type cases, README and tsconfig.
- `git diff --check`: passed.

**Independent test/parity gate: PASS.** The inherited-array finding is corrected and protected by an independent regression. This report does not appropriate the separate refactor author's evidence, substantial design/source approval, full-workspace check, real-browser interactions or screenshot inspection.
