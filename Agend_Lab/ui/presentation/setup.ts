import type { LabOptions, LabScenario } from "../application/session.ts";
import { element } from "./elements.ts";

export function createSetup() {
  const form = element("#model-form", HTMLFormElement);
  const scenario = element("#scenario", HTMLSelectElement);
  const population = element("#population", HTMLInputElement);
  const seed = element("#seed", HTMLInputElement);
  const transmission = element("#transmission", HTMLInputElement);
  const activeTicks = element("#active-ticks", HTMLInputElement);
  const initialEnergy = element("#initial-energy", HTMLInputElement);
  const topology = element("#topology", HTMLSelectElement);
  function selectedScenario(): LabScenario {
    const value = scenario.value;
    if (value !== "diffusion" && value !== "exchange" && value !== "lifecycle") throw new TypeError("Choose a supported model.");
    return value;
  }
  return {
    form, scenario,
    selectedScenario,
    show() {
      const selected = selectedScenario();
      const diffusion = selected === "diffusion";
      population.min = diffusion ? "3" : "2";
      for (const [control, visible] of [[population, selected !== "lifecycle"], [seed, selected !== "lifecycle"], [initialEnergy, !diffusion], [topology, diffusion], [transmission, diffusion], [activeTicks, diffusion]] as const) {
        control.disabled = !visible;
        control.parentElement!.hidden = !visible;
      }
    },
    options(): LabOptions {
      const shape = topology.value;
      if (shape !== "communities" && shape !== "ring" && shape !== "hub") throw new TypeError("Choose a supported network.");
      return { count: population.valueAsNumber, seed: seed.valueAsNumber, initialEnergy: initialEnergy.valueAsNumber, topology: shape, transmission: transmission.valueAsNumber, activeTicks: activeTicks.valueAsNumber, bridges: element("#bridges", HTMLInputElement).checked };
    },
  };
}
