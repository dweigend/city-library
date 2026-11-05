import { createTestModel } from "../../../models/agent-lab/model.ts";
import { createExchangeModel, type ExchangeOptions, type ExchangeSnapshot } from "../../../examples/models/exchange.ts";
import { createNetworkDiffusionModel, type NetworkDiffusionOptions, type NetworkDiffusionSnapshot } from "../../../examples/models/network-diffusion.ts";

export type LabScenario = "diffusion" | "exchange" | "lifecycle";
export type LabOptions = ExchangeOptions & NetworkDiffusionOptions;
export type LabSnapshot = ReturnType<ReturnType<typeof createTestModel>["read"]> | ExchangeSnapshot | NetworkDiffusionSnapshot;
export function isExchangeSnapshot(state: LabSnapshot): state is ExchangeSnapshot {
  return "lastInteractionIds" in state;
}
export function isDiffusionSnapshot(state: LabSnapshot): state is NetworkDiffusionSnapshot {
  return "scenario" in state && state.scenario === "diffusion";
}

function createModel(scenario: LabScenario, options: LabOptions) {
  switch (scenario) {
    case "diffusion": return createNetworkDiffusionModel({ count: options.count, seed: options.seed, transmission: options.transmission, activeTicks: options.activeTicks, topology: options.topology, bridges: options.bridges });
    case "exchange": return createExchangeModel({ count: options.count, seed: options.seed, initialEnergy: options.initialEnergy });
    case "lifecycle": return createTestModel(options.initialEnergy);
    default: throw new TypeError("Choose a supported model.");
  }
}

/** Delegates model actions; scenario replacement commits only after successful construction. */
export function createLabSession(initialScenario: LabScenario = "diffusion") {
  let model = createModel(initialScenario, {});
  let revision = 0;
  function legacy() {
    if ("seedSelected" in model) throw new Error("This action belongs to a lifecycle model.");
    return model;
  }
  function diffusion() {
    if (!("seedSelected" in model)) throw new Error("Choose Network diffusion for this action.");
    return model;
  }
  return {
    get revision() { return revision; },
    read: (): LabSnapshot => model.read(),
    create(scenario: LabScenario, options: LabOptions) {
      const next = createModel(scenario, options);
      model = next;
      revision += 1;
    },
    select: (id: string) => model.select(id),
    advance: (count: number) => model.advance(count),
    toggleMembership: () => legacy().toggleMembership(),
    copy: () => legacy().copy(),
    delete: () => legacy().delete(),
    failStep: () => legacy().failStep(),
    seedSelected: () => diffusion().seedSelected(),
    setBridges: (enabled: boolean) => diffusion().setBridges(enabled),
  };
}
export type LabSession = ReturnType<typeof createLabSession>;
