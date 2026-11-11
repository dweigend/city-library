/** Original synthetic demand allocation on finite parcels with a local neighborhood choice rule. */
import { Grid, World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type LandUse = "residential" | "commercial" | "green";
export type GrowthPattern = "compact" | "dispersed";
export type ProtectionPlan = "none" | "corridor" | "scattered";
export interface LandUseParameters {
  residentialDemand: number;
  commercialDemand: number;
  conversionLimit: number;
  growthPattern: GrowthPattern;
}
type DemandKey = "residentialDemand" | "commercialDemand";

const columnCount = 8;
const rowCount = 6;
const parcelCount = columnCount * rowCount;
const parcelAreaHa = 1;
const parcelEdgeKm = 0.1;

export const inputs: Inputs<LandUseParameters> = {
  residentialDemand: { kind: "number", default: 24, min: 0, max: parcelCount, integer: true },
  commercialDemand: { kind: "number", default: 6, min: 0, max: parcelCount, integer: true },
  conversionLimit: { kind: "number", default: 2, min: 0, max: 12, integer: true },
  growthPattern: { kind: "choice", default: "compact", options: ["compact", "dispersed"] },
};
const demandKeys: readonly DemandKey[] = ["residentialDemand", "commercialDemand"];
const useOrder: readonly LandUse[] = ["residential", "commercial", "green"];
const protectionPlans: readonly ProtectionPlan[] = ["none", "corridor", "scattered"];
const corridorColumn = 1;
const scatteredCells: readonly (readonly [number, number])[] = [[0, 0], [7, 0], [0, 5], [7, 5], [6, 3], [1, 3]];
const initialResidentialCells: readonly (readonly [number, number])[] = [[2, 2], [3, 2], [2, 3], [3, 3]];
const initialCommercialCells: readonly (readonly [number, number])[] = [[4, 2], [4, 3]];

function cellIndex(column: number, row: number) {
  return column + columnCount * row;
}

function validateDemand(parameters: Pick<LandUseParameters, DemandKey>): void {
  if (parameters.residentialDemand + parameters.commercialDemand > parcelCount) {
    throw new RangeError("Combined demand must not exceed 48 parcels.");
  }
}

export function create(options: Partial<LandUseParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  validateDemand(parameters);
  const world = World.create();
  const grid = Grid.create({ x: columnCount, y: rowCount, boundary: "hard" }, {
    state: { use: "green" as LandUse, isProtected: false, changedThisYear: false },
  });
  world.add(grid);
  const parcels = grid.fields;
  for (const [column, row] of initialResidentialCells) parcels[cellIndex(column, row)]!.use = "residential";
  for (const [column, row] of initialCommercialCells) parcels[cellIndex(column, row)]!.use = "commercial";
  const parcelsById = new Map(parcels.map((parcel, index) => [`parcel:${index}`, parcel]));
  const history = storage.history({ capacity: 121 });
  let convertedParcelCount = 0;

  type Parcel = (typeof parcels)[number];
  const faceNeighbors = (parcel: Parcel) => grid.neighbors(parcel, { neighborhood: "faces" });
  const centerDistance = (parcel: Parcel) => Math.hypot(parcel.x, parcel.y);

  function countUses(): Record<LandUse, number> {
    const counts = { residential: 0, commercial: 0, green: 0 };
    for (const parcel of parcels) counts[parcel.use] += 1;
    return counts;
  }

  /** Largest face-connected green area and number of separate green patches. */
  function greenPatches() {
    const visited = new Set<Parcel>();
    let largest = 0;
    let count = 0;
    for (const start of parcels) {
      if (start.use !== "green" || visited.has(start)) continue;
      count += 1;
      let size = 0;
      const stack = [start];
      visited.add(start);
      while (stack.length > 0) {
        const parcel = stack.pop()!;
        size += 1;
        for (const neighbor of faceNeighbors(parcel)) {
          if (neighbor.use === "green" && !visited.has(neighbor)) {
            visited.add(neighbor);
            stack.push(neighbor);
          }
        }
      }
      largest = Math.max(largest, size);
    }
    return { largestGreenPatchHa: largest * parcelAreaHa, greenPatchCount: count };
  }

  function urbanEdgeKm() {
    let edgeCount = 0;
    for (const parcel of parcels) {
      for (const neighbor of faceNeighbors(parcel)) {
        if ((parcel.use === "green") !== (neighbor.use === "green")) edgeCount += 1;
      }
    }
    // Each boundary was counted from both sides.
    return edgeCount / 2 * parcelEdgeKm;
  }

  function measures() {
    const counts = countUses();
    return {
      residentialAreaHa: counts.residential * parcelAreaHa,
      commercialAreaHa: counts.commercial * parcelAreaHa,
      greenAreaHa: counts.green * parcelAreaHa,
      ...greenPatches(),
      urbanEdgeKm: urbanEdgeKm(),
    };
  }

  /** Neighborhood choice: compact growth joins its own use; dispersed growth avoids it. */
  function chooseDonor(destination: LandUse, targets: Record<LandUse, number>, counts: Record<LandUse, number>) {
    const score = (parcel: Parcel) => faceNeighbors(parcel).filter(neighbor => neighbor.use === destination).length;
    const candidates = parcels.filter(parcel => !parcel.isProtected && counts[parcel.use] > targets[parcel.use]);
    const isCompact = parameters.growthPattern === "compact";
    candidates.sort((first, second) => isCompact
      ? score(second) - score(first) || centerDistance(first) - centerDistance(second) || parcels.indexOf(first) - parcels.indexOf(second)
      : score(first) - score(second) || centerDistance(second) - centerDistance(first) || parcels.indexOf(first) - parcels.indexOf(second));
    return candidates[0];
  }

  function step() {
    convertedParcelCount = 0;
    for (const parcel of parcels) parcel.changedThisYear = false;
    const targets: Record<LandUse, number> = {
      residential: parameters.residentialDemand,
      commercial: parameters.commercialDemand,
      green: parcelCount - parameters.residentialDemand - parameters.commercialDemand,
    };
    for (let slot = 0; slot < parameters.conversionLimit; slot += 1) {
      const counts = countUses();
      let destination: LandUse | undefined;
      let largestDeficit = 0;
      for (const use of useOrder) {
        const deficit = targets[use] - counts[use];
        if (deficit > largestDeficit) {
          destination = use;
          largestDeficit = deficit;
        }
      }
      if (!destination) break;
      const donor = chooseDonor(destination, targets, counts);
      if (!donor) break;
      donor.use = destination;
      donor.changedThisYear = true;
      convertedParcelCount += 1;
    }
  }

  function record() {
    history.add({ tick: world.tick.value, values: measures() });
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
    setDemand(changes: Partial<Pick<LandUseParameters, DemandKey>>) {
      const next = updateParameters(inputs, parameters, changes, demandKeys);
      validateDemand(next);
      parameters = next;
    },
    setGrowthPattern(growthPattern: GrowthPattern) {
      parameters = updateParameters(inputs, parameters, { growthPattern }, ["growthPattern"]);
    },
    /** Replace all protection with one of three equal-area plans (or none). */
    applyProtectionPlan(plan: ProtectionPlan) {
      if (typeof plan !== "string") throw new TypeError("Protection plan must be text.");
      if (!protectionPlans.includes(plan)) throw new RangeError("Unknown protection plan.");
      const protectedIndexes = new Set(plan === "corridor"
        ? Array.from({ length: rowCount }, (_, row) => cellIndex(corridorColumn, row))
        : plan === "scattered" ? scatteredCells.map(([column, row]) => cellIndex(column, row)) : []);
      parcels.forEach((parcel, index) => { parcel.isProtected = protectedIndexes.has(index); });
    },
    setProtection(id: string, isProtected: boolean) {
      if (typeof id !== "string" || typeof isProtected !== "boolean") {
        throw new TypeError("Protection requires a string parcel ID and a boolean.");
      }
      const parcel = parcelsById.get(id);
      if (!parcel) throw new RangeError("Unknown parcel ID.");
      parcel.isProtected = isProtected;
    },
    read() {
      const values = measures();
      return Object.freeze({
        tick: world.tick.value,
        parameters,
        ...values,
        totalAreaHa: parcelCount * parcelAreaHa,
        protectedAreaHa: parcels.filter(parcel => parcel.isProtected).length * parcelAreaHa,
        unmetResidentialDemand: Math.max(0, parameters.residentialDemand - values.residentialAreaHa / parcelAreaHa),
        unmetCommercialDemand: Math.max(0, parameters.commercialDemand - values.commercialAreaHa / parcelAreaHa),
        convertedParcelCount,
        parcels: Object.freeze(parcels.map((parcel, index) => Object.freeze({
          id: `parcel:${index}`, column: index % columnCount, row: Math.floor(index / columnCount),
          x: parcel.x, y: parcel.y, use: parcel.use, isProtected: parcel.isProtected,
          changedThisYear: parcel.changedThisYear, areaHa: parcelAreaHa,
        }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Land Use Change",
  description: "Demand converts parcels; a local neighborhood rule decides where. Compare compact with dispersed growth and corridor with scattered protection. Synthetic targets.",
  inputs,
  create,
} satisfies Definition<LandUseParameters, ReturnType<typeof create>>;
