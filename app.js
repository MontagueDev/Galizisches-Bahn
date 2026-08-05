import {
  APP_VERSION, APP_BUILD, STATIONS, RAIL_EDGES, URBAN_NETWORKS,
  SUBSCRIPTIONS, FARES, SERVICE_ALERTS, COPY, getStation, getUrbanNetwork
} from './data.js';
import { createStore } from './store.js';
import { createJourneys, planUrban, addTime } from './routing.js';
import { TEST_CARDS, validatePayment, simulatePayment } from './payment.js';

const store = createStore();
const EXTRA_COPY={
  de:{navMore:'Mehr',more:'Mehr',servicesSettings:'Dienste & Einstellungen',searchTrip:'Reise suchen',currentTrip:'Aktuelle Reise',importantNotices:'Wichtige Hinweise',recentDestinations:'Letzte Ziele',noUpcomingTrip:'Keine bevorstehende Reise',borderCenter:'Grenzzentrum San Juan del Río',borderStatus:'Aktueller Grenzstatus',restricted:'Eingeschränkt',borderWait:'Voraussichtliche Kontrollzeit',mandatoryTransfer:'Verpflichtender Umstieg',borderControl:'Grenz- und Migrationskontrolle',customs:'Zoll',documents:'Reisedokumente',mexicoRB:'RB México',noDirectICE:'Kein ICE fährt direkt nach Ciudad de México.',travelWarningTitle:'Reisewarnung des Auswärtigen Amts',travelWarningBody:'Das Auswärtige Amt rät von Reisen nach Mexiko ab.',travelWarningDetail:'Für Reisen nach Mexiko gelten aufgrund des Konflikts erhöhte Sicherheits- und Grenzmaßnahmen.',continueAnyway:'Trotzdem fortfahren',openBorderCenter:'Grenzzentrum öffnen',borderProcedure:'Reiseablauf an der Grenze',outbound:'Galizien → México',inbound:'México → Galizien',domesticTrain:'Fern- oder Regionalzug',migrationFilter:'Migrationskontrolle',transferToRB:'Umstieg in den RB México',transferFromRB:'Umstieg in den galizischen Fernverkehr',bestPrice:'Bester Preis',occupancy:'Auslastung',low:'Gering',medium:'Mittel',high:'Hoch',trainComposition:'Wagenreihung',coach:'Wagen',routePlanner:'Route planen',lineNetwork:'Liniennetz',allLines:'Alle Linien',cityOverview:'Stadtverkehr auf einen Blick',nationalMap:'Nationales Netz',profileCard:'Profil & GB Card',accountPayments:'Konto, Zahlungen und Verlauf',borderAndInternational:'Grenze & internationale Reisen',borderOnlySJR:'Alle Zugreisen nach México werden ausschließlich in San Juan del Río abgefertigt.',controlTime:'Kontrolle',transferBuffer:'Umstiegszeit',openStatus:'Geöffnet mit Einschränkungen',advisory:'Reisehinweis',internationalRoute:'Internationale Verbindung',connectionThrough:'Umstieg über San Juan del Río',routeDetails:'Reiseverlauf',showComposition:'Wagen anzeigen',planner:'Planer',departuresView:'Abfahrten',mapView:'Netzplan',settingsShort:'Sprache, Darstellung und Installation',operationShort:'Störungen und Anschlüsse',networkShort:'Fernverkehr und Grenzstrecke',cityTicketsShort:'Stadttickets und Abonnements',searchDifferent:'Andere Verbindung suchen'},
  es:{navMore:'Más',more:'Más',servicesSettings:'Servicios y configuración',searchTrip:'Buscar viaje',currentTrip:'Viaje actual',importantNotices:'Avisos importantes',recentDestinations:'Destinos recientes',noUpcomingTrip:'No hay viajes próximos',borderCenter:'Centro fronterizo de San Juan del Río',borderStatus:'Estado actual de la frontera',restricted:'Restringido',borderWait:'Tiempo estimado de control',mandatoryTransfer:'Transbordo obligatorio',borderControl:'Control fronterizo y migratorio',customs:'Aduana',documents:'Documentos de viaje',mexicoRB:'RB México',noDirectICE:'Ningún ICE llega directamente a Ciudad de México.',travelWarningTitle:'Advertencia de viaje del Auswärtiges Amt',travelWarningBody:'El Ministerio de Asuntos Exteriores recomienda no viajar a México.',travelWarningDetail:'Debido al conflicto, los viajes a México están sujetos a mayores medidas de seguridad y controles fronterizos.',continueAnyway:'Continuar de todos modos',openBorderCenter:'Abrir centro fronterizo',borderProcedure:'Proceso de viaje en la frontera',outbound:'Galizia → México',inbound:'México → Galizia',domesticTrain:'Tren nacional o regional',migrationFilter:'Filtro migratorio',transferToRB:'Cambio al RB México',transferFromRB:'Cambio al tren nacional de Galizia',bestPrice:'Mejor precio',occupancy:'Ocupación',low:'Baja',medium:'Media',high:'Alta',trainComposition:'Composición del tren',coach:'Vagón',routePlanner:'Planear ruta',lineNetwork:'Mapa de líneas',allLines:'Todas las líneas',cityOverview:'Transporte urbano de un vistazo',nationalMap:'Red nacional',profileCard:'Perfil y GB Card',accountPayments:'Cuenta, pagos e historial',borderAndInternational:'Frontera y viajes internacionales',borderOnlySJR:'Todos los viajes ferroviarios a México se procesan exclusivamente en San Juan del Río.',controlTime:'Control',transferBuffer:'Tiempo de transbordo',openStatus:'Abierta con restricciones',advisory:'Advertencia de viaje',internationalRoute:'Conexión internacional',connectionThrough:'Transbordo en San Juan del Río',routeDetails:'Itinerario',showComposition:'Ver vagones',planner:'Planificador',departuresView:'Salidas',mapView:'Mapa de red',settingsShort:'Idioma, apariencia e instalación',operationShort:'Incidencias y conexiones',networkShort:'Larga distancia y ruta fronteriza',cityTicketsShort:'Boletos urbanos y suscripciones',searchDifferent:'Buscar otra conexión'},
  en:{navMore:'More',more:'More',servicesSettings:'Services & settings',searchTrip:'Find a journey',currentTrip:'Current journey',importantNotices:'Important notices',recentDestinations:'Recent destinations',noUpcomingTrip:'No upcoming journeys',borderCenter:'San Juan del Río border centre',borderStatus:'Current border status',restricted:'Restricted',borderWait:'Estimated control time',mandatoryTransfer:'Mandatory transfer',borderControl:'Border and immigration control',customs:'Customs',documents:'Travel documents',mexicoRB:'RB México',noDirectICE:'No ICE runs directly to Mexico City.',travelWarningTitle:'Travel warning from the Auswärtiges Amt',travelWarningBody:'The Foreign Office advises against travel to Mexico.',travelWarningDetail:'Because of the conflict, travel to Mexico is subject to heightened security and border measures.',continueAnyway:'Continue anyway',openBorderCenter:'Open border centre',borderProcedure:'Border journey process',outbound:'Galizia → Mexico',inbound:'Mexico → Galizia',domesticTrain:'Domestic or regional train',migrationFilter:'Immigration screening',transferToRB:'Transfer to RB México',transferFromRB:'Transfer to Galizian long-distance train',bestPrice:'Best price',occupancy:'Occupancy',low:'Low',medium:'Medium',high:'High',trainComposition:'Train composition',coach:'Coach',routePlanner:'Plan route',lineNetwork:'Line map',allLines:'All lines',cityOverview:'City transport at a glance',nationalMap:'National network',profileCard:'Profile & GB Card',accountPayments:'Account, payments and history',borderAndInternational:'Border & international travel',borderOnlySJR:'All rail journeys to Mexico are processed exclusively at San Juan del Río.',controlTime:'Control',transferBuffer:'Transfer time',openStatus:'Open with restrictions',advisory:'Travel advisory',internationalRoute:'International connection',connectionThrough:'Transfer at San Juan del Río',routeDetails:'Journey details',showComposition:'Show coaches',planner:'Planner',departuresView:'Departures',mapView:'Network map',settingsShort:'Language, appearance and installation',operationShort:'Disruptions and connections',networkShort:'Long-distance and border route',cityTicketsShort:'City tickets and subscriptions',searchDifferent:'Find another connection'}
};

const PATCH_COPY={
  de:{resumePurchase:'Kauf fortsetzen',savedPurchase:'Gespeicherter Kauf',activeTickets:'Aktive Tickets',cancelledTickets:'Stornierte Tickets',history:'Verlauf',ticketActions:'Ticket verwalten',cancelTicket:'Ticket stornieren',cancelTicketQuestion:'Dieses Ticket wirklich stornieren?',cancelTicketWarning:'Der QR-Code wird sofort ungültig. Die Erstattung richtet sich nach dem gewählten Tarif.',refund:'Erstattung',fullRefund:'Vollständige Erstattung',partialRefund:'Teilweise Erstattung',noRefund:'Keine Erstattung',ticketCancelled:'Ticket wurde storniert',qrInvalid:'QR-Code ungültig',cancellationReceipt:'Stornierungsbeleg',shareTicket:'Ticket teilen',downloadPdf:'PDF herunterladen',fullQr:'QR-Code vergrößern',repeatJourney:'Reise wiederholen',journeyDetails:'Reisedetails',favoriteRoute:'Verbindung speichern',removeFavorite:'Gespeicherte Verbindung entfernen',favorites:'Favoriten',noCancelledTickets:'Keine stornierten Tickets',noHistory:'Noch keine Vorgänge',routeSaved:'Verbindung gespeichert',routeRemoved:'Verbindung entfernt',summary:'Zusammenfassung',selectedClass:'Gewählte Klasse',included:'Inklusive',firstClassUpgrade:'Upgrade in die 1. Klasse',loungeAccess:'GB Lounge am Abfahrtsbahnhof',specialLuggage:'Sondergepäck',pet:'Haustier',firstClassIncluded:'Leistungen der 1. Klasse sind bereits enthalten.',stationBoard:'Bahnhofstafel',arrivals:'Ankünfte',notifyMe:'Benachrichtigungen aktivieren',notificationsEnabled:'Reisehinweise aktiviert',notificationTitle:'Reisehinweis',trainLength:'Zuglänge',coaches:'Wagen',sector:'Sektor',progress:'Fortschritt',timeRemaining:'Verbleibend',refundToCard:'Erstattung auf Testkarte',cancelledAt:'Storniert am',refundOrder:'Ticket-Erstattung',menu:'Weitere Aktionen',closeActions:'Aktionen schließen',classAlreadyIncluded:'1. Klasse bereits gewählt',currentSelection:'Aktuelle Auswahl',noActiveTickets:'Keine aktiven Tickets',resumeDraftText:'Deine Auswahl wurde gespeichert.',ticketStatus:'Ticketstatus',validTicket:'Gültig',cancelledTicket:'Storniert',shareCopied:'Ticketdaten kopiert',pdfCreated:'PDF wurde erstellt',notificationDeparture:'Dein Zug fährt in 20 Minuten.',notificationPlatform:'Gleisänderung: Bitte beachte die aktuelle Anzeige.',notificationBorder:'Ankunft in San Juan del Río: Bitte zur Grenzkontrolle gehen.',addFavorite:'Als Favorit speichern',removeFavoriteShort:'Favorit entfernen',frequentPassenger:'Häufiger Fahrgast',travelStats:'Reisestatistik',favoriteStation:'Meistgenutzter Bahnhof',refundFee:'10 GM Bearbeitungsgebühr',none:'Keine'},
  es:{resumePurchase:'Continuar compra',savedPurchase:'Compra guardada',activeTickets:'Boletos activos',cancelledTickets:'Boletos cancelados',history:'Historial',ticketActions:'Gestionar boleto',cancelTicket:'Cancelar boleto',cancelTicketQuestion:'¿Cancelar este boleto?',cancelTicketWarning:'El código QR dejará de ser válido inmediatamente. El reembolso depende de la tarifa elegida.',refund:'Reembolso',fullRefund:'Reembolso completo',partialRefund:'Reembolso parcial',noRefund:'Sin reembolso',ticketCancelled:'Boleto cancelado',qrInvalid:'Código QR inválido',cancellationReceipt:'Comprobante de cancelación',shareTicket:'Compartir boleto',downloadPdf:'Descargar PDF',fullQr:'Ampliar código QR',repeatJourney:'Repetir viaje',journeyDetails:'Detalles del viaje',favoriteRoute:'Guardar ruta',removeFavorite:'Eliminar ruta guardada',favorites:'Favoritos',noCancelledTickets:'No hay boletos cancelados',noHistory:'Todavía no hay movimientos',routeSaved:'Ruta guardada',routeRemoved:'Ruta eliminada',summary:'Resumen',selectedClass:'Clase seleccionada',included:'Incluido',firstClassUpgrade:'Mejora a Primera Clase',loungeAccess:'GB Lounge en la estación de salida',specialLuggage:'Equipaje especial',pet:'Mascota',firstClassIncluded:'Los beneficios de Primera Clase ya están incluidos.',stationBoard:'Tablero de estación',arrivals:'Llegadas',notifyMe:'Activar avisos',notificationsEnabled:'Avisos del viaje activados',notificationTitle:'Aviso del viaje',trainLength:'Longitud del tren',coaches:'Vagones',sector:'Sector',progress:'Progreso',timeRemaining:'Tiempo restante',refundToCard:'Reembolso a tarjeta de prueba',cancelledAt:'Cancelado el',refundOrder:'Reembolso de boleto',menu:'Más acciones',closeActions:'Cerrar acciones',classAlreadyIncluded:'Primera Clase ya seleccionada',currentSelection:'Selección actual',noActiveTickets:'No hay boletos activos',resumeDraftText:'Conservamos tu selección.',ticketStatus:'Estado del boleto',validTicket:'Válido',cancelledTicket:'Cancelado',shareCopied:'Datos del boleto copiados',pdfCreated:'PDF creado',notificationDeparture:'Tu tren sale en 20 minutos.',notificationPlatform:'Cambio de andén: consulta la información actual.',notificationBorder:'Llegaste a San Juan del Río: dirígete al control fronterizo.',addFavorite:'Guardar como favorito',removeFavoriteShort:'Eliminar favorito',frequentPassenger:'Pasajero frecuente',travelStats:'Estadísticas de viaje',favoriteStation:'Estación más utilizada',refundFee:'Cargo de gestión de 10 GM',none:'Ninguno'},
  en:{resumePurchase:'Continue purchase',savedPurchase:'Saved purchase',activeTickets:'Active tickets',cancelledTickets:'Cancelled tickets',history:'History',ticketActions:'Manage ticket',cancelTicket:'Cancel ticket',cancelTicketQuestion:'Cancel this ticket?',cancelTicketWarning:'The QR code will become invalid immediately. Any refund depends on the selected fare.',refund:'Refund',fullRefund:'Full refund',partialRefund:'Partial refund',noRefund:'No refund',ticketCancelled:'Ticket cancelled',qrInvalid:'QR code invalid',cancellationReceipt:'Cancellation receipt',shareTicket:'Share ticket',downloadPdf:'Download PDF',fullQr:'Enlarge QR code',repeatJourney:'Repeat journey',journeyDetails:'Journey details',favoriteRoute:'Save route',removeFavorite:'Remove saved route',favorites:'Favourites',noCancelledTickets:'No cancelled tickets',noHistory:'No activity yet',routeSaved:'Route saved',routeRemoved:'Route removed',summary:'Summary',selectedClass:'Selected class',included:'Included',firstClassUpgrade:'Upgrade to First Class',loungeAccess:'GB Lounge at departure station',specialLuggage:'Special luggage',pet:'Pet',firstClassIncluded:'First Class benefits are already included.',stationBoard:'Station board',arrivals:'Arrivals',notifyMe:'Enable alerts',notificationsEnabled:'Journey alerts enabled',notificationTitle:'Journey alert',trainLength:'Train length',coaches:'Coaches',sector:'Sector',progress:'Progress',timeRemaining:'Remaining',refundToCard:'Refund to test card',cancelledAt:'Cancelled on',refundOrder:'Ticket refund',menu:'More actions',closeActions:'Close actions',classAlreadyIncluded:'First Class already selected',currentSelection:'Current selection',noActiveTickets:'No active tickets',resumeDraftText:'Your selection has been saved.',ticketStatus:'Ticket status',validTicket:'Valid',cancelledTicket:'Cancelled',shareCopied:'Ticket details copied',pdfCreated:'PDF created',notificationDeparture:'Your train leaves in 20 minutes.',notificationPlatform:'Platform change: check the latest information.',notificationBorder:'You have arrived at San Juan del Río: proceed to border control.',addFavorite:'Save as favourite',removeFavoriteShort:'Remove favourite',frequentPassenger:'Frequent passenger',travelStats:'Travel statistics',favoriteStation:'Most used station',refundFee:'10 GM administration fee',none:'None'}
};

const main = document.getElementById('mainView');
const modalRoot = document.getElementById('modalRoot');
const toastRoot = document.getElementById('toastRoot');
const installButton = document.getElementById('installButton');
const onlineBadge = document.getElementById('onlineBadge');
let installPrompt = null;
let currentJourneys = [];
let selectedJourney = null;
let checkout = store.get().purchaseDraft || null;
let liveTimer = null;
let modalContext = null;
let paymentRun = 0;
let reloadingForUpdate = false;
let pendingRouteOptions = {};
let mexicoWarningOpen = false;

const state = () => store.get();
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const t = (key, vars={}) => {
  let text = PATCH_COPY[state().language]?.[key] ?? EXTRA_COPY[state().language]?.[key] ?? COPY[state().language]?.[key] ?? PATCH_COPY.de[key] ?? EXTRA_COPY.de[key] ?? COPY.de[key] ?? key;
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

const allowedRoutes=['home','travel','city','tickets','more','profile','network','operations','border'];
function routeFromHash(){const r=location.hash.replace(/^#\/?/,'').split('?')[0];return allowedRoutes.includes(r)?r:'home'}
function navigate(route,opts={}){
  if(!allowedRoutes.includes(route))route='home';
  pendingRouteOptions=opts||{};
  store.set(s=>({...s,route}));
  const hash=`#/${route}`;
  if(location.hash!==hash)location.hash=hash;
  else{const next=pendingRouteOptions;pendingRouteOptions={};render(route,next)}
}
function render(route=routeFromHash(),opts={}){
  stopTimers();closeModal();
  const navRoute=['profile','network','operations','border'].includes(route)?'more':route;
  document.querySelectorAll('.nav-button').forEach(button=>{
    const active=button.dataset.route===navRoute;
    button.classList.toggle('active',active);
    button.setAttribute('aria-current',active?'page':'false');
  });
  if(route==='home')renderHome();
  if(route==='travel')renderTravel(opts);
  if(route==='city')renderCity();
  if(route==='tickets')renderTickets();
  if(route==='more')renderMore();
  if(route==='profile')renderProfile();
  if(route==='network')renderNetwork();
  if(route==='operations')renderOperations();
  if(route==='border')renderBorder();
  bindNav(main);
  window.scrollTo({top:0,behavior:opts.instant?'auto':'smooth'});
  main.focus({preventScroll:true});
}
function bindNav(root=document){
  root.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.nav)));
}



function languageName(code){return code==='de'?'Deutsch':code==='es'?'Español':'English'}
function themeName(code){return code==='system'?t('system'):code==='light'?t('light'):t('dark')}
function persistCheckout(){
  if(checkout?.kind==='journey')normalizeCheckout();
  store.set(s=>({...s,purchaseDraft:checkout?JSON.parse(JSON.stringify(checkout)):null}));
}
function clearCheckout(){checkout=null;store.set(s=>({...s,purchaseDraft:null}));}
function effectiveClass(){return checkout?.kind==='journey'&&(checkout.journey.travelClass==='1'||checkout.extras?.upgrade)?'1':'2'}
function classLabel(value=effectiveClass()){return String(value)==='1'?t('firstClass'):t('secondClass')}
function normalizeCheckout(){
  if(!checkout||checkout.kind!=='journey')return checkout;
  checkout.extras={bike:false,upgrade:false,seatReservation:false,specialLuggage:false,pet:false,...(checkout.extras||{})};
  if(String(checkout.journey.travelClass)==='1')checkout.extras.upgrade=false;
  checkout.traveler={name:'David J. Martínez',document:'',documentsConfirmed:false,...(checkout.traveler||{})};
  checkout.paymentFields=checkout.paymentFields||{};
  return checkout;
}
function routeFavoriteId(fromId,toId,travelClass='2'){return`${fromId}-${toId}-${travelClass}`}
function isFavoriteRoute(fromId,toId,travelClass='2'){return state().favoriteRoutes.some(r=>r.id===routeFavoriteId(fromId,toId,travelClass))}
function toggleFavoriteRoute(fromId,toId,travelClass='2'){
  const id=routeFavoriteId(fromId,toId,travelClass),exists=isFavoriteRoute(fromId,toId,travelClass);
  store.set(s=>({...s,favoriteRoutes:exists?s.favoriteRoutes.filter(r=>r.id!==id):[{id,fromId,toId,travelClass},...s.favoriteRoutes]}));
  toast(exists?t('routeRemoved'):t('routeSaved'));
  return!exists;
}
function currentCheckoutTotal(){
  if(!checkout)return 0;
  if(checkout.kind!=='journey')return Number(checkout.basePrice??checkout.price??0);
  normalizeCheckout();
  const extras=checkout.extras||{};
  return Number(checkout.basePrice||0)+Number(checkout.cabinExtra||0)+(extras.bike?8:0)+(extras.upgrade?24:0)+(extras.seatReservation?6:0)+(extras.specialLuggage?12:0)+(extras.pet?9:0);
}

function capturePaymentFields(){
  if(!checkout)return;
  const ids=['payHolder','payNumber','payExpiry','payCvv','payAddress','payCountry'];
  const fields={...(checkout.paymentFields||{})};
  ids.forEach(id=>{const el=document.getElementById(id);if(el)fields[id.replace('pay','').replace(/^./,c=>c.toLowerCase())]=el.value});
  const save=document.getElementById('savePay');if(save)fields.save=save.checked;
  checkout.paymentFields=fields;persistCheckout();
}

function resumeCheckout(){
  if(!checkout)return closeModal();
  if(checkout.kind==='journey')renderCheckout();
  else renderDirectPaymentCheckout();
}

function requestCheckoutCancel(){
  if(!checkout)return closeModal();
  capturePaymentFields();
  const session=checkout.id;
  showModal(t('cancelPurchase'),`<article class="cancel-confirm"><div class="cancel-symbol">×</div><h3>${esc(t('cancelQuestion'))}</h3><p>${esc(t('resumeDraftText'))}</p><div class="cancel-actions"><button id="keepCheckout" class="primary full" type="button">${esc(t('keepBuying'))}</button><button id="saveCheckout" class="secondary full" type="button">${esc(t('savedPurchase'))}</button><button id="discardCheckout" class="danger-button full" type="button">${esc(t('discardPurchase'))}</button></div></article>`,{closable:false});
  document.getElementById('keepCheckout').addEventListener('click',()=>{if(checkout?.id===session)resumeCheckout()});
  document.getElementById('saveCheckout').addEventListener('click',()=>{if(checkout?.id!==session)return;persistCheckout();closeModal();toast(t('savedPurchase'))});
  document.getElementById('discardCheckout').addEventListener('click',()=>{paymentRun++;clearCheckout();closeModal();toast(t('purchaseCancelled'))});
}

function checkoutButtons({back=true,nextId='checkoutNext',nextText=null,nextClass='primary',disabled=false}={}){
  return `<div class="checkout-actions"><button class="cancel-action" data-cancel-checkout type="button">${esc(t('cancel'))}</button>${back?`<button class="secondary" data-checkout-back type="button">${esc(t('back'))}</button>`:''}<button id="${esc(nextId)}" class="${esc(nextClass)}" type="button" ${disabled?'disabled':''}>${esc(nextText||t('continue'))}</button></div>`;
}
function bindCheckoutShell(onBack){
  document.querySelectorAll('[data-cancel-checkout]').forEach(b=>b.addEventListener('click',requestCheckoutCancel));
  document.querySelectorAll('[data-checkout-back]').forEach(b=>b.addEventListener('click',()=>{capturePaymentFields();onBack?.()}));
}
function showUpdateBanner(registration){
  const banner=document.getElementById('updateBanner');
  if(!banner)return;
  banner.innerHTML=`<span>${esc(t('updateAvailable'))}</span><button id="applyUpdate" type="button">${esc(t('updateNow'))}</button>`;
  banner.hidden=false;
  document.getElementById('applyUpdate').addEventListener('click',()=>registration.waiting?.postMessage({type:'SKIP_WAITING'}));
}

function activeTicket(){return state().tickets.find(x=>x.id===state().activeTicketId&&x.status!=='cancelled')||state().tickets.find(x=>x.status!=='cancelled')||null}

function activeSubscription(){return state().subscriptions.find(x=>x.status==='active')||null}
function demoTrip(){return{id:'DEMO',train:'ICE 102',type:'ICE',fromId:'GUA',toId:'LOW',from:'Guadalajara Hbf',to:'Löwenstadt Hbf',date:new Date().toISOString().slice(0,10),departure:'15:15',arrival:'16:58',duration:103,delay:0,platform:'4',coach:'5',seat:'18A',path:['GUA','TEP','LAG','LOW'],price:89,occupancy:'medium'}}
function isMexicoSearch(search){return getStation(search?.fromId)?.country==='MX'||getStation(search?.toId)?.country==='MX'}
function occupancyLabel(value){return t(value||'medium')}
function occupancyBadge(value){return`<span class="occupancy ${esc(value||'medium')}"><i></i>${esc(t('occupancy'))}: ${esc(occupancyLabel(value))}</span>`}
function readSearchForm(prefix=''){
  const id=name=>document.getElementById(`${prefix}${name}`);
  return{fromId:id('From').value,toId:id('To').value,date:id('Date').value,time:id('Time').value,passengers:Number(id('Passengers')?.value||state().search.passengers||1),travelClass:id('Class')?.value||state().search.travelClass||'2'};
}
function showMexicoTravelWarning(search,onContinue){
  mexicoWarningOpen=true;
  showModal(t('travelWarningTitle'),`<article class="travel-warning"><div class="warning-seal">AA</div><p class="eyebrow">Auswärtiges Amt · Bundesrepublik Galizien</p><h2>${esc(t('travelWarningBody'))}</h2><p>${esc(t('travelWarningDetail'))}</p><div class="warning-route"><span>${esc(getStation(search.fromId).name)}</span><b>→</b><span>${esc(getStation(search.toId).name)}</span></div><div class="warning-actions"><button id="warningCancel" class="secondary" type="button">${esc(t('cancel'))}</button><button id="warningContinue" class="danger-button" type="button">${esc(t('continueAnyway'))}</button></div></article>`,{closable:false});
  document.getElementById('warningCancel').addEventListener('click',()=>{mexicoWarningOpen=false;closeModal()});
  document.getElementById('warningContinue').addEventListener('click',()=>{mexicoWarningOpen=false;closeModal();onContinue()});
}
function beginTravelSearch(search=null){
  const value=search||readSearchForm('travel');
  if(value.fromId===value.toId){toast(state().language==='es'?'El origen y el destino deben ser diferentes.':state().language==='en'?'Origin and destination must be different.':'Start und Ziel müssen verschieden sein.');return}
  if(isMexicoSearch(value)){showMexicoTravelWarning(value,()=>performTravelSearch(value));return}
  performTravelSearch(value);
}
function borderFlowCard(){return`<article class="card border-flow-card"><div class="border-flow-head"><span class="border-icon">SJR</span><div><p class="eyebrow">${esc(t('borderAndInternational'))}</p><h3>${esc(t('borderCenter'))}</h3></div><span class="border-status">${esc(t('restricted'))}</span></div><p>${esc(t('borderOnlySJR'))}</p><div class="border-flow-steps"><span>${esc(t('domesticTrain'))}</span><b>›</b><span>${esc(t('migrationFilter'))}</span><b>›</b><span>${esc(t('mexicoRB'))}</span></div><button class="link-button" data-nav="border" type="button">${esc(t('openBorderCenter'))} →</button></article>`}
function renderHome(){
  const search=state().search,trip=activeTicket(),sub=activeSubscription(),draft=state().purchaseDraft;
  const favorites=state().favoriteRoutes.slice(0,3);
  main.innerHTML=`
    <section class="page-header home-title"><p class="eyebrow">Galizische Bahn · v${APP_VERSION}</p><h1>${esc(t('greeting'))}, David.</h1><p class="subtitle">${esc(t('tagline'))}</p></section>
    ${draft?`<article class="card resume-purchase"><span>↻</span><div><small>${esc(t('savedPurchase'))}</small><strong>${esc(draft.kind==='journey'?`${draft.journey.from} → ${draft.journey.to}`:draft.product?.name||t('purchase'))}</strong><p>${esc(t('resumeDraftText'))}</p></div><button id="resumePurchase" class="primary" type="button">${esc(t('resumePurchase'))}</button></article>`:''}
    <article class="card home-search-card"><h2>${esc(t('searchTrip'))}</h2><div class="compact-route-fields"><div class="field"><label for="homeFrom">${esc(t('from'))}</label><select id="homeFrom">${stationOptions(search.fromId)}</select></div><button id="homeSwap" class="swap compact" type="button" aria-label="${esc(t('changes'))}">⇄</button><div class="field"><label for="homeTo">${esc(t('to'))}</label><select id="homeTo">${stationOptions(search.toId)}</select></div></div><div class="home-search-meta"><label><span>${esc(t('date'))}</span><input id="homeDate" type="date" value="${esc(search.date)}"></label><label><span>${esc(t('time'))}</span><input id="homeTime" type="time" value="${esc(search.time)}"></label></div><input id="homePassengers" type="hidden" value="${esc(search.passengers)}"><input id="homeClass" type="hidden" value="${esc(search.travelClass)}"><button id="homeSearch" class="primary full" type="button">${esc(t('find'))}</button></article>
    ${favorites.length?`<section class="section"><div class="section-title"><h2>${esc(t('favorites'))}</h2></div><div class="favorite-routes">${favorites.map(r=>`<button data-favorite-route="${esc(r.id)}"><span>★</span><div><strong>${esc(getStation(r.fromId)?.city)} → ${esc(getStation(r.toId)?.city)}</strong><small>${esc(classLabel(r.travelClass))}</small></div><b>›</b></button>`).join('')}</div></section>`:''}
    ${trip?`<section class="section"><div class="section-title"><h2>${esc(t('currentTrip'))}</h2><button class="link-button" data-nav="tickets">${esc(t('open'))}</button></div><article class="hero-card compact-hero"><div class="hero-head"><span class="service-badge ${esc(trip.type)}">${esc(trip.train)}</span><span class="status ${trip.delay?'warn':'ok'}">${trip.delay?`+${trip.delay} min`:esc(t('onTime'))}</span></div><div class="hero-route"><div><strong>${esc(trip.departure)}</strong><small>${esc(trip.from)}</small></div><span></span><div><strong>${esc(trip.arrival)}</strong><small>${esc(trip.to)}</small></div></div><div class="hero-foot"><span>${esc(t('platform'))} ${esc(trip.platform||4)}${trip.seat?` · ${esc(t('seat'))} ${esc(trip.seat)}`:''}</span><button class="text-on-dark" data-live="${esc(trip.id)}">${esc(t('live'))} →</button></div></article></section>`:''}
    <section class="section"><div class="section-title"><h2>${esc(t('importantNotices'))}</h2><button class="link-button" data-nav="operations">${esc(t('open'))}</button></div>${borderFlowCard()}<div class="alerts-mini home-alerts">${SERVICE_ALERTS.filter(a=>a.id!=='RB-MEX').slice(0,2).map(alertMini).join('')}</div></section>
    ${sub?`<section class="section"><div class="section-title"><h2>${esc(t('galizienTicket'))}</h2><button class="link-button" data-nav="tickets">${esc(t('open'))}</button></div>${subscriptionCard(sub)}</section>`:''}`;
  const from=document.getElementById('homeFrom'),to=document.getElementById('homeTo');
  document.getElementById('homeSwap').addEventListener('click',()=>{[from.value,to.value]=[to.value,from.value]});
  document.getElementById('homeSearch').addEventListener('click',()=>{const value=readSearchForm('home');store.set(s=>({...s,search:value}));navigate('travel',{autoSearch:true})});
  document.getElementById('resumePurchase')?.addEventListener('click',()=>{checkout=state().purchaseDraft;resumeCheckout()});
  main.querySelectorAll('[data-favorite-route]').forEach(button=>button.addEventListener('click',()=>{const route=state().favoriteRoutes.find(r=>r.id===button.dataset.favoriteRoute);if(!route)return;store.set(s=>({...s,search:{...s.search,fromId:route.fromId,toId:route.toId,travelClass:route.travelClass}}));navigate('travel',{autoSearch:true})}));
  main.querySelector('[data-live]')?.addEventListener('click',()=>openLiveTrip(trip));
}

function alertMini(a){return `<article class="alert-mini ${a.severity}"><span></span><div><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></div></article>`}
function subscriptionCard(s){return `<article class="card active-pass"><div><span class="pass-logo">G</span><div><small>${esc(t('activeSubscription'))}</small><h3>${esc(s.name)}</h3><p>${esc(t('validUntil'))}: ${esc(fmtDate(s.validUntil))}</p></div></div><strong>${esc(currency(s.price))}</strong></article>`}

function stationOptions(selected){return STATIONS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}${s.country==='MX'?' · MX':''}</option>`).join('')}
function renderTravel(opts={}){
  const s=state().search;
  main.innerHTML=`<section class="page-header"><p class="eyebrow">${esc(t('longDistance'))}</p><h1>${esc(t('searchTrip'))}</h1><p class="subtitle">ICE · IC · RE · ${esc(t('mexicoRB'))} · NightJet</p></section><article class="card search-card"><div class="field"><label for="travelFrom">${esc(t('from'))}</label><select id="travelFrom">${stationOptions(s.fromId)}</select></div><button id="swapStations" class="swap" type="button">⇅</button><div class="field"><label for="travelTo">${esc(t('to'))}</label><select id="travelTo">${stationOptions(s.toId)}</select></div><div class="field-grid"><div class="field date-field"><label for="travelDate">${esc(t('date'))}</label><span><input id="travelDate" type="date" value="${esc(s.date)}"></span></div><div class="field date-field"><label for="travelTime">${esc(t('time'))}</label><span><input id="travelTime" type="time" value="${esc(s.time)}"></span></div></div><div class="field-grid"><div class="field"><label for="travelPassengers">${esc(t('passengers'))}</label><select id="travelPassengers">${[1,2,3,4,5,6].map(n=>`<option ${n===Number(s.passengers)?'selected':''}>${n}</option>`).join('')}</select></div><div class="field"><label for="travelClass">${esc(t('travelClass'))}</label><select id="travelClass"><option value="2" ${s.travelClass==='2'?'selected':''}>${esc(t('secondClass'))}</option><option value="1" ${s.travelClass==='1'?'selected':''}>${esc(t('firstClass'))}</option></select></div></div><button id="searchJourneys" class="primary full" type="button">${esc(t('find'))}</button></article><div id="internationalBanner"></div><section id="resultsSection" class="section" hidden><div class="section-title"><h2>${esc(t('connections'))}</h2><span id="resultCount" class="muted"></span></div><div id="journeyResults" class="result-list"></div></section>`;
  const from=document.getElementById('travelFrom'),to=document.getElementById('travelTo');
  const updateBanner=()=>{document.getElementById('internationalBanner').innerHTML=(getStation(from.value)?.country==='MX'||getStation(to.value)?.country==='MX')?borderFlowCard():'';bindNav(document.getElementById('internationalBanner'))};
  from.addEventListener('change',updateBanner);to.addEventListener('change',updateBanner);updateBanner();
  document.getElementById('swapStations').addEventListener('click',()=>{[from.value,to.value]=[to.value,from.value];updateBanner()});
  document.getElementById('searchJourneys').addEventListener('click',()=>beginTravelSearch());
  if(opts.autoSearch)requestAnimationFrame(()=>beginTravelSearch());
}
function federalNotice(){return`<article class="card federal-card standalone border-notice"><span>SJR</span><div><h3>${esc(t('borderCenter'))}</h3><p>${esc(t('borderOnlySJR'))} ${esc(t('noDirectICE'))}</p><div class="chips"><i>${esc(t('documents'))}</i><i>${esc(t('borderWait'))}: 45 min</i><i>${esc(t('mandatoryTransfer'))}</i></div></div></article>`}
function performTravelSearch(search=null){
  const value=search||readSearchForm('travel');
  store.set(s=>({...s,search:value}));
  currentJourneys=createJourneys(value);
  const business=activeSubscription()?.productId==='BUSINESS';
  if(business)currentJourneys=currentJourneys.map(j=>({...j,price:Math.round(j.price*.85),businessDiscount:true}));
  renderJourneyResults();
}
function connectionLabel(j){return j.connection==='safe'?t('connectionSafe'):j.connection==='risk'?t('connectionRisk'):t('connectionMissed')}
function renderJourneyResults(){
  const section=document.getElementById('resultsSection'),list=document.getElementById('journeyResults');
  section.hidden=false;document.getElementById('resultCount').textContent=String(currentJourneys.length);
  const best=Math.min(...currentJourneys.map(j=>j.price));
  list.innerHTML=currentJourneys.map(j=>`<button class="journey-card ${j.international?'international-journey':''}" data-journey="${esc(j.id)}" type="button"><div class="journey-top"><span class="service-badge ${esc(j.type)}">${esc(j.train)}</span><span class="status ${j.delay?'warn':'ok'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span></div><div class="journey-route"><div><strong>${esc(j.departure)}</strong><small>${esc(j.from)}</small></div><span></span><div><strong>${esc(j.arrival)}</strong><small>${esc(j.to)}</small></div></div><div class="journey-facts"><span>${esc(duration(j.duration))}</span><span>${j.changes?`${j.changes} ${esc(t('changes'))}`:esc(t('direct'))}</span>${occupancyBadge(j.occupancy)}</div>${j.international?`<div class="border-route-summary"><span>${esc(t('connectionThrough'))}</span><b>${esc(t('borderWait'))}: ${j.borderMinutes} min</b><small>${esc(t('mandatoryTransfer'))} · ${esc(j.rbTrain)}</small></div>`:''}<div class="journey-bottom"><span>${j.changes?`<i class="connection-state ${esc(j.connection)}">${esc(connectionLabel(j))}</i>`:''}</span><strong>${j.price===best?`<small>${esc(t('bestPrice'))}</small>`:''}${esc(currency(j.price))}</strong></div></button>`).join('');
  list.querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>openJourney(currentJourneys.find(j=>j.id===button.dataset.journey))));
  section.scrollIntoView({behavior:'smooth'});
}
function journeyTimelineHTML(j){
  if(!j.international){return`<div class="timeline">${j.path.map((id,index)=>{const station=getStation(id);const time=addTime(j.departure,Math.round(j.duration*index/Math.max(1,j.path.length-1)));return`<div class="timeline-row"><time>${esc(time)}</time><span><i></i></span><div><strong>${esc(station.name)}</strong><small>${index===0?esc(t('departure')):index===j.path.length-1?esc(t('arrival')):esc(t('onTime'))}</small></div></div>`}).join('')}</div>`}
  return`<div class="international-timeline">${j.segments.map((segment,index)=>{const content=segment.kind==='border'?`<article class="border-process"><div class="border-process-icon">SJR</div><div><p class="eyebrow">${esc(t('borderControl'))}</p><h3>${esc(t('borderCenter'))}</h3><p>${esc(segment.start)}–${esc(segment.end)} · ${segment.minutes} min</p><div class="chips"><i>${esc(t('documents'))}</i><i>${esc(t('customs'))}</i><i>${esc(t('migrationFilter'))}</i></div></div></article>`:`<article class="segment-card"><div class="segment-head"><span class="service-badge ${esc(segment.type)}">${esc(segment.train)}</span>${occupancyBadge(segment.occupancy)}</div><div class="segment-route"><div><strong>${esc(segment.departure)}</strong><small>${esc(getStation(segment.fromId).name)}</small></div><span></span><div><strong>${esc(segment.arrival)}</strong><small>${esc(getStation(segment.toId).name)}</small></div></div>${segment.type==='RB'?`<p class="segment-note">${esc(t('mexicoRB'))} · ${esc(t('noDirectICE'))}</p>`:''}</article>`;const transfer=segment.kind==='border'&&index<j.segments.length-1?`<div class="mandatory-transfer-marker">↓ ${esc(t('mandatoryTransfer'))}</div>`:'';return content+transfer}).join('')}</div>`;
}
function compositionHTML(j){const coaches=j.composition||j.segments?.find(s=>s.kind==='train'&&s.type!=='RB')?.composition||[];return`<div class="composition-strip">${coaches.map(c=>`<div><b>${esc(c.coach)}</b><span>${esc(c.kind)}</span><i class="${esc(c.occupancy)}"></i></div>`).join('')}</div>`}
function openJourney(j){
  selectedJourney=j;
  const fares=FARES.filter(f=>!f.international||j.international);
  const favorite=isFavoriteRoute(j.fromId,j.toId,j.travelClass);
  showModal(j.international?t('internationalRoute'):t('connections'),`<article><div class="journey-top"><span class="service-badge ${esc(j.type)}">${esc(j.train)}</span><span class="status ${j.delay?'warn':'ok'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span></div>${journeyTimelineHTML(j)}${j.international?`<article class="official-advisory-inline"><strong>Auswärtiges Amt</strong><p>${esc(t('travelWarningBody'))}</p></article>${federalNotice()}`:''}<section class="detail-section"><div class="section-title"><h3>${esc(t('trainComposition'))}</h3>${occupancyBadge(j.occupancy)}</div>${compositionHTML(j)}<div class="train-facts"><span><small>${esc(t('trainLength'))}</small><strong>${(j.composition?.length||6)*27} m</strong></span><span><small>${esc(t('coaches'))}</small><strong>${j.composition?.length||6}</strong></span><span><small>${esc(t('sector'))}</small><strong>${String.fromCharCode(65+(seed(j.id)%4))}</strong></span></div></section><h3>${esc(t('fare'))}</h3><div class="fare-list">${fares.map((f,i)=>`<label class="fare-choice ${i===0?'selected':''}"><input type="radio" name="fare" value="${f.id}" ${i===0?'checked':''}><span><strong>${esc(f.name)}</strong><small>${fareDescription(f)}</small></span><b>${esc(currency(Math.round(j.price*f.factor)))}</b></label>`).join('')}</div><button id="favoriteJourney" class="favorite-toggle ${favorite?'selected':''}" type="button">${favorite?'★':'☆'} ${esc(favorite?t('removeFavoriteShort'):t('addFavorite'))}</button><div class="button-row"><button id="cancelJourneyDetail" class="secondary" type="button">${esc(t('cancel'))}</button><button id="startCheckout" class="primary" type="button">${esc(t('continue'))}</button></div></article>`,{closable:true});
  modalRoot.querySelectorAll('.fare-choice').forEach(label=>label.addEventListener('click',()=>{modalRoot.querySelectorAll('.fare-choice').forEach(x=>x.classList.remove('selected'));label.classList.add('selected')}));
  document.getElementById('favoriteJourney').addEventListener('click',event=>{const active=toggleFavoriteRoute(j.fromId,j.toId,j.travelClass);event.currentTarget.classList.toggle('selected',active);event.currentTarget.innerHTML=`${active?'★':'☆'} ${esc(active?t('removeFavoriteShort'):t('addFavorite'))}`});
  document.getElementById('cancelJourneyDetail').addEventListener('click',()=>closeModal());
  document.getElementById('startCheckout').addEventListener('click',()=>{const fareId=modalRoot.querySelector('input[name="fare"]:checked').value;startJourneyCheckout(j,FARES.find(f=>f.id===fareId))});
}

function fareDescription(f){
  const lang=state().language;
  const words={
    de:{changeYes:'Umbuchung inklusive',changeFee:'Umbuchung gegen Gebühr',changeNo:'Keine Umbuchung',refundYes:'Erstattung inklusive',refundFee:'Begrenzte Erstattung',refundNo:'Keine Erstattung',seat:'Sitzplatz inklusive'},
    es:{changeYes:'Cambios incluidos',changeFee:'Cambios con cargo',changeNo:'Sin cambios',refundYes:'Reembolso incluido',refundFee:'Reembolso limitado',refundNo:'Sin reembolso',seat:'Asiento incluido'},
    en:{changeYes:'Changes included',changeFee:'Changes for a fee',changeNo:'No changes',refundYes:'Refund included',refundFee:'Limited refund',refundNo:'No refund',seat:'Seat included'}
  }[lang]||{};
  const parts=[];parts.push(f.changeable===true?words.changeYes:f.changeable==='fee'?words.changeFee:words.changeNo);parts.push(f.refundable===true?words.refundYes:f.refundable==='fee'?words.refundFee:words.refundNo);if(f.seat)parts.push(words.seat);return parts.join(' · ')
}

function startJourneyCheckout(journey,fare){
  checkout={id:uid('CHK'),kind:'journey',journey,fare,step:journey.type==='RE'?2:1,seat:null,cabinExtra:0,extras:{bike:false,upgrade:false,seatReservation:false,specialLuggage:false,pet:false},traveler:{name:state().frequentPassengers[0]||'David J. Martínez',document:'',documentsConfirmed:false},basePrice:Math.round(journey.price*fare.factor),paymentFields:{},createdAt:new Date().toISOString()};
  normalizeCheckout();persistCheckout();renderCheckout();
}

function renderCheckout(){
  if(!checkout)return;
  normalizeCheckout();persistCheckout();
  const titles=[t('seatSelection'),t('traveler'),t('extras'),t('summary'),t('payment')];
  showModal(titles[Math.max(0,checkout.step-1)]||t('payment'),`<div class="checkout-progress five" aria-label="${esc(t('reviewOrder'))}">${[1,2,3,4,5].map(n=>`<span class="${n<=checkout.step?'active':''}">${n}</span>`).join('')}</div><div class="checkout-context"><span>${esc(checkout.journey.from)} → ${esc(checkout.journey.to)}</span><b>${esc(classLabel())}</b></div><div id="checkoutBody"></div>`,{closable:true,onRequestClose:requestCheckoutCancel,closeLabel:t('cancel')});
  if(checkout.step===1)renderSeatStep();
  if(checkout.step===2)renderTravelerStep();
  if(checkout.step===3)renderExtrasStep();
  if(checkout.step===4)renderReviewStep();
  if(checkout.step===5)renderPaymentStep();
}

function renderSeatStep(){
  const body=document.getElementById('checkoutBody');
  const night=checkout.journey.night;
  if(night){
    const options=[{id:'SEAT',name:'Sitzplatz',p:0},{id:'BERTH',name:'Liegewagen',p:34},{id:'CABIN',name:'Privatkabine',p:89}];
    if(!checkout.seat){checkout.seat='SEAT';checkout.cabinExtra=0}
    body.innerHTML=`<p class="muted">${esc(t('nightTrain'))}</p><div class="cabin-options">${options.map(x=>`<button class="cabin-option ${checkout.seat===x.id?'selected':''}" data-cabin="${x.id}" data-price="${x.p}" type="button"><strong>${esc(x.name)}</strong><small>+${x.p} GM</small></button>`).join('')}</div>${checkoutButtons({back:false,nextId:'seatNext'})}`;
    body.querySelectorAll('[data-cabin]').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-cabin]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.cabinExtra=Number(b.dataset.price);checkout.seat=b.dataset.cabin;persistCheckout()}));
  }else{
    const coach=effectiveClass()==='1'?'Wagen 1 · 1. Klasse':'Wagen 5 · '+t('quiet');
    body.innerHTML=`<div class="seat-legend"><span><i class="available"></i>${esc(t('seat'))}</span><span><i class="occupied"></i>${esc(t('occupied'))}</span><span><i class="selected"></i>${esc(t('chosen'))}</span></div><div class="coach"><div class="coach-label">${esc(coach)}</div><div class="seat-grid">${makeSeats(checkout.journey.id+effectiveClass(),checkout.seat)}</div></div><p id="seatStatus" class="muted">${checkout.seat?`${esc(t('seat'))}: ${esc(checkout.seat)}`:esc(t('seatSelection'))}</p>${checkoutButtons({back:false,nextId:'seatNext',disabled:!checkout.seat})}`;
    body.querySelectorAll('[data-seat]:not(.occupied)').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-seat]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.seat=b.dataset.seat;document.getElementById('seatStatus').textContent=`${t('seat')}: ${checkout.seat}`;document.getElementById('seatNext').disabled=false;persistCheckout()}));
  }
  bindCheckoutShell();
  document.getElementById('seatNext').addEventListener('click',()=>{checkout.step=2;persistCheckout();renderCheckout()});
}

function makeSeats(id,selected=null){let html='';for(let row=11;row<=18;row++){for(const letter of ['A','B','C','D']){const code=`${row}${letter}`,occupied=seed(id+code)%5===0;html+=`<button type="button" data-seat="${code}" class="seat ${occupied?'occupied':''} ${selected===code?'selected':''}" ${occupied?'disabled':''}>${code}</button>`}if(row===14)html+='<div class="table-label">Tisch</div>'}return html}
function renderTravelerStep(){
  const body=document.getElementById('checkoutBody');
  body.innerHTML=`<div class="field"><label for="travelerName">${esc(t('traveler'))}</label><input id="travelerName" list="frequentPassengers" value="${esc(checkout.traveler.name)}"><datalist id="frequentPassengers">${state().frequentPassengers.map(name=>`<option value="${esc(name)}">`).join('')}</datalist></div>${checkout.journey.international?`${federalNotice()}<div class="field"><label for="documentNumber">${esc(t('passportDemo'))}</label><input id="documentNumber" placeholder="GZ1234567" maxlength="12" value="${esc(checkout.traveler.document||'')}"></div><label class="check-row"><input id="documentsConfirmed" type="checkbox" ${checkout.traveler.documentsConfirmed?'checked':''}><span>${esc(t('documentsConfirm'))}</span></label>`:''}${checkoutButtons({back:checkout.journey.type!=='RE',nextId:'travNext'})}`;
  bindCheckoutShell(()=>{checkout.step=1;persistCheckout();renderCheckout()});
  document.getElementById('travNext').addEventListener('click',()=>{const name=document.getElementById('travelerName').value.trim();if(name.length<3){toast(t('nameRequired'));return}const confirmed=document.getElementById('documentsConfirmed')?.checked||false;if(checkout.journey.international&&!confirmed){toast(t('passportRequired'));return}checkout.traveler={name,document:document.getElementById('documentNumber')?.value||'',documentsConfirmed:confirmed};if(!state().frequentPassengers.includes(name))store.set(s=>({...s,frequentPassengers:[name,...s.frequentPassengers].slice(0,6)}));checkout.step=3;persistCheckout();renderCheckout()});
}

function renderExtrasStep(){
  const b=document.getElementById('checkoutBody');
  normalizeCheckout();const e=checkout.extras||{},first=String(checkout.journey.travelClass)==='1';
  b.innerHTML=`${first?`<article class="included-class"><span>1</span><div><strong>${esc(t('classAlreadyIncluded'))}</strong><p>${esc(t('firstClassIncluded'))}</p></div></article>`:''}<div class="extras-list"><label class="extra-row"><input id="seatReservation" type="checkbox" ${checkout.seat?'checked disabled':e.seatReservation?'checked':''}><span><strong>${esc(t('seatReservation'))}</strong><small>${checkout.seat?esc(checkout.seat):'+ 6 GM'}</small></span></label><label class="extra-row"><input id="bikeExtra" type="checkbox" ${e.bike?'checked':''}><span><strong>${esc(t('bike'))}</strong><small>+ 8 GM</small></span></label>${!first?`<label class="extra-row"><input id="classUpgrade" type="checkbox" ${e.upgrade?'checked':''}><span><strong>${esc(t('firstClassUpgrade'))}</strong><small>+ 24 GM</small></span></label>`:''}<label class="extra-row"><input id="luggageExtra" type="checkbox" ${e.specialLuggage?'checked':''}><span><strong>${esc(t('specialLuggage'))}</strong><small>+ 12 GM</small></span></label><label class="extra-row"><input id="petExtra" type="checkbox" ${e.pet?'checked':''}><span><strong>${esc(t('pet'))}</strong><small>+ 9 GM</small></span></label>${effectiveClass()==='1'?`<div class="included-extra"><span>✓</span><div><strong>${esc(t('loungeAccess'))}</strong><small>${esc(t('included'))}</small></div></div>`:''}</div><div class="summary-card"><span>${esc(t('subtotal'))}</span><strong id="extraTotal">${esc(currency(currentCheckoutTotal()))}</strong></div>${checkoutButtons({back:true,nextId:'extraNext'})}`;
  const update=()=>{checkout.extras={...checkout.extras,bike:document.getElementById('bikeExtra').checked,upgrade:first?false:document.getElementById('classUpgrade')?.checked||false,seatReservation:!checkout.seat&&document.getElementById('seatReservation').checked,specialLuggage:document.getElementById('luggageExtra').checked,pet:document.getElementById('petExtra').checked};checkout.price=currentCheckoutTotal();document.getElementById('extraTotal').textContent=currency(checkout.price);persistCheckout()};
  ['bikeExtra','classUpgrade','seatReservation','luggageExtra','petExtra'].forEach(id=>document.getElementById(id)?.addEventListener('change',update));
  bindCheckoutShell(()=>{checkout.step=2;persistCheckout();renderCheckout()});
  document.getElementById('extraNext').addEventListener('click',()=>{update();checkout.step=4;persistCheckout();renderCheckout()});
}

function renderReviewStep(){
  const b=document.getElementById('checkoutBody'),e=checkout.extras||{};
  const extras=[checkout.seat?`${t('seat')}: ${checkout.seat}`:null,e.bike?t('bike'):null,e.upgrade?t('firstClassUpgrade'):null,e.specialLuggage?t('specialLuggage'):null,e.pet?t('pet'):null].filter(Boolean);
  b.innerHTML=`<article class="checkout-review"><div class="review-route"><span class="service-badge ${esc(checkout.journey.type)}">${esc(checkout.journey.train)}</span><div><strong>${esc(checkout.journey.from)} → ${esc(checkout.journey.to)}</strong><small>${esc(fmtDate(checkout.journey.date))} · ${esc(checkout.journey.departure)}–${esc(checkout.journey.arrival)}</small></div></div><dl><div><dt>${esc(t('traveler'))}</dt><dd>${esc(checkout.traveler.name)}</dd></div><div><dt>${esc(t('fare'))}</dt><dd>${esc(checkout.fare.name)}</dd></div><div><dt>${esc(t('selectedClass'))}</dt><dd>${esc(classLabel())}</dd></div><div><dt>${esc(t('extras'))}</dt><dd>${esc(extras.join(' · ')||t('none'))}</dd></div>${checkout.journey.international?`<div><dt>${esc(t('borderControl'))}</dt><dd>San Juan del Río · ${checkout.journey.borderMinutes} min</dd></div>`:''}</dl><div class="review-total"><span>${esc(t('price'))}</span><strong>${esc(currency(currentCheckoutTotal()))}</strong></div></article>${checkoutButtons({back:true,nextId:'reviewNext',nextText:t('continue')})}`;
  bindCheckoutShell(()=>{checkout.step=3;persistCheckout();renderCheckout()});
  document.getElementById('reviewNext').addEventListener('click',()=>{checkout.step=5;persistCheckout();renderCheckout()});
}
function renderPaymentStep(){
  const b=document.getElementById('checkoutBody');
  checkout.price=currentCheckoutTotal();persistCheckout();
  b.innerHTML=`<article class="review-strip"><span>${esc(t('reviewOrder'))}</span><strong>${esc(currency(checkout.price))}</strong></article>${paymentForm(checkout.price)}${checkoutButtons({back:true,nextId:'payButton',nextText:`${t('pay')} · ${currency(checkout.price)}`})}`;
  bindCheckoutShell(()=>{capturePaymentFields();checkout.step=4;persistCheckout();renderCheckout()});
  bindPaymentForm(async result=>{if(!result.ok)return;finalizeJourney(result)});
}

function renderDirectPaymentCheckout(){
  if(!checkout)return;
  const summary=checkout.kind==='subscription'?`<article class="subscription-summary"><span class="pass-logo">G</span><div><h3>${esc(checkout.product.name)}</h3><p>${esc(t('validLocal'))}</p></div><strong>${esc(currency(checkout.price))}</strong></article>`:`<article class="subscription-summary"><span class="pass-logo">▦</span><div><h3>${esc(checkout.product.name)}</h3><p>${esc(checkout.product.network)}</p></div><strong>${esc(currency(checkout.price))}</strong></article>`;
  showModal(t('payment'),`${summary}<div id="checkoutBody">${paymentForm(checkout.price)}${checkoutButtons({back:true,nextId:'payButton',nextText:`${t('pay')} · ${currency(checkout.price)}`})}</div>`,{closable:true,onRequestClose:requestCheckoutCancel,closeLabel:t('cancel')});
  bindCheckoutShell(()=>{capturePaymentFields();const kind=checkout.kind;clearCheckout();closeModal();if(kind==='subscription')openSubscriptions();else navigate('city')});
  bindPaymentForm(result=>{if(!result.ok)return;if(checkout.kind==='subscription')finalizeSubscription(result);else finalizeLocalTicket(result)});
}
function finalizeSubscription(result){
  const product=checkout.product;const start=new Date(),end=new Date(start);end.setMonth(end.getMonth()+1);const sub={id:uid('GBA'),productId:product.id,name:product.name,price:product.price,status:'active',startedAt:start.toISOString(),validUntil:end.toISOString().slice(0,10),renewal:end.toISOString().slice(0,10),payment:{brand:result.card.brand,last4:result.last4}};
  store.set(s=>({...s,purchaseDraft:null,subscriptions:[sub,...s.subscriptions.map(x=>({...x,status:'replaced'}))],orders:[{id:result.authorization,type:'subscription',description:product.name,amount:product.price,date:new Date().toISOString()},...s.orders]}));paymentRun++;checkout=null;closeModal();toast(t('approved'));navigate('tickets');
}

function finalizeLocalTicket(result){
  const {type,name,network,routeData}=checkout.product;const validUntil=type==='day'?new Date(Date.now()+18*3600000).toISOString():new Date(Date.now()+90*60000).toISOString();const ticket={id:uid('GBU'),kind:'urban',name,network,price:checkout.price,status:'active',qrValid:true,validFrom:new Date().toISOString(),validUntil,route:routeData,payment:{brand:result.card.brand,last4:result.last4,authorization:result.authorization}};
  store.set(s=>({...s,purchaseDraft:null,tickets:[ticket,...s.tickets],orders:[{id:result.authorization,type:'urban',description:`${ticket.name} · ${network}`,amount:ticket.price,date:new Date().toISOString()},...s.orders]}));paymentRun++;checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets');
}

function paymentForm(price){
  const f=checkout?.paymentFields||{};
  return `<article class="demo-payment"><strong>DEMO</strong><p>${esc(t('demoPayment'))}</p></article><div class="order-total"><span>${esc(t('payment'))}</span><strong>${esc(currency(price))}</strong></div><div class="field"><label for="payHolder">${esc(t('cardholder'))}</label><input id="payHolder" autocomplete="off" value="${esc(f.holder||'David J. Martínez')}"></div><div class="field"><label for="payNumber">${esc(t('cardNumber'))}</label><input id="payNumber" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242" value="${esc(f.number||'')}"><small>${esc(t('cardHelp'))}</small></div><div class="field-grid"><div class="field"><label for="payExpiry">${esc(t('expiry'))}</label><input id="payExpiry" inputmode="numeric" placeholder="12/30" value="${esc(f.expiry||'')}"></div><div class="field"><label for="payCvv">${esc(t('cvv'))}</label><input id="payCvv" inputmode="numeric" placeholder="123" maxlength="4" value="${esc(f.cvv||'')}"></div></div><div class="field"><label for="payAddress">${esc(t('billingAddress'))}</label><input id="payAddress" value="${esc(f.address||'Musterstraße 12, Guadalajara')}"></div><div class="field"><label for="payCountry">${esc(t('country'))}</label><select id="payCountry"><option value="GL" ${(f.country||'GL')==='GL'?'selected':''}>Galizien</option><option value="MX" ${f.country==='MX'?'selected':''}>México</option><option value="DE" ${f.country==='DE'?'selected':''}>Deutschland</option></select></div><label class="check-row"><input id="savePay" type="checkbox" ${f.save?'checked':''}><span>${esc(t('saveTestCard'))}</span></label><div id="paymentProgress" class="payment-progress" hidden aria-live="polite"></div>`;
}
function bindPaymentForm(onSuccess){
  const number=document.getElementById('payNumber');
  number.addEventListener('input',()=>{number.value=number.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();capturePaymentFields()});
  document.getElementById('payExpiry').addEventListener('input',e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);e.target.value=v;capturePaymentFields()});
  ['payHolder','payCvv','payAddress','payCountry','savePay'].forEach(id=>document.getElementById(id)?.addEventListener('input',capturePaymentFields));
  const payButton=document.getElementById('payButton');
  payButton.addEventListener('click',async()=>{
    capturePaymentFields();
    const fields={holder:document.getElementById('payHolder').value,number:number.value,expiry:document.getElementById('payExpiry').value,cvv:document.getElementById('payCvv').value,address:document.getElementById('payAddress').value,country:document.getElementById('payCountry').value};
    const v=validatePayment(fields);document.querySelectorAll('.invalid').forEach(x=>x.classList.remove('invalid'));
    if(!v.ok){for(const id of Object.keys(v.errors)){document.getElementById('pay'+id[0].toUpperCase()+id.slice(1))?.classList.add('invalid')}toast(t('demoPayment'));return}
    const progress=document.getElementById('paymentProgress');progress.hidden=false;payButton.disabled=true;
    document.querySelectorAll('[data-checkout-back],[data-cancel-checkout],#modalClose').forEach(b=>b.disabled=true);
    const run=++paymentRun;const checkoutId=checkout?.id;
    const result=await simulatePayment(fields,step=>{if(run!==paymentRun)return;progress.textContent=step==='processing'?t('processing'):step==='bank'?t('contactingBank'):t('secureCheck')});
    if(run!==paymentRun||checkout?.id!==checkoutId)return;
    document.querySelectorAll('[data-checkout-back],[data-cancel-checkout],#modalClose').forEach(b=>b.disabled=false);
    if(!result.ok){progress.textContent=t('declined');progress.className='payment-progress error';payButton.disabled=false;return}
    progress.textContent=t('approved');progress.className='payment-progress success';
    if(document.getElementById('savePay').checked)store.set(s=>({...s,savedPayment:{brand:result.card.brand,last4:result.last4}}));
    setTimeout(()=>{if(run===paymentRun&&checkout?.id===checkoutId)onSuccess(result)},550);
  });
}
function finalizeJourney(payment){
  const j=checkout.journey;checkout.price=currentCheckoutTotal();normalizeCheckout();
  const ticket={...j,id:uid('GBT'),status:'active',qrValid:true,fare:checkout.fare.name,fareId:checkout.fare.id,refundability:checkout.fare.refundable,changeability:checkout.fare.changeable,travelClass:effectiveClass(),price:checkout.price,coach:j.night?'NJ':effectiveClass()==='1'?'1':String(2+seed(j.id)%7),seat:checkout.seat||'Ohne Reservierung',passenger:checkout.traveler.name,document:checkout.traveler.document,extras:checkout.extras,payment:{brand:payment.card.brand,last4:payment.last4,authorization:payment.authorization},bookedAt:new Date().toISOString()};
  store.set(s=>({...s,purchaseDraft:null,tickets:[ticket,...s.tickets],orders:[{id:payment.authorization,type:'ticket',description:`${j.train} ${j.from} – ${j.to}`,amount:checkout.price,date:new Date().toISOString()},...s.orders],activeTicketId:ticket.id}));paymentRun++;checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets');
}

function renderCity(){
  const urban=state().urban,network=getUrbanNetwork(urban.cityId),view=state().ui.cityView||'planner',mode=state().ui.cityMode||'all',cityFavorite=state().favoriteCities.includes(network.id);
  const filteredLines=mode==='all'?network.lines:network.lines.filter(line=>line.mode===mode);
  let content='';
  if(view==='planner')content=`<article class="card urban-planner"><h2>${esc(t('routePlanner'))}</h2><div class="field"><label for="urbanFrom">${esc(t('from'))}</label><select id="urbanFrom">${network.stops.map(stop=>`<option ${stop===urban.from?'selected':''}>${esc(stop)}</option>`).join('')}</select></div><div class="field"><label for="urbanTo">${esc(t('to'))}</label><select id="urbanTo">${network.stops.map(stop=>`<option ${stop===urban.to?'selected':''}>${esc(stop)}</option>`).join('')}</select></div><button id="urbanSearch" class="primary full">${esc(t('find'))}</button><div id="urbanResult"></div></article>`;
  if(view==='departures')content=`<section><div class="section-title"><h2>${esc(t('departures'))}</h2><span class="live-dot">● LIVE</span></div><div class="departure-board">${urbanDepartures(network,mode)}</div><div class="line-list city-line-list">${filteredLines.map(urbanLineCard).join('')}</div></section>`;
  if(view==='map')content=`<article class="card urban-network-card"><div class="urban-map-scroll">${urbanNetworkMap(network,mode)}</div></article><div class="line-list city-line-list">${filteredLines.map(urbanLineCard).join('')}</div>`;
  main.innerHTML=`<section class="page-header city-header"><div><p class="eyebrow">${esc(t('urban'))}</p><h1>${esc(t('cityTravel'))}</h1><p class="subtitle">${esc(t('cityOverview'))}</p></div><button id="favoriteCity" class="favorite-icon ${cityFavorite?'selected':''}" type="button" aria-label="${esc(cityFavorite?t('removeFavoriteShort'):t('addFavorite'))}">${cityFavorite?'★':'☆'}</button></section><div class="field city-picker"><label for="urbanCity">Stadt / Metropolregion</label><select id="urbanCity">${URBAN_NETWORKS.map(n=>`<option value="${n.id}" ${n.id===network.id?'selected':''}>${esc(n.name)} (${esc(n.oldName)})</option>`).join('')}</select></div><div class="city-action-tabs"><button data-city-view="planner" class="${view==='planner'?'active':''}"><b>⌕</b><span>${esc(t('planner'))}</span></button><button data-city-view="departures" class="${view==='departures'?'active':''}"><b>◷</b><span>${esc(t('departuresView'))}</span></button><button data-city-view="map" class="${view==='map'?'active':''}"><b>⌘</b><span>${esc(t('mapView'))}</span></button></div>${view!=='planner'?`<div class="mode-tabs compact-tabs"><button data-city-mode="all" class="${mode==='all'?'active':''}">${esc(t('allLines'))}</button><button data-city-mode="U" class="${mode==='U'?'active':''}">U-Bahn</button><button data-city-mode="S" class="${mode==='S'?'active':''}">S-Bahn</button></div>`:''}<section class="section city-content">${content}</section><section class="section"><div class="section-title"><h2>${esc(t('urbanTickets'))}</h2><button class="link-button" id="openSubscriptions">${esc(t('subscriptions'))}</button></div><div class="urban-products"><button data-local-ticket="single"><span><strong>${esc(t('singleTicket'))}</strong><small>90 min · Stadtgebiet</small></span><b>4 GM</b></button><button data-local-ticket="day"><span><strong>${esc(t('dayTicket'))}</strong><small>Bis Betriebsschluss</small></span><b>14 GM</b></button></div></section>`;
  document.getElementById('favoriteCity').addEventListener('click',()=>{const exists=state().favoriteCities.includes(network.id);store.set(s=>({...s,favoriteCities:exists?s.favoriteCities.filter(id=>id!==network.id):[network.id,...s.favoriteCities]}));toast(exists?t('routeRemoved'):t('routeSaved'));renderCity()});
  document.getElementById('urbanCity').addEventListener('change',event=>{const n=getUrbanNetwork(event.target.value);store.set(s=>({...s,urban:{...s.urban,cityId:n.id,from:n.stops[0],to:n.stops.at(-1)}}));renderCity()});
  main.querySelectorAll('[data-city-view]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,cityView:button.dataset.cityView}}));renderCity()}));
  main.querySelectorAll('[data-city-mode]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,cityMode:button.dataset.cityMode}}));renderCity()}));
  document.getElementById('urbanSearch')?.addEventListener('click',performUrbanSearch);
  document.getElementById('openSubscriptions').addEventListener('click',openSubscriptions);
  main.querySelectorAll('[data-local-ticket]').forEach(button=>button.addEventListener('click',()=>startLocalTicketCheckout(button.dataset.localTicket,network)));
  main.querySelectorAll('[data-line]').forEach(button=>button.addEventListener('click',()=>openUrbanLine(network,button.dataset.line)));
}

function urbanNetworkMap(network,mode='all'){
  const lines=mode==='all'?network.lines:network.lines.filter(line=>line.mode===mode),width=760,row=92,height=Math.max(180,lines.length*row+40);
  const shorten=value=>value.length>16?`${value.slice(0,15)}…`:value;
  return`<svg class="urban-schematic" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(network.name)} ${esc(t('lineNetwork'))}">${lines.map((line,index)=>{const y=55+index*row,start=105,end=710,span=Math.max(1,line.stops.length-1);return`<g class="urban-map-line" data-line="${esc(line.id)}"><rect x="15" y="${y-22}" width="58" height="38" rx="12" fill="${esc(line.color)}"></rect><text x="44" y="${y+3}" text-anchor="middle" class="line-label">${esc(line.id)}</text><line x1="${start}" y1="${y}" x2="${end}" y2="${y}" stroke="${esc(line.color)}" stroke-width="10" stroke-linecap="round"></line>${line.stops.map((stop,i)=>{const x=start+(end-start)*(i/span),above=i%2===0;return`<circle cx="${x}" cy="${y}" r="8" class="urban-stop" stroke="${esc(line.color)}"></circle><text x="${x}" y="${above?y-17:y+30}" text-anchor="middle" class="stop-label"><title>${esc(stop)}</title>${esc(shorten(stop))}</text>`}).join('')}</g>`}).join('')}</svg>`;
}
function urbanDepartures(network,mode){const now=new Date(),lines=mode==='all'?network.lines:network.lines.filter(line=>line.mode===mode);return lines.slice(0,8).map((line,index)=>{const mins=2+index*3,time=new Date(now.getTime()+mins*60000).toTimeString().slice(0,5);return`<div class="departure-row"><time>${time}</time><span class="line-pill" style="--line:${line.color}">${esc(line.id)}</span><div><strong>${esc(line.stops.at(-1))}</strong><small>in ${mins} ${esc(t('minutes'))} · ${esc(t('onTime'))}</small></div><b>${esc(t('platform'))} ${1+index%4}</b></div>`}).join('')}
function urbanLineCard(l){return `<button data-line="${l.id}" class="urban-line"><span class="line-pill" style="--line:${l.color}">${esc(l.id)}</span><span><strong>${esc(l.stops[0])} ↔ ${esc(l.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${l.minutes} ${esc(t('minutes'))} · ${l.stops.length} Stationen</small></span><b>›</b></button>`}
function performUrbanSearch(){const n=getUrbanNetwork(state().urban.cityId),from=document.getElementById('urbanFrom').value,to=document.getElementById('urbanTo').value;store.set(s=>({...s,urban:{...s.urban,from,to}}));const route=planUrban(n,from,to),target=document.getElementById('urbanResult');if(!route){target.innerHTML=`<p class="error-text">${esc(t('noRoute'))}</p>`;return}target.innerHTML=`<article class="urban-result"><div class="urban-summary"><strong>${esc(duration(route.minutes))}</strong><span>${route.changes} ${esc(t('changes'))}</span></div>${route.steps.map((s,i)=>`<div class="urban-step"><span class="line-pill" style="--line:${s.color}">${esc(s.lineId)}</span><div><strong>${esc(s.from)} → ${esc(s.to)}</strong><small>${s.stops} Stationen · ${s.minutes} min</small></div></div>${i<route.steps.length-1?`<div class="transfer">${esc(t('changes'))} · 6 min</div>`:''}`).join('')}<button id="buyUrbanRoute" class="primary full">${esc(t('buyTicket'))} · 4 GM</button></article>`;document.getElementById('buyUrbanRoute').addEventListener('click',()=>startLocalTicketCheckout('single',n,{from,to,route}))}
function openUrbanLine(network,lineId){const line=network.lines.find(x=>x.id===lineId);showModal(`${line.id} · ${network.name}`,`<div class="line-detail"><div class="line-header"><span class="line-pill big" style="--line:${line.color}">${esc(line.id)}</span><div><strong>${esc(line.stops[0])} ↔ ${esc(line.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${line.minutes} min</small></div></div><div class="single-line-map"><span style="--line:${line.color}"></span>${line.stops.map(stop=>`<div><i style="--line:${line.color}"></i><small>${esc(stop)}</small></div>`).join('')}</div><div class="urban-timeline">${line.stops.map((stop,index)=>`<div><span></span><strong>${esc(stop)}</strong><small>${addTime(new Date().toTimeString().slice(0,5),index*3)}</small></div>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="lineClose" type="button">${esc(t('close'))}</button></div>`,{closable:true});document.getElementById('lineClose').addEventListener('click',()=>closeModal())}
function startLocalTicketCheckout(type,network,routeData=null){checkout={id:uid('CHK'),kind:'local',product:{type,name:type==='day'?t('dayTicket'):t('singleTicket'),price:type==='day'?14:4,network:network.name,routeData},basePrice:type==='day'?14:4,price:type==='day'?14:4,step:4,paymentFields:{},origin:'city'};persistCheckout();renderDirectPaymentCheckout()}
function openSubscriptions(){
  showModal(t('subscriptions'),`<div class="subscription-list">${SUBSCRIPTIONS.map(p=>`<article class="subscription-option"><div class="subscription-head"><div><h3>${esc(p.name)}</h3><p>${esc(p.eligibility)}</p></div><strong>${p.price} GM<small>${esc(t('monthly'))}</small></strong></div><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join('')}</ul><p class="warning-copy">${esc(t('notLongDistance'))}</p><p class="warning-copy">${esc(t('mexicoLimit'))}</p><button class="primary full" data-subscribe="${p.id}">${esc(t('subscribe'))}</button></article>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="closeSubscriptions" type="button">${esc(t('cancel'))}</button>`,{closable:true});
  modalRoot.querySelectorAll('[data-subscribe]').forEach(b=>b.addEventListener('click',()=>startSubscriptionCheckout(SUBSCRIPTIONS.find(p=>p.id===b.dataset.subscribe))));
  document.getElementById('closeSubscriptions').addEventListener('click',()=>closeModal());
}
function startSubscriptionCheckout(product){checkout={id:uid('CHK'),kind:'subscription',product,basePrice:product.price,price:product.price,step:4,paymentFields:{},origin:'subscriptions'};persistCheckout();renderDirectPaymentCheckout()}
function renderTickets(){
  const tab=state().ui.ticketTab||'active',active=state().tickets.filter(x=>x.status!=='cancelled'),cancelled=state().tickets.filter(x=>x.status==='cancelled'),subs=state().subscriptions.filter(s=>s.status==='active');
  let content='';
  if(tab==='active')content=active.length?`<div class="ticket-list">${active.map(ticketCard).join('')}</div>`:`<article class="card empty"><b>▣</b><h2>${esc(t('noActiveTickets'))}</h2><p>${esc(t('noTicketsText'))}</p><button class="primary" data-nav="travel">${esc(t('search'))}</button></article>`;
  if(tab==='subscriptions')content=subs.length?`<div class="subscription-list">${subs.map(subscriptionCard).join('')}</div>`:`<article class="card empty"><b>G</b><h2>${esc(t('galizienTicket'))}</h2><button class="primary" id="ticketSubscribe">${esc(t('subscribe'))}</button></article>`;
  if(tab==='cancelled')content=cancelled.length?`<div class="ticket-list cancelled-list">${cancelled.map(ticketCard).join('')}</div>`:`<article class="card empty"><b>×</b><h2>${esc(t('noCancelledTickets'))}</h2></article>`;
  if(tab==='history')content=state().orders.length?`<div class="order-list">${state().orders.map(o=>`<article class="card order-row ${o.amount<0?'refund-row':''}"><div><strong>${esc(o.description)}</strong><small>${new Date(o.date).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</small></div><b>${o.amount<0?'−':''}${esc(currency(Math.abs(o.amount)))}</b></article>`).join('')}</div>`:`<article class="card empty"><b>≡</b><h2>${esc(t('noHistory'))}</h2></article>`;
  main.innerHTML=`<section class="page-header"><p class="eyebrow">Wallet</p><h1>${esc(t('tickets'))}</h1></section><div class="mode-tabs ticket-tabs"><button data-ticket-tab="active" class="${tab==='active'?'active':''}">${esc(t('activeTickets'))}<i>${active.length}</i></button><button data-ticket-tab="subscriptions" class="${tab==='subscriptions'?'active':''}">${esc(t('subscriptions'))}<i>${subs.length}</i></button><button data-ticket-tab="cancelled" class="${tab==='cancelled'?'active':''}">${esc(t('cancelledTickets'))}<i>${cancelled.length}</i></button><button data-ticket-tab="history" class="${tab==='history'?'active':''}">${esc(t('history'))}</button></div>${content}`;
  main.querySelectorAll('[data-ticket-tab]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,ticketTab:b.dataset.ticketTab}}));renderTickets()}));
  main.querySelectorAll('[data-ticket-id]').forEach(b=>b.addEventListener('click',()=>openTicket(state().tickets.find(x=>x.id===b.dataset.ticketId))));
  document.getElementById('ticketSubscribe')?.addEventListener('click',openSubscriptions);
  main.querySelectorAll('[data-cancel-sub]').forEach(b=>b.addEventListener('click',()=>cancelSubscription(b.dataset.cancelSub)));
}

function ticketCard(x){
  const cancelled=x.status==='cancelled';
  if(x.kind==='urban')return `<button class="ticket-summary urban ${cancelled?'cancelled':''}" data-ticket-id="${x.id}"><div><span class="service-badge S">STADT</span><h3>${esc(x.name)}</h3><p>${esc(x.network)}</p></div><div><strong>${cancelled?esc(t('cancelledTicket')):esc(currency(x.price))}</strong><small>${cancelled?`${esc(t('refund'))}: ${esc(currency(x.refundAmount||0))}`:`${esc(t('validUntil'))}: ${new Date(x.validUntil).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}`}</small></div></button>`;
  return `<button class="ticket-summary ${cancelled?'cancelled':''}" data-ticket-id="${x.id}"><div><span class="service-badge ${x.type}">${esc(x.train)}</span><h3>${esc(x.from)} → ${esc(x.to)}</h3><p>${esc(fmtDate(x.date))} · ${esc(x.departure)} · ${esc(classLabel(x.travelClass))}</p></div><div><strong>${cancelled?esc(t('cancelledTicket')):esc(currency(x.price))}</strong><small>${cancelled?`${esc(t('refund'))}: ${esc(currency(x.refundAmount||0))}`:`${esc(t('seat'))} ${esc(x.seat)}`}</small></div></button>`
}

function openTicket(x){
  if(!x)return;
  const cancelled=x.status==='cancelled';
  if(x.kind==='urban'){
    showModal(t('tickets'),`<article class="digital-ticket urban-ticket ${cancelled?'cancelled-ticket-view':''}"><div class="ticket-brand">GALIZISCHE BAHN · STADT</div><h2>${esc(x.name)}</h2><p>${esc(x.network)}</p><div class="ticket-status ${cancelled?'bad':'good'}">${esc(cancelled?t('cancelledTicket'):t('validTicket'))}</div><div class="ticket-valid"><small>${esc(cancelled?t('cancelledAt'):t('validUntil'))}</small><strong>${new Date(cancelled?x.cancelledAt:x.validUntil).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</strong></div><div class="security-animation ${cancelled?'invalid':''}"></div><canvas id="ticketQR" width="210" height="210" class="${cancelled?'invalid-qr':''}"></canvas><code>${esc(x.id)}</code>${cancelled?`<p class="invalid-caption">${esc(t('qrInvalid'))}</p>`:''}<div class="ticket-primary-actions"><button class="secondary" id="ticketClose" type="button">${esc(t('close'))}</button><button class="primary" id="ticketActions" type="button">${esc(t('ticketActions'))}</button></div></article>`,{closable:true});
    drawQR(document.getElementById('ticketQR'),x.id);document.getElementById('ticketClose').addEventListener('click',()=>closeModal());document.getElementById('ticketActions').addEventListener('click',()=>openTicketActions(x));return;
  }
  showModal(t('tickets'),`<article class="digital-ticket ${x.international?'international-ticket':''} ${cancelled?'cancelled-ticket-view':''}"><div class="ticket-brand">GALIZISCHE BAHN</div><div class="ticket-service"><span class="service-badge ${x.type}">${esc(x.train)}</span><span>${esc(x.fare)}</span></div><div class="ticket-status ${cancelled?'bad':'good'}">${esc(cancelled?t('cancelledTicket'):t('validTicket'))}</div><div class="digital-route"><div><strong>${esc(x.departure)}</strong><small>${esc(x.from)}</small></div><b>→</b><div><strong>${esc(x.arrival)}</strong><small>${esc(x.to)}</small></div></div><div class="ticket-data"><div><small>${esc(t('traveler'))}</small><strong>${esc(x.passenger)}</strong></div><div><small>${esc(t('seat'))}</small><strong>${esc(x.coach)} · ${esc(x.seat)}</strong></div><div><small>${esc(t('selectedClass'))}</small><strong>${esc(classLabel(x.travelClass))}</strong></div><div><small>${esc(t('price'))}</small><strong>${esc(currency(x.price))}</strong></div></div>${x.international?federalNotice():''}${cancelled?`<article class="cancellation-receipt"><strong>${esc(t('cancellationReceipt'))}</strong><span>${esc(t('refund'))}: ${esc(currency(x.refundAmount||0))}</span><small>${new Date(x.cancelledAt).toLocaleString(locale())}</small></article>`:''}<div class="security-animation ${cancelled?'invalid':''}"></div><canvas id="ticketQR" width="210" height="210" class="${cancelled?'invalid-qr':''}"></canvas><code>${esc(x.id)}</code>${cancelled?`<p class="invalid-caption">${esc(t('qrInvalid'))}</p>`:''}<div class="ticket-primary-actions"><button class="secondary" id="ticketClose" type="button">${esc(t('close'))}</button>${!cancelled?`<button class="secondary" id="ticketLive" type="button">${esc(t('live'))}</button>`:''}<button class="primary" id="ticketActions" type="button">${esc(t('ticketActions'))}</button></div></article>`,{closable:true});
  drawQR(document.getElementById('ticketQR'),x.id+x.train);document.getElementById('ticketClose').addEventListener('click',()=>closeModal());document.getElementById('ticketLive')?.addEventListener('click',()=>openLiveTrip(x));document.getElementById('ticketActions').addEventListener('click',()=>openTicketActions(x));
}

function changeTicketSeat(ticket){
  showModal(t('seatSelection'),`<article><div class="coach"><div class="coach-label">${esc(t('coach'))} ${esc(ticket.coach)} · ${esc(classLabel(ticket.travelClass))}</div><div class="seat-grid">${makeSeats(ticket.id+(ticket.travelClass||'2'),ticket.seat)}</div></div><p id="changeSeatStatus" class="muted">${esc(t('seat'))}: ${esc(ticket.seat)}</p><div class="button-row"><button id="changeSeatBack" class="secondary" type="button">${esc(t('back'))}</button><button id="changeSeatSave" class="primary" type="button" disabled>${esc(t('saved'))}</button></div></article>`,{closable:true});
  let nextSeat=ticket.seat;modalRoot.querySelectorAll('[data-seat]:not(.occupied)').forEach(button=>button.addEventListener('click',()=>{modalRoot.querySelectorAll('[data-seat]').forEach(x=>x.classList.remove('selected'));button.classList.add('selected');nextSeat=button.dataset.seat;document.getElementById('changeSeatStatus').textContent=`${t('seat')}: ${nextSeat}`;document.getElementById('changeSeatSave').disabled=nextSeat===ticket.seat}));
  document.getElementById('changeSeatBack').addEventListener('click',()=>openTicketActions(ticket));document.getElementById('changeSeatSave').addEventListener('click',()=>{store.set(s=>({...s,tickets:s.tickets.map(x=>x.id===ticket.id?{...x,seat:nextSeat}:x)}));toast(t('saved'));openTicket(state().tickets.find(x=>x.id===ticket.id))});
}
function ticketRefundPolicy(ticket){
  if(ticket.kind==='urban')return{amount:0,label:t('noRefund'),detail:t('noRefund')};
  const fare=FARES.find(f=>f.id===ticket.fareId)||FARES.find(f=>f.name===ticket.fare);
  if(fare?.refundable===true)return{amount:ticket.price,label:t('fullRefund'),detail:t('refundToCard')};
  if(fare?.refundable==='fee')return{amount:Math.max(0,ticket.price-10),label:t('partialRefund'),detail:t('refundFee')};
  return{amount:0,label:t('noRefund'),detail:t('noRefund')};
}
function openTicketActions(ticket){
  const cancelled=ticket.status==='cancelled',policy=ticketRefundPolicy(ticket);
  showModal(t('ticketActions'),`<div class="ticket-action-list"><button data-ticket-action="details"><span>≡</span><div><strong>${esc(t('journeyDetails'))}</strong><small>${esc(ticket.kind==='urban'?ticket.network:`${ticket.from} → ${ticket.to}`)}</small></div><b>›</b></button><button data-ticket-action="qr"><span>▦</span><div><strong>${esc(t('fullQr'))}</strong><small>${esc(cancelled?t('qrInvalid'):t('validTicket'))}</small></div><b>›</b></button><button data-ticket-action="share"><span>↗</span><div><strong>${esc(t('shareTicket'))}</strong><small>${esc(ticket.id)}</small></div><b>›</b></button><button data-ticket-action="pdf"><span>PDF</span><div><strong>${esc(t('downloadPdf'))}</strong><small>${esc(t('cancellationReceipt'))}</small></div><b>›</b></button>${ticket.kind!=='urban'&&!cancelled&&ticket.changeability!==false?`<button data-ticket-action="seat"><span>▦</span><div><strong>${esc(t('seatSelection'))}</strong><small>${esc(ticket.coach)} · ${esc(ticket.seat)}</small></div><b>›</b></button>`:''}${ticket.kind!=='urban'?`<button data-ticket-action="repeat"><span>↻</span><div><strong>${esc(t('repeatJourney'))}</strong><small>${esc(ticket.from)} → ${esc(ticket.to)}</small></div><b>›</b></button>`:''}${!cancelled?`<button data-ticket-action="cancel" class="danger-action"><span>×</span><div><strong>${esc(t('cancelTicket'))}</strong><small>${esc(policy.label)} · ${esc(currency(policy.amount))}</small></div><b>›</b></button>`:''}</div><button id="actionsClose" class="secondary full modal-bottom-cancel" type="button">${esc(t('closeActions'))}</button>`,{closable:true});
  document.getElementById('actionsClose').addEventListener('click',()=>openTicket(ticket));
  modalRoot.querySelectorAll('[data-ticket-action]').forEach(button=>button.addEventListener('click',async()=>{
    const action=button.dataset.ticketAction;
    if(action==='details')return openTicket(ticket);
    if(action==='qr')return openTicketQr(ticket);
    if(action==='share')return shareTicket(ticket);
    if(action==='pdf')return downloadTicketPdf(ticket);
    if(action==='seat')return changeTicketSeat(ticket);
    if(action==='repeat')return repeatTicketJourney(ticket);
    if(action==='cancel')return confirmTicketCancellation(ticket);
  }));
}
function openTicketQr(ticket){
  showModal(t('fullQr'),`<article class="full-qr-view ${ticket.status==='cancelled'?'cancelled':''}"><canvas id="fullTicketQR" width="310" height="310"></canvas><strong>${esc(ticket.status==='cancelled'?t('qrInvalid'):ticket.id)}</strong><button id="qrBack" class="secondary full" type="button">${esc(t('back'))}</button></article>`,{closable:true});
  drawQR(document.getElementById('fullTicketQR'),ticket.id+(ticket.train||ticket.network));document.getElementById('qrBack').addEventListener('click',()=>openTicketActions(ticket));
}
async function shareTicket(ticket){
  const text=`Galizische Bahn · ${ticket.id}\n${ticket.kind==='urban'?`${ticket.name} · ${ticket.network}`:`${ticket.from} → ${ticket.to} · ${ticket.departure}`}\n${ticket.status==='cancelled'?t('cancelledTicket'):t('validTicket')}`;
  try{if(navigator.share)await navigator.share({title:'Galizische Bahn',text});else if(navigator.clipboard)await navigator.clipboard.writeText(text);toast(t('shareCopied'))}catch(error){if(error?.name!=='AbortError')toast(t('shareCopied'))}
}
function pdfSafe(value){return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x20-\x7E]/g,'?').replace(/[()\\]/g,m=>`\\${m}`)}
function createTicketPdf(ticket){
  const policy=ticketRefundPolicy(ticket),lines=['GALIZISCHE BAHN',ticket.status==='cancelled'?'CANCELLATION RECEIPT':'DIGITAL TICKET',`Ticket: ${ticket.id}`,ticket.kind==='urban'?`${ticket.name} - ${ticket.network}`:`${ticket.from} -> ${ticket.to}`,ticket.kind==='urban'?`Valid until: ${ticket.validUntil}`:`Date: ${ticket.date}  ${ticket.departure}-${ticket.arrival}`,`Price: ${ticket.price} GM`,`Status: ${ticket.status==='cancelled'?'Cancelled':'Valid'}`];
  if(ticket.status==='cancelled')lines.push(`Refund: ${policy.amount} GM`,`Cancelled: ${ticket.cancelledAt}`);
  const content=lines.map((line,index)=>`BT /F1 ${index<2?18:11} Tf 55 ${790-index*34} Td (${pdfSafe(line)}) Tj ET`).join('\n');
  const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let pdf='%PDF-1.4\n',offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`}const xref=pdf.length;pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;for(let i=1;i<objects.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;pdf+=`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;return new Blob([pdf],{type:'application/pdf'});
}
function downloadTicketPdf(ticket){const url=URL.createObjectURL(createTicketPdf(ticket)),a=document.createElement('a');a.href=url;a.download=`Galizische-Bahn-${ticket.id}.pdf`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);toast(t('pdfCreated'))}
function repeatTicketJourney(ticket){store.set(s=>({...s,search:{...s.search,fromId:ticket.fromId,toId:ticket.toId,travelClass:ticket.travelClass||'2',passengers:ticket.passengers||1}}));closeModal();navigate('travel',{autoSearch:true})}
function confirmTicketCancellation(ticket){
  const policy=ticketRefundPolicy(ticket);
  showModal(t('cancelTicket'),`<article class="cancel-ticket-confirm"><div class="cancel-symbol">×</div><h2>${esc(t('cancelTicketQuestion'))}</h2><p>${esc(t('cancelTicketWarning'))}</p><div class="refund-preview"><span>${esc(policy.label)}</span><strong>${esc(currency(policy.amount))}</strong><small>${esc(policy.detail)}</small></div>${ticket.international?`<p class="border-cancel-note">SJR · ${esc(t('mandatoryTransfer'))}: ${esc(t('cancelled'))}</p>`:''}<div class="button-row"><button id="cancelTicketBack" class="secondary" type="button">${esc(t('back'))}</button><button id="cancelTicketConfirm" class="danger-button" type="button">${esc(t('cancelTicket'))}</button></div></article>`,{closable:false});
  document.getElementById('cancelTicketBack').addEventListener('click',()=>openTicketActions(ticket));
  document.getElementById('cancelTicketConfirm').addEventListener('click',()=>cancelTicket(ticket,policy));
}
function cancelTicket(ticket,policy=ticketRefundPolicy(ticket)){
  const now=new Date().toISOString(),refundId=uid('GBR');
  store.set(s=>({...s,tickets:s.tickets.map(x=>x.id===ticket.id?{...x,status:'cancelled',qrValid:false,cancelledAt:now,refundAmount:policy.amount,cancellationId:refundId}:x),activeTicketId:s.activeTicketId===ticket.id?null:s.activeTicketId,orders:[{id:refundId,type:'refund',description:`${t('refundOrder')} · ${ticket.id}`,amount:-policy.amount,date:now},...s.orders]}));
  toast(t('ticketCancelled'));const updated=state().tickets.find(x=>x.id===ticket.id);renderTickets();openTicket(updated);
}
function drawQR(canvas,text){const c=canvas.getContext('2d'),n=29,cell=canvas.width/n;let value=seed(text);const rand=()=>{value^=value<<13;value^=value>>>17;value^=value<<5;return(value>>>0)/4294967296};c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#111';const reserved=Array.from({length:n},()=>Array(n).fill(false));const finder=(sx,sy)=>{for(let y=0;y<7;y++)for(let x=0;x<7;x++){reserved[sy+y][sx+x]=true;if(x===0||y===0||x===6||y===6||(x>=2&&x<=4&&y>=2&&y<=4))c.fillRect((sx+x)*cell,(sy+y)*cell,Math.ceil(cell),Math.ceil(cell))}};finder(1,1);finder(n-8,1);finder(1,n-8);for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!reserved[y][x]&&rand()>.52)c.fillRect(x*cell,y*cell,Math.ceil(cell),Math.ceil(cell))}
function cancelSubscription(id){store.set(s=>({...s,subscriptions:s.subscriptions.map(x=>x.id===id?{...x,status:'cancelled'}:x)}));toast(t('subscriptionCancelled'));renderTickets()}

function renderMore(){
  const s=state();
  main.innerHTML=`<section class="page-header"><p class="eyebrow">Galizische Bahn</p><h1>${esc(t('more'))}</h1><p class="subtitle">${esc(t('servicesSettings'))}</p></section><div class="more-grid"><button class="more-card" data-nav="network"><span>◇</span><div><strong>${esc(t('nationalMap'))}</strong><small>${esc(t('networkShort'))}</small></div><b>›</b></button><button class="more-card" data-nav="operations"><span>!</span><div><strong>${esc(t('operations'))}</strong><small>${esc(t('operationShort'))}</small></div><b>›</b></button><button class="more-card border" data-nav="border"><span>SJR</span><div><strong>${esc(t('borderCenter'))}</strong><small>${esc(t('borderAndInternational'))}</small></div><b>›</b></button><button class="more-card" data-nav="profile"><span>DJ</span><div><strong>${esc(t('profileCard'))}</strong><small>${esc(t('accountPayments'))}</small></div><b>›</b></button></div><section class="section"><div class="section-title"><h2>${esc(t('settings'))}</h2></div><article class="card settings"><button id="languageSetting"><span class="setting-icon">文</span><div><strong>${esc(t('language'))}</strong><small>${esc(languageName(s.language))}</small></div><b>›</b></button><button id="themeSetting"><span class="setting-icon">◐</span><div><strong>${esc(t('appearance'))}</strong><small>${esc(themeName(s.theme))}</small></div><b>›</b></button><button id="notificationSetting"><span class="setting-icon">◉</span><div><strong>${esc(t('notifyMe'))}</strong><small>${esc(s.notifications?t('notificationsEnabled'):t('none'))}</small></div><b>${s.notifications?'✓':'›'}</b></button><button id="installSetting"><span class="setting-icon">⇩</span><div><strong>${esc(t('install'))}</strong><small>PWA · ${APP_VERSION}</small></div><b>›</b></button></article></section><p class="build-note">v${APP_VERSION} · ${APP_BUILD}</p>`;
  document.getElementById('languageSetting').addEventListener('click',openLanguage);document.getElementById('themeSetting').addEventListener('click',openTheme);document.getElementById('notificationSetting').addEventListener('click',()=>toggleNotifications(true));document.getElementById('installSetting').addEventListener('click',installApp);
}

async function toggleNotifications(rerender=true){
  let enabled=!state().notifications;
  if(enabled&&'Notification'in window&&Notification.permission==='default'){try{enabled=(await Notification.requestPermission())==='granted'}catch{enabled=true}}
  store.set(s=>({...s,notifications:enabled,notificationInbox:enabled?[{id:uid('NTF'),text:t('notificationDeparture'),date:new Date().toISOString()},...s.notificationInbox]:s.notificationInbox}));
  toast(enabled?t('notificationsEnabled'):t('cancelled'));if(rerender===true)renderMore();return enabled;
}

function renderProfile(){
  const s=state(),sub=activeSubscription(),active=s.tickets.filter(x=>x.status!=='cancelled'),cancelled=s.tickets.filter(x=>x.status==='cancelled');
  const stationCounts={};s.tickets.forEach(ticket=>{if(ticket.fromId)stationCounts[ticket.fromId]=(stationCounts[ticket.fromId]||0)+1;if(ticket.toId)stationCounts[ticket.toId]=(stationCounts[ticket.toId]||0)+1});const favoriteId=Object.entries(stationCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||s.favorites[0],favoriteStation=getStation(favoriteId)?.name||'Guadalajara Hbf';
  main.innerHTML=`<section class="page-header"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><p class="eyebrow">GB Card</p><h1>${esc(t('profile'))}</h1></section><article class="card profile-card"><div class="profile-head"><span>DJ</span><div><h2>David J. Martínez</h2><p>GB Card Gold</p></div></div><div class="gold-card"><small>GB CARD GOLD</small><strong>2048 8361 0917</strong></div><div class="stats"><div><strong>${124+active.length}</strong><small>${esc(t('journeys'))}</small></div><div><strong>${(36000+active.length*240).toLocaleString(locale())}</strong><small>km</small></div><div><strong>${(8420+s.orders.length*230).toLocaleString(locale())}</strong><small>${esc(t('points'))}</small></div></div></article><section class="section"><div class="section-title"><h2>${esc(t('travelStats'))}</h2></div><article class="card profile-insights"><div><small>${esc(t('favoriteStation'))}</small><strong>${esc(favoriteStation)}</strong></div><div><small>${esc(t('favorites'))}</small><strong>${s.favoriteRoutes.length}</strong></div><div><small>${esc(t('cancelledTickets'))}</small><strong>${cancelled.length}</strong></div><div><small>${esc(t('frequentPassenger'))}</small><strong>${esc(s.frequentPassengers[0]||'David')}</strong></div></article></section>${sub?`<section class="section"><div class="section-title"><h2>${esc(t('activeSubscription'))}</h2></div>${subscriptionCard(sub)}<button class="danger-button full" data-cancel-sub="${sub.id}">${esc(t('cancelSubscription'))}</button></section>`:''}<section class="section"><div class="section-title"><h2>${esc(t('paymentMethods'))}</h2></div><article class="card setting-row"><span>▰</span><div><strong>${s.savedPayment?`${esc(s.savedPayment.brand)} •••• ${esc(s.savedPayment.last4)}`:esc(t('testCardMissing'))}</strong><small>${esc(t('demoOnly'))}</small></div></article></section><section class="section"><div class="section-title"><h2>${esc(t('purchaseHistory'))}</h2></div><div class="order-list">${s.orders.slice(0,8).map(o=>`<article class="card order-row ${o.amount<0?'refund-row':''}"><div><strong>${esc(o.description)}</strong><small>${new Date(o.date).toLocaleDateString(locale())}</small></div><b>${o.amount<0?'−':''}${esc(currency(Math.abs(o.amount)))}</b></article>`).join('')||'<p class="muted">—</p>'}</div></section>`;
  main.querySelector('[data-cancel-sub]')?.addEventListener('click',event=>cancelSubscription(event.currentTarget.dataset.cancelSub));
}

function openLanguage(){
  showModal(t('language'),`<p class="language-help">${esc(t('selectLanguage'))}</p><div class="language-list" role="radiogroup" aria-label="${esc(t('language'))}">${[['de','DE','Deutsch','Deutsch'],['es','ES','Español','Español'],['en','EN','English','English']].map(([id,code,name,native])=>`<button class="language-option ${state().language===id?'selected':''}" data-lang="${id}" role="radio" aria-checked="${state().language===id}"><span class="language-code">${code}</span><span class="language-copy"><strong>${esc(name)}</strong><small>${esc(native)}</small></span><span class="language-check">${state().language===id?'✓':''}</span></button>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="languageCancel" type="button">${esc(t('cancel'))}</button>`,{closable:true});
  modalRoot.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,language:b.dataset.lang}));setCopy();closeModal();render(routeFromHash())}));
  document.getElementById('languageCancel').addEventListener('click',()=>closeModal());
}
function openTheme(){
  const icons={system:'◐',light:'☀',dark:'☾'};
  showModal(t('appearance'),`<div class="language-list" role="radiogroup">${['system','light','dark'].map(id=>`<button class="language-option ${state().theme===id?'selected':''}" data-theme="${id}" role="radio" aria-checked="${state().theme===id}"><span class="language-code">${icons[id]}</span><span class="language-copy"><strong>${esc(themeName(id))}</strong></span><span class="language-check">${state().theme===id?'✓':''}</span></button>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="themeCancel" type="button">${esc(t('cancel'))}</button>`,{closable:true});
  modalRoot.querySelectorAll('[data-theme]').forEach(b=>b.addEventListener('click',()=>{store.set(s=>({...s,theme:b.dataset.theme}));applyTheme();closeModal();render(routeFromHash())}));
  document.getElementById('themeCancel').addEventListener('click',()=>closeModal());
}
function renderBorder(){
  main.innerHTML=`<section class="page-header"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><p class="eyebrow">SJR · International</p><h1>${esc(t('borderCenter'))}</h1><p class="subtitle">${esc(t('borderOnlySJR'))}</p></section><article class="border-status-hero"><div><small>${esc(t('borderStatus'))}</small><h2>${esc(t('openStatus'))}</h2></div><span>${esc(t('restricted'))}</span><div class="border-metrics"><div><strong>45 min</strong><small>${esc(t('controlTime'))}</small></div><div><strong>12 min</strong><small>${esc(t('transferBuffer'))}</small></div><div><strong>RB 90</strong><small>${esc(t('mexicoRB'))}</small></div></div></article><article class="official-advisory"><div class="warning-seal">AA</div><div><p class="eyebrow">Auswärtiges Amt</p><h3>${esc(t('travelWarningBody'))}</h3><p>${esc(t('travelWarningDetail'))}</p></div></article><section class="section"><div class="section-title"><h2>${esc(t('borderProcedure'))}</h2></div><div class="direction-cards"><article class="card direction-card"><h3>${esc(t('outbound'))}</h3><ol><li>${esc(t('domesticTrain'))} → San Juan del Río</li><li>${esc(t('migrationFilter'))} · 45 min</li><li>${esc(t('transferToRB'))}</li><li>RB → Ciudad de México Buenavista</li></ol></article><article class="card direction-card"><h3>${esc(t('inbound'))}</h3><ol><li>RB → San Juan del Río</li><li>${esc(t('migrationFilter'))} · 45 min</li><li>${esc(t('transferFromRB'))}</li><li>${esc(t('domesticTrain'))} → Galizien</li></ol></article></div></section><section class="section"><article class="card documents-card"><h2>${esc(t('documents'))}</h2><div class="document-grid"><span>Reisepass</span><span>Einreisegenehmigung</span><span>${esc(t('customs'))}</span><span>Fahrkarte</span></div></article></section><button id="borderSearch" class="primary full" type="button">${esc(t('searchTrip'))}: Ciudad de México</button>`;
  document.getElementById('borderSearch').addEventListener('click',()=>{store.set(s=>({...s,search:{...s.search,toId:'MEX'}}));navigate('travel')});
}
function renderOperations(){main.innerHTML=`<section class="page-header"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><p class="eyebrow">Leitstelle</p><h1>${esc(t('operationsTitle'))}</h1><p class="subtitle">Simulierte Echtzeitlage · ${new Date().toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}</p></section><div class="operation-summary"><article class="metric"><small>ICE</small><strong>${esc(t('normal'))}</strong><i class="ok"></i></article><article class="metric"><small>IC</small><strong>${esc(t('minor'))}</strong><i class="warn"></i></article><article class="metric"><small>RE West</small><strong>${esc(t('disrupted'))}</strong><i class="bad"></i></article><article class="metric"><small>RB México</small><strong>${esc(t('restricted'))}</strong><i class="warn"></i></article></div><section class="section"><div class="operation-list">${SERVICE_ALERTS.map(a=>`<article class="card operation-card ${a.severity}"><span></span><div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><div class="chips">${a.modes.map(m=>`<i>${esc(m)}</i>`).join('')}</div></div></article>`).join('')}</div></section><section class="section">${borderFlowCard()}</section>`}
function renderNetwork(){
  main.innerHTML=`<section class="page-header"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><p class="eyebrow">National</p><h1>${esc(t('networkMap'))}</h1><p class="subtitle">${esc(t('networkShort'))}</p></section><article class="card map-card"><svg class="rail-map" viewBox="60 10 620 500" role="img" aria-label="Galizische Bahn Netz">${RAIL_EDGES.map(([a,b,,modes])=>{const A=getStation(a),B=getStation(b),type=modes[0];return`<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="rail-line ${esc(type)} ${a==='SJR'&&b==='MEX'?'border-link':''}"></line>`}).join('')}${STATIONS.filter(s=>s.hub||s.international||s.border).map(station=>`<g data-map-station="${station.id}" class="map-station ${station.country==='MX'?'mexico':''} ${station.id==='SJR'?'border-hub':''}"><circle class="map-hit" cx="${station.x}" cy="${station.y}" r="20"></circle>${station.id==='SJR'?`<circle class="border-ring" cx="${station.x}" cy="${station.y}" r="14"></circle>`:''}<circle class="map-dot" cx="${station.x}" cy="${station.y}" r="${station.hub?8:7}"></circle><text x="${station.x+10}" y="${station.y-10}">${esc(station.city)}</text></g>`).join('')}<circle id="mapTrain" class="map-train" cx="442" cy="252" r="7"></circle></svg><div class="map-legend"><span><i class="ICE"></i>ICE</span><span><i class="IC"></i>IC</span><span><i class="RE"></i>RE</span><span><i class="RB"></i>${esc(t('mexicoRB'))}</span></div></article><section class="section">${borderFlowCard()}</section><section class="section"><button class="primary full" data-nav="city">${esc(t('cityTravel'))}</button></section>`;
  main.querySelectorAll('[data-map-station]').forEach(group=>group.addEventListener('click',()=>openStation(getStation(group.dataset.mapStation))));
  let p=0;liveTimer=setInterval(()=>{p=(p+.007)%1;const marker=document.getElementById('mapTrain');if(marker){marker.setAttribute('cx',442+(500-442)*p);marker.setAttribute('cy',252+(300-252)*p)}},100);
}
function stationBoardRows(station,direction='departures'){
  const links=RAIL_EDGES.filter(([a,b])=>a===station.id||b===station.id).slice(0,6);const now=new Date();
  if(!links.length)return`<p class="muted">—</p>`;
  return links.map((edge,index)=>{const other=getStation(edge[0]===station.id?edge[1]:edge[0]),mode=edge[3][0],mins=4+index*7,time=new Date(now.getTime()+mins*60000).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'}),train=`${mode} ${90+index*17}`,delay=index===2?6:0;return`<div class="station-board-row"><time>${esc(time)}</time><span class="service-badge ${esc(mode)}">${esc(train)}</span><div><strong>${esc(other?.name||'')}</strong><small>${direction==='departures'?esc(t('departure')):esc(t('arrival'))} · ${delay?`+${delay} min`:esc(t('onTime'))}</small></div><b>${esc(t('platform'))} ${1+index%station.platforms}</b></div>`}).join('');
}
function openStation(station,board='departures'){
  const rows=stationBoardRows(station,board),favorite=state().favorites.includes(station.id);
  showModal(t('station'),`<article><div class="station-title-row"><div><p class="eyebrow">${esc(station.id)} · ${esc(station.country)}</p><h2>${esc(station.name)}</h2><p class="muted">${esc(station.oldName)} · ${station.platforms} ${esc(t('platform'))}</p></div><button id="favoriteStation" class="favorite-icon ${favorite?'selected':''}" type="button">${favorite?'★':'☆'}</button></div>${station.id==='SJR'?federalNotice():station.country==='MX'?`<article class="official-advisory-inline"><strong>Auswärtiges Amt</strong><p>${esc(t('travelWarningBody'))}</p></article>`:''}<div class="mode-tabs station-tabs"><button data-station-board="departures" class="${board==='departures'?'active':''}">${esc(t('departures'))}</button><button data-station-board="arrivals" class="${board==='arrivals'?'active':''}">${esc(t('arrivals'))}</button></div><div class="station-board">${rows}</div><h3>${esc(t('services'))}</h3><div class="chips">${station.amenities.map(a=>`<i>${esc(a)}</i>`).join('')}</div><div class="button-row"><button class="secondary" id="stationClose">${esc(t('close'))}</button><button class="primary" id="stationSearch">${esc(t('search'))}</button></div></article>`,{closable:true});
  document.getElementById('favoriteStation').addEventListener('click',()=>{const exists=state().favorites.includes(station.id);store.set(s=>({...s,favorites:exists?s.favorites.filter(id=>id!==station.id):[station.id,...s.favorites]}));toast(exists?t('routeRemoved'):t('routeSaved'));openStation(station,board)});
  modalRoot.querySelectorAll('[data-station-board]').forEach(button=>button.addEventListener('click',()=>openStation(station,button.dataset.stationBoard)));
  document.getElementById('stationClose').addEventListener('click',()=>closeModal());document.getElementById('stationSearch').addEventListener('click',()=>{store.set(s=>({...s,search:{...s.search,fromId:station.id,toId:station.id==='MEX'?'GUA':state().search.toId}}));closeModal();navigate('travel')});
}

function openLiveTrip(ticket){
  const path=ticket.path||['GUA','KAR','GRE','MEX'],next=getStation(path[Math.min(1,path.length-1)])?.city||ticket.to;
  showModal(t('live'),`<article class="live-card"><div class="journey-top"><span class="service-badge ${ticket.type}">${esc(ticket.train)}</span><span class="live-dot">● LIVE</span></div><svg class="live-svg" viewBox="0 0 600 230"><path d="M50 155 C190 45 410 45 550 155"></path>${path.slice(0,3).map((id,i)=>`<circle cx="${50+i*250}" cy="${i===1?65:155}" r="7"></circle><text x="${50+i*250}" y="${i===1?40:185}" text-anchor="middle">${esc(getStation(id)?.city||'')}</text>`).join('')}<circle id="liveTrain" class="map-train" cx="220" cy="78" r="9"></circle></svg><div class="progress"><i id="liveBar"></i></div><div class="live-stats"><div><small>${esc(t('speed'))}</small><strong id="liveSpeed">287 km/h</strong></div><div><small>${esc(t('nextTrip'))}</small><strong>${esc(next)}</strong></div><div><small>${esc(t('arrival'))}</small><strong>${esc(ticket.arrival)}</strong></div><div><small>${esc(t('progress'))}</small><strong id="livePercent">34 %</strong></div><div><small>${esc(t('timeRemaining'))}</small><strong id="liveRemaining">${esc(duration(Math.round((ticket.duration||100)*.66)))}</strong></div><div><small>${esc(t('platform'))}</small><strong>${esc(ticket.platform||'4')} · ${esc(t('sector'))} ${String.fromCharCode(65+(seed(ticket.id)%4))}</strong></div></div>${ticket.international?`<article class="live-notice border"><strong>SJR</strong><p>${esc(t('notificationBorder'))}</p></article>`:`<article class="live-notice"><strong>${esc(t('notificationTitle'))}</strong><p>${esc(t('notificationPlatform'))}</p></article>`}<button id="liveNotify" class="secondary full" type="button">${esc(state().notifications?t('notificationsEnabled'):t('notifyMe'))}</button><p class="muted">${esc(t('simulatedLive'))}</p></article>`);
  document.getElementById('liveNotify').addEventListener('click',async()=>{if(!state().notifications)await toggleNotifications(false);else toast(t('notificationsEnabled'))});let p=.34;stopTimers();liveTimer=setInterval(()=>{p+=.005;if(p>1)p=.05;const x=50+500*p,y=155-Math.sin(Math.PI*p)*105;document.getElementById('liveTrain')?.setAttribute('cx',x);document.getElementById('liveTrain')?.setAttribute('cy',y);const bar=document.getElementById('liveBar');if(bar)bar.style.width=`${p*100}%`;const speed=document.getElementById('liveSpeed');if(speed)speed.textContent=`${Math.round(270+Math.sin(p*10)*27)} km/h`;const percent=document.getElementById('livePercent');if(percent)percent.textContent=`${Math.round(p*100)} %`;const remaining=document.getElementById('liveRemaining');if(remaining)remaining.textContent=duration(Math.max(1,Math.round((ticket.duration||100)*(1-p))))},100)
}

function showModal(title,content,options=true){
  stopTimers();
  if(modalContext?.onKey)document.removeEventListener('keydown',modalContext.onKey);
  const config=typeof options==='boolean'?{closable:options}:{closable:true,...(options||{})};
  modalContext={...config,returnFocus:document.activeElement};
  document.body.classList.add('modal-open');
  modalRoot.innerHTML=`<div class="modal-backdrop"><section class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><header><h2 id="modalTitle">${esc(title)}</h2>${config.closable?`<button id="modalClose" type="button" aria-label="${esc(config.closeLabel||t('close'))}">×</button>`:''}</header><div class="modal-content">${content}</div></section></div>`;
  const requestClose=()=>config.onRequestClose?config.onRequestClose():closeModal();
  document.getElementById('modalClose')?.addEventListener('click',requestClose);
  modalRoot.querySelector('.modal-backdrop')?.addEventListener('click',e=>{if(config.closable&&e.target.classList.contains('modal-backdrop'))requestClose()});
  const onKey=e=>{if(e.key==='Escape'&&config.closable){e.preventDefault();requestClose()}};
  modalContext.onKey=onKey;document.addEventListener('keydown',onKey);
  requestAnimationFrame(()=>modalRoot.querySelector('button,input,select')?.focus({preventScroll:true}));
}
function closeModal(clear=true){
  stopTimers();
  if(modalContext?.onKey)document.removeEventListener('keydown',modalContext.onKey);
  const focus=modalContext?.returnFocus;modalContext=null;document.body.classList.remove('modal-open');
  if(clear)modalRoot.innerHTML='';
  if(focus?.isConnected)requestAnimationFrame(()=>focus.focus({preventScroll:true}));
}
async function installApp(){if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true;return}showModal(t('install'),`<article class="empty"><b>⇧</b><h2>Zum Home-Bildschirm</h2><p>In Safari: Teilen → Zum Home-Bildschirm.</p><button class="secondary full" id="installClose" type="button">${esc(t('close'))}</button></article>`,{closable:true});document.getElementById('installClose').addEventListener('click',()=>closeModal())}
function register(){
  document.querySelectorAll('.nav-button').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.route)));
  document.getElementById('brandButton').addEventListener('click',()=>navigate('home'));
  document.getElementById('avatarButton').addEventListener('click',()=>navigate('more'));
  installButton.addEventListener('click',installApp);
  window.addEventListener('hashchange',()=>{const opts=pendingRouteOptions;pendingRouteOptions={};render(routeFromHash(),opts)});
  window.addEventListener('online',updateOnline);window.addEventListener('offline',updateOnline);
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.hidden=false});
  matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>{if(state().theme==='system')applyTheme()});
  if('serviceWorker'in navigator&&location.protocol.startsWith('http')){
    navigator.serviceWorker.register('./sw.js').then(reg=>{if(reg.waiting)showUpdateBanner(reg);reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)showUpdateBanner(reg)})})}).catch(console.warn);
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadingForUpdate)return;reloadingForUpdate=true;location.reload()});
  }
}
applyTheme();setCopy();updateOnline();register();if(!location.hash)history.replaceState(null,'','#/home');render(routeFromHash(),{instant:true});
