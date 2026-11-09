# Model-script feedback and refactor decisions

Two independent reviews examined all ten model/UI pairs at `215b13f0d75de67f1d15774035d98e7bc8359956` before edits. Astra used Codex `gpt-6-astra` with `reasoningEffort: high`; Gemini used Antigravity `gemini-3.8-flash` with `thinking_level: high`. Their original findings remain in [Astra feedback](refactor-feedback-astra.md) and [Gemini feedback](refactor-feedback-gemini.md). Neither report approves the later refactor.

The immutable pre-edit capture covers 32 cases, 64 instances and checkpoints 0/1/3/10/30/130. See [capture method](refactor-baseline-capture.md). Model state, observation keys, opaque IDs, arithmetic order, RNG draws, action semantics and accepted visual mechanisms must remain unchanged. Two explicit presentation corrections are tracked separately below.

| Finding | Baseline evidence | Decision and reason | Verification |
| --- | --- | --- | --- |
| ASTRA-01, medium | Occupancy, crossing and zoning `ui.ts:4` omit `complete`; their models already return `done` | Fix with existing `complete: state => state.done`. This corrects playback/step availability, not domain rules. | Fresh browser terminal run, disabled step/run and stable terminal tick |
| M01-COMPRESS-01 / M01-MAGIC-02, low | Heat `model.ts:16–17,40–44`; `ui.ts:22–26` | Expand setup/read; name shade hatch geometry and color. | Exact trajectory/projection replay and heat screenshots |
| M02-COMPRESS-01 / M02-ASSERTION-02, low | Energy `model.ts:39–44`; `ui.ts:27–33` | Explain completed demand hour; use a readable typed outline without assertion noise. | Exact segment/output replay where public; actual browser and balance tests |
| M03-COMPRESS-01 / M03-MAGIC-02, low | Housing `model.ts:39–43`; `ui.ts:21–31` | Expand advance flow and name reservation colors/layout. | Exact tickets/IDs/actions replay and capacity rejection |
| M04-DUPLICATE-CELLS-01 / M04-COMPRESS-02, low | Crossing `ui.ts:22–26`; `model.ts:39–43` | Generate one effective cell per road coordinate; expand loop. This changes projection entries, preserving the rendered road. No new unique-coordinate public contract is inferred. | Focused unique-coordinate regression plus before/after effective-cell comparison and browser |
| M05-COMPRESS-01 / M05-LABEL-AGENTS-02, low | Battery `model.ts:34`; `ui.ts:26–32` | Expand execution and distinguish view-only label descriptors from domain entities. | Exact state/balance replay and fresh gauge screenshots |
| M06-COMPRESS-01 / M06-MAGIC-02, low | Retention `model.ts:34`; `ui.ts:20–25` | Expand execution; name basin display resolution and catchment offset. | Exact flow/history replay and fresh basin screenshots |
| M07-COMPRESS-01 / M07-MAGIC-02, low | Trees `model.ts:35`; `ui.ts:26–30` | Expand read/advance; name trunk and water-marker geometry. | Exact priority/allocation/RNG replay and fresh tree screenshots |
| M08-COMPRESS-01 / M08-NON-NULL-02, low | Recycling `model.ts:20,39` | Explain nonempty ring invariant; expand execution without skipping any RNG draw. | Full zero/increased-influence continuation replay |
| M09-COMPRESS-01 / M09-DOMAIN-UI-COUPLING-02, low | Zoning `model.ts:32–35`; `ui.ts:37` | Clarify replication execution and aggregate capacity projection; retain slots/cap calculation with its binary-build invariant. | Exact paired-seed outcomes and projection replay |
| M10-ASSERTIONS-01, medium | Membership `model.ts:34–36,51–52` | Retain the established two-edge invariant with explicit explanation/narrowing. Reject silent `Unassigned` fallbacks: they hide an internal consistency error and invent an observation state. | Exact edge identity/order and repeated reassignment replay |
| M10-COMPRESS-02, low | Membership `model.ts:40–43` | Expand execution and name authored places. | Exact observation/Graph replay |

## Decisions to retain

ASTRA-02–11 document ten model-specific invariants rather than additional defects. Retain heat's left-associative arithmetic and old-state two-phase barrier; energy's completed-hour observations; Resource as the sole housing allocator; crossing's discrete phase boundary; battery's unconstrained crossing before clamp and single initial draw; retention's current-interval drainage; trees' stable old-moisture priority before loss; recycling's draw for every nonadopter even at zero influence; zoning's paired seeds and one replication per outer tick; and membership's canonical Graph references and new edge identities on reassignment.

All Gemini `M01`–`M10` retain findings are accepted: public projection exports, true Grid coordinates, deterministic schematic layouts, existing continuous functions, real Resource tickets, two-phase updates and native Graph edges remain. Layout constants describe presentation, not new domain geometry. No shared UI, palette, canvas, CSS, host, library or reference-model changes belong to this refactor.

Gemini checked screenshot hashes and pixel statistics. That supports file integrity, not a complete WCAG or semantic-image approval. Fresh rendered flows and independent actual-image inspection are separate acceptance gates; no general WCAG-AA certification is claimed.

## Implemented changes and comparison

The model/UI changes and one focused road-projection regression were committed as `95a5dc8f5e9769b72b7fedb3c79ba35217914236`. Each fix row above is implemented there; retain decisions preserve its baseline mechanism. The native independent source/behavior check found no further blocker.

The unmodified strict replay exits 1 for exactly two cases: crossing's default and action trajectories contain the deliberately changed `crossingData.cells` array. All domain observations, IDs, clocks, actions and other exported projections compare exactly. A separate comparison resolves crossing cells by the renderer's last-write-per-coordinate rule, then compares every remaining value exactly: 32/32 cases pass. The original strict mismatch remains in [strict replay evidence](refactor-baseline/strict-replay-summary.json); the separate [effective comparison](refactor-baseline/effective-replay-summary.json) does not replace or overwrite it.

Crossing's view correction also changes view-cell selection: the old first coordinate match could select a hidden road descriptor beneath a stripe. The sole surviving stripe descriptor is now selected, with fewer cell entries in the keyboard sequence. These are view-only IDs; no domain identity, action or inspector behavior changes. The change is a small explicit presentation correction, not complete projection-array identity.
