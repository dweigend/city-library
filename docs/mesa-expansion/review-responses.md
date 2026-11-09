# Independent review responses

Findings, author responses and independent approval are separate. This record does not grant runtime or browser acceptance.

## Astra deep analysis

Provider/model/settings: Codex `gpt-6-astra`, `reasoningEffort=high`. The completed analysis examined time, activation, thresholds, ownership and execution boundaries. It found the ownership split logically compatible and withheld unconditional approval pending edge-case decisions. It performed source inspection and selected IEEE-754 calculations, not the public test suite or browser checks.

| Finding | Response and decision | Verification |
| --- | --- | --- |
| Dead entries during priority projection | Skip already-dead captured members before evaluating priorities. Living foreign membership still fails at visit, retaining prescribed partial effects. | Focused regression added by dynamics worker; executed test record follows. |
| Nested death and Resource veto | Only the owning activation frame consumes its death signal; validation veto propagates before death. Existing internal deletion commits/observers must not throw after validation or reenter lifecycle mutations. | Nested-frame test executed; Resource cross-track verification pending. |
| Two-phase aliasing and lifecycle | Keep generic entry references and commit order; no implicit World/dead filtering or clone. Pure compute and independent or immutable proposals are caller responsibilities. Failed commit can retain its own partial effects and earlier commits. | Explicit decision documented; focused tests. |
| Threshold rounding and endpoint | Scaled interpolation avoids endpoint subtraction overflow, preserves exact elapsed duration when threshold equals endpoint, and constrains finite elapsed to the interval. Subnormal underflow to zero is allowed. No epsilon or claim of mathematical/bit-exact arithmetic. | Extreme/endpoint tests added; linear operation order unchanged. |
| Invalidated predicted crossing | A model that changes a rate before a predicted crossing must cancel/recompute through explicit Agenda data and handles. No hidden callback or ODE solver. | Agenda integration tests pending. |
| Recording coordinate | World tick is the normal History convention. An alternative axis must be explicitly named and consistent within a series; aggregate same-time numeric observations or use EventTrace. No implicit tick/time conversion. | Frozen History assertions remain unchanged. |
| Incomplete event horizon | A horizon-based model step must throw on event-budget exhaustion or use the existing `host.advance` adapter-stopped result. Normal return would count a successful World interval. | Communicated directly to Salabim coordinator; integration evidence pending. |
| Conservative sample bound | Count distinct completed boundaries using `min(steps+1, initial+floor(steps/every)+final)`. Filters do not lower preflight allocation. | Independent measurement refactor fixed false rejections and added regression tests. |

These responses preserve every frozen assertion. Independent reapproval, where required, remains a separate review result.

## Gemini contract review

Provider/model/settings: Antigravity `gemini-3.8-flash`, `thinking_level=high`. Its independent contract report is [retained separately](gemini-contract-review.md). The report identified missing World Agenda integration (high), missing unexpected-option/accessor validation for two-phase and continuous inputs (medium), and central additive API documentation (low). World integration and boundary validation are now in runtime commit `69ed507`; four frozen attachment scripts and both unchanged core example suites executed successfully after the real DES runtime merge. Central reference/table now document the additive tools and fixed/priority activation.

Two statements in the reviewer narrative need a precise author response: World tick can be fractional and explicitly advanced/reset under its existing contract; it is not restricted to integer step counts. Continuous crossings use rounded IEEE-754 interpolation, exact only for the assumed linear model segment, never mathematical or bit-exact arithmetic. The report's broad phrase that examples fully cover the contracts is not used as a completeness claim: focused adversarial tests, public consumers and independent browser/image review remain required. The report recommends bounded contracts for approval but does not grant final integrated runtime/browser acceptance. A fresh final review will assess fixes and integrated evidence.

## Integration and verification corrections

The newly delivered gamma overload invalidated two old negative consumer assumptions. Type consumers now accept a valid gamma call and still reject an unsupported distribution name. The runtime boundary fixture now uses gamma shape zero and retains its unchanged-stream assertion. No valid-domain rejection is preserved merely because it was previously unimplemented.

Registering both cross-track public suites with the normal typecheck found a deliberately foreign, differently typed Agenda handle in `examples/des/01-causal-agenda.ts`. An `@ts-expect-error` comment marks this intentional negative type case; its call, runtime exception assertion and all expected results are unchanged. This is an editorial typecheck annotation, not a relaxed frozen contract.

The model refactor identified a truncated green duration at the upper input bound in the pedestrian example. The author subsequently derives cycle duration from three red minutes plus the chosen green minutes. Existing finite-cohort observations remain unchanged; all twenty model tests passed after this correction. The packed consumer uses a fresh measurement read after two-phase mutation, avoiding stale TypeScript property narrowing while exercising the public observation contract.

## Fresh final Gemini decision

The fresh Antigravity `gemini-3.8-flash` review with `thinking_level=high` returned **APPROVED** for the requested Mesa mechanism/model/integration scope. Its [independent report](gemini-final-review.md) names baseline `98015d0` and acknowledges subsequent non-interfering evidence through `2446724`. Findings, author corrections and independent approval remain separate. The later `e4d0723` central-reference completion, maintenance-label presentation delta and canvas scheduling change are not silently included in that reviewed scope. A native independent [canvas source review](resize-source-review.md) covers the accepted `11d78f7` delta; post-fix browser/image evidence is separate. The approval does not certify scientific prediction, complete accessibility, full NetLogo compatibility or arbitrary continuation.

## Canvas follow-up decision

The independent native source review approved `ab5289b`/`11d78f7`; the fresh native image review approved four actual spatial images at source HEAD `80aba9f` (same canvas bytes). The independent browser replay completed at `93f709` with all ten ordinary Mesa flows, explicit error channels and deterministic cancellation/disposed-callback protection passing. Earlier forty-four-image approval remains separate and unchanged. Complete typecheck, nineteen focused UI tests and explicit Svelte build passed on the integrated fix. These post-review gates resolve the reproduced warning without claiming that the earlier Gemini review examined the later canvas code, or that every caller-owned ResizeObserver use is immune.

## Corrected visual mechanism review

The user rejected the table-first presentation after opening the heat example. All ten primary views were corrected using existing Grid/spatial/network contracts, without shared runtime, CSS or reference-model changes. Independent refactoring corrected continuous color mappings, interval labels and a duplicated scenario inference. Actual-image findings about queue labels, scenario caption bands and basin labels were fixed, recaptured and independently reapproved. The full finding history remains in [the new image report](visual-image-review.md).

A fresh Antigravity `gemini-3.8-flash` review, explicitly selected with `thinking_level=high`, returned **APPROVED** for baseline `4758c3577f8a6218e974bef836e53d6780c7e53a` (source `55749cc`, portable evidence `2a5edf5`). Its [independent report](visual-gemini-final-review.md) is separate from these author responses and from the earlier table-first review. It also independently reports71Mesa tests/505assertions,15visual tests/220assertions, typecheck, public examples, build and evidence-hash checks. The coordinator's separately recorded final targeted run was43tests/403assertions and Svelte0errors/0warnings. Original model values and IDs match4427227 through step130. No source change followed this final review; closing status changes are documentation only.
