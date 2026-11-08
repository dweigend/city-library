import sys,json,urllib.request,urllib.parse,concurrent.futures
sys.path.insert(0,str(__file__).rsplit('/',1)[0]);from references import E
Q={
'gini':'The Small-Sample Bias of the Gini Coefficient Results and Implications for Empirical Research',
'zhang':'A dynamic model of residential segregation','clark':'Understanding the social context of the Schelling segregation model',
'majority':'Universality of the majority-vote model on a square lattice','jager':'Consumer behaviour an evolutionary approach to a microeconomic view',
'axelrodtag':'The evolution of ethnocentrism','daley':'Stochastic rumours','signaling':'Evolution of communication and language in spatially structured populations',
'skyrms':'Signals Evolution Learning and Information','vygotsky':'Mind in Society The Development of Higher Psychological Processes',
'abm':'An Introduction to Agent-Based Modeling Modeling Natural Social and Engineered Complex Systems with NetLogo',
'smithorder':'Statistical theory of the continuous double auction','osborne':'Equilibrium in Hotelling model of spatial competition',
'fogel':'Inductive reasoning and bounded rationality reconsidered','helbingpaths':'Modelling the evolution of human trail systems',
'lane':'Two lane traffic simulations using cellular automata','taxi':'A model for the taxi services market with congestion externalities',
'yangtaxi':'Demand supply equilibrium of taxi services in a network under competition and regulation',
'cairns':'Economics and the regulation of taxis','batty':'Cities and Complexity Understanding Cities with Cellular Automata Agent Based Models and Fractals',
'whiteengelen':'Cellular automata and fractal urban form a cellular modelling approach to the evolution of urban land use patterns',
'urbanCA':'A constrained cellular automata model for large scale land use dynamics',
'david':'Clio and the Economics of QWERTY','tucker':'Modelling landscape evolution','beaumont':'Coupled tectonic surface process models with applications to rifted margins and collisional orogens',
'pollution':'Effects of environmental pollution on the growth and survival of populations','ecosystem':'Human Domination of Earth Ecosystems',
'jager2':'Modelling consumer behaviour','tijuana':'Tijuana Dreaming Life and Art at the Global Border',
'kephart':'The directed graph epidemiological model of computer viruses'
}
def f(kq):
 k,q=kq;u='https://api.crossref.org/works?'+urllib.parse.urlencode({'query.title':q,'rows':3})
 try:
  d=json.load(urllib.request.urlopen(u,timeout=40));(E/(k+'-fix.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':d},indent=2));return k,[(a.get('title'),a.get('DOI'),a.get('published',{}).get('date-parts')) for a in d['message']['items']]
 except Exception as e:return k,str(e)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as x:
 for k,d in x.map(f,Q.items()):print(k,d,flush=True)
