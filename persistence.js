/** IndexedDB mirror used as an offline safety net. */
const DB_NAME='galizische-bahn';
const DB_VERSION=1;
const STORE='snapshots';
const SNAPSHOT_ID='main';
let pendingHandle=null;
let latestState=null;

function openDatabase(){
  if(typeof indexedDB==='undefined')return Promise.resolve(null);
  return new Promise(resolve=>{
    try{
      const request=indexedDB.open(DB_NAME,DB_VERSION);
      request.onupgradeneeded=()=>{
        const db=request.result;
        if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'});
      };
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>resolve(null);
      request.onblocked=()=>resolve(null);
    }catch{resolve(null)}
  });
}

async function writeSnapshot(state){
  const db=await openDatabase();if(!db)return false;
  return new Promise(resolve=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put({id:SNAPSHOT_ID,updatedAt:Date.now(),state});
    tx.oncomplete=()=>{db.close();resolve(true)};
    tx.onerror=()=>{db.close();resolve(false)};
  });
}

export async function loadPersistentSnapshot(){
  const db=await openDatabase();if(!db)return null;
  return new Promise(resolve=>{
    const tx=db.transaction(STORE,'readonly');
    const request=tx.objectStore(STORE).get(SNAPSHOT_ID);
    request.onsuccess=()=>resolve(request.result||null);
    request.onerror=()=>resolve(null);
    tx.oncomplete=()=>db.close();
  });
}

export function schedulePersistentSnapshot(state){
  latestState=state;
  if(pendingHandle)return;
  const run=()=>{
    pendingHandle=null;
    const snapshot=latestState;
    latestState=null;
    if(snapshot)writeSnapshot(snapshot).catch(()=>{});
  };
  pendingHandle=typeof requestIdleCallback==='function'?requestIdleCallback(run,{timeout:1500}):setTimeout(run,50);
}

export async function clearPersistentSnapshot(){
  const db=await openDatabase();if(!db)return false;
  return new Promise(resolve=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).delete(SNAPSHOT_ID);
    tx.oncomplete=()=>{db.close();resolve(true)};
    tx.onerror=()=>{db.close();resolve(false)};
  });
}
