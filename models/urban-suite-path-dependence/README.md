# Urban Suite - Path Dependence

Firm settlement probabilities respond to regional quality and existing firms under alternative decision branches. Different random histories can reinforce different locations; one run cannot establish the frequency of lock-in.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Urban Suite - Path Dependence`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/urban-suite-path-dependence/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `initialFirmCount` | `200` | integer; ≥ 0; ≤ 1000 |
| `distribute` | `false` | boolean |
| `regionSize` | `0` | integer; ≥ 0; ≤ 5 |
| `increasingReturns` | `0.5` | number; ≥ 0; ≤ 1 |
| `attemptCount` | `1` | integer; ≥ 1; ≤ 20 |
| `birth` | `false` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `disturb`, `setFirms`, `setQualities`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `cells`, `firms`, `counts`, `largestPopulation`, `maximumOccupants`, `winningAreas`, `histogram`, `warnings`.

The [UI binding](ui.ts) presents `Distribute firms`, `Disturb`, `Region radius`, `Search attempts`, `Tick`, `Firms`, `Settled`, `Searching`, `Largest regional population`, `Maximum cell occupancy` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

The [catalog ledger](../catalog/progress.json) owns acceptance stages for `urban-suite-path-dependence` and links the retained checks.
