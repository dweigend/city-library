/** NetLogo Crystallization Basic (Wilensky, 2002), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface CrystalParameters {
  width: number;
  height: number;
  seed: number;
  initMetalTemp: number;
  meltingTemp: number;
  roomTemp: number;
  circle: boolean;
  histogram: boolean;
}
export const inputs: Inputs<CrystalParameters> = {
  width: { kind: "number", default: 31, min: 1, max: 31, integer: true },
  height: { kind: "number", default: 31, min: 1, max: 31, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initMetalTemp: { kind: "number", default: 1550, min: 1550, max: 2500 },
  meltingTemp: { kind: "number", default: 550, min: 500, max: 1500 },
  roomTemp: { kind: "number", default: 100, min: -20, max: 100 },
  circle: { kind: "boolean", default: false },
  histogram: { kind: "boolean", default: true },
};
type Atom = Agent<{ temp: number; sidesExposed: number; colorIndex: number }>;
const colors = [8.9, 85, 95, 105, 115, 125, 15] as const;
export function create(options: Partial<CrystalParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 33, y: 33, boundary: "hard" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const neighboringAgents = new Map<Atom, readonly Atom[]>();
  let averageMetalTemp = settings.initMetalTemp,
    frozenCount = 0,
    tempRange = 0;
  const history: Readonly<{
    tick: number;
    averageMetalTemp: number;
    frozenCount: number;
  }>[] = [];
  function atoms() {
    return world.agents as readonly Atom[];
  }
  function record() {
    history.push(
      Object.freeze({ tick: world.tick.value, averageMetalTemp, frozenCount }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function setColor(atom: Atom) {
    const index =
      Math.floor((atom.temp - settings.meltingTemp) / tempRange) + 1;
    if (index < 0) {
      atom.colorIndex = 0;
      frozenCount++;
    } else atom.colorIndex = Math.min(colors.length - 1, index);
  }
  function setup() {
    world.delete(world.agents);
    neighboringAgents.clear();
    frozenCount = 0;
    tempRange =
      (settings.initMetalTemp - settings.meltingTemp) / (colors.length - 1);
    // source model sprout gives each atom a random integer heading at creation.
    const sites = grid.fields.filter((f) =>
      settings.circle
        ? Math.hypot(f.x, f.y) < settings.width / 2
        : Math.abs(f.x) < settings.width / 2 &&
          Math.abs(f.y) < settings.height / 2,
    );
    for (const field of random.sample(sites, {
      count: sites.length,
      algorithm: "fisher-yates-descending",
    })) {
      const atom = world.add(
        Agent.create(
          { temp: settings.initMetalTemp, sidesExposed: 0, colorIndex: 0 },
          {
            position: { x: field.x, y: field.y },
            orientation: { heading: Math.floor(random.number() * 360) },
          },
        ),
      );
      setColor(atom);
    }
    for (const atom of atoms()) {
      const field = grid.fieldAt(atom)!;
      const nearby = [
        field,
        ...grid.neighbors(field, { neighborhood: "moore" }),
      ].flatMap((f) => grid.agentsAt(f)) as Atom[];
      neighboringAgents.set(atom, Object.freeze(nearby));
      atom.sidesExposed = 9 - nearby.length;
    }
    averageMetalTemp = settings.initMetalTemp;
    world.tick.reset();
    history.length = 0;
    record();
  }
  function requireAtom(id: string) {
    const atom = atoms().find((a) => a.id === id);
    if (!atom) throw new RangeError("Expected a crystallization atom id.");
    return atom;
  }
  function coolAtom(atom: Atom) {
    const neighbors = neighboringAgents.get(atom)!;
    atom.temp =
      (neighbors.reduce((sum, other) => sum + other.temp, 0) +
        settings.roomTemp * atom.sidesExposed +
        atom.temp) /
      10;
  }
  function rotateAtom(atom: Atom) {
    if (atom.temp >= settings.meltingTemp) {
      const frozen = neighboringAgents
        .get(atom)!
        .filter((other) => other.temp <= settings.meltingTemp);
      const neighbor = random.sample(frozen)[0];
      if (neighbor) atom.rotate(neighbor.heading - atom.heading);
      else atom.rotate(random.number() * 360);
    }
  }
  function coolAgents(id: string) {
    coolAtom(requireAtom(id));
  }
  function rotate(id: string) {
    rotateAtom(requireAtom(id));
  }
  function recolor(id: string) {
    setColor(requireAtom(id));
  }
  function done() {
    return (
      (stats.describe(atoms().map((a) => a.temp)).max ?? -Infinity) <
      settings.meltingTemp
    );
  }
  function go() {
    frozenCount = 0;
    const population = atoms();
    // Three distinct randomized passes are required: asynchronous cooling,
    // then complete color assignment, then orientation changes.
    for (const atom of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    }))
      coolAtom(atom);
    for (const atom of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    }))
      setColor(atom);
    for (const atom of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    }))
      rotateAtom(atom);
    averageMetalTemp = stats.describe(population.map((a) => a.temp)).mean ?? 0;
  }
  function setRules(
    changes: Partial<
      Pick<CrystalParameters, "meltingTemp" | "roomTemp" | "histogram">
    >,
  ) {
    for (const key of Object.keys(changes))
      if (!["meltingTemp", "roomTemp", "histogram"].includes(key))
        throw new TypeError("Only live crystallization rules may change.");
    // tempRange remains the setup-time quantity, exactly as in the source.
    settings = parameters(inputs, { ...settings, ...changes });
  }
  setup();
  return {
    setup,
    coolAgents,
    rotate,
    recolor,
    setColor: recolor,
    setRules,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done(); i++) {
        run(world, go);
        record();
      }
    },
    read() {
      const population = atoms();
      return Object.freeze({
        tick: world.tick.value,
        width: 33,
        height: 33,
        parameters: settings,
        tempRange,
        averageMetalTemp,
        frozenCount,
        done: done(),
        atoms: Object.freeze(
          population.map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              temp: a.temp,
              sidesExposed: a.sidesExposed,
              colorIndex: a.colorIndex,
              color: colors[a.colorIndex]!,
            }),
          ),
        ),
        histogram: Object.freeze(
          colors.map((color, index) =>
            Object.freeze({
              index,
              color,
              count: population.filter((a) => a.colorIndex === index).length,
              lower:
                index === 0
                  ? settings.roomTemp
                  : settings.meltingTemp + (index - 1) * tempRange,
              upper: settings.meltingTemp + index * tempRange,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Crystallization",
  description: "A cooling liquid freezes into crystal grains whose orientations meet at boundaries. Wilensky (2002), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<CrystalParameters, ReturnType<typeof create>>;
