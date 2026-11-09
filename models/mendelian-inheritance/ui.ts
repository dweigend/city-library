import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    { field: "maleGenotype", label: "Male parent genotype" },
    { field: "femaleGenotype", label: "Female parent genotype" },
  ],
  live: {
    numberOfOffspring: {
      label: "Offspring per trial",
      set: (m, v) => m.setParameters({ numberOfOffspring: v }),
    },
  },
  actions: [
    { label: "Make F1 generation", run: (m) => m.makeF1Generation() },
    { label: "Clear F1 generation", run: (m) => m.clearF1Generation() },
    {
      label: "Read genotype",
      run: (m, selected) => {
        m.displayGenotype(selected);
      },
    },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/CT-STEM/Mendelian%20Inheritance.nlogox",
    label: "NetLogo original · Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (s) => s.done,
  monitors: [
    { label: "Trial", value: (s) => s.trialNumber },
    { label: "Dark offspring", value: (s) => s.numberOfDarkOffspring },
    { label: "Light offspring", value: (s) => s.numberOfLightOffspring },
    { label: "Dark ratio", value: (s) => s.darkRatioValue },
    { label: "Light ratio", value: (s) => s.lightRatioValue },
    { label: "Genotype", value: (s) => s.selectedGenotype ?? "Select a mouse" },
    { label: "Message", value: (s) => s.message },
  ],
  views: [
    {
      type: "spatial",
      label: "Parents and F1 offspring",
      data: (s) => ({
        width: s.width,
        height: s.height,
        agents: s.mice.map((a) => ({
          ...a,
          label: a.sex,
          color: a.dark ? "#777777" : "#ffffff",
          size: a.generation === "F1" ? 16 : 25,
        })),
      }),
    },
    {
      type: "inspector",
      label: "Mouse genotype",
      value: (s, id) => {
        const a = s.mice.find((a) => a.id === id);
        return a
          ? {
              genotype: a.genotype,
              generation: a.generation || "parent",
              phenotype: a.dark ? "dark" : "light",
            }
          : undefined;
      },
    },
  ],
});
