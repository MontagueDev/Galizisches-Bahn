const encoder = new TextEncoder();

function bytesToBase64(bytes){
  let binary='';
  for(const byte of bytes)binary+=String.fromCharCode(byte);
  return btoa(binary);
}
function base64ToBytes(value){
  const binary=atob(value);const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return bytes;
}
function randomBytes(length=16){const out=new Uint8Array(length);crypto.getRandomValues(out);return out}
export function normalizeEmail(value){return String(value||'').trim().toLowerCase()}
export function validateEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value))}
export function validatePassword(value){
  const password=String(value||'');
  return {ok:password.length>=8&&/[A-Za-zÄÖÜäöüß]/.test(password)&&/\d/.test(password),length:password.length>=8,letter:/[A-Za-zÄÖÜäöüß]/.test(password),number:/\d/.test(password)};
}

export const TEST_ACCOUNT=Object.freeze({
  email:'test@galizischebahn.de',
  password:'GBTest092!',
  name:'GB Testkonto',
  initials:'GT',
  tier:'GB Testkonto',
  accountId:'GBK-TEST-0921'
});
export function verifyTestAccount(email,password){
  return normalizeEmail(email)===TEST_ACCOUNT.email&&String(password||'')===TEST_ACCOUNT.password;
}
async function derive(password,salt,iterations=120000){
  const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations},key,256);
  return new Uint8Array(bits);
}
export async function createLocalCredential(email,password){
  const normalized=normalizeEmail(email);if(!validateEmail(normalized))throw new Error('invalid-email');
  if(!validatePassword(password).ok)throw new Error('weak-password');
  const salt=randomBytes(16),iterations=120000,hash=await derive(password,salt,iterations);
  return {version:1,email:normalized,salt:bytesToBase64(salt),hash:bytesToBase64(hash),iterations,createdAt:new Date().toISOString()};
}
export async function verifyLocalCredential(credential,email,password){
  if(!credential||normalizeEmail(email)!==credential.email)return false;
  try{
    const actual=await derive(String(password||''),base64ToBytes(credential.salt),credential.iterations||120000);
    const expected=base64ToBytes(credential.hash);if(actual.length!==expected.length)return false;
    let diff=0;for(let i=0;i<actual.length;i++)diff|=actual[i]^expected[i];return diff===0;
  }catch{return false}
}
export function createLocalSession(email){
  const id=randomBytes(18);return {id:bytesToBase64(id).replace(/[+/=]/g,''),email:normalizeEmail(email),mode:'local',createdAt:new Date().toISOString(),lastSeenAt:new Date().toISOString()};
}
export function authBackendStatus(){
  const cfg=globalThis.GB_AUTH_CONFIG||{};
  const supabaseReady=Boolean(cfg.supabaseUrl&&cfg.supabaseAnonKey);
  return {mode:supabaseReady?'supabase-ready':'local',supabaseReady};
}
