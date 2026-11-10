/** NetLogo Vants, Wilensky (2005), CC BY-NC-SA 3.0.
 * Public Agent owns each oriented head; public Grid owns the binary tape.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface VantsParameters {
  width: number;
  height: number;
  seed: number;
  vantCount: number;
}
export const inputs: Inputs<VantsParameters> = {
  width: { kind: "number", default: 241, min: 3, max: 301, integer: true },
  height: { kind: "number", default: 241, min: 3, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  vantCount: { kind: "number", default: 1, min: 1, max: 16, integer: true },
};
export function create(options: Partial<VantsParameters> = {}) {
  const settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Vants source coordinates require odd dimensions.");
  const random = Random.create({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: "wrap" as const,
  };
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { on: false } });
  world.add(grid);
  const agents = Array.from({ length: settings.vantCount }, (_, who) =>
    Agent.create(
      { who },
      {
        position: { x: 0, y: 0 },
        orientation: {
          heading: random.number({ min: 0, max: 4, integer: true }) * 90,
        },
      },
    ),
  );
  world.add(agents);
  type Vant = (typeof agents)[number];
  function turn(vant: Vant) {
    const cell = grid.fieldAt(vant)!;
    const heading =
      (Math.round(vant.heading / 90) * 90 + (cell.on ? 270 : 90)) % 360;
    cell.on = !cell.on;
    // Rebase cardinal orientation through Agent.rotate(towards), avoiding
    // floating-point accumulation and preserving the reversible lattice map.
    const dx = heading === 90 ? 1 : heading === 270 ? -1 : 0;
    const dy = heading === 0 ? 1 : heading === 180 ? -1 : 0;
    vant.rotate({ towards: { x: vant.x + dx, y: vant.y + dy } });
  }
  function moveOne(vant: Vant, direction: 1 | -1) {
    vant.move(direction);
    const cell = grid.fieldAt(vant)!;
    vant.move({ to: { x: cell.x, y: cell.y } });
  }
  function goForward() {
    for (const vant of agents) {
      moveOne(vant, 1);
      turn(vant);
    }
  }
  function goReverse() {
    for (const vant of [...agents].reverse()) {
      turn(vant);
      moveOne(vant, -1);
    }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) run(world, goForward);
    },
    reverse(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) run(world, goReverse);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        done: false,
        cells: Object.freeze(
          grid.fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              on: field.on,
            }),
          ),
        ),
        agents: Object.freeze(
          agents.map((agent) =>
            Object.freeze({
              id: agent.id,
              who: agent.who,
              x: agent.x,
              y: agent.y,
              heading: agent.heading,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Virtual Ants",
  description: "Ants flip the cells they visit and turn depending on the color, tracing intricate patterns. Wilensky (2005), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<VantsParameters, ReturnType<typeof create>>;
