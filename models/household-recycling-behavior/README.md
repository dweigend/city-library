# Household Recycling Behavior

Illustrative seeded synchronous peer adoption on a ring; no empirical behavior prediction.

Run `bun run dev` and choose **Household Recycling Behavior**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/household-recycling-behavior/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `households` | `12` |
| `influence` | `0.5` |
| `seed` | `1` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/execution-studies/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
