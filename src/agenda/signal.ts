import { issueId } from "../agent/lifecycle.ts";

export type WaitStatus = "waiting" | "satisfied" | "cancelled";
export interface WaitRequest { readonly id: string; readonly status: WaitStatus }
/** Observable value with predicate waits; predicates must not call set, wait or cancel. */
export interface Signal<T> {
  readonly value: T;
  /**
   * Evaluates every waiting predicate against `value` before committing.
   * A throwing predicate leaves value and waits unchanged.
   */
  set(value: T): void;
  /** Returns a satisfied request if `predicate` already holds; otherwise waits. */
  wait(predicate: (value: T) => boolean): WaitRequest;
  /** Cancels a waiting request; finished requests are ignored. */
  cancel(ticket: WaitRequest): void;
}
interface Entry<T> { ticket: WaitRequest; status: WaitStatus; predicate: (value: T) => boolean }

function add<T>(initial: T): Signal<T> {
  let value = initial;
  let evaluating = false;
  const pending: Entry<T>[] = [];
  const issued = new WeakMap<WaitRequest, Entry<T>>();
  function guard() {
    if (evaluating) throw new TypeError("Signal predicates must not reenter mutation methods.");
  }
  function evaluate(predicate: (value: T) => boolean, proposed: T): boolean {
    const result: unknown = predicate(proposed);
    if (typeof result !== "boolean") throw new TypeError("Signal predicates must return a synchronous boolean.");
    return result;
  }
  /** Runs predicate evaluation with mutation methods locked against reentry. */
  function whileEvaluating<R>(evaluation: () => R): R {
    evaluating = true;
    try {
      return evaluation();
    } finally {
      evaluating = false;
    }
  }
  return Object.freeze({
    get value() { return value; },
    set(proposed: T) {
      guard();
      const satisfied = whileEvaluating(() => pending.map((entry) => evaluate(entry.predicate, proposed)));
      // Commit only after every predicate succeeds, preserving atomic failure.
      value = proposed;
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        if (!satisfied[index]) continue;
        // Iterating existing indices downward keeps every index in bounds.
        pending[index]!.status = "satisfied";
        pending.splice(index, 1);
      }
    },
    wait(predicate: (value: T) => boolean) {
      guard();
      if (typeof predicate !== "function") throw new TypeError("Signal wait requires a predicate.");
      if (Object.prototype.toString.call(predicate) === "[object AsyncFunction]") throw new TypeError("Signal predicates must be synchronous.");
      const satisfied = whileEvaluating(() => evaluate(predicate, value));
      // The status getter reads `entry` lazily, after it has been initialized.
      const ticket = Object.freeze({ id: issueId(), get status() { return entry.status; } });
      const entry: Entry<T> = { ticket, status: satisfied ? "satisfied" : "waiting", predicate };
      issued.set(ticket, entry);
      if (!satisfied) pending.push(entry);
      return ticket;
    },
    cancel(ticket: WaitRequest) {
      guard();
      const entry = issued.get(ticket);
      if (!entry) throw new TypeError("Expected a wait ticket issued by this signal.");
      if (entry.status !== "waiting") return;
      pending.splice(pending.indexOf(entry), 1);
      entry.status = "cancelled";
    },
  });
}

export const Signal = Object.freeze({ add });
