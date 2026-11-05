(() => {
  if(!window.MuelleConnection?.endpoint)return;
  const home=document.getElementById("muelle-home");
  const entry=document.getElementById("muelle-entry");
  const lobby=document.getElementById("pantalla-lobby");
  const dialog=document.getElementById("muelle-dialog");
  const frame=dialog.querySelector("iframe");
  const profile=document.getElementById("muelle-favorite");
  const origin={button:null};
  for(const b of [home,entry])b.dataset.feature="juegos";
  function refreshFavorite(){
    const name=localStorage.getItem("pescacena:muelle:favorite");
    profile.hidden=!name;
    document.getElementById("muelle-favorite-name").textContent=name||"";
  }
  let last=0;
  async function refreshHome(force=false){
    if(home.hidden||!lobby.classList.contains("active")||(!force&&Date.now()-last<60000))return;
    last=Date.now();
    const target=document.getElementById("muelle-home-status");
    try{
      const {weekly}=await MuelleConnection.request("weekly");
      const n=weekly.ids.filter(id=>weekly.marks[id]).length;
      target.textContent=weekly.open?"¡Banco especial abierto!":n+" de 5 especies donadas esta semana";
    }catch{target.textContent="El encargo está sin actualizar";}
  }
  for(const button of [home,entry])button.addEventListener("click",()=>{
    if(button.hidden||!lobby.classList.contains("active")||!localStorage.getItem("jugador_nombre")||dialog.open)return;
    origin.button=button;
    frame.src="./muelle/index.html";
    dialog.showModal();
  });
  dialog.addEventListener("close",()=>{
    frame.removeAttribute("src");
    refreshFavorite();
    refreshHome(true);
    origin.button?.focus();
  });
  new MutationObserver(()=>refreshHome()).observe(home,{attributes:true,attributeFilter:["hidden"]});
  new MutationObserver(()=>refreshHome()).observe(lobby,{attributes:true,attributeFilter:["class"]});
  window.addEventListener("storage",refreshFavorite);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshHome();});
  setInterval(()=>{if(!document.hidden&&!dialog.open)refreshHome();},60000);
  refreshFavorite();
})();
