"use strict";
const $=id=>document.getElementById(id);
const api=MuelleConnection;
const name=(localStorage.getItem("jugador_nombre")||(api.local?"Pescador de prueba":"")).trim();
const pendingKey="pescacena:muelle:pending:"+api.identity()+":"+localStorage.getItem("cena_campaign");
const ns="http://www.w3.org/2000/svg";
const rod=$("cast");
let daily=null, album={}, favorite=null, gear=null, shopping=false, ready=false, phase="idle";
let ticket, sim, held=false, changes=[], pending=null, input=null;
let phaseAt=0, time=performance.now(), remainder=0;
let lastCast=0, refreshing=false;
let castPower=0, landed=false, lastCastFrame=0;
const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
const scene=$("dock");
const float=$("float"), splash=$("splash"), line=$("line");
const angler=document.querySelector(".angler");
const rodArt=angler.querySelector(".fishing-rod");
const menuButtons=["open-weekly","open-feed","open-album","open-shop"];
const drawer=$("dock-drawer");
const drawerTabs=[["open-shop","shop-panel"],["open-album","album-panel"],["open-weekly","weekly-panel"]];
function openDrawerPanel(id){
 for(const [button,panel] of drawerTabs){$(panel).hidden=panel!==id;$(button).setAttribute("aria-pressed",String(panel===id));}
 if(id==="shop-panel")renderShop();
 document.querySelector('.drawer-panels').scrollTop=0;
}
for(const [button,panel] of drawerTabs){
 $(button).onclick=()=>openDrawerPanel(panel);
 $(panel).querySelector('header button').onclick=()=>{drawer.open=false;drawer.querySelector('summary').focus();};
}
openDrawerPanel("shop-panel");
drawer.addEventListener("toggle",()=>{
  if(!drawer.open)return;
  renderShop();
  if(innerWidth<=600)drawer.querySelector('summary').scrollIntoView({block:'start',behavior:reducedMotion?'instant':'smooth'});
});
drawer.querySelector('summary').addEventListener('click',event=>{if(phase!=="idle")event.preventDefault();});
drawer.addEventListener('keydown',event=>{if(event.key==="Escape"){drawer.open=false;drawer.querySelector('summary').focus();}});
$("open-feed").onclick=()=>$("feed-panel").showModal();
$("feed-panel").addEventListener("close",()=>$("open-feed").focus());
$("exit").hidden=window===parent;
$("exit").onclick=()=>window.frameElement?.closest("dialog")?.close();
const setHint=message=>{$("hint").textContent=message;};
const network=message=>{$("network").textContent=message;$("network").hidden=!message;};
const svgNode=(tag,attrs={})=>{
  const el=document.createElementNS(ns,tag);
  for(const [key,val] of Object.entries(attrs))el.setAttribute(key,val);
  return el;
};
function beep(){}
const {drawFish}=FishArt;
function item(tag,text,cls){
  const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;
}
function renderAlbum(){
  $("album-count").textContent=Object.keys(album).length+"/"+Pesca.fish.length;
  $("album").replaceChildren(...Pesca.fish.map(f=>{
    const data=album[f.id], card=item("article","","entry");
    card.append(drawFish(f,!!data),item("strong",data?f.name:"Por descubrir"),item("span",f.rarity,"rarity"),
      item("small",f.hint),item("small","Dificultad "+Pesca.difficulty[f.pattern]+" · "+Pesca.motion[f.pattern]),item("small",data?data.count+" capturas · récord de "+data.best+" cm · "+data.perfect+" perfectas":""));
    if(f.day!==undefined)card.append(item("small",Pesca.dayNames[f.day]+(daily?.index===f.day?" · Disponible hoy":""),daily?.index===f.day?"today-fish":"")) ;
    if(f.id==="rodolfo"){
      const preview=item("button","Ver a Rodolfo","secondary");
      preview.onclick=()=>{
        drawer.open=false;
        $("catch-art").replaceChildren(drawFish(f,true));
        $("catch-label").textContent="Ficha de especie";
        $("catch-title").textContent=f.name;
        $("catch-detail").textContent="Ultrararo · "+f.hint;
        $("catch-panel").showModal();
      };
      card.append(preview);
    }
    if(data){
      const b=item("button",favorite===f.id?"Favorito":"Marcar favorito","secondary");
      b.setAttribute("aria-pressed",favorite===f.id);
      b.onclick=async()=>{
        b.disabled=true;
        try{
          const res=await api.request("favorite",{fish:f.id});
          favorite=res.favorite;
          localStorage.setItem("pescacena:muelle:favorite:"+api.identity(),Pesca.find(favorite).name);
          renderAlbum();
          $("album").querySelectorAll("button[aria-pressed=true]")[0]?.focus();
        }catch(err){network(err.message);b.disabled=false;}
      };
      card.append(b);
    }
    return card;
  }));
}
let shopCategory="rod";
const shopCategories=document.querySelectorAll("[data-shop-category]");
for(const button of shopCategories)button.onclick=()=>{
  shopCategory=button.dataset.shopCategory;
  for(const tab of shopCategories)tab.setAttribute("aria-pressed",String(tab===button));
  renderShop();
};
const rodColors={bambu:"#bd915b",aprendiz:"#7ea994",fibra:"#7099be",iridio:"#9d87c0",avanzada:"#8674b0"};
function dressRod(figure,id="bambu"){
 const art=figure.querySelector('.fishing-rod'),color=rodColors[id]||rodColors.bambu;
 art.innerHTML='<path d="M74 73Q84 39 98 12" fill="none" stroke="#19283e" stroke-width="5"/><path d="M74 73Q84 39 98 12" fill="none" stroke="'+color+'" stroke-width="2.8"/><path d="m76 67 5-14" stroke="#35465f" stroke-width="6"/><path d="m77 62 4 1m-2-7 4 1" stroke="#e9d18b" stroke-width="1.3"/><path d="m86 36 4 2m4-17 4 2" stroke-width="1.3"/>'+
 (id==='bambu'?'':'<circle cx="72" cy="62" r="5" fill="'+color+'" stroke-width="2"/><circle cx="72" cy="62" r="2" fill="#f9f7f0" stroke-width="1"/><path d="m68 66-3 2h-2" fill="none" stroke-width="1.8"/>')+
 (id==='avanzada'?'<path d="m92 3 2 3 3 1-3 1-2 3-1-3-3-1 3-1Z" fill="#ecd58c" stroke-width="1"/>':'');
}

function shopIllustration(a){
 const ns="http://www.w3.org/2000/svg", svg=document.createElementNS(ns,"svg");
 svg.setAttribute("viewBox","0 0 120 132");svg.setAttribute("aria-hidden","true");svg.classList.add("item-preview");

 let drawing;
 if(a.type==="rod"){
  const color=rodColors[a.id],advanced=a.id==="avanzada",basic=a.id==="bambu";
  drawing='<ellipse cx="60" cy="121" rx="36" ry="4" fill="#dce5ee" stroke="none"/>'+
   '<path d="M30 109Q51 59 84 18" fill="none" stroke="'+color+'" stroke-width="7"/>'+
   '<path d="M32 104 41 83" stroke="#35465f" stroke-width="10"/>'+
   '<path d="m33 99 7 3m-4-12 7 3" stroke="#e9d18b" stroke-width="2"/>'+
   '<path d="M84 18Q105 56 93 95" fill="none" stroke="#788da4" stroke-width="1.5"/>'+
   '<path d="m93 95-2 8q-6 7-10 0" fill="none" stroke-width="2"/>'+
   '<path d="m52 61 7 4m8-28 6 4m8-22 5 3" stroke-width="2"/>'+
   (basic?'':'<circle cx="50" cy="86" r="11" fill="'+color+'"/><circle cx="50" cy="86" r="5" fill="#f9f7f0"/><path d="m56 92 7 5h5" fill="none" stroke-width="2.5"/>')+
   (advanced?'<path d="m88 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ecd58c" stroke-width="1.4"/><path d="m18 43 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#ecd58c" stroke-width="1.4"/>':'');
 }else{
  const deluxe=a.id==="lujo",wild=a.id==="salvaje", color=deluxe?"#d9bc70":wild?"#86aa91":"#8aa6be";
  drawing='<ellipse cx="60" cy="121" rx="34" ry="4" fill="#dce5ee" stroke="none"/><rect x="27" y="36" width="66" height="78" rx="15" fill="#f7fafc"/><path d="M28 60h64v38H28Z" fill="'+(deluxe?'#faf0d0':wild?'#e4eee3':'#e3edf5')+'" stroke="none"/><rect x="25" y="27" width="70" height="16" rx="5" fill="'+color+'"/><path d="M36 28v12m12-12v12m12-12v12m12-12v12m12-12v12" stroke-width="1.4"/>'+
   (deluxe?'<path d="M45 76q-5-18 13-18 24 1 14 23-7 16-25 7l10-3-9-4 10-3Z" fill="#eaa27f"/><path d="M66 60q3-15 14-9m-16 7q-5-13-11-10" fill="none" stroke-width="2"/>':
    '<path d="M43 83q-10-13 1-19 13-6 12 10-2 15 10 15 15-1 8-14" fill="none" stroke="#cd8994" stroke-width="9"/><path d="m39 69 8-1m0 9 8-2m5 10 3-7m8 6 7-3" stroke="#9b6478" stroke-width="1.4"/>')+
   (wild?'<path d="M75 21Q78 6 94 11q-2 16-19 15Zm0 5 12-11" fill="#86aa91" stroke-width="2"/>':deluxe?'<path d="m96 12 3 6 6 3-6 2-3 6-2-6-6-2 6-3Z" fill="#ecd58c" stroke-width="1.4"/>':'')+
   '<rect x="45" y="98" width="30" height="12" rx="6" fill="'+color+'" stroke="none"/><text x="60" y="107" text-anchor="middle" font-family="system-ui" font-size="10" font-weight="700" fill="#19283e" stroke="none">×5</text>';
 }
 svg.innerHTML='<g stroke="#19283e" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">'+drawing+'</g>';
 return svg;
}
function shopBenefits(a,lvl){
 const box=item("div","","item-benefits");
 if(a.type==="rod"){
  const base=Pesca.start({fish:"sardina",seed:1,version:4,gear:{rod:"bambu",level:lvl}});
  const next=Pesca.start({fish:"sardina",seed:1,version:4,gear:{rod:a.id,level:lvl}});
  const width=Math.round((next.bar/base.bar-1)*100), drain=Math.round((1-next.tuning.loss/base.tuning.loss)*100);
  box.append(item("span",width?"Barra +"+width+"%":"Control básico"));
  if(drain)box.append(item("span","Progreso perdido −"+drain+"%"));
  box.append(item("span",a.id==="aprendiz"?"Solo peces fáciles":a.quantity?"Admite cebo":"Sin cebo"));
 }else{
  box.append(item("span","Paquete de 5 usos"));
  const effects={cebo:"Espera −50%",lujo:"Espera −67% · barra más ancha",salvaje:"Espera −63% · posible captura doble"};
  box.append(item("span",effects[a.id]));
 }
 return box;
}

function renderShop(){
  if(!gear)return;
  const current=Pesca.gearItem(gear.rod), lvl=Pesca.level(gear.xp), category=shopCategory;
  document.querySelector(".shop-help").textContent=({rod:"Mejoras respecto a la caña de bambú, a tu nivel.",bait:"Cada bote trae 5 usos. Se gasta uno por lance.",clothes:"Atuendos que también ven tus compañeros."})[category];
  $("shop-summary").textContent=gear.coins+" monedas · Nivel de pesca "+lvl+" · "+current.name;
  $("shop-items").replaceChildren(...Pesca.catalog.filter(a=>a.type===category).map(a=>{
    const card=item("article","","gear-item");
    const permanent=a.type==="rod"||a.type==="clothes";
    const owned=permanent&&(gear.owned.includes(a.id)||["amarillo","blanco"].includes(a.id));
    const stock=gear.stock[a.id]||0;
    const equipped=(gear.outfit||"blanco")===a.id||gear.rod===a.id||gear.bait===a.id;
    card.append(item("strong",a.name),item("small",a.description),item("small","Nivel "+a.level+" · "+a.cost+" monedas"+(stock?" · Te quedan "+stock+" usos":"")));
    if(a.type!=="clothes"){
      card.classList.add("product-card");
      card.prepend(shopIllustration(a));
      card.append(shopBenefits(a,lvl));
      if(a.type==="bait"&&!current.quantity)card.append(item("small","Para usarlo necesitas una caña de fibra o superior.","compatibility-note"));
    }
    if(a.rarity)card.append(item("small",a.rarity,"rarity"));
    if(a.type==="clothes"){
      const preview=angler.querySelector("svg").cloneNode(true);
      card.classList.add("outfit-card");
      preview.classList.add("clothes-preview");
      colorOutfit(preview,a);
      card.prepend(preview);
    }
    if(a.color&&a.type!=="clothes"){const swatch=item("span","","swatch");swatch.style.backgroundColor=a.color;card.prepend(swatch);}
    const buttons=item("div","","gear-buttons");
    if(!owned&&!a.rewardOnly){
      const buy=item("button",a.type==="bait"?"Comprar 5 · "+a.cost+" monedas":"Comprar · "+a.cost+" monedas");
      buy.disabled=shopping||gear.coins<a.cost||lvl<a.level;
      buy.onclick=()=>trade("buy",a.id);buttons.append(buy);
    }
    if(owned||stock){
      const canEquip=permanent||Boolean(current.quantity);
      const equip=item("button",equipped?(permanent?"En uso":"Quitar"):"Equipar");
      equip.disabled=shopping||!canEquip||(permanent&&equipped);
      equip.onclick=()=>trade("equip",a.id);buttons.append(equip);
    }
    card.append(buttons);return card;
  }));
}
async function trade(action,id){
  if(shopping)return;
  shopping=true;
  renderShop();
  try{
    const data=await api.request("shop",{action,item:id});
    updateGear(data.gear);applyOutfit();
    $("shop-note").textContent=action==="buy"?"Compra guardada.":"Equipo actualizado.";
  }catch(err){$("shop-note").textContent=err.message;}
  finally{shopping=false;renderShop();}
}
function renderDaily(data){
  if(!data)return;
  const changed=daily?.id!==data.id;
  daily=data;
  $("daily-task").textContent=data.label+" · "+data.progress+"/"+data.target+(data.complete?" · ¡Completado!":"");
  $("daily-progress").max=data.target;
  $("daily-progress").value=data.progress;
  $("daily-reward").textContent=(data.complete?"+25 monedas cobradas":"Premio: 25 monedas")+" · Traje Aurora "+Math.min(data.completed,5)+"/5 encargos";
  if(changed){
    const fishToday=Pesca.fish.filter(f=>f.day===data.index).map(f=>f.name);
    $("rotation-today").textContent="Hoy, "+data.name+": "+fishToday.join(", ")+".";
    renderAlbum();
  }
}
function renderWeekly(data){
  const count=data.ids.filter(id=>data.marks[id]).length;
  $("weekly-count").textContent=count+"/5";
  $("weekly-status").textContent=data.open?"Banco especial abierto hasta el lunes.":count+" de 5 especies · se renueva cada lunes";
  $("weekly").replaceChildren(...data.ids.map(id=>{
    const mark=data.marks[id];
    return item("li",Pesca.find(id).name+(mark?" · "+mark.name:""),mark?"done":"");
  }));
  renderButtons();
}
const colorOutfit=(figure,outfit)=>PescaCenaPersonaje.vestir(figure,outfit?.id);
function updateGear(nextGear){
  gear=nextGear;
  $("fishing-level").textContent="Nivel de pesca "+Pesca.level(gear.xp);
  $("coin-balance").textContent=gear.coins+" monedas";
  $("player-stats").hidden=false;
}
function applyOutfit(){
  dressRod(angler,gear?.rod);
  colorOutfit(angler,Pesca.gearItem(gear?.outfit||"blanco"));
}
function renderPresence(data){
  $("presence").textContent=data.count===1?"1 persona pescando":data.count+" personas pescando";
  $("avatars").replaceChildren(...data.peers.map((peer,i)=>{
    const positions=[[22,60],[42,60],[9,60],[32,60],[51,60],[57,60]];
    const avatar=item("div","","peer");
    avatar.style.setProperty("--x",positions[i][0]+"%");
    avatar.style.setProperty("--y",positions[i][1]+"%");
    const svg=document.querySelector(".angler svg").cloneNode(true);
    colorOutfit(svg,Pesca.gearItem(peer.outfit||"blanco"));
    dressRod(svg,peer.rod||"bambu");
    avatar.title=peer.name;
    avatar.append(svg,item("span",peer.name));return avatar;
  }));
  const lines=data.feed.slice(0,5).map(row=>{
    const fish=Pesca.find(row.fish);
    return item("li",row.name+" · "+fish.name+" de "+row.cm+" cm"+(row.record?" · récord personal":""));
  });
  const latest=data.feed[0];
  $("news-preview").textContent=latest?latest.name+" acaba de pescar "+Pesca.find(latest.fish).name.toLocaleLowerCase("es")+".":"Noticias del muelle";
  $("feed").replaceChildren(...(lines.length?lines:[item("li","Todavía no hay capturas destacadas.")]));
  renderDaily(data.daily);renderWeekly(data.weekly);
}
async function refresh(){
  if(!ready||document.hidden||refreshing)return;
  refreshing=true;
  try{
    const data=await api.request("presence",{active:Date.now()-lastCast<90000});
    renderPresence(data);
    if(!pending)network("");
  }catch{
    $("presence").textContent="Presencia sin actualizar";
    $("avatars").replaceChildren();
    network("Se ha perdido la conexión con el muelle. Volveremos a intentarlo.");
  }finally{refreshing=false;}
}
function renderButtons(){
  for(const id of menuButtons)$(id).disabled=["charging","launching","waiting","bite","fight"].includes(phase);
}
function setPhase(value,label){
  phase=value;phaseAt=performance.now();
  scene.dataset.phase=value;
  setHint(label);
  rod.setAttribute("aria-disabled",String(!ready||["launching","waiting","saving","retry"].includes(value)));
  $("fight").hidden=value!=="fight";
  $("power").hidden=value!=="charging";
  const showLine=["launching","waiting","bite","fight"].includes(value);
  line.hidden=float.hidden=!showLine;
  if(!showLine)splash.hidden=true;
  float.classList.toggle("bite",value==="bite");
  $("retry").hidden=value!=="retry";
  renderButtons();
}
function drawCast(t){
  const rect=scene.getBoundingClientRect(), matrix=rodArt.getScreenCTM();
  if(!matrix||!rect.width||!rect.height)return;
  const tip=new DOMPoint(98,12).matrixTransform(matrix);
  const x0=tip.x-rect.left-scene.clientLeft, y0=tip.y-rect.top-scene.clientTop;
  const elapsed=Math.max(0,t-phaseAt);
  const tug=reducedMotion?0:phase==="bite"?3+3*Math.sin(elapsed/44):phase==="waiting"?1.35*Math.sin(elapsed/450):0;
  const x1=rect.width*(.77+castPower*.17), y1=rect.height*(.65+castPower*.10)+tug;
  const flight=phase==="launching"?Math.min(1,Math.max(0,(t-phaseAt)/480)):1;
  const q=reducedMotion?1:flight;
  const x=x0+(x1-x0)*q;
  const y=y0+(y1-y0)*q-Math.sin(Math.PI*q)*Math.min(87,rect.height*.15);
  float.style.left=x+"px";float.style.top=y+"px";
  line.setAttribute("viewBox","0 0 "+rect.width+" "+rect.height);
  line.firstElementChild.setAttribute("d",`M ${x0} ${y0} Q ${(x0+x)/2} ${(y0+y)/2-17*q} ${x} ${y}`);
  if(!landed&&q===1){
    landed=true;splash.style.left=x1+"px";splash.style.top=y1+"px";
    splash.hidden=false;beep(305);
  }
}
function idle(){
  held=false;input=null;
  $("power").value=0;
  setPhase("idle","Mantén y suelta para lanzar");
}
function powerAt(t){
  const period=((t-phaseAt)%2300)/1150;
  return Math.max(.06,period>1?2-period:period);
}
async function cast(power){
  castPower=power;landed=false;splash.hidden=true;ticket=null;
  setPhase("launching","Lanzando…");
  drawCast(performance.now());
  const values={power:Math.round(power*100),id:api.hex(16)};
  try{
    let result;
    try{result=await api.request("cast",values);}
    catch(error){if(error.code)throw error;result=await api.request("cast",values);}
    ticket=result.ticket;updateGear(result.gear);lastCast=Date.now();
    refresh();
  }catch(err){idle();setHint(err.message);}
}
function beginFight(){
  sim=Pesca.start(ticket);changes=[];held=false;remainder=0;
  setPhase("fight","Mantén para subir · suelta para bajar");
  setHeld(true);
  paint();
  beep(390);
}
function setHeld(value){
  if(held===value||phase!=="fight")return;
  held=value;
  if(changes.at(-1)===sim.tick)changes.pop();else changes.push(sim.tick);
}
function down(id){
  if(input!==null||!ready)return;
  if(drawer.open)drawer.open=false;
  if(phase==="idle"){
    input=id;setPhase("charging","Suelta para lanzar");
    return;
  }
  if(phase==="bite"){
    if(ticket.loot)submitResult(0,[]);
    else{input=id;beginFight();}
    return;
  }
  if(phase==="fight"){input=id;setHeld(true);}
}
function up(id,canceled=false){
  if(input!==id)return;
  input=null;
  if(phase==="charging"){if(canceled)idle();else cast(powerAt(performance.now()));}
  if(phase==="fight")setHeld(false);
}
rod.addEventListener("pointerdown",e=>{
  if(e.button!==0)return;
  e.preventDefault();rod.focus({preventScroll:true});
  rod.setPointerCapture(e.pointerId);down(e.pointerId);
});
rod.addEventListener("pointerup",e=>up(e.pointerId));
rod.addEventListener("pointercancel",e=>up(e.pointerId,true));
rod.addEventListener("lostpointercapture",e=>up(e.pointerId,true));
document.addEventListener("keydown",e=>{
  const controls=e.target===rod||(e.target===document.body&&e.code==="Space");
  if(!controls||!["Space","Enter"].includes(e.code))return;
  e.preventDefault();if(!e.repeat)down(e.code);
});
document.addEventListener("keyup",e=>{if(input===e.code){e.preventDefault();up(e.code);}});
rod.addEventListener("click",e=>{
  if(e.detail!==0)return;
  if(input==="assistive")up(input);else down("assistive");
});
window.addEventListener("blur",()=>{if(input!==null)up(input,true);});
function paint(){
  $("catch-bar").style.top=sim.pos/Pesca.HEIGHT*100+"%";
  $("catch-bar").style.height=sim.bar/Pesca.HEIGHT*100+"%";
  $("fish-marker").style.top=sim.fishY/Pesca.HEIGHT*100+"%";
  $("progress").value=sim.progress;
}
function submitResult(ticks,changes){
  pending={id:ticket.id,ticks,changes};
  localStorage.setItem(pendingKey,JSON.stringify(pending));
  saveResult();
}
function showFind(loot){
  $("catch-art").replaceChildren(item("span",({basura:"♻",etiqueta:"▱",periodico:"▤",monedas:"◉"})[loot.id],"find-icon"));
  $("catch-label").textContent="Hallazgo del muelle";
  $("catch-title").textContent=loot.name;
  $("catch-detail").textContent=loot.detail+(loot.coins?" +"+loot.coins+" monedas.":"");
  $("catch-panel").showModal();
  beep(loot.coins?695:315);
}
function showEscape(detail){
  $("catch-art").replaceChildren(item("span","↝","find-icon"));
  $("catch-label").textContent="Sedal vacío";
  $("catch-title").textContent="¡Se escapó!";
  $("catch-detail").textContent=detail;
  $("catch-panel").showModal();
  beep(195);
}
async function saveResult(){
  if(!pending)return;
  setPhase("saving","Comprobando la captura…");
  try{
    const data=await api.request("finish",pending);
    pending=null;localStorage.removeItem(pendingKey);
    album=data.album;updateGear(data.gear);renderDaily(data.daily);renderWeekly(data.weekly);renderAlbum();
    idle();
    if(data.loot)showFind(Pesca.findLoot(data.loot));
    else if(data.caught){
      const fish=Pesca.find(data.fish);
      $("catch-art").replaceChildren(drawFish(fish,true));
      $("catch-label").textContent=data.first?"Nueva especie":data.perfect?"Captura perfecta":"¡Buena pesca!";
      $("catch-title").textContent=fish.name;
      $("catch-detail").textContent=data.cm+" cm · "+fish.rarity+(data.perfect&&data.first?" · perfecta":"")+(data.quantity>1?" · captura doble":"")+(data.coins?" · +"+data.coins+" monedas":"");
      $("catch-panel").showModal();
      beep(695);
    }else{
      showEscape("El pez se soltó del anzuelo.");
    }
    if(data.dailyReward)$("catch-detail").textContent+=" · Encargo completado: +"+data.dailyReward.coins+" monedas"+(data.dailyReward.outfit?" y Traje Aurora":"");
    refresh();
  }catch(error){
    if(["expired","replay","guest"].includes(error.code)){
      pending=null;localStorage.removeItem(pendingKey);idle();setHint(error.message);return;
    }
    setPhase("retry","Guardado pendiente. Reintenta al volver la conexión.");
  }
}
$("retry").onclick=saveResult;
function loop(t){
  const dt=Math.min(t-time,100);time=t;
  if(phase==="charging")$("power").value=powerAt(t);
  if(!line.hidden&&(!landed||(!reducedMotion&&t-lastCastFrame>=30))){
    drawCast(t);
    lastCastFrame=t;
  }
  if(phase==="launching"&&ticket&&t-phaseAt>=480)setPhase("waiting","El sedal está en el agua…");
  if(phase==="waiting"&&t-phaseAt>=ticket.biteMs){
    setPhase("bite","¡Ha picado! Toca ahora");
    beep(675,"sine");
  }
  if(phase==="bite"&&t-phaseAt>1650){
    idle();showEscape("No recogiste el sedal a tiempo.");
  }
  if(phase==="fight"&&!document.hidden){
    remainder+=dt;
    while(remainder>=1000/60&&!sim.result){Pesca.step(sim,held);remainder-=1000/60;}
    paint();
    if(sim.result){
      submitResult(sim.tick,changes);
    }
  }
  requestAnimationFrame(loop);
}
async function join(){
  if(!name){setHint("Abre el muelle desde la Sala de juegos de PescaCena.");return;}
  try{
    const data=await api.request("join",{name});
    ready=true;album=data.album;favorite=data.favorite;updateGear(data.gear);
    if(favorite)localStorage.setItem("pescacena:muelle:favorite:"+api.identity(),Pesca.find(favorite).name);
    applyOutfit();renderDaily(data.daily);renderAlbum();renderWeekly(data.weekly);idle();refresh();
    try{pending=JSON.parse(localStorage.getItem(pendingKey)||"null");}catch{}
    if(pending)saveResult();
  }catch(err){
    setHint(err.message);
    if(api.endpoint){
      $("retry").hidden=false;
      $("retry").textContent="Volver a conectar";
      $("retry").onclick=()=>{$("retry").hidden=true;$("retry").textContent="Reintentar guardado";$("retry").onclick=saveResult;join();};
    }
  }
}
$("catch-panel").addEventListener("close",()=>rod.focus({preventScroll:true}));
renderAlbum();join();
document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh();});
window.addEventListener("resize",()=>{if(!line.hidden)drawCast(performance.now());});
setInterval(refresh,30000);
requestAnimationFrame(loop);


