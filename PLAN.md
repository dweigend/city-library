# Work plan

This page sets the order of the remaining work and the rules every slice follows. It does not list what works today: [coverage](docs/development/coverage.md) owns library availability, the [catalog ledger](models/catalog/progress.json) owns selected-model acceptance, and the [README](README.md) explains the idea. [Architecture](docs/ARCHITECTURE.md) defines the boundaries.

## Where things stand

The headless core and the shared Svelte UI are usable. Models live under `models/<slug>/` with their headless implementation, UI binding, usage guide, notices and source records. Two kinds of model sit side by side: implementations from the fixed selection of 200 NetLogo models, tracked in the ledger, and additional illustrative models (the twenty Mesa/DES city models, the elevator and five teaching models from the retired examples directory). Keep their acceptance scopes separate: illustrative models never fill a missing selected implementation. The [ledger summary](models/catalog/progress-summary.json) has the current stage counts.

Fifteen independent [city simulation models](docs/development/city-simulation-models.md) have headless implementations, shared UI bindings and sixty asserted public scripts. Revision 1 passed central checks and independent review; revision 2 (below) replaces its mechanisms and has passed the bounded independent domain and visual reviews, with recorded low-severity limits. These synthetic models do not deliver a coupled city engine or change selected-model acceptance.

Implementation, scientific comparison and independent acceptance are separate requirements. A working setup or passing test does not establish scientific equivalence or complete accessibility. Relocating files or rebasing imports preserves executable assertions and does not advance scientific acceptance stages; the [path migration receipt](docs/development/model-path-migration.json) keeps previous and current frozen-file hashes, including ten manifest discrepancies already present at its base revision.

Use [public exports](index.ts) and asserted examples to check a particular operation. The Svelte UI is the single supported runtime, and all model entries use the shared [UI contract](docs/ui/README.md) without a model-specific fallback. Browser checks for the shared UI and their limits are in the [UI acceptance record](ui/model-lab/acceptance/README.md); execution and study capabilities are in [execution and studies](docs/execution-studies/STATUS.md).

## Accepted direction and target structure

The owner set the development sequence in the [roadmap](docs/evolution/roadmap.md):

1. Library logic first. Models in Model Lab each cover one small test case of a library capability.
2. Build the city library step by step, sharpening the core where needed.
3. Then game prototypes and 3D presentation.
4. Generative 3D design runs as a separate track in the same repository.

The [target structure](docs/evolution/structure.md), accepted on 2026-11-11, places autonomous core modules in `library-core/` (with `world-composition/` as the only aggregating folder), city systems in `library-city/<subsystem>/`, generative design in `library-generative-design/`, today's `ui/` in `ui-web/`, later Three.js presentation in `ui-3d/`, and keeps `models/` and `tests/` flat. No files have moved yet; current paths stay valid until its migration order is carried out, and no listed folder implies delivered functionality. The rows below, their gates and the review policy remain in force. How rows 3 and 4 relate to this sequence stays open until the NetLogo archive decision in [refactoring](docs/evolution/refactoring.md).

## Urban insight model revision

The subsequent [Opus 5.5 review](ui/model-lab/acceptance/city-models/opus-5-5-review.md) found changes needed in population rounding, policy validation, UI encodings and acceptance evidence. Earlier approvals remain historical records; they are not current acceptance of the requested revision. The user authorized a rework of all fifteen models for interesting urban experiments rather than calibrated predictions, including richer subject-specific visualizations. The [research brief](docs/development/city-model-research.md) records scientific references, access limits, proposed city experiments and contract-change boundaries before implementation. Revision 2 implements a question, a stated mechanism and at least two executable interventions per model, with revised contracts written before each runtime change, author browser evidence and one shared live-change rule. The [central status](docs/development/city-simulation-models.md#current-revision-status) owns current checks; independent mechanism reviews and successive screenshot reviews approve all fifteen revision-2 models for the stated teaching scope, with recorded low-severity limits.

## Remaining migration sequence

The [examples directory migration](https://github.com/dweigend/city-library/issues/58) removed `examples/`: canonical models were reused, public API assertions and unmet targets moved to explicit test fixtures, and the migration receipt records every former file and its destination. `bun run contracts` replaces the example runner; dedicated target commands remain separate. See [models and public contract tests](docs/development/examples-migration.md).

The structural migration is integrated: model folders, one Svelte runtime and one root TypeScript configuration are the baseline, not work to repeat. [Repository structure](#repository-structure-simplification) below owns the placement rules.

The table prepares the whole remaining scope as bounded work. A row is ready for implementation only after its stated contract and example gate. Independent tracks may proceed together when their state owners and public dependencies do not overlap. Create implementation PRs only when a concrete slice is reviewable. Each implementation slice remains independently reviewable and deliverable; this sequence does not authorize one large rewrite or a merge.

| Order | Bounded work and dependency | Concrete next result | Completion gate |
| --- | --- | --- | --- |
| 1 | Reconcile existing capabilities and evidence; no runtime dependency | [#52](https://github.com/dweigend/city-library/issues/52): Complete the operation mapping in [coverage](docs/development/coverage.md), resolve its entry-count discrepancy, and match selected-model stage claims to actual evidence. Keep the twenty city examples outside the selection. | Every target has a supported/partial/missing/contract-question decision with public symbol, example and check; unsupported stage claims remain open. No duplicated model implementation. |
| 2 | Finish shared UI acceptance; independent of new geometry | [#53](https://github.com/dweigend/city-library/issues/53): Compare [UI contract entries](docs/ui/api-table.md) with controls and fixtures. Exercise rapid switching, setup recovery, loading/execution errors, repeat-action cleanup, keyboard/focus and selection. | Current affected flows pass in a real browser; desktop/narrow light/dark images are independently inspected. Check lifecycle disposal and one model-state owner. Then assess per-model UI evidence separately. |
| 3 | Reconcile and accept existing selected models; use row 1 evidence | [#54](https://github.com/dweigend/city-library/issues/54): Start with the implemented biology/evolution and disease/gene models whose stage markers lack evidence, then review other implemented models in small mechanism-based groups. | Each claimed stage links sufficient current evidence under [model acceptance](docs/development/model-acceptance.md). Scientific/source comparisons and technical/browser checks remain distinct; tests do not imply full acceptance. |
| 4 | Implement one missing selected-model group; depends only on its actual API needs | [#55](https://github.com/dweigend/city-library/issues/55): Prepare Giant Component first as a bounded candidate because four frozen target scripts already exist. Inspect its [source contract](models/catalog/contracts/giant-component.md) and blockers before committing to runtime; choose later groups from the fixed catalog by available dependencies. | Frozen scripts, headless/source/browser/original comparison and independent acceptance pass. A fulfilled target enters normal gates; never add placeholders or weaken the target. Continue until all selected entries meet the same gates. |
| 5 | Deliver the quarter prerequisites; independent of model acceptance | [#38](https://github.com/dweigend/city-library/issues/38) [#39](https://github.com/dweigend/city-library/issues/39): Follow the [geometry sequence](docs/development/example-first/PLAN.md#geometry-and-topology-delivery-sequence): corridor/subtraction before bounded subdivision, preserving accepted quarter syntax. | Four or five frozen scripts per expansion phase, robust geometry invariants, partial-budget results, unchanged quarter assertions, target typecheck and packed consumer pass. Promote the quarter only after all prerequisites work. |
| 6 | Close core compatibility and algorithm gaps; order from row 1 and a real consumer | Select one missing operation family at a time: RNG compatibility, graph algorithms/routes, spatial operations, generic Input or explicit limits. Resolve standalone model-procedure access before adding it. | Exact reference inputs, overloads, failures, identity/order/RNG semantics and public consumer tests pass. Full parity requires every reference entry, not one example per area. |
| 7 | Complete data and experiment contracts; reuse delivered History/studies/Agenda | Selected-data save/load and codecs first; supported model-state reconstruction next; advanced study bindings/transport and complete continuation only with explicit state inventories. Resolve package subpaths before exporting them. | Data roundtrip is accepted separately from runnable continuation. Restored trajectories, clocks, queue state, RNG continuation, budgets and rebound behavior match uninterrupted runs for the declared supported state. |
| 8 | Build broader generation and live-city compositions after their concrete prerequisites | One independent house and a real alternative; static neighborhood; then one bounded admission/replacement or commuter/supply task from the [six work areas](#six-work-areas). | Headless manual and model composition results agree. Units, access, capacity, identity and partial outcomes are explicit; no hidden runtime, occupancy registry or geometry-to-city inference. |
| 9 | Final scope and delivery acceptance after the relevant rows | Reconcile target coverage, selected and illustrative model acceptance, public examples, architecture/design and package consumers. | Final exact PR diff has independent review and acceptance, required CI is green and explicit merge approval is obtained. Publication and removal of active worktrees remain separate decisions. |

[Coverage](docs/development/coverage.md) owns operation availability and concrete gaps; the [catalog ledger](models/catalog/progress.json) owns selected-model acceptance. Existing execution and study capabilities are reusable inputs to this sequence, not a reason to reimplement execution, History, capacity or observations: reuse the delivered Agenda, History, study and capacity functions and build no second execution or state model.

Open decisions block only the extensions they affect. Access to individual model procedures remains an [open API decision](docs/development/model-function-encapsulation.md). Storage and Node study subpaths and complete continuation also need their own contracts.

### Regular and target checks

`bun run check`, `bun run build:ui` and `bun models/catalog/progress.ts verify` are the regular technical checks. The quarter and Giant Component keep separate target checks that stay red until their capabilities are actually delivered: `bun run typecheck:city:targets`, `bun run contracts:city:targets` and `bun run typecheck:giant-component:targets`. A fulfilled target joins the standard gate only after real acceptance. Every concrete PR needs an independently reviewed final diff, green GitHub checks and explicit merge approval.

## Refactoring, review and acceptance

Follow the central [naming conventions](docs/NAMING_CONVENTIONS.md) for the naming migration and all subsequent work. Naming changes preserve behavior and require coordinated public-contract and consumer updates.

### Repository structure simplification

The [repository structure convention](docs/NAMING_CONVENTIONS.md#repository-structure) owns placement rules. Headless modules live in `library/`, checks in `tests/`, build tools in `library/development/` and migration evidence in `docs/development/`. The README shows the accepted [target structure](docs/evolution/structure.md); these current paths stay valid until its migration. Package imports remain rooted at `city-library`; old paths resolve through explicit mappings while immutable receipts and evidence retain their original bytes. The naming contracts below govern coordinated API and consumer changes beyond this directory relocation.

### Naming migration contracts

The [central conventions](docs/NAMING_CONVENTIONS.md) are accepted after independent review. This inventory records intended naming changes; it does not claim migrated exports or accepted runtime behavior. Existing assertions and semantic expectations remain acceptance gates. Rename frozen public syntax only through this recorded migration decision and update its callers and integrity records together.

The repository-wide naming completion also authorizes coordinated spelling and count/predicate corrections in delivered public contracts. Preserve assertions and behavior while migrating callers, serialized property consumers and integrity mappings together. Concrete mappings include graph `connected` → `isConnected`, analysis discriminant `pageRank` → `page-rank`, topology method `squareTarget` → `square-target`, and scalar count properties named for their counted subject. Local camelCase algorithm names remain unchanged when already correct. UI component filenames use PascalCase; required external spellings and immutable source/evidence records retain their identities. Each area is audited against every central naming rule; passing the folder migration alone does not establish naming completion. The [naming completion receipt](docs/development/naming-completion-receipt.json) records exact Library, model, UI, fixture and target-contract mappings, current paths and chained executable hashes. Prior receipts and assertion counts remain intact. Compile-only checks use capability names ending in `-types.ts`; runtime tests use `.test.ts`. Shared model helpers use `parseParameters` and `validateStepCount`, while public advance parameters use `stepCount`. Seeded comparisons of all 151 models agree in numerical values, order and random continuation after explicit naming and process-local identity mappings. The naming completion receipt also records the integrated check results, the model and public browser flows, the independently approved desktop and mobile screenshots in both themes, and the independent Opus 5.5 and Gemini 3.8 Flash approvals of the naming completion.

The provenance cleanup removes `sourceMarker` exports and observation/UI fields from executable modules. Their exact strings and original locations move to `models/<slug>/source-markers.json`. This is an explicit metadata schema change: provenance is read from source records, while domain observations contain model data. Baseline comparison must verify each removed marker against its source record before comparing all remaining fields; no scientific state, identity, ordering or random continuation is discarded. The unused DES contract aggregator is removed from executable tests and retained byte-for-byte as a historical text artifact for the original integrity receipt.

**Approved migration of 2026-11-11 (canonical verb vocabulary).** The owner approved four renames that apply the [verb table](docs/NAMING_CONVENTIONS.md#operations). Each preserves behavior, assertions, identity, ordering and random sequences; no aliases remain, and callers, frozen contract scripts with their integrity records, models and documentation migrate together:

1. Store: `put` → `add`, `get` → `request`, `cancelPut`/`cancelGet` → `cancel(ticket)`, `waitingPuts`/`waitingGets` → `waitingAdditions`/`waitingRequests`. `PutRequest`/`PutStatus` become `StoreAddition`/`StoreAdditionStatus` and `GetRequest`/`GetStatus` become `StoreRequest`/`StoreRequestStatus`; two ticket types remain because an addition always carries its value and ends `stored`, while a request may hold no value and ends `received`.
2. `EventTrace.record` → `EventTrace.add`.
3. `world.report` is folded into `world.activate`, which returns the callback results; `report` is deleted.
4. `ParcelShape` → `PlanarPolygonShape`, in the existing `PlanarPolygon`/`PlanarGeometry` family; the internal parcel-input naming becomes polygon naming.

Current capability inventory:

- Construction: static `Type.create`; membership: instance `world.add`.
- Studies: `studies`, `StudyModel`, `StudyOptions`, `StudyPlan` and declarative `StudySpec` targets; published subpath mapping remains unresolved.
- Topology: delivered `ordered-topology/1`, with explicit ordering and draw rules.
- Sampling: delivered `algorithm:"fisher-yates-descending"` for the full descending shuffle.
- Activation: fixed, shuffle and priority; `unsupported-interleaved-activation` rejects.
- Random: delivered Mulberry32; the proposed `mt-word-stream/1` contract remains undelivered and requires complete seed/distribution/continuation decisions.
- Representation targets: `finite-study-xml`, `simple-network-json`, `simple-network-data`, `model-world-json` and `model-world-data`. These names do not deliver codecs or authorize rewriting immutable serialized evidence. XML dialect revisions and snapshot provenance require explicit boundary schemas before implementation.

Executable assertions, ordering, identity and random sequences remain acceptance gates. Machine migration receipts retain provenance separately from this capability inventory.

### Refactoring

Apply the library refactoring skill to each affected kernel/algorithm and the model-script skill to each affected `model.ts`/`ui.ts`; use both across the boundary. Read their shared workflow and the [coding standards](docs/CODING_STANDARDS.md) before diagnosis and repeat their checks after changes. Keep the skills private. A refactor needs a concrete readability, cohesion or ownership benefit; function/file size is a review signal, not a splitting mandate. The completed library readability refactor and the limits of its evidence are recorded in the [library refactor record](docs/development/library-refactor.md); it does not establish scientific model acceptance or main integration.

### Review policy

Independent substantial design and implementation reviews use Antigravity `gemini-3.8-flash`. Final slice and exact-PR acceptance use Claude Opus 5.5 with medium effort. The user requires a final Opus 5.5 review of the exact proposed result before every push and merge. Confirm availability and never substitute silently. Record findings, implement meaningful fixes and obtain fresh independent rechecks for material changes; an author's response is not independent approval. The final-review requirement does not replace the substantial design and implementation review policy.

At every public API expansion, after each completed operation family, and before final integration, obtain an independent Opus review asking: “Can this be simpler? What is the KISS design with the same functionality?” Review actual public scripts and callers, not only a summary. Challenge wrappers, flags, duplicate state, competing variants and scattered ownership. Compare a concrete smaller design; implement supported simplifications before acceptance. Preserve accepted syntax and semantics. An API consolidation that changes a contract needs an explicit design decision and user agreement, not an incidental rename or alias removal.

Every substantial slice also reviews the [architecture rules](docs/ARCHITECTURE.md#binding-architecture-rules): dependency direction, headless execution, one state owner, canonical identity and explicit effects. For UI work, apply the design skills and [UI rules](docs/DESIGN.md#binding-ui-system-rules), then independently inspect actual screenshots. Repeat these cross-cutting checks at operation-family boundaries and final integration. Keep necessary source/legal/freeze/acceptance facts at their owner; no copied review diaries or historical handover archives.

## Six work areas

Six work areas divide responsibilities without requiring separate packages or directory layers. The core defines their general modeling contracts. Graphs work independently of spatial coordinates, grids and World.

The table describes target scope and ownership, including capabilities still to be built. Named acceptance goals keep each area small enough to verify independently.

| Area | Target capabilities | Ownership and dependencies | First acceptance goal |
| --- | --- | --- | --- |
| Simulation | World, agents, direct typed properties, lifecycle, selection through native collections, tick, execution, optional Space, basic movement and Agenda integration | Owns world membership and execution; coordinates lifecycle for world-owned objects. Uses Spatial Structures/Graphs capabilities explicitly without duplicating grids or graphs. No compulsory space, grid, city policy or presentation. | Two isolated headless models, including one without grid/space; verify lifecycle, step order, tick and independent RNG state. |
| Spatial Structures | Points, polygons, volumes, transforms, bounds, polygon operations, spatial indexes, planar/volumetric grids, neighborhoods, fields, sampling and diffusion | Owns geometric/topological calculations and detached field values. Live participation uses Simulation; geometric adjacency does not establish transport access. Numerical precision and units are explicit. | Minimum geometry for one house; then a grid with consistent cells/neighbors and a local field rule with defined boundaries/update order. |
| Graphs | Graph/node/edge structures, direction/weights, network generators, traversal, routing, connectivity, centrality, communities and focused flow/network analysis | Owns graph membership/edge rules and algorithm semantics. Simulation coordinates world-owned object lifecycle; City Models supplies domain costs and access policies. No coordinates, World or grid required for detached graphs. The specified graph algorithm breadth is target scope, not delivered coverage. | Route over a synthetic non-spatial graph; distinguish hop/weighted modes and ties, preserve reference identity, then verify one additional analysis family. |
| Generation | Terrain, street layouts/junctions/corridors, parcels, zoning/envelopes, alternative building generators, floors/parts, assemblies and architectural solver applications | Uses only selected Spatial Structures/Graphs tools and explicit random inputs. Returns descriptions without residents, rent or invented demand. Solver kinds remain distinct. Planning/feasibility is a research-led subtrack with explicit assumptions. | One standalone house, a second real variant, then a static neighborhood with reservation/setback and partial-result checks. Accept a separate feasibility scenario contract before implementing its solver. |
| City Models | Traffic/following/queues/signals/travel, households, housing/jobs allocation, daily routines, relocation, economy/stocks/transfers/markets, decisions/society and infrastructure/supply | Owns domain assumptions and canonical allocations/balances/demand. Detached calculators need no World or geometry. Live models use Simulation, validated Graphs routes and optional Generation descriptions. Street shape is not traffic; supply allocation is not physical simulation. | Bounded allocation with explicit unassigned households; one commuter on a validated spatial path; later two policies for the same task and a small capacity network with unmet demand. |
| Data & Studies | Parameters/input validation, model descriptions, metrics/statistics, bounded History, study series, one save/load area, versioned schemas/codecs and optional data targets | Input and loading are explicit writes; recording owns its buffer. Model time/identity remain Simulation's responsibility. A selected measurement record does not promise resumable model state. No UI definitions. | Validated model parameter, side-effect-free measurement and selected-data roundtrip; then two isolated study runs. Complete continuation requires its own state/behavior contract. |

## Shared tools, compositions and integration

Random streams, numeric validation and focused solvers are independently usable capabilities, introduced only when a real task needs them. They do not form another product layer. Geometry belongs to Spatial Structures; generic graph algorithms belong to Graphs. A solver needs a named problem contract: WFC, relaxation and optimization are not interchangeable. Randomness must not require World just because Simulation needs it.

Models compose operations within or across the six areas. A static neighborhood primarily composes generators and spatial tools. A commuting model combines simulation, graph and city-model operations; a supply model uses graph and city-model operations and optional consumers. Every composition uses public APIs, canonical objects and caller-owned execution, with no hidden clock, population or shadow occupancy record.

Description-to-live binding is an explicit integration task: Generation describes geometry; Simulation coordinates lifecycle; City Models owns occupancy/travel consequences; Data & Studies records supported state. The model composes those operations. Removing a building or entrance must resolve affected references and policies, not silently discard residents or preserve stale routes. Start with one bounded replacement case, not a universal registry framework.

### Broader city milestones

These goals extend the agent core into city applications. Each needs a bounded public contract and its own acceptance checks.

| Milestone | Bounded work | Evidence required to finish |
| --- | --- | --- |
| Coherent preparation | Maintain this plan, local decisions/provenance, and honest implementation status. Select first concrete inputs and output. | Relative links resolve; design conflicts are recorded; source/target status is explicit; no claims of delivered APIs. |
| One house and one independent agent model | After the agent core, deliver an independent building generator. Introduce only required tools and keep each slice focused. | Public examples execute headlessly, with focused behavior tests, independent instances and documented units/failures. The house needs no World; the agent model needs no grid. |
| Real alternatives | Add a second building variant; independently exercise Spatial Structures and a Graphs graph without coordinates. Introduce minimal Data & Studies input/metrics as needed. | Shared contracts work for two real variants; unsupported cases fail clearly. No hidden RNG or state coupling. |
| Static neighborhood | Compose generators and spatial tools, with terrain or zoning only where required. | Reservations, parcels and houses agree; partial/empty results are valid where specified. Composed and manual public-call results agree. No live simulation required. |
| Live connection | Connect descriptions to canonical objects; add homes/jobs, one commuter, and a bounded building or access change. | Shared identity, allocation limits, route revision and occupied-change policy are tested. No orphan references or silently duplicated state. |
| Domain extensions | Extend City Models traffic, households/economy and supply, plus independent studies. Develop Generation feasibility through a selected bounded planning scenario. | Each policy has its own use case, assumptions and invariants. Distinguish capacity allocation from physics, matching from settlement, and geometry from planning compliance. |
| Advanced continuation and delivery | Add supported complete-state continuation, larger data streams or specialized formats only when needed. | Versioned state validation, reference reconstruction, bounded memory and continuation fixtures. No promise to resume arbitrary closures. |

Simple data export does not need complete continuation. Planning feasibility work and other research-heavy tasks do not block unrelated headless tools. Documentation, provenance, tests and packaging checks accompany every slice rather than waiting for a final integration phase.

## City authoring and planar topology

The [city authoring contracts](tests/public-contracts/city-simulation/README.md) cover household budgets, neighborhood heat, a generative quarter, scarcity and machine lifecycle. Four exercise canonical models with separate `model.ts` and `ui.ts` files. The quarter remains an unmet target until corridor, subtraction and bounded subdivision are delivered; its dedicated target gates must remain red. Preserve accepted assertions and syntax. The [extension plan](docs/development/example-first/PLAN.md) owns the requirements and the [research guide](docs/development/example-first/RESEARCH-INTEGRATION.md) explains joint feasibility, transitions and observations.

[Grid and parcel foundations](docs/grid-parcels/STATUS.md) provide detached square, hexagonal and authored layouts, layout-backed Grid Fields and bounded planar merge/split. [Finite quad generation and square-target relaxation](docs/grid-parcels/QUAD-LAYOUTS-CONTRACT.md) extend these APIs independently. That contract preserves frozen historical signatures; use the [current naming map and API](docs/grid-parcels/STATUS.md) for executable names. Their [verification record](docs/grid-parcels/QUAD-LAYOUTS-VERIFICATION.md) distinguishes checks and review scope; finite quads do not satisfy the quarter prerequisites. Wrapping layouts, irregular diffusion, volume layouts, dual mapping, chunks, arbitrary-boundary quads and architectural solving remain future work.

## Example-first delivery gate

Clean public API design is the highest implementation priority. For every expansion phase, write four or five complete TypeScript example scripts before writing its runtime implementation. Examples must express real author tasks through the specified public API, with explicit expected results and executable assertions. They are acceptance contracts, not demonstrations rewritten to fit an implementation.

Keep delivered public scripts under `tests/public-contracts/`, UI fixtures under `tests/ui/` and unmet contracts under `tests/targets/`, grouped by capability. Models live under `models/<slug>/` with separate `model.ts` and `ui.ts`. Record their target operation IDs, inputs, expected outputs, mutations and expected failures before implementation. Resolve unspecified or conflicting syntax against the binding specification explicitly. Do not silently edit the specification or invent convenience APIs. A phase containing multiple implementation slices defines its example set first; each slice additionally identifies the scripts and assertions it must enable.

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

Use the pinned Bun workflow and lockfile. `bun run check` runs typechecks (including Svelte), behavior tests, registered public examples, the library build and the packed public consumer. `bun run build:ui` checks the separate production UI build. Run checks appropriate to each change and record actual results; browser evidence remains separate from shell checks.

Keep headless package exports free of UI/framework/host ambient dependencies and verify downstream consumers when public entries or packaging change. The root package is `city-library`; additional subpaths require explicit contracts. GitHub CI is defined in `.github/workflows/check.yml` with stable Library checks and Svelte build jobs; a local command pass does not prove a hosted CI run or configured branch protection. Formatting/linting scope remains a separate tooling decision.

Keep `private: true` until publication is explicitly authorized. Do not merge into `main`, publish or remove active worktrees as an incidental part of implementation or documentation updates.

## Scope boundaries and unresolved decisions

Rendering, materials, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the library work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

The first-generator contract and city-domain admission/replacement remain later slice decisions. Numerical precision, coordinate conversion, packaging, runtime support, rights/notices and continuation details require explicit decisions only where the binding target leaves them unspecified; specified contracts remain mandatory. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. Shared infrastructure requires a concrete use case.

The [Markdown API specification](docs/agent-loom/README.md) defines the required core scope: all 309 operation/type entries across 16 reference areas, including behavior profiles, codecs, advanced algorithms, limits and shared types. Completion requires a delivered public export, contract, executable example and target evidence for each entry. Deferred operations remain open; exclusions or scope changes require an explicit recorded decision. The core's regular Grid contract remains square/cubic. Finite hexagonal layouts and layout-backed Grids are available through the additive topology API; broader hexagonal behavior remains outside that regular Grid contract. Track implementation status against public examples and behavior checks, not source-project results.

The UI contract has no readiness state for playback. `complete` means a finished run, so models whose playback needs a prior user action (Central Limit Theorem, Random Combinations and Permutations) or never acts (Scarce Resource) keep Run enabled; their monitors and action buttons show the next step. A separate readiness predicate needs an example-first decision before use.

Model Lab controls follow the owner decision of 2026-11-11: a model initializes when it opens, **Reload** re-runs setup (**Reload with changes** while setup edits are pending), and **Run**/**Pause**, **Speed** and **Parameters** remain; the 1/10/100 step buttons are gone. Frozen browser checks use automatic initialization, **Reload** and a one-step Run/Pause helper; the [Lab controls receipt](docs/development/lab-controls-migration-receipt.json) records their changed hashes. Same-tick comparisons follow [model acceptance](docs/development/model-acceptance.md). Unresolved: Reload passes the displayed live value into setup, so a live binding whose getter inverts the canonical value flips on each re-initialization (`precedenceSpec` in `tests/ui/ui-authoring/03-alternate-observation.ts`); deciding whether Reload should use canonical values needs an example-first decision.

## Code quality

Follow the [coding standards](docs/CODING_STANDARDS.md) for library and readable reference scripts. Configure focused Biome commands as separate future tooling work; no Biome checks are configured or claimed.
