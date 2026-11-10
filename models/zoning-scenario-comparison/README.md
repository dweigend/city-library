# Zoning Scenario Comparison

How much housing capacity does a higher density cap add? The model compares two scenarios: a cap of `baseCap` dwellings per parcel and a cap two higher. Each scenario is run with three seeds. In a run, every parcel is buildable with a fixed chance and then adds the cap's number of dwelling slots. One step completes one whole run, so six steps finish the study, which summarizes the outcomes per scenario.

Things to try:

- Compare the two scenario summaries after six steps.
- Change `seed` and check whether the summaries change and whether the higher cap still gives more capacity.

## Use

Choose **Zoning Scenario Comparison** in [Agent Lab](../../ui/agent-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/zoning-scenario-comparison/model.ts";

const study = create({ parcelCount: 12, baseCap: 2, seed: 1 });
study.advance(6);
const { completedRunCount, summaries } = study.read();
```

## Parameters

`create(options)` accepts these inputs; [model.ts](model.ts) validates them.

| Input | Default | Declared values | Meaning |
| --- | --- | --- | --- |
| `parcelCount` | `12` | integer; ≥ 1; ≤ 100 | Synthetic parcels per run |
| `baseCap` | `2` | integer; ≥ 1; ≤ 10 | Dwelling slots per buildable parcel in the base scenario |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967293 | First of the three replication seeds |

## Actions and observations

`advance()` completes the next planned run. `read()` reports the `runPlan`, planned and completed run counts, each run's `outcomes` and per-scenario `summaries`.

## Sources and limits

An original City Library teaching model with invented numbers. The [scenario description](../../docs/execution-studies/models.md) lists its assumptions, units and asserted behavior; the mechanism checks are in [spatial-models.test.ts](../../tests/spatial-models.test.ts) and [model-regressions.test.ts](../../tests/model-regressions.test.ts). Passing them shows that the mechanism works as described, not that the model checks planning compliance or housing demand.
