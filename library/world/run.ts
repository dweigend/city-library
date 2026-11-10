import { worldClock, type World } from "./world.ts";

/**
 * Rejects before the first step unless every planned `+1` clock increment
 * yields a finite value strictly greater than its predecessor.
 */
function preflightProgress(tick: number, stepCount: number): void {
  if (!Number.isFinite(tick + stepCount)) throw new RangeError("Tick would overflow.");
  let remaining = stepCount;
  let current = tick;
  while (remaining > 0) {
    const next = current + 1;
    if (!Number.isFinite(next) || next <= current) throw new RangeError("Tick cannot advance by one.");
    current = next;
    remaining -= 1;
    if (remaining === 0 || current >= 2 ** 53) continue;
    // Within one binary binade, +1 preserves the fractional part exactly.
    // Jump only up to the last value before a power-of-two boundary, then
    // evaluate that boundary's IEEE rounding with the literal recurrence.
    let boundary = 2 ** (Math.floor(Math.log2(current)) + 1);
    while (boundary <= current) boundary *= 2;
    while (boundary / 2 > current) boundary /= 2;
    const exactSteps = Math.min(remaining, Math.max(0, Math.ceil(boundary - current) - 1));
    current += exactSteps;
    remaining -= exactSteps;
  }
}

function isThenable(value: unknown): boolean {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

/**
 * Invokes the synchronous `step` callback `stepCount` times (default 1) and
 * advances `world.tick.value` by 1 after each successful step. A throwing step
 * stops the run, keeps earlier effects and does not advance the tick.
 * All arguments and tick progress are validated before the first step.
 *
 * The conditional parameter type rejects steps whose inferred result can be
 * a PromiseLike; runtime checks still reject async functions and thenables.
 * @throws TypeError for a non-World, reentry, a non-function or async step,
 *   nonnumeric step counts or a thenable step result.
 * @throws RangeError for invalid step counts or unrepresentable tick progress.
 */
export function run<R>(
  world: World,
  step: (() => R) & ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never),
  stepCount = 1,
): void {
  const clock = worldClock(world);
  if (clock.running) throw new TypeError("Cannot reenter the same World.");
  if (typeof step !== "function") throw new TypeError("Expected a synchronous function.");
  if (Object.prototype.toString.call(step) === "[object AsyncFunction]")
    throw new TypeError("Async callbacks are unsupported.");
  if (typeof stepCount !== "number") throw new TypeError("Steps must be numeric.");
  if (!Number.isSafeInteger(stepCount) || stepCount < 0)
    throw new RangeError("Steps must be a nonnegative safe integer.");
  preflightProgress(clock.tick.value, stepCount);
  clock.running = true;
  try {
    for (let index = 0; index < stepCount; index += 1) {
      const result = step();
      if (isThenable(result)) throw new TypeError("Thenable callback results are unsupported.");
      clock.completeStep();
    }
  } finally {
    clock.running = false;
  }
}
