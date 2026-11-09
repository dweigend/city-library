/** Readable NetLogo Hotelling's Law composition; Wilensky 2009, CC BY-NC-SA 3.0. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  numberOfStores: number;
  layout: "plane" | "line";
  rules: "normal" | "moving-only" | "pricing-only";
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberOfStores: {
    kind: "number",
    default: 3,
    min: 2,
    max: 10,
    integer: true,
  },
  layout: { kind: "choice", default: "plane", options: ["plane", "line"] },
  rules: {
    kind: "choice",
    default: "normal",
    options: ["normal", "moving-only", "pricing-only"],
  },
};
type Store = Agent<{ price: number; areaCount: number; color: number }>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed }),
    space = { x: 41, y: 41, boundary: "hard" as const },
    world = World.add(space, { random }),
    grid = Grid.add(space, { state: { preferredStore: "" } });
  world.add(grid);
  const stores = () => world.agents as readonly Store[];
  const consumers = grid.fields.filter(
    (f) => settings.layout === "plane" || f.x === 0,
  );
  const history: {
    tick: number;
    stores: { id: string; price: number; areaCount: number; revenue: number }[];
  }[] = [];
  const shuffle = <T>(a: readonly T[]) =>
    random.sample(a, { count: a.length, compatibility: "legacy-shuffle" });
  function chooseStoreAt(x: number, y: number) {
    let best = Infinity;
    let candidates: Store[] = [];
    for (const store of stores()) {
      const cost = store.price + store.distanceTo({ x, y });
      if (cost < best) {
        best = cost;
        candidates = [store];
      } else if (cost === best) candidates.push(store);
    }
    return random.sample(candidates)[0]!;
  }
  function recalculateArea() {
    for (const f of shuffle(consumers))
      f.preferredStore = chooseStoreAt(f.x, f.y).id;
    for (const s of stores())
      s.areaCount = consumers.filter((f) => f.preferredStore === s.id).length;
  }
  function potentialMarketShare(store: Store) {
    let share = 0;
    for (const f of shuffle(consumers))
      if (chooseStoreAt(f.x, f.y) === store) share++;
    return share;
  }
  function marketShareIfMoveTo(store: Store, target: { x: number; y: number }) {
    const old = { x: store.x, y: store.y };
    store.move({ to: target });
    try {
      return potentialMarketShare(store);
    } finally {
      store.move({ to: old });
    }
  }
  function potentialRevenue(store: Store, price: number) {
    const old = store.price;
    store.price = price;
    try {
      return potentialMarketShare(store) * price;
    } finally {
      store.price = old;
    }
  }
  function record() {
    history.push({
      tick: world.tick.value,
      stores: stores().map((s) => ({
        id: s.id,
        price: s.price,
        areaCount: s.areaCount,
        revenue: s.price * s.areaCount,
      })),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  for (const color of random.sample(
    [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125, 135],
    { count: settings.numberOfStores },
  )) {
    const f = random.sample(consumers)[0]!;
    world.add(Agent.add({ price: 10, areaCount: 0, color }, { position: f }));
  }
  recalculateArea();
  record();
  function go() {
    // Every candidate is evaluated against the same old state; only decisions are queued.
    const moves =
      settings.rules === "pricing-only"
        ? []
        : shuffle(stores()).map((store) => {
            const current = grid.fieldAt(store)!;
            let candidates = shuffle(
              grid
                .neighbors(current, { neighborhood: "faces" })
                .filter((f) => consumers.includes(f)),
            );
            if (store.areaCount > 0) candidates = [current, ...candidates];
            const scored = candidates.map((f) => ({
              f,
              share: marketShareIfMoveTo(store, f),
            }));
            scored.sort((a, b) => b.share - a.share);
            return { store, target: scored[0]!.f };
          });
    const prices =
      settings.rules === "moving-only"
        ? []
        : shuffle(stores()).map((store) => {
            const candidates = [
              store.price,
              ...shuffle([store.price - 1, store.price + 1]),
            ];
            const scored = candidates.map((price) => ({
              price,
              revenue: potentialRevenue(store, price),
            }));
            scored.sort((a, b) => b.revenue - a.revenue);
            return {
              store,
              price:
                scored.every((v) => v.revenue === 0) && store.price > 1
                  ? store.price - 1
                  : scored[0]!.price,
            };
          });
    for (const { store, target } of moves) store.move({ to: target });
    for (const { store, price } of prices) store.price = price;
    recalculateArea();
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    setRules(value: Pick<Partial<Parameters>, "rules">) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    chooseStoreAt(x: number, y: number) {
      const s = chooseStoreAt(x, y);
      return s.id;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 41,
        height: 41,
        parameters: settings,
        done: false,
        sourceMarker: "hotellings-law:source-v1",
        stores: Object.freeze(
          stores().map((s) =>
            Object.freeze({
              id: s.id,
              x: s.x,
              y: s.y,
              price: s.price,
              areaCount: s.areaCount,
              revenue: s.price * s.areaCount,
              color: s.color,
            }),
          ),
        ),
        consumers: Object.freeze(
          consumers.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              preferredStore: f.preferredStore,
            }),
          ),
        ),
        history: Object.freeze(
          history.map((p) =>
            Object.freeze({
              tick: p.tick,
              stores: Object.freeze(
                p.stores.map((s) => Object.freeze({ ...s })),
              ),
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Hotelling's Law",
  description: "Spatial price competition · Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
