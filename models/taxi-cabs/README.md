# Taxi Cabs

How do taxis find passengers in a city whose demand changes over the day? The street grid is divided into a central business district, commercial and residential areas. Passengers appear with origin–destination probabilities that depend on the time of day, from the morning peak to early morning, and wait for a cab. Cabs cruise, pick up passengers, drive them to their destination under traffic lights and collect trip income set by the fare inputs (`firstPassengerCost`, `eachGridCost` and others).

Things to try:

- Change `taxicabCount` and compare passenger waiting with total income.
- Raise the probabilities for trips into the business district in the morning peak and watch where cabs end up.

## Use

Choose **Taxi Cabs** in [Model Lab](../../ui/model-lab/README.md).

From a script in the repository root:

```ts
import { create } from "./models/taxi-cabs/model.ts";

const simulation = create();
simulation.advance(1);
const observation = simulation.read();
```

Each `advance(1)` (also `step(1)`) updates signals, demand and passenger waiting, then activates cabs for pickup and travel before incrementing the tick and recording history. `currentPhase` is the demand period—AM Peak, Midday, PM Peak, Evening or Early Morning—not a partial execution phase. `lengthOfTimePeriod` controls its cycle and the `prob-…-AM/MD/PM/EVE/EM` inputs select origin–destination probabilities. A zero `lengthOfGreenLight` retains the source modulo-by-zero failure when advancing.

## Parameters

`create(options)` accepts these inputs. [ui.ts](ui.ts) decides which are setup controls and which can change during a run; [model.ts](model.ts) adds further validation.

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

Call `advance()` with an optional step count to run the model; the model defines how a step advances its tick. Call `read()` for a detached snapshot.

Other actions: `step`, `snapshot`, `setParameters`, `cabs`, `passengers`, `startTrafficLight`, `changeTrafficLightColors`, `reportCurrentPhase`, `generateDemand`, `taxiDemandAtField`, `passengersWaitForRide`, `updateDeliveryAndIncome`, `stopForRedElseGo`, `moveUp`, `moveDown`, `moveRight`, `moveLeft`, `moveStraight`, `makeUTurn`, `updateDestinationCoordinates`, `highlightDestinationFields`, `deliveryRelation`, `changeDirectionForDelivery`, `pickupPassengers`, `taxicabMoveRandom`, `resetCabAfterTrip`, `dropoffPassenger`, `taxicabMoveDeliver`, `go`. Their typed arguments are in [model.ts](model.ts).

Model-specific `read()` fields include `occupiedCabCount`, `totalIncome`, `currentPhase`, `currentPhaseAbbreviation`, `phaseCounter`, `rowGreen`, `columnGreen`, `cells`, `cabs`, `passengers`, `tripDistances`, `tripIncomes`, `tripDurations`.

## Sources and limits

Adapted from the NetLogo *Taxi Cabs* model by Dongping and Wilensky (2019). Attribution, license and adaptation notes are in [NOTICE.md](NOTICE.md); the [retained source](original.nlogox) keeps the original. [research.json](research.json) collects the scientific background and publications; it describes the source model's context, not a validation of this implementation.

Demand probabilities, fares and costs are inputs of the teaching model, not calibrated values for a real city. Seeded runs do not reproduce NetLogo runs, because the random generators differ.

[Local evidence](evidence) holds model-specific records. The [catalog ledger](../catalog/progress.json) records the acceptance stages for `taxi-cabs`.
