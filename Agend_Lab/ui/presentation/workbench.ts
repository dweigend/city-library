import { isDiffusionSnapshot, type LabSession } from "../application/session.ts";
import { createPlayback } from "../application/playback.ts";
import { createAgentList } from "./agent-list.ts";
import { createNetworkView } from "../visualization/network-view.ts";
import { projectNetwork } from "../visualization/projection.ts";
import { element } from "./elements.ts";
import { renderInspector } from "./inspector.ts";
import { createSetup } from "./setup.ts";
import { createTrend } from "./trend.ts";

export function mountWorkbench(session: LabSession) {
  const events = new AbortController();
  const setup = createSetup();
  const status = element("#status", HTMLParagraphElement);
  const runButton = element("#run-model", HTMLButtonElement);
  const network = createNetworkView(element("#network-view", HTMLDivElement), select);
  const agentContainer = element("#agent-view", HTMLDivElement);
  const agentList = createAgentList(agentContainer, select);
  let renderedRevision: number | undefined;
  const trend = createTrend(element("#count-trend", SVGSVGElement));
  const playback = createPlayback(() => {
    if (!act(() => session.advance(1))) return false;
    const state = session.read();
    return isDiffusionSnapshot(state) && !state.done;
  }, (running) => {
    runButton.textContent = running ? "Pause" : "Run";
    runButton.setAttribute("aria-pressed", String(running));
    const state = session.read();
    if (!running && isDiffusionSnapshot(state) && state.done) status.textContent = "Cascade complete.";
  }, (tick) => {
    const timer = window.setInterval(tick, 150);
    return () => window.clearInterval(timer);
  });

  function render() {
    const state = session.read();
    renderInspector(state);
    agentList.render(state.agents);
    if (renderedRevision !== session.revision) agentContainer.scrollTop = 0;
    renderedRevision = session.revision;
    const observation = projectNetwork(state);
    network.render(observation, session.revision);
    element("#interaction", HTMLParagraphElement).textContent = observation.interactionLabel;
    if (isDiffusionSnapshot(state)) trend(state);
  }
  function act(action: () => void, message?: string) {
    try {
      action();
      if (message) { status.textContent = message; status.dataset.state = "success"; }
    } catch (error) {
      playback.stop();
      status.textContent = error instanceof Error ? error.message : "Action failed.";
      status.dataset.state = "error";
      render();
      return false;
    }
    render();
    return true;
  }
  function select(id: string) { act(() => session.select(id), "Agent selected."); }
  function newModel() { session.create(setup.selectedScenario(), setup.options()); }
  function on(selector: string, callback: () => void) {
    element(selector, HTMLButtonElement).addEventListener("click", callback, { signal: events.signal });
  }
  function modelAction(action: () => void, message: string) {
    playback.stop();
    act(action, message);
  }
  setup.form.addEventListener("submit", (event) => {
    event.preventDefault();
    playback.stop();
    if (setup.form.reportValidity()) act(newModel, "New model created.");
  }, { signal: events.signal });
  setup.scenario.addEventListener("change", () => {
    playback.stop();
    setup.show();
    if (setup.form.reportValidity()) act(newModel, "New model created.");
    else { status.textContent = "Fix the setup values, then choose New model. The running model is unchanged."; status.dataset.state = "error"; }
  }, { signal: events.signal });
  on("#run-model", () => {
    if (playback.running) { playback.stop(); status.textContent = "Paused."; status.dataset.state = "success"; return; }
    const state = session.read();
    if (!isDiffusionSnapshot(state) || state.done) return;
    status.textContent = "Running.";
    status.dataset.state = "success";
    playback.start();
  });
  on("#activate-selected", () => modelAction(() => session.seedSelected(), "Selected agent activated."));
  element("#bridges", HTMLInputElement).addEventListener("change", () => modelAction(() => session.setBridges(element("#bridges", HTMLInputElement).checked), "Community contacts updated."), { signal: events.signal });
  on("#one-step", () => modelAction(() => session.advance(1), "Completed one step."));
  on("#five-steps", () => modelAction(() => session.advance(5), "Completed five steps."));
  on("#hundred-steps", () => modelAction(() => session.advance(100), "Completed 100 steps."));
  on("#membership-action", () => modelAction(() => session.toggleMembership(), "Membership changed."));
  on("#copy", () => modelAction(() => session.copy(), "Selected a detached copy; the original stays in its World."));
  on("#delete", () => modelAction(() => session.delete(), "Selected agent deleted."));
  on("#fail", () => modelAction(() => session.failStep(), "Step completed."));
  on("#fit-network", () => network.fit());
  on("#reset-layout", () => network.resetLayout());
  setup.show();
  render();
  return () => { playback.stop(); events.abort(); agentList.destroy(); network.destroy(); };
}
