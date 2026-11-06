# Independent production legacy visual review

Date: 2026-11-06. Evidence: `/tmp/city-library-production-legacy-authoring.json`, captured from the actual Bun Agent Lab at port 3112 with its production stylesheet. No runtime changes were made for this review.

## Verdict and method

**Scoped visual approval for the captured production legacy Taxi Cabs and Wealth Distribution states.** All 11 supplied PNGs were individually opened and inspected: eight overview captures at actual 1366 × 768 and 390 × 844, one narrow Taxi group detail, and two narrow Wealth chart details. Both light and dark overview themes were inspected for each model. No blocking clipping, overlap, label legibility, or chart layout finding was observed in these captures.

This is independent image inspection of another agent’s executed browser flows. The capture server had already stopped; this reviewer did not rerun the interactions. The review follows the project instructions and previously read frontend design and web-design-guidelines criteria. It provides production-style evidence that the unstyled legacy diagnostic fixtures in the [callback boundary review](callback-boundary-visual-review.md) could not provide. It does not replace that review’s separate Svelte error-state verdict or imply that legacy callback failures roll back partial rendering.

## Direct visual observations

- Taxi desktop separates labeled inputs and playback controls from the canvas. Tick 10, AM Peak, waiting passengers and income values are readable in both themes. At 390px, inputs and playback controls fit within the viewport, monitors wrap onto two columns, and the canvas follows them in normal document flow. Wrapped text does not cover values. Canvas continuation below the screenshot edge is normal vertical scrolling.
- The narrow dark Taxi group detail shows the AM legend, all nine demand controls with origin/destination/time labels, and the beginning of MD. Input labels, borders, values and spacing remain distinct, with no overlapping legend or cut-off input width. This image does not independently establish every group’s scroll reachability.
- Wealth desktop shows labeled setup/live fields, tick 10, people 250, total wealth 11900 and numeric Gini 0.363. Mobile places the same controls and monitors above the canvas without horizontal clipping. These are visible values, not scientific validation.
- Both narrow Wealth chart details show distinct Low, Middle and High labels, Wealth class and People axis titles, and a People legend. Following wealth-class lines and the Lorenz curve retain separate titles and legends. Chart labels are readable in both themes, without collisions between neighboring charts. Scientific palette choices were not modified; full color-vision accessibility is not established.
- Text, control borders and chart labels visibly distinguish themselves from light and dark backgrounds. This is a visual check, not a new numerical contrast measurement or full accessibility audit.

## Executed-flow evidence and limits

The operator manifest records successful setup, ten steps, live edit, seed draft and restart for both models. It records five Taxi groups with nine demand inputs each; all 45 were scrolled into view and edited at unchanged tick 10. Restart ended at seed 2 / tick 0 while retaining Taxi fare 1.5 and Wealth growth 5. Both cases record empty page-error, console-error, HTTP-failure and request-failure arrays. All eight overviews record scrollY 0 and scrollWidth equal to viewport width. These are operator-executed browser/DOM checks, distinct from this reviewer’s pixel observations.

The production stylesheet response is recorded as HTTP 200, SHA-256 `9b0b87714a47147b923822f8d18805146947c307cf894bfede229aad37045875`. The manifest records use of actual production CSS without fixture injection and cleanup of the owned capture server.

This verdict covers these two production legacy model presentations and supplied states. It does not approve all catalog entries, scientific trajectories, unseen error states, keyboard or screen-reader behavior, the fixed 200-model scope, or merging to main. Remaining source, integrated regression, ledger and independent review gates stay in PLAN. Preserve temporary artifacts if needed for durable release evidence.

## Exact inspected PNG inventory

Dimensions and SHA-256 below were independently read from the supplied files after opening them. Recorded hashes were compared where present in the manifest.

| Image | Actual dimensions | SHA-256 |
| --- | --- | --- |
| `/tmp/city-library-production-legacy-authoring-taxi-cabs-1366-light.png` | 1366 × 768 | `ad4b20083f869c1cf61bf4b5ea51cf7f81a0e11859829ba45c2eb6073c8f5077` |
| `/tmp/city-library-production-legacy-authoring-taxi-cabs-1366-dark.png` | 1366 × 768 | `6e9d4d56c95ac4bdeb5084402bbcfb89cd449d3064c2637be109692de156a888` |
| `/tmp/city-library-production-legacy-authoring-taxi-cabs-390-light.png` | 390 × 844 | `11ddba776a1529a1be8117ce8a3e30b6830768dd60908d24218791f1a2600e16` |
| `/tmp/city-library-production-legacy-authoring-taxi-cabs-390-dark.png` | 390 × 844 | `a97b7627c7708a82502a08b03fc31c31ade6f82a2dd045e9dadecad3b9cd14d1` |
| `/tmp/city-library-production-legacy-authoring-taxi-cabs-390-dark-groups.png` | 390 × 844 | `39c547942e8c7a7465772d28d14506564676600e98a3e4636c5c4c19142851dc` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-1366-light.png` | 1366 × 768 | `d6584c21a1530381fbcdd95c42ad8fc46d1306c63989ef6f6700f89414d16fc7` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-1366-dark.png` | 1366 × 768 | `c2bb1b5ad8dd3b56ce09e62cc2346294fda0f497025111eeb074027a67da9aed` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-390-light.png` | 390 × 844 | `9bd74ae7414b4dcaea7cd3376e502f315f780c1c535c344d1c2443fc37385799` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-390-dark.png` | 390 × 844 | `fc92cd62c7af992669332c338dda0a8f9ff75e89b4681bb13c543297c21ae04c` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-390-light-categories.png` | 390 × 844 | `fe5e43c47300eda4502e8d682a795789626707a8db8663390efc540f907578eb` |
| `/tmp/city-library-production-legacy-authoring-wealth-distribution-390-dark-categories.png` | 390 × 844 | `1255b6af0f1c102f8392bf9167656328ef855abc5025dc2772d285c229bd9505` |
