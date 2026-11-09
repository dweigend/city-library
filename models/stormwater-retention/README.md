# Stormwater Retention

Illustrative catchment mass balance and linear capacity crossings; synthetic rainfall and outflow.

Run `bun run dev` and choose **Stormwater Retention**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/stormwater-retention/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `rainMmPerHour` | `20` |
| `capacityM3` | `3` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/mesa-expansion/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
