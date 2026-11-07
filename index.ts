export { Agent } from "./src/agent/index.ts";
export { World, run } from "./src/world/index.ts";
export type { Tick } from "./src/world/index.ts";
export { Random } from "./src/random/index.ts";
export type { RandomState } from "./src/random/index.ts";
export { Graph } from "./src/graph/index.ts";
export type { Edge } from "./src/graph/index.ts";
export type { GeneratorOptions } from "./src/graph/index.ts";

export { Grid } from "./src/grid/index.ts";
export { topology } from "./src/grid/topology/index.ts";
export type { Layout, BoundarySegment } from "./src/grid/topology/index.ts";
export type { Field, LayoutGrid, LayoutField } from "./src/grid/index.ts";
export type {
  Space,
  Position,
  Vector,
  Orientation,
} from "./src/geometry/space.ts";
export { stats } from "./src/stats/index.ts";
export type { Histogram, Summary } from "./src/stats/index.ts";
export { geometry } from "./src/geometry/index.ts";
export type { Bounds, PlanarXY, PlanarPolygon, PlanarGeometry, PlanarJson, PlanarFeature, PlanarDataset, ParcelShape, MergeResult, SplitResult } from "./src/geometry/index.ts";
