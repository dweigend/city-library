import { validateOptions } from "../../agent/state.ts";
import { createLayout, requireLayout, type Layout } from "../../grid/topology/layout.ts";
import { array } from "./validation.ts";
import {
  freezePolygon,
  maximumParcelPositions,
  maximumParcelRingPositions,
  polygonArea,
  polygonPositionCount,
  readPolygon,
  signedRingArea,
} from "./parcel-input.ts";
import type { PlanarPolygon, PlanarXY } from "./types.ts";

export type MergeResult =
  | { readonly status: "ok"; readonly shape: PlanarPolygon; readonly sourceCells: readonly number[] }
  | { readonly status: "unsupported" | "failed"; readonly remainingShapes: readonly PlanarPolygon[]; readonly sourceCells: readonly number[]; readonly diagnostics: readonly string[] };
type MergeOptions = { shapes: readonly PlanarPolygon[] } | { layout: Layout; cells: readonly number[] };

/** A directed polygon boundary segment, oriented counterclockwise around its source. */
interface BoundarySegment { readonly first: PlanarXY; readonly second: PlanarXY }

const maximumMergeSources = 1024;
const relativeAreaTolerance = 1e-9;
const positionKey = (pair: PlanarXY): string => `${pair[0]},${pair[1]}`;

/**
 * Full-edge cancellation for one conforming connected simple union, never a Boolean solver.
 * Sources are explicit shapes or unique layout cells. Invalid input throws; inputs the
 * algorithm cannot merge return "unsupported" or "failed" with the original shapes.
 */
export function merge(options: MergeOptions): MergeResult {
  const input = validateOptions(options, ["shapes", "layout", "cells"]);
  const { rawShapes, sourceCells } = resolveSources(input);
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
    status,
    remainingShapes: Object.freeze([...shapes]),
    sourceCells: sources,
    diagnostics: Object.freeze([diagnostic]),
  });

  if (shapes.some(shape => shape.coordinates.length !== 1)) {
    return reject("unsupported", "Merge supports hole-free source polygons only.");
  }
  try {
    createLayout(shapes, true);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    return reject("unsupported", "Merge requires nonoverlapping conforming full-edge polygons.");
  }

  const segments = cancelSharedSegments(shapes);
  const outgoing = new Map<string, BoundarySegment>();
  const incoming = new Set<string>();
  for (const segment of segments.values()) {
    if (outgoing.has(positionKey(segment.first)) || incoming.has(positionKey(segment.second))) {
      return reject("unsupported", "Merged boundary branches at a point contact.");
    }
    outgoing.set(positionKey(segment.first), segment);
    incoming.add(positionKey(segment.second));
  }
  // The first remaining segment in insertion order fixes the start and orientation.
  const start = segments.values().next().value as BoundarySegment | undefined;
  if (!start) return reject("failed", "No representable merged boundary remained.");
  const { ring, visited } = traceRing(start, outgoing);
  if (ring.length < 4 || positionKey(ring[ring.length - 1]!) !== positionKey(start.first)) {
    return reject("failed", "Merged boundary did not close.");
  }
  if (visited.size !== segments.size) return reject("unsupported", "Merge would produce disconnected components or holes.");
  if (ring.length > maximumParcelRingPositions) return reject("unsupported", "Merged boundary exceeds 128 positions.");

  let shape: PlanarPolygon;
  try {
    shape = readPolygon(freezePolygon([ring]));
  } catch (error) {
    if (!(error instanceof RangeError || error instanceof TypeError)) throw error;
    return reject("failed", "Merged boundary is not a supported simple polygon.");
  }
  if (Math.abs(polygonArea(shape) - inputArea) > inputArea * relativeAreaTolerance) {
    return reject("failed", "Merged area did not conserve input area within relative 1e-9.");
  }
  return Object.freeze({ status: "ok", shape, sourceCells: sources });
}

/** Reads either explicit shapes or unique layout cells; cells keep their requested order. */
function resolveSources(input: Record<string, unknown>): { rawShapes: unknown[]; sourceCells: number[] } {
  const sourceCells: number[] = [];
  if (Object.hasOwn(input, "shapes")) {
    if (Object.hasOwn(input, "layout") || Object.hasOwn(input, "cells")) {
      throw new TypeError("Choose shapes or layout with cells.");
    }
    const rawShapes = array(input.shapes, 1);
    if (rawShapes.length > maximumMergeSources) throw new RangeError("Merge exceeds 1024 shapes.");
    return { rawShapes, sourceCells };
  }
  const layout = requireLayout(input.layout);
  const cells = array(input.cells, 1);
  if (cells.length > maximumMergeSources) throw new RangeError("Merge exceeds 1024 cells.");
  for (const cell of cells) {
    if (typeof cell !== "number" || !Number.isInteger(cell) || !layout.cells.includes(cell)) {
      throw new RangeError("Unknown layout cell.");
    }
    if (sourceCells.includes(cell)) throw new RangeError("Merge source cells must be unique.");
    sourceCells.push(cell);
  }
  return { rawShapes: sourceCells.map(cell => layout.polygon({ cell })), sourceCells };
}

/** Segments shared by two counterclockwise sources appear reversed and cancel; the rest form the union boundary. */
function cancelSharedSegments(shapes: readonly PlanarPolygon[]): Map<string, BoundarySegment> {
  const segments = new Map<string, BoundarySegment>();
  for (const shape of shapes) {
    const raw = shape.coordinates[0]!;
    const ring = signedRingArea(raw) > 0 ? raw : [...raw].reverse();
    for (let index = 0; index < ring.length - 1; index++) {
      const first = ring[index]!;
      const second = ring[index + 1]!;
      const reverse = `${positionKey(second)}/${positionKey(first)}`;
      if (segments.has(reverse)) segments.delete(reverse);
      else segments.set(`${positionKey(first)}/${positionKey(second)}`, { first, second });
    }
  }
  return segments;
}

/** Follows outgoing segments from start until the ring closes, a segment repeats or the path ends. */
function traceRing(
  start: BoundarySegment,
  outgoing: ReadonlyMap<string, BoundarySegment>,
): { ring: PlanarXY[]; visited: Set<BoundarySegment> } {
  const ring: PlanarXY[] = [start.first];
  const visited = new Set<BoundarySegment>();
  let segment: BoundarySegment | undefined = start;
  while (segment && !visited.has(segment)) {
    visited.add(segment);
    ring.push(segment.second);
    if (positionKey(segment.second) === positionKey(start.first)) break;
    segment = outgoing.get(positionKey(segment.second));
  }
  return { ring, visited };
}
