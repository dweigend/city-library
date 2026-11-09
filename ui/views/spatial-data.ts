import type { GridData, SpatialAgent, SpatialData } from "../definition.ts";

function record(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new TypeError(`${name} must be a data record.`);
  for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(value)))
    if (!("value" in descriptor)) throw new TypeError(`${name} cannot contain accessors.`);
  return value as Record<string, unknown>;
}
function number(value: unknown, name: string, minimum?: number, positive = false): number {
  if (typeof value !== "number") throw new TypeError(`${name} must be numeric.`);
  if (!Number.isFinite(value) || (minimum !== undefined && (positive ? value <= minimum : value < minimum)))
    throw new RangeError(`${name} is outside its finite range.`);
  return value;
}
function text(value: unknown, name: string) {
  if (typeof value !== "string" || value.trim() === "") throw new TypeError(`${name} must be nonempty text.`);
}
function point(value: unknown, name: string) {
  const data = record(value, name);
  number(data.x, `${name}.x`);
  number(data.y, `${name}.y`);
  return data;
}
function array(value: unknown, name: string): readonly unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  return value;
}
function agent(value: unknown) {
  const data = point(value, "Spatial agent");
  text(data.id, "Spatial agent id");
  if (data.color !== undefined) text(data.color, "Spatial agent color");
  if (data.label !== undefined && typeof data.label !== "string") throw new TypeError("Agent label must be text.");
  if (data.heading !== undefined) number(data.heading, "Heading");
  if (data.size !== undefined) number(data.size, "Symbol size", 0, true);
  if (data.shape !== undefined && !["circle", "triangle", "rectangle", "diamond"].includes(data.shape as string))
    throw new TypeError("Unsupported spatial shape.");
  if (data.extent !== undefined) {
    if (data.shape !== "rectangle" || data.size !== undefined)
      throw new TypeError("Only a rectangle without CSS size can have a scene extent.");
    const extent = record(data.extent, "Rectangle extent");
    number(extent.width, "Rectangle width", 0, true);
    number(extent.height, "Rectangle height", 0, true);
  }
  if (data.filled !== undefined && typeof data.filled !== "boolean") throw new TypeError("Filled must be boolean.");
  if (data.stroke !== undefined) text(data.stroke, "Outline color");
  if (data.strokeWidth !== undefined) number(data.strokeWidth, "Outline width", 0);
}

/** Validate an entire projection before changing buffers or the last valid scene. */
export function validateCanvasData(value: GridData | SpatialData): void {
  const data = record(value, "Canvas data");
  number(data.width, "Canvas width", 0, true);
  number(data.height, "Canvas height", 0, true);
  if (data.description !== undefined) text(data.description, "Scene description");
  if (data.showLabels !== undefined && typeof data.showLabels !== "boolean") throw new TypeError("showLabels must be boolean.");
  if (data.cells !== undefined) for (const value of array(data.cells, "Cells")) {
    const cell = point(value, "Cell");
    text(cell.id, "Cell id");
    text(cell.color, "Cell color");
  }
  if (data.agents !== undefined) for (const value of array(data.agents, "Agents")) agent(value);
  else if (data.cells === undefined) throw new TypeError("Canvas data requires cells or agents.");
  if (data.segments !== undefined) for (const value of array(data.segments, "Segments")) {
    const segment = record(value, "Segment");
    point(segment.from, "Segment start"); point(segment.to, "Segment end");
    if (segment.color !== undefined) text(segment.color, "Segment color");
    if (segment.width !== undefined) number(segment.width, "Segment width", 0);
  }
  if (data.labels !== undefined) for (const value of array(data.labels, "Labels")) {
    const label = point(value, "Scene label");
    text(label.text, "Scene label text");
  }
}

/** True painted bounds for mixed diagrams; legacy nearest picking stays separate. */
export function hitSceneSymbol(agent: SpatialAgent, x: number, y: number, unitsPerPixel: number): boolean {
  const radians = (agent.heading ?? 0) * Math.PI / 180;
  const dx = x - agent.x;
  const dy = y - agent.y;
  // Canvas clockwise rotation is negative rotation in upward-positive coordinates.
  const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
  const localY = dx * Math.sin(radians) + dy * Math.cos(radians);
  const width = agent.extent?.width ?? (agent.size ?? 8) * unitsPerPixel;
  const height = agent.extent?.height ?? width;
  if (agent.shape === "diamond") return Math.abs(localX) / (width / 2) + Math.abs(localY) / (height / 2) <= 1;
  if (agent.shape === "rectangle") return Math.abs(localX) <= width / 2 && Math.abs(localY) <= height / 2;
  if (agent.shape === "triangle") {
    if (localY < -height * 0.35 || localY > height / 2) return false;
    const halfWidth = width * 0.35 * (height / 2 - localY) / (height * 0.85);
    return Math.abs(localX) <= halfWidth;
  }
  return localX * localX + localY * localY <= width * width / 4;
}
