# City Library work plan

Updated: 3 November 2026. Status: **planning and scaffold only**. No city capability has been implemented or transferred. `index.ts` exports no APIs. All areas below are planned, not packages, delivered exports, or transfer approvals.

## Reading order and ownership

[README.md](README.md) introduces the product. This plan owns work areas, priorities, deliverables, and acceptance gates. [Design decisions](docs/DESIGN.md) owns current boundaries and authoring conventions. Concise source context is retained in the design document; there is no separate provenance document. [AGENTS.md](AGENTS.md) contains stable working instructions.

## Six work areas

The engine is one composable library organized into six recognizable areas. Agent Loom is the source of the Simulation authoring direction, not a second product to integrate. Graphs is a separate area, independent of spatial coordinates, grids and World. These areas do not require six packages, compulsory initialization layers or empty source folders.

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

The former A01–A09 workstreams remain source lineage, not parallel top-level areas. Buildings, terrain/layout and feasibility are C04 subtracks; grid/field work is C02; Agent Loom becomes C01; transport, households/economy and supply become C05; data/studies become C06. Generic graph work is explicitly C03 rather than hidden in transport or spatial tools. This paragraph preserves the historical mapping without maintaining a second area list.

## Delivery sequence

| Milestone | Bounded work | Evidence required to finish |
| --- | --- | --- |
| M0 · Coherent preparation | Maintain this plan, local decisions/provenance, and honest implementation status. Select first concrete inputs and output. | Relative links resolve; design conflicts are recorded; source/target status is explicit; no claims of delivered APIs. |
| M1 · One house and one independent agent model | C04 buildings and C01 simulation can progress as separate slices. Introduce only their required tools; choose one implementation slice per commit. | Public examples execute headlessly, with focused behavior tests, independent instances and documented units/failures. The house needs no World; the agent model needs no grid. |
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
| Decide source layout and intentional exports | First implementation slice | Only delivered capabilities are exported; no empty module stubs or source-checkout paths. |
| Pin toolchain and development dependency policy | Before reproducible implementation checks | Exact supported versions and lockfile behavior documented; current `@types/bun: latest` is not a compatibility policy. |
| Separate runtime and development typing | Before public library build | Public declarations do not require DOM, framework, or Bun ambient types; development scripts may use Bun. |
| Add focused test/build/check commands and CI | As their real tasks arrive | Commands execute actual checks; no placeholder success scripts. Typecheck currently exists, build/test/CI do not. |
| Verify a packed downstream consumer | First distributable entry | Supported TypeScript/runtime/bundler consumers import the package rather than its checkout internals. Select and document the supported environments. |
| Decide formatting/linting scope | First code slice | Reuse a small configured toolchain with meaningful checks; no speculative pipeline. |

Keep the package publication guard (`private: true`) until release is explicitly in scope. Web-oriented is a target; browser/runtime compatibility must be demonstrated rather than inferred from TypeScript. No technical setup commands or dependencies were changed by this documentation revision.

## Scope boundaries and unresolved decisions

Rendering, materials, Drawing, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the engine work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

Exact first-generator contract, numerical precision, coordinate conversion, public packaging, runtime support, rights/notices, live admission/replacement behavior and complete model checkpoint scope remain slice decisions. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. No universal registry/token framework is frozen here.

Current documentation work does not transfer code, install libraries, implement the areas, or approve the historical function catalog as public API. Implementation progress must replace this status only when supported by actual target results.

## Source context

The source project is [city_game](https://github.com/dweigend/city_game). Its locally inspected handover revision `59f05d1766e1775c6d5efaada96c605862cab3ec` inventories candidate mechanisms and gaps, not current City Library exports. Source families include Volume Houses, Grid Lab, Town Painter, Infrastructure Atlas, City Flow, NetLogo TS and TestFit research. The latest Agent Loom reference decisions supersede conflicting historical Group/Drawing/appearance/clock names. [DESIGN.md](docs/DESIGN.md) records the current direction and inspected reference identities. No separate provenance document is maintained.
