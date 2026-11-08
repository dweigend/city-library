/** NetLogo Autumn (Wilensky, 2005). Complete notices: NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface AutumnParameters {
  seed: number;
  numberOfLeaves: number;
  startSugarMean: number;
  startSugarStddev: number;
  windFactor: number;
  temperature: number;
  rainIntensity: number;
  sunIntensity: number;
  leafDisplayMode:
    | "solid"
    | "chlorophyll"
    | "water"
    | "sugar"
    | "carotene"
    | "anthocyanin"
    | "attachedness";
}
export const inputs: Inputs<AutumnParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberOfLeaves: {
    kind: "number",
    default: 278,
    min: 1,
    max: 2500,
    integer: true,
  },
  startSugarMean: { kind: "number", default: 50, min: 0, max: 100 },
  startSugarStddev: { kind: "number", default: 25, min: 0, max: 50 },
  windFactor: { kind: "number", default: 3, min: 0, max: 10 },
  temperature: { kind: "number", default: 11, min: 0, max: 40 },
  rainIntensity: {
    kind: "number",
    default: 19,
    min: 0,
    max: 30,
    integer: true,
  },
  sunIntensity: { kind: "number", default: 97, min: 0, max: 100 },
  leafDisplayMode: {
    kind: "choice",
    default: "attachedness",
    options: [
      "solid",
      "chlorophyll",
      "water",
      "sugar",
      "carotene",
      "anthocyanin",
      "attachedness",
    ],
  },
};
type Organism = Agent<{
  breed: "leaf" | "dead-leaf" | "raindrop" | "sun";
  waterLevel: number;
  sugarLevel: number;
  attachedness: number;
  chlorophyll: number;
  carotene: number;
  anthocyanin: number;
  location: "falling" | "in roots" | "in trunk" | "in leaves";
  amountOfWater: number;
  color: string;
  fillFraction: number;
  size: number;
}>;
const organismState = {
  waterLevel: 0,
  sugarLevel: 0,
  attachedness: 0,
  chlorophyll: 0,
  carotene: 0,
  anthocyanin: 0,
  location: "falling" as const,
  amountOfWater: 0,
  color: "#777777",
  fillFraction: 1,
  size: 1,
};
export function create(options: Partial<AutumnParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "hard" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space, {
    state: { terrain: "sky" as "sky" | "ground" | "tree" },
  });
  world.add(grid);
  const organisms = () => world.agents as readonly Organism[];
  const leaves = () =>
    organisms().filter((organism) => organism.breed === "leaf");
  const raindrops = () =>
    organisms().filter((organism) => organism.breed === "raindrop");
  const bottomLine = -16;
  let stopped = false;
  const history: {
    tick: number;
    leaves: number;
    deadLeaves: number;
    temperature: number;
    rain: number;
    wind: number;
    sunlight: number;
    chlorophyll: number | undefined;
    water: number | undefined;
    sugar: number | undefined;
    carotene: number | undefined;
    anthocyanin: number | undefined;
    attachedness: number | undefined;
  }[] = [];

  function forwardWeather(organism: Organism, amount: number) {
    let remaining = amount;
    while (Math.abs(remaining) > 1e-12) {
      const distance = Math.sign(remaining) * Math.min(1, Math.abs(remaining));
      const direction = geometry.direction({ heading: organism.heading });
      const next = geometry.normalize(
        {
          x: organism.x + direction.x * distance,
          y: organism.y + direction.y * distance,
        },
        { space, endpoints: "half-open" },
      );
      if (!next) break;
      organism.move(distance);
      remaining -= distance;
    }
  }
  function clip(value: number) {
    return Math.max(0, Math.min(100, value));
  }
  function changeColor(leaf: Organism) {
    if (
      settings.temperature < 20 &&
      leaf.sugarLevel > 0 &&
      leaf.waterLevel > 0
    ) {
      leaf.sugarLevel--;
      leaf.waterLevel--;
      leaf.anthocyanin++;
    }
    if (leaf.chlorophyll > 50) leaf.color = "#348b34";
    else {
      // The source has three independent branches and leaves the color unchanged at exact difference ±10.
      if (Math.abs(leaf.anthocyanin - leaf.carotene) < 10)
        leaf.color = "#e58b29";
      if (leaf.anthocyanin > leaf.carotene + 10) leaf.color = "#d63838";
      if (leaf.carotene > leaf.anthocyanin + 10) leaf.color = "#e1cf32";
    }
  }
  function setShapeForValue(leaf: Organism, value: number) {
    leaf.fillFraction =
      value > 75 ? 1 : value <= 25 ? 0.25 : value <= 50 ? 0.5 : 0.75;
  }
  function changeShape(leaf: Organism) {
    if (settings.leafDisplayMode === "solid") leaf.fillFraction = 1;
    else {
      const value =
        settings.leafDisplayMode === "water"
          ? leaf.waterLevel
          : settings.leafDisplayMode === "sugar"
            ? leaf.sugarLevel
            : leaf[settings.leafDisplayMode];
      setShapeForValue(leaf, value);
    }
  }
  function showIntensity(sun: Organism) {
    sun.size = settings.sunIntensity / 10;
    sun.color = "#e9cf31";
  }
  function setupTree() {
    for (const field of grid.fields) {
      if (field.y < -15) field.terrain = "ground";
    }
    for (let index = 0; index < settings.numberOfLeaves; index++) {
      const leaf = Agent.add(
        {
          ...organismState,
          breed: "leaf" as const,
          chlorophyll: 50 + random.number({ min: 0, max: 50, integer: true }),
          waterLevel: 75 + random.number({ min: 0, max: 25, integer: true }),
          sugarLevel: random.number({
            distribution: "normal",
            mean: settings.startSugarMean,
            deviation: settings.startSugarStddev,
          }),
          carotene: random.number({ min: 0, max: 100, integer: true }),
        },
        {
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(leaf);
      changeColor(leaf);
      leaf.attachedness =
        100 + random.number({ min: 0, max: 50, integer: true });
      forwardWeather(leaf, Math.sqrt(random.number() * 100));
    }
    for (const field of grid.fields) {
      if (
        (field.x === 0 && field.y <= 5) ||
        (Math.abs(field.x) === field.y + 2 && field.y < 4) ||
        (Math.abs(field.x) === field.y + 8 && field.y < 3)
      )
        field.terrain = "tree";
    }
    const sun = Agent.add(
      { ...organismState, breed: "sun" as const },
      { position: { x: 15, y: 14 } },
    );
    world.add(sun);
    showIntensity(sun);
  }
  function attachedLeaves() {
    return leaves().filter((leaf) => leaf.attachedness > 0);
  }
  function makeWindBlow() {
    for (const leaf of random.sample(leaves(), {
      count: leaves().length,
      compatibility: "legacy-shuffle",
    })) {
      leaf.rotate(
        (random.number({ min: 0, max: 2, integer: true }) === 1 ? 1 : -1) *
          10 *
          settings.windFactor,
      );
      leaf.attachedness -= settings.windFactor;
    }
  }
  function makeRainFall() {
    for (let index = 0; index < settings.rainIntensity; index++) {
      const drop = Agent.add(
        {
          ...organismState,
          breed: "raindrop" as const,
          amountOfWater: 10,
          size: 0.3,
        },
        {
          position: { x: random.number() * 35 - 17.5, y: 17 },
          orientation: { heading: 180 },
        },
      );
      world.add(drop);
      forwardWeather(drop, 0.5 - random.number());
    }
    for (const drop of random.sample(raindrops(), {
      count: raindrops().length,
      compatibility: "legacy-shuffle",
    }))
      forwardWeather(drop, random.number() * 2);
  }
  function moveWater() {
    for (const drop of raindrops().filter(
      (drop) =>
        drop.location === "falling" && grid.fieldAt(drop)!.terrain === "ground",
    )) {
      drop.location = "in roots";
      drop.rotate({ towards: grid.fieldAt({ x: 0, y: drop.y })! });
    }
    for (const drop of raindrops().filter(
      (drop) =>
        drop.location === "in roots" && grid.fieldAt(drop)!.terrain === "tree",
    )) {
      drop.rotate({ towards: { x: 0, y: 0 } });
      drop.location = "in trunk";
    }
    for (const drop of raindrops().filter(
      (drop) =>
        drop.location === "in trunk" &&
        grid.fieldAt(drop) === grid.fieldAt({ x: 0, y: 0 }),
    )) {
      drop.location = "in leaves";
      drop.rotate(
        random.number({ min: 0, max: 360, integer: true }) - drop.heading,
      );
    }
    for (const drop of raindrops().filter(
      (drop) => drop.location === "in leaves" && drop.amountOfWater <= 0.5,
    ))
      drop.delete();
    const xBounds = stats.describe(leaves().map((leaf) => leaf.x));
    const yBounds = stats.describe(leaves().map((leaf) => leaf.y));
    for (const drop of raindrops().filter(
      (drop) =>
        (drop.location === "in trunk" || drop.location === "in leaves") &&
        (drop.y > yBounds.max! ||
          drop.x > xBounds.max! ||
          drop.x < xBounds.min!),
    ))
      drop.delete();
  }
  function adjustWater(leaf: Organism) {
    if (settings.temperature < 10) return;
    const nearby = leaf
      .neighbors({ source: raindrops(), radius: 2 })
      .filter(
        (drop) => drop.location === "in leaves" && drop.amountOfWater >= 0,
      );
    if (nearby.length) {
      const distance = Math.min(...nearby.map((drop) => leaf.distanceTo(drop)));
      const selected = random.sample(
        nearby.filter((drop) => leaf.distanceTo(drop) === distance),
      )[0]!;
      leaf.waterLevel += selected.amountOfWater * 0.2;
      selected.amountOfWater *= 0.8;
    }
    if (settings.temperature > 30)
      leaf.waterLevel -= 0.5 * (settings.temperature - 30);
    if (leaf.waterLevel < 25) leaf.attachedness--;
  }
  function adjustChlorophyll(leaf: Organism) {
    if (settings.temperature < 15)
      leaf.chlorophyll -= 0.5 * (15 - settings.temperature);
    if (settings.sunIntensity > 75)
      leaf.chlorophyll -= 0.5 * (settings.sunIntensity - 75);
    if (settings.temperature > 15 && settings.sunIntensity > 20)
      leaf.chlorophyll++;
  }
  function adjustSugar(leaf: Organism) {
    if (
      leaf.waterLevel > 1 &&
      settings.sunIntensity > 20 &&
      leaf.chlorophyll > 1
    ) {
      leaf.waterLevel -= 0.5;
      leaf.chlorophyll -= 0.5;
      leaf.sugarLevel++;
      leaf.attachedness += 5;
    }
    leaf.sugarLevel -= 0.5;
  }
  function fallIfNecessary(leaf: Organism) {
    if (leaf.attachedness > 0) return;
    if (leaf.y > bottomLine) {
      const targetX =
        leaf.x +
        random.number() * settings.windFactor -
        random.number() * settings.windFactor;
      // Source facexy permits an outside target; only forward movement
      // is constrained by the world's hard edges.
      leaf.rotate({ towards: { x: targetX, y: bottomLine } });
      forwardWeather(
        leaf,
        random.number() * 0.7 * Math.max(settings.windFactor, 0.5),
      );
    }
  }
  function go() {
    makeWindBlow();
    makeRainFall();
    moveWater();
    for (const sun of organisms().filter(
      (organism) => organism.breed === "sun",
    ))
      showIntensity(sun);
    const attached = attachedLeaves();
    for (const leaf of random.sample(attached, {
      count: attached.length,
      compatibility: "legacy-shuffle",
    })) {
      adjustWater(leaf);
      adjustChlorophyll(leaf);
      adjustSugar(leaf);
      changeColor(leaf);
      changeShape(leaf);
    }
    for (const leaf of random.sample(leaves(), {
      count: leaves().length,
      compatibility: "legacy-shuffle",
    }))
      fallIfNecessary(leaf);
    for (const leaf of leaves().filter((leaf) => leaf.y <= bottomLine))
      leaf.breed = "dead-leaf";
    for (const leaf of leaves().filter((leaf) => leaf.waterLevel < 1))
      leaf.attachedness = 0;
    for (const leaf of leaves()) {
      leaf.chlorophyll = clip(leaf.chlorophyll);
      leaf.waterLevel = clip(leaf.waterLevel);
      leaf.sugarLevel = clip(leaf.sugarLevel);
      leaf.carotene = clip(leaf.carotene);
      leaf.anthocyanin = clip(leaf.anthocyanin);
      leaf.attachedness = clip(leaf.attachedness);
    }
  }
  function record() {
    const living = leaves();
    history.push({
      tick: world.tick.value,
      leaves: living.length,
      deadLeaves: organisms().filter(
        (organism) => organism.breed === "dead-leaf",
      ).length,
      temperature: settings.temperature,
      rain: settings.rainIntensity,
      wind: settings.windFactor,
      sunlight: settings.sunIntensity,
      chlorophyll: stats.describe(living.map((leaf) => leaf.chlorophyll)).mean,
      water: stats.describe(living.map((leaf) => leaf.waterLevel)).mean,
      sugar: stats.describe(living.map((leaf) => leaf.sugarLevel)).mean,
      carotene: stats.describe(living.map((leaf) => leaf.carotene)).mean,
      anthocyanin: stats.describe(living.map((leaf) => leaf.anthocyanin)).mean,
      attachedness: stats.describe(living.map((leaf) => leaf.attachedness))
        .mean,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      if (!leaves().length) {
        stopped = true;
        break;
      }
      run(world, go);
      record();
    }
  }
  function setParameters(
    update: Partial<
      Omit<
        AutumnParameters,
        "seed" | "numberOfLeaves" | "startSugarMean" | "startSugarStddev"
      >
    >,
  ) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "windFactor",
            "temperature",
            "rainIntensity",
            "sunIntensity",
            "leafDisplayMode",
          ].includes(key),
      )
    )
      throw new TypeError("Only weather and display fields are live.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    const snapshot = organisms().map((organism) => ({
      id: organism.id,
      breed: organism.breed,
      x: organism.x,
      y: organism.y,
      heading: organism.heading,
      waterLevel: organism.waterLevel,
      sugarLevel: organism.sugarLevel,
      chlorophyll: organism.chlorophyll,
      carotene: organism.carotene,
      anthocyanin: organism.anthocyanin,
      attachedness: organism.attachedness,
      location: organism.location,
      amountOfWater: organism.amountOfWater,
      color: organism.color,
      size: organism.size,
      fillFraction: organism.fillFraction,
    }));
    return {
      tick: world.tick.value,
      width: 35,
      height: 35,
      parameters: { ...settings },
      stopped,
      leaves: snapshot.filter((organism) => organism.breed === "leaf"),
      deadLeaves: snapshot.filter((organism) => organism.breed === "dead-leaf"),
      raindrops: snapshot.filter((organism) => organism.breed === "raindrop"),
      suns: snapshot.filter((organism) => organism.breed === "sun"),
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        terrain: field.terrain,
        color:
          field.terrain === "tree"
            ? "#8a5c2e"
            : field.terrain === "ground"
              ? "#3c9c35"
              : "#253f88",
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setupTree();
  record();
  return {
    advance,
    read,
    setParameters,
    clip,
    forwardWeather,
    changeColor,
    changeShape,
    setShapeForValue,
    showIntensity,
    attachedLeaves,
    setupTree,
    makeWindBlow,
    makeRainFall,
    moveWater,
    adjustWater,
    adjustChlorophyll,
    adjustSugar,
    fallIfNecessary,
    go,
  };
}
export const model = { title: "Autumn", inputs, create } satisfies Definition<
  AutumnParameters,
  ReturnType<typeof create>
>;
