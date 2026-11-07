import type { Grid, GridMembership } from "../grid/grid.ts";
import {
  normalizeSpace,
  dimension,
  axes,
  type Space,
  type NormalizedSpace,
} from "../geometry/space.ts";
import type { Agent } from "../agent/agent.ts";
import {
  frameworkRecord,
  registerFramework,
  requireAgent,
  requireLivingAgent,
  notifyMembership,
} from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { Random, isRandom } from "../random/random.ts";
import { createClock, type Clock, type Tick } from "./tick.ts";
export interface World {
  readonly space: NormalizedSpace | undefined;
  readonly random: Random;
  readonly tick: Tick;
  readonly agents: readonly Agent[];
  readonly grids: readonly Grid[];
  add<T extends Agent | GridMembership>(component: T): T;
  add<T extends Agent | GridMembership>(components: Iterable<T>): readonly T[];
  delete(
    component: Agent | GridMembership | Iterable<Agent | GridMembership>,
  ): void;
}
const clocks = new WeakMap<World, Clock>();
export function worldClock(value: unknown): Clock {
  if (frameworkRecord(value)?.kind !== "world")
    throw new TypeError("Expected a World.");
  return clocks.get(value as World)!;
}
function entrySnapshot(value: unknown): {
  single: boolean;
  entries: (Agent | GridMembership)[];
} {
  if (["agent", "grid"].includes(frameworkRecord(value)?.kind ?? ""))
    return { single: true, entries: [value as Agent | GridMembership] };
  if (
    (typeof value !== "object" && typeof value !== "function") ||
    value === null ||
    !(Symbol.iterator in value)
  )
    throw new TypeError("Expected an Agent or iterable of Agents.");
  return {
    single: false,
    entries: [...new Set(value as Iterable<Agent | GridMembership>)],
  };
}
function add(options?: { random?: Random }): World;
function add(
  space: Space,
  options?: { boundary?: Space["boundary"]; random?: Random },
): World;
function add(
  input: Space | { random?: Random } = {},
  options?: { boundary?: Space["boundary"]; random?: Random },
): World {
  if (
    arguments.length > 2 ||
    (arguments.length > 0 && arguments[0] === undefined) ||
    (arguments.length > 1 && arguments[1] === undefined)
  )
    throw new TypeError(
      "World.add accepts Space and options without placeholders.",
    );
  const spatial =
    typeof input === "object" &&
    input !== null &&
    ["x", "y", "z"].some((key) => Object.hasOwn(input, key));
  if (!spatial && options !== undefined)
    throw new TypeError("World options require Space in first argument.");
  const values = validateOptions(
    spatial ? (options ?? {}) : input,
    spatial ? ["boundary", "random"] : ["random"],
  );
  const space = spatial
    ? normalizeSpace(input as Space, values.boundary as Space["boundary"])
    : undefined;
  if (values.random !== undefined && !isRandom(values.random))
    throw new TypeError("Expected a Random.");
  const random =
    values.random === undefined ? Random.add() : (values.random as Random);
  const clock = createClock();
  const members = new Set<Agent | GridMembership>();
  const world: World = {
    space,
    random,
    tick: clock.tick,
    get agents() {
      return Object.freeze(
        [...members].filter(
          (value): value is Agent => frameworkRecord(value)?.kind === "agent",
        ),
      );
    },
    get grids() {
      return Object.freeze(
        [...members].filter(
          (value): value is Grid => frameworkRecord(value)?.kind === "grid",
        ),
      );
    },
    add<T extends Agent | GridMembership>(
      value: T | Iterable<T>,
    ): T & readonly T[] {
      const { single, entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (
          !record ||
          !["agent", "grid"].includes(record.kind) ||
          !record.alive
        )
          throw new TypeError("Expected living Agent or Grid.");
        if (space) {
          if (record.kind === "agent") {
            const point = agent as Agent;
            if (dimension(point) !== space.dimensions)
              throw new TypeError("Agent dimensions disagree with World.");
            if (
              axes
                .slice(0, space.dimensions)
                .some(
                  (axis) =>
                    point[axis]! < -space[axis]! / 2 ||
                    (space.boundary[axis] === "wrap"
                      ? point[axis]! >= space[axis]! / 2
                      : point[axis]! > space[axis]! / 2),
                )
            )
              throw new RangeError("Agent outside World Space.");
          } else {
            const other = (agent as GridMembership).space;
            if (
              other.dimensions !== space.dimensions ||
              axes
                .slice(0, space.dimensions)
                .some(
                  (axis) =>
                    other.boundary[axis] !== space.boundary[axis] ||
                    (space.boundary[axis] === "wrap"
                      ? other[axis] !== space[axis]
                      : other[axis]! > space[axis]!),
                )
            )
              throw new TypeError("Grid Space conflicts with World.");
          }
        }
        if (record.world && record.world !== world)
          throw new TypeError("Agent belongs to another World.");
      }
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid"].includes(record.kind))
          throw new TypeError("Expected Agent or Grid.");
        if (members.has(agent)) continue;
        members.add(agent);
        record.world = world;
        record.detach = () => {
          members.delete(agent);
          record.world = undefined;
          record.detach = undefined;
          notifyMembership(world, agent, false);
        };
        notifyMembership(world, agent, true);
      }
      return (single ? entries[0] : Object.freeze(entries)) as T & readonly T[];
    },
    delete(value: Agent | GridMembership | Iterable<Agent | GridMembership>) {
      const { entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid"].includes(record.kind))
          throw new TypeError("Expected Agent or Grid.");
        if (record.world && record.world !== world)
          throw new TypeError("Agent belongs to another World.");
      }
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid"].includes(record.kind))
          throw new TypeError("Expected Agent or Grid.");
        if (record.world === world) record.detach?.();
      }
    },
  };
  registerFramework(world, "world");
  clocks.set(world, clock);
  return Object.freeze(world);
}
export const World = Object.freeze({ add });
