# What works today

This page is the starting point for checking whether a library operation is available. It is not a separate source of truth: an operation counts as available only when its public export, exact contract, asserted public example and an executed check agree. The [package entry](../../index.ts) lists the exports, and the [API specification](../agent-loom/README.md) defines the broader target. A target signature is not a promise that the operation is available today.

Three other questions have their own owners. UI availability comes from `ui/index.ts` and the [UI contract](../ui/README.md), not from the root export. Model acceptance is tracked in the [catalog ledger](../../models/catalog/progress.json). Library availability and scientific validation of a model are different axes.

## Available capabilities

This inventory is based on the public exports and their implementation modules. Use the linked examples and exact API contracts for supported inputs and failure behavior; a row does not establish complete compatibility with every target operation.

| Area | Available public surface | Start here |
| --- | --- | --- |
| Agents and worlds | `Agent`, `World`, `run`, `Tick`; ownership, lifecycle, synchronous execution and spatial actions | [Agent/world examples](../../tests/public-contracts/world-lifecycle), [spatial examples](../../tests/public-contracts/spatial) |
| Random streams | `Random`, `RandomState`; standard Mulberry streams, sampling, normal/exponential/Poisson/Bernoulli/triangular/gamma draws, copy and continuation | [Random examples](../../tests/public-contracts/agent-selection), [distribution examples](../../tests/public-contracts/random-distributions), contracts for [normal](normal-distribution-contract.md) and [exponential/Poisson](random-exponential-poisson-contract.md) draws |
| Grids and fields | `Grid`, `Field`; lookup, neighborhoods, canonical occupancy and diffusion | [Grid examples](../../tests/public-contracts/grid), [occupancy contract](indexed-occupancy-contract.md), [Fire, Life and Percolation compositions](grid-models-contract.md) |
| Graphs | `Graph`, `Edge`, `GeneratorOptions`; collections, copies, connectivity, distances, analysis and generation | [Graph contract](graph-copy-contract.md), [connectivity](graph-connectivity-contract.md), [distances](graph-distances-contract.md), [weighted precision](graph-distance-precision-contract.md), [analysis](network-analysis-contract.md), [generators](graph-generators-contract.md), [ordered topology](topology-generator-variants-contract.md) |
| Geometry | `geometry.direction`, `normalize`, `distance`, `map`, `contains`, `bounds`; spatial and Planar types | [Spatial probes](spatial-probe-contract.md), [affine mapping](affine-map-contract.md), [planar queries](planar-geometry-contract.md) |
| Layouts and parcels | `topology`, layout-backed `Grid`, `geometry.area`, `merge`, `split` | [What works for grids, layouts and parcels](../grid-parcels/STATUS.md) |
| Statistics | `stats.histogram`, `gini`, `describe`, and readonly `Histogram`/`Summary` types | [Statistics examples](../../tests/public-contracts/stats/README.md), [summary contract](statistical-summary-contract.md) |

[Execution and study capabilities](../execution-studies/STATUS.md) also exposes `measurements`, bounded `storage.history`, serial `studies.design/replicate/run/summarize`, `world.activate/report/select`, `twoPhase`, `continuous`, `Agenda`, `ServiceQueue`, `Resource`, `Store`, `Signal`, `EventTrace` and `TimeWeighted`. The [measurement scripts](../../tests/public-contracts/model-measurements), [dynamics scripts](../../tests/public-contracts/model-dynamics), [attachment scripts](../../tests/public-contracts/graph-attachment) and [DES scripts](../../tests/public-contracts/des) exercise these public contracts; the [discrete-event contract](des-contract.md) defines their composition. Fixed, shuffled and stable priority activation preserve lifecycle and explicit clocks; full specified execution-profile coverage remains open.

These capabilities can be composed independently. Model-specific procedures and observations live in each model; UI exports are separate from the headless package.

Run `bun run check` to verify configured types, tests, public examples, build and packed consumers. UI changes also require their own real-browser and visual acceptance; library checks do not establish scientific validity for an adapted model.

## Required target

The specification covers 309 operation/type entries across 16 reference areas. Every target entry needs a public export, explicit behavior contract, executable public example and relevant verification before it can be called complete. Existing capability-level coverage does not establish full core parity.

Broader requirements include complete compatibility profiles, paths and routing variants, generic Input, advanced study binding/transport/continuation, codecs and supported complete-state continuation. Bounded History and serial studies do not imply those broader capabilities. Check the public exports and operation reference when defining the next capability; do not infer missing operations from directory scaffolding or mark an entire reference area complete from one implementation.

## Source reconciliation and remaining scope

This is a source-level reconciliation of the current root exports and implementation contracts, not an operation-level acceptance claim. The API table still describes itself as 309 entries, but counting its `###` operation/type headings gives 312 across the same sixteen areas. Those headings contain 270 distinct names and 42 repeated-name headings for overloads. The difference is explained: 309 headings carry `api-*` anchors (301 numeric, 8 named), and three additive headings had none (`random.number` additive variants, `agenda.size`, `agenda.next`); they now carry `api-random-number-additive`, `api-agenda-size` and `api-agenda-next`. The [API inventory](../agent-loom/api-table.md) now also covers the whole system beyond this original core scope. Resolve stable operation IDs, overload grouping and additive entries against the detailed reference before reporting a completion denominator. Do not remove entries or narrow the binding scope to repair a count.

| Reference area | Observed headings | Current source boundary | Concrete remaining comparison |
| --- | ---: | --- | --- |
| World | 25 | [World](../../library/world/world.ts), [run](../../library/world/run.ts), [activation](../../library/world/activation/index.ts) | Membership, tick and activation are public. `world.inputs` and Input attachment are not delivered; compare every activation overload and compatibility profile. |
| Agent | 27 | [Agent](../../library/agent/agent.ts), [spatial actions](../../library/agent/spatial.ts) | Compare all spatial overloads, copy/reserved-state failures, boundary and RNG behavior; source presence is insufficient for complete compatibility. |
| Grid | 10 | [Grid](../../library/grid/grid.ts), [layout Grid](../../library/grid/layout-grid.ts) | Match regular-grid overloads and field/occupancy/diffusion contracts. Keep additive finite layouts separate from square/cubic parity. |
| Field | 6 | [Field](../../library/grid/field.ts) | Verify each identity, coordinate and owning-grid guarantee through public Grid consumers. |
| Graph | 44 | [Graph](../../library/graph/graph.ts), [algorithms](../../library/graph/algorithms) | Copy, connectivity, distances, analysis and generators exist. Public interface lacks target families including `view`, `traverse`, `findRoute`, `routes`, `bridges`, `articulations`, communities, matching, flow, layouts and data/matrix conversion. Map exact signatures before selecting a family. |
| Node | 6 | Graph node collections in [Graph](../../library/graph/graph.ts) | Nodes are canonical ordinary objects, not a second Node registry. Match iteration, membership and deletion semantics entry by entry. |
| Edge | 18 | [Edge](../../library/graph/edge.ts), Graph edge collections | Compare target path/tie capabilities and lifecycle with the actual Edge interface; do not infer route geometry from endpoints. |
| Random | 20 | [Random](../../library/random/random.ts), [continuation](../../library/random/continuation.ts) | Mulberry, distributions and continuation are delivered. Full compatibility and raw variants require exact algorithm/draw-order comparisons, not matching distributions. |
| Input | 5 | No headless Input export in [root](../../index.ts) | Model input descriptors and UI validation are not `Input.add`/bindings or World Input membership. Freeze this distinct contract before implementation. |
| stats | 6 | [stats](../../library/stats/index.ts) | `describe`, `histogram`, `gini`, Summary and Histogram exist; `alignment` is absent. Compare numerical/empty-input behavior of delivered entries. |
| geometry | 20 | [geometry](../../library/geometry/index.ts), spatial types in root | Direction, normalization, distance, map, contains and bounds are delivered alongside additive area/merge/split. Target displacement/bearing/neighbors/rotation/path splitting require exact public mapping or implementation; quarter corridor/subtract/subdivide are additional frozen targets. |
| Agenda | 9 | [Agenda](../../library/agenda/agenda.ts) | All named Agenda entry families are present; check exact tie ordering, handles, budget and failure semantics against the reference. DES helpers do not establish broader scheduler parity. |
| studies | 52 | [studies](../../library/studies/index.ts), [types](../../library/studies/types.ts) | Serial design/replicate/run/summarize and bounded outcomes exist. Binding/evaluation/selection/holdout/resume, worker transport and their types remain broader targets; map shared names and overloads rather than declaring the whole area delivered. |
| storage | 52 | [storage](../../library/storage/index.ts), [History](../../library/storage/history.ts) | Only bounded History is exported here. Save/load, encode/decode formats, snapshots, wire types and complete reconstruction remain target work. History samples are not resumable model state. |
| limits | 5 | No public limits namespace in root | Existing local safety bounds do not implement the named compatibility/GeoJSON/BehaviorSpace/study limit profiles. |
| Exports and shared types | 7 | [root](../../index.ts), [package](../../package.json) | Root package mapping is `city-library`; storage and Node-study subpaths remain unresolved. Space/Position/Vector exist; compare the target Component union and all package contracts before exporting more. |

The next inventory pass must resolve each canonical entry, including overloads, to one of: **verified**, **partial**, **missing**, or **contract question**. Each verified row needs the public symbol, contract anchor, asserted public example and executed target check; each other row needs its precise missing behavior or decision. The table above narrows that work by source owner but does not count any entry as verified. Use the canonical table's stable anchors rather than introducing another operation numbering system. No runtime expansion should start from an area-level “done” label.

## Closing the gaps

Maintain an operation-level inventory against [the canonical API table](../agent-loom/api-table.md), linking each entry to its public implementation, asserted example and current limitations. Resolve ambiguous contracts before adding runtime code. New capabilities follow [the example-first gate](../../PLAN.md#example-first-delivery-gate) and preserve existing examples. The [work plan](../../PLAN.md#remaining-migration-sequence) sets the order; these are the concrete starting points:

1. Reconcile World/Agent/Grid/Field/Agenda entry contracts against the existing lifecycle, spatial, occupancy and DES public scripts. These are delivered families with many existing probes; fill evidence gaps before adding alternate APIs.
2. Resolve the model-procedure question using the [Tijuana matrix](model-function-encapsulation.md) and at least two contrasting public author tasks. Distinguish domain interventions from incidental implementation steps; do not export every helper to satisfy a count.
3. Inventory Graph route/analysis gaps and Random compatibility against concrete selected-model needs. Giant Component is a bounded existing target; it does not justify all graph algorithms at once.
4. Prepare the four/five-example geometry phase in the [geometry sequence](example-first/PLAN.md#geometry-and-topology-delivery-sequence). Keep its unsupported shape/budget cases explicit and preserve the accepted quarter file.
5. Prepare selected-data roundtrip before model continuation, then advanced study execution only after state/transport/subpath contracts are defined. Reuse History, measurements and serial studies without adding a parallel storage or execution owner.

## API simplification decisions

Independent source review supports one internal refactor and one guide correction below. It rejects two broader unifications. Runtime changes still require focused type and behavior verification; these decisions do not claim that the refactor is implemented.

| Candidate and source | Smaller design to test | Contract that must survive |
| --- | --- | --- |
| Model [Input](../../models/definition.ts) and UI [Descriptor](../../ui/inputs.ts) shapes | Implement an internal descriptor derived from model Input variants; remove the duplicate inline shape in model parameters and unnecessary consumer casts. | Factory validation remains authoritative; UI stays optional and descriptor overrides remain typed. Similar shapes alone do not justify coupling. |
| [World activation](../../library/world/activation/index.ts), [twoPhase](../../library/execution/index.ts), [study execution](../../library/studies/run.ts) | Reject unification: option validation is already shared, while study budgets and activation order/ticks have distinct meanings. Keep the existing focused execution operations. | Ordering, failures, canonical membership, RNG and tick semantics differ and must remain observable. |
| [Resource](../../library/agenda/resource.ts), [Store](../../library/agenda/store.ts), [ServiceQueue](../../library/agenda/service-queue.ts), [Signal](../../library/agenda/signal.ts) | Reject a ticket manager: issueId and retainParticipant already share identity/participation logic; the remaining small ticket shapes have different fields and states. | Grants, quantities, occupancy, waits and cancellation are not interchangeable; no common manager merely to shorten files. |
| `typecheck:city` / `typecheck:quad-layouts` in [package scripts](../../package.json) | Use bun run typecheck in maintained guides. Retain the aliases for compatibility with existing references; removal needs a separate consumer decision. | Accepted commands and frozen examples are not silently broken. |

Apply the refactoring workflow before every affected slice, not as a final formatting pass. A concrete simplification can be implemented without API expansion only when behavior and accepted author syntax remain intact; otherwise use the explicit decision and example-first gates in PLAN.
