"""Reproduce bounded screenshot ROI measurements (RGB bytes, exact colors are not agent counts)."""
import json, math
from pathlib import Path
from png_stats import stats
root=Path(__file__).parent
results=[]
for f in sorted(root.glob('*.png')):
    whole=stats(f)
    if f.name.startswith('retained-source'):
        roi=[419,265,882,729] # manually bounded source habitat interior
    elif f.name.startswith('child-'):
        roi=[294,105,887,697] # manually bounded child habitat interior
    else:
        j=json.loads(f.with_suffix('.json').read_text())['geometry']
        r=j['canvas']['rect']; k=whole['width']/j['viewport']['width']
        roi=[max(0,math.ceil(r['x']*k)+1),max(0,math.ceil(r['y']*k)+1),min(whole['width'],math.floor((r['x']+r['width'])*k)-1),min(whole['height'],math.floor((r['y']+r['height'])*k)-1)]
    results.append(stats(f,roi))
(root/'canvas-roi-png-stats.json').write_text(json.dumps(results,indent=2)+'\n')
