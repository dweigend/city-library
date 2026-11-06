# City Library work plan

Updated: 6 November 2026. This plan describes the integration branch `experiment/netlogo-web-catalog`. The consolidation baseline is `49da939`; readable authoring, catalog migration and renderer corrections are implemented through `720e345`. This work has not been merged into `main`. Status below separates implemented code, executed checks and independent acceptance.

## Reading order and ownership

[README.md](README.md) introduces the product. This plan owns scope, priorities, sequencing and acceptance gates. [System architecture](docs/ARCHITECTURE.md) owns domain boundaries and contracts; [UI design](docs/DESIGN.md) owns UI rules. [AGENTS.md](AGENTS.md) contains working instructions. Historical slice assignments and evidence retain their original checkpoint context; they do not define today's Lab defaults or current test totals.

## Current implementation and evidence

- **Headless core:** Agent/World lifecycle and execution, seeded Random and continuation, bounded spatial movement/perception, Grid/Field neighborhoods/occupancy/diffusion, Graph kernel/copy/routing/analysis/generation, planar geometry and statistics. Public exports are defined in `index.ts`; implemented subsets do not establish full Agent Loom parity. See [Copy/Random integration](docs/development/copy-random-integration.md), [Tijuana integration](docs/development/tijuana-integration.md) and the [core API inventory](docs/development/coverage.md). The inventory still needs reconciliation with later slices.
- **Catalog:** 125 paired experiment entries are present. The binding delivery scope remains exactly 200 selected models; no complex selected entry may be silently dropped. All 200 research dossiers are integrated. Entry count and research completion do not establish scientific or independent acceptance.
- **UI:** the shared Svelte runtime, renderers and foundation are integrated as a WIP checkpoint. Existing public `defineUI` syntax is preserved. The legacy Bun host remains available. The user has authorized the missing shared authoring capabilities, including flat grouping; their frozen contract, runtime delivery and browser acceptance are tracked separately below. Taxi Cabs now uses public grouping and model reporters without a private mount patch or host exception.
- **Consolidation:** accepted donor changes and evidence are integrated, archived heads preserve donor history, and 13 released donor worktrees were removed. `main` and its existing uncommitted work were preserved. See the [consolidation report](docs/development/consolidation-report.md).
- **Recorded checks:** the consolidation global run passed 565 tests / 150683 assertions across 65 files, 215 public scripts, five TypeScript projects plus Svelte checking, library build and the packed Bun/Node/ambient-free TypeScript consumer. After a tooling-only change, typecheck, packed consumer and Svelte production build passed again. No later whole-suite rerun is claimed; raw records and warnings are linked from the consolidation report.
- **Acceptance limits:** integration Chromium smoke checks cover specific Directed Diffusion and Mandelbrot flows, not every catalog entry. For this authoring slice, an independent non-implementing agent inspected actual images, requested corrections and issued scoped visual approval. Earlier provider quota failures supplied no approval. The existing Flash review is scoped source/architecture approval, not visual or scientific acceptance.

The [progress summary](experiments/catalog/progress-summary.json) still records the older 105-model checkpoint: 103 headless-verified, 105 target-browser-verified/baseline-compared and one independently accepted model. Later batches are integrated, so these numbers must be reconciled from per-model evidence before publishing an updated acceptance total. Do not infer that all 125 entries have completed the recorded stages.

## Immediate priorities

1. **Reconcile the catalog ledger.** Incorporate the integrated B08/B09 evidence and remaining batch gates into the row-level ledger and summary. Resolve differences between present entries and recorded stages without raising counts from code presence alone. Preserve the fixed selection and all source/browser/review limitations.
2. **Finish Svelte acceptance.** Verify remaining affected controls, renderer lifecycles and model switching in real Chromium. Retain setup/live separation, drawing/repeat behavior and scientific colors. The readable-authoring contract and Taxi migration are implemented; retain the verified behavior while resolving fresh review findings. Obtain independent review of actual desktop/narrow light/dark screenshots; document actual PNG dimensions and image-access blockers. Do not claim complete migration or visual approval from source review or smoke checks.
3. **Complete the selected 200 models.** Deliver missing implementations and outstanding headless, source-baseline, target-browser and independent review gates. Use the [selected-model assignment](docs/development/netlogo-web-catalog-plan.md) for scope and the [per-model acceptance contract](docs/development/netlogo-model-acceptance.md) for required evidence; its historical checkpoint prose does not supersede current integration records.
4. **Reconcile remaining documentation.** Update operation-level coverage and architecture export descriptions against delivered public contracts. Replace historical current-Lab instructions and broken legacy paths. Retain provenance and original evidence without presenting old assignments as active work.
5. **Continue bounded core delivery.** Resolve remaining Agent Loom contracts through example-first slices. Agenda/advanced execution, full RNG compatibility, paths, generic Input/History, study execution, codecs and complete continuation remain broader targets. Inspect actual exports and evidence before declaring an operation missing or complete.

## Pre-main readable-authoring checkpoint

The [assignment](docs/development/pre-main-authoring-assignment.md) covers public model/UI readability, shared UI capabilities, encapsulation and motivation-led documentation. This work does not authorize a main merge, reduce the selected 200-model scope or raise scientific acceptance counts.

- Reader documentation starts with city experiments and sustainability questions, then offers actual run/model-writing paths. The approved diagram is unchanged.
- Four model factories show their execution flow upfront; Taxi exposes pure occupancy/income reporters. Their public examples preceded runtime and existing seeded behavior was preserved.
- Five UI author tasks preceded implementation. Separate refreezes corrected browser helpers, asynchronous settling and compiler diagnostic placement while retaining historical manifests and expectations.
- Typed keyed live bindings, concise setup, flat groups, monitor formatters and categorical/labelled charts work through common normalization in both adapters. All 125 entries were inspected/migrated; an already-simple entry needed no source change.
- Both-host browser checks cover the five public examples, overlap/getter precedence and nine additional chart/error/recovery fixtures each. Real failures in reactive error reporting, restart ordering, narrow chart labels and live network themes were corrected and retested.
- The fresh Svelte catalog smoke executed 125 setups and 124 valid one-step actions, with no per-model legacy fallback. Tijuana correctly retains its cityscape precondition. Six richer flows, lifecycle switching and desktop/narrow light/dark captures are retained in [catalog browser evidence](docs/development/authoring-catalog-browser/).
- An independent agent actually inspected the captures and closed its three visual findings. Its [review](docs/development/authoring-review/independent-visual-review.md) approves only the inspected authoring states, not complete accessibility or scientific parity.
- The [pre-boundary-correction local check](docs/development/authoring-final-checks/checks.json) passed 580 tests / 150783 assertions and all 224 public scripts, build and packed consumer. Astra then reproduced two uncovered session errors. Correction `d069be3` passes 11 targeted tests / 53 expectations, full typecheck, Svelte build and the new real-browser error matrix; a complete post-correction run is in progress. Historical green checks do not substitute for this follow-up.

### Remaining independent merge audit

- [ ] **P1 · callback-error ownership consistency.** Astra high reproduced owner/observation/epoch divergence when live `enabled` throws during restart. Correction `d069be3` validates the candidate and publishes callback-free current-owner state on failure. First setup, restart and post-preflight failure pass real-model tests and actual browser checks. Fresh independent source rechecks remain pending.
- [ ] **P2 · presentation edits after formatter failure.** Correction `d069be3` protects publication during setup/speed edits and preserves primary error, current draft and recovery. Browser checks pass without PageErrors; fresh independent source rechecks remain pending.
- [ ] **Fresh implementation feedback.** Gemini high gave conditional scoped approval; its contrast and local-check conditions have separate later evidence. Astra high reported the two errors above; fixes and fresh targeted independent review remain required. Earlier green checks do not close these reproduced edge cases.
- [ ] **Final integrated verification.** Local full check and Svelte build passed. Await the latest remote CI and complete the independent review disposition; preserve actual totals, source attribution and warning limits.
- [ ] **Documentation consistency.** Reconcile current UI availability and older assignment status with this implemented slice; keep historical evidence intact. Review remaining prose for a clear human explanation of the project's motivation rather than internal audit vocabulary.
- [ ] **Public domain-function interpretation.** The [Tijuana procedure matrix](docs/development/model-function-encapsulation.md) distinguishes public action paths from private procedures. The normative breadth of direct procedure access remains an explicit decision; no arbitrary helper exports or silent weakening of the rule.
- [ ] **Catalog ledger and complete scope.** Reconcile later batches with per-model evidence, preserve source/scientific/review limits, and fulfill the fixed 200-model delivery or obtain an explicit decision on a bounded main checkpoint. UI smoke checks do not complete these gates.
- [ ] **Main authorization.** Keep the integration PR as draft until its agreed scope and remaining acceptance are ready. Merge requires explicit user approval.

At each major checkpoint, obtain a fresh independent remaining-work audit and update these tasks. Implementation, browser behavior, scoped visual review, scientific acceptance and main-merge approval are separate states.

## UI and model delivery rules

The [UI specification](docs/ui/README.md), [API table](docs/ui/api-table.md) and [API reference](docs/ui/api-reference.md) distinguish implemented, experimental and candidate syntax. Unaccepted candidates are not delivered APIs. Keep public `ui.ts` declarations simple, projections readable and model changes behind defined actions.

Follow the [binding UI system rules](docs/DESIGN.md#binding-ui-system-rules): Svelte/shadcn-svelte, encapsulated modules, shared components/tokens, external CSS and `app.css` at most 100 physical lines. Every UI slice requires shell checks, real-browser interactions and independent inspection of actual screenshots, with findings resolved and affected checks repeated. Preserve explicit scientific colors and existing author contracts. The [migration assignment](docs/development/svelte-ui-migration.md) retains the frozen compatibility examples and acceptance requirements; the consolidation report records the later runtime integration.

Use the user-selected Antigravity `gemini-3.8-flash` for independent substantial design/transfer reviews after confirming availability. Record findings, author responses and approval separately. Do not substitute silently or treat historical quota failures as approval.

## Six work areas

The engine is one composable library organized into six recognizable areas. Agent Loom is the source of the Simulation authoring direction, not a second product to integrate. Graphs is a separate area, independent of spatial coordinates, grids and World. The work areas do not prescribe package boundaries or directory layers.

This table defines target scope and ownership, not completion of every listed capability. P0 = coherent preparation; P1 = first standalone capabilities; P2 = second variants and static composition; P3 = live city integration and broader models. Priority describes bounded slices rather than the delivery of an entire area.

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

## Acceptance for every implementation slice

1. Apply the example-first delivery gate: write and freeze the phase's four or five public scripts before runtime implementation; define the slice's author task and freeze inputs/results, units, bounds, defaults, mutation and failure behavior.
2. Compare exact local candidates, external libraries and a focused new implementation. Record source revision, required adaptations and notices; no blind cherry-picking.
3. Implement only the accepted closure, without imports from the old checkout, presentation code or unrelated experiment infrastructure.
4. Execute relevant behavior tests and type checks. Establish public imports and an external consumer when that slice introduces a package entry. Preserve deterministic streams and independent instances.
5. Use an independent agent review for substantial design/transfer work, record responses and distinguish author fixes from independent re-approval.
6. Update implementation status, executable examples and remaining gaps. Old-source test reports do not count as target verification.

## Tooling and release boundaries

Use the pinned Bun workflow and lockfile. `bun run check` runs typechecks (including Svelte), behavior tests, registered public examples, the library build and the packed public consumer. `bun run build:ui:svelte` checks the separate production UI build. Run checks appropriate to each change and record actual results; browser evidence remains separate from shell checks.

Keep headless package exports free of UI/framework/host ambient dependencies and verify downstream consumers when public entries or packaging change. The root package is `city-library`; future subpaths require explicit contracts. GitHub CI is defined in `.github/workflows/check.yml` with stable Library checks and Svelte build jobs; a local command pass does not prove a hosted CI run or configured branch protection. Formatting/linting scope remains a separate tooling decision.

Keep `private: true` until publication is explicitly authorized. Do not merge into `main`, publish or remove active worktrees as an incidental part of implementation or documentation updates.

## Scope boundaries and unresolved decisions

Rendering, materials, symbols, cameras, widgets, picking, browser editors and presentation hosts are outside the engine work areas. An external application may use public data and explicitly exposed inputs. Its browser and visual acceptance is separate from this library plan.

The first-generator contract and city-domain admission/replacement remain later slice decisions. Numerical precision, coordinate conversion, packaging, runtime support, rights/notices and checkpoint details require slice decisions only where the binding target leaves them unspecified; specified contracts remain mandatory. Geometric capabilities may use declared abstract units; city-domain admission must make metric conversion explicit. Shared infrastructure requires a concrete use case.

The [Markdown API specification](docs/agent-loom/README.md) defines phase one: all 309 operation/type entries across 16 reference areas, including compatibility profiles, codecs, advanced algorithms, limits and shared types. Completion requires a delivered public export, contract, executable example and target evidence for each entry. Deferred operations remain open; exclusions or scope changes require an explicit recorded decision. Hexagonal topology remains a future extension; phase one specifies square/cubic grids. Track implementation status against public examples and behavior checks, not source-project results.
