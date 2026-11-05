# Bounded statistics author contracts

Written before runtime implementation on 5 November 2026. Public closure: `stats.histogram(values,{edges})` and `stats.gini(values)` exactly as specified in docs/agent-loom/api-reference.md. No renderer, recorder or additional statistics are delivered by this slice.

Initial command: `bun examples/stats/01-histogram-boundaries.ts` failed with `SyntaxError: Export named 'stats' not found` (Bun 1.4.2), as expected before implementation. Scripts contain asserted boundary, validation, purity and detached-observation contracts; no mocks or private imports.

Frozen SHA-256 values:

```
b7360e47930a2b093a72c3220a9e258679a1bbf7fc317598f783be29e78644a0  01-histogram-boundaries.ts
0cf8f657c71bf4b5af404fce39b94ded2203b1e59772119138b688e86b51ddb0  02-gini-known-values.ts
8250eef5072eed56a55f4434c5d7507e0aad7f7f3feb320b6f2018f7ef45dbd6  03-invalid-measurements.ts
a0d8a7f89e7b92ccae877d03255e94762f44673712f62bdb270f7902d06eb4db  04-independent-observation.ts
ac4a29561fde13ee318e3aa15d847cd7333ac1fb9b81b7e4f65e0ae1cea99b5e  05-detached-distributions.ts
```
