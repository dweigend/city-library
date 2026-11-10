import type { SpatialAgent, SpatialData, SpatialLabel } from "../definition.ts";
import { scientificPalette } from "../palette/scientific.ts";

export interface CollectionItem {
  readonly id: string;
  readonly label?: string;
  readonly color?: string;
  readonly shape?: "circle" | "triangle" | "rectangle" | "diamond";
}
interface CollectionBase {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
}
export type CollectionRow = CollectionBase & (
  | { readonly kind: "items"; readonly items: readonly CollectionItem[]; readonly order?: "unordered" | "supplied";
      readonly itemCount?: never; readonly used?: never; readonly capacity?: never; readonly unit?: never }
  | { readonly kind: "count"; readonly itemCount: number; readonly items?: never; readonly order?: never;
      readonly used?: never; readonly capacity?: never; readonly unit?: never }
  | { readonly kind: "capacity"; readonly used: number; readonly capacity: number; readonly unit: string;
      readonly items?: never; readonly itemCount?: never; readonly order?: never }
);

// Abstract diagram units, shared by every author using this projection.
const layout = Object.freeze({ minimumColumns: 10, itemPitch: 1, itemExtent: 0.65,
  symbolPixels: 8, padding: 1, rowGap: 1, labelLine: 0.8, labelCharacters: 24,
  unitOutlineLimit: 32, capacityFrameWidth: 8 });
const shapes = ["circle", "triangle", "rectangle", "diamond"];

function parseRecord(value: unknown, allowed: readonly string[], name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TypeError(`${name} must be a record.`);
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const result: Record<string, unknown> = Object.create(null);
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== "string" || !allowed.includes(key)) throw new TypeError(`Unknown ${name} field.`);
    const descriptor = descriptors[key]!;
    if (!("value" in descriptor)) throw new TypeError(`${name} cannot contain accessors.`);
    result[key] = descriptor.value;
  }
  return result;
}
function parseArray(value: unknown, name: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  const descriptors = new Map<PropertyKey, PropertyDescriptor>();
  for (const key of Reflect.ownKeys(value)) descriptors.set(key, Object.getOwnPropertyDescriptor(value, key)!);
  // Native arrays always own a non-accessor length descriptor. Read descriptors
  // rather than inherited methods, iterators or subclass species constructors.
  const length: number = descriptors.get("length")!.value;
  for (const [key, descriptor] of descriptors) {
    if (!("value" in descriptor)) throw new TypeError(`${name} cannot contain accessors.`);
    if (key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= length))
      throw new TypeError(`${name} cannot contain extra properties.`);
  }
  const detached: unknown[] = [];
  for (let index = 0; index < length; index++) {
    const descriptor = descriptors.get(String(index));
    if (!descriptor) throw new TypeError(`${name} cannot contain holes.`);
    detached.push(descriptor.value);
  }
  return detached;
}
function parseText(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${name} must be nonempty text.`);
  return value;
}
function parseQuantity(value: unknown, name: string, integer = false): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be numeric.`);
  if (!Number.isFinite(value) || value < 0 || (integer && !Number.isSafeInteger(value)))
    throw new RangeError(`${name} is outside its range.`);
  return value;
}
function addUniqueId(ids: Set<string>, id: string) {
  if (ids.has(id)) throw new RangeError(`Duplicate collection identity: ${id}`);
  ids.add(id);
}
function normalizeItems(input: unknown, ids: Set<string>, defaultColor: string): CollectionItem[] {
  return parseArray(input, "Collection items").map(value => {
    const item = parseRecord(value, ["id", "label", "color", "shape"], "item");
    const id = parseText(item.id, "Item id");
    addUniqueId(ids, id);
    if (item.shape !== undefined && !shapes.includes(item.shape as string)) throw new TypeError("Unknown collection shape.");
    return { id, label: item.label === undefined ? id : parseText(item.label, "Item label"),
      color: item.color === undefined ? defaultColor : parseText(item.color, "Item color"),
      shape: (item.shape ?? "rectangle") as NonNullable<CollectionItem["shape"]> };
  });
}
function normalizeRows(input: unknown): CollectionRow[] {
  const rowIds = new Set<string>();
  const itemIds = new Set<string>();
  return parseArray(input, "Collections").map(value => {
    const row = parseRecord(value, ["id", "label", "kind", "color", "items", "order", "itemCount", "used", "capacity", "unit"], "collection");
    const base = { id: parseText(row.id, "Collection id"), label: parseText(row.label, "Collection label"),
      color: row.color === undefined ? scientificPalette.neutral : parseText(row.color, "Collection color") };
    addUniqueId(rowIds, base.id);
    if (row.kind === "items") {
      for (const key of ["itemCount", "used", "capacity", "unit"]) if (Object.hasOwn(row, key)) throw new TypeError("Items cannot contain quantity fields.");
      if (row.order !== undefined && row.order !== "unordered" && row.order !== "supplied") throw new TypeError("Unknown collection order.");
      const items = normalizeItems(row.items, itemIds, base.color);
      return { ...base, kind: "items", items, order: row.order ?? "unordered" };
    }
    if (row.kind === "count") {
      for (const key of ["items", "order", "used", "capacity", "unit"]) if (Object.hasOwn(row, key)) throw new TypeError("Count cannot contain item or capacity fields.");
      return { ...base, kind: "count", itemCount: parseQuantity(row.itemCount, "Count", true) };
    }
    if (row.kind === "capacity") {
      for (const key of ["items", "order", "itemCount"]) if (Object.hasOwn(row, key)) throw new TypeError("Capacity cannot contain item or count fields.");
      return { ...base, kind: "capacity", used: parseQuantity(row.used, "Used capacity"),
        capacity: parseQuantity(row.capacity, "Capacity"), unit: parseText(row.unit, "Capacity unit") };
    }
    throw new TypeError("Unknown collection kind.");
  });
}
function wrapLabel(value: string): string[] {
  const lines: string[] = [];
  let rest = value;
  while (rest.length > layout.labelCharacters) {
    const space = rest.lastIndexOf(" ", layout.labelCharacters);
    const end = space > 0 ? space : layout.labelCharacters;
    lines.push(rest.slice(0, end)); rest = rest.slice(end).trimStart();
  }
  lines.push(rest);
  return lines;
}
function summary(row: CollectionRow): string {
  if (row.kind === "items") return `${row.label}: ${row.items.length} ${row.items.length === 1 ? "item" : "items"} (${row.order === "supplied" ? "supplied order" : "unordered"})`;
  if (row.kind === "count") return `${row.label}: ${row.itemCount}`;
  const excess = Math.max(0, row.used - row.capacity);
  return `${row.label}: ${row.used} of ${row.capacity} ${row.unit}${excess ? `; ${excess} excess above capacity` : ""}`;
}
function usesUnitOutlines(row: Extract<CollectionRow, { readonly kind: "capacity" }>): boolean {
  return Number.isSafeInteger(row.capacity) && Number.isSafeInteger(row.used) &&
    Math.max(row.capacity, row.used) <= layout.unitOutlineLimit;
}
function outlineUnits(row: CollectionRow): number {
  if (row.kind !== "capacity") return 0;
  return usesUnitOutlines(row) ? Math.max(row.capacity, row.used) : 1;
}

/** Pure layout of detached collections; coordinates are diagram units, never model space. */
export function collectionDiagram(input: readonly CollectionRow[]): SpatialData {
  const rows = normalizeRows(input);
  if (!rows.length) return { width: 1, height: 1, agents: [], labels: [], showLabels: false, description: "No collections" };
  const population = rows.reduce((total, row) => total + (row.kind === "items" ? row.items.length : outlineUnits(row)), 0);
  const columns = Math.max(layout.minimumColumns, Math.ceil(Math.sqrt(population * 2)));
  const descriptions = rows.map(summary);
  const headings = descriptions.map(wrapLabel);
  const rowHeights = rows.map((row, index) => headings[index]!.length * layout.labelLine +
    Math.max(1, Math.ceil((row.kind === "items" ? row.items.length : outlineUnits(row)) / columns)) * layout.itemPitch + layout.rowGap);
  const height = layout.padding * 2 + rowHeights.reduce((total, value) => total + value, 0);
  // Keep the fitted canvas wide enough for fixed-font labels even with many rows.
  const width = Math.max(columns * layout.itemPitch + layout.padding * 2, height);
  if (!Number.isFinite(width) || !Number.isFinite(height)) throw new RangeError("Collection geometry overflow.");
  const agents: SpatialAgent[] = [];
  const labels: SpatialLabel[] = [];
  const ids = new Set(rows.flatMap(row => row.kind === "items" ? row.items.map(item => item.id) : []));
  const left = -width / 2 + layout.padding;
  let top = height / 2 - layout.padding;
  function addDecoration(row: CollectionRow, suffix: string, x: number, y: number, filled: boolean, color: string, extentWidth: number = layout.itemExtent) {
    const id = `collection:${row.id.length}:${row.id}:${suffix}`;
    addUniqueId(ids, id);
    agents.push({ id, x, y, shape: "rectangle", extent: { width: extentWidth, height: layout.itemExtent },
      filled, color, stroke: color, selectable: false });
  }
  rows.forEach((row, index) => {
    for (const [line, text] of headings[index]!.entries()) labels.push({ x: 0, y: top - line * layout.labelLine, text });
    const contentTop = top - headings[index]!.length * layout.labelLine - layout.itemPitch / 2;
    if (row.kind === "items") row.items.forEach((item, itemIndex) => {
      const shape = item.shape ?? "rectangle";
      agents.push({ id: item.id, label: item.label, x: left + (itemIndex % columns) * layout.itemPitch + layout.itemPitch / 2,
        y: contentTop - Math.floor(itemIndex / columns) * layout.itemPitch,
        shape, color: item.color, ...(shape === "rectangle" ? { extent: { width: layout.itemExtent, height: layout.itemExtent } } : { size: layout.symbolPixels }) });
    });
    if (row.kind === "capacity") {
      const units = outlineUnits(row);
      if (!usesUnitOutlines(row)) {
        addDecoration(row, "frame", left + layout.capacityFrameWidth / 2, contentTop, false, scientificPalette.neutral, layout.capacityFrameWidth);
        const fill = row.capacity ? Math.min(row.used, row.capacity) / row.capacity : 0;
        if (fill > 0) addDecoration(row, "used", left + layout.capacityFrameWidth * fill / 2, contentTop, true, row.color ?? scientificPalette.neutral, layout.capacityFrameWidth * fill);
        if (row.used > row.capacity) addDecoration(row, "excess", left + layout.capacityFrameWidth + layout.itemPitch, contentTop, true, scientificPalette.unavailable);
      } else for (let unit = 0; unit < units; unit++) addDecoration(row, `unit:${unit}`, left + (unit % columns) * layout.itemPitch + layout.itemPitch / 2,
        contentTop - Math.floor(unit / columns) * layout.itemPitch, unit < row.used, unit >= row.capacity ? scientificPalette.unavailable : row.color ?? scientificPalette.neutral);
    }
    top -= rowHeights[index]!;
  });
  return { width, height, agents, labels, showLabels: false, description: `${descriptions.join("; ")}.` };
}
