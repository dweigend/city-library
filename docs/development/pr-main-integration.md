# UI and elevator integration with current main

The integration keeps main's `models/<slug>/` layout, single root TypeScript configuration, automatic example discovery and one Svelte-backed UI entry. It adds common live-write defaults, collection projections, flat DES scenes and the elevator without restoring the removed legacy host or `experiments/` model tree. Main's README/diagram, package/lock decisions and bounded blood-sugar test budget remain authoritative.

## Accepted contracts and migration

The maintained [UI reference](../ui/api-reference.md) defines `change`, `ChangeUISpec`, `collectionDiagram`, decoration selection, complete table paging and stable chart colors. The [elevator contract](des-elevator-contract.md) defines model actions, dispatch, capacity and units. The headless package remains independent of DOM/Svelte.

The feature's example-first commits remain in normal merge history. Import-only updates and retired redundant configurations are recorded in [the path receipt](model-path-migration.json); assertion values and callback bodies are preserved. `ui/svelte/index.ts` is a compatibility import for the same implementation, not another host. The current model root is `models/`.

## Historical evidence boundary

[Universal authoring acceptance](universal-ui-evidence.md) and [flat-scene/elevator acceptance](des-2d-evidence.md) summarize checks at the pre-consolidation feature revision. Their complete original records are pinned to `754e4cc`. In particular, the historical 757-test/146-model/92-image record is not a check of the merged head. New screenshots, command transcripts and detailed handoffs belong under ignored `.local/development-archive/`; current portable summaries retain scope, findings and limits.

## Current merged-source verification

The normal merge is `b5977bb`, incorporating `origin/main` `429fd627724b0db9fff4da9c81d45ebde4e07fbc`; UI inventory clarification `1e97878` is documentation-only. New target checks against this merged source:

- `bun run typecheck`: passed, Svelte 0 errors / 0 warnings under main's unified configuration.
- Thirty-five focused public scripts: all passed (five live-change, five collection, five spatial, five core DES, ten city-model, five elevator scripts). The assertions are unchanged apart from recorded path-only migrations.
- Nine focused test files: 57 tests / 523,997 assertions passed.
- `bun run check`: exit 0, **773 tests / 707,999 assertions**, all automatically discovered supported examples, library/declaration build and packed Bun/Node ESM/ambient-free TypeScript consumer passed. This is a new post-merge run, not the historical 757-test result.
- `bun run build:ui`: passed in 1.72 seconds, with the existing bundle-size advisory.
- Standalone public UI consumer: Bun and isolated strict TypeScript (`types: []`, ESNext/DOM libraries) passed. It checks inert imports, old interface extension and the new common-write declaration against the current Svelte entry.
- Static transfer checks: all 82 migrated UI bodies match the prior feature after path normalization; 146 model/UI pairs are discoverable. No live TypeScript remains under `experiments/`. Six expected existing DES observation/metadata additions and the new elevator are retained; main's other model changes and test budgets are preserved. Main README/diagram, package, lockfile, CI and root config match main.

New browser work already passed all 146 actual catalog Setup/step cases, 82 valid live edits, 30 public/compatibility-import fixtures and eleven deep DES flows on port 3231. Both imports resolve to the same Svelte `defineUI`. Independent image review and the new Gemini integration review remain active; their current-source summaries will be linked here before delivery. Historical approval alone does not close those gates.

Detailed new transcripts, screenshots and receipts remain under ignored `.local/development-archive/pr-main-integration/`. They are working artifacts, not portable evidence or a backup; the versioned summaries distinguish exact scope, source revisions, findings and limitations.

## Delivery boundary

The user authorized the feature branch push and a ready pull request targeting main. This record grants no main merge or publication approval. The PR must describe the final diff against current main, distinguish new checks from historical evidence, and retain any unresolved check or review limitation.
