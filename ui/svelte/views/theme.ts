import type { RendererTheme } from "../../views/appearance.ts";

/** Resolve the host's single token system for canvas and Cytoscape APIs. */
export function readRendererTheme(host: HTMLElement): RendererTheme {
  const style = getComputedStyle(host);
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const context = probe.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D is unavailable.");
  function color(token: string) {
    const value = style.getPropertyValue(token).trim();
    if (!value || !CSS.supports("color", value))
      throw new Error(`Missing renderer color token: ${token}`);
    // Cytoscape cannot parse every CSS color space supported by the browser.
    context!.clearRect(0, 0, 1, 1);
    context!.fillStyle = value;
    context!.fillRect(0, 0, 1, 1);
    const pixel = context!.getImageData(0, 0, 1, 1).data;
    return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]! / 255})`;
  }
  return {
    background: color("--view-background"),
    foreground: color("--view-foreground"),
    muted: color("--muted-foreground"),
    selected: color("--view-selected"),
    node: color("--node-default"),
    series: [1, 2, 3, 4].map(index => color(`--series-${index}`)),
    font: `${style.fontWeight} ${parseFloat(style.fontSize) * Math.min(devicePixelRatio, 2)}px ${style.fontFamily}`,
  };
}
