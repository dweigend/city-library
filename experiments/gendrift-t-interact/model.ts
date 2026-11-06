/** NetLogo GenDrift T interact, Wilensky (1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "b08-gendrift-t-interact-source-composition-v1";
export interface Parameters {
  seed: number;
  number: number;
  colors: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    integer: true,
    min: -2147483648,
    max: 4294967295,
  },
  number: { kind: "number", default: 300, min: 1, max: 1000, integer: true },
  colors: { kind: "number", default: 5, min: 2, max: 10, integer: true },
};
type Turtle = Agent<{ colorNumber: number }>;
const sourceColors = [5, 15, 25, 35, 45, 55, 65, 85, 95, 125];
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "wrap" as const };
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { wall: false } });
  world.add(grid);
  const turtles = () => world.agents as readonly Turtle[];
  let maxPercent = 0;
  let wallMode: "place" | "remove" = "place";
  const history: { tick: number; counts: number[] }[] = [];
  function moveOffWall(turtle: Turtle) {
    // Source walks random neighboring patches until a black patch is reached.
    if (!grid.fields.some((f) => !f.wall))
      throw new RangeError(
        "No open patch: source move-off-wall would not terminate.",
      );
    while (grid.fieldAt(turtle)!.wall) {
      const field = random.sample(
        grid.neighbors(grid.fieldAt(turtle)!, { neighborhood: "moore" }),
      )[0]!;
      turtle.move({ to: field });
    }
  }
  function makeTurtle(colorNumber: number, x: number, y: number, heading = 0) {
    if (!sourceColors.includes(colorNumber))
      throw new RangeError("Unknown source turtle color.");
    const turtle = Agent.add(
      { colorNumber },
      { position: { x, y }, orientation: { heading } },
    );
    world.add(turtle);
    moveOffWall(turtle);
    return turtle;
  }
  function setup() {
    world.delete(turtles());
    world.tick.reset();
    history.length = 0;
    for (let n = 0; n < settings.number; n++) {
      const turtle = Agent.add(
        {
          colorNumber:
            sourceColors[
              random.number({ min: 0, max: settings.colors, integer: true })
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
      world.add(turtle);
      moveOffWall(turtle);
    }
    record();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      counts: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map(
        (c) => turtles().filter((t) => t.colorNumber === c).length,
      ),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function meet(turtle: Turtle) {
    const target = grid.fieldAt(
      geometry.normalize(
        { x: turtle.x + 1, y: turtle.y },
        { space, endpoints: "half-open" },
      )!,
    )!;
    const other = random.sample(
      grid.agentsAt(target, { source: turtles() }),
    )[0];
    if (other) turtle.colorNumber = other.colorNumber;
  }
  function placeWall(row: number) {
    if (!Number.isFinite(row) || Math.round(row) < -17 || Math.round(row) > 17)
      throw new RangeError("Wall row is outside source bounds.");
    for (const field of grid.fields) {
      if (Math.abs(field.y) === 17 || field.y === Math.round(row)) {
        field.wall = true;
        for (const turtle of grid.agentsAt(field, { source: turtles() }))
          moveOffWall(turtle);
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
  function advance(steps = 1) {
    stepCount(steps);
    for (let n = 0; n < steps; n++) {
      if (stats.describe(turtles().map((a) => a.colorNumber)).variance === 0)
        break;
      for (const turtle of random.sample(turtles(), {
        count: turtles().length,
        compatibility: "legacy-shuffle",
      })) {
        turtle.rotate(
          random.number({ min: 0, max: 50, integer: true }) -
            random.number({ min: 0, max: 50, integer: true }),
        );
        meet(turtle);
        const direction = geometry.direction({ heading: turtle.heading });
        const ahead = geometry.normalize(
          { x: turtle.x + direction.x * 0.5, y: turtle.y + direction.y * 0.5 },
          { space, endpoints: "half-open" },
        );
        if (!grid.fieldAt(ahead!)!.wall) turtle.move(0.5);
        else turtle.rotate(random.number({ min: 0, max: 360, integer: true }));
      }
      maxPercent =
        (100 *
          Math.max(
            ...sourceColors.map(
              (c) => turtles().filter((a) => a.colorNumber === c).length,
            ),
          )) /
        turtles().length;
      world.tick.advance();
      record();
    }
  }
  function read() {
    return {
      sourceMarker,
      parameters: { ...settings },
      randomState: random.state,
      width: 35,
      height: 35,
      tick: world.tick.value,
      maxPercent,
      wallMode,
      done: stats.describe(turtles().map((a) => a.colorNumber)).variance === 0,
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        wall: f.wall,
      })),
      turtles: turtles().map((a) => ({
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
    settings = parameters(inputs, { ...settings, ...change });
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
    makeTurtle,
    meet,
    moveOffWall,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "GenDrift T interact",
  inputs,
  create,
};
