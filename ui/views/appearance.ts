import type { AxisSpec } from "../definition.ts";

/** Optional host-owned presentation; omitted options preserve default rendering. */
export interface RendererTheme {
  readonly background: string;
  readonly foreground: string;
  readonly muted: string;
  readonly selected: string;
  readonly node: string;
  readonly series: readonly string[];
  readonly font: string;
}

export interface RendererOptions {
  /** Chart axis text only; never data conversion or renderer configuration. */
  readonly xAxis?: AxisSpec;
  readonly yAxis?: AxisSpec;
  /** A modern host supplies its own accessible controls. */
  readonly controls?: boolean;
  readonly theme?: () => RendererTheme;
}
