# Resource Exchange

What happens to a shared quantity when random pairs keep passing it on? Each step picks two different agents at random. If the first has energy left, it gives one unit to the second. Total energy among registered agents stays the same; only its distribution changes.

Randomness comes from the model's own seeded stream. Reading the model or selecting an agent does not advance time or use up random numbers. It is an illustrative mechanism, not a calibrated economic model.

## Use

Choose **Resource exchange** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/resource-exchange/model.ts";

const exchange = create({ count: 24, initialEnergy: 10, seed: 1 });
exchange.advance(1);
const { totalEnergy, minimumEnergy, maximumEnergy } = exchange.read();
```

`createExchangeModel` is the same function as `create` and remains available for existing consumers.

## Parameters

| Input | Default | Declared values |
| --- | --- | --- |
| `count` | `24` | integer; ≥ 2; ≤ 200 |
| `initialEnergy` | `10` | integer; ≥ 0; ≤ 1000000 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |

## Actions and observations

Besides `advance()` and `read()`, the instance offers `select`, `copy`, `toggleMembership` and `delete`. Detaching or deleting an agent changes the registered population. A copy is a detached agent and does not join the running world.

`failStep` deliberately fails during a step: the transfer it already made remains, but the tick does not advance. The Lab does not expose this diagnostic action.

`read()` reports the selected agent's state plus `tick`, `agentCount`, `totalEnergy`, `minimumEnergy`, `maximumEnergy`, `lastInteractionIds` and `agents`.

## Checks

The public contract script [05-resource-exchange.ts](../../tests/public-contracts/agent-selection/05-resource-exchange.ts) and [agent-lab-model.test.ts](../../tests/agent-lab-model.test.ts) cover seeded replay, independent instances, lifecycle and observation:

```sh
bun tests/public-contracts/agent-selection/05-resource-exchange.ts
bun test tests/agent-lab-model.test.ts
```
