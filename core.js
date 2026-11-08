/**
 * Galizische Bahn v0.9.3 core utilities.
 * Small, dependency-free helpers shared by search, rendering and persistence.
 */

const transliteration = new Map([
  ['ä','ae'],['ö','oe'],['ü','ue'],['ß','ss'],
  ['Ä','ae'],['Ö','oe'],['Ü','ue']
]);

export function normalizeText(value=''){
  const expanded=String(value).replace(/[äöüßÄÖÜ]/g,char=>transliteration.get(char)||char);
  return expanded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g,' ')
    .trim();
}

export function tokenize(value=''){
  return normalizeText(value).split(/\s+/).filter(Boolean);
}

function subsequenceScore(needle,haystack){
  if(!needle||!haystack)return 0;
  let index=0,gaps=0,last=-1;
  for(const char of needle){
    const found=haystack.indexOf(char,index);
    if(found<0)return 0;
    if(last>=0)gaps+=Math.max(0,found-last-1);
    last=found;index=found+1;
  }
  return Math.max(1,18-gaps);
}

const SEARCH_SYNONYMS={
  'universitaet':'universidad university campus',
  'flughafen':'aeropuerto airport terminal',
  'hauptbahnhof':'hbf central centralstation estacion principal',
  'hbf':'hauptbahnhof central centralstation estacion principal',
  'bahnhof':'estacion station gare',
  'zentrum':'centro center downtown',
  'altstadt':'centro historico oldtown',
  'ost':'este east',
  'west':'oeste west',
  'nord':'norte north',
  'sued':'sur south',
  'hafen':'puerto port harbor',
  'grenze':'frontera border',
  'grenzbahnhof':'estacion fronteriza border station',
  'messe':'expo exhibition',
  'stadion':'estadio stadium',
  'klinikum':'hospital clinic',
  'industriepark':'parque industrial industrial park'
};

function multilingualAliases(values){
  const normalized=normalizeText(values.join(' '));
  return Object.entries(SEARCH_SYNONYMS)
    .filter(([term])=>normalized.includes(term))
    .map(([,aliases])=>aliases);
}

function stationSearchDocument(station){
  const baseAliases=[
    station.name,station.city,station.oldName,station.stationType,
    station.longDistance?'fernverkehr long distance larga distancia ice ic re rb':'',
    station.country==='MX'?'mexico ciudad de mexico cdmx buenavista':'',
    ...(station.amenities||[]),
    ...(station.searchAliases||[])
  ].filter(Boolean);
  const aliases=[...baseAliases,...multilingualAliases(baseAliases)];
  const normalized=normalizeText(aliases.join(' '));
  return {
    station,
    normalized,
    tokens:normalized.split(/\s+/).filter(Boolean),
    name:normalizeText(station.name),
    city:normalizeText(station.city),
    oldName:normalizeText(station.oldName||''),
    type:normalizeText(station.stationType||'')
  };
}

export function createStationSearchIndex(stations=[]){
  return stations.map(stationSearchDocument);
}

function scoreDocument(doc,queryTokens,query){
  if(!query)return 0;
  let score=0;
  if(doc.name===query)score+=240;
  else if(doc.name.startsWith(query))score+=170;
  else if(doc.city===query)score+=150;
  else if(doc.city.startsWith(query))score+=115;
  else if(doc.normalized.includes(query))score+=70;

  for(const token of queryTokens){
    let best=0;
    for(const target of doc.tokens){
      if(target===token)best=Math.max(best,52);
      else if(target.startsWith(token))best=Math.max(best,40);
      else if(target.includes(token))best=Math.max(best,25);
      else best=Math.max(best,subsequenceScore(token,target));
    }
    if(best===0)return -1;
    score+=best;
  }
  if(doc.station.hub)score+=18;
  if(doc.station.longDistance)score+=12;
  return score;
}

export function searchStationIndex(index,query,{favorites=[],recent=[],limit=10}={}){
  const normalizedQuery=normalizeText(query);
  const tokens=normalizedQuery.split(/\s+/).filter(Boolean);
  const favoriteRank=new Map(favorites.map((id,index)=>[id,index]));
  const recentRank=new Map(recent.map((id,index)=>[id,index]));

  if(!normalizedQuery){
    const selected=[];
    for(const id of [...favorites,...recent]){
      const item=index.find(entry=>entry.station.id===id);
      if(item&&!selected.some(entry=>entry.station.id===id))selected.push(item);
    }
    for(const item of index.filter(entry=>entry.station.hub||entry.station.longDistance)){
      if(selected.length>=limit)break;
      if(!selected.some(entry=>entry.station.id===item.station.id))selected.push(item);
    }
    return selected.slice(0,limit).map(entry=>({...entry.station,_searchScore:0}));
  }

  return index
    .map(doc=>{
      let score=scoreDocument(doc,tokens,normalizedQuery);
      if(score<0)return null;
      if(favoriteRank.has(doc.station.id))score+=85-Math.min(30,favoriteRank.get(doc.station.id)*4);
      if(recentRank.has(doc.station.id))score+=55-Math.min(25,recentRank.get(doc.station.id)*3);
      return {...doc.station,_searchScore:score};
    })
    .filter(Boolean)
    .sort((a,b)=>b._searchScore-a._searchScore||Number(b.longDistance)-Number(a.longDistance)||a.name.localeCompare(b.name))
    .slice(0,limit);
}

export function debounce(fn,delay=100){
  let timer=null;
  const wrapped=(...args)=>{
    clearTimeout(timer);
    timer=setTimeout(()=>fn(...args),delay);
  };
  wrapped.cancel=()=>clearTimeout(timer);
  return wrapped;
}

export function rafThrottle(fn){
  let frame=0,lastArgs=null;
  return (...args)=>{
    lastArgs=args;
    if(frame)return;
    frame=requestAnimationFrame(()=>{
      frame=0;
      fn(...lastArgs);
    });
  };
}

export function scheduleIdle(task,timeout=1200){
  if(typeof requestIdleCallback==='function')return requestIdleCallback(task,{timeout});
  return setTimeout(()=>task({didTimeout:true,timeRemaining:()=>0}),32);
}

export function cancelIdle(handle){
  if(typeof cancelIdleCallback==='function')cancelIdleCallback(handle);
  else clearTimeout(handle);
}


export function isEqualJSON(a,b){
  try{return JSON.stringify(a)===JSON.stringify(b)}catch{return false}
}

export function focusFirst(root){
  const element=root?.querySelector?.('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
  element?.focus?.({preventScroll:true});
  return element||null;
}

export function trapFocus(event,root){
  if(event.key!=='Tab'||!root)return;
  const nodes=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(node=>node.offsetParent!==null);
  if(nodes.length<2)return;
  const first=nodes[0],last=nodes.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
}
