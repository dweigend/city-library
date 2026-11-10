# Bounded statistics author contracts

These scripts check histogram boundaries, Gini values and independent measurements through `stats.histogram(values,{edges})` and `stats.gini(values)`. See the [API reference](../../../docs/agent-loom/api-reference.md) for their contracts. Renderers, recorders and other statistics are outside this set.

## Run the examples

```sh
bun tests/public-contracts/stats/01-histogram-boundaries.ts
bun tests/public-contracts/stats/02-gini-known-values.ts
bun tests/public-contracts/stats/03-invalid-measurements.ts
bun tests/public-contracts/stats/04-independent-observation.ts
bun tests/public-contracts/stats/05-detached-distributions.ts
```

The scripts assert boundaries, validation, purity and detached observations through public imports. They contain no mocks or private imports.

This set covers only `histogram` and `gini`; it does not establish support for other statistics, browser behavior or scientific model validation.
