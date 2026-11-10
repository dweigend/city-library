/** Crates are indivisible goods; blocked producers retain their own put tickets. */
import { Agenda, Store } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface BufferParameters { capacity: number; lots: number; firstCollection: number }
export const inputs: Inputs<BufferParameters> = {
  capacity: { kind: "number", default: 2, min: 1, max: 20, integer: true },
  lots: { kind: "number", default: 3, min: 0, max: 100, integer: true },
  firstCollection: { kind: "number", default: 4, min: 1, max: 20, integer: true },
};
export function create(options: Partial<BufferParameters> = {}) {
  const settings = parameters(inputs, options);
  const agenda = Agenda.add<{ kind: "produce" | "collect" }>();
  const store = Store.add<{ crate: number; produced: number }>({ capacity: settings.capacity });
  let produced = 0;
  const collected: { crate: number; produced: number; collected: number }[] = [];
  const history: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  function produce() {
    produced += 1;
    store.put({ crate: produced, produced: agenda.time });
  }
  function collect() {
    const crate = store.take();
    if (crate) collected.push({ ...crate, collected: agenda.time });
  }
  for (let index = 0; index < settings.lots; index += 1) {
    agenda.add({ at: index + 1, data: { kind: "produce" } });
    agenda.add({ at: settings.firstCollection + index * 2, data: { kind: "collect" } });
  }
  return {
    produce, collect,
    advance(count = 1) {
      stepCount(count);
      for (let step = 0; step < count; step += 1) {
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
        tick: agenda.time, parameters: { ...settings }, produced, stored: store.items.length,
        blocked: store.waitingPuts.length, collected: collected.length,
        crates: store.items.map((crate) => ({ ...crate })),
        blockedCrates: store.waitingPuts.map((request) => ({ ...request.value })),
        deliveries: collected.map((crate) => ({ ...crate })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "DES Urban Goods Buffer", description: "A bounded consolidation store with producer backpressure and timed collections. Minutes and indivisible crates.", inputs, create } satisfies Definition<BufferParameters, ReturnType<typeof create>>;
