# Urban Material Cycles

A festival week leaves the city with far more waste than usual. Will a better recycling rate get the streets clean sooner? This model follows waste as flows and as a stock that piles up when collection cannot keep pace. One step is one day; masses are synthetic.

## The mechanism

Every day the city produces 100 kg of waste, plus 150 kg extra on each of five festival days. Collection takes at most 120 kg a day from everything waiting. Of what is collected, a share is reused, a share of the rest recycled, and the remainder disposed. Whatever is not collected stays in the city as uncollected stock.

This model represents material accounting with one stock and five flows, with a mass balance you can check every day. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setPolicy({ recyclingFraction: 0.8 });
city.advance(60);
console.log(city.read().peakBacklog, city.read().clearedDay); // 650 48, as without the change
```

## What to try

- **Recycle more:** raise recycling from 0.4 to 0.8. Disposal falls from 3645 to 1215 kg over 60 days, but the backlog still peaks at 650 kg and lingers until day 48. Recycling only treats what has been collected.
- **Collect more:** set collection to 160 kg/day. The backlog peaks at 450 kg and is gone by day 23.
- **Produce less:** cut normal waste to 80 kg/day. The peak is 550 kg and the streets are clear by day 29.

## What you see

- **Material flows:** waste entering the uncollected bin (filled to its current stock on a fixed scale; a triangle on the rim and "> scale" mean the stock exceeds that scale), collection against its capacity, and the three destinations. Line widths grow with kilograms per day.
- **Uncollected waste:** the stock over time, including setup.
- **Daily flows** for completed days and **where collected waste went** since setup.

## Limits

No sorting or processing capacity, no market for recovered material, no waste types and no transport. Recovered mass simply leaves the system.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts and focused tests: `tests/public-contracts/city-materials/`.
