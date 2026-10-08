(async()=>{
'use strict';
await window.RN_CMS?.ready;
const data=window.RN_DATA,root=document.querySelector('#resource-content');if(!root)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copticMarkup=value=>String(value??'').split(/([\u2C80-\u2CFF\u03E2-\u03EF][\u2C80-\u2CFF\u03E2-\u03EF\u0300\u0305\uFE26]*)/g).map(part=>/^[\u2C80-\u2CFF\u03E2-\u03EF]/.test(part)?'<span lang="cop">'+esc(part)+'</span>':esc(part)).join('');
const id=document.body.dataset.resourceId||new URLSearchParams(location.search).get('id');
const item=[...data.hymns,...data.books].find(x=>x.id===id);
if(!item){document.querySelector('#resource-title').textContent='Resource not found';root.innerHTML='<p class="rn-empty">Choose a hymn or book from the library.</p>';return;}
document.title=item.title+' — Ravi’s Notebook';document.querySelector('#resource-title').textContent=item.title;
const subtitle=document.querySelector('#resource-subtitle');subtitle.textContent=item.id==='hymns-thok-te-tigom'?'Pascha Doxology':'';subtitle.lang='en';subtitle.hidden=!subtitle.textContent;document.querySelector('#resource-topics').textContent=item.tags.slice(0,3).join(' · ');
const back=document.querySelector('#resource-back');back.href=item.type==='books'?'books.html':'hymnology.html';back.textContent=item.type==='books'?'← Book library':'← Hymn library';
try{
let original=window.RN_CMS.config.resources?.[item.id]?.content;if(!original){const response=await fetch('assets/resources/'+encodeURIComponent(item.id)+'.json?v=english-library-1');if(!response.ok)throw Error('Resource unavailable');original=await response.json();}const content=await window.RN_CMS.resource(item.id,original);
if(item.type==='books'){
 const pdf=content.files.find(f=>f.format.includes('PDF'));
 root.innerHTML=`<div class="rn-library-banner"><div><p>${esc(item.author||'')}</p><p>${esc(item.tags.join(' · '))}</p></div><div class="rn-panel-actions">${content.files.map(f=>`<a class="rn-button outline" href="${esc(f.url)}" download>${esc(f.format)} ↓</a>`).join('')}</div></div>${pdf?`<div class="book-reader" id="book-reader" aria-label="${esc(item.title)} book reader"></div>`:''}<p class="rn-result-info">Book credit: ${esc(item.source)}.</p>`;
 if(pdf){const viewer=await import('./pdf-reader.js');await viewer.mountPdfReader(root.querySelector('#book-reader'),pdf.url,item.title);}
 return;
}
let isSaved=false;try{isSaved=JSON.parse(localStorage.getItem('rn_saved_resources')||'[]').includes(item.id);}catch{}
const labels={english:['English','en','ltr'],coptic:['Coptic','cop','ltr'],arabic:['Arabic','ar','rtl']};
const available=Object.keys(labels).filter(l=>content.units.some(u=>u.verses[l]?.length));let mode='compare',size=20;
root.innerHTML=`<div class="reader-tabs" aria-label="Reading controls"><span class="reader-control-space"></span><button class="rn-chip" data-reader-font="-2" aria-label="Decrease text size">A−</button><button class="rn-chip" data-reader-font="2" aria-label="Increase text size">A+</button><button class="rn-chip" id="resource-print">Print</button><button class="save-button" data-save="${esc(item.id)}" aria-label="Save ${esc(item.title)}" aria-pressed="${isSaved}">${isSaved?'★':'☆'}</button></div>${content.units.length>1?`<label class="unit-jump-label">Jump to section <select class="rn-input" id="unit-jump">${content.units.map((u,i)=>`<option value="unit-${i}">${esc(u.title||'Section '+(i+1))}</option>`).join('')}</select></label>`:''}<div class="reader-text" id="native-hymn-text"></div><div class="recording-placeholder"><span aria-hidden="true">♪</span><div><h3>Recordings</h3><p>Recordings will be added to this library.</p></div></div><p class="rn-result-info">${content.copticSource?`Coptic text: ${esc(content.copticSource.name)}. Translations and analysis: ${esc(item.source)}.`:`Text and analysis credit: ${esc(item.source)}.`}</p>`;
const text=root.querySelector('#native-hymn-text');
const render=()=>{text.innerHTML=content.units.map((unit,n)=>{
 const chosen=mode==='compare'?Object.keys(labels):[mode];
 const count=Math.max(0,...chosen.map(l=>unit.verses[l]?.length||0));
 const copy=(l,i)=>`<p class="verse-copy" data-rn-verse="${n}-${i}-${l}" lang="${labels[l][1]}" dir="${labels[l][2]}">${esc(unit.verses[l]?.[i]||'')}</p>`;
 const note=i=>unit.notes?.[i]?`<p class="rn-result-info verse-note" lang="en">${esc(unit.notes[i])}</p>`:'';
 const heading=content.units.length>1?`<h2 class="rn-heading" lang="en" dir="ltr">${esc(unit.title||'Section '+(n+1))}</h2>`:'';
 const analysis=unit.analysis?.length&&!unit.analysis.some(row=>row.some(c=>/[\u0600-\u06ff]/.test(c.text)))?`<details class="hymn-analysis"><summary>Coptic word study & analysis</summary><div class="analysis-scroll"><table>${unit.analysis.map(row=>`<tr>${row.map(c=>`<td dir="auto" colspan="${c.span}">${copticMarkup(c.text)}</td>`).join('')}</tr>`).join('')}</table></div></details>`:'';
 let verses='<p class="rn-result-info">This section does not have text in the selected language.</p>';
 if(count&&mode==='compare'){
  verses=`<div class="rn-parallel-scroll" role="region" aria-label="${esc(item.title)} parallel language text" tabindex="0"><table class="rn-parallel-text" style="--parallel-count:${chosen.length}"><thead><tr>${chosen.map(l=>`<th scope="col" lang="en" dir="ltr"><p class="rn-parallel-label">${labels[l][0]}</p></th>`).join('')}</tr></thead><tbody>${Array.from({length:count},(_,i)=>`${unit.notes?.[i]?`<tr class="rn-parallel-note"><td colspan="${chosen.length}">${note(i)}</td></tr>`:''}<tr>${chosen.map(l=>`<td><span class="rn-mobile-language" lang="en">${labels[l][0]}</span>${copy(l,i)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 }else if(count){
  verses=Array.from({length:count},(_,i)=>`${note(i)}<div class="verse-row"><span class="verse-number">${String(i+1).padStart(2,'0')}</span><div class="verse-columns">${copy(chosen[0],i)}</div></div>`).join('');
 }
 return `<section class="hymn-unit-section" id="unit-${n}">${heading}${verses}${analysis}</section>`;
}).join('');};
root.querySelectorAll('[data-reader-font]').forEach(b=>b.addEventListener('click',()=>{size=Math.max(16,Math.min(32,size+Number(b.dataset.readerFont)));text.style.setProperty('--reader-size',size+'px');}));
if(content.recordings?.length){const recordings=root.querySelector('.recording-placeholder');recordings.replaceChildren();for(const recording of content.recordings){if(!window.RN_CMS.safeURL(recording.url))continue;const box=document.createElement('div'),label=document.createElement('p'),audio=document.createElement('audio');label.textContent=recording.title||'Recording';audio.controls=true;audio.preload='none';audio.src=recording.url;box.append(label,audio);recordings.append(box);}}
root.querySelector('#resource-print').addEventListener('click',()=>window.print());root.querySelector('#unit-jump')?.addEventListener('change',e=>document.getElementById(e.target.value)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));render();
}catch(e){root.innerHTML='<p class="rn-empty">This resource could not load. Please refresh the page and try again.</p>';console.error('Resource reader:',e);}
})();
