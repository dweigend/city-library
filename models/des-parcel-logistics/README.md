# Parcel Logistics

How does one delivery van work through a backlog? Parcels enter a depot that holds `depotCapacity` parcels; when it is full, further parcels wait outside. A single van loads a parcel in `loadingMinutes`, drives it along weighted network routes and returns before taking the next one. The van counts as busy until it is back.

With the defaults, two parcels are delivered at minutes 3 and 9, and the van returns at minutes 5 and 12. [05-parcel-logistics.ts](../../tests/public-contracts/des-models/05-parcel-logistics.ts) asserts these values.

Things to try:

- Add parcels with `addParcel()` and watch the blocked count.
- Raise `depotCapacity` and compare the delivery times.

## Use

Choose **Parcel Logistics** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/des-parcel-logistics/model.ts";

const logistics = create();
logistics.advance(12);
const { deliveredParcelCount, busyVanCount } = logistics.read(); // 2, 0
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `parcelCount` | `2` | integer; ≥ 0; ≤ 30 | Parcels at the start |
| `depotCapacity` | `1` | integer; ≥ 1; ≤ 10 | Parcels the depot can hold |
| `loadingMinutes` | `1` | integer; ≥ 1; ≤ 10 | Minutes to load a parcel |

## Actions and observations

`addParcel()` adds a parcel during a run. `read()` reports queued, blocked and delivered parcels, the busy van, the network and a `history`.

## Sources and limits

An original City Library teaching scenario with synthetic times and quantities, not a calibrated city forecast. The [discrete-event examples](../../docs/development/des-examples.md) page describes all ten scenarios and their shared rules.
