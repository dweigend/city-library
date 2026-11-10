import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Fixed presentation positions follow the observed path, not a new road network. */
export function scene(state: Observation<typeof model>): SpatialData {
  const points = new Map(state.nodes.map((node, index) => [node.id, { x: index * 4 - 6, y: 0 }]));
  const agents: SpatialAgent[] = state.nodes.map(node => ({ id: node.id, ...points.get(node.id)!, size: 10,
    filled: false, stroke: scientificPalette.neutral }));
  for (const call of state.calls) {
    const node = state.nodes.find(node => node.label === call.location)!;
    const point = points.get(node.id)!;
    const completed = call.completed >= 0;
    const active = call.status === "granted";
    agents.push({ id: `call:${call.number}`, x: point.x, y: 2, shape: "diamond", size: 16,
      filled: !completed, color: active ? scientificPalette.active : scientificPalette.waiting,
      stroke: completed ? scientificPalette.completed : scientificPalette.neutral, strokeWidth: call.priority === 0 ? 2 : 1 });
    if (active) agents.push({ id: `team:${call.number}`, x: point.x + 0.9, y: 1.9, shape: "triangle", size: 13, color: scientificPalette.active });
  }
  for (let team = 0; team < Math.max(0, state.parameters.responderCount - state.busyResponderCount); team++) agents.push({ id: `idle-team:${team}`, x: -6 + team * 0.8, y: -2,
    shape: "triangle", size: 13, color: scientificPalette.neutral });
  return { width: 18, height: 9, showLabels: false, agents,
    segments: state.edges.map(edge => ({ from: points.get(edge.from)!, to: points.get(edge.to)!, color: scientificPalette.neutral })),
    labels: [...state.nodes.map(node => ({ ...points.get(node.id)!, y: -0.8, text: node.label })),
      ...state.calls.flatMap(call => {
        const x = points.get(state.nodes.find(node => node.label === call.location)!.id)!.x;
        return [{ x, y: 3, text: `Call ${call.number} · p${call.priority}` },
          { x, y: 3.8, text: call.completed >= 0 ? "done" : call.status === "waiting" ? "waiting" : "assigned" }];
      }),
      { x: -6, y: -3, text: "Available teams" }],
    description: `Four-node access path; three diamond calls, ${state.waitingCallCount} waiting, ${state.completedCallCount} completed, ${state.busyResponderCount} assigned triangle teams. Lower priority number is served first among waiting calls. Team placement marks assignment, not a physical travel position.` };
}
