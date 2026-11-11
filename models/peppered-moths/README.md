# Peppered Moths

How can a changing environment reverse which color survives? Moths range from light to dark, and the background they rest on can be polluted or cleaned. Moths that contrast with the background are more likely to be eaten (`selection`). Survivors reproduce, and offspring color can vary with `mutation`.

Use `polluteWorld`, `cleanUpWorld` or `cyclePollution` to change the background and follow the color mix.

Things to try:

- Pollute the world, wait, then clean it up. How quickly does the color mix respond?
- Set `selection` to 0. Does the color mix still change?

## Use

Choose **Peppered Moths** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/peppered-moths/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `mothCount` | `100` | integer; ≥ 0; ≤ 200 |
| `speed` | `41` | number; ≥ 1; ≤ 100 |
| `mutation` | `15` | number; ≥ 0; ≤ 100 |
| `selection` | `50` | number; ≥ 0; ≤ 100 |
| `cyclePollution` | `false` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `polluteWorld`, `cleanUpWorld`, `cyclePollution`, `mothsMate`, `mothsGrimReaper`, `mothsGetEaten`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `darkness`, `darkening`, `envColor`, `pollutionPercent`, `lightMoths`, `mediumMoths`, `darkMoths`, `moths`, `cells`.

## Sources and limits

Adapted from the NetLogo *Peppered Moths* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Predation is invisible and inheritance is simplified. The model illustrates selection; it does not reproduce historical moth counts or the genetics of melanism. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `peppered-moths`.
