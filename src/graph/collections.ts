/** One structural guard shared by both collections of a graph. */
export function collectionGuard() {
  let readers = 0;
  return {
    read<R>(action: () => R): R {
      readers += 1;
      try { return action(); }
      finally { readers -= 1; }
    },
    validate() {
      if (readers > 0) throw new Error("Graph structure cannot change during collection iteration.");
    },
    *iterate<T>(values: Iterable<T>): Generator<T, void> {
      readers += 1;
      try { yield* values; }
      finally { readers -= 1; }
    },
  };
}
