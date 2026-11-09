import json,pathlib,runpy,re,hashlib,xml.etree.ElementTree as E,html
p=pathlib.Path(__file__).resolve().parents[2];ep=p/'evidence/biology';S=runpy.run_path(str(pathlib.Path(__file__).with_name('specs.py')))['S']
choice={'bates':('refined',1),'economou':('search',1),'bulmer':('search',1),'anisogamymodel':('search',1),'lissaman':('search',1),'bultman':('search',1),'levin':('search',1),'calvin':('refined',2),'enderling':('refined',0),'baldwin':('refined',0),'clifford':('refined',0),'pursuit':('refined',0),'seeley':('refined',2),'quorum':('refined',0),'chung':('refined',0),'konopka':('refined',0),'charnov':('refined',0),'castle':('refined',0),'isopod':('refined',2),'waloff':('refined',0),'phillips':('search',0)}
def clean(t):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>','',t))).strip()
def metadata(k):
 if k=='resnick':
  f=ep/'resnick-publisher.json'
  if not f.exists():raise ValueError('No publisher evidence for Resnick')
  return {'id':k,'authors':['Mitchel Resnick'],'title':'Turtles, Termites, and Traffic Jams: Explorations in Massively Parallel Microworlds','year':1994,'venue':'The MIT Press','doi':None,'url':'https://mitpress.mit.edu/9780262680936/turtles-termites-and-traffic-jams/','verification':{'consultedUrl':'https://mitpress.mit.edu/9780262680936/turtles-termites-and-traffic-jams/','checkedAt':'2026-11-05','evidenceType':'publisher-description-and-metadata','access':'Description and publication metadata accessible; book full text not consulted.','notes':'Publisher distinguishes 1994 hardcover from 1997 paperback. No DOI was located in the consulted publisher record.','evidenceFile':'evidence/biology/resnick-publisher.json'},'verified':True}
 if k=='swarm':
  f=ep/'swarm-institution.html'
  if not f.exists():raise ValueError('No institutional Swarm evidence')
  return {'id':k,'authors':['Nelson Minar','Roger Burkhart','Christopher G. Langton','Manor Askenazi'],'title':'The Swarm Simulation System: A Toolkit for Building Multi-Agent Simulations','year':1996,'venue':'Santa Fe Institute Working Paper 96-06-042','doi':None,'url':'https://www.santafe.edu/research/results/working-papers/the-swarm-simulation-system-a-toolkit-for-building','verification':{'consultedUrl':'https://www.santafe.edu/research/results/working-papers/the-swarm-simulation-system-a-toolkit-for-building','checkedAt':'2026-11-05','evidenceType':'institutional-abstract-and-metadata','access':'Institutional abstract and metadata accessible; working paper rather than a peer-reviewed journal article.','notes':'Author ordering follows the original paper title page, not the institutional page’s alphabetical display. No DOI located in the institutional record.','evidenceFile':'evidence/biology/swarm-institution.html'},'verified':True}
 if k=='hinton':
  if not (ep/'hinton-publisher.html').exists():raise ValueError('No Hinton publisher evidence')
  return {'id':k,'authors':['Geoffrey E. Hinton','Steven J. Nowlan'],'title':'How Learning Can Guide Evolution','year':1987,'venue':'Complex Systems 1(3), 495–502','doi':None,'url':'https://www.complex-systems.com/abstracts/v01_i03_a06/','verification':{'consultedUrl':'https://www.complex-systems.com/abstracts/v01_i03_a06/','checkedAt':'2026-11-05','evidenceType':'publisher-abstract-and-repository-full-text','access':'Publisher abstract and original-paper scan in a university repository accessible; first two printed pages inspected from the local rendered repository scan; the publisher abstract was also read.','notes':'Original 1987 paper, rather than its 1996 reprint cited in NetLogo Info. No DOI is displayed by the publisher.','evidenceFile':'evidence/biology/hinton-publisher.html','fullTextUrl':'https://cseweb.ucsd.edu/~gary/PAPER-SUGGESTIONS/hinton-nowlan-complex-systems-1987.pdf'},'verified':True}
 direct=ep/(k+'-crossref-direct.json')
 if direct.exists(): f=direct;x=json.load(open(f)); m=x['response']['message']
 else:
  suffix,idx=choice.get(k,('search',0));
  if k=='castle':kfile='silvers'
  else:kfile=k
  f=ep/(kfile+'-crossref-'+suffix+'.json');x=json.load(open(f));m=x['response']['message']['items'][idx]
 authors=[clean(' '.join(z for z in [a.get('given',''),a.get('family','')] if z)) or a.get('name','') for a in m.get('author',[])]
 emf=ep/(k+'-europepmc.json'); em=None
 if emf.exists():
  emx=json.load(open(emf)); candidates=emx.get('response',{}).get('resultList',{}).get('result',[])
  if candidates: em=candidates[0]
 if not authors and em:
  authors=[clean(' '.join([a.get('firstName',''),a.get('lastName','')])) for a in em.get('authorList',{}).get('author',[])]
 if not authors:raise ValueError('Missing author list for '+k)
 if k=='bonner':authors=['John Tyler Bonner']
 if k=='andersonhiv':authors=list(dict.fromkeys(authors))
 if k=='cohen' and em and 'HPTN 052 Study Team' in em.get('authorString',''):authors.append('HPTN 052 Study Team')
 date=m.get('published-print',m.get('published',m.get('issued',{}))).get('date-parts',[[None]])[0][0]
 title=clean(m['title'][0]);subtitle=clean(' '.join(m.get('subtitle',[])))
 if subtitle and subtitle.lower() not in title.lower():title+=': '+subtitle
 venue=clean(' '.join(m.get('container-title',[]))) or m.get('publisher','')
 if m.get('type') in ['book','monograph','edited-book']:venue=m.get('publisher',venue)
 doi=m['DOI'];v={'consultedUrl':x['consultedUrl'],'checkedAt':'2026-11-05','evidenceType':'doi-registrant-metadata','access':'Crossref publisher-deposited metadata accessible; publisher full-text access/paywall not tested.','notes':'Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.','evidenceFile':str(f.relative_to(p))}
 if m.get('abstract'):v.update(evidenceType='doi-registrant-abstract-and-metadata',access='Publisher-deposited abstract and metadata accessible; publisher full-text access/paywall not tested.',abstractText=clean(m['abstract']))
 if em:
  v['additionalConsultedUrls']=[emx['consultedUrl']]
  v['additionalEvidenceFiles']=[str(emf.relative_to(p))]
  if k=='nilsson':v['notes']+=' Author list supplied by Europe PMC because Crossref omits it.'
  if k=='bonner':v['notes']+=' Author list corrected against the Europe PMC/PubMed record, which credits only John Tyler Bonner; the additional Crossref name is not accepted.'
  if k=='andersonhiv':v['notes']+=' Duplicate R. M. May in Crossref removed after comparison with Europe PMC/PubMed five-author record.'
  if em.get('abstractText'):
   v.update(evidenceType='primary-registrant-metadata-and-institutional-abstract',access='Crossref metadata and Europe PMC/PubMed abstract accessible; publisher full text/paywall not inferred from repository access.',abstractText=clean(em['abstractText']))
 if k=='gazzola':
  date=2007;v.update(consultedUrl='https://link.springer.com/chapter/10.1007/978-3-540-74913-4_88',evidenceType='publisher-abstract-and-metadata',access='Publisher abstract accessible; full chapter subscription required and not consulted.',evidenceFile='evidence/biology/gazzola-publisher.json',notes='Year checked on the publisher citation because Crossref has no publication date.')
 if k=='charnov':v['notes']+=' DOI record describes a 1983 edition; the original monograph was published in 1982.'
 if k=='seeley':v['notes']+=' DOI record describes a 2011 edition; NetLogo cites the original 2010 monograph.'
 v.pop('abstractText',None)
 return {'id':k,'authors':authors,'title':title,'year':date,'venue':venue,'doi':doi,'url':'https://doi.org/'+doi,'verification':v,'verified':True,'volume':m.get('volume'),'issue':m.get('issue'),'pages':m.get('page')}
selected=json.load(open(p/'selection.json'))['models'][50:100];report=[]
for model in selected:
 slug=model['slug'];d=json.load(open(p/(slug+'.json')));spec=S[slug];pubs=[];gaps=[]
 for k,rel in spec['refs']:
  try:pub=metadata(k);pub['relevance']=rel;pubs.append(pub)
  except Exception as e:gaps.append(str(e))
 src=ep/(slug+'.nlogox'); info=ep/(slug+'-info.txt'); t=info.read_text();root=E.fromstring(src.read_text());
 cite=t.split('For the model itself:')[-1].split('Please cite the NetLogo software')[0].strip() if 'For the model itself:' in t else ''
 d.update(miniText=spec['miniText'],publications=pubs,modelSource={'url':model['launchUrl'].split('#',1)[1],'consultedUrl':model['launchUrl'].split('#',1)[1],'revision':'Best available served NetLogo Web artifact retrieved on 2026-11-05; SHA-256 '+hashlib.sha256(src.read_bytes()).hexdigest(),'checkedAt':'2026-11-05','evidence':'Complete served .nlogox downloaded; Info mechanism descriptions, credits and reference sections inspected. Procedures are not independently audited by this literature task. Source provenance is separate from City Library reimplementation and target-runtime verification.','evidenceFile':str(src.relative_to(p)),'infoFile':str(info.relative_to(p)),'originalModelCitation':cite,'notes':'Original/served model is the behavioral baseline. This research does not claim implementation or browser acceptance.'},gaps=gaps,status='complete' if len(pubs)==3 and not gaps else 'incomplete')
 if len(d['miniText'].split()) not in range(100,161):d['gaps'].append('Mini-text word count outside required range');d['status']='incomplete'
 (p/(slug+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 lines=['# '+d['name'],'','Status: '+d['status']+'. Scientific research only.','',d['miniText'],'','## Scientific publications','']
 for i,a in enumerate(pubs,1):
  v=a['verification'];lines.extend([f"{i}. {'; '.join(a['authors'])} ({a['year']}). **{a['title']}**. {a['venue']}. [{a.get('doi') or 'Stable primary source'}]({a['url']}).",'',a['relevance'],'',f"Verification: {v['checkedAt']}; {v['evidenceType']}. {v['access']} Consulted: {v['consultedUrl']}. {v['notes']}",''])
 lines.extend(['## Model provenance','',d['modelSource']['originalModelCitation'],'',d['modelSource']['revision'],'','Consulted: '+d['modelSource']['consultedUrl'],'','Evidence: ['+slug+' Info]('+str(info.relative_to(p))+'). Research does not establish reimplementation acceptance.'])
 if gaps:lines.extend(['','## Open gaps','']+['- '+g for g in gaps])
 (p/(slug+'.md')).write_text('\n'.join(lines)+'\n');report.append({'slug':slug,'status':d['status'],'words':len(d['miniText'].split()),'gaps':gaps})
(p/'batches/biology/report.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
