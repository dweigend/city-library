# Solar Battery Microgrid

When does a home battery drop to its reserve? Each step is one hour. Solar panels produce `solarKw` from 6 to 18 h of a daily cycle whose starting hour is drawn from the seed; the household uses `demandKw` all the time. The 10 kWh battery starts at 5 kWh, never drops below a 2 kWh reserve and never exceeds its capacity: missing energy is imported, surplus is exported. The model records when, within the hour, the battery reaches its reserve.

Things to try:

- Set `solarKw` equal to `demandKw`. How often does the battery reach its reserve?
- Raise `demandKw` and compare imported and exported energy over a day.

## Use

Choose **Solar Battery Microgrid** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/solar-battery-microgrid/model.ts";

const grid = create({ seed: 1, solarKw: 4, demandKw: 2 });
grid.advance(24);
const { energyKwh, importedKwh, exportedKwh, reserveCrossingCount } = grid.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 | Chooses the starting hour of the solar cycle |
| `solarKw` | `4` | number; ≥ 0; ≤ 8; step 0.5 | Solar output during daylight hours |
| `demandKw` | `2` | number; ≥ 0; ≤ 8; step 0.5 | Constant household demand |

## Actions and observations

`advance()` runs hours. `read()` reports stored, imported and exported energy, the number of reserve crossings, `lastCrossingHour`, the drawn `solarPhase` and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [resource-projection.test.ts](../../tests/resource-projection.test.ts). Passing them shows that the mechanism works as described, not that the model is a grid engineering forecast. Storage is lossless, and aging, tariffs and weather are left out.
