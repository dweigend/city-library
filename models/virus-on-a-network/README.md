# Virus on a Network

Susceptible nodes acquire infection through network neighbors; scheduled checks can remove infection and create permanent resistance. Network construction and check timing are part of the model, not continuous-time epidemic equations.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Virus on a Network`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/virus-on-a-network/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `numberOfNodes` | `150` | integer; ≥ 10; ≤ 300 |
| `averageNodeDegree` | `6` | integer; ≥ 1; ≤ 299 |
| `initialOutbreakSize` | `3` | integer; ≥ 1; ≤ 300 |
| `spreadChance` | `2.5` | number; ≥ 0; ≤ 10 |
| `recoveryChance` | `5` | number; ≥ 0; ≤ 10 |
| `resistanceChance` | `5` | integer; ≥ 0; ≤ 100 |
| `checkFrequency` | `1` | integer; ≥ 1; ≤ 20 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setStates`, `setConnections`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `nodes`, `edges`, `counts`, `percentages`.

The [UI binding](ui.ts) presents `Nodes`, `Mean degree`, `Initial infected`, `Spread chance (%)`, `Recovery chance (%)`, `Gain resistance (%)`, `Check frequency (ticks)`, `Tick`, `Susceptible`, `Infected` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `virus-on-a-network` and links any shared checks.
