import { issueId } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { retainParticipant } from "./participation.ts";

export type PutStatus = "waiting" | "stored" | "cancelled";
export type GetStatus = "waiting" | "received" | "cancelled";
export interface PutRequest<T> { readonly id: string; readonly value: T; readonly status: PutStatus }
export interface GetRequest<T> { readonly id: string; readonly value: T | undefined; readonly status: GetStatus }
export interface Store<T> {
  put(value: T): PutRequest<T>;
  get(): GetRequest<T>;
  take(): T | undefined;
  cancelPut(ticket: PutRequest<T>): void;
  cancelGet(ticket: GetRequest<T>): void;
  readonly items: readonly T[];
  readonly waitingPuts: readonly PutRequest<T>[];
  readonly waitingGets: readonly GetRequest<T>[];
}
interface PutEntry<T> { ticket: PutRequest<T>; status: PutStatus; release: () => void }
interface GetEntry<T> { ticket: GetRequest<T>; status: GetStatus; value: T | undefined }

function add<T>(options: { capacity: number }): Store<T> {
  const settings = validateOptions(options, ["capacity"]);
  const suppliedCapacity = settings.capacity;
  if (typeof suppliedCapacity !== "number") throw new TypeError("Store capacity must be numeric.");
  const capacity = suppliedCapacity;
  if (!Number.isSafeInteger(capacity) || capacity < 1) throw new RangeError("Store capacity must be a positive safe integer.");
  const items: PutEntry<T>[] = [];
  const producers: PutEntry<T>[] = [];
  const consumers: GetEntry<T>[] = [];
  const putTickets = new WeakMap<PutRequest<T>, PutEntry<T>>();
  const getTickets = new WeakMap<GetRequest<T>, GetEntry<T>>();
  function transfer(put: PutEntry<T>, get: GetEntry<T>) {
    put.status = "stored";
    get.status = "received";
    get.value = put.ticket.value;
    put.release();
  }
  function settle() {
    while (consumers.length > 0 && (items.length > 0 || producers.length > 0)) {
      const put = items.shift() ?? producers.shift()!;
      transfer(put, consumers.shift()!);
    }
    while (items.length < capacity && producers.length > 0) {
      const put = producers.shift()!;
      put.status = "stored";
      items.push(put);
    }
  }
  function get(): GetRequest<T> {
    const entry: GetEntry<T> = { ticket: undefined!, status: "waiting", value: undefined };
    const ticket = Object.freeze({ id: issueId(), get value() { return entry.value; }, get status() { return entry.status; } });
    entry.ticket = ticket;
    getTickets.set(ticket, entry);
    consumers.push(entry);
    settle();
    return ticket;
  }
  return Object.freeze({
    put(value: T) {
      const release = retainParticipant(value);
      const entry: PutEntry<T> = { ticket: undefined!, status: "waiting", release };
      const ticket = Object.freeze({ id: issueId(), value, get status() { return entry.status; } });
      entry.ticket = ticket;
      putTickets.set(ticket, entry);
      producers.push(entry);
      settle();
      return ticket;
    },
    get,
    take() {
      if (items.length === 0) return undefined;
      return get().value;
    },
    cancelPut(ticket: PutRequest<T>) {
      const entry = putTickets.get(ticket);
      if (!entry) throw new TypeError("Expected a producer ticket issued by this store.");
      if (entry.status !== "waiting") return;
      producers.splice(producers.indexOf(entry), 1);
      entry.status = "cancelled";
      entry.release();
      settle();
    },
    cancelGet(ticket: GetRequest<T>) {
      const entry = getTickets.get(ticket);
      if (!entry) throw new TypeError("Expected a consumer ticket issued by this store.");
      if (entry.status !== "waiting") return;
      consumers.splice(consumers.indexOf(entry), 1);
      entry.status = "cancelled";
      settle();
    },
    get items() { return Object.freeze(items.map((entry) => entry.ticket.value)); },
    get waitingPuts() { return Object.freeze(producers.map((entry) => entry.ticket)); },
    get waitingGets() { return Object.freeze(consumers.map((entry) => entry.ticket)); },
  });
}

export const Store = Object.freeze({ add });
