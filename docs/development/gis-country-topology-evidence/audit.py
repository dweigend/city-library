#!/usr/bin/env python3
"""Offline source-data evidence only; no production parser or geometry runtime."""
from collections import Counter, defaultdict
from fractions import Fraction
from pathlib import Path
import hashlib
import json
import struct
import time

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent


def orient(a, b, c):
    value = (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    return (value > 0)-(value < 0)


def box(points):
    return (min(p[0] for p in points), min(p[1] for p in points),
            max(p[0] for p in points), max(p[1] for p in points))


def boxes_overlap(a, b):
    return a[0] <= b[2] and b[0] <= a[2] and a[1] <= b[3] and b[1] <= a[3]


def box_contains(a, b):
    return a[0] <= b[0] and a[1] <= b[1] and a[2] >= b[2] and a[3] >= b[3]


def on_segment(p, a, b):
    return orient(a, b, p) == 0 and min(a[0], b[0]) <= p[0] <= max(a[0], b[0]) and min(a[1], b[1]) <= p[1] <= max(a[1], b[1])


def contact(a, b, c, d):
    """Assumes inclusive segment BBoxes overlap; exact classification."""
    o1, o2, o3, o4 = orient(a, b, c), orient(a, b, d), orient(c, d, a), orient(c, d, b)
    if o1*o2 < 0 and o3*o4 < 0:
        return 'proper-crossing'
    if o1 == o2 == o3 == o4 == 0:
        axis = 0 if a[0] != b[0] else 1
        lo = max(min(a[axis], b[axis]), min(c[axis], d[axis]))
        hi = min(max(a[axis], b[axis]), max(c[axis], d[axis]))
        return 'collinear-overlap' if lo < hi else 'touch' if lo == hi else None
    if ((o1 == 0 and on_segment(c, a, b)) or (o2 == 0 and on_segment(d, a, b)) or
        (o3 == 0 and on_segment(a, c, d)) or (o4 == 0 and on_segment(b, c, d))):
        return 'touch'
    return None


def pip(point, ring):
    """Boundary first, half-open horizontal ray, exact and division-free."""
    inside = False
    for a, b in zip(ring, ring[1:]):
        if on_segment(point, a, b):
            return 'boundary'
        if (a[1] > point[1]) != (b[1] > point[1]):
            turn = orient(a, b, point)
            if (turn > 0) == (b[1] > a[1]):
                inside = not inside
    return 'inside' if inside else 'outside'


def fixture_checks():
    square = [(0, 0), (8, 0), (8, 8), (0, 8), (0, 0)]
    assert pip((4, 4), square) == 'inside'
    assert pip((8, 4), square) == 'boundary'
    assert pip((9, 4), square) == 'outside'
    assert pip((4, 4), square[::-1]) == 'inside'
    assert contact((0, 0), (4, 4), (0, 4), (4, 0)) == 'proper-crossing'
    assert contact((0, 0), (4, 0), (4, 0), (4, 4)) == 'touch'
    assert contact((0, 0), (4, 0), (2, 0), (6, 0)) == 'collinear-overlap'
    assert contact((0, 0), (4, 0), (4, 0), (2, 0)) == 'collinear-overlap'
    assert contact((0, 0), (2, 1), (0, 1), (1, 1)) is None
    # Exactly dyadic near-collinearity where float cross products cancel.
    a, b, c = (0, 0), (2**53, 2**53-1), (2**53-1, 2**53-2)
    assert orient(a, b, c) == -1
    assert float(b[0])*float(c[1])-float(b[1])*float(c[0]) == 0
    concave = [(0, 0), (8, 0), (8, 8), (6, 8), (6, 2), (2, 2), (2, 8), (0, 8), (0, 0)]
    triangle = [(1, 7), (7, 7), (4, 1), (1, 7)]
    assert all(pip(p, concave) == 'inside' for p in triangle)
    crossings = sum(contact(a, b, c, d) == 'proper-crossing'
                    for a, b in zip(concave, concave[1:])
                    for c, d in zip(triangle, triangle[1:])
                    if boxes_overlap(box([a, b]), box([c, d])))
    assert crossings == 6
    nested = [square,
              [(1, 1), (1, 7), (7, 7), (7, 1), (1, 1)],
              [(2, 2), (6, 2), (6, 6), (2, 6), (2, 2)],
              [(10, 0), (12, 0), (12, 2), (10, 2), (10, 0)]]
    assert [[j for j, outer in enumerate(nested) if i != j and pip(ring[0], outer) == 'inside']
            for i, ring in enumerate(nested)] == [[], [0], [0, 1], []]
    for i, ring in enumerate(nested):
        for other in nested[i+1:]:
            for a, b in zip(ring, ring[1:]):
                for c, d in zip(other, other[1:]):
                    if boxes_overlap(box([a, b]), box([c, d])):
                        assert contact(a, b, c, d) is None
    return {'allAssertionsPassed': True, 'concaveVertexOnlyFalsePositiveProperCrossings': crossings,
            'fixtures': ['inside/outside/boundary/reversed ring', 'proper crossing', 'endpoint touch',
                         'collinear overlap and adjacent backtrack', 'no contact despite overlapping boxes',
                         'near-collinear exact determinant -1 vs floating 0', 'concave vertex-only false positive',
                         'disjoint shell, nested hole, depth-two island; boundaries fully checked']}


def source(path):
    data = (ROOT/path).read_bytes()
    return data, {'path': path, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(),
                  'gitBlobSHA1': hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()}


def main():
    start = time.monotonic()
    fixtures = fixture_checks()
    shp, shp_info = source('experiments/gis-general-examples/data/countries.shp')
    dbf, dbf_info = source('experiments/gis-general-examples/data/countries.dbf')
    manifest = json.loads((ROOT/'docs/development/gis-data-audit-evidence/asset-manifest.json').read_text())
    for info in [shp_info, dbf_info]:
        pinned = next(f for f in manifest['files'] if f['localPath'] == info['path'])
        assert all(info[key] == pinned[key] for key in ['bytes', 'sha256', 'gitBlobSHA1'])
    proposal_bytes, proposal_info = source('examples/planar-geometry-proposal/source-fixtures.json')
    assert json.loads(proposal_bytes)['countryBudgetAudit']['source']['sha256'] == shp_info['sha256']
    dbf_count, header_size, record_size = struct.unpack_from('<IHH', dbf, 4)
    offset = 1
    name_field = None
    for pos in range(32, header_size-1, 32):
        if dbf[pos] == 13:
            break
        name = dbf[pos:pos+11].split(b'\0')[0].decode('ascii')
        width = dbf[pos+16]
        if name == 'CNTRY_NAME':
            name_field = offset, width
        offset += width
    assert name_field is not None
    records, rings = [], []
    cursor = 100
    maximum_denominator = 1
    while cursor < len(shp):
        number, words = struct.unpack_from('>II', shp, cursor)
        assert number == len(records)+1
        body = cursor+8
        assert struct.unpack_from('<i', shp, body)[0] == 5
        parts, count = struct.unpack_from('<ii', shp, body+36)
        starts = list(struct.unpack_from('<'+'i'*parts, shp, body+44))+[count]
        points = list(struct.iter_unpack('<dd', shp[body+44+4*parts:body+44+4*parts+16*count]))
        assert len(points) == count
        for point in points:
            for value in point:
                maximum_denominator = max(maximum_denominator, value.as_integer_ratio()[1])
        name_pos = header_size+(number-1)*record_size+name_field[0]
        name = dbf[name_pos:name_pos+name_field[1]].decode('ascii').rstrip()
        rec = {'record': number, 'country': name, 'positions': count, 'ringIDs': []}
        for part, (lo, hi) in enumerate(zip(starts, starts[1:])):
            ring = {'id': len(rings), 'record': number, 'part': part, 'positions': hi-lo, 'raw': points[lo:hi]}
            assert ring['raw'][0] == ring['raw'][-1]
            rings.append(ring)
            rec['ringIDs'].append(ring['id'])
        records.append(rec)
        cursor = body+2*words
    assert cursor == len(shp) and len(records) == dbf_count == 250 and len(rings) == 1088
    assert sum(r['positions'] for r in rings) == 23938
    assert maximum_denominator & (maximum_denominator-1) == 0
    for ring in rings:
        ring['points'] = [tuple(value.as_integer_ratio()[0]*(maximum_denominator//value.as_integer_ratio()[1]) for value in p) for p in ring.pop('raw')]
        ring['box'] = box(ring['points'])
        ring['twiceArea'] = sum(a[0]*b[1]-a[1]*b[0] for a, b in zip(ring['points'], ring['points'][1:]))
        ring['winding'] = 'clockwise' if ring['twiceArea'] < 0 else 'counterclockwise' if ring['twiceArea'] > 0 else 'zero'
    print('parsed', len(records), len(rings), 'denominator', maximum_denominator, flush=True)
    segments = []
    for ring in rings:
        for edge, (a, b) in enumerate(zip(ring['points'], ring['points'][1:])):
            assert a != b
            segments.append((box([a, b]), ring['id'], edge, a, b))
    segments.sort(key=lambda s: s[0][0])
    active = []
    counts = Counter()
    pair_hits = {}
    for bounds, rid, edge, a, b in segments:
        active = [entry for entry in active if entry[0][2] >= bounds[0]]
        for other_bounds, oid, other_edge, c, d in active:
            counts['xSweepCandidatePairs'] += 1
            if not boxes_overlap(bounds, other_bounds):
                continue
            counts['exactSegmentPredicatePairs'] += 1
            kind = contact(a, b, c, d)
            if not kind:
                continue
            scope = 'self' if rid == oid else 'same-record' if rings[rid]['record'] == rings[oid]['record'] else 'cross-record'
            if scope == 'self':
                last = rings[rid]['positions']-2
                adjacent = abs(edge-other_edge) == 1 or {edge, other_edge} == {0, last}
                if adjacent and kind == 'touch':
                    counts['expectedAdjacentSelfTouches'] += 1
                    continue
            counts[scope+':'+kind] += 1
            key = tuple(sorted([rid, oid]))
            hit = pair_hits.setdefault(key, {'rings': key, 'scope': scope, 'contacts': Counter(), 'firstSegments': {}})
            hit['contacts'][kind] += 1
            hit['firstSegments'].setdefault(kind, [edge, other_edge] if rid <= oid else [other_edge, edge])
        active.append((bounds, rid, edge, a, b))
    print('segments complete', dict(counts), flush=True)
    (OUT/'contacts.json').write_text(json.dumps(list(pair_hits.values()), indent=2)+'\n')
    assert not any(hit['scope'] in ('self', 'same-record') for hit in pair_hits.values())
    assert all(ring['twiceArea'] != 0 for ring in rings)
    # With simple rings and ALL pairwise boundaries disjoint within each
    # record, Jordan separation makes one exact PIP representative conclusive.
    grouping = []
    containment_tests = 0
    for rec in records:
        for rid in rec['ringIDs']:
            ring = rings[rid]
            containers = []
            for oid in rec['ringIDs']:
                if oid == rid or not box_contains(rings[oid]['box'], ring['box']):
                    continue
                containment_tests += 1
                classification = pip(ring['points'][0], rings[oid]['points'])
                assert classification != 'boundary'
                if classification == 'inside':
                    containers.append(oid)
            ring['containers'] = containers
            ring['parentRing'] = min(containers, key=lambda oid: abs(rings[oid]['twiceArea'])) if containers else None
            ring['depth'] = len(containers)
            ring['role'] = 'shell' if ring['depth'] % 2 == 0 else 'hole'
            assert ring['winding'] == ('clockwise' if ring['role'] == 'shell' else 'counterclockwise')
        polygons = []
        for rid in rec['ringIDs']:
            if rings[rid]['role'] != 'shell':
                continue
            holes = [oid for oid in rec['ringIDs'] if rings[oid]['parentRing'] == rid]
            assert all(rings[oid]['role'] == 'hole' for oid in holes)
            total = rings[rid]['positions']+sum(rings[oid]['positions'] for oid in holes)
            polygons.append({'shellRingID': rid, 'shellPart': rings[rid]['part'], 'shellPositions': rings[rid]['positions'],
                             'holeRingIDs': holes, 'holeParts': [rings[oid]['part'] for oid in holes],
                             'holePositions': sum(rings[oid]['positions'] for oid in holes),
                             'positionsIncludingClosures': total, 'within2048': total <= 2048})
        assert sum(poly['positionsIncludingClosures'] for poly in polygons) == rec['positions']
        grouping.append({**rec, 'resultType': 'Polygon' if len(polygons) == 1 else 'MultiPolygon', 'polygons': polygons})

    def feature_pip(point, rec):
        # Nested even/odd ring regions. Existing full within-record checks
        # ensure no boundary ambiguity or non-laminar grouping.
        inside = False
        for rid in rec['ringIDs']:
            ring = rings[rid]
            if not box_contains(ring['box'], (point[0], point[1], point[0], point[1])):
                continue
            result = pip(point, ring['points'])
            if result == 'boundary':
                return 'boundary'
            if result == 'inside':
                inside = not inside
        return 'inside' if inside else 'outside'

    # Cross-record overlap witnesses, not a geographic correctness assertion.
    # Proper boundary crossings of these individually valid features imply
    # a nonempty open overlap wedge. Other witnesses use shell vertices and
    # exact rational edge midpoints; unproven contact pairs stay unresolved.
    record_contacts = {}
    for hit in pair_hits.values():
        ra, rb = (rings[rid]['record'] for rid in hit['rings'])
        key = tuple(sorted([ra, rb]))
        entry = record_contacts.setdefault(key, {'records': key, 'contacts': Counter(), 'ringPairs': 0})
        entry['contacts'].update(hit['contacts'])
        entry['ringPairs'] += 1
    overlap_witnesses = {}
    for key, hit in record_contacts.items():
        if hit['contacts'].get('proper-crossing'):
            overlap_witnesses[key] = {'records': key, 'method': 'proper-boundary-crossing', 'count': hit['contacts']['proper-crossing']}
    cross_pairs = 0
    disjoint_boxes = 0
    vertex_tests = midpoint_tests = 0
    for first in range(len(records)):
        for second in range(first+1, len(records)):
            rec_a, rec_b = records[first], records[second]
            key = (rec_a['record'], rec_b['record'])
            cross_pairs += 1
            bounds_a = box([p for rid in rec_a['ringIDs'] for p in (rings[rid]['box'][:2], rings[rid]['box'][2:])])
            bounds_b = box([p for rid in rec_b['ringIDs'] for p in (rings[rid]['box'][:2], rings[rid]['box'][2:])])
            if not boxes_overlap(bounds_a, bounds_b):
                disjoint_boxes += 1
                continue
            if key in overlap_witnesses:
                continue
            for rec_from, rec_to in [(rec_a, rec_b), (rec_b, rec_a)]:
                if key in overlap_witnesses:
                    break
                for rid in rec_from['ringIDs']:
                    if key in overlap_witnesses:
                        break
                    ring = rings[rid]
                    if ring['role'] != 'shell':
                        continue
                    for edge, (a, b) in enumerate(zip(ring['points'], ring['points'][1:])):
                        vertex_tests += 1
                        result = feature_pip(a, rec_to)
                        method = 'shell-vertex-inside'
                        if result != 'inside':
                            midpoint_tests += 1
                            midpoint = (Fraction(a[0]+b[0], 2), Fraction(a[1]+b[1], 2))
                            result = feature_pip(midpoint, rec_to)
                            method = 'shell-edge-midpoint-inside'
                        if result == 'inside':
                            overlap_witnesses[key] = {'records': key, 'method': method, 'fromRecord': rec_from['record'], 'ringID': rid, 'edge': edge}
                            break
    unresolved_contacts = [key for key in record_contacts if key not in overlap_witnesses]
    all_polygons = [poly for rec in grouping for poly in rec['polygons']]
    budget = {'limitCompared': 2048, 'closurePositionsIncluded': True,
              'shapeRecords': len(records), 'rings': len(rings), 'polygons': len(all_polygons),
              'holes': sum(len(poly['holeRingIDs']) for poly in all_polygons),
              'polygonFeatures': sum(rec['resultType'] == 'Polygon' for rec in grouping),
              'multiPolygonFeatures': sum(rec['resultType'] == 'MultiPolygon' for rec in grouping),
              'maximumRingPositions': max(r['positions'] for r in rings),
              'maximumPolygonPositionsIncludingClosures': max(poly['positionsIncludingClosures'] for poly in all_polygons),
              'polygonsAbove2048': sum(not poly['within2048'] for poly in all_polygons),
              'shapeRecordsAbove2048': [{k: rec[k] for k in ('record', 'country', 'positions')} for rec in records if rec['positions'] > 2048],
              'polygonsWithHoles': [{**{k: rec[k] for k in ('record', 'country')}, **poly} for rec in grouping for poly in rec['polygons'] if poly['holeRingIDs']]}
    (OUT/'grouping.json').write_text(json.dumps({'budget': budget, 'records': grouping}, indent=2)+'\n')
    overlap_audit = {'recordPairs': cross_pairs, 'disjointRecordBBoxPairs': disjoint_boxes,
                     'boundaryContactRecordPairs': len(record_contacts), 'contacts': list(record_contacts.values()),
                     'positiveAreaOverlapWitnessPairs': len(overlap_witnesses), 'witnesses': list(overlap_witnesses.values()),
                     'unresolvedContactPairs': unresolved_contacts, 'vertexPIPTests': vertex_tests, 'midpointPIPTests': midpoint_tests,
                     'scope': 'All boundaries tested. Positive overlap witnesses are conclusive. Remaining contact pairs are not certified interior-disjoint; no overlay area or geographic interpretation.'}
    (OUT/'cross-record-overlaps.json').write_text(json.dumps(overlap_audit, indent=2)+'\n')
    payload = {'sourceRevision': manifest['revision'], 'source': [shp_info, dbf_info], 'fixtureSource': proposal_info, 'fixtures': fixtures,
               'dyadicDenominator': str(maximum_denominator), 'dyadicExponent': maximum_denominator.bit_length()-1,
               'segments': len(segments), 'segmentSweep': dict(counts),
               'withinRecordContainmentPIPTests': containment_tests, 'budget': budget,
               'crossRecordSummary': {k: overlap_audit[k] for k in ('recordPairs', 'disjointRecordBBoxPairs', 'boundaryContactRecordPairs', 'positiveAreaOverlapWitnessPairs', 'vertexPIPTests', 'midpointPIPTests')},
               'records': records, 'rings': [{**{k: v for k, v in ring.items() if k not in ('points', 'box', 'twiceArea')},
                                            'integerBBoxNumerators': [str(n) for n in ring['box']],
                                            'twiceAreaNumerator': str(ring['twiceArea'])} for ring in rings]}
    (OUT/'audit.json').write_text(json.dumps(payload, indent=2)+'\n')
    print(json.dumps({'seconds': time.monotonic()-start, 'contactRingPairs': len(pair_hits)}), flush=True)


if __name__ == '__main__':
    main()
