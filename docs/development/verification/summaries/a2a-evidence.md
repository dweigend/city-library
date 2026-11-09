# A2a acceptance summary

Historical verification: 5 November 2026. This summary preserves prior results; it does not report a fresh check run.

- **Scope:** numeric-seed Mulberry uniform draws, sampling, continuation, reseed/copy/local and raw double. Other distributions, entropy and MT/NetLogo compatibility remain A2b work. See [usage](a2a-usage.md), [contracts](a2a.md) and [source research](a2a-source-research.md).
- **Example-first:** five new scripts and the shared Exchange composition preceded runtime implementation; accepted fingerprints remained unchanged.
- **Shell:** `bun run check` passed with 60 tests, ten examples, strict typechecks, build/declarations and packed Bun/Node/ambient-free TypeScript consumer checks.
- **Browser:** desktop 1280 × 800 and mobile 390 × 844 in light/dark. Seed 1 replayed all 24 agent balances after 100 steps; seed 2 changed their distribution. Both retained total energy 240 and tick 100. Selection preserved time; lifecycle actions and scenario validation were exercised without horizontal overflow or console/asset errors.
- **Independent review:** Antigravity `gemini-4-argon` independently ran the suite and adversarial Random/model checks with no blockers. The subsequent scenario-validation UI fix was author-verified, without separate independent visual approval.
- **Regressions:** large-safe-integer offset rounding, single iterator-getter acquisition and invalid scenario settings received targeted checks. Overflowing weight totals reject; tiny positive weights remain eligible. Legacy shuffle retains the reference's absent-weight/order contract.

Tests: [boundaries](../../tests/a2a-boundaries.test.ts), [runtime](../../tests/a2a-runtime.test.ts), [types](../../tests/a2a-types.ts) and [headless lab models](../../models/agent-lab/model.test.ts). No full A2b, spatial/scientific or cross-browser parity is claimed.

Detailed historical logs are local artifacts; see the [documentation policy](README.md).
