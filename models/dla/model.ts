/** NetLogo DLA (Wilensky, 1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface DLAParameters {
  width: number;
  height: number;
  seed: number;
  maxParticles: number;
  wiggleAngle: number;
  useWholeWorld: boolean;
}
export const inputs: Inputs<DLAParameters> = {
  width: { kind: "number", default: 171, min: 9, max: 301, integer: true },
  height: { kind: "number", default: 171, min: 9, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  maxParticles: {
    kind: "number",
    default: 100,
    min: 1,
    max: 300,
    integer: true,
  },
  wiggleAngle: { kind: "number", default: 60, min: 0, max: 360 },
  useWholeWorld: { kind: "boolean", default: true },
};
export function create(options: Partial<DLAParameters> = {}) {
  let settings = parameters(inputs, options);
  if (
    settings.width % 2 !== 1 ||
    settings.height % 2 !== 1 ||
    settings.width !== settings.height
  )
    throw new RangeError("DLA uses an odd square native world.");
  const random = Random.add({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: "hard" as const,
  };
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { occupied: false } });
  world.add(grid);
  let radius = 0;
  const maxPxcor = (settings.width - 1) / 2;
  const history: Readonly<{
    tick: number;
    radius: number;
    occupied: number;
    walkers: number;
  }>[] = [];
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        radius,
        occupied: grid.fields.filter((f) => f.occupied).length,
        walkers: world.agents.length,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    world.delete(world.agents);
    for (const field of grid.fields) field.occupied = false;
    grid.fieldAt({ x: 0, y: 0 })!.occupied = true;
    radius = 0;
    world.tick.reset();
    history.length = 0;
    record();
  }
  function makeNewAgent() {
    const agent = world.add(
      Agent.add(
        {},
        {
          position: { x: 0, y: 0 },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
    agent.move(settings.useWholeWorld ? maxPxcor : radius + 1.5);
    agent.rotate(180);
    return agent.id;
  }
  function wander(id: string) {
    const agent = world.agents.find((a) => a.id === id);
    if (!agent) throw new RangeError("Expected a live DLA walker id.");
    agent.rotate(
      random.number() * settings.wiggleAngle -
        random.number() * settings.wiggleAngle,
    );
    const forward = geometry.direction({ heading: agent.heading });
    const next = geometry.normalize(
      { x: agent.x + forward.x, y: agent.y + forward.y },
      { space, endpoints: "half-open" },
    );
    if (!next) {
      agent.delete();
      return;
    }
    agent.move(1);
  }
  function go() {
    while (
      world.agents.length < settings.maxParticles &&
      world.agents.length < world.tick.value
    )
      makeNewAgent();
    const walkers = world.agents;
    for (const agent of random.sample(walkers, {
      count: walkers.length,
      compatibility: "legacy-shuffle",
    })) {
      wander(agent.id);
      if (!agent.alive) continue;
      const field = grid.fieldAt(agent)!;
      if (
        grid.neighbors(field, { neighborhood: "moore" }).some((f) => f.occupied)
      ) {
        field.occupied = true;
        radius = Math.max(radius, agent.distanceTo({ x: 0, y: 0 }));
        agent.delete();
        continue;
      }
      if (
        !settings.useWholeWorld &&
        agent.distanceTo({ x: 0, y: 0 }) > radius + 3
      )
        agent.delete();
    }
  }
  function done() {
    return radius >= maxPxcor - 3;
  }
  function setRules(
    changes: Partial<
      Pick<DLAParameters, "maxParticles" | "wiggleAngle" | "useWholeWorld">
    >,
  ) {
    for (const key of Object.keys(changes))
      if (!["maxParticles", "wiggleAngle", "useWholeWorld"].includes(key))
        throw new TypeError("Only DLA live rules may change.");
    settings = parameters(inputs, { ...settings, ...changes });
  }
  setup();
  return {
    setup,
    makeNewAgent,
    wander,
    setRules,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done(); i++) {
        run(world, go);
        record();
      }
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        radius,
        done: done(),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({ id: f.id, x: f.x, y: f.y, occupied: f.occupied }),
          ),
        ),
        agents: Object.freeze(
          world.agents.map((a) =>
            Object.freeze({ id: a.id, x: a.x, y: a.y, heading: a.heading }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "DLA",
  description:
    "Off-lattice random walkers deposit onto a lattice aggregate. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<DLAParameters, ReturnType<typeof create>>;
