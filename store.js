import {APP_VERSION} from './data.js';
const KEY='gbahn-v060-state';
const clone=v=>JSON.parse(JSON.stringify(v));
const today=()=>new Date().toISOString().slice(0,10);
export const DEFAULT_STATE={
  schema:8,appVersion:APP_VERSION,route:'home',language:'de',theme:'system',notifications:false,
  favorites:['GUA','LOW','KAR'],favoriteCities:['GDL'],favoriteRoutes:[],frequentPassengers:['David J. Martínez'],
  tickets:[],subscriptions:[],orders:[],activeTicketId:null,savedPayment:null,purchaseDraft:null,
  notificationInbox:[],
  search:{fromId:'GUA',toId:'LOW',date:today(),time:'09:15',passengers:1,travelClass:'2'},
  urban:{cityId:'GDL',mode:'S',from:'Guadalajara Hbf',to:'Flughafen Guadalajara'},
  ui:{ticketTab:'active',cityView:'planner',cityMode:'all',mexicoWarningAccepted:false}
};
function sanitize(raw){
  const b=clone(DEFAULT_STATE);
  if(!raw||typeof raw!=='object')return b;
  const s={...b,...raw,search:{...b.search,...(raw.search||{})},urban:{...b.urban,...(raw.urban||{})},ui:{...b.ui,...(raw.ui||{})}};
  s.schema=8;s.appVersion=APP_VERSION;
  s.tickets=Array.isArray(s.tickets)?s.tickets.map(ticket=>({...ticket,status:ticket.status||'active',qrValid:ticket.qrValid!==false})):[];
  s.subscriptions=Array.isArray(s.subscriptions)?s.subscriptions:[];
  s.orders=Array.isArray(s.orders)?s.orders:[];
  s.favorites=Array.isArray(s.favorites)?s.favorites:[];
  s.favoriteRoutes=Array.isArray(s.favoriteRoutes)?s.favoriteRoutes:[];
  s.favoriteCities=Array.isArray(s.favoriteCities)?s.favoriteCities:[];
  s.frequentPassengers=Array.isArray(s.frequentPassengers)&&s.frequentPassengers.length?s.frequentPassengers:['David J. Martínez'];
  s.notificationInbox=Array.isArray(s.notificationInbox)?s.notificationInbox:[];
  if(!['de','es','en'].includes(s.language))s.language='de';
  if(!['system','light','dark'].includes(s.theme))s.theme='system';
  if(!['active','subscriptions','cancelled','history'].includes(s.ui.ticketTab))s.ui.ticketTab=s.ui.ticketTab==='tickets'?'active':s.ui.ticketTab==='subscriptions'?'subscriptions':'active';
  if(s.purchaseDraft&&typeof s.purchaseDraft!=='object')s.purchaseDraft=null;
  return s;
}
export function createStore(){
  let value;
  try{value=sanitize(JSON.parse(localStorage.getItem(KEY)||'null'));}catch{value=clone(DEFAULT_STATE)}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(value))}catch{}}
  return{
    get:()=>value,
    set(updater){value=sanitize(typeof updater==='function'?updater(clone(value)):updater);save();return value},
    reset(){value=clone(DEFAULT_STATE);save();return value}
  };
}
