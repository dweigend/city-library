"""Exact proposal-fixture arithmetic only; no City Library runtime validation."""
from fractions import Fraction as F
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
spec = importlib.util.spec_from_file_location('retained_audit', ROOT / 'docs/development/gis-country-topology-evidence/audit.py')
oracle = importlib.util.module_from_spec(spec)
spec.loader.exec_module(oracle)


def exact(points):
    return [tuple(F(v) for v in p) for p in points]


s = float.fromhex('0x0.0000000000001p-1022')
tiny = exact([(0, 0), (4*s, 0), (4*s, 4*s), (0, 4*s), (0, 0)])
assert oracle.pip((F(2*s), F(2*s)), tiny) == 'inside'
u = 2**-52
triangle = exact([(0, 0), (1, 1-u), (1+u, 1), (0, 0)])
determinant = triangle[1][0]*triangle[2][1]-triangle[1][1]*triangle[2][0]
assert determinant == F(u)**2 and 1*1-(1-u)*(1+u) == 0
side = 2**-20
lo, hi = 1e9-side, 1e9
offset = exact([(lo, lo), (hi, lo), (hi, hi), (lo, hi), (lo, lo)])
assert oracle.pip((F(lo+side/2), F(lo+side/2)), offset) == 'inside'
shell = [(0, 0), (8, 0), (8, 8), (6, 8), (6, 2), (2, 2), (2, 8), (0, 8), (0, 0)]
hole = [(1, 7), (7, 7), (4, 1), (1, 7)]
assert all(oracle.pip(p, shell) == 'inside' for p in hole)
crossings = sum(oracle.contact(a,b,c,d) == 'proper-crossing'
                for a,b in zip(shell,shell[1:]) for c,d in zip(hole,hole[1:])
                if oracle.boxes_overlap(oracle.box([a,b]),oracle.box([c,d])))
assert crossings == 6
assert oracle.contact((0,0),(4,0),(4,0),(2,0)) == 'collinear-overlap'
result = {'status': 'passed exact fixture arithmetic only',
          'subnormalSquare': 'strict interior at (2s,2s), s=Number.MIN_VALUE',
          'cancellationTriangle': {'determinant': str(determinant), 'expected': '2^-104', 'floatingDeterminant': 0},
          'largeOffsetSquare': {'lower':lo,'upper':hi,'side':side,'strictInterior':True},
          'concaveU': {'allHoleVerticesInside':True,'properEdgeCrossings':crossings},
          'adjacentBacktrack':'collinear overlap',
          'notExecuted': 'The five TS scripts: contains/bounds/Planar public exports are not implemented.'}
(Path(__file__).parent / 'numeric-fixtures.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
