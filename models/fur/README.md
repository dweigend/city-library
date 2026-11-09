# Fur

Pigment cells compare short-range activation with longer-range inhibition in elliptical neighborhoods. Fixed geometry and binary pigment states can create spots or stripes without modeling tissue growth or species-specific genetics.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Fur`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/fur/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialDensity` | `50` | number; ≥ 0; ≤ 100 |
| `innerRadiusX` | `3` | integer; ≥ 0; ≤ 10 |
| `innerRadiusY` | `3` | integer; ≥ 0; ≤ 10 |
| `outerRadiusX` | `6` | integer; ≥ 0; ≤ 10 |
| `outerRadiusY` | `6` | integer; ≥ 0; ≤ 10 |
| `ratio` | `0.35` | number; ≥ 0; ≤ 2 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `restart`, `go`, `ellipseIn`, `ellipseRing`, `pickNewColor`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `whiteCount`, `cells`.

The [UI binding](ui.ts) presents `Restart`, `Tick`, `White cells`, `Skin`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `fur` and links any shared checks.
