# Typed formatters and readable projections

These five public tasks were authored before the new runtime/type implementation. They extend the previous accepted UI examples, which remain unchanged. The coordinator must commit this example checkpoint before handing off runtime work. The [contract](../../docs/development/ui-authoring-next.md) records the design boundaries.

## Public tasks

| Script | Asserted headless work | Additional real-browser acceptance |
| --- | --- | --- |
| `01-typed-monitor-formatters.ts` | Real Voting step, numeric raw tick and detached prior observation | Numeric and string formatter callbacks use explicit scalar argument annotations; a real union formatter narrows; stepping refreshes displayed precision |
| `02-readable-observation-projections.ts` | `Observation<typeof model>` from both public entrypoints, unchanged RGB anchors and real Wealth class totals; pure projections preserve observation/RNG | Named spatial/category projections render; canonical population and accessible category text remain visible |
| `03-namespaced-selection.ts` | Real Wealth observation adapter deliberately shares a source ID between a sampled agent/cell; namespaces resolve kinds and reject missing IDs | Two actual canvas views select equal source IDs without ambiguity; explicit model action distinguishes kinds; leaving the sampled projection disables stale selection; restart clears it |
| `04-formatter-errors-and-recovery.ts` | Real Voting advancement retains a numeric scientific tick | Formatter errors reach the existing host error path; pending setup edits preserve primary error; restart recovers |
| `05-independent-mounts-and-legacy.ts` | Independent real Voting instances and RNG, existing extracted `UISpec`/legacy live syntax | Two mounts stay independent; disposing one does not alter the other; stale button does not affect another owner |

`authoring.types.ts` is compile-only. It checks incorrect scalar/union formatters, both hosts, extracted specs, invalid observation inputs, concrete observation members and compatible string/null selection. `assertions.ts` only reuses accessible real-DOM queries and assertions, plus a monitor query. It never supplies a replacement DOM, simulation or runtime introspection API.

## Formatter decision

The accepted concise form is:

```ts
{
  label: 'Tick',
  value: state => state.tick,
  format: (value: number) => value.toFixed(2),
}
```

The model observation remains inferred. The formatter's explicit scalar annotation establishes the compatibility requirement against the getter; it is not full inference of the formatter parameter. A text formatter uses `value: string`; a genuinely union-valued getter still requires narrowing. Existing unannotated guarded formatters keep the `string | number` compatibility context. Compiler experiments did not establish a general safe direct-inference solution for heterogeneous context-sensitive callback arrays. Fixed-length overloads, `any`, callback casts and a new builder dialect were rejected. Do not report automatic per-monitor formatter inference as delivered.

## Initial executed evidence

At baseline `11d697f`, before runtime implementation of this extension:

- All five scripts ran with Bun and exited **0**. These passes cover only their headless assertions and inert entry construction; they do not establish typed acceptance or browser behavior.
- `bun x tsc -p examples/ui-authoring-next/tsconfig.json` exited **1**, as expected: public `Observation` is absent and scalar-only formatter callbacks are rejected by the existing broad formatter signature. The typecheck includes the negative contracts; no assertion is disabled or widened to hide the missing capabilities.
- Session-local outputs: `/tmp/city-library-ui-authoring-next-initial-typecheck.log` and `/tmp/city-library-ui-authoring-next-initial-results.json`.
- The real-browser checks have not been run at this authoring checkpoint. Runtime delivery must run all five in both hosts, record page/console failures, desktop/narrow light/dark screenshots and independent pixel inspection.

Run the public tasks:

```sh
bun examples/ui-authoring-next/01-typed-monitor-formatters.ts
bun examples/ui-authoring-next/02-readable-observation-projections.ts
bun examples/ui-authoring-next/03-namespaced-selection.ts
bun examples/ui-authoring-next/04-formatter-errors-and-recovery.ts
bun examples/ui-authoring-next/05-independent-mounts-and-legacy.ts
bun x tsc -p examples/ui-authoring-next/tsconfig.json
sha256sum -c examples/ui-authoring-next/SHA256SUMS
```

The manifest uses repository-relative paths and freezes the five scripts, assertion helper, browser harness, compile-only type contracts and focused tsconfig. README and runtime documentation are outside the manifest so later truthful evidence/status updates do not change the executable contract. Register this phase in the normal runner/typecheck during runtime delivery; it is not registered as an already passing phase at this initial checkpoint.

Pre-freeze Argon review approved the design and identified four harness/coverage gaps; all were corrected before this first committed freeze. The response is in the phase contract. Corrected scripts pass Bun; the corrected pre-runtime TypeScript run still fails on the absent public contracts as expected (`/tmp/city-library-syntax-prefreeze-typecheck.log`).
