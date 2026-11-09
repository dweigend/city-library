# Measurements, studies and event-driven city models

The headless library provides the bounded capabilities below. Twenty illustrative city models compose them with World, Grid and Graph. These models are additional teaching examples; they do not advance the fixed selected-200 catalog ledger or establish calibrated city forecasts.

| Capability | Public contract | Executable examples |
| --- | --- | --- |
| Pure measurements | `measurements.define(project).read(model)` | `examples/mesa-measurements` |
| Bounded explicit history | `storage.history`, `add`, `samples`, `delete` | `examples/mesa-measurements` |
| Scenarios and serial studies | `experiments` design, replication, execution budgets and summary | `examples/mesa-measurements` |
| Activation and lifecycle | World fixed, shuffle and priority activation; canonical membership | `examples/mesa-dynamics` |
| Two-phase updates | Explicit synchronous compute, then commit | `examples/mesa-dynamics` |
| Linear thresholds | Explicit units, strict start/inclusive end | `examples/mesa-dynamics` |
| Causal event dispatch | Agenda time, priority, sequence and event limits | `examples/des` |
| Capacity and waiting | Resource, Store, ServiceQueue and Signal own their grants/tickets | `examples/des` |
| World/Agenda attachment | Explicit clock and identity coordination | `examples/mesa-attachment` |
| Event observation | TimeWeighted and EventTrace | `examples/des` |

History’s recording coordinate does not advance World or Agenda. Same-time numeric measurements must be aggregated before History records them; EventTrace permits distinct events with tied times. Resource and Store remain the sole allocation owners; model ledgers describe outcomes.

## Models and views

The [ten measurement/activation scenarios](models.md) and [ten discrete-event scenarios](../development/des-examples.md) live with their UI bindings and usage guides under `models/<slug>`. [Primary mechanism views](visual-correction.md) show spatial state, networks or explicit schematics; charts and ledgers supplement those views.

## Verification and limits

`bun run check` runs strict types, tests, numbered public examples, build and packed consumers. `bun run build:ui` builds the single Svelte host. The [shared UI acceptance record](../../ui/agent-lab/acceptance/README.md) identifies its checked states and limits. Model-specific [browser evidence](browser-verification.md) remains scoped to the implementation recorded there; relocation and passing shell checks do not create new browser or scientific approval.

Serial studies and bounded history do not provide worker transport, snapshot continuation or pause/resume. Fixed/shuffle/priority activation does not imply full NetLogo compatibility. Stochastic examples, queue policies and city quantities remain synthetic assumptions; empirical validation and broader API/catalog coverage stay open in [PLAN](../../PLAN.md).
