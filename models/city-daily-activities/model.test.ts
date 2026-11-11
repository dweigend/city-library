import { expect, test } from "bun:test";
import { model } from "./model.ts";

test("every resident has a gap-free plan covering the whole day", () => {
  for (const remoteWork of [false, true]) {
    for (const servicesCloseHour of [16, 17, 17.5, 18, 22]) {
      const instance = model.create({ householdCount: 3, remoteWork, servicesCloseHour, servicesLocation: "local" });
      for (const resident of instance.read().residents) {
        expect(resident.plan[0]!.startHour).toBe(0);
        expect(resident.plan.at(-1)!.endHour).toBe(24);
        resident.plan.slice(1).forEach((segment, index) => expect(segment.startHour).toBe(resident.plan[index]!.endHour));
      }
    }
  }
});

test("all population sizes conserve person-hours over repeated policy changes", () => {
  for (const householdCount of [1, 2, 7, 30]) {
    const instance = model.create({ householdCount });
    for (let day = 0; day < 4; day += 1) {
      instance.setRemoteWork(day % 2 === 1);
      instance.setServicePolicy({ servicesLocation: day < 2 ? "central" : "local", servicesCloseHour: 16 + day });
      instance.advance(96);
      const state = instance.read();
      expect(state.accountedPersonHours).toBe(householdCount * 2 * 24 * (day + 1));
      expect(state.atHomeCount).toBe(householdCount * 2);
      expect(state.today.errandCount + state.today.missedErrandCount).toBe(householdCount);
    }
  }
});

test("closing before any arrival misses every errand without negative stays", () => {
  const instance = model.create({ servicesCloseHour: 16 });
  instance.advance(96);
  expect(instance.read().today.missedErrandCount).toBe(6);
  expect(instance.read().personHours.services).toBe(0);
});

test("mutating a detached observation cannot change canonical state", () => {
  const instance = model.create();
  const observation = instance.read();
  expect(Object.isFrozen(observation.residents[0])).toBe(true);
  expect(Object.isFrozen(observation.residents[0]!.plan)).toBe(true);
  expect(() => (observation.personHours as { home: number }).home = 99).toThrow(TypeError);
  expect(instance.read().personHours.home).toBe(0);
});
