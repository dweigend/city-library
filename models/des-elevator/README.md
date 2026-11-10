# Elevator Service

How should two elevator cars share passenger calls? A building has six floors and two cars with four places each by default; time is measured in seconds. Passengers wait in a queue per floor and direction. An empty car takes the oldest waiting call, and ties follow passenger and car order. Cars move one floor per event, let passengers out before letting new ones in, and a call that does not fit or goes the other way keeps its original age. Separate floor and direction queues own the waiting passengers, and one Resource per car owns its occupied places.

The scenario starts with a fixed set of journeys and can add arrivals at a regular interval (`arrivalIntervalSeconds`, `arrivalCountLimit`).

Things to try:

- Add a passenger from the ground to the top floor with `addPassenger(0, 5)` and follow both cars.
- Lower `capacity` to 1 and compare the mean waiting time.

## Use

Choose **Elevator Service** in [Agent Lab](../../ui/agent-lab/README.md). **Add passenger** calls `addPassenger(from?, to?)`, which defaults to the ground and top floors.

From a script in the repository root:

```ts
import { create } from "./models/des-elevator/model.ts";

const elevator = create();
elevator.addPassenger(0, 5);
elevator.advance(1);
const observation = elevator.read();
elevator.dispose();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `floorCount` | `6` | integer; ≥ 2; ≤ 12 | Number of floors |
| `elevatorCount` | `2` | integer; ≥ 1; ≤ 4 | Number of cars |
| `capacity` | `4` | integer; ≥ 1; ≤ 8 | Passenger places per car |
| `travelTimeSeconds` | `2` | integer; ≥ 1; ≤ 10 | Seconds per adjacent-floor move |
| `doorTimeSeconds` | `1` | integer; ≥ 0; ≤ 5 | Seconds for opening and separately closing |
| `transferTimeSeconds` | `1` | integer; ≥ 0; ≤ 5 | Seconds per boarding or alighting passenger |
| `initialPassengerCount` | `6` | integer; ≥ 0; ≤ 100 | Deterministic initial journeys |
| `arrivalIntervalSeconds` | `0` | integer; ≥ 0; ≤ 60 | Seconds between scheduled arrivals; zero disables them |
| `arrivalCountLimit` | `0` | integer; ≥ 0; ≤ 100 | Maximum additional scheduled arrivals |
| `maxEventCountPerStep` | `1000` | integer; ≥ 1; ≤ 100000 | Headless per-step event bound; omitted from ordinary UI setup |

## Actions and observations

`addPassenger(from?, to?)` adds a journey; `dispose()` releases the instance. `read()` reports created, waiting, riding and arrived passengers, mean wait, ride and system times in seconds, pending events, the cars, passengers and floor queues.

The [model contract](../../docs/development/des-elevator-contract.md) defines dispatch, timing, failure and measurement boundaries. Public contract scripts are in [tests/public-contracts/des-elevator](../../tests/public-contracts/des-elevator).

## Sources and limits

A TypeScript teaching controller for scheduling and conservation, not calibrated elevator traffic, certified lift control or a port of Salabim. The [source record](../../docs/research/des-elevator-sources.md) documents the MIT-licensed Salabim samples at pinned revision [`99bc8b2213d66a7287f04952cabc1fb9aa6c369d`](https://github.com/salabim/salabim/tree/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models) that inspired it and the deliberate adaptations.
