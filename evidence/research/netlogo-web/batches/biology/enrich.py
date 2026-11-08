import json,urllib.request,urllib.parse,pathlib,concurrent.futures,runpy,time
p=pathlib.Path(__file__).resolve().parents[2];ep=p/'evidence/biology';sources={}
for m in json.load(open(p/'selection.json'))['models'][50:100]:
 for a in json.load(open(p/(m['slug']+'.json')))['publications']:
  if a.get('doi'):sources[a['id']]=a['doi']
sources['nilsson']='10.1098/rspb.1994.0048'
def fetch(kd):
 k,d=kd;f=ep/(k+'-europepmc.json')
 if f.exists():return k,'cached'
 u='https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':'DOI:"'+d+'"','format':'json','resultType':'core','pageSize':2})
 try:
  x=json.load(urllib.request.urlopen(u,timeout=50));f.write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');a=x.get('resultList',{}).get('result',[]);return k,[(z.get('authorString'),bool(z.get('abstractText')),z.get('pubYear')) for z in a]
 except Exception as e:return k,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as ex:
 for x in ex.map(fetch,sources.items()):print(x,flush=True)
