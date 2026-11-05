'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let gear,avatar,filter='owned',busy=false,progression={fish:0,mine:0,commemorations:{}};
 const from=new URLSearchParams(location.search).get('from');
 if(from==='muelle'||from==='pozo'){$('volver').href=from==='pozo'?'pozo.html':'index.html';$('volver').textContent=from==='pozo'?'← El Pozo':'← El Muelle';}
 else $('volver').onclick=event=>{if(window!==parent){event.preventDefault();window.frameElement?.closest('dialog')?.close();}};
 const el=(tag,text)=>{const n=document.createElement(tag);n.textContent=text;return n;};
 function status(text,error=false){$('estado').textContent=text;$('estado').dataset.error=error;}
 function render(){
  const outfit=gear.outfit||'blanco',level=Pesca.level(gear.xp),owned=id=>gear.owned.includes(id)||['blanco','amarillo'].includes(id);
  $('personaje').replaceChildren(PescaCenaPersonaje.crear({outfit}));
  $('ropa-actual').textContent=Pesca.gearItem(outfit)?.name||'Tu personaje';
  $('saldo').textContent=gear.coins+' monedas de pesca';$('nivel').textContent='Nivel de pesca '+level;
  const items=Pesca.catalog.filter(p=>p.type==='clothes'&&(filter==='owned'?owned(p.id):!owned(p.id)));
  $('prendas').replaceChildren(...items.map(p=>{
   const row=el('article','');row.className='prenda';row.append(PescaCenaPersonaje.crear({outfit:p.id}));
   const body=el('div','');body.append(el('h3',p.name),el('p',p.description));
   const have=owned(p.id),equipped=outfit===p.id;
   const condition=el('p',have?'En tu armario':p.source==='week'?'Completad el encargo semanal de El Pozo':p.source==='weekFish'?'Aporta al encargo semanal de El Muelle y abrid el banco':p.source==='mine'?'Excava '+p.target+' bloques personales':p.source==='fish'?'Consigue '+p.target+' capturas':p.rewardOnly?'Se gana completando cinco encargos diarios':p.cost+' monedas · Nivel '+p.level);condition.className='condicion';body.append(condition);
   if(!have&&['mine','fish'].includes(p.source)){const count=progression[p.source]||0;body.append(el('p',Math.min(count,p.target)+' / '+p.target+(p.source==='mine'?' bloques':' capturas')));const bar=el('progress','');bar.max=p.target;bar.value=count;bar.setAttribute('aria-label','Progreso para conseguir '+p.name);body.append(bar);}
   if(['week','weekFish'].includes(p.source)&&have){const weeks=Object.entries(progression.commemorations||{}).filter(([,c])=>c.outfit===p.id).map(([date])=>date.slice(0,10).split('-').reverse().join('/'));if(weeks.length)body.append(el('p','Expediciones del '+weeks.join(' · ')));}
   if(!have&&!p.rewardOnly&&(level<p.level||gear.coins<p.cost))body.append(el('p',level<p.level?'Disponible al alcanzar el nivel '+p.level:'Te faltan '+(p.cost-gear.coins)+' monedas'));
   if(have||!p.rewardOnly){const button=el('button',have?(equipped?'Puesto':'Ponérmelo'):'Comprar · '+p.cost);button.type='button';button.disabled=busy||equipped||(!have&&(level<p.level||gear.coins<p.cost));button.onclick=()=>trade(have?'equip':'buy',p.id);body.append(button);}
   row.append(body);return row;
  }));
  if(!items.length)$('prendas').append(el('p',filter==='owned'?'Todavía no tienes prendas.':'Ya tienes todas las prendas del catálogo.'));
 }
 async function trade(action,id){
  if(busy)return;busy=true;render();status(action==='buy'?'Guardando compra…':'Guardando tu ropa…');
  try{const data=await MuelleConnection.request('shop',{action,item:id});gear=data.gear;avatar=data.avatar;status(action==='buy'?'Compra guardada. Ya está en «Tu ropa».':'Ropa guardada para tus próximos juegos.');}
  catch(e){status(e.message,true);}finally{busy=false;render();}
 }
 for(const b of document.querySelectorAll('[data-filter]'))b.onclick=()=>{filter=b.dataset.filter;for(const tab of document.querySelectorAll('[data-filter]'))tab.setAttribute('aria-pressed',String(tab===b));if(gear)render();};
 async function load(){if(busy)return;busy=true;$('reintentar').hidden=true;status('Cargando vestuario…');try{const d=await MuelleConnection.request('join');gear=d.gear;avatar=d.avatar;progression=d.progression||progression;render();status('');}catch(e){status(e.message,true);$('reintentar').hidden=false;}finally{busy=false;if(gear)render();}}
 $('reintentar').onclick=load;load();
})();
