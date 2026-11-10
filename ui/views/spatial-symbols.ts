import type { SpatialAgent } from "../definition.ts";

/** Build a centered path; context translation/rotation and paint stay with canvas. */
export function symbolPath(context: CanvasRenderingContext2D, agent: SpatialAgent, width: number, height: number) {
  context.beginPath();
  if (agent.shape === "triangle") {
    context.moveTo(0, -height / 2);
    context.lineTo(width * 0.35, height * 0.35);
    context.lineTo(-width * 0.35, height * 0.35);
    context.closePath();
  } else if (agent.shape === "rectangle") {
    context.rect(-width / 2, -height / 2, width, height);
  } else if (agent.shape === "diamond") {
    context.moveTo(0, -height / 2);
    context.lineTo(width / 2, 0);
    context.lineTo(0, height / 2);
    context.lineTo(-width / 2, 0);
    context.closePath();
  } else context.arc(0, 0, width / 2, 0, Math.PI * 2);
}
