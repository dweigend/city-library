import { strict as assert } from "node:assert";
import type { SpatialData } from "../../ui/index.ts";
const legacy: SpatialData = { width: 10, height: 10, agents: [] };
const empty: SpatialData = { ...legacy, segments: [] };
const invisible: SpatialData = { ...legacy, segments: [{ from: { x: -2, y: 0 }, to: { x: 2, y: 0 }, width: 0 }] };
assert.equal(legacy.segments, undefined);
assert.equal(empty.segments!.length, 0);
assert.equal(invisible.segments![0]!.width, 0);
// Width zero is an omitted stroke; it must never reuse a previous canvas width.
assert.deepEqual(invisible.segments![0]!.to, { x: 2, y: 0 });
