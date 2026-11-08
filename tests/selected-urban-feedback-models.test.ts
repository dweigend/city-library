import { expect, test } from "bun:test";
import { Random } from "city-library";
import { create as feedback } from "../experiments/urban-suite-positive-feedback/model.ts";
import { create as path } from "../experiments/urban-suite-path-dependence/model.ts";
import { create as cells, type CountRule, type Neighborhood } from "../experiments/urban-suite-cells/model.ts";

test("Feedback smooths the old field before powers and maximum normalization", () => {
  const model = feedback({ alpha: 2, mooreNeighborhood: true });
  model.setActivities(model.read().cells.map(cell => cell.y === 10 && [9, 10].includes(cell.x) ? 1 : 0));
  const stream = model.read().randomState;
  model.advance();
  const state = model.read();
  expect(state.cells.filter(cell => cell.activity === 1)).toHaveLength(6);
  expect(state.cells.filter(cell => cell.activity === 0.25)).toHaveLength(6);
  expect(state.totalActivity).toBeCloseTo(7.5, 12);
  expect(state.activityDistribution.slice(0, 6)).toEqual(Array(6).fill(1));
  expect(state.randomState).toEqual(stream);
});

test("Feedback preserves alpha-zero powers and reports positive-alpha zero normalization failure", () => {
  const model = feedback({ alpha: 0 });
  model.setActivities(model.read().cells.map(() => 0));
  model.setRules({ alpha: 2 });
  const failure = model.read();
  expect(() => model.advance()).toThrow("normalize");
  expect(model.read()).toEqual(failure);
  model.setRules({ alpha: 0 });
  model.advance();
  expect(model.read().totalActivity).toBe(441);
  expect(model.read().tick).toBe(1);
  model.setRules({ alpha: 1 });
  const field = model.read().cells;
  model.advance();
  expect(model.read().cells).toEqual(field);
  expect(model.read().tick).toBe(2);
});

test("Path repeats every search attempt after certain settlement and retains cardinal cells", () => {
  const model = path({ seed: 12, initialFirms: 0, increasingReturns: 0, attempts: 3 });
  model.setQualities(model.read().cells.map(() => 1));
  model.setFirms([{ x: 0, y: 0, heading: 0, movedIn: false }]);
  model.advance();
  const stream = Random.add({ seed: 12 });
  for (let i = 0; i < 121 + 3 * 3; i++) stream.number(); // setup qualities, then 2 turns + acceptance per attempt
  expect(model.read().randomState).toEqual(stream.state);
  expect(model.read().counts).toEqual({ firms: 1, settled: 1, searching: 0 });
  expect(Number.isInteger(model.read().firms[0]!.x)).toBe(true);
  expect(Number.isInteger(model.read().firms[0]!.y)).toBe(true);
  const once = path({ seed: 12, initialFirms: 0, increasingReturns: 0, attempts: 1 });
  once.setQualities(once.read().cells.map(() => 1));
  once.setFirms([{ x: 0, y: 0, heading: 0, movedIn: false }]);
  once.advance();
  expect([model.read().firms[0]!.x, model.read().firms[0]!.y]).not.toEqual([once.read().firms[0]!.x, once.read().firms[0]!.y]);
});

test("Path radius counts include searching/self firms across wrapping edges and refresh at go", () => {
  const model = path({ initialFirms: 0, increasingReturns: 0, regionSize: 0 });
  model.setQualities(model.read().cells.map(() => 1));
  model.setFirms([
    { x: 5, y: 0, heading: 0, movedIn: true },
    { x: -5, y: 0, heading: 0, movedIn: true },
  ]);
  expect(model.read().largestPopulation).toBe(1);
  const before = model.read();
  model.setRules({ regionSize: 1 });
  expect(model.read().largestPopulation).toBe(1); // cached source global, not rewritten by the slider
  expect(model.read().randomState).toEqual(before.randomState);
  model.advance();
  expect(model.read().largestPopulation).toBe(2);
  expect(model.read().firms.map(firm => firm.x)).toEqual([5, -5]);
  model.disturb();
  expect(model.read().largestPopulation).toBe(2); // searching firms still belong to the population
});

test("Path births one child and errors atomically when no parent exists", () => {
  const model = path({ initialFirms: 0, increasingReturns: 0, birth: true });
  const empty = model.read();
  expect(() => model.advance()).toThrow("parent");
  expect(model.read()).toEqual(empty);
  model.setQualities(model.read().cells.map(() => 1));
  model.setFirms([{ x: 2, y: 3, heading: 90, movedIn: true }]);
  model.advance();
  expect(model.read().counts.firms).toBe(2);
  expect(model.read().firms[0]).toMatchObject({ x: 2, y: 3, movedIn: true });
  model.advance();
  expect(model.read().counts.firms).toBe(3);
});

test("Path histogram counts occupied patches rather than firms and exposes all pure ties", () => {
  const model = path({ initialFirms: 0 });
  model.setFirms([
    { x: 0, y: 0, heading: 0, movedIn: true },
    { x: 0, y: 0, heading: 0, movedIn: false },
    { x: 1, y: 0, heading: 0, movedIn: false },
  ]);
  const observed = model.read();
  expect(observed.histogram.counts.reduce((a, b) => a + b, 0)).toBe(2);
  expect(observed.histogram.edges.at(-1)).toBe(3);
  expect(observed.winningAreas).toHaveLength(1);
  expect(observed.winningAreas[0]).toMatchObject({ x: 0, y: 0, occupants: 2 });
  model.read(); model.read();
  expect(model.read()).toEqual(observed);
  const warnings = path({ initialFirms: 121, distribute: true });
  expect(warnings.read().counts.firms).toBe(0);
  expect(warnings.read().warnings).toEqual(["Can't distribute, fewer fields than people."]);
});

test("Cells composes all five original neighborhoods and closed count rules", () => {
  for (const [neighborhood, expected] of [["von-neumann", 5], ["moore", 9], ["displaced-von-n", 5], ["h", 7], ["moore-von-n", 13]] as const satisfies readonly (readonly [Neighborhood, number])[]) {
    const model = cells({ neighborhood });
    model.advance();
    expect(model.read().counts.on).toBe(expected);
  }
  for (const rule of ["> 0", "= 1", "<= 2"] as const satisfies readonly CountRule[]) {
    const model = cells({ countRule: rule });
    model.setCells(model.read().cells.map(cell => ({ on: cell.y === 0 && [-1, 1].includes(cell.x), onTime: 0, seed: false })));
    model.advance();
    expect(model.read().cells.find(cell => cell.x === 0 && cell.y === 0)!.on).toBe(rule !== "= 1");
    expect(model.read().cells.find(cell => cell.x === 20 && cell.y === 20)!.on).toBe(false); // count>0 guard
  }
});

test("Cells probability endpoints consume qualifying trials but no trial for impossible counts", () => {
  for (const probability of [0, 100]) {
    const model = cells({ seed: 19, probability, ageLimit: 0 });
    model.advance();
    const oracle = Random.add({ seed: 19 });
    for (let i = 0; i < 4; i++) oracle.number();
    expect(model.read().randomState).toEqual(oracle.state);
    expect(model.read().counts.on).toBe(probability === 0 ? 1 : 5);
  }
  const empty = cells({ countRule: "<= 2" });
  empty.setCells(empty.read().cells.map(() => ({ on: false, onTime: 0, seed: false })));
  const stream = empty.read().randomState;
  empty.advance();
  expect(empty.read().randomState).toEqual(stream);
  expect(empty.read().tick).toBe(1);
  expect(empty.read().counts.on).toBe(0);
});

test("Cells default deterministic growth matches the executed original 42-step invariant", () => {
  const model = cells();
  model.advance(42);
  expect(model.read().counts.on).toBe(1697);
  expect(model.read().tick).toBe(42);
});

test("Cells ages against pre-step ticks, retains dead seed markers and ordinary black reactivation", () => {
  const model = cells({ probability: 0, ageLimit: 1 });
  model.advance(2);
  expect(model.read().counts.on).toBe(1);
  model.advance();
  expect(model.read().counts.on).toBe(0);
  expect(model.read().cells.find(cell => cell.x === 0 && cell.y === 0)).toMatchObject({ seed: true, on: false, onTime: 0, colorNumber: 0 });
  model.setCells(model.read().cells.map(cell => ({
    on: cell.x === -1 && cell.y === 0, onTime: cell.x === -1 && cell.y === 0 ? 3 : 0,
    seed: cell.seed, colorNumber: 0,
  })));
  model.setRules({ probability: 100 });
  model.advance();
  expect(model.read().cells.find(cell => cell.x === 0 && cell.y === 0)).toMatchObject({ seed: true, on: true, onTime: 3, colorNumber: 0 });
});

test("Cells scientific recolor overwrites nonseed cycle colors but retains seed memory", () => {
  const model = cells();
  model.advance();
  expect(model.read().cells.find(cell => cell.x === 1 && cell.y === 0)!.colorNumber).toBe(100);
  const stream = model.read().randomState;
  model.cycleColors();
  expect(model.read().randomState).toEqual(stream);
  expect(model.read().tick).toBe(1);
  expect(model.read().cells.find(cell => cell.x === 1 && cell.y === 0)!.colorNumber).toBe(99.99);
  model.advance();
  expect(model.read().cells.find(cell => cell.x === 1 && cell.y === 0)!.colorNumber).toBe(100);
  expect(model.read().cells.find(cell => cell.seed)!.colorNumber).toBeCloseTo(9.89, 12);
  const before = model.read();
  model.addRandomSeed();
  expect(model.read().tick).toBe(before.tick);
  expect(model.read().cells.some(cell => cell.seed && cell.onTime === 2 && cell.colorNumber === 9.9)).toBe(true);
});

test("Feedback models reject malformed mutations atomically without invoking data accessors", () => {
  const f = feedback(), p = path({ initialFirms: 0 }), c = cells();
  let accessed = false;
  const invalidFirm = { x: 0, y: 0, heading: 0, get movedIn() { accessed = true; return true; } };
  const invalidCells = c.read().cells.map(() => ({ on: false, onTime: 0, seed: false, colorNumber: 140 }));
  for (const mutate of [
    () => f.setActivities(f.read().cells.map(() => 0)),
    () => f.setRules({ alpha: NaN }),
    () => p.setFirms([invalidFirm]),
    () => p.setFirms([{ x: 0, y: 0, heading: 45, movedIn: false }]),
    () => p.setRules({ attempts: 0 }),
    () => c.setCells(invalidCells),
    () => c.setRules({ probability: 100.5 }),
    () => c.setCells(c.read().cells.map(() => ({ on: false, onTime: 1, seed: false }))),
    () => c.advance(-1),
  ]) {
    const before = [f.read(), p.read(), c.read()];
    expect(mutate).toThrow();
    expect([f.read(), p.read(), c.read()]).toEqual(before);
  }
  expect(accessed).toBe(false);
  const snapshot = c.read();
  expect(Object.isFrozen(snapshot.cells[0])).toBe(true);
  expect(Object.isFrozen(snapshot.history)).toBe(true);
  const separate = cells({ probability: 0, ageLimit: 0 });
  separate.advance(1002);
  expect(separate.read().history).toHaveLength(1001);
  expect(separate.read().history[0]!.tick).toBe(0);
  expect(separate.read().history[1]!.tick).toBe(3);
  expect(c.read()).toEqual(snapshot);
});
