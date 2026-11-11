# Urban Energy Supply contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-energy/` define setup, the hourly dispatch balance, the solar/battery/flexibility experiments, and validation/isolation. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

A neighborhood runs short of electricity every evening. Does more solar help, or a bigger battery, or moving flexible demand into the sunny hours?

Scientific connection: Denholm and Margolis (2016, NREL/TP-6A20-66595) show that the value of storage at high solar shares depends on the timing of solar output and on other flexibility. This model has one synthetic day profile, one battery and one import limit; it transfers no California capacity numbers.

## Inputs, profiles and time

One step is one hour; power in kW over one hour equals energy in kWh.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| solarCapacityKw | 12 | 0–1000 | Peak solar output (setup) |
| windOutputKw | 2 | 0–1000 | Constant wind output (setup) |
| batteryCapacityKwh | 8 | 0–1000 | Storage capacity (setup) |
| initialBatteryKwh | 4 | 0–1000 | Stored energy at setup, ≤ capacity |
| batteryPowerKw | 4 | 0–1000 | Charge/discharge limit per hour (setup) |
| electricityNetworkCapacityKw | 5 | 0–1000 | Import limit (live) |
| heatNetworkCapacityKw | 3 | 0–1000 | District heat supply limit (live) |
| demandScale | 1 | 0–10 | Multiplies both demand profiles (setup) |
| flexibleShare | 0 | 0–0.5 | Share of evening demand moved to midday (live) |

Solar in hour h (06–17) = solarCapacityKw × sin(π (h + 0.5 − 6) / 12); zero otherwise. Electricity demand (kWh, hours 0–23): 5 (00–05), 7 (06–08), 6 (09–16), 12 (17–20), 7 (21–23), times demandScale. With flexibleShare f, each evening hour 17, 18, 19, 20 gives f of its demand to hour 11, 12, 13, 14 respectively; the daily total is unchanged. Heat demand: 2 kWh in hours 06–17 and 4 otherwise, times demandScale.

## Hourly dispatch

Renewables first serve demand. A deficit is covered by battery discharge (≤ stored, ≤ batteryPowerKw), then import (≤ network capacity); the rest is unmet. A surplus charges the battery (≤ free capacity, ≤ power); the rest is curtailed. Heat is served by the heat network up to its capacity; the rest is unmet. No grid charging, export or losses. Balances: renewable + discharge + import + unmet − demand − charge − curtailed = 0; heat network + heat unmet − heat demand = 0. Daily totals reset at the start of each day; `lastDay` keeps the previous completed day.

## Actions

`setNetworkCapacity(changes)` (electricity and/or heat) and `setFlexibleShare(value)` validate before mutation: omitted keys keep values; undefined, unknown keys and wrong types TypeError; range errors RangeError.

## Exact assertions

- Setup: battery 4 kWh, no flows. Hour 1 (00:00–01:00): demand 5, wind 2, battery discharge 3, stored 1, no import or unmet.
- Second day with defaults: 11 kWh unmet, 39.2107 kWh curtailed, 56.2752 kWh imported (rounded to 4 decimals).
- solarCapacityKw 24: unmet still 11 kWh, curtailed 127.6059 kWh.
- batteryCapacityKwh 16: unmet 3 kWh. flexibleShare 0.25: unmet 4 kWh. flexibleShare 0.5: unmet 0.
- Battery stays within [0, capacity]; both balances stay within 1e-9.

## Reuse and provenance

Reuses World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Profiles, capacities and the dispatch order are teaching assumptions, not a power-flow or market model.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
