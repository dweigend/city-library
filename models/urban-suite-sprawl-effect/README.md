# Urban Suite - Sprawl Effect

Seekers follow attraction, settle probabilistically and modify the shared landscape; heavily used sites can reset abruptly. The source's reset rule illustrates feedback rather than realistic land-market clearing or zoning.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Sprawl Effect`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-sprawl-effect/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `smoothness` | `15` | integer; ≥ 1; ≤ 20 |
| `maxAttraction` | `15` | integer; ≥ 0; ≤ 30 |
| `population` | `200` | integer; ≥ 1; ≤ 750 |
| `seekerSearchAngle` | `84` | integer; ≥ 1; ≤ 360 |
| `seekerPatience` | `60` | integer; ≥ 0; ≤ 120 |
| `waitBetweenSeeking` | `15` | integer; ≥ 5; ≤ 60 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setAttractions`, `setAgents`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `buildThreshold`, `cells`, `agents`, `counts`, `totalAttraction`.

The [UI binding](ui.ts) presents `Setup smoothing passes`, `Setup population`, `Maximum attraction`, `Search angle`, `House waiting time`, `Tick`, `Seekers`, `Houses`, `Build threshold`, `Total attraction` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-sprawl-effect` and links the retained checks.
