# Neighborhood Services contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-services/` define setup, the daily allocation, the layout/catchment experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/).

## City question

With the same total service capacity, does one central facility or two smaller distributed ones give more households access? Who is left out, and is it because the service is too far or because it is full?

Scientific connection: Luo and Wang (2003) measure spatial accessibility from both distance limits and competition for finite supply (the two-step floating catchment area method). This model uses the same two ingredients as an allocation rule: a travel limit and finite daily capacity. It does not compute the 2SFCA ratio.

## Space, inputs and time

One step is one day. Sixteen households sit at x ∈ {−3, −1, 1, 3} km and y ∈ {1.5, 0.5, −0.5, −1.5} km (household *i* at column i mod 4, row ⌊i/4⌋). Each household requests a school place, a clinic visit and a shop visit every day (48 requests).

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| capacityPerKind | 12 | integer 0–24 | Daily capacity per service kind, split over its facilities (live) |
| maxDistanceKm | 2.5 | 0–10 | Longest acceptable straight-line trip (live) |
| layout | central | central, distributed | Facility layout (live) |

`central`: one facility per kind at (0, 0) with the full capacity. `distributed`: per kind a west facility at (−2, 0) with ⌈capacity/2⌉ and an east facility at (2, 0) with ⌊capacity/2⌋. Live changes apply to the next day.

## Daily allocation

For each kind (school, clinic, shop): households are ordered by the distance to their nearest facility of that kind, ties by household index. Each takes the nearest facility within maxDistanceKm that still has capacity (a daily `Resource` claim). Status: `served`, `full` (a facility is within reach but all within reach are full) or `too-far` (none within reach). Claims are released at day end; nothing carries over.

Measures: served, full and too-far counts; households by number of services received (0–3); `underservedHouseholdCount` (fewer than 3); `unservedHouseholdCount` (0); mean and maximum served distance.

## Actions

`setPolicy(changes)` (capacityPerKind, maxDistanceKm, layout) and `setMaxDistanceKm(value)` validate before mutation; omitted keys keep values; undefined, unknown keys and wrong types TypeError; range errors RangeError.

## Exact assertions

Distances: 1.118034 (inner rows to nearest facility), 1.802776, 3.041381, 3.354102 km.

- Day 0 has no allocation. Central, capacity 12, 2.5 km: 24 served, 0 full, 24 too far; 8 households unserved (the x = ±3 columns); mean served distance 1.460405 km.
- Distributed, same capacity: 36 served, 12 full, 0 too far; 4 households (row y = −1.5) unserved; mean 1.346281 km.
- Central with 3.5 km: 36 served, 12 full; the four corner households unserved; mean 1.987397 km.
- Distributed with capacity 16: all 48 requests served.
- capacityPerKind 0: every request in reach is `full`.

## Reuse and provenance

Reuses Resource for daily capacity claims, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. Straight-line distances, identical daily demand and fixed positions are teaching assumptions.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
