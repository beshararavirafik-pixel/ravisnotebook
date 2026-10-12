(async()=>{
'use strict';
await window.RN_CMS?.ready;
const root=document.querySelector('[data-library="hymns"]'),data=window.RN_HYMN_FOLDERS;if(!root||!data)return;
const items=window.RN_DATA.hymns,byId=new Map(items.map(x=>[x.id,x]));
const folders=data.folders.filter(f=>f.count),byFolder=new Map(folders.map(f=>[f.id,f]));
const aliases=new Map();for(const f of folders)for(const s of f.services)for(const e of s.entries)aliases.set(e.id,[...(aliases.get(e.id)||[]),e.title||'',e.sourceTitle||'']);
const input=document.querySelector('#library-search'),category=document.querySelector('#library-category'),savedButton=document.querySelector('#saved-only'),info=document.querySelector('#library-count'),more=document.querySelector('#load-more'),view=document.querySelector('.rn-view-switch');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').toLowerCase();
const tags=[...new Set(items.flatMap(x=>x.tags))].sort((a,b)=>a.localeCompare(b));category.innerHTML='<option value="">All topics</option>'+tags.map(t=>`<option>${esc(t)}</option>`).join('');
let folder=null,all=false,onlySaved=false,limit=48,grid=false;
const nav=document.createElement('div');nav.className='rn-folder-nav';root.before(nav);
const eventIcon=id=>window.RN_EVENT_ICONS?.render(id)||'';
const saved=()=>{try{return new Set(JSON.parse(localStorage.getItem('rn_saved_resources')||'[]'));}catch{return new Set();}};
const accepts=(x,stars)=>!x?false:(!onlySaved||stars.has(x.id))&&(!category.value||x.tags.includes(category.value))&&norm([x.title,x.arabic,x.coptic,...x.tags,...(aliases.get(x.id)||[])].join(' ')).includes(norm(input.value.trim()));
function readURL(){const q=new URLSearchParams(location.search);folder=byFolder.get(q.get('event'))||null;all=q.get('all')==='1';input.value=q.get('q')||'';category.value=tags.includes(q.get('topic'))?q.get('topic'):'';limit=48;render();}
function updateURL(){const url=new URL(location.href);url.searchParams.delete('v');for(const k of ['event','all','q','topic'])url.searchParams.delete(k);if(folder)url.searchParams.set('event',folder.id);if(all)url.searchParams.set('all','1');if(input.value.trim())url.searchParams.set('q',input.value.trim());if(category.value)url.searchParams.set('topic',category.value);history.pushState(null,'',url);}
function open(id){folder=byFolder.get(id)||null;all=id==='all';input.value='';category.value='';onlySaved=false;savedButton.setAttribute('aria-pressed','false');limit=48;updateURL();render();nav.focus({preventScroll:true});nav.scrollIntoView({block:"start"});}
nav.tabIndex=-1;
const row=(entry,stars)=>{const x=byId.get(entry.id);return `<article class="rn-hymn-entry" data-rn-resource="${esc(x.id)}"><span class="rn-hymn-position" aria-hidden="true">${entry.order?String(entry.order).padStart(2,'0'):'♪'}</span><a class="rn-hymn-entry-link" href="${esc(x.url)}"><span>${esc(entry.title||x.title)}</span><span class="rn-entry-arrow" aria-hidden="true">↗</span></a><button class="save-button" data-save="${esc(x.id)}" aria-label="Save ${esc(x.title)}" aria-pressed="${stars.has(x.id)}">${stars.has(x.id)?'★':'☆'}</button></article>`;};
function render(){
 const stars=saved(),searching=!!input.value.trim()||!!category.value||onlySaved;
 view.hidden=!folder&&!all&&!searching;
 root.className='rn-event-browser'+(grid?' rn-event-grid':'');more.hidden=true;
 nav.innerHTML=folder||all||searching?`<button type="button" class="rn-folder-back" data-open-event="">← All events</button>${folder?`<h2 class="rn-event-title"><span class="rn-event-heading-icon">${eventIcon(folder.id)}</span>${esc(folder.name)}</h2>`:all?'<h2 class="rn-event-title">All hymns</h2>':'<h2 class="rn-event-title">Search results</h2>'}`:`<div class="rn-folder-intro"><p>Browse by event</p><button type="button" class="rn-folder-back" data-open-event="all">All ${items.length} hymns →</button></div>`;
 if(!folder&&!all&&!searching){
  info.textContent=`${folders.length} folders · ${items.length} hymns`;
  root.innerHTML='<div class="rn-event-folders">'+folders.map(f=>`<a class="rn-event-folder" href="hymnology.html?event=${encodeURIComponent(f.id)}" data-open-event="${esc(f.id)}"><span class="rn-folder-symbol">${eventIcon(f.id)}</span><span class="rn-folder-name">${esc(f.name)}</span><span class="rn-folder-count">${f.count} ${f.count===1?'hymn':'hymns'}</span><span class="rn-folder-arrow" aria-hidden="true">↗</span></a>`).join('')+'</div>';return;
 }
 if(folder){
  const services=folder.services.map(s=>({...s,entries:s.entries.filter(e=>accepts(byId.get(e.id),stars))})).filter(s=>s.entries.length);
  const count=new Set(services.flatMap(s=>s.entries.map(e=>e.id))).size;info.textContent=`${count} hymns${searching?' matching your filters':''}`;
  root.innerHTML=services.length?services.map(s=>`<section class="rn-event-service" aria-label="${esc(s.name)}"><h3>${esc(s.name)}</h3><div class="rn-event-hymns">${s.entries.map(e=>row(e,stars)).join('')}</div></section>`).join(''):'<p class="rn-empty">No hymns match. Try another search or topic.</p>';
 }else{
  const filtered=items.filter(x=>accepts(x,stars));info.textContent=`${filtered.length} hymns · showing ${Math.min(limit,filtered.length)}`;
  root.innerHTML=filtered.length?`<div class="rn-event-hymns">${filtered.slice(0,limit).map(x=>row({id:x.id},stars)).join('')}</div>`:'<p class="rn-empty">No hymns match. Try another search or topic.</p>';more.hidden=limit>=filtered.length;
 }
}
for(const el of [nav,root])el.addEventListener('click',e=>{const link=e.target.closest('[data-open-event]');if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();open(link.dataset.openEvent);});
input.addEventListener('input',()=>{limit=48;render();});category.addEventListener('change',()=>{limit=48;render();});savedButton.addEventListener('click',()=>{onlySaved=!onlySaved;savedButton.setAttribute('aria-pressed',onlySaved);render();});
more.addEventListener('click',()=>{limit+=48;render();});
document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{grid=btn.dataset.view==='grid';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b===btn));render();}));
document.addEventListener('rn-saved-change',render);window.addEventListener('popstate',readURL);readURL();
})();
