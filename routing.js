import {STATIONS,RAIL_EDGES,getStation,getUrbanNetwork,SERVICE_ALERTS} from './data.js?v=0.9.0-network-expansion1';

const adjacency=new Map();
for(const [a,b,minutes,modes] of RAIL_EDGES){
  if(!adjacency.has(a))adjacency.set(a,[]);
  if(!adjacency.has(b))adjacency.set(b,[]);
  adjacency.get(a).push({to:b,minutes,modes});
  adjacency.get(b).push({to:a,minutes,modes});
}

function shortestPath(from,to,allowed=null,blocked=[]){
  if(from===to)return{ids:[from],edges:[],minutes:0};
  const blockedSet=new Set(blocked);
  const dist=new Map([[from,0]]),prev=new Map(),queue=new Set(STATIONS.map(s=>s.id).filter(id=>!blockedSet.has(id)||id===from||id===to));
  while(queue.size){
    let u=null,best=Infinity;
    for(const id of queue){const d=dist.get(id)??Infinity;if(d<best){best=d;u=id}}
    if(u===null||u===to)break;
    queue.delete(u);
    for(const edge of adjacency.get(u)||[]){
      if(blockedSet.has(edge.to)&&edge.to!==to)continue;
      if(allowed&&!edge.modes.some(mode=>allowed.includes(mode)))continue;
      const alt=best+edge.minutes;
      if(alt<(dist.get(edge.to)??Infinity)){dist.set(edge.to,alt);prev.set(edge.to,{id:u,edge})}
    }
  }
  if(!dist.has(to))return null;
  const ids=[];let cursor=to;
  while(cursor){ids.unshift(cursor);if(cursor===from)break;cursor=prev.get(cursor)?.id}
  const edges=[];
  for(let i=0;i<ids.length-1;i++)edges.push((adjacency.get(ids[i])||[]).find(edge=>edge.to===ids[i+1]));
  return{ids,edges,minutes:dist.get(to)};
}

export const addTime=(time,mins)=>{
  const [h,m]=time.split(':').map(Number);
  const n=(h*60+m+mins+1440)%1440;
  return`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
};

const typeSpecs={
  ICE:{speed:.78,price:.34},IC:{speed:.9,price:.26},EC:{speed:.92,price:.31},
  RE:{speed:1.15,price:.16},IR:{speed:1.02,price:.20},NJ:{speed:1.26,price:.39},RB:{speed:1.08,price:.14}
};
const trainNumber=(type,index)=>`${type} ${type==='ICE'?100+index*6:type==='IC'?600+index*7:type==='EC'?18+index*2:type==='NJ'?490+index:type==='RB'?90+index*2:7400+index*13}`;
const occupancyFor=(text,index)=>['low','medium','high'][(Math.abs([...text].reduce((n,c)=>n+c.charCodeAt(0),0))+index)%3];
function composition(type,occupancy){
  if(type==='RB')return[{coach:'A',kind:'Mehrzweck',occupancy},{coach:'B',kind:'2. Klasse',occupancy},{coach:'C',kind:'2. Klasse',occupancy}];
  if(type==='RE'||type==='IR')return[{coach:'1',kind:'1./2. Klasse',occupancy},{coach:'2',kind:'2. Klasse',occupancy},{coach:'3',kind:'Fahrrad',occupancy},{coach:'4',kind:'2. Klasse',occupancy}];
  if(type==='NJ')return[{coach:'11',kind:'Sitzwagen',occupancy},{coach:'12',kind:'Liegewagen',occupancy},{coach:'13',kind:'Schlafwagen',occupancy}];
  return[{coach:'1',kind:'1. Klasse',occupancy},{coach:'2',kind:'Restaurant',occupancy},{coach:'3',kind:'Ruhebereich',occupancy},{coach:'4',kind:'2. Klasse',occupancy},{coach:'5',kind:'2. Klasse',occupancy},{coach:'6',kind:'Fahrrad',occupancy}];
}

function domesticPath(from,to,type){
  const allowed=type==='ICE'?['ICE','IC']:type==='IC'?['IC','ICE','RE']:type==='RE'?['RE','IR','IC','RB']:['RB','RE','IR'];
  return shortestPath(from,to,allowed,['MEX'])||shortestPath(from,to,['ICE','IC','RE','IR','RB','S'],['MEX'])||shortestPath(from,to,null,['MEX']);
}

function cityGateways(station){
  if(!station)return[];
  return STATIONS.filter(s=>s.country===station.country&&s.city===station.city&&s.longDistance);
}
function stationUrbanName(station){return station?.urbanStop||station?.name?.replace(`${station.city} `,'').replace(' Fernbahnhof','')}
function urbanAccess(station,gateway,direction='outbound'){
  if(!station||!gateway||station.id===gateway.id)return null;
  const networkId=station.urbanNetworkId||gateway.urbanNetworkId;
  if(!networkId)return null;
  const network=getUrbanNetwork(networkId);
  const from=stationUrbanName(station),to=stationUrbanName(gateway);
  const plan=planUrban(network,direction==='outbound'?from:to,direction==='outbound'?to:from);
  if(!plan)return null;
  return{kind:'urban',mode:plan.steps[0]?.mode||'S',line:plan.steps.map(s=>s.lineId).join(' + '),fromId:direction==='outbound'?station.id:gateway.id,toId:direction==='outbound'?gateway.id:station.id,minutes:plan.minutes,changes:plan.changes,steps:plan.steps};
}
function gatewayOptions(station){
  if(station.longDistance)return[{gateway:station,access:null,score:0}];
  return cityGateways(station).map(g=>{const access=urbanAccess(station,g,'outbound');return{gateway:g,access,score:access?.minutes??999}}).filter(x=>x.score<999).sort((a,b)=>a.score-b.score).slice(0,3);
}
function reverseAccess(station,gateway){return station.id===gateway.id?null:urbanAccess(station,gateway,'inbound')}
function urbanDisplay(access,index=0){
  if(!access)return[];
  return access.steps.map((step,i)=>({type:step.mode,train:step.lineId,weight:Math.max(1,step.stops),urban:true}));
}
function accessSegment(access,departure){
  if(!access)return null;
  return{kind:'urban',type:access.mode,train:access.line,fromId:access.fromId,toId:access.toId,departure,arrival:addTime(departure,access.minutes),minutes:access.minutes,steps:access.steps};
}
function createSameCityJourney(search){
  const a=getStation(search.fromId),b=getStation(search.toId);if(!a||!b||a.city!==b.city||!a.urbanNetworkId)return[];
  const network=getUrbanNetwork(a.urbanNetworkId),plan=planUrban(network,stationUrbanName(a),stationUrbanName(b));if(!plan)return[];
  const departure=search.time,arrival=addTime(departure,plan.minutes),passenger=Math.max(1,Number(search.passengers)||1);
  return[{id:`CITY-${a.id}-${b.id}-${departure}`,type:plan.steps[0]?.mode||'S',train:plan.steps.map(s=>s.lineId).join(' + '),fromId:a.id,toId:b.id,from:a.name,to:b.name,date:search.date,departure,arrival,duration:plan.minutes,baseMinutes:plan.minutes,path:[a.id,b.id],price:4*passenger,delay:0,changes:plan.changes,platform:'—',travelClass:'2',passengers:passenger,international:false,borderMinutes:0,connection:'safe',night:false,occupancy:'medium',composition:[],segments:[accessSegment({mode:plan.steps[0]?.mode||'S',line:plan.steps.map(s=>s.lineId).join(' + '),fromId:a.id,toId:b.id,minutes:plan.minutes,steps:plan.steps},departure)],displayServices:plan.steps.map(s=>({type:s.mode,train:s.lineId,weight:Math.max(1,s.stops),urban:true}))}];
}
function createDomesticJourneys(search){
  const same=createSameCityJourney(search);if(same.length)return same;
  const origin=getStation(search.fromId),destination=getStation(search.toId);if(!origin||!destination)return[];
  const starts=gatewayOptions(origin),ends=(destination.longDistance?[{gateway:destination,score:0}]:cityGateways(destination).map(g=>({gateway:g,score:reverseAccess(destination,g)?.minutes??999})).filter(x=>x.score<999).sort((a,b)=>a.score-b.score).slice(0,3));
  const hour=Number(search.time.slice(0,2)),passenger=Math.max(1,Number(search.passengers)||1),classFactor=String(search.travelClass)==='1'?1.42:1;
  const profiles=[
    {type:'ICE',offset:0,label:'fast',price:.34},
    {type:'IC',offset:17,label:'balanced',price:.25},
    {type:'RE',offset:31,label:'regional',price:.16},
    {type:'RB',offset:44,label:'cheap',price:.11},
    ...(hour>=19||hour<5?[{type:'NJ',offset:65,label:'night',price:.38}]:[])
  ];
  const results=[];
  profiles.forEach((profile,index)=>{
    const start=starts[index%Math.max(1,starts.length)],end=ends[(index+1)%Math.max(1,ends.length)];if(!start||!end)return;
    const core=domesticPath(start.gateway.id,end.gateway.id,profile.type);if(!core)return;
    const outAccess=start.access, inAccess=destination.id===end.gateway.id?null:reverseAccess(destination,end.gateway);
    const departure=addTime(search.time,profile.offset),outMinutes=outAccess?.minutes||0,inMinutes=inAccess?.minutes||0;
    const buffer=(outAccess?9:0)+(inAccess?7:0),spec=typeSpecs[profile.type]||typeSpecs.RE;
    let coreMinutes=Math.round(core.minutes*spec.speed);
    if(profile.type==='RB')coreMinutes=Math.round(core.minutes*1.38);
    const delay=index===1?4:index===2?9:0,total=outMinutes+buffer+coreMinutes+inMinutes+delay;
    let cursor=departure,segments=[],display=[];
    if(outAccess){const seg=accessSegment(outAccess,cursor);segments.push(seg);display.push(...urbanDisplay(outAccess));cursor=addTime(seg.arrival,9)}
    const coreArrival=addTime(cursor,coreMinutes+delay),train=trainNumber(profile.type,index+1),occupancy=occupancyFor(`${origin.id}${destination.id}${departure}`,index);
    segments.push({kind:'train',type:profile.type,train,fromId:start.gateway.id,toId:end.gateway.id,departure:cursor,arrival:coreArrival,path:core.ids,occupancy,composition:composition(profile.type,occupancy)});
    display.push({type:profile.type,train,weight:Math.max(2,core.ids.length)});cursor=coreArrival;
    if(inAccess){cursor=addTime(cursor,7);const seg=accessSegment(inAccess,cursor);segments.push(seg);display.push(...urbanDisplay(inAccess));cursor=seg.arrival}
    const changes=Math.max(0,segments.length-1)+(profile.type==='RE'&&core.ids.length>5?1:0)+(profile.type==='RB'&&core.ids.length>4?1:0);
    const basePrice=Math.max(8,core.minutes*profile.price+outMinutes*.08+inMinutes*.08),price=Math.round(basePrice*classFactor*passenger);
    results.push({id:`V09-${profile.type}-${origin.id}-${destination.id}-${departure}`,type:segments[0]?.type||profile.type,train:display.map(d=>d.train).join(' + '),fromId:origin.id,toId:destination.id,from:origin.name,to:destination.name,date:search.date,departure,arrival:cursor,duration:total,baseMinutes:core.minutes,path:[origin.id,...core.ids.filter(id=>id!==origin.id&&id!==destination.id),destination.id],price,delay,changes,platform:String(2+(index*3)%12),travelClass:String(search.travelClass),passengers:passenger,international:false,borderMinutes:0,connection:delay>=12?'risk':'safe',night:profile.type==='NJ',occupancy,composition:composition(profile.type,occupancy),segments,displayServices:display,accessGateway:start.gateway.name,egressGateway:end.gateway.name,profile:profile.label});
  });
  return results;
}
function createInternationalJourneys(search){
  const outbound=search.toId==='MEX',domesticStation=getStation(outbound?search.fromId:search.toId);if(!domesticStation)return[];
  const gates=gatewayOptions(domesticStation);const passenger=Math.max(1,Number(search.passengers)||1),classFactor=String(search.travelClass)==='1'?1.42:1;
  const types=['ICE','IC','RE'];const results=[];
  types.forEach((type,index)=>{
    const gate=gates[index%Math.max(1,gates.length)];if(!gate)return;const path=domesticPath(gate.gateway.id,'SJR',type);if(!path)return;
    const access=gate.access,borderMinutes=45,rbMinutes=93,departure=addTime(search.time,index*28),occupancy=occupancyFor(`${search.fromId}${search.toId}${departure}`,index),domesticTrain=trainNumber(type,index+2),rbTrain=trainNumber('RB',index),segments=[],display=[];
    let cursor=departure;
    if(outbound&&access){const seg=accessSegment(access,cursor);segments.push(seg);display.push(...urbanDisplay(access));cursor=addTime(seg.arrival,9)}
    if(outbound){const domesticArrival=addTime(cursor,Math.round(path.minutes*typeSpecs[type].speed));segments.push({kind:'train',type,train:domesticTrain,fromId:gate.gateway.id,toId:'SJR',departure:cursor,arrival:domesticArrival,path:path.ids,occupancy,composition:composition(type,occupancy)});display.push({type,train:domesticTrain,weight:path.ids.length});const borderEnd=addTime(domesticArrival,borderMinutes);segments.push({kind:'border',stationId:'SJR',direction:'outbound',start:domesticArrival,end:borderEnd,minutes:borderMinutes});cursor=addTime(borderEnd,12);const arrival=addTime(cursor,rbMinutes);segments.push({kind:'train',type:'RB',train:rbTrain,fromId:'SJR',toId:'MEX',departure:cursor,arrival,path:['SJR','MEX'],occupancy:'medium',composition:composition('RB','medium')});display.push({type:'RB',train:rbTrain,weight:2});cursor=arrival}
    else{const rbArrival=addTime(cursor,rbMinutes);segments.push({kind:'train',type:'RB',train:rbTrain,fromId:'MEX',toId:'SJR',departure:cursor,arrival:rbArrival,path:['MEX','SJR'],occupancy:'medium',composition:composition('RB','medium')});display.push({type:'RB',train:rbTrain,weight:2});const borderEnd=addTime(rbArrival,borderMinutes);segments.push({kind:'border',stationId:'SJR',direction:'inbound',start:rbArrival,end:borderEnd,minutes:borderMinutes});cursor=addTime(borderEnd,12);const domesticArrival=addTime(cursor,Math.round(path.minutes*typeSpecs[type].speed));segments.push({kind:'train',type,train:domesticTrain,fromId:'SJR',toId:gate.gateway.id,departure:cursor,arrival:domesticArrival,path:path.ids.slice().reverse(),occupancy,composition:composition(type,occupancy)});display.push({type,train:domesticTrain,weight:path.ids.length});cursor=domesticArrival;if(access){const inward=reverseAccess(domesticStation,gate.gateway);cursor=addTime(cursor,7);const seg=accessSegment(inward,cursor);segments.push(seg);display.push(...urbanDisplay(inward));cursor=seg.arrival}}
    const total=segments.reduce((n,s)=>n+(s.minutes||((Date.parse(`1970-01-01T${s.arrival}:00Z`)-Date.parse(`1970-01-01T${s.departure}:00Z`))/60000)||0),0)+45+12;
    const price=Math.round((path.minutes*(typeSpecs[type]?.price||.2)+36)*classFactor*passenger);
    results.push({id:`INT09-${type}-${search.fromId}-${search.toId}-${departure}`,type:display[0]?.type||type,train:display.map(x=>x.train).join(' + '),fromId:search.fromId,toId:search.toId,from:getStation(search.fromId).name,to:getStation(search.toId).name,date:search.date,departure,arrival:cursor,duration:Math.max(120,total),baseMinutes:path.minutes+rbMinutes,path:outbound?[search.fromId,...path.ids.slice(1),'MEX']:['MEX',...path.ids.slice().reverse().slice(1),search.toId],price,delay:index===1?8:2,changes:segments.filter(s=>s.kind!=='border').length-1,platform:String(3+index*2),travelClass:String(search.travelClass),passengers:passenger,international:true,borderMinutes,connection:index===1?'risk':'safe',night:false,segments,occupancy,composition:composition(type,occupancy),borderStationId:'SJR',mandatoryTransfer:true,warningAuthority:'Auswärtiges Amt',borderStatus:'restricted',rbTrain,displayServices:display});
  });
  return results;
}
export function createJourneys(search){
  const intl=getStation(search.toId)?.country==='MX'||getStation(search.fromId)?.country==='MX';
  return (intl?createInternationalJourneys(search):createDomesticJourneys(search)).sort((a,b)=>a.departure.localeCompare(b.departure));
}

export function planUrban(network,from,to){
  if(from===to)return null;
  const lines=network.lines;
  const queue=[{stop:from,steps:[]}],seen=new Set([from]);
  while(queue.length){
    const cur=queue.shift();
    for(const line of lines.filter(l=>l.stops.includes(cur.stop))){
      const start=line.stops.indexOf(cur.stop);
      for(const dir of[-1,1]){
        for(let i=start+dir;i>=0&&i<line.stops.length;i+=dir){
          const stop=line.stops[i];
          const segment={lineId:line.id,color:line.color,mode:line.mode,from:cur.stop,to:stop,stops:Math.abs(i-start),minutes:Math.abs(i-start)*3+Math.max(1,Math.round(line.minutes/3))};
          const steps=[...cur.steps,segment];
          if(stop===to){
            const compact=[];
            for(const step of steps){const last=compact.at(-1);if(last&&last.lineId===step.lineId&&last.to===step.from){last.to=step.to;last.stops+=step.stops;last.minutes+=step.minutes}else compact.push({...step})}
            return{steps:compact,minutes:compact.reduce((n,s)=>n+s.minutes,0)+(compact.length-1)*6,changes:Math.max(0,compact.length-1)};
          }
          if(!seen.has(stop)&&cur.steps.length<2){seen.add(stop);queue.push({stop,steps})}
        }
      }
    }
  }
  return null;
}
