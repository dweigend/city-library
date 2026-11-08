"""Decode PNG bytes using the standard library; hash RGB within explicit or inferred canvas ROI."""
import collections,hashlib,json,struct,zlib
from pathlib import Path

def decode(path):
 b=Path(path).read_bytes();off=8;packed=bytearray()
 while off<len(b):
  n=struct.unpack_from('>I',b,off)[0];kind=b[off+4:off+8];data=b[off+8:off+8+n]
  if kind==b'IHDR': w,h,d,c,_,_,inter=struct.unpack('>IIBBBBB',data)
  if kind==b'IDAT':packed.extend(data)
  off+=n+12
 assert d==8 and c in (2,6) and inter==0
 ch=4 if c==6 else 3;raw=zlib.decompress(packed);stride=w*ch;prior=bytearray(stride);off=0;rows=[]
 for y in range(h):
  f=raw[off];row=bytearray(raw[off+1:off+1+stride]);off+=stride+1
  for i in range(stride):
   a=row[i-ch] if i>=ch else 0;bb=prior[i];cc=prior[i-ch] if i>=ch else 0
   if f==1:p=a
   elif f==2:p=bb
   elif f==3:p=(a+bb)//2
   elif f==4:
    q=a+bb-cc;ds=[abs(q-a),abs(q-bb),abs(q-cc)];p=[a,bb,cc][ds.index(min(ds))]
   else:p=0
   row[i]=(row[i]+p)&255
  rows.append(bytes(row) if ch==3 else b''.join(row[i:i+3] for i in range(0,stride,4)));prior=row
 return b,w,h,rows

def measure(path,roi=None):
 b,w,h,rows=decode(path)
 if roi is None: # infer square canvas row band for historical screenshots only
  background=collections.Counter(tuple(rows[y][x*3:x*3+3]) for y in range(0,h,8) for x in range(0,w,8)).most_common(1)[0][0]
  left,right=(32,748) if w==780 else (312,984)
  active=[]
  for y,row in enumerate(rows):
   count=sum(tuple(row[x*3:x*3+3])!=background for x in range(left+8,right-8))
   if count>(right-left-16)*.70:active.append(y)
  bands=[]
  for y in active:
   if not bands or y>bands[-1][-1]+1:bands.append([y])
   else:bands[-1].append(y)
  band=max(bands,key=len);roi=[left+1,band[0]+1,right-1,band[-1]]
  if w==1280:roi=[313,116,983,786] # all retained desktop canvases share this visible rectangle
 l,t,r,bt=roi;l=max(0,l);t=max(0,t);r=min(w,r);bt=min(h,bt)
 rgb=b''.join(row[l*3:r*3] for row in rows[t:bt]);cnt=collections.Counter(tuple(rgb[i:i+3]) for i in range(0,len(rgb),3))
 return {'file':str(path),'sha256':hashlib.sha256(b).hexdigest(),'width':w,'height':h,'roi':[l,t,r,bt],'roiRgbSha256':hashlib.sha256(rgb).hexdigest(),'roiPixels':len(rgb)//3,'roiUniqueColors':len(cnt),'red':cnt[(215,50,41)],'white':cnt[(255,255,255)],'black':cnt[(0,0,0)],'gray':sum(n for (r,g,b),n in cnt.items() if r==g==b),'topColors':cnt.most_common(5)}
