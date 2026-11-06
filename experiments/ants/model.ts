/** NetLogo Ants, Wilensky (1997), CC BY-NC-SA 3.0; source.nlogox and NOTICE.md pin provenance. */
import { Agent, Grid, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface AntsParameters {
  seed: number;
  population: number;
  diffusionRate: number;
  evaporationRate: number;
}
export const inputs: Inputs<AntsParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  population: { kind: "number", default: 125, min: 0, max: 200, integer: true },
  diffusionRate: {
    kind: "number",
    default: 50,
    min: 0,
    max: 99,
    integer: true,
  },
  evaporationRate: {
    kind: "number",
    default: 10,
    min: 0,
    max: 99,
    integer: true,
  },
};
type Ant = Agent<{ who: number; carrying: boolean }>;
export function create(options: Partial<AntsParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const width = 71,
    height = 71;
  const world = World.add(
    { x: width, y: height, boundary: "hard" },
    { random },
  );
  const grid = Grid.add(
    { x: width, y: height, boundary: "hard" },
    {
      state: {
        chemical: 0,
        food: 0,
        nest: false,
        nestScent: 0,
        foodSourceNumber: 0,
      },
    },
  );
  world.add(grid);
  const ants = () => world.agents as readonly Ant[];
  for (let who = 0; who < settings.population; who++)
    world.add(
      Agent.add(
        { who, carrying: false },
        { orientation: { heading: Math.floor(random.number() * 360) } },
      ),
    );
  for (const field of grid.fields) {
    const d = Math.hypot(field.x, field.y);
    field.nest = d < 5;
    field.nestScent = 200 - d;
    if (Math.hypot(field.x - 0.6 * 35, field.y) < 5) field.foodSourceNumber = 1;
    if (Math.hypot(field.x + 0.6 * 35, field.y + 0.6 * 35) < 5)
      field.foodSourceNumber = 2;
    if (Math.hypot(field.x + 0.8 * 35, field.y - 0.8 * 35) < 5)
      field.foodSourceNumber = 3;
    if (field.foodSourceNumber > 0)
      field.food = 1 + Math.floor(random.number() * 2);
  }
  const history: Readonly<{
    tick: number;
    food1: number;
    food2: number;
    food3: number;
  }>[] = [];
  function foodByPile() {
    return [1, 2, 3].map((n) =>
      grid.fields.reduce(
        (sum, f) => sum + (!f.nest && f.foodSourceNumber === n ? f.food : 0),
        0,
      ),
    );
  }
  function record() {
    const [food1, food2, food3] = foodByPile();
    history.push(
      Object.freeze({
        tick: world.tick.value,
        food1: food1!,
        food2: food2!,
        food3: food3!,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function scent(ant: Ant, angle: number, key: "chemical" | "nestScent") {
    const d = geometry.direction({ heading: ant.heading + angle });
    const target = { x: ant.x + d.x, y: ant.y + d.y };
    const position = geometry.normalize(target, {
      space: world.space!,
      endpoints: "half-open",
    });
    return position ? (grid.fieldAt(position)?.[key] ?? 0) : 0;
  }
  function uphill(ant: Ant, key: "chemical" | "nestScent") {
    const ahead = scent(ant, 0, key),
      right = scent(ant, 45, key),
      left = scent(ant, -45, key);
    if (right > ahead || left > ahead) ant.rotate(right > left ? 45 : -45);
  }
  function go() {
    for (const ant of random.sample(ants(), {
      count: ants().length,
      compatibility: "legacy-shuffle",
    })) {
      if (ant.who >= world.tick.value) continue;
      const field = grid.fieldAt(ant)!;
      if (ant.carrying) {
        if (field.nest) {
          ant.carrying = false;
          ant.rotate(180);
        } else {
          field.chemical += 60;
          uphill(ant, "nestScent");
        }
      } else if (field.food > 0) {
        ant.carrying = true;
        field.food--;
        ant.rotate(180);
      } else if (field.chemical >= 0.05 && field.chemical < 2)
        uphill(ant, "chemical");
      ant.rotate(Math.floor(random.number() * 40));
      ant.rotate(-Math.floor(random.number() * 40));
      let d = geometry.direction({ heading: ant.heading });
      const ahead = { x: ant.x + d.x, y: ant.y + d.y };
      // Preserve the source patch-edge contract through the public endpoint policy.
      if (
        !geometry.normalize(ahead, {
          space: world.space!,
          endpoints: "half-open",
        })
      ) {
        ant.rotate(180);
        d = geometry.direction({ heading: ant.heading });
      }
      ant.move({ to: { x: ant.x + d.x, y: ant.y + d.y } });
    }
    grid.diffuse("chemical", {
      rate: settings.diffusionRate / 100,
      neighborhood: "moore",
    });
    for (const f of grid.fields)
      f.chemical *= 1 - settings.evaporationRate / 100;
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    setRules(
      rules: Partial<Pick<AntsParameters, "diffusionRate" | "evaporationRate">>,
    ) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            typeof key !== "string" ||
            !["diffusionRate", "evaporationRate"].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only live rule data.");
      settings = parameters(inputs, { ...settings, ...rules });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width,
        height,
        parameters: settings,
        ants: Object.freeze(
          ants().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x,
              y: a.y,
              heading: a.heading,
              carrying: a.carrying,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              chemical: f.chemical,
              food: f.food,
              nest: f.nest,
              nestScent: f.nestScent,
              foodSourceNumber: f.foodSourceNumber,
            }),
          ),
        ),
        foodByPile: Object.freeze(foodByPile()),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Ants",
  description:
    "Food foraging, pheromone deposition and delayed departure. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<AntsParameters, ReturnType<typeof create>>;
