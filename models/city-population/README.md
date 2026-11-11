# Population and Households

How does migration today shape births, deaths and household demand years later? This model follows a small synthetic city in annual age cohorts. One step is one year. The rates are illustrative, not a forecast.

## The mechanism

The city keeps one count per age from 0 to 100+. Each year:

1. Residents aged 20–39 produce births (`birthRate` per resident and year).
2. Deaths follow two age bands: `deathRate` below 65 and `elderlyDeathRate` from 65.
3. Survivors age by one year; newborns join age zero.
4. Net migration enters at age 25 or leaves from the oldest cohorts. A scheduled immigration pulse adds a one-time group of 25-year-olds.
5. Residents are packed into anonymous households of at most `householdSize`.

Today’s age structure determines later births and deaths, counted as whole people. The model rounds the city-wide expected total down and carries the fraction to next year, then allocates deaths over cohorts by largest remainder. A cohort of five can therefore lose residents at 10 % mortality. This integer allocation is an original numerical design choice. The [scientific sources dossier](../../docs/scientific-sources.md) records the reference and adaptation limits.

```ts
import { model } from "./model.ts";

const city = model.create();
city.scheduleImmigrationPulse(100);
city.advance();
console.log(city.read().netMigration); // 110
city.setPolicy({ householdSize: 2 });
city.advance();
console.log(city.read().householdCount); // more households for a similar population
```

## What to try

- **Pulse or spread?** Press *Schedule pulse of 100 immigrants aged 25* once. In a second run, raise *Requested net migration* to 20 for ten years. Both add 100 extra residents, but the pulse moves through the age bars as one block. It raises births for about 15 years, then the birth wave ends when the group passes age 39.
- **Smaller households:** lower *Maximum household size* from 3 to 2. The resident count barely changes, but household demand jumps the next year.
- **An ageing city:** set migration to zero and watch the 65+ share and the death line.

## What you see

- **Age structure:** residents in 5-year bands. A pulse shows up as one tall band moving right.
- **Annual flows:** births, deaths and net migration per completed year as bars that start at zero, so a constant migration of 10 stays visible. The setup year has no flows, so the bars start at year 1.
- **Residents and household demand:** stocks including the setup value.
- **Households by size:** the anonymous packing result.

`accountingError` checks that population equals the initial residents plus all births, minus all deaths, plus net migration. Cohort, age-band and household totals must also match the population.

## Limits

Fertility counts all residents aged 20–39, without sex or partnership. Households have no identity, head or dwelling, and nothing connects them to the housing model. The 100+ cohort is open-ended.

See the [contract](contract.md) for exact rules and expected values, and the [evidence](evidence/checks.md) for executed checks and the revision history. The public scripts live in `tests/public-contracts/city-population/`.
