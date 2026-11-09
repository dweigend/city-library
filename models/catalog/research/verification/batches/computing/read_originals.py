from library import *
import subprocess
ORIGINALS={
'gardner-life':('https://web.stanford.edu/class/sts145/Library/life.pdf','10.1038/scientificamerican1070-120'),
'smoothlife':('https://arxiv.org/pdf/1111.1567','10.48550/arXiv.1111.1567'),
'algorithmic-beauty':('https://algorithmicbotany.org/papers/abop/abop.pdf','10.1007/978-1-4613-8476-2'),
'fisch-threshold':('https://www.math.ucdavis.edu/~gravner/papers/fgg.pdf','10.1007/BF01890834'),
'fisch-cyclic':('https://www.math.ucdavis.edu/~gravner/papers/cca.pdf',None),
'turing':('https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf','10.1112/plms/s2-42.1.230'),
'lloyd':('https://www.cs.toronto.edu/~roweis/csc2515-2006/readings/lloyd82.pdf','10.1109/TIT.1982.1056489'),
'rosenblatt':('https://www.ling.upenn.edu/courses/cogs501/Rosenblatt1958.pdf','10.1037/h0042519'),
'tetris':('https://people.csail.mit.edu/dln/papers/tetris/tetris.pdf','10.1142/S0218195904001354')}
results=[]
for k,(u,doi) in ORIGINALS.items():
 try:
  req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (research source retrieval)'})
  b=urllib.request.urlopen(req,timeout=35).read();assert b[:4]==b'%PDF','Not PDF'
  f=E/(k+'-paper.pdf');f.write_bytes(b)
  subprocess.run(['pdftotext','-layout',str(f),str(E/(k+'-paper.txt'))],check=True,capture_output=True)
  results.append({'key':k,'doi':doi,'url':u,'access':'fulltext','checkedAt':DATE,'snapshot':'evidence/computing/'+k+'-paper.pdf'})
  print(k,'OK',len(b),flush=True)
 except Exception as e:results.append({'key':k,'doi':doi,'url':u,'error':str(e),'checkedAt':DATE});print(k,str(e),flush=True)
(P/'batches/computing/original-reading-access.json').write_text(json.dumps(results,indent=2)+'\n')
