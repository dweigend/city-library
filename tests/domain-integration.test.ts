import { describe, expect, test } from "bun:test";
import { Agent, Agenda, Graph, Grid, Random, Resource, World, continuous, studies, measurements, run, storage, twoPhase } from "city-library";

describe("Agent and discrete event public integration", () => {
  test("every outstanding reservation independently vetoes activation death before membership changes", () => {
    const world = World.create();
    const resident = world.add(Agent.create());
    const graph = world.add(Graph.create<object>());
    graph.nodes.add(resident);
    const housing = Resource.create<typeof resident>({ capacity: 2 });
    const first = housing.request({ owner: resident });
    const second = housing.request({ owner: resident });
    expect(() => world.activate(resident, context => context.die())).toThrow(TypeError);
    expect(resident.alive).toBe(true);
    expect(world.agents).toEqual([resident]);
    expect(graph.hasNode(resident)).toBe(true);
    housing.release(first);
    expect(() => resident.delete()).toThrow(TypeError);
    expect(housing.used).toBe(1);
    housing.cancel(second);
    world.activate(resident, context => context.die());
    expect(resident.alive).toBe(false);
    expect(world.agents).toEqual([]);
    expect(graph.hasNode(resident)).toBe(false);
    expect(housing.used).toBe(0);
  });

  test("mixed attachment rejects a late foreign member atomically and preserves canonical snapshots", () => {
    const owner = World.create();
    const other = World.create();
    const foreign = other.add(Agenda.create());
    const resident = Agent.create();
    const graph = Graph.create<object>();
    graph.nodes.add(resident);
    const grid = Grid.create({ x: 2, y: 2 });
    expect(() => owner.add([resident, grid, graph, foreign])).toThrow(TypeError);
    expect(owner.agents).toEqual([]);
    expect(owner.grids).toEqual([]);
    expect(owner.graphs).toEqual([]);
    expect(resident.world).toBeUndefined();
    other.delete(foreign);
    const result = owner.add([resident, grid, graph, foreign, foreign]);
    expect(result).toEqual([resident, grid, graph, foreign]);
    const snapshot = owner.agendas;
    owner.delete(foreign);
    expect(snapshot[0]).toBe(foreign);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(owner.agendas).toEqual([]);
  });

  test("fractional World ticks, Agenda time and completed study boundaries remain distinct", () => {
    const result = studies.run({ parameters: [{}], seeds: [1], stepCount: 2,
      create() {
        const world = World.create();
        world.tick.advance(10.5);
        const agenda = world.add(Agenda.create());
        return { world, agenda, step() { agenda.next({ until: agenda.time + 50 }); } };
      },
      measure: model => ({ tick: model.world.tick.value, at: model.agenda.time }),
    });
    const outcome = result.outcomes[0]!;
    expect(outcome.completedStepCount).toBe(2);
    expect(outcome.samples.map(sample => [sample.step, sample.measurement.tick, sample.measurement.at])).toEqual([
      [0, 10.5, 0], [1, 11.5, 50], [2, 12.5, 100],
    ]);
  });

  test("a failed second commit retains partial effects but does not count a successful interval", () => {
    const world = World.create();
    const values = [{ value: 1 }, { value: 2 }];
    expect(() => run(world, () => twoPhase(values, {
      compute: member => member.value + 10,
      commit(member, proposal) {
        member.value = proposal;
        if (member === values[1]) throw new Error("second commit");
      },
    }))).toThrow("second commit");
    expect(values).toEqual([{ value: 11 }, { value: 12 }]);
    expect(world.tick.value).toBe(0);
  });

  test("finite linear endpoints interpolate extremes without inventing epsilon times", () => {
    expect(continuous.crossing({ from: -Number.MAX_VALUE, to: Number.MAX_VALUE, threshold: 0, duration: 2 })?.elapsed).toBe(1);
    expect(continuous.crossing({ from: 0, to: 1, threshold: Number.MIN_VALUE, duration: 0.5 })?.elapsed).toBe(0);
    expect(continuous.crossing({ from: 1, to: -1, threshold: -1, duration: 0.3 })?.elapsed).toBe(0.3);
    expect(() => continuous.linear({ value: -Number.MAX_VALUE, rate: Number.MAX_VALUE, duration: 2 })).toThrow(RangeError);
    expect(() => continuous.crossing({ from: NaN, to: 1, threshold: 0, duration: 0 })).toThrow(RangeError);
  });

  test("an intervening rate event cancels and recomputes a predicted threshold causally", () => {
    const agenda = Agenda.create<"threshold" | "rate-change">();
    let value = 0;
    let rate = 2;
    let integratedAt = 0;
    let predicted = agenda.add({ at: 5, data: "threshold" });
    agenda.add({ at: 2, data: "rate-change" });
    const events: [string, number, number][] = [];
    for (let budget = 0; budget < 3; budget += 1) {
      const event = agenda.next({ until: 10 });
      if (!event) break;
      value = continuous.linear({ value, rate, duration: event.at - integratedAt });
      integratedAt = event.at;
      events.push([event.data, event.at, value]);
      if (event.data === "rate-change") {
        agenda.delete(predicted);
        rate = 1;
        const crossing = continuous.crossing({ from: value, to: 12, threshold: 10, duration: 8 });
        predicted = agenda.add({ at: agenda.time + crossing!.elapsed, data: "threshold" });
      }
    }
    expect(events).toEqual([["rate-change", 2, 4], ["threshold", 8, 10]]);
    expect(agenda.time).toBe(10);
  });

  test("budget exhaustion leaves partial DES effects and the existing adapter reports no completed interval", () => {
    const result = studies.run({ parameters: [{}], seeds: [1], stepCount: 1,
      create() {
        const world = World.create();
        const agenda = world.add(Agenda.create<number>());
        agenda.add({ at: 0, data: 0 });
        return { world, agenda, processed: 0, step() {} };
      },
      host: { advance(model) {
        for (let budget = 0; budget < 3; budget += 1) {
          const event = model.agenda.next({ until: 1 });
          if (!event) return;
          model.processed += 1;
          model.agenda.add({ at: event.at, data: event.data + 1 });
        }
        return "stopped";
      } },
      measure: model => ({ processed: model.processed, tick: model.world.tick.value }),
    });
    const outcome = result.outcomes[0]!;
    expect(outcome.status).toBe("stopped");
    expect(outcome.reason).toBe("adapter-stopped");
    expect(outcome.completedStepCount).toBe(0);
    expect(outcome.samples).toEqual([{ step: 0, measurement: { processed: 0, tick: 0 } }]);
  });

  test("pure measurement and bounded recording never draw, advance, or conflate tied event times", () => {
    const random = Random.create({ seed: 17 });
    const world = World.create({ random });
    const agenda = world.add(Agenda.create<number>());
    const history = storage.history({ capacity: 1 });
    const measure = measurements.define((state: { count: number }) => ({ count: state.count }));
    const state = { count: 0 };
    const before = random.state;
    agenda.add({ at: 2, data: 3 });
    agenda.add({ at: 2, data: 4 });
    const first = agenda.next({ until: 2 })!;
    state.count += first.data;
    history.add({ tick: first.at, values: measure.read(state) });
    const second = agenda.next({ until: 2 })!;
    state.count += second.data;
    expect(() => history.add({ tick: second.at, values: measure.read(state) })).toThrow(RangeError);
    expect(history.samples).toEqual([{ tick: 2, values: { count: 3 } }]);
    expect(measure.read(state)).toEqual({ count: 7 });
    expect(random.state).toEqual(before);
    expect(world.tick.value).toBe(0);
    expect(agenda.time).toBe(2);
  });
});
