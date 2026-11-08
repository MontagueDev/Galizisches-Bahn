import fs from 'node:fs';
import path from 'node:path';
import {APP_VERSION,APP_BUILD,STATIONS,URBAN_NETWORKS,getStation} from './data.js';
import {RAIL_SERVICES} from './rail-services.js';
import {createJourneys} from './routing.js';
import {createLocalCredential,verifyLocalCredential,TEST_ACCOUNT,verifyTestAccount} from './auth.js';
import {buildJourneyTimeline,nextDeveloperJumpMinutes} from './live.js';
import {createStationSearchIndex,searchStationIndex,normalizeText} from './core.js';
import {selectUnreadCount,selectJourneyGroups,selectActiveTicket,selectFavoriteStation} from './selectors.js';

const root=process.cwd();
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,pass:Boolean(condition),detail:String(detail??'')});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

check('Version is 0.9.3',APP_VERSION==='0.9.3',APP_VERSION);
check('Build is major refresh',APP_BUILD==='2026.11.07-major-refresh1',APP_BUILD);
check('Station database retained',STATIONS.length>=150,STATIONS.length);
check('Ten metropolitan networks retained',URBAN_NETWORKS.length===10,URBAN_NETWORKS.length);
check('Official service catalogue retained',RAIL_SERVICES.length>=46,RAIL_SERVICES.length);
const ice1=RAIL_SERVICES.find(x=>x.id==='ICE1');
check('ICE 1 begins at Puerto Vallarta',ice1?.stations?.[0]==='PVR',ice1?.stations?.join(' → '));
check('ICE 1 reaches San Juan del Río',ice1?.stations?.includes('SJR'));

const index=createStationSearchIndex(STATIONS);
check('Station index mirrors database',index.length===STATIONS.length,index.length);
check('Umlaut search finds Löwenstadt',searchStationIndex(index,'loewen',{limit:3})[0]?.id==='LOW',searchStationIndex(index,'loewen',{limit:3})[0]?.name);
check('Spanish university alias works',searchStationIndex(index,'universidad',{limit:10}).some(x=>x.id==='GDL10'));
check('English airport alias works',searchStationIndex(index,'airport',{limit:5}).some(x=>x.stationType==='Flughafen'));
check('Spanish border alias works',searchStationIndex(index,'frontera',{limit:5})[0]?.id==='SJR');
check('Hbf alias works',searchStationIndex(index,'estacion principal',{limit:10}).some(x=>x.longDistance));
check('Favourites rank empty-query suggestions',searchStationIndex(index,'',{favorites:['KAR'],recent:[],limit:3})[0]?.id==='KAR');
check('Text normalization transliterates German',normalizeText('Löwenstraße')==='loewenstrasse',normalizeText('Löwenstraße'));

const cred=await createLocalCredential('Test.User@GB.example','Bahn2026!');
check('Credential verifies correct password',await verifyLocalCredential(cred,'test.user@gb.example','Bahn2026!'));
check('Credential rejects wrong password',!(await verifyLocalCredential(cred,'test.user@gb.example','Wrong2026')));
check('Credential omits plaintext password',!JSON.stringify(cred).includes('Bahn2026!'));
check('Built-in test account remains stable',TEST_ACCOUNT.email==='test@galizischebahn.de'&&TEST_ACCOUNT.password==='GBTest092!');
check('Built-in test account verifies',verifyTestAccount(TEST_ACCOUNT.email,TEST_ACCOUNT.password));

const baseTicket={id:'TEST-LIVE',kind:'journey',status:'active',date:'2026-11-08',departure:'10:00',arrival:'12:00',delay:0,type:'ICE',train:'ICE 804',fromId:'GUA',toId:'KAR',from:'Guadalajara Hbf',to:'Karlsburg Hbf',path:['GUA','LOW','KAR'],segments:[{kind:'train',type:'ICE',train:'ICE 804',fromId:'GUA',toId:'KAR',departure:'10:00',arrival:'12:00',path:['GUA','LOW','KAR'],platformDeparture:'7',platformArrival:'3'}]};
const at=time=>buildJourneyTimeline(baseTicket,{now:new Date(`2026-11-08T${time}:00`)});
check('Journey is scheduled before boarding',at('09:00').status==='scheduled',at('09:00').status);
check('Journey enters boarding',at('09:50').status==='boarding',at('09:50').status);
check('Journey enters underway state',at('10:30').status==='underway',at('10:30').status);
check('Journey reaches intermediate station',at('11:00').status==='atStation',at('11:00').status);
check('Journey completes after arrival',at('12:01').status==='completed',at('12:01').status);
check('Underway progress is bounded',at('10:30').progress>0&&at('10:30').progress<1,at('10:30').progress);
check('Developer jump advances time',nextDeveloperJumpMinutes(at('10:30'))>0,nextDeveloperJumpMinutes(at('10:30')));
check('Delay override propagates',buildJourneyTimeline(baseTicket,{now:new Date('2026-11-08T10:30:00'),override:{delayMinutes:15}}).delay===15);
check('Platform override propagates',buildJourneyTimeline(baseTicket,{now:new Date('2026-11-08T10:30:00'),override:{platform:'9'}}).platform==='9');

const mexicoTicket={...baseTicket,id:'MEX-LIVE',toId:'MEX',to:'Ciudad de México Buenavista',arrival:'14:00',path:['GUA','SJR','MEX'],segments:[{kind:'train',type:'ICE',train:'ICE 812',fromId:'GUA',toId:'SJR',departure:'10:00',arrival:'11:30',path:['GUA','KAR','SJR']},{kind:'border',stationId:'SJR',start:'11:30',end:'12:15',minutes:45},{kind:'train',type:'RB',train:'RB México 90',fromId:'SJR',toId:'MEX',departure:'12:27',arrival:'14:00',path:['SJR','MEX']}],international:true};
const border=buildJourneyTimeline(mexicoTicket,{now:new Date('2026-11-08T11:50:00')});
check('Mexico journey enters border control',border.status==='borderControl',border.status);
check('Mexico timeline contains border item',border.timeline.some(x=>x.kind==='border'));

const domestic=createJourneys({fromId:'GDL10',toId:'LOO',date:'2026-11-09',time:'08:00',passengers:1,travelClass:'2'});
check('Urban-origin search returns alternatives',domestic.length>=4,domestic.length);
check('Urban access is included',domestic.some(j=>j.segments?.some(s=>s.kind==='urban')));
check('Official ICE alternative is included',domestic.some(j=>j.segments?.some(s=>s.kind==='train'&&s.type==='ICE')));
check('Regional alternative is included',domestic.some(j=>j.segments?.some(s=>s.kind==='train'&&['RE','RB'].includes(s.type))));
const mxOut=createJourneys({fromId:'GUA',toId:'MEX',date:'2026-11-09',time:'08:00',passengers:1,travelClass:'2'});
check('Mexico outbound returns alternatives',mxOut.length>=3,mxOut.length);
check('Every outbound journey ends with RB México',mxOut.every(j=>j.segments?.filter(s=>s.kind==='train').at(-1)?.toId==='MEX'));
const mxIn=createJourneys({fromId:'MEX',toId:'GUA',date:'2026-11-09',time:'08:00',passengers:1,travelClass:'2'});
check('Every inbound journey starts with RB México',mxIn.every(j=>j.segments?.filter(s=>s.kind==='train')[0]?.fromId==='MEX'));

const selectorState={notificationInbox:[{read:false},{read:true},{read:false}],favorites:['GUA'],activeTicketId:'A',tickets:[{...baseTicket,id:'A'},{...baseTicket,id:'B',fromId:'LOW',toId:'KAR'}]};
const liveFor=ticket=>ticket.id==='A'?{status:'underway',actualStart:10,actualEnd:20}:{status:'scheduled',actualStart:30,actualEnd:40};
check('Unread selector works',selectUnreadCount(selectorState)===2,selectUnreadCount(selectorState));
check('Active-ticket selector uses global state',selectActiveTicket(selectorState,liveFor)?.id==='A');
const groups=selectJourneyGroups(selectorState,liveFor);
check('Journey grouping works',groups.current.length===1&&groups.upcoming.length===1,`${groups.current.length}/${groups.upcoming.length}`);
check('Favourite-station selector works',Boolean(selectFavoriteStation(selectorState,getStation)));

const required=['index.html','404.html','app.js','app.css','data.js','rail-services.js','routing.js','store.js','payment.js','i18n.js','auth.js','live.js','core.js','selectors.js','persistence.js','sw.js','manifest.webmanifest','version.json'];
for(const file of required)check(`Required file exists: ${file}`,fs.existsSync(path.join(root,file)),file);
const indexHtml=read('index.html'),fallback=read('404.html'),sw=read('sw.js'),app=read('app.js'),css=read('app.css');
check('index and 404 are synchronized',indexHtml===fallback);
check('Index is not empty',indexHtml.length>1000,indexHtml.length);
check('Service worker uses new release cache',sw.includes('0.9.3-major-refresh1'));
for(const module of ['core.js','selectors.js','persistence.js','auth.js','live.js','rail-services.js'])check(`Service worker includes ${module}`,sw.includes(module),module);
check('App uses indexed search',app.includes('createStationSearchIndex')&&app.includes('searchStationIndex'));
check('App uses pure selectors',app.includes('selectActiveTicket')&&app.includes('selectJourneyGroups'));
check('App has render error boundary',app.includes('fatalTitle')&&app.includes('renderRouteUnsafe'));
check('App preserves route scroll positions',app.includes('scrollPositions')&&app.includes('restoreScroll'));
check('Login is prefilled with test credentials',app.includes('value="${esc(TEST_ACCOUNT.email)}"')&&app.includes('value="${esc(TEST_ACCOUNT.password)}"'));
check('Developer controls include border states',app.includes('data-border-status')&&app.includes('borderStatus'));
check('Clock refresh pauses when hidden',app.includes('document.hidden')&&app.includes('visibilitychange'));
check('Bottom navigation has five tabs',((indexHtml.match(/class="nav-button/g)||[]).length===5),(indexHtml.match(/class="nav-button/g)||[]).length);
check('Skip link is available',indexHtml.includes('skip-link'));
check('Reduced motion is supported',css.includes('prefers-reduced-motion'));
check('Major refresh design tokens exist',css.includes('--gb-space-4')&&css.includes('--gb-shadow-elevated'));
check('No old test-account fill button remains',!app.includes('fillTestAccount'));

const manifest=JSON.parse(read('manifest.webmanifest'));
const version=JSON.parse(read('version.json'));
check('Manifest carries v0.9.3 identity',manifest.id.includes('v0.9.3')&&manifest.start_url.includes('0.9.3'),`${manifest.id} ${manifest.start_url}`);
check('Version metadata schema is 13',version.version==='0.9.3'&&version.schema===13,JSON.stringify(version));

function extractCopy(name){
  const marker=`const ${name}=`;const start=app.indexOf(marker);if(start<0)return{};
  const objectStart=start+marker.length;let depth=0,quote=null,escape=false,end=-1;
  for(let i=objectStart;i<app.length;i++){
    const ch=app[i];
    if(quote){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote=null;continue}
    if(ch==='\''||ch==='"'||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
  }
  if(end<0)return{};
  try{return Function(`"use strict";return (${app.slice(objectStart,end)})`)()}catch{return{}}
}
const v093=extractCopy('V093_COPY');
const deKeys=Object.keys(v093.de||{}).sort(),esKeys=Object.keys(v093.es||{}).sort(),enKeys=Object.keys(v093.en||{}).sort();
check('v0.9.3 translation keys match',deKeys.length>0&&JSON.stringify(deKeys)===JSON.stringify(esKeys)&&JSON.stringify(deKeys)===JSON.stringify(enKeys),`${deKeys.length}/${esKeys.length}/${enKeys.length}`);

const passed=checks.filter(x=>x.pass).length;
const output={version:APP_VERSION,build:APP_BUILD,passed,total:checks.length,checks};
fs.writeFileSync(path.join(root,'QA-RESULTS.json'),JSON.stringify(output,null,2));
console.log(`${passed}/${checks.length} checks passed`);
for(const failure of checks.filter(x=>!x.pass))console.error('FAIL',failure.name,failure.detail);
if(passed!==checks.length)process.exit(1);
