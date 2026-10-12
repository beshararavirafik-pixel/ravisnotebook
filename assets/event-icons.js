/* Original line illustrations for Ravi's Notebook's liturgical event folders. */
(()=>{
'use strict';
const p=d=>`<path d="${d}"/>`,c=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
const gold=d=>`<g stroke="#A67A35">${p(d)}</g>`;
const cross=p('M21 9h6v10h10v6H27v16h-6V25H11v-6h10Z');
const flame=p('M24 5c1 9 10 13 10 22a10 10 0 0 1-20 0c0-5 3-10 6-13 0 6 1 8 4 9 3-6 1-12 0-18Z');
const fish=p('M10 25c8-11 17-11 25 0-8 11-17 11-25 0Zm0 0-6-7v14Zm25 0 8-7v14Z')+c(30,23,1);
const book=p('M24 13c-5-5-12-5-19-3v29c7-2 14-2 19 3 5-5 12-5 19-3V10c-7-2-14-2-19 3Zm0 0v29')+gold('M10 17h8m-8 6h8m12-6h8m-8 6h8');
const wheat=p('M24 42V11m0 14c-8 0-11-6-11-11 7 0 11 5 11 11Zm0 9c-8 0-11-6-11-11 7 0 11 5 11 11Zm0-13c8 0 11-6 11-11-7 0-11 5-11 11Zm0 9c8 0 11-6 11-11-7 0-11 5-11 11Z');
const dove=p('M7 30c6-1 10-4 13-10-1-4-4-8-8-11 8 0 13 4 16 10 4-6 8-9 13-9-1 7-4 11-10 15l10 1-7 5c-3 7-9 10-16 8l-8 4 2-7Z')+c(31,25,1);
const tomb=p('M5 40V24a17 17 0 0 1 34 0v16M16 40V25a6 6 0 0 1 12 0v15M3 40h42')+c(37,34,7);
const icons={
 annual:p('M8 42V21l16-12 16 12v21ZM4 22 24 6l20 16M18 42V30a6 6 0 0 1 12 0v12')+gold('M24 1v10m-4-6h8'),
 nairouz:p('m7 19 5 18h24l5-18-10 7-7-12-7 12Zm5 18v5h24v-5')+gold('m24 3 1.5 4.5L30 9l-4.5 1.5L24 15l-1.5-4.5L18 9l4.5-1.5Z'),
 'feast-of-the-cross':cross+gold('M6 9 10 13m32-4-4 4M24 2v3M3 26h4m34 0h4'),
 kiahk:p('M12 39c10-5 17-17 18-30h6c0 22-5 33-24 33ZM16 36V26m6 6V19m6 6V12')+gold('m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z'),
 'paramoune-of-nativity':p('M11 24h26l-4 11H15Zm3 11-5 8m25-8 5 8M12 24l-4-7m28 7 4-7')+gold('M24 4v12m-6-6h12'),
 nativity:p('m6 27 7 10h22l7-10ZM13 37l-4 7m26-7 4 7M15 26c4-8 14-8 18 0')+c(24,24,3)+gold('m24 2 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z'),
 'feast-of-circumcision':p('M12 8h24v29H17c-8 0-8-9 0-9h19M12 8v25m24-25c7 0 7 8 0 8')+gold('M23 13v11m-5-6h10'),
 'paramoune-of-epiphany':p('M24 5c0 0-13 16-13 24a13 13 0 0 0 26 0C37 21 24 5 24 5Z')+gold('M24 19v14m-5-8h10'),
 epiphany:dove+gold('M5 44c4-3 8 3 12 0s8 3 12 0 8 3 14 0'),
 'the-wedding-at-cana-of-galilee':p('M15 8h18m-16 0v7c-1 4-7 8-7 16 0 8 5 11 14 11s14-3 14-11c0-8-6-12-7-16V8M12 23h24')+gold('M18 30c4-3 8 3 12 0'),
 'the-lords-entry-into-the-temple':p('M7 41h34M10 37V21h28v16M6 21 24 8l18 13M16 25v12m16-12v12M21 41V29h6v12')+gold('M24 2v6m-4-3h8'),
 'ninevehs-fast':fish+gold('M24 5v8m-4-4h8'),
 'ninevehs-feast':fish+gold('M19 8a6 6 0 0 1 12 0M24 1V0m-9 7h-3m24 0h-3'),
 'great-lent-saturdays-sundays':wheat+gold('M7 5v6m-3-3h6M38 35a4 4 0 1 1 0 8 4 4 0 0 1 0-8'),
 'great-lent-weekdays':p('M15 42V23h10v19M12 42h16M20 23v-6M20 5c-7 8-7 11 0 12 7-1 7-4 0-12Z')+gold('M34 13v27m0-13c-6-1-7-5-7-8 6 1 7 5 7 8Zm0 7c6-1 7-5 7-8-6 1-7 5-7 8Z'),
 annunciation:p('M24 43V21m0 12c-8 0-12-4-14-9 8-1 13 3 14 9Zm0-6c8 0 12-4 14-9-8-1-13 3-14 9ZM24 21C12 19 9 12 13 7l8 7 3-11 3 11 8-7c4 5 1 12-11 14Z')+gold('M20 18h8'),
 'lazarus-saturday':p('M7 41V19a17 17 0 0 1 34 0v22M4 41h40')+c(24,17,4)+p('M18 41V27a6 6 0 0 1 12 0v14M18 29l12 5m-12 2 12 5')+gold('M20 13h8'),
 'the-lords-entry-into-jerusalem-palm-sunday':p('M10 44 32 8M20 28C8 25 8 18 8 12c10 2 13 8 12 16Zm5-8C15 16 17 8 19 4c8 4 9 9 6 16Zm-10 17C6 36 3 30 3 24c9 1 13 6 12 13Zm8-13c9 3 16 0 21-6-9-4-16-1-21 6Zm-6 11c10 3 16-1 20-8-9-2-15 2-20 8Z'),
 'passion-week-general-hours':p('M20 7h8v10h9v7h-9v18h-8V24h-9v-7h9Z')+gold('M6 35v7m36-7v7M6 28c-4 4-4 7 0 7s4-3 0-7Zm36 0c-4 4-4 7 0 7s4-3 0-7Z'),
 'passion-pascha-week-covenant-thursday':p('M13 8h22v8a11 11 0 0 1-22 0Zm11 19v13m-8 3h16m-13-3h10M15 14h18')+gold('M24 3v8m-4-4h8'),
 'passion-pascha-week-good-friday':cross+gold('M10 15c-1-8 29-8 28 0s-29 8-28 0Zm3-4-2-4m9 3-1-4m10 4 1-4m6 5 3-4'),
 'bright-saturday':p('M13 20h22l-3 16H16ZM16 36h16m-15 6h14M13 20l-5-6h32l-5 6M24 14V5')+gold('M21 9c-3-5 3-9 3-9s6 4 3 9'),
 resurrection:tomb+gold('M21 3V0m-10 8L7 5m28 3 4-3M19 29l3 3 5-7'),
 ascension:p('M11 39a7 7 0 1 1 2-14 10 10 0 0 1 20 0 7 7 0 1 1 4 14Z')+gold('M24 30V4m-7 7 7-7 7 7'),
 pentecost:flame+gold('M24 27c-5 5-6 9 0 11 6-2 5-6 0-11M6 13v6m-3-3h6m30 0h6m-3-3v6'),
 'apostles-fast':fish+gold('M16 40h16m-12-3v6m8-6v6'),
 'apostles-feast':p('M8 28V12c5-2 10-1 15 2 5-3 10-4 16-2v16M23 14v14')+c(15,33,5)+gold('M19 37l8 8m-5-5 3-3m1 7 3-3M31 29v14m-4-10h8'),
 'saint-marys-fastfeast':p('M8 41c1-17 5-30 16-34 11 4 15 17 16 34ZM16 32c1-9 3-15 8-18 5 3 7 9 8 18M14 41l10-9 10 9')+gold('m24 19 1.5 4.5L30 25l-4.5 1.5L24 31l-1.5-4.5L18 25l4.5-1.5Z'),
 transfiguration:p('M3 41 18 18l7 10 6-8 14 21ZM13 26l5-8 7 10m1-2 5-6 5 8')+gold('M24 2v10m-8-7 3 8m13-8-3 8M8 12l7 5m25-5-7 5'),
 glorifications:p('M24 6 12 29m12-23 12 23M10 29h28l-5 11H15Zm5 11h18M24 6v23')+gold('M19 21c-5-5 4-6 0-11m10 11c-5-5 4-6 0-11'),
 papal:p('M11 42V17a7 7 0 1 1 7-7M10 12h7M29 42V10h6v32M26 42h12')+gold('M32 1v12m-6-6h12'),
 'reception-of-new-priest':p('M14 9 6 17l7 10 4-4v19h14V23l4 4 7-10-8-8M17 9l7 9 7-9m-11 5v28m8-28v28')+gold('M24 1v9m-3-5h6'),
 'coptic-weddings':c(18,28,11)+c(31,28,11)+gold('M24 2v12m-5-7h10'),
 funeral:p('M24 7v33m-9-23h18M7 42h34M8 27v11m32-11v11')+gold('M8 19c-4 4-4 8 0 8s4-4 0-8Zm32 0c-4 4-4 8 0 8s4-4 0-8Z'),
 'saints-angels':c(24,14,7)+p('M12 42V31a12 12 0 0 1 24 0v11M16 26l8 8 8-8')+gold('M12 14a12 12 0 0 1 24 0M7 25l-4 3 4 3m34-6 4 3-4 3'),
 agpeya:book+gold('M24 2v5m-3-2h6M32 30v5l4 2'),
 'other-hymns':book+gold('M26 25v10m0-10 10-2v10')+c(23,36,3)+c(33,34,3),
};
window.RN_EVENT_ICONS={ids:Object.keys(icons),render(id){return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[id]||icons['other-hymns']}</svg>`;}};
})();
