"""Evidence integrity and small source-law mathematics; no generator implementation."""
from fractions import Fraction
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
checks = []


def sha(data):
    return hashlib.sha256(data).hexdigest()


def record(name, condition):
    assert condition, name
    checks.append(name)


all_json = list(HERE.glob('*.json'))
for path in all_json:
    json.loads(path.read_text())
record('All retained JSON parses', True)
manifest = json.loads((HERE / 'primary-source-manifest.json').read_text())
manifest.append(json.loads((HERE / 'galapagos-build-identity.json').read_text()))
for row in manifest:
    data = (ROOT / row['retainedFile']).read_bytes()
    record('Size ' + row['path'] if 'path' in row else 'Galapagos build size', len(data) == row['bytes'])
    record('SHA256 ' + row['retainedFile'], sha(data) == row['sha256'])
    blob = b'blob ' + str(len(data)).encode() + b'\0' + data
    record('Git blob ' + row['retainedFile'], hashlib.sha1(blob).hexdigest() == row['gitBlobSHA1'])

served = json.loads((HERE / 'actual-served-module.json').read_text())
live = json.loads((HERE / 'actual-served-primitives.json').read_text())
record('Actual NW module excerpt hash', sha(served['moduleExcerpt'].encode()) == served['moduleSHA256'])
record('Ten served primitive matches', len(served['matches']) == 10 and all(served['matches'].values()))
for primitive in live['primitives']:
    record(primitive['name'] + ' function SHA', sha(primitive['source'].encode()) == primitive['sha256'])
    record(primitive['name'] + ' exact occurrence in NW module', primitive['source'] in served['moduleExcerpt'])
deps = json.loads((HERE / 'actual-served-dependency-modules.json').read_text())
for module in deps['moduleExcerpts']:
    record(module['module'] + ' excerpt SHA', sha(module['excerpt'].encode()) == module['sha256'])
shell = json.loads((HERE / 'served-engine-shell-identity.json').read_text())
record('Browser and independent shell engine identities', served['sha256'] == deps['bundleSHA256'] == shell['sha256'] and served['bytes'] == deps['bundleBytes'] == shell['bytes'])
archive = ROOT / 'docs/research/netlogo-web/evidence/computing/nw-general-examples.nlogox'
final = json.loads((HERE / 'final-browser-state.json').read_text())
record('Original XML archive/live initial/live final identity', sha(archive.read_bytes()) == live['loadedSourceSHA'] == final['sourceSHA'])

index = json.loads((HERE / 'native-probe-index.json').read_text())
record('26 indexed probes and closed owned tab', index['count'] == len(index['probes']) == 26 and index['closed'] is True)
for probe in index['probes']:
    raw = json.loads((HERE / probe['evidence']).read_text())
    record(probe['id'] + ' retained exact readback', all(raw[k] == probe[k] for k in ['id', 'command', 'at', 'graph', 'console']))
    graph = probe['graph']
    record(probe['id'] + ' original reporter success', graph['success'])
    tick, nodes, links, directed, undirected, *tail = graph['value']
    record(probe['id'] + ' tick and breed totals', tick == 0 and links == directed + undirected)
    if tail:
        pairs = tail[0]
        record(probe['id'] + ' edge count and endpoints', len(pairs) == links and all(0 <= a < nodes and 0 <= b < nodes and a != b for a, b in pairs))
        keys = [(a, b) if directed else tuple(sorted((a, b))) for a, b in pairs]
        record(probe['id'] + ' no repeated directed/unordered pair', len(keys) == len(set(keys)))
    if 'ERROR: Extension exception:' in probe['console']:
        record(probe['id'] + ' rejected before births', nodes == links == 0)
    record(probe['id'] + ' setup and explicit seed', probe['command'].startswith('setup random-seed 17 '))

by_id = {p['id']: p for p in index['probes']}
base_counts = {'kleinberg-2x3-r0-undirected': 7, 'kleinberg-2x3-r2-undirected': 7, 'kleinberg-3x3-r2-no-wrap': 12, 'kleinberg-3x3-r2-wrap': 18, 'kleinberg-2x2-r0-directed': 4}
additions = {}
for name, base in base_counts.items():
    graph = by_id[name]['graph']['value']
    additions[name] = graph[2] - base
    record(name + ' net additions within one attempt per node', 0 <= additions[name] <= graph[1])
for main, replay in [('kleinberg-3x3-r2-wrap', 'kleinberg-3x3-r2-wrap-circle-view'), ('directed-wheel-inward-4', 'wheel-inward-4-circle-view')]:
    record(main + ' circle replay unchanged graph', by_id[main]['graph'] == by_id[replay]['graph'])

# Exact fractions are a separate ideal-law oracle, not the native Number accumulation.
weights = [Fraction(1, d*d) for d in [1, 2, 1, 2, 3]]
probabilities = [w / sum(weights) for w in weights]
record('2x3 r2 corner ideal probabilities', probabilities == [Fraction(18,47),Fraction(9,94),Fraction(18,47),Fraction(9,94),Fraction(2,47)])
record('2x3 r0 uniform law', sum([Fraction(1,5)]*5) == 1)
record('3x3 nowrap corner r2 weight sum', sum(Fraction(1, d*d) for d in [1,2,1,2,3,2,3,4]) == Fraction(437,144))
record('3x3 wrapped r2 probabilities', 4*Fraction(1,5) + 4*Fraction(1,20) == 1)

result = {'status':'PASS', 'scope':'Evidence integrity, original native readback consistency and exact ideal-law mathematics only; no City Library runtime or independent approval', 'command':'python3 docs/development/nw-generator-source-gaps-evidence/validate.py', 'checks':len(checks), 'primaryFiles':len(manifest), 'servedPrimitives':len(live['primitives']), 'nativeProbes':len(index['probes']), 'netShortcutAdditions': additions, 'ideal2x3r2CornerProbabilities':[str(x) for x in probabilities], 'checksPassed': checks}
(HERE / 'validation.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k:v for k,v in result.items() if k != 'checksPassed'}, indent=2))
