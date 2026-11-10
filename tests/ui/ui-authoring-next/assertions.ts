/** Browser queries and assertions only; no replacement model or simulated DOM. */
export { assert, equal, button, control, changeInput, changeNumber, settle } from '../ui-authoring/assertions.ts';

export function monitor(root: HTMLElement, label: string): string {
  const title = [...root.querySelectorAll('dt')].find(item => item.textContent?.trim() === label);
  if (!title) throw new Error(`Missing monitor: ${label}`);
  return title.nextElementSibling?.textContent?.trim() ?? '';
}

/** Both hosts submit the same setup form; their visible restart labels may differ. */
export function restart(root: HTMLElement): void {
  const submit = root.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!submit) throw new Error('Missing setup submit button');
  submit.click();
}
