(async () => {
'use strict';
await window.RN_CMS?.ready;
const data=window.RN_DATA;
const siteNav=document.querySelector('#mainNav');


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
const dialog=document.createElement('dialog');dialog.className='rn-search-dialog';dialog.setAttribute('aria-label','Search Ravi’s Notebook');dialog.innerHTML='<div class="search-dialog-top"><input class="rn-input" aria-label="Search all resources" placeholder="Search hymns, books, notes…" type="search"><button type="button" aria-label="Close search">×</button></div><div class="search-results-list" aria-live="polite" hidden></div>';document.body.append(dialog);
const searchInput=dialog.querySelector('input'),searchResults=dialog.querySelector('.search-results-list');
let beforeSearch,searchAnchor,searchMotion,searchClosing=false;
const positionSearch=()=>{const r=searchAnchor.getBoundingClientRect(),width=Math.min(480,r.right-16,innerWidth-32);dialog.style.width=width+'px';dialog.style.left=Math.max(16,Math.min(r.right-width,innerWidth-width-16))+'px';const top=Math.max(16,r.top);dialog.style.top=top+'px';dialog.style.maxHeight=Math.max(180,innerHeight-top-16)+'px';return r;};
const collapsedSearch=()=>{const r=searchAnchor.getBoundingClientRect();return `inset(0 0 calc(100% - ${r.height}px) calc(100% - ${r.width}px) round 22px)`;};
window.openSearch=()=>{
  if(dialog.open&&!searchClosing){searchInput.focus();return;}
  const startingClip=dialog.open?getComputedStyle(dialog).clipPath:null;
  searchMotion?.cancel();searchClosing=false;dialog.style.pointerEvents='';
  if(!dialog.open){beforeSearch=document.activeElement;searchAnchor=document.querySelector('[data-open-search]');searchInput.value='';searchInput.dispatchEvent(new Event('input'));positionSearch();dialog.show();}
  searchAnchor.setAttribute('aria-expanded','true');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){searchMotion=dialog.animate([
    {clipPath:startingClip||collapsedSearch(),opacity:.35,transform:'scale(.98)',offset:0},
    {clipPath:'inset(0 0 0 0 round 22px)',opacity:1,transform:'scale(1.008)',offset:.78},
    {clipPath:'inset(0 0 0 0 round 20px)',opacity:1,transform:'scale(1)',offset:1}
  ],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});searchMotion.finished.catch(()=>{});}
  searchInput.focus();
};
window.closeSearch=()=>{
  if(!dialog.open||searchClosing)return;
  const startingClip=getComputedStyle(dialog).clipPath;
  searchMotion?.cancel();searchClosing=true;dialog.style.pointerEvents='none';
  const finish=()=>{const restore=dialog.contains(document.activeElement)||document.activeElement===document.body;dialog.close();searchClosing=false;dialog.style.pointerEvents='';searchAnchor?.setAttribute('aria-expanded','false');if(restore)beforeSearch?.focus();};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  const motion=dialog.animate([{clipPath:startingClip==='none'?'inset(0 0 0 0 round 20px)':startingClip,opacity:1,transform:'scale(1)'},{clipPath:collapsedSearch(),opacity:.12,transform:'scale(.98)'}],{duration:340,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
  searchMotion=motion;motion.finished.then(()=>{if(searchMotion===motion){finish();motion.cancel();searchMotion=null;}}).catch(()=>{});
};
window.addEventListener('resize',()=>{if(dialog.open)positionSearch();});
window.addEventListener('scroll',()=>{if(dialog.open)positionSearch();},{passive:true});
document.addEventListener('pointerdown',e=>{if(dialog.open&&!dialog.contains(e.target)&&!e.target.closest('[data-open-search]'))window.closeSearch();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open){e.preventDefault();window.closeSearch();}});

dialog.querySelector('button').addEventListener('click',window.closeSearch);dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)window.closeSearch();}});
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim();searchResults.hidden=!q;dialog.classList.toggle('has-query',!!q);if(!q){searchResults.innerHTML='';return;}const found=searchItems.filter(x=>matches(x,q)).slice(0,12);searchResults.innerHTML=found.length?found.map(x=>`<a class="search-result" href="${esc(x.url)}"${external(x.url)}><small>${esc(x.type)}${x.source?' · '+esc(x.source):''}</small><h3>${esc(x.title)}</h3>${x.arabic?`<small lang="ar" dir="rtl">${esc(x.arabic)}</small>`:''}</a>`).join(''):'<p class="rn-empty">No matches. Try another title or keyword.</p>';});searchInput.dispatchEvent(new Event('input'));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();window.openSearch();}});
document.querySelectorAll('[data-open-search]').forEach(b=>{b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','notebook-search');b.setAttribute('aria-haspopup','dialog');b.addEventListener('click',window.openSearch);});dialog.id='notebook-search';
const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.rn-nav-links a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page');});
// Reveal navigation when scrolling upward; keep it present during interaction.
const scrollNav=document.querySelector('#mainNav');
if(scrollNav){
  let lastScroll=Math.max(0,scrollY),scrollTravel=0,scrollDirection=0,scrollQueued=false;
  const updateNav=()=>{
    scrollQueued=false;
    const current=Math.max(0,scrollY),delta=current-lastScroll;
    lastScroll=current;
    const active=dialog.open||document.querySelector('#drawer')?.classList.contains('open')||(scrollNav.contains(document.activeElement)&&document.activeElement.matches(':focus-visible'));
    if(current<60||active){scrollNav.classList.remove('rn-nav-hidden');scrollTravel=0;return;}
    if(Math.abs(delta)<1)return;
    const direction=delta>0?1:-1;
    if(direction!==scrollDirection){scrollDirection=direction;scrollTravel=0;}
    scrollTravel+=Math.abs(delta);
    if(scrollTravel>=10){scrollNav.classList.toggle('rn-nav-hidden',direction>0);scrollTravel=0;}
  };
  addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateNav);}},{passive:true});
  scrollNav.addEventListener('focusin',()=>scrollNav.classList.remove('rn-nav-hidden'));
}
// Drawer keyboard support supplements the retained editing engine.
const menu=document.querySelector('.nav-menu-btn'),drawer=document.querySelector('#drawer');
if(menu&&drawer){
  const overlay=document.querySelector('#drawerOverlay');
  const menuBubble=document.querySelector('.rn-brand-bubble');
  menuBubble.append(drawer);
  let menuMotion,menuClosing=false;
  const menuClip=()=>getComputedStyle(menuBubble).clipPath;
  const compactHeight=()=>{const style=getComputedStyle(menuBubble);return Math.max(menu.getBoundingClientRect().height,menuBubble.querySelector('.rn-brand').getBoundingClientRect().height)+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);};
  const animateBubble=(from,to,duration)=>{
    menuMotion?.cancel();
    const motion=menuBubble.animate([{clipPath:from},{clipPath:to}],{duration,easing:'cubic-bezier(.18,.88,.28,1)',fill:'both'});
    menuMotion=motion;return motion;
  };
  window.openDrawer=()=>{
    if(drawer.classList.contains('open')&&!menuClosing){window.closeDrawer();return;}
    const current=menuClosing?menuClip():null;
    const from=menuBubble.getBoundingClientRect();menuMotion?.cancel();menuClosing=false;menuBubble.style.width=`${from.width}px`;
    window.closeSearch();drawer.inert=false;drawer.style.pointerEvents='';drawer.classList.add('open');menuBubble.classList.add('is-menu-open');overlay.classList.add('open');menu.setAttribute('aria-expanded','true');drawer.setAttribute('aria-hidden','false');
    const height=menuBubble.getBoundingClientRect().height,radius=getComputedStyle(menuBubble).borderTopLeftRadius;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const motion=animateBubble(current||`inset(0 0 ${Math.max(0,height-compactHeight())}px 0 round ${radius})`,`inset(0 0 0 0 round ${radius})`,340);motion.finished.then(()=>{if(menuMotion===motion){motion.cancel();menuMotion=null;}}).catch(()=>{});}
    drawer.querySelector('a')?.focus({preventScroll:true});
  };
  window.closeDrawer=()=>{
    if(!drawer.classList.contains('open')||menuClosing)return;
    const current=menuClip(),height=menuBubble.getBoundingClientRect().height,radius=getComputedStyle(menuBubble).borderTopLeftRadius;
    menuMotion?.cancel();menuClosing=true;drawer.inert=true;drawer.style.pointerEvents='none';menu.setAttribute('aria-expanded','false');drawer.setAttribute('aria-hidden','true');
    if(drawer.contains(document.activeElement))menu.focus({preventScroll:true});
    const finish=()=>{menuBubble.classList.remove('is-menu-open');drawer.classList.remove('open');overlay.classList.remove('open');menuClosing=false;drawer.style.pointerEvents='';menuBubble.style.width='';};
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
    const motion=animateBubble(current==='none'?`inset(0 0 0 0 round ${radius})`:current,`inset(0 0 ${Math.max(0,height-compactHeight())}px 0 round ${radius})`,260);motion.finished.then(()=>{if(menuMotion===motion){finish();motion.cancel();menuMotion=null;}}).catch(()=>{});
  };
  drawer.inert=true;drawer.setAttribute('aria-hidden','true');drawer.setAttribute('aria-label','Site menu');
  addEventListener('resize',()=>{if(drawer.classList.contains('open'))window.closeDrawer();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open'))window.closeDrawer();});
  drawer.addEventListener('keydown',e=>{if(e.key==='Tab'){const els=[...drawer.querySelectorAll('a,button')].filter(el=>el.getClientRects().length);if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}}});
  document.querySelector('[data-open-search]')?.addEventListener('click',()=>{if(drawer.classList.contains('open')){window.closeDrawer();searchInput.focus();}});
}
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
    const civilDate=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'long',day:'numeric'}).format(now);
    const copticParts=new Intl.DateTimeFormat('en-US-u-ca-coptic',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now);
    const copticPart=type=>Number(copticParts.find(p=>p.type===type).value);
    const copticMonths=['Thout','Paopi','Hathor','Koiak','Tobi','Meshir','Paremhat','Parmouti','Pashons','Paoni','Epip','Mesori','Pi Kogi Enavot'];
    date.textContent=`${civilDate} · ${copticPart('day')} ${copticMonths[copticPart('month')-1]} ${copticPart('year')} AM`;
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
library.innerHTML=filtered.length?filtered.slice(0,limit).map(x=>`<article class="rn-resource" data-rn-resource="${esc(x.id)}"><div class="resource-top"><span class="resource-symbol" aria-hidden="true">${kind==='hymns'?'♪':kind==='books'?'☷':'¶'}</span>${saveMarkup(x)}</div><h3><a href="${esc(x.url)}"${external(x.url)}>${esc(x.title)}</a></h3>${x.arabic?`<p class="resource-arabic" lang="ar" dir="rtl">${esc(x.arabic)}</p>`:''}${x.coptic?`<p class="resource-coptic" lang="cop">${esc(x.coptic)}</p>`:''}<p class="resource-details" dir="auto">${esc(x.author||x.tags.join(' · '))}</p>${x.updated?`<p class="resource-details">Updated ${esc(new Date(x.updated.replace(' UTC','Z').replace(' ','T')).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}))}</p>`:''}<div class="resource-actions"><a href="${esc(x.url)}"${external(x.url)}>${external(x.url)?'Read at source ↗':x.type==='books'?'Read book →':'Read hymn →'}</a><span>${(x.files||[]).map(f=>`<a href="${esc(f.url)}"${external(f.url)}${external(f.url)?'':' download'}>${esc(f.format)} ↓</a>`).join(' · ')}</span></div><div class="resource-source">${esc(x.source)}</div></article>`).join(''):'<p class="rn-empty">No resources match these filters. Try another search or choose All topics.</p>';more.hidden=limit>=filtered.length;};
[input,category,format].filter(Boolean).forEach(el=>el.addEventListener('input',()=>{limit=24;renderLibrary();}));savedOnly.addEventListener('click',()=>{onlySaved=!onlySaved;savedOnly.setAttribute('aria-pressed',onlySaved);limit=24;renderLibrary();});more.addEventListener('click',()=>{limit+=24;renderLibrary();});document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{library.classList.toggle('list-view',btn.dataset.view==='list');document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b===btn));}));renderLibrary();}
document.querySelectorAll("[data-save]").forEach(btn=>{btn.setAttribute("aria-pressed",saved.has(btn.dataset.save));btn.textContent=saved.has(btn.dataset.save)?"★":"☆";});
document.addEventListener('keydown',e=>{if(e.key==="Escape")window.closeDrawer?.();});
document.addEventListener('click',e=>{const btn=e.target.closest('[data-save]');if(!btn)return;const id=btn.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);try{localStorage.setItem('rn_saved_resources',JSON.stringify([...saved]));}catch{}btn.setAttribute('aria-pressed',saved.has(id));btn.textContent=saved.has(id)?'★':'☆';renderLibrary?.();});
// Keep the existing lesson content, adding precise filtering and expandable ARIA state.
const noteSearch=document.querySelector('#notes-search'),noteCategory=document.querySelector('#notes-category');if(noteSearch){const notes=[...document.querySelectorAll('.note-item')];const filter=()=>{notes.forEach(el=>el.hidden=!norm(el.textContent).includes(norm(noteSearch.value))||!!(noteCategory.value&&!el.querySelector('.note-cat').textContent.includes(noteCategory.value)));document.querySelector('#notes-count').textContent=notes.filter(el=>!el.hidden).length+' notes';};noteSearch.addEventListener('input',filter);noteCategory.addEventListener('change',filter);filter();notes.forEach(el=>{const btn=el.querySelector('.note-trigger'),body=el.querySelector('.note-body');body.id=el.id+'-body';btn.setAttribute('aria-controls',body.id);btn.setAttribute('aria-expanded','false');body.setAttribute('aria-hidden','true');btn.addEventListener('click',()=>notes.forEach(n=>{const open=n.classList.contains('open');n.querySelector('.note-trigger').setAttribute('aria-expanded',open);n.querySelector('.note-body').setAttribute('aria-hidden',!open);}));});if(location.hash){const el=document.getElementById(location.hash.slice(1));el?.querySelector('.note-trigger')?.click();}}

})();
