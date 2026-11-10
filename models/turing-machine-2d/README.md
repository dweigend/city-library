# Turing Machine 2D

Each moving head reads a binary field, follows one of four explicit state/symbol rules, writes and moves. Multiple heads share the tape, so activation order matters; a complex trace does not prove universal computation.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Turing Machine 2D`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/turing-machine-2d/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `width` | `151` | integer; ≥ 3; ≤ 301 |
| `height` | `151` | integer; ≥ 3; ≤ 301 |
| `seed` | `1` | integer; ≥ -2147483648; ≤ 4294967295 |
| `heads` | `32` | integer; ≥ 1; ≤ 256 |
| `colorPaths` | `true` | boolean |
| `example` | `1` | integer; ≥ 1; ≤ 5 |
| `off0State` | `1` | integer; ≥ 0; ≤ 1 |
| `off0Turn` | `"Backwards"` | `--`, `Right`, `Backwards`, `Left` |
| `off0On` | `true` | boolean |
| `off1State` | `0` | integer; ≥ 0; ≤ 1 |
| `off1Turn` | `"Right"` | `--`, `Right`, `Backwards`, `Left` |
| `off1On` | `true` | boolean |
| `on0State` | `0` | integer; ≥ 0; ≤ 1 |
| `on0Turn` | `"--"` | `--`, `Right`, `Backwards`, `Left` |
| `on0On` | `true` | boolean |
| `on1State` | `1` | integer; ≥ 0; ≤ 1 |
| `on1Turn` | `"Left"` | `--`, `Right`, `Backwards`, `Left` |
| `on1On` | `true` | boolean |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `setRules`, `setConfiguration`, `setupExample`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `rules`, `cells`, `agents`.

The [UI binding](ui.ts) presents `Setup example`, `${`, `Tick`, `On cells`, `Tape and heads`, `Head`, `Transition rules`.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained source](source.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `turing-machine-2d` and links any shared checks.
