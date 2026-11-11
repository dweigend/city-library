# Urban Material Cycles contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-materials/` define setup, the daily mass balance through a waste pulse, the recycling/collection/generation experiments, and validation/observations. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/). The revision-1 script 04 carried a documented getter `: number` annotation exception; it is preserved there and not carried forward.

## City question

After a festival week doubles the waste, does a higher recycling rate help the streets get clean again, or does the city need more collection capacity or less waste?

Scientific connection: Kennedy, Cuddihy and Engel-Yan (2007, *The Changing Metabolism of Cities*) describe urban metabolism as material flows together with stocks that accumulate in the city. This model keeps one stock (uncollected waste) and its flows: generation, finite collection, reuse, recycling and disposal.

## Inputs and time

One step is one day; masses in kg.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| wasteGeneration | 100 | 0–1000000 | Normal waste per day (live) |
| collectionCapacity | 120 | 0–1000000 | Collection per day (live) |
| reuseFraction | 0.1 | 0–1 | Share of collected waste reused (live) |
| recyclingFraction | 0.4 | 0–1 | Share of the rest recycled (live) |
| initialUncollected | 0 | 0–1000000 | Uncollected stock at setup |
| pulseExtraKg | 150 | 0–1000000 | Extra waste per pulse day (setup) |
| pulseStartDay | 10 | integer 0–3650 | Days before the pulse (setup) |
| pulseDays | 5 | integer 0–3650 | Pulse length (setup) |

## Daily ordering

Generated = wasteGeneration (+ pulseExtraKg on days pulseStartDay+1 … pulseStartDay+pulseDays). Available = uncollected + generated; collected = min(available, capacity); reused = collected × reuse; recycled = (collected − reused) × recycling; disposed = the rest; uncollected = available − collected. Recovered mass leaves the waste boundary. Balance: initial + Σ generated = uncollected + Σ (reused + recycled + disposed). The model records peak backlog, its day and the first day after the pulse with no backlog (`clearedDay`, null until then).

## Actions

`setPolicy(changes)` (wasteGeneration, collectionCapacity, reuseFraction, recyclingFraction) validates before mutation; omitted keys keep values; undefined, unknown keys and accessors TypeError; range errors RangeError.

## Exact assertions (60 days)

- Day 1: generated 100, collected 100, reused 10, recycled 36, disposed 54, no backlog.
- Default: backlog peaks at 650 kg on day 15 and is cleared on day 48; totals 6750 generated, 675 reused, 2430 recycled, 3645 disposed.
- Recycling 0.8: same backlog (650 kg, cleared day 48); recycled 4860, disposed 1215.
- Collection 160: peak 450 kg, cleared on day 23.
- Generation 80: peak 550 kg, cleared on day 29; 5550 generated.

## Reuse and provenance

Reuses World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No processing capacity, markets for recovered material, composition or transport.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
