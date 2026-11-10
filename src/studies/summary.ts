import type { ReplicationSummary, StudyOutcome, StudyResult } from "./types.ts";
import { callback, cloneData, synchronous } from "./validation.ts";

export function summarize<Parameters, Measurements>(result: StudyResult<Parameters, Measurements>, select: (outcome: StudyOutcome<Parameters, Measurements>) => number | undefined): readonly ReplicationSummary[] {
  callback(select, "Summary selector");
  const scenarios = new Map<string, StudyOutcome<Parameters, Measurements>[]>();
  for (const outcome of result.outcomes) {
    const group = scenarios.get(outcome.run.scenarioId) ?? [];
    group.push(outcome); scenarios.set(outcome.run.scenarioId, group);
  }
  return Object.freeze([...scenarios].map(([scenarioId, outcomes]) => {
    const values = outcomes.map(outcome => {
      const selected = outcome.status === "completed" || outcome.status === "stopped" ? synchronous(select(cloneData(outcome))) : undefined;
      if (selected !== undefined && typeof selected !== "number") throw new TypeError("Summary selections must be numeric or undefined.");
      if (selected !== undefined && !Number.isFinite(selected)) throw new RangeError("Summary selections must be finite.");
      return Object.freeze({ runId: outcome.run.id, seed: outcome.run.seed, status: outcome.status, value: selected ?? null });
    });
    const observed = values.flatMap(entry => entry.value === null ? [] : [entry.value]);
    const mean = observed.length ? observed.reduce((total, value) => total + value / observed.length, 0) : null;
    const sampleSd = observed.length < 2 || mean === null ? null
      : Math.sqrt(observed.reduce((total, value) => total + (value - mean) ** 2 / (observed.length - 1), 0));
    if ((mean !== null && !Number.isFinite(mean)) || (sampleSd !== null && !Number.isFinite(sampleSd)))
      throw new RangeError("Replication summary overflowed.");
    return Object.freeze({ scenarioId, scenarioIndex: outcomes[0]!.run.scenarioIndex,
      requested: outcomes.length, completed: outcomes.filter(value => value.status === "completed").length,
      stopped: outcomes.filter(value => value.status === "stopped").length,
      failed: outcomes.filter(value => value.status === "failed").length,
      skipped: outcomes.filter(value => value.status === "skipped").length,
      valid: observed.length, missing: outcomes.length - observed.length, mean, sampleSd, values: Object.freeze(values),
    });
  }));
}
