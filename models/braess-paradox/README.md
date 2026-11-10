# Braess' Paradox

Can a new road make everyone's trip slower? Commuters travel from start to end along one of several routes. Travel time on some roads grows with the number of cars on them. Commuters remember recent travel times and choose routes according to `mode`, with some `randomness`. Toggling `middleOn` opens or closes a shortcut, so you can compare average travel times with and without it.

Things to try:

- Let the model settle with `middleOn`, then turn it off. How does the average travel time change?
- Lower `spawnRate`. Does the shortcut still have the same effect with less traffic?

## Use

Choose **Braess' Paradox** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/braess-paradox/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `middleOn` | `true` | boolean |
| `spawnRate` | `10` | integer; ≥ 1; ≤ 10 |
| `smoothing` | `10` | integer; ≥ 1; ≤ 10 |
| `mode` | `"probabilistic-greedy"` | `best-known-with-random-deviation`, `empirical-analytical`, `probabilistic-greedy` |
| `randomness` | `16` | integer; ≥ 0; ≤ 100 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `travelTime`, `top`, `bottom`, `middle`, `spawnTime`, `middlePrev`, `avg`, `spawnedCarCount`, `completedCarCount`, `topProb`, `bottomProb`, `middleProb`, `routeCounts`, `commuters`, `cells`.

## Sources and limits

Adapted from the NetLogo *Braess Paradox* model by Rasmussen and Wilensky (2019). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The paradox depends on demand and the chosen cost rules; it is not a general statement about road building. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `braess-paradox`.
