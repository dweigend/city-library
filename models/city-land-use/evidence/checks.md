# Executed checks

Implementation checks ran on 2026-11-10 with Bun 1.4.2 in the shared checkout. The four assertion scripts and their expected results were written before model.ts and were not changed afterward; their hashes are recorded in [contract.md](../contract.md).

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-land-use/01-setup.ts` | Passed: defaults, identities, initial uses/protection, setup history and area. |
| `bun tests/public-contracts/city-land-use/02-conservation.ts` | Passed: hand-calculated first two years, stable allocation, 202-year clock, bounded history and area conservation. |
| `bun tests/public-contracts/city-land-use/03-policy.ts` | Passed: protected land leaves explicit unmet demand; release and restoration work without action-driven time/history changes. |
| `bun tests/public-contracts/city-land-use/04-validation-snapshots.ts` | Passed: rejected inputs/steps, atomic failure, independent instances, identical deterministic trajectories, frozen detached snapshots and zero-step behavior. |
| `bun test models/city-land-use/behavior.test.ts` | Passed: 4 tests, 687 expectations; all 91 demand pairs, zero budget, protection of developed land, unknown/accessor rejection. |
| `sha256sum tests/public-contracts/city-land-use/*.ts` | All four hashes unchanged from the pre-runtime freeze. |
| `bun run typecheck` | Blocked, exit 127: `svelte-check: command not found`. `node_modules/.bin` does not exist. No typecheck pass claimed. Dependencies were not installed or edited within this isolated ownership scope. |

## UI review status

Source review used frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines. Current Vercel rules were retrieved successfully from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. The declaration uses only shared views, descriptor-driven inputs, central indexed colors, a selected-parcel action and an inspector; there are no custom components, DOM handlers, CSS or scientific calculations in ui.ts. Use labels and a P marker supplement color. Source review found no local issue; it is not browser acceptance.

Real-browser interaction checks, desktop (at least 1366×768) and narrow (390×844) light/dark screenshots, and independent screenshot inspection are **pending central coordination**, as explicitly assigned. No browser was opened and no screenshot review or independent design/implementation approval is claimed. Check setup, two yearly steps, both live targets, invalid combined demand, selection/protection/release, chart update and narrow label readability. Fix any findings before UI acceptance. The required independent reviews remain pending with the coordinator.

## Integration notes

Only `models/city-land-use/` and `tests/public-contracts/city-land-use/` were written. No shared runner, catalog, library, package, config, lockfile, PLAN or models README was changed; no commit, push or branch change was performed. The coordinator must register the four public scripts in any explicit shared runner/list, update shared model inventory/PLAN as needed, restore the pinned development dependencies, rerun typecheck and complete central browser/review gates. Dynamic Lab discovery should use the existing model.ts/ui.ts entry convention; no model-specific host API is required.

These checks establish the stated synthetic mechanism, not comprehensive scientific validation or real-city prediction. The finite map is schematic, the update order is deterministic and demand is exogenous.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-land-use-desktop-light.png`
- `/tmp/city-land-use-desktop-dark.png`
- `/tmp/city-land-use-narrow-light.png`
- `/tmp/city-land-use-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: residentialDemand=0 advanced one year with two conversions. Keyboard Home selected parcel:0; Toggle parcel protection increased protected area from 2 to 3 ha without advancing time, and the inspector showed Protected. Run then Pause returned to Paused.

Retained screenshot set: `ui/agent-lab/acceptance/screenshots/city-models/city-land-use-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/agent-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/agent-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/agent-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

The 4 × 3 demand allocator took the first surplus parcel, so arrangement carried no meaning, and two area lines overlapped (review L7). The grid becomes 8 × 6; a face-neighbor score with `compact`/`dispersed` growth chooses parcels; new action `applyProtectionPlan` (corridor versus scattered, equal area) and green-patch/urban-edge measures. Defaults and all values change; `setDemand` keeps its name with the shared live-change rule.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T16:47:33+00:00. SHA-256 at that moment:

```text
ba3422ca32e4d995de96c1d71b3b44b3edbcfb7564a805bcb7224bf3fdc2f6a4  tests/public-contracts/city-land-use/01-setup.ts
3650002bb3b3e2a26bf20eda7185c46ca11a3991a286eb64c2e9e59aa00e4327  tests/public-contracts/city-land-use/02-conservation.ts
fa301bbac9ebcd10c723fdb9e4bc9453dedb83414fbea7b80b5e05d5dc6496ec  tests/public-contracts/city-land-use/03-policy.ts
9345eed21d8063dfbfbdaa6afc6e0a7d4e704568f82f68e7f2edc32219897a4d  tests/public-contracts/city-land-use/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
ba3422ca32e4d995de96c1d71b3b44b3edbcfb7564a805bcb7224bf3fdc2f6a4  tests/public-contracts/city-land-use/01-setup.ts
3650002bb3b3e2a26bf20eda7185c46ca11a3991a286eb64c2e9e59aa00e4327  tests/public-contracts/city-land-use/02-conservation.ts
fa301bbac9ebcd10c723fdb9e4bc9453dedb83414fbea7b80b5e05d5dc6496ec  tests/public-contracts/city-land-use/03-policy.ts
9345eed21d8063dfbfbdaa6afc6e0a7d4e704568f82f68e7f2edc32219897a4d  tests/public-contracts/city-land-use/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/agent-lab/acceptance/city-models/README.md).
