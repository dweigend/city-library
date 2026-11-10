# Fruit Wars

Foragers seek fruit, spend energy, reproduce with heritable traits and may fight or flee when they meet. Separate starvation, age and murder counters help distinguish outcomes that a total population plot would hide.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Fruit Wars`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/fruit-wars/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

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

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `growFruitBushes`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `murderCount`, `starvationCount`, `ageDeathCount`, `deathCount`, `totalForaged`, `forageCount`, `totalPopulation`, `averagePopulation`, `avgForage`, `aggressionHistograms`, `foragers`, `bushes`, `deaths`.

The [UI binding](ui.ts) presents `Initial bushes`, `Mutation rate (%)`, `Maximum age`, `Bush growth chance (%)`, `Tick`, `Population`, `Average population`, `Average forage`, `Murders`, `Starvation deaths` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `fruit-wars` and links any shared checks.
