import { Grid, Random, topology, type Layout } from "city-library";

const random = Random.create({ seed: 7 });
const layout: Layout = topology.quadrilaterals({ rings: 3, random });
const revision: Layout = topology.relax({ layout, method: "squareTarget", iterations: 0 });
const grid = Grid.create({ layout: revision, state: { population: 0 } });
const population: number = grid.fields[0]!.population;
void population;
// @ts-expect-error Finite generation requires an explicit Random.
topology.quadrilaterals({ rings: 3 });
// @ts-expect-error The arbitrary-domain overload is deferred research.
topology.quadrilaterals({ boundary: layout.polygon({ cell: 0 }), pointSpacing: 1, random });
// @ts-expect-error Mutually exclusive finite and research options cannot be mixed.
topology.quadrilaterals({ rings: 3, boundary: layout.polygon({ cell: 0 }), random });
// @ts-expect-error Refinement and relaxation are separate operations.
topology.quadrilaterals({ rings: 3, relaxationIterations: 8, random });
// @ts-expect-error Lloyd needs a future Voronoi-site contract.
topology.relax({ layout, method: "lloyd", iterations: 8 });
// @ts-expect-error Square target never consumes caller randomness.
topology.relax({ layout, method: "squareTarget", iterations: 8, random });
// @ts-expect-error No unfrozen damping option is exposed.
topology.relax({ layout, method: "squareTarget", iterations: 8, strength: 0.5 });
// @ts-expect-error A layout Grid has no fabricated regular Space.
grid.space;
// @ts-expect-error A layout Grid has no uniform cell size.
grid.cellSize;
// @ts-expect-error Irregular diffusion requires a separate future contract.
grid.diffuse("population");
const mixedGeneration = { rings: 1, boundary: layout.polygon({ cell: 0 }), random };
// @ts-expect-error Forbidden research keys also reject named-variable input.
topology.quadrilaterals(mixedGeneration);
const mixedRelaxation = { layout, method: "squareTarget" as const, iterations: 1, random };
// @ts-expect-error Forbidden RNG is rejected beyond object-literal excess checks.
topology.relax(mixedRelaxation);
const mixedStrength = { layout, method: "squareTarget" as const, iterations: 1, strength: 0.5 };
// @ts-expect-error An unsupported numerical control is not silently ignored.
topology.relax(mixedStrength);
