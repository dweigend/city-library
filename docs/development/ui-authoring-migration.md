# Experiment UI authoring migration

The catalog contains 125 paired entries. This migration adopts the [frozen authoring contract](ui-authoring-syntax.md) without changing model procedures, clocks, random draw order or scientific colors. The public `defineUI(model, spec)` entry remains the same. Source migration and shell checks are complete; new-syntax browser and independent visual acceptance are separate work.

## Result

- 115 entries use keyed live controls, covering 527 field-specific setters. Ten entries have no live controls. No legacy live arrays or dynamic live maps remain in the catalog.
- 295 literal setup selections use field strings; 53 records retain concrete label/widget overrides. Remaining setup expressions select ordered field strings or required labeled controls.
- Standard `observation.parameters[field]` getters are implicit. No custom getter was removed: all 527 migrated getters were direct compatible parameter observations, and strict typechecks validate their eligibility. Setters contain no `Number`, `Boolean` or `String` coercions and no general unchecked record casts.
- The 22 top-level dynamic live descriptions were expanded into explicit keyed bindings, including numeric/boolean/choice distinctions; the additional spread-based CA pattern bindings were also made explicit. No runtime binding builder or new dependency was added.
- 140 longer view callbacks in 86 entries became typed named projections below their UI descriptions. Existing earlier helper functions were also moved below descriptions where needed. Short maps remain inline.
- Preferential Attachment already had no setup overrides or live array to migrate and remains unchanged. The other 124 UI files changed, including formatting.

## Model-specific changes

Taxi Cabs now uses `occupiedCabs` and `totalIncome` from its headless observation. Income formatting remains presentation-only. Its private mount override, DOM queries and nested disclosure patch are removed. The 45 demand controls retain their source field order within five flat groups: AM, MD, PM, EVE and EM. The eight ungrouped live controls precede them. Vite passes an empty legacy-entry list, so Taxi no longer has a special host exception. This source change alone does not establish Svelte/browser acceptance.

Wealth Distribution uses numeric Gini observations with an explicitly narrowed monitor formatter. Its current-class bar series now labels Low, Middle and High categories and declares Wealth class / People axes; class counts and scientific colors are unchanged. Tijuana keeps its source-specific action availability, display/color transformations, drawing intents and monitor calculations, with spatial projection and formatting helpers below the description.

## Executed verification

`bun run typecheck` passed, including the five TypeScript projects and Svelte checking with zero errors/warnings. The targeted transport, Tijuana and reference-model suites passed 42 tests / 378 assertions. All five numbered frozen UI-authoring script hashes passed; this migration does not change those scripts or their manifest. The full manifest separately reports the coordinator-authorized negative type-fixture directive relocation in `examples/ui-authoring/authoring.types.ts`; that owned change must retain its explicit remediation record and is not presented as an unchanged full manifest. Scoped `git diff --check` passed.

A TypeScript AST comparison resolved named helpers and compared 378 view data/series/table/inspector callbacks against the pre-migration Git versions, ignoring comments, formatting, parentheses and type assertions. The only expression change was the intended Wealth current-class bar x values (numeric positions to category strings); y counts and colors are retained. This source comparison is supporting evidence, not browser or scientific validation.

Earlier model-refactor browser runs remain baseline evidence. They exercised real controls and produced separate exact-size Playwright screenshots, but they predate this syntax/Taxi host migration and do not satisfy its acceptance. Upcoming checks must cover the frozen authoring browser helpers in both hosts, flat groups, live/setup draft precedence, formatted monitors, categorical axes, Taxi lifecycle and representative catalog switching.

## Per-entry inventory

Live counts refer to explicit keyed bindings. Named counts refer to longer projections extracted during this migration; existing named helpers are not counted.

| Entry | Live fields | New named projections |
| --- | ---: | ---: |
| `anisogamy` | 7 | 2 |
| `ants` | 2 | 1 |
| `artificial-neural-net-multilayer` | 6 | 0 |
| `artificial-neural-net-perceptron` | 6 | 1 |
| `autumn` | 5 | 4 |
| `bacterial-infection` | 8 | 2 |
| `baldwin-effect` | 6 | 4 |
| `bank-reserves` | 1 | 2 |
| `bidding-market` | 2 | 2 |
| `binomial-rabbits` | 2 | 0 |
| `birthdays` | 0 | 0 |
| `blood-sugar-regulation` | 4 | 2 |
| `braess-paradox` | 5 | 0 |
| `brians-brain` | 1 | 0 |
| `ca-1d-elementary` | 4 | 0 |
| `ca-continuous` | 3 | 0 |
| `ca-stochastic` | 14 | 0 |
| `cash-flow` | 1 | 2 |
| `central-limit-theorem` | 4 | 1 |
| `chloroplasts-and-food` | 4 | 2 |
| `consumer-choice` | 5 | 2 |
| `crispr-bacterium` | 4 | 2 |
| `crispr-ecosystem` | 4 | 4 |
| `crystallization-basic` | 3 | 0 |
| `cyclic-ca` | 1 | 0 |
| `daisyworld` | 8 | 1 |
| `diffusion-on-a-directed-network` | 1 | 1 |
| `dining-philosophers` | 3 | 2 |
| `disease-solo` | 4 | 0 |
| `dla` | 3 | 1 |
| `dna-protein-synthesis` | 3 | 0 |
| `el-farol` | 1 | 2 |
| `epidem-basic` | 3 | 1 |
| `epidem-travel-and-control` | 10 | 1 |
| `ethnocentrism` | 8 | 2 |
| `expected-value` | 2 | 1 |
| `fire` | 0 | 1 |
| `fireflies` | 5 | 1 |
| `flocking` | 5 | 1 |
| `fruit-wars` | 7 | 3 |
| `fur` | 2 | 0 |
| `galton-box` | 3 | 0 |
| `gendrift-t-interact` | 0 | 1 |
| `genevo-1-genetic-switch` | 8 | 1 |
| `heat-diffusion` | 6 | 1 |
| `heatbugs` | 7 | 1 |
| `heroes-and-cowards` | 0 | 0 |
| `hex-cell-aggregation` | 6 | 2 |
| `hiv` | 4 | 1 |
| `honeycomb` | 0 | 0 |
| `hotellings-law` | 1 | 1 |
| `interstitial-diffusion` | 6 | 2 |
| `invasive-plants` | 8 | 1 |
| `ising` | 1 | 0 |
| `k-means-clustering` | 2 | 1 |
| `language-change` | 6 | 0 |
| `life` | 2 | 0 |
| `limited-order-book` | 0 | 2 |
| `mammoths` | 6 | 2 |
| `mandelbrot` | 1 | 1 |
| `membrane-formation` | 4 | 0 |
| `mendelian-inheritance` | 1 | 0 |
| `mimicry` | 3 | 0 |
| `minority-game` | 1 | 4 |
| `muscle-development` | 4 | 1 |
| `pagerank` | 5 | 0 |
| `particle-swarm-optimization` | 6 | 1 |
| `partition-permutation-distribution` | 4 | 0 |
| `party` | 1 | 1 |
| `paths` | 5 | 1 |
| `peppered-moths` | 5 | 1 |
| `percolation` | 1 | 0 |
| `piaget-vygotsky-game` | 8 | 1 |
| `preferential-attachment` | 0 | 0 |
| `prisoners-dilemma-basic` | 3 | 2 |
| `prisoners-dilemma-two-person-iterated` | 4 | 1 |
| `rabbits-grass-weeds` | 5 | 2 |
| `random-combinations-and-permutations` | 4 | 1 |
| `rebellion` | 4 | 3 |
| `repressilator-1d` | 9 | 2 |
| `robby-the-robot` | 3 | 1 |
| `robotic-factory` | 4 | 4 |
| `rumor-mill` | 2 | 1 |
| `sand` | 3 | 1 |
| `sandpile` | 3 | 1 |
| `segregation` | 1 | 0 |
| `sex-ratio-equilibrium` | 4 | 2 |
| `shepherds` | 1 | 1 |
| `signaling-game` | 1 | 0 |
| `simple-birth-rates` | 3 | 0 |
| `simple-genetic-algorithm` | 4 | 1 |
| `simulated-annealing` | 3 | 0 |
| `slime` | 4 | 0 |
| `smoothlife` | 8 | 0 |
| `solid-diffusion` | 0 | 1 |
| `stochastic-patchwork` | 1 | 1 |
| `sunflower-emergent` | 7 | 0 |
| `taxi-cabs` | 53 | 2 |
| `termites` | 0 | 1 |
| `three-doors` | 0 | 1 |
| `traffic-2-lanes` | 4 | 4 |
| `traffic-basic` | 2 | 1 |
| `traffic-grid` | 5 | 0 |
| `traffic-grid-goal` | 5 | 0 |
| `traffic-intersection` | 8 | 1 |
| `tumor` | 1 | 0 |
| `turing-machine-2d` | 13 | 2 |
| `urban-suite-awareness` | 1 | 2 |
| `urban-suite-cells` | 4 | 0 |
| `urban-suite-economic-disparity` | 8 | 2 |
| `urban-suite-path-dependence` | 4 | 2 |
| `urban-suite-pollution` | 3 | 2 |
| `urban-suite-positive-feedback` | 2 | 0 |
| `urban-suite-recycling` | 5 | 3 |
| `urban-suite-sprawl-effect` | 4 | 2 |
| `urban-suite-structure-from-randomness-1` | 1 | 0 |
| `urban-suite-structure-from-randomness-2` | 1 | 1 |
| `urban-suite-tijuana-bordertowns` | 12 | 1 |
| `vants` | 0 | 1 |
| `virus` | 4 | 2 |
| `virus-on-a-network` | 4 | 1 |
| `vision-evolution` | 7 | 3 |
| `voting` | 2 | 0 |
| `wealth-distribution` | 6 | 1 |
| `wolf-sheep-predation` | 5 | 2 |
