import { frameworkOwner, frameworkRecord } from "../../agent/lifecycle.ts";
import type { World } from "../world.ts";
import type { ActivationContext, ActivationOptions, ActivationSource, SelectionOptions, WorldMember } from "./types.ts";
export type { ActivationContext, ActivationOptions, ActivationSource, SelectionOptions, WorldMember } from "./types.ts";

/** Framework kinds that activation accepts as direct members. */
const memberKinds = ["agent", "field", "edge"];
/** Kind names accepted by live World selectors. */
const selectorKinds = ["agents", "fields", "edges"];
const unsupportedCallbackTags = ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"];

/** Activation frame state; `signal` is the private value thrown by `die()`. */
interface Frame { active: boolean; signal: object }
const frames = new WeakMap<object, Frame>();

function requireCallback(callback: unknown): void {
  if (typeof callback !== "function" || unsupportedCallbackTags.includes(Object.prototype.toString.call(callback)))
    throw new TypeError("Expected a synchronous callback.");
}
function rejectThenable<R>(result: R): R {
  if (result !== null && (typeof result === "object" || typeof result === "function") && "then" in result && typeof result.then === "function")
    throw new TypeError("Thenable callback results are unsupported.");
  return result;
}
function callerIdentity(world: World, caller: ActivationContext<WorldMember> | undefined): WorldMember | undefined {
  if (caller === undefined) return undefined;
  if (!frames.get(caller)?.active || caller.world !== world) throw new TypeError("Expired or foreign activation context.");
  return caller.self;
}
/** Captures the source once: arrays dedupe by identity, selectors read live World membership. */
function sourceMembers<T extends WorldMember>(
  world: World,
  source: ActivationSource<T>,
  breeds?: ReadonlyMap<WorldMember, string>,
): T[] {
  if (Array.isArray(source)) return [...new Set(source)];
  const record = frameworkRecord(source);
  if (record && memberKinds.includes(record.kind)) return [source as T];
  const selector = source as { kind?: unknown; breed?: unknown };
  if (source === null || typeof source !== "object" || !selectorKinds.includes(String(selector.kind)))
    throw new TypeError("Expected a World member, array or kind selector.");
  let members: WorldMember[];
  switch (selector.kind) {
    case "agents":
      members = [...world.agents];
      break;
    case "fields":
      members = world.grids.flatMap((grid) => [...grid.fields]);
      break;
    default:
      // "edges": the selector check above admits no other kind.
      members = world.graphs.flatMap((graph) => [...graph.edges]);
  }
  if (selector.breed !== undefined) {
    if (typeof selector.breed !== "string" || !breeds) throw new TypeError("Breed selectors require explicit breed mappings.");
    members = members.filter((member) => breeds.get(member) === selector.breed);
  }
  return members as T[];
}
/** False for deleted members; foreign or non-member values reject. */
function livingOwned(world: World, member: WorldMember): boolean {
  const record = frameworkRecord(member);
  if (!record || !memberKinds.includes(record.kind)) throw new TypeError("Expected a World member.");
  if (!record.alive) return false;
  const owner = frameworkOwner(member);
  if (owner !== world) throw new TypeError("Member does not belong to this World.");
  return true;
}
/** Applies the activation order; "shuffle" permutes `members` in place. */
function ordered<T extends WorldMember>(world: World, members: T[], options: ActivationOptions<T>): T[] {
  const order = options.order ?? "shuffle";
  if (order === "netlogo-7.0.0") throw new TypeError("NetLogo activation requires the not-yet-delivered netlogo-7.0.0 Random stream.");
  if (order === "fixed") return members;
  if (order === "priority") return prioritized(members, options);
  if (order !== "shuffle") throw new TypeError("Unknown activation order.");
  // Descending Fisher–Yates: one integer draw per position from the last index down.
  for (let index = members.length - 1; index > 0; index -= 1) {
    const selected = world.random.number({ min: 0, max: index + 1, integer: true });
    [members[index], members[selected]] = [members[selected]!, members[index]!];
  }
  return members;
}
/** Projects each living member once; lower priorities run first and the stable sort keeps entry order for ties. */
function prioritized<T extends WorldMember>(members: T[], options: ActivationOptions<T>): T[] {
  requireCallback(options.priority);
  const priorities = members.filter((member) => frameworkRecord(member)?.alive !== false).map((member) => {
    // requireCallback above established a callable priority.
    const priority = rejectThenable(options.priority!(member));
    if (typeof priority !== "number") throw new TypeError("Priority must be numeric.");
    if (!Number.isFinite(priority)) throw new RangeError("Priority must be finite.");
    return { member, priority };
  });
  return priorities.sort((first, second) => first.priority - second.priority).map(({ member }) => member);
}
/** Runs one callback in a fresh frame; the frame expires after return, death or error. */
function invoke<T extends WorldMember, R>(
  world: World,
  self: T,
  caller: WorldMember | undefined,
  callback: (context: ActivationContext<T>) => R,
): R | undefined {
  const frame: Frame = { active: true, signal: {} };
  const context: ActivationContext<T> = Object.freeze({
    world, self, caller,
    die(): never {
      if (!frame.active) throw new TypeError("Activation context has expired.");
      const kind = frameworkRecord(self)?.kind;
      if (kind === "field") throw new TypeError("Fields cannot die.");
      (self as Exclude<WorldMember, { grid: object }>).delete();
      throw frame.signal;
    },
  });
  frames.set(context, frame);
  try {
    return rejectThenable(callback(context));
  } catch (error) {
    // Consume only this frame's own death signal.
    if (error !== frame.signal) throw error;
    return undefined;
  } finally {
    frame.active = false;
  }
}
export function activate<T extends WorldMember>(
  world: World,
  source: ActivationSource<T>,
  action: (context: ActivationContext<T>) => unknown,
  options: ActivationOptions<T> = {},
): void {
  requireCallback(action);
  const caller = callerIdentity(world, options.caller);
  const members = ordered(world, sourceMembers(world, source, options.breeds), options);
  for (const member of members) {
    if (livingOwned(world, member)) invoke(world, member, caller, action);
  }
}
export function report<T extends WorldMember, R>(
  world: World,
  source: ActivationSource<T>,
  callback: (context: ActivationContext<T>) => R,
  options: ActivationOptions<T> = {},
): R | undefined | readonly (R | undefined)[] {
  requireCallback(callback);
  const caller = callerIdentity(world, options.caller);
  const members = ordered(world, sourceMembers(world, source, options.breeds), options);
  const results = members.map((member) => livingOwned(world, member) ? invoke(world, member, caller, callback) : undefined);
  return frameworkRecord(source) ? results[0] : Object.freeze(results);
}
export function select<T extends WorldMember>(
  world: World,
  source: ActivationSource<T>,
  predicate: (context: ActivationContext<T>) => boolean,
  options: SelectionOptions = {},
): readonly T[] {
  requireCallback(predicate);
  const caller = callerIdentity(world, options.caller);
  const selected: T[] = [];
  for (const member of sourceMembers(world, source, options.breeds)) {
    if (!livingOwned(world, member)) continue;
    const result = invoke(world, member, caller, predicate);
    if (typeof result !== "boolean") throw new TypeError("Selection predicates must return boolean.");
    // A predicate may delete its member; only members still alive are selected.
    if (result && livingOwned(world, member)) selected.push(member);
  }
  return Object.freeze(selected);
}
