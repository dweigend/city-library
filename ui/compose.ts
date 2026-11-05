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

/** Concrete model types stay here; only the bound mounted handle enters the catalog. */
export function defineUI<P extends object, M extends ModelInstance>(
  definition: Definition<P, M>,
  spec: UISpec<P, M>,
): BoundEntry {
  return {
    title: definition.title,
    description: definition.description,
    mount(container) {
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
      const views: {
        render: (state: Snapshot<M>) => void;
        dispose: () => void;
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
      function fail(error: unknown) {
        playback.stop();
        status.textContent = errorMessage(error);
        status.dataset.state = "error";
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
          value.textContent = String(monitor.value(state));
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
        for (const view of views) view.render(state);
      }
      function act(action: (model: M) => void, message: string) {
        if (!instance || disposed) return false;
        try {
          action(instance);
          status.textContent = message;
          status.dataset.state = "success";
          render();
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
        if (instance && !completed(read(instance))) playback.start();
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
      }
      if (spec.live?.length) {
        const group = document.createElement("div");
        group.className = "live-controls";
        controls.insertBefore(group, monitors);
        const inputs = Object.entries(definition.inputs) as [
          string,
          Descriptor,
        ][];
        for (const live of spec.live) {
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
              descriptor.kind === "boolean"
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
          const readControl = () =>
            descriptor.kind === "boolean"
              ? (control as HTMLInputElement).checked
              : descriptor.kind === "number"
                ? Number(control.value)
                : control.value;
          setup.registerReader(live.field, readControl);
          control.addEventListener(
            "change",
            () => {
              playback.stop();
              if (!control.reportValidity()) return;
              if (!instance) {
                status.textContent = "Setup values updated.";
                return;
              }
              act((model) => live.set(model, readControl()), "Rule updated.");
            },
            { signal: events.signal },
          );
          label.append(control);
          group.append(label);
          liveControls.push({
            control,
            value: live.value,
            enabled: live.enabled,
          });
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
            const adapter = mountCanvas(figure, pick);
            views.push({
              render: (state) => adapter.update(view.data(state), selected),
              dispose: () => adapter.dispose(),
            });
          } else if (
            view.type === "line" ||
            view.type === "bar" ||
            view.type === "scatter"
          ) {
            const adapter = mountChart(figure, view.type);
            views.push({
              render: (state) => adapter.update(view.series(state)),
              dispose: () => adapter.dispose(),
            });
          } else if (view.type === "inspector") {
            const values = document.createElement("dl");
            values.className = "monitors";
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
            figure.append(table);
            views.push({
              render(state) {
                const rows = view.rows(state);
                table.replaceChildren();
                const keys = Object.keys(rows[0] ?? {});
                const head = document.createElement("tr");
                for (const key of keys) {
                  const th = document.createElement("th");
                  th.scope = "col";
                  th.textContent = key;
                  head.append(th);
                }
                table.append(head);
                for (const row of rows.slice(0, 200)) {
                  const tr = document.createElement("tr");
                  for (const key of keys) {
                    const td = document.createElement("td");
                    td.textContent = String(row[key] ?? "");
                    tr.append(td);
                  }
                  table.append(tr);
                }
              },
              dispose() {
                table.remove();
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
        },
        dispose() {
          if (disposed) return;
          disposed = true;
          playback.stop();
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
