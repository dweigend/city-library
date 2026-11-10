/** NetLogo Sand, Wilensky (1996), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface SandParameters {
  width: number;
  height: number;
  seed: number;
  releaseChance: number;
  spacing: number;
  density: number;
}
export const inputs: Inputs<SandParameters> = {
  width: { kind: "number", default: 81, min: 5, max: 201, integer: true },
  height: { kind: "number", default: 81, min: 5, max: 201, integer: true },
  seed: { kind: "number", default: 1, integer: true },
  releaseChance: { kind: "number", default: 100, min: 0, max: 100 },
  spacing: { kind: "number", default: 3, min: 2, max: 15, integer: true },
  density: { kind: "number", default: 10, min: 0, max: 50 },
};
type Status = "empty" | "floor" | "spout" | "sand";
export function create(options: Partial<SandParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd lattice dimensions.");
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const grid = Grid.create(
    {
      x: settings.width,
      y: settings.height,
      boundary: { x: "wrap", y: "hard" },
    },
    { state: { status: "empty" as Status, nextColor: "empty" as Status } },
  );
  world.add(grid);
  const fields = grid.fields,
    maxX = (settings.width - 1) / 2,
    maxY = (settings.height - 1) / 2,
    surfaceY = -0.8 * maxY,
    spoutY = Math.round(0.9 * maxY),
    spoutSpace = Math.round(0.6 * maxX);
  const spouts = fields.filter((f) => f.y === spoutY && f.x % spoutSpace === 0);
  function setup() {
    for (const f of fields) {
      f.status = f.y < surfaceY ? "floor" : "empty";
      f.nextColor = f.status;
    }
    for (const f of spouts) f.status = "spout";
    world.tick.reset();
  }
  function spout() {
    if (world.tick.value % settings.spacing === 0) {
      const eligible = spouts.filter(
        () => random.number() * 100 <= settings.releaseChance,
      );
      for (const f of random.sample(eligible, {
        count: eligible.length,
        compatibility: "legacy-shuffle",
      }))
        grid.fieldAt({ x: f.x, y: f.y - 1 })!.status = "sand";
    }
  }
  function moveAllSand() {
    for (const f of fields) f.nextColor = f.status;
    const grains = fields.filter((f) => f.status === "sand");
    for (const f of random.sample(grains, {
      count: grains.length,
      compatibility: "legacy-shuffle",
    })) {
      const down = grid.fieldAt({ x: f.x, y: f.y - 1 }),
        left = grid.fieldAt({ x: f.x - 1, y: f.y - 1 }),
        right = grid.fieldAt({ x: f.x + 1, y: f.y - 1 });
      let target: typeof down;
      if (down?.status === "empty") target = down;
      else if (left?.status === "sand" && right?.status === "empty")
        target = right;
      else if (left?.status === "empty" && right?.status === "sand")
        target = left;
      else if (left?.status === "empty" && right?.status === "empty")
        target = random.number() < 0.5 ? right : left;
      if (target) {
        f.nextColor = "empty";
        target.nextColor = "sand";
      }
    }
    for (const f of fields) f.status = f.nextColor;
  }
  function dumpSand() {
    const eligible = fields.filter((f) => f.y < spoutY && f.y > surfaceY);
    for (const f of random.sample(eligible, {
      count: eligible.length,
      compatibility: "legacy-shuffle",
    }))
      if (random.number() * 100 < settings.density) f.status = "sand";
  }
  setup();
  return {
    advance(count = 1) {
      stepCount(count);
      run(
        world,
        () => {
          spout();
          moveAllSand();
        },
        count,
      );
    },
    setup,
    spout,
    moveAllSand,
    dumpSand,
    setLive(
      value: Partial<
        Pick<SandParameters, "releaseChance" | "spacing" | "density">
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    setSand(positions: readonly { x: number; y: number }[]) {
      const selected = positions.map((p) => {
        if (
          !Number.isInteger(p.x) ||
          !Number.isInteger(p.y) ||
          Math.abs(p.x) > maxX ||
          Math.abs(p.y) > maxY
        )
          throw new RangeError("Expected in-world integer positions.");
        const f = grid.fieldAt(p)!;
        if (f.y < surfaceY || spouts.includes(f))
          throw new RangeError("Cannot replace floor or spout.");
        return f;
      });
      if (new Set(selected).size !== selected.length)
        throw new RangeError("Duplicate grain position.");
      setup();
      for (const f of selected) f.status = "sand";
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        surfaceY,
        spoutY,
        cells: Object.freeze(
          fields.map((f) =>
            Object.freeze({ id: f.id, x: f.x, y: f.y, status: f.status }),
          ),
        ),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Sand",
  description:
    "Synchronous falling sand rules · Uri Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<SandParameters, ReturnType<typeof create>>;
