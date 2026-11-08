# Agent Lab browser and reference comparison

Status: browser checks and corrective retests completed. No remaining blocking finding in the exercised flows. No runtime code changed by this reviewer.

## Environment and method

Checked on 5 November 2026 using the shared T3 browser (real Chromium) against the Bun server at port 3101. Each check used the reviewer's own tab. Desktop CSS viewport: 1280 × 800. Mobile CSS viewport: 390 × 844; PNG dimensions may be doubled by device pixel ratio. Light and dark were actually emulated with `preview_set_appearance`, rather than simulated by injecting CSS.

Read frontend-design and web-design-guidelines. Fetched the current [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) before review. This is targeted product/browser QA, not a complete accessibility conformance audit.

Reference evidence is separately versioned in `experiments/reference-sources/browser-evidence.json` and its `evidence/` PNGs. Those NetLogo Web model files identify version 7.0.4; the pinned repository sources identify 7.1.0-alpha1. The prior source audit found matching procedure text and structurally matching widgets. Reference seeds were not fixed; target snapshots use seed 1. Screenshots compare mechanisms and presentation, not matching stochastic trajectories.

Reference correction: the original Wolf Sheep grass progressed reference screenshot retained a tick-0 HUD while its curve/populations had progressed; it is retained as historical evidence, not tick-20 HUD proof. A fresh capture using only native chooser/setup/show-energy/go/pause controls now supersedes it: `experiments/reference-sources/evidence/wolf-sheep-predation-grass-native-progress.png` visibly shows tick 268, 217 sheep, 50 wolves and grass/4 = 197, with go stopped and energy labels on. All rule/population parameters remained default. Its arbitrary later tick is a progressed-state reference, not a same-horizon numeric comparison to the target tick-20 image. PA/Voting/Wealth reference HUDs visibly show their stated 25/20/20 ticks.

## Default setup and progressed states

All four entries were discovered and loaded through the actual HTML catalog, with working lazy JavaScript chunks. Setup and progress screenshots were saved and visually inspected in `agent-lab-screenshots/`.

| Entry | Default setup observed | Progress observed | Screenshot pair |
| --- | --- | --- | --- |
| Preferential Attachment | Tick 0, 2 nodes, 1 edge | Tick 25, 27 nodes, 26 edges | `preferential-attachment-{setup,progress}.png` |
| Voting | 151 × 151; tick 0; blue 11,326, green 11,475 | Tick 20; blue 10,952, green 11,849; total remains 22,801 | `voting-{setup,progress}.png` |
| Wolf Sheep, basic | 51 × 51; tick 0; 100 sheep, 50 wolves | Tick 20; 161 sheep, 52 wolves | `wolf-sheep-predation-{setup,progress}.png` |
| Wolf Sheep, grass | 51 × 51; tick 0; 100 sheep, 50 wolves; grass/4 = 328 | Tick 20; 110 sheep, 48 wolves; grass/4 = 321 | `wolf-sheep-predation-grass-{setup,progress}.png` |
| Wealth Distribution | 51 × 51; tick 0; 250 people; wealth 8,027; Gini 0.278 | Tick 20; 250 people; wealth 13,334; Gini 0.444 | `wealth-distribution-{setup,progress}.png` |

The counts above are observations of these runs, not universal scientific predictions. Screenshots may be refreshed after a later semantic correction; such corrections must update the recorded values.

## Reference/target assessment

- Preferential Attachment: both show network growth and emerging hubs, node-count reporting and degree-distribution plots. The target uses a neutral renderer and explicit Fit/Layout actions; Node 1/2 startup framing was corrected to avoid excessively enlarged nodes and labels. Current-state bar distribution and log-coordinate scatter are available below the network.
- Voting: both transition from dense binary noise to contiguous blue/green regions after 20 ticks. Target cells remain square, colors and total cell count are explicit, and both running rules are independent controls. A separate 9 × 3 setup at mobile rendered a 358 × 119 CSS canvas (3:1 subject to pixel rounding), with 27 total cells; no square-world distortion.
- Wolf Sheep: both show continuous agents over green or green/brown patches and population curves including the source's grass/4 display scaling. Neutral circles/triangles replace the original animal artwork. An initial size-unit mismatch produced giant sprites; after a shared CSS-pixel-diameter contract and selector corrections, sheep/wolves are visible without concealing the field. The Labels checkbox displays energy values; keyboard arrow selection opens the inspector without changing tick 20.
- Wealth: both show a spatial resource landscape, wealth classes, current class distribution, class histories, Lorenz/equality and Gini. Target intentionally keeps population as an initial condition, as described by the port's deviation record. Current distribution and time-series plots are distinct.

## Interactions executed

- Setup and bounded stepping on all four entries and both Wolf Sheep modes.
- Run/Pause on Preferential Attachment, Voting, Wealth and Wolf Sheep: at least one scheduled update occurred, then the button returned to Run/aria-pressed=false. The exact tick depends on real elapsed browser time.
- PA Layout, Fit and keyboard-accessible node selector left tick 25 and node/edge counts unchanged.
- PA seed draft changed from 1 to 2 while live tick 119 remained unchanged.
- Voting running tie rule changed at tick 20 without time advancing. Before duplicate fields were removed, its setup draft remained separate from the live checkbox. Final UI exposes each running rule once.
- Invalid Voting width 0 prevented initialization, focused the invalid width input and retained the prior tick-20 observations.
- Wealth live growth amount changed 4 → 5 by typing and Tab while the live model stayed at tick 1. Shared field readers were subsequently corrected to reuse the edited value during the next Setup.
- Skip-link Tab focus had a visible outline. Enter followed the experiment anchor. Native controls were keyboard reachable; canvas ArrowRight changed inspection selection without a step.
- Verified every input/select had an associated label or aria-label in inspected mobile states.
- Catalog switch across a development rebuild was retested after host restart: an existing catalog could load the previously unloaded Wealth entry with the correct URL/content and no new failed module request. Old failed requests remain in browser diagnostic history and are not counted as fresh failures.

## Iterations and findings

1. **Fixed and retested:** development updates previously caused repeated automatic navigation, resetting active work and invalidating element refs. The UI now offers explicit Reload updates.
2. **Fixed and retested:** stale lazy chunks caused a switch error while the selector named Voting and PA remained active. The restarted host retains old chunks; cross-rebuild switching passed. Failure handling now restores the active slug.
3. **Fixed and retested:** empty inspectors preceded the main view and consumed substantial vertical space. They now appear on selection in controls.
4. **Fixed and retested:** canvas agent-size units made sprites obscure most cells. Shared units and model selectors are now coherent.
5. **Fixed and retested:** Labels appeared on grid-only Voting; it is now hidden without label-capable spatial data.
6. **Fixed and retested:** Wolf wolves curve used #222222 on the #181818 dark surface. Root changed it to currentColor; actual dark retest resolved the stroke to rgb(238,238,238), visibly readable on rgb(24,24,24). Wealth equality curve was likewise verified. See `wolf-sheep-populations-dark.png` and `wealth-distribution-plots-dark.png`.
7. **Fixed and retested:** mobile Selected inspector's long IDs and coordinates overlapped and produced document overflow after keyboard selection. Root scoped its two-column layout and wrapping. Fresh light/dark 390px retests retained readable values, document scrollWidth=390, and tick 20. `finding-mobile-inspector-overflow.png` preserves the original failure; `wolf-sheep-mobile-{light,dark}.png` shows correction.
8. **Minor source finding:** Cytoscape labels use fixed #777 at 11px rather than the existing theme-aware --muted token. Reported to root for improvement; this is not a functional model blocker. No broad contrast-compliance claim is made.

## Responsive/theme scope

Actual light desktop and dark mobile screenshots were inspected. All four entries had no horizontal document overflow at 390 CSS pixels after the inspector correction, including selected Wolf agents. Additional mobile/light Wolf and Wealth screenshots and desktop/dark Wolf/Wealth plot screenshots were inspected. This is selective coverage, not a claim that every viewport/theme Cartesian combination was inspected.

No screenreader, cross-browser, touch-device hardware or prolonged performance certification was performed. Canvas scientific state is available through monitors/keyboard inspection; this does not make the raster itself fully screenreader equivalent.
