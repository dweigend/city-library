# Urban Mobility contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-mobility/` define setup, first-minute queueing and a full morning peak, the capacity/walking/penalty experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/). The revision-1 test that dispatched with `carPenalty: 20` used a value above the input maximum of 10 and is not carried forward.

## City question

When the main road is congested, does more road capacity make the morning commute better, or does it mainly attract more cars? How does a faster walking or cycling route compare?

Scientific connection: Braess, Nagurney and Wakolbinger (2005, translation of Braess 1968) show that individually chosen routes need not minimize total travel time. This model shares one ingredient: each traveler chooses using the congestion they see. It does **not** demonstrate a Braess paradox; the network has no link whose addition worsens equilibrium cost, and route costs are a simple queue estimate, not flow-dependent equilibrium costs.

## Network, demand and time

One step is one minute. Stops: Home (−2, 0), Junction (0, 1), Jobs (2, 0). Directed links:

| Link | Route | Minutes | Capacity (vehicles or people on the link) |
| --- | --- | --- | --- |
| home-junction | main road | 5 | carCapacity |
| junction-jobs | main road | 5 | carCapacity |
| car-bypass | bypass | 12 | 3 |
| walking-path | walk/cycle | walkMinutes | 1000 |

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| initialTrips | 0 | integer 0–1000 | Trips dispatched at setup (setup) |
| carCapacity | 5 | integer 1–20 | Vehicles per main-road link (live) |
| carPenalty | 0 | 0–10 | Extra perceived car minutes, e.g. parking or a charge (live) |
| walkMinutes | 18 | integer 8–30 | Walking/cycling path time (live) |
| departuresPerMinute | 3 | integer 0–10 | Scheduled departures in each of minutes 0–59 (live) |

## Choice and queue rules

Each departing trip estimates every route's time: Σ over links of (minutes + max(0, used + waiting + 1 − capacity) × minutes / capacity). The car takes the cheaper of main road and bypass (main on ties); it drives if that estimate + carPenalty ≤ walking estimate, otherwise it walks. Trips choose one at a time, so later departures see earlier ones in the queues.

Each link is a public `Resource` with FIFO admission. A trip requests its first link at departure; once granted it occupies the link for its minutes (walking minutes are fixed when the trip enters the path), then releases it and requests the next link. Per step from minute t: (1) scheduled departures for minute t while t < 60, (2) newly granted trips start, (3) every still-waiting trip adds one waiting minute, (4) trips whose link time ends by t+1 release and move on or complete at t+1, (5) trips granted by those releases start at t+1. A lifetime limit of 5000 trips applies; scheduled departures beyond it are counted as `unservedDepartureCount`.

## Actions

`dispatchTrips(count)`: integer 1–1000 trips now, using the same choice rule; RangeError beyond the lifetime limit. `setPolicy(changes)` updates carCapacity, carPenalty, walkMinutes, departuresPerMinute; `setCarPenalty(value)` remains as the single-field form. Omitted keys keep values; undefined, unknown keys and wrong types throw TypeError; range errors RangeError; validation precedes mutation. Lowering capacity keeps current holders (`retain`) and admits nobody new until usage falls below it.

## Exact assertions

- Setup: no trips, links as above, empty queues.
- Minute 1: 3 car trips on the main road. Minute 2: 6 car trips, 1 queued, 1 waiting minute. Minute 5: 15 trips, 4 of them on the bypass, 4 queued.
- Default peak at minute 60: 180 trips; 83 by car (16 via bypass), 97 walking. By minute 90 all 180 complete: mean travel 17.05 min, 461 waiting person-minutes, slowest car trip 23 min.
- carCapacity 10: 151 car, 29 walking, mean travel 15.9167 min (rounded), 801 waiting person-minutes.
- walkMinutes 12: 76 car, 104 walking, mean travel 11.6722 min (rounded), 63 waiting person-minutes.
- carPenalty 5: 77 car, 103 walking, mean travel 15.3889 min (rounded), 116 waiting person-minutes.
- `initialTrips: 1000` is valid; link usage never exceeds capacity.

## Reuse and provenance

Reuses Graph.allDistances for free-flow route construction, Resource (FIFO, setCapacity retain), World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Times and capacities are synthetic. No speed–flow relation, signals, parking search, departure-time choice or equilibrium assignment.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
