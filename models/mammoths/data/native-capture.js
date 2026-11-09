// Evidence/build tooling only. Evaluate in the launcher with its loaded original iframe.
// The caller supplies archived terrain.rows as expectedRows for an every-field comparison.
async function captureMammothsNative(expectedRows) {
  const frame = document.querySelector('iframe').contentWindow;
  const hash = async (text) => Array.from(new Uint8Array(await crypto.subtle.digest(
    'SHA-256', new TextEncoder().encode(text),
  ))).map(byte => byte.toString(16).padStart(2, '0')).join('');
  const run = (command) => {
    const compiled = frame.session.compiler.compileCommand(command);
    if (!compiled.success) throw new Error(compiled.result);
    return new frame.Function(compiled.result)();
  };
  const colors = () => frame.world.exportState().patches
    .sort((a, b) => a.pycor - b.pycor || a.pxcor - b.pxcor)
    .map(patch => patch.pcolor.value);
  run('clear-all random-seed 1 ask patches [ set pcolor blue - 0.25 - random-float 0.25 ] import-a:pcolors resource:get "americas"');
  const postImport = colors();
  const native = frame.session.runReporter('map [ p -> not shade-of? blue [pcolor] of p ] sort patches');
  if (!native.success) throw new Error(native.error);
  const bits = Array.from({ length: 97 }, (_, y) => native.value
    .slice((96 - y) * 97, (97 - y) * 97).map(value => value ? '1' : '0').join('')).join('');
  run('random-seed 1 setup');
  const postSetup = colors();
  const actual = postSetup.map(value => value === 55 ? '1' : '0').join('');
  const rows = Array.from({ length: 97 }, (_, y) => bits.slice(y * 97, (y + 1) * 97));
  return {
    sourceSha256: await hash(frame.session.nlogoSource.nlogo), bounds: [0, 96, 0, 96],
    wrapping: [false, false], rows, fields: bits.length,
    maskSha256: await hash(bits),
    importToSetupMismatchCount: [...actual].filter((value, i) => value !== bits[i]).length,
    derivedDataMismatchCount: expectedRows ? [...actual].filter((value, i) => value !== expectedRows.join('')[i]).length : null,
    postImportColorsSha256: await hash(JSON.stringify(postImport)),
    setupColorsSha256: await hash(JSON.stringify(postSetup)), postImport, postSetup,
  };
}
