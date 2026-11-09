import { issueId, registerFramework } from "../agent/lifecycle.ts";
import { cloneSupported, validateOptions } from "../agent/state.ts";

export interface EventHandle<E = unknown> {
  readonly id: string;
  readonly agenda: Agenda<E>;
}
export interface Event<E = unknown> {
  readonly id: string;
  readonly at: number;
  readonly priority: number;
  readonly sequence: number;
  readonly data: E;
}
export interface Agenda<E = unknown> {
  readonly time: number;
  readonly size: number;
  add(options: { at: number; data: E; priority?: number }): EventHandle<E>;
  delete(handle: EventHandle<E>): void;
  advance(options: { until: number; maxEvents?: number }): readonly Event<E>[];
  next(options: { until: number }): Event<E> | undefined;
}

function finiteTime(value: unknown, earliest: number): number {
  if (typeof value !== "number") throw new TypeError("Agenda time must be a number.");
  if (!Number.isFinite(value) || value < earliest)
    throw new RangeError("Agenda time must be finite and at least the current time.");
  return value;
}
function priorityValue(value: unknown): number {
  if (typeof value !== "number") throw new TypeError("Agenda priority must be a number.");
  if (!Number.isSafeInteger(value)) throw new RangeError("Agenda priority must be a signed safe integer.");
  return value;
}
function comesBefore<E>(left: Event<E>, right: Event<E>): boolean {
  if (left.at !== right.at) return left.at < right.at;
  if (left.priority !== right.priority) return left.priority < right.priority;
  return left.sequence < right.sequence;
}
function detachedEvent<E>(event: Event<E>): Event<E> {
  // Supported copying preserves the supplied data type and canonical framework references.
  return Object.freeze({ ...event, data: cloneSupported(event.data) as E });
}

function add<E = unknown>(): Agenda<E> {
  if (arguments.length) throw new TypeError("Agenda.add accepts no options.");
  const pending: Event<E>[] = [];
  const handles = new WeakSet<EventHandle<E>>();
  let time = 0;
  let sequence = 0;
  const agenda: Agenda<E> = {
    get time() { return time; },
    get size() { return pending.length; },
    add(options) {
      if (arguments.length !== 1) throw new TypeError("Agenda event creation requires one options record.");
      const values = validateOptions(options, ["at", "data", "priority"]);
      if (!Object.hasOwn(values, "data")) throw new TypeError("Agenda event data is required.");
      const at = finiteTime(values.at, time);
      const priority = priorityValue(values.priority === undefined ? 0 : values.priority);
      if (!Number.isSafeInteger(sequence)) throw new RangeError("Agenda insertion sequence exhausted.");
      const data = cloneSupported(values.data) as E;
      const id = issueId();
      const event = Object.freeze({ id, at, priority, sequence, data });
      const handle = Object.freeze({ id, agenda });
      let low = 0;
      let high = pending.length;
      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        // The binary-search bounds guarantee an existing element at middle.
        if (comesBefore(pending[middle]!, event)) low = middle + 1;
        else high = middle;
      }
      pending.splice(low, 0, event);
      handles.add(handle);
      sequence++;
      return handle;
    },
    delete(handle) {
      if (arguments.length !== 1 || !handles.has(handle))
        throw new TypeError("Expected an issued handle from this Agenda.");
      const index = pending.findIndex(event => event.id === handle.id);
      if (index >= 0) pending.splice(index, 1);
    },
    advance(options) {
      if (arguments.length !== 1) throw new TypeError("Agenda.advance requires one options record.");
      const values = validateOptions(options, ["until", "maxEvents"]);
      const until = finiteTime(values.until, time);
      const maxEvents = values.maxEvents === undefined ? 1000 : values.maxEvents;
      if (typeof maxEvents !== "number") throw new TypeError("Agenda event budget must be a number.");
      if (!Number.isSafeInteger(maxEvents) || maxEvents <= 0)
        throw new RangeError("Agenda event budget must be a positive safe integer.");
      let count = 0;
      while (count < pending.length && count < maxEvents && pending[count]!.at <= until) count++;
      // Copy before mutation so unsupported/deleted data cannot partly consume the batch.
      const events = pending.slice(0, count).map(detachedEvent);
      pending.splice(0, count);
      const dueRemains = pending[0] !== undefined && pending[0].at <= until;
      time = dueRemains && events.length ? events[events.length - 1]!.at : until;
      return Object.freeze(events);
    },
    next(options) {
      if (arguments.length !== 1) throw new TypeError("Agenda.next requires one options record.");
      const values = validateOptions(options, ["until"]);
      const until = finiteTime(values.until, time);
      const first = pending[0];
      if (!first || first.at > until) {
        time = until;
        return undefined;
      }
      const event = detachedEvent(first);
      pending.shift();
      // Even the last event retains its own time for causal follow-up scheduling.
      time = event.at;
      return event;
    },
  };
  registerFramework(agenda, "agenda");
  return Object.freeze(agenda);
}

export const Agenda = Object.freeze({ add });
