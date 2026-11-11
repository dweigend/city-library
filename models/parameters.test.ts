import { expect, test } from "bun:test";
import type { Inputs } from "./definition.ts";
import { parseParameters, updateParameters } from "./parameters.ts";

interface Example { rate: number; mode: "a" | "b"; count: number }
const inputs: Inputs<Example> = {
  rate: { kind: "number", default: 0.5, min: 0, max: 1 },
  mode: { kind: "choice", default: "a", options: ["a", "b"] },
  count: { kind: "number", default: 3, min: 0, max: 10, integer: true },
};
const current = parseParameters(inputs, { rate: 0.9, mode: "b" });

test("omitted keys keep current values and the result is a new frozen record", () => {
  const next = updateParameters(inputs, current, { rate: 0.2 }, ["rate", "mode"]);
  expect(next).toEqual({ rate: 0.2, mode: "b", count: 3 });
  expect(Object.isFrozen(next)).toBe(true);
  expect(current.rate).toBe(0.9);
  expect(updateParameters(inputs, current, {}, ["rate"])).toEqual(current);
});

test("explicit undefined, unknown, setup-only and accessor keys throw TypeError", () => {
  expect(() => updateParameters(inputs, current, { rate: undefined }, ["rate"])).toThrow(TypeError);
  expect(() => updateParameters(inputs, current, { count: 2 } as never, ["rate"])).toThrow(TypeError);
  expect(() => updateParameters(inputs, current, { other: 1 } as never, ["rate"])).toThrow(TypeError);
  let invoked = false;
  const accessor = Object.defineProperty({}, "rate", { get() { invoked = true; return 0.1; }, enumerable: true });
  expect(() => updateParameters(inputs, current, accessor, ["rate"])).toThrow(TypeError);
  expect(invoked).toBe(false);
  expect(() => updateParameters(inputs, current, null as never, ["rate"])).toThrow(TypeError);
  expect(() => updateParameters(inputs, current, [] as never, ["rate"])).toThrow(TypeError);
});

test("range and choice errors come from the canonical descriptors", () => {
  expect(() => updateParameters(inputs, current, { rate: 2 }, ["rate"])).toThrow(RangeError);
  expect(() => updateParameters(inputs, current, { mode: "c" as never }, ["mode"])).toThrow(RangeError);
  expect(() => updateParameters(inputs, current, { rate: "0.2" as never }, ["rate"])).toThrow(TypeError);
});

test("parseParameters keeps its setup semantics: undefined still means default", () => {
  expect(parseParameters(inputs, { rate: undefined })).toEqual({ rate: 0.5, mode: "a", count: 3 });
});
