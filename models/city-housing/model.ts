/** Original synthetic posted-rent housing mechanism with delayed construction; no empirical calibration. */
import { World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface HousingParameters {
  householdCount: number;
  initialHomeCount: number;
  maxHomeCount: number;
  initialRent: number;
  housingAllowance: number;
  rentAdjustmentRate: number;
  targetVacancyRate: number;
  constructionRent: number;
  constructionLimit: number;
}

export const inputs: Inputs<HousingParameters> = {
  householdCount: { kind: "number", default: 24, min: 1, max: 60, integer: true },
  initialHomeCount: { kind: "number", default: 18, min: 1, max: 60, integer: true },
  maxHomeCount: { kind: "number", default: 30, min: 1, max: 80, integer: true },
  initialRent: { kind: "number", default: 900, min: 100, max: 5000 },
  housingAllowance: { kind: "number", default: 0, min: 0, max: 5000 },
  rentAdjustmentRate: { kind: "number", default: 0.1, min: 0, max: 1 },
  targetVacancyRate: { kind: "number", default: 0.05, min: 0, max: 1 },
  constructionRent: { kind: "number", default: 1000, min: 100, max: 5000 },
  constructionLimit: { kind: "number", default: 1, min: 0, max: 10, integer: true },
};

export type IncomeGroup = "low" | "middle" | "high";
const incomeGroups: readonly IncomeGroup[] = ["low", "middle", "high"];

interface Household {
  id: string;
  number: number;
  income: number;
  incomeGroup: IncomeGroup;
  homeId: string | null;
  hasBeenHoused: boolean;
}

const lowestIncome = 1000;
const incomeStep = 200;
const affordableIncomeShare = 0.3;
const minimumRent = 100;
const maximumRent = 5000;
const constructionDelayMonths = 3;
const maximumCommission = 10;

export function create(options: Partial<HousingParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.maxHomeCount < settings.initialHomeCount) {
    throw new RangeError("maxHomeCount must be at least initialHomeCount.");
  }
  const world = World.create();
  const households: Household[] = Array.from({ length: settings.householdCount }, (_, index) => ({
    id: `household-${index + 1}`,
    number: index + 1,
    income: lowestIncome + incomeStep * index,
    incomeGroup: incomeGroups[Math.floor(index * incomeGroups.length / settings.householdCount)]!,
    homeId: null,
    hasBeenHoused: false,
  }));
  const homes = Array.from({ length: settings.initialHomeCount }, (_, index) => `home-${index + 1}`);
  // Each entry is the number of monthly steps until a commissioned home becomes vacant.
  let pipeline: number[] = [];
  let rent = settings.initialRent;
  let displacedThisStepCount = 0;
  let completedThisStepCount = 0;
  let startedThisStepCount = 0;
  const history = storage.history({ capacity: 120 });

  function receivesAllowance(household: Household) {
    return household.incomeGroup === "low" && settings.housingAllowance > 0;
  }

  function bid(household: Household) {
    return affordableIncomeShare * household.income + (household.incomeGroup === "low" ? settings.housingAllowance : 0);
  }

  function allocateVacancies() {
    const occupied = new Set(households.flatMap(household => household.homeId === null ? [] : [household.homeId]));
    const vacancies = homes.filter(homeId => !occupied.has(homeId));
    const applicants = households
      .filter(household => household.homeId === null && bid(household) >= rent)
      .sort((first, second) => bid(second) - bid(first) || first.number - second.number);
    applicants.forEach((household, index) => {
      const homeId = vacancies[index];
      if (homeId === undefined) return;
      household.homeId = homeId;
      household.hasBeenHoused = true;
    });
  }

  function addToPipeline(count: number) {
    for (let index = 0; index < count; index += 1) pipeline.push(constructionDelayMonths);
  }

  const measure = measurements.define((population: readonly Household[]) => {
    const housed = population.filter(household => household.homeId !== null);
    const housedByGroup = { low: 0, middle: 0, high: 0 };
    for (const household of housed) housedByGroup[household.incomeGroup] += 1;
    return {
      rent,
      homeCount: homes.length,
      pipelineCount: pipeline.length,
      housedHouseholdCount: housed.length,
      searchingHouseholdCount: population.length - housed.length,
      vacantHomeCount: homes.length - housed.length,
      vacancyRate: (homes.length - housed.length) / homes.length,
      displacedHouseholdCount: population.filter(household => household.homeId === null && household.hasBeenHoused).length,
      housedLowIncomeCount: housedByGroup.low,
      housedMiddleIncomeCount: housedByGroup.middle,
      housedHighIncomeCount: housedByGroup.high,
      displacedThisStepCount,
      completedThisStepCount,
      startedThisStepCount,
    };
  });

  function record() {
    history.add({ tick: world.tick.value, values: measure.read(households) });
  }

  function step() {
    pipeline = pipeline.map(remainingMonths => remainingMonths - 1);
    completedThisStepCount = pipeline.filter(remainingMonths => remainingMonths <= 0).length;
    pipeline = pipeline.filter(remainingMonths => remainingMonths > 0);
    const firstNewNumber = homes.length + 1;
    for (let index = 0; index < completedThisStepCount; index += 1) homes.push(`home-${firstNewNumber + index}`);

    const openingVacancy = measure.read(households).vacancyRate;
    const priceMultiplier = 1 + settings.rentAdjustmentRate * (settings.targetVacancyRate - openingVacancy);
    rent = Math.max(minimumRent, Math.min(maximumRent, rent * priceMultiplier));
    displacedThisStepCount = 0;
    for (const household of households) {
      if (household.homeId !== null && bid(household) < rent) {
        household.homeId = null;
        displacedThisStepCount += 1;
      }
    }
    allocateVacancies();
    startedThisStepCount = rent >= settings.constructionRent
      ? Math.min(settings.constructionLimit, settings.maxHomeCount - homes.length - pipeline.length)
      : 0;
    addToPipeline(startedThisStepCount);
  }

  allocateVacancies();
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setHousingAllowance(value: number) {
      settings = updateParameters(inputs, settings, { housingAllowance: value }, ["housingAllowance"]);
    },
    /** Publicly funded homes enter the same three-month construction pipeline. */
    commissionHomes(count: number) {
      if (typeof count !== "number") throw new TypeError("Home count must be numeric.");
      if (!Number.isSafeInteger(count) || count < 1 || count > maximumCommission ||
        homes.length + pipeline.length + count > settings.maxHomeCount) {
        throw new RangeError("Commission 1 to 10 homes within maxHomeCount.");
      }
      addToPipeline(count);
    },
    read() {
      const values = measure.read(households);
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...settings }),
        ...values,
        housedByGroup: Object.freeze({ low: values.housedLowIncomeCount, middle: values.housedMiddleIncomeCount, high: values.housedHighIncomeCount }),
        households: Object.freeze(households.map(household => Object.freeze({
          id: household.id,
          income: household.income,
          incomeGroup: household.incomeGroup,
          bid: bid(household),
          receivesAllowance: receivesAllowance(household),
          homeId: household.homeId,
          status: household.homeId !== null ? "housed" as const
            : household.hasBeenHoused ? "displaced" as const : "searching" as const,
        }))),
        homes: Object.freeze(homes.map(id => Object.freeze({
          id,
          occupantId: households.find(household => household.homeId === id)?.id ?? null,
        }))),
        pipeline: Object.freeze(pipeline.map((remainingMonths, index) => Object.freeze({ id: `pipeline-${index + 1}`, remainingMonths }))),
        history: history.samples,
        done: false,
      });
    },
  };
}

export const model = {
  title: "Housing Market",
  description: "Income-ranked bids, a posted rent, displacement and delayed construction. Compare a housing allowance with new supply. Synthetic monthly mechanism.",
  inputs,
  create,
} satisfies Definition<HousingParameters, ReturnType<typeof create>>;
