# Urban Stormwater

A retention basin and green ground both hold back rain. But what happens when a second storm arrives before either has recovered? This model follows a small catchment hour by hour. Areas, soils and storms are synthetic.

## The mechanism

Two 2000 m² plots drain to one basin: a sealed plot (80 % impervious) and a green plot (20 % impervious). Rain falls for three hours, and with the double pattern again five hours later. Each hour:

1. Rain on impervious ground runs off.
2. Pervious ground soaks up rain into a 20 mm soil store. The wetter the soil, the less it takes; it drains 1 mm per hour into deep ground.
3. Runoff fills the basin. The outlet releases at most 4 m³ per hour; whatever does not fit in the basin overflows.

These are the ideas of the US EPA Storm Water Management Model (SWMM): impervious and pervious runoff, infiltration that declines as soil fills, and storage with a throttled outlet. Here they run in a two-plot teaching form; SWMM's equations are not reproduced.

```ts
import { model } from "./model.ts";

const catchment = model.create({ stormPattern: "double" });
catchment.advance(24);
console.log(catchment.read().overflowM3.toFixed(1)); // 88.0, more than four times a single storm
```

## What to try

- **One storm or two?** A single three-hour storm overflows 20.1 m³. Switch *Storms* to double: overflow rises to 88.0 m³, because the second storm finds the basin still 40 m³ full and the soil still wet.
- **Infiltration or retention?** Double the infiltration to 12 mm/h: the single storm overflows only 8.3 m³, but the double storm still 78.2 m³. Instead set the basin to 90 m³ in setup: the single storm no longer overflows, the double storm still overflows 58.0 m³.
- Watch the soil bars: a full soil store takes almost nothing.

## What you see

- **Catchment:** sealed (gray) and pervious (green) parts of each plot, its soil water (brown bar, mm), rain while it falls, runoff in its own lane into the basin, basin fill, outlet and overflow. Line widths grow with volume per hour.
- **Hydrograph:** rain, runoff, outlet and overflow for each completed hour. Storage flattens the peak but needs time to empty.
- **Water held back** in the basin and the soil, and the **cumulative water balance** with its residual (shown as ≈ 0 below 10⁻⁶ m³).

Compare at the same hour: a double storm, better infiltration (12 mm/h) or a larger basin (120 m³) each change one factor against the single-storm default.

## Limits

No flow routing time, no evaporation, no ponding on the surface, no pollutants and no real rain records.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-stormwater/`.
