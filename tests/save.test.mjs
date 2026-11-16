import test from 'node:test';
import assert from 'node:assert/strict';
import {loadRecord,saveRecord} from '../game/src/save.js';
test('record survives a reload and records a won expedition',()=>{
  const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
  let record=loadRecord(storage);assert.deepEqual(record,{best:0,wins:0});
  record=saveRecord({phase:'won',score:7690},record,storage);
  assert.deepEqual(loadRecord(storage),{best:7690,wins:1});
  saveRecord({phase:'lost',score:300},record,storage);assert.deepEqual(loadRecord(storage),record);
});
test('blocked storage and damaged records leave the game playable',()=>{
  const denied={getItem(){throw new Error('denied')},setItem(){throw new Error('denied')}};
  assert.deepEqual(loadRecord(denied),{best:0,wins:0});
  assert.deepEqual(saveRecord({phase:'lost',score:100},{best:0,wins:0},denied),{best:100,wins:0});
  assert.deepEqual(loadRecord({getItem:()=>'{broken'}),{best:0,wins:0});
});
