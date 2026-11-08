/** UI-owned action scheduler. Identity and generation checks reject queued stale callbacks. */
export function createRepeatedAction<M extends object>(options: {
  current(): M | undefined;
  enabled(model: M): boolean;
  perform(model: M): void;
  changed(running: boolean): void;
  failed(error: unknown): void;
  intervalMs: number;
  schedule(tick: () => void, intervalMs: number): () => void;
}) {
  if (!Number.isFinite(options.intervalMs) || options.intervalMs <= 0)
    throw new Error("Repeated action interval must be positive and finite.");
  let cancel: (() => void) | undefined;
  let generation = 0;
  function stop() {
    generation++;
    const previous = cancel;
    cancel = undefined;
    previous?.();
    if (previous) options.changed(false);
  }
  function available(model: M | undefined): model is M {
    return model !== undefined && options.enabled(model);
  }
  return {
    get running() { return cancel !== undefined; },
    stop,
    sync() {
      try { if (!available(options.current())) stop(); }
      catch (error) { stop(); throw error; }
    },
    start() {
      if (cancel) return;
      try {
        const owner = options.current();
        if (!available(owner)) return;
        const token = ++generation;
        cancel = options.schedule(() => {
          if (token !== generation) return;
          try {
            if (options.current() !== owner || !available(owner)) { stop(); return; }
            options.perform(owner);
            if (token === generation && (options.current() !== owner || !available(owner))) stop();
          } catch (error) { stop(); options.failed(error); }
        }, options.intervalMs);
        options.changed(true);
      } catch (error) { stop(); options.failed(error); }
    },
  };
}
