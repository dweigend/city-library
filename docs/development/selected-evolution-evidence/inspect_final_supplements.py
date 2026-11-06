"""Decode final ordinary PNGs; no browser canvas readback or image modification.
Run: uv run --with pillow==13.0.0 python docs/development/selected-evolution-evidence/inspect_final_supplements.py
"""
import hashlib, json
from collections import Counter
from pathlib import Path
from PIL import Image
root = Path(__file__).parent
results=[]
for prefix, colors in [('mammoths-direction-final', ['8c541f','ffdf00']), ('vision-overlay-final',['981b1b','000000'])]:
    data=json.loads((root/(prefix+'-browser.json')).read_text())
    rows=[]
    for v in data['variants']:
        suffix='progress' if v['name']=='desktop-light' else v['name']
        path=root/(prefix+'-'+suffix+'.png')
        im=Image.open(path).convert('RGB')
        r=v['progress']['canvas']; sx=im.width/v['width']; sy=im.height/v['height']
        box=tuple(round(n) for n in ((r['x']+1)*sx,(r['y']+1)*sy,(r['right']-1)*sx,(r['bottom']-1)*sy))
        crop=im.crop(box); counts=Counter(crop.getdata())
        palette={c:counts[tuple(bytes.fromhex(c))] for c in colors}
        assert all(palette.values()), (path,palette)
        rows.append({'variant':v['name'],'file':path.name,'pngSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'imageDimensions':im.size,'canvasCrop':box,'rgbSha256':hashlib.sha256(crop.tobytes()).hexdigest(),'declaredPalettePixels':palette})
    pairs={size:len({r['rgbSha256'] for r in rows if r['variant'].startswith(size)})==1 for size in ['desktop','mobile']}
    assert all(pairs.values()), pairs
    results.append({'slug':data['slug'],'proof':prefix+'-browser.json','rows':rows,'sameViewportThemeRgbIdentical':pairs})
(root/'final-supplement-png-comparison.json').write_text(json.dumps({'scope':'Per-image visibility only; palette pixel counts are not population counts. Actual measured canvas rects already use viewport coordinates. PNGs remain unchanged.','decoder':'Pillow 13.0.0','results':results},indent=2)+'\n')
print(json.dumps(results,indent=2))
