# Independent flat-scene infrastructure refactor

This scoped pass follows implementation `f40fc4e8577040252cba04335b4b14ec65eec060`. The refactor author did not implement that slice. The exact local `refactor-library` skill, its shared workflow and decision examples, full coding standards, and global frontend-design, frontend-design-shadcn-svelte and shadcn-svelte instructions were read. This pass changes no public schema, model, observation producer, palette or host control.

## Findings and changes

The clarity refactor extracts a small private geometry module from the canvas renderer. Canvas projection, symbol dimensions and rotation now have one implementation shared by painting, validation and picking. The renderer continues to own DOM events, drawing, selection and disposal. Input-shape validation remains separate in `spatial-data.ts`. No scene DSL or custom drawing callback was introduced. `spatial-symbols.ts` and the scientific palette required no changes.

Three behavior corrections accompany that extraction and are distinct from the refactor:

1. Finite input fields can overflow during aspect, coordinate, extent, heading or stroke conversion. A candidate buffer and its derived geometry are now checked before replacing the current observation, buffer dimensions, selection or drawing state. Nonfinite derived values reject with `RangeError`. No arbitrary coordinate maximum was introduced. Positive buffers round to at least one buffer pixel rather than disappearing at extreme aspect ratios.
2. Painting preserves the legacy two-buffer-pixel minimum for CSS-sized symbols. Diagram picking now uses those same dimensions, device-pixel ratio and rounded buffer axes. Previously a subpixel requested size could paint a visible symbol that could not be picked over most of its visible area.
3. A miss in a mixed rectangle/diamond diagram previously fell through to legacy nearest-agent selection. That could select a dot far outside its painted bounds. New diagrams now use reverse painter order and actual shape bounds exclusively. Scenes containing only legacy circles/triangles retain their original nearest-agent tolerance and tie ordering.

The existing ResizeObserver frame deferral, frame coalescing, disposal cancellation and late-callback guard are unchanged. No model state, simulation time, random draw or observation callback was added to rendering.

## Before/after fixtures

Fixed geometry assertions retain the original normal projection: a 100 by 50 scene in a 400 by 200 buffer maps (-25, 10) to (100, 60). A 10 by 4 rectangle remains 40 by 16 buffer pixels. The default CSS diameter remains 8 pixels at ratio 1 and 16 at ratio 2. Tests also cover rotated rectangles, nonuniform rounded axes, triangle/diamond corners, the two-pixel minimum, arithmetic overflow and unchanged detached input records.

These are numerical geometry fixtures, not screenshot comparisons. Model fixtures and RNG streams cannot be changed by this scoped source pass; independent model and browser acceptance remain separate evidence.

## Executed checks

- `bunx tsc --noEmit -p tsconfig.ui.json`: passed.
- `bun test tests/ui-des-scene-kernel.test.ts tests/ui-authoring.test.ts tests/ui-authoring-next.test.ts tests/ui-chart-authoring.test.ts`: 25 tests passed, 127 assertions. This includes the existing 19 tests and 108 assertions plus six geometry regressions.
- Each of the five frozen `examples/ui-des-scenes/*.ts` scripts: passed headlessly with unchanged assertions.

This report does not claim browser acceptance, actual-pixel inspection, full-workspace checks or independent approval of its own edits. The coordinator's separate real-browser gate must verify both public hosts, invalid derived projections preserving the previous canvas, normal scene geometry, minimum-size picking, mixed-scene misses, legacy picking, resize/disposal and model switching. Useful overflow probes are finite `heading: Number.MAX_VALUE`, an agent at `x: Number.MAX_VALUE` in a unit-wide scene, and a finite width/height pair whose ratio overflows. Existing source tests alone cannot establish those DOM-facing outcomes.
