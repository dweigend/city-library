import { expect, test } from "bun:test";
import { Random, stats, type Summary } from "city-library";

test("population and sample summaries preserve median, ties and undefined small-sample spread", () => {
  const values = Object.freeze([9, 1, 2, 2, 6]);
  const population: Summary = stats.describe(values);
  expect(population).toEqual({ valueCount: 5, sum: 20, min: 1, max: 9, mean: 4, median: 2, variance: 9.2, standardDeviation: Math.sqrt(9.2) });
  expect(stats.describe(values, { sample: true }).variance).toBe(11.5);
  expect(values).toEqual([9, 1, 2, 2, 6]);
  expect(Object.isFrozen(population)).toBe(true);
  expect(stats.describe([-4, 0, 2, 8]).median).toBe(1);
  expect(stats.describe([7], { sample: true })).toEqual({ valueCount: 1, sum: 7, min: 7, max: 7, mean: 7, median: 7, variance: undefined, standardDeviation: undefined });
  expect(stats.describe([7]).standardDeviation).toBe(0);
  expect(stats.describe([])).toEqual({ valueCount: 0, sum: 0, min: undefined, max: undefined, mean: undefined, median: undefined, variance: undefined, standardDeviation: undefined });
});

test("large common offsets retain centered spread and affine measurement properties", () => {
  const original = [-2, -1, 0, 1, 2];
  const shifted = stats.describe(original.map(value => value + 1e12));
  expect(shifted.mean).toBe(1e12);
  expect(shifted.median).toBe(1e12);
  expect(shifted.variance).toBe(2);
  const scaled = stats.describe(original.map(value => 3 * value + 20), { sample: true });
  expect(scaled.mean).toBe(20);
  expect(scaled.median).toBe(20);
  expect(scaled.variance).toBe(22.5);
  // This size also rejects spread-argument implementations of min/max.
  const many = stats.describe(Array<number>(200_000).fill(3));
  expect(many).toEqual({ valueCount: 200_000, sum: 600_000, min: 3, max: 3, mean: 3, median: 3, variance: 0, standardDeviation: 0 });
});

test("integer multiset permutations retain summaries and satisfy the pairwise variance identity", () => {
  const variants = [[-3, 2, 2, 7], [2, 7, -3, 2], [7, 2, 2, -3]];
  const expectedVariance = variants[0]!.reduce((total, a) => total + variants[0]!.reduce((inner, b) => inner + (a - b) ** 2, 0), 0) / (2 * 4 ** 2);
  const first = stats.describe(variants[0]!);
  for (const values of variants) {
    expect(stats.describe(values)).toEqual(first);
    expect(stats.describe(values).variance).toBe(expectedVariance);
  }
});

test("a one-shot iterable is consumed once and a rejected value closes its iterator", () => {
  let calls = 0;
  const input = {
    *[Symbol.iterator]() {
      if (++calls > 1) throw new Error("Input was replayed");
      yield 3; yield 1; yield 2;
    },
  };
  expect(stats.describe(input).median).toBe(2);
  expect(calls).toBe(1);
  let closed = false;
  function* invalid() {
    try { yield 1; yield NaN; yield 3; }
    finally { closed = true; }
  }
  expect(() => stats.describe(invalid())).toThrow(RangeError);
  expect(closed).toBe(true);
  function* failing() { yield 1; throw new Error("Iterator failed"); }
  expect(() => stats.describe(failing())).toThrow("Iterator failed");
});

test("options reject before input iteration without invoking accessors or coercing values", () => {
  let iterated = false;
  let accessor = false;
  const source = { *[Symbol.iterator]() { iterated = true; yield 1; } };
  const badOptions = [null, [], { sample: "true" }, { unknown: true }, Object.defineProperty({}, "sample", { get() { accessor = true; return true; } }), { [Symbol("sample")]: true }];
  for (const options of badOptions) expect(() => stats.describe(source, options as { sample?: boolean })).toThrow(TypeError);
  expect(iterated).toBe(false);
  expect(accessor).toBe(false);
  for (const source of [null, 4, "12", {}, ["1"], [new Number(1)]]) expect(() => stats.describe(source as Iterable<number>)).toThrow(TypeError);
  expect(() => (stats.describe as Function)([], {}, 1)).toThrow(TypeError);
  expect(stats.describe([1], { sample: undefined }).mean).toBe(1);
});

test("nonfinite values and sum/spread overflow reject without affecting unrelated state", () => {
  const random = Random.create({ seed: 17 });
  const state = random.state;
  for (const values of [[Infinity], [-Infinity], [NaN], [Number.MAX_VALUE, Number.MAX_VALUE], [Number.MAX_VALUE, -Number.MAX_VALUE], [1e154, -1e154]])
    expect(() => stats.describe(values)).toThrow(RangeError);
  expect(random.state).toEqual(state);
  const before = stats.describe([2, 4, 8]);
  stats.describe([100, 200]);
  expect(before.mean).toBe(14 / 3);
  expect(before.median).toBe(4);
});
