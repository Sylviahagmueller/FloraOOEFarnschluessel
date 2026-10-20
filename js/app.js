const keyId = location.pathname.match(/\/(farne|viola)\/?$/i)?.[1]?.toLowerCase() || 'farne';
const appBase = new URL('./', document.baseURI);
const keyConfig = await fetch(new URL('config/' + keyId + '.json', appBase)).then(r => {
 if (!r.ok) throw new Error('Konfiguration nicht gefunden: ' + keyId);
 return r.json();
});
const dataDir = new URL((keyConfig.data_directory || 'data') + '/', appBase);
const [traits,taxa,metadata,genera]=await Promise.all(['traits.json','taxa.json','metadata.json','genera.json'].map(f => new URL(f, dataDir)).map(x=>fetch(x).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}: ${x}`);return r.json()})));
const generaByName=Object.fromEntries(genera.map(g=>[g.genus_name,g]));
// Versionsinformationen: Programmstand fix, Datenstand aus exportierten Metadaten.
const dataVersionMatch = String(metadata.source_file || '').match(/(?:^|[_-])v(\d+(?:\.\d+)?)(?=[_.-]|$)/i);
const dataVersion = dataVersionMatch ? `V${dataVersionMatch[1]}` : (metadata.source_file || 'unbekannt');
function renderVersionInfo(){
 const english = document.getElementById('language')?.value === 'en';
 document.getElementById('program-version').textContent = `${english ? 'App version' : 'Programmversion'}: V20`;
 document.getElementById('data-version').textContent = `${english ? 'Excel data version' : 'Excel-Datenbasis'}: ${metadata.base_excel_version || dataVersion} · ${metadata.editorial_revision || 'V17'}`;
}
renderVersionInfo();
document.getElementById('language')?.addEventListener('change', renderVersionInfo);

const I18N={
 de:{eyebrow:'FLORAOOE · GEFÄSSSPORENPFLANZEN ÖSTERREICHS',headline:'Farne bestimmen',subtitle:'Merkmale frei kombinieren. Unbekanntes einfach überspringen.',language:'Sprache',reset:'Alles zurücksetzen',notice:'TESTVERSION – Fachlicher Prototyp – botanische Matrix noch nicht abschließend geprüft. Ergebnisse sind Bestimmungshilfen, keine sichere Artbestimmung.',characters:'Merkmale',filterIntro:'Wähle ein Merkmal und einen oder mehrere passende Zustände. Weitere Merkmale kannst du jederzeit hinzufügen.',traitLevel:'Merkmalsumfang',levelSimple:'Einfach',levelExtended:'Erweitert',levelExpert:'Experte',groupStructure:'Grundbauplan und Wuchsform',groupFrond:'Wedel und Fiedern',groupSori:'Sori und Fortpflanzung',groupSurface:'Oberfläche und besondere Merkmale',groupEcology:'Standort',groupSpecial:'Spezialmerkmale',characterPicker:'Merkmalsauswahl',frequent:'Häufig verwendete Merkmale',moreCharacter:'Weiteres Merkmal',add:'Hinzufügen',howFiltering:'Wie wird gefiltert?',filterHelp:'Verschiedene Merkmale werden mit UND kombiniert, mehrere Zustände innerhalb eines Merkmals mit ODER. Unbekannte Taxonwerte bleiben als mögliche Treffer erhalten.',identification:'BESTIMMUNG',possibleTaxa:'mögliche Taxa',searchLabel:'Taxa suchen',searchPlaceholder:'Wissenschaftlicher oder deutscher Name',close:'Schließen',footer:'FloraOOE Farnschlüssel · Daten aus Excel exportiert',projectTitle:'Über das Projekt',projectOrg:'Ein Projekt der Botanischen Arbeitsgemeinschaft Oberösterreich (ARGE Botanik).',projectIdea:'Idee und fachliche Betreuung: Dr. Hans-Peter Reinthaler',projectTech:'Konzeption und technische Umsetzung: Dr. Sylvia Hagmüller',projectWebsite:'ARGE Botanik',imprint:'Impressum der ARGE',privacyDraft:'Datenschutzhinweise (Entwurf)',credits:'Bildnachweise',metadata:'Datensatzinformationen',selectCharacter:'Merkmal auswählen …',active:'aktiv',expand:'Merkmal aufklappen',collapse:'Merkmal zuklappen',suggest:'Nächstes nützliches Merkmal:',chooseAny:'',info:'Erklärung und Zeichnung',exampleDrawing:'Schematische Zeichnung (nicht maßstabsgetreu)',noDrawing:'Für diese Ausprägung ist noch keine Zeichnung vorhanden.',photoExample:'Testfoto',photoOnline:'Lokal gespeicherte, verkleinerte Bildfassung.',photoSource:'Bildquelle und Lizenz',unknown:'unbekannt',unknownSummary:'davon mit unbekannten Werten bei ausgewählten Merkmalen',dataset:'Taxa im Datensatz',none:'Keine passenden Taxa.',notReviewed:'Die Angaben stammen aus einer noch nicht abschließend fachlich geprüften Matrix.',family:'Familie',commonName:'Deutscher Name',unnamed:'Kein deutscher Name hinterlegt',notAvailable:'Keine Angaben verfügbar'},
 en:{eyebrow:'FLORAOOE · VASCULAR SPORE PLANTS OF AUSTRIA',headline:'Identify ferns',subtitle:'Combine characters freely. Simply skip anything you cannot assess.',language:'Language',reset:'Reset all',notice:'TEST VERSION – Scientific prototype – the botanical matrix has not yet been fully reviewed. Results are identification aids, not confirmed identifications.',characters:'Characters',filterIntro:'Choose a character and one or more applicable states. You can add further characters at any time.',traitLevel:'Character detail',levelSimple:'Simple',levelExtended:'Extended',levelExpert:'Expert',groupStructure:'Plant structure and growth',groupFrond:'Fronds and pinnae',groupSori:'Sori and reproduction',groupSurface:'Surface and distinctive characters',groupEcology:'Habitat',groupSpecial:'Specialised characters',characterPicker:'Character selection',frequent:'Frequently used characters',moreCharacter:'Additional character',add:'Add',howFiltering:'How does filtering work?',filterHelp:'Different characters are combined with AND; multiple states of one character are combined with OR. Taxa with unknown values remain possible matches.',identification:'IDENTIFICATION',possibleTaxa:'possible taxa',searchLabel:'Search taxa',searchPlaceholder:'Scientific name or German common name',close:'Close',footer:'FloraOOE fern key · Data exported from Excel',projectTitle:'About the project',projectOrg:'A project of the Botanical Working Group of Upper Austria (ARGE Botanik).',projectIdea:'Concept idea and scientific supervision: Dr. Hans-Peter Reinthaler',projectTech:'Design and technical implementation: Dr. Sylvia Hagmüller',projectWebsite:'ARGE Botanik',imprint:'ARGE imprint (German)',privacyDraft:'Privacy information (draft, German)',credits:'Image credits (German)',metadata:'Dataset information',selectCharacter:'Select a character …',active:'active',expand:'Expand character',collapse:'Collapse character',suggest:'Suggested next character:',chooseAny:'',info:'Explanation and illustration',exampleDrawing:'Schematic drawing (not to scale)',noDrawing:'No drawing is available for this state yet.',photoExample:'Example photograph',photoOnline:'Locally stored, reduced-size image.',photoSource:'Image source and licence',unknown:'unknown',unknownSummary:'with unknown values among selected characters',dataset:'taxa in dataset',none:'No matching taxa.',notReviewed:'Botanical character data have not yet been fully reviewed.',family:'Family',commonName:'German common name',unnamed:'No German common name available',notAvailable:'No information available'}
};
for (const language of ['de','en']) {
 const suffix = '_' + language;
 for (const field of ['headline','subtitle','eyebrow']) {
  const configField = field === 'headline' ? 'title' + suffix : field + suffix;
  if (keyConfig[configField]) I18N[language][field] = keyConfig[configField];
 }
}
document.getElementById('plant-group')?.addEventListener('change', e => { location.href = new URL(e.target.value === 'farne' ? 'farne/' : 'viola/', appBase).href; });
const byCode=Object.fromEntries(traits.map(t=>[t.code,t]));
let savedLang='de';try{savedLang=localStorage.getItem('floraooe-language')||'de'}catch{}
const state={lang:savedLang==='en'?'en':'de',filters:{},collapsed:new Set(),query:'',traitLevel:'simple',catalogOpen:new Set()};
const $=id=>document.getElementById(id),t=k=>I18N[state.lang][k]||k;
const txt=(obj,field)=>obj?.[`${field}_${state.lang}`]||obj?.[`${field}_de`]||'';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const selected=()=>Object.entries(state.filters).filter(([,v])=>v.size);
// V18 semantics: not_applicable is an explicit contradiction, while missing/unknown data remain possible.
const NON_SELECTABLE_STATES=new Set(['not_applicable','unknown']);
const selectableStates=trait=>trait.states.filter(s=>!NON_SELECTABLE_STATES.has(s.code));
function classification(taxon){
 let unknown=0;
 for(const [code,choices] of selected()){
  const actual=taxon.values[code];
  if(!actual?.length || actual.includes('unknown')){unknown++;continue;}
  if(actual.includes('not_applicable'))return null;
  if(!actual.some(v=>choices.has(v)))return null;
 }
 return {unknown,matched:selected().length-unknown};
}
function hasApplicableTaxa(trait,items){
 return items.some(({taxon})=>{
  const values=taxon.values[trait.code];
  return !values?.includes('not_applicable') && (!values?.length || values.some(v=>!NON_SELECTABLE_STATES.has(v)));
 });
}

function candidates(){return taxa.map(taxon=>({taxon,match:classification(taxon)})).filter(x=>x.match!==null).sort((a,b)=>a.match.unknown-b.match.unknown||a.taxon.name.localeCompare(b.taxon.name));}
function recommendation(items){
 const used=new Set(Object.keys(state.filters));let best=null;
 for(const trait of traits){
  if(used.has(trait.code)||selectableStates(trait).length<2||!inLevel(trait)||!hasApplicableTaxa(trait,items))continue;
  const counts=new Map();let n=0;
  for(const {taxon} of items){
   const values=taxon.values[trait.code]?.filter(v=>!NON_SELECTABLE_STATES.has(v));
   if(!values?.length)continue;
   n++;
   for(const v of values)counts.set(v,(counts.get(v)||0)+1/values.length);
  }
  if(n<Math.max(3,items.length*.35)||counts.size<2)continue;
  let entropy=0;for(const count of counts.values()){const p=count/n;entropy-=p*Math.log2(p);}
  let score=entropy*(n/items.length)*(trait.role==='primary'?1.12:1);
  if(!best||score>best.score)best={trait,score};
 }
 return best?.trait;
}
function localizeStatic(){document.documentElement.lang=state.lang;document.title=keyConfig['page_title_'+state.lang] || keyConfig['title_'+state.lang] || 'FloraOOE';$('language').value=state.lang;for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=t(el.dataset.i18n);const search=$('search');if(search)search.placeholder='';}
// UI-only classification: neither the source matrix nor candidate filtering is modified.
const SIMPLE_CODES=new Set(keyConfig.simple_traits||[]);
const EXTENDED_CODES=new Set(keyConfig.extended_traits||keyConfig.simple_traits||[]);
const GROUP_CODES=Object.fromEntries(Object.entries(keyConfig.group_codes||{}).map(([k,codes])=>[k,new Set(codes)]));
const GROUP_KEYS=['groupStructure','groupFrond','groupSori','groupSurface','groupEcology','groupSpecial'];
function groupOf(tr){const c=tr.code;if(tr.role==='ecology')return 'groupEcology';if(GROUP_CODES.special?.has(c))return 'groupSpecial';if(GROUP_CODES.sori?.has(c))return 'groupSori';if(GROUP_CODES.surface?.has(c))return 'groupSurface';if(GROUP_CODES.structure?.has(c))return 'groupStructure';return 'groupFrond';}
function inLevel(tr){return state.traitLevel==='expert'||(state.traitLevel==='extended'?EXTENDED_CODES:SIMPLE_CODES).has(tr.code);}
// V14: all choices live inside the catalogue; the scientific data and matching are unchanged.
function add(code){if(!code||!byCode[code])return;if(!(code in state.filters))state.filters[code]=new Set();state.catalogOpen.add(code);render();}
function makeCatalogTrait(tr){
 const code=tr.code, set=state.filters[code] || new Set();
 const el=document.createElement('details');el.className='catalog-trait';el.open=state.catalogOpen.has(code);
 const heading=document.createElement('summary');heading.className='catalog-trait-heading';
 const label=document.createElement('span');label.className='catalog-trait-name';label.textContent=txt(tr,'label');
 const count=document.createElement('span');count.className='filter-selected';count.textContent=set.size?String(set.size):'';
 heading.append(label,count);el.append(heading);
 const body=document.createElement('div');body.className='catalog-trait-body';
 if(txt(tr,'description')){const description=document.createElement('p');description.className='desc';description.textContent=txt(tr,'description');body.append(description);}
 const choices=document.createElement('div');choices.className='choices';
 for(const option of selectableStates(tr)){
  const line=document.createElement('div');line.className='state-line';
  const selectable=document.createElement('label'),chk=document.createElement('input');chk.type='checkbox';chk.checked=set.has(option.code);
  chk.onchange=()=>{if(!(code in state.filters))state.filters[code]=new Set();if(chk.checked)state.filters[code].add(option.code);else state.filters[code].delete(option.code);state.catalogOpen.add(code);render();};
  const caption=document.createElement('span');caption.textContent=txt(option,'label');selectable.append(chk,caption);
  const help=document.createElement('button');help.type='button';help.className='state-info';help.textContent='ⓘ';help.title=t('info');help.setAttribute('aria-label',`${t('info')}: ${txt(option,'label')}`);help.onclick=()=>showStateInfo(tr,option);
  line.append(selectable,help);choices.append(line);
 }
 body.append(choices);el.append(body);
 el.addEventListener('toggle',()=>{if(el.open)state.catalogOpen.add(code);else state.catalogOpen.delete(code);});
 return el;
}
function renderCatalog(){
 const items=candidates();
 const panel=$('character-catalog');panel.replaceChildren();
 for(const btn of document.querySelectorAll('#trait-level button')){
  const selected=btn.dataset.level===state.traitLevel;btn.classList.toggle('is-active',selected);btn.setAttribute('aria-pressed',String(selected));
 }
 // The original nine primary characters remain the first group.
 const frequent=traits.filter(tr=>DEFAULT_TRAIT_CODES.includes(tr.code)&&hasApplicableTaxa(tr,items));
 const groups=[['frequent',frequent]];
 for(const key of GROUP_KEYS){
  const members=traits.filter(tr=>selectableStates(tr).length&&!DEFAULT_TRAIT_CODES.includes(tr.code)&&groupOf(tr)===key&&(inLevel(tr)||state.filters[tr.code]?.size)&&hasApplicableTaxa(tr,items));
  if(members.length)groups.push([key,members]);
 }
 for(const [key,members] of groups){
  if(!members.length)continue;
  const section=document.createElement('section');section.className='catalog-section';
  const title=document.createElement('h3');title.textContent=t(key);section.append(title);
  for(const tr of members)section.append(makeCatalogTrait(tr));
  panel.append(section);
 }
 const active=Object.values(state.filters).filter(set=>set.size).length;
 $('filter-count').textContent=`${active} ${t('active')}`;
}
const DRAWINGS=Object.fromEntries(Object.entries(keyConfig.drawings||{}).map(([key,path])=>[key,new URL(path,appBase).href]));
// Illustrations are deliberately schematic, not original floristic book artwork.
function showStateInfo(tr,option){
 const src=DRAWINGS[`${tr.code}:${option.code}`];
 $('info-title').textContent=txt(option,'label');
 const description=txt(option,'explanation')||txt(tr,'description')||t('notAvailable');
 $('info-description').textContent=description;
 $('info-illustration').replaceChildren();
 if(src){const pic=document.createElement('img');pic.src=src;pic.alt=txt(option,'label');pic.className='trait-drawing';$('info-illustration').append(pic);
  const cap=document.createElement('p');cap.className='muted';cap.textContent=t('exampleDrawing');$('info-illustration').append(cap);
 } else {const empty=document.createElement('p');empty.className='muted';empty.textContent=t('noDrawing');$('info-illustration').append(empty);}
 $('info-dialog').showModal();
}
const PHOTO_TEST={
 'Asplenium trichomanes':{file:'Asplenium_trichomanes_(Aspleniaceae).jpg',credit:'Milimidragan 92',license:'CC BY-SA 4.0'},
 'Matteuccia struthiopteris':{file:'Matteuccia_struthiopteris_1zz.jpg',credit:'David J. Stang',license:'CC BY-SA 4.0'},
 'Equisetum arvense':{file:'Equisetum_arvense_121593985.jpg',credit:'Michel Langeveld',license:'CC BY-SA 4.0'}
};
function photoHtml(name){const p=PHOTO_TEST[name];if(!p)return '';
 const target='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(p.file);
 const src='assets/photos/'+encodeURIComponent(p.file);
 const license='https://creativecommons.org/licenses/by-sa/4.0/';
 const changed=state.lang==='de'?'Verkleinerte Bildfassung; keine sonstige Bearbeitung':'Reduced-size image; no other modifications';
 const original=state.lang==='de'?'Originaldatei':'Original file';
 return `<figure class="photo-example"><img loading="lazy" src="${escape(src)}" alt="${escape(name)}"><figcaption><strong>${escape(t('photoExample'))}</strong> · <i>${escape(name)}</i><br>${escape(p.credit)} · <a href="${escape(target)}" target="_blank" rel="noopener noreferrer">${escape(original)}</a> · <a href="${license}" target="_blank" rel="noopener noreferrer">${escape(p.license)}</a><br><span class="muted">${escape(changed)}</span></figcaption></figure>`;
}
function photoThumbHtml(name){const p=PHOTO_TEST[name];if(!p)return ''; const src='assets/photos/'+encodeURIComponent(p.file); return `<img class="taxon-thumb" loading="lazy" src="${escape(src)}" alt="${escape(name)}">`; }
function detail(taxon){
 $('detail-name').textContent=taxon.name;
 const common=taxon.german_name?`<p>${state.lang==='de'?escape(taxon.german_name):`${escape(t('commonName'))}: ${escape(taxon.german_name)}`}</p>`:'';
 const description=txt(taxon,'description');
 const habitat=txt(taxon,'habitat');
 const genusName=taxon.name.split(' ')[0];
 const genus=generaByName[genusName];
 const genusHtml=genus?`<details class="genus-detail"><summary>${state.lang==='en'?'About the genus':'Über die Gattung'} <i>${escape(genusName)}</i></summary><div><p>${escape(txt(genus,'description'))}</p><p><strong>${state.lang==='en'?'Distinguishing features':'Unterscheidungsmerkmale'}:</strong> ${escape(txt(genus,'diagnostic_notes'))}</p></div></details>`:'';
 const section=(title,body)=>body?`<section class="taxon-detail-section"><h3>${escape(title)}</h3><p>${escape(body)}</p></section>`:'';
 const diagnostic=taxon.diagnostic_values||{};
 const diagnosticItems=Object.entries(diagnostic).flatMap(([code,vals])=>{
  const tr=byCode[code];if(!tr)return [];
  return vals.map(v=>`<li><span>${escape(txt(tr,'label'))}:</span> <strong>${escape(txt(tr.states.find(s=>s.code===v)||{label_de:v,label_en:v},'label'))}</strong></li>`);
 }).join('');
 const diagnosticHtml=diagnosticItems?`<section class="taxon-detail-section taxon-diagnostic"><h3>${state.lang==='en'?'Distinctive characters':'Besonders wichtige Merkmale'}</h3><ul>${diagnosticItems}</ul></section>`:'';
 const detailValues=Object.entries(taxon.values).map(([code,vals])=>{
  // Hide unknown and inapplicable states in details without changing filter data.
  vals=(vals||[]).filter(v=>v!=='unknown'&&v!=='not_applicable');
  if(!vals.length)return '';
  const tr=byCode[code];if(!tr)return '';
  const marked=new Set(diagnostic[code]||[]);
  const valueHtml=vals.map(v=>{
   const label=escape(txt(tr.states.find(s=>s.code===v)||{label_de:v,label_en:v},'label'));
   return marked.has(v)?`<strong class="diagnostic-value">${label}</strong>`:label;
  }).join(' · ');
  return `<div><small>${escape(txt(tr,'label'))}</small>${valueHtml}</div>`;
 }).join('');
 $('detail-body').innerHTML=`${photoHtml(taxon.name)}${common}<p>${escape(t('family'))}: ${escape(taxon.family||'–')}</p>`+
 section(state.lang==='en'?'Description':'Beschreibung',description)+
 section(state.lang==='en'?'Habitat':'Standort',habitat)+
 genusHtml+diagnosticHtml+`<p class="muted">${escape(t('notReviewed'))}</p><div class="detail-grid">${detailValues||escape(t('notAvailable'))}</div>`;
 $('details').showModal();
}
function render(){localizeStatic();renderCatalog();const items=candidates();const filtered=items.filter(x=>(x.taxon.name+' '+(x.taxon.german_name||'')).toLocaleLowerCase().includes(state.query.toLocaleLowerCase()));$('count').textContent=items.length;$('summary').textContent='';const suggestion=recommendation(items);$('suggestion').innerHTML=suggestion?`<div class="suggestion-label">${escape(t('suggest'))}</div><div class="suggestion-main"><strong>${escape(txt(suggestion,'label'))}</strong><button id="suggest-button">${escape(t('add'))}</button></div>`:'';$('suggestion').hidden=!suggestion;if(suggestion)$('suggest-button').onclick=()=>add(suggestion.code);$('list').replaceChildren();for(const x of filtered){const taxon=x.taxon,btn=document.createElement('button');btn.className='taxon'+(selected().length&&x.match.unknown>0?' taxon-uncertain':'');if(selected().length&&x.match.unknown>0)btn.title=state.lang==='de'?'Möglicher Treffer: für einige ausgewählte Merkmale liegen noch keine Angaben vor.':'Possible match: some selected characters have no recorded values.';const sub=state.lang==='de'?(taxon.german_name||taxon.family):(taxon.family||'');btn.innerHTML=`${PHOTO_TEST[taxon.name]?`<div class="taxon-image-wrap">${photoThumbHtml(taxon.name)}</div>`:''}<div class="taxon-heading"><strong>${escape(taxon.name)}</strong>${PHOTO_TEST[taxon.name]?`<span class="photo-hint" title="${escape(t('photoExample'))}" aria-label="${escape(t('photoExample'))}">&#128247;</span>`:''}</div><small>${escape(sub)}</small><div class="tags"><span class="tag">${escape(taxon.family)}</span></div>`;btn.onclick=()=>detail(taxon);$('list').append(btn);}if(!filtered.length)$('list').innerHTML=`<p class="muted">${escape(t('none'))}</p>`;}
$('language').onchange=e=>{state.lang=e.target.value==='en'?'en':'de';try{localStorage.setItem('floraooe-language',state.lang)}catch{}render();};
document.querySelectorAll('#trait-level button').forEach(btn=>btn.onclick=()=>{state.traitLevel=btn.dataset.level;render();});
$('search').oninput=e=>{state.query=e.target.value;render();};
// Initial characters are identical after page load and after Reset.
const DEFAULT_TRAIT_CODES=traits.filter(tr=>tr.role==='primary'&&selectableStates(tr).length).slice(0,keyConfig.default_trait_count||9).map(tr=>tr.code);
function resetIdentification(){
 state.filters=Object.fromEntries(DEFAULT_TRAIT_CODES.map(code=>[code,new Set()]));
 state.collapsed.clear();
 state.catalogOpen.clear();
 state.query='';
 state.traitLevel='simple';
 $('search').value='';
 render();
}
$('reset').onclick=resetIdentification;
$('close').onclick=()=>$('details').close();
$('info-close').onclick=()=>$('info-dialog').close();
resetIdentification();
