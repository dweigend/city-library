/** NetLogo Sex Ratio Equilibrium, Wilensky (2020), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "b08-sex-ratio-equilibrium-source-composition-v1";
export interface Parameters {
  seed: number;
  initialPopulationSize: number;
  initialAdultSexRatio: number;
  initialAverageMaleChildChance: number;
  meanLongevity: number;
  gestationPeriod: number;
  maximumLitterSize: number;
  matingChance: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  // Headless fixtures permit the smaller/empty populations used by the frozen contract.
  initialPopulationSize: {
    kind: "number",
    default: 500,
    min: 0,
    max: 1000,
    integer: true,
  },
  initialAdultSexRatio: {
    kind: "number",
    default: 35,
    min: 0,
    max: 100,
    integer: true,
  },
  initialAverageMaleChildChance: {
    kind: "number",
    default: 0.4,
    min: 0,
    max: 1,
    step: 0.01,
  },
  meanLongevity: { kind: "number", default: 60, min: 0, max: 150, step: 5 },
  gestationPeriod: {
    kind: "number",
    default: 5,
    min: 0,
    max: 20,
    integer: true,
  },
  maximumLitterSize: {
    kind: "number",
    default: 6,
    min: 1,
    max: 10,
    integer: true,
  },
  matingChance: { kind: "number", default: 0.85, min: 0, max: 1, step: 0.05 },
};
export interface IndividualState {
  sex: "male" | "female";
  partner: Individual | null;
  carrying: boolean;
  maleChildChance: number;
  tempMaleChildChance: number;
  gestation: number;
  age: number;
  longevity: number;
  numOfExes: number;
  numOfChildren: number;
  adult: boolean;
}
export type Individual = Agent<IndividualState>;
export function adultSexRatio(
  population: readonly { sex: "male" | "female"; adult: boolean }[],
) {
  const adults = population.filter((a) => a.adult).length;
  return adults
    ? (population.filter((a) => a.sex === "male").length / adults) * 100
    : 0;
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 33, y: 21, boundary: "wrap" }, { random });
  const population = () => world.agents as readonly Individual[];
  const males = () => population().filter((a) => a.sex === "male");
  const females = () => population().filter((a) => a.sex === "female");
  let adultAge = Math.trunc(0.15 * settings.meanLongevity);
  const adultSexRatioHistory: number[] = [];
  const ageList: number[] = [];
  const history: {
    tick: number;
    males: number;
    females: number;
    pregnant: number;
    nonPregnant: number;
    matingRatio: number | null;
    chance: number;
  }[] = [];
  function makeIndividual(sex: "male" | "female", parent?: Individual) {
    const mean = parent
      ? parent.tempMaleChildChance
      : settings.initialAverageMaleChildChance;
    const chance = Math.max(
      0,
      Math.min(
        1,
        random.number({ distribution: "normal", mean, deviation: 0.05 }),
      ),
    );
    const agent = Agent.add<IndividualState>(
      {
        sex,
        partner: null,
        carrying: false,
        maleChildChance: chance,
        tempMaleChildChance: 0,
        gestation: 0,
        age: parent
          ? 0
          : Math.trunc(
              random.number({
                distribution: "normal",
                mean: settings.meanLongevity / 2,
                deviation: settings.meanLongevity / 10,
              }),
            ),
        longevity: Math.trunc(
          random.number({
            distribution: "normal",
            mean: settings.meanLongevity,
            deviation: settings.meanLongevity / 10,
          }),
        ),
        numOfExes: 0,
        numOfChildren: 0,
        adult: parent?.adult ?? true,
      },
      {
        position: parent
          ? { x: parent.x, y: parent.y }
          : { x: random.number() * 33 - 16.5, y: random.number() * 21 - 10.5 },
        orientation: {
          heading: random.number({ min: 0, max: 360, integer: true }),
        },
      },
    );
    world.add(agent);
    return agent;
  }
  function setup() {
    world.delete(population());
    world.tick.reset();
    adultSexRatioHistory.length = 0;
    ageList.length = 0;
    history.length = 0;
    adultAge = Math.trunc(0.15 * settings.meanLongevity);
    const count = Math.round(
      (settings.initialAdultSexRatio / 100) * settings.initialPopulationSize,
    );
    for (let n = 0; n < count; n++) makeIndividual("male");
    for (let n = count; n < settings.initialPopulationSize; n++)
      makeIndividual("female");
    record();
  }
  function move(individual: Individual) {
    individual.rotate(random.number({ min: 0, max: 60, integer: true }));
    individual.rotate(-random.number({ min: 0, max: 60, integer: true }));
    individual.move(0.1);
  }
  function checkIfDead(individual: Individual) {
    if (individual.age > individual.longevity) {
      ageList.push(individual.age);
      for (const other of population())
        if (other.partner === individual) other.partner = null;
      individual.delete();
    } else individual.age++;
  }
  function searchForAnAdultPartner(male: Individual) {
    const eligibleFemales = male.neighbors({
      source: females().filter((a) => a.adult && !a.carrying),
      radius: 1,
    });
    const nearbyMales = male.neighbors({
      source: males().filter((a) => a !== male && a.adult),
      radius: 1,
    });
    if (eligibleFemales.length === 1 && nearbyMales.length === 0)
      male.partner = random.sample(eligibleFemales)[0]!;
    if (!male.partner) return;
    if (random.number() < settings.matingChance) {
      const partner = male.partner;
      partner.partner = male;
      partner.carrying = true;
      partner.numOfExes++;
      partner.tempMaleChildChance =
        (partner.maleChildChance + male.maleChildChance) / 2;
      male.numOfExes++;
    }
    male.partner = null;
  }
  function reproduce(female: Individual) {
    if (!female.carrying) return;
    if (female.gestation !== settings.gestationPeriod) {
      female.gestation++;
      return;
    }
    female.gestation = 0;
    female.carrying = false;
    const litter =
      random.number({
        min: 0,
        max: settings.maximumLitterSize,
        integer: true,
      }) + 1;
    for (let n = 0; n < litter; n++) {
      const sex =
        random.number() < female.tempMaleChildChance ? "male" : "female";
      makeIndividual(sex, female);
    }
    if (female.partner?.alive) female.partner.numOfChildren += litter;
    female.numOfChildren += litter;
    female.partner = null;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      males: males().length,
      females: females().length,
      pregnant: females().filter((a) => a.carrying).length,
      nonPregnant: females().filter((a) => !a.carrying).length,
      matingRatio:
        males().length && females().length && matingSuccess("female") !== 0
          ? Math.round(
              (matingSuccess("male") / matingSuccess("female")) * 1000,
            ) / 1000
          : null,
      chance:
        stats.describe(population().map((a) => a.maleChildChance)).mean ?? 0,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function advance(steps = 1) {
    stepCount(steps);
    for (let n = 0; n < steps; n++) {
      if (!population().length) break;
      for (const a of random.sample(population(), {
        count: population().length,
        compatibility: "legacy-shuffle",
      }))
        checkIfDead(a);
      for (const a of random.sample(males(), {
        count: males().length,
        compatibility: "legacy-shuffle",
      })) {
        move(a);
        if (a.age > adultAge) a.adult = true;
      }
      for (const a of random.sample(
        males().filter((a) => a.adult),
        {
          count: males().filter((a) => a.adult).length,
          compatibility: "legacy-shuffle",
        },
      ))
        searchForAnAdultPartner(a);
      for (const a of random.sample(females(), {
        count: females().length,
        compatibility: "legacy-shuffle",
      })) {
        if (!a.carrying) move(a);
        if (a.age > adultAge) a.adult = true;
      }
      const fertile = females().filter((a) => a.adult);
      for (const a of random.sample(fertile, {
        count: fertile.length,
        compatibility: "legacy-shuffle",
      }))
        reproduce(a);
      adultSexRatioHistory.push(adultSexRatio(population()));
      world.tick.advance();
      record();
    }
  }
  function matingSuccess(sex: "male" | "female") {
    const mean = stats.describe(
      population()
        .filter((a) => a.sex === sex)
        .map((a) => a.numOfExes),
    ).mean;
    // Pure snapshots expose unavailable native empty means as NA; explicit reporter preserves the source error.
    if (mean === undefined)
      throw new RangeError(
        "MEAN expected a nonempty list (source mating-success reporter).",
      );
    return Math.round(mean * 100) / 100;
  }
  function read() {
    const project = (a: Individual) => ({
      id: a.id,
      x: a.x,
      y: a.y,
      heading: a.heading,
      sex: a.sex,
      age: a.age,
      longevity: a.longevity,
      adult: a.adult,
      maleChildChance: a.maleChildChance,
      carrying: a.carrying,
      gestation: a.gestation,
      tempMaleChildChance: a.tempMaleChildChance,
      partner: a.partner?.id ?? null,
      numOfExes: a.numOfExes,
      numOfChildren: a.numOfChildren,
    });
    const running =
      adultSexRatioHistory.length > 1000
        ? stats.describe(adultSexRatioHistory.slice(-1000), { sample: true })
        : undefined;
    return {
      sourceMarker,
      parameters: { ...settings },
      randomState: random.state,
      width: 33,
      height: 21,
      tick: world.tick.value,
      adultAge,
      done: !population().length,
      males: males().map(project),
      females: females().map(project),
      adultSexRatio: adultSexRatio(population()),
      averageMaleChildChance:
        stats.describe(population().map((a) => a.maleChildChance)).mean ?? 0,
      maleMatingSuccess: males().length ? matingSuccess("male") : "NA",
      femaleMatingSuccess: females().length ? matingSuccess("female") : "NA",
      adultSexRatioHistory: [...adultSexRatioHistory],
      ageList: [...ageList],
      runningAverageAdultSexRatio: running
        ? Math.round(running.mean! * 100) / 100
        : "NA",
      runningSdAdultSexRatio: running
        ? Math.round(running.standardDeviation! * 100) / 100
        : "NA",
      history: history.map((p) => ({ ...p })),
    };
  }
  function setParameters(change: Partial<Parameters>) {
    settings = parameters(inputs, { ...settings, ...change });
  }
  setup();
  return {
    read,
    advance,
    setup,
    setParameters,
    makeIndividual,
    move,
    checkIfDead,
    searchForAnAdultPartner,
    reproduce,
    matingSuccess,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Sex Ratio Equilibrium",
  inputs,
  create,
};
