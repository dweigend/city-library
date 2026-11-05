# A2a acceptance evidence

Status: bounded A2a implemented and author-verified; independent Random/model review completed with no blockers. A2a does not complete the whole A2 Random target. [Usage](a2a-usage.md), [assignment](a2a.md), [source research](a2a-source-research.md).

## Example-first and preservation

Five scripts and the shared examples/models/exchange.ts composition were written and SHA-256 fingerprinted before Random implementation. Each initially failed against missing A1 capabilities. Their six fingerprints remain unchanged. A1 scripts and Agent/World runtime were preserved. Concurrent reorganization moved the external host to Agend_Lab and its old lifecycle model to models/agent-lab; this slice preserved that work.

## Author shell checks

On 5 November 2026, the coordinating agent ran bun run check successfully: 60 tests, ten independent A1/A2a example processes, strict library/dev/UI TypeScript, browser-target ESM and declarations, and an extended packed-package consumer on Bun 1.4.2, Node 26.8.2 and TypeScript 7.0.2 without host ambient types. git diff --check passed. Test sources include [independent boundaries](../../tests/a2a-boundaries.test.ts), [runtime regressions](../../tests/a2a-runtime.test.ts), [type contracts](../../tests/a2a-types.ts) and the [headless lab models](../../models/agent-lab/model.test.ts).

During author inspection, integer draws were corrected to floor the random offset before adding a large safe-integer minimum, with a 30-draw regression. Sampling now acquires a source's iterator getter once before consuming it; a contract test prevents silent source loss from a changing accessor. Old-source weighted sampling's normalization was not transferred: overflowing totals reject, tiny positive weights stay eligible.

## Browser checks

The same shared-browser tailnet URL was used after rebuilding and restarting the test-host service. Desktop 1280×800 and mobile 390×844 screenshots were inspected in light and dark modes. Native controls, marker labels, population totals and last-pair emphasis remain legible. Mobile scrollWidth equals viewport width; the first marker remains inside the scroller with safe centered overflow.

- Default Exchange has 24 canonical agents, energy 10 each, total 240 and tick 0.
- Seed 1 after 100 steps: tick 100, total 240, range 2–15. Resetting the same setup replays all 24 energy values exactly; seed 2 produces a different distribution (range 2–14) with the same total and tick.
- Selecting a marker does not advance time. The headless contract tests additionally establish unchanged RNG continuation during observation/selection.
- Lifecycle mode hides/disables seed/population settings and hides exchange statistics. Its one-step action produces energy 9/tick 1; copying selects a detached object and disables its step controls as before.
- A scenario-switch validation trap was reproduced and fixed by the coordinator: an invalid population setting is now left visible for correction rather than reverting to Lifecycle and hiding the invalid field. The old model remains untouched until a valid New model; repairing count to 24 and submitting restores Exchange, with 100 steps again yielding total 240/range 2–15. Typecheck and affected browser flow were repeated.
- A brief connection refusal immediately after a service restart was resolved by checking the running service/HTTP endpoint and reopening. Subsequent page/JS/CSS requests succeeded; screenshots reported no console errors or failed assets.

The UI retains the existing compact layout and applies frontend-design/web-design-guidelines. Current upstream Vercel rules were fetched for QA. This evidence is browser acceptance for the lab, not spatial/scientific validity or a cross-browser matrix.

## Independent review

Independent read-only review by Antigravity gemini-4-argon completed with no blockers. The reviewer independently ran bun run check (60 tests, ten examples, typechecks, build and packed consumer), checked example fingerprints and challenged numeric extremes, source/weight schedules, continuation/cache atomicity and nested local cleanup. It audited the shared model and UI for public imports and absent duplicated rules/timers.

Review: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3Aba259da0-5b36-455f-959c-15f48bcd7d9a%3Adelegate-task%3A8740ffba-5c82-42c0-b09d-5df9ce13880a>.

Optional notes were not adopted as contract changes: legacy shuffle continues requiring weight/order properties to be absent, as the reference says; the frozen composition is unchanged rather than adding new option-validation behavior after implementation. The report's printed full hash for script 04 contains a transcription error; the authoritative frozen manifest and coordinator SHA-256 check match the actual file: 7d6c04c980717005624fd42b8f1b7876eee24b27ca5f9d0412a8f3318061d239. This does not alter scripts or acceptance.

The small scenario-validation UI fix above was author-verified with typecheck and repeated browser interaction; no separate independent visual approval is claimed. Full A2b profile/distribution compatibility remains open.
