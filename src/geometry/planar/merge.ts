import { validateOptions } from "../../agent/state.ts";
import { createLayout, requireLayout, type Layout } from "../../grid/topology/layout.ts";
import { array } from "./validation.ts";
import { freezePolygon, maximumParcelPositions, polygonArea, polygonPositionCount, readPolygon, signedRingArea } from "./parcel-input.ts";
import type { PlanarPolygon, PlanarXY } from "./types.ts";

export type MergeResult =
  | { readonly status: "ok"; readonly shape: PlanarPolygon; readonly sourceCells: readonly number[] }
  | { readonly status: "unsupported" | "failed"; readonly remainingShapes: readonly PlanarPolygon[]; readonly sourceCells: readonly number[]; readonly diagnostics: readonly string[] };
type MergeOptions = { shapes: readonly PlanarPolygon[] } | { layout: Layout; cells: readonly number[] };
const key = (pair: PlanarXY): string => `${pair[0]},${pair[1]}`;
interface Edge { readonly first: PlanarXY; readonly second: PlanarXY }

/** Full-edge cancellation for one conforming connected simple union, never a Boolean solver. */
export function merge(options: MergeOptions): MergeResult {
  const input = validateOptions(options, ["shapes", "layout", "cells"]);
  const sourceCells: number[] = [];
  let rawShapes: unknown[];
  if (Object.hasOwn(input, "shapes")) {
    if (Object.hasOwn(input, "layout") || Object.hasOwn(input, "cells")) throw new TypeError("Choose shapes or layout with cells.");
    const raw = array(input.shapes, 1);
    if (raw.length > 1024) throw new RangeError("Merge exceeds 1024 shapes.");
    rawShapes = raw;
  } else {
    const layout = requireLayout(input.layout), cells = array(input.cells, 1);
    if (cells.length > 1024) throw new RangeError("Merge exceeds 1024 cells.");
    for (const cell of cells) {
      if (typeof cell !== "number" || !Number.isInteger(cell) || !layout.cells.includes(cell)) throw new RangeError("Unknown layout cell.");
      if (sourceCells.includes(cell)) throw new RangeError("Merge source cells must be unique.");
      sourceCells.push(cell);
    }
    rawShapes = sourceCells.map(cell => layout.polygon({ cell }));
  }
  let positionCount = 0;
  for (const shape of rawShapes) {
    positionCount += polygonPositionCount(shape);
    if (positionCount > maximumParcelPositions) throw new RangeError("Merge position budget exceeded.");
  }
  const shapes = rawShapes.map(readPolygon);
  // Validate all inputs and measurable area before reporting support limitations.
  const inputArea = shapes.reduce((sum, shape) => sum + polygonArea(shape), 0);
  const sources = Object.freeze([...sourceCells]);
  const reject = (status: "unsupported" | "failed", diagnostic: string): MergeResult => Object.freeze({
    status, remainingShapes: Object.freeze([...shapes]), sourceCells: sources, diagnostics: Object.freeze([diagnostic]),
  });
  if (shapes.some(shape => shape.coordinates.length !== 1)) return reject("unsupported", "Merge supports hole-free source polygons only.");
  try { createLayout(shapes, true); }
  catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return reject("unsupported", "Merge requires nonoverlapping conforming full-edge polygons.");
  }
  const edges = new Map<string, Edge>();
  for (const shape of shapes) {
    const raw = shape.coordinates[0]!;
    const ring = signedRingArea(raw) > 0 ? raw : [...raw].reverse();
    for (let index = 0; index < ring.length - 1; index++) {
      const first = ring[index]!, second = ring[index + 1]!;
      const reverse = `${key(second)}/${key(first)}`;
      if (edges.has(reverse)) edges.delete(reverse);
      else edges.set(`${key(first)}/${key(second)}`, { first, second });
    }
  }
  const outgoing = new Map<string, Edge>(), incoming = new Set<string>();
  for (const edge of edges.values()) {
    if (outgoing.has(key(edge.first)) || incoming.has(key(edge.second)))
      return reject("unsupported", "Merged boundary branches at a point contact.");
    outgoing.set(key(edge.first), edge); incoming.add(key(edge.second));
  }
  const start = edges.values().next().value as Edge | undefined;
  if (!start) return reject("failed", "No representable merged boundary remained.");
  const ring: PlanarXY[] = [start.first], visited = new Set<Edge>();
  let edge: Edge | undefined = start;
  while (edge && !visited.has(edge)) {
    visited.add(edge); ring.push(edge.second);
    if (key(edge.second) === key(start.first)) break;
    edge = outgoing.get(key(edge.second));
  }
  if (ring.length < 4 || key(ring[ring.length - 1]!) !== key(start.first))
    return reject("failed", "Merged boundary did not close.");
  if (visited.size !== edges.size) return reject("unsupported", "Merge would produce disconnected components or holes.");
  if (ring.length > 128) return reject("unsupported", "Merged boundary exceeds 128 positions.");
  let shape: PlanarPolygon;
  try { shape = readPolygon(freezePolygon([ring])); }
  catch (error) {
    if (!(error instanceof RangeError || error instanceof TypeError)) throw error;
    return reject("failed", "Merged boundary is not a supported simple polygon.");
  }
  if (Math.abs(polygonArea(shape) - inputArea) > inputArea * 1e-9)
    return reject("failed", "Merged area did not conserve input area within relative 1e-9.");
  return Object.freeze({ status: "ok", shape, sourceCells: sources });
}
