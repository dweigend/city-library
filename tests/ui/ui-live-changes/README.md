# Explicit live-change default: frozen author tasks

Phase A freezes five complete declarations before its runtime implementation. Use public `defineUI` from the Svelte implementation or its compatibility import; each script exports `browserChecks(container, bind)` for a real attached browser document. Headless assertions exercise the actual model action and detached observations; they do not claim that a DOM mount ran in Bun.

1. Shared Wolf/Sheep rule editing: omitted field setters, exact one-key dispatch, independent RNG and no hidden step.
2. Virus binding override: a local transforming setter wins over the common default.
3. Taxi demand inputs: exact hyphenated keys, labels, flat groups and enabled predicates.
4. Initialization drafts, model action errors, missing write-path rejection and unchanged legacy-array compatibility.
5. Existing line charts: unique-label color identity survives filtering/reordering, explicit colors win, duplicate labels retain positional fallback, Setup resets lifetime.

`authoring-types.ts` freezes negative input/write-path cases. The [historical initial TypeScript failure](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/tests/ui/ui-live-changes/initial-typecheck.log) records the pre-implementation red gate. The common change default and its runtime assertions are now implemented; that historical failure is not a current check result. No private normalizer, mocked host, disabled assertion or replacement renderer is used. Action failure has no general host rollback promise; the small rule fixture rejects before mutation itself.

Run the five scripts headlessly, then `bun run typecheck`. Execute all five exported browser exercises through `ui/index.ts`; `ui/svelte/index.ts` is a compatibility re-export of that same Svelte implementation. The SHA256 manifest records the example-first source freeze.

Editorial amendment after freeze: the wrong-string local-setter negative remains unchanged; its `@ts-expect-error` directive moved from the nested binding to the enclosing call because TypeScript reports the write-path union incompatibility there. No accepted value, type rejection or runtime assertion changed. This avoids adding a public overload solely to influence diagnostic placement.

Compatibility amendment: restoring the pre-existing exported `UISpec` interface preserves downstream `interface ExtendedSpec extends UISpec<P, M>` consumers. Scripts 01–04 now name `ChangeUISpec` in their import and `satisfies` annotation because they use the new explicit common-write variant. Their declaration objects, callbacks, arguments, runtime assertions and expected type rejections are unchanged. Both types describe the same flat `defineUI` form.

Main-layout migration: model imports now use `models/`. The root `tsconfig.json` checks these scripts and negative fixtures; redundant phase configs and detailed initial logs are retired from the current tree. Original freeze bytes remain available at revision `754e4cc0bb1afb5b417aeda1d918d3b654c8c85f`; the model-path migration record preserves original and migrated hashes. Runtime assertions and accepted values are unchanged.
