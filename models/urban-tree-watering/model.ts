/** Original daily priority-allocation teaching model; liters are synthetic moisture equivalents. */
import { Agent, Random, World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface TreeParameters { treeCount: number; dailyLiters: number; seed: number }
export const inputs: Inputs<TreeParameters> = {
  treeCount: { kind: "number", default: 10, min: 2, max: 40, integer: true },
  dailyLiters: { kind: "number", default: 20, min: 0, max: 100, integer: true },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
};
export function create(options: Partial<TreeParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const trees = Array.from({ length: settings.treeCount }, (_, index) => world.add(Agent.create({
    label: `Tree ${index + 1}`, moistureLiters: Math.floor(random.number() * 10), receivedLiters: 0,
  })));
  const moistureCapacityLiters = 12;
  const dailyLossLiters = 2;
  let totalWaterLiters = 0;
  const measure = measurements.define((members: typeof trees) => ({
    meanMoisture: members.reduce((sum, tree) => sum + tree.moistureLiters, 0) / members.length,
    wateredLiters: members.reduce((sum, tree) => sum + tree.receivedLiters, 0),
  }));
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(trees) });
  }
  function step() {
    let remainingLiters = settings.dailyLiters;
    world.activate(trees, ({ self }) => {
      const amount = Math.min(remainingLiters, moistureCapacityLiters - self.moistureLiters);
      self.receivedLiters = amount;
      self.moistureLiters += amount;
      remainingLiters -= amount;
    }, { order: "priority", priority: tree => tree.moistureLiters });
    // Evapotranspiration is an invented uniform loss, applied after watering.
    world.activate(trees, ({ self }) => {
      self.moistureLiters = Math.max(0, self.moistureLiters - dailyLossLiters);
    }, { order: "fixed" });
    totalWaterLiters += settings.dailyLiters - remainingLiters;
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setDailyLiters(value: number) {
      settings = parseParameters(inputs, { ...settings, dailyLiters: value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        ...measure.read(trees),
        totalWaterLiters,
        moistureCapacityLiters,
        trees: Object.freeze(trees.map(tree => Object.freeze({
          id: tree.id,
          label: tree.label,
          moistureLiters: tree.moistureLiters,
          receivedLiters: tree.receivedLiters,
        }))),
        history: history.samples,
        done: false,
      });
    },
  };
}
export const model = { title: "Urban Tree Watering",
  description: "A daily water allowance goes to the driest street trees first. Illustrative only.", inputs, create,
} satisfies Definition<TreeParameters, ReturnType<typeof create>>;
