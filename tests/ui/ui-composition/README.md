# Typed formatters and readable projections

Five examples exercise the UI contract with typed formatting, named projections, selection identity, error recovery and independent mounts.

The [UI reference](../../../docs/ui/api-reference.md) defines the supported API; [PLAN](../../../PLAN.md) tracks remaining work.

## Public tasks

| Script | Asserted headless work | Additional real-browser acceptance |
| --- | --- | --- |
| `01-typed-monitor-formatters.ts` | Real Voting step, numeric raw tick and detached prior observation | Numeric and string formatter callbacks use explicit scalar argument annotations; a real union formatter narrows; stepping refreshes displayed precision |
| `02-readable-observation-projections.ts` | `Observation<typeof model>` from both public entrypoints, unchanged RGB anchors and real Wealth class totals; pure projections preserve observation/RNG | Named spatial/category projections render; canonical population and accessible category text remain visible |
| `03-namespaced-selection.ts` | Real Wealth observation adapter deliberately shares a source ID between a sampled agent/cell; namespaces resolve kinds and reject missing IDs | Two actual canvas views select equal source IDs without ambiguity; explicit model action distinguishes kinds; leaving the sampled projection disables stale selection; restart clears it |
| `04-formatter-errors-and-recovery.ts` | Real Voting advancement retains a numeric scientific tick | Formatter errors reach the existing host error path; pending setup edits preserve primary error; restart recovers |
| `05-independent-mounts-and-legacy.ts` | Independent real Voting instances and RNG, existing extracted `UISpec`/legacy live syntax | Two mounts stay independent; disposing one does not alter the other; stale button does not affect another owner |

`authoring.types.ts` is compile-only. It checks incorrect scalar/union formatters, both hosts, extracted specs, invalid observation inputs, concrete observation members and compatible string/null selection. `assertions.ts` only reuses accessible real-DOM queries and assertions, plus a monitor query. It never supplies a replacement DOM, simulation or runtime introspection API.

## Typed formatting

The accepted concise form is:

```ts
{
  label: 'Tick',
  value: state => state.tick,
  format: (value: number) => value.toFixed(2),
}
```

The model observation remains inferred. The formatter's explicit scalar annotation checks compatibility with the getter; the formatter parameter is not inferred. A text formatter uses `value: string`; a genuinely union-valued getter still requires narrowing. Existing unannotated guarded formatters keep the `string | number` compatibility context. Automatic per-monitor scalar inference, fixed-length overloads, `any`, callback casts and a separate builder dialect are not part of this contract.

## Run the examples

Run the public tasks:

```sh
bun tests/ui/ui-composition/01-typed-monitor-formatters.ts
bun tests/ui/ui-composition/02-readable-observation-projections.ts
bun tests/ui/ui-composition/03-namespaced-selection.ts
bun tests/ui/ui-composition/04-formatter-errors-and-recovery.ts
bun tests/ui/ui-composition/05-independent-mounts-and-scalar-setters.ts
bun run typecheck
bun run check:migration
```

`SHA256SUMS` protects the five scripts, assertion helper, browser harness, type contracts and shared root tsconfig. Implementations must preserve their asserted expectations.

The browser checks use the shared Svelte host and require desktop/narrow light/dark states, captured page/console failures and independent inspection of screenshots. Headless assertions and typechecks do not establish browser behavior or scientific equivalence.
