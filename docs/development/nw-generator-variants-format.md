# NW topology examples: formatting and profile-tag revision

The coordinator selected the explicit topology profile spelling `profile: "nw-web-topology/1"`. Before freeze, the five proposal scripts were formatted into readable multiline TypeScript and all **16** occurrences of the earlier `"nw-web"` literal were replaced. No assertion values, other API names, input cases or expectations changed. This step adds no implementation, API shim, configuration or freeze.

The comparison baseline is commit `43dd95076d6b8b9e0df7adc904a024cf0209255d`. Existing cached **Biome 2.6.4** supplied formatting with two-space indentation and a 100-column target. No package or dependency was installed or changed. Optional formatter punctuation edits were undone so even the original non-whitespace token sequence is preserved after the explicit tag replacement.

[comparison.json](nw-generator-variants-format-evidence/comparison.json) records each original/new file hash, tag count, line count and normalized AST hash. [verify-format.ts](nw-generator-variants-format-evidence/verify-format.ts) parses the original and final scripts with existing cached TypeScript services, normalizes only the two profile-tag literal values, and asserts identical ASTs. A separate scanner comparison retains comments and every non-whitespace token, proving that the exact approved literal replacement plus whitespace accounts for the entire edit. It handles template-literal interpolation explicitly.

Executed checks:

- All five normalized AST comparisons pass.
- All five exact non-whitespace token/comment comparisons pass; only the 16 requested tag literals differ.
- All five final scripts parse/transpile with the existing Bun TypeScript transpiler.
- `git diff --check` passes.

Recheck without editing scripts:

```sh
bun docs/development/nw-generator-variants-format-evidence/verify-format.ts
```

Historical proposal documentation and its validation artifacts remain unchanged, including their earlier candidate spelling and expected missing-API diagnostics. The coordinator separately owns complete contract closure and subsequent freeze. This formatting evidence makes no runtime, native-RNG, model-acceptance or independent-review claim.
