const KEY='lumen-drift.expedition.v2';
export function loadRecord(storage=globalThis.localStorage){
  try{const r=JSON.parse(storage.getItem(KEY));return {best:Math.max(0,Number(r?.best)||0),wins:Math.max(0,Number(r?.wins)||0)};}catch{return {best:0,wins:0};}
}
export function saveRecord(run,record,storage=globalThis.localStorage){
  const next={best:Math.max(record.best,run.score),wins:record.wins+(run.phase==='won'?1:0)};
  try{storage.setItem(KEY,JSON.stringify(next));}catch{/* Private browsing still permits a complete run. */}
  return next;
}
