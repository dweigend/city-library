# Visual mechanism browser verification

This pass checks the corrected requirement: each of the ten original Mesa examples must show its mechanism in a primary spatial, grid or network view, rather than presenting rows and metrics as the main result. Earlier technical/UI evidence does not establish acceptance of this corrected visual requirement. These are synthetic teaching models, not calibrated city forecasts.

The browser worker changed only this report and temporary evidence files. It did not edit models, UI projections, shared components, CSS or dependencies. Source corrections described below were made by the implementation coordinator and independently rechecked through the browser.

## Browser ownership and source

The worker followed `preview_status` before opening its own new tab `tab_2p_903760d6-5433-46c2-8790-7b134aa6c724` using `reuseExistingTab=false` at the existing parent Svelte server on port3191. The human-controlled tab2l, parent tab2o and parent server were not automated, reloaded, closed or stopped. Fresh navigations loaded the revised modules because this host intentionally disables HMR. The loaded entry script was the Svelte app, not a source-only mock.

Capture began while visual changes from baseline4427227 were being integrated. The principal visual implementation was committed as5f940189c333c0f765b287d1ad2b0a030ac752fa; final caption corrections were verified through55749ccc745da384d7701eb463950733ff7e5418. Each final image record contains exact model.ts/ui.ts source hashes and PNG SHA-256, avoiding the claim that an earlier commit already contained later presentation fixes. Latest Vercel review criteria were fetched successfully into `/tmp/mesa-visual-guidelines.md`; frontend-design, frontend-design-shadcn-svelte and web-design-guidelines governed the checks.

## Method

Explicit window.error and unhandledrejection listeners, plus console.warn/error wrappers retaining native behavior, were installed before Setup in every entry. All recorded ordinary flows and final captures retained empty arrays in those channels, including ResizeObserver errors. This is scoped observed evidence, not a universal browser-error-immunity claim.

Each entry used an edited setup input, Setup,1step, actual500ms Run, Pause and two settled observations500ms apart. Counters increased during playback and stayed equal after Pause. Main screenshots cover actual CSS1366×768 desktop and390×844 narrow at DPR2 in light and dark. Every screenshot waits500ms plus two animation frames; dimensions, document width, displayed state and error arrays are recorded in the manifest. Desktop PNG exports are backend-downsampled1280×720; narrow exports are780×1688. Main document width never exceeded the CSS viewport in these captured states.

The forty required main images have unique paths. Two extra images show the crossing cohort after arrival and the battery while charging. Superseded caption/label captures are excluded from the final42-image manifest.

## Executed mechanism checks

| Entry | Actual visible state and interaction result |
| --- | --- |
| Neighborhood heat intervention | Real Grid fields are the primary heatmap. At tick10/default0.5cooling, actual sampled canvas pixels were leftRGBA188/57/62 and right215/50/41. Live cooling2 plus20steps produced tick30/mean11.57, left52/93/169 and right201/54/52. Green hatching marks existing shaded fields independently of the heat fill. Changing width6→8 and restarting preserved the exact uniform index30 pixel215/50/41. This tests real drawing, not just color-string parsing. The scale remains fixed0–30 abstract index units; no per-frame autoscaling or Celsius claim. |
| Household energy demand | Fifteen displayed schematic homes start with small blue base-load symbols and4.50kW aggregate demand. The appliance interval produced11.25kW, then live shiftedShare1 produced18.00kW with large orange load symbols. The final view is World hour15 and measured demand interval hour14, matching the model's last-interval observation. The home layout is a presentation arrangement, not invented geographic state. |
| Residential occupancy | Nine applicants show Resource-backed occupied dwelling slots, waiting symbols and a moved-out symbol. A manual release and live slot growth visibly move the next household into a slot. After the label correction, clicking an unlabelled waiting glyph displayed Household6/reservation waiting in the inspector. A separate occupied shrink3→2 was rejected with aria-invalid=true and occupied3 unchanged; correcting4 cleared the error and admitted the next household. |
| Pedestrian crossing phases | Nine waiting people appear left of the road with a red signal at minute0. At minute4 the signal is green and all nine occupy the crosswalk; at minute5 they appear on the arrived side with zero waiting/crossing. Four main captures show crossing; the extra image shows arrival. The geometry illustrates the model's discrete stages, not a fabricated walking trajectory. |
| Solar battery microgrid | With seed2, hour1 shows7kWh charging during interval0–1h. Hour4 shows2kWh at the visible reserve line,1kWh grid import and reserve crossing at3.5h; interval3–4h is explicitly displayed. Filled blocks and labelled interval flows correspond to those actual measurements. The fill is rounded to0.25kWh, not represented as a continuous physical battery geometry. |
| Stormwater retention | The primary view combines the model's real catchment grid with a schematic volume gauge. With capacity4m³, hour10 shows stored4.00m³, cumulative overflow3.00m³ and one crossing. Live rain0 followed by one step reduces stored volume to3.80m³ without adding overflow; the view's rain/inflow and gauge respond. Caption headroom and compact Spill text were rechecked in fresh captures after the narrow clipping fix. |
| Urban tree watering | Eleven schematic tree symbols show moisture by canopy size/fixed color scale and allocated water with blue markers. At day10 the model used20L and totalled200L. Live daily allowance0 followed by a step produces used-today0 and total200L unchanged; allocation markers disappear according to the actual receivedLiters observations. |
| Household recycling behavior | The primary ring contains actual graph edges, fixed view-only node positions and green/orange adoption colors. At tick10 four of thirteen households adopted in the captured run. In a separate live influence0 check, the current two adopters stayed two while tick3 advanced to13. No setup-pending flag appeared. |
| Zoning scenario comparison | All six completed scenario/seed outcomes are shown as actual aggregate dwelling-slot blocks in separate panels, with supporting capacity bars. Dedicated caption bands after the correction separate run labels from buildings and keep them inside the canvas. These are aggregate schematics, not invented parcel locations or unobserved parcel outcomes. |
| Workplace/household membership | Actual membership edges connect three deterministic presentation columns: homes, residents and workplaces. Seven residents retain fourteen edges. The public Reassign first resident action changes the displayed workplace relationship while preserving total memberships and original identities. |

## Keyboard, live controls and switching

Heat cooling, energy shifting, occupancy capacity, rain, daily water and recycling influence were exercised through their actual live controls. The explicitly induced capacity error is expected model validation, not an unexpected browser error.

A narrow keyboard check typed Solar Battery in catalog search, moved focus with Tab, opened the Experiment combobox with ArrowDown and confirmed Enter. The URL switched from occupancy to the battery entry, old canvases/results were removed, and Setup to begin appeared. Focus returned to Experiment. Setup followed by Tab focused Run with a visible3px ring. This public catalog check complements fresh-navigation checks and verifies normal teardown, not merely direct URL loading.

## Findings and recapture

- Heat: the initial numeric NetLogo rainbow projection created brightness discontinuities. The implementation coordinator/refactor worker replaced it with a continuous mix between public blue/red palette anchors on the fixed0–30 domain before these final captures. Actual canvas pixel checks verified the result.
- Heat narrow dark: an initial reviewer tool display appeared to omit hatching. Reopening the exact original and independent raw-PNG decoding found7057green pixels in both narrow themes and2072 in both desktop themes; the concern was withdrawn without a source change. A byte-identical unique copy has matching SHA-2566851fe1019fc00a2fbffea89d7407b738101e655a6b3c0c3d29354c45ab983a5.
- Occupancy: narrow waiting numeric labels overlapped. The coordinator removed non-granted numeric labels while retaining dwelling labels and selectable identity/status in the inspector. All four affected captures were replaced.
- Zoning: panel captions clipped or overlapped the previous row. The coordinator reserved a dedicated caption band with sufficient panel height. All four affected captures were replaced.
- Retention: the narrow capacity/overflow caption clipped. The coordinator increased vertical headroom and shortened/repositioned Spill text. All four affected captures were replaced.

These are capture/interaction responses. Independent actual-image findings and approval are recorded separately; this browser worker does not grant its own independent visual acceptance.

## Final screenshots

Raw final manifest: `/tmp/mesa-visual-browser/manifest.json`. Raw interaction results: `/tmp/mesa-visual-browser/flows.json`; extra live/error results: `/tmp/mesa-visual-browser/live.json`; keyboard result: `/tmp/mesa-visual-browser/keyboard.json`.

| Entry | Desktop light | Desktop dark | Narrow light | Narrow dark |
| --- | --- | --- | --- | --- |
| `neighborhood-heat-intervention` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9321xm-3cc5e930.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9322gj-c690f8b3.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9322wp-3eb6fbf1.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9323ce-1b7e3fc2.png) |
| `household-energy-demand` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939yv2-f2f55f48.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939zeh-042d24cb.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw939zw4-9f1883f4.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93a0ci-272e509f.png) |
| `residential-occupancy` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ak83-2ee022a8.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93aks0-c1dcfea2.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93al8u-d2d9c182.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93alpn-df8fdf23.png) |
| `pedestrian-crossing-phases` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937l0d-49da8b19.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937ljm-ea9c215c.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937m0u-3381e100.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937mhg-a6d9b194.png) |
| `solar-battery-microgrid` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93blug-7bf428ee.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bmdw-1dce242d.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bmv3-3f797a46.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bnbs-be469109.png) |
| `stormwater-retention` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93im5f-5338f069.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93imox-7067ab98.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93in5y-eb7c5cd7.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93inmk-0d4d3714.png) |
| `urban-tree-watering` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cp7v-4a77dca0.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cq0f-0a22a221.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cqsi-41b8136a.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93cr88-c03ba23c.png) |
| `household-recycling-behavior` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938hk7-9c7f0269.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938i55-61b9c8ec.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938inb-f7bc2f82.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw938j4c-b938bba9.png) |
| `zoning-scenario-comparison` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93egkp-a302f436.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93eh4f-bd8e3cab.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ehmc-c387b2f6.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93ei31-6ac0eb42.png) |
| `workplace-household-membership` | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9392xr-f520faa0.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9393ih-769650e4.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93940y-a35ff6ce.png) | [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw9394ht-a5965883.png) |

Extra mechanism states:

- `pedestrian-crossing-phases` desktop-arrived: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw937n3q-fb9da93a.png)
- `solar-battery-microgrid` desktop-charging: [PNG](/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw93bkpe-5de06735.png)

## Limits and ownership handoff

This pass establishes the described ordinary Chrome flows, mechanism projections and captured states. It does not establish scientific calibration, WCAG certification, screen-reader coverage, all browser engines or universal ResizeObserver immunity for caller actions invoked inside caller-owned observer callbacks. The model/world coordinates remain under the model owner; schematic display positions introduce no domain state or random draws. Independent behavior and source checks remain separate.

After independent approval of all42final images and completion of the requested rechecks, the worker closed only its own tab2p. The human tab, parent tabs and exploration server were left untouched. No source code or commit was changed by this worker.

## Coordinator preservation note

All42final approved PNGs are preserved byte-for-byte in [the portable manifest](visual-evidence/manifest.json); every SHA-256 equals its independently inspected original. The same directory preserves [ordinary flows](visual-evidence/flows.json), [live actions](visual-evidence/live.json), and [keyboard checks](visual-evidence/keyboard.json). These copies retain the reviewed evidence, not a new or broader approval.
