import json,urllib.request,urllib.parse,pathlib,time
p=pathlib.Path(__file__).resolve().parents[2];ep=p/'evidence/biology'
dois={'spatialdaisy':'10.3402/tellusb.v49i3.15965','kessin':'10.1017/CBO9780511525315','land':'10.1093/acprof:oso/9780199581139.001.0001','prusinkiewicz':'10.1007/978-1-4613-8476-2','walsby':'10.1128/mr.58.1.94-144.1994','gunn':'10.1242/jeb.14.2.178'}
queries={'castle':'The coat colors of mice a model for mammalian gene action and interaction','charnov':'Charnov The Theory of Sex Allocation','waloff':'The mechanisms of humidity reactions of terrestrial isopods','isopod':'Aggregation and sheltering behaviour in a terrestrial isopod','silvers':'The Coat Colors of Mice','phillips':'A critical analysis of the role of resistance exercise training in the control of muscle mass'}
for k,d in dois.items():
 u='https://api.crossref.org/works/'+urllib.parse.quote(d,safe='')
 try:
  x=json.load(urllib.request.urlopen(u,timeout=45));(ep/(k+'-crossref-direct.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');print(k,x['message'].get('title'),x['message'].get('author'),flush=True)
 except Exception as e:print(k,e,flush=True)
 time.sleep(.5)
for k,q in queries.items():
 u='https://api.crossref.org/works?'+urllib.parse.urlencode({'query.bibliographic':q,'rows':3})
 try:
  x=json.load(urllib.request.urlopen(u,timeout=45));(ep/(k+'-crossref-refined.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':x},indent=2)+'\n');print(k,[(a.get('title'),a.get('DOI'),a.get('author',[{}])[0].get('family')) for a in x['message']['items']],flush=True)
 except Exception as e:print(k,e,flush=True)
 time.sleep(.5)
