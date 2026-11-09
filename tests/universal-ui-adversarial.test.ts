import { describe, expect, test } from "bun:test";
import { collectionDiagram, defineUI, scientificPalette, type CollectionRow, type SpatialData, type ChangeUISpec } from "../ui/index.ts";
import { collectionDiagram as svelteCollectionDiagram, defineUI as defineSvelteUI } from "../ui/svelte/index.ts";
import type { Definition } from "../experiments/definition.ts";
import { normalizeAuthoring } from "../ui/authoring.ts";
import { tablePage, tablePageSize } from "../ui/views/table-page.ts";
import { validateCanvasData } from "../ui/views/spatial-data.ts";

interface Rules { "flow-rate": number; enabled: boolean; mode: "finite" | "continuous" }
function createRules() {
  let parameters: Rules = { "flow-rate": 2, enabled: true, mode: "finite" };
  let tick = 0;
  return {
    apply(changes: Partial<Rules>) { parameters = { ...parameters, ...changes }; },
    advance() { tick++; },
    read: () => ({ tick, parameters: { ...parameters } }),
  };
}
const rules: Definition<Rules, ReturnType<typeof createRules>> = {
  title: "Independent exact rule edits",
  inputs: {
    "flow-rate": { kind: "number", default: 2, min: 0, max: 4, integer: true },
    enabled: { kind: "boolean", default: true },
    mode: { kind: "choice", default: "finite", options: ["finite", "continuous"] },
  },
  create: createRules,
};

const identified = (scene: SpatialData) => scene.agents.filter(agent => agent.selectable !== false);

describe("independent universal UI public consumers", () => {
  test("both entries expose one pure collection capability and keep declarations inert", () => {
    expect(svelteCollectionDiagram).toBe(collectionDiagram);
    let creations = 0;
    const definition = { ...rules, create() { creations++; return createRules(); } };
    const spec = {
      change: (instance, changes) => instance.apply(changes),
      live: { "flow-rate": {}, enabled: {} }, views: [],
    } satisfies ChangeUISpec<Rules, ReturnType<typeof createRules>>;
    expect(defineUI(definition, spec).title).toBe(rules.title);
    expect(defineSvelteUI(definition, spec).title).toBe(rules.title);
    expect(creations).toBe(0);
  });

  test("decoded default writes are single own-key records with local precedence and no step", () => {
    const writes: Partial<Rules>[] = [];
    let overrides = 0;
    // Both public consumers above accept this same contract. The host boundary is
    // exercised directly here; DOM dispatch remains the independent browser gate.
    const spec = {
      change(instance, changes) { writes.push(changes); instance.apply(changes); },
      live: {
        "flow-rate": {},
        enabled: { set(instance, value) { overrides++; instance.apply({ enabled: !value }); } },
        mode: {},
      }, views: [],
    } satisfies ChangeUISpec<Rules, ReturnType<typeof createRules>>;
    const normalized = normalizeAuthoring(rules, spec);
    const first = createRules();
    const independent = createRules();
    normalized.live[0]!.set(first, 4);
    normalized.live[2]!.set(first, "continuous");
    normalized.live[1]!.set(first, false);
    expect(writes).toEqual([{ "flow-rate": 4 }, { mode: "continuous" }]);
    expect(writes.map(Reflect.ownKeys)).toEqual([["flow-rate"], ["mode"]]);
    expect(writes[0]).not.toBe(writes[1]);
    expect(Object.getPrototypeOf(writes[0])).toBe(Object.prototype);
    expect(overrides).toBe(1);
    expect(first.read()).toEqual({ tick: 0, parameters: { "flow-rate": 4, enabled: true, mode: "continuous" } });
    expect(independent.read()).toEqual({ tick: 0, parameters: { "flow-rate": 2, enabled: true, mode: "finite" } });
    for (const value of [NaN, Infinity, -1, 5, 2.5, "3", false])
      expect(() => normalized.live[0]!.set(first, value)).toThrow();
    expect(() => normalized.live[2]!.set(first, "unknown")).toThrow(RangeError);
    expect(() => normalized.live[1]!.set(first, "false")).toThrow(TypeError);
    expect(writes).toHaveLength(2);
    expect(overrides).toBe(1);
    expect(() => normalizeAuthoring(rules, { change() {}, live: { missing: {} }, views: [] } as never)).toThrow("Unknown input: missing");
    const legacy = {
      live: [{ field: "flow-rate" as const, value: (state: ReturnType<ReturnType<typeof createRules>["read"]>) => state.parameters["flow-rate"],
        set: (instance: ReturnType<typeof createRules>, value: string | number | boolean) => instance.apply({ "flow-rate": Number(value) }) }], views: [],
    };
    expect(() => normalizeAuthoring(rules, { ...legacy, change() {} } as never)).toThrow(TypeError);
    const old = normalizeAuthoring(rules, legacy);
    old.live[0]!.set(first, 1);
    expect(first.read().parameters["flow-rate"]).toBe(1);
    expect(writes).toHaveLength(2);
  });

  test("collection schema rejects unions, unknown fields, sparse arrays and accessors atomically", () => {
    let reads = 0;
    const inherited = Object.create({ get id() { reads++; return "inherited"; } });
    Object.assign(inherited, { label: "No inherited identity", kind: "count", count: 1 });
    const getter = Object.defineProperty({ label: "Getter", kind: "items", items: [] }, "id", { get() { reads++; return "getter"; } });
    const itemGetter = { id: "items", label: "Items", kind: "items", items: [Object.defineProperty({}, "id", { get() { reads++; return "person"; } })] };
    const indexedGetter: unknown[] = [];
    Object.defineProperty(indexedGetter, "0", { get() { reads++; return { id: "n", label: "Count", kind: "count", count: 0 }; } });
    const symbolField = { id: "n", label: "Count", kind: "count", count: 0, [Symbol("hidden")]: 1 };
    const invalid: unknown[] = [
      undefined, null, {}, [undefined], [inherited], [getter], [itemGetter], indexedGetter, new Array(2), [symbolField],
      [{ id: "n", label: "Count", kind: "count", count: 1, capacity: undefined }],
      [{ id: "n", label: "Capacity", kind: "capacity", used: 1, capacity: 1, unit: "units", items: undefined }],
      [{ id: "n", label: "Items", kind: "items", items: [], order: "priority" }],
      [{ id: "n", label: "Items", kind: "items", items: [{ id: "p", selectable: false }] }],
      [{ id: "n", label: "Items", kind: "items", items: [{ id: "p", shape: "star" }] }],
      [{ id: "n", label: " ", kind: "count", count: 0 }],
      [{ id: "n", label: "Kind", kind: new String("count"), count: 0 }],
    ];
    for (const input of invalid) expect(() => collectionDiagram(input as never)).toThrow(TypeError);
    expect(reads).toBe(0);
    expect(() => collectionDiagram([{ id: "same", label: "One", kind: "items", items: [{ id: "p" }, { id: "p" }] }])).toThrow(RangeError);
    const scene = collectionDiagram([{ id: "n", label: "Count", kind: "count", count: 0 }]);
    expect(scene.description).toBe("Count: 0.");
    expect(identified(scene)).toEqual([]);
  });

  test("inherited array methods, iterators and species cannot erase identified items", () => {
    let reads = 0;
    const poison = () => { reads++; throw new Error("Array prototype code must not execute"); };
    function guarded<T>(values: readonly T[]): T[] {
      const copy = [...values];
      const prototype = Object.create(Array.prototype);
      for (const key of ["map", "constructor", Symbol.iterator])
        Object.defineProperty(prototype, key, { get: poison });
      Object.setPrototypeOf(copy, prototype);
      return copy;
    }
    const items = guarded([{ id: "person:2" }, { id: "person:1" }]);
    const rows = guarded([{ id: "queue", label: "Actual order", kind: "items" as const, order: "supplied" as const, items }]);
    const scene = collectionDiagram(rows);
    expect(identified(scene).map(agent => agent.id)).toEqual(["person:2", "person:1"]);
    expect(reads).toBe(0);
    class ItemArray extends Array<{ id: string }> {
      static override get [Symbol.species]() { reads++; return Array; }
    }
    const speciesItems = new ItemArray(); speciesItems.push({ id: "person:3" });
    expect(identified(collectionDiagram([{ id: "other", label: "Species", kind: "items", items: speciesItems }])).map(agent => agent.id))
      .toEqual(["person:3"]);
    expect(reads).toBe(0);
  });

  test("detached rows preserve supplied identity, overrides and capacity without invented assignment", () => {
    const rows: CollectionRow[] = [
      { id: "waiting", label: "Waiting", kind: "items", order: "supplied", color: scientificPalette.waiting,
        items: [{ id: "person:9", shape: "diamond" }, { id: "person:2", shape: "circle", color: scientificPalette.active }] },
      { id: "capacity", label: "Retained claims", kind: "capacity", used: 3, capacity: 1, unit: "seats" },
      { id: "empty", label: "Empty set", kind: "items", items: [] },
    ];
    const before = structuredClone(rows);
    const scene = collectionDiagram(rows);
    expect(identified(scene).map(agent => agent.id)).toEqual(["person:9", "person:2"]);
    expect(identified(scene).map(agent => agent.color)).toEqual([scientificPalette.waiting, scientificPalette.active]);
    expect(identified(scene).map(agent => agent.shape)).toEqual(["diamond", "circle"]);
    expect(scene.description).toContain("3 of 1 seats; 2 excess above capacity");
    expect(scene.description).toContain("Empty set: 0 items (unordered)");
    const anonymous = scene.agents.filter(agent => agent.selectable === false);
    expect(anonymous).toHaveLength(3);
    expect(anonymous.filter(agent => agent.color === scientificPalette.unavailable)).toHaveLength(2);
    Object.assign(scene.agents[0]!, { id: "changed", color: "changed" });
    Object.assign(scene.labels![0]!, { text: "changed" });
    expect(rows).toEqual(before);
    expect(identified(collectionDiagram(rows)).map(agent => agent.id)).toEqual(["person:9", "person:2"]);
    const decorationId = anonymous[0]!.id;
    expect(() => collectionDiagram([...rows, { id: "collision", label: "Collision", kind: "items", items: [{ id: decorationId }] }])).toThrow(RangeError);
  });

  test("fractional, zero, huge and retained quantities stay explicit without fake selectable stock", () => {
    for (const [used, capacity] of [[0, 0], [0.25, 0], [2.75, 1.5], [Number.MIN_VALUE, Number.MAX_VALUE], [Number.MAX_VALUE, Number.MIN_VALUE]]) {
      const rows: CollectionRow[] = [{ id: "capacity", label: "Allocation", kind: "capacity", used: used!, capacity: capacity!, unit: "allocation units" }];
      const before = structuredClone(rows);
      const scene = collectionDiagram(rows);
      expect(scene.description).toContain(`${used} of ${capacity} allocation units`);
      expect(identified(scene)).toEqual([]);
      expect(scene.agents.every(agent => Number.isFinite(agent.x) && Number.isFinite(agent.y) &&
        (!agent.extent || Number.isFinite(agent.extent.width) && agent.extent.width > 0))).toBe(true);
      expect(scene.agents.length).toBeLessThanOrEqual(32);
      expect(scene.description?.includes("excess")).toBe(used! > capacity!);
      expect(rows).toEqual(before);
    }
    for (const count of [0, 1200, Number.MAX_SAFE_INTEGER]) {
      const scene = collectionDiagram([{ id: "count", label: "Completed", kind: "count", count }]);
      expect(scene.description).toContain(String(count));
      expect(scene.agents).toEqual([]);
    }
    for (const value of [-1, -Infinity, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1, 0.25])
      expect(() => collectionDiagram([{ id: "count", label: "Count", kind: "count", count: value }])).toThrow(RangeError);
    expect(collectionDiagram([]).description).toBe("No collections");
  });

  test("1200 identified items remain ordered, unique, inside bounds and selectable by default", () => {
    const items = Array.from({ length: 1200 }, (_, index) => ({ id: `person:${1200 - index}` }));
    const scene = collectionDiagram([{ id: "all", label: "Every actual person is retained without a population cap", kind: "items", items, order: "supplied" }]);
    expect(identified(scene)).toHaveLength(1200);
    expect(new Set(scene.agents.map(agent => agent.id)).size).toBe(1200);
    expect(scene.agents.map(agent => agent.id)).toEqual(items.map(item => item.id));
    expect(scene.agents.every(agent => agent.selectable !== false && agent.color === scientificPalette.neutral && agent.shape === "rectangle")).toBe(true);
    for (const agent of scene.agents) {
      expect(Number.isFinite(agent.x) && Number.isFinite(agent.y)).toBe(true);
      expect(Math.abs(agent.x) + agent.extent!.width / 2).toBeLessThanOrEqual(scene.width / 2);
      expect(Math.abs(agent.y) + agent.extent!.height / 2).toBeLessThanOrEqual(scene.height / 2);
    }
    expect(collectionDiagram([{ id: "all", label: "All", kind: "items", items }]).description).toContain("unordered");
  });
});

describe("shared host-boundary regressions, separate from public browser acceptance", () => {
  test("selectable defaults remain compatible and invalid primitive flags reject", () => {
    const data: SpatialData = { width: 4, height: 4, agents: [
      { id: "old", x: 0, y: 0 }, { id: "decoration", x: 1, y: 0, selectable: false },
    ] };
    expect(() => validateCanvasData(data)).not.toThrow();
    expect(data.agents[0]!.selectable).toBeUndefined();
    for (const selectable of [0, 1, "false", null])
      expect(() => validateCanvasData({ ...data, agents: [{ id: "wrong", x: 0, y: 0, selectable }] } as never)).toThrow(TypeError);
  });

  test("200-row pages preserve every actual row at boundaries, clamp and never mutate data", () => {
    expect(tablePageSize).toBe(200);
    for (const count of [0, 1, 199, 200, 201, 400, 401, 1200]) {
      const rows = Object.freeze(Array.from({ length: count }, (_, index) => Object.freeze({ id: `item:${index}`, value: index - 200 })));
      const pages = Math.max(1, Math.ceil(count / 200));
      const collected = [];
      for (let page = 0; page < pages; page++) {
        const visible = tablePage(rows, page);
        collected.push(...visible.rows);
        expect(visible.page).toBe(page);
        expect(visible.previous).toBe(page > 0);
        expect(visible.next).toBe(page + 1 < pages);
        expect(visible.paged).toBe(count > 200);
        expect(visible.rows.length).toBe(Math.min(200, Math.max(0, count - page * 200)));
        expect(visible.range).toBe(count ? `${page * 200 + 1}–${Math.min((page + 1) * 200, count)} of ${count}` : "No rows");
        expect(visible.rows).not.toBe(rows);
      }
      expect(collected).toEqual([...rows]);
      expect(tablePage(rows, -Number.MAX_SAFE_INTEGER).page).toBe(0);
      expect(tablePage(rows, Number.MAX_SAFE_INTEGER).page).toBe(pages - 1);
      expect(rows).toHaveLength(count);
    }
    const rows = [{ id: "one", value: -1 }, { id: "two", value: 0 }];
    expect(tablePage(rows, 2).rows).toEqual(rows);
    expect(tablePage([], 2).range).toBe("No rows");
  });
});
