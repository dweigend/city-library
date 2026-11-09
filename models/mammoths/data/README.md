# Mammoths terrain data

Mammoths uses a fixed 97×97 terrain mask derived from the original model's embedded `americas.png`. The world has coordinates 0…96 on both axes, no wrapping and no image or resize controls. The TypeScript model reads the literal rows in `terrain.json` through the public Grid API, translating centered coordinates by 48. This data does not provide a general image-import capability; custom images and resizing remain unsupported.

## Source and rights

The [original source](../source.nlogox) has SHA-256 `8473b9d79835f81c88cd266049789fb83db4dd218c3402730d8526d3df6f824c`, matching the loaded NetLogo source. Its embedded PNG is retained byte-for-byte as `americas.png`: 13,754 bytes, SHA-256 `9d550543fb1da42a03624ffbf1f2358b726f60fc146963939de7e12555711293`.

The source Info contains a CC BY-NC-SA 3.0 notice for the model. It supplies no separate PNG author, map credit or resource-specific license in its Info, Procedures or resource element. This does not establish a separate dataset license. Model attribution and resource provenance remain distinct; see the [model notice](../NOTICE.md) and original Info.

## Data layout

Rows run south to north (y ascending 0…96), and columns west to east (x ascending 0…96). `1` means native non-blue terrain, which setup colors green 55; `0` means ocean. The 9,409 fields contain 2,505 land fields. The concatenated ASCII bits have SHA-256 `939f62e8e2ba22565d2515ffa35dbd73338eeaf0cc98ec70fcdf8c75919f9fd6`.

The [source comparison record](../evidence/selected-evolution-evidence/mammoths-full-native-colors.json) retains complete import and setup color arrays. Ocean shades depend on the source RNG; they do not change the land mask. These arrays support mask verification, not a claim of identical trajectories across random generators.

## Verify or refresh the source data

Run `bun experiments/mammoths/data/verify.mjs` to verify the input hashes and every mask bit against both full native readbacks.

For a fresh source comparison, load the pinned original in T3 Chromium and evaluate `native-capture.js` in its same-origin iframe. The script calls compiled native NetLogo procedures and reorders native north-first fields into the south-first layout above; it does not implement a second decoder, resampler or palette. Retain the result and compare its digests and mismatch counts. A Node-only reimplementation cannot substitute for native source evidence. Model controls and rendered behavior require their own acceptance checks.
