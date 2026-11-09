# Independent universal UI source review

Reviewer: independent native Codex reviewer, distinct from implementation, migration, refactor and test authors. Baseline: `a78bd2359e7a12ac537be131ca8d3023c4b718eb`, branch `feat/salabim-concepts`. Source inspection covers the universal additions through the model/UI script refinement `b1051eb`, with the precise type-compatibility correction rechecked separately below. This is a source/contract review, not browser, actual-image, scientific-calibration or full-workspace approval.

## Finding and corrective disposition

**Medium: preserve the exported interface extension contract.** The first implementation changed exported `UISpec` from an interface into a discriminated union alias. Ordinary `defineUI` calls and the frozen type projects worked, but an existing downstream declaration `interface ExtendedSpec extends UISpec<P, M> { marker?: string }` failed with TS2312. The reviewer reproduced the failure with a standalone consumer and confirmed that the same consumer compiled against a copy of the baseline definition (only its relative Definition import was made absolute for the isolated probe). This was a concrete public type-surface regression, not a runtime failure.

The coordinator chose compatibility preservation. The correction restores `UISpec` as an interface retaining its required-set keyed/legacy shape, adds the precise `ChangeUISpec` interface for an explicit required common action with optional field setters, and uses their union internally for the **same** flat `defineUI` call. Both public UI adapters export the specialization. The original four overloads, `NoInfer` protection and monitor getter/formatter correlation remain. New Phase A common-change annotations now name `ChangeUISpec`; their declaration objects, callbacks, arguments, assertions and negative cases are unchanged. The amendment and hashes are recorded in the example README. Existing ordinary source syntax and interface extension are preserved without weakening the common-action requirement.

Initial corrective inspection verified the isolated legacy consumer, both frozen type projects and both SHA256 manifests. The first full development type pass identified two remaining common-change annotations in the new independent adversarial test that still named `UISpec`; those are part of this same type-only disambiguation, not a runtime or test-expectation change. Resolved in `819f5ff9526b8b92ce676eec056b8f69683de679`. The reviewer inspected that exact commit, including the two new test annotations, and confirmed that only type imports/annotations changed there. The original standalone interface-extension consumer now compiles. `tsconfig.dev.json`, both frozen type projects and the 43-test suite pass independently after this commit. No runtime assertion or old type-negative expectation was relaxed.

## Inspected design and implementation

- The additions reuse `defineUI`, shared authoring normalization, both existing hosts, model actions, existing chart/canvas renderers, shadcn controls and the scientific palette. There is no new renderer, scene DSL, widget registry, domain clock, hidden model step or UI-owned capacity/queue.
- The explicit common write action receives one own decoded key per host edit. A local setter wins. Missing writes reject, legacy arrays retain their old setter contract and cannot acquire a competing default. Draft edits do not call model actions before Setup. Existing action failure semantics are preserved; there is no new general rollback promise.
- `collectionDiagram` validates discriminants, allowed own data fields, numeric ranges, order/shape enums, duplicate identities and generated-decoration collisions. Items, anonymous counts and capacity quantities are separate. It preserves supplied identities/order without inventing seat assignments, reports exact zero/fractional/retained quantities and never silently slices identified items. Layout tokens have one owner. It returns detached ordinary `SpatialData` without domain imports or mutable module caches.
- The inherited-array correction `f8143bd` copies validated indexed own data descriptors into plain arrays before normalization. Input `map`, iterators, constructors and species hooks cannot erase identities or execute as projection hooks. Both nested item arrays and outer rows use this boundary. The independent poisoned-subclass regression is meaningful and passes.
- Nonselectable spatial decorations are excluded from mixed painted-bound hits, legacy nearest hits and keyboard enumeration. Existing old symbols retain their normal defaults. Cell drawing/selection remains distinct. Resize coalescing, cancellation, last-valid canvas validation and late-callback guards are preserved.
- Tables expose all rows via host-owned 200-row pages, preserving first-record column order and blank missing values. Shrinking clamps pages, Setup recreates paging state, and empty data is explicit. The Svelte correction `f91b27e` computes a local projected row array before assigning reactive state, avoiding an effect that reads its own written rows. Paging invokes no model action and creates no entity IDs.
- Chart default colors remain stable for unique labels during a mounted view. Explicit colors win; duplicate labels retain positional fallback. The state is local presentation state and resets with the mounted view. Old fixed series, categorical gaps, signed values, axes and unit labels retain their semantics.
- Office adds only a detached waiting-owner snapshot directly from Resource.waiting. Its scene consumes that order; EV uses its canonical priority queue and goods uses Store snapshots. Identified holders are separate from anonymous capacity units. The three helpers are short and readable; no extra wrapper is warranted. Elevator, route and Grid geometries remain in the same low-level spatial pipeline.
- Reviewed actual migration examples include Taxi's hyphenated grouped fields, Wolf/Sheep's enabled predicate, Virus's explicit transforming override, Heat's fixed NetLogo mapping, Traffic's drawing/follow transform and CRISPR's source-specific portrayal. Their changes are limited to the common writer, supported by whole-program normalized AST evidence. The all-146 audits and final manifest are source inventories; this review does not appropriate a new exhaustive scientific review of 146 mechanisms.
- The final PSO best-position and Vision FOV decorations alone opt out of selection. Their coordinates, sizes, formulas, colors, IDs and painter order remain unchanged; actual agents retain default selection. This is an explicit presentation correction, distinct from behavior-preserving refactoring.

The old scene tests' desk/slot prefix, coordinate-direction and extra fake priority-marker expectations were intentionally updated for the approved new projection. New assertions preserve or strengthen actual identity count, canonical queue order, exact capacity/excess, priority shape and projection purity. Frozen public model examples were not weakened. Retaining source palettes, fixed/relative normalization and meaningful physical coordinates is the correct alternative to a generic scale layer or gratuitous mass rewrite.

## Checks executed directly by this reviewer

```sh
bun test tests/universal-ui-adversarial.test.ts tests/universal-live-changes.test.ts \
  tests/universal-collections.test.ts tests/ui-chart-authoring.test.ts \
  tests/ui-des-scene-kernel.test.ts tests/des-scenes-a.test.ts tests/des-scene-parity.test.ts
```

Result: **43 passed, 0 failed, 322,395 assertions**. Repeated after the type correction with the same passing result.

Also executed directly:

- Both new five-script phases headlessly: all ten scripts passed.
- `bunx tsc --noEmit -p examples/ui-live-changes/tsconfig.json`: passed.
- `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json`: passed, including negative cases.
- Both phase `SHA256SUMS` manifests: all files passed after the documented type-only amendments.
- Isolated baseline/current `UISpec` interface-extension probes: original regression reproduced, corrected current interface consumer passed.
- Final `bunx tsc --noEmit -p tsconfig.dev.json`: passed, including the new interface-extension regression and all existing development consumers.

The coordinator's all-146 baseline/parity evidence, 294 exposed RNG samples, all-146 actual catalog smoke, 82 live edits, both-host browser scripts, pending full check and independent screenshot work are separate evidence. They are not represented as checks executed by this reviewer. Unexposed RNG continuation, complete-state restoration, universal accessibility and scientific calibration are not claimed.

## Verdict

**APPROVED — source, contract transfer and regression safety through `819f5ff9526b8b92ce676eec056b8f69683de679`.** The public type-surface finding is fixed and independently rechecked. No unresolved blocking source/runtime finding remains within this review scope. Browser interaction, actual-image acceptance, full-workspace checks and the separate Gemini substantial review remain independent gates; this approval does not replace them.
