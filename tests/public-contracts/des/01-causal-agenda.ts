import assert from "node:assert/strict";
import { Agenda, World } from "city-library";

// Minutes; one callback can schedule another event before the current horizon.
const agenda = Agenda.create<{ kind: string }>();
const world = World.create();
world.add(agenda);
assert.equal(world.agendas[0], agenda);
agenda.add({ at: 2, data: { kind: "arrival" } });
const arrival = agenda.next({ until: 10 });
assert.equal(arrival?.data.kind, "arrival");
assert.equal(agenda.time, 2);
agenda.add({ at: 3, data: { kind: "departure" } });
assert.equal(agenda.next({ until: 10 })?.at, 3);
assert.equal(agenda.time, 3);
assert.equal(agenda.next({ until: 10 }), undefined);
assert.equal(agenda.time, 10);
assert.equal(world.tick.value, 0);

const ties = Agenda.create<string>();
ties.add({ at: 1, priority: 1, data: "late-priority" });
ties.add({ at: 1, priority: -1, data: "first" });
ties.add({ at: 1, priority: -1, data: "second" });
assert.deepEqual(ties.advance({ until: 4, maxEventCount: 2 }).map(event => event.data), ["first", "second"]);
assert.equal(ties.time, 1);
assert.deepEqual(ties.advance({ until: 4 }).map(event => event.data), ["late-priority"]);
assert.equal(ties.time, 4);

const zeroDelay = Agenda.create<number>();
zeroDelay.add({ at: 0, data: 0 });
for (let handled = 0; handled < 5; handled++) {
  const event = zeroDelay.next({ until: 1 });
  assert(event);
  zeroDelay.add({ at: event.at, data: event.data + 1 });
}
assert.equal(zeroDelay.time, 0);
assert.equal(zeroDelay.size, 1);
assert.equal(zeroDelay.next({ until: 1 })?.data, 5);
assert.equal(zeroDelay.time, 0);
assert.equal(zeroDelay.next({ until: 1 }), undefined);
assert.equal(zeroDelay.time, 1);

const cancelled = agenda.add({ at: 11, data: { kind: "cancelled" } });
agenda.delete(cancelled);
agenda.delete(cancelled);
assert.equal(agenda.next({ until: 11 }), undefined);
// @ts-expect-error Deliberately pass a foreign Agenda's differently typed handle.
assert.throws(() => ties.delete(cancelled));
assert.throws(() => agenda.add({ at: 10, data: { kind: "past" } }));
world.delete(agenda);
assert.equal(world.agendas.length, 0);
console.log("DES causal Agenda, stable ties, explicit budget and separate World tick passed");
