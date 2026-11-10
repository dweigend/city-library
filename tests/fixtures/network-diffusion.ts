import { Agent, Graph, Random, World, run } from "city-library";
import { changeBridges, createContacts } from "./network-diffusion/topology.ts";
import type {
  ContactKind, DiffusionAgent, DiffusionCounts, DiffusionHistoryPoint, DiffusionParameters,
  DiffusionState, NetworkDiffusionOptions, NetworkDiffusionSnapshot,
} from "./network-diffusion/types.ts";

export type {
  DiffusionState, DiffusionTopology, NetworkDiffusionOptions, NetworkDiffusionSnapshot,
  DiffusionAgentObservation, DiffusionEdgeObservation, DiffusionHistoryPoint,
} from "./network-diffusion/types.ts";

function parameters(options: NetworkDiffusionOptions): DiffusionParameters {
  if (typeof options !== "object" || options === null || ![Object.prototype, null].includes(Object.getPrototypeOf(options))) {
    throw new TypeError("Diffusion options must be a plain record.");
  }
  for (const key of Reflect.ownKeys(options)) {
    if (typeof key !== "string" || !["count", "seed", "transmission", "activeTicks", "topology", "bridges"].includes(key)) {
      throw new TypeError("Unknown diffusion option.");
    }
    if (!("value" in Object.getOwnPropertyDescriptor(options, key)!)) throw new TypeError("Diffusion options must contain data values.");
  }
  const count = options.count === undefined ? 60 : options.count;
  const seed = options.seed === undefined ? 1 : options.seed;
  const transmission = options.transmission === undefined ? 0.35 : options.transmission;
  const activeTicks = options.activeTicks === undefined ? 6 : options.activeTicks;
  const topology = options.topology === undefined ? "communities" : options.topology;
  const bridges = options.bridges === undefined ? true : options.bridges;
  if (!Number.isSafeInteger(count) || count < 3 || count > 200) throw new RangeError("Agent count must be an integer from 3 to 200.");
  if (!Number.isInteger(seed) || seed < -0x80000000 || seed > 0xffffffff) throw new RangeError("Seed must be a signed or unsigned 32-bit integer.");
  if (!Number.isFinite(transmission) || transmission < 0 || transmission > 1) throw new RangeError("Transmission must be from 0 to 1.");
  if (!Number.isSafeInteger(activeTicks) || activeTicks < 1 || activeTicks > 30) throw new RangeError("Active duration must be an integer from 1 to 30 ticks.");
  if (!["communities", "ring", "hub"].includes(topology)) throw new TypeError("Choose a supported network topology.");
  if (typeof bridges !== "boolean") throw new TypeError("Bridges must be boolean.");
  return Object.freeze({ count, seed, transmission, activeTicks, topology, bridges });
}

/** Illustrative information diffusion: synchronous state updates over canonical Graph contacts. */
export function createNetworkDiffusionModel(options: NetworkDiffusionOptions = {}) {
  let settings = parameters(options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const graph = Graph.create<DiffusionAgent, { kind: ContactKind }>({ edgeState: { kind: "contact" } });
  const agents: DiffusionAgent[] = Array.from({ length: settings.count }, (_, index) => Agent.create({
    label: `Agent ${index + 1}`,
    community: settings.topology === "communities" ? Math.floor(index * 3 / settings.count) : 0,
    state: (index === 0 ? "active" : "unaware") as DiffusionState,
    activeAge: 0,
  }));
  world.add(agents);
  for (const agent of agents) graph.nodes.add(agent);
  const bridges = createContacts(graph, agents, settings.topology);
  changeBridges(graph, bridges, settings.bridges);
  let selected = agents[0]!;
  let newActivations = 1;
  const history: DiffusionHistoryPoint[] = [];

  function counts(): DiffusionCounts {
    const result = { unaware: 0, active: 0, settled: 0 };
    for (const agent of agents) result[agent.state] += 1;
    return Object.freeze(result);
  }
  function record(tick: number) {
    const point = Object.freeze({ tick, ...counts() });
    // Preserve the initial sample; interventions replace the latest same-tick observation.
    if (history.length > 1 && history.at(-1)!.tick === tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 241) history.splice(1, history.length - 241);
  }
  record(0);

  function step() {
    const entry = new Map(agents.map((agent) => [agent, { state: agent.state, activeAge: agent.activeAge }]));
    const next = agents.map((agent) => {
      const old = entry.get(agent)!;
      if (old.state === "settled") return old;
      if (old.state === "active") {
        const activeAge = old.activeAge + 1;
        return { state: activeAge >= settings.activeTicks ? "settled" as const : "active" as const, activeAge };
      }
      const exposed = graph.neighbors(agent).filter((neighbor) => entry.get(neighbor)!.state === "active").length;
      const chance = exposed === 0 ? 0 : 1 - (1 - settings.transmission) ** exposed;
      const adopts = chance === 1 || (chance > 0 && random.number() < chance);
      return { state: adopts ? "active" as const : "unaware" as const, activeAge: 0 };
    });
    newActivations = 0;
    agents.forEach((agent, index) => {
      const value = next[index]!;
      if (agent.state === "unaware" && value.state === "active") newActivations += 1;
      agent.state = value.state;
      agent.activeAge = value.activeAge;
    });
    record(world.tick.value + 1);
  }

  return {
    advance(steps = 1) { run(world, step, steps); },
    select(id: string) {
      const found = agents.find((agent) => agent.id === id);
      if (!found) throw new RangeError("Select an agent from this diffusion model.");
      selected = found;
    },
    seedSelected() {
      if (selected.state !== "unaware") throw new Error("Select an unaware agent to activate.");
      selected.state = "active";
      selected.activeAge = 0;
      newActivations = 1;
      record(world.tick.value);
    },
    setBridges(enabled: boolean) {
      if (typeof enabled !== "boolean") throw new TypeError("Bridges must be boolean.");
      if (settings.topology !== "communities") throw new Error("Bridge control is available for communities only.");
      if (settings.bridges === enabled) return;
      changeBridges(graph, bridges, enabled);
      settings = Object.freeze({ ...settings, bridges: enabled });
    },
    read(): NetworkDiffusionSnapshot {
      const currentCounts = counts();
      return Object.freeze({
        scenario: "diffusion" as const,
        id: selected.id,
        alive: selected.alive,
        attached: selected.world === world,
        x: selected.x, y: selected.y, heading: selected.heading,
        tick: world.tick.value,
        agentCount: agents.length,
        state: selected.state,
        activeAge: selected.activeAge,
        degree: graph.neighbors(selected).length,
        community: selected.community,
        parameters: settings,
        counts: currentCounts,
        contactCount: graph.edges.size,
        newActivations,
        done: currentCounts.active === 0,
        randomState: random.state,
        agents: Object.freeze(agents.map((agent) => Object.freeze({
          id: agent.id, label: agent.label, community: agent.community,
          state: agent.state, activeAge: agent.activeAge,
          degree: graph.neighbors(agent).length,
          alive: agent.alive, attached: agent.world === world, selected: agent === selected,
          x: agent.x, y: agent.y, heading: agent.heading,
        }))),
        edges: Object.freeze(Array.from(graph.edges, (edge) => Object.freeze({
          id: edge.id, from: edge.from.id, to: edge.to.id, directed: false as const, kind: edge.kind,
        }))),
        history: Object.freeze([...history]),
      });
    },
  };
}
