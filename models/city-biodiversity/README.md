# Urban Habitat Connectivity

A species thrives in a western park cluster and could spread to small green spaces in the east. The city can afford one more hectare of habitat. Should it become a stepping stone between the two areas, or enlarge an eastern patch? This model follows the expected occupancy of each patch year by year. All numbers are synthetic.

## The mechanism

Seven habitat patches differ in size and position. Every year, each patch:

- is **colonized** in proportion to its connectivity: the sum over all other patches of their occupancy × area × e^(−distance / permeability). Better habitat quality raises colonization.
- **loses** its population with a probability that falls with the square root of its area and rises when quality is low.

Occupancy here is the expected share of time a patch is occupied, a probability between 0 and 1, not a count of individuals or observed extinctions.

Hanski (*Metapopulation Dynamics*, Nature 1998) describes how patch area, isolation and recolonization decide whether species persist in fragmented landscapes. This model uses those relationships in a deterministic teaching form.

```ts
import { model } from "./model.ts";

const city = model.create();
city.setRestorationPlan("stepping-stone");
city.advance(10);
console.log(city.read().eastOccupancy.toFixed(2)); // 0.37, against 0.27 without it
```

## What to try

- **Stepping stone or larger patch?** Compare the two options for *Extra hectare of habitat*. After 10 years the stepping stone has spread the species further east (0.37 against 0.36). After 50 years the larger eastern patch holds it better (0.47 against 0.44). Connections speed up spread; area makes it last.
- **Lose the bridge:** remove the bridge patch. The east still gets colonists from far away, but less: 0.21 instead of 0.27 after 10 years.
- **A harder city to cross:** halve the permeability. The east stays practically empty (0.001), whatever the hectares, and the west shrinks too.
- Select any patch to see its connectivity and last year's gains and losses, or remove it.

## What you see

- **Habitat patches:** circles on a km map, sized by area and shaded by expected occupancy (pale is likely occupied, value below); the outline marks the region (green west, blue east). Gray lines are dispersal links, thicker when patches are close and the city is permeable. Removed patches are gray outlines.
- **Expected occupancy by region** for west, east and all patches, and **occupancy by patch**.

To isolate one factor, compare the stepping stone, the enlarged east patch and the removed bridge separately; combining them mixes effects.

## Limits

One generic species, no individuals, no randomness, fixed positions, and no other species or seasons.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-biodiversity/`.
