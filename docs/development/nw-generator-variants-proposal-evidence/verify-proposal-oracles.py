"""Bounded proposal mathematics/traces only; no library/model generator runtime."""
from fractions import Fraction
from pathlib import Path
import json
import math

HERE = Path(__file__).resolve().parent
inputs = json.loads((HERE/'public-random-inputs.json').read_text())
streams = {row['seed']: row['units'] for row in inputs['streams']}


def kleinberg_fixture(cols, rows, exponent, wrap, directed, seed):
    assert cols*rows <= 9  # Scope of this tiny evidence oracle, NOT a proposed API cap.
    pairs, seen, events = [], set(), []
    def once(a, b):
        key = (a, b) if directed else tuple(sorted([a, b]))
        added = key not in seen
        if added:
            seen.add(key); pairs.append([a, b])
        return added
    for row in range(rows):
        for col in range(cols):
            source = row*cols+col
            if col+1 < cols: once(source, source+1)
            elif wrap and cols > 2: once(source, row*cols)
            if row+1 < rows: once(source, source+cols)
            elif wrap and rows > 2: once(source, col)
    base = len(pairs)
    for source in range(rows*cols):
        weights = []
        for target in range(rows*cols):
            if target == source: continue
            dr, dc = abs(source//cols-target//cols), abs(source%cols-target%cols)
            if wrap: dr, dc = min(dr, rows-dr), min(dc, cols-dc)
            weights.append((target, Fraction(1, (dr+dc)**exponent)))
        # Exact rational law independently selects these non-boundary fixtures.
        unit = Fraction(streams[seed][source])
        threshold = unit*sum(weight for _, weight in weights)
        cumulative = Fraction(0)
        for target, weight in weights:
            cumulative += weight
            if threshold <= cumulative: break
        # Independent binary64 cumulative calculation for these selected
        # non-boundary fixtures; not a universal Math.pow bit-parity promise.
        float_weights = [math.pow(float(weight.denominator), -1) for _, weight in weights]
        total = sum(float_weights)
        pick = float(unit)*total
        float_cumulative = 0.0
        for (float_target, _), weight in zip(weights, float_weights):
            float_cumulative += weight
            if pick <= float_cumulative: break
        assert float_target == target
        events.append({'source': source, 'target': target, 'newEdge': once(source, target)})
    return {'shape':[cols, rows], 'exponent':exponent, 'wrap':wrap, 'directed':directed, 'seed':seed,
            'pairs':pairs, 'baseEdges':base, 'draws':rows*cols, 'attempts':events,
            'note':'Exact rational law oracle; selected fixtures also agree with source-ordered binary64 accumulation.'}


def pa_fixture(seed, count=6, links=2):
    assert count == 6 and links == 2
    pairs = [[a,b] for a in range(links+1) for b in range(a+1, links+1)]
    attempts, consumed = [], 0
    for node in range(links+1, count):
        pending = []
        while len(pending) < links:
            first, second = streams[seed][consumed:consumed+2]; consumed += 2
            selected = pairs[int(first*len(pairs))]
            target = selected[0] if second < .5 else selected[1]
            accepted = target not in pending
            attempts.append({'node':node,'link':selected.copy(),'target':target,'accepted':accepted})
            if accepted: pending.append(target)
        pairs.extend([[node,target] for target in pending])
    degrees = [sum(a == node or b == node for a,b in pairs) for node in range(count)]
    return {'seed':seed,'nodes':count,'links':links,'pairs':pairs,'draws':consumed,'attempts':attempts,'incidentDegrees':degrees}


def ws_fixture(seed, count=4, per_side=1):
    assert count <= 7 and per_side >= 1
    forward = [{(source+offset)%count for offset in range(1,per_side+1)} for source in range(count)]
    buffer, pairs, events, consumed = list(range(count)), [], [], 0
    for source in range(count):
        for offset in range(1,per_side+1):
            old = (source+offset)%count
            decision = streams[seed][consumed]; consumed += 1
            assert decision < 1
            forward[source].remove(old)
            rejected, cursor = [], 0
            while True:
                chosen = cursor+int(streams[seed][consumed]*(count-cursor)); consumed += 1
                candidate = buffer[chosen]
                buffer[chosen], buffer[cursor] = buffer[cursor], buffer[chosen]
                cursor += 1
                if candidate != source and candidate not in forward[source] and source not in forward[candidate]: break
                rejected.append(candidate)
            forward[source].add(candidate); pairs.append([source,candidate])
            events.append({'source':source,'old':old,'new':candidate,'rejected':rejected,'oldReselected':old==candidate})
    assert len({tuple(sorted(pair)) for pair in pairs}) == len(pairs)
    return {'seed':seed,'nodes':count,'neighborsPerSide':per_side,'pairs':pairs,'draws':consumed,'events':events,'finalCandidateBuffer':buffer}


small_weights = [Fraction(1,d*d) for d in [1,2,1,2,3]]
law = [weight/sum(small_weights) for weight in small_weights]
assert law == [Fraction(18,47), Fraction(9,94), Fraction(18,47), Fraction(9,94), Fraction(2,47)]
kleinberg = [kleinberg_fixture(*spec) for spec in [(3,2,0,False,False,1),(3,2,2,False,False,1),(3,3,2,True,False,7),(2,2,0,False,True,1)]]
pa = [pa_fixture(seed) for seed in [1,7]]
ws = [ws_fixture(seed) for seed in [1,7,17]]
assert any(not event['accepted'] for fixture in pa for event in fixture['attempts'])
assert any(event['oldReselected'] for fixture in ws for event in fixture['events'])
assert any(event['rejected'] for fixture in ws for event in fixture['events'])
result = {'status':'passed','scope':'Unfrozen proposed unit-stream protocol oracles; not proposed runtime or native RNG parity',
          'idealCornerR2Probabilities':[str(p) for p in law], 'kleinberg':kleinberg,'preferential':pa,'wattsStrogatz':ws}
(HERE/'oracle-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ['status','scope','idealCornerR2Probabilities']},indent=2))
for name in ['kleinberg','preferential','wattsStrogatz']:
    print(name,json.dumps([{k:v for k,v in row.items() if k in ['seed','shape','pairs','baseEdges','draws','incidentDegrees']} for row in result[name]]))
