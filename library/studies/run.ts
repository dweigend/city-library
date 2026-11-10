import { run as runWorld } from "../world/index.ts";
import { worldClock } from "../world/world.ts";
import type {
  StudyModel,
  StudyOptions,
  PlannedRun,
  StudyError,
  StudyOutcome,
  StudyPhase,
  StudyResult,
  StudySample,
  StudyTerminal,
} from "./types.ts";
import { replicate } from "./design.ts";
import {
  cloneData,
  requireCallback,
  requireInteger,
  requireStudyName,
  requireSynchronous,
  studyLimits,
  validateOptions,
} from "./validation.ts";

type SkipReason = "fail-fast" | "before-error";

const runOptionKeys = [
  "parameters", "seeds", "plan", "create", "stepCount", "measure", "sampleIntervalSteps", "sampleInitial", "sampleFinal",
  "sampleWhen", "stopWhen", "onError", "before", "after", "provenance", "maxTotalStepCount", "maxTotalSampleCount", "host",
];

function errorDetails(error: unknown): { name: string; message: string } {
  if (error instanceof Error) return { name: error.name, message: error.message };
  return { name: "Error", message: String(error) };
}

function skippedOutcome<Parameters, Measurements>(
  identity: PlannedRun<Parameters>,
  reason: SkipReason,
): StudyOutcome<Parameters, Measurements> {
  return Object.freeze({ status: "skipped", reason, run: identity, completedStepCount: 0, samples: Object.freeze([]) });
}

/**
 * Runs each planned simulation serially and returns a frozen, versioned study result.
 * Runs come from `parameters` × `seeds` or from an explicit `plan`. Each run creates a
 * model, samples it, then advances its World one tick per completed step until the
 * horizon, a stop condition or a host stop. Budgets are checked before any model exists.
 * A failed run skips the remaining runs unless `onError` is "continue".
 * Errors from `before`/`after` are reported as `studyError` instead of thrown.
 */
export function run<Parameters, Model extends StudyModel, Measurements>(
  options: StudyOptions<Parameters, Model, Measurements>,
): StudyResult<Parameters, Measurements> {
  validateOptions(options, runOptionKeys);
  requireCallback(options.create, "create");
  requireCallback(options.measure, "measure");
  for (const key of ["sampleWhen", "stopWhen", "before", "after"] as const) {
    if (options[key] !== undefined) requireCallback(options[key], key);
  }
  if (options.host !== undefined) {
    validateOptions(options.host, ["advance"]);
    requireCallback(options.host.advance, "host.advance");
  }
  const stepCount = requireInteger(options.stepCount, "Steps", studyLimits.stepCount);
  const sampleIntervalSteps = requireInteger(options.sampleIntervalSteps ?? 1, "Sampling interval", Number.MAX_SAFE_INTEGER, 1);
  for (const key of ["sampleInitial", "sampleFinal"] as const) {
    if (options[key] !== undefined && typeof options[key] !== "boolean") throw new TypeError(`${key} must be boolean.`);
  }
  if (options.onError !== undefined && options.onError !== "stop" && options.onError !== "continue") {
    throw new TypeError("Unknown onError policy.");
  }
  const plan = copyPlan(options);
  requireExecutionBudget(options, plan.length, stepCount, sampleIntervalSteps);
  const provenance = readProvenance(options.provenance);

  if (options.before) {
    try {
      requireSynchronous(options.before(cloneData(plan)));
    } catch (error) {
      const outcomes = plan.map(identity => skippedOutcome<Parameters, Measurements>(identity, "before-error"));
      return Object.freeze({
        version: 1,
        provenance,
        outcomes: Object.freeze(outcomes),
        studyError: { phase: "before" as const, ...errorDetails(error) },
      });
    }
  }

  const outcomes: StudyOutcome<Parameters, Measurements>[] = [];
  let failFast = false;
  for (const identity of plan) {
    if (failFast) {
      outcomes.push(skippedOutcome(identity, "fail-fast"));
      continue;
    }
    const outcome = execute(identity, options, sampleIntervalSteps);
    outcomes.push(outcome);
    failFast = outcome.status === "failed" && options.onError !== "continue";
  }
  const result: StudyResult<Parameters, Measurements> = Object.freeze({
    version: 1,
    provenance,
    outcomes: Object.freeze(outcomes),
  });

  if (options.after) {
    try {
      requireSynchronous(options.after(cloneData(result)));
    } catch (error) {
      return Object.freeze({ ...result, studyError: { phase: "after" as const, ...errorDetails(error) } });
    }
  }
  return result;
}

function copyPlan<Parameters>(
  options: Pick<StudyOptions<Parameters, StudyModel, unknown>, "parameters" | "seeds" | "plan">,
): readonly PlannedRun<Parameters>[] {
  if (options.plan === undefined) {
    if (!Array.isArray(options.parameters)) throw new TypeError("Study parameters must be an array.");
    const scenarios = options.parameters.map((parameters, index) => ({ id: `scenario-${index}`, index, parameters }));
    // StudyPlan pairs parameters with seeds; replicate validates the runtime value.
    return replicate(scenarios, options.seeds!);
  }
  if (options.parameters !== undefined || options.seeds !== undefined || !Array.isArray(options.plan)) {
    throw new TypeError("Provide either plan or parameters/seeds.");
  }
  if (options.plan.length > studyLimits.runCount) throw new RangeError("Run budget exceeded.");

  const ids = new Set<string>();
  const positions = new Set<string>();
  const scenarios = new Map<string, { index: number; seeds: Set<number> }>();
  const scenarioIds = new Map<number, string>();
  return Object.freeze(options.plan.map(run => {
    validateOptions(run, ["id", "scenarioId", "scenarioIndex", "replicationIndex", "seed", "parameters"]);
    requireStudyName(run.id);
    requireStudyName(run.scenarioId);
    requireInteger(run.scenarioIndex, "Scenario index", Number.MAX_SAFE_INTEGER);
    requireInteger(run.replicationIndex, "Replication index", Number.MAX_SAFE_INTEGER);
    requireInteger(run.seed, "Seed", Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

    const position = `${run.scenarioIndex}:${run.replicationIndex}`;
    const scenario = scenarios.get(run.scenarioId);
    const conflictsWithScenario =
      scenario !== undefined && (scenario.index !== run.scenarioIndex || scenario.seeds.has(run.seed));
    const conflictsWithIndex =
      scenarioIds.has(run.scenarioIndex) && scenarioIds.get(run.scenarioIndex) !== run.scenarioId;
    if (ids.has(run.id) || positions.has(position) || conflictsWithScenario || conflictsWithIndex) {
      throw new TypeError("Study run identities must be unique and consistent.");
    }

    ids.add(run.id);
    positions.add(position);
    scenarioIds.set(run.scenarioIndex, run.scenarioId);
    const entry = scenario ?? { index: run.scenarioIndex, seeds: new Set<number>() };
    entry.seeds.add(run.seed);
    scenarios.set(run.scenarioId, entry);
    return Object.freeze({ ...run, parameters: cloneData(run.parameters) });
  }));
}

function requireExecutionBudget(
  options: Pick<StudyOptions<unknown, StudyModel, unknown>, "maxTotalStepCount" | "maxTotalSampleCount" | "sampleInitial" | "sampleFinal">,
  runCount: number,
  stepCount: number,
  sampleIntervalSteps: number,
): void {
  const maxStepCount = requireInteger(options.maxTotalStepCount ?? studyLimits.totalStepCount, "Total step budget", studyLimits.totalStepCount);
  const maxSampleCount = requireInteger(
    options.maxTotalSampleCount ?? studyLimits.totalSampleCount,
    "Total sample budget",
    studyLimits.totalSampleCount,
  );
  // Early stopping may add one final sample, but each completed boundary is sampled at most once.
  const initialSampleCount = options.sampleInitial !== false ? 1 : 0;
  const finalSampleCount = options.sampleFinal !== false ? 1 : 0;
  const sampleCountPerRun = Math.min(stepCount + 1, Math.floor(stepCount / sampleIntervalSteps) + initialSampleCount + finalSampleCount);
  if (runCount * stepCount > maxStepCount || runCount * sampleCountPerRun > maxSampleCount) {
    throw new RangeError("Study execution budget exceeded before model creation.");
  }
}

function readProvenance(supplied: Readonly<Record<string, string>> | undefined): Readonly<Record<string, string>> {
  const provenanceData = validateOptions(supplied ?? {}, Object.keys(supplied ?? {}));
  if (Object.values(provenanceData).some(value => typeof value !== "string")) {
    throw new TypeError("Provenance must contain strings.");
  }
  return Object.freeze({ ...provenanceData }) as Readonly<Record<string, string>>;
}

function requireBooleanResult(value: unknown): boolean {
  requireSynchronous(value);
  if (typeof value !== "boolean") throw new TypeError("Study predicates must return booleans.");
  return value;
}

/**
 * Executes one planned run. `phase` names the callback in progress so a failure
 * reports where it happened; dispose always runs once a model was created.
 */
function execute<Parameters, Model extends StudyModel, Measurements>(
  identity: PlannedRun<Parameters>,
  options: StudyOptions<Parameters, Model, Measurements>,
  sampleIntervalSteps: number,
): StudyOutcome<Parameters, Measurements> {
  let phase: StudyPhase = "create";
  let model: Model | undefined;
  let created = false;
  let completedStepCount = 0;
  const samples: StudySample<Measurements>[] = [];
  let terminal: StudyTerminal = { status: "completed", reason: "horizon" };
  // Thrown out of the World step callback so a host stop ends the run without counting as a failure.
  const adapterStopped = Symbol("adapter-stopped");

  // The model helpers below run only after create has returned a model.
  function measure(): void {
    phase = "measure";
    const measurement = cloneData(requireSynchronous(options.measure(model!)));
    samples.push(Object.freeze({ step: completedStepCount, measurement }));
  }
  function sampleIfSelected(): void {
    phase = "sample";
    if (options.sampleWhen && !requireBooleanResult(options.sampleWhen(model!, completedStepCount))) return;
    measure();
  }
  function isStopConditionMet(): boolean {
    phase = "stop";
    return options.stopWhen ? requireBooleanResult(options.stopWhen(model!, completedStepCount)) : false;
  }
  function advanceModel(): void {
    if (!options.host) return requireSynchronous(model!.step());
    const result = requireSynchronous(options.host.advance(model!));
    if (result === "stopped") throw adapterStopped;
    if (result !== undefined) throw new TypeError("host.advance must return void or stopped.");
  }

  try {
    model = requireSynchronous(options.create(cloneData(identity.parameters), identity.seed, cloneData(identity)));
    created = true;
    if (model === null || typeof model !== "object") throw new TypeError("create must return a StudyModel.");
    worldClock(model.world);
    requireCallback(model.step, "Model step");
    if (model.dispose !== undefined) requireCallback(model.dispose, "Model dispose");

    if (options.sampleInitial !== false) sampleIfSelected();
    if (isStopConditionMet()) terminal = { status: "stopped", reason: "stop-condition" };
    while (completedStepCount < options.stepCount && terminal.status === "completed") {
      phase = "step";
      runWorld(model.world, advanceModel);
      completedStepCount += 1;
      if (completedStepCount % sampleIntervalSteps === 0) sampleIfSelected();
      if (isStopConditionMet()) terminal = { status: "stopped", reason: "stop-condition" };
    }
    // The final boundary is measured regardless of sampleWhen unless it was already sampled.
    if (options.sampleFinal !== false && samples.at(-1)?.step !== completedStepCount) {
      phase = "sample";
      measure();
    }
  } catch (error) {
    terminal = error === adapterStopped
      ? { status: "stopped", reason: "adapter-stopped" }
      : { status: "failed", reason: "error", error: { phase, ...errorDetails(error) } };
  } finally {
    if (created && model?.dispose !== undefined) {
      try {
        requireCallback(model.dispose, "Model dispose");
        requireSynchronous(model.dispose());
      } catch (error) {
        const cleanupError: StudyError = { phase: "dispose", ...errorDetails(error) };
        terminal = terminal.status === "failed"
          ? { ...terminal, cleanupError }
          : { status: "failed", reason: "error", error: cleanupError };
      }
    }
  }
  return Object.freeze({ ...terminal, run: identity, completedStepCount, samples: Object.freeze(samples) });
}
