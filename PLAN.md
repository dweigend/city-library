# City Library work plan

Updated: 3 November 2026. Status: **planning and scaffold only**. No city capability has been implemented or transferred. `index.ts` exports no APIs. All areas below are planned, not packages, delivered exports, or transfer approvals.

## Reading order and ownership

[README.md](README.md) introduces the product. This plan owns work areas, priorities, deliverables, and acceptance gates. [Design decisions](docs/DESIGN.md) owns current boundaries and authoring conventions. [Source register](docs/PROVENANCE.md) records evidence and superseded assumptions. [AGENTS.md](AGENTS.md) contains stable working instructions.

## Nine concrete work areas

These are the primary planning and documentation groups. A work area may contain independent tools, interchangeable variants, and larger compositions. It is not a requirement to load the entire area, create a package per row, or initialize earlier areas before using a later one.

Priority: P0 = coherent repository preparation; P1 = first standalone capabilities; P2 = second variants and static composition; P3 = live city integration and broader models. Priorities are not promises that every operation in an area ships together.

| ID | Work area | Planned capabilities | Dependencies and ownership boundary | First acceptance milestone | Priority |
| --- | --- | --- | --- | --- | --- |
| A01 | Procedural buildings and parts | Massing, floors, cell-based forms, house variants, part placement, architectural assemblies and declared attachment points | Needs only the selected geometry/site/grid/random inputs. Returns descriptions, not residents, rent, or inferred resource demand. | Generate one house without World or DOM; add a second real generator and verify the shared minimum contract and variant-specific failures. | P1 → P2 |
| A02 | Grids, fields and local simulation | Planar and volumetric cells, adjacency, field values, sampling, diffusion and cellular/local rules | Topology and detached field calculations remain independent. Registering a live grid uses A03; no automatically created patches. Geometric adjacency is not road access. | One grid with consistent cells/neighbors, then a local field rule with defined boundary and simultaneous-update behavior. | P1/P2 |
| A03 | Agent Loom: agent models and execution | Agent Loom authoring direction: World, agents, direct properties, selection through native collections, lifecycle, optional Space, tick, model execution and Agenda integration | Owns live identity/membership and execution contracts, not city policy. Grids and geometry are optional. Reuses detached tools rather than introducing a second graph/field implementation. | Run two independent headless models, including one without grid/space; verify membership, copy/delete behavior, step ordering, tick and random isolation. | P1 |
| A04 | Landscape, streets and parcels | Terrain queries/generators, street layouts and junctions, corridor reservations, blocks, parcels, simple zoning and buildable envelopes | Static spatial output; terrain and grids are optional producers. Street shape is distinct from traffic. Basic designation rules are distinct from A08 feasibility workflows. | Combine explicit sites with a chosen building strategy; then create a static neighborhood with reservation, setback and partial-result checks. | P2 |
| A05 | Route networks, movement and traffic | Directed/weighted routes, route geometry, access validation, path following, queues, following models, signals and intersections | Generic graph algorithms are shared tools. A03 owns basic spatial actions/lifecycle; this area owns transport rules, route interpretation and travel invalidation. Detached traffic calculators need no World. | Route over a synthetic graph; then move one traveler along a validated path without teleportation and detect a stale or inaccessible route. | P2 → P3 |
| A06 | Households, uses and economy | Housing/job allocation, capacities, occupancy, daily routines, relocation, stocks, transfers, markets, decisions and social policies | Accepts synthetic homes/jobs without geometry. One policy owns each allocation; balances and stock have explicit owners/units. Geometric area does not determine dwelling count. | Two policies solve the same bounded allocation task; capacity and accounting invariants hold and unassigned households are explicit. | P3 |
| A07 | Infrastructure and supply | Service endpoints, connectivity, resource demand, capacities, allocation and shortage diagnostics | Uses graph tools and explicit domain quantities. Service geometry is not hydraulic/electrical physics. Live coupling to A06 requires a declared demand policy. | Solve a small synthetic capacity network with explicit units and traceable unmet demand. Physical solvers remain deferred pending a real contract. | P3 |
| A08 | Quarter planning and feasibility | Site/program inputs, typologies, constraints, parking, quantity/cost summaries, alternatives and feasibility workflows | TestFit research is design evidence, not an existing solver. Reuses A01/A04 geometry and focused solver tools. Planning assumptions and jurisdiction are explicit; no implied regulatory compliance. | Accept one bounded scenario/constraint contract with declared quantities and outcome meanings; distinguish infeasible, unsupported and budget-exhausted. An executable solver gets a separate later acceptance. | P3; research-led |
| A09 | Model data, analysis and storage | Parameter/input validation, model descriptions, metrics, statistics, bounded History, experiments, one save/load area, codecs and optional I/O targets | Ordinary typed data is shared with A03. Input changes and loading are explicit writes. History owns only its buffer; observations do not change model/RNG. Measurements are not resumable model state. | Validate a model input and record selected data; test save/load roundtrip for that data. Add isolated experiment runs and complete-model continuation only with their own state contracts. | P2 → P3 |

## Foundations and compositions: a second dimension

Geometry, polygon operations, coordinate transforms, random streams, generic graph algorithms, spatial indexing, validation, and focused solvers are reusable tools, not a tenth all-purpose management area. Give each accepted tool a named public interface and one implementation owner. Its dossier records ownership before several areas depend on it. Do not build a generic `utils` collection or duplicate tools inside each domain.

Grid construction and field topology belong to A02. Graph data/algorithms are independent capabilities; live membership is coordinated through A03 and transport semantics through A05. A solver gets a specific problem contract: WFC, relaxation and optimization are not interchangeable merely because all can expose a solve function.

Kits are compositions: a static neighborhood connects A01/A04; a commuting example connects A03/A05/A06; a supply example connects A07 to explicit consumers. They use the same public calls as manual scripts and own no second clock, population or occupancy record. No new kit registry or plugin framework is implied.

## Delivery sequence

| Milestone | Bounded work | Evidence required to finish |
| --- | --- | --- |
| M0 · Coherent preparation | Maintain this plan, local decisions/provenance, and honest implementation status. Select first concrete inputs and output. | Relative links resolve; design conflicts are recorded; source/target status is explicit; no claims of delivered APIs. |
| M1 · One house and one independent agent model | A01 and A03 can progress as separate slices. Introduce only their required tools; choose one implementation slice per commit. | Public examples execute headlessly, with focused behavior tests, independent instances and documented units/failures. The house needs no World; the agent model needs no grid. |
| M2 · Real alternatives | Add a second building variant; independently exercise A02 and a graph without coordinates. Introduce minimal A09 input/metrics as needed. | Shared contracts work for two real variants; unsupported cases fail clearly. No hidden RNG or state coupling. |
| M3 · Static neighborhood | Compose A01/A04, with terrain or zoning only where required. | Reservations, parcels and houses agree; partial/empty results are valid where specified. Kit/manual public-call results agree. No live simulation required. |
| M4 · Live connection | Connect descriptions to canonical objects; add homes/jobs, one commuter, and a bounded building or access change. | Shared identity, allocation limits, route revision and occupied-change policy are tested. No orphan references or silently duplicated state. |
| M5 · Domain extensions | Extend A05/A06/A07 and independent A09 experiments. Develop A08 through a selected bounded planning scenario. | Each policy has its own use case, assumptions and invariants. Distinguish capacity allocation from physics, matching from settlement, and geometry from planning compliance. |
| M6 · Advanced continuation and delivery | Add supported complete-state continuation, larger data streams or specialized formats only when needed. | Versioned state validation, reference reconstruction, bounded memory and continuation fixtures. No promise to resume arbitrary closures. |

Simple data export can happen before M6. A08 and other research-heavy tasks do not block unrelated headless tools. Documentation, provenance, tests and packaging checks accompany every slice rather than waiting for a final integration phase.

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
