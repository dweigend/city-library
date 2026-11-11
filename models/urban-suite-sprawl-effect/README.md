# Urban Sprawl

Why do cities spread out? Seekers move toward attractive places and settle with some probability, which makes those places more attractive still. Sites that become too busy suddenly lose their attraction, so new arrivals look further away. `seekerPatience` and `waitBetweenSeeking` control how long seekers search.

Things to try:

- Lower `seekerPatience`. Do settlements become more scattered?
- Change `maxAttraction` and compare the settled area.

## Use

Choose **Urban Sprawl** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-sprawl-effect/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `smoothness` | `15` | integer; ≥ 1; ≤ 20 |
| `maxAttraction` | `15` | integer; ≥ 0; ≤ 30 |
| `personCount` | `200` | integer; ≥ 1; ≤ 750 |
| `seekerSearchAngle` | `84` | integer; ≥ 1; ≤ 360 |
| `seekerPatience` | `60` | integer; ≥ 0; ≤ 120 |
| `waitBetweenSeeking` | `15` | integer; ≥ 5; ≤ 60 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setAttractions`, `setAgents`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `buildThreshold`, `cells`, `agents`, `counts`, `totalAttraction`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Sprawl Effect* model by Felsen and Wilensky (2007). Attribution and license are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

The abrupt reset illustrates feedback; it is not a model of land markets or zoning. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-sprawl-effect`.
