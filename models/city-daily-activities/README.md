# Daily Activities

A day has 24 hours, and travel eats some of them. This model shows how commuting distance, remote work and service opening hours decide which errands still fit. One step is 15 minutes; the town and schedules are synthetic.

## The mechanism

Households live in three neighborhoods: near, middle and far from work. Each has one adult and one child. Every morning each person gets a plan:

- Children travel to school, arriving at 08:00, and come home after 14:00.
- Adults travel to work, arriving at 08:00, and work until 16:00. With remote work they work at home.
- After work an adult runs a one-hour errand at the central or local service center, but only if they can arrive and finish before closing time. Otherwise they go home and the errand counts as missed.

Travel takes the straight-line distance at 12 km/h, rounded up to whole 15-minute slots. Every slot adds a quarter person-hour to home, work, school, services or travel.

The model applies fixed travel-time, co-presence and opening-hour constraints; it does not compute space-time prisms. The [scientific source dossier](../../docs/scientific-sources.md) records the research connection and limit.

```ts
import { model } from "./model.ts";

const town = model.create();
town.setRemoteWork(true);
town.advance(96);
console.log(town.read().today.travelPersonHours); // 11, only one hour less than commuting
```

## What to try

- **Remote work:** switch it on. Commutes disappear, but trips to the central services now start at home and get longer, so travel falls only from 12 to 11 person-hours a day. Switch *Services used* to local as well: travel drops to 7.
- **Closing time:** set *Services close at* to 17. Every commuter misses the errand. With remote work and closing at 17:30 only the two far-neighborhood adults miss it.
- Select a person to read their plan for the day.

Policy changes apply from the next day, because plans are made at midnight.

## What you see

- **Town:** places as outlines, people as dots (adults) and triangles (children), colored by what they are doing. Homes, work and school are labeled above their box, service places below. Travelers move along the gray routes of today's plans. The unused service center is drawn dimmer. A red ring marks an adult whose errand no longer fits today; the bottom line counts errands done and those that cannot fit today.
- **Errands of adults today:** done, still planned and unable to fit today. Compare runs at the same clock time, for example 20:00, when every errand of the day is settled.
- **Where residents are:** counts at each activity over the elapsed hours.
- **Person-hours today:** how the day's time is split; travel is the cost of distance.
- Select a resident to see the day's plan and the errand status read from it: planned, at services, done or unable to fit before closing.

## Limits

Schedules are fixed, nobody coordinates within a household, roads and congestion are absent, and every trip is a straight line.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-daily-activities/`.
