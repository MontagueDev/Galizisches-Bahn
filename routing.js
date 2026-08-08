import {STATIONS,RAIL_EDGES,getStation,getUrbanNetwork,SERVICE_ALERTS} from './data.js?v=0.9.1-rail-operations1';
import {directServiceOptions,oneTransferServiceOptions,nextRun,minutesOf,clockOf,SERVICE_BY_ID} from './rail-services.js?v=0.9.1-rail-operations1';

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
  if(!plan){
    const mode=station.stationType==='U-Bahn'?'U':'S',minutes=12+(Math.abs([...station.id+gateway.id].reduce((n,c)=>n+c.charCodeAt(0),0))%11),line=`${mode} Zubringer`;
    return{kind:'urban',mode,line,fromId:direction==='outbound'?station.id:gateway.id,toId:direction==='outbound'?gateway.id:station.id,minutes,changes:0,steps:[{lineId:line,mode,from:direction==='outbound'?from:to,to:direction==='outbound'?to:from,stops:Math.max(2,Math.round(minutes/4)),minutes}]};
  }
  return{kind:'urban',mode:plan.steps[0]?.mode||'S',line:plan.steps.map(s=>s.lineId).join(' + '),fromId:direction==='outbound'?station.id:gateway.id,toId:direction==='outbound'?gateway.id:station.id,minutes:plan.minutes,changes:plan.changes,steps:plan.steps};
}
function gatewayOptions(station){
  const options=[];
  if(station.longDistance)options.push({gateway:station,access:null,score:0});
  for(const g of cityGateways(station)){
    if(g.id===station.id)continue;
    const access=urbanAccess(station,g,'outbound');if(access)options.push({gateway:g,access,score:access.minutes});
  }
  return options.sort((a,b)=>a.score-b.score).slice(0,4);
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
function minutesForward(from,to){
  let value=minutesOf(to)-minutesOf(from);if(value<0)value+=1440;return value;
}
function pathForOfficialStops(stops){
  let ids=[],minutes=0;
  for(let i=0;i<stops.length-1;i++){
    const part=shortestPath(stops[i],stops[i+1],null,['MEX']);if(!part)return null;
    minutes+=part.minutes;
    ids.push(...(i?part.ids.slice(1):part.ids));
  }
  return{ids,minutes};
}
function officialLeg(option,readyTime,seed=0){
  const {service,direction,stations}=option,run=nextRun(service,readyTime,direction),path=pathForOfficialStops(stations);if(!path)return null;
  const spec=typeSpecs[service.product]||typeSpecs.RE;
  const running=Math.max(8,Math.round(path.minutes*spec.speed)+(stations.length-2)*3);
  const arrival=addTime(run.departure,running),occupancy=occupancyFor(`${service.id}${run.train}${readyTime}`,seed);
  return{kind:'train',type:service.product,train:run.train,corridorId:service.id,corridorName:service.name,rollingStock:service.rollingStock,frequency:service.frequency,fromId:stations[0],toId:stations.at(-1),departure:run.departure,arrival,minutes:running,path:path.ids,officialStops:stations,occupancy,composition:composition(service.product,occupancy),platformDeparture:String(1+(service.trainBase+seed*3)%16),platformArrival:String(1+(service.trainBase+seed*5+2)%16),priceFactor:service.priceFactor,night:service.night};
}
function officialCoreCandidates(fromId,toId,readyTime){
  const productSets=[['ICE'],['IC'],['RE'],['RB'],['NJ'],['ICE','IC','RE'],['IC','RE','RB']];
  const candidates=[];
  for(const products of productSets){
    for(const option of directServiceOptions(fromId,toId,products)){
      const leg=officialLeg(option,readyTime,candidates.length);if(leg)candidates.push({legs:[leg],official:true,signature:option.service.id,product:option.service.product});
    }
  }
  {
    const transfers=oneTransferServiceOptions(fromId,toId,['ICE','IC','RE','RB']).filter(item=>item.legs[0].service.id!==item.legs[1].service.id).sort((a,b)=>{const score=x=>x.legs.reduce((n,l)=>n+({ICE:1,IC:2,RE:3,RB:4}[l.service.product]||5),0);return score(a)-score(b)}).slice(0,30);
    for(const transfer of transfers){
      const first=officialLeg(transfer.legs[0],readyTime,candidates.length);if(!first)continue;
      const second=officialLeg(transfer.legs[1],addTime(first.arrival,12),candidates.length+1);if(!second)continue;
      candidates.push({legs:[first,second],official:true,signature:`${transfer.legs[0].service.id}+${transfer.legs[1].service.id}`,product:first.type,transfer:transfer.transfer});
    }
  }
  return candidates.sort((a,b)=>{
    const aEnd=a.legs.at(-1).arrival,bEnd=b.legs.at(-1).arrival;
    return minutesForward(readyTime,aEnd)-minutesForward(readyTime,bEnd);
  });
}
function createDomesticJourneys(search){
  const same=createSameCityJourney(search);if(same.length)return same;
  const origin=getStation(search.fromId),destination=getStation(search.toId);if(!origin||!destination)return[];
  const starts=gatewayOptions(origin),ends=gatewayOptions(destination).map(item=>({gateway:item.gateway,score:item.score,access:item.gateway.id===destination.id?null:reverseAccess(destination,item.gateway)})).filter(item=>item.gateway.id===destination.id||item.access).slice(0,4);
  const passenger=Math.max(1,Number(search.passengers)||1),classFactor=String(search.travelClass)==='1'?1.42:1;
  const all=[];
  for(const start of starts){for(const end of ends){
    const outAccess=start.access,inAccess=end.access||null;
    let ready=search.time;
    if(outAccess)ready=addTime(ready,outAccess.minutes+9);
    const cores=officialCoreCandidates(start.gateway.id,end.gateway.id,ready);
    for(const core of cores){
      let cursor=search.time,segments=[],display=[];
      if(outAccess){const seg=accessSegment(outAccess,cursor);segments.push(seg);display.push(...urbanDisplay(outAccess));cursor=addTime(seg.arrival,9)}
      let waiting=0;
      for(let i=0;i<core.legs.length;i++){
        const original=core.legs[i],leg={...original};
        if(i===0){waiting=minutesForward(cursor,leg.departure)}else{
          const minReady=addTime(cursor,12),next=nextRun(SERVICE_BY_ID.get(leg.corridorId),minReady,leg.officialStops[0]===SERVICE_BY_ID.get(leg.corridorId).stations[0]?1:-1);
          waiting+=minutesForward(cursor,next.departure);leg.departure=next.departure;leg.train=next.train;leg.arrival=addTime(next.departure,leg.minutes);
        }
        segments.push(leg);display.push({type:leg.type,train:leg.train,weight:Math.max(2,leg.officialStops.length),corridorId:leg.corridorId});cursor=leg.arrival;
        if(i<core.legs.length-1)cursor=addTime(cursor,12);
      }
      if(inAccess){cursor=addTime(cursor,7);const seg=accessSegment(inAccess,cursor);segments.push(seg);display.push(...urbanDisplay(inAccess));cursor=seg.arrival}
      const trainSegments=segments.filter(s=>s.kind==='train'),changes=Math.max(0,segments.filter(s=>s.kind!=='border').length-1);
      const weighted=trainSegments.reduce((n,leg)=>n+leg.minutes*(leg.priceFactor||.5),0),urbanMinutes=(outAccess?.minutes||0)+(inAccess?.minutes||0);
      const price=Math.max(7,Math.round((weighted*.42+urbanMinutes*.07)*classFactor*passenger));
      const overallDeparture=segments[0]?.departure||search.time,duration=minutesForward(overallDeparture,cursor),delay=(core.signature.charCodeAt(0)+duration)%11===0?7:0,occupancy=trainSegments[0]?.occupancy||'medium';
      all.push({id:`V091-${core.signature}-${origin.id}-${destination.id}-${overallDeparture}`,type:segments[0]?.type||trainSegments[0]?.type,train:display.map(d=>d.train).join(' + '),fromId:origin.id,toId:destination.id,from:origin.name,to:destination.name,date:search.date,departure:overallDeparture,arrival:cursor,duration,baseMinutes:trainSegments.reduce((n,s)=>n+s.minutes,0),path:[origin.id,...trainSegments.flatMap(s=>s.path).filter((id,i,a)=>i===0||id!==a[i-1]),destination.id],price,delay,changes,platform:trainSegments[0]?.platformDeparture||'—',arrivalPlatform:trainSegments.at(-1)?.platformArrival||'—',travelClass:String(search.travelClass),passengers:passenger,international:false,borderMinutes:0,connection:waiting>30?'risk':'safe',night:trainSegments.some(s=>s.night),occupancy,composition:trainSegments[0]?.composition||[],segments,displayServices:display,accessGateway:start.gateway.name,egressGateway:end.gateway.name,profile:core.product.toLowerCase(),officialService:true,corridors:trainSegments.map(s=>s.corridorId),waitingMinutes:waiting});
    }
  }}
  const unique=[];const seen=new Set();
  const addUnique=item=>{if(item&&!seen.has(item.train)){seen.add(item.train);unique.push(item)}};
  const direct=all.filter(item=>item.segments.filter(seg=>seg.kind==='train').length===1).sort((a,b)=>a.duration-b.duration);
  addUnique(direct[0]);
  const requestedHour=Number(search.time.slice(0,2));const productOrder=(requestedHour>=18||requestedHour<5)?['ICE','IC','RE','RB','NJ']:['ICE','IC','RE','RB'];
  for(const product of productOrder){
    const directProduct=direct.filter(x=>x.segments.some(seg=>seg.kind==='train'&&seg.type===product))[0];
    const anyProduct=all.filter(x=>x.segments.some(seg=>seg.kind==='train'&&seg.type===product)).sort((a,b)=>a.duration-b.duration)[0];
    addUnique(directProduct||anyProduct);
  }
  addUnique(all.sort((a,b)=>a.duration-b.duration)[0]);
  for(const item of all.sort((a,b)=>a.duration-b.duration)){if(unique.length>=6)break;if(item.night&&!(requestedHour>=18||requestedHour<5))continue;addUnique(item)}
  if(unique.length)return unique.sort((a,b)=>a.departure.localeCompare(b.departure)||a.duration-b.duration);
  // Graph fallback only when no official operating corridor can serve the selected gateways.
  const fallback=domesticPath(starts[0]?.gateway.id,ends[0]?.gateway.id,'RE');if(!fallback)return[];
  const departure=search.time,arrival=addTime(departure,Math.round(fallback.minutes*1.15));
  return[{id:`FALLBACK-${origin.id}-${destination.id}-${departure}`,type:'RE',train:'RE Ersatzverkehr',fromId:origin.id,toId:destination.id,from:origin.name,to:destination.name,date:search.date,departure,arrival,duration:minutesForward(departure,arrival),baseMinutes:fallback.minutes,path:fallback.ids,price:Math.max(8,Math.round(fallback.minutes*.16*passenger)),delay:0,changes:0,platform:'—',travelClass:String(search.travelClass),passengers:passenger,international:false,borderMinutes:0,connection:'safe',night:false,occupancy:'medium',composition:composition('RE','medium'),segments:[],displayServices:[{type:'RE',train:'RE Ersatzverkehr',weight:fallback.ids.length}],officialService:false}];
}
function createInternationalJourneys(search){
  const outbound=search.toId==='MEX',domesticStation=getStation(outbound?search.fromId:search.toId);if(!domesticStation)return[];
  const gates=gatewayOptions(domesticStation);const passenger=Math.max(1,Number(search.passengers)||1),classFactor=String(search.travelClass)==='1'?1.42:1;
  const types=['ICE','IC','RE'];const results=[];
  types.forEach((type,index)=>{
    const gate=gates[index%Math.max(1,gates.length)];if(!gate)return;const path=domesticPath(gate.gateway.id,'SJR',type);if(!path)return;
    const access=gate.access,borderMinutes=45,rbMinutes=93,departure=addTime(search.time,index*28),occupancy=occupancyFor(`${search.fromId}${search.toId}${departure}`,index),officialOption=directServiceOptions(gate.gateway.id,'SJR',[type])[0],officialRun=officialOption?nextRun(officialOption.service,departure,officialOption.direction):null,domesticTrain=officialRun?.train||trainNumber(type,index+2),borderService=SERVICE_BY_ID.get('RBM90'),borderRun=nextRun(borderService,departure,outbound?1:-1),rbTrain=borderRun.train,segments=[],display=[];
    let cursor=departure;
    if(outbound&&access){const seg=accessSegment(access,cursor);segments.push(seg);display.push(...urbanDisplay(access));cursor=addTime(seg.arrival,9)}
    if(outbound){const domesticArrival=addTime(cursor,Math.round(path.minutes*typeSpecs[type].speed));segments.push({kind:'train',type,train:domesticTrain,corridorId:officialOption?.service.id||null,corridorName:officialOption?.service.name||null,rollingStock:officialOption?.service.rollingStock||type,fromId:gate.gateway.id,toId:'SJR',departure:cursor,arrival:domesticArrival,path:path.ids,occupancy,composition:composition(type,occupancy),platformDeparture:String(3+index*2),platformArrival:'7'});display.push({type,train:domesticTrain,weight:path.ids.length});const borderEnd=addTime(domesticArrival,borderMinutes);segments.push({kind:'border',stationId:'SJR',direction:'outbound',start:domesticArrival,end:borderEnd,minutes:borderMinutes});cursor=addTime(borderEnd,12);const arrival=addTime(cursor,rbMinutes);segments.push({kind:'train',type:'RB',train:rbTrain,corridorId:'RBM90',corridorName:'RB México',rollingStock:borderService.rollingStock,fromId:'SJR',toId:'MEX',departure:cursor,arrival,path:['SJR','MEX'],occupancy:'medium',composition:composition('RB','medium'),platformDeparture:'4',platformArrival:'2'});display.push({type:'RB',train:rbTrain,weight:2});cursor=arrival}
    else{const rbArrival=addTime(cursor,rbMinutes);segments.push({kind:'train',type:'RB',train:rbTrain,corridorId:'RBM90',corridorName:'RB México',rollingStock:borderService.rollingStock,fromId:'MEX',toId:'SJR',departure:cursor,arrival:rbArrival,path:['MEX','SJR'],occupancy:'medium',composition:composition('RB','medium'),platformDeparture:'2',platformArrival:'4'});display.push({type:'RB',train:rbTrain,weight:2});const borderEnd=addTime(rbArrival,borderMinutes);segments.push({kind:'border',stationId:'SJR',direction:'inbound',start:rbArrival,end:borderEnd,minutes:borderMinutes});cursor=addTime(borderEnd,12);const domesticArrival=addTime(cursor,Math.round(path.minutes*typeSpecs[type].speed));segments.push({kind:'train',type,train:domesticTrain,corridorId:officialOption?.service.id||null,corridorName:officialOption?.service.name||null,rollingStock:officialOption?.service.rollingStock||type,fromId:'SJR',toId:gate.gateway.id,departure:cursor,arrival:domesticArrival,path:path.ids.slice().reverse(),occupancy,composition:composition(type,occupancy),platformDeparture:'7',platformArrival:String(3+index*2)});display.push({type,train:domesticTrain,weight:path.ids.length});cursor=domesticArrival;if(access){const inward=reverseAccess(domesticStation,gate.gateway);cursor=addTime(cursor,7);const seg=accessSegment(inward,cursor);segments.push(seg);display.push(...urbanDisplay(inward));cursor=seg.arrival}}
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
