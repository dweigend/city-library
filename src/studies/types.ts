import type { World } from "../world/index.ts";

export type StudyScalar = number | boolean | string;
export type StudyParameters = Readonly<Record<string, StudyScalar>>;
export interface StudyAxis { readonly name: string; readonly values: readonly StudyScalar[] }
type Widen<Value> = Value extends number ? number : Value extends boolean ? boolean : string;
export type StudyParameterValues<Parameters extends StudyParameters> = {
  readonly [Key in keyof Parameters]: Widen<Parameters[Key]>;
};
export type StudyAxisFor<Parameters extends StudyParameters> = {
  [Key in Extract<keyof Parameters, string>]: { readonly name: Key; readonly values: readonly StudyParameterValues<Parameters>[Key][] };
}[Extract<keyof Parameters, string>];
export interface StudyScenario<Parameters = StudyParameters> {
  readonly id: string; readonly index: number; readonly parameters: Parameters;
}
export interface PlannedRun<Parameters = StudyParameters> {
  readonly id: string; readonly scenarioId: string; readonly scenarioIndex: number;
  readonly replicationIndex: number; readonly seed: number; readonly parameters: Parameters;
}
export interface StudySample<Measurements> { readonly step: number; readonly measurement: Measurements }
export type StudyPhase = "create" | "step" | "measure" | "sample" | "stop" | "dispose" | "pause" | "save" | "load";
export interface StudyError { readonly phase: StudyPhase; readonly name: string; readonly message: string }
export type StudyStatus = "completed" | "stopped" | "failed" | "skipped";
export type StudyTerminal =
  | { readonly status: "completed"; readonly reason: "horizon"; readonly error?: never; readonly cleanupError?: never }
  | { readonly status: "stopped"; readonly reason: "stop-condition" | "adapter-stopped"; readonly error?: never; readonly cleanupError?: never }
  | { readonly status: "failed"; readonly reason: "error"; readonly error: StudyError; readonly cleanupError?: StudyError }
  | { readonly status: "skipped"; readonly reason: "fail-fast" | "before-error"; readonly error?: never; readonly cleanupError?: never };
export type StudyOutcome<Parameters, Measurements> = StudyTerminal & {
  readonly run: PlannedRun<Parameters>; readonly completedSteps: number; readonly samples: readonly StudySample<Measurements>[];
};
export interface StudyResult<Parameters, Measurements> {
  readonly version: 1; readonly provenance: Readonly<Record<string, string>>;
  readonly outcomes: readonly StudyOutcome<Parameters, Measurements>[];
  readonly studyError?: { readonly phase: "before" | "after"; readonly name: string; readonly message: string };
}
export interface ReplicationSummary {
  readonly scenarioId: string; readonly scenarioIndex: number; readonly requested: number;
  readonly completed: number; readonly stopped: number; readonly failed: number; readonly skipped: number;
  readonly valid: number; readonly missing: number; readonly mean: number | null; readonly sampleSd: number | null;
  readonly values: readonly { readonly runId: string; readonly seed: number; readonly status: StudyStatus; readonly value: number | null }[];
}
export interface StudyModel { readonly world: World; step(): void; dispose?(): void }
export type StudyPlan<Parameters> =
  | { readonly parameters: readonly Parameters[]; readonly seeds: readonly number[]; readonly plan?: never }
  | { readonly plan: readonly PlannedRun<Parameters>[]; readonly parameters?: never; readonly seeds?: never };
export type StudyOptions<Parameters, Model extends StudyModel, Measurements> = StudyPlan<Parameters> & {
  create(parameters: Parameters, seed: number, run: PlannedRun<Parameters>): Model;
  readonly steps: number;
  measure(model: Model): Measurements;
  readonly every?: number; readonly sampleInitial?: boolean; readonly sampleFinal?: boolean;
  sampleWhen?(model: Model, completedSteps: number): boolean;
  stopWhen?(model: Model, completedSteps: number): boolean;
  readonly onError?: "stop" | "continue";
  before?(plan: readonly PlannedRun<Parameters>[]): void;
  after?(result: StudyResult<Parameters, Measurements>): void;
  readonly provenance?: Readonly<Record<string, string>>;
  readonly maxTotalSteps?: number; readonly maxTotalSamples?: number;
  readonly host?: { advance(model: Model): void | "stopped" };
};
