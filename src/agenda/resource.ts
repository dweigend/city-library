import { issueId } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { retainParticipant } from "./participation.ts";
import type { QueuePolicy } from "./service-queue.ts";

export type ResourceStatus = "waiting" | "granted" | "released" | "cancelled";
export interface ResourceRequest<T> {
  readonly id: string;
  readonly owner: T;
  readonly units: number;
  readonly status: ResourceStatus;
}
/**
 * Counted capacity with a waiting line. Admission is head-of-line: the first
 * waiter blocks later ones until its units fit. The "priority" policy orders
 * waiters by lower priority first, stable for ties, and never preempts holders.
 */
export interface Resource<T> {
  /** Requests `units` (default 1, at most current capacity); grants immediately when admissible. */
  request(options: { owner: T; units?: number; priority?: number }): ResourceRequest<T>;
  /**
   * Returns granted units; releasing again is a no-op.
   * @throws TypeError for foreign, waiting or cancelled requests.
   */
  release(ticket: ResourceRequest<T>): void;
  /** Withdraws a waiting or granted request; finished requests are ignored. */
  cancel(ticket: ResourceRequest<T>): void;
  /** "reject" (default) refuses to shrink below used units; "retain" keeps current holders. */
  setCapacity(capacity: number, options?: { occupied?: "reject" | "retain" }): void;
  readonly capacity: number;
  readonly used: number;
  readonly available: number;
  readonly waiting: readonly ResourceRequest<T>[];
}
interface Entry<T> {
  ticket: ResourceRequest<T>;
  status: ResourceStatus;
  priority: number;
  release: () => void;
}
function isRequestUnits(value: unknown, capacity: number): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= capacity;
}
function validCapacity(value: unknown): number {
  if (typeof value !== "number") throw new TypeError("Resource capacity must be numeric.");
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("Resource capacity must be a nonnegative safe integer.");
  return value;
}
function add<T>(options: { capacity: number; policy?: QueuePolicy }): Resource<T> {
  const settings = validateOptions(options, ["capacity", "policy"]);
  let capacity = validCapacity(settings.capacity);
  const policy = settings.policy === undefined ? "fifo" : settings.policy;
  if (policy !== "fifo" && policy !== "priority") throw new TypeError("Invalid resource policy.");
  let used = 0;
  const issued = new WeakMap<ResourceRequest<T>, Entry<T>>();
  const waiting: Entry<T>[] = [];
  function admit() {
    while (waiting.length > 0) {
      const entry = waiting[0]!;
      if (entry.ticket.units > capacity - used) break;
      waiting.shift();
      entry.status = "granted";
      used += entry.ticket.units;
    }
  }
  function resolve(ticket: ResourceRequest<T>) {
    const entry = issued.get(ticket);
    if (!entry) throw new TypeError("Expected a request issued by this resource.");
    return entry;
  }
  function finish(entry: Entry<T>, status: "released" | "cancelled") {
    if (entry.status === "granted") used -= entry.ticket.units;
    else if (entry.status === "waiting") waiting.splice(waiting.indexOf(entry), 1);
    entry.status = status;
    entry.release();
    admit();
  }
  return Object.freeze({
    request(options: { owner: T; units?: number; priority?: number }) {
      const settings = validateOptions(options, ["owner", "units", "priority"]);
      if (!Object.hasOwn(settings, "owner")) throw new TypeError("A resource request needs an owner.");
      const units = settings.units === undefined ? 1 : settings.units;
      const priority = settings.priority === undefined ? 0 : settings.priority;
      if (!isRequestUnits(units, capacity))
        throw new RangeError("Request units must be positive safe integers within current capacity.");
      if (typeof priority !== "number" || !Number.isSafeInteger(priority))
        throw new RangeError("Resource priority must be a signed safe integer.");
      const owner = settings.owner as T;
      const release = retainParticipant(owner);
      // The status getter reads `entry` lazily, after it has been initialized.
      const ticket = Object.freeze({ id: issueId(), owner, units, get status() { return entry.status; } });
      const entry: Entry<T> = { ticket, status: "waiting", priority, release };
      issued.set(ticket, entry);
      waiting.push(entry);
      // Reorder waiters only; priority never preempts an existing holder.
      if (policy === "priority") waiting.sort((first, second) => first.priority - second.priority);
      admit();
      return ticket;
    },
    release(ticket: ResourceRequest<T>) {
      const entry = resolve(ticket);
      if (entry.status === "released") return;
      if (entry.status !== "granted") throw new TypeError("Only a granted request can be released.");
      finish(entry, "released");
    },
    cancel(ticket: ResourceRequest<T>) {
      const entry = resolve(ticket);
      if (entry.status === "released" || entry.status === "cancelled") return;
      finish(entry, "cancelled");
    },
    setCapacity(value: number, options: { occupied?: "reject" | "retain" } = {}) {
      const next = validCapacity(value);
      const settings = validateOptions(options, ["occupied"]);
      const occupied = settings.occupied === undefined ? "reject" : settings.occupied;
      if (occupied !== "reject" && occupied !== "retain") throw new TypeError("Invalid occupied capacity policy.");
      if (occupied === "reject" && next < used) throw new RangeError("Capacity cannot shrink below granted units.");
      capacity = next;
      admit();
    },
    get capacity() { return capacity; },
    get used() { return used; },
    get available() { return Math.max(0, capacity - used); },
    get waiting() { return Object.freeze(waiting.map((entry) => entry.ticket)); },
  });
}

export const Resource = Object.freeze({ add });
