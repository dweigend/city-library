import { isDiffusionSnapshot, isExchangeSnapshot, type LabSnapshot } from "../application/session.ts";
import { element, output } from "./elements.ts";

export function renderInspector(state: LabSnapshot) {
  const diffusion = isDiffusionSnapshot(state);
  const exchange = isExchangeSnapshot(state);
  for (const item of document.querySelectorAll<HTMLElement>("[data-diffusion]")) item.hidden = !diffusion;
  for (const item of document.querySelectorAll<HTMLElement>("[data-legacy]")) item.hidden = diffusion;
  for (const selector of ["#diffusion-actions", "#diffusion-summary", "#contact-count-wrap"]) element(selector, HTMLElement).hidden = !diffusion;
  for (const selector of ["#total-energy-wrap", "#energy-range-wrap"]) element(selector, HTMLElement).hidden = !exchange;
  element("#seed-wrap", HTMLElement).hidden = !diffusion && !exchange;
  output("#identity", state.id);
  output("#tick", state.tick);
  output("#count", state.agentCount);
  const disabled = !diffusion && !exchange && (!state.alive || !state.attached);
  for (const selector of ["#one-step", "#five-steps", "#hundred-steps", "#fail"]) element(selector, HTMLButtonElement).disabled = disabled;
  if (diffusion) {
    output("#diffusion-state", state.state);
    output("#community", state.community + 1);
    output("#degree", state.degree);
    output("#contact-count", state.contactCount);
    output("#current-seed", state.parameters.seed);
    output("#unaware-count", state.counts.unaware);
    output("#active-count", state.counts.active);
    output("#settled-count", state.counts.settled);
    element("#activate-selected", HTMLButtonElement).disabled = state.state !== "unaware";
    const bridges = element("#bridges", HTMLInputElement);
    bridges.checked = state.parameters.bridges;
    bridges.disabled = state.parameters.topology !== "communities";
    element("#run-model", HTMLButtonElement).disabled = state.done;
    element("#execution-target", HTMLParagraphElement).textContent = state.done
      ? state.counts.unaware > 0 ? "Cascade complete. Activate an unaware agent to continue." : "Cascade complete. Create a new model to restart."
      : "Synchronous spread along existing contacts.";
    return;
  }
  output("#energy", state.energy);
  output("#alive", state.alive ? "Alive" : "Deleted");
  output("#membership", state.attached ? "Attached" : "Detached");
  output("#position", `${state.x}, ${state.y} · ${state.heading}°`);
  if (exchange) {
    output("#total-energy", state.totalEnergy);
    output("#energy-range", `${state.minimumEnergy}–${state.maximumEnergy}`);
    output("#current-seed", state.seed);
  }
  const attach = element("#membership-action", HTMLButtonElement);
  attach.textContent = state.attached ? "Detach" : "Attach";
  for (const selector of ["#membership-action", "#copy", "#delete"]) element(selector, HTMLButtonElement).disabled = !state.alive;
  element("#execution-target", HTMLParagraphElement).textContent = exchange ? "Steps apply to the population." : "Steps apply to the selected agent.";
}
