import { frameworkRecord, registerFramework } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { normalizeSeed, snapshot, validateState, type RandomState, type StreamState } from "./continuation.ts";
import { sample, type SampleOptions } from "./sampling.ts";
import { uniformDraw, type UniformOptions } from "./uniform.ts";
import { normalDraw, polarGaussian, type NormalOptions } from "./normal.ts";
import { exponentialDraw } from "./distributions/exponential.ts";
import { poissonDraw } from "./distributions/poisson.ts";
import type { MeanOptions } from "./distributions/mean-options.ts";
import { bernoulliDraw, triangularDraw, gammaDraw, type DesDistributionOptions } from "./distributions/des.ts";
export interface Random {
  readonly algorithm: "mulberry32";
  readonly seed: number;
  state: RandomState;
  number(): number;
  number(options: UniformOptions): number;
  number(options: NormalOptions): number;
  number(options: MeanOptions): number;
  number(options: DesDistributionOptions): number;
  sample<T>(source: Iterable<T>, options?: SampleOptions<T>): T[];
  reseed(seed: number): void;
  copy(): Random;
  local<R>(action: () => R): R;
  raw(options: { kind: "double" }): number;
}
function add(options: { seed?: number; algorithm?: "mulberry32" } = {}): Random {
  if (arguments.length > 1) throw new TypeError("Unexpected Random arguments.");
  const values = validateOptions(options, ["seed", "algorithm"]);
  if (values.algorithm !== undefined && values.algorithm !== "mulberry32") throw new TypeError("This slice supports mulberry32 only.");
  const seed = normalizeSeed(values.seed === undefined ? 1 : values.seed);
  let state: StreamState = { seed, word: seed, gaussian: null };
  let mainCheckpoint: StreamState | undefined;
  function draw(): number {
    state.word = (state.word + 0x6d2b79f5) >>> 0;
    let value = state.word;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  }
  function gaussian(): number {
    if (state.gaussian !== null) {
      const value = state.gaussian;
      state.gaussian = null;
      return value;
    }
    const pair = polarGaussian(draw);
    state.gaussian = pair.companion;
    return pair.value;
  }
  const random: Random = {
    algorithm: "mulberry32",
    get seed() { return state.seed; },
    get state() { return snapshot(state); },
    set state(value: RandomState) { state = validateState(value); },
    number(options: UniformOptions | NormalOptions | MeanOptions | DesDistributionOptions = {}) {
      if (arguments.length > 1) throw new TypeError("Unexpected number arguments.");
      // Inspect only validated data: even a distribution getter must not run.
      const record = validateOptions(options, ["distribution", "min", "max", "integer", "mean", "deviation", "probability", "mode", "shape", "rate"]);
      switch (record.distribution) {
        case "normal": return normalDraw(record, gaussian);
        case "exponential": return exponentialDraw(record, draw);
        case "poisson": return poissonDraw(record, draw);
        case "bernoulli": return bernoulliDraw(record, draw);
        case "triangular": return triangularDraw(record, draw);
        case "gamma": return gammaDraw(record, draw, gaussian);
        default: return uniformDraw(record, draw);
      }
    },
    sample<T>(source: Iterable<T>, options: SampleOptions<T> = {}) {
      if (arguments.length > 2) throw new TypeError("Unexpected sample arguments.");
      return sample(source, options, draw);
    },
    reseed(seed: number) {
      if (arguments.length !== 1) throw new TypeError("Reseed requires one seed.");
      const normalized = normalizeSeed(seed);
      state = { seed: normalized, word: normalized, gaussian: null };
    },
    copy() {
      if (arguments.length) throw new TypeError("Random.copy accepts no options.");
      const copied = add({ seed: state.seed });
      copied.state = snapshot(state);
      return copied;
    },
    local<R>(action: () => R): R {
      if (arguments.length !== 1) throw new TypeError("Local requires one callback.");
      if (typeof action !== "function" || ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"].includes(Object.prototype.toString.call(action))) throw new TypeError("Expected a synchronous local callback.");
      const predecessor = { ...state };
      const outermost = mainCheckpoint === undefined;
      if (outermost) mainCheckpoint = { ...predecessor };
      state = { ...mainCheckpoint! };
      try {
        const result = action();
        if (result !== null && (typeof result === "object" || typeof result === "function") && typeof (result as { then?: unknown }).then === "function") throw new TypeError("Thenable local results are unsupported.");
        return result;
      } finally {
        state = predecessor;
        if (outermost) mainCheckpoint = undefined;
      }
    },
    raw(options: { kind: "double" }) {
      if (arguments.length !== 1) throw new TypeError("Raw requires one options record.");
      const values = validateOptions(options, ["kind"]);
      if (values.kind !== "double") throw new TypeError("This slice supports raw double only.");
      return draw();
    },
  };
  registerFramework(random, "random");
  return Object.freeze(random);
}
export function isRandom(value: unknown): value is Random {
  return frameworkRecord(value)?.kind === "random";
}
export const Random = Object.freeze({ add });
