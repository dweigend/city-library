# City Library work plan

Updated: 5 November 2026. Status: **A1, bounded A2a and the A5a non-spatial Graph kernel implemented and verified**. Fifteen frozen public scripts preceded their runtime changes. The current 83-test suite, type/build/package-consumer checks and lab browser acceptance pass. Network diffusion now demonstrates persistent contacts and topology-dependent propagation through the same headless model. A2b/A3/A4 and remaining A5–A8 contracts stay open; see [A5a evidence](docs/development/a5a-evidence.md).

## Reading order and ownership

[README.md](README.md) introduces the product. This plan owns work areas, priorities, deliverables, and acceptance gates. [System architecture](docs/ARCHITECTURE.md) owns current boundaries and authoring conventions. [UI design](docs/DESIGN.md) owns UI rules. [AGENTS.md](AGENTS.md) contains stable working instructions.

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

## Active UI refactor and reference-model validation

The [binding UI specification](docs/ui/README.md), [API table](docs/ui/api-table.md) and [API reference](docs/ui/api-reference.md) own shared UI authoring contracts. Readability comes first, followed by useful defaults and necessary customization. Candidate syntax is not frozen or delivered; existing examples remain unchanged. Independent review remains open after an Antigravity quota failure.

The user-defined [binding UI system rules](docs/DESIGN.md#binding-ui-system-rules) govern the proposed Svelte/shadcn-svelte migration. Rules are recorded; implementation and target acceptance remain open. Before runtime work, freeze simple public `ui.ts` authoring examples under the existing example-first gate. Each UI slice must demonstrate module encapsulation, shared components/tokens, no embedded CSS, `app.css` within 100 physical lines, and KISS/YAGNI scope. Acceptance requires shell checks plus real-browser interactions, desktop/narrow screenshots and an independent subagent review of those screenshots, with findings resolved and affected checks repeated. Preserve existing experiments and headless contracts; do not claim migration or review completion from this documentation update.

Svelte migration preparation: the [migration assignment](docs/development/svelte-ui-migration.md) and [five frozen public examples](examples/ui-migration/SHA256SUMS) preserve existing `defineUI` syntax. All five Bun scripts, their [explicit TypeScript check](examples/ui-migration/tsconfig.json), the existing `bun run typecheck` and hash verification passed before runtime work. This is author preparation evidence only. The earlier independent Antigravity `gemini-4-argon` review attempt failed on provider quota and produced no independent findings or approval. The user subsequently explicitly selected Antigravity `gemini-3.8-flash` for independent reviews; its independent design review completed with conditional approval for the generic runtime only. F01 (medium) blocks runtime until the TypeScript 7/Svelte-check compatibility issue is fixed and verified; the foundation owner is addressing it, with no resolution evidence recorded yet. F02 (low), the missing `app.css` import, is intentional during the legacy bridge and must be resolved by the migrated runtime. No implemented-runtime or screenshot approval exists. Upcoming independent reviews use that model; no silent substitution is authorized. The user deferred the Taxi Cabs grouping contract: add no grouping API, preserve its existing grouping/running UI and leave its migration open. The technical foundation remains separate; generic runtime work may start only after verified F01 remediation. Full acceptance requires resolved applicable contracts, browser interactions and independent review of actual desktop 1366×768/narrow 390×844 light/dark screenshots. Explicit scientific data colors remain unchanged; fixed theme tokens govern UI chrome and absent-color defaults.

The authorized [NetLogo Web catalog experiment](docs/development/netlogo-web-catalog-plan.md), tracked in [Epic #1](https://github.com/dweigend/city-library/issues/1), now targets **exactly 200 broadly selected models** from the 467 selectable entries. The user's 2026-11-05 scope update supersedes the original all-550 goal; the other 350 remain inventoried outside current scope. The root chat supplies the binding selection, including the four baseline ports and Segregation. It runs in a dedicated bound worktree from dfd0584. [Segregation](docs/development/segregation-contract.md) is the first new vertical slice; five asserted scripts preceded runtime. Catalog capture, selection, row-level audit, implementation, target verification and independent approval are separate states. Completion requires all selected 200 implemented and verified, without dropping complex entries.

The user authorized replacement of the historical Agend_Lab application. The [refactor assignment](docs/development/agent-lab-refactor.md) owns the shared top-level ui toolkit, ui/agent-lab application, automatically discovered experiments/*/{model.ts,ui.ts}, provenance and four NetLogo comparisons. This is active work, not completed acceptance. Existing frozen core examples and headless factories remain compatible. Required spatial/grid/observation capabilities must be explicit example-first core slices, not duplicate infrastructure hidden in experiments or UI. Runtime work follows consistency review and executable author examples; browser comparisons are separate evidence.

## Shared tools, kits and integration

Random streams, numeric validation and focused solvers are independently usable capabilities, introduced only when a real task needs them. They do not form another product layer. Geometry belongs to C02; generic graph algorithms belong to C03. A solver needs a named problem contract: WFC, relaxation and optimization are not interchangeable. Randomness must not require World just because Simulation needs it.

Kits are compositions within or across the six areas. A static neighborhood primarily composes C04 generators and C02 tools. A commuting kit combines C01/C03/C05; a supply kit uses C03/C05 and optional consumers. Every kit uses public APIs, canonical objects and caller-owned execution, with no hidden clock, population or shadow occupancy record.

Description-to-live binding is an explicit integration task: C04 describes geometry; C01 coordinates lifecycle; C05 owns occupancy/travel consequences; C06 records supported state. The model composes those operations. Removing a building or entrance must resolve affected references and policies, not silently discard residents or preserve stale routes. Start with one bounded replacement case, not a universal registry framework.

## Delivery sequence

### Current focus: finish the agent modeling library incrementally

Phase one delivers the complete [Agent Loom specification](docs/agent-loom/README.md) across C01, C02, C03 and C06. It takes priority over city generation. Agent/World/execution is the first delivery; completion covers all 309 operation/type entries in the 16 reference areas, including compatibility profiles, codecs, advanced algorithms, limits and shared types.

| Step | Bounded result | Acceptance evidence | Status |
| --- | --- | --- | --- |
| A1 · First headless agent model | Direct typed Agent data, explicit World membership, caller-written step, Tick and synchronous run. Freeze creation/copy/delete and supported custom-state contracts before implementation; include only the Random closure actually required by World. | Small public script changes energy from 10 to 5 in five steps; a second World stays independent. Verify detach versus deletion, canonical identity, failed-step tick behavior, initial copy versus later reference assignment, reserved keys and invalid inputs. | Delivered bounded A1; see evidence |
| A2 · Independent random streams | A2a delivers standard Mulberry uniform draws, sampling and continuation; A2b retains distributions, entropy and pinned MT compatibility. | Same continuation gives matching results; separate streams stay isolated; construction, observation and execution draw only when documented. | A2a delivered; independent review has no blockers; A2b remains open |
| A3 · Spatial agents | Optional Space, geometry, movement/orientation and perception, followed by path continuation in a separate bounded slice. | Detached and world-owned agents obey declared dimensions, units and hard/wrapped boundaries. Queries preserve position, time and RNG. Non-spatial A1 model still runs. | Bounded spatial movement/perception delivered with reference-model slice; paths and broader A3 remain planned |
| A4 · Grids and fields | Detached Grid/Field state, lookup and neighborhoods; then diffusion and explicit World participation. | Stable cell identities, declared boundary/order behavior, independent initial state and quantity conservation within a stated tolerance; occupancy queries use canonical agents. | Bounded Grid/Field lookup, neighborhoods, occupancy, diffusion and World membership delivered; broader A4 remains open |
| A5 · Graphs | Non-spatial nodes/edges and membership first, then traversal/routing and selected analysis/generation families as separate slices. | Detached graph works without World/Space; nodes retain identity; detach/delete/copy rules hold; weighted costs and tie behavior are explicit. | Bounded A5a kernel and headless network diffusion delivered; remaining A5 planned |
| A6 · Events and advanced execution | Agenda with caller dispatch; advanced activation only after its ordering contract is frozen. | Event tie order, horizon and budget behavior are verified; Agenda and World Tick remain distinct; no hidden clock. | Planned |
| A7 · Inputs and observations | Bind validated inputs to existing properties; pure stats and bounded History. | Writes affect canonical state; observations do not mutate model/time/RNG; History owns detached samples with explicit eviction. | Histogram/Gini delivered; Input, remaining statistics and generic History remain planned |
| A8 · Experiments and storage | Independent experiment runs and selected-data save/load first; declared model and study continuation require separate later slices. | Reordered runs preserve per-run results; validated roundtrip rejects unsupported data; exact continuation is accepted only against uninterrupted execution with a complete state inventory. | Planned |

Before A1 implementation, record an operation-level inventory from the binding reference table, compare source algorithms with focused new work and external alternatives, and report any contract gaps or conflicts for explicit resolution. Build the runtime in this repository and verify its public behavior independently of source-project results. The first runtime slice also supplies its required toolchain, exports and tests. Do not create empty modules for later steps.

Completion requires an explicit operation inventory covering every general reference area, including limits and public/shared types: each target operation/type must have a delivered public export, contract, executable example and target evidence. Deferred operations remain open work; exclusions and changes from the general reference scope require an explicit recorded decision. A small Agent implementation alone does not establish full Agent Loom completion. Compatibility profiles, broader graph algorithms, codecs and continuation specified by the reference remain target work, delivered in bounded slices. Substantial design or transfer work requires independent review; author checks do not count as independent approval.

### Active A1 assignment

The [A1 development assignment](docs/development/a1.md) freezes the public task, five example scripts, operation closure, supported-state rules, tests and a separate minimal HTML test host. The [complete delivery inventory](docs/development/coverage.md) tracks all 309 reference entries across 16 areas. Scripts were written and fingerprinted before runtime handoff; the initial public import failed as expected. Implementation must satisfy those scripts without adapting their accepted contracts.

The root reference import `agent-loom` maps explicitly to the existing `city-library` package name for A1. Operation syntax and serialization identifiers remain unchanged. Future storage/Node subpaths remain open. The user explicitly requested the HTML test host; it consumes public operations outside the headless library and requires separate real-browser verification.

A1 completion evidence: [checks, browser verification and review responses](docs/development/a1-evidence.md). The `gemini-4-argon` review found two copy-validation blockers, both fixed with regression tests; final author checks pass with 30 tests. This records remediation, not a second independent approval. A2a followed with five new scripts; A2b will likewise start with its own four or five scripts.

The user-requested HTML visualization is an external test-host follow-up, not another library expansion phase. It renders selectable canonical-agent observations in an explicitly non-spatial layout and uses existing headless model actions only. See [visualization boundaries and evidence](docs/development/ui-visualization.md). Library code and the frozen A1 scripts remain unchanged.

The subsequent user-authorized [Cytoscape visualization layer](docs/development/cytoscape.md) adds a network view to the external lab with separate application, DOM presentation, observation projection and renderer responsibilities. It visualizes existing agent observations and the last sampled Exchange pair only. Persistent relationships and A5 Graph remain future core work; view interactions must preserve model execution and RNG continuation.

### Active A2a assignment

The earlier bounded [A2a reproducible population dynamics](docs/development/a2a.md) expansion wrote five new public scripts and one reusable headless exchange composition before Random implementation. A2a covers numeric-seed Mulberry uniform draws, weighted/source-order/legacy sampling, in-place continuation, reseed/copy/local and raw double. Other distributions, entropy and the MT/NetLogo profile remain binding A2b work; the staged implementation must not advertise them as delivered.

Author verification and remaining scope are recorded in [A2a evidence](docs/development/a2a-evidence.md); run bun run check for all ten public scripts and the current 60-test suite. The example starts 24 agents with 10 resource units each. Each caller-owned step samples two canonical World members and transfers one unit if the donor has any. Ordinary steps conserve total resources; explicit lifecycle edits are separate. The HTML test host imports this same composition and adds seed/population controls while preserving its layout. Selection and rendering are observations, not another simulation. Concurrent repository organization moved the existing host to Agend_Lab and its lifecycle model to models/agent-lab; this work preserves those paths and the existing six lifecycle tests.

### Active A5a assignment

The user requested substantial library progress and a real simulation with network effects. The [A5a assignment](docs/development/a5a.md) therefore brought forward an independent non-spatial Graph kernel and a headless network-diffusion composition. Five asserted public scripts were frozen before runtime implementation and now pass. Persistent graph contacts, synchronous propagation, disconnected communities, explicit bridges and hub-versus-ring effects are the default lab scenario. [Usage](docs/development/a5a-usage.md) and [acceptance evidence](docs/development/a5a-evidence.md) describe the delivered subset. A2b/A3/A4 remain open; graph algorithms, generators, spatial paths/ties and full World graph participation remain later work. The UI uses the same headless model and owns only presentation and explicit run controls.

### Prepared domain layout

The [domain layout and extension rules](docs/ARCHITECTURE.md#binding-domain-layout-and-extension-rules) define the source boundaries. All listed directories exist; empty leaf directories contain `.gitkeep`. Proposed TypeScript files are added only with working capabilities. The prepared layout itself delivered no runtime. A1 now adds working Agent/World/Random modules, explicit root exports, build/check commands and behavior tests within those boundaries; later domains remain prepared directories.

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

## Example-first delivery gate

Clean public API design is the highest implementation priority. For every expansion phase, write four or five complete TypeScript example scripts before writing its runtime implementation. Examples must express real author tasks through the specified public API, with explicit expected results and executable assertions. They are acceptance contracts, not demonstrations rewritten to fit an implementation.

Keep scripts under `examples/` grouped by delivery phase. Record their target operation IDs, inputs, expected outputs, mutations and expected failures before implementation. Resolve unspecified or conflicting syntax against the binding specification explicitly. Do not silently edit the specification or invent convenience APIs. A phase containing multiple implementation slices defines its example set first; each slice additionally identifies the scripts and assertions it must enable.

Initially, examples may fail because their planned public exports do not exist. Record that state honestly; do not add mocks, empty runtime stubs, private imports or disabled assertions to make them pass. Freeze the scripts and expected results before handing off implementation. Correct the implementation when an example fails. Any substantive change to an accepted example's syntax, scope or expectations requires a recorded design reason and explicit user agreement; implementation inconvenience is not a reason to weaken the contract. Editorial corrections that preserve the contract may be recorded directly.

A phase is complete only when all of its four or five scripts typecheck and run through public imports with their assertions enabled, alongside focused behavior and type tests. Keep earlier phases' examples passing as regression checks. Example execution does not replace edge-case tests or establish browser compatibility. Record actual commands and outcomes. Do not claim example acceptance while public entry-name mapping remains unresolved.

### Historical A1 example briefs — subsequently delivered

| Planned script | Author task and required result |
| --- | --- |
| `examples/a1/01-energy-model.ts` | Create an Agent with typed energy, attach it to a non-spatial World and run five steps: energy changes from 10 to 5 and tick from 0 to 5. |
| `examples/a1/02-independent-worlds.ts` | Interleave two models; state, membership and clocks remain independent. Verify independent default Random identities and the accepted stream behavior, without construction-time draws. |
| `examples/a1/03-membership-lifecycle.ts` | Attach original references, deduplicate a batch, reject foreign ownership atomically, detach without deleting, then explicitly delete an agent. Caller-owned collections retain their references. |
| `examples/a1/04-copy-and-custom-state.ts` | Create agents from nested supported data, copy an agent into a detached living identity and verify the reference's copying rules; contrast initialization copying with later ordinary reference assignment. |
| `examples/a1/05-execution-errors.ts` | Throw during a model step: earlier effects remain, the failed step adds no tick, and execution stops. Also demonstrate zero-step execution and same-World reentrancy rejection with explicit assertions. |

These are the original task briefs. Their scripts and acceptance were subsequently delivered in A1; see the A1 assignment and evidence above. Their example-first ordering remains mandatory for new phases. Boundary/type tests cover reserved keys, iterator failures, thenables and numeric tick progress.

## Acceptance for every implementation slice

1. Apply the example-first delivery gate: write and freeze the phase's four or five public scripts before runtime implementation; define the slice's author task and freeze inputs/results, units, bounds, defaults, mutation and failure behavior.
2. Compare exact local candidates, external libraries and a focused new implementation. Record source revision, required adaptations and notices; no blind cherry-picking.
3. Implement only the accepted closure, without imports from the old checkout, presentation code or unrelated experiment infrastructure.
4. Execute relevant behavior tests and type checks. Establish public imports and an external consumer when that slice introduces a package entry. Preserve deterministic streams and independent instances.
5. Use an independent agent review for substantial design/transfer work, record responses and distinguish author fixes from independent re-approval.
6. Update implementation status, executable examples and remaining gaps. Old-source test reports do not count as target verification.

## Technical setup and remaining backlog

| Setup task | When needed | Acceptance |
| --- | --- | --- |
| Deliver intentional exports within the accepted domain layout | First implementation slice | Domain directories and boundaries are already accepted and prepared. Export only delivered capabilities; add no empty module stubs or source-checkout paths. A1 maps the root name to city-library; future subpaths still require an explicit decision. |
| Pin toolchain and development dependency policy | Before reproducible implementation checks | A1 pins Bun 1.4.2, TypeScript 7.0.2 and @types/bun 1.4.4 with a lockfile. Future upgrades require checks. |
| Separate runtime and development typing | Before public library build | A1 separates ambient-free library types, Bun development scripts and DOM UI checking; the packed TypeScript consumer verifies no host ambient dependency. |
| Add focused test/build/check commands and CI | As their real tasks arrive | Commands execute actual checks; no placeholder success scripts. A1 introduces typecheck/test/examples/build/consumer/check commands; CI remains open. |
| Verify a packed downstream consumer | First distributable entry | Supported TypeScript/runtime/bundler consumers import the package rather than its checkout internals. A1 checks a packed archive on Bun 1.4.2, Node 26.8.2 and TypeScript 7.0.2; browser UI evidence is separate. |
| Decide formatting/linting scope | First code slice | Reuse a small configured toolchain with meaningful checks; no speculative pipeline. |

Keep the package publication guard (`private: true`) until release is explicitly in scope. Web-oriented is a target; browser/runtime compatibility must be demonstrated rather than inferred from TypeScript.

## Scope boundaries and unresolved decisions

Rendering, materials, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the engine work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

The first-generator contract and city-domain admission/replacement remain later slice decisions. Numerical precision, coordinate conversion, packaging, runtime support, rights/notices and checkpoint details require slice decisions only where the binding target leaves them unspecified; specified contracts remain mandatory. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. Shared infrastructure requires a concrete use case.

The [Markdown API specification](docs/agent-loom/README.md) defines phase one. Track implementation status against public examples and behavior checks, not source-project results.
