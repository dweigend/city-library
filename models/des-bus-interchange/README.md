# Bus Interchange

How do travel routes and limited berths shape bus departures? Buses travel to an interchange along the cheapest route in a small weighted network, then wait for one of `berthCount` berths and stay there for `dwellMinutes`. The model keeps two clocks: the world step count and the event time in minutes.

With the defaults, the route via the network costs 5 minutes, which beats the direct link of 8. Two buses arrive at minute 5 and share one berth, so they depart at minutes 7 and 9. [04-bus-interchange.ts](../../tests/public-contracts/des-models/04-bus-interchange.ts) asserts these values.

Things to try:

- Add a berth with `setBerths(2)`. When does the second bus leave?
- Add buses with `addBus()` and watch the waiting count.

## Use

Choose **Bus Interchange** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-bus-interchange/model.ts";

const interchange = create();
interchange.advance(9);
const { departedBusCount, time } = interchange.read(); // 2, 9
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `busCount` | `2` | integer; ≥ 0; ≤ 30 | Buses at the start |
| `berthCount` | `1` | integer; ≥ 1; ≤ 5 | Berths at the interchange |
| `dwellMinutes` | `2` | integer; ≥ 1; ≤ 10 | Minutes each bus occupies a berth |

## Actions and observations

`addBus()` and `setBerths(count)` change the scenario during a run. `read()` reports `tick` and `time` separately, plus `travelMinutes`, waiting buses, occupied berths, departures, the network and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. World steps and event minutes are separate clocks, even when their values happen to match. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
