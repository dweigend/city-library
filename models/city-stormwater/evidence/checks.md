# Urban Stormwater checks

Executed on 2026-11-10 with Bun 1.4.2 in the shared checkout, branch `t3/city-simulation-models`, source baseline `42a289785ee3c9879800d2dd7e8532d04032a7ab`. Only `models/city-stormwater/` and `tests/public-contracts/city-stormwater/` were written. No branch changes, commits, pushes, shared-file edits or dependency installation.

## Executed checks

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-stormwater/01-setup.ts` | Pass, exit 0. Defaults, two plot identities/areas, empty balance and zero-step identity. |
| `bun tests/public-contracts/city-stormwater/02-conservation.ts` | Pass, exit 0. Hand-calculated first two hours, cumulative conservation through hour 502, bounded history. |
| `bun tests/public-contracts/city-stormwater/03-policy.ts` | Pass, exit 0. Live infiltration reduces overflow; dry weather empties the basin in four hours. |
| `bun tests/public-contracts/city-stormwater/04-validation-snapshots.ts` | Pass, exit 0. Rejected values/counts, unchanged state on validation failure, deterministic batching, independent instances and snapshots, zero-capacity case. |
| `bun test models/city-stormwater/stormwater.test.ts` | Pass: 4 tests, 0 failures, 3014 expectations. Direct nested observation edits, rain-limited infiltration, dry/pass-through boundaries and 1,000 fractional alternating-policy steps. |
| `bun run typecheck` | Blocked, exit 127: `/usr/bin/bash: line 1: svelte-check: command not found`. No `node_modules/.bin` in this checkout at check time. No successful TypeScript/Svelte check is claimed. Coordinator must provision existing dependencies and rerun. |
| `sha256sum tests/public-contracts/city-stormwater/*.ts` | Matches the pre-runtime freeze hashes below. |

## Frozen public scripts

The scripts and `contract.md` preceded runtime implementation. The assertions were not edited after freezing.

```text
3aa99834f8daf92c321c4abb772094bde6232ba008d62bf0ebcdb9523aebf609  01-setup.ts
87716378b94993fb84b95991a8c43ac9ba89863c81ac611145abcc2b838e4596  02-conservation.ts
b2f620d0eec90a73ad85ed43d77a42cee6b6e23f8ea4349e7691100677d23b2e  03-policy.ts
e8f85d5b370b5b4d5911d0bb47c6395c9e0ae5616e51afc8dc63e3f2712c0248  04-validation-snapshots.ts
```

## UI source review and pending evidence

Applied frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs. Loaded web-design-guidelines and fetched the current Vercel rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` for source QA. `ui.ts` uses only shared defineUI, explicit live setters, numeric monitors with display-only formatting, a schematic spatial projection, model-owned history and central indexed colors. No custom component, styling, DOM access or numerical hydrology occurs in the UI. Empty storage omits the water glyph. Labels, position and text distinguish quantities in addition to color.

Source QA is not browser verification or accessibility acceptance. Per the assigned central-browser coordination, no browser was opened and no screenshot/review was fabricated. Pending centrally:

- Setup, step, run/pause and restart; default hour 1/hour 2 readings.
- Live rain/infiltration control edits; four dry hours after the policy intervention; invalid value feedback and unchanged model state.
- Capacity/outlet setup changes, including zero capacity.
- Desktop ≥1366×768 and narrow 390×844 in light and dark themes; screenshot inspection for labels, clipping, charts, focus and contrast.
- Independent screenshot inspection and required independent substantial design review, findings and responses recorded separately from approval.

## Integration notes and limits

The public script runner already discovers `tests/public-contracts/*/[0-9][0-9]-*.ts`; no runner edit is needed for these files. Coordinator owns any requested shared catalog/PLAN/models-index documentation updates and dependency provisioning. This model remains independent of all other new city models.

The tests establish this synthetic hourly mechanism, not hydrological calibration, pipe hydraulics, flood mapping or engineering validity. No package/API expansion or external consumer compatibility claim is made. No external scientific source is used as evidence for these illustrative parameters.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-stormwater-desktop-light.png`
- `/tmp/city-stormwater-desktop-dark.png`
- `/tmp/city-stormwater-narrow-light.png`
- `/tmp/city-stormwater-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

Coordinator restored a missing final closing brace in `ui.ts`. Browser loading and step checks above use the corrected file.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: rainMmPerHour=0 produced hour 1 with zero rain-related infiltration, storage, overflow and balance error.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-stormwater-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Constant rain on 100 m² plots with unlimited infiltration. Storm pulses (`stormPattern` single/double), a 20 mm soil store with declining infiltration and percolation, 2000 m² plots, basin 60 m³ and outlet 4 m³/h. The balance includes soil storage and percolation. Labels no longer overlap at 390 px (review L7).

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:13:15+00:00. SHA-256 at that moment:

```text
3e26e33bad8a92a1b38d18b97e0b46b33e6b572705fa6b7d86dc73dd402001f9  tests/public-contracts/city-stormwater/01-setup.ts
c5319854a3a5629b96620350d006abab0adcf0f3ddc7b3f4ad366e529547a3fa  tests/public-contracts/city-stormwater/02-conservation.ts
7b8543e5428022cc9f9f137a3332e6f0bdf71fd6002667ed0f7cf1b046e6d836  tests/public-contracts/city-stormwater/03-policy.ts
afe7feede18f4ae09a2cbb85f3a10bf2e15161ed533a2a1d4354e90b7a6279ce  tests/public-contracts/city-stormwater/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
3e26e33bad8a92a1b38d18b97e0b46b33e6b572705fa6b7d86dc73dd402001f9  tests/public-contracts/city-stormwater/01-setup.ts
c5319854a3a5629b96620350d006abab0adcf0f3ddc7b3f4ad366e529547a3fa  tests/public-contracts/city-stormwater/02-conservation.ts
7b8543e5428022cc9f9f137a3332e6f0bdf71fd6002667ed0f7cf1b046e6d836  tests/public-contracts/city-stormwater/03-policy.ts
afe7feede18f4ae09a2cbb85f3a10bf2e15161ed533a2a1d4354e90b7a6279ce  tests/public-contracts/city-stormwater/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
