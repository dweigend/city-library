# Taxi Cabs

Taxi agents serve zonal demand using distinct pickup, delivery and roaming branches with explicit trip accounting. Demand periods select different trip probabilities; the dispatch rules are not a calibrated city fleet study.

## Use

Run `bun run dev` from the repository root, open http://localhost:3101 and choose `Taxi Cabs`. Press Setup, then Step or Run/Pause. See [Lab usage](../../ui/agent-lab/README.md) for host options.

Headless, from a script in the repository root:

```ts
import { create } from "./models/taxi-cabs/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each `advance(1)` (also `step(1)`) updates signals, demand and passenger waiting, then activates cabs for pickup and travel before incrementing the tick and recording history. `currentPhase` is the demand period—AM Peak, Midday, PM Peak, Evening or Early Morning—not a partial execution phase. `lengthOfTimePeriod` controls its cycle and the `prob-…-AM/MD/PM/EVE/EM` inputs select origin–destination probabilities. A zero `lengthOfGreenLight` retains the source modulo-by-zero failure when advancing.

## Parameters

`create(options)` accepts these input keys. The [UI binding](ui.ts) distinguishes setup controls from live changes; [model.ts](model.ts) defines additional validation.

| Input | Default | Declared values |
| --- | --- | --- |
| `seed` | `1` | integer |
| `taxicabCount` | `25` | integer; ≥ 1; ≤ 50 |
| `lengthOfGreenLight` | `20` | integer; ≥ 0; ≤ 30 |
| `lengthOfTimePeriod` | `2000` | integer; ≥ 1; ≤ 5000 |
| `waitTimeMean` | `50` | number |
| `waitTimeSd` | `10` | number; ≥ 0 |
| `firstPassengerCost` | `0.78` | number; ≥ 0; ≤ 10 |
| `eachAdditionalPassengerCost` | `0.49` | number; ≥ 0; ≤ 5 |
| `eachGridCost` | `0.93` | number; ≥ 0; ≤ 10 |
| `eachTickCost` | `0.5` | number; ≥ 0.01; ≤ 5 |
| `prob-cbd-cbd-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-com-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-cbd-AM` | `1` | number; ≥ 0; ≤ 1 |
| `prob-res-res-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-res-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-cbd-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-com-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-res-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-com-AM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-cbd-MD` | `0.97` | number; ≥ 0; ≤ 1 |
| `prob-cbd-com-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-res-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-com-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-cbd-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-res-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-res-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-cbd-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-com-MD` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-res-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-res-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-cbd-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-com-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-res-PM` | `1` | number; ≥ 0; ≤ 1 |
| `prob-cbd-com-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-cbd-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-com-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-cbd-PM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-cbd-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-com-EVE` | `1` | number; ≥ 0; ≤ 1 |
| `prob-cbd-cbd-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-com-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-res-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-com-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-cbd-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-res-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-res-EVE` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-cbd-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-res-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-res-com-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-cbd-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-com-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-cbd-res-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-com-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-cbd-EM` | `0` | number; ≥ 0; ≤ 1 |
| `prob-com-res-EM` | `1` | number; ≥ 0; ≤ 1 |

## Actions and observations

Use `advance(...)` for progress and `read()` for observations; the model defines how work advances its tick.

Other instance procedures: `step`, `snapshot`, `setParameters`, `cabs`, `passengers`, `startTrafficLight`, `changeTrafficLightColors`, `reportCurrentPhase`, `generateDemand`, `taxiDemandAtField`, `passengersWaitForRide`, `updateDeliveryAndIncome`, `stopForRedElseGo`, `moveUp`, `moveDown`, `moveRight`, `moveLeft`, `moveStraight`, `makeUTurn`, `updateDestinationCoordinates`, `highlightDestinationFields`, `deliveryRelation`, `changeDirectionForDelivery`, `pickupPassengers`, `taxicabMoveRandom`, `resetCabAfterTrip`, `dropoffPassenger`, `taxicabMoveDeliver`, `go`. See their typed arguments in [model.ts](model.ts).

Model-specific `read()` fields include `occupiedCabs`, `totalIncome`, `currentPhase`, `currentPhaseAbbreviation`, `phaseCounter`, `rowGreen`, `columnGreen`, `cells`, `cabs`, `passengers`, `tripDistances`, `tripIncomes`, `tripDurations`.

The [UI binding](ui.ts) presents `cbd · cbd · AM`, `res · com · AM`, `res · cbd · AM`, `res · res · AM`, `com · res · AM`, `com · cbd · AM`, `com · com · AM`, `cbd · res · AM`, `cbd · com · AM`, `cbd · cbd · MD` and further views or controls.

## Sources and acceptance

Attribution and rights: [NOTICE.md](NOTICE.md). Baseline: [retained NetLogo source](original.nlogox). [Research and publication references](research.json) describe source-level scientific context, not empirical validation of this implementation.

[Local evidence](evidence/) holds model-specific records. The [catalog ledger](../catalog/progress.json) owns acceptance stages for `taxi-cabs` and links any shared checks.
