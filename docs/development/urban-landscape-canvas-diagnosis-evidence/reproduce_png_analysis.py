"""Run from repository root. Historical files are read, never rewritten."""
import json,math,struct
from pathlib import Path
from png_measure import measure
root=Path(__file__).parent
old=Path('docs/development/urban-landscape-target-evidence')
historical=[measure(f) for f in sorted(old.glob('*.png')) if not f.stem.endswith('setup')]
(root/'historical-png-analysis.json').write_text(json.dumps(historical,indent=2)+'\n')
current=[]
for f in sorted(root.glob('*.png')):
 j=json.loads(f.with_suffix('.json').read_text())['geometry'];r=j['canvas']['rect']
 width=struct.unpack_from('>I',f.read_bytes(),16)[0];k=width/j['viewport']['width']
 roi=[math.ceil(r['x']*k)+1,math.ceil(r['y']*k)+1,math.floor((r['x']+r['width'])*k)-1,math.floor((r['y']+r['height'])*k)-1]
 current.append(measure(f,roi))
(root/'current-png-analysis.json').write_text(json.dumps(current,indent=2)+'\n')
