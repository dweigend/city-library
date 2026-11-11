# Air and Noise Exposure contract

Revision 2, decided on 2026-11-10 before the runtime change. The four scripts in `tests/public-contracts/city-air-noise/` define setup, the corridor mass balance and sound levels, the traffic/ventilation/distance experiments, and validation/snapshots. Revision-1 files are archived in [evidence/revision-1-contracts](evidence/revision-1-contracts/); revision 1 recorded no pre-implementation SHA-256 hashes for these scripts, and none are reconstructed.

## City question

Should a street cut traffic or improve ventilation? How do air pollution and noise respond differently, and can a cleaner average hide a local hotspot?

Scientific connection: Berkowicz (2000, OSPM) models street pollution from emissions, transport and exchange, with receptor location mattering; CNOSSOS-EU (Kephalopoulos, Paviotti and Anfosso-Lédée, 2012) is the EU common method for noise, in which sound sources combine in energy rather than by adding decibels. This model keeps a small mass-transport corridor and energetic sound addition. It does not implement or comply with OSPM or CNOSSOS-EU.

## Corridor, inputs and time

One step is one minute. Eight well-mixed air boxes of 1000 m³, each 100 m long, run downwind from x = 0 to 800 m; receptor *i* sits at the box center x = 50 + 100 i. A busy street segment emits in boxes 1 and 2.

| Input | Default | Bounds | Meaning |
| --- | --- | --- | --- |
| trafficVehiclesPerHour | 600 | 0–6000 | Vehicles per hour on each street box (live) |
| transportFraction | 0.5 | 0–1 | Share of each box moved one box downwind per minute (ventilation, live) |
| decayFraction | 0.25 | 0–1 | Share removed per minute after transport (setup) |
| receptorDistanceM | 10 | 5–100 | Receptor distance from the street axis for noise (live) |

## Minute ordering

1. Each street box gains traffic / 60 × 1000 µg.
2. Transport: box i keeps (1 − a) of its mass and receives a of box i − 1; a of the last box leaves the corridor (`exitedMassMicrograms`).
3. Decay removes the decay fraction from every box.
4. Exposures accumulate: concentration × 1 minute, and sound intensity × 60 s.

Sound at a receptor: L = 10 log10(10^(40/10) + Σ_sources (traffic / 60) × 10^(60/10) × 10² / r²) dB, with r the straight-line distance from each street-box center at the receptor distance. Receptors are inside their well-mixed box, so receptor distance changes noise but not air concentration. Mass balance: emitted = retained + decayed + exited.

## Actions

`setTraffic(value)` and `setPolicy(changes)` (trafficVehiclesPerHour, transportFraction, receptorDistanceM) validate before mutation; omitted keys keep values; undefined, unknown keys and wrong types TypeError; range errors RangeError.

## Exact assertions (after 60 minutes, rounded)

- Default: concentrations 0, 6, 15.6, 15.36, 9.216, 5.5296, 3.3178, 1.9907 µg/m³; mean 7.1268; hotspot receptor 2; noise 51.269 dB upwind, 70.047 dB at the street receptors, 42.247 dB at the far end.
- Traffic 300: every concentration halves (mean 3.5634); street noise falls to 67.041 dB (−3.0 dB).
- Ventilation 0.8: 0, 1.7647, 10.0692, 14.1665, 9.9999, 7.0587, 4.9826, 3.5172; mean 6.4449; hotspot moves to receptor 3; the far end gets worse; noise unchanged.
- Receptor distance 40 m: street noise 58.581 dB; air unchanged.
- Mass balance error below 1e-6 of emitted mass.

## Reuse and provenance

Reuses Grid, World/run, storage.history, parseParameters/updateParameters/validateStepCount and defineUI. No chemistry, meteorology, building geometry, A-weighting, ground effect or health thresholds.

Current verification and acceptance status is tracked centrally in [city simulation models](../../docs/development/city-simulation-models.md#current-revision-status).
