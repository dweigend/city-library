# Urban Heat

Asphalt is hot at noon, but why is it still warm at three in the morning? This model runs three city blocks through synthetic days and nights and compares two ways to cool them: shade and watered vegetation. One step is one hour; all constants are teaching values.

## The mechanism

A sealed, a mixed and a planted block, each 100 m². Sun rises at 06:00 and peaks at noon; air temperature swings ±5 °C around its mean, warmest at 15:00. Every hour each surface:

- **absorbs sunlight** (sealed surfaces absorb more) minus whatever shade blocks,
- **evaporates water** if it has vegetation, in proportion to sunlight and watering,
- **exchanges heat with the air** in proportion to the temperature difference,
- and stores the remainder. Sealed blocks have twice the heat capacity of planted ones, so they warm and cool more slowly.

Oke (*The Energetic Basis of the Urban Heat Island*, 1982) explains urban warmth through exactly this energy balance, including heat stored by day and released at night. Here it runs as one explicit budget per block. Surface temperature is not air temperature or comfort.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setPolicy({ waterAvailability: 0 });
city.advance(40);
console.log(city.read().blocks.map(block => block.temperatureC.toFixed(1))); // planted is hottest at 15:00
```

## What to try

- **Day and night:** run two days with the defaults. At 15:00 the blocks reach 41.3, 39.7 and 38.1 °C; at 03:00 the sealed block is still 4.5 °C warmer than the planted one because of stored heat.
- **Shade:** block 40 % of the sun. The sealed block drops about 6 °C at 15:00 and about 2 °C at night, because less heat was stored.
- **Watering:** full watering cools the planted block to 33.4 °C by day but only to 25.1 °C at night, and doubles the water used. Without water the planted block becomes the hottest surface in the afternoon, yet it still cools fastest after sunset.

## What you see

- **Surface temperature:** each block on one fixed color scale from 15 to 50 °C (color bar below), with its difference to the air temperature and its evapotranspiration. The fixed scale keeps colors comparable between runs, so small differences show mainly in the numbers. The outlined green band shows shade.
- **Surface and air temperature** over the last two days, and the **cooling water** used so far.
- Select a block to see its full energy budget for the last hour.

Compare shade at the same clock time by day and by night. With shade 0.4 on day 2, the sealed block is 35.4 instead of 41.3 °C at 16:00 and still 28.1 instead of 30.4 °C at 04:00: there is no sun at night, so the night difference is heat the shaded surfaces did not store during the day.

## Limits

No longwave radiation, wind, building geometry, soil moisture or comfort index. Blocks do not exchange heat with each other.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts and focused tests: `tests/public-contracts/city-heat/`.
