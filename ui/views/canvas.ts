import type { RendererOptions } from "./appearance.ts";
import { validateCanvasData } from "./spatial-data.ts";
import { canvasPoint, isPointInSceneSymbol, symbolDiameter, symbolDimensions, symbolRotation, validateBufferDimensions, validateCanvasGeometry } from "./spatial-geometry.ts";
import { traceSymbolPath } from "./spatial-symbols.ts";
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
  let resizeFrame: number | undefined;
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
  /** Cell edges snap to whole buffer pixels, so neighbours tile without seams or overlap. */
  function drawCell(cell: Cell, width: number, height: number) {
    const left = Math.round(((cell.x + width / 2 - 0.5) / width) * canvas.width);
    const right = Math.round(((cell.x + width / 2 + 0.5) / width) * canvas.width);
    const top = Math.round(((height / 2 - cell.y - 0.5) / height) * canvas.height);
    const bottom = Math.round(((height / 2 - cell.y + 0.5) / height) * canvas.height);
    ctx.fillStyle = cell.color;
    ctx.fillRect(left, top, Math.max(1, right - left), Math.max(1, bottom - top));
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
        const from = canvasPoint(segment.from, data, canvas);
        const to = canvasPoint(segment.to, data, canvas);
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }
      ctx.restore();
    }
    if ("agents" in data)
      for (const agent of data.agents) {
        const { x, y } = canvasPoint(agent, data, canvas);
        const ratio = Math.min(devicePixelRatio, 2);
        const size = symbolDiameter(agent, ratio);
        const { width, height } = symbolDimensions(agent, data, canvas, ratio);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(symbolRotation(agent));
        ctx.fillStyle = agent.color ?? theme?.foreground ?? "#fff";
        traceSymbolPath(ctx, agent, width, height);
        if (agent.filled !== false) ctx.fill();
        if ((agent.filled === false || agent.stroke !== undefined) && (agent.strokeWidth ?? 1) > 0) {
          ctx.strokeStyle = agent.stroke ?? theme?.foreground ?? "#fff";
          ctx.lineWidth = (agent.strokeWidth ?? 1) * ratio;
          ctx.stroke();
        }
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
    if ("agents" in data && data.labels) {
      ctx.save();
      ctx.font = theme?.font ?? `${12 * Math.min(devicePixelRatio, 2)}px system-ui, sans-serif`;
      ctx.fillStyle = theme?.foreground ?? "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const label of data.labels) {
        const { x, y } = canvasPoint(label, data, canvas);
        ctx.fillText(label.text, x, y);
      }
      ctx.restore();
    }
  }
  function prepareBuffer(data: GridData | SpatialData | undefined) {
    const aspect = data ? data.width / data.height : 1;
    const inverseAspect = data ? data.height / data.width : 1;
    if (!Number.isFinite(aspect) || aspect <= 0 || !Number.isFinite(inverseAspect) || inverseAspect <= 0)
      throw new RangeError("Canvas aspect ratio must remain finite and positive.");
    const width = options.theme
      ? Math.max(1, Math.min(availableWidth, displayHeightLimit * aspect)) * Math.min(devicePixelRatio, 2)
      : pixelWidth;
    const height = width * inverseAspect;
    if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0)
      throw new RangeError("Canvas buffer dimensions must remain finite and positive.");
    const buffer = { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)), pixelWidth: width };
    validateBufferDimensions(buffer);
    if (data) validateCanvasGeometry(data, buffer, Math.min(devicePixelRatio, 2));
    return buffer;
  }
  function resizeBuffer(buffer = prepareBuffer(latest)) {
    pixelWidth = buffer.pixelWidth;
    if (canvas.width !== buffer.width) canvas.width = buffer.width;
    if (canvas.height !== buffer.height) canvas.height = buffer.height;
  }
  const resize = new ResizeObserver((entries) => {
    if (disposed) return;
    const width = Math.max(1, entries[0]?.contentRect.width ?? 200);
    if (options.theme) {
      availableWidth = width;
      displayHeightLimit = parseFloat(getComputedStyle(canvas).maxHeight) || Infinity;
    } else pixelWidth = width * Math.min(devicePixelRatio, 2);
    // Intrinsic buffer dimensions can resize the observed parent. Write after
    // notification delivery so the browser can measure the new layout next frame.
    if (resizeFrame !== undefined) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = undefined;
      if (disposed) return;
      resizeBuffer();
      draw();
    });
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
      // Passenger dots drawn over cabin/slot rectangles remain selectable.
      // Scenes with only circular symbols retain their original nearest behavior.
      const hasDiagramShapes = data.agents.some(agent => agent.shape === "rectangle" || agent.shape === "diamond");
      const shaped = hasDiagramShapes ? [...data.agents].reverse().find(agent =>
        agent.selectable !== false && isPointInSceneSymbol(agent, x, y, data, canvas, Math.min(devicePixelRatio, 2))) : undefined;
      if (shaped) { select(shaped.id); return; }
      if (!hasDiagramShapes) {
        const nearest = data.agents.filter(agent => agent.selectable !== false).sort(
          (a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y),
        )[0];
        if (nearest && Math.hypot(nearest.x - x, nearest.y - y) < 2) {
          select(nearest.id);
          return;
        }
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
    const selectableAgents = !drawingEnabled && "agents" in latest
      ? latest.agents.filter(agent => agent.selectable !== false) : [];
    const items = selectableAgents.length ? selectableAgents : (latest.cells ?? []);
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
      validateCanvasData(data);
      const buffer = prepareBuffer(data);
      if (!drawing) stopDrawing();
      drawingEnabled = Boolean(intent) && drawing;
      setDrawingPresentation(drawingEnabled);
      latest = data;
      if (!options.theme) canvas.style.aspectRatio = `${data.width} / ${data.height}`;
      resizeBuffer(buffer);
      selected = id;
      labelControl.hidden =
        !("agents" in data) ||
        data.showLabels !== undefined ||
        !data.agents.some((agent) => Boolean(agent.label));
      canvas.setAttribute(
        "aria-label",
        `${"agents" in data && data.description ? data.description : `Model view. ${"agents" in data ? data.agents.length + " agents" : data.cells.length + " cells"}.`} Arrow keys select an item.${drawingEnabled ? " Space or Enter draws a cell." : ""}${id ? " Selected " + id : ""}`,
      );
      canvas.textContent = "agents" in data ? data.description ?? "" : "";
      draw();
    },
    stopDrawing,
    setLabels(value: boolean) { showLabels = value; draw(); },
    dispose() {
      if (disposed) return;
      disposed = true;
      stopDrawing();
      resize.disconnect();
      if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
      resizeFrame = undefined;
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
