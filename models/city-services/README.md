# Neighborhood Services

A city has money for 12 school places, 12 clinic visits and 12 shop visits a day. Should it build one central center or two smaller ones? This model counts who gets served and why the others do not: the service was too far away or already full. One step is one day; positions and capacities are synthetic.

## The mechanism

Sixteen households on a 4 × 4 grid (2 km apart horizontally, 1 km vertically) each need a school place, a clinic visit and a shop visit every day. Facilities sit either in one central hub or in two hubs 2 km west and east of the center, splitting the same capacity.

For each service, the closest households claim first. Each takes the nearest facility within the trip limit that still has room. Requests end as **served**, **full** (a facility was in reach but full) or **too far** (nothing in reach).

Luo and Wang (2003) measure accessibility with exactly these two ingredients, distance limits and competition for limited supply, in the two-step floating catchment method. This model allocates with them rather than computing their ratio.

```ts
import { model } from "./model.ts";

const services = model.create();
services.setPolicy({ layout: "distributed" });
services.advance();
console.log(services.read().servedCount, services.read().unservedHouseholdCount); // 36 4
```

## What to try

- **Central or distributed?** With the defaults the central hub serves 24 of 48 requests: the eight households in the outer columns are too far away. Switch to the distributed layout: 36 requests are served and only the bottom row, last in line, finds both nearby hubs full.
- **Longer trips instead:** keep the central hub and raise the trip limit to 3.5 km. Again 36 are served, but now the four corner households miss out. The average trip for served requests is 1.99 km, compared with 1.35 km in the distributed layout; the central default serves only 24 requests at an average of 1.46 km.
- **More capacity:** distributed hubs with 16 per kind serve everyone.

## What you see

- **Access map:** households colored by services received (red none, green all three). Diamonds had a full facility in reach; triangles had none in reach. Rings show the trip limit around each hub; lines connect households to the hubs that served them.
- **Households by services received:** bars use the map's colors (red none, green all three). The same average can hide very different distributions.
- **Daily requests by outcome:** served, full and too far per completed day, as bars side by side so equal counts stay visible.

## Limits

Demand is the same every day, distances are straight lines and nobody queues or comes back later. Order of service follows distance, then household number.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts: `tests/public-contracts/city-services/`.
