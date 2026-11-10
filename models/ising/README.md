# Ising

How does heat compete with the tendency of magnets to align? Every cell holds a spin, up or down. The model repeatedly picks a random cell and proposes to flip it. A flip that lowers the energy with its four neighbors is always accepted; one that raises it is accepted with a chance that grows with `temperature`. Magnetization measures how many spins point the same way.

Things to try:

- Start at a low temperature, then raise it past 2.27. What happens to magnetization?
- Start with all spins up (`probabilityOfSpinUp` 100) at a high temperature.

## Use

Choose **Ising** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/ising/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `81` | integer; ≥ 3; ≤ 201 |
| `height` | `81` | integer; ≥ 3; ≤ 201 |
| `seed` | `1` | integer |
| `probabilityOfSpinUp` | `50` | integer; ≥ 0; ≤ 100 |
| `temperature` | `2.27` | number; ≥ 0; ≤ 10 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `updateAt`, `setup`, `setTemperature`, `setSpins`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `sumOfSpins`, `magnetization`, `cells`.

## Sources and limits

Adapted from the NetLogo *Ising* model by Wilensky (2003). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Magnetization describes this finite lattice; a single run does not locate a critical point. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `ising`.
