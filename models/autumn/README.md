# Autumn

Weather drives leaf water, chlorophyll and sugar changes, with separate color, shape and falling rules. The displayed pigments and weather responses are illustrative quantities rather than a calibrated forecast of leaf fall.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Autumn`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/autumn/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `numberOfLeaves` | `278` | integer; ≥ 1; ≤ 2500 |
| `startSugarMean` | `50` | number; ≥ 0; ≤ 100 |
| `startSugarStddev` | `25` | number; ≥ 0; ≤ 50 |
| `windFactor` | `3` | number; ≥ 0; ≤ 10 |
| `temperature` | `11` | number; ≥ 0; ≤ 40 |
| `rainIntensity` | `19` | integer; ≥ 0; ≤ 30 |
| `sunIntensity` | `97` | number; ≥ 0; ≤ 100 |
| `leafDisplayMode` | `"attachedness"` | `solid`, `chlorophyll`, `water`, `sugar`, `carotene`, `anthocyanin`, `attachedness` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `clip`, `forwardWeather`, `changeColor`, `changeShape`, `setShapeForValue`, `showIntensity`, `attachedLeaves`, `setupTree`, `makeWindBlow`, `makeRainFall`, `moveWater`, `adjustWater`, `adjustChlorophyll`, `adjustSugar`, `fallIfNecessary`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `leaves`, `deadLeaves`, `raindrops`, `suns`, `cells`.

The [UI binding](ui.ts) presents `Tick`, `Leaves`, `Dead leaves`, `Raindrops`, `Autumn`, `Weather`, `Leaf averages`, `Live`, `Dead`, `Temperature` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `autumn` and links any shared checks.
