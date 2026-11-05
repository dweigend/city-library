import type { Agent } from "../agent/agent.ts";
import { frameworkRecord, registerFramework, requireAgent, requireLivingAgent } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { Random, isRandom } from "../random/random.ts";
import { createClock, type Clock, type Tick } from "./tick.ts";
export interface World {
  readonly space: undefined;
  readonly random: Random;
  readonly tick: Tick;
  readonly agents: readonly Agent[];
  add<T extends Agent>(component: T): T;
  add<T extends Agent>(components: Iterable<T>): readonly T[];
  delete(component: Agent | Iterable<Agent>): void;
}
const clocks = new WeakMap<World, Clock>();
export function worldClock(value: unknown): Clock {
  if (frameworkRecord(value)?.kind !== "world") throw new TypeError("Expected a World.");
  return clocks.get(value as World)!;
}
function entrySnapshot(value: unknown): { single: boolean; entries: Agent[] } {
  if (frameworkRecord(value)?.kind === "agent") return { single: true, entries: [value as Agent] };
  if ((typeof value !== "object" && typeof value !== "function") || value === null || !(Symbol.iterator in value)) throw new TypeError("Expected an Agent or iterable of Agents.");
  return { single: false, entries: [...new Set(value as Iterable<Agent>)] };
}
function add(options: { random?: Random } = {}): World {
  if (arguments.length > 1) throw new TypeError("Spatial World construction is not delivered in A1.");
  const values = validateOptions(options, ["random"]);
  if (values.random !== undefined && !isRandom(values.random)) throw new TypeError("Expected a Random.");
  const random = values.random === undefined ? Random.add() : values.random as Random;
  const clock = createClock();
  const members = new Set<Agent>();
  const world: World = {
    space: undefined, random, tick: clock.tick,
    get agents() { return Object.freeze([...members]); },
    add<T extends Agent>(value: T | Iterable<T>): T & readonly T[] {
      const { single, entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = requireLivingAgent(agent);
        if (record.world && record.world !== world) throw new TypeError("Agent belongs to another World.");
      }
      for (const agent of entries) {
        const record = requireAgent(agent);
        members.add(agent);
        record.world = world;
        record.detach = () => { members.delete(agent); record.world = undefined; record.detach = undefined; };
      }
      return (single ? entries[0] : Object.freeze(entries)) as T & readonly T[];
    },
    delete(value: Agent | Iterable<Agent>) {
      const { entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = requireAgent(agent);
        if (record.world && record.world !== world) throw new TypeError("Agent belongs to another World.");
      }
      for (const agent of entries) {
        const record = requireAgent(agent);
        if (record.world === world) record.detach?.();
      }
    },
  };
  registerFramework(world, "world");
  clocks.set(world, clock);
  return Object.freeze(world);
}
export const World = Object.freeze({ add });
