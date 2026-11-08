"""Offline proposal-fixture extraction; consumes the completed topology audit.

This is evidence tooling, not a public decoder or runtime geometry implementation.
It leaves all original assets, audit artifacts and old proposal fixture bytes intact.
"""
import hashlib
import importlib.util
import json
from fractions import Fraction
from pathlib import Path
import struct

ROOT = Path(__file__).resolve().parents[3]
OLD = ROOT / 'examples/planar-geometry-proposal/source-fixtures.json'
GROUPS = ROOT / 'docs/development/gis-country-topology-evidence/grouping.json'
AUDIT = ROOT / 'docs/development/gis-country-topology-evidence/audit.json'
SHP = ROOT / 'experiments/gis-general-examples/data/countries.shp'
audit = json.loads(AUDIT.read_text())
groups = json.loads(GROUPS.read_text())
raw = SHP.read_bytes()
assert hashlib.sha256(raw).hexdigest() == audit['source'][0]['sha256']
assert hashlib.sha256(OLD.read_bytes()).hexdigest() == audit['fixtureSource']['sha256']
spec = importlib.util.spec_from_file_location('retained_audit', AUDIT.parent / 'audit.py')
oracle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oracle)

rings = {}
cursor = 100
for record in groups['records']:
    number, words = struct.unpack_from('>II', raw, cursor)
    assert number == record['record']
    body = cursor + 8
    parts, count = struct.unpack_from('<ii', raw, body + 36)
    starts = list(struct.unpack_from('<' + 'i' * parts, raw, body + 44)) + [count]
    points = list(struct.iter_unpack('<dd', raw[body + 44 + 4 * parts:body + 44 + 4 * parts + 16 * count]))
    for rid, lo, hi in zip(record['ringIDs'], starts, starts[1:]):
        rings[rid] = points[lo:hi]
    cursor = body + 2 * words
assert cursor == len(raw)


def classify(point, ring):
    return oracle.pip(tuple(Fraction(v) for v in point), [tuple(Fraction(v) for v in p) for p in ring])


def interior(coordinates):
    # Exact source-predicate reuse for fixture expectations only, not a TS kernel.
    shell = coordinates[0]
    for a, b, c in zip(shell, shell[1:], shell[2:]):
        point = tuple(float((Fraction(a[i]) + Fraction(b[i]) + Fraction(c[i])) / 3) for i in (0, 1))
        if classify(point, shell) == 'inside' and all(classify(point, h) == 'outside' for h in coordinates[1:]):
            return {'x': point[0], 'y': point[1]}
    raise AssertionError('No independently checked interior fixture found')


def fixture(record, poly):
    coordinates = [rings[poly['shellRingID']], *[rings[i] for i in poly['holeRingIDs']]]
    points = [p for ring in coordinates for p in ring]
    bounds = [min(p[0] for p in points), max(p[0] for p in points), min(p[1] for p in points), max(p[1] for p in points)]
    assert len(points) == poly['positionsIncludingClosures']
    hole = interior([coordinates[1]]) if len(coordinates) > 1 else None
    return {'record': record['record'], 'historicalName': record['country'], 'shellPart': poly['shellPart'],
            'holeParts': poly['holeParts'], 'positionsIncludingClosures': len(points), 'bounds': bounds,
            'strictInterior': interior(coordinates), 'holeInterior': hole, 'coordinates': coordinates}


by_record = {r['record']: r for r in groups['records']}
russia = by_record[184]
largest = max(russia['polygons'], key=lambda p: p['positionsIncludingClosures'])
west_bank = by_record[246]
canada = by_record[39]
canada_coordinates = [[rings[p['shellRingID']], *[rings[i] for i in p['holeRingIDs']]] for p in canada['polygons']]
canada_points = [p for polygon in canada_coordinates for ring in polygon for p in ring]
assert sum(len(ring) for polygon in canada_coordinates for ring in polygon) == 3316
old = json.loads(OLD.read_text())
payload = {'status': 'Unfrozen post-advisory proposal fixtures; no decoder, CRS or GIS Setup acceptance',
           'city': old['city'], 'worldRaster': old['worldRaster'],
           'countrySource': old['countryBudgetAudit']['source'],
           'completedAudit': {'path': str(AUDIT.relative_to(ROOT)), 'sha256': hashlib.sha256(AUDIT.read_bytes()).hexdigest(),
                              'groupingPath': str(GROUPS.relative_to(ROOT)), 'groupingSha256': hashlib.sha256(GROUPS.read_bytes()).hexdigest(),
                              'budget': groups['budget'], 'crossRecordOverlapWitnessPairs': 14, 'unresolvedContactPairs': 302},
           'russiaLargest': fixture(russia, largest), 'westBank': fixture(west_bank, west_bank['polygons'][0]),
           'canada': {'record': 39, 'historicalName': 'Canada', 'positionsIncludingClosures': 3316,
                      'polygonMembers': 126, 'largestMemberPositions': 932,
                      'bounds': [min(p[0] for p in canada_points), max(p[0] for p in canada_points), min(p[1] for p in canada_points), max(p[1] for p in canada_points)],
                      'coordinates': canada_coordinates},
           'rightsContext': 'docs/development/gis-data-audit.md; no new rights inference'}
OUT = ROOT / 'examples/planar-geometry-proposal/post-advisory-source-fixtures.json'
OUT.write_text(json.dumps(payload, separators=(',', ':')) + '\n')
result = {'fixture': str(OUT.relative_to(ROOT)), 'sha256': hashlib.sha256(OUT.read_bytes()).hexdigest(),
          'originalFixturePreserved': hashlib.sha256(OLD.read_bytes()).hexdigest() == audit['fixtureSource']['sha256'],
          'russiaPositions': payload['russiaLargest']['positionsIncludingClosures'], 'westBankPositions': payload['westBank']['positionsIncludingClosures'],
          'canadaPositions': 3316, 'canadaPolygons': 126, 'sourceChecks': 'Original SHP hash and original fixture hash matched; exact retained audit PIP checked binary64 interior witnesses.'}
(Path(__file__).parent / 'source-fixture-validation.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
