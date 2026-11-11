/** Original synthetic monthly employment model: demand feedback with fast firing and limited hiring. */
import { Agent, World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface EmploymentParameters {
  householdCount: number;
  firmCount: number;
  wage: number;
  spendingFraction: number;
  externalDemand: number;
  hiringLimit: number;
}

export const inputs: Inputs<EmploymentParameters> = {
  householdCount: { kind: "number", default: 30, min: 1, max: 100, integer: true },
  firmCount: { kind: "number", default: 3, min: 1, max: 10, integer: true },
  wage: { kind: "number", default: 10, min: 1, max: 100, integer: true },
  spendingFraction: { kind: "number", default: 0.4, min: 0, max: 1, step: 0.1 },
  externalDemand: { kind: "number", default: 90, min: 0, max: 1000, integer: true },
  hiringLimit: { kind: "number", default: 1, min: 1, max: 100, integer: true },
};

const salesPerJob = 10;
const initialJobsPerFirm = 5;

export function create(options: Partial<EmploymentParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const firms = Array.from({ length: settings.firmCount }, (_, index) => {
    const firm = Agent.create({ key: `firm:${index + 1}`, desiredJobCount: 0, balance: 0, revenue: 0 });
    world.add(firm);
    return firm;
  });
  const households = Array.from({ length: settings.householdCount }, (_, index) => {
    const firmIndex = Math.floor(index / initialJobsPerFirm);
    const household = Agent.create({
      key: `household:${index + 1}`,
      employerId: firmIndex < firms.length ? firms[firmIndex]!.key : null as string | null,
      plannedSpending: 0,
      balance: 0,
    });
    world.add(household);
    return household;
  });
  for (const household of households) {
    if (household.employerId !== null) household.plannedSpending = settings.wage * settings.spendingFraction;
  }
  const employeesOf = (firmId: string) => households.filter(household => household.employerId === firmId);
  for (const firm of firms) firm.desiredJobCount = employeesOf(firm.key).length;
  const history = storage.history({ capacity: 120 });
  let orders = 0;
  let sales = 0;
  let lostOrders = 0;
  let externalInflow = 0;
  let localSpending = 0;
  let payroll = 0;
  let firedCount = 0;
  let hiredCount = 0;
  let cumulativeLostOrders = 0;
  let cumulativeExternalInflow = 0;

  function plannedLocalSpending() {
    return households.reduce((sum, household) => sum + household.plannedSpending, 0);
  }

  /** Dismiss at once above the target; hire at most hiringLimit per firm below it. */
  function adjustJobs(desiredTotal: number) {
    firedCount = 0;
    hiredCount = 0;
    firms.forEach((firm, index) => {
      firm.desiredJobCount = Math.floor(desiredTotal / firms.length) + (index < desiredTotal % firms.length ? 1 : 0);
      const employees = employeesOf(firm.key);
      for (const household of employees.slice(firm.desiredJobCount)) {
        household.employerId = null;
        firedCount += 1;
      }
    });
    for (const firm of firms) {
      const openings = Math.min(settings.hiringLimit, firm.desiredJobCount - employeesOf(firm.key).length);
      const hires = households.filter(household => household.employerId === null).slice(0, Math.max(0, openings));
      for (const household of hires) household.employerId = firm.key;
      hiredCount += hires.length;
    }
  }

  function settleMonth() {
    const plannedSpending = plannedLocalSpending();
    orders = settings.externalDemand + plannedSpending;
    adjustJobs(Math.min(households.length, Math.round(orders / salesPerJob)));
    const employedCount = households.filter(household => household.employerId !== null).length;
    sales = Math.min(orders, employedCount * salesPerJob);
    lostOrders = orders - sales;
    const realizedShare = orders === 0 ? 0 : sales / orders;
    externalInflow = settings.externalDemand * realizedShare;
    localSpending = plannedSpending * realizedShare;
    for (const firm of firms) {
      const employeeCount = employeesOf(firm.key).length;
      firm.revenue = employedCount === 0 ? 0 : sales * employeeCount / employedCount;
      firm.balance += firm.revenue - employeeCount * settings.wage;
    }
    payroll = employedCount * settings.wage;
    for (const household of households) {
      household.balance -= household.plannedSpending * realizedShare;
      household.plannedSpending = 0;
      if (household.employerId !== null) {
        household.balance += settings.wage;
        household.plannedSpending = settings.wage * settings.spendingFraction;
      }
    }
    cumulativeLostOrders += lostOrders;
    cumulativeExternalInflow += externalInflow;
  }

  function measure() {
    const employedCount = households.filter(household => household.employerId !== null).length;
    const desiredJobCount = firms.reduce((sum, firm) => sum + firm.desiredJobCount, 0);
    const householdCash = households.reduce((sum, household) => sum + household.balance, 0);
    const firmCash = firms.reduce((sum, firm) => sum + firm.balance, 0);
    return {
      employedCount,
      unemployedCount: households.length - employedCount,
      desiredJobCount,
      vacancyCount: Math.max(0, desiredJobCount - employedCount),
      orders,
      sales,
      lostOrders,
      externalInflow,
      localSpending,
      payroll,
      firedCount,
      hiredCount,
      householdCash,
      firmCash,
      totalCash: householdCash + firmCash,
      moneyBalanceError: householdCash + firmCash - cumulativeExternalInflow,
    };
  }

  function record() {
    history.add({ tick: world.tick.value, values: measure() });
  }

  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, settleMonth);
        record();
      }
    },
    setExternalDemand(value: number) {
      settings = updateParameters(inputs, settings, { externalDemand: value }, ["externalDemand"]);
    },
    setHiringLimit(value: number) {
      settings = updateParameters(inputs, settings, { hiringLimit: value }, ["hiringLimit"]);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...settings }),
        ...measure(),
        nextOrders: settings.externalDemand + plannedLocalSpending(),
        cumulativeLostOrders,
        cumulativeExternalInflow,
        households: Object.freeze(households.map(household => Object.freeze({
          id: household.key,
          employerId: household.employerId,
          balance: household.balance,
        }))),
        firms: Object.freeze(firms.map(firm => {
          const employeeCount = employeesOf(firm.key).length;
          return Object.freeze({
            id: firm.key,
            balance: firm.balance,
            revenue: firm.revenue,
            desiredJobCount: firm.desiredJobCount,
            employeeCount,
            vacancyCount: Math.max(0, firm.desiredJobCount - employeeCount),
          });
        })),
        history: history.samples,
        done: false,
      });
    },
  };
}

export const model = {
  title: "Urban Employment",
  description: "Outside orders and local spending set jobs; firms dismiss at once but hire slowly. Compare a demand shock under slow and fast hiring. Synthetic monthly currency flows.",
  inputs,
  create,
} satisfies Definition<EmploymentParameters, ReturnType<typeof create>>;
