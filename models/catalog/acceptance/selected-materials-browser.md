# Selected materials original/target Chromium evidence

Executed 6 November2026 in the T3 server browser, Chrome156.0.0.0 on Linux. All eight loaded native XML hashes exactly match inventory and pinned Galapagos90be931773fcf499049247a8aaa1aecbe003654c. NetLogo7.0.4. Original CSS viewport1440×1100; T3 PNG transport scales those screenshots to1280×978. Target desktop1280×1000 and mobile390×844 CSS, DPR2; screenshots carry their actual PNG dimensions in the manifest. Mobile uses a resized Chromium viewport, not a separate mobile user agent. Original RNG is its native unseeded stream; target seed1 unless a fixture explicitly states otherwise. No cross-RNG trajectory/distribution identity, physical units or empirical scientific validation is claimed.

Original Setup/Run/Pause/Setup reset used actual native DOM widgets; go-once widgets were clicked where present and the actual source go command was run once otherwise. Original extra numeric/mode scenarios use the native command center/compiler API; pointer gestures use the real canvas (the held native mouse event requires legacy which=1). Target Setup/1step/Run/Pause/reset/native actions/live parameters used the rendered controls, plus trusted Playwright pointer and keyboard gestures. Every model’s paused monitor remained stable after an additional150ms target/100ms original. Original reset re-randomizes; target Setup reconstructs explicit seed1. Source inspection complements these runs.

Machine-readable [original observations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/original-observations.json), [target observations and loaded chunk SHA markers](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/target-observations.json), [source audit](selected-materials-source-audit.md), [public replay observations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/public-replays.jsonl) and [validation](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-validation.md) retain settings, reporters, versions, controls and executed checks. Source XML, Info and notices are archived under each exact selected experiment. No source/selection/research/global-ledger edits were made.

## Visual QA limits

The coordinator inspected every retained PNG. Immediate theme-switch captures were blank/partial for Sand mobile light; Interstitial, Heat and Crystallization desktop dark/mobile light. Those exact initial failures remain in Git. Independent full-canvas getImageData and later-frame captures show the model again; one-pixel readback was insufficient for Interstitial. These are capture workarounds, not renderer fixes. The four affected final visual-acceptance gates remain pending for parent/shared-renderer investigation. No shared UI file was changed. All observed target readbacks report no horizontal overflow at390px and no model runtime errors. The bounded final diagnostic snapshot contains Canvas2D readback performance warnings, no captured error/network failures; it is not an exhaustive browser-console audit.

Frontend-design and the freshly fetched Vercel Web Interface Guidelines informed QA. Duplicate setup/live fields were removed; avalanche histogram domain calculation was moved out of UI; profile editing was fixed and rechecked. Native controls/semantic labels/keyboard focus and drawing keyboard alternative use the existing shared shell. Formal accessibility compliance is not asserted.

## sandpile

Canonical path: `Sample Models/Chemistry & Physics/Sandpile`. Loaded original SHA-256 `652510bc00315490d7f7af08898296b4af80f84e1f73b9cf297cba70ffbee252`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Sandpile.nlogox.

Native setup uniform1 reports total10201 but monitor total-on-tick=0; target likewise shows Average0 after setup. Progress switches both to uniform3/center and completes five drops: native and public target replay total29808, last unique-site size10197, lifetime199; target monitor Average2.9221. This deterministic mechanism comparison is exact. Native and target pointer drop on uniform3/center both give total30200, size10201, lifetime101 at tick1 (target average2.9605). Native hover Explore preserves tick0,total30603 and selects the patch; target click/drag Explore preserves tick and pile and additionally restores RNG, documented host adaptation. Clear data and both setup actions work. Intermediate animation is replaced by completed avalanche highlighting; native100-tick histogram cadence is preserved in headless observation buffers after67ab6d2. Colors are a presentation palette, not a new sand rule.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 10201, 0, 10201, 1, 1]}, "progress": {"step": {"reporter": "(list ticks total)", "success": true, "value": [1, 10202]}, "paused": {"reporter": "(list ticks total)", "success": true, "value": [6, 10207]}, "stable": {"reporter": "(list ticks total)", "success": true, "value": [6, 10207]}, "progressed": {"reporter": "(list ticks total max [n] of patches length sizes length lifetimes last sizes last lifetimes)", "success": true, "value": [5, 29808, 3, 2, 2, 10197, 199]}, "errors": [], "commands": ["set drop-location \"center\" setup-uniform 3 repeat 5 [ go ]"]}, "extra": {"cleared": [5, 0, 0], "reset": [0, 0, 3]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Average": "0.0000", "Last avalanche size": "0", "Last avalanche lifetime": "0"}, "progress": {"Tick": "5", "Average": "2.9221", "Last avalanche size": "10197", "Last avalanche lifetime": "199"}, "extra": {"Tick": "5", "Average": "2.9221", "Last avalanche size": "0", "Last avalanche lifetime": "0"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-4zwrvg0s.js`; SHA-256 `a3442d421ac02922f1ac5ab1044d42d57f5877fe12fe8a23688163b1817bc269`; 9460bytes; embedded marker `experiments/sandpile/model.ts`. Build version `1793958883025`.

Final post-format confirmation at runtime commit a531a7d: chunk SHA-256 `44bdb9bbeede1888cf16ab1e87754e3787fda99079f9f005821861c1186c5ba1` (9474bytes). Final [setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-final-setup.png) and [progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-final-progress.png) PNGs were captured and inspected again. Earlier theme/action captures retain their earlier hash above; they are not relabeled.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sandpile-target-mobileLight.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## ising

Canonical path: `Sample Models/Chemistry & Physics/Ising`. Loaded original SHA-256 `41727ee27957e2c797362ed3387742bc1c2038eabf5e2fa54df8e1152185b8d2`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Ising.nlogox.

Native setup magnetization0.00350556 versus target0.0200; at10000 attempted flips native-0.01539399 versus target0.0251. Different random streams/activation draws explain distinct trajectories; these runs are not a distribution study. Both perform1000 sequential with-replacement attempts per Step, use wrapped four-neighbor signed energy and the zero-temperature uphill rejection rule. Original and target live temperature changes execute. Target initial spin probability50 and temperature2.27 match exact native widgets; earlier audit prose90/2 was corrected without altering the explicitly parameterized examples. No natural stop exists.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 0.0035055631763450694, 23, 6561, -1, 1]}, "progress": {"step": {"success": true, "value": [1000, 0.005639384240207285, 37, 6561, -1, 1]}, "paused": {"success": true, "value": [83000, 0.03215973174820912, 211, 6561, -1, 1]}, "stable": {"success": true, "value": [83000, 0.03215973174820912, 211, 6561, -1, 1]}, "progressed": {"success": true, "value": [10000, -0.01539399481786313, -101, 6561, -1, 1]}, "errors": []}, "extra": {"extra": {"success": true, "value": [11000, 1]}, "reset": {"success": true, "value": [0, -0.012040847431793934, -79, 6561, -1, 1]}, "commands": ["go", "repeat 10 [ go ]", "set temperature 0 ask patches [set spin 1] set sum-of-spins count patches go"], "actions": ["click setup", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Attempted flips": "0", "Magnetization": "0.0200"}, "progress": {"Attempted flips": "10000", "Magnetization": "0.0251"}, "extra": {"Attempted flips": "11000", "Magnetization": "0.0206"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-fx5zyqrw.js`; SHA-256 `4ddcde1b934550a147825d82f19ac0af67c4814411d757d9c0bb985bc6ef7374`; 4894bytes; embedded marker `experiments/ising/model.ts`. Build version `1793958883025`.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-target-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/ising-target-mobileLight.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## sand

Canonical path: `Sample Models/Chemistry & Physics/Sand`. Loaded original SHA-256 `7db053940a922d00b19dc6132a68e1eb7d53e0ec0e0dcd9d77d9ce0342db0e4a`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Sand.nlogox.

Both initialize zero sand and reach51 occupied sand sites at tick50 with native defaults: three spouts,spacing3,release100. Native floor count648. Dump at density20 adds sand without ticking: native1102 versus target1125 sites in these runs; stochastic counts are qualified. Target UI dump density change and action work. The two-phase old-color/next-color barrier and collision coalescence are headless-tested; grain conservation is deliberately not claimed. Horizontal wrapping and hard vertical floor match. Native Info says density25 while served widget default is10. Immediate mobile-light capture lost grains/spouts while the monitor remained51; separate readback image restores the capture, not the renderer acceptance gate.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 0, 648, 3]}, "progress": {"step": {"success": true, "value": [1, 3, 648, 3]}, "paused": {"success": true, "value": [5, 6, 648, 3]}, "stable": {"success": true, "value": [5, 6, 648, 3]}, "progressed": {"success": true, "value": [50, 51, 648, 3]}, "errors": []}, "extra": {"extra": {"success": true, "value": [50, 1102]}, "reset": {"success": true, "value": [0, 0, 648, 3]}, "commands": ["go", "repeat 50 [ go ]", "set density 20 dump-sand"], "actions": ["click setup", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Sand sites": "0"}, "progress": {"Tick": "50", "Sand sites": "51"}, "extra": {"Tick": "50", "Sand sites": "1125"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-qefn7rts.js`; SHA-256 `246069505578a8fd0f71f1991be6e41d269f5d40f6f4baba0f691aa2da4539b4`; 6042bytes; embedded marker `experiments/sand/model.ts`. Build version `1793958883025`.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-target-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/sand-target-mobileLight-readback.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## solid-diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Solid Diffusion`. Loaded original SHA-256 `a7c59f59babb00427e4343e98a0ce786bdb755af23c0492551798d9fc661f4c3`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Solid%20Diffusion.nlogox.

Native setup1190 atoms (595 green,595 blue) and35 vacancies; after20 ticks those counts remain, while the source diffusion-distance-squared reporter is9. Target shows35 vacancies and distance-squared4 at20, with mixed species near the seam; different vacancy/atom choice sequences are expected. Public tests preserve canonical atom ids, species, exclusion and vacancy count through100 steps. Native procedure snapshots vacancies once and moves agents immediately in random order; target composes public Grid.agentsAt and Agent.move. Plot means extreme species separation squared, not tracer MSD. Square native atom glyphs are rendered as circles; the domain sites and species are unchanged. No native live parameters/stop exist; target adds explicit dimensions and seed.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 1190, 595, 595, 35, 4]}, "progress": {"step": {"success": true, "value": [1, 1190, 595, 595, 35, 0]}, "paused": {"success": true, "value": [5, 1190, 595, 595, 35, 4]}, "stable": {"success": true, "value": [5, 1190, 595, 595, 35, 4]}, "progressed": {"success": true, "value": [20, 1190, 595, 595, 35, 9]}, "errors": []}, "extra": {"extra": null, "reset": {"success": true, "value": [0, 1190, 595, 595, 35, 4]}, "commands": ["repeat 20 [ go ]"], "actions": ["click setup", "click go-once", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Vacancies": "35", "Max diffusion distance squared": "4"}, "progress": {"Tick": "20", "Vacancies": "35", "Max diffusion distance squared": "4"}, "extra": {"Tick": "20", "Vacancies": "35", "Max diffusion distance squared": "4"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-f76xjzv2.js`; SHA-256 `59c9784073109710e21b00c2b4879d08208c71b7728d130e13425616eda0b3f6`; 6122bytes; embedded marker `experiments/solid-diffusion/model.ts`. Build version `1793958883025`.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-target-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/solid-diffusion-target-mobileLight.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## interstitial-diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Interstitial Diffusion`. Loaded original SHA-256 `7526195f87a112e3568840bbc543ecfde2e52d6e186c6a1382fa8fd597a8ae55`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Interstitial%20Diffusion.nlogox.

Native first setup1803 diffusing atoms/8040 lattice markers; first run preserves1803 through tick5. Its separate reset/progress capture has1742 atoms at15; reset re-randomizes the original. Target seed1 repeats1757 atoms at setup and15. Current/initial/tick15 profiles are distinct buffers; x coordinates are translated from0..40 to-20..20 and native y-200..0 to-100..100. Native draw mode/pointer updates column20 to concentration0.82 and count1803→1967 at tick0; lattice toggle hides8040 markers. Target actual pointer changes1757→1909 at tick0, then ArrowRight/Space→2061 at tick0. Initial target drawing lacked cells in the spatial view;9155cd5 corrected the projection to canonical Grid cells and added its visible profile trace. Final screenshots and chunk715da1de… follow that correction. Target maxTicks15 disables Run/Step at15; native preflight at15 does not reapply reservoirs. Both constant surfaces and closed exclusion are separately tested. Native graph-point/axes/lattice agents are presentation projections in target, not a second physics population. Immediate theme capture failure remains a renderer/capture gate despite later readback images.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 1803, 8040, 0.2187841281397889, 159, 0]}, "progress": {"step": {"success": true, "value": [1, 1803, 8040, 0.2187841281397889, 164, 0]}, "paused": {"success": true, "value": [5, 1803, 8040, 0.21878412813978884, 157, 0]}, "stable": {"success": true, "value": [5, 1803, 8040, 0.2187841281397889, 157, 0]}, "progressed": {"success": true, "value": [15, 1742, 8040, 0.21138211382113825, 163, 0]}, "errors": []}, "extra": {"extra": {"success": true, "value": [15, 163, 0]}, "reset": {"success": true, "value": [0, 1778, 8040, 0.21575051571411238, 201, 0]}, "commands": ["go", "repeat 15 [ go ]", "set constant-left-surface? true set left-surface-concentration 1 set constant-right-surface? true set right-surface-concentration 0 set max-ticks ticks simulate"], "actions": ["click setup", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Diffusing atoms": "1757"}, "progress": {"Tick": "15", "Diffusing atoms": "1757"}, "extra": {"Tick": "15", "Diffusing atoms": "1757"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-nrrhy6nt.js`; SHA-256 `715da1de95a97fbe292b97b3daac2e6d9da897c5dbf019093421d5c9fff8f32f`; 12202bytes; embedded marker `experiments/interstitial-diffusion/model.ts`. Build version `1793959355695`.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-target-final-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-target-final-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-target-final-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-target-final-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/interstitial-diffusion-target-final-mobileLight.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## heat-diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Heat Diffusion`. Loaded original SHA-256 `28a9a04467718a26543bbe459500f57eb65c20c914733f6e19028ca68e97f090`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Heat%20Diffusion.nlogox.

Native setup plateSize15,center44,left1,corner50,d=0.10413111158903932. At15 center43.999999995832965; public target replay43.99999999395611,left1,corner50, with identical d. Random sequential order makes the tiny center difference expected, not a failed simultaneous-diffusion conservation test. The public deterministic single-patch fixture verifies the exact equation and immediate old-temperature write. Both Update Alpha wood yields alpha0.00128,d≈0.00904569888; live left edge80 clamps on next step. Target displays the native legend as a static color overlay and preserves its initial temperature-only write; it omits the legend in small host fixture worlds without the native coordinates. The source material other dialog is replaced by keeping the explicit alpha value. No native plots or stop are invented. Immediate desktop-dark/mobile-light screenshots lost the plate; separate readback captures are not renderer fixes.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 15, 0.10413111158903932, 44, 1, 50]}, "progress": {"step": {"success": true, "value": [1, 15, 0.10413111158903932, 44, 1, 50]}, "paused": {"success": true, "value": [5, 15, 0.10413111158903932, 44, 1, 50]}, "stable": {"success": true, "value": [5, 15, 0.10413111158903932, 44, 1, 50]}, "progressed": {"success": true, "value": [15, 15, 0.10413111158903932, 43.999999995832965, 1, 50]}, "errors": []}, "extra": {"extra": {"success": true, "value": [16, 0.00128, 0.00904569888195993, 80]}, "reset": {"success": true, "value": [0, 15, 0.00904569888195993, 44, 80, 50]}, "commands": ["repeat 15 [ go ]", "set material-type \"wood\" update-alpha set left-temp 80 go"], "actions": ["click Setup", "click Go Once", "click Go", "click Go", "click Setup", "click Setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Heat diffusivity": "0.104131"}, "progress": {"Tick": "15", "Heat diffusivity": "0.104131"}, "extra": {"Tick": "16", "Heat diffusivity": "0.009046"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-1qg2akd1.js`; SHA-256 `523edca46bed59cacdc359081570c703951424d4643dd59f896f1c55192004bb`; 7874bytes; embedded marker `experiments/heat-diffusion/model.ts`. Build version `1793958883025`.

Final post-format confirmation at runtime commit a531a7d: chunk SHA-256 `16c21a7ab19c43ca7773c810879a161384a203d3cac7f7f07505658671eebaeb` (8480bytes). Final [setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-final-setup.png) and [progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-final-progress.png) PNGs were captured and inspected again. Earlier theme/action captures retain their earlier hash above; they are not relabeled.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-desktopDark-readback.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/heat-diffusion-target-mobileLight-readback.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## crystallization-basic

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Crystallization/Crystallization Basic`. Loaded original SHA-256 `2fca2bd7824f49a01a657ccfbdb1364930de54de3e7decab2df9575c8f898b89`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Crystallization/Crystallization%20Basic.nlogox.

Both native and target setup961 atoms at1550. At30 native mean942.6015679876998/frozen145 versus target942.616/frozen145; source random sequential cooling and separate color/rotation barriers are preserved. Both observed runs stop at190; native mean292.8328889/max546.3075762/frozen701 versus targetmean292.764/frozen702. Same stop tick in these samples is not cross-RNG identity. Native T glyph becomes an oriented triangle, preserving heading and temperature. Crucial counter distinction: seven colors imply tempRange1000/6; a single exposed atom cools to390 but source num-frozen=0 because index0 does not meet index<0. The actual native browser fixture confirms [tick1,count1,mean390,frozen0,range166.6666667,temp390,color8.9]. The original frozen example04 incorrectly asserted1. The user subsequently authorized the sole correction to0;08d38c6 applied/refroze it, and all five scripts now pass. See selected-materials-example-refreeze.md; native/target runtime behavior did not change. Histogram toggle and terminal disabling work. Immediate theme captures lost atoms; readbacks do not clear that visual gate.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 961, 1550, 0, 1550, 1550]}, "progress": {"step": {"success": true, "value": [1, 961, 1477.8407799969793, 0, 771.31665, 1550]}, "paused": {"success": true, "value": [6, 961, 1297.887130469236, 5, 262.94154743718775, 1549.9999990926176]}, "stable": {"success": true, "value": [6, 961, 1297.887130469236, 5, 262.94154743718775, 1549.9999990926176]}, "progressed": {"success": true, "value": [30, 961, 942.6015679876998, 145, 133.3873820534953, 1535.7002102178285]}, "errors": []}, "extra": {"extra": {"success": true, "value": [190, 292.83288889694563, 546.3075761731113, 701]}, "reset": {"success": true, "value": [0, 961, 1550, 0, 1550, 1550]}, "commands": ["repeat 30 [ go ]", "repeat 300 [go]"], "actions": ["click setup", "click go once", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Average metal temperature": "1550.000", "Source frozen count": "0"}, "progress": {"Tick": "30", "Average metal temperature": "942.616", "Source frozen count": "145"}, "extra": {"Tick": "190", "Average metal temperature": "292.764", "Source frozen count": "702"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-5strcw58.js`; SHA-256 `7bf6e3f73e3c712cbb3ef4b4d90217b55695690f56d1fe4bf1cdb173cdaecdde`; 7714bytes; embedded marker `experiments/crystallization-basic/model.ts`. Build version `1793958883025`.

Final post-format confirmation at runtime commit a531a7d: chunk SHA-256 `ecc24f8790537bb897e64fcc581a17b1177ed84478e0beafac3f5171215af5b2` (8498bytes). Final [setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-final-setup.png) and [progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-final-progress.png) PNGs were captured and inspected again. Earlier theme/action captures retain their earlier hash above; they are not relabeled.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-desktopDark-readback.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-target-mobileLight-readback.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## dla

Canonical path: `Sample Models/Chemistry & Physics/Diffusion Limited Aggregation/DLA`. Loaded original SHA-256 `a9a425d1e2ddda41985a1132b99e8a7a1789e044af54b43c45ac9fec4622d7c0`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Diffusion%20Limited%20Aggregation/DLA.nlogox.

Both native/target setup radius0,zero walkers,one green seed; first go reaches tick1 without births. At100 native97 versus target98 walkers,radius0: default whole-world walkers have not yet grown the seed in these samples. Native and target switch whole-world false and wiggle0, reaching radius15 at130; distinct clusters/counts remain stochastic. Additional paired terminal screenshots show native and target stopping at tick412,radius≈82: native84 walkers/8024 green patches versus target89 walkers/public replay7520 patches. Another native run had691 deposits at130 rather than700. No trajectory equivalence is claimed. Target disables all stepping controls at terminal; extra native go preserves412. Domain radius is continuous walker distance, not patch-center radius. Native arrow walkers are circles in the shared target renderer; orientation stays in the public observation/inspector.

Original executed reporter state:

```json
{"setup": {"success": true, "value": [0, 0, 0, 1]}, "progress": {"step": {"success": true, "value": [1, 0, 0, 1]}, "paused": {"success": true, "value": [5, 0, 4, 1]}, "stable": {"success": true, "value": [5, 0, 4, 1]}, "progressed": {"success": true, "value": [100, 0, 97, 1]}, "errors": []}, "extra": {"extra": {"success": true, "value": [130, 15.000000000000037, 0, 700]}, "reset": {"success": true, "value": [0, 0, 0, 1]}, "commands": ["go", "repeat 100 [ go ]", "set use-whole-world? false set wiggle-angle 0 repeat 30 [go]"], "actions": ["click setup", "click go", "click go", "click setup", "click setup"]}}
```

Target rendered monitor state:

```json
{"setup": {"Tick": "0", "Radius": "0.000", "Walkers": "0"}, "progress": {"Tick": "100", "Radius": "0.000", "Walkers": "98"}, "extra": {"Tick": "130", "Radius": "15.000", "Walkers": "0"}}
```

Actual loaded model chunk: `http://localhost:3111/chunks/ui-ep14hqjx.js`; SHA-256 `73f949b66a2112ecb6cb60435c55b96ca1112b63c46542da680049205f2af8c9`; 5486bytes; embedded marker `experiments/dla/model.ts`. Build version `1793958883025`.

Final post-format confirmation at runtime commit a531a7d: chunk SHA-256 `b3ce496dc531fd2e882f99b7c8d25d298a561ed5ba83a48c71d47fda14542501` (5908bytes). Final [setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-final-setup.png) and [progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-final-progress.png) PNGs were captured and inspected again. Earlier theme/action captures retain their earlier hash above; they are not relabeled.

Paired setup/progress PNGs: [original setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-original-setup.png), [original progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-original-progress.png), [target setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-setup.png), [target progress](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-progress.png).

Target theme/viewport PNGs: [desktopDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-desktopDark.png), [mobileDark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-mobileDark.png), [mobileLight](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-mobileLight.png).

Independent approval: pending, user-supplied Argon/high quota blocker8194e842; no retry/substitution. Browser observations do not constitute independent approval.

## Additional exact mechanism evidence

[Native crystallization counter fixture](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-original-counter-fixture.png) supports the user-authorized one-line example correction applied and refrozen at08d38c6. [Native DLA terminal](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-original-terminal.png) and [target DLA terminal](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/dla-target-terminal.png) show completed aggregation and the terminal rule.

## Final bundle reconciliation

[Final bundle confirmations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/final-bundle-confirmations.json) reloaded every model after the readability-only commit a531a7d and clicked Setup/1step. Ising, Sand, Solid and final Interstitial retain the exact captured chunk bytes. Sandpile, Heat, Crystallization and DLA have different bundle hashes after formatting; each received additional inspected final setup/progress captures and retains earlier theme/action hashes separately. No old image was relabeled with a new bundle hash. The final target Interstitial mobile-light capture required full readback plus later animation frames; the initial failure remains evidence and the visual gate stays pending.
