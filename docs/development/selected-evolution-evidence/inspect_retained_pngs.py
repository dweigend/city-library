"""Decode each retained target PNG; compare actual canvas RGB rather than image-tool previews.
Run: uv run --with pillow==13.0.0 python docs/development/selected-evolution-evidence/inspect_retained_pngs.py
Canvas document geometry was measured in actual T3 Chromium; scroll/viewport comes from each original raw proof.
No canvas readback, state change, or renderer repair is performed by this offline check.
"""
import collections, hashlib, json, math, subprocess
from pathlib import Path
from PIL import Image
root = Path(__file__).parent
geometry = json.loads((root / 'retained-png-canvas-geometry.json').read_text())
palette = json.loads(subprocess.check_output([
 'bun', '-e', 'import {netLogoColor} from "./ui/index.ts"; console.log(JSON.stringify(Object.fromEntries(Array.from({length:1400},(_,i)=>[i/10,netLogoColor(i/10)]))))'
], text=True))
colors = {
 'mimicry': [palette['15'], palette['105'], '#666666'],
 'anisogamy': [palette[str(n)] for n in [14, 16, 18, 104, 106, 108]],
 'peppered-moths': [palette[str(n)] for n in range(1, 9)],
 'baldwin-effect': ['#888888', '#d73027', '#4575b4'],
 'sex-ratio-equilibrium': ['#3bb34b', '#428bd0', '#f6a130'],
 'bacterial-infection': ['#a536c7', '#389b39', '#8b603f', '#ce3030', '#dd2020'],
 'vision-evolution': ['#981b1b', '#000000'],
 'gendrift-t-interact': [palette[str(n)] for n in [5, 15, 25, 35, 45]],
 'mendelian-inheritance': ['#777777', '#ffffff'],
}
results = []
for row in geometry:
 slug = row['slug']
 final_path = root / f'{slug}-final-browser.json'
 final = json.loads(final_path.read_text()) if final_path.exists() else None
 primary = json.loads((root / f'{slug}-target.json').read_text())
 per_model = []
 for kind in ['desktop', 'mobile']:
  measured = next(view for view in row['views'] if (view['viewport'][0] < 500) == (kind == 'mobile'))
  for theme in ['light', 'dark']:
   if final:
    variant = next(view for view in final['variants'] if view['name'] == f'{kind}-{theme}')
    state = variant['progress']['read']
    suffix = 'progress' if kind == 'desktop' and theme == 'light' else f'{kind}-{theme}'
    path = root / f'{slug}-final-{suffix}.png'
   else:
    state = primary['progress'] if kind == 'desktop' else primary['mobile' + theme.title()]
    suffix = 'progress' if kind == 'desktop' and theme == 'light' else f'{kind}-{theme}'
    path = root / f'{slug}-target-{suffix}.png'
   image = Image.open(path).convert('RGB')
   rect = measured['canvasDoc']
   sx, sy = state['scroll']
   factor = image.width / state['viewport'][0]
   bounds = [max(0, math.ceil((rect['x']-sx)*factor)+1), max(0, math.ceil((rect['y']-sy)*factor)+1), min(image.width, math.floor((rect['x']-sx+rect['width'])*factor)-1), min(image.height, math.floor((rect['y']-sy+rect['height'])*factor)-1)]
   crop = image.crop(bounds)
   pixels = collections.Counter(crop.get_flattened_data())
   expected = {color: pixels[tuple(bytes.fromhex(color[1:]))] for color in colors[slug]}
   per_model.append({'viewport': kind, 'theme': theme, 'path': path.name, 'pngSize': list(image.size), 'pngSha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bounds': bounds, 'canvasRgbSha256': hashlib.sha256(crop.tobytes()).hexdigest(), 'exactAgentColorPixels': expected, 'scope': 'Exact palette pixel counts are visibility evidence, never population counts.'})
 for kind in ['desktop', 'mobile']:
  pair = [r for r in per_model if r['viewport'] == kind]
  assert len(pair) == 2
  for r in pair:
   r['sameCanvasRgbAcrossThemes'] = pair[0]['canvasRgbSha256'] == pair[1]['canvasRgbSha256']
   r['agentPalettePresent'] = sum(r['exactAgentColorPixels'].values()) > 0
 results.append({'slug': slug, 'images': per_model})
(root / 'retained-png-decoded-comparison.json').write_text(json.dumps(results, indent=2) + '\n')
for row in results:
 print(row['slug'], [(r['viewport'], r['theme'], r['sameCanvasRgbAcrossThemes'], sum(r['exactAgentColorPixels'].values())) for r in row['images']])
