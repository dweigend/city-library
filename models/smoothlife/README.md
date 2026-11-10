# SmoothLife

Disk and annulus averages feed a continuous-state transition rule with normalized neighborhood weights. Resolution, radii and transition parameters define this numerical pattern system rather than a literal continuous limit of Life.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `SmoothLife`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/smoothlife/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `128` | integer; ≥ 3; ≤ 256 |
| `height` | `128` | integer; ≥ 3; ≤ 256 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `innerRadius` | `3` | number; ≥ 0; ≤ 50 |
| `outerRadius` | `9` | number; ≥ 0.5; ≤ 50 |
| `minBirth` | `0.278` | number; ≥ 0; ≤ 1 |
| `maxBirth` | `0.365` | number; ≥ 0; ≤ 1 |
| `minSurvive` | `0.267` | number; ≥ 0; ≤ 1 |
| `maxSurvive` | `0.445` | number; ≥ 0; ≤ 1 |
| `innerStepWidth` | `0.147` | number; ≥ 0.001; ≤ 0.5 |
| `outerStepWidth` | `0.028` | number; ≥ 0.001; ≤ 0.5 |
| `paintValue` | `1` | number; ≥ 0; ≤ 1 |
| `paintRadius` | `3` | number; ≥ 1; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setCells`, `setRules`, `eraseAll`, `paint`, `setDrawing`, `draw`, `visualizeTransition`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `drawing`, `innerCount`, `outerCount`, `cells`.

The [UI binding](ui.ts) presents `Erase all`, `Paint`, `Paint selected`, `Tick`, `Disk cells`, `Annulus cells`, `Cells`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `smoothlife` and links any shared checks.
