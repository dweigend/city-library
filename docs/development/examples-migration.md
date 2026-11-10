# Remove the examples directory

[Issue #58](https://github.com/dweigend/city-library/issues/58) owns the migration sequence, existing-work reconciliation and acceptance checklist. It is the central coordination record; update it rather than maintaining competing task lists.

Models are the canonical runnable examples. Complete simulations belong under `models/<slug>/` and follow the model coding standards. Public API assertions belong under `tests/public-contracts/`, UI consumer fixtures under `tests/ui/`, and unsupported API contracts under `tests/targets/`. These are planned destinations, not delivered functionality. Keep model-specific tests with their model and source records with their semantic owner.

Before moving files, inventory every tracked file in `examples/` and its consumers. Record its destination or justified removal, current assertions, command coverage and provenance. Reconcile the merged model consolidation and the open DES/UI work before applying older local changes. The dirty consolidation, obsolete-file and UI-runtime worktrees contain overlapping material; preserve them until their payload has been compared against the integration base and their owners confirm they can be retired.

Preserve public imports, accepted assertions, execution order, RNG behavior and tick/step semantics. Keep frozen historical evidence unchanged or supply an explicit path/hash migration receipt. The quarter and Giant Component remain unmet targets; relocation must preserve their dedicated failing checks. A passing structural migration does not establish scientific acceptance or implement missing APIs.

Replace the example runner and all package, CI, TypeScript, browser and documentation consumers together. Existing example commands remain authoritative until the replacements run. Remove the directory only after the manifest accounts for every file and affected public-consumer and browser checks pass. The example-first gate remains binding: agree executable public usage before implementing capabilities, regardless of its directory.
