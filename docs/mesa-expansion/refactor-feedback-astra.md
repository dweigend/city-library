# Independent logical review before refactoring

Date: 2026-11-09. Reviewer: OpenAI `gpt-6-astra`, high reasoning, through the Codex harness in T3 Code. This is the requested research review, not an implementation or routine style review. No delegated reviewers were used.

Baseline: branch `feat/mesa-mechanisms`, commit `215b13f0d75de67f1d15774035d98e7bc8359956`. Initial `git status --short` was empty. All locations below refer to that baseline. The only repository edit made by this review is this English report. No code, UI, CSS, reference example, public contract, commit, server, or browser tab was changed.

## Scope and evidence

Read all ten complete `model.ts`/`ui.ts` pairs: neighborhood-heat-intervention, household-energy-demand, residential-occupancy, pedestrian-crossing-phases, solar-battery-microgrid, stormwater-retention, urban-tree-watering, household-recycling-behavior, zoning-scenario-comparison, workplace-household-membership. Model factory, actions, reads and presentation projection were considered together.

Preparation: AGENTS.md; full docs/CODING_STANDARDS.md; README and PLAN including the example-first gate; relevant ownership, time/randomness, domain-layout and public-contract architecture rules; DESIGN; binding terminology; docs/ui/README.md and UI API reference. Read the complete refactor-model-scripts skill and decision examples from `/home/david/Projekte/city-library/.agents/skills/refactor-model-scripts/`, and the complete shared workflow from its sibling `../references/refactoring-workflow.md`. The first attempted workflow path incorrectly placed it inside the skill's references directory; that read failed and was corrected. The main checkout was read only.

Read the Fire, Traffic 2 Lanes and Preferential Attachment model/UI references without modifying them. They are authoring/order references, not claims of shared physics or identical behavior. Read relevant current tests, frozen Mesa dynamics/measurement public scripts, parameter validation and the implementation contracts for activation, continuous crossings and History. No other new review report was consulted. Existing approval statements in PLAN are context only.

The ten models explicitly describe original synthetic teaching rules. This review does not turn them into validated physics, traffic safety, demographic forecasts or Mesa upstream reproductions. Original keys, opaque framework IDs, scientific disclaimers and provenance remain intact.

## Findings requiring a decision

### ASTRA-01 — Medium — finite models do not bind completion to the UI

Classification: observed source omission and independently verified terminal model behavior; resulting browser playback behavior is a source inference, not browser-verified here.

Locations:

- `experiments/residential-occupancy/ui.ts:4`, model.ts:43 and :57.
- `experiments/pedestrian-crossing-phases/ui.ts:4`, model.ts:44 and :51.
- `experiments/zoning-scenario-comparison/ui.ts:4`, model.ts:42 and :60.
- Supporting host evidence: `ui/compose.ts:122`, `ui/svelte/session.ts:91` and :145.

Exact beginning of the crossing declaration:

```ts
export const ui = defineUI(model, {
  monitors: [{ label: "Minute", value: state => state.tick }, { label: "Signal", value: state => state.signal },
```

None of the three declarations supplies `complete`. Both hosts use `spec.complete?.(state) ?? false` (the Svelte variable is named `observation`); they do not infer it from `state.done`. Their terminal `advance()` calls are correctly inert, so a missing completion binding is hidden by unchanged pictures and measurements. Continuous playback can continue scheduling no-op model calls and projections; the interface does not recognize completion.

Independent public-API reproduction, run with `bun -` from the worktree:

```ts
import { create as crossing } from './experiments/pedestrian-crossing-phases/model.ts';
import { create as housing } from './experiments/residential-occupancy/model.ts';
import { create as zoning } from './experiments/zoning-scenario-comparison/model.ts';
for (const [name, create] of [['crossing', crossing], ['housing', housing], ['zoning', zoning]]) {
  const m = create();
  m.advance(100);
  const s = m.read();
  m.advance();
  console.log(name, { tick: s.tick, done: s.done, unchanged: JSON.stringify(s) === JSON.stringify(m.read()) });
}
```

Actual results: crossing `{tick:5, done:true, unchanged:true}`; housing `{tick:24, done:true, unchanged:true}`; zoning `{tick:6, done:true, unchanged:true}`.

Concrete correction: bind `complete: state => state.done` in those three existing declarations. No shared-host change, new API, changed model termination or weakened assertion is needed. This is a UI behavior correction, not a behavior-preserving refactor. Record the decision separately and verify Run stopping and Step disabling in the real browser after authorization within the implementation task. Preserve the approved visual composition and explicit occupancy actions/live controls. This review did not perform that correction or its browser verification.

No observed numerical, ownership, balance, activation-order or seeded-trajectory defect was found in the exercised model behavior. ASTRA-01 is the only actionable defect candidate from this focused review; the decisions below are not additional alleged defects.

## Model-by-model simplify/retain decisions

### ASTRA-02 — Informational — retain synchronous heat exchange and its arithmetic order

Locations: neighborhood-heat-intervention/model.ts:15, :23–31, :39–43; ui.ts:18–36.

Before:

```ts
const exchange = neighbors.reduce((sum, neighbor) => sum + neighbor.heatIndex - field.heatIndex, 0) / neighbors.length;
return Math.max(0, field.heatIndex + exchangeFraction * exchange - (field.shaded ? settings.shadeCooling : 0));
```

Retain `twoPhase`: all neighbors must expose old values until all computes finish. In-place field updates create an order-dependent rule. Retain the direct field properties and local formula rather than extracting a universal diffusion wrapper. Degree-normalized exchange on a finite boundary is not a promise of conservation of unweighted total heat. Do not replace it with a physical diffusion solver or reclassify that synthetic choice as a bug. Odd widths shade `ceil(width / 2)` positions in each indexed row, as the strict comparison defines; changing to exactly half the fields changes the rule.

A local readability improvement can name the mean exchange, but preserve the exact accumulation order: rewriting `(sum + neighbor) - field` as `sum + (neighbor - field)` can change floating-point results. No neighbor cache is needed at this scale. Retain the stable color scale, real field IDs/coordinates and separate shade hatching. Widths 2, 3 and 12 with cooling 0, 0.5 and 2 stayed in [0,30] through 140 steps; zero-cooling uniformity is covered by executed tests. Minimum width ensures nonempty neighborhoods; no speculative zero-neighbor branch is needed.

### ASTRA-03 — Informational — retain completed-interval demand and separate live settings

Locations: household-energy-demand/model.ts:24–30, :37–46; ui.ts:12–16, :21–44.

Before:

```ts
loads.energyKwh += loads.demandKw;
demandHour: world.tick.value === 0 ? 0 : (world.tick.value - 1) % 24
```

One run integrates one hour at the old World tick; the observation reports the completed interval's demand, with the new tick as its end. The daily integral is `households * (24 * 0.3 + 3 * 0.9)`, independent of a constant shifted share. Do not recompute `demandKw` from the new live setting inside `read()`: that would change the meaning of the displayed last interval without changing cumulative energy. Reproduction: 10 households, shiftedShare 1, `advance(13); setShiftedShare(0)` returns tick 13, demandHour 12, demandKw 12, current shiftedShare 0. This is deliberate interval/current-control separation, not a stale-state defect.

Retain the small `loads` owner and public `demandMeasurement`. The two short time-window expressions are clearer than a schedule abstraction. A named one-hour interval could clarify units, but retain equivalent floating-point operations and exact values. Household glyphs are aggregate display copies, not independent residents. Keep houseOutline as a cohesive geometry helper and keep its use below the declaration. The inspector accepts any `household:` prefix; a stricter current-index lookup would improve defensive stale-selection handling, but no ordinary reachable stale-selection failure was reproduced (setup clears selection). Do not promote that concern to a required fix or change the key scheme.

### ASTRA-04 — Informational — retain Resource as sole occupancy owner

Locations: residential-occupancy/model.ts:21–36, :43–57; ui.ts:23–41.

Before:

```ts
const ticket = tickets.find(ticket => ticket.status === "granted");
if (ticket) housing.release(ticket);
// ... setSlots
housing.setCapacity(next.slots);
settings = next;
```

Ticket status is authoritative; eligibility edges do not imply residence. Release immediately grants the next FIFO waiter, so occupancy can remain unchanged while one household moves out. Keep capacity validation/mutation before publishing new settings: reversing the assignments would make a rejected shrink leave inconsistent parameters. Do not cache occupied/waiting counts or store a second assignment map. The private ticket list preserves original request order; do not sort it for a prettier visual. `moveOut` is a useful public domain operation, not a redundant wrapper.

The periodic rule uses pre-increment ticks 2,5,8,..., recording completed days 3,6,9,...; manual moveOut does not advance a day or rewrite History. History requires strictly increasing ticks, so adding a record in the action would fail at the current tick. Keep that sampling boundary. Synthetic slot positions and queue lanes are explicitly schematic; real household IDs remain selection keys. Independent probe increased capacity 1→20 for 40 applicants, confirmed a rejected shrink to 1 was atomic, then mixed a manual release with automatic completion. See ASTRA-01 for the separate UI completion issue.

### ASTRA-05 — Informational — preserve crossing's interval boundary and explicit stage commit

Locations: pedestrian-crossing-phases/model.ts:23–37, :43–51; ui.ts:17–32.

Before:

```ts
const canCross = green();
twoPhase(selected, {
  compute(person) {
    if (person.stage === "crossing") return "arrived";
    if (person.stage === "waiting" && canCross) return "crossing";
    return person.stage;
  },
  commit: (person, stage) => { person.stage = stage; },
});
```

Actual one-minute-green trace (tick, signal, waiting, crossing, arrived): `(0,red,8,0,0)`, `(1,red,8,0,0)`, `(2,red,8,0,0)`, `(3,green,8,0,0)`, `(4,red,0,8,0)`, `(5,red,0,0,8)`. The signal is the current boundary's signal; the newly crossing cohort entered during [3,4). Arriving while red is consistent with the synthetic stage rule. Changing it to use the post-increment signal or require green again for arrival changes accepted outcomes. No traffic physics or clearance interval should be invented here.

Possible simplification: the fixed activation currently only copies canonical living walkers to `selected`; because this factory exposes no deletion/membership action, direct `twoPhase(walkers, ...)` would preserve present public trajectories. Decision: retain this explicit activation/two-phase composition in this teaching slice unless removing the activation demonstration is intentionally approved. Do not extract a generic activation-to-array adapter. Giving the local snapshot a more explanatory name is sufficient. Keep the frozen person observations and discrete schematic positions. Green lengths 1,2,4 all completed at tick 5 in independent probes. See ASTRA-01 separately.

### ASTRA-06 — Informational — retain battery's raw endpoint, clipping and interval projection

Locations: solar-battery-microgrid/model.ts:15–31, :37–45; ui.ts:7–38.

Before:

```ts
const raw = continuous.linear({ value: state.energyKwh, rate: solarKw - settings.demandKw, duration: 1 });
const crossing = continuous.crossing({ from: state.energyKwh, to: raw, threshold: reserveKwh, duration: 1, direction: "falling" });
state.importedKwh += Math.max(0, reserveKwh - raw);
state.exportedKwh += Math.max(0, raw - capacityKwh);
state.energyKwh = Math.min(capacityKwh, Math.max(reserveKwh, raw));
```

The unconstrained endpoint must feed crossing detection before clamping. Clamping first would move a crossing to the end of the hour. Preserve the strict start-side crossing contract: staying at reserve does not count every subsequent deficit hour. The invariant is `Δstored = solar - demand + intervalImport - intervalExport`, for the one-hour interval. Startup uses one `floor(random.number()*24)` draw; replacing it with another integer-sampling API is not justified by the same distribution.

Simplify locally by naming `raw` as an unconstrained energy endpoint if desired, without moving or combining operations. Keep the cohesive plain state record; a battery class, universal stock-flow helper or extra interval-state cache buys nothing here. The two most recent retained samples are sufficient even after history eviction; maintain capacity 120 and sample-after-every-step semantics. Tick-zero rates are explicitly labelled initial rates. The quarter-kWh gauge is declared rounding, not lost domain precision. Tested 45 seed/rate configurations for 150 intervals each, including both limits and long operation beyond history capacity; balances and storage bounds held.

### ASTRA-07 — Informational — retain stormwater's synthetic net-rate interval and action boundary

Locations: stormwater-retention/model.ts:18–32, :37–48; ui.ts:15–37.

Before:

```ts
const drainageM3 = Math.min(hourlyDrainageCapacityM3, state.storedM3 + inflow);
const raw = continuous.linear({ value: state.storedM3, rate: inflow - drainageM3, duration: 1 });
```

This rule explicitly permits drainage of water entering during the hour. Replacing it with `min(capacity, oldStorage)` changes both discharge and overflow, even though it might look more sequential. Keep crossing interpolation against the raw endpoint, then accumulate flows and clip storage. Do not introduce continuous hydraulics: this is the declared synthetic net balance. The cumulative invariant is `stored + discharged + overflow = inflow`; interval deltas obey the same balance.

Naming `raw` as unconstrained stored volume and naming the hour duration would improve local reading without abstracting the rule. Keep catchment fields as the geometric source, the basin as an aggregate owner, and the projection's schematic basin separate. A live rain change updates the current control/catchment tint, while interval flow labels retain the last completed interval until the next step; do not silently rewrite history or counters. Tested capacities 1,3,10 for 160 steps with alternating 20-hour rain/dry periods; depletion, refill, clipping and balances held beyond history eviction. A clearer interval label is a possible presentation decision, not a verified defect or permission to redesign the approved view.

### ASTRA-08 — Informational — retain pre-watering priority and post-watering loss

Locations: urban-tree-watering/model.ts:15–17, :27–39, :45–47; ui.ts:19–41.

Before:

```ts
const amount = Math.min(remainingLiters, moistureCapacityLiters - self.moistureLiters);
self.receivedLiters = amount;
self.moistureLiters += amount;
remainingLiters -= amount;
```

Priority is computed once from initial moisture, sorted stably, and each tree is filled greedily before the next. This is not water-level equalization. Do not repeatedly select the now-driest tree, lose stable ties, apply daily loss before allocation, or replace the second fixed activation with shuffled activation. Assign zero receivedLiters on dry/no-budget days; otherwise yesterday's visual droplet and measurement would persist. `totalWaterLiters` is a justified cumulative owner because the bounded History eventually evicts earlier allocations.

Retain two adjacent activations: their boundary makes causality clearer than one combined callback. Keep one initialization RNG draw per tree and no later draws. Independent oracle checked exact allocation vectors and moisture-after-loss for 5 seeds × budgets 0,1,100 × 20 days with 40 trees. The UI's stable per-moisture color and separate water marker accurately show these different quantities; retain them and their keys.

### ASTRA-09 — Informational — preserve zero-probability RNG draws in recycling

Locations: household-recycling-behavior/model.ts:27–38, :43–47; ui.ts:18–25.

Before:

```ts
if (household.recycling) return true;
const peers = graph.neighbors(household);
const share = peers.filter(peer => peer.recycling).length / peers.length;
return random.number() < settings.influence * share;
```

Every nonadopter consumes one draw, including zero influence or no recycling peers. Existing adopters consume none. Adding an early zero-probability return shifts later seeded outcomes after a live influence change. In-place commits permit a same-step cascade; retain twoPhase and fixed order. Minimum population 3 guarantees two distinct ring peers. Do not silently make edges directed.

The activation-to-array observation from ASTRA-05 also applies here; retain the explicit teaching composition rather than a shared wrapper. A local name such as `adoptionProbability` can expose the formula while retaining the unconditional draw for nonadopters. Direct agent state and graph queries are clearer than a parallel adoption-state map. A separate public Random oracle reproduced all adoption vectors for seeds -2147483648,0,1,17,4294967293 over 40 steps with influence 0 for steps 0–4, 0.5 for 5–14 and 1 thereafter. Extra reads were inserted. Fixed ring layout uses no RNG and preserves actual edge IDs/endpoints.

### ASTRA-10 — Informational — preserve paired replications and terminal-only summaries

Locations: zoning-scenario-comparison/model.ts:18–37, :45–60; ui.ts:21–47.

Before:

```ts
const plan = experiments.replicate(scenarios, [settings.seed, settings.seed + 1, settings.seed + 2]);
// inside each replication
step() { state.slots += random.number() < 0.8 ? parameters.cap : 0; state.evaluated += 1; }
```

One outer tick completes one entire replication, not one parcel. Paired seeds deliberately create the same buildable count across the two caps. Do not use one advancing shared random stream across runs, reorder the plan, pool time samples or average pending runs as zero. The bounded upper seed accommodates the +2 operation. Summaries are calculated from completed terminal outcomes, not displayed buildings. `slots / cap` is integral under this rule; the projection may group aggregate slots without claiming actual parcel locations.

A purposeful small extraction is a named local replication factory for the nested `create` body (lines 27–32), making the outer study lifecycle easier to read. Keep state and Random inside that factory and preserve one draw per evaluated parcel, plan identity, result ordering, sampling budgets and stop-condition precedence. Do not replace experiments.run with a direct ad hoc loop merely to shorten the script. Retain derived runPlan metadata rather than guessing scenario boundaries in UI. Five seeds at parcels=100/baseCap=10 produced equal normalized buildable counts across caps 10/12 and stopped at outer tick 6. Existing tests verify default paired results and summary replication counts. See ASTRA-01 for completion binding.

### ASTRA-11 — Informational — retain one membership Graph and canonical references

Locations: workplace-household-membership/model.ts:13–37, :43–61; ui.ts:9–16, :22–32.

Before:

```ts
const workplace = membership.neighbors(resident).find(member => "kind" in member && member.kind === "workplace");
const next = workplace === places[2] ? places[3]! : places[2]!;
const edge = [...membership.edges].find(edge => edge.from === resident && edge.to === workplace)!;
edge.delete();
membership.edges.add({ from: resident, to: next });
```

Retain graph-derived membership instead of duplicating household/workplace fields on each resident. Public reassign validates the index before mutation; automatic reassignment uses the pre-increment World tick modulo population. Manual reassignment changes topology but not World time. Deleting/recreating the workplace edge intentionally changes that edge's opaque ID and insertion order; mutating or reusing an old edge to preserve its visual identity would change semantics.

Useful local simplification: name the four existing place references (or destructure them once) instead of repeating positional meanings `places[0]`, `places[2]`, `places[3]`. Preserve the exact place objects, original IDs, insertion order and household/workplace parity. Keep reassignResident as a meaningful shared operation used by manual and automatic actions. Its non-null assumptions follow from initialization plus the sole mutation operation retaining exactly one edge of each kind. No extra registry or generic relation manager is warranted. In 100 mixed manual/automatic rounds with 20 residents, each resident kept exactly two edges and original household edge IDs/order; old observations remained unchanged.

The UI's prefix/suffix checks refer to explicitly authored place keys (`household-a`, etc.), not parsed opaque Agent/Edge IDs. They are acceptable for these fixed four places. Do not rename domain keys or introduce new IDs as an incidental cleanup; a future generalized place schema would be a separate contract.

## Execution record and limits

Executed from the specified worktree with Bun `1.4.2 (744846f84)`:

```sh
git status --short
git rev-parse HEAD
git branch --show-current
bun test tests/mesa-models.test.ts tests/mesa-occupancy.test.ts tests/mesa-resource-visuals.test.ts tests/mesa-social-visuals.test.ts tests/mesa-heat-visual.test.ts tests/mesa-dynamics.test.ts tests/mesa-measurements.test.ts tests/mesa-integration.test.ts
```

Result: **71 pass, 0 fail, 505 expect calls**, eight files. These are existing author tests rerun by this independent reviewer; their success is not independent approval of a future refactor.

Additional scripts ran through `bun - <<'TS' ... TS` with `node:assert/strict` and public model factories (no saved script or code changes):

- Heat: Cartesian product widths [2,3,12], cooling [0,0.5,2], 140 steps; all field values [0,30], history length 120.
- Demand: 100 households, shifted shares [0,0.5,1], 24-hour energy 990 kWh within absolute 1e-8; extend to tick 140, history length 120.
- Crossing: 40 pedestrians, greens [1,2,4]; waiting=40 after 3 steps, crossing=40 after 4, arrived=40 and tick=5 after an additional 100 steps.
- Battery: seeds [-2147483648,0,1,17,4294967293], solar [0,4,8], demand [0,2,8], 150 individual steps per configuration; storage [2,10], per-step energy balance within 1e-8.
- Trees: same five seeds, 40 trees, allowances [0,1,100], 20 steps each. Independent stable sort of old moisture, greedy remaining-budget allocation, exact received vectors, moisture `max(0, old+received-2)`, and cumulative-use deltas.
- Recycling: same seeds, 12 households, 40 steps, influence schedule described in ASTRA-09. Oracle uses a separate public Random stream and `old[i] || random.number() < influence*(Number(old[(i+11)%12])+Number(old[(i+1)%12]))/2`; array map reads the complete old array before replacement. Compare each resulting adoption vector exactly.
- Battery/trees/recycling/zoning: two independent same-seed instances, 30 rounds, two additional reads on one instance before every advance. Compare full observations after recursively omitting only keys `id`, `from`, `to` to accommodate process-global framework identities. This comparison is not used to claim identity correctness; membership/visual tests separately check actual IDs and references.
- Zoning: same seeds, 100 parcels/baseCap 10, advance(100); tick=6 and pairwise slots/10 equals slots/12 within 1e-8.
- Stormwater: capacities [1,3,10], 160 individual steps, rain 50 for each first 20 steps of a 40-step period and 0 otherwise. Storage bounds plus cumulative and interval conservation within 1e-8.
- Occupancy: 40 applicants, slots 1→20; reject shrink to 1 with exact unchanged observation; manual moveOut then advance(200), done true, saved initial occupancy still 1.
- Membership: 20 residents, 100 rounds of reassign(i%20) then advance(); 40 edges, exactly two per resident, exact unchanged household edge records, old observation still Workplace A.

The aggregate script completed successfully and printed `PASS: ten-model boundary, balance, priority, synchronous RNG oracle, paired-seed, read-purity and action probes`. Separate terminal/interval reproduction output is recorded above. A supplementary initialization sweep of household counts 1–100 found no positive rounding-only load fraction that would incorrectly color a base-only household orange; no finding was raised.

Raw RNG continuation state is not exposed by these ten factories. The recycling oracle and paired-run comparisons establish tested observable continuation, not byte-identical hidden RNG state for all possible traces. Battery and tree RNG is used only during initialization by source inspection. No new diagnostic API or monkey-patching was introduced to reach private streams.

Browser interaction, screenshots, playback timing, all visual viewport/theme cases, full typecheck/build/consumer chain and exhaustive parameter/action enumeration were **not run** in this review. Browser control was explicitly prohibited and approved views were to remain untouched. No UI implementation change was made, so this report does not replace the implementation task's browser/screenshot gate. No typecheck is claimed for this documentation-only edit. Public example scripts were read; the full example runner was not executed.

## Independent disposition

This is fresh independent baseline evidence. The tested mechanisms support retaining their existing rule, ownership and ordering contracts. ASTRA-01 should be decided separately as a bounded UI behavior correction. ASTRA-02 through ASTRA-11 document concrete retained invariants and a few local simplifications; they are not a demand to change every file.

There is no approval here for an unperformed refactor, visual redesign, changed accepted outcomes or modified public assertions. After implementation, compare against this exact baseline with matching public action sequences and per-instance IDs, preserve the RNG draw conditions explicitly, then run the required browser and independent acceptance checks. Findings resolved by an author and independent re-approval must remain separate records.
