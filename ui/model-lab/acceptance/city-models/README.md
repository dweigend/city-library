# City model browser acceptance

## Revision 2 browser evidence

Revision 2 (2026-11-10) replaced the mechanisms and scenes of all fifteen models. **Independent mechanism and visual reviews approve all fifteen models for the bounded teaching-model scope, with recorded low-severity limits.**

**Current acceptance:** the [targeted Opus review](revision-2-targeted-final-opus-review.md) approves fourteen models; the [final Water visual review](revision-2-water-final-visual-approval.md) closes the fifteenth. The latest correction sets are [60 targeted images](revision-2-final-rest-fixes-manifest.json) and [eight Water outlet images](revision-2-water-outlet-manifest.json). Mechanisms, including the later Water status correction, have separate Gemini approvals.

**Earlier correction pictures:** after the [independent visual review](revision-2-opus-visual-review.md), the views were corrected and recaptured; see [revision-2 visual fixes](revision-2-visual-fixes.md) (finding → response → check → screenshots) and its [manifest](revision-2-visual-fixes-manifest.json). The current images are in [`screenshots/city-models/revision-2-visual-fixes/`](../screenshots/city-models/revision-2-visual-fixes/). The 147 images described below in this section stay unchanged in `screenshots/city-models/` as the pre-fix record that review inspected ([hashes](revision-2-before-image-hashes.txt)); the `host-live-enter-*` images remain current for the host Enter fix. Everything in this section is author evidence by the implementing agent (Claude Opus 5.5). Current status lives in the [central status](../../../../docs/development/city-simulation-models.md#current-revision-status); author responses to the Opus 5.5 review are in [revision-2 responses](revision-2-author-responses.md).

### How the pictures were taken

Headless Playwright Chromium (playwright-core 1.64.1 from the local Bun cache, not a project dependency) against the running Agent Lab dev server on `localhost:3101` from this checkout. Each state uses a fresh browser context with the theme set before navigation, real button clicks for Setup, steps and model actions, typed input confirmed with Tab, and the Parameters panel opened where the narrow layout hides it. Before capture the script waited for fonts and ten animation frames. Viewport images (`*.png`) show the visible 1366×768 or 390×844 page including the header; element images (`*-element-N.png`, `*-figure-N.png`) show one figure after scrolling it into view. No full-page images are used.

Per model there are four runs: defaults in desktop light and narrow dark, and one intervention in desktop dark and narrow light. Additional runs cover narrow tables with horizontal scrolling, 1000 initial mobility trips, one million residents and one million kg of daily waste. Every run reported zero document overflow and no page or console errors.

| Model | Default state | Intervention |
| --- | --- | --- |
| Population | year 30 | pulse of 100 immigrants, year 10 |
| Housing | month 20 | allowance 400, month 20 |
| Land Use | year 16, compact | dispersed growth with corridor protection, year 16 |
| Daily Activities | day 1, 07:30 | remote work and local shops, day 2, 16:00 |
| Mobility | minute 20 | road capacity 10, minute 20 |
| Employment | demand 30 for six months, slow hiring, month 8 | same with hiring limit 10 |
| Services | day 2, central | distributed layout, day 2 |
| Energy | day 2, 18:00 | half of evening demand shifted |
| Water | day 80, no savings | trigger 0.6, cut 0.15, day 80 |
| Stormwater | hour 3, single storm | double storm, hour 10 |
| Heat | day 2, 16:00 | shade 0.4, day 2, 04:00 |
| Air and Noise | minute 60 | ventilation 0.8, minute 60 |
| Habitat | year 10 | stepping stone and bridge removed, year 10 |
| Materials | day 15 | collection 160, day 15 |
| Finance | year 20, worst first | preventive repair, year 20 |

The retained [screenshots](../screenshots/city-models/) use `<slug>-<default|intervention>-<desktop|narrow>-<light|dark>` names. They replace the revision-1 images; the historical reviews below refer to revision-1 captures that are no longer retained.

### Author findings fixed during the browser pass

- Narrow layouts: overlapping or clipped labels in Daily Activities, Mobility, Energy, Water, Stormwater, Services, Air and Noise and Materials were shortened or moved and recaptured.
- Employment: crossing assignment lines replaced by employer colors; similar orange tones for employed and desired jobs replaced by blue and orange.
- Light theme: the neutral scene color was nearly invisible as a chart line (Heat air temperature, Housing rent, Energy demand, Land Use largest patch, Habitat mean, Air mean); chart lines now use a mid gray from the central palette.
- Shared host (found by the revision-2 author): Enter in a live field submitted setup. The coordinator subsequently separated live fields from the form; see [host correction and executed checks](revision-2-host-enter.md). The independent revision-2 Opus review reproduced and approved the corrected keyboard flow.

### Interactive checks in the preview browser

Land Use in the T3 preview tab (1280×800): Setup, keyboard focus on the canvas, Home selected `parcel:0`, ArrowRight selected `parcel:1`, *Toggle selected parcel protection* changed the inspector to "Protected" and the monitor to 1 ha.

### Web interface guideline check (author)

The current Vercel Web Interface Guidelines were fetched on 2026-11-10 and applied to the fifteen `ui.ts` declarations and the observed flows. The models add no components, CSS or DOM code; all controls come from the shared host with labels. Every spatial scene provides a plain-text `description` with its current quantities, keyboard selection works through the shared canvas, and state is encoded by shape, outline or label in addition to color (diamond displaced, triangle too far, outline vacant or protected). Units appear in labels and axes. The guideline item on forms concerns the shared Enter-submits-setup behavior above, which was subsequently fixed and independently checked as recorded above. This is an author check, not an accessibility audit or independent review.

## Revision 1 (historical)

Checked on 10 November 2026 with Playwright Chromium against the local Agent Lab server. This record covers fifteen synthetic teaching models, not scientific validation or a coupled city engine.

## Executed flows

Every model was selected by its public catalog URL, initialized with Setup and advanced using 1 step then 10 steps. All reached tick 11 with rendered results. Each model's live control was edited through its rendered input; resulting values are recorded in its `models/<slug>/evidence/checks.md`. Mobility also dispatched four additional trips. Land Use Change used keyboard Home to select the first parcel, toggled its protection and displayed the updated inspector. Run/Pause was exercised there.

Four viewport/theme combinations were captured per model: desktop 1366×768 and narrow 390×844, light and dark. DOM measurements at the captured states found no document overflow. The retained [screenshots](../screenshots/city-models/) use stable names `<slug>-<desktop|narrow>-<light|dark>.png`.

The narrow Air and Noise Exposure table was checked separately: all five column headers were present, and its 616 px content scrolled horizontally inside a 366 px container to scrollLeft 250. [Left](../screenshots/city-models/city-air-noise-table-left.png) and [right](../screenshots/city-models/city-air-noise-table-right.png) viewport captures show its headers and values. This contained table scrolling does not widen the page.

## Independent screenshot findings and responses

The independent review reports are retained verbatim. Their original `/tmp` paths identify the capture generation reviewed, not the final retained filenames.

| Review | Findings and response | Independent result |
| --- | --- | --- |
| [Initial seven](city-seven-screenshot-review.md) | Premature network captures, label collisions, clipping and transient dark-control rendering. Recaptured after readiness; see next review. | Superseded by later reviews. |
| [Eleven settled sets](city-settled-screenshot-review.md) | Duplicated land-use controls, wide energy table, incomplete categorical labels, overlapping service labels, hidden network endpoints and faint yellow series. Removed duplicate controls, used readable metric/category tables, compact labels, tall preset networks and darker central palette entries. | Population and biodiversity passed; remaining corrections required recheck. |
| [Nine corrected sets](city-final-screenshot-review.md) | Water, energy, activities, finance and materials now readable. Four dark spatial sets were still incomplete. | Five model sets passed; four dark sets required recapture. |
| [Remaining and fresh sets](city-remaining-fresh-screenshot-review.md) | Fresh dark services/stormwater/land-use/heat passed. Mobility positions overlapped and economy labels were hidden. Scaled mobility's presentation coordinates and arranged economy nodes with compact labels. | Four dark spatial sets passed; new corrections required recheck. |
| [Four corrected sets](city-four-corrected-screenshot-review.md) | Mobility/economy readable. Housing/air dark canvas captures still incomplete; recaptured with ten animation frames and an element screenshot before full-page capture. | Mobility/economy passed, including narrow and dark. |
| [Confirmed dark canvas](city-dark-canvas-confirmed-review.md) | Housing/air dark views populated and readable. Narrow air table requested a separate check; verified above. | Both dark canvas sets passed. |

Immediate full-page captures after viewport/theme changes could retain incomplete canvas output. The final dark captures used the theme before navigation, waited for font/frame settling and, for housing/air, captured the canvas element before the full page. No shared renderer source change was made. These observations establish complete final captures, not a general absence of timing defects.

## Acceptance boundary

Independent screenshot review is complete for the fifteen retained default model states. Implementer browser interaction checks and shell results are recorded separately in the [model overview](../../../../docs/development/city-simulation-models.md).

The [Antigravity gemini-3.8-flash review](independent-design-review.md) approved domains, contracts and scientific limitations with conditional UI acceptance. [Coordinator responses](review-responses.md) record fixes and objections separately. The [final independent review](final-independent-review.md) reapproved all four corrected UIs after inspecting sixteen final screenshots and the valid walking intervention. All fifteen models are accepted for the bounded teaching-model scope. Detailed assistive-technology coverage, exhaustive parameter combinations, scientific calibration and cross-model coupling are outside these checks.

