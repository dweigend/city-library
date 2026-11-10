import type { AuthoringSpec, MonitorSpec, RuntimeSpec } from "./authoring.ts";
import type { LegacyLiveField } from "./definition.ts";
import { flushSync, mount, unmount } from "svelte";
import type { Definition } from "../models/definition.ts";
import type { BoundEntry, ModelInstance, UISpec } from "./definition.ts";
import Workbench from "./svelte/Workbench.svelte";
import { createSession } from "./svelte/session.ts";

/** Svelte adapter; the public authoring contract remains framework independent. */
export function defineUI<P extends object, M>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: Omit<UISpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>, 'live' | 'change'> & {
    readonly change?: undefined;
    readonly live?: readonly LegacyLiveField<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>[];
  },
): BoundEntry;
export function defineUI<P extends object, M>(
  definition: Definition<P, M> & { readonly create: (options?: Partial<P>) => ModelInstance },
  spec: AuthoringSpec<NoInfer<P>, Extract<NoInfer<M>, ModelInstance>>,
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
