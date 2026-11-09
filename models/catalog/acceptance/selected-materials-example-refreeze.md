# Authorized correction and refreeze of example 04

The user explicitly approved changing only the incorrect frozen expectation from `numFrozen === 1` to `numFrozen === 0`, documenting the reason and refreezing the hash before further acceptance. This commit records that authorization and refreeze before the new complete five-script verification run. No runtime, API, setup parameter or other assertion changes are included.

The exact native source has seven colors, giving `temp-range = (1550 - 550) / 6`. A single exposed atom cools to390, whose color index is0. The source increments `num-frozen` only when the index is strictly negative; therefore the correct count is0. The original Chromium observation `[1,1,390,0,166.66666666666666,390,8.9]` and [native counter screenshot](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/crystallization-basic-original-counter-fixture.png) already establish this boundary. The implementation retains that source behavior.

Original example04 SHA-256 at freeze d4102d6: `eebac55fbd04bf8cf0395b1161175ab54dd907840feb96cc8f068f6342d8172d`.

Authorized replacement SHA-256: `9d4e26cdc6417c67235ec497432ab7e2e2dc36216ebcee951bce9c8ba05cc5a8`.

The other four example hashes are unchanged. The [original correction patch](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-example-correction.patch) remains a historical description of the now-applied change. The historical failing output is preserved in selected-materials-evidence/frozen-examples.log; the complete five-script rerun passed and is recorded separately in [refrozen-examples.log](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-materials-evidence/refrozen-examples.log). This correction does not clear the independent-review, canvas-capture or local dependency gates.
