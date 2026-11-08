import json, pathlib, re, html, copy
ROOT=pathlib.Path(__file__).resolve().parents[2]; E=ROOT/'evidence/physics'
MODELS={m['slug']:m for m in json.load(open(ROOT/'selection.json'))['models']}
def clean(s):
 if isinstance(s,list): s=s[0] if s else ''
 return ' '.join(html.unescape(re.sub('<[^>]+>','',s or '')).split())
def publication(key,n,relevance,item=0):
 d=json.load(open(E/('publication-'+key+'.json'))); p=d['items'][item]
 title=clean(p.get('title')); authors=[' '.join(filter(None,[a.get('given'),a.get('family')])) or a.get('name',a.get('literal','')) for a in p.get('author',[])]
 year=(p.get('published') or p.get('issued') or p.get('published-print') or {}).get('date-parts',[[None]])[0][0]
 venue=clean(p.get('container-title')) or p.get('publisher','')
 doi=p.get('DOI') or p.get('doi')
 assert title and authors and year and venue,(key,title,authors,year,venue)
 abstract=clean(p.get('abstract'))
 return dict(id=str(n),authors=authors,title=title,year=year,venue=venue,doi=doi,url='https://doi.org/'+doi,relevance=relevance,
  verification=dict(consultedUrl=d['consultedUrl'],checkedAt=d['checkedAt'],evidenceType='metadata and abstract' if abstract else 'metadata',access='Open DOI-registrant metadata; full publication access not assessed',notes='Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. '+('Registrant abstract consulted: '+abstract if abstract else 'No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.'),evidenceFile='evidence/physics/publication-'+key+'.json'))
def write(slug,text,refs):
 m=MODELS[slug]; source=json.load(open(E/(slug+'-source.json')))
 pubs=[publication(k,i+1,r,*more) for i,(k,r,*more) in enumerate(refs)]
 assert len(text.split()) in range(100,161),(slug,len(text.split()))
 assert len({p['doi'].lower() for p in pubs})==3
 citation=source['info'].split('For the model itself:',1)[-1].split('Please cite',1)[0].strip() if 'For the model itself:' in source['info'] else 'See archived Info for original author attribution.'
 d={k:m[k] for k in ['slug','name','catalogPath','launchUrl','deliveryBatch']}
 d.update(schemaVersion=1,status='complete',miniText=text,modelSource=dict(url=source['url'],checkedAt=source['checkedAt'],revision=source['rootAttributes'].get('version','served revision')+'; SHA-256 '+source['sha256'],evidence='Full served model XML, Procedures and Info downloaded and consulted; retained at evidence/physics/'+slug+'.nlogox',notes='This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.',citation=citation,infoEvidenceFile='evidence/physics/'+slug+'-source.json'),publications=pubs,gaps=[])
 (ROOT/(slug+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 lines=['# '+m['name'],'','Research status: complete. Scientific context; implementation acceptance is separate.','',text,'','## Scientific publications','']
 for p in pubs:
  v=p['verification']; lines += [f"{p['id']}. {'; '.join(p['authors'])} ({p['year']}). **{p['title']}**. {p['venue']}. DOI: [{p['doi']}]({p['url']}).",'',p['relevance'],'',f"Verification ({v['checkedAt']}): [{v['evidenceType']}]({v['consultedUrl']}). {v['access']}. {v['notes']}",'']
 lines += ['## Original model provenance','',f"[Served NetLogo source]({source['url']}), checked {source['checkedAt']}; {d['modelSource']['revision']}.",'',citation,'','Original Info and Procedures are archived separately from the research interpretation. No target runtime check or independent implementation approval is claimed.','']
 (ROOT/(slug+'.md')).write_text('\n'.join(lines))
 print(slug,len(text.split()),flush=True)
if __name__=='__main__':
 write('fire',"""How does habitat connectivity determine whether a spreading disturbance crosses a landscape? NetLogo Fire initializes randomly occupied tree patches and ignites the left boundary. Burning trees ignite their four orthogonal neighbors; empty patches interrupt transmission. Broadbent and Hammersley provide the random-medium framework for interpreting connected paths [1], while Grassberger relates epidemic propagation to dynamical percolation [2]. The simulation illustrates a sharp connectivity-dependent change in crossing probability, with finite landscapes and random realizations producing variable outcomes. It assumes no wind, spotting, fuel variation or regrowth. Drossel and Schwabl supply a useful contrast: their forest-fire model adds growth and lightning and investigates self-organized criticality [3]. Those mechanisms are absent from this baseline, so its density-controlled transition does not by itself demonstrate self-organization or validate predictions for actual wildfires.""",[
 ('broadbent','Foundational random-medium connectivity theory supports the occupied-tree crossing question; the source is not an empirical wildfire study.'),('grassberger','Relates epidemic-like local propagation to percolation, supporting the interpretation of a one-pass burning front.'),('drossel','A critical extension with regrowth and lightning clarifies why fixed-density NetLogo Fire is not the self-organized forest-fire model.')])
 write('percolation',"""When can a locally transmitted disturbance continue through a disordered medium? NetLogo Percolation represents oil descending diagonally between hard soil cells, with probabilistic entry controlled by porosity. Its moving display tracks the active front and previously saturated cells. Broadbent and Hammersley establish the distinction between randomness in a medium and randomness of diffusing particles [1]. Domany and Kinzel connect cellular update rules with directed percolation [2], making directionality central rather than importing Fire's undirected connectivity threshold. Hinrichsen places extinction and sustained spreading within absorbing-state transitions [3]. This is a pedagogical stochastic lattice process: it omits pressure-driven flow, fluid conservation at physical scales, capillarity and measured soil structure. Repeated runs illustrate survival, stopping and finite-width variability; visual agreement with an oil plume is not empirical validation.""",[
 ('broadbent','Defines percolation in a random medium, the scientific question behind permeability-dependent penetration.'),('domany','Connects stochastic cellular automata and directed percolation, directly relevant to the downward, two-neighbor propagation geometry.'),('hinrichsen','Provides absorbing-state and finite-size context for interpreting front extinction versus continuing penetration without asserting an exact threshold for this implementation.')])
