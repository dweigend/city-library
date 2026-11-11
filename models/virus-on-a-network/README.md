# Virus on a Network

How does network structure shape an outbreak? Nodes are linked into a network with `averageNodeDegree`. Infected nodes infect each neighbor with `spreadChance`. Every `checkFrequency` steps, infected nodes may be cured with `recoveryChance`, and cured nodes become permanently resistant with `resistanceChance`.

Things to try:

- Raise `averageNodeDegree`. Does the virus spread faster or last longer?
- Check less often with a higher `checkFrequency` and compare.

## Use

Choose **Virus on a Network** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/virus-on-a-network/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `nodeCount` | `150` | integer; ≥ 10; ≤ 300 |
| `averageNodeDegree` | `6` | integer; ≥ 1; ≤ 299 |
| `initialOutbreakSize` | `3` | integer; ≥ 1; ≤ 300 |
| `spreadChance` | `2.5` | number; ≥ 0; ≤ 10 |
| `recoveryChance` | `5` | number; ≥ 0; ≤ 10 |
| `resistanceChance` | `5` | integer; ≥ 0; ≤ 100 |
| `checkFrequency` | `1` | integer; ≥ 1; ≤ 20 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setRules`, `setStates`, `setConnections`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`, `counts`, `percentages`.

## Sources and limits

Adapted from the NetLogo *Virus on a Network* model by Stonedahl and Wilensky (2008). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

Network construction and check timing are part of the model; it does not solve continuous-time epidemic equations. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `virus-on-a-network`.
