'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let gear,avatar,filter='owned',busy=false;
 const fromMuelle=new URLSearchParams(location.search).get('from')==='muelle';
 if(fromMuelle){$('volver').href='index.html';$('volver').textContent='← El Muelle';}
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
   const condition=el('p',have?'En tu armario':p.rewardOnly?'Se gana completando cinco encargos diarios':p.cost+' monedas · Nivel '+p.level);condition.className='condicion';body.append(condition);
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
 async function load(){if(busy)return;busy=true;$('reintentar').hidden=true;status('Cargando vestuario…');try{const d=await MuelleConnection.request('join');gear=d.gear;avatar=d.avatar;render();status('');}catch(e){status(e.message,true);$('reintentar').hidden=false;}finally{busy=false;if(gear)render();}}
 $('reintentar').onclick=load;load();
})();
