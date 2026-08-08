const TYPE_SPEED={ICE:285,IC:205,EC:200,RE:145,RB:115,S:80,U:55,NJ:175,TRAM:42,BUS:34};
const toMinutes=time=>{const [h,m]=String(time||'00:00').split(':').map(Number);return h*60+m};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function dateAt(date,time,dayOffset=0){const d=new Date(`${date}T00:00:00`);d.setDate(d.getDate()+dayOffset);const [h,m]=String(time||'00:00').split(':').map(Number);d.setHours(h||0,m||0,0,0);return d}
function absoluteSequence(date,segments=[]){
  let day=0,last=null;
  return segments.map((seg,index)=>{
    let start=dateAt(date,seg.departure||seg.start||'00:00',day);
    if(last&&start<last){day++;start=dateAt(date,seg.departure||seg.start||'00:00',day)}
    let end=dateAt(date,seg.arrival||seg.end||seg.departure||seg.start||'00:00',day);
    if(end<start)end=dateAt(date,seg.arrival||seg.end||'00:00',day+1);
    last=end;return {...seg,_index:index,_start:start,_end:end};
  });
}
function shift(date,minutes){return new Date(date.getTime()+minutes*60000)}
function labelForSegment(seg){if(seg.kind==='border')return'borderControl';if(seg.kind==='urban')return'underway';return'underway'}
function expandedTrainStops(seg){
  const path=Array.isArray(seg.path)&&seg.path.length?seg.path:[seg.fromId,seg.toId].filter(Boolean);if(path.length<2)return[];
  const total=seg._end-seg._start;
  return path.map((stationId,index)=>({stationId,time:new Date(seg._start.getTime()+total*(index/(path.length-1))),source:seg,index}));
}
export function effectiveNow(offsetMinutes=0,baseNow=new Date()){return new Date(baseNow.getTime()+Number(offsetMinutes||0)*60000)}
export function buildJourneyTimeline(ticket,{now=new Date(),timeOffsetMinutes=0,override={}}={}){
  const baseNow=effectiveNow(timeOffsetMinutes,now),delay=Number(ticket?.delay||0)+Number(override?.delayMinutes||0),cancelled=ticket?.status==='cancelled'||override?.cancelled===true;
  let segments=absoluteSequence(ticket?.date||new Date().toISOString().slice(0,10),ticket?.segments||[]);
  if(!segments.length){segments=absoluteSequence(ticket?.date||new Date().toISOString().slice(0,10),[{kind:'train',type:ticket?.type||'ICE',train:ticket?.train,fromId:ticket?.fromId,toId:ticket?.toId,departure:ticket?.departure,arrival:ticket?.arrival,path:ticket?.path||[ticket?.fromId,ticket?.toId]}])}
  const first=segments[0],last=segments.at(-1),plannedStart=first?first._start:dateAt(ticket.date,ticket.departure),plannedEnd=last?last._end:dateAt(ticket.date,ticket.arrival),actualStart=shift(plannedStart,delay),actualEnd=shift(plannedEnd,delay),boardingStart=shift(actualStart,-12);
  let status='scheduled';
  if(cancelled)status='cancelled';else if(baseNow>=actualEnd||override?.forceFinished)status='completed';else if(baseNow>=boardingStart&&baseNow<actualStart)status='boarding';else if(baseNow>=actualStart&&baseNow<actualEnd)status='underway';
  const shiftedSegments=segments.map(seg=>({...seg,_actualStart:shift(seg._start,delay),_actualEnd:shift(seg._end,delay)}));
  let currentSegment=null,nextSegment=null;
  if(status==='underway'){
    currentSegment=shiftedSegments.find(seg=>baseNow>=seg._actualStart&&baseNow<=seg._actualEnd)||null;
    if(!currentSegment){
      const next=shiftedSegments.find(seg=>baseNow<seg._actualStart);nextSegment=next||null;
      if(next){const previous=shiftedSegments[shiftedSegments.indexOf(next)-1];if(previous&&baseNow>previous._actualEnd){status=next.kind==='border'?'borderControl':'atStation'}}
    }else if(currentSegment.kind==='border')status='borderControl';
  }
  if(status==='underway'&&['train','urban'].includes(currentSegment?.kind)){
    const stops=expandedTrainStops(currentSegment).map(stop=>({...stop,time:shift(stop.time,delay)}));
    const near=stops.find(stop=>Math.abs(baseNow-stop.time)<=90*1000);
    if(near&&near.stationId!==currentSegment.fromId&&near.stationId!==currentSegment.toId)status='atStation';
  }
  const totalMs=Math.max(1,actualEnd-actualStart),progress=status==='completed'?1:status==='scheduled'||status==='boarding'||status==='cancelled'?0:clamp((baseNow-actualStart)/totalMs,0,1);
  const timeline=[];
  shiftedSegments.forEach((seg,segIndex)=>{
    if(seg.kind==='train'||seg.kind==='urban'){
      expandedTrainStops(seg).forEach((stop,index,arr)=>{
        if(segIndex>0&&index===0)return;
        const time=shift(stop.time,delay);timeline.push({kind:'station',stationId:stop.stationId,time,plannedTime:stop.time,state:baseNow>time?'past':Math.abs(baseNow-time)<2*60000?'current':'future',train:seg.train,type:seg.type,platform:index===0?seg.platformDeparture:index===arr.length-1?seg.platformArrival:null});
      });
    }else if(seg.kind==='border'){
      timeline.push({kind:'border',stationId:seg.stationId||'SJR',time:seg._actualStart,end:seg._actualEnd,state:baseNow>seg._actualEnd?'past':baseNow>=seg._actualStart?'current':'future'});
    }
  });
  timeline.sort((a,b)=>a.time-b.time);
  let nextStop=timeline.find(item=>item.kind==='station'&&item.time>baseNow)||timeline.filter(item=>item.kind==='station').at(-1)||null;
  let currentStop=timeline.find(item=>item.state==='current')||null;
  const activeTrain=['train','urban'].includes(currentSegment?.kind)?currentSegment:shiftedSegments.find(seg=>['train','urban'].includes(seg.kind)&&baseNow<seg._actualEnd)||shiftedSegments.find(seg=>['train','urban'].includes(seg.kind));
  const remainingMinutes=status==='completed'?0:Math.max(0,Math.ceil((actualEnd-baseNow)/60000));
  const speed=(status==='underway'&&['train','urban'].includes(currentSegment?.kind))?(TYPE_SPEED[currentSegment.type]||150):0;
  return {status,now:baseNow,plannedStart,plannedEnd,actualStart,actualEnd,boardingStart,delay,progress,remainingMinutes,currentSegment,nextSegment,currentStop,nextStop,timeline,speed,platform:override?.platform||activeTrain?.platformDeparture||ticket?.platform||'—',activeTrain};
}
export function journeyStatusKey(status){return({scheduled:'liveScheduled',boarding:'liveBoarding',underway:'liveUnderway',atStation:'liveAtStation',borderControl:'liveBorderControl',completed:'liveCompleted',cancelled:'liveCancelled'})[status]||'liveScheduled'}
export function connectionRisk(ticket,timeline){
  const segs=timeline?.currentSegment?ticket?.segments||[]:ticket?.segments||[];if(!segs.length)return'safe';
  const delay=timeline?.delay||0;return delay>=15?'missed':delay>=8?'risk':'safe';
}
export function nextDeveloperJumpMinutes(timeline){
  const now=timeline.now;const future=timeline.timeline.find(item=>item.time>now);
  if(!future)return Math.max(1,Math.ceil((timeline.actualEnd-now)/60000)+1);
  return Math.max(1,Math.ceil((future.time-now)/60000)+1);
}
