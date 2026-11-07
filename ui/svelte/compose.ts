import type { MonitorSpec, RuntimeSpec } from "../authoring.ts";
import type { LegacyLiveField } from "../definition.ts";
import { flushSync, mount, unmount } from "svelte";
import type { Definition } from "../../experiments/definition.ts";
import type { BoundEntry, ModelInstance, UISpec } from "../definition.ts";
import Workbench from "./Workbench.svelte";
import { createSession } from "./session.ts";

/** Vite-only adapter; the public authoring contract remains framework independent. */
export function defineUI<P extends object, M>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: Omit<UISpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>, 'live'> & {
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
  spec: Omit<MonitorSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>, T>, 'live'> & {
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
export function defineUI<P extends object, M extends ModelInstance>(definition: Definition<P, M>, spec: RuntimeSpec<P, M>): BoundEntry {
  return {
    title: definition.title,
    description: definition.description,
    mount(container) {
      const session = createSession(definition, spec);
      let component: ReturnType<typeof mount>;
      try { component = mount(Workbench, { target: container, props: { session } }); flushSync(); }
      catch (error) { session.dispose(); throw error; }
      let disposed = false;
      return {
        pause: session.pause,
        dispose() {
          if (disposed) return;
          disposed = true;
          // Clear renderer effects before disposing the model that supplied them.
          session.pause();
          void unmount(component);
          flushSync();
          session.dispose();
        },
      };
    },
  };
}
