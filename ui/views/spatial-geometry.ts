import type { GridData, SpatialAgent, SpatialData } from "../definition.ts";

interface Dimensions { readonly width: number; readonly height: number }

function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must remain finite after canvas conversion.`);
  return value;
}

/** Canvas dimensions use Web IDL unsigned long; conversion otherwise wraps. */
export function validateBufferDimensions(buffer: Dimensions): void {
  for (const dimension of [buffer.width, buffer.height]) {
    if (!Number.isInteger(dimension) || dimension < 1 || dimension > 0xffffffff)
      throw new RangeError("Canvas buffer dimensions must fit positive unsigned 32-bit integers.");
  }
}

/** Keep the existing minimum in buffer pixels, including on low-DPI displays. */
export function symbolDiameter(agent: SpatialAgent, pixelRatio: number): number {
  return Math.max(2, finite((agent.size ?? 8) * pixelRatio, "Symbol diameter"));
}

export function symbolDimensions(agent: SpatialAgent, scene: Dimensions, buffer: Dimensions, pixelRatio: number): Dimensions {
  if (!agent.extent) {
    const diameter = symbolDiameter(agent, pixelRatio);
    return { width: diameter, height: diameter };
  }
  const width = finite(agent.extent.width / scene.width * buffer.width, "Rectangle width");
  const height = finite(agent.extent.height / scene.height * buffer.height, "Rectangle height");
  if (width <= 0 || height <= 0) throw new RangeError("Rectangle dimensions must remain positive after canvas conversion.");
  return { width, height };
}

export function canvasPoint(point: { readonly x: number; readonly y: number }, scene: Dimensions, buffer: Dimensions) {
  return {
    x: finite((point.x + scene.width / 2) / scene.width * buffer.width, "Canvas x"),
    y: finite((scene.height / 2 - point.y) / scene.height * buffer.height, "Canvas y"),
  };
}

export function symbolRotation(agent: SpatialAgent): number {
  return finite((agent.heading ?? 0) * Math.PI / 180, "Symbol rotation");
}

/** Reject arithmetic overflow before a new observation or buffer is published. */
export function validateCanvasGeometry(data: GridData | SpatialData, buffer: Dimensions, pixelRatio: number): void {
  for (const cell of data.cells ?? []) {
    finite((cell.x + data.width / 2 - 0.5) / data.width * buffer.width, "Cell x");
    finite((data.height / 2 - cell.y - 0.5) / data.height * buffer.height, "Cell y");
    finite(buffer.width / data.width + 0.5, "Cell width");
    finite(buffer.height / data.height + 0.5, "Cell height");
  }
  if (!("agents" in data)) return;
  for (const agent of data.agents) {
    const point = canvasPoint(agent, data, buffer);
    if (agent.label) {
      const diameter = symbolDiameter(agent, pixelRatio);
      finite(point.x + diameter, "Agent label x");
      finite(point.y - diameter, "Agent label y");
    }
    symbolDimensions(agent, data, buffer, pixelRatio);
    symbolRotation(agent);
    finite((agent.strokeWidth ?? 1) * pixelRatio, "Outline width");
  }
  for (const segment of data.segments ?? []) {
    canvasPoint(segment.from, data, buffer);
    canvasPoint(segment.to, data, buffer);
    finite((segment.width ?? 1) * pixelRatio, "Segment width");
  }
  for (const label of data.labels ?? []) canvasPoint(label, data, buffer);
}

/** Test in buffer coordinates, matching both rectangle rotation and pixel rounding. */
export function isPointInSceneSymbol(agent: SpatialAgent, x: number, y: number, scene: Dimensions, buffer: Dimensions, pixelRatio: number): boolean {
  const radians = symbolRotation(agent);
  const dx = (x - agent.x) / scene.width * buffer.width;
  const dy = (y - agent.y) / scene.height * buffer.height;
  const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
  const localY = dx * Math.sin(radians) + dy * Math.cos(radians);
  const { width, height } = symbolDimensions(agent, scene, buffer, pixelRatio);
  if (agent.shape === "diamond") return Math.abs(localX) / (width / 2) + Math.abs(localY) / (height / 2) <= 1;
  if (agent.shape === "rectangle") return Math.abs(localX) <= width / 2 && Math.abs(localY) <= height / 2;
  if (agent.shape === "triangle") {
    if (localY < -height * 0.35 || localY > height / 2) return false;
    return Math.abs(localX) <= width * 0.35 * (height / 2 - localY) / (height * 0.85);
  }
  return Math.hypot(localX / (width / 2), localY / (height / 2)) <= 1;
}
