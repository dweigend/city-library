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
export function labels(root: HTMLElement) {
  return [...root.querySelectorAll('form label')].map(item => item.textContent?.trim());
}
export function control(root: HTMLElement, label: string): HTMLElement {
  const item = [...root.querySelectorAll<HTMLLabelElement>('label')].find(item => item.textContent?.trim() === label);
  assert(item, `Missing control label: ${label}`);
  const input = root.ownerDocument.getElementById(item.htmlFor);
  assert(input && root.contains(input), `Missing labelled control: ${label}`);
  return input;
}
export function changeNumber(root: HTMLElement, label: string, value: number) {
  const input = control(root, label);
  assert(input instanceof HTMLInputElement, `${label} must be a native numeric input`);
  input.value = String(value);
  input.dispatchEvent(new Event('change', { bubbles: true }));
}
