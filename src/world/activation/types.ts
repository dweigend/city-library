import type { Agent } from "../../agent/agent.ts";
import type { Field } from "../../grid/field.ts";
import type { Edge } from "../../graph/edge.ts";
import type { World } from "../world.ts";
export type WorldMember = Agent | Field<object, object> | Edge;
/** A direct member, a captured array or a live selector over current World membership. */
export type ActivationSource<T extends WorldMember> = T | readonly T[] | {
  readonly kind: "agents" | "fields" | "edges";
  readonly group?: string;
};
/** Scoped callback context; it expires when its callback returns, dies or throws. */
export interface ActivationContext<T extends WorldMember> {
  readonly world: World;
  readonly self: T;
  /** Self of the explicitly supplied outer context; undefined without `options.caller`. */
  readonly caller: WorldMember | undefined;
  /** Deletes self and ends the callback; fields cannot die. */
  die(): never;
}
export interface ActivationOptions<T extends WorldMember = WorldMember> {
  /** Defaults to "shuffle", which draws from `world.random`; "unsupported-interleaved-activation" rejects. */
  order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation";
  /** Required by "priority"; lower finite values run first. */
  priority?: (member: T) => number;
  caller?: ActivationContext<WorldMember>;
  /** Reserved for unsupported interleaved activation; currently unused. */
  ids?: ReadonlyMap<WorldMember, number>;
  /** Member-to-group mapping required by selectors with `group`. */
  groups?: ReadonlyMap<WorldMember, string>;
  /** Reserved for unsupported interleaved activation; currently unused. */
  groupOrder?: readonly string[];
}
export type SelectionOptions = Pick<ActivationOptions, "caller" | "groups">;
