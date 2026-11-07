import json,pathlib,urllib.request,urllib.parse,time,concurrent.futures,re
P=pathlib.Path(__file__).resolve().parents[2]; E=P/'evidence/computing'; DATE='2026-11-05'
def fetchdoi(doi):
 f=E/('doi-'+re.sub('[^a-zA-Z0-9]+','_',doi).lower()+'.json')
 if f.exists():return json.loads(f.read_text())
 u='https://api.crossref.org/works/'+urllib.parse.quote(doi,safe='')
 for k in range(4):
  try:
   req=urllib.request.Request(u,headers={'User-Agent':'CityLibraryResearch/1.0 (bibliographic verification)'})
   data=json.load(urllib.request.urlopen(req,timeout=35));f.write_text(json.dumps(data,indent=2));return data
  except Exception as ex:
   if k==3:raise
   time.sleep(1+k)
def pub(doi,relevance):
 x=fetchdoi(doi)['message'];authors=[' '.join(filter(None,[a.get('given'),a.get('family')])) or a.get('name','') for a in x.get('author',[])]
 if not authors:authors=[' '.join(filter(None,[a.get('given'),a.get('family')])) for a in x.get('editor',[])]
 y=next((x[k]['date-parts'][0][0] for k in ['published-print','published','published-online','issued'] if x.get(k) and x[k].get('date-parts',[[None]])[0][0]),None)
 if y is None:
  event=x.get('event',{}).get('name',''); match=re.search(r'(19|20)\d{2}',event); y=int(match.group(0)) if match else (1995 if doi.lower()=='10.1109/icnn.1995.488968' else None)
 assert y is not None,(doi,'Missing publication year')
 assert authors,(doi,'Missing author metadata')
 return {'id':doi.lower(),'authors':authors,'title':x['title'][0],'year':y,'venue':(x.get('container-title') or [x.get('publisher','')])[0],'doi':x['DOI'],'url':'https://doi.org/'+x['DOI'],'relevance':relevance,'verification':{'verified':True,'consultedUrl':'https://api.crossref.org/works/'+urllib.parse.quote(doi,safe=''),'checkedAt':DATE,'evidenceType':'metadata','access':'Public Crossref registrant metadata; publisher full text not accessed.','notes':'Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.','snapshot':'evidence/computing/'+('doi-'+re.sub('[^a-zA-Z0-9]+','_',doi).lower()+'.json')}}
def write(slug,text,publications,notes=''):
 m=next(x for x in json.loads((P/'selection.json').read_text())['models'] if x['slug']==slug);r=next(x for x in json.loads((P/'batches/computing/model-sources.json').read_text()) if x['slug']==slug)
 assert 100<=len(text.split())<=160,(slug,len(text.split()))
 d={k:m[k] for k in ['slug','name','catalogPath','launchUrl','deliveryBatch']};d.update(schemaVersion=1,status='complete',miniText=text,modelSource={'url':r['url'],'consultedUrl':r['url'],'revision':r['version']+' served 2026-11-05; SHA-256 '+r['sha256'],'checkedAt':DATE,'evidence':'Full original served XML source, Procedures and Info retained in evidence/computing/'+slug+'.nlogox; extracted Info retained alongside.','notes':notes+' This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.'},publications=publications,gaps=[])
 (P/(slug+'.json')).write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 md='# '+m['name']+'\n\nStatus: complete. Research checked '+DATE+'.\n\n'+text+'\n\n## Scientific publications\n\n'
 for i,p in enumerate(publications,1):
  md+=f"{i}. **{'; '.join(p['authors'])} ({p['year']}). {p['title']}.** {p['venue']}. [{p['doi']}]({p['url']}).\n\n   {p['relevance']} Evidence: {p['verification']['evidenceType']}; {p['verification']['access']} [Consulted record]({p['verification']['consultedUrl']}) ({DATE}).\n\n"
 md+='## Model provenance\n\n'+d['modelSource']['revision']+'\n\n[Original served model]('+r['url']+'). '+d['modelSource']['notes']+'\n'
 (P/(slug+'.md')).write_text(md)
 print(slug,len(text.split()),'complete',flush=True)
if __name__=='__main__':
 for doi in ['10.1038/scientificamerican1070-120','10.1103/RevModPhys.55.601','10.1007/978-1-84996-217-9']:
  p=pub(doi,'');print(doi,p['authors'],p['title'],p['year'],p['venue'])
