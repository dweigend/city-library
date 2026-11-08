import json,pathlib,urllib.request,concurrent.futures,xml.etree.ElementTree as ET,hashlib
p=pathlib.Path(__file__).resolve().parents[2]; models=[m for m in json.loads((p/'selection.json').read_text())['models'] if m['selectionOrder']>=151]
def go(m):
 u=m['launchUrl'].split('#')[1];f=p/'evidence/computing'/f"{m['slug']}.nlogox"
 try:
  b=urllib.request.urlopen(u,timeout=40).read();f.write_bytes(b);r=ET.fromstring(b);info=r.findtext('info') or ''
  (p/'evidence/computing'/f"{m['slug']}-info.txt").write_text(info)
  return {'slug':m['slug'],'url':u,'version':r.get('version'),'sha256':hashlib.sha256(b).hexdigest(),'info':info,'code':r.findtext('code')}
 except Exception as e:return {'slug':m['slug'],'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:results=list(ex.map(go,models))
(p/'batches/computing/model-sources.json').write_text(json.dumps(results,indent=2))
for r in results:
 print('\n###',r['slug'],r.get('error',''))
 print(r.get('info','')[:2200])
