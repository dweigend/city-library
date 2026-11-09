# Independent shared UI refactor

Scope: `ui/authoring.ts` and the shared collection, canvas, spatial validation, chart and table-page modules. This agent is independent of their implementation authors. Root-owned definition/exports/compose/Svelte components, experiments, tests and frozen examples were not edited. Both original refactor skills, their shared workflow and decision references, full coding standards and the accepted universal UI decisions were read before diagnosis.

## Clarity changes

Only `ui/views/collections.ts` needed a concrete clarity refactor:

- `normalizeItems` names the item boundary separately from row-discriminant validation. It keeps identity uniqueness, default labels/colors/shapes and validation order together without a generic validation framework or extra module.
- `usesUnitOutlines` names the capacity representation decision once. Population/layout sizing and drawing now use the same predicate, replacing a repeated inverted compound expression. Integer unit outlines versus symbolic fractional/large frames retain exact behavior.

Retained the existing authoring normalization and conditional type boundary: they have one owner and existing compatibility evidence. Retained table paging's small pure calculation, chart lifetime state and canvas lifecycle together; extracting wrappers would add indirection without a new responsibility. No coordinate, palette, entity ID, order, size, count, unit, public type, error message or domain behavior was intentionally changed by this refactor.

## Exact before/after fixtures

A temporary probe called the public `collectionDiagram` through `ui/index.ts` with 87 collection inputs: empty data; every pair of used/capacity from zero, 1, 2, 31, 32, 33, 0.5, 2.5 and `Number.MAX_VALUE`; and complete mixed-shape item lists of 0, 1, 11, 401 and 1,200 identities. It also compared four existing normalized write paths (default, local override, keyed and legacy) and 20 page/length combinations. These latter internal probes are refactor evidence, not new public consumer contracts.

All 111 serialized results compared byte-for-byte equal. Before and after SHA256:

`ee0f260a637dec077fbd731e9c95009b2edd54542c812bdaad5da58777906e38`

Temporary artifacts: `/tmp/universal-ui-refactor-snapshot.ts`, `/tmp/universal-ui-refactor-{before,after}.json`. The committed frozen authoring examples and focused tests remain repeatable gates; these temporary files are not a claimed continuation API.

## Executed checks

- Six focused suites: `universal-collections`, `ui-des-scene-kernel`, `universal-live-changes`, `ui-authoring`, `ui-authoring-next`, `ui-chart-authoring`: **36 passed, 0 failed, 241 assertions**.
- All five `examples/ui-live-changes/0*.ts` and five `examples/ui-collections/0*.ts`: passed.
- Both example directories' TypeScript consumer configs: passed, including their negative cases.
- `bun run typecheck`: passed; Svelte reported **0 errors, 0 warnings**.
- `git diff --check`: passed.

These are author checks of this refactor. Browser interaction, screenshot acceptance and independent final code/design approval remain coordinator-owned separate gates. The refactor makes no visual change and does not appropriate earlier UI approvals.

## Separate behavior finding

During this pass the independent test author reported that an Array subclass's inherited `map` override can execute when collection normalization uses the validated original array. This finding is separate from the clarity refactor above. The coordinator authorized a distinct correction to copy validated own data descriptors into a plain array before invoking any array methods. Its fix and regression evidence will be recorded separately below; no frozen assertion is to be weakened.

### Approved correction: inherited array hooks

The independent test author reproduced a collection Array subclass overriding inherited `map`: the old boundary validated own entries but returned the caller's array, so normalization invoked the override and could return an empty scene instead of the supplied identities. This was a real behavior defect, not a readability preference. The coordinator explicitly authorized a separate correction.

The array boundary now snapshots own property descriptors into a private local Map, validates the data entries, then copies indexed descriptor values into a fresh plain array. Later mapping cannot invoke the input's inherited `map`, iterator, constructor or `Symbol.species`. Legitimate subclass contents remain supported. Own accessors, holes and extra fields keep their existing rejection semantics. The private descriptor lookup is validation state only, not an identity registry, cache or domain owner. Both outer rows and nested item arrays use this one boundary.

The independent author added regression `inherited array methods, iterators and species cannot erase identified items` in `tests/universal-ui-adversarial.test.ts`. It checks zero inherited-hook reads and exact preserved identities for outer and nested arrays, including the subclass species getter. Its original failing repro and independent test authorship remain in the separate test report.

Post-correction checks executed by this refactor author:

- Public collection, independent adversarial and shared geometry suites: **21 passed, 0 failed, 3,974 assertions**.
- All five frozen collection scripts and their typed consumer/negative cases: passed.
- The original 111 ordinary-output snapshots still compare byte-for-byte equal with the same SHA256 recorded above. Only the buggy inherited-array behavior intentionally changes.
- Scoped UI TypeScript: passed. An initial attempt to type the descriptor object as an Array-mapped descriptor exposed an inappropriate `length` type; the private keyed descriptor Map corrected that typing without a broad cast or public type weakening.
- Full `bun run typecheck`: the first post-correction run caught two in-progress independent-test typing errors (missing `override` and readonly expected-array inference). The test author corrected those without changing assertion contents; the final rerun is recorded below.

This correction changes no ordinary scene geometry, entity ID, scientific palette, time, RNG or model action. New browser checks and independent final source approval still belong to the coordinator's separate gates.

Final post-correction `bun run typecheck`: **passed**, including Svelte **0 errors, 0 warnings**. No frozen script or test assertion was edited by this agent. The clarity refactor was committed separately as `bbfd5ee`; this behavior correction has its own subsequent commit.
