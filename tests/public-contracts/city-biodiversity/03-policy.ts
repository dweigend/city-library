import assert from "node:assert/strict";
import { model } from "../../../models/city-biodiversity/model.ts";

const r = (value: number) => Number(value.toFixed(4));
function eastAt(setup: (instance: ReturnType<typeof model.create>) => void) {
  const instance = model.create();
  setup(instance);
  instance.advance(10);
  const tenth = r(instance.read().eastOccupancy);
  instance.advance(40);
  return { tenth, fiftieth: r(instance.read().eastOccupancy), mean: r(instance.read().meanOccupancy), state: instance.read() };
}

// Experiment A: one extra hectare as a stepping stone or as a larger eastern patch.
const stone = eastAt(instance => instance.setRestorationPlan("stepping-stone"));
assert.equal(stone.tenth, 0.3734);
assert.equal(stone.fiftieth, 0.4404);
assert.ok(stone.state.patches.some(patch => patch.id === "stepping-stone"));
const enlarge = eastAt(instance => instance.setRestorationPlan("enlarge-east"));
assert.equal(enlarge.tenth, 0.3559);
assert.equal(enlarge.fiftieth, 0.4674);
assert.equal(enlarge.state.patches.find(patch => patch.id === "east-a")!.areaHa, 2.5);

// Experiment B: remove the bridge, or make the city harder to cross.
const noBridge = eastAt(instance => instance.setPatchHabitat("bridge", false));
assert.equal(noBridge.tenth, 0.2086);
assert.equal(noBridge.fiftieth, 0.333);
const harder = eastAt(instance => instance.setPermeability(0.5));
assert.equal(harder.tenth, 0.0011);
assert.equal(harder.mean, 0.1656);
assert.equal(eastAt(instance => instance.setVegetationQuality(0.7)).mean, 0.7618);

// Restoring a removed patch starts empty; switching plans removes the stone.
const live = model.create();
live.setPatchHabitat("bridge", false);
live.advance(5);
live.setPatchHabitat("bridge", true);
assert.equal(live.read().patches.find(patch => patch.id === "bridge")!.occupancy, 0);
live.setRestorationPlan("stepping-stone");
live.setRestorationPlan("none");
assert.equal(live.read().patches.length, 7);
console.log("city-biodiversity restoration, bridge and permeability experiments passed");
