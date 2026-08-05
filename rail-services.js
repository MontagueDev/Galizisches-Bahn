/**
 * Galizische Bahn operating plan 0.9.1.
 * German is the source language for all public service names.
 */
export const RAIL_SERVICE_VERSION = '2026.08.05-operations1';

const service = (id, product, name, stations, options = {}) => ({
  id, product, name, stations,
  frequency: options.frequency ?? 120,
  firstDeparture: options.firstDeparture ?? '05:00',
  lastDeparture: options.lastDeparture ?? '22:00',
  trainBase: options.trainBase ?? 100,
  priceFactor: options.priceFactor ?? 1,
  rollingStock: options.rollingStock ?? product,
  pattern: options.pattern ?? 'all-stops',
  note: options.note ?? '',
  international: Boolean(options.international),
  night: Boolean(options.night)
});

export const RAIL_SERVICES = [
  // ICE — national high-speed corridors
  service('ICE1','ICE','Magistrale Galiziens',['PVR','PAZ','GUA','LOW','KAR','SJR'],{frequency:60,firstDeparture:'04:40',lastDeparture:'21:40',trainBase:800,priceFactor:1.00,rollingStock:'GB Velaro G'}),
  service('ICE1X','ICE','Magistrale Sprinter',['PVR','GUA','LOW','KAR'],{frequency:120,firstDeparture:'06:10',lastDeparture:'20:10',trainBase:850,priceFactor:1.12,rollingStock:'GB Velaro G',pattern:'sprinter'}),
  service('ICE2','ICE','Nord–Ost-Express',['ZAC','BAD','LOW','KAR'],{frequency:120,firstDeparture:'05:25',lastDeparture:'21:25',trainBase:900,rollingStock:'GB ICE 4G'}),
  service('ICE3','ICE','Golf–Pazifik',['GOL','SLU','KAR','LOW','GUA','PVR'],{frequency:120,firstDeparture:'05:05',lastDeparture:'19:05',trainBase:700,rollingStock:'GB ICE 4G'}),
  service('ICE4','ICE','Südwest-Express',['PVR','GUA','WAL','URU','LZC'],{frequency:120,firstDeparture:'05:50',lastDeparture:'19:50',trainBase:400,rollingStock:'GB ICE L'}),
  service('ICE5','ICE','Pazifik-Nord',['PVR','PAZ','MAZ','CUL'],{frequency:120,firstDeparture:'05:30',lastDeparture:'21:30',trainBase:500,rollingStock:'GB ICE L'}),

  // IC — long-distance network with more intermediate stops
  service('IC10','IC','Mitte-Korridor',['GDO','GUA','TEP','LAG','LOW','IRA','SAL','CEL','KAR'],{frequency:60,firstDeparture:'04:55',lastDeparture:'22:55',trainBase:610,priceFactor:.78,rollingStock:'GB Intercity 2'}),
  service('IC11','IC','Silber–Karlsburg',['ZAC','BAD','LAG','LOW','CEL','KAR'],{frequency:120,firstDeparture:'05:40',lastDeparture:'21:40',trainBase:630,priceFactor:.76,rollingStock:'GB Intercity 2'}),
  service('IC12','IC','Pazifik–Michoacán',['PAZ','GUA','ZAM','WAL'],{frequency:120,firstDeparture:'05:15',lastDeparture:'21:15',trainBase:650,priceFactor:.75,rollingStock:'GB Intercity 2'}),
  service('IC13','IC','Golf–Karlsburg',['GOH','GOL','SLU','KAR'],{frequency:120,firstDeparture:'05:35',lastDeparture:'21:35',trainBase:670,priceFactor:.77,rollingStock:'GB Intercity 2'}),
  service('IC14','IC','Pazifikküste',['CUL','MAZ','PAZ','PVR'],{frequency:240,firstDeparture:'06:20',lastDeparture:'18:20',trainBase:690,priceFactor:.72,rollingStock:'GB Intercity 2'}),
  service('IC15','IC','Süd–Nord',['MAN','KUE','GUA','BAD'],{frequency:120,firstDeparture:'05:45',lastDeparture:'19:45',trainBase:710,priceFactor:.74,rollingStock:'GB Intercity 2'}),

  // RE — regional express corridors
  service('RE1','RE','Guadalajara–Löwenstadt',['GUA','TEP','LAG','LOW'],{frequency:60,firstDeparture:'04:30',lastDeparture:'23:30',trainBase:7100,priceFactor:.52,rollingStock:'GB Desiro HC'}),
  service('RE2','RE','Guadalajara–Pazifikhafen',['GUA','PAZ'],{frequency:60,firstDeparture:'05:00',lastDeparture:'23:00',trainBase:7120,priceFactor:.50,rollingStock:'GB Desiro HC'}),
  service('RE3','RE','Guadalajara–Küstenstadt',['GUA','KUE'],{frequency:60,firstDeparture:'04:45',lastDeparture:'22:45',trainBase:7140,priceFactor:.50,rollingStock:'GB Desiro HC'}),
  service('RE4','RE','Guadalajara–Waldheim',['GUA','ZAM','WAL'],{frequency:60,firstDeparture:'05:10',lastDeparture:'23:10',trainBase:7160,priceFactor:.49,rollingStock:'GB Desiro HC'}),
  service('RE5','RE','Guadalajara–Puerto Vallarta',['GUA','PVR'],{frequency:120,firstDeparture:'05:20',lastDeparture:'21:20',trainBase:7180,priceFactor:.48,rollingStock:'GB Desiro HC'}),
  service('RE20','RE','Bajío-Express',['LOW','IRA','SAL','CEL','KAR'],{frequency:60,firstDeparture:'04:35',lastDeparture:'23:35',trainBase:7200,priceFactor:.50,rollingStock:'GB Desiro HC'}),
  service('RE21','RE','Löwenstadt–Silberstadt',['LOW','GTO','BAD','ZAC'],{frequency:60,firstDeparture:'05:05',lastDeparture:'22:05',trainBase:7220,priceFactor:.49,rollingStock:'GB Desiro HC'}),
  service('RE22','RE','Badenquellen–Löwenstadt',['BAD','LAG','LOW'],{frequency:60,firstDeparture:'05:15',lastDeparture:'23:15',trainBase:7240,priceFactor:.48,rollingStock:'GB Desiro HC'}),
  service('RE23','RE','Karlsburg–Grenze',['KAR','SJH','SJR'],{frequency:60,firstDeparture:'04:50',lastDeparture:'23:50',trainBase:7260,priceFactor:.48,rollingStock:'GB Desiro HC'}),
  service('RE30','RE','Michoacán-Express',['GUA','ZAM','WAL'],{frequency:60,firstDeparture:'04:40',lastDeparture:'22:40',trainBase:7300,priceFactor:.49,rollingStock:'GB Coradia Stream'}),
  service('RE31','RE','Waldheim–Uruapan',['WAL','URU'],{frequency:60,firstDeparture:'05:00',lastDeparture:'23:00',trainBase:7320,priceFactor:.46,rollingStock:'GB Coradia Stream'}),
  service('RE32','RE','Uruapan–Lázaro Cárdenas',['URU','LZC'],{frequency:120,firstDeparture:'05:30',lastDeparture:'21:30',trainBase:7340,priceFactor:.45,rollingStock:'GB Coradia Stream'}),
  service('RE40','RE','Küsten-Express',['PVR','PAZ','MAZ'],{frequency:60,firstDeparture:'04:55',lastDeparture:'22:55',trainBase:7400,priceFactor:.48,rollingStock:'GB Desiro HC'}),
  service('RE42','RE','Mazatlán–Culiacán',['MAZ','CUL'],{frequency:60,firstDeparture:'05:05',lastDeparture:'23:05',trainBase:7420,priceFactor:.45,rollingStock:'GB Desiro HC'}),
  service('RE50','RE','Golf–Sankt Ludwig',['GOL','SLU'],{frequency:60,firstDeparture:'05:25',lastDeparture:'22:25',trainBase:7500,priceFactor:.48,rollingStock:'GB Coradia Stream'}),
  service('RE51','RE','Sankt Ludwig–Karlsburg',['SLU','KAR'],{frequency:60,firstDeparture:'04:45',lastDeparture:'22:45',trainBase:7520,priceFactor:.49,rollingStock:'GB Coradia Stream'}),
  service('RE52','RE','Sankt Ludwig–Silberstadt',['SLU','ZAC'],{frequency:60,firstDeparture:'05:35',lastDeparture:'22:35',trainBase:7540,priceFactor:.47,rollingStock:'GB Coradia Stream'}),
  service('RE53','RE','Sankt Ludwig–Badenquellen',['SLU','BAD'],{frequency:60,firstDeparture:'05:50',lastDeparture:'22:50',trainBase:7560,priceFactor:.46,rollingStock:'GB Coradia Stream'}),

  // RB — local regional feeders
  service('RB10','RB','Guadalajara–Tepatitlan',['GUA','TEP'],{frequency:30,firstDeparture:'04:20',lastDeparture:'00:20',trainBase:1010,priceFactor:.34,rollingStock:'GB Mireo'}),
  service('RB20','RB','Löwenstadt–Guanajuato',['LOW','GTO'],{frequency:30,firstDeparture:'04:30',lastDeparture:'00:00',trainBase:1020,priceFactor:.33,rollingStock:'GB Mireo'}),
  service('RB21','RB','Löwenstadt–Salamanca',['LOW','IRA','SAL'],{frequency:30,firstDeparture:'04:15',lastDeparture:'00:15',trainBase:1030,priceFactor:.33,rollingStock:'GB Mireo'}),
  service('RB22','RB','Irapuato–Karlsburg',['IRA','SAL','CEL','KAR'],{frequency:30,firstDeparture:'04:35',lastDeparture:'23:35',trainBase:1040,priceFactor:.33,rollingStock:'GB Mireo'}),
  service('RB23','RB','Karlsburg–San Juan del Río',['KAR','SJH','SJR'],{frequency:30,firstDeparture:'04:10',lastDeparture:'00:10',trainBase:1050,priceFactor:.34,rollingStock:'GB Mireo'}),
  service('RB30','RB','Waldheim–Zamora',['WAL','ZAM'],{frequency:60,firstDeparture:'04:40',lastDeparture:'23:40',trainBase:1060,priceFactor:.31,rollingStock:'GB Mireo'}),
  service('RB31','RB','Waldheim–Uruapan',['WAL','URU'],{frequency:60,firstDeparture:'04:50',lastDeparture:'23:50',trainBase:1070,priceFactor:.31,rollingStock:'GB Mireo'}),
  service('RB33','RB','Uruapan–Lázaro Cárdenas',['URU','LZC'],{frequency:60,firstDeparture:'05:10',lastDeparture:'22:10',trainBase:1080,priceFactor:.30,rollingStock:'GB Mireo'}),
  service('RB40','RB','Puerto Vallarta–Pazifikhafen',['PVR','PAZ'],{frequency:30,firstDeparture:'04:25',lastDeparture:'00:25',trainBase:1090,priceFactor:.32,rollingStock:'GB Mireo'}),
  service('RB42','RB','Mazatlán–Culiacán',['MAZ','CUL'],{frequency:60,firstDeparture:'04:45',lastDeparture:'23:45',trainBase:1100,priceFactor:.31,rollingStock:'GB Mireo'}),
  service('RB44','RB','Küstenstadt–Manzanillo',['KUE','MAN'],{frequency:60,firstDeparture:'05:00',lastDeparture:'23:00',trainBase:1110,priceFactor:.31,rollingStock:'GB Mireo'}),
  service('RB50','RB','Sankt Ludwig–Golfhafen',['SLU','GOL'],{frequency:60,firstDeparture:'04:30',lastDeparture:'23:30',trainBase:1120,priceFactor:.32,rollingStock:'GB Mireo'}),

  // Border service, operated separately from Galizian long-distance trains
  service('RBM90','RB','RB México',['SJR','MEX'],{frequency:60,firstDeparture:'05:15',lastDeparture:'22:15',trainBase:90,priceFactor:.40,rollingStock:'RB México Serie 90',international:true,note:'Grenzkontrolle in San Juan del Río'}),

  // Night services
  service('NJ90','NJ','Pazifik-Nacht',['CUL','MAZ','PAZ','GUA','LOW','KAR'],{frequency:1440,firstDeparture:'20:35',lastDeparture:'20:35',trainBase:490,priceFactor:1.08,rollingStock:'GB NightJet',night:true}),
  service('NJ91','NJ','Golf-Nacht',['GOL','SLU','BAD','GUA','KUE','MAN'],{frequency:1440,firstDeparture:'20:55',lastDeparture:'20:55',trainBase:491,priceFactor:1.06,rollingStock:'GB NightJet',night:true}),
  service('NJ92','NJ','Michoacán-Nacht',['LZC','URU','WAL','GUA','ZAC'],{frequency:1440,firstDeparture:'21:20',lastDeparture:'21:20',trainBase:492,priceFactor:1.04,rollingStock:'GB NightJet',night:true})
];

export const SERVICE_BY_ID = new Map(RAIL_SERVICES.map(item => [item.id, item]));

export const minutesOf = time => {
  const [h,m] = String(time).split(':').map(Number);
  return h * 60 + m;
};
export const clockOf = value => {
  const n = ((Math.round(value) % 1440) + 1440) % 1440;
  return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
};

export function servicesAtStation(stationId, product = null){
  return RAIL_SERVICES.filter(item => (!product || item.product === product) && item.stations.includes(stationId));
}

export function directServiceOptions(fromId, toId, products = null){
  return RAIL_SERVICES.flatMap(item => {
    if(products && !products.includes(item.product)) return [];
    const a = item.stations.indexOf(fromId), b = item.stations.indexOf(toId);
    if(a < 0 || b < 0 || a === b) return [];
    const direction = b > a ? 1 : -1;
    const stations = direction === 1 ? item.stations.slice(a,b+1) : item.stations.slice(b,a+1).reverse();
    return [{service:item,direction,stations,fromIndex:a,toIndex:b}];
  });
}

export function oneTransferServiceOptions(fromId,toId,products = null){
  const first = servicesAtStation(fromId).filter(s => !products || products.includes(s.product));
  const second = servicesAtStation(toId).filter(s => !products || products.includes(s.product));
  const options=[];
  for(const a of first){
    for(const b of second){
      if(a.id===b.id) continue;
      const shared=a.stations.filter(id=>b.stations.includes(id) && id!==fromId && id!==toId);
      for(const transfer of shared){
        const leg1=directServiceOptions(fromId,transfer,[a.product]).find(x=>x.service.id===a.id);
        const leg2=directServiceOptions(transfer,toId,[b.product]).find(x=>x.service.id===b.id);
        if(leg1&&leg2) options.push({legs:[leg1,leg2],transfer});
      }
    }
  }
  return options;
}

export function nextRun(service, requestedTime, direction = 1){
  const requested = minutesOf(requestedTime);
  const first = minutesOf(service.firstDeparture) + (direction < 0 ? Math.floor(service.frequency / 2) : 0);
  let runIndex = Math.max(0, Math.ceil((requested-first)/service.frequency));
  let departure = first + runIndex*service.frequency;
  if(service.frequency===1440 && departure<requested){runIndex++;departure+=1440}
  let last = minutesOf(service.lastDeparture) + (direction < 0 ? Math.floor(service.frequency / 2) : 0);
  if(last < first) last += 1440;
  if(service.frequency<1440 && departure>last){runIndex=0;departure=first+1440}
  const number = service.product === 'NJ' ? service.trainBase : service.trainBase + runIndex*2 + (direction<0?1:0);
  return {departure:clockOf(departure),absoluteDeparture:departure,runIndex,train:`${service.product} ${number}`};
}

export function stationBoardServices(stationId, requestedTime='08:00', direction='departures', limit=8){
  const rows=[];
  for(const service of servicesAtStation(stationId)){
    const index=service.stations.indexOf(stationId);
    for(const dir of [-1,1]){
      const nextIndex=index+dir;
      if(nextIndex<0||nextIndex>=service.stations.length) continue;
      const run=nextRun(service,requestedTime,dir);
      const destination=dir>0?service.stations.at(-1):service.stations[0];
      rows.push({service,direction:dir,time:run.departure,train:run.train,destination,via:service.stations[nextIndex],platform:1+Math.abs(service.trainBase+index*3+(dir<0?2:0))%16,status:(service.trainBase+index)%7===0?'delay':'onTime',delay:(service.trainBase+index)%7===0?6:0,boardDirection:direction});
    }
  }
  return rows.sort((a,b)=>minutesOf(a.time)-minutesOf(b.time)).slice(0,limit);
}
