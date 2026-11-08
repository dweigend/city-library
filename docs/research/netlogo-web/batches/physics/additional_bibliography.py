from fetch_bibliography import E
import json,urllib.request,urllib.parse,concurrent.futures
qs={
'isingoriginal':'10.1007/BF02980577','onsager':'10.1103/PhysRev.65.117',
'shewmon':'10.1007/978-3-319-48206-4','kedem':'10.1016/0006-3002(58)90330-5','bunimovich':'10.1007/BF01197884','pendulum':'10.1119/1.14703','pendulum2':'10.1088/0143-0807/32/2/019',
'vanSlyke':'10.1016/S0021-9258(18)86738-2','piston':'10.1088/0143-0807/20/4/303','courant':'10.1147/rd.112.0215','michaelis':'The original Michaelis constant translation 1913 Michaelis Menten paper','cornish':'Fundamentals of Enzyme Kinetics Cornish-Bowden Wiley 2012','peierls':'The size of a dislocation Peierls','bateman':'The solution of a system of differential equations occurring in the theory of radioactive transformations',
'chrom3':'Gas chromatography James Martin 1952 separation volatile fatty acids','baryam':'Bar Yam Rabin Smith 1992 polymer dynamics local','od iz':'10.1002/047147875X','wave':'The Theory of Sound Rayleigh volume 1','fourier':'The Analytical Theory of Heat Fourier Cambridge','crank':'The Mathematics of Diffusion second edition','callen':'Thermodynamics introduction thermostatistics Callen Wiley','doppler':'On the colour of light Doppler 1842','chladni':'Chladni acoustics 1802','jacksonbook':'Classical Electrodynamics third edition John David Jackson','lga':'10.1007/BF01024432',
}
def f(k,q):
 try:
  if q.startswith('10.'):
   u='https://api.crossref.org/works/'+urllib.parse.quote(q,safe='/');r=json.load(urllib.request.urlopen(u,timeout=30))['message'];items=[r]
  else:
   u='https://api.crossref.org/works?query='+urllib.parse.quote(q)+'&rows=3';items=json.load(urllib.request.urlopen(u,timeout=30))['message']['items']
  d={'query':q,'consultedUrl':u,'checkedAt':'2026-11-05','items':items};(E/('publication-'+k+'.json')).write_text(json.dumps(d,indent=2)+'\n');print(k,[(i.get('title'),i.get('DOI')) for i in items],flush=True)
 except Exception as e:print(k,e,flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:list(ex.map(lambda x:f(*x),qs.items()))
