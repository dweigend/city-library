import type { RendererOptions } from "./appearance.ts";
import type { AxisSpec, BarSeries, Series } from "../definition.ts";

type Mode = "line" | "bar" | "scatter";
interface PlotPoint { readonly x: number; readonly y: number; readonly category?: string }
interface PlotSeries { readonly label: string; readonly color?: string; readonly points: readonly PlotPoint[] }

/** Internal renderer preparation. Observations are never changed or aggregated. */
export function prepareChartData(mode: Mode, input: readonly (Series | BarSeries)[]) {
  const categories: string[] = [];
  let domain: "number" | "string" | undefined;
  if (mode === "bar") {
    for (const series of input) {
      const seen = new Set<string>();
      for (const point of series.points) {
        if (typeof point.x !== "string" && !Number.isFinite(point.x)) continue;
        const current = typeof point.x === "string" ? "string" : "number";
        if (domain !== undefined && domain !== current)
          throw new TypeError("A bar chart cannot mix numeric and categorical x values.");
        domain = current;
        if (typeof point.x === "string") {
          if (seen.has(point.x)) throw new TypeError("Duplicate category within a bar series.");
          seen.add(point.x);
          if (!categories.includes(point.x)) categories.push(point.x);
        }
      }
    }
  }
  const categorical = domain === "string";
  const series: PlotSeries[] = input.map(line => ({
    label: line.label,
    color: line.color,
    points: line.points.flatMap(point => {
      if (!Number.isFinite(point.y)) return [];
      if (categorical && typeof point.x === "string")
        return [{ x: categories.indexOf(point.x), y: point.y, category: point.x }];
      if (typeof point.x === "number" && Number.isFinite(point.x))
        return [{ x: point.x, y: point.y }];
      return [];
    }),
  }));
  const points = series.flatMap(line => [...line.points]);
  return {
    categorical, categories, series,
    minX: Math.min(0, ...points.map(point => point.x)),
    maxX: Math.max(1, ...points.map(point => point.x)),
    minY: Math.min(0, ...points.map(point => point.y)),
    maxY: Math.max(1, ...points.map(point => point.y)),
  };
}

/** Shared geometry used by SVG rendering; empty series retain their category slot. */
export function chartGeometry(data: ReturnType<typeof prepareChartData>, left = 36, viewportWidth = 640, bottom = 154) {
  const width = Math.max(1, viewportWidth - 14 - left);
  const x = (value: number) => left + ((value - data.minX) / (data.maxX - data.minX)) * width;
  const y = (value: number) => bottom - ((value - data.minY) / (data.maxY - data.minY)) * Math.max(1, bottom - 14);
  const slot = width / Math.max(1, data.categories.length);
  const groupWidth = slot * 0.8;
  const barWidth = groupWidth / Math.max(1, data.series.length);
  const categoryX = (index: number) => left + slot * (index + 0.5);
  function bar(point: PlotPoint, seriesIndex: number) {
    const validCount = data.series[seriesIndex]!.points.length;
    const width = data.categorical ? barWidth : Math.max(2, Math.min(48, 500 / Math.max(1, validCount)));
    return {
      x: data.categorical
        ? categoryX(point.x) - groupWidth / 2 + seriesIndex * barWidth
        : x(point.x) - width / 2,
      y: Math.min(y(0), y(point.y)),
      width,
      height: Math.abs(y(0) - y(point.y)),
    };
  }
  return { x, y, categoryX, bar };
}

function axisText(axis: AxisSpec | undefined): string {
  if (axis?.label && axis.unit) return `${axis.label} (${axis.unit})`;
  return axis?.label || axis?.unit || "";
}
const ns = "http://www.w3.org/2000/svg";
export function mountChart<M extends Mode = "line">(
  container: HTMLElement,
  mode: M = "line" as M,
  options: RendererOptions = {},
) {
  const svg = document.createElementNS(ns, "svg");
  svg.classList.add(options.theme ? "model-chart" : "chart");
  const xAxis = axisText(options.xAxis), yAxis = axisText(options.yAxis);
  // A stable intrinsic height prevents viewBox changes from feeding back into layout.
  // Match SVG user units to the actual CSS viewport so inherited text is not shrunk.
  const intrinsicHeight = xAxis ? 216 : 180;
  svg.setAttribute("height", String(intrinsicHeight));
  let viewportWidth = 640;
  let viewportHeight = intrinsicHeight;
  let lastData: ReturnType<typeof prepareChartData> | undefined;
  let disposed = false;
  // Color identity belongs to this mounted view, never to model state.
  const seriesSlots = new Map<string, number>();
  let nextSeriesSlot = 0;
  svg.setAttribute("viewBox", `0 0 ${viewportWidth} ${viewportHeight}`);
  svg.setAttribute("role", "img");
  container.append(svg);
  const legend = document.createElement("div");
  legend.className = options.theme ? "model-legend" : "legend";
  container.append(legend);
  function text(value: string, x: number, y: number, anchor?: string) {
    const node = document.createElementNS(ns, "text");
    node.setAttribute("x", String(x));
    node.setAttribute("y", String(y));
    if (anchor) node.setAttribute("text-anchor", anchor);
    node.textContent = value;
    svg.append(node);
    return node;
  }
  function render(data: ReturnType<typeof prepareChartData>) {
      const left = yAxis ? 64 : 36;
      const right = viewportWidth - 14;
      const bottom = Math.max(32, viewportHeight - (xAxis ? 62 : 26));
      const geometry = chartGeometry(data, left, viewportWidth, bottom);
      svg.replaceChildren();
      legend.replaceChildren();
      const axes = document.createElementNS(ns, "path");
      axes.setAttribute("d", `M${left} 12V${bottom}H${right}`);
      axes.setAttribute("class", "axes");
      svg.append(axes);
      for (const [value, px, py] of [[data.maxY, left - 34, 16], [data.minY, left - 34, bottom + 4]] as const)
        text(Number.isInteger(value) ? String(value) : value.toPrecision(3), px, py);
      if (data.categorical)
        data.categories.forEach((category, index) => text(category, geometry.categoryX(index), bottom + 23, "middle"));
      else text(Number.isInteger(data.maxX) ? String(data.maxX) : data.maxX.toPrecision(3), right - 28, bottom + 23);
      if (mode === "bar" && data.minY < 0) {
        const baseline = document.createElementNS(ns, "path");
        baseline.setAttribute("d", `M${left} ${geometry.y(0)}H${right}`);
        baseline.setAttribute("class", "axes");
        svg.append(baseline);
      }
      if (xAxis) text(xAxis, (left + right) / 2, viewportHeight - 9, "middle");
      if (yAxis) {
        const center = (14 + bottom) / 2;
        text(yAxis, 14, center, "middle").setAttribute("transform", `rotate(-90 14 ${center})`);
      }
      const palette = options.theme?.().series ?? ["#287e9b", "#b45309", "#4c8b54", "#9759a2"];
      const labelCounts = new Map<string, number>();
      for (const line of data.series) labelCounts.set(line.label, (labelCounts.get(line.label) ?? 0) + 1);
      data.series.forEach((line, index) => {
        let slot = index;
        if (labelCounts.get(line.label) === 1) {
          const existing = seriesSlots.get(line.label);
          slot = existing ?? Math.max(nextSeriesSlot, index);
          if (existing === undefined) seriesSlots.set(line.label, slot);
        }
        nextSeriesSlot = Math.max(nextSeriesSlot, slot + 1);
        const color = line.color ?? palette[slot % palette.length]!;
        if (mode === "line") {
          const path = document.createElementNS(ns, "path");
          path.setAttribute("d", line.points.map((point, i) => `${i ? "L" : "M"}${geometry.x(point.x)},${geometry.y(point.y)}`).join(" "));
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", color);
          path.setAttribute("stroke-width", "2");
          svg.append(path);
        } else for (const point of line.points) {
          if (mode === "scatter") {
            const dot = document.createElementNS(ns, "circle");
            dot.setAttribute("cx", String(geometry.x(point.x)));
            dot.setAttribute("cy", String(geometry.y(point.y)));
            dot.setAttribute("r", "3");
            dot.setAttribute("fill", color);
            svg.append(dot);
          } else {
            const bar = document.createElementNS(ns, "rect");
            for (const [name, value] of Object.entries(geometry.bar(point, index))) bar.setAttribute(name, String(value));
            bar.setAttribute("fill", color);
            svg.append(bar);
          }
        }
        const label = document.createElement("span");
        label.textContent = line.label;
        if (options.theme) {
          const swatch = document.createElementNS(ns, "svg");
          swatch.setAttribute("viewBox", "0 0 12 12");
          swatch.setAttribute("aria-hidden", "true");
          const mark = document.createElementNS(ns, "rect");
          mark.setAttribute("width", "12");
          mark.setAttribute("height", "12");
          mark.setAttribute("fill", color);
          swatch.append(mark);
          label.prepend(swatch);
        } else {
          label.style.borderInlineStart = `3px solid ${color}`;
          label.style.paddingInlineStart = ".35rem";
        }
        legend.append(label);
      });
      const descriptions = data.series.map(line => {
        const description = mode === "line" ? line.points.at(-1)?.y ?? "no samples"
          : line.points.length ? line.points.map(point => `x ${point.category ?? point.x}, y ${point.y}`).join("; ") : "no samples";
        return `${line.label}: ${description}`;
      });
      svg.setAttribute("aria-label", [xAxis && `x axis: ${xAxis}`, yAxis && `y axis: ${yAxis}`, ...descriptions].filter(Boolean).join("; "));
  }
  function resize(width: number, height: number) {
    if (disposed || width <= 0 || height <= 0) return;
    if (Math.abs(width - viewportWidth) < 0.5 && Math.abs(height - viewportHeight) < 0.5) return;
    viewportWidth = width;
    viewportHeight = height;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    if (lastData) render(lastData);
  }
  const observer = new ResizeObserver(entries => {
    const entry = entries[0];
    if (entry) resize(entry.contentRect.width, entry.contentRect.height);
  });
  observer.observe(svg);
  return {
    update(input: readonly (M extends "bar" ? BarSeries : Series)[]) {
      // Reject invalid data before replacing the last valid observation or SVG.
      const data = prepareChartData(mode, input);
      const bounds = svg.getBoundingClientRect();
      resize(bounds.width, bounds.height);
      lastData = data;
      render(data);
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      lastData = undefined;
      svg.remove();
      legend.remove();
    },
  };
}
