# City Library implementation handoff

The user authorized integration of the complete concept, then a new implementation thread in the City Library project, on a new branch, with a pull request. The first concrete PR delivery is finite Townscaper-inspired quad generation and square-target relaxation. The complete grid/parcel catalogue remains the staged roadmap: do not drop its 49 rows or imply they are all implemented by this PR.

## Source and target

Copy this reviewed documentation package into an appropriate target-owned documentation location, preserving provenance and historical review boundaries. Record source branch/revision in the target receipt. Do not import runtime files from city_game, mutate its checkout, or use absolute source paths as package dependencies.

The prior grid foundation is City Library `feat/grid-parcel-foundations`, `2a7f3eb`. Its PR #36 is open against `experiment/netlogo-web-catalog`. Start the new isolated branch from that foundation using the thread's bound workspace strategy. Initially target the new PR against `feat/grid-parcel-foundations`; retarget only if the base has actually been integrated, checking ancestry rather than assuming main contains it. Preserve concurrent primary/checkouts, target frozen scripts and existing exports. Inspect current target AGENTS/PLAN/architecture/coding rules before runtime work; historical receipts do not replace them.

Read the current `/home/david/Projekte/city-library/AGENTS.md` and `docs/CODING_STANDARDS.md` from the primary checkout as the user-authorized rules reference, including any concurrent uncommitted guidance. At inspection its HEAD was `dfd0584`; this is not a claim that all current rule text is committed there. The new code branch still starts from `feat/grid-parcel-foundations` at `2a7f3eb`. Do not overwrite or blindly import the primary checkout's concurrent changes.

## First delivery

Implement only the accepted working subset of:

```ts
topology.quadrilaterals({ rings, edgeLength?, random });
topology.relax({ layout, method: "squareTarget", iterations });
```

Use the existing Layout, PlanarPolygon, Random and Grid.add public root APIs. No new mesh class, namespace, framework, implicit World, dual mapping, renderer or auto-state transfer. Preserve the older arbitrary-boundary/Lloyd signatures as deferred research records, not public stubs. New finite-overload type/runtime validation must reject mixed keys.

The user's authorization permits routine not-yet-frozen numerical and RNG choices to be concretized by the implementation thread. Record the rationale and alternatives, obtain independent design review, and freeze them in four or five complete public asserted scripts BEFORE runtime implementation. Do not stop for every ordinary numerical choice. A material conflict with an already frozen contract or an unavoidable API break still needs explicit resolution; never weaken accepted examples for implementation convenience.

Freeze lattice orientation/enumeration, pairing shuffle/candidate order/draw consumption, resource bounds, center convention, fixed internal force scale, bounded global step-halving, iteration cap and rollback/error behavior. Source evidence does not supply these exact constants. Candidate rings 1..7 and a candidate iteration cap are proposals requiring the fixture/review gate, not secret defaults.

## Five example-first tasks

1. Generate finite patches with rings 1 and 3 and pinned fresh RNGs; establish source-triangle/subdivision counts, analytic hex area, exact shared edges, closed four-corner cells, no gaps/overlaps and units scaling. Test triangle-to-three/quad-to-four primitives with independent small oracles.
2. Compare a rotated square fixed point and an asymmetric conforming quad fixture with a movable shared interior vertex. Calculate the first square-target step independently, check synchronous incident-quad forces, pinned boundary and immunity to input winding/cyclic-start representation. A Laplace-smoothed image is not a substitute.
3. Reject malformed/mixed options before drawing. Test unsupported non-quads/concavity, importer nonmanifold/T-junction limits, near-degeneracy, possible flips/crossings and bounded step-halving failure. No incomplete successful result or input mutation.
4. Verify same initial RNG state replay, intentionally advanced streams, invalid-input no-draw behavior, no RNG in refinement/relaxation, zero-iteration fresh immutable Layout, preserved incidence/local-key correspondence and unchanged old query snapshots. State precise post-draw-failure stream behavior.
5. Compose public imports through Layout queries and Grid.add; explicitly copy selected Field data between corresponding layouts, establishing distinct Field/Grid identities. Preserve all delivered foundation examples; include negative type tests for mixed overloads and unsupported regular-only LayoutGrid methods.

## Review and verification

Use scoped implementation subagents according to the current City Library coordination rules. Keep core headless; comments, filenames, commits and repository docs English, chat German. The coordinating implementation thread owns integration and evidence.

Run current target typecheck, focused behavior/type tests, all frozen examples, build, packed public consumers and the relevant full check. Record commands/outcomes and distinguish baseline failures from new failures. Preserve source attribution and inspect dependencies/licenses before any code reuse. Obtain independent review with the model required by current target rules (currently Gemini 4 Argon); document findings, fixes and the actual scope of re-approval.

No new UI is required for the first headless delivery. If a browser-facing demo is added, follow real-browser interaction and screenshot requirements at matched seed/camera/viewport/DPR, with a separate visual decision. Do not claim Townscaper fidelity from technical tests or from the existing source screenshots.

Push the new branch and create a concrete PR describing behavior, finite scope, API, checks and deferred work. Link the full PR URL immediately through the T3 PR-link tool. Do not merge without authorization. Report branch, head SHA, PR URL and actual checks/reviews; never label the whole 49-row roadmap complete because one finite slice passes.

## Remaining catalogue stages

Keep [COVERAGE.md](COVERAGE.md) as the complete 49-row trace. The 58 documented operation/property sections include overloads and methods, not 58 delivered exports.

- Preserve existing square/hex/fromPolygons, Layout queries, area/bounded merge/split and Grid/Field behavior as regression constraints.
- Other topology/measurement entries have their own capability/default examples before export; preserve the declared proposed/research distinctions.
- Implement deterministic convex OBB recursion with frontage intervals, residual accounting and work budgets from the reviewed contract as the next independent slice.
- Compare robust geometry dependencies on analytic corridor/Boolean/block fixtures before claiming arbitrary road-block extraction; retain holes/components and road labels. General subdivision-to-Grid use still needs a partial-edge/T-junction decision.
- Add grouping, parallel strips, Voronoi or other supported generators only with method-specific freeze tasks. Skeleton needs actual event/offset/strip handling and dependency/license decisions; incomplete backend research is not permission for a stub.
- Co-generation, learned building layouts and planning policies remain independent extensions, as do dual mapping, chunk seams and architecture modules. Their explicit deferral preserves the concept rather than falsely promising implementation in the first PR.
