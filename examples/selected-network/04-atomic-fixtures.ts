import assert from "node:assert/strict";
import { create as createVirus } from "../../experiments/virus-on-a-network/model.ts";
import { create as createDiffusion } from "../../experiments/diffusion-on-a-directed-network/model.ts";

const virus = createVirus({ numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1 });
const original = virus.read();
assert.throws(() => virus.setStates([]));
assert.throws(() => virus.setConnections([{ from: 0, to: 1 }, { from: 1, to: 0 }]));
assert.throws(() => virus.setConnections([{ from: 0, to: 10 }]));
assert.throws(() => virus.setRules({ recoveryChance: 100 }));
assert.throws(() => virus.advance(-1));
assert.deepEqual(virus.read(), original);
const diffusion = createDiffusion({ gridSize: 3 });
const before = diffusion.read();
assert.throws(() => diffusion.setActiveEdges([{ from: 0, to: 4 }]));
assert.throws(() => diffusion.setActiveEdges([{ from: 0, to: 1 }, { from: 0, to: 1 }]));
assert.throws(() => diffusion.setValues([NaN, 0, 0, 0, 0, 0, 0, 0, 0]));
assert.throws(() => diffusion.setRules({ diffusionRate: 101 }));
assert.deepEqual(diffusion.read(), before);
