/** NetLogo Traffic Grid (2003), Uri Wilensky; CC BY-NC-SA 3.0, see NOTICE.md. */
import type { Definition } from '../definition.ts';
import { createGridTraffic, inputs } from './composition.ts';
import type { TrafficParameters } from './composition.ts';
export { inputs };
export type { TrafficParameters };
export function create(options: Partial<TrafficParameters> = {}) {
  return createGridTraffic(options, false);
}
export const model = {
  title: 'Traffic Grid', inputs, create,
  description: 'Sequential car following on a signal-controlled road grid. Wilensky (2003), CC BY-NC-SA 3.0.',
} satisfies Definition<TrafficParameters, ReturnType<typeof create>>;
