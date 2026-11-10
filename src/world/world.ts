import type { Agenda } from "../agenda/index.ts";
import type { Graph } from "../graph/graph.ts";
import {
  activate,
  report,
  select,
  type ActivationContext,
  type ActivationOptions,
  type ActivationSource,
  type SelectionOptions,
  type WorldMember,
} from "./activation/index.ts";
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
type ComponentRecord = NonNullable<ReturnType<typeof frameworkRecord>>;

/** Framework kinds a World accepts as members. */
const componentKinds: readonly string[] = ["agent", "grid", "graph", "agenda"];

/**
 * Owner of step time, shared randomness and component membership.
 * Membership collections are frozen insertion-order snapshots of the
 * original component references, not live views.
 */
export interface World {
  /** Normalized snapshot of the construction Space; absent for non-spatial Worlds. */
  readonly space: NormalizedSpace | undefined;
  /** Explicit Random retained by identity; draws happen only on use. */
  readonly random: Random;
  /** World-owned model time; `run` advances it by one per successful step. */
  readonly tick: Tick;
  readonly agents: readonly Agent[];
  readonly grids: readonly (Grid | LayoutGrid)[];
  readonly graphs: readonly Graph[];
  readonly agendas: readonly Agenda[];
  /** Invokes `action` once per living owned member; order defaults to "shuffle". */
  activate<T extends WorldMember>(
    source: ActivationSource<T>,
    action: (context: ActivationContext<T>) => unknown,
    options?: ActivationOptions<T>,
  ): void;
  /** Like `activate`, but returns each callback result; skipped members yield undefined. */
  report<T extends WorldMember, R>(
    source: T,
    callback: (context: ActivationContext<T>) => R,
    options?: ActivationOptions<T>,
  ): R | undefined;
  report<T extends WorldMember, R>(
    source: readonly T[] | { kind: "agents" | "fields" | "edges"; breed?: string },
    callback: (context: ActivationContext<T>) => R,
    options?: ActivationOptions<T>,
  ): readonly (R | undefined)[];
  /** Returns living members whose boolean predicate is true, in source order without shuffling. */
  select<T extends WorldMember>(
    source: ActivationSource<T>,
    predicate: (context: ActivationContext<T>) => boolean,
    options?: SelectionOptions,
  ): readonly T[];
  /**
   * Attaches existing components. A batch is deduplicated and fully validated
   * before any attachment; reattaching to this World is a no-op.
   * @throws TypeError for non-components, deleted or foreign-owned components
   *   and incompatible Space; RangeError for an Agent outside World Space.
   */
  add<T extends WorldComponent>(component: T): T;
  add<T extends WorldComponent>(components: Iterable<T>): readonly T[];
  /**
   * Detaches components without deleting them. Components absent from this
   * World are ignored; components owned by another World reject the batch.
   */
  delete(
    component: WorldComponent | Iterable<WorldComponent>,
  ): void;
}

const clocks = new WeakMap<World, Clock>();

/** Internal clock access for run and experiments. */
export function worldClock(value: unknown): Clock {
  if (frameworkRecord(value)?.kind !== "world")
    throw new TypeError("Expected a World.");
  // Every registered World receives its clock during construction.
  return clocks.get(value as World)!;
}

function isComponentKind(kind: string | undefined): boolean {
  return componentKinds.includes(kind ?? "");
}

/** Normalizes one component or an iterable into a duplicate-free snapshot. */
function componentSnapshot(value: unknown): {
  single: boolean;
  entries: WorldComponent[];
} {
  if (isComponentKind(frameworkRecord(value)?.kind))
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

function requireAgentInSpace(space: NormalizedSpace, agent: Agent): void {
  if (dimension(agent) !== space.dimensions)
    throw new TypeError("Agent dimensions disagree with World.");
  const outside = axes.slice(0, space.dimensions).some((axis) => {
    const coordinate = agent[axis]!;
    const halfExtent = space[axis]! / 2;
    if (coordinate < -halfExtent) return true;
    // A wrapped axis is half-open: its upper edge belongs to the lower edge.
    if (space.boundary[axis] === "wrap") return coordinate >= halfExtent;
    return coordinate > halfExtent;
  });
  if (outside) throw new RangeError("Agent outside World Space.");
}

function requireLayoutGridInSpace(space: NormalizedSpace, grid: LayoutGrid): void {
  if (space.dimensions !== 2 || space.boundary.x !== "hard" || space.boundary.y !== "hard")
    throw new TypeError("Layout Grid requires a planar hard-boundary World or no World Space.");
  const halfWidth = space.x / 2;
  const halfHeight = space.y / 2;
  for (const cell of grid.layout.cells) {
    for (const ring of grid.layout.polygon({ cell }).coordinates) {
      for (const [x, y] of ring) {
        if (x < -halfWidth || x > halfWidth || y < -halfHeight || y > halfHeight)
          throw new TypeError("Layout Grid geometry conflicts with World Space.");
      }
    }
  }
}

/** Hard axes may nest a smaller Grid; wrapped axes must match boundary and extent. */
function requireGridSpaceCompatible(space: NormalizedSpace, grid: Grid): void {
  const gridSpace = grid.space;
  const conflicts =
    gridSpace.dimensions !== space.dimensions ||
    axes.slice(0, space.dimensions).some((axis) => {
      if (gridSpace.boundary[axis] !== space.boundary[axis]) return true;
      if (space.boundary[axis] === "wrap") return gridSpace[axis] !== space[axis];
      return gridSpace[axis]! > space[axis]!;
    });
  if (conflicts) throw new TypeError("Grid Space conflicts with World.");
}

function requireComponentInSpace(
  space: NormalizedSpace,
  kind: ComponentRecord["kind"],
  component: WorldComponent,
): void {
  if (kind === "agent") {
    requireAgentInSpace(space, component as Agent);
    return;
  }
  if (kind !== "grid") return;
  const grid = component as Grid | LayoutGrid;
  if ("layout" in grid) requireLayoutGridInSpace(space, grid);
  else requireGridSpaceCompatible(space, grid);
}

/** Validates one component for attachment without changing any state. */
function requireAttachable(world: World, component: WorldComponent): ComponentRecord {
  const record = frameworkRecord(component);
  if (!record || !isComponentKind(record.kind) || !record.alive)
    throw new TypeError("Expected a living Agent, Grid, Graph or Agenda.");
  if (world.space) requireComponentInSpace(world.space, record.kind, component);
  if (record.world && record.world !== world)
    throw new TypeError("Component belongs to another World.");
  for (const participant of record.deletionParticipants) participant.validateWorld?.(world);
  return record;
}

/** Validates one component for detachment without changing any state. */
function requireDetachable(world: World, component: WorldComponent): ComponentRecord {
  const record = frameworkRecord(component);
  if (!record || !isComponentKind(record.kind))
    throw new TypeError("Expected an Agent, Grid, Graph or Agenda.");
  if (record.world && record.world !== world)
    throw new TypeError("Component belongs to another World.");
  return record;
}

/** Framework-owned graph nodes must belong to no World or to this World. */
function requireGraphNodesOwnedBy(world: World, components: Iterable<WorldComponent>): void {
  for (const component of components) {
    if (frameworkRecord(component)?.kind !== "graph") continue;
    for (const node of (component as Graph).nodes) {
      const owner = frameworkOwner(node);
      if (owner && owner !== world) throw new TypeError("Graph node belongs to another World.");
    }
  }
}

/**
 * Creates a World without Space, or with a normalized snapshot of `space`.
 * Without an explicit Random the World creates an independent default one.
 * Construction performs no random draws.
 */
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
  // Any axis key selects the spatial form; otherwise the first argument holds options.
  const spatial =
    typeof input === "object" &&
    input !== null &&
    ["x", "y", "z"].some((key) => Object.hasOwn(input, key));
  if (!spatial && options !== undefined)
    throw new TypeError("World options require Space in first argument.");
  const settings = validateOptions(
    spatial ? (options ?? {}) : input,
    spatial ? ["boundary", "random"] : ["random"],
  );
  const space = spatial
    ? normalizeSpace(input as Space, settings.boundary as Space["boundary"])
    : undefined;
  if (settings.random !== undefined && !isRandom(settings.random))
    throw new TypeError("Expected a Random.");
  const random =
    settings.random === undefined ? Random.add() : (settings.random as Random);
  const clock = createClock();
  const members = new Set<WorldComponent>();

  function membersOfKind<T extends WorldComponent>(kind: ComponentRecord["kind"]): readonly T[] {
    return Object.freeze(
      [...members].filter((member): member is T => frameworkRecord(member)?.kind === kind),
    );
  }

  function attach(component: WorldComponent, record: ComponentRecord): void {
    if (members.has(component)) return;
    members.add(component);
    record.world = world;
    record.detach = () => {
      members.delete(component);
      record.world = undefined;
      record.detach = undefined;
      notifyMembership(world, component, false);
    };
    notifyMembership(world, component, true);
  }

  const world: World = {
    space,
    random,
    tick: clock.tick,
    get agents() { return membersOfKind<Agent>("agent"); },
    get grids() { return membersOfKind<Grid | LayoutGrid>("grid"); },
    get graphs() { return membersOfKind<Graph>("graph"); },
    get agendas() { return membersOfKind<Agenda>("agenda"); },
    activate(source, action, options) {
      activate(world, source, action, options);
    },
    report(source, callback, options) {
      // One implementation serves both overloads; the source form selects the result shape.
      return report(world, source, callback, options) as never;
    },
    select(source, predicate, options) {
      return select(world, source, predicate, options);
    },
    add<T extends WorldComponent>(
      value: T | Iterable<T>,
    ): T & readonly T[] {
      const { single, entries } = componentSnapshot(value);
      // Validate the complete batch before the first attachment.
      const admissions = entries.map((component) => ({
        component,
        record: requireAttachable(world, component),
      }));
      requireGraphNodesOwnedBy(world, new Set([...members, ...entries]));
      for (const { component, record } of admissions) attach(component, record);
      return (single ? entries[0] : Object.freeze(entries)) as T & readonly T[];
    },
    delete(value: WorldComponent | Iterable<WorldComponent>) {
      const { entries } = componentSnapshot(value);
      const records = entries.map((component) => requireDetachable(world, component));
      for (const record of records) {
        if (record.world === world) record.detach?.();
      }
    },
  };
  registerFramework(world, "world");
  clocks.set(world, clock);
  return Object.freeze(world);
}

export const World = Object.freeze({ add });
