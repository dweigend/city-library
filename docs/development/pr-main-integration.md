# UI and elevator integration with current main

The integration keeps main's `models/<slug>/` layout, single root TypeScript configuration, automatic example discovery and one Svelte-backed UI entry. It adds common live-write defaults, collection projections, flat DES scenes and the elevator without restoring the removed legacy host or `experiments/` model tree. Main's README/diagram, package/lock decisions and bounded blood-sugar test budget remain authoritative.

## Accepted contracts and migration

The maintained [UI reference](../ui/api-reference.md) defines `change`, `ChangeUISpec`, `collectionDiagram`, decoration selection, complete table paging and stable chart colors. The [elevator contract](des-elevator-contract.md) defines model actions, dispatch, capacity and units. The headless package remains independent of DOM/Svelte.

The feature's example-first commits remain in normal merge history. Import-only updates and retired redundant configurations are recorded in [the path receipt](model-path-migration.json); assertion values and callback bodies are preserved. `ui/svelte/index.ts` is a compatibility import for the same implementation, not another host. The current model root is `models/`.

## Historical evidence boundary

[Universal authoring acceptance](universal-ui-evidence.md) and [flat-scene/elevator acceptance](des-2d-evidence.md) summarize checks at the pre-consolidation feature revision. Their complete original records are pinned to `754e4cc`. In particular, the historical 757-test/146-model/92-image record is not a check of the merged head. New screenshots, command transcripts and detailed handoffs belong under ignored `.local/development-archive/`; current portable summaries retain scope, findings and limits.

## Current merged-source verification

Pending coordinator execution: typecheck, focused/public examples and consumers, full check, production Svelte build, affected browser flows and independent integration source review. Record exact merged-source commands/results and any browser/tooling limits here before PR handoff. Historical approval alone does not close these gates.

## Delivery boundary

The user authorized the feature branch push and a ready pull request targeting main. This record grants no main merge or publication approval. The PR must describe the final diff against current main, distinguish new checks from historical evidence, and retain any unresolved check or review limitation.
