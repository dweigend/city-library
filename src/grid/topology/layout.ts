import { validateOptions } from "../../agent/state.ts";
import { finite, position, type Position } from "../../geometry/space.ts";
import { classify, contact, equal, onSegment, point, type Point } from "../../geometry/planar/predicates.ts";
import { array, field, polygon, record } from "../../geometry/planar/validation.ts";
import type { PlanarPolygon, PlanarXY } from "../../geometry/planar/types.ts";

export type BoundarySegment = readonly [PlanarXY, PlanarXY];
/** Detached finite XY topology. Keys have meaning only within this layout. */
export interface Layout {
  /** Cell keys 0..n-1 in polygon order. */
  readonly cells: readonly number[];
  /** Frozen hole-free polygon of one cell. */
  polygon(options: { cell: number }): PlanarPolygon;
  /** Cells sharing at least one complete boundary edge, ascending. */
  neighbors(options: { cell: number }): readonly number[];
  /** First cell, in key order, whose closed polygon contains the position. */
  cellAt(options: { position: Position }): number | undefined;
  /** Shared edges in the first cell's ring order; empty for non-neighbors. */
  sharedBoundary(options: { firstCell: number; secondCell: number }): readonly BoundarySegment[];
}
const layouts = new WeakSet<object>();
/** Internal admission guard: methods from caller-created records are never trusted. */
export function requireLayout(value: unknown): Layout {
  if (typeof value !== "object" || value === null || !layouts.has(value)) throw new TypeError("Expected a canonical topology layout.");
  return value as Layout;
}
/** Supported topology budget, shared by generated, authored and relaxed layouts. */
export const coordinateLimit = 1e6;
export const maximumCells = 1024;
export const maximumPositions = 8192;
const maximumRingPositions = 128;
function freezePolygon(rings: readonly (readonly Point[])[]): PlanarPolygon {
  return Object.freeze({ type: "Polygon", coordinates: Object.freeze(rings.map(ring => Object.freeze(ring.map(p => Object.freeze([p.x, p.y] as const))))) });
}
interface Box { minimumX: number; minimumY: number; maximumX: number; maximumY: number }
function boundingBox(ring: readonly Point[]): Box {
  return { minimumX: Math.min(...ring.map(p => p.x)), minimumY: Math.min(...ring.map(p => p.y)), maximumX: Math.max(...ring.map(p => p.x)), maximumY: Math.max(...ring.map(p => p.y)) };
}
function overlap(a: Box, b: Box): boolean {
  return a.minimumX <= b.maximumX && b.minimumX <= a.maximumX && a.minimumY <= b.maximumY && b.minimumY <= a.maximumY;
}
const key = (p: Point): string => `${p.x},${p.y}`;
function edgeKey(a: Point, b: Point): string { const first = key(a), second = key(b); return first < second ? `${first}/${second}` : `${second}/${first}`; }
function sameEdge(a: Point, b: Point, c: Point, d: Point): boolean { return (equal(a, c) && equal(b, d)) || (equal(a, d) && equal(b, c)); }
function interiorSegment(a: Point, b: Point, p: Point): boolean { return !equal(a, p) && !equal(b, p) && onSegment(a, b, p); }
function validatePair(first: readonly Point[], second: readonly Point[]): void {
  for (let i = 0; i < first.length - 1; i++) for (let j = 0; j < second.length - 1; j++) {
    const a = first[i]!, b = first[i + 1]!, c = second[j]!, d = second[j + 1]!;
    if (!contact(a, b, c, d) || sameEdge(a, b, c, d)) continue;
    if (interiorSegment(a, b, c) || interiorSegment(a, b, d) || interiorSegment(c, d, a) || interiorSegment(c, d, b))
      throw new RangeError("Unsupported nonconforming polygon edge contact.");
    if (!equal(a, c) && !equal(a, d) && !equal(b, c) && !equal(b, d))
      throw new RangeError("Polygon interiors overlap at crossing edges.");
  }
  if (first.some(p => classify(second, p) === 1) || second.some(p => classify(first, p) === 1)) throw new RangeError("Polygon interiors overlap.");
  // Shared edges can still enclose identical interiors with no strictly interior vertex.
  const allFirstBoundary = first.every(p => classify(second, p) === 0);
  const allSecondBoundary = second.every(p => classify(first, p) === 0);
  if (allFirstBoundary && allSecondBoundary) throw new RangeError("Duplicate polygon interiors overlap.");
  // A shared edge must have polygon interiors on opposite sides; exact winding
  // and endpoint direction make this independent of caller ring orientation.
  const firstSign = signedOrientation(first), secondSign = signedOrientation(second);
  for (let i = 0; i < first.length - 1; i++) for (let j = 0; j < second.length - 1; j++) {
    const a = first[i]!, b = first[i + 1]!, c = second[j]!, d = second[j + 1]!;
    if (!sameEdge(a, b, c, d)) continue;
    if ((equal(a, c) ? 1 : -1) * firstSign === secondSign) throw new RangeError("Polygon interiors overlap beside a shared edge.");
  }
}
function signedOrientation(ring: readonly Point[]): number {
  // Exact binary64 orientation at an extreme vertex determines simple-ring winding.
  let index = 0;
  for (let i = 1; i < ring.length - 1; i++) if (ring[i]!.x < ring[index]!.x || (ring[i]!.x === ring[index]!.x && ring[i]!.y < ring[index]!.y)) index = i;
  const count = ring.length - 1;
  const a = ring[(index + count - 1) % count]!, b = ring[index]!, c = ring[(index + 1) % count]!;
  const determinant = (b.X - a.X) * (c.Y - a.Y) - (b.Y - a.Y) * (c.X - a.X);
  return determinant > 0n ? 1 : -1;
}
/**
 * Constructs a canonical Layout. Generated polygons (`authored` false) are
 * trusted to conform; authored polygons are also checked pairwise for
 * overlaps and nonconforming contacts. Every input is validated against the
 * topology budget and copied before the layout is registered.
 */
export function createLayout(polygons: readonly PlanarPolygon[], authored: boolean): Layout {
  const rings = readRings(polygons);
  const boxes = rings.map(boundingBox);
  if (authored) for (let i = 0; i < rings.length; i++) for (let j = i + 1; j < rings.length; j++) if (overlap(boxes[i]!, boxes[j]!)) validatePair(rings[i]!, rings[j]!);
  const snapshots = rings.map(ring => freezePolygon([ring]));
  const { neighbors, boundaries } = indexSharedEdges(rings);
  const cells = Object.freeze(rings.map((_, index) => index));
  const empty = Object.freeze([]) as readonly BoundarySegment[];
  function cell(value: unknown): number {
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value >= rings.length) throw new RangeError("Unknown layout cell key.");
    return value;
  }
  const layout: Layout = Object.freeze({
    cells,
    polygon(options: { cell: number }) { const values = validateOptions(options, ["cell"]); return snapshots[cell(values.cell)]!; },
    neighbors(options: { cell: number }) { const values = validateOptions(options, ["cell"]); return neighbors[cell(values.cell)]!; },
    cellAt(options: { position: Position }) {
      const values = validateOptions(options, ["position"]), query = position(values.position as Position, 2);
      if (Math.abs(query.x) > coordinateLimit || Math.abs(query.y) > coordinateLimit) throw new RangeError("Topology query magnitude exceeds 1e6.");
      const p = point(query.x, query.y);
      for (let i = 0; i < rings.length; i++) {
        const box = boxes[i]!;
        if (p.x < box.minimumX || p.x > box.maximumX || p.y < box.minimumY || p.y > box.maximumY) continue;
        if (classify(rings[i]!, p) >= 0) return i;
      }
      return undefined;
    },
    sharedBoundary(options: { firstCell: number; secondCell: number }) {
      const values = validateOptions(options, ["firstCell", "secondCell"]), first = cell(values.firstCell), second = cell(values.secondCell);
      return boundaries.get(`${first}/${second}`) ?? empty;
    },
  });
  layouts.add(layout);
  return layout;
}
/** Exact outer rings in input order, after shape, budget and magnitude checks. */
function readRings(polygons: readonly PlanarPolygon[]): (readonly Point[])[] {
  if (polygons.length < 1 || polygons.length > maximumCells) throw new RangeError("Layouts require 1..1024 cells.");
  let total = 0;
  return polygons.map(shape => {
    const input = record(shape);
    if (field(input, "type") !== "Polygon") throw new TypeError("Topology requires Polygon shapes.");
    const raw = array(field(input, "coordinates"), 1);
    for (const ring of raw) {
      const coordinates = array(ring, 4);
      if (coordinates.length > maximumRingPositions) throw new RangeError("Topology rings exceed 128 positions.");
      total += coordinates.length;
    }
    if (total > maximumPositions) throw new RangeError("Topology exceeds 8192 positions.");
    const checked = polygon(raw);
    if (checked.some(ring => ring.some(p => Math.abs(p.x) > coordinateLimit || Math.abs(p.y) > coordinateLimit))) throw new RangeError("Topology coordinate magnitude exceeds 1e6.");
    if (checked.length !== 1) throw new RangeError("Unsupported topology polygon holes.");
    return checked[0]!;
  });
}
/**
 * Frozen neighbor lists and shared boundary segments keyed "cell/other".
 * Each edge may border at most two cells.
 */
function indexSharedEdges(rings: readonly (readonly Point[])[]) {
  const neighbors: number[][] = rings.map(() => []);
  const boundaries = new Map<string, BoundarySegment[]>();
  const edges = new Map<string, { cell: number; other?: number; owners: number }>();
  rings.forEach((ring, cell) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i]!, b = ring[i + 1]!, edge = edgeKey(a, b), prior = edges.get(edge);
      if (!prior) { edges.set(edge, { cell, owners: 1 }); continue; }
      if (++prior.owners > 2) throw new RangeError("Unsupported nonmanifold polygon edge.");
      if (!neighbors[cell]!.includes(prior.cell)) { neighbors[cell]!.push(prior.cell); neighbors[prior.cell]!.push(cell); }
      prior.other = cell;
    }
  });
  rings.forEach((ring, cell) => {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = ring[i]!, b = ring[i + 1]!, edge = edges.get(edgeKey(a, b))!;
      if (edge.other === undefined) continue;
      const other = edge.cell === cell ? edge.other : edge.cell;
      const pair = `${cell}/${other}`;
      let shared = boundaries.get(pair);
      if (!shared) { shared = []; boundaries.set(pair, shared); }
      shared.push(Object.freeze([Object.freeze([a.x, a.y] as const), Object.freeze([b.x, b.y] as const)] as const));
    }
  });
  const orderedNeighbors = neighbors.map(values => Object.freeze(values.sort((a, b) => a - b)));
  for (const segments of boundaries.values()) Object.freeze(segments);
  return { neighbors: orderedNeighbors, boundaries };
}
/** Square layouts accept `cellSize`; hex layouts accept `cellRadius` and `orientation`. */
export function generationOptions(value: unknown, sizeName: "cellSize" | "cellRadius"): { columns: number; rows: number; size: number; orientation: "pointy" | "flat" } {
  const hex = sizeName === "cellRadius";
  const values = validateOptions(value, ["columns", "rows", sizeName, ...(hex ? ["orientation"] : [])]);
  const columns = finite(values.columns), rows = finite(values.rows), size = finite(values[sizeName] ?? 1);
  if (!Number.isSafeInteger(columns) || !Number.isSafeInteger(rows) || columns < 1 || rows < 1 || columns * rows > maximumCells) throw new RangeError("Generation requires positive integer dimensions and at most 1024 cells.");
  if (size <= 0) throw new RangeError("Cell size must be positive.");
  const orientation = values.orientation ?? "pointy";
  if (orientation !== "pointy" && orientation !== "flat") throw new TypeError("Hex orientation must be pointy or flat.");
  return { columns, rows, size, orientation };
}
