import assert from "node:assert/strict";
import {
  Random,
  geometry,
  type PlanarPolygon,
  type PlanarXY,
} from "city-library";

// Lengths in metres; areas in square metres. The missing exports are intentional.
const random = Random.create({
  seed: 42,
});

const site: PlanarPolygon = {
  type: "Polygon",
  coordinates: [
    [[0, 0], [100, 0], [100, 100], [0, 100], [0, 0]],
  ],
};

const northSouthStreet = random.number({
  min: 30,
  max: 70,
});

const eastWestStreet = random.number({
  min: 30,
  max: 70,
});

const streetLines: readonly (readonly PlanarXY[])[] = [
  [[northSouthStreet, 0], [northSouthStreet, 100]],
  [[0, eastWestStreet], [100, eastWestStreet]],
];

const roads = geometry.corridor({
  paths: streetLines,
  width: 8,
  endCap: "butt",
});

if (roads.status !== "ok") {
  throw new Error(`Road generation: ${roads.status}`);
}

const land = geometry.subtract({
  shape: site,
  excludedShapes: roads.parts,
});

if (land.status !== "ok" && land.status !== "unchanged") {
  throw new Error(`Block extraction: ${land.status}`);
}

const subdivisions = land.parts.map(divideBlock);

const quarter = {
  site,
  streetLines,
  streetSurfaces: roads.parts,
  blocks: land.parts,
  subdivisions,
};

export default quarter;

// Oracles come from the fixture, not from a candidate implementation.
// Road union: 2 * 100 * 8 - 8 * 8 = 1536; remaining land: 8464.
const acceptedParts = subdivisions.flatMap(result => result.parts);
const remainingParts = subdivisions.flatMap(result => result.remainingParts);
const acceptedShapes = acceptedParts.map(part => part.shape);
const remainingShapes = remainingParts.map(part => part.shape);
const statuses = subdivisions.map(result => result.status);
const preservedShapes = [...acceptedShapes, ...remainingShapes];

assert.equal(geometry.area({ shape: site }), 10000);
assert.equal(land.parts.length, 4);
assert.ok(Math.abs(totalArea(land.parts) - 8464) <= 1e-5);
assert.ok(Math.abs(10000 - totalArea(land.parts) - 1536) <= 1e-5);
assert.deepEqual(statuses, ["ok", "ok", "ok", "ok"]);
assert.equal(remainingParts.length, 0);
assert.ok(acceptedParts.length > 4);
assert.ok(Math.abs(totalArea(preservedShapes) - 8464) <= 1e-5);

for (const shape of acceptedShapes) assert.ok(geometry.area({ shape }) >= 100);
for (const shape of acceptedShapes) assert.ok(geometry.area({ shape }) <= 400);

function divideBlock(shape: PlanarPolygon) {
  return geometry.subdivide({
    shape,
    method: "orientedBoundingBox",
    targetArea: 400,
    minimumArea: 100,
    maximumParcels: 32,
    maximumAttempts: 64,
  });
}

function totalArea(shapes: readonly PlanarPolygon[]) {
  let total = 0;

  for (const shape of shapes) total += geometry.area({ shape });

  return total;
}
