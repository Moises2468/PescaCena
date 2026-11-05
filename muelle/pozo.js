'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=MuelleConnection;
 let snapshot,received=0,busy=false,running=true,lease='',timer,frame,lastPaint=0,lastBlocks=-1,avatarKey='',unloading=false;
 const n=x=>Math.floor(x).toLocaleString('es-ES');
 function message(text,error=false){$('save').textContent=text;$('save').dataset.error=error;}
 function character(outfit){const svg=PescaCenaPersonaje.crear({outfit}),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('class','mining-tool');g.innerHTML='<path d="M65 79 88 49" stroke="#263f53" stroke-width="6" stroke-linecap="round"/><path d="M65 79 88 49" stroke="#ba965e" stroke-width="3"/><path d="M76 45Q90 37 101 53L94 55Q90 48 81 52Z" fill="#a8bccb" stroke="#263f53" stroke-width="2"/>';svg.append(g);return svg;}
 function updateAvatar(){const key=snapshot.avatar.outfit;if(key===avatarKey)return;avatarKey=key;$('avatar').replaceChildren(character(key));}
 function projected(){const elapsed=running&&!document.hidden?Math.min(75000,performance.now()-received):0;return Pozo.advance(snapshot.view,elapsed*snapshot.rate);}
 function paint(t){
  if(!snapshot)return;
  const view=projected(),blocks=view.blocks,depth=Math.floor(blocks/5),col=depth%2?5-blocks%5:1+blocks%5,top=Math.max(0,depth-2),row=depth-top,terrain=Pozo.terrain(blocks);
  $('depth').textContent=n(depth)+(depth===1?' fila':' filas');$('total').textContent=n(blocks)+(blocks===1?' bloque entre todos':' bloques entre todos');
  const personalExtra=running&&!document.hidden?Pozo.advance(snapshot.world,Math.min(75000,t-received)*Pozo.picks[snapshot.player.level][1]).broken:0;
  $('mine').textContent=n(snapshot.player.blocks+personalExtra);$('unconfirmed').textContent=personalExtra?'+'+n(personalExtra)+' por confirmar':'Todo guardado';$('layer').textContent='Capa '+(terrain.index+1)+' · '+terrain.name;
  const hardness=Pozo.hardness(blocks);$('strength').textContent='Resistencia '+(hardness/2000).toFixed(1)+'×';$('block-progress').max=hardness;$('block-progress').value=view.part;
  if(blocks!==lastBlocks){lastBlocks=blocks;const tiles=[];for(let r=0;r<7;r++)for(let c=0;c<7;c++){
   const worldRow=top+r,index=worldRow*5+(worldRow%2?5-c:c-1),isBorder=c===0||c===6,empty=!isBorder&&index<blocks;
   const tile=document.createElement('div');const layer=Pozo.terrain(worldRow*5);tile.className='tile'+(empty?' empty':'')+(!isBorder&&!empty&&index%11===10?' gold':'')+(!isBorder&&index===blocks?' target':'');tile.style.setProperty('--rock',layer.color);tile.style.setProperty('--edge',layer.edge);tiles.push(tile);
  }$('tiles').replaceChildren(...tiles);}
  $('scene').classList.toggle('underground',depth>2);const air=depth>2?40:140;
  const width=$('tiles').clientWidth,cell=width/7,x=(col+.5)*cell,y=air+row*cell;
  $('miner').style.left=x+'px';$('miner').style.top=y+'px';$('scene').style.setProperty('--hit-x',(x+cell*.25)+'px');$('scene').style.setProperty('--hit-y',(y+cell*.25)+'px');
  [...$('peers').children].forEach((el,i)=>{el.style.left=((1+(i%4)+.5)*cell)+'px';el.style.top=(air+Math.max(0,row-1)*cell)+'px';});
  $('scene').classList.toggle('stopped',!running||document.hidden);
  $('action').textContent=running?'Picando automáticamente · '+Math.floor(view.part/hardness*100)+'% del bloque':'Excavación en pausa';
 }
 function controls(){if(!snapshot)return;const p=snapshot.player,next=Pozo.picks[p.level+1];$('ore').textContent=n(p.ore)+' minerales confirmados';$('pick').textContent='Pico de '+Pozo.picks[p.level][0];$('pick-info').textContent='Potencia '+Pozo.picks[p.level][1]+'× · Las mejoras se conservan al volver.';$('upgrade').textContent=next?'Mejorar · '+next[2]+' minerales':'Pico máximo';$('upgrade').disabled=busy||!next||p.ore<next[2];$('pause').disabled=busy;$('pause').textContent=running?'Pausar':'Continuar';$('sync').disabled=busy;}
 function accept(data){snapshot=data;lease=data.lease;received=performance.now();lastBlocks=-1;updateAvatar();$('personas').textContent=data.count+(data.count===1?' persona picando':' personas picando');$('peers').replaceChildren(...data.peers.map(p=>{const div=document.createElement('div');div.className='mine-peer';div.title=p.name;div.append(character(p.outfit));return div;}));controls();paint(received);}
 function schedule(){clearTimeout(timer);if(running&&!document.hidden&&!unloading)timer=setTimeout(()=>sync(),55000+Math.random()*10000);}
 async function sync(op='pozo-sync'){
  if(busy||!lease)return;busy=true;controls();
  try{accept(await api.request(op,{lease,active:running&&!document.hidden}));message(running?'Avance confirmado. Se vuelve a guardar automáticamente.':'Avance guardado. Estás en pausa.');if(op==='pozo-upgrade')$('upgrade-note').textContent='Pico mejorado y guardado.';}
  catch(e){message(e.message,true);if(e.code==='lease'){running=false;$('retry').hidden=false;}else if(op==='pozo-upgrade')$('upgrade-note').textContent=e.message;}
  finally{busy=false;controls();schedule();}
 }
 async function start(){if(busy)return;busy=true;$('retry').hidden=true;message('Conectando y preparando el pico…');try{running=true;accept(await api.request('pozo-join'));message('Picando automáticamente. El avance se confirma aproximadamente cada minuto.');}catch(e){message(e.message,true);running=false;$('retry').hidden=false;}finally{busy=false;controls();schedule();}}
 $('upgrade').onclick=()=>sync('pozo-upgrade');$('sync').onclick=()=>sync();$('retry').onclick=start;
 $('pause').onclick=()=>{if(busy)return;running=!running;sync();};
 $('volver').onclick=()=>{unloading=true;running=false;clearTimeout(timer);if(lease)api.leave('pozo-sync',{lease,active:false});if(window!==parent)window.frameElement?.closest('dialog')?.close();else location.href='../index.html';};
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!snapshot)return;sync();});
 window.addEventListener('pagehide',()=>{if(!unloading&&lease)api.leave('pozo-sync',{lease,active:false});unloading=true;clearTimeout(timer);cancelAnimationFrame(frame);});
 function loop(t){if(t-lastPaint>90){paint(t);lastPaint=t;}frame=requestAnimationFrame(loop);}frame=requestAnimationFrame(loop);start();
})();
