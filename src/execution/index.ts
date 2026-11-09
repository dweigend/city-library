import { validateOptions } from "../agent/state.ts";

/** Compute all proposals before committing any; callbacks own their external effects. */
export function twoPhase<T, Proposal>(source: Iterable<T>, actions: {
  compute(member: T): Proposal;
  commit(member: T, proposal: Proposal): unknown;
}): void {
  // Copy validated own data properties before invoking either typed callback.
  const callbacks = validateOptions(actions, ["compute", "commit"]) as typeof actions;
  requireSynchronous(callbacks.compute);
  requireSynchronous(callbacks.commit);
  const members = [...new Set(source)];
  const proposals = members.map((member) => {
    const proposal = callbacks.compute(member);
    rejectThenable(proposal);
    return proposal;
  });
  members.forEach((member, index) => {
    rejectThenable(callbacks.commit(member, proposals[index]!));
  });
}

function requireSynchronous(callback: unknown): void {
  if (typeof callback !== "function" || ["[object AsyncFunction]", "[object GeneratorFunction]", "[object AsyncGeneratorFunction]"].includes(Object.prototype.toString.call(callback)))
    throw new TypeError("Expected a synchronous callback.");
}
function rejectThenable(value: unknown): void {
  if (value !== null && (typeof value === "object" || typeof value === "function") && "then" in value && typeof value.then === "function")
    throw new TypeError("Thenable results are unsupported.");
}
