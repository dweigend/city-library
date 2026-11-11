# Fur Patterns

Can a simple local rule produce spots and stripes? Every cell is either colored or plain. A colored cell activates nearby cells within an inner ellipse and inhibits cells in a surrounding outer ring, weighted by `ratio`. Each cell sums these influences and changes its color accordingly.

The shapes of the inner and outer ellipses decide whether the pattern turns spotty or striped.

Things to try:

- Make `innerRadiusX` differ from `innerRadiusY` and look for stripes.
- Change `ratio` and compare how much of the field ends up colored.

## Use

Choose **Fur Patterns** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/fur/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `restart`, `go`, `ellipseIn`, `ellipseRing`, `pickNewColor`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `whiteCount`, `cells`.

## Sources and limits

Adapted from the NetLogo *Fur* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Fixed neighborhood shapes and two cell states leave out growth, tissue mechanics and genetics. Similar patterns do not show that a particular animal uses this mechanism. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `fur`.
