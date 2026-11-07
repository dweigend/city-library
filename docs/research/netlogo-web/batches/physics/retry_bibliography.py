import sys,urllib.request,urllib.parse,json,concurrent.futures
from fetch_bibliography import ROOT,E,queries,fetch
ov={
'cundall':'10.1680/geot.1979.29.1.47','shewmon':'10.1007/978-3-319-48206-4','avrami1':'10.1063/1.1750380','avrami2':'10.1063/1.1750631','sander':'10.1080/001075100409698','maxwellcontrol':'10.1098/rspl.1867.0055','astrom':'10.1515/9781400828739','wiener':'10.7551/mitpress/11810.001.0001','chrom1':'10.1042/bj0351358','chrom2':'10.1016/0009-2509(56)80003-1','rohsenow':'10.1115/1.4015984','bennett':'10.1007/BF02084158','maxwellgas':'10.1080/14786446008642818','barometric':'10.1119/1.18555','bunimovich':'10.1007/BF01019785','rouse':'10.1063/1.1699180','degennes':'10.1063/1.1675789','lj':'10.1098/rspa.1924.0082','kedem':'10.1016/0006-3002(58)90130-5','rutherford':'10.1080/14786440508637080','geiger':'10.1098/rspa.1909.0054','drude':'10.1002/andp.19003060312','shockley':'10.1002/j.1538-7305.1949.tb03645.x','sah':'10.1109/JRPROC.1957.278528','peierls':'10.1088/0370-1328/52/1/305','nabarro':'10.1088/0959-5309/59/2/309','courant':'10.1147/rd.112.0215','lga':'10.1007/BF01024432','briggs':'10.1042/bj0190338','michaelis':'10.1021/bi400571b','henderson':'10.1152/ajplegacy.1908.21.2.173','vanSlyke':'10.1016/S0021-9258(18)85885-X','bronsted':'10.1002/recl.19230420815','gillespie1':'10.1016/0021-9991(76)90041-3','gillespie2':'10.1021/j100540a008','mcquarrie':'10.1063/1.1726384','field':'10.1063/1.1681288','winfree':'10.1126/science.175.4022.634','gerhardt':'10.1016/0167-2789(90)90042-3','arrhenius':'10.1515/zpch-1889-0408','flory':'10.1021/ja01856a061','rutherfordsoddy':'10.1080/14786440209462856','bateman':'10.1017/S0305004100000270'}
def retry(k):
 if (E/('publication-'+k+'.json')).exists(): return
 q=ov.get(k,queries[k]);
 try:
  if q.startswith('10.'):
   u='https://doi.org/'+urllib.parse.quote(q,safe='/'); req=urllib.request.Request(u,headers={'Accept':'application/vnd.citationstyles.csl+json'}); m=json.load(urllib.request.urlopen(req,timeout=35));items=[m]
  else:
   # Primary title search; metadata inspected before accepting.
   u='https://api.crossref.org/works?query.title='+urllib.parse.quote(q)+'&rows=1'; items=json.load(urllib.request.urlopen(u,timeout=35))['message']['items']
  d={'query':q,'consultedUrl':u,'checkedAt':'2026-11-05','items':items};(E/('publication-'+k+'.json')).write_text(json.dumps(d,indent=2)+'\n');print(k,[(i.get('title'),i.get('DOI')) for i in items],flush=True)
 except Exception as e:print(k,e,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(retry,queries))
