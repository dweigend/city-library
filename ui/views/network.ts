import cytoscape from "cytoscape";
import type { NetworkEdge, NetworkNode } from "../definition.ts";

export function mountNetwork(
  container: HTMLElement,
  select: (id: string) => void,
) {
  const canvas = document.createElement("div");
  canvas.className = "network";
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
    return (
      getComputedStyle(canvas).getPropertyValue("--muted").trim() || "#626262"
    );
  }
  cy.style([
    {
      selector: "node",
      style: {
        width: "data(size)",
        height: "data(size)",
        "background-color": "data(color)",
        label: "data(label)",
        "font-size": 11,
        "text-valign": "bottom",
        "text-margin-y": 5,
        color: labelTheme(),
      },
    },
    {
      selector: ".selected",
      style: { "border-width": 3, "border-color": "#b45309" },
    },
    {
      selector: "edge",
      style: { width: 1, "line-color": "#969696", opacity: 0.65 },
    },
  ]);
  let first = true;
  let fitted = true;
  let adjusting = false;
  let disposed = false;
  const appearance = window.matchMedia("(prefers-color-scheme: dark)");
  function updateTheme() {
    if (!disposed)
      cy.style().selector("node").style({ color: labelTheme() }).update();
  }
  appearance.addEventListener("change", updateTheme);
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
  container.insertBefore(actions, canvas);
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
      nodes: readonly NetworkNode[],
      edges: readonly NetworkEdge[],
      selected: string | null,
    ) {
      const ids = new Set(nodes.map((node) => node.id));
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
              position: {
                x: Math.cos(angle) * Math.sqrt(index + 1) * 34,
                y: Math.sin(angle) * Math.sqrt(index + 1) * 34,
              },
            });
          }
          element.data({
            label: nodes.length <= 80 ? (node.label ?? "") : "",
            color: node.color ?? "#48778a",
            size: node.size ?? 16,
          });
          element.toggleClass("selected", selected === node.id);
        }
        const edgeIds = new Set(edges.map((edge) => edge.id));
        cy.edges()
          .filter((edge) => !edgeIds.has(edge.id()))
          .remove();
        for (const edge of edges)
          if (cy.getElementById(edge.id).empty())
            cy.add({
              group: "edges",
              data: { id: edge.id, source: edge.from, target: edge.to },
            });
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
      canvas.setAttribute(
        "aria-label",
        `${nodes.length} nodes and ${edges.length} connections`,
      );
    },
    dispose() {
      disposed = true;
      appearance.removeEventListener("change", updateTheme);
      resize.disconnect();
      cy.destroy();
      actions.remove();
      canvas.remove();
    },
  };
}
