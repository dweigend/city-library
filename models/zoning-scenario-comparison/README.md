# Zoning Scenario Comparison

Illustrative seeded density-cap studies over synthetic buildable parcels; no planning-compliance claim.

Run `bun run dev` and choose **Zoning Scenario Comparison**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/zoning-scenario-comparison/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `parcels` | `12` |
| `baseCap` | `2` |
| `seed` | `1` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/mesa-expansion/models.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
