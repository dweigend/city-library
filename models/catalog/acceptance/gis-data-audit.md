# Pinned GIS companion data audit

Status: source acquisition and structural inspection, 6 November 2026. Scope is the 22 companion files for selected `gis-general-examples`; no runtime, target UI, frozen API, baseline approval, research or delivery-ledger update is included. Both source acquisition and versioning are user-authorized. Files are retained unchanged under [experiments/gis-general-examples/data](../../experiments/gis-general-examples/data/).

## Exact source and acquisition

The existing [pinned tree manifest](selected-host-capabilities-evidence/gis-pinned-asset-manifest.json) is the input, preserved unchanged. All **22 files / 1,449,413 bytes** were acquired from `NetLogo/Galapagos` revision **`90be931773fcf499049247a8aaa1aecbe003654c`**, path prefix `public/modelslib/Code Examples/Extensions Examples/gis/data/`. For every file, actual size and Git blob identity (`SHA1("blob " + decimalByteLength + NUL + bytes)`) equal the pinned values. Independent SHA-256 values, exact primary raw URL, repository-relative destination, revision/path, notice references and qualified rights findings are in the [complete file manifest](gis-data-audit-evidence/asset-manifest.json). These are source data, not installed dependencies.

The pinned Galapagos [LICENSE.txt](gis-data-audit-evidence/Galapagos-LICENSE.txt) was separately fetched and its size/blob hash verified against the same pinned tree; [license provenance](gis-data-audit-evidence/license-source.json). The model itself remains the archived served NetLogo 7.0.4 XML with SHA-256 `eb7880d4eff9dca3f1d82fb3122877fb439262e115720663de72f3f74528c1ea`; [source context and exact command parameters](gis-data-audit-evidence/source-context.json). No served/source substitution or data cleanup occurred.

Reproduce acquisition from repository root with `python3 docs/development/gis-data-audit-evidence/acquire.py`. It fetches only revision-pinned primary URLs, verifies asset bytes before writing, refuses to overwrite different existing asset bytes and requires the exact count/total. Existing source files, research reports and ledgers are not rewritten.

## Attribution and rights evidence

These are observations of the retained primary files; no blanket CC0 or other synthesized dataset license is assigned.

| Primary file | Evidence and qualified conclusion |
| --- | --- |
| [cities.txt](../../experiments/gis-general-examples/data/cities.txt) | Identifies ESRI Data & Maps 1, `wCities.shp`, ArcWorld and Rand McNally New International Atlas (1991). Describes 606 city points, decimal-degree WGS84, population estimates/censuses and -99 missing populations. Contains lineage and field descriptions, **no explicit data license or redistribution grant**. Preserve this attribution with the city compound dataset. |
| [rivers.txt](../../experiments/gis-general-examples/data/rivers.txt) | Identifies ESRI Data & Maps 1 and ArcWorld at 1:3M/1:25M, with names from Rand McNally, Times Atlas and Digital Chart of the World; water statistics from WRI World Resources 1992–93. Describes 98 rivers/routes and generalized display scales, not fine local hydrology. Contains no explicit dataset-specific license/redistribution grant. |
| [countries.xml](../../experiments/gis-general-examples/data/countries.xml), `metadata/idinfo/citation/citeinfo`, `accconst`, `useconst`, `metadata/eainfo` | Identifies ESRI World Countries 2004, publication 2004-03-01, political boundaries as of January 2004, multiple third-party sources. Access constraint says **“Access granted to Licensee only.”** Use constraints separately describe redistribution of static maps and Geodata, including without a Value-Added Software Application, conditioned on metadata and proper vendor source/copyright attribution. They retain ESRI/licensor proprietary-rights and warranty statements. The actual complete terms travel with the unchanged metadata. Do not simplify this into public domain, or infer that it settles unrelated city/river/raster rights. Scope/applicability of this historical license chain is not independently established by downloading the repository. |
| [Galapagos LICENSE.txt](gis-data-audit-evidence/Galapagos-LICENSE.txt), opening notice | Copyright 2012 Uri Wilensky; describes software distribution under GPL version 2 or later. This repository software notice is not treated as proof that each third-party dataset is GPL or CC0. |
| [GIS model XML](../research/netlogo-web/evidence/computing/gis-general-examples.nlogox), Code closing notice and Info | Code contains Wilensky's public-domain waiver for the **model**. Info describes GIS operations without dataset-specific attribution/license. That waiver does not establish rights held by third-party data suppliers. |
| Three projection choices and dataset PRJs; `world-elevation.asc`, `local-elevation.asc` | No file-specific origin/date/license statement appears in these raw parameter/numeric files. No elevation-source attribution or data license was established from the 22 files or General Examples Info. This remains explicitly unknown; CRS units do not establish vertical units or scientific accuracy. |

Primary URLs for the notice files are pinned individually in the manifest; no unpinned search result or secondary-license claim was used. No new literature research, independent legal clearance, provider review or publication authorization is implied. The source metadata is retained rather than discarded or overwritten with an invented license.

## Structural inspection and dataset facts

The one-off [inspection script](gis-data-audit-evidence/inspect-gis-data.py) uses Python standard-library `struct`, ElementTree and numeric checks. It is audit tooling only, not a reusable library parser or model runtime. [Full results](gis-data-audit-evidence/inspection.json) retain all DBF descriptors, numeric summaries, projection definitions and raster metadata. [Short machine-readable summary](gis-data-audit-evidence/inspection-summary.json).

SHP/SHX header interpretation follows the official [ESRI Shapefile Technical Description](https://www.esri.com/library/whitepapers/pdfs/shapefile.pdf). Each main/index file has code 9994, version 1000 and header-declared byte length equal to its actual size. All records end within the file, record numbers are sequential, all SHX offsets/content lengths match actual SHP records, and all coordinates examined are finite. Every compound dataset has equal SHP, SHX and header-declared DBF record counts. No source byte was repaired.

| Dataset | Shape type / records | Geometry examined | DBF header / record length / code-page byte |
| --- | --- | --- | --- |
| cities | 1: Point / 606 | 606 XY points | 161 / 51 bytes / 87 (`0x57`) |
| rivers | 3: PolyLine / 98 | 177 parts, 3965 XY vertices | 129 / 55 bytes / 1 (`0x01`) |
| countries | 5: Polygon / 250 | 1088 rings, 23938 XY vertices | 481 / 405 bytes / 87 (`0x57`) |

DBF fields (type, width, decimal places) are:

- Cities: `NAME C26`, `COUNTRY C13`, `POPULATION N9,0`, `CAPITAL C2`. Population range −99…23,620,000; 30 missing −99 values, 11 records strictly above 10,000,000. The source city action maps matching field names case-insensitively; future decoding must preserve numeric missing meaning and original identity/order.
- Rivers: `LENGTHCOMP N11,5`, `NAME C26`, `SYSTEM C17`. `rivers.txt` lists only the two descriptive string fields, while the actual table also includes `LENGTHCOMP`; range 161.59749…6246.75304, units not established here. Do not infer length from coordinate degrees or drop the extra field.
- Countries: `FIPS_CNTRY C2`, `GMI_CNTRY C3`, `ISO_2DIGIT C2`, `ISO_3DIGIT C3`, `CNTRY_NAME C254`, `LONG_NAME C40`, `SOVEREIGN C40`, `POP_CNTRY N10,0`, `CURR_TYPE C16`, `CURR_CODE C4`, `LANDLOCKED C1`, `SQKM N14,2`, `SQMI N14,2`, `COLOR_MAP C1`. `POP_CNTRY` range −99999…1,302,862,775; metadata defines **1994 estimated population**, with −99999 meaning unavailable (16 records). The exact `CNTRY_NAME=United States` lookup has one record, population 258,833,000. These historical fields do not represent current populations/borders.

All three tables report zero deleted records. **Rivers DBF has 46,453 trailing bytes after its header-declared records**, starting with the EOF marker `0x1a` and containing additional nonzero bytes/data; cities and countries each have only one trailing `0x1a`. The audit records trailer length, first 64 bytes and SHA-256. Those bytes remain intact in the pinned asset. Additional trailer content was not interpreted as declared live records or labeled corruption. A production parser needs an explicit trailing-data policy that accepts or reports this concrete file without silently inventing extra features.

Character audit used a lossless Latin-1 byte display solely for inspection, **not an approved text-decoding contract**. No `.cpg` is in the pinned 22-file set. All declared record payload bytes in these three files are ASCII (no byte above127), so the present names require no non-ASCII conversion. DBF code-page bytes differ; a later general parser must document code-page semantics and unsupported encodings rather than silently assume UTF-8 or Latin-1.

SHP header BBoxes use `[minX,minY,maxX,maxY]` (not the binding library Bounds order). Cities: `[-165.27000427246094,-53.150001525878906,177.13018798828125,78.19999694824219]`; countries: `[-180,-90,180,83.60415649414062]`; both match computed vertex envelopes exactly. Rivers header ends at `[161.06581115722656,72.23417663574219]`, but actual vertex maxima are `[161.06582641601562,72.23418426513672]`; source header underestimates by approximately `0.0000152587890625°` and `0.00000762939453125°`. SHX and SHP agree with each other. This discrepancy needs a recorded bounds-validation/derivation decision, not an undocumented numeric change.

All 1088 country rings are closed, no adjacent identical vertices detected; signed areas give 1078 clockwise and 10 counterclockwise rings. This is not a proof of valid simple polygons or hole association: self-intersections, shell/hole containment, antimeridian behavior, cross-ring touching and geographic validity were not checked. A Polygon shape record can have multiple parts; no one-ring-per-country assumption is valid.

## Coordinate definitions and rasters

All dataset vector PRJs declare `GCS_WGS_1984`, WGS1984 spheroid semi-major axis 6378137 and inverse flattening 298.257223563, Greenwich prime meridian 0, angular Degree conversion factor 0.017453292519943295. Default chooser file `WGS_84_Geographic.prj` uses the same datum/spheroid/units with a different geographic name. No `AUTHORITY` identifier is present. The audit does not invent an EPSG identifier from name matching; the model's WMS action independently supplies `EPSG:4326` explicitly.

| Setup chooser | Exact PRJ projection parameters |
| --- | --- |
| `WGS_84_Geographic` (default) | Geographic, degrees; no projected method. |
| `US_Orthographic` | Orthographic; longitude of center −98°, latitude of center 36°; false easting/northing 0; projected Meter factor 1; underlying WGS1984 geography as above. |
| `Lambert_Conformal_Conic` | `Lambert_Conformal_Conic_2SP`; central meridian −90°, standard parallels **60° and 60°**, latitude of origin 0°; false easting/northing 0; projected Meter factor 1. Do not replace the equal parallels with a more familiar Lambert configuration. |

Both raster PRJs repeat WGS_84_Geographic. Raster headers use lower-left **corner** coordinates; ESRI's [ASCII raster specification](https://desktop.arcgis.com/en/arcmap/latest/manage-data/raster-and-images/esri-ascii-raster-format.htm) establishes row-major ordering from the top/north. Full checked headers and cell-center/outer extents are in inspection.json.

| Raster | Columns×rows / parsed values | Lower-left corner / cell size | NoData sentinel / occurrence count | Valid value range / outer extent |
| --- | --- | --- | --- | --- |
| `world-elevation.asc` | 360×180 / 64800 exactly | (−180,−90) / 1 degree | −9999 / 0 | −7473…5731; [−180,−90,180,90] |
| `local-elevation.asc` | 195×195 / 38025 exactly | (−84.355652,39.177963) / .000093 degree | −9999 / 0 | 212.7…265; [−84.355652,39.177963,−84.337517,39.196098] |

All stored raster numbers are finite; neither file contains its NoData sentinel. This does not prove that interpolation, clipping, reprojection or convolution cannot generate missing values. Vertical units and elevation provenance are not supplied by these headers. The General Examples setup loads **only world-elevation**; local-elevation is acquired because it is part of the pinned 22-file directory, not silently substituted into this selected model. Before reprojection the world raster determines the union envelope [−180,−90,180,90]. Projected-envelope outcomes were not calculated or compared with original runtime.

## Model source and public-contract implications

[The earlier model audit](selected-host-capabilities.md) owns complete procedure/widget semantics and actual original-browser failures. This data audit did not reopen a browser or execute a target. Unchanged original setup fails at `gis:load-coordinate-system`, before dataset reads; downloaded companions do not establish that the original Web file path now works.

Source setup loads `data/<projection>.prj`, then city/river/country SHP and world ASC, unions four envelopes and resets ticks. Default world is 145×73 wrapped patches. City creation replaces city turtles and maps `NAME/COUNTRY/POPULATION`; citizen creation appends 50 persons per country by default, requiring polygon interior sampling and `CNTRY_NAME` mapping. Country labels require centroids; rivers-to-patches and US-river selection require intersection; `POP_CNTRY` requires polygon coverage. Source Sobel uses two explicit 3×3 kernels `[1,0,-1,2,0,-2,1,0,-1]` and `[1,2,1,0,0,0,-1,-2,-1]`, anchor (1,1), then sqrt(gx²+gy²). `match-cells-to-patches` uses raster-world-envelope at offsets (0,0) and clears drawing/all turtles. Sampling, coverage thresholds and raster edge handling remain unexecuted extension semantics, not inferred from stored cells.

| Boundary | Existing binding / delivered status | Required source-backed decision |
| --- | --- | --- |
| Planar data | [PlanarGeometry/Feature/Dataset and geometry.contains/bounds/map](../agent-loom/api-reference.md#pure-spatial-contracts) are specified. Geometry runtime currently exports direction/normalize/distance, not those GIS operations. | Implement existing accepted signatures through example-first slices. Convert SHP multipart records into explicit valid planar shell/hole structure without throwing away parts. Record exact source bounds versus recomputed bounds and library Bounds order `[minX,maxX,minY,maxY]`. |
| Data codecs | [Explicit GeoJSON storage codec](../agent-loom/api-reference.md#complete-external-codecs) is already specified, requires `{crs,units}`, and does not reproject. No storage runtime entry is currently exported. | A SHP+SHX+DBF/PRJ compound decoder and ASCII grid decoder are not defined by GeoJSON support. Resolve character code page, DBF trailers, sentinel values, multipart/hole mapping and bounded validation as explicit new contracts before implementation. |
| CRS | Binding planar labels and affine geometry.map do not implement geographic projection. | Explicit supplied-data projection/PRJ contract for geographic, Orthographic and exact Lambert settings, with hemisphere/domain clipping, inverse/forward semantics, datum/axis order and transformed envelopes; no implicit CRS guessing. |
| Spatial effects | Existing Agent/Grid/Field can own transformed model values through public operations. | No delivered centroid, line/polygon intersection, polygon coverage or random interior-point API. Define missing operations and missing/overlap/boundary policies. Do not hide reusable GIS rules in UI or duplicate experiment logic. |
| Raster/Sobel | No public raster sampling/convolution runtime or binding raster type was found. | Separate explicit raster state/no-data/resampling/convolution contracts; preserve north-first data order and distinct direct/sample paths. The real rasters contain no sentinel cells, so synthetic missing/edge fixtures are still needed. |
| Host/drawing/WMS | DESIGN keeps I/O/rendering outside headless domain logic; generic imports must not perform file/network access. | Host reads supplied bytes and exposes upload/fetch errors, renderer owns drawing layer; model/algorithms own data and field/agent effects. WMS service/CRS/layer and failure behavior need independent browser evidence, not an invented core fetch API. |

The material is sufficient to design concrete tasks; it does not approve new signatures. Suggested **phases**, each requiring four or five asserted public scripts before runtime handoff:

1. Existing planar/GeoJSON contracts: small synthetic closed shell/hole fixtures, exact bbox-order mapping, point boundary include/exclude, property preservation and nonfinite/invalid topology rejection. No claim that arbitrary country geometry already satisfies the strict planar polygon validator.
2. Compound vector/CRS extension: real 606/98/250 cardinalities and alignment; DBF extra field/sentinel/encoding/trailer fixture; multipart country and US selection; default mapping versus the two exact projected configurations; malformed SHX/DBF or outside-projection failure. New decoder/projection API choices remain open.
3. Model GIS operations: city replacement and attributes, repeated citizen creation with explicit RNG, centroid label toggles and bounds, rivers-to-patch intersections and US whole-feature drawing, population coverage/missing/overlap rules. Source data and original-runtime comparisons must decide behavior where the binding reference is silent.
4. Raster and host: exact 360×180 and local raster row orientation; distinct direct/sample patch results; known Sobel cell and boundary/no-data cases; cell-aligned envelope with drawing/turtle clearing; deterministic WMS response/error fixture and later actual service browser check. Synthetic edge/no-data cases supplement these real inputs, not replace the selected dataset/model.

These scenario descriptions are not executable examples or a frozen public API. The coordinator owns sequencing, accepted authoring syntax, independent review gates and runtime delegation. Existing Giant Component/connectivity review restrictions remain untouched. No new review request was made.

## Executed validation and explicit limits

Executed shell commands from repository root:

- `python3 docs/development/gis-data-audit-evidence/acquire.py` — 22 exact assets and pinned LICENSE acquired; all expected sizes and Git blob hashes passed; 1,449,413 source-data bytes.
- `python3 docs/development/gis-data-audit-evidence/inspect-gis-data.py > docs/development/gis-data-audit-evidence/inspection-summary.json` — SHP/SHX/header/record and DBF schema/cardinality assertions; PRJ inspection; ASC value counts/finite values/extents passed. River bbox mismatch and DBF trailer explicitly retained as findings rather than silently repaired.
- JSON/local-link/source-count/hash verification, then `sha256sum -c docs/development/gis-data-audit-evidence/SHA256SUMS` — see [validation record](gis-data-audit-evidence/validation.json).

No TypeScript changed; no build/typecheck/unit-test success is claimed. This is not target runtime, browser verification, baseline comparison, scientific validation or independent approval. No data was reprojection-tested, geometry-topology validated, scientifically ground-truthed or used to deliver a working GIS model. Rights/encoding/trailing-data/projection/coverage/raster-edge decisions remain explicit above. All selected complex host cases remain in scope, and no accepted-model count changed.
