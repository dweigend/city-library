"""Read saved evidence; render the 50 owned dossiers and audit their structure."""
import pathlib,json,urllib.parse,collections
ROOT=pathlib.Path(__file__).resolve().parents[2]; models=json.loads((ROOT/'selection.json').read_text())['models'][:50]; used={};errors=[]
for m in models:
 f=ROOT/(m['slug']+'.json');d=json.loads(f.read_text())
 assert d['status']=='complete' and all(d[k]==m[k] for k in ['slug','catalogPath','launchUrl','deliveryBatch'])
 assert 100<=len(d['miniText'].split())<=160 and len(d['publications'])==3
 assert len({p['doi'] or p['url'] for p in d['publications']})==3
 for p in d['publications']:
  if p['doi']:p['url']='https://doi.org/'+urllib.parse.quote(p['doi'],safe='/:;()')
  assert p['year'] and p['authors'] and all(x.strip() for x in p['authors'])
  assert (ROOT/p['verification']['evidencePath']).is_file()
  if p['id']=='skyrms':p['venue']='Oxford University Press'
  if p['id']=='liggett':p['venue']='Springer New York; Grundlehren der mathematischen Wissenschaften'
  if p['id']=='tijuana':p['creatorRole']='editors';p['verification']['notes']+=' The two named creators are editors of this scholarly collection.'
  used[p['id']]=p
 f.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 lines=[f"# {d['name']}",'',f"Status: **complete** · Checked: 2026-11-05 · Mini-text: {len(d['miniText'].split())} words",'',d['miniText'],'','## Model provenance','',f"[Selected NetLogo Web model]({d['launchUrl']}) · [Served source snapshot]({d['modelSource']['evidencePath']})",'',d['modelSource']['citation'],'','Scientific origin recorded in Info: '+d['modelSource']['scientificOrigin'],'',f"Source revision: {d['modelSource']['revision']}. SHA-256: `{d['modelSource']['sha256']}`.",'','This literature dossier is separate from runtime execution, empirical validation and independent implementation approval.','','## Scientific publications']
 for i,p in enumerate(d['publications'],1):
  v=p['verification'];role=' (editors)' if p.get('creatorRole')=='editors' else ''
  lines.extend(['',f"### [{i}] {p['title']}",'',f"{'; '.join(p['authors'])}{role} ({p['year']}). *{p['venue']}*. [Canonical record]({p['url']}). DOI: {p['doi'] or 'not identified on consulted primary page'}.",'','Model relevance: '+p['relevance']+'.','',f"Verification: [{v['evidenceType']}]({v['consultedUrl']}), {v['checkedAt']}. {v['access']}. {v['notes']} [Saved evidence]({v['evidencePath']})."])
 (ROOT/(m['slug']+'.md')).write_text('\n'.join(lines)+'\n')
# Save the corrected records so a repeat build preserves editorial fixes.
cpath=pathlib.Path(__file__).parent/'custom.json';custom=json.loads(cpath.read_text())
for k in ['gershenson','kephart']:
 custom[k]={k:v for k,v in used[k].items() if k not in ['id','relevance']}
cpath.write_text(json.dumps(custom,indent=2,ensure_ascii=False)+'\n')
summary={'checkedAt':'2026-11-05','ownedSelectionOrders':[1,50],'models':50,'complete':50,'incomplete':0,'publicationSlots':150,'uniquePublications':len(used),'wordCountRange':[min(len(json.loads((ROOT/(m['slug']+'.json')).read_text())['miniText'].split()) for m in models),max(len(json.loads((ROOT/(m['slug']+'.json')).read_text())['miniText'].split()) for m in models)],'evidenceTypesForUniqueWorks':dict(collections.Counter(p['verification']['evidenceType'] for p in used.values())),'errors':errors,'limits':'Bibliographic and dossier consistency checks; not independent implementation review, browser acceptance or empirical validation. Initials are preserved when verified primary metadata uses initials.'}
(pathlib.Path(__file__).parent/'validation.json').write_text(json.dumps(summary,indent=2)+'\n')
(pathlib.Path(__file__).parent/'used-publications.json').write_text(json.dumps(used,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(summary,indent=2))
