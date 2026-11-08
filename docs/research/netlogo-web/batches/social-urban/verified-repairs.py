import sys,time,json,urllib.request,urllib.parse
sys.path.insert(0,str(__file__).rsplit('/',1)[0]);from references import E
Q={'gini':'10.1162/003465303762687839','zhang':'10.1080/00222500490480202','clark':'10.1073/pnas.0708155105','castellano':'10.1103/RevModPhys.81.591','jager':'10.1016/S0167-4870(01)00063-0','kephart':'10.1109/RISP.1991.130801','fogel':'10.1109/4235.771167','lane':'10.1103/PhysRevE.58.1425','taxi':'10.1016/S0191-2615(97)00042-8','yangtaxi':'10.1016/S0191-2615(01)00031-5','taxiabm':'10.1016/j.procs.2015.05.162','lewis':'10.1002/9780470693711','signaling':'10.1093/acprof:oso/9780199582944.001.0001','whiteengelen':'10.1068/b200273','tijuana':'10.1215/9780822395553','ecotox':'10.1002/etc.5620180819','smithorder':'10.1080/14697680310001604748','tucker':'10.1016/j.geomorph.2009.03.004','helbingpaths':'10.1038/43196'}
for k,q in Q.items():
 u='https://api.crossref.org/works/'+urllib.parse.quote(q,safe='')
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'CityLibraryResearch (bibliographic verification)'})
  d=json.load(urllib.request.urlopen(req,timeout=25));(E/(k+'-verified.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':d},indent=2));m=d['message']; print(k,m.get('title'),m.get('DOI'),flush=True)
 except Exception as e: print(k,str(e),flush=True)
 time.sleep(2)
