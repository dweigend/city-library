/** Original signal/cohort teaching rule, not a traffic-safety model. One step is one minute. */
import { Agent, World, run, twoPhase, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface CrossingParameters { pedestrians: number; greenMinutes: number }
export const inputs: Inputs<CrossingParameters> = {
  pedestrians: { kind: "number", default: 8, min: 1, max: 40, integer: true },
  greenMinutes: { kind: "number", default: 2, min: 1, max: 4, integer: true },
};
export function create(options: Partial<CrossingParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.add();
  const walkers = Array.from({ length: settings.pedestrians }, (_, index) => world.add(Agent.add({
    label: `Walker ${index + 1}`, stage: "waiting" as "waiting" | "crossing" | "arrived",
  })));
  const measure = measurements.define((people: typeof walkers) => ({
    waiting: people.filter(person => person.stage === "waiting").length,
    crossing: people.filter(person => person.stage === "crossing").length,
    arrived: people.filter(person => person.stage === "arrived").length,
  }));
  const history = storage.history({ capacity: 120 });
  function record() { history.add({ tick: world.tick.value, values: measure.read(walkers) }); }
  const redMinutes = 3;
  const cycleMinutes = redMinutes + settings.greenMinutes;
  function green() { return world.tick.value % cycleMinutes >= redMinutes; }
  function step() {
    const selected: typeof walkers = [];
    world.activate(walkers, ({ self }) => { selected.push(self); }, { order: "fixed" });
    const canCross = green();
    twoPhase(selected, {
      compute(person) {
        if (person.stage === "crossing") return "arrived";
        if (person.stage === "waiting" && canCross) return "crossing";
        return person.stage;
      },
      commit: (person, stage) => { person.stage = stage; },
    });
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) {
        if (walkers.every(person => person.stage === "arrived")) break;
        run(world, step); record();
      }
    },
    read() {
      return Object.freeze({ tick: world.tick.value, signal: green() ? "green" : "red", ...measure.read(walkers),
        people: Object.freeze(walkers.map(person => Object.freeze({ id: person.id, label: person.label, stage: person.stage }))),
        history: history.samples, done: walkers.every(person => person.stage === "arrived") });
    },
  };
}
export const model = { title: "Pedestrian Crossing Phases",
  description: "Illustrative synchronous signal/cohort transitions; no traffic-safety predictions.", inputs, create,
} satisfies Definition<CrossingParameters, ReturnType<typeof create>>;
