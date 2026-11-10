/** Adapted from Stonedahl and Wilensky's NetLogo Virus on a Network (2008).
 * Copyright 2008 Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md and source.nlogox.
 * Changes: public typed composition, explicit Mulberry RNG, independent layout,
 * atomic fixtures, detached observations and bounded successful-step history.
 */
import { Agent, Graph, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface VirusParameters {
  seed: number;
  numberOfNodes: number;
  averageNodeDegree: number;
  initialOutbreakSize: number;
  spreadChance: number;
  recoveryChance: number;
  resistanceChance: number;
  checkFrequency: number;
}
export const inputs: Inputs<VirusParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  numberOfNodes: { kind: "number", default: 150, min: 10, max: 300, step: 5, integer: true },
  averageNodeDegree: { kind: "number", default: 6, min: 1, max: 299, integer: true },
  initialOutbreakSize: { kind: "number", default: 3, min: 1, max: 300, integer: true },
  spreadChance: { kind: "number", default: 2.5, min: 0, max: 10, step: 0.1 },
  recoveryChance: { kind: "number", default: 5, min: 0, max: 10, step: 0.1 },
  resistanceChance: { kind: "number", default: 5, min: 0, max: 100, integer: true },
  checkFrequency: { kind: "number", default: 1, min: 1, max: 20, integer: true },
};
export type InfectionStatus = "susceptible" | "infected" | "resistant";
export interface VirusStateInput { readonly status: InfectionStatus; readonly checkTimer: number }
export interface ConnectionInput { readonly from: number; readonly to: number }
type VirusNode = Agent<{ index: number; status: InfectionStatus; checkTimer: number }>;
type LiveRules = Pick<VirusParameters, "spreadChance" | "recoveryChance" | "resistanceChance" | "checkFrequency">;
/** History values are percentages, matching the source plot rather than its loose Info description. */
interface VirusSample { readonly tick: number; readonly susceptible: number; readonly infected: number; readonly resistant: number }

export function create(options: Partial<VirusParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.averageNodeDegree > settings.numberOfNodes - 1 || settings.initialOutbreakSize > settings.numberOfNodes)
    throw new RangeError("Degree and outbreak must fit the setup population.");
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 41, y: 41 }, { random });
  const graph = Graph.create<VirusNode>();
  const nodes: VirusNode[] = [];
  const history: Readonly<VirusSample>[] = [];
  const integer = (upper: number) => Math.floor(random.number() * upper);

  function setupNodes() {
    for (let index = 0; index < settings.numberOfNodes; index++) {
      const x = (random.number() * 41 - 20.5) * 0.95;
      const y = (random.number() * 41 - 20.5) * 0.95;
      const node = world.add(Agent.create({ index, status: "susceptible" as InfectionStatus, checkTimer: integer(settings.checkFrequency) }, { position: { x, y } }));
      graph.nodes.add(node);
      nodes.push(node);
    }
  }
  function setupSpatiallyClusteredNetwork() {
    const target = Math.ceil(settings.averageNodeDegree * nodes.length / 2);
    while (graph.edges.size < target) {
      const node = random.sample(nodes)[0]!;
      const connected = new Set(graph.neighbors(node));
      let minimum = Infinity;
      let nearest: VirusNode[] = [];
      for (const candidate of nodes) {
        if (candidate === node || connected.has(candidate)) continue;
        const distance = node.distanceTo(candidate);
        if (distance < minimum) { minimum = distance; nearest = [candidate]; }
        else if (distance === minimum) nearest.push(candidate);
      }
      if (nearest.length) graph.edges.add({ from: node, to: random.sample(nearest)[0]! });
    }
  }
  function counts() {
    const result = { susceptible: 0, infected: 0, resistant: 0 };
    for (const node of nodes) result[node.status]++;
    return result;
  }
  function percentages() {
    const current = counts();
    return { susceptible: current.susceptible / nodes.length * 100, infected: current.infected / nodes.length * 100, resistant: current.resistant / nodes.length * 100 };
  }
  function record() {
    const point = Object.freeze({ tick: world.tick.value, ...percentages() });
    if (history.at(-1)?.tick === point.tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function updateCheckTimers() {
    for (const node of nodes) {
      node.checkTimer++;
      if (node.checkTimer >= settings.checkFrequency) node.checkTimer = 0;
    }
  }
  function spreadVirus() {
    // Capture senders once; newly infected neighbors are not new senders here.
    const senders = nodes.filter(node => node.status === "infected");
    for (const sender of random.sample(senders, { count: senders.length })) {
      const candidates = graph.neighbors(sender).filter(node => node.status !== "resistant");
      for (const recipient of random.sample(candidates, { count: candidates.length }))
        if (random.number() * 100 < settings.spreadChance) recipient.status = "infected";
    }
  }
  function doVirusChecks() {
    // Select after spreading: new infections may recover in this same tick.
    const checking = nodes.filter(node => node.status === "infected" && node.checkTimer === 0);
    for (const node of random.sample(checking, { count: checking.length })) {
      // Source random 100 is integer, even though recovery's slider is fractional.
      if (integer(100) < settings.recoveryChance)
        node.status = integer(100) < settings.resistanceChance ? "resistant" : "susceptible";
    }
  }
  function go() { updateCheckTimers(); spreadVirus(); doVirusChecks(); }

  setupNodes();
  setupSpatiallyClusteredNetwork();
  for (const node of random.sample(nodes, { count: settings.initialOutbreakSize })) node.status = "infected";
  record();

  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index++) {
        if (!nodes.some(node => node.status === "infected")) break;
        run(world, go);
        record();
      }
    },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(key => !["spreadChance", "recoveryChance", "resistanceChance", "checkFrequency"].includes(String(key)) || typeof key !== "string" || !("value" in Object.getOwnPropertyDescriptor(rules, key)!)))
        throw new TypeError("Supply only live virus rule data properties.");
      settings = parameters(inputs, { ...settings, ...rules });
      record();
    },
    setStates(values: readonly VirusStateInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || values.length !== nodes.length)
        throw new RangeError("Supply one state per node.");
      const copied: VirusStateInput[] = [];
      for (let index = 0; index < values.length; index++) {
        const item = Object.getOwnPropertyDescriptor(values, String(index));
        if (!item || !("value" in item)) throw new TypeError("State entries must be own data values.");
        const value: unknown = item.value;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => !["status", "checkTimer"].includes(String(key)) || typeof key !== "string" || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply status and checkTimer data properties.");
        const state = value as VirusStateInput;
        if (!["susceptible", "infected", "resistant"].includes(state.status) || !Number.isSafeInteger(state.checkTimer) || state.checkTimer < 0 || state.checkTimer > 19)
          throw new RangeError("Invalid infection state or check timer.");
        copied.push({ status: state.status, checkTimer: state.checkTimer });
      }
      copied.forEach((state, index) => { nodes[index]!.status = state.status; nodes[index]!.checkTimer = state.checkTimer; });
      record();
    },
    setConnections(values: readonly ConnectionInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype) throw new TypeError("Supply a connection array.");
      const copied: ConnectionInput[] = [];
      const pairs = new Set<string>();
      for (let index = 0; index < values.length; index++) {
        const item = Object.getOwnPropertyDescriptor(values, String(index));
        if (!item || !("value" in item)) throw new TypeError("Connection entries must be own data values.");
        const value: unknown = item.value;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
          Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => !["from", "to"].includes(String(key)) || typeof key !== "string" || !("value" in Object.getOwnPropertyDescriptor(value, key)!)))
          throw new TypeError("Supply from/to connection data properties.");
        const pair = value as ConnectionInput;
        if (!Number.isSafeInteger(pair.from) || !Number.isSafeInteger(pair.to) || pair.from < 0 || pair.to < 0 || pair.from >= nodes.length || pair.to >= nodes.length || pair.from === pair.to)
          throw new RangeError("Connections require distinct existing node indices.");
        const key = `${Math.min(pair.from, pair.to)},${Math.max(pair.from, pair.to)}`;
        if (pairs.has(key)) throw new RangeError("Duplicate undirected connection.");
        pairs.add(key); copied.push({ from: pair.from, to: pair.to });
      }
      graph.delete({ edgesOnly: true });
      for (const pair of copied) graph.edges.add({ from: nodes[pair.from]!, to: nodes[pair.to]! });
      record();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value, parameters: settings,
        nodes: Object.freeze(nodes.map(node => Object.freeze({ id: node.id, index: node.index, x: node.x, y: node.y, status: node.status, checkTimer: node.checkTimer }))),
        edges: Object.freeze([...graph.edges].map(edge => Object.freeze({ id: edge.id, from: edge.from.id, to: edge.to.id, fromIndex: edge.from.index, toIndex: edge.to.index }))),
        counts: Object.freeze(counts()), percentages: Object.freeze(percentages()),
        history: Object.freeze([...history]), randomState: random.state,
        done: !nodes.some(node => node.status === "infected"),
      });
    },
  };
}
export const model = {
  title: "Virus on a Network",
  description: "Infection, timed checks and permanent resistance on a proximity-built network. Adapted from Stonedahl and Wilensky (2008), CC BY-NC-SA 3.0.",
  inputs, create,
} satisfies Definition<VirusParameters, ReturnType<typeof create>>;
