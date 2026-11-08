import type { World } from "../world/world.ts";
import { issueId, registerFramework, requireLivingAgent } from "./lifecycle.ts";
import { cloneState, validateOptions } from "./state.ts";
import {
  createSpatial,
  type SpatialMethods,
  type SpatialOptions,
} from "./spatial.ts";
interface AgentMembers<S extends object> extends SpatialMethods {
  readonly id: string;
  readonly alive: boolean;
  readonly world: World | undefined;
  readonly x: number;
  readonly y: number;
  readonly z: number | undefined;
  readonly heading: number;
  readonly pitch: number | undefined;
  readonly roll: number | undefined;
  copy(): Agent<S>;
  delete(): void;
}
export type Agent<S extends object = {}> = S & AgentMembers<S>;
function add(): Agent<{}>;
function add<S extends object>(state: S, options?: SpatialOptions): Agent<S>;
function add<S extends object>(
  state?: S,
  options: SpatialOptions = {},
): Agent<S> {
  if (
    arguments.length > 2 ||
    (arguments.length > 1 && arguments[1] === undefined)
  )
    throw new TypeError("Agent.add accepts state and spatial options.");
  const opts = validateOptions(options, [
    "position",
    "orientation",
  ]) as SpatialOptions;
  const cloned = cloneState(arguments.length === 0 ? ({} as S) : (state as S));
  const agent = Object.create(Object.getPrototypeOf(cloned)) as Agent<S>;
  Object.defineProperties(agent, Object.getOwnPropertyDescriptors(cloned));
  const record = registerFramework(agent, "agent");
  const spatial = createSpatial(agent, opts);
  const properties: PropertyDescriptorMap = {
    id: { value: issueId(), enumerable: true },
    alive: { get: () => record.alive, enumerable: true },
    world: { get: () => record.world, enumerable: true },
    x: { get: () => spatial.position().x, enumerable: true },
    y: { get: () => spatial.position().y, enumerable: true },
    z: { get: () => spatial.position().z, enumerable: true },
    heading: { get: () => spatial.orientation().heading, enumerable: true },
    pitch: { get: () => spatial.orientation().pitch, enumerable: true },
    roll: { get: () => spatial.orientation().roll, enumerable: true },
    copy: {
      value: function copy() {
        if (arguments.length)
          throw new TypeError("Agent.copy accepts no options.");
        requireLivingAgent(agent);
        const state = Object.create(Object.getPrototypeOf(agent)) as S;
        for (const key of Reflect.ownKeys(agent)) {
          if (typeof key === "string" && Object.hasOwn(properties, key))
            continue;
          Object.defineProperty(
            state,
            key,
            Object.getOwnPropertyDescriptor(agent, key)!,
          );
        }
        return add(state, {
          position: spatial.position(),
          orientation: spatial.orientation(),
        });
      },
    },
    delete: {
      value: () => {
        if (!record.alive) return;
        const participants = [...record.deletionParticipants];
        for (const participant of participants) participant.validate();
        record.detach?.();
        for (const participant of participants) participant.commit();
        record.alive = false;
      },
    },
  };
  for (const [name, method] of Object.entries(spatial.methods))
    properties[name] = { value: method };
  Object.defineProperties(agent, properties);
  return agent;
}
export const Agent = Object.freeze({ add });
