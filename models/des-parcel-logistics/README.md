# Parcel Logistics

A bounded depot feeds a single van; delivery and return follow weighted network costs. Synthetic minutes.

Run `bun run dev` and choose **DES Parcel Logistics**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-parcel-logistics/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `parcels` | `2` |
| `depotCapacity` | `1` |
| `loadingMinutes` | `1` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
