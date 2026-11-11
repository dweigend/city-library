# Air and Noise Exposure

A busy street pollutes the air and makes noise, but the two behave differently. Cutting traffic, ventilating the street and moving homes away from the road each help one more than the other. This model makes that visible along an 800 m corridor. One step is one minute; emissions and sound levels are synthetic.

## The mechanism

Eight well-mixed air boxes line up downwind. Traffic on the street boxes (100–300 m) emits pollutant every minute. Each minute the wind moves a share of every box's air one box downwind (**ventilation**), and a fixed share decays. One receptor sits in each box, at a chosen distance from the street axis.

Sound works differently: each street box acts as a point source whose energy falls with the square of distance. Sources and background add as energies, so twice the traffic gives +3 dB, not twice the decibels.

The pollution rules simplify transport and exchange; the noise rules add sound energies with simplified distance attenuation. The model does not implement OSPM or CNOSSOS. The [scientific source dossier](../../docs/scientific-sources.md) records those comparisons and limits.

```ts
import { model } from "./model.ts";

const street = model.create();
street.setTraffic(300);
street.advance(60);
console.log(street.read().meanConcentrationMicrogramsPerCubicMeter.toFixed(2)); // half of 7.13
console.log(street.read().receptors[1]!.noiseDecibels.toFixed(1));              // 67.0, only 3 dB less
```

## What to try

- **Halve traffic:** every concentration halves, but noise at the street drops only 3 dB, from 70.0 to 67.0.
- **Ventilate:** raise ventilation from 0.5 to 0.8. The hotspot at the street falls from 15.6 to 14.2 µg/m³ and moves 100 m downwind; the corridor mean improves, yet the far end gets almost twice as much pollution. Noise does not change.
- **Move receptors back:** set the receptor distance to 40 m. Street noise drops by more than 11 dB; air does not change because each box is well mixed.

## What you see

- **Street corridor:** boxes shaded by concentration on a fixed scale with a thin gray outline (so clean air stays visible), the street with vehicles, the wind arrow (longer means more ventilation) and receptors whose size grows with loudness.
- **Air** and **noise along the corridor**, the **corridor mean versus hotspot and far end** over time, and a **receptor exposure** table.

## Limits

No chemistry, weather, buildings, A-weighting or ground effects, and no link to health outcomes. The upwind box is always clean because nothing blows in.

See the [contract](contract.md) for exact rules and expected values and the [evidence](evidence/checks.md) for executed checks and revision history. Public scripts and focused tests: `tests/public-contracts/city-air-noise/`.
