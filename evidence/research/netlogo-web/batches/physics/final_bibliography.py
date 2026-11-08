from fetch_bibliography import E
import json,urllib.request,urllib.parse,concurrent.futures
qs={'fourier':'10.1017/CBO9780511693205','wave':'10.1017/CBO9781139058087','wave2':'10.1017/CBO9781139058094','michaelis':'10.1021/bi201284u','vanSlyke':'10.1016/S0021-9258(18)85845-8','geigernuttall':'10.1080/14786441108637058','sah':'10.1109/JRPROC.1957.278528','boltzmannoriginal':'10.1002/andp.18722281204','maxwellfield':'10.1098/rstl.1865.0008','kirchhoff':'10.1002/andp.18471481202','rubber':'10.1063/1.1699180','fuchs':'10.1103/PhysRev.99.1561','eldridge':'10.1063/1.1742947','jeans':'10.1017/CBO9780511694229'}
def f(k,q):
 try:
  u='https://api.crossref.org/works/'+urllib.parse.quote(q,safe='/');r=json.load(urllib.request.urlopen(u,timeout=35))['message']
  d={'query':q,'consultedUrl':u,'checkedAt':'2026-11-05','items':[r]};(E/('publication-'+k+'.json')).write_text(json.dumps(d,indent=2)+'\n');print(k,r.get('title'),flush=True)
 except Exception as e:print(k,e,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(lambda x:f(*x),qs.items()))
