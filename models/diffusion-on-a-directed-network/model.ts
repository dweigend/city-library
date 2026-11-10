/** Adapted from Stonedahl and Wilensky's NetLogo Diffusion on a Directed Network (2008).
 * Copyright 2008 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md and source.nlogox.
 * Changes: typed public composition, Mulberry setup/action RNG, deterministic
 * staged transport, independent rendering, atomic fixtures and detached history.
 */
import { Agent, Graph, Grid, Random, World, run, stats } from "city-library";
import type { Edge } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface DiffusionParameters { seed: number; gridSize: number; edgeChance: number; diffusionRate: number }
export const inputs: Inputs<DiffusionParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  gridSize: { kind: "number", default: 9, min: 3, max: 19, step: 2, integer: true },
  edgeChance: { kind: "number", default: 50, min: 0, max: 100, integer: true },
  diffusionRate: { kind: "number", default: 10, min: 0, max: 100, integer: true },
};
export interface ActiveEdgeInput { readonly from: number; readonly to: number }
type DiffusionNode = Agent<{ index: number; value: number }>;
interface FlowState { active: boolean; currentFlow: number }
type DiffusionEdge = Edge<DiffusionNode, FlowState>;
interface DiffusionSample { readonly tick: number; readonly totalValue: number; readonly maxValue: number }

export function create(options: Partial<DiffusionParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 21, y: 21 }, { random });
  const grid = Grid.create({ x: settings.gridSize, y: settings.gridSize });
  const fields = grid.fields;
  const graph = Graph.create<DiffusionNode, FlowState>({ edgeState: { active: false, currentFlow: 0 } });
  const nodes = fields.map((field, index) => {
    const scale = 9 / ((settings.gridSize - 1) / 2);
    const node = world.add(Agent.create({ index, value: 1 }, { position: { x: field.x * scale, y: field.y * scale } }));
    graph.nodes.add(node);
    return node;
  });
  // Fixed field-to-node association is not a second topology or quantity owner.
  const nodeAt = new Map(fields.map((field, index) => [field, nodes[index]!]));
  for (const field of fields) {
    const source = nodeAt.get(field)!;
    const targets = grid.neighbors(field, { neighborhood: "faces" }).map(neighbor => nodeAt.get(neighbor)!).sort((a, b) => a.index - b.index);
    for (const target of targets)
      graph.edges.add({ from: source, to: target, directed: true, state: { active: random.number() * 100 <= settings.edgeChance, currentFlow: 0 } });
  }
  // Immutable endpoint lookup retains canonical Edge references; Graph owns them.
  const candidateAt = new Map([...graph.edges].map(edge => [`${edge.from.index},${edge.to.index}`, edge]));
  const history: Readonly<DiffusionSample>[] = [];
  let maxFlow = 0;
  let meanFlow = 0;
  function quantities() {
    let totalValue = 0;
    let maxValue = 0;
    for (const node of nodes) { totalValue += node.value; maxValue = Math.max(maxValue, node.value); }
    return { totalValue, maxValue };
  }
  function updateFlowReporters() {
    const active = [...graph.edges].filter(edge => edge.active);
    // Source retains previous globals when the active set is empty.
    if (active.length) {
      maxFlow = Math.max(...active.map(edge => edge.currentFlow));
      meanFlow = active.reduce((sum, edge) => sum + edge.currentFlow, 0) / active.length;
    }
  }
  function record() {
    const point = Object.freeze({ tick: world.tick.value, ...quantities() });
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function diffuseValues() {
    const next = Array<number>(nodes.length).fill(0);
    const flows = new Map<DiffusionEdge, number>();
    for (const sender of nodes) {
      const outgoing = [...graph.edges].filter(edge => edge.active && edge.from === sender);
      if (!outgoing.length) { next[sender.index]! += sender.value; continue; }
      const keep = sender.value * (1 - settings.diffusionRate / 100);
      const increment = (sender.value - keep) / outgoing.length;
      next[sender.index]! += keep;
      for (const edge of outgoing) {
        next[edge.to.index]! += increment;
        flows.set(edge, increment);
      }
    }
    if (next.some(value => !Number.isFinite(value))) throw new RangeError("Diffusion exceeds the finite quantity budget.");
    next.forEach((value, index) => { nodes[index]!.value = value; });
    for (const [edge, flow] of flows) edge.currentFlow = flow;
    updateFlowReporters();
  }
  updateFlowReporters();
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index++) { run(world, diffuseValues); record(); }
    },
    setRules(rules: Partial<Pick<DiffusionParameters, "diffusionRate">>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => key !== "diffusionRate" || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only the live diffusionRate data property.");
      settings = parseParameters(inputs, { ...settings, ...rules });
      record();
    },
    rewire() {
      const active = [...graph.edges].filter(edge => edge.active);
      if (!active.length) return;
      random.sample(active)[0]!.active = false;
      const inactive = [...graph.edges].filter(edge => !edge.active);
      random.sample(inactive)[0]!.active = true;
      // Source rewire does not update flow globals, values, ticks or history.
    },
    setValues(values: readonly number[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== nodes.length)
        throw new RangeError("Supply one finite nonnegative quantity per node.");
      const copied: number[] = [];
      let total = 0;
      for (let index = 0; index < values.length; index++) {
        const item = Object.getOwnPropertyDescriptor(values, String(index));
        if (!item || !("value" in item)) throw new TypeError("Quantity entries must be own data values.");
        const value: unknown = item.value;
        if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new RangeError("Quantities must be finite and nonnegative.");
        total += value;
        if (!Number.isFinite(total)) throw new RangeError("Total quantity must remain finite.");
        copied.push(value);
      }
      copied.forEach((value, index) => { nodes[index]!.value = value; });
      updateFlowReporters(); record();
    },
    setActiveEdges(values: readonly ActiveEdgeInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) throw new TypeError("Supply an active connection array.");
      const selected = new Set<DiffusionEdge>();
      for (let index = 0; index < values.length; index++) {
        const item = Object.getOwnPropertyDescriptor(values, String(index));
        if (!item || !("value" in item)) throw new TypeError("Active entries must be own data values.");
        const value: unknown = item.value;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => !["from", "to"].includes(String(key)) || typeof key !== "string" || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply from/to active-link data properties.");
        const pair = value as ActiveEdgeInput;
        if (!Number.isSafeInteger(pair.from) || !Number.isSafeInteger(pair.to)) throw new RangeError("Active links require candidate node indices.");
        const edge = candidateAt.get(`${pair.from},${pair.to}`);
        if (!edge || selected.has(edge)) throw new RangeError("Active links must be distinct existing candidate arcs.");
        selected.add(edge);
      }
      for (const edge of graph.edges) { edge.active = selected.has(edge); edge.currentFlow = 0; }
      updateFlowReporters(); record();
    },
    read() {
      const measurement = quantities();
      const bins = Math.ceil(Math.sqrt(nodes.length));
      const upper = Math.ceil(measurement.maxValue + 0.5);
      const histogram = stats.histogram(nodes.map(node => node.value), { edges: Array.from({ length: bins + 1 }, (_, index) => index / bins * upper) });
      return Object.freeze({
        tick: world.tick.value, parameters: settings,
        nodes: Object.freeze(nodes.map(node => Object.freeze({ id: node.id, index: node.index, x: node.x, y: node.y, value: node.value }))),
        edges: Object.freeze([...graph.edges].map(edge => Object.freeze({ id: edge.id, from: edge.from.id, to: edge.to.id, fromIndex: edge.from.index, toIndex: edge.to.index, active: edge.active, currentFlow: edge.currentFlow }))),
        counts: Object.freeze({ nodeCount: nodes.length, candidateEdgeCount: graph.edges.size, activeEdgeCount: [...graph.edges].filter(edge => edge.active).length }),
        ...measurement, maxFlow, meanFlow, histogram,
        history: Object.freeze([...history]), randomState: random.state, done: false as const,
      });
    },
  };
}
export const model = {
  title: "Diffusion on a Directed Network",
  description: "A quantity flows along one-way links between nodes while the total stays the same. Adapted from Stonedahl and Wilensky (2008), CC BY-NC-SA 3.0.",
  inputs, create,
} satisfies Definition<DiffusionParameters, ReturnType<typeof create>>;
