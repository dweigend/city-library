"""Small combinatorial/draw-ledger proposal oracles; not a production graph generator."""
from pathlib import Path
import json,hashlib,math
from fractions import Fraction as F
HERE=Path(__file__).parent
captured=json.loads((HERE/'public-random-streams.json').read_text())['streams']
def mulberry(seed,count):
    # Independent integer transcription only verifies the already delivered stream.
    word=seed;values=[]
    for _ in range(count):
        word=(word+0x6d2b79f5)&0xffffffff
        value=((word^(word>>15))*(1|word))&0xffffffff
        value^=(value+(((value^(value>>7))*(61|value))&0xffffffff))&0xffffffff
        values.append(((value^(value>>14))&0xffffffff)/2**32)
    return values
for seed,row in captured.items():assert row['draws']==mulberry(int(seed),12)
undirected_pairs=[(a,b) for a in range(4) for b in range(a+1,4)]
directed_pairs=[(a,b) for a in range(3) for b in range(3) if a!=b]
units=captured['1']['draws'][:6]
assert [list(pair) for pair,unit in zip(undirected_pairs,units) if unit<.5]==[[0,2],[2,3]]
assert [list(pair) for pair,unit in zip(directed_pairs,units) if unit<.5]==[[0,2],[2,1]]
# Hand-auditable current-neighbor pools, not graph generation code.
pools=[[2],[0,3],[1],[2]];selected=[];rewire_ledger=[]
for i,pool in enumerate(pools):
    decision,choice=captured['1']['draws'][2*i:2*i+2]
    target=pool[math.floor(choice*len(pool))];selected.append(target)
    rewire_ledger.append({'originalSource':i,'decisionDraw':decision,'selectionDraw':choice,'currentEligiblePool':pool,'selected':target})
assert selected==[2,3,1,2]
slots=[[0,1],[1,2],[2,3],[3,0]]
for i,row in enumerate(rewire_ledger):
    current={frozenset(pair) for pair in slots}
    actual_pool=[v for v in range(4) if v!=i and frozenset([i,v]) not in current]
    assert actual_pool==row['currentEligiblePool']
    slots[i]=[i,row['selected']]
    assert len({frozenset(pair) for pair in slots})==4
assert slots==[[0,2],[1,3],[2,1],[3,2]]
# Independent cumulative-mass ledgers for three attachment batches.
degrees=[2,2,2];choices=[];pref_ledger=[];draws=iter(captured['7']['draws'])
for node in range(3,6):
    available=list(range(node));batch=[]
    for choice in range(2):
        unit=next(draws);total=sum(degrees[i] for i in available);threshold=F.from_float(unit)*total;mass=0
        for target in available:
            mass+=degrees[target]
            if threshold<mass:break
        pref_ledger.append({'newNode':node,'available':available.copy(),'degreesBeforeBatch':degrees.copy(),'unit':unit,'exactThreshold':str(threshold),'selected':target})
        batch.append(target);available.remove(target)
    for target in batch:degrees[target]+=1
    degrees.append(2);choices.extend([[node,target] for target in batch])
assert choices==[[3,0],[3,1],[4,3],[4,1],[5,2],[5,1]] and degrees==[3,5,3,3,2,2]
# Cube edge criterion differs from the proposed traversal: coordinate Hamming1.
cube_pairs=[]
for a in range(8):
    for b in range(a+1,8):
        if (a^b) in [1,2,4]:cube_pairs.append([a,b])
assert cube_pairs==[[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]]
assert math.dist((0,0,0),(0,0,3))==3 and math.dist((0,0,3),(0,4,0))==5
assert 1415*1414//2==1000405 and 1414*1413//2==998991
assert 100000*20//2==1000000 and 40013*25-25*26//2==1000000
source=Path('docs/research/netlogo-web/evidence/computing/nw-general-examples.nlogox')
sha=hashlib.sha256(source.read_bytes()).hexdigest();assert sha=='9c80d9fa4d5d4da96224e65cd707639267da3f6494309d9d45b758164d2703db'
out={'status':'Proposal oracles only; no Graph.generate implementation or script executed','sourceSHA256':sha,'publicRandomStreamsMatchIndependentIntegerCheck':True,'randomPairSelections':{'undirected':[[0,2],[2,3]],'directed':[[0,2],[2,1]]},'smallWorldProposedLedger':rewire_ledger,'smallWorldProposedResult':[[0,2],[1,3],[2,1],[3,2]],'preferentialLedger':pref_ledger,'preferentialFinalDegrees':degrees,'cubePairs':cube_pairs,'caps':{'selectedNodeCap':100000,'generatedEdgeCap':1000000,'complete1415Edges':1000405,'complete1414Edges':998991,'smallWorld100000Neighbors20Edges':1000000,'preferential40013Links25Edges':1000000,'noAdditionalCandidatePairCapIntroduced':True},'oracleLimits':'SmallWorld pool evolution/order and singleton selection draw remain proposed contract decisions. No statistical/RNG equivalence or uniformity experiment is claimed.'}
(HERE/'oracle-results.json').write_text(json.dumps(out,indent=2)+'\n')
print('PASS: pair thresholds, recorded eligible pools, cumulative-degree draws, cube topology, geometric distances and cap formulas')
