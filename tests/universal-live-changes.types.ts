/** Compile-only public-consumer regressions; no model or browser is initialized. */
import { defineUI, type ChangeUISpec, type UISpec } from "../ui/index.ts";
import type { Definition } from "../experiments/definition.ts";

interface Parameters { amount: number }
interface Instance {
  read(): { parameters: Parameters };
  advance(steps?: number): void;
  apply(changes: Partial<Parameters>): void;
}
interface ExtendedSpec extends UISpec<Parameters, Instance> { marker?: string }
interface ExtendedChangeSpec extends ChangeUISpec<Parameters, Instance> { marker?: string }

declare const model: Definition<Parameters, Instance>;
function consumer() {
  const legacy: ExtendedSpec = {
    marker: "retained extension",
    live: { amount: { set: (instance, value) => instance.apply({ amount: value }) } },
    views: [],
  };
  defineUI(model, legacy);
  const common: ExtendedChangeSpec = {
    marker: "explicit default",
    change: (instance, changes) => instance.apply(changes),
    live: { amount: {} },
    views: [],
  };
  defineUI(model, common);
  // @ts-expect-error Restored UISpec retains the existing required-set write path.
  const missing: ExtendedSpec = { live: { amount: {} }, views: [] };
  // @ts-expect-error ChangeUISpec requires its explicit common action.
  const noCommonAction: ChangeUISpec<Parameters, Instance> = { live: { amount: {} }, views: [] };
  void missing; void noCommonAction;
}
void consumer;
