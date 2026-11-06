/** NetLogo Traffic Grid Goal (2008), Uri Wilensky; CC BY-NC-SA 3.0, see NOTICE.md. */
import type { Definition } from "../definition.ts";
import { createGridTraffic, inputs } from "../traffic-grid/composition.ts";
import type { TrafficParameters } from "../traffic-grid/composition.ts";
export { inputs };
export type { TrafficParameters };
export function create(options: Partial<TrafficParameters> = {}) {
  return createGridTraffic(options, true);
}
export const model = {
  title: "Traffic Grid Goal",
  inputs,
  create,
  description:
    "Local destination-seeking cars with source-specific signal and following rules. Wilensky (2008), CC BY-NC-SA 3.0.",
} satisfies Definition<TrafficParameters, ReturnType<typeof create>>;
