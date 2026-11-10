# DES Emergency Dispatch

In which order does a single team answer emergency calls? Three calls come in at places in a small network. Waiting calls are ordered by priority, a running job is never interrupted, and travel time comes from the network. Each job takes travel plus `serviceMinutes`.

With one team, the calls are completed at minutes 4, 12 and 18; with three teams (`setResponders(3)`), at minutes 4, 8 and 6. [07-emergency-dispatch.ts](../../tests/public-contracts/des-models/07-emergency-dispatch.ts) asserts both.

Things to try:

- Add a second team and compare the completion times.

## Use

Choose **DES Emergency Dispatch** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-emergency-dispatch/model.ts";

const dispatch = create();
dispatch.advance(18);
const { order, completedCallCount } = dispatch.read(); // [1, 2, 3], 3
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `responderCount` | `1` | integer; ≥ 1; ≤ 3 | Response teams |
| `serviceMinutes` | `2` | integer; ≥ 1; ≤ 10 | On-site minutes per call |

## Actions and observations

`setResponders(count)` changes the number of teams during a run. `read()` reports busy teams, waiting calls, completed calls, the service `order`, each call and the network.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. The priority rule is a toy policy, not a clinical triage rule. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
