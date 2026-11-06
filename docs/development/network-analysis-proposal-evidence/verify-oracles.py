"""Independent tiny-fixture mathematical checks, not a library analysis implementation."""
from fractions import Fraction as F
from pathlib import Path
import json

def shortest_vertex_simple_paths_betweenness(directed, mixed=False):
    arcs=[(0,1),(0,1),(0,2),(1,3),(2,3)]
    adjacency=[[] for _ in range(4)]
    for i,(a,b) in enumerate(arcs):
        adjacency[a].append(b)
        if not directed or (mixed and i==3):adjacency[b].append(a)
    scores=[F(0) for _ in range(4)]
    for source in range(4):
        for target in range(4):
            if source==target:continue
            paths=[]
            def visit(path):
                if path[-1]==target:paths.append(path);return
                for node in adjacency[path[-1]]:
                    if node not in path:visit(path+[node])
            visit([source])
            if paths:
                size=min(map(len,paths));short=[p for p in paths if len(p)==size]
                for node in range(4):scores[node]+=F(sum(node in p[1:-1] for p in short),len(short))
    if not directed:scores=[s/2 for s in scores]
    return scores
assert shortest_vertex_simple_paths_betweenness(True)==[F(0),F(2,3),F(1,3),F(0)]
assert shortest_vertex_simple_paths_betweenness(False)==[F(2,3),F(2,3),F(1,3),F(1,3)]
assert shortest_vertex_simple_paths_betweenness(True,True)==[F(0),F(2,3),F(1,3),F(1)]
a,b,c=F(12,31),F(11,31),F(8,31)
assert a+b+c==1 and a==F(1,6)+b/2+c/6 and b==F(1,6)+3*a/8+c/6 and c==F(1,6)+a/8+c/6
x,y,z=F(4,9),F(1,3),F(2,9)
assert x+y+z==1 and x==F(1,6)+(y+z)/2 and y==F(1,6)+3*x/8 and z==F(1,6)+x/8
out={'status':'Independent finite-fixture mathematical oracle checks; no target graph.analyze executed','tinyBetweenness':{'directed':[str(v) for v in shortest_vertex_simple_paths_betweenness(True)],'undirected':[str(v) for v in shortest_vertex_simple_paths_betweenness(False)],'mixed':[str(v) for v in shortest_vertex_simple_paths_betweenness(True,True)]},'pageRankDampingOneHalf':{'dangling':[str(a),str(b),str(c)],'withoutDangling':[str(x),str(y),str(z)],'exactStationaryBalanceChecked':True},'largeParallelChain':{'nodes':1100,'edges':2198,'endToEndShortestPaths':'2^1099','pathCountBinaryDigits':(2**1099).bit_length(),'interiorBetweennessFormula':'i*(1099-i)','noExponentialPathEnumerationPerformed':True},'sourceCloseness':{'Star5Center':'4/4=1','Star5Leaf':'4/(1+2+2+2)=4/7','Ring5':'4/(1+1+2+2)=2/3'}}
Path(__file__).with_name('oracle-results.json').write_text(json.dumps(out,indent=2)+'\n')
print('PASS: exact rational tiny betweenness paths and PageRank stationary balances; no target runtime')
