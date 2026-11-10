# DES Civic Office

A finite morning queue, FIFO desks and explicit capacity changes. Minutes; synthetic scenario.

Run `bun run dev` and choose **DES Civic Office**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-civic-office/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `residentCount` | `3` |
| `clerkCount` | `1` |
| `serviceMinutes` | `2` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
