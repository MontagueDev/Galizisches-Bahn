import {
  APP_VERSION, APP_BUILD, STATIONS, RAIL_EDGES, URBAN_NETWORKS,
  SUBSCRIPTIONS, FARES, SERVICE_ALERTS, COPY, getStation, getUrbanNetwork
} from './data.js';
import { createStore } from './store.js';
import { createJourneys, planUrban, addTime } from './routing.js';
import { TEST_CARDS, validatePayment, simulatePayment } from './payment.js';

const store = createStore();
const main = document.getElementById('mainView');
const modalRoot = document.getElementById('modalRoot');
const toastRoot = document.getElementById('toastRoot');
const installButton = document.getElementById('installButton');
const onlineBadge = document.getElementById('onlineBadge');
let installPrompt = null;
let currentJourneys = [];
let selectedJourney = null;
let checkout = null;
let liveTimer = null;

const state = () => store.get();
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const t = (key, vars={}) => {
  let text = COPY[state().language]?.[key] ?? COPY.de[key] ?? key;
  for (const [name,value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
};
const locale = () => state().language==='es'?'es-MX':state().language==='en'?'en-GB':'de-DE';
const fmtDate = value => new Intl.DateTimeFormat(locale(),{weekday:'short',day:'2-digit',month:'short'}).format(new Date(`${value}T12:00:00`));
const duration = mins => `${Math.floor(mins/60)?`${Math.floor(mins/60)} h `:''}${String(mins%60).padStart(2,'0')} min`;
const currency = amount => `${Number(amount).toFixed(0)} GM`;
const seed = text => { let h=2166136261; for(const ch of String(text)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)} return h>>>0 };
const uid = prefix => `${prefix}-${Date.now().toString(36).toUpperCase()}-${String(seed(Math.random())%10000).padStart(4,'0')}`;

function applyTheme(){
  const dark = state().theme==='dark' || (state().theme==='system' && matchMedia('(prefers-color-scheme:dark)').matches);
  document.documentElement.dataset.theme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#17171b':'#7e1731');
}
function setCopy(){
  document.documentElement.lang=state().language;
  document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));
}
function updateOnline(){
  onlineBadge.textContent=navigator.onLine?t('online'):t('offline');
  onlineBadge.classList.toggle('offline',!navigator.onLine);
}
function toast(message){
  const node=document.createElement('div'); node.className='toast'; node.textContent=message; toastRoot.append(node); setTimeout(()=>node.remove(),2800);
}
function stopTimers(){ if(liveTimer){clearInterval(liveTimer);liveTimer=null} }

const allowedRoutes=['home','travel','city','tickets','profile','network','operations'];
function routeFromHash(){const r=location.hash.replace(/^#\/?/,'').split('?')[0];return allowedRoutes.includes(r)?r:'home'}
function navigate(route,opts={}){
  if(!allowedRoutes.includes(route))route='home';
  store.set(s=>({...s,route}));
  const hash=`#/${route}`;
  if(location.hash!==hash) location.hash=hash; else render(route,opts);
}
function render(route=routeFromHash(),opts={}){
  stopTimers(); closeModal(false);
  document.querySelectorAll('.nav-button').forEach(b=>{b.classList.toggle('active',b.dataset.route===route);b.setAttribute('aria-current',b.dataset.route===route?'page':'false')});
  if(route==='home')renderHome();
  if(route==='travel')renderTravel(opts);
  if(route==='city')renderCity();
  if(route==='tickets')renderTickets();
  if(route==='profile')renderProfile();
  if(route==='network')renderNetwork();
  if(route==='operations')renderOperations();
  bindNav(main);
  window.scrollTo({top:0,behavior:opts.instant?'auto':'smooth'});
  main.focus({preventScroll:true});
}
function bindNav(root=document){
  root.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
}

function activeTicket(){return state().tickets.find(x=>x.id===state().activeTicketId)||state().tickets[0]||null}
function activeSubscription(){return state().subscriptions.find(x=>x.status==='active')||null}
function demoTrip(){return {id:'DEMO',train:'ICE 102',type:'ICE',fromId:'GUA',toId:'LOW',from:'Guadalajara Hbf',to:'Löwenstadt Hbf',date:new Date().toISOString().slice(0,10),departure:'15:15',arrival:'16:58',duration:103,delay:0,platform:'4',coach:'5',seat:'18A',path:['GUA','TEP','LAG','LOW'],price:89}}

function renderHome(){
  const trip=activeTicket()||demoTrip(); const sub=activeSubscription();
  main.innerHTML=`
    <section class="page-header"><p class="eyebrow">GBahn ${APP_VERSION}</p><h1>${esc(t('greeting'))}, David.</h1><p class="subtitle">${esc(t('tagline'))}</p></section>
    <article class="hero-card">
      <div class="hero-head"><span class="service-badge ${trip.type}">${esc(trip.train)}</span><span class="status ${trip.delay?'warn':'ok'}">${trip.delay?`+${trip.delay} min`:esc(t('onTime'))}</span></div>
      <h2>${esc(t('nextTrip'))}</h2>
      <div class="hero-route"><div><strong>${esc(trip.departure)}</strong><small>${esc(trip.from)}</small></div><span></span><div><strong>${esc(trip.arrival)}</strong><small>${esc(trip.to)}</small></div></div>
      <div class="hero-foot"><span>${esc(t('platform'))} ${esc(trip.platform||4)}${trip.seat?` · ${esc(t('seat'))} ${esc(trip.seat)}`:''}</span><button class="text-on-dark" data-live="${esc(trip.id)}" type="button">${esc(t('live'))} →</button></div>
    </article>
    <section class="quick-grid">
      <button class="quick" data-nav="travel"><b>⌕</b><span>${esc(t('search'))}</span></button>
      <button class="quick" data-nav="city"><b>▦</b><span>${esc(t('cityTravel'))}</span></button>
      <button class="quick" data-nav="network"><b>◇</b><span>${esc(t('network'))}</span></button>
      <button class="quick" data-nav="operations"><b>!</b><span>${esc(t('operations'))}</span></button>
    </section>
    <section class="section">
      <div class="section-title"><h2>${esc(t('galizienTicket'))}</h2><button class="link-button" data-subscriptions type="button">${esc(t('subscribe'))}</button></div>
      ${sub?subscriptionCard(sub):`<article class="card pass-promo"><div><span class="pass-logo">G</span><div><h3>Galizien-Ticket</h3><p>${esc(t('validLocal'))}</p></div></div><strong>59 GM <small>${esc(t('monthly'))}</small></strong></article>`}
    </section>
    <section class="section"><div class="section-title"><h2>${esc(t('operationsTitle'))}</h2><button class="link-button" data-nav="operations">${esc(t('open'))}</button></div><div class="alerts-mini">${SERVICE_ALERTS.slice(0,3).map(alertMini).join('')}</div></section>
    <section class="section"><article class="card federal-card"><span>BPOL</span><div><h3>${esc(t('federalPolice'))}</h3><p>${esc(t('borderText'))}</p></div></article></section>`;
  main.querySelector('[data-subscriptions]')?.addEventListener('click',openSubscriptions);
  main.querySelector('[data-live]')?.addEventListener('click',()=>openLiveTrip(trip));
}
function alertMini(a){return `<article class="alert-mini ${a.severity}"><span></span><div><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></div></article>`}
function subscriptionCard(s){return `<article class="card active-pass"><div><span class="pass-logo">G</span><div><small>${esc(t('activeSubscription'))}</small><h3>${esc(s.name)}</h3><p>${esc(t('validUntil'))}: ${esc(fmtDate(s.validUntil))}</p></div></div><strong>${esc(currency(s.price))}</strong></article>`}

function stationOptions(selected){return STATIONS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}${s.country==='MX'?' · MX':''}</option>`).join('')}
function renderTravel(opts={}){
  const s=state().search;
  main.innerHTML=`
    <section class="page-header"><p class="eyebrow">${esc(t('longDistance'))}</p><h1>${esc(t('search'))}</h1><p class="subtitle">ICE · IC · RE · EC International · NightJet</p></section>
    <article class="card search-card">
      <div class="field"><label for="fromStation">${esc(t('from'))}</label><select id="fromStation">${stationOptions(s.fromId)}</select></div>
      <button id="swapStations" class="swap" type="button">⇅</button>
      <div class="field"><label for="toStation">${esc(t('to'))}</label><select id="toStation">${stationOptions(s.toId)}</select></div>
      <div class="field-grid"><div class="field date-field"><label for="travelDate">${esc(t('date'))}</label><span><input id="travelDate" type="date" value="${esc(s.date)}"></span></div><div class="field date-field"><label for="travelTime">${esc(t('time'))}</label><span><input id="travelTime" type="time" value="${esc(s.time)}"></span></div></div>
      <div class="field-grid"><div class="field"><label for="passengers">${esc(t('passengers'))}</label><select id="passengers">${[1,2,3,4,5,6].map(n=>`<option ${n===Number(s.passengers)?'selected':''}>${n}</option>`).join('')}</select></div><div class="field"><label for="class">${esc(t('travelClass'))}</label><select id="class"><option value="2" ${s.travelClass==='2'?'selected':''}>${esc(t('secondClass'))}</option><option value="1" ${s.travelClass==='1'?'selected':''}>${esc(t('firstClass'))}</option></select></div></div>
      <button id="searchJourneys" class="primary full" type="button">${esc(t('find'))}</button>
    </article>
    <div id="internationalBanner"></div>
    <section id="resultsSection" class="section" hidden><div class="section-title"><h2>${esc(t('connections'))}</h2><span id="resultCount" class="muted"></span></div><div id="journeyResults" class="result-list"></div></section>`;
  const from=document.getElementById('fromStation'),to=document.getElementById('toStation');
  const updateBanner=()=>{const intl=getStation(from.value)?.country==='MX'||getStation(to.value)?.country==='MX';document.getElementById('internationalBanner').innerHTML=intl?federalNotice():''};
  from.addEventListener('change',updateBanner);to.addEventListener('change',updateBanner);updateBanner();
  document.getElementById('swapStations').addEventListener('click',()=>{[from.value,to.value]=[to.value,from.value];updateBanner()});
  document.getElementById('searchJourneys').addEventListener('click',performTravelSearch);
  if(opts.autoSearch){requestAnimationFrame(performTravelSearch)}
}
function federalNotice(){return `<article class="card federal-card standalone"><span>BPOL</span><div><h3>${esc(t('federalPolice'))}</h3><p>${esc(t('borderText'))}</p><div class="chips"><i>${esc(t('passportRequired'))}</i><i>${esc(t('arriveEarly'))}</i></div></div></article>`}
function performTravelSearch(){
  const search={fromId:document.getElementById('fromStation').value,toId:document.getElementById('toStation').value,date:document.getElementById('travelDate').value,time:document.getElementById('travelTime').value,passengers:Number(document.getElementById('passengers').value),travelClass:document.getElementById('class').value};
  if(search.fromId===search.toId){toast('Start und Ziel müssen verschieden sein.');return}
  store.set(s=>({...s,search}));currentJourneys=createJourneys(search);const business=activeSubscription()?.productId==='BUSINESS';if(business)currentJourneys=currentJourneys.map(j=>({...j,price:Math.round(j.price*.85),businessDiscount:true}));renderJourneyResults();
}
function connectionLabel(j){return j.connection==='safe'?t('connectionSafe'):j.connection==='risk'?t('connectionRisk'):t('connectionMissed')}
function renderJourneyResults(){
  const section=document.getElementById('resultsSection'),list=document.getElementById('journeyResults');section.hidden=false;document.getElementById('resultCount').textContent=String(currentJourneys.length);
  list.innerHTML=currentJourneys.map(j=>`<button class="journey-card" data-journey="${esc(j.id)}" type="button"><div class="journey-top"><span class="service-badge ${j.type}">${esc(j.train)}</span><span class="status ${j.delay?'warn':'ok'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span></div><div class="journey-route"><div><strong>${esc(j.departure)}</strong><small>${esc(j.from)}</small></div><span></span><div><strong>${esc(j.arrival)}</strong><small>${esc(j.to)}</small></div></div><div class="journey-bottom"><span>${esc(duration(j.duration))} · ${j.changes?`${j.changes} ${esc(t('changes'))}`:esc(t('direct'))}</span><strong>${esc(currency(j.price))}</strong></div>${j.changes?`<div class="connection-state ${j.connection}">${esc(connectionLabel(j))}</div>`:''}${j.international?`<div class="international-row">◎ ${esc(t('international'))} · ${esc(t('passportRequired'))}</div>`:''}${j.night?`<div class="night-row">☾ ${esc(t('nightTrain'))} · ${esc(t('cabin'))} / ${esc(t('bed'))}</div>`:''}</button>`).join('');
  list.querySelectorAll('[data-journey]').forEach(b=>b.addEventListener('click',()=>openJourney(currentJourneys.find(j=>j.id===b.dataset.journey))));section.scrollIntoView({behavior:'smooth'});
}
function openJourney(j){
  selectedJourney=j; const stops=j.path.map((id,i)=>({station:getStation(id),time:addTime(j.departure,Math.round(j.duration*i/(j.path.length-1))),change:j.changes&&i===Math.ceil(j.path.length/2),border:id==='GRE'&&j.international}));
  const fares=FARES.filter(f=>!f.international||j.international);
  showModal(t('connections'),`<article><div class="journey-top"><span class="service-badge ${j.type}">${esc(j.train)}</span><span class="status ${j.delay?'warn':'ok'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span></div><div class="timeline">${stops.map(s=>`<div class="timeline-row ${s.border?'border':''}"><time>${esc(s.time)}</time><span><i></i></span><div><strong>${esc(s.station.name)}</strong><small>${s.border?`${esc(t('federalPolice'))} · 45 min`:s.change?esc(t('changes')):esc(t('onTime'))}</small></div></div>`).join('')}</div>${j.international?federalNotice():''}${j.connection==='missed'?`<article class="card connection-demo missed"><h3>${esc(t('connectionMissed'))}</h3><p>${esc(t('alternative'))}: ${esc(j.type)} ${Number(j.train.match(/\d+/)?.[0]||600)+4} · ${esc(addTime(j.departure,24))}</p></article>`:''}<h3>${esc(t('fare'))}</h3><div class="fare-list">${fares.map((f,i)=>`<label class="fare-choice ${i===0?'selected':''}"><input type="radio" name="fare" value="${f.id}" ${i===0?'checked':''}><span><strong>${esc(f.name)}</strong><small>${fareDescription(f)}</small></span><b>${esc(currency(Math.round(j.price*f.factor)))}</b></label>`).join('')}</div><button id="startCheckout" class="primary full" type="button">${esc(t('continue'))}</button></article>`);
  modalRoot.querySelectorAll('.fare-choice').forEach(label=>label.addEventListener('click',()=>{modalRoot.querySelectorAll('.fare-choice').forEach(x=>x.classList.remove('selected'));label.classList.add('selected')}));
  document.getElementById('startCheckout').addEventListener('click',()=>{const fareId=modalRoot.querySelector('input[name="fare"]:checked').value;const fare=FARES.find(f=>f.id===fareId);startJourneyCheckout(j,fare)});
}
function fareDescription(f){const parts=[];parts.push(f.changeable===true?'Umbuchung inklusive':f.changeable==='fee'?'Umbuchung gegen Gebühr':'Keine Umbuchung');parts.push(f.refundable===true?'Erstattung inklusive':f.refundable==='fee'?'Begrenzte Erstattung':'Keine Erstattung');if(f.seat)parts.push('Sitzplatz inklusive');return parts.join(' · ')}

function startJourneyCheckout(journey,fare){
  checkout={kind:'journey',journey,fare,step:journey.type==='RE'?2:1,seat:null,cabinExtra:0,extras:{bike:false},traveler:{name:'David J. Martínez',document:''},price:Math.round(journey.price*fare.factor)};
  renderCheckout();
}
function renderCheckout(){
  if(!checkout)return;
  const titles=[t('seatSelection'),t('traveler'),t('extras'),t('payment')];
  showModal(titles[Math.max(0,checkout.step-1)]||t('payment'),`<div class="checkout-progress">${[1,2,3,4].map(n=>`<span class="${n<=checkout.step?'active':''}">${n}</span>`).join('')}</div><div id="checkoutBody"></div>`,false);
  if(checkout.step===1)renderSeatStep();
  if(checkout.step===2)renderTravelerStep();
  if(checkout.step===3)renderExtrasStep();
  if(checkout.step===4)renderPaymentStep();
}
function renderSeatStep(){
  const body=document.getElementById('checkoutBody'); const night=checkout.journey.night;
  if(night){body.innerHTML=`<p class="muted">${esc(t('nightTrain'))}</p><div class="cabin-options">${[{id:'SEAT',name:'Sitzplatz',p:0},{id:'BERTH',name:'Liegewagen',p:34},{id:'CABIN',name:'Privatkabine',p:89}].map((x,i)=>`<button class="cabin-option ${i===0?'selected':''}" data-cabin="${x.id}" data-price="${x.p}" type="button"><strong>${esc(x.name)}</strong><small>+${x.p} GM</small></button>`).join('')}</div><button class="primary full" id="seatNext">${esc(t('continue'))}</button>`;body.querySelectorAll('[data-cabin]').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-cabin]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.price-=checkout.cabinExtra||0;checkout.cabinExtra=Number(b.dataset.price);checkout.price+=checkout.cabinExtra;checkout.seat=b.dataset.cabin}));}
  else {body.innerHTML=`<div class="seat-legend"><span><i class="available"></i>${esc(t('seat'))}</span><span><i class="occupied"></i>Besetzt</span><span><i class="selected"></i>Ausgewählt</span></div><div class="coach"><div class="coach-label">Wagen 5 · ${esc(t('quiet'))}</div><div class="seat-grid">${makeSeats(checkout.journey.id)}</div></div><p id="seatStatus" class="muted">${esc(t('seatSelection'))}</p><button class="primary full" id="seatNext" disabled>${esc(t('continue'))}</button>`;body.querySelectorAll('[data-seat]:not(.occupied)').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-seat]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.seat=b.dataset.seat;document.getElementById('seatStatus').textContent=`${t('seat')}: ${checkout.seat}`;document.getElementById('seatNext').disabled=false}));}
  document.getElementById('seatNext').addEventListener('click',()=>{if(!checkout.seat)checkout.seat=night?'SEAT':null;checkout.step=2;renderCheckout()});
}
function makeSeats(id){let html='';for(let row=11;row<=18;row++){for(const letter of ['A','B','C','D']){const code=`${row}${letter}`,occupied=seed(id+code)%5===0;html+=`<button type="button" data-seat="${code}" class="seat ${occupied?'occupied':''}" ${occupied?'disabled':''}>${code}</button>`}if(row===14)html+='<div class="table-label">Tisch</div>'}return html}
function renderTravelerStep(){
  const b=document.getElementById('checkoutBody');b.innerHTML=`<div class="field"><label for="travelerName">${esc(t('traveler'))}</label><input id="travelerName" value="${esc(checkout.traveler.name)}"></div>${checkout.journey.international?`<article class="card federal-card standalone"><span>BPOL</span><div><h3>${esc(t('federalPolice'))}</h3><p>${esc(t('borderText'))}</p></div></article><div class="field"><label for="documentNumber">Reisepassnummer (Demo)</label><input id="documentNumber" placeholder="GZ1234567" maxlength="12"></div><label class="check-row"><input id="documentsConfirmed" type="checkbox"><span>Ich bestätige, dass gültige Einreisedokumente vorliegen.</span></label>`:''}<div class="button-row"><button class="secondary" id="travBack">${esc(t('back'))}</button><button class="primary" id="travNext">${esc(t('continue'))}</button></div>`;
  document.getElementById('travBack').addEventListener('click',()=>{if(checkout.journey.type==='RE'){const journey=checkout.journey;checkout=null;closeModal();openJourney(journey)}else{checkout.step=1;renderCheckout()}});
  document.getElementById('travNext').addEventListener('click',()=>{const name=document.getElementById('travelerName').value.trim();if(name.length<3){toast('Name erforderlich');return}if(checkout.journey.international&&!document.getElementById('documentsConfirmed').checked){toast(t('passportRequired'));return}checkout.traveler={name,document:document.getElementById('documentNumber')?.value||''};checkout.step=3;renderCheckout()});
}
function renderExtrasStep(){
  const b=document.getElementById('checkoutBody');b.innerHTML=`<div class="extras-list"><label class="extra-row"><input id="seatReservation" type="checkbox" ${checkout.seat?'checked disabled':''}><span><strong>Sitzplatzreservierung</strong><small>${checkout.seat?checkout.seat:'+ 6 GM'}</small></span></label><label class="extra-row"><input id="bikeExtra" type="checkbox"><span><strong>${esc(t('bike'))}</strong><small>+ 8 GM</small></span></label><label class="extra-row"><input id="classUpgrade" type="checkbox"><span><strong>${esc(t('firstClass'))}</strong><small>+ 24 GM</small></span></label></div><div class="summary-card"><span>Zwischensumme</span><strong id="extraTotal">${esc(currency(checkout.price))}</strong></div><div class="button-row"><button class="secondary" id="extraBack">${esc(t('back'))}</button><button class="primary" id="extraNext">${esc(t('continue'))}</button></div>`;
  const update=()=>{const extra=(document.getElementById('bikeExtra').checked?8:0)+(document.getElementById('classUpgrade').checked?24:0)+(!checkout.seat&&document.getElementById('seatReservation').checked?6:0);document.getElementById('extraTotal').textContent=currency(checkout.price+extra)};['bikeExtra','classUpgrade','seatReservation'].forEach(id=>document.getElementById(id).addEventListener('change',update));
  document.getElementById('extraBack').addEventListener('click',()=>{checkout.step=2;renderCheckout()});
  document.getElementById('extraNext').addEventListener('click',()=>{checkout.extras={bike:document.getElementById('bikeExtra').checked,upgrade:document.getElementById('classUpgrade').checked};checkout.price+=(checkout.extras.bike?8:0)+(checkout.extras.upgrade?24:0)+(!checkout.seat&&document.getElementById('seatReservation').checked?6:0);checkout.step=4;renderCheckout()});
}
function renderPaymentStep(){
  const b=document.getElementById('checkoutBody');b.innerHTML=paymentForm(checkout.price);bindPaymentForm(async result=>{if(!result.ok)return;finalizeJourney(result)});
}

function paymentForm(price){return `<article class="demo-payment"><strong>DEMO</strong><p>${esc(t('demoPayment'))}</p></article><div class="order-total"><span>${esc(t('payment'))}</span><strong>${esc(currency(price))}</strong></div><div class="field"><label for="payHolder">${esc(t('cardholder'))}</label><input id="payHolder" autocomplete="off" value="David J. Martínez"></div><div class="field"><label for="payNumber">${esc(t('cardNumber'))}</label><input id="payNumber" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242"><small>Visa 4242… · Mastercard 5555… · 4000…0002 = abgelehnt</small></div><div class="field-grid"><div class="field"><label for="payExpiry">${esc(t('expiry'))}</label><input id="payExpiry" inputmode="numeric" placeholder="12/30"></div><div class="field"><label for="payCvv">${esc(t('cvv'))}</label><input id="payCvv" inputmode="numeric" placeholder="123" maxlength="4"></div></div><div class="field"><label for="payAddress">${esc(t('billingAddress'))}</label><input id="payAddress" value="Musterstraße 12, Guadalajara"></div><div class="field"><label for="payCountry">${esc(t('country'))}</label><select id="payCountry"><option value="GL">Galizien</option><option value="MX">México</option><option value="DE">Deutschland</option></select></div><label class="check-row"><input id="savePay" type="checkbox"><span>Testkarte (nur Marke und letzte 4 Ziffern) merken</span></label><div id="paymentProgress" class="payment-progress" hidden></div><button id="payButton" class="primary full" type="button">${esc(t('pay'))} · ${esc(currency(price))}</button>`}
function bindPaymentForm(onSuccess){
  const number=document.getElementById('payNumber');number.addEventListener('input',()=>{number.value=number.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()});
  document.getElementById('payExpiry').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);e.target.value=v});
  document.getElementById('payButton').addEventListener('click',async()=>{const fields={holder:document.getElementById('payHolder').value,number:number.value,expiry:document.getElementById('payExpiry').value,cvv:document.getElementById('payCvv').value,address:document.getElementById('payAddress').value,country:document.getElementById('payCountry').value};const v=validatePayment(fields);document.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));if(!v.ok){for(const id of Object.keys(v.errors)){document.getElementById('pay'+id[0].toUpperCase()+id.slice(1))?.classList.add('invalid')}toast(t('demoPayment'));return}const progress=document.getElementById('paymentProgress');progress.hidden=false;document.getElementById('payButton').disabled=true;const result=await simulatePayment(fields,step=>{progress.textContent=step==='processing'?t('processing'):step==='bank'?t('contactingBank'):t('secureCheck')});if(!result.ok){progress.textContent=t('declined');progress.classList.add('error');document.getElementById('payButton').disabled=false;return}progress.textContent=t('approved');progress.classList.add('success');if(document.getElementById('savePay').checked)store.set(s=>({...s,savedPayment:{brand:result.card.brand,last4:result.last4}}));setTimeout(()=>onSuccess(result),550)});
}
function finalizeJourney(payment){
  const j=checkout.journey;const ticket={...j,id:uid('GBT'),fare:checkout.fare.name,price:checkout.price,coach:j.night?'NJ':String(2+seed(j.id)%7),seat:checkout.seat||'Ohne Reservierung',passenger:checkout.traveler.name,document:checkout.traveler.document,extras:checkout.extras,payment:{brand:payment.card.brand,last4:payment.last4,authorization:payment.authorization},bookedAt:new Date().toISOString()};
  store.set(s=>({...s,tickets:[ticket,...s.tickets],orders:[{id:payment.authorization,type:'ticket',description:`${j.train} ${j.from} – ${j.to}`,amount:checkout.price,date:new Date().toISOString()},...s.orders],activeTicketId:ticket.id}));checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets');
}

function renderCity(){
  const urban=state().urban;const network=getUrbanNetwork(urban.cityId);const mode=urban.mode;
  main.innerHTML=`<section class="page-header"><p class="eyebrow">${esc(t('urban'))}</p><h1>${esc(t('cityTravel'))}</h1><p class="subtitle">U-Bahn · S-Bahn · Bus · Tram</p></section><div class="field"><label for="urbanCity">Stadt / Metropolregion</label><select id="urbanCity">${URBAN_NETWORKS.map(n=>`<option value="${n.id}" ${n.id===network.id?'selected':''}>${esc(n.name)} (${esc(n.oldName)})</option>`).join('')}</select></div><div class="mode-tabs"><button data-mode="U" class="${mode==='U'?'active':''}">U-Bahn</button><button data-mode="S" class="${mode==='S'?'active':''}">S-Bahn</button></div><section class="section"><div class="section-title"><h2>${esc(t('departures'))}</h2><span class="live-dot">● LIVE</span></div><div id="urbanDepartures" class="departure-board">${urbanDepartures(network,mode)}</div></section><section class="section"><div class="section-title"><h2>${esc(t('lines'))}</h2><span>${network.lines.filter(l=>l.mode===mode).length}</span></div><div class="line-list">${network.lines.filter(l=>l.mode===mode).map(urbanLineCard).join('')}</div></section><section class="section"><article class="card urban-planner"><h2>${esc(t('urbanPlanner'))}</h2><div class="field"><label for="urbanFrom">${esc(t('from'))}</label><select id="urbanFrom">${network.stops.map(s=>`<option ${s===urban.from?'selected':''}>${esc(s)}</option>`).join('')}</select></div><div class="field"><label for="urbanTo">${esc(t('to'))}</label><select id="urbanTo">${network.stops.map(s=>`<option ${s===urban.to?'selected':''}>${esc(s)}</option>`).join('')}</select></div><button id="urbanSearch" class="primary full">${esc(t('find'))}</button><div id="urbanResult"></div></article></section><section class="section"><div class="section-title"><h2>${esc(t('urbanTickets'))}</h2><button class="link-button" id="openSubscriptions">${esc(t('subscriptions'))}</button></div><div class="urban-products"><button data-local-ticket="single"><span><strong>${esc(t('singleTicket'))}</strong><small>90 Minuten · Stadtgebiet</small></span><b>4 GM</b></button><button data-local-ticket="day"><span><strong>${esc(t('dayTicket'))}</strong><small>Bis Betriebsschluss</small></span><b>14 GM</b></button></div></section><section class="section">${activeSubscription()?subscriptionCard(activeSubscription()):`<article class="card pass-promo"><div><span class="pass-logo">G</span><div><h3>Galizien-Ticket</h3><p>${esc(t('validLocal'))}</p></div></div><button class="primary small" id="subscribeNow">${esc(t('subscribe'))}</button></article>`}</section>`;
  document.getElementById('urbanCity').addEventListener('change',e=>{const n=getUrbanNetwork(e.target.value);store.set(s=>({...s,urban:{...s.urban,cityId:n.id,from:n.stops[0],to:n.stops.at(-1)}}));renderCity()});
  main.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,urban:{...s.urban,mode:b.dataset.mode}}));renderCity()}));
  document.getElementById('urbanSearch').addEventListener('click',performUrbanSearch);
  document.getElementById('openSubscriptions').addEventListener('click',openSubscriptions);document.getElementById('subscribeNow')?.addEventListener('click',openSubscriptions);
  main.querySelectorAll('[data-local-ticket]').forEach(b=>b.addEventListener('click',()=>startLocalTicketCheckout(b.dataset.localTicket,network)));
  main.querySelectorAll('[data-line]').forEach(b=>b.addEventListener('click',()=>openUrbanLine(network,b.dataset.line)));
}
function urbanDepartures(n,mode){const now=new Date();return n.lines.filter(l=>l.mode===mode).slice(0,6).map((l,i)=>{const mins=2+i*3;const time=new Date(now.getTime()+mins*60000).toTimeString().slice(0,5);return `<div class="departure-row"><time>${time}</time><span class="line-pill" style="--line:${l.color}">${esc(l.id)}</span><div><strong>${esc(l.stops.at(-1))}</strong><small>in ${mins} ${esc(t('minutes'))} · ${esc(t('onTime'))}</small></div><b>${esc(t('platform'))} ${1+i%4}</b></div>`}).join('')}
function urbanLineCard(l){return `<button data-line="${l.id}" class="urban-line"><span class="line-pill" style="--line:${l.color}">${esc(l.id)}</span><span><strong>${esc(l.stops[0])} ↔ ${esc(l.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${l.minutes} ${esc(t('minutes'))} · ${l.stops.length} Stationen</small></span><b>›</b></button>`}
function performUrbanSearch(){const n=getUrbanNetwork(state().urban.cityId),from=document.getElementById('urbanFrom').value,to=document.getElementById('urbanTo').value;store.set(s=>({...s,urban:{...s.urban,from,to}}));const route=planUrban(n,from,to),target=document.getElementById('urbanResult');if(!route){target.innerHTML=`<p class="error-text">${esc(t('noRoute'))}</p>`;return}target.innerHTML=`<article class="urban-result"><div class="urban-summary"><strong>${esc(duration(route.minutes))}</strong><span>${route.changes} ${esc(t('changes'))}</span></div>${route.steps.map((s,i)=>`<div class="urban-step"><span class="line-pill" style="--line:${s.color}">${esc(s.lineId)}</span><div><strong>${esc(s.from)} → ${esc(s.to)}</strong><small>${s.stops} Stationen · ${s.minutes} min</small></div></div>${i<route.steps.length-1?`<div class="transfer">${esc(t('changes'))} · 6 min</div>`:''}`).join('')}<button id="buyUrbanRoute" class="primary full">${esc(t('buyTicket'))} · 4 GM</button></article>`;document.getElementById('buyUrbanRoute').addEventListener('click',()=>startLocalTicketCheckout('single',n,{from,to,route}))}
function openUrbanLine(network,lineId){const l=network.lines.find(x=>x.id===lineId);showModal(`${l.id} · ${network.name}`,`<div class="line-detail"><div class="line-header"><span class="line-pill big" style="--line:${l.color}">${esc(l.id)}</span><div><strong>${esc(l.stops[0])} ↔ ${esc(l.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${l.minutes} min</small></div></div><div class="urban-timeline">${l.stops.map((s,i)=>`<div><span></span><strong>${esc(s)}</strong><small>${addTime(new Date().toTimeString().slice(0,5),i*3)}</small></div>`).join('')}</div></div>`)}
function startLocalTicketCheckout(type,network,routeData=null){checkout={kind:'local',product:{type,name:type==='day'?t('dayTicket'):t('singleTicket'),price:type==='day'?14:4,network:network.name,routeData},price:type==='day'?14:4,step:4};showModal(t('payment'),`<div id="checkoutBody">${paymentForm(checkout.price)}</div>`,false);bindPaymentForm(result=>{if(!result.ok)return;const validUntil=type==='day'?new Date(Date.now()+18*3600000).toISOString():new Date(Date.now()+90*60000).toISOString();const ticket={id:uid('GBU'),kind:'urban',name:checkout.product.name,network:network.name,price:checkout.price,validFrom:new Date().toISOString(),validUntil,route:routeData,payment:{brand:result.card.brand,last4:result.last4,authorization:result.authorization}};store.set(s=>({...s,tickets:[ticket,...s.tickets],orders:[{id:result.authorization,type:'urban',description:`${ticket.name} · ${network.name}`,amount:ticket.price,date:new Date().toISOString()},...s.orders]}));checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets')})}

function openSubscriptions(){
  showModal(t('subscriptions'),`<div class="subscription-list">${SUBSCRIPTIONS.map(p=>`<article class="subscription-option"><div class="subscription-head"><div><h3>${esc(p.name)}</h3><p>${esc(p.eligibility)}</p></div><strong>${p.price} GM<small>${esc(t('monthly'))}</small></strong></div><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><p class="warning-copy">${esc(t('notLongDistance'))}</p><p class="warning-copy">${esc(t('mexicoLimit'))}</p><button class="primary full" data-subscribe="${p.id}">${esc(t('subscribe'))}</button></article>`).join('')}</div>`);
  modalRoot.querySelectorAll('[data-subscribe]').forEach(b=>b.addEventListener('click',()=>startSubscriptionCheckout(SUBSCRIPTIONS.find(p=>p.id===b.dataset.subscribe))));
}
function startSubscriptionCheckout(product){checkout={kind:'subscription',product,price:product.price,step:4};showModal(t('payment'),`<article class="subscription-summary"><span class="pass-logo">G</span><div><h3>${esc(product.name)}</h3><p>${esc(t('validLocal'))}</p></div><strong>${product.price} GM</strong></article><div id="checkoutBody">${paymentForm(product.price)}</div>`,false);bindPaymentForm(result=>{if(!result.ok)return;const start=new Date(),end=new Date(start);end.setMonth(end.getMonth()+1);const sub={id:uid('GBA'),productId:product.id,name:product.name,price:product.price,status:'active',startedAt:start.toISOString(),validUntil:end.toISOString().slice(0,10),renewal:end.toISOString().slice(0,10),payment:{brand:result.card.brand,last4:result.last4}};store.set(s=>({...s,subscriptions:[sub,...s.subscriptions.map(x=>({...x,status:'replaced'}))],orders:[{id:result.authorization,type:'subscription',description:product.name,amount:product.price,date:new Date().toISOString()},...s.orders]}));checkout=null;closeModal();toast(t('approved'));navigate('tickets')})}

function renderTickets(){
  const tab=state().ui.ticketTab;const tickets=state().tickets,subs=state().subscriptions.filter(s=>s.status==='active');
  main.innerHTML=`<section class="page-header"><p class="eyebrow">Wallet</p><h1>${esc(t('tickets'))}</h1></section><div class="mode-tabs"><button data-ticket-tab="tickets" class="${tab==='tickets'?'active':''}">${esc(t('tickets'))}</button><button data-ticket-tab="subscriptions" class="${tab==='subscriptions'?'active':''}">${esc(t('subscriptions'))}</button></div>${tab==='tickets'?(tickets.length?`<div class="ticket-list">${tickets.map(ticketCard).join('')}</div>`:`<article class="card empty"><b>▣</b><h2>${esc(t('noTickets'))}</h2><p>${esc(t('noTicketsText'))}</p><button class="primary" data-nav="travel">${esc(t('search'))}</button></article>`):(subs.length?`<div class="subscription-list">${subs.map(subscriptionCard).join('')}</div>`:`<article class="card empty"><b>G</b><h2>${esc(t('galizienTicket'))}</h2><button class="primary" id="ticketSubscribe">${esc(t('subscribe'))}</button></article>`)}`;
  main.querySelectorAll('[data-ticket-tab]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,ticketTab:b.dataset.ticketTab}}));renderTickets()}));
  main.querySelectorAll('[data-ticket-id]').forEach(b=>b.addEventListener('click',()=>openTicket(state().tickets.find(x=>x.id===b.dataset.ticketId))));
  document.getElementById('ticketSubscribe')?.addEventListener('click',openSubscriptions);
  main.querySelectorAll('[data-cancel-sub]').forEach(b=>b.addEventListener('click',()=>cancelSubscription(b.dataset.cancelSub)));
}
function ticketCard(x){if(x.kind==='urban')return `<button class="ticket-summary urban" data-ticket-id="${x.id}"><div><span class="service-badge S">STADT</span><h3>${esc(x.name)}</h3><p>${esc(x.network)}</p></div><div><strong>${esc(currency(x.price))}</strong><small>${esc(t('validUntil'))}: ${new Date(x.validUntil).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}</small></div></button>`;return `<button class="ticket-summary" data-ticket-id="${x.id}"><div><span class="service-badge ${x.type}">${esc(x.train)}</span><h3>${esc(x.from)} → ${esc(x.to)}</h3><p>${esc(fmtDate(x.date))} · ${esc(x.departure)}</p></div><div><strong>${esc(currency(x.price))}</strong><small>${esc(t('seat'))} ${esc(x.seat)}</small></div></button>`}
function openTicket(x){
  if(x.kind==='urban'){showModal(t('tickets'),`<article class="digital-ticket urban-ticket"><div class="ticket-brand">GALIZISCHES BAHN · STADT</div><h2>${esc(x.name)}</h2><p>${esc(x.network)}</p><div class="ticket-valid"><small>${esc(t('validUntil'))}</small><strong>${new Date(x.validUntil).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</strong></div><div class="security-animation"></div><canvas id="ticketQR" width="210" height="210"></canvas><code>${esc(x.id)}</code></article>`);drawQR(document.getElementById('ticketQR'),x.id);return}
  showModal(t('tickets'),`<article class="digital-ticket ${x.international?'international-ticket':''}"><div class="ticket-brand">GALIZISCHES BAHN</div><div class="ticket-service"><span class="service-badge ${x.type}">${esc(x.train)}</span><span>${esc(x.fare)}</span></div><div class="digital-route"><div><strong>${esc(x.departure)}</strong><small>${esc(x.from)}</small></div><b>→</b><div><strong>${esc(x.arrival)}</strong><small>${esc(x.to)}</small></div></div><div class="ticket-data"><div><small>${esc(t('traveler'))}</small><strong>${esc(x.passenger)}</strong></div><div><small>${esc(t('seat'))}</small><strong>${esc(x.coach)} · ${esc(x.seat)}</strong></div><div><small>${esc(t('platform'))}</small><strong>${esc(x.platform)}</strong></div><div><small>${esc(t('price'))}</small><strong>${esc(currency(x.price))}</strong></div></div>${x.international?federalNotice():''}<div class="security-animation"></div><canvas id="ticketQR" width="210" height="210"></canvas><code>${esc(x.id)}</code><button class="primary full" id="ticketLive">${esc(t('live'))}</button></article>`);drawQR(document.getElementById('ticketQR'),x.id+x.train);document.getElementById('ticketLive').addEventListener('click',()=>openLiveTrip(x));
}
function drawQR(canvas,text){const c=canvas.getContext('2d'),n=29,cell=canvas.width/n;let value=seed(text);const rand=()=>{value^=value<<13;value^=value>>>17;value^=value<<5;return(value>>>0)/4294967296};c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#111';const reserved=Array.from({length:n},()=>Array(n).fill(false));const finder=(sx,sy)=>{for(let y=0;y<7;y++)for(let x=0;x<7;x++){reserved[sy+y][sx+x]=true;if(x===0||y===0||x===6||y===6||(x>=2&&x<=4&&y>=2&&y<=4))c.fillRect((sx+x)*cell,(sy+y)*cell,Math.ceil(cell),Math.ceil(cell))}};finder(1,1);finder(n-8,1);finder(1,n-8);for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!reserved[y][x]&&rand()>.52)c.fillRect(x*cell,y*cell,Math.ceil(cell),Math.ceil(cell))}
function cancelSubscription(id){store.set(s=>({...s,subscriptions:s.subscriptions.map(x=>x.id===id?{...x,status:'cancelled'}:x)}));toast(t('subscriptionCancelled'));renderTickets()}

function renderProfile(){const s=state(),sub=activeSubscription();main.innerHTML=`<section class="page-header"><p class="eyebrow">GB Card</p><h1>${esc(t('profile'))}</h1></section><article class="card profile-card"><div class="profile-head"><span>DJ</span><div><h2>David J. Martínez</h2><p>GB Card Gold</p></div></div><div class="gold-card"><small>GB CARD GOLD</small><strong>2048 8361 0917</strong></div><div class="stats"><div><strong>${124+s.tickets.length}</strong><small>Reisen</small></div><div><strong>${(36000+s.tickets.length*240).toLocaleString(locale())}</strong><small>km</small></div><div><strong>${(8420+s.orders.length*230).toLocaleString(locale())}</strong><small>Punkte</small></div></div></article>${sub?`<section class="section"><div class="section-title"><h2>${esc(t('activeSubscription'))}</h2></div>${subscriptionCard(sub)}<button class="danger-button full" data-cancel-sub="${sub.id}">${esc(t('cancelSubscription'))}</button></section>`:''}<section class="section"><div class="section-title"><h2>${esc(t('paymentMethods'))}</h2></div><article class="card setting-row"><span>▰</span><div><strong>${s.savedPayment?`${esc(s.savedPayment.brand)} •••• ${esc(s.savedPayment.last4)}`:'Keine Testkarte gespeichert'}</strong><small>${esc(t('demoOnly'))}</small></div></article></section><section class="section"><div class="section-title"><h2>${esc(t('purchaseHistory'))}</h2></div><div class="order-list">${s.orders.slice(0,5).map(o=>`<article class="card order-row"><div><strong>${esc(o.description)}</strong><small>${new Date(o.date).toLocaleDateString(locale())}</small></div><b>${esc(currency(o.amount))}</b></article>`).join('')||'<p class="muted">—</p>'}</div></section><section class="section"><div class="section-title"><h2>${esc(t('settings'))}</h2></div><article class="card settings"><button id="languageSetting"><span>◎</span><div><strong>${esc(t('language'))}</strong><small>${s.language.toUpperCase()}</small></div><b>›</b></button><button id="themeSetting"><span>◐</span><div><strong>${esc(t('appearance'))}</strong><small>${esc(s.theme)}</small></div><b>›</b></button><button id="installSetting"><span>⇩</span><div><strong>${esc(t('install'))}</strong><small>PWA · ${APP_VERSION}</small></div><b>›</b></button></article></section><p class="build-note">v${APP_VERSION} · ${APP_BUILD}</p>`;
  document.getElementById('languageSetting').addEventListener('click',openLanguage);document.getElementById('themeSetting').addEventListener('click',openTheme);document.getElementById('installSetting').addEventListener('click',installApp);main.querySelector('[data-cancel-sub]')?.addEventListener('click',e=>cancelSubscription(e.currentTarget.dataset.cancelSub));
}
function openLanguage(){showModal(t('language'),`<div class="settings simple">${[['de','Deutsch'],['es','Español'],['en','English']].map(([id,name])=>`<button data-lang="${id}"><span>${esc(name)}</span><b>${state().language===id?'✓':''}</b></button>`).join('')}</div>`);modalRoot.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,language:b.dataset.lang}));setCopy();closeModal();render(routeFromHash())}))}
function openTheme(){showModal(t('appearance'),`<div class="settings simple">${['system','light','dark'].map(id=>`<button data-theme="${id}"><span>${esc(id)}</span><b>${state().theme===id?'✓':''}</b></button>`).join('')}</div>`);modalRoot.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,theme:b.dataset.theme}));applyTheme();closeModal();render(routeFromHash())}))}

function renderOperations(){main.innerHTML=`<section class="page-header"><p class="eyebrow">Leitstelle</p><h1>${esc(t('operationsTitle'))}</h1><p class="subtitle">Simulierte Echtzeitlage · ${new Date().toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}</p></section><div class="operation-summary"><article class="metric"><small>ICE</small><strong>${esc(t('normal'))}</strong><i class="ok"></i></article><article class="metric"><small>IC</small><strong>${esc(t('minor'))}</strong><i class="warn"></i></article><article class="metric"><small>RE West</small><strong>${esc(t('disrupted'))}</strong><i class="bad"></i></article><article class="metric"><small>EC México</small><strong>Kontrollen</strong><i class="warn"></i></article></div><section class="section"><div class="operation-list">${SERVICE_ALERTS.map(a=>`<article class="card operation-card ${a.severity}"><span></span><div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><div class="chips">${a.modes.map(m=>`<i>${esc(m)}</i>`).join('')}</div></div></article>`).join('')}</div></section><section class="section"><article class="card connection-demo"><h2>${esc(t('connectionRisk'))}</h2><div class="connection-times"><div><small>Ankunft</small><strong>10:16</strong></div><b>3 min</b><div><small>Abfahrt</small><strong>10:19</strong></div></div><p>IC 622 wartet nicht. ${esc(t('alternative'))}: IC 626 · 10:42.</p></article></section>`}

function renderNetwork(){
  main.innerHTML=`<section class="page-header"><p class="eyebrow">National</p><h1>${esc(t('networkMap'))}</h1></section><article class="card map-card"><svg class="rail-map" viewBox="60 10 620 500" role="img" aria-label="Galizisches Bahn Netz">${RAIL_EDGES.map(([a,b,,modes])=>{const A=getStation(a),B=getStation(b),type=modes[0];return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="rail-line ${type}"></line>`}).join('')}${STATIONS.filter(s=>s.hub||s.international||s.border).map(s=>`<g data-map-station="${s.id}" class="map-station ${s.country==='MX'?'mexico':''}"><circle class="map-hit" cx="${s.x}" cy="${s.y}" r="18"></circle><circle class="map-dot" cx="${s.x}" cy="${s.y}" r="${s.hub?8:6}"></circle><text x="${s.x+10}" y="${s.y-10}">${esc(s.city)}</text></g>`).join('')}<circle id="mapTrain" class="map-train" cx="340" cy="275" r="7"></circle></svg><div class="map-legend"><span><i class="ICE"></i>ICE</span><span><i class="IC"></i>IC</span><span><i class="RE"></i>RE</span><span><i class="EC"></i>EC México</span></div></article><section class="section"><button class="primary full" data-nav="city">${esc(t('cityTravel'))}</button></section>`;
  main.querySelectorAll('[data-map-station]').forEach(g=>g.addEventListener('click',()=>openStation(getStation(g.dataset.mapStation))));let p=0;liveTimer=setInterval(()=>{p=(p+.007)%1;const marker=document.getElementById('mapTrain');if(marker){marker.setAttribute('cx',300+(442-300)*p);marker.setAttribute('cy',282+(252-282)*p)}},100);
}
function openStation(s){showModal(t('station'),`<article><p class="eyebrow">${esc(s.id)} · ${esc(s.country)}</p><h2>${esc(s.name)}</h2><p class="muted">${esc(s.oldName)} · ${s.platforms} ${esc(t('platform'))}</p>${s.country==='MX'?federalNotice():''}<h3>Services</h3><div class="chips">${s.amenities.map(a=>`<i>${esc(a)}</i>`).join('')}</div><button class="primary full" id="stationSearch">${esc(t('search'))}</button></article>`);document.getElementById('stationSearch').addEventListener('click',()=>{store.set(st=>({...st,search:{...st.search,fromId:s.id}}));closeModal();navigate('travel')})}

function openLiveTrip(ticket){
  const path=ticket.path||['GUA','KAR','GRE','MEX'];showModal(t('live'),`<article class="live-card"><div class="journey-top"><span class="service-badge ${ticket.type}">${esc(ticket.train)}</span><span class="live-dot">● LIVE</span></div><svg class="live-svg" viewBox="0 0 600 230"><path d="M50 155 C190 45 410 45 550 155"></path>${path.slice(0,3).map((id,i)=>`<circle cx="${50+i*250}" cy="${i===1?65:155}" r="7"></circle><text x="${50+i*250}" y="${i===1?40:185}" text-anchor="middle">${esc(getStation(id)?.city||'')}</text>`).join('')}<circle id="liveTrain" class="map-train" cx="220" cy="78" r="9"></circle></svg><div class="progress"><i id="liveBar"></i></div><div class="live-stats"><div><small>Geschwindigkeit</small><strong id="liveSpeed">287 km/h</strong></div><div><small>${esc(t('nextTrip'))}</small><strong>${esc(getStation(path[1])?.city||ticket.to)}</strong></div><div><small>Ankunft</small><strong>${esc(ticket.arrival)}</strong></div></div><p class="muted">Simulierte Position und Geschwindigkeit.</p></article>`);let p=.34;stopTimers();liveTimer=setInterval(()=>{p+=.005;if(p>1)p=.05;const x=50+500*p,y=155-Math.sin(Math.PI*p)*105;document.getElementById('liveTrain')?.setAttribute('cx',x);document.getElementById('liveTrain')?.setAttribute('cy',y);const bar=document.getElementById('liveBar');if(bar)bar.style.width=`${p*100}%`;const speed=document.getElementById('liveSpeed');if(speed)speed.textContent=`${Math.round(270+Math.sin(p*10)*27)} km/h`},100)}

function showModal(title,content,closable=true){stopTimers();modalRoot.innerHTML=`<div class="modal-backdrop"><section class="modal-sheet" role="dialog" aria-modal="true"><header><h2>${esc(title)}</h2>${closable?'<button id="modalClose" type="button">×</button>':''}</header><div class="modal-content">${content}</div></section></div>`;document.getElementById('modalClose')?.addEventListener('click',()=>closeModal());modalRoot.querySelector('.modal-backdrop')?.addEventListener('click',e=>{if(closable&&e.target.classList.contains('modal-backdrop'))closeModal()})}
function closeModal(clear=true){stopTimers();if(clear)modalRoot.innerHTML=''}
async function installApp(){if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true;return}showModal(t('install'),`<article class="empty"><b>⇧</b><h2>Zum Home-Bildschirm</h2><p>In Safari: Teilen → Zum Home-Bildschirm.</p></article>`)}

function register(){
  document.querySelectorAll('.nav-button').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.route)));document.getElementById('brandButton').addEventListener('click',()=>navigate('home'));document.getElementById('avatarButton').addEventListener('click',()=>navigate('profile'));installButton.addEventListener('click',installApp);window.addEventListener('hashchange',()=>render(routeFromHash()));window.addEventListener('online',updateOnline);window.addEventListener('offline',updateOnline);window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;installButton.hidden=false});matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>{if(state().theme==='system')applyTheme()});if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(console.warn);
}
applyTheme();setCopy();updateOnline();register();if(!location.hash)history.replaceState(null,'','#/home');render(routeFromHash(),{instant:true});
