(() => {
'use strict';
const data=window.RN_DATA;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').toLowerCase();
const matches=(item,q)=>norm([item.title,item.arabic,item.coptic,item.author,...(item.tags||[]),...(item.categories||[]),...(item.arabicTags||[])].join(' ')).includes(norm(q));
const external=u=>/^https?:/.test(u)?' target="_blank" rel="noopener noreferrer"':'';
let saved;try{saved=new Set(JSON.parse(localStorage.getItem('rn_saved_resources')||'[]'));}catch{saved=new Set();}
const saveMarkup=item=>`<button class="save-button" data-save="${esc(item.id)}" aria-label="Save ${esc(item.title)}" aria-pressed="${saved.has(item.id)}">${saved.has(item.id)?'★':'☆'}</button>`;
const catalogue=[...data.hymns,...data.books,...data.notes];
[...document.querySelectorAll('.note-item')].map((el,i)=>{el.id=el.id||'note-'+(i+1);return {id:el.id,title:el.querySelector('.note-title')?.textContent||'',tags:[el.querySelector('.note-cat')?.textContent||''],url:'notes.html#'+el.id,type:'notes',source:'Ravi’s Notebook'};});
const pages=[{title:'Notes & reflections',url:'notes.html',type:'Pages'},{title:'The Hymn Library',url:'hymnology.html',type:'Pages'},{title:'The Book Library',url:'books.html',type:'Pages'},{title:'Rites & History',url:'rites.html',type:'Pages'},{title:'Patristics',url:'patristics.html',type:'Pages'},{title:'Apologetics',url:'apologetics.html',type:'Pages'}];
const localNoteIndex=[{title:'Chastity and the Saints',url:'notes.html#note-1',type:'notes',source:'Ravi’s Notebook'},{title:'St. Athanasius and the defense of Orthodoxy',url:'notes.html#note-2',type:'notes',source:'Ravi’s Notebook'},{title:'The Order of Reader – roles and responsibilities',url:'notes.html#note-3',type:'notes',source:'Ravi’s Notebook'},{title:'St. Macarius the Great – Desert Father of Egypt',url:'notes.html#note-4',type:'notes',source:'Ravi’s Notebook'},{title:'Understanding the Divine Liturgy of St. Basil',url:'notes.html#note-5',type:'notes',source:'Ravi’s Notebook'}];
const searchItems=[...pages,...localNoteIndex,...catalogue];
const dialog=document.createElement('dialog');dialog.className='rn-search-dialog';dialog.setAttribute('aria-label','Search Ravi’s Notebook');dialog.innerHTML='<div class="search-dialog-top"><input class="rn-input" aria-label="Search all resources" placeholder="Search hymns, books, notes…" type="search"><button type="button" aria-label="Close search">Close ×</button></div><div class="search-results-list" aria-live="polite"></div><p class="rn-result-info">Search in English, Arabic, or Coptic · Esc to close</p>';document.body.append(dialog);
const searchInput=dialog.querySelector('input'),searchResults=dialog.querySelector('.search-results-list');
let beforeSearch,searchAnchor;
const positionSearch=()=>{const r=searchAnchor.getBoundingClientRect(),width=Math.min(560,innerWidth-32);dialog.style.width=width+'px';dialog.style.left=Math.max(16,Math.min(r.right-width,innerWidth-width-16))+'px';const top=Math.max(16,r.top);dialog.style.top=top+'px';dialog.style.maxHeight=Math.max(180,innerHeight-top-16)+'px';return r;};
window.openSearch=()=>{if(dialog.open){searchInput.focus();return;}beforeSearch=document.activeElement;searchAnchor=document.querySelector('[data-open-search]');const r=positionSearch();dialog.show();searchAnchor.setAttribute('aria-expanded','true');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){dialog.animate([{clipPath:`inset(0 0 calc(100% - ${r.height}px) calc(100% - ${r.width}px) round 24px)`,opacity:.6},{clipPath:'inset(0 0 0 0 round 18px)',opacity:1}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'});}searchInput.focus();};
window.closeSearch=()=>{if(!dialog.open)return;dialog.close();searchAnchor?.setAttribute('aria-expanded','false');beforeSearch?.focus();};
window.addEventListener('resize',()=>{if(dialog.open)positionSearch();});
window.addEventListener('scroll',()=>{if(dialog.open)positionSearch();},{passive:true});
document.addEventListener('pointerdown',e=>{if(dialog.open&&!dialog.contains(e.target)&&!e.target.closest('[data-open-search]'))window.closeSearch();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open){e.preventDefault();window.closeSearch();}});

dialog.querySelector('button').addEventListener('click',window.closeSearch);dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)window.closeSearch();}});
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim();const found=(q?searchItems.filter(x=>matches(x,q)):pages).slice(0,12);searchResults.innerHTML=found.length?found.map(x=>`<a class="search-result" href="${esc(x.url)}"${external(x.url)}><small>${esc(x.type)}${x.source?' · '+esc(x.source):''}</small><h3>${esc(x.title)}</h3>${x.arabic?`<small lang="ar" dir="rtl">${esc(x.arabic)}</small>`:''}</a>`).join(''):'<p class="rn-empty">No matches. Try another title or keyword.</p>';});searchInput.dispatchEvent(new Event('input'));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();window.openSearch();}});
document.querySelectorAll('[data-open-search]').forEach(b=>{b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','notebook-search');b.setAttribute('aria-haspopup','dialog');b.addEventListener('click',window.openSearch);});dialog.id='notebook-search';
const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.rn-nav-links a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page');});
// Drawer keyboard support supplements the retained editing engine.
const menu=document.querySelector('.nav-menu-btn'),drawer=document.querySelector('#drawer');
if(menu&&drawer){const oldOpen=window.openDrawer,oldClose=window.closeDrawer;window.openDrawer=()=>{if(oldOpen)oldOpen();else{drawer.classList.add("open");document.querySelector("#drawerOverlay").classList.add("open");document.body.style.overflow="hidden";}menu.setAttribute('aria-expanded','true');drawer.setAttribute('aria-hidden','false');drawer.inert=false;drawer.querySelector('button')?.focus();};window.closeDrawer=()=>{const wasOpen=drawer.classList.contains('open');if(oldClose)oldClose();else{drawer.classList.remove("open");document.querySelector("#drawerOverlay").classList.remove("open");document.body.style.overflow="";}menu.setAttribute('aria-expanded','false');drawer.setAttribute('aria-hidden','true');drawer.inert=true;if(wasOpen)menu.focus();};drawer.inert=true;drawer.setAttribute('aria-hidden','true');drawer.addEventListener('keydown',e=>{if(e.key==='Tab'){const els=[...drawer.querySelectorAll('a,button')];if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}}});}
document.querySelectorAll('[data-count]').forEach(el=>el.textContent=data[el.dataset.count].length);
// One selection per calendar day in the church's Eastern time zone.
const daily=document.querySelector('.rn-daily-hymn');
if(daily&&data.hymns.length){
  let renderedDay;
  const updateDailyHymn=()=>{
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now);
    const part=type=>Number(parts.find(p=>p.type===type).value);
    const day=Math.floor(Date.UTC(part('year'),part('month')-1,part('day'))/86400000);
    if(day===renderedDay)return;
    renderedDay=day;
    const hymn=data.hymns[((day%data.hymns.length)+data.hymns.length)%data.hymns.length];
    daily.querySelector('[data-daily-title]').textContent=hymn.title;
    daily.querySelector('[data-daily-link]').href=hymn.url;
    daily.querySelector('[data-daily-tags]').innerHTML=(hymn.tags||[]).slice(0,3).map(tag=>`<span class="rn-tag">${esc(tag)}</span>`).join('');
    const date=daily.querySelector('[data-daily-date]');
    date.dateTime=`${part('year')}-${String(part('month')).padStart(2,'0')}-${String(part('day')).padStart(2,'0')}`;
    date.textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'long',day:'numeric'}).format(now);
  };
  updateDailyHymn();
  setInterval(updateDailyHymn,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateDailyHymn();});
}
const library=document.querySelector('[data-library]');let renderLibrary;
if(library){const kind=library.dataset.library,items=data[kind]||[],input=document.querySelector('#library-search'),category=document.querySelector('#library-category'),format=document.querySelector('#library-format'),savedOnly=document.querySelector('#saved-only'),info=document.querySelector('#library-count'),more=document.querySelector('#load-more');let limit=24;let onlySaved=false;
const tags=[...new Set(items.flatMap(x=>x.tags))].sort((a,b)=>a.localeCompare(b));category.innerHTML='<option value="">All topics</option>'+tags.map(t=>`<option>${esc(t)}</option>`).join('');
const query=new URLSearchParams(location.search);input.value=query.get('q')||'';if(query.has('topic')&&tags.includes(query.get('topic')))category.value=query.get('topic');
renderLibrary=()=>{const filtered=items.filter(x=>matches(x,input.value)&&(!category.value||x.tags.includes(category.value))&&(!onlySaved||saved.has(x.id))&&(!format?.value||x.files?.some(f=>f.format.includes(format.value))));info.textContent=`${filtered.length} ${kind==='hymns'?'hymns':kind==='books'?'books':'reading links'}${input.value?' matching “'+input.value+'”':''} · showing ${Math.min(limit,filtered.length)}`;
library.innerHTML=filtered.length?filtered.slice(0,limit).map(x=>`<article class="rn-resource"><div class="resource-top"><span class="resource-symbol" aria-hidden="true">${kind==='hymns'?'♪':kind==='books'?'☷':'¶'}</span>${saveMarkup(x)}</div><h3><a href="${esc(x.url)}"${external(x.url)}>${esc(x.title)}</a></h3>${x.arabic?`<p class="resource-arabic" lang="ar" dir="rtl">${esc(x.arabic)}</p>`:''}${x.coptic?`<p class="resource-coptic" lang="cop">${esc(x.coptic)}</p>`:''}<p class="resource-details" dir="auto">${esc(x.author||x.tags.join(' · '))}</p>${x.updated?`<p class="resource-details">Updated ${esc(new Date(x.updated.replace(' UTC','Z').replace(' ','T')).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}))}</p>`:''}<div class="resource-actions"><a href="${esc(x.url)}"${external(x.url)}>${external(x.url)?'Read at source ↗':x.type==='books'?'Read book →':'Read hymn →'}</a><span>${(x.files||[]).map(f=>`<a href="${esc(f.url)}"${external(f.url)}${external(f.url)?'':' download'}>${esc(f.format)} ↓</a>`).join(' · ')}</span></div><div class="resource-source">${esc(x.source)}</div></article>`).join(''):'<p class="rn-empty">No resources match these filters. Try another search or choose All topics.</p>';more.hidden=limit>=filtered.length;};
[input,category,format].filter(Boolean).forEach(el=>el.addEventListener('input',()=>{limit=24;renderLibrary();}));savedOnly.addEventListener('click',()=>{onlySaved=!onlySaved;savedOnly.setAttribute('aria-pressed',onlySaved);limit=24;renderLibrary();});more.addEventListener('click',()=>{limit+=24;renderLibrary();});document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{library.classList.toggle('list-view',btn.dataset.view==='list');document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b===btn));}));renderLibrary();}
document.querySelectorAll("[data-save]").forEach(btn=>{btn.setAttribute("aria-pressed",saved.has(btn.dataset.save));btn.textContent=saved.has(btn.dataset.save)?"★":"☆";});
document.addEventListener('keydown',e=>{if(e.key==="Escape")window.closeDrawer?.();});
document.addEventListener('click',e=>{const btn=e.target.closest('[data-save]');if(!btn)return;const id=btn.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);try{localStorage.setItem('rn_saved_resources',JSON.stringify([...saved]));}catch{}btn.setAttribute('aria-pressed',saved.has(id));btn.textContent=saved.has(id)?'★':'☆';renderLibrary?.();});
// Keep the existing lesson content, adding precise filtering and expandable ARIA state.
const noteSearch=document.querySelector('#notes-search'),noteCategory=document.querySelector('#notes-category');if(noteSearch){const notes=[...document.querySelectorAll('.note-item')];const filter=()=>{notes.forEach(el=>el.hidden=!norm(el.textContent).includes(norm(noteSearch.value))||!!(noteCategory.value&&!el.querySelector('.note-cat').textContent.includes(noteCategory.value)));document.querySelector('#notes-count').textContent=notes.filter(el=>!el.hidden).length+' notes';};noteSearch.addEventListener('input',filter);noteCategory.addEventListener('change',filter);filter();notes.forEach(el=>{const btn=el.querySelector('.note-trigger'),body=el.querySelector('.note-body');body.id=el.id+'-body';btn.setAttribute('aria-controls',body.id);btn.setAttribute('aria-expanded','false');body.setAttribute('aria-hidden','true');btn.addEventListener('click',()=>notes.forEach(n=>{const open=n.classList.contains('open');n.querySelector('.note-trigger').setAttribute('aria-expanded',open);n.querySelector('.note-body').setAttribute('aria-hidden',!open);}));});if(location.hash){const el=document.getElementById(location.hash.slice(1));el?.querySelector('.note-trigger')?.click();}}

})();
