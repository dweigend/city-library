# CRISPR Ecosystem

Bacteria consume food, reproduce and carry spacer arrays; viruses infect, replicate and may change. Innate protection, spacer loss and adaptive memory are selected ecological assumptions, not fitted marine-community rates.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `CRISPR Ecosystem`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/crispr-ecosystem/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialBacteria` | `50` | integer; ≥ 0; ≤ 100 |
| `initialViruses` | `250` | integer; ≥ 0; ≤ 1000 |
| `maxVirusTypes` | `50` | integer; ≥ 1; ≤ 100 |
| `infectionChance` | `5` | number; ≥ 0; ≤ 10 |
| `spacerLossChance` | `1` | number; ≥ 0; ≤ 2 |
| `crispr` | `true` | boolean |
| `plottedVirus` | `35` | integer; ≥ 0; ≤ 99 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setup`, `setupWorld`, `setupVirusPlot`, `updateVirusPlot`, `plotNewVirus`, `focalVirusPercent`, `focalArrayPercent`, `averageArrayLength`, `stdDevArrayLength`, `randomPosition`, `moveBacteria`, `bacteriaEatFood`, `reproduceBacteria`, `spacerLoss`, `bacteriaLive`, `moveVirus`, `infect`, `replicate`, `maybeDegrade`, `virusesLive`, `replenishFood`, `growFood`, `go`, `setParameters`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `plotVirus`, `focalVirusPercent`, `focalArrayPercent`, `averageArrayLength`, `stdDevArrayLength`, `virusSequences`, `arraySequences`, `arrayLengths`, `bacteriaCount`, `virusCount`, `coevolutionHistory`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Plot new virus`, `Mean array length`, `Array standard deviation`, `Focal virus %`, `Focal array %`, `Tick`, `Bacteria`, `Viruses`, `CRISPR Ecosystem`, `CRISPR-virus coevolution` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `crispr-ecosystem` and links any shared checks.
