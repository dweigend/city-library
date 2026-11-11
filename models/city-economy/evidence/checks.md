# Urban Employment verification

Executed on 2026-11-10 with Bun 1.4.2 in the shared checkout, on branch `t3/city-simulation-models`, starting from `42a289785ee3c9879800d2dd7e8532d04032a7ab`. Only `models/city-economy/` and `tests/public-contracts/city-economy/` were written. No commit, push, branch change, dependency installation or shared-file edit was performed by this implementation.

## Example-first record

The four public scripts and `contract.md` were written before runtime implementation. Running `bun tests/public-contracts/city-economy/01-setup.ts` at that point failed because `model.ts` did not exist. `tests/public-contracts/city-economy/SHA256SUMS` was recorded before implementation. Assertions were not changed afterward.

## Executed final checks

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-economy/01-setup.ts` | Exit 0; setup/defaults, IDs, initial cash and no-op advancement assertions passed. |
| `bun tests/public-contracts/city-economy/02-monthly-accounting.ts` | Exit 0; exact first two months, matching order, 26-month accounting and workforce shortage assertions passed. |
| `bun tests/public-contracts/city-economy/03-demand-policy.ts` | Exit 0; policy does not advance time, demand contraction/layoffs and recovery assertions passed. |
| `bun tests/public-contracts/city-economy/04-validation-and-snapshots.ts` | Exit 0; invalid values, independent deterministic runs, detached observations and history capacity assertions passed. |
| `sha256sum -c tests/public-contracts/city-economy/SHA256SUMS` | All four frozen scripts OK. |
| `bun test models/city-economy/employment.test.ts` | 6 tests passed, 0 failed, 2,182 expectations. Checks fractional three-firm cash accounting for 240 months, no-consumption dynamics, the job cap, overdrafts, immutable snapshots and wrong primitive values at the live-action boundary. |
| `bun node_modules/typescript/bin/tsc --noEmit -p models/city-economy/evidence/tsconfig.check.json` | Exit 0, no diagnostics. Local selection extends the unchanged root strict configuration and includes this model, UI, behavior test and all four contract scripts. |
| `bun ui/agent-lab/node_modules/svelte-check/bin/svelte-check --tsconfig models/city-economy/evidence/tsconfig.check.json` | Exit 0; 0 errors, 0 warnings. This checks the selected sources and imported shared UI; it is not a whole-workspace pass. |
| `bun -e 'const { ui } = await import("./models/city-economy/ui.ts"); if (ui.title !== "Urban Employment") throw new Error("Unexpected UI title"); console.log("Inert UI import: Urban Employment");'` | Exit 0; UI declaration imports headlessly and returns the expected title without mounting. |
| `bun run typecheck` | Latest executed run failed with 7 errors and 0 warnings in 3 other model files: `models/city-air-noise/model.ts` (possibly undefined first/last fields), `models/city-mobility/model.ts` (Graph creation/state typing), `models/city-stormwater/ui.ts` (missing brace). No `city-economy` diagnostics remained. These files were concurrently being authored and were not edited here. |

The first `bun run typecheck` attempt failed earlier because `svelte-check` was missing. After the coordinator installed pinned dependencies with the lock unchanged, the command reached the unrelated diagnostics recorded above. An earlier root `tsc` attempt also encountered the concurrently incomplete stormwater UI. The local Inspector projection initially inferred incompatible optional undefined properties; its explicit scalar-record return type corrected that owned error. These initial failures are not reported as passes.

## UI source review and pending acceptance

Applied `frontend-design`, `frontend-design-shadcn-svelte`, `shadcn-svelte`, `write-docs` and the follow-up `web-design-guidelines` source review. The latest Vercel review rules were retrieved successfully with:

```sh
curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Source review found no remaining model-owned issue: the declaration uses the existing `defineUI(model, spec)`, labelled network entities, distinct stable household/firm IDs, central `indexedColor` values, numeric monitors, explicit currency/month and count/month chart axes, and a validated live action. All scientific arithmetic stays in `model.ts`; UI only projects observations. No custom Svelte, CSS, DOM, component, dependency or renderer was introduced. Shared components own accessible controls, theme, focus and responsive layout; their browser behavior has not been verified by this source review.

The following remain **pending**, centrally coordinated as requested:

- Real-browser Setup, Step, Run/Pause, live external-demand change and firm/household selection/inspection checks.
- Default month 0/1/2, contraction to zero employment, recovery, workforce-shortage and empty employment-edge states.
- Desktop screenshots at least 1366×768 and narrow screenshots at 390×844, both light and dark themes; check labels, chart units, focus and overflow.
- Independent inspection of the actual screenshots, findings/responses and independent acceptance.
- Required independent substantial-design review and its provider/model availability confirmation.

No browser was opened, no screenshot was captured and no independent reviewer was started by this implementation. UI acceptance remains open. No scientific calibration, comparison with real employment data or real-city forecasting validation is claimed.

## Integration notes

Agent Lab discovers the model folder automatically. The default public-contract runner discovers the four numbered scripts automatically; its existing `--city` filter remains specific to `city-simulation`. No registry or test-runner edit is needed for default discovery. The coordinator still owns any requested catalog/PLAN/documentation updates and overall acceptance.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: externalDemand=0 produced month 10 with zero jobs/employed households and eight unemployed households.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-economy-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

The arithmetic equilibrium settled in two months. Firms now dismiss at once and hire at most `hiringLimit` per month; unserved orders are lost; money changes only by external inflow (`moneyBalanceError`). Defaults: 30 households, 3 firms, spending 0.4 (chosen to keep integer resting points exact; documented), external demand 90.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:01:36+00:00. SHA-256 at that moment:

```text
943787c58b3c977e8061281de04e4737e7329c69ccf7620d82433a3953e503ab  tests/public-contracts/city-economy/01-setup.ts
8fefb9ff2ee5c782f3cdf6601eb4cea90222a041386bbc9c3d5f76ba8c0c481e  tests/public-contracts/city-economy/02-monthly-accounting.ts
c955a540e9e4acc0141032384700047505a06ad76727ac20a26bd8b93e6507e0  tests/public-contracts/city-economy/03-demand-policy.ts
7a199a8f936a2d88e9dfb9b7afded22106b3213429d7232b1219abe64b6444c0  tests/public-contracts/city-economy/04-validation-and-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
943787c58b3c977e8061281de04e4737e7329c69ccf7620d82433a3953e503ab  tests/public-contracts/city-economy/01-setup.ts
8fefb9ff2ee5c782f3cdf6601eb4cea90222a041386bbc9c3d5f76ba8c0c481e  tests/public-contracts/city-economy/02-monthly-accounting.ts
c955a540e9e4acc0141032384700047505a06ad76727ac20a26bd8b93e6507e0  tests/public-contracts/city-economy/03-demand-policy.ts
7a199a8f936a2d88e9dfb9b7afded22106b3213429d7232b1219abe64b6444c0  tests/public-contracts/city-economy/04-validation-and-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
