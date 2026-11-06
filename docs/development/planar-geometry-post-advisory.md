# Planar contains/bounds: updated five-script proposal after advisory

Status, 2026-11-06: **unfrozen proposal only**. These five scripts have never been frozen. This revision is reviewable input for the coordinator, not a contract decision, runtime authorization, implementation, successful public-example execution, model acceptance or independent approval. Root retains decisions U1–U10 and must resolve the relevant choices and fingerprint an accepted revision before runtime work. No new delegation or implementation thread was started.

This update reads the [original proposal](planar-geometry-contract-proposal.md), [completed Astra advice](planar-geometry-advisory.json), [advisory status](planar-geometry-advisory-status.md), [binding pure spatial definitions](../agent-loom/api-reference.md#pure-spatial-contracts), [resource-budget scope](../agent-loom/api-reference.md#readable-resource-budgets), and [completed exact country audit](gis-country-topology-audit.md). The original proposal/status/advice remain historical and unchanged; this document supersedes their stale preparation/source-compatibility statements only for the new proposal revision.

## Bounded missing capability and already delivered map

The missing capability is `geometry.contains`, `geometry.bounds`, and their six already specified public Planar types. The names/signatures remain:

```ts
type PlanarXY = readonly [number, number];
type PlanarPolygon = { readonly type: "Polygon"; readonly coordinates: readonly (readonly PlanarXY[])[] };
type PlanarGeometry =
  | { readonly type: "Point"; readonly coordinates: PlanarXY }
  | { readonly type: "MultiPoint" | "LineString"; readonly coordinates: readonly PlanarXY[] }
  | { readonly type: "MultiLineString"; readonly coordinates: readonly (readonly PlanarXY[])[] }
  | PlanarPolygon
  | { readonly type: "MultiPolygon"; readonly coordinates: readonly (readonly (readonly PlanarXY[])[])[] }
  | { readonly type: "GeometryCollection"; readonly geometries: readonly PlanarGeometry[] };
type PlanarJson = null | boolean | number | string | readonly PlanarJson[] | { readonly [key: string]: PlanarJson };
interface PlanarFeature {
  readonly type: "Feature"; readonly id?: string | number;
  readonly geometry: PlanarGeometry | null;
  readonly properties: Readonly<Record<string, PlanarJson>> | null;
}
interface PlanarDataset {
  readonly features: readonly PlanarFeature[];
  readonly coordinateSystem: { readonly crs: string; readonly units: string };
}
geometry.contains(polygon: PlanarPolygon, point: { x: number; y: number }, options?: { boundary?: "include" | "exclude" }): boolean
geometry.bounds(features: PlanarDataset | readonly PlanarFeature[]): Bounds | undefined
```

`Bounds` is the already delivered `[minX,maxX,minY,maxY]` type. **`geometry.map` is already delivered**, with five separately accepted [affine-map examples](../../examples/affine-map/01-uniform-centered.ts). Their existing SHA256SUMS check passed unchanged. This revision uses map only as a downstream consumer of computed bounds or a canonical Agent position; it does not refreeze, redefine, reimplement or extend map. The earlier original-proposal statement that map was missing is obsolete.

Binding behavior remains finite strict XY, shell first and explicit holes, closed rings with noncollinear vertices/no zero edges or invalid self-contacts, holes strictly internal and disjoint, winding-independent topology, and invalid polygons rejected before either contains or bounds returns. Boundary choices apply to both shell and holes; all positive boundary examples specify the option. Bounds visits every non-null geometry, permits degenerate results and returns undefined without positions. Geometry is observational, detached, framework-independent and allocates no live Agent/World/Grid or RNG/tick effects. Existing canonical Agent/Field positions must not be accidentally excluded by a new plain-record-only query rule.

No parser/codec, source file loader, storage method, CRS projection, geographic normalization, polygon repair/boolean operation, centroid, sampling API, new caller cap or private GIS engine is proposed. Examples import `geometry`/Planar types from `city-library`; there is no substitute API, stub or local runtime implementation. The evidence tooling below is offline fixture preparation, not library runtime.

## Exactly five complete proposed public scripts

| Script | Reviewable asserted behavior |
| --- | --- |
| [01-shell-hole-and-topology.ts](../../examples/planar-geometry-proposal/01-shell-hole-and-topology.ts) | Interior/exterior, shell/hole horizontal edges and vertices, explicit include/exclude, reversed winding; rejects bow-tie, touching/crossing/nested/exterior holes, unclosed/collinear/zero-edge rings, adjacent and closure-adjacent backtracking. Includes the U-shaped concave shell/hole bridge: every hole vertex is internal but its edges cross the notch. Rejects even for an outside query. Forward collinear subdivision remains valid. |
| [02-feature-collection-bounds.ts](../../examples/planar-geometry-proposal/02-feature-collection-bounds.ts) | All seven geometry families, nested collections, arrays/dataset, exact combined bounds `[-20,16,-12,20]`, empty multis/collections/nulls, degenerate point bounds, ordinary coordinate-looking property data, malformed XY/short lines/nonfinite coordinates, detached results under caller edits. No inferred geometric adapter caps on bounds. |
| [03-mapping-and-gis-extents.ts](../../examples/planar-geometry-proposal/03-mapping-and-gis-extents.ts) | Actual 1282-position Russia Polygon member; actual West Bank shell7+hole4 with exact strict-interior and hole-interior witnesses; Canada's full3316 source positions grouped into126 Polygon members, largest932. Bounds on actual source members/MultiPolygon; boundary and interior contains checks. Header-derived raster envelope and actual Murmansk coordinates feed existing map only; labels remain caller data. |
| [04-shape-data-and-purity.ts](../../examples/planar-geometry-proposal/04-shape-data-and-purity.ts) | Number.MIN_VALUE square and representable strict interior; cancellation triangle with exact determinant `2^-104` despite float product difference0; tiny square ending at `(1e9,1e9)` with side `2^-20`; mutation changes valid bounds/membership then makes the same polygon invalid and valid again. Detached result writes cannot mutate the source. Canonical Agent/Field queries, existing-map consumer, unchanged model RNG/tick/state and explicit XY/error-shape checks. |
| [05-proposed-resource-boundaries.ts](../../examples/planar-geometry-proposal/05-proposed-resource-boundaries.ts) | **Candidate U3/U4 only:** exact integer forward-subdivided rings at2048/2049 positions, shell+hole totals2048/2049 including closures, containment coordinateMagnitude endpoint/overage and recovery after failure. The file states that Root must accept that counting policy first. No features/total-positions/property-count/depth/magnitude assertions extend those budgets to bounds or map. |

All five contain real imports, inputs, assertions and observable final output. They are not conditionally skipped when methods are absent. They are complete **proposed** examples, not five passing scripts. Existing filenames are retained so the historical proposal links still resolve. Script05 remains explicitly conditional on the coordinator's contract choice; it is not disguised as already binding accounting.

The original strict descriptor/property-budget assertions that applied all adapter rules to every bounds input were removed. This does not weaken an accepted example: none of these five was frozen. It makes the open decisions visible instead of treating an unaccepted policy as an existing contract. Shapes/options with clear binding errors are still asserted; topology/nonfinite error constructors not fully specified by the binding remain generic `assert.throws` checks.

## Numerical advisory: behavior witnesses, not an algorithm freeze

Completed `gpt-6-astra`/high advice supports exact predicates on original binary64 coordinates, with a conservative float interval filter and exact dyadic BigInt fallback; robust segment contacts and adjacent overlap handling; complete polygon validation before query classification; boundary-first half-open ray crossing without division; and mutation-safe revalidation. It cautions against decoding rounded differences, epsilon tolerances and floating shoelace-only validity. No particular private helper, filter formula or BigInt representation is prescribed by these public examples.

The retained [numeric-fixture check](planar-geometry-post-advisory-evidence/numeric-fixtures.json) uses exact rational values and the already audited offline predicates solely to check the fixture expectations. It confirms the subnormal interior, exact cancellation determinant `1/20282409603651670423947251286016`, large-offset interior, adjacent overlap and **six** proper crossings of the U-hole despite all vertices being inside. This is arithmetic/source-fixture evidence, not execution of City Library contains/bounds. The large-offset example stays within1e9; it does not claim impossible cross-product overflow inside that magnitude profile.

Astra was deep logical advice, **not** independent Antigravity review, approval, executable proof or authorization to start runtime. Required Argon approval is still separate/pending.

## Source-data reconciliation

The completed exact country audit supersedes the old uncertainty about final Polygon sizes. It grouped1088 rings from250 records into **1078 Polygon members**, with10 holes; all23938 closing-inclusive positions are conserved. Maximum shell+assigned-hole Polygon count is **1282**, and zero members exceed2048. Canada record39 has3316 positions split across126 members, maximum932. Russia record184 has2167 across83 members, maximum1282. A SHP record is not one Polygon, and a ring-only maximum was insufficient evidence before the completed grouping. No cap was raised, source simplified or geometry repaired.

The corrected fact does not prove a globally overlap-free country partition:14 cross-record positive-area overlap pairs are witnessed and302 contact pairs remain unresolved for interior overlap. The proposal does not add a cross-feature/MultiPolygon global overlap prohibition based on that data. All topology interpretations remain straight-segment planar XY, not antimeridian/geodesic assumptions.

New [post-advisory-source-fixtures.json](../../examples/planar-geometry-proposal/post-advisory-source-fixtures.json) contains the original binary64 coordinates for the largest Russia Polygon, the West Bank Polygon with a hole, and all Canada's grouped Polygon members. It also carries corrected audit counts, source/grouping hashes, exact source-part IDs and checked query witnesses. The bounded offline [extractor](planar-geometry-post-advisory-evidence/extract-fixtures.py) uses **the already completed grouping**, reads only retained local SHP bytes, and reuses the retained exact audit PIP for witness expectations. It does not repeat online GIS research or deliver a parser/kernel. [Source-fixture validation](planar-geometry-post-advisory-evidence/source-fixture-validation.json) passed. JSON fixture casts in script03 provide the binding structural tuple types for verified data; they are not an unchecked production decoder.

The old `source-fixtures.json` remains byte-for-byte unchanged because the completed country audit fingerprints it as historical input. Its old “grouping not performed” sentence is archival; this new fixture/document carries the corrected facts. The actual countries SHP still hashes `eb10297087c926150c13f5547abef10c7692e89ebae1c5d73d69a2d2769a7f89`, pinned Galapagos `90be931773fcf499049247a8aaa1aecbe003654c`.

The [source-data audit](gis-data-audit.md) still records native GIS Setup failing at `gis:load-coordinate-system` before dataset reads. No new source/native browser session was run here. Successful source GIS baseline, target GIS behavior, projection/compound-data contracts, data-rights qualifications and broader GIS acceptance remain pending; country topology and generic affine mapping do not close them.

## Root-owned decisions U1–U10

These questions are retained, with candidate choices stated explicitly. **No row is resolved by this document, the five scripts, the audit or Astra.** Root must record its chosen semantics and adjust the unfrozen scripts where necessary before freeze.

| ID | Decision and bounded candidates | Current proposal treatment |
| --- | --- | --- |
| U1 | Bounds validation/budget scope: (A) retain binding geometry validity plus its stated plain PlanarJson property requirements, without inferring all geometric GeoJSON adapter counters; or (B) explicitly extend named geometric counters to bounds through an accepted contract change. GeoJSON parsing/writing/containment scope is not automatically bounds/map scope. | No blanket bounds feature/position/Polygon/magnitude cap assertions. Property requirements are not abolished; complete null/empty-dataset metadata/property validation scope still needs a decision. |
| U2 | Own-data descriptors, symbols, custom/null prototypes and rejection timing: adopt a documented policy for geometry/data/options while preserving canonical Agent/Field query positions, or document a narrower boundary. Proxies cannot be universally detected. | Removed getter/custom-class/symbol/null-prototype policy assertions; canonical positions remain positive witnesses. No new descriptor API. |
| U3 | Count XY occurrences or distinct identities; include closures; aggregate total positions by operation; count contains query separately or with the polygon? Candidate counts polygon tuple occurrences including closures and validates the query separately. |05 illustrates that candidate; Root must choose before freeze. No bounds aggregate100000-position assertion. |
| U4 | polygonPositions aggregation: shell+all holes per Polygon, each MultiPolygon member separately, or another explicitly recorded interpretation. |05 proposes shell+holes including closures. Exact source audit uses that comparison and fits1282, but does not settle API counting. Source03 never equates a record with a Polygon. |
| U5 | Property depth/root/nodes/key/scalar counting, per-feature versus per-call aggregation, and acyclic alias occurrences need explicit arithmetic. Cycles are not finite JSON trees; repeated acyclic identity is not itself a cycle. | No invented32/33-container or100000/100001-node bounds fixtures. Candidates from the earlier draft remain questions, not active assertions. |
| U6 | GeometryCollection traversal/cycles and structural exhaustion: iterative/cycle-safe traversal is possible; a separate depth/node ceiling would be new public rejection semantics. | Existing modest nested/empty examples only. No borrowed propertyDepth or new collection cap. |
| U7 | Foreign members: ignore, preserve or reject, and whether their values are validated/counted. “Not interpreted as coordinates” alone does not choose among these. Inter-member/global overlap policy also needs explicit scope. | Known `properties.coordinates` remains ordinary data. No unaccepted foreign-member or cross-record overlap rejection assertions. |
| U8 | Omitted contains boundary default: choose include/exclude explicitly in the contract. | Every positive contains example supplies include/exclude. No default is invented. |
| U9 | Numerical predicate guarantees, topology/nonfinite error classes and validation precedence. Exact original-coordinate behavior is supported by the advice; its algorithm and error details need review. | Robust positive/negative fixtures now included; invalid polygons reject even for outside queries. Generic throws where error type is unsettled. No epsilon/rounding/area shortcut is introduced. |
| U10 | coordinateMagnitude=1e9 applies to the named containment profile; extending it to bounds or generic affine map needs a separate explicit decision. Representability/domain-error precedence also needs review. |05 checks containment polygon endpoint/overage only. No new bounds/map magnitude cap; map retains its accepted finite/positive-envelope contract. |

All existing constants remain exactly textBytes8388608, features10000, positions100000, polygonPositions2048, coordinateMagnitude1000000000, propertyDepth32 and propertyNodes100000. This scope contains no text codec, so no serialized text-budget API/assertion is added. No lower/higher caller-cap option is invented.

## Executed checks and handoff

- `bun run typecheck` passed for the existing configured project: [log](planar-geometry-post-advisory-evidence/project-typecheck.log). The proposal directory is not added to root configuration and is not covered by that pass.
- Bun.Transpiler parsed all exactly five proposal `.ts` files: [parse results](planar-geometry-post-advisory-evidence/parse.json). No proposal runtime assertion was executed.
- A temporary scoped TypeScript configuration, extending current source configuration, typechecked the proposals against the **current** root API. The exact [configuration used](planar-geometry-post-advisory-evidence/typecheck-config-used.txt) is retained as text; the temporary active config was removed and root configs were unchanged. It failed as expected:14 TS2305 diagnostics for the six missing Planar exports and65 TS2339 diagnostics,39 missing contains and26 missing bounds. There are **zero missing-map diagnostics and no other diagnostic codes**: [summary](planar-geometry-post-advisory-evidence/diagnostics-summary.json), [full log](planar-geometry-post-advisory-evidence/proposal-current-types.log). This is not a passing proposal typecheck or a temporary stub/declaration implementation.
- Exact numeric fixtures, source hashes/grouping/witness extraction and unchanged accepted affine-map SHA hashes were checked offline. All source/audit/original-fixture files were read only; evidence checks did not rewrite the completed topology audit's validation file.

The first scoped check exposed two local inference errors where an untyped missing bounds return was narrowed to `number[]`; adding its existing `Bounds | undefined` annotation corrected those proposal errors. Final diagnostics contain only the intentionally missing public capability. No errors were suppressed with ts-ignore or a replacement API.

Next action belongs to Root: review these five complete scripts and corrected source facts, decide U1–U10, record the accepted revision/fingerprints, then authorize and scope runtime work. This task writes only this document, the unfrozen proposal directory and its own evidence directory. No binding/original-proposal/map-example/export/config/Git/ledger/research/runtime file was changed, and no new browser or independent-review result is claimed.
