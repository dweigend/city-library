# Cytoscape network view

Status: implemented by a scoped subagent; author shell/browser acceptance completed on 5 November 2026. Independent source/CLI review found no blockers; the coordinator's subsequent resize correction was verified separately below. This is an external Agend Lab presentation change, not a new core expansion phase or delivery of A5 Graph.

## Assignment and acceptance

Use Cytoscape.js as the network renderer in the existing HTML test application. Keep the current controls, model actions and accessible agent inspection. Do not change the headless library, frozen public scripts or model rules to accommodate rendering.

The initial view contains detached observations of existing agents and the Exchange model's explicit `lastInteractionIds`. The connecting line means the last sampled pair, not a persistent relationship or a guaranteed successful transfer. Lifecycle observations have no network edges. An accumulated network requires its own future model contract.

Keep four responsibilities separate:

1. Application orchestration owns scenario replacement, invokes existing model actions and distributes readbacks. It does not import Cytoscape types.
2. DOM presentation binds controls and updates inspector/accessible selection elements. It contains no simulation rule.
3. Observation projection converts readbacks into renderer-neutral detached node/edge records. Canonical IDs resolve selection; no live Agent, World or model object enters the renderer.
4. Visualization owns the Cytoscape instance, styling, viewport and temporary layout coordinates. It reports selection intent and offers explicit reset/fit/dispose lifecycle operations. It cannot advance the model or draw from its RNG.

Keep source organized by these responsibilities inside `Agend_Lab/ui/`. Use small concrete contracts; do not add a renderer registry, generic plugin system or reusable framework before another actual consumer exists. Cytoscape is a test-host dependency and must not enter core public exports or the distributable engine bundle.

Required behavior:

- Node click and keyboard selection resolve the same canonical agent and inspector state.
- Stepping updates attributes and only the current sampled-pair edge; reset/scenario replacement clears old identities and viewport state.
- Detach/copy/delete remain visible and inspectable consistently with model observations; removed relationships do not linger.
- Pan, zoom, node drag, fit and selection do not change tick, domain coordinates, energy or model RNG continuation. Display positions survive ordinary observations and reset only through explicit view/model reset.
- Resizing and light/dark themes keep the canvas legible. The existing semantic HTML inspection remains usable without canvas picking.
- Repeatable resets reuse or destroy renderer resources; event listeners and resize/theme observers have a clear lifetime.

Verify detached projection and transient-edge cleanup with meaningful unit tests. Run repository typechecks, behavior/public examples, build and packed consumer checks. Verify affected flows in a real browser, inspect desktop/mobile and light/dark screenshots, check console/asset failures and preserve focus in accessible selection. Record actual results below; proposed checks are not evidence.

## Verification evidence

The implementation added `ui/application/session.ts`, `ui/presentation/workbench.ts`, `ui/presentation/agent-list.ts`, `ui/visualization/projection.ts` and `ui/visualization/network-view.ts`. `ui/app.ts` is now bootstrap/teardown only; the old `ui/view.ts` was replaced. Cytoscape.js 3.34.4 is exactly pinned in development dependencies and bundled by the local host. There is no CDN dependency or core renderer import.

Three projection tests were written before their implementation and initially failed at the missing module. A fourth test verifies application selection and atomic model replacement. Together they check fresh detached records, transient-edge cleanup, absent layout/model-coordinate coupling, unchanged model readback/RNG continuation and revision changes only on successful replacement.

The coordinator executed `bun run check`: all 64 tests across six files, ten public scripts, strict library/dev/UI typechecks, ESM/declaration build and packed Bun/Node/ambient-free TypeScript consumer passed. After the small resize correction, `bun run typecheck` passed again. SHA-256 comparison of 26 core, model and frozen A1/A2a example files found no changes from this task's baseline. This preserves existing uncommitted runtime work rather than claiming the whole working tree is clean.

Real shared-browser acceptance used the Tailscale endpoint at 1280×800 and 390×844:

- Initial state has 24 Cytoscape nodes, zero edges, tick 0 and total energy 240. One step creates exactly one dashed last-pair edge; node attributes and inspector values follow model readbacks.
- A canvas click selected Agent 2; the HTML list and inspector resolved the same ID. Native Tab/Enter selected Agent 4, preserved focus with a solid focus outline, and left tick 1 and total energy 240 unchanged.
- Copy produced 25 visible nodes while World count stayed 24 and the transient edge cleared. Explicit attachment followed by deletion returned World count to 24, kept the deleted node inspectable and disabled its mutation controls.
- Lifecycle replacement removed all previous graph identities and edges, reset tick to 0 and displayed one node. A real browser drag changed its view position from approximately (403, 231) to (281, 142), while model coordinates remained (0, 0), tick 0 and energy 10. One model step preserved the dragged display position and changed only the expected model values to tick 1/energy 9. An intentional failing step retained energy 8 and tick 1 with an error message.
- Fit, layout reset, viewport interaction and selection followed by 100 Exchange steps produced the same complete ordered energy vector and last sampled pair as a fresh same-seed model without those interactions: tick 100, total 240 and exactly one current edge. This checks observable replay, complementing headless RNG-state tests.
- Desktop and mobile screenshots were inspected in light/dark themes. Theme changes update Cytoscape colors as well as HTML. Page scrollWidth remained 390 at viewport width 390, including two agents initialized with energy 1,000,000 each. The HTML selection list remains available alongside canvas labels.
- Resize initially clipped a previously fitted desktop view on mobile. The coordinator added fitted-camera tracking: resize re-fits an automatically fitted view while retaining intentional camera changes. After correction, desktop/mobile resize cycles kept all 24 node centers inside the viewport with tick unchanged; fresh mobile layout and both themes were inspected again. Node positions are not recomputed on resize.
- No application console errors were reported. An immediate navigation during a service restart briefly returned connection refused; retry after the service was ready succeeded and HTML/CSS/JS requests returned 200. This is development-host restart timing, not a continuing asset failure.

Frontend-design and web-design-guidelines were applied, with current upstream review rules fetched. These checks do not claim exhaustive accessibility, cross-browser certification or performance limits for large networks. The service was restarted to serve the final browser bundle.

## Independent review and responses

Antigravity `gemini-4-argon` performed a read-only source and CLI review and independently ran the full check command successfully. It found no blockers in layer separation, detached ownership, transient edge semantics, public-package isolation, canonical selection or cleanup. It did not perform visual/browser checks; those remain coordinator evidence above.

Optional findings: the lab README still described `ui/view.ts` and SVG glyphs, now corrected; adding a copied node re-fits the camera so the copy is visible, an intentional behavior documented in the README. The later fitted-view resize change is coordinator remediation with typecheck and browser evidence, not a second independent approval.

Review: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3A7a8a1156-8ac2-4e0b-accd-cc90d623712d%3Adelegate-task%3A42cd3ac2-2870-48c6-b945-a2716a1a4044>.
