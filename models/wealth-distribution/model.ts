/** Adapted from NetLogo Wealth Distribution, Uri Wilensky (1998).
 * CC BY-NC-SA 3.0, https://ccl.northwestern.edu/netlogo/models/WealthDistribution
 * Source commit bf0626a89358b48494066862843a91f36f2556cf.
 * Changes: typed headless composition, Mulberry RNG, explicit semantic classes,
 * setup-only population, zero-wealth Gini guard and bounded detached observations.
 */
import { Agent, Grid, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface WealthParameters {
  seed: number;
  people: number;
  maxVision: number;
  metabolismMax: number;
  bestLand: number;
  minLife: number;
  maxLife: number;
  growthInterval: number;
  growthAmount: number;
}
export const inputs: Inputs<WealthParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  people: { kind: "number", default: 250, min: 2, max: 1000, integer: true },
  maxVision: { kind: "number", default: 5, min: 1, max: 15, integer: true },
  metabolismMax: {
    kind: "number",
    default: 15,
    min: 1,
    max: 25,
    integer: true,
  },
  bestLand: { kind: "number", default: 10, min: 5, max: 25, integer: true },
  minLife: { kind: "number", default: 1, min: 1, max: 100, integer: true },
  maxLife: { kind: "number", default: 83, min: 1, max: 100, integer: true },
  growthInterval: {
    kind: "number",
    default: 1,
    min: 1,
    max: 10,
    integer: true,
  },
  growthAmount: { kind: "number", default: 4, min: 1, max: 10, integer: true },
};
type Person = Agent<{
  age: number;
  wealth: number;
  life: number;
  metabolism: number;
  vision: number;
}>;
export function wealthClass(
  value: number,
  maximum: number,
): "low" | "middle" | "high" {
  return value <= maximum / 3
    ? "low"
    : value <= (maximum * 2) / 3
      ? "middle"
      : "high";
}
export function profitableHeading(
  scores: readonly [number, number, number, number],
): number {
  let best = 0;
  for (let i = 1; i < scores.length; i += 1)
    if (scores[i]! > scores[best]!) best = i;
  return best * 90;
}
export function harvestedWealth(
  wealth: number,
  grain: number,
  occupants: number,
): number {
  return Math.floor(wealth + grain / occupants);
}
export function create(options: Partial<WealthParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.minLife > settings.maxLife)
    throw new RangeError("Minimum life cannot exceed maximum life.");
  const random = Random.add({ seed: settings.seed });
  const space = { x: 51, y: 51, boundary: "wrap" as const };
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { grain: 0, capacity: 0 } });
  world.add(grid);
  const fields = grid.fields;
  const integer = (upper: number) =>
    upper === 0 ? 0 : Math.floor(random.number() * upper);
  for (const field of fields)
    if (random.number() * 100 <= settings.bestLand)
      field.grain = field.capacity = 50;
  for (let i = 0; i < 5; i += 1) {
    for (const field of fields)
      if (field.capacity !== 0) field.grain = field.capacity;
    grid.diffuse("grain", { rate: 0.25, neighborhood: "moore" });
  }
  for (let i = 0; i < 10; i += 1)
    grid.diffuse("grain", { rate: 0.25, neighborhood: "moore" });
  for (const field of fields)
    field.grain = field.capacity = Math.floor(field.grain);
  const people: Person[] = [];
  function initialize(person: Person) {
    const heading = integer(4) * 90;
    person.rotate(heading - person.heading);
    person.life =
      settings.minLife + integer(settings.maxLife - settings.minLife + 1);
    person.metabolism = 1 + integer(settings.metabolismMax);
    person.wealth = person.metabolism + integer(50);
    person.vision = 1 + integer(settings.maxVision);
    person.age = integer(person.life);
  }
  for (let i = 0; i < settings.people; i += 1) {
    const field = random.sample(fields)[0]!;
    const person = Agent.add(
      { age: 0, wealth: 0, life: 1, metabolism: 1, vision: 1 },
      { position: { x: field.x, y: field.y } },
    );
    world.add(person);
    people.push(person);
    initialize(person);
  }
  function measurement() {
    const wealths = people.map((person) => person.wealth);
    const maximum = Math.max(...wealths);
    const classes = { low: 0, middle: 0, high: 0 };
    for (const person of people)
      classes[wealthClass(person.wealth, maximum)] += 1;
    const sorted = [...wealths].sort((a, b) => a - b);
    const totalWealth = sorted.reduce((sum, value) => sum + value, 0);
    let sum = 0;
    const lorenz = [
      Object.freeze({ x: 0, y: 0 }),
      ...sorted.map((value, index) => {
        sum += value;
        return Object.freeze({
          x: ((index + 1) / sorted.length) * 100,
          y:
            totalWealth === 0
              ? ((index + 1) / sorted.length) * 100
              : (sum / totalWealth) * 100,
        });
      }),
    ];
    return { classes, totalWealth, gini: stats.gini(wealths), lorenz };
  }
  const history: {
    tick: number;
    low: number;
    middle: number;
    high: number;
    gini: number;
  }[] = [];
  function record() {
    const m = measurement();
    history.push(
      Object.freeze({ tick: world.tick.value, ...m.classes, gini: m.gini }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function rules() {
    for (const person of people) {
      const scores = (
        [
          { x: 0, y: 1 },
          { x: 1, y: 0 },
          { x: 0, y: -1 },
          { x: -1, y: 0 },
        ] as const
      ).map((direction) => {
        let score = 0;
        for (let distance = 1; distance <= person.vision; distance += 1)
          score += grid.fieldAt({
            x: person.x + direction.x * distance,
            y: person.y + direction.y * distance,
          })!.grain;
        return score;
      });
      person.rotate(
        profitableHeading(scores as [number, number, number, number]) -
          person.heading,
      );
    }
    // All people share their old-cell harvest before any occupied cell is cleared.
    for (const person of people) {
      const field = grid.fieldAt(person)!;
      person.wealth = harvestedWealth(
        person.wealth,
        field.grain,
        grid.agentsAt(field, { source: people }).length,
      );
    }
    for (const person of people) grid.fieldAt(person)!.grain = 0;
    for (const person of random.sample(people, { count: people.length })) {
      person.move(1);
      person.wealth -= person.metabolism;
      person.age += 1;
      if (person.wealth < 0 || person.age >= person.life) initialize(person);
    }
    if (world.tick.value % settings.growthInterval === 0)
      for (const field of fields)
        field.grain = Math.min(
          field.capacity,
          field.grain + settings.growthAmount,
        );
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i += 1) {
        run(world, rules);
        record();
      }
    },
    setRules(
      rules: Partial<
        Pick<
          WealthParameters,
          | "maxVision"
          | "metabolismMax"
          | "minLife"
          | "maxLife"
          | "growthInterval"
          | "growthAmount"
        >
      >,
    ) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        Reflect.ownKeys(rules).some(
          (key) =>
            ![
              "maxVision",
              "metabolismMax",
              "minLife",
              "maxLife",
              "growthInterval",
              "growthAmount",
            ].includes(String(key)),
        )
      )
        throw new TypeError("Unknown live rule.");
      const next = parameters(inputs, { ...settings, ...rules });
      if (next.minLife > next.maxLife)
        throw new RangeError("Minimum life cannot exceed maximum life.");
      settings = next;
    },
    read() {
      const m = measurement();
      const maximum = Math.max(...people.map((person) => person.wealth));
      return Object.freeze({
        tick: world.tick.value,
        width: 51,
        height: 51,
        parameters: settings,
        peopleCount: people.length,
        totalWealth: m.totalWealth,
        classes: Object.freeze(m.classes),
        gini: m.gini,
        lorenz: Object.freeze(m.lorenz),
        agents: Object.freeze(
          people.map((person) =>
            Object.freeze({
              id: person.id,
              x: person.x,
              y: person.y,
              heading: person.heading,
              wealth: person.wealth,
              age: person.age,
              life: person.life,
              metabolism: person.metabolism,
              vision: person.vision,
              class: wealthClass(person.wealth, maximum),
            }),
          ),
        ),
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              grain: field.grain,
              capacity: field.capacity,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Wealth Distribution",
  description:
    "Resources, metabolism and unequal holdings. Adapted from Uri Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<WealthParameters, ReturnType<typeof create>>;
