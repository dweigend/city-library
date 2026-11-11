# Water and Wastewater contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-water/` define setup, the daily volume balance through a dry spell, the conservation-rule experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

A two-month dry spell will empty the reservoir. Should the city ask for modest savings early or wait and ration hard later? Who bears the deficit, and how deep does it cut on the worst day?

Scientific connection: Draper and Lund (2004, *Optimal Hedging and Carryover Storage Value*) analyze the trade-off between releasing water now and keeping it for later demand ("hedging"). This model uses a fixed, transparent trigger rule with a known synthetic dry spell. The rule is an original teaching device, not an optimal hedging policy.

## Inputs and time

One step is one day; volumes are m³.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| reservoirCapacityM3 | 10000 | 1–1000000 | Storage capacity (setup) |
| initialStoredM3 | 8000 | 0–1000000 | Storage at setup, ≤ capacity |
| inflowM3PerDay | 220 | 0–1000000 | Inflow outside the dry spell (live) |
| dryInflowM3PerDay | 40 | 0–1000000 | Inflow during the dry spell (setup) |
| drySpellStartDay | 20 | integer 0–3650 | Days before the dry spell begins (setup) |
| drySpellDays | 60 | integer 0–3650 | Dry spell length (setup) |
| demandM3PerDay | 200 | 0–1000000 | Normal daily demand (setup) |
| conservationTrigger | 1 | 0–1 | Storage fraction below which savings apply (live) |
| conservationShare | 0 | 0–0.6 | Demand reduction while saving (live) |
| wastewaterShare | 0.8 | 0–1 | Share of supplied water returned as wastewater |
| treatmentCapacityM3PerDay | 120 | 0–1000000 | Daily treatment limit (live) |

With the defaults (share 0) nobody saves, as in revision 1.

## Daily ordering

1. Inflow is the dry value on days drySpellStartDay+1 … drySpellStartDay+drySpellDays, otherwise the normal value.
2. Savings apply today if conservationShare > 0 and beginning-of-day storage / capacity < conservationTrigger: request = demand × (1 − share), otherwise request = demand. `conservedM3` = demand − request. A saving day is a day on which this rule requested a cut; with share 0 the rule is off, so neither `conservationDayCount` nor `isSavingTomorrow` reports savings (correction after the revision-2 visual review, L-WAT1; requests and volumes are unchanged).
3. Inflow is added; spill = anything above capacity (spill happens before withdrawal).
4. Supply = min(request, stored); shortage = request − supply.
5. Wastewater = supply × wastewaterShare; treated = min(wastewater, treatment capacity); untreated is the rest; the remainder of supply is consumed. Treatment never returns to the reservoir.

Balance: initial + Σ inflow − storage − Σ spill − Σ consumed − Σ treated − Σ untreated = 0 (`balanceErrorM3`). Records also keep cumulative shortage, worst-day shortage, `worstDayCutShare` (max of (demand − supply) / demand) and counts of saving and shortage days. `isSavingTomorrow`, `isDrySpellTomorrow` and `wasDrySpellDay` (the last completed day) describe the rule state for presentation.

## Actions

`setConservationRule(changes)` (conservationTrigger, conservationShare), `setConservationShare(value)`, `setTreatmentCapacity(value)` and `setInflow(value)` validate before mutation; omitted keys keep values; undefined, unknown keys and wrong types TypeError; range errors RangeError.

## Exact assertions

- Setup: 8000 m³ stored, no flows. Day 1: supply 200, stored 8000 + 220 − 200 = 8020. Day 30: 6800 m³.
- No savings, 120 days: cumulative shortage 1200 m³ on 8 days, worst day 160 m³ (cut share 0.8), storage 800 m³. The default rule (trigger 1, share 0) counts 0 saving days and `isSavingTomorrow` is false.
- Early modest savings (trigger 0.6, share 0.15): no shortage, 84 saving days, 2520 m³ conserved, lowest storage 120 m³, 2120 m³ on day 120, worst cut share 0.15.
- Late emergency rationing (trigger 0.25, share 0.4): no shortage, 42 saving days, 3360 m³ conserved, lowest storage 640 m³, 2960 m³ on day 120, worst cut share 0.4.
- Balance error stays below 1e-6 m³.

## Reuse and provenance

Reuses World/run, measurements.define, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No hydraulics, water quality, forecast uncertainty or prices.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
