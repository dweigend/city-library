/** Original aggregate demographic teaching model with Leslie-style cohorts; rates are not calibrated. */
import { World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface PopulationParameters {
  initialPopulation: number;
  birthRate: number;
  deathRate: number;
  elderlyDeathRate: number;
  annualMigration: number;
  migrationLimit: number;
  householdSize: number;
}

type PolicyKey = "birthRate" | "deathRate" | "elderlyDeathRate" | "annualMigration" | "migrationLimit" | "householdSize";
export type PopulationPolicy = Partial<Pick<PopulationParameters, PolicyKey>>;

export const inputs: Inputs<PopulationParameters> = {
  initialPopulation: { kind: "number", default: 1000, min: 0, max: 1_000_000, integer: true },
  birthRate: { kind: "number", default: 0.06, min: 0, max: 0.2 },
  deathRate: { kind: "number", default: 0.005, min: 0, max: 1 },
  elderlyDeathRate: { kind: "number", default: 0.1, min: 0, max: 1 },
  annualMigration: { kind: "number", default: 10, min: -1000, max: 1000, integer: true },
  migrationLimit: { kind: "number", default: 20, min: 0, max: 1000, integer: true },
  householdSize: { kind: "number", default: 3, min: 1, max: 6, integer: true },
};

const policyKeys: readonly PolicyKey[] = ["birthRate", "deathRate", "elderlyDeathRate", "annualMigration", "migrationLimit", "householdSize"];
const initialAgeCount = 100;
const oldestAge = 100;
const fertilityStartAge = 20;
const fertilityEndAge = 39;
const elderlyAge = 65;
const immigrantAge = 25;
const ageBandWidth = 5;
const maximumPulse = 1000;
const maximumPendingPulse = 10_000;
// Decimal rates are not exact in binary; this absorbs e.g. 11.999999999999998 before flooring.
const roundingTolerance = 1e-9;

/** Integer part of an expected count plus the fractional remainder carried to next year. */
function splitExpected(expected: number) {
  const count = Math.floor(expected + roundingTolerance);
  return { count, remainder: Math.max(0, expected - count) };
}

/**
 * Allocate an integer death total across cohorts: floors first, then one extra death
 * to each of the largest fractional expectations (ties to the older cohort).
 */
function allocateDeaths(expectedByAge: readonly number[], totalDeaths: number): number[] {
  const deaths = expectedByAge.map(expected => Math.floor(expected + roundingTolerance));
  let remaining = totalDeaths - deaths.reduce((sum, count) => sum + count, 0);
  const remainders = expectedByAge
    .map((expected, age) => ({ age, fraction: expected - deaths[age]! }))
    .filter(entry => entry.fraction > roundingTolerance)
    .sort((first, second) => second.fraction - first.fraction || second.age - first.age);
  for (const entry of remainders) {
    if (remaining <= 0) break;
    deaths[entry.age] = deaths[entry.age]! + 1;
    remaining -= 1;
  }
  return deaths;
}

export function create(options: Partial<PopulationParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  let cohorts = Array.from({ length: oldestAge + 1 }, (_, age) => age === oldestAge ? 0 :
    Math.floor(parameters.initialPopulation / initialAgeCount) + (age < parameters.initialPopulation % initialAgeCount ? 1 : 0));
  let householdSize = parameters.householdSize;
  let householdCount = Math.ceil(parameters.initialPopulation / householdSize);
  let formedHouseholdCount = 0;
  let dissolvedHouseholdCount = 0;
  let birthCount = 0;
  let deathCount = 0;
  let netMigration = 0;
  let birthRemainder = 0;
  let mortalityRemainder = 0;
  let pendingImmigrationPulse = 0;
  let cumulativeBirthCount = 0;
  let cumulativeDeathCount = 0;
  let cumulativeNetMigration = 0;
  const history = storage.history({ capacity: 120 });

  function sumAges(fromAge: number, toAge: number) {
    return cohorts.slice(fromAge, toAge + 1).reduce((sum, count) => sum + count, 0);
  }

  const measure = measurements.define(() => {
    const populationCount = sumAges(0, oldestAge);
    return {
      populationCount,
      householdCount,
      meanHouseholdSize: householdCount === 0 ? 0 : populationCount / householdCount,
      elderlyShare: populationCount === 0 ? 0 : sumAges(elderlyAge, oldestAge) / populationCount,
      birthCount,
      deathCount,
      netMigration,
      cumulativeBirthCount,
      cumulativeDeathCount,
      cumulativeNetMigration,
      formedHouseholdCount,
      dissolvedHouseholdCount,
      accountingError: populationCount - (parameters.initialPopulation + cumulativeBirthCount - cumulativeDeathCount + cumulativeNetMigration),
    };
  });

  function record() {
    history.add({ tick: world.tick.value, values: measure.read(undefined) });
  }

  function step() {
    // Births and deaths both use beginning-of-year cohorts.
    const births = splitExpected(sumAges(fertilityStartAge, fertilityEndAge) * parameters.birthRate + birthRemainder);
    const expectedDeathsByAge = cohorts.map((residentCount, age) =>
      residentCount * (age >= elderlyAge ? parameters.elderlyDeathRate : parameters.deathRate));
    const deaths = splitExpected(expectedDeathsByAge.reduce((sum, expected) => sum + expected, 0) + mortalityRemainder);
    const deathsByAge = allocateDeaths(expectedDeathsByAge, deaths.count);

    const nextCohorts = Array<number>(oldestAge + 1).fill(0);
    cohorts.forEach((residentCount, age) => {
      const nextAge = Math.min(oldestAge, age + 1);
      nextCohorts[nextAge] = nextCohorts[nextAge]! + residentCount - deathsByAge[age]!;
    });
    nextCohorts[0] = births.count;

    const availablePopulation = nextCohorts.reduce((sum, count) => sum + count, 0);
    const boundedMigration = Math.max(-parameters.migrationLimit, Math.min(parameters.migrationLimit, parameters.annualMigration));
    const nextNetMigration = Math.max(-availablePopulation, boundedMigration + pendingImmigrationPulse);
    if (nextNetMigration >= 0) {
      nextCohorts[immigrantAge] = nextCohorts[immigrantAge]! + nextNetMigration;
    } else {
      let remainingEmigrants = -nextNetMigration;
      for (let age = oldestAge; age >= 0 && remainingEmigrants > 0; age -= 1) {
        const emigrants = Math.min(nextCohorts[age]!, remainingEmigrants);
        nextCohorts[age] = nextCohorts[age]! - emigrants;
        remainingEmigrants -= emigrants;
      }
    }

    const nextPopulation = availablePopulation + nextNetMigration;
    const nextCumulativeBirthCount = cumulativeBirthCount + births.count;
    const nextCumulativeDeathCount = cumulativeDeathCount + deaths.count;
    const nextCumulativeNetMigration = cumulativeNetMigration + nextNetMigration;
    // Reject overflow before committing any part of this year.
    if (![nextPopulation, nextCumulativeBirthCount, nextCumulativeDeathCount,
      nextCumulativeNetMigration, parameters.initialPopulation + nextCumulativeBirthCount + Math.max(0, nextCumulativeNetMigration)]
      .every(Number.isSafeInteger)) {
      throw new RangeError("Population accounting exceeds safe integer precision.");
    }
    const nextHouseholdCount = Math.ceil(nextPopulation / parameters.householdSize);
    formedHouseholdCount = Math.max(0, nextHouseholdCount - householdCount);
    dissolvedHouseholdCount = Math.max(0, householdCount - nextHouseholdCount);
    householdSize = parameters.householdSize;
    householdCount = nextHouseholdCount;
    cohorts = nextCohorts;
    birthCount = births.count;
    deathCount = deaths.count;
    birthRemainder = births.remainder;
    mortalityRemainder = deaths.remainder;
    netMigration = nextNetMigration;
    pendingImmigrationPulse = 0;
    cumulativeBirthCount = nextCumulativeBirthCount;
    cumulativeDeathCount = nextCumulativeDeathCount;
    cumulativeNetMigration = nextCumulativeNetMigration;
  }

  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setPolicy(changes: PopulationPolicy) {
      parameters = updateParameters(inputs, parameters, changes, policyKeys);
    },
    /** One-time immigration of young adults next year, outside the annual migration bound. */
    scheduleImmigrationPulse(residentCount: number) {
      if (typeof residentCount !== "number") throw new TypeError("Pulse size must be numeric.");
      if (!Number.isSafeInteger(residentCount) || residentCount < 1 || residentCount > maximumPulse ||
        pendingImmigrationPulse + residentCount > maximumPendingPulse) {
        throw new RangeError("Pulse size must be an integer from 1 to 1000; pending pulses are limited to 10000.");
      }
      pendingImmigrationPulse += residentCount;
    },
    read() {
      const values = measure.read(undefined);
      const fullHouseholdCount = Math.floor(values.populationCount / householdSize);
      const remainder = values.populationCount % householdSize;
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        ...values,
        birthRemainder,
        mortalityRemainder,
        pendingImmigrationPulse,
        cohorts: Object.freeze(cohorts.map((residentCount, age) => Object.freeze({ age, residentCount }))),
        ageBands: Object.freeze(Array.from({ length: oldestAge / ageBandWidth + 1 }, (_, index) => {
          const fromAge = index * ageBandWidth;
          const toAge = Math.min(oldestAge, fromAge + ageBandWidth - 1);
          return Object.freeze({
            label: fromAge === oldestAge ? `${oldestAge}+` : `${fromAge}–${toAge}`,
            fromAge,
            residentCount: sumAges(fromAge, toAge),
          });
        })),
        householdsBySize: Object.freeze(Array.from({ length: 6 }, (_, index) => {
          const size = index + 1;
          return Object.freeze({ size, householdCount: (size === householdSize ? fullHouseholdCount : 0) + (remainder > 0 && size === remainder ? 1 : 0) });
        })),
        history: history.samples,
        done: false,
      });
    },
  };
}

export const model = {
  title: "Population and Households",
  description: "Annual age cohorts turn migration into later births, deaths and household demand. Illustrative rates.",
  inputs,
  create,
} satisfies Definition<PopulationParameters, ReturnType<typeof create>>;
