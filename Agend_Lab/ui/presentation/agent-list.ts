import type { LabSnapshot } from "../application/session.ts";

type AgentObservation = LabSnapshot["agents"][number];

/** Native button alternative to canvas picking; owns only keyed elements and focus. */
export function createAgentList(container: HTMLElement, select: (id: string) => void) {
  const markers = new Map<string, HTMLButtonElement>();
  function markerFor(agent: AgentObservation) {
    const existing = markers.get(agent.id);
    if (existing) return existing;
    const marker = document.createElement("button");
    marker.type = "button";
    marker.className = "agent-marker";
    marker.dataset.agentId = agent.id;
    marker.innerHTML = '<span class="marker-label"></span><span class="marker-energy"></span><span class="marker-state"></span>';
    const id = agent.id;
    marker.onclick = () => select(id);
    markers.set(id, marker);
    container.append(marker);
    return marker;
  }
  return {
    render(agents: readonly AgentObservation[]) {
      const ids = new Set(agents.map((agent) => agent.id));
      for (const [id, marker] of markers) {
        if (ids.has(id)) continue;
        marker.onclick = null;
        marker.remove();
        markers.delete(id);
      }
      agents.forEach((agent, index) => {
        const marker = markerFor(agent);
        const diffusion = "state" in agent;
        const state = diffusion ? agent.state : !agent.alive ? "Deleted" : agent.attached ? "Attached" : "Detached";
        const label = "label" in agent ? agent.label : `Agent ${index + 1}`;
        const active = diffusion ? agent.state === "active" : "active" in agent && agent.active;
        const value = diffusion ? `Group ${agent.community + 1} · degree ${agent.degree}` : `Energy ${agent.energy}`;
        marker.dataset.alive = String(agent.alive);
        marker.dataset.attached = String(agent.attached);
        marker.dataset.active = String(active);
        marker.dataset.diffusionState = diffusion ? agent.state : "";
        marker.setAttribute("aria-pressed", String(agent.selected));
        marker.setAttribute("aria-label", `${label}, ${value}, ${state.toLowerCase()}${agent.selected ? ", selected" : ""}`);
        marker.title = agent.id;
        marker.querySelector(".marker-label")!.textContent = label;
        marker.querySelector(".marker-energy")!.textContent = value;
        marker.querySelector(".marker-state")!.textContent = state;
      });
    },
    destroy() {
      for (const marker of markers.values()) marker.onclick = null;
      markers.clear();
      container.replaceChildren();
    },
  };
}
