# Taxi model observation contracts

These four public model-consumer scripts precede the additive Taxi observation implementation. They import the repository's public experiment factory; no new headless package export or model action is proposed.

`read()` and its existing `snapshot()` alias will add numeric `occupiedCabs` and `totalIncome`, using the same vacancy predicate and completed-income sum currently repeated in the Taxi UI. Cab state remains authoritative; these values are observations, not stored counters. No scientific equation, scheduling rule, random draw or clock behavior changes.

1. Reporter consistency: Setup and successful steps agree with detached cab records and the existing latest history sample.
2. Observation purity: repeated reads preserve domain state, World Tick and RNG continuation; earlier observations stay detached.
3. Intervention isolation: a fare-rule edit changes neither previously earned income nor occupancy, tick, RNG or an independent instance.
4. Replay/accounting: zero demand retains zero occupancy/income and fleet size; batched and split stepping preserve history/RNG, and miles retain the existing business/dead accounting identity.

Initial execution before implementation: all four scripts fail because the new observations are absent (undefined instead of numeric or expected aggregate values). `SHA256SUMS` freezes the scripts; accepted expectations must not be weakened to fit the implementation. Existing phase scripts and their manifests remain unchanged.
