# CRISPR Bacterium

Molecules move inside a cell, guide RNA and Cas complexes recognize targets, and transcription and degradation compete with viral invasion. Spacer acquisition and explicit infection actions make this a mechanistic teaching example rather than a quantitative molecular simulator.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `CRISPR Bacterium`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/crispr-bacterium/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `initialArraySize` | `15` | integer; ≥ 1; ≤ 30 |
| `maxVirusTypeCount` | `30` | integer; ≥ 1; ≤ 100 |
| `guideUnbindChance` | `5` | number; ≥ 0; ≤ 10 |
| `processivity` | `80` | number; ≥ 0; ≤ 100 |
| `crisprFunction` | `20` | number; ≥ 0; ≤ 100 |
| `labels` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `go`, `setParameters`, `infect`, `randomInfection`, `commonInfection`, `transcribe`, `goRNAPs`, `goCas9s`, `goGuideRNAs`, `goCasDimers`, `goViruses`, `move`, `wallAhead`, `degrade`, `infected`, `dnaFields`, `updateLabels`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `array`, `virusEvent`, `infected`, `followingId`, `rnapCount`, `cas9Count`, `guideCount`, `dimerCount`, `virusCount`, `agents`, `cells`, `edges`, `guideSequences`.

The [UI binding](ui.ts) presents `Common infection`, `Random infection`, `Tick`, `RNAP`, `Cas9`, `Guides`, `Viruses`, `Event`, `CRISPR Bacterium`, `Guide and spacer sequences` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `crispr-bacterium` and links any shared checks.
