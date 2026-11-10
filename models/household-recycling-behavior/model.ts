/** Original synthetic peer-adoption rule. No empirical behavioral or causal claim. */
import { Agent, Graph, Random, World, run, twoPhase, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface RecyclingParameters {
  householdCount: number;
  influence: number;
  seed: number;
}
export const inputs: Inputs<RecyclingParameters> = {
  householdCount: { kind: "number", default: 12, min: 3, max: 40, integer: true },
  influence: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.1 },
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
};
export function create(options: Partial<RecyclingParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const households = Array.from({ length: settings.householdCount }, (_, index) => world.add(Agent.create({
    label: `Household ${index + 1}`, recycling: index === 0,
  })));
  const graph = Graph.create<(typeof households)[number]>();
  for (const household of households) graph.nodes.add(household);
  // Validated population is at least three; modulo always selects a ring member.
  households.forEach((household, index) => {
    graph.edges.add({ from: household, to: households[(index + 1) % households.length]! });
  });
  const measure = measurements.define((members: typeof households) => {
    const adopterCount = members.filter(household => household.recycling).length;
    return { adopterCount: adopterCount, share: adopterCount / members.length };
  });
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(households) });
  }
  function step() {
    const order: typeof households = [];
    world.activate(households, ({ self }) => {
      order.push(self);
    }, { order: "fixed" });
    twoPhase(order, {
      compute(household) {
        if (household.recycling) return true;
        const peers = graph.neighbors(household);
        const share = peers.filter(peer => peer.recycling).length / peers.length;
        const adoptionProbability = settings.influence * share;
        // Non-adopters draw even at zero probability, preserving seeded continuation.
        return random.number() < adoptionProbability;
      },
      commit(household, recycling) {
        household.recycling = recycling;
      },
    });
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
    setInfluence(value: number) {
      settings = parseParameters(inputs, { ...settings, influence: value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        ...measure.read(households),
        nodes: Object.freeze(households.map(household => Object.freeze({
          id: household.id, label: household.label, recycling: household.recycling,
        }))),
        edges: Object.freeze([...graph.edges].map(edge => Object.freeze({
          id: edge.id, from: edge.from.id, to: edge.to.id,
        }))),
        history: history.samples,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Household Recycling Behavior",
  description: "Illustrative seeded synchronous peer adoption on a ring; no empirical behavior prediction.", inputs,
  create,
} satisfies Definition<RecyclingParameters, ReturnType<typeof create>>;
