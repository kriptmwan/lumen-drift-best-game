export const TAU=Math.PI*2;
export function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
export function lerp(a,b,t){return a+(b-a)*t}
export function dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by)}
export function seeded(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
export function makeStarfield(rng,count=110){return Array.from({length:count},()=>({x:rng(),y:rng(),r:.5+rng()*1.8,a:.25+rng()*.65,tw:rng()*TAU}))}
export function orbitPoint(cx,cy,rx,ry,angle){return{x:cx+Math.cos(angle)*rx,y:cy+Math.sin(angle)*ry}}
export function createDebris(rng,w,h,level){const types=['ion','glass','core','relic'];return Array.from({length:4+level},(_,i)=>{const a=rng()*TAU;const ring=Math.min(w,h)*(.2+rng()*.3);return{type:types[(i+level)%types.length],x:w/2+Math.cos(a)*ring,y:h/2+Math.sin(a)*ring*.72,r:15+rng()*12,spin:rng()*TAU,drift:(rng()-.5)*.18,rot:rng()*TAU,claimed:false,pulse:rng()*TAU}})}
export function createThreats(rng,w,h,level){return Array.from({length:2+level},(_,i)=>{const a=rng()*TAU;const ring=Math.min(w,h)*(.3+rng()*.18);return{x:w/2+Math.cos(a)*ring,y:h/2+Math.sin(a)*ring*.72,vx:(rng()-.5)*.7,vy:(rng()-.5)*.7,r:12+rng()*9,phase:rng()*TAU,kind:i%2?'shard':'mine'}})}
export function stepThreat(t,dt,w,h,level){const dx=w/2-t.x,dy=h*.49-t.y;const d=Math.max(1,Math.hypot(dx,dy));t.vx+=(dx/d)*dt*.12*(level*.1+1);t.vy+=(dy/d)*dt*.12*(level*.1+1);t.x+=t.vx*dt*60;t.y+=t.vy*dt*60;t.vx*=.997;t.vy*=.997;if(t.x<-40)t.x=w+40;if(t.x>w+40)t.x=-40;if(t.y<-40)t.y=h+40;if(t.y>h+40)t.y=-40;t.phase+=dt*3}
