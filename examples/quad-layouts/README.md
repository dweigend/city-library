# Finite quadrilateral topology examples

Five asserted public scripts cover finite quad generation, relaxation, validation, continuation and explicit Grid composition. Run `bun run examples:quad-layouts` to execute this capability gate.

| Script | Author task and independent acceptance |
| --- | --- |
| `01-finite-hex-refinement.ts` | Make finite hex patches in local units; seed 7 yields 14/122 quads at radius 1/3, analytic hex area, complete 3/4 subdivision oracles, shared-edge conformity and exact scaling. |
| `02-square-target-first-step.ts` | Relax four conforming quads; independent summed-force first step `(1.25,.75)` to `(1.1875,.8125)`, fixed boundary, winding/start invariance and a rotated-square fixed point with a movable interior vertex. |
| `03-validation-and-failure.ts` | Safely relax a distorted patch by bounded halving; reject exhausted candidates, unsupported faces, invalid/mixed input and importer nonconformity without mutation or malformed-input RNG draws. |
| `04-continuation-and-revisions.ts` | Replay an explicit RNG continuation, distinguish an advanced stream, verify 71 draws for radius 3, and obtain fresh immutable zero/positive revisions with preserved key/incidence correspondence and old snapshots. |
| `05-explicit-grid-state-copy.ts` | Build two detached Grids and explicitly copy selected population values between corresponding cells; verify distinct Grid/Field identities and independent state. |

The [capability contract](../../docs/grid-parcels/QUAD-LAYOUTS-CONTRACT.md) fixes
numerical bounds, exact enumeration/draw order, square-target forces, global
halving and all failure/ownership semantics. `tests/quad-layouts-types.ts`
rejects mixed literal and named-variable options and regular-only LayoutGrid
capabilities. No private imports, mocks, empty runtime stubs or disabled
assertions are permitted. Missing-export failures are expected before runtime.

The [design review](../../docs/grid-parcels/TOWNSCAPER-DESIGN-REVIEW.md) approves
the example-first checkpoint. `SHA256SUMS` records the original scripts; the [naming receipt](../../scripts/naming-integrity-receipt.json) maps original and current paths and hashes.
The separate [runtime review](../../docs/grid-parcels/TOWNSCAPER-RUNTIME-REVIEW.md)
and [verification](../../docs/grid-parcels/QUAD-LAYOUTS-VERIFICATION.md) record
the implemented scope and complete checks.
The slice does not deliver arbitrary-domain quad meshing, Lloyd, dual mapping,
seamless chunks, architecture solving or the remaining parcel catalogue.
