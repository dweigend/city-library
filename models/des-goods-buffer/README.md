# DES Urban Goods Buffer

A bounded consolidation store with producer backpressure and timed collections. Minutes and indivisible crates.

Run `bun run dev` and choose **DES Urban Goods Buffer**. Setup creates the model; step or Run/Pause advances it. These synthetic scenarios are not calibrated city forecasts.

Headless, from a repository script:

```ts
import { create } from "./models/des-goods-buffer/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Inputs

| Input | Default |
| --- | --- |
| `capacity` | `2` |
| `lots` | `3` |
| `firstCollection` | `4` |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) binds those public operations. The [scenario contract](../../docs/development/des-examples.md) defines assumptions, units and expected behavior. [Lab usage](../../ui/agent-lab/README.md) covers controls and model switching.
