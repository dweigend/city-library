# Virus on a Network: executed baseline and browser comparison

Coordinator execution: 2026-11-05. Canonical selected identity: `Sample Models/Networks/Virus on a Network`. This report records actual original-model and target Chromium sessions supplied by the integration coordinator. The documentation agent checked the source procedures, model/adapter, scientific dossier and retained images; it did not perform another browser run. Independent technical approval and the final model-ledger decision remain pending.

## Baseline, provenance and comparison policy

The original was loaded through the [official Web launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Networks/Virus%20on%20a%20Network.nlogox). The coordinator hashed the actual browser-loaded `session.nlogoSource.nlogo` bytes: **`3ebb041175d22c6a1b32279dc25af14b4f76c06f2eb18e62539ca84f1f8dd5d1`**, matching the archived NetLogo **7.0.4** source and pinned Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`. See [source and attribution](../../experiments/virus-on-a-network/NOTICE.md), [unchanged XML](../../experiments/virus-on-a-network/source.nlogox) and [procedure contract](selected-network-contracts.md#virus-on-a-network). The source is Stonedahl and Wilensky (2008), copyright Uri Wilensky, CC BY-NC-SA 3.0.

Default parameters in both executions: 150 nodes, mean-degree request 6, initial infected 3, spread 2.5%, recovery 5%, gain-resistance 5%, check frequency 1 tick. The reference session used its unspecified native seed; the target used explicit Mulberry seed 1. Desktop viewport: **1280×800**; target mobile emulation: **390×844**, light and dark. Mobile images may have device-pixel ratio 2. These are browser-emulation checks, not physical-device certification.

No identical stochastic trajectory or seed equivalence is claimed. Initial population/edge count, disjoint status totals, retained topology, timer ordering, parameter effects, percentage reporter meaning and extinction semantics are the functional comparison. The default trajectories below are observations, not a statistical equivalence test or empirical validation. [Machine-readable observations](selected-network-evidence/virus-observations.json) preserve settings, states, interactions and limits.

## Setup, progression and stopping

| Executed state | Original NetLogo | City Library target |
| --- | --- | --- |
| Default Setup | Tick 0; 147 susceptible, 3 infected, 0 resistant; 150 nodes, 450 edges | Tick 0; 147 susceptible, 3 infected, 0 resistant; 150 nodes, 450 edges |
| Progress at tick 143 | 81 susceptible, 54 infected, 15 resistant | 131 susceptible, 13 infected, 6 resistant |
| Spread changed live to 0; observed extinction | Tick 275; 131 susceptible, 0 infected, 19 resistant | Tick 202; 144 susceptible, 0 infected, 6 resistant |
| Attempt after extinction | Native Go left tick 275 unchanged | Run and step buttons disabled |
| Spread restored to 2.5; Setup | Tick 0; 147/3/0 | Tick 0; 147/3/0 |

Each observed state sums to 150. Target native `100 steps` first produced tick 100 with **133/13/4**; four ten-step and three single-step clicks then produced tick 143 with **131/13/6**. Target Run/Pause subsequently reached tick **145**, **133/11/6**. After setting spread to 0, the next 100-step request ended early at extinction tick 202. These actual sampled horizons are retained rather than presented as aligned random trajectories. The source Go/Pause run was sampled at tick 143; it was not a ten-step source run.

| Paired image | Original | Target |
| --- | --- | --- |
| Default Setup | [Setup](selected-network-evidence/virus-reference-setup.png) | [Setup](selected-network-evidence/virus-target-setup.png) |
| Tick 143 | [Progress](selected-network-evidence/virus-reference-progress.png) | [Progress](selected-network-evidence/virus-target-progress.png) |

The [reference extinction image](selected-network-evidence/virus-reference-extinction.png) records the source stopping outcome. The target [mobile light terminal view](selected-network-evidence/virus-target-mobile-light.png) shows tick 202, **144/0/6** and disabled Run/steps. The source status plot and target `Network status (%)` chart use percentages of the actual node population; target monitors additionally expose counts. A count chart was not substituted for the source percentages.

## Rules, controls and boundary conditions

The source audit and headless assertions establish the precise procedure contract: setup repeatedly chooses a uniform node and its nearest unconnected neighbor until `ceil(N × requestedDegree / 2)` edges exist. Generation occurs before appearance-only spring layout. Each go increments all check timers first; spread snapshots the infected senders, so a newly infected node is not another sender in that spread phase. Recovery selection occurs after spreading and can therefore include a new infection in the same tick. Infection does not reset its timer. Resistant nodes cannot be reinfected under ordinary rules. Extinction is checked before timer/RNG/tick work; the final successful transition still ticks. These source-derived and headless-tested claims are distinct from the browser observations above.

Spread uses a continuous random draw. Recovery and resistance retain the source **integer `random 100` comparison**, including its fractional recovery quantization: recovery settings 0.1 and 1 both accept integer outcome 0. Replacing this with a continuous draw would change the functional baseline. The browser run exercised default recovery/resistance, live spread and live frequency; it did not independently measure recovery quantization statistically.

Following shared grid-UI integration, the coordinator repeated target Setup and a ten-step batch: tick **10**, **145/5/0**. Changing check frequency live from 1 to 2 and single-stepping gave the selected node timer **1** at tick **11**, then **0** at tick **12**. Thus live frequency was applied on subsequent timer updates. An invalid Nodes value **9**, followed by Setup, invoked native validation (`Value must be >= 10`) and preserved the existing tick **12**; the input was restored to 150. Dependent degree/outbreak maxima and atomic headless fixtures are covered by public examples/tests, not claimed here as additional browser interactions.

Mobile light/dark sessions selected the actual first node option, exposing index 0, susceptible status, timer 0 and canonical coordinates approximately `(4.9495299859, -19.36844)`. Fit and Layout preserved the stopped scientific tick **202**. No horizontal document overflow was observed. Retained views: [inspector](selected-network-evidence/virus-target-mobile-inspection.png), [dark](selected-network-evidence/virus-target-mobile-dark.png), [light](selected-network-evidence/virus-target-mobile-light.png). Layout is presentation state; it does not rebuild scientific connections or move stored generation coordinates.

## Declared adaptations and evidence limits

Mulberry replaces NetLogo's RNG. Appearance-only heading/spring-layout draws and order-independent timer-phase shuffles are omitted, so a NetLogo seed is not a target replay key. Source spring positions and white/gray incident-edge styling are replaced by independent shared layout, neutral edge styling and status-colored nodes; resistance is also available in numeric observations and inspection. These appearance choices do not modify infection rules. Source generation coordinates remain canonical headless state, while user drag/Layout/Fit are view-only. Target setup-only population/degree/outbreak fields avoid the source's possibility of changing setup sliders inconsistently with an already-created population. The target additionally supplies atomic state/connection fixtures, finite detached observations and setup-plus-latest-1000-step history. These are documented extensions, not original widgets.

Reference and target snapshots reported **no application console errors or failed network requests**. Two automation mistakes were corrected: a wait for the wrong reference tick selector (`.netlogo-ticks`) timed out after 5 seconds before native Pause recorded the actual tick 143; an invented target option ID `cl_0` timed out before the coordinator read and selected the real option. Neither is recorded as a model runtime failure, and neither timed-out operation is counted as successful interaction evidence.

The model implementation is `2fab83b`; the subsequent integrated grid/shared-UI browser smoke includes `37ed804`. Five asserted [public network examples](../../examples/selected-network/) were frozen before runtime (`9d713fa`); [headless behavior tests](../../tests/selected-network-models.test.ts) cover staged infection, quantized recovery, extinction, fixtures and conservation for the paired network slice. Previously executed shell checks are documented by the integration coordinator; this documentation-only task did not rerun them. The retained paired browser run does not establish distributional equivalence across RNG engines, exhaustive accessibility, scientific validity or independent technical approval.

The completed [scientific dossier](../research/netlogo-web/virus-on-a-network.md) supplies the requested mini-text and exactly three publications, with access/evidence limits; [research integration](research-integration.md) distinguishes dossier verification from runtime validation and scientific peer review. Source, target browser and functional-baseline evidence are ready for coordinator assessment. Independent Argon review and any requested remediation remain separate gates under the [binding acceptance criteria](netlogo-model-acceptance.md).
