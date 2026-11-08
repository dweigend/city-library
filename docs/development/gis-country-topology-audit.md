# Pinned country rings: exact offline topology and Polygon budget audit

The actual country data fit the existing **2048-position per-Polygon comparison** after shell/hole grouping: the maximum resulting Polygon has **1282 positions including all closing vertices**. No simplification, raised limit, projection, source repair or runtime implementation was used. This closes the numerical source-data question left in [the archival data audit](gis-data-audit.md) and [the planar advisory status](planar-geometry-advisory-status.md); it does not resolve the broader unfrozen planar API proposal or establish GIS model acceptance.

## Inputs and reproducibility

Only existing local files were read. Both compound-data inputs match the previously pinned asset manifest in byte count, SHA-256 and Git blob SHA-1 at Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`.

| Input | Bytes | SHA-256 | Git blob SHA-1 |
| --- | ---: | --- | --- |
| `experiments/gis-general-examples/data/countries.shp` | 400460 | `eb10297087c926150c13f5547abef10c7692e89ebae1c5d73d69a2d2769a7f89` | `ba2311503ad153b6fab2f7baeca0db28c4626cdb` |
| `experiments/gis-general-examples/data/countries.dbf` | 101732 | `87bc912fe6433f761de79c0ad6f6c3449331db3f9e4ef713ffc46b1550274092` | `9c10a4cdfe224fd75f6845ff86d8566d7e8c89a8` |

The unchanged [proposal source fixtures](../../examples/planar-geometry-proposal/source-fixtures.json) supply the earlier record/ring budget context; its own SHA-256 is recorded in [audit.json](gis-country-topology-evidence/audit.json). DBF names identify the historical records; they are not current geographic or political assertions. Rights and notices remain the separate qualified findings in the archival audit.

Run from the repository root:

```sh
python3 docs/development/gis-country-topology-evidence/audit.py
python3 docs/development/gis-country-topology-evidence/verify.py
sha256sum -c docs/development/gis-country-topology-evidence/SHA256SUMS
```

The [audit script](gis-country-topology-evidence/audit.py) is offline evidence tooling, not a production decoder, reusable geometry library or model helper. Its four JSON outputs are deterministic; wall-clock timing is printed separately. [Validation results](gis-country-topology-evidence/validation.json) record executed checks.

## Exact predicates and executed coverage

All original finite binary64 coordinates were decoded using Python `float.as_integer_ratio()` before arithmetic. A common denominator of **2^61 = 2305843009213693952** embeds every source coordinate exactly into integer XY numerators. No rounded coordinate differences, epsilon, snap or geographic normalization enters orientation, segment contact or point-in-ring classification. Integer determinants and boundary-first half-open horizontal ray crossing are exact. Rational edge midpoints used for cross-record witness searches are also exact. Large integer numerators in the evidence are decimal strings to preserve their precision for JSON consumers.

Small asserted fixtures independently exercise interior/exterior/boundary and reversed-winding classification; proper crossings; endpoint touches; collinear overlap; adjacent-edge backtracking; nonintersecting segments with overlapping boxes; a determinant of −1 whose floating-product subtraction is zero; nested shell/hole/island and a disjoint shell. A concave-shell fixture has every candidate-hole vertex inside, yet **six proper edge crossings**. It explicitly demonstrates why a vertex-only hole test cannot establish containment. Fixture assertions pass before source inspection.

Every unordered pair of the **22850 nonzero source segments** was covered by an inclusive-X sweep and bounding-box pruning. There are **950389 X-overlap candidate pairs** and **39030 full-BBox-overlap pairs** evaluated with exact segment predicates; disjoint BBoxes exclude the rest without a topology assumption. Adjacent edges are exempted only for their expected single-point touch, including the first/last edge pair. Adjacent collinear backtracking/overlap would be reported, and nonadjacent endpoint touches are not exempted.

| Segment relationship | Executed result |
| --- | ---: |
| Expected adjacent touches within rings | 22850 |
| Nonadjacent self-contact, self-crossing or adjacent overlap | 0 |
| Contacts between different rings of the same SHP record | 0 |
| Cross-record proper segment crossings | 272 |
| Cross-record positive-length collinear segment overlaps | 2973 |
| Cross-record point touches | 7242 |

[contacts.json](gis-country-topology-evidence/contacts.json) aggregates every reported contact by ring pair and kind, with a first segment-index witness for each kind. These are segment-pair counts, not distinct geometric intersection-point counts. Shared endpoints can contribute several touches. Ring IDs and part/edge indices are zero-based; SHP record numbers are one-based.

All rings are closed, have nonzero exact signed area and no zero-length segment. Complete segment testing establishes simple individual rings and disjoint boundaries within each record. Only **after** those checks, exact PIP classification establishes containment: for simple rings with disjoint boundaries, a representative cannot change inside/outside classification along a ring without crossing the other boundary. Bounding-box inclusion prunes impossible containers; **565** exact containment PIP tests remain. This is not an unsupported vertex-only validity shortcut.

The resulting containment forest has **1078 depth-zero rings and 10 depth-one rings**, with no deeper nesting. Depth parity identifies shells/holes independently of winding. The observed 1078 clockwise shells and 10 counterclockwise holes agree with that classification; winding and area alone were not used as validity proofs. Each hole is assigned to its immediate containing shell. Distinct shell members of each individual record have disjoint interiors under this straight-segment XY interpretation.

## Per-Polygon counts after grouping

[grouping.json](gis-country-topology-evidence/grouping.json) lists every record, every resulting Polygon shell, all assigned holes, original part indices and closure-inclusive counts. [audit.json](gis-country-topology-evidence/audit.json) additionally lists every ring's count, winding, exact bounds/area numerators, parent and depth.

| Quantity | Result |
| --- | ---: |
| Original SHP records / original ring positions | 250 / 23938 |
| Original rings | 1088 |
| Derived Polygon members / holes | 1078 / 10 |
| Records represented by one Polygon | 176 |
| Records represented by a MultiPolygon | 74 |
| Maximum individual ring positions | 1282 |
| Maximum Polygon positions: shell + all holes, including each closure | **1282** |
| Polygon members above 2048 | **0** |

The sums of all derived Polygon counts equal the original **23938** positions exactly: no ring or closing vertex was dropped or duplicated. Canada (record 39) has **3316 positions across 126 Polygon members**, maximum member **932**, with no holes. Russia (record 184) has **2167 across 83 members**, maximum **1282**, with no holes. Their record totals above 2048 therefore do not imply a per-Polygon violation. Treating either entire SHP record as one Polygon would conflate separate shells.

Seven Polygon members contain the ten holes:

| SHP record / historical DBF name | Shell part | Shell positions | Hole parts | Hole positions together | Polygon total |
| --- | ---: | ---: | --- | ---: | ---: |
| 11 / Armenia | 0 | 25 | 1,2 | 8 | 33 |
| 15 / Azerbaijan | 0 | 37 | 1 | 4 | 41 |
| 108 / Italy | 2 | 85 | 3,4 | 8 | 93 |
| 151 / Mozambique | 0 | 98 | 1,2 | 8 | 106 |
| 199 / South Africa | 0 | 67 | 1 | 13 | 80 |
| 215 / Switzerland | 0 | 34 | 1 | 4 | 38 |
| 246 / West Bank | 0 | 7 | 1 | 4 | 11 |

## Cross-record contacts and overlaps

The global sweep covers cross-record boundaries as well as self/within-record boundaries. It finds contacts between **343 ring pairs belonging to 316 record pairs**. **14 record pairs have proper boundary crossings**, which establish positive-area interior-overlap wedges for these individually simple, consistently nested features. In the source's literal straight-segment XY coordinates, each is China paired with one of Afghanistan, Bhutan, India, Kazakhstan, Kyrgyzstan, Laos, Mongolia, Myanmar, Nepal, North Korea, Pakistan, Russia, Tajikistan or Vietnam. This records source geometry, without deciding which boundary should be changed or assigning geographic correctness.

All **31125 unordered record pairs** were considered; **30532** have disjoint record BBoxes. For pairs without an already established crossing witness and without disjoint BBoxes, the audit additionally executes **373116 shell-vertex PIP tests and 373116 exact shell-edge-midpoint PIP tests**, in both record directions until a positive witness is found. These searches find no additional interior-overlap witness. Pairs with disjoint boundaries can have overlap only through nesting; the complete shell representative tests exclude that case here.

The remaining **302 boundary-contact record pairs are explicitly unresolved as to interior overlap** by this audit. Point touches and collinear shared segments alone do not distinguish all valid adjacency from interior overlap. No full planar overlay, intersection-area computation, contact-point edge subdivision or local-sidedness analysis was executed for these pairs. Do not translate “no additional witness” into a certification that all 302 have disjoint interiors. [cross-record-overlaps.json](gis-country-topology-evidence/cross-record-overlaps.json) retains every contact pair, positive crossing witness and unresolved pair.

## Limits and resulting decision

The source supports a **closure-inclusive per-Polygon maximum 1282**, comfortably below 2048, without changing source geometry or the existing numeric cap. Individual-record shell/hole topology was actually checked under exact planar straight-segment semantics; full ring self-contact testing was not deferred. The dataset as a whole is not an overlap-free country partition: 14 overlapping pairs are positively witnessed, with 302 other contact pairs unresolved for interior overlap.

This is source-data evidence only. It establishes no delivered Planar/GeoJSON/SHP API, parser budget policy, contains default, global MultiPolygon contact rule, scientific/geographic validity, antimeridian interpretation, CRS transformation, projection-domain behavior, NetLogo functional parity, original successful GIS Setup, target browser result, model acceptance or independent Argon approval. No network lookup, literature research, runtime change, data mutation or repair was performed. Rights, text decoding and other archival findings remain separate.
