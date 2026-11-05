import type { Cell, GridData, SpatialData } from "../definition.ts";

export function mountCanvas(
  container: HTMLElement,
  select: (id: string) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.className = "world";
  canvas.tabIndex = 0;
  container.append(canvas);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable.");
  const ctx = context;
  let latest: GridData | SpatialData | undefined;
  let pixelWidth = 400;
  let selected: string | null = null;
  let showLabels = false;
  const labelControl = document.createElement("label");
  labelControl.className = "view-labels";
  const labels = document.createElement("input");
  labels.type = "checkbox";
  labelControl.append(labels, "Labels");
  labelControl.hidden = true;
  container.insertBefore(labelControl, canvas);
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
    ctx.fillStyle = "#151515";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const cell of data.cells ?? [])
      drawCell(cell, data.width, data.height);
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
        ctx.fillStyle = agent.color ?? "#fff";
        ctx.beginPath();
        if (agent.shape === "triangle") {
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size * 0.35, size * 0.35);
          ctx.lineTo(-size * 0.35, size * 0.35);
          ctx.closePath();
        } else ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (agent.id === selected) {
          ctx.strokeStyle = "#fbbf24";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
        if (showLabels && agent.label) {
          ctx.font = `${12 * Math.min(devicePixelRatio, 2)}px system-ui, sans-serif`;
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#151515";
          ctx.fillStyle = "#fff";
          ctx.strokeText(agent.label, x + size, y - size);
          ctx.fillText(agent.label, x + size, y - size);
        }
      }
  }
  function resizeBuffer() {
    const height = pixelWidth * (latest ? latest.height / latest.width : 1);
    if (canvas.width !== Math.round(pixelWidth))
      canvas.width = Math.round(pixelWidth);
    if (canvas.height !== Math.round(height))
      canvas.height = Math.round(height);
  }
  const resize = new ResizeObserver((entries) => {
    pixelWidth =
      Math.max(1, entries[0]?.contentRect.width ?? 200) *
      Math.min(devicePixelRatio, 2);
    resizeBuffer();
    draw();
  });
  resize.observe(canvas);
  function pick(event: MouseEvent) {
    const data = latest;
    if (!data) return;
    const rect = canvas.getBoundingClientRect();
    const x =
      ((event.clientX - rect.left) / rect.width) * data.width - data.width / 2;
    const y =
      data.height / 2 -
      ((event.clientY - rect.top) / rect.height) * data.height;
    if ("agents" in data) {
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
  canvas.addEventListener("click", pick);
  canvas.setAttribute("role", "group");
  canvas.setAttribute("aria-label", "Model view. Arrow keys select an item.");
  function key(event: KeyboardEvent) {
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
      "agents" in latest && latest.agents.length
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
    update(data: GridData | SpatialData, id: string | null) {
      latest = data;
      canvas.style.aspectRatio = `${data.width} / ${data.height}`;
      resizeBuffer();
      selected = id;
      labelControl.hidden =
        !("agents" in data) ||
        !data.agents.some((agent) => Boolean(agent.label));
      canvas.setAttribute(
        "aria-label",
        `Model view. ${"agents" in data ? data.agents.length + " agents" : data.cells.length + " cells"}. Arrow keys select an item.${id ? " Selected " + id : ""}`,
      );
      draw();
    },
    dispose() {
      resize.disconnect();
      canvas.removeEventListener("click", pick);
      canvas.removeEventListener("keydown", key);
      canvas.remove();
      labelControl.remove();
    },
  };
}
