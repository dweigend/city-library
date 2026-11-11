# Population and Households verification

Executed on 2026-11-10 with Bun 1.4.2 in the shared checkout, base revision `42a289785ee3c9879800d2dd7e8532d04032a7ab`, branch `t3/city-simulation-models`. Only `models/city-population/` and `tests/public-contracts/city-population/` were written. No branch, commit, push, shared configuration or dependency changes were made.

## Example-first record

The four assertion scripts and `contract.md` were written before `model.ts` or `ui.ts`. Initial command `bun tests/public-contracts/city-population/01-setup.ts` exited 1 because the model module did not exist. Before runtime work, the equivalent setup-household assertion expression `334 - 300` was simplified to `34`; no expectation changed. These are the pre-runtime SHA-256 hashes, unchanged after implementation:

```text
1dbcd37164c2448f9a81539215c3eac06162a943a8b1463c0edb52183d182c98  01-setup.ts
ee696e5fd34a038a35b3d4f4675ef06c56aba1010e2a9499ef3fde660db81527  02-conservation.ts
771251c9815f7dee6953c7237b1ad205c9728916f5eb337f5df5cb36bbcb54ec  03-policy.ts
20cb73c3734d022ae1d0033a837dd58d851f574791dda5759b61b6f6494b803c  04-validation-snapshots.ts
```

## Executed checks

| Command | Actual result |
| --- | --- |
| `bun tests/public-contracts/city-population/01-setup.ts` | Passed after implementation: defaults, cohorts, household packing, zero setup flows. |
| `bun tests/public-contracts/city-population/02-conservation.ts` | Passed: exact first two years and 200 further annual cohort/population/household accounting assertions. |
| `bun tests/public-contracts/city-population/03-policy.ts` | Passed: bounded negative/positive migration, oldest-first removal, complete emigration, next-year household-size policy. |
| `bun tests/public-contracts/city-population/04-validation-snapshots.ts` | Passed: rejected inputs/actions/step counts, failed-policy atomicity, batched versus individual deterministic advancement, independent observations. |
| `bun test models/city-population/population.test.ts` | Passed: 6 tests, 51 expectations, 0 failures. Covers open oldest cohort, newborn mortality ordering, empty state, initial remainder, all household sizes, policy accessors, snapshot independence and 120-sample retention. |
| `bun run typecheck` | Blocked, exit 127: `svelte-check: command not found`. The checkout has no `node_modules/.bin`; no dependencies were installed or modified. No TypeScript/Svelte pass is claimed. |
| `bun build models/city-population/model.ts --target browser --outfile /dev/null` | Passed: 90 bundled modules. Checks parsing/public import resolution and browser-target bundling, not static types. |
| `bun build models/city-population/ui.ts --target browser --external svelte --external '*.svelte' --outfile /dev/null` | Passed: 101 bundled modules. Svelte is external; this does not verify rendering or Svelte compilation. |
| `sha256sum tests/public-contracts/city-population/*.ts` | Repeated after implementation; all four match pre-runtime hashes above. |

The existing default `tests/public-contracts.ts` glob already discovers these four numbered scripts. No runner edit is needed. The model uses conventional `model.ts` / `ui.ts` discovery. No new library export, package entry or dependency is required.

## UI review status

Applied frontend-design, frontend-design-shadcn-svelte, standalone shadcn-svelte and write-docs instructions. Reviewed the root `components.json`, public UI contracts and nearby model declarations. The UI only composes existing defineUI controls, monitors and charts; no new component/block, DOM, CSS or renderer was authored. Scientific colors use the central indexed palette. Numeric demographic rules stay in model.ts.

Loaded web-design-guidelines and fetched the current upstream rules with `curl -fsSL https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. Source inspection found no local custom styling, unlabelled declared controls or duplicated scientific calculations. Shared-host focus, keyboard, overflow, chart accessibility, themes and responsive behavior remain unverified. This source check is not visual approval or a complete accessibility review.

As explicitly assigned, browser work is deferred to central coordination to avoid contention. No Playwright session, screenshots or independent review were run by this implementation subagent. Still required:

- Setup, Step, Run/Pause, live migration and household-size controls, and empty-population interaction checks.
- Desktop at least 1366×768 and narrow 390×844 screenshots in light and dark themes, including setup and a changed-policy state.
- Independent inspection of actual screenshots and resolution/re-check of findings.
- The required independent substantial design review, with provider/model availability checked centrally.
- Restore/install the approved existing dependencies centrally, then rerun `bun run typecheck` and the relevant integration/build checks.

## Limits

These checks establish the listed synthetic arithmetic, conservation and public actions. They do not establish empirical demographic validity, persistent household membership, housing demand accuracy or UI acceptance. Household formation is anonymous annual packing with net formation/dissolution counts. Migration is net rather than separate gross inflows/outflows. Overflow safeguards are implemented but extreme safe-integer exhaustion was not exercised. No other new city model is coupled to this one.

## Central integration checks, 2026-11-10

`bun run check` passed centrally: 835 tests, 352 public scripts, migration checks, library build and packed Bun/Node/TypeScript consumer. The earlier dependency/concurrent-diagnostic blockers are superseded. `bun run typecheck` passed again after presentation corrections. Final UI build and independent acceptance are recorded in the [central verification record](../../../docs/development/city-simulation-models.md).

Playwright Chromium: Setup, 1 step and 10 steps reached tick 11. A live control was edited through the rendered UI and the resulting observation was inspected: annualMigration=0 produced year 1, net migration 0, population 920 and accounting error 0.

Retained screenshot set: `ui/agent-lab/acceptance/screenshots/city-models/city-population-{desktop,narrow}-{light,dark}.png`. Independent findings and later author corrections remain separate from independent approval in the central acceptance records.

## Independent acceptance completed

Antigravity gemini-3.8-flash approved the bounded domain implementation, public contracts and scientific limitations. Independent screenshot inspection and the final UI reapproval closed the presentation findings. See the [retained final review](../../../ui/agent-lab/acceptance/city-models/final-independent-review.md) and [coordinator responses](../../../ui/agent-lab/acceptance/city-models/review-responses.md). This is teaching-model acceptance, not empirical validation or a coupled-city contract.

## Revision 2 (2026-11-10)

The user authorized a research-led rework of all fifteen models after the [Opus 5.5 review](../../../ui/agent-lab/acceptance/city-models/opus-5-5-review.md). The research basis is the [research brief](../../../docs/development/city-model-research.md). This revision was implemented by Claude Opus 5.5 in the shared checkout; independent review and acceptance are open (see the [central status](../../../docs/development/city-simulation-models.md#current-revision-status)).

### What changed and why

Per-cohort mortality flooring (review M1: 3 deaths in year two at nominal 10 %, immortal small cohorts) is replaced by a city-wide integer death total with carried remainder and largest-remainder allocation; births use the same carried remainder. Mortality now has two age bands (new input `elderlyDeathRate`); defaults change to birthRate 0.06, deathRate 0.005 (under 65), migrationLimit 20. New action `scheduleImmigrationPulse` and observations `ageBands`, `elderlyShare`, remainders. All year-one/two values change (e.g. deaths 100/3 → 38/35).

The revision-1 contract and scripts are archived byte-for-byte in [revision-1-contracts](revision-1-contracts/) (`.txt` suffix so they are not executed). The earlier hashes above describe revision 1 only.

### Example-first record (self-reported)

The revised contract and four scripts were written before the runtime change. The new `01` script failed against the revision-1 runtime at 2026-11-10T16:39:32+00:00. SHA-256 at that moment:

```text
fcdb3b54627d09db1294e743d5d38eda66ff984a03dece0f00832dad1215d8ed  tests/public-contracts/city-population/01-setup.ts
9f72784bcf1955c47a5d7ac9720a43b785a197d9370fd3c5a2902216b583c7d0  tests/public-contracts/city-population/02-conservation.ts
7f07096ed82d49ac73730611a59ad6d21d6b1c11d68240577b25e7652a17fee3  tests/public-contracts/city-population/03-policy.ts
926cc1156c755e3754114a826f1892248efd47fb802fca36407038c543a2be28  tests/public-contracts/city-population/04-validation-snapshots.ts
```


There is no freeze commit; these hashes and timestamps were recorded by the implementing agent and only show that the files existed in this form, not an independently verified order of work.

### Current script hashes

```text
fcdb3b54627d09db1294e743d5d38eda66ff984a03dece0f00832dad1215d8ed  tests/public-contracts/city-population/01-setup.ts
9f72784bcf1955c47a5d7ac9720a43b785a197d9370fd3c5a2902216b583c7d0  tests/public-contracts/city-population/02-conservation.ts
7f07096ed82d49ac73730611a59ad6d21d6b1c11d68240577b25e7652a17fee3  tests/public-contracts/city-population/03-policy.ts
926cc1156c755e3754114a826f1892248efd47fb802fca36407038c543a2be28  tests/public-contracts/city-population/04-validation-snapshots.ts
```

Shell, browser and review results for this revision are recorded centrally in the [city model status](../../../docs/development/city-simulation-models.md#current-revision-status) and the [browser acceptance record](../../../ui/agent-lab/acceptance/city-models/README.md).
