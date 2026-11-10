# DES Emergency Dispatch

Nonpreemptive priority on graph-derived service trips. Minutes; no clinical or operational calibration.

Run `bun run dev` and choose **DES Emergency Dispatch**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-emergency-dispatch/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `responderCount` | `1` |
| `serviceMinutes` | `2` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
