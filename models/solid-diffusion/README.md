# Solid Diffusion

How do two solids mix where they touch? Two kinds of atoms start on either side of a boundary, with a few vacancies in the lattice. An atom next to a vacancy can jump into it, so atoms slowly cross the boundary. The model tracks the concentration profile across the columns and the farthest distance atoms have traveled.

Things to try:

- Follow the concentration profile over time. How does the transition zone widen?
- Change the lattice size and compare how quickly atoms cross.

## Use

Choose **Solid Diffusion** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/solid-diffusion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `35` | integer; ≥ 3; ≤ 101 |
| `height` | `35` | integer; ≥ 3; ≤ 101 |
| `seed` | `1` | integer |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `moveAtomToHere`, `setAtoms`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `atoms`, `vacancyCount`, `maxDiffusionDistance`, `columns`.

## Sources and limits

Adapted from the NetLogo *Solid Diffusion* model by Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Vacancy count and finite edges limit transport; the model does not calibrate diffusion coefficients for a real material. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `solid-diffusion`.
