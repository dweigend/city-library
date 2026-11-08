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

# Revised numerical consultation closures: tiny weighted paths are independently
# enumerated with exact Fraction costs, not Brandes dependency accumulation.
def weighted_oracle(size, edges):
    adjacency=[[] for _ in range(size)]
    for a,b,cost in edges:adjacency[a].append((b,F(cost)))
    scores=[F(0) for _ in range(size)]
    for source in range(size):
        for target in range(size):
            if source==target:continue
            paths=[]
            def enumerate_paths(path,cost):
                if path[-1]==target:paths.append((cost,path));return
                for node,weight in adjacency[path[-1]]:
                    if node not in path:enumerate_paths(path+[node],cost+weight)
            enumerate_paths([source],F(0))
            if not paths:continue
            minimum=min(cost for cost,path in paths)
            shortest=[path for cost,path in paths if cost==minimum]
            for node in range(size):scores[node]+=F(sum(node in path[1:-1] for path in shortest),len(shortest))
    return scores

def rare_fixture(stages,tail):
    edges=[];previous=0
    for stage in range(stages):
        nxt=stage+2
        edges.extend([(previous,nxt,1),(previous,nxt,1)])
        previous=nxt
    edges.extend([(0,1,stages-1),(1,previous,1)])
    for index in range(tail):
        nxt=stages+2+index;edges.append((previous,nxt,1));previous=nxt
    return stages+2+tail,edges
small=[]
for stages in range(2,6):
    for tail in range(4):
        size,edges=rare_fixture(stages,tail);value=weighted_oracle(size,edges)[1]
        assert value==F(tail+1,2**stages+1)
        small.append({'stages':stages,'tail':tail,'rareScore':str(value),'method':'all-pairs vertex-simple weighted path enumeration'})
assert weighted_oracle(3,[(0,1,F.from_float(1e16)),(1,2,1),(2,1,1)])==[F(0),F(1),F(0)]
minimum=F(1,2**1074);rare=F(128,2**1080+1);tiny=F(1,2**1080+1)
assert F(3,2)*minimum < rare < 2*minimum
assert 0 < tiny < minimum/2
assert float(rare)==2*float(minimum) and float(tiny)==0
# Analytic stationary equations independently verify new loop/large-row witnesses.
a,b=F(9,14),F(5,14)
assert a==F(1,4)+(F(2,3)*a+b)/2 and b==F(1,4)+a/6 and a+b==1
ha,hb,hc=F(4,9),F(5,18),F(5,18)
assert ha==F(1,6)+(hb+hc)/2 and hb==F(1,6)+ha/4 and hc==F(1,6)+ha/4
published=[float(F(10**16)),float(F(10**16+1)),float(F(10**16+2))]
rounded_total=float(sum(map(F.from_float,published),F(0)))
assert rounded_total==3e16 and 3/rounded_total==1e-16
assert float(F(2**53+1))==2**53 and float(F(2**53+2))==2**53+2
maximum=F.from_float(float.fromhex('0x1.fffffffffffffp+1023'))
assert float(maximum+1)==float(maximum)
try:float(maximum+2**970)
except OverflowError:pass
else:raise AssertionError('Expected ties-even overflow at MAX+2^970')
out.update({'revision':'root provisional numerical closures; unfrozen proposals; no analyze implementation executed','tinyRareBranchOracles':small,'largeRareBranch':{'stages':1080,'tail':127,'multiplicity':'2^1080+1','finalExactScore':'128/(2^1080+1)','proof':'1.5*2^-1074 < score < 2*2^-1074','correctRoundedScoreHex':float(rare).hex(),'correctRoundedMIN_VALUEUnits':2,'trueFinalUnderflowWithoutTail':float(tiny)==0,'noAbsoluteToleranceUsed':True,'largeFixtureNotEnumerated':True},'newStationaryOracles':{'undirectedLoopTwoOutgoingArcs':['9/14','5/14'],'MAXRowSplit':['4/9','5/18','5/18']},'dyadicAndAggregationOracles':{'publishedDistances':published,'exactSumOfPublishedDistances':str(sum(map(F.from_float,published),F(0))),'roundedPublishedTotal':rounded_total,'closeness':3/rounded_total,'positiveCycleBehindLargePrefixBetweenness':[0,1,0],'degreeNearestTiesEven':True,'degreeMAXPlusOneAllowed':True,'degreeMAXPlusHalfULPOverflow':True}})
Path(__file__).with_name('oracle-results.json').write_text(json.dumps(out,indent=2)+'\n')
print('PASS:16 exact weighted small rare-branch oracles, subnormal rounding proof, loop/PageRank and dyadic aggregate oracles; no analyze runtime')

from decimal import Decimal, localcontext
with localcontext() as context:
    context.prec=90
    root2=Decimal(2).sqrt();left=((Decimal(2)+root2)/4).sqrt();right=((Decimal(2)-root2)/4).sqrt();lam=1+root2
    assert abs(left*left+right*right-1)<Decimal('1e-80')
    assert abs(2*left+right-lam*left)<Decimal('1e-80') and abs(left-lam*right)<Decimal('1e-80')
large_lambda=5*10**299
contraction=F(large_lambda-1,large_lambda+1)
assert contraction**100>F(999,1000)
assert F(1,3)**100<F(1,10**40)
out['eigenvectorMathematicalWitnesses']={'undirectedLoop':{'incomingAdjacency':[[2,1],[1,0]],'exactEigenvalue':'1+sqrt(2)','exactUnitL2Eigenvector':['sqrt((2+sqrt(2))/4)','sqrt((2-sqrt(2))/4)'],'ninetyDigitEigenEquationAndNormChecked':True,'notAnIterativeErrorGuarantee':True},'symmetricParallelMAX':'equal row sums imply equal positive unit-L2 vector under whole(A+I); no unscaled adjacency publication required','asymmetricLargeWeights':{'AOffDiagonal':['2.5e299','1e300'],'AEigenvalueMagnitude':'5e299','wholeShiftContractionPower100GreaterThan':'999/1000','wrongScaleAThenAddIContractionPower100LessThan':'1e-40','noClaimThatL1StoppingCertifiesGeneralEigenpairError':True}}
Path(__file__).with_name('oracle-results.json').write_text(json.dumps(out,indent=2)+'\n')
print('PASS: independent high-precision loop eigenpair and exact shifted-operator contraction inequalities')
