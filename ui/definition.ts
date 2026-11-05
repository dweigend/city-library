import type { Definition } from "../experiments/definition.ts";

export interface ModelInstance {
  read(): unknown;
  advance(steps?: number): void;
  dispose?(): void;
}
export type Snapshot<M extends ModelInstance> = ReturnType<M["read"]>;
export interface NetworkNode {
  readonly id: string;
  readonly label?: string;
  readonly color?: string;
  /** Symbol diameter in CSS pixels; never a physical collision radius. */
  readonly size?: number;
}
export interface NetworkEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
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
  readonly shape?: "circle" | "triangle";
}
export interface SpatialData {
  readonly width: number;
  readonly height: number;
  readonly cells?: readonly Cell[];
  readonly agents: readonly SpatialAgent[];
}
export interface Series {
  readonly label: string;
  readonly color?: string;
  readonly points: readonly { readonly x: number; readonly y: number }[];
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
      readonly type: "line" | "bar" | "scatter";
      readonly label: string;
      readonly series: (state: S) => readonly Series[];
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
export interface UISpec<P extends object, M extends ModelInstance> {
  readonly setup?: readonly {
    readonly field: Extract<keyof P, string>;
    readonly label?: string;
    readonly widget?: "number" | "range" | "select" | "checkbox" | "text";
  }[];
  readonly actions?: readonly {
    readonly label: string;
    readonly run: (model: M, selected: string | null) => void;
    readonly enabled?: (state: Snapshot<M>, selected: string | null) => boolean;
    readonly pressed?: (state: Snapshot<M>) => boolean;
  }[];
  readonly live?: readonly {
    readonly field: Extract<keyof P, string>;
    readonly label?: string;
    readonly value: (state: Snapshot<M>) => string | number | boolean;
    readonly set: (model: M, value: string | number | boolean) => void;
    readonly enabled?: (state: Snapshot<M>) => boolean;
  }[];
  readonly monitors?: readonly {
    readonly label: string;
    readonly value: (state: Snapshot<M>) => string | number;
  }[];
  readonly complete?: (state: Snapshot<M>) => boolean;
  readonly source?: { readonly url: string; readonly label: string };
  readonly views: readonly (View<Snapshot<M>> | Inspector<Snapshot<M>>)[];
}
export interface BoundEntry {
  readonly title: string;
  readonly description?: string;
  mount(container: HTMLElement): { dispose(): void; pause?(): void };
}
export type EntryDefinition<
  P extends object,
  M extends ModelInstance,
> = Definition<P, M>;
