# NetLogo reference models: source audit

## Source identity and attribution

Official repository: [NetLogo/models](https://github.com/NetLogo/models/tree/bf0626a89358b48494066862843a91f36f2556cf), pinned commit `bf0626a89358b48494066862843a91f36f2556cf`. All four pinned XML files declare `NetLogo 7.1.0-alpha1`. The separately fetched NetLogo Web model files declare `NetLogo 7.0.4`. Exact snapshots and SHA-256/Git blob identities are retained in [reference-sources](../../models/catalog/reference-sources/README.md) and its [manifest](../../models/catalog/reference-sources/manifest.json).

All four trimmed Procedures texts and widget XML subtrees match between the pinned and web snapshots. Whole files differ in version/serialization and trailing Info citation comments. This is file comparison evidence, not an engine-equivalence claim.

Each model Info declares **CC BY-NC-SA 3.0** and its original attribution: Preferential Attachment, Uri Wilensky 2005; Voting, Uri Wilensky 1998; Wolf Sheep Predation, Uri Wilensky 1997; Wealth Distribution, Uri Wilensky 1998. Full notices/citations remain inside every unmodified snapshot. [Upstream README](https://github.com/NetLogo/models/blob/bf0626a89358b48494066862843a91f36f2556cf/README.md) says licenses vary per model; no root LICENSE exists at this revision. [License text](https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode.en). Derived reference studies must retain attribution, identify modifications and preserve the declared license requirements; do not silently place copied model material under a general code license. Independently authored generic library operations are separate from these reference artifacts.

The [extracted widget audit](../../models/catalog/reference-sources/model-audit.json) records exact slider ranges/defaults, switches, chooser choices, monitor expressions, plot expressions and view dimensions.

## Shared execution and spatial semantics

- [ask](https://docs.netlogo.org/dict/ask.html): random agentset order; only members present when the ask starts execute its block. Sequential asks are separate activation phases, not one global shuffled population.
- [hatch](https://docs.netlogo.org/dict/hatch.html): inherits parent variables/location, gets fresh identity, immediately executes its hatch block. A newborn is excluded from its parent's already-running ask, but belongs to later population queries.
- [die](https://docs.netlogo.org/dict/die.html): terminates all remaining code for that dead agent and removes it from agentsets. A plain delete followed by further callback statements is not equivalent.
- [create-turtles](https://docs.netlogo.org/dict/create-turtles.html): initializes random integer headings and colors before its randomized initialization block. Colors are presentation here; headings affect Wolf Sheep movement. Omitting display-only color draws changes RNG continuation and must not be called trajectory-compatible.
- [stop](https://docs.netlogo.org/dict/stop.html) exits the enclosing procedure/construct and can stop a forever button. No general rule says every go invocation increments a tick.
- [neighbors](https://docs.netlogo.org/dict/neighbors.html) are unique surrounding patches, wrap at periodic edges and exclude self. [diffuse](https://docs.netlogo.org/dict/diffuse.html) distributes to eight directional neighbors, retaining missing hard-edge shares. City Library's specified grid.diffuse defaults to faces, so Wealth must explicitly select `neighborhood: "moore"`.
- NetLogo patch centers are integer x/y, increasing east/north. For min/max patch coordinates -25/25 the full extents are 51, with boundaries -25.5/25.5; Voting uses extents 151 and centers -75..75. These agree with the specified centered, unit-cell Grid context when mapped deliberately. Screen y must be inverted only in the renderer. Occupancy uses containing cell, not exact center equality.

Use model-owned RNG independently of rendering. Our Mulberry standard profile cannot promise the same seeded NetLogo trajectory. Activation order, death handling, update staging and neighborhood rules remain required even without trajectory parity.

## Preferential Attachment

[Pinned source](https://github.com/NetLogo/models/blob/bf0626a89358b48494066862843a91f36f2556cf/Sample%20Models/Networks/Preferential%20Attachment.nlogox), [live model file](https://netlogoweb.org/assets/modelslib/Sample%20Models/Networks/Preferential%20Attachment.nlogox).

Setup creates two nodes with one undirected edge, then resets ticks. Every go grays prior edges, samples one existing edge then one of its endpoints, adds one new node connected to that endpoint, increments tick, and optionally runs layout. This edge/endpoint lottery is degree-proportional attachment. It is not uniform node sampling.

After t completed steps: N=t+2, E=t+1, sum(degree)=2E. The graph is a connected simple tree. No domain stop condition. Any practical UI resource cap must be explicit, not disguised as model termination.

Widgets default plot/layout switches true. Single-step and forever buttons invoke the same go. A monitor reports node count. Histogram reports current degree counts; the log-log scatter reports log10(degree) against log10(count at degree), skipping zero-frequency bins. Both plots reset on update: neither is a historical curve. Resize toggles diameter sqrt(degree) vs 1, making area proportional to degree. Redo-layout and resize are view-only in our architecture. Upstream model positions/layout consume shared turtle state; our deliberate separation must be documented.

Core closure: Agent identity/lifecycle, Graph.add/nodes.add/edges.add, edge endpoints, graph.neighbors, Random.sample, World/run/Tick. No spatial engine is required for network drawing. Derive degrees headlessly; renderer layout may not change graph/RNG/tick.

## Voting

[Pinned source](https://github.com/NetLogo/models/blob/bf0626a89358b48494066862843a91f36f2556cf/Sample%20Models/Social%20Science/Voting.nlogox), [live model file](https://netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Voting.nlogox).

Default 151x151 torus, binary independent random votes. Both live switches default false. Capture every old Moore-neighbor sum first, then compute all votes from those sums: <3 -> 0; >5 -> 1; total=3 -> loser switch ? 1 : 0; total=5 -> loser switch ? 0 : 1; total=4 -> flip only when tie switch is on, otherwise retain own vote. The own vote is excluded from the sum.

The source tracks whether any vote changed and stops before tick when none did. Therefore a stable configuration produces no tick on the next go, and a live rule intervention may make a stopped configuration runnable again. Do not cache a permanent done flag across rule changes. Terminal-aware advance should calculate a candidate step before committing a clocked update, or otherwise use an explicitly reviewed adapter; a normal successful run(noop) would incorrectly tick. The first unchanged call still computes totals/recolors in source, but these are not additional scientific state transitions.

Monitors count blue/green colors upstream; our observations count vote=1/vote=0 and UI maps these to blue/green. Sum remains 22801 by default. Grid and population size must not be silently reduced for screenshots.

Core closure: Grid.add, fields, neighbors(moore), wrapped topology and Random. Rule equations/staged votes are model-specific. Grid indices/wrapping belong in core. Test all five threshold cases and a degenerate wrapped grid, as well as a fixed point and rule-intervention restart.

## Wolf Sheep Predation

[Pinned source](https://github.com/NetLogo/models/blob/bf0626a89358b48494066862843a91f36f2556cf/Sample%20Models/Biology/Wolf%20Sheep%20Predation.nlogox), [live model file](https://netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Wolf%20Sheep%20Predation.nlogox).

Default 51x51 torus; mode sheep-wolves; 100 sheep, 50 wolves; food gains 4 and 20; reproduction percentages 4 and 5; grass regrowth 30; energy labels false. Exact UI bounds are in widget audit. Both modes are required.

Setup: grass mode independently chooses green/brown cells; green countdown=regrowth, brown countdown=random(regrowth). Non-grass mode makes all cells green. Create sheep then wolves. Initial energy is integer random(2*foodGain), positions continuous random-xcor/ycor, heading inherits create-turtles initialization. FoodGain=0 is allowed by widgets, so random 0 must yield 0 rather than a generic invalid positive-bound sampler. Capture that model adapter behavior explicitly. Brown regrowth random 0 has the same edge case.

Go preflight stops only if no turtles, or no wolves AND sheep count exceeds Web max-sheep=10000 (desktop 30000). It does not stop merely because one species disappears. Sheep activation phase: turn right random(50), turn left random(50), move forward 1; in grass mode lose 1 energy, eat available grass and turn it brown, die if energy<0; living sheep may reproduce. Wolves activation phase: same movement, lose 1 energy, sample at most one current sheep on containing cell and delete it, gain food energy; die if energy<0; living wolves may reproduce. Reproduction halves parent energy; hatch inherits the halved energy/location/heading, then immediately turns right random-float(360) and moves 1. Newborns do not receive a second full breed action in the existing ask. Death must skip reproduction and later statements.

After animals, grass mode processes brown cells: if countdown<=0 turn green and reset countdown=regrowth, else decrement. Eating does not immediately reset countdown. Thus regrowth=0 still follows source phase order. Finally tick, then display labels. No post-step early tick suppression: extinction caused during a go still increments this completed go's tick; next invocation stops before acting.

Metrics: raw sheep/wolf counts, raw green grass count, and a separate display series grass/4. Basic mode's grass reporter is not a real count; expose an absent/disabled grass series rather than claim 2601 usable grass resources. Energy labels apply to wolves and, only in grass mode, sheep. Histories need setup and completed-step samples independent of rendering.

Core closure: spatial Agent construction, World/Space, movement/orientation/wrapping, Grid.fieldAt/agentsAt, birth/copy/delete, canonical membership, RNG, documented snapshot activation/dead skipping. Model-specific equations, species and grass countdowns stay in model. A reusable activation equivalent must not be buried in private UI helpers.

## Wealth Distribution

[Pinned source](https://github.com/NetLogo/models/blob/bf0626a89358b48494066862843a91f36f2556cf/Sample%20Models/Social%20Science/Economics/Wealth%20Distribution.nlogox), [live model file](https://netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Wealth%20Distribution.nlogox).

Default 51x51 torus; people=250, maxVision=5, metabolismMax=15, percentBestLand=10, life min/max=1/83, growthInterval=1, growthAmount=4. All bounds/defaults are in widget audit. Validate minLife<=maxLife headlessly; source sliders themselves permit reversed bounds.

Setup maxGrain=50. Independently mark best land when random-float(100)<=percentBestLand, initialize marked grain/capacity to 50 and others to 0. Repeat five times: reset marked cells to capacity, then Moore diffuse grain at rate .25. Perform ten more Moore diffusions; floor every cell and set its capacity to that floored grain. Create people on uniformly selected cell centers. Each person initially faces a random cardinal neighbor, draws inclusive life expectancy, metabolism=1+random(max), wealth=metabolism+random(50), vision=1+random(maxVision), age=random(life). Compute class categories and Lorenz/Gini before reset-ticks.

Go: first all people choose direction from current fields. Examine north, east, south, west in that order; each score sums grain at distances 1..vision, excluding the current cell. Change best direction only for a strict improvement, so ties prefer north, then east, then south, then west. Next harvest in TWO passes: each person's wealth becomes floor(oldWealth + grain/currentOccupants), then clear all occupied cells. Next each person moves forward 1, consumes metabolism and increments age. If wealth<0 OR age>=life, reinitialize variables on the SAME object at its new location; no deletion, new ID, inherited wealth or population change. Reinitialization draws a new cardinal heading and all individual parameters using current slider values.

Recompute classes from current maximum wealth: low <=max/3, middle <=2max/3, high otherwise. Grow resources only if OLD ticks % growthInterval==0, so the first go includes growth at old tick 0. Add growthAmount capped at cell capacity. Recompute inequality, then tick. There is no model stop condition and total wealth is not conserved.

Lorenz: sorted holdings, cumulative fractions at population fractions i/N, with explicit origin (0,0). Gini source sums i/N-cumulativeShare, then the widget divides by N and .5; final Gini is 2*reserve/N. Zero total wealth makes source divisions undefined; a target guard must be explicit, and the specified stats.gini zero-total contract should be preferred if used. Histograms are current class counts; class/Gini plots are time histories; Lorenz is a current curve, not history.

Parameter effects: bestLand only setup; people creates population only at setup but source also reads that slider in ongoing inequality loops, an inconsistency if changed live. Vision/metabolism/life bounds apply setup AND individual reinitialization. Growth interval/amount apply each go. Preserve meaningful live effects while explicitly declaring any safer setup-only treatment of population; do not silently claim full widget-behavior identity.

Core closure: wrapped Grid/Field, Moore diffusion, spatial movement/rotation, cell lookup and occupancy, RNG, World/Tick, headless inequality and explicit recording. Avoid unimplemented general diffusion or occupancy duplicated inside the experiment. Directional grain scoring and harvest economics are model-specific.

## Required comparison evidence

Capture reference and target at the same viewport and declared defaults: uninitialized, setup, and a recorded progressed tick. Compare controls and enabled states, initialization, reporters, legend/scales, spatial boundaries, terminal behavior and plot meanings. Screenshots verify presentation; hand-computed fixtures verify mechanisms. Different random trajectories are expected and must be distinguished from changed algorithm semantics. No browser or target checks are claimed by this source audit alone.

## Port scope and explicit adaptations

The four model entries use public City Library operations and the shared headless input descriptor validator. Target browser comparisons and independent review establish model acceptance.

- **Shared execution:** new `advance(n)` validates its entire count before acting. Successful updates run through `run`; history is recorded afterwards. Voting first computes a candidate so its no-change invocation adds no tick. Wolf source preflight conditions are retained; a step in which extinction occurs still contributes its successful tick before the next call would stop.
- **Randomness:** Mulberry replaces NetLogo's runtime RNG. Random integer headings, random population snapshots and newborn/dead visitation semantics are preserved where scientifically relevant. Display-only color initialization draws and independent, order-insensitive patch activation draws are not duplicated. Initialization distributions and mechanisms are the comparison target, not bit-identical seeded trajectories.
- **History:** each model-specific buffer retains the initial sample plus the latest 1000 completed-step samples. Voting `setVotes` replaces its latest same-tick sample; live rule changes do not add a sample. This is explicitly bounded model-local recording, not delivery of the full planned History library. Source NetLogo plot buffers are not subject to this same declared cap.
- **Preferential Attachment:** graph growth and degree/log-degree measurements are headless. Layout/camera/resize consume no model RNG and do not change topology. The shared view supplies its own layout and Fit/Reset controls; exact NetLogo spring coordinates are not reproduced. The original `plot?`, repeated `redo layout` and resize mode are presentation controls; target screenshots and UI review must identify the supplied equivalents rather than pretend the original widget set was copied.
- **Voting:** exact 151x151 default and source threshold/tie/close-call rules are retained. Public `setVotes` enables deterministic scientific fixtures. Current counts come from binary votes rather than display colors. Width/height and seed are additional explicit setup inputs. Live rule toggles display canonical values and reset stale terminal status so an intervention can restart the model.
- **Wolf Sheep:** both modes, 51x51 periodic movement, source food/reproduction/countdown ordering, energy<0 death and no-newborn-revisit behavior are retained. Web's 10000-sheep/no-wolf cap is reported as an explicit stop reason. Neutral circle/triangle animal glyphs replace NetLogo's supplied sheep/wolf vector shapes. Energy observations are public, and UI selectors supply rounded labels for wolves and grass-mode sheep for the shared renderer's label option. The source grass monitor is rounded `count/4`; the plot keeps fractional `count/4`; raw grass count remains headless.
- **Wealth:** 51x51 grid, source Moore diffusion, strict cardinal tie priority, two-pass harvest, population-preserving rebirth, old-tick growth check, classes and inequality are retained. Population is deliberately setup-only, avoiding the source inconsistency where changing `num-people` live changes inequality loop bounds without creating/deleting people. Individual life/vision/metabolism bounds still affect later rebirths; growth controls act each step. Cross-field life bounds are validated atomically. Zero-total wealth yields Gini 0 and an equality Lorenz curve rather than source division failure. These guards are explicit adaptations. Person glyphs use neutral direction triangles rather than source person shapes.
- **Provenance:** each model module includes source attribution/license/change notices; each UI includes an original-model link and model information exposes attribution. Source snapshots remain unchanged with full notices. Generic Grid/Space/stats/UI implementation is independent library/application code, not copied model code.


## Wolf Sheep source semantics

The pinned Web source, rather than a different Desktop revision, defines the functional baseline. Keep both predator-prey modes, phase order, energy thresholds and terminal checks aligned with that source.
