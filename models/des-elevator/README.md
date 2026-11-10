# Elevator Service

A synthetic, deterministic elevator model with six floors, two cars and four passenger places per car by default. Time is measured in seconds. Initial demand and optional scheduled arrivals are finite.

Run `bun run dev` and choose **DES Elevator**. Setup creates the model; step or Run/Pause advances it. **Add passenger** calls the public `addPassenger(from?, to?)` action, defaulting to the ground and top floors.

Empty cars reserve the oldest pending directional call, with deterministic passenger-sequence and car-number ties. Cars move one floor per Agenda event and complete alighting before boarding. Separate floor/direction queues own waiting membership; one Resource per car owns occupied capacity. Full and opposite-direction calls retain their original age.

Headless, from a repository script:

```ts
import { create } from "./models/des-elevator/model.ts";

const elevator = create();
elevator.addPassenger(0, 5);
elevator.advance(1);
const observation = elevator.read();
elevator.dispose();
```

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `floors` | `6` | Number of floors |
| `elevators` | `2` | Number of cars |
| `capacity` | `4` | Passenger places per car |
| `travelTime` | `2` | Seconds per adjacent-floor move |
| `doorTime` | `1` | Seconds for opening and separately closing |
| `transferTime` | `1` | Seconds per boarding or alighting passenger |
| `initialPassengers` | `6` | Deterministic initial journeys |
| `arrivalInterval` | `0` | Seconds between scheduled arrivals; zero disables them |
| `arrivalLimit` | `0` | Maximum additional scheduled arrivals |
| `maxEventsPerStep` | `1000` | Headless per-step event bound; omitted from ordinary UI setup |

[model.ts](model.ts) owns validation, actions and detached observations; [ui.ts](ui.ts) projects the same floor queues and cabin occupants. The [model contract](../../docs/development/des-elevator-contract.md) defines dispatch, timing, failure and measurement boundaries. The [source record](../../docs/research/des-elevator-sources.md) documents the MIT-licensed Salabim samples at pinned revision [`99bc8b2213d66a7287f04952cabc1fb9aa6c369d`](https://github.com/salabim/salabim/tree/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models) and the deliberate adaptations.

This TypeScript teaching controller demonstrates scheduling and conservation. It is not calibrated elevator traffic, certified lift control or whole-Salabim parity; it uses the existing Agent Lab UI rather than a Python bridge.
