# B06 population implementation evidence

Scope: Simple Birth Rates, Daisyworld, Termites, Shepherds and Rabbits Grass Weeds. This report records author implementation and executed headless checks, not independent approval or browser acceptance. Exact selected identity, unchanged XML hashes, full widgets/procedures and licenses are in [source audit](selected-ecology-source-audit.md), [source manifest](selected-ecology-sources.json), and each experiment's `source.nlogox` / `NOTICE.md`. All five archive hashes were reconciled against served Web inventory before runtime. No scientific dossier was duplicated.

## Public composition and state

Each `experiments/<slug>/model.ts` exports inert `inputs`, `create` and `model`; all behavior is available through the returned headless API. `ui.ts` uses the existing `defineUI` host and detached records. Domain logic imports only public `city-library` and the existing parameter validation contract. Agent owns position/orientation/data, World membership/time, Grid fields and topology; there is no second occupancy or lifecycle owner. Shepard carries an actual canonical Sheep reference; its detached public observation exposes the reference's ID. History contains bounded detached successful-step samples (initial sample plus latest 1000); it cannot resume state.

Full uniform shuffled activations use the delivered public `Random.sample(..., {count: population.length, compatibility: "legacy-shuffle"})`. The standard weighted sampler's quadratic full-population path caused an initial Termites test timeout; using the existing uniform shuffle removed it without a private algorithm. Randomness is independent Mulberry32, not NetLogo's generator; no seeded trajectory identity or scientific distribution-equivalence claim is made. Public `read()` is pure and does not consume RNG.

## Simple Birth Rates

Defaults: 101×101 wrapped space, carrying capacity 1000, red and blue fertility 2, explicit seed 1. The setup split uses creation ordinal `< capacity / 2`, giving the extra blue at odd capacity. Parents remain alive after reproducing. Each old turtle hatches floor(fertility) plus Bernoulli fractional fertility; each newborn inherits heading and wanders by two uniform turns then one unit. Mortality independently samples all post-birth turtles with `(population - capacity) / population`, so capacity is an expectation rather than exact culling. Every ordinary generation ticks even at extinction. Red/blue/total plots record setup and post-tick values.

Public actions: `advance`, `setRules` (capacity/fertilities), `experimentStep`, `setupExperiment`, `read`. Experiment step first completes a generation, logs extinction text, resets experiment, then evaluates the second color against the reset counts, as in source. `setupExperiment` preserves output and RNG continuation while clearing population/history/tick. Host Reset recreates the model and clears output. UI exposes Repeat experiment and setup experiment, both fertilities and capacity live, spatial population, three histories and output table.

## Daisyworld

Defaults: 29×29 torus; black 20%, white 20%, luminosity 0.8, surface albedo 0.4, black 0.25, white 0.75, scenario `maintain current luminosity`, both visibility switches true, paint mode `remove`. Black initial count rounds and white floors (168 each); cells do not overlap. Initial ages are integers in [0,25). Per-agent albedo is captured at sprouting; changing the albedo slider affects future flowers, not existing ones.

Local heating uses the source logarithm and nonpositive-absorption branch, then half relaxation. Each go calculates field temperatures, performs public Moore diffusion at 0.5, then shuffles old flowers. Age increments first; age >=25 dies. Younger flowers use exactly `0.1457*T - 0.0032*T*T - 0.6443` for seeding probability, choosing an empty Moore neighbor; newborns do not activate that tick. Temperature and population history samples follow the tick; luminosity scenario adjustments occur afterwards. Ramp intervals use ticks >200 through400 (+0.005) and >600 through850 (-0.0025), with four decimal precision. Fixed scenarios enforce their values after each tick. The setup scenario also overrides initial luminosity.

Public actions: `advance`, `setRules`, `paint(x,y,mode)`, `removeAllDaisies`, `read`. Drawing does not tick. Existing daisies block replacement except removal. UI includes all live model/scenario/display/paint controls, host drawing, remove all, spatial view and all three source plots. Detached population reporters reflect immediate painting; source global plot-owned count variables can remain stale until plotting. Temperature display and daisy symbols are presentation adaptations rather than biological equations.

## Termites

Defaults: 201×201 torus, 400 termites, density20%. Fields own chips; Agents own carrying and their current procedure continuation. Search moves and wiggles until chip pickup, pickup moves20, pile search wiggles, drop search rotates/moves until empty, drop adds a chip then escape rotates/moves20 until clear. Each cycle conserves ground chips plus carried chips exactly.

Material scheduling adaptation: source Turtle forever button recursively completes its entire `go`, with no `reset-ticks` or `tick`; empty/full landscapes can keep a procedure searching indefinitely. Target `advance(n)` performs n bounded work sweeps, one resumable phase activation per shuffled termite per sweep. Phase transitions can therefore yield before the next source procedure and interleaving differs. Movement rules, chip transfer and continuity remain explicit; neither a work sweep nor a completed gathering cycle is claimed to be a NetLogo tick. Public `read().tick` is `null`, while `work`, per-agent `phase` and `cycles` are separate diagnostics. This preserves interruption and prevents recursive stack overflow; it requires explicit browser comparison rather than source-equivalence inference.

Public actions: `advance`, `read`; setup-only number/density/seed are in host setup form. UI shows work sweeps, ground/carrying counts, spatial fields and a termite inspector. Original has no plots or tick monitor.

## Shepherds

Defaults: 51×51 torus,150 sheep,30 shepherds, sheep speed0.02. Fields retain setup green variation and sampled nearby-sheep counts. Shepherds activate in shuffled order before the visible-sheep activation. Pickup hides the same sheep and moves shepherd1; later movement carries that same object. Herd detection and empty-patch release are separate activations. Release reveals the sheep, clears the canonical reference, rotates and escapes20; all shepherd actions then wiggle/move1. Visible sheep subsequently wiggle/move at the live speed.

Source plot sampling is preserved exactly: setup/tick0 and only ticks divisible by50 call nearby-sheep count/efficiency. Hidden carried sheep count in patch occupancy and Moore neighborhoods. Efficiency is `100 * sheeplessNeighborhoods / emptyPatches`; the monitor **holds its previous sample between ticks50 apart**, rather than recomputing on read. History contains only these measurement points. Public `advance`, `setRules({sheepSpeed})` and `read` expose all rules/reporters without UI. UI shows efficiency, carried count, source history and visible sheep/shepherds. Canonical hidden sheep remain in headless observations and sensing.

## Rabbits Grass Weeds

Defaults: 41×41 torus,150 rabbits, birth threshold15, grass growth15 per1000, grass energy5, weed growth0, weed energy0. Setup grows resources before creating rabbits with integer energy0–9. Empty-patch growth tries weeds first then grass even after a successful weed draw, so grass can overwrite that new weed. Existing resource patches do not regrow/change species. Extinction preflight stops before growth and time.

Each shuffled old rabbit turns twice, moves1 and pays0.5 energy; eats grass then weeds; reproduces only above the strict threshold, halves energy, and hatches a child that moves1 without activation; finally dies only below zero. Source history reports grass/weeds patch counts divided by4 and actual rabbit population. Public `advance`, live `setRules` for all five growth/energy/threshold values, and `read` back the shared UI's setup, live controls, spatial view and source population plot. Reset recreates setup; extinction disables further normal progress.

## Executed checks

Bun1.4.2. Dependencies were supplied by the coordinator as an existing pinned-install symlink; no dependency/version/lockfile changes were made here.

- `bun test tests/selected-ecology-population.test.ts`: **9 pass,0 fail,95 expect calls**, after final formatting. Covers odd split/experiment reset, stochastic capacity, thermal equations/scenario timing/albedo capture, chip conservation including empty/full landscapes, canonical carrying, held efficiency cadence, extinction, per-thousand resource rates, observation purity and atomic invalid live input.
- `bun examples/selected-ecology/01-birth-and-temperature.ts`: passed unchanged.
- `bun examples/selected-ecology/02-transport-and-herding.ts`: passed unchanged.
- `bun examples/selected-ecology/03-resources-and-invasion.ts`: passed unchanged (the invasion half is owned by the other worker).
- `sha256sum -c examples/selected-ecology/SHA256SUMS`: all five frozen scripts match; no edits.
- `bun run typecheck`: all four TypeScript projects passed after final formatting. Earlier missing Bun types and temporary other-worker diagnostics were resolved by the coordinator/concurrent implementation, not suppressed.

Source review used `frontend-design` and then `web-design-guidelines`; current Vercel rules were fetched successfully from the required raw GitHub URL. Adapters retain existing host controls, semantic names and compact tokens, with no new icons/styles/framework. Browser/screenshot/focus/theme QA is explicitly owned by the coordinator and has not been executed by this worker. No browser pass is claimed here. Independent Argon/high approval remains pending due to the already-reported quota-blocked task8194e842, with no retry or substitute review.
