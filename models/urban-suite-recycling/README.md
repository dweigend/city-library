# Recycling and Resource Use

Can careful use of resources hold its own against fast exploitation? Recyclers take part of a resource and can restore wasted cells, at a cost (`recyclingWasteCost`). Wasteful agents use up cells completely. Everyone needs energy to survive, and resources regrow with `resourceRegeneration`.

Things to try:

- Compare the two groups with `resourceRegeneration` low and high.
- Switch on `agentsSeekResources`. Does that favor one group?

## Use

Choose **Recycling and Resource Use** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/urban-suite-recycling/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `recyclerCount` | `25` | integer; ≥ 0; ≤ 50 |
| `wastefulCount` | `25` | integer; ≥ 0; ≤ 50 |
| `maxStoredEnergy` | `50` | integer; ≥ 10; ≤ 100 |
| `recyclingWasteCost` | `0.5` | number; ≥ 0; ≤ 2 |
| `resourceRegeneration` | `25` | integer; ≥ 0; ≤ 100 |
| `agentsSeekResources` | `false` | boolean |
| `showEnergy` | `true` | boolean |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setPeople`, `setResources`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `people`, `cells`, `counts`, `landPercentages`.

## Sources and limits

Adapted from the NetLogo *Urban Suite - Recycling* model by Felsen and Wilensky (2007). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Regeneration and recycling costs are abstractions, not measured household material flows. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `urban-suite-recycling`.
