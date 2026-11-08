import { describe, expect, test } from "bun:test";
import { geometry, type PlanarDataset, type PlanarFeature, type PlanarGeometry, type PlanarPolygon, type PlanarXY } from "../index.ts";

const shape = (rings: readonly (readonly PlanarXY[])[]): PlanarPolygon => ({ type: "Polygon", coordinates: rings });
const square = shape([[[0, 0], [8, 0], [8, 8], [0, 8], [0, 0]]]);
const feature = (geometry: PlanarGeometry | null): PlanarFeature => ({ type: "Feature", geometry, properties: null });
const observe = (value: unknown) => geometry.bounds(value as readonly PlanarFeature[]);
const check = (value: unknown) => geometry.contains(value as PlanarPolygon, { x: -99, y: -99 });

describe("descriptor-safe geometry-only validation", () => {
  test("foreign and unused metadata values are never read", () => {
    let reads = 0;
    const trap = { get() { reads++; throw Error("unused field was read"); } };
    const point = Object.assign(Object.create(null), { type: "Point", coordinates: [1, 2] });
    Object.defineProperty(point, "foreign", trap);
    const item = { type: "Feature", geometry: point };
    for (const key of ["id", "properties", "foreign"]) Object.defineProperty(item, key, trap);
    const dataset = { features: [item] };
    Object.defineProperty(dataset, "coordinateSystem", trap);
    Object.defineProperty(dataset, "foreign", trap);
    expect(observe(dataset)).toEqual([1, 1, 2, 2]);
    const polygon = { ...square };
    Object.defineProperty(polygon, "foreign", trap);
    expect(geometry.contains(polygon, { x: 1, y: 1 })).toBe(true);
    expect(reads).toBe(0);
  });
  test("recognized fields and array indices reject accessors without invoking them", () => {
    let reads = 0;
    const getter = { get() { reads++; return [1, 2]; } };
    const bad = Object.defineProperty({ type: "Point" }, "coordinates", getter);
    expect(() => observe([{ type: "Feature", geometry: bad }])).toThrow(TypeError);
    const coordinates = [1, 2]; Object.defineProperty(coordinates, "0", getter);
    expect(() => observe([feature({ type: "Point", coordinates: coordinates as [number, number] })])).toThrow(TypeError);
    const options = Object.defineProperty({}, "boundary", getter);
    expect(() => geometry.contains(square, { x: 1, y: 1 }, options)).toThrow(TypeError);
    expect(reads).toBe(0);
  });
  test("strict records, arrays, options and scalar errors", () => {
    for (const coordinates of [[1], [1, 2, 3], ["1", 2], [, 2], Object.assign([1, 2], { extra: 3 }), Object.assign([1, 2], { [Symbol()]: 3 })]) {
      expect(() => observe([{ type: "Feature", geometry: { type: "Point", coordinates } }])).toThrow(TypeError);
    }
    for (const bad of [null, {}, { features: [null] }, { features: [{ type: "Feature" }] }, [{ type: "Wrong", geometry: null }], [feature({ type: "LineString", coordinates: [[0, 0]] })]])
      expect(() => observe(bad)).toThrow(TypeError);
    for (const value of [NaN, Infinity, -Infinity]) expect(() => observe([feature({ type: "Point", coordinates: [value, 0] })])).toThrow(RangeError);
    for (const options of [null, { boundary: "other" }, { extra: true }])
      expect(() => geometry.contains(square, { x: 1, y: 1 }, options as { boundary: "include" })).toThrow(TypeError);
    expect(geometry.contains(square, { x: 1, y: 1, z: undefined } as { x: number; y: number })).toBe(true);
    class Pair extends Array<number> {}
    expect(observe([feature({ type: "Point", coordinates: new Pair(1, 2) as unknown as PlanarXY })])).toEqual([1, 1, 2, 2]);
    expect(() => check({ type: "Polygon", coordinates: [] })).toThrow(TypeError);
    expect(() => check({ type: "Polygon", coordinates: [[[0, 0], [1, 0], [0, 1]]] })).toThrow(TypeError);
    expect(() => check(Object.create(square))).toThrow(TypeError);
  });
  test("DAGs, cycles, deep collections, and per-call revalidation", () => {
    const shared: PlanarGeometry = { type: "Point", coordinates: [2, 3] };
    let deep: PlanarGeometry = shared;
    for (let i = 0; i < 20000; i++) deep = { type: "GeometryCollection", geometries: [deep] };
    expect(geometry.bounds([feature({ type: "GeometryCollection", geometries: [deep, shared, deep] })])).toEqual([2, 2, 3, 3]);
    const children: PlanarGeometry[] = [shared];
    const collection: PlanarGeometry = { type: "GeometryCollection", geometries: children };
    expect(geometry.bounds([feature(collection)])).toEqual([2, 2, 3, 3]);
    children.push(collection);
    expect(() => geometry.bounds([feature(collection)])).toThrow(TypeError);
    children.pop();
    expect(geometry.bounds([feature(collection)])).toEqual([2, 2, 3, 3]);
  });
});

describe("exact topology and query policy", () => {
  test("every boundary follows include/exclude, winding is irrelevant", () => {
    const hole: readonly PlanarXY[] = [[2, 2], [6, 2], [6, 6], [2, 6], [2, 2]];
    for (const rings of [[square.coordinates[0]!, hole], [[...square.coordinates[0]!].reverse(), [...hole].reverse()]]) {
      const polygon = shape(rings);
      for (const [x, y] of [[0, 0], [0, 4], [8, 8], [2, 2], [2, 4], [6, 6]] as const) {
        expect(geometry.contains(polygon, { x, y })).toBe(true);
        expect(geometry.contains(polygon, { x, y }, { boundary: "exclude" })).toBe(false);
      }
      expect(geometry.contains(polygon, { x: 4, y: 4 })).toBe(false);
      expect(geometry.contains(polygon, { x: 1, y: 1 })).toBe(true);
    }
  });
  test("outside queries and bounds validate all topology", () => {
    const invalid = [
      shape([[[0, 0], [8, 8], [0, 8], [8, 0], [0, 0]]]),
      shape([[[0, 0], [8, 0], [4, 0], [4, 8], [0, 8], [0, 0]]]),
      shape([[[2, 0], [8, 0], [8, 8], [0, 8], [0, 0], [4, 0], [2, 0]]]),
      shape([square.coordinates[0]!, [[0, 2], [2, 2], [2, 4], [0, 4], [0, 2]]]),
      shape([square.coordinates[0]!, [[1, 1], [7, 1], [7, 7], [1, 7], [1, 1]], [[2, 2], [3, 2], [3, 3], [2, 3], [2, 2]]]),
      shape([[[0, 0], [8, 0], [8, 8], [6, 8], [6, 2], [2, 2], [2, 8], [0, 8], [0, 0]], [[1, 7], [7, 7], [4, 1], [1, 7]]]),
    ];
    for (const polygon of invalid) {
      expect(() => check(polygon)).toThrow(RangeError);
      expect(() => geometry.bounds([feature(polygon)])).toThrow(RangeError);
      expect(() => geometry.bounds([feature({ type: "MultiPolygon", coordinates: [square.coordinates, polygon.coordinates] })])).toThrow(RangeError);
    }
  });
  test("original binary64 arithmetic at subnormal, cancellation and extreme scales", () => {
    // Separately derived rational triangle area: u²/2 = 2^-105.
    const u = 2 ** -52;
    const triangle = shape([[[0, 0], [1, 1 - u], [1 + u, 1], [0, 0]]]);
    expect(1 - (1 - u) * (1 + u)).toBe(0);
    expect(geometry.bounds([feature(triangle)])).toEqual([0, 1 + u, 0, 1]);
    for (const s of [Number.MIN_VALUE, 2 ** -100, 1, 2 ** 1000]) {
      const polygon = shape([[[0, 0], [4 * s, 0], [4 * s, 4 * s], [0, 4 * s], [0, 0]]]);
      expect(geometry.bounds([feature(polygon)])).toEqual([0, 4 * s, 0, 4 * s]);
      if (s <= 1) expect(geometry.contains(polygon, { x: 2 * s, y: 2 * s }, { boundary: "exclude" })).toBe(true);
    }
    const m = Number.MAX_VALUE;
    expect(geometry.bounds([feature(shape([[[-m, -m], [m, -m], [m, m], [-m, m], [-m, -m]]]))])).toEqual([-m, m, -m, m]);
    const detached = geometry.bounds([feature(square)]);
    expect(Object.isFrozen(detached)).toBe(true);
    expect(Object.isFrozen(square.coordinates)).toBe(false);
  });
  test("bounds has no containment/codec budgets and no global overlap ban", () => {
    const bottom: PlanarXY[] = Array.from({ length: 2046 }, (_, x) => [x, 0]);
    const polygon = shape([[...bottom, [2045, 2], [0, 2], [0, 0]]]);
    expect(() => geometry.contains(polygon, { x: -1, y: 0 })).toThrow(RangeError);
    expect(geometry.bounds([feature(polygon)])).toEqual([0, 2045, 0, 2]);
    expect(geometry.bounds(Array.from({ length: 10001 }, () => feature(null)))).toBeUndefined();
    expect(geometry.bounds([feature({ type: "MultiPoint", coordinates: Array.from({ length: 100001 }, () => [1e100, -1e100] as const) })])).toEqual([1e100, 1e100, -1e100, -1e100]);
    expect(geometry.bounds([feature({ type: "MultiPolygon", coordinates: [square.coordinates, square.coordinates] }), feature(square)])).toEqual([0, 8, 0, 8]);
    const dataset: PlanarDataset = { features: [feature(square)], coordinateSystem: { crs: "caller", units: "caller" } };
    expect(geometry.bounds(dataset)).toEqual([0, 8, 0, 8]);
  });
});
