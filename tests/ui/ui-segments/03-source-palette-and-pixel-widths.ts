import { strict as assert } from "node:assert";
import { netLogoColor } from "../../../ui/index.ts";
import type { SpatialData, SpatialSegment } from "../../../ui/index.ts";
const traces = Object.freeze([
  { from: { x: -2, y: 0 }, to: { x: 0, y: 1 }, colorNumber: 0, width: 1.5 },
  { from: { x: 0, y: 1 }, to: { x: 2, y: 0 }, colorNumber: 9.9, width: 1 },
]);
const segments: readonly SpatialSegment[] = traces.map(t => ({ from: t.from, to: t.to, color: netLogoColor(t.colorNumber), width: t.width }));
const view: SpatialData = { width: 10, height: 10, agents: [], segments };
assert.equal(view.segments![0]!.color, "#000000");
assert.equal(view.segments![1]!.color, "#ffffff");
assert.deepEqual(view.segments!.map(s => s.width), [1.5, 1]);
assert.equal(traces[0]!.colorNumber, 0); // color projection leaves the source record intact
