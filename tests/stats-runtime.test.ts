import { test, expect } from "bun:test";
import { stats } from "city-library";

test("Gini is scale/permutation invariant, pure, finite for large unequal values", () => {
  const values = [3, 0, 8, 1];
  const before = [...values];
  expect(stats.gini(values)).toBeCloseTo(stats.gini([...values].reverse()), 14);
  expect(stats.gini(values)).toBeCloseTo(
    stats.gini(values.map((x) => 100 * x)),
    14,
  );
  expect(values).toEqual(before);
  expect(stats.gini([0, Number.MAX_VALUE])).toBe(0.5);
});

test("histogram handles final endpoint, outliers and one-pass iterables", () => {
  let visits = 0;
  function* input() {
    for (const value of [-2, 0, 0.5, 1, 2, 3]) {
      visits += 1;
      yield value;
    }
  }
  expect(stats.histogram(input(), { edges: [0, 1, 2] })).toEqual({
    edges: [0, 1, 2],
    counts: [2, 2],
    underflow: 1,
    overflow: 1,
  });
  expect(visits).toBe(6);
});

test("statistics reject malformed sources rather than silently treat them as empty", () => {
  expect(() => stats.gini({} as never)).toThrow(TypeError);
  expect(() => stats.gini(null as never)).toThrow(TypeError);
  expect(() =>
    stats.histogram([], { edges: [0, 1], unexpected: true } as never),
  ).toThrow(TypeError);
});
