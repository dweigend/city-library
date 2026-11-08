# B06 collective behavior compositions

Scope: `invasive-plants`, `ants`, `heatbugs`, `flocking`, `fireflies`. Source/contract freeze: `078c2da`. Runtime worker writes only these experiment directories, its focused test and this report. No shared library, renderer, registration, research or ledger edits. Exact served XML, SHA-256, canonical selection paths and complete notices remain in `source.nlogox`, `NOTICE.md` and `selected-ecology-sources.json`.

## Public composition and ownership

Every model exports its inert definition, inputs and headless `create`; instances expose `advance`, pure detached `read` and typed actions. World owns membership/time, Agent owns position/orientation and agent properties, Grid owns environmental fields, Random owns the Mulberry stream, and bounded histories contain detached samples. Rendering owns no domain state. All movement, occupancy, wrapped distances, direction vectors, normal samples, field diffusion, histograms and summaries compose the public `city-library` API. No independent grid, random generator, occupancy cache, population registry or generic helper kernel is introduced.

Fireflies uses canonical Grid occupancy plus the current Moore neighborhood to narrow radius-one perception before public Agent.neighbors. The old flashing-color set is an ephemeral observation of the recolor phase, not a second agent state authority. This reduces the measured default 1500-agent step from roughly1966ms to roughly100ms in this environment without changing source phase order or drawing RNG. Flocking exports the source `averageHeadingTowardsFlockmates` reporter and its subtract-headings calculation; these are explicit source procedures, not a replacement geometry library.

Common deliberate adaptations: Mulberry/polar-normal RNG replaces NetLogo's RNG, source ask snapshots are shuffled with the public sampling API, framework identities are strings, snapshots are frozen detached records, and charts retain the initial point plus up to1000 subsequent samples. RNG call order and trajectories are not asserted equal across engines. Source uniforms, stochastic branching, activation phases and deterministic equations are retained. Canvas glyphs/colors and CSS sizes are presentation choices rather than NetLogo bitmap/shape reproductions. No scientific distribution-equivalence claim is made.

## Invasive Plants

Canonical path: `Sample Models/Biology/Invasive Plants`; served SHA-256 `657443adb46050bced1887759c92f23321227607bc28aceebb2bdcd4b0a5dd9e`.

Defaults: 33×33 hard world, initial density0.01, plus resistance, draw mode resistance/value100, show seeds true, production0.05, spread1, herbicide threshold66/effectiveness0.95/rate5. Setup uses integer100 thresholding and clears infestation on resistance shapes; plus uses `abs(x)<3 or abs(y)<3`, circle uses squared radius strictly below49.

`advance` germinates and deletes old seeds first (strict integer100 draw greater than resistance); applies herbicide to a sampled snapshot of qualifying fields with sequential half-effect runoff on Moore neighbors; produces nonnegative normally distributed seed counts only for positive means; then spreads the newborn seeds. Source sprout counts round to nearest integer, as established by coordinator original-browser probes0.6→1 and1.6→2. No newborn seed germinates in its creation step. Histograms clamp100 to99 into ten source intervals; aggregate infestation is the sum of field values.

Actions: `paint(x,y,mode,value)` edits without time, `draw(x,y)` paints and completes one source draw tick, `drawingTick()` advances the source draw clock without painting; `clearPatches()` clears infestation/resistance and removes resistance-block display membership while preserving seeds; `clearPlots()` clears only the chart history. Drawing resistance always clears infestation. Pointer drawing and an independently repeatable Draw clock expose the source's mouse/cadence distinction explicitly. Actual drawing cadence is host controlled. Resistance blocks use neutral circle glyphs because shared spatial renderer supplies circles/triangles; size retains the source square-root scale. Seeds retain their source hidden state until spread updates it.

Live controls expose every source runtime variable; initial density and initial shape apply at Setup. Drawing value also applies when Setup creates the initial resistance pattern. Source hard-boundary spread performs canonical full-unit moves and a final fractional move; a blocked stride stops that seed while preserving prior completed strides. Coordinator native probes established patch16/heading90/fd2→x16 and patch14/heading90/fd4→x16. The latter ruled out whole-endpoint rejection. The source upper patch edge is exclusive whereas canonical hard Space/Grid accept their upper endpoint; the source spread procedure uses public `geometry.normalize(..., {space, endpoints: "half-open"})` before a canonical absolute move. This is a source boundary adaptation, with no competing geometry kernel. The same public endpoint policy is used for Ants scent and movement. No new reusable library operation was needed: source procedures compose public direction, field lookup and Agent.move. See final browser report for executed screenshots.

## Ants

Canonical path: `Sample Models/Biology/Ants`; served SHA-256 `a7c54ba49c1a492efff67522e894cce469284783a3f3d87e91acc8692cc78ce6`.

Defaults: 71×71 hard world, population125, diffusion50%, evaporation10%. Every ant starts at origin with an integer random heading. The nest is strictly radius5; scent is200 minus Euclidean distance. Source food circles at(21,0),(-21,-21),(-28,28) are radius5 with later assignments taking precedence and food initially1 or2. Food-by-pile reports the source visible pile criterion, excluding nest fields.

A shuffled ant whose source ordinal is at least current tick does nothing. Consequently tick0→1 moves no ants. Carrying ants turn around at the nest, otherwise deposit60 chemical and climb nest scent. Searching ants pick up food and turn180, or climb chemical only in[0.05,2). Pickup exits its procedure but still performs subsequent wiggle and movement. Ahead/right/left probes use one-unit public direction vectors and field lookup; a right/left tie chooses left. Integer40 wiggle precedes hard-boundary bounce and one-unit movement. All ants precede Moore diffusion and evaporation. Three source pile histories are shown. Population applies at Setup; diffusion and evaporation apply live. No extra stop on depleted food or an empty colony is introduced.

## Heatbugs

Canonical path: `Sample Models/Biology/Heatbugs`; served SHA-256 `9b439a81d1526f34fe9716a9d2d690d9948ecd119fa6f64502aee3b424c6fa59`.

Defaults: 100×100 torus, bugs100, ideal range10..39, output range5..24, evaporation0.01, diffusion0.9, random movement0%. Source coordinates0..99 are translated by49.5 to the centered public space; observations and rendering use these translated coordinates. Counts, cell adjacency, distances and dynamics are unchanged. Setup samples distinct canonical fields and faces one random Moore neighbor. Inverted min/max sliders retain source signed-integer sampling instead of inventing a min≤max restriction; equal bounds return that bound.

Preflight stops without ticks when no bugs exist. A step diffuses, evaporates, and then activates shuffled bugs sequentially. Unhappiness measures the old current temperature before movement/emission. The hottest/coolest neighbor is sampled uniformly from exact ties and used only if strictly better than the current field; a randomly chosen neighbor is used instead according to the percentage parameter. An occupied target triggers a uniformly sampled currently free neighbor; the latter fallback leaves heading unchanged, matching source. Emission occurs at the final field. Average unhappiness uses the public summary API and source before-move values.

Actions: Deep freeze sets every temperature0; Heat up adds the current max-output setting to every field; neither ticks. Happiness/Ideal temperature switch display; Watch happiest/saddest samples a tied extreme and records its identity; Reset perspective clears this selection. The shared renderer highlights/enlarges the watched bug and exposes its identity/inspector instead of NetLogo's moving camera. Display changes render immediately rather than requiring another source display pass. Bounds controls remain live variable settings, but existing ideal/output agent properties are captured at Setup; max-output also controls Heat up. Zero bugs is a supported API/test extension below the source slider minimum1, with undefined mean rather than a failing empty chart.

## Flocking

Canonical path: `Sample Models/Biology/Flocking`; served SHA-256 `0ce9a6b0ee385898dfcacc7ed06699286cd51e5302a80c90b32687e13cefa143`.

Defaults: 71×71 torus, population300, vision5, minimum separation1, alignment limit5°, cohesion3°, separation1.5°. Each shuffled bird obtains other canonical agents in its public wrapped perception radius and samples nearest-distance ties. Separation turns away from the nearest bird's heading, not its position. Otherwise circular vector means align and cohere sequentially; exact zero sums retain the current heading. Later agents see earlier agents' updated headings. After all decisions, five shuffled movement passes of0.2 complete one source tick. Source intermediate display calls are omitted inside the headless tick.

The public source cohesion reporter throws RangeError on coincident points, matching the coordinator's observed native TOWARDS runtime error. It does not silently skip the undefined vector. Population is Setup-only; all steering parameters apply live. No source plot exists; the UI shows agents, count/tick and a selected-bird inspector.

## Fireflies

Canonical path: `Sample Models/Biology/Fireflies`; served SHA-256 `3e27054691236c9aadca9d425a1c4b66cc0452e4195c2266e09ba3729f5e7cb2`.

Defaults: 71×71 torus, number1500, flash length1, cycle10, reset count1, delay strategy, dark agents hidden. Setup samples integer initial clocks; each agent captures threshold, reset-level and window (`delay`: threshold/-1; `advance`:0/threshold+1). Changing strategy or flash-length live changes settings for the next Setup, preserving current captured fields. Cycle length and reset-count affect existing agents immediately.

Each shuffled firefly rotates by the difference of two independent uniform90 draws, moves1, increments clock, and resets to0 only when the new clock equals cycle length. It then senses old yellow-color flags in radius1, including its own old color, if clock exceeds window and reaches threshold. A second pass recolors from the resulting clocks; no partial recolor contaminates the sensing pass. Hidden agents remain present for perception. Visibility changes render immediately as a presentation adaptation. Empty worlds still advance; the target safely displays the empty chart instead of reproducing the native setup plot-range0..0 error observed by the coordinator. The coordinator separately verified native go can complete three ticks in that empty state after the setup plot error.

## Verification and UI review status

Executed by this runtime worker:

- `bun run typecheck`: all four configured TypeScript projects passed after runtime changes.
- `bun test tests/selected-ecology-collective.test.ts`:7 tests,59 assertions passed. Coverage includes nest initialization/delayed departure, thermal conservation/evaporation/emission, unique occupied fields, wrapped unforced flocking, coincident cohesion error, captured firefly strategy/cycles, seed generation/germination phase separation, blocked spread, resistance geometry, strict herbicide runoff, drawing/plot clear, validation and detached read purity.
- Frozen scripts04 and05 passed without edits. Coordinator reported all five frozen scripts passing; its final integrated evidence owns that broader result.
- Default model factory plus one-step smoke ran for all five. This was execution/performance evidence, not browser or statistical acceptance.
- Files formatted using the existing cached Prettier3.9.10; no dependency install.
- `frontend-design` principles applied: shared controls, compact labeled inputs/actions, shared Lucide playback, purpose-only color, no bespoke chrome. Current Vercel Web Interface Guidelines were fetched from their primary raw URL for static review. Adapters contain no DOM ownership, no unlabeled custom controls and no domain equations. Chart text alternatives, focus, responsiveness and actual source/target screenshots require the coordinator's real-browser review; this worker does not claim those checks.

Original/target Chromium, paired screenshots, desktop/mobile light/dark and control interaction are owned by the coordinator and remain separate evidence. Independent Argon/high approval remains pending under quota-blocked task8194e842; no retry or substituted independent review occurred. Source browser probes relayed by the coordinator are attributed as such and must be linked to its retained evidence before final acceptance.
