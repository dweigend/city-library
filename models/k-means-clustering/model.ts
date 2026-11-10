/** Hjorth, Head & Wilensky (2014), CC BY-NC-SA 3.0. */
import { Agent, Random, World, run, geometry, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface ClusteringParameters {
  seed: number;
  clusterCount: number;
  centroidCount: number;
  dataPointCount: number;
}
export const inputs: Inputs<ClusteringParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  clusterCount: { kind: "number", default: 7, min: 1, max: 14, integer: true },
  centroidCount: { kind: "number", default: 7, min: 1, max: 14, integer: true },
  dataPointCount: {
    kind: "number",
    default: 138,
    min: 2,
    max: 1000,
    integer: true,
  },
};
export interface PointInput {
  x: number;
  y: number;
  cluster?: number | null;
}
export interface CentroidInput {
  x: number;
  y: number;
}
export const centroidColors = [
  136, 126, 116, 106, 96, 86, 76, 66, 56, 46, 36, 26, 16, 6,
] as const;
export function create(options: Partial<ClusteringParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.dataPointCount <= settings.centroidCount)
    throw new RangeError("Data points must exceed centroids.");
  const random = Random.create({ seed: settings.seed }),
    space = { x: 101, y: 101, boundary: "hard" as const },
    world = World.create(space, { random });
  type P = ReturnType<typeof point>;
  type C = ReturnType<typeof centroid>;
  let points: P[] = [],
    centroids: C[] = [],
    anyCentroidsMoved = true,
    deviations: number[] = [],
    diagnostic: string | null = null;
  const history: {
    tick: number;
    deviations: number[];
    mean: number;
    phase: string;
  }[] = [];
  let nextId = 0;
  function point(p: PointInput) {
    return world.add(
      Agent.create(
        {
          sourceId: nextId++,
          kind: "point" as const,
          cluster: p.cluster ?? null,
        },
        { position: { x: p.x, y: p.y } },
      ),
    );
  }
  function centroid(p: CentroidInput, index: number) {
    return world.add(
      Agent.create(
        {
          sourceId: nextId++,
          kind: "centroid" as const,
          index,
          color: centroidColors[index]!,
        },
        { position: { x: p.x, y: p.y } },
      ),
    );
  }
  function distance(
    a: {
      x: number;
      y: number;
    },
    b: {
      x: number;
      y: number;
    },
  ) {
    return geometry.distance(a, b, { space });
  }
  function closestCentroid(p: { x: number; y: number }) {
    if (!centroids.length) throw new Error("No centroids.");
    const ds = centroids.map((c) => distance(p, c));
    const min = Math.min(...ds);
    const tied = centroids.filter((_, i) => ds[i] === min);
    return tied[Math.floor(random.number() * tied.length)]!;
  }
  // Cache action-time reporters: read() never draws. Ties use the source stochastic reporter.
  function squareDeviations() {
    deviations = centroids.map((c) =>
      points.reduce(
        (sum, p) => sum + (closestCentroid(p) === c ? distance(p, c) ** 2 : 0),
        0,
      ),
    );
    return [...deviations];
  }
  function record(phase: string) {
    history.push({
      tick: world.tick.value,
      deviations: deviations.map((x) => x * settings.clusterCount),
      mean: stats.describe(deviations).mean ?? 0,
      phase,
    });
    if (history.length > 2001) history.shift();
  }
  function assignClusters() {
    for (const p of random.sample(points, {
      sampleCount: points.length,
      algorithm: "fisher-yates-descending",
    }))
      p.cluster = closestCentroid(p).index;
  }
  function updateClusters() {
    for (const c of random.sample(centroids, {
      sampleCount: centroids.length,
      algorithm: "fisher-yates-descending",
    })) {
      const own = points.filter((p) => p.cluster === c.index);
      if (own.length) {
        const x = stats.describe(own.map((p) => p.x)).mean!,
          y = stats.describe(own.map((p) => p.y)).mean!;
        if (distance(c, { x, y }) > 0.1) anyCentroidsMoved = true;
        c.move({ to: { x, y } });
      }
    }
    squareDeviations();
    record("update");
  }
  function resetCentroids() {
    if (!points.length)
      throw new Error("Cannot sample a centroid from no data points.");
    for (const c of centroids) c.delete();
    centroids = [];
    for (const p of points) p.cluster = null;
    for (let i = 0; i < settings.centroidCount; i++) {
      const p = points[Math.floor(random.number() * points.length)]!;
      centroids.push(centroid(p, i));
    }
    anyCentroidsMoved = true;
    world.tick.reset();
    history.length = 0;
    squareDeviations();
    record("reset");
  }
  function checkPosition(p: { x: number; y: number }) {
    if (
      !p ||
      ![p.x, p.y].every(Number.isFinite) ||
      p.x < -50.5 ||
      p.x >= 50.5 ||
      p.y < -50.5 ||
      p.y >= 50.5
    )
      throw new RangeError("Position outside native hard world.");
  }
  function setScenario(s: {
    points: readonly PointInput[];
    centroids: readonly CentroidInput[];
  }) {
    if (
      !s ||
      !Array.isArray(s.points) ||
      !Array.isArray(s.centroids) ||
      !s.points.length ||
      !s.centroids.length ||
      s.centroids.length > 14
    )
      throw new RangeError("Nonempty points and 1..14 centroids required.");
    for (const p of s.points) {
      checkPosition(p);
      if (
        p.cluster !== undefined &&
        p.cluster !== null &&
        (!Number.isSafeInteger(p.cluster) ||
          p.cluster < 0 ||
          p.cluster >= s.centroids.length)
      )
        throw new RangeError("Invalid cluster.");
    }
    s.centroids.forEach(checkPosition);
    for (const a of [...points, ...centroids]) a.delete();
    points = s.points.map((p) => point(p));
    centroids = s.centroids.map((c, i) => centroid(c, i));
    anyCentroidsMoved = true;
    deviations = [];
    history.length = 0;
    squareDeviations();
    record("scenario");
  }
  const perCluster = Math.round(settings.dataPointCount / settings.clusterCount);
  for (let i = 0; i < settings.clusterCount; i++) {
    const cx = (random.number() * 101 - 50.5) / 1.5,
      cy = (random.number() * 101 - 50.5) / 1.5;
    for (let j = 0; j < perCluster; j++) {
      const heading = Math.floor(random.number() * 360),
        radial = Math.abs(
          random.number({
            distribution: "normal",
            mean: 0,
            deviation: (20 - settings.clusterCount) / 2,
          }),
        );
      const a = point({ x: cx, y: cy });
      a.rotate(heading);
      try {
        a.move(radial);
      } catch (error) {
        diagnostic = `Native cluster excursion outside hard world: ${String(error)}`;
        throw new RangeError(diagnostic);
      }
      points.push(a);
    }
  }
  resetCentroids();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        if (!anyCentroidsMoved) break;
        run(world, () => {
          anyCentroidsMoved = false;
          assignClusters();
          updateClusters();
        });
        squareDeviations();
        record("tick");
      }
    },
    assignClusters,
    updateClusters,
    resetCentroids,
    setScenario,
    squareDeviations,
    setParameters(changes: Partial<ClusteringParameters>) {
      if (
        Reflect.ownKeys(changes).some(
          (k) => !["clusterCount", "centroidCount"].includes(String(k)),
        )
      )
        throw new TypeError("Setup-only parameter.");
      settings = parseParameters(inputs, { ...settings, ...changes });
    },
    read() {
      return {
        width: 101,
        height: 101,
        tick: world.tick.value,
        parameters: { ...settings },
        anyCentroidsMoved,
        diagnostic,
        randomState: random.state,
        points: points.map((p) => ({
          id: String(p.sourceId),
          x: p.x,
          y: p.y,
          cluster: p.cluster,
        })),
        centroids: centroids.map((c) => ({
          id: String(c.sourceId),
          x: c.x,
          y: c.y,
          index: c.index,
          color: c.color,
        })),
        deviations: [...deviations],
        meanDeviation: stats.describe(deviations).mean ?? 0,
        history: history.map((p) => ({ ...p, deviations: [...p.deviations] })),
      };
    },
  };
}
export const model = {
  title: "K-Means Clustering",
  description:
    "Lloyd assignment and centroid updates with native radial data and stopping tolerance. Hjorth, Head and Wilensky (2014), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<ClusteringParameters, ReturnType<typeof create>>;
