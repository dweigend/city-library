import type { GridData, SpatialData } from "../definition.ts";

function parseRecord(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new TypeError(`${name} must be a data record.`);
  for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(value)))
    if (!("value" in descriptor)) throw new TypeError(`${name} cannot contain accessors.`);
  return value as Record<string, unknown>;
}
function parseNumber(value: unknown, name: string, minimum?: number, positive = false): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be numeric.`);
  if (!Number.isFinite(value) || (minimum !== undefined && (positive ? value <= minimum : value < minimum)))
    throw new RangeError(`${name} is outside its finite range.`);
  return value;
}
function validateText(value: unknown, name: string) {
  if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${name} must be nonempty text.`);
}
function validatePoint(value: unknown, name: string) {
  const data = parseRecord(value, name);
  parseNumber(data.x, `${name}.x`);
  parseNumber(data.y, `${name}.y`);
  return data;
}
function parseArray(value: unknown, name: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  return value;
}
function validateAgent(value: unknown) {
  const data = validatePoint(value, "Spatial agent");
  validateText(data.id, "Spatial agent id");
  if (data.color !== undefined) validateText(data.color, "Spatial agent color");
  if (data.label !== undefined && typeof data.label !== "string") throw new TypeError("Agent label must be text.");
  if (data.heading !== undefined) parseNumber(data.heading, "Heading");
  if (data.size !== undefined) parseNumber(data.size, "Symbol size", 0, true);
  if (data.shape !== undefined && !["circle", "triangle", "rectangle", "diamond"].includes(data.shape as string))
    throw new TypeError("Unsupported spatial shape.");
  if (data.extent !== undefined) {
    if (data.shape !== "rectangle" || data.size !== undefined)
      throw new TypeError("Only a rectangle without CSS size can have a scene extent.");
    const extent = parseRecord(data.extent, "Rectangle extent");
    parseNumber(extent.width, "Rectangle width", 0, true);
    parseNumber(extent.height, "Rectangle height", 0, true);
  }
  if (data.selectable !== undefined && typeof data.selectable !== "boolean") throw new TypeError("Selectable must be boolean.");
  if (data.filled !== undefined && typeof data.filled !== "boolean") throw new TypeError("Filled must be boolean.");
  if (data.stroke !== undefined) validateText(data.stroke, "Outline color");
  if (data.strokeWidth !== undefined) parseNumber(data.strokeWidth, "Outline width", 0);
}

/** Validate an entire projection before changing buffers or the last valid scene. */
export function validateCanvasData(value: GridData | SpatialData): void {
  const data = parseRecord(value, "Canvas data");
  parseNumber(data.width, "Canvas width", 0, true);
  parseNumber(data.height, "Canvas height", 0, true);
  if (data.description !== undefined) validateText(data.description, "Scene description");
  if (data.showLabels !== undefined && typeof data.showLabels !== "boolean") throw new TypeError("showLabels must be boolean.");
  if (data.cells !== undefined) for (const value of parseArray(data.cells, "Cells")) {
    const cell = validatePoint(value, "Cell");
    validateText(cell.id, "Cell id");
    validateText(cell.color, "Cell color");
  }
  if (data.agents !== undefined) for (const value of parseArray(data.agents, "Agents")) validateAgent(value);
  else if (data.cells === undefined) throw new TypeError("Canvas data requires cells or agents.");
  if (data.segments !== undefined) for (const value of parseArray(data.segments, "Segments")) {
    const segment = parseRecord(value, "Segment");
    validatePoint(segment.from, "Segment start"); validatePoint(segment.to, "Segment end");
    if (segment.color !== undefined) validateText(segment.color, "Segment color");
    if (segment.width !== undefined) parseNumber(segment.width, "Segment width", 0);
  }
  if (data.labels !== undefined) for (const value of parseArray(data.labels, "Labels")) {
    const label = validatePoint(value, "Scene label");
    validateText(label.text, "Scene label text");
  }
}
