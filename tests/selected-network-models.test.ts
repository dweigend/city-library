import { expect, test } from "bun:test";
import { create as createVirus } from "../experiments/virus-on-a-network/model.ts";
import { create as createDiffusion } from "../experiments/diffusion-on-a-directed-network/model.ts";

test("directed transport splits old value once, retains sinks and conserves quantity", () => {
  const model = createDiffusion({ gridSize: 3, diffusionRate: 50 });
  model.setValues([8, 0, 0, 0, 0, 0, 0, 0, 0]);
  model.setActiveLinks([{ from: 0, to: 1 }, { from: 0, to: 3 }]);
  const random = model.read().randomState;
  model.advance();
  expect(model.read().nodes.map(node => node.value)).toEqual([4, 2, 0, 2, 0, 0, 0, 0, 0]);
  expect(model.read().edges.filter(edge => edge.active).map(edge => edge.currentFlow)).toEqual([2, 2]);
  model.advance();
  expect(model.read().nodes.map(node => node.value)).toEqual([2, 3, 0, 3, 0, 0, 0, 0, 0]);
  expect(model.read().totalValue).toBe(8);
  expect(model.read().randomState).toEqual(random);
  const normal = createDiffusion();
  normal.advance(100);
  expect(Math.abs(normal.read().totalValue - 81)).toBeLessThan(1e-10);
  expect(normal.read().histogram.counts.reduce((a, b) => a + b, 0)).toBe(81);
});

test("rewire retains edge identity, inactive flow and stale reporters until the next go", () => {
  const model = createDiffusion({ gridSize: 3, diffusionRate: 50, seed: 1 });
  model.setValues([8, 0, 0, 0, 0, 0, 0, 0, 0]);
  model.setActiveLinks([{ from: 0, to: 1 }]);
  model.advance();
  const before = model.read();
  expect(before.maxFlow).toBe(4);
  expect(before.meanFlow).toBe(4);
  model.rewire();
  const switched = model.read();
  expect(switched.edges.find(edge => edge.fromIndex === 0 && edge.toIndex === 1)?.active).toBe(false);
  expect(switched.edges.map(edge => [edge.id, edge.currentFlow])).toEqual(before.edges.map(edge => [edge.id, edge.currentFlow]));
  expect(switched.maxFlow).toBe(4);
  expect(switched.meanFlow).toBe(4);
  expect(switched.tick).toBe(before.tick);
  expect(switched.history).toEqual(before.history);
  model.advance();
  expect(model.read().edges.find(edge => edge.fromIndex === 0 && edge.toIndex === 1)?.currentFlow).toBe(4);
  expect(model.read().maxFlow).toBe(0);
  expect(model.read().meanFlow).toBe(0);
  // Fixed Mulberry fixture confirms that the just-deactivated edge is eligible.
  const noOp = createDiffusion({ gridSize: 3, seed: 71 });
  noOp.setActiveLinks([{ from: 0, to: 1 }]);
  const state = noOp.read();
  noOp.rewire();
  expect(noOp.read().edges).toEqual(state.edges);
  expect(noOp.read().randomState).not.toEqual(state.randomState);
});

test("no-active and zero-total diffusion keep finite observations and successful clocks", () => {
  const model = createDiffusion({ gridSize: 3, diffusionRate: 0 });
  model.setActiveLinks([]);
  model.setValues(Array<number>(9).fill(0));
  const before = model.read();
  model.rewire();
  expect(model.read()).toEqual(before);
  model.advance(4);
  expect(model.read().tick).toBe(4);
  expect(model.read().done).toBe(false);
  expect(model.read().totalValue).toBe(0);
  expect(model.read().histogram.counts.reduce((a, b) => a + b, 0)).toBe(9);
  expect(model.read().randomState).toEqual(before.randomState);
});

test("Virus allows newly infected nodes to recover in the same completed tick", () => {
  // This target-seed fixture is not a cross-engine seed assertion.
  const model = createVirus({ seed: 15, numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1, spreadChance: 10, recoveryChance: 10, resistanceChance: 100 });
  model.setConnections([{ from: 0, to: 1 }]);
  model.setStates(Array.from({ length: 10 }, (_, index) => ({ status: index === 0 ? "infected" : index === 1 ? "susceptible" : "resistant", checkTimer: 0 })));
  model.advance();
  expect(model.read().tick).toBe(1);
  expect(model.read().nodes[0]!.status).toBe("infected");
  expect(model.read().nodes[1]!.status).toBe("resistant");
  expect(model.read().counts).toEqual({ susceptible: 0, infected: 1, resistant: 9 });
});

test("Virus freezes spread senders and quantizes fractional recovery with integer draws", () => {
  const chain = createVirus({ seed: 15, numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1, spreadChance: 10, recoveryChance: 0 });
  chain.setConnections([{ from: 0, to: 1 }, { from: 1, to: 2 }]);
  chain.setStates(Array.from({ length: 10 }, (_, index) => ({ status: index === 0 ? "infected" : index <= 2 ? "susceptible" : "resistant", checkTimer: 0 })));
  chain.advance();
  expect(chain.read().nodes[1]!.status).toBe("infected");
  expect(chain.read().nodes[2]!.status).toBe("susceptible");
  const fractional = createVirus({ numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1, spreadChance: 0, recoveryChance: 0.1, resistanceChance: 100 });
  const integer = createVirus({ numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1, spreadChance: 0, recoveryChance: 1, resistanceChance: 100 });
  for (const model of [fractional, integer]) {
    model.setConnections([]);
    model.setStates(Array.from({ length: 10 }, () => ({ status: "infected", checkTimer: 0 })));
    model.advance(100);
  }
  expect(fractional.read().nodes.map(node => [node.status, node.checkTimer])).toEqual(integer.read().nodes.map(node => [node.status, node.checkTimer]));
  expect(fractional.read().randomState).toEqual(integer.read().randomState);
  expect(fractional.read().counts.resistant).toBeGreaterThan(0);
});

test("Virus extinction is preflight-only; rule changes preserve timers and permanent resistance", () => {
  const model = createVirus({ numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1, checkFrequency: 20, spreadChance: 10, recoveryChance: 0 });
  model.setConnections([{ from: 0, to: 1 }]);
  model.setStates(Array.from({ length: 10 }, (_, index) => ({ status: index === 0 ? "infected" : "resistant", checkTimer: 19 })));
  model.setRules({ checkFrequency: 2 });
  expect(model.read().nodes.every(node => node.checkTimer === 19)).toBe(true);
  const identity = model.read().nodes.map(node => node.id);
  model.advance(5);
  expect(model.read().counts.resistant).toBe(9);
  expect(model.read().nodes.map(node => node.id)).toEqual(identity);
  expect(model.read().counts.infected).toBe(1);
  model.setStates(Array.from({ length: 10 }, () => ({ status: "resistant", checkTimer: 19 })));
  const stopped = model.read();
  model.advance(10);
  expect(model.read()).toEqual(stopped);
});

test("network fixtures reject sparse/accessor/malformed data before any mutation or RNG draw", () => {
  const virus = createVirus({ numberOfNodes: 10, averageNodeDegree: 1, initialOutbreakSize: 1 });
  const original = virus.read();
  expect(() => virus.setStates(Array(10))).toThrow();
  const states = Array.from({ length: 10 }, () => ({ status: "infected" as const, checkTimer: 0 }));
  Object.defineProperty(states[9], "status", { get() { throw new Error("must not invoke accessor"); } });
  expect(() => virus.setStates(states)).toThrow(TypeError);
  expect(() => virus.setConnections([{ from: 0, to: 1 }, { from: 1, to: 0 }])).toThrow();
  expect(() => virus.setRules({ recoveryChance: 0.15 })).toThrow();
  expect(() => createVirus({ numberOfNodes: 10, averageNodeDegree: 10 })).toThrow();
  expect(() => createVirus({ numberOfNodes: 10, initialOutbreakSize: 11 })).toThrow();
  expect(virus.read()).toEqual(original);
  const diffusion = createDiffusion({ gridSize: 3 });
  const before = diffusion.read();
  expect(() => diffusion.setValues(Array(9))).toThrow();
  expect(() => diffusion.setValues([Number.MAX_VALUE, Number.MAX_VALUE, 0, 0, 0, 0, 0, 0, 0])).toThrow();
  expect(() => diffusion.setActiveLinks([{ from: 0, to: 1 }, { from: 0, to: 4 }])).toThrow();
  expect(() => diffusion.setRules({ diffusionRate: NaN })).toThrow();
  expect(diffusion.read()).toEqual(before);
  expect(Object.isFrozen(before.nodes)).toBe(true);
  expect(Object.isFrozen(before.edges[0])).toBe(true);
});
