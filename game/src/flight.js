import {createMission,tickMission,tryDock,chooseUpgrade,usePulse} from './mission.js';
import {createRenderer} from './render.js';
import {createScreens} from './screens.js';
import {createInput} from './input.js';
import {createAudio} from './audio.js';
import {loadRecord,saveRecord} from './save.js';
const canvas=document.querySelector('#game'),status=document.querySelector('#status');
const render=createRenderer(canvas),sound=createAudio();
let run=createMission(),phase='title',record=loadRecord(),last=0,recorded=false;
const show=createScreens(document.querySelector('#screens'),act);
const input=createInput(key=>{
  if(key==='blur'){if(phase==='play')act('pause');return;}
  if(key==='r')act('restart');
  if(key==='p'||key==='escape')act(phase==='paused'?'resume':'pause');
  if(key==='m')act('sound');
  if((key==='enter'||key===' ')&&phase==='title')act('launch');
  else if(key===' '&&phase==='play')usePulse(run);
  if(key==='e')act('dock');
  if(phase==='upgrade'&&['1','2','3'].includes(key))act(['shield','magnet','cooling'][Number(key)-1]);
});
function act(action){
  if(action==='launch'||action==='restart'){run=createMission();phase='play';recorded=false;sound.play('launch');}
  if(action==='pause'&&phase==='play'){phase='paused';run.phase='paused';}
  if(action==='resume'&&phase==='paused'){phase='play';run.phase='play';}
  if(action==='title'){phase='title';run=createMission();}
  if(action==='dock'&&phase==='play'&&!tryDock(run))status.textContent='Collect the cargo quota, then fly into the harbor and press E.';
  if(['shield','magnet','cooling'].includes(action)&&chooseUpgrade(run,action))phase='play';
  if(action==='sound')document.querySelector('#sound').textContent=sound.toggle()?'SOUND OFF / M':'SOUND ON / M';
}
document.querySelector('#pause').onclick=()=>act(phase==='paused'?'resume':'pause');
document.querySelector('#sound').onclick=()=>act('sound');
canvas.addEventListener('pointerdown',e=>{
  if(phase!=='play')return;
  const b=canvas.getBoundingClientRect(),x=(e.clientX-b.left)*1200/b.width,y=(e.clientY-b.top)*700/b.height;
  if(Math.hypot(x-600,y-610)<80)act('dock');else usePulse(run);
});
// Telemetry returns a copy; gameplay checks use normal keyboard input.
window.lumenState=()=>JSON.parse(JSON.stringify({screen:phase,run,record}));
function frame(now){
  const dt=Math.min(.04,(now-last)/1000||0);last=now;
  if(phase==='play'){
    tickMission(run,input(),dt);phase=run.phase;
    for(const event of run.events.splice(0))sound.play(event);
    if((phase==='won'||phase==='lost')&&!recorded){record=saveRecord(run,record);recorded=true;}
    status.textContent=`Sector ${run.sector+1}. Cargo ${run.cargo}. Hull ${Math.ceil(run.hull)}. Score ${run.score}.`;
  }
  render(run,now/1000);show(phase,run,record);
  document.querySelector('#pause').disabled=!['play','paused'].includes(phase);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
