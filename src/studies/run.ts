import { run as runWorld } from "../world/index.ts";
import { worldClock } from "../world/world.ts";
import type { StudyModel, StudyOptions, PlannedRun, StudyError, StudyOutcome, StudyPhase, StudyResult, StudySample, StudyTerminal } from "./types.ts";
import { replicate } from "./design.ts";
import { callback, cloneData, integer, name, studyLimits, synchronous, validateOptions } from "./validation.ts";

function errorDetails(error: unknown): { name: string; message: string } {
  return error instanceof Error ? { name: error.name, message: error.message } : { name: "Error", message: String(error) };
}
function copyPlan<Parameters>(options: Pick<StudyOptions<Parameters, StudyModel, unknown>, "parameters" | "seeds" | "plan">): readonly PlannedRun<Parameters>[] {
  if (options.plan === undefined) {
    if (!Array.isArray(options.parameters)) throw new TypeError("Study parameters must be an array.");
    return replicate(options.parameters.map((parameters, index) => ({ id: `scenario-${index}`, index, parameters })), options.seeds!);
  }
  if (options.parameters !== undefined || options.seeds !== undefined || !Array.isArray(options.plan))
    throw new TypeError("Provide either plan or parameters/seeds.");
  if (options.plan.length > studyLimits.runs) throw new RangeError("Run budget exceeded.");
  const ids = new Set<string>();
  const positions = new Set<string>();
  const scenarios = new Map<string, { index: number; seeds: Set<number> }>();
  const indices = new Map<number, string>();
  return Object.freeze(options.plan.map(run => {
    validateOptions(run, ["id", "scenarioId", "scenarioIndex", "replicationIndex", "seed", "parameters"]);
    name(run.id); name(run.scenarioId);
    integer(run.scenarioIndex, "Scenario index", Number.MAX_SAFE_INTEGER);
    integer(run.replicationIndex, "Replication index", Number.MAX_SAFE_INTEGER);
    integer(run.seed, "Seed", Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);
    const position = `${run.scenarioIndex}:${run.replicationIndex}`;
    const scenario = scenarios.get(run.scenarioId);
    if (ids.has(run.id) || positions.has(position) || (scenario && (scenario.index !== run.scenarioIndex || scenario.seeds.has(run.seed))) ||
      (indices.has(run.scenarioIndex) && indices.get(run.scenarioIndex) !== run.scenarioId))
      throw new TypeError("Study run identities must be unique and consistent.");
    ids.add(run.id); positions.add(position); indices.set(run.scenarioIndex, run.scenarioId);
    const entry = scenario ?? { index: run.scenarioIndex, seeds: new Set<number>() };
    entry.seeds.add(run.seed); scenarios.set(run.scenarioId, entry);
    return Object.freeze({ ...run, parameters: cloneData(run.parameters) });
  }));
}
function booleanResult(value: unknown): boolean {
  synchronous(value);
  if (typeof value !== "boolean") throw new TypeError("Study predicates must return booleans.");
  return value;
}

function execute<Parameters, Model extends StudyModel, Measurements>(
  identity: PlannedRun<Parameters>, options: StudyOptions<Parameters, Model, Measurements>, every: number,
): StudyOutcome<Parameters, Measurements> {
  let phase: StudyPhase = "create";
  let model: Model | undefined;
  let created = false;
  let completedSteps = 0;
  const samples: StudySample<Measurements>[] = [];
  let terminal: StudyTerminal = { status: "completed", reason: "horizon" };
  const adapterStopped = Symbol("adapter-stopped");
  function observe(force = false): void {
    phase = "sample";
    if (!force && options.sampleWhen && !booleanResult(options.sampleWhen(model!, completedSteps))) return;
    phase = "measure";
    const measurement = cloneData(synchronous(options.measure(model!)));
    samples.push(Object.freeze({ step: completedSteps, measurement }));
  }
  function stopped(): boolean {
    phase = "stop";
    return options.stopWhen ? booleanResult(options.stopWhen(model!, completedSteps)) : false;
  }
  try {
    model = synchronous(options.create(cloneData(identity.parameters), identity.seed, cloneData(identity)));
    created = true;
    if (model === null || typeof model !== "object") throw new TypeError("create must return a StudyModel.");
    worldClock(model.world);
    callback(model.step, "Model step");
    if (model.dispose !== undefined) callback(model.dispose, "Model dispose");
    if (options.sampleInitial !== false) observe();
    if (stopped()) terminal = { status: "stopped", reason: "stop-condition" };
    while (completedSteps < options.steps && terminal.status === "completed") {
      phase = "step";
      runWorld(model.world, () => {
        if (!options.host) return synchronous(model!.step());
        const result = synchronous(options.host.advance(model!));
        if (result === "stopped") throw adapterStopped;
        if (result !== undefined) throw new TypeError("host.advance must return void or stopped.");
      });
      completedSteps += 1;
      if (completedSteps % every === 0) observe();
      if (stopped()) terminal = { status: "stopped", reason: "stop-condition" };
    }
    if (options.sampleFinal !== false && samples.at(-1)?.step !== completedSteps) observe(true);
  } catch (error) {
    terminal = error === adapterStopped
      ? { status: "stopped", reason: "adapter-stopped" }
      : { status: "failed", reason: "error", error: { phase, ...errorDetails(error) } };
  } finally {
    if (created && model?.dispose !== undefined) {
      try { callback(model.dispose, "Model dispose"); synchronous(model.dispose()); }
      catch (error) {
        const cleanupError: StudyError = { phase: "dispose", ...errorDetails(error) };
        terminal = terminal.status === "failed" ? { ...terminal, cleanupError }
          : { status: "failed", reason: "error", error: cleanupError };
      }
    }
  }
  return Object.freeze({ ...terminal, run: identity, completedSteps, samples: Object.freeze(samples) });
}

export function run<Parameters, Model extends StudyModel, Measurements>(options: StudyOptions<Parameters, Model, Measurements>): StudyResult<Parameters, Measurements> {
  validateOptions(options, ["parameters", "seeds", "plan", "create", "steps", "measure", "every", "sampleInitial", "sampleFinal", "sampleWhen", "stopWhen", "onError", "before", "after", "provenance", "maxTotalSteps", "maxTotalSamples", "host"]);
  callback(options.create, "create"); callback(options.measure, "measure");
  for (const key of ["sampleWhen", "stopWhen", "before", "after"] as const)
    if (options[key] !== undefined) callback(options[key], key);
  if (options.host !== undefined) {
    validateOptions(options.host, ["advance"]); callback(options.host.advance, "host.advance");
  }
  const steps = integer(options.steps, "Steps", studyLimits.steps);
  const every = integer(options.every ?? 1, "Sampling interval", Number.MAX_SAFE_INTEGER, 1);
  for (const key of ["sampleInitial", "sampleFinal"] as const)
    if (options[key] !== undefined && typeof options[key] !== "boolean") throw new TypeError(`${key} must be boolean.`);
  if (options.onError !== undefined && options.onError !== "stop" && options.onError !== "continue") throw new TypeError("Unknown onError policy.");
  const plan = copyPlan(options);
  const maxSteps = integer(options.maxTotalSteps ?? studyLimits.totalSteps, "Total step budget", studyLimits.totalSteps);
  const maxSamples = integer(options.maxTotalSamples ?? studyLimits.totalSamples, "Total sample budget", studyLimits.totalSamples);
  // Early stopping may add one final sample, but each completed boundary is sampled at most once.
  const perRunSamples = Math.min(steps + 1,
    Math.floor(steps / every) + (options.sampleInitial !== false ? 1 : 0) + (options.sampleFinal !== false ? 1 : 0));
  if (plan.length * steps > maxSteps || plan.length * perRunSamples > maxSamples)
    throw new RangeError("Study execution budget exceeded before model creation.");
  const provenanceData = validateOptions(options.provenance ?? {}, Object.keys(options.provenance ?? {}));
  if (Object.values(provenanceData).some(value => typeof value !== "string")) throw new TypeError("Provenance must contain strings.");
  const provenance = Object.freeze({ ...provenanceData }) as Readonly<Record<string, string>>;
  const outcomes: StudyOutcome<Parameters, Measurements>[] = [];
  if (options.before) {
    try { synchronous(options.before(cloneData(plan))); }
    catch (error) {
      return Object.freeze({ version: 1, provenance, outcomes: Object.freeze(plan.map(identity => Object.freeze({
        status: "skipped" as const, reason: "before-error" as const, run: identity, completedSteps: 0, samples: Object.freeze([]),
      }))), studyError: { phase: "before" as const, ...errorDetails(error) } });
    }
  }
  let failFast = false;
  for (const identity of plan) {
    if (failFast) outcomes.push(Object.freeze({ status: "skipped", reason: "fail-fast", run: identity, completedSteps: 0, samples: Object.freeze([]) }));
    else {
      const outcome = execute(identity, options, every);
      outcomes.push(outcome);
      failFast = outcome.status === "failed" && options.onError !== "continue";
    }
  }
  const result: StudyResult<Parameters, Measurements> = Object.freeze({ version: 1, provenance, outcomes: Object.freeze(outcomes) });
  if (options.after) {
    try { synchronous(options.after(cloneData(result))); }
    catch (error) { return Object.freeze({ ...result, studyError: { phase: "after" as const, ...errorDetails(error) } }); }
  }
  return result;
}
