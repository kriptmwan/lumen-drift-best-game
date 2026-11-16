export const SECTORS = [
  {name:'THE GLASS REEF',subtitle:'Wake the navigation buoys',color:'#61e6df',hazards:['drifter'],count:5,quota:5,time:100},
  {name:'EMBER WAKE',subtitle:'Cross the furnace currents',color:'#ffb75d',hazards:['drifter','sentinel'],count:6,quota:5,time:95},
  {name:'THE SILENT ARRAY',subtitle:'Outrun the listening machines',color:'#b9a1ff',hazards:['hunter','sentinel'],count:7,quota:6,time:100},
  {name:'DAWN ENGINE',subtitle:'Bring the last light home',color:'#f4dc88',hazards:['drifter','hunter','sentinel'],count:6,quota:6,time:95}
];
export const UPGRADES = [
  {id:'shield',name:'REINFORCED HULL',detail:'+30 hull capacity · repair to full'},
  {id:'magnet',name:'SALVAGE MAGNET',detail:'+22 pickup range · faster routes'},
  {id:'cooling',name:'COLD DRIVE',detail:'Heat cools 45% faster · burst longer'}
];
export function populateSector(index){
  const spec=SECTORS[index];
  const relics=Array.from({length:spec.count},(_,i)=>{
    const a=-Math.PI/2+i*Math.PI*2/spec.count;
    return {x:600+Math.cos(a)*(240+(i%2)*75),y:360+Math.sin(a)*(170+(i%2)*40),r:13,claimed:false,value:i%3===0?180:100};
  });
  const hazards=Array.from({length:3+index*2},(_,i)=>({
    kind:spec.hazards[i%spec.hazards.length],angle:i*2.399+0.6,radius:130+(i%3)*75,
    x:0,y:0,r:15,phase:i*.9,stunned:0
  }));
  return {relics,hazards};
}
