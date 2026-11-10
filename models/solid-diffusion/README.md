# Solid Diffusion

Atoms exchange with vacancies on a lattice, changing composition through local movement. Vacancy availability and finite boundaries constrain transport; the example does not calibrate diffusion coefficients for a material.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Solid Diffusion`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/solid-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `35` | integer; ≥ 3; ≤ 101 |
| `height` | `35` | integer; ≥ 3; ≤ 101 |
| `seed` | `1` | integer |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `moveAtomToHere`, `setAtoms`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `atoms`, `vacancies`, `maxDiffusionDistance`, `columns`.

The [UI binding](ui.ts) presents `Tick`, `Vacancies`, `Max diffusion distance squared`, `Atoms`, `Atoms by column`, `Distance squared`, `Greens`, `Blues`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `solid-diffusion` and links any shared checks.
