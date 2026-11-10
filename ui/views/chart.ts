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
  const [minX, maxX] = extent(points.map(point => point.x));
  const [minY, maxY] = extent(points.map(point => point.y));
  return { categorical, categories, series, minX, maxX, minY, maxY };
}

/** Data extent anchored at zero; an empty or flat extent keeps a unit span. */
function extent(values: readonly number[]): [number, number] {
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  return max > min ? [min, max] : [min, min + 1];
}

/**
 * Rounded axis steps (1, 2 or 5 × 10ⁿ) covering the extent with about `count` intervals.
 * `minimumStep` keeps count data from showing fractional ticks.
 */
export function niceTicks(min: number, max: number, count: number, minimumStep = 0) {
  const rough = Math.max((max - min) / Math.max(1, count), minimumStep);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 5, 10].map(factor => factor * magnitude).find(candidate => candidate >= rough) ?? 10 * magnitude;
  const first = Math.floor(min / step + 1e-9) * step;
  const last = Math.ceil(max / step - 1e-9) * step;
  // Multiply instead of accumulating, and round to the step's precision, to avoid 0.30000000000000004.
  const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  const values = Array.from({ length: Math.round((last - first) / step) + 1 }, (_, index) =>
    Number((first + index * step).toFixed(decimals)) + 0);
  return { min: values[0]!, max: values.at(-1)!, step, values };
}

const compactNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
/** Tick text uses the precision of its step, and compact notation for large magnitudes. */
export function tickText(value: number, step: number): string {
  if (Math.abs(value) >= 1e5) return compactNumber.format(value);
  const decimals = Math.max(0, Math.min(6, -Math.floor(Math.log10(step) + 1e-9)));
  return value.toFixed(decimals);
}

/** Shared geometry used by SVG rendering; empty series retain their category slot. */
export function chartGeometry(data: ReturnType<typeof prepareChartData>, left = 36, viewportWidth = 640, bottom = 154, top = 14) {
  const width = Math.max(1, viewportWidth - 14 - left);
  const x = (value: number) => left + ((value - data.minX) / (data.maxX - data.minX)) * width;
  const y = (value: number) => bottom - ((value - data.minY) / (data.maxY - data.minY)) * Math.max(1, bottom - top);
  const slot = width / Math.max(1, data.categories.length);
  const groupWidth = slot * 0.8;
  const barWidth = groupWidth / Math.max(1, data.series.length);
  const categoryX = (index: number) => left + slot * (index + 0.5);
  const numericBarWidth = Math.max(2, (x(data.minX + numericSpacing(data)) - x(data.minX)) * 0.8);
  function bar(point: PlotPoint, seriesIndex: number) {
    const width = data.categorical ? barWidth : numericBarWidth;
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

/** Smallest distance between distinct numeric x values; histogram bins share it. */
export function numericSpacing(data: ReturnType<typeof prepareChartData>): number {
  const values = [...new Set(data.series.flatMap(line => line.points.map(point => point.x)))].sort((a, b) => a - b);
  let spacing = Infinity;
  for (let index = 1; index < values.length; index++) spacing = Math.min(spacing, values[index]! - values[index - 1]!);
  return Number.isFinite(spacing) ? spacing : 1;
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
  function strokePath(d: string, className: string) {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", className);
    svg.append(path);
  }
  /** Approximate rendered width; SVG text is not measured to keep rendering synchronous. */
  function textWidth(value: string, fontSize: number) { return value.length * fontSize * 0.6; }
  /** Category labels wrap onto at most two lines; labels that still collide are thinned. */
  function categoryLines(categories: readonly string[], slot: number, fontSize: number) {
    const wrapped = categories.map(category => {
      if (textWidth(category, fontSize) <= slot - 4) return [category];
      const words = category.split(" ");
      const split = Math.ceil(words.length / 2);
      return words.length > 1 ? [words.slice(0, split).join(" "), words.slice(split).join(" ")] : [category];
    });
    const widest = Math.max(0, ...wrapped.flat().map(part => textWidth(part, fontSize)));
    const every = Math.max(1, Math.ceil((widest + 8) / Math.max(1, slot)));
    return { wrapped, every, lines: Math.max(1, ...wrapped.map(parts => parts.length)) };
  }
  function render(data: ReturnType<typeof prepareChartData>) {
      const fontSize = parseFloat(getComputedStyle(svg).fontSize) || 12;
      const lineHeight = fontSize * 1.2;
      const plotTop = Math.ceil(fontSize / 2) + 2;
      const yTickCount = Math.max(2, Math.min(6, Math.floor(viewportHeight / 40)));
      const values = data.series.flatMap(series => series.points);
      const yTicks = niceTicks(data.minY, data.maxY, yTickCount, values.every(point => Number.isInteger(point.y)) ? 1 : 0);
      const yLabels = yTicks.values.map(value => tickText(value, yTicks.step));
      const left = Math.ceil(Math.max(...yLabels.map(label => textWidth(label, fontSize)))) + 10 + (yAxis ? lineHeight + 4 : 0);
      const right = viewportWidth - Math.ceil(fontSize);
      const slot = (right - left) / Math.max(1, data.categories.length);
      const categories = categoryLines(data.categories, slot, fontSize);
      const tickRows = data.categorical ? categories.lines : 1;
      const bottom = Math.max(plotTop + 20, viewportHeight - 8 - tickRows * lineHeight - (xAxis ? lineHeight + 6 : 0));
      // Numeric bars are centered on their x value, so the domain gains half a bin per side.
      const pad = mode === "bar" && !data.categorical ? numericSpacing(data) / 2 : 0;
      const scale = { ...data, minX: data.minX - pad, maxX: data.maxX + pad, minY: yTicks.min, maxY: yTicks.max };
      const geometry = chartGeometry(scale, left, right + 14, bottom, plotTop);
      svg.replaceChildren();
      legend.replaceChildren();
      yTicks.values.forEach((value, index) => {
        const y = geometry.y(value);
        if (value !== yTicks.min) strokePath(`M${left} ${y}H${right}`, "grid");
        text(yLabels[index]!, left - 6, y, "end").setAttribute("dominant-baseline", "middle");
      });
      strokePath(`M${left} ${plotTop}V${bottom}H${right}`, "axes");
      const labelY = bottom + lineHeight;
      if (data.categorical) {
        categories.wrapped.forEach((parts, index) => {
          if (index % categories.every !== 0) return;
          const label = text("", geometry.categoryX(index), labelY, "middle");
          parts.forEach((part, row) => {
            const span = document.createElementNS(ns, "tspan");
            span.setAttribute("x", String(geometry.categoryX(index)));
            span.setAttribute("dy", String(row ? lineHeight : 0));
            span.textContent = part;
            label.append(span);
          });
        });
      } else {
        const xTickCount = Math.max(1, Math.min(8, Math.floor((right - left) / 80), pad ? (data.maxX - data.minX) / (2 * pad) : Infinity));
        const xTicks = niceTicks(data.minX, data.maxX, xTickCount, values.every(point => Number.isInteger(point.x)) ? 1 : 0);
        for (const value of xTicks.values) {
          if (value < data.minX - 1e-9 || value > data.maxX + 1e-9) continue;
          const x = geometry.x(value);
          const label = tickText(value, xTicks.step);
          const half = textWidth(label, fontSize) / 2;
          const anchor = x - half < left - 4 ? "start" : x + half > viewportWidth ? "end" : "middle";
          text(label, x, labelY, anchor);
        }
      }
      if (mode === "bar" && yTicks.min < 0) strokePath(`M${left} ${geometry.y(0)}H${right}`, "axes");
      if (xAxis) text(xAxis, (left + right) / 2, viewportHeight - 6, "middle");
      if (yAxis) {
        const center = (plotTop + bottom) / 2;
        const x = lineHeight * 0.8;
        text(yAxis, x, center, "middle").setAttribute("transform", `rotate(-90 ${x} ${center})`);
      }
      const palette = options.theme?.().series ?? ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"];
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
