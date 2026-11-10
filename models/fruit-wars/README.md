# Fruit Wars

Can sharing pay off more than fighting? Foragers search fruit bushes for energy, age and reproduce. When a forager arrives at a bush that others already use, its inherited reactive aggression decides whether it challenges them. Each challenged forager either stands its ground, depending on its own proactive aggression, or flees for `ticksToFlee` steps; strength decides who wins a fight. Foragers that share a bush peacefully gain `collaborationBonus`. Offspring inherit their traits with `rateOfMutation`, and separate counters record deaths from starvation, old age and fights.

Things to try:

- Lower `collaborationBonus` and compare the murder and starvation rates.
- Change `bushGrowthChance`. Does scarcity change which strategies spread?

## Use

Choose **Fruit Wars** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/fruit-wars/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialFruitBushCount` | `40` | integer; ≥ 0; ≤ 40 |
| `initialForagerCount` | `40` | integer; ≥ 1; ≤ 100 |
| `ticksToFlee` | `49` | integer; ≥ 0; ≤ 100 |
| `rateOfMutation` | `1` | number; ≥ 0; ≤ 10 |
| `collaborationBonus` | `5` | number; ≥ 0.1; ≤ 5 |
| `maxAge` | `500` | integer; ≥ 1; ≤ 500 |
| `bushGrowthChance` | `6` | integer; ≥ 0; ≤ 100 |
| `showEnergy` | `false` | boolean |
| `visualization` | `"reactive-aggression"` | `none`, `reactive-aggression`, `proactive-aggression`, `strength`, `speed`, `intelligence` |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `growFruitBushes`, `setRules`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `murderCount`, `starvationCount`, `ageDeathCount`, `deathCount`, `totalForaged`, `forageCount`, `totalPopulation`, `averagePopulation`, `avgForage`, `aggressionHistograms`, `foragers`, `bushes`, `deaths`.

## Sources and limits

Adapted from the NetLogo *Fruit Wars* model by Rasmussen and Wilensky (2019). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Traits and payoffs are stylized evolutionary rules, not a model of real human or animal conflict. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `fruit-wars`.
