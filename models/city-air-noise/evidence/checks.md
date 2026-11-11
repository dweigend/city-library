# Air and Noise Exposure checks

Implementation evidence recorded on 2026-11-10. Only `models/city-air-noise/` and `tests/public-contracts/city-air-noise/` were edited. No branch change, commit, push, dependency installation or shared-file edit was performed by this implementation agent.

## Example-first record

The contract and four numbered executable public scripts were written before `model.ts` or `ui.ts`. The first execution of `bun tests/public-contracts/city-air-noise/01-setup.ts` failed with the expected missing `model.ts` import. Runtime implementation followed. No assertions or expectations in the four scripts were changed after freezing.

## Executed checks

| Command | Result |
| --- | --- |
| `bun tests/public-contracts/city-air-noise/01-setup.ts` | Passed: canonical defaults, stable receptor order, distance attenuation, initial sound, zero exposure, inert reads and zero-step advance. |
| `bun tests/public-contracts/city-air-noise/02-mass-balance.ts` | Passed: hand-calculated minutes 1–3, cumulative mass balance through minute 300, bounded History eviction and ordering. |
| `bun tests/public-contracts/city-air-noise/03-policy.ts` | Passed: zero-traffic intervention, immediate background sound, preserved mass/history, later pollutant removal and cumulative exposure; half-flow logarithmic sound. |
| `bun tests/public-contracts/city-air-noise/04-validation-snapshots.ts` | Passed: invalid setup/actions/steps leave state unchanged, detached frozen observations, independent deterministic instances, zero/full transport and decay. |
| `bun test tests/public-contracts/city-air-noise/behavior.test.ts` | Passed: 3 tests, 120 expectations. Sixteen transport/decay combinations with fractional then maximum flow conserve mass; sound intensity obeys distance scaling; live edits preserve accumulated exposure. |
| `bun run typecheck` (first attempt) | Blocked: `svelte-check` executable missing, exit 127. The coordinator subsequently installed pinned dependencies without a lockfile change. |
| `bunx --no-install tsc --noEmit --pretty false` | Blocked by concurrent `models/city-stormwater/ui.ts:67:1`, TS1005 `'}' expected`. No shared or other-model fix attempted. |
| `bun run typecheck` (after local closure fix and coordinator installation) | Reached Svelte checking. Exit 1: one error, zero warnings, solely the same `city-stormwater/ui.ts:67:1` syntax error. No Air and Noise diagnostics. This is not a whole-workspace pass. |
| `bun run typecheck` (final rerun after documentation) | Passed, exit 0: `svelte-check found 0 errors and 0 warnings`. The concurrent syntax blocker had been resolved. |
| Focused TypeScript 6 compiler API check below | Passed: 8 selected root files and their imported dependency graph, zero diagnostics, strict project options. |
| `git diff --check -- models/city-air-noise tests/public-contracts/city-air-noise` | Exit 0. New files were untracked, so this command alone does not establish content validation. |

The focused compiler check used the existing pinned compiler installed for Agent Lab, without creating a config file:

```sh
bun -e 'import ts from "./ui/agent-lab/node_modules/typescript/lib/typescript.js"; const loaded = ts.readConfigFile("tsconfig.json", ts.sys.readFile); const parsed = ts.parseJsonConfigFileContent(loaded.config, ts.sys, process.cwd()); const files = parsed.fileNames.filter(path => path.includes("/city-air-noise/") || path.endsWith("ui/assets.d.ts")); const program = ts.createProgram(files, parsed.options); const diagnostics = ts.getPreEmitDiagnostics(program); for (const diagnostic of diagnostics) console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")); console.log(`${files.length} selected files; ${diagnostics.length} diagnostics`); process.exitCode = diagnostics.length ? 1 : 0;'
```

An earlier attempt to use the root TypeScript 7 package's compiler API failed because `ts.sys` was unavailable. It did not check types; the TypeScript 6 command above is the executed successful scoped check. The coordinator identified possible-undefined closure references to the initial endpoint fields; these were fixed by capturing the validated return value of a field lookup before defining the step. Frozen assertions remained unchanged, and all four scripts and focused tests were rerun successfully.

## UI evidence and remaining acceptance

Applied the frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and write-docs skills. Loaded web-design-guidelines and fetched its current upstream criteria with read-only `curl` before source review. Source review found a short flat `defineUI(model, spec)` declaration with canonical input validation, explicit public live action, numeric monitors, labeled spatial data, separate chart units and a numeric exposure table. All scientific arithmetic stays headless. Only public shared UI components and `indexedColor` are used; there is no custom Svelte, CSS, renderer or framework lifecycle code.

Real-browser interactions, desktop screenshots at least 1366×768, narrow screenshots at 390×844, light/dark themes and independent screenshot inspection are **pending central coordination**, as explicitly requested to avoid shared browser contention. No browser session was opened, no screenshot captured and no UI acceptance claimed. Pending flows: Setup, single-step and playback, traffic editing to zero and recovery, invalid control feedback, history update, restart, spatial labels/selection, keyboard focus and narrow table/chart overflow. The coordinator must resolve visual findings and run the independent required review before UI acceptance.

Mathematical assertions verify the declared synthetic mechanism. No scientific calibration, real-city comparison, regulatory validation or independent substantial-design approval has been performed.

## Integration notes

The default public-contract runner already discovers the four numbered scripts through `tests/public-contracts/*/[0-9][0-9]-*.ts`; no runner edit is needed. Its `--city` filter currently selects only `city-simulation`, so that restricted command does not include this new group. The additional `behavior.test.ts` is discoverable by Bun's normal tests.

The coordinator owns any desired shared PLAN/model-index entries, integration browser evidence, independent reviews and final workspace checks. No shared API, dependency or host change is required by this model. Reuse and original-source provenance decisions are recorded in [contract.md](../contract.md).

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: trafficVehiclesPerHour=0 produced minute 10 with zero emissions/concentration and 40 dB background sound at all three receptors.

Retained screenshot set: `ui/model-lab/acceptance/screenshots/city-models/city-air-noise-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/model-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/model-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/model-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Three boxes, two point sources and a clipped table (review M2). Eight boxes with two street boxes, live ventilation and receptor distance (`setPolicy`), hotspot and far-end measures, rounded readable table. Revision 1 recorded no pre-implementation hashes (review M3); none are reconstructed. One expected mean was mistranscribed during derivation (6.4448 → 6.4449; exact 6.444853) and corrected before acceptance.

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T17:19:42+00:00. SHA-256 at that moment:

```text
2325420e4d9bd6618fdf50ec13fa7a195b9478622eb2c001688b7e0e46dfbc4d  tests/public-contracts/city-air-noise/01-setup.ts
4cc1964e377b94ae737dbc8e180256c45cbf376fae4a3c38d6715e6bf8873aa0  tests/public-contracts/city-air-noise/02-mass-balance.ts
9aaf25ab00f9f8dd94569576ec4deac864052aa3f939d029442f236403bb1130  tests/public-contracts/city-air-noise/03-policy.ts
e630358f9f3508ba230c2c99ceb131d9f5f75c520a52a1c371a7c1df4f36845c  tests/public-contracts/city-air-noise/04-validation-snapshots.ts
```
Corrections before acceptance: city-air-noise transcription correction before acceptance: vent mean 6.4448->6.4449 (exact 6.444853; calculator had averaged rounded box values)

There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
2325420e4d9bd6618fdf50ec13fa7a195b9478622eb2c001688b7e0e46dfbc4d  tests/public-contracts/city-air-noise/01-setup.ts
4cc1964e377b94ae737dbc8e180256c45cbf376fae4a3c38d6715e6bf8873aa0  tests/public-contracts/city-air-noise/02-mass-balance.ts
55006105a3c465cf41f7b74b211b029de8f8ac6a640459401f3f6b1be2bd079b  tests/public-contracts/city-air-noise/03-policy.ts
e630358f9f3508ba230c2c99ceb131d9f5f75c520a52a1c371a7c1df4f36845c  tests/public-contracts/city-air-noise/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/model-lab/acceptance/city-models/README.md).
