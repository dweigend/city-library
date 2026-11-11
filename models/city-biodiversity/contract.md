# Urban Habitat Connectivity contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-biodiversity/` define setup, the occupancy recurrence, the restoration/bridge/permeability experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

A species lives in the west of a city and could spread east. With one extra hectare of habitat, is it better to add a stepping stone or to enlarge an eastern patch? How much does the land between patches matter?

Scientific connection: Hanski (1998, *Metapopulation Dynamics*) explains patch occupancy through colonization that depends on connectivity to occupied patches and extinction that falls with patch area. This model uses an incidence-style deterministic recurrence of *expected* occupancy (a probability per patch); it does not simulate discrete extinction events or fit parameters.

## Patches, inputs and time

One step is one year. Patches (x, y in km; area in ha): west-core (−3, 0; 8), west-north (−3.5, 1.1; 1.5), west-south (−2.4, −1; 1.5), bridge (−0.5, 0.1; 1), east-a (2, 0.6; 1.5), east-b (2.5, −0.7; 1.2), east-c (3.2, 0.4; 1). The restoration plan `stepping-stone` adds a 1 ha patch at (0.8, 0.35); `enlarge-east` adds 1 ha to east-a.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| initialOccupancy | 1 | 0–1 | Expected occupancy of the three west patches at setup (others 0) |
| vegetationQuality | 0.5 | 0–1 | Habitat quality in every patch (live) |
| dispersalRate | 1 | 0–3 | Colonization scale c |
| extinctionRate | 0.25 | 0–1 | Extinction scale e |
| permeability | 1 | 0–1 | Ease of crossing the city between patches (live) |
| restorationPlan | none | none, stepping-stone, enlarge-east | Where one extra hectare of habitat goes (live) |

## Annual recurrence (synchronous, `twoPhase`)

For each habitat patch i: connectivity S_i = Σ_{j ≠ i, habitat} exp(−d_ij / permeability) × p_j × A_j (S = 0 when permeability is 0); colonization C_i = quality × (1 − exp(−c S_i)); extinction E_i = min(1, e × 2 (1 − quality) / √A_i); p_i ← clamp(p_i + C_i (1 − p_i) − E_i p_i, 0, 1). Removed patches have p = 0 and take no part. Measures: mean occupancy over habitat patches, east mean (east-a, east-b, east-c), expected occupied area Σ p A, and per-patch gains/losses.

## Actions

`setVegetationQuality(value)`, `setPermeability(value)`, `setRestorationPlan(plan)` (`none`, `stepping-stone`, `enlarge-east`; a new stepping stone starts empty) and `setPatchHabitat(id, isHabitat)` (removing sets p = 0; restoring starts empty) validate before mutation: undefined and wrong types TypeError, invalid values, plans and IDs RangeError.

## Exact assertions (rounded to 4 decimals)

- Setup: west patches 1, others 0; mean 0.4286 (3 of 7).
- Default: year 1 mean 0.4093 and east 0.0226; year 10 mean 0.4864, east 0.2704; year 50 mean 0.5278, east 0.3678.
- Stepping stone from setup: east 0.3734 at year 10, 0.4404 at year 50. Enlarged east-a: 0.3559 at year 10, 0.4674 at year 50. The stone spreads faster; the larger patch persists better.
- Bridge removed from setup: east 0.2086 at year 10, 0.333 at year 50.
- Permeability 0.5: east 0.0011 at year 10; mean 0.1656 at year 50.
- Quality 0.7: mean 0.7618 at year 50.

## Reuse and provenance

Reuses twoPhase, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Revision 1 used Graph for a three-patch chain; the all-pairs distance kernel no longer needs graph edges, so Graph is not used. No species traits, demography, stochastic extinction or real habitat maps.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
