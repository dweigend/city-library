/** NetLogo Ising, Wilensky (2003), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface IsingParameters {
  width: number;
  height: number;
  seed: number;
  probabilityOfSpinUp: number;
  temperature: number;
}
export const inputs: Inputs<IsingParameters> = {
  width: { kind: "number", default: 81, min: 3, max: 201, integer: true },
  height: { kind: "number", default: 81, min: 3, max: 201, integer: true },
  seed: { kind: "number", default: 1, integer: true },
  probabilityOfSpinUp: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  temperature: { kind: "number", default: 2.27, min: 0, max: 10 },
};
export function create(options: Partial<IsingParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd lattice dimensions.");
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const grid = Grid.create(
    { x: settings.width, y: settings.height, boundary: "wrap" },
    { state: { spin: 1 } },
  );
  world.add(grid);
  const fields = grid.fields,
    neighbors = new Map(
      fields.map((f) => [f, grid.neighbors(f, { neighborhood: "faces" })]),
    );
  let sumOfSpins = 0;
  const history: { tick: number; magnetization: number }[] = [];
  function record() {
    history.push({
      tick: world.tick.value,
      magnetization: sumOfSpins / fields.length,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    for (const f of random.sample(fields, {
      count: fields.length,
      algorithm: "fisher-yates-descending",
    }))
      f.spin =
        Math.floor(random.number() * 100) < settings.probabilityOfSpinUp
          ? 1
          : -1;
    sumOfSpins = fields.reduce((s, f) => s + f.spin, 0);
    world.tick.reset();
    history.length = 0;
    record();
  }
  function update(field: (typeof fields)[number]) {
    const eDiff =
      2 * field.spin * neighbors.get(field)!.reduce((s, f) => s + f.spin, 0);
    if (
      eDiff <= 0 ||
      (settings.temperature > 0 &&
        random.number() < Math.exp(-eDiff / settings.temperature))
    ) {
      field.spin = -field.spin;
      sumOfSpins += 2 * field.spin;
      return true;
    }
    return false;
  }
  setup();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < 1000; j++)
          update(fields[Math.floor(random.number() * fields.length)]!);
        world.tick.advance(1000);
        record();
      }
    },
    updateAt(x: number, y: number) {
      if (
        !Number.isInteger(x) ||
        !Number.isInteger(y) ||
        Math.abs(x) > (settings.width - 1) / 2 ||
        Math.abs(y) > (settings.height - 1) / 2
      )
        throw new RangeError("Expected an in-world field.");
      return update(grid.fieldAt({ x, y })!);
    },
    setup,
    setTemperature(temperature: number) {
      settings = parameters(inputs, { ...settings, temperature });
    },
    setSpins(spins: readonly number[]) {
      if (
        spins.length !== fields.length ||
        Array.from({ length: fields.length }, (_, i) => spins[i]).some(
          (n) => n !== 1 && n !== -1,
        )
      )
        throw new RangeError("Supply one ±1 spin per field.");
      fields.forEach((f, i) => (f.spin = spins[i]!));
      sumOfSpins = fields.reduce((s, f) => s + f.spin, 0);
      world.tick.reset();
      history.length = 0;
      record();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        sumOfSpins,
        magnetization: sumOfSpins / fields.length,
        cells: Object.freeze(
          fields.map((f) =>
            Object.freeze({ id: f.id, x: f.x, y: f.y, spin: f.spin }),
          ),
        ),
        history: Object.freeze(history.map((p) => Object.freeze({ ...p }))),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Ising Model",
  description: "Magnetic spins flip to match their neighbors; temperature decides whether order forms. Uri Wilensky, CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<IsingParameters, ReturnType<typeof create>>;
