import json,re,html,hashlib
from library import P,E,DATE,fetchdoi
models=json.loads((P/'selection.json').read_text())['models'][150:]
sources={x['slug']:x for x in json.loads((P/'batches/computing/model-sources.json').read_text())}
results=[]
for m in models:
 slug=m['slug'];f=P/(slug+'.json');d=json.loads(f.read_text());s=sources[slug]
 d['modelSource']['url']=s['url']
 cite=re.search(r'\*\s+([^\n]+NetLogo [^\n]+model[^\n]*)',s['info'])
 if cite:d['modelSource']['originalCitation']=cite.group(1)
 d['modelSource']['sourceSnapshot']='evidence/computing/'+slug+'.nlogox'
 for p in d['publications']:
  if p['doi'].lower().startswith('10.48550/'):
   p['authors']=['Stephan Rafler'];continue
  x=fetchdoi(p['doi'])['message'];title=x['title'][0];sub=x.get('subtitle',[])
  if sub and sub[0] and sub[0].lower() not in title.lower():title+=': '+sub[0]
  p['title']=html.unescape(re.sub('<[^>]+>','',title))
  if p['doi'].lower()=='10.1002/9780470317013':
   p['title']='Spatial Tessellations: Concepts and Applications of Voronoi Diagrams'
   p['verification']['additionalConsultedUrls']=['https://onlinelibrary.wiley.com/doi/book/10.1002/9780470317013']
   p['verification']['notes']+=' Wiley book page also checked: full title, all five listed contributors, 12 July 2000, second edition. Publisher summary and contents accessible; chapters not read.'
  if x.get('publisher'):p['publisher']=x['publisher']
  if x.get('volume'):p['volume']=x['volume']
  if x.get('issue'):p['issue']=x['issue']
  if x.get('page'):p['pages']=x['page']
  if x.get('ISBN'):p['isbn']=x['ISBN']
  if x.get('editor') and not x.get('author'):p['contributorRole']='editor'
  p['verification']['bibliographicScope']='Complete contributor list from primary DOI registration metadata; initials are preserved when the record does not expand them.'
  if p['doi'].lower()=='10.1109/icnn.1995.488968':p['verification']['notes']+=' Publication year 1995 corroborated by original NetLogo Info reference and registered ICNN-95 event identity; Crossref published dates are absent.'
  if p['doi'].lower()=='10.1109/icec.1998.699146':p['verification']['notes']+=' Publication year 1998 corroborated by registered event name; Crossref published dates are absent.'
 for p in d['publications']:
  for marker in ['Publication year 1995 corroborated by original NetLogo Info reference and registered ICNN-95 event identity; Crossref published dates are absent.', 'Publication year 1998 corroborated by registered event name; Crossref published dates are absent.', 'Wiley book page also checked: full title, all five listed contributors, 12 July 2000, second edition. Publisher summary and contents accessible; chapters not read.']:
   parts=p['verification']['notes'].split(marker)
   if len(parts)>2:p['verification']['notes']=parts[0]+marker+''.join(parts[1:])
 errors=[]
 if d['status']!='complete':errors.append('not complete')
 n=len(d['miniText'].split())
 if not 100<=n<=160:errors.append('word count')
 if len(d['publications'])!=3 or len({p['doi'].lower() for p in d['publications']})!=3:errors.append('three unique sources')
 for p in d['publications']:
  for k in ['authors','title','year','venue','url','relevance']:
   if not p.get(k):errors.append('missing publication '+k)
  if not p['verification'].get('verified'):errors.append('unverified source')
  if not (P/p['verification']['snapshot']).exists():errors.append('missing metadata snapshot')
 if hashlib.sha256((E/(slug+'.nlogox')).read_bytes()).hexdigest()!=s['sha256']:errors.append('source hash mismatch')
 if errors:raise ValueError((slug,errors))
 f.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 md='# '+d['name']+'\n\nStatus: complete. Scientific research checked '+DATE+'.\n\n'+d['miniText']+'\n\n## Scientific publications\n\n'
 for i,p in enumerate(d['publications'],1):
  role=' (editor)' if p.get('contributorRole')=='editor' else ''
  md+=f"{i}. **{'; '.join(p['authors'])}{role} ({p['year']}). {p['title']}.** {p['venue']}. [{p['doi']}]({p['url']}).\n\n   {p['relevance']}\n\n   Verified {DATE}: [{p['verification']['evidenceType']}]({p['verification']['consultedUrl']}). {p['verification']['access']} {p['verification']['notes']}\n\n"
 md+='## Original-model provenance\n\n[Served original model]('+s['url']+'). '+d['modelSource']['revision']+'.\n\n'
 if cite:md+='Original model citation: '+cite.group(1)+'\n\n'
 md+=d['modelSource']['notes']+'\n\nFull source and original Info are retained in `evidence/computing/'+slug+'.nlogox` and `evidence/computing/'+slug+'-info.txt`.\n'
 (P/(slug+'.md')).write_text(md)
 results.append({'slug':slug,'status':'complete','miniTextWords':n,'verifiedUniquePublications':3,'sourceHashVerified':True})
report={'checkedAt':DATE,'assignedSelectionOrders':[151,200],'total':50,'complete':50,'incomplete':0,'models':results,'limitations':['This is author research QA, not an independent implementation review.','Literature access is individually recorded. DOI metadata verification is not full-text reading.','Contributor initials are retained where primary records do not expand them.','No browser, runtime or TypeScript acceptance is claimed.']}
(P/'batches/computing/validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'total':50,'complete':50,'incomplete':0,'wordCountRange':[min(x['miniTextWords'] for x in results),max(x['miniTextWords'] for x in results)]}))
