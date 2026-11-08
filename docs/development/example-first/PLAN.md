# Extend City Library from executable city scripts

The author script is the product contract. Start with the user's readable task, establish its observable outcomes, freeze the public script, and implement the smallest library capabilities that satisfy it. Do not retrofit awkward calls, private imports or weakened assertions after implementation.

This plan records the three accepted examples and sequences the broader grid/parcel and Townscaper work. It adds no new runtime API. Source baseline: `feat/grid-parcel-foundations`, `2a7f3eb`. Current primary-checkout AGENTS.md and CODING_STANDARDS.md remain guidance even where concurrent and not committed to that baseline. Preserve existing accepted scripts and all primary-checkout work.

## Accepted authoring contract

Use ordinary TypeScript and existing public root imports from `city-library`. Read the model top to bottom: parameters, setup, rule execution and observations. Keep the main flow block-like, avoid nested loops/callback chains and unnecessary configuration nesting, and use short named functions only for meaningful model rules. No new DSL, builder, manager or pass-through wrapper just to save lines. Required GeoJSON shape nesting and existing state constructor contracts are not silently redesigned.

Keep state effects, RNG streams, units and update order explicit. Scripts own their city policy and generated street-line data; the library owns reusable geometry and simulation mechanisms. Rendering must not change ticks, randomness or model state. Numeric keys, Field identity and source correspondence keep their existing meanings.

The three [city scripts](../../../examples/city-simulation/README.md) are accepted author workflows. Their appended assertions define independent analytical outcomes. They are not comprehensive scientific models or a general European-city generator. Freeze their file hashes at this checkpoint. Any substantive later syntax or expectation change needs a recorded design reason and user agreement; implementation difficulty is not a reason. More assertions may be added without weakening the accepted task.

## Current gates

| Command | Scope | Current required result |
| --- | --- | --- |
| `bun run examples:city` | The household and regular heat scripts, with assertions | Pass |
| `bun run typecheck:city` | The same public scripts under strict TypeScript | Pass |
| `bun run examples:city:targets` | Those scripts plus the actual quarter target | Fail until missing APIs are delivered; then pass permanently |
| `bun run typecheck:city:targets` | All three source files, no fake declarations | Fail until public exports/types exist; then pass permanently |
| `bun run examples` / `bun run typecheck` | Existing regular gates plus the two ready scripts | Preserve passing baseline; record unrelated failures honestly |

The quarter remains visible in the capability ledger and dedicated red gates. Do not treat current regular-suite success as quarter acceptance. When a phase introduces its package entry or public types, verify a packed downstream consumer as well as checkout imports. CI work must preserve this delivered-versus-target distinction and make complete-phase acceptance depend on the target gates turning green, rather than adding an always-green expected-failure test.

## Delivery sequence

| Stage | Work | Public evidence before runtime | Completion gate |
| --- | --- | --- | --- |
| E0 | Register the accepted three examples; run delivered cases and record the red target | The exact files and independent arithmetic | Ready scripts run/typecheck; target failure recorded; no new runtime |
| E1 | Freeze a corridor/block geometry phase and choose a robust geometry implementation | Four or five asserted scripts: crossing roads; clipped road ends/T-junctions; holes/components and empty/full exclusion; unchanged/invalid/failure; purity and work bounds | Public corridor/subtract behavior/types and geometry invariants pass; quarter may still fail at subdivision |
| E2 | Deliver bounded deterministic convex OBB subdivision | Four or five scripts: analytic rectangle; minimum-area rejection; labelled west-frontage retry; partial budgets/remaining land; invalid/unsupported input and deterministic replay | Frozen scripts, all quarter assertions, target typecheck and packed consumer pass; promote the unchanged quarter file into standard gates |
| E3 | Deliver the independently prepared finite quad topology track | Four or five separately accepted scripts: triangle/quad refinement and hex area; square-target first-step oracle; validity/failures; RNG continuation and immutable revisions; explicit Grid state composition | Existing square/hex/import/Grid behavior preserved, finite generator and squareTarget verified; no claimed dual/chunk/building-solver delivery |
| E4 | Compose supported road-derived blocks with frontage and layout state | Partial labelled edges, point contacts, road caps, nonconvex/holed blocks, T-junction normalization or explicit rejection, state-transfer examples | Access means geometric frontage only; no lost land; unsupported cases explicit; no general subdivision-to-Grid claim without an accepted topology contract |
| E5 | Add other catalogue capabilities one user task at a time | Grouping, strips, Voronoi, measurement and skeleton phases each get their own four/five scripts | Preserve supported shape boundaries, method-specific work/RNG rules and all earlier scripts; no placeholder exports |
| E6 | Broader city generation and live models | Distinct scripts for a historical core, later extension and peripheral district; separate network/legal access, occupancy and replacement tasks | Meaningful outputs and declared assumptions; technical tests and visual judgement remain separate |

Stages describe dependency order, not a promise to ship the entire catalogue in one PR. E3 is algorithmically independent and may proceed in its existing thread once its own examples are agreed; it must not hold E1/E2 hostage or overtake their authoring decisions. The approved three scripts do not automatically approve that thread's earlier five unreviewed draft scripts. Resolve numerical constants and exact RNG consumption through the phase's example-first review before runtime. Do not ask the user to approve every routine internal choice; preserve their agreed public contracts.

## Independent expectations

- Household: `1000 + 12 * (2400 - 900) = 19000`, tick 12. This is a flow calculation, not an economy-wide conservation claim.
- Heat: eight cells at 20 plus one at 28 gives 188; after one face-diffusion step the center is 20 and each direct neighbor 22. Equal capacities and no boundary flux are explicit assumptions. Sum of temperatures is an energy proxy only under those assumptions.
- Quarter: each road has area 800; their overlap is 64. The road union is 1536 and remaining land is 8464. Every road position is in [30,70), so all four blocks are positive, convex and hole-free. The bounded midpoint OBB target is at most 400 and at least 100 per accepted part for this supported fixture. Budget limits permit complete division here; other fixtures must test honest partial/unchanged results.
- Verify geometry independently by area, containment, nonoverlap, shared-edge consistency and retained regions. A matching area alone cannot prove a valid partition. Avoid locking internal vertex order, RNG output or polygon count unless the author contract actually needs it.

## Phase workflow and review

1. Name a concrete author task and compare readable public call variants against existing terminology and exports. Declare units, defaults, shape support, mutation, errors, ordering, ownership and RNG continuation.
2. Write four or five complete asserted public scripts before runtime. Include a normal case, a meaningful alternative, a rejection/partial result, independence/determinism and a boundary case. Record honest missing-export failures, with no mocks, private imports, empty exports or skipped assertions.
3. Freeze source hashes and independent expected outcomes, record proposed public-type tests and the numerical decisions not dictated by the source. Obtain the independent design review required by current AGENTS.md (currently Gemini 4 Argon).
4. Delegate small runtime slices under the target coordination rules. Reuse existing code or a focused dependency only after comparing contracts and provenance/licensing. Fix implementation failures rather than rewriting accepted scripts.
5. Run phase scripts, focused behavior/type tests, target gates, existing regressions, typecheck, build and packed Bun/Node consumer as relevant. Run the complete required project check before claiming delivery; record actual commands and baseline failures. Never convert a missing target into an expected-failure success.
6. Obtain fresh independent runtime review, respond to findings and re-review material changes. If UI is introduced, separately verify real-browser interactions and matched rendered evidence. Pure headless scripts need no new UI or application server.
7. Update only evidenced capability status, promote fulfilled targets into regular gates, preserve source receipts/rejected evidence, and create an honestly scoped PR. Link it through T3 immediately. Merge remains separately authorized.

## Ownership and handoff

The source concept package was integrated in city_game at `5583c030`; it is research/design evidence, not target delivery. The existing Townscaper preparation branch is `feat/townscaper-grid`, based on `2a7f3eb`; its concurrent untracked documentation/drafts must remain untouched. This example contract checkpoint uses its own `docs/example-first-contracts` branch. Integrate the explicit checkpoint commit into the implementation branch after review, then continue against this accepted authoring contract. Preserve all 49 source catalogue rows and the integrated 58 operation/property entries as the roadmap; availability remains independently tracked.

Read the [verification and script hashes](VERIFICATION.md) for actual execution results. This plan does not itself claim corridor, subtraction, subdivision, Townscaper generation or a completed PR.
