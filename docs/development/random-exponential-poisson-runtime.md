# Standard exponential and Poisson runtime

Implemented 6 November 2026 from the root's [accepted contract](random-exponential-poisson-contract.md), frozen before implementation at `bf186c6`. This is a headless Mulberry distribution slice through the existing `Random.number` operation. It adds no MT/gamma profile, namespace, model-private workaround, continuation field, World behavior or independent approval.

## Delivered behavior

[Random owner](../../src/random/random.ts) adds the accepted exponential/Poisson overload and delegates to focused [exponential](../../src/random/distributions/exponential.ts) and [Poisson](../../src/random/distributions/poisson.ts) functions. [Shared parameter validation](../../src/random/distributions/mean-options.ts) enforces closed descriptor-safe options, numeric finite nonnegative means and the Poisson100000 upper bound before any draw. Recognized undefined mean defaults to1. Both signed mean zeros return positive0 without drawing. Normal/uniform/continuation source files are unchanged.

Positive exponential uses exactly one existing uniform draw and the literal `(-mean) * Math.log(1-U)`. Finite underflow and the formula's negative zero at U0 survive. Nonfinite sampled output throws RangeError after consumption without rollback.

Positive Poisson below30 uses the accepted do-first product loop: equality and U0 stop; tiny means whose threshold rounds to1 still consume one draw and return0. At/above30 it uses the chosen printed PTRS `.43` offset, two uniforms in order U then V per proposal, rejection of us0 after both draws, the printed squeeze/negative/tail/log-test order, and legal V0 as log−Infinity. Rejections restart on the same owner stream without an arbitrary retry cap. Accepted outputs are checked as nonnegative finite safe integers; they are not clamped to the mean/input bound.

Log-factorial uses the deterministic finite-log table0…255 and exactly the accepted four-term Stirling expression above it. This is a binary64 approximation, not exact real factorial arithmetic, platform-independent libm rounding, or native NetLogo distribution/RNG parity. Implementation was independently written from the accepted mathematics; no third-party implementation was copied. Primary paper/version/license details remain in the [proposal](random-exponential-poisson-contract-proposal.md), including the intentionally resolved `.43` versus `.445` discrepancy.

## Executed checks

[Validation summary](random-exponential-poisson-runtime-evidence/validation.json) and retained command output distinguish implementation checks from independent approval:

- `bun test tests/random-exponential-poisson.test.ts tests/random-normal.test.ts`: **17 passed, 0 failed, 233 assertions**. This includes all seven existing normal tests and ten new focused distribution tests.
- `bun run typecheck`: **PASS**, covering configured source/development/UI suites, including the new test.
- `bun node_modules/typescript/bin/tsc --project examples/random-exponential-poisson-proposal/proposal-typecheck-config.json`: **PASS**, including all five frozen distribution examples without shims.
- `sha256sum -c docs/development/random-exponential-poisson-examples.sha256`: **all five unchanged**. Each of those five complete public scripts executed with Bun and passed; [per-script results](random-exponential-poisson-runtime-evidence/frozen-examples.json).

The new focused [test](../../tests/random-exponential-poisson.test.ts) checks option classes/getters/unknown own keys, both signed zero means, exponential endpoints/underflow/overflow consumption, low-mean equality/tiny/U0 stopping, exact U→V sequencing, rejected-proposal consumption, V0 acceptance without an output clamp, a fixture distinguishing `.43` from `.445`, and an independently finite-summed Poisson mass boundary. A1000001-rejected-proposal fixture verifies that the normal family's retry cap was not inherited. Mixed operations verify existing normal cache, copy/local/state and World ownership/tick behavior.

Log-factorial is compared with reverse-order compensated finite-log sums at0,1,2,9,10,64,254,255,256,257,1000 and100000, using eight binary64-epsilon-scaled units as the declared error allowance. Fixed independently computed Decimal65 finite sums additionally cover10!,255!,256!,1000!. High-mean Poisson support, mean, second central moment and mode mass use80000 deterministic samples per mean30/150/100000. Mean tolerances are eight analytical standard errors, second central moment5%, and mode mass eight binomial standard errors. Frozen scripts separately exercise the actual Blood Sugar mean150 and hormone mean2/ln2, their moments/survival and exact continuation.

These are numerical implementation checks on declared deterministic fixtures, not a proof for every seed or empirical validation of the full Blood Sugar model. The original source/target biological browser acceptance remains separate.

## Handoff boundary

No frozen example changed. No index, config, global ledger, model, UI, Git or other worker's files were edited. Root owns registration, full regression/build and actual packed-consumer integration after the disjoint Graph.copy work settles; those checks were not run by this worker. No browser change or new browser baseline is claimed. Argon approval remains quota-blocked and was neither retried nor substituted. No independent approval or delivery-count increase follows from these runtime checks.
