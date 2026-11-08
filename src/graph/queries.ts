import { validateOptions } from "../agent/state.ts";
import type { Edge } from "./edge.ts";

export type Direction = "out" | "in" | "all";
export function direction(options: { direction?: Direction } = {}): Direction {
  const supplied = validateOptions(options, ["direction"]).direction;
  const value = supplied === undefined ? "out" : supplied;
  if (value !== "out" && value !== "in" && value !== "all") throw new TypeError("Invalid graph direction.");
  return value;
}
export function connects<N extends object, E extends object>(edge: Edge<N, E>, from: N, to: N, mode: Direction): boolean {
  const forward = edge.from === from && edge.to === to;
  const backward = edge.to === from && edge.from === to;
  if (!edge.directed || mode === "all") return forward || backward;
  return mode === "out" ? forward : backward;
}
export function opposite<N extends object, E extends object>(edge: Edge<N, E>, node: N, mode: Direction): N | undefined {
  if (edge.from === node && (!edge.directed || mode !== "in")) return edge.to;
  if (edge.to === node && (!edge.directed || mode !== "out")) return edge.from;
  return undefined;
}
