# Materials canvas/theme capture diagnosis

Executed 2026-11-06 against the integrated B11 worktree. Scope: Sand, Interstitial Diffusion, Heat Diffusion, Crystallization Basic, and Sandpile as a control. This is an evidence-only diagnostic. No UI, runtime, configuration, Git, previous evidence, scientific dossier, or independent-review record was changed.

## Finding

**No shared renderer blanking failure was reproduced.** All five models rendered after the tested desktop theme change, mobile resize, and mobile theme change, using ordinary T3 Chromium viewport screenshots **before any Canvas2D readback for that model**. The four affected models' mobile screenshots were byte-identical before and after the subsequent full-canvas `getImageData` call. Adding a renderer redraw or `willReadFrequently` is not supported by this evidence.

The reported Sand contradiction is reproducible at the image-display layer: two byte-identical PNGs were presented differently during a bundled `view_image` inspection. Reopening the alleged empty file by itself showed the full scene. Other alleged mobile failures contain drawn content clipped by the viewport because the page was at a different scroll position. These are distinct from a proven Canvas2D buffer loss or compositor failure in the application.

The prior report's `immediateAnomalies`/`captureWorkaround` labels are historical claims, not reliable proof of blank pixels. They should be reconciled against this evidence by the coordinator; this task leaves the previous files unchanged. Argon approval and other model acceptance gates remain separate and pending.

## Historical file audit

The starting evidence was [selected-materials-browser.md](selected-materials-browser.md), its observation JSON and retained PNGs. Both Sand files have the same **47683 bytes**, dimensions **780×1688**, and SHA-256:

`6d6f0263697ac0aa8923100fa01f91c85dc4604eb2bfff9d7cc7f96d12f39efb`

- [sand-target-mobileLight.png](selected-materials-evidence/sand-target-mobileLight.png)
- [sand-target-mobileLight-readback.png](selected-materials-evidence/sand-target-mobileLight-readback.png)

Independent PNG decoding with the retained standard-library [decoder](materials-canvas-diagnosis-evidence/png_stats.py) found **771950 white pixels**, **43411 floor-grey pixels**, **3144 exact sand-brown pixels**, and the source-spout color in both files. The screenshot includes tick50/sand51, the spouts, sand columns, floor and native controls. It is an opaque RGB PNG, not a transparent image being composited onto black. [Exact decoded statistics](materials-canvas-diagnosis-evidence/historical-sand-png-stats.json) preserve these results.

During this diagnosis, a single tool call opened both files. Its second rendered image appeared as a black scene fragment despite those identical bytes. A subsequent single-image call opened `...-readback.png` correctly. The `view_image` tool's returned data URL was saved separately as [sand-historical-view-image-return.png](materials-canvas-diagnosis-evidence/sand-historical-view-image-return.png); its SHA-256 also equals the original. Therefore this particular visual discrepancy occurred downstream of the retained PNG bytes and the tool's returned data URL. The exact internal presentation/transport cause is not established. There is no different empty PNG to save for that discrepancy, and no application renderer fix can be inferred from it.

[Historical pair hashes](materials-canvas-diagnosis-evidence/historical-pair-hashes.json) also show that the Heat desktop-dark normal/readback pair is byte-identical, as is the Crystallization desktop-dark pair. The mobile Heat and Crystallization pairs differ, but reopening each PNG independently shows actual simulation content in both: the immediate image includes the top setup/actions and only the upper portion of the scene near the viewport bottom; the later readback-labelled image is scrolled down to expose the whole square scene. [Decoded mobile statistics](materials-canvas-diagnosis-evidence/historical-mobile-png-stats.json) confirm plate colors and crystal colors in those respective files. They are not blank buffers.

For Interstitial, [the earlier mobile-light PNG](selected-materials-evidence/interstitial-diffusion-target-mobileLight.png) contains the controls, profile chart and the first rows of blue/yellow lattice/atoms at the bottom. The later `final-mobileLight` image exposes much more of the long lattice. Both earlier/final desktop-dark files contain blue lattice pixels; the later version also has the previously documented corrected black cell projection. Those files span a model/UI projection correction and different scroll framing, so they are not controlled theme-only before/after evidence. [Interstitial PNG statistics](materials-canvas-diagnosis-evidence/historical-interstitial-png-stats.json) retain their hashes, dimensions and colors.

## Fresh real-browser reproduction

Preview status was checked first. An owned tab was opened with `reuseExistingTab:false` (`tab_s_903760d6-5433-46c2-8790-7b134aa6c724`). Port3141 was verified free, then a fresh owned server was started with:

```sh
CITY_LIBRARY_UI_PORT=3141 bun run dev:ui
```

The server built68 catalog entries and served the actual application. Chromium reported Chrome156 on Linux, DPR2. Each model used its default setup, seed1, followed by the native **10 steps** button. No public model object, hidden mutation, or forced redraw was invoked. The native controls and model reporters remained unchanged throughout each model's theme/viewport sequence.

For every model the sequence was:

1. Navigate `http://localhost:3141/?experiment=<slug>`; set desktop **1280×1000 CSS**, light; native Setup, native10 steps; normal screenshot.
2. Set dark with T3 `preview_set_appearance`; immediately request another normal screenshot, without an explicit wait or readback.
3. Resize to **390×844 CSS**, preserve dark; scroll natively to the recorded offset; normal screenshot.
4. Set light; immediately request a normal screenshot, without an explicit wait or readback.
5. Only after all those normal images exist, read the complete canvas RGBA histogram/hash and capture again at the same state/scroll.

Sand additionally retained the unscrolled mobile capture before scrolling400 CSS pixels, then two more theme switches. Sandpile additionally exercised both `includeImage:true` and `includeImage:false` snapshot settings. `preview_snapshot` used `save:true` and captured the **viewport**, with no clip/full-page setting supplied. The saved PNG was copied unchanged into this report's evidence directory; DOM geometry was read **after** saving the normal screenshot. The tool transports desktop screenshots as1280×1000 PNGs and mobile screenshots as780×1688 PNGs. Those PNG sizes must not be confused with the canvas backing buffer or CSS viewport.

| Model, tick10 | Desktop-dark screenshot | Mobile-light normal screenshot, before first readback | CSS scrollY / canvas top / canvas CSS size |
| --- | --- | --- | --- |
| Sand,12 sand sites | [desktop](materials-canvas-diagnosis-evidence/sand-desktop-dark-immediate.png) | [mobile](materials-canvas-diagnosis-evidence/sand-mobile-light-scrolled-again.png) | 400 /167.578125 /358×358 |
| Heat, diffusivity0.104131 | [desktop](materials-canvas-diagnosis-evidence/heat-desktop-dark-immediate.png) | [mobile](materials-canvas-diagnosis-evidence/heat-mobile-light-immediate.png) | 400 /220.375 /358×358 |
| Interstitial,1757 diffusing atoms | [desktop](materials-canvas-diagnosis-evidence/interstitial-desktop-dark-immediate.png) | [mobile](materials-canvas-diagnosis-evidence/interstitial-mobile-light-immediate.png) | 450 /365.65625 /358×1755.0703125 |
| Crystallization, average1209.055 / frozen20 | [desktop](materials-canvas-diagnosis-evidence/crystallization-desktop-dark-immediate.png) | [mobile](materials-canvas-diagnosis-evidence/crystallization-mobile-light-immediate.png) | 400 /257.8515625 /358×358 |
| Sandpile control, average1.4960 / size22 / lifetime12 | [desktop](materials-canvas-diagnosis-evidence/sandpile-desktop-dark-immediate.png) | [mobile](materials-canvas-diagnosis-evidence/sandpile-mobile-light-immediate.png) | 400 /362.375 /358×358 |

At desktop, the square canvases have rect x312,y115,width672,height672 and buffer1344×1344. Interstitial has the preserved41:201 aspect ratio: rect x312,y409,width672,height3294.4375 and buffer1344×6589. At mobile, square buffers are716×716; Interstitial's is716×3510. All observed canvas CSS states were display:block, visibility:visible, opacity:1. The long Interstitial view cannot fit within one viewport; a screenshot of only its top is expected clipping, not disappearance of the rest of its bitmap.

An explicit clipping example is [Sand mobile before scrolling](materials-canvas-diagnosis-evidence/sand-mobile-light-immediate.png): at scrollY0 its canvas begins y567.578125 and ends below the844px viewport. [The same state after scrolling400](materials-canvas-diagnosis-evidence/sand-mobile-light-scrolled-again.png) exposes the full floor. Both were taken before the first pixel readback. This reproduces the framing difference without requiring any renderer repair.

## Canvas data and screenshot comparison

Full RGBA was read only after the ordinary captures. The retained JSON includes dimensions, pixel histogram, opacity count, canvas rect, scroll and SHA-256 of the RGBA bytes. Semantic colors matter: counting `nonBlack` alone is inadequate because a uniform `#151515` background is also nonblack. The fresh readbacks show actual model colors:

- Sand: exact sand-brown720 pixels, spout-blue192 and floor-grey43411.
- Heat: plate-red/pink shades, exact plate interior244,202,199 count87216, and grey surround282401.
- Interstitial: exact lattice-blue1015091 pixels and atom-yellow33181; both are present in its2513160-pixel buffer.
- Crystallization: exact warm-red20103 pixels, white4898 and several temperature colors; the buffer also contains its normal dark background.
- Sandpile: its four pile colors including black100929, dark-blue97799, medium-blue92547 and light-blue95935.

[Fresh before/after comparisons](materials-canvas-diagnosis-evidence/fresh-readback-comparisons.json) show **identical PNG bytes** for all four affected models before and after full readback at the same state and scroll. Thus the readback did not restore absent visual content in this run. Its source PNGs already contained that content. The Sandpile control's light and subsequent dark RGBA hashes were also identical: `d6b8933f400fd06ee5ac025f9a68543fad02ba9cb1b77628ac06cf663601fca5`; only the surrounding page theme changed.

Normal desktop/mobile captures were visually inspected, with the critical historical alleged-failure images reopened individually. All screenshot/JSON hashes and exact PNG dimensions are retained in [manifest.json](materials-canvas-diagnosis-evidence/manifest.json). This new evidence does not relabel any old image or attach new runtime hashes to earlier captures.

## Shared renderer lifecycle review and proposed action

The global `frontend-design` skill and `web-design-guidelines` review workflow were used; current Vercel rules were fetched successfully during this review. This was a focused rendering/theming/viewport diagnosis, not a fresh comprehensive accessibility audit.

`ui/views/canvas.ts:46–109` draws from one `latest` observation. It first fills the entire buffer, then paints cells/segments/agents. Colors are explicit model/presentation values; they do not depend on CSS light/dark tokens. `resizeBuffer` at110–116 sets width/height only when they change, avoiding unnecessary clearing. The ResizeObserver at117–124 recalculates the DPR-capped backing size, then calls `draw()` synchronously. `update` sets the new observation/aspect ratio, resizes, and draws; disposal disconnects the observer and removes the view. `ui/compose.ts` passes detached model observations to this adapter and only recreates it for Setup/model replacement. Theme switches alone do not perform Setup or advance the domain.

There is no theme listener on this canvas, but none is required for the currently explicit canvas palette. The shared network renderer's theme handling is separate and was outside this diagnostic scope. A hypothetical context-loss path or browser compositor bug remains possible in general, but neither occurred in these executed checks. No context-loss recovery hunk, periodic repaint, matchMedia redraw, forced readback, or read-frequency context option is justified by the retained evidence.

**Recommended action: fix the evidence interpretation, not the renderer.** Reconcile the earlier four visual gates using the fresh normal captures and correct the historical claims that readback restored their images. When a visual tool presents an apparently empty image, reopen one file per call and compare exact PNG hashes/colors before concluding that a renderer lost pixels. For tall pages, record scrollY and canvas rect alongside the screenshot and deliberately expose the relevant region. Preserve any real future failure before reading pixels; compare its actual PNG content, DOM rect, and full RGBA histogram at the same state/scroll. No tiny UI fix is proposed because a target defect was not demonstrated.

## Executed checks and limits

- Real T3 Chromium Setup/10-step/theme/viewport/scroll flows ran for all five named models, with ordinary screenshots retained before readbacks.
- Full Canvas2D RGBA checks ran for all five, with matching light/dark RGBA additionally checked for Sandpile.
- The five historical before/readback pairs were hashed; key historical PNGs were independently decoded using only the Python standard library. The Sand `view_image` returned PNG was also byte-checked against its input file.
- Evidence JSON parsing, screenshot SHA-256 generation and local report-link validation were performed. The server bundle built successfully; no TypeScript or runtime edit was made, so no new typecheck/test/build validation is claimed beyond that actual development-server build.
- The final bounded browser diagnostic snapshot contained no console entries or captured errors. It omits older network history; it is not an exhaustive HAR or GPU trace.

The task did not reproduce an application renderer failure, so it cannot provide a real failed application screenshot/fix/retest pair. It provides the retained historical alleged failures, the image-display discrepancy of identical bytes, explicit viewport clipping, and fresh normal/readback success pairs instead. It does not certify all200 models, every browser/GPU, long background-tab suspension, all DPR transitions, empirical scientific validity or independent approval. The parent owns acceptance decisions; Argon remains pending.

The owned tab was closed and server session69208 stopped with Ctrl-C. Port3141 had no remaining listener. Other tabs, servers and concurrent work were preserved.
