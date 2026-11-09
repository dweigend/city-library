import type { Definition } from "../experiments/definition.ts";

export interface ModelInstance {
  read(): unknown;
  advance(steps?: number): void;
  dispose?(): void;
}
export type Snapshot<M extends ModelInstance> = ReturnType<M["read"]>;

/** Detached observations inferred from either a model definition or its instance. */
export type Observation<T extends ModelInstance | { readonly create: (...args: never[]) => ModelInstance }> =
  T extends ModelInstance ? Snapshot<T>
    : T extends { readonly create: (...args: never[]) => infer M extends ModelInstance }
      ? Snapshot<M> : never;

/** A formatter consumes only the scalar produced by its paired getter. */
export interface Monitor<S, V extends string | number = string | number> {
  readonly label: string;
  readonly value: (state: S) => V;
  readonly format?: (value: V) => string;
}

export interface NetworkNode {
  readonly id: string;
  readonly label?: string;
  readonly color?: string;
  /** Symbol diameter in CSS pixels; never a physical collision radius. */
  readonly size?: number;
  /** Initial view coordinates only; later dragging/layout is presentation-owned. */
  readonly position?: { readonly x: number; readonly y: number };
}
export interface NetworkEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly directed?: boolean;
  readonly color?: string;
  /** Positive finite stroke width in CSS pixels. */
  readonly width?: number;
}
export interface Cell {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly color: string;
}
export interface GridData {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly Cell[];
}
export interface SpatialAgent extends NetworkNode {
  /** Symbol diameter in CSS pixels, consistent with NetworkNode. */
  readonly size?: number;
  readonly x: number;
  readonly y: number;
  readonly heading?: number;
  readonly shape?: "circle" | "triangle" | "rectangle" | "diamond";
  /** Full rectangle dimensions in centered scene coordinates; exclusive with size. */
  readonly extent?: { readonly width: number; readonly height: number };
  readonly filled?: boolean;
  readonly stroke?: string;
  /** Nonnegative outline width in CSS pixels, default 1. */
  readonly strokeWidth?: number;
}
export interface SpatialLabel {
  readonly x: number;
  readonly y: number;
  readonly text: string;
}
export interface SpatialSegment {
  /** Detached endpoints in finite, centered two-dimensional world coordinates. */
  readonly from: { readonly x: number; readonly y: number };
  readonly to: { readonly x: number; readonly y: number };
  /** Stroke color; defaults to white. */
  readonly color?: string;
  /** Nonnegative finite stroke width in CSS pixels; defaults to 1, zero omits it. */
  readonly width?: number;
}
export interface SpatialData {
  /** Plain-text scene meaning and quantities; never another model-state owner. */
  readonly description?: string;
  /** Fixed nonselectable annotations in centered scene coordinates. */
  readonly labels?: readonly SpatialLabel[];
  /** Controlled label visibility; omit to retain the host Labels checkbox. */
  readonly showLabels?: boolean;
  readonly width: number;
  readonly height: number;
  readonly cells?: readonly Cell[];
  /** Ordered strokes drawn over cells and beneath agents, selection and labels. */
  readonly segments?: readonly SpatialSegment[];
  readonly agents: readonly SpatialAgent[];
}
export interface Series {
  readonly label: string;
  readonly color?: string;
  readonly points: readonly { readonly x: number; readonly y: number }[];
}
export interface AxisSpec {
  readonly label?: string;
  readonly unit?: string;
}
export interface BarSeries {
  readonly label: string;
  readonly color?: string;
  readonly points: readonly { readonly x: string | number; readonly y: number }[];
}
export type View<S> =
  | {
      readonly type: "network";
      readonly label: string;
      readonly nodes: (state: S) => readonly NetworkNode[];
      readonly edges: (state: S) => readonly NetworkEdge[];
    }
  | {
      readonly type: "grid";
      readonly label: string;
      readonly data: (state: S) => GridData;
    }
  | {
      readonly type: "spatial";
      readonly label: string;
      readonly data: (state: S) => SpatialData;
    }
  | {
      readonly type: "line" | "scatter";
      readonly xAxis?: AxisSpec;
      readonly yAxis?: AxisSpec;
      readonly label: string;
      readonly series: (state: S) => readonly Series[];
    }
  | {
      readonly type: "bar";
      readonly label: string;
      readonly xAxis?: AxisSpec;
      readonly yAxis?: AxisSpec;
      readonly series: (state: S) => readonly BarSeries[];
    }
  | {
      readonly type: "table";
      readonly label: string;
      readonly rows: (
        state: S,
      ) => readonly Readonly<Record<string, string | number | boolean>>[];
    };
export interface Inspector<S> {
  readonly type: "inspector";
  readonly label: string;
  readonly value: (
    state: S,
    selected: string | null,
  ) => Readonly<Record<string, string | number | boolean>> | undefined;
}
export type DrawingIntent =
  | {
      readonly phase: "begin" | "move";
      readonly position: { readonly x: number; readonly y: number };
    }
  | { readonly phase: "end"; readonly position?: never };

export interface SetupField<P extends object> {
  readonly field: Extract<keyof P, string>;
  readonly label?: string;
  readonly widget?: "number" | "range" | "select" | "checkbox" | "text";
}
export interface LegacyLiveField<P extends object, M extends ModelInstance> {
  readonly field: Extract<keyof P, string>;
  readonly label?: string;
  readonly widget?: "color";
  readonly group?: string;
  readonly value: (state: Snapshot<M>) => string | number | boolean;
  readonly set: (model: M, value: string | number | boolean) => void;
  readonly enabled?: (state: Snapshot<M>) => boolean;
}
type KeyedField<P extends object, M extends ModelInstance, K extends keyof P, DefaultWrite extends boolean> = {
  readonly label?: string;
  readonly widget?: "color";
  readonly group?: string;
  readonly enabled?: (state: Snapshot<M>) => boolean;
} & (DefaultWrite extends true
  ? { readonly set?: (model: M, value: P[K]) => void }
  : { readonly set: (model: M, value: P[K]) => void })
  & ([Snapshot<M>] extends [{ readonly parameters: { readonly [F in K]-?: P[F] } }]
  ? { readonly value?: (state: Snapshot<M>) => P[K] }
  : { readonly value: (state: Snapshot<M>) => P[K] });
export type KeyedLive<P extends object, M extends ModelInstance, DefaultWrite extends boolean = false> = {
  readonly [K in Extract<keyof P, string>]?: KeyedField<P, M, K, DefaultWrite>;
};

/** A default live write receives one decoded parameter change per invocation. */
export type LiveChanges<P extends object> = Partial<P>;

interface UISpecBase<P extends object, M extends ModelInstance> {
  readonly drawing?: {
    /** Optional host-owned mode toggle, initially off for each mounted instance. */
    readonly toggleLabel?: string;
    readonly enabled: (state: Snapshot<M>) => boolean;
    readonly intent: (model: M, intent: DrawingIntent) => void;
  };
  readonly setup?: readonly (Extract<keyof P, string> | SetupField<P>)[];
  readonly actions?: readonly {
    readonly label: string;
    readonly run: (model: M, selected: string | null) => void;
    readonly enabled?: (state: Snapshot<M>, selected: string | null) => boolean;
    readonly pressed?: (state: Snapshot<M>) => boolean;
    /** Independent host cadence; never scientific model time. */
    readonly repeat?: { readonly label: string; readonly intervalMs: number };
  }[];
  readonly monitors?: readonly Monitor<Snapshot<M>>[];
  readonly complete?: (state: Snapshot<M>) => boolean;
  readonly source?: { readonly url: string; readonly label: string };
  readonly views: readonly (View<Snapshot<M>> | Inspector<Snapshot<M>>)[];
}
/** Keyed fields may omit their setter only with an explicit common write action. */
export type UISpec<P extends object, M extends ModelInstance> = UISpecBase<P, M> & (
  | {
      readonly change: (model: M, changes: LiveChanges<P>) => void;
      readonly live?: KeyedLive<P, M, true>;
    }
  | {
      readonly change?: undefined;
      readonly live?: readonly LegacyLiveField<P, M>[] | KeyedLive<P, M>;
    }
);

export interface BoundEntry {
  readonly title: string;
  readonly description?: string;
  mount(container: HTMLElement): { dispose(): void; pause?(): void };
}
export type EntryDefinition<
  P extends object,
  M extends ModelInstance,
> = Definition<P, M>;
