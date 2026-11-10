# Sampling, combinations and Mandelbrot model contracts

Runtime scope: Expected Value; Partition Permutation Distribution; Central Limit Theorem; Random Combinations and Permutations; Mandelbrot. Identity is the exact selected `catalogPath` in selection.json, not a thematic replacement. Full source snapshots and Info notices are retained in each experiment's `source.nlogox` and `NOTICE.md`. Public examples define the required model behavior.

Each `model.ts` exports `create`, `inputs`, and inert `model`. Instances own all model state, their seeded public `Random` stream and model-specific counters; `read()` provides detached frozen observations without drawing randomness. `advance(0)` is pure; invalid step counts fail before mutation. Domain histograms use public `stats.histogram`; mean histories, counts, population statistics and matching rules stay in headless modules. UI modules only project observations and invoke public actions through the existing shared adapters.

Target randomness is Mulberry32 with an explicit seed, not NetLogo's generator. Different activation order and random-number consumption are declared; no matched-seed trajectory or scientific distribution equivalence is claimed. Source notices, original Procedures/Widgets/Info, and scientific dossiers were consulted. Dossier completion does not establish runtime or scientific validation.

## Expected Value

Selected path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Expected Value`.

The fixed wrapped 15×15 population has values 0–6. Seven ratio inputs and sample size are frozen at setup. `setupPatchesPolish` reproduces the source's iterative rounding adjustment; it is not replaced with a different apportionment algorithm. `setupApart` first allocates grouped populations and performs the source's 56 complete randomized neighbor-swap passes. The preliminary random allocation is retained even when overwritten by this branch, preserving its draw-consuming stage.

`go` clears selections, places the sampler on a uniformly selected tile and chooses a cardinal heading, then performs a correlated local walk: read current tile, record/highlight it, move one wrapped cardinal step and turn by −90/0/90 degrees. Revisited tiles remain valid draws. Sliding to the random starting patch is collapsed to direct placement; the source's animation consumes no randomness and does not alter the sampled path after the source snaps to the chosen patch center. Readouts include values, selected multiplicities, actual integer population counts, theoretical ratio percentages, expected total, sample totals, cumulative means and total histogram. Setup contributes the source's initial zero total, hence `runCount = tick + 1`.

`clearSelection` changes highlights only. `setDisplay` changes black-out and die-number presentation; black-out takes effect on the next clear/sample, as in source recoloring. Setup-apart's intermediate two-second pause and swap animation are synchronous in the headless target. Dice faces/numbers are rendered as labels rather than NetLogo outline shapes. These are presentation adaptations, not independent iid sampling.

## Partition Permutation Distribution

Selected path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Partition Permutation Distribution`.

A completed source `go` performs one trial and increments one tick. Draw an integer in 1…remaining-gap with diminishing space, otherwise 1…target-total. Keep an addend only if it fits; every candidate, including rejected overshoots, enters the addend history and trial count. A successful total records its trial count and previous accepted list, clears the current ribbon/list and increments successes. Preflight success-budget stops do not tick. All trial/success histories and their histograms are observed independently.

`setRules` exposes the live target total, budget, diminishing-space and wait controls. Source `wait-at-full?` adds a wall-clock pause only; target wall-clock cadence remains host-owned and this parameter does not delay the synchronous headless call. Changing the target below the current running total retains NetLogo's signed random bound: negative candidates are recorded even when rejected. The ribbon's graphical presentation becomes explicit current-addend bars; the source color draw is retained on each accepted addend.

## Central Limit Theorem

Selected path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Central Limit Theorem`.

Setup is intentionally empty. `createPopulation` resets samples and creates a random-height population for columns 0…max-value, with the original exclusive height condition. `preset(1…6)` resets samples, sets max-value to30 and reproduces the original patch predicates. NetLogo's positive `mod` semantics on negative odd x coordinates are retained for preset3 (16 columns, 480 people), rather than JavaScript's negative remainder semantics. `drawYourOwnPeople(x,y)` adds above the highest person in a selected column, caps at y15, ignores the bottom label row and leaves previous samples untouched. The full 31×31 source patch background is exposed for pointer and keyboard drawing via the existing shared canvas.

Each successful `go` resets selection and samples exactly `sampleSize` distinct people without replacement, ticks once, and records their shifted x-coordinate sum and mean. Insufficient population clears selection, records the source message and stops before a tick. Inputs remain live as in the source: changing max-value affects subsequent population creation/drawing but does not reinterpret existing x coordinates. Sums/means remain stored regardless of whether the sums plot is shown. Standard deviations use `stats.describe(values, { sample: true }).standardDeviation ?? null`, with sample denominator n−1.

Original reporters can fail with fewer than two samples, empty populations or `show-ev? = false` (no report). Target observations explicitly return null for these unavailable quantities and show `N/A`, preserving unavailable meaning without flooding the host with monitor errors. This guard is a declared adaptation, not a claim that the original reports a numerical zero.

## Random Combinations and Permutations

Selected path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Random Combinations and Permutations`.

Setup creates the 1–5 by1–2 set block and paired guess block three rows below. `createCombi`, `assignColorOrImage`/`selectAt` and `finishCombi` expose the source's combination-setting mode; every dice cell requires a choice, while color mode begins with the source's green cells. Cycling uses the configured first2–6 symbols. The same public actions support pointer and keyboard drawing. Search freezes further editing, generates independent uniform guesses for every position, checks exact ordered equality and equal per-symbol multiplicities, and accumulates both success counts. Source terminology is retained: “combination” means ordered equality; “permutations” means equal multisets.

The source search procedure never calls `tick`. Target `tick` therefore remains0; `attemptCount`, `stepCount`, and `samplesCounter` expose actual progress. Every sample-size attempts, `plotSample` stores both counts and resets current counters. `singleSuccess` selects the original analysis condition and preserves its `littleSetup` clearing of current/sample histories, while target `done` stops the shared player after congratulations. Hide/reveal changes only display, retaining the target values. Observations include per-choice counts, both sample histograms/means and ratio, returning null where original empty means or division by zero are unavailable.

Width, height, symbol count and dice mode apply through Setup; the original warns that configuration changes require setup and can otherwise leave inconsistent dice/color structures. Live sample size, analysis, single-success and bar/line controls remain available. Both plot styles use the same domain-owned distributions, displayed in separate shared chart views because the current adapter fixes its view type. NetLogo die/outline shapes become numbered symbols. Explicit finish/edit controls replace the original forever Create Combi polling button. The source's unresponsive user confusion states are retained as instructional messages, not fabricated guesses.

## Mandelbrot

Selected path: `Sample Models/Mathematics/Fractals/Mandelbrot`.

The world is the original hard-boundary 301×301 patch plane (−150…150); turtles start at continuous random coordinates and headings. An eager canonical Grid owns every field's z/counter and the c values fixed by setup's scale. It is not a full-grid deterministic fractal renderer. Each `go` snapshots turtles whose current patch has modulus≤2 and counter<115, then in randomized order advances their occupied patch's complex recurrence, retaining multiple increments when several eligible turtles share a patch. Eligibility is not rechecked after a preceding turtle updates the patch. Consequently a patch can overshoot115 within a single source ask, and this behavior is preserved.

Next each turtle moves one step, relocating randomly if that step crosses a hard boundary; it wiggles by independent integer right/left turns0…9, then compares its current patch counter to its own previous counter. Successful climbs update the remembered counter, color yellow and attempt `jump throw`; failed climbs color blue and turn180 degrees. An impossible jump does not move, consistent with the [NetLogo7.0.4 jump dictionary](https://docs.netlogo.org/dict/jump.html), consulted2026-11-05. Tick increments after all phases. Throw is live; count and scale affect Setup. Changing a stored scale input cannot rewrite the c values established at Setup. `hideAgents` changes only visibility; hidden turtles keep computing/moving. Target uses a continuous hue palette rather than NetLogo's numeric color ramp.
