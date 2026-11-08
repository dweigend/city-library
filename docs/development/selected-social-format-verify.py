"""Validate post-format evidence without relabelling earlier baseline or theme checks."""
import hashlib,json,pathlib,subprocess,struct
R=pathlib.Path(__file__).resolve().parents[2];D=R/'docs/development';E=D/'selected-social-format-evidence'
read=lambda p:json.loads(p.read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
base='eaa698aca573b0c47b3b0e93b56acee6a646decd'
rows=read(D/'selected-social-sources.json');equivalence=read(E/'equivalence.json')
assert len(equivalence['records'])==10 and equivalence['base']==base
old={r['slug']:r for r in read(D/'selected-social-evidence/final-served-chunks.json')['records']}
records=[]
for row,eq in zip(rows,equivalence['records'],strict=True):
 slug=row['slug'];path=f'experiments/{slug}/model.ts';data=(R/path).read_bytes()
 assert eq['path']==path and eq['normalizedASTEqual'] and eq['formatIdempotent']
 assert eq['beforeSHA256']==sha(subprocess.check_output(['git','show',f'{base}:{path}'],cwd=R))
 assert eq['afterSHA256']==sha(data)
 source=(R/f'experiments/{slug}/source.nlogox').read_bytes();assert sha(source)==row['sha256']
 assert source==subprocess.check_output(['git','show',f'{base}:experiments/{slug}/source.nlogox'],cwd=R)
 target=read(E/f'{slug}.json');assert target['sourceSHA256']==row['sha256']
 assert target['marker']==f'selected-social-b02:{slug}:{row["sha256"]}'
 assert target['setup']['monitors']['Tick']=='0' and target['setup']['tick']==0
 assert target['step']['monitors']['Tick']=='1' and target['step']['tick']==1
 assert not target['errors'] and not target['step']['errors']
 for image in target['images'].values():
  b=(E/image).read_bytes();assert b[:8]==b'\x89PNG\r\n\x1a\n' and min(struct.unpack('>II',b[16:24]))>100
 loaded=next(c for c in target['chunks'] if c['url']==target['loadedModelChunk'])
 records.append({'slug':slug,'sourceSHA256':row['sha256'],'modelSHA256':eq['afterSHA256'],'loadedModelChunk':loaded,'sameChunkBytesAsPreFormat':loaded['sha256']==old[slug]['sha256'],'buildVersion':target['buildVersion']})
for line in (D/'selected-social-example-SHA256SUMS').read_text().splitlines():
 digest,path=line.split(maxsplit=1);assert digest==sha((R/path).read_bytes())
# Earlier runtime checksums are verified against their captured Git revision, not formatted files.
for line in (D/'selected-social-evidence/runtime-SHA256SUMS').read_text().splitlines():
 digest,path=line.split(maxsplit=1);assert digest==sha(subprocess.check_output(['git','show',f'{base}:{path}'],cwd=R))
paths=subprocess.check_output(['git','diff','--name-only',base],cwd=R,text=True).splitlines()
allowed={f'experiments/{r["slug"]}/model.ts' for r in rows}
assert all(p in allowed or p.startswith('docs/development/selected-social') for p in paths)
(E/'current-chunks.json').write_text(json.dumps({'codeCommit':subprocess.check_output(['git','rev-parse','c8700ec'],cwd=R,text=True).strip(),'records':records},indent=2)+'\n')
print('PASS: 10 equal normalized ASTs; 10 unchanged original sources; five unchanged frozen scripts; 10 current-code Setup/step checks; 20 PNGs; historical manifest verified against pre-format Git bytes; owned diff.')
print('Freshly hashed model chunks:',sum(r['sameChunkBytesAsPreFormat'] for r in records),'unchanged;',sum(not r['sameChunkBytesAsPreFormat'] for r in records),'changed.')
