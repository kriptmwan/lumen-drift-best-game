import {SECTORS,populateSector} from './sectors.js';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createMission(){
  const run={phase:'play',sector:0,score:0,bank:0,cargo:0,delivered:0,hull:100,maxHull:100,heat:0,combo:0,comboTime:0,elapsed:0,remaining:100,invincible:0,pulseCooldown:0,pulseRadius:0,pickupRange:30,cooling:1,upgrades:[],events:[],trail:[],particles:[],hits:0,pulses:0,boosting:false,overheated:false,ship:{x:600,y:570,vx:0,vy:0,angle:-Math.PI/2}};
  Object.assign(run,populateSector(0));return run;
}
export function tickMission(r,input,dt){
  if(r.phase!=='play')return;
  dt=clamp(dt,0,.05);r.elapsed+=dt;r.remaining-=dt;r.invincible=Math.max(0,r.invincible-dt);r.pulseCooldown=Math.max(0,r.pulseCooldown-dt);r.pulseRadius=Math.max(0,r.pulseRadius-dt*240);
  r.comboTime=Math.max(0,r.comboTime-dt);if(!r.comboTime)r.combo=0;
  r.heat=Math.max(0,r.heat-dt*18*r.cooling);if(r.heat<30)r.overheated=false;
  const s=r.ship, dx=input.x||0,dy=input.y||0, length=Math.hypot(dx,dy)||1;
  r.boosting=!!input.boost&&!r.overheated&&(dx!==0||dy!==0);
  if(r.boosting){r.heat=Math.min(100,r.heat+dt*48);if(r.heat>=99){r.overheated=true;r.events.push('overheat');}}
  const speed=r.boosting?300:190, blend=1-Math.exp(-dt*12);
  s.vx+=(dx/length*speed-s.vx)*blend;s.vy+=(dy/length*speed-s.vy)*blend;
  s.x=clamp(s.x+s.vx*dt,240,960);s.y=clamp(s.y+s.vy*dt,120,630);
  if(Math.hypot(s.vx,s.vy)>10)s.angle=Math.atan2(s.vy,s.vx);
  if(Math.hypot(s.vx,s.vy)>15){r.trail.push({x:s.x,y:s.y,life:1});if(r.trail.length>35)r.trail.shift();}
  for(const p of r.trail)p.life-=dt*2;r.trail=r.trail.filter(p=>p.life>0);
  for(const relic of r.relics){
    if(!relic.claimed&&Math.hypot(s.x-relic.x,s.y-relic.y)<r.pickupRange){
      relic.claimed=true;r.cargo++;r.combo=Math.min(5,r.combo+1);r.comboTime=7;
      const points=relic.value*r.combo;r.score+=points;r.events.push('collect');
      r.particles.push({x:relic.x,y:relic.y,text:`+${points}  ×${r.combo}`,life:1.4});
    }
  }
  for(const h of r.hazards){
    h.phase+=dt;h.stunned=Math.max(0,h.stunned-dt);
    if(h.stunned)continue;
    if(h.kind==='hunter'){
      if(!h.x){h.x=600+Math.cos(h.angle)*h.radius;h.y=350+Math.sin(h.angle)*h.radius*.7;}
      const distance=Math.hypot(s.x-h.x,s.y-h.y)||1;
      const pace=distance<260?60+r.sector*8:20;
      h.x+=(s.x-h.x)/distance*pace*dt;h.y+=(s.y-h.y)/distance*pace*dt;
    }else{
      h.angle+=dt*(h.kind==='sentinel'?.20:.40)*(h.radius%2?1:-1);
      h.x=600+Math.cos(h.angle)*h.radius;h.y=350+Math.sin(h.angle)*h.radius*.72;
    }
    const beam=h.kind==='sentinel'&&h.phase%5>3.8;
    const hit=Math.hypot(s.x-h.x,s.y-h.y)<h.r+14 || (beam&&Math.abs(s.y-h.y)<9&&Math.abs(s.x-h.x)<100);
    if(hit&&r.invincible===0){r.hull=Math.max(0,r.hull-18);r.hits++;r.invincible=1.3;r.combo=0;r.events.push('hit');}
  }
  for(const p of r.particles){p.life-=dt;p.y-=dt*18;}r.particles=r.particles.filter(p=>p.life>0);
  if(r.hull<=0||r.remaining<=0){r.phase='lost';r.events.push('lost');}
}
export function usePulse(r){
  if(r.phase!=='play'||r.pulseCooldown>0)return false;
  r.pulseCooldown=7;r.pulseRadius=150;r.pulses++;r.events.push('pulse');
  for(const h of r.hazards)if(Math.hypot(r.ship.x-h.x,r.ship.y-h.y)<170){
    h.stunned=2.8;
    const dx=h.x-r.ship.x,dy=h.y-r.ship.y,d=Math.hypot(dx,dy)||1;
    h.x+=dx/d*90;h.y+=dy/d*90;
  }
  return true;
}
export function tryDock(r){
  if(r.phase!=='play'||Math.hypot(r.ship.x-600,r.ship.y-610)>68||r.cargo<SECTORS[r.sector].quota)return false;
  r.delivered+=r.cargo;r.bank=r.score;r.events.push('dock');
  r.phase=r.sector===3?'won':'upgrade';if(r.phase==='won'){r.score+=Math.round(r.remaining)*10;r.bank=r.score;}
  return true;
}
export function chooseUpgrade(r,id){
  if(r.phase!=='upgrade'||!['shield','magnet','cooling'].includes(id))return false;
  r.upgrades.push(id);if(id==='shield')r.maxHull+=30;if(id==='magnet')r.pickupRange+=22;if(id==='cooling')r.cooling*=1.45;
  r.sector++;r.cargo=0;r.combo=0;r.heat=0;r.overheated=false;r.hull=r.maxHull;r.remaining=SECTORS[r.sector].time;
  r.ship={x:600,y:570,vx:0,vy:0,angle:-Math.PI/2};r.trail=[];r.phase='play';Object.assign(r,populateSector(r.sector));return true;
}
