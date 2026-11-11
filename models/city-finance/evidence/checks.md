# Municipal Finance checks

Author checks executed on 2026-11-10 using Bun 1.4.2. These establish local headless behavior only. Browser acceptance, independent screenshot review and scientific validation are not complete.

## Frozen public examples

Before `model.ts` existed, the four complete assertion scripts and `contract.md` were written and the scripts were hashed in `frozen-contracts.sha256`. The initial command `bun tests/public-contracts/city-finance/01-setup.ts` failed with missing `models/city-finance/model.ts`, as expected before implementation. No mock or placeholder was added.

After implementation, each command passed, then passed again after integrating public History:

```sh
bun tests/public-contracts/city-finance/01-setup.ts
bun tests/public-contracts/city-finance/02-accounting.ts
bun tests/public-contracts/city-finance/03-policy.ts
bun tests/public-contracts/city-finance/04-validation-snapshots.ts
sha256sum -c models/city-finance/evidence/frozen-contracts.sha256
```

All four assertions ran; all four hashes matched. The scripts were not edited after freezing. During authoring, the UI draft was corrected to the existing `series(state) => points` API, and public `storage.history` was added for time series. The reuse table was corrected accordingly; no frozen assertions or expected numerical outcomes changed.

## Focused behavior

`bun test models/city-finance/finance.test.ts` passed: 3 tests, 0 failures, 3013 assertions. This covers 500 fractional annual balances with interventions and accounting tolerances, bounded condition, affordable repairs, history retention, accessor/symbol rejection without partial mutation, empty policy changes, and no repair spending when neither backlog nor wear exists.

`bun build models/city-finance/model.ts --target browser --outfile /tmp/city-finance-headless.js` also passed (90 modules bundled). This checks headless browser-target bundling, not rendered UI behavior or TypeScript types.

## Typecheck blocker

`bun run typecheck` was executed and failed with exit 127: `svelte-check: command not found`. This checkout has no `node_modules/.bin`. No dependencies or shared configuration were changed.

`tsc --noEmit -p tsconfig.json` was also executed and failed with TS2688 for missing type definition files `bun`, `svelte` and `vite/client`. This does not establish a passing TypeScript check. The coordinator must install the pinned dependencies using the existing shared workflow, rerun typecheck, and resolve any actual compiler findings.

## UI review and pending browser checks

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs skills. Read components.json and the existing shared UI authoring types/reference; no components, styles or dependencies were added. Also applied web-design-guidelines for source QA; its current rules were retrieved successfully with:

```sh
curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Source inspection: UI writes only through validated setPolicy; numeric condition/accounting calculations live in model.ts; monitors and axes name their units; colors use the central indexed palette; live controls have explicit labels; time series use public History snapshots. No source-level finding remains in this bounded declaration. This is not browser or accessibility acceptance.

Per the task's central browser coordination requirement, no browser was opened and no independent reviewer was started. Required pending work:

- Load Municipal Finance in Agent Lab; verify setup defaults and the first two annual observations.
- Exercise live maintenanceBudget 400 before the first step, then taxRate 0.12 before the second; verify 300/400 repair spending and 1900/1700 backlog.
- Exercise Step, Run/Pause, restart, invalid-input feedback and keyboard navigation.
- Capture desktop (at least 1366×768) and narrow (390×844) screenshots in light and dark themes; inspect chart labels, control overflow, colors and focus behavior.
- Have the centrally assigned independent reviewer inspect those actual screenshots and record findings, fixes and approval separately.

The shared contract runner already discovers `tests/public-contracts/*/[0-9][0-9]-*.ts`; no runner edit is needed for the normal `bun run contracts` command. Its `--city` filter selects only `city-simulation`, so that filtered command does not select this new group.

Shared integration actions remain with the coordinator: model index/PLAN documentation as appropriate, dependency installation/typecheck, UI build, browser verification and independent acceptance. No shared files, commits, pushes or branches were changed by this implementation.

## Limits

No empirical calibration or external scientific comparison was performed. The model has one aggregate infrastructure stock; wear stops accumulating at complete deterioration, service costs may borrow without limit or interest, and taxes do not respond to condition. History retains only the latest 120 samples. Cumulative accounting remains independent of history; floating-point rounding applies to fractional values.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: maintenanceBudget=0 produced year 1 with cash 300 CU, backlog 2200 CU and condition 0.780.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-finance-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Aggregate backlog in CU without assets. Twelve assets with condition and wear, a late-repair cost rule (double below 0.4), `repairPriority` (worst-first/preventive) and derived backlog. `initialBacklog` is removed; `annualWear` now means mean condition loss per year; serviceCost default 400, maintenance 500.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:28:39+00:00. SHA-256 at that moment:

```text
7a518a4aace93183fd46021d7677d78ed9017dce4bec5c5e234956fa86907088  tests/public-contracts/city-finance/01-setup.ts
3e7b256d2f11d3cacbdfcdf8a208168cd0dd02cbc8f2f893321f977075e83a41  tests/public-contracts/city-finance/02-accounting.ts
1cd3e94184c5fda019b511a945895101b5eb330e532fd4d0c3bca6e400af2ce3  tests/public-contracts/city-finance/03-policy.ts
a9a9860e2e8917f1b5b30e4b79a1ed3be7a0f88a72c37ad63c8a4031eb6c608c  tests/public-contracts/city-finance/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
7a518a4aace93183fd46021d7677d78ed9017dce4bec5c5e234956fa86907088  tests/public-contracts/city-finance/01-setup.ts
3e7b256d2f11d3cacbdfcdf8a208168cd0dd02cbc8f2f893321f977075e83a41  tests/public-contracts/city-finance/02-accounting.ts
1cd3e94184c5fda019b511a945895101b5eb330e532fd4d0c3bca6e400af2ce3  tests/public-contracts/city-finance/03-policy.ts
a9a9860e2e8917f1b5b30e4b79a1ed3be7a0f88a72c37ad63c8a4031eb6c608c  tests/public-contracts/city-finance/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
