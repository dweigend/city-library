# Example-first baseline

Executed 2026-11-07 with Bun 1.4.2 before runtime edits. All five scripts were complete, with enabled public assertions.

## 01-regular-regression-and-tiny-wraps.ts

Command: `bun examples/grid-parcels/01-regular-regression-and-tiny-wraps.ts`. Exit: 1.

```text
SyntaxError: Export named 'topology' not found in module '/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations/index.ts'.

Bun v1.4.2 (Linux x64)
```

## 02-square-and-hex-field-rule.ts

Command: `bun examples/grid-parcels/02-square-and-hex-field-rule.ts`. Exit: 1.

```text
SyntaxError: Export named 'topology' not found in module '/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations/index.ts'.

Bun v1.4.2 (Linux x64)
```

## 03-irregular-lookup-ties-and-occupancy.ts

Command: `bun examples/grid-parcels/03-irregular-lookup-ties-and-occupancy.ts`. Exit: 1.

```text
SyntaxError: Export named 'topology' not found in module '/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations/index.ts'.

Bun v1.4.2 (Linux x64)
```

## 04-merge-and-source-provenance.ts

Command: `bun examples/grid-parcels/04-merge-and-source-provenance.ts`. Exit: 1.

```text
SyntaxError: Export named 'topology' not found in module '/home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations/index.ts'.

Bun v1.4.2 (Linux x64)
```

## 05-convex-split-and-rejections.ts

Command: `bun examples/grid-parcels/05-convex-split-and-rejections.ts`. Exit: 1.

```text
1 | import assert from "node:assert/strict";
2 | import { geometry, type PlanarPolygon } from "city-library";
3 | 
4 | const shape: PlanarPolygon = { type: "Polygon", coordinates: [[[0, 0], [4, 0], [4, 2], [0, 2], [0, 0]]] };
5 | const before = structuredClone(shape);
6 | const split = geometry.split({ shape, point: { x: 2, y: 0 }, direction: { x: 0, y: 1 }, minimumArea: 3 });
                           ^
TypeError: geometry.split is not a function. (In 'geometry.split({ shape, point: { x: 2, y: 0 }, direction: { x: 0, y: 1 }, minimumArea: 3 })', 'geometry.split' is undefined)
      at /home/david/.t3/worktrees/city-library/feat-grid-parcel-foundations/examples/grid-parcels/05-convex-split-and-rejections.ts:6:24

Bun v1.4.2 (Linux x64)
```

No runtime exports or stubs were added. The first four scripts fail at the absent `topology` root export; the fifth fails at absent `geometry.split`. This is missing-API evidence, not target behavior verification. SHA256SUMS records the frozen script contents.
