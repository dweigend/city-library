/** Assertions and accessible DOM queries only; never a simulated model or DOM. */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
export function equal(actual: unknown, expected: unknown, message: string) {
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${message}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
}
export function button(root: HTMLElement, text: string) {
  const result = [...root.querySelectorAll<HTMLButtonElement>('button')].find(item => item.textContent?.trim() === text);
  assert(result, `Missing button: ${text}`);
  return result;
}
function labelledControl(root: HTMLElement, label: HTMLLabelElement): HTMLElement | null {
  const linked = label.htmlFor ? root.ownerDocument.getElementById(label.htmlFor) : null;
  if (linked && root.contains(linked)) return linked;
  return label.querySelector<HTMLElement>('input, select, button[role="checkbox"], button[role="combobox"]');
}
function labelText(label: HTMLLabelElement) {
  // Nested select options are not part of its accessible label text.
  return [...label.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim() || label.textContent?.trim();
}
export function labels(root: HTMLElement, descriptorFields: readonly string[]) {
  return [...root.querySelectorAll<HTMLLabelElement>('label')].filter(label => {
    const input = labelledControl(root, label);
    if (!input) return false;
    const name = input.getAttribute('name') ?? '';
    return descriptorFields.some(field => name === field || name === `live-${field}` || input.id.endsWith(`-${field}`));
  }).map(labelText);
}
export function controls(root: HTMLElement, label: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLLabelElement>('label')].filter(item => labelText(item) === label).map(item => {
    const input = labelledControl(root, item);
    assert(input, `Missing labelled control: ${label}`);
    return input;
  });
}
export function control(root: HTMLElement, label: string): HTMLElement {
  const result = controls(root, label)[0];
  assert(result, `Missing control label: ${label}`);
  return result;
}
export function changeInput(input: HTMLElement, value: number) {
  assert(input instanceof HTMLInputElement, 'Expected a native numeric input');
  input.value = String(value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
export function changeNumber(root: HTMLElement, label: string, value: number) {
  changeInput(control(root, label), value);
}

/** Test scheduling only: neither host promises synchronously rendered event effects. */
export async function settle(root: HTMLElement): Promise<void> {
  await Promise.resolve();
  const view = root.ownerDocument.defaultView;
  assert(view, 'Browser checks require an actual attached browser document');
  await new Promise<void>(resolve => view.requestAnimationFrame(() => resolve()));
  await Promise.resolve();
}
