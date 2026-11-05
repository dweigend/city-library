import type { NetworkDiffusionSnapshot } from "../../../examples/models/network-diffusion.ts";

/** Draws the model's count history; does not calculate simulation metrics. */
export function createTrend(svg: SVGSVGElement) {
  const ns = "http://www.w3.org/2000/svg";
  const lines = ["unaware", "active", "settled"] as const;
  const paths = lines.map((state) => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("class", `trend-${state}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-width", "2");
    svg.append(path);
    return path;
  });
  return (snapshot: NetworkDiffusionSnapshot) => {
    const first = snapshot.history[0]?.tick ?? 0;
    const last = snapshot.history.at(-1)?.tick ?? first;
    lines.forEach((state, index) => {
      const points = snapshot.history.map((sample) => `${8 + (sample.tick - first) / Math.max(1, last - first) * 584},${90 - sample[state] / snapshot.agentCount * 80}`);
      paths[index]!.setAttribute("d", points.map((point, pointIndex) => `${pointIndex ? "L" : "M"}${point}`).join(" "));
    });
    svg.setAttribute("aria-label", `Population history, ticks ${first} to ${last}. Unaware ${snapshot.counts.unaware}, active ${snapshot.counts.active}, settled ${snapshot.counts.settled}.`);
  };
}
