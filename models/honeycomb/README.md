# Honeycomb

Can a regular lattice emerge from movement and a fading trail? Bees move in circles and leave a chemical that spreads and evaporates. The chemical changes how fast they move and how tightly they turn, so the trail they leave shapes where they go next.

Over time, the combined trails can form a honeycomb-like pattern.

Things to try:

- Change `beeCount` and compare the regularity of the pattern.
- Hide the bees with `hideBees` to see the chemical field alone.

## Use

Choose **Honeycomb** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/honeycomb/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `beeCount` | `250` | integer; ≥ 1; ≤ 500 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `go`, `hideBees`, `showBees`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `chemicalTotal`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *Honeycomb* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

These are artificial rules. The source explicitly does not claim that real bees build combs this way, and the honeycomb pattern is not evidence for any particular biological mechanism. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `honeycomb`.
