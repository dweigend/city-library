import { expect, test } from "bun:test";
import { Random, type RandomState } from "city-library";
import { polarGaussian } from "../library/random/normal.ts";

const normal = { distribution: "normal" } as const;

test("normal draws reject the first seed1 pair and cache the second pair's standard companion", () => {
  const oracle = Random.create({ seed: 1 });
  const [a, b, c, d] = Array.from({ length: 4 }, () => 2 * oracle.number() - 1);
  expect(a! * a! + b! * b!).toBeGreaterThan(1);
  const radius = c! * c! + d! * d!;
  expect(radius).toBeLessThan(1);
  const factor = Math.sqrt(-2 * Math.log(radius) / radius);
  const random = Random.create({ seed: 1 });
  expect(random.number(normal)).toBe(c! * factor);
  expect(random.state.continuation.word).toBe(oracle.state.continuation.word);
  expect(random.state.continuation.gaussian).toBe(d! * factor);
  const checkpoint = random.state;
  expect(random.number({ ...normal, mean: 10, deviation: 2 })).toBe(10 + 2 * d! * factor);
  expect(random.state.continuation.word).toBe(checkpoint.continuation.word);
  expect(random.state.continuation.gaussian).toBeNull();
});

test("polar rejection excludes origin and unit boundary and has a consumed-attempt cap", () => {
  const draws = [0.5, 0.5, 0, 0.5, 0.75, 0.5];
  let consumed = 0;
  const pair = polarGaussian(() => draws[consumed++]!);
  expect(consumed).toBe(6);
  expect(pair.value).toBe(Math.sqrt(-2 * Math.log(0.25)));
  expect(pair.companion).toBe(0);
  consumed = 0;
  expect(() => polarGaussian(() => { consumed++; return 0.5; })).toThrow("rejection limit");
  expect(consumed).toBe(2_000_000);
});

test("normal parameters validate fully before touching a pending cache or invoking getters", () => {
  const random = Random.create({ seed: 17 });
  random.number(normal);
  const before = random.state;
  let accessed = 0;
  const accessor = Object.defineProperty({}, "distribution", { enumerable: true, get() { accessed++; return "normal"; } });
  const invalid: unknown[] = [null, [], accessor,
    { ...normal, mean: "1" }, { ...normal, deviation: null },
    { ...normal, mean: NaN }, { ...normal, mean: Infinity },
    { ...normal, deviation: -1 }, { ...normal, deviation: Infinity },
    { ...normal, min: 0 }, { ...normal, max: undefined }, { ...normal, integer: false },
    { distribution: "uniform", mean: 0 }, { distribution: "gamma", shape: 2, rate: 0 },
    Object.assign(Object.create({ mean: 0 }), normal), { ...normal, [Symbol("extra")]: 1 },
  ];
  for (const value of invalid) {
    expect(() => random.number(value as typeof normal)).toThrow();
    expect(random.state).toEqual(before);
  }
  expect(() => (random.number as Function)(normal, {})).toThrow("Unexpected");
  expect(random.state).toEqual(before);
  expect(accessed).toBe(0);
  expect(random.number({ ...normal, mean: -3, deviation: 0 })).toBe(-3);
  expect(random.state).toEqual(before);
});

test("copy and JSON continuation retain an unscaled companion across uniform and sample draws", () => {
  const random = Random.create({ seed: 57 });
  random.number({ ...normal, mean: 100, deviation: 7 });
  const checkpoint = random.state;
  const copied = random.copy(), restored = Random.create({ seed: 0 });
  restored.state = JSON.parse(JSON.stringify(checkpoint)) as RandomState;
  const cached = checkpoint.continuation.gaussian!;
  random.number(); random.sample(["only"], { sampleCount: 1 });
  expect(random.state.continuation.gaussian).toBe(cached);
  expect(random.number({ ...normal, mean: -5, deviation: 3 })).toBe(-5 + 3 * cached);
  expect(copied.number({ ...normal, mean: -5, deviation: 3 })).toBe(-5 + 3 * cached);
  expect(restored.number({ ...normal, mean: -5, deviation: 3 })).toBe(-5 + 3 * cached);
  expect(restored.state).toEqual(copied.state);
  expect(random.state.continuation.word).not.toBe(restored.state.continuation.word);
});

test("nested local scopes use the main cached checkpoint and restore word/cache on every exit", () => {
  const random = Random.create({ seed: 99 });
  random.number(normal);
  const before = random.state, control = random.copy();
  random.local(() => {
    const first = random.number(normal);
    random.number(normal);
    expect(random.local(() => random.number(normal))).toBe(first);
    expect(random.local(() => random.number(normal))).toBe(first);
    random.number();
  });
  expect(random.state).toEqual(before);
  expect(() => random.local(() => { random.number(normal); throw new Error("abort"); })).toThrow("abort");
  expect(random.state).toEqual(before);
  expect(random.number(normal)).toBe(control.number(normal));
  random.number(normal);
  expect(random.state.continuation.gaussian).not.toBeNull();
  random.reseed(99);
  expect(random.state).toEqual(Random.create({ seed: 99 }).state);
});

test("finite output overflow consumes its sample and does not rewind words or companion", () => {
  const cached = Random.create({ seed: 1 });
  const initial = cached.state;
  cached.state = { ...initial, continuation: { ...initial.continuation, gaussian: 2 } };
  expect(() => cached.number({ ...normal, mean: Number.MAX_VALUE, deviation: Number.MAX_VALUE })).toThrow(RangeError);
  expect(cached.state.continuation.word).toBe(initial.continuation.word);
  expect(cached.state.continuation.gaussian).toBeNull();
  const drawn = Random.create({ seed: 1 });
  expect(() => drawn.number({ ...normal, mean: Number.MAX_VALUE, deviation: Number.MAX_VALUE })).toThrow(RangeError);
  expect(drawn.state.continuation.word).not.toBe(initial.continuation.word);
  expect(drawn.state.continuation.gaussian).not.toBeNull();
});

test("a deterministic normal sample has finite values and plausible first two moments", () => {
  const random = Random.create({ seed: 2026 });
  let sum = 0, squareSum = 0, finite = true;
  const count = 50_000;
  for (let i = 0; i < count; i++) {
    const value = random.number({ ...normal, mean: 7, deviation: 2 });
    finite &&= Number.isFinite(value);
    sum += value;
    squareSum += value * value;
  }
  const mean = sum / count;
  const variance = squareSum / count - mean * mean;
  expect(finite).toBe(true);
  expect(Math.abs(mean - 7)).toBeLessThan(0.04);
  expect(Math.abs(variance - 4)).toBeLessThan(0.08);
});
