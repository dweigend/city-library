import json,urllib.request,urllib.parse,pathlib,time
p=pathlib.Path(__file__).resolve().parents[2];ep=p/'evidence/biology'
queries={'spatialdaisy':'Aspects of environmental evolution under self-regulating life forms','calvin':'The path of carbon in photosynthesis','kessin':'Dictyostelium Evolution Cell Biology and the Development of Multicellularity','enderling':'Paradoxical dependencies of tumor dormancy and progression on basic cell kinetics','baldwin':'A New Factor in Evolution','land':'The eyes of advanced insects','clifford':'A model for spatial conflict','pursuit':'Formations of vehicles in cyclic pursuit','seeley':'Honeybee Democracy','quorum':'Quorum sensing during nest-site selection by honeybee swarms','charnov':'The theory of sex allocation','konopka':'Buoyancy regulation and vertical migration by Oscillatoria rubescens','chung':'A stochastic single-molecule event triggers phenotype switching of a bacterial cell'}
dois={'moran':'10.1017/S0305004100033193','turing':'10.1098/rstb.1952.0012','hinton':'10.1007/BF02136563','kermack':'10.1098/rspa.1927.0118','mendel':'10.1534/genetics.116.195198','castle':'10.1007/978-1-4612-6164-9','frameshift':'10.1038/1921227a0','crick':'10.1038/227561a0','tilman':'10.1515/9780691209654'}
for k,q in queries.items():
 u='https://api.crossref.org/works?'+urllib.parse.urlencode({'query.title':q,'rows':4})
 try:
  x=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'CityLibraryResearch/1.0'}),timeout=45));(ep/(k+'-crossref-refined.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');print(k,[(a.get('title'),a.get('DOI'),a.get('author',[{}])[0].get('family')) for a in x['message']['items']],flush=True)
 except Exception as e:print(k,e,flush=True)
 time.sleep(.5)
for k,d in dois.items():
 u='https://api.crossref.org/works/'+urllib.parse.quote(d,safe='')
 try:
  x=json.load(urllib.request.urlopen(u,timeout=45));(ep/(k+'-crossref-direct.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');print(k,x['message'].get('title'),x['message'].get('author'),flush=True)
 except Exception as e:print(k,e,flush=True)
 time.sleep(.5)
