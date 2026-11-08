import json,urllib.request,urllib.parse,pathlib,concurrent.futures,time
p=pathlib.Path(__file__).resolve().parents[2]; ep=p/'evidence/biology'; qs=json.load(open(pathlib.Path(__file__).with_name('queries.json')))
def fetch(kv):
 k,q=kv; f=ep/(k+'-crossref-search.json')
 if f.exists(): return k,'cached'
 u='https://api.crossref.org/works?'+urllib.parse.urlencode({'query.title':q,'rows':3})
 for attempt in range(3):
  try:
   x=json.load(urllib.request.urlopen(u,timeout=50)); f.write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');return k,x['message']['items'][0].get('title')
  except Exception as e:
   if attempt==2:return k,str(e)
   time.sleep(3)
with concurrent.futures.ThreadPoolExecutor(max_workers=1) as ex:
 for k,v in ex.map(fetch,qs.items()): print(k,v,flush=True)
