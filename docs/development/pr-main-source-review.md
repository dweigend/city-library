# Independent Main Integration Source and Design Review

Status: APPROVED for source, design, and transfer boundaries. Date: 2026-11-09.
Reviewer: Antigravity (Gemini 3.8 Flash, HIGH reasoning).

## Inspected Heads and Scope

- Target branch: `feat/salabim-concepts` at `1f67f58bdadef109ae0e7dc63627e925a14edf0d`.
- Merge commit: `b5977bb`, merging feature `754e4cc0bb1afb5b417aeda1d918d3b654c8c85f` and `origin/main` (`429fd627724b0db9fff4da9c81d45ebde4e07fbc`). Post-merge commits `1e97878` and `1f67f58` are documentation only.
- Final diff against `origin/main`: 170 files (+4378 / -1376). No diffs in `src/`, root `package.json`, `bun.lock`, root `tsconfig.json`, `.github/`, or `README.md`. Root `studies/` model tree is cleanly retired; 146 model/ui pairs reside under `models/`.
- Prior approvals pinned to `754e4cc` were not reused; all evaluations were executed against the merged head.

## Verification Commands and Target Evidence

1. `bun run typecheck`: Passed (Svelte diagnostics: 0 errors, 0 warnings under root unified configuration).
2. Focused test suites: 57 tests / 523,997 assertions passed across 9 test files (including 50 adversarial and parity tests in 465ms).
3. Full post-merge check (`bun run check`): Passed exit 0, **773 tests / 707,999 assertions**, auto-discovered examples, library declaration build, and packed Bun/Node ESM ambient-free consumer (`tests/package-consumer.ts`).
4. UI compilation (`bun run build:ui`): Passed in 1.72s (Vite v8.3.6, 1154 modules).
5. 35 focused public scripts: Passed exit 0 (5 live-change, 5 collection, 5 spatial, 5 core DES, 10 city-model, 5 elevator examples).
6. Headless inertness: `ui/index.ts` and model UI scripts import cleanly in Bun without DOM/window globals.
7. Model discovery: 146 discoverable `model.ts` and 146 `ui.ts` pairs under `models/`.

## Merge Risk Analysis and Architecture Findings

- **Public & Compat UI Architecture**: `ui/svelte/index.ts` is an exact re-export (`export * from "../index.ts"`), ensuring a single Svelte `defineUI` host rather than dual hosts. `ui/compose.ts` implementation matches main exactly; only feature type overloads were added.
- **Authoring & Live-Write Semantics**: `normalizeAuthoring` decodes single-key updates for `spec.change` while giving precedence to local binding `set` handlers. Legacy live arrays with `change` are rejected. `UISpec` retains interface extensibility (`interface UISpec extends UISpecBase`), while `ChangeUISpec` types the flat `change` contract with `NoInfer`.
- **Pure Projections & Geometry**: `collectionDiagram` is a pure function projecting to `SpatialData` in diagram units. Row kinds (`items`, `count`, `capacity`) are mutually disjoint. Frame decorations use `selectable: false` to prevent misattribution during canvas picking. Robust protection against prototype pollution, accessor properties, and inherited array hooks is verified.
- **Canvas Robustness**: Canvas dimensions, aspect ratios, and transformations are guarded against non-finite values and Web IDL 32-bit unsigned wrapping. Reverse-order hit-testing prioritizes shaped symbols and honors `selectable: false`.
- **Table Paging & Stable Charts**: `View.svelte` implements 200-row pagination with reactive page clamping via `untrack(() => page)`. Chart color series slots are cached on the mounted view, ensuring stable palette assignments across line toggles.
- **Model Preservation**: All existing model logic is preserved. Only 6 existing DES models were touched, restricted entirely to non-intrusive observation and metadata fields.
- **DES Elevator (`models/des-elevator`)**: Adheres strictly to the specification: complete alighting before boarding, FIFO call preservation for full cars, deterministic oldest-passenger arrival ties, `maxEventsPerStep` event budget protection, clean disposal/teardown, and headless time measured in seconds. Pinned MIT-licensed Salabim sources documented in `docs/research/des-elevator-sources.md`.
- **Docs & Artifact Policy**: Historical records and migration receipts (`model-path-migration.json`) accurately track hash transitions. Transient test logs and local artifacts remain under gitignored directories (`/tmp/` and `.local/development-archive/`).

## Verdict and Delivery Boundaries

- **Verdict**: **APPROVED**. The merged source meets all code quality, typing, architectural separation, and regression standards.
- **Transfer Status**: Push of `feat/salabim-concepts` and PR creation targeting `origin/main` are authorized. No main merge is performed.
- **Separation of Concerns**: Visual inspection is tracked independently in `docs/development/pr-main-image-review.md` (64 images APPROVED). Browser automation on port 3231 passed all 146 setup/step cases and deep flows.
- **Limitations**: Elevator is a synthetic teaching controller rather than a certified elevator specification. Hosted GitHub Actions CI remains to run on PR submission.
