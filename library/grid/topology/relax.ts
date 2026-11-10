import { validateOptions } from "../../agent/state.ts";
import type { PlanarXY } from "../../geometry/planar/types.ts";
import { createLayout, requireLayout, type Layout } from "./layout.ts";
import { canonicalQuad, coordinateKey, quadPolygons, startAtLowestCorner } from "./quad-validation.ts";

interface RelaxOptions {
  layout: Layout;
  method: "square-target";
  iterationCount: number;
  random?: never;
  strength?: never;
}
interface Incidence {
  vertices: PlanarXY[];
  faces: number[][];
  boundary: Set<number>;
  maximumValence: number;
}
const maximumIterationCount = 256;
const maximumHalvings = 16;

/** Synchronous square-target forces over a fresh, immutable layout revision. */
export function relax(options: RelaxOptions): Layout {
  if (arguments.length !== 1) throw new TypeError("Relaxation requires one options record.");
  const values = validateOptions(options, ["layout", "method", "iterationCount"]);
  if (Object.values(values).some(value => value === undefined)) throw new TypeError("Undefined relaxation options are unsupported.");
  const layout = requireLayout(values.layout);
  if (values.method !== "square-target") throw new TypeError("This relaxation method is square-target only.");
  if (typeof values.iterationCount !== "number") throw new TypeError("Relaxation iterationCount must be a number.");
  const iterationCount = values.iterationCount;
  if (!Number.isSafeInteger(iterationCount) || iterationCount < 0 || iterationCount > maximumIterationCount)
    throw new RangeError("Relaxation iterationCount must be an integer in 0..256.");

  const incidence = readIncidence(layout);
  let vertices = incidence.vertices;
  // Even zero/stationary runs validate complete geometry and allocate fresh snapshots.
  let revised = createLayout(quadPolygons(vertices, incidence.faces), true);
  for (let iteration = 0; iteration < iterationCount; iteration++) {
    const forces = squareForces(vertices, incidence.faces);
    const nonzero = forces.some(([x, y], vertex) => !incidence.boundary.has(vertex) && (x !== 0 || y !== 0));
    if (!nonzero) break;
    const accepted = guardedStep(vertices, forces, incidence);
    vertices = accepted.vertices;
    revised = accepted.layout;
  }
  return revised;
}

function readIncidence(layout: Layout): Incidence {
  const vertices: PlanarXY[] = [], faces: number[][] = [], valences: number[] = [];
  const byCoordinate = new Map<string, number>();
  const edges = new Map<string, { first: number; second: number; ownerCount: number }>();
  for (const cell of layout.cells) {
    const polygon = layout.polygon({ cell });
    if (polygon.coordinates.length !== 1 || polygon.coordinates[0]!.length !== 5)
      throw new RangeError("Square-target relaxation requires hole-free four-corner quads.");
    const face = canonicalQuad(polygon.coordinates[0]!.slice(0, -1)).map(position => {
      const key = coordinateKey(position);
      let vertex = byCoordinate.get(key);
      if (vertex === undefined) {
        vertex = vertices.length;
        byCoordinate.set(key, vertex);
        vertices.push(position);
        valences.push(0);
      }
      valences[vertex] = valences[vertex]! + 1;
      return vertex;
    });
    faces.push(face);
    for (let index = 0; index < 4; index++) {
      const first = face[index]!, second = face[(index + 1) % 4]!;
      const key = first < second ? `${first}/${second}` : `${second}/${first}`;
      const edge = edges.get(key);
      if (edge) edge.ownerCount++;
      else edges.set(key, { first, second, ownerCount: 1 });
    }
  }
  const boundary = new Set<number>();
  for (const edge of edges.values()) {
    if (edge.ownerCount > 2) throw new RangeError("Unsupported nonmanifold quad edge.");
    if (edge.ownerCount === 1) { boundary.add(edge.first); boundary.add(edge.second); }
  }
  return { vertices, faces, boundary, maximumValence: Math.max(...valences) };
}

function squareForces(vertices: readonly PlanarXY[], faces: readonly (readonly number[])[]): [number, number][] {
  const forces: [number, number][] = vertices.map(() => [0, 0]);
  for (const face of faces) {
    const ordered = startAtLowestCorner(face, vertex => vertices[vertex]!);
    const corners = ordered.map(vertex => vertices[vertex]!);
    const center: PlanarXY = [corners.reduce((sum, p) => sum + p[0], 0) / 4, corners.reduce((sum, p) => sum + p[1], 0) / 4];
    const aligned = corners.map((p, index) => rotate([p[0] - center[0], p[1] - center[1]], (4 - index) % 4));
    const average: PlanarXY = [aligned.reduce((sum, p) => sum + p[0], 0) / 4, aligned.reduce((sum, p) => sum + p[1], 0) / 4];
    for (let index = 0; index < 4; index++) {
      const target = rotate(average, index), position = corners[index]!, force = forces[ordered[index]!]!;
      force[0] += center[0] + target[0] - position[0];
      force[1] += center[1] + target[1] - position[1];
    }
  }
  return forces;
}

function rotate([x, y]: PlanarXY, quarterTurns: number): PlanarXY {
  switch (quarterTurns) {
    case 0: return [x, y];
    case 1: return [-y, x];
    case 2: return [-x, -y];
    case 3: return [y, -x];
    default: throw new RangeError("Expected an exact quarter turn.");
  }
}

function guardedStep(vertices: readonly PlanarXY[], forces: readonly PlanarXY[], incidence: Incidence): { vertices: PlanarXY[]; layout: Layout } {
  const base = 1 / (2 * incidence.maximumValence);
  for (let attempt = 0; attempt <= maximumHalvings; attempt++) {
    const scale = base / 2 ** attempt;
    const candidate = vertices.map((position, vertex): PlanarXY => incidence.boundary.has(vertex) ? position :
      [position[0] + scale * forces[vertex]![0], position[1] + scale * forces[vertex]![1]]);
    if (!candidate.some((p, vertex) => p[0] !== vertices[vertex]![0] || p[1] !== vertices[vertex]![1])) continue;
    // Distinct construction vertices may never coalesce into accidental new incidence.
    if (new Set(candidate.map(coordinateKey)).size !== candidate.length) continue;
    try {
      const layout = createLayout(quadPolygons(candidate, incidence.faces), true);
      return { vertices: candidate, layout };
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      // Only rejected geometry is retried; no partial revision is published.
    }
  }
  throw new RangeError("No valid square-target step within the global halving budget.");
}
