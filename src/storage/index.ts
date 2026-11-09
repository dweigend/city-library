import { history } from "./history.ts";
export type { History, Sample } from "./history.ts";
/** Explicit bounded observations; snapshot continuation is a separate contract. */
export const storage = Object.freeze({ history });
