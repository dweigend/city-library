import { describe, expect, test } from "bun:test";
import { Random } from "city-library";
import {
  create,
  inputs,
  TijuanaRuntimeError,
} from "../models/urban-suite-tijuana-bordertowns/model.ts";
import type {
  TijuanaAgentInput,
  BoundaryCode,
} from "../models/urban-suite-tijuana-bordertowns/model.ts";
import {
  field,
  globals,
  job,
  migrant,
  ring,
  scene,
  semantic,
  service,
  thirdBuilder,
} from "../examples/selected-tijuana/scenario.ts";

function firstBuilder(
  x: number,
  heading: number,
  overrides: object = {},
): Extract<TijuanaAgentInput, { kind: "first-builder" }> {
  const { key: _key, ...base } = thirdBuilder("first", 2, x, 0);
  return {
    ...base,
    key: "first",
    kind: "first-builder",
    heading,
    energy: 12,
    blockSize: 0,
    tooClose: 0,
    penDown: true,
    ...overrides,
  } as Extract<TijuanaAgentInput, { kind: "first-builder" }>;
}
function errorCode(action: () => unknown, code: BoundaryCode) {
  try {
    action();
    throw new Error("Expected source operation failure");
  } catch (error) {
    expect(error).toBeInstanceOf(TijuanaRuntimeError);
    expect((error as TijuanaRuntimeError).code).toBe(code);
  }
}

describe("Tijuana source boundaries and canonical observations", () => {
  test("hard forward reaches a valid unit endpoint and records its deleted source birth", () => {
    const model = create();
    model.setScenario(
      scene(model, {
        tick: 25,
        agents: [service(), firstBuilder(84, 90)],
        globals: globals({ setupDone: false, thirdPhase: 0 }),
        field: () => field(),
      }),
    );
    model.advanceCityscape();
    const state = model.read();
    // fd1 reaches85; the subsequent patch-ahead2 is outside and the builder dies.
    expect(state.counts.firstBuilders).toBe(0);
    expect(state.traces.map((t) => [t.from.x, t.to.x])).toEqual([[84, 85]]);
    expect(
      state.traces.every(
        (t) => t.birthOrdinal === 2 && !Object.hasOwn(t, "id"),
      ),
    ).toBe(true);
    expect(state.tick).toBe(26);
  });

  test("failed forward attempt does not clip to the hard endpoint or invent a pen segment", () => {
    const model = create();
    model.setScenario(
      scene(model, {
        tick: 25,
        agents: [service(), firstBuilder(84.75, 90)],
        globals: globals({ setupDone: false, thirdPhase: 0 }),
      }),
    );
    model.advanceCityscape();
    expect(model.read().counts.firstBuilders).toBe(0);
    expect(model.read().traces).toHaveLength(0);
  });

  test("signed source random energy creates both hatch births before zero-energy removal", () => {
    const model = create();
    model.setScenario(
      scene(model, {
        tick: 25,
        agents: [
          service(),
          firstBuilder(0, 0, { energy: -1.9, blockSize: 26 }),
        ],
        globals: globals({ setupDone: false, thirdPhase: 0 }),
      }),
    );
    model.advanceCityscape();
    expect(model.read().counts.firstBuilders).toBe(1);
    expect(model.read().counts.secondBuilders).toBe(0);
    model.addNode({ x: 10, y: 10 });
    // Ordinals0/service and2/first were injected; both dead second births3,4 still count.
    expect(
      model.read().agents.find((a) => a.kind === "node")!.birthOrdinal,
    ).toBe(5);
  });

  test("new second-to-third breed participates in the later ask, with no recursive same-ask activation", () => {
    const model = create();
    const { blockSize: _block, tooClose: _close, ...base } = firstBuilder(0, 7);
    const second = {
      ...base,
      kind: "second-builder",
      weight: 0.9,
      energy: 10,
      penDown: false,
    } as TijuanaAgentInput;
    model.setScenario(
      scene(model, {
        tick: 4,
        agents: [service(), second],
        globals: globals({ setupDone: false, thirdPhase: 0 }),
        field: () => field({ ctr: "+" }),
      }),
    );
    model.advanceCityscape();
    const state = model.read();
    expect(state.counts.secondBuilders).toBe(1);
    expect(state.counts.thirdBuilders).toBe(2);
    expect(
      state.agents
        .filter((a) => a.kind === "third-builder")
        .every((a) => a.weight === 0.898),
    ).toBe(true);
    expect(state.traces).toHaveLength(2);
  });

  test("lower endpoint is admitted; upper endpoint rejected before replacing an existing scene", () => {
    const model = create();
    model.setScenario(
      scene(model, {
        agents: [service(), job(), migrant("edge", 2, -85.5, 0)],
      }),
    );
    expect(model.read().agents.find((a) => a.kind === "migrant")!.x).toBe(
      -85.5,
    );
    const before = semantic(model);
    expect(() =>
      model.setScenario(
        scene(model, {
          agents: [service(), job(), migrant("edge", 2, 0, 57.5)],
        }),
      ),
    ).toThrow();
    expect(semantic(model)).toEqual(before);
  });

  test("raw fractional n-of shortage retains preceding tick and Gaussian draw", () => {
    const model = create({ seed: 1 });
    model.setScenario(
      scene(model, {
        tick: 25,
        agents: [service(), job()],
        globals: globals({ setupDone: false, thirdPhase: 0 }),
        field: (x, y) =>
          field({
            occupied: "maquiladora",
            ...(y === 0 && x >= 0 && x < 5 ? { water: 2, electricity: 3 } : {}),
          }),
      }),
    );
    const before = model.read();
    const reference = Random.create({ seed: 1 });
    reference.state = before.randomState;
    reference.number({ distribution: "normal", mean: 100, deviation: 10 });
    // F=round(5*.7/6)=1, request.2 from empty candidates must not truncate to0.
    errorCode(() => model.advanceCityscape(), "sample-shortage");
    expect(model.read().randomState).toEqual(reference.state);
    expect(model.read().tick).toBe(26);
    expect(model.read().history).toHaveLength(0);
    expect(model.read().lastFailure!.action).toBe("cityscape");
  });

  test("negative topography radius preserves the native self-plus-Moore candidate boundary", () => {
    const random = Random.create({ seed: 1 });
    // Real cached companion reached by425933 public draws; no fabricated normal.
    for (let i = 0; i < 425933; i++)
      random.number({ distribution: "normal", mean: 0, deviation: 1 });
    expect(random.state.continuation.gaussian).toBe(-5.678356702883158);
    const model = create({ seed: 1 });
    const input = scene(model, {
      tick: 0,
      agents: [],
      globals: globals({ setupDone: false, thirdPhase: 0 }),
    });
    input.randomState = random.state;
    model.setScenario(input);
    errorCode(() => model.advanceCityscape(), "sample-shortage");
    const state = model.read();
    // N(15,3)=-2.035...: an abs-radius disk has13 cells, native local candidates9.
    expect(state.lastFailure!.message).toContain("only 9 candidates");
    expect(state.cells.filter((f) => f.elevation === 8)).toHaveLength(1);
    expect(state.tick).toBe(1);
    expect(state.randomState.continuation.gaussian).toBeNull();
    expect(state.counts.serviceCenters).toBe(0);
    expect(state.history).toHaveLength(0);
  });

  test("modulo-zero retains road writes and real preceding public draws", () => {
    // Reproducible public continuation, never an injected Gaussian/cache value.
    // Each preparation group is two real normals with one real selection between.
    const random = Random.create({ seed: 1 });
    for (let i = 0; i < 37800; i++) {
      random.number({ distribution: "normal", mean: 100, deviation: 10 });
      random.sample([1]);
      random.number({ distribution: "normal", mean: 5, deviation: 1 });
    }
    expect(random.state.continuation.word).toBe(773003557);
    const model = create({ seed: 1 });
    const { blockSize: _block, tooClose: _close, ...base } = firstBuilder(0, 7);
    const second = {
      ...base,
      kind: "second-builder",
      weight: 0.9,
      energy: 10,
      penDown: false,
    } as TijuanaAgentInput;
    const input = scene(model, {
      tick: 4,
      agents: [service(), second],
      globals: globals({ setupDone: false, thirdPhase: 0 }),
      field: () => field({ ctr: "+" }),
    });
    input.randomState = random.state;
    model.setScenario(input);
    random.number({ distribution: "normal", mean: 100, deviation: 10 });
    random.sample([1]);
    expect(
      Math.round(
        random.number({ distribution: "normal", mean: 5, deviation: 1 }),
      ),
    ).toBe(0);
    errorCode(() => model.advanceCityscape(), "zero-divisor");
    const state = model.read();
    const builder = state.agents.find((a) => a.kind === "second-builder")!;
    expect(builder.kind).toBe("second-builder");
    if (builder.kind === "second-builder") {
      expect(builder.weight).toBe(0.899);
      expect(builder.energy).toBe(9.5);
    }
    expect(state.cells.find((f) => f.x === 0 && f.y === 0)!.landValue).toBe(
      0.899 * 7,
    );
    expect(state.randomState).toEqual(random.state);
    expect(state.tick).toBe(5);
    expect(state.history).toHaveLength(0);
  });

  test("field origins resolve to retained canonical Fields and reads remain detached", () => {
    const model = create();
    const input = scene(model, {
      agents: [
        service(),
        job(),
        migrant(),
        thirdBuilder("builder", 3, 1, 2, {
          origin: { kind: "field", x: 1, y: 2 },
        }),
      ],
    });
    const ids = model.read().cells.map((f) => f.id);
    model.setScenario(input);
    const a = model.read().agents.find((a) => a.kind === "third-builder")!;
    expect(a.kind).toBe("third-builder");
    if (
      a.kind === "third-builder" &&
      a.origin !== 0 &&
      a.origin.kind === "field"
    )
      expect(a.origin.id).toBe(
        model.read().cells.find((f) => f.x === 1 && f.y === 2)!.id,
      );
    const observation = model.read();
    expect(Object.isFrozen(observation.cells[0])).toBe(true);
    expect(Object.isFrozen(observation.agents[0])).toBe(true);
    expect(Object.isFrozen(observation.parameters)).toBe(true);
    expect(Object.isFrozen(inputs.seed)).toBe(true);
    expect(() =>
      Object.assign(observation.globals, { crossed: 999 }),
    ).toThrow();
    const continuation = model.read().randomState;
    model.read();
    model.read();
    expect(model.read().randomState).toEqual(continuation);
    model.clear();
    expect(model.read().cells.map((f) => f.id)).toEqual(ids);
    expect(observation.agents).toHaveLength(4);
    expect(model.read().agents).toHaveLength(0);
  });

  test("unknown, accessor, sparse, mismatched random and breed-specific fixture values fail atomically", () => {
    const model = create();
    model.setScenario(scene(model));
    const before = semantic(model);
    let getterCalled = false;
    for (const rules of [
      { seed: 2 },
      { buildingTicks: 0.75 },
      { unknown: true },
      Object.defineProperty({}, "migrationTicks", {
        enumerable: true,
        get() {
          getterCalled = true;
          return 3;
        },
      }),
    ]) {
      expect(() => model.setRules(rules as never)).toThrow();
      expect(semantic(model)).toEqual(before);
    }
    const missing = scene(model);
    delete (missing.cells[0] as Partial<ReturnType<typeof field>>).water;
    const extra = scene(model);
    Object.assign(extra.agents[0]!, { income: 42 });
    const sparse = scene(model);
    delete (sparse.agents as unknown[])[1];
    const random = scene(model);
    (random as { randomState: unknown }).randomState = Random.create({
      seed: 2,
    }).state;
    const invalidRef = scene(model, {
      agents: [
        service(),
        job(),
        migrant("bad", 2, 0, 0, { works: ["service"] }),
      ],
    });
    const getter = scene(model, {
      agents: [service(), thirdBuilder("builder", 1)],
    });
    Object.defineProperty(
      (
        getter.agents[1] as Extract<
          TijuanaAgentInput,
          { kind: "third-builder" }
        >
      ).origin,
      "kind",
      {
        get() {
          getterCalled = true;
          return "services";
        },
      },
    );
    for (const scenario of [
      missing,
      extra,
      sparse,
      random,
      invalidRef,
      getter,
    ]) {
      expect(() => model.setScenario(scenario)).toThrow();
      expect(semantic(model)).toEqual(before);
    }
    expect(getterCalled).toBe(false);
  });

  test("GO boundary cleanup deletes a canonical job; later hatch preserves dead references until get-costs uses them", () => {
    const model = create();
    model.setScenario(
      scene(model, {
        agents: [
          service(),
          job("job", 1, 85, 0),
          migrant("parent", 2, 0, 0, { residentSince: 0 }),
        ],
        rules: { migrationTicks: 2, crossingTicks: 20 },
        field: (x, y) =>
          field({ occupied: x === 1 && y === 0 ? "no" : "maquiladora" }),
      }),
    );
    model.advance();
    const first = model.read();
    const parent = first.agents.find((a) => a.kind === "migrant")!;
    expect(parent.kind).toBe("migrant");
    if (parent.kind === "migrant" && parent.works !== 0)
      expect(parent.works[0]).toEqual({
        id: parent.works[0]!.id,
        birthOrdinal: 1,
        alive: false,
      });
    errorCode(() => model.advance(), "invalid-source-reference");
    expect(model.read().counts.migrants).toBe(2);
    expect(model.read().tick).toBe(2);
    expect(model.read().history).toHaveLength(1);
    expect(model.read().lastFailure!.code).toBe("invalid-source-reference");
  });

  test("GO state is independent between instances and failures survive pure guards/count0", () => {
    const a = create({ seed: 4 }),
      b = create({ seed: 4 });
    a.setScenario(scene(a, { agents: [] }));
    errorCode(() => a.advance(), "empty-max");
    const failed = semantic(a),
      untouched = semantic(b);
    expect(a.advance(0)).toEqual({ status: "noop", completed: 0 });
    expect(a.advanceCityscape().status).toBe("guarded");
    expect(semantic(a)).toEqual(failed);
    a.setRules({ cityGrowth: true });
    expect(semantic(b)).toEqual(untouched);
  });
});
