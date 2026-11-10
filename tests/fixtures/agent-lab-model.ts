import { Agent, World, run } from "city-library";

/** Headless lifecycle/action fixture. Tests call actions and inspect detached snapshots. */
export function createTestModel(initialEnergy = 10) {
  if (!Number.isSafeInteger(initialEnergy) || initialEnergy < 0 || initialEnergy > 1_000_000) {
    throw new RangeError("Initial energy must be an integer from 0 to 1,000,000.");
  }

  const world = World.create();
  let selected = Agent.create({ energy: initialEnergy });
  world.add(selected);
  // Caller-owned inspection references; World remains the only membership owner.
  const inspectedAgents = [selected];

  function requireAttachedAgent() {
    if (!selected.alive) throw new Error("Create a new model after deleting the agent.");
    if (selected.world !== world) throw new Error("Attach the selected agent before stepping.");
  }

  function step() {
    selected.energy -= 1;
  }

  return {
    read() {
      return Object.freeze({
        id: selected.id,
        energy: selected.energy,
        tick: world.tick.value,
        alive: selected.alive,
        attached: selected.world === world,
        agentCount: world.agents.length,
        x: selected.x,
        y: selected.y,
        heading: selected.heading,
        agents: Object.freeze(inspectedAgents.map((agent) => Object.freeze({
          id: agent.id,
          energy: agent.energy,
          alive: agent.alive,
          attached: agent.world === world,
          selected: agent === selected,
          x: agent.x,
          y: agent.y,
          heading: agent.heading,
        }))),
      });
    },
    select(id: string) {
      const agent = inspectedAgents.find((candidate) => candidate.id === id);
      if (!agent) throw new RangeError("Select an agent from this test model.");
      selected = agent;
    },
    advance(stepCount: number) {
      requireAttachedAgent();
      run(world, step, stepCount);
    },
    toggleMembership() {
      if (!selected.alive) throw new Error("A deleted agent cannot be attached.");
      if (selected.world === world) world.delete(selected);
      else world.add(selected);
    },
    copy() {
      selected = selected.copy();
      inspectedAgents.push(selected);
    },
    delete() {
      selected.delete();
    },
    failStep() {
      requireAttachedAgent();
      run(world, () => {
        step();
        throw new Error("Intentional step failure: energy changed; tick did not advance.");
      });
    },
  };
}

export type TestModelSnapshot = ReturnType<ReturnType<typeof createTestModel>["read"]>;
