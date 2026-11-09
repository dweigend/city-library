# Extend City Library from executable city scripts

The author script is the product contract. Start with the user's readable task, establish its observable outcomes, freeze the public script, and implement the smallest library capabilities that satisfy it. Do not retrofit awkward calls, private imports or weakened assertions after implementation.

This plan owns the accepted city-script contracts and the geometry/topology expansion sequence. Four city scripts run through delivered APIs; the quarter remains a target. Finite quad generation and square-target relaxation are delivered independently, as recorded in the [topology status](../../grid-parcels/STATUS.md). The broader [migration sequence](../../../PLAN.md#remaining-migration-sequence) coordinates this work with model acceptance and the remaining core contracts.

## Accepted authoring contract

Use ordinary TypeScript and existing public root imports from `city-library`. Read the model top to bottom: parameters, setup, rule execution and observations. Keep the main flow block-like, avoid nested loops/callback chains and unnecessary configuration nesting, and use short named functions only for meaningful model rules. No new DSL, builder, manager or pass-through wrapper just to save lines. Required GeoJSON shape nesting and existing state constructor contracts are not silently redesigned.

Keep state effects, RNG streams, units and update order explicit. Scripts own their city policy and generated street-line data; the library owns reusable geometry and simulation mechanisms. Rendering must not change ticks, randomness or model state. Numeric keys, Field identity and source correspondence keep their existing meanings.

The original three [city scripts](../../../examples/city-simulation/README.md) are accepted author workflows; their accepted behavior remains unchanged; mechanical import-path changes are recorded in the [migration receipt](../model-path-migration.json). Two new probes, scarce resource and shared machine, test interaction semantics with the existing public API. Their execution/review status is recorded separately from the original checkpoint. Their appended assertions define independent analytical outcomes. They are not comprehensive scientific models or a general European-city generator. Freeze their file hashes at this checkpoint. Any substantive later syntax or expectation change needs a recorded design reason and user agreement; implementation difficulty is not a reason. More assertions may be added without weakening the accepted task.

## Current gates

| Command | Scope | Current required result |
| --- | --- | --- |
| `bun run examples:city` | Household, regular heat, scarce resource and shared machine, with assertions | Pass; retain all four asserted scripts as regressions |
| `bun run typecheck` | Repository-wide strict TypeScript and Svelte checks, including the four ready scripts | Pass |
| `bun run examples:city:targets` | All four ready scripts plus the actual quarter target | Fail until missing APIs are delivered; then pass permanently |
| `bun run typecheck:city:targets` | All five source files, no fake declarations | Fail until public exports/types exist; then pass permanently |
| `bun run examples` / `bun run typecheck` | Existing regular gates plus the four ready scripts | Preserve passing baseline; record unrelated failures honestly |

The quarter remains visible in the capability ledger and dedicated red gates. Do not treat current regular-suite success as quarter acceptance. When a phase introduces its package entry or public types, verify a packed downstream consumer as well as checkout imports. CI work must preserve this delivered-versus-target distinction and make complete-phase acceptance depend on the target gates turning green, rather than adding an always-green expected-failure test.

## Shared modeling rules

Give each fact one authoritative owner and declare its unit and system boundary. An inventory, a reservation, a reusable service slot and a throughput limit are different facts. Derive availability from inventory and reservations rather than maintaining a second writable stock. A booking occupies a machine without transferring its ownership or creating material.

State activation and conflict rules separately. Sequential order may decide a winner; decisions based on the same old state still require a jointly feasible allocation. Synchrony is not an allocation policy. Read/decide/resolve/apply can help explain a model, but it is not a compulsory execution pipeline or reason to add a framework.

Distinguish commitment, consumption and completion. A reservation holds capacity; starting may consume inputs; successful completion supplies output. Cancellation before consumption can release a reservation. Cancellation or failure after consumption needs an explicit loss/recovery rule, not an automatic refund. Existing `run` preserves earlier mutations when a step throws, does not advance that failed step's tick, and is not a transaction. Expected rejection should be established before mutation; retries must not consume twice.

Keep observation inert. Repeated measurement does not change state, identities, time or simulation RNG. Sample at declared points; UI invokes model actions and never runs a separate repair clock. Compare independent instances with prescribed demand and failure sequences before relying on matching seeds: different rules can consume the same stream differently.

Retain domain distinctions even when names resemble each other. Power is a rate and energy is a quantity; multiplying power by duration gives energy. Geometric adjacency is not transport access, graph reachability is not a legal entrance, and a supply graph is not electrical load-flow physics. Sharing, repair and recycling preserve different combinations of service, product identity and material. Measure unmet service separately from successful demand reduction. A common class or universal score would not settle these semantics.

## Parallel work tracks

Geometry is needed when shape changes the question, routing when travel or disruption changes it. Neither is a prerequisite for a stock balance, scarce allocation or machine lifecycle. Keep the following integration track independent of E1–E5 below; it does not replace or restart their accepted gates.

| Probe | Concrete contract | What remains model code |
| --- | --- | --- |
| [Last resource unit](../../../examples/city-simulation/04-scarce-resource.ts) | Inventory 1; A and B each request 1. Priority A yields inventory 0, A 1, B 0 and unmet demand 1. Reversing priority changes the winner. An invalidated request has no effect, and the model declares whether the next request is considered. Preserve total 1, nonnegative amounts and at most one accepted claim. | Eligibility, priority, rejection and quantity ownership. No allocation manager is required by this case. |
| [Shared machine](../../../examples/city-simulation/05-shared-machine.ts) | Inventory 2. Reserving one unit leaves physical inventory 2 and availability 1. Starting consumes one unit. Failure releases occupancy but does not restore consumed material. Repair-before-request at time 2 permits a start; reverse ordering rejects that definitive request. Cancellation before start only releases the reservation. Preserve canonical machine identity and exclusive occupancy. | Booking, start/failure/repair/cancellation policy, same-time order and service accounting. No reservation, process or clock framework is required by this case. |
| Later production/return and component contrasts | Add delayed return, explicit residue and conserved material first; later compare compatible recovered components and fulfilled service. Supply expected traces before writing a new script. | Recipes, quality classes, prices, demand, repair effects, component compatibility and recycling yields. Routing and geometry remain optional. |

For each new probe, include an altered rule, repeated inert observation and independent interleaved instances. The prescribed outcomes are test obligations; consult verification evidence for which assertions have actually executed. Do not call these probes new library capabilities. Four ready city scripts plus one red geometry target are not a substitute for four or five complete public examples before any new API expansion.

## Generalization gate

Use the six research responsibilities—state/balances, transformation, choice/allocation/settlement, connections/transport, time/execution and observation/comparison—as questions for a script. They are not six packages, classes or managers.

Before extracting any public operation:

1. Show a concrete need in at least two contrasting author tasks. Repeated lines or similar domain names alone do not establish a common mechanism.
2. Compare the existing public API and ordinary typed data/functions first. Keep recipes, priorities, cancellation, repair and other policy in the model until a repeated semantic contract is demonstrated.
3. Match ownership, units, identity, timing, mutation and failure behavior across the cases. Do not unify stocks, occupancy slots and flows by erasing their differences.
4. State the exact burden the extraction removes. Prefer one small composable operation over a new manager, universal change object, registry or required lifecycle.
5. Express the candidate through public scripts with independent expected results and contrasting failure cases. Keep the smallest supported contract; mark unsupported cases honestly.
6. Apply the existing example-first freeze, behavior/type/consumer checks and independent review before adding a runtime export. Retain earlier scripts unchanged.

The current scarcity and machine probes do not yet demonstrate a missing public function. They sharpen how existing Agent identity, state, World execution and ordinary model functions fit together. No new allocation, transfer, reservation or circularity vocabulary is frozen by this integration.

## Geometry and topology delivery sequence

| Stage | Work | Public evidence before runtime | Completion gate |
| --- | --- | --- | --- |
| E0 | Register the accepted three examples; run delivered cases and record the red target | The exact files and independent arithmetic | Ready scripts run/typecheck; target failure recorded; no new runtime |
| E1 | Freeze a corridor/block geometry phase and choose a robust geometry implementation | Four or five asserted scripts: crossing roads; clipped road ends/T-junctions; holes/components and empty/full exclusion; unchanged/invalid/failure; purity and work bounds | Public corridor/subtract behavior/types and geometry invariants pass; quarter may still fail at subdivision |
| E2 | Deliver bounded deterministic convex OBB subdivision | Four or five scripts: analytic rectangle; minimum-area rejection; labelled west-frontage retry; partial budgets/remaining land; invalid/unsupported input and deterministic replay | Frozen scripts, all quarter assertions, target typecheck and packed consumer pass; promote the unchanged quarter file into standard gates |
| E3 | Preserve delivered finite quad topology and square-target relaxation | Four or five separately accepted scripts: triangle/quad refinement and hex area; square-target first-step oracle; validity/failures; RNG continuation and immutable revisions; explicit Grid state composition | Existing square/hex/import/Grid behavior preserved, finite generator and squareTarget verified; no claimed dual/chunk/building-solver delivery |
| E4 | Compose supported road-derived blocks with frontage and layout state | Partial labelled edges, point contacts, road caps, nonconvex/holed blocks, T-junction normalization or explicit rejection, state-transfer examples | Access means geometric frontage only; no lost land; unsupported cases explicit; no general subdivision-to-Grid claim without an accepted topology contract |
| E5 | Add other catalogue capabilities one user task at a time | Grouping, strips, Voronoi, measurement and skeleton phases each get their own four/five scripts | Preserve supported shape boundaries, method-specific work/RNG rules and all earlier scripts; no placeholder exports |
| E6 | Broader city generation and live models | Distinct scripts for a historical core, later extension and peripheral district; separate network/legal access, occupancy and replacement tasks | Meaningful outputs and declared assumptions; technical tests and visual judgement remain separate |

Stages describe dependency order, not a promise to ship the entire catalogue in one PR. E3 is algorithmically independent and already delivered in its bounded form; preserve its [accepted contract and verification](../../grid-parcels/TOWNSCAPER-CONTRACT.md). It does not satisfy E1/E2. Additional topology algorithms need their own example-first contract, including numerical constants and exact RNG consumption. Do not ask the user to approve every routine internal choice; preserve their agreed public contracts.

## Research-to-test trace

| Research lesson | Executable or documentation owner | Evidence boundary |
| --- | --- | --- |
| Shared reading cannot allocate the last unit twice | Scarce-resource script: priority variation, invalid request, conservation and one accepted claim | Ordinary model policy; no generic resolver inferred. |
| Reservation, use, consumption and completion are distinct | Shared-machine script: stock/availability snapshots, failure, repair order, cancellation and identity | Consumed material is not automatically refunded; no transactional `run` claim. |
| Observations and comparisons must be controlled | Repeated-read and independent-instance assertions in the two new probes | A seed alone is not a controlled external demand/failure sequence. |
| R strategies preserve different things | Later production, shared-service and recovered-component briefs | No function per R, universal resource container or environmental ranking. |
| Teach one executable source at a time | The learning sequence below, with links to canonical scripts | No documentation website or visual redesign is delivered. |
| Spatial tools remain independent | Existing E1–E5 geometry/topology sequence and unchanged quarter target | Geometry is not mandatory for every economy, energy or transport model. |

The research source records remain in city_game: `docs/GLOBAL-ARCHITECTURE-BRAINSTORM.md` and `docs/MESA-DESIGN-RESEARCH.md`. This plan continues to own implementation order and acceptance; the source documents preserve research and desk scenarios rather than competing runtime contracts.

## Documentation learning sequence

Start with the executable household model, then observe its balance, vary a decision/order, understand an explicit failure boundary and compare independent instances. Introduce scarce allocation and machine lifecycle as short contrasting lessons. Add Graph or Grid only where the question needs it; connect a separate view after the headless behavior is understood.

Each lesson links one canonical source file and states its assumptions, run command, expected result, availability and a useful rule variation. Tutorials teach a path; task guides solve a problem; concept pages explain semantics; API reference preserves exact signatures and contracts. Do not copy the script into competing documentation implementations. This changes documentation content and sequence, not a rendered website or theme.

## Independent expectations

- Household: `1000 + 12 * (2400 - 900) = 19000`, tick 12. This is a flow calculation, not an economy-wide conservation claim.
- Heat: eight cells at 20 plus one at 28 gives 188; after one face-diffusion step the center is 20 and each direct neighbor 22. Equal capacities and no boundary flux are explicit assumptions. Sum of temperatures is an energy proxy only under those assumptions.
- Quarter: each road has area 800; their overlap is 64. The road union is 1536 and remaining land is 8464. Every road position is in [30,70), so all four blocks are positive, convex and hole-free. The bounded midpoint OBB target is at most 400 and at least 100 per accepted part for this supported fixture. Budget limits permit complete division here; other fixtures must test honest partial/unchanged results.
- Verify geometry independently by area, containment, nonoverlap, shared-edge consistency and retained regions. A matching area alone cannot prove a valid partition. Avoid locking internal vertex order, RNG output or polygon count unless the author contract actually needs it.

## Phase workflow and review

1. Name a concrete author task and compare readable public call variants against existing terminology and exports. Declare units, defaults, shape support, mutation, errors, ordering, ownership and RNG continuation.
2. Write four or five complete asserted public scripts before runtime. Include a normal case, a meaningful alternative, a rejection/partial result, independence/determinism and a boundary case. Record honest missing-export failures, with no mocks, private imports, empty exports or skipped assertions.
3. Freeze source hashes and independent expected outcomes, record proposed public-type tests and the numerical decisions not dictated by the source. Obtain independent Gemini 3.8 Flash design review and Opus 5.5 medium acceptance under the [migration review gates](../../../PLAN.md#refactoring-review-and-acceptance).
4. Delegate small runtime slices under the target coordination rules. Reuse existing code or a focused dependency only after comparing contracts and provenance/licensing. Fix implementation failures rather than rewriting accepted scripts.
5. Run phase scripts, focused behavior/type tests, target gates, existing regressions, typecheck, build and packed Bun/Node consumer as relevant. Run the complete required project check before claiming delivery; record actual commands and baseline failures. Never convert a missing target into an expected-failure success.
6. Obtain fresh independent Gemini runtime review, respond to findings and re-review material changes; obtain Opus acceptance and its API-simplification review before the slice is accepted. If UI is introduced, separately verify real-browser interactions and matched rendered evidence. Pure headless scripts need no new UI or application server.
7. Update only evidenced capability status, promote fulfilled targets into regular gates, preserve source receipts/rejected evidence, and create an honestly scoped PR. Link it through T3 immediately. Merge remains separately authorized.

## Source, ownership and remaining work

The [verification and script hashes](VERIFICATION.md) and [integration checks](INTEGRATION-VERIFICATION.md) retain the accepted city-script evidence. The [topology contract](../../grid-parcels/TOWNSCAPER-CONTRACT.md) owns delivered finite quad generation and square-target relaxation. Do not duplicate those implementations or infer corridor/subdivision from them.

The 49 source catalog rows and 58 operation/property entries remain the geometry roadmap; inclusion does not mean availability. For every further slice compare exact source candidates, dependency reuse and a focused implementation, preserving provenance and supported shape boundaries. Keep source quotations and frozen assertions intact, with current availability tracked separately.

The next runtime work is E1, then E2. E4 depends on their supported geometry and requires separate access/state-transfer contracts. E5 families remain independent tasks selected by a concrete author need; E6 generation and live admission/replacement require additional domain contracts. No universal solver or regeneration registry is implied.

The [research integration guide](RESEARCH-INTEGRATION.md) explains state ownership, joint feasibility, transition timing and observation through the delivered scarcity and machine probes, with graph, recovered-component and circularity comparisons as future research. Historical research evidence is linked separately from the current guide.
