import { gini } from "./gini.ts";
import { histogram } from "./histogram.ts";
export type { Histogram } from "./histogram.ts";
export const stats = Object.freeze({ histogram, gini });
