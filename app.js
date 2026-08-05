import {
  APP_VERSION, APP_BUILD, STATIONS, RAIL_EDGES, URBAN_NETWORKS,
  SUBSCRIPTIONS, FARES, SERVICE_ALERTS, COPY, getStation, getUrbanNetwork
} from './data.js?v=0.9.1-rail-operations1';
import { createStore } from './store.js?v=0.9.1-rail-operations1';
import { createJourneys, planUrban, addTime } from './routing.js?v=0.9.1-rail-operations1';
import { TEST_CARDS, validatePayment, simulatePayment } from './payment.js?v=0.9.1-rail-operations1';
import { I18N } from './i18n.js?v=0.9.1-rail-operations1';
import { stationBoardServices, SERVICE_BY_ID, RAIL_SERVICES } from './rail-services.js?v=0.9.1-rail-operations1';

const store = createStore();
const EXTRA_COPY={
  de:{operationFrequency:'Takt',dailyService:'1× täglich',rollingStock:'Fahrzeug',corridor:'Linie',resultFrom:'ab',fromPrice:'ab',navMore:'Mehr',more:'Mehr',servicesSettings:'Dienste & Einstellungen',searchTrip:'Reise suchen',currentTrip:'Aktuelle Reise',importantNotices:'Wichtige Hinweise',recentDestinations:'Letzte Ziele',noUpcomingTrip:'Keine bevorstehende Reise',borderCenter:'Grenzzentrum San Juan del Río',borderStatus:'Aktueller Grenzstatus',restricted:'Eingeschränkt',borderWait:'Voraussichtliche Kontrollzeit',mandatoryTransfer:'Verpflichtender Umstieg',borderControl:'Grenz- und Migrationskontrolle',customs:'Zoll',documents:'Reisedokumente',mexicoRB:'RB México',noDirectICE:'Kein ICE fährt direkt nach Ciudad de México.',travelWarningTitle:'Reisewarnung des Auswärtigen Amts',travelWarningBody:'Das Auswärtige Amt rät von Reisen nach Mexiko ab.',travelWarningDetail:'Für Reisen nach Mexiko gelten aufgrund des Konflikts erhöhte Sicherheits- und Grenzmaßnahmen.',continueAnyway:'Trotzdem fortfahren',openBorderCenter:'Grenzzentrum öffnen',borderProcedure:'Reiseablauf an der Grenze',outbound:'Galizien → Mexiko',inbound:'Mexiko → Galizien',domesticTrain:'Fern- oder Regionalzug',migrationFilter:'Migrationskontrolle',transferToRB:'Umstieg in den RB México',transferFromRB:'Umstieg in den galizischen Fernverkehr',bestPrice:'Bester Preis',occupancy:'Auslastung',low:'Gering',medium:'Mittel',high:'Hoch',trainComposition:'Wagenreihung',coach:'Wagen',routePlanner:'Route planen',lineNetwork:'Liniennetz',allLines:'Alle Linien',cityOverview:'Stadtverkehr auf einen Blick',nationalMap:'Nationales Netz',profileCard:'Profil & GB Card',accountPayments:'Konto, Zahlungen und Verlauf',borderAndInternational:'Grenze & internationale Reisen',borderOnlySJR:'Alle Zugreisen nach Mexiko werden ausschließlich in San Juan del Río abgefertigt.',controlTime:'Kontrolle',transferBuffer:'Umstiegszeit',openStatus:'Geöffnet mit Einschränkungen',advisory:'Reisehinweis',internationalRoute:'Internationale Verbindung',connectionThrough:'Umstieg über San Juan del Río',routeDetails:'Reiseverlauf',showComposition:'Wagen anzeigen',planner:'Planer',departuresView:'Abfahrten',mapView:'Netzplan',settingsShort:'Sprache, Darstellung und Installation',operationShort:'Störungen und Anschlüsse',networkShort:'Fernverkehr und Grenzstrecke',cityTicketsShort:'Stadttickets und Abonnements',searchDifferent:'Andere Verbindung suchen'},
  es:{operationFrequency:'Frecuencia',dailyService:'1 servicio diario',rollingStock:'Material rodante',corridor:'Línea',resultFrom:'desde',fromPrice:'desde',navMore:'Más',more:'Más',servicesSettings:'Servicios y configuración',searchTrip:'Buscar viaje',currentTrip:'Viaje actual',importantNotices:'Avisos importantes',recentDestinations:'Destinos recientes',noUpcomingTrip:'No hay viajes próximos',borderCenter:'Centro fronterizo de San Juan del Río',borderStatus:'Estado actual de la frontera',restricted:'Restringido',borderWait:'Tiempo estimado de control',mandatoryTransfer:'Transbordo obligatorio',borderControl:'Control fronterizo y migratorio',customs:'Aduana',documents:'Documentos de viaje',mexicoRB:'RB México',noDirectICE:'Ningún ICE llega directamente a Ciudad de México.',travelWarningTitle:'Advertencia de viaje del Auswärtiges Amt',travelWarningBody:'El Ministerio de Asuntos Exteriores recomienda no viajar a México.',travelWarningDetail:'Debido al conflicto, los viajes a México están sujetos a mayores medidas de seguridad y controles fronterizos.',continueAnyway:'Continuar de todos modos',openBorderCenter:'Abrir centro fronterizo',borderProcedure:'Proceso de viaje en la frontera',outbound:'Galizia → México',inbound:'México → Galizia',domesticTrain:'Tren nacional o regional',migrationFilter:'Filtro migratorio',transferToRB:'Cambio al RB México',transferFromRB:'Cambio al tren nacional de Galizia',bestPrice:'Mejor precio',occupancy:'Ocupación',low:'Baja',medium:'Media',high:'Alta',trainComposition:'Composición del tren',coach:'Vagón',routePlanner:'Planear ruta',lineNetwork:'Mapa de líneas',allLines:'Todas las líneas',cityOverview:'Transporte urbano de un vistazo',nationalMap:'Red nacional',profileCard:'Perfil y GB Card',accountPayments:'Cuenta, pagos e historial',borderAndInternational:'Frontera y viajes internacionales',borderOnlySJR:'Todos los viajes ferroviarios a México se procesan exclusivamente en San Juan del Río.',controlTime:'Control',transferBuffer:'Tiempo de transbordo',openStatus:'Abierta con restricciones',advisory:'Advertencia de viaje',internationalRoute:'Conexión internacional',connectionThrough:'Transbordo en San Juan del Río',routeDetails:'Itinerario',showComposition:'Ver vagones',planner:'Planificador',departuresView:'Salidas',mapView:'Mapa de red',settingsShort:'Idioma, apariencia e instalación',operationShort:'Incidencias y conexiones',networkShort:'Larga distancia y ruta fronteriza',cityTicketsShort:'Boletos urbanos y suscripciones',searchDifferent:'Buscar otra conexión'},
  en:{operationFrequency:'Every',dailyService:'1 daily service',rollingStock:'Rolling stock',corridor:'Line',resultFrom:'from',fromPrice:'from',navMore:'More',more:'More',servicesSettings:'Services & settings',searchTrip:'Find a journey',currentTrip:'Current journey',importantNotices:'Important notices',recentDestinations:'Recent destinations',noUpcomingTrip:'No upcoming journeys',borderCenter:'San Juan del Río border centre',borderStatus:'Current border status',restricted:'Restricted',borderWait:'Estimated control time',mandatoryTransfer:'Mandatory transfer',borderControl:'Border and immigration control',customs:'Customs',documents:'Travel documents',mexicoRB:'RB México',noDirectICE:'No ICE runs directly to Mexico City.',travelWarningTitle:'Travel warning from the Auswärtiges Amt',travelWarningBody:'The Federal Foreign Office advises against travel to Mexico.',travelWarningDetail:'Because of the conflict, travel to Mexico is subject to heightened security and border measures.',continueAnyway:'Continue anyway',openBorderCenter:'Open border centre',borderProcedure:'Border journey process',outbound:'Galizia → Mexico',inbound:'Mexico → Galizia',domesticTrain:'Domestic or regional train',migrationFilter:'Immigration screening',transferToRB:'Transfer to RB México',transferFromRB:'Transfer to Galizian long-distance train',bestPrice:'Best price',occupancy:'Occupancy',low:'Low',medium:'Medium',high:'High',trainComposition:'Train composition',coach:'Coach',routePlanner:'Plan route',lineNetwork:'Line map',allLines:'All lines',cityOverview:'City transport at a glance',nationalMap:'National network',profileCard:'Profile & GB Card',accountPayments:'Account, payments and history',borderAndInternational:'Border & international travel',borderOnlySJR:'All rail journeys to Mexico are processed exclusively at San Juan del Río.',controlTime:'Control',transferBuffer:'Transfer time',openStatus:'Open with restrictions',advisory:'Travel advisory',internationalRoute:'International connection',connectionThrough:'Transfer at San Juan del Río',routeDetails:'Journey details',showComposition:'Show coaches',planner:'Planner',departuresView:'Departures',mapView:'Network map',settingsShort:'Language, appearance and installation',operationShort:'Disruptions and connections',networkShort:'Long-distance and border route',cityTicketsShort:'City tickets and subscriptions',searchDifferent:'Find another connection'}
};

const PATCH_COPY={
  de:{resumePurchase:'Kauf fortsetzen',savedPurchase:'Gespeicherter Kauf',activeTickets:'Aktive Tickets',cancelledTickets:'Stornierte Tickets',history:'Verlauf',ticketActions:'Ticket verwalten',cancelTicket:'Ticket stornieren',cancelTicketQuestion:'Dieses Ticket wirklich stornieren?',cancelTicketWarning:'Der QR-Code wird sofort ungültig. Die Erstattung richtet sich nach dem gewählten Tarif.',refund:'Erstattung',fullRefund:'Vollständige Erstattung',partialRefund:'Teilweise Erstattung',noRefund:'Keine Erstattung',ticketCancelled:'Ticket wurde storniert',qrInvalid:'QR-Code ungültig',cancellationReceipt:'Stornierungsbeleg',shareTicket:'Ticket teilen',downloadPdf:'PDF herunterladen',digitalTicketPdf:'Digitales Ticket',fullQr:'QR-Code vergrößern',repeatJourney:'Reise wiederholen',journeyDetails:'Reisedetails',favoriteRoute:'Verbindung speichern',removeFavorite:'Gespeicherte Verbindung entfernen',favorites:'Favoriten',noCancelledTickets:'Keine stornierten Tickets',noHistory:'Noch keine Vorgänge',routeSaved:'Verbindung gespeichert',routeRemoved:'Verbindung entfernt',summary:'Zusammenfassung',selectedClass:'Gewählte Klasse',included:'Inklusive',firstClassUpgrade:'Upgrade in die 1. Klasse',loungeAccess:'GB Lounge am Abfahrtsbahnhof',specialLuggage:'Sondergepäck',pet:'Haustier',firstClassIncluded:'Leistungen der 1. Klasse sind bereits enthalten.',stationBoard:'Bahnhofstafel',arrivals:'Ankünfte',notifyMe:'Benachrichtigungen aktivieren',notificationsEnabled:'Reisehinweise aktiviert',notificationTitle:'Reisehinweis',trainLength:'Zuglänge',coaches:'Wagen',sector:'Sektor',progress:'Fortschritt',timeRemaining:'Verbleibend',refundToCard:'Erstattung auf Testkarte',cancelledAt:'Storniert am',refundOrder:'Ticket-Erstattung',menu:'Weitere Aktionen',closeActions:'Aktionen schließen',classAlreadyIncluded:'1. Klasse bereits gewählt',currentSelection:'Aktuelle Auswahl',noActiveTickets:'Keine aktiven Tickets',resumeDraftText:'Deine Auswahl wurde gespeichert.',ticketStatus:'Ticketstatus',validTicket:'Gültig',cancelledTicket:'Storniert',shareCopied:'Ticketdaten kopiert',pdfCreated:'PDF wurde erstellt',notificationDeparture:'Dein Zug fährt in 20 Minuten.',notificationPlatform:'Gleisänderung: Bitte beachte die aktuelle Anzeige.',notificationBorder:'Ankunft in San Juan del Río: Bitte zur Grenzkontrolle gehen.',addFavorite:'Als Favorit speichern',removeFavoriteShort:'Favorit entfernen',frequentPassenger:'Häufiger Fahrgast',travelStats:'Reisestatistik',favoriteStation:'Meistgenutzter Bahnhof',refundFee:'10 GM Bearbeitungsgebühr',none:'Keine'},
  es:{resumePurchase:'Continuar compra',savedPurchase:'Compra guardada',activeTickets:'Boletos activos',cancelledTickets:'Boletos cancelados',history:'Historial',ticketActions:'Gestionar boleto',cancelTicket:'Cancelar boleto',cancelTicketQuestion:'¿Cancelar este boleto?',cancelTicketWarning:'El código QR dejará de ser válido inmediatamente. El reembolso depende de la tarifa elegida.',refund:'Reembolso',fullRefund:'Reembolso completo',partialRefund:'Reembolso parcial',noRefund:'Sin reembolso',ticketCancelled:'Boleto cancelado',qrInvalid:'Código QR inválido',cancellationReceipt:'Comprobante de cancelación',shareTicket:'Compartir boleto',downloadPdf:'Descargar PDF',digitalTicketPdf:'Boleto digital',fullQr:'Ampliar código QR',repeatJourney:'Repetir viaje',journeyDetails:'Detalles del viaje',favoriteRoute:'Guardar ruta',removeFavorite:'Eliminar ruta guardada',favorites:'Favoritos',noCancelledTickets:'No hay boletos cancelados',noHistory:'Todavía no hay movimientos',routeSaved:'Ruta guardada',routeRemoved:'Ruta eliminada',summary:'Resumen',selectedClass:'Clase seleccionada',included:'Incluido',firstClassUpgrade:'Mejora a Primera Clase',loungeAccess:'GB Lounge en la estación de salida',specialLuggage:'Equipaje especial',pet:'Mascota',firstClassIncluded:'Los beneficios de Primera Clase ya están incluidos.',stationBoard:'Tablero de estación',arrivals:'Llegadas',notifyMe:'Activar avisos',notificationsEnabled:'Avisos del viaje activados',notificationTitle:'Aviso del viaje',trainLength:'Longitud del tren',coaches:'Vagones',sector:'Sector',progress:'Progreso',timeRemaining:'Tiempo restante',refundToCard:'Reembolso a tarjeta de prueba',cancelledAt:'Cancelado el',refundOrder:'Reembolso de boleto',menu:'Más acciones',closeActions:'Cerrar acciones',classAlreadyIncluded:'Primera Clase ya seleccionada',currentSelection:'Selección actual',noActiveTickets:'No hay boletos activos',resumeDraftText:'Conservamos tu selección.',ticketStatus:'Estado del boleto',validTicket:'Válido',cancelledTicket:'Cancelado',shareCopied:'Datos del boleto copiados',pdfCreated:'PDF creado',notificationDeparture:'Tu tren sale en 20 minutos.',notificationPlatform:'Cambio de andén: consulta la información actual.',notificationBorder:'Llegaste a San Juan del Río: dirígete al control fronterizo.',addFavorite:'Guardar como favorito',removeFavoriteShort:'Eliminar favorito',frequentPassenger:'Pasajero frecuente',travelStats:'Estadísticas de viaje',favoriteStation:'Estación más utilizada',refundFee:'Cargo de gestión de 10 GM',none:'Ninguno'},
  en:{resumePurchase:'Continue purchase',savedPurchase:'Saved purchase',activeTickets:'Active tickets',cancelledTickets:'Cancelled tickets',history:'History',ticketActions:'Manage ticket',cancelTicket:'Cancel ticket',cancelTicketQuestion:'Cancel this ticket?',cancelTicketWarning:'The QR code will become invalid immediately. Any refund depends on the selected fare.',refund:'Refund',fullRefund:'Full refund',partialRefund:'Partial refund',noRefund:'No refund',ticketCancelled:'Ticket cancelled',qrInvalid:'QR code invalid',cancellationReceipt:'Cancellation receipt',shareTicket:'Share ticket',downloadPdf:'Download PDF',digitalTicketPdf:'Digital ticket',fullQr:'Enlarge QR code',repeatJourney:'Repeat journey',journeyDetails:'Journey details',favoriteRoute:'Save route',removeFavorite:'Remove saved route',favorites:'Favourites',noCancelledTickets:'No cancelled tickets',noHistory:'No activity yet',routeSaved:'Route saved',routeRemoved:'Route removed',summary:'Summary',selectedClass:'Selected class',included:'Included',firstClassUpgrade:'Upgrade to First Class',loungeAccess:'GB Lounge at departure station',specialLuggage:'Special luggage',pet:'Pet',firstClassIncluded:'First Class benefits are already included.',stationBoard:'Station board',arrivals:'Arrivals',notifyMe:'Enable alerts',notificationsEnabled:'Journey alerts enabled',notificationTitle:'Journey alert',trainLength:'Train length',coaches:'Coaches',sector:'Sector',progress:'Progress',timeRemaining:'Remaining',refundToCard:'Refund to test card',cancelledAt:'Cancelled on',refundOrder:'Ticket refund',menu:'More actions',closeActions:'Close actions',classAlreadyIncluded:'First Class already selected',currentSelection:'Current selection',noActiveTickets:'No active tickets',resumeDraftText:'Your selection has been saved.',ticketStatus:'Ticket status',validTicket:'Valid',cancelledTicket:'Cancelled',shareCopied:'Ticket details copied',pdfCreated:'PDF created',notificationDeparture:'Your train leaves in 20 minutes.',notificationPlatform:'Platform change: check the latest information.',notificationBorder:'You have arrived at San Juan del Río: proceed to border control.',addFavorite:'Save as favourite',removeFavoriteShort:'Remove favourite',frequentPassenger:'Frequent passenger',travelStats:'Travel statistics',favoriteStation:'Most used station',refundFee:'10 GM administration fee',none:'None'}
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
  let text = I18N[state().language]?.[key] ?? PATCH_COPY[state().language]?.[key] ?? EXTRA_COPY[state().language]?.[key] ?? COPY[state().language]?.[key] ?? I18N.de[key] ?? PATCH_COPY.de[key] ?? EXTRA_COPY.de[key] ?? COPY.de[key] ?? key;
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
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#0d0e12':'#971d3b');
  document.documentElement.dataset.density=state().density||'comfortable';
  document.documentElement.classList.toggle('reduce-motion',Boolean(state().reduceMotion));
}
function setCopy(){
  document.documentElement.lang=state().language;
  document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=t(el.dataset.copy));
}
function updateOnline(){
  onlineBadge.textContent=navigator.onLine?t('online'):t('offline');
  onlineBadge.classList.toggle('offline',!navigator.onLine);
  updateHeaderState();
}
function updateHeaderState(){
  const unread=state().notificationInbox.filter(item=>!item.read).length;
  const count=document.getElementById('notificationCount');
  if(count){count.hidden=!unread;count.textContent=unread>9?'9+':String(unread)}
  const avatar=document.getElementById('avatarButton');
  if(avatar)avatar.textContent=(state().account?.initials||'GB').slice(0,3).toUpperCase();
}
function greetingKey(){const hour=new Date().getHours();return hour<12?'goodMorning':hour<18?'goodAfternoon':'goodEvening'}
function toast(message){
  const node=document.createElement('div'); node.className='toast'; node.textContent=message; toastRoot.append(node); setTimeout(()=>node.remove(),2800);
}
function stopTimers(){ if(liveTimer){clearInterval(liveTimer);liveTimer=null} }

const allowedRoutes=['home','travel','city','tickets','more','profile','network','operations','border','notifications','journey'];
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
  const navRoute=['profile','network','operations','border','notifications','journey'].includes(route)?'more':route;
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
  if(route==='notifications')renderNotifications();
  if(route==='journey')renderJourneyAssistant();
  bindNav(main);
  updateHeaderState();
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
  document.getElementById('discardCheckout').addEventListener('click',()=>{paymentRun++;clearCheckout();closeModal();render(routeFromHash(),{force:true});toast(t('purchaseCancelled'))});
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
function coachKindLabel(kind){
  const map={'1. Klasse':'firstClass','2. Klasse':'secondClass','1./2. Klasse':'mixedClass','Ruhebereich':'quiet','Fahrrad':'bike','Restaurant':'restaurantCar','Mehrzweck':'multiPurposeCoach','Liegewagen':'couchetteCar','Schlafwagen':'sleepingCar','Sitzwagen':'seatedCoach'};
  return map[kind]?t(map[kind]):kind;
}
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
  const s=state(),search=s.search,trip=activeTicket(),sub=activeSubscription(),draft=s.purchaseDraft;
  const favorites=s.favoriteRoutes.slice(0,3),account=s.account||{};
  const displayName=(account.name||'David').split(' ')[0];
  const unread=s.notificationInbox.filter(item=>!item.read).length;
  main.innerHTML=`
    <section class="page-header home-title v08-hero-title">
      <div><p class="eyebrow">Galizische Bahn</p><h1>${esc(t(greetingKey()))}, ${esc(displayName)}.</h1><p class="subtitle">${esc(t('homeQuestion'))}</p></div>
      <button class="hero-notification ${unread?'has-unread':''}" data-nav="notifications" type="button" aria-label="${esc(t('notifications'))}"><span>◉</span>${unread?`<b>${unread}</b>`:''}</button>
    </section>
    ${draft?`<article class="card resume-purchase v08-resume"><span class="feature-icon">↻</span><div><small>${esc(t('savedPurchase'))}</small><strong>${esc(draft.kind==='journey'?`${draft.journey.from} → ${draft.journey.to}`:draft.product?.name||t('purchase'))}</strong><p>${esc(t('resumeDraftText'))}</p></div><button id="resumePurchase" class="primary" type="button">${esc(t('resumePurchase'))}</button></article>`:''}
    <article class="card home-search-card v08-search-card">
      <div class="search-card-heading"><div><p class="eyebrow">${esc(t('adaptiveHome'))}</p><h2>${esc(t('searchTrip'))}</h2></div><span class="soft-badge">${esc(classLabel(search.travelClass))}</span></div>
      <div class="route-input-stack">
        ${stationSearchMarkup('homeFrom',search.fromId,t('from'))}
        <button id="homeSwap" class="swap floating" type="button" aria-label="${esc(t('changes'))}">⇅</button>
        ${stationSearchMarkup('homeTo',search.toId,t('to'))}
      </div>
      <div class="search-options-row">
        <label><span>${esc(t('date'))}</span><input id="homeDate" type="date" value="${esc(search.date)}"></label>
        <label><span>${esc(t('time'))}</span><input id="homeTime" type="time" value="${esc(search.time)}"></label>
        <button id="homeOptions" type="button"><span>${search.passengers}</span><small>${esc(Number(search.passengers)===1?t('passengerSingular'):t('passengerPlural'))}</small></button>
      </div>
      <input id="homePassengers" type="hidden" value="${esc(search.passengers)}"><input id="homeClass" type="hidden" value="${esc(search.travelClass)}">
      <button id="homeSearch" class="primary full hero-search-button" type="button">${esc(t('mainActionSearch'))}<span>→</span></button>
    </article>
    ${trip?`<section class="section"><div class="section-title"><div><p class="eyebrow">${esc(t('currentTrip'))}</p><h2>${esc(t('journeyAssistant'))}</h2></div><button class="link-button" data-nav="journey">${esc(t('open'))}</button></div>${activeJourneyCard(trip)}</section>`:''}
    ${favorites.length?`<section class="section"><div class="section-title"><h2>${esc(t('favorites'))}</h2><button class="link-button" data-nav="travel">${esc(t('startNewSearch'))}</button></div><div class="favorite-routes v08-favorites">${favorites.map(r=>`<button data-favorite-route="${esc(r.id)}"><span>★</span><div><strong>${esc(getStation(r.fromId)?.city)} → ${esc(getStation(r.toId)?.city)}</strong><small>${esc(classLabel(r.travelClass))}</small></div><b>›</b></button>`).join('')}</div></section>`:''}
    <section class="section"><div class="section-title"><div><p class="eyebrow">${esc(t('liveNetwork'))}</p><h2>${esc(t('importantNotices'))}</h2></div><button class="link-button" data-nav="operations">${esc(t('open'))}</button></div><div class="status-ribbon"><span class="status-dot ok"></span><div><strong>${esc(t('serviceNormal'))}</strong><small>${esc(t('lastUpdated'))}: ${new Date().toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}</small></div><button data-nav="network">${esc(t('maps'))} ›</button></div>${borderFlowCard()}</section>
    ${sub?`<section class="section"><div class="section-title"><h2>${esc(t('galizienTicket'))}</h2><button class="link-button" data-nav="tickets">${esc(t('open'))}</button></div>${subscriptionCard(sub)}</section>`:''}`;
  const fromPicker=bindStationAutocomplete('homeFrom'),toPicker=bindStationAutocomplete('homeTo');
  const from=document.getElementById('homeFrom'),to=document.getElementById('homeTo');
  document.getElementById('homeSwap').addEventListener('click',()=>{const a=from.value,b=to.value;fromPicker.set(b);toPicker.set(a)});
  document.getElementById('homeSearch').addEventListener('click',()=>{const value=readSearchForm('home');store.set(st=>({...st,search:value}));navigate('travel',{autoSearch:true})});
  document.getElementById('homeOptions').addEventListener('click',openQuickSearchOptions);
  document.getElementById('resumePurchase')?.addEventListener('click',()=>{checkout=state().purchaseDraft;resumeCheckout()});
  main.querySelectorAll('[data-favorite-route]').forEach(button=>button.addEventListener('click',()=>{const route=state().favoriteRoutes.find(r=>r.id===button.dataset.favoriteRoute);if(!route)return;store.set(st=>({...st,search:{...st.search,fromId:route.fromId,toId:route.toId,travelClass:route.travelClass}}));navigate('travel',{autoSearch:true})}));
}

function alertMini(a){return `<article class="alert-mini ${a.severity}"><span></span><div><strong>${esc(a.title)}</strong><small>${esc(a.text)}</small></div></article>`}
function subscriptionCard(s){return `<article class="card active-pass"><div><span class="pass-logo">G</span><div><small>${esc(t('activeSubscription'))}</small><h3>${esc(s.name)}</h3><p>${esc(t('validUntil'))}: ${esc(fmtDate(s.validUntil))}</p></div></div><strong>${esc(currency(s.price))}</strong></article>`}

function stationTypeName(station){
  const lang=state()?.language||'de';
  const maps={
    de:{Hbf:'Hauptbahnhof',Bahnhof:'Bahnhof',Flughafen:'Flughafen-Fernbahnhof',Hafen:'Hafenbahnhof','U-Bahn':'U-Bahn-Haltestelle','S-Bahn':'S-Bahn-Station',Grenzbahnhof:'Grenzbahnhof',International:'Internationaler Bahnhof'},
    es:{Hbf:'Estación central',Bahnhof:'Estación ferroviaria',Flughafen:'Estación ferroviaria del aeropuerto',Hafen:'Estación del puerto','U-Bahn':'Estación de U-Bahn','S-Bahn':'Estación de S-Bahn',Grenzbahnhof:'Estación fronteriza',International:'Estación internacional'},
    en:{Hbf:'Central station',Bahnhof:'Railway station',Flughafen:'Airport long-distance station',Hafen:'Harbour station','U-Bahn':'U-Bahn station','S-Bahn':'S-Bahn station',Grenzbahnhof:'Border station',International:'International station'}
  };
  return maps[lang]?.[station?.stationType]||station?.stationType||'';
}
function stationSearchMarkup(prefix,selectedId,label){
  const selected=getStation(selectedId)||STATIONS[0];
  return `<div class="station-autocomplete" data-station-picker="${prefix}"><label for="${prefix}Text">${esc(label)}</label><div class="station-search-input"><span class="station-type-icon">${selected.longDistance?'GB':selected.stationType==='U-Bahn'?'U':'S'}</span><input id="${prefix}Text" type="search" autocomplete="off" value="${esc(selected.name)}" placeholder="${esc((state().language==='es'?'Estación o parada':state().language==='en'?'Station or stop':'Bahnhof oder Haltestelle'))}" aria-autocomplete="list"><input id="${prefix}" type="hidden" value="${esc(selected.id)}"><button type="button" class="station-clear" aria-label="Löschen">×</button></div><div class="station-suggestions" role="listbox" hidden></div></div>`;
}
function bindStationAutocomplete(prefix,onChange){
  const root=document.querySelector(`[data-station-picker="${prefix}"]`);if(!root)return null;
  const text=root.querySelector(`#${prefix}Text`),hidden=root.querySelector(`#${prefix}`),list=root.querySelector('.station-suggestions'),clear=root.querySelector('.station-clear');
  const render=(query='')=>{const q=query.trim().toLocaleLowerCase();let items=STATIONS.filter(s=>!q||`${s.name} ${s.city} ${s.oldName||''} ${stationTypeName(s)}`.toLocaleLowerCase().includes(q));const fav=state().favorites||[];items.sort((a,b)=>(fav.includes(b.id)-fav.includes(a.id))||(b.longDistance-a.longDistance)||a.name.localeCompare(b.name));items=items.slice(0,8);list.innerHTML=items.map(s=>`<button type="button" role="option" data-station-id="${s.id}"><span class="suggestion-icon ${s.longDistance?'long-distance':''}">${s.stationType==='U-Bahn'?'U':s.stationType==='S-Bahn'?'S':s.stationType==='Flughafen'?'✈':'GB'}</span><span><strong>${esc(s.name)}</strong><small>${esc(stationTypeName(s))}${s.oldName&&s.oldName!==s.city?` · ${esc(s.oldName)}`:''}${s.country==='MX'?' · México':''}</small></span>${fav.includes(s.id)?'<b>★</b>':''}</button>`).join('');list.hidden=!items.length;list.querySelectorAll('[data-station-id]').forEach(btn=>btn.addEventListener('click',()=>{const s=getStation(btn.dataset.stationId);hidden.value=s.id;text.value=s.name;root.querySelector('.station-type-icon').textContent=s.longDistance?'GB':s.stationType==='U-Bahn'?'U':'S';list.hidden=true;hidden.dispatchEvent(new Event('change',{bubbles:true}));onChange?.(s)}))};
  text.addEventListener('focus',()=>render(text.value===getStation(hidden.value)?.name?'':text.value));text.addEventListener('input',()=>{hidden.value='';render(text.value)});text.addEventListener('blur',()=>setTimeout(()=>{list.hidden=true;if(!hidden.value){const exact=STATIONS.find(s=>s.name.toLocaleLowerCase()===text.value.trim().toLocaleLowerCase());const fallback=exact||getStation(state().search[prefix.toLowerCase().includes('from')?'fromId':'toId'])||STATIONS[0];hidden.value=fallback.id;text.value=fallback.name}},180));clear.addEventListener('click',()=>{text.value='';hidden.value='';text.focus();render('')});
  return{hidden,text,set(id){const s=getStation(id);if(s){hidden.value=s.id;text.value=s.name}},value:()=>hidden.value};
}
function stationOptions(selected){return STATIONS.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}</option>`).join('')}
function renderTravel(opts={}){
  const s=state().search;
  main.innerHTML=`<section class="page-header v08-page-title"><div><p class="eyebrow">${esc(t('longDistance'))}</p><h1>${esc(t('searchTrip'))}</h1><p class="subtitle">${esc(t('appTagline'))}</p></div><button class="round-action" data-nav="network" aria-label="${esc(t('maps'))}">◇</button></section>
  <article class="card search-card v08-search-form">
    <div class="route-input-stack">
      ${stationSearchMarkup('travelFrom',s.fromId,t('from'))}
      <button id="swapStations" class="swap floating" type="button">⇅</button>
      ${stationSearchMarkup('travelTo',s.toId,t('to'))}
    </div>
    <div class="search-grid-four">
      <label><span>${esc(t('date'))}</span><input id="travelDate" type="date" value="${esc(s.date)}"></label>
      <label><span>${esc(t('time'))}</span><input id="travelTime" type="time" value="${esc(s.time)}"></label>
      <label><span>${esc(t('passengers'))}</span><select id="travelPassengers">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===Number(s.passengers)?'selected':''}>${n}</option>`).join('')}</select></label>
      <label><span>${esc(t('travelClass'))}</span><select id="travelClass"><option value="2" ${s.travelClass==='2'?'selected':''}>${esc(t('secondClass'))}</option><option value="1" ${s.travelClass==='1'?'selected':''}>${esc(t('firstClass'))}</option></select></label>
    </div>
    <p class="context-hint">${esc(t('noDuplicateOptions'))}</p>
    <button id="searchJourneys" class="primary full hero-search-button" type="button">${esc(t('mainActionSearch'))}<span>→</span></button>
  </article>
  <div id="internationalBanner"></div>
  <section id="resultsSection" class="section" hidden><div class="section-title"><div><p class="eyebrow">${esc(t('recommended'))}</p><h2>${esc(t('connections'))}</h2></div><span id="resultCount" class="result-count"></span></div><div id="journeyFilters" class="filter-chips"></div><div id="journeyResults" class="result-list v08-result-list"></div></section>`;
  const fromPicker=bindStationAutocomplete('travelFrom'),toPicker=bindStationAutocomplete('travelTo');
  const from=document.getElementById('travelFrom'),to=document.getElementById('travelTo');
  const updateBanner=()=>{document.getElementById('internationalBanner').innerHTML=(getStation(from.value)?.country==='MX'||getStation(to.value)?.country==='MX')?borderFlowCard():'';bindNav(document.getElementById('internationalBanner'))};
  from.addEventListener('change',updateBanner);to.addEventListener('change',updateBanner);updateBanner();
  document.getElementById('swapStations').addEventListener('click',()=>{const a=from.value,b=to.value;fromPicker.set(b);toPicker.set(a);updateBanner()});
  document.getElementById('searchJourneys').addEventListener('click',()=>beginTravelSearch());
  if(opts.autoSearch)requestAnimationFrame(()=>beginTravelSearch());
}
function federalNotice(){return`<article class="card federal-card standalone border-notice compact-border-notice"><span class="border-notice-mark">SJR</span><div class="border-notice-content"><h3>${esc(t('borderCenter'))}</h3><p>${esc(t('borderOnlySJR'))}</p><div class="border-notice-facts"><div><span class="fact-icon">ID</span><strong>${esc(t('documents'))}</strong></div><div><span class="fact-icon">45</span><strong>${esc(t('borderWait'))}: 45 min</strong></div><div><span class="fact-icon">↔</span><strong>${esc(t('mandatoryTransfer'))}</strong></div></div></div></article>`}
function performTravelSearch(search=null){
  const value=search||readSearchForm('travel');
  store.set(s=>({...s,search:value}));
  currentJourneys=createJourneys(value);
  const business=activeSubscription()?.productId==='BUSINESS';
  if(business)currentJourneys=currentJourneys.map(j=>({...j,price:Math.round(j.price*.85),businessDiscount:true}));
  renderJourneyResults();
}
function connectionLabel(j){return j.connection==='safe'?t('connectionSafe'):j.connection==='risk'?t('connectionRisk'):t('connectionMissed')}
function resultServices(j){
  const services=(j.displayServices?.length?j.displayServices:j.segments?.filter(segment=>segment.kind==='train').map(segment=>({type:segment.type,train:segment.train,weight:segment.path?.length||2}))||[{type:j.type,train:j.train,weight:1}]);
  return services.map(service=>({...service,weight:Math.max(1,Number(service.weight)||1)}));
}
function resultServiceStrip(j){
  const services=resultServices(j),total=services.reduce((sum,service)=>sum+service.weight,0);
  return `<div class="gb-service-strip" aria-label="${esc(services.map(service=>service.train).join(', '))}">${services.map(service=>`<span class="gb-service-segment ${esc(service.type)}" style="--segment:${service.weight/total}"><i>${esc(service.train)}</i></span>`).join('')}</div>`;
}
function resultOperationalMessage(j){
  if(j.connection==='missed')return `<div class="gb-result-alert danger"><span>!</span><p>${esc(connectionLabel(j))}</p></div>`;
  if(j.connection==='risk')return `<div class="gb-result-alert warning"><span>!</span><p>${esc(connectionLabel(j))}</p></div>`;
  if(j.international)return `<div class="gb-result-alert border"><span>SJR</span><p>${esc(t('mandatoryTransfer'))} · ${esc(t('borderControl'))} · ${j.borderMinutes} min</p></div>`;
  if(j.delay>=8)return `<div class="gb-result-alert danger"><span>!</span><p>+${j.delay} min · ${esc(t('platform'))} ${esc(j.platform)}</p></div>`;
  return '';
}
function renderJourneyResults(){
  const section=document.getElementById('resultsSection'),list=document.getElementById('journeyResults'),filters=document.getElementById('journeyFilters');
  if(!section||!list)return;
  const ui=state().ui;
  let journeys=[...currentJourneys];
  if(ui.directOnly)journeys=journeys.filter(j=>!j.changes);
  if(ui.journeySort==='fastest')journeys.sort((a,b)=>a.duration-b.duration);
  else if(ui.journeySort==='cheapest')journeys.sort((a,b)=>a.price-b.price);
  else journeys.sort((a,b)=>(a.delay+a.changes*10)-(b.delay+b.changes*10));
  section.hidden=false;document.getElementById('resultCount').textContent=String(journeys.length);
  filters.innerHTML=`<button data-sort="recommended" class="${ui.journeySort==='recommended'?'active':''}">${esc(t('recommended'))}</button><button data-sort="fastest" class="${ui.journeySort==='fastest'?'active':''}">${esc(t('fastest'))}</button><button data-sort="cheapest" class="${ui.journeySort==='cheapest'?'active':''}">${esc(t('cheapest'))}</button><button data-direct class="${ui.directOnly?'active':''}">${esc(t('directOnly'))}</button>`;
  filters.querySelectorAll('[data-sort]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,journeySort:button.dataset.sort}}));renderJourneyResults()}));
  filters.querySelector('[data-direct]').addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,directOnly:!s.ui.directOnly}}));renderJourneyResults()});
  if(!journeys.length){list.innerHTML=`<article class="empty"><b>⌕</b><h3>${esc(t('noRoute'))}</h3><button id="resetJourneyFilters" class="secondary">${esc(t('resetFilters'))}</button></article>`;document.getElementById('resetJourneyFilters').addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,directOnly:false,journeySort:'recommended'}}));renderJourneyResults()});return;}
  const best=Math.min(...journeys.map(j=>j.price)),fast=Math.min(...journeys.map(j=>j.duration));
  list.innerHTML=journeys.map((j,index)=>{
    const plannedArrival=j.delay?addTime(j.arrival,-j.delay):j.arrival;
    const actualDeparture=j.delay?addTime(j.departure,Math.min(j.delay,9)):j.departure;
    const actualTimes=j.delay?`<div class="gb-result-live-times"><span>${esc(actualDeparture)}</span><span>${esc(j.arrival)}</span></div>`:'';
    const transferText=j.changes?`${j.changes} ${esc(t('changes'))}`:esc(t('direct'));
    return `<button class="journey-card gb-connection-result ${j.international?'international-journey':''}" data-journey="${esc(j.id)}" type="button">
      <div class="gb-result-topline">
        <div class="gb-result-times"><strong>${esc(j.departure)} – ${esc(plannedArrival)}</strong><span>${esc(duration(j.duration))}${j.changes?` · ${esc(transferText)}`:''}</span></div>
        ${occupancyBadge(j.occupancy)}
      </div>
      ${actualTimes}
      ${resultServiceStrip(j)}
      <div class="gb-result-origin">${esc(t('resultFrom'))} ${esc(j.from)}</div>
      ${resultOperationalMessage(j)}
      <div class="gb-result-footer"><span class="gb-result-state ${j.delay?'delayed':'on-time'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span><strong><small>${esc(t('fromPrice'))}</small>${esc(currency(j.price))}<b>›</b></strong></div>
      ${index===0?`<i class="gb-recommended-mark">${esc(t('recommended'))}</i>`:''}
    </button>`;
  }).join('');
  list.querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>openJourney(currentJourneys.find(j=>j.id===button.dataset.journey))));
  section.scrollIntoView({behavior:state().reduceMotion?'auto':'smooth'});
}
function journeyTimelineHTML(j){
  if(!j.segments?.length)return'';
  return`<div class="international-timeline">${j.segments.map((segment,index)=>{
    if(segment.kind==='border'){
      return`<article class="border-process"><div class="border-process-icon">SJR</div><div><p class="eyebrow">${esc(t('borderControl'))}</p><h3>${esc(t('borderCenter'))}</h3><p>${esc(segment.start)}–${esc(segment.end)} · ${segment.minutes} min</p><div class="chips"><i>${esc(t('documents'))}</i><i>${esc(t('customs'))}</i><i>${esc(t('migrationFilter'))}</i></div></div></article>${index<j.segments.length-1?`<div class="mandatory-transfer-marker">↓ ${esc(t('mandatoryTransfer'))}</div>`:''}`;
    }
    const from=getStation(segment.fromId),to=getStation(segment.toId),isUrban=segment.kind==='urban';
    const corridor=segment.corridorName?`<small class="corridor-name">${esc(segment.corridorName)}${segment.corridorId?` · ${esc(segment.corridorId)}`:''}</small>`:'';
    const platforms=!isUrban&&segment.platformDeparture?`<div class="segment-platforms"><span><small>${esc(t('platform'))}</small><strong>${esc(segment.platformDeparture)}</strong></span><span><small>${esc(t('platform'))}</small><strong>${esc(segment.platformArrival||'—')}</strong></span></div>`:'';
    const facts=!isUrban&&(segment.rollingStock||segment.frequency)?`<div class="segment-operating-facts">${segment.rollingStock?`<span>${esc(segment.rollingStock)}</span>`:''}${segment.frequency?`<span>${segment.frequency>=1440?t('dailyService'):`${t('operationFrequency')} ${segment.frequency} min`}</span>`:''}</div>`:'';
    return`<article class="segment-card official-segment-card"><div class="segment-head"><div><span class="service-badge ${esc(segment.type)}">${esc(segment.train)}</span>${corridor}</div>${occupancyBadge(segment.occupancy)}</div><div class="segment-route"><div><strong>${esc(segment.departure)}</strong><small>${esc(from?.name||'')}</small></div><span></span><div><strong>${esc(segment.arrival)}</strong><small>${esc(to?.name||'')}</small></div></div>${platforms}${facts}${segment.corridorId==='RBM90'?`<p class="segment-note">${esc(t('mexicoRB'))} · ${esc(t('noDirectICE'))}</p>`:''}</article>`;
  }).join('')}</div>`;
}
function compositionHTML(j){const coaches=j.composition||j.segments?.find(s=>s.kind==='train'&&s.type!=='RB')?.composition||[];return`<div class="composition-strip">${coaches.map(c=>`<div><b>${esc(c.coach)}</b><span>${esc(coachKindLabel(c.kind))}</span><i class="${esc(c.occupancy)}"></i></div>`).join('')}</div>`}
function openJourney(j){
  selectedJourney=j;
  const fares=FARES.filter(f=>!f.international||j.international);
  const favorite=isFavoriteRoute(j.fromId,j.toId,j.travelClass);
  showModal(j.international?t('internationalRoute'):t('connections'),`<article><div class="journey-top"><span class="service-badge ${esc(j.type)}">${esc(j.train)}</span><span class="status ${j.delay?'warn':'ok'}">${j.delay?`+${j.delay} min`:esc(t('onTime'))}</span></div>${journeyTimelineHTML(j)}${j.international?`<article class="official-advisory-inline"><strong>Auswärtiges Amt</strong><p>${esc(t('travelWarningBody'))}</p></article>${federalNotice()}`:''}<section class="detail-section"><div class="section-title"><h3>${esc(t('trainComposition'))}</h3>${occupancyBadge(j.occupancy)}</div>${compositionHTML(j)}<div class="train-facts"><span><small>${esc(t('trainLength'))}</small><strong>${(j.composition?.length||6)*27} m</strong></span><span><small>${esc(t('coaches'))}</small><strong>${j.composition?.length||6}</strong></span><span><small>${esc(t('sector'))}</small><strong>${String.fromCharCode(65+(seed(j.id)%4))}</strong></span></div></section><h3>${esc(t('fare'))}</h3><div class="fare-list">${fares.map((f,i)=>`<label class="fare-choice ${i===0?'selected':''}"><input type="radio" name="fare" value="${f.id}" ${i===0?'checked':''}><span><strong>${esc(fareName(f))}</strong><small>${fareDescription(f)}</small></span><b>${esc(currency(Math.round(j.price*f.factor)))}</b></label>`).join('')}</div><button id="favoriteJourney" class="favorite-toggle ${favorite?'selected':''}" type="button">${favorite?'★':'☆'} ${esc(favorite?t('removeFavoriteShort'):t('addFavorite'))}</button><div class="button-row"><button id="cancelJourneyDetail" class="secondary" type="button">${esc(t('cancel'))}</button><button id="startCheckout" class="primary" type="button">${esc(t('continue'))}</button></div></article>`,{closable:true});
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
  checkout={id:uid('CHK'),kind:'journey',journey,fare:{...fare,name:fareName(fare)},step:journey.type==='RE'?2:1,seat:null,cabinExtra:0,extras:{bike:false,upgrade:false,seatReservation:false,specialLuggage:false,pet:false},traveler:{name:state().frequentPassengers[0]||'David J. Martínez',document:'',documentsConfirmed:false},basePrice:Math.round(journey.price*fare.factor),paymentFields:{},createdAt:new Date().toISOString()};
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
    const options=[{id:'SEAT',name:t('seat'),p:0},{id:'BERTH',name:t('bed'),p:34},{id:'CABIN',name:t('cabin'),p:89}];
    if(!checkout.seat){checkout.seat='SEAT';checkout.cabinExtra=0}
    body.innerHTML=`<p class="muted">${esc(t('nightTrain'))}</p><div class="cabin-options">${options.map(x=>`<button class="cabin-option ${checkout.seat===x.id?'selected':''}" data-cabin="${x.id}" data-price="${x.p}" type="button"><strong>${esc(x.name)}</strong><small>+${x.p} GM</small></button>`).join('')}</div>${checkoutButtons({back:false,nextId:'seatNext'})}`;
    body.querySelectorAll('[data-cabin]').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-cabin]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.cabinExtra=Number(b.dataset.price);checkout.seat=b.dataset.cabin;persistCheckout()}));
  }else{
    const coach=effectiveClass()==='1'?`${t('coach')} 1 · ${t('firstClass')}`:`${t('coach')} 5 · ${t('quiet')}`;
    body.innerHTML=`<div class="seat-legend"><span><i class="available"></i>${esc(t('seat'))}</span><span><i class="occupied"></i>${esc(t('occupied'))}</span><span><i class="selected"></i>${esc(t('chosen'))}</span></div><div class="coach"><div class="coach-label">${esc(coach)}</div><div class="seat-grid">${makeSeats(checkout.journey.id+effectiveClass(),checkout.seat)}</div></div><p id="seatStatus" class="muted">${checkout.seat?`${esc(t('seat'))}: ${esc(checkout.seat)}`:esc(t('seatSelection'))}</p>${checkoutButtons({back:false,nextId:'seatNext',disabled:!checkout.seat})}`;
    body.querySelectorAll('[data-seat]:not(.occupied)').forEach(b=>b.addEventListener('click',()=>{body.querySelectorAll('[data-seat]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');checkout.seat=b.dataset.seat;document.getElementById('seatStatus').textContent=`${t('seat')}: ${checkout.seat}`;document.getElementById('seatNext').disabled=false;persistCheckout()}));
  }
  bindCheckoutShell();
  document.getElementById('seatNext').addEventListener('click',()=>{checkout.step=2;persistCheckout();renderCheckout()});
}

function makeSeats(id,selected=null){let html='';for(let row=11;row<=18;row++){for(const letter of ['A','B','C','D']){const code=`${row}${letter}`,occupied=seed(id+code)%5===0;html+=`<button type="button" data-seat="${code}" class="seat ${occupied?'occupied':''} ${selected===code?'selected':''}" ${occupied?'disabled':''}>${code}</button>`}if(row===14)html+=`<div class="table-label">${esc(t('table'))}</div>`}return html}
function renderTravelerStep(){
  const body=document.getElementById('checkoutBody');
  body.innerHTML=`<div class="checkout-form traveler-form"><div class="field form-field"><label for="travelerName">${esc(t('traveler'))}</label><input id="travelerName" list="frequentPassengers" value="${esc(checkout.traveler.name)}"><datalist id="frequentPassengers">${state().frequentPassengers.map(name=>`<option value="${esc(name)}">`).join('')}</datalist></div>${checkout.journey.international?`${federalNotice()}<div class="field form-field"><label for="documentNumber">${esc(t('passportDemo'))}</label><input id="documentNumber" placeholder="GZ1234567" maxlength="12" value="${esc(checkout.traveler.document||'')}"></div><label class="check-row refined-check"><input id="documentsConfirmed" type="checkbox" ${checkout.traveler.documentsConfirmed?'checked':''}><span>${esc(t('documentsConfirm'))}</span></label>`:''}</div>${checkoutButtons({back:checkout.journey.type!=='RE',nextId:'travNext'})}`;
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
  const product=checkout.product;const start=new Date(),end=new Date(start);end.setMonth(end.getMonth()+1);const sub={id:uid('GBA'),productId:product.id,name:product.name,price:product.price,status:'active',startedAt:start.toISOString(),validUntil:end.toISOString().slice(0,10),renewal:end.toISOString().slice(0,10),payment:{brand:result.card.brand,last4:result.last4,kind:result.kind}};
  store.set(s=>({...s,purchaseDraft:null,subscriptions:[sub,...s.subscriptions.map(x=>({...x,status:'replaced'}))],orders:[{id:result.authorization,type:'subscription',description:product.name,amount:product.price,date:new Date().toISOString(),paymentKind:result.kind},...s.orders]}));paymentRun++;checkout=null;closeModal();toast(t('approved'));navigate('tickets');
}

function finalizeLocalTicket(result){
  const {type,name,network,routeData}=checkout.product;const validUntil=type==='day'?new Date(Date.now()+18*3600000).toISOString():new Date(Date.now()+90*60000).toISOString();const ticket={id:uid('GBU'),kind:'urban',name,network,price:checkout.price,status:'active',qrValid:true,validFrom:new Date().toISOString(),validUntil,route:routeData,payment:{brand:result.card.brand,last4:result.last4,authorization:result.authorization,kind:result.kind}};
  store.set(s=>({...s,purchaseDraft:null,tickets:[ticket,...s.tickets],orders:[{id:result.authorization,type:'urban',description:`${ticket.name} · ${network}`,amount:ticket.price,date:new Date().toISOString(),paymentKind:result.kind},...s.orders]}));paymentRun++;checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets');
}

function paymentForm(price){
  const f=checkout?.paymentFields||{};
  const language=state().language||'de';
  const securityHelp=language==='de'?'3 oder 4 Ziffern auf der Kartenrückseite.':language==='es'?'3 o 4 dígitos del reverso de la tarjeta.':'3 or 4 digits on the back of the card.';
  const expiryHelp=language==='de'?'Format MM/JJ':language==='es'?'Formato MM/AA':'Format MM/YY';
  return `<article class="demo-payment compact-demo"><strong>DEMO</strong><p>${esc(t('demoPayment'))}</p></article>
  <div class="order-total refined-total"><span>${esc(language==='de'?'Gesamtbetrag':language==='es'?'Total a pagar':'Total due')}</span><strong>${esc(currency(price))}</strong></div>
  <section class="payment-form-section" aria-label="${esc(t('payment'))}">
    <div class="field form-field"><label for="payHolder">${esc(t('cardholder'))}</label><input id="payHolder" autocomplete="cc-name" value="${esc(f.holder||'David J. Martínez')}"></div>
    <div class="field form-field"><label for="payNumber">${esc(t('cardNumber'))}</label><input id="payNumber" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242" value="${esc(f.number||'')}"><small>${esc(t('cardHelp'))}</small></div>
    <div class="field-grid payment-field-grid">
      <div class="field form-field"><label for="payExpiry">${esc(t('expiry'))}</label><input id="payExpiry" inputmode="numeric" autocomplete="cc-exp" placeholder="12/30" value="${esc(f.expiry||'')}"><small>${esc(expiryHelp)}</small></div>
      <div class="field form-field"><label for="payCvv">${esc(t('cvv'))}</label><input id="payCvv" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4" value="${esc(f.cvv||'')}"><small>${esc(securityHelp)}</small></div>
    </div>
    <div class="field form-field"><label for="payAddress">${esc(t('billingAddress'))}</label><input id="payAddress" autocomplete="street-address" value="${esc(f.address||'Musterstraße 12, Guadalajara')}"></div>
    <div class="field form-field"><label for="payCountry">${esc(t('country'))}</label><select id="payCountry" autocomplete="country"><option value="GL" ${(f.country||'GL')==='GL'?'selected':''}>${esc(t('countryGalizia'))}</option><option value="MX" ${f.country==='MX'?'selected':''}>${esc(t('countryMexico'))}</option><option value="DE" ${f.country==='DE'?'selected':''}>${esc(t('countryGermany'))}</option></select></div>
  </section>
  <label class="check-row refined-check"><input id="savePay" type="checkbox" ${f.save?'checked':''}><span>${esc(t('saveTestCard'))}</span></label>
  <div id="paymentProgress" class="payment-progress" hidden aria-live="polite"></div>`;
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
  const ticket={...j,id:uid('GBT'),status:'active',qrValid:true,fare:checkout.fare.name,fareId:checkout.fare.id,refundability:checkout.fare.refundable,changeability:checkout.fare.changeable,travelClass:effectiveClass(),price:checkout.price,coach:j.night?'NJ':effectiveClass()==='1'?'1':String(2+seed(j.id)%7),seat:checkout.seat||'Ohne Reservierung',passenger:checkout.traveler.name,document:checkout.traveler.document,extras:checkout.extras,payment:{brand:payment.card.brand,last4:payment.last4,authorization:payment.authorization,kind:payment.kind},bookedAt:new Date().toISOString()};
  store.set(s=>({...s,purchaseDraft:null,tickets:[ticket,...s.tickets],orders:[{id:payment.authorization,type:'ticket',description:`${j.train} ${j.from} – ${j.to}`,amount:checkout.price,date:new Date().toISOString(),paymentKind:payment.kind},...s.orders],activeTicketId:ticket.id}));paymentRun++;checkout=null;closeModal();toast(t('ticketBooked'));navigate('tickets');
}

function renderCity(){
  const urban=state().urban,network=getUrbanNetwork(urban.cityId),view=state().ui.cityView||'planner',mode=state().ui.cityMode||'all',cityFavorite=state().favoriteCities.includes(network.id);
  const filteredLines=mode==='all'?network.lines:network.lines.filter(line=>line.mode===mode);
  let content='';
  if(view==='planner')content=`<article class="card urban-planner"><h2>${esc(t('routePlanner'))}</h2><div class="field"><label for="urbanFrom">${esc(t('from'))}</label><select id="urbanFrom">${network.stops.map(stop=>`<option ${stop===urban.from?'selected':''}>${esc(stop)}</option>`).join('')}</select></div><div class="field"><label for="urbanTo">${esc(t('to'))}</label><select id="urbanTo">${network.stops.map(stop=>`<option ${stop===urban.to?'selected':''}>${esc(stop)}</option>`).join('')}</select></div><button id="urbanSearch" class="primary full">${esc(t('find'))}</button><div id="urbanResult"></div></article>`;
  if(view==='departures')content=`<section><div class="section-title"><h2>${esc(t('departures'))}</h2><span class="live-dot">● LIVE</span></div><div class="departure-board">${urbanDepartures(network,mode)}</div><div class="line-list city-line-list">${filteredLines.map(urbanLineCard).join('')}</div></section>`;
  if(view==='map')content=`<article class="card urban-network-card"><div class="urban-map-scroll">${urbanNetworkMap(network,mode)}</div></article><div class="line-list city-line-list">${filteredLines.map(urbanLineCard).join('')}</div>`;
  main.innerHTML=`<section class="page-header city-header"><div><p class="eyebrow">${esc(t('urban'))}</p><h1>${esc(t('cityTravel'))}</h1><p class="subtitle">${esc(t('cityOverview'))}</p></div><button id="favoriteCity" class="favorite-icon ${cityFavorite?'selected':''}" type="button" aria-label="${esc(cityFavorite?t('removeFavoriteShort'):t('addFavorite'))}">${cityFavorite?'★':'☆'}</button></section><div class="field city-picker"><label for="urbanCity">${esc(t('metropolitanArea'))}</label><select id="urbanCity">${URBAN_NETWORKS.map(n=>`<option value="${n.id}" ${n.id===network.id?'selected':''}>${esc(n.name)} (${esc(n.oldName)})</option>`).join('')}</select></div><div class="city-action-tabs"><button data-city-view="planner" class="${view==='planner'?'active':''}"><b>⌕</b><span>${esc(t('planner'))}</span></button><button data-city-view="departures" class="${view==='departures'?'active':''}"><b>◷</b><span>${esc(t('departuresView'))}</span></button><button data-city-view="map" class="${view==='map'?'active':''}"><b>⌘</b><span>${esc(t('mapView'))}</span></button></div>${view!=='planner'?`<div class="mode-tabs compact-tabs"><button data-city-mode="all" class="${mode==='all'?'active':''}">${esc(t('allLines'))}</button><button data-city-mode="U" class="${mode==='U'?'active':''}">U-Bahn</button><button data-city-mode="S" class="${mode==='S'?'active':''}">S-Bahn</button></div>`:''}<section class="section city-content">${content}</section><section class="section"><div class="section-title"><h2>${esc(t('urbanTickets'))}</h2><button class="link-button" id="openSubscriptions">${esc(t('subscriptions'))}</button></div><div class="urban-products"><button data-local-ticket="single"><span><strong>${esc(t('singleTicket'))}</strong><small>90 min · ${esc(t('cityZone'))}</small></span><b>4 GM</b></button><button data-local-ticket="day"><span><strong>${esc(t('dayTicket'))}</strong><small>${esc(t('untilEndOfService'))}</small></span><b>14 GM</b></button></div></section>`;
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
function urbanDepartures(network,mode){const now=new Date(),lines=mode==='all'?network.lines:network.lines.filter(line=>line.mode===mode);return lines.slice(0,8).map((line,index)=>{const mins=2+index*3,time=new Date(now.getTime()+mins*60000).toTimeString().slice(0,5);return`<div class="departure-row"><time>${time}</time><span class="line-pill" style="--line:${line.color}">${esc(line.id)}</span><div><strong>${esc(line.stops.at(-1))}</strong><small>${esc(t('inTime'))} ${mins} ${esc(t('minutes'))} · ${esc(t('onTime'))}</small></div><b>${esc(t('platform'))} ${1+index%4}</b></div>`}).join('')}
function urbanLineCard(l){return `<button data-line="${l.id}" class="urban-line"><span class="line-pill" style="--line:${l.color}">${esc(l.id)}</span><span><strong>${esc(l.stops[0])} ↔ ${esc(l.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${l.minutes} ${esc(t('minutes'))} · ${l.stops.length} ${esc(t('stationCount'))}</small></span><b>›</b></button>`}
function performUrbanSearch(){const n=getUrbanNetwork(state().urban.cityId),from=document.getElementById('urbanFrom').value,to=document.getElementById('urbanTo').value;store.set(s=>({...s,urban:{...s.urban,from,to}}));const route=planUrban(n,from,to),target=document.getElementById('urbanResult');if(!route){target.innerHTML=`<p class="error-text">${esc(t('noRoute'))}</p>`;return}target.innerHTML=`<article class="urban-result"><div class="urban-summary"><strong>${esc(duration(route.minutes))}</strong><span>${route.changes} ${esc(t('changes'))}</span></div>${route.steps.map((s,i)=>`<div class="urban-step"><span class="line-pill" style="--line:${s.color}">${esc(s.lineId)}</span><div><strong>${esc(s.from)} → ${esc(s.to)}</strong><small>${s.stops} ${esc(t('stationCount'))} · ${s.minutes} min</small></div></div>${i<route.steps.length-1?`<div class="transfer">${esc(t('changes'))} · 6 min</div>`:''}`).join('')}<button id="buyUrbanRoute" class="primary full">${esc(t('buyTicket'))} · 4 GM</button></article>`;document.getElementById('buyUrbanRoute').addEventListener('click',()=>startLocalTicketCheckout('single',n,{from,to,route}))}
function openUrbanLine(network,lineId){const line=network.lines.find(x=>x.id===lineId);showModal(`${line.id} · ${network.name}`,`<div class="line-detail"><div class="line-header"><span class="line-pill big" style="--line:${line.color}">${esc(line.id)}</span><div><strong>${esc(line.stops[0])} ↔ ${esc(line.stops.at(-1))}</strong><small>${esc(t('frequency'))}: ${line.minutes} min</small></div></div><div class="single-line-map"><span style="--line:${line.color}"></span>${line.stops.map(stop=>`<div><i style="--line:${line.color}"></i><small>${esc(stop)}</small></div>`).join('')}</div><div class="urban-timeline">${line.stops.map((stop,index)=>`<div><span></span><strong>${esc(stop)}</strong><small>${addTime(new Date().toTimeString().slice(0,5),index*3)}</small></div>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="lineClose" type="button">${esc(t('close'))}</button></div>`,{closable:true});document.getElementById('lineClose').addEventListener('click',()=>closeModal())}
function startLocalTicketCheckout(type,network,routeData=null){checkout={id:uid('CHK'),kind:'local',product:{type,name:type==='day'?t('dayTicket'):t('singleTicket'),price:type==='day'?14:4,network:network.name,routeData},basePrice:type==='day'?14:4,price:type==='day'?14:4,step:4,paymentFields:{},origin:'city'};persistCheckout();renderDirectPaymentCheckout()}
function openSubscriptions(){
  showModal(t('subscriptions'),`<div class="subscription-list">${SUBSCRIPTIONS.map(product=>{const copy=subscriptionPresentation(product);return`<article class="subscription-option"><div class="subscription-head"><div><h3>${esc(product.name)}</h3><p>${esc(copy.eligibility)}</p></div><strong>${product.price} GM<small>${esc(t('monthly'))}</small></strong></div><ul>${copy.features.map(feature=>`<li>${esc(feature)}</li>`).join('')}</ul><p class="warning-copy">${esc(t('notLongDistance'))}</p><p class="warning-copy">${esc(t('mexicoLimit'))}</p><button class="primary full" data-subscribe="${product.id}">${esc(t('subscribe'))}</button></article>`}).join('')}</div><button class="secondary full modal-bottom-cancel" id="closeSubscriptions" type="button">${esc(t('cancel'))}</button>`,{closable:true});
  modalRoot.querySelectorAll('[data-subscribe]').forEach(button=>button.addEventListener('click',()=>startSubscriptionCheckout(SUBSCRIPTIONS.find(product=>product.id===button.dataset.subscribe))));
  document.getElementById('closeSubscriptions').addEventListener('click',()=>closeModal());
}
function startSubscriptionCheckout(product){checkout={id:uid('CHK'),kind:'subscription',product,basePrice:product.price,price:product.price,step:4,paymentFields:{},origin:'subscriptions'};persistCheckout();renderDirectPaymentCheckout()}
function renderTickets(){
  const s=state(),tab=s.ui.ticketTab||'active',active=s.tickets.filter(x=>x.status!=='cancelled'),cancelled=s.tickets.filter(x=>x.status==='cancelled'),subs=s.subscriptions.filter(x=>x.status==='active');
  let content='';
  if(tab==='active')content=active.length?`<div class="ticket-list v08-ticket-list">${active.map(ticketCard).join('')}</div>`:`<article class="card empty refined-empty"><b>▣</b><h2>${esc(t('noActiveTickets'))}</h2><p>${esc(t('noTicketsText'))}</p><button class="primary" data-nav="travel">${esc(t('startNewSearch'))}</button></article>`;
  if(tab==='subscriptions')content=subs.length?`<div class="subscription-list">${subs.map(subscriptionCard).join('')}</div>`:`<article class="card empty refined-empty"><b>G</b><h2>${esc(t('galizienTicket'))}</h2><p>${esc(t('validLocal'))}</p><button class="primary" id="ticketSubscribe">${esc(t('subscribe'))}</button></article>`;
  if(tab==='cancelled')content=cancelled.length?`<div class="ticket-list v08-ticket-list cancelled-list">${cancelled.map(ticketCard).join('')}</div>`:`<article class="card empty refined-empty"><b>×</b><h2>${esc(t('noCancelledTickets'))}</h2></article>`;
  if(tab==='history')content=s.orders.length?`<div class="order-list v08-order-list">${s.orders.map(o=>`<article class="card order-row ${o.amount<0?'refund-row':''}"><div><strong>${esc(o.description)}</strong><small>${new Date(o.date).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</small></div><b>${o.amount<0?'−':''}${esc(currency(Math.abs(o.amount)))}</b></article>`).join('')}</div>`:`<article class="card empty refined-empty"><b>≡</b><h2>${esc(t('noHistory'))}</h2></article>`;
  main.innerHTML=`<section class="page-header v08-page-title"><div><p class="eyebrow">GB Wallet</p><h1>${esc(t('tickets'))}</h1><p class="subtitle">${esc(t('ticketSummary'))}</p></div><span class="header-counter">${active.length}</span></section>
  <div class="ticket-segmented" role="tablist"><button data-ticket-tab="active" class="${tab==='active'?'active':''}" role="tab">${esc(t('activeShort'))}<i>${active.length}</i></button><button data-ticket-tab="subscriptions" class="${tab==='subscriptions'?'active':''}" role="tab">${esc(t('passesShort'))}<i>${subs.length}</i></button><button data-ticket-tab="cancelled" class="${tab==='cancelled'?'active':''}" role="tab">${esc(t('cancelledShort'))}<i>${cancelled.length}</i></button><button data-ticket-tab="history" class="${tab==='history'?'active':''}" role="tab">${esc(t('historyShort'))}</button></div>
  <section class="section ticket-content">${content}</section>`;
  main.querySelectorAll('[data-ticket-tab]').forEach(button=>button.addEventListener('click',()=>{store.set(st=>({...st,ui:{...st.ui,ticketTab:button.dataset.ticketTab}}));renderTickets()}));
  main.querySelectorAll('[data-ticket-id]').forEach(button=>button.addEventListener('click',()=>openTicket(state().tickets.find(x=>x.id===button.dataset.ticketId))));
  document.getElementById('ticketSubscribe')?.addEventListener('click',openSubscriptions);
  main.querySelectorAll('[data-cancel-sub]').forEach(button=>button.addEventListener('click',()=>cancelSubscription(button.dataset.cancelSub)));
}

function ticketCard(ticket){
  const cancelled=ticket.status==='cancelled';
  if(ticket.kind==='urban')return `<button class="ticket-summary v08-ticket-card urban ${cancelled?'cancelled':''}" data-ticket-id="${esc(ticket.id)}"><div class="ticket-card-main"><div class="ticket-card-top"><span class="service-badge S">STADT</span><span class="ticket-state ${cancelled?'bad':'good'}">${esc(cancelled?t('ticketStatusCancelled'):t('ticketStatusActive'))}</span></div><h3>${esc(ticket.name)}</h3><p>${esc(ticket.network)}</p><div class="ticket-card-meta"><span>${esc(cancelled?t('cancelledAt'):t('validUntil'))}</span><strong>${new Date(cancelled?ticket.cancelledAt:ticket.validUntil).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</strong></div></div><div class="ticket-card-aside"><strong>${cancelled?esc(currency(ticket.refundAmount||0)):esc(currency(ticket.price))}</strong><small>${cancelled?esc(t('refund')):esc(t('openDetails'))}</small><b>›</b></div></button>`;
  return `<button class="ticket-summary v08-ticket-card ${cancelled?'cancelled':''}" data-ticket-id="${esc(ticket.id)}"><div class="ticket-card-main"><div class="ticket-card-top"><span class="service-badge ${esc(ticket.type)}">${esc(ticket.train)}</span><span class="ticket-state ${cancelled?'bad':'good'}">${esc(cancelled?t('ticketStatusCancelled'):t('ticketStatusActive'))}</span></div><h3>${esc(ticket.from)} <span>→</span> ${esc(ticket.to)}</h3><p>${esc(fmtDate(ticket.date))} · ${esc(ticket.departure)}–${esc(ticket.arrival)} · ${esc(classLabel(ticket.travelClass))}</p><div class="ticket-card-meta"><span>${esc(t('carriageAndSeat'))}</span><strong>${esc(t('coach'))} ${esc(ticket.coach||'–')} · ${esc(t('seat'))} ${esc(ticket.seat||'–')}</strong></div></div><div class="ticket-card-aside"><strong>${cancelled?esc(currency(ticket.refundAmount||0)):esc(currency(ticket.price))}</strong><small>${cancelled?esc(t('refund')):esc(ticket.fare||'Flexpreis')}</small><b>›</b></div></button>`;
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
  showModal(t('ticketActions'),`<div class="ticket-action-list"><button data-ticket-action="details"><span>≡</span><div><strong>${esc(t('journeyDetails'))}</strong><small>${esc(ticket.kind==='urban'?ticket.network:`${ticket.from} → ${ticket.to}`)}</small></div><b>›</b></button><button data-ticket-action="qr"><span>▦</span><div><strong>${esc(t('fullQr'))}</strong><small>${esc(cancelled?t('qrInvalid'):t('validTicket'))}</small></div><b>›</b></button><button data-ticket-action="share"><span>↗</span><div><strong>${esc(t('shareTicket'))}</strong><small>${esc(ticket.id)}</small></div><b>›</b></button><button data-ticket-action="pdf"><span>PDF</span><div><strong>${esc(t('downloadPdf'))}</strong><small>${esc(cancelled?t('cancellationReceipt'):t('digitalTicketPdf'))}</small></div><b>›</b></button>${ticket.kind!=='urban'&&!cancelled&&ticket.changeability!==false?`<button data-ticket-action="seat"><span>▦</span><div><strong>${esc(t('seatSelection'))}</strong><small>${esc(ticket.coach)} · ${esc(ticket.seat)}</small></div><b>›</b></button>`:''}${ticket.kind!=='urban'?`<button data-ticket-action="repeat"><span>↻</span><div><strong>${esc(t('repeatJourney'))}</strong><small>${esc(ticket.from)} → ${esc(ticket.to)}</small></div><b>›</b></button>`:''}${!cancelled?`<button data-ticket-action="cancel" class="danger-action"><span>×</span><div><strong>${esc(t('cancelTicket'))}</strong><small>${esc(policy.label)} · ${esc(currency(policy.amount))}</small></div><b>›</b></button>`:''}</div><button id="actionsClose" class="secondary full modal-bottom-cancel" type="button">${esc(t('closeActions'))}</button>`,{closable:true});
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
  const policy=ticketRefundPolicy(ticket),commands=[];
  const txt=(x,y,size,value,bold=false,color='0 0 0')=>commands.push(`${color} rg BT /F${bold?'2':'1'} ${size} Tf ${x} ${y} Td (${pdfSafe(value)}) Tj ET`);
  const line=(x1,y1,x2,y2,width=.7,color='.78 .82 .88')=>commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  const fill=(x,y,w,h,color)=>commands.push(`${color} rg ${x} ${y} ${w} ${h} re f`);
  const stroke=(x,y,w,h,rgb='0.82 0.86 0.91')=>commands.push(`${rgb} RG 0.8 w ${x} ${y} ${w} ${h} re S`);
  // GB blue corporate header
  fill(0,772,595,70,'0 .27 .58');
  txt(42,805,25,'GB',true,'1 1 1');txt(91,808,17,'GALIZISCHE BAHN',true,'1 1 1');txt(91,789,9,'Wir verbinden Galizien.',false,'1 1 1');
  txt(455,804,10,ticket.status==='cancelled'?'STORNIERUNGSBELEG':'ONLINE-TICKET',true,'1 1 1');txt(455,787,8,`v${APP_VERSION}`,false,'1 1 1');
  // Summary
  txt(42,742,10,'FAHRKARTE / TICKET',true,'0 .27 .58');txt(42,720,17,ticket.kind==='urban'?ticket.name:`${ticket.from} -> ${ticket.to}`,true);
  txt(42,697,10,`${t('ticketLabel')}: ${ticket.id}`);txt(42,681,10,`${t('ticketStatus')}: ${ticket.status==='cancelled'?t('cancelledTicket'):t('validTicket')}`);
  txt(42,665,10,`${t('price')}: ${ticket.price} GM`);txt(220,665,10,`${t('fare')}: ${ticket.fare||ticket.name||'-'}`);
  // pseudo QR
  stroke(445,650,106,106,'0 .27 .58');
  let hash=0;for(const ch of String(ticket.id))hash=(hash*31+ch.charCodeAt(0))>>>0;
  const cell=4,n=21,ox=456,oy=661;for(let row=0;row<n;row++)for(let col=0;col<n;col++){const finder=(col<7&&row<7)||(col>13&&row<7)||(col<7&&row>13);const on=finder?((col===0||row===0||col===6||row===6)||(col>=2&&col<=4&&row>=2&&row<=4)):(((hash+row*17+col*29+row*col)%7)<3);if(on)fill(ox+col*cell,oy+(n-1-row)*cell,cell,cell,'0 0 0')}
  txt(455,641,7,'Nur zur Kontrolle / Demo');
  line(42,630,553,630,1,'0 .27 .58');
  if(ticket.kind!=='urban'){
    txt(42,607,12,'REISEVERBINDUNG',true,'0 .27 .58');
    txt(42,585,10,`${t('date')}: ${ticket.date}`);txt(220,585,10,`${ticket.departure} - ${ticket.arrival}`);txt(390,585,10,`${ticket.travelClass}. Klasse`);
    let y=552;
    const travelSegments=(ticket.segments||[]).filter(seg=>seg.kind!=='border');
    for(const seg of travelSegments.slice(0,7)){
      const from=getStation(seg.fromId)?.name||seg.fromId,to=getStation(seg.toId)?.name||seg.toId;
      fill(42,y-5,7,42,seg.kind==='urban'?'.35 .55 .78':'0 .27 .58');
      txt(60,y+23,10,`${seg.departure||''}  ${from}`,true);
      txt(60,y+7,9,`${seg.train||seg.type||''}${seg.corridorName?` · ${seg.corridorName}`:''}`,false,'0 .27 .58');
      txt(60,y-9,10,`${seg.arrival||''}  ${to}`,true);
      if(seg.platformDeparture)txt(440,y+20,8,`Gleis ${seg.platformDeparture} -> ${seg.platformArrival||'-'}`);
      y-=58;
    }
    if(ticket.international){stroke(42,y-5,511,50,'0.92 0.67 0.12');txt(55,y+25,10,'GRENZKONTROLLE SAN JUAN DEL RIO',true,'0.55 0.32 0');txt(55,y+8,8,'Reisepass, Zoll und verpflichtender Umstieg in den RB Mexico.');y-=66}
    txt(42,170,11,'RESERVIERUNG',true,'0 .27 .58');txt(42,151,9,`${t('coach')}: ${ticket.coach||'-'}   ${t('seat')}: ${ticket.seat||'-'}   ${t('passenger')}: ${ticket.passenger||'-'}`);
    txt(42,129,11,'FAHRGASTRECHTE & HINWEISE',true,'0 .27 .58');txt(42,112,8,'Dieses Ticket ist nur mit einem gueltigen amtlichen Lichtbildausweis gueltig.');txt(42,98,8,'Es gelten die Tarif- und Befoerderungsbedingungen der Galizische Bahn AG.');
  }else{
    txt(42,600,12,'STADTTICKET',true,'0 .27 .58');txt(42,578,10,`${ticket.network} · ${t('validUntil')}: ${ticket.validUntil}`);
  }
  if(ticket.status==='cancelled'){fill(42,60,511,30,'.73 .12 .16');txt(55,70,12,`${t('refund')}: ${policy.amount} GM · ${t('cancelledAt')}: ${ticket.cancelledAt}`,true,'1 1 1')}
  else{fill(0,0,595,38,'0 .27 .58');txt(42,14,8,`© 2026 Galizische Bahn AG · ${ticket.id} · Seite 1/1`,false,'1 1 1')}
  const content=commands.join('\n');
  const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'];
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
  store.set(s=>({...s,tickets:s.tickets.map(x=>x.id===ticket.id?{...x,status:'cancelled',qrValid:false,cancelledAt:now,refundAmount:policy.amount,cancellationId:refundId}:x),activeTicketId:s.activeTicketId===ticket.id?null:s.activeTicketId,ui:{...s.ui,ticketTab:'cancelled'},orders:[{id:refundId,type:'refund',description:`${t('refundOrder')} · ${ticket.id}`,amount:-policy.amount,date:now},...s.orders]}));
  toast(t('ticketCancelled'));const updated=state().tickets.find(x=>x.id===ticket.id);renderTickets();openTicket(updated);
}
function drawQR(canvas,text){const c=canvas.getContext('2d'),n=29,cell=canvas.width/n;let value=seed(text);const rand=()=>{value^=value<<13;value^=value>>>17;value^=value<<5;return(value>>>0)/4294967296};c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#111';const reserved=Array.from({length:n},()=>Array(n).fill(false));const finder=(sx,sy)=>{for(let y=0;y<7;y++)for(let x=0;x<7;x++){reserved[sy+y][sx+x]=true;if(x===0||y===0||x===6||y===6||(x>=2&&x<=4&&y>=2&&y<=4))c.fillRect((sx+x)*cell,(sy+y)*cell,Math.ceil(cell),Math.ceil(cell))}};finder(1,1);finder(n-8,1);finder(1,n-8);for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(!reserved[y][x]&&rand()>.52)c.fillRect(x*cell,y*cell,Math.ceil(cell),Math.ceil(cell))}
function cancelSubscription(id){store.set(s=>({...s,subscriptions:s.subscriptions.map(x=>x.id===id?{...x,status:'cancelled'}:x)}));toast(t('subscriptionCancelled'));renderTickets()}

function renderMore(){
  const s=state(),unread=s.notificationInbox.filter(item=>!item.read).length;
  main.innerHTML=`<section class="page-header v08-page-title"><div><p class="eyebrow">Galizische Bahn</p><h1>${esc(t('more'))}</h1><p class="subtitle">${esc(t('versionMajor'))}</p></div><span class="version-pill">v${APP_VERSION}</span></section>
  <div class="more-grid v08-more-grid">
    <button class="more-card" data-nav="network"><span>◇</span><div><strong>${esc(t('mapCentre'))}</strong><small>${esc(t('nationalNetwork'))} · ${esc(t('cityNetwork'))}</small></div><b>›</b></button>
    <button class="more-card" data-nav="operations"><span>◷</span><div><strong>${esc(t('operations'))}</strong><small>${esc(t('operationLive'))}</small></div><b>›</b></button>
    <button class="more-card" data-nav="notifications"><span>◉</span><div><strong>${esc(t('notificationCentre'))}</strong><small>${unread?`${unread} ${esc(t('unread'))}`:esc(t('noNotifications'))}</small></div><b>›</b></button>
    <button class="more-card border" data-nav="border"><span>SJR</span><div><strong>${esc(t('borderCenter'))}</strong><small>${esc(t('borderAndInternational'))}</small></div><b>›</b></button>
    <button class="more-card wide" data-nav="profile"><span>${esc((s.account.initials||'GB').toUpperCase())}</span><div><strong>${esc(t('profileAndPreferences'))}</strong><small>${esc(s.account.name)} · ${esc(s.account.tier)}</small></div><b>›</b></button>
  </div>
  <section class="section"><div class="section-title"><h2>${esc(t('settings'))}</h2></div><article class="card settings v08-settings">
    <button id="languageSetting"><span class="setting-icon">文</span><div><strong>${esc(t('language'))}</strong><small>${esc(languageName(s.language))} · ${esc(t('languageSourceNote'))}</small></div><b>›</b></button>
    <button id="themeSetting"><span class="setting-icon">◐</span><div><strong>${esc(t('appearance'))}</strong><small>${esc(themeName(s.theme))}</small></div><b>›</b></button>
    <button id="densitySetting"><span class="setting-icon">≡</span><div><strong>${esc(t('density'))}</strong><small>${esc(t(s.density))}</small></div><b>›</b></button>
    <button id="motionSetting"><span class="setting-icon">≈</span><div><strong>${esc(t('reduceMotion'))}</strong><small>${s.reduceMotion?'✓':esc(t('none'))}</small></div><b>${s.reduceMotion?'✓':'›'}</b></button>
    <button id="notificationSetting"><span class="setting-icon">◉</span><div><strong>${esc(t('notifyMe'))}</strong><small>${esc(s.notifications?t('notificationsEnabled'):t('none'))}</small></div><b>${s.notifications?'✓':'›'}</b></button>
    <button id="installSetting"><span class="setting-icon">⇩</span><div><strong>${esc(t('install'))}</strong><small>${esc(t('pwaStatus'))} · v${APP_VERSION}</small></div><b>›</b></button>
  </article></section>
  <article class="system-card"><div><small>${esc(t('systemStatus'))}</small><strong>${navigator.onLine?esc(t('online')):esc(t('offline'))}</strong></div><div><small>${esc(t('dataLocal'))}</small><strong>${state().tickets.length} ${esc(t('tickets'))}</strong></div><div><small>${esc(t('currentVersion'))}</small><strong>${APP_VERSION}</strong></div></article>
  <footer class="legal-footer"><strong>${esc(t('copyrightLine'))}</strong><small>${esc(t('rightsReserved'))}</small></footer>`;
  document.getElementById('languageSetting').addEventListener('click',openLanguage);
  document.getElementById('themeSetting').addEventListener('click',openTheme);
  document.getElementById('densitySetting').addEventListener('click',openDensity);
  document.getElementById('motionSetting').addEventListener('click',()=>{store.set(st=>({...st,reduceMotion:!st.reduceMotion}));applyTheme();renderMore()});
  document.getElementById('notificationSetting').addEventListener('click',()=>toggleNotifications(true));
  document.getElementById('installSetting').addEventListener('click',installApp);
}

async function toggleNotifications(rerender=true){
  let enabled=!state().notifications;
  if(enabled&&'Notification'in window&&Notification.permission==='default'){try{enabled=(await Notification.requestPermission())==='granted'}catch{enabled=true}}
  store.set(s=>({...s,notifications:enabled,notificationInbox:enabled?[{id:uid('NTF'),text:t('notificationDeparture'),date:new Date().toISOString()},...s.notificationInbox]:s.notificationInbox}));
  toast(enabled?t('notificationsEnabled'):t('cancelled'));if(rerender===true)renderMore();return enabled;
}

function renderProfile(){
  const s=state(),account=s.account,sub=activeSubscription(),active=s.tickets.filter(x=>x.status!=='cancelled'),cancelled=s.tickets.filter(x=>x.status==='cancelled');
  const stationCounts={};s.tickets.forEach(ticket=>{if(ticket.fromId)stationCounts[ticket.fromId]=(stationCounts[ticket.fromId]||0)+1;if(ticket.toId)stationCounts[ticket.toId]=(stationCounts[ticket.toId]||0)+1});
  const favoriteId=Object.entries(stationCounts).sort((a,b)=>b[1]-a[1])[0]?.[0]||s.favorites[0],favoriteStation=getStation(favoriteId)?.name||'Guadalajara Hbf';
  main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><div><p class="eyebrow">${esc(t('accountLocal'))}</p><h1>${esc(t('profile'))}</h1><p class="subtitle">${esc(t('privacyLocal'))}</p></div><button id="editProfileButton" class="round-action" aria-label="${esc(t('editProfile'))}">✎</button></section>
  <article class="profile-hero-v08"><div class="profile-identity"><span>${esc(account.initials)}</span><div><h2>${esc(account.name)}</h2><p>${esc(account.tier)}</p></div></div><div class="gb-card-v08"><small>GALIZISCHE BAHN</small><strong>GB CARD GOLD</strong><span>2048 8361 0917</span></div><div class="stats"><div><strong>${124+active.length}</strong><small>${esc(t('journeys'))}</small></div><div><strong>${(36000+active.length*240).toLocaleString(locale())}</strong><small>km</small></div><div><strong>${(8420+s.orders.length*230).toLocaleString(locale())}</strong><small>${esc(t('points'))}</small></div></div></article>
  <section class="section"><div class="section-title"><h2>${esc(t('travelPreferences'))}</h2></div><article class="card preference-summary"><div><span>◫</span><small>${esc(t('seatPreference'))}</small><strong>${esc(t(account.seatPreference==='window'?'windowSeat':'aisleSeat'))}</strong></div><div><span>☾</span><small>${esc(t('quiet'))}</small><strong>${account.quietPreference?'✓':esc(t('none'))}</strong></div><div><span>★</span><small>${esc(t('favoriteStation'))}</small><strong>${esc(favoriteStation)}</strong></div></article></section>
  <section class="section"><div class="section-title"><h2>${esc(t('travelStats'))}</h2></div><article class="card profile-insights"><div><small>${esc(t('favorites'))}</small><strong>${s.favoriteRoutes.length}</strong></div><div><small>${esc(t('activeTickets'))}</small><strong>${active.length}</strong></div><div><small>${esc(t('cancelledTickets'))}</small><strong>${cancelled.length}</strong></div><div><small>${esc(t('frequentPassenger'))}</small><strong>${esc(s.frequentPassengers[0]||account.name)}</strong></div></article></section>
  ${sub?`<section class="section"><div class="section-title"><h2>${esc(t('activeSubscription'))}</h2></div>${subscriptionCard(sub)}<button class="danger-button full" data-cancel-sub="${sub.id}">${esc(t('cancelSubscription'))}</button></section>`:''}
  <section class="section"><div class="section-title"><h2>${esc(t('paymentMethods'))}</h2></div><article class="card setting-row"><span>▰</span><div><strong>${s.savedPayment?`${esc(s.savedPayment.brand)} •••• ${esc(s.savedPayment.last4)}`:esc(t('testCardMissing'))}</strong><small>${esc(t('demoOnly'))}</small></div></article></section>`;
  document.getElementById('editProfileButton').addEventListener('click',openProfileEditor);
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
  main.innerHTML=`<section class="page-header"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><p class="eyebrow">SJR · ${esc(t('international'))}</p><h1>${esc(t('borderCenter'))}</h1><p class="subtitle">${esc(t('borderOnlySJR'))}</p></section><article class="border-status-hero"><div><small>${esc(t('borderStatus'))}</small><h2>${esc(t('openStatus'))}</h2></div><span>${esc(t('restricted'))}</span><div class="border-metrics"><div><strong>45 min</strong><small>${esc(t('controlTime'))}</small></div><div><strong>12 min</strong><small>${esc(t('transferBuffer'))}</small></div><div><strong>RB 90</strong><small>${esc(t('mexicoRB'))}</small></div></div></article><article class="official-advisory"><div class="warning-seal">AA</div><div><p class="eyebrow">Auswärtiges Amt</p><h3>${esc(t('travelWarningBody'))}</h3><p>${esc(t('travelWarningDetail'))}</p></div></article><section class="section"><div class="section-title"><h2>${esc(t('borderProcedure'))}</h2></div><div class="direction-cards"><article class="card direction-card"><h3>${esc(t('outbound'))}</h3><ol><li>${esc(t('domesticTrain'))} → San Juan del Río</li><li>${esc(t('migrationFilter'))} · 45 min</li><li>${esc(t('transferToRB'))}</li><li>RB → Ciudad de México Buenavista</li></ol></article><article class="card direction-card"><h3>${esc(t('inbound'))}</h3><ol><li>RB → San Juan del Río</li><li>${esc(t('migrationFilter'))} · 45 min</li><li>${esc(t('transferFromRB'))}</li><li>${esc(t('domesticTrain'))} → ${esc(t('countryGalizia'))}</li></ol></article></div></section><section class="section"><article class="card documents-card"><div class="section-title compact-title"><div><p class="eyebrow">SJR</p><h2>${esc(t('documents'))}</h2></div></div><div class="document-list"><div><span class="document-icon">ID</span><strong>${esc(t('passport'))}</strong><small>${esc(t('passportRequired'))}</small></div><div><span class="document-icon">✓</span><strong>${esc(t('entryPermit'))}</strong><small>${esc(t('documentsConfirm'))}</small></div><div><span class="document-icon">Z</span><strong>${esc(t('customs'))}</strong><small>${esc(t('borderControl'))}</small></div><div><span class="document-icon">GB</span><strong>${esc(t('railTicket'))}</strong><small>RB México · San Juan del Río</small></div></div></article></section><div class="border-search-wrap"><button id="borderSearch" class="primary border-search-action" type="button">${esc(t('searchTrip'))}: Ciudad de México</button></div>`;
  document.getElementById('borderSearch').addEventListener('click',()=>{store.set(s=>({...s,search:{...s.search,toId:'MEX'}}));navigate('travel')});
}
function renderOperations(){
  const snapshot=operationSnapshot();
  main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><div><p class="eyebrow">GB Leitstelle</p><h1>${esc(t('operationsTitle'))}</h1><p class="subtitle">${esc(t('operationLive'))} · ${esc(t('lastUpdated'))} ${snapshot.time}</p></div><span class="live-pill">● LIVE</span></section>
  <div class="operation-summary v08-operation-summary">${snapshot.services.map(service=>`<article class="metric"><div><small>${esc(service.name)}</small><strong>${esc(t(service.label))}</strong></div><i class="${esc(service.level)}"></i><span>${service.delay?`+${service.delay} min`:'0 min'}</span></article>`).join('')}</div>
  <section class="section"><div class="section-title"><h2>${esc(t('importantNotices'))}</h2><button id="refreshOperations" class="link-button">↻ ${esc(t('lastUpdated'))}</button></div><div class="operation-list">${snapshot.alerts.map(alert=>`<article class="card operation-card ${esc(alert.severity)}"><span></span><div><div class="operation-head"><h3>${esc(alert.title)}</h3><b>${esc(alert.delay)}</b></div><p>${esc(alert.text)}</p><div class="chips">${alert.modes.map(mode=>`<i>${esc(mode)}</i>`).join('')}</div>${alert.alternative?`<button class="secondary small recalc-button" data-recalculate>${esc(t('recalculate'))}</button>`:''}</div></article>`).join('')}</div></section>
  <section class="section">${borderFlowCard()}</section>`;
  document.getElementById('refreshOperations').addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,operationSeed:(s.ui.operationSeed||0)+1}}));renderOperations()});
  main.querySelectorAll('[data-recalculate]').forEach(button=>button.addEventListener('click',()=>{toast(t('alternativeFound'));navigate('travel',{autoSearch:true})}));
}
function renderNetwork(){
  const mode=state().ui.mapMode||'national',city=getUrbanNetwork(state().ui.mapCityId||state().urban.cityId),ticket=activeTicket();
  let mapContent='';
  if(mode==='national')mapContent=nationalMapMarkup();
  if(mode==='city')mapContent=`<div class="map-city-picker"><label>${esc(t('selectCity'))}<select id="mapCitySelect">${URBAN_NETWORKS.map(network=>`<option value="${network.id}" ${network.id===city.id?'selected':''}>${esc(network.name)} (${esc(network.oldName)})</option>`).join('')}</select></label></div><article class="card urban-network-card unified-map-card"><div class="urban-map-scroll">${urbanNetworkMap(city,'all')}</div></article>`;
  if(mode==='journey')mapContent=ticket?journeyMapMarkup(ticket):`<article class="card empty refined-empty"><b>◇</b><h2>${esc(t('noActiveJourney'))}</h2><p>${esc(t('noJourneyForMap'))}</p><button class="primary" data-nav="travel">${esc(t('startNewSearch'))}</button></article>`;
  main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><div><p class="eyebrow">${esc(t('maps'))}</p><h1>${esc(t('mapCentre'))}</h1><p class="subtitle">${esc(t('routeOverview'))}</p></div></section><div class="map-mode-tabs"><button data-map-mode="national" class="${mode==='national'?'active':''}">${esc(t('nationalNetwork'))}</button><button data-map-mode="city" class="${mode==='city'?'active':''}">${esc(t('cityNetwork'))}</button><button data-map-mode="journey" class="${mode==='journey'?'active':''}">${esc(t('currentJourneyMap'))}</button></div><section class="section map-centre-content">${mapContent}</section>`;
  main.querySelectorAll('[data-map-mode]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,ui:{...s.ui,mapMode:button.dataset.mapMode}}));renderNetwork()}));
  document.getElementById('mapCitySelect')?.addEventListener('change',event=>{store.set(s=>({...s,ui:{...s.ui,mapCityId:event.target.value}}));renderNetwork()});
  main.querySelectorAll('[data-map-station]').forEach(group=>group.addEventListener('click',()=>openStation(getStation(group.dataset.mapStation))));
  main.querySelectorAll('[data-line]').forEach(group=>group.addEventListener('click',()=>openUrbanLine(city,group.dataset.line)));
  if(mode==='national'){let progress=0;liveTimer=setInterval(()=>{progress=(progress+.004)%1;const marker=document.getElementById('mapTrain');if(marker){marker.setAttribute('cx',300+(200*progress));marker.setAttribute('cy',282+(18*progress))}},100)}
}
function stationBoardRows(station,direction='departures'){
  const now=new Date(),requested=now.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}),rows=stationBoardServices(station.id,requested,direction,9);
  if(!rows.length){
    const links=RAIL_EDGES.filter(([a,b])=>a===station.id||b===station.id).slice(0,6);
    return links.map((edge,index)=>{const other=getStation(edge[0]===station.id?edge[1]:edge[0]),mode=edge[3][0],mins=4+index*7,time=new Date(now.getTime()+mins*60000).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'}),train=`${mode} ${90+index*17}`;return`<div class="station-board-row"><time>${esc(time)}</time><span class="service-badge ${esc(mode)}">${esc(train)}</span><div><strong>${esc(other?.name||'')}</strong><small>${direction==='departures'?esc(t('departure')):esc(t('arrival'))} · ${esc(t('onTime'))}</small></div><b>${esc(t('platform'))} ${1+index%station.platforms}</b></div>`}).join('');
  }
  return rows.map(row=>{const destination=getStation(row.destination),service=row.service,status=row.delay?`+${row.delay} min`:t('onTime');return`<div class="station-board-row official-service-row"><time>${esc(row.time)}</time><span class="service-badge ${esc(service.product)}">${esc(row.train)}</span><div><strong>${esc(destination?.name||service.name)}</strong><small>${esc(service.name)} · ${esc(status)}</small></div><b>${esc(t('platform'))} ${esc(row.platform)}</b></div>`}).join('');
}
function openStation(station,board='departures'){
  const rows=stationBoardRows(station,board),favorite=state().favorites.includes(station.id);
  const platformCount=Math.min(10,station.platforms||6);
  showModal(t('stationOverview'),`<article class="station-detail-v08"><div class="station-title-row"><div><p class="eyebrow">${esc(station.id)} · ${esc(station.country)}</p><h2>${esc(station.name)}</h2><p class="muted">${esc(station.oldName)} · ${station.platforms} ${esc(t('platform'))}</p></div><button id="favoriteStation" class="favorite-icon ${favorite?'selected':''}" type="button">${favorite?'★':'☆'}</button></div>
  ${station.id==='SJR'?federalNotice():station.country==='MX'?`<article class="official-advisory-inline"><strong>Auswärtiges Amt</strong><p>${esc(t('travelWarningBody'))}</p></article>`:''}
  <div class="station-quick-facts"><span><b>24/7</b><small>${esc(t('stationOverview'))}</small></span><span><b>${station.platforms}</b><small>${esc(t('platform'))}</small></span><span><b>✓</b><small>${esc(t('stepFree'))}</small></span></div>
  <div class="mode-tabs station-tabs"><button data-station-board="departures" class="${board==='departures'?'active':''}">${esc(t('departures'))}</button><button data-station-board="arrivals" class="${board==='arrivals'?'active':''}">${esc(t('arrivals'))}</button></div><div class="station-board">${rows}</div>
  <section class="station-subsection"><h3>${esc(t('platformMap'))}</h3><div class="platform-schematic">${Array.from({length:platformCount},(_,index)=>`<span><b>${index+1}</b><i class="${index%3===0?'occupied':''}"></i></span>`).join('')}</div></section>
  <section class="station-subsection"><h3>${esc(t('accessibility'))}</h3><div class="accessibility-grid"><span>♿ ${esc(t('stepFree'))}</span><span>↕ ${esc(t('elevators'))}</span><span>◎ ${esc(t('assistance'))}</span></div></section>
  <section class="station-subsection"><h3>${esc(t('facilities'))}</h3><div class="chips">${station.amenities.map(item=>`<i>${esc(item)}</i>`).join('')}</div></section>
  <div class="button-row"><button class="secondary" id="stationClose">${esc(t('close'))}</button><button class="primary" id="stationSearch">${esc(t('searchTrip'))}</button></div></article>`,{closable:true});
  document.getElementById('favoriteStation').addEventListener('click',()=>{const exists=state().favorites.includes(station.id);store.set(s=>({...s,favorites:exists?s.favorites.filter(id=>id!==station.id):[station.id,...s.favorites]}));toast(exists?t('routeRemoved'):t('routeSaved'));openStation(station,board)});
  modalRoot.querySelectorAll('[data-station-board]').forEach(button=>button.addEventListener('click',()=>openStation(station,button.dataset.stationBoard)));
  document.getElementById('stationClose').addEventListener('click',()=>closeModal());
  document.getElementById('stationSearch').addEventListener('click',()=>{store.set(s=>({...s,search:{...s.search,fromId:station.id,toId:station.id==='MEX'?'GUA':state().search.toId}}));closeModal();navigate('travel')});
}

function openLiveTrip(ticket){
  const path=ticket.path||['GUA','KAR','GRE','MEX'],next=getStation(path[Math.min(1,path.length-1)])?.city||ticket.to;
  showModal(t('live'),`<article class="live-card"><div class="journey-top"><span class="service-badge ${ticket.type}">${esc(ticket.train)}</span><span class="live-dot">● LIVE</span></div><svg class="live-svg" viewBox="0 0 600 230"><path d="M50 155 C190 45 410 45 550 155"></path>${path.slice(0,3).map((id,i)=>`<circle cx="${50+i*250}" cy="${i===1?65:155}" r="7"></circle><text x="${50+i*250}" y="${i===1?40:185}" text-anchor="middle">${esc(getStation(id)?.city||'')}</text>`).join('')}<circle id="liveTrain" class="map-train" cx="220" cy="78" r="9"></circle></svg><div class="progress"><i id="liveBar"></i></div><div class="live-stats"><div><small>${esc(t('speed'))}</small><strong id="liveSpeed">287 km/h</strong></div><div><small>${esc(t('nextTrip'))}</small><strong>${esc(next)}</strong></div><div><small>${esc(t('arrival'))}</small><strong>${esc(ticket.arrival)}</strong></div><div><small>${esc(t('progress'))}</small><strong id="livePercent">34 %</strong></div><div><small>${esc(t('timeRemaining'))}</small><strong id="liveRemaining">${esc(duration(Math.round((ticket.duration||100)*.66)))}</strong></div><div><small>${esc(t('platform'))}</small><strong>${esc(ticket.platform||'4')} · ${esc(t('sector'))} ${String.fromCharCode(65+(seed(ticket.id)%4))}</strong></div></div>${ticket.international?`<article class="live-notice border"><strong>SJR</strong><p>${esc(t('notificationBorder'))}</p></article>`:`<article class="live-notice"><strong>${esc(t('notificationTitle'))}</strong><p>${esc(t('notificationPlatform'))}</p></article>`}<button id="liveNotify" class="secondary full" type="button">${esc(state().notifications?t('notificationsEnabled'):t('notifyMe'))}</button><p class="muted">${esc(t('simulatedLive'))}</p></article>`);
  document.getElementById('liveNotify').addEventListener('click',async()=>{if(!state().notifications)await toggleNotifications(false);else toast(t('notificationsEnabled'))});let p=.34;stopTimers();liveTimer=setInterval(()=>{p+=.005;if(p>1)p=.05;const x=50+500*p,y=155-Math.sin(Math.PI*p)*105;document.getElementById('liveTrain')?.setAttribute('cx',x);document.getElementById('liveTrain')?.setAttribute('cy',y);const bar=document.getElementById('liveBar');if(bar)bar.style.width=`${p*100}%`;const speed=document.getElementById('liveSpeed');if(speed)speed.textContent=`${Math.round(270+Math.sin(p*10)*27)} km/h`;const percent=document.getElementById('livePercent');if(percent)percent.textContent=`${Math.round(p*100)} %`;const remaining=document.getElementById('liveRemaining');if(remaining)remaining.textContent=duration(Math.max(1,Math.round((ticket.duration||100)*(1-p))))},100)
}





function fareName(fare){
  if(!fare)return'';
  const names={
    de:{SUPER:'Super Sparpreis',SAVER:'Sparpreis',FLEX:'Flexpreis',BUSINESS:'Business Flex',INTL:'International Flex'},
    es:{SUPER:'Super Sparpreis',SAVER:'Sparpreis',FLEX:'Flexpreis',BUSINESS:'Business Flex',INTL:'Flex internacional'},
    en:{SUPER:'Super saver fare',SAVER:'Saver fare',FLEX:'Flex fare',BUSINESS:'Business Flex',INTL:'International Flex'}
  };
  return names[state().language]?.[fare.id]||names.de[fare.id]||fare.name;
}
function subscriptionPresentation(product){
  const eligibility={JUGEND:'subscriptionYouthEligibility',STANDARD:'subscriptionAllEligibility',PLUS:'subscriptionPlusEligibility',BUSINESS:'subscriptionBusinessEligibility'};
  const features={
    JUGEND:['localNationwide','secondClassFeature','monthlyCancellation'],
    STANDARD:['allLocalModes','secondClassFeature','monthlyCancellation'],
    PLUS:['standardBenefits','bikeIncluded','weekendCompanion'],
    BUSINESS:['standardBenefits','iceDiscount','flexibleInvoice']
  };
  return{eligibility:t(eligibility[product.id]),features:(features[product.id]||[]).map(t)};
}
function localizedServiceAlert(alert){
  const keys={
    'IC-KAR-SLU':['constructionKarsburg','constructionText'],
    'RE-WEST':['westRestricted','westRestrictedText'],
    'RB-MEX':['borderEnhanced','borderEnhancedText'],
    'S-GDL':['gdlNormal','gdlNormalText']
  };
  const pair=keys[alert.id];return pair?{title:t(pair[0]),text:t(pair[1])}:{title:alert.title,text:alert.text};
}
function activeJourneyCard(ticket){
  const progress=34+(seed(ticket.id)%42),nextId=ticket.path?.[Math.min(1,(ticket.path?.length||1)-1)]||ticket.toId,next=getStation(nextId)?.name||ticket.to;
  return `<article class="active-journey-card"><div class="active-journey-head"><span class="service-badge ${esc(ticket.type)}">${esc(ticket.train)}</span><span class="status ${ticket.delay?'warn':'ok'}">${ticket.delay?`+${ticket.delay} min`:esc(t('onTime'))}</span></div><div class="active-journey-route"><div><small>${esc(ticket.from)}</small><strong>${esc(ticket.departure)}</strong></div><span><i style="width:${progress}%"></i></span><div><small>${esc(ticket.to)}</small><strong>${esc(ticket.arrival)}</strong></div></div><div class="active-journey-next"><div><small>${esc(t('nextStop'))}</small><strong>${esc(next)}</strong></div><div><small>${esc(t('carriageAndSeat'))}</small><strong>${esc(ticket.coach||'–')} · ${esc(ticket.seat||'–')}</strong></div></div><div class="active-journey-actions"><button class="secondary" data-nav="tickets">${esc(t('showTicket'))}</button><button class="primary" data-nav="journey">${esc(t('openJourneyAssistant'))}</button></div></article>`;
}

function openQuickSearchOptions(){
  const search=state().search;
  showModal(t('searchOptions'),`<div class="quick-options"><label><span>${esc(t('passengers'))}</span><select id="quickPassengers">${[1,2,3,4,5,6].map(n=>`<option value="${n}" ${n===Number(search.passengers)?'selected':''}>${n}</option>`).join('')}</select></label><label><span>${esc(t('travelClass'))}</span><select id="quickClass"><option value="2" ${search.travelClass==='2'?'selected':''}>${esc(t('secondClass'))}</option><option value="1" ${search.travelClass==='1'?'selected':''}>${esc(t('firstClass'))}</option></select></label><p>${esc(t('rememberedSettings'))}</p><div class="button-row"><button id="quickCancel" class="secondary">${esc(t('cancel'))}</button><button id="quickSave" class="primary">${esc(t('save'))}</button></div></div>`,{closable:true});
  document.getElementById('quickCancel').addEventListener('click',()=>closeModal());
  document.getElementById('quickSave').addEventListener('click',()=>{store.set(s=>({...s,search:{...s.search,passengers:Number(document.getElementById('quickPassengers').value),travelClass:document.getElementById('quickClass').value}}));closeModal();renderHome()});
}

function openDensity(){
  showModal(t('density'),`<div class="language-list" role="radiogroup">${['comfortable','compact'].map(id=>`<button class="language-option ${state().density===id?'selected':''}" data-density="${id}" role="radio" aria-checked="${state().density===id}"><span class="language-code">${id==='comfortable'?'↕':'≡'}</span><span class="language-copy"><strong>${esc(t(id))}</strong></span><span class="language-check">${state().density===id?'✓':''}</span></button>`).join('')}</div><button class="secondary full modal-bottom-cancel" id="densityCancel">${esc(t('cancel'))}</button>`,{closable:true});
  modalRoot.querySelectorAll('[data-density]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,density:button.dataset.density}));applyTheme();closeModal();renderMore()}));
  document.getElementById('densityCancel').addEventListener('click',()=>closeModal());
}

function openProfileEditor(){
  const account=state().account;
  showModal(t('editProfile'),`<div class="profile-editor"><div class="field"><label for="profileName">${esc(t('displayName'))}</label><input id="profileName" value="${esc(account.name)}" maxlength="50"></div><div class="field"><label for="profileInitials">${esc(t('initials'))}</label><input id="profileInitials" value="${esc(account.initials)}" maxlength="3"></div><div class="field"><label for="seatPreference">${esc(t('seatPreference'))}</label><select id="seatPreference"><option value="window" ${account.seatPreference==='window'?'selected':''}>${esc(t('windowSeat'))}</option><option value="aisle" ${account.seatPreference==='aisle'?'selected':''}>${esc(t('aisleSeat'))}</option></select></div><label class="check-row"><input id="quietPreference" type="checkbox" ${account.quietPreference?'checked':''}><span>${esc(t('quietPreference'))}</span></label><p class="muted">${esc(t('privacyLocal'))}</p><div class="button-row"><button id="profileCancel" class="secondary">${esc(t('cancel'))}</button><button id="profileSave" class="primary">${esc(t('saveChanges'))}</button></div></div>`,{closable:true});
  document.getElementById('profileCancel').addEventListener('click',()=>closeModal());
  document.getElementById('profileSave').addEventListener('click',()=>{const name=document.getElementById('profileName').value.trim()||account.name,initials=document.getElementById('profileInitials').value.trim().toUpperCase()||account.initials,seatPreference=document.getElementById('seatPreference').value,quietPreference=document.getElementById('quietPreference').checked;store.set(s=>({...s,account:{...s.account,name,initials,seatPreference,quietPreference},frequentPassengers:[name,...s.frequentPassengers.filter(item=>item!==s.account.name&&item!==name)]}));updateHeaderState();closeModal();toast(t('changesSaved'));renderProfile()});
}

function operationSnapshot(){
  const modifier=(new Date().getHours()+Number(state().ui.operationSeed||0))%7;
  const services=[
    {name:'ICE',label:modifier===5?'serviceDelay':'serviceNormal',level:modifier===5?'warn':'ok',delay:modifier===5?8:0},
    {name:'IC',label:modifier===2?'serviceSevere':'serviceDelay',level:modifier===2?'bad':'warn',delay:modifier===2?24:7},
    {name:'RE West',label:modifier===4?'serviceNormal':'serviceDelay',level:modifier===4?'ok':'warn',delay:modifier===4?0:12},
    {name:'RB México',label:'restricted',level:'warn',delay:modifier===6?18:9}
  ];
  const alerts=SERVICE_ALERTS.map((alert,index)=>({...localizedServiceAlert(alert),severity:alert.severity,delay:index===0?'+8 min':index===1?'+14 min':'+5 min',alternative:index<2,modes:alert.modes}));
  if(modifier===2)alerts.unshift({severity:'bad',title:'Karlsburg Hbf · '+t('platform'),text:t('notificationPlatform'),modes:['ICE 106','IC 607'],delay:'+24 min',alternative:true});
  return{time:new Date().toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'}),services,alerts};
}

function railOperationsPanel(){
  const groups=['ICE','IC','RE','RB','NJ'];
  return`<section class="section rail-operations-panel"><div class="section-title"><div><p class="eyebrow">${esc(t('operationLive'))}</p><h2>${esc(t('nationalNetwork'))}</h2></div></div><div class="rail-service-groups">${groups.map((product,index)=>{const items=RAIL_SERVICES.filter(service=>service.product===product&&service.id!=='RBM90');return`<details ${index<2?'open':''}><summary><span class="service-badge ${product}">${product}</span><strong>${items.length}</strong></summary><div class="rail-service-list">${items.map(service=>`<article><div><strong>${esc(service.id)} · ${esc(service.name)}</strong><small>${esc(service.stations.map(id=>getStation(id)?.name||id).join(' → '))}</small></div><span>${service.frequency>=1440?esc(t('dailyService')):`${esc(t('operationFrequency'))} ${service.frequency} min`}</span></article>`).join('')}</div></details>`}).join('')}</div></section>`;
}

function nationalMapMarkup(){
  return `<article class="card map-card unified-map-card"><div class="map-toolbar"><div><small>${esc(t('railwayMap'))}</small><strong>${esc(t('nationalNetwork'))}</strong></div><button data-nav="operations">${esc(t('operationLive'))}</button></div><svg class="rail-map" viewBox="60 10 620 500" role="img" aria-label="${esc(t('nationalNetwork'))}">${RAIL_EDGES.map(([a,b,,modes])=>{const A=getStation(a),B=getStation(b),type=modes[0];return`<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="rail-line ${esc(type)} ${a==='SJR'&&b==='MEX'?'border-link':''}"></line>`}).join('')}${STATIONS.filter(station=>station.hub||station.international||station.border).map(station=>`<g data-map-station="${station.id}" class="map-station ${station.country==='MX'?'mexico':''} ${station.id==='SJR'?'border-hub':''}"><circle class="map-hit" cx="${station.x}" cy="${station.y}" r="22"></circle>${station.id==='SJR'?`<circle class="border-ring" cx="${station.x}" cy="${station.y}" r="15"></circle>`:''}<circle class="map-dot" cx="${station.x}" cy="${station.y}" r="${station.hub?8:7}"></circle><text x="${station.x+10}" y="${station.y-10}">${esc(station.city)}</text></g>`).join('')}<circle id="mapTrain" class="map-train" cx="300" cy="282" r="7"></circle></svg><details class="map-legend-v08"><summary>${esc(t('mapLegend'))}</summary><div><span><i class="ICE"></i>ICE</span><span><i class="IC"></i>IC</span><span><i class="RE"></i>RE</span><span><i class="RB"></i>${esc(t('mexicoRB'))}</span></div></details></article>${railOperationsPanel()}<section class="section">${borderFlowCard()}</section>`;
}

function journeyMapMarkup(ticket){
  const path=(ticket.path||[ticket.fromId,ticket.toId]).map(getStation).filter(Boolean);if(path.length<2)return `<article class="card empty"><h3>${esc(t('noJourneyForMap'))}</h3></article>`;
  const minX=Math.min(...path.map(station=>station.x)),maxX=Math.max(...path.map(station=>station.x)),minY=Math.min(...path.map(station=>station.y)),maxY=Math.max(...path.map(station=>station.y));
  return `<article class="card journey-map-card"><div class="map-toolbar"><div><small>${esc(t('currentJourneyMap'))}</small><strong>${esc(ticket.from)} → ${esc(ticket.to)}</strong></div><span class="service-badge ${esc(ticket.type)}">${esc(ticket.train)}</span></div><svg class="journey-map-svg" viewBox="${minX-55} ${minY-55} ${Math.max(180,maxX-minX+110)} ${Math.max(160,maxY-minY+110)}">${path.slice(0,-1).map((station,index)=>{const next=path[index+1];return`<line x1="${station.x}" y1="${station.y}" x2="${next.x}" y2="${next.y}"></line>`}).join('')}${path.map((station,index)=>`<g><circle cx="${station.x}" cy="${station.y}" r="${station.id==='SJR'?10:7}" class="${station.id==='SJR'?'border':''}"></circle><text x="${station.x}" y="${station.y-16}" text-anchor="middle">${esc(station.city)}</text></g>`).join('')}</svg><div class="journey-map-footer"><span>${esc(ticket.departure)} · ${esc(ticket.from)}</span><b>${esc(duration(ticket.duration||0))}</b><span>${esc(ticket.arrival)} · ${esc(ticket.to)}</span></div><button class="primary full" data-nav="journey">${esc(t('openJourneyAssistant'))}</button></article>`;
}

function renderNotifications(){
  seedNotificationInbox();
  const items=state().notificationInbox;
  main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="more">‹ ${esc(t('back'))}</button><div><p class="eyebrow">GB Live</p><h1>${esc(t('notificationCentre'))}</h1><p class="subtitle">${esc(t('operationLive'))}</p></div><span class="header-counter">${items.filter(item=>!item.read).length}</span></section><div class="notification-actions"><button id="markAllRead" class="secondary">${esc(t('markAllRead'))}</button><button id="clearRead" class="ghost-button">${esc(t('clearRead'))}</button></div><section class="section"><div class="notification-list">${items.length?items.map(item=>`<button class="notification-item ${item.read?'read':''}" data-notification="${esc(item.id)}"><span class="notification-kind ${esc(item.kind||'info')}">${item.kind==='border'?'SJR':item.kind==='delay'?'!':'◉'}</span><div><strong>${esc(item.title||t('notificationTitle'))}</strong><p>${esc(item.text)}</p><small>${new Date(item.date).toLocaleString(locale(),{dateStyle:'medium',timeStyle:'short'})}</small></div>${!item.read?'<i></i>':''}</button>`).join(''):`<article class="card empty refined-empty"><b>◉</b><h2>${esc(t('noNotifications'))}</h2></article>`}</div></section>`;
  document.getElementById('markAllRead').addEventListener('click',()=>{store.set(s=>({...s,notificationInbox:s.notificationInbox.map(item=>({...item,read:true}))}));updateHeaderState();renderNotifications()});
  document.getElementById('clearRead').addEventListener('click',()=>{store.set(s=>({...s,notificationInbox:s.notificationInbox.filter(item=>!item.read)}));updateHeaderState();renderNotifications()});
  main.querySelectorAll('[data-notification]').forEach(button=>button.addEventListener('click',()=>{store.set(s=>({...s,notificationInbox:s.notificationInbox.map(item=>item.id===button.dataset.notification?{...item,read:true}:item)}));updateHeaderState();const item=state().notificationInbox.find(entry=>entry.id===button.dataset.notification);if(item?.kind==='border')navigate('border');else if(item?.kind==='delay')navigate('operations');else renderNotifications()}));
}

function seedNotificationInbox(){
  const localNow=new Date(),day=new Date(localNow.getTime()-localNow.getTimezoneOffset()*60000).toISOString().slice(0,10);if(state().notificationLastSeed===day&&state().notificationInbox.length)return;
  const ticket=activeTicket(),now=new Date().toISOString();
  const seeded=[{id:uid('NTF'),kind:'info',title:t('notificationTitle'),text:t('notificationDeparture'),date:now,read:false},{id:uid('NTF'),kind:'delay',title:t('operationLive'),text:t('notificationPlatform'),date:new Date(Date.now()-18*60000).toISOString(),read:false},{id:uid('NTF'),kind:'border',title:t('borderCenter'),text:t('notificationBorder'),date:new Date(Date.now()-42*60000).toISOString(),read:true}];
  if(ticket&&!ticket.international)seeded.pop();
  store.set(s=>({...s,notificationLastSeed:day,notificationInbox:[...seeded,...s.notificationInbox].slice(0,20)}));updateHeaderState();
}

function renderJourneyAssistant(){
  const ticket=activeTicket();
  if(!ticket){main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="home">‹ ${esc(t('back'))}</button><div><p class="eyebrow">GB Live</p><h1>${esc(t('journeyAssistant'))}</h1></div></section><article class="card empty refined-empty"><b>◷</b><h2>${esc(t('noActiveJourney'))}</h2><button class="primary" data-nav="travel">${esc(t('startNewSearch'))}</button></article>`;return;}
  const path=ticket.path||[ticket.fromId,ticket.toId],progress=35+(seed(ticket.id)%38),index=Math.min(Math.floor((progress/100)*Math.max(1,path.length-1))+1,path.length-1),next=getStation(path[index])?.name||ticket.to,remaining=Math.max(4,Math.round((ticket.duration||100)*(1-progress/100)));
  main.innerHTML=`<section class="page-header v08-page-title"><button class="back-link" data-nav="home">‹ ${esc(t('back'))}</button><div><p class="eyebrow">${esc(t('currentJourneyMap'))}</p><h1>${esc(t('journeyAssistant'))}</h1><p class="subtitle">${esc(t('simulatedLive'))}</p></div><span class="live-pill">● LIVE</span></section><article class="journey-assistant-hero"><div class="journey-assistant-head"><span class="service-badge ${esc(ticket.type)}">${esc(ticket.train)}</span><span class="status ${ticket.delay?'warn':'ok'}">${ticket.delay?`+${ticket.delay} min`:esc(t('onTime'))}</span></div><div class="journey-assistant-progress"><div><strong>${esc(ticket.departure)}</strong><small>${esc(ticket.from)}</small></div><span><i id="assistantProgress" style="width:${progress}%"></i><b id="assistantTrain">●</b></span><div><strong>${esc(ticket.arrival)}</strong><small>${esc(ticket.to)}</small></div></div><div class="assistant-next"><small>${esc(t('nextStop'))}</small><h2>${esc(next)}</h2><p>${remaining} ${esc(t('minutes'))}</p></div><div class="assistant-grid"><div><small>${esc(t('speed'))}</small><strong id="assistantSpeed">${ticket.type==='RB'?126:284} km/h</strong></div><div><small>${esc(t('timeRemaining'))}</small><strong id="assistantRemaining">${esc(duration(remaining))}</strong></div><div><small>${esc(t('arrivalPlatform'))}</small><strong>${esc(t('platform'))} ${esc(ticket.platform||'4')}</strong></div><div><small>${esc(t('carriageAndSeat'))}</small><strong>${esc(ticket.coach||'–')} · ${esc(ticket.seat||'–')}</strong></div></div>${ticket.international?`<article class="assistant-border-card"><span>SJR</span><div><strong>${esc(t('migrationNotice'))}</strong><p>${esc(t('documentsReady'))} · ${ticket.borderMinutes||45} min</p></div></article>`:''}<div class="assistant-actions"><button id="assistantTicket" class="secondary">${esc(t('showTicket'))}</button><button class="primary" data-nav="network">${esc(t('currentJourneyMap'))}</button></div></article>`;
  document.getElementById('assistantTicket').addEventListener('click',()=>openTicket(ticket));
  let p=progress;stopTimers();liveTimer=setInterval(()=>{p=Math.min(99,p+.08);const bar=document.getElementById('assistantProgress'),train=document.getElementById('assistantTrain'),speed=document.getElementById('assistantSpeed'),left=document.getElementById('assistantRemaining');if(bar)bar.style.width=`${p}%`;if(train)train.style.left=`${p}%`;if(speed)speed.textContent=`${Math.round((ticket.type==='RB'?118:275)+Math.sin(p)*12)} km/h`;if(left)left.textContent=duration(Math.max(1,Math.round((ticket.duration||100)*(1-p/100))))},500);
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
async function installApp(){if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true;return}showModal(t('install'),`<article class="empty"><b>⇧</b><h2>${esc(t('install'))}</h2><p>${esc(t('installHint'))}</p><button class="secondary full" id="installClose" type="button">${esc(t('close'))}</button></article>`,{closable:true});document.getElementById('installClose').addEventListener('click',()=>closeModal())}
function register(){
  document.querySelectorAll('.nav-button').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.route)));
  document.getElementById('brandButton').addEventListener('click',()=>navigate('home'));
  document.getElementById('avatarButton').addEventListener('click',()=>navigate('profile'));
  document.getElementById('notificationButton')?.addEventListener('click',()=>navigate('notifications'));
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
applyTheme();setCopy();updateOnline();updateHeaderState();register();if(!location.hash)history.replaceState(null,'','#/home');render(routeFromHash(),{instant:true});
