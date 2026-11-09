# Independent model and scene refactor

Scope: the eleven DES model/UI scripts after implementation commits `ce91be4`, `62f6031` and `48a4349`. This refactor author did not implement those slices. Shared renderers, public schema, tests and frozen examples are outside this ownership.

## Preparation and decisions

Read the full coding standards, the original checkout's `refactor-model-scripts` and `refactor-library` skills, their shared workflow and both decision examples. Applied the global frontend-design, frontend-design-shadcn-svelte and standalone shadcn-svelte guidance to the declarative scene boundary. Inspected the actual accepted elevator, EV, water and maintenance PNG references. References define visual direction; model observations remain authoritative for counts and topology.

Concrete changes:

- Separate elevator `reserveNextCall` from `boardNext`. The former names empty-car dispatch intent; the latter visibly handles direction, eligibility, capacity and boarding events. The same branch order and reservations remain intact.
- Compute elevator cabin seat rows/columns once per car, with a descriptive `seatRows` name. Preserve the coordinator's pending `elevatorScene` export for public projection checks.
- Name the EV slot projection `chargerPoint` to distinguish charger positions from vehicle positions.
- Resolve water district presentation status and semantic stroke together, replacing duplicated nested conditional expressions.
- Replace maintenance's nested palette expression with explicit status branches, retaining the prior waiting fallback and the model's existing public string type.

Retained the other seven scene implementations. Their short pure projections already expose the mechanism directly; extracting a common queue/scene engine or splitting their small files would add indirection. Retained elevator model closure ownership and ordered event handlers together rather than splitting solely to meet a line threshold. No model policy, parameter, event time, queue order, capacity ownership, measurement or numeric diagram geometry changes.

## Before/after evidence

A fresh Bun process constructed each default model in this fixed order: office, charging, buffer, bus, parcel, waste, emergency, bike, water, maintenance, elevator. Each instance advanced incrementally to times 0, 1, 4, 10 and 20. At each time the probe serialized the complete detached observation and its exported scene projection. A second fresh process ran the identical probe after refactoring. Neither probe normalized or omitted identity fields. All 55 observation/scene pairs compare byte-for-byte equal with `cmp`.

Both complete JSON files have SHA-256:

`299b76703386562d9d84f0ff7b4e41e0da302d68c513b3a16cffb6d35a4b83e9`

Local evidence files: `/tmp/des-model-refactor-{before,after}.json`; probe: `/tmp/des-model-refactor-snapshot.ts`. These temporary artifacts are evidence from this session, not portable repository fixtures. The committed existing public scripts and independent parity tests remain the repeatable behavioral gates. No random sampling call or execution order was changed; this comparison does not claim a new full-continuation API.

## Executed checks

- All five `examples/des-elevator/*.ts`, all ten `examples/des-models/*.ts`, and all five `examples/des/*.ts`: passed unchanged.
- `bun test tests/des-scenes-a.test.ts tests/des-scenes-b.test.ts tests/des-elevator-adversarial.test.ts tests/des-scene-parity.test.ts`: 24 passed, 0 failed, 515,568 assertions. These independently authored tests include maximum populations, retained capacity, disposal, opposite-direction calls, zero-duration chains, queue fairness and observation purity.
- After replacing an initially over-narrow maintenance palette lookup rejected by TypeScript, `bun test tests/des-scenes-b.test.ts`: 5 passed, 0 failed, 7,862 assertions; complete snapshot comparison repeated unchanged.
- Final `bun run typecheck`: passed, including Svelte with 0 errors and 0 warnings. The initial palette lookup failure was fixed rather than suppressed with a cast.

Browser interaction, responsive screenshot inspection and independent final source approval remain separate coordinator-owned gates on the integrated result. This report claims preserved source-level scene output and executed headless checks, not browser acceptance or independent approval of its own edits.
