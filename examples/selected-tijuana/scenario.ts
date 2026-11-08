/** Author-only construction helpers for COMPLETE public scenario input.
 * These explicit defaults are expanded here, never supplied by the runtime.
 * No helper accesses a World, live Agent/Field, or private model operation.
 */
import type { create, TijuanaAgentInput, TijuanaFieldInput, TijuanaGlobals, TijuanaRules, TijuanaScenario } from "../../experiments/urban-suite-tijuana-bordertowns/model.ts";
export type Model = ReturnType<typeof create>;
export type MigrantInput = Extract<TijuanaAgentInput, { kind: "migrant" }>;
export type BuilderInput = Extract<TijuanaAgentInput, { kind: "third-builder" }>;

export function field(overrides: Partial<TijuanaFieldInput> = {}): TijuanaFieldInput {
  return { landValue: 0, water: 10, electricity: 1, transport: 1.5,
    occupied: "no", ctr: 0, elevation: 9.9, colonia: 0, colorNumber: 9.9, ...overrides };
}
function agent(key: string, birthOrdinal: number, x: number, y: number) {
  return { key, birthOrdinal, x, y, heading: 0, size: 1, colorNumber: 0,
    shape: "default", label: "", hidden: false, penDown: false, penSize: 1 };
}
export function service(key = "service", birthOrdinal = 0, x = 0, y = 0): TijuanaAgentInput {
  return { ...agent(key, birthOrdinal, x, y), kind: "service-center", shape: "eyeball", size: 5, colorNumber: 4 };
}
export function job(key = "job", birthOrdinal = 1, x = 3, y = 4): TijuanaAgentInput {
  return { ...agent(key, birthOrdinal, x, y), kind: "employment-center", shape: "factory", size: 7, colorNumber: 95 };
}
export function migrant(key = "migrant", birthOrdinal = 2, x = 6, y = 8, overrides: Partial<Omit<MigrantInput, "kind" | "key" | "birthOrdinal" | "x" | "y">> = {}): MigrantInput {
  return { ...agent(key, birthOrdinal, x, y), kind: "migrant", shape: "circle", size: 0.6, colorNumber: 135,
    income: 55, savings: 20, livingExpenses: 40, residentSince: 8,
    origin: "oaxaca", works: ["job"], ...overrides };
}
export function thirdBuilder(key = "builder", birthOrdinal = 3, x = 0, y = 0, overrides: Partial<Omit<BuilderInput, "kind" | "key" | "birthOrdinal" | "x" | "y">> = {}): BuilderInput {
  return { ...agent(key, birthOrdinal, x, y), kind: "third-builder", weight: 0.6, energy: 0,
    origin: { kind: "services", keys: ["service"] }, ...overrides };
}
export function ring(key = "ring", birthOrdinal = 4, x = 0, y = 0): TijuanaAgentInput {
  return { ...agent(key, birthOrdinal, x, y), kind: "ring", shape: "loop", colorNumber: 27 };
}
export function globals(overrides: Partial<TijuanaGlobals> = {}): TijuanaGlobals {
  return { values: 0, weights: 0, marginalValue: 0, marginalWeight: 0,
    crossed: 0, maxCost: 0, thirdPhase: "stop", setupDone: true, ...overrides };
}
export function scene(model: Model, options: {
  readonly tick?: number; readonly agents?: readonly TijuanaAgentInput[];
  readonly globals?: TijuanaGlobals; readonly rules?: Partial<TijuanaRules>;
  readonly field?: (x: number, y: number, index: number) => TijuanaFieldInput;
  readonly mode?: "ordinary" | "diagnostic";
} = {}): TijuanaScenario {
  const current = model.read();
  const { seed: _seed, ...rules } = current.parameters;
  const agents = options.agents ?? [service(), job(), migrant()];
  return {
    mode: options.mode ?? "diagnostic", tick: options.tick ?? 0,
    parameters: { ...rules, ...options.rules }, globals: options.globals ?? globals(),
    nextBirthOrdinal: agents.reduce((largest, agent) => Math.max(largest, agent.birthOrdinal + 1), 0),
    cells: current.cells.map((cell, index) => options.field?.(cell.x, cell.y, index) ?? field()),
    agents: [...agents], randomState: current.randomState,
  };
}
export function cell(model: Model, x: number, y: number) {
  return model.read().cells.find(item => item.x === x && item.y === y)!;
}
export function near(actual: number, expected: number, tolerance = 1e-10) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance)
    throw new Error(`Expected ${actual} within ${tolerance} of ${expected}`);
}
/** Normalize opaque identities only; keep every scientific value and RNG bit. */
export function semantic(model: Model): unknown {
  const state = model.read();
  const identities = new Map<string, string>([
    ...state.cells.map((item, index) => [item.id, `field:${index}`] as [string, string]),
    ...state.agents.map(item => [item.id, `agent:${item.birthOrdinal}`] as [string, string]),
  ]);
  return JSON.parse(JSON.stringify(state, (_key, value: unknown) => {
    // A canonical workplace can have died while a migrant still references it.
    // Its detached reference keeps its scientific birth ordinal, so replay does
    // not rely on a registry of dead Agents or an opaque ID surviving deletion.
    if (typeof value === "object" && value !== null && "id" in value && "birthOrdinal" in value) {
      const reference = value as { id: string; birthOrdinal: number };
      return { ...value, id: `agent:${reference.birthOrdinal}` };
    }
    return typeof value === "string" ? (identities.get(value) ?? value) : value;
  }));
}
