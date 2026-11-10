# Rebellion

Agents compare grievance and perceived arrest risk while police respond to active rebels and prison terms delay return. Legitimacy, risk aversion and local vision are theoretical variables rather than calibrated political forecasts.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Rebellion`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/rebellion/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialCopDensity` | `4` | number; ≥ 0; ≤ 100 |
| `initialAgentDensity` | `70` | number; ≥ 0; ≤ 100 |
| `vision` | `7` | number; ≥ 0; ≤ 10 |
| `governmentLegitimacy` | `0.82` | number; ≥ 0; ≤ 1 |
| `maxJailTerm` | `30` | integer; ≥ 0; ≤ 50 |
| `movement` | `true` | boolean |
| `visualization` | `"2D"` | `2D`, `3D` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setParameters`, `watchOne`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `watchedId`, `agents`.

The [UI binding](ui.ts) presents `Initial police (%)`, `Initial citizens (%)`, `Vision (fields)`, `Maximum jail term`, `Citizen movement`, `Symbols`, `Watch one`, `Tick`, `Police`, `Citizens` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `rebellion` and links any shared checks.
