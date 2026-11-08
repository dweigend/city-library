# Readable UI authoring examples

These five examples bind model inputs, actions, observations and charts without host-specific code. Bun runs the headless assertions; the browser harness checks controls and rendering. The [UI reference](../../docs/ui/api-reference.md) defines the supported API.

## Five public tasks

| Script | Real model and asserted headless result | Additional real-browser contract |
| --- | --- | --- |
| `01-defaults-and-inert-entry.ts` | Voting: inert declaration; typed boolean action preserves tick and RNG | Omitted setup excludes keyed live fields; descriptor defaults and authored order; no creation until Setup |
| `02-ordered-setup-and-numeric-live.ts` | Wealth: numeric action updates growth to 6 without stepping | String setup selection and local label override; numeric input action; implicit getter refresh |
| `03-alternate-observation.ts` | Voting through an observation-only adapter: explicit getter reports true after real action | Missing parameters convention uses explicit getter; boolean control sends boolean |
| `04-groups-format-and-categories.ts` | Wealth: numeric Gini stays numeric; separate formatting; named class bars preserve class total and RNG | Accessible flat groups; nonadjacent same-group fields; formatted monitor; category and axis/unit text |
| `05-independent-actions-and-legacy.ts` | Wealth: explicit one-step action and rule change leave second instance/RNG unchanged; legacy setter remains accepted | Two independent mounts; explicit empty setup; legacy duplicate setup/live behavior; disposed action isolation |

`assertions.ts` queries and acts on a real DOM using real model factories, without private runtime imports or test-only public introspection APIs. `authoring.types.ts` adds negative compile-only cases. Exported `browserChecks(container)` functions check setup, normalization and grouping; Bun does not execute them.

## Run the examples

```sh
bun examples/ui-authoring/01-defaults-and-inert-entry.ts
bun examples/ui-authoring/02-ordered-setup-and-numeric-live.ts
bun examples/ui-authoring/03-alternate-observation.ts
bun examples/ui-authoring/04-groups-format-and-categories.ts
bun examples/ui-authoring/05-independent-actions-and-legacy.ts
sha256sum -c examples/ui-authoring/SHA256SUMS
```

Run `bun x tsc -p examples/ui-authoring/tsconfig.json` for the positive and negative type contracts. `SHA256SUMS` protects the executable examples; implementations must satisfy their assertions rather than weaken them.

## Browser checks

Invoke all five exported `browserChecks` functions in a real browser against each supported public host adapter, using fresh attached containers. The helpers query actual labels, controls, fieldsets, monitors and chart accessibility content. They do not supply a substitute DOM or change model state directly.

Browser acceptance requires desktop/narrow light/dark interaction checks and independent screenshot review. The five examples complement focused tests for invalid data, formatter errors, getter precedence, setup/live defaults, choice setter inference and invalid observations. Follow the [authoring contract](../../docs/development/ui-authoring-contract.md) and [UI design rules](../../docs/DESIGN.md).
