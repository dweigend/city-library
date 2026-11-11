# Neighborhood Heat

How does heat spread from one hot block to its neighbors? Nine equal blocks form a 3 × 3 grid. All start at 20 degrees except the center, which starts at 28. Each step, heat flows between blocks that share a side. The grid is closed, so the total temperature stays at 188.

After one step the center is back at 20 and its four direct neighbors are at 22; the corner blocks, which touch the center only diagonally, are still at 20. It is an original City Library teaching model, not a calibrated heat-transport model.

## Use

Choose **Neighborhood Heat** in [Model Lab](../../ui/model-lab/README.md). The model has no inputs.

From a script in the repository root:

```ts
import { create } from "./models/neighborhood-heat/model.ts";

const heat = create();
heat.advance(1);
const { centerTemperature, totalTemperature } = heat.read(); // 20, 188
```

`read()` also returns every block's temperature in `fields`. [model.ts](model.ts) owns the state and the `advance()` action; [ui.ts](ui.ts) binds them to the Lab. The public contract script [02-neighborhood-heat.ts](../../tests/public-contracts/city-simulation/02-neighborhood-heat.ts) asserts the one-step result.
