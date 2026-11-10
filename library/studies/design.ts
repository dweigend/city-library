import type { PlannedRun, StudyAxis, StudyAxisFor, StudyParameters, StudyParameterValues, StudyScalar, StudyScenario } from "./types.ts";
import {
  cloneData,
  isStudyScalar,
  readParameterRecord,
  readSeeds,
  requireInteger,
  requireStudyName,
  studyLimits,
  validateOptions,
} from "./validation.ts";

interface CheckedAxis {
  readonly name: string;
  readonly values: readonly StudyScalar[];
}

/**
 * Expands axes into a frozen Cartesian scenario list; the last axis varies fastest.
 * With `defaults`, every axis must name a default setting and keep its scalar kind.
 * With `constants`, axes must not reuse a constant's name.
 * Empty axes currently bypass these key checks and produce no scenarios.
 * Scenario ids and indices follow expansion order. `maxScenarioCount` defaults to the study limit.
 */
export function design<Parameters extends StudyParameters>(input: {
  defaults: Parameters; axes: readonly StudyAxisFor<Parameters>[]; maxScenarioCount?: number;
}): readonly StudyScenario<StudyParameterValues<Parameters>>[];
export function design(input: { constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarioCount?: number }): readonly StudyScenario[];
export function design(input: {
  defaults?: StudyParameters; constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarioCount?: number;
}): readonly StudyScenario[] {
  validateOptions(input, ["constants", "defaults", "axes", "maxScenarioCount"]);
  if (input.defaults !== undefined && input.constants !== undefined) {
    throw new TypeError("defaults and constants are exclusive.");
  }
  const settings = readParameterRecord(input.defaults ?? input.constants ?? {});
  if (!Array.isArray(input.axes)) throw new TypeError("Study axes must be an array.");
  if (input.axes.length > studyLimits.axisCount) throw new RangeError("Too many study axes.");
  const maximum = requireInteger(input.maxScenarioCount ?? studyLimits.scenarioCount, "Scenario budget", studyLimits.scenarioCount);
  const usesDefaults = input.defaults !== undefined;

  const axisNames = new Set<string>();
  const axes = input.axes.map((axis): CheckedAxis => {
    validateOptions(axis, ["name", "values"]);
    requireStudyName(axis.name);
    if (axisNames.has(axis.name)) throw new TypeError("Study axis names must be unique.");
    axisNames.add(axis.name);
    if (!Array.isArray(axis.values)) throw new TypeError("Axis values must be an array.");
    const values = axis.values.map((value: unknown) => checkAxisValue(value, axis.name, settings, usesDefaults));
    return { name: axis.name, values };
  });
  if (new Set([...Object.keys(settings), ...axisNames]).size > studyLimits.parameterCount) {
    throw new RangeError("Too many study parameters.");
  }

  const count = countScenarios(axes, maximum);
  let combinations: StudyParameters[] = count ? [settings] : [];
  for (const axis of axes) {
    combinations = combinations.flatMap(parameters =>
      axis.values.map(value => Object.freeze({ ...parameters, [axis.name]: value })));
  }
  return Object.freeze(combinations.map((parameters, index) =>
    Object.freeze({ id: `scenario-${index}`, index, parameters })));
}

/** Checks one axis value against the scalar budget and the settings mode. */
function checkAxisValue(
  value: unknown,
  axisName: string,
  settings: StudyParameters,
  usesDefaults: boolean,
): StudyScalar {
  if (!isStudyScalar(value)) throw new TypeError("Axis values must be scalar.");
  if (usesDefaults) {
    if (!Object.hasOwn(settings, axisName) || typeof value !== typeof settings[axisName]) {
      throw new TypeError("An axis must retain its default setting's key and scalar kind.");
    }
    return value;
  }
  if (Object.hasOwn(settings, axisName)) throw new TypeError("Constants and axes cannot overlap.");
  return value;
}

/** Any empty axis yields no scenarios; otherwise the product must stay within the budget. */
function countScenarios(axes: readonly CheckedAxis[], maximum: number): number {
  if (axes.some(axis => axis.values.length === 0)) return 0;
  let count = 1;
  for (const axis of axes) {
    count *= axis.values.length;
    if (!Number.isSafeInteger(count) || count > maximum) throw new RangeError("Scenario budget exceeded.");
  }
  // Also covers zero axes, whose single scenario can exceed a zero budget.
  if (count > maximum) throw new RangeError("Scenario budget exceeded.");
  return count;
}

/**
 * Pairs every scenario with every seed in scenario-then-seed order.
 * Scenario ids and indices must be unique; parameters are cloned for each planned run.
 * `maxRunCount` bounds scenarios × seeds and defaults to the study run limit.
 */
export function replicate<Parameters>(
  scenarios: readonly StudyScenario<Parameters>[],
  seeds: readonly number[],
  options: { maxRunCount?: number } = {},
): readonly PlannedRun<Parameters>[] {
  validateOptions(options, ["maxRunCount"]);
  const maximum = requireInteger(options.maxRunCount ?? studyLimits.runCount, "Run budget", studyLimits.runCount);
  if (!Array.isArray(scenarios)) throw new TypeError("Scenarios must be an array.");
  const seedValues = readSeeds(seeds);
  if (scenarios.length > studyLimits.scenarioCount || scenarios.length * seedValues.length > maximum) {
    throw new RangeError("Study planning budget exceeded.");
  }

  const identities = new Set<string>();
  const indices = new Set<number>();
  const copies = scenarios.map(scenario => {
    validateOptions(scenario, ["id", "index", "parameters"]);
    requireStudyName(scenario.id);
    requireInteger(scenario.index, "Scenario index", Number.MAX_SAFE_INTEGER);
    if (identities.has(scenario.id) || indices.has(scenario.index)) {
      throw new TypeError("Scenario identities must be unique.");
    }
    identities.add(scenario.id);
    indices.add(scenario.index);
    return { ...scenario, parameters: cloneData(scenario.parameters) };
  });
  return Object.freeze(copies.flatMap(scenario => seedValues.map((seed, replicationIndex) => Object.freeze({
    id: `run-${scenario.index}-${replicationIndex}`,
    scenarioId: scenario.id,
    scenarioIndex: scenario.index,
    replicationIndex,
    seed,
    parameters: cloneData(scenario.parameters),
  }))));
}
