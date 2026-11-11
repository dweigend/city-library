# Three Doors

Should you switch doors in the Monty Hall game? A prize hides behind one of three doors. Each contestant picks a door, the host, who knows where the prize is, opens another door without the prize, and the contestant then stays or switches. Each contestant switches with a personal tendency; with `gradation` off, contestants either always or never switch.

Probability theory says switching wins two thirds of the time. The race lets you watch whether the switchers pull ahead.

Things to try:

- Run with `gradation` off and compare the win counts of switchers and stayers.
- Switch on `gradation`. How does the win rate depend on the tendency to switch?

## Use

Choose **Three Doors** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/three-doors/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `contestantCount` | `300` | integer; ≥ 1; ≤ 1000 |
| `gradation` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Live references: `world`. [model.ts](model.ts) describes what they return.

Model-specific `read()` fields include `racers`.

## Sources and limits

Adapted from the NetLogo *Three Doors* model by Wilensky (1998). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The host's knowledge and reveal rule are essential; if the host opened doors at random, the comparison would differ. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `three-doors`.
