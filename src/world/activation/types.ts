import type { Agent } from "../../agent/agent.ts";
import type { Field } from "../../grid/field.ts";
import type { Edge } from "../../graph/edge.ts";
import type { World } from "../world.ts";
export type WorldMember = Agent | Field<object, object> | Edge;
export type ActivationSource<T extends WorldMember> = T | readonly T[] | {
  readonly kind: "agents" | "fields" | "edges";
  readonly group?: string;
};
export interface ActivationContext<T extends WorldMember> {
  readonly world: World;
  readonly self: T;
  readonly caller: WorldMember | undefined;
  die(): never;
}
export interface ActivationOptions<T extends WorldMember = WorldMember> {
  order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation";
  priority?: (member: T) => number;
  caller?: ActivationContext<WorldMember>;
  ids?: ReadonlyMap<WorldMember, number>;
  groups?: ReadonlyMap<WorldMember, string>;
  groupOrder?: readonly string[];
}
export type SelectionOptions = Pick<ActivationOptions, "caller" | "groups">;
