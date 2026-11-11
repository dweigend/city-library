# Municipal Finance contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-finance/` define setup, annual accounting and asset wear, the deferral and repair-priority experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/), including the revision-1 `frozen-contracts.sha256` record.

## City question

With the same maintenance budget, does it matter which roads a city repairs first? And what does it cost to skip maintenance for a few years?

Scientific connection: Madanat and Ben-Akiva (1994, *Optimal Inspection and Repair Policies for Infrastructure Facilities*) show that the timing of inspection and repair, given deterioration, decides lifetime cost. This model has visible, deterministic condition and one explicit cost rule; it does not model latent condition, inspection or optimal policies.

## Assets, inputs and time

One step is one year; amounts in currency units (CU). Twelve assets share the replacement value equally. Asset *i* starts at condition 1 − 0.05 i (1.00 … 0.45) and loses annualWear × (0.7, 0.9, 1.1, 1.3)[i mod 4] per year.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| initialCash | 100 | 0–1e9 | Cash at setup |
| taxBase | 10000 | 0–1e9 | Taxable base per year |
| taxRate | 0.1 | 0–1 | Tax rate (live) |
| serviceCost | 400 | 0–1e9 | Mandatory services per year |
| maintenanceBudget | 500 | 0–1e9 | Maintenance allowance per year (live) |
| replacementValue | 12000 | 1–1e9 | Value of all twelve assets |
| annualWear | 0.05 | 0–0.2 | Mean condition loss per year |
| repairPriority | worst-first | worst-first, preventive | Repair order (live) |

Revision 1's `initialBacklog` input is removed: the backlog is now derived from asset conditions.

## Annual ordering

1. Cash += taxBase × taxRate − serviceCost (services may borrow).
2. Every asset loses its wear (not below 0).
3. Maintenance spending = min(budget, max(0, cash)), allocated in priority order. `worst-first`: ascending condition. `preventive`: assets at or above 0.4 in ascending condition, then those below 0.4. Each asset is repaired toward 1 as far as money allows.
4. **Cost rule:** one condition point costs the asset's value, doubled if the asset is below 0.4 when repair starts (late repairs are more expensive).

Backlog = Σ cost to restore each asset to 1 under the cost rule. Cash change = revenue − services − maintenance (`cashBalanceError` checks this). Wear is reported in condition points and in CU at the normal rate.

## Actions

`setPolicy(changes)` (taxRate, maintenanceBudget, repairPriority) validates before mutation; omitted keys keep values; undefined, unknown keys and accessors TypeError; range errors and unknown priorities RangeError.

## Exact assertions

- Setup: mean condition 0.725, backlog 3300 CU, no asset below 0.4.
- Worst-first: year 1 backlog 3650, mean 0.6958; year 10 backlog 9200, mean 0.4542, 4 assets poor; year 30 mean 0.0629, all 12 poor, 15000 spent.
- Preventive: year 10 backlog 5100, mean 0.6583, 1 poor; year 30 mean 0.6625, 3 poor, backlog 7050, 15000 spent.
- Budget 0 for years 1–5, then 500, preventive: year 5 backlog 9300 and 4 poor with 3100 cash; year 30 mean 0.5129 and 6 poor.

## Reuse and provenance

Reuses World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No interest, credit limits, inspection, uncertainty or failures.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
