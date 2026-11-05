import type { Definition } from "../../experiments/definition.ts";
import type { ModelInstance, UISpec } from "../definition.ts";

export interface Descriptor {
  kind: "number" | "boolean" | "choice" | "text";
  default: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  options?: readonly string[];
}
export function createForm<P extends object, M extends ModelInstance>(
  definition: Definition<P, M>,
  spec: UISpec<P, M>,
) {
  const form = document.createElement("form");
  form.className = "setup";
  form.setAttribute("aria-label", "Model setup");
  const readers = new Map<string, () => string | number | boolean>();
  const inputs = Object.entries(definition.inputs) as [string, Descriptor][];
  const fields =
    spec.setup ??
    inputs.map(([field]) => ({ field, label: undefined, widget: undefined }));
  for (const field of fields) {
    const descriptor = inputs.find(([key]) => key === field.field)?.[1];
    if (!descriptor) throw new Error(`Unknown input: ${field.field}`);
    const label = document.createElement("label");
    label.textContent =
      field.label ??
      field.field
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (value) => value.toUpperCase());
    let control: HTMLSelectElement | HTMLInputElement;
    if (descriptor.kind === "choice") {
      control = document.createElement("select");
      for (const value of descriptor.options ?? [])
        control.add(new Option(value, value));
      control.value = String(descriptor.default);
    } else {
      control = document.createElement("input");
      control.type =
        descriptor.kind === "boolean"
          ? "checkbox"
          : field.widget === "range"
            ? "range"
            : descriptor.kind === "number"
              ? "number"
              : "text";
      if (descriptor.kind === "boolean")
        control.checked = Boolean(descriptor.default);
      else control.value = String(descriptor.default);
      if (descriptor.min !== undefined) control.min = String(descriptor.min);
      if (descriptor.max !== undefined) control.max = String(descriptor.max);
      control.step = String(
        descriptor.step ?? (descriptor.integer ? 1 : "any"),
      );
      control.required = descriptor.kind !== "boolean";
      control.autocomplete = "off";
      if (descriptor.kind === "number")
        control.inputMode = descriptor.integer ? "numeric" : "decimal";
    }
    control.name = field.field;
    control.id = `setup-${field.field}`;
    label.htmlFor = control.id;
    label.append(control);
    form.append(label);
    readers.set(field.field, () =>
      descriptor.kind === "boolean"
        ? (control as HTMLInputElement).checked
        : descriptor.kind === "number"
          ? Number(control.value)
          : control.value,
    );
  }
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Setup";
  form.append(submit);
  return {
    form,
    registerReader(field: string, read: () => string | number | boolean) {
      if (!inputs.some(([key]) => key === field))
        throw new Error(`Unknown input: ${field}`);
      readers.set(field, read);
    },
    read(): Partial<P> {
      const result: Record<string, string | number | boolean> =
        Object.fromEntries(inputs.map(([key, value]) => [key, value.default]));
      for (const [key, read] of readers) result[key] = read();
      return result as Partial<P>;
    },
  };
}
