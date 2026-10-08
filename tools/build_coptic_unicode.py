"""Unicode aliases for the supplied Coptic1 outlines; original file untouched.
Legacy Latin keyboard mappings remain available for existing text and Hazzat.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
root=Path(__file__).resolve().parent.parent
font=TTFont(root/'fonts/Coptic1.ttf');source=font.getBestCmap();aliases={}
# Source glyphs checked against the supplied font's rendered keyboard chart.
keys=['a','b','g','d','e','^','z','h','y','i','k','l','m','n','x','o','p','r','c','t','u','v',',',"'",'w']
for offset,key in enumerate(keys):
 aliases[0x2C80+offset*2]=source[ord(key.upper() if key.isalpha() else {',':'<',"'":'"'}.get(key,key))]
 aliases[0x2C81+offset*2]=source[ord(key)]
for code,lower,upper in [(0x3E2,'s','S'),(0x3E4,'f','F'),(0x3E6,'q','Q'),(0x3E8,'/','?'),(0x3EA,'j','J'),(0x3EC,'[','{'),(0x3EE,']','}')]:
 aliases[code]=source[ord(upper)];aliases[code+1]=source[ord(lower)]
# The source's zero-advance jinkim is already positioned over the previous glyph.
aliases[0x300]=source[ord('~')]
# Add the supralinear stroke used in the Unicode hymn texts.
pen=TTGlyphPen(None);pen.moveTo((-600,745));pen.lineTo((-35,745));pen.lineTo((-35,777));pen.lineTo((-600,777));pen.closePath()
name='Coptic.overline';font.setGlyphOrder(font.getGlyphOrder()+[name]);font['glyf'][name]=pen.glyph();font['hmtx'][name]=(0,-600)
aliases[0x305]=name;aliases[0xFE26]=name
# Occasional Greek spellings in the Coptic column use the corresponding outlines.
aliases[0x3A0]=source[ord('P')];aliases[0x3BB]=source[ord('l')]
for table in font['cmap'].tables:
 if table.isUnicode():table.cmap.update(aliases)
for ident,value in [(1,'Coptic1 Unicode'),(2,'Normal'),(3,'Coptic1-Unicode-1.0'),(4,'Coptic1 Unicode'),(5,'Version 1.0 — Unicode aliases'),(6,'Coptic1-Unicode')]:
 font['name'].setName(value,ident,3,1,0x409)
font['OS/2'].usWeightClass=400;font['OS/2'].usWinAscent=max(font['OS/2'].usWinAscent,820)
font.save(root/'fonts/Coptic1-Unicode.ttf')
print(f'Added {len(aliases)} Unicode mappings; original Coptic1 outlines and legacy mappings preserved.')
