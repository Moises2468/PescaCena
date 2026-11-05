'use strict';
(()=>{
 const $=id=>document.getElementById(id),api=MuelleConnection,visual=PozoVisual.create(document.getElementById('scene')),checkpoints=PozoCheckpoints.create();
 let snapshot,received=0,busy=false,running=true,lease='',timer,frame,lastPaint=0,avatarKey='',unloading=false,clicks=0,lastTap=0,rewardBusy=false,layerKey=-1,weekKey='',hitTimer;
 const n=x=>Math.floor(x).toLocaleString('es-ES');
 function message(text,error=false){$('save').textContent=error?text:'';$('save').dataset.error=error;$('save').hidden=!error;}
 function character(outfit){const svg=PescaCenaPersonaje.crear({outfit}),g=document.createElementNS(svg.namespaceURI,'g');g.setAttribute('class','mining-tool');g.innerHTML='<path d="M65 79 88 49" stroke="#263f53" stroke-width="6" stroke-linecap="round"/><path d="M65 79 88 49" stroke="#ba965e" stroke-width="3"/><path d="M76 45Q90 37 101 53L94 55Q90 48 81 52Z" fill="#a8bccb" stroke="#263f53" stroke-width="2"/>';svg.append(g);return svg;}
 function updateAvatar(){const key=snapshot.avatar.outfit;if(key===avatarKey)return;avatarKey=key;$('avatar').replaceChildren(character(key));}
 const ownRate=()=>Pozo.picks[snapshot.player.level][1]*Pozo.speed(snapshot.player.speedLevel);
 const manualWork=elapsed=>Math.min(Math.max(0,clicks-(snapshot.player.clicks||0))*140,elapsed*.7)*ownRate();
 function projected(){const elapsed=running&&!document.hidden?Math.min(75000,performance.now()-received):0;return Pozo.advance(snapshot.view,elapsed*snapshot.rate+manualWork(elapsed));}
 function paint(t){
  if(!snapshot)return;
  const view=visual.render(projected(),t),blocks=view.blocks,depth=view.depth,terrain=Pozo.terrain(blocks);
  $('depth').textContent=n(depth)+(depth===1?' fila':' filas');$('total').textContent=n(blocks)+(blocks===1?' bloque entre todos':' bloques entre todos');
  const elapsed=Math.min(75000,t-received),personalExtra=running&&!document.hidden?Pozo.advance(snapshot.world,elapsed*ownRate()+manualWork(elapsed)).broken:0;
  const personal=snapshot.player.blocks+personalExtra;
  $('mine').textContent=n(personal);if(layerKey!==terrain.index){layerKey=terrain.index;$('layer').replaceChildren(MineralesArte.draw(terrain.index),document.createTextNode('Capa '+(terrain.index+1)+' · '+terrain.name));}
  const hardness=Pozo.hardness(blocks);$('strength').textContent='Resistencia '+(hardness/2000).toFixed(1)+'×';$('block-progress').max=hardness;$('block-progress').value=view.part;
  $('scene').classList.toggle('stopped',!running||document.hidden);
  $('action').textContent=view.breaking?'¡El bloque se rompe!':running?'Picando automáticamente · '+Math.floor(view.part/hardness*100)+'% del bloque':'Reconectando…';
  if(running&&!document.hidden&&!unloading&&!busy&&!rewardBusy&&checkpoints.due(personal,blocks,t))sync();
 }
 function controls(){
  if(!snapshot)return;const p=snapshot.player,next=Pozo.picks[p.level+1],blocked=busy||rewardBusy;
  $('ore').textContent=n(p.ore)+' minerales';$('pick').textContent='Pico de '+Pozo.picks[p.level][0];$('pick-info').textContent='Fuerza '+Pozo.picks[p.level][1]+'× por golpe.';
  $('upgrade').textContent=next?'Mejorar · '+next[2]+' minerales':'Pico máximo';$('upgrade').disabled=blocked||!next||p.ore<next[2];
  const speedCost=Pozo.speedCost(p.speedLevel||0);$('speed-info').textContent='Ritmo '+Pozo.speed(p.speedLevel).toFixed(2)+'× · Nivel '+(p.speedLevel||0);
  $('speed').textContent=speedCost===undefined?'Velocidad máxima':'Mejorar · '+speedCost+' minerales';$('speed').disabled=blocked||speedCost===undefined||p.ore<speedCost;
  $('scene').style.setProperty('--swing-time',(.6/Pozo.speed(p.speedLevel))+'s');
  const w=snapshot.weekly;
  if(w){$('week-progress').max=w.target;$('week-progress').value=w.progress;$('week-name').textContent=w.name;$('week-period').textContent='Semana del '+w.id.split('-').reverse().join('/');$('week-status').textContent=n(w.progress)+' / '+n(w.target)+' bloques · Tu aportación: '+n(w.contribution);
   $('week-claim').textContent=w.claimed?'Prenda guardada en tu vestuario':w.progress>=w.target?(w.contribution?'Recoger prenda conmemorativa':'Aporta un bloque para unirte al logro'):'Completad el encargo para ganar la prenda';$('week-claim').disabled=blocked||w.claimed||!w.contribution||w.progress<w.target;
   if(weekKey!==w.outfit){weekKey=w.outfit;$('week-outfit').replaceChildren(PescaCenaPersonaje.crear({outfit:w.outfit}));}
  }
  const rows=Aventuras.fossils.map(f=>{const row=document.createElement('div');row.className='fossil-row';const art=MineralesArte.fossil(f.id),text=document.createElement('div');const label=document.createElement('strong');label.textContent=f.name+' · '+n(p.fossils?.[f.id]||0);const detail=document.createElement('small');detail.textContent=f.value+' minerales por pieza';text.append(label,detail);row.append(art,text);return row;});$('fossils').replaceChildren(...rows);
  const value=Aventuras.fossils.reduce((sum,f)=>sum+(p.fossils?.[f.id]||0)*f.value,0);$('sell').textContent='Vender fósiles · '+n(value)+' minerales';$('sell').disabled=blocked||value===0;
  const available=snapshot.chests?.available||0;$('chest-status').textContent=available?n(available)+(available===1?' cofre por abrir':' cofres por abrir'):'Próximo cofre: '+n(snapshot.chests?.next||50)+' bloques personales';$('chest').disabled=blocked||!available;
 }
 function accept(data){snapshot=data;lease=data.lease;received=performance.now();checkpoints.accept(data,received);updateAvatar();$('personas').textContent=data.count+(data.count===1?' persona picando':' personas picando');$('peers').replaceChildren(...data.peers.map(p=>{const div=document.createElement('div');div.className='mine-peer';div.title=p.name;div.append(character(p.outfit));return div;}));
  const news=[];for(const f of data.found||[])news.push(f.count+' '+Aventuras.fossils.find(x=>x.id===f.id).name);for(const id of data.unlocked||[])news.push('Nueva prenda: '+Pesca.gearItem(id).name);if(news.length)$('find-note').textContent=news.join(' · ');
  controls();paint(received);}
 // Safety renewal for slow/deep blocks, presence and the server's 75 s lease.
 // Normal saves are triggered by completed work, upgrades and leaving.
 function schedule(){clearTimeout(timer);if(running&&!document.hidden&&!unloading)timer=setTimeout(()=>sync(),65000);}
 async function sync(op='pozo-sync',values={}){
  if(busy||!lease)return;busy=true;const active=running&&!document.hidden;checkpoints.attempted(performance.now());controls();
  try{const data=await api.request(op,{lease,active,clicks,...values});accept(data);message('Progreso guardado');if(op==='pozo-upgrade'||op==='pozo-speed')$('upgrade-note').textContent='Mejora guardada.';if(op==='pozo-sell')$('find-note').textContent='Fósiles vendidos: +'+n(data.sold)+' minerales.';return data;}
  catch(e){message(e.message.replace('minerales confirmados','minerales'),true);if(e.code==='lease'){running=false;$('retry').hidden=false;}else if(op==='pozo-upgrade')$('upgrade-note').textContent=e.message;}
  finally{busy=false;controls();if(running&&!unloading&&lease&&active!==!document.hidden)sync();else schedule();}
 }
 async function start(){if(busy)return;busy=true;$('retry').hidden=true;message('Conectando y preparando el pico…');try{running=true;const data=await api.request('pozo-join');clicks=data.player.clicks||0;accept(data);message('Guardado automático');}catch(e){message(e.message.replace('minerales confirmados','minerales'),true);running=false;$('retry').hidden=false;}finally{busy=false;controls();schedule();}}
 $('upgrade').onclick=()=>sync('pozo-upgrade');$('speed').onclick=()=>sync('pozo-speed');$('sell').onclick=()=>sync('pozo-sell');$('week-claim').onclick=()=>sync('pozo-weekly');$('retry').onclick=start;
 function tap(){const t=performance.now();if(!snapshot||!running||document.hidden||unloading||t-lastTap<100)return;lastTap=t;clicks++;$('scene').classList.remove('manual-hit');void $('scene').offsetWidth;$('scene').classList.add('manual-hit');clearTimeout(hitTimer);hitTimer=setTimeout(()=>$('scene').classList.remove('manual-hit'),180);paint(t);}
 $('scene').onclick=tap;$('scene').onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();tap();}};
 $('chest').onclick=async()=>{if(busy||rewardBusy)return;rewardBusy=true;controls();$('reward-note').textContent='Abriendo el cofre…';try{const data=await sync('pozo-chest');if(!data?.rewardProof)throw new Error('No se pudo abrir el cofre. Puedes reintentarlo.');$('reward-note').textContent='Cofre abierto: +'+data.chest.points+' puntos. Guardando premio…';const reward=await api.claimReward(data.rewardProof);await sync('pozo-chest-ack',{rewardId:data.chest.id});$('reward-note').textContent='¡+'+reward.puntos+' puntos generales guardados!';if(window!==parent&&typeof parent.cargarMarcadores==='function')parent.cargarMarcadores();}catch(e){$('reward-note').textContent=e.message+' El premio seguirá aquí para reintentarlo.';}finally{rewardBusy=false;controls();}};
 $('volver').onclick=()=>{unloading=true;running=false;clearTimeout(timer);if(lease)api.leave('pozo-sync',{lease,active:false,clicks});if(window!==parent)window.frameElement?.closest('dialog')?.close();else location.href='../index.html';};
 document.addEventListener('visibilitychange',()=>{clearTimeout(timer);if(!snapshot)return;sync();});
 window.addEventListener('pagehide',()=>{if(!unloading&&lease)api.leave('pozo-sync',{lease,active:false,clicks});unloading=true;clearTimeout(timer);cancelAnimationFrame(frame);});
 function loop(t){if(t-lastPaint>90){paint(t);lastPaint=t;}frame=requestAnimationFrame(loop);}frame=requestAnimationFrame(loop);start();
})();
