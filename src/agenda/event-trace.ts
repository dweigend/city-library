import { cloneSupported, validateOptions } from "../agent/state.ts";

export interface TraceEvent<T> {
  readonly at: number;
  readonly value: T;
}
export interface EventTrace<T> {
  record(event: { at: number; value: T }): void;
  read(): readonly TraceEvent<T>[];
}

function add<T>(options: { capacity: number }): EventTrace<T> {
  if (arguments.length !== 1) throw new TypeError("EventTrace.add requires one options record.");
  const values = validateOptions(options, ["capacity"]);
  const capacity = values.capacity;
  if (typeof capacity !== "number") throw new TypeError("EventTrace capacity must be a number.");
  if (!Number.isSafeInteger(capacity) || capacity <= 0)
    throw new RangeError("EventTrace capacity must be a positive safe integer.");
  const events: TraceEvent<T>[] = [];
  let lastTime = 0;
  return Object.freeze({
    record(event: { at: number; value: T }): void {
      if (arguments.length !== 1) throw new TypeError("EventTrace.record requires one event record.");
      const record = validateOptions(event, ["at", "value"]);
      const at = record.at;
      if (typeof at !== "number") throw new TypeError("EventTrace time must be a number.");
      if (!Number.isFinite(at) || at < lastTime)
        throw new RangeError("EventTrace time must be finite, nonnegative and nondecreasing.");
      if (!Object.hasOwn(record, "value")) throw new TypeError("EventTrace value is required.");
      // Supported copying preserves T while isolating mutable caller data.
      const value = cloneSupported(record.value) as T;
      events.push(Object.freeze({ at, value }));
      if (events.length > capacity) events.shift();
      lastTime = at;
    },
    read(): readonly TraceEvent<T>[] {
      if (arguments.length) throw new TypeError("EventTrace.read accepts no options.");
      return Object.freeze(events.map(event => Object.freeze({ at: event.at, value: cloneSupported(event.value) as T })));
    },
  });
}

export const EventTrace = Object.freeze({ add });
