# Readable UI authoring acceptance examples

Status: authored before runtime changes. The coordinator must commit this frozen contract before runtime handoff. Existing public examples remain untouched. See [the slice contract](../../docs/development/ui-authoring-syntax.md).

## Five public tasks

| Script | Real model and asserted headless result | Additional real-browser contract |
| --- | --- | --- |
| `01-defaults-and-inert-entry.ts` | Voting: inert declaration; typed boolean action preserves tick and RNG | Omitted setup excludes keyed live fields; descriptor defaults and authored order; no creation until Setup |
| `02-ordered-setup-and-numeric-live.ts` | Wealth: numeric action updates growth to 6 without stepping | String setup selection and local label override; numeric input action; implicit getter refresh |
| `03-alternate-observation.ts` | Voting through an observation-only adapter: explicit getter reports true after real action | Missing parameters convention uses explicit getter; boolean control sends boolean |
| `04-groups-format-and-categories.ts` | Wealth: numeric Gini stays numeric; separate formatting; named class bars preserve class total and RNG | Accessible flat groups; nonadjacent same-group fields; formatted monitor; category and axis/unit text |
| `05-independent-actions-and-legacy.ts` | Wealth: explicit one-step action and rule change leave second instance/RNG unchanged; legacy setter remains accepted | Two independent mounts; explicit empty setup; legacy duplicate setup/live behavior; disposed action isolation |

`assertions.ts` contains only assertions and queries/actions against a real DOM. There are no fake models, fake DOMs, private runtime imports or test-only public introspection APIs. All model actions use existing real factories. `authoring.types.ts` adds negative compile-only cases, not a sixth example. Setup/normalization/grouping assertions are in exported `browserChecks(container)` functions and are NOT executed by Bun.

## Commands and initial evidence

At authoring checkpoint `0747555` before this runtime slice:

- `bun x tsc -p examples/ui-authoring/tsconfig.json` exited 1. The existing public UI contract rejects string setup entries, keyed live bindings, monitor formatters and categorical bar coordinates. Setter contextual types are consequently absent and negative field-type directives are initially unused. This is the expected missing-public-capability state, not an accepted typecheck. Raw initial output: `/tmp/ui-authoring-initial-typecheck.log` (session-local).
- Each of the following five scripts executed with Bun and exited 0. They check real model actions/projections; `defineUI` stays inert, so these passes do not establish support for new control syntax at mount.

```sh
bun examples/ui-authoring/01-defaults-and-inert-entry.ts
bun examples/ui-authoring/02-ordered-setup-and-numeric-live.ts
bun examples/ui-authoring/03-alternate-observation.ts
bun examples/ui-authoring/04-groups-format-and-categories.ts
bun examples/ui-authoring/05-independent-actions-and-legacy.ts
sha256sum -c examples/ui-authoring/SHA256SUMS
```

The SHA manifest uses repository-relative paths. It freezes the five task scripts, their assertion helper, compile-only negative contracts and focused tsconfig. No disabled assertions or expected runtime exception wrappers conceal missing implementation. Runtime implementation must make the focused typecheck pass and preserve these asserted expectations. These files are not yet registered in the global example runner; registration belongs to runtime delivery.

## Browser acceptance remains open

Invoke all five exported `browserChecks` functions in an actual browser against each supported public host adapter, using fresh attached containers and avoiding an application-specific test API. The helper only queries actual labels, form controls, fieldsets, monitors and chart accessibility content. It does not mutate the model directly during browser checks. The ordinary scripts may be bundled by the existing host tooling for a test harness; their import-time headless assertions also execute.

These functions have not been executed at this freeze. Their current unsupported mount behavior has not been relabeled as verified failure. Runtime owners must record real execution, interactions and appropriate desktop/narrow light/dark screenshots and independent review separately. Broader invalid data/format errors, both legacy/keyed defaults, explicit value precedence, choice setter inference and optional/incompatible observation rejection need focused implementation tests as defined by the slice contract; the five examples are not exhaustive edge-case coverage.

## First freeze retained before review remediation

Coordinator commit `b7a972c` froze the original examples before runtime. The following original manifest is preserved verbatim; it describes historical bytes, not the revised examples. Astra design findings prompted stronger type/overlap/disposal/category contracts and corrections to real-browser query helpers. No accepted syntax or scientific expectation is weakened. Runtime remains blocked until a separate coordinator refreeze commit.

```text
3c319caf83492ce0416aa54cae4fa19abe21927a61559ca9718b9a4096816199  examples/ui-authoring/01-defaults-and-inert-entry.ts
265d9f19d5c3c9518fe0f9f3ce82e27c752d2ad766eb879679afe3c8e8fcac96  examples/ui-authoring/02-ordered-setup-and-numeric-live.ts
acdf46ae444dd5c924db82d71077a8ba1ae0f7b2ad4c0fd446b488f3c003975e  examples/ui-authoring/03-alternate-observation.ts
2d4c3438bf7924b00a34696516e9c656c2b66e22eee439e723a37b568342e240  examples/ui-authoring/04-groups-format-and-categories.ts
e5c670eeb73339ffedf5b5b570b25907d461748d12124c8aa212a66b958aaf09  examples/ui-authoring/05-independent-actions-and-legacy.ts
0870fad00548cddc30437063328329fb28557aa75b6d2de0f0c73947d0cd3c2f  examples/ui-authoring/assertions.ts
05c0aa54dcbd31d6ed335f72b6ea14169ca9664e6d67eaa5c5f814bdccedd107  examples/ui-authoring/authoring.types.ts
3c7f154284e32ac9549571a3e043ea0b1796aa29d037afc615baac2f76630549  examples/ui-authoring/tsconfig.json
```

## Review remediation: second freeze

The first manifest above remains historical. Before runtime, the design review required additive getter/union/choice/inference cases, explicit-getter precedence, both setup/live edit orders before and after initialization, and checking the disposed original model itself. Helpers now accept associated OR nested labels, include legacy controls outside forms, filter descriptor names rather than Speed, and select chart images rather than decorative SVG icons. Default camel-case labels are asserted with their actual capitalization. Categorical bars now specify grouped series, rejection of duplicate categories within a series, empty/zero data and signed baselines; a real Grid coordinate projection exercises shared categories, zero and negative values.

The five Bun scripts were rerun successfully; [refreeze-headless.log](refreeze-headless.log) records exact commands/exits. The focused TypeScript check still exits 1 against the old runtime, recorded in [refreeze-initial-typecheck.log](refreeze-initial-typecheck.log). No browser check has been run for this revision. No old expectation was weakened; these are harness correctness fixes and stronger acceptance coverage. Separate runtime handoff is still forbidden until the coordinator's refreeze commit.

### Explicit execution route for both hosts

Use the existing Vite dev host (with its existing Svelte plugin and aliases), not the Bun static host, to compile the harness and Svelte adapter. From that host's real browser page, import the harness through Vite's project-file route and invoke it for each adapter:

```ts
const { runBrowserChecks } = await import('/@fs/home/david/.t3/worktrees/city-library/experiment-netlogo-web-catalog/examples/ui-authoring/browser-harness.ts');
const fixture = document.createElement('section');
document.body.append(fixture);
try {
  await runBrowserChecks(fixture, 'legacy');
  await runBrowserChecks(fixture, 'svelte');
} finally { fixture.remove(); }
```

Replace the absolute worktree prefix if the checkout moves. This is an explicit test-harness invocation, not a public application API or production route change. `browser-harness.ts` directly imports the chosen adapter and passes its public `defineUI` into the examples; it does not rely on experiment-only import redirection. It executes the five browser functions plus the full overlap matrix and explicit-precedence check. The harness creates only actual DOM containers and real model instances. Browser execution remains a required follow-up and must report concrete host/module-loading blockers rather than claiming coverage from these instructions.

The revised SHA manifest additionally includes this harness and the two initial-result logs. Global example registration and TypeScript-project inclusion belong to runtime delivery after the frozen failing checkpoint, as does reconciliation of PLAN/docs/ui candidate status. Independent source/design responses and eventual browser/visual approval must remain separate.
