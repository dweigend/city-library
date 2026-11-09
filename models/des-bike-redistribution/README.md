# DES Bike Redistribution

A closed bike fleet moves between bounded station stores along graph travel times. Bikes and minutes; synthetic demand.

Run `bun run dev` and choose **DES Bike Redistribution**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-bike-redistribution/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `targetBikes` | `2` |
| `truckCapacity` | `2` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
