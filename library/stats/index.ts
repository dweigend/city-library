import { gini } from "./gini.ts";
import { histogram } from "./histogram.ts";
import { describe } from "./describe.ts";
export type { Histogram } from "./histogram.ts";
export type { Summary } from "./describe.ts";
export const stats = Object.freeze({ histogram, gini, describe });
