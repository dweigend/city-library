# Urban Goods Buffer

What happens when a delivery buffer is full? Producers deliver crates into a store that holds `capacity` crates. When the store is full, the next producer has to wait, which is called backpressure. Collections take crates out, starting at `firstCollectionTime`, and each collection immediately lets a waiting producer in. Each step advances one minute.

With the defaults, crates arrive at minutes 1, 2 and 3 into a store of two, so one producer waits at minute 3; collections at minutes 4, 6 and 8 empty it. Produced always equals stored plus waiting plus collected crates. [03-goods-buffer.ts](../../tests/public-contracts/des-models/03-goods-buffer.ts) asserts these values.

Things to try:

- Raise `capacity` to 3. Does any producer still have to wait?
- Use `produce` and `collect` by hand to build a backlog.

## Use

Choose **Urban Goods Buffer** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-goods-buffer/model.ts";

const buffer = create();
buffer.advance(3);
const { storedLotCount, blockedLotCount } = buffer.read(); // 2, 1
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `capacity` | `2` | integer; ≥ 1; ≤ 20 | Crates the store can hold |
| `lotCount` | `3` | integer; ≥ 0; ≤ 100 | Crates produced in the scenario |
| `firstCollectionTime` | `4` | integer; ≥ 1; ≤ 20 | Minute of the first collection |

## Actions and observations

`produce()` and `collect()` add a delivery or a collection. `read()` reports produced, stored, waiting and collected crates, each crate, the `deliveries` and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
