import type { ReplicationSummary, StudyOutcome, StudyResult, StudyStatus } from "./types.ts";
import { cloneData, requireCallback, requireSynchronous } from "./validation.ts";

/**
 * Summarizes replications per scenario, in first-appearance order.
 * `select` receives a detached copy of each completed or stopped outcome and returns a
 * finite number or undefined; failed and skipped runs count as missing.
 * `mean` is null without values; `sampleStandardDeviation` uses n - 1 and is null below two values.
 */
export function summarize<Parameters, Measurements>(
  result: StudyResult<Parameters, Measurements>,
  select: (outcome: StudyOutcome<Parameters, Measurements>) => number | undefined,
): readonly ReplicationSummary[] {
  requireCallback(select, "Summary selector");
  const scenarios = new Map<string, StudyOutcome<Parameters, Measurements>[]>();
  for (const outcome of result.outcomes) {
    const group = scenarios.get(outcome.run.scenarioId) ?? [];
    group.push(outcome);
    scenarios.set(outcome.run.scenarioId, group);
  }
  return Object.freeze([...scenarios].map(([scenarioId, outcomes]) => {
    const values = outcomes.map(outcome => {
      const selected = selectValue(outcome, select);
      return Object.freeze({ runId: outcome.run.id, seed: outcome.run.seed, status: outcome.status, value: selected ?? null });
    });
    const observed = values.flatMap(entry => entry.value === null ? [] : [entry.value]);
    const mean = replicationMean(observed);
    const sampleStandardDeviation = computeSampleStandardDeviation(observed, mean);
    if ((mean !== null && !Number.isFinite(mean)) || (sampleStandardDeviation !== null && !Number.isFinite(sampleStandardDeviation))) {
      throw new RangeError("Replication summary overflowed.");
    }
    const countStatus = (status: StudyStatus) => outcomes.filter(outcome => outcome.status === status).length;
    return Object.freeze({
      scenarioId,
      // Every group holds at least the outcome that created it.
      scenarioIndex: outcomes[0]!.run.scenarioIndex,
      requestedRunCount: outcomes.length,
      completedRunCount: countStatus("completed"),
      stoppedRunCount: countStatus("stopped"),
      failedRunCount: countStatus("failed"),
      skippedRunCount: countStatus("skipped"),
      validRunCount: observed.length,
      missingRunCount: outcomes.length - observed.length,
      mean,
      sampleStandardDeviation,
      values: Object.freeze(values),
    });
  }));
}

function selectValue<Parameters, Measurements>(
  outcome: StudyOutcome<Parameters, Measurements>,
  select: (outcome: StudyOutcome<Parameters, Measurements>) => number | undefined,
): number | undefined {
  if (outcome.status !== "completed" && outcome.status !== "stopped") return undefined;
  const selected = requireSynchronous(select(cloneData(outcome)));
  if (selected !== undefined && typeof selected !== "number") {
    throw new TypeError("Summary selections must be numeric or undefined.");
  }
  if (selected !== undefined && !Number.isFinite(selected)) throw new RangeError("Summary selections must be finite.");
  return selected;
}

/** Each term is divided before summing so large finite values do not overflow the total. */
function replicationMean(observed: readonly number[]): number | null {
  if (!observed.length) return null;
  return observed.reduce((total, value) => total + value / observed.length, 0);
}

function computeSampleStandardDeviation(observed: readonly number[], mean: number | null): number | null {
  if (observed.length < 2 || mean === null) return null;
  const variance = observed.reduce((total, value) => total + (value - mean) ** 2 / (observed.length - 1), 0);
  return Math.sqrt(variance);
}
