import { issueId } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { retainParticipant } from "./participation.ts";

export type QueuePolicy = "fifo" | "priority";
export interface QueueHandle<T> { readonly id: string; readonly value: T }
export interface ServiceQueue<T> {
  add(value: T, options?: { priority?: number }): QueueHandle<T>;
  take(): T | undefined;
  delete(handle: QueueHandle<T>): void;
  readonly entries: readonly T[];
}
interface Entry<T> { handle: QueueHandle<T>; priority: number; release: () => void }

function create<T>(options: { policy?: QueuePolicy } = {}): ServiceQueue<T> {
  const settings = validateOptions(options, ["policy"]);
  const policy = settings.policy === undefined ? "fifo" : settings.policy;
  if (policy !== "fifo" && policy !== "priority") throw new TypeError("Invalid queue policy.");
  const issued = new WeakMap<QueueHandle<T>, Entry<T>>();
  const entries: Entry<T>[] = [];
  function remove(entry: Entry<T>) {
    const index = entries.indexOf(entry);
    if (index < 0) return;
    entries.splice(index, 1);
    entry.release();
  }
  return Object.freeze({
    add(value: T, options: { priority?: number } = {}) {
      const settings = validateOptions(options, ["priority"]);
      const priority = settings.priority === undefined ? 0 : settings.priority;
      if (typeof priority !== "number" || !Number.isSafeInteger(priority)) throw new RangeError("Queue priority must be a signed safe integer.");
      const release = retainParticipant(value);
      const handle = Object.freeze({ id: issueId(), value });
      const entry = { handle, priority, release };
      issued.set(handle, entry);
      entries.push(entry);
      if (policy === "priority") entries.sort((first, second) => first.priority - second.priority);
      return handle;
    },
    take() {
      const entry = entries[0];
      if (!entry) return undefined;
      remove(entry);
      return entry.handle.value;
    },
    delete(handle: QueueHandle<T>) {
      const entry = issued.get(handle);
      if (!entry) throw new TypeError("Expected a handle issued by this service queue.");
      remove(entry);
    },
    get entries() { return Object.freeze(entries.map((entry) => entry.handle.value)); },
  });
}

export const ServiceQueue = Object.freeze({ create });
