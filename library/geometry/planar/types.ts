/** Caller-owned planar XY data; no CRS transformation is implied. */
export type PlanarXY = readonly [number, number];
export type PlanarPolygon = { readonly type: "Polygon"; readonly coordinates: readonly (readonly PlanarXY[])[] };
export type PlanarGeometry =
  | { readonly type: "Point"; readonly coordinates: PlanarXY }
  | { readonly type: "MultiPoint" | "LineString"; readonly coordinates: readonly PlanarXY[] }
  | { readonly type: "MultiLineString"; readonly coordinates: readonly (readonly PlanarXY[])[] }
  | PlanarPolygon
  | { readonly type: "MultiPolygon"; readonly coordinates: readonly (readonly (readonly PlanarXY[])[])[] }
  | { readonly type: "GeometryCollection"; readonly geometries: readonly PlanarGeometry[] };
export type PlanarJson = null | boolean | number | string | readonly PlanarJson[] | { readonly [key: string]: PlanarJson };
export interface PlanarFeature {
  readonly type: "Feature";
  readonly id?: string | number;
  readonly geometry: PlanarGeometry | null;
  readonly properties: Readonly<Record<string, PlanarJson>> | null;
}
export interface PlanarDataset {
  readonly features: readonly PlanarFeature[];
  readonly coordinateSystem: { readonly crs: string; readonly units: string };
}
