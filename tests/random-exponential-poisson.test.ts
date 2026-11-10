import { expect, test } from "bun:test";
import { Random, World } from "city-library";
import { exponentialDraw } from "../src/random/distributions/exponential.ts";
import { poissonDraw, logFactorial } from "../src/random/distributions/poisson.ts";

function supplied(values: readonly number[]) {
  let count = 0;
  return {
    draw() {
      if (count >= values.length) throw new Error("Unexpected additional uniform request.");
      return values[count++]!;
    },
    get count() { return count; },
  };
}
function logSum(n: number): number {
  // Independent reverse-order compensated finite sum, not the runtime recurrence/asymptotic series.
  let sum = 0, correction = 0;
  for (let k = n; k >= 2; k--) {
    const term = Math.log(k) - correction;
    const next = sum + term;
    correction = (next - sum) - term;
    sum = next;
  }
  return sum;
}

test("both closed option branches reject wrong types/ranges/keys before word or normal cache changes", () => {
  const random = Random.create({ seed: 81 });
  random.number({ distribution: "normal" });
  const before = random.state;
  for (const distribution of ["exponential", "poisson"] as const) {
    for (const mean of [null, false, "1", {}, 1n]) {
      expect(() => random.number({ distribution, mean } as never)).toThrow(TypeError);
      expect(random.state).toEqual(before);
    }
    for (const mean of [-Number.MIN_VALUE, NaN, Infinity, -Infinity]) {
      expect(() => random.number({ distribution, mean })).toThrow(RangeError);
      expect(random.state).toEqual(before);
    }
    for (const key of ["min", "max", "integer", "deviation", "shape", "rate", "lambda", "foreign"]) {
      expect(() => random.number({ distribution, [key]: undefined } as never)).toThrow(TypeError);
      expect(random.state).toEqual(before);
    }
    for (const mean of [0, -0]) {
      expect(Object.is(random.number({ distribution, mean }), 0)).toBe(true);
      expect(random.state).toEqual(before);
    }
    const omitted = random.copy(), explicit = random.copy();
    expect(omitted.number({ distribution, mean: undefined })).toBe(explicit.number({ distribution, mean: 1 }));
    expect(omitted.state).toEqual(explicit.state);
  }
  expect(() => random.number({ distribution: "poisson", mean: 100000.00001 })).toThrow(RangeError);
  let calls = 0;
  for (const key of ["distribution", "mean"]) {
    const options = Object.defineProperty({ distribution: "exponential" }, key, { get() { calls++; return 1; } });
    expect(() => random.number(options as never)).toThrow(TypeError);
  }
  expect(() => random.number({ distribution: "poisson", [Symbol("extra")]: 1 } as never)).toThrow(TypeError);
  expect(() => (random.number as Function)({ distribution: "exponential" }, {})).toThrow(TypeError);
  expect(calls).toBe(0);
  expect(random.state).toEqual(before);
});

test("exponential keeps literal log transform, signed zero, finite underflow and post-draw overflow", () => {
  const zero = supplied([0]);
  expect(Object.is(exponentialDraw({ distribution: "exponential", mean: 2 }, zero.draw), -0)).toBe(true);
  expect(zero.count).toBe(1);
  const underflow = supplied([0.01]);
  expect(exponentialDraw({ distribution: "exponential", mean: Number.MIN_VALUE }, underflow.draw)).toBe(0);
  const endpoint = supplied([1 - 2 ** -32]);
  expect(exponentialDraw({ distribution: "exponential", mean: 2 / Math.LN2 }, endpoint.draw)).toBe((-2 / Math.LN2) * Math.log(2 ** -32));
  expect(endpoint.count).toBe(1);
  const random = Random.create({ seed: 2 }), control = random.copy();
  control.number();
  expect(() => random.number({ distribution: "exponential", mean: Number.MAX_VALUE })).toThrow(RangeError);
  expect(random.state).toEqual(control.state);
});

test("positive small-mean product is do-first, equality/zero stop, and zero mean never requests a draw", () => {
  for (const mean of [0, -0]) expect(poissonDraw({ distribution: "poisson", mean }, () => { throw new Error("draw"); })).toBe(0);
  const tiny = supplied([0.999]);
  expect(poissonDraw({ distribution: "poisson", mean: Number.MIN_VALUE }, tiny.draw)).toBe(0);
  expect(tiny.count).toBe(1);
  const equal = supplied([Math.exp(-1)]);
  expect(poissonDraw({ distribution: "poisson", mean: 1 }, equal.draw)).toBe(0);
  expect(equal.count).toBe(1);
  const zero = supplied([0]);
  expect(poissonDraw({ distribution: "poisson", mean: 29.999999999999996 }, zero.draw)).toBe(0);
  expect(zero.count).toBe(1);
  // Underflow of a multiplied product is ordinary stopping, not an error or rollback.
  const underflow = supplied([0.99, Number.MIN_VALUE]);
  expect(poissonDraw({ distribution: "poisson", mean: 29 }, underflow.draw)).toBe(1);
  expect(underflow.count).toBe(2);
});

test("log-factorial agrees with independent finite sums across the table boundary and admitted scales", () => {
  for (const n of [0, 1, 2, 9, 10, 64, 254, 255, 256, 257, 1000, 100000]) {
    const expected = logSum(n);
    expect(Math.abs(logFactorial(n) - expected)).toBeLessThanOrEqual(8 * Number.EPSILON * Math.max(1, Math.abs(expected)));
  }
  // Decimal65 finite sums computed independently with Python Decimal.ln, rounded here to Number.
  for (const [n, expected] of [[10, 15.104412573075515295], [255, 1161.712101118400650788], [256, 1167.257278562880213263], [1000, 5912.128178488163348878]])
    expect(Math.abs(logFactorial(n!) - expected!)).toBeLessThanOrEqual(8 * Number.EPSILON * expected!);
});

test("PTRS consumes U then V, rejects us0/negative/tail proposals, and permits V0", () => {
  for (const rejected of [[0, 0.5], [0.0001, 0], [0.9999, 0.1]]) {
    const input = supplied([...rejected, 0.5, 0.5]);
    expect(poissonDraw({ distribution: "poisson", mean: 30 }, input.draw)).toBe(30);
    expect(input.count).toBe(4);
  }
  const zeroV = supplied([0.9999, 0]);
  expect(poissonDraw({ distribution: "poisson", mean: 30 }, zeroV.draw)).toBe(3119);
  expect(zeroV.count).toBe(2); // log(0)=-Infinity accepts after the preceding guards, no output-mean clamp.
  const ordered = supplied([0.9, 0.2]);
  expect(poissonDraw({ distribution: "poisson", mean: 30 }, ordered.draw)).toBe(38);
  expect(ordered.count).toBe(2);
});

test("PTRS uses printed .43 and inclusive squeeze boundaries, not Table1/PTRD .445", () => {
  const printedOffset = supplied([0.5, 0.5]);
  expect(poissonDraw({ distribution: "poisson", mean: 30.56 }, printedOffset.draw)).toBe(30); // floor(30.56+.43), whereas+.445 yields31.
  const b = 0.931 + 2.53 * Math.sqrt(30);
  const vr = 0.9277 - 3.6224 / (b - 2);
  const squeeze = supplied([0.07, vr]);
  expect(poissonDraw({ distribution: "poisson", mean: 30 }, squeeze.draw)).toBe(20);
  expect(squeeze.count).toBe(2);
});

test("PTRS log acceptance straddles an independently summed Poisson mass boundary", () => {
  // U=.9 gives k38/us~.1 at mean30; probability mass uses an independent finite-log sum.
  const mean = 30, us = 0.5 - Math.abs(0.9 - 0.5), k = 38;
  const b = 0.931 + 2.53 * Math.sqrt(mean), a = -0.059 + 0.02483 * b;
  const invAlpha = 1.1239 + 1.1328 / (b - 3.4);
  const mass = Math.exp(-mean + k * Math.log(mean) - logSum(k));
  const boundary = mass * (a / (us * us) + b) / invAlpha;
  expect(boundary).toBeGreaterThan(0.89); expect(boundary).toBeLessThan(0.92);
  const accept = supplied([0.9, boundary * (1 - 1e-8)]);
  expect(poissonDraw({ distribution: "poisson", mean }, accept.draw)).toBe(38);
  expect(accept.count).toBe(2);
  const reject = supplied([0.9, boundary * (1 + 1e-8), 0.5, 0.5]);
  expect(poissonDraw({ distribution: "poisson", mean }, reject.draw)).toBe(30);
  expect(reject.count).toBe(4);
});

test("PTRS has no inherited million-attempt retry cap", () => {
  let consumed = 0;
  const rejected = 1_000_001;
  const value = poissonDraw({ distribution: "poisson", mean: 30 }, () => {
    const index = consumed++;
    return index < 2 * rejected ? (index % 2 === 0 ? 0 : 0.5) : 0.5;
  });
  expect(value).toBe(30); expect(consumed).toBe(2 * rejected + 2);
});

test("mixed distributions preserve cached normal, copy/local/state and World ownership", () => {
  const random = Random.create({ seed: 2026 }); random.number({ distribution: "normal" });
  const before = random.state, twin = random.copy(), world = World.create({ random });
  const values = random.local(() => [random.number({ distribution: "poisson", mean: 150 }), random.number({ distribution: "exponential", mean: 2 / Math.LN2 })]);
  expect(values).toEqual([twin.number({ distribution: "poisson", mean: 150 }), twin.number({ distribution: "exponential", mean: 2 / Math.LN2 })]);
  expect(random.state).toEqual(before);
  random.number({ distribution: "poisson", mean: 150 });
  random.number({ distribution: "exponential" });
  expect(random.state.continuation.gaussian).toBe(before.continuation.gaussian);
  const snapshot = random.state;
  const expected = random.number({ distribution: "poisson", mean: 30 });
  random.state = JSON.parse(JSON.stringify(snapshot));
  expect(random.number({ distribution: "poisson", mean: 30 })).toBe(expected);
  expect(world.random).toBe(random); expect(world.tick.value).toBe(0); expect(world.agents.length).toBe(0);
});

test("high-mean Poisson samples match independently computed mode masses and analytical moments", () => {
  for (const mean of [30, 150, 100000]) {
    const random = Random.create({ seed: 20261106 });
    const count = 80000;
    let sum = 0, squares = 0, modeCount = 0, supported = true;
    for (let index = 0; index < count; index++) {
      const value = random.number({ distribution: "poisson", mean });
      supported &&= Number.isSafeInteger(value) && value >= 0;
      sum += value; squares += (value - mean) ** 2;
      if (value === mean) modeCount++;
    }
    const mass = Math.exp(-mean + mean * Math.log(mean) - logSum(mean));
    expect(supported).toBe(true);
    expect(Math.abs(sum / count - mean)).toBeLessThan(8 * Math.sqrt(mean / count));
    expect(Math.abs(squares / count / mean - 1)).toBeLessThan(0.05);
    expect(Math.abs(modeCount / count - mass)).toBeLessThan(8 * Math.sqrt(mass * (1 - mass) / count));
  }
});
