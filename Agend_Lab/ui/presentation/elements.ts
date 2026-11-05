export function element<T extends Element>(selector: string, type: { new(...args: never[]): T }): T {
  const found = document.querySelector(selector);
  if (!(found instanceof type)) throw new Error(`Missing UI element: ${selector}`);
  return found;
}
export function output(selector: string, value: string | number) {
  element(selector, HTMLOutputElement).value = String(value);
}
