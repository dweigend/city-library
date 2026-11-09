# Explicit live-change implementation

The Phase A contracts were frozen in `6a6c6b7` before runtime. This implementation adds one optional explicit default write inside the existing public UI declaration and shared normalizer. It does not introduce another model action registry, scheduler, state owner or host path.

## Public and runtime semantics

`LiveChanges<P>` is `Partial<P>`, exported by both existing UI adapters. The public `UISpec` remains an interface with its existing required-set keyed/legacy shape, preserving downstream interface extension. Additive `ChangeUISpec` is an interface for keyed fields that may omit `set` because its explicit `change` is required. The internal `AuthoringSpec` union feeds the same flat `defineUI` form. Legacy arrays cannot combine with `change`. `MonitorSpec` distributes its monitor replacement over that union so getter/formatter correlation and write-path constraints survive. The original four `defineUI` overloads retain `NoInfer`; their legacy-specific branches explicitly exclude `change`.

Both public entrypoints export `ChangeUISpec`. The shared normalizer validates the write path at mount, descriptor-decodes before invoking it and creates a fresh one-own-key record for each default dispatch. A binding-local setter wins. Explicit setters retain their existing callback receiver. Default getters, setup omission, flat groups, enabled predicates, pre-Setup drafts and host error handling continue through existing code. No callback runs during declaration or normalization. The model action remains the validator of domain semantics.

The erased internal `RuntimeSpec` accepts both runtime shapes so JavaScript callers can receive the documented boundary errors. This is not a permissive public overload. Its single computed-field assertion is at the descriptor-decoded boundary; public mapped types retain each parameter's value type.

## Editorial frozen-example correction

With the write-path union, TypeScript reports the wrong-string override incompatibility on the enclosing `defineUI` call rather than its nested `amount` property. The coordinator approved moving only that negative case's `@ts-expect-error` from old line 9 to new line 8 in `authoring.types.ts`. The rejected setter still explicitly accepts `string` for the numeric input; its code and expected rejection are unchanged. The README records this correction and the SHA256 manifest was refreshed for those two changed files. No runtime assertion, accepted call or expected value changed. A temporary additional overload was rejected because changing public overload structure solely for a diagnostic location disrupted old legacy negative fixtures.

## Executed checks

- `bunx tsc --noEmit -p examples/ui-live-changes/tsconfig.json`: passed with all new negative assertions active.
- All five `examples/ui-live-changes/0*.ts` scripts under Bun: passed their headless assertions. Their exported real-browser checks were not executed by this implementer.
- `bun test tests/universal-live-changes.test.ts tests/ui-authoring.test.ts tests/ui-authoring-next.test.ts`: 17 passed, 0 failed, 83 assertions. New cases cover fresh exact-key dispatch, descriptor rejection before action, override precedence, legacy rejection/compatibility, inert declarations and special `__proto__` input keys without prototype mutation.
- `bun run typecheck`: passed, including the pre-existing legacy/monitor negative fixtures and Svelte with 0 errors and 0 warnings. After adding the missing inline Svelte type re-export, `bunx tsc --noEmit -p tsconfig.ui.json` passed again.
- `git diff --check`: passed.

Chart lifetime colors, Phase B collections/paging, migration parity, independent refactors/source approval and actual browser acceptance are separate owners and gates. This is author verification, not independent approval or universal browser acceptance.

## Interface-extension compatibility remediation

An independent reviewer identified that the initial union alias broke a baseline consumer using `interface ExtendedSpec extends UISpec<P, M>` with TS2312. The coordinator approved restoring the original interface shape and adding the precise `ChangeUISpec` variant. This preserves both baseline extension and strict missing-set rejection; no public `any` or permissive overload was added. Internal authoring/monitor processing uses their union, with the original four `defineUI` overloads and `NoInfer` boundaries unchanged.

New compile-only regression `tests/universal-live-changes.types.ts` actually extends both public interfaces, accepts both declarations through public `defineUI`, and rejects a missing old setter and a missing new common action. The four new frozen shared-write examples were amended only in their type import and `satisfies` name (`UISpec` → `ChangeUISpec`). The coordinator explicitly approved this type-annotation correction; every runtime object, callback, argument, expected result and negative case remains identical. Their README and SHA256 manifest record the compatibility reason. Earlier baseline examples and consumers were not edited.

The same annotation-only correction applies to the two newly authored shared-write declarations in `tests/universal-ui-adversarial.test.ts`: their imported type and `satisfies` annotations now name `ChangeUISpec`. The independent test assertions and callback bodies were preserved exactly.

Executed remediation checks: both `bunx tsc --noEmit -p examples/ui-live-changes/tsconfig.json` and `bunx tsc --noEmit -p examples/ui-collections/tsconfig.json` passed. All five Phase A scripts passed headlessly, and the existing focused 17 tests / 83 assertions passed. After the approved new-test annotation corrections, `bun run typecheck` passed, including the restored interface-extension regression and Svelte with 0 errors and 0 warnings. The initial full typecheck failure was confined to those two new annotations and was corrected rather than suppressing their checks. `git diff --check` passed. Independent reviewer recheck and browser acceptance remain separate evidence.
