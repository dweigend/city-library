import cytoscape from "cytoscape";
import type { NetworkObservation } from "./projection.ts";
import { displayPositions } from "./layout.ts";

/** The only Cytoscape adapter. It owns display positions, viewport and renderer resources. */
export function createNetworkView(container: HTMLElement, select: (id: string) => void) {
  const cy = cytoscape({
    container,
    elements: [],
    layout: { name: "preset" },
    minZoom: 0.03,
    maxZoom: 3,
    boxSelectionEnabled: false,
    autounselectify: true,
  });
  let latest: NetworkObservation | undefined;
  let revision: number | undefined;
  let destroyed = false;
  let fitted = true;
  let adjustingViewport = false;

  function fit() {
    if (destroyed) return;
    adjustingViewport = true;
    try { cy.fit(undefined, 38); }
    finally { adjustingViewport = false; }
    fitted = true;
  }
  cy.on("pan zoom", () => { if (!adjustingViewport) fitted = false; });

  function theme() {
    const colors = getComputedStyle(container);
    const text = colors.getPropertyValue("--text").trim();
    const surface = colors.getPropertyValue("--view").trim();
    const active = colors.getPropertyValue("--active").trim();
    const muted = colors.getPropertyValue("--unaware").trim();
    const spreading = colors.getPropertyValue("--spreading").trim();
    const settled = colors.getPropertyValue("--settled").trim();
    const edge = colors.getPropertyValue("--edge").trim();
    cy.style([
      { selector: "node", style: {
        "background-color": text, "border-color": text, "border-width": 0,
        "width": 34, "height": 34, "label": "data(caption)", "font-size": 13,
        "color": text, "text-valign": "bottom", "text-margin-y": 8,
        "text-wrap": "wrap", "text-max-width": "110px", "font-family": "system-ui, sans-serif",
      } },
      { selector: ".active", style: { "background-color": active } },
      { selector: ".detached", style: { "background-color": surface, "border-width": 2, "border-style": "dashed" } },
      { selector: ".deleted", style: { "opacity": 0.4 } },
      { selector: ".inspected", style: { "underlay-color": active, "underlay-opacity": 0.22, "underlay-padding": 8 } },
      { selector: "node.diffusion", style: { "width": 25, "height": 25, "text-opacity": 0, "font-size": 14, "background-color": muted } },
      { selector: "node.diffusion.active", style: { "background-color": spreading } },
      { selector: "node.diffusion.settled", style: { "background-color": settled } },
      { selector: "node.inspected, node.hovered", style: { "text-opacity": 1, "z-index": 10, "border-width": 2, "border-color": text } },
      { selector: "edge", style: { "line-color": edge, "width": 1.3, "opacity": 0.5, "curve-style": "bezier" } },
      { selector: "edge.bridge", style: { "line-color": active, "width": 3, "opacity": 0.9, "line-style": "dashed" } },
      { selector: "edge.transient", style: { "line-color": active, "width": 3, "opacity": 1, "line-style": "dashed" } },
    ]);
  }
  theme();
  const scheme = window.matchMedia("(prefers-color-scheme: dark)");
  scheme.addEventListener("change", theme);
  cy.on("tap", "node", (event) => select(event.target.id()));
  cy.on("mouseover", "node", (event) => event.target.addClass("hovered"));
  cy.on("mouseout", "node", (event) => event.target.removeClass("hovered"));

  function resetLayout() {
    if (destroyed) return;
    if (!latest) return;
    const positions = displayPositions(latest);
    cy.nodes().positions((node) => positions.get(node.id()) ?? { x: 0, y: 0 });
    fit();
  }
  const resize = new ResizeObserver(() => {
    if (destroyed) return;
    const keepFitted = fitted;
    cy.resize();
    // Preserve an intentional camera adjustment, but keep fitted views visible on rotation.
    if (keepFitted) fit();
  });
  resize.observe(container);

  return {
    render(observation: NetworkObservation, modelRevision: number) {
      if (destroyed) return;
      latest = observation;
      const fresh = revision !== modelRevision;
      revision = modelRevision;
      let added = false;
      cy.batch(() => {
        if (fresh) cy.elements().remove();
        const nodes = new Set(observation.nodes.map((node) => node.id));
        cy.nodes().filter((node) => !nodes.has(node.id())).remove();
        const edges = new Set(observation.edges.map((edge) => edge.id));
        cy.edges().filter((edge) => !edges.has(edge.id())).remove();
        for (const [index, node] of observation.nodes.entries()) {
          let element = cy.getElementById(node.id);
          if (element.empty()) {
            element = cy.add({ group: "nodes", data: { id: node.id }, position: { x: (index % 6) * 110, y: Math.floor(index / 6) * 110 } });
            added = true;
          }
          element.data({ caption: node.state ? `${node.label}\n${node.state}` : `${node.label}\nEnergy ${node.energy}` });
          element.classes([
            node.active && !node.state ? "active" : "", node.attached ? "" : "detached",
            node.alive ? "" : "deleted", node.selected ? "inspected" : "",
            node.state ? "diffusion" : "", node.state ?? "", element.hasClass("hovered") ? "hovered" : "",
          ].filter(Boolean).join(" "));
        }
        for (const edge of observation.edges) {
          if (cy.getElementById(edge.id).empty()) cy.add({ group: "edges", data: { ...edge } });
          cy.getElementById(edge.id).classes(edge.kind === "bridge" ? "bridge" : edge.kind === "contact" ? "contact" : "transient");
        }
      });
      if (fresh) resetLayout();
      else if (added) fit();
      container.setAttribute("aria-label", `${observation.nodes.length} agents. ${observation.interactionLabel}. Non-spatial layout; use the agent list for keyboard selection.`);
    },
    fit,
    resetLayout,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      resize.disconnect();
      scheme.removeEventListener("change", theme);
      cy.destroy();
    },
  };
}
