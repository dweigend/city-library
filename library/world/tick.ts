/** World-owned model time; not wall-clock time and not a step counter. */
export interface Tick {
  /** Current finite, nonnegative value; starts at 0 and may be fractional. */
  readonly value: number;
  /**
   * Adds a finite nonnegative amount (default 1); rejected while the World runs.
   * @throws TypeError while running or for a nonnumeric amount.
   * @throws RangeError for a negative or nonfinite amount or result.
   */
  advance(amount?: number): void;
  /** Sets the value to 0; rejected while the World runs. */
  reset(): void;
}
/** Private World clock: `run` owns `running` and calls `completeStep` once per successful step. */
export interface Clock {
  readonly tick: Tick;
  running: boolean;
  completeStep(): void;
}
export function createClock(): Clock {
  let value = 0;
  const clock: Clock = {
    running: false,
    tick: Object.freeze({
      get value() { return value; },
      advance(amount = 1) {
        if (clock.running) throw new TypeError("Cannot edit Tick during run.");
        if (typeof amount !== "number") throw new TypeError("Tick amount must be numeric.");
        if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(value + amount)) throw new RangeError("Invalid Tick amount.");
        value += amount;
      },
      reset() {
        if (clock.running) throw new TypeError("Cannot reset Tick during run.");
        value = 0;
      },
    }),
    completeStep() { value += 1; },
  };
  return clock;
}
