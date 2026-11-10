import { Agent, World, run } from "city-library";
function typeContracts() {
  const person = Agent.create({ energy: 10 });
  person.energy = 3;
  // @ts-expect-error Model state retains its numeric type.
  person.energy = "three";
  const world = World.create();
  const attached = world.add(person);
  const energy: number = attached.energy;
  const copied: number = person.copy().energy;
  const batch: readonly Agent<{ energy: number }>[] = world.add([person]);
  // @ts-expect-error Identity is readonly.
  person.id = "replacement";
  // @ts-expect-error World clock is readonly.
  world.tick.value = 2;
  // @ts-expect-error Known Promise callback rejects statically.
  run(world, async () => {});
  // @ts-expect-error Explicit Promise return rejects statically.
  run(world, () => Promise.resolve());
  // Spatial expansion preserves direct public movement typing.
  person.move();
  return [energy, copied, batch];
}
void typeContracts;
