import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

const binding = defineUI(model, {
  setup: ["seed", "initialDNAString", "userCreatedCode"],
  live: {
    nucleotidesAffected: {
      set: (instance, value) =>
        instance.setParameters({ nucleotidesAffected: value }),
    },
    mutationType: {
      set: (instance, value) => instance.setParameters({ mutationType: value }),
    },
    showGenes: {
      set: (instance, value) => instance.setParameters({ showGenes: value }),
    },
  },
  actions: [
    {
      label: "1. Transcribe",
      run: (instance) => instance.transcribe("original"),
    },
    {
      label: "2. Release mRNA",
      run: (instance) => instance.releaseMRNA("original"),
    },
    {
      label: "3. Translate",
      run: (instance) => instance.translate("original"),
    },
    {
      label: "4. Release protein",
      run: (instance) => instance.releaseProtein("original"),
    },
    { label: "5. Replicate DNA", run: (instance) => instance.replicateDNA() },
    {
      label: "6. Transcribe copy",
      run: (instance) => instance.transcribe("duplicate"),
    },
    {
      label: "7. Release copy mRNA",
      run: (instance) => instance.releaseMRNA("duplicate"),
    },
    {
      label: "8. Translate copy",
      run: (instance) => instance.translate("duplicate"),
    },
    {
      label: "9. Release copy protein",
      run: (instance) => instance.releaseProtein("duplicate"),
    },
    {
      label: "Protein output",
      run: (instance) => instance.showProteinProduction(),
    },
    {
      label: "Previous instruction",
      run: (instance) => instance.previousInstruction(),
    },
    {
      label: "Next instruction",
      run: (instance) => instance.nextInstruction(),
    },
  ],
  complete: (state) => state.stopped,
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Curricular%20Models/BEAGLE%20Evolution/DNA%20Protein%20Synthesis.nlogox",
    label: "Original NetLogo model · source notices",
  },
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Original genes", value: (state) => state.originalGenes.length },
    { label: "Copied genes", value: (state) => state.duplicateGenes.length },
    { label: "Proteins", value: (state) => state.proteins.length },
    { label: "Instruction", value: (state) => state.currentInstruction },
    { label: "Message", value: (state) => state.message },
  ],
  views: [
    {
      type: "spatial",
      label: "DNA Protein Synthesis",
      data: (state) => ({
        width: state.width,
        height: state.height,
        agents: state.agents
          .filter((agent) => !agent.hidden)
          .map((agent) => ({ ...agent, size: 5 })),
        cells: state.cells,
      }),
    },
    {
      type: "table",
      label: "Protein sequences",
      rows: (state) =>
        state.proteins.map((protein) => ({
          strand: protein.strand,
          sequence: protein.value,
        })),
    },
    {
      type: "table",
      label: "DNA sequences",
      rows: (state) => [
        { strand: "Original", sequence: state.originalDNAString },
        { strand: "Duplicate", sequence: state.duplicateDNAString },
      ],
    },
  ],
});

export { model };
export const sourceMarker =
  "selected-disease-gene-b09:dna-protein-synthesis:189eda6e21a0408e290f1afb5781ddae936f819ed8917788a683dcaf7d661301";
export const ui = { ...binding, model, sourceMarker };
