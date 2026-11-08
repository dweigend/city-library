# Work plan

City Library brings reusable parts to simulations and games about future cities. Models work in scripts and browsers without depending on a renderer. See the [README](README.md) for the idea and [architecture](docs/ARCHITECTURE.md) for the boundaries.

## Available now

The repository provides a headless core, a shared UI and 125 paired experiment entries. The catalog target is 200 selected models; research dossiers cover the full selection. Implementation, scientific comparison and independent acceptance remain separate requirements.

The core includes Agent/World lifecycle and execution, seeded Random streams, spatial movement and perception, Grid/Field operations, Graph algorithms, planar geometry and statistics. The [Agent Loom specification](docs/agent-loom/README.md) defines the required API beyond the implemented subsets. Use [public exports](index.ts) and asserted examples to check a particular operation; the [coverage inventory](docs/development/coverage.md) needs reconciliation with those contracts.

Both UI hosts support `defineUI`, keyed live controls, flat groups, monitor formatting and labelled charts. All 125 entries use the shared contract without a model-specific fallback. The Svelte runtime remains a work in progress; the legacy host is available. See [Lab usage](ui/agent-lab/README.md) and the [UI API](docs/ui/README.md).

The [catalog ledger](experiments/catalog/progress.json) tracks model-level acceptance. Its summary needs reconciliation with the present entries before it can serve as a current completion total. A working setup or passing test does not establish scientific equivalence or complete accessibility.

## Next steps

1. Reconcile the row-level catalog ledger and summary with the present implementations and required evidence.
2. Finish remaining Svelte controls, lifecycle and model-switching acceptance, including desktop/narrow light/dark screenshots and independent inspection.
3. Complete the selected 200 models and their headless, source, browser and independent review gates. Follow the [model acceptance rules](docs/development/netlogo-model-acceptance.md).
4. Reconcile the operation-level API inventory with current exports. Review longer model scripts for readable public actions and observations.
5. Resolve the breadth of public domain-procedure access before exporting arbitrary helpers; the [procedure matrix](docs/development/model-function-encapsulation.md) records the open interpretation.
6. Define the next main release scope, finish its remote checks and obtain explicit merge approval. Preparing documentation does not complete the remaining model work.

New core capabilities still start with public examples. Agenda, advanced execution, RNG compatibility, paths, generic Input/History, study execution, codecs and complete continuation remain broader targets; check actual exports before treating a particular operation as missing or complete.

## UI and review

Keep model state in the headless model and UI declarations short. The [UI specification](docs/ui/README.md) defines authoring contracts; [UI design](docs/DESIGN.md) defines component, styling and browser-review rules. Existing accepted examples remain regression contracts.

Substantial design and transfer work requires independent review using the provider/model defined in AGENTS.md. Record findings, responses and approval separately; an unavailable reviewer leaves that gate open.

## Six work areas

Six work areas divide responsibilities without requiring separate packages or directory layers. Agent Loom defines their general modeling contracts. Graphs work independently of spatial coordinates, grids and World.

The table describes target scope and ownership, including capabilities still to be built. Named acceptance goals keep each area small enough to verify independently.

| Area | Target capabilities | Ownership and dependencies | First acceptance goal |
| --- | --- | --- | --- |
| Simulation | World, agents, direct typed properties, lifecycle, selection through native collections, tick, execution, optional Space, basic movement and Agenda integration | Owns world membership and execution; coordinates lifecycle for world-owned objects. Uses Spatial Structures/Graphs capabilities explicitly without duplicating grids or graphs. No compulsory space, grid, city policy or presentation. | Two isolated headless models, including one without grid/space; verify lifecycle, step order, tick and independent RNG state. |
| Spatial Structures | Points, polygons, volumes, transforms, bounds, polygon operations, spatial indexes, planar/volumetric grids, neighborhoods, fields, sampling and diffusion | Owns geometric/topological calculations and detached field values. Live participation uses Simulation; geometric adjacency does not establish transport access. Numerical precision and units are explicit. | Minimum geometry for one house; then a grid with consistent cells/neighbors and a local field rule with defined boundaries/update order. |
| Graphs | Graph/node/edge structures, direction/weights, network generators, traversal, routing, connectivity, centrality, communities and focused flow/network analysis | Owns graph membership/edge rules and algorithm semantics. Simulation coordinates world-owned object lifecycle; City Models supplies domain costs and access policies. No coordinates, World or grid required for detached graphs. NetworkX breadth is design scope, not delivered parity. | Route over a synthetic non-spatial graph; distinguish hop/weighted modes and ties, preserve reference identity, then verify one additional analysis family. |
| Generation | Terrain, street layouts/junctions/corridors, parcels, zoning/envelopes, alternative building generators, floors/parts, assemblies and architectural solver applications | Uses only selected Spatial Structures/Graphs tools and explicit random inputs. Returns descriptions without residents, rent or invented demand. Solver kinds remain distinct. Planning/feasibility is a research-led subtrack with explicit assumptions. | One standalone house, a second real variant, then a static neighborhood with reservation/setback and partial-result checks. Accept a separate feasibility scenario contract before implementing its solver. |
| City Models | Traffic/following/queues/signals/travel, households, housing/jobs allocation, daily routines, relocation, economy/stocks/transfers/markets, decisions/society and infrastructure/supply | Owns domain assumptions and canonical allocations/balances/demand. Detached calculators need no World or geometry. Live models use Simulation, validated Graphs routes and optional Generation descriptions. Street shape is not traffic; supply allocation is not physical simulation. | Bounded allocation with explicit unassigned households; one commuter on a validated spatial path; later two policies for the same task and a small capacity network with unmet demand. |
| Data & Experiments | Parameters/input validation, model descriptions, metrics/statistics, bounded History, experiment series, one save/load area, versioned schemas/codecs and optional data targets | Input and loading are explicit writes; recording owns its buffer. Model time/identity remain Simulation's responsibility. A selected measurement record does not promise resumable model state. No UI definitions. | Validated model parameter, side-effect-free measurement and selected-data roundtrip; then two isolated experiment runs. Complete continuation requires its own state/behavior contract. |

## Shared tools, kits and integration

Random streams, numeric validation and focused solvers are independently usable capabilities, introduced only when a real task needs them. They do not form another product layer. Geometry belongs to Spatial Structures; generic graph algorithms belong to Graphs. A solver needs a named problem contract: WFC, relaxation and optimization are not interchangeable. Randomness must not require World just because Simulation needs it.

Kits are compositions within or across the six areas. A static neighborhood primarily composes generators and spatial tools. A commuting kit combines simulation, graph and city-model operations; a supply kit uses graph and city-model operations and optional consumers. Every kit uses public APIs, canonical objects and caller-owned execution, with no hidden clock, population or shadow occupancy record.

Description-to-live binding is an explicit integration task: Generation describes geometry; Simulation coordinates lifecycle; City Models owns occupancy/travel consequences; Data & Experiments records supported state. The model composes those operations. Removing a building or entrance must resolve affected references and policies, not silently discard residents or preserve stale routes. Start with one bounded replacement case, not a universal registry framework.

### Broader city milestones

These goals extend the agent core into city applications. Each needs a bounded public contract and its own acceptance checks.

| Milestone | Bounded work | Evidence required to finish |
| --- | --- | --- |
| Coherent preparation | Maintain this plan, local decisions/provenance, and honest implementation status. Select first concrete inputs and output. | Relative links resolve; design conflicts are recorded; source/target status is explicit; no claims of delivered APIs. |
| One house and one independent agent model | After the agent core, deliver an independent building generator. Introduce only required tools and keep each slice focused. | Public examples execute headlessly, with focused behavior tests, independent instances and documented units/failures. The house needs no World; the agent model needs no grid. |
| Real alternatives | Add a second building variant; independently exercise Spatial Structures and a Graphs graph without coordinates. Introduce minimal Data & Experiments input/metrics as needed. | Shared contracts work for two real variants; unsupported cases fail clearly. No hidden RNG or state coupling. |
| Static neighborhood | Compose generators and spatial tools, with terrain or zoning only where required. | Reservations, parcels and houses agree; partial/empty results are valid where specified. Kit/manual public-call results agree. No live simulation required. |
| Live connection | Connect descriptions to canonical objects; add homes/jobs, one commuter, and a bounded building or access change. | Shared identity, allocation limits, route revision and occupied-change policy are tested. No orphan references or silently duplicated state. |
| Domain extensions | Extend City Models traffic, households/economy and supply, plus independent Data & Experiments experiments. Develop Generation feasibility through a selected bounded planning scenario. | Each policy has its own use case, assumptions and invariants. Distinguish capacity allocation from physics, matching from settlement, and geometry from planning compliance. |
| Advanced continuation and delivery | Add supported complete-state continuation, larger data streams or specialized formats only when needed. | Versioned state validation, reference reconstruction, bounded memory and continuation fixtures. No promise to resume arbitrary closures. |

Simple data export does not need complete continuation. Planning feasibility work and other research-heavy tasks do not block unrelated headless tools. Documentation, provenance, tests and packaging checks accompany every slice rather than waiting for a final integration phase.

## Example-first delivery gate

Clean public API design is the highest implementation priority. For every expansion phase, write four or five complete TypeScript example scripts before writing its runtime implementation. Examples must express real author tasks through the specified public API, with explicit expected results and executable assertions. They are acceptance contracts, not demonstrations rewritten to fit an implementation.

Keep scripts under `examples/` grouped by delivery phase. Record their target operation IDs, inputs, expected outputs, mutations and expected failures before implementation. Resolve unspecified or conflicting syntax against the binding specification explicitly. Do not silently edit the specification or invent convenience APIs. A phase containing multiple implementation slices defines its example set first; each slice additionally identifies the scripts and assertions it must enable.

Initially, examples may fail because their planned public exports do not exist. Record that state honestly; do not add mocks, empty runtime stubs, private imports or disabled assertions to make them pass. Freeze the scripts and expected results before handing off implementation. Correct the implementation when an example fails. Any substantive change to an accepted example's syntax, scope or expectations requires a recorded design reason and explicit user agreement; implementation inconvenience is not a reason to weaken the contract. Editorial corrections that preserve the contract may be recorded directly.

A phase is complete only when all of its four or five scripts typecheck and run through public imports with their assertions enabled, alongside focused behavior and type tests. Keep earlier phases' examples passing as regression checks. Example execution does not replace edge-case tests or establish browser compatibility. Record actual commands and outcomes. Do not claim example acceptance while public entry-name mapping remains unresolved.

## Acceptance for every implementation slice

1. Apply the example-first delivery gate: write and freeze the phase's four or five public scripts before runtime implementation; define the slice's author task and freeze inputs/results, units, bounds, defaults, mutation and failure behavior.
2. Compare exact local candidates, external libraries and a focused new implementation. Record source revision, required adaptations and notices; no blind cherry-picking.
3. Implement only the agreed scope, without imports from the old checkout, presentation code or unrelated experiment infrastructure.
4. Execute relevant behavior tests and type checks. Establish public imports and an external consumer when that slice introduces a package entry. Preserve deterministic streams and independent instances.
5. Use an independent agent review for substantial design/transfer work, record responses and distinguish author fixes from independent re-approval.
6. Update implementation status, executable examples and remaining gaps. Old-source test reports do not count as target verification.

## Tooling and release boundaries

Use the pinned Bun workflow and lockfile. `bun run check` runs typechecks (including Svelte), behavior tests, registered public examples, the library build and the packed public consumer. `bun run build:ui:svelte` checks the separate production UI build. Run checks appropriate to each change and record actual results; browser evidence remains separate from shell checks.

Keep headless package exports free of UI/framework/host ambient dependencies and verify downstream consumers when public entries or packaging change. The root package is `city-library`; additional subpaths require explicit contracts. GitHub CI is defined in `.github/workflows/check.yml` with stable Library checks and Svelte build jobs; a local command pass does not prove a hosted CI run or configured branch protection. Formatting/linting scope remains a separate tooling decision.

Keep `private: true` until publication is explicitly authorized. Do not merge into `main`, publish or remove active worktrees as an incidental part of implementation or documentation updates.

## Scope boundaries and unresolved decisions

Rendering, materials, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the engine work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

The first-generator contract and city-domain admission/replacement remain later slice decisions. Numerical precision, coordinate conversion, packaging, runtime support, rights/notices and continuation details require explicit decisions only where the binding target leaves them unspecified; specified contracts remain mandatory. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. Shared infrastructure requires a concrete use case.

The [Markdown API specification](docs/agent-loom/README.md) defines the required core scope: all 309 operation/type entries across 16 reference areas, including compatibility profiles, codecs, advanced algorithms, limits and shared types. Completion requires a delivered public export, contract, executable example and target evidence for each entry. Deferred operations remain open; exclusions or scope changes require an explicit recorded decision. Hexagonal topology remains a future extension; the core target specifies square/cubic grids. Track implementation status against public examples and behavior checks, not source-project results.

## City authoring and planar topology

Five [city authoring scripts](examples/city-simulation/README.md) cover household budgets, neighborhood heat, a generative quarter, scarcity and machine lifecycle. Four run through existing public APIs. The quarter remains an unmet target until corridor, subtraction and bounded subdivision are delivered; its dedicated target gates must remain red. Preserve accepted assertions and syntax. The [extension plan](docs/development/example-first/PLAN.md) owns the requirements and the [research guide](docs/development/example-first/RESEARCH-INTEGRATION.md) explains joint feasibility, transitions and observations.

[Grid and parcel foundations](docs/grid-parcels/STATUS.md) provide detached square, hexagonal and authored layouts, layout-backed Grid Fields and bounded planar merge/split. [Finite quad generation and square-target relaxation](docs/grid-parcels/TOWNSCAPER-CONTRACT.md) extend these APIs independently. Their [verification record](docs/grid-parcels/TOWNSCAPER-VERIFICATION.md) distinguishes checks and review scope; finite quads do not satisfy the quarter prerequisites. Wrapping layouts, irregular diffusion, volume layouts, dual mapping, chunks, arbitrary-boundary quads and architectural solving remain future work.

## Code quality

Follow the [coding standards](docs/CODING_STANDARDS.md) for library and readable reference scripts. Configure focused Biome commands as separate future tooling work; no Biome checks are configured or claimed.
