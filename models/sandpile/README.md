# Sandpile

Added grains trigger topplings that distribute sand locally and lose grains at open boundaries. Avalanche sizes and durations depend on the finite lattice and driving rule; a finite histogram does not prove a scaling law.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Sandpile`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/sandpile/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `101` | integer; ≥ 3; ≤ 201 |
| `height` | `101` | integer; ≥ 3; ≤ 201 |
| `seed` | `1` | integer |
| `initial` | `"random"` | `random`, `uniform` |
| `grainsPerField` | `1` | integer; ≥ 0; ≤ 3 |
| `dropLocation` | `"random"` | `center`, `random`, `mouse-click` |
| `animateAvalanches` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `dropAt`, `exploreAt`, `clearExplore`, `setExploreMode`, `clearData`, `setupUniform`, `setupRandom`, `setLive`, `stabilize`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `exploreMode`, `total`, `totalOnTick`, `average`, `cells`, `sizePlot`, `lifetimePlot`, `sizes`, `lifetimes`.

The [UI binding](ui.ts) presents `Highlight avalanches`, `Setup random`, `Setup uniform`, `Clear size and lifetime data`, `Explore`, `Tick`, `Average`, `Last avalanche size`, `Last avalanche lifetime`, `Pile` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `sandpile` and links any shared checks.
