# Current design decisions

Status: proposed design, not implemented API. Updated: 3 November 2026. City Library remains a scaffold with no delivered capability exports. The [work plan](../PLAN.md) owns progress, sequencing and C01–C06; this document owns design boundaries and concise source context. The [README](../README.md) remains the public introduction.

## One library, independent capabilities

City Library is one engine organized into six areas: Simulation, Spatial Structures, Graphs, Generation, City Models, and Data & Experiments. Agent Loom supplies the design lineage for reusable modeling capabilities across these areas, not a separate product, import requirement or second engine. Its execution concepts belong to Simulation; its grid, graph and data contracts inform the corresponding areas. No consumer must initialize World or load every capability.

The six areas own the following responsibilities:

| Area | Owns | Boundary |
| --- | --- | --- |
| C01 Simulation | Agents, World, tick, lifecycle, execution, optional Space and event integration | Coordinates world-owned identity and execution; no mandatory grid, geometry or city policy |
| C02 Spatial Structures | Geometry, grids, fields, spatial queries and generic field calculations | Detached spatial capabilities; no graph reimplementation or forced World |
| C03 Graphs | Graphs, nodes, edges, traversal/routing, network generation and analysis | Supports non-spatial use; topology does not guarantee access, path geometry or domain flow |
| C04 Generation | Terrain, streets, parcels, zoning, buildings, assemblies and planning/feasibility variants | Produces descriptions; no implicit residents, traffic or supply state |
| C05 City Models | Traffic, households, allocation, economy, decisions and supply | Owns domain policies, units and mutable quantities; reuses generic structures |
| C06 Data & Experiments | Parameters/Input, measurements, statistics, History, studies and one storage area | Shares model values explicitly; loading is a write and measurements are not model continuation |

The following roles describe composition size and usage, not additional top-level areas:

| Role | Responsibility | Boundary |
| --- | --- | --- |
| General modeling capabilities | Agent Loom's general objects, algorithms, execution and data contracts | No city policy, application UI or dependency on a city domain |
| Specialized domain modules and variants | Buildings, terrain, layouts, mobility, households, economy, supply and feasibility | Use selected general capabilities; expose task-specific assumptions and replaceable strategies |
| Explicit compositions and prototyping kits | Assemble useful static or live models from public capabilities | Own assembly and handoff policy, not duplicate domain state or a hidden runtime |
| External UI and applications | Rendering, interaction, editors, charts, host scheduling and I/O | Read public results and change explicitly exposed inputs; no access to private implementation |

These are proposed logical boundaries, not a package manifest, folder plan or claim about current exports. C01–C06 are the current work areas. A01–A09 denote earlier source workstreams only, not a parallel organization. Several areas use the same graph, random or storage capability; there is one owner per accepted capability. Their numbering is not a dependency hierarchy. Neither these roles nor the work areas require an inheritance tree, universal base class, plugin framework, registry or initialization pipeline.

Start with the smallest useful author script and its invariants. Select only the necessary capabilities, compare precise reuse candidates with external libraries and focused new work, then test the contract with a second real variant before generalizing it.

## Reference basis and usage organization

The inspected Agent Loom `api-table.html` supplies the structural basis: **World, Agent, Grid, Field, Graph, Node, Edge, Random, Input, stats, geometry, Agenda, experiments, storage, limits, Exports and shared types** (the inspected source order, not a required City Library navigation order). The companion `api-reference.html` expands vocabulary, examples, inputs/defaults, effects and errors. These are target specifications, not proof of implementation in either repository.

Use their task-oriented table organization for future City Library reference pages. A compact row should identify the capability and accepted operation, summarize its contract, and point to detailed usage. Within an object area, prefer creation, readable properties, mutations, queries, advanced operations and types where applicable. Keep naturally related actions together. Field has no independent constructor; statistics and geometry are primarily functions; experiment design and execution have their own workflow. Do not manufacture lifecycle methods to fill a rigid template.

The following tables define responsibilities and usage progression, not new signatures or fixed exports. Existing reference names are evidence for the authoring direction only. Advanced source features, compatibility profiles and codecs require individual acceptance before transfer.

## General modeling boundaries

| Reference area | Responsibility and usage progression | State owner and permitted dependencies |
| --- | --- | --- |
| World | Create with optional Space/Random; inspect membership and tick; attach/detach; run steps; optionally activate/report/select with explicit order | Owns runtime membership and Tick; retains the chosen Random. Coordinates accepted components without owning city policy or reimplementing their algorithms. No implicit grid. |
| Agent | Create/copy; inspect identity and spatial properties; edit typed model data; move/rotate; query; delete | Owns individual data, spatial state and path progress, including while detached. Uses geometry and explicitly supplied sources/context; World membership is optional. Spatial abilities do not require model authors to use geometry. |
| Grid / Field | Create a grid; inspect space/cells; read and write field data; lookup, neighbors and occupancy; diffuse numeric properties | Grid owns topology and fixed Field identities; each Field owns its custom values. Uses spatial contracts. Detached operations need no World; default live population queries may require attachment or an explicit source. |
| Graph / Node / Edge | Create graph; admit existing nodes and create edges; inspect membership/data; mutate structure; traverse/route/analyze; optionally generate, lay out or interchange | Graph owns membership and Edge identities/data, not the node objects' domain state. Nodes are existing objects, not a mandatory Node superclass. Geometry is optional; stochastic generators/algorithms require explicit Random. |
| Random | Create stream; draw/sample; inspect or restore continuation; copy/reseed; advanced profile-specific operations | Each stream owns its algorithm state and caches. No dependency on World, city generation or UI. Deliberate sharing is explicit. |
| Input | Create bindings; expose an existing scalar property; inspect constraints; validate/set; remove binding | Owns binding descriptors, not another copy of the value. Validated writes target the original object. No widget, form schema or automatic interception of ordinary assignments. |
| stats | Describe values, histogram, inequality and heading alignment; inspect detached results | Pure measurements over supplied values. No recorder, runtime, drawing or implicit sampling. Domain metrics select their own quantities and units first. |
| geometry | Containment, normalization, displacement/distance/bearing, cell neighbors, orientation, path splitting, bounds and mapping | Pure spatial functions and structural data, with explicit dimensions/context. No Agent/Grid allocation or renderer. The source's planar GIS subset does not establish arbitrary solid geometry, polygon booleans or geodesy. |
| Agenda | Create; inspect time; queue/cancel event data; advance to a horizon within a budget; explicitly handle returned events | Owns pending event data, handles, insertion order and its own time. No automatic callbacks, World step or wall-clock timer. |
| experiments | Design scenarios; replicate seeds; create/run independent models; measure/summarize; optionally evaluate, select, hold out or resume | Owns study plan, budgets and outcomes; each model owns its state. The reference execution contract uses World plus a step procedure. Host workers and compatibility bindings are explicit optional integrations, not requirements for static tools. |
| storage | Save/load supplied supported data; explicitly encode/decode; create and record bounded History; validate restored data | Owns snapshot/codec contracts and History buffers. Depends only on the selected data/component contracts; no file/database I/O in core. One area covers selected data and declared model state, with distinct guarantees. |
| limits | Read documented resource budgets for specific operations or adapters | Immutable policy data, not a global allocation manager. Source profiles include NetLogo, GeoJSON, legacy networks, BehaviorSpace and studies; their ceilings do not become universal model limits. |
| Exports and shared types | Discover delivered public entry points and the structural types required by accepted calls | A documentation and compatibility responsibility, not a catch-all module. Source `agent-loom` entry names and subpaths do not prescribe City Library packaging. |

Field and Edge remain visible reference categories even if implemented alongside their owning Grid and Graph. Do not split them into competing ownership systems merely to obtain a module per heading. Likewise, detached graph and grid capabilities may be stateful objects: independent use does not require converting every capability into stateless functions.

## Specialized domains and replaceable variants

| Domain boundary | Owns | Uses and exclusions | Work-area coverage |
| --- | --- | --- | --- |
| Buildings and architectural parts | Massing, floors, assemblies, attachment points and alternative generators | Selected geometry, site/grid data and RNG. No inferred residents, dwelling count, rent or demand. | C04 |
| Terrain, layouts and parcels | Height queries, street/block/parcel descriptions, reservations and buildable envelopes | Geometry, optional grids and RNG. Adjacency is not road access; street shape is not traffic. | C02 tools; C04 generation |
| Local field models | Domain meaning and update rules for heat, resources or other local quantities | Grid/Field and geometry; runtime only when needed. Generic diffusion does not define a physical process's units or boundary assumptions. | C02 calculations; C05 domain policies |
| Mobility and traffic | Access, route validity, path interpretation, queues, signals and movement policies | Graph routing and Agent movement; optional World/Agenda. Detached calculators need no World. No duplicate graph or implicit teleportation. | C05 with C01/C03 |
| Households, uses and economy | Allocation, capacities, occupancy, routines, balances, stocks and decision policies | Ordinary typed records, optional agents/graphs, explicit RNG. Synthetic homes/jobs suffice; no geometry requirement. | C05 |
| Infrastructure and supply | Service quantities, capacities, demand policy, allocation and shortage diagnostics | Generic graph/flow tools and explicit consumers. Network capacity allocation does not imply hydraulic or electrical physics. | C05 with C03 |
| Quarter planning and feasibility | Scenario/program constraints, typologies, alternatives, quantity/cost summaries and bounded solver workflows | Selected building/layout outputs and focused solvers. Declare assumptions, jurisdiction and unsupported cases; no implied regulatory compliance. | C04 feasibility subtrack |

Variants share only a demonstrated task contract. Two house generators may accept the same site but produce different parts; two allocation policies may accept the same capacities but use different decision rules. Document extra requirements and unsupported cases instead of hiding them behind universal building, solver or system types. WFC, relaxation and optimization remain different problem contracts.

Architectural style that changes geometry belongs here: roof shape, facade openings, floor organization and part proportions affect generated form. Presentation style—materials, colors, line widths, symbols, lighting and camera choices—belongs to applications. A style name alone supplies neither geometric construction rules nor rendering behavior.

## Dependency and public-contract rules

General capabilities must not import city domains, kits or UI. Domains depend on selected general contracts; cross-domain relationships use explicit data/references and a composition that coordinates them. For example, mobility consumes destinations chosen by a household policy; it does not import that policy while the policy imports traffic. Kits depend on public general/domain operations; neither layer depends back on kits. Application and host adapters sit outside these boundaries.

Keep the implementation graph acyclic as capabilities arrive. World registration and component lifecycle need a single internal ownership implementation, not reciprocal module imports or parallel identity registries. Co-locate tightly coupled lifecycle mechanics where necessary; keep detached algorithms independently callable. This design does not freeze the private file layout or require a public registration protocol.

Public entry points must be deliberate. Kits, applications and other domains use accepted public contracts, never deep imports into private helpers or source checkout paths. Shared types belong with the capability that defines their semantics. Do not collect unrelated types and algorithms in an all-purpose `utils` or `core` dependency.

Before implementing an operation, document its task, minimal example, inputs/results, units, defaults, bounds, ordering, mutations, errors, ownership, lifecycle and dependencies. State whether returned data is detached, a snapshot of canonical references, or a live view; define empty/partial results and numerical tolerance. A frozen array does not make its objects immutable. Explicit adapters handle incompatible units, dimensions or coordinate systems; TypeScript shape similarity is not semantic compatibility.

The supported runtime and distribution closure remain implementation decisions. Static geometry, generators, graph analysis and field calculations must work headlessly without World, DOM or a renderer. Generic imports must not pull in Node worker execution, browser globals or file access just because an optional host supports them. Introduce only delivered exports, not speculative package splits or stubs.

## Authoring vocabulary and canonical state

Preserve the latest Agent Loom direction: ordinary TypeScript, direct typed properties, native arrays/sets/maps and explicit composition. Reference examples use `Agent.add(...)`, `World.add(...)`, `world.add(...)` and `run(world, step, steps)`. Model values remain `agent.energy`, not a generic `.value` wrapper. Use `Position` and `Space`, not parallel public `Like`/`Context` synonyms. Native array queries remain the ordinary selection path; specialized World activation is an explicit advanced scheduling operation.

Creation/copy semantics and later assignments are distinct. The reference clones supported initial custom data but retains framework references; later assignments use ordinary TypeScript reference semantics. An agent copy is detached; a graph copy owns independent edges while retaining node identities. Do not promise a deep model clone from the word `copy` alone. Reserved built-in keys, supported data and failures need delivered contracts.

| State or relationship | Authority | Composition rule |
| --- | --- | --- |
| World membership and execution | World | Attaching a graph does not implicitly register its Agent nodes. A component has at most one World owner; attachment validates compatibility before mutation. |
| Graph topology and edges | Graph | Node objects may participate in several graphs subject to ownership constraints. Removing graph membership preserves the node object; graph algorithms do not own household or road policy. |
| Grid topology and field values | Grid / its Fields | Registration retains the same grid and cells. Position-derived occupancy is a query, not a second writable population. Grid space does not automatically become World space. |
| Domain capacities, allocations and balances | The selected domain model/policy | Every live quantity has one authority. Other domains retain canonical references or explicit observations, never competing mutable copies. |
| Generated descriptions | Generator result / caller | Valid without runtime. Admission to a live model explicitly supplies domain meaning, units and identity relationships. |
| Observation samples | History or caller | Own detached samples, never simulation state. Old samples need not track later live changes. |

Keep removal semantics receiver-specific: `world.delete(component)` detaches and requires its argument; `agent.delete()` deletes the individual; `graph.delete()` empties graph contents; `history.delete()` clears retained observations. Do not reintroduce historical aliases or infer a no-argument World reset. Caller-owned arrays are not automatically cleaned when an agent is deleted. Process-local framework identity is distinct from a persistent domain key.

Live replacement is a coordinated domain operation. Demolishing an occupied building, shrinking capacity or removing an entrance must handle residents, allocation and stale routes explicitly. Runtime manages membership; the affected domain defines consequences; composition coordinates the change. Freeze one bounded policy before inventing a universal regeneration mechanism.

## Time, randomness and observation

The caller's model procedure defines execution order. `world.tick.value` is the World-owned counter; `world.tick.advance(amount?)` changes only it and `world.tick.reset()` resets only it. A successful reference `run` callback adds one tick; a failed callback adds no tick and does not roll back earlier mutations. Tick units, domain duration and host execution speed are separate concepts.

Agenda owns a distinct event cursor. Advancing it returns due event data within a budget; the caller dispatches those events. It does not advance World tick, and resetting tick does not rewind Agenda. A composition specifies units, tick-to-event horizon mapping, tie order and behavior when the event budget leaves due work pending. Kits start no hidden timers or clocks.

Random streams are explicit and independently owned. Separate generation, simulation and experiment replications; deliberate shared Random identity is an opt-in coupling. Reproducibility includes algorithm/version, input, initial continuation, caches and call order, not seed alone. Stochastic graph/selection operations declare their stream and draw behavior. Metrics, saving and rendering must not consume model randomness or advance time; randomized analysis uses a separate explicitly supplied stream.

## One storage area, separate guarantees

Retain one storage area with the reference vocabulary `storage.save(...)`, `storage.load(...)`, explicit encode/decode and bounded History. Save selects exactly the supported data supplied by the caller; load creates fresh supported objects. Core operations do not perform file/database I/O or merge partial observations into a running model.

| Saved content | Guarantee to establish | Does not imply |
| --- | --- | --- |
| Selected measurements or ordinary data | Validated roundtrip of the selected values and supported relationships | Runnable World or simulation continuation |
| Declared component bundle or model state | Versioned validation and reconstruction of captured identities, relationships and state | Capture of unlisted external components, closures, listeners or host resources |
| Complete continuation | Captured model/domain state, clocks, Agenda queue, RNG continuation, path progress and other required cursors; explicit rebinding of matching procedures | Resume of an arbitrary program from a seed or partial snapshot |
| Study continuation | Model continuation plus plan position, completed outcomes, sampling policy and remaining budgets | Re-running completed work or equating a study checkpoint with a measurement file |

Decoded custom state remains untrusted until validated; static types cannot validate serialized data. Custom formats are explicitly passed adapters, not a mandatory codec registry, and cannot bypass model-state validation. Unsupported versions or values fail clearly rather than disappear. Snapshot compatibility and format coverage remain accepted-slice decisions; the broad source wire schema is not adopted wholesale. Histories have explicit capacity, sampling and eviction behavior; streaming/backpressure needs its own contract.

## Concrete compositions

These are design scenarios, not executable examples or promises of new functions.

| Composition | Explicit assembly and replaceable parts | First observable result |
| --- | --- | --- |
| Static neighborhood | Caller supplies two sites and reservations; a layout supplies buildable envelopes; either of two house strategies uses an isolated generation stream. No World is created. | Detached building descriptions fit their declared envelopes; a rejected site remains an explicit partial result. Kit and manual public-call assembly agree. |
| Network-only household model | Three synthetic homes and four households use one allocation policy, optionally Agent identities and a World without Space. A relationship Graph reuses those identities. Swap the allocation policy without changing membership. | Capacity holds, unassigned households are explicit, and graph membership never creates a second household or implicit World admission. |
| Local resource model | A detached Grid owns numeric resources; a chosen local rule updates fields. Optional agents query the same fields through an explicit population; the caller chooses when to add World execution. | Diffusion preserves the declared quantity within tolerance; queries leave state, time and RNG unchanged. |
| Commuting prototype | Household policy selects a home/job; access validation maps endpoints to a canonical route graph; traffic rules use Agent movement. Caller explicitly maps ticks to Agenda events. | One traveler follows valid geometry; removing an entrance yields a stale/inaccessible route outcome requiring a policy decision. No teleportation or hidden clock. |
| Supply comparison | Two allocation strategies use a synthetic capacity network and explicit demand quantities; domain results feed stats and selected-data storage. | Conservation and unmet demand are traceable without buildings or physical-fluid claims. |
| Parameter study | Explicit scenarios/seeds create independent models; measurements feed stats/History. The external application displays outcomes and writes encoded data. | Reordered independent runs give the same per-run results; data-only loading does not resume a model. |

External UI is optional for every scenario. Applications own drawing, appearance defaults, cameras, picking, widgets and plot specifications. User-defined `name`, `color`, `symbol` or `selected` properties remain ordinary data with no automatic display effect. UI edits enter through documented inputs; rendering never owns model state or timing.

## First acceptance criteria

These gates refine the existing milestones without changing their order or claiming completion:

1. **Contract and public boundary:** select one bounded task, write its minimal script and ownership/dependency contract, and record exact source revision/adaptations/notices. Export only the accepted closure; check that consumers need no private/deep import or old checkout.
2. **Independent static capability:** generate one house without World/DOM; later exercise two real variants against the shared minimum contract. Independently verify a graph with non-spatial nodes and a grid/field calculation without runtime.
3. **Independent runtime:** run two headless models, one without grid/Space. Verify attachment/detachment, copy/delete, canonical identity, tick/error ordering and isolated RNG. Add Agenda cadence/budget checks only with the slice that integrates it.
4. **Explicit composition:** compare a kit with manual public operations using matched inputs and RNG continuation. Test one invalid handoff, partial result and bounded live change; reject duplicate occupancy/state and cyclic domain dependencies.
5. **Data before continuation:** roundtrip selected data and verify observations leave state/time/RNG unchanged. Accept exact resume separately by comparing uninterrupted and restored runs with a declared state inventory and rebound behavior.
6. **Evidence:** run the relevant type/behavior checks and a public downstream consumer when an entry point ships. Keep source-only, target-runtime, visual and scientific evidence separate. Independent review is a separate decision, not implied by passing tests or this design document.

## Current source provenance and plan reconciliation

Inspected on 3 November 2026 in source worktree `/home/david/.t3/worktrees/city_game/t3-ea6a26d7`, branch `t3/complete-agent-loom-api-spec`, HEAD `08b3efb66d0f93d023f0b1deb762578552f7b819`. Both inspected files had no working-tree changes:

| Source-relative path | SHA-256 of inspected content |
| --- | --- |
| `docs/agent-loom/api-table.html` | `5b9b2c48c590f743b801fab47b618622d31272e8f1faed69efe3a34a70b16f11` |
| `docs/agent-loom/api-reference.html` | `35c9e984cee837f629cf2a67efaf031fff1b9cdfaf71c5f379dbbbea2d1bfc64` |

These are optional author evidence locators, not required consumer files, public API imports or runtime dependencies. This document records the local design direction without requiring access to that worktree. The target was inspected on `main` at `8fa0cecd56d4aa046bfc00605a892deecb4effaf`; no implementation or transfer approval follows from those revisions.

The current plan resolves the earlier nine-workstream organization into six areas. Agent Loom is incorporated as design lineage: execution is C01, spatial/grid contracts C02, graph contracts C03, and input/stats/experiments/storage C06. Buildings, terrain/layout and feasibility form C04; urban policies form C05. The retained reference tables describe source capability boundaries, not another package hierarchy or a second general engine. Graph and grid algorithms are independently usable; Simulation only coordinates lifecycle for attached world-owned objects.

Source export names, compatibility adapters and extensive advanced operations remain reference evidence, not commitments to implement them in early milestones. Exact packaging, first-generator contract, precision/units, live admission/replacement rules, runtime support, rights/notices and complete checkpoint scope remain slice decisions. No runtime, dependencies, stubs or setup changes accompany this design revision.

## Six-area revision checks

The six-area consolidation was independently reviewed against the actual scaffold. No blocking finding or lost central capability was identified. Two P3 clarifications were applied: World membership is distinct from Graph/Grid ownership, and the source API heading order is historical rather than a new navigation requirement. Those changes are author responses, not a new independent approval.

Typecheck, local Markdown links/code fences and whitespace checks passed. The README Mermaid, runtime entry, dependency/configuration files and lockfile were unchanged. No engine functions or source stubs were added. The separate provenance document and its links were removed as requested.
