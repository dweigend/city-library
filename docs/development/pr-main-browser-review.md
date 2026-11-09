# Post-main integration browser review

## Scope and revision

Fresh browser acceptance after normal merge `b5977bb`, against source revision `1e978780f6010e40ef11df9b79d0fc3c92287f31`. All 485 captured files under `models/`, `ui/`, and `src/` remained byte-identical through the final captures; subsequent commits were documentation-only. The source fingerprint is `4ed0f53424ae3993ccb53b68f2f01ee0d4068086c1ef963efc3bc3b28996ffa5`.

This review covers the migrated `models/` catalog and the single Svelte implementation. `ui/index.ts` and compatibility `ui/svelte/index.ts` expose the same implementation; replaying both imports does not represent two independent hosts. Earlier experiment-path approvals and the historical 92-image set are not attributed to this merged source.

## Executed checks

- All 146 catalog models: actual catalog selection, Setup, one bounded step, rendered projections, and switch/disposal. All passed.
- All 82 migrated live-control entries: descriptor-valid changes through actual public controls, with resulting observable control/state checks. All passed.
- Fifteen unchanged exported public browser fixture scripts, each invoked through both public imports: 30 successful runs. These include the ten new controller/collection examples and five previous authoring, validation, picking, and disposal fixtures. Assertions were not weakened.
- All eleven DES models: Setup, valid control change, explicit step, timed Run/Pause, stable paused observations, available domain actions, keyboard selection, switching, and four alternating desktop/narrow resizes per model. All passed.
- Held-frame probes through both imports: two resizes coalesced to one pending frame, the latest Generation 2 projection was retained, disposal cancelled the frame, and a forced late callback changed neither canvas dimensions nor draw count. A real Elevator-to-Life catalog switch independently cancelled the pending frame and detached the old canvas.
- Traffic: actual drawing selection, Watch, Follow, Reset perspective, and explicit step. Viewing actions preserved tick 0; the explicit step reached tick 1.
- Wolf: grass-regrowth control changed from disabled to enabled with the appropriate model mode, then accepted a valid live change. PSO and Vision pointer/keyboard selection bypassed presentation-only overlays and retained actual model identities.
- Robby exposed its last strategy page, rows 201–243 of 243. Taxi accepted probability 0.31 with native validity true. Heat retained its scientific grid presentation; recycling rendered its network and layout/fit actions.

Window-error, unhandled-rejection, and console instrumentation recorded no errors or warnings in the completed catalog, fixture, DES, lifecycle, and targeted interaction runs. This is a scoped observation, not a universal error-free claim. Initial QA locator updates for the renamed model chooser and its asynchronous mounting were harness corrections, not product defects.

## Images and design review

The new manifest contains 64 accepted-scope captures: eleven DES models at desktop/narrow in light/dark (44), plus retained office capacity, Robby pagination, Taxi controls, Heat grid, and recycling network in those four variants (20). Taxi narrow framing was corrected to show the actual AM/MD controls; superseded result-only captures remain recorded separately in the manifest. No product styling or validation was suppressed.

Desktop CSS viewport is 1366 × 768; the screenshot service outputs 1280 × 720 PNGs. Narrow CSS viewport is 390 × 844 with 780 × 1688 PNGs. Native device pixel ratio is 2. Light/dark uses the real browser appearance override. Narrow scene captures deliberately scroll the result into view; control-specific captures show the requested control group. Scroll positions and viewport metadata are recorded. No DPR 1 device acceptance is claimed.

The [independent image review](pr-main-image-review.md) approved all 64 final originals, separately from these interaction results. Every original has a byte-identical local copy and SHA-256. Final manifest SHA-256: `13699de3a11080ebc02f66d3ded511944c63adb91a957edaf1dc56146420ef02`.

Frontend/shadcn design principles and the latest Vercel Web Interface Guidelines fetched on 2026-11-09 informed the review: readable labels, native validity, keyboard/focus paths, plain-text canvas descriptions, responsive framing, and bounded visual complexity. These checks do not constitute exhaustive accessibility certification.

## Evidence and tooling limits

Raw evidence is deliberately local and ignored under `.local/development-archive/pr-main-integration/browser/`: `catalog-smoke.json`, `current-live-controls.json`, `public-fixtures.json`, `des-flows-and-lifecycle.json`, `manual-and-final-console.json`, `source-fingerprint.json`, `manifest.json`, and screenshot copies. These artifacts are not shipped as versioned product files.

Configured Playwright MCP was attempted again. Chromium failed before launch because `/usr/local/libexec/codex-playwright/chrome_sandbox` lacked the required root ownership/mode 4755. No sandbox settings were changed. All reported interactions and images were obtained in real T3 Chrome against `http://localhost:3231/`, using isolated owned tabs after preview status inspection. Both owned tabs were closed after verification; the server was left running. No human tab was reused.

No source changes or broad shell verification were performed by this browser reviewer. The coordinator's merged-source test/build/consumer results remain separate evidence. No post-merge implementation defect was found in the exercised browser scope; this review makes no scientific-calibration claim.
