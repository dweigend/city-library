/** Wilensky (1997), CC BY-NC-SA 3.0; see NOTICE.md. Static native terrain: data/terrain.json. */
import { Agent, Grid, Random, World, geometry } from "city-library";
import terrain from "./data/terrain.json";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "B08-mammoths-native-mask-composition-v1";
export interface Parameters {
  seed: number;
  numberOfMammoths: number;
  numberOfHumans: number;
  mammothBirthRate: number;
  humanBirthRate: number;
  mammothSpeed: number;
  humanSpeed: number;
  oddsOfKilling: number;
  climateChangeDecayChance: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberOfMammoths: {
    kind: "number",
    default: 900,
    min: 0,
    max: 2000,
    integer: true,
  },
  numberOfHumans: {
    kind: "number",
    default: 50,
    min: 0,
    max: 100,
    integer: true,
  },
  mammothBirthRate: { kind: "number", default: 2, min: 0, max: 10 },
  humanBirthRate: { kind: "number", default: 10, min: 0, max: 20 },
  mammothSpeed: { kind: "number", default: 0.2, min: 0, max: 1 },
  humanSpeed: { kind: "number", default: 0.3, min: 0, max: 1 },
  oddsOfKilling: { kind: "number", default: 12, min: 1, max: 97 },
  climateChangeDecayChance: {
    kind: "number",
    default: 0.003,
    min: 0,
    max: 100,
  },
};
type Resident = Agent<{
  group: "mammoth" | "human";
  age: number;
  settled: boolean;
}>;
type Terrain = "land" | "ocean" | "changed";
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  // NetLogo centers0..96 become City Library centers-48..48; no runtime image conversion.
  const world = World.create({ x: 97, y: 97, boundary: "hard" }, { random });
  const grid = Grid.create(world.space!, {
    state: { terrain: "ocean" as Terrain },
  });
  world.add(grid);
  let mammothsKilledByHumans = 0;
  let mammothsKilledByClimateChange = 0;
  const history: {
    tick: number;
    mammoths: number;
    humans: number;
    hunting: number;
    climate: number;
  }[] = [];
  const population = (group?: Resident["group"]) =>
    (world.agents as readonly Resident[]).filter(
      (a) => group === undefined || a.group === group,
    );
  function record() {
    history.push({
      tick: world.tick.value,
      mammoths: population("mammoth").length,
      humans: population("human").length,
      hunting: mammothsKilledByHumans,
      climate: mammothsKilledByClimateChange,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    random.reseed(settings.seed);
    history.length = 0;
    mammothsKilledByHumans = 0;
    mammothsKilledByClimateChange = 0;
    for (const field of grid.fields)
      field.terrain =
        terrain.rows[field.y + 48]![field.x + 48] === "1" ? "land" : "ocean";
    for (const group of ["mammoth", "human"] as const) {
      const count =
        group === "mammoth"
          ? settings.numberOfMammoths
          : settings.numberOfHumans;
      const eligible = grid.fields.filter(
        (field) =>
          field.terrain === "land" &&
          (group === "mammoth" || field.x + 48 <= 10),
      );
      for (let i = 0; i < count; i++) {
        const field = random.sample(eligible)[0]!;
        world.add(
          Agent.create(
            {
              group,
              age: random.number({
                max: (group === "mammoth" ? 30 : 50) * 12,
                integer: true,
              }),
              settled: false,
            },
            {
              position: { x: field.x, y: field.y },
              orientation: {
                heading:
                  group === "human"
                    ? -5 + random.number({ max: 10, integer: true })
                    : random.number({ max: 360, integer: true }),
              },
            },
          ),
        );
      }
    }
    record();
  }
  function landAhead(resident: Resident, distance: number): boolean {
    const forward = geometry.direction({ heading: resident.heading });
    const field = grid.fieldAt({
      x: resident.x + distance * forward.x,
      y: resident.y + distance * forward.y,
    });
    return field !== undefined && field.terrain !== "ocean";
  }
  function move(resident: Resident, distance: number) {
    resident.rotate(random.number({ max: 30, integer: true }));
    resident.rotate(-random.number({ max: 30, integer: true }));
    const turn = random.sample([-10, 10])[0]!;
    let attempts = 0;
    while (!landAhead(resident, distance)) {
      resident.rotate(turn);
      // The original loops forever if no direction can reach land. Expose a bounded error.
      if (++attempts >= 36)
        throw new RangeError(
          "No land-ahead heading in one complete source turning cycle.",
        );
    }
    resident.move(distance);
  }
  function reproduce(resident: Resident, minAge: number, birthRate: number) {
    if (
      resident.age >= minAge &&
      random.number({ max: 100, integer: true }) < birthRate
    ) {
      const child = resident.copy();
      world.add(child);
      child.age = 0;
      if (child.group === "human") child.settled = false;
    }
  }
  function density(resident: Resident): number {
    const here = grid.fieldAt(resident)!;
    const fields = [here, ...grid.neighbors(here, { neighborhood: "moore" })];
    return (
      population(resident.group).filter((a) =>
        fields.includes(grid.fieldAt(a)!),
      ).length / 9
    );
  }
  function climateChange() {
    const land = grid.fields.filter((field) => field.terrain === "land");
    for (const field of random.sample(land, {
      count: land.length,
      compatibility: "legacy-shuffle",
    })) {
      if (random.number() * 100 < settings.climateChangeDecayChance)
        field.terrain = "changed";
    }
  }
  function mammothsAct() {
    const mammoths = population("mammoth");
    for (const mammoth of random.sample(mammoths, {
      count: mammoths.length,
      compatibility: "legacy-shuffle",
    })) {
      move(mammoth, settings.mammothSpeed);
      reproduce(mammoth, 3 * 12, settings.mammothBirthRate);
    }
  }
  function humansAct() {
    const humans = population("human");
    for (const human of random.sample(humans, {
      count: humans.length,
      compatibility: "legacy-shuffle",
    })) {
      const nearby = human.neighbors({
        source: population("mammoth"),
        radius: 5,
      });
      if (
        !human.settled &&
        random.number({ max: 100, integer: true }) < nearby.length
      )
        human.settled = true;
      if (!human.settled) {
        if (nearby.length) {
          const shuffled = random.sample(nearby, {
            count: nearby.length,
            compatibility: "legacy-shuffle",
          });
          shuffled.sort((a, b) => human.distanceTo(a) - human.distanceTo(b));
          human.rotate({ towards: shuffled[0]! });
        }
        move(human, settings.humanSpeed);
      }
      const mammothsHere = grid.agentsAt(grid.fieldAt(human)!, {
        source: population("mammoth"),
      });
      if (mammothsHere.length) {
        const r = random.number({ max: 100, integer: true });
        if (r < 3) {
          human.delete();
          continue;
        }
        if (r < 3 + settings.oddsOfKilling) {
          random.sample(mammothsHere)[0]!.delete();
          mammothsKilledByHumans++;
        }
      }
      reproduce(human, 12 * 12, settings.humanBirthRate);
    }
  }
  function dieNaturally() {
    for (const group of ["human", "mammoth"] as const) {
      const group = population(group);
      for (const resident of random.sample(group, {
        count: group.length,
        compatibility: "legacy-shuffle",
      })) {
        if (
          resident.age > (group === "human" ? 50 : 30) * 12 &&
          random.number() * 100 < 5
        ) {
          resident.delete();
          continue;
        }
        if (
          density(resident) > (group === "human" ? 0.75 : 0.5) &&
          random.number() * 100 < 5
        ) {
          resident.delete();
          continue;
        }
        if (
          group === "mammoth" &&
          grid.fieldAt(resident)!.terrain === "changed" &&
          random.number() * 100 < 5
        ) {
          mammothsKilledByClimateChange++;
          resident.delete();
          continue;
        }
        if (random.number() * 100 < 0.33) resident.delete();
      }
    }
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      climateChange();
      mammothsAct();
      humansAct();
      dieNaturally();
      for (const resident of population()) resident.age++;
      world.tick.advance();
      record();
    }
  }
  function read() {
    const agents = population().map((a) => ({
      id: a.id,
      x: a.x,
      y: a.y,
      originalX: a.x + 48,
      originalY: a.y + 48,
      heading: a.heading,
      age: a.age,
      settled: a.settled,
      group: a.group,
    }));
    return {
      sourceMarker,
      tick: world.tick.value,
      width: 97,
      height: 97,
      years: world.tick.value / 12,
      parameters: settings,
      mammothsKilledByHumans,
      mammothsKilledByClimateChange,
      mammoths: agents.filter((a) => a.group === "mammoth"),
      humans: agents.filter((a) => a.group === "human"),
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        originalX: field.x + 48,
        originalY: field.y + 48,
        terrain: field.terrain,
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
    landAhead,
    move,
    reproduce,
    density,
    climateChange,
    mammothsAct,
    humansAct,
    dieNaturally,
    setParameters(
      update: Partial<
        Omit<Parameters, "seed" | "numberOfMammoths" | "numberOfHumans">
      >,
    ) {
      settings = parameters(inputs, { ...settings, ...update });
    },
  };
}
export const model = { title: "Mammoths", inputs, create } satisfies Definition<
  Parameters,
  ReturnType<typeof create>
>;
