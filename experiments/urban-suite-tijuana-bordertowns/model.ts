/** Headless adaptation of Wilensky (2007), CC BY-NC-SA 3.0; see NOTICE.md.
 * Explicit target schedule: legacy-shuffled asks, integer birth headings, omitted
 * overwritten default-color draws; CLEAR/display are RNG neutral. */
import { Agent, Grid, Random, World, geometry, stats } from "city-library";
import type { RandomState, Field, Position } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export type VisualUpdate =
  | "off"
  | "elevation"
  | "land value gradient"
  | "colonias"
  | "units with no water"
  | "units with no electricity";
export interface TijuanaRules {
  maquiladoras: number;
  serviceCenters: number;
  migrationTicks: number;
  crossingTicks: number;
  buildingTicks: number;
  initDensity: number;
  coloniaSize: number;
  requiredCapital: number;
  carryingCapacity: number;
  visualUpdate: VisualUpdate;
  colorCode: boolean;
  cityGrowth: boolean;
}
export interface TijuanaParameters extends TijuanaRules {
  seed: number;
}
export type Origin = "oaxaca" | "jalisco" | "zacatecas" | "mexico";
export interface TijuanaFieldInput {
  landValue: number;
  water: number | "0.0";
  electricity: number | "0.0";
  transport: number | "0.0";
  occupied: 0 | "no" | "maquiladora" | Origin;
  ctr: 0 | "+" | "p-i-lots";
  elevation: number;
  colonia: number;
  colorNumber: number;
}
export interface TijuanaGlobals {
  values: number;
  weights: number;
  marginalValue: number;
  marginalWeight: number;
  crossed: number;
  maxCost: number;
  thirdPhase: 0 | "go" | "stop";
  setupDone: boolean;
}
export interface AgentInput {
  key: string;
  birthOrdinal: number;
  x: number;
  y: number;
  heading: number;
  size: number;
  colorNumber: number;
  shape: string;
  label: string | number;
  hidden: boolean;
  penDown: boolean;
  penSize: number;
}
export type BuilderOriginInput =
  | 0
  | { kind: "services"; keys: readonly string[] }
  | { kind: "field"; x: number; y: number };
export type TijuanaAgentInput =
  | (AgentInput & { kind: "service-center" })
  | (AgentInput & { kind: "employment-center" })
  | (AgentInput & { kind: "ring" })
  | (AgentInput & { kind: "node" })
  | (AgentInput & {
      kind: "first-builder";
      energy: number;
      weight: number;
      blockSize: number;
      tooClose: 0 | readonly string[];
      origin: BuilderOriginInput;
    })
  | (AgentInput & {
      kind: "second-builder";
      energy: number;
      weight: number;
      origin: BuilderOriginInput;
    })
  | (AgentInput & {
      kind: "third-builder";
      energy: number;
      weight: number;
      origin: BuilderOriginInput;
    })
  | (AgentInput & {
      kind: "migrant";
      income: number;
      savings: number;
      livingExpenses: number;
      residentSince: number;
      origin: 0 | Origin;
      works: 0 | readonly string[];
    });
export interface TijuanaScenario {
  mode: "ordinary" | "diagnostic";
  tick: number;
  parameters: TijuanaRules;
  globals: TijuanaGlobals;
  nextBirthOrdinal: number;
  cells: readonly TijuanaFieldInput[];
  agents: readonly TijuanaAgentInput[];
  randomState: RandomState;
}
export type BoundaryCode =
  | "empty-mean"
  | "empty-max"
  | "empty-selection"
  | "invalid-sample-count"
  | "sample-shortage"
  | "numeric-type"
  | "zero-divisor"
  | "invalid-source-reference";
export class TijuanaRuntimeError extends Error {
  constructor(
    readonly code: BoundaryCode,
    message: string,
  ) {
    super(message);
    this.name = "TijuanaRuntimeError";
  }
}
export interface ActionResult {
  status: "noop" | "guarded" | "advanced" | "ready";
  completed: number;
  message?: string;
}
export interface TijuanaModel {
  clear(): void;
  advanceCityscape(count?: number): ActionResult;
  advance(count?: number): ActionResult;
  setRules(rules: Partial<TijuanaRules>): void;
  updateDisplay(): void;
  addNode(position: { x: number; y: number }): void;
  setScenario(scenario: TijuanaScenario): void;
  read(): TijuanaRead;
}
export type AgentReference = Readonly<{
  id: string;
  birthOrdinal: number;
  alive: boolean;
}>;
export type FieldRead = Readonly<
  TijuanaFieldInput & { id: string; x: number; y: number }
>;
export type AgentRead = Readonly<Omit<AgentInput, "key"> & { id: string }>;
export type BuilderOriginRead =
  | 0
  | Readonly<{ kind: "services"; agents: readonly AgentReference[] }>
  | Readonly<{ kind: "field"; id: string; x: number; y: number }>;
export type TijuanaAgentRead =
  | (AgentRead & Readonly<{ kind: "service-center" }>)
  | (AgentRead & Readonly<{ kind: "employment-center" }>)
  | (AgentRead & Readonly<{ kind: "ring" }>)
  | (AgentRead & Readonly<{ kind: "node" }>)
  | (AgentRead &
      Readonly<{
        kind: "first-builder";
        energy: number;
        weight: number;
        blockSize: number;
        tooClose: 0 | readonly AgentReference[];
        origin: BuilderOriginRead;
      }>)
  | (AgentRead &
      Readonly<{
        kind: "second-builder";
        energy: number;
        weight: number;
        origin: BuilderOriginRead;
      }>)
  | (AgentRead &
      Readonly<{
        kind: "third-builder";
        energy: number;
        weight: number;
        origin: BuilderOriginRead;
      }>)
  | (AgentRead &
      Readonly<{
        kind: "migrant";
        income: number;
        savings: number;
        livingExpenses: number;
        residentSince: number;
        origin: 0 | Origin;
        works: 0 | readonly AgentReference[];
      }>);
export type TijuanaCounts = Readonly<{
  serviceCenters: number;
  employmentCenters: number;
  firstBuilders: number;
  secondBuilders: number;
  thirdBuilders: number;
  migrants: number;
  rings: number;
  nodes: number;
}>;
export type ReporterReason = "empty-subset" | "zero-denominator" | null;
export type TijuanaReports = Readonly<{
  savings: number | undefined;
  savingsNode: number | undefined;
  equippedFieldCount: number;
  noWaterPercent: number | undefined;
  noPowerPercent: number | undefined;
  unavailable: Readonly<{
    savings: ReporterReason;
    savingsNode: ReporterReason;
    noWaterPercent: ReporterReason;
    noPowerPercent: ReporterReason;
  }>;
}>;
export type CompletedCall = Readonly<{
  action: "cityscape" | "go";
  epoch: number;
  tickBefore: number;
  tickAfter: number;
  setupDone: boolean;
  counts: TijuanaCounts;
  seedMigrants: number;
}>;
export type FailedCall = Readonly<{
  action: "cityscape" | "go" | "update-display" | "add-node";
  tick: number;
  epoch: number;
  code: BoundaryCode | "unexpected";
  message: string;
}>;
export type PenTrace = Readonly<{
  ordinal: number;
  birthOrdinal: number;
  from: Readonly<{ x: number; y: number }>;
  to: Readonly<{ x: number; y: number }>;
  colorNumber: number;
  width: number;
}>;
export interface TijuanaRead {
  readonly width: 171;
  readonly height: 115;
  readonly tick: number;
  readonly epoch: number;
  readonly parameters: Readonly<TijuanaParameters>;
  readonly globals: Readonly<TijuanaGlobals>;
  readonly setupDone: boolean;
  readonly phase: "cleared" | "generating" | "seeding" | "expanding" | "ready";
  readonly cells: readonly FieldRead[];
  readonly agents: readonly TijuanaAgentRead[];
  readonly counts: TijuanaCounts;
  readonly seedMigrants: number;
  readonly reports: TijuanaReports;
  readonly randomState: RandomState;
  readonly history: readonly CompletedCall[];
  readonly lastFailure: FailedCall | null;
  readonly warnings: readonly string[];
  readonly traces: readonly PenTrace[];
  readonly done: false;
}

export const inputs: Inputs<TijuanaParameters> = freeze({
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  maquiladoras: { kind: "number", default: 8, min: 1, max: 8, integer: true },
  serviceCenters: { kind: "number", default: 3, min: 1, max: 3, integer: true },
  migrationTicks: {
    kind: "number",
    default: 3,
    min: 1,
    max: 20,
    integer: true,
  },
  crossingTicks: {
    kind: "number",
    default: 15,
    min: 1,
    max: 20,
    integer: true,
  },
  buildingTicks: { kind: "number", default: 6, min: 0.5, max: 6, step: 0.5 },
  initDensity: { kind: "number", default: 0.7, min: 0.5, max: 1, step: 0.1 },
  coloniaSize: { kind: "number", default: 2, min: 0, max: 2, step: 0.25 },
  requiredCapital: {
    kind: "number",
    default: 500,
    min: 150,
    max: 1200,
    step: 10,
  },
  carryingCapacity: {
    kind: "number",
    default: 6,
    min: 1,
    max: 6,
    integer: true,
  },
  visualUpdate: {
    kind: "choice",
    default: "off",
    options: [
      "off",
      "elevation",
      "land value gradient",
      "colonias",
      "units with no water",
      "units with no electricity",
    ],
  },
  colorCode: { kind: "boolean", default: true },
  cityGrowth: { kind: "boolean", default: false },
});
type Kind = TijuanaAgentInput["kind"];
type ModelField = Field<TijuanaFieldInput>;
type LiveOrigin =
  0 | { kind: "services"; agents: ModelAgent[] } | { kind: "field"; field: ModelField };
interface AgentState {
  kind: Kind;
  birthOrdinal: number;
  size: number;
  colorNumber: number;
  shape: string;
  label: string | number;
  hidden: boolean;
  penDown: boolean;
  penSize: number;
  energy: number;
  weight: number;
  blockSize: number;
  tooClose: 0 | ModelAgent[];
  origin: LiveOrigin | Origin;
  income: number;
  savings: number;
  livingExpenses: number;
  residentSince: number;
  works: 0 | ModelAgent[];
}
type ModelAgent = Agent<AgentState>;
const fieldDefaults = (): TijuanaFieldInput => ({
  landValue: 0,
  water: 0,
  electricity: 0,
  transport: 0,
  occupied: 0,
  ctr: 0,
  elevation: 0,
  colonia: 0,
  colorNumber: 9.9,
});
const globalDefaults = (): TijuanaGlobals => ({
  values: 0,
  weights: 0,
  marginalValue: 0,
  marginalWeight: 0,
  crossed: 0,
  maxCost: 0,
  thirdPhase: 0,
  setupDone: false,
});
function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
function record(
  value: unknown,
  keys: readonly string[],
): asserts value is Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(value))
  )
    throw new TypeError("Expected plain data record");
  const own = Reflect.ownKeys(value);
  if (
    own.length !== keys.length ||
    own.some(
      (k) =>
        typeof k !== "string" ||
        !keys.includes(k) ||
        !("value" in Object.getOwnPropertyDescriptor(value, k)!),
    )
  )
    throw new TypeError("Expected exact own data keys");
}
function array(value: unknown): asserts value is unknown[] {
  if (
    !Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Array.prototype ||
    Reflect.ownKeys(value).length !== value.length + 1
  )
    throw new TypeError("Expected dense ordinary array");
  for (let i = 0; i < value.length; i++)
    if (
      !Object.hasOwn(value, i) ||
      !("value" in Object.getOwnPropertyDescriptor(value, String(i))!)
    )
      throw new TypeError("Expected array data");
}
function finite(value: unknown): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new TypeError("Expected finite number");
}
function natural(value: unknown) {
  finite(value);
  if (!Number.isSafeInteger(value) || value < 0)
    throw new RangeError("Expected nonnegative safe integer");
}
const round = Math.round;
const precision = (value: number, places: number) =>
  Math.round(value * 10 ** places) / 10 ** places;
export function create(options: Partial<TijuanaParameters> = {}): TijuanaModel {
  let settings = parameters(inputs, options);
  const space = { x: 171, y: 115, boundary: "hard" as const };
  const random = Random.add({ seed: settings.seed });
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: fieldDefaults() });
  world.add(grid);
  const fields = grid.fields;
  const neighbors = new Map(
    fields.map((f) => [f, grid.neighbors(f, { neighborhood: "moore" })]),
  );
  let globals = globalDefaults(),
    nextBirthOrdinal = 0,
    epoch = 0;
  const history: CompletedCall[] = [],
    traces: PenTrace[] = [],
    warnings: string[] = [];
  let lastFailure: FailedCall | null = null;
  const all = () => world.agents as readonly ModelAgent[];
  const breed = (kind: Kind) => all().filter((a) => a.kind === kind);
  const ask = <T>(items: readonly T[], action: (item: T) => void) => {
    for (const item of random.sample(items, {
      count: items.length,
      compatibility: "legacy-shuffle",
    }))
      if (
        !(typeof item === "object" && item !== null && "alive" in item) ||
        item.alive
      )
        action(item);
  };
  const one = <T>(items: readonly T[]): T | undefined =>
    items.length ? random.sample(items, { count: 1 })[0] : undefined;
  function required<T>(value: T | undefined, operation: string): T {
    if (value === undefined)
      throw new TijuanaRuntimeError(
        "empty-selection",
        `${operation}: empty selection`,
      );
    return value;
  }
  const normal = (mean: number, deviation: number) =>
    random.number({ distribution: "normal", mean, deviation });
  const integer = (bound: number) =>
    bound === 0
      ? 0
      : bound > 0
        ? Math.floor(random.number() * Math.ceil(bound))
        : -Math.floor(random.number() * Math.ceil(-bound));
  const distance = (a: Position, b: Position) =>
    geometry.distance(a, b, { space });
  const here = (a: Position) => grid.fieldAt(a)!;
  function radius(a: Position, r: number): ModelField[] {
    if (r < 0) {
      const f = here(a);
      return [f, ...neighbors.get(f)!].filter((p) => distance(a, p) <= -r);
    }
    const result: ModelField[] = [];
    for (
      let y = Math.max(-57, Math.ceil(a.y - r));
      y <= Math.min(57, Math.floor(a.y + r));
      y++
    )
      for (
        let x = Math.max(-85, Math.ceil(a.x - r));
        x <= Math.min(85, Math.floor(a.x + r));
        x++
      ) {
        const f = grid.fieldAt({ x, y })!;
        if (distance(a, f) <= r) result.push(f);
      }
    return result;
  }
  const nearAgents = (a: Position, r: number, kind: Kind) =>
    breed(kind).filter((b) => distance(a, b) <= r);
  const at = (f: ModelField, kind: Kind) =>
    grid.agentsAt(f).filter((a) => (a as ModelAgent).kind === kind) as ModelAgent[];
  function sample<T>(items: readonly T[], count: number): T[] {
    if (count < 0)
      throw new TijuanaRuntimeError(
        "invalid-sample-count",
        "n-of: negative count",
      );
    if (count > items.length)
      throw new TijuanaRuntimeError(
        "sample-shortage",
        `n-of ${count}: only ${items.length} candidates`,
      );
    return random.sample(items, { count: Math.trunc(count) });
  }
  function mean(values: number[], operation: string) {
    if (!values.length)
      throw new TijuanaRuntimeError("empty-mean", `${operation}: empty mean`);
    return stats.describe(values).mean!;
  }
  function max(values: number[], operation: string) {
    if (!values.length)
      throw new TijuanaRuntimeError("empty-max", `${operation}: empty max`);
    return stats.describe(values).max!;
  }
  function modulo(a: number, b: number) {
    if (b === 0)
      throw new TijuanaRuntimeError("zero-divisor", "mod: division by zero");
    return ((a % b) + b) % b;
  }
  function heading(a: ModelAgent, h: number) {
    a.rotate(h - a.heading);
  }
  function pointAhead(a: ModelAgent, length: number) {
    const d = geometry.direction({ heading: a.heading });
    return geometry.normalize(
      { x: a.x + d.x * length, y: a.y + d.y * length },
      { space, endpoints: "half-open" },
    );
  }
  function jump(a: ModelAgent, length: number) {
    const p = pointAhead(a, length);
    if (p) moveTo(a, p);
  }
  function forward(a: ModelAgent, length: number) {
    const sign = Math.sign(length);
    let rest = Math.abs(length);
    while (rest >= 1) {
      jump(a, sign);
      rest -= 1;
    }
    if (rest) jump(a, sign * rest);
  }
  function moveTo(a: ModelAgent, p: Position) {
    const from = { x: a.x, y: a.y };
    a.move({ to: p });
    if (a.penDown)
      traces.push({
        ordinal: traces.length,
        birthOrdinal: a.birthOrdinal,
        from,
        to: { x: a.x, y: a.y },
        colorNumber: a.colorNumber,
        width: a.penSize,
      });
  }
  const ahead = (a: ModelAgent, n: number) => {
    const p = pointAhead(a, n);
    return p ? grid.fieldAt(p) : undefined;
  };
  function birth(kind: Kind, p: Position, parent?: ModelAgent): ModelAgent {
    const scalar: AgentState = {
      kind,
      birthOrdinal: nextBirthOrdinal++,
      size: 1,
      colorNumber: 0,
      shape: "default",
      label: "",
      hidden: false,
      penDown: false,
      penSize: 1,
      energy: 0,
      weight: 0,
      blockSize: 0,
      tooClose: 0,
      origin: 0,
      income: 0,
      savings: 0,
      livingExpenses: 0,
      residentSince: 0,
      works: 0,
    };
    if (parent) {
      for (const key of Object.keys(scalar) as (keyof AgentState)[])
        if (
          !["kind", "birthOrdinal", "origin", "works", "tooClose"].includes(key)
        )
          Object.assign(scalar, { [key]: parent[key] });
    }
    const a = Agent.add(scalar, {
      position: { x: p.x, y: p.y },
      orientation: { heading: parent ? parent.heading : integer(360) },
    });
    world.add(a);
    if (parent) {
      a.origin = parent.origin;
      a.works = parent.works === 0 ? 0 : [...parent.works];
      a.tooClose = parent.tooClose === 0 ? 0 : [...parent.tooClose];
    }
    return a;
  }
  function batch(
    kind: Kind,
    n: number,
    p: Position,
    init: (a: ModelAgent) => void,
  ) {
    const born: ModelAgent[] = [];
    for (let i = 0; i < n; i++) born.push(birth(kind, p));
    ask(born, init);
  }
  function nearest(items: ModelAgent[], p: Position) {
    if (!items.length) return undefined;
    const d = Math.min(...items.map((a) => distance(a, p)));
    return one(items.filter((a) => distance(a, p) === d));
  }
  function numeric(value: number | "0.0", operation: string) {
    if (typeof value !== "number")
      throw new TijuanaRuntimeError(
        "numeric-type",
        `${operation}: expected numeric utility`,
      );
    return value;
  }
  function getCosts(a: ModelAgent) {
    const f = here(a);
    const works = a.works === 0 ? [] : a.works;
    const workplace = one(
      breed("employment-center").filter((w) => works.includes(w)),
    );
    const service = required(
      one(breed("service-center")),
      "get-costs service distance",
    );
    if (!workplace)
      throw new TijuanaRuntimeError(
        "invalid-source-reference",
        "get-costs: missing/dead workplace",
      );
    const travel = distance(a, service) / 30 + distance(a, workplace) / 25;
    const transportCost = numeric(f.transport, "get-costs transport") * travel;
    a.livingExpenses =
      f.landValue +
      numeric(f.electricity, "get-costs electricity") +
      numeric(f.water, "get-costs water") +
      27 +
      transportCost +
      8;
  }
  function colorMigrants(expansion = false) {
    for (const a of breed("migrant")) {
      if (settings.colorCode) {
        const colors = { oaxaca: 135, jalisco: 25, zacatecas: 105, mexico: 55 };
        if (typeof a.origin === "string") a.colorNumber = colors[a.origin];
      } else if (expansion || a.shape === "circle")
        a.colorNumber =
          !expansion && settings.visualUpdate === "land value gradient"
            ? 9.9
            : 0;
    }
  }
  function updateDisplayImpl() {
    for (const f of fields) {
      switch (settings.visualUpdate) {
        case "off":
          f.colorNumber = 9.9;
          break;
        case "elevation":
          f.colorNumber = f.elevation + 50;
          break;
        case "land value gradient":
          f.colorNumber = f.landValue;
          break;
        case "units with no water":
          if (f.water === 10 && at(f, "migrant").length) f.colorNumber = 67;
          break;
        case "units with no electricity":
          if (f.electricity === 1 && at(f, "migrant").length)
            f.colorNumber = 127;
          break;
        case "colonias":
          if (f.colonia === 0) f.colonia = 9.9;
          if (f.colonia !== 0 && f.colonia > -10)
            f.colorNumber = f.colonia + 10;
          if (f.colonia < -9.9) f.colorNumber = 0;
      }
    }
    colorMigrants();
  }
  function generateTopography() {
    for (const f of fields) f.elevation = 9.9;
    const nuclei = sample(
      fields.filter((f) => Math.abs(f.x) < 65 && Math.abs(f.y) < 37),
      integer(4) + 2,
    );
    for (let i = 0; i < 3; i++)
      ask(nuclei, (f) => {
        f.elevation = 8;
        ask(sample(radius(f, normal(15, 3)), 15), (p) => (p.elevation = 8));
        const n = required(one(neighbors.get(f)!), "topography neighbor");
        n.elevation = 8;
        ask(sample(radius(n, normal(8, 2)), 13), (p) => (p.elevation = 8));
      });
    for (let i = 0; i < 2; i++)
      ask(
        fields.filter(
          (f) => neighbors.get(f)!.filter((p) => p.elevation === 8).length > 2,
        ),
        (f) => (f.elevation = 8),
      );
    ask(
      fields.filter(
        (f) =>
          f.elevation === 8 &&
          neighbors.get(f)!.filter((p) => p.elevation === 8).length < 2,
      ),
      (f) => (f.elevation = 9.9),
    );
    grid.diffuse("elevation", { rate: 1, neighborhood: "moore" });
  }
  function initializeRoads() {
    generateTopography();
    for (const f of fields)
      Object.assign(f, {
        water: 10,
        electricity: 1,
        transport: 1.5,
        occupied: "no",
      });
    ask(
      sample(
        fields.filter((f) => Math.abs(f.x) < 65 && Math.abs(f.y) < 37),
        settings.serviceCenters,
      ),
      (f) => {
        for (const p of [f, ...neighbors.get(f)!])
          Object.assign(p, {
            landValue: 35,
            water: 2,
            electricity: 3,
            transport: 1,
          });
        for (const p of radius(f, 20)) p.elevation = 9.9;
        batch("service-center", 1, f, (a) =>
          Object.assign(a, { shape: "eyeball", size: 5, colorNumber: 4 }),
        );
        batch("first-builder", round(normal(4, 1)), f, (a) => {
          a.label = a.birthOrdinal + 1;
          heading(
            a,
            normal(a.label * (360 / breed("first-builder").length), 20),
          );
          a.energy = normal(75, 15);
          a.blockSize = round(normal(2, 0.15));
          a.weight = 0.9;
          a.penSize = 1.5;
          a.penDown = true;
        });
      },
    );
    ask(breed("service-center"), (s) =>
      ask(
        at(here(s), "first-builder"),
        (b) => (b.origin = { kind: "services", agents: [s] }),
      ),
    );
    if (settings.serviceCenters > 1)
      ask(breed("service-center"), (s) => {
        const b = required(
          one(
            breed("first-builder").filter(
              (b) =>
                typeof b.origin === "object" &&
                b.origin.kind === "services" &&
                b.origin.agents.includes(s),
            ),
          ),
          "towards-other-centers road",
        );
        const other = required(
          one(breed("service-center").filter((o) => o !== s)),
          "towards-other-centers destination",
        );
        b.rotate({ towards: other });
      });
  }
  function generateSecondOrder(a: ModelAgent) {
    for (const angle of [90, -90]) {
      const b = birth("second-builder", a, a);
      b.rotate(angle);
      b.energy = integer(b.energy);
    }
  }
  function hatchThird(a: ModelAgent) {
    for (const angle of [90, -90]) {
      const b = birth("third-builder", a, a);
      b.rotate(angle);
      b.energy = normal(b.energy, 2) + 2;
    }
  }
  function roadBuilder(
    a: ModelAgent,
    kind: "second-builder" | "third-builder",
    firstPhaseLimit: number,
  ) {
    a.label = "";
    if (a.energy !== 0) forward(a, 0.5);
    a.penDown = true;
    a.colorNumber = 7;
    a.penSize = 1;
    a.weight = precision(
      a.weight - (kind === "second-builder" ? 0.001 : 0.0007),
      3,
    );
    const f = here(a);
    Object.assign(f, {
      landValue: a.weight * 7,
      water: 2,
      electricity: 3,
      transport: 1,
    });
    if (kind === "third-builder" && a.weight > 0.3)
      for (const p of radius(a, 2)) p.electricity = 3;
    if (a.weight < 0) a.weight = 0;
    if (modulo(round(a.heading), 15) < 5 || modulo(round(a.heading), 15) > 10)
      heading(a, a.heading + round(normal(5, 10)));
    const serviceDistance = () =>
      distance(
        a,
        required(one(breed("service-center")), "builder service distance"),
      );
    if (f.ctr === "+" && serviceDistance() < 60) a.energy -= 0.5;
    if (f.ctr !== "+") {
      a.energy -= 1;
      if (kind === "second-builder" && serviceDistance() > 60) a.energy -= 2;
    }
    if (kind === "third-builder" && serviceDistance() > 60) a.energy -= 2;
    if (a.energy < 0.5) a.energy = 0;
    if (kind === "second-builder" && a.energy === 0) {
      a.delete();
      return;
    }
    if (
      kind === "third-builder" &&
      modulo(world.tick.value, round(normal(3.75, 0.25))) === 0 &&
      a.energy !== 0
    )
      hatchThird(a);
    const p = ahead(a, 1);
    if (!p) {
      a.delete();
      return;
    }
    if (p.elevation < 9.9) {
      if (kind === "second-builder") forward(a, 0.5);
      a.delete();
      return;
    }
    if (kind === "second-builder") {
      if (p.landValue !== 0) {
        forward(a, 0.5);
        a.delete();
        return;
      }
      if (p.transport === 0.75) {
        forward(a, 1);
        a.delete();
        return;
      }
      if (world.tick.value < firstPhaseLimit && a.energy === 0) {
        a.delete();
        return;
      }
      if (modulo(world.tick.value, round(normal(5, 1))) === 0 && a.energy !== 0)
        hatchThird(a);
    } else {
      if (p.transport === 0.75) {
        forward(a, 0.5);
        a.delete();
        return;
      }
      if (p.landValue !== 0) {
        forward(a, 1);
        a.delete();
        return;
      }
    }
  }
  function maquiladoras() {
    const roads = fields.filter((f) => f.transport === 0.75);
    const candidates = fields.filter(
      (f) =>
        f.landValue < 0.75 &&
        f.landValue > 0.05 &&
        Math.abs(f.y) < 52 &&
        Math.abs(f.x) < 80 &&
        Math.max(...neighbors.get(f)!.map((p) => p.landValue)) < 0.6 &&
        f.transport !== 0.75 &&
        f.elevation === 9.9 &&
        roads.some((p) => distance(f, p) < 6) &&
        !roads.some((p) => distance(f, p) < 3),
    );
    if (candidates.length < settings.maquiladoras)
      warnings.push(
        "Warning: unable to create all employment centers, insufficient candidate fields.",
      );
    batch("employment-center", settings.maquiladoras, { x: 0, y: 0 }, (a) => {
      Object.assign(a, {
        shape: "factory",
        label: "",
        colorNumber: 95,
        size: 7,
      });
      const f = one(
        candidates.filter(
          (p) => !breed("employment-center").some((j) => distance(j, p) < 5),
        ),
      );
      if (f) moveTo(a, f);
      Object.assign(here(a), {
        water: "0.0",
        electricity: "0.0",
        transport: "0.0",
      });
    });
    ask(breed("employment-center"), (a) =>
      ask(
        at(here(a), "employment-center").filter((b) => b !== a),
        (b) => b.delete(),
      ),
    );
    for (const f of candidates.filter(
      (f) => at(f, "employment-center").length,
    )) {
      f.occupied = "maquiladora";
      for (const n of neighbors.get(f)!) {
        n.occupied = "maquiladora";
        for (const p of neighbors.get(n)!) p.occupied = "maquiladora";
      }
    }
  }
  function adjust() {
    for (let i = 0; i < 7; i++)
      grid.diffuse("landValue", { rate: 1, neighborhood: "moore" });
    for (const f of fields)
      f.landValue = precision(Math.max(0, f.landValue), 2);
    globals.values = mean(
      breed("third-builder").map((a) => here(a).landValue),
      "adjust values",
    );
    globals.weights = mean(
      breed("third-builder").map((a) => a.weight),
      "adjust weights",
    );
    globals.marginalValue = globals.values;
    globals.marginalWeight = globals.weights;
    ask(breed("third-builder"), (a) => a.delete());
    if (settings.serviceCenters > 1)
      ask(
        breed("service-center"),
        (a) => (a.size = Math.max(2, round(here(a).landValue - 3))),
      );
    maquiladoras();
  }
  function generateCityscape() {
    if (world.tick.value === 1) initializeRoads();
    ask(breed("first-builder"), (a) => {
      a.tooClose = [];
      forward(a, 1);
      a.colorNumber = 6;
      if (world.tick.value % 20 === 0) heading(a, normal(a.heading, 3));
      a.weight = precision(a.weight - 0.02, 3);
      Object.assign(here(a), {
        landValue: a.weight * 12,
        transport: 0.75,
        ctr: "+",
      });
      for (const f of radius(a, 8)) f.ctr = "+";
    });
    ask(breed("first-builder"), (a) => {
      if ([1, 3, 7, 10].map((n) => n * a.blockSize).includes(world.tick.value))
        generateSecondOrder(a);
      const p = ahead(a, 2);
      if (!p) {
        a.delete();
        return;
      }
      if (p.transport === 0.75) {
        forward(a, 2);
        a.delete();
      }
    });
    const limit = round(normal(100, 10));
    ask(breed("second-builder"), (a) =>
      roadBuilder(a, "second-builder", limit),
    );
    ask(breed("third-builder"), (a) => roadBuilder(a, "third-builder", limit));
    ask(
      all().filter(
        (a) =>
          ["first-builder", "second-builder", "third-builder"].includes(
            a.kind,
          ) &&
          (Math.abs(here(a).x) === 85 || Math.abs(here(a).y) === 57),
      ),
      (a) => a.delete(),
    );
    if (world.tick.value > 10 && breed("third-builder").length) {
      globals.values = mean(
        breed("third-builder").map((a) => here(a).landValue),
        "road values",
      );
      globals.weights = mean(
        breed("third-builder").map((a) => a.weight),
        "road weights",
      );
    }
    if (
      !breed("first-builder").length &&
      breed("third-builder").length &&
      breed("third-builder").every((a) => a.energy === 0)
    )
      adjust();
  }
  function initializeMigrant(a: ModelAgent, size: number) {
    a.size = size;
    a.shape = "circle";
    a.origin = required(
      one<Origin>(["oaxaca", "jalisco", "zacatecas", "mexico"]),
      "origin",
    );
    here(a).occupied = a.origin;
    a.works = [
      required(
        nearest(breed("employment-center"), a),
        "nearest employment-center",
      ),
    ];
    a.residentSince = round(normal(8, 2));
  }
  function initialCondition() {
    const water = fields.filter((f) => f.water === 2);
    const lots = fields.filter(
      (f) =>
        f.occupied === "no" &&
        f.transport !== 0.75 &&
        !nearAgents(f, 10, "employment-center").length &&
        f.elevation > 8.5 &&
        f.landValue <= globals.values - 0.35 &&
        f.landValue > globals.values / 45 &&
        water.some((p) => distance(f, p) < 6),
    );
    for (const f of lots) f.ctr = "p-i-lots";
    const population = round(
      (fields.filter((f) => f.water === 2 && f.electricity === 3).length *
        settings.initDensity) /
        6,
    );
    ask(sample(lots, population / 5), (f) =>
      batch("migrant", 1, f, (a) => initializeMigrant(a, 0.65)),
    );
  }
  function initialCondition2() {
    const seed = one(breed("migrant").filter((a) => a.size === 0.65));
    if (seed) {
      seed.size = 0.6;
      for (let i = 0; i < 4; i++) {
        const f = one(
          radius(seed, 3).filter(
            (f) => f.occupied === "no" && f.elevation > 8.5,
          ),
        );
        if (f)
          batch("migrant", 1, f, (a) => {
            initializeMigrant(a, 0.6);
            a.colorNumber = 15;
            getCosts(a);
          });
      }
    }
    colorMigrants(true);
    ask(breed("migrant"), (a) => (here(a).occupied = a.origin as Origin));
    if (!breed("migrant").some((a) => a.size === 0.65))
      globals.thirdPhase = "go";
  }
  function economics() {
    ask(breed("migrant"), (a) => {
      for (const f of radius(a, 4 - settings.coloniaSize / 2)) f.colonia -= 0.5;
      getCosts(a);
      globals.maxCost = max(
        breed("migrant").map((a) => a.livingExpenses),
        "economics max costs",
      );
      a.income = precision(normal(globals.maxCost, 3), 2);
      a.income = precision(a.income, 2);
      a.livingExpenses = precision(a.livingExpenses, 2);
    });
    ask(
      breed("migrant").filter((a) => a.income < a.livingExpenses),
      (a) => {
        while (a.income < a.livingExpenses) a.livingExpenses -= 1;
      },
    );
    if (!breed("migrant").some((a) => a.income < a.livingExpenses))
      globals.thirdPhase = "stop";
  }
  function setup() {
    generateCityscape();
    if (breed("employment-center").length && !breed("migrant").length)
      initialCondition();
    if (breed("migrant").some((a) => a.size === 0.65)) {
      for (const f of fields) f.landValue = precision(f.landValue, 2);
      initialCondition2();
    }
    if (globals.thirdPhase === "go") economics();
    if (globals.thirdPhase === "stop") {
      for (const f of fields) f.landValue = precision(f.landValue, 2);
      world.tick.reset();
      globals.setupDone = true;
      epoch++;
    }
  }
  function migrateStatic() {
    const a = required(one(breed("migrant")), "migrate-static migrant");
    const home = here(a);
    const f = one(
      radius(a, 1.5).filter(
        (p) =>
          p.occupied === "no" &&
          p.elevation > 8.5 &&
          p.landValue <= home.landValue,
      ),
    );
    if (f) {
      const child = birth("migrant", a, a);
      moveTo(child, f);
      home.occupied = a.origin as Origin;
      a.shape = "circle";
      a.residentSince = 0;
      getCosts(a);
      a.income = precision(normal(55, 3), 2);
      a.savings = precision(normal(15, 5), 2);
      getCosts(a);
      for (const p of radius(a, 4 - settings.coloniaSize)) p.colonia -= 0.5;
    }
  }
  function regulate() {
    ask(breed("third-builder"), (a) => {
      const p = ahead(a, 1);
      if (!p) {
        a.delete();
        return;
      }
      if (p.transport === 0.75) {
        forward(a, 1);
        a.delete();
        return;
      }
      if (p.landValue > here(a).landValue) {
        forward(a, 0.5);
        a.delete();
        return;
      }
      if (
        p.occupied === "maquiladora" ||
        !at(p, "migrant").length ||
        !nearAgents(a, 8, "ring").length
      )
        a.delete();
    });
  }
  function growCity() {
    ask(breed("third-builder"), (a) => {
      forward(a, 0.75);
      a.penDown = true;
      a.penSize = 1;
      a.weight = precision(a.weight - 0.05, 3);
      ask(at(here(a), "migrant"), (m) => getCosts(m));
      const f = here(a);
      Object.assign(f, {
        landValue: a.weight * 3,
        water: 2,
        electricity: 3,
        transport: 1,
      });
      f.colonia += 0.15;
      for (const p of neighbors.get(f)!) p.colonia += 0.15;
    });
  }
  function regularize() {
    const f = one(
      fields.filter(
        (f) =>
          f.colonia < -14 - settings.coloniaSize &&
          neighbors.get(f)!.some((p) => at(p, "migrant").length) &&
          f.x < 81 &&
          f.y < 53 &&
          !breed("ring").some((a) => distance(a, f) < 15),
      ),
    );
    if (breed("ring").length < 5 && f)
      batch("ring", 1, f, (a) =>
        Object.assign(a, { colorNumber: 27, shape: "loop" }),
      );
    ask(breed("ring"), (a) => {
      a.size =
        Math.abs(
          mean(
            nearAgents(a, 10, "migrant").map((m) => here(m).colonia),
            "regularize local colonia mean",
          ) ** 2,
        ) / 3;
      if (a.size < 3) {
        a.delete();
        return;
      }
      if (radius(a, 8).filter((f) => f.water === 10).length < 5) {
        a.delete();
        return;
      }
      if (!nearAgents(a, 6, "third-builder").length) {
        const site = one(
          radius(a, a.size).filter(
            (f) =>
              Math.abs(f.landValue) - globals.values < 0.25 &&
              at(f, "migrant").length &&
              f.water === 10 &&
              !at(f, "third-builder").length,
          ),
        );
        if (site)
          batch("third-builder", 1, site, (b) => {
            b.size = 1;
            b.colorNumber = 15;
            b.weight = globals.marginalWeight;
            b.rotate({
              towards: required(
                nearest(breed("migrant"), b),
                "regularize nearest migrant",
              ),
            });
            b.origin = { kind: "field", field: site };
          });
      }
    });
  }
  function cross() {
    if (world.tick.value % settings.crossingTicks === 0) {
      const a = required(one(breed("migrant")), "cross migrant");
      a.colorNumber = 108;
      a.size = 15;
      a.delete();
      globals.crossed++;
    }
  }
  function move() {
    ask(
      breed("migrant").filter((a) => a.residentSince > 5),
      (a) => {
        if (here(a).water === 10 && a.savings > settings.requiredCapital) {
          const f = one(
            radius(a, 50).filter(
              (f) =>
                f.water === 2 &&
                f.electricity === 3 &&
                f.landValue < a.savings * 0.001,
            ),
          );
          if (f) {
            a.rotate({ towards: f });
            jump(a, distance(a, f));
            a.colorNumber = 15;
            a.size = 0.8;
            a.savings -= here(a).landValue / 0.001;
            getCosts(a);
          }
        }
      },
    );
  }
  function go() {
    if (breed("third-builder").length) {
      globals.values = mean(
        breed("third-builder").map((a) => here(a).landValue),
        "go values",
      );
      globals.weights = mean(
        breed("third-builder").map((a) => a.weight),
        "go weights",
      );
    }
    globals.maxCost = max(
      breed("migrant").map((a) => a.livingExpenses),
      "go max costs",
    );
    updateDisplayImpl();
    ask(breed("migrant"), (a) => {
      a.savings = precision(a.savings, 2);
      a.livingExpenses = precision(a.livingExpenses, 2);
    });
    if (world.tick.value % settings.migrationTicks === 0) migrateStatic();
    ask(breed("migrant"), (a) => (here(a).occupied = a.origin as Origin));
    if (world.tick.value % 15 === 0)
      ask(
        breed("migrant"),
        (a) => (a.residentSince = round(a.residentSince + 1)),
      );
    ask(breed("third-builder"), (a) => (a.hidden = !settings.cityGrowth));
    if (settings.cityGrowth) regulate();
    if (
      settings.cityGrowth &&
      modulo(world.tick.value, settings.buildingTicks) === 0
    )
      growCity();
    if (
      settings.cityGrowth &&
      modulo(world.tick.value, settings.buildingTicks * 2) === 0
    )
      ask(breed("third-builder"), (a) => {
        for (const angle of [90, -90]) {
          const b = birth("third-builder", a, a);
          b.rotate(angle);
          b.weight = globals.marginalWeight;
        }
      });
    for (const f of fields) {
      if (f.landValue < 0) f.landValue = 0;
      if (!at(f, "migrant").length && f.occupied !== "maquiladora")
        f.occupied = "no";
      if (f.colonia > -0.1) f.colonia = 9.9;
    }
    ask(
      all().filter(
        (a) => Math.abs(here(a).x) === 85 || Math.abs(here(a).y) === 57,
      ),
      (a) => a.delete(),
    );
    regularize();
    cross();
    ask(breed("migrant"), (a) => {
      a.savings = precision(a.savings + a.income - a.livingExpenses, 2);
      if (a.savings < 7) a.savings = 0;
    });
    move();
  }
  function counts(): TijuanaCounts {
    return {
      serviceCenters: breed("service-center").length,
      employmentCenters: breed("employment-center").length,
      firstBuilders: breed("first-builder").length,
      secondBuilders: breed("second-builder").length,
      thirdBuilders: breed("third-builder").length,
      migrants: breed("migrant").length,
      rings: breed("ring").length,
      nodes: breed("node").length,
    };
  }
  const seedMigrants = () =>
    breed("migrant").filter((a) => a.size === 0.65).length;
  function boundary<R>(action: FailedCall["action"], fn: () => R): R {
    try {
      return fn();
    } catch (error) {
      lastFailure = {
        action,
        tick: world.tick.value,
        epoch,
        code: error instanceof TijuanaRuntimeError ? error.code : "unexpected",
        message: error instanceof Error ? error.message : String(error),
      };
      throw error;
    }
  }
  function advance(action: "cityscape" | "go", count = 1): ActionResult {
    stepCount(count);
    if (count === 0) return { status: "noop", completed: 0 };
    if ((action === "cityscape") === globals.setupDone)
      return {
        status: "guarded",
        completed: 0,
        message:
          action === "cityscape"
            ? "Cityscape setup is already completed."
            : "Cityscape setup is not completed.",
      };
    let completed = 0;
    for (let i = 0; i < count; i++) {
      boundary(action, () => {
        const tickBefore = world.tick.value;
        world.tick.advance();
        if (action === "cityscape") setup();
        else go();
        history.push({
          action,
          epoch,
          tickBefore,
          tickAfter: world.tick.value,
          setupDone: globals.setupDone,
          counts: counts(),
          seedMigrants: seedMigrants(),
        });
        if (history.length > 1001) history.splice(1, 1);
        lastFailure = null;
      });
      completed++;
      if (action === "cityscape" && globals.setupDone)
        return { status: "ready", completed };
    }
    return { status: "advanced", completed };
  }
  function resetObservations() {
    history.length = 0;
    traces.length = 0;
    warnings.length = 0;
    lastFailure = null;
  }
  function clear() {
    for (const a of all()) a.delete();
    for (const f of fields) Object.assign(f, fieldDefaults());
    globals = globalDefaults();
    world.tick.reset();
    nextBirthOrdinal = 0;
    epoch++;
    resetObservations();
  }
  function setRules(rules: Partial<TijuanaRules>) {
    if (rules && typeof rules === "object" && Object.hasOwn(rules, "seed"))
      throw new TypeError("seed is factory configuration");
    settings = parameters(inputs, {
      ...settings,
      ...validatedRules(rules, false),
    });
  }
  function validatedRules(
    value: unknown,
    complete: boolean,
  ): Partial<TijuanaRules> {
    const keys = Object.keys(inputs).filter((k) => k !== "seed");
    if (complete) record(value, keys);
    else {
      if (
        !value ||
        typeof value !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(value))
      )
        throw new TypeError("Expected rules record");
      for (const k of Reflect.ownKeys(value))
        if (
          typeof k !== "string" ||
          !keys.includes(k) ||
          !("value" in Object.getOwnPropertyDescriptor(value, k)!)
        )
          throw new TypeError("Invalid rule key or accessor");
    }
    for (const v of Object.values(value as object))
      if (v === undefined) throw new TypeError("Undefined rule");
    return value as Partial<TijuanaRules>;
  }
  function addNode(position: { x: number; y: number }) {
    record(position, ["x", "y"]);
    finite(position.x);
    finite(position.y);
    const normalized = geometry.normalize(position, {
      space,
      endpoints: "half-open",
    });
    if (!normalized) throw new RangeError("Node is outside half-open world");
    boundary("add-node", () => {
      const f = here(normalized);
      batch("node", 1, f, (a) => {
        Object.assign(a, { size: 3, shape: "loop", colorNumber: 15 });
        Object.assign(f, {
          water: 2,
          electricity: 3,
          transport: 1,
          landValue: globals.weights,
        });
        ask(
          radius(a, settings.carryingCapacity).filter(
            (p) =>
              p.occupied !== "maquiladora" &&
              p.landValue < globals.marginalValue,
          ),
          (p) => {
            Object.assign(p, { water: 2, electricity: 3, transport: 1 });
            const node = required(nearest(breed("node"), p), "node nearest");
            p.landValue =
              globals.weights -
              (distance(p, node) / settings.carryingCapacity) * 0.15;
          },
        );
      });
    });
  }
  function setScenario(scenario: TijuanaScenario) {
    record(scenario, [
      "mode",
      "tick",
      "parameters",
      "globals",
      "nextBirthOrdinal",
      "cells",
      "agents",
      "randomState",
    ]);
    if (!["ordinary", "diagnostic"].includes(scenario.mode))
      throw new TypeError("Invalid scenario mode");
    natural(scenario.tick);
    natural(scenario.nextBirthOrdinal);
    const nextSettings = parameters(inputs, {
      seed: settings.seed,
      ...validatedRules(scenario.parameters, true),
    });
    record(scenario.globals, Object.keys(globalDefaults()));
    for (const k of [
      "values",
      "weights",
      "marginalValue",
      "marginalWeight",
      "maxCost",
    ] as const)
      finite(scenario.globals[k]);
    natural(scenario.globals.crossed);
    if (
      ![0, "go", "stop"].includes(scenario.globals.thirdPhase) ||
      typeof scenario.globals.setupDone !== "boolean"
    )
      throw new TypeError("Invalid globals");
    array(scenario.cells);
    if (scenario.cells.length !== fields.length)
      throw new RangeError("Expected every canonical field");
    for (const f of scenario.cells) {
      record(f, Object.keys(fieldDefaults()));
      for (const k of [
        "landValue",
        "elevation",
        "colonia",
        "colorNumber",
      ] as const)
        finite(f[k]);
      for (const k of ["water", "electricity", "transport"] as const)
        if (f[k] !== "0.0") finite(f[k]);
      if (
        ![
          0,
          "no",
          "maquiladora",
          "oaxaca",
          "jalisco",
          "zacatecas",
          "mexico",
        ].includes(f.occupied) ||
        ![0, "+", "p-i-lots"].includes(f.ctr)
      )
        throw new TypeError("Invalid field variant");
    }
    array(scenario.agents);
    const keys = new Map<string, TijuanaAgentInput>(),
      ordinals = new Set<number>();
    const agentKeys = [
      "key",
      "kind",
      "birthOrdinal",
      "x",
      "y",
      "heading",
      "size",
      "colorNumber",
      "shape",
      "label",
      "hidden",
      "penDown",
      "penSize",
    ];
    for (const a of scenario.agents) {
      if (!a || typeof a !== "object")
        throw new TypeError("Expected agent input");
      const descriptor = Object.getOwnPropertyDescriptor(a, "kind");
      if (!descriptor || !("value" in descriptor))
        throw new TypeError("Expected breed data");
      const extras =
        a.kind === "first-builder"
          ? ["energy", "weight", "blockSize", "tooClose", "origin"]
          : ["second-builder", "third-builder"].includes(a.kind)
            ? ["energy", "weight", "origin"]
            : a.kind === "migrant"
              ? [
                  "income",
                  "savings",
                  "livingExpenses",
                  "residentSince",
                  "origin",
                  "works",
                ]
              : [
                    "service-center",
                    "employment-center",
                    "ring",
                    "node",
                  ].includes(a.kind)
                ? []
                : null;
      if (!extras) throw new TypeError("Invalid breed");
      record(a, [...agentKeys, ...extras]);
      if (typeof a.key !== "string" || !a.key || keys.has(a.key))
        throw new TypeError("Unique nonempty fixture key required");
      natural(a.birthOrdinal);
      if (
        ordinals.has(a.birthOrdinal) ||
        a.birthOrdinal >= scenario.nextBirthOrdinal
      )
        throw new RangeError("Invalid source birth ordinal");
      ordinals.add(a.birthOrdinal);
      keys.set(a.key, a);
      for (const k of [
        "x",
        "y",
        "heading",
        "size",
        "colorNumber",
        "penSize",
      ] as const)
        finite(a[k]);
      if (
        !geometry.normalize(
          { x: a.x, y: a.y },
          { space, endpoints: "half-open" },
        ) ||
        a.penSize < 0
      )
        throw new RangeError("Invalid agent position or pen size");
      if (
        typeof a.shape !== "string" ||
        typeof a.hidden !== "boolean" ||
        typeof a.penDown !== "boolean" ||
        (typeof a.label !== "string" && typeof a.label !== "number")
      )
        throw new TypeError("Invalid agent data");
      if (typeof a.label === "number") finite(a.label);
      if (a.kind === "migrant") {
        for (const k of [
          "income",
          "savings",
          "livingExpenses",
          "residentSince",
        ] as const)
          finite(a[k]);
        if (!Number.isSafeInteger(a.residentSince))
          throw new RangeError("Residence is an integer");
        if (![0, "oaxaca", "jalisco", "zacatecas", "mexico"].includes(a.origin))
          throw new TypeError("Invalid migrant origin");
        if (a.works !== 0) array(a.works);
      }
      if (
        a.kind === "first-builder" ||
        a.kind === "second-builder" ||
        a.kind === "third-builder"
      ) {
        finite(a.energy);
        finite(a.weight);
        if (a.kind === "first-builder") {
          finite(a.blockSize);
          if (!Number.isSafeInteger(a.blockSize))
            throw new RangeError("Integer block size required");
          if (a.tooClose !== 0) array(a.tooClose);
        }
        if (a.origin !== 0) {
          if (!a.origin || typeof a.origin !== "object")
            throw new TypeError("Invalid builder origin");
          const originKind = Object.getOwnPropertyDescriptor(a.origin, "kind");
          if (!originKind || !("value" in originKind))
            throw new TypeError("Expected origin discriminator data");
          if (a.origin.kind === "services") {
            record(a.origin, ["kind", "keys"]);
            array(a.origin.keys);
          } else if (a.origin.kind === "field") {
            record(a.origin, ["kind", "x", "y"]);
            if (
              !Number.isInteger(a.origin.x) ||
              !Number.isInteger(a.origin.y) ||
              !geometry.normalize(
                { x: a.origin.x, y: a.origin.y },
                {
                  space,
                  endpoints: "half-open",
                },
              ) ||
              !grid.fieldAt({ x: a.origin.x, y: a.origin.y })
            )
              throw new RangeError("Invalid field origin");
          } else throw new TypeError("Invalid builder origin variant");
        }
      }
    }
    function refs(values: readonly string[], kind?: Kind) {
      const seen = new Set<string>();
      for (const key of values) {
        if (
          typeof key !== "string" ||
          seen.has(key) ||
          !keys.has(key) ||
          (kind && keys.get(key)!.kind !== kind)
        )
          throw new TypeError("Invalid or missing fixture reference key");
        seen.add(key);
      }
    }
    for (const a of scenario.agents) {
      if (a.kind === "migrant") {
        if (a.works !== 0) refs(a.works, "employment-center");
        if (
          scenario.mode === "ordinary" &&
          (a.works === 0 ||
            !a.works.length ||
            !scenario.agents.some((a) => a.kind === "service-center"))
        )
          throw new TypeError(
            "Ordinary migrant requires work and service context",
          );
      }
      if (a.kind === "first-builder" && a.tooClose !== 0) refs(a.tooClose);
      if (
        ["first-builder", "second-builder", "third-builder"].includes(a.kind)
      ) {
        const origin = (
          a as Extract<TijuanaAgentInput, { kind: "third-builder" }>
        ).origin;
        if (origin !== 0 && origin.kind === "services")
          refs(origin.keys, "service-center");
      }
    }
    const continuation = random.copy();
    continuation.state = scenario.randomState;
    if (continuation.seed !== settings.seed >>> 0)
      throw new RangeError("Scenario RNG seed mismatch");
    // All admission checks precede any mutation of canonical state.
    for (const a of all()) a.delete();
    settings = nextSettings;
    for (let i = 0; i < fields.length; i++)
      Object.assign(fields[i]!, scenario.cells[i]);
    globals = { ...scenario.globals };
    world.tick.reset();
    world.tick.advance(scenario.tick);
    random.state = continuation.state;
    const live = new Map<string, ModelAgent>();
    for (const input of scenario.agents) {
      const a = birth(input.kind, input);
      heading(a, input.heading);
      for (const k of [
        "size",
        "colorNumber",
        "shape",
        "label",
        "hidden",
        "penDown",
        "penSize",
      ] as const)
        Object.assign(a, { [k]: input[k] });
      if (input.kind === "migrant")
        Object.assign(a, {
          income: input.income,
          savings: input.savings,
          livingExpenses: input.livingExpenses,
          residentSince: input.residentSince,
          origin: input.origin,
        });
      if (
        input.kind === "first-builder" ||
        input.kind === "second-builder" ||
        input.kind === "third-builder"
      )
        Object.assign(a, { energy: input.energy, weight: input.weight });
      if (input.kind === "first-builder") a.blockSize = input.blockSize;
      a.birthOrdinal = input.birthOrdinal;
      live.set(input.key, a);
    }
    for (const input of scenario.agents) {
      const a = live.get(input.key)!;
      if (input.kind === "migrant")
        a.works = input.works === 0 ? 0 : input.works.map((k) => live.get(k)!);
      if (input.kind === "first-builder")
        a.tooClose =
          input.tooClose === 0 ? 0 : input.tooClose.map((k) => live.get(k)!);
      if (
        input.kind === "first-builder" ||
        input.kind === "second-builder" ||
        input.kind === "third-builder"
      )
        a.origin =
          input.origin === 0
            ? 0
            : input.origin.kind === "services"
              ? {
                  kind: "services",
                  agents: input.origin.keys.map((k) => live.get(k)!),
                }
              : {
                  kind: "field",
                  field: here({ x: input.origin.x, y: input.origin.y }),
                };
    }
    random.state = continuation.state;
    nextBirthOrdinal = scenario.nextBirthOrdinal;
    epoch++;
    resetObservations();
  }
  function reference(a: ModelAgent): AgentReference {
    return { id: a.id, birthOrdinal: a.birthOrdinal, alive: a.alive };
  }
  function originRead(origin: LiveOrigin | Origin): BuilderOriginRead {
    if (origin === 0) return 0;
    if (typeof origin === "string")
      throw new Error("Builder has migrant origin");
    return origin.kind === "services"
      ? { kind: "services", agents: origin.agents.map(reference) }
      : {
          kind: "field",
          id: origin.field.id,
          x: origin.field.x,
          y: origin.field.y,
        };
  }
  function agentRead(a: ModelAgent): TijuanaAgentRead {
    const base = {
      id: a.id,
      birthOrdinal: a.birthOrdinal,
      x: a.x,
      y: a.y,
      // Public orientation reconstructs angles through atan2; remove only its
      // integer round-off in detached presentation, never store another heading.
      heading:
        Math.abs(a.heading - Math.round(a.heading)) < 1e-10
          ? Math.round(a.heading) % 360
          : a.heading,
      size: a.size,
      colorNumber: a.colorNumber,
      shape: a.shape,
      label: a.label,
      hidden: a.hidden,
      penDown: a.penDown,
      penSize: a.penSize,
    };
    switch (a.kind) {
      case "first-builder":
        return {
          ...base,
          kind: a.kind,
          energy: a.energy,
          weight: a.weight,
          blockSize: a.blockSize,
          tooClose: a.tooClose === 0 ? 0 : a.tooClose.map(reference),
          origin: originRead(a.origin),
        };
      case "second-builder":
      case "third-builder":
        return {
          ...base,
          kind: a.kind,
          energy: a.energy,
          weight: a.weight,
          origin: originRead(a.origin),
        };
      case "migrant":
        return {
          ...base,
          kind: a.kind,
          income: a.income,
          savings: a.savings,
          livingExpenses: a.livingExpenses,
          residentSince: a.residentSince,
          origin: a.origin as 0 | Origin,
          works: a.works === 0 ? 0 : a.works.map(reference),
        };
      default:
        return { ...base, kind: a.kind };
    }
  }
  function read(): TijuanaRead {
    const migrants = breed("migrant"),
      ordinary = migrants.filter((a) => a.size === 0.6),
      relocated = migrants.filter((a) => a.size === 0.8);
    const equippedFieldCount = fields.filter(
      (f) => f.water === 2 && f.electricity === 3,
    ).length;
    const denominator = equippedFieldCount * settings.initDensity;
    const reports: TijuanaReports = {
      savings: ordinary.length
        ? stats.describe(ordinary.map((a) => a.savings)).mean
        : undefined,
      savingsNode: relocated.length
        ? stats.describe(relocated.map((a) => a.savings)).mean
        : undefined,
      equippedFieldCount,
      noWaterPercent: denominator
        ? (fields.filter((f) => f.water === 10 && at(f, "migrant").length)
            .length *
            100) /
          denominator
        : undefined,
      noPowerPercent: denominator
        ? (fields.filter(
            (f) =>
              f.occupied !== "no" &&
              f.occupied !== "maquiladora" &&
              f.electricity === 1,
          ).length *
            100) /
          denominator
        : undefined,
      unavailable: {
        savings: ordinary.length ? null : "empty-subset",
        savingsNode: relocated.length ? null : "empty-subset",
        noWaterPercent: denominator ? null : "zero-denominator",
        noPowerPercent: denominator ? null : "zero-denominator",
      },
    };
    return freeze({
      width: 171,
      height: 115,
      tick: world.tick.value,
      epoch,
      parameters: { ...settings },
      globals: { ...globals },
      setupDone: globals.setupDone,
      phase: globals.setupDone
        ? "ready"
        : seedMigrants()
          ? "expanding"
          : breed("employment-center").length
            ? "seeding"
            : world.tick.value
              ? "generating"
              : "cleared",
      cells: fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        landValue: f.landValue,
        water: f.water,
        electricity: f.electricity,
        transport: f.transport,
        occupied: f.occupied,
        ctr: f.ctr,
        elevation: f.elevation,
        colonia: f.colonia,
        colorNumber: f.colorNumber,
      })),
      agents: all().map(agentRead),
      counts: counts(),
      seedMigrants: seedMigrants(),
      reports,
      randomState: random.state,
      history: history.map((h) => ({ ...h, counts: { ...h.counts } })),
      lastFailure: lastFailure ? { ...lastFailure } : null,
      warnings: [...warnings],
      traces: traces.map((t) => ({
        ...t,
        from: { ...t.from },
        to: { ...t.to },
      })),
      done: false,
    });
  }
  return {
    clear,
    advanceCityscape: (count = 1) => advance("cityscape", count),
    advance: (count = 1) => advance("go", count),
    setRules,
    updateDisplay: () => boundary("update-display", updateDisplayImpl),
    addNode,
    setScenario,
    read,
  };
}
export const model = {
  title: "Urban Suite - Tijuana Bordertowns",
  description:
    "Road generation, settlement, infrastructure and household economics.",
  inputs,
  create,
} satisfies Definition<TijuanaParameters, TijuanaModel>;
