import { Agent, Grid, World } from "city-library";
const typed = Grid.create({ x: 2, y: 2 }, { state: { heat: 0 } });
const world = World.create();
const attached = world.add(typed);
const heat: number = attached.fields[0]!.heat;
const agent = Agent.create({ value: 1 });
const batch = world.add([agent, typed]);
world.delete(typed);
void [heat, batch];
// A loose shape is not a canonical admissible Grid.
// @ts-expect-error Grid membership is nominal, not an arbitrary Space-bearing object.
world.add({ space: typed.space });
// @ts-expect-error Typed payload is retained through World.create.
attached.fields[0]!.heat = "wrong";
