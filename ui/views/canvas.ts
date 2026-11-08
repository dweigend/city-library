import type { RendererOptions } from "./appearance.ts";
import type {
  Cell,
  GridData,
  SpatialData,
  DrawingIntent,
} from "../definition.ts";

export function mountCanvas(
  container: HTMLElement,
  select: (id: string) => void,
  intent?: (intent: DrawingIntent) => void,
  options: RendererOptions = {},
) {
  const canvas = document.createElement("canvas");
  canvas.className = options.theme ? "model-canvas" : "world";
  canvas.tabIndex = 0;
  container.append(canvas);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable.");
  const ctx = context;
  let disposed = false;
  let latest: GridData | SpatialData | undefined;
  let pixelWidth = 400;
  let availableWidth = 400;
  let displayHeightLimit = Infinity;
  let selected: string | null = null;
  let showLabels = false;
  let drawingEnabled = false;
  let pointer: number | null = null;
  const labelControl = document.createElement("label");
  labelControl.className = "view-labels";
  const labels = document.createElement("input");
  labels.type = "checkbox";
  labelControl.append(labels, "Labels");
  labelControl.hidden = true;
  if (options.controls !== false) container.insertBefore(labelControl, canvas);
  labels.addEventListener("change", () => {
    showLabels = labels.checked;
    draw();
  });
  function drawCell(cell: Cell, width: number, height: number) {
    ctx.fillStyle = cell.color;
    ctx.fillRect(
      ((cell.x + width / 2 - 0.5) / width) * canvas.width,
      ((height / 2 - cell.y - 0.5) / height) * canvas.height,
      canvas.width / width + 0.5,
      canvas.height / height + 0.5,
    );
  }
  function draw() {
    const data = latest;
    if (!data) return;
    const theme = options.theme?.();
    ctx.fillStyle = theme?.background ?? "#151515";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const cell of data.cells ?? [])
      drawCell(cell, data.width, data.height);
    if ("agents" in data) {
      ctx.save();
      for (const segment of data.segments ?? []) {
        const width = segment.width ?? 1;
        // Canvas ignores lineWidth = 0, so omit invisible strokes explicitly.
        if (width === 0) continue;
        ctx.strokeStyle = segment.color ?? theme?.foreground ?? "#fff";
        ctx.lineWidth = width * Math.min(devicePixelRatio, 2);
        ctx.beginPath();
        ctx.moveTo(
          ((segment.from.x + data.width / 2) / data.width) * canvas.width,
          ((data.height / 2 - segment.from.y) / data.height) * canvas.height,
        );
        ctx.lineTo(
          ((segment.to.x + data.width / 2) / data.width) * canvas.width,
          ((data.height / 2 - segment.to.y) / data.height) * canvas.height,
        );
        ctx.stroke();
      }
      ctx.restore();
    }
    if ("agents" in data)
      for (const agent of data.agents) {
        const x = ((agent.x + data.width / 2) / data.width) * canvas.width;
        const y = ((data.height / 2 - agent.y) / data.height) * canvas.height;
        const size = Math.max(
          2,
          (agent.size ?? 8) * Math.min(devicePixelRatio, 2),
        );
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(((agent.heading ?? 0) * Math.PI) / 180);
        ctx.fillStyle = agent.color ?? theme?.foreground ?? "#fff";
        ctx.beginPath();
        if (agent.shape === "triangle") {
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size * 0.35, size * 0.35);
          ctx.lineTo(-size * 0.35, size * 0.35);
          ctx.closePath();
        } else ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (agent.id === selected) {
          ctx.strokeStyle = theme?.selected ?? "#fbbf24";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
        if ((data.showLabels ?? showLabels) && agent.label) {
          ctx.font = theme?.font ?? `${12 * Math.min(devicePixelRatio, 2)}px system-ui, sans-serif`;
          ctx.lineWidth = 3;
          ctx.strokeStyle = theme?.background ?? "#151515";
          ctx.fillStyle = theme?.foreground ?? "#fff";
          ctx.strokeText(agent.label, x + size, y - size);
          ctx.fillText(agent.label, x + size, y - size);
        }
      }
  }
  function resizeBuffer() {
    if (options.theme) {
      const ratio = latest ? latest.width / latest.height : 1;
      pixelWidth = Math.max(1, Math.min(availableWidth, displayHeightLimit * ratio)) * Math.min(devicePixelRatio, 2);
    }
    const height = pixelWidth * (latest ? latest.height / latest.width : 1);
    if (canvas.width !== Math.round(pixelWidth))
      canvas.width = Math.round(pixelWidth);
    if (canvas.height !== Math.round(height))
      canvas.height = Math.round(height);
  }
  const resize = new ResizeObserver((entries) => {
    const width = Math.max(1, entries[0]?.contentRect.width ?? 200);
    if (options.theme) {
      availableWidth = width;
      displayHeightLimit = parseFloat(getComputedStyle(canvas).maxHeight) || Infinity;
    } else pixelWidth = width * Math.min(devicePixelRatio, 2);
    resizeBuffer();
    draw();
  });
  resize.observe(options.theme ? container : canvas);
  function pick(event: MouseEvent) {
    const data = latest;
    if (!data) return;
    const rect = canvas.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / rect.width) * data.width - data.width / 2;
    const y =
      data.height / 2 -
      ((event.clientY - rect.top) / rect.height) * data.height;
    if (!drawingEnabled && "agents" in data) {
      const nearest = [...data.agents].sort(
        (a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y),
      )[0];
      if (nearest && Math.hypot(nearest.x - x, nearest.y - y) < 2) {
        select(nearest.id);
        return;
      }
    }
    const cell = data.cells?.find(
      (cell) => Math.abs(cell.x - x) <= 0.5 && Math.abs(cell.y - y) <= 0.5,
    );
    if (cell) select(cell.id);
  }
  function cellAt(event: PointerEvent) {
    if (!latest) return undefined;
    const rect = canvas.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / rect.width) * latest.width -
      latest.width / 2;
    const y =
      latest.height / 2 -
      ((event.clientY - rect.top) / rect.height) * latest.height;
    return latest.cells?.find(
      (cell) => Math.abs(cell.x - x) <= 0.5 && Math.abs(cell.y - y) <= 0.5,
    );
  }
  function pointerDown(event: PointerEvent) {
    if (!drawingEnabled || !intent || pointer !== null || event.button !== 0)
      return;
    const cell = cellAt(event);
    if (!cell) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    pointer = event.pointerId;
    canvas.setPointerCapture(pointer);
    select(cell.id);
    intent({ phase: "begin", position: { x: cell.x, y: cell.y } });
  }
  function pointerMove(event: PointerEvent) {
    if (pointer !== event.pointerId || !drawingEnabled || !intent) return;
    const cell = cellAt(event);
    if (cell) intent({ phase: "move", position: { x: cell.x, y: cell.y } });
  }
  function endStroke() {
    const active = pointer;
    if (active === null) return;
    pointer = null;
    if (canvas.hasPointerCapture(active)) canvas.releasePointerCapture(active);
    intent?.({ phase: "end" });
  }
  function setDrawingPresentation(enabled: boolean) {
    if (options.theme) canvas.dataset.drawing = String(enabled);
    else canvas.style.touchAction = enabled ? "none" : "auto";
  }
  function stopDrawing() {
    drawingEnabled = false;
    setDrawingPresentation(false);
    endStroke();
    // The end intent may synchronously render the old observation.
    drawingEnabled = false;
    setDrawingPresentation(false);
  }
  function pointerEnd(event: PointerEvent) {
    if (pointer === event.pointerId) endStroke();
  }
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerEnd);
  canvas.addEventListener("pointercancel", pointerEnd);
  canvas.addEventListener("lostpointercapture", pointerEnd);
  canvas.addEventListener("click", pick);
  canvas.setAttribute("role", "group");
  canvas.setAttribute("aria-label", "Model view. Arrow keys select an item.");
  function key(event: KeyboardEvent) {
    if (
      drawingEnabled &&
      intent &&
      latest &&
      [" ", "Enter"].includes(event.key)
    ) {
      event.preventDefault();
      if (event.repeat) return;
      const cell =
        latest.cells?.find((cell) => cell.id === selected) ?? latest.cells?.[0];
      if (cell) {
        select(cell.id);
        intent({ phase: "begin", position: { x: cell.x, y: cell.y } });
        intent({ phase: "end" });
      }
      return;
    }
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key) ||
      !latest
    )
      return;
    const items =
      !drawingEnabled && "agents" in latest && latest.agents.length
        ? latest.agents
        : (latest.cells ?? []);
    if (!items.length) return;
    event.preventDefault();
    const current = items.findIndex((item) => item.id === selected);
    const delta = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (Math.max(-1, current) + delta + items.length) % items.length;
    select(items[index]!.id);
  }
  canvas.addEventListener("keydown", key);
  return {
    update(data: GridData | SpatialData, id: string | null, drawing = false) {
      if (!drawing) stopDrawing();
      drawingEnabled = Boolean(intent) && drawing;
      setDrawingPresentation(drawingEnabled);
      latest = data;
      if (!options.theme) canvas.style.aspectRatio = `${data.width} / ${data.height}`;
      resizeBuffer();
      selected = id;
      labelControl.hidden =
        !("agents" in data) ||
        data.showLabels !== undefined ||
        !data.agents.some((agent) => Boolean(agent.label));
      canvas.setAttribute(
        "aria-label",
        `Model view. ${"agents" in data ? data.agents.length + " agents" : data.cells.length + " cells"}. Arrow keys select an item.${drawingEnabled ? " Space or Enter draws a cell." : ""}${id ? " Selected " + id : ""}`,
      );
      draw();
    },
    stopDrawing,
    setLabels(value: boolean) { showLabels = value; draw(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      stopDrawing();
      resize.disconnect();
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointermove", pointerMove);
      canvas.removeEventListener("pointerup", pointerEnd);
      canvas.removeEventListener("pointercancel", pointerEnd);
      canvas.removeEventListener("lostpointercapture", pointerEnd);
      canvas.removeEventListener("click", pick);
      canvas.removeEventListener("keydown", key);
      canvas.remove();
      labelControl.remove();
    },
  };
}
