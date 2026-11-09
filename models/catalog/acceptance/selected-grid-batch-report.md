# Fire, Life and Percolation: author acceptance evidence

Executed 2026-11-05 on `experiment/selected-grid-batch`, based on coordinator `b99e86b`. Scope: issue [#5](https://github.com/dweigend/city-library/issues/5), Epic [#1](https://github.com/dweigend/city-library/issues/1). **Three implementations, three headless verifications, three target-browser executions and three executed NetLogo baseline comparisons. Research verification and independent Argon approval remain pending; these are author findings, not final model acceptance.** Central ledgers and research files were not edited.

## Environment, method and artifacts

[Source audit and adaptations](selected-grid-batch-source-audit.md) records canonical paths, exact hashes, version 7.0.4, Galapagos revision, full notices, domain ownership, defaults, order, boundaries, stopping/reporters and deliberate differences. The five frozen public examples were preserved; [interaction contract](../../docs/development/selected-grid-batch-interaction-contract.md) precedes shared renderer changes. Runtime steps are ordinary named TypeScript compositions of existing public City Library APIs.

Real server Chromium was controlled with configured T3 preview tools, starting with `preview_status`. Reference URLs were the exact selected `.nlogox` under `https://www.netlogoweb.org/assets/modelslib/`, loaded through `/launch#<URL>`. SHA-256 was computed inside Chromium over the actual `session.nlogoSource.nlogo` bytes for every model and matched each archive. Chrome user agent reported Linux Chrome/156.0.0.0. Source desktop viewport was 1280×1100; target default Fire setup/progress was 1280×800, Life 1280×1000, Percolation 1280×1100. Mobile viewport was 390×844; some PNGs have device-pixel-ratio 2. Mobile means browser emulation, not physical-device certification. Screenshots listed below were visually inspected.

Target server: `CITY_LIBRARY_UI_PORT=3111 CITY_LIBRARY_UI_HOST=0.0.0.0 bun run dev:ui`. Ports 3100/3110 were not used. Shared controls were exercised through actual Setup, step/batch, Run/Pause and model-specific inputs. Default target seed is Mulberry 1; NetLogo default reference runs were not seeded. Different stochastic trajectories and unequal sampled Run/Pause ticks are intentional and reported, with no claim of identical seeds or distribution equivalence.

The reference launcher catalog's hidden native select was temporarily hidden only to avoid its 550 options truncating automation snapshots; model widgets/code were unchanged. Deterministic source interventions below were entered into NetLogo's Command Center, not substituted TypeScript or source rewrites. Reference patch observation order is y descending; target Grid order is y ascending.

All image paths below are relative to [selected-grid-batch-evidence](../../docs/development/selected-grid-batch-evidence).

## Fire — Sample Models/Earth Science/Fire

Reference and target defaults: 251×251, hard boundaries, density 57%. Source Setup at tick 0: `initial-trees=35947`, burned=0; target Setup: 251 fires, zero embers, 0% burned. A separate executed headless default-seed read confirms 35750 initial/unburned trees, burned=0, matching the displayed target initialization policy. Source go toggled on/off: tick **149**, burned=2854, monitor **7.9%**. Target 10-step batch: tick 10, fires=73, embers=932, **2.11%** burned; subsequent Run/Pause sampled tick **96**, fires=14, embers=149, **8.43%**. Paused target tick remained 96 on another read. No plot exists in the source; target adds only current monitors.

| State | Reference image | Target image |
| --- | --- | --- |
| Default Setup | [reference](selected-grid-batch-evidence/fire-reference-setup.png) | [target](selected-grid-batch-evidence/fire-target-setup.png) |
| Progressed / paused | [tick 149](selected-grid-batch-evidence/fire-reference-progress.png) | [tick 96](selected-grid-batch-evidence/fire-target-progress.png) |

Target Setup reset tick and metrics; mobile single-step gave tick 1, fires=115, embers=251, burned=0.32% with no horizontal overflow: [mobile](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/fire-target-mobile.png). Density is setup-only. Target density 0, Setup, 100 steps stopped at tick **12**, fires=embers=0, percent=0 and disabled further Run/steps: [dark terminal](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/fire-target-dark-terminal.png). This confirms that the host waits for embers, not just propagation.

A deterministic source corridor was executed using:

```netlogo
resize-world -2 2 -1 1 set-patch-size 40 set density 0 setup
ask patches with [pycor = 0 and (pxcor = -1 or pxcor = 0)] [set pcolor green]
set initial-trees 2 repeat 100 [go]
```

Observed source: tick **14**, initial=2, burned=2, **100%**, zero turtles. [Reference terminal fixture](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/fire-reference-terminal-fixture.png). The unchanged public target example independently gives tick 14, with a one-column-per-tick front and all five embers present before expiry. The extra source patch size only makes the tiny fixture visible. Headless boundary fixture leaves right-edge trees intact when separated from left ignition; preflight stopped calls leave tick/history/RNG unchanged.

Comparison: source accounting, no jumps/wrapping, newborn activation delay and full ember lifetime agree with deterministic fixtures. Target substitutes field phases for stationary turtles and approximate CSS fade colors, adds seed/dimensions/forest fixture, and explicitly guards division by zero. Stochastic forest paths differ as expected. No known model runtime defect; independent acceptance remains pending.

## Life — Sample Models/Computer Science/Cellular Automata/Life

Reference default: 101×101 torus, initial-density 35%, foreground 123/background 79 (browser CSS `#660f40` / `#d2ece4`). Source setup-random tick 0 density monitor **0.35**; ten actual go-once clicks produced tick **10**, density **0.23**. Target same dimensions/density and seed 1: Setup **3555 living / 10201**, density **0.3485**; ten-step batch: tick **10**, **2288 living**, **0.2243**. These are fractional density values; target displays four decimal places instead of the source monitor's two.

| State | Reference image | Target image |
| --- | --- | --- |
| Random Setup | [reference](selected-grid-batch-evidence/life-reference-setup.png) | [target](selected-grid-batch-evidence/life-target-setup.png) |
| Ten generations | [reference](selected-grid-batch-evidence/life-reference-progress.png) | [target](selected-grid-batch-evidence/life-target-progress.png) |

Source go-forever on/off reached tick 147 (density 0.10); target Run/Pause was also exercised. Source setup-blank resets to tick 0/all dead. Draw-cells toggled and an actual canvas drag created the central living cell. The reference emitted a warning that `display` is not implemented in NetLogo Web, but drawing state changed and rendered. Native reference picker automation changed the HTML color value without changing its NetLogo global; to verify model palette timing independently, Command Center executed `set fgcolor 55 set bgcolor 0`. Existing living cell still had source color 123 until actual Recolor changed it to 55, and all dead colors became 0. This is a reference picker-automation limitation, not evidence that global recolor should happen on input.

The source blinker fixture `setup-blank ask patches with [pycor = 0 and abs pxcor <= 1] [cell-birth]`, followed by actual go-once, produced exactly `(0,-1),(0,0),(0,1)` at tick 1: [reference blinker](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-reference-blinker.png). The frozen target script verifies the same generation and return after two steps, with unchanged RNG; empty Life advances to tick 5 and never reports done. A separate headless edge-crossing blinker establishes wrapped Moore topology.

Target drawing/palette interaction evidence is detailed below. Desktop dark default single-step: tick 1, living=3747, density=0.3673, [dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-target-dark.png). Mobile selected-cell toggle and live foreground/background inputs are reachable without overflow: [light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-target-mobile.png), [dark with palette](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-target-mobile-dark.png). Colors intentionally stay on existing cells until birth/death or Recolor, including two-neighbor survivors.

Comparison: synchronous birth/survival/death, unconditional ticking, torus topology, fraction reporter and delayed palette timing match source mechanisms and fixtures. Additional dimensions/seed/fixtures, native CSS rather than numeric NetLogo color representation, combined Setup mode and explicit keyboard/tap alternatives are documented adaptations. No invented scientific stopping rule. Research and independent approval remain pending.

## Percolation — Sample Models/Earth Science/Percolation

Reference and target defaults: **150×221**, hard x/wrapped y, porosity **60.5%**, top row **220**, **75** front cells, totalOil **0**, tick 0. Source go on/off sampled tick **7**, totalOil **406**, front **50**. Target ten-step batch: tick **10**, totalOil **510**, front **38**, currentRow **210**. Source and target both show the top saturated trail and current red front, not a precomputed permeability map. Source plots and target historical charts respectively track cumulative saturated soil and current front count.

| State | Reference image | Target image |
| --- | --- | --- |
| Default Setup | [reference](selected-grid-batch-evidence/percolation-reference-setup.png) | [target](selected-grid-batch-evidence/percolation-target-setup.png) |
| Progressed / paused | [tick 7](selected-grid-batch-evidence/percolation-reference-progress.png) | [tick 10](selected-grid-batch-evidence/percolation-target-progress.png) |

Source `set porosity 0 setup go go` stopped at tick **1**, totalOil **75**, front **0**. Target live change to 0 at tick 10, followed by one actual step, gave tick **11**, totalOil **548**, front **0**, currentRow **209**; Run/steps disabled. Raising porosity to 99 afterwards left those values and disabled stepping unchanged. Thus live porosity changes future attempts and never resurrects oil.

Source Command Center `resize-world 0 2 0 2 set porosity 99 random-seed 42 setup repeat 2 [go]` produced tick **2**, totalOil **3**, exactly one oil cell at **(column=1,row=2)** and **zero saturated cells**. The actual target UI width=3,height=3,seed=42,porosity=99 with two single-step clicks produced the same invariants/currentRow=2. [Source wrap](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-reference-wrap.png), [target wrap](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-target-wrap.png). Equality of this high-probability fixture is not evidence of RNG identity. The frozen target example also asserts this result.

The headless retry test uses seed 2 and porosity 50: parent column 3 fails at shared column 2 (draw 0.8752879470), parent 1 retries and succeeds (0.1140317237), while both outer destinations fail. Exactly column 2 remains oil and the RNG continuation word is 1135788948. A once-per-destination staged implementation fails this fixture. Other fixtures verify atomic front/rule validation and stopped-state purity.

Target reset and Run/Pause were exercised on the tiny case; later tick 5 gives totalOil=7/front=2/currentRow=1. [Charts](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-target-plots.png), [mobile charts](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-target-mobile.png). Default dark single-step gives tick 1,totalOil=75,front=64,row=219: [desktop](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-target-dark.png), [mobile](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/percolation-target-mobile-default-dark.png). No horizontal overflow was observed.

Comparison: sequential entry/retry, hard edges, live porosity, preflight stop, cumulative totalOil and bottom-front-before-activation wrap agree with source and deterministic invariants. Centered public coordinates, explicit seed/size/fixtures, bounded history and different RNG/call omissions are declared adaptations. No known model runtime defect; scientific distribution equivalence is not asserted.

## Interaction and design verification

Shared renderer changes are limited to optional neutral drawing intents, pointer capture/cancel/end, keyboard dispatch and native color bindings. Existing consumers retain selection and default disabled drawing. The headless Life actions decide latch mode and mutate canonical fields. The compile-only four author tasks predate runtime; final full typecheck includes them and all earlier contracts.

T3 preview performed genuine button/canvas clicks, keyboard Enter/Home/arrows, native input changes and one-cell drag/release. Two attempts to drag to a precise interior overlay timed out after 15000 ms. The temporary overlay was removed. The configured Playwright MCP fallback could not start: Chromium reported `/usr/local/libexec/codex-playwright/chrome_sandbox` is root-owned but mode 0755 instead of 4755, then SIGABRT. No system permissions were changed.

For precise genuine mouse/touch verification, the already installed server Playwright was run directly against its installed Chromium executable with `--no-sandbox`. The portable author script is [selected-grid-batch-browser.mjs](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-browser.mjs); it imports an externally supplied Playwright path without adding project dependencies. Executed command:

```sh
CITY_LIBRARY_PLAYWRIGHT_PATH=/home/david/.local/share/codex-playwright-mcp/node_modules/playwright/index.mjs \
CITY_LIBRARY_CHROMIUM_PATH=/home/david/.local/share/codex-playwright-browsers/chromium-1247/chrome-linux64/chrome \
node docs/development/selected-grid-batch-browser.mjs
```

Its durable [observations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/trusted-interactions.json) and [paint](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-target-trusted-paint.png) / [touch](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-grid-batch-evidence/life-target-trusted-touch.png) screenshots cover a three-cell stroke retaining paint over a living cell, the reverse erasing stroke, release outside the canvas, Home/Enter/ArrowRight/Space at tick zero, delayed recolor pixel values, genuine CDP touch input and the tap alternative. The direct runner reported Chromium **155.0.8059.12** (separate from T3 preview Chrome 156). An initial mixed CDP-touch / Playwright-tap run suppressed the subsequent button click even after waiting; the final script separates CDP stroke and Playwright tap checks onto fresh pages. Both then pass with genuine input. No model runtime change was made to mask that protocol interaction. Supplementary synthetic pointer dispatches in T3 preview also produced three living cells at tick zero; they are not counted as trusted input proof.

The `web-design-guidelines` skill was applied after design work. Current upstream rules were fetched from its prescribed raw GitHub URL. Review scope: the three adapters, shared canvas/compose/definition and affected responsive flow. Labels, visible focus, pressed draw state, native controls, status feedback, no overflow, no added decoration/icons, keyboard/tap alternatives and light/dark states were inspected. Mobile live controls retain the existing layout position below views and remain reachable by scrolling. No material finding remains in the changed UI. This is not an exhaustive screen-reader or physical-device audit.

Reference console: Ractive debug information, unsupported `de` locale fallback, and Life's unimplemented `display` warning. Target preview console: no application errors; an informational Canvas2D readback performance warning was generated by evidence `getImageData` probes. Reference analytics had aborted requests; model assets loaded successfully. Several author probes used uppercase patch variable names or a malformed expression and were corrected to lowercase/valid expressions before recording outcomes; those tool-evaluation errors are not model behavior. Independent Playwright page errors are checked by the durable script, which recorded an empty error array.

## Executed shell checks and handoff gates

- `bun install --frozen-lockfile`: existing pinned development dependencies installed; no manifest/lock change.
- Five unchanged `examples/netlogo-grid-batch/*.ts`: assertions pass, including Fire tick 14, Life always-ticks/blinker and Percolation wrap.
- `bun test tests/selected-grid-models.test.ts`: **7 pass, 0 fail**, 45 expectations.
- `bun run check`: full typecheck, **128 tests pass / 0 fail**, **all 50 public examples**, browser library build/declarations, packed Bun/Node ESM/ambient-free TypeScript consumer pass.
- `sha256sum -c examples/netlogo-grid-batch/SHA256SUMS`: all five pass; original `242cc12` bytes preserved. Three archive SHA-256 checks match source audit and browser-loaded bytes.
- No separate lint command is configured. Formatter was run on changed runtime/UI/test files without adding dependencies or changing the project lockfile.

Author implementation and evidence are ready for coordinator integration. **Pending:** independent Argon review and any resulting remediation/recheck; separate research verification by the exclusive research coordinator; root-owned final central-ledger decision. The configured Playwright MCP launcher still has the concrete environment blocker above; direct server Playwright/Chromium verification is separately evidenced. No publication, merge, root README/diagram change, dependency commit or central inventory/progress/selection edit was performed.
