import type { World } from "../world/world.ts";
import { issueId, registerFramework, requireLivingAgent } from "./lifecycle.ts";
import { cloneState, validateOptions } from "./state.ts";
import {
  createSpatial,
  type SpatialMethods,
  type SpatialOptions,
} from "./spatial.ts";
interface AgentMembers<S extends object> extends SpatialMethods {
  /** Opaque process-local identity; never reused. */
  readonly id: string;
  /** False after `delete()`. */
  readonly alive: boolean;
  /** Owning World while attached. */
  readonly world: World | undefined;
  readonly x: number;
  readonly y: number;
  readonly z: number | undefined;
  /** Degrees in [0, 360); 0 points +Y and 90 points +X. */
  readonly heading: number;
  /** Degrees; undefined for XY Agents. */
  readonly pitch: number | undefined;
  /** Degrees; undefined for XY Agents. */
  readonly roll: number | undefined;
  /** Creates a detached living Agent with copied model state, position and orientation. */
  copy(): Agent<S>;
  /**
   * Idempotently deletes this Agent, removing World membership and incident
   * graph memberships. Rejects without changes while a participant, such as
   * active DES participation, blocks deletion.
   */
  delete(): void;
}
/** Model state `S` plus framework identity, lifecycle and spatial members. */
export type Agent<S extends object = {}> = S & AgentMembers<S>;
/**
 * Creates an Agent from a detached copy of plain model state. Position
 * defaults to the XY origin; orientation defaults to heading 0. Creation
 * consumes no randomness.
 * @throws TypeError for invalid arguments, unsupported state or reserved state keys.
 */
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
  const spatialOptions = validateOptions(options, [
    "position",
    "orientation",
  ]) as SpatialOptions;
  const modelState = cloneState(arguments.length === 0 ? ({} as S) : (state as S));
  const agent = Object.create(Object.getPrototypeOf(modelState)) as Agent<S>;
  Object.defineProperties(agent, Object.getOwnPropertyDescriptors(modelState));
  const record = registerFramework(agent, "agent");
  const spatial = createSpatial(agent, spatialOptions);
  // Framework members are read-only descriptors. The map also tells `copy`
  // which own keys are not model state; spatial methods join it before use.
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
        const copiedState = Object.create(Object.getPrototypeOf(agent)) as S;
        for (const key of Reflect.ownKeys(agent)) {
          if (typeof key === "string" && Object.hasOwn(properties, key))
            continue;
          // Keys come from Reflect.ownKeys on the same object.
          Object.defineProperty(
            copiedState,
            key,
            Object.getOwnPropertyDescriptor(agent, key)!,
          );
        }
        return add(copiedState, {
          position: spatial.position(),
          orientation: spatial.orientation(),
        });
      },
    },
    delete: {
      value: () => {
        if (!record.alive) return;
        // Validate every participant, then detach, then commit; commits must not throw.
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
