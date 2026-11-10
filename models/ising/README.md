# Ising Model

Random sequential Metropolis proposals flip individual spins according to local energy and temperature. Magnetization describes this finite lattice; a single run does not locate a thermodynamic critical point.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Ising Model`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/ising/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `81` | integer; ≥ 3; ≤ 201 |
| `height` | `81` | integer; ≥ 3; ≤ 201 |
| `seed` | `1` | integer |
| `probabilityOfSpinUp` | `50` | integer; ≥ 0; ≤ 100 |
| `temperature` | `2.27` | number; ≥ 0; ≤ 10 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `updateAt`, `setup`, `setTemperature`, `setSpins`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `sumOfSpins`, `magnetization`, `cells`.

The [UI binding](ui.ts) presents `Initial spin up (%)`, `Attempted flips`, `Magnetization`, `Spins`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `ising` and links any shared checks.
