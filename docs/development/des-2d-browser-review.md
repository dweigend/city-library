# Independent flat-scene browser review

## Scope and environment

The independent browser agent exercised the eleven DES entries on the real Svelte Agent Lab at `http://localhost:3217`, using only its own Chrome tab `tab_2u_903760d6-5433-46c2-8790-7b134aa6c724`. It made no source changes. The parent's port 3211 and coordinator tab were not used. Primary captures follow the model/script refactor `8628280`; waste captures were replaced after the annotation fix `b3cb3b9`. The buffer validation fix `1e5849c` was separately tested after a fresh page load.

Configured Playwright MCP was attempted. Chromium aborted because `/usr/local/libexec/codex-playwright/chrome_sandbox` was not owned by root with mode 4755. No sandbox settings were changed. All checks below ran in the actual T3 Chrome browser, rather than a DOM emulator.

The frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines skills informed this review. The current [Vercel rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) were fetched on 2026-11-09. All eleven accepted reference PNGs were opened before comparison. Only their flat scene language was applied; actual model state takes precedence over generated count mistakes.

## Eleven-entry interaction checks

Every entry was selected through the actual public experiment catalog, set up, stepped, run for 600–700 milliseconds and paused. Every supplied domain action was clicked: Add resident; Add priority vehicle and Cancel waiting vehicle; Produce crate and Collect crate; Dispatch bus; Add parcel; Add 3 supply units; Add passenger. The remaining models provide no domain action buttons. Setup was repeated before canonical-state captures.

All numeric setup/live controls were changed to valid alternative values and Setup/step/timed Run/Pause repeated. Water supply uses its declared three-unit increment: the accepted alternative was nine units, rather than an invalid seven-unit draft probe. The explicit time monitors showed 0 after Setup, 1 after one step, and 3 after timed playback in all eleven alternative configurations. Time remained stable for a further 200 milliseconds after Pause. The ten initial controls checks and elevator also returned focused keyboard selection; frozen adapter scripts independently verify spatial keyboard identity. These checks do not claim an exhaustive keyboard accessibility audit.

Each entry underwent four alternating 1366×768 / 390×844 viewport changes after Setup, followed by actual catalog switching. No ordinary-flow `window.error` or `unhandledrejection` events occurred. Document horizontal overflow was false at the sampled narrow states. Every scene supplies an actual-state canvas accessible name and fallback text; the captured descriptions and control results are in [flows.json](des-2d-browser-evidence/flows.json).

| Entry | Primary time | Actual mechanism at capture |
| --- | ---: | --- |
| Civic office | 1 min | Two waiting dots, one occupied clerk slot |
| EV charging | 1 min | One waiting vehicle, two occupied charger slots |
| Goods buffer | 3 min | Two stored crates and one blocked producer outside |
| Bus interchange | 6 min | One bus at the berth and one waiting; weighted topology retained |
| Parcel logistics | 2 min | One queued parcel and one occupied outbound/loading van |
| Waste collection | 3 min | Eight units at patches and four on truck, depot unloading |
| Emergency dispatch | 5 min | One waiting incident, one completed, one assigned team |
| Bike redistribution | 2 min | Two bikes at Depot, two Market, two aboard; total six |
| Water allocation | 1 min | Six delivered units and six unmet units |
| Machine maintenance | 10 min | One operational, one waiting, one repairing machine |
| Elevator | 10 s | Three waiting, two riding and one arrived passenger |

## Public adapters and adversarial probes

Both `ui/index.ts` and `ui/svelte/index.ts` passed frozen public scripts `04-browser-validation.ts` and `05-picking-and-disposal.ts` in the real browser, including all nine invalid scene cases, outlined-rectangle picking, End-key identity, accessible descriptions and disposal without model steps. These four checks were repeated after the final geometry fix.

Additional public consumer fixtures tested both adapters. Maximum finite headings, maximum finite coordinates and a `width: 1, height: 1e20` aspect were rejected with accessible errors while preserving the valid canvas pixels. A separately reproduced `height: 4294967296` case previously wrapped the DOM canvas height to zero and emitted uncaught RangeErrors. After `1e5849c`, both bounded 400-CSS-pixel fixtures retained exactly the prior 800×480 buffer and identical `toDataURL()` pixels, with an accessible unsigned-32-bit validation error and zero window errors/rejections. Legacy fixtures require their ordinary bounded canvas CSS; an initially unstyled legacy fixture embedded in the Svelte page caused intrinsic-width growth and was corrected before assessing atomicity.

Subpixel rectangles remained selectable at their painted center. A miss near a legacy circle in a mixed rectangle/circle scene preserved the rectangle selection rather than invoking legacy nearest selection. The identical click in a pure legacy circle scene selected the circle. Both hosts passed these checks at native DPR 2 and with `window.devicePixelRatio` temporarily overridden to 1. The latter is a renderer-ratio probe, not a claim of a separate physical DPR-1 device.

For each adapter, two real ResizeObserver-triggering width changes coalesced into one intercepted animation frame, handle 9000001. Two model steps published the latest `generation 2` projection while that frame was held. Disposal cancelled the held frame, removed the canvas, and deliberately invoking the saved callback afterward produced zero draws and no dimension changes or errors.

The actual Lab catalog was also tested with a held elevator resize frame 9200001 and two width changes. Switching to Life cancelled the frame and detached the old canvas. Forcing saved callbacks after detachment caused zero old-canvas draws, unchanged buffer dimensions and no errors/rejections. One synchronous draw occurred during ordinary disposal before detachment; it is not misreported as a late callback draw.

## Shared-system regressions and visual evidence

Residential Occupancy, Household Recycling Behavior, Preferential Attachment and Life each passed actual Setup, step, timed Run/Pause and four alternating resizes. Step changed visible state, Pause remained stable, and narrow overflow/window errors/rejections were absent. These cover unchanged table, chart/network and grid hosts without redesigning them.

The [manifest](des-2d-browser-evidence/manifest.json) records 44 final portable PNGs, unique original source paths, SHA256 hashes and actual PNG dimensions. CSS desktop viewport is 1366×768 and narrow is 390×844, native DPR 2. The screenshot backend returns 1280×720 desktop PNGs and 780×1688 narrow PNGs; these dimensions are not presented as native desktop captures.

Theme checks inject only the existing application's dark `prefers-color-scheme` CSS declarations into a temporary QA style; light removes that style. After 550 milliseconds and two frames, Setup/state replay recreates the renderer using actual computed theme tokens. This verifies rendered light/dark token variants, rather than OS theme switching. No second palette or scene stylesheet was used. The canvas intentionally keeps the existing charcoal surface in both themes.

Independent image inspection is recorded separately in [des-2d-image-review.md](des-2d-image-review.md). Its waste label-overlap finding was fixed and all four waste originals recaptured; the final 44-image set was independently approved in `cf3448386fd9c248bea5c41fc9fe41cff3fba3c5`. An initial labels-only office report was withdrawn after SHA256-identical unique copies proved a viewer cache artifact. This runtime review does not appropriate that agent's visual approval.

No unresolved observed browser failure remains within these checks. This is scoped interaction, rendering, lifecycle and accessibility evidence, not a universal console-clean or full accessibility certification. Deliberately rejected pre-fix adversarial cases are distinguished above from ordinary flows. The preview server is left running for review; the independent agent closes only its own tab.
