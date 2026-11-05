# Agent Lab refactor

Status: authorized assignment and design; runtime not delivered.

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
