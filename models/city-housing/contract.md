# Housing Market contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-housing/` define setup allocation, monthly rent adjustment, the allowance and supply experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

Who gets housed when a city subsidizes low-income tenants, and who when it adds homes? What happens when the subsidy is withdrawn?

Scientific connection: Rosenthal (2014, AER) studies how private housing changes occupants and becomes affordable to lower-income households over time ("filtering"). This model does not age dwellings or represent quality. It keeps only a transparent posted-rent market with income-ranked bids, vacancy-driven rent adjustment and delayed construction. Price-led access for lower incomes after added supply is an outcome of these rules, not a replication of Rosenthal's estimates.

## Inputs and time

One step is one month. Amounts are synthetic currency units per month.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| householdCount | 24 | integer 1–60 | Households, setup only |
| initialHomeCount | 18 | integer 1–60 | Homes at setup |
| maxHomeCount | 30 | integer 1–80 | Upper bound for homes plus pipeline; must be ≥ initialHomeCount |
| initialRent | 900 | 100–5000 | Posted rent at setup |
| housingAllowance | 0 | 0–5000 | Monthly allowance added to each low-income bid (live) |
| rentAdjustmentRate | 0.1 | 0–1 | Rent multiplier sensitivity to the vacancy gap |
| targetVacancyRate | 0.05 | 0–1 | Vacancy at which rent stays unchanged |
| constructionRent | 1000 | 100–5000 | Rent at or above which the market starts construction |
| constructionLimit | 1 | integer 0–10 | Market starts per month |

Household *i* (1-based) has income 1000 + 200 × (i − 1). The lowest third by index is `low`, the middle third `middle`, the top third `high` (index × 3 / householdCount, floored). A bid is 0.3 × income, plus the allowance for `low` households only.

## Monthly ordering

1. Pipeline entries count down by one month; entries reaching zero become vacant homes.
2. Rent ← clamp(rent × (1 + rentAdjustmentRate × (targetVacancyRate − vacancy)), 100, 5000), where vacancy uses homes and occupants at this point.
3. Each housed household whose bid is below the new rent leaves its home (displacement).
4. Searching households with bid ≥ rent take vacant homes in descending bid order, ties by household number, homes in ascending number. Setup performs this allocation once.
5. If rent ≥ constructionRent, the market starts up to constructionLimit homes, bounded by maxHomeCount minus homes and pipeline.

Construction takes three months: an entry starts with three remaining months. Homes commissioned before a step complete at the start of the third following step. `commissionHomes(count)` adds publicly funded homes to the pipeline (integer 1–10, bounded by maxHomeCount). Status is `housed`, `searching` (never housed) or `displaced` (lost a home and is searching).

## Actions and failures

`setHousingAllowance(value)` validates through the canonical descriptor; undefined and non-numbers throw TypeError, range errors RangeError, without mutation. `commissionHomes(count)` throws TypeError for undefined/non-numbers and RangeError for invalid counts or capacity. Unknown setup keys throw TypeError; maxHomeCount below initialHomeCount throws RangeError. Observations are detached and frozen.

## Exact assertions

- Setup: rent 900, households 11–24 housed (14), homes 1–14 occupied in descending bid order, 4 vacant, no low-income household housed.
- Month 1 baseline: rent 884.5, no change in occupancy. Month 12: rent 768.644912, 16 housed. Month 24: rent 718.125925, 17 housed including 1 low-income household.
- Allowance 400 from month 1 to 36: month 1 houses 18 (4 low-income); rent rises; by month 6 one middle-income household is displaced (rent 901.821827). Month 24 rent 902.799683 versus 718.125925 without the allowance. Withdrawing it before month 37 displaces 4 low-income households that month.
- Six homes commissioned before month 1: 18 homes in month 2, 24 in month 3. Month 24: rent 529.307668, 20 housed including 4 low-income households, no displacement.

## Reuse and provenance

Original synthetic mechanism. Reuses World/run, measurements.define, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No dwelling quality, ageing, location, credit, landlord behavior or empirical rent dynamics are modeled. Coupling with population or land use is outside this contract.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
