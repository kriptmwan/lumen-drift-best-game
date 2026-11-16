import test from 'node:test';
import assert from 'node:assert/strict';
const engine = await import('../game/src/mission.js').catch(()=>({}));
test('a pilot can salvage, dock, choose an upgrade, and complete all four sectors',()=>{
  assert.equal(typeof engine.createMission,'function','mission simulation must be independently testable');
  const r=engine.createMission();
  assert.equal(r.sector,0);
  assert.equal(engine.tryDock(r),false,'empty ship cannot finish a sector');
  for(let sector=0;sector<4;sector++){
    for(const relic of r.relics){r.ship.x=relic.x;r.ship.y=relic.y;engine.tickMission(r,{},1/60);}
    r.ship.x=600;r.ship.y=610;
    assert.equal(engine.tryDock(r),true);
    if(sector<3){assert.equal(r.phase,'upgrade');engine.chooseUpgrade(r,'shield');assert.equal(r.sector,sector+1);}
  }
  assert.equal(r.phase,'won'); assert.ok(r.score>0); assert.equal(r.delivered,24);
});
test('burst overheats and recovers; pulse repels nearby hazards but cannot spam',()=>{
  const r=engine.createMission();
  for(let i=0;i<250;i++)engine.tickMission(r,{x:1,boost:true},1/60);
  assert.equal(r.overheated,true);
  assert.equal(r.boosting,false);
  for(let i=0;i<300;i++)engine.tickMission(r,{},1/60);
  assert.equal(r.overheated,false);
  r.hazards[0].x=r.ship.x+20;r.hazards[0].y=r.ship.y;
  assert.equal(typeof engine.usePulse,'function');
  assert.equal(engine.usePulse(r),true);assert.ok(r.hazards[0].stunned>0);
  assert.equal(engine.usePulse(r),false);
});
test('pause freezes the clock and an expired contract loses',()=>{
  const r=engine.createMission();r.phase='paused';engine.tickMission(r,{x:1},.05);
  assert.equal(r.remaining,100);assert.equal(r.ship.x,600);
  r.phase='play';r.remaining=.01;engine.tickMission(r,{},.05);assert.equal(r.phase,'lost');
});
