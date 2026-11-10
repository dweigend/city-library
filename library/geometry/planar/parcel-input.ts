import type { PlanarGeometry, PlanarPolygon, PlanarXY } from "./types.ts";
import { array, field, polygon, record, xy } from "./validation.ts";

export type ParcelShape = PlanarPolygon | Extract<PlanarGeometry, { type: "MultiPolygon" }>;

/** Bounded parcel profile shared by area, merge and split. */
export const maximumParcelPositions = 8192;
export const maximumParcelRingPositions = 128;
const maximumParcelCoordinate = 1e6;
const maximumParcelComponents = 1024;

/** Cheap complete budget preflight before quadratic exact-ring validation. */
export function polygonPositionCount(value: unknown): number {
  const input = record(value);
  if (field(input, "type") !== "Polygon") throw new TypeError("Expected a Polygon.");
  const coordinates = array(field(input, "coordinates"), 1);
  let count = 0;
  for (const raw of coordinates) {
    const ring = array(raw, 4);
    if (ring.length > maximumParcelRingPositions) throw new RangeError("Polygon ring exceeds 128 positions.");
    count += ring.length;
    if (count > maximumParcelPositions) throw new RangeError("Polygon position budget exceeded.");
    for (const pair of ring) xy(pair, maximumParcelCoordinate);
  }
  return count;
}

/** Shared bounded validation, detached from topology and its stateful consumers. */
export function readPolygon(value: unknown): PlanarPolygon {
  polygonPositionCount(value);
  const input = record(value);
  const rings = polygon(field(input, "coordinates"));
  // The preflight already bounds ordinary data; this guards the second, separate read.
  for (const ring of rings) {
    for (const point of ring) {
      if (Math.abs(point.x) > maximumParcelCoordinate || Math.abs(point.y) > maximumParcelCoordinate) {
        throw new RangeError("Parcel coordinate magnitude exceeds 1e6.");
      }
    }
  }
  return freezePolygon(rings.map(ring => ring.map(point => [point.x, point.y] as const)));
}

export function freezePolygon(coordinates: readonly (readonly PlanarXY[])[]): PlanarPolygon {
  const rings = coordinates.map(ring => Object.freeze(ring.map(pair => Object.freeze([pair[0], pair[1]] as const))));
  return Object.freeze({ type: "Polygon", coordinates: Object.freeze(rings) });
}

/** Reads a Polygon or a MultiPolygon whose components are each valid parcel polygons. */
export function readShape(value: unknown): ParcelShape {
  const input = record(value);
  const type = field(input, "type");
  if (type === "Polygon") return readPolygon(value);
  if (type !== "MultiPolygon") throw new TypeError("Area requires a Polygon or MultiPolygon.");
  const coordinates = array(field(input, "coordinates"), 1);
  if (coordinates.length > maximumParcelComponents) throw new RangeError("Too many polygon components.");
  const inputs = coordinates.map(coordinates => ({ type: "Polygon", coordinates }));
  let count = 0;
  for (const shape of inputs) {
    count += polygonPositionCount(shape);
    if (count > maximumParcelPositions) throw new RangeError("Shape position budget exceeded.");
  }
  const polygons = inputs.map(readPolygon);
  return Object.freeze({ type: "MultiPolygon", coordinates: Object.freeze(polygons.map(shape => shape.coordinates)) });
}

/** Translation before products avoids cancellation from a distant coordinate origin. */
export function signedRingArea(ring: readonly PlanarXY[]): number {
  const origin = ring[0]!;
  let sum = 0;
  for (let index = 1; index < ring.length - 1; index++) {
    const first = ring[index]!;
    const second = ring[index + 1]!;
    sum += (first[0] - origin[0]) * (second[1] - origin[1]) -
      (first[1] - origin[1]) * (second[0] - origin[0]);
  }
  return sum / 2;
}

/** Positive shell area minus hole areas, independent of winding. */
export function polygonArea(shape: PlanarPolygon): number {
  const shellArea = Math.abs(signedRingArea(shape.coordinates[0]!));
  const holeArea = shape.coordinates.slice(1).reduce((sum, ring) => sum + Math.abs(signedRingArea(ring)), 0);
  const area = shellArea - holeArea;
  if (!Number.isFinite(area) || area <= 0) {
    throw new RangeError("Polygon area cannot be represented as positive finite binary64.");
  }
  return area;
}
