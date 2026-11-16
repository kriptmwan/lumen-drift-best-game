export function createInput(action){
  const keys=new Set();
  addEventListener('keydown',e=>{
    const key=e.key.toLowerCase();
    if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(key))e.preventDefault();
    keys.add(key);if(!e.repeat)action(key);
  });
  addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  addEventListener('blur',()=>{keys.clear();action('blur');});
  return ()=>({x:Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),y:Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup')),boost:keys.has('shift')});
}
