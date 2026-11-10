# Model procedures and state ownership

A model should reveal its execution order before asking the reader to work through its implementation. Taxi Cabs, Traffic Grid, Traffic Grid Goal and Tijuana place that flow at the start of their factories. Each factory owns its domain state and exposes actions for callers. Source notices and public action names remain part of the model contracts.

Taxi and both Traffic factories show `go` and `step` first. Their callers use `step`/`advance` for World execution and post-success history recording. Existing low-level public procedures remain available; calling `go` directly retains its existing no-clock behavior. Tijuana shows its guarded action dispatcher first. Its source-specific Tick-before-procedure behavior, including failure effects, is deliberately preserved. Pure Tijuana rule-shape validation is outside the factory; it reads only the shared input descriptors and supplied record.

## Taxi observations

`read`/`snapshot` expose `occupiedCabs` and `totalIncome`. These derive from canonical cab vacancy/completed-income values using the existing UI aggregation equations. They are not separately stored counters, predictions or new income rules. UI monitors consume these reporters.

[Public model-consumer examples](../../tests/public-contracts/model-authoring/README.md) assert consistency with cab/history records, observation purity, detachment, rule edits, instance isolation and replay/accounting.

## Tijuana procedure matrix

The binding architecture requires domain behavior to be callable without UI through public TypeScript APIs. The existing typed `TijuanaModel` exposes clear, bounded cityscape calls, bounded simulation calls, rule changes, display refresh, node insertion, scenario admission and observation. The table distinguishes these supported action boundaries from private source procedures executed within them. It does not declare each private procedure to be a supported standalone action.

| Source procedure | Current implementation | Typed public path / execution context |
| --- | --- | --- |
| `setup` | `setup` | `advanceCityscape(count?)`, guarded while cityscape is incomplete |
| `generate-cityscape` | `generateCityscape` | Cityscape call through `setup` |
| `adjust` | `adjust` | Cityscape completion path |
| `generate-topography` | `generateTopography` | First cityscape call through `initializeRoads` |
| `towards-other-centers` | Inline service-center orientation in `initializeRoads` | First cityscape call |
| `generate-second-order` | `generateSecondOrder` | Cityscape builder phase |
| `maquiladoras` | `maquiladoras` | Cityscape adjustment phase |
| `initial-condition` | `initialCondition` | Cityscape migrant initialization |
| `initial-condition-2` | `initialCondition2` | Cityscape second initialization phase |
| `economics` | `economics` | Cityscape setup finalization |
| `update-display` | `updateDisplayImpl` | `updateDisplay()` error boundary; also called inside simulation |
| `go` | `go` | `advance(count?)`, guarded until cityscape is complete |
| `migrate-static` | `migrateStatic` | Simulation migration cadence |
| `move` | `move` | End of simulation procedure |
| `cross` | `cross` | Simulation crossing phase |
| `regularize` | `regularize` | Simulation settlement phase |
| `grow-city` | `growCity` | Simulation city-growth cadence |
| `regulate` | `regulate` | Simulation city-growth phase |
| `earn-spend` | Inline migrant savings update in `go` | Simulation accounting phase |
| `get-costs` | `getCosts` | Migrant initialization, economics and movement callers |

Public intervention actions `clear`, `setRules`, `addNode` and `setScenario` retain their existing contracts. Private procedures depend on live canonical agents, current setup phase and factory-owned globals. Publishing them separately would require explicit decisions about valid phase, agent admission, clock/history behavior and failure effects. No current accepted author example requires that additional standalone syntax. Whether the architecture's function-access rule requires direct procedure-level APIs beyond these public action paths remains an explicit contract question; it requires an explicit API decision. Any such expansion needs its own four or five frozen public examples before implementation.
