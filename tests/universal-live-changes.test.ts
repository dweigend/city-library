import { describe, expect, test } from "bun:test";
import { defineUI } from "../ui/index.ts";
import type { Definition } from "../experiments/definition.ts";
import { normalizeAuthoring } from "../ui/authoring.ts";

interface Parameters { amount: number; enabled: boolean; mode: "quiet" | "busy" }
function create() {
  let parameters: Parameters = { amount: 2, enabled: true, mode: "quiet" };
  return {
    apply(changes: Partial<Parameters>) { parameters = { ...parameters, ...changes }; },
    read: () => ({ parameters: { ...parameters } }),
    advance() {},
  };
}
const definition: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Explicit live writes",
  inputs: {
    amount: { kind: "number", default: 2, min: 0, max: 10, integer: true },
    enabled: { kind: "boolean", default: true },
    mode: { kind: "choice", default: "quiet", options: ["quiet", "busy"] },
  },
  create,
};

describe("explicit live-change default", () => {
  test("declarations stay inert and normalized fields dispatch fresh single-key records", () => {
    const calls: Partial<Parameters>[] = [];
    const spec = {
      change(instance: ReturnType<typeof create>, changes: Partial<Parameters>) {
        calls.push(changes); instance.apply(changes);
      },
      live: { amount: {}, enabled: {}, mode: {} }, views: [],
    };
    defineUI(definition, spec);
    expect(calls).toEqual([]);
    const normalized = normalizeAuthoring(definition, spec);
    expect(normalized.setup).toEqual([]);
    expect(calls).toEqual([]);
    const instance = create();
    normalized.live[0]!.set(instance, 4);
    normalized.live[1]!.set(instance, false);
    normalized.live[2]!.set(instance, "busy");
    expect(calls).toEqual([{ amount: 4 }, { enabled: false }, { mode: "busy" }]);
    expect(calls.map(Object.keys)).toEqual([["amount"], ["enabled"], ["mode"]]);
    expect(calls[0]).not.toBe(calls[1]);
    expect(instance.read().parameters).toEqual({ amount: 4, enabled: false, mode: "busy" });
  });

  test("descriptor errors prevent both default and local actions", () => {
    let calls = 0;
    const normalized = normalizeAuthoring(definition, {
      change() { calls++; }, live: { amount: {}, mode: {}, enabled: {} }, views: [],
    });
    const instance = create();
    for (const value of [NaN, Infinity, "4", -1, 11, 2.5]) {
      expect(() => normalized.live[0]!.set(instance, value)).toThrow();
    }
    expect(() => normalized.live[1]!.set(instance, "unknown")).toThrow(RangeError);
    expect(() => normalized.live[2]!.set(instance, 1)).toThrow(TypeError);
    expect(calls).toBe(0);
    expect(instance.read().parameters.amount).toBe(2);
  });

  test("a binding override wins while the common action remains available to other fields", () => {
    let defaults = 0;
    let overrides = 0;
    const normalized = normalizeAuthoring(definition, {
      change(instance, changes) { defaults++; instance.apply(changes); },
      live: {
        amount: { set(instance, value) { overrides++; instance.apply({ amount: value * 2 }); } },
        enabled: {},
      }, views: [],
    });
    const instance = create();
    normalized.live[0]!.set(instance, 4);
    normalized.live[1]!.set(instance, false);
    expect([defaults, overrides]).toEqual([1, 1]);
    expect(normalized.live[0]!.value(instance.read())).toBe(8);
    expect(normalized.live[1]!.value(instance.read())).toBe(false);
  });

  test("legacy arrays require their own setter and cannot acquire a common default", () => {
    const legacy = [{ field: "amount" as const, value: (state: ReturnType<ReturnType<typeof create>["read"]>) => state.parameters.amount,
      set: (instance: ReturnType<typeof create>, value: string | number | boolean) => instance.apply({ amount: Number(value) }) }];
    expect(() => normalizeAuthoring(definition, { change() {}, live: legacy, views: [] })).toThrow(TypeError);
    const old = normalizeAuthoring(definition, { live: legacy, views: [] });
    const instance = create(); old.live[0]!.set(instance, 5);
    expect(instance.read().parameters.amount).toBe(5);
    expect(() => normalizeAuthoring(definition, { live: { amount: {} }, views: [] })).toThrow("Missing setter for amount");
    expect(() => normalizeAuthoring(definition, { change: 1, live: { amount: {} }, views: [] } as never)).toThrow(TypeError);
    expect(() => normalizeAuthoring(definition, { change() {}, live: { amount: { set: null } }, views: [] } as never)).toThrow(TypeError);
  });

  test("decoded changes preserve exact special input keys without prototype mutation", () => {
    interface Special { __proto__: number }
    const special: Definition<Special, ReturnType<typeof create>> = {
      title: "Exact own keys", create,
      inputs: { ["__proto__"]: { kind: "number", default: 1, integer: true } },
    };
    const calls: Partial<Special>[] = [];
    const normalized = normalizeAuthoring(special, {
      change(_instance, changes) { calls.push(changes); },
      live: { ["__proto__"]: { value: () => 1 } }, views: [],
    });
    normalized.live[0]!.set(create(), 3);
    expect(Object.keys(calls[0]!)).toEqual(["__proto__"]);
    expect(Object.getPrototypeOf(calls[0])).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(calls[0], "__proto__")?.value).toBe(3);
  });
});
