/** NetLogo Blood Sugar Regulation, Wilensky (2017). See source.nlogox and NOTICE.md. */
import { Agent, Grid, Random, World, stats, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface BloodSugarParameters {
  seed: number;
  metabolicRate: number;
  glucoseSensitivity: number;
  insulinSensitivity: number;
  glucagonSensitivity: number;
}
export const inputs: Inputs<BloodSugarParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  metabolicRate: {
    kind: "number",
    default: 100,
    min: 0,
    max: 200,
    integer: true,
  },
  glucoseSensitivity: { kind: "number", default: 0.75, min: 0, max: 1 },
  insulinSensitivity: { kind: "number", default: 0.75, min: 0, max: 1 },
  glucagonSensitivity: { kind: "number", default: 0.75, min: 0, max: 1 },
};
type AgentGroup = "liver" | "pancreas" | "glucose" | "insulin" | "glucagon";
type Cell = Agent<{
  who: number;
  group: AgentGroup;
  glucoseStore: number;
  lifetime: number;
}>;
export function create(options: Partial<BloodSugarParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 33, y: 33, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const hormoneMeanLife = 2 / Math.log(2);
  const glucoseBaseline = 3;
  const mealSize = 7000;
  const mealLength = 17;
  let nextWho = 0;
  let eating = false;
  let eatTime = 0;
  let totalGlucose = 0;
  let followingId: string | null = null;
  const history: {
    tick: number;
    glucose: number;
    insulin: number;
    glucagon: number;
    stored: number;
    total: number;
  }[] = [];
  const all = () => world.agents as readonly Cell[];
  const group = (kind: AgentGroup) => all().filter((cell) => cell.group === kind);
  const shuffled = (cells: readonly Cell[]) =>
    random.sample(cells, {
      count: cells.length,
      algorithm: "fisher-yates-descending",
    });

  function randomPosition(cell: Cell) {
    // Source uses [-16,16), not random-xcor's wider half-cell extent.
    cell.move({
      to: { x: -16 + random.number() * 32, y: -16 + random.number() * 32 },
    });
  }

  function createCell(kind: AgentGroup, x = 0, y = 0) {
    return world.add(
      Agent.create(
        { who: nextWho++, group: kind, glucoseStore: 0, lifetime: 0 },
        {
          position: { x, y },
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      ),
    );
  }

  function createSignals(
    kind: "glucose" | "insulin" | "glucagon",
    count: number,
    inheritedHeading?: number,
  ) {
    const created: Cell[] = [];
    for (let index = 0; index < Math.round(count); index++) {
      const cell = createCell(kind);
      if (inheritedHeading !== undefined)
        cell.rotate(inheritedHeading - cell.heading);
      randomPosition(cell);
      if (kind !== "glucose")
        cell.lifetime = random.number({
          distribution: "exponential",
          mean: hormoneMeanLife,
        });
      created.push(cell);
    }
    return created;
  }

  function makeLiver() {
    for (const field of random.sample(
      grid.fields.filter((field) => field.x < 8),
      { count: 792, algorithm: "fisher-yates-descending" },
    )) {
      const liver = createCell("liver", field.x, field.y);
      liver.glucoseStore = random.number({
        distribution: "poisson",
        mean: 150,
      });
    }
  }

  function makePancreas() {
    for (const field of random.sample(
      grid.fields.filter((field) => field.x >= 8),
      { count: 297, algorithm: "fisher-yates-descending" },
    ))
      createCell("pancreas", field.x, field.y);
  }

  function updateTotalGlucose() {
    totalGlucose =
      group("glucose").length +
      stats.describe(group("liver").map((cell) => cell.glucoseStore)).sum;
  }

  function setup() {
    world.delete(all());
    nextWho = 0;
    eatTime = 0;
    eating = false;
    followingId = null;
    makeLiver();
    makePancreas();
    createSignals("glucose", 4356);
    createSignals("insulin", 363);
    createSignals("glucagon", 363);
    updateTotalGlucose();
    world.tick.reset();
    history.length = 0;
    record();
  }

  function randomBernoulli(probability: number) {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1)
      throw new RangeError("Probability must be between zero and one.");
    return random.number() < probability ? 1 : 0;
  }

  function randomBinomial(trials: number, probability: number) {
    if (!Number.isSafeInteger(trials) || trials < 0)
      throw new RangeError("Input n must be a non-negative integer.");
    if (!Number.isFinite(probability) || probability < 0 || probability > 1)
      throw new RangeError("Probability must be between zero and one.");
    let successes = 0;
    for (let trial = 0; trial < trials; trial++)
      successes += randomBernoulli(probability);
    return successes;
  }

  function eat() {
    eating = true;
    eatTime += mealLength;
  }

  function addGlucose() {
    // Chromium source runtime creates 412 for 7000/17 (nearest integer).
    createSignals("glucose", mealSize / mealLength);
    eatTime--;
    if (eatTime < 1) eating = false;
  }

  function adjustGlucose(liver: Cell) {
    const local = grid.agentsAt(grid.fieldAt(liver)!) as readonly Cell[];
    const insulinCount = randomBinomial(
      local.filter((cell) => cell.group === "insulin").length,
      settings.insulinSensitivity,
    );
    const glucagonCount = randomBinomial(
      local.filter((cell) => cell.group === "glucagon").length,
      settings.glucagonSensitivity,
    );
    const netSignal = glucagonCount - insulinCount;
    if (netSignal > 0) {
      const released = Math.min(liver.glucoseStore, netSignal);
      createSignals("glucose", released, liver.heading);
      liver.glucoseStore -= released;
    }
    if (netSignal < 0) {
      const glucoses = group("glucose");
      const absorbed = Math.min(glucoses.length, -netSignal);
      liver.glucoseStore += absorbed;
      for (const glucose of random.sample(glucoses, { count: absorbed }))
        glucose.delete();
    }
  }

  function adjustHormones(pancreas: Cell) {
    const local = grid.agentsAt(grid.fieldAt(pancreas)!) as readonly Cell[];
    const glucoseCount = randomBinomial(
      local.filter((cell) => cell.group === "glucose").length,
      settings.glucoseSensitivity,
    );
    const signalCount = Math.abs(glucoseBaseline - glucoseCount);
    if (glucoseCount < glucoseBaseline)
      createSignals("glucagon", signalCount, pancreas.heading);
    if (glucoseCount > glucoseBaseline)
      createSignals("insulin", signalCount, pancreas.heading);
  }

  function metabolizeGlucose() {
    const glucoses = group("glucose");
    for (const glucose of random.sample(glucoses, {
      count: Math.min(glucoses.length, settings.metabolicRate),
    }))
      glucose.delete();
  }

  function signalDegradation() {
    for (const hormone of [
      ...shuffled(group("insulin")),
      ...shuffled(group("glucagon")),
    ]) {
      hormone.lifetime--;
      if (hormone.lifetime <= 0) hormone.delete();
    }
  }

  function move(cell: Cell) {
    cell.rotate(random.number({ min: 0, max: 90, integer: true }));
    cell.rotate(-random.number({ min: 0, max: 90, integer: true }));
    cell.move(1);
  }

  function go() {
    if (eating) addGlucose();
    for (const liver of shuffled(group("liver"))) adjustGlucose(liver);
    for (const pancreas of shuffled(group("pancreas")))
      adjustHormones(pancreas);
    metabolizeGlucose();
    signalDegradation();
    for (const kind of ["insulin", "glucagon", "glucose"] as const) {
      for (const signal of shuffled(group(kind))) move(signal);
    }
    updateTotalGlucose();
  }

  function record() {
    history.push({
      tick: world.tick.value,
      glucose: group("glucose").length,
      insulin: group("insulin").length,
      glucagon: group("glucagon").length,
      stored: stats.describe(group("liver").map((cell) => cell.glucoseStore))
        .sum,
      total: totalGlucose,
    });
    if (history.length > 1001) history.splice(1, 1);
  }

  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      if (totalGlucose === 0) break;
      run(world, go);
      record();
    }
  }

  function setParameters(update: Partial<Omit<BloodSugarParameters, "seed">>) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "metabolicRate",
            "glucoseSensitivity",
            "insulinSensitivity",
            "glucagonSensitivity",
          ].includes(key),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }

  function followGlucose() {
    followingId = random.sample(group("glucose"))[0]?.id ?? null;
  }
  function followInsulin() {
    followingId = random.sample(group("insulin"))[0]?.id ?? null;
  }
  function followGlucagon() {
    followingId = random.sample(group("glucagon"))[0]?.id ?? null;
  }

  function read() {
    const agents = all().map((cell) => ({
      id: cell.id,
      who: cell.who,
      group: cell.group,
      x: cell.x,
      y: cell.y,
      heading: cell.heading,
      glucoseStore: cell.glucoseStore,
      lifetime: cell.lifetime,
      color:
        cell.group === "liver"
          ? "#a86a3d"
          : cell.group === "pancreas"
            ? "#d4bd25"
            : cell.group === "insulin"
              ? "#58b8ed"
              : cell.group === "glucagon"
                ? "#e43838"
                : "#ffffff",
    }));
    return {
      tick: world.tick.value,
      width: 33,
      height: 33,
      parameters: { ...settings },
      eating,
      eatTime,
      totalGlucose,
      stopped: totalGlucose === 0,
      followingId,
      glucoseCount: agents.filter((cell) => cell.group === "glucose").length,
      insulinCount: agents.filter((cell) => cell.group === "insulin").length,
      glucagonCount: agents.filter((cell) => cell.group === "glucagon").length,
      liverCells: agents.filter((cell) => cell.group === "liver"),
      pancreaticCells: agents.filter((cell) => cell.group === "pancreas"),
      storedGlucose: stats.describe(
        agents
          .filter((cell) => cell.group === "liver")
          .map((cell) => cell.glucoseStore),
      ).sum,
      agents,
      history: history.map((point) => ({ ...point })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    go,
    eat,
    addGlucose,
    makeLiver,
    makePancreas,
    randomPosition,
    randomBernoulli,
    randomBinomial,
    adjustGlucose,
    adjustHormones,
    metabolizeGlucose,
    signalDegradation,
    move,
    updateTotalGlucose,
    followGlucose,
    followInsulin,
    followGlucagon,
    setParameters,
  };
}
export const model = {
  title: "Blood Sugar Regulation",
  inputs,
  create,
} satisfies Definition<BloodSugarParameters, ReturnType<typeof create>>;
