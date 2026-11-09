from library import *
def rafler():
 u='https://api.datacite.org/dois/10.48550/arXiv.1111.1567';f=E/'datacite-smoothlife.json'
 if not f.exists():f.write_bytes(urllib.request.urlopen(u,timeout=35).read())
 d=json.loads(f.read_text())['data']['attributes'];print(d['titles'],d['creators'],d['publicationYear'])
 return {'id':'10.48550/arxiv.1111.1567','authors':[x['name'] for x in d['creators']],'title':d['titles'][0]['title'],'year':d['publicationYear'],'venue':'arXiv preprint arXiv:1111.1567, version 2','doi':'10.48550/arXiv.1111.1567','url':'https://arxiv.org/abs/1111.1567','relevance':'Original SmoothLife rule generalizes Life to continuous-valued spatial averages and smooth transitions; directly cited by the NetLogo Info.','verification':{'verified':True,'consultedUrl':u,'checkedAt':DATE,'evidenceType':'metadata and repository abstract','access':'Open repository metadata/abstract; preprint, not claimed peer reviewed.','notes':'DataCite metadata cross-checked with arXiv abstract page (submitted 7 November 2011, revised 7 December 2011). No claim of full-text reading.','snapshot':'evidence/computing/datacite-smoothlife.json'}}
if __name__=='__main__':
 print(rafler())
 for doi in ['10.1137/0134040','10.1117/12.485805','10.1103/PhysRevLett.47.1400']:
  p=pub(doi,'');print(doi,p['title'],p['authors'],p['year'])
