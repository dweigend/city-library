import type { NetworkObservation } from "./projection.ts";

/** Deterministic display coordinates only; these never become Agent positions. */
export function displayPositions(observation: NetworkObservation): ReadonlyMap<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const groups = observation.layout === "communities" ? [0, 1, 2] : [0];
  const communityRadius = Math.max(95, ...groups.map((group) => observation.nodes.filter((node) => node.community === group).length * 8));
  for (const group of groups) {
    const members = observation.nodes.filter((node) => observation.layout !== "communities" || node.community === group);
    const radius = Math.max(95, members.length * 8);
    members.forEach((node, index) => {
      if (observation.layout === "grid") {
        positions.set(node.id, { x: (index % 6) * 100, y: Math.floor(index / 6) * 100 });
        return;
      }
      const hub = observation.layout === "hub";
      if (hub && index === 0) { positions.set(node.id, { x: 0, y: 0 }); return; }
      const angle = (index - (hub ? 1 : 0)) * Math.PI * 2 / Math.max(1, members.length - (hub ? 1 : 0)) - Math.PI / 2;
      const center = observation.layout === "communities"
        ? { x: group * communityRadius * 1.6, y: group === 1 ? communityRadius * 1.6 : 0 }
        : { x: 0, y: 0 };
      const localRadius = observation.layout === "communities" ? communityRadius : radius;
      positions.set(node.id, { x: center.x + Math.cos(angle) * localRadius, y: center.y + Math.sin(angle) * localRadius });
    });
  }
  return positions;
}
