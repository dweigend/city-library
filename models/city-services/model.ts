/** Original synthetic daily access model: distance limits and finite capacity; positions are illustrative. */
import { Resource, storage, World, run } from "city-library";
import type { ResourceRequest } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type FacilityLayout = "central" | "distributed";
export interface ServiceParameters {
  capacityPerKind: number;
  maxDistanceKm: number;
  layout: FacilityLayout;
}
export const inputs: Inputs<ServiceParameters> = {
  capacityPerKind: { kind: "number", default: 12, min: 0, max: 24, integer: true },
  maxDistanceKm: { kind: "number", default: 2.5, min: 0, max: 10 },
  layout: { kind: "choice", default: "central", options: ["central", "distributed"] },
};
const policyKeys: readonly (keyof ServiceParameters)[] = ["capacityPerKind", "maxDistanceKm", "layout"];
export type ServiceKind = "school" | "clinic" | "shop";
export type RequestStatus = "served" | "full" | "too-far";
interface Household { id: string; label: string; x: number; y: number }
interface Facility { id: string; kind: ServiceKind; label: string; x: number; y: number; capacity: number; used: number }
export interface ServiceRequest {
  householdId: string;
  kind: ServiceKind;
  status: RequestStatus;
  facilityId: string | null;
  distanceKm: number | null;
}
const serviceKinds: readonly ServiceKind[] = ["school", "clinic", "shop"];
const householdColumnsKm = [-3, -1, 1, 3];
const householdRowsKm = [1.5, 0.5, -0.5, -1.5];
const distributedOffsetKm = 2;
const historyCapacity = 120;

function distanceKm(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function facilitiesFor(parameters: ServiceParameters): Facility[] {
  return serviceKinds.flatMap(kind => parameters.layout === "central"
    ? [{ id: `${kind}:center`, kind, label: `Central ${kind}`, x: 0, y: 0, capacity: parameters.capacityPerKind, used: 0 }]
    : [
      { id: `${kind}:west`, kind, label: `West ${kind}`, x: -distributedOffsetKm, y: 0, capacity: Math.ceil(parameters.capacityPerKind / 2), used: 0 },
      { id: `${kind}:east`, kind, label: `East ${kind}`, x: distributedOffsetKm, y: 0, capacity: Math.floor(parameters.capacityPerKind / 2), used: 0 },
    ]);
}

export function create(options: Partial<ServiceParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const households: Household[] = householdRowsKm.flatMap((y, row) => householdColumnsKm.map((x, column) => {
    const number = row * householdColumnsKm.length + column + 1;
    return { id: `household:${number}`, label: `Household ${number}`, x, y };
  }));
  let facilities = facilitiesFor(parameters);
  let requests: ServiceRequest[] = [];
  let totalServedCount = 0;
  let totalUnmetCount = 0;
  const history = storage.history({ capacity: historyCapacity });

  function servedCountOf(householdId: string) {
    return requests.filter(request => request.householdId === householdId && request.status === "served").length;
  }

  function dailyMeasurements() {
    const served = requests.filter(request => request.status === "served");
    const distances = served.map(request => request.distanceKm ?? 0);
    const householdsByServedCount = [0, 0, 0, 0];
    if (requests.length > 0) for (const household of households) householdsByServedCount[servedCountOf(household.id)]! += 1;
    return {
      demandCount: requests.length,
      servedCount: served.length,
      fullCount: requests.filter(request => request.status === "full").length,
      tooFarCount: requests.filter(request => request.status === "too-far").length,
      underservedHouseholdCount: requests.length === 0 ? 0 : households.length - householdsByServedCount[3]!,
      unservedHouseholdCount: householdsByServedCount[0]!,
      householdsByServedCount,
      meanDistanceKm: served.length === 0 ? 0 : distances.reduce((sum, distance) => sum + distance, 0) / served.length,
      maximumDistanceKm: Math.max(0, ...distances),
    };
  }

  /** Nearest households claim first; each takes the nearest reachable facility with capacity. */
  function allocateDay() {
    const dailyFacilities = facilitiesFor(parameters).map(facility => ({
      facility,
      capacity: Resource.create<Household>({ capacity: facility.capacity }),
      claims: [] as ResourceRequest<Household>[],
    }));
    const nextRequests: ServiceRequest[] = [];
    for (const kind of serviceKinds) {
      const ofKind = dailyFacilities.filter(entry => entry.facility.kind === kind);
      const nearest = (household: Household) => Math.min(...ofKind.map(entry => distanceKm(household, entry.facility)));
      const ordered = households.map((household, index) => ({ household, index }))
        .sort((first, second) => nearest(first.household) - nearest(second.household) || first.index - second.index);
      for (const { household } of ordered) {
        const reachable = ofKind
          .map(entry => ({ entry, distanceKm: distanceKm(household, entry.facility) }))
          .filter(candidate => candidate.distanceKm <= parameters.maxDistanceKm)
          .sort((first, second) => first.distanceKm - second.distanceKm);
        const chosen = reachable.find(candidate => candidate.entry.capacity.available > 0);
        if (chosen) chosen.entry.claims.push(chosen.entry.capacity.request({ owner: household }));
        nextRequests.push({
          householdId: household.id, kind,
          status: chosen ? "served" : reachable.length === 0 ? "too-far" : "full",
          facilityId: chosen?.entry.facility.id ?? null,
          distanceKm: chosen?.distanceKm ?? null,
        });
      }
    }
    facilities = dailyFacilities.map(({ facility, capacity, claims }) => {
      const result = { ...facility, used: capacity.used };
      // Daily service ends here; no holder or queue persists into the next day.
      for (const claim of claims) capacity.release(claim);
      return result;
    });
    // Present requests in household order for stable observations.
    requests = households.flatMap(household => nextRequests.filter(request => request.householdId === household.id));
    const daily = dailyMeasurements();
    totalServedCount += daily.servedCount;
    totalUnmetCount += daily.fullCount + daily.tooFarCount;
  }

  function record() {
    const daily = dailyMeasurements();
    history.add({ tick: world.tick.value, values: {
      servedCount: daily.servedCount, fullCount: daily.fullCount, tooFarCount: daily.tooFarCount,
      unservedHouseholdCount: daily.unservedHouseholdCount, meanDistanceKm: daily.meanDistanceKm,
    } });
  }

  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, allocateDay);
        record();
      }
    },
    setPolicy(changes: Partial<ServiceParameters>) {
      parameters = updateParameters(inputs, parameters, changes, policyKeys);
    },
    setMaxDistanceKm(value: number) {
      parameters = updateParameters(inputs, parameters, { maxDistanceKm: value }, ["maxDistanceKm"]);
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: Object.freeze({ ...parameters }),
        ...dailyMeasurements(),
        totalDemandCount: totalServedCount + totalUnmetCount,
        totalServedCount,
        totalUnmetCount,
        households: Object.freeze(households.map(household => Object.freeze({ ...household, servedCount: servedCountOf(household.id) }))),
        facilities: Object.freeze(facilities.map(facility => Object.freeze({ ...facility }))),
        requests: Object.freeze(requests.map(request => Object.freeze({ ...request }))),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Neighborhood Services",
  description: "Daily access to schools, clinics and shops with a travel limit and finite capacity. Compare one central facility with two distributed ones. Synthetic straight-line distances; changes apply next day.",
  inputs, create,
} satisfies Definition<ServiceParameters, ReturnType<typeof create>>;
