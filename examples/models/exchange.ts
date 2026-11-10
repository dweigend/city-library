import { Agent, Random, World, run } from "city-library";

export interface ExchangeOptions {
  count?: number;
  initialEnergy?: number;
  seed?: number;
}

/** Headless example composition; the HTML host uses these same model actions. */
export function createExchangeModel(options: ExchangeOptions = {}) {
  const count = options.count ?? 24;
  const initialEnergy = options.initialEnergy ?? 10;
  const seed = options.seed ?? 1;
  if (!Number.isSafeInteger(count) || count < 2 || count > 200) {
    throw new RangeError("Agent count must be an integer from 2 to 200.");
  }
  if (!Number.isSafeInteger(initialEnergy) || initialEnergy < 0 || initialEnergy > 1_000_000) {
    throw new RangeError("Initial energy must be an integer from 0 to 1,000,000.");
  }
  if (!Number.isInteger(seed) || seed < -0x80000000 || seed > 0xffffffff) {
    throw new RangeError("Seed must be a signed or unsigned 32-bit integer.");
  }

  const random = Random.create({ seed });
  const world = World.create({ random });
  const agents = Array.from({ length: count }, (_, index) => Agent.create({
    label: `Agent ${index + 1}`,
    energy: initialEnergy,
    sent: 0,
    received: 0,
  }));
  world.add(agents);
  let selected = agents[0]!;
  let lastPair: readonly string[] = Object.freeze([]);

  function step() {
    const population = world.agents;
    if (population.length < 2) { lastPair = Object.freeze([]); return; }
    const [donor, receiver] = random.sample(population, { count: 2 });
    if (!donor || !receiver) throw new Error("Expected two sampled population members.");
    // A typed caller population retains the canonical identities selected by Random.
    const from = agents.find((agent) => agent === donor)!;
    const to = agents.find((agent) => agent === receiver)!;
    lastPair = Object.freeze([from.id, to.id]);
    if (from.energy === 0) return;
    from.energy -= 1;
    to.energy += 1;
    from.sent += 1;
    to.received += 1;
  }

  return {
    advance(steps = 1) { run(world, step, steps); },
    select(id: string) {
      const found = agents.find((agent) => agent.id === id);
      if (!found) throw new RangeError("Select an agent from this exchange model.");
      selected = found;
    },
    copy() {
      selected = selected.copy();
      selected.label = `Agent ${agents.length + 1}`;
      agents.push(selected);
      lastPair = Object.freeze([]);
    },
    toggleMembership() {
      if (!selected.alive) throw new Error("A deleted agent cannot be attached.");
      if (selected.world === world) world.delete(selected);
      else world.add(selected);
      lastPair = Object.freeze([]);
    },
    delete() {
      selected.delete();
      lastPair = Object.freeze([]);
    },
    failStep() {
      run(world, () => {
        step();
        throw new Error("Intentional step failure: exchange effects remain; tick did not advance.");
      });
    },
    read() {
      const population = world.agents;
      const registered = agents.filter((agent) => agent.world === world);
      return Object.freeze({
        id: selected.id,
        energy: selected.energy,
        alive: selected.alive,
        attached: selected.world === world,
        x: selected.x,
        y: selected.y,
        heading: selected.heading,
        tick: world.tick.value,
        seed: random.seed,
        agentCount: population.length,
        totalEnergy: registered.reduce((sum, agent) => sum + agent.energy, 0),
        minimumEnergy: registered.length ? Math.min(...registered.map((agent) => agent.energy)) : 0,
        maximumEnergy: registered.length ? Math.max(...registered.map((agent) => agent.energy)) : 0,
        lastInteractionIds: lastPair,
        randomState: random.state,
        agents: Object.freeze(agents.map((agent) => Object.freeze({
          id: agent.id,
          label: agent.label,
          energy: agent.energy,
          sent: agent.sent,
          received: agent.received,
          alive: agent.alive,
          attached: agent.world === world,
          selected: agent === selected,
          active: lastPair.includes(agent.id),
          x: agent.x,
          y: agent.y,
          heading: agent.heading,
        }))),
      });
    },
  };
}

export type ExchangeSnapshot = ReturnType<ReturnType<typeof createExchangeModel>["read"]>;
