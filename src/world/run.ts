import { worldClock, type World } from "./world.ts";
function preflightProgress(tick: number, steps: number): void {
  if (!Number.isFinite(tick + steps)) throw new RangeError("Tick would overflow.");
  let remaining = steps;
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
export function run<R>(world: World, step: (() => R) &
  ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never), steps = 1): void {
  const clock = worldClock(world);
  if (clock.running) throw new TypeError("Cannot reenter the same World.");
  if (typeof step !== "function") throw new TypeError("Expected a synchronous function.");
  if (Object.prototype.toString.call(step) === "[object AsyncFunction]") throw new TypeError("Async callbacks are unsupported.");
  if (typeof steps !== "number") throw new TypeError("Steps must be numeric.");
  if (!Number.isSafeInteger(steps) || steps < 0) throw new RangeError("Steps must be a nonnegative safe integer.");
  preflightProgress(clock.tick.value, steps);
  clock.running = true;
  try {
    for (let index = 0; index < steps; index += 1) {
      const result = step();
      if (result !== null && (typeof result === "object" || typeof result === "function") && typeof (result as { then?: unknown }).then === "function") throw new TypeError("Thenable callback results are unsupported.");
      clock.completeStep();
    }
  } finally { clock.running = false; }
}
