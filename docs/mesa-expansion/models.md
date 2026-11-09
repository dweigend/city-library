# Ten illustrative city models

These are original teaching examples for public Agent Loom mechanisms. They are additional catalog entries, not ports in the fixed upstream selection of 200 models. Parameters and equations below are deliberately synthetic. Passing mechanism assertions does not establish scientific validity or predictive accuracy.

Every entry has an inert headless `model.ts`, a flat public `ui.ts`, canonical validated input descriptors, public actions and detached observations. One successful model step advances the World tick once. Physical elapsed time is reported separately where a step represents an hour or minute. Observations never consume randomness, advance time or sample History. Recording is explicit after successful steps. Histories retain at most 120 samples. All random draws use an instance-owned public Random stream.

## Focused examples

| Directory | Question and rule | Public mechanisms | Acceptance assertions |
| --- | --- | --- | --- |
| `experiments/household-energy-demand` | How does shifting a synthetic appliance load change hourly demand? A small household vector combines base demand and a cyclic appliance schedule; a public action changes the shifted share. Units: kW and hourly kWh. | Shared pure measurement definition, bounded History, explicit sampling and selected-data export | Observing twice is inert; hourly energy balance matches demand; history eviction preserves the newest samples; invalid shares reject without mutation. |
| `experiments/pedestrian-crossing-phases` | How does a fixed signal cycle admit a waiting pedestrian cohort? Each minute computes all walkers' next states from the same old state, then commits. | Explicit activation, two-phase compute/commit, execution budgets | A red phase admits nobody; all selected walkers see the same phase; completed steps and World tick agree; no walker is processed twice. |
| `experiments/zoning-scenario-comparison` | How do two synthetic density caps change capacity across seeded scenarios? Each step evaluates one scenario/seed outcome through the serial study contract. Units: dwelling slots, abstract land units. | Scenario design, seed replication, run, summarize | Cartesian scenario and run counts are exact; outcomes are independent; equal seeds reproduce results; higher caps cannot reduce deterministic capacity. |

## Combinations with existing domains

| Directory | Question and rule | Composition | Acceptance assertions |
| --- | --- | --- | --- |
| `experiments/neighborhood-heat-intervention` | How does added shade affect a synthetic neighborhood heat index? Synchronous local exchange plus a bounded shade cooling term. Index units, not Celsius or a calibrated heat equation. | Grid, pure measurements, two-phase update, History | Uniform initial state stays uniform without forcing; shade never raises the next heat index; observations are detached. |
| `experiments/residential-occupancy` | What happens when applicants exceed available dwelling slots? Applicants hold Resource tickets; a public move-out action releases exactly one granted reservation. Units: integer dwelling slots. | Agent, Graph references, Salabim-owned Resource, measurements | Granted occupancy never exceeds capacity; waiting applicants have no second occupancy record; release admits the next applicant under Resource policy. |
| `experiments/solar-battery-microgrid` | When does a battery cross its reserve threshold under constant net demand? Exact linear progression within each hourly interval, then a simple charge/discharge mode switch. Units: kWh, kW, hours. | Random initial solar phase, continuous progression and threshold events, History | Energy remains bounded; crossings have explicit direction and interval time; no duplicate event at a boundary. |
| `experiments/stormwater-retention` | When does a synthetic basin overflow under a constant inflow pulse? Linear volume progression until a capacity crossing, then explicit overflow accounting. Units: m³, m³/hour, hours. | Grid drainage source areas, continuous thresholds, measurements | Stored volume plus discharged/overflow volume equals inflow; storage never exceeds capacity; threshold boundary is handled once. |
| `experiments/urban-tree-watering` | How does a moisture-priority watering order allocate a fixed daily water allowance? Lowest moisture trees receive water first, then every tree loses a fixed daily amount. Units: liters and days. | Agent, prioritized activation, bounded execution, measurements | Water allocation never exceeds the daily allowance; priority ties are stable; changing rendering cadence cannot change the run. |
| `experiments/household-recycling-behavior` | How does a synthetic peer influence rule change household adoption? Each household computes adoption from the same previous Graph neighborhood; seeded draws occur in explicit activation order. | Agent, Graph, Random, two-phase update, measurements | Seeded trajectories reproduce; synchronous influence does not cascade within a step; network membership snapshots cannot mutate the graph. |
| `experiments/workplace-household-membership` | How does reassignment change a resident's household and workplace memberships? One bipartite Graph holds canonical resident/place objects; public actions update its edges. Units: people and membership counts. | Agent, Graph native references and readonly membership snapshots, measurements | Every resident has exactly one household edge and one workplace edge; moves preserve object identity; detached observations cannot alter membership. |

## Provenance and limits

All implementation code is original to this repository. No numerical coefficient is transferred from an external model. The following public agency material motivates subject selection only:

- [EPA: Reduce Heat Islands](https://www.epa.gov/green-infrastructure/reduce-heat-islands) describes shading and vegetation as cooling mechanisms. Our heat index omits radiation, wind, humidity, geometry and calibration.
- [EPA Illinois: Green Infrastructure](https://epa.illinois.gov/topics/water-quality/surface-water/green-infrastructure.html) describes retention and infiltration concepts. Our basin omits hydraulic routing, soil processes and design standards; tree demand is a synthetic allowance.
- [Australian Government: Batteries](https://www.energy.gov.au/solar/get-know-solar-technology/batteries) distinguishes stored energy and power limits. Our battery omits losses, aging, voltage, tariffs and weather forecasting; household loads are invented schedules.
- Occupancy, signal phases, recycling influence, zoning caps and household/workplace assignments are explicit synthetic policies. They make no empirical, traffic-safety, planning-compliance, demographic or causal claims.

## Discoverability and verification

The existing `discoverEntries` function in `scripts/agent-lab.ts` discovers paired directories automatically and is reused by the Vite host. These ten entries require no special shell/session case or modification of `experiments/catalog/progress.json`. Titles, descriptions and source/limitation information identify them as illustrative examples. The upstream model selection/count stays unchanged.

Library public examples must be frozen before dependent model runtime is written. Model mechanism assertions belong in `tests/mesa-models.test.ts`. Required runtime, package, browser and independent screenshot evidence is recorded separately by the implementation coordinator; none is claimed by this preparation document.
