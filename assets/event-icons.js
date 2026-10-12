/* Existing painted Coptic iconography; source records: artwork/events/CREDITS.json. */
(()=>{
'use strict';
const icons={
  "annual": "assets/artwork/events/christ.jpg",
  "nairouz": "assets/artwork/events/nairouz-feast.jpg",
  "feast-of-the-cross": "assets/artwork/events/cross-feast-occ.jpg",
  "kiahk": "assets/artwork/events/kiahk-month.jpg",
  "paramoune-of-nativity": "assets/artwork/events/nativity-and-paramone.jpg",
  "nativity": "assets/artwork/events/nativity-and-paramone.jpg",
  "feast-of-circumcision": "assets/artwork/events/circumcision-s.jpg",
  "paramoune-of-epiphany": "assets/artwork/events/epiphany-s.png",
  "epiphany": "assets/artwork/events/epiphany-s.png",
  "the-wedding-at-cana-of-galilee": "assets/artwork/events/cana.jpg",
  "the-lords-entry-into-the-temple": "assets/artwork/events/presentation.png",
  "ninevehs-fast": "assets/artwork/events/nineveh-fast-s.jpg",
  "ninevehs-feast": "assets/artwork/events/nineveh-fast-s.jpg",
  "great-lent-saturdays-sundays": "assets/artwork/events/great-lent-occasion.jpg",
  "great-lent-weekdays": "assets/artwork/events/great-lent-occasion.jpg",
  "annunciation": "assets/artwork/events/annunciation.jpg",
  "lazarus-saturday": "assets/artwork/events/lazarus.jpg",
  "the-lords-entry-into-jerusalem-palm-sunday": "assets/artwork/events/palm-sunday.jpg",
  "passion-week-general-hours": "assets/artwork/events/holy-week.jpg",
  "passion-pascha-week-covenant-thursday": "assets/artwork/events/covenant-thursday.jpg",
  "passion-pascha-week-good-friday": "assets/artwork/events/good-friday.jpg",
  "bright-saturday": "assets/artwork/events/bright-saturday.jpg",
  "resurrection": "assets/artwork/events/resurrection.jpg",
  "ascension": "assets/artwork/events/ascension.jpg",
  "pentecost": "assets/artwork/events/pentecost.jpg",
  "apostles-fast": "assets/artwork/events/apostles-fast-feast.jpg",
  "apostles-feast": "assets/artwork/events/apostles-fast-feast.jpg",
  "saint-marys-fastfeast": "assets/artwork/events/mary.jpg",
  "transfiguration": "assets/artwork/events/transfiguration.jpg",
  "glorifications": "assets/artwork/events/nairouz-feast.jpg",
  "coptic-weddings": "assets/artwork/events/cana.jpg",
  "funeral": "assets/artwork/events/resurrection.jpg",
  "papal": "assets/artwork/events/cyril.jpg",
  "reception-of-new-priest": "assets/artwork/events/mark.jpg",
  "saints-angels": "assets/artwork/events/nairouz-feast.jpg",
  "agpeya": "assets/artwork/events/christ.jpg",
  "other-hymns": "assets/artwork/events/christ.jpg"
};
window.RN_EVENT_ICONS={ids:Object.keys(icons),render(id){return `<img src="${icons[id]||icons['other-hymns']}" alt="" width="160" height="220" loading="lazy" decoding="async">`;}};
})();
