import {APP_VERSION} from './data.js?v=0.8.1-lg1';

// Keep the historic key so v0.6–v0.7.1 data is migrated instead of lost.
const KEY='gbahn-v060-state';
const clone=value=>JSON.parse(JSON.stringify(value));
const today=()=>{const now=new Date();return new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10)};

export const DEFAULT_STATE={
  schema:9,
  appVersion:APP_VERSION,
  route:'home',
  language:'de',
  theme:'system',
  notifications:false,
  reduceMotion:false,
  density:'comfortable',
  account:{name:'David J. Martínez',initials:'DJ',tier:'GB Card Gold',seatPreference:'window',quietPreference:true},
  favorites:['GUA','LOW','KAR'],
  favoriteCities:['GDL'],
  favoriteRoutes:[],
  frequentPassengers:['David J. Martínez'],
  tickets:[],
  subscriptions:[],
  orders:[],
  activeTicketId:null,
  savedPayment:null,
  purchaseDraft:null,
  notificationInbox:[],
  notificationLastSeed:null,
  search:{fromId:'GUA',toId:'LOW',date:today(),time:'09:15',passengers:1,travelClass:'2'},
  urban:{cityId:'GDL',mode:'S',from:'Guadalajara Hbf',to:'Flughafen Guadalajara'},
  ui:{ticketTab:'active',cityView:'planner',cityMode:'all',mexicoWarningAccepted:false,mapMode:'national',mapCityId:'GDL',journeySort:'recommended',directOnly:false,operationSeed:0},
  migration:{from:'0.7.1',completed:true}
};

function normalizeTicket(ticket){
  return {
    ...ticket,
    status:ticket?.status||'active',
    qrValid:ticket?.qrValid!==false,
    fareId:ticket?.fareId||ticket?.fare?.id||'FLEX'
  };
}

function sanitize(raw){
  const base=clone(DEFAULT_STATE);
  if(!raw||typeof raw!=='object')return base;
  const state={
    ...base,
    ...raw,
    account:{...base.account,...(raw.account||{})},
    search:{...base.search,...(raw.search||{})},
    urban:{...base.urban,...(raw.urban||{})},
    ui:{...base.ui,...(raw.ui||{})},
    migration:{...base.migration,...(raw.migration||{})}
  };
  state.schema=9;
  state.appVersion=APP_VERSION;
  state.tickets=Array.isArray(state.tickets)?state.tickets.map(normalizeTicket):[];
  state.subscriptions=Array.isArray(state.subscriptions)?state.subscriptions:[];
  state.orders=Array.isArray(state.orders)?state.orders:[];
  state.favorites=Array.isArray(state.favorites)?state.favorites:[];
  state.favoriteRoutes=Array.isArray(state.favoriteRoutes)?state.favoriteRoutes:[];
  state.favoriteCities=Array.isArray(state.favoriteCities)?state.favoriteCities:[];
  state.frequentPassengers=Array.isArray(state.frequentPassengers)&&state.frequentPassengers.length?state.frequentPassengers:[state.account.name];
  state.notificationInbox=Array.isArray(state.notificationInbox)?state.notificationInbox:[];
  if(!['de','es','en'].includes(state.language))state.language='de';
  if(!['system','light','dark'].includes(state.theme))state.theme='system';
  if(!['compact','comfortable'].includes(state.density))state.density='comfortable';
  if(!['window','aisle'].includes(state.account.seatPreference))state.account.seatPreference='window';
  if(!['active','subscriptions','cancelled','history'].includes(state.ui.ticketTab))state.ui.ticketTab='active';
  if(!['planner','departures','map'].includes(state.ui.cityView))state.ui.cityView='planner';
  if(!['all','U','S'].includes(state.ui.cityMode))state.ui.cityMode='all';
  if(!['national','city','journey'].includes(state.ui.mapMode))state.ui.mapMode='national';
  if(!['recommended','fastest','cheapest'].includes(state.ui.journeySort))state.ui.journeySort='recommended';
  if(state.purchaseDraft&&typeof state.purchaseDraft!=='object')state.purchaseDraft=null;
  return state;
}

export function createStore(){
  let value;
  try{value=sanitize(JSON.parse(localStorage.getItem(KEY)||'null'));}
  catch{value=clone(DEFAULT_STATE);}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(value));}catch{}}
  return {
    get:()=>value,
    set(updater){value=sanitize(typeof updater==='function'?updater(clone(value)):updater);save();return value;},
    reset(){value=clone(DEFAULT_STATE);save();return value;}
  };
}
