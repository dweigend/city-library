import type { PlannedRun, StudyAxis, StudyAxisFor, StudyParameters, StudyParameterValues, StudyScenario } from "./types.ts";
import { cloneData, integer, name, parameterRecord, scalar, seeds as validateSeeds, studyLimits, validateOptions } from "./validation.ts";

export function design<Parameters extends StudyParameters>(input: {
  defaults: Parameters; axes: readonly StudyAxisFor<Parameters>[]; maxScenarios?: number;
}): readonly StudyScenario<StudyParameterValues<Parameters>>[];
export function design(input: { constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarios?: number }): readonly StudyScenario[];
export function design(input: { defaults?: StudyParameters; constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarios?: number }): readonly StudyScenario[] {
  validateOptions(input, ["constants", "defaults", "axes", "maxScenarios"]);
  if (input.defaults !== undefined && input.constants !== undefined) throw new TypeError("defaults and constants are exclusive.");
  const settings = parameterRecord(input.defaults ?? input.constants ?? {});
  if (!Array.isArray(input.axes)) throw new TypeError("Study axes must be an array.");
  if (input.axes.length > studyLimits.axes) throw new RangeError("Too many study axes.");
  const maximum = integer(input.maxScenarios ?? studyLimits.scenarios, "Scenario budget", studyLimits.scenarios);
  const axisNames = new Set<string>();
  const axes = input.axes.map(axis => {
    validateOptions(axis, ["name", "values"]);
    name(axis.name);
    if (axisNames.has(axis.name)) throw new TypeError("Study axis names must be unique.");
    axisNames.add(axis.name);
    if (!Array.isArray(axis.values)) throw new TypeError("Axis values must be an array.");
    const values = axis.values.map((value: unknown) => {
      if (!scalar(value)) throw new TypeError("Axis values must be scalar.");
      if (input.defaults !== undefined) {
        if (!Object.hasOwn(settings, axis.name) || typeof value !== typeof settings[axis.name])
          throw new TypeError("An axis must retain its default setting's key and scalar kind.");
      } else if (Object.hasOwn(settings, axis.name)) throw new TypeError("Constants and axes cannot overlap.");
      return value;
    });
    return { name: axis.name, values };
  });
  if (new Set([...Object.keys(settings), ...axisNames]).size > studyLimits.parameters)
    throw new RangeError("Too many study parameters.");
  let count = axes.some(axis => axis.values.length === 0) ? 0 : 1;
  if (count) for (const axis of axes) {
    count *= axis.values.length;
    if (!Number.isSafeInteger(count) || count > maximum) throw new RangeError("Scenario budget exceeded.");
  }
  if (count > maximum) throw new RangeError("Scenario budget exceeded.");
  let combinations: StudyParameters[] = count ? [settings] : [];
  for (const axis of axes) combinations = combinations.flatMap(parameters =>
    axis.values.map((value: number | boolean | string) => Object.freeze({ ...parameters, [axis.name]: value })));
  return Object.freeze(combinations.map((parameters, index) => Object.freeze({ id: `scenario-${index}`, index, parameters })));
}

export function replicate<Parameters>(scenarios: readonly StudyScenario<Parameters>[], seeds: readonly number[], options: { maxRuns?: number } = {}): readonly PlannedRun<Parameters>[] {
  validateOptions(options, ["maxRuns"]);
  const maximum = integer(options.maxRuns ?? studyLimits.runs, "Run budget", studyLimits.runs);
  if (!Array.isArray(scenarios)) throw new TypeError("Scenarios must be an array.");
  const seedValues = validateSeeds(seeds);
  if (scenarios.length > studyLimits.scenarios || scenarios.length * seedValues.length > maximum)
    throw new RangeError("Study planning budget exceeded.");
  const identities = new Set<string>();
  const indices = new Set<number>();
  const copies = scenarios.map(scenario => {
    validateOptions(scenario, ["id", "index", "parameters"]);
    name(scenario.id);
    integer(scenario.index, "Scenario index", Number.MAX_SAFE_INTEGER);
    if (identities.has(scenario.id) || indices.has(scenario.index)) throw new TypeError("Scenario identities must be unique.");
    identities.add(scenario.id); indices.add(scenario.index);
    return { ...scenario, parameters: cloneData(scenario.parameters) };
  });
  return Object.freeze(copies.flatMap(scenario => seedValues.map((seed, replicationIndex) => Object.freeze({
    id: `run-${scenario.index}-${replicationIndex}`, scenarioId: scenario.id,
    scenarioIndex: scenario.index, replicationIndex, seed, parameters: cloneData(scenario.parameters),
  }))));
}
