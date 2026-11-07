import { defineUI, type Observation, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: [
    "seed",
    "init3PoresA",
    "init4PoresA",
    "init5PoresA",
    "init6PoresA",
    "init3PoresB",
    "init4PoresB",
    "init5PoresB",
    "init6PoresB",
  ] as const,
  live: {
    reproduce: {
      set: (m, v) => m.setParameters({ reproduce: v }),
    },
    reproduceEvery: {
      set: (m, v) => m.setParameters({ reproduceEvery: v }),
    },
    autoDoseA: {
      set: (m, v) => m.setParameters({ autoDoseA: v }),
    },
    autoDoseB: {
      set: (m, v) => m.setParameters({ autoDoseB: v }),
    },
    aDosage: {
      set: (m, v) => m.setParameters({ aDosage: v }),
    },
    bDosage: {
      set: (m, v) => m.setParameters({ bDosage: v }),
    },
    doseAEvery: {
      set: (m, v) => m.setParameters({ doseAEvery: v }),
    },
    doseBEvery: {
      set: (m, v) => m.setParameters({ doseBEvery: v }),
    },
  },
  actions: [
    { label: "Manual dose A", run: (m) => m.doseRegion("A") },
    { label: "Manual dose B", run: (m) => m.doseRegion("B") },
  ],
  source: {
    url: "https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Evolution/Bacterial%20Infection.nlogox",
    label: "NetLogo original · Wilensky · CC BY-NC-SA 3.0",
  },
  monitors: [
    { label: "Minutes", value: (s) => s.minutes },
    { label: "Hours", value: (s) => s.hours },
    { label: "Days", value: (s) => s.days },
    { label: "Doses A", value: (s) => s.dosesGivenToA },
    { label: "Doses B", value: (s) => s.dosesGivenToB },
  ],
  views: [
    {
      type: "spatial",
      label: "Patients A and B",
      data: patientsAAndBData,
    },
    ...(["A", "B"] as const).map((region) => ({
      type: "bar" as const,
      label: `Patient ${region} pore counts`,
      series: (s: Observation<typeof model>) => [
        {
          label: region,
          points: (region === "A"
            ? s.bacteriaCountsRegionA
            : s.bacteriaCountsRegionB
          ).map((y, i) => ({ x: i + 3, y })),
        },
      ],
    })),
    ...(["A", "B"] as const).map((region) => ({
      type: "line" as const,
      label: `Population in ${region}`,
      series: (s: Observation<typeof model>) =>
        [3, 4, 5, 6].map((v, i) => ({
          label: `${v} pores`,
          color: ["#a536c7", "#389b39", "#8b603f", "#ce3030"][i]!,
          points: s.history.map((p) => ({
            x: p.tick,
            y: (region === "A" ? p.a : p.b)[i]!,
          })),
        })),
    })),
    {
      type: "inspector",
      label: "Selected bacterium",
      value: selectedBacteriumInspector,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function patientsAAndBData(s: UIObservation): SpatialData {
  return {
    width: s.width,
    height: s.height,
    cells: s.cells.map((c) => ({
      ...c,
      color:
        c.x === 0
          ? "#999999"
          : c.portType === "input"
            ? "#9b2121"
            : c.portType === "output"
              ? "#9b8d21"
              : c.region
                ? "#ffd7d7"
                : "#4a4a4a",
    })),
    agents: [
      ...s.bacteria.map((a) => ({
        ...a,
        color: ["#a536c7", "#389b39", "#8b603f", "#ce3030"][a.variation - 3]!,
        size: 10,
      })),
      ...s.antibiotics.map((a) => ({ ...a, color: "#dd2020", size: 4 })),
    ],
  };
}

function selectedBacteriumInspector(
  s: UIObservation,
  id: string | null,
): Readonly<Record<string, string | number | boolean>> | undefined {
  const a = s.bacteria.find((a) => a.id === id);
  return a
    ? {
        variation: a.variation,
        age: a.age,
        region: a.region ?? "",
        targetX: a.targetX,
        targetY: a.targetY,
      }
    : undefined;
}
