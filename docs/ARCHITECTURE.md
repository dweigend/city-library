# System architecture

The [naming migration contracts](../PLAN.md#naming-migration-contracts) authorize only their recorded naming changes as an exception to API-name preservation rules in this document, including static factory names and target study entries. Preserve behavior, assertions, identity, ordering and random sequences; migrate consumers together.

A model should remain understandable when you remove its UI. City Library therefore keeps domain rules, state and execution in a headless library. Applications read observations and call public actions; they do not become a second model.

A graph can work without coordinates, a field calculation without agents, and a generator without a running world. The caller chooses how to combine them.

This document defines the required architecture, including parts still to be built. [PLAN](../PLAN.md) tracks available capabilities and next goals; the [Agent Loom specification](agent-loom/README.md) defines detailed target contracts. The current public package exposes its root entry only.

Use the system-wide [naming conventions](NAMING_CONVENTIONS.md) for domains, public contracts and module names.

## Reading this document

Start with [model authoring](development/model-authoring.md) for a runnable introduction. This document covers [domain ownership](#binding-architecture-rules), [module layout](#binding-domain-layout-and-extension-rules), [public contracts](#dependency-and-public-contract-rules) and [time, randomness and observations](#time-randomness-and-observation). [UI design](DESIGN.md) and the [UI specification](ui/README.md) own presentation and author-facing bindings.

## Binding architecture rules

These rules apply to libraries, applications, examples and future adapters, including planned work. The [Agent Loom specification](agent-loom/README.md) defines the required core scope. Broader city scenarios remain design sketches unless explicitly accepted.

### Ten architectural principles

Public authoring examples precede runtime implementation. Follow the [example-first delivery gate](../PLAN.md#example-first-delivery-gate): four or five executable scripts per expansion phase define accepted syntax and observable results before implementation begins. Clean design of the specified public API takes priority over implementation convenience. Examples use public contracts and expected-result assertions; they must not be retrofitted to implementation limitations. Substantive changes require an explicit recorded design decision and user agreement, while the binding specification remains authoritative. Focused behavior and type tests supplement these end-to-end author tasks.

| Principle | Required rule |
| --- | --- |
| Separation of concerns | Give each module one clear purpose. |
| High cohesion, low coupling | Keep related responsibilities together and minimize dependencies between modules. |
| Dependency rule | Dependencies follow a controlled direction. Core code knows no applications, UI or concrete adapters. |
| Encapsulation and information hiding | Expose defined public interfaces; hide implementation details. |
| Explicit contracts | Define inputs, outputs, errors and side effects unambiguously. |
| Composition over inheritance | Combine independent building blocks rather than introducing deep inheritance hierarchies. |
| Single source of truth | Give every state and domain fact one authoritative owner. |
| Dependency inversion | Domain logic depends on stable abstractions rather than concrete infrastructure implementations. |
| Functional core, imperative shell | Keep calculations and rules as pure as practical; isolate I/O, persistence and other side effects at explicit system boundaries. |
| Evolutionary architecture | Support local changes; new capabilities should affect existing modules as little as possible. |

### Strict separation of UI and domain logic

The library must be fully usable and testable without its interchangeable UI.

| Rule | Mandatory requirement |
| --- | --- |
| Strict separation | Put UI and domain logic in separate modules; never mix them in one file or component. |
| Unidirectional dependencies | UI may import logic; logic must never import UI components or UI frameworks. |
| Headless core | All domain functionality runs without a browser, DOM, Svelte or Three.js. |
| No business logic in UI | UI components implement no domain calculations, simulations or business rules. |
| Explicit interfaces | Communicate through clearly defined, typed functions, data models and events. |
| Single source of truth | Logic exclusively manages domain state. UI owns only temporary presentation state. |
| No direct state mutation | UI changes domain state only through defined actions or functions, never direct assignment to domain objects. |
| Framework independence | Domain logic uses no framework-specific types, stores, hooks or lifecycle mechanisms. |
| Independent testing | Test all domain logic without UI; UI tests verify presentation and interaction. |
| Replaceable UI | CLI, web applications and 3D visualizations reuse the same domain logic unchanged. |

### Shared UI and discoverable model entries

Agent Lab starts through the Vite host in `ui/agent-lab/` (`bun run dev`). `ui/index.ts` exposes one Svelte-backed `defineUI`; `ui/svelte/index.ts` only preserves existing import compatibility. Catalog discovery and Vite serving/building remain separate host responsibilities, without runtime selection or a legacy renderer. Reusable controls and neutral visualization adapters belong under top-level `ui/`; application catalog/playback/session behavior belongs in its application subfolder. Keep the library headless and its accepted domain layout unchanged. A small ordinary TypeScript entry contract is sufficient; no additional modeling runtime or mandatory wrapper API.

Catalog entries expose only `models/<slug>/model.ts` and `ui.ts`; private helpers are normal dependencies. Model exports remain headless; UI uses public actions and detached observations. Host discovery and bundling belong in ui/agent-lab; catalog verification belongs in models/catalog. These host tools stay outside headless model code. Definitions are inert at import. New entries must not require model-specific edits to shared shell/session code. Future views arrive with working slices, not empty scaffolding.

### Layers and implementation boundaries

| Layer | Responsibilities and dependencies |
| --- | --- |
| UI / Presentation: Svelte, HTML, Three.js, CLI | Presentation, interaction and local UI state. Calls the application layer or public core functions using typed data, actions and events. |
| Application / Controller (optional) | Use cases, orchestration and controlled state access. Depends on core contracts; introduces no UI dependency into the core. |
| Core / Domain Library | Domain logic, models, rules and algorithms. Framework-independent and headless; depends on neither presentation nor application code. |

Keep UI components thin: accept input, invoke functions and display results. Domain calculations stay in the core. Core interfaces contain no Svelte stores, DOM elements or Three.js objects. Put persistence, network and browser access in separate explicit adapters; do not hide their side effects inside domain operations. Simple UI actions may call public core functions directly; an application layer is optional.

Direct typed properties remain valid inside model-authoring logic as specified by the API reference; they do not authorize UI code to mutate domain state. Presentation-derived values are allowed in UI code, while domain-derived values belong to the logic layer.

**Architecture invariant:** every domain function must be callable through a public TypeScript API without UI. Replacing the UI must require no core changes.

Within the external Agent Lab, keep application orchestration, DOM presentation, detached observation projection and concrete visualization separate. Renderer-specific types and dependencies belong to the visualization layer. Application actions resolve canonical identities; renderers receive detached records and report interaction intent. Canvas layout, dragging and camera state are presentation state, never model coordinates or another authority for topology, time or randomness. Renderer lifetime includes explicit resource cleanup. The [Cytoscape assignment](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/cytoscape.md) records the first concrete implementation and acceptance evidence for these boundaries.

For every implementation slice, verify public headless access, dependency direction, explicit contracts and canonical state ownership. When UI is present, also verify that it uses defined actions and contains no domain rules. Use the existing slice checks and browser verification requirements; documentation alone does not establish compliance.

## Binding domain layout and extension rules

Organize source by domain. The [API specification](agent-loom/README.md) defines public operations; the layout below defines their boundaries. A directory does not imply a working public export.

The regular Grid diffusion calculation is implemented in `src/grid/algorithms/diffusion.ts`; Grid retains input validation and state commit.

The tree below defines intended domain boundaries and planned responsibilities, not the current filesystem inventory. Create a directory only with its first working slice; do not retain empty directories or `.gitkeep` scaffolding. Planned filenames are not a complete list of existing modules. Add each domain's `index.ts` with its first working public capability. The root `index.ts` exports Agent, World, run, Random, Graph, Grid, topology, stats and geometry, plus the bounded expansion values measurements, storage, studies, twoPhase, continuous, Agenda, ServiceQueue, Resource, Store, Signal, EventTrace and TimeWeighted. The [expansion inventory](execution-studies/STATUS.md) records delivered subsets, decisions and separate acceptance evidence. Public types include Tick, RandomState, Edge, GeneratorOptions, Field, Layout, BoundarySegment, LayoutGrid, LayoutField, Space, Position, Vector, Orientation, Histogram, Summary, Bounds and the planar geometry/data types listed in that entry. Current Graph methods include membership, connectivity, distances, analysis, generation and copy; stats exposes histogram, gini and describe. These exports cover part of the graph, geometry, statistics and Agent Loom contracts. Consult the public entry and executable examples for exact supported options; planned directories establish no additional exports.

```text
src/
├── agent/
│   ├── agent.ts
│   ├── state.ts
│   ├── movement.ts
│   ├── orientation.ts
│   ├── perception.ts
│   ├── path.ts
│   └── gradient.ts
├── world/
│   ├── world.ts
│   ├── membership.ts
│   ├── tick.ts
│   ├── run.ts
│   └── activation/             # Activation, reporting, selection and compatibility
├── grid/
│   ├── grid.ts
│   ├── field.ts
│   ├── occupancy.ts
│   ├── topology/
│   │   ├── orthogonal.ts       # Square/cubic topology
│   │   └── hexagonal.ts        # Future hexagonal extension
│   └── algorithms/
│       └── diffusion.ts
├── graph/
│   ├── graph.ts
│   ├── nodes.ts
│   ├── edge.ts
│   ├── ties.ts
│   ├── views.ts
│   ├── data.ts
│   ├── algorithms/
│   │   ├── traversal.ts
│   │   ├── connectivity.ts
│   │   ├── routing.ts
│   │   ├── centrality.ts
│   │   ├── clustering.ts
│   │   ├── communities.ts
│   │   ├── cliques.ts
│   │   ├── matching.ts
│   │   ├── cycles.ts
│   │   ├── trees.ts
│   │   └── flow.ts
│   ├── generators/
│   └── layouts/
├── geometry/
│   ├── space.ts
│   ├── position.ts
│   ├── orientation.ts
│   ├── distance.ts
│   ├── neighborhood.ts
│   ├── polygon.ts
│   ├── path.ts
│   └── bounds.ts
├── random/
│   ├── random.ts
│   ├── algorithms/
│   ├── distributions/
│   ├── sampling.ts
│   └── continuation.ts
├── agenda/
├── input/
├── stats/
├── studies/
│   ├── design.ts
│   ├── replication.ts
│   ├── run.ts
│   ├── summarize.ts
│   ├── calibration/
│   ├── continuation.ts
│   ├── study-xml.ts
│   └── node/                   # Separate host entry and worker implementation
├── storage/
│   ├── snapshot.ts
│   ├── validation.ts
│   ├── history.ts
│   ├── wire/
│   ├── value-codec.ts
│   └── formats/
└── limits/

index.ts                        # Existing public root entry
tests/                          # Domain contract and integration tests
tests/public-contracts/         # Executable public API contracts
tests/ui/                       # Public UI consumer fixtures
tests/targets/                  # Unmet public contracts
docs/agent-loom/                 # Phase-one API specification
```

Keep these domain and extension boundaries when files are delivered. Split or combine private helper files within their owning domain only when a real slice justifies it; record a substantive boundary change here rather than silently bypassing this architecture. File presence never proves capability delivery.

### Kernels, algorithms and explicit variants

- Keep each domain's state-owning kernel small. Put calculations, graph algorithm families, generators and layouts in focused functions. Existing method contracts such as `graph.findRoute(...)` delegate to these implementations without changing the binding authoring API.
- Use ordinary functions, direct typed data and explicit composition. Define small, task-specific contracts for topologies, random algorithms, generators and codecs. Variants must be replaceable through those contracts without rebuilding the whole domain. Do not require a global plugin registry, a universal manager or a deep inheritance hierarchy.
- Keep types with their semantic owner and export only the agreed public surface. `Field` belongs to Grid; node membership and `Edge` belong to Graph; `History` belongs to Storage. Nodes remain the caller's original objects, not instances of a new mandatory Node base class. Avoid catch-all `core/`, `utils/` and global `types/` modules.
- Keep dependencies directed and acyclic. Detached Graph, Grid and Random work without World; their optional World participation uses focused private lifecycle contracts. Do not make World the owner of all identity, cloning or algorithm infrastructure merely to share code.
- Define a single responsible internal protocol for shared identity, supported state copying and cross-domain lifecycle before implementing those interactions. Agent movement, edge ties and World membership must coordinate canonical objects through that protocol; separate registries or copied ownership state must not compete. Common mechanics must not require reciprocal runtime imports.

### Topology as an extension boundary

Grid topology is distinct from Field state, occupancy queries and update algorithms. Its contract must specify cell identification, supported dimensions, cell-center geometry, position-to-cell mapping, neighborhood enumeration and order, boundary handling and any topology-specific weights. Grid owns stable Field identities; each Field owns its values. Occupancy remains a query over canonical agents.

Diffusion consumes the declared neighbors and applicable weights rather than calculating square-grid offsets itself. Its update rule still defines ordering, units, supported topologies and conservation tolerance. A reusable neighborhood algorithm does not establish a physical process or prove that identical weights are valid on every topology. Pure `geometry.neighbors` and orthogonal Grid neighborhoods must share the required square/cubic semantics rather than duplicating conflicting offset or boundary rules.

The original Agent Loom phase-one Grid remains square/cubic with `faces | moore` neighborhoods and its recorded defaults. The additive [grid/parcel phase](grid-parcels/STATUS.md#bounded-layout-contract) defines detached square, hexagonal and authored planar layouts and `Grid.create({ layout, state })`. Layout-backed Grids have their own accurate capability type: shared-edge neighbors and polygon lookup, without regular `Space`, `cellSize` or diffusion. The bounded layout contract freezes hex radius, orientation, finite boundaries and deterministic edge ties. This extension preserves the original regular Grid contract; it does not introduce arbitrary-layout diffusion or volume topology.

Treat topology as immutable for a delivered slice unless that slice explicitly defines topology mutation and revision/invalidated-cache behavior. A cached neighborhood must never silently outlive the topology it represents. Respect the extension boundary now, but establish a broader shared topology interface through real variants rather than speculative universal capabilities.

The [finite quadrilateral extension](grid-parcels/QUAD-LAYOUTS-CONTRACT.md) uses
these same Layout/Polygon/Random contracts. Generation returns an unrelaxed
hexagonal patch; `squareTarget` relaxation is a separate pure operation returning
a fresh immutable Layout, including zero iterations. It preserves local cell
correspondence and incidence while keeping exposed boundaries fixed. Each Grid
still owns its own Fields; state transfer is explicit caller policy. The internal
construction/incidence arrays are not a public mesh framework or a player-grid
dual. Fixed finite boundaries do not establish seamless chunks or an architecture
solver, and the older arbitrary-domain/Lloyd proposals remain research.

### State, hosts and verification

- Preserve one authority per live value: Agent owns spatial state and path progress; Grid owns topology and Field identities; Graph owns topology and Edge identities; World owns membership and Tick. Shared references retain their canonical identities. Observation buffers own samples, not simulation state.
- Load Node worker execution only through the explicit `studies/node` host entry. Generic/root imports remain headless and must not eagerly import Node workers, browser globals or I/O. Core Storage encodes supplied data without performing file/database/network access. UI and host adapters remain separate from the library logic.
- Preserve the binding root, Storage and Node experiment entry contracts. The reference root name `agent-loom` maps explicitly to the existing `city-library` package root. Storage and Node experiment subpath mappings remain future decisions; do not silently rename or widen those contracts. A domain's internal `index.ts` is not automatically a new package subpath.
- Test public behavior rather than file layout or helper implementation. Each delivered variant must satisfy the applicable shared contracts for identity, deterministic order, boundaries, mutations, failures, time and RNG effects, plus its own explicit requirements. Verify quantity conservation only for update rules that promise it. Run composition tests for ties/lifecycle and continuation where those features are delivered.
- Keep the complete 309-row operation/type inventory accountable across the 16 reference areas. Layout prepares extension points; executable public examples, behavior checks and consumer evidence establish actual delivery. Future features outside this specification need their own accepted scope.

## One library, independent capabilities

City Library is one engine organized into six areas: Simulation, Spatial Structures, Graphs, Generation, City Models, and Data & Studies. Agent Loom supplies the design lineage for reusable modeling capabilities across these areas, not a separate product, import requirement or second engine. Its execution concepts belong to Simulation; its grid, graph and data contracts inform the corresponding areas. No consumer must initialize World or load every capability.

The six areas own the following responsibilities:

| Area | Owns | Boundary |
| --- | --- | --- |
| Simulation | Agents, World, tick, lifecycle, execution, optional Space and event integration | Coordinates world-owned identity and execution; no mandatory grid, geometry or city policy |
| Spatial Structures | Geometry, grids, fields, spatial queries and generic field calculations | Detached spatial capabilities; no graph reimplementation or forced World |
| Graphs | Graphs, nodes, edges, traversal/routing, network generation and analysis | Supports non-spatial use; topology does not guarantee access, path geometry or domain flow |
| Generation | Terrain, streets, parcels, zoning, buildings, assemblies and planning/feasibility variants | Produces descriptions; no implicit residents, traffic or supply state |
| City Models | Traffic, households, allocation, economy, decisions and supply | Owns domain policies, units and mutable quantities; reuses generic structures |
| Data & Studies | Parameters/Input, measurements, statistics, History, studies and one storage area | Shares model values explicitly; loading is a write and measurements are not model continuation |

The following roles describe composition size and usage, not additional top-level areas:

| Role | Responsibility | Boundary |
| --- | --- | --- |
| General modeling capabilities | Agent Loom's general objects, algorithms, execution and data contracts | No city policy, application UI or dependency on a city domain |
| Specialized domain modules and variants | Buildings, terrain, layouts, mobility, households, economy, supply and feasibility | Use selected general capabilities; expose task-specific assumptions and replaceable strategies |
| Explicit compositions and prototyping kits | Assemble useful static or live models from public capabilities | Own assembly and handoff policy, not duplicate domain state or a hidden runtime |
| External UI and applications | Rendering, interaction, editors, charts, host scheduling and I/O | Read public results and change explicitly exposed inputs; no access to private implementation |

These logical work areas are not a package manifest or claim about current exports; the binding source layout is defined above. Several areas use the same graph, random or storage capability; there is one owner per accepted capability. Their numbering is not a dependency hierarchy. Neither these roles nor the work areas require an inheritance tree, universal base class, plugin framework, registry or initialization pipeline.

Start with the smallest useful author script and its invariants. Select only the necessary capabilities, compare precise reuse candidates with external libraries and focused new work, then test the contract with a second real variant before generalizing it.

## Reference basis and usage organization

The binding Agent Loom [API table](agent-loom/api-table.md) supplies the operation/type inventory: **World, Agent, Grid, Field, Graph, Node, Edge, Random, Input, stats, geometry, Agenda, studies, storage, limits, Exports and shared types** (reference order, not a required implementation order). The companion [API reference](agent-loom/api-reference.md) expands vocabulary, examples, inputs/defaults, effects and errors. Both Markdown documents define the required core target. [Specification overview](agent-loom/README.md) explains scope, status and unresolved package entries.

Keep future reference pages task-oriented. Each entry identifies an operation, summarizes its contract and links to detailed usage. Within an object area, prefer creation, readable properties, mutations, queries, advanced operations and types where applicable. Keep naturally related actions together. Field has no independent constructor; statistics and geometry are primarily functions; experiment design and execution have their own workflow. Do not manufacture lifecycle methods to fill a rigid template.

The following tables summarize responsibilities and usage progression; they do not replace the binding API signatures or narrow their scope. Advanced features, behavior profiles and codecs specified there remain target work, delivered through bounded implementation slices. Report conflicting or unspecified behavior rather than silently changing the contract.

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
| geometry | Containment, normalization, displacement/distance/bearing, cell neighbors, orientation, path splitting, bounds and mapping | Pure spatial functions and structural data, with explicit dimensions/context. No Agent/Grid allocation or renderer. The specified planar GIS subset does not establish arbitrary solid geometry, polygon booleans or geodesy. |
| Agenda | Create; inspect time; queue/cancel event data; advance to a horizon within a budget; explicitly handle returned events | Owns pending event data, handles, insertion order and its own time. No automatic callbacks, World step or wall-clock timer. |
| studies | Design scenarios; replicate seeds; create/run independent models; measure/summarize; optionally evaluate, select, hold out or resume | Owns study plan, budgets and outcomes; each model owns its state. The reference execution contract uses World plus a step procedure. Host workers and compatibility bindings are explicit optional integrations, not requirements for static tools. |
| storage | Save/load supplied supported data; explicitly encode/decode; create and record bounded History; validate restored data | Owns snapshot/codec contracts and History buffers. Depends only on the selected data/component contracts; no file/database I/O in core. One area covers selected data and declared model state, with distinct guarantees. |
| limits | Read documented resource budgets for specific operations or adapters | Immutable policy data, not a global allocation manager. Target budgets cover declarations, planar geometry interchange, simple-network imports, finite study XML and study execution; their ceilings do not become universal model limits. |
| Exports and shared types | Discover delivered public entry points and the structural types required by accepted calls | A documentation and compatibility responsibility, not a catch-all module. The reference root maps to `city-library`; future Storage and Node experiment subpaths still require explicit mapping decisions. Do not silently discard or rename target entry contracts. |

Field and Edge remain visible reference categories even if implemented alongside their owning Grid and Graph. Do not split them into competing ownership systems merely to obtain a module per heading. Likewise, detached graph and grid capabilities may be stateful objects: independent use does not require converting every capability into stateless functions.

## Specialized domains and replaceable variants

| Domain boundary | Owns | Uses and exclusions | Work-area coverage |
| --- | --- | --- | --- |
| Buildings and architectural parts | Massing, floors, assemblies, attachment points and alternative generators | Selected geometry, site/grid data and RNG. No inferred residents, dwelling count, rent or demand. | Generation |
| Terrain, layouts and parcels | Height queries, street/block/parcel descriptions, reservations and buildable envelopes | Geometry, optional grids and RNG. Adjacency is not road access; street shape is not traffic. | Spatial tools and generation |
| Local field models | Domain meaning and update rules for heat, resources or other local quantities | Grid/Field and geometry; runtime only when needed. Generic diffusion does not define a physical process's units or boundary assumptions. | Spatial Structures calculations; City Models domain policies |
| Mobility and traffic | Access, route validity, path interpretation, queues, signals and movement policies | Graph routing and Agent movement; optional World/Agenda. Detached calculators need no World. No duplicate graph or implicit teleportation. | City Models with simulation and graph operations |
| Households, uses and economy | Allocation, capacities, occupancy, routines, balances, stocks and decision policies | Ordinary typed records, optional agents/graphs, explicit RNG. Synthetic homes/jobs suffice; no geometry requirement. | City Models |
| Infrastructure and supply | Service quantities, capacities, demand policy, allocation and shortage diagnostics | Generic graph/flow tools and explicit consumers. Network capacity allocation does not imply hydraulic or electrical physics. | City Models with Graphs |
| Quarter planning and feasibility | Scenario/program constraints, typologies, alternatives, quantity/cost summaries and bounded solver workflows | Selected building/layout outputs and focused solvers. Declare assumptions, jurisdiction and unsupported cases; no implied regulatory compliance. | Generation feasibility subtrack |

Variants share only a demonstrated task contract. Two house generators may accept the same site but produce different parts; two allocation policies may accept the same capacities but use different decision rules. Document extra requirements and unsupported cases instead of hiding them behind universal building, solver or system types. WFC, relaxation and optimization remain different problem contracts.

Architectural style that changes geometry belongs here: roof shape, facade openings, floor organization and part proportions affect generated form. Presentation style—materials, colors, line widths, symbols, lighting and camera choices—belongs to applications. A style name alone supplies neither geometric construction rules nor rendering behavior.

## Dependency and public-contract rules

General capabilities must not import city domains, kits or UI. Domains depend on selected general contracts; cross-domain relationships use explicit data/references and a composition that coordinates them. For example, mobility consumes destinations chosen by a household policy; it does not import that policy while the policy imports traffic. Kits depend on public general/domain operations; neither layer depends back on kits. Application and host adapters sit outside these boundaries.

Keep the implementation graph acyclic as capabilities arrive. World registration and component lifecycle need a single internal ownership implementation, not reciprocal module imports or parallel identity registries. Co-locate tightly coupled lifecycle mechanics within the binding domain boundaries where necessary; keep detached algorithms independently callable. Private helper splits may evolve as described in the binding layout; no public registration protocol is required.

Public entry points must be deliberate. Kits, applications and other domains use accepted public contracts, never deep imports into private helpers or source checkout paths. Shared types belong with the capability that defines their semantics. Do not collect unrelated types and algorithms in an all-purpose `utils` or `core` dependency.

Before implementing an operation, document its task, minimal example, inputs/results, units, defaults, bounds, ordering, mutations, errors, ownership, lifecycle and dependencies. State whether returned data is detached, a snapshot of canonical references, or a live view; define empty/partial results and numerical tolerance. A frozen array does not make its objects immutable. Explicit adapters handle incompatible units, dimensions or coordinate systems; TypeScript shape similarity is not semantic compatibility.

Runtime and distribution choices remain implementation decisions only where the binding API specification leaves them unspecified; changes to specified entry or host contracts require an explicit decision. Static geometry, generators, graph analysis and field calculations must work headlessly without World, DOM or a renderer. Generic imports must not pull in Node worker execution, browser globals or file access just because an optional host supports them. Introduce only delivered exports, not speculative package splits or stubs.

## Authoring vocabulary and canonical state

Use ordinary TypeScript, direct typed properties, native arrays/sets/maps and explicit composition. Reference examples use `Agent.create(...)`, `World.create(...)`, `world.add(...)` and `run(world, step, steps)`. Model values remain `agent.energy`, not a generic `.value` wrapper. Use `Position` and `Space`, not parallel public `Like`/`Context` synonyms. Native array queries remain the ordinary selection path; specialized World activation is an explicit advanced scheduling operation.

Creation/copy semantics and later assignments are distinct. The reference clones supported initial custom data but retains framework references; later assignments use ordinary TypeScript reference semantics. An agent copy is detached; a graph copy owns independent edges while retaining node identities. Do not promise a deep model clone from the word `copy` alone. Reserved built-in keys, supported data and failures need delivered contracts.

| State or relationship | Authority | Composition rule |
| --- | --- | --- |
| World membership and execution | World | Attaching a graph does not implicitly register its Agent nodes. A component has at most one World owner; attachment validates compatibility before mutation. |
| Graph topology and edges | Graph | Node objects may participate in several graphs subject to ownership constraints. Removing graph membership preserves the node object; graph algorithms do not own household or road policy. |
| Grid topology and field values | Grid / its Fields | Registration retains the same grid and cells. Position-derived occupancy is a query, not a second writable population. Grid space does not automatically become World space. |
| Domain capacities, allocations and balances | The selected domain model/policy | Every live quantity has one authority. Other domains retain canonical references or explicit observations, never competing mutable copies. |
| Generated descriptions | Generator result / caller | Valid without runtime. Admission to a live model explicitly supplies domain meaning, units and identity relationships. |
| Observation samples | History or caller | Own detached samples, never simulation state. Old samples need not track later live changes. |

Keep removal semantics receiver-specific: `world.delete(component)` detaches and requires its argument; `agent.delete()` deletes the individual; `graph.delete()` empties graph contents; `history.delete()` clears retained observations. World has no no-argument reset operation. Caller-owned arrays are not automatically cleaned when an agent is deleted. Process-local framework identity is distinct from a persistent domain key.

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

Decoded custom state remains untrusted until validated; static types cannot validate serialized data. Custom formats are explicitly passed adapters, not a mandatory codec registry, and cannot bypass model-state validation. Unsupported versions or values fail clearly rather than disappear. Implement snapshot compatibility and format coverage specified by the binding reference in bounded slices. Additional wire schemas require explicit contracts. Histories have explicit capacity, sampling and eviction behavior; streaming/backpressure needs its own contract.

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

These gates define evidence requirements without claiming completion. Use these requirements when extending the core and city capabilities:

1. **Contract and public boundary:** select one bounded task, write its minimal script and ownership/dependency contract, and record exact source revision/adaptations/notices. Export only the agreed public scope; check that consumers need no private/deep import or old checkout.
2. **Independent static capability:** generate one house without World/DOM; later exercise two real variants against the shared minimum contract. Independently verify a graph with non-spatial nodes and a grid/field calculation without runtime.
3. **Independent runtime:** run two headless models, one without grid/Space. Verify attachment/detachment, copy/delete, canonical identity, tick/error ordering and isolated RNG. Add Agenda cadence/budget checks only with the slice that integrates it.
4. **Explicit composition:** compare a kit with manual public operations using matched inputs and RNG continuation. Test one invalid handoff, partial result and bounded live change; reject duplicate occupancy/state and cyclic domain dependencies.
5. **Data before continuation:** roundtrip selected data and verify observations leave state/time/RNG unchanged. Accept exact resume separately by comparing uninterrupted and restored runs with a declared state inventory and rebound behavior.
6. **Evidence:** run the relevant type/behavior checks and a public downstream consumer when an entry point ships. Keep source-only, target-runtime, visual and scientific evidence separate. Independent review is a separate decision, not implied by passing tests or this design document.

## Open contracts

- **Package entries:** the specification uses `agent-loom`, `agent-loom/storage` and `agent-loom/studies/node`. The root mapping to `city-library` is already decided and used by public examples. Storage and Node experiment subpath mappings remain open before their delivery; the current package exposes only its root. Preserve specified serialization identifiers separately from package naming.
- **Shared lifecycle:** define the private coordination contract for identity, state copying, coupled movement and membership before implementing those interactions. Keep one owner and acyclic dependencies.
- **Further topology:** the [grid/parcel phase](grid-parcels/STATUS.md#bounded-layout-contract) freezes finite planar hexagonal/layout semantics. Wrapping layouts, irregular diffusion, volume layouts and their storage representations require later explicit contracts. Preserve original square/cubic behavior.

The [work plan](../PLAN.md) tracks available capabilities and next goals; the [specification overview](agent-loom/README.md) identifies the API source.
