# Slime Mold Aggregation

Can cells gather into clumps without a leader cell? Each cell leaves a chemical that spreads and fades. It sniffs ahead and to both sides within `sniffAngle` and turns toward the strongest scent if it exceeds `sniffThreshold`; otherwise it wiggles randomly.

Starting from an even spread, local reinforcement can pull the population into growing clusters.

Things to try:

- Raise `sniffThreshold`. Do clusters still form?
- Change `agentCount` and compare how many clusters appear.

## Use

Choose **Slime Mold Aggregation** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/slime/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `agentCount` | `400` | integer; ≥ 1; ≤ 1500 |
| `sniffThreshold` | `1` | number; ≥ 0; ≤ 5 |
| `sniffAngle` | `45` | number; ≥ 0; ≤ 180 |
| `wiggleAngle` | `40` | number; ≥ 0; ≤ 45 |
| `wiggleBias` | `0` | number; ≥ -40; ≤ 40 |

## Actions and observations

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `setup`, `go`, `turnTowardChemical`, `chemicalAhead`, `setParameters`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `chemicalTotal`, `cells`, `agents`.

## Sources and limits

Adapted from the NetLogo *Slime* model by Wilensky (1997). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](source.nlogox) keeps the original. The [scientific sources dossier](../../docs/scientific-sources.md) connects the scientific background to model files. The retained research record documents source identity and access limits; it does not validate this implementation.

The model reduces slime-mold biology to movement, signaling, diffusion and decay. It does not model cell differentiation or the full life cycle. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `slime`.
