import { flushSync, mount, unmount } from "svelte";
import type { Definition } from "../../experiments/definition.ts";
import type { BoundEntry, ModelInstance, UISpec } from "../definition.ts";
import Workbench from "./Workbench.svelte";
import { createSession } from "./session.ts";

/** Vite-only adapter; the public authoring contract remains framework independent. */
export function defineUI<P extends object, M extends ModelInstance>(definition: Definition<P, M>, spec: UISpec<P, M>): BoundEntry {
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
