/** Adapted from Felsen and Wilensky (2007), Copyright Uri Wilensky.
 * CC BY-NC-SA 3.0; see retained source.nlogox/NOTICE.md.
 * Canonical Agents/Fields, explicit source phases; target Mulberry activation.
 */
import { Agent, Grid, Random, World, geometry, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface EconomicParameters {
  seed: number; testCount: number; residentsPerJob: number;
  poorPersonCountPerStep: number; richPersonCountPerStep: number; poorPricePriority: number;
  richQualityPriority: number; maxJobCount: number; deathRate: number;
}
export const inputs: Inputs<EconomicParameters> = {
  seed: { kind: "number", default: 1, min: -2147483648, max: 4294967295, integer: true },
  testCount: { kind: "number", default: 15, min: 0, max: 30, integer: true },
  residentsPerJob: { kind: "number", default: 100, min: 0, max: 500, step: 10, integer: true },
  poorPersonCountPerStep: { kind: "number", default: 5, min: 0, max: 15, integer: true },
  richPersonCountPerStep: { kind: "number", default: 5, min: 0, max: 15, integer: true },
  poorPricePriority: { kind: "number", default: 0, min: -1, max: 1, step: 0.1 },
  richQualityPriority: { kind: "number", default: 0, min: -1, max: 1, step: 0.1 },
  maxJobCount: { kind: "number", default: 10, min: 5, max: 20, integer: true },
  deathRate: { kind: "number", default: 4, min: 0, max: 15, integer: true },
};
export type EconomicKind = "rich" | "poor" | "job";
export type EconomicView = "quality" | "price" | "dist" | "poor-utility" | "rich-utility";
export interface EconomicAgentInput { readonly kind: EconomicKind; readonly x: number; readonly y: number; readonly utility: number }
export interface EconomicLandInput { readonly price: number; readonly quality: number }
type Resident = Agent<{ kind: EconomicKind; utility: number }>;
type LiveRules = Omit<EconomicParameters, "seed">;
interface EconomicSample {
  readonly tick: number; readonly richPersonCount: number; readonly poorPersonCount: number; readonly jobCount: number;
  readonly richMedianTravelDistance: number | undefined; readonly poorMedianTravelDistance: number | undefined;
}

export function create(options: Partial<EconomicParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const width = 89, height = 89;
  const space = { x: width, y: height, boundary: "hard" as const };
  const random = Random.create({ seed: settings.seed });
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { price: 40, quality: 40, sdDistance: 0, colorNumber: 50 } });
  world.add(grid);
  const fields = grid.fields;
  let counter = 0;
  let viewMode: EconomicView = "quality";
  let utilityRanges: Readonly<{ minPoorPersonCount: number; maxPoorPersonCount: number; minRichPersonCount: number; maxRichPersonCount: number }> = Object.freeze({ minPoorPersonCount: 0, maxPoorPersonCount: 0, minRichPersonCount: 0, maxRichPersonCount: 0 });
  const history: Readonly<EconomicSample>[] = [];
  const residents = () => world.agents as readonly Resident[];
  const group = (kind: EconomicKind) => residents().filter(person => person.kind === kind);
  function activation<T>(snapshot: readonly T[]) {
    return random.sample(snapshot, { sampleCount: snapshot.length, algorithm: "fisher-yates-descending" });
  }
  function createResident(kind: EconomicKind, x = 0, y = 0, utility = 0) {
    const person = Agent.create({ kind, utility }, { position: { x, y } });
    world.add(person); return person;
  }
  function poorUtility(field: typeof fields[number]) {
    return (1 / (field.sdDistance / 100 + 0.1)) ** (1 - settings.poorPricePriority) * (1 / field.price) ** (1 + settings.poorPricePriority);
  }
  function richUtility(field: typeof fields[number]) {
    return (1 / (field.sdDistance + 0.1)) ** (1 - settings.richQualityPriority) * field.quality ** (1 + settings.richQualityPriority);
  }
  function nearestJobDistance(point: { readonly x: number; readonly y: number }) {
    const jobs = group("job");
    if (!jobs.length) throw new RangeError("Nearest-job distance requires a job.");
    return Math.min(...jobs.map(job => geometry.distance(point, job, { space })));
  }
  function refreshJobDistances(offset: number) {
    const jobs = group("job");
    if (!jobs.length) throw new RangeError("Nearest-job distance requires a job.");
    for (const field of fields) field.sdDistance = Math.min(...jobs.map(job => geometry.distance(field, job, { space }))) + offset;
  }
  // The source's nested radii overlap. Continuous Agent positions, not rounded
  // field centers, determine all five radius memberships.
  function affectLand(person: Resident, property: "price" | "quality", increase: boolean) {
    const here = grid.fieldAt(person)!;
    here[property] *= increase ? 1.05 : 0.95;
    const near = fields.filter(field => Math.abs(field.x - person.x) <= 4 && Math.abs(field.y - person.y) <= 4)
      .map(field => ({ field, distance: geometry.distance(person, field, { space }) }));
    for (let radius = 1; radius <= 4; radius++) {
      const factor = increase ? 1 + (5 - radius) / 100 : 1 - (5 - radius) / 100;
      for (const { field, distance } of near) if (distance <= radius) {
        field[property] *= factor;
        if (radius === 4) field[property] = increase ? Math.min(100, field[property]) : Math.max(1, field[property]);
      }
    }
  }
  function evaluateLocation(person: Resident) {
    const candidates = random.sample(fields, { sampleCount: settings.testCount }).filter(field => grid.agentsAt(field).length === 0);
    // Native STOP returns from evaluate-* only; the caller still affects land.
    if (!candidates.length) return;
    const score = person.kind === "poor" ? poorUtility : person.kind === "rich" ? richUtility : (field: typeof fields[number]) => field.price;
    const maximum = Math.max(...candidates.map(score));
    const chosen = random.sample(candidates.filter(field => score(field) === maximum))[0]!;
    person.move({ to: chosen }); person.utility = score(chosen);
  }
  function locateResidents(kind: "poor" | "rich", count: number) {
    counter += count;
    // All births exist when the source randomized creation commands begin.
    const newborns: Resident[] = [];
    for (let i = 0; i < count; i++) newborns.push(createResident(kind));
    for (const person of activation(newborns)) {
      evaluateLocation(person);
      if (kind === "poor") { affectLand(person, "quality", false); affectLand(person, "price", false); }
      else { affectLand(person, "price", true); affectLand(person, "quality", true); }
    }
  }
  function locateService() {
    const vacant = fields.filter(field => grid.agentsAt(field).length === 0);
    if (!vacant.length) return;
    const spawn = random.sample(vacant)[0]!;
    const job = createResident("job", spawn.x, spawn.y);
    evaluateLocation(job); refreshJobDistances(0.01);
  }
  function removeOldest(kind: EconomicKind, count: number) {
    // Canonical World insertion order is birth order, independent of opaque IDs.
    for (const person of group(kind).slice(0, count)) person.delete();
  }
  function updateView() {
    if (viewMode === "poor-utility" || viewMode === "rich-utility") {
      const poor = stats.describe(fields.map(poorUtility)), rich = stats.describe(fields.map(richUtility));
      utilityRanges = Object.freeze({ minPoorPersonCount: poor.min!, maxPoorPersonCount: poor.max!, minRichPersonCount: rich.min!, maxRichPersonCount: rich.max! });
    }
    for (const field of fields) {
      let base: number, fraction: number;
      if (viewMode === "quality") { base = 50; fraction = (field.quality - 1) / 99; }
      else if (viewMode === "price") { base = 40; fraction = field.price / 100; }
      else if (viewMode === "dist") { base = 100; fraction = (field.sdDistance - 0.45 * (44 * 1.414)) / ((0.05 - 0.45) * (44 * 1.414)); }
      else {
        const poor = viewMode === "poor-utility";
        const min = Math.log(poor ? utilityRanges.minPoorPersonCount : utilityRanges.minRichPersonCount);
        const max = Math.log(poor ? utilityRanges.maxPoorPersonCount : utilityRanges.maxRichPersonCount);
        const value = Math.log(poor ? poorUtility(field) : richUtility(field));
        base = poor ? 90 : 130;
        // Native equal-domain scale-color: at/below the bound is dark.
        fraction = min === max ? (value > max ? 1 : 0) : (value - min) / (max - min);
      }
      field.colorNumber = base + Math.min(9.9999, Math.max(0, fraction * 10));
    }
  }
  function measurements() {
    const rich = group("rich"), poor = group("poor"), jobs = group("job");
    // Empty class median is unavailable (undefined), never a fabricated zero.
    const medianTravelDistance = { rich: stats.describe(rich.map(nearestJobDistance)).median, poor: stats.describe(poor.map(nearestJobDistance)).median };
    return { counts: { richPersonCount: rich.length, poorPersonCount: poor.length, jobCount: jobs.length }, medianTravelDistance };
  }
  function record() {
    const measured = measurements();
    const sample = Object.freeze({ tick: world.tick.value, ...measured.counts, richMedianTravelDistance: measured.medianTravelDistance.rich, poorMedianTravelDistance: measured.medianTravelDistance.poor });
    if (history.at(-1)?.tick === sample.tick) history[history.length - 1] = sample; else history.push(sample);
    if (history.length > 1001) history.splice(1, 1);
  }
  function go() {
    locateResidents("poor", settings.poorPersonCountPerStep); locateResidents("rich", settings.richPersonCountPerStep);
    if (counter > settings.residentsPerJob) { locateService(); counter = 0; }
    if (group("rich").length >= 20) removeOldest("rich", settings.deathRate);
    if (group("poor").length >= 20) removeOldest("poor", settings.deathRate);
    if (group("job").length >= settings.maxJobCount) { removeOldest("job", 1); refreshJobDistances(0.01); }
    updateView();
  }
  createResident("job"); refreshJobDistances(0);
  for (const kind of ["rich", "poor"] as const) {
    const initial: Resident[] = [];
    for (let i = 0; i < 5; i++) initial.push(createResident(kind));
    for (const person of activation(initial)) {
      person.move({ to: { x: 5 - random.number({ min: 0, max: 10 }), y: 5 - random.number({ min: 0, max: 10 }) } });
      affectLand(person, "price", kind === "rich"); affectLand(person, "quality", kind === "rich");
    }
  }
  updateView(); record();
  return {
    advance(stepCount = 1) { validateStepCount(stepCount); for (let i = 0; i < stepCount; i++) { run(world, go); record(); } },
    setRules(rules: Partial<LiveRules>) {
      if (typeof rules !== "object" || rules === null || ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) || Reflect.ownKeys(rules).some(key => typeof key !== "string" || key === "seed" || !Object.hasOwn(inputs, key) || !("value" in Object.getOwnPropertyDescriptor(rules, key)!))) throw new TypeError("Supply only live Economic rule data.");
      settings = parseParameters(inputs, { ...settings, ...rules }); record();
    },
    setViewMode(mode: EconomicView) {
      if (!["quality", "price", "dist", "poor-utility", "rich-utility"].includes(mode)) throw new TypeError("Unknown Economic view.");
      viewMode = mode; updateView(); record();
    },
    setAgents(values: readonly EconomicAgentInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Reflect.ownKeys(values).some(key => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= values.length))) throw new TypeError("Supply an Agent fixture array.");
      const copied: EconomicAgentInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const entry = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = entry && "value" in entry ? entry.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) || Reflect.ownKeys(value).length !== 4 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["kind", "x", "y", "utility"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!))) throw new TypeError("Supply kind/x/y/utility fixture data.");
        const person = value as EconomicAgentInput;
        if (!["rich", "poor", "job"].includes(person.kind) || ![person.x, person.y, person.utility].every(Number.isFinite) || !geometry.normalize({ x: person.x, y: person.y }, { space, endpoints: "half-open" })) throw new RangeError("Invalid Economic Agent fixture.");
        copied.push({ kind: person.kind, x: person.x, y: person.y, utility: person.utility });
      }
      if (!copied.some(person => person.kind === "job")) throw new RangeError("Ordinary fixtures require at least one job.");
      for (const person of residents()) person.delete();
      for (const person of copied) createResident(person.kind, person.x, person.y, person.utility);
      // Target fixture explicitly refreshes the source's topology cache.
      refreshJobDistances(0.01); updateView(); record();
    },
    setLand(values: readonly EconomicLandInput[]) {
      if (!Array.isArray(values) || Object.getPrototypeOf(values) !== Array.prototype || Reflect.ownKeys(values).some(key => key !== "length" && (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= values.length)) || values.length !== fields.length) throw new RangeError("Supply one price/quality record per field.");
      const copied: EconomicLandInput[] = [];
      for (let i = 0; i < values.length; i++) {
        const entry = Object.getOwnPropertyDescriptor(values, String(i));
        const value: unknown = entry && "value" in entry ? entry.value : undefined;
        if (typeof value !== "object" || value === null || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) || Reflect.ownKeys(value).length !== 2 || Reflect.ownKeys(value).some(key => typeof key !== "string" || !["price", "quality"].includes(key) || !("value" in Object.getOwnPropertyDescriptor(value, key)!))) throw new TypeError("Supply price/quality field data.");
        const land = value as EconomicLandInput;
        if (![land.price, land.quality].every(value => Number.isFinite(value) && value >= 1 && value <= 100)) throw new RangeError("Land values must be finite in [1,100].");
        copied.push({ price: land.price, quality: land.quality });
      }
      for (let i = 0; i < fields.length; i++) { fields[i]!.price = copied[i]!.price; fields[i]!.quality = copied[i]!.quality; }
      updateView(); record();
    },
    read() {
      const measured = measurements();
      return Object.freeze({ tick: world.tick.value, width, height, parameters: settings, counter, viewMode,
        agents: Object.freeze(residents().map(person => Object.freeze({ id: person.id, kind: person.kind, x: person.x, y: person.y, utility: person.utility }))),
        cells: Object.freeze(fields.map(field => Object.freeze({ id: field.id, x: field.x, y: field.y, price: field.price, quality: field.quality, sdDistance: field.sdDistance, poorUtility: poorUtility(field), richUtility: richUtility(field), colorNumber: field.colorNumber }))),
        counts: Object.freeze(measured.counts), medianTravelDistance: Object.freeze(measured.medianTravelDistance), utilityRanges,
        history: Object.freeze([...history]), randomState: random.state, done: false as const });
    },
  };
}
export const model = { title: "Rich and Poor Residential Choice", description: "Rich and poor residents choose where to live, changing land prices and nearby services. Adapted from Felsen and Wilensky (2007), CC BY-NC-SA 3.0.", inputs, create } satisfies Definition<EconomicParameters, ReturnType<typeof create>>;
