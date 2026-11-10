/** Wilensky (2023), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "B08-anisogamy-native-composition-v1";
export function gameteDiameter(mass: number): number {
  return 2 * Math.sqrt(mass / Math.PI);
}
export function tickAdvanceAmount(diameters: readonly number[]): number {
  return diameters.length ? Math.min(...diameters) / gameteDiameter(0.5) : 1;
}
export interface Parameters {
  seed: number;
  maxAdults: number;
  worldSize: number;
  zygoteFitnessThreshold: number;
  gameteFitnessThreshold: number;
  mutationSigma: number;
  speedSizeCorrelation: boolean;
  allowAssortativeFusion: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  maxAdults: { kind: "number", default: 100, min: 10, max: 500, integer: true },
  worldSize: { kind: "number", default: 65, min: 1, max: 97, integer: true },
  zygoteFitnessThreshold: { kind: "number", default: 0.45, min: 0, max: 0.5 },
  gameteFitnessThreshold: { kind: "number", default: 0, min: 0, max: 0.51 },
  mutationSigma: { kind: "number", default: 0.025, min: 0, max: 0.1 },
  speedSizeCorrelation: { kind: "boolean", default: false },
  allowAssortativeFusion: { kind: "boolean", default: false },
};
type Organism = Agent<{
  group: "adult" | "gamete" | "zygote";
  matingTypeTrait: number;
  gameteSizeTrait: number;
  life: number;
  size: number;
  speed: number;
  incubationTime: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  let world = World.create(
    { x: settings.worldSize, y: settings.worldSize, boundary: "wrap" },
    { random },
  );
  let grid = Grid.create(world.space!, { state: { color: 89 } });
  world.add(grid);
  const history: {
    tick: number;
    adults: number;
    gametes: number;
    zygotes: number;
    blueAdults: number;
    redAdults: number;
    blueGametes: number;
    redGametes: number;
    blueMeanTrait: number | undefined;
    redMeanTrait: number | undefined;
  }[] = [];
  let delta = 1;
  let wholeTick = false;
  const population = (group?: Organism["group"]) =>
    (world.agents as readonly Organism[]).filter(
      (a) => group === undefined || a.group === group,
    );
  function record() {
    history.push({
      tick: world.tick.value,
      adults: population("adult").length,
      gametes: population("gamete").length,
      zygotes: population("zygote").length,
      blueAdults: population("adult").filter((a) => a.matingTypeTrait === 105)
        .length,
      redAdults: population("adult").filter((a) => a.matingTypeTrait === 15)
        .length,
      blueGametes: population("gamete").filter((a) => a.matingTypeTrait === 105)
        .length,
      redGametes: population("gamete").filter((a) => a.matingTypeTrait === 15)
        .length,
      blueMeanTrait: stats.describe(
        population("adult")
          .filter((a) => a.matingTypeTrait === 105)
          .map((a) => a.gameteSizeTrait),
      ).mean,
      redMeanTrait: stats.describe(
        population("adult")
          .filter((a) => a.matingTypeTrait === 15)
          .map((a) => a.gameteSizeTrait),
      ).mean,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    world.delete(world.agents);
    if (world.space!.x !== settings.worldSize) {
      world = World.create(
        { x: settings.worldSize, y: settings.worldSize, boundary: "wrap" },
        { random },
      );
      grid = Grid.create(world.space!, { state: { color: 89 } });
      world.add(grid);
    }
    world.tick.reset();
    random.reseed(settings.seed);
    delta = 1;
    wholeTick = false;
    history.length = 0;
    for (const field of random.sample(grid.fields, {
      count: grid.fields.length,
      algorithm: "fisher-yates-descending",
    })) {
      field.color = 89 + random.number() - random.number() * 2;
    }
    for (let i = 0; i < 10; i++)
      grid.diffuse("color", { rate: 0.5, neighborhood: "moore" });
    for (let i = 0; i < settings.maxAdults; i++) {
      // Native create-agents draws a default color and heading before its shuffled body.
      random.number({ max: 14, integer: true });
      world.add(
        Agent.create(
          {
            group: "adult" as const,
            matingTypeTrait: 0,
            gameteSizeTrait: 0.25,
            life: 0,
            size: 1,
            speed: 0,
            incubationTime: 0,
          },
          {
            orientation: {
              heading: random.number({ max: 360, integer: true }),
            },
          },
        ),
      );
    }
    const adults = population("adult");
    for (const adult of random.sample(adults, {
      count: adults.length,
      algorithm: "fisher-yates-descending",
    })) {
      adult.move({
        to: {
          x: random.number() * settings.worldSize - settings.worldSize / 2,
          y: random.number() * settings.worldSize - settings.worldSize / 2,
        },
      });
      adult.matingTypeTrait = random.sample([15, 105])[0]!;
      adult.life = random.number({
        distribution: "normal",
        mean: 500,
        deviation: 50,
      });
    }
    record();
  }
  function produceGametes(adult: Organism) {
    const mass = random.number({
      distribution: "normal",
      mean: adult.gameteSizeTrait,
      deviation: settings.mutationSigma,
    });
    if (mass < settings.gameteFitnessThreshold) return;
    if (mass === 0)
      throw new RangeError(
        "Source division by zero in provisioning budget / instantaneous gamete size.",
      );
    const count = Math.floor(0.5 / mass);
    for (let i = 0; i < count; i++) {
      const child = adult.copy();
      world.add(child);
      child.group = "gamete";
      child.gameteSizeTrait = mass;
      child.size = gameteDiameter(mass);
      child.life = random.number({
        distribution: "normal",
        mean: 50,
        deviation: 5,
      });
      child.speed = settings.speedSizeCorrelation
        ? gameteDiameter(0.5) / child.size
        : 1;
    }
  }
  function becomeAdult(zygote: Organism) {
    zygote.group = "adult";
    zygote.size = 1;
    zygote.life = random.number({
      distribution: "normal",
      mean: 500,
      deviation: 50,
    });
  }
  function enforceCarryingCapacity() {
    const adults = population("adult");
    if (adults.length > settings.maxAdults) {
      for (const adult of random.sample(adults, {
        count: adults.length - settings.maxAdults,
      }))
        adult.delete();
    }
  }
  function fuseIfTouchingAnotherGamete(gamete: Organism) {
    const here = grid.fieldAt(gamete)!;
    const fields = [here, ...grid.neighbors(here, { neighborhood: "moore" })];
    const candidates = population("gamete").filter(
      (other) =>
        other !== gamete &&
        fields.includes(grid.fieldAt(other)!) &&
        gamete.distanceTo(other) < (gamete.size + other.size) / 2 &&
        (settings.allowAssortativeFusion ||
          other.matingTypeTrait !== gamete.matingTypeTrait),
    );
    if (!candidates.length) return;
    const partner = random.sample(candidates)[0]!;
    const mass = gamete.gameteSizeTrait + partner.gameteSizeTrait;
    const inherited = random.sample([gamete, partner])[0]!;
    if (mass >= settings.zygoteFitnessThreshold) {
      const child = gamete.copy();
      world.add(child);
      child.group = "zygote";
      child.gameteSizeTrait = inherited.gameteSizeTrait;
      child.matingTypeTrait = inherited.matingTypeTrait;
      child.size = gameteDiameter(mass);
      child.incubationTime = random.number({
        distribution: "normal",
        mean: 100,
        deviation: 10,
      });
    }
    partner.delete();
    gamete.delete();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let i = 0; i < count; i++) {
      wholeTick =
        Math.floor(world.tick.value) > Math.floor(world.tick.value - delta);
      if (wholeTick) {
        const adults = population("adult");
        for (const adult of random.sample(adults, {
          count: adults.length,
          algorithm: "fisher-yates-descending",
        })) {
          adult.rotate(random.number() * 360 - adult.heading);
          adult.move(1);
          if (random.number() * 100 < 1.5) produceGametes(adult);
          adult.life--;
          if (adult.life < 1) adult.delete();
        }
        const zygotes = population("zygote");
        for (const zygote of random.sample(zygotes, {
          count: zygotes.length,
          algorithm: "fisher-yates-descending",
        })) {
          zygote.incubationTime--;
          if (zygote.incubationTime < 1) becomeAdult(zygote);
        }
        enforceCarryingCapacity();
      }
      if (settings.speedSizeCorrelation)
        delta = tickAdvanceAmount(population("gamete").map((a) => a.size));
      const gametes = population("gamete");
      for (const gamete of random.sample(gametes, {
        count: gametes.length,
        algorithm: "fisher-yates-descending",
      })) {
        if (!gamete.alive) continue;
        gamete.rotate(
          random.number({ max: 360, integer: true }) - gamete.heading,
        );
        gamete.move(gamete.speed * delta);
        fuseIfTouchingAnotherGamete(gamete);
        if (gamete.alive) {
          gamete.life -= delta;
          if (gamete.life <= 0) gamete.delete();
        }
      }
      world.tick.advance(delta);
      record();
      if (!population().length) break;
    }
  }
  function read() {
    const agents = population().map((a) => ({
      id: a.id,
      x: a.x,
      y: a.y,
      heading: a.heading,
      group: a.group,
      matingTypeTrait: a.matingTypeTrait,
      gameteSizeTrait: a.gameteSizeTrait,
      life: a.life,
      size: a.size,
      speed: a.speed,
      incubationTime: a.incubationTime,
    }));
    return {
      sourceMarker,
      tick: world.tick.value,
      width: world.space!.x,
      height: world.space!.y,
      tickAdvanceAmount: delta,
      wholeTick,
      done: !agents.length,
      parameters: settings,
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        color: f.color,
      })),
      traitDistribution: {
        blue: stats.histogram(
          population("adult")
            .filter((a) => a.matingTypeTrait === 105)
            .map((a) => a.gameteSizeTrait),
          { edges: Array.from({ length: 21 }, (_, i) => i / 40) },
        ),
        red: stats.histogram(
          population("adult")
            .filter((a) => a.matingTypeTrait === 15)
            .map((a) => a.gameteSizeTrait),
          { edges: Array.from({ length: 21 }, (_, i) => i / 40) },
        ),
      },
      adults: agents.filter((a) => a.group === "adult"),
      gametes: agents.filter((a) => a.group === "gamete"),
      zygotes: agents.filter((a) => a.group === "zygote"),
      history: history.map((p) => ({ ...p })),
      randomState: random.state,
    };
  }
  function setParameters(update: Partial<Omit<Parameters, "seed">>) {
    settings = parameters(inputs, { ...settings, ...update });
  }
  function restoreDefaultParameters() {
    setParameters({
      worldSize: 65,
      maxAdults: 100,
      zygoteFitnessThreshold: 0.45,
      gameteFitnessThreshold: 0.01,
      mutationSigma: 0.025,
      speedSizeCorrelation: false,
      allowAssortativeFusion: false,
    });
  }
  setup();
  return {
    setup,
    advance,
    read,
    setParameters,
    restoreDefaultParameters,
    produceGametes,
    becomeAdult,
    enforceCarryingCapacity,
    fuseIfTouchingAnotherGamete,
  };
}
export const model = {
  title: "Anisogamy",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
