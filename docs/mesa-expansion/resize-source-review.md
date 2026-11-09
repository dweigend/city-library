# Independent canvas resize source review

Reviewer: independent native Codex subagent (`gpt-6.1-sol`, inherited medium reasoning). Reviewed source HEAD: `ab5289beeeb82535525cfdc18f24f1cc3ffb2273`, containing the normal merge of `11d78f70ed8af57724698a145d0eb830581160e3`. The reviewed implementation delta is limited to `ui/views/canvas.ts`: thirteen added lines and two removed lines. No source file was edited by this review.

This review covers the later canvas scheduling delta. It does not extend the earlier Gemini review's source coverage or claim that Gemini inspected this change.

## Decision

**Approved for the focused source and lifecycle scope.** No blocking source finding was identified. Real-browser resize reproduction, pending-frame disposal instrumentation and independent image inspection remain separate evidence, owned by the coordinator and browser reviewer.

## Findings and reasoning

- Observer delivery now reads the latest observed width and themed maximum height without writing intrinsic canvas dimensions. One requested animation frame performs `resizeBuffer()` and `draw()` after notification delivery. This addresses the diagnosed parent-size feedback path without changing network/chart/CSS or introducing another scheduler for model execution.
- Repeated observer notifications update the shared dimensions before checking whether a frame is already pending. The pending callback therefore uses the newest geometry and current `latest` projection; it does not close over an obsolete first notification or model observation. Intermediate paints may be coalesced, but the final projection is not dropped.
- `update()` still assigns the projection, sizes the buffer and draws synchronously. Initial model publication and explicit action updates were not converted into deferred callbacks. A responsive geometry correction can occur on the next animation frame, as expected for observer-driven layout.
- The frame clears its pending identifier before work and checks `disposed` before accessing canvas rendering state. `dispose()` first marks the view disposed, disconnects the observer, cancels any pending frame and clears its identifier. The observer's own disposed guard prevents a late delivered notification from creating new work. These paths preserve idempotent disposal and prevent a queued resize draw after teardown.
- Existing drawing-stop and pointer/listener cleanup remains unchanged. A drawing-end intent can already cause a synchronous final publication during cleanup; this patch does not broaden or redefine that existing behavior.
- The delta changes only rendering timing. No model procedure, World tick, Agenda time, RNG stream, domain membership, public model API or stylesheet is touched. No exception is silently suppressed by the new callback.

## Executed checks

- Read the full canvas implementation, the exact accepted commit diff, coding standards, UI mount/update/dispose contracts and relevant design verification instructions.
- Fetched the current Vercel Web Interface Guidelines successfully on 2026-11-09 into `/tmp/mesa-resize-source-rules.md`. This source review applies relevant lifecycle/performance criteria; it is not a visual or complete accessibility audit.
- Executed `bun test tests/ui-authoring.test.ts tests/ui-chart-authoring.test.ts tests/ui-authoring-next.test.ts`: **19 passed, 0 failed, 108 assertions**.

Those existing tests exercise public session disposal, authoring projections and chart geometry. They do not instantiate a browser ResizeObserver or prove cancellation of a pending real animation frame. The coordinator's separate browser recheck must supply that evidence; this review did not open browser tabs or inspect new screenshots. No full expensive baseline suite was repeated for this small UI-only delta.
