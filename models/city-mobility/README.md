# Urban Mobility

The main road is jammed every morning. Should the city widen it or build a better walking and cycling route? This model runs one morning peak on a tiny network and lets each traveler choose based on the queues they see. One step is one minute; times and capacities are synthetic.

## The mechanism

For the first 60 minutes, three people leave Home for Jobs every minute. They have three options:

| Route | Free-flow time | Capacity |
| --- | --- | --- |
| Main road via the junction | 2 × 5 min | `carCapacity` vehicles per link |
| Bypass | 12 min | 3 vehicles |
| Walking/cycling path | `walkMinutes` | effectively unlimited |

Each traveler estimates every route as its travel time plus the queue ahead divided by the link's throughput, adds `carPenalty` to the car options, and takes the cheapest. Cars wait in first-in-first-out queues when a link is full. Later travelers see the queues that earlier ones created, so demand spreads itself over the routes.

Travelers react to congestion through the local route-cost rules. This model does not demonstrate a Braess paradox. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const commute = model.create();
commute.setPolicy({ carCapacity: 10 });
commute.advance(90);
console.log(commute.read().carTripCount);        // 151 instead of 83
console.log(commute.read().totalWaitingMinutes); // 801 instead of 461
```

## What to try

- **Widen the road:** raise *Main road capacity* from 5 to 10 before running. Mean trip time improves a little (17.1 → 15.9 min), but 68 walkers switch to the car and total queueing almost doubles.
- **Better walking route:** set the path to 12 minutes instead. Car traffic shrinks slightly, queues nearly vanish (63 waiting person-minutes) and the mean trip drops to 11.7 min.
- **Car penalty:** 5 minutes of parking search or a charge moves the split to 77 cars and 103 walkers.
- Press *Dispatch 20 extra trips now* to add a sudden pulse, or set 1000 initial trips for a stress test.

## What you see

- **Morning commute:** the three routes with moving cars (pale triangles) and walkers (pale dots) outlined in black so they stand out on every route color. Queued cars are amber squares in a fixed 4 × 3 block beside each link entrance; longer queues add a "+n" count. Labels give each route's time, occupancy and queue.
- **Departures by choice:** how the route split develops during the peak.
- **Cars waiting in queues** and **completed trip times by mode**; the histogram stays empty until the first trips arrive.

## Limits

Link times do not slow down with traffic; congestion only appears as queues. Nobody changes departure time, and the walking path never congests.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts and focused tests: `tests/public-contracts/city-mobility/`.
