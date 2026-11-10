import { design, replicate } from "./design.ts";
import { run } from "./run.ts";
import { summarize } from "./summary.ts";
export type * from "./types.ts";
export const studies = Object.freeze({ design, replicate, run, summarize });
