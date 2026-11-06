import { defineUI, netLogoColor, type SpatialData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["seed", { field: "numDataPoints", label: "Requested points" }],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/K-MeansClustering",
    label:
      "Original NetLogo model \u00B7 Hjorth, Head and Wilensky \u00B7 CC BY-NC-SA 3.0",
  },
  live: {
    numClusters: {
      label: "Generated clusters / plot multiplier",
      set: (m, v) => m.setParameters({ numClusters: v }),
    },
    numCentroids: {
      label: "Centroids on reset",
      set: (m, v) => m.setParameters({ numCentroids: v }),
    },
  },
  actions: [
    { label: "Assign points", run: (m) => m.assignClusters() },
    { label: "Update centroids", run: (m) => m.updateClusters() },
    { label: "Reset centroids", run: (m) => m.resetCentroids() },
  ],
  complete: (s) => !s.anyCentroidsMoved,
  monitors: [
    { label: "Tick", value: (s) => s.tick },
    { label: "Points", value: (s) => s.points.length },
    { label: "Mean centroid SSE", value: (s) => s.meanDeviation.toFixed(3) },
  ],
  views: [
    {
      type: "spatial",
      label: "Clusters",
      data: clustersData,
    },
    {
      type: "line",
      label: "Square deviation of clusters",
      series: (s) =>
        s.centroids.map((c, i) => ({
          label: `Centroid ${i}`,
          color: netLogoColor(c.color),
          points: s.history.map((p) => ({
            x: p.tick,
            y: p.deviations[i] ?? 0,
          })),
        })),
    },
  ],
});

type UIObservation = ReturnType<ReturnType<typeof model.create>["read"]>;

function clustersData(s: UIObservation): SpatialData {
  return {
    width: 101,
    height: 101,
    agents: [
      ...s.points.map((p) => ({
        ...p,
        color:
          p.cluster === null
            ? "#888888"
            : netLogoColor((s.centroids[p.cluster]?.color ?? 7) - 2),
        size: 5,
      })),
      ...s.centroids.map((c) => ({
        ...c,
        label: String(c.index),
        color: netLogoColor(c.color),
        size: 14,
        shape: "triangle" as const,
      })),
    ],
  };
}
