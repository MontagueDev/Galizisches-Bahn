import fs from 'node:fs';
import path from 'node:path';
import {APP_VERSION,APP_BUILD,STATIONS,URBAN_NETWORKS,getStation} from './data.js';
import {RAIL_SERVICES} from './rail-services.js';
import {createJourneys} from './routing.js';
import {createLocalCredential,verifyLocalCredential,normalizeEmail,validatePassword} from './auth.js';
import {buildJourneyTimeline,journeyStatusKey,nextDeveloperJumpMinutes} from './live.js';

const root=process.cwd();
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,pass:Boolean(condition),detail:String(detail??'')});

check('Version is 0.9.2',APP_VERSION==='0.9.2',APP_VERSION);
check('Build is GB Konto Live',APP_BUILD==='2026.08.08-gb-konto-live1',APP_BUILD);
check('Station database retained',STATIONS.length>=150,STATIONS.length);
check('Ten metropolitan networks retained',URBAN_NETWORKS.length===10,URBAN_NETWORKS.length);
check('Official service catalogue retained',RAIL_SERVICES.length>=46,RAIL_SERVICES.length);
check('ICE 1 still begins at Puerto Vallarta',RAIL_SERVICES.find(x=>x.id==='ICE1')?.stations?.[0]==='PVR',RAIL_SERVICES.find(x=>x.id==='ICE1')?.stations?.join(' → '));
check('ICE 1 still reaches border',RAIL_SERVICES.find(x=>x.id==='ICE1')?.stations?.includes('SJR'));

const cred=await createLocalCredential('Test.User@GB.example','Bahn2026!');
check('Email normalized',cred.email==='test.user@gb.example',cred.email);
check('Credential verifies correct password',await verifyLocalCredential(cred,'test.user@gb.example','Bahn2026!'));
check('Credential rejects wrong password',!(await verifyLocalCredential(cred,'test.user@gb.example','Wrong2026')));
check('Credential does not store plaintext password',!JSON.stringify(cred).includes('Bahn2026!'));
check('Password policy rejects weak password',!validatePassword('123').ok);

const baseTicket={id:'TEST-LIVE',kind:'journey',status:'active',date:'2026-08-08',departure:'10:00',arrival:'12:00',delay:0,type:'ICE',train:'ICE 804',fromId:'GUA',toId:'KAR',from:'Guadalajara Hbf',to:'Karlsburg Hbf',path:['GUA','LOW','KAR'],segments:[{kind:'train',type:'ICE',train:'ICE 804',fromId:'GUA',toId:'KAR',departure:'10:00',arrival:'12:00',path:['GUA','LOW','KAR'],platformDeparture:'7',platformArrival:'3'}]};
const at=time=>buildJourneyTimeline(baseTicket,{now:new Date(`2026-08-08T${time}:00`)});
check('09:00 is scheduled',at('09:00').status==='scheduled',at('09:00').status);
check('09:50 is boarding',at('09:50').status==='boarding',at('09:50').status);
check('10:30 is underway',at('10:30').status==='underway',at('10:30').status);
check('11:00 reaches intermediate station',at('11:00').status==='atStation',at('11:00').status);
check('12:01 is completed',at('12:01').status==='completed',at('12:01').status);
check('Underway position has progress',at('10:30').progress>0&&at('10:30').progress<1,at('10:30').progress);
check('Completed journey progress is 100%',at('12:01').progress===1,at('12:01').progress);
check('Developer jump advances to future timeline item',nextDeveloperJumpMinutes(at('10:30'))>0,nextDeveloperJumpMinutes(at('10:30')));
check('Delay override propagates',buildJourneyTimeline(baseTicket,{now:new Date('2026-08-08T10:30:00'),override:{delayMinutes:10}}).delay===10);
check('Platform override propagates',buildJourneyTimeline(baseTicket,{now:new Date('2026-08-08T10:30:00'),override:{platform:'9'}}).platform==='9');

const mexicoTicket={...baseTicket,id:'MEX-LIVE',fromId:'GUA',toId:'MEX',to:'Ciudad de México Buenavista',arrival:'14:00',path:['GUA','SJR','MEX'],segments:[{kind:'train',type:'ICE',train:'ICE 812',fromId:'GUA',toId:'SJR',departure:'10:00',arrival:'11:30',path:['GUA','KAR','SJR']},{kind:'border',stationId:'SJR',start:'11:30',end:'12:15',minutes:45},{kind:'train',type:'RB',train:'RB México 90',fromId:'SJR',toId:'MEX',departure:'12:27',arrival:'14:00',path:['SJR','MEX']}],international:true};
const border=buildJourneyTimeline(mexicoTicket,{now:new Date('2026-08-08T11:50:00')});
check('Mexico timeline enters border-control state',border.status==='borderControl',border.status);
check('Mexico timeline includes border item',border.timeline.some(x=>x.kind==='border'));

const domestic=createJourneys({fromId:'GDL10',toId:'LOO',date:'2026-08-09',time:'08:00',passengers:1,travelClass:'2'});
check('Urban origin to long-distance returns journeys',domestic.length>=4,domestic.length);
check('Urban access is included',domestic.some(j=>j.segments?.some(s=>s.kind==='urban')));
check('Official ICE option remains',domestic.some(j=>j.segments?.some(s=>s.kind==='train'&&s.type==='ICE')));
const mxOut=createJourneys({fromId:'GUA',toId:'MEX',date:'2026-08-09',time:'08:00',passengers:1,travelClass:'2'});
check('Mexico outbound returns journeys',mxOut.length>=3,mxOut.length);
check('Mexico outbound ends with RB México',mxOut.every(j=>j.segments?.filter(s=>s.kind==='train').at(-1)?.toId==='MEX'));
const mxIn=createJourneys({fromId:'MEX',toId:'GUA',date:'2026-08-09',time:'08:00',passengers:1,travelClass:'2'});
check('Mexico inbound starts with RB México',mxIn.every(j=>j.segments?.filter(s=>s.kind==='train')[0]?.fromId==='MEX'));

const files=['index.html','404.html','app.js','app.css','data.js','rail-services.js','routing.js','store.js','payment.js','i18n.js','auth.js','live.js','sw.js','manifest.webmanifest','version.json'];
for(const file of files)check(`Required file exists: ${file}`,fs.existsSync(path.join(root,file)),file);
const index=fs.readFileSync(path.join(root,'index.html'),'utf8'),fallback=fs.readFileSync(path.join(root,'404.html'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8'),app=fs.readFileSync(path.join(root,'app.js'),'utf8');
check('index and 404 synchronized',index===fallback);
check('Service worker caches auth module',sw.includes('auth.js?v=0.9.2-gb-konto-live1'));
check('Service worker caches live module',sw.includes('live.js?v=0.9.2-gb-konto-live1'));
check('App imports GB Konto module',app.includes("from './auth.js?v=0.9.2-gb-konto-live1'"));
check('App imports live chronology module',app.includes("from './live.js?v=0.9.2-gb-konto-live1'"));
check('App has developer clock controls',app.includes('nextDeveloperJumpMinutes')&&app.includes('developerOptions'));
check('App has journey groups',app.includes("renderMyJourneys")&&app.includes("journeyGroups()"));
check('App refreshes clock-sensitive surfaces while open',app.includes('refreshClockSurfaces')&&app.includes('setInterval(refreshClockSurfaces,15000)'));
const css=fs.readFileSync(path.join(root,'app.css'),'utf8');
check('Authentication flow hides bottom navigation',css.includes('.auth-mode .bottom-nav{display:none!important}'));
const v092Block=app.split('const V092_COPY=',2)[1]?.split('\n};\n\nconst main',1)[0];
let v092Copy={};try{v092Copy=Function(`"use strict";return (${v092Block}})`)()}catch{}
const deKeys=Object.keys(v092Copy.de||{}).sort(),esKeys=Object.keys(v092Copy.es||{}).sort(),enKeys=Object.keys(v092Copy.en||{}).sort();
check('v0.9.2 German/Spanish/English translation keys match',JSON.stringify(deKeys)===JSON.stringify(esKeys)&&JSON.stringify(deKeys)===JSON.stringify(enKeys),`${deKeys.length}/${esKeys.length}/${enKeys.length}`);

const passed=checks.filter(x=>x.pass).length;
const output={version:APP_VERSION,build:APP_BUILD,passed,total:checks.length,checks};
fs.writeFileSync(path.join(root,'QA-RESULTS.json'),JSON.stringify(output,null,2));
console.log(`${passed}/${checks.length} checks passed`);
for(const c of checks.filter(x=>!x.pass))console.error('FAIL',c.name,c.detail);
if(passed!==checks.length)process.exit(1);
