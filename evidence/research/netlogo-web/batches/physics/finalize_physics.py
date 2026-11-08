"""Apply documented primary-source corrections and render the physics companions."""
import json,pathlib,re,collections,urllib.parse
from write_dossiers import clean
ROOT=pathlib.Path(__file__).resolve().parents[2]
models=json.load(open(ROOT/'selection.json'))['models'][100:150]
# These pages were actually opened; failed requests are kept in the same evidence logs.
SUPPLEMENT={
 '10.1103/physrevlett.53.311':('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.53.311','metadata and abstract','Open publisher abstract; full article requires authorization','fire-percolation-primary-pages.json','Publisher abstract explicitly maps cellular automata to directed percolation and Ising models.'),
 '10.1103/physrevlett.69.1629':('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.69.1629','metadata and abstract','Open publisher abstract; full article requires authorization','fire-percolation-primary-pages.json','Publisher abstract specifies lightning, separated growth/burning scales and the self-organized limit, supporting the contrast with fixed-density Fire.'),
 '10.1103/physrevlett.59.381':('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.59.381','metadata and abstract','Open publisher abstract; full article requires authorization','abstracts-01.json','Publisher abstract relates spatially extended driven dynamics to criticality, flicker noise and fractal objects.'),
 '10.1103/physrevlett.64.1613':('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.64.1613','metadata and abstract','Open publisher abstract; full article requires authorization','abstracts-01.json','Abstract states the local-height toppling assumptions and exact finite-lattice analysis; these are comparison conditions, not proof that all NetLogo toppling variants are Abelian.'),
 '10.1103/physrevlett.47.1400':('https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.47.1400','metadata and abstract','Open publisher abstract; full article requires authorization','abstracts-01.json','Abstract describes simulated aggregates, power-law spatial correlations and comparison with measured metal aggregation; no such empirical comparison is claimed for this NetLogo port.'),
 '10.1103/physrev.65.117':('https://journals.aps.org/pr/abstract/10.1103/PhysRev.65.117','metadata and abstract','Open publisher abstract; full article access not established','abstracts-02.json','Abstract specifies a two-dimensional zero-field Ising solution and finite-strip limitations, supporting the benchmark caveat.'),
 '10.1103/revmodphys.68.1259':('https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.68.1259','metadata and abstract','Open publisher abstract; full article access not established','abstracts-02.json','Abstract frames granular behavior as distinct from ordinary solids, liquids and gases; title/abstract do not certify any particular cellular sand rule.'),
 '10.1007/bf01341281':('https://link.springer.com/article/10.1007/BF01341281','metadata and abstract','Open publisher abstract; subscription full text not read','abstracts-02.json','Publisher title corrects the corrupt leading character in the DOI registry: über die Entropieverminderung in einem thermodynamischen System bei Eingriffen intelligenter Wesen. Abstract explicitly discusses measurement, memory and compensating entropy production.'),
 '10.1021/bi201284u':('https://pmc.ncbi.nlm.nih.gov/articles/PMC3381512/','metadata, abstract and accessible full-text sections','Open institutional author manuscript; historical discussion and abstract consulted, not a claim to have read every supplementary page','abstracts-02.json','The manuscript identifies Johnson and Goody as authors, supplies the 1913 translation separately, and distinguishes the specificity constant from the modern Michaelis constant.'),
 '10.1098/rspa.1909.0054':('https://www.bo.infn.it/herab/people/zoccoli/didattica/esperimenti_fisica/E1.1_Scattering_Geiger%20%26%20Marsden%20Study%20Alpha%20Particle%20Scattering.pdf','metadata and original-text sections','Open institutional copy of the original 1909 paper; title page and experimental-method text consulted','corrections-primary-pages.json','Original title page credits H. GEIGER and E. MARSDEN, correcting the registrant typo H. Gegier. The experimental text reports the reflected fraction and metal/thickness comparisons. Initials are retained, not guessed expansions.'),
 '10.1017/9781108333511':('https://doi.org/10.1017/9781108333511','metadata and publisher description','Open publisher catalog; complete book not read','corrections-primary-pages.json','Publisher record checked alongside DOI metadata; used as electrostatic theory, not empirical validation.'),
 '10.3931/e-rara-4259':('https://www.e-rara.ch/zut/content/titleinfo/1335463?lang=de','institutional metadata and original OCR sections','Public-domain digitization and OCR accessible through direct HTTP; web-tool OCR request returned 403 but urllib download succeeded','doppler-primary-pages.json','ETH catalog/DOI metadata date the work 1842; the downloaded offprint title-page OCR says Prag, 1843. This dossier cites the digitized offprint as 1843, recording the 1842 original presentation/catalog date rather than silently conflating editions. OCR retained in evidence/physics/doppler-original.txt; relative-motion and historical ether assumptions were consulted.'),
}
rows=[]
for m in models:
 path=ROOT/(m['slug']+'.json');d=json.load(open(path))
 d['modelSource']['evidenceFile']='evidence/physics/'+m['slug']+'.nlogox'
 for p in d['publications']:
  p['verified']=True
  p['url']='https://doi.org/'+urllib.parse.quote(p['doi'],safe='/:;()')
  v=p['verification'];v['verified']=True
  # Metadata verification means bibliography, never empirical or implementation validation.
  raw=json.load(open(ROOT/v['evidenceFile']))
  match=next((i for i in raw['items'] if str(i.get('DOI',i.get('doi',''))).lower()==p['doi'].lower()),None)
  if match:
   for field in ('volume','issue','page','publisher'):
    if match.get(field):p['pages' if field=='page' else field]=match[field]
  key=p['doi'].lower()
  if key in SUPPLEMENT:
   url,kind,access,file,note=SUPPLEMENT[key]
   v.update(evidenceType=kind,access=access)
   v['additionalConsultedUrls']=[url]
   v['additionalEvidenceFiles']=['evidence/physics/'+file]
   v['primaryReadingNotes']=note
  if key=='10.1007/bf01341281':
   p['title']='über die Entropieverminderung in einem thermodynamischen System bei Eingriffen intelligenter Wesen'
  if key=='10.1098/rspa.1909.0054':
   p['authors']=['H. Geiger','E. Marsden']
  if key=='10.3931/e-rara-4259':
   p['year']=1843
   v['additionalEvidenceFiles'].append('evidence/physics/doppler-original.txt')
  rows.append({'slug':m['slug'],'doi':p['doi'],'title':p['title'],'verificationType':v['evidenceType']})
 path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 lines=['# '+d['name'],'','Research status: complete. Literature research only; implementation acceptance is separate.','',d['miniText'],'','## Scientific publications','']
 for i,p in enumerate(d['publications'],1):
  v=p['verification']; detail='; '.join(filter(None,[p.get('volume'),p.get('issue'),p.get('pages')]))
  lines += [f"{i}. {'; '.join(p['authors'])} ({p['year']}). **{p['title']}**. {p['venue']}{', '+detail if detail else ''}. DOI: [{p['doi']}]({p['url']}).",'',p['relevance'],'',f"Verification ({v['checkedAt']}): [{v['evidenceType']}]({v['consultedUrl']}). {v['access']}. {v['notes']}"]
  if v.get('primaryReadingNotes'):lines+=['',v['primaryReadingNotes'],'', 'Additional primary evidence: '+', '.join('['+u+']('+u+')' for u in v['additionalConsultedUrls'])]
  lines+=['']
 s=d['modelSource'];lines+=['## Original model provenance','',f"[Served original model]({s['url']}), checked {s['checkedAt']}. {s['revision']}.",'',s.get('citation',''),'',s['notes'],'']
 (ROOT/(m['slug']+'.md')).write_text('\n'.join(lines))
report={'models':50,'complete':50,'open':0,'publicationSlots':len(rows),'uniquePublications':len({r['doi'].lower() for r in rows}),'minWords':min(len(json.load(open(ROOT/(m['slug']+'.json')))['miniText'].split()) for m in models),'maxWords':max(len(json.load(open(ROOT/(m['slug']+'.json')))['miniText'].split()) for m in models),'publications':rows}
(ROOT/'batches/physics/validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='publications'},indent=2))
