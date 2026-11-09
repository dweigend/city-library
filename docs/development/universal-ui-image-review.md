# Independent universal UI image review

Status: APPROVED for the final actual-image scope on 2026-11-09; all 92 final PNGs inspected, with no outstanding blocking visual findings. This is an independent actual-image review, distinct from the implementation, refactor, source-review and runtime-browser authors. It does not appropriate their test or interaction evidence.

## Scope and method

I read AGENTS, DESIGN, the accepted universal UI decisions and the global web-design-guidelines skill. I fetched the current [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) on 2026-11-09. The project/user minimal design contract takes precedence over generic decorative or title-case preferences. This pass checks applicable visual outcomes: useful content, focus visibility, small-screen layout, theme contrast, explicit empty/data states and clear counts/units. It is not a full screen-reader or accessibility certification.

The [final manifest](universal-ui-browser-evidence/manifest.json) contains 92 new PNGs: 44 primary captures and 48 supplementary captures. The primary captures cover all eleven DES entries at desktop CSS 1366×768 and narrow CSS 390×844, each in real emulated light/dark `prefers-color-scheme` states. Browser QA records native DPR 2, actual media-query state and the backend's distinct PNG dimensions. I verified original/portable bytes and SHA256 hashes, made unique hash-identical inspection copies in `/tmp/universal-image-inspection/`, and opened every final primary and supplementary PNG using `view_image` at original detail. The final integrity check passed for all 92 unique original/portable pairs, their SHA256 values and PNG dimensions. The accepted manifest SHA256 is `7db414b5fc538d7f88648fdd5c234d414fd35e7cb8dc17aa379bd31fa7ca106c`. It contains 46 desktop/46 narrow and 46 light/46 dark captures. Exact original paths, portable paths, states and hashes are recorded there. Each dark and light variant was actually viewed. An initially apparently blank dark bus frame was a repeated-region image-viewer artifact: reopening the exact same bytes alone showed the full graph, bus and queue. It is not reported as a browser defect.

I also opened the actual selected civic-office, EV, goods-buffer and elevator reference PNGs. Their flat primitive vocabulary is the comparison target; generated menus, duplicate playback, textured surfaces and erroneous counts are not. The new collection rows deliberately separate identified entities from anonymous capacity; they do not invent a desk/charger assignment to copy the reference.

## Primary scene inspection

All four required variants were opened for every row below. Counts were compared with captured monitors and the actual-state description in the manifest; this is image consistency evidence, not an independent model execution.

| Scene | Captured state and visual assessment |
| --- | --- |
| Bus interchange, minute 6 | Weighted triangle graph remains legible, one queued bus and one occupied berth. Narrow labels fit. |
| Parcel logistics, minute 2 | One stored parcel, one occupied van and actual destination graph; no invented route or depot stock. |
| Waste collection, minute 3 | Eight units at six collection patches, four aboard truck, depot unloading. Short depot label is clear in narrow variants. |
| Emergency dispatch, minute 5 | Three incident diamonds, one waiting/one completed/one assigned, one team triangle, actual four-node path. |
| Bike redistribution, minute 2 | Two bikes at Depot, two at Market, two aboard and none at Park: six conserved. Slot outlines and stock dots remain distinct. |
| Water allocation, minute 1 | Four district patches, six supplied and six unmet discrete units; labels make no hydraulic or volume claim. |
| Maintenance, minute 10 | One waiting, one operational and one repairing machine, one assigned crew and two completed repairs. |
| Elevator, second 10 | Six floors, two cars, three waiting dots and two cabin dots; one arrived passenger is absent from the active scene. |
| Civic office, minute 1 | Two waiting residents, one in service and separate one-unit clerk capacity; completed zero is explicit. Centered headings are fully visible after `434978b`. |
| EV charging, minute 1 | One waiting, two charging and separate two-unit capacity; completed/cancelled zero states remain visible. Shapes distinguish priority vehicles when present. |
| Goods buffer, minute 3 | One blocked put and two stored crates, separate two-crate capacity and empty collected set. Empty ledger reports No rows. |

No primary final-state scene clipping, hidden counts, topology loss or confirmed overlap was found. Existing secondary tables intentionally scroll horizontally on narrow screens; they are not confused with document overflow or a missing scene. Controls stay in the shared Lab shell. The main vocabulary remains flat dots, squares, diamonds, triangles, thin links and outlined capacities on the existing charcoal surface. Meaning is also carried by position, shapes, headings and counts, not color alone.

## Findings and disposition

The browser reviewer found left-clipped new collection headings before this image pass. The coordinator corrected their common position in `434978b` to match the existing canvas's center text anchor. Only corrected images enter the primary manifest. I independently reopened all twelve office/EV/goods variants and confirmed that their complete headings are inside the canvas in both viewport sizes and themes. No global renderer alignment or per-model offset was introduced.

One low-severity new shared-copy finding was reported to the coordinator: singular collections currently say `1 items` in office service, EV priority queue and blocked goods. Actual quantities are correct and legible. The coordinator corrected this centrally in `0615e43` (singular `1 item`, plural `0/2+ items`), preserving quantities and geometry. I independently reopened all sixteen final replacements (twelve primary collection captures and four retained-capacity captures): singular/plural copy is correct in both sizes and themes, with unchanged quantities and geometry. Finding closed. This is not a state-conservation or geometry defect.

## Supplementary inspection

All four viewport/theme variants were actually opened for each case below, including the final corrected Taxi captures. Superseded captures are not accepted as final evidence.

| Case | Visual assessment |
| --- | --- |
| Office retained capacity | One waiting, three in service against capacity one. Three anonymous occupied units remain visible; the description explicitly reports two excess units. No retained claim is hidden. |
| Office density | Ninety waiting dots, ten service dots and ten anonymous capacity units fit the narrow canvas without overlap or truncation. All 100 residents remain represented. |
| EV priority | Priority diamond precedes the ordinary queued rectangle; two occupied charger claims remain distinct from capacity. No extra marker is counted as a vehicle. |
| Robby last table page | Range 201–243 of 243, actual final zero-based strategy index 242, Previous enabled/Next disabled. Rows remain readable; narrow columns use existing horizontal table scrolling. |
| Conditional chart | B and explicit Fixed series have distinct labels and retained colors. Axes and legend fit. The deliberately dark author-supplied Fixed color is preserved; arbitrary explicit palettes are not guaranteed automatic contrast correction. |
| Taxi controls | Long AM/MD parameter groups remain readable in the existing scrolling controls. Corrected probability 0.31 is valid and no native validation popup obscures the final captures. |
| Heat fixed scale | Physical 51×51 temperature grid and original scientific color mapping remain clear; no inferred per-frame normalization was introduced. |
| Traffic follow | Two physical lanes, selected car and history remain legible. The existing Reload updates indicator is visible; see capture freshness qualification below. |
| PSO overlay | Scientific grayscale landscape, orange particles and blue highlight remain distinct. The narrow None label belongs to the trails mode, not particle selection. |
| Vision overlay | Brown land, blue water, fish triangles, food dots and transparent vision disks preserve the existing scientific portrayal without hiding the main entities. |
| Recycling network | Twelve H1–H12 labels fit around the actual graph; monitors remain readable without invented nodes. |
| Empty table | Explicit No rows state in all four variants, without fabricated data or empty misleading rows. |

The Taxi preparation initially supplied 31 to a fractional probability field whose maximum is 1. A native validation message obscured one early narrow capture. I reported this as an evidence/setup finding. Browser QA confirmed its input mistake, corrected the draft to 0.31 and produced four new unique originals with valid state recorded in the manifest. I opened all four corrected captures; the validation popup is absent. Finding closed without a product source change. The invalid captures remain excluded through the manifest's supersedes/correction metadata.

Traffic's captures predate the final collection-only copy correction. Browser QA documents that Traffic's runtime was unchanged since its live-default migration, with subsequent changes confined to collection labels/copy or erased type interfaces. These images establish the unchanged Traffic visual scope; they are not claimed as proof that every module was reloaded at the final repository head.

## Final disposition and limits

The accepted scope is all 92 final manifest images: eleven DES scenes in four variants plus twelve supplementary cases in four variants. I also independently inspected the relevant superseded finding/recheck images and four selected generated references. The heading and singular-copy findings are resolved in actual replacement images; the Taxi evidence preparation finding is resolved in four corrected captures. No further source or visual changes are requested by this image review.

The scenes follow the accepted flat primitive direction and existing Lab shell. Shared collection defaults remove per-model spacing choices while retaining queue order, identified entities, anonymous capacity and explicit excess. Scientific source colors, physical coordinates and specialized elevator geometry remain distinct from generic diagram layout.

This approval covers image appearance and captured state consistency only. It does not claim execution of model actions, chart color persistence across transitions, pointer/keyboard selection, screen-reader semantics, console cleanliness, resizing, disposal or scientific calibration. Runtime instrumentation and interactions belong to the independent browser evidence; source/type contracts and scientific invariants belong to their separate reviews. Images alone do not establish accessibility conformance or empirical urban validity.
