# Virtual Ants

Can a fully deterministic rule look random? Each virtual ant (vant) stands on a field of black and white cells. It turns right on one color and left on the other, flips the color of its cell and moves forward. The rule has no randomness, and `reverse` runs it backward step by step.

Things to try:

- Run one vant for many thousands of steps and watch whether its trace changes character.
- Use `reverse` after a while. Does the field return to its starting state?

## Use

Choose **Virtual Ants** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/vants/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `241` | integer; ≥ 3; ≤ 301 |
| `height` | `241` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `vantCount` | `1` | integer; ≥ 1; ≤ 16 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `reverse`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *Vants* model by Wilensky (2005). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Irregular-looking traces here come from a deterministic rule, not from random forcing. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `vants`.
