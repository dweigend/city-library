# Independent flat-scene and elevator source review

Reviewer: independent native Codex agent, distinct from the implementation and refactor authors. Initial reviewed head: `8628280` on `feat/salabim-concepts`. Scope: the new task since baseline `44272279e22a82deb162589f892ec058c50994d8`; shared spatial schema, validation, geometry, drawing/picking/lifetime, eleven scene projections, and the elevator model. Browser interaction, actual-image approval and the separate Gemini review are independent gates.

## Findings

1. **Medium — canvas buffer representability needs a browser probe.** `prepareBuffer` checks finite positive dimensions but initially permits a finite rounded dimension exceeding the DOM canvas unsigned-long range. For example, a scene with width 1 and height 1e20 has a finite ratio and may yield a huge finite height even when the themed width is clamped to one pixel. Assigning that candidate to `canvas.height` does not preserve the validated value. This concerns buffer dimensions, not permitted finite offscreen scene coordinates. The coordinator was asked to reproduce through both public adapters and preserve the last valid scene on rejection. Resolved by `1e5849cb548ad1514dc6a8b079f22aa6c745d329`: a positive-integer unsigned-32-bit guard runs on the candidate buffer before geometry validation, latest-observation publication or DOM assignment. The boundary is explicit and does not promise browser-specific allocation capacity. The reviewer inspected this exact delta and ran its regression test. Actual post-fix adapter behavior remains a separate browser gate.
2. **Low — stale mixed-diagram selection wording.** The initial contract still says a nearest legacy fallback remains outside visible hits. Current `canvas.ts` correctly omits that fallback for mixed rectangle/diamond diagrams, matching the independent refactor report and painted-bounds design. Resolved by documentation commit `1f994d5`: the contract now explicitly excludes that fallback in mixed diagrams; pure legacy circle/triangle scenes retain their prior nearest behavior.

## Inspected design and source

The implementation extends the existing spatial view and both public UI exports. It does not add another renderer, scene DSL, scheduler, custom draw callback, or model-owned layout. Semantic scientific colors have one palette owner. Scene projections use detached observation data; repeated projections do not dispatch events or draw randomness. Existing ten-model rules remain unchanged apart from additive detached fields and naming an existing fixed station capacity.

Painting and hit testing share dimensions, buffer conversion and rotation. Mixed diagrams traverse reverse painter order; legacy-only diagrams preserve nearest selection. Labels are nonselectable annotations. Descriptions supply actual scene quantities through the canvas accessible name and fallback text. Resize delivery remains coalesced through one animation frame, disposal cancels the frame, and its callback checks disposal before drawing.

Elevator passengers and cars use canonical Agents. Floor/direction queues own waiting membership; each car Resource owns capacity. Issued tickets associate riders with seats without a second mutable occupancy counter. Dispatch reservations are call intent, not seat claims. Alighting completes before boarding; original passenger sequence provides deterministic oldest-call order; full and opposite-direction calls remain queued. Movement is one floor per event. Idle cars wake explicitly, with no polling timer. Every dispatched event counts toward the local bound, and exhaustion throws inside the World procedure before its tick completes. Disposal cancels pending work and releases participation; post-disposal reads intentionally return detached historical observations rather than active resource state.

The elevator is a documented synthetic teaching controller with finite deterministic demand, not an optimized or certified lift controller. Pinned source provenance and explicit departures from upstream bugs are recorded separately. Finite-run waits and rides use consistent transfer-completion boundaries; no steady-state or empirical calibration claim is introduced.

## Executed checks

Executed directly by this reviewer:

```sh
bun test tests/ui-des-scene-kernel.test.ts tests/des-elevator-adversarial.test.ts tests/des-scene-parity.test.ts tests/des-scenes-a.test.ts tests/des-scenes-b.test.ts
```

Result: **30 passed, 0 failed, 515,587 assertions**. This includes maximum declared elevator topology/demand, conservation, zero-duration chains, failed-step budget behavior, detached reads, active disposal, original ten-scene parity, maximum populations, retained capacity, central palette and geometry fixtures.

Source inspection confirms that the five UI authoring scripts and five elevator scripts were committed in `362dce2` and `e90eccb` before their runtime implementations. Editorial replacement of Node assertion imports in the browser fixtures preserved assertions and public calls while making the actual browser gate executable.

## Precise corrective recheck

Reviewed the complete source/test/documentation delta in `1e5849cb548ad1514dc6a8b079f22aa6c745d329`, plus the corrected selection wording in `1f994d5`. Executed directly:

```sh
bun test tests/ui-des-scene-kernel.test.ts
```

Result: **7 passed, 0 failed, 35 assertions**. The new test rejects zero, negative, fractional, 2^32, multiples of 2^32, huge finite and nonfinite values on each buffer axis, and retains the valid representable boundary. The guard precedes all DOM buffer writes and the new projection publication. No source edits were made by this reviewer.

## Verdict

**APPROVED — design and source-code scope, through corrective commit `1e5849cb548ad1514dc6a8b079f22aa6c745d329`.** Both findings have concrete, independently inspected resolutions. No further source-level issue was found in the elevator, scene ownership, causal dispatch, geometry, disposal or compatibility paths. This approval does not claim browser, screenshot, full-workspace, or Gemini acceptance; those remain separately evidenced gates.
