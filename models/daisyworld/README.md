# Daisyworld

Black and white daisies alter local albedo, which affects temperature, growth and reproduction while heat diffuses. This simplified climate–population feedback is distinct from a calibrated planetary climate model.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Daisyworld`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/daisyworld/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `startBlacks` | `20` | integer; ≥ 0; ≤ 50 |
| `startWhites` | `20` | integer; ≥ 0; ≤ 50 |
| `solarLuminosity` | `0.8` | number; ≥ 0.001; ≤ 3 |
| `albedoSurface` | `0.4` | number; ≥ 0; ≤ 1 |
| `albedoBlacks` | `0.25` | number; ≥ 0; ≤ 0.99 |
| `albedoWhites` | `0.75` | number; ≥ 0; ≤ 0.99 |
| `scenario` | `"maintain current luminosity"` | `ramp-up-ramp-down`, `maintain current luminosity`, `low solar luminosity`, `our solar luminosity`, `high solar luminosity` |
| `showTempMap` | `true` | boolean |
| `showDaisies` | `true` | boolean |
| `paintDaisiesAs` | `"remove"` | `add black`, `add white`, `remove` |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `paint`, `removeAllDaisies`, `setRules`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `globalTemperature`, `blackCount`, `whiteCount`, `daisies`, `cells`.

The [UI binding](ui.ts) presents `Remove all daisies`, `Tick`, `Global temperature`, `Black daisies`, `White daisies`, `Daisyworld`, `Luminosity`, `solar luminosity`, `temperature`, `Population`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `daisyworld` and links any shared checks.
