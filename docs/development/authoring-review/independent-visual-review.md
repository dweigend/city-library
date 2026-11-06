# Independent visual review

Date: 6 November 2026. Read-only review of the final authoring fixture and catalog-rich-flow screenshot manifests available at review time. The reviewer did not implement the controls, charts, catalog migration or browser runners. No runtime files, frozen examples or commits were changed.

## Scope and outcome

**Visual approval is withheld pending the dark network-label correction and supplemental Tijuana canvas coverage described below.** No bar-geometry, control-overlap or error-message visibility blocker was found in the 24 authoring fixture screenshots. This is a scoped visual assessment, not scientific acceptance, approval of all 125 catalog entries, or a complete accessibility certification.

All **49 screenshots** listed below were actually opened individually with the image tool: 24 authoring fixture captures and 25 rich-flow captures across Voting, Wealth Distribution, Taxi Cabs, Tijuana, Traffic Grid and Preferential Attachment. The fixtures cover legacy and Svelte hosts, zero/nonzero signed grouped bars and formatter failures. Both light/dark and actual 1366 × 768 / 390 × 844 PNGs were inspected. Screenshot files were not resized, composited or edited.

The actual browser interactions and successful assertions are evidence from the separate operators and manifests, not actions independently re-executed by this reviewer. In particular, Run/Pause, setup/live changes, restart and disposal results must retain their operator attribution.

## Findings and remaining tasks

### V1 — P1: dark network labels are difficult to read

In `city-library-catalog-authoring-final-preferential-attachment-1366-dark-overview.png` and its 390-wide counterpart, node labels are dark gray against the dark network background. The surrounding UI text and chart labels are substantially brighter. The light-theme captures are readable. This is a confirmed visual contrast problem in the captured dark state; its runtime cause has not been established.

Relevant source: `ui/views/network.ts:21–40` derives label color from the renderer muted token; `:61–70` refreshes the theme on media changes. `ui/svelte/views/theme.ts` resolves the host tokens. Check both a fresh dark load and light/dark switching, confirm the actual resolved node-label color/background, correct the shared token refresh or styling without changing scientific node colors, and recapture both sizes/themes. Require a new independent visual inspection of the corrected captures.

### V2 — P2: chart annotation text becomes very small at narrow width

The 390-wide grouped and grouped-nonzero fixture captures in both hosts show very small category, unit and tick text, particularly in the legacy host. The chart remains geometrically contained and its accessible text is supplied, but reading the visible axes at normal size is difficult. The fixed SVG viewBox in `ui/views/chart.ts:89` scales the annotation text along with geometry; text creation is at `:95–102` and category/axis placement at `:116–128`.

Keep chart annotation legibility when the chart is narrow using shared renderer/layout behavior; do not alter domain values or add model-specific typography. Recheck long category/unit labels in both themes and ensure grouped bars and accessible text remain correct. This is a concrete readability follow-up; it is not evidence of wrong chart values or a general WCAG certification result.

### V3 — coverage gate: Tijuana spatial output needs supplemental captures

The four Tijuana overview captures correctly begin at scrollY 0, but a long selected-object inspector pushes the canvas almost entirely below the desktop fold and completely below the narrow fold. These images verify the monitor/inspector portion, not the spatial result. Capture the canvas in both sizes/themes, either in an unselected overview or as an explicitly identified scrolled spatial view; retain the existing selected-state evidence. No production change is necessary merely to satisfy capture coverage.

## Positive visual evidence

- Signed categorical bars are visibly side by side, with positive and negative values on opposite sides of the zero baseline; zero values do not create false bars.
- Formatter failures remain visible in both hosts and themes, and Run/step controls visibly disable before initialization. Screenshots alone do not prove the recovery lifecycle.
- The rendered controls and result areas fit the inspected widths without visible horizontal clipping. This agrees with the reported width metrics but does not replace the operator overflow assertions.
- Taxi has a coherent Svelte presentation in the rich captures. The supplemental narrow controls image shows reachable AM inputs and the transition to MD without overlapping labels or inputs. It does not show all 45 fields simultaneously; functional group/count evidence remains in the operator checks.
- Voting and Traffic preserve readable scientific colors in both themes; Wealth renders the explicit Low/Middle/High categorical bar and numeric Gini output on desktop.

## Review criteria and limits

Read AGENTS.md, docs/DESIGN.md, the global frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines skills. Retrieved the current Vercel Web Interface Guidelines from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` for this review. Applied screenshot-observable checks for hierarchy, controls, text, themes, responsive containment, empty/error display and scientific visualization. Keyboard focus, accessible names/relationships, motion preferences, contrast ratios, network errors and lifecycle correctness require separate runtime/DOM evidence; no full rule-by-rule compliance is claimed from screenshots.

Pre-main work still includes final independent implementation feedback, unresolved screenshot findings/coverage, the stated public-procedure contract decision and model-ledger/scientific acceptance reconciliation. A passing authoring slice does not close the fixed 200-model scope.

## Inspected image inventory

| Source | Actual PNG | Theme/state | Path | SHA-256 |
| --- | --- | --- | --- | --- |
| Authoring fixtures | 1366 × 768 | light / grouped | `/tmp/city-library-authoring-acceptance-legacy-grouped-1366-light.png` | `7e44edbf345b83ca9a215921bcc0505b42d8243e5c3ae3ecb30527a658a02534` |
| Authoring fixtures | 1366 × 768 | dark / grouped | `/tmp/city-library-authoring-acceptance-legacy-grouped-1366-dark.png` | `ddb7670dda2e4dbdd930b095e0eec7a4257dcd94dec2b8da75367cf8f22da559` |
| Authoring fixtures | 390 × 844 | light / grouped | `/tmp/city-library-authoring-acceptance-legacy-grouped-390-light.png` | `e881eed800ee8711b0865e478e69957f431e427275488bd78f1dee0010b87303` |
| Authoring fixtures | 390 × 844 | dark / grouped | `/tmp/city-library-authoring-acceptance-legacy-grouped-390-dark.png` | `6d4b8b01bc634c91b701d9030ce8de5c7721c347e8606eef1cd733bb4cdd3ef9` |
| Authoring fixtures | 1366 × 768 | light / grouped-nonzero | `/tmp/city-library-authoring-acceptance-legacy-grouped-nonzero-1366-light.png` | `c7f7b389603601b5022da51fef9f2ba7aeb03ab1ee1e28132e22a077d16a0c79` |
| Authoring fixtures | 1366 × 768 | dark / grouped-nonzero | `/tmp/city-library-authoring-acceptance-legacy-grouped-nonzero-1366-dark.png` | `531da40b90994ae0b3681370f49ab72fca8c39c86dbd05196cf32f284786eb25` |
| Authoring fixtures | 390 × 844 | light / grouped-nonzero | `/tmp/city-library-authoring-acceptance-legacy-grouped-nonzero-390-light.png` | `2c693c22029dc0d98772bdf9135ad0f799cf6b1ab34f9f6d6cbbd6e51c4035dd` |
| Authoring fixtures | 390 × 844 | dark / grouped-nonzero | `/tmp/city-library-authoring-acceptance-legacy-grouped-nonzero-390-dark.png` | `9b7830d63bb91ed7d607bec2457b6247097fc271b6bb7aeafe0c623230d1cb4e` |
| Authoring fixtures | 1366 × 768 | light / format-error | `/tmp/city-library-authoring-acceptance-legacy-format-error-1366-light.png` | `7f120861b0954df4dca188f3131a87f725b63dea0de3f04058a2539e3a30d0ac` |
| Authoring fixtures | 1366 × 768 | dark / format-error | `/tmp/city-library-authoring-acceptance-legacy-format-error-1366-dark.png` | `06444d5f0810c43be5880d02b769e05e859370e2f48b7c84772ffc792585cc48` |
| Authoring fixtures | 390 × 844 | light / format-error | `/tmp/city-library-authoring-acceptance-legacy-format-error-390-light.png` | `0b009ab38717aa27ce9eedb8d143af0a376467a10d84d92d14d3fe185b180d06` |
| Authoring fixtures | 390 × 844 | dark / format-error | `/tmp/city-library-authoring-acceptance-legacy-format-error-390-dark.png` | `a84eb1a971037a8ef8de8009a5fd697cada5759ed978e3288ee6c0dba60c5baf` |
| Authoring fixtures | 1366 × 768 | light / grouped | `/tmp/city-library-authoring-acceptance-svelte-grouped-1366-light.png` | `36104f8d7245117a8de59bb45adb050283af6c81916f49a2683c57225024f559` |
| Authoring fixtures | 1366 × 768 | dark / grouped | `/tmp/city-library-authoring-acceptance-svelte-grouped-1366-dark.png` | `555864a5d015c77149eb33ea6f127b457b241974b93b605ffcdad3e27d93cb73` |
| Authoring fixtures | 390 × 844 | light / grouped | `/tmp/city-library-authoring-acceptance-svelte-grouped-390-light.png` | `2207d8b4ad34e9106216e3d0f3e8a729725ba3336c0c050af94c1bc8569ec61e` |
| Authoring fixtures | 390 × 844 | dark / grouped | `/tmp/city-library-authoring-acceptance-svelte-grouped-390-dark.png` | `ab14ff745aaab641e877f3a1249aba7e34a8b2456be5063ffd976265795de215` |
| Authoring fixtures | 1366 × 768 | light / grouped-nonzero | `/tmp/city-library-authoring-acceptance-svelte-grouped-nonzero-1366-light.png` | `269e35f866583afb81a53eff367072ff09c97401ed28af2c3e54d452e899554e` |
| Authoring fixtures | 1366 × 768 | dark / grouped-nonzero | `/tmp/city-library-authoring-acceptance-svelte-grouped-nonzero-1366-dark.png` | `4f9fbb222eaef519f6a8a702c423e9d051bb30e517a289bd1a319fd4d3ae9fbc` |
| Authoring fixtures | 390 × 844 | light / grouped-nonzero | `/tmp/city-library-authoring-acceptance-svelte-grouped-nonzero-390-light.png` | `466074e161ce63f598380fad207ae3dd569afa675a59ca816d5961f7ae286de8` |
| Authoring fixtures | 390 × 844 | dark / grouped-nonzero | `/tmp/city-library-authoring-acceptance-svelte-grouped-nonzero-390-dark.png` | `b279135724582316fd2dee02b2657fc5b7e96912cc264c12d75615890a278ae7` |
| Authoring fixtures | 1366 × 768 | light / format-error | `/tmp/city-library-authoring-acceptance-svelte-format-error-1366-light.png` | `9b42af4e49bd11cd0765e07839b649ec4216644790a66433e14ba08342cb9861` |
| Authoring fixtures | 1366 × 768 | dark / format-error | `/tmp/city-library-authoring-acceptance-svelte-format-error-1366-dark.png` | `cd0d2e2bb36660dfd70cac5c9449c2203d6638e9e85fdfde05c276bf8e00bb44` |
| Authoring fixtures | 390 × 844 | light / format-error | `/tmp/city-library-authoring-acceptance-svelte-format-error-390-light.png` | `e7e1513a19d7e36707a156f9995ed9ad6d9fa3b6dc9f0a4e3a7c3a4db14b79fc` |
| Authoring fixtures | 390 × 844 | dark / format-error | `/tmp/city-library-authoring-acceptance-svelte-format-error-390-dark.png` | `4e26f48f7f2e5aec0baf58c4bb02e987d8395affc7a71785ea007da17d09df5f` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-voting-1366-light-overview.png` | `f627b5de415e2a69bf2f6d29ff1647ab77eadb408f7db3b3c008045dac63725f` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-voting-1366-dark-overview.png` | `d5a4a48a6469e73186aa9c570d6a0caee015f17cda5be8e828841706fb146de2` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-voting-390-light-overview.png` | `64634396898bf2cc3572e0a4a52439de06873a8639385dbae8bfe9c72a7cbb7b` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-voting-390-dark-overview.png` | `27c7a49044f82175bd0129afd88a15f0f683a2c143edfecfaa79eef7f7a9a4c2` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-wealth-distribution-1366-light-overview.png` | `b72662a215795a415cce83e175dfdcc90d31689eee741db8e881f189e1027451` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-wealth-distribution-1366-dark-overview.png` | `6f1a22341467327021064a29d408cae077240b4717b3e27ac526a10abfaad003` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-wealth-distribution-390-light-overview.png` | `f16d770632dd07e8b100fd28ae7c505293141309d92e0dae6d95f327559ce1e6` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-wealth-distribution-390-dark-overview.png` | `b344c4f9d5c741ccf5af91738fb7f649c5928b402f824c8da71a38bb6a107081` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-taxi-cabs-1366-light-overview.png` | `6bc21fc005fdb34d5b95acf09800bb140e16bed6c8ffebb02df74a98829aa266` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-taxi-cabs-1366-dark-overview.png` | `b15200d9c08d28d2c123c49e46774dffa47d3f10295208565af4b4307d7be92a` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-taxi-cabs-390-light-overview.png` | `06370d7592c6b3fff48ff300eb6649a9dc9a420c47b819cbfd42a4ab90419238` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-taxi-cabs-390-dark-overview.png` | `3c5e4a8d24852f4275efdb05336e07d98e24738173ce491249d8f379d76e5c87` |
| Catalog rich flows | 390 × 844 | dark / reachable flat AM controls | `/tmp/city-library-catalog-authoring-final-taxi-cabs-390-dark-controls.png` | `6b9fd5df5b2ab2f1aab6f7bfd13342105d542bfde9f53effd552e8e6f7c29338` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-urban-suite-tijuana-bordertowns-1366-light-overview.png` | `9a4a1df8ff337bf715241561586859298dcb71890339c2149b61957afb95fae2` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-urban-suite-tijuana-bordertowns-1366-dark-overview.png` | `ab8949482cf34172a33e5a4efffac8aedfdd2370c09e9ea078d308caa88cc3b5` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-urban-suite-tijuana-bordertowns-390-light-overview.png` | `32e9acec1f232979407e5bbbdc68b71ffba1f743fdadc09e50b7aba79d2597d0` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-urban-suite-tijuana-bordertowns-390-dark-overview.png` | `85cda24acd52f0b10b44d10f5ea8aa9213e6dc16cd960810d43f5b102f2d2803` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-traffic-grid-1366-light-overview.png` | `03dbd5d1bfa8d86073f49909624134984b5b038d780c95e91a3b773922a4fa55` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-traffic-grid-1366-dark-overview.png` | `3dc661ea3c6a2bba76ca2a5f0401df2aae45aaef42d347e0ba3155525ae6d25d` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-traffic-grid-390-light-overview.png` | `acd49334e8ef8025c1a7d2c16f5df131daaa7b8bd0d68761971f46d0e77e3538` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-traffic-grid-390-dark-overview.png` | `10074ceaa7555dd238495c6bbd17a180d3050896e5daa805dd401432ef02aae9` |
| Catalog rich flows | 1366 × 768 | light / overview | `/tmp/city-library-catalog-authoring-final-preferential-attachment-1366-light-overview.png` | `feb9086b9903887ca42a794e977fc12cb2e6ef71160d302c1846981d63098b40` |
| Catalog rich flows | 1366 × 768 | dark / overview | `/tmp/city-library-catalog-authoring-final-preferential-attachment-1366-dark-overview.png` | `ee034ee3fcc3d399f116f1f4082931a8dffbb73b6beaa9dc94dee9c6dfad4957` |
| Catalog rich flows | 390 × 844 | light / overview | `/tmp/city-library-catalog-authoring-final-preferential-attachment-390-light-overview.png` | `26b39ed90c469ea64e5da773492bb683e9515ba65052da1dc1fcd107f1108879` |
| Catalog rich flows | 390 × 844 | dark / overview | `/tmp/city-library-catalog-authoring-final-preferential-attachment-390-dark-overview.png` | `bc6a4295d080838bba3df9b56dddeb41f1c3cca8c8887e5571948fa1fd2e3231` |
