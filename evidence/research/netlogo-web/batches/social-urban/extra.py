import sys,json,time,urllib.request,urllib.parse
sys.path.insert(0,str(__file__).rsplit('/',1)[0]);from references import E
Q={'skyrms':'10.1093/acprof:oso/9780199580828.001.0001','white':'10.1068/a251175','tuckerreview':'10.1002/esp.1952','soil':'10.1029/2009JF001536','hallam':'10.1016/0304-3800(83)90019-4','lewis':'10.1002/9780470693711','trail':'10.1038/40353','daley':'10.1093/imamat/1.1.42','hotelling2':'10.2307/1911741'}
for k,q in Q.items():
 u='https://api.crossref.org/works/'+urllib.parse.quote(q,safe='')
 try:
  d=json.load(urllib.request.urlopen(u,timeout=25));(E/(k+'-verified.json')).write_text(json.dumps({'consultedUrl':u,'checkedAt':'2026-11-05','response':d},indent=2));print(k,d['message'].get('title'),flush=True)
 except Exception as e:print(k,str(e),flush=True)
 time.sleep(2)
