"use strict";
const $=id=>document.getElementById(id);
const api=MuelleConnection;
const displayName=(localStorage.getItem("jugador_nombre")||(api.local?"Pescador de prueba":"")).trim();
const pageSize=6;
let view, page=0, selected=null, busy=false, timer;
let gesture=null, suppressClickUntil=0, lastScene="";
const tank=$("tank");
const zones=["Entrada","Entre algas","Aguas abiertas","El fondo"];
const lanes=[[15,22,32],[54,38,-31],[21,54,39],[57,70,-39],[14,84,37],[63,15,-35]];

function textNode(tag,value){
  const element=document.createElement(tag);
  element.textContent=value;
  return element;
}

function portrait(fish,hat){
  const frame=document.createElement("span");
  frame.className="fish-portrait";
  frame.classList.toggle("rodolfo",fish.id==="rodolfo");
  frame.append(FishArt.drawFish(fish,true));
  if(hat&&hat!=="none"){
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.classList.add("fish-hat");
    svg.setAttribute("viewBox","0 0 30 30");
    svg.setAttribute("aria-hidden","true");
    const paths={
      birthday:[["M4 26 13 5 25 26Z","#e583a0"],["M8 17l12 1 2 4-16-1Z","#f7d775"],["M11 5a3 3 0 1 1 6 0 3 3 0 0 1-6 0","#f7d775"]],
      captain:[["M3 20q1-12 12-12t12 12Z","#f9f6e8"],["M3 19h24v5H3Z","#233e65"],["M12 15h6v3h-6Z","#e8ba55"]],
      crown:[["m3 8 7 6 5-9 5 9 7-6-4 16H7Z","#f5cc64"],["M8 20h14v2H8Z","#bc782d"]]
    };
    for(const [d,color] of paths[hat]||[]){
      const path=document.createElementNS(svg.namespaceURI,"path");
      path.setAttribute("d",d);path.setAttribute("fill",color);svg.append(path);
    }
    frame.append(svg);
  }
  return frame;
}

function renderTank(){
  const residents=view.residents;
  const pages=Math.max(1,Math.ceil(residents.length/pageSize));
  page=Math.min(page,pages-1);
  $("status").textContent=residents.length===1?"1 pez en el acuario":residents.length+" peces en el acuario";
  const current=residents.slice(page*pageSize,(page+1)*pageSize);
  const sceneKey=JSON.stringify([page,current.map(({id,fish,hat,name})=>[id,fish,hat,name])]);
  if(sceneKey!==lastScene){
    lastScene=sceneKey;
    tank.replaceChildren();
    if(!residents.length){
      const empty=textNode("p","Todavía no hay peces compartidos. Elige «Mostrar en el Acuario» en el álbum de El Muelle.");
      empty.className="empty";$("tank").append(empty);
    }
    for(const [i,entry] of current.entries()){
      const fish=Pesca.find(entry.fish);
      const button=document.createElement("button");
      button.className="resident";
      const [x,y,travel]=lanes[i];
      button.style.setProperty("--x",x+"%");
      button.style.setProperty("--y",y+"%");
      button.style.setProperty("--travel",travel+"cqw");
      button.style.setProperty("--facing",travel>0?"-1":"1");
      button.style.setProperty("--swim-time",(14+i*2.1)+"s");
      button.style.setProperty("--swim-delay",(-i*1.65)+"s");
      button.setAttribute("aria-label",fish.name+" de "+entry.name);
      const label=textNode("span",entry.name);label.className="fish-tag";
      button.append(portrait(fish,entry.hat),label);
      button.onclick=()=>{selected=entry.id;renderInfo();$("info").showModal();};
      $("tank").append(button);
    }
  }
  $("toggle-motion").hidden=!residents.length;
  document.querySelector(".pages").hidden=pages<=1;
  $("explore-hint").textContent=pages>1?"Desliza para explorar. Toca un pez para conocerlo.":"Toca un pez para conocerlo.";
  $("page").textContent=(page+1)+" / "+pages+" · "+(zones[page]||"Zona "+(page+1));
  $("prev").disabled=page===0;
  $("next").disabled=page===pages-1;
}
function renderInfo(){
  const entry=view.residents.find(row=>row.id===selected);
  if(!entry)return;
  const fish=Pesca.find(entry.fish), fed=view.fed.includes(entry.id);
  $("portrait").replaceChildren(portrait(fish,entry.hat));
  $("fish-title").textContent=fish.name;
  $("owner").textContent="Pez de "+entry.name;
  $("details").replaceChildren();
  for(const [label,value] of [
    ["Nivel de pesca",entry.level],["Especies en el álbum",entry.species],
    ["Récord de tamaño",entry.best+" cm"],["Raciones recibidas",entry.portions]
  ])$("details").append(textNode("dt",label),textNode("dd",String(value)));
  $("feed").textContent=fed?"Ya le diste de comer hoy":"Dar de comer";
  $("feed").disabled=fed||busy;
}
function renderOutfit(){
  const fish=Pesca.find(view.favorite);
  if(fish)$("outfit-preview").replaceChildren(portrait(fish,$("hat").value));
}
function openSettings(){
  const fish=Pesca.find(view.favorite);
  $("favorite-label").textContent=fish?.name||"Aún no has elegido un pez para el Acuario";
  $("no-favorite").hidden=!!fish;
  $("aquarium-settings").hidden=!fish;
  $("settings-status").textContent="";
  if(fish){
    $("hat").value=view.hat;
    $("visible").checked=view.visible;
    renderOutfit();
  }
  $("settings").showModal();
}

function movePage(direction){
  if(!view)return;
  const last=Math.ceil(view.residents.length/pageSize)-1;
  const next=page+direction;
  if(next<0||next>last)return;
  page=next;
  renderTank();
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    tank.animate([{transform:"translateX("+(direction*16)+"px)",opacity:.55},{transform:"translateX(0)",opacity:1}],{duration:260,easing:"ease-out"});
  }
}
$("prev").onclick=()=>movePage(-1);
$("next").onclick=()=>movePage(1);
const glass=document.querySelector(".glass");
glass.addEventListener("pointerdown",event=>{
  if(!event.isPrimary||event.button!==0||event.target.closest("#toggle-motion"))return;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY};
});
glass.addEventListener("pointerup",event=>{
  if(gesture?.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x, dy=event.clientY-gesture.y;
  gesture=null;
  if(Math.abs(dx)<44||Math.abs(dx)<Math.abs(dy)*1.35)return;
  suppressClickUntil=performance.now()+400;
  movePage(dx<0?1:-1);
});
glass.addEventListener("pointercancel",()=>{gesture=null;});
glass.addEventListener("click",event=>{
  if(event.detail&&performance.now()<suppressClickUntil){
    event.preventDefault();event.stopPropagation();
  }
},true);
$("toggle-motion").onclick=()=>{
  const paused=glass.classList.toggle("still");
  const action=paused?"Reanudar":"Pausar";
  $("toggle-motion").setAttribute("aria-pressed",String(paused));
  $("toggle-motion").setAttribute("aria-label",action+" el movimiento de los peces");
  $("toggle-motion").title=action+" movimiento";
  $("toggle-motion").firstElementChild.textContent=paused?"▶":"Ⅱ";
};
$("open-settings").onclick=openSettings;
$("hat").onchange=renderOutfit;
for(const [id,label] of Object.entries(Pesca.fishHats)){
  const option=textNode("option",label);option.value=id;$("hat").append(option);
}
$("feed").onclick=async()=>{
  if(busy)return;
  busy=true;renderInfo();
  try{
    view=await api.request("aquarium-feed",{player:selected});
    $("feed-status").textContent="Le has dado una ración.";
    $("info").classList.remove("fed-now");
    requestAnimationFrame(()=>$("info").classList.add("fed-now"));
    renderTank();
  }catch(error){$("feed-status").textContent=error.message;}
  finally{busy=false;renderInfo();}
};
$("info").addEventListener("close",()=>{$("feed-status").textContent="";});
$("aquarium-settings").onsubmit=async event=>{
  event.preventDefault();
  if(busy)return;
  busy=true;$("save").disabled=true;
  try{
    view=await api.request("aquarium-save",{visible:$("visible").checked,hat:$("hat").value});
    renderTank();$("settings").close();
  }catch(error){$("settings-status").textContent=error.message;}
  finally{busy=false;$("save").disabled=false;}
};
async function load(){
  if(document.hidden||busy||$("info").open||$("settings").open)return;
  busy=true;
  try{view=await api.request("aquarium");renderTank();$("open-settings").disabled=false;}
  catch(error){$("status").textContent=error.message;}
  finally{busy=false;}
}
async function start(){
  if(!displayName){$("status").textContent="Entra en PescaCena para visitar el acuario.";return;}
  try{
    await api.request("join",{name:displayName});
    await load();
    timer=setInterval(load,30000);
  }catch(error){$("status").textContent=error.message;}
}
window.addEventListener("pagehide",event=>{if(!event.persisted)clearInterval(timer);});
start();

