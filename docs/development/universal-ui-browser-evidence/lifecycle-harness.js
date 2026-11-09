// Adversarial public-adapter browser checks. Test waits never advance model time.
const base = '/@fs/home/david/.t3/worktrees/city-library/t3-4aa89a8c';
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
function create() {
  let generation = 0;
  return {
    advance() { generation++; },
    read() {
      return { generation, width: 10, height: 6, description: `Generation ${generation}`,
        agents: [{ id: 'person', x: generation / 2, y: 0 }] };
    },
  };
}
function holdCanvasFrames() {
  const request = window.requestAnimationFrame;
  const cancel = window.cancelAnimationFrame;
  const held = new Map();
  const cancelled = [];
  let issued = 0;
  window.requestAnimationFrame = callback => {
    // Isolate the canvas host's deferred frame; leave Bits UI's observers native.
    if (String(new Error().stack).includes('/ui/views/canvas.ts')) {
      const handle = 9000001 + issued++;
      held.set(handle, callback);
      return handle;
    }
    return request(callback);
  };
  window.cancelAnimationFrame = handle => {
    if (held.has(handle)) { cancelled.push(handle); held.delete(handle); }
    else cancel(handle);
  };
  return { held, cancelled, issued: () => issued, restore() {
    window.requestAnimationFrame = request;
    window.cancelAnimationFrame = cancel;
  } };
}
window.runUniversalLifecycle = async () => {
  const out = [];
  for (const adapter of ['ui/index.ts', 'ui/svelte/index.ts']) {
    const { defineUI } = await import(`${base}/${adapter}`);
    const container = document.createElement('div');
    container.id = 'qa-held-frame'; container.style.width = '400px';
    const style = document.createElement('style');
    style.textContent = '#qa-held-frame canvas.world{width:100%;max-width:100%}';
    document.head.append(style); document.body.append(container);
    const mounted = defineUI({ title: 'Held frame lifecycle', inputs: {}, create }, {
      views: [{ type: 'spatial', label: 'Generation', data: observation => observation }],
    }).mount(container);
    const button = label => [...container.querySelectorAll('button')].find(node => node.textContent.trim() === label);
    await frame(); button('Setup').click(); await frame(); await delay(60);
    const canvas = container.querySelector('canvas');
    const context = canvas.getContext('2d');
    const fill = context.fillRect;
    let draws = 0;
    context.fillRect = function (...args) { draws++; return fill.apply(this, args); };
    const interception = holdCanvasFrames();
    try {
      container.style.width = '380px'; await delay(60);
      container.style.width = '360px'; await delay(60);
      const pending = [...interception.held];
      button('1 step').click(); await frame(); button('1 step').click(); await frame();
      const latest = canvas.getAttribute('aria-label');
      mounted.dispose(); await frame();
      const before = { draws, width: canvas.width, height: canvas.height };
      for (const [, callback] of pending) callback(performance.now());
      out.push({ adapter, issued: interception.issued(), pending: pending.map(entry => entry[0]),
        cancelled: interception.cancelled, latest, detached: !canvas.isConnected,
        forcedLateDraws: draws - before.draws,
        dimensionsUnchanged: canvas.width === before.width && canvas.height === before.height,
        heldEmpty: interception.held.size === 0 });
    } finally {
      interception.restore(); context.fillRect = fill;
      mounted.dispose(); container.remove(); style.remove();
    }
  }
  window.__lifecycle = out;
  return out;
};
window.holdUniversalCanvasFrames = holdCanvasFrames;
