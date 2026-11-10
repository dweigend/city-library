/** Wilensky (1997), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "B08-peppered-moths-native-composition-v1";
export interface Parameters {
  seed: number;
  mothCount: number;
  speed: number;
  mutation: number;
  selection: number;
  cyclePollution: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  mothCount: { kind: "number", default: 100, min: 0, max: 200, integer: true },
  speed: { kind: "number", default: 41, min: 1, max: 100 },
  mutation: { kind: "number", default: 15, min: 0, max: 100 },
  selection: { kind: "number", default: 50, min: 0, max: 100 },
  cyclePollution: { kind: "boolean", default: false },
};
type Moth = Agent<{ color: number; age: number }>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 33, y: 41, boundary: "wrap" }, { random });
  const grid = Grid.create(world.space!, { state: { color: 9 } });
  world.add(grid);
  let darkness = 0;
  let darkening = true;
  const history: {
    tick: number;
    light: number;
    medium: number;
    dark: number;
    darkness: number;
    pollution: number;
  }[] = [];
  const population = () => world.agents as readonly Moth[];
  function updateEnvironment() {
    for (const cell of grid.fields) cell.color = 9 - darkness;
  }
  function polluteWorld() {
    if (darkness <= 8 - settings.speed / 100) {
      darkness += settings.speed / 100;
      updateEnvironment();
    } else darkening = false;
  }
  function cleanUpWorld() {
    if (darkness >= settings.speed / 100) {
      darkness -= settings.speed / 100;
      updateEnvironment();
    } else darkening = true;
  }
  function cyclePollution() {
    if (darkening) polluteWorld();
    else cleanUpWorld();
  }
  function record() {
    const light = population().filter((a) => a.color >= 7).length;
    const dark = population().filter((a) => a.color <= 3).length;
    history.push({
      tick: world.tick.value,
      light,
      dark,
      medium: population().length - light - dark,
      darkness,
      pollution: (((4 * settings.mothCount) / 3) * darkness) / 8,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    random.reseed(settings.seed);
    darkness = 0;
    darkening = true;
    updateEnvironment();
    history.length = 0;
    for (let i = 0; i < settings.mothCount; i++) {
      world.add(
        Agent.create(
          {
            color: random.number({ min: 1, max: 10, integer: true }),
            age: random.number({ max: 3, integer: true }),
          },
          {
            position: {
              x: random.number() * 33 - 16.5,
              y: random.number() * 41 - 20.5,
            },
            orientation: {
              heading: random.number({ max: 360, integer: true }),
            },
          },
        ),
      );
    }
    record();
  }
  function mothsMate(moth: Moth) {
    if (moth.age !== 2 && moth.age !== 3) return;
    for (let i = 0; i < 2; i++) {
      const child = moth.copy();
      world.add(child);
      if (random.number() * 100 < settings.mutation) {
        if (random.number({ max: 2, integer: true }) === 0)
          child.color = Math.min(
            9,
            Math.round(
              child.color + (random.number() * settings.mutation) / 12.5,
            ),
          );
        else
          child.color = Math.max(
            1,
            Math.round(
              child.color - (random.number() * settings.mutation) / 12.5,
            ),
          );
      }
      child.age = 0;
      child.rotate(random.number() * 360);
      child.move(1);
    }
  }
  function mothsGrimReaper(moth: Moth) {
    if (random.number({ max: 13, integer: true }) === 0) {
      moth.delete();
      return;
    }
    if (
      population().length > 4 * settings.mothCount &&
      random.number({ max: 2, integer: true }) === 0
    )
      moth.delete();
  }
  function mothsGetEaten(moth: Moth) {
    if (
      random.number() * 1000 <
      settings.selection * Math.abs(9 - darkness - moth.color) + 200
    )
      moth.delete();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      const old = population();
      for (const moth of random.sample(old, {
        count: old.length,
        compatibility: "legacy-shuffle",
      })) {
        mothsMate(moth);
        mothsGrimReaper(moth);
        if (!moth.alive) continue;
        mothsGetEaten(moth);
        if (moth.alive) moth.age++;
      }
      if (settings.cyclePollution) cyclePollution();
      world.tick.advance();
      record();
    }
  }
  function read() {
    const current = history.at(-1)!;
    return {
      sourceMarker,
      tick: world.tick.value,
      width: 33,
      height: 41,
      darkness,
      darkening,
      envColor: 9 - darkness,
      pollutionPercent: (100 * darkness) / 8,
      parameters: settings,
      lightMoths: current.light,
      mediumMoths: current.medium,
      darkMoths: current.dark,
      moths: population().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        heading: a.heading,
        color: a.color,
        age: a.age,
      })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        color: f.color,
      })),
      history: history.map((p) => ({ ...p })),
      randomState: random.state,
    };
  }
  setup();
  return {
    setup,
    advance,
    read,
    polluteWorld,
    cleanUpWorld,
    cyclePollution,
    mothsMate,
    mothsGrimReaper,
    mothsGetEaten,
    setParameters(update: Partial<Omit<Parameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...update });
    },
  };
}
export const model = {
  title: "Peppered Moths",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
