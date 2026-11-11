import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

const useColors = {
  residential: indexedColor(25),
  commercial: indexedColor(105),
  green: indexedColor(55),
};
const protectedOutline = scientificPalette.neutral;
// A pale diamond with a dark outline marks parcels changed this year; it stays visible on every use color.
const changedMarker = scientificPalette.neutral;
const markerOutline = indexedColor(0);
const edgeColor = indexedColor(115);

export const ui = defineUI(model, {
  setup: [{ field: "conversionLimit", label: "Conversions per year (parcels)" }],
  live: {
    residentialDemand: { label: "Residential target (ha)", set: (instance, value) => instance.setDemand({ residentialDemand: value }) },
    commercialDemand: { label: "Commercial target (ha)", set: (instance, value) => instance.setDemand({ commercialDemand: value }) },
    growthPattern: { label: "Growth pattern", set: (instance, value) => instance.setGrowthPattern(value) },
  },
  actions: [
    { label: "Protect green corridor (6 ha)", run: instance => instance.applyProtectionPlan("corridor") },
    { label: "Protect scattered parcels (6 ha)", run: instance => instance.applyProtectionPlan("scattered") },
    { label: "Clear protection", run: instance => instance.applyProtectionPlan("none"),
      enabled: state => state.protectedAreaHa > 0 },
    {
      label: "Toggle selected parcel protection",
      enabled: (state, selected) => state.parcels.some(parcel => parcel.id === selected),
      run: (instance, selected) => {
        const parcel = instance.read().parcels.find(candidate => candidate.id === selected);
        if (parcel) instance.setProtection(parcel.id, !parcel.isProtected);
      },
    },
  ],
  monitors: [
    { label: "Year", value: state => state.tick },
    { label: "Converted this year", value: state => state.convertedParcelCount },
    { label: "Protected (ha)", value: state => state.protectedAreaHa },
    { label: "Largest green patch (ha)", value: state => state.largestGreenPatchHa },
    { label: "Green patches", value: state => state.greenPatchCount },
    { label: "Urban edge (km)", value: state => state.urbanEdgeKm, format: (value: number) => value.toFixed(1) },
    { label: "Unmet demand (ha)", value: state => state.unmetResidentialDemand + state.unmetCommercialDemand },
  ],
  views: [
    { type: "spatial", label: "Parcels · orange residential, blue commercial, green open land · white outline protected · white diamond: converted this year", data: parcelData },
    {
      type: "line", label: "Open land and its largest connected patch", xAxis: { label: "Year" }, yAxis: { unit: "ha" },
      series: state => [
        { label: "All green land", color: useColors.green, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.greenAreaHa! })) },
        { label: "Largest connected patch", color: indexedColor(5), points: state.history.map(sample => ({ x: sample.tick, y: sample.values.largestGreenPatchHa! })) },
      ],
    },
    {
      type: "line", label: "Built area", xAxis: { label: "Year" }, yAxis: { unit: "ha" },
      series: state => [
        { label: "Residential", color: useColors.residential, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.residentialAreaHa! })) },
        { label: "Commercial", color: useColors.commercial, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.commercialAreaHa! })) },
      ],
    },
    {
      type: "line", label: "Urban edge · boundary between built and open land", xAxis: { label: "Year" }, yAxis: { unit: "km" },
      series: state => [{ label: "Urban edge", color: edgeColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.urbanEdgeKm! })) }],
    },
    {
      type: "inspector", label: "Selected parcel",
      value: (state, selected) => {
        const parcel = state.parcels.find(candidate => candidate.id === selected);
        return parcel ? {
          parcel: parcel.id, column: parcel.column, row: parcel.row, use: parcel.use,
          protection: parcel.isProtected ? "Protected" : "Convertible",
          "Changed this year": parcel.changedThisYear ? "Yes" : "No", areaHa: parcel.areaHa,
        } : undefined;
      },
    },
  ],
});

function parcelData(state: Observation<typeof model>): SpatialData {
  const parcels: SpatialAgent[] = state.parcels.map(parcel => ({
    id: parcel.id, x: parcel.x, y: parcel.y,
    shape: "rectangle", extent: { width: 0.88, height: 0.88 },
    color: useColors[parcel.use],
    stroke: parcel.isProtected ? protectedOutline : undefined,
    strokeWidth: parcel.isProtected ? 3 : 0,
  }));
  const markers: SpatialAgent[] = state.parcels.filter(parcel => parcel.changedThisYear).map(parcel => ({
    id: `${parcel.id}:changed`, x: parcel.x, y: parcel.y, size: 12, shape: "diamond",
    color: changedMarker, stroke: markerOutline, strokeWidth: 1.5, selectable: false,
  }));
  return {
    width: 8, height: 6,
    description: `48 one-hectare parcels: ${state.residentialAreaHa} residential, ${state.commercialAreaHa} commercial, ${state.greenAreaHa} green in ${state.greenPatchCount} patches; ${state.protectedAreaHa} hectares protected; ${state.convertedParcelCount} changed this year.`,
    agents: [...parcels, ...markers],
  };
}
