"""Reconcile exact selected B02 research bytes with served and pinned Web sources."""
import json, hashlib, urllib.request, pathlib, xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
R=pathlib.Path(__file__).resolve().parents[2]
inv=json.loads((R/'experiments/catalog/inventory.json').read_text())
sel=json.loads((R/'experiments/catalog/selection/selection.json').read_text())
print(type(sel).__name__, list(sel)[:8])
rows=sel if isinstance(sel,list) else next(v for v in sel.values() if isinstance(v,list) and v and isinstance(v[0],dict) and 'slug' in v[0])
rows=[r for r in rows if r['deliveryBatch']=='B02']
tree=json.loads((R/'experiments/catalog/pinned/galapagos-tree.json').read_text())
blobs={r['path']:r for r in tree['tree']}
def pin(row):
 slug=row['slug']; dossier=json.loads((R/f'docs/research/netlogo-web/{slug}.json').read_text()); src=dossier['modelSource']; data=(R/'docs/research/netlogo-web'/src['evidencePath']).read_bytes()
 url=row['launchUrl'].split('#')[1]; served=urllib.request.urlopen(url).read(); assert data==served,slug
 sha=hashlib.sha256(data).hexdigest(); assert sha==src['sha256']
 inventoryrow=next(r for r in inv['rows'] if r['catalogKey']=='public/'+row['optionValue']); assert inventoryrow['sha256']==sha and inventoryrow['bytes']==len(data)
 path='public/'+row['optionValue']+'.nlogox'; blob=blobs[path]; assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==blob['sha']
 pinned='https://raw.githubusercontent.com/NetLogo/Galapagos/'+tree['sha']+'/'+urllib.parse.quote(path)
 assert urllib.request.urlopen(pinned).read()==data
 xml=ET.fromstring(data); folder=R/'experiments'/slug; folder.mkdir(exist_ok=True); (folder/'source.nlogox').write_bytes(data)
 info=xml.findtext('info') or ''; notice=info[info.find('## COPYRIGHT AND LICENSE'):]
 manifest={**{k:row[k] for k in ['slug','name','catalogPath','optionValue','launchUrl']},'sourceUrl':url,'sha256':sha,'bytes':len(data),'version':xml.attrib,'galapagos':{'revision':tree['sha'],'blobSha1':blob['sha'],'url':pinned,'matchesServedBytes':True},'research':f'../../docs/research/netlogo-web/{slug}.md'}
 (folder/'NOTICE.md').write_text(f"# {row['name']} provenance\n\nCanonical selected path: `{row['catalogPath']}`. Exact served source: {url}\n\nSHA-256: `{sha}`; {len(data)} bytes. Pinned Galapagos `{tree['sha']}`, blob `{blob['sha']}`; byte-identical freshly fetched served and pinned sources (2026-11-06). Complete source and Info retained in source.nlogox. Desktop membership is not the selection basis.\n\n{notice}\n\nTypeScript composition uses City Library public APIs and independent RNG; no cross-RNG trajectory equivalence or empirical validation is claimed. Research context: [existing dossier]({manifest['research']}).\n")
 audit=f"## {row['name']}\n\nCanonical path: `{row['catalogPath']}`; SHA-256 `{sha}`. Includes/extensions: see complete declarations below.\n\n### Exact widgets: defaults, topology, actions, reporters and plots\n\n```xml\n{ET.tostring(xml.find('widgets'),encoding='unicode')}\n```\n\n### Complete procedures: equations, phase barriers, update order and stops\n\n```netlogo\n{xml.findtext('code')}\n```\n\n"
 return manifest,audit
with ThreadPoolExecutor(max_workers=5) as pool: results=list(pool.map(pin,rows))
(R/'docs/development/selected-social-sources.json').write_text(json.dumps([r[0] for r in results],indent=2)+'\n')
(R/'docs/development/selected-social-source-audit.md').write_text('# Selected social B02 exact source audit\n\nAll ten immutable browser-catalog identities are reconciled to archived research SHA-256, freshly fetched served bytes and pinned Galapagos Git blob/bytes. No literature or selection work is repeated. Full XML retains Info, shapes and experiments. Procedure annotations follow separately before contract freeze.\n\n'+''.join(r[1] for r in results))
print('Validated',len(results),'exact Web sources')
