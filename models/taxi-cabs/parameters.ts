import type { Inputs } from "../definition.ts";
export type DemandPhase = "AM" | "MD" | "PM" | "EVE" | "EM";
export type Zone = "cbd" | "com" | "res";
export type DemandKey = `prob-${Zone}-${Zone}-${DemandPhase}`;
export type TaxiParameters = Record<DemandKey, number> & {
  seed: number;
  taxicabCount: number;
  lengthOfGreenLight: number;
  lengthOfTimePeriod: number;
  waitTimeMean: number;
  waitTimeSd: number;
  firstPassengerCost: number;
  eachAdditionalPassengerCost: number;
  eachGridCost: number;
  eachTickCost: number;
};
export const inputs: Inputs<TaxiParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  taxicabCount: { kind: "number", default: 25, min: 1, max: 50, integer: true },
  lengthOfGreenLight: {
    kind: "number",
    default: 20,
    min: 0,
    max: 30,
    integer: true,
  },
  lengthOfTimePeriod: {
    kind: "number",
    default: 2000,
    min: 1,
    max: 5000,
    integer: true,
  },
  waitTimeMean: { kind: "number", default: 50 },
  waitTimeSd: { kind: "number", default: 10, min: 0 },
  firstPassengerCost: { kind: "number", default: 0.78, min: 0, max: 10 },
  eachAdditionalPassengerCost: {
    kind: "number",
    default: 0.49,
    min: 0,
    max: 5,
  },
  eachGridCost: { kind: "number", default: 0.93, min: 0, max: 10 },
  eachTickCost: { kind: "number", default: 0.5, min: 0.01, max: 5 },
  "prob-cbd-cbd-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-com-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-cbd-AM": { kind: "number", default: 1.0, min: 0, max: 1 },
  "prob-res-res-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-res-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-cbd-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-com-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-res-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-com-AM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-cbd-MD": { kind: "number", default: 0.97, min: 0, max: 1 },
  "prob-cbd-com-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-res-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-com-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-cbd-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-res-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-res-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-cbd-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-com-MD": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-res-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-res-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-cbd-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-com-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-res-PM": { kind: "number", default: 1.0, min: 0, max: 1 },
  "prob-cbd-com-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-cbd-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-com-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-cbd-PM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-cbd-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-com-EVE": { kind: "number", default: 1.0, min: 0, max: 1 },
  "prob-cbd-cbd-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-com-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-res-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-com-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-cbd-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-res-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-res-EVE": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-cbd-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-res-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-res-com-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-cbd-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-com-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-cbd-res-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-com-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-cbd-EM": { kind: "number", default: 0.0, min: 0, max: 1 },
  "prob-com-res-EM": { kind: "number", default: 1.0, min: 0, max: 1 },
};
