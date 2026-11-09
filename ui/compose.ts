import { tablePage } from "./views/table-page.ts";
import type { MonitorSpec, RuntimeSpec } from "./authoring.ts";
import type { LegacyLiveField } from "./definition.ts";
import { normalizeAuthoring, groupLive, decodeControl } from "./authoring.ts";
import type { Definition } from "../experiments/definition.ts";
import type {
  BoundEntry,
  ModelInstance,
  Snapshot,
  UISpec,
} from "./definition.ts";
import { createForm, type Descriptor } from "./controls/form.ts";
import { mountNetwork } from "./views/network.ts";
import { mountCanvas } from "./views/canvas.ts";
import { mountChart } from "./views/chart.ts";
import { createPlayback } from "./playback.ts";
import { createRepeatedAction } from "./actions/repeat.ts";

/** Concrete model types stay here; only the bound mounted handle enters the catalog. */
export function defineUI<P extends object, M>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: Omit<UISpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>, 'live' | 'change'> & {
    readonly change?: undefined;
    readonly live?: readonly LegacyLiveField<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>[];
  },
): BoundEntry;
export function defineUI<P extends object, M>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: UISpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>,
): BoundEntry;
export function defineUI<
  P extends object,
  M,
  const T extends NonNullable<RuntimeSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>['monitors']>,
>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: Omit<MonitorSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>, T>, 'live' | 'change'> & {
    readonly change?: undefined;
    readonly live?: readonly LegacyLiveField<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>[];
  },
): BoundEntry;
export function defineUI<
  P extends object,
  M,
  const T extends NonNullable<RuntimeSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>['monitors']>,
>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: MonitorSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>, T>,
): BoundEntry;
export function defineUI<P extends object, M extends ModelInstance>(
  definition: Definition<P, M>,
  sourceSpec: RuntimeSpec<P, M>,
): BoundEntry {
  return {
    title: definition.title,
    description: definition.description,
    mount(container) {
      const spec = normalizeAuthoring(definition, sourceSpec);
      const events = new AbortController();
      const setup = createForm(definition, spec);
      const controls = document.createElement("aside");
      controls.className = "controls";
      controls.append(setup.form);
      const actionBar = document.createElement("div");
      actionBar.className = "actions";
      controls.append(actionBar);
      const monitors = document.createElement("dl");
      monitors.className = "monitors";
      controls.append(monitors);
      const status = document.createElement("p");
      status.className = "status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.textContent = "Choose setup values, then Setup.";
      controls.append(status);
      const viewRoot = document.createElement("div");
      viewRoot.className = "views";
      const workbench = document.createElement("div");
      workbench.className = "workbench";
      workbench.append(controls, viewRoot);
      container.append(workbench);
      let instance: M | undefined;
      let selected: string | null = null;
      let disposed = false;
      let speed = 100;
      let drawingRequested = false;
      let drawingToggle: HTMLButtonElement | undefined;
      const repeats: { stop(): void; sync(): void }[] = [];
      function stopRepeats() { for (const repeat of repeats) repeat.stop(); }
      const views: {
        render: (state: Snapshot<M>) => void;
        dispose: () => void;
        stopDrawing?: () => void;
      }[] = [];
      const buttons: {
        element: HTMLButtonElement;
        enabled?: (state: Snapshot<M>, selected: string | null) => boolean;
        pressed?: (state: Snapshot<M>) => boolean;
        stepping?: boolean;
      }[] = [];
      const liveControls: {
        control: HTMLInputElement | HTMLSelectElement;
        value: (state: Snapshot<M>) => string | number | boolean;
        enabled?: (state: Snapshot<M>) => boolean;
      }[] = [];
      function read(model: M) {
        return model.read() as Snapshot<M>;
      }
      function errorMessage(error: unknown) {
        return error instanceof Error ? error.message : String(error);
      }
      function resetDrawing() {
        drawingRequested = false;
        drawingToggle?.setAttribute("aria-pressed", "false");
        for (const view of views) view.stopDrawing?.();
      }
      function fail(error: unknown) {
        playback.stop();
        stopRepeats();
        resetDrawing();
        status.textContent = errorMessage(error);
        status.dataset.state = "error";
        status.setAttribute("role", "alert");
      }
      function completed(state: Snapshot<M>) {
        return spec.complete?.(state) ?? false;
      }
      function render(state = instance ? read(instance) : undefined) {
        if (state === undefined) return;
        monitors.replaceChildren();
        for (const monitor of spec.monitors ?? []) {
          const title = document.createElement("dt");
          title.textContent = monitor.label;
          const value = document.createElement("dd");
          const observed = monitor.value(state);
          value.textContent = monitor.format ? monitor.format(observed) : String(observed);
          monitors.append(title, value);
        }
        for (const button of buttons) {
          button.element.disabled =
            !instance ||
            (button.stepping && completed(state)) ||
            !(button.enabled?.(state, selected) ?? true);
          if (button.pressed)
            button.element.setAttribute(
              "aria-pressed",
              String(button.pressed(state)),
            );
        }
        for (const live of liveControls) {
          const value = live.value(state);
          if (
            live.control instanceof HTMLInputElement &&
            live.control.type === "checkbox"
          )
            live.control.checked = Boolean(value);
          else live.control.value = String(value);
          live.control.disabled = !(live.enabled?.(state) ?? true);
        }
        if (spec.drawing && !spec.drawing.enabled(state)) {
          drawingRequested = false;
          drawingToggle?.setAttribute("aria-pressed", "false");
        }
        for (const view of views) view.render(state);
        for (const repeat of repeats) repeat.sync();
      }
      function act(action: (model: M) => void, message: string) {
        if (!instance || disposed) return false;
        try {
          action(instance);
          const state = read(instance);
          status.textContent = completed(state) ? "Completed." : message;
          status.dataset.state = "success";
          status.setAttribute("role", "status");
          render(state);
          return true;
        } catch (error) {
          fail(error);
          try {
            render();
          } catch {
            /* Keep the primary phase error visible. */
          }
          return false;
        }
      }
      const playback = createPlayback(
        () => {
          if (!instance) return false;
          try {
            if (completed(read(instance))) return false;
            if (!act((model) => model.advance(1), "Running.")) return false;
            return instance !== undefined && !completed(read(instance));
          } catch (error) {
            fail(error);
            return false;
          }
        },
        (running) => {
          run.textContent = running ? "Pause" : "Run";
          run.setAttribute("aria-pressed", String(running));
        },
        (tick) => {
          const id = window.setInterval(tick, speed);
          return () => window.clearInterval(id);
        },
      );
      function button(label: string, action: () => void) {
        const element = document.createElement("button");
        element.type = "button";
        element.textContent = label;
        element.disabled = true;
        element.addEventListener("click", action, { signal: events.signal });
        actionBar.append(element);
        return element;
      }
      const run = button("Run", () => {
        if (playback.running) {
          playback.stop();
          status.textContent = "Paused.";
          return;
        }
        try {
          if (instance && !completed(read(instance))) playback.start();
        } catch (error) {
          fail(error);
        }
      });
      buttons.push({ element: run, stepping: true });
      for (const count of [1, 10, 100]) {
        const element = button(`${count} step${count === 1 ? "" : "s"}`, () => {
          playback.stop();
          act((model) => model.advance(count), "Steps completed.");
        });
        buttons.push({ element, stepping: true });
      }
      const speedLabel = document.createElement("label");
      speedLabel.className = "speed";
      speedLabel.textContent = "Speed";
      const speedInput = document.createElement("input");
      speedInput.type = "range";
      speedInput.min = "1";
      speedInput.max = "10";
      speedInput.value = "5";
      speedInput.addEventListener(
        "input",
        () => {
          const running = playback.running;
          playback.stop();
          speed = 550 - Number(speedInput.value) * 50;
          if (running) playback.start();
        },
        { signal: events.signal },
      );
      speedLabel.append(speedInput);
      actionBar.append(speedLabel);
      for (const action of spec.actions ?? []) {
        const element = button(action.label, () => {
          playback.stop();
          act((model) => action.run(model, selected), "Action completed.");
        });
        buttons.push({
          element,
          enabled: action.enabled,
          pressed: action.pressed,
        });
        if (action.repeat) {
          const toggle = button(action.repeat.label, () => {
            if (repeat.running) repeat.stop();
            else repeat.start();
          });
          toggle.setAttribute("aria-pressed", "false");
          const repeat = createRepeatedAction({
            current: () => disposed ? undefined : instance,
            enabled: (model: M) => action.enabled?.(read(model), selected) ?? true,
            perform: (model: M) => {
              action.run(model, selected);
              render();
              status.textContent = "Action repeated.";
              status.dataset.state = "success";
              status.setAttribute("role", "status");
            },
            changed: running => toggle.setAttribute("aria-pressed", String(running)),
            failed: fail,
            intervalMs: action.repeat.intervalMs,
            schedule: (tick, intervalMs) => {
              const id = window.setInterval(tick, intervalMs);
              return () => window.clearInterval(id);
            },
          });
          repeats.push(repeat);
          buttons.push({ element: toggle, enabled: action.enabled });
        }
      }
      if (spec.drawing?.toggleLabel) {
        drawingToggle = button(spec.drawing.toggleLabel, () => {
          drawingRequested = !drawingRequested;
          try { render(); } catch (error) { fail(error); }
        });
        drawingToggle.setAttribute("aria-pressed", "false");
        buttons.push({
          element: drawingToggle,
          enabled: state => spec.drawing!.enabled(state),
          pressed: () => drawingRequested,
        });
      }
      if (spec.live?.length) {
        const group = document.createElement("div");
        group.className = "live-controls";
        controls.insertBefore(group, status);
        const inputs = Object.entries(definition.inputs) as [
          string,
          Descriptor,
        ][];
        for (const liveGroup of groupLive(spec.live)) {
          let target: HTMLElement = group;
          if (liveGroup.label !== undefined) {
            const fieldset = document.createElement("fieldset");
            const legend = document.createElement("legend");
            legend.textContent = liveGroup.label;
            fieldset.append(legend); group.append(fieldset); target = fieldset;
          }
          for (const live of liveGroup.fields) {
          const descriptor = inputs.find(([key]) => key === live.field)?.[1];
          if (!descriptor) throw new Error(`Unknown live input: ${live.field}`);
          const label = document.createElement("label");
          label.textContent =
            live.label ??
            live.field
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/^./, (value) => value.toUpperCase());
          let control: HTMLInputElement | HTMLSelectElement;
          if (descriptor.kind === "choice") {
            const select = document.createElement("select");
            for (const value of descriptor.options ?? [])
              select.add(new Option(value, value));
            control = select;
          } else {
            const input = document.createElement("input");
            input.type =
              live.widget === "color"
                ? "color"
                : descriptor.kind === "boolean"
                  ? "checkbox"
                  : descriptor.kind === "number"
                    ? "number"
                    : "text";
            if (descriptor.min !== undefined)
              input.min = String(descriptor.min);
            if (descriptor.max !== undefined)
              input.max = String(descriptor.max);
            input.step = String(
              descriptor.step ?? (descriptor.integer ? 1 : "any"),
            );
            control = input;
            input.autocomplete = "off";
            if (descriptor.kind === "number")
              input.inputMode = descriptor.integer ? "numeric" : "decimal";
          }
          if (
            control instanceof HTMLInputElement &&
            control.type === "checkbox"
          )
            control.checked = Boolean(descriptor.default);
          else control.value = String(descriptor.default);
          control.name = `live-${live.field}`;
          const readControl = () => decodeControl(descriptor,
            descriptor.kind === "boolean"
              ? (control as HTMLInputElement).checked
              : descriptor.kind === "number"
                ? (control as HTMLInputElement).valueAsNumber
                : control.value);
          setup.registerReader(live.field, readControl);
          control.addEventListener(
            "change",
            () => {
              playback.stop();
              if (!control.reportValidity()) return;
              if (!instance) {
                try { readControl(); status.textContent = "Setup values updated."; }
                catch (error) { fail(error); }
                return;
              }
              act((model) => live.set(model, readControl()), "Rule updated.");
            },
            { signal: events.signal },
          );
          label.append(control);
          target.append(label);
          liveControls.push({
            control,
            value: live.value,
            enabled: live.enabled,
          });
          }
        }
      }
      function disposeViews() {
        for (const view of views.splice(0)) view.dispose();
        viewRoot.replaceChildren();
      }
      function pick(id: string) {
        selected = id;
        try {
          render();
        } catch (error) {
          fail(error);
        }
      }
      function mountViews() {
        for (const view of spec.views) {
          const figure = document.createElement("figure");
          const caption = document.createElement("figcaption");
          caption.textContent = view.label;
          figure.append(caption);
          if (view.type === "inspector") {
            figure.hidden = true;
            controls.append(figure);
          } else viewRoot.append(figure);
          if (view.type === "network") {
            const adapter = mountNetwork(figure, pick);
            views.push({
              render: (state) =>
                adapter.update(view.nodes(state), view.edges(state), selected),
              dispose: () => adapter.dispose(),
            });
          } else if (view.type === "grid" || view.type === "spatial") {
            const adapter = mountCanvas(
              figure,
              pick,
              spec.drawing
                ? (intent) => {
                    playback.stop();
                    act(
                      (model) => spec.drawing!.intent(model, intent),
                      "Drawing updated.",
                    );
                  }
                : undefined,
            );
            views.push({
              render: (state) =>
                adapter.update(
                  view.data(state),
                  selected,
                  Boolean(spec.drawing?.enabled(state)) &&
                    (!spec.drawing?.toggleLabel || drawingRequested),
                ),
              dispose: () => adapter.dispose(),
              stopDrawing: () => adapter.stopDrawing(),
            });
          } else if (
            view.type === "line" ||
            view.type === "bar" ||
            view.type === "scatter"
          ) {
            const adapter = mountChart(figure, view.type, { xAxis: view.xAxis, yAxis: view.yAxis });
            views.push({
              render: (state) => adapter.update(view.series(state)),
              dispose: () => adapter.dispose(),
            });
          } else if (view.type === "inspector") {
            const values = document.createElement("dl");
            values.className = "monitors inspector";
            figure.append(values);
            views.push({
              render(state) {
                values.replaceChildren();
                const inspected = view.value(state, selected);
                figure.hidden = !inspected;
                if (!inspected) {
                  return;
                }
                for (const [label, value] of Object.entries(inspected)) {
                  const dt = document.createElement("dt");
                  dt.textContent = label;
                  const dd = document.createElement("dd");
                  dd.textContent = String(value);
                  values.append(dt, dd);
                }
              },
              dispose() {
                figure.remove();
              },
            });
          } else if (view.type === "table") {
            const table = document.createElement("table");
            const navigation = document.createElement("div");
            navigation.className = "view-actions";
            navigation.dataset.pagination = "";
            const previous = document.createElement("button");
            previous.type = "button"; previous.textContent = "Previous rows";
            const next = document.createElement("button");
            next.type = "button"; next.textContent = "Next rows";
            const range = document.createElement("output");
            range.setAttribute("aria-label", "Visible rows");
            navigation.append(previous, range, next);
            const empty = document.createElement("p");
            empty.textContent = "No rows";
            figure.append(table, navigation, empty);
            let page = 0;
            let rows: readonly Readonly<Record<string, string | number | boolean>>[] = [];
            function renderPage() {
              const visible = tablePage(rows, page);
              page = visible.page;
              table.replaceChildren();
              const keys = Object.keys(rows[0] ?? {});
              const head = document.createElement("tr");
              for (const key of keys) {
                const th = document.createElement("th");
                th.scope = "col"; th.textContent = key; head.append(th);
              }
              table.append(head);
              for (const row of visible.rows) {
                const tr = document.createElement("tr");
                for (const key of keys) {
                  const td = document.createElement("td");
                  td.textContent = String(row[key] ?? ""); tr.append(td);
                }
                table.append(tr);
              }
              previous.disabled = !visible.previous; next.disabled = !visible.next;
              range.textContent = visible.range;
              navigation.hidden = !visible.paged; empty.hidden = rows.length > 0;
            }
            previous.onclick = () => { page--; renderPage(); };
            next.onclick = () => { page++; renderPage(); };
            views.push({
              render(state) { rows = view.rows(state); renderPage(); },
              dispose() {
                previous.onclick = null; next.onclick = null;
                table.remove(); navigation.remove(); empty.remove();
              },
            });
          }
        }
      }
      setup.form.addEventListener(
        "submit",
        (event) => {
          event.preventDefault();
          playback.stop();
          stopRepeats();
          resetDrawing();
          if (!setup.form.reportValidity()) return;
          let next: M | undefined;
          try {
            next = definition.create(setup.read());
            read(next);
          } catch (error) {
            next?.dispose?.();
            fail(error);
            return;
          }
          const old = instance;
          try {
            disposeViews();
            instance = next;
            selected = null;
            old?.dispose?.();
            mountViews();
            render();
            status.textContent = "Model initialized.";
            status.dataset.state = "success";
            status.setAttribute("role", "status");
          } catch (error) {
            disposeViews();
            next.dispose?.();
            instance = undefined;
            for (const item of buttons) item.element.disabled = true;
            fail(error);
          }
        },
        { signal: events.signal },
      );
      try {
        mountViews();
      } catch (error) {
        events.abort();
        disposeViews();
        workbench.remove();
        throw error;
      }
      if (definition.description || spec.source) {
        const details = document.createElement("details");
        details.className = "model-info";
        const summary = document.createElement("summary");
        summary.textContent = "Model info";
        const description = document.createElement("p");
        description.textContent = definition.description ?? "";
        details.append(summary, description);
        controls.append(details);
        if (spec.source) {
          const source = document.createElement("a");
          source.href = spec.source.url;
          source.textContent = spec.source.label;
          source.target = "_blank";
          source.rel = "noopener noreferrer";
          details.append(source);
        }
      }
      return {
        pause() {
          playback.stop();
          stopRepeats();
        },
        dispose() {
          if (disposed) return;
          resetDrawing();
          disposed = true;
          playback.stop();
          stopRepeats();
          events.abort();
          disposeViews();
          instance?.dispose?.();
          instance = undefined;
          workbench.remove();
        },
      };
    },
  };
}
