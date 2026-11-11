import { issueId } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { retainParticipant } from "./participation.ts";

// Two ticket kinds: an addition always carries its value and ends "stored",
// while a request has no value until it ends "received".
export type StoreAdditionStatus = "waiting" | "stored" | "cancelled";
export type StoreRequestStatus = "waiting" | "received" | "cancelled";
export interface StoreAddition<T> { readonly id: string; readonly value: T; readonly status: StoreAdditionStatus }
export interface StoreRequest<T> { readonly id: string; readonly value: T | undefined; readonly status: StoreRequestStatus }
/**
 * Bounded FIFO store with waiting producers and consumers. Waiting consumers
 * receive stored items first, then values of waiting producers.
 */
export interface Store<T> {
  /** Stores `value` when capacity allows; otherwise the producer waits. */
  add(value: T): StoreAddition<T>;
  /** Receives the oldest available value, or waits for one. */
  request(): StoreRequest<T>;
  /** Receives a stored item immediately; undefined when none is stored. */
  take(): T | undefined;
  /** Withdraws a waiting producer or consumer; finished tickets are ignored. */
  cancel(ticket: StoreAddition<T> | StoreRequest<T>): void;
  readonly items: readonly T[];
  readonly waitingAdditions: readonly StoreAddition<T>[];
  readonly waitingRequests: readonly StoreRequest<T>[];
}
interface AdditionEntry<T> { ticket: StoreAddition<T>; status: StoreAdditionStatus; release: () => void }
interface RequestEntry<T> { ticket: StoreRequest<T>; status: StoreRequestStatus; value: T | undefined }

function validCapacity(value: unknown): number {
  if (typeof value !== "number") throw new TypeError("Store capacity must be numeric.");
  if (!Number.isSafeInteger(value) || value < 1) throw new RangeError("Store capacity must be a positive safe integer.");
  return value;
}

function create<T>(options: { capacity: number }): Store<T> {
  const settings = validateOptions(options, ["capacity"]);
  const capacity = validCapacity(settings.capacity);
  const items: AdditionEntry<T>[] = [];
  const producers: AdditionEntry<T>[] = [];
  const consumers: RequestEntry<T>[] = [];
  const additionTickets = new WeakMap<StoreAddition<T>, AdditionEntry<T>>();
  const requestTickets = new WeakMap<StoreRequest<T>, RequestEntry<T>>();
  function transfer(addition: AdditionEntry<T>, request: RequestEntry<T>) {
    addition.status = "stored";
    request.status = "received";
    request.value = addition.ticket.value;
    addition.release();
  }
  function settle() {
    // Loop conditions guarantee that every shift below returns an entry.
    while (consumers.length > 0 && (items.length > 0 || producers.length > 0)) {
      const addition = items.shift() ?? producers.shift()!;
      transfer(addition, consumers.shift()!);
    }
    while (items.length < capacity && producers.length > 0) {
      const addition = producers.shift()!;
      addition.status = "stored";
      items.push(addition);
    }
  }
  function request(): StoreRequest<T> {
    // The getters read `entry` lazily, after it has been initialized.
    const ticket = Object.freeze({ id: issueId(), get value() { return entry.value; }, get status() { return entry.status; } });
    const entry: RequestEntry<T> = { ticket, status: "waiting", value: undefined };
    requestTickets.set(ticket, entry);
    consumers.push(entry);
    settle();
    return ticket;
  }
  return Object.freeze({
    add(value: T) {
      const release = retainParticipant(value);
      // The status getter reads `entry` lazily, after it has been initialized.
      const ticket = Object.freeze({ id: issueId(), value, get status() { return entry.status; } });
      const entry: AdditionEntry<T> = { ticket, status: "waiting", release };
      additionTickets.set(ticket, entry);
      producers.push(entry);
      settle();
      return ticket;
    },
    request,
    take() {
      if (items.length === 0) return undefined;
      return request().value;
    },
    cancel(ticket: StoreAddition<T> | StoreRequest<T>) {
      const addition = additionTickets.get(ticket as StoreAddition<T>);
      if (addition) {
        if (addition.status !== "waiting") return;
        producers.splice(producers.indexOf(addition), 1);
        addition.status = "cancelled";
        addition.release();
        settle();
        return;
      }
      const request = requestTickets.get(ticket as StoreRequest<T>);
      if (!request) throw new TypeError("Expected a ticket issued by this store.");
      if (request.status !== "waiting") return;
      consumers.splice(consumers.indexOf(request), 1);
      request.status = "cancelled";
      settle();
    },
    get items() { return Object.freeze(items.map((entry) => entry.ticket.value)); },
    get waitingAdditions() { return Object.freeze(producers.map((entry) => entry.ticket)); },
    get waitingRequests() { return Object.freeze(consumers.map((entry) => entry.ticket)); },
  });
}

export const Store = Object.freeze({ create });
