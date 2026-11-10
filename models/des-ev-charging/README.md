# DES EV Charging

Priority charging queue, heterogeneous session durations and cancellation. Minutes; no battery physics.

Run `bun run dev` and choose **DES EV Charging**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-ev-charging/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `chargerCount` | `2` |
| `sessionMinutes` | `2` |
| `vehicleCount` | `3` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
