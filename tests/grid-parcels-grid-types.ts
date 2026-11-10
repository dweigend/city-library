import { Agent, Grid, World, topology, type Field } from "city-library";

const layout = topology.hex({ columns: 2, rows: 2 });
const grid = Grid.create({ layout, state: { temperature: 12 } });
const attached = World.create().add(grid);
const field = attached.fields[0]!;
const temperature: number = field.temperature;
const ownerLayout = field.grid.layout;
const regular = Grid.create({ x: 2, y: 2 }, { state: { temperature: 0 } });
const legacyField: Field<{ temperature: number }> = regular.fields[0]!;
const ownerCellSize: number = legacyField.grid.cellSize;
const source = [Agent.create({ name: "typed" })];
const named = grid.agentsAt(field, { source });
const name: string | undefined = named[0]?.name;
void [temperature, ownerLayout, ownerCellSize, name];

// @ts-expect-error A layout Grid has no fabricated regular extent.
grid.space;
// @ts-expect-error A layout Grid has no uniform cell size.
grid.cellSize;
// @ts-expect-error Regular diffusion does not apply to arbitrary layouts.
grid.diffuse("temperature");
// @ts-expect-error Layout adjacency does not accept Moore/faces options.
grid.neighbors(field, { neighborhood: "faces" });
// @ts-expect-error Typed direct state survives World admission.
attached.fields[0]!.temperature = "invalid";
// @ts-expect-error Field.grid preserves the actual layout owner.
field.grid.cellSize;
// @ts-expect-error Regular Fields cannot be confused with layout Fields.
grid.neighbors(legacyField);
// @ts-expect-error The additive overload requires explicit state.
Grid.create({ layout });
