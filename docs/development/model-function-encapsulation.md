# Model procedures and state ownership

This change makes the execution story visible at the start of the Taxi Cabs, Traffic Grid, Traffic Grid Goal and Tijuana factories. Existing step/procedure bodies are moved without changing statement order. Each factory retains one domain-state owner; no controller, registry or second clock is introduced. Source notices and existing public action names remain unchanged.

Taxi and both Traffic factories show `go` and `step` first. Their callers use `step`/`advance` for World execution and post-success history recording. Existing low-level public procedures remain available; calling `go` directly retains its existing no-clock behavior. Tijuana shows its guarded action dispatcher first. Its source-specific Tick-before-procedure behavior, including failure effects, is deliberately preserved. Pure Tijuana rule-shape validation is outside the factory; it reads only the shared input descriptors and supplied record.

## Taxi observations

`read`/`snapshot` add `occupiedCabs` and `totalIncome`. These derive from canonical cab vacancy/completed-income values using the existing UI aggregation equations. They are not separately stored counters, predictions or new income rules. UI migration is separate; this change does not edit UI files.

The four [public model-consumer examples](../../examples/model-authoring/README.md) and their hashes were frozen in `44efd4c` before runtime changes. They initially failed because the observations were absent. They cover consistency with cab/history records, observation purity and detachment, rule-edit/instance isolation and replay/accounting. Earlier frozen examples and hashes are unchanged.

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

Public intervention actions `clear`, `setRules`, `addNode` and `setScenario` retain their existing contracts. Private procedures depend on live canonical agents, current setup phase and factory-owned globals. Publishing them separately would require explicit decisions about valid phase, agent admission, clock/history behavior and failure effects. No current accepted author example requires that additional standalone syntax. Whether the architecture's function-access rule requires direct procedure-level APIs beyond these public action paths remains an explicit contract question; this refactor does not silently settle it or invent exports. Any such expansion needs its own four or five frozen public examples before implementation.

## Verification scope

Executed after this change: `bun test tests/selected-transport-city.test.ts tests/selected-transport-roads.test.ts tests/tijuana.test.ts` passed 34 tests / 322 assertions; all four new public scripts passed unchanged and `sha256sum -c examples/model-authoring/SHA256SUMS` passed; `bun run typecheck` passed, including Svelte checking with zero errors/warnings; `git diff --check` passed. A deterministic before/after snapshot comparison was byte-identical (SHA-256 `326d845c42a28c2b3cc8ab413cd3cb7e836f31548b8872b3d621a0cdaaa60c67` for both files). The comparison uses seed 42, 15 steps for Taxi and both Traffic models, and three cityscape calls for Tijuana; it excludes only the two intentionally added Taxi observation properties. Its equality is a bounded regression check, not proof of all possible trajectories. No UI files change and no new browser or independent review acceptance is claimed here.
