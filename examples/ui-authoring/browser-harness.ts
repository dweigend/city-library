/** Explicit real-browser harness. Vite compiles the Svelte import; no model or DOM mock. */
export async function runBrowserChecks(container: HTMLElement, host: 'legacy' | 'svelte') {
  const bind = host === 'svelte'
    ? (await import('../../ui/svelte/index.ts')).defineUI
    : (await import('../../ui/index.ts')).defineUI;
  const examples = await Promise.all([
    import('./01-defaults-and-inert-entry.ts'),
    import('./02-ordered-setup-and-numeric-live.ts'),
    import('./03-alternate-observation.ts'),
    import('./04-groups-format-and-categories.ts'),
    import('./05-independent-actions-and-legacy.ts'),
  ]);
  for (const example of examples) {
    const fixture = container.ownerDocument.createElement('section');
    container.append(fixture);
    try { example.browserChecks(fixture, bind); }
    finally { fixture.remove(); }
  }
  for (const check of [examples[1].overlapBrowserChecks, examples[2].precedenceBrowserChecks]) {
    const fixture = container.ownerDocument.createElement('section');
    container.append(fixture);
    try { check(fixture, bind); } finally { fixture.remove(); }
  }
  return { host, examples: 5, overlapAndPrecedence: true } as const;
}
