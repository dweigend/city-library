/** Original synthetic municipal budget with an asset inventory, wear and a late-repair cost rule. */
import { World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type RepairPriority = "worst-first" | "preventive";
export interface FinanceParameters {
  initialCash: number;
  taxBase: number;
  taxRate: number;
  serviceCost: number;
  maintenanceBudget: number;
  replacementValue: number;
  annualWear: number;
  repairPriority: RepairPriority;
}

type PolicyKey = "taxRate" | "maintenanceBudget" | "repairPriority";
export type FinancePolicy = Pick<FinanceParameters, PolicyKey>;

const maximumAmount = 1_000_000_000;
export const inputs: Inputs<FinanceParameters> = {
  initialCash: { kind: "number", default: 100, min: 0, max: maximumAmount },
  taxBase: { kind: "number", default: 10000, min: 0, max: maximumAmount },
  taxRate: { kind: "number", default: 0.1, min: 0, max: 1 },
  serviceCost: { kind: "number", default: 400, min: 0, max: maximumAmount },
  maintenanceBudget: { kind: "number", default: 500, min: 0, max: maximumAmount },
  replacementValue: { kind: "number", default: 12000, min: 1, max: maximumAmount },
  annualWear: { kind: "number", default: 0.05, min: 0, max: 0.2 },
  repairPriority: { kind: "choice", default: "worst-first", options: ["worst-first", "preventive"] },
};
const policyKeys: readonly PolicyKey[] = ["taxRate", "maintenanceBudget", "repairPriority"];

const assetCount = 12;
const initialConditionStep = 0.05;
const wearMultipliers = [0.7, 0.9, 1.1, 1.3];
// Below this condition a repair costs twice as much per condition point.
const lateRepairThreshold = 0.4;
const lateRepairCostFactor = 2;

interface Asset { id: string; condition: number; wearPerYear: number; repairedThisYear: number }

export function create(options: Partial<FinanceParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const assetValue = parameters.replacementValue / assetCount;
  const assets: Asset[] = Array.from({ length: assetCount }, (_, index) => ({
    id: `asset-${index + 1}`,
    condition: 1 - initialConditionStep * index,
    wearPerYear: parameters.annualWear * wearMultipliers[index % wearMultipliers.length]!,
    repairedThisYear: 0,
  }));
  let cash = parameters.initialCash;
  let taxRevenue = 0;
  let serviceSpending = 0;
  let maintenanceSpending = 0;
  let wearConditionPoints = 0;
  let cumulativeTaxRevenue = 0;
  let cumulativeServiceSpending = 0;
  let cumulativeMaintenanceSpending = 0;

  const costPerPoint = (asset: Asset) => assetValue * (asset.condition < lateRepairThreshold ? lateRepairCostFactor : 1);
  const backlog = () => assets.reduce((sum, asset) => sum + (1 - asset.condition) * costPerPoint(asset), 0);
  const meanCondition = () => assets.reduce((sum, asset) => sum + asset.condition, 0) / assetCount;
  const poorAssetCount = () => assets.filter(asset => asset.condition < lateRepairThreshold).length;
  const cashBalanceError = () => cash - (parameters.initialCash + cumulativeTaxRevenue - cumulativeServiceSpending - cumulativeMaintenanceSpending);

  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: {
      cash, backlog: backlog(), meanCondition: meanCondition(), poorAssetCount: poorAssetCount(),
      maintenanceSpending, wearValue: wearConditionPoints * assetValue, cashBalanceError: cashBalanceError(),
    } });
  }
  record();

  function repairOrder() {
    return [...assets].sort((first, second) => {
      if (parameters.repairPriority === "preventive") {
        const firstLate = first.condition < lateRepairThreshold ? 1 : 0;
        const secondLate = second.condition < lateRepairThreshold ? 1 : 0;
        if (firstLate !== secondLate) return firstLate - secondLate;
      }
      return first.condition - second.condition || assets.indexOf(first) - assets.indexOf(second);
    });
  }

  function settleYear() {
    taxRevenue = parameters.taxBase * parameters.taxRate;
    serviceSpending = parameters.serviceCost;
    cash += taxRevenue - serviceSpending;
    wearConditionPoints = 0;
    for (const asset of assets) {
      const wear = Math.min(asset.wearPerYear, asset.condition);
      asset.condition -= wear;
      asset.repairedThisYear = 0;
      wearConditionPoints += wear;
    }
    // Mandatory services may borrow; maintenance uses only available cash.
    let available = Math.min(parameters.maintenanceBudget, Math.max(0, cash));
    maintenanceSpending = 0;
    for (const asset of repairOrder()) {
      if (available <= 0 || asset.condition >= 1) continue;
      const rate = costPerPoint(asset);
      const spending = Math.min((1 - asset.condition) * rate, available);
      asset.condition = Math.min(1, asset.condition + spending / rate);
      asset.repairedThisYear = spending;
      available -= spending;
      maintenanceSpending += spending;
    }
    cash -= maintenanceSpending;
    cumulativeTaxRevenue += taxRevenue;
    cumulativeServiceSpending += serviceSpending;
    cumulativeMaintenanceSpending += maintenanceSpending;
  }

  return {
    setPolicy(changes: Partial<FinancePolicy>) {
      parameters = updateParameters(inputs, parameters, changes, policyKeys);
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, settleYear);
        record();
      }
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        cash,
        backlog: backlog(),
        meanCondition: meanCondition(),
        poorAssetCount: poorAssetCount(),
        lateRepairThreshold,
        taxRevenue,
        serviceSpending,
        maintenanceSpending,
        wearConditionPoints,
        wearValue: wearConditionPoints * assetValue,
        cumulativeTaxRevenue,
        cumulativeServiceSpending,
        cumulativeMaintenanceSpending,
        cashBalanceError: cashBalanceError(),
        assets: Object.freeze(assets.map(asset => Object.freeze({
          id: asset.id, condition: asset.condition, wearPerYear: asset.wearPerYear,
          repairedThisYear: asset.repairedThisYear, repairCost: (1 - asset.condition) * costPerPoint(asset),
          isPoor: asset.condition < lateRepairThreshold,
        }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Municipal Finance",
  description: "Taxes fund services and repairs of twelve wearing assets; late repairs cost double. Compare repair order and deferred maintenance.",
  inputs,
  create,
} satisfies Definition<FinanceParameters, ReturnType<typeof create>>;
