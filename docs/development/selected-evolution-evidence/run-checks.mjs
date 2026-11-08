// Scoped coordinator checks. Root owns global example/config registration.
import { mkdir, writeFile } from 'node:fs/promises';
const folder = new URL('./', import.meta.url);
const commands = [
 ['frozen-hashes', ['sha256sum', '-c', 'examples/selected-evolution/SHA256SUMS']],
 ['types', ['bun', 'run', 'typecheck']],
 ['frozen-script-types', ['bun', 'x', 'tsc', '-p', 'docs/development/selected-evolution-evidence/tsconfig.examples.json']],
 ['behavior', ['bun', 'test', 'tests/selected-evolution-first.test.ts', 'tests/selected-evolution-last.test.ts']],
 ...['01-memory-and-pollution','02-gametes-and-sex-ratio','03-learning-and-mammoths','04-infection-and-vision','05-drift-and-inheritance'].map(name => [name, ['bun', `examples/selected-evolution/${name}.ts`]]),
 ['terrain', ['bun', 'experiments/mammoths/data/verify.mjs']],
 ['build', ['bun', 'run', 'build']],
 ['packed-consumer', ['bun', 'run', 'consumer']],
];
const results = [];
for (const [name, command] of commands) {
 const startedAt = new Date().toISOString();
 const child = Bun.spawn(command, { stdout: 'pipe', stderr: 'pipe' });
 const [stdout, stderr, exitCode] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
 await writeFile(new URL(`${name}.log`, folder), stdout + stderr);
 results.push({ name, command, startedAt, exitCode, log: `${name}.log` });
 console.log(name, exitCode);
}
await writeFile(new URL('checks.json', folder), JSON.stringify(results, null, 2) + '\n');
if (results.some(result => result.exitCode !== 0)) process.exitCode = 1;
