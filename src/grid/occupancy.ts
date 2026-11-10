import type { Agent } from "../agent/agent.ts";
import { frameworkRecord, observeWorld, requireAgent } from "../agent/lifecycle.ts";
import type { World } from "../world/world.ts";

/** Number of coordinate axes an Agent currently uses. */
export function agentDimensions(agent: Agent): 2 | 3 {
  return agent.z === undefined ? 2 : 3;
}

/**
 * Validates an explicit `agentsAt` source: distinct Agents in first-seen order,
 * each a framework Agent with the Grid's dimensions. Consumes the source once.
 */
export function readAgentSource(source: unknown, dimensions: 2 | 3): Agent[] {
  if (
    (typeof source !== "object" && typeof source !== "function") ||
    source === null ||
    typeof (source as Iterable<Agent>)[Symbol.iterator] !== "function"
  )
    throw new TypeError("Expected an iterable Agent source.");
  const candidates = [...new Set(source as Iterable<Agent>)];
  for (const agent of candidates) {
    requireAgent(agent);
    if (agentDimensions(agent) !== dimensions) throw new TypeError("Agent dimensions disagree with Grid.");
  }
  return candidates;
}

/** Derived acceleration for the existing implicit-World source only.
 * Agent coordinates and World insertion membership remain canonical.
 */
export function createOccupancyIndex<F extends object>(
  world: World,
  grid: object,
  dimensions: 2 | 3,
  locate: (agent: Agent) => F | undefined,
) {
  const entries = new Map<Agent, { field: F | undefined; order: bigint }>();
  const buckets = new Map<F, Set<Agent>>();
  const incompatible = new Set<Agent>();
  let order = 0n;
  let owner: World | undefined = world;
  function remove(agent: Agent) {
    const previous = entries.get(agent);
    if (previous?.field) {
      const bucket = buckets.get(previous.field)!;
      bucket.delete(agent);
      if (bucket.size === 0) buckets.delete(previous.field);
    }
    entries.delete(agent);
    incompatible.delete(agent);
  }
  function place(agent: Agent, admissionOrder: bigint) {
    if (agentDimensions(agent) !== dimensions) {
      incompatible.add(agent);
      entries.set(agent, { field: undefined, order: admissionOrder });
      return;
    }
    const field = locate(agent);
    entries.set(agent, { field, order: admissionOrder });
    if (field) {
      const bucket = buckets.get(field) ?? new Set<Agent>();
      bucket.add(agent);
      buckets.set(field, bucket);
    }
  }
  const unsubscribe = observeWorld(world, {
    membership(component, attached) {
      if (component === grid && !attached) {
        owner = undefined;
        unsubscribe();
        entries.clear();
        buckets.clear();
        incompatible.clear();
      } else if (frameworkRecord(component)?.kind === "agent") {
        const agent = component as Agent;
        if (attached) place(agent, order++);
        else remove(agent);
      }
    },
    movement(component) {
      const agent = component as Agent;
      const previous = entries.get(agent);
      if (!previous) return;
      // A movement can cross cells many times, but never changes admission order.
      const admissionOrder = previous.order;
      remove(agent);
      place(agent, admissionOrder);
    },
  });
  for (const agent of world.agents) place(agent, order++);
  return {
    matches(candidate: World) { return owner === candidate; },
    query(field: F): readonly Agent[] {
      if (incompatible.size) throw new TypeError("Agent dimensions disagree with Grid.");
      const found = [...(buckets.get(field) ?? [])];
      found.sort((a, b) => entries.get(a)!.order < entries.get(b)!.order ? -1 : 1);
      return Object.freeze(found);
    },
  };
}
