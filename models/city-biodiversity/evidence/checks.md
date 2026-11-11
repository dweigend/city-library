# Verification evidence

Checked on 2026-11-10 with Bun 1.4.2 in the shared checkout at base revision `42a289785ee3c9879800d2dd7e8532d04032a7ab`, branch `t3/city-simulation-models`.

## Example-first record

The contract and all four public assertion scripts were written before model.ts or ui.ts. The initial command `bun tests/public-contracts/city-biodiversity/01-setup.ts` reported `Cannot find module '../../../models/city-biodiversity/model.ts'`, as expected before implementation. No placeholder runtime was created. The scripts were not changed after freezing.

Frozen SHA-256 digests, rechecked after implementation:

```text
44564cd375a42570945f073d3d63e2c5b5d7be29480bc096dd5a76a3e7488ce6  01-setup.ts
88ba7ec6d8b9535c7cb5cb9911f2923d5afd987e5b852071a2b6c2e13e1f02d5  02-first-steps.ts
3c60046ebd00c0820a1b13199e8e1e66c505b8635a170f71cd6454b526000b5c  03-policy.ts
d9d275e1648b3dc66c22a4b0e1938a9cc07e9f86bf3250c70a1916352d88e874  04-validation-snapshots.ts
```

## Executed checks

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-biodiversity/01-setup.ts` | Passed: canonical defaults, fixed graph, initial occupancy, year-zero history, zero steps |
| `bun tests/public-contracts/city-biodiversity/02-first-steps.ts` | Passed: synchronous hand-calculated years 1–2, flux totals and occupancy balance |
| `bun tests/public-contracts/city-biodiversity/03-policy.ts` | Passed: quality restoration, corridor isolation/reopening, live action time/history semantics |
| `bun tests/public-contracts/city-biodiversity/04-validation-snapshots.ts` | Passed: validation, action failure preservation, batch/single-step equality, independent instances, frozen detached snapshots, history bound, empty landscape |
| `bun test models/city-biodiversity/behavior.test.ts` | Passed: 2 tests, 21,609 expectations. Includes 72 parameter combinations over 30 years, bounded finite occupancies, demographic balance and live intervention/history retention |
| `bun run typecheck` | Blocked, exit 127: `svelte-check: command not found` from the shared `ui/agent-lab` check script. No local `node_modules/.bin` exists. No dependency or configuration changes were made. |
| `sha256sum tests/public-contracts/city-biodiversity/*.ts` | All four digests match the pre-implementation freeze |
| `git diff --check -- models/city-biodiversity tests/public-contracts/city-biodiversity` | No tracked whitespace errors; these new files are untracked. Separate `git diff --no-index --check /dev/null` checks on model.ts and ui.ts emitted no whitespace findings. |

The normal public-contract runner discovers `tests/public-contracts/*/[0-9][0-9]-*.ts`; no runner edit is needed. The full runner, full build and package consumer were not run. This slice adds no package export or dependency.

## Source review and UI limits

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs. Inspected the root components.json and existing shared components. This UI is a flat declaration for the existing host, so no new page layout, component, block, styling or icon is composed.

Applied web-design-guidelines source review to ui.ts after implementation. Retrieved the current review criteria successfully with `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. The source uses named controls/monitors/views, fixed indexed scientific colors, numeric labels in addition to color, stable entity IDs, numeric model-owned measurements and model-owned historical samples. No DOM, lifecycle wiring, scientific state duplication, custom CSS, local theme or custom renderer is introduced. No source-level finding remains from this limited review; it does not establish rendered behavior, contrast or accessibility.

Real-browser setup, stepping, playback, both live controls, network selection/inspector and chart updates are **pending central coordination**. Desktop (at least 1366×768) and narrow (390×844) screenshots in light/dark themes, actual screenshot inspection, independent screenshot review and substantial independent review are **pending**. No browser was opened and no UI acceptance is claimed. This follows the assigned shared-browser coordination boundary, not an asserted browser-tool failure.

## Integration and limitations

Only `models/city-biodiversity/` and `tests/public-contracts/city-biodiversity/` were changed. No shared files, branch, commits or pushes were changed. Concurrent model directories were preserved.

Coordinator follow-up: restore/install the shared pinned development dependencies and rerun `bun run typecheck`; add this model to the shared models README and any explicit catalog list if required; reconcile shared PLAN/evidence; complete the centrally coordinated browser and independent review gates. Contract scripts are already discoverable by the existing full public-contract glob.

This verifies an original, synthetic one-species expected-occupancy mechanism. It does not validate an ecological forecast, a species-specific dispersal kernel or a real urban habitat policy. Quality is uniform, patches are equal-area, topology is fixed, and no animal/migrant counts or other new models are coupled to it.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-biodiversity-desktop-light.png`
- `/tmp/city-biodiversity-desktop-dark.png`
- `/tmp/city-biodiversity-narrow-light.png`
- `/tmp/city-biodiversity-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: permeability=0 produced year 1 with zero colonization, mean occupancy 0.300 and extinction loss 0.100.

Retained screenshot set: `ui/agent-lab/acceptance/screenshots/city-models/city-biodiversity-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/agent-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/agent-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/agent-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Three patches in a chain with global quality. Seven heterogeneous patches with area-dependent extinction, distance-kernel colonization, a restoration plan (`stepping-stone`/`enlarge-east`) and `setPatchHabitat`. Graph is no longer used. `setPermeability(undefined)` now throws instead of resetting to 1 (review L1).

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:23:28+00:00. SHA-256 at that moment:

```text
06fd9e53d3c7ee743c66ef99720e4aac4511c613779497301915a7569aaded92  tests/public-contracts/city-biodiversity/01-setup.ts
2f2187ffed7452b44b3d6412351498fe8750d7c2bb64664076c9383c3d8e883d  tests/public-contracts/city-biodiversity/02-first-steps.ts
1694192cb3c866a089386041dbfc0c519b1516cf9558c2143acf204b9d5274b3  tests/public-contracts/city-biodiversity/03-policy.ts
005ba877bc8e085a626321dbe27572aba5e270d0826bcaaecacaccd04d35d9a5  tests/public-contracts/city-biodiversity/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
06fd9e53d3c7ee743c66ef99720e4aac4511c613779497301915a7569aaded92  tests/public-contracts/city-biodiversity/01-setup.ts
2f2187ffed7452b44b3d6412351498fe8750d7c2bb64664076c9383c3d8e883d  tests/public-contracts/city-biodiversity/02-first-steps.ts
1694192cb3c866a089386041dbfc0c519b1516cf9558c2143acf204b9d5274b3  tests/public-contracts/city-biodiversity/03-policy.ts
005ba877bc8e085a626321dbe27572aba5e270d0826bcaaecacaccd04d35d9a5  tests/public-contracts/city-biodiversity/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/agent-lab/acceptance/city-models/README.md).
