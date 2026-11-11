# Land Use Change

The same amount of new housing can leave a city with one connected park or with a dozen green scraps. This model makes that difference visible on 48 one-hectare parcels. One step is one year; the parcels and demands are synthetic.

## The mechanism

Targets say how many hectares should be residential and commercial; the rest stays green. Each year up to two parcels change use, always toward the use with the largest shortfall. *Where* the change happens follows a local rule:

- **Compact** growth converts the parcel with the most neighbors already in the new use, closest to the center first.
- **Dispersed** growth converts the parcel with the fewest such neighbors, farthest out first.

Protected parcels never change. You can protect a connected green corridor, six scattered parcels of the same total area, or single parcels.

Demand decides how much land changes; neighbor scores decide where it changes. This split is an original teaching simplification. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setGrowthPattern("dispersed");
city.applyProtectionPlan("corridor");
city.advance(16);
console.log(city.read().largestGreenPatchHa); // 11
```

## What to try

- **Compact or dispersed?** Run 16 years with each pattern. Both end with 24 ha residential and 6 ha commercial. Compact growth keeps the largest green patch at 10 ha with a 1.8 km urban edge; dispersed growth leaves ten patches, the largest only 4 ha, and a 4.9 km edge.
- **Corridor or scattered protection?** Choose dispersed growth, then press *Protect green corridor* in one run and *Protect scattered parcels* in another. Both protect 6 ha. The corridor keeps an 11 ha connected patch; scattered protection ends with twelve patches and no patch above 4 ha.
- Select a parcel with the mouse or arrow keys and toggle its protection.

## What you see

- **Parcels:** color shows the use. White outlines are protected; a white diamond marks a parcel converted this year.
- **Open land and its largest connected patch:** when the two lines separate, green land is fragmenting.
- **Built area** and **urban edge:** the boundary length between built and open land; long edges mean scattered development.

To compare one factor at a time, change either the growth pattern or the protection plan; changing both mixes two effects.

## Limits

All parcels are equal. There are no prices, roads, zoning law or land markets, and the green measures count area only, not habitat quality.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-land-use/`.
