# Urban Employment contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-economy/` define setup at a resting point, monthly accounting, the demand-shock and hiring-speed experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

When outside demand for a city's products drops for half a year, how far does local employment fall through the spending feedback, and how fast does it come back when hiring is slower than firing?

Scientific connection: Gualdi, Tarzia, Zamponi and Bouchaud (2015, *Tipping Points in Macroeconomic Agent-Based Models*) show that hiring/firing rules and demand feedback can create very different employment regimes. This model is a small city with one demand loop and asymmetric adjustment. It shows a multiplier decline and a delayed recovery; it does not claim a tipping point or reproduce their model.

## Inputs and time

One step is one month; amounts are synthetic currency units.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| householdCount | 30 | integer 1–100 | Households, one potential worker each (setup) |
| firmCount | 3 | integer 1–10 | Firms (setup) |
| wage | 10 | integer 1–100 | Monthly wage per worker |
| spendingFraction | 0.4 | 0–1, step 0.1 | Share of wages spent locally next month |
| externalDemand | 90 | integer 0–1000 | Monthly orders from outside the city (live) |
| hiringLimit | 1 | integer 1–100 | New hires per firm per month (live) |

Each job produces 10 units of sales per month. Setup employs households 1–15 in firms 1–3 (5 each, households assigned in order) and sets last month's local spending to employed × wage × spendingFraction.

## Monthly ordering

1. Orders D = externalDemand + last month's planned local spending.
2. Desired jobs = min(households, round(D / 10)), split evenly over firms; the remainder goes to the first firms.
3. Firms above their desired jobs dismiss their highest-numbered employees at once. Firms below hire the lowest-numbered unemployed households, at most hiringLimit each (firm order).
4. Sales S = min(D, 10 × employed). Unmet orders D − S are lost. Realized local spending and external inflow are their planned amounts × S / D.
5. Firms receive S in proportion to their output and pay wages; each employed household receives the wage and spends its planned amount × S / D. Next month's planned spending = payroll × spendingFraction.

`totalCash` changes only by the external inflow: total cash = initial cash + cumulative external inflow (`moneyBalanceError` reports the difference). Integer jobs with round() leave a resting band of ±0.5 / (1 − wage × spendingFraction / 10) jobs; with the default 0.4 this is under one job, so integer resting points are exact. Higher spending fractions can stop the adjustment early; this is a property of whole jobs, not of the economy.

## Actions

`setExternalDemand(value)` and `setHiringLimit(value)` validate through canonical descriptors before mutation; undefined and non-numbers TypeError, invalid values RangeError.

## Exact assertions

- Setup and default months: 15 employed, orders 150, sales 150, external inflow 90, no vacancies.
- External demand 30 from month 1 to 6, then 90: employment 9, 7, 6, 5, 5, 5 in months 1–6 (month 4 loses 4 orders to rounding); with hiringLimit 1 months 7–11 give 8, 11, 13, 14, 15 employed, with lost orders 30, 12, 4, 2, 0 (48 in total) and 3 vacancies in month 7.
- Same shock with hiringLimit 10: months 7–10 give 11, 13, 14, 15 employed and 6 lost orders in total.
- Money balance error stays 0.

## Reuse and provenance

Reuses Agent, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No prices, inventories, credit, bankruptcy, savings behavior or migration. Firms may run negative cash balances.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
