# Land Use Change contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-land-use/` define setup, the neighborhood conversion rule, growth-pattern and protection-plan experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

With the same demand for built land, does compact or dispersed growth leave a usable green network? Does protecting a connected corridor keep more of it than protecting the same area in scattered parcels?

Scientific connection: Batty and Xie (1994, *From Cells to Cities*) show how local cell rules can produce aggregate urban form. This model is not a cellular automaton reproduction: aggregate demand still sets how much land changes. Only the choice of *which* parcel converts uses a local neighborhood score, which is our original teaching extension.

## Inputs, space and time

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| residentialDemand | 24 | integer 0–48 | Residential target area (ha, live) |
| commercialDemand | 6 | integer 0–48 | Commercial target area (ha, live) |
| conversionLimit | 2 | integer 0–12 | Parcel conversions per year (setup) |
| growthPattern | compact | compact, dispersed | Parcel selection rule (live) |

Combined demand must not exceed 48 ha. The city is an 8 × 6 grid of 1 ha parcels (`parcel:0` … `parcel:47`, column fastest, row 0 at the south edge). Setup: residential at columns 2–3, rows 2–3; commercial at column 4, rows 2–3; all other parcels green and unprotected. One step is one year.

## Annual conversion rule

Repeat up to conversionLimit times:

1. Destination is the use with the largest positive deficit against its target (green's target is the remaining area); ties follow residential, commercial, green.
2. Candidates are unprotected parcels whose current use is above its target.
3. Score = number of face neighbors (north, east, south, west) already in the destination use.
   - `compact` picks the highest score, then the smallest distance from the grid center, then the lowest index.
   - `dispersed` picks the lowest score, then the largest distance from the grid center, then the lowest index.
4. The chosen parcel converts and is marked as changed this year.

Measures: area by use, protected area, unmet demand, `largestGreenPatchHa` (largest face-connected green group), `greenPatchCount`, `urbanEdgeKm` (face boundaries between green and developed parcels × 0.1 km), `convertedParcelCount`.

## Actions

- `setDemand(changes)`: residentialDemand and/or commercialDemand. Omitted keys keep their values. Undefined, unknown keys and accessors throw TypeError; range errors and combined demand above 48 throw RangeError; nothing changes on failure.
- `setGrowthPattern(pattern)`: `compact` or `dispersed`; undefined/non-text TypeError, unknown choice RangeError.
- `applyProtectionPlan(plan)`: `none` clears protection; `corridor` protects column 1 (6 ha, connected north–south); `scattered` protects six separated parcels at (0,0), (7,0), (0,5), (7,5), (6,3), (1,3). The plan replaces earlier protection. Unknown plans throw RangeError, non-text TypeError.
- `setProtection(id, isProtected)` toggles one parcel; unknown IDs RangeError, wrong types TypeError.

## Exact assertions

- Setup: 4 ha residential, 2 ha commercial, 42 ha green, one green patch of 42 ha, urban edge 1.0 km.
- Year 1 compact: 2 conversions to residential, urban edge 1.2 km. Year 1 dispersed: edge 1.4 km.
- Year 16, compact: 24/6/18 ha, largest green patch 10 ha in 2 patches, edge 1.8 km, no unmet demand.
- Year 16, dispersed: largest green patch 4 ha in 10 patches, edge 4.9 km.
- Dispersed with corridor protection: largest green patch 11 ha in 7 patches, all corridor parcels green. Dispersed with scattered protection (same 6 ha): largest 4 ha in 12 patches.

## Reuse and provenance

Reuses Grid (face neighbors), World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Parcels are schematic; equal areas and the score are teaching assumptions, not planning law or land markets.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
