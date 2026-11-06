# Agent Lab refactor

Status: historical authorized assignment for the first modular replacement. That bounded runtime and its checks were subsequently recorded in [refactor evidence](agent-lab-evidence.md). The integration branch has since expanded the catalog and integrated a Svelte WIP runtime; [PLAN](../../PLAN.md) and the [consolidation report](consolidation-report.md) own current scope, verification and outstanding acceptance. The assignment and original review responses below retain their checkpoint context; they are not independent approval of later work.

## Goal and architecture

Replace `Agend_Lab/` with the first application under `ui/agent-lab/`. Shared controls, layouts and neutral network/grid/spatial/chart/inspector adapters belong under `ui/`. Keep files flat until actual complexity justifies folders. Keep the existing headless `src/` domain layout. No second modeling engine, mandatory defineModel wrapper, global registry or speculative stubs.

Each `experiments/<slug>/` exposes `model.ts` and `ui.ts`; normal imports may use private helpers. A small headless `experiments/definition.ts` convention describes metadata, canonical parameter inputs and a factory returning public actions/read observations. UI imports model contracts, never the reverse. Existing factories and frozen scripts retain their public behavior and paths; initial entries may adapt them.

The Bun host in `scripts/agent-lab.ts` discovers entry pairs and compiles a catalog with literal lazy imports. Browser code never scans files or evaluates TS text. Build outputs include chunks/assets. Metadata imports execute module code, so definitions and transitive imports must be inert: no factories called, timers, DOM or I/O at import. Invalid entries receive clear diagnostics; stale loads cannot replace a newer selection. Local modules are trusted code, not sandboxed uploads.

## State and execution contracts

Setup drafts belong to UI. Factory validation, defaults and bounds have one headless authority shared with input descriptors. Runtime inputs use explicit actions; preconditions and availability belong to model logic. Renderers consume detached readonly observations, never live Agent/Graph objects. Readonly typing alone is not detachment.

The model owns step rules and `run` owns successful tick increments. Playback owns wall-clock scheduling only. Define terminal checks, bounded batch execution, action ordering and recording cadence before implementation. Errors preserve earlier effects and add no failed-step tick; no rollback guarantee. Rendering, layout and selection cannot consume model RNG or alter topology/time. Adapt existing selected-agent APIs explicitly rather than breaking frozen contracts.

Views have mount/update/resize/dispose and emit intent. Stop scheduling and clean views/listeners/model on replacement; preserve the prior instance on factory validation failure. Handle partial construction, mount and read failures. Studies use run/replication progress rather than pretending to be a single ticked world; preserve the specified headless experiment runner.

## Reference models and provenance

Consult comparison thread 3d13a6d2-485e-4f5f-9aa3-120e83e8a8c2. Initial candidates: Voting, Preferential Attachment, Wolf Sheep Predation, Wealth Distribution; final selection must cover meaningful network/grid/agent behavior with documented reasons. Read Procedures, widget reporters and plots, Info, defaults and license. Record exact official source/version, attribution and adaptations before porting.

Compare mechanisms, initialization, parameter effects, update order, terminal behavior, metrics and actual browser screenshots. Cross-RNG seeded trajectory identity is not promised. Record every material deviation. Reusable missing capabilities belong in their headless domain, with an example-first slice; never hide substitute simulation in UI. Model-specific equations remain in experiments.

## Delivery and acceptance

1. Git checkpoint, this assignment and DESIGN update.
2. Independent Argon consistency review and Astra high sparring on significant contracts; findings, responses and approval remain distinct.
3. Write and freeze four or five asserted public scripts before runtime implementation. Correct implementations rather than weaken accepted scripts.
4. Delegate scoped implementation, starting with one complete slice then four reference entries. Preserve concurrent core work. Remove the superseded Agend_Lab runtime after replacements work.
5. Run strict typecheck, behavior/examples/build/public-consumer checks. Historical evidence is not a current test result.
6. Real-browser desktop/mobile verification, reference/target setup/progress screenshots, iterate on failures. Apply frontend-design and web-design-guidelines.
7. Record actual evidence, library gaps and logical breaks, review responses and Git commits; inform the main development thread.

Completion: automatic catalog without model-specific shell branches, four runnable modular reference entries, headless public access, provenance, browser evidence, no legacy runtime and honest remaining gaps. No claim of delivery until these checks execute.

## Review responses and decisions

GPT-6 Astra high completed a read-only architecture review on 5 November 2026. Its findings are recommendations, not runtime approval. Responses:

- Accept: bind concrete model types in each UI entry before exposing a small mounted-session handle to the catalog. Do not create all-model unions, arbitrary string command buses or any-typed registries.
- Accept: plain headless definition checked with TypeScript satisfies, not defineModel runtime. Inputs must share factory defaults and validation; a second form-only schema is forbidden.
- Accept: observation/history failures after a committed run do not undo its tick; stop and identify the failure phase, never retry automatically. New-model recording follows successful run completion. Existing frozen diffusion behavior remains unchanged.
- Accept: terminal-aware advance validates its entire count before mutation. Source-specific terminal rules must be audited: Voting can discover no changes and stop before incrementing a tick. A universal callback returning normally must not accidentally manufacture a successful tick.
- Accept: initial factory validation failure preserves the previous paused instance. Full rollback of a failed view mount is not promised in the first slice; dispose candidate resources and show a recoverable error.
- Accept: existing selected-agent actions are explicitly adapted; new action targets use IDs when needed. Pure inspection selection remains UI-owned.
- Accept: spatial/grid/activation capabilities are separate public core slices with examples first, never private reusable simulation replacements in experiments.

The comparison thread recommends retaining Preferential Attachment, Voting, Wolf Sheep Predation (both modes), and Wealth Distribution. Its source audit pins NetLogo/models commit bf0626a89358b48494066862843a91f36f2556cf; model files identify NetLogo 7.1.0-alpha1. Browser-source version must be recorded separately. Source/license capture and exact rule audit precede each port.

Gemini 4 Argon completed the independent consistency audit on 5 November 2026 with six pre-implementation blockers. Responses (author decisions, not independent re-approval):

1. Stage delivery by working closure: UI/network, Grid/Voting, spatial/occupancy/Wolf Sheep, then field diffusion/stats/Wealth. Five grid and five spatial scripts are frozen before those runtimes; stats gets its own example set.
2. Preserve terminal-aware source semantics without changing run: compute Voting's candidate synchronous state before committing a successful tick; stable calls stop normally without tick/RNG/history advancement.
3. Discovery preflights candidate pairs and reports invalid entries. Strict builds fail explicitly on invalid source; development may expose diagnostics without claiming every syntax error is recoverable. Serve every Bun chunk/asset, not only the first output.
4. Top-level experiments is an application catalog, excluded from the root package's files/exports. src/experiments remains the headless study API. Asset-only reference-sources is not a catalog candidate.
5. Preserve original attribution/license notices in source archives and adapted model folders. Generic core implementations follow the binding specification, without copying reference-model code/text. Sources and UI are excluded from the core distribution.
6. Preserve existing factory/frozen script paths. Migrate former lab-specific tests and build/type configurations with runtime replacement. Historical negative tests that prohibit newly delivered spatial APIs must evolve explicitly while retaining their positive contracts.

Other responses: selection is optional and renderer-neutral; detached grid buffers may be flat arrays/typed arrays for performance. Recording is independent of frames, but the recommendation to record inside the rule callback is not adopted for new models: new samples follow successful run completion, avoiding observations for failed steps. Existing accepted diffusion behavior remains unchanged. Historical stale status lines will be updated as documentation integration, without rewriting past evidence.

Baseline verification executed before runtime: bun run check passed on 5 November 2026, including existing tests, 15 old public examples, type/build and packed consumer. New example-first evidence is separate in agent-lab-examples.md.
