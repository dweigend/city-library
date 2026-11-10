import type { RendererOptions } from "./appearance.ts";
import cytoscape from "cytoscape";
import type { GraphEdgeData, GraphNodeData } from "../definition.ts";

export function mountNetwork(
  container: HTMLElement,
  select: (id: string) => void,
  options: RendererOptions = {},
) {
  const canvas = document.createElement("div");
  canvas.className = options.theme ? "model-network" : "network";
  container.append(canvas);
  const cy = cytoscape({
    container: canvas,
    elements: [],
    layout: { name: "preset" },
    minZoom: 0.1,
    maxZoom: 4,
    autounselectify: true,
  });
  function labelTheme() {
    if (options.theme) return options.theme().muted;
    return (
      getComputedStyle(canvas).getPropertyValue("--muted").trim() || "#626262"
    );
  }
  function edgeTheme() { return labelTheme(); }
  function surfaceTheme() { return options.theme?.().surface ?? "#f5f5f5"; }
  const labelPixels = options.theme ? parseFloat(getComputedStyle(container).fontSize) : 11;
  const labelGap = 4;
  cy.style([
    {
      selector: "node",
      style: {
        width: "data(size)",
        height: "data(size)",
        "background-color": "data(color)",
        label: "data(label)",
        "font-size": labelPixels,
        ...(options.theme ? { "font-family": getComputedStyle(container).fontFamily } : {}),
        "text-valign": "bottom",
        "text-margin-y": labelGap,
        // A thin halo keeps text legible where edges pass beneath it.
        "text-outline-width": 2,
        "text-outline-color": surfaceTheme(),
        "text-outline-opacity": 0.85,
        // Draw nodes and their labels above edges.
        "z-index": 10,
        color: labelTheme(),
      },
    },
    { selector: ".label-hidden", style: { label: "" } },
    {
      selector: ".selected",
      style: { label: "data(label)", "z-index": 20, "border-width": 3, "border-color": options.theme?.().selected ?? "#b45309" },
    },
    {
      selector: "edge",
      style: { width: "data(width)", "line-color": "data(color)", "target-arrow-color": "data(color)", "curve-style": "bezier", opacity: 0.65 },
    },
    {
      selector: "edge[directed = 1]",
      style: { "target-arrow-shape": "triangle", "arrow-scale": 1 },
    },
  ]);
  let first = true;
  let fitted = true;
  let adjusting = false;
  let disposed = false;
  const appearance = window.matchMedia("(prefers-color-scheme: dark)");
  let appliedTheme: string | undefined;
  function updateTheme() {
    if (disposed) return;
    const label = labelTheme();
    const selected = options.theme?.().selected ?? "#b45309";
    const key = `${label}\n${selected}\n${surfaceTheme()}`;
    if (key === appliedTheme) return;
    cy.style().selector("node").style({ color: label, "text-outline-color": surfaceTheme() }).selector(".selected").style({ "border-color": selected }).update();
    cy.edges().filter(edge => edge.data("defaultColor")).data("color", label);
    appliedTheme = key;
  }
  function appearanceChanged() {
    // A host refresh may run in a later media-listener task; update() also reapplies tokens.
    if (options.theme) queueMicrotask(updateTheme);
    else updateTheme();
  }
  appearance.addEventListener("change", appearanceChanged);
  cy.on("tap", "node", (event) => select(event.target.id()));
  function fit() {
    if (!disposed) {
      adjusting = true;
      try {
        cy.resize();
        cy.fit(undefined, 30);
        if (cy.zoom() > 1.5) {
          cy.zoom(1.5);
          cy.center();
        }
      } finally {
        adjusting = false;
      }
      fitted = true;
    }
  }
  cy.on("pan zoom", () => {
    if (!adjusting) fitted = false;
  });
  /**
   * Labels keep a constant screen size. Where labels would overlap, only the label
   * of the selected node, then of larger nodes, stays visible; zooming in reveals more.
   */
  let labelFrame: number | undefined;
  function scheduleLabels() {
    if (labelFrame !== undefined || disposed) return;
    labelFrame = requestAnimationFrame(() => {
      labelFrame = undefined;
      if (!disposed) arrangeLabels();
    });
  }
  function arrangeLabels() {
    const zoom = cy.zoom();
    cy.batch(() => {
      cy.nodes().style({ "font-size": labelPixels / zoom, "text-margin-y": labelGap / zoom });
      cy.nodes().removeClass("label-hidden");
    });
    const labelled = cy.nodes().filter(node => Boolean(node.data("label")));
    const ordered = labelled.sort((a, b) =>
      Number(b.hasClass("selected")) - Number(a.hasClass("selected")) || b.data("size") - a.data("size"));
    type Box = { x1: number; x2: number; y1: number; y2: number };
    const margin = 2 / zoom;
    const intersects = (box: Box, other: Box) =>
      box.x1 - margin < other.x2 && box.x2 + margin > other.x1 && box.y1 - margin < other.y2 && box.y2 + margin > other.y1;
    // Node symbols are obstacles too, so a label never covers another node.
    const bodies = cy.nodes().map(node => ({ id: node.id(), box: node.boundingBox({ includeLabels: false }) as Box }));
    const kept: Box[] = [];
    const hidden: string[] = [];
    ordered.forEach(node => {
      const box = node.boundingBox({ includeNodes: false, includeEdges: false, includeLabels: true }) as Box;
      const isCovered = kept.some(other => intersects(box, other))
        || bodies.some(body => body.id !== node.id() && intersects(box, body.box));
      if (isCovered && !node.hasClass("selected")) hidden.push(node.id());
      else kept.push(box);
    });
    cy.batch(() => { for (const id of hidden) cy.getElementById(id).addClass("label-hidden"); });
  }
  cy.on("zoom", scheduleLabels);
  cy.on("dragfree layoutstop", scheduleLabels);
  function layout() {
    if (!disposed) {
      cy.layout({
        name: "cose",
        animate: false,
        randomize: false,
        fit: true,
        nodeRepulsion: () => 8000,
      }).run();
    }
  }
  const actions = document.createElement("div");
  actions.className = "view-actions";
  for (const [label, action] of [
    ["Fit", fit],
    ["Layout", layout],
  ] as const) {
    const button = document.createElement("button");
    button.textContent = label;
    button.type = "button";
    button.addEventListener("click", action);
    actions.append(button);
  }
  if (options.controls !== false) container.insertBefore(actions, canvas);
  const chooser = document.createElement("select");
  chooser.setAttribute("aria-label", "Select network node");
  actions.append(chooser);
  let nodeIds = "";
  chooser.addEventListener("change", () => {
    if (chooser.value) select(chooser.value);
  });
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const keepFitted = fitted;
    adjusting = true;
    try {
      cy.resize();
    } finally {
      adjusting = false;
    }
    if (keepFitted) fit();
  });
  resize.observe(canvas);
  return {
    update(
      nodes: readonly GraphNodeData[],
      edges: readonly GraphEdgeData[],
      selected: string | null,
    ) {
      // Validate the complete projection before touching the currently displayed graph.
      const ids = new Set<string>();
      for (const node of nodes) {
        if (!node.id || ids.has(node.id)) throw new Error("Network node IDs must be nonempty and unique.");
        ids.add(node.id);
        if (node.size !== undefined && (!Number.isFinite(node.size) || node.size <= 0))
          throw new Error("Network node size must be positive and finite.");
        if (node.position && (!Number.isFinite(node.position.x) || !Number.isFinite(node.position.y)))
          throw new Error("Network presentation coordinates must be finite.");
        if (node.color !== undefined && !CSS.supports("color", node.color)) throw new Error("Invalid network node color.");
      }
      const edgeIds = new Set<string>();
      for (const edge of edges) {
        if (!edge.id || ids.has(edge.id) || edgeIds.has(edge.id)) throw new Error("Network edge IDs must be nonempty and unique.");
        edgeIds.add(edge.id);
        if (!ids.has(edge.from) || !ids.has(edge.to)) throw new Error("Network edge endpoints must exist.");
        if (edge.width !== undefined && (!Number.isFinite(edge.width) || edge.width <= 0))
          throw new Error("Network edge width must be positive and finite.");
        if (edge.color !== undefined && !CSS.supports("color", edge.color)) throw new Error("Invalid network edge color.");
      }
      // The host resolves theme tokens before updating the projection. Media listeners
      // can run in separate tasks, so their earlier microtask may still see old tokens.
      updateTheme();
      const defaultEdgeColor = edgeTheme();
      cy.batch(() => {
        cy.nodes()
          .filter((node) => !ids.has(node.id()))
          .remove();
        for (const [index, node] of nodes.entries()) {
          let element = cy.getElementById(node.id);
          if (element.empty()) {
            const angle = index * 2.399963229728653;
            element = cy.add({
              group: "nodes",
              data: { id: node.id },
              position: node.position ?? {
                x: Math.cos(angle) * Math.sqrt(index + 1) * 34,
                y: Math.sin(angle) * Math.sqrt(index + 1) * 34,
              },
            });
          }
          element.data({
            label: nodes.length <= 80 ? (node.label ?? "") : "",
            color: node.color ?? options.theme?.().node ?? "#48778a",
            size: node.size ?? 16,
          });
          element.toggleClass("selected", selected === node.id);
        }
        cy.edges()
          .filter((edge) => !edgeIds.has(edge.id()))
          .remove();
        for (const edge of edges) {
          let element = cy.getElementById(edge.id);
          if (element.nonempty() && (element.source().id() !== edge.from || element.target().id() !== edge.to)) {
            element.remove();
            element = cy.getElementById(edge.id);
          }
          if (element.empty()) element = cy.add({ group: "edges", data: { id: edge.id, source: edge.from, target: edge.to } });
          element.data({ directed: edge.directed ? 1 : 0, color: edge.color ?? defaultEdgeColor, defaultColor: edge.color === undefined, width: edge.width ?? 1 });
        }
      });
      const nextIds = nodes.map((node) => node.id).join("\n");
      if (nextIds !== nodeIds) {
        nodeIds = nextIds;
        chooser.replaceChildren(new Option("Inspect node", ""));
        for (const [index, node] of nodes.entries())
          chooser.add(new Option(node.label ?? `Node ${index + 1}`, node.id));
      }
      chooser.value = selected ?? "";
      if ((first || fitted) && nodes.length) {
        first = false;
        fit();
      }
      scheduleLabels();
      canvas.setAttribute(
        "aria-label",
        `${nodes.length} nodes and ${edges.length} connections`,
      );
    },
    fit,
    layout,
    dispose() {
      if (disposed) return;
      disposed = true;
      if (labelFrame !== undefined) cancelAnimationFrame(labelFrame);
      appearance.removeEventListener("change", appearanceChanged);
      resize.disconnect();
      cy.destroy();
      actions.remove();
      canvas.remove();
    },
  };
}
