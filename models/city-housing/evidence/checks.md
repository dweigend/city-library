# Housing Market checks

Checked on 2026-11-10 with Bun 1.4.2. Base revision: `42a289785ee3c9879800d2dd7e8532d04032a7ab`. Only `models/city-housing/` and `tests/public-contracts/city-housing/` were changed. No dependencies, shared files, branches or commits were changed.

## Example-first record

The contract and all four public scripts were written before `model.ts` and `ui.ts`. The initial command `bun tests/public-contracts/city-housing/01-setup.ts` failed as expected because `models/city-housing/model.ts` did not exist. No mock or runtime stub was supplied. The remaining scripts were also present and frozen at that point; they were not separately executed while the module was absent.

SHA-256 hashes captured before implementation and confirmed unchanged after implementation:

| Script | SHA-256 |
| --- | --- |
| 01-setup.ts | `9b84cf7527998f90c73bfd9fa1cf719d5752d02d25954901749224f530d730d8` |
| 02-first-steps.ts | `8ef0d95982b1789d7b27abfc0965daa9a311cdcace2736f782d1736b6731ee97` |
| 03-policy.ts | `f5f18c74e230b743b73578e4857778652a6d2c2955641d6ec87635101e099d27` |
| 04-validation-snapshots.ts | `f8b00d2656e6a6ad9c8b5bdd93a1953c8fe780c6ea625e212a449c2cc4d966af` |

The runtime was implemented against these assertions. No assertion or public-script syntax changed. The prose invariant was clarified to say that an allowance withdrawal changes bids immediately but displaces incumbents at the next monthly step, consistent with the frozen action ordering. The additional focused test covers that case.

## Executed checks

| Command | Result |
| --- | --- |
| `for script in tests/public-contracts/city-housing/*.ts; do bun "$script" || exit; done` | Passed all four scripts, exit 0. Covers exact setup, hand calculations, 240 further months of conservation, housing allowance, construction bounds, rejected inputs, independent deterministic runs and detached frozen observations. |
| `bun test models/city-housing/housing.test.ts` | Passed 5 tests, 27 expectations, 0 failures. Covers rent floor/ceiling, excess supply, stock ceiling, construction lag, allowance withdrawal and invalid action types/accessor setup records. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. No dependency installation attempted because package/dependency changes are outside the assigned scope. |
| `bun node_modules/typescript/bin/tsc --noEmit --pretty false` | Failed, exit 1: `models/city-stormwater/ui.ts(67,1): error TS1005: '}' expected.` This was a concurrently edited file outside the assigned scope at the time of this check; no change made there. This result does not establish a persistent defect in that other model. |
| `bun node_modules/typescript/bin/tsc --project models/city-housing/.typecheck.json --pretty false` | Passed, exit 0, using a transient configuration extending `../../tsconfig.json`, `include: []`, `exclude: []` and explicit files `model.ts`, `ui.ts`, `housing.test.ts` plus the four public scripts. The configuration was created and removed by a `bun -e` wrapper; all project strict settings and imported dependencies remained in force. This TypeScript check does not replace Svelte checking or rendered verification. |
| `sha256sum tests/public-contracts/city-housing/*.ts` | Matches the four preimplementation hashes above. |
| `git diff --check -- models/city-housing tests/public-contracts/city-housing` | Exit 0; files are new/untracked, so this Git check does not inspect their full contents. |

No shared test-runner registration was added. The coordinator must include these scripts in the appropriate shared contract runner/catalog documentation if automatic discovery there does not already cover them. There is no new package entry to verify with a packed consumer.

## UI source review and pending acceptance

Applied the frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs skills. Read the web-design-guidelines skill for source QA and fetched its current Vercel criteria from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. The official shadcn-svelte blocks index was retrieved successfully; this change adds no page layout or component and reuses the existing Agent Lab workbench.

Source inspection of `ui.ts` found no model-specific DOM, styling, literal colors, timers, duplicated domain formulas or direct state mutation. The live field explicitly calls `setHousingAllowance`. Monitors preserve numeric values and format only their display. A collection diagram preserves actual household identities and home assignments; its positions carry no geographic meaning. Empty home rows and both categories of unmet demand remain present. Charts use model-owned History. Scientific colors come from indexedColor. This is author source inspection, not independent approval or a rendered accessibility claim.

Per the assigned shared-browser coordination, no browser was opened and no separate reviewer was started. These remain pending centrally:

- Real-browser setup, Step/Run/Pause, live allowance edits, invalid values, household selection and inspector state.
- Desktop at least 1366×768 and narrow 390×844 screenshots in both light and dark themes, including unmet demand/displacement and the allowance intervention.
- Screenshot inspection for labels, contrast, scaling, overflow, controls, keyboard focus and the larger supported collection sizes.
- Independent screenshot review and any required independent substantial design/transfer review, with findings and responses recorded separately.
- Successful repository Svelte/typecheck and integration gates after the environment and concurrent work settle.

No screenshot paths or browser passes are claimed. UI acceptance is open.

## Interpretation limits

The tests establish the documented synthetic mechanism and bounded invariants. They do not validate a real housing market, causal rent response, welfare effects, fiscal affordability of allowances or development finance. No random process, demographic change, cross-model coupling or geographical housing supply is implemented. The developer rule can construct homes for households whose bids remain below rent; this is explicit in the contract and visible through vacancies and unhoused demand.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: housingAllowance=1000 produced month 10 with all four households housed and no unmet housing demand.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-housing-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Four households and three homes converged in two months and the count diagram drew no status colors (review L4, M2). The market now has 24 income-ranked households in three income groups, a means-tested allowance for the low group, vacancy-driven rent around a 5 % target, displacement, and a three-month construction pipeline with the new action `commissionHomes`. Status `unhoused` becomes `searching`; `builtThisStepCount` becomes started/completed counts. All defaults and exact values change.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T16:43:08+00:00. SHA-256 at that moment:

```text
e0169b5b203215d16f4eefa5b953fa21033f2e6e5815d2b4d2f490927ee3fe01  tests/public-contracts/city-housing/01-setup.ts
56ecb8ec5e992f3d5857b4342c3b2263d67ecb2780a6ac9c081d54d62b3be447  tests/public-contracts/city-housing/02-first-steps.ts
01880615eff6bfcea83c900f4729bb3c2adde827c2c13c6d444f8fd0838f0707  tests/public-contracts/city-housing/03-policy.ts
0c19e70e7a393f3a13ed777bd7054cc429c49a35399f594157d0bd23a1559c7c  tests/public-contracts/city-housing/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
e0169b5b203215d16f4eefa5b953fa21033f2e6e5815d2b4d2f490927ee3fe01  tests/public-contracts/city-housing/01-setup.ts
56ecb8ec5e992f3d5857b4342c3b2263d67ecb2780a6ac9c081d54d62b3be447  tests/public-contracts/city-housing/02-first-steps.ts
01880615eff6bfcea83c900f4729bb3c2adde827c2c13c6d444f8fd0838f0707  tests/public-contracts/city-housing/03-policy.ts
0c19e70e7a393f3a13ed777bd7054cc429c49a35399f594157d0bd23a1559c7c  tests/public-contracts/city-housing/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
