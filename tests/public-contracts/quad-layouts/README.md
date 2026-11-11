# Finite quadrilateral topology examples

Status: E3 public scripts frozen before runtime, 8 November 2026. Independent
Gemini 4 Argon design and runtime reviews approved this bounded slice; all five
scripts pass unchanged and are included in the standard example/typecheck gates.
These replace the earlier stopped, unagreed drafts. The accepted E0 scripts and
all previously frozen examples remain unchanged. The five scripts use public
root imports, a flat author workflow and appended acceptance assertions; focused
behavior/type tests supply the wider numerical/topological edge cases.

| Script | Author task and independent acceptance |
| --- | --- |
| `01-finite-hex-refinement.ts` | Make finite hex patches in local units; seed 7 yields 14/122 quads at radius 1/3, analytic hex area, complete 3/4 subdivision oracles, shared-edge conformity and exact scaling. |
| `02-square-target-first-step.ts` | Relax four conforming quads; independent summed-force first step `(1.25,.75)` to `(1.1875,.8125)`, fixed boundary, winding/start invariance and a rotated-square fixed point with a movable interior vertex. |
| `03-validation-and-failure.ts` | Safely relax a distorted patch by bounded halving; reject exhausted candidates, unsupported faces, invalid/mixed input and importer nonconformity without mutation or malformed-input RNG draws. |
| `04-continuation-and-revisions.ts` | Replay an explicit RNG continuation, distinguish an advanced stream, verify 71 draws for radius 3, and obtain fresh immutable zero/positive revisions with preserved key/incidence correspondence and old snapshots. |
| `05-explicit-grid-state-copy.ts` | Build two detached Grids and explicitly copy selected population values between corresponding cells; verify distinct Grid/Field identities and independent state. |

The [phase contract](../../../docs/grid-parcels/QUAD-LAYOUTS-CONTRACT.md) fixes
numerical bounds, exact enumeration/draw order, square-target forces, global
halving and all failure/ownership semantics. `tests/townscaper-grid-types.ts`
rejects mixed literal and named-variable options and regular-only LayoutGrid
capabilities. No private imports, mocks, empty runtime stubs or disabled
assertions are permitted. Missing-export failures are expected before runtime.

The [design review](../../../docs/grid-parcels/TOWNSCAPER-DESIGN-REVIEW.md) approves
the example-first checkpoint. `SHA256SUMS` pins the five scripts before runtime.
The separate [runtime review](../../../docs/grid-parcels/TOWNSCAPER-RUNTIME-REVIEW.md)
and [verification](../../../docs/grid-parcels/QUAD-LAYOUTS-VERIFICATION.md) record
the implemented scope and complete checks.
The slice does not deliver arbitrary-domain quad meshing, Lloyd, dual mapping,
seamless chunks, architecture solving or the remaining parcel catalogue.
