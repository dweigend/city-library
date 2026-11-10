/** NetLogo Solid Diffusion, Wilensky (2007), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface SolidParameters {
  width: number;
  height: number;
  seed: number;
}
export const inputs: Inputs<SolidParameters> = {
  width: { kind: "number", default: 35, min: 3, max: 101, integer: true },
  height: { kind: "number", default: 35, min: 3, max: 101, integer: true },
  seed: { kind: "number", default: 1, integer: true },
};
type Color = "green" | "blue";
export function create(options: Partial<SolidParameters> = {}) {
  const settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd lattice dimensions.");
  const random = Random.create({ seed: settings.seed }),
    space = {
      x: settings.width,
      y: settings.height,
      boundary: "hard" as const,
    },
    world = World.create(space, { random }),
    grid = Grid.create(space);
  world.add(grid);
  type Atom = ReturnType<typeof Agent.create<{ color: Color }>>;
  const fields = grid.fields,
    history: { tick: number; distanceSquared: number | null }[] = [];
  function atoms() {
    return world.agents as readonly Atom[];
  }
  function greens() {
    return atoms().filter((a) => a.color === "green");
  }
  function blues() {
    return atoms().filter((a) => a.color === "blue");
  }
  function distanceSquared() {
    const g = greens(),
      b = blues();
    return g.length && b.length
      ? (Math.max(...g.map((a) => a.x)) - Math.min(...b.map((a) => a.x))) ** 2
      : null;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      distanceSquared: distanceSquared(),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function put(x: number, y: number, color: Color) {
    const atom = Agent.create({ color }, { position: { x, y } });
    world.add(atom);
  }
  function setup() {
    for (const atom of [...atoms()]) atom.delete();
    for (const f of fields)
      if (f.x !== 0) put(f.x, f.y, f.x < 0 ? "green" : "blue");
    world.tick.reset();
    history.length = 0;
    record();
  }
  function moveAtomToHere(x: number, y: number) {
    if (
      !Number.isInteger(x) ||
      !Number.isInteger(y) ||
      Math.abs(x) > (settings.width - 1) / 2 ||
      Math.abs(y) > (settings.height - 1) / 2
    )
      throw new RangeError("Expected an in-world field.");
    const target = grid.fieldAt({ x, y })!;
    if (grid.agentsAt(target).length)
      throw new RangeError("Target must be vacant.");
    const candidates = grid
      .neighbors(target, { neighborhood: "faces" })
      .flatMap((f) => grid.agentsAt(f));
    const atom = random.sample(candidates)[0];
    if (atom) atom.move({ to: target });
  }
  function go() {
    const vacancies = fields.filter((f) => grid.agentsAt(f).length === 0);
    for (const f of random.sample(vacancies, {
      count: vacancies.length,
      algorithm: "fisher-yates-descending",
    }))
      moveAtomToHere(f.x, f.y);
  }
  setup();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    setup,
    moveAtomToHere,
    setAtoms(values: readonly { x: number; y: number; color: Color }[]) {
      const positions = values.map((a) => {
        if (
          !Number.isInteger(a.x) ||
          !Number.isInteger(a.y) ||
          Math.abs(a.x) > (settings.width - 1) / 2 ||
          Math.abs(a.y) > (settings.height - 1) / 2 ||
          !["green", "blue"].includes(a.color)
        )
          throw new RangeError("Expected valid atomic sites and species.");
        return grid.fieldAt({ x: a.x, y: a.y })!;
      });
      if (new Set(positions).size !== positions.length)
        throw new RangeError("One atom per site.");
      for (const atom of [...atoms()]) atom.delete();
      for (const a of values) put(a.x, a.y, a.color);
      world.tick.reset();
      history.length = 0;
      record();
    },
    read() {
      const current = atoms();
      const columns = Array.from({ length: settings.width }, (_, i) => {
        const x = i - (settings.width - 1) / 2;
        return Object.freeze({
          x,
          greens: current.filter((a) => a.x === x && a.color === "green")
            .length,
          blues: current.filter((a) => a.x === x && a.color === "blue").length,
        });
      });
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        atoms: Object.freeze(
          current.map((a) =>
            Object.freeze({ id: a.id, x: a.x, y: a.y, color: a.color }),
          ),
        ),
        vacancies: fields.length - current.length,
        maxDiffusionDistance: distanceSquared(),
        columns: Object.freeze(columns),
        history: Object.freeze(history.map((p) => Object.freeze({ ...p }))),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Solid Diffusion",
  description: "Atoms swap places with vacancies, slowly mixing two metals. Uri Wilensky, CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<SolidParameters, ReturnType<typeof create>>;
