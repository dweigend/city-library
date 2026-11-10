import { describe, expect, test } from "bun:test";
import { collectionDiagram, scientificPalette, type CollectionRow } from "../ui/index.ts";

const selectable = (rows: readonly CollectionRow[]) => collectionDiagram(rows).agents.filter(agent => agent.selectable !== false);

describe("public collection diagrams", () => {
  test("identified item order, colors and detached output have one clear owner", () => {
    const rows: CollectionRow[] = [{ id: "queue", label: "Canonical queue", kind: "items", order: "supplied", color: scientificPalette.waiting,
      items: [{ id: "person:3", shape: "diamond" }, { id: "person:1", color: scientificPalette.active }] },
    { id: "done", label: "Completed", kind: "items", items: [] }];
    const before = structuredClone(rows);
    const scene = collectionDiagram(rows);
    expect(scene.agents.map(agent => agent.id)).toEqual(["person:3", "person:1"]);
    expect(scene.agents.map(agent => agent.color)).toEqual([scientificPalette.waiting, scientificPalette.active]);
    expect(scene.agents[0]!.shape).toBe("diamond");
    expect(scene.description).toContain("supplied order");
    expect(scene.description).toContain("Completed: 0");
    Object.assign(scene.agents[0]!, { color: "changed" });
    expect(rows).toEqual(before);
    expect(collectionDiagram(rows).agents[0]!.color).toBe(scientificPalette.waiting);
  });

  test("counts and capacity are exact quantities, not fake selected occupants", () => {
    for (const [used, capacity] of [[0, 0], [2, 1], [2.5, 2], [Number.MAX_VALUE, 0], [1e-300, Number.MAX_VALUE]]) {
      const scene = collectionDiagram([{ id: "capacity", label: "Allocation", kind: "capacity", used: used!, capacity: capacity!, unit: "allocation units" }]);
      expect(scene.description).toContain(String(used));
      expect(scene.description).toContain(String(capacity));
      expect(scene.description).toContain("allocation units");
      expect(scene.agents.every(agent => agent.selectable === false)).toBe(true);
      expect(scene.agents.every(agent => Number.isFinite(agent.x) && Number.isFinite(agent.y))).toBe(true);
      expect(scene.agents.length).toBeLessThanOrEqual(32);
      if (used! > capacity!) expect(scene.description).toContain("excess");
    }
    const count = collectionDiagram([{ id: "count", label: "Count", kind: "count", count: Number.MAX_SAFE_INTEGER }]);
    expect(count.description).toContain(String(Number.MAX_SAFE_INTEGER));
    expect(count.agents).toEqual([]);
    expect(collectionDiagram([])).toEqual({ width: 1, height: 1, agents: [], labels: [], showLabels: false, description: "No collections" });
  });

  test("large collections retain every identity and finite bounded coordinates", () => {
    const items = Array.from({ length: 1200 }, (_, index) => ({ id: `item:${index}` }));
    const scene = collectionDiagram([{ id: "all", label: "Every identified item remains inspectable", kind: "items", items }]);
    expect(scene.agents.map(agent => agent.id)).toEqual(items.map(item => item.id));
    expect(scene.agents.every(agent => Math.abs(agent.x) < scene.width / 2 && Math.abs(agent.y) < scene.height / 2)).toBe(true);
    expect(scene.labels!.every(label => label.text.length <= 24)).toBe(true);
    expect(scene.width).toBeGreaterThan(0); expect(scene.height).toBeGreaterThan(0);
  });

  test("invalid ranges, combinations, duplicate identities and unknown fields reject", () => {
    for (const count of [-1, 0.1, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1])
      expect(() => collectionDiagram([{ id: "n", label: "Count", kind: "count", count }])).toThrow(RangeError);
    const invalid: unknown[] = [null, {}, [null], [{ id: "n", label: "Count", kind: "count", count: "1" }],
      [{ id: "n", label: "Count", kind: "count", count: 1, items: undefined }],
      [{ id: "n", label: "Items", kind: "items", items: [], order: "fifo" }],
      [{ id: "n", label: "Items", kind: "items", items: [{ id: "i", shape: "hexagon" }] }],
      [{ id: "n", label: "Items", kind: "items", items: [], x: 1 }],
      [{ id: "n", label: "Capacity", kind: "capacity", used: 0, capacity: 0, unit: "" }]];
    for (const value of invalid) expect(() => collectionDiagram(value as never)).toThrow(TypeError);
    expect(() => collectionDiagram([{ id: "same", label: "One", kind: "count", count: 1 }, { id: "same", label: "Two", kind: "count", count: 2 }])).toThrow(RangeError);
    expect(() => selectable([{ id: "one", label: "One", kind: "items", items: [{ id: "same" }] }, { id: "two", label: "Two", kind: "items", items: [{ id: "same" }] }])).toThrow(RangeError);
    const capacity: CollectionRow = { id: "capacity", label: "Capacity", kind: "capacity", used: 1, capacity: 2, unit: "units" };
    const collision = collectionDiagram([capacity]).agents[0]!.id;
    expect(() => collectionDiagram([capacity, { id: "people", label: "People", kind: "items", items: [{ id: collision }] }])).toThrow(RangeError);
  });

  test("accessors never run, even inherited fields or array decorations", () => {
    let reads = 0;
    const getter = { get id() { reads++; return "id"; }, label: "Count", kind: "count", count: 1 };
    expect(() => collectionDiagram([getter] as never)).toThrow(TypeError);
    const inherited = Object.create({ get id() { reads++; return "id"; } });
    Object.assign(inherited, { label: "Count", kind: "count", count: 1 });
    expect(() => collectionDiagram([inherited] as never)).toThrow(TypeError);
    const input: unknown[] = [];
    Object.defineProperty(input, "0", { get() { reads++; return getter; } });
    expect(() => collectionDiagram(input as never)).toThrow(TypeError);
    const decorated: unknown[] = [];
    Object.defineProperty(decorated, "map", { value() { reads++; return []; } });
    expect(() => collectionDiagram(decorated as never)).toThrow(TypeError);
    expect(reads).toBe(0);
  });
});
