import { createLabSession } from "./application/session.ts";
import { mountWorkbench } from "./presentation/workbench.ts";

const dispose = mountWorkbench(createLabSession());
window.addEventListener("pagehide", (event) => {
  if (!event.persisted) dispose();
});
