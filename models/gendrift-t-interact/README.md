# GenDrift T interact

Moving agents copy colors after local encounters, while walls can divide the interaction space. A lost color cannot return through selection alone; color copying represents neutral drift rather than explicit mating or chromosomes.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `GenDrift T interact`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/gendrift-t-interact/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `number` | `300` | integer; ≥ 1; ≤ 1000 |
| `colors` | `5` | integer; ≥ 2; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setParameters`, `placeWall`, `removeWall`, `removeAllWalls`, `setWallMode`, `drawWall`, `makeAgent`, `meet`, `moveOffWall`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `maxPercent`, `wallMode`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Setup preserving walls`, `Place walls`, `Remove walls`, `Remove all walls`, `Tick`, `Most populous (%)`, `Genetic drift and walls`, `Agent populations`, `Color ${c}`, `Selected agent`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `gendrift-t-interact` and links any shared checks.
