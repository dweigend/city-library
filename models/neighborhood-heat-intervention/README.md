# Neighborhood Heat Intervention

How does shade change a neighborhood's heat? A square grid of blocks starts at a heat index of 30. Each step, every block moves part of the way toward its neighbors' average, computed from the same previous state, and the shaded western half is cooled by `shadeCooling`. The heat index is an abstract number, not degrees.

Things to try:

- Set `shadeCooling` to 0. Does the grid stay at 30?
- Raise `shadeCooling` during a run with `setShadeCooling` and watch the boundary between shaded and unshaded blocks.

## Use

Choose **Neighborhood Heat Intervention** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/neighborhood-heat-intervention/model.ts";

const heat = create({ width: 6, shadeCooling: 0.5 });
heat.advance(10);
const { meanHeat, shadedFieldCount } = heat.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `width` | `6` | integer; ≥ 2; ≤ 12 | Blocks per side of the square grid |
| `shadeCooling` | `0.5` | number; ≥ 0; ≤ 2; step 0.1 | Heat index removed per step from shaded blocks |

## Actions and observations

`advance()` runs steps; `setShadeCooling(value)` changes the cooling during a run. `read()` reports `meanHeat`, `shadedFieldCount`, every block in `fields` and a bounded `history`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [heat-projection.test.ts](../../tests/heat-projection.test.ts). Passing them shows that the mechanism works as described, not that the model forecasts temperatures. The heat index leaves out radiation, wind, humidity and building geometry.
