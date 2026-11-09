import type { Agenda } from "../agenda/index.ts";
import type { Graph } from "../graph/graph.ts";
import { activate, report, select, type ActivationContext, type ActivationOptions, type ActivationSource, type SelectionOptions, type WorldMember } from "./activation/index.ts";
import type { Grid, GridMembership, LayoutGrid } from "../grid/grid.ts";
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
  frameworkOwner,
  registerFramework,
  notifyMembership,
} from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { Random, isRandom } from "../random/random.ts";
import { createClock, type Clock, type Tick } from "./tick.ts";
type WorldComponent = Agent | GridMembership | Graph | Agenda;
export interface World {
  readonly space: NormalizedSpace | undefined;
  readonly random: Random;
  readonly tick: Tick;
  readonly agents: readonly Agent[];
  readonly grids: readonly (Grid | LayoutGrid)[];
  readonly graphs: readonly Graph[];
  readonly agendas: readonly Agenda[];
  activate<T extends WorldMember>(source: ActivationSource<T>, action: (context: ActivationContext<T>) => unknown, options?: ActivationOptions<T>): void;
  report<T extends WorldMember, R>(source: T, callback: (context: ActivationContext<T>) => R, options?: ActivationOptions<T>): R | undefined;
  report<T extends WorldMember, R>(source: readonly T[] | { kind: "agents" | "fields" | "edges"; breed?: string }, callback: (context: ActivationContext<T>) => R, options?: ActivationOptions<T>): readonly (R | undefined)[];
  select<T extends WorldMember>(source: ActivationSource<T>, predicate: (context: ActivationContext<T>) => boolean, options?: SelectionOptions): readonly T[];
  add<T extends WorldComponent>(component: T): T;
  add<T extends WorldComponent>(components: Iterable<T>): readonly T[];
  delete(
    component: WorldComponent | Iterable<WorldComponent>,
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
  entries: (WorldComponent)[];
} {
  if (["agent", "grid", "graph", "agenda"].includes(frameworkRecord(value)?.kind ?? ""))
    return { single: true, entries: [value as WorldComponent] };
  if (
    (typeof value !== "object" && typeof value !== "function") ||
    value === null ||
    !(Symbol.iterator in value)
  )
    throw new TypeError("Expected a component or iterable of components.");
  return {
    single: false,
    entries: [...new Set(value as Iterable<WorldComponent>)],
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
  const members = new Set<WorldComponent>();
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
          (value): value is Grid | LayoutGrid => frameworkRecord(value)?.kind === "grid",
        ),
      );
    },
    get graphs() {
      return Object.freeze([...members].filter((value): value is Graph => frameworkRecord(value)?.kind === "graph"));
    },
    get agendas() {
      return Object.freeze([...members].filter((value): value is Agenda => frameworkRecord(value)?.kind === "agenda"));
    },
    activate(source, action, options) { activate(world, source, action, options); },
    report(source, callback, options) {
      return report(world, source, callback, options) as never;
    },
    select(source, predicate, options) { return select(world, source, predicate, options); },
    add<T extends WorldComponent>(
      value: T | Iterable<T>,
    ): T & readonly T[] {
      const { single, entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (
          !record ||
          !["agent", "grid", "graph", "agenda"].includes(record.kind) ||
          !record.alive
        )
          throw new TypeError("Expected a living Agent, Grid, Graph or Agenda.");
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
          } else if (record.kind === "grid") {
            const grid = agent as Grid | LayoutGrid;
            if ("layout" in grid) {
              if (space.dimensions !== 2 || space.boundary.x !== "hard" || space.boundary.y !== "hard")
                throw new TypeError("Layout Grid requires a planar hard-boundary World or no World Space.");
              for (const cell of grid.layout.cells) for (const ring of grid.layout.polygon({ cell }).coordinates)
                for (const [x, y] of ring) if (x < -space.x / 2 || x > space.x / 2 || y < -space.y / 2 || y > space.y / 2)
                  throw new TypeError("Layout Grid geometry conflicts with World Space.");
            } else {
              const other = grid.space;
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
        }
        if (record.world && record.world !== world)
          throw new TypeError("Component belongs to another World.");
        for (const participant of record.deletionParticipants) participant.validateWorld?.(world);
      }
      const prospective = new Set([...members, ...entries]);
      for (const component of prospective) {
        if (frameworkRecord(component)?.kind !== "graph") continue;
        for (const node of (component as Graph).nodes) {
          const owner = frameworkOwner(node);
          if (owner && owner !== world) throw new TypeError("Graph node belongs to another World.");
        }
      }
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid", "graph", "agenda"].includes(record.kind))
          throw new TypeError("Expected an Agent, Grid, Graph or Agenda.");
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
    delete(value: WorldComponent | Iterable<WorldComponent>) {
      const { entries } = entrySnapshot(value);
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid", "graph", "agenda"].includes(record.kind))
          throw new TypeError("Expected an Agent, Grid, Graph or Agenda.");
        if (record.world && record.world !== world)
          throw new TypeError("Component belongs to another World.");
      }
      for (const agent of entries) {
        const record = frameworkRecord(agent);
        if (!record || !["agent", "grid", "graph", "agenda"].includes(record.kind))
          throw new TypeError("Expected an Agent, Grid, Graph or Agenda.");
        if (record.world === world) record.detach?.();
      }
    },
  };
  registerFramework(world, "world");
  clocks.set(world, clock);
  return Object.freeze(world);
}
export const World = Object.freeze({ add });
