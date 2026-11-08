# A1 acceptance summary

Historical verification: 5 November 2026. This summary preserves prior results; it does not report a fresh check run.

- **Scope:** bounded headless Agent/World lifecycle and synchronous run/Tick. See [usage](a1-usage.md), [accepted contracts](a1.md) and [coverage](coverage.md). Full Agent Loom delivery remains open.
- **Example-first:** five public scripts preceded runtime implementation; their frozen fingerprints are in the assignment.
- **Shell:** `bun run check` passed with 30 tests, five examples, strict typechecks, browser-target build/declarations and an isolated packed consumer on Bun 1.4.2, Node 26.8.2 and TypeScript 7.0.2.
- **Browser:** Chromium desktop 1280 × 800 and mobile 390 × 844, light/dark. Exercised stepping and failed-step tick behavior, detach/reattach/copy/delete, reset, keyboard operation and invalid input; no observed horizontal overflow or console/asset errors.
- **Independent review:** Antigravity `gemini-4-argon` found two blockers: noncanonical TypedArray keys could be lost, and copy could omit deferred reserved Agent keys. Both were fixed with regressions. Prototype preservation and callable iterable membership were also corrected. Final author checks passed; fixes did not receive a second independent approval.
- **Limits:** ArrayBuffer copies preserve bytes, offsets and shared backing identity, not live resize policy. No exhaustive accessibility or cross-browser certification.

[Source research and selected responses](a1-source-research.md) retain provenance. Regression coverage lives in [boundaries](../../tests/a1-boundaries.test.ts), [runtime](../../tests/a1-runtime.test.ts), [types](../../tests/a1-types.ts) and [headless lab models](../../models/agent-lab/model.test.ts).

Detailed historical logs are local artifacts; see the [documentation policy](README.md).
