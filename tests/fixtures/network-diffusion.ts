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

function parseParameters(options: NetworkDiffusionOptions): DiffusionParameters {
  if (typeof options !== "object" || options === null || ![Object.prototype, null].includes(Object.getPrototypeOf(options))) {
    throw new TypeError("Diffusion options must be a plain record.");
  }
  for (const key of Reflect.ownKeys(options)) {
    if (typeof key !== "string" || !["agentCount", "seed", "transmission", "activeDurationTicks", "topology", "hasBridges"].includes(key)) {
      throw new TypeError("Unknown diffusion option.");
    }
    if (!("value" in Object.getOwnPropertyDescriptor(options, key)!)) throw new TypeError("Diffusion options must contain data values.");
  }
  const agentCount = options.agentCount === undefined ? 60 : options.agentCount;
  const seed = options.seed === undefined ? 1 : options.seed;
  const transmission = options.transmission === undefined ? 0.35 : options.transmission;
  const activeDurationTicks = options.activeDurationTicks === undefined ? 6 : options.activeDurationTicks;
  const topology = options.topology === undefined ? "communities" : options.topology;
  const hasBridges = options.hasBridges === undefined ? true : options.hasBridges;
  if (!Number.isSafeInteger(agentCount) || agentCount < 3 || agentCount > 200) throw new RangeError("Agent agentCount must be an integer from 3 to 200.");
  if (!Number.isInteger(seed) || seed < -0x80000000 || seed > 0xffffffff) throw new RangeError("Seed must be a signed or unsigned 32-bit integer.");
  if (!Number.isFinite(transmission) || transmission < 0 || transmission > 1) throw new RangeError("Transmission must be from 0 to 1.");
  if (!Number.isSafeInteger(activeDurationTicks) || activeDurationTicks < 1 || activeDurationTicks > 30) throw new RangeError("Active duration must be an integer from 1 to 30 ticks.");
  if (!["communities", "ring", "hub"].includes(topology)) throw new TypeError("Choose a supported network topology.");
  if (typeof hasBridges !== "boolean") throw new TypeError("Bridges must be boolean.");
  return Object.freeze({ agentCount, seed, transmission, activeDurationTicks, topology, hasBridges });
}

/** Illustrative information diffusion: synchronous state updates over canonical Graph contacts. */
export function createNetworkDiffusionModel(options: NetworkDiffusionOptions = {}) {
  let settings = parseParameters(options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const graph = Graph.create<DiffusionAgent, { kind: ContactKind }>({ edgeState: { kind: "contact" } });
  const agents: DiffusionAgent[] = Array.from({ length: settings.agentCount }, (_, index) => Agent.create({
    label: `Agent ${index + 1}`,
    community: settings.topology === "communities" ? Math.floor(index * 3 / settings.agentCount) : 0,
    state: (index === 0 ? "active" : "unaware") as DiffusionState,
    activeAgeTicks: 0,
  }));
  world.add(agents);
  for (const agent of agents) graph.nodes.add(agent);
  const bridgeEndpoints = createContacts(graph, agents, settings.topology);
  changeBridges(graph, bridgeEndpoints, settings.hasBridges);
  let selected = agents[0]!;
  let newActivationCount = 1;
  const history: DiffusionHistoryPoint[] = [];

  function countAgentsByState(): DiffusionCounts {
    const result = { unawareAgentCount: 0, activeAgentCount: 0, settledAgentCount: 0 };
    for (const agent of agents) result[`${agent.state}AgentCount`] += 1;
    return Object.freeze(result);
  }
  function record(tick: number) {
    const point = Object.freeze({ tick, ...countAgentsByState() });
    // Preserve the initial sample; interventions replace the latest same-tick observation.
    if (history.length > 1 && history.at(-1)!.tick === tick) history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 241) history.splice(1, history.length - 241);
  }
  record(0);

  function step() {
    const entry = new Map(agents.map((agent) => [agent, { state: agent.state, activeAgeTicks: agent.activeAgeTicks }]));
    const next = agents.map((agent) => {
      const old = entry.get(agent)!;
      if (old.state === "settled") return old;
      if (old.state === "active") {
        const activeAgeTicks = old.activeAgeTicks + 1;
        return { state: activeAgeTicks >= settings.activeDurationTicks ? "settled" as const : "active" as const, activeAgeTicks };
      }
      const exposed = graph.neighbors(agent).filter((neighbor) => entry.get(neighbor)!.state === "active").length;
      const chance = exposed === 0 ? 0 : 1 - (1 - settings.transmission) ** exposed;
      const adopts = chance === 1 || (chance > 0 && random.number() < chance);
      return { state: adopts ? "active" as const : "unaware" as const, activeAgeTicks: 0 };
    });
    newActivationCount = 0;
    agents.forEach((agent, index) => {
      const value = next[index]!;
      if (agent.state === "unaware" && value.state === "active") newActivationCount += 1;
      agent.state = value.state;
      agent.activeAgeTicks = value.activeAgeTicks;
    });
    record(world.tick.value + 1);
  }

  return {
    advance(stepCount = 1) { run(world, step, stepCount); },
    select(id: string) {
      const found = agents.find((agent) => agent.id === id);
      if (!found) throw new RangeError("Select an agent from this diffusion model.");
      selected = found;
    },
    seedSelected() {
      if (selected.state !== "unaware") throw new Error("Select an unaware agent to activate.");
      selected.state = "active";
      selected.activeAgeTicks = 0;
      newActivationCount = 1;
      record(world.tick.value);
    },
    setBridges(enabled: boolean) {
      if (typeof enabled !== "boolean") throw new TypeError("Bridges must be boolean.");
      if (settings.topology !== "communities") throw new Error("Bridge control is available for communities only.");
      if (settings.hasBridges === enabled) return;
      changeBridges(graph, bridgeEndpoints, enabled);
      settings = Object.freeze({ ...settings, hasBridges: enabled });
    },
    read(): NetworkDiffusionSnapshot {
      const currentCounts = countAgentsByState();
      return Object.freeze({
        scenario: "diffusion" as const,
        id: selected.id,
        alive: selected.alive,
        attached: selected.world === world,
        x: selected.x, y: selected.y, heading: selected.heading,
        tick: world.tick.value,
        agentCount: agents.length,
        state: selected.state,
        activeAgeTicks: selected.activeAgeTicks,
        degree: graph.neighbors(selected).length,
        community: selected.community,
        parameters: settings,
        counts: currentCounts,
        contactCount: graph.edges.size,
        newActivationCount,
        isComplete: currentCounts.activeAgentCount === 0,
        randomState: random.state,
        agents: Object.freeze(agents.map((agent) => Object.freeze({
          id: agent.id, label: agent.label, community: agent.community,
          state: agent.state, activeAgeTicks: agent.activeAgeTicks,
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
