import { frameworkOwner, frameworkRecord } from "../../agent/lifecycle.ts";
import type { World } from "../world.ts";
import type { ActivationContext, ActivationOptions, ActivationSource, SelectionOptions, WorldMember } from "./types.ts";
export type { ActivationContext, ActivationOptions, ActivationSource, SelectionOptions, WorldMember } from "./types.ts";

interface Frame { active: boolean; signal: object }
const frames = new WeakMap<object, Frame>();
function requireCallback(callback: unknown): void {
  if (typeof callback !== "function" || ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"].includes(Object.prototype.toString.call(callback)))
    throw new TypeError("Expected a synchronous callback.");
}
function synchronous<R>(result: R): R {
  if (result !== null && (typeof result === "object" || typeof result === "function") && "then" in result && typeof result.then === "function")
    throw new TypeError("Thenable callback results are unsupported.");
  return result;
}
function callerIdentity(world: World, caller: ActivationContext<WorldMember> | undefined): WorldMember | undefined {
  if (caller === undefined) return undefined;
  if (!frames.get(caller)?.active || caller.world !== world) throw new TypeError("Expired or foreign activation context.");
  return caller.self;
}
function sourceMembers<T extends WorldMember>(world: World, source: ActivationSource<T>, breeds?: ReadonlyMap<WorldMember, string>): T[] {
  if (Array.isArray(source)) return [...new Set(source)];
  const record = frameworkRecord(source);
  if (record && ["agent", "field", "edge"].includes(record.kind)) return [source as T];
  const selector = source as { kind?: unknown; breed?: unknown };
  if (source === null || typeof source !== "object" || !["agents", "fields", "edges"].includes(String(selector.kind)))
    throw new TypeError("Expected a World member, array or kind selector.");
  let members: WorldMember[];
  switch (selector.kind) {
    case "agents": members = [...world.agents]; break;
    case "fields": members = world.grids.flatMap((grid) => [...grid.fields]); break;
    default: members = world.graphs.flatMap((graph) => [...graph.edges]);
  }
  if (selector.breed !== undefined) {
    if (typeof selector.breed !== "string" || !breeds) throw new TypeError("Breed selectors require explicit breed mappings.");
    members = members.filter((member) => breeds.get(member) === selector.breed);
  }
  return members as T[];
}
function livingOwned(world: World, member: WorldMember): boolean {
  const record = frameworkRecord(member);
  if (!record || !["agent", "field", "edge"].includes(record.kind)) throw new TypeError("Expected a World member.");
  if (!record.alive) return false;
  const owner = frameworkOwner(member);
  if (owner !== world) throw new TypeError("Member does not belong to this World.");
  return true;
}
function ordered<T extends WorldMember>(world: World, members: T[], options: ActivationOptions<T>): T[] {
  const order = options.order ?? "shuffle";
  if (order === "netlogo-7.0.0") throw new TypeError("NetLogo activation requires the not-yet-delivered netlogo-7.0.0 Random stream.");
  if (order === "fixed") return members;
  if (order === "priority") {
    requireCallback(options.priority);
    const priorities = members.filter((member) => frameworkRecord(member)?.alive !== false).map((member) => {
      const priority = synchronous(options.priority!(member));
      if (typeof priority !== "number") throw new TypeError("Priority must be numeric.");
      if (!Number.isFinite(priority)) throw new RangeError("Priority must be finite.");
      return { member, priority };
    });
    return priorities.sort((a, b) => a.priority - b.priority).map(({ member }) => member);
  }
  if (order !== "shuffle") throw new TypeError("Unknown activation order.");
  for (let index = members.length - 1; index > 0; index -= 1) {
    const selected = world.random.number({ min: 0, max: index + 1, integer: true });
    [members[index], members[selected]] = [members[selected]!, members[index]!];
  }
  return members;
}
function invoke<T extends WorldMember, R>(world: World, self: T, caller: WorldMember | undefined, callback: (context: ActivationContext<T>) => R): R | undefined {
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
  try { return synchronous(callback(context)); }
  catch (error) { if (error !== frame.signal) throw error; return undefined; }
  finally { frame.active = false; }
}
export function activate<T extends WorldMember>(world: World, source: ActivationSource<T>, action: (context: ActivationContext<T>) => unknown, options: ActivationOptions<T> = {}): void {
  requireCallback(action);
  const caller = callerIdentity(world, options.caller);
  const members = ordered(world, sourceMembers(world, source, options.breeds), options);
  for (const member of members) if (livingOwned(world, member)) invoke(world, member, caller, action);
}
export function report<T extends WorldMember, R>(world: World, source: ActivationSource<T>, callback: (context: ActivationContext<T>) => R, options: ActivationOptions<T> = {}): R | undefined | readonly (R | undefined)[] {
  requireCallback(callback);
  const caller = callerIdentity(world, options.caller);
  const members = ordered(world, sourceMembers(world, source, options.breeds), options);
  const results = members.map((member) => livingOwned(world, member) ? invoke(world, member, caller, callback) : undefined);
  return frameworkRecord(source) ? results[0] : Object.freeze(results);
}
export function select<T extends WorldMember>(world: World, source: ActivationSource<T>, predicate: (context: ActivationContext<T>) => boolean, options: SelectionOptions = {}): readonly T[] {
  requireCallback(predicate);
  const caller = callerIdentity(world, options.caller);
  const selected: T[] = [];
  for (const member of sourceMembers(world, source, options.breeds)) {
    if (!livingOwned(world, member)) continue;
    const result = invoke(world, member, caller, predicate);
    if (typeof result !== "boolean") throw new TypeError("Selection predicates must return boolean.");
    if (result && livingOwned(world, member)) selected.push(member);
  }
  return Object.freeze(selected);
}
