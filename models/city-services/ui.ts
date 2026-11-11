import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model } from "./model.ts";

// Services received per household: 0 red, 1 orange, 2 yellow, 3 green.
const accessColors = [indexedColor(15), indexedColor(25), indexedColor(45), indexedColor(55)];
const outcomeColors = { served: indexedColor(55), full: scientificPalette.waiting, tooFar: indexedColor(15) };
const facilityColor = scientificPalette.neutral;
const catchmentColor = indexedColor(5);
const linkColor = indexedColor(85);

export const ui = defineUI(model, {
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    layout: { label: "Facility layout (next day)" },
    capacityPerKind: { label: "Capacity per service kind / day (next day)" },
    maxDistanceKm: { label: "Maximum trip (km, next day)" },
  },
  monitors: [
    { label: "Day", value: state => state.tick },
    { label: "Served today", value: state => state.servedCount },
    { label: "Full", value: state => state.fullCount },
    { label: "Too far", value: state => state.tooFarCount },
    { label: "Households with no service", value: state => state.unservedHouseholdCount },
    { label: "Mean trip (km)", value: state => state.meanDistanceKm, format: (value: number) => value.toFixed(2) },
  ],
  views: [
    { type: "spatial", label: "Access map · household color = services received (red 0 → green 3) · diamond: a service was full · triangle: too far · rings show the trip limit · hub label = used/capacity per service kind", data: accessScene },
    { type: "bar", label: "Households by services received today · bar colors match the map", xAxis: { label: "Services received (of 3)" }, yAxis: { label: "Households" },
      series: state => state.householdsByServedCount.map((count, served) => ({ label: `${served} of 3`, color: accessColors[served],
        points: [{ x: `${served}`, y: count }] })) },
    { type: "bar", label: "Daily requests by outcome · bars side by side per completed day", xAxis: { label: "Day" }, yAxis: { label: "Requests" },
      series: state => [
        dailySeries(state, "Served", outcomeColors.served, "servedCount"),
        dailySeries(state, "Full", outcomeColors.full, "fullCount"),
        dailySeries(state, "Too far", outcomeColors.tooFar, "tooFarCount"),
      ] },
    { type: "inspector", label: "Household access", value: (state, selected) => {
      const household = state.households.find(home => home.id === selected);
      if (!household) return undefined;
      const requests = state.requests.filter(request => request.householdId === household.id);
      const describe = (kind: string) => {
        const request = requests.find(candidate => candidate.kind === kind);
        return request ? request.status === "served" ? `served at ${request.facilityId} (${request.distanceKm!.toFixed(2)} km)` : request.status : "not evaluated";
      };
      return { household: household.label, "Position (km)": `${household.x}, ${household.y}`, served: `${household.servedCount} of 3`,
        school: describe("school"), clinic: describe("clinic"), shop: describe("shop") };
    } },
  ],
});

type State = Observation<typeof model>;
const ringSegmentCount = 48;

function accessScene(state: State): SpatialData {
  const sites = [...new Map(state.facilities.map(facility => [`${facility.x},${facility.y}`, facility])).values()];
  const agents: SpatialAgent[] = sites.map(site => ({
    id: `site:${site.x}`, x: site.x, y: site.y, shape: "rectangle", extent: { width: 0.5, height: 0.5 },
    color: facilityColor, selectable: false,
  }));
  const segments: SpatialSegment[] = sites.flatMap(site => ring(site, state.parameters.maxDistanceKm));
  for (const household of state.households) {
    const requests = state.requests.filter(request => request.householdId === household.id);
    const shape = requests.some(request => request.status === "too-far") ? "triangle"
      : requests.some(request => request.status === "full") ? "diamond" : "circle";
    agents.push({ id: household.id, x: household.x, y: household.y, size: 14, shape,
      color: state.tick === 0 ? scientificPalette.unavailable : accessColors[household.servedCount]! });
    const served = new Set(requests.filter(request => request.facilityId !== null).map(request => request.facilityId!.split(":")[1]));
    for (const side of served) {
      const site = state.facilities.find(facility => facility.id.endsWith(`:${side}`))!;
      segments.push({ from: { x: household.x, y: household.y }, to: { x: site.x, y: site.y }, color: linkColor, width: 1.5 });
    }
  }
  const labels = sites.map(site => {
    const used = state.facilities.filter(facility => facility.x === site.x && facility.y === site.y);
    return { x: site.x, y: site.y - 0.72, text: `${used[0]!.used}/${used[0]!.capacity}` };
  });
  return {
    width: 9, height: 4.8, agents, segments, labels,
    description: `Day ${state.tick}: ${sites.length} service site(s), trip limit ${state.parameters.maxDistanceKm} km. ${state.servedCount} of 48 requests served, ${state.fullCount} full, ${state.tooFarCount} too far; ${state.unservedHouseholdCount} households without any service.`,
  };
}

/** The trip limit drawn as a polygonal ring around a site (presentation geometry). */
function ring(center: { x: number; y: number }, radius: number): SpatialSegment[] {
  if (radius <= 0) return [];
  const point = (index: number) => {
    const angle = 2 * Math.PI * index / ringSegmentCount;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  };
  return Array.from({ length: ringSegmentCount }, (_, index) => ({ from: point(index), to: point(index + 1), color: catchmentColor, width: 1 }));
}

function dailySeries(state: State, label: string, color: string, key: "servedCount" | "fullCount" | "tooFarCount") {
  return { label, color, points: state.history.filter(sample => sample.tick > 0).map(sample => ({ x: sample.tick, y: sample.values[key]! })) };
}
