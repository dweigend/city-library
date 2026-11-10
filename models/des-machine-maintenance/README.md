# Machine Maintenance

Spatial machines fail, wait for repair teams and record time-weighted availability. Minutes; synthetic failure cycles.

Run `bun run dev` and choose **DES Machine Maintenance**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-machine-maintenance/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `repairTeams` | `1` |
| `repairMinutes` | `3` |
| `failureMinutes` | `4` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
