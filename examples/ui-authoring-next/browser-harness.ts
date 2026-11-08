/** Real-browser acceptance through explicit public adapters, without a DOM mock. */
export async function runBrowserChecks(container: HTMLElement, host: 'legacy' | 'svelte') {
  const bind = host === 'svelte'
    ? (await import('../../ui/svelte/index.ts')).defineUI
    : (await import('../../ui/index.ts')).defineUI;
  const examples = await Promise.all([
    import('./01-typed-monitor-formatters.ts'),
    import('./02-readable-observation-projections.ts'),
    import('./03-namespaced-selection.ts'),
    import('./04-formatter-errors-and-recovery.ts'),
    import('./05-independent-mounts-and-legacy.ts'),
  ]);
  for (const example of examples) {
    const fixture = container.ownerDocument.createElement('section');
    container.append(fixture);
    try { await example.browserChecks(fixture, bind); }
    finally { fixture.remove(); }
  }
  return { host, examples: examples.length };
}
