# Independent full API documentation review

Date: 7 November 2026. Reviewer: independent native Codex agent; not an author of the expansion. Scope: api-reference.md, api-table.md, COVERAGE.md and CONTRACT.md in the parcel-proposal package; original 49-row catalogue and City Library grid revision 2a7f3eb used as comparison. Read-only review; no runtime/build/browser tests or scientific reproduction performed.

## Verdict

The documentation covers the complete catalogue and preserves the inspected delivered API semantics. Ready as a proposed reference after one small shared-type/documentation completeness correction. This is not runtime or public-example acceptance.

## Finding: unintroduced existing data and simulation types

Priority P2, correction before presenting the reference as self-contained. At `#shared-types`, the public type import lists PlanarXY, PlanarPolygon, PlanarGeometry, ParcelShape, Position, Vector, Layout and BoundarySegment only. Later signatures use `PlanarDataset` and `PlanarFeature` (`#geometry-bounds`) and `Space` (`#grid-add-space`) without a local definition or reference. The bounds example explicitly annotates `PlanarFeature[]` but does not import that name. Grid sections also use Agent, Field, LayoutGrid and LayoutField type names without showing their type imports; Grid's regular instance notation is already correctly explained as descriptive.

Smallest correction: add the already-delivered public names to the shared type-import example; provide a concise existing-data/simulation-types section defining or linking PlanarFeature/PlanarDataset/Space (including normalized Space versus input distinction where needed). Add an explicit `PlanarFeature` import in the bounds example if examples are intended to be copied independently. Do not export a new Grid instance type or change target APIs to make documentation compile. These are documentation additions, not a design change.

## Optional consistency note

COVERAGE labels Trihex merely Proposed, while detailed reference and table identify the motif/boundary procedure as Research. Because the coverage column includes readiness as well as availability, changing that cell to Research / proposed would remove a minor cross-document mismatch. No capability or implementation claim currently depends on this label.

## Checks and findings without requested changes

- Final compact inventory has 56 operation/property signature sections. Its function/property signatures match detailed-reference sections; two first fences additionally contain reference-only MergeResult/SplitResult declarations, which are not semantic signature discrepancies.
- All 49 original operation rows have inventory and detailed-reference links in COVERAGE.md. Additional overloads, three subdivision variants, Field ownership and result/type entries are separately documented.
- Local Markdown target files and fragments resolve, accounting for explicit HTML anchors and standard heading-generated anchors. Final table/reference explicit IDs are unique. Earlier transient duplicates observed during table generation were corrected by the author and are not findings against the final document.
- Inspected actual public index/types, topology construction and queries, planar contains/bounds/parcel-input/split, Grid/Field/LayoutGrid sources. Closed GeoJSON polygon data, bounds tuple order, contains positional form, regular and layout Grid overloads, local keys, boundary ties and state/ownership separation agree with inspected source.
- The examples checked analytically have correct area/frontage values. The road example removes area 16 from area 96 and preserves land area 80; OBB examples account for successful or remaining pieces. This is analytical review, not execution of proposed scripts.
- Measurements keep plain results/exception conventions; shape procedures use operation-specific outcomes. Proposed measurements use a clearly identified pre-freeze RangeError convention. Validation's three-state validity avoids declaring budget exhaustion invalid.
- Regular diffusion remains unavailable on LayoutGrid. Regular neighbor deduplication is distinguished from directional diffusion multiplicity. Partial-edge/T-junction import limits are explicit, including inside a single recursively subdivided block.
- Skeleton and co-generation remain scientifically distinct, with unresolved event/strip/backend/identity questions visible. No always-unsupported placeholder export, ML dependency or guaranteed legal/network access is implied.
- No revision to frozen implementation scripts or actual runtime contracts is requested by this review.

Coordinator should record its correction separately; these findings are not independent re-approval of future edits.
