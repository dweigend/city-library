# Housing Market

Who finds a home when a city pays low-income tenants an allowance, and who when it builds homes instead? This model runs a small rental market month by month. Households differ only in income, and one posted rent applies to every home. All numbers are synthetic.

## The mechanism

Twenty-four households earn from 1000 to 5600 per month, split into low, middle and high income thirds. Each household bids 30 % of its income. A housing allowance raises only the low-income bids. Every month:

1. Homes that finished construction become vacant.
2. Rent moves with vacancy: above the 5 % target it falls, below it rises.
3. Tenants whose bid is now below the rent lose their home (displacement).
4. Searching households with bid ≥ rent move into vacant homes, highest bid first.
5. If rent reaches the construction threshold, the market starts one new home. Construction takes three months; you can also commission public homes.

This model has no building ages or quality. Added supply lowers rent until lower bids reach it under these local rules; this is a synthetic price-led access mechanism, not an empirical estimate. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const market = model.create();
market.setHousingAllowance(400);
market.advance(24);
console.log(market.read().rent.toFixed(0)); // 903 instead of 718 without the allowance
```

## What to try

- **Allowance:** set *Allowance for low incomes* to 400 and run two years. Four low-income households find homes, but the allowance pushes the rent up and a middle-income household without support is displaced. Set the allowance back to 0: the subsidized households lose their homes in the next month.
- **Supply:** in a fresh run, press *Commission 3 public homes* twice. Three months later six homes appear, the rent falls and over two years four low-income households move in without any allowance.
- Combine both and compare the rent line with the first experiment.

## What you see

- **Homes and searching households:** each square is a home, filled with the color of its tenant's income group. White outlines are vacant, amber outlines are under construction and small gray squares are the remaining building sites up to the maximum number of homes. Circles below are households still searching; diamonds were displaced. Select a home or household for its bid, rent and status.
- **Bids and posted rent:** every household's bid against the current rent, both in currency per month. The allowance appears as a step at the low incomes.
- **Housed by income group** and **posted rent** over time.

## Limits

One rent fits all homes. Households never move voluntarily, landlords never set individual prices and nobody leaves the city. Construction costs and public budgets are not modeled.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and the revision history. Public scripts: `tests/public-contracts/city-housing/`.
