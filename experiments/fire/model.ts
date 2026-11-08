/** Adapted from NetLogo Fire, Uri Wilensky (1997), CC BY-NC-SA 3.0.
 * Exact NetLogo 7.0.4 source, attribution and adaptations: source.nlogox / NOTICE.md.
 * Readable headless composition of public City Library operations.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface FireParameters {
  width: number;
  height: number;
  seed: number;
  density: number;
}
export const inputs: Inputs<FireParameters> = {
  width: { kind: "number", default: 251, min: 3, max: 301, integer: true },
  height: { kind: "number", default: 251, min: 3, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  density: { kind: "number", default: 57, min: 0, max: 99, integer: true },
};
type Status = "empty" | "tree" | "fire" | "ember" | "burned";
export function create(options: Partial<FireParameters> = {}) {
  const settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ random });
  const grid = Grid.add(
    { x: settings.width, y: settings.height, boundary: "hard" },
    { state: { status: "empty" as Status, emberColor: 0 } },
  );
  world.add(grid);
  const fields = grid.fields;
  const neighbors = new Map(
    fields.map((field) => [
      field,
      grid.neighbors(field, { neighborhood: "faces" }),
    ]),
  );
  let initialTrees = 0,
    burnedTrees = 0;
  const history: Readonly<{
    tick: number;
    trees: number;
    fires: number;
    embers: number;
    percentBurned: number;
  }>[] = [];
  function counts() {
    let trees = 0,
      fires = 0,
      embers = 0;
    for (const field of fields) {
      if (field.status === "tree") trees++;
      else if (field.status === "fire") fires++;
      else if (field.status === "ember") embers++;
    }
    return { trees, fires, embers };
  }
  function percentBurned() {
    return initialTrees === 0 ? 0 : (100 * burnedTrees) / initialTrees;
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        ...counts(),
        percentBurned: percentBurned(),
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function ignite(field: (typeof fields)[number]) {
    field.status = "fire";
    field.emberColor = 15;
    burnedTrees++;
  }
  function setup(trees: readonly boolean[]) {
    fields.forEach((field, i) => {
      field.status = trees[i] ? "tree" : "empty";
      field.emberColor = 0;
    });
    for (const field of fields) if (field.x === fields[0]!.x) ignite(field);
    initialTrees = counts().trees;
    burnedTrees = 0;
    world.tick.reset();
    history.length = 0;
    record();
  }
  function spreadAndFade() {
    // Snapshot old fire membership: newborn fires cannot propagate or fade yet.
    const fires = fields.filter((field) => field.status === "fire");
    for (const fire of fires) {
      for (const neighbor of neighbors.get(fire)!)
        if (neighbor.status === "tree") ignite(neighbor);
      fire.status = "ember";
    }
    for (const field of fields)
      if (field.status === "ember") {
        field.emberColor -= 0.3;
        if (field.emberColor < 11.5) field.status = "burned";
      }
  }

  function flags(values: readonly boolean[]) {
    if (!Array.isArray(values) || values.length !== fields.length)
      throw new RangeError("Supply one boolean data value per field.");
    return Array.from({ length: fields.length }, (_, index) => {
      const entry = Object.getOwnPropertyDescriptor(values, index);
      if (!entry || !("value" in entry) || typeof entry.value !== "boolean")
        throw new TypeError("Supply dense boolean data values.");
      return entry.value as boolean;
    });
  }

  setup(fields.map(() => random.number() * 100 < settings.density));
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        const c = counts();
        if (c.fires + c.embers === 0) break;
        run(world, spreadAndFade);
        record();
      }
    },
    setForest(trees: readonly boolean[]) {
      setup(flags(trees));
    },
    read() {
      const c = counts();
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              status: field.status,
              emberColor: field.emberColor,
            }),
          ),
        ),
        initialTrees,
        burnedTrees,
        percentBurned: percentBurned(),
        counts: Object.freeze(c),
        done: c.fires + c.embers === 0,
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Fire",
  description:
    "Four-neighbor forest fire with fading embers. Uri Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<FireParameters, ReturnType<typeof create>>;
