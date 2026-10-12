"""Build event folders from a downloaded Hazzat service-order snapshot.
Usage: python3 tools/build_hymn_folders.py /tmp/rn-hazzat-order.json
Only names, ordering, and links are exported; hymn texts remain in the local library.
"""
import json,re,sys,difflib
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
catalog=json.loads((ROOT/'assets/library-data.js').read_text().split('=',1)[1].strip().rstrip(';'))['hymns']
source=json.loads(Path(sys.argv[1]).read_text())
def norm(s):return re.sub(r'[^a-z0-9 ]',' ',s.lower()).strip()
def compact(s):return norm(s).replace(' ','')
def words(s):return set(norm(s).split())
def sim(a,b):
 a,b=words(a),words(b)
 return len(a&b)/max(1,len(a|b))
texts={}
for x in catalog:
 d=json.loads((ROOT/'assets/resources'/f"{x['id']}.json").read_text())
 texts[x['id']]=' '.join(d['units'][0]['verses'].get('english',[])[:2]) if d['units'] else ''
aliases={
 'annual':['Annual','/raising-of-incense/','/praise/','/divine-liturgy/','/offering-of-the-lamb/'],
 'paramoune-of-nativity':['Nativity Paramone','/nativity-paramone/'],
 'paramoune-of-epiphany':['/theophany-paramone/'], 'epiphany':['Epiphany','/theophany/'],
 'feast-of-circumcision':['/circumcision/'], 'the-wedding-at-cana-of-galilee':['Wedding At Cana Of Galilee','/wedding-at-cana-of-galilee/'],
 'the-lords-entry-into-the-temple':['/presentation/','/christ-entry-into-temple/'],
 'ninevehs-fast':['/fast-of-nineveh/'], 'ninevehs-feast':['/feast-of-nineveh/'],
 'great-lent-saturdays-sundays':['Saturday Sunday','/great-lent/saturdays-sundays/'], 'great-lent-weekdays':['/great-lent/days/','/great-lent/liturgy-great-lent-days/'],
 'the-lords-entry-into-jerusalem-palm-sunday':['Palm Sunday'],
 'passion-week-general-hours':['/holy-week/pascha/','/holy-week/pascha-additions/'],
 'passion-pascha-week-covenant-thursday':['Covenant Thursday','/holy-thursday/'],
 'passion-pascha-week-good-friday':['Good Friday'],
 'saint-marys-fastfeast':['Theotokos Hymns'], 'glorifications':['Angels & Saints','/veneration/'],
 'papal':['Patriarch & Bishop'], 'coptic-weddings':['/wedding/'],
}
names={'annual':'Annual & Everyday Services','paramoune-of-nativity':'Nativity Paramoun','paramoune-of-epiphany':'Theophany Paramoun','epiphany':'Theophany','the-wedding-at-cana-of-galilee':'Wedding at Cana','the-lords-entry-into-the-temple':'Presentation in the Temple','great-lent-saturdays-sundays':'Great Lent — Saturdays & Sundays','great-lent-weekdays':'Great Lent — Weekdays','the-lords-entry-into-jerusalem-palm-sunday':'Palm Sunday','passion-week-general-hours':'Holy Week — General Hours','passion-pascha-week-covenant-thursday':'Covenant Thursday','passion-pascha-week-good-friday':'Good Friday','saint-marys-fastfeast':'St. Mary’s Fast & Feast','papal':'Patriarch & Bishop','reception-of-new-priest':'Reception of a New Priest','apostles-fast':'Apostles’ Fast','apostles-feast':'Feast of the Apostles'}
# Explicit equivalences for alternate transliterations and shared Holy Week hymns.
manual={
 ('passion-pascha-week-good-friday','6th-hour'):['hymns-taishouri-paschal','hymns-fai-etaf-enf','hymns-tiepistoli-paschal','hymns-sixth-hour-litanies-paschal','hymns-omonogenis','hymns-trisagion-etribi',None,None,'hymns-the-confession-of-the-right-hand-thief','hymns-dimas'],
 ('passion-pascha-week-good-friday','9th-hour'):['hymns-tishouri-paschal','hymns-fai-etaf-enf','hymns-tianastasis-paschal','hymns-ninth-hour-litanies-paschal','hymns-trisagion-etribi',None],
 ('passion-pascha-week-good-friday','12th-hour'):['hymns-pekethronos-paschal','hymns-gholghotha'],
}
byid={x['id']:x for x in catalog}
folders=[];coverage=set();matched=0;missing=[]
for season in sorted(source,key=lambda x:x['order']):
 sid=season['id'];name=names.get(sid,season['name']);terms=aliases.get(sid,[season['name'],f'/{sid}/'])
 candidates=[x for x in catalog if any(t in x['tags'] or (t.startswith('/') and t in x.get('sourceUrl','')) for t in terms)]
 selected={x['id'] for x in candidates};services=[];ordered=set()
 for service in season['services']:
  entries=[];used=set()
  for index,h in enumerate(sorted(service['hymns'],key=lambda x:x['order'])):
   target=None
   if (sid,service['id']) in manual:target=manual[(sid,service['id'])][index]
   else:
    scores=[]
    for x in catalog:
     title=difflib.SequenceMatcher(None,compact(h['name']),compact(x['title'])).ratio()
     text=sim(h.get('english',''),texts[x['id']]) if len(h.get('english',''))>45 else 0
     local=x['id'] in selected
     score=max(text,title*.9)+(0.12 if local else 0)
     # Do not equate short, generic replies or similar feast variants across events.
     if (local and (text>=.72 or title>=.78)) or (text>=.85 and len(h.get('english',''))>70):scores.append((score,x['id']))
    if scores:target=max(scores)[1]
   if target and target not in used:
    assert target in byid,target
    entry={'id':target,'order':h['order'],'sourceTitle':h['name']}
    if target=='hymns-trisagion-etribi' and 'good-friday' in sid:entry['title']='Mournful Agios'
    if target=='hymns-pekethronos-paschal':entry['title']='Pek Ethronos'
    entries.append(entry);used.add(target);ordered.add(target);matched+=1
   elif not target:missing.append((name,service['name'],h['name']))
  if entries:services.append({'id':service['id'],'name':service['name'],'sourceUrl':f"https://www.hazzat.com/Seasons/{sid}/services/{service['id']}",'entries':entries})
 rest=[{'id':x['id']} for x in candidates if x['id'] not in ordered]
 if rest:services.append({'id':'additional','name':'More hymns for this event','entries':rest})
 ids=ordered|selected;coverage|=ids
 folders.append({'id':sid,'name':name,'order':season['order'],'count':len(ids),'services':services})
# Supplemental folders retain every local hymn that is outside the Hazzat event catalogue.
extras=[('saints-angels','Saints & Angels',lambda x:any(t.endswith(' Hymns') and t not in ['Congregation Hymns','Deacon Hymns','Priest Hymns'] for t in x['tags'])),('agpeya','Agpeya',lambda x:'Agpeya' in x['tags'] or '/agpeya/' in x.get('sourceUrl','')),('other-hymns','Other Hymns',lambda x:True)]
for fid,name,test in extras:
 remaining=[x for x in catalog if (fid!='other-hymns' or x['id'] not in coverage) and test(x)]
 if remaining:
  folders.append({'id':fid,'name':name,'order':len(folders)+1,'count':len(remaining),'services':[{'id':'hymns','name':'Hymns','entries':[{'id':x['id']} for x in remaining]}]});coverage|={x['id'] for x in remaining}
assert len(coverage)==len(catalog)
out={'source':'Hazzat.com','sourceUrl':'https://www.hazzat.com/','checked':'2026-10-12','folders':folders}
(ROOT/'assets/hymn-folders.js').write_text('window.RN_HYMN_FOLDERS = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n')
print('Folders:',len(folders),'Hymns covered:',len(coverage),'Ordered service entries:',matched,'Unmatched Hazzat entries:',len(missing))
for f in folders:print(f['id'],f['count'])
Path('/tmp/rn-hymn-order-unmatched.json').write_text(json.dumps(missing,indent=2))
