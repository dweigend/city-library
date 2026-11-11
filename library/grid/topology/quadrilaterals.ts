import { validateOptions } from "../../agent/state.ts";
import { finite } from "../../geometry/space.ts";
import { polygonArea } from "../../geometry/planar/polygon-input.ts";
import { orient, point } from "../../geometry/planar/predicates.ts";
import type { PlanarPolygon, PlanarXY } from "../../geometry/planar/types.ts";
import { isRandom, type Random } from "../../random/random.ts";
import { coordinateLimit, createLayout, maximumCellCount, maximumPositionCount, type Layout } from "./layout.ts";
import { startAtLowestCorner } from "./quad-validation.ts";

interface QuadrilateralOptions {
  ringCount: number;
  edgeLength?: number;
  random: Random;
  boundary?: never;
  pointSpacing?: never;
  relaxationIterationCount?: never;
}
type Triangle = readonly [number, number, number];
type Candidate = readonly [number, number];
interface Patch {
  vertices: PlanarXY[];
  triangles: Triangle[];
  candidates: Candidate[];
}
const maximumRingCount = 7;
const minimumEdgeLength = 2 ** -400;
// Each source triangle refines into at most three closed quads of five positions.
const childrenPerTriangle = 3;
const closedQuadPositions = 5;

/** Finite hexagonal triangle pairing followed by complete three/four-quad refinement. */
export function quadrilaterals(options: QuadrilateralOptions): Layout {
  if (arguments.length !== 1) throw new TypeError("Quadrilaterals requires one options record.");
  const values = validateOptions(options, ["ringCount", "edgeLength", "random"]);
  if (Object.values(values).some(value => value === undefined)) throw new TypeError("Undefined topology options are unsupported.");
  const ringCount = finite(values.ringCount);
  const edgeLength = finite("edgeLength" in values ? values.edgeLength : 1);
  if (!Number.isInteger(ringCount) || ringCount < 1 || ringCount > maximumRingCount) throw new RangeError("Quadrilaterals requires ringCount in 1..7.");
  if (edgeLength < minimumEdgeLength || edgeLength > coordinateLimit / ringCount) throw new RangeError("Triangle edge length exceeds supported numerical bounds.");
  if (!isRandom(values.random)) throw new TypeError("Quadrilaterals requires a canonical Random stream.");

  const patch = triangularPatch(ringCount, edgeLength);
  // All input geometry and worst-case budgets are established before pairing draws.
  validateSource(patch, ringCount);
  const partners = pairTriangles(patch, values.random);
  const polygons = refineFaces(patch, partners);
  return createLayout(polygons, true);
}

function edgeKey(first: number, second: number): string {
  return first < second ? `${first}/${second}` : `${second}/${first}`;
}
function triangularPatch(ringCount: number, edgeLength: number): Patch {
  const vertices: PlanarXY[] = [], triangles: Triangle[] = [];
  const vertexIds = new Map<string, number>();
  function isInsidePatch(q: number, r: number): boolean {
    return Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= ringCount;
  }
  function vertex(q: number, r: number): number {
    const key = `${q},${r}`, existing = vertexIds.get(key);
    if (existing !== undefined) return existing;
    const id = vertices.length;
    vertices.push([(q + r / 2) * edgeLength, r * (Math.sqrt(3) * edgeLength / 2)]);
    vertexIds.set(key, id);
    return id;
  }
  function triangle(corners: readonly (readonly [number, number])[]): void {
    if (!corners.every(([q, r]) => isInsidePatch(q, r))) return;
    const [a, b, c] = corners;
    // Both call sites supply exactly three integer lattice coordinates.
    triangles.push([vertex(...a!), vertex(...b!), vertex(...c!)]);
  }
  for (let r = -ringCount; r <= ringCount; r++) for (let q = -ringCount; q <= ringCount; q++) {
    triangle([[q, r], [q + 1, r], [q, r + 1]]);
    triangle([[q + 1, r], [q + 1, r + 1], [q, r + 1]]);
  }
  const owners = new Map<string, number>(), candidates: Candidate[] = [];
  triangles.forEach((corners, cell) => {
    for (let edge = 0; edge < 3; edge++) {
      const key = edgeKey(corners[edge]!, corners[(edge + 1) % 3]!);
      const prior = owners.get(key);
      if (prior === undefined) owners.set(key, cell);
      else candidates.push([prior, cell]);
    }
  });
  candidates.sort(([a, b], [c, d]) => a - c || b - d);
  return { vertices, triangles, candidates };
}

function validateSource(patch: Patch, ringCount: number): void {
  if (patch.triangles.length !== 6 * ringCount ** 2 || patch.candidates.length !== 9 * ringCount ** 2 - 3 * ringCount)
    throw new RangeError("Incomplete triangular patch construction.");
  const maximumChildren = childrenPerTriangle * patch.triangles.length;
  if (maximumChildren > maximumCellCount || maximumChildren * closedQuadPositions > maximumPositionCount) throw new RangeError("Quadrilateral layout budget exceeded.");
  const sourcePolygons = patch.triangles.map(corners => closed(corners.map(id => patch.vertices[id]!)));
  for (const shape of sourcePolygons) polygonArea(shape);
  createLayout(sourcePolygons, true);
}

function pairTriangles(patch: Patch, random: Random): readonly number[] {
  const candidates = [...patch.candidates];
  for (let index = candidates.length - 1; index > 0; index--) {
    const selected = Math.floor(random.raw({ kind: "double" }) * (index + 1));
    [candidates[index], candidates[selected]] = [candidates[selected]!, candidates[index]!];
  }
  const partners = patch.triangles.map(() => -1);
  for (const [first, second] of candidates) {
    if (partners[first] !== -1 || partners[second] !== -1) continue;
    partners[first] = second;
    partners[second] = first;
  }
  return partners;
}

function mixedFace(first: Triangle, second: Triangle | undefined): number[] {
  if (second === undefined) return [...first];
  const otherEdges = new Set(second.map((corner, index) => edgeKey(corner, second[(index + 1) % 3]!)));
  const firstEdges = new Set(first.map((corner, index) => edgeKey(corner, first[(index + 1) % 3]!)));
  const next = new Map<number, number>();
  for (const [corners, shared] of [[first, otherEdges], [second, firstEdges]] as const) {
    corners.forEach((corner, index) => {
      const successor = corners[(index + 1) % 3]!;
      if (!shared.has(edgeKey(corner, successor))) next.set(corner, successor);
    });
  }
  const start = next.keys().next().value;
  if (start === undefined) throw new RangeError("Missing paired face boundary.");
  const result = [start];
  while (result.length < 4) {
    const successor = next.get(result[result.length - 1]!);
    if (successor === undefined || result.includes(successor)) throw new RangeError("Invalid paired face boundary.");
    result.push(successor);
  }
  if (next.get(result[3]!) !== start) throw new RangeError("Unclosed paired face boundary.");
  return result;
}

function closed(corners: readonly PlanarXY[]): PlanarPolygon {
  return { type: "Polygon", coordinates: [[...corners, corners[0]!]] };
}
function refineFaces(patch: Patch, partners: readonly number[]): PlanarPolygon[] {
  const midpoints = new Map<string, PlanarXY>(), polygons: PlanarPolygon[] = [];
  function midpoint(first: number, second: number): PlanarXY {
    const key = edgeKey(first, second), existing = midpoints.get(key);
    if (existing) return existing;
    const a = patch.vertices[first]!, b = patch.vertices[second]!;
    const result: PlanarXY = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    midpoints.set(key, result);
    return result;
  }
  patch.triangles.forEach((triangle, cell) => {
    const partner = partners[cell]!;
    if (partner >= 0 && partner < cell) return;
    const face = startAtLowestCorner(mixedFace(triangle, partner < 0 ? undefined : patch.triangles[partner]), id => patch.vertices[id]!);
    const coordinates = face.map(id => patch.vertices[id]!);
    const center: PlanarXY = [coordinates.reduce((sum, [x]) => sum + x, 0) / face.length, coordinates.reduce((sum, [, y]) => sum + y, 0) / face.length];
    face.forEach((corner, index) => {
      const corners = [patch.vertices[corner]!, midpoint(corner, face[(index + 1) % face.length]!), center, midpoint(face[(index + face.length - 1) % face.length]!, corner)];
      const canonical = startAtLowestCorner(corners, value => value);
      const exact = canonical.map(([x, y]) => point(x, y));
      for (let turn = 0; turn < 4; turn++) if (orient(exact[turn]!, exact[(turn + 1) % 4]!, exact[(turn + 2) % 4]!) <= 0)
        throw new RangeError("Refinement produced a nonconvex quad.");
      polygons.push(closed(canonical));
    });
  });
  return polygons;
}
