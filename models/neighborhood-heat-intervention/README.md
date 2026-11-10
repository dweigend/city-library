# Neighborhood Heat Intervention

Illustrative synchronous exchange and shade cooling in abstract index units; no temperature forecast.

Run `bun run dev` and choose **Neighborhood Heat Intervention**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/neighborhood-heat-intervention/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `width` | `6` |
| `shadeCooling` | `0.5` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/execution-studies/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
