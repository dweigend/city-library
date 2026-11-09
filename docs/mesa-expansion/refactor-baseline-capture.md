# Pre-edit model/UI observation baseline

Captured from `feat/mesa-mechanisms` at `215b13f0d75de67f1d15774035d98e7bc8359956` in `/home/david/.t3/worktrees/city-library/t3-4fc992c0`. No repository files were changed by the capture agent. The two review reports were untracked throughout capture; model/UI source remained unchanged.

## Repeat after refactoring

```sh
bun /tmp/mesa-feedback-refactor-baseline/capture.ts compare
```

The command starts a fresh Bun process for each of 32 cases, recreates the same two independent instances in the same order, writes `replay/*.json`, and compares against `raw/*.json`. It excludes only the recorded source hashes, which should change after refactoring. All observation fields, opaque IDs, exported projection outputs, action/error classes, counts and order otherwise compare exactly. A mismatch reports its first JSON path plus before/after values in `compare-summary.json`, and exits 1. JSON object key ordering alone is not treated as a domain change.

Do not run `capture.ts capture` after editing: that command deliberately replaces the pre-edit raw baseline. `capture-summary.json` contains model/UI SHA-256 source hashes for all ten pairs. The runner does not import historical source or private implementation paths.

## Cases and evidence

- All ten models: one default trajectory and one action trajectory each.
- Four seeded models (battery, tree watering, recycling, zoning): additional action trajectories with seeds 0, 17, and the accepted high boundary 4294967293. The common boundary is accepted by every seeded model, including zoning's consecutive replication seeds.
- Two instances per case: repeated reads/projections only on the first instance, identical explicit steps/actions on both.
- Requested intervals 0, 1, 3, 10, 30, 130. Finite models retain their actual terminal tick rather than fabricating further progression. Bounded History eviction therefore participates in long-lived model comparisons.
- Live controls: shade cooling 0→1.3→0; shifted demand 0→1→0; slots 4→5→4 plus explicit releases; rain 0→50→0; daily watering 0→100→0; influence 0→1→0→1, with the last increase at interval 30. Membership reassigns the first resident after intervals 3 and 10. Battery/crossing/zoning have no model live setter and retain their standard trajectory in the action-labeled case.
- Recycling stores adopter counts and all nodes after every interval through 130, including long zero-influence consumption followed by increased influence.
- Invalid advances, NaN/infinite/out-of-range/wrong-type setters, occupied-capacity shrinkage and invalid resident indices must throw without changing a subsequent complete observation.
- At checkpoints the harness attempts numeric mutations through a separate detached observation, then verifies that a fresh model read is unchanged. Frozen observations may reject the attempted writes; the test requires state isolation, not successful mutation.

The completed capture and unchanged-source self-replay each passed:

| Evidence | Count |
| --- | ---: |
| Cases | 32 |
| Instances | 64 |
| Paired checkpoint snapshots | 192 (384 full observations) |
| Read/exported-projection checks | 4,736 |
| Independent-pair continuation comparisons | 4,352 |
| Invalid-action atomicity checks | 328 |
| Detached observation mutation probes | 192 |
| Exact replay mismatches | 0 |

All ten UI modules import headlessly without `document` or `window`; their real bound entry title and mount function type are captured. The harness calls exported pure projections: heatMap/heatColor, housingData, crossingData, treesData, recyclingNodes, zoningData, membershipNodes. Private UI callbacks are intentionally inaccessible through `BoundEntry`, so demand/battery/retention private projections are not extracted or mocked. Actual browser verification must cover those and host completion/playback behavior.

## Comparison boundaries

The independent-pair assertion canonicalizes instance-local references only to compare equivalent models created in one process, since their opaque IDs naturally differ. This normalization NEVER applies to stored raw snapshots or before/after replay: their opaque IDs must match exactly.

Factories do not expose their raw RNG state. These runs establish observable seeded continuation, read purity and action semantics over captured intervals; they do not claim complete continuation serialization or exhaustive RNG-state equivalence. No browser, build or source-review approval is implied by this baseline.
