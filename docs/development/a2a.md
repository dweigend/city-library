# A2a assignment: reproducible population dynamics

Status: five acceptance scripts and the reusable headless example model are written before Random runtime changes. Their initial execution fails against the A1-only Random API. A2a is now implemented; see [usage](a2a-usage.md) and [acceptance evidence](a2a-evidence.md) for executed checks and review status.

Read [PLAN](../../PLAN.md), [ARCHITECTURE](../ARCHITECTURE.md), the binding [Random reference](../agent-loom/api-reference.md#reference-random) and [operation inventory](../agent-loom/api-table.md#area-random). A2a stages A2; it does not remove deferred phase-one commitments.

## Task and public API closure

Make explicit random selection, independent stream branching and in-place continuation usable in ordinary scripts. Demonstrate those operations in a real multiagent example with reproducible dynamics, then let the existing HTML test host consume that same headless composition. Preserve the approved HTML layout and rendering boundary; add only the population/seed controls and readouts needed to exercise this model.

Use the public `city-library` root entry. Preserve all A1 default draws exactly. Keep the engine independent of World creation, DOM, presentation and the example composition. Add only implemented operations/types; do not advertise deferred profiles/overloads as working.

| Reference operation | Accepted A2a contract | Remaining target work |
| --- | --- | --- |
| [Random.add](../agent-loom/api-table.md#random-add), [algorithm](../agent-loom/api-table.md#random-algorithm), [seed](../agent-loom/api-table.md#random-seed) | Existing Mulberry32 numeric/default construction. Default seed 1; accepted signed/unsigned 32-bit input normalized modulo 2^32. Algorithm fixed; seed read-only to callers and updated by reseed/state restoration. Construction consumes no model draw. | Entropy seed and MT profile remain A2b. |
| [number](../agent-loom/api-table.md#random-number), [uniform overload](../agent-loom/api-table.md#random-number-2) | Default uniform [0,1); finite min/max with max greater than min; integer mode validates safe integer bounds and safe range. One selected-stream double, affine transform and floor in integer mode. Reject other distribution-specific/unknown keys before drawing. | Normal/exponential/Poisson/gamma and MT bound overload remain A2b. |
| [sample](../agent-loom/api-table.md#random-sample) | Consume finite source once without deduplication. Validate options and exactly one synchronous finite nonnegative weight per position before sampling. Defaults count 1, replace false, equal weights, order draw. Each actual selection consumes one double, including a singleton; zero count/empty/all-zero gives [] without draws. Without replacement remove positions, not identities; source ordering sorts selected positions after draws. Preserve source and original references. | MT-specific bounded integer primitive remains A2b; native activation is A6. |
| [sample compatibility](../agent-loom/api-reference.md#complete-sampling) | legacy-shuffle only with full source count, replace false and omitted weight/order. Descending Fisher–Yates on a copy; Mulberry bounded integer uses its uniform/floor primitive. Empty/singleton shuffles draw nothing. Other combinations reject before drawing. | No implicit NetLogo ask behavior. |
| [state](../agent-loom/api-table.md#random-state), [RandomState](../agent-loom/api-table.md#type-random-state) | Detached deeply frozen Mulberry state with seed metadata, matching outer/inner algorithm and revision agent-loom-random/1, uint32 word and finite gaussian cache or null. Setter validates complete closed schema atomically and changes this same Random's continuation; retained World references remain identical. For Mulberry state assignment, accept the constructor's integer seed domain [-2^31,2^32-1] and normalize seed metadata modulo 2^32, consistently with construction/reseed; the continuation word is independently validated as uint32. Preserve finite cached Gaussian even while distribution draws are deferred. | MT branch is not delivered; storage root encoding remains A8. |
| [reseed](../agent-loom/api-table.md#random-reseed) | Strict numeric Mulberry seed validation before changes, restore selected seed/word and clear Gaussian cache, no draw. | MT truncating reseed semantics remain A2b. |
| [copy](../agent-loom/api-table.md#random-copy) | Independent Random with exact current continuation, seed and Gaussian cache; no draw. | Other profile branch arrives with its implementation. |
| [local](../agent-loom/api-table.md#random-local) | Synchronous nonthenable callback, restore complete immediate predecessor continuation in finally. Nested scopes start from outermost main checkpoint, not the current outer temporary continuation. State reads/writes within a scope address the temporary stream; they never overwrite main checkpoint. Only randomness rolls back; model effects remain. | Storage capturing a temporary stream rejects when storage is delivered. No prohibition is invented on ordinary state reads or copy. |
| [raw double](../agent-loom/api-table.md#random-raw-4) | raw({kind:"double"}) is the selected Mulberry uniform double. Validate unknown/inapplicable keys before drawing. | MT raw int32/int31/int64/gaussian remain A2b. |

A2b is a delivery subdivision, not an exclusion: standard nonuniform distributions, entropy construction, complete MT/netlogo-7.0.0 profile and its versioned raw/distribution semantics remain binding. Do not add placeholders for them. Invalid supplied options must fail rather than silently use defaults.

## Five scripts written first

| Script | Task and asserted outcome |
| --- | --- |
| [01-seeded-draws.ts](../../examples/a2a/01-seeded-draws.ts) | Existing seed-1 first draws stay 0.6270739405881613, 0.002735721180215478, 0.5274470399599522. Uniform integers in [-2,3) are [1,-2,0]. Invalid equal bounds preserve continuation; raw double matches standard draw. |
| [02-population-selection.ts](../../examples/a2a/02-population-selection.ts) | Weighted choices return canonical Agents in fixed draw order; source order preserves positions; source is unchanged. Explicit no-draw cases, singleton draw and seed-1 full shuffle [d,b,a,c] establish schedules. |
| [03-stream-continuation.ts](../../examples/a2a/03-stream-continuation.ts) | Detached frozen checkpoints, exact independent copy, in-place restore through an existing World reference, normalized reseed, cache preservation/reset and seed metadata restoration. Tick remains unchanged. This restores RNG continuation only, not a complete model checkpoint. |
| [04-local-randomness.ts](../../examples/a2a/04-local-randomness.ts) | Nested temporary scopes start at the main checkpoint; immediate predecessor is restored. A thrown callback and a returned Promise restore the stream but retain ordinary model effects. |
| [05-resource-exchange.ts](../../examples/a2a/05-resource-exchange.ts) | Twenty-four canonical Agents exchange one energy unit per successful transfer. Equal seeds and equal operation order reproduce per-agent energies even with split run calls; distinct seed fixture differs. After 100 steps total energy is 240, no energy is negative, sent/received counts match, only two latest participants are highlighted. Selection and repeated observation consume no draw or tick. A separate model stays isolated. |

Scripts import public exports only. Expected numerical draws come from the pinned Mulberry recurrence and declared selection schedule, not implementation-derived fixtures. The reusable [exchange model](../../examples/models/exchange.ts) is also written before Random runtime work, and is imported by script 05 and the later HTML adapter. It is ordinary model-author code outside the library, with no assertions or import-time execution.

All five scripts and the shared model are frozen at handoff. Substantive syntax/expectation changes need a recorded design reason and user agreement. Fix implementation rather than weakening scripts. Their initial expected failure is recorded below; no mocks, disabled assertions or private imports are allowed.

## Reusable exchange composition

Inputs: count defaults 24, safe integer in [2,200]; initialEnergy defaults 10, safe integer in [0,1000000]; seed defaults 1 in the Mulberry signed/unsigned 32-bit domain. Validate all three before allocating Random, World or Agents. Energy is an abstract indivisible resource, not money or a scientific economic claim. There is no geometry or inferred duration per tick.

Creation uses Agent.add for canonical records {label,energy,sent,received}, Random.add for an independent stream and World.add({random}) plus explicit batch registration. Each successful model step samples two distinct current World positions, records the last interaction IDs and transfers one unit if the donor has energy. No transfer occurs at donor energy 0. Fewer than two registered Agents is a successful no-op step with no draws. run owns tick progression; selection does not choose the donor.

The model's ordinary inspection list retains original created/copy references, including detached/deleted objects; World owns membership. read returns frozen primitive observations derived from canonical objects, current World count, current registered total/min/max (min/max 0 for empty membership), actual default coordinates, seed, RNG continuation and last interaction IDs. No mutable framework object is exposed by read.

Application actions are read, advance, select, copy, toggleMembership, delete and failStep. Selection resolves only a known canonical ID and is inspection-only. Copy returns/selects a new detached identity through Agent.copy, assigns a fresh model label and retains the canonical reference for inspection. Explicit attach/detach/delete can change the registered total. Conservation is promised across ordinary advance calls with unchanged membership, not across those deliberate lifecycle edits. failStep performs the normal exchange attempt and throws inside run: earlier resource/RNG effects remain and the failed step receives no tick. The five scripts establish conservation in a fixed-membership fixture.

## Required implementation tests

Beyond examples, test strict numeric domains and closed options without getters, invalid sampling weight/count/overflow/iterator/callback preflight preserving RNG, duplicate source positions, source-order stability with replacement, exact default and legacy draw counts, Gaussian metadata/cache roundtrip, malformed state revisions/tags/extra keys, atomic state replacement and read-only algorithm/seed. Tests should challenge nested local state assignment/reseed and cleanup after async declarations, callable thenables and throwing then getters. Verify former A1 calls and all five frozen A1 scripts still pass.

For exchange: invalid creation inputs fail before allocation, selection/observation preserve all continuation/clock/energy state, equal seed replay agrees independently of IDs, current membership drives sampling, zero-energy donors and fewer-than-two populations are safe, lifecycle actions remain explicit and frozen snapshots remain observations. Browser tests verify that the existing HTML host presents these results without reimplementing exchange, selection or clock rules.

## Reuse, provenance and review

The existing A1 Mulberry recurrence remains the exact stream foundation. New focused helpers own validation, sampling and continuation rather than introducing a universal RNG manager or World dependence. The old-project advisory research can supply fixtures and pitfalls; any actual source adaptation must record path/revision/changes/notices separately. Generic host Math.random is not a seeded stream implementation and external packages cannot silently change versioned schedules. No new dependency is required for this accepted closure.

Delegate runtime changes only after these files are frozen. Run type/behavior/examples/build/packed-consumer checks; keep UI/browser evidence separate. Obtain independent Antigravity gemini-4-argon review, record findings and author responses honestly, and keep A2b/deferred work open in the inventory. No commit, push, publication or automatic A2b implementation is implied.

## Initial evidence

Before A2a runtime handoff, bun examples/a2a/01-seeded-draws.ts failed against the A1 guard with TypeError: A1 number accepts no options. The source Random still has only number() and no sampling/continuation APIs. git diff --check passed. These are expected missing-capability failures, not accepted behavior.

## Frozen fingerprints

SHA-256 recorded before runtime handoff on 5 November 2026:

| File | SHA-256 |
| --- | --- |
| `examples/a2a/01-seeded-draws.ts` | `92ba7a4d03fcd4208d54d814bf34ce2e2213de19054f4ccf1b866baf9041828d` |
| `examples/a2a/02-population-selection.ts` | `076c3d8dd85a4d7e64f744bc049220f99f5904b64c62ab5c4cdb12c945b5fb85` |
| `examples/a2a/03-stream-continuation.ts` | `db743a593fae2896f9f1ec12c28213acf85d5359519bf8c16f5cbaea5467bb03` |
| `examples/a2a/04-local-randomness.ts` | `7d6c04c980717005624fd42b8f1b7876eee24b27ca5f9d0412a8f3318061d239` |
| `examples/a2a/05-resource-exchange.ts` | `8aba1c3f0e7f155c3cce4c19a3ee7ed541154af2d43ec4b7b3f1226252ef9a9d` |
| `examples/models/exchange.ts` | `98453a90c0b87cb2933ac907911d4cc8b724bc1844da112851489f2921990820` |
