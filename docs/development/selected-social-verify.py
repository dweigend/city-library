"""Verify owned identity, frozen scripts and executed B02 evidence; never mutate global ledger."""
import hashlib, json, pathlib, struct, subprocess
R=pathlib.Path(__file__).resolve().parents[2]
read=lambda p:json.loads((R/p).read_text())
rows=read('docs/development/selected-social-sources.json')
slugs=['consumer-choice','rebellion','language-change','party','ethnocentrism','minority-game','rumor-mill','signaling-game','piaget-vygotsky-game','heroes-and-cowards']
assert [r['slug'] for r in rows]==slugs
selection=read('experiments/catalog/selection/selection.json')
selected=next(v for v in selection.values() if isinstance(v,list) and v and isinstance(v[0],dict) and 'slug' in v[0])
assert [(r['slug'],r['catalogPath']) for r in selected if r['deliveryBatch']=='B02']==[(r['slug'],r['catalogPath']) for r in rows]
inv=read('experiments/catalog/inventory.json');tree=read('experiments/catalog/pinned/galapagos-tree.json');blobs={r['path']:r for r in tree['tree']}
served={r['slug']:r for r in read('docs/development/selected-social-evidence/final-served-chunks.json')['records']}
images=[]
for row in rows:
 slug=row['slug'];data=(R/f'experiments/{slug}/source.nlogox').read_bytes();sha=hashlib.sha256(data).hexdigest()
 assert sha==row['sha256'] and len(data)==row['bytes']
 inventoryrow=next(r for r in inv['rows'] if r['catalogKey']=='public/'+row['optionValue']);assert inventoryrow['sha256']==sha and inventoryrow['bytes']==len(data)
 assert hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==blobs['public/'+row['optionValue']+'.nlogox']['sha']
 dossier=read(f'docs/research/netlogo-web/{slug}.json');assert dossier['modelSource']['sha256']==sha
 for name in ['model.ts','ui.ts','NOTICE.md']:assert (R/f'experiments/{slug}/{name}').is_file()
 original=read(f'docs/development/selected-social-evidence/{slug}-original.json');assert original['sessionSourceSHA256']==sha
 target=read(f'docs/development/selected-social-evidence/{slug}-target.json');assert target['marker']==f'selected-social-b02:{slug}:{sha}'
 assert next(r['sha256'] for r in target['chunks'] if r['url']==target['chunk'])==served[slug]['sha256']
 assert not target['duplicateFields'] and not target['errors'] and not target['uiChecks']['errors'] and not target['uiChecks']['unlabeled']
 assert target['uiChecks']['paused'] and target['uiChecks']['pause']==target['uiChecks']['stable']
 assert not target['mobileLight']['overflow'] and not target['uiChecks']['overflow']
 assert target['keyboardFocus']['focusedVisible'] and target['keyboardFocus']['outlineWidth']=='2px'
 assert target['setupTick']==0 and target['setupMonitors']['Tick']=='0'
 assert target['publicBrowserProbe']['slug']==slug and target['publicBrowserProbe']['assertions']>0
 paths=[f'{slug}-original-{suffix}.png' for suffix in ['setup','progress']]+list(target['images'].values())
 assert len(paths)==7
 for path in paths:
  b=(R/'docs/development/selected-social-evidence'/path).read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n';assert min(struct.unpack('>II',b[16:24]))>100;images.append(path)
for line in (R/'docs/development/selected-social-example-SHA256SUMS').read_text().splitlines():
 sha,path=line.split(maxsplit=1);assert hashlib.sha256((R/path).read_bytes()).hexdigest()==sha
paths=subprocess.check_output(['git','diff','--name-only','115e640'],cwd=R,text=True).splitlines()
for p in paths:
 assert p.startswith(tuple('experiments/'+s+'/' for s in slugs)) or p.startswith(('examples/selected-social/','tests/selected-social','docs/development/selected-social')),p
print(f'PASS: {len(rows)} exact Web identities/sources, five frozen scripts, ten pre-format paired original/target records, {len(images)} pre-format PNGs, captured pre-format served chunk reconciliation and owned diff.')
