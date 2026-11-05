export interface Tick {
  readonly value: number;
  advance(amount?: number): void;
  reset(): void;
}
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
