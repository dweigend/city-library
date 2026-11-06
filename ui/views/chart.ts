import type { Series } from "../definition.ts";

const ns = "http://www.w3.org/2000/svg";
export function mountChart(
  container: HTMLElement,
  mode: "line" | "bar" | "scatter" = "line",
) {
  const svg = document.createElementNS(ns, "svg");
  svg.classList.add("chart");
  svg.setAttribute("viewBox", "0 0 640 180");
  svg.setAttribute("role", "img");
  container.append(svg);
  const legend = document.createElement("div");
  legend.className = "legend";
  container.append(legend);
  return {
    update(series: readonly Series[]) {
      svg.replaceChildren();
      legend.replaceChildren();
      const points = series.flatMap((line) => [...line.points]);
      const finite = points.filter(
        (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
      );
      const minX = Math.min(0, ...finite.map((point) => point.x));
      const maxX = Math.max(1, ...finite.map((point) => point.x));
      const minY = Math.min(0, ...finite.map((point) => point.y));
      const maxY = Math.max(1, ...finite.map((point) => point.y));
      const x = (value: number) => 36 + ((value - minX) / (maxX - minX)) * 590;
      const y = (value: number) => 154 - ((value - minY) / (maxY - minY)) * 140;
      const axes = document.createElementNS(ns, "path");
      axes.setAttribute("d", "M36 12V154H628");
      axes.setAttribute("class", "axes");
      svg.append(axes);
      for (const [value, px, py] of [
        [maxY, 2, 16],
        [minY, 2, 158],
        [maxX, 598, 177],
      ] as const) {
        const text = document.createElementNS(ns, "text");
        text.setAttribute("x", String(px));
        text.setAttribute("y", String(py));
        text.textContent = Number.isInteger(value)
          ? String(value)
          : value.toPrecision(3);
        svg.append(text);
      }
      series.forEach((line, index) => {
        const color =
          line.color ??
          ["#287e9b", "#b45309", "#4c8b54", "#9759a2"][index % 4]!;
        const valid = line.points.filter(
          (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
        );
        if (mode === "line") {
          const path = document.createElementNS(ns, "path");
          path.setAttribute(
            "d",
            valid
              .map((point, i) => `${i ? "L" : "M"}${x(point.x)},${y(point.y)}`)
              .join(" "),
          );
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", color);
          path.setAttribute("stroke-width", "2");
          svg.append(path);
        } else
          for (const point of valid) {
            if (mode === "scatter") {
              const dot = document.createElementNS(ns, "circle");
              dot.setAttribute("cx", String(x(point.x)));
              dot.setAttribute("cy", String(y(point.y)));
              dot.setAttribute("r", "3");
              dot.setAttribute("fill", color);
              svg.append(dot);
            } else {
              const bar = document.createElementNS(ns, "rect");
              const width = Math.max(
                2,
                Math.min(48, 500 / Math.max(1, valid.length)),
              );
              bar.setAttribute("x", String(x(point.x) - width / 2));
              bar.setAttribute("y", String(y(point.y)));
              bar.setAttribute("width", String(width));
              bar.setAttribute(
                "height",
                String(Math.max(0, y(0) - y(point.y))),
              );
              bar.setAttribute("fill", color);
              svg.append(bar);
            }
          }
        const label = document.createElement("span");
        label.textContent = line.label;
        label.style.borderInlineStart = `3px solid ${color}`;
        label.style.paddingInlineStart = ".35rem";
        legend.append(label);
      });
      svg.setAttribute(
        "aria-label",
        series
          .map((line) => {
            const valid = line.points.filter(
              (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
            );
            const description = mode === "line"
              ? valid.at(-1)?.y ?? "no samples"
              : valid.length
                ? valid.map((point) => `x ${point.x}, y ${point.y}`).join("; ")
                : "no samples";
            return `${line.label}: ${description}`;
          })
          .join("; "),
      );
    },
    dispose() {
      svg.remove();
      legend.remove();
    },
  };
}
