# City Library work plan

Updated: 5 November 2026. Status: **specification and source scaffold; runtime not implemented**. `index.ts` exports no APIs. All capabilities below are planned.

## Reading order and ownership

[README.md](README.md) introduces the product. This plan owns work areas, priorities, deliverables, and acceptance gates. [Design decisions](docs/DESIGN.md) owns current boundaries and authoring conventions. [AGENTS.md](AGENTS.md) contains stable working instructions.

## Six work areas

The engine is one composable library organized into six recognizable areas. Agent Loom is the source of the Simulation authoring direction, not a second product to integrate. Graphs is a separate area, independent of spatial coordinates, grids and World. The work areas do not prescribe package boundaries or directory layers.

All entries are planned. P0 = coherent preparation; P1 = first standalone capabilities; P2 = second variants and static composition; P3 = live city integration and broader models. Priority describes bounded slices rather than the delivery of an entire area.

| ID | Area | Planned modules and tasks | Ownership and dependencies | First acceptance milestone | Priority |
| --- | --- | --- | --- | --- | --- |
| C01 | Simulation | World, agents, direct typed properties, lifecycle, selection through native collections, tick, execution, optional Space, basic movement and Agenda integration | Owns world membership and execution; coordinates lifecycle for world-owned objects. Uses C02/C03 capabilities explicitly without duplicating grids or graphs. No compulsory space, grid, city policy or presentation. | Two isolated headless models, including one without grid/space; verify lifecycle, step order, tick and independent RNG state. | P1 |
| C02 | Spatial Structures | Points, polygons, volumes, transforms, bounds, polygon operations, spatial indexes, planar/volumetric grids, neighborhoods, fields, sampling and diffusion | Owns geometric/topological calculations and detached field values. Live participation uses C01; geometric adjacency does not establish transport access. Numerical precision and units are explicit. | Minimum geometry for one house; then a grid with consistent cells/neighbors and a local field rule with defined boundaries/update order. | P1 → P2 |
| C03 | Graphs | Graph/node/edge structures, direction/weights, network generators, traversal, routing, connectivity, centrality, communities and focused flow/network analysis | Owns graph membership/edge rules and algorithm semantics. C01 coordinates world-owned object lifecycle; C05 supplies domain costs and access policies. No coordinates, World or grid required for detached graphs. NetworkX breadth is design scope, not delivered parity. | Route over a synthetic non-spatial graph; distinguish hop/weighted modes and ties, preserve reference identity, then verify one additional analysis family. | P2 |
| C04 | Generation | Terrain, street layouts/junctions/corridors, parcels, zoning/envelopes, alternative building generators, floors/parts, assemblies and architectural solver applications | Uses only selected C02/C03 tools and explicit random inputs. Returns descriptions without residents, rent or invented demand. Solver kinds remain distinct. Planning/feasibility is a research-led subtrack with explicit assumptions. | One standalone house, a second real variant, then a static neighborhood with reservation/setback and partial-result checks. Accept a separate feasibility scenario contract before implementing its solver. | P1 → P3 |
| C05 | City Models | Traffic/following/queues/signals/travel, households, housing/jobs allocation, daily routines, relocation, economy/stocks/transfers/markets, decisions/society and infrastructure/supply | Owns domain assumptions and canonical allocations/balances/demand. Detached calculators need no World or geometry. Live models use C01, validated C03 routes and optional C04 descriptions. Street shape is not traffic; supply allocation is not physical simulation. | Bounded allocation with explicit unassigned households; one commuter on a validated spatial path; later two policies for the same task and a small capacity network with unmet demand. | P2 → P3 |
| C06 | Data & Experiments | Parameters/input validation, model descriptions, metrics/statistics, bounded History, experiment series, one save/load area, versioned schemas/codecs and optional data targets | Input and loading are explicit writes; recording owns its buffer. Model time/identity remain C01's responsibility. A selected measurement record does not promise resumable model state. No UI definitions. | Validated model parameter, side-effect-free measurement and selected-data roundtrip; then two isolated experiment runs. Complete continuation requires its own state/behavior contract. | P2 → P3 |

## Shared tools, kits and integration

Random streams, numeric validation and focused solvers are independently usable capabilities, introduced only when a real task needs them. They do not form another product layer. Geometry belongs to C02; generic graph algorithms belong to C03. A solver needs a named problem contract: WFC, relaxation and optimization are not interchangeable. Randomness must not require World just because Simulation needs it.

Kits are compositions within or across the six areas. A static neighborhood primarily composes C04 generators and C02 tools. A commuting kit combines C01/C03/C05; a supply kit uses C03/C05 and optional consumers. Every kit uses public APIs, canonical objects and caller-owned execution, with no hidden clock, population or shadow occupancy record.

Description-to-live binding is an explicit integration task: C04 describes geometry; C01 coordinates lifecycle; C05 owns occupancy/travel consequences; C06 records supported state. The model composes those operations. Removing a building or entrance must resolve affected references and policies, not silently discard residents or preserve stale routes. Start with one bounded replacement case, not a universal registry framework.

## Delivery sequence

### Current focus: finish the agent modeling library incrementally

Phase one delivers the complete [Agent Loom specification](docs/agent-loom/README.md) across C01, C02, C03 and C06. It takes priority over city generation. Agent/World/execution is the first delivery; completion covers all 309 operation/type entries in the 16 reference areas, including compatibility profiles, codecs, advanced algorithms, limits and shared types.

| Step | Bounded result | Acceptance evidence | Status |
| --- | --- | --- | --- |
| A1 · First headless agent model | Direct typed Agent data, explicit World membership, caller-written step, Tick and synchronous run. Freeze creation/copy/delete and supported custom-state contracts before implementation; include only the Random closure actually required by World. | Small public script changes energy from 10 to 5 in five steps; a second World stays independent. Verify detach versus deletion, canonical identity, failed-step tick behavior, initial copy versus later reference assignment, reserved keys and invalid inputs. | Next; no runtime implemented |
| A2 · Independent random streams | Accept required draw/sampling operations and continuation behavior against recorded algorithm/version fixtures. | Same continuation gives matching results; separate streams stay isolated; construction, observation and execution draw only when documented. | Planned |
| A3 · Spatial agents | Optional Space, geometry, movement/orientation and perception, followed by path continuation in a separate bounded slice. | Detached and world-owned agents obey declared dimensions, units and hard/wrapped boundaries. Queries preserve position, time and RNG. Non-spatial A1 model still runs. | Planned |
| A4 · Grids and fields | Detached Grid/Field state, lookup and neighborhoods; then diffusion and explicit World participation. | Stable cell identities, declared boundary/order behavior, independent initial state and quantity conservation within a stated tolerance; occupancy queries use canonical agents. | Planned |
| A5 · Graphs | Non-spatial nodes/edges and membership first, then traversal/routing and selected analysis/generation families as separate slices. | Detached graph works without World/Space; nodes retain identity; detach/delete/copy rules hold; weighted costs and tie behavior are explicit. | Planned |
| A6 · Events and advanced execution | Agenda with caller dispatch; advanced activation only after its ordering contract is frozen. | Event tie order, horizon and budget behavior are verified; Agenda and World Tick remain distinct; no hidden clock. | Planned |
| A7 · Inputs and observations | Bind validated inputs to existing properties; pure stats and bounded History. | Writes affect canonical state; observations do not mutate model/time/RNG; History owns detached samples with explicit eviction. | Planned |
| A8 · Experiments and storage | Independent experiment runs and selected-data save/load first; declared model and study continuation require separate later slices. | Reordered runs preserve per-run results; validated roundtrip rejects unsupported data; exact continuation is accepted only against uninterrupted execution with a complete state inventory. | Planned |

Before A1 implementation, record an operation-level inventory from the binding reference table, compare source algorithms with focused new work and external alternatives, and report any contract gaps or conflicts for explicit resolution. Build the runtime in this repository and verify its public behavior independently of source-project results. The first runtime slice also supplies its required toolchain, exports and tests. Do not create empty modules for later steps.

Completion requires an explicit operation inventory covering every general reference area, including limits and public/shared types: each target operation/type must have a delivered public export, contract, executable example and target evidence. Deferred operations remain open work; exclusions and changes from the general reference scope require an explicit recorded decision. A small Agent implementation alone does not establish full Agent Loom completion. Compatibility profiles, broader graph algorithms, codecs and continuation specified by the reference remain target work, delivered in bounded slices. Substantial design or transfer work requires independent review; author checks do not count as independent approval.

### Prepared domain layout

The [domain layout and extension rules](docs/DESIGN.md#binding-domain-layout-and-extension-rules) define the source boundaries. All listed directories exist; empty leaf directories contain `.gitkeep`. Proposed TypeScript files are added only with working capabilities. No runtime, package exports, build pipeline or behavior tests have been delivered.

Hexagonal topology remains a future extension. Phase one specifies square/cubic grids.

### Broader city milestones

These milestones describe the broader city roadmap after the agent core. They do not change the phase-one delivery order.

| Milestone | Bounded work | Evidence required to finish |
| --- | --- | --- |
| M0 · Coherent preparation | Maintain this plan, local decisions/provenance, and honest implementation status. Select first concrete inputs and output. | Relative links resolve; design conflicts are recorded; source/target status is explicit; no claims of delivered APIs. |
| M1 · One house and one independent agent model | After the agent core, deliver an independent C04 building generator. Introduce only required tools and keep each slice focused. | Public examples execute headlessly, with focused behavior tests, independent instances and documented units/failures. The house needs no World; the agent model needs no grid. |
| M2 · Real alternatives | Add a second building variant; independently exercise C02 and a C03 graph without coordinates. Introduce minimal C06 input/metrics as needed. | Shared contracts work for two real variants; unsupported cases fail clearly. No hidden RNG or state coupling. |
| M3 · Static neighborhood | Compose C04 generators and C02 tools, with terrain or zoning only where required. | Reservations, parcels and houses agree; partial/empty results are valid where specified. Kit/manual public-call results agree. No live simulation required. |
| M4 · Live connection | Connect descriptions to canonical objects; add homes/jobs, one commuter, and a bounded building or access change. | Shared identity, allocation limits, route revision and occupied-change policy are tested. No orphan references or silently duplicated state. |
| M5 · Domain extensions | Extend C05 traffic, households/economy and supply, plus independent C06 experiments. Develop C04 feasibility through a selected bounded planning scenario. | Each policy has its own use case, assumptions and invariants. Distinguish capacity allocation from physics, matching from settlement, and geometry from planning compliance. |
| M6 · Advanced continuation and delivery | Add supported complete-state continuation, larger data streams or specialized formats only when needed. | Versioned state validation, reference reconstruction, bounded memory and continuation fixtures. No promise to resume arbitrary closures. |

Simple data export can happen before M6. The C04 feasibility subtrack and other research-heavy tasks do not block unrelated headless tools. Documentation, provenance, tests and packaging checks accompany every slice rather than waiting for a final integration phase.

## Acceptance for every implementation slice

1. Write the author task and smallest public example first; freeze inputs/results, units, bounds, defaults, mutation and failure behavior.
2. Compare exact local candidates, external libraries and a focused new implementation. Record source revision, required adaptations and notices; no blind cherry-picking.
3. Implement only the accepted closure, without imports from the old checkout, presentation code or unrelated experiment infrastructure.
4. Execute relevant behavior tests and type checks. Establish public imports and an external consumer when that slice introduces a package entry. Preserve deterministic streams and independent instances.
5. Use an independent agent review for substantial design/transfer work, record responses and distinguish author fixes from independent re-approval.
6. Update implementation status, executable examples and remaining gaps. Old-source test reports do not count as target verification.

## Technical setup backlog — not completed by this plan

| Setup task | When needed | Acceptance |
| --- | --- | --- |
| Deliver intentional exports within the accepted domain layout | First implementation slice | Domain directories and boundaries are already accepted and prepared. Export only delivered capabilities; add no empty module stubs or source-checkout paths. Reconcile the binding package entry names explicitly before distribution. |
| Pin toolchain and development dependency policy | Before reproducible implementation checks | Exact supported versions and lockfile behavior documented; current `@types/bun: latest` is not a compatibility policy. |
| Separate runtime and development typing | Before public library build | Public declarations do not require DOM, framework, or Bun ambient types; development scripts may use Bun. |
| Add focused test/build/check commands and CI | As their real tasks arrive | Commands execute actual checks; no placeholder success scripts. Typecheck currently exists, build/test/CI do not. |
| Verify a packed downstream consumer | First distributable entry | Supported TypeScript/runtime/bundler consumers import the package rather than its checkout internals. Select and document the supported environments. |
| Decide formatting/linting scope | First code slice | Reuse a small configured toolchain with meaningful checks; no speculative pipeline. |

Keep the package publication guard (`private: true`) until release is explicitly in scope. Web-oriented is a target; browser/runtime compatibility must be demonstrated rather than inferred from TypeScript.

## Scope boundaries and unresolved decisions

Rendering, materials, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the engine work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

The first-generator contract and city-domain admission/replacement remain later slice decisions. Numerical precision, coordinate conversion, packaging, runtime support, rights/notices and checkpoint details require slice decisions only where the binding target leaves them unspecified; specified contracts remain mandatory. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. Shared infrastructure requires a concrete use case.

The [Markdown API specification](docs/agent-loom/README.md) defines phase one. Track implementation status against public examples and behavior checks, not source-project results.
