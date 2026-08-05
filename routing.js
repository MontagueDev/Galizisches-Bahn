import {STATIONS,RAIL_EDGES,getStation,SERVICE_ALERTS} from './data.js?v=0.8.0-r3';

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
  const allowed=type==='ICE'?['ICE','IC','EC']:type==='IC'?['IC','ICE','RE','IR']:['RE','IR','IC','ICE','S'];
  return shortestPath(from,to,allowed,['MEX'])||shortestPath(from,to,['ICE','IC','RE','IR','S'],['MEX'])||shortestPath(from,to,null,['MEX']);
}

function createInternationalJourneys(search){
  const outbound=search.toId==='MEX';
  const domesticId=outbound?search.fromId:search.toId;
  const hour=Number(search.time.slice(0,2));
  const types=['ICE','IC','RE',...(hour>=20||hour<5?['NJ']:[])];
  const passenger=Math.max(1,Number(search.passengers)||1);
  const classFactor=String(search.travelClass)==='1'?1.42:1;
  const results=[];

  types.forEach((type,index)=>{
    const path=domesticPath(domesticId,'SJR',type);
    if(!path)return;
    const spec=typeSpecs[type];
    const departure=addTime(search.time,index*27);
    const borderMinutes=45;
    const transferMinutes=path.ids.length>1?12:0;
    const rbMinutes=93;
    const operationalDelay=index===1?14:index===2?5:2;
    const domesticMinutes=Math.round(path.minutes*spec.speed)+(path.minutes?operationalDelay:0);
    const rbTrain=trainNumber('RB',index);
    const domesticTrain=trainNumber(type,index);
    const occupancy=occupancyFor(`${search.fromId}${search.toId}${departure}`,index);
    let segments=[];
    let arrival;

    if(outbound){
      const domesticArrival=addTime(departure,domesticMinutes);
      const borderEnd=addTime(domesticArrival,borderMinutes);
      const rbDeparture=addTime(borderEnd,transferMinutes);
      arrival=addTime(rbDeparture,rbMinutes);
      if(path.ids.length>1)segments.push({kind:'train',type,train:domesticTrain,fromId:search.fromId,toId:'SJR',departure,arrival:domesticArrival,path:path.ids,occupancy,composition:composition(type,occupancy)});
      segments.push({kind:'border',stationId:'SJR',direction:'outbound',start:domesticArrival,end:borderEnd,minutes:borderMinutes});
      segments.push({kind:'train',type:'RB',train:rbTrain,fromId:'SJR',toId:'MEX',departure:rbDeparture,arrival,path:['SJR','MEX'],occupancy:'medium',composition:composition('RB','medium')});
    }else{
      const rbArrival=addTime(departure,rbMinutes);
      const borderEnd=addTime(rbArrival,borderMinutes);
      const domesticDeparture=addTime(borderEnd,transferMinutes);
      arrival=addTime(domesticDeparture,domesticMinutes);
      segments.push({kind:'train',type:'RB',train:rbTrain,fromId:'MEX',toId:'SJR',departure,arrival:rbArrival,path:['MEX','SJR'],occupancy:'medium',composition:composition('RB','medium')});
      segments.push({kind:'border',stationId:'SJR',direction:'inbound',start:rbArrival,end:borderEnd,minutes:borderMinutes});
      if(path.ids.length>1)segments.push({kind:'train',type,train:domesticTrain,fromId:'SJR',toId:search.toId,departure:domesticDeparture,arrival,path:[...path.ids].reverse(),occupancy,composition:composition(type,occupancy)});
    }

    const totalMinutes=domesticMinutes+rbMinutes+borderMinutes+transferMinutes;
    const price=Math.max(36,Math.round((path.minutes*spec.price+rbMinutes*.14+18)*classFactor*passenger));
    const pathIds=outbound?[...path.ids,'MEX']:['MEX',...path.ids.slice().reverse()];
    const hasDomestic=path.ids.length>1;
    const connection=operationalDelay>=12?'risk':'safe';
    results.push({
      id:`INT-${type}-${search.fromId}-${search.toId}-${departure}`,
      type:hasDomestic?(outbound?type:'RB'):'RB',train:hasDomestic?(outbound?`${domesticTrain} + ${rbTrain}`:`${rbTrain} + ${domesticTrain}`):rbTrain,
      fromId:search.fromId,toId:search.toId,from:getStation(search.fromId).name,to:getStation(search.toId).name,
      date:search.date,departure,arrival,duration:totalMinutes,baseMinutes:path.minutes+rbMinutes,
      path:pathIds,price,delay:operationalDelay,changes:hasDomestic?1:0,platform:String(2+(index*3)%10),
      travelClass:String(search.travelClass),passengers:passenger,international:true,borderMinutes,
      transferMinutes,connection,night:type==='NJ',segments,occupancy,
      composition:outbound?composition(type,occupancy):composition('RB','medium'),borderStationId:'SJR',mandatoryTransfer:hasDomestic,
      warningAuthority:'Auswärtiges Amt',borderStatus:'restricted',rbTrain
    });
  });
  return results;
}

function createDomesticJourneys(search){
  const hour=Number(search.time.slice(0,2));
  const candidateTypes=['ICE','IC','RE',...(hour>=20||hour<5?['NJ']:[])];
  const passenger=Math.max(1,Number(search.passengers)||1);
  const classFactor=String(search.travelClass)==='1'?1.42:1;
  const results=[];
  candidateTypes.forEach((type,index)=>{
    let path=domesticPath(search.fromId,search.toId,type);
    if(!path)return;
    const spec=typeSpecs[type];
    const alert=SERVICE_ALERTS.find(a=>a.modes.includes(type));
    const delay=(alert?alert.delay:((index*3)%7))+(index===2?8:0);
    const departure=addTime(search.time,index*27);
    const tripMinutes=Math.round(path.minutes*spec.speed)+delay;
    const price=Math.max(22,Math.round(path.minutes*spec.price*classFactor*passenger));
    const changes=Math.max(0,Math.min(2,path.ids.length>5?1:0)+(type==='RE'&&path.ids.length>4?1:0));
    const connection=changes&&delay>=20?'missed':changes&&delay>=12?'risk':'safe';
    const occupancy=occupancyFor(`${search.fromId}${search.toId}${departure}`,index);
    const train=trainNumber(type,index);
    results.push({
      id:`${type}-${search.fromId}-${search.toId}-${departure}`,type,train,
      fromId:search.fromId,toId:search.toId,from:getStation(search.fromId).name,to:getStation(search.toId).name,
      date:search.date,departure,arrival:addTime(departure,tripMinutes),duration:tripMinutes,baseMinutes:path.minutes,path:path.ids,
      price,delay,changes,platform:String(2+(index*3)%12),travelClass:String(search.travelClass),passengers:passenger,
      international:false,borderMinutes:0,connection,night:type==='NJ',occupancy,composition:composition(type,occupancy),
      segments:[{kind:'train',type,train,fromId:search.fromId,toId:search.toId,departure,arrival:addTime(departure,tripMinutes),path:path.ids,occupancy,composition:composition(type,occupancy)}]
    });
  });
  return results;
}

export function createJourneys(search){
  const intl=getStation(search.toId)?.country==='MX'||getStation(search.fromId)?.country==='MX';
  const results=intl?createInternationalJourneys(search):createDomesticJourneys(search);
  return results.sort((a,b)=>a.departure.localeCompare(b.departure));
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
