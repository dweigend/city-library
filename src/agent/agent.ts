import type { World } from "../world/world.ts";
import { issueId, registerFramework, requireLivingAgent } from "./lifecycle.ts";
import { cloneState } from "./state.ts";
interface AgentMembers<S extends object> {
  readonly id: string;
  readonly alive: boolean;
  readonly world: World | undefined;
  readonly x: number;
  readonly y: number;
  readonly z: undefined;
  readonly heading: number;
  readonly pitch: undefined;
  readonly roll: undefined;
  copy(): Agent<S>;
  delete(): void;
}
export type Agent<S extends object = {}> = S & AgentMembers<S>;
function add(): Agent<{}>;
function add<S extends object>(state: S): Agent<S>;
function add<S extends object>(state?: S): Agent<S> {
  if (arguments.length > 1) throw new TypeError("Spatial Agent options are not delivered in A1.");
  const cloned = cloneState(arguments.length === 0 ? {} as S : state as S);
  const agent = Object.create(Object.getPrototypeOf(cloned)) as Agent<S>;
  Object.defineProperties(agent, Object.getOwnPropertyDescriptors(cloned));
  const record = registerFramework(agent, "agent");
  const properties: PropertyDescriptorMap = {
    id: { value: issueId(), enumerable: true },
    alive: { get: () => record.alive, enumerable: true },
    world: { get: () => record.world, enumerable: true },
    x: { value: 0, enumerable: true }, y: { value: 0, enumerable: true },
    z: { value: undefined, enumerable: true }, heading: { value: 0, enumerable: true },
    pitch: { value: undefined, enumerable: true }, roll: { value: undefined, enumerable: true },
    copy: { value: function copy() {
      if (arguments.length) throw new TypeError("Agent.copy accepts no options.");
      requireLivingAgent(agent);
      const state = Object.create(Object.getPrototypeOf(agent)) as S;
      for (const key of Reflect.ownKeys(agent)) {
        if (typeof key === "string" && Object.hasOwn(properties, key)) continue;
        Object.defineProperty(state, key, Object.getOwnPropertyDescriptor(agent, key)!);
      }
      return add(state);
    } },
    delete: { value: () => {
      if (!record.alive) return;
      const participants = [...record.deletionParticipants];
      for (const participant of participants) participant.validate();
      record.detach?.();
      for (const participant of participants) participant.commit();
      record.alive = false;
    } },
  };
  Object.defineProperties(agent, properties);
  return agent;
}
export const Agent = Object.freeze({ add });
