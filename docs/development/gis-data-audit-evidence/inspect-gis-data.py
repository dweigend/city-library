"""One-off structural source audit; not a reusable library GIS implementation."""
from pathlib import Path
from collections import Counter
import struct,json,math,re,hashlib,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[3];DATA=ROOT/'experiments/gis-general-examples/data';OUT=ROOT/'docs/development/gis-data-audit-evidence'
def header(b):
 return {'fileCode':struct.unpack_from('>i',b,0)[0],'declaredBytes':2*struct.unpack_from('>i',b,24)[0],'version':struct.unpack_from('<i',b,28)[0],'shapeType':struct.unpack_from('<i',b,32)[0],'bboxXY':list(struct.unpack_from('<4d',b,36))}
def dbf(path):
 b=path.read_bytes();n=struct.unpack_from('<I',b,4)[0];hl,rl=struct.unpack_from('<HH',b,8);fields=[];off=32
 while b[off]!=13:
  d=b[off:off+32];fields.append({'name':d[:11].split(b'\0')[0].decode('ascii'),'type':chr(d[11]),'width':d[16],'decimals':d[17]});off+=32
 assert hl==off+1 and sum(f['width'] for f in fields)+1==rl
 records=[];deleted=0
 for i in range(n):
  rec=b[hl+i*rl:hl+(i+1)*rl];assert len(rec)==rl;deleted+=rec[:1]==b'*';o=1;row={}
  for f in fields:
   raw=rec[o:o+f['width']];o+=f['width'];s=raw.decode('latin1').strip()
   if f['type'] in ['N','F'] and s: row[f['name']]=float(s) if '.' in s else int(s)
   else: row[f['name']]=s
  records.append(row)
 numeric={}
 for f in fields:
  vals=[r[f['name']] for r in records if isinstance(r[f['name']],(int,float))]
  if vals:numeric[f['name']]={'min':min(vals),'max':max(vals),'negative99Count':vals.count(-99),'negative99999Count':vals.count(-99999)}
 return {'versionByte':b[0],'headerDateBytes':list(b[1:4]),'recordCount':n,'headerBytes':hl,'recordBytes':rl,'codePageByte':b[29],'deletedRecordCount':deleted,'trailingBytes':len(b[hl+n*rl:]),'trailingFirst64Hex':b[hl+n*rl:][:64].hex(),'trailingSHA256':hashlib.sha256(b[hl+n*rl:]).hexdigest(),'nonASCIIPayloadBytes':sum(v>127 for v in b[hl:hl+n*rl]),'fields':fields,'numericSummary':numeric,'firstThreeRecords':records[:3],'characterDecodeNote':'latin1 is lossless byte-to-codepoint audit display, not an accepted source character encoding'},records
vectors={}
for name in ['cities','rivers','countries']:
 b=(DATA/f'{name}.shp').read_bytes();sh=header(b);idx=(DATA/f'{name}.shx').read_bytes();ih=header(idx)
 assert sh['declaredBytes']==len(b) and ih['declaredBytes']==len(idx) and sh['fileCode']==ih['fileCode']==9994 and sh['version']==ih['version']==1000
 assert sh['shapeType']==ih['shapeType'] and sh['bboxXY']==ih['bboxXY'];assert (len(idx)-100)%8==0
 off=100;records=[];points=[];rings=Counter();degenerate=0;partsTotal=0;shapeTypes=Counter();closed=0
 while off<len(b):
  number,length=struct.unpack_from('>2i',b,off);size=length*2;end=off+8+size;assert end<=len(b);payload=b[off+8:end];typ=struct.unpack_from('<i',payload)[0];shapeTypes[typ]+=1
  if typ==1:
   pp=[struct.unpack_from('<2d',payload,4)];assert size==20
  elif typ in (3,5):
   nparts,npts=struct.unpack_from('<2i',payload,36);starts=list(struct.unpack_from(f'<{nparts}i',payload,44));base=44+4*nparts;pp=[struct.unpack_from('<2d',payload,base+16*i) for i in range(npts)];assert size==base+16*npts
   assert starts[0]==0 and starts==sorted(starts) and starts[-1]<npts;partsTotal+=nparts
   if typ==5:
    for a,z in zip(starts,starts[1:]+[npts]):
     ring=pp[a:z];closed+=ring[0]==ring[-1];area=sum(x1*y2-x2*y1 for (x1,y1),(x2,y2) in zip(ring,ring[1:]))/2;rings['clockwise' if area<0 else 'counterclockwise' if area>0 else 'zeroArea']+=1
     degenerate+=sum(a==z for a,z in zip(ring,ring[1:]))
  elif typ==0:pp=[]
  else:raise AssertionError(typ)
  assert all(math.isfinite(v) for pt in pp for v in pt);points.extend(pp);records.append({'number':number,'offsetBytes':off,'contentBytes':size,'pointCount':len(pp)});off=end
 assert off==len(b)
 shx=[struct.unpack_from('>2i',idx,100+8*i) for i in range((len(idx)-100)//8)]
 assert len(shx)==len(records)
 for i,(rec,(start,length)) in enumerate(zip(records,shx)):
  assert rec['number']==i+1 and rec['offsetBytes']==start*2 and rec['contentBytes']==length*2
 db,rows=dbf(DATA/f'{name}.dbf');assert len(records)==db['recordCount']
 exact=[min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)]
 vectors[name]={'shpHeader':sh,'shxHeader':ih,'shapeTypeCounts':dict(shapeTypes),'shapeRecordCount':len(records),'shxEntryCount':len(shx),'allSHXOffsetsAndLengthsMatch':True,'computedPointBBoxXY':exact,'headerBBoxEqualsComputed':exact==sh['bboxXY'],'totalPoints':len(points),'totalParts':partsTotal,'polygonRingDirections':dict(rings),'closedPolygonRings':closed,'adjacentDuplicatePolygonVertices':degenerate,'dbf':db,'validationLimit':'No self-intersection/hole nesting/CRS transformation validation, no coordinate repairs'}
 if name=='cities':vectors[name]['populationOver10000000Count']=sum(r['POPULATION']>10000000 for r in rows)
 if name=='countries':vectors[name]['unitedStatesMatches']=[r for r in rows if r.get('CNTRY_NAME')=='United States']
rasters={}
for name in ['local-elevation','world-elevation']:
 text=(DATA/f'{name}.asc').read_text();lines=text.splitlines();h={}
 for line in lines[:6]:key,value=line.split();h[key.lower()]=float(value)
 assert set(h)=={'ncols','nrows','xllcorner','yllcorner','cellsize','nodata_value'};ncols,nrows=int(h['ncols']),int(h['nrows']);assert ncols==h['ncols'] and nrows==h['nrows']
 vals=[float(v) for line in lines[6:] for v in line.split()];assert len(vals)==ncols*nrows and all(math.isfinite(v) for v in vals)
 valid=[v for v in vals if v!=h['nodata_value']];x,y,size=h['xllcorner'],h['yllcorner'],h['cellsize']
 rasters[name]={'headers':h,'valueCount':len(vals),'expectedValueCount':ncols*nrows,'noDataCount':len(vals)-len(valid),'validMin':min(valid),'validMax':max(valid),'allStoredValuesFinite':True,'outerExtentXY':[x,y,x+ncols*size,y+nrows*size],'topLeftCellCenterXY':[x+size/2,y+(nrows-.5)*size],'bottomRightCellCenterXY':[x+(ncols-.5)*size,y+size/2],'firstSixValues':vals[:6],'lastSixValues':vals[-6:],'rowInterpretation':'ESRI ASCII row 1 is top/north; stored extent order here is minX,minY,maxX,maxY'}
projections={}
for p in sorted(DATA.glob('*.prj')):
 s=p.read_text();projections[p.name]={'text':s,'kind':s.split('[',1)[0],'name':re.search(r'\["([^"]+)"',s).group(1),'projection':re.findall(r'PROJECTION\["([^"]+)"\]',s),'parameters':{k:float(v) for k,v in re.findall(r'PARAMETER\["([^"]+)",([^\]]+)\]',s)},'units':[{'name':n,'factor':float(f)} for n,f in re.findall(r'UNIT\["([^"]+)",([^\]]+)\]',s)],'spheroid':re.findall(r'SPHEROID\["([^"]+)",([^,]+),([^\]]+)\]',s),'authorityIdentifiers':re.findall(r'AUTHORITY\[[^\]]+\]',s)}
metadata={};xml=ET.parse(DATA/'countries.xml').getroot()
for tag in ['title','origin','pubdate','abstract','purpose','accconst','distliab']:
 metadata[tag]=[' '.join(''.join(e.itertext()).split()) for e in xml.iter(tag)]
metadata['useconstSourcePath']='experiments/gis-general-examples/data/countries.xml: metadata/idinfo/useconst; retained in original file rather than duplicating full terms here'
metadata['populationMeaning']={'sourceElement':'metadata/eainfo/detailed/attr[POP_CNTRY]','year':1994,'estimate':True,'missingValue':-99999}
(OUT/'inspection.json').write_text(json.dumps({'checkedAt':'2026-11-06','vectors':vectors,'rasters':rasters,'projections':projections,'countryMetadata':metadata},indent=2,allow_nan=False)+'\n')
print(json.dumps({'vectors':{n:{'shapes':d['shapeRecordCount'],'type':d['shpHeader']['shapeType'],'points':d['totalPoints'],'bbox':d['shpHeader']['bboxXY'],'fields':d['dbf']['fields'],'codePageByte':d['dbf']['codePageByte']} for n,d in vectors.items()},'rasters':rasters},indent=2))
