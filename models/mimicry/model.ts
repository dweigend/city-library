/** Wilensky (1997), CC BY-NC-SA 3.0. See NOTICE.md and source.nlogox. */
import { Agent, Grid, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "B08-mimicry-native-composition-v1";
export type Memory = readonly (readonly [number, number])[];
export function colorInMemory(memory: Memory, color: number): boolean {
  return memory.some((entry) => entry[0] === color);
}
export function rememberColor(
  memory: Memory,
  color: number,
  size: number,
): [number, number][] {
  if (size === 0 && memory.length === 0)
    throw new RangeError("Source but-first received an empty memory.");
  const retained = memory.length >= size ? memory.slice(1) : memory;
  return [
    ...retained.map(([c, age]): [number, number] => [c, age]),
    [color, 0],
  ];
}
export function forgetColors(
  memory: Memory,
  duration: number,
): [number, number][] {
  return memory
    .map(([color, age]): [number, number] => [color, age + 1])
    .filter((entry) => entry[1] <= duration);
}
export interface Parameters {
  seed: number;
  memoryDuration: number;
  mutationRate: number;
  memorySize: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  memoryDuration: {
    kind: "number",
    default: 30,
    min: 0,
    max: 40,
    integer: true,
  },
  mutationRate: { kind: "number", default: 5, min: 0, max: 100 },
  memorySize: { kind: "number", default: 3, min: 0, max: 10, integer: true },
};
type Butterfly = Agent<{
  group: "monarch" | "viceroy" | "bird";
  color: number;
  memory: [number, number][];
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 41, y: 41, boundary: "wrap" }, { random });
  const grid = Grid.create(world.space!);
  world.add(grid);
  const history: {
    tick: number;
    monarchs: number;
    viceroys: number;
    monarchMeanColor: number | undefined;
    viceroyMeanColor: number | undefined;
  }[] = [];
  function population(group?: Butterfly["group"]) {
    const all = world.agents as readonly Butterfly[];
    return group === undefined ? all : all.filter((a) => a.group === group);
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    random.reseed(settings.seed);
    for (const [group, count, color] of [
      ["bird", 75, 0],
      ["monarch", 225, 15],
      ["viceroy", 225, 105],
    ] as const) {
      for (let i = 0; i < count; i++) {
        world.add(
          Agent.create(
            { group, color, memory: [] as [number, number][] },
            {
              position: {
                x: random.number() * 41 - 20.5,
                y: random.number() * 41 - 20.5,
              },
              orientation: {
                heading: random.number({ max: 360, integer: true }),
              },
            },
          ),
        );
      }
    }
    history.length = 0;
    record();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      monarchs: population("monarch").length,
      viceroys: population("viceroy").length,
      monarchMeanColor: stats.describe(
        population("monarch").map((a) => a.color),
      ).mean,
      viceroyMeanColor: stats.describe(
        population("viceroy").map((a) => a.color),
      ).mean,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function birdsMove() {
    for (const bird of random.sample(population("bird"), {
      count: population("bird").length,
      algorithm: "fisher-yates-descending",
    })) {
      bird.rotate(
        180 + random.number({ max: 180, integer: true }) - bird.heading,
      );
      bird.move(1);
    }
  }
  function butterfliesMove() {
    const butterflies = population().filter((a) => a.group !== "bird");
    for (const butterfly of random.sample(butterflies, {
      count: butterflies.length,
      algorithm: "fisher-yates-descending",
    })) {
      butterfly.rotate(random.number({ max: 100, integer: true }));
      butterfly.rotate(-random.number({ max: 100, integer: true }));
      butterfly.move(1);
    }
  }
  function butterfliesGetEaten() {
    const butterflies = population().filter((a) => a.group !== "bird");
    for (const butterfly of random.sample(butterflies, {
      count: butterflies.length,
      algorithm: "fisher-yates-descending",
    })) {
      const field = grid.fieldAt(butterfly)!;
      const birds = grid.agentsAt(field, { source: population("bird") });
      const bird = random.sample(birds)[0];
      if (bird && !colorInMemory(bird.memory, butterfly.color)) {
        if (butterfly.group === "monarch")
          bird.memory = rememberColor(
            bird.memory,
            butterfly.color,
            settings.memorySize,
          );
        butterfly.delete();
      }
    }
  }
  function birdsForget() {
    const birds = population("bird");
    for (const bird of random.sample(birds, {
      count: birds.length,
      algorithm: "fisher-yates-descending",
    }))
      bird.memory = forgetColors(bird.memory, settings.memoryDuration);
  }
  function butterfliesReproduce() {
    const butterflies = population().filter((a) => a.group !== "bird");
    for (const butterfly of random.sample(butterflies, {
      count: butterflies.length,
      algorithm: "fisher-yates-descending",
    })) {
      const count = population(butterfly.group).length;
      if (
        random.number({ max: count, integer: true }) < 225 - count &&
        random.number() * 100 < 4
      ) {
        const child = butterfly.copy();
        world.add(child);
        child.move(1);
        if (random.number() * 100 < settings.mutationRate)
          child.color = random.sample([15, 25, 35, 45, 55, 65, 75, 85, 95])[0]!;
      }
    }
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      birdsMove();
      butterfliesMove();
      butterfliesGetEaten();
      birdsForget();
      butterfliesReproduce();
      world.tick.advance();
      record();
    }
  }
  function read() {
    const snapshots = population().map((a) => ({
      id: a.id,
      x: a.x,
      y: a.y,
      heading: a.heading,
      color: a.color,
      group: a.group,
      memory: a.memory.map((entry) => [...entry] as [number, number]),
    }));
    return {
      sourceMarker,
      tick: world.tick.value,
      width: 41,
      height: 41,
      parameters: settings,
      monarchColor: stats.describe(population("monarch").map((a) => a.color)),
      viceroyColor: stats.describe(population("viceroy").map((a) => a.color)),
      birds: snapshots.filter((a) => a.group === "bird"),
      monarchs: snapshots.filter((a) => a.group === "monarch"),
      viceroys: snapshots.filter((a) => a.group === "viceroy"),
      history: history.map((p) => ({ ...p })),
      randomState: random.state,
    };
  }
  setup();
  return {
    setup,
    advance,
    read,
    birdsMove,
    butterfliesMove,
    butterfliesGetEaten,
    birdsForget,
    butterfliesReproduce,
    setParameters(update: Partial<Omit<Parameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...update });
    },
  };
}
export const model = { title: "Mimicry", description: "Birds learn to avoid bad-tasting butterflies, and tasty butterflies evolve to look like them.", inputs, create } satisfies Definition<
  Parameters,
  ReturnType<typeof create>
>;
