/* Shared published design and content; drafts are opt-in, never visitor defaults. */
(()=>{
'use strict';
const key='rn_studio_draft',page=location.pathname.split('/').pop()||'index.html';
const resource=new URLSearchParams(location.search).get('id')||document.body?.dataset.resourceId;
const pageKey=page+(resource?'?id='+resource:'');
const empty=()=>({version:1,theme:{},fonts:[],pages:{},resources:{}});
const clone=v=>JSON.parse(JSON.stringify(v));
let config=empty(),observer,timer;
const safeURL=(v)=>{try{const u=new URL(v,location.href);return ['http:','https:'].includes(u.protocol)||/^data:(image\/(png|jpeg|webp|gif|svg\+xml)|application\/pdf|audio\/[\w+-]+|video\/[\w+-]+);base64,/.test(v);}catch{return false;}};
const eligible=el=>el instanceof Element&&!el.closest('#mainNav,#drawer,#drawerOverlay,.am-overlay,#adminBar,#am-inline-editor,.rn-search-dialog,script,style,.skip-link,[data-rn-studio-ignore]')&&!['SCRIPT','STYLE','LINK','META','DIALOG'].includes(el.tagName)&&el!==document.body&&el!==document.documentElement;
const selector=el=>{if(el.hasAttribute('data-rn-node'))return '[data-rn-node="'+el.getAttribute('data-rn-node')+'"]';const parts=[];while(el&&el!==document.body){if(el.hasAttribute('data-rn-node')){parts.unshift('[data-rn-node="'+el.getAttribute('data-rn-node')+'"]');break;}if(el.id){parts.unshift('#'+CSS.escape(el.id));break;}let n=1,s=el;while((s=s.previousElementSibling))if(s.tagName===el.tagName)n++;parts.unshift(el.tagName.toLowerCase()+':nth-of-type('+n+')');el=el.parentElement;}return parts.join(' > ');};
function apply(){
 if(page==='admin.html')return;
 observer?.disconnect();
 const t=config.theme||{},p=config.pages?.[pageKey]||{},scope='[data-rn-canvas]';
 const metadata=config.resources?.[resource]?.metadata;if(metadata){for(const [id,value] of [['resource-title',metadata.title],['resource-subtitle',metadata.arabic],['resource-topics',(metadata.tags||[]).join(' / ')]]){const el=document.getElementById(id);if(el&&value!=null&&el.textContent!==value)el.textContent=value;}if(metadata.title)document.title=metadata.title+' — Ravi’s Notebook';}
 [...document.body.children].filter(eligible).forEach(el=>el.setAttribute('data-rn-canvas',''));
 let css='';
 for(const font of config.fonts||[])if(/^data:(font\/[\w+-]+|application\/[\w+-]+);base64,/.test(font.url))css+=`@font-face{font-family:"${font.id}";src:url("${font.url}");font-display:swap;}`;
 const family=role=>{const f=t[role+'Font'];return f&&/^[\w -]+$/.test(f)?'"'+f+'",Georgia,serif':null;};
 const styles=(s,obj)=>{css+=':root:not(#rn-specificity-a):not(#rn-specificity-b):not(#rn-specificity-c) '+':is('+s+'){'+Object.entries(obj).filter(([,v])=>v!==''&&v!=null).map(([k,v])=>k+':'+String(v).replace(/[{};<>]/g,'')+'!important').join(';')+'}';};
 styles('body',{'background-color':t.background,color:t.text});
 styles(scope,{'color':t.text});
 if(page==='qa.html'&&Array.isArray(config.qa)){const root=document.getElementById('qa-answers-list'),empty=document.getElementById('qa-answers-empty');if(root){const signature=JSON.stringify(config.qa);if(root.dataset.studioAnswers!==signature){root.replaceChildren();for(const q of config.qa.filter(q=>q.answer)){const box=document.createElement('div');box.className='qa-answer-item';for(const [className,text] of [['qa-answer-meta',q.topic||'General'],['qa-answer-q',q.question],['qa-answer-a',q.answer]]){const el=document.createElement('div');el.className=className;el.textContent=text;box.append(el);}root.append(box);}root.dataset.studioAnswers=signature;}if(empty)empty.hidden=config.qa.some(q=>q.answer);}}
 styles(`${scope} :is(h1,h2,h3,h4,h5,h6),${scope}:is(h1,h2,h3,h4,h5,h6)`,{'font-family':family('heading'),'font-size':t.headingSize&&t.headingSize+'px','font-weight':t.headingWeight,'letter-spacing':t.headingTracking&&t.headingTracking+'em','line-height':t.headingLineHeight,color:t.headingColor});
 styles(`${scope} :is(p,.verse-copy,.page-desc,.page-subtitle),${scope}:is(p)`,{'font-family':family('body'),'font-size':t.bodySize&&t.bodySize+'px','line-height':t.bodyLineHeight,'letter-spacing':t.bodyTracking&&t.bodyTracking+'em'});
 styles(`${scope} :is(button,.rn-button,input,select,textarea)`,{'font-family':family('interface'),'border-radius':t.radius&&t.radius+'px'});
 styles(`${scope} :is(.rn-button,button[aria-pressed=true])`,{'background-color':t.accent,'color':t.buttonText});
 styles(`${scope} :is(.rn-feature,.rn-resource,.rn-library-banner,.season-card)`,{'background-color':t.surface,'border-radius':t.radius&&t.radius+'px'});
 if(t.contentWidth)styles(':is(.rn-shell,.section,.page-hero,.season-content,.qa-layout)',{'max-width':t.contentWidth+'px'});
 if(t.sectionSpacing)styles(`${scope} section`,{'padding-top':t.sectionSpacing+'px','padding-bottom':t.sectionSpacing+'px'});
 document.querySelectorAll('section,article').forEach(el=>{if(eligible(el)&&!el.hasAttribute('data-rn-node')&&!el.closest('[data-library],#resource-content')){const path=selector(el);let hash=2166136261;for(const c of path)hash=Math.imul(hash^c.charCodeAt(0),16777619);el.setAttribute('data-rn-node','section-'+(hash>>>0).toString(16));}});
 for(const [parentSelector,sequence] of Object.entries(p.order||{})){let root;try{root=document.querySelector(parentSelector);}catch{continue;}if(!eligible(root))continue;const children=sequence.map(sel=>document.querySelector(sel));for(const child of children)if(eligible(child)&&child.parentElement===root)root.append(child);}
 for(const [sel,e] of Object.entries(p.elements||{})){
  let el;try{el=document.querySelector(sel);}catch{continue;}if(!eligible(el))continue;
  if(e.text){const nodes=[...el.childNodes].filter(n=>n.nodeType===3);e.text.forEach((v,i)=>{if(nodes[i]&&nodes[i].textContent!==v)nodes[i].textContent=v;});}
  for(const [attr,val] of Object.entries(e.attrs||{})){if(!['href','src','alt','title','placeholder','aria-label','poster'].includes(attr))continue;if(['href','src','poster'].includes(attr)&&!safeURL(val))continue;if(el.getAttribute(attr)!==val)el.setAttribute(attr,val);}
  if(e.style)styles(sel,e.style);
  if(e.hidden)styles(sel,{display:'none'});
  if(e.mobile)css+='@media(max-width:650px){:root:not(#rn-specificity-a):not(#rn-specificity-b):not(#rn-specificity-c) '+sel+'{'+Object.entries(e.mobile).map(([k,v])=>k+':'+String(v).replace(/[{};<>]/g,'')+'!important').join(';')+'}}';
 }
 let sheet=document.getElementById('rn-design-overrides');if(!sheet){sheet=document.createElement('style');sheet.id='rn-design-overrides';document.head.append(sheet);}if(sheet.textContent!==css)sheet.textContent=css;
 let additions=document.getElementById('rn-studio-sections');if(!additions){additions=document.createElement('div');additions.id='rn-studio-sections';document.querySelector('footer')?.before(additions);if(!additions.isConnected)document.body.append(additions);additions.setAttribute('data-rn-canvas','');}
 const signature=JSON.stringify(p.sections||[]);if(additions.dataset.signature!==signature){additions.replaceChildren();for(const b of p.sections||[]){const section=document.createElement('section');section.className='rn-section';section.style.cssText='max-width:1196px;margin:auto;padding:32px 24px';const h=document.createElement('h2');h.textContent=b.title||'';section.append(h);if(b.image&&safeURL(b.image)){const img=document.createElement('img');img.src=b.image;img.alt=b.alt||'';img.style.cssText='max-width:100%;border-radius:16px';section.append(img);}const paragraph=document.createElement('p');paragraph.textContent=b.text||'';paragraph.style.whiteSpace='pre-line';section.append(paragraph);if(b.url&&safeURL(b.url)){const a=document.createElement('a');a.className='rn-button';a.href=b.url;a.textContent=b.label||'Read more';section.append(a);}additions.append(section);}additions.dataset.signature=signature;}
 observer?.observe(document.body,{childList:true,subtree:true,characterData:true});
}
const api=window.RN_CMS={key,pageKey,empty,clone,eligible,selector,safeURL,get config(){return config;},setConfig(c){config=clone(c);api.applyCatalogue();apply();},apply,
 async resource(id,content){return clone(config.resources?.[id]?.content||content);},
 applyCatalogue(){for(const type of ['hymns','books','notes']){const list=window.RN_DATA?.[type];if(!list)continue;for(const item of list){const edits=config.resources?.[item.id]?.metadata;if(edits)Object.assign(item,edits);}list.push(...Object.entries(config.resources||{}).filter(([,v])=>v.new&&v.metadata.type===type&&!list.some(x=>x.id===v.metadata.id)).map(([,v])=>clone(v.metadata)));}},
 select(el){if(!eligible(el))return;document.querySelector('[data-rn-selected]')?.removeAttribute('data-rn-selected');el.setAttribute('data-rn-selected','');parent.RN_STUDIO?.select(selector(el));}};
api.ready=(async()=>{try{const response=await fetch('site-settings.json',{cache:'no-cache'});if(response.ok)config=Object.assign(empty(),await response.json());}catch{}
 if(new URLSearchParams(location.search).get('rn-preview')==='1'){try{config=await window.RN_DRAFT.load()||config;}catch{}}
 if(document.readyState==='loading')await new Promise(r=>document.addEventListener('DOMContentLoaded',r,{once:true}));
 apply();observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,50);});observer.observe(document.body,{childList:true,subtree:true,characterData:true});
 if(parent!==window&&new URLSearchParams(location.search).get('rn-editor')==='1'&&parent.location.origin===location.origin){document.body.classList.add('rn-studio-preview');const sheet=document.createElement('style');sheet.textContent='[data-rn-selected]{outline:2px solid #8B5E3C!important;outline-offset:5px}body.rn-studio-preview #adminBar{display:none!important}';document.head.append(sheet);document.addEventListener('click',e=>{if(parent.RN_STUDIO?.browsing)return;if(eligible(e.target)){e.preventDefault();e.stopImmediatePropagation();api.select(e.target);}},true);parent.RN_STUDIO?.loaded();}
 api.applyCatalogue();return config;
})();
})();
