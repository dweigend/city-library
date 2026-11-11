# Water and Wastewater

A two-month dry spell is coming and the reservoir will not last. Ask everyone to save a little early, or ration hard once storage is low? This model follows one reservoir through the season. One step is one day; volumes are synthetic.

## The mechanism

The reservoir holds 10 000 m³ and starts at 8000 m³. Normally 220 m³ flow in per day; during the 60-day dry spell only 40 m³. The city wants 200 m³ a day. Each day:

1. If storage at the start of the day is below the **savings trigger**, the city asks for less: demand × (1 − **cut**).
2. Inflow arrives; anything above capacity spills.
3. The reservoir supplies what is asked for, as far as it has water. The rest is **shortage**.
4. 80 % of supplied water returns as wastewater. The treatment plant handles up to its capacity; the rest leaves untreated. Treated water does not return to the reservoir.

Draper and Lund (2004) analyze "hedging": giving up some water now to keep it for later demand. Here the rule is a simple, visible trigger with a known dry spell, not an optimal policy.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setConservationRule({ conservationTrigger: 0.6, conservationShare: 0.15 });
city.advance(120);
console.log(city.read().totalShortageM3, city.read().worstDayCutShare); // 0 0.15
```

## What to try

- **No rule (default):** the reservoir runs dry near the end of the dry spell. In total only 1200 m³ are missing, but on the worst days 80 % of demand goes unserved.
- **Early and modest:** save 15 % whenever storage is below 60 %. Savings run for 84 days, nobody is cut off, and storage never falls below 120 m³.
- **Late and deep:** cut 40 % only below 25 %. Also no shortage, but restrictions are deeper and, in total, 3360 m³ instead of 2520 m³ are asked of residents.
- Raise *Treatment* to 200 m³/day: untreated wastewater disappears, but drinking water does not change.

## What you see

- **Water path:** inflow, reservoir fill with the amber savings trigger (drawn only while a demand cut is set), spill, city supply with saved and missing water, wastewater, treated and untreated outflows for the last completed day. Line widths grow with volume.
- **Reservoir storage and savings trigger:** when the blue line crosses the amber line, savings start the next day.
- **Daily demand and who carries the deficit:** supplied water, water saved on request and shortage.

## Limits

The dry spell is known in advance and identical every run. No pipes, pressure, water quality, groundwater or prices.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-water/`.
