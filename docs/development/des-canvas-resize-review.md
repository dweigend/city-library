# Independent canvas resize review

**Approved for the scoped source change `11d78f70ed8af57724698a145d0eb830581160e3`.** No blocking source or lifecycle defect was found in this change. This reviewer did not implement the fix and made no runtime edits.

## Scope and diagnosis

The coordinator and Mesa independently reproduced `ResizeObserver loop completed with undelivered notifications` during normal maintenance Setup and alternating narrow/desktop resizes. The canvas renderer synchronously changed its intrinsic buffer dimensions while receiving a resize notification; the resulting canvas/container geometry could produce another notification in the same delivery cycle.

The inspected change affects only `ui/views/canvas.ts`. Its observer still reads the newest available width and height limit, but coalesces buffer writes and drawing into one animation frame after notification delivery. The frame reads current renderer state rather than capturing an obsolete observation. Dispose marks the renderer disposed, disconnects its observer, cancels a pending frame and clears its identifier. This is presentation scheduling, not a simulated delay or model clock.

The earlier substantial Gemini verdict covers DES design and source implementation, not this late host correction. This record supplies a separate independent judgment. Full model/browser replay and independent replacement-image inspection remain separate evidence.

## Source review

- Multiple notifications before a frame update the same size fields before returning; the queued frame therefore uses the newest dimensions.
- An ordinary update before that frame remains synchronous and replaces `latest`. The subsequent resize redraw uses that current observation, selection, labels and drawing state. It cannot restore old model data.
- Both the observer and frame guard disposed state. Frame cancellation removes the normal pending callback; the guard also prevents a late callback from drawing if disposal already occurred.
- Svelte's `View.svelte` cleanup removes its appearance listener and disposes the old adapter. The legacy compose host likewise disposes each adapter when removing/replacing views. Neither requires a changed interface.
- Picking and drawing continue to map pointer coordinates through the current displayed rectangle and model dimensions. Keyboard selection, pointer capture and stroke cleanup are unchanged. No domain action, World tick or Random draw was added to resizing.
- Background-frame throttling may postpone a resize redraw until the browser provides a frame; setup/model updates still draw synchronously. This does not promise immediate offscreen repainting.

## Executed independent checks

`bun test tests/ui-authoring.test.ts tests/ui-authoring-next.test.ts tests/ui-chart-authoring.test.ts` passed: **19 tests, 108 assertions**. The coordinator owns the full type/build checks; this reviewer did not duplicate or claim them.

Two temporary fixtures used the public `defineUI` API in an independently owned real T3 Chrome tab on the running Svelte development server. They imported the public UI entry, mounted their own isolated container and were removed afterward. No production model, shared tab or source file was changed.

1. **Dispose during resize delivery:** after setup, a consumer observer removed the mounted session while the renderer had resize work pending. After 150ms: one model created, one model disposed, zero model steps, no window errors, no width/height mutation on the detached canvas, and both canvas/container removed. A MutationObserver watched the detached canvas attributes; it observed zero post-removal buffer writes.
2. **Projection replacement during pending resize:** a deliberately adversarial consumer observer invoked a public action changing a two-cell red projection to three green cells. The final canvas was 1200×400, its center pixel was `[0,255,0,255]`, accessible text described three cells, and no model step occurred. The queued resize did not restore stale projection data.

The second fixture **did emit one ResizeObserver warning**: the test itself invoked the projection-changing action synchronously inside its own observer callback, and ordinary `update` resizes its buffer synchronously. That caller-induced write during resize delivery is a preexisting boundary outside normal host action/playback paths; the patch intentionally defers only the renderer's own observer writes. This result is not a claim that every possible consumer callback arrangement is warning-free. It does not invalidate the verified latest-data/disposal outcomes, and no additional change is proposed without a normal-host reproduction.

The reviewer closed its own browser tab. It did not inspect replacement screenshots or claim Playwright MCP availability. The main browser verifier and Mesa's independent replay must establish zero errors for their explicitly tested normal Setup/resize/playback/switch flows.
