# Taxi model observation contracts

Four scripts check Taxi occupancy and income through the public experiment factory, without stored counters or state changes.

The contract exposes numeric `occupiedCabs` and `totalIncome` to `read()` and its existing `snapshot()` alias, using the same vacancy predicate and completed-income sum used by the Taxi UI. Cab state remains authoritative; these values are observations, not stored counters. No scientific equation, scheduling rule, random draw or clock behavior changes.

1. Reporter consistency: Setup and successful steps agree with detached cab records and the existing latest history sample.
2. Observation purity: repeated reads preserve domain state, World Tick and RNG continuation; earlier observations stay detached.
3. Intervention isolation: a fare-rule edit changes neither previously earned income nor occupancy, tick, RNG or an independent instance.
4. Replay/accounting: zero demand retains zero occupancy/income and fleet size; batched and split stepping preserve history/RNG, and miles retain the existing business/dead accounting identity.

Run the scripts with Bun from the repository root. `SHA256SUMS` protects the scripts; implementations must preserve their asserted expectations. See the [model authoring guide](../../../docs/development/model-authoring.md) for the model/UI boundary.
