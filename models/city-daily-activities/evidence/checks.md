# Daily Activities checks

Executed on 2026-11-10 in the shared checkout, based on revision `42a289785ee3c9879800d2dd7e8532d04032a7ab`, with Bun 1.4.2. Only `models/city-daily-activities/` and `tests/public-contracts/city-daily-activities/` were written. No branch change, commit, push, dependency installation or shared-file edit was performed.

## Frozen examples

The four scripts and `contract.md` were written before `model.ts`. `SHA256SUMS` was generated before runtime implementation. The initial command `bun tests/public-contracts/city-daily-activities/01-setup.ts` exited 1 because the model module did not yet exist. No assertion was edited after freezing.

After implementation, these commands each exited 0:

```sh
bun tests/public-contracts/city-daily-activities/01-setup.ts
bun tests/public-contracts/city-daily-activities/02-hours-and-trips.ts
bun tests/public-contracts/city-daily-activities/03-policy.ts
bun tests/public-contracts/city-daily-activities/04-validation-and-snapshots.ts
sha256sum -c tests/public-contracts/city-daily-activities/SHA256SUMS
bun test models/city-daily-activities/model.test.ts
```

The focused test run reported 3 passes, 0 failures and 1,751 expectations. It covers next-hour return from work under a live policy change, hourly occupancy/time conservation over 192 hours for 1, 2 and 50 households under repeated policy changes, bounded history retention, external snapshot mutation and rejected nonboolean actions including `undefined`.

## Type checks

`bun run typecheck` exited 127. The configured Svelte check could not start: `/usr/bin/bash: line 1: svelte-check: command not found`. This checkout has no `node_modules/.bin`. Dependencies were not installed because shared dependency/configuration work is outside this model's ownership.

A separate headless check exited 0 using global TypeScript 7.0.2 and existing Bun type declarations from the main project checkout. It checked `model.ts`, `model.test.ts` and all four frozen public scripts under the repository's strict compiler settings. It did **not** check `ui.ts` or Svelte. The exact command was:

```sh
python3 - <<'PY'
import json, pathlib, subprocess, tempfile
root = pathlib.Path.cwd()
files = [root / 'models/city-daily-activities/model.ts', root / 'models/city-daily-activities/model.test.ts', *sorted(root.glob('tests/public-contracts/city-daily-activities/*.ts'))]
config = {'extends': str(root / 'tsconfig.json'), 'compilerOptions': {'types': ['bun'], 'typeRoots': ['/home/david/Projekte/city-library/node_modules/@types']}, 'files': [str(path) for path in files], 'include': [], 'exclude': []}
with tempfile.TemporaryDirectory(prefix='daily-activities-typecheck-') as directory:
    path = pathlib.Path(directory) / 'tsconfig.json'
    path.write_text(json.dumps(config))
    result = subprocess.run(['tsc', '--project', str(path)])
    raise SystemExit(result.returncode)
PY
```

`git diff --check` exited 0 for tracked changes; these new model files were still untracked, so that command alone does not establish their whitespace status. The four frozen-script hashes were checked successfully again after implementation.

## UI source review and pending acceptance

Read the frontend-design, frontend-design-shadcn-svelte, shadcn-svelte, write-docs and web-design-guidelines skills. Retrieved current Web Interface Guidelines with:

```sh
curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Source inspection of `ui.ts` found no custom DOM, CSS, framework wiring, duplicated scientific rules or direct observation writes. Controls use canonical input descriptors and an explicit public action. Views use existing `defineUI` network/line/bar contracts and the central indexed palette. No shared components were introduced; host layout, focus, accessibility and theme behavior remain unverified here. This is source evidence only.

Per the assigned coordination boundary, no browser was opened and no independent reviewer was started. Pending central checks:

- Install/resolve the existing toolchain and rerun `bun run typecheck`, including this model's UI declaration.
- Open Daily Activities; Setup, Step, Run/Pause and change Remote work before the commute and during a work visit. Verify observations and time series refresh.
- Capture and inspect desktop (at least 1366×768) and narrow (390×844) screenshots in supported light/dark themes. Check network/chart readability, overflow, keyboard focus and live-control behavior.
- Have an independent reviewer inspect the actual screenshots, resolve findings and record independent approval separately.

No browser compatibility, visual acceptance, independent approval or empirical scientific validation is claimed.

## Coordinator integration

Register the four scripts in the shared public-contract runner if explicit registration is required, and add the model's catalog/documentation entry in the shared `models/README.md`/PLAN as appropriate. Those files were deliberately not edited. The model has no new library API or dependency and does not couple to another new model.

## Coordinator verification, 2026-11-10

Pinned dependencies are now installed with `bun install --frozen-lockfile`; the earlier missing-svelte-check blocker is resolved. The central typecheck is being rerun against concurrent model work; no pass is claimed here.

Real Playwright Chromium opened this model, clicked Setup, 1 step and 10 steps, and observed tick 11 with rendered results. Captured full-page screenshots at 1366×768 and 390×844 using light/dark media preferences:

- `/tmp/city-daily-activities-desktop-light.png`
- `/tmp/city-daily-activities-desktop-dark.png`
- `/tmp/city-daily-activities-narrow-light.png`
- `/tmp/city-daily-activities-narrow-dark.png`

Independent screenshot review is running. Live-policy interaction checks and final acceptance remain pending.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: Remote Work checked before departure produced hour 10, two completed trips, zero work person-hours and 40 accounted person-hours.

Retained screenshot set: `ui/agent-lab/acceptance/screenshots/city-models/city-daily-activities-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/agent-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/agent-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/agent-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

One-hour steps with direct trips counted travel but no constraints. Steps are now 15 minutes with distance-based travel times, opening hours, missed errands, interpolated positions and new live inputs `servicesLocation` and `servicesCloseHour` (`setServicePolicy`). Defaults: six households in three neighborhoods. Revision-1 trip and hour values no longer apply.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T16:50:27+00:00. SHA-256 at that moment:

```text
dfaea02cc8ed3e02c7ed998188921da23c9694c02f51497252a06b0d7e779653  tests/public-contracts/city-daily-activities/01-setup.ts
82257438ba044957c07dd108668a1796a14c0fe7f92edd431f125b9d5b49a08c  tests/public-contracts/city-daily-activities/02-hours-and-trips.ts
979f2a04eb327d40100e75d3eeda0a5483cdac695ebd42a430962e01b913f2b0  tests/public-contracts/city-daily-activities/03-policy.ts
f0e936ee3b470653c59898dbcd8563f3b9eb473f19999a77674ae75e50fe8b40  tests/public-contracts/city-daily-activities/04-validation-and-snapshots.ts
```
Corrections before acceptance: city-daily-activities 04 edited pre-runtime (try/catch around snapshot mutation) 2026-11-10T16:50:37+00:00

There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
dfaea02cc8ed3e02c7ed998188921da23c9694c02f51497252a06b0d7e779653  tests/public-contracts/city-daily-activities/01-setup.ts
82257438ba044957c07dd108668a1796a14c0fe7f92edd431f125b9d5b49a08c  tests/public-contracts/city-daily-activities/02-hours-and-trips.ts
979f2a04eb327d40100e75d3eeda0a5483cdac695ebd42a430962e01b913f2b0  tests/public-contracts/city-daily-activities/03-policy.ts
4e98115419b4ba168b655613e2d7e9a229a790858be89b668a2df4c4395206ae  tests/public-contracts/city-daily-activities/04-validation-and-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/agent-lab/acceptance/city-models/README.md).
