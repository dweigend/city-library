import json,pathlib,urllib.request,urllib.parse,concurrent.futures,time
ROOT=pathlib.Path(__file__).resolve().parents[2]
E=ROOT/'evidence/social-urban'; E.mkdir(exist_ok=True)
Q={
'ba':'10.1126/science.286.5439.509','price':'10.1002/asi.4630270505','clauset':'10.1137/070710111',
'majority':'10.1007/BF01011536','galam':'10.1016/S0378-4371(02)01582-0','liggett':'10.1007/978-1-4613-8542-4',
'volterra':'10.1038/118558a0','wolfpaper':'10.1207/s1532690xci2402_1','gause':'Gause The Struggle for Existence 1934',
'sugarscape':'Growing Artificial Societies Epstein Axtell 1996','gini':'10.1162/003465303762687007','yakovenko':'10.1103/RevModPhys.81.1703',
'schelling':'10.1080/0022250X.1971.9989794','zhang':'10.1080/00222500590932822','clark':'10.1353/dem.0.0106',
'er':'On the evolution of random graphs Erdos Renyi 1960','giant':'10.1002/rsa.3240040303','newman':'10.1137/S003614450342480',
'ws':'10.1038/30918','kleinberg':'10.1038/35022643','smallworld':'10.2307/2786545',
'pagerank':'10.1016/S0169-7552(98)00110-X','consensus':'10.1109/JPROC.2006.887293','masuda':'10.1016/j.physrep.2017.07.007',
'km':'10.1098/rspa.1927.0118','pastor':'10.1103/PhysRevLett.86.3200','kephart':'10.1109/TC.1991.131557',
'team':'10.1126/science.1106340','uzzipiro':'10.1086/432782','newmancollab':'10.1073/pnas.98.2.404',
'cialdini':'10.1146/annurev.psych.55.090902.142015','nyborg':'10.1126/science.aaf8317','jager':'10.1016/S0921-8009(00)00219-6',
'epstein':'10.1073/pnas.092080199','granovetter':'10.1086/226707','lohmann':'10.2307/2950679',
'language':'Social networks and intraspeaker variation during periods of language change Troutman Clark Goldrick','baxter':'10.1103/PhysRevE.73.046118','abrams':'10.1038/424900a',
'hammond':'10.1177/0022002706293470','axelrodtag':'10.1177/0022002701045003001','axelrodcoop':'10.1126/science.7466396',
'minority':'10.1016/S0378-4371(97)00419-6','crowd':'10.1103/PhysRevLett.84.1824','elFarol':'Inductive Reasoning and Bounded Rationality Arthur 1994',
'daley':'10.1038/213374a0','rumor':'10.1103/PhysRevE.69.066130','rumorsocial':'10.1103/PhysRevE.69.066130',
'lewis':'Convention A Philosophical Study David Lewis 1969','skyrms':'Signals Brian Skyrms 2010','signaling':'10.1073/pnas.95.9.5101',
'piaget':'The origins of intelligence in children Piaget 1952','vygotsky':'Mind in Society Vygotsky 1978','bridge':'Agent-Based Modeling as a Bridge Between Cognitive and Social Perspectives on Learning Abrahamson Wilensky Levin',
'abm':'An Introduction to Agent-Based Modeling Wilensky Rand 2015','reynolds':'10.1145/37401.37406','couzin':'10.1006/jtbi.2002.3065',
'maynard':'10.1038/246015a0','nowak':'10.1126/science.1133755',
'zi':'10.1086/261868','orderbook':'10.1080/14697688.2013.803148','smithorder':'10.1080/14697680310001604748',
'smithauction':'10.1086/258609','gode':'10.1086/261868','gd':'10.1016/S0167-7187(97)00012-8',
'hotelling':'10.2307/2224214','daspremont':'10.2307/1911955','osborne':'10.2307/2951565',
'braess':'10.1287/trsc.1050.0127','wardrop':'10.1680/ipeds.1952.11259','roughgarden':'10.1145/506147.506153',
'banks':'10.1016/j.irfa.2014.07.015','banktest':'10.1016/j.irfa.2015.08.014','tobin':'10.1111/j.1467-9957.1963.tb01388.x',
'nash':'10.1073/pnas.36.1.48','axelrodeff':'10.1177/002200278002400101','fogel':'10.1109/4235.771166',
'helbingpaths':'10.1038/43196','activewalker':'10.1103/PhysRevE.56.2527','drogoul':'10.1007/3-540-61111-8_6',
'nagel':'10.1051/jp1:1992277','sugiyama':'10.1088/1367-2630/10/3/033001','treiber':'10.1103/PhysRevE.62.1805','lane':'10.1103/PhysRevE.56.1865',
'bml':'10.1103/PhysRevA.46.R6124','gershenson':'10.25088/ComplexSystems.16.1.29','webster':'Traffic signal settings Webster 1958',
'taxi':'10.1016/S0191-2615(02)00041-4','yangtaxi':'10.1016/S0191-2615(02)00042-6','cairns':'10.1016/0041-1647(96)00003-8',
'batty':'Cities and Complexity Batty 2005','whiteengelen':'10.1068/b200117','tobler':'10.2307/143141',
'arthur':'10.2307/2234208','david':'Clio and the Economics of QWERTY David 1985','arthururban':'Urban systems and historical path dependence Arthur 1988',
'simon':'10.1093/biomet/42.3-4.425','sutton':'10.1257/jel.35.1.40',
'benenson':'10.1068/b240131','clarke':'10.1068/b240247','urbanCA':'10.1016/S0198-9715(00)00069-0',
'exurbia':'10.1016/j.geoforum.2007.02.010','brown':'10.1111/j.1467-9671.2005.00228.x','seto':'10.1073/pnas.1211658109',
'sassen':'The Global City New York London Tokyo Sassen 1991','tijuana':'Tijuana Dreaming Life and Art at the Global Border 2012',
'pollution':'10.1016/0304-3800(85)90049-6','ecosystem':'10.1126/science.276.5309.55','commons':'10.1126/science.162.3859.1243','ostrom':'Governing the Commons Ostrom 1990','sustain':'10.1038/nature01014',
'centola':'10.1126/science.1185231','diffinnov':'Diffusion of Innovations Rogers 2003',
'arrhenius':'10.1080/14786449608620846','manabe':'10.1175/1520-0469(1967)024<0241:TEOTAW>2.0.CO;2','hansen':'10.1029/2005JD005776',
'howard':'10.1029/94WR00757','tucker':'10.1002/esp.1958','beaumont':'10.1038/359340a0'
}
def fetch(item):
 k,q=item; out=E/(k+'-crossref.json')
 if out.exists():return k,json.loads(out.read_text())
 u='https://api.crossref.org/works/'+urllib.parse.quote(q,safe='') if q.startswith('10.') else 'https://api.crossref.org/works?'+urllib.parse.urlencode({'query.bibliographic':q,'rows':3})
 for attempt in range(3):
  try:
   req=urllib.request.Request(u,headers={'User-Agent':'CityLibraryScientificResearch/1.0'})
   data=json.load(urllib.request.urlopen(req,timeout=35));out.write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':data},indent=2));return k,json.loads(out.read_text())
  except Exception as e:
   if attempt==2:return k,{'error':str(e)}
   time.sleep(1)
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
  for k,d in ex.map(fetch,Q.items()):
   if 'error' in d: print(k,d,flush=True);continue
   m=d['response']['message']; ms=m.get('items',[m]); print(k,[(x.get('title'),x.get('DOI'),x.get('published',{}).get('date-parts')) for x in ms],flush=True)
