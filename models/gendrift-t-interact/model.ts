/** NetLogo GenDrift T interact, Wilensky (1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface Parameters {
  seed: number;
  agentCount: number;
  colorCount: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    integer: true,
    min: -2147483648,
    max: 4294967295,
  },
  agentCount: { kind: "number", default: 300, min: 1, max: 1000, integer: true },
  colorCount: { kind: "number", default: 5, min: 2, max: 10, integer: true },
};
type ModelAgent = Agent<{ colorNumber: number }>;
const sourceColors = [5, 15, 25, 35, 45, 55, 65, 85, 95, 125];
export function create(options: Partial<Parameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "wrap" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { wall: false } });
  world.add(grid);
  const agents = () => world.agents as readonly ModelAgent[];
  let maxPercent = 0;
  let wallMode: "place" | "remove" = "place";
  const history: { tick: number; counts: number[] }[] = [];
  function moveOffWall(agent: ModelAgent) {
    // Source walks random neighboring fields until a black field is reached.
    if (!grid.fields.some((f) => !f.wall))
      throw new RangeError(
        "No open field: source move-off-wall would not terminate.",
      );
    while (grid.fieldAt(agent)!.wall) {
      const field = random.sample(
        grid.neighbors(grid.fieldAt(agent)!, { neighborhood: "moore" }),
      )[0]!;
      agent.move({ to: field });
    }
  }
  function makeAgent(colorNumber: number, x: number, y: number, heading = 0) {
    if (!sourceColors.includes(colorNumber))
      throw new RangeError("Unknown source agent color.");
    const agent = Agent.create(
      { colorNumber },
      { position: { x, y }, orientation: { heading } },
    );
    world.add(agent);
    moveOffWall(agent);
    return agent;
  }
  function setup() {
    world.delete(agents());
    world.tick.reset();
    history.length = 0;
    for (let n = 0; n < settings.agentCount; n++) {
      const agent = Agent.create(
        {
          colorNumber:
            sourceColors[
              random.number({ min: 0, max: settings.colorCount, integer: true })
            ]!,
        },
        {
          position: {
            x: random.number() * 35 - 17.5,
            y: random.number() * 35 - 17.5,
          },
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(agent);
      moveOffWall(agent);
    }
    record();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      counts: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map(
        (c) => agents().filter((t) => t.colorNumber === c).length,
      ),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function meet(agent: ModelAgent) {
    const target = grid.fieldAt(
      geometry.normalize(
        { x: agent.x + 1, y: agent.y },
        { space, endpoints: "half-open" },
      )!,
    )!;
    const other = random.sample(
      grid.agentsAt(target, { source: agents() }),
    )[0];
    if (other) agent.colorNumber = other.colorNumber;
  }
  function placeWall(row: number) {
    if (!Number.isFinite(row) || Math.round(row) < -17 || Math.round(row) > 17)
      throw new RangeError("Wall row is outside source bounds.");
    for (const field of grid.fields) {
      if (Math.abs(field.y) === 17 || field.y === Math.round(row)) {
        field.wall = true;
        for (const agent of grid.agentsAt(field, { source: agents() }))
          moveOffWall(agent);
      }
    }
  }
  function removeWall(row: number) {
    if (!Number.isFinite(row)) throw new TypeError("Wall row must be finite.");
    for (const field of grid.fields)
      if (field.y === Math.round(row)) field.wall = false;
  }
  function removeAllWalls() {
    for (const field of grid.fields) field.wall = false;
  }
  function setWallMode(value: "place" | "remove") {
    wallMode = value;
  }
  function drawWall(row: number) {
    if (wallMode === "place") placeWall(row);
    else removeWall(row);
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let n = 0; n < stepCount; n++) {
      if (stats.describe(agents().map((a) => a.colorNumber)).variance === 0)
        break;
      for (const agent of random.sample(agents(), {
        sampleCount: agents().length,
        algorithm: "fisher-yates-descending",
      })) {
        agent.rotate(
          random.number({ min: 0, max: 50, integer: true }) -
            random.number({ min: 0, max: 50, integer: true }),
        );
        meet(agent);
        const direction = geometry.direction({ heading: agent.heading });
        const ahead = geometry.normalize(
          { x: agent.x + direction.x * 0.5, y: agent.y + direction.y * 0.5 },
          { space, endpoints: "half-open" },
        );
        if (!grid.fieldAt(ahead!)!.wall) agent.move(0.5);
        else agent.rotate(random.number({ min: 0, max: 360, integer: true }));
      }
      maxPercent =
        (100 *
          Math.max(
            ...sourceColors.map(
              (c) => agents().filter((a) => a.colorNumber === c).length,
            ),
          )) /
        agents().length;
      world.tick.advance();
      record();
    }
  }
  function read() {
    return {

      parameters: { ...settings },
      randomState: random.state,
      width: 35,
      height: 35,
      tick: world.tick.value,
      maxPercent,
      wallMode,
      done: stats.describe(agents().map((a) => a.colorNumber)).variance === 0,
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        wall: f.wall,
      })),
      agents: agents().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        heading: a.heading,
        colorNumber: a.colorNumber,
      })),
      history: history.map((p) => ({ ...p, counts: [...p.counts] })),
    };
  }
  function setParameters(change: Partial<Parameters>) {
    settings = parseParameters(inputs, { ...settings, ...change });
  }
  setup();
  return {
    read,
    advance,
    setup,
    setParameters,
    placeWall,
    removeWall,
    removeAllWalls,
    setWallMode,
    drawWall,
    makeAgent,
    meet,
    moveOffWall,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Genetic Drift by Contact",
  description: "Moving agents copy the color of agents they meet; colors drift until one remains.",
  inputs,
  create,
};
