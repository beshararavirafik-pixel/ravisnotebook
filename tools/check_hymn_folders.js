// Check local hymn coverage and the source-verified Good Friday sequence.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const root=path.resolve(__dirname,'..'),context={window:{}};
for(const name of ['library-data','hymn-folders'])vm.runInNewContext(fs.readFileSync(path.join(root,'assets',name+'.js'),'utf8'),context);
const hymns=context.window.RN_DATA.hymns,folders=context.window.RN_HYMN_FOLDERS.folders,ids=new Set(hymns.map(x=>x.id)),covered=new Set();
assert.equal(new Set(folders.map(f=>f.id)).size,folders.length);
for(const folder of folders){const seen=new Set();for(const service of folder.services){let last=0;for(const entry of service.entries){assert(ids.has(entry.id),entry.id);assert(fs.existsSync(path.join(root,'assets/resources',entry.id+'.json')));if(entry.order){assert(entry.order>last);last=entry.order;}seen.add(entry.id);covered.add(entry.id);}}assert.equal(folder.count,seen.size,folder.id);}
assert.deepEqual([...covered].sort(),[...ids].sort());
const friday=folders.find(f=>f.id==='passion-pascha-week-good-friday');
const services=friday.services.filter(s=>s.id!=='additional');
assert.deepEqual(Array.from(services,s=>s.id),['6th-hour','9th-hour','12th-hour']);
assert.deepEqual(Array.from(services[0].entries.slice(-2),e=>e.id),['hymns-the-confession-of-the-right-hand-thief','hymns-dimas']);
assert.deepEqual(Array.from(services[2].entries,e=>e.id),['hymns-pekethronos-paschal','hymns-gholghotha']);
for(const service of services.slice(0,2)){assert(service.entries.some(e=>e.id==='hymns-fai-etaf-enf'));assert(service.entries.some(e=>e.title==='Mournful Agios'));}
const html=fs.readFileSync(path.join(root,'hymnology.html'),'utf8');
assert(html.indexOf('assets/hymn-folders.js')<html.indexOf('assets/hymn-browser.js'));
assert(html.indexOf('assets/hymn-browser.js')<html.indexOf('assets/notebook.js'));
console.log(`${folders.filter(f=>f.count).length} visible folders; all ${ids.size} hymns covered; Good Friday order verified.`);
