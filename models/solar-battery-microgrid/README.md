# Solar Battery Microgrid

Illustrative lossless hourly storage with linear reserve crossings; no grid engineering forecast.

Run `bun run dev` and choose **Solar Battery Microgrid**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/solar-battery-microgrid/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `seed` | `1` |
| `solarKw` | `4` |
| `demandKw` | `2` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/mesa-expansion/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
