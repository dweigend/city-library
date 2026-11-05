import { expect, test } from "bun:test";
import { createNetworkDiffusionModel } from "../examples/models/network-diffusion.ts";
import { projectNetwork } from "../Agend_Lab/ui/visualization/projection.ts";
import { displayPositions } from "../Agend_Lab/ui/visualization/layout.ts";

test("community display keeps separate nodes at the supported maximum population", () => {
  const model = createNetworkDiffusionModel({ count: 200 });
  const before = model.read();
  const points = [...displayPositions(projectNetwork(before)).values()];
  expect(points).toHaveLength(200);
  // The renderer's base node diameter is 25; overlapping circles hide picking targets.
  let minimumSeparation = Infinity;
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      minimumSeparation = Math.min(minimumSeparation, Math.hypot(points[i]!.x - points[j]!.x, points[i]!.y - points[j]!.y));
    }
  }
  expect(minimumSeparation).toBeGreaterThan(25);
  expect(model.read()).toEqual(before);
});
