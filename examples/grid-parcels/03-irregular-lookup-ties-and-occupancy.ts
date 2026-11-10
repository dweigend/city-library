import assert from "node:assert/strict";
import { Agent, Grid, World, topology, type PlanarPolygon } from "city-library";

const polygons: PlanarPolygon[] = [
  { type: "Polygon", coordinates: [[[0, 0], [2, 0], [1, 2], [0, 2], [0, 0]]] },
  { type: "Polygon", coordinates: [[[2, 0], [3, 0], [3, 2], [1, 2], [2, 0]]] },
  { type: "Polygon", coordinates: [[[3, 2], [4, 2], [3, 3], [3, 2]]] },
];
const snapshot = structuredClone(polygons);
const layout = topology.fromPolygons({ polygons });
const [first, second, corner] = layout.cells;
assert.deepEqual(layout.cells, [0, 1, 2]);
assert.equal(layout.cellAt({ position: { x: 0.5, y: 1 } }), first);
assert.equal(layout.cellAt({ position: { x: 2.5, y: 1 } }), second);
assert.equal(layout.cellAt({ position: { x: 1.5, y: 1 } }), first);
assert.equal(layout.cellAt({ position: { x: 3, y: 2 } }), second);
assert.equal(layout.cellAt({ position: { x: -0.1, y: 1 } }), undefined);
assert.deepEqual(layout.neighbors({ cell: first! }), [second]);
assert.deepEqual(layout.neighbors({ cell: corner! }), []);
assert.deepEqual(layout.sharedBoundary({ firstCell: first!, secondCell: second! }), [[[2, 0], [1, 2]]]);
assert.deepEqual(layout.sharedBoundary({ firstCell: second!, secondCell: corner! }), []);
assert.equal(Object.isFrozen(layout.polygon({ cell: first! }).coordinates[0]![0]), true);
polygons[0] = polygons[2]!;
assert.deepEqual(layout.polygon({ cell: first! }), snapshot[0]);

const grid = Grid.create({ layout, state: { temperature: 12 } });
const agent = Agent.create({ name: "walker" }, { position: { x: 1.5, y: 1 } });
assert.equal(grid.fieldAt(agent), grid.fields[0]);
assert.deepEqual(grid.agentsAt(grid.fields[0]!, { source: [agent, agent] }), [agent]);
assert.throws(() => grid.agentsAt(grid.fields[0]!), TypeError);
const world = World.create();
world.add(grid);
world.add(agent);
assert.deepEqual(grid.agentsAt(grid.fields[0]!), [agent]);
agent.move({ to: { x: 2.5, y: 1 } });
assert.deepEqual(grid.agentsAt(grid.fields[0]!), []);
assert.deepEqual(grid.agentsAt(grid.fields[1]!), [agent]);
grid.fields[0]!.temperature = 22;
assert.equal(grid.fields[1]!.temperature, 12);
assert.deepEqual(layout.polygon({ cell: first! }), snapshot[0]);
assert.throws(() => layout.polygon({ cell: 99 }), RangeError);
assert.throws(() => layout.cellAt({ position: { x: NaN, y: 1 } }), RangeError);
