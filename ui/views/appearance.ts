/** Optional host-owned presentation; omitted options preserve legacy rendering. */
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
  /** A modern host supplies its own accessible controls. */
  readonly controls?: boolean;
  readonly theme?: () => RendererTheme;
}
