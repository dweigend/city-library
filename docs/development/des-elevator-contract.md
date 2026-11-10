# Elevator model contract

Status: public contract frozen by the five asserted scripts in example-first commit `e90eccb`, preceding model runtime commit `48a4349`. The original assertions remain frozen; import-path migration is recorded separately in [the path receipt](model-path-migration.json). Pre-consolidation acceptance is summarized in [the historical evidence](des-2d-evidence.md); current integration checks belong in [the integration record](pr-main-integration.md). The model is a synthetic explicit-state adaptation of Salabim elevator concepts, not a physical elevator specification or a whole-upstream port. [Source research](../research/des-elevator-sources.md) records the pinned source, license, deviations and independent findings.

## Public model

`models/des-elevator/model.ts` exports `inputs`, `create(options?)` and `model`, using the existing headless Definition contract. All imports are inert. Each factory creates an independent World, Agenda, canonical passenger/car Agents, direction queues and one Resource per car.

```ts
create(options?: Partial<ElevatorParameters>): ElevatorModel
instance.addPassenger(from?: number, to?: number): number
instance.advance(steps?: number): void
instance.read(): ElevatorObservation
instance.dispose(): void
```

The add action defaults to floor 0 → top floor and returns a model-local passenger number. Destinations must differ from origins; both must be integers within the configured floor range. Invalid actions preserve state. `dispose` cancels pending Agenda handles, empties queues, releases granted requests and deletes the owned Agents; it is idempotent. Writes/advance after disposal reject. Reading the final detached observation remains supported.

| Parameter | Default | Domain / unit |
| --- | --- | --- |
| floorCount | 6 | Integer 2–12; floors numbered 0 through floors−1 |
| elevatorCount | 2 | Integer 1–4; cars initially at floor 0 |
| capacity | 4 | Integer 1–8 passenger slots per car |
| travelTimeSeconds | 2 | Integer 1–10 seconds per adjacent-floor move |
| doorTimeSeconds | 1 | Integer 0–5 seconds for opening and separately closing |
| transferTimeSeconds | 1 | Integer 0–5 seconds per passenger board/alight |
| initialPassengerCount | 6 | Integer 0–100, deterministic initial demand |
| arrivalIntervalSeconds | 0 | Integer 0–60 seconds; zero disables scheduled arrivals |
| arrivalLimit | 0 | Integer 0–100 further arrivals; positive limit requires positive interval |
| maxEventCountPerStep | 1000 | Integer 1–100000, local Agenda safety bound; hidden from ordinary UI setup |

There is no hidden random stream or calibrated arrival process. For initial passenger index `i` starting at zero, even indices originate at 0 and go to `1 + i % (floorCount−1)`; odd indices originate at the top and go to `i % (floorCount−1)`. Scheduled arrivals continue this sequence at `arrivalIntervalSeconds`, `2 × arrivalIntervalSeconds`, …, up to `arrivalLimit`. Model-local passenger numbers follow actual admission order, including explicit actions.

## Dispatch and capacity ownership

Each floor has separate upward/downward FIFO ServiceQueues. Their entries are canonical passenger Agents. A Resource per car alone owns occupied slots. A capacity request is created only when a passenger actually completes boarding; no Resource waiting request duplicates a floor queue. Car rider associations retain issued claim tickets, not a second mutable occupancy counter. Read derives occupied counts from Resource.used and passenger associations.

One dispatch intent may reserve a floor/direction call for one car. This is not a capacity claim. Idle empty cars in car-number order select the oldest original waiting passenger among unreserved calls; ties use passenger admission sequence, then car number. A reserved call cannot be consumed by another car. This deliberately conservative policy does not send multiple empty cars to the same direction queue simultaneously and makes no optimality or infinite-arrival fairness claim.

Cars move through one adjacent-floor Agenda event at a time. An empty repositioning car does not collect unrelated intermediate calls. A loaded car serves destination floors first and may collect an eligible unreserved (or own-reserved) same-direction queue at that destination stop. It does not stop solely to collect at an intermediate floor without an alighting passenger. Opposite-direction and full-car calls remain queued with their original age. When a car empties at a stop, it may select the oldest unreserved call at that same floor in either direction before closing; otherwise it reserves the globally oldest call and repositions after closing. This is a bounded teaching policy, not a traffic-optimized controller.

At every stop: opening delay; all alighting passengers in boarding order, one transfer delay each; eligible boarding passengers in FIFO order, one transfer delay each; closing delay. A seat becomes free at alighting completion. A passenger leaves its floor queue and acquires its Resource claim at boarding completion. Alighting always precedes any new boarding. A full car releases its floor-call reservation when its doors finish closing so another idle car can serve remaining demand. Remaining original passenger age never resets.

Idle cars have no repeated polling event. Adding demand explicitly schedules a wake/dispatch event at current Agenda time. Original event priority/insertion order resolves equal times; initial car scheduling follows car number. No Promise, timer or second simulation scheduler performs waiting.

## Time, observations and failure

One successful `advance(1)` invokes one World procedure and drains Agenda through one further simulated second. Agenda time and World tick are separate values, exposed as `time` and `tick`. Events at the horizon are dispatched before the step completes, including bounded zero-delay chains. Every dispatched event counts toward `maxEventCountPerStep`. Exhaustion throws before another extraction, keeps prior effects/pending work, and does not advance World tick for that failed step; the bound is conservative when an exact-budget final event would require a further empty probe. This is not a competing global run-budget API.

Wait is requested → boarding completion; ride is boarding completion → alighting completion, including travel, door and intervening service time. `meanWaitSeconds` covers boarded passengers; `meanRideSeconds` and `meanSystemSeconds` cover completed passengers only, with zero returned before the respective first observation. These finite-run means are descriptive, not steady-state estimators.

Read returns detached arrays/records: `parameters`, `tick`, `time`, `createdPassengerCount`, `waitingPassengerCount`, `ridingPassengerCount`, `arrivedPassengerCount`, `generatedPassengerCount`, `meanWaitSeconds`, `meanRideSeconds`, `meanSystemSeconds`; `cars` with id/number/floor/direction/status/used/capacity/passenger numbers; `passengers` with id/number/from/to/requested/boarded/arrived/car/status; and `floorQueues` with floor/direction/passenger numbers. Missing boarded/arrived/car use −1; status is waiting/riding/arrived. It also exposes `pendingEventCount` for bounded-execution diagnostics. Reads do not dispatch, tick, mutate queues or draw randomness. Counts obey `createdPassengerCount = waitingPassengerCount + ridingPassengerCount + arrivedPassengerCount` and every car used ≤ capacity.

Disposal cancels pending events, releases car claims, empties queues and removes owned Agents. It is idempotent. Subsequent writes and advances reject; `read()` returns a detached historical final observation with `pendingEventCount: 0`, rather than a claim that its displayed passengers remain active Resource occupants.

The UI uses diagram floor/cabin coordinates derived from these observations, not domain travel interpolation or another clock. Cabin dots must equal actual riding membership. Generated mockup count mistakes are not assertions.

## Deterministic example gate

All exact fixtures below use one-second travel/open/close/transfer unless explicitly overridden, zero initial/scheduled passengers and three floors.

1. Single 0→2 trip: boarding completes at 2, arrival at 7, car idle at 8; wait 2, ride 5, system 7.
2. Capacity one, two 0→2 passengers: first boards/arrives at 2/7, second at 12/17; the full car leaves the second original upward call pending.
3. Alight-before-board with 0→1, 1→2, 1→0: arrivals at 6, 11, 19; boarding at 2, 7, 15. The downward call persists through the upward service.
4. Two cars and separate 0→2 / 2→0 calls: car assignments 1/2, boarding at 2/4, arrivals 7/9. A separate one-car oldest-first fixture boards an earlier 2→0 request at 4 before a later local 0→2 request at 10.
5. Invalid parameters/actions are atomic, bounded scheduled arrivals remain conserved, reads are detached/independent, and a one-event safety budget throws without completing a World step. Zero-duration door/transfer operations remain event-bounded.

The five asserted scripts initially failed because the model module did not exist; they now pass against the delivered model. Their original runtime expectations were preserved.
