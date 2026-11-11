# Daisyworld

Can living things regulate their environment without meaning to? Black and white daisies grow on a planet lit by a sun of adjustable brightness. Dark daisies absorb more light and warm their surroundings, light daisies reflect it and cool them. Local temperature in turn decides how well daisies grow and spread, and heat diffuses across the surface.

The `scenario` input can hold the sun's brightness constant or change it over time, so you can watch whether the daisy mix shifts in response.

Things to try:

- Choose a `scenario` with rising luminosity and compare the global temperature with and without daisies (use `removeAllDaisies`).
- Change `albedoBlacks` and `albedoWhites` closer together. Does the temperature still level off?

## Use

Choose **Daisyworld** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/daisyworld/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialBlackDaisyCount` | `20` | integer; ≥ 0; ≤ 50 |
| `initialWhiteDaisyCount` | `20` | integer; ≥ 0; ≤ 50 |
| `solarLuminosity` | `0.8` | number; ≥ 0.001; ≤ 3 |
| `albedoSurface` | `0.4` | number; ≥ 0; ≤ 1 |
| `albedoBlacks` | `0.25` | number; ≥ 0; ≤ 0.99 |
| `albedoWhites` | `0.75` | number; ≥ 0; ≤ 0.99 |
| `scenario` | `"maintain-current-luminosity"` | `ramp-up-ramp-down`, `maintain-current-luminosity`, `low-solar-luminosity`, `our-solar-luminosity`, `high-solar-luminosity` |
| `showTempMap` | `true` | boolean |
| `showDaisies` | `true` | boolean |
| `paintDaisiesAs` | `"remove"` | `add-black`, `add-white`, `remove` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `paint`, `removeAllDaisies`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `globalTemperature`, `blackCount`, `whiteCount`, `daisies`, `cells`.

## Sources and limits

Adapted from the NetLogo *Daisyworld* model by Novak and Wilensky (2006). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Two daisy types, a stylized growth curve and a simple energy balance are deliberate reductions. A temperature plateau here shows that the feedback is possible under these rules, not that Earth's climate regulates itself. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `daisyworld`.
