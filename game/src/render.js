import {SECTORS} from './sectors.js';
export function createRenderer(canvas){
  const c=canvas.getContext('2d');canvas.width=1200;canvas.height=700;
  function text(t,x,y,size=14,color='#b8cbd4',align='left'){c.fillStyle=color;c.font=`${size>=22?700:500} ${size}px ${size<15?'monospace':'system-ui'}`;c.textAlign=align;c.fillText(t,x,y);}
  function line(x,y,a,b,color){c.strokeStyle=color;c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();}
  function ring(x,y,r,col,width=1){c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.lineWidth=1;}
  function polygon(x,y,r,n,angle,fill,stroke){c.beginPath();for(let i=0;i<n;i++){const a=angle+i*Math.PI*2/n;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=stroke;c.stroke();}
  return function renderMission(r,time){
    const spec=SECTORS[r.sector],accent=spec.color;
    c.fillStyle='#071015';c.fillRect(0,0,1200,700);
    const nebula=c.createRadialGradient(620,330,20,620,330,480);nebula.addColorStop(0,'#20343d');nebula.addColorStop(.5,'#101d2b');nebula.addColorStop(1,'#071015');c.fillStyle=nebula;c.fillRect(220,90,760,570);
    for(let i=0;i<150;i++){c.fillStyle=i%5===0?'#6f919c':'#2a444f';c.fillRect(225+(i*137.17)%750,95+(i*83.71)%560,i%5===0?2:1,i%5===0?2:1);}
    // A broken orbital machine gives the salvage field a readable centre.
    c.save();c.translate(600,350);c.rotate(time*.025);
    for(let i=0;i<12;i++){c.save();c.rotate(i*Math.PI/6);c.fillStyle=i%3===0?'#304750':'#1b303a';c.fillRect(83,-10,45,20);c.strokeStyle='#45606a';c.strokeRect(83,-10,45,20);c.restore();}
    ring(0,0,80,'#3c5663',12);ring(0,0,69,accent,2);ring(0,0,46,'#28414d',14);
    const core=c.createRadialGradient(0,0,1,0,0,43);core.addColorStop(0,'#fff4c5');core.addColorStop(.4,accent);core.addColorStop(1,'#10242d');c.fillStyle=core;c.beginPath();c.arc(0,0,42,0,Math.PI*2);c.fill();c.restore();
    for(const radius of [170,240,315]){c.save();c.translate(600,350);c.scale(1,.72);ring(0,0,radius,'#263e49');c.restore();}
    for(const relic of r.relics)if(!relic.claimed){
      ring(relic.x,relic.y,23+Math.sin(time*3)*2,accent+'55');
      polygon(relic.x,relic.y,13,4,time*.5,'#19333c',relic.value===180?'#f5cf7a':accent);
      c.fillStyle=relic.value===180?'#f5cf7a':accent;c.fillRect(relic.x-3,relic.y-3,6,6);
      text(relic.value===180?'CORE':'SHARD',relic.x,relic.y+39,10,'#9db9c1','center');
    }
    for(const h of r.hazards){
      const color=h.stunned?'#526b74':h.kind==='hunter'?'#e993ff':h.kind==='sentinel'?'#ffb35e':'#f47d7c';
      if(h.kind==='sentinel'){
        const hot=h.phase%5>3.8;c.setLineDash(hot?[]:[5,7]);line(h.x-100,h.y,h.x+100,h.y,hot?'#ffb35e':'#805c3970');c.setLineDash([]);
        polygon(h.x,h.y,16,4,Math.PI/4,'#382c24',color);
      }else if(h.kind==='hunter'){polygon(h.x,h.y,19,3,Math.atan2(r.ship.y-h.y,r.ship.x-h.x),'#39213f',color);ring(h.x,h.y,25,color+'55');}
      else{polygon(h.x,h.y,18,7,h.phase,'#38262a',color);polygon(h.x,h.y,8,3,-h.phase,'#f47d7c',color);}
    }
    const ready=r.cargo>=spec.quota;
    c.fillStyle=ready?'#173c34':'#172b30';c.fillRect(526,587,148,48);c.strokeStyle=ready?'#9cf4b4':'#4b6b70';c.strokeRect(526,587,148,48);
    for(let i=0;i<5;i++){line(540+i*28,595,550+i*28,605,ready?'#9cf4b4':'#4b6b70');}
    text(ready?'E  DOCK & BANK':'HARBOR  /  RETURN HERE',600,626,11,ready?'#baffcc':'#9db9c1','center');
    if(ready){c.setLineDash([4,9]);line(r.ship.x,r.ship.y,600,587,'#9cf4b440');c.setLineDash([]);}
    for(const p of r.trail){c.globalAlpha=Math.max(0,p.life)*.5;c.fillStyle=r.boosting?'#ffd98e':accent;c.beginPath();c.arc(p.x,p.y,3*p.life,0,Math.PI*2);c.fill();}c.globalAlpha=1;
    if(r.pulseRadius){ring(r.ship.x,r.ship.y,170-r.pulseRadius,accent,3);ring(r.ship.x,r.ship.y,190-r.pulseRadius,accent+'55');}
    c.save();c.translate(r.ship.x,r.ship.y);c.rotate(r.ship.angle);
    if(r.invincible>0)c.globalAlpha=.45+.5*Math.sin(time*30)**2;
    c.fillStyle=r.boosting?'#ffbf64':'#61e6df';c.beginPath();c.moveTo(-10,-5);c.lineTo(-24-(r.boosting?15:0)-Math.sin(time*30)*4,0);c.lineTo(-10,5);c.fill();
    c.fillStyle='#e1f4ee';c.strokeStyle=accent;c.beginPath();c.moveTo(21,0);c.lineTo(-14,-13);c.lineTo(-7,0);c.lineTo(-14,13);c.closePath();c.fill();c.stroke();c.fillStyle='#25526a';c.fillRect(1,-3,7,6);c.restore();
    for(const p of r.particles)text(p.text,p.x,p.y,18,'#f9d889','center');
    // Cockpit rails: route left, resources right, objective across the bottom.
    c.fillStyle='#0c191f';c.fillRect(0,0,1200,84);c.fillRect(0,84,220,616);c.fillRect(980,84,220,616);c.fillRect(220,655,760,45);
    line(220,84,220,700,'#2a4149');line(980,84,980,700,'#2a4149');line(0,84,1200,84,'#35505a');
    text('LUMEN / DRIFT',26,39,24,'#e1f4ee');text('SALVAGE EXPEDITION',28,62,11,accent);
    text(spec.name,600,39,24,'#e1f4ee','center');text(`SECTOR 0${r.sector+1} / 04   ·   ${spec.subtitle}`,600,63,12,accent,'center');
    text('HAUL',1000,29,11);text(r.score.toLocaleString(),1000,62,29,'#f6d38d');
    text('FLIGHT PLAN',24,122,12,accent);
    SECTORS.forEach((s,i)=>{const y=160+i*62,col=i===r.sector?accent:i<r.sector?'#a8d6ae':'#57717b';ring(36,y-5,9,col,2);if(i<3)line(36,y+7,36,y+44,'#30444d');text(String(i+1),36,y-1,10,col,'center');text(s.name,55,y,11,col);text(i<r.sector?'DELIVERED':i===r.sector?'CURRENT CONTRACT':'AWAITING SIGNAL',55,y+19,9,i===r.sector?'#d2e1df':'#57717b');});
    text('CARGO HOLD',24,437,12,accent);text(`${r.cargo} / ${spec.quota}`,24,478,32,'#e4f0e8');text('Required to open the dock',24,500,10);
    for(let i=0;i<spec.count;i++){c.fillStyle=i<r.cargo?accent:'#263a41';c.fillRect(25+i*24,514,17,10);}
    text('BANKED',24,577,11);text(`${r.bank} cr`,24,608,24,'#f6d38d');
    text('HULL INTEGRITY',1000,122,11);text(`${Math.ceil(r.hull)} / ${r.maxHull}`,1000,154,24,'#e1f4ee');
    meter(c,1000,168,174,r.hull/r.maxHull,r.hull<35?'#fa8580':accent);
    text(r.overheated?'DRIVE LOCK · COOLING':'DRIVE HEAT',1000,212,11,r.overheated?'#fa8580':'#b8cbd4');meter(c,1000,227,174,r.heat/100,'#ffb35e');
    text('SALVAGE CHAIN',1000,278,11);text(`×${Math.max(1,r.combo)}`,1000,317,36,'#f6d38d');meter(c,1000,330,174,r.comboTime/7,'#f6d38d');text('Collect within 7s to chain',1000,355,10);
    text('REPULSOR [SPACE]',1000,400,11);text(r.pulseCooldown>0?`${r.pulseCooldown.toFixed(1)}s`:'READY',1000,431,22,r.pulseCooldown>0?'#7d969f':accent);
    text('CONTRACT CLOCK',1000,481,11);text(`${Math.ceil(r.remaining)}s`,1000,516,30,r.remaining<20?'#fa8580':'#e1f4ee');
    text('SYSTEMS',1000,567,11);r.upgrades.forEach((u,i)=>text(`+ ${u.toUpperCase()}`,1000,590+i*19,11,accent));if(!r.upgrades.length)text('Stock salvage rig',1000,590,11);
    text(ready?'CARGO READY  →  Return to harbor and press E':`RECOVER ${spec.quota-r.cargo} MORE  ·  Optional cores score extra`,600,683,15,ready?'#a8f3b8':'#d3e2df','center');
  };
}
function meter(c,x,y,w,value,color){c.fillStyle='#253840';c.fillRect(x,y,w,7);c.fillStyle=color;c.fillRect(x,y,w*Math.max(0,Math.min(1,value)),7);}
