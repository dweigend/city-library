import json,pathlib,hashlib
from library import P,E,DATE
notes={
'gardner-life':('10.1038/scientificamerican1070-120','https://web.stanford.edu/class/sts145/Library/life.pdf','Original exposition, pp. 120–123: rules and simultaneous generations.','The original exposition uses an infinite checkerboard; NetLogo uses a finite wrapping lattice. Rule agreement therefore does not imply identical long-term boundary behavior.'),
'smoothlife':('10.48550/arxiv.1111.1567','https://arxiv.org/pdf/1111.1567','Abstract and sections 2–4: inner disk, annulus, sigmoid transition and optional continuous time.','The article explicitly separates the discrete-time update from a continuous-time variant. The served PDF bears the arXiv v2 label and a regenerated date of 27 November 2024; the repository publication year is 2011.'),
'algorithmic-beauty':('10.1007/978-1-4613-8476-2','https://algorithmicbotany.org/papers/abop/abop.pdf','Chapter 1, pp. 1–7: Koch replacement, parallel rewriting, DOL systems and turtle interpretation.','Selected chapter sections support the grammar-to-geometry mechanism; the entire book was not read.'),
'fisch-threshold':('10.1007/bf01890834','https://www.math.ucdavis.edu/~gravner/papers/fgg.pdf','Abstract and section 1: state cycle, threshold, interaction range, synchronous update, and GH versus CCA.','Contact-driven cycling in every state differs from the automatic refractory progression in Greenberg–Hastings-type systems. Pattern resemblance does not erase this rule distinction.'),
'fisch-cyclic':(None,'https://www.math.ucdavis.edu/~gravner/papers/cca.pdf','Abstract and sections 1–2: cyclic successor replacement and stages of organization.','Additional background read, not counted as a fourth publication in any dossier.'),
'turing':('10.1112/plms/s2-42.1.230','https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf','Introduction and section 1, pp. 230–231: machine state, scanned symbol, write/erase and tape movement.','The original single-head tape formalism is distinct from the finite multihead two-dimensional teaching variant. The manuscript was received/read in 1936; the DOI record dates publication 1937.'),
'tetris':('10.1142/s0218195904001354','https://people.csail.mit.edu/dln/papers/tetris/tetris.pdf','Abstract and introduction: offline information, scalable board, objectives and rule variants.','The hardness results concern generalized offline tasks, and should not be described as a complexity proof for this fixed interactive NetLogo implementation.'),
'cabral':('10.1145/166117.166151','https://web.mit.edu/viz/EM/visualizations/resources/cabral.pdf','Abstract and sections 1–2: vector-field imaging, glyphs, streamlines and particle-trace limitations.','Line integral convolution is a contrasting visualization method. The original NetLogo baseline uses arrows and particle trajectories, not LIC.')}
report=[]
for key,(doi,u,sections,note) in notes.items():
 f=E/(key+'-paper.pdf');assert f.exists(),key
 entry={'doi':doi,'consultedUrl':u,'checkedAt':DATE,'evidenceType':'selected full-text sections','sectionsRead':sections,'finding':note,'retrievedSha256':hashlib.sha256(f.read_bytes()).hexdigest(),'retention':'Bibliographic metadata, content-specific reading notes and retrieval hash retained; full article/book copies are not redistributed in this research package.'}
 report.append(entry)
for m in json.loads((P/'selection.json').read_text())['models'][150:]:
 f=P/(m['slug']+'.json');d=json.loads(f.read_text())
 for p in d['publications']:
  entry=next((r for r in report if r['doi'] and r['doi'].lower()==p['doi'].lower()),None)
  if entry:
   p['verification']['fullTextEvidence']=entry
   p['verification']['evidenceType']='metadata and selected full-text sections'
   p['verification']['access']='Open institutional/author repository copy; selected sections read. Full-text access via publisher not established.'
   old=' Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.'
   p['verification']['notes']=p['verification']['notes'].replace(old,'')+' '+entry['sectionsRead']+' '+entry['finding']
 f.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
(P/'batches/computing/original-reading-notes.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n')
# Full-source NetLogo files remain; literature PDFs/texts are working reading material only.
for key in notes:
 for suffix in ['-paper.pdf','-paper.txt']:
  (E/(key+suffix)).unlink(missing_ok=True)
print('Recorded eight content-specific original-reading notes; removed working literature copies.')
