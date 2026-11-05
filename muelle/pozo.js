'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=MuelleConnection,visual=PozoVisual.create(document.getElementById('scene'));
 let snapshot,received=0,busy=false,running=true,lease='',timer,frame,lastPaint=0,avatarKey='',unloading=false;
 const n=x=>Math.floor(x).toLocaleString('es-ES');
 function message(text,error=false){$('save').textContent=text;$('save').dataset.error=error;}
 function character(outfit){const svg=PescaCenaPersonaje.crear({outfit}),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('class','mining-tool');g.innerHTML='<path d="M65 79 88 49" stroke="#263f53" stroke-width="6" stroke-linecap="round"/><path d="M65 79 88 49" stroke="#ba965e" stroke-width="3"/><path d="M76 45Q90 37 101 53L94 55Q90 48 81 52Z" fill="#a8bccb" stroke="#263f53" stroke-width="2"/>';svg.append(g);return svg;}
 function updateAvatar(){const key=snapshot.avatar.outfit;if(key===avatarKey)return;avatarKey=key;$('avatar').replaceChildren(character(key));}
 function projected(){const elapsed=running&&!document.hidden?Math.min(75000,performance.now()-received):0;return Pozo.advance(snapshot.view,elapsed*snapshot.rate);}
 function paint(t){
  if(!snapshot)return;
  const view=visual.render(projected(),t),blocks=view.blocks,depth=view.depth,terrain=Pozo.terrain(blocks);
  $('depth').textContent=n(depth)+(depth===1?' fila':' filas');$('total').textContent=n(blocks)+(blocks===1?' bloque entre todos':' bloques entre todos');
  const personalExtra=running&&!document.hidden?Pozo.advance(snapshot.world,Math.min(75000,t-received)*Pozo.picks[snapshot.player.level][1]).broken:0;
  $('mine').textContent=n(snapshot.player.blocks+personalExtra);$('layer').textContent='Capa '+(terrain.index+1)+' · '+terrain.name;
  const hardness=Pozo.hardness(blocks);$('strength').textContent='Resistencia '+(hardness/2000).toFixed(1)+'×';$('block-progress').max=hardness;$('block-progress').value=view.part;
  $('scene').classList.toggle('stopped',!running||document.hidden);
  $('action').textContent=view.breaking?'¡El bloque se rompe!':running?'Picando automáticamente · '+Math.floor(view.part/hardness*100)+'% del bloque':'Reconectando…';
 }
 function controls(){if(!snapshot)return;const p=snapshot.player,next=Pozo.picks[p.level+1];$('ore').textContent=n(p.ore)+' minerales';$('pick').textContent='Pico de '+Pozo.picks[p.level][0];$('pick-info').textContent='Potencia '+Pozo.picks[p.level][1]+'× · Las mejoras se conservan al volver.';$('upgrade').textContent=next?'Mejorar · '+next[2]+' minerales':'Pico máximo';$('upgrade').disabled=busy||!next||p.ore<next[2];}
 function accept(data){snapshot=data;lease=data.lease;received=performance.now();updateAvatar();$('personas').textContent=data.count+(data.count===1?' persona picando':' personas picando');$('peers').replaceChildren(...data.peers.map(p=>{const div=document.createElement('div');div.className='mine-peer';div.title=p.name;div.append(character(p.outfit));return div;}));controls();paint(received);}
 function schedule(){clearTimeout(timer);if(running&&!document.hidden&&!unloading)timer=setTimeout(()=>sync(),55000+Math.random()*10000);}
 async function sync(op='pozo-sync'){
  if(busy||!lease)return;busy=true;controls();
  try{accept(await api.request(op,{lease,active:running&&!document.hidden}));message('Guardado automático');if(op==='pozo-upgrade')$('upgrade-note').textContent='Pico mejorado y guardado.';}
  catch(e){message(e.message.replace('minerales confirmados','minerales'),true);if(e.code==='lease'){running=false;$('retry').hidden=false;}else if(op==='pozo-upgrade')$('upgrade-note').textContent=e.message;}
  finally{busy=false;controls();schedule();}
 }
 async function start(){if(busy)return;busy=true;$('retry').hidden=true;message('Conectando y preparando el pico…');try{running=true;accept(await api.request('pozo-join'));message('Guardado automático');}catch(e){message(e.message.replace('minerales confirmados','minerales'),true);running=false;$('retry').hidden=false;}finally{busy=false;controls();schedule();}}
 $('upgrade').onclick=()=>sync('pozo-upgrade');$('retry').onclick=start;
 $('volver').onclick=()=>{unloading=true;running=false;clearTimeout(timer);if(lease)api.leave('pozo-sync',{lease,active:false});if(window!==parent)window.frameElement?.closest('dialog')?.close();else location.href='../index.html';};
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!snapshot)return;sync();});
 window.addEventListener('pagehide',()=>{if(!unloading&&lease)api.leave('pozo-sync',{lease,active:false});unloading=true;clearTimeout(timer);cancelAnimationFrame(frame);});
 function loop(t){if(t-lastPaint>90){paint(t);lastPaint=t;}frame=requestAnimationFrame(loop);}frame=requestAnimationFrame(loop);start();
})();
