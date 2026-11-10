import { describe, expect, test } from "bun:test";
import { create as heat } from "../models/heat-diffusion/model.ts";
import { create as crystal } from "../models/crystallization-basic/model.ts";
import { create as interstitial } from "../models/interstitial-diffusion/model.ts";
import { create as dla } from "../models/dla/model.ts";

describe("selected materials source mechanisms", () => {
  test("heat patch updates are sequential old-temperature writes and clamp strips", () => {
    const plate = heat({
      width: 11,
      height: 11,
      initialPlateTemp: 44,
      leftTemp: 44,
      rightTemp: 44,
      topTemp: 44,
      bottomTemp: 44,
    });
    plate.setTemperatures(
      plate.read().cells.map((c) => (c.x === 0 && c.y === 0 ? 100 : 44)),
    );
    const d = plate.read().heatDiffusivity;
    plate.updateFieldAt(0, 0);
    const center = d * 176 + (1 - 4 * d) * 100;
    expect(
      plate.read().cells.find((c) => c.x === 0 && c.y === 0)!.temperature,
    ).toBeCloseTo(center, 12);
    plate.updateFieldAt(1, 0);
    const neighbor = d * (center + 3 * 44) + (1 - 4 * d) * 44;
    expect(
      plate.read().cells.find((c) => c.x === 1 && c.y === 0)!.temperature,
    ).toBeCloseTo(neighbor, 12);
    plate.setRules({ leftTemp: 10 });
    plate.updateFieldAt(-3, 0);
    expect(
      plate.read().cells.find((c) => c.x === -3 && c.y === 0)!.temperature,
    ).toBe(10);
    expect(plate.read().tick).toBe(0);
    plate.updateAlpha("silver");
    expect(plate.read().parameters.alpha).toBe(1.7004);
    plate.updateAlpha("other");
    expect(plate.read().parameters.alpha).toBe(1.7004);
  });
  test("crystallization freezes below its source color threshold and stops before another tick", () => {
    const atom = crystal({ width: 1, height: 1 });
    expect(atom.read().atoms[0]!.sidesExposed).toBe(8);
    atom.advance();
    expect(atom.read().atoms[0]!.temp).toBe(390);
    expect(atom.read().tempRange).toBeCloseTo(1000 / 6, 12);
    expect(atom.read().frozenCount).toBe(0); // source <0 color index, not temp<melting
    expect(atom.read().atoms[0]!.colorIndex).toBe(0);
    expect(atom.read().atoms[0]!.color).toBe(8.9);
    atom.advance(5);
    expect(atom.read().tick).toBe(1);
    expect(atom.read().done).toBe(true);
    const colder = crystal({ width: 1, height: 1, meltingTemp: 600 });
    colder.advance();
    expect(colder.read().frozenCount).toBe(1);
  });
  test("crystallization cooling sees preceding atom writes within the pass", () => {
    const metal = crystal({ width: 3, height: 1 });
    const cells = metal.read().atoms;
    const left = cells.find((a) => a.x === -1)!,
      center = cells.find((a) => a.x === 0)!;
    metal.coolAgents(left.id);
    // left neighborhood includes itself and center, own is counted twice.
    const first = (3 * 1550 + 7 * 100) / 10;
    expect(metal.read().atoms.find((a) => a.id === left.id)!.temp).toBe(first);
    metal.coolAgents(center.id);
    const second = (first + 3 * 1550 + 6 * 100) / 10;
    expect(metal.read().atoms.find((a) => a.id === center.id)!.temp).toBe(
      second,
    );
    expect(metal.read().tick).toBe(0);
  });
  test("interstitial occupancy exclusion, reservoirs, concentration edits and max-tick barrier", () => {
    const closed = interstitial({
      width: 5,
      height: 5,
      initialBulkConcentration: 0,
      initialPopulatedColumnCount: 0,
      maxTicks: 2,
    });
    closed.setProfile([1, 1, 1, 1, 1]);
    closed.advance(10);
    expect(closed.read().atoms.length).toBe(25);
    expect(new Set(closed.read().atoms.map((a) => `${a.x},${a.y}`)).size).toBe(
      25,
    );
    expect(closed.read().profile.every((p) => p.concentration === 1)).toBe(
      true,
    );
    expect(closed.read().tick).toBe(2);
    closed.drawColumn(0, 0);
    expect(closed.read().atoms.length).toBe(20);
    expect(closed.read().tick).toBe(0);
    expect(closed.read().latticeVisible).toBe(false);
    closed.setRules({
      constantLeftSurface: true,
      leftSurfaceConcentration: 1,
      constantRightSurface: true,
      rightSurfaceConcentration: 0,
    });
    closed.advance();
    expect(closed.read().profile[0]!.concentration).toBe(1);
    expect(closed.read().profile.at(-1)!.concentration).toBe(0);
  });
  test("interstitial closed random walks conserve atoms, hard x and wrapped y", () => {
    const walk = interstitial({
      width: 5,
      height: 5,
      initialBulkConcentration: 0.8,
      initialPopulatedColumnCount: 0,
    });
    const count = walk.read().atoms.length;
    walk.advance(100);
    expect(walk.read().atoms.length).toBe(count);
    expect(
      walk
        .read()
        .atoms.every((a) => a.x >= -2 && a.x <= 2 && a.y >= -2 && a.y <= 2),
    ).toBe(true);
    expect(new Set(walk.read().atoms.map((a) => `${a.x},${a.y}`)).size).toBe(
      count,
    );
    expect(walk.read().profileAt15).toBeDefined();
    walk.setRules({ goMode: "draw-profile" });
    walk.advance();
    expect(walk.read().tick).toBe(0);
    expect(walk.read().atoms.length).toBe(count);
  });
  test("DLA initial birth throttle, continuous radial motion, natural growth and terminal barrier", () => {
    const cluster = dla({
      width: 21,
      height: 21,
      wiggleAngle: 0,
      useWholeWorld: false,
      maxParticleCount: 1,
    });
    cluster.advance();
    expect(cluster.read().agents.length).toBe(0);
    const id = cluster.makeNewAgent();
    expect(
      Math.hypot(cluster.read().agents[0]!.x, cluster.read().agents[0]!.y),
    ).toBeCloseTo(1.5, 12);
    cluster.wander(id);
    expect(
      Math.hypot(cluster.read().agents[0]!.x, cluster.read().agents[0]!.y),
    ).toBeCloseTo(0.5, 12);
    const growing = dla({
      width: 21,
      height: 21,
      useWholeWorld: false,
      maxParticleCount: 20,
      seed: 10,
    });
    growing.advance(500);
    expect(
      growing.read().cells.filter((c) => c.occupied).length,
    ).toBeGreaterThan(1);
    expect(growing.read().radius).toBeGreaterThan(0);
    expect(growing.read().done).toBe(true);
    const tick = growing.read().tick;
    growing.advance(10);
    expect(growing.read().tick).toBe(tick);
  });
  test("readbacks are pure and detached; invalid fixture inputs fail before writes", () => {
    const plate = heat({ width: 11, height: 11 });
    const first = plate.read();
    expect(plate.read()).toEqual(first);
    expect(() => plate.setTemperatures([NaN])).toThrow();
    expect(plate.read()).toEqual(first);
    const diffusing = interstitial({ width: 5, height: 5 });
    const original = diffusing.read();
    expect(() => diffusing.setProfile([0, 0, NaN, 0, 0])).toThrow();
    expect(diffusing.read()).toEqual(original);
  });
});
