# Integrated grid and parcel handoff receipt

Date: 8 November 2026. This target-owned receipt records a documentation transfer, not runtime acceptance. The finite topology contract, example freeze and executed target checks are recorded separately by the implementation slice.

The accepted authoring checkpoint `cf9baea` was cherry-picked as `2df94d1`.
Its [E0–E6 plan](../development/example-first/PLAN.md) now leads the work.
The two delivered city scripts remain green; the unchanged quarter remains a red
target for E1/E2. The user lifted the preparation hold for the independent E3
track. Earlier Townscaper drafts are not accepted by that checkpoint: complete
phase scripts, numerical decisions and fresh design review still precede runtime.
Historical package contents below are preserved unchanged.

## Source and copied evidence

The complete [proposal package](../library-handover/parcel-proposal/README.md) was copied byte-for-byte from `dweigend/city_game`, branch `docs/parcel-contract-proposal`, commit `5583c03039b1937cfe6d388b54692e583c2cdc26`. The source worktree was read-only and its package had no uncommitted changes. Every copied file was compared both with its committed Git blob and with the copied target bytes: 28 files, 3,186,191 bytes. The [SHA-256 manifest](TOWNSCAPER-PACKAGE-SHA256SUMS) lists target-relative paths for every copied file. Run `sha256sum -c docs/grid-parcels/TOWNSCAPER-PACKAGE-SHA256SUMS` from the repository root to verify the archive.

The source remote inspected was `git@github.com:dweigend/city_game.git`. Source paths printed in historical reports remain provenance, not runtime imports or package dependencies. No runtime source file was transferred. The archive deliberately preserves original status wording, dates, source quotations, author fragments and review findings; current target delivery must be read through this receipt and the slice's current contract/evidence, rather than by retroactively rewriting historical approvals.

The source [implementation handoff](../library-handover/parcel-proposal/IMPLEMENTATION-HANDOFF.md) takes priority over earlier parcel-only sequencing in the archived proposal: the first PR is the finite topology slice below, while OBB remains the next independent parcel slice. The older instruction to implement OBB first is historical parcel-track context, not a request to broaden this first PR.

## Target baseline and current guidance

The bound implementation branch is `feat/townscaper-grid`, starting from City Library `feat/grid-parcel-foundations` at `2a7f3ebb7b1d84a4accb17525946072db1c70cc3`. The source receipt does not assert that main contains that baseline. Before publication, inspect remote ancestry and PR #36: the initial intended PR base is `feat/grid-parcel-foundations`, whose existing PR targets `experiment/netlogo-web-catalog`.

Current user-authorized guidance was read from the primary checkout's `AGENTS.md` and `docs/CODING_STANDARDS.md`, including concurrent rule text, without copying or overwriting that checkout. It requires Minimum Sufficient Architecture, plain functions, strict public TypeScript, English repository content, example-first delivery and fresh independent Antigravity `gemini-4-argon` reviews. The older grid-branch Gemini 3.8 instruction does not override this explicit current-model instruction. Historical approvals in the archive cover their recorded documentation revisions only; they do not approve new runtime or tests.

## First PR boundary

Deliver only these two working public operations, reusing Layout, closed PlanarPolygon, Random and Grid:

```ts
topology.quadrilaterals({ rings, edgeLength, random });
topology.relax({ layout, method: "squareTarget", iterations });
```

Generation builds a finite regular hexagonal triangle patch, pairs unused edge-adjacent triangles randomly, then fully refines triangles into three quads and paired quads into four. Shared construction identities supply shared coordinates without rounded welding or display normalization. Relaxation is a distinct synchronous square-target operation with fixed boundary, bounded validity-preserving steps and fresh immutable revisions preserving local cell correspondence. The slice contract must freeze exact numeric/RNG choices and complete public asserted scripts before runtime work.

The quad Layout is the module-side geometric substrate. Mutable Grid Fields do not constitute Townscaper's separate player-side dual. No implicit World, Mesh class, dual conversion, state migration, new DSL, rendering or original-game fidelity claim is part of this delivery. Arbitrary-boundary quads and Lloyd remain documented research, with no stubs or ignored options. The prototype's Laplace passes, seven-decimal coordinate welding and 20-unit normalization are not adopted.

## Retained catalogue and staged roadmap

The complete [49-row trace](../library-handover/parcel-proposal/COVERAGE.md), [58 operation/property signature sections](../library-handover/parcel-proposal/api-table.md) and [27 supplementary type/result rows](../library-handover/parcel-proposal/api-reference.md#shared-types) are retained. These counts describe documentation coverage; they are not counts of delivered exports. The archive pins existing delivered labels to baseline `2a7f3eb`. Finite generation and squareTarget can change only their own current target status after verified implementation.

| Stage | Remaining capability and acceptance boundary |
| --- | --- |
| Existing regression foundation | Preserve square/hex/fromPolygons, Layout queries, area, bounded merge/split, Grid/Field identity and all frozen foundation examples. |
| Finite topology slice | First PR: finite generation and squareTarget only; exact construction, RNG continuation, immutable correspondence and validity fixtures. |
| Further topology and measurements | Triangle, trihex, rectangles, Voronoi, validation and measurements each need method-specific examples and numerical/capability decisions before export. |
| Parcel OBB | Deterministic convex hole-free recursion; frontage intervals, strict guards, retries, residual accounting, lineage and bounded work. No optimality or legal-access claim. |
| Road corridors and Boolean blocks | Compare robust dependencies on shared analytic fixtures; preserve holes/components and source road labels. Keep bridge/network policy separate. |
| Subdivision-to-Grid composition | Resolve partial-edge/T-junction normalization explicitly before admitting arbitrary recursive parcel results; Field transfer remains explicit model policy. |
| Grouping and strips | Separate connected grouping and parallel-strip contracts, budgets, ordering and RNG policy where relevant. |
| Straight skeleton | Actual wavefront events, offsets, strip/face attribution and slicing plus dependency/license decision; no ribs or always-unsupported placeholder. |
| Additional generation and models | Street/parcel co-generation, learned building layouts and planning policies remain separate extensions. |
| Townscaper follow-ups | Player/module dual correspondence, finite boundary closure, chunks/seams, variable resolution and architecture solver each require independent tasks and examples. |

## Reuse, dependencies and rights

The transferred package is design and provenance evidence. The finite implementation should reuse the target's existing Layout/PlanarPolygon predicates, Random and Grid APIs and add focused TypeScript algorithms. No external runtime implementation or dependency was copied or selected by this transfer. No root LICENSE or NOTICE file was found in the inspected source checkout; absence of a license is not a permissive code license. The source prototype is algorithm context only, and original Townscaper code was not identified.

The five PNGs are attributed rasterized pages from Vanegas et al. (2012), Aichholzer et al. (1995), Parish and Müller (2001), and Chen, Song and Ortner (2024). Their page/figure attribution and original links remain in [PAPERS.md](../library-handover/parcel-proposal/PAPERS.md#screenshot-assets-and-attribution) and the archived README. They were visually inspected during transfer; they are research evidence, not runtime output or unrestricted library assets. PAPERS explicitly records that rasterization was not redistribution/license clearance. The own pipeline SVG remains an explanatory schematic. This receipt does not grant additional rights or claim new clearance.

The archived dependency comparison records polygon-clipping as MIT, upstream Clipper2 as Boost Software License 1.0 with separate wrapper inspection required, and the inspected CGAL skeleton header as GPL-3.0-or-later or commercial. These are historical research findings, not installed dependencies, current legal advice or approval to copy implementations. Recheck exact versions, wrappers, transitive licenses and precision behavior when a future Boolean/skeleton slice selects one. The present finite slice needs none of those backends.

## Transfer checks and remaining gates

Executed for this transfer: read source package and current guidance; verify source commit/branch and clean package status; compare all 28 files against committed blobs and copied bytes; create and verify SHA-256 manifest; inspect five research PNGs and the SVG source; inspect catalogue/signature/type counts and internal local links. No source checkout was changed.

This documentation transfer runs no runtime, public-example, TypeScript, build, packed-consumer or browser checks and supplies no fresh independent approval. Those remain the implementation coordinator's gates. No browser-facing flow is added by this transfer. Findings/responses and fresh design/runtime reviews must remain separate from author validation and historical documentation approval.
