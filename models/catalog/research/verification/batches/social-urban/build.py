import json,pathlib,re,html,hashlib,xml.etree.ElementTree as ET
ROOT=pathlib.Path(__file__).resolve().parents[2]; E=ROOT/'evidence/social-urban'; DATE='2026-11-05'
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',s))).strip()
def ref(k,relevance):
 custom=json.loads((pathlib.Path(__file__).parent/'custom.json').read_text()) if (pathlib.Path(__file__).parent/'custom.json').exists() else {}
 if k in custom:
  p=custom[k].copy();p['id']=k;p['relevance']=relevance;return p
 files=[E/(k+'-verified.json'),E/(k+'-crossref.json')]; f=next((f for f in files if f.exists()),None)
 if f is None:raise ValueError(k)
 d=json.loads(f.read_text());m=d['response']['message'];m=m.get('items',[m])[0]
 if k=='lewis' and 'items' in d['response']['message']:m=d['response']['message']['items'][1]
 if k=='sassen':m=d['response']['message']['items'][1]
 title=clean(m['title'][0]);subtitle=m.get('subtitle',[])
 if subtitle:title+=': '+clean(subtitle[0])
 abstract=clean(m.get('abstract',''));doi=m['DOI'];pub=m.get('published',m.get('issued'))['date-parts'][0][0]
 if k=='kephart':pub=1991
 if k=='volterra':title=title.removesuffix('1')
 if k=='schelling':title=title.rstrip('†‡')
 if k=='skyrms':m['publisher']='Oxford University Press'
 if k=='gershenson':m['author']=[{'given':'Carlos','family':'Gershenson'}]
 if k=='nash':title=title.replace('n -person','n-person')
 return {'id':k,'creatorRole':'author' if m.get('author') else 'editor','authors':[clean((a.get('given','')+' '+a.get('family','')).strip()) for a in (m.get('author') or m.get('editor') or [])],'title':title,'year':pub,'venue':clean((m.get('container-title') or [m.get('publisher','')])[0]),'doi':doi,'url':'https://doi.org/'+doi,'relevance':relevance,'verification':{'consultedUrl':d['consultedUrl'],'checkedAt':DATE,'evidenceType':'abstract' if abstract else 'metadata','access':'Public Crossref registrant metadata'+('; publisher-deposited abstract available' if abstract else '; full-text access not established'),'notes':'Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed.','evidencePath':str(f.relative_to(ROOT)),'evidenceSummary':abstract[:900] if abstract else 'Bibliographic metadata only; relevance is a bounded theoretical comparison, not a claim to have read inaccessible full text.'}}
def build(slug,question,mechanism,limits,outcome,refs):
 m=next(m for m in json.loads((ROOT/'selection.json').read_text())['models'] if m['slug']==slug)
 pubs=[ref(k,r) for k,r in refs]
 text=f"The scientific question is whether {question}. In NetLogo's {m['name']} model, {mechanism}. The selected literature connects this mechanism to {outcome}: {refs[0][1]} [1]; {refs[1][1]} [2]; {refs[2][1]} [3]. {limits}. The original NetLogo behavior is the baseline for reimplementation. This simulation offers a controlled thought experiment, and agreement with its output does not establish empirical validation."
 n=len(text.split())
 if n<100:text+=' Parameters, initial conditions, spatial boundaries and update order should be varied explicitly before drawing conclusions from a single run.'
 assert 100<=len(text.split())<=160,(slug,len(text.split()))
 b=(E/(slug+'.nlogox')).read_bytes();r=ET.fromstring(b);info=(E/(slug+'-info.txt')).read_text(); i=info.find('For the model itself:');cite=info[i:info.find('Please cite',i)] if i>=0 else ''
 credits=re.search(r'## CREDITS[^\n]*\n(.*?)(?=\n## |\Z)',info,re.S)
 d={k:m[k] for k in ['slug','name','catalogPath','launchUrl','deliveryBatch']};d.update(schemaVersion=1,status='complete',miniText=text,modelSource={'url':m['launchUrl'].split('#')[1],'consultedUrl':m['launchUrl'].split('#')[1],'revision':'Served NetLogo Web snapshot retrieved 2026-11-05; '+str(r.attrib),'checkedAt':DATE,'evidence':'Complete served model XML, Procedures and Info retained locally; Info read for mechanism and attribution.','evidencePath':str((E/(slug+'.nlogox')).relative_to(ROOT)),'sha256':hashlib.sha256(b).hexdigest(),'citation':clean(cite),'scientificOrigin':clean(credits.group(1)) if credits else 'Info does not identify a scientific original; related publications below are contextual comparisons, not asserted source derivations.','notes':'This is source research, not runtime execution or approval of the City Library reimplementation. Original model notices remain in the retained source.'},publications=pubs,gaps=[])
 (ROOT/(slug+'.json')).write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 md=f"# {m['name']}\n\nStatus: **complete** · Checked: {DATE} · Mini-text: {len(text.split())} words\n\n{text}\n\n## Model provenance\n\n[Selected NetLogo Web model]({m['launchUrl']}) · [Served source snapshot]({d['modelSource']['evidencePath']})\n\n{d['modelSource']['citation']}\n\nScientific origin recorded in Info: {d['modelSource']['scientificOrigin']}\n\nSource SHA-256: `{d['modelSource']['sha256']}`. Source provenance and theoretical context do not constitute empirical validation or implementation acceptance.\n\n## Scientific publications\n"
 for i,p in enumerate(pubs,1):
  v=p['verification'];md+=f"\n### [{i}] {p['title']}\n\n{'; '.join(p['authors'])} ({p['year']}). *{p['venue']}*. [Canonical record]({p['url']}). DOI: {p['doi'] or 'none identified'}.\n\nModel relevance: {p['relevance']}.\n\nVerification: [{v['evidenceType']}]({v['consultedUrl']}), {DATE}. {v['access']}. {v['notes']} [Saved evidence]({v['evidencePath']}).\n"
 (ROOT/(slug+'.md')).write_text(md);print(slug,len(text.split()),flush=True)
if __name__=='__main__':
 specs=json.loads((pathlib.Path(__file__).parent/'specs.json').read_text())
 for x in specs:build(**x)
