# Urban Stormwater contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-stormwater/` define setup, the hourly water balance of one storm, the storm-spacing/infiltration/retention experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

Does better infiltration or a bigger retention basin prevent overflow, and does the answer change when a second storm arrives before the basin and soil have recovered?

Scientific connection: the US EPA Storm Water Management Model (SWMM 5.2 manuals) describes runoff from pervious and impervious surfaces, infiltration that declines as soil fills, and storage units with outlets. This model uses those concepts in a two-plot, one-basin teaching form; no SWMM equations or code are ported.

## Catchment, inputs and time

One step is one hour; volumes in m³, depths in mm (1 mm on 1 m² = 0.001 m³). Two plots of 2000 m²: `plot:sealed` (80 % impervious) and `plot:green` (20 % impervious). Each plot's pervious part has a soil store of 20 mm that drains 1 mm/h to deep groundwater (percolation leaves the system).

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| rainMmPerHour | 10 | 0–100 | Rain intensity during a storm hour (live) |
| infiltrationMmPerHour | 6 | 0–100 | Infiltration capacity of dry pervious soil (live) |
| retentionCapacityM3 | 60 | 0–1000 | Basin volume (setup) |
| outletM3PerHour | 4 | 0–100 | Throttled basin outlet (setup) |
| stormPattern | single | single, double | Storm hours 0–2, or 0–2 and 8–10 (live) |

## Hourly ordering

1. Rain falls on both plots if the hour is a storm hour.
2. On pervious ground, infiltration = min(rain, infiltration × (1 − soil / 20 mm), 20 mm − soil). The soil then loses min(1 mm, soil) to percolation.
3. Runoff = all rain on impervious ground + rain not infiltrated on pervious ground; it flows to the basin.
4. The outlet releases min(outlet, basin + runoff); anything beyond the basin volume overflows.

Balance: total rain = soil storage + percolated + basin storage + discharged + overflow (`balanceErrorM3`). Interval flows (rain, runoff, outlet, overflow in m³ per hour) belong to the hour just completed.

## Actions

`setRain`, `setInfiltration` and `setStormPattern` validate before mutation; undefined or wrong types TypeError, range errors and unknown patterns RangeError.

## Exact assertions (24 hours)

- Setup: empty basin and soils, catchment 4000 m², impervious 2000 m².
- Hour 1: 40 m³ rain, 28 m³ runoff (20 impervious + 8 not infiltrated), outlet 4, stored 24.
- Single storm: overflow 20.1 m³ (all in hour 3), runoff 92.1, percolated 27.9; basin empty at hour 24.
- Double storm: overflow 88.0183 m³, 8 m³ still stored at hour 24.
- Infiltration 12 mm/h: single 8.32 m³ overflow, double 78.1645 m³.
- Basin 90 m³: single 0 overflow, double 58.0183 m³.
- Balance error below 1e-9 m³.

## Reuse and provenance

Reuses Grid for the two plots, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No routing time, evaporation, surface ponding, pollutant load or real rain series.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
