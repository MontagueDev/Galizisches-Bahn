import {APP_VERSION} from './data.js?v=0.9.3-major-refresh1';
import {loadPersistentSnapshot,schedulePersistentSnapshot,clearPersistentSnapshot} from './persistence.js?v=0.9.3-major-refresh1';

// Historic key retained so every previous GB release migrates without losing tickets.
const KEY='gbahn-v060-state';
const clone=value=>JSON.parse(JSON.stringify(value));
const today=()=>{const now=new Date();return new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const nextSearchTime=()=>{const now=new Date(Date.now()+15*60000);now.setMinutes(Math.ceil(now.getMinutes()/5)*5,0,0);return now.toTimeString().slice(0,5)};
const searchIsPast=search=>{if(!search?.date||!search?.time)return true;const value=new Date(`${search.date}T${search.time}:00`);return Number.isNaN(value.getTime())||value.getTime()<Date.now()-60000};

export const DEFAULT_STATE={
  schema:13,
  appVersion:APP_VERSION,
  updatedAt:Date.now(),
  route:'home',
  language:'de',
  theme:'system',
  notifications:false,
  reduceMotion:false,
  density:'comfortable',
  account:{name:'David J. Martínez',initials:'DJ',tier:'GB Card Gold',email:'',authenticated:false,authMode:'local',accountId:null,createdAt:null,seatPreference:'window',quietPreference:true},
  auth:{session:null,localCredential:null},
  developer:{timeOffsetMinutes:0,borderStatus:'restricted'},
  liveOverrides:{},
  favorites:['GUA','LOW','KAR'],
  favoriteCities:['GDL'],
  favoriteRoutes:[],
  recentStationIds:['GUA','LOW','KAR'],
  frequentPassengers:['David J. Martínez'],
  tickets:[],
  subscriptions:[],
  orders:[],
  activeTicketId:null,
  savedPayment:null,
  purchaseDraft:null,
  notificationInbox:[],
  notificationLastSeed:null,
  search:{fromId:'GUA',toId:'LOW',date:today(),time:nextSearchTime(),passengers:1,travelClass:'2'},
  urban:{cityId:'GDL',mode:'S',from:'Guadalajara Hbf',to:'Flughafen Guadalajara'},
  ui:{ticketTab:'active',cityView:'planner',cityMode:'all',mexicoWarningAccepted:false,mapMode:'national',mapCityId:'GDL',journeySort:'recommended',directOnly:false,operationSeed:0,scrollPositions:{},lastSearchQuery:''},
  migration:{from:'0.9.3',completed:true}
};

function normalizeTicket(ticket){
  return {...ticket,status:ticket?.status||'active',qrValid:ticket?.qrValid!==false,fareId:ticket?.fareId||ticket?.fare?.id||'FLEX'};
}

function uniqueStrings(values,limit=30){
  return [...new Set((Array.isArray(values)?values:[]).filter(value=>typeof value==='string'&&value))].slice(0,limit);
}

function sanitize(raw){
  const base=clone(DEFAULT_STATE);
  if(!raw||typeof raw!=='object')return base;
  const state={
    ...base,...raw,
    account:{...base.account,...(raw.account||{})},
    auth:{...base.auth,...(raw.auth||{})},
    developer:{...base.developer,...(raw.developer||{})},
    search:{...base.search,...(raw.search||{})},
    urban:{...base.urban,...(raw.urban||{})},
    ui:{...base.ui,...(raw.ui||{}),scrollPositions:{...base.ui.scrollPositions,...(raw.ui?.scrollPositions||{})}},
    migration:{...base.migration,...(raw.migration||{})}
  };
  state.schema=13;
  state.appVersion=APP_VERSION;
  state.updatedAt=Number(raw.updatedAt)||Date.now();
  state.tickets=Array.isArray(state.tickets)?state.tickets.map(normalizeTicket):[];
  state.subscriptions=Array.isArray(state.subscriptions)?state.subscriptions:[];
  state.orders=Array.isArray(state.orders)?state.orders:[];
  state.favorites=uniqueStrings(state.favorites);
  state.favoriteRoutes=Array.isArray(state.favoriteRoutes)?state.favoriteRoutes:[];
  state.favoriteCities=uniqueStrings(state.favoriteCities);
  state.recentStationIds=uniqueStrings(state.recentStationIds?.length?state.recentStationIds:[state.search.fromId,state.search.toId,...state.favorites],18);
  state.frequentPassengers=Array.isArray(state.frequentPassengers)&&state.frequentPassengers.length?state.frequentPassengers:[state.account.name];
  state.notificationInbox=Array.isArray(state.notificationInbox)?state.notificationInbox:[];
  state.liveOverrides=state.liveOverrides&&typeof state.liveOverrides==='object'?state.liveOverrides:{};
  state.developer.timeOffsetMinutes=Number.isFinite(Number(state.developer.timeOffsetMinutes))?Number(state.developer.timeOffsetMinutes):0;
  if(!['open','restricted','closed'].includes(state.developer.borderStatus))state.developer.borderStatus='restricted';
  if(!state.account.authenticated)state.auth.session=null;
  if(!['de','es','en'].includes(state.language))state.language='de';
  if(!['system','light','dark'].includes(state.theme))state.theme='system';
  if(!['compact','comfortable'].includes(state.density))state.density='comfortable';
  if(!['window','aisle'].includes(state.account.seatPreference))state.account.seatPreference='window';
  if(!['active','subscriptions','cancelled','history'].includes(state.ui.ticketTab))state.ui.ticketTab='active';
  if(!['planner','departures','map'].includes(state.ui.cityView))state.ui.cityView='planner';
  if(!['all','U','S'].includes(state.ui.cityMode))state.ui.cityMode='all';
  if(!['national','city','journey'].includes(state.ui.mapMode))state.ui.mapMode='national';
  if(!['recommended','fastest','cheapest'].includes(state.ui.journeySort))state.ui.journeySort='recommended';
  if(searchIsPast(state.search)){state.search.date=today();state.search.time=nextSearchTime();}
  if(!state.ui.scrollPositions||typeof state.ui.scrollPositions!=='object')state.ui.scrollPositions={};
  if(state.purchaseDraft&&typeof state.purchaseDraft!=='object')state.purchaseDraft=null;
  return state;
}

function safelyParse(value){try{return JSON.parse(value||'null')}catch{return null}}

export function createStore(){
  const localRaw=safelyParse(localStorage.getItem(KEY));
  let value=sanitize(localRaw);
  let lastSerialized=JSON.stringify(value);
  let saveQueued=false;
  const listeners=new Set();

  const notify=(previous,reason='update')=>{
    for(const listener of listeners){try{listener(value,previous,reason)}catch(error){console.warn('GB store listener failed',error)}}
    try{window.dispatchEvent(new CustomEvent('gb:statechange',{detail:{reason}}))}catch{}
  };

  const persist=()=>{
    if(saveQueued)return;
    saveQueued=true;
    queueMicrotask(()=>{
      saveQueued=false;
      let serialized;
      try{serialized=JSON.stringify(value)}catch{return}
      if(serialized===lastSerialized)return;
      lastSerialized=serialized;
      try{localStorage.setItem(KEY,serialized)}catch{}
      schedulePersistentSnapshot(clone(value));
    });
  };

  const replace=(next,reason='update')=>{
    const previous=value;
    const sanitized=sanitize(next);
    sanitized.updatedAt=Date.now();
    let same=false;
    try{same=JSON.stringify(previous)===JSON.stringify(sanitized)}catch{}
    if(same)return value;
    value=sanitized;
    persist();
    notify(previous,reason);
    return value;
  };

  return {
    get:()=>value,
    set(updater,reason='update'){
      const next=typeof updater==='function'?updater(clone(value)):updater;
      return replace(next,reason);
    },
    subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},
    async hydrate(){
      const snapshot=await loadPersistentSnapshot();
      const candidate=snapshot?.state;
      if(!candidate)return false;
      const localHasMeaningfulData=Boolean(localRaw&&(localRaw.tickets?.length||localRaw.orders?.length||localRaw.account?.authenticated||localRaw.purchaseDraft));
      const snapshotIsNewer=Number(candidate.updatedAt||snapshot.updatedAt||0)>Number(value.updatedAt||0);
      if(!localHasMeaningfulData||snapshotIsNewer){replace(candidate,'hydrate');return true}
      return false;
    },
    snapshot:()=>clone(value),
    reset(){
      const previous=value;
      value=clone(DEFAULT_STATE);
      value.updatedAt=Date.now();
      lastSerialized='';
      try{localStorage.setItem(KEY,JSON.stringify(value))}catch{}
      clearPersistentSnapshot().catch(()=>{});
      schedulePersistentSnapshot(clone(value));
      notify(previous,'reset');
      return value;
    }
  };
}
