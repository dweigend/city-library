/** Crates are indivisible goods; blocked producers retain their own put tickets. */
import { Agenda, Store } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface BufferParameters { capacity: number; lotCount: number; firstCollectionTime: number }
export const inputs: Inputs<BufferParameters> = {
  capacity: { kind: "number", default: 2, min: 1, max: 20, integer: true },
  lotCount: { kind: "number", default: 3, min: 0, max: 100, integer: true },
  firstCollectionTime: { kind: "number", default: 4, min: 1, max: 20, integer: true },
};
export function create(options: Partial<BufferParameters> = {}) {
  const settings = parseParameters(inputs, options);
  const agenda = Agenda.create<{ kind: "produce" | "collect" }>();
  const store = Store.create<{ crate: number; producedAtMinutes: number }>({ capacity: settings.capacity });
  let producedLotCount = 0;
  const collected: { crate: number; producedAtMinutes: number; collectedAtMinutes: number }[] = [];
  const history: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  function produce() {
    producedLotCount += 1;
    store.add({ crate: producedLotCount, producedAtMinutes: agenda.time });
  }
  function collect() {
    const crate = store.take();
    if (crate) collected.push({ ...crate, collectedAtMinutes: agenda.time });
  }
  for (let index = 0; index < settings.lotCount; index += 1) {
    agenda.add({ at: index + 1, data: { kind: "produce" } });
    agenda.add({ at: settings.firstCollectionTime + index * 2, data: { kind: "collect" } });
  }
  return {
    produce, collect,
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let step = 0; step < stepCount; step += 1) {
        const until = agenda.time + 1;
        for (let events = 0; ; events += 1) {
          if (events >= 10_000) throw new RangeError("Goods event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          if (event.data.kind === "produce") produce();
          else collect();
        }
        history.push({ x: agenda.time, y: store.items.length });
        if (history.length > 1000) history.shift();
      }
    },
    read() {
      return {
        tick: agenda.time, parameters: { ...settings }, producedLotCount: producedLotCount, storedLotCount: store.items.length,
        blockedLotCount: store.waitingAdditions.length, collectedLotCount: collected.length,
        crates: store.items.map((crate) => ({ ...crate })),
        blockedCrates: store.waitingAdditions.map((request) => ({ ...request.value })),
        deliveries: collected.map((crate) => ({ ...crate })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "Urban Goods Buffer", description: "Producers deliver crates to a store with limited space; collections empty it on a schedule.", inputs, create } satisfies Definition<BufferParameters, ReturnType<typeof create>>;
