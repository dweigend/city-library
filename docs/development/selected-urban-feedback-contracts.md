# Positive Feedback, Path Dependence and Cells contracts

## Boundary and color rules

Positive Feedback: original all-zero with alpha0 yields441 ones and tick1 (`0^0=1`); alpha1.1 all-zero stages/commits zeros then throws Division by zero before tick. Fixture rule: all-zero activities allowed when current alpha0; otherwise reject that fixture atomically. A subsequent live change to positive alpha is allowed but advance of an all-zero state throws a normalization error without a successful tick/history insertion. Target fields remain zero and RNG unchanged because irrelevant ask shuffles are omitted; do not claim original RNG equivalence on errors. Public example01 covers these cases.

Path Dependence: original zero firms/birthtrue throws ASK/NOBODY at unchangedtick0 and exported state/RNG. Target advance throws a RangeError identifying a missing parent before any tick/RNG/history write; it is not a scientific terminal state. Advance0 remains a no-op; birthfalse/empty go still ticks. Distribution 200 produces 121 firms and distribution 100 produces zero firms. A quality-1 single firm with three attempts still traverses three cells despite certain settlement on the first attempt. Public example 03 checks empty-birth error and recovery.

Cells color contract: canonical Fields additionally own numeric `colorNumber` in[0,140). Setup and random seeding use white9.9; off uses0. `recolorCells` stages no alternate scientific state: for currently on nonseed cells, let lo=min onTime and hi=max onTime+5 over all on cells, then store min(109.9999,100+10*clamp((onTime-lo)/(hi-lo),0,1)). Source starting-color is109; original scale-color109 at −1/0/1/5/6 for bounds0..5 yields100/100/102/109.9999/109.9999. Seed markers skip normal recolor, retain color memory after cycling, and survive turn-off as markers; ordinary reactivation can therefore remain black. read exposes colorNumber and startingColor109. setCells additionally accepts optional finite colorNumber0<=value<140; when omitted use9.9 for an on seed and0 otherwise. This deterministic fixture sets supplied colors directly without automatic recolor; the next source go applies its own recolor phase.

Public cycleColors() subtracts0.01 from every currently on field, wrapping negative results by adding140; no tick/history measurement is fabricated. The original native five-iteration cycle changed9.9→9.850000000000001 and nonseed108.913043…→108.863043… at unchangedtick42. Its visual ask DOES change the original main RNG (export checked), so target omission of display-only shuffle is an explicit adaptation, not a claim that the original consumed no draws. Target cycleColors is deterministic/no-RNG, preserving seeded scientific replay under presentation cadence. Example04 freezes memory/wrap/no-tick behavior. Generic numeric-color-to-CSS projection belongs in reusable ui/,not a private model helper. Host cycle repeats the same public action independently of go, using the existing repeat contract. Exact color RGB/pixel cloning is unnecessary; numeric phase/memory semantics and visual action remain required.

## Source provenance and retained licenses

Canonical selected paths all begin `Curricular Models/Urban Suite/`. Source bytes were copied unchanged from the existing committed research evidence, parsed as NetLogo7.0.4 XML, and independently matched against the canonical-path served inventory. All three correspond byte-for-byte to Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`; neither desktop repository membership nor a live unpinned copy is substituted.

| Final path component | Slug | SHA-256 |
| --- | --- | --- |
| Urban Suite - Positive Feedback | urban-suite-positive-feedback | ed8e7de693797f0ebe625d742032dbf95614e0a31c88b41eed83db3a47ff42b6 |
| Urban Suite - Path Dependence | urban-suite-path-dependence | 1b5216c6077d80c441626f1cdb9c108a73adca17a17be4020adeb96e2e67e931 |
| Urban Suite - Cells | urban-suite-cells | 6bcdecbd9481862b3068de6aa1a4440cf7eb253466688226e2fb1fde4f8f7ec2 |

Each experiment folder contains `source.nlogox` and `NOTICE.md`, preserving complete original Procedures, Widgets, Info, shape definitions, credits/citation and copyright/license notice. Copyright2007 Uri Wilensky, **CC BY-NC-SA3.0**. Positive Feedback and Cells cite Wilensky(2007), with thanks to Seth Tisue and Craig Brozefsky respectively; Path Dependence cites Rand and Wilensky(2007) and thanks Bill Rand. The model license is separate from NetLogo's software license and the library's code license. No include or extension declaration occurs in the three sources. Cells uses bounded dynamic `runresult` strings from closed chooser values; that does not authorize a target code-evaluation runtime.

## Shared core capabilities and ownership

Read the current root exports, Grid, Agent spatial/perception, Random sampling and World/run implementations, relevant API reference and binding architecture. Existing public closure supports the scientific mechanisms:

| Requirement | Existing public composition |
| --- | --- |
| Fixed toroidal patch fields, simultaneous value staging | Grid.create/fields/fieldAt/neighbors with field-owned model data. Compute all new values before committing the next state. Temporary scratch maps are not a second state authority. |
| Canonical firms, cardinal rotation/movement and hatch | Agent.create/rotate/move/copy, World.create/agents, run. No private population list or duplicate coordinates. |
| Same-cell occupancy | Attached Grid.agentsAt(field), current Agent positions; no writable cell-resident registry. |
| Regional radius population | Filter canonical World.agents using public agent.distanceTo(field or agent,{space:world.space}) <= radius. This includes the query firm itself, unlike Agent.neighbors, which deliberately excludes self. Do not introduce a model-private toroidal distance engine. |
| Five Cells neighborhoods | Grid.neighbors faces/Moore, native Set union/difference of canonical Fields. H removes vertical faces from Moore; displaced-von-n removes all faces. Moore-von-n is Moore plus two face-neighbor hops and the current field, producing13 unique fields on this81² torus. No duplicated topology engine. |
| Uniform draws and random activation | Random.number, Random.sample and explicit floor(draw*n) for source integer trials. Behavior-dependent asks snapshot references before activation. |
| Rank distribution and histogram | Ordinary sorted detached numeric arrays; stats.histogram for ten explicit bins, after model measurements select units/bounds. No new generic statistics engine. |

One World/attached Grid/Random per model. Only Path Dependence adds Agent firms; the other two use canonical field state. Named procedures must make the source update order legible. Model-specific equations remain ordinary headless compositions. `read()` consumes no draws, advances no time and returns detached deeply frozen records; source monitors that randomly break ties cannot consume the simulation stream during target reads. Setup replaces the model instance, with no second reset clock. Histories retain setup plus latest1000 successful ticks by existing convention, recording after `run` advances World.tick. Same-tick interventions replace the current sample rather than fabricating ticks.

Path empty birth, Feedback zero powers/divisor and Cells color memory follow the boundary rules above. These are not reasons to omit the selected models or add a hidden replacement runtime.

## Shared author surface

The `models/<slug>/model.ts` exports `inputs`, `create(options={})`, `model` using the existing Definition/parameters conventions. Instances expose `read()`, `advance(count=1)`, model-specific `setRules` and the named interventions below. Fixed dimensions are not user parameters. Seed1 is a target replay key, integer−2147483648..4294967295, explicitly Mulberry rather than NetLogo's RNG.

`read()` includes `tick,width,height,parameters,cells,history,randomState,done`. Cells have canonical `id,x,y` plus the listed fields. `done` is alwaysfalse: none of these sources has a scientific stop/convergence rule. A stable, empty or saturated state still ticks. Path additionally returns firms/counts/warnings and regional/occupancy reports. Validate advance counts and all input/fixture data atomically through existing conventions; reject unknown keys, accessors, malformed records, nonfinite data and out-of-step rule values before writing state/RNG/history. Arrays must have exact required lengths. Snapshot IDs remain opaque and observations are ordered by canonical insertion, never by parsing IDs.

## Positive Feedback: exact mechanism

Native world21×21, x/y−10..10, toroidal. Live parameters `alpha`1.1,0..2 step0.01; `mooreNeighborhood`false. Setup clears state and assigns an independent random-float[0,1) activity to each patch, colors it with9.9*activity, sets plot x-range0..441 and resets ticks. **Setup does not divide by the maximum.** Info's normalized-distribution description must not be extended to the initial field silently.

Each go:

1. Snapshot all old field activities. With Moore on, stage `((oldSelf + sum(oldEightNeighbors))/9)^alpha` per field. With Moore off, stage `oldSelf^alpha`.
2. Commit every staged value before computing `scalingFactor=max(staged)`.
3. Divide every value by that same global maximum, then recolor and tick. Do not normalize by sum, retain old maxima, perform sequential in-place smoothing, substitute conserved diffusion, or apply a generic preferential-attachment process.

No runtime randomness is scientifically needed after setup: source ask order and recolor order do not affect these simultaneous equations. Target may omit their shuffles; record that adaptation. The source plot clears and redraws **descending sorted activity values**, not a binned histogram or a time series. Proposed `activityDistribution` is the descending441-value array, plus `totalActivity` and `maxActivity`; history may add these two clearly identified target diagnostics. All activity values stay in[0,1] in the normal source closure. With no Moore averaging and alpha1, a normalized state is stable but still ticks. With Moore averaging, total activity is generally not conserved after normalization.

Frozen `setRules` accepts only alpha/mooreNeighborhood, applies next go without tick/RNG/state retroactive change. Frozen `setActivities(readonly number[])` supplies441 finite[0,1] values with at least one positive value unless current alpha is0, preserving field identities/tick/RNG and refreshing the same-tick observations. The conditional positivity restriction is an explicit fixture precondition: an all-zero field with positive alpha gives a source zero normalization divisor, so the target fixture must not invent a silent all-zero repair. A future browser test should record source all-zero behavior, rather than claim a successful source guard. Alpha0/zero-base and subsequent positive-alpha failure are now asserted in frozen example01, based on the executed original. Source setup draws make all-zero initial fields extraordinarily unlikely, not a mathematical guarantee.

## Path Dependence: preserve the code, including defects

Native11×11 torus, x/y−5..5. Setup parameters: `initialFirms`200,0..1000 integer; `distribute`false. Live `regionSize`0,0..5 integer; `increasingReturns`0.5,0..1 step0.01; `attempts`1,1..20 integer; `birth`false.

Setup resets ticks **before** creating firms/qualities. With distribute off, create initialFirms firms, immigrate each, then give each a uniform integer-patch location. Immigrate sets movedIn=false, red/person presentation and heading=(integer random4)*90. Update relative sizes/largest regional population; then assign independent quality random-float[0,1) to each patch and color it, then draw the residents histogram.

The actual distribute branch is inverted. If initialFirms>121, it repeats initialFirms times: randomly ask **all currently empty patches** to sprout one firm. The first repeat fills all121 patches, subsequent repeats find none, so200 requested produces121 firms with one per cell. If initialFirms<=121, it creates **zero firms** and calls `user-message "Can't distribute, fewer patches than people."` even though that message contradicts the condition. Do not repair the comparison or generate the requested number under a supposedly faithful port. Proposed headless `warnings` retains this source message as data rather than opening a browser dialog; paired source/target reports must identify the original dialog and this adaptation.

Each go:

1. If birth is on, source chooses one existing turtle uniformly and hatches one immigrant **at its parent's current cell**, movedIn=false with a fresh cardinal heading. It does not birth at a random new patch. Executed original behavior with zero firms is an ASK/NOBODY error before tick/RNG changes; the target missing-parent error policy and public example03 above preserve this boundary.
2. Cache largestPopulation=max over all patches of regional population. `population` counts **all firms**, searching or settled, within Euclidean toroidal radius regionSize of the current patch/turtle. Turtle context includes itself. Info's statement that regionSize1 includes only the current patch is false: radius1 includes cardinal neighboring centers.
3. Snapshot all moved-in firms and randomly activate. Each compares random-float1 > suitability and marks movedIn=false if passing. Suitability is `patchQuality*(1-increasingReturns) + increasingReturns*(currentRegionalPopulation/cachedLargestPopulation)`. Equality does not move out.
4. Snapshot all currently searching firms, including those just moved out, and activate randomly. For each firm, repeat **all attempts**, even after it has settled on an earlier attempt: turn right(integer random2)*90, then left(integer random2)*90, move forward1, draw random-float1 < suitability and set movedIn=true on success. A later failed trial does not undo a previous movedIn=true; there is no break. Suitability uses current positions, so previous searchers and previous attempts affect later counts, while cachedLargestPopulation remains from before searching. Do not clamp suitability to1: source may exceed1 after concentration changes.
5. Recompute largest regional population and display-size ratios; tick; draw histogram. No emigration is called, despite the unused emigrate procedure. Birth adds at most one per successful go, no exogenous-rate slider and no arbitrary population cap.

Frozen `setRules` accepts regionSize/increasingReturns/attempts/birth; changes next phase, no immediate move/tick/RNG. `disturb()` sets all current firms movedIn=false, preserving coordinates/headings/clock/RNG. Proposed `setFirms(readonly {x,y,heading,movedIn}[])` replaces firms with canonical Agents at exact integer patch centers−5..5 and cardinal headings0/90/180/270; finite typed boolean state, no artificial count cap. This restriction preserves the source's reachable spatial closure and avoids arbitrary subcell fixtures making patch radius0 denominators undefined. `setQualities(readonly number[])` supplies121 finite[0,1] values in field order. Both interventions are deterministic target fixtures, preserve tick/RNG and refresh measurements.

Read `firms` records id,x,y,heading,movedIn; `counts={firms,settled,searching}`; `largestPopulation`; cells add quality and **occupants** (all same-cell firms). Source Residents histogram includes only **nonempty cells**, with10 bins, x-range[0,1+maximumOccupants]. It counts patches per occupancy bin, not firms per bin, not only settled firms, and not regional population. Source winning-area monitor chooses a random tied patch maximizing same-cell occupancy, then shows its quality; this is not necessarily a maximum-regional-population patch. Proposed pure `winningAreas` returns all tied cells/qualities, with a clearly declared deterministic UI tie choice or full tie display. Do not consume simulation RNG from read merely to emulate a monitor's random tie break. Exact tie-display adapter is a later recorded presentation decision, not asserted by current examples.

## Cells: snapshot growth, strict aging and persistent seed markers

Native81×81 torus, x/y−40..40. All scientific controls are live: `neighborhood` source enum von-neumann(default),moore,displaced-von-n,h,moore-von-n; `countRule` source strings `> 0`,`= 1`(default),`<= 2`; `probability`100,0..100 integer percent; `ageLimit`55,0..100 integer. Translate the closed source runresult expressions to explicit typed comparisons; no eval/transpiled NetLogo.

Setup clears all fields on=false,onTime0,seed=false; resets ticks before seeding; turns on cell(0,0), records onTime0,marks seed=true/colors white, then captures on-cells and recolors nonseed cells. This seed is the only initial on cell. `addRandomSeed()` is the source random-seed action: independently choose integer x/y from−40..40; turn on that cell, overwrite onTime with current World tick, mark seed=true, set white, update current on-cells/coloring. It may hit an already-on cell and refresh its lifetime; it does not add a tick.

Go phase order:

1. Set minOnTime=pre-step ticks−ageLimit. Select a snapshot of **currently off** fields satisfying turn-on? before any activation is committed. Each field counts currently-on fields in its chosen neighborhood, requires count>0 even with rule<=2, then applies the closed count rule, then draws integer random100<probability. No probability draw when count/rule fails; a qualifying field still draws at probability0 or100. Do not optimize these endpoints away if retaining declared target draw order.
2. Randomly ask the selected fields to turn on, setting onTime to **pre-step** World tick. No within-tick propagation or cascade from newly activated fields.
3. If ageLimit>0, select every field with onTime<minOnTime and turn it off, reset onTime0 and color black. This is a strict comparison against pre-step time and is **not restricted to currently-on fields**. Thus ageLimit1 initial seed survives two completed go calls and dies on the third. AgeLimit0 disables expiry. Newly active cells have current pre-step onTime and do not expire in that go.
4. Capture current on-cells and recolor nonseed on-cells; manually plot count before tick; tick. Empty/saturated/stable fields do not stop. Source plot has no initial count point at Setup; its first manual x0 point is the first go's result while the visible clock becomes1. A target history with Setup/tick1 samples is a declared x-coordinate/initial-sample presentation adaptation, not identical source plot indexing.

Neighborhoods use actual code, not generic names:

- von-neumann: four face neighbors.
- moore: eight surrounding fields.
- displaced-von-n: Moore minus faces, four diagonals.
- h: Moore except north/south, six fields (east/west and four diagonals).
- moore-von-n: all Moore fields plus four cardinal distance2 fields **and self**,13 fields. `patches in-radius 2` with shared x/y conditions includes the current patch. Eligible off cells contribute zero from self, but the actual neighborhood still includes it. Compose public canonical adjacency rather than a private offset engine.

Frozen `setRules` accepts the four controls above. `setCells(readonly {on,onTime,seed}[])` is a deterministic target fixture of exactly6561 records in field order; require booleans and integer0<=onTime<=currentTick. It preserves identity/tick/RNG and refreshes current counts/history. Seed remains independent of on: source turn-off **does not reset seed-p**. An expired seed marker may persist forever; ordinary later activation does not automatically turn it white. Read fields expose on,onTime,seed; `counts={on}`; optional derived age is currentTick−onTime, not a lifetime counter. No second writable on-cells registry is needed; derive it from canonical fields.

### Source-timed color-cycle host contract

The source cycle-colors forever button independently applies pcolor−0.01 to every currently-on field and display, without tick but with display-only ask-shuffle RNG consumption. This visual state has memory: go overwrites nonseed on-cell colors using onTime, but skips seed markers; turn-off writes black while retaining seed-p, so a later ordinary reactivation of an expired seed may remain black. Source setup's starting-color=blue+4 and scale-color age mapping, and its persistent seed/cycle behavior, must be distinguished from generic age coloring.

Use the shared headless/source-timed approach: canonical Field numeric colorNumber, public cycleColors and optional fixture colors are frozen above; reusable numeric-to-CSS conversion belongs in ui/. Original numeric phase and memory behavior have been browser verified. No undisclosed palette logic in scientific equations, no fake source command, and no omission of the actual cycle action. A pixel clone is unnecessary, but preserved/changed functional visual interactions must be explicit and browser tested. The same rules apply to headless and browser use.

## Public examples

Public examples under `examples/selected-urban-feedback/` use public model entries, assertions and detached observations.

1. Positive powers/global normalization: exact .25²,.5²,1² with max normalization; descending distribution; alpha1 stable state still ticks; no runtime scientific RNG.
2. Moore wrap: single corner impulse spreads into exactlynine normalized unit cells across both toroidal boundaries; total9 demonstrates nonconserved normalization.
3. Path source branch/Disturb: requested200 distributed produces121; requested100 distributed produces0 plus source warning; Disturb is same-tick/no-RNG; searching firms still count toward largest population.
4. Cells snapshot/strict age: first population1→5→9 under defaults, new onTime=pre-step tick; ageLimit1 dies only on third go; seed marker survives expiry; random seed adds one current-time cell without tick.
5. Defaults/isolation/atomic fixtures: exact dimensions/defaults, unnormalized Feedback setup, Path200searchers, fixture validation and deeply frozen isolated Cells snapshots.

These are deliberately not exhaustive. Additional behavior checks must cover Path consecutive search attempts after successful move-in, live region-radius counts at wrap, cached max versus dynamic search positions, source birth order/newborns, empty-birth decision, and randomized winning-area adaptation. Cells needs all neighborhoods/rules, simultaneous probability eligibility, seed reactivation/color-cycle memory, strict lifetime/live limit changes and all-zero empty field continuation. Positive Feedback needs exact alpha0/zero boundary, independent nonlinear smoothing then normalization and all-zero source error observation.

## Required browser acceptance

For **each** model execute the concrete official served original and target in real Chromium; hash the actually loaded source against the archive, record version/defaults/settings/actual ticks/RNG policy. Retain paired Setup/progress screenshots and appropriate target desktop/mobile light/dark screenshots, native controls, inspection and console/runtime diagnostics. No scientific metadata/structure check or source analysis replaces this baseline.

Positive Feedback: native setup/go-once/go-pause, live alpha0/1/>1 and Moore toggle; compare exact explicit impulse/power fixtures through recorded original Command Center interventions and target public fixtures, distinguish those from native widgets. Compare rank distribution, max normalization and total nonconservation; record all-zero divisor behavior, no invented successful source guard. Don't present independent random initial fields as trajectory parity.

Path Dependence: default200 setup and actual progressed ticks; birth/live radius/increasing returns/attempts and Disturb. Test distribute=true with200 AND100, preserve original native user-message/modal result and target warning adaptation. Explicitly test initialFirms0,birthtrue before settling that unresolved contract. Matched fixtures must show that search continues after settling and population includes self/searchers. Source monitor tie values and source histogram units must remain explained.

Cells: native Setup/step/go40/go-pause/randomseed/cyclecolors, all chooser/rate/lifetime controls and pointer/keyboard/UI equivalents. Widget says **go *40** and actually repeats40; Info incorrectly says go*80/80ticks. Verify first counts1→5→9, pre-step onTime/strict expiry and cycle while go is paused. Capture seed-marker color memory/ordinary reactivation as a source-specific visual case before claiming the host contract implemented. No terminal rule at empty field.

Model acceptance requires paired browser comparison and independent review.
