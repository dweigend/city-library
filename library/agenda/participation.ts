import { frameworkRecord } from "../agent/lifecycle.ts";

/** Block Agent deletion while one kernel owns its active participation. */
export function retainParticipant(value: unknown): () => void {
  const record = frameworkRecord(value);
  if (record?.kind !== "agent") return () => {};
  if (!record.alive) throw new TypeError("A deleted Agent cannot participate.");
  const participant = {
    validate() { throw new TypeError("Remove active DES participation before deleting an Agent."); },
    commit() {},
  };
  record.deletionParticipants.add(participant);
  return () => { record.deletionParticipants.delete(participant); };
}
