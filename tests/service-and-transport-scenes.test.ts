import { describe, expect, test } from "bun:test";
import { scientificPalette } from "../ui/index.ts";
import type { SpatialData } from "../ui/index.ts";
import { create as createOffice } from "../models/des-civic-office/model.ts";
import { officeScene } from "../models/des-civic-office/scene.ts";
import { create as createCharging } from "../models/des-ev-charging/model.ts";
import { chargingScene } from "../models/des-ev-charging/scene.ts";
import { create as createBuffer } from "../models/des-goods-buffer/model.ts";
import { bufferScene } from "../models/des-goods-buffer/scene.ts";
import { create as createBuses } from "../models/des-bus-interchange/model.ts";
import { busScene } from "../models/des-bus-interchange/scene.ts";
import { create as createParcels } from "../models/des-parcel-logistics/model.ts";
import { parcelScene } from "../models/des-parcel-logistics/scene.ts";

describe("five detached service and transport scenes", () => {
  test("office renders each resident once and capacity slots stay distinct from retained claims", () => {
    const office = createOffice({ residentCount: 4, clerkCount: 3 });
    office.setClerks(1);
    const state = office.read();
    const before = structuredClone(state);
    const scene = officeScene(state);
    expect(scene.agents.filter(agent => agent.id.startsWith("resident:"))).toHaveLength(4);
    const capacity = scene.agents.filter(agent => agent.selectable === false);
    expect(capacity).toHaveLength(state.busyClerkCount);
    expect(capacity.filter(agent => agent.color === scientificPalette.neutral)).toHaveLength(state.parameters.clerkCount);
    expect(capacity.filter(agent => agent.color === scientificPalette.unavailable)).toHaveLength(state.busyClerkCount - state.parameters.clerkCount);
    expect(capacity.every(agent => agent.filled !== false)).toBe(true);
    expect(scene.description).toContain("Residents in service: 3 items");
    expect(scene.description).toContain("Clerk capacity: 3 of 1 seats; 2 excess above capacity");
    expect(state).toEqual(before);
    expect(office.read()).toEqual(before);
  });

  test("charging scene follows Resource priority order and keeps cancellations separate", () => {
    const charging = createCharging({ chargerCount: 1 });
    charging.addVehicle(-1);
    const state = charging.read();
    const scene = chargingScene(state);
    const priority = scene.agents.find(agent => agent.id === "vehicle:4")!;
    const ordinary = scene.agents.find(agent => agent.id === "vehicle:2")!;
    expect(priority.x).toBeLessThan(ordinary.x);
    expect(scene.agents.filter(agent => agent.color === scientificPalette.waiting).map(agent => agent.id))
      .toEqual(state.waitingVehicles.map(number => `vehicle:${number}`));
    expect(priority.shape).toBe("diamond");
    expect(ordinary.shape).toBe("rectangle");
    expect(scene.agents.filter(agent => agent.id === priority.id)).toHaveLength(1);
    expect(scene.agents.filter(agent => agent.selectable !== false)).toHaveLength(state.vehicles.length);
    charging.abandonWaiting();
    const cancelled = chargingScene(charging.read()).agents.find(agent => agent.id === "vehicle:2")!;
    expect(cancelled.color).toBe(scientificPalette.unavailable);
    expect(charging.read().activeVehicleCount).toBe(1);
  });

  test("buffer shows bounded slots, accepted stock and blocked puts without invented crates", () => {
    const buffer = createBuffer();
    buffer.advance(3);
    const full = bufferScene(buffer.read());
    const capacity = full.agents.filter(agent => agent.selectable === false);
    expect(capacity).toHaveLength(buffer.read().parameters.capacity);
    expect(capacity.filter(agent => agent.filled !== false)).toHaveLength(buffer.read().storedLotCount);
    expect(full.description).toContain("Store capacity: 2 of 2 crates");
    expect(full.agents.filter(agent => agent.id.startsWith("crate:"))).toHaveLength(3);
    expect(full.agents.find(agent => agent.id === "crate:3")!.color).toBe(scientificPalette.waiting);
    buffer.advance();
    const admitted = bufferScene(buffer.read());
    expect(admitted.agents.find(agent => agent.id === "crate:3")!.color).toBe(scientificPalette.active);
    expect(admitted.agents.find(agent => agent.id === "crate:1")!.color).toBe(scientificPalette.completed);
  });

  test("bus diagram preserves every actual edge and moves buses along the weighted route", () => {
    const buses = createBuses();
    const initial = busScene(buses.read());
    buses.advance(2);
    const traveling = busScene(buses.read());
    expect(traveling.segments).toHaveLength(3);
    expect(traveling.labels!.map(label => label.text)).toEqual(expect.arrayContaining(["2", "3", "8"]));
    expect(traveling.agents.find(agent => agent.id === "bus:1")!.y)
      .toBeGreaterThan(initial.agents.find(agent => agent.id === "bus:1")!.y);
    buses.advance(3);
    expect(busScene(buses.read()).description).toContain("1 waiting");
    expect(busScene(buses.read()).agents.filter(agent => agent.id.startsWith("berth:"))).toHaveLength(1);
  });

  test("parcel scene keeps a returning van occupied and preserves all parcel identities", () => {
    const parcels = createParcels();
    parcels.advance(3);
    const state = parcels.read();
    const snapshot = structuredClone(state);
    const scene = parcelScene(state);
    expect(scene.agents.filter(agent => agent.id.startsWith("parcel:"))).toHaveLength(2);
    expect(scene.agents.find(agent => agent.id === "van")!.shape).toBe("triangle");
    expect(scene.description).toContain("returning");
    expect(scene.description).toContain("1 van occupied");
    expect(scene.segments).toHaveLength(3);
    expect(parcels.read()).toEqual(snapshot);
    parcels.advance(2);
    expect(parcelScene(parcels.read()).description).toContain("1 van occupied");
  });

  test("maximum setup populations stay complete and inside their diagram bounds", () => {
    const office = createOffice({ residentCount: 100, clerkCount: 10 });
    const charging = createCharging({ vehicleCount: 100, chargerCount: 10 });
    const buffer = createBuffer({ lotCount: 100, capacity: 20 });
    const buses = createBuses({ busCount: 30, berthCount: 5 });
    const parcels = createParcels({ parcelCount: 30, depotCapacity: 10 });
    office.setClerks(1);
    charging.setChargers(1);
    buffer.advance(100);
    buses.advance(2);
    parcels.advance(100);
    const scenes: SpatialData[] = [officeScene(office.read()), chargingScene(charging.read()),
      bufferScene(buffer.read()), busScene(buses.read()), parcelScene(parcels.read())];
    for (const scene of scenes) {
      expect(new Set(scene.agents.map(agent => agent.id)).size).toBe(scene.agents.length);
      for (const agent of scene.agents) {
        expect(Math.abs(agent.x) + (agent.extent?.width ?? 0) / 2).toBeLessThanOrEqual(scene.width / 2);
        expect(Math.abs(agent.y) + (agent.extent?.height ?? 0) / 2).toBeLessThanOrEqual(scene.height / 2);
      }
    }
    expect(scenes[0]!.agents.filter(agent => agent.id.startsWith("resident:"))).toHaveLength(100);
    expect(scenes[1]!.agents.filter(agent => agent.id.startsWith("vehicle:"))).toHaveLength(100);
    expect(scenes[2]!.agents.filter(agent => agent.id.startsWith("crate:"))).toHaveLength(buffer.read().producedLotCount);
    expect(scenes[3]!.agents.filter(agent => agent.id.startsWith("bus:"))).toHaveLength(30);
    expect(scenes[4]!.agents.filter(agent => agent.id.startsWith("parcel:"))).toHaveLength(30);
  });
});
