# DES Bus Interchange

Graph-derived bus travel followed by FIFO berth service. World steps and Agenda minutes remain explicit.

Run `bun run dev` and choose **DES Bus Interchange**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-bus-interchange/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `buses` | `2` |
| `berths` | `1` |
| `dwellMinutes` | `2` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
