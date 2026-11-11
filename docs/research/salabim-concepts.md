# Salabim concepts: sources and validation

City Library can reuse discrete-event modeling concepts while keeping Agent Loom's public TypeScript objects, explicit execution and separate Model Lab. This research record defines useful transfers and their scientific limits. It does not establish implementation acceptance or whole-Salabim parity.

## Source provenance

Research checked on 2026-11-09. The inspected City Library baseline is `cc6d5c3136c07cda94d5a4449b6e384c435f6ad4`. Its root `index.ts` exports Agent, World, run, Random, Graph, Grid, topology, stats and geometry, with related types. Agenda and storage/History are specified but absent from those exports. `Random` already provides explicit mulberry32 streams, uniform/normal/exponential/Poisson draws and stream-state continuation. These source observations are not results of new runtime tests.

The independently verified upstream source is [salabim/salabim at 99bc8b2213d66a7287f04952cabc1fb9aa6c369d](https://github.com/salabim/salabim/tree/99bc8b2213d66a7287f04952cabc1fb9aa6c369d), commit timestamp 2026-05-29T12:37:40Z. Its [Python implementation](https://github.com/salabim/salabim/blob/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/salabim/salabim.py) declares version 26.0.6. The official manual inspected below identifies itself as 26.0.0; it is a separately versioned explanatory source, not an assertion that every documented detail matches this commit.

The pinned [MIT license](https://github.com/salabim/salabim/blob/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/salabim/LICENSE.txt) carries Copyright (C) 2016 Ruud van der Ham. Conceptual adaptation does not require a Python dependency. Any copied code or substantial upstream material must retain the applicable copyright and permission notice. This record paraphrases concepts; it does not authorize copying upstream implementation without attribution.

Files retrieved from the pinned raw URLs were hashed with Python `hashlib.sha256`:

| Upstream file | SHA-256 |
| --- | --- |
| `salabim/salabim.py` | `e1ce74c5330fae3826eb6dd406a39d3d3d64bacb1e54e8d2c4dd11ef8a816272` |
| `salabim/LICENSE.txt` | `620e0896ac1ff640bced5fc1f1cc349856b1a98e561357527bb194e5b31e014a` |

## Transfer matrix

Status here describes the inspected baseline and integration intent. **Pending** requires implementation, public-import checks and acceptance evidence before becoming delivered. **Unsupported** is an explicit exclusion. **Host-specific** belongs to an application adapter. The final integration ledger must link verified delivered APIs and tests; this research record must not be read as that ledger.

| Salabim concept and primary documentation | City Library transfer | Status / boundary |
| --- | --- | --- |
| [Process interaction and event scheduling](https://salabim.org/manual/Component.html) | Independent Agenda plus synchronous explicit process state; delayed activation, passivation and cancellation | Pending. Preserve ordinary Agent identity; no second Environment. Python yieldless/greenlet execution unsupported. |
| [Queue](https://salabim.org/manual/Queue.html) | Stable FIFO/priority service ordering with explicit removal and observation | Pending. No promise of upstream linked-list complexity, slicing or every queue algebra operation. |
| [Resource](https://salabim.org/manual/Resource.html) | Requests, claims, release, queued fairness and explicit capacity-change policies | Pending. Upstream also supports fractional/negative capacities, anonymous resources and simultaneous multi-resource claims; these require separate contracts before support is claimed. Preemption is not implied by priority. |
| [Store](https://salabim.org/manual/Store.html) | Bounded typed goods, blocked producers/consumers and explicit transfer outcomes | Pending. Upstream stores hold Components; local goods may be typed data while any Agent references remain canonical. Filtering/multiple-store selection requires an explicit contract. |
| [State](https://salabim.org/manual/State.html) | Explicit condition values, waits and timeout/cancellation outcomes | Pending. Upstream has scalar, expression and function tests, including OR/AND combinations; arbitrary evaluated expression strings are unsupported. |
| [Monitor](https://salabim.org/manual/Monitor.html) | Separate event samples and time-weighted levels; explicit observation | Pending. Generic numeric monitoring is useful; automatic collection, all weighted quantiles, pandas/Matplotlib adapters and upstream histogram formats are not implied. |
| [Distributions](https://salabim.org/manual/Distributions.html) | Reuse explicit Random; add only distributions needed by accepted author tasks | Uniform/normal/exponential/Poisson exist at baseline. Further distributions pending. No Python RNG sequence compatibility, implicit global stream or wall-clock reseeding. |
| [Overview: animation and video](https://salabim.org/manual/Overview.html) | Model Lab observations, controls and charts | Host-specific. Python Tkinter/OpenGL, desktop animation, real-time pacing and video production unsupported by headless core. |
| Trace in pinned [source](https://github.com/salabim/salabim/blob/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/salabim/salabim.py) | Bounded inspectable event/process outcome data | Pending. No automatic console output or claim of byte-identical upstream traces. |
| Complete continuation | Capture the full supported state and future behavior only through a separately specified format | Unsupported in this integration unless an executable full-state contract is delivered. Random state alone is insufficient. |

## Causal execution and ownership requirements

The binding batch operation `agenda.advance({until,maxEvents})` returns data after advancing its cursor. A batch containing an event at 2 can leave the cursor at 10; its handler then cannot legally schedule at 3. A one-event budget still fails when the removed event was the last due event. This follows directly from the existing contract, independently of Salabim implementation details.

An additive per-event operation should remove one eligible event and set time to that event's timestamp before caller dispatch. Successful removal must never jump to the horizon, including the final due event. Empty-queue/horizon behavior, validation-before-mutation, cancellation handles, tie ordering and dispatch-error effects must be frozen explicitly. A bounded caller loop can then dispatch 2, schedule 3, and inspect 3 before advancing to 10. Preserve the batch operation's established semantics. Neither operation changes World tick; fractional World ticks remain valid.

A resource owns both claims and its waiting requests. A store owns its contents and blocked operations. A condition owns registered waits. Process state may reference those operations but must not duplicate occupancy or waiting order. Define whether deleting a participating Agent rejects or atomically cancels/releases; do not silently leave an orphan claim. Timeout, cancellation and grant at equal time need one documented winner based on event ordering, with no double completion. Capacity shrink must explicitly reject, retain existing claims until release, or preempt according to a separately defined policy. Strict FIFO can cause head-of-line blocking; first-fit admission can starve large requests. Neither policy is universally fair.

## Scientific interpretation of the ten city examples

All proposed examples are synthetic mechanism demonstrations. A seed, a chart and a familiar city label do not calibrate a city. Each model must declare time units, quantity units, initial conditions, demand generation, service/travel rules, stopping rule and conservation boundary.

| Example | Useful mechanism and units | Interpretation boundary |
| --- | --- | --- |
| Civic service office | Visitors, clerks, service minutes, waiting minutes | Queueing illustration; empirical staffing advice needs measured arrival/service distributions. |
| EV charging queue | Vehicles, charger slots, charging minutes | Slot occupation; no battery, power-grid or electrochemical claims. |
| Urban goods buffer | Items, buffer slots, production/collection minutes | Integer goods conservation and backpressure; no inferred market demand. |
| Bus interchange | Graph routes, buses, bay slots, travel/service minutes | Scheduled access and transfers; graph cost must state its time meaning. |
| Parcel logistics | Parcels, depots, couriers, route minutes | Dispatch and inventory transfers; no calibrated last-mile forecasts. |
| Waste collection | Grid collection sites, vehicle loads, depot slots | Conserved synthetic waste; grid adjacency alone does not establish road access. |
| Emergency dispatch | Calls, responders, dispatch/travel/service minutes | Priority and waiting illustration; no clinical outcomes or operational deployment claim. |
| Bike redistribution | Bikes, station slots, redistribution vehicle loads | Closed bike balance; demand is synthetic unless measured separately. |
| Neighborhood water provision | Allocation units per service interval, consumers, available units | Bounded allocation and unmet demand; no hydraulic pressure, flow or water-quality simulation. |
| Infrastructure maintenance | Machines, spatial positions, repair teams, failure/repair minutes | Availability and repair queues; lifetime distributions and maintenance effects are assumptions. |

## Deterministic verification

These are acceptance expectations, not executed results. Use exact fixtures for event time/priority/insertion ties, the 2→3 causal chain within horizon 10, zero-delay event budgets, exhausted budgets, past-time rejection, forged/foreign cancellation handles and independent Agenda instances. Test invalid inputs before mutation and finite arithmetic overflow. Dispatch errors need documented partial-progress behavior rather than implied rollback.

Resource fixtures should establish `claimed = sum(active claims)`, no negative quantities, no duplicate grant/release and documented over-capacity behavior. Store fixtures should establish `initial + accepted puts - completed takes = current contents`; blocked puts do not already belong to contents. Check empty/full behavior, FIFO ties, cancellation, capacity changes and Agent deletion. Conditions need immediate satisfaction, delayed satisfaction, cancellation and exact deadline races. Every process needs one terminal outcome per wait. A generator facade must bound immediate yields as well as scheduled events.

For levels, integrate a piecewise-constant fixture exactly: level 0 on [0,2), 3 on [2,5), and 1 on [5,10) has area 14 and mean 1.4 over [0,10). Same-time updates add zero area. Samples describe observed occurrences; their arithmetic mean is not a time average. Test independent seeded runs and read-only observations. Re-running the same complete model with the same seed checks repeatability, not statistical independence or full-state continuation.

## Analytic and statistical counterchecks

Kendall's [1953 queueing paper](https://doi.org/10.1214/aoms/1177728975) supplies the classical stochastic queue framework. For a deliberately isolated M/M/1 check, declare a stationary Poisson arrival process of rate λ, independent exponential service times of rate μ, one work-conserving server, unlimited waiting room, no abandonment or blocking, and λ < μ. This idealization does not describe the bounded, priority or time-varying city examples automatically.

Derivation for this check: stationary birth-death balance gives `p[n+1] = (λ/μ)p[n]`; normalization yields `p[n] = (1-ρ)ρ^n` for `ρ = λ/μ < 1`. Summing gives `L = ρ/(1-ρ)`, `Lq = ρ²/(1-ρ)`, `W = 1/(μ-λ)` and `Wq = ρ/(μ-λ)`. For synthetic λ = 0.5/minute and μ = 1/minute, targets are utilization 0.5, L = 1 visitor, Lq = 0.5 visitor, W = 2 minutes and Wq = 1 minute. These are chosen test parameters, not city measurements. At λ ≥ μ these stationary finite-mean targets do not apply.

[Little (1961), Operations Research 9(3), 383–387](https://doi.org/10.1287/opre.9.3.383), with [full paper hosted by MIT](https://fisherp.scripts.mit.edu/wordpress/wp-content/uploads/2015/11/ContentServer.pdf), proves the relation under stated finite-mean stationary/ergodic assumptions. Use the same system boundary for number present, admitted rate and residence time. For finite runs, the area under occupancy equals the sum of each individual's residence time clipped to the observation window. Counting only completed customers discards unfinished residence and biases the comparison. Little's relation is broader than M/M/1 and does not itself validate exponential arrivals or service.

A statistical check should predeclare warm-up, observation horizon, replication seeds, estimators and tolerance before inspecting results. Use replication-level estimates or justified batches; successive queue observations are correlated. Report run count, dispersion and uncertainty, including failed/unfinished runs. A confidence interval missing an analytic value can occur by chance; a permissive single-seed tolerance can hide defects. Exact invariants should remain deterministic gates. Stationary comparison, sensitivity checks and uncertainty estimates are additional evidence, not proof of city validity. No new statistical or city-calibration results were executed in this research task.
