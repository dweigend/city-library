# Urban Energy Supply

Every evening this neighborhood runs short of electricity. Would twice as many solar panels fix it, or a bigger battery, or moving some evening demand to midday? One step is one hour; profiles and capacities are synthetic.

## The mechanism

Solar output follows a half-sine from 06:00 to 18:00; wind adds a constant 2 kW. Electricity demand peaks at 12 kWh per hour from 17:00 to 21:00. Each hour:

1. Solar and wind serve demand first.
2. A shortfall is covered by the battery (at most 4 kW and what is stored), then by import (at most the import limit). What is left is **unmet**.
3. A surplus charges the battery (at most 4 kW and the free space). What is left is **curtailed**.

District heat is a separate system with its own demand and network limit. Shifting a share of evening demand moves that share of each hour 17–20 to hours 11–14; the daily total stays the same.

Storage value depends on generation timing and other flexibility. The neighborhood uses synthetic daily profiles; regional capacity estimates do not transfer. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const twiceTheSolar = model.create({ solarCapacityKw: 24 });
twiceTheSolar.advance(48);
console.log(twiceTheSolar.read().lastDay.unmetKwh);     // 11, as before
console.log(twiceTheSolar.read().lastDay.curtailedKwh); // 127.6 instead of 39.2
```

## What to try

- **More solar:** set solar to 24 kW. The evening shortage stays at 11 kWh a day; the extra energy arrives at noon, when the battery is already full, and is curtailed.
- **More storage:** set the battery to 16 kWh instead. Unmet demand falls to 3 kWh a day.
- **Flexible demand:** move 25 % of evening demand to midday (unmet 4 kWh) or 50 % (nothing unmet). Change it live and watch the next evening.
- Raise the import limit to see how much the grid connection decides.

## What you see

- **Energy flows in the last hour:** where each kilowatt-hour came from and went, with the amount on every line; line widths grow with energy up to 12 kWh. The battery box shows the hour's flow (in or out); the bar below it and the "stored" label show the stock at the end of the hour.
- **Electricity balance:** the last hour's inputs (solar and wind, battery out, import, unmet shortfall) and outputs (demand, battery in, curtailed) with their difference.
- **Hourly electricity:** demand, solar+wind, battery output and import per completed hour.
- **Battery charge and discharge:** energy into (+) and out of (−) the battery in each completed hour.
- **Battery stored energy** at the end of each hour and **daily totals** (unmet, curtailed, import) for the last full day and today so far.

## Limits

One fixed weather day, no prices, no losses, no grid charging or export, and heat and electricity do not interact.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts and focused tests: `tests/public-contracts/city-energy/`.
