# Models and public contract tests

Models are the canonical runnable examples. Complete simulations live under `models/<slug>/` with separate `model.ts`, `ui.ts` and usage documentation. Public API assertions live under `tests/public-contracts/`, UI consumer fixtures under `tests/ui/`, and unmet API contracts under `tests/targets/`. These checks exercise the model or public library; they do not maintain parallel catalog implementations.

Run `bun run contracts` for delivered public and headless UI contracts, `bun run contracts:city` for city authoring contracts, and `bun run contracts:townscaper` for topology contracts. `bun run check` includes model and library tests, the migration receipt, supported contracts, type checks, the library build and packed public consumers. Browser checks remain separate; moved harnesses are under `tests/ui/ui-authoring/` and `tests/ui/ui-authoring-next/`.

Unmet quarter and Giant Component contracts remain outside supported checks. `bun run typecheck:targets` typechecks both; `bun run contracts:targets` executes them, stopping on the first failure. `bun run typecheck:city:targets`, `bun run contracts:city:targets` and `bun run typecheck:giant-component:targets` select their respective obligations. These commands must remain visibly red until the missing capabilities are delivered. Relocation establishes neither scientific acceptance nor implementation of missing APIs.

## Contract history

The [migration receipt](examples-path-migration.json) maps all 355 former files to their destinations, records old/new SHA-256 digests and counts all 3,413 assertion calls. Its base commit retains the original bytes. `bun run check:migration` validates the destinations, hashes, assertion counts and absence of the retired directory.

Historical `SHA256SUMS` files moved byte-for-byte. Their original paths and declared hashes remain historical evidence; resolve those paths through the receipt instead of running `sha256sum -c` against old names. The earlier [model path receipt](model-path-migration.json) and fixed-revision source links retain their original meaning. Import rebasing changes current hashes; the new receipt makes that explicit. Four city authoring contracts now import canonical model functions, following the user's requirement that all model content use the model/UI structure; their assertions and expected results remain intact.

The example-first gate remains binding: agree executable public usage before implementing capabilities, regardless of its directory. Preserve public calls, expected errors, execution order, RNG behavior and tick/step semantics. Substantive contract changes require a design decision and user agreement.

## Reconciled work

[Issue #58](https://github.com/dweigend/city-library/issues/58) coordinates the migration. Merged model consolidation #50 was reused. The current DES/UI work from #57 was merged before inventory so its elevator and UI fixtures migrated with the rest.

The older dirty consolidation, obsolete-file and UI-runtime worktrees were compared semantically against integrated work. Their example-related payload was already represented; merging those stale branches would duplicate work. The clean example-first and research-documentation checkpoints were also represented in the integrated baseline. No missing example-removal payload required copying from those checkouts. Their other unintegrated work and active task bindings remain their owners' responsibility; this migration does not reset or delete them.

Model-first learning, API coverage, scientific evidence and missing quarter/Giant capabilities retain their separate acceptance issues. File relocation does not close those obligations.
