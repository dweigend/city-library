/** Scheduling is caller-owned, independent of model time and renderer frequency. */
export function createPlayback(
  step: () => boolean,
  changed: (running: boolean) => void,
  schedule: (frame: () => void) => () => void,
) {
  let cancel: (() => void) | undefined;
  function stop() {
    if (!cancel) return;
    cancel();
    cancel = undefined;
    changed(false);
  }
  return {
    get running() {
      return cancel !== undefined;
    },
    start() {
      if (cancel) return;
      cancel = schedule(() => {
        try {
          if (!step()) stop();
        } catch (error) {
          stop();
          throw error;
        }
      });
      changed(true);
    },
    stop,
  };
}
