# Population and Households contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-population/` define setup, integer mortality accounting, live policy with an immigration pulse, and validation/snapshot behavior. They use the public model definition without private imports or mocks. The revision-1 contract and scripts are archived byte-for-byte in [evidence/revision-1-contracts](evidence/revision-1-contracts/); [evidence](evidence/checks.md) explains which expectations changed and why.

## City question

How does a city's age structure turn today's migration into later births, deaths and household demand? Compare an immigration pulse of young adults with the same inflow spread over years, and compare population change with a change in household size.

Scientific connection: Leslie (1945) projects age-structured populations through age-specific survival and fertility. This model keeps that cohort logic with two mortality bands and one fertility window. The integer allocation rule below is our numerical design, not a Leslie result.

## Inputs and time

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| initialPopulation | 1000 | integer 0–1000000 | Residents at setup (setup only) |
| birthRate | 0.06 | 0–0.2 | Births per beginning-of-year resident aged 20–39 per year |
| deathRate | 0.005 | 0–1 | Annual mortality fraction for ages 0–64 |
| elderlyDeathRate | 0.1 | 0–1 | Annual mortality fraction for ages 65 and older |
| annualMigration | 10 | integer −1000–1000 | Requested net residents per year |
| migrationLimit | 20 | integer 0–1000 | Absolute bound on requested annual migration |
| householdSize | 3 | integer 1–6 | Maximum residents per anonymous household |

One step is one year; tick begins at zero. Setup distributes residents equally over ages 0–99, remainder residents from age zero upward; the open 100+ cohort starts empty. No randomness, timers, I/O or initialization at import.

## Annual ordering

1. **Births.** Expected births are (beginning-of-year residents aged 20–39) × birthRate plus the carried birth remainder. Births are the floor of that value; the fraction carries to next year.
2. **Deaths.** Each beginning-of-year cohort has expected deaths residentCount × rate, using deathRate below 65 and elderlyDeathRate from 65. Total deaths are the floor of the summed expectation plus the carried mortality remainder; the fraction carries forward. Each cohort first receives the floor of its expectation. The remaining deaths go one each to the cohorts with the largest fractional parts; ties go to the older cohort. No cohort loses more than its residents. A 1e-9 tolerance absorbs binary rounding of decimal rates before flooring.
3. Survivors age by one year; ages 99 and 100+ merge into 100+. Births enter age zero and face no mortality that year.
4. **Migration.** Requested migration is annualMigration clamped to ±migrationLimit, plus any scheduled immigration pulse. Immigrants enter at age 25. Emigrants leave oldest first, bounded by the available population. The pulse is consumed in that year.
5. Households are re-formed as anonymous groups up to householdSize plus one remainder group. Formed/dissolved counts are net annual changes in household count, not identities.
6. Tick advances and one sample is recorded; the latest 120 samples are retained.

The carried remainders make long-run deaths and births match their expected totals within one resident, and small cohorts can no longer stay immortal through per-cohort flooring. Remainders are explicit observations (`birthRemainder`, `mortalityRemainder`, each in [0, 1)).

## Actions

- `setPolicy(changes)` accepts birthRate, deathRate, elderlyDeathRate, annualMigration, migrationLimit and householdSize. Omitted keys keep their values. Unknown or setup-only keys and explicitly undefined values throw TypeError; range, finiteness and integer errors throw RangeError. Validation completes before assignment. Policies take effect next year.
- `scheduleImmigrationPulse(residentCount)` adds a one-time pulse of integer 1–1000 residents to next year's migration, outside migrationLimit. Pending pulses accumulate up to 10000. Undefined or non-numeric input throws TypeError, invalid values RangeError, without mutation.
- `advance(stepCount)` uses the shared step validation. A year that would exceed safe integer accounting throws before its commit.

Observations are detached and frozen. `accountingError` is P − (P₀ + cumulative births − cumulative deaths + cumulative net migration). `ageBands` reports 5-year bands 0–4 … 95–99 and 100+. `elderlyShare` is residents aged 65+ divided by population (0 when empty). All quantities are computed in model.ts.

## Exact assertions

Default setup: 1000 residents, 10 at each age 0–99, 334 households, 21 age bands with 50 residents in each band below 100, zero flows and remainders, elderly share 0.35.

Year one: 12 births, 38 deaths (35 elderly cohorts lose one; the three tied under-65 remainders go to ages 64, 63 and 62), +10 migration, 984 residents, mortality remainder 0.25, age 0 = 12, age 25 = 20, age 100+ = 9, 328 households. Year two: 12 births, 35 deaths, 971 residents, mortality remainder 0.95, birth remainder 0.6, age 100+ = 16. Year three: 13 births, 34 deaths, 960 residents.

Small cohorts: 100 residents (one per age 0–99) with no births or migration and both mortality rates 0.1 have 10 deaths in year one (ages 90–99), 9 in year two and 8 in year three; after 30 years 4 residents remain. Revision 1 floored each cohort separately and left all 100 residents alive.

Pulse versus spread: a 100-resident pulse scheduled before year one (with default migration 10) gives 110 immigrants in year one and 1084 residents; spreading 20 per year over ten years gives 994. Both have 200 cumulative immigrants after year ten. The pulse cohort raises births to 18 in year two and births stay above the spread case until the pulse cohort leaves the fertile window: years 2–9 pulse births 18, 19, 20, 21, 21, 21, 22, 23 versus 13, 14, 16, 17, 18, 19, 20, 22 for spread. In year 17 pulse births fall from 26 to 21.

Policy migration: 100 residents with no births/deaths; migration −100 bounded to −7 leaves 93 and empties ages 94–100+; household size 2 gives 47 households. Removing the bound empties the city next year; migration +11 bounded to +4 then creates four age-25 residents in two households.

## Reuse and provenance

Original synthetic teaching model with Leslie-style cohort logic; no third-party code or empirical calibration. Reuses World/run, storage.history, measurements.define, parseParameters/updateParameters/validateStepCount, defineUI and indexedColor. The largest-remainder allocation is ordinary local arithmetic. Households have no heads, kinship, dwellings or persistent membership; coupling to housing or other city models is outside this contract.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
