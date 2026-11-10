# Residential Occupancy

Illustrative FIFO dwelling-slot reservations with explicit releases and synthetic periodic household turnover; no housing forecast.

Run `bun run dev` and choose **Residential Occupancy**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/residential-occupancy/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `applicantCount` | `8` |
| `slotCount` | `3` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/execution-studies/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
