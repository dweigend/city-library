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
