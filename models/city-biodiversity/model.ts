/** Original synthetic metapopulation recurrence of expected occupancy; no calibrated species or city data. */
import { World, run, storage, twoPhase } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type RestorationPlan = "none" | "stepping-stone" | "enlarge-east";
export interface HabitatParameters {
  initialOccupancy: number;
  vegetationQuality: number;
  dispersalRate: number;
  extinctionRate: number;
  permeability: number;
  restorationPlan: RestorationPlan;
}

export const inputs: Inputs<HabitatParameters> = {
  initialOccupancy: { kind: "number", default: 1, min: 0, max: 1 },
  vegetationQuality: { kind: "number", default: 0.5, min: 0, max: 1 },
  dispersalRate: { kind: "number", default: 1, min: 0, max: 3 },
  extinctionRate: { kind: "number", default: 0.25, min: 0, max: 1 },
  permeability: { kind: "number", default: 1, min: 0, max: 1 },
  restorationPlan: { kind: "choice", default: "none", options: ["none", "stepping-stone", "enlarge-east"] },
};

interface HabitatPatch {
  id: string;
  label: string;
  xKm: number;
  yKm: number;
  baseAreaHa: number;
  areaHa: number;
  isHabitat: boolean;
  isPlanned: boolean;
  occupancy: number;
  colonizationGain: number;
  extinctionLoss: number;
}

const restorationAreaHa = 1;
const eastPatchIds = ["east-a", "east-b", "east-c"];
const westPatchIds = ["west-core", "west-north", "west-south"];
const patchLayout: readonly [string, string, number, number, number][] = [
  ["west-core", "West core", -3, 0, 8],
  ["west-north", "West north", -3.5, 1.1, 1.5],
  ["west-south", "West south", -2.4, -1, 1.5],
  ["bridge", "Bridge", -0.5, 0.1, 1],
  ["east-a", "East A", 2, 0.6, 1.5],
  ["east-b", "East B", 2.5, -0.7, 1.2],
  ["east-c", "East C", 3.2, 0.4, 1],
  ["stepping-stone", "Stepping stone", 0.8, 0.35, restorationAreaHa],
];

export function create(options: Partial<HabitatParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const patches: HabitatPatch[] = patchLayout.map(([id, label, xKm, yKm, areaHa]) => ({
    id, label, xKm, yKm, baseAreaHa: areaHa, areaHa, isHabitat: id !== "stepping-stone", isPlanned: id === "stepping-stone",
    occupancy: westPatchIds.includes(id) ? settings.initialOccupancy : 0, colonizationGain: 0, extinctionLoss: 0,
  }));
  const history = storage.history({ capacity: 120 });
  applyRestoration();

  /** The plan either opens the planned stepping stone or enlarges east-a by the same hectare. */
  function applyRestoration() {
    for (const patch of patches) {
      if (patch.isPlanned) {
        const isActive = settings.restorationPlan === "stepping-stone";
        if (!isActive) patch.occupancy = 0;
        patch.isHabitat = isActive;
      }
      patch.areaHa = patch.baseAreaHa + (patch.id === "east-a" && settings.restorationPlan === "enlarge-east" ? restorationAreaHa : 0);
    }
  }

  const habitats = () => patches.filter(patch => patch.isHabitat);
  const meanOf = (selected: readonly HabitatPatch[]) =>
    selected.length === 0 ? 0 : selected.reduce((sum, patch) => sum + patch.occupancy, 0) / selected.length;

  function totals() {
    const active = habitats();
    return {
      meanOccupancy: meanOf(active),
      eastOccupancy: meanOf(patches.filter(patch => eastPatchIds.includes(patch.id))),
      occupiedAreaHa: active.reduce((sum, patch) => sum + patch.occupancy * patch.areaHa, 0),
      colonizationGain: active.reduce((sum, patch) => sum + patch.colonizationGain, 0),
      extinctionLoss: active.reduce((sum, patch) => sum + patch.extinctionLoss, 0),
    };
  }

  function record() {
    const values = totals();
    history.add({ tick: world.tick.value, values: {
      meanOccupancy: values.meanOccupancy, eastOccupancy: values.eastOccupancy,
      westOccupancy: meanOf(patches.filter(patch => westPatchIds.includes(patch.id))), occupiedAreaHa: values.occupiedAreaHa,
    } });
  }

  function connectivity(patch: HabitatPatch) {
    if (settings.permeability === 0) return 0;
    return habitats().filter(other => other !== patch).reduce((sum, other) =>
      sum + Math.exp(-Math.hypot(patch.xKm - other.xKm, patch.yKm - other.yKm) / settings.permeability) * other.occupancy * other.areaHa, 0);
  }

  function step() {
    twoPhase(habitats(), {
      compute(patch) {
        const colonization = settings.vegetationQuality * (1 - Math.exp(-settings.dispersalRate * connectivity(patch)));
        const extinction = Math.min(1, settings.extinctionRate * 2 * (1 - settings.vegetationQuality) / Math.sqrt(patch.areaHa));
        const colonizationGain = colonization * (1 - patch.occupancy);
        const extinctionLoss = extinction * patch.occupancy;
        // The recurrence is bounded analytically; clamp only floating-point endpoints.
        const occupancy = Math.max(0, Math.min(1, patch.occupancy + colonizationGain - extinctionLoss));
        return { occupancy, colonizationGain, extinctionLoss };
      },
      commit(patch, next) {
        Object.assign(patch, next);
      },
    });
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
    setVegetationQuality(value: number) {
      settings = updateParameters(inputs, settings, { vegetationQuality: value }, ["vegetationQuality"]);
    },
    setPermeability(value: number) {
      settings = updateParameters(inputs, settings, { permeability: value }, ["permeability"]);
    },
    setRestorationPlan(restorationPlan: RestorationPlan) {
      settings = updateParameters(inputs, settings, { restorationPlan }, ["restorationPlan"]);
      applyRestoration();
    },
    /** Remove a patch (its occupancy is lost) or restore it empty. */
    setPatchHabitat(id: string, isHabitat: boolean) {
      if (typeof id !== "string" || typeof isHabitat !== "boolean") throw new TypeError("Patch habitat needs a string ID and a boolean.");
      const patch = patches.find(candidate => candidate.id === id && !candidate.isPlanned);
      if (!patch) throw new RangeError("Unknown patch ID.");
      if (patch.isHabitat !== isHabitat) patch.occupancy = 0;
      patch.isHabitat = isHabitat;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...settings }),
        patches: Object.freeze(patches.filter(patch => !patch.isPlanned || patch.isHabitat).map(patch => Object.freeze({
          id: patch.id, label: patch.label, xKm: patch.xKm, yKm: patch.yKm, areaHa: patch.areaHa,
          isHabitat: patch.isHabitat, isEast: eastPatchIds.includes(patch.id), occupancy: patch.occupancy,
          connectivity: patch.isHabitat ? connectivity(patch) : 0,
          colonizationGain: patch.colonizationGain, extinctionLoss: patch.extinctionLoss, quality: settings.vegetationQuality,
        }))),
        ...totals(),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Urban Habitat Connectivity",
  description: "Expected species occupancy across a patchy city: colonization from nearby occupied patches, extinction in small ones. Compare a stepping stone with a larger patch, and a harder-to-cross city. Synthetic annual probabilities.",
  inputs,
  create,
} satisfies Definition<HabitatParameters, ReturnType<typeof create>>;
