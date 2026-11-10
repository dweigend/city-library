# Public API coverage

The headless library exposes reusable modeling tools through [the package entrypoint](../../index.ts). The [Agent Loom specification](../agent-loom/README.md) defines the broader target. A target signature is not a promise that the operation is available today.

## Available capabilities

This inventory is based on the public exports and their implementation modules. Use the linked examples and exact API contracts for supported inputs and failure behavior; a row does not establish complete compatibility with every target operation.

| Area | Available public surface | Start here |
| --- | --- | --- |
| Agents and worlds | `Agent`, `World`, `run`, `Tick`; ownership, lifecycle, synchronous execution and spatial actions | [Agent/world examples](../../examples/world-lifecycle/), [spatial examples](../../examples/spatial/) |
| Random streams | `Random`, `RandomState`; standard Mulberry streams, sampling, normal/exponential/Poisson/Bernoulli/triangular/gamma draws, copy and continuation | [Random examples](../../examples/agent-selection/), [distribution contracts](normal-distribution-contract.md) |
| Grids and fields | `Grid`, `Field`; lookup, neighborhoods, canonical occupancy and diffusion | [Grid examples](../../examples/grid/), [occupancy contract](indexed-occupancy-contract.md) |
| Graphs | `Graph`, `Edge`, `GeneratorOptions`; collections, copies, connectivity, distances, analysis and generation | [Graph contract](graph-copy-contract.md), [connectivity](graph-connectivity-contract.md), [distances](graph-distances-contract.md), [analysis](network-analysis-contract.md), [generators](graph-generators-contract.md) |
| Geometry | `geometry.direction`, `normalize`, `distance`, `map`, `contains`, `bounds`; spatial and Planar types | [Spatial probes](spatial-probe-contract.md), [affine mapping](affine-map-contract.md), [planar queries](planar-geometry-contract.md) |
| Statistics | `stats.histogram`, `gini`, `describe`, and readonly `Histogram`/`Summary` types | [Statistics examples](../../examples/stats/README.md), [summary contract](statistical-summary-contract.md) |

The [Execution and studies](../execution-studies/STATUS.md) also exposes `measurements`, bounded `storage.history`, serial `studies.design/replicate/run/summarize`, `world.activate/report/select`, `twoPhase`, `continuous`, `Agenda`, `ServiceQueue`, `Resource`, `Store`, `Signal`, `EventTrace` and `TimeWeighted`. The [measurement scripts](../../examples/model-measurements/), [dynamics scripts](../../examples/model-dynamics/), [attachment scripts](../../examples/graph-attachment/) and [DES scripts](../../examples/des/) exercise these public contracts. Fixed, shuffled and stable priority activation preserve lifecycle and explicit clocks; full NetLogo compatibility remains open.

These capabilities can be composed independently. Model-specific procedures and observations live in each model; UI exports are separate from the headless package.

## Required target

The specification covers 309 operation/type entries across 16 reference areas. Every target entry needs a public export, explicit behavior contract, executable public example and relevant verification before it can be called complete. Existing capability-level coverage does not establish full Agent Loom parity.

Broader requirements include complete compatibility profiles, paths and routing variants, generic Input, advanced study binding/transport/continuation, codecs and supported complete-state continuation. Bounded History and serial studies do not imply those broader capabilities. Check the public exports and operation reference when defining the next capability; do not infer missing operations from directory scaffolding or mark an entire reference area complete from one implementation.

## Next work

Maintain an operation-level inventory against [the canonical API table](../agent-loom/api-table.md), linking each entry to its public implementation, asserted example and current limitations. Resolve ambiguous contracts before adding runtime code. New capabilities follow [the example-first gate](../../PLAN.md#example-first-delivery-gate) and preserve existing examples.

Run `bun run check` to verify configured types, tests, public examples, build and packed consumers. UI changes also require their own real-browser and visual acceptance; library checks do not establish scientific validity for an adapted model.

## Source reconciliation and remaining scope

This is a source-level reconciliation of the current root exports and implementation contracts, not an operation-level acceptance claim. The API table still describes itself as 309 entries, but counting its `###` operation/type headings gives 312 across the same sixteen areas. Those headings contain 270 distinct names and 42 repeated-name headings for overloads. Neither count reproduces 309; the three-entry difference remains unexplained. Resolve stable operation IDs, overload grouping and additive entries against the detailed reference before reporting a completion denominator. Do not remove entries or narrow the binding scope to repair a count.

| Reference area | Observed headings | Current source boundary | Concrete remaining comparison |
| --- | ---: | --- | --- |
| World | 25 | [World](../../src/world/world.ts), [run](../../src/world/run.ts), [activation](../../src/world/activation/index.ts) | Membership, tick and activation are public. `world.inputs` and Input attachment are not delivered; compare every activation overload and compatibility profile. |
| Agent | 27 | [Agent](../../src/agent/agent.ts), [spatial actions](../../src/agent/spatial.ts) | Compare all spatial overloads, copy/reserved-state failures, boundary and RNG behavior; source presence is insufficient for complete compatibility. |
| Grid | 10 | [Grid](../../src/grid/grid.ts), [layout Grid](../../src/grid/layout-grid.ts) | Match regular-grid overloads and field/occupancy/diffusion contracts. Keep additive finite layouts separate from square/cubic parity. |
| Field | 6 | [Field](../../src/grid/field.ts) | Verify each identity, coordinate and owning-grid guarantee through public Grid consumers. |
| Graph | 44 | [Graph](../../src/graph/graph.ts), [algorithms](../../src/graph/algorithms/) | Copy, connectivity, distances, analysis and generators exist. Public interface lacks target families including `view`, `traverse`, `findRoute`, `routes`, `bridges`, `articulations`, communities, matching, flow, layouts and data/matrix conversion. Map exact signatures before selecting a family. |
| Node | 6 | Graph node collections in [Graph](../../src/graph/graph.ts) | Nodes are canonical ordinary objects, not a second Node registry. Match iteration, membership and deletion semantics entry by entry. |
| Edge | 18 | [Edge](../../src/graph/edge.ts), Graph edge collections | Compare target path/tie capabilities and lifecycle with the actual Edge interface; do not infer route geometry from endpoints. |
| Random | 20 | [Random](../../src/random/random.ts), [continuation](../../src/random/continuation.ts) | Mulberry, distributions and continuation are delivered. Full compatibility and raw variants require exact algorithm/draw-order comparisons, not matching distributions. |
| Input | 5 | No headless Input export in [root](../../index.ts) | Model input descriptors and UI validation are not `Input.add`/bindings or World Input membership. Freeze this distinct contract before implementation. |
| stats | 6 | [stats](../../src/stats/index.ts) | `describe`, `histogram`, `gini`, Summary and Histogram exist; `alignment` is absent. Compare numerical/empty-input behavior of delivered entries. |
| geometry | 20 | [geometry](../../src/geometry/index.ts), spatial types in root | Direction, normalization, distance, map, contains and bounds are delivered alongside additive area/merge/split. Target displacement/bearing/neighbors/rotation/path splitting require exact public mapping or implementation; quarter corridor/subtract/subdivide are additional frozen targets. |
| Agenda | 9 | [Agenda](../../src/agenda/agenda.ts) | All named Agenda entry families are present; check exact tie ordering, handles, budget and failure semantics against the reference. DES helpers do not establish broader scheduler parity. |
| studies | 52 | [studies](../../src/studies/index.ts), [types](../../src/studies/types.ts) | Serial design/replicate/run/summarize and bounded outcomes exist. Binding/evaluation/selection/holdout/resume, worker transport and their types remain broader targets; map shared names and overloads rather than declaring the whole area delivered. |
| storage | 52 | [storage](../../src/storage/index.ts), [History](../../src/storage/history.ts) | Only bounded History is exported here. Save/load, encode/decode formats, snapshots, wire types and complete reconstruction remain target work. History samples are not resumable model state. |
| limits | 5 | No public limits namespace in root | Existing local safety bounds do not implement the named compatibility/GeoJSON/Study/study limit profiles. |
| Exports and shared types | 7 | [root](../../index.ts), [package](../../package.json) | Root package mapping is `city-library`; storage and Node-study subpaths remain unresolved. Space/Position/Vector exist; compare the target Component union and all package contracts before exporting more. |

The next inventory pass must resolve each canonical entry, including overloads, to one of: **verified**, **partial**, **missing**, or **contract question**. Each verified row needs the public symbol, contract anchor, asserted public example and executed target check; each other row needs its precise missing behavior or decision. The table above narrows that work by source owner but does not count any entry as verified. Use the canonical table's stable anchors rather than introducing another operation numbering system. No runtime expansion should start from an area-level “done” label.

## First bounded work packages

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
| [World activation](../../src/world/activation/index.ts), [twoPhase](../../src/execution/index.ts), [study execution](../../src/studies/run.ts) | Reject unification: option validation is already shared, while study budgets and activation order/ticks have distinct meanings. Keep the existing focused execution operations. | Ordering, failures, canonical membership, RNG and tick semantics differ and must remain observable. |
| [Resource](../../src/agenda/resource.ts), [Store](../../src/agenda/store.ts), [ServiceQueue](../../src/agenda/service-queue.ts), [Signal](../../src/agenda/signal.ts) | Reject a ticket manager: issueId and retainParticipant already share identity/participation logic; the remaining small ticket shapes have different fields and states. | Grants, quantities, occupancy, waits and cancellation are not interchangeable; no common manager merely to shorten files. |
| `typecheck:city` / `typecheck:quad-layouts` in [package scripts](../../package.json) | Use bun run typecheck in maintained guides. Retain the aliases for compatibility with existing references; removal needs a separate consumer decision. | Accepted commands and frozen examples are not silently broken. |

Apply the refactoring workflow before every affected slice, not as a final formatting pass. A concrete simplification can be implemented without API expansion only when behavior and accepted author syntax remain intact; otherwise use the explicit decision and example-first gates in PLAN.
