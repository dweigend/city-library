import { frameworkRecord } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { cloneEdgeState, edgeMemberKeys, type Edge, type EdgeDraft } from "./edge.ts";

/** Current structure and policy of the source graph. */
export interface CopySource<N extends object, E extends object> {
  readonly nodes: readonly N[];
  readonly edges: readonly Edge<N, E>[];
  readonly defaults: E;
  readonly parallel: boolean;
  readonly selfLoops: boolean;
}
/** Fully detached copy input; materializing it runs no caller code. */
export interface PreparedCopy<N extends object, E extends object> {
  readonly nodes: readonly N[];
  readonly edges: readonly EdgeDraft<N, E>[];
  readonly defaults: E;
  readonly parallel: boolean;
  readonly selfLoops: boolean;
}

function selection(value: unknown): unknown[] {
  if (!Array.isArray(value) || Reflect.ownKeys(value).length !== value.length + 1) throw new TypeError("Copy selections require dense data arrays.");
  const result: unknown[] = [];
  for (let index = 0; index < value.length; index++) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor || !("value" in descriptor)) throw new TypeError("Copy selections require own data indices.");
    result.push(descriptor.value);
  }
  return result;
}
function modelState<N extends object, E extends object>(edge: Edge<N, E>): E {
  const state = Object.create(Object.getPrototypeOf(edge)) as E;
  for (const key of Reflect.ownKeys(edge)) {
    if (typeof key === "string" && edgeMemberKeys.has(key)) continue;
    Object.defineProperty(state, key, Object.getOwnPropertyDescriptor(edge, key)!);
  }
  // In particular, a reference back to a registered source Edge stays canonical.
  return cloneEdgeState(state);
}
/** Prepared clones contain no hostile original containers or accessors. Walk
 * these after ALL source reflection so a later trap cannot leave a dead ref
 * in an earlier successful clone. Framework values are leaves, never rebound. */
function validateReferences(value: unknown, seen: Set<object>): void {
  if (typeof value !== "object" || value === null) return;
  const record = frameworkRecord(value);
  if (record) {
    if (!record.alive) throw new TypeError("Deleted framework reference in copied state.");
    return;
  }
  if (seen.has(value)) return;
  seen.add(value);
  if (value instanceof Map) {
    for (const [key, item] of value) { validateReferences(key, seen); validateReferences(item, seen); }
  } else if (value instanceof Set) {
    for (const item of value) validateReferences(item, seen);
  } else if (!(value instanceof ArrayBuffer) && !ArrayBuffer.isView(value) && !(value instanceof Date) && !(value instanceof RegExp)) {
    for (const key of Reflect.ownKeys(value)) validateReferences(Object.getOwnPropertyDescriptor(value, key)!.value, seen);
  }
}
/**
 * Validates copy options and detaches all selected structure and state.
 * Undirected simple copies switch to parallel mode when two selected edges
 * would join the same node pair.
 */
export function prepareCopy<N extends object, E extends object>(source: CopySource<N, E>, options: unknown): PreparedCopy<N, E> {
  const sourceNodes = source.nodes, sourceEdges = source.edges;
  const settings = validateOptions(options, ["nodes", "edges", "direction"]);
  const direction = settings.direction === undefined ? "original" : settings.direction;
  if (direction !== "original" && direction !== "reverse" && direction !== "undirected") throw new TypeError("Invalid copy direction.");
  // Validate BOTH array shapes before membership or any edge-state reflection.
  const suppliedNodes = settings.nodes === undefined ? sourceNodes : selection(settings.nodes);
  const suppliedEdges = settings.edges === undefined ? undefined : selection(settings.edges);
  const members = new Set(sourceNodes), memberEdges = new Set(sourceEdges);
  for (const node of suppliedNodes) if (!members.has(node as N) || frameworkRecord(node)?.alive === false) throw new TypeError("Copy node must be a living current source member.");
  if (suppliedEdges) for (const edge of suppliedEdges) if (!memberEdges.has(edge as Edge<N, E>) || frameworkRecord(edge)?.alive === false) throw new TypeError("Copy edge must be a living current source edge.");
  const selected = new Set(suppliedNodes);
  const nodes = sourceNodes.filter(node => selected.has(node));
  if (suppliedEdges) for (const edge of suppliedEdges as Edge<N, E>[]) if (!selected.has(edge.from) || !selected.has(edge.to)) throw new TypeError("Copy edge endpoints must be selected.");
  const requested = suppliedEdges === undefined ? undefined : new Set(suppliedEdges);
  const edges = sourceEdges.filter(edge => requested === undefined ? selected.has(edge.from) && selected.has(edge.to) : requested.has(edge));
  const parallel = source.parallel || (direction === "undirected" && sharesNodePair(nodes, edges));
  const copiedDefaults = cloneEdgeState(source.defaults);
  const preparedEdges = edges.map((edge, index) => ({
    from: direction === "reverse" && edge.directed ? edge.to : edge.from,
    to: direction === "reverse" && edge.directed ? edge.from : edge.to,
    directed: direction === "undirected" ? false : edge.directed,
    key: edge.key === undefined && parallel ? String(index) : edge.key,
    state: modelState(edge),
  }));
  for (const node of nodes) if (frameworkRecord(node)?.alive === false) throw new TypeError("Deleted copied node.");
  const checked = new Set<object>();
  validateReferences(copiedDefaults, checked);
  for (const edge of preparedEdges) validateReferences(edge.state, checked);
  return { nodes, edges: preparedEdges, defaults: copiedDefaults, parallel, selfLoops: source.selfLoops };
}
/** True when two edges join the same unordered node pair. */
function sharesNodePair<N extends object, E extends object>(nodes: readonly N[], edges: readonly Edge<N, E>[]): boolean {
  const order = new Map(nodes.map((node, index) => [node, index]));
  const pairs = new Map<N, Set<N>>();
  for (const edge of edges) {
    const [a, b] = order.get(edge.from)! <= order.get(edge.to)! ? [edge.from, edge.to] : [edge.to, edge.from];
    const targets = pairs.get(a) ?? new Set<N>();
    if (targets.has(b)) return true;
    targets.add(b); pairs.set(a, targets);
  }
  return false;
}
