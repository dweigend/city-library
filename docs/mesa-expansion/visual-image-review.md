# Independent review of corrected mechanism images

The primary views now show the mechanisms of all ten Mesa city examples. **Approved for the 42 retained captured states**: desktop and narrow in light and dark for every model, plus crossing-arrival and battery-charging views. Every listed original PNG was opened individually with `view_image`. Earlier table-first approvals do not satisfy or replace this corrected visual requirement.

Reviewer: native Codex subagent (`gpt-6.1-sol`, inherited medium reasoning), independent from implementation, refactoring and browser capture. This reviewer changed only this report, with no source edits, browser interactions or commits. Review criteria came from DESIGN, frontend-design, frontend-design-shadcn-svelte, standalone shadcn-svelte and web-design-guidelines. Current upstream Vercel rules were fetched on 2026-11-09 into `/tmp/mesa-visual-browser/image-review-guidelines.md`.

## Scope and source boundary

The first heat review observed HEAD `a90704c4bae126c36ee9afe809bd08b520d219ea`. Final reinspection observed `55749ccc745da384d7701eb463950733ff7e5418`, including the retention caption correction. Captures span the visual implementation and focused corrections; this is not a claim that all 42 files were recaptured at one HEAD. Occupancy, zoning and retention use the replacement originals listed below; their superseded files are excluded from approval.

Browser metadata records CSS desktop 1366×768 and narrow 390×844, DPR 2. PNG headers independently confirm desktop 1280×720 after backend downsampling and narrow 780×1688. The browser worker owns capture provenance and interactions. This review assessed main-view mechanism legibility, composition, meaningful encodings, labels, scales, theme readability and visible clipping, rather than just absence of overflow.

## Visual assessment

Every row has all four required viewport/theme states approved.

| Model | What the main view makes visible | Assessment |
| --- | --- | --- |
| Neighborhood heat intervention | Real Grid cells contrast a blue cooled shaded half against a warmer red half, with an intermediate boundary. Green diagonal hatching separately marks shade. | Fixed blue 0 → red 30 legend states abstract index units; no Celsius or physical forecast is implied. Mean line supports the map. |
| Household energy demand | Fifteen household outlines contain load-sized disks, orange for active appliances and blue for base demand. | Captured appliance period makes the load mechanism visible; total kW and energy line provide numeric context. The picture reports the completed demand interval. |
| Residential occupancy | Four dwellings hold labelled granted residents; separate orange waiting and gray moved-out markers show reservation outcomes. | Selected waiting household has an identity/status inspector. Removed waiting labels avoid crowding without hiding granted dwelling labels or inspector identity. |
| Pedestrian crossing phases | Road, crosswalk, signal and a pedestrian cohort show waiting/crossing/arrived positions. | Green-signal crossing and the extra red-signal arrived capture explain phase/state relationships. This is a schematic, not invented vehicle traffic. |
| Solar battery microgrid | Battery fill, reserve line, solar/load labels and grid exchange show storage and threshold consequences. | Charging and reserve-level states differ visibly. kWh/kW and completed flow interval are explicit; fill quantization is disclosed in the caption. |
| Stormwater retention | Catchment feeds a blue basin with capacity, red spill and drain paths labelled in m³. | Full storage, current interval spill and accumulated overflow monitor are distinguishable. Corrected captions remain inside the narrow canvas. |
| Urban tree watering | Eleven trunk/canopy symbols vary from small dry red to larger moist green, with separate blue water-allocation markers. | The captured heterogeneous moisture and two allocations reveal stress and watering. Supporting mean line does not replace the tree view. |
| Household recycling behavior | A stable thirteen-household network shows green adopting households among orange nonadopters. | Actual edges, readable H1–H13 labels and node inspector show peer structure without an UUID-dominated primary table. |
| Zoning scenario comparison | Six labelled run panels stack colored dwelling slots over gray parcel bases, with different cap colors/heights. | Explicit aggregate schematic, not geographic parcel claims. Dedicated caption bands now separate every run/cap/result from adjacent blocks. |
| Workplace/household membership | Homes, residents and workplaces form three readable columns with differently colored membership edges. | Native memberships and fourteen edges are visible; layout is a view schematic, not asserted geographic positions. |

## Findings, responses and independent rechecks

| Finding | Implementation response | Independent result |
| --- | --- | --- |
| Occupancy waiting labels overlapped in the narrow scene. | Removed labels only from nongranted markers; kept distinct status colors, granted labels and identity inspector. | Reopened all four replacement originals. No label pile remains; selected Household 6 still reads as waiting. Resolved. |
| Zoning top captions clipped; lower captions overlapped previous parcel bases. | Added a dedicated caption band and panel headroom; kept all six captions. | Reopened all four replacement originals. Every run/cap/result label is readable and separate from blocks. Resolved. |
| Retention capacity caption clipped at top; narrow overflow label lost its trailing unit. | Increased view headroom and used a compact `Spill` label at an interior point. | Reopened all four replacement originals after `55749cc`. Capacity, Spill 0.70 m³, In 0.90 m³ and Drain 0.20 m³ are fully readable. Resolved. |

The first tool display of heat narrow-dark appeared to omit green hatching. The question was withdrawn before any source edit: original PNG bytes decoded with Python standard-library struct/zlib contain 7,057 green-dominant pixels in both narrow themes, and 2,072 in each desktop theme. Reopening and independent confirmation showed the hatch geometry. Similar tool-display ambiguity in dark spatial canvases was not misreported as a source defect. Actual original files, not a stale overwritten screenshot name, determine this review.

## Retained originals

These are the 42 actual inspected files. SHA-256 anchors the approved bytes. Capture manifest: `/tmp/mesa-visual-browser/manifest.json`.

### neighborhood-heat-intervention

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9321xm-3cc5e930.png` | `d34a3aa57bdf53b60f150bc5710555d3b4aa706b04e2d2f6d4bbd0e42430ada1` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9322gj-c690f8b3.png` | `ddd31958e55971045ded6e7918387f97b53c3a94fbc5cae502563ed3616b2828` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9322wp-3eb6fbf1.png` | `c3a515369081bf45c727f7b4bec0727b0482f0e43dc5022997ed5f15a920b791` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9323ce-1b7e3fc2.png` | `6851fe1019fc00a2fbffea89d7407b738101e655a6b3c0c3d29354c45ab983a5` |

### pedestrian-crossing-phases

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937l0d-49da8b19.png` | `8a3db74e23a7858551f979aaf4f83fd51f6f547baf3b1816a1a24b9b5a861abb` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937ljm-ea9c215c.png` | `d224248c92b10ae59e3879769ef1fd539344dbe534aabc6b3b82b11a34c72c14` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937m0u-3381e100.png` | `5bfabbae805275e60c9850768b64a41f8514412564797c3cc379e3ed59168a86` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937mhg-a6d9b194.png` | `64d7cc63e39c32eb759b36f053cf8cd352d1fe3baa921ce2b797f828c8f3814d` |
| desktop-arrived / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937n3q-fb9da93a.png` | `e761b24aa5f2f909398280012877c6ad7b898e0b1762717cb81c124697c60bf1` |

### household-recycling-behavior

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938hk7-9c7f0269.png` | `84fc210f5f3bb7f8f53c1e277f69efbb65c1eba3ec1d4ed18e5ab7a912b33eb3` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938i55-61b9c8ec.png` | `0ca2efe890ea55d340a6f39e9ddf2648c1427159c31a4f2cbdf949efc0895c8c` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938inb-f7bc2f82.png` | `0a7cc5dab2d18c4dc20acdc1ab56a204630a86f79c49d5e9685e377034e98d75` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938j4c-b938bba9.png` | `8749d7a1f3c24388b3dde51a5b02b5cdbafe0d7aa4584dcb7e060bae435cd8b0` |

### workplace-household-membership

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9392xr-f520faa0.png` | `d6ac68989d9aef6f0b809601e7dd13719f6823058a2de4cc9daf8945acca55d7` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9393ih-769650e4.png` | `b4b307555aeccaec84c9a618e935a434694b0cb975f70e2f487a3e268fb23152` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93940y-a35ff6ce.png` | `4da81623ebdb8a8ac6bb738d33c5f59b2d20eedc829da15905a8c07e7ad15fd0` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9394ht-a5965883.png` | `66b02c8212362123e89ee3bfedd4795c0ba4cdc2de2adb4f4fd472b4efbbcd63` |

### household-energy-demand

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939yv2-f2f55f48.png` | `17422d1f89995c14e49d1ea67141524054f3b535d4ef758f54a27b85047781f0` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939zeh-042d24cb.png` | `0044d220af451362f7cc2fa0aa9d33079e6b9bf8ab8db2964c681b54076c112c` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939zw4-9f1883f4.png` | `3d05bbfcacde502595a6e775471beb1e2a4eca5460f973884c25bd66bf02468e` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93a0ci-272e509f.png` | `f5a6dc5c41701d0093605195965ce4a2b444676e92d87b1154287be15497b9f1` |

### residential-occupancy

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ak83-2ee022a8.png` | `3028460b3a3a77e315f1934351efae69282474d4c70ed0cc61c0df99686260a5` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93aks0-c1dcfea2.png` | `753fabd259e725d9f3a56070a9184ae68499070e7f515e9c0c223b4891f75273` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93al8u-d2d9c182.png` | `f49f6f2ddcf0ce76ef742f088f2b077c9cbb33b62452807dc8110011b40c791c` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93alpn-df8fdf23.png` | `cb86d133ee9feb8cf9b0fabdbd43e642e12a93b8925233131b11a4e9db01122d` |

### solar-battery-microgrid

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop-charging / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bkpe-5de06735.png` | `bee6bdd5123c2d86ddf7376897aba680cca1644a511341556fe897cf339ccfda` |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93blug-7bf428ee.png` | `118f71a49e91a9269689e4733eb5d8234e115a2085a1ee950b12ea2eb648fe06` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bmdw-1dce242d.png` | `9e075dfc7e52a126c0b3dd21a21866ef29c0b739546335ba6b3947da50b9c068` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bmv3-3f797a46.png` | `156769acacb5021532f3f7053b529aa8a9627e1ccbae3c81ac8d282c51d56f5c` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bnbs-be469109.png` | `cf3a59f2258a6072a30206930666e93dfa9e69b2a5bbec09731ea1d0310b93ea` |

### urban-tree-watering

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cp7v-4a77dca0.png` | `e5182666d3a7d4840eab8fc86e30c8514643a2713c9f7b6171c2a12c79c5d758` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cq0f-0a22a221.png` | `6f9a1f5f81a1ba25d8db6c5ab319c768b1df30c82f4ec091063635f4f91af9eb` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cqsi-41b8136a.png` | `574f9d9d35dbca04b7ae7d60454f482f1a85b59a5e47a369565845e27adf92f4` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cr88-c03ba23c.png` | `f967e5667a6aa222792acd3383f6dc3ce806a0416205710bd158857ce968064e` |

### zoning-scenario-comparison

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93egkp-a302f436.png` | `33d5cff830c3050bf83e22a477033f59316b0699273d64408cc524f5d82384df` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93eh4f-bd8e3cab.png` | `726c0d8273e6868f87c3a3a1381f13923b38b6fd5366e4195c4c072c30070b44` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ehmc-c387b2f6.png` | `a093a217ca8081e73b7ae0d7dc1aefc9bdc905214213a1753d5b3b684a20b5ef` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ei31-6ac0eb42.png` | `c429be96c23ee52958f8ae1d33b8e555f6c4a431f0fac71bf5f0969d12ea7f2a` |

### stormwater-retention

| State | Original PNG | SHA-256 |
| --- | --- | --- |
| desktop / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93im5f-5338f069.png` | `dfd0d30de84a2d92a282f784768db2f2e491d3979afa4d62e6136d03c6aeb981` |
| desktop / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93imox-7067ab98.png` | `296c7a94ab9a9368fbcbf001bd40cce5bf6cbf7aa95c69f4b43c9512a8b49f16` |
| narrow / light | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93in5y-eb7c5cd7.png` | `92def1fabc0571af229d2afeffa64188251812b4bd84179a9100bbc5b678bb84` |
| narrow / dark | `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93inmk-0d4d3714.png` | `d126b248e719bbd49c847dd05ff264af7287ca2c347374c87675bbf794ea8951` |

## Approval limits

This is independent approval of the captured visual mechanisms, not a scientific validation, full accessibility certification, all-parameter screenshot audit, source correctness proof or global warning-immunity claim. Screen readers, color-vision simulations and extreme maximum-size configurations were not independently exercised here. Color is supplemented by labels, position, shape, size or hatching in these views, but this is not a complete WCAG audit.

This reviewer did not run interactions, shell tests or window-error listeners. The browser worker separately records Setup/step/playback/pause/actions/model-switch checks and actual error instrumentation; test and refactor reports separately establish detached projections and unchanged model behavior. Empty capture error arrays are not independent image evidence that no runtime error can occur. No earlier core Gemini approval is extended to later presentation changes by this report.

## Coordinator preservation note

All42final approved PNGs are preserved byte-for-byte in [the portable manifest](visual-evidence/manifest.json); every SHA-256 equals its independently inspected original. The same directory preserves [ordinary flows](visual-evidence/flows.json), [live actions](visual-evidence/live.json), and [keyboard checks](visual-evidence/keyboard.json). These copies retain the reviewed evidence, not a new or broader approval.
