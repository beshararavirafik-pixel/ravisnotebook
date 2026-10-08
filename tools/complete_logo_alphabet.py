"""Extend RNLOGO using its existing engraved capitals as shape donors.
Preserve the original wordmark and traced capitals. Build the missing capitals
with the same pointed terminals, narrow proportions, incisions and dot accents;
apply that treatment to real lowercase forms. Source RNLOGO 1.1 is bundled.
"""
from pathlib import Path
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
root=Path(__file__).resolve().parent.parent
source=root/'tools/font-sources/RNLOGO-v1.ttf'
f=TTFont(source); cm=f.getBestCmap()
face=ImageFont.truetype(str(source),800)
H=640; W=420; top=20; base=620

def donor(ch,width=280):
 im=Image.new('L',(1000,1000)); ImageDraw.Draw(im).text((20,820),ch,font=face,fill=255,anchor='ls')
 a=np.array(im);ys,xs=np.where(a>100);crop=a[ys.min():ys.max()+1,xs.min():xs.max()+1]
 out=np.zeros((H,W),np.uint8);out[top:base,:width]=cv2.resize(crop,(width,600));return out

def poly(a,pts,color=255):cv2.fillPoly(a,[np.array(pts,np.int32)],color)
def stem(a,x,width=60,y0=top,y1=base):
 poly(a,[(x-22,y0),(x+width+22,y0),(x+width-10,y0+55),(x+width-10,y1-55),(x+width+22,y1),(x-22,y1),(x+12,y1-55),(x+12,y0+55)])
 cv2.line(a,(x+22,y0+36),(x+22,y1-36),0,3)
def bar(a,x0,x1,y,width=42):poly(a,[(x0,y-width//2),(x1,y-width),(x1-12,y+width),(x0,y+width//2)])
def dot(a,x,y,r=8):cv2.circle(a,(x,y),r,0,-1)

def capital(ch):
 a=np.zeros((H,W),np.uint8);width=280
 if ch in 'CG':
  a=donor('O');poly(a,[(170,90),(310,20),(310,base),(165,base-75),(240,490),(240,140)],0)
  poly(a,[(170,top),(280,top),(242,155)]);poly(a,[(174,base),(280,base),(240,480)])
  if ch=='G':bar(a,160,280,350,45);stem(a,225,42,350,base);dot(a,244,460,6)
 elif ch=='D':
  a=donor('O');a[:,:82]=0;stem(a,20,72);poly(a,[(30,top),(150,top),(110,62)]);poly(a,[(30,base),(150,base),(110,575)])
 elif ch=='F':
  a=donor('E');a[390:,100:]=0;stem(a,20,68);dot(a,160,310)
 elif ch=='H':
  stem(a,22,62);stem(a,212,62);bar(a,65,245,325,46);dot(a,145,326,7)
 elif ch=='J':
  a=donor('O');a[:390,:180]=0;poly(a,[(0,0),(180,0),(180,450),(0,450)],0);stem(a,195,65,top,465);poly(a,[(120,top),(290,top),(250,75)]);dot(a,85,555)
 elif ch=='L':
  a=donor('E');a[:480,110:]=0;stem(a,22,70);poly(a,[(100,base),(280,base),(280,478),(235,560),(100,570)])
 elif ch=='M':
  width=350;stem(a,22,40);stem(a,285,48)
  poly(a,[(38,top),(120,top),(220,480),(190,base),(70,190)])
  poly(a,[(285,top),(330,top),(197,base),(170,520)])
  cv2.line(a,(86,70),(192,536),0,3);dot(a,189,565,7)
 elif ch=='P':
  a=donor('B');a[340:,100:]=0;stem(a,22,70);dot(a,196,281)
 elif ch=='Q':
  a=donor('O');poly(a,[(145,465),(210,500),(330,635),(258,635)]);cv2.line(a,(177,510),(286,610),0,3);width=330
 elif ch=='U':
  a=donor('O');a[:370,90:190]=0;stem(a,15,65,top,370);stem(a,205,48,top,370);dot(a,140,565)
 elif ch=='W':
  width=360;a=donor('V',190);right=donor('V',190);a[:,170:360]=np.maximum(a[:,170:360],right[:,:190]);dot(a,85,520,6);dot(a,256,520,6)
 elif ch=='X':
  poly(a,[(0,top),(95,top),(280,base),(185,base)]);poly(a,[(190,top),(280,top),(50,base),(0,base)])
  cv2.line(a,(40,55),(226,580),0,3);dot(a,146,330)
 elif ch=='Y':
  a=donor('V');a[380:]=0;stem(a,110,60,330,base);dot(a,140,460)
 elif ch=='Z':
  poly(a,[(0,top),(280,top),(65,base),(0,base),(210,top+70),(42,top+70),(0,155)])
  poly(a,[(0,base),(280,base),(280,470),(230,base-60),(58,base-60)])
  cv2.line(a,(218,110),(48,562),0,3);dot(a,141,355)
 return a,width

def vector(a):
 mask=(a>100).astype('uint8'); contours,_=cv2.findContours(mask,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE);pen=TTGlyphPen(None)
 for contour in contours:
  if cv2.contourArea(contour)<.8:continue
  points=cv2.approxPolyDP(contour,.35,True).reshape(-1,2)
  if len(points)<3:continue
  pts=[(round(x*2.5+40),round((base-y)*2.5)) for x,y in points]
  pen.moveTo(pts[0])
  for point in pts[1:]:pen.lineTo(point)
  pen.closePath()
 return pen.glyph()
for ch in 'CDFGHJLMPQUWXYZ':
 a,width=capital(ch);f['glyf'][cm[ord(ch)]]=vector(a);f['hmtx'][cm[ord(ch)]]=(round(width*2.5+80),40)
# Draw true lowercase forms with the same capitals as shape donors.
# x-height is 950 units, with full-height ascenders and 450-unit descenders.
def small(ch,width=200,height=380,y0=240):
 source=capital(ch)[0] if ch in 'CDFGHJLMPQUWXYZ' else donor(ch)
 mask=source[top:base,:capital(ch)[1] if ch in 'CDFGHJLMPQUWXYZ' else 280]
 a=np.zeros((840,W),np.uint8);a[y0:y0+height,:width]=cv2.resize(mask,(width,height));return a

def lower(ch):
 a=np.zeros((840,W),np.uint8);width=200
 if ch in 'cosvwxz':return small(ch.upper(),220 if ch=='w' else 200),220 if ch=='w' else 200
 if ch in 'bdpq':
  a=small('O',185); x=6 if ch in 'bp' else 150
  stem(a,x,48,40 if ch in 'bd' else 240,800 if ch in 'pq' else 620)
  dot(a,95,583,5)
 elif ch=='a':
  a=small('O',185);stem(a,150,48,240,620);poly(a,[(145,240),(205,240),(183,290)]);dot(a,85,570,5)
 elif ch=='e':
  a=small('O',200);poly(a,[(112,427),(215,415),(215,540),(156,525)],0);bar(a,28,185,414,32);dot(a,110,574,5)
 elif ch in 'nhm':
  width=310 if ch=='m' else 215
  # Open arch with a pointed inner shoulder and broad outer curve.
  a=small('O',200);a[435:]=0
  stem(a,12,42,40 if ch=='h' else 240,620)
  poly(a,[(147,375),(193,375),(183,575),(210,620),(140,620),(154,580)])
  cv2.line(a,(165,420),(165,579),0,2)
  if ch=='m':
   second=a.copy();a[:,110:310]=np.maximum(a[:,110:310],second[:,:200]);stem(a,12,42,240,620)
  dot(a,173,525,5)
 elif ch=='r':
  a=small('O',175,245);a[355:]=0;stem(a,12,48,240,620);poly(a,[(110,250),(188,240),(163,349)]);dot(a,139,286,5);width=185
 elif ch in 'ilj':
  width=100 if ch in 'il' else 165
  stem(a,22,46,45 if ch=='l' else 285,800 if ch=='j' else 620)
  if ch!='l':
   poly(a,[(46,185),(73,220),(46,256),(18,220)]);dot(a,46,220,5)
  if ch=='j':poly(a,[(34,695),(67,745),(26,809),(-5,766)]);dot(a,43,560,5)
 elif ch=='t':
  stem(a,37,54,130,620);bar(a,0,165,292,32);dot(a,64,552,5);width=175
 elif ch=='f':
  a=small('C',175,230,40);a[200:]=0;stem(a,44,58,150,620);bar(a,0,172,292,32);dot(a,77,552,5);width=185
 elif ch=='k':
  a=small('K',230);stem(a,12,47,40,620);width=235
 elif ch=='u':a=small('U',205);width=210
 elif ch=='y':
  a=small('V',210);poly(a,[(105,505),(152,532),(86,800),(24,800)]);cv2.line(a,(119,580),(65,760),0,2);dot(a,86,710,5);width=215
 elif ch=='g':
  a=small('O',190,335,240);tail=small('O',170,200,610);a=np.maximum(a,tail);poly(a,[(140,490),(173,490),(170,683),(126,657)]);poly(a,[(150,247),(223,232),(192,300)]);width=225
 return a,width
for ch in 'abcdefghijklmnopqrstuvwxyz':
 mask,width=lower(ch);f['glyf'][cm[ord(ch)]]=vector(mask);f['hmtx'][cm[ord(ch)]]=(round(width*2.5+80),40)
f['OS/2'].sxHeight=950
for ident,value in [(3,'RNLOGO-Regular-2.0'),(5,'Version 2.0')]:
 for platform,encoding in [(3,1),(1,0)]:f['name'].setName(value,ident,platform,encoding,0x409 if platform==3 else 0)
f.save(root/'fonts/RNLOGO.ttf');f.flavor='woff';f.save(root/'fonts/RNLOGO.woff')
print('Completed RNLOGO: 26 engraved capitals, 26 real lowercase forms; original wordmark preserved.')
