import pathlib,json,re,hashlib
p=pathlib.Path(__file__).resolve().parents[2];models=json.load(open(p/'selection.json'))['models'][50:100];errors=[];pubs=set();abstracts=set();counts=[]
for m in models:
 d=json.load(open(p/(m['slug']+'.json')))
 for k in ['slug','name','catalogPath','launchUrl','deliveryBatch']:
  if d[k]!=m[k]:errors.append(m['slug']+': identity mismatch '+k)
 assert (p/(m['slug']+'.md')).exists()
 if not 100<=len(d['miniText'].split())<=160:errors.append(m['slug']+': word count')
 if d['status']!='complete' or d['gaps']:errors.append(m['slug']+': incomplete')
 if len(d['publications'])!=3:errors.append(m['slug']+': publication count')
 if len({a.get('doi') or a['title'] for a in d['publications']})!=3:errors.append(m['slug']+': duplicate work')
 for a in d['publications']:
  for k in ['authors','title','year','venue','url','relevance','verified']:
   if not a.get(k):errors.append(m['slug']+': missing publication '+k)
  v=a['verification']
  for k in ['consultedUrl','checkedAt','evidenceType','access','notes','evidenceFile']:
   if not v.get(k):errors.append(m['slug']+': missing verification '+k)
  if not (p/v['evidenceFile']).exists():errors.append(m['slug']+': missing evidence file')
  if a.get('doi') and not re.match(r'^10\.\d{4,9}/\S+$',a['doi']):errors.append(m['slug']+': malformed DOI')
  if not a['url'].startswith('https://'):errors.append(m['slug']+': unstable URL')
  pubs.add(a.get('doi') or a['url'])
  if 'abstract' in v['evidenceType']:abstracts.add(a.get('doi') or a['url'])
 src=d['modelSource'];b=(p/src['evidenceFile']).read_bytes()
 if hashlib.sha256(b).hexdigest() not in src['revision']:errors.append(m['slug']+': source hash')
 counts.append(len(d['miniText'].split()))
r={'checkedAt':'2026-11-05','assignedModels':50,'completeModels':50-len({e.split(':')[0] for e in errors}),'incompleteModels':len({e.split(':')[0] for e in errors}),'publicationReferences':150,'uniquePublications':len(pubs),'uniquePublicationsWithAbstractEvidence':len(abstracts),'miniTextWordRange':[min(counts),max(counts)],'errors':errors,'limits':'Structural and evidence-file validation plus author-selected scientific relevance assessment. This is literature research, not an independent review or runtime/browser acceptance. Online evidence metadata/abstract/full-text levels are distinguished in each dossier.'}
(p/'batches/biology/validation.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2));raise SystemExit(bool(errors))
