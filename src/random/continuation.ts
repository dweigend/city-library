import { validateOptions } from "../agent/state.ts";

export interface RandomState {
  readonly algorithm: "mulberry32";
  readonly seed: number;
  readonly continuation: {
    readonly algorithm: "mulberry32";
    readonly revision: "agent-loom-random/1";
    readonly word: number;
    readonly gaussian: number | null;
  };
}

export interface StreamState {
  seed: number;
  word: number;
  gaussian: number | null;
}

export function normalizeSeed(seed: unknown): number {
  if (typeof seed !== "number") throw new TypeError("Seed must be numeric.");
  if (!Number.isInteger(seed) || seed < -0x80000000 || seed > 0xffffffff) {
    throw new RangeError("Seed must be a signed/unsigned 32-bit integer.");
  }
  return seed >>> 0;
}

export function snapshot(state: StreamState): RandomState {
  return Object.freeze({
    algorithm: "mulberry32",
    seed: state.seed,
    continuation: Object.freeze({
      algorithm: "mulberry32",
      revision: "agent-loom-random/1",
      word: state.word,
      gaussian: state.gaussian,
    }),
  });
}

function requiredRecord(value: unknown, keys: readonly string[]): Record<string, unknown> {
  const result = validateOptions(value, keys);
  if (keys.some((key) => !Object.hasOwn(result, key))) throw new TypeError("Incomplete Random state.");
  return result;
}

export function validateState(value: unknown): StreamState {
  const outer = requiredRecord(value, ["algorithm", "seed", "continuation"]);
  const inner = requiredRecord(outer.continuation, ["algorithm", "revision", "word", "gaussian"]);
  if (outer.algorithm !== "mulberry32" || inner.algorithm !== "mulberry32" || inner.revision !== "agent-loom-random/1") {
    throw new TypeError("Random state must match the Mulberry algorithm revision.");
  }
  const seed = normalizeSeed(outer.seed);
  if (typeof inner.word !== "number") throw new TypeError("Continuation word must be numeric.");
  if (!Number.isInteger(inner.word) || inner.word < 0 || inner.word > 0xffffffff) throw new RangeError("Continuation word must be uint32.");
  if (inner.gaussian !== null && typeof inner.gaussian !== "number") throw new TypeError("Gaussian cache must be numeric or null.");
  if (inner.gaussian !== null && !Number.isFinite(inner.gaussian)) throw new RangeError("Gaussian cache must be finite.");
  return { seed, word: inner.word >>> 0, gaussian: inner.gaussian };
}
