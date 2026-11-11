# Urban Heat contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-heat/` define setup, the hourly surface energy budget over a synthetic day and night, the shade/water experiments, and validation/isolation. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

When does shade help and when does watered vegetation help, by day and at night, and how much water does cooling cost?

Scientific connection: Oke (1982, *The Energetic Basis of the Urban Heat Island*) explains urban heat through the surface energy balance and heat storage, including its daily course: materials that store heat by day release it at night. This model keeps an explicit per-block budget with heat capacity, shade and evapotranspiration. Surface temperature is not air temperature or thermal comfort.

## Blocks, inputs and time

One step is one hour starting at 00:00. Three 100 m² blocks: sealed (sealed fraction 1), mixed (0.5), planted (0).

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| airTemperatureC | 26 | −20–45 | Daily mean air temperature (setup) |
| initialTemperatureC | 22 | −20–60 | Surface temperature at setup |
| solarFluxWm2 | 800 | 0–1200 | Peak solar flux at noon (setup) |
| shadeFraction | 0 | 0–1 | Share of sunlight blocked (live) |
| waterAvailability | 0.5 | 0–1 | Share of maximum evapotranspiration (live) |

Drivers for the hour starting at h (evaluated at h + 0.5): air = airTemperatureC + 5 × sin(2π (h + 0.5 − 9) / 24); sun = solarFluxWm2 × sin(π (h + 0.5 − 6) / 12) for 06–17, else 0.

## Hourly budget (W/m²)

For a block with sealed fraction s:

- absorbed = sun × (0.6 + 0.2 s) × (1 − shade)
- evapotranspiration = 300 × (1 − s) × water × sun / solarFluxWm2 (zero at night or with zero peak sun)
- sensible exchange = 20 × (surface − air)
- net = absorbed − evapotranspiration − sensible; surface += net × 3600 / C with heat capacity C = 500 000 + 500 000 s J/m²K (explicit Euler; λ Δt / C ≤ 0.144).

Irrigation water = evapotranspiration energy / 2.45 MJ/kg (kg, area-weighted). Stored heat = Σ C × area × (surface − initial); the budget residual is stored heat minus cumulative net energy and is reported in joules. Displays normalize −0 to 0.

## Actions

`setPolicy(changes)` (shadeFraction, waterAvailability) validates before mutation; omitted keys keep values; undefined, unknown keys and accessors TypeError; range errors RangeError.

## Exact assertions (rounded to 0.01 °C)

- Setup: all blocks 22 °C, hour 0.
- Day 2, 15:00–16:00 (after 40 steps): sealed 41.33, mixed 39.74, planted 38.08 °C. Day 2, 03:00–04:00 (after 28 steps): 30.37, 28.52, 25.89 °C.
- Shade 0.4: 35.39 / 33.85 / 32.11 by day, 28.11 / 26.74 / 24.86 at night.
- Water 1.0: planted 33.41 by day and 25.08 at night; 1013.17 kg irrigation water over 48 h instead of 506.58.
- Water 0: planted 42.74 °C by day, hotter than sealed (41.33), but 26.70 at night, cooler than sealed (30.37).
- Budget residual below 1e-3 J relative to 1e9 J of stored heat.

## Reuse and provenance

Reuses Grid, continuous.linear, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No longwave radiation, wind, shading geometry, soil moisture dynamics or comfort indices.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
