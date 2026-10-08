"""Import the traditional Pascha doxology from Hazzat's public Text format.
CS Coptic keyboard codes are decoded to Unicode, independent of font layout.
Usage: python3 tools/import_hazzat_pascha.py <downloaded pascha-hours.json>
"""
import json, re, sys
from pathlib import Path
root=Path(__file__).resolve().parent.parent
# CS Coptic uses y for eta, h for hori, ;/: for theta, ` for a prefix jinkim.
keys=['a','b','g','d','e','^','z','y',';','i','k','l','m','n','x','o','p','r','c','t','u','v',',',"'",'w']
cs={}
for n,key in enumerate(keys):
    cs[key]=chr(0x2C81+n*2)
    upper=key.upper() if key.isalpha() else {';':':',',':'<',"'":'"'}.get(key,key)
    if upper != key: cs[upper]=chr(0x2C80+n*2)
for code,key in [(0x3E2,'s'),(0x3E4,'f'),(0x3E6,'q'),(0x3E8,'h'),(0x3EA,'j'),(0x3EC,'['),(0x3EE,']')]:
    cs[key]=chr(code+1);cs[key.upper() if key.isalpha() else {'[':'{',']':'}'}[key]]=chr(code)
cs.update({'@':':','=':'\u0305'})
def decode(text):
    out=[];grave=False
    for c in text:
        if c=='`':grave=True;continue
        out.append(cs.get(c,c))
        if grave:out.append('\u0300');grave=False
    return ''.join(out)
if __name__=='__main__':
    service=json.loads(Path(sys.argv[1]).read_text())
    hymn=next(h for h in service['hymns'] if h['id']=='doxology-of-pascha')
    variation=next(f for f in hymn['formats'] if f['id']=='1')['variations'][0]
    paragraphs=variation['content']['paragraphs']
    notes=[];pending=''
    for paragraph in paragraphs:
        if paragraph.get('isComment'):
            pending=' '.join(c['content'] for c in paragraph['columns'] if c['language']=='English')
        else:
            notes.append(pending);pending=''
    raw=[next(c['content'] for c in p['columns'] if c['language']=='Coptic') for p in paragraphs if not p.get('isComment')]
    path=root/'assets/resources/hymns-thok-te-tigom.json';data=json.loads(path.read_text());unit=data['units'][0];v=unit['verses']
    # Keep the site's existing translations, regrouped to follow Hazzat's five passages.
    translations=data.get('copticSource',{}).get('originalTranslations') or {'english':v['english'],'arabic':v['arabic']}
    en=translations['english'];ar=translations['arabic'];clean=lambda t:re.sub(r'^\+\s*','',t)
    v['english']=[clean(en[0])+' '+clean(en[1]),clean(en[0])+' O my Lord Jesus Christ.', 'My Good Savior.',clean(en[4]),clean(en[5])]
    v['arabic']=[clean(ar[0])+' '+clean(ar[1]),clean(ar[0])+' يَا رَبِّي يَسُوعُ الْمَسِيحُ.', 'مُخَلِّصِي الصَّالِحُ.',clean(ar[4]),clean(ar[5])]
    v['coptic']=[decode(t) for t in raw]
    unit['notes']=notes
    data['copticSource']={'name':'Hazzat.com','url':'https://www.hazzat.com/Seasons/passion-week-general-hours/services/pascha-hours/hymns/doxology-of-pascha','keyboardEncoding':'CS Coptic','originalText':raw,'originalTranslations':translations}
    path.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n')
    print('Imported',len(raw),'Coptic passages from Hazzat, preserving Unicode and source keyboard text.')
