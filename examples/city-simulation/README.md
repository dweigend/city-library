# City simulation author scripts

The original three user-accepted scripts are reference client code. The two additional integration probes exercise scarcity and machine lifecycle using the existing public API; their execution and review evidence is recorded separately. Keep their flat TypeScript workflow, short named rules and public imports. The library implements their contracts; the scripts do not adapt to private implementation details. Assertions follow the author workflow and use independent expected values.

| Script | Current status | Acceptance |
| --- | --- | --- |
| [Household budget](01-household-budget.ts) | Uses delivered APIs | Twelve monthly income/rent updates: balance 19000, tick 12, original membership and unchanged income/rent. Exogenous cash flows, not a closed economy. |
| [Neighborhood heat](02-neighborhood-heat.ts) | Uses delivered APIs | One regular-grid step: center 20, four face neighbors 22, corners 20, sum 188, tick 1. Equal cell capacities, closed boundaries, no external sources. Not a climate forecast. |
| [Generative quarter](03-generative-quarter.ts) | Unmet target; must fail today | Two seeded full-domain straight roads produce four blocks. Site 10000 m², road union 1536 m², land 8464 m². This supported rectangular fixture must fully subdivide into 100..400 m² parcels without lost area. |
| [Last resource unit](04-scarce-resource.ts) | Integration probe; execution evidence recorded separately | Two requests compete for stock 1. Explicit priority changes the winner without double allocation; rejected requests leave state intact. |
| [Shared machine](05-shared-machine.ts) | Integration probe; execution evidence recorded separately | Reservation does not consume stock; start does. Failure, repair order and pre-start cancellation preserve identity, exclusive occupancy and the declared material balance. |

The quarter retains all subdivision results and diagnostics. Its zero-residual expectation applies to these four supported convex rectangles, not arbitrary city geometry. More difficult cases require explicit remaining land. No street-frontage or historical-realism claim is made by this minimal fixture. A future access example adds labelled intervals without silently changing this accepted task.

## Run the scripts as tests

```sh
bun run examples:city
bun run typecheck:city
bun run examples:city:targets
bun run typecheck:city:targets
```

The first pair covers household, heat, scarce resource and shared machine. Record the new probes' actual run/typecheck results before claiming this expanded ready gate passes. The second pair includes those four scripts and the actual quarter script and is intentionally nonzero while its exports are absent. The target runner does not catch an expected failure and report success. It stops at the real failing assertion or unavailable public call. Target typechecking also reports inferred-type errors downstream of missing members; those are not suppressed with any or fake declarations.

The regular example registry and development typecheck should include all four scripts using delivered capabilities after integration checks pass. The original household and heat contracts remain unchanged; the two new probes add no library API. The target script is a named, documented open acceptance obligation, not an unreported skipped test. Once its complete phase passes, add that same file to both regular gates, preserving this full-target command as a regression gate. Check the current test commands before claiming a complete example-first delivery.

## Still needed for the quarter

| Proposed public function | Required capability |
| --- | --- |
| `geometry.corridor({ paths, width, endCap? })` | Width-eight butt-capped straight paths; exact admission, overlap/output and error semantics frozen before runtime. |
| `geometry.subtract({ shape, excludedShapes })` | Subtract the union of exclusions once, preserve components/holes, distinguish empty/unchanged/unsupported/failure. |
| `geometry.subdivide({ shape, method, ... })` | Deterministic bounded OBB recursion, minimum area, budgets, accepted and remaining shapes, numerical diagnostics. |

Use the existing proposed names. No route/extendPath/union/circle/sample API or manager is introduced by these examples. Complete method contracts and the [staged extension plan](../../docs/development/example-first/PLAN.md) govern the work. These five cross-domain references are not a replacement for four or five asserted scripts per new API expansion phase. The fourth and fifth scripts test model composition rather than adding core APIs.

## What is general, and what stays local

The six research lenses are state/balances, transformation, allocation/settlement, connections/transport, time/execution and observation/comparison. They are responsibilities to inspect, not new modules. The new probes deliberately use local model rules for priority, reservation, cancellation, repair and same-time ordering. A second domain using similar words is not sufficient reason to extract a manager or generic resource container.

Physical stock, reserved availability, service occupancy and throughput retain their own units and owners. Starting a process, consuming its input and completing its service are different transitions. A failed or cancelled process does not automatically undo consumed material, and `run` is not a transaction. Observations must leave state, time and RNG unchanged. Compare independent instances and an altered rule before proposing shared infrastructure.

Follow [the plan's generalization gate](../../docs/development/example-first/PLAN.md#generalization-gate) before adding any public operation. Geometry and routing are optional until shape or travel affects a model's result; the resource probes can progress without the quarter target. Original three script hashes remain unchanged. New probe hashes, executions and review evidence belong to their [own integration checkpoint](../../docs/development/example-first/INTEGRATION-VERIFICATION.md).
