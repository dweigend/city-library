#!/usr/bin/env python3
"""Check offline evidence consistency and retained source identities."""
from collections import Counter
from pathlib import Path
import hashlib
import json

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
a = json.loads((HERE/'audit.json').read_text())
g = json.loads((HERE/'grouping.json').read_text())
c = json.loads((HERE/'contacts.json').read_text())
x = json.loads((HERE/'cross-record-overlaps.json').read_text())
for info in a['source']+[a['fixtureSource']]:
    data = (ROOT/info['path']).read_bytes()
    assert hashlib.sha256(data).hexdigest() == info['sha256']
    assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest() == info['gitBlobSHA1']
    assert len(data) == info['bytes']
polygons = [p for r in g['records'] for p in r['polygons']]
assert len(g['records']) == 250 and len(a['rings']) == 1088 and len(polygons) == 1078
assert sum(p['positionsIncludingClosures'] for p in polygons) == 23938
assert max(p['positionsIncludingClosures'] for p in polygons) == 1282
assert all(p['within2048'] and p['positionsIncludingClosures'] <= 2048 for p in polygons)
assert sum(len(p['holeRingIDs']) for p in polygons) == 10
assert Counter(r['depth'] for r in a['rings']) == {0: 1078, 1: 10}
assert all(r['winding'] == ('clockwise' if r['role'] == 'shell' else 'counterclockwise') for r in a['rings'])
assert all(hit['scope'] == 'cross-record' for hit in c)
assert len(c) == 343 and len(x['contacts']) == 316
assert len(x['witnesses']) == 14 and len(x['unresolvedContactPairs']) == 302
counts = Counter()
for hit in c:
    counts.update(hit['contacts'])
assert counts == {'touch': 7242, 'collinear-overlap': 2973, 'proper-crossing': 272}
assert x['recordPairs'] == 250*249//2
assert a['fixtures']['allAssertionsPassed']
result = {'status': 'passed', 'scope': 'Offline source-data audit only',
          'executed': ['audit.py: exact synthetic predicates and full source segment sweep/grouping',
                       'verify.py: source/fixture hashes, counts, grouping conservation, contact aggregation'],
          'checks': {'sourceAndFixtureIdentities': 'passed', 'all23938PositionsConserved': True,
                     'all1078PolygonsWithin2048': True, 'completeSelfAndSameRecordContactSweep': True,
                     'crossRecordContactCountsConsistent': True},
          'notClaimed': ['full interior-disjointness of 302 contact pairs', 'runtime or browser acceptance',
                         'scientific/geographic/CRS correctness', 'rights clearance', 'independent approval']}
(HERE/'validation.json').write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
