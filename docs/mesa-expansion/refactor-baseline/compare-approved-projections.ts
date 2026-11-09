import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
const directory = '/tmp/mesa-feedback-refactor-baseline';
function effectiveCells(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(effectiveCells);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => {
    if (key !== 'cells' || !Array.isArray(entry)) return [key, effectiveCells(entry)];
    const byCoordinate = new Map();
    for (const cell of entry) byCoordinate.set(`${cell.x}:${cell.y}`, cell);
    return [key, [...byCoordinate.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, cell]) => cell)];
  }));
}
const results = [];
for (const file of readdirSync(`${directory}/raw`).filter(file => file.endsWith('.json'))) {
  const before = JSON.parse(readFileSync(`${directory}/raw/${file}`, 'utf8'));
  const after = JSON.parse(readFileSync(`${directory}/replay/${file}`, 'utf8'));
  delete before.hashes;
  delete after.hashes;
  const crossing = file.includes('pedestrian-crossing-phases');
  const zoning = file.includes('zoning-scenario-comparison');
  if (zoning) {
    // The only caption correction is one world unit left and down; restore those offsets
    // solely for comparison, leaving every ID, label, cell and observation exact.
    for (const snapshot of after.snapshots) {
      for (const key of ['projectionsA', 'projectionsB']) {
        for (const caption of snapshot[key].zoningData.agents) {
          if (!caption.id.startsWith('view:run:')) throw new Error('Unexpected zoning agent');
          caption.x += 1;
          caption.y += 1;
        }
      }
    }
  }
  const equal = isDeepStrictEqual(crossing ? effectiveCells(before) : before, crossing ? effectiveCells(after) : after);
  results.push({ file, comparison: crossing ? 'effective last-wins cells; every other value exact' : zoning ? 'caption offsets x+1/y+1 for comparison; every other value exact' : 'exact', equal });
}
writeFileSync(`${directory}/approved-projection-compare-summary.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify({ cases: results.length, equal: results.filter(result => result.equal).length, failures: results.filter(result => !result.equal) }, null, 2));
if (results.some(result => !result.equal)) process.exitCode = 1;
