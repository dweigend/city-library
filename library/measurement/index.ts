import { numericRecord } from "./numeric-record.ts";

export interface Measurement<Model, Values extends Readonly<Record<string, number>>> {
  read(model: Model): Readonly<Values>;
}

/** Wraps a synchronous projection; each read returns a frozen copy of its finite numeric own data. */
function define<Model, Values extends Readonly<Record<string, number>>>(
  project: (model: Model) => Values,
): Measurement<Model, Values> {
  if (typeof project !== "function" || Object.prototype.toString.call(project) !== "[object Function]") {
    throw new TypeError("A measurement requires a synchronous projection.");
  }
  return Object.freeze({
    read(model: Model): Readonly<Values> {
      // Numeric copying retains every own key and value of the validated projection.
      return numericRecord(project(model)) as Readonly<Values>;
    },
  });
}

export const measurements = Object.freeze({ define });
