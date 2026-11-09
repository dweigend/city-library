import { describe, expect, test } from "bun:test";
import { scientificPalette } from "../ui/index.ts";
import type { SpatialData } from "../ui/index.ts";
import { create as office } from "../experiments/des-civic-office/model.ts";
import { officeScene } from "../experiments/des-civic-office/scene.ts";
import { create as charging } from "../experiments/des-ev-charging/model.ts";
import { chargingScene } from "../experiments/des-ev-charging/scene.ts";
import { create as buffer } from "../experiments/des-goods-buffer/model.ts";
import { bufferScene } from "../experiments/des-goods-buffer/scene.ts";
import { create as buses } from "../experiments/des-bus-interchange/model.ts";
import { busScene } from "../experiments/des-bus-interchange/scene.ts";
import { create as parcels } from "../experiments/des-parcel-logistics/model.ts";
import { parcelScene } from "../experiments/des-parcel-logistics/scene.ts";
import { create as waste } from "../experiments/des-waste-collection/model.ts";
import { scene as wasteScene } from "../experiments/des-waste-collection/scene.ts";
import { create as dispatch } from "../experiments/des-emergency-dispatch/model.ts";
import { scene as dispatchScene } from "../experiments/des-emergency-dispatch/scene.ts";
import { create as bikes } from "../experiments/des-bike-redistribution/model.ts";
import { scene as bikeScene } from "../experiments/des-bike-redistribution/scene.ts";
import { create as water } from "../experiments/des-water-allocation/model.ts";
import { scene as waterScene } from "../experiments/des-water-allocation/scene.ts";
import { create as maintenance } from "../experiments/des-machine-maintenance/model.ts";
import { scene as maintenanceScene } from "../experiments/des-machine-maintenance/scene.ts";
import { create as elevator } from "../experiments/des-elevator/model.ts";
import { elevatorScene } from "../experiments/des-elevator/ui.ts";

const colors = new Set<string>(Object.values(scientificPalette));
const count = (scene: SpatialData, prefix: string) => scene.agents.filter(agent => agent.id.startsWith(prefix)).length;
const filled = (scene: SpatialData, prefix: string) => scene.agents.filter(agent => agent.id.startsWith(prefix) && agent.filled !== false).length;

function checkGeometry(scene: SpatialData) {
  expect(scene.width).toBeGreaterThan(0);
  expect(scene.height).toBeGreaterThan(0);
  expect(scene.description!.length).toBeGreaterThan(20);
  expect(new Set(scene.agents.map(agent => agent.id)).size).toBe(scene.agents.length);
  const point = (x: number, y: number) => {
    expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
    expect(Math.abs(x)).toBeLessThanOrEqual(scene.width / 2);
    expect(Math.abs(y)).toBeLessThanOrEqual(scene.height / 2);
  };
  for (const agent of scene.agents) {
    point(agent.x, agent.y);
    expect(Math.abs(agent.x) + (agent.extent?.width ?? 0) / 2).toBeLessThanOrEqual(scene.width / 2);
    expect(Math.abs(agent.y) + (agent.extent?.height ?? 0) / 2).toBeLessThanOrEqual(scene.height / 2);
    if (agent.color !== undefined) expect(colors.has(agent.color)).toBe(true);
    if (agent.stroke !== undefined) expect(colors.has(agent.stroke)).toBe(true);
  }
  for (const label of scene.labels ?? []) point(label.x, label.y);
  for (const segment of scene.segments ?? []) {
    point(segment.from.x, segment.from.y);
    point(segment.to.x, segment.to.y);
  }
}

function exercise<State>(instance: { read(): State; advance(count?: number): void }, project: (state: State) => SpatialData,
  verify: (state: State, scene: SpatialData) => void, steps = 40) {
  for (let step = 0; step <= steps; step++) {
    const state = instance.read();
    const before = structuredClone(state);
    const scene = project(state);
    checkGeometry(scene);
    verify(state, scene);
    expect(state).toEqual(before);
    expect(instance.read()).toEqual(before);
    expect(project(state)).toEqual(scene);
    if (step < steps) instance.advance();
  }
}

describe("independent public scene parity", () => {
  test("all service scenes preserve complete entity populations and semantic states", () => {
    exercise(office({ residents: 100, clerks: 10 }), officeScene, (state, scene) => {
      expect(count(scene, "resident:")).toBe(state.residents.length);
      expect(count(scene, "desk:")).toBe(state.parameters.clerks);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.waiting)).toHaveLength(state.waiting);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.active)).toHaveLength(state.busy);
    });
    exercise(charging({ vehicles: 100, chargers: 10 }), chargingScene, (state, scene) => {
      expect(count(scene, "vehicle:")).toBe(state.vehicles.length);
      expect(count(scene, "charger:")).toBe(state.parameters.chargers);
      for (const vehicle of state.vehicles) {
        const color = vehicle.status === "waiting" ? scientificPalette.waiting : vehicle.status === "granted" ? scientificPalette.active
          : vehicle.status === "released" ? scientificPalette.completed : scientificPalette.unavailable;
        expect(scene.agents.find(agent => agent.id === `vehicle:${vehicle.number}`)!.color).toBe(color);
      }
    });
    exercise(buffer({ lots: 100, capacity: 20 }), bufferScene, (state, scene) => {
      expect(count(scene, "crate:")).toBe(state.produced);
      expect(count(scene, "slot:")).toBe(state.parameters.capacity);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.waiting)).toHaveLength(state.blocked);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.active)).toHaveLength(state.stored);
    }, 100);
  });

  test("transport scenes preserve observed topology and all finite vehicles and parcels", () => {
    exercise(buses({ buses: 30, berths: 5 }), busScene, (state, scene) => {
      expect(count(scene, "bus:")).toBe(state.buses.length);
      expect(count(scene, "berth:")).toBe(state.parameters.berths);
      expect(scene.segments).toHaveLength(state.edges.length);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.waiting)).toHaveLength(state.waiting);
      expect(scene.agents.filter(agent => agent.color === scientificPalette.completed)).toHaveLength(state.departed);
    });
    exercise(parcels({ parcels: 30, depotCapacity: 10 }), parcelScene, (state, scene) => {
      expect(count(scene, "parcel:")).toBe(state.parcels.length);
      expect(count(scene, "slot:")).toBe(state.parameters.depotCapacity);
      expect(scene.segments).toHaveLength(state.edges.length);
      expect(scene.agents.find(agent => agent.id === "van")!.color).toBe(state.vanBusy ? scientificPalette.active : scientificPalette.neutral);
      expect(scene.agents.filter(agent => agent.id.startsWith("parcel:") && agent.color === scientificPalette.completed)).toHaveLength(state.delivered);
    }, 100);
  });

  test("spatial services show actual units, conserved bike stock and assigned teams", () => {
    exercise(waste({ loadCapacity: 12 }), wasteScene, (state, scene) => {
      expect(count(scene, "waste:")).toBe(state.remaining);
      expect(filled(scene, "load:")).toBe(state.carried);
      expect(count(scene, "load:")).toBe(state.parameters.loadCapacity);
      for (const field of state.fields) expect(count(scene, `waste:${field.id}:`)).toBe(field.waste);
    });
    exercise(dispatch({ responders: 3 }), dispatchScene, (state, scene) => {
      expect(count(scene, "call:")).toBe(state.calls.length);
      expect(count(scene, "team:")).toBe(state.busy);
      expect(count(scene, "idle-team:") + count(scene, "team:")).toBe(state.parameters.responders);
      expect(scene.segments).toHaveLength(state.edges.length);
    });
    exercise(bikes({ targetBikes: 6, truckCapacity: 6 }), bikeScene, (state, scene) => {
      expect(filled(scene, "bike-slot:") + count(scene, "cargo:")).toBe(state.totalBikes);
      expect(count(scene, "cargo:")).toBe(state.inTransit);
      for (const station of state.stations) {
        expect(count(scene, `bike-slot:${station.id}:`)).toBe(station.capacity);
        expect(filled(scene, `bike-slot:${station.id}:`)).toBe(station.bikes);
      }
    });
    exercise(water({ supplyUnits: 12 }), waterScene, (state, scene) => {
      expect(count(scene, "allocation:")).toBe(state.supplied + state.unmet);
      expect(filled(scene, "allocation:")).toBe(state.supplied);
      expect(scene.description).toContain("No hydraulic flow");
      for (const district of state.districts) expect(filled(scene, `allocation:${district.id}:`)).toBe(district.supplied);
    });
    exercise(maintenance({ repairTeams: 3 }), maintenanceScene, (state, scene) => {
      for (const machine of state.machines) {
        const glyph = scene.agents.find(agent => agent.id === machine.id)!;
        expect(glyph.shape).toBe("rectangle");
        expect(glyph.color).toBe(machine.status === "operational" ? scientificPalette.completed : machine.status === "repairing" ? scientificPalette.active : scientificPalette.waiting);
      }
      expect(count(scene, "crew:")).toBe(state.busy);
      expect(count(scene, "idle-crew:") + count(scene, "crew:")).toBe(state.parameters.repairTeams);
    });
  });

  test("maximum elevator scene draws each actual waiting or riding person once and each capacity once", () => {
    const instance = elevator({ floors: 12, elevators: 4, capacity: 8, initialPassengers: 100,
      arrivalInterval: 1, arrivalLimit: 100, doorTime: 0, transferTime: 0 });
    exercise(instance, elevatorScene, (state, scene) => {
      const drawnPassengers = scene.agents.filter(agent => state.passengers.some(person => person.id === agent.id));
      expect(drawnPassengers).toHaveLength(state.waiting + state.riding);
      expect(drawnPassengers.filter(agent => agent.color === scientificPalette.waiting)).toHaveLength(state.waiting);
      expect(drawnPassengers.filter(agent => agent.color === scientificPalette.active)).toHaveLength(state.riding);
      expect(count(scene, "shaft:")).toBe(state.cars.length);
      for (const car of state.cars) expect(scene.agents.filter(agent => agent.id === car.id)).toHaveLength(1);
      expect(scene.segments).toHaveLength(state.parameters.floors);
      expect(count(scene, "call:")).toBe(state.floorQueues.filter(queue => queue.passengers.length > 0).length);
    }, 200);
    instance.dispose();
  });
});
