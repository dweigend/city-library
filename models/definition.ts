/** Headless authoring data. Factories use these same canonical defaults/constraints. */
export type Input<T> = [T] extends [number] ? {
  readonly kind: "number"; readonly default: T;
  readonly min?: number; readonly max?: number; readonly step?: number; readonly integer?: boolean;
} : [T] extends [boolean] ? {
  readonly kind: "boolean"; readonly default: T;
} : [T] extends [string] ? {
  readonly kind: "choice"; readonly default: T; readonly options: readonly T[];
} | {
  readonly kind: "text"; readonly default: T;
} : never;

export type Inputs<P extends object> = {
  readonly [K in keyof P]-?: Input<Exclude<P[K], undefined>>;
};

/** No UI, scheduler, registry or model wrapper is introduced by this contract. */
export interface Definition<P extends object, M> {
  readonly title: string;
  readonly description?: string;
  readonly inputs: Inputs<P>;
  readonly create: (options?: Partial<P>) => M;
}
