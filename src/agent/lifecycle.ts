import type { World } from "../world/world.ts";
export interface DeletionParticipant {
  validate(): void;
  commit(): void;
}
interface FrameworkRecord {
  readonly kind: "agent" | "world" | "random" | "graph" | "edge" | "grid" | "field";
  alive: boolean;
  world?: World;
  detach?: () => void;
  readonly deletionParticipants: Set<DeletionParticipant>;
  worldObservers?: Set<WorldObserver>;
}
/** Private derived-query coordination; observers never own domain state. */
interface WorldObserver {
  membership(component: object, attached: boolean): void;
  movement(agent: object): void;
}
const identities = new WeakMap<object, FrameworkRecord>();
let issued = 0n;
export function issueId(): string {
  issued += 1n;
  return `cl_${((issued * 0x9e3779b97f4a7c15n) ^ 0xd1b54a32d192ed03n).toString(36)}`;
}
export function registerFramework(value: object, kind: FrameworkRecord["kind"]): FrameworkRecord {
  const record: FrameworkRecord = { kind, alive: true, deletionParticipants: new Set() };
  identities.set(value, record);
  return record;
}
export function frameworkRecord(value: unknown): FrameworkRecord | undefined {
  return typeof value === "object" && value !== null ? identities.get(value) : undefined;
}
export function requireAgent(value: unknown): FrameworkRecord {
  const record = frameworkRecord(value);
  if (record?.kind !== "agent") throw new TypeError("Expected an Agent.");
  return record;
}
export function requireLivingAgent(value: unknown): FrameworkRecord {
  const record = requireAgent(value);
  if (!record.alive) throw new TypeError("The Agent has been deleted.");
  return record;
}
export function observeWorld(world: World, observer: WorldObserver): () => void {
  const record = frameworkRecord(world)!;
  const observers = record.worldObservers ??= new Set();
  observers.add(observer);
  return () => { observers.delete(observer); };
}
export function notifyMembership(world: World, component: object, attached: boolean): void {
  for (const observer of [...(frameworkRecord(world)?.worldObservers ?? [])])
    observer.membership(component, attached);
}
export function notifyMovement(agent: object): void {
  const world = frameworkRecord(agent)?.world;
  if (world) for (const observer of frameworkRecord(world)?.worldObservers ?? [])
    observer.movement(agent);
}
