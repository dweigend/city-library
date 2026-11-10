# Autumn

Why do leaves change color in autumn? Each leaf on a tree holds water, chlorophyll and sugar. Weather drives these values: sun, temperature, rain and wind change them step by step. As chlorophyll fades, other pigments show through. Wind loosens the leaves, and a leaf falls once it is no longer attached.

`leafDisplayMode` chooses which hidden quantity the leaf colors and shapes show.

Things to try:

- Lower `temperature` and `sunIntensity` together and watch the leaf colors.
- Raise `windFactor`. How quickly do the leaves fall?

## Use

Choose **Autumn** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/autumn/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `leafCount` | `278` | integer; ≥ 1; ≤ 2500 |
| `startSugarMean` | `50` | number; ≥ 0; ≤ 100 |
| `startSugarStddev` | `25` | number; ≥ 0; ≤ 50 |
| `windFactor` | `3` | number; ≥ 0; ≤ 10 |
| `temperature` | `11` | number; ≥ 0; ≤ 40 |
| `rainIntensity` | `19` | integer; ≥ 0; ≤ 30 |
| `sunIntensity` | `97` | number; ≥ 0; ≤ 100 |
| `leafDisplayMode` | `"attachedness"` | `solid`, `chlorophyll`, `water`, `sugar`, `carotene`, `anthocyanin`, `attachedness` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setParameters`, `clip`, `forwardWeather`, `changeColor`, `changeShape`, `setShapeForValue`, `showIntensity`, `attachedLeaves`, `setupTree`, `makeWindBlow`, `makeRainFall`, `moveWater`, `adjustWater`, `adjustChlorophyll`, `adjustSugar`, `fallIfNecessary`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `leaves`, `deadLeaves`, `raindrops`, `suns`, `cells`.

## Sources and limits

Adapted from the NetLogo *Autumn* model by Wilensky (2005). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Pigment levels and weather responses are illustrative quantities. The colors summarize chemistry; they do not forecast leaf fall for a real tree or species. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `autumn`.
