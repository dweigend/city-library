# Water and Wastewater checks

Executed on 2026-11-10 with Bun 1.4.2. These are author checks, not independent approval or scientific validation.

## Example-first record

The contract and all four complete assertion scripts were written before `model.ts`. Running `bun tests/public-contracts/city-water/01-setup.ts` at that point failed with `Cannot find module '../../../models/city-water/model.ts'`, as expected. No stub was added. The frozen assertions were not edited during implementation.

SHA-256 before implementation, unchanged on subsequent verification:

```text
9b72e2c4b5dc9a9547eef2ebe6df94b3e2b31bdd1d97a7546da1f9de2d169c14  01-setup.ts
2f4776adb49a039d9518ad5c70c3d128a623e346a6bc0a54a86bcfab9ef110a3  02-balance.ts
d727ea97a77b84f3fee1f2ae769e905c0e0f47034a9fb19e2b25b9d6ac8888a4  03-policy.ts
32aae6cc3c295203148bdc715743d0bb94097ac15161cbdc1c09d36e4e02d07b  04-validation-snapshots.ts
```

## Executed checks

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-water/01-setup.ts` | Passed, including final rerun after live validation changes. |
| `bun tests/public-contracts/city-water/02-balance.ts` | Passed: default first days, shortage, spill-before-withdrawal and exact balances. |
| `bun tests/public-contracts/city-water/03-policy.ts` | Passed: live changes affect only future steps. |
| `bun tests/public-contracts/city-water/04-validation-snapshots.ts` | Passed: failures leave state unchanged, deterministic independent runs, detached observations and bounded history. |
| `bun test models/city-water/water-balance.test.ts` | 4 passed, 0 failed, 4020 expectations: full conservation, wastewater fraction boundaries, fractional balance over 800 days with policy change and eviction, invalid live primitive types. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. No local `node_modules/.bin` exists. No dependency, lockfile or config changes made. |
| `sha256sum tests/public-contracts/city-water/*.ts` | Matched the four pre-implementation hashes. |

The runtime checks above do not establish TypeScript/Svelte compilation. The coordinator must restore the shared dependencies and rerun the required typecheck.

## UI source review and pending acceptance

Applied the frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs skills. Read root `components.json`; this model uses existing `defineUI` controls and views and introduces no Svelte component, block, icon, markup, CSS, theme or dependency. Applied web-design-guidelines source review using the rules fetched from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` on the check date. The declaration uses explicit labeled controls, numeric monitors, schematic directed transfers, central indexed colors and bounded time series. No domain calculations live in the UI. No source-level finding remains; this does not establish rendered accessibility or visual acceptance.

Browser interactions and desktop/narrow light/dark screenshots are **pending central coordination**, as requested to avoid contention. No browser was opened and no screenshots were captured here. The coordinator must check setup, single-step and repeated playback, all three live controls, invalid setup, labels/overflow, keyboard focus and network/chart rendering at 1366×768 and 390×844 in both supported themes. An independent reviewer must inspect those actual screenshots; no independent UI/design approval is claimed here.

## Integration needs and limits

Only `models/city-water/` and `tests/public-contracts/city-water/` were changed. No branch, commit, push, shared file or other model was modified. Add these scripts to any explicitly maintained shared public-contract runner and add the model to shared model documentation/catalog metadata where required. Those shared edits belong to the coordinator. No new library export or API is required.

The implementation verifies its synthetic volume mechanism and public actions. It does not validate real city supply, treatment performance, hydraulic behavior or water quality. The diagram is a process schematic, not a physical network solver. Lifetime balance totals remain available after old history samples are evicted.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-water-desktop-light.png`
- `/tmp/city-water-desktop-dark.png`
- `/tmp/city-water-narrow-light.png`
- `/tmp/city-water-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: conservationShare=1 produced day 1 with reservoir 700 m³, no supply/shortage/wastewater and zero balance residual.

Retained screenshot set: `ui/agent-lab/acceptance/screenshots/city-models/city-water-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/agent-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/agent-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/agent-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Constant inflow without a decision. A dry spell (days 21–80), a storage-triggered savings rule (`conservationTrigger`, `setConservationRule`) and season measures (worst-day cut share, saving days). Defaults: 10 000 m³ reservoir, 8000 m³ start, 220/40 m³ inflow. The network view now shows quantities that match its title (review L6).

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:10:02+00:00. SHA-256 at that moment:

```text
3ef30ae0c3ffc7f1b904da4dc0099e10d3b0fba5ec576b1b36ae3bfe4444018b  tests/public-contracts/city-water/01-setup.ts
7f1bad40ce89bcc0d8914a71e03492ad6f1120646c63ad99ca09dcfeff6c072c  tests/public-contracts/city-water/02-balance.ts
77594c7740bd179967aace8ca2ae8b3b37d817e178b35889f4cfb5d4fbed9bf3  tests/public-contracts/city-water/03-policy.ts
c6ee908cd9805d8b9c9356c8fb3db44a4eff31a30e801880a9ced04190badf0f  tests/public-contracts/city-water/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
3ef30ae0c3ffc7f1b904da4dc0099e10d3b0fba5ec576b1b36ae3bfe4444018b  tests/public-contracts/city-water/01-setup.ts
7f1bad40ce89bcc0d8914a71e03492ad6f1120646c63ad99ca09dcfeff6c072c  tests/public-contracts/city-water/02-balance.ts
206cfefe48934cdeddaeff81941ec7a5b55bbb39fb27681fef10daacfe93c081  tests/public-contracts/city-water/03-policy.ts
c6ee908cd9805d8b9c9356c8fb3db44a4eff31a30e801880a9ced04190badf0f  tests/public-contracts/city-water/04-validation-snapshots.ts
```

### Saving-day correction after the revision-2 visual review (L-WAT1)

The independent visual review found that the default rule (trigger 1, share 0) reported 80 saving days and "Below savings trigger: Yes" although no demand was cut. Decision, recorded before the runtime edit: a saving day is a day on which the rule requests a positive cut (`conservationShare > 0` and storage below the trigger). Volumes, requests and all earlier assertions are unchanged; only the status count and `isSavingTomorrow` change for share 0. The new baseline assertions were added to `03-policy.ts` first and failed against the previous runtime (`conservationDayCount` 120, expected 0) at 2026-11-10T18:25Z; after the one-line rule change all four scripts and `water-balance.test.ts` pass. This change postdates the approved Gemini mechanism review and needs its own targeted independent recheck.

```text
77594c7740bd179967aace8ca2ae8b3b37d817e178b35889f4cfb5d4fbed9bf3  tests/public-contracts/city-water/03-policy.ts (before)
206cfefe48934cdeddaeff81941ec7a5b55bbb39fb27681fef10daacfe93c081  tests/public-contracts/city-water/03-policy.ts (current)
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/agent-lab/acceptance/city-models/README.md).
