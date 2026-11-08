"""Acquire pinned primary-source bytes for this data audit; no library runtime."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib,json,urllib.request,urllib.parse
ROOT=Path(__file__).resolve().parents[3]
EVIDENCE=ROOT/'docs/development/gis-data-audit-evidence'
pinned=json.loads((ROOT/'docs/development/selected-host-capabilities-evidence/gis-pinned-asset-manifest.json').read_text())
revision=pinned['revision']
def acquire(row):
    url=f"https://raw.githubusercontent.com/NetLogo/Galapagos/{revision}/"+urllib.parse.quote(row['path'],safe='/')
    with urllib.request.urlopen(url,timeout=40) as response: data=response.read()
    blob=hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
    assert len(data)==row['size'],row['path']
    assert blob==row['sha'],row['path']
    dest=ROOT/'experiments/gis-general-examples/data'/Path(row['path']).name
    if dest.exists(): assert dest.read_bytes()==data,'Refusing to overwrite different bytes'
    else: dest.write_bytes(data)
    stem=dest.stem
    notices=['docs/development/gis-data-audit-evidence/Galapagos-LICENSE.txt']+([f'experiments/gis-general-examples/data/{stem}.txt'] if stem in ['cities','rivers'] else ['experiments/gis-general-examples/data/countries.xml'] if stem=='countries' else [])
    rights='Country dataset-specific metadata retained; conditional redistribution language, not CC0' if stem=='countries' else 'Lineage/attribution retained, no explicit dataset-specific license grant found in TXT' if stem in ['cities','rivers'] else 'No file-specific data license/attribution identified in these 22 assets; repository software license alone not treated as dataset grant'
    return {'noticeFiles':notices,'rightsFinding':rights,'name':dest.name,'localPath':str(dest.relative_to(ROOT)),'upstreamPath':row['path'],'revision':revision,'primaryURL':url,'bytes':len(data),'gitBlobSHA1':blob,'sha256':hashlib.sha256(data).hexdigest(),'expectedSizeMatches':True,'expectedGitBlobMatches':True,'noticeContext':{'cities':'cities.txt','rivers':'rivers.txt','countries':'countries.xml'}.get(dest.stem,'No file-specific grant identified; see gis-data-audit.md')}
with ThreadPoolExecutor(max_workers=6) as pool: rows=list(pool.map(acquire,pinned['assets']))
assert len(rows)==22 and sum(r['bytes'] for r in rows)==1449413
(EVIDENCE/'asset-manifest.json').write_text(json.dumps({'retrievedAt':'2026-11-06','revision':revision,'files':rows,'count':len(rows),'totalBytes':sum(r['bytes'] for r in rows)},indent=2)+'\n')
tree=json.loads((ROOT/'experiments/catalog/pinned/galapagos-tree.json').read_text())
license_row=next(r for r in tree['tree'] if r['path']=='LICENSE.txt')
url=f'https://raw.githubusercontent.com/NetLogo/Galapagos/{revision}/LICENSE.txt'
with urllib.request.urlopen(url,timeout=40) as response:data=response.read()
assert len(data)==license_row['size'] and hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()==license_row['sha']
(EVIDENCE/'Galapagos-LICENSE.txt').write_bytes(data)
(EVIDENCE/'license-source.json').write_text(json.dumps({'primaryURL':url,'revision':revision,'upstreamPath':'LICENSE.txt','bytes':len(data),'gitBlobSHA1':license_row['sha'],'sha256':hashlib.sha256(data).hexdigest(),'expectedSizeMatches':True,'expectedGitBlobMatches':True},indent=2)+'\n')
print(f"Verified {len(rows)} assets / {sum(r['bytes'] for r in rows)} bytes and pinned repository LICENSE.txt")
