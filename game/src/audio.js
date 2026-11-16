export function createAudio(){
  let ctx,muted=false;
  return {toggle(){muted=!muted;return muted;},play(event){
    if(muted)return;
    try{
      ctx??=new AudioContext();if(ctx.state==='suspended')ctx.resume();
      const tones={collect:[660,990],dock:[330,440,660],pulse:[140,420],hit:[120,75],lost:[220,130,65],launch:[220,440],overheat:[180,180]};
      (tones[event]||[440]).forEach((hz,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),start=ctx.currentTime+i*.075;o.type=event==='hit'?'triangle':'sine';o.frequency.setValueAtTime(hz,start);g.gain.setValueAtTime(.035,start);g.gain.exponentialRampToValueAtTime(.0001,start+.23);o.connect(g).connect(ctx.destination);o.start(start);o.stop(start+.24);});
    }catch{/* Audio is optional when the browser denies playback. */}
  }};
}
