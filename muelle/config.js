window.PESCACENA_ACCOUNTS_URL="https://script.google.com/macros/s/AKfycbz6hUW4cvIsLCMJzEvFIScnWIRjywlznrSvM-tJ3zH3jbQPaop8tO7lVuZHndRS1_Ut8A/exec";
/* La identidad procede de la sesión de PescaCena y del ticket firmado por el servidor. */
window.MuelleConnection=(()=>{
  const local=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const accountsUrl=local?'/cuentas-api':window.PESCACENA_ACCOUNTS_URL;
  const identity=()=>localStorage.getItem('pesca_cuenta_id')||'';
  const hex=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),b=>b.toString(16).padStart(2,'0')).join('');
  let opening=null;
  let renewal=null;
  const campaign=()=>localStorage.getItem('cena_campaign')||'';
  const storageKey=()=> 'pescacena:muelle:acceso:'+identity()+':'+campaign();
  function planRenewal(data){
    clearTimeout(renewal);
    const delay=Math.max(1000,data.exp*1000-Date.now()-60000-Math.random()*40000);
    renewal=setTimeout(()=>{
      if(document.hidden)return;
      access(true).catch(()=>{renewal=setTimeout(()=>{if(!document.hidden)access(true).catch(()=>{});},30000);});
    },delay);
  }
  async function access(force=false){
    if(!identity()||!localStorage.getItem('pesca_sesion'))throw new Error('Entra en PescaCena para abrir El Muelle.');
    if(!force){
      try{const saved=JSON.parse(sessionStorage.getItem(storageKey()));if(saved?.exp>Date.now()/1000+30){planRenewal(saved);return saved;}}catch{}
    }
    if(opening)return opening;
    const id=identity(),sesion=localStorage.getItem('pesca_sesion'),ronda=campaign();
    opening=(async()=>{
      const res=await fetch(accountsUrl,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({accion:'Acceso Muelle',sesion}),signal:AbortSignal.timeout(20000)});
      if(!res.ok)throw new Error('No se pudo comprobar tu acceso al muelle.');
      const data=await res.json();
      if(!data.ok)throw new Error(data.mensaje||'No se pudo abrir El Muelle.');
      if(id!==identity()||sesion!==localStorage.getItem('pesca_sesion')||ronda!==campaign())throw new Error('Tu sesión cambió. Abre El Muelle otra vez.');
      const url=new URL(data.url);
      if(url.protocol!=='https:'&&!(local&&url.origin==='http://127.0.0.1:8793'))throw new Error('La conexión del muelle no está configurada.');
      sessionStorage.setItem(storageKey(),JSON.stringify(data));planRenewal(data);return data;
    })().finally(()=>{opening=null;});
    return opening;
  }
  async function request(op,values={}){
    const pendingKey='pescacena:muelle:operacion:'+identity()+':'+campaign();
    const signature=JSON.stringify({op,...values});
    let requestId=hex(16);
    if(op==='shop'){
      try{const pending=JSON.parse(sessionStorage.getItem(pendingKey));if(pending?.signature===signature)requestId=pending.id;}catch{}
      sessionStorage.setItem(pendingKey,JSON.stringify({signature,id:requestId}));
    }
    let credentials=await access();
    for(let attempt=0;attempt<2;attempt++){
      let res;
      try{
        res=await fetch(credentials.url,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({...values,op,requestId,ticket:credentials.ticket}),signal:AbortSignal.timeout(12000)});
      }catch(error){if(attempt===0)continue;throw new Error('No se pudo confirmar la operación. Puedes reintentar.');}
      if(res.status===401&&attempt===0){credentials=await access(true);continue;}
      const data=await res.json();
      if(op==='shop'&&res.status<500)sessionStorage.removeItem(pendingKey);
      if(!data.ok)throw Object.assign(new Error(data.message||'No se pudo completar la operación.'),{code:data.code});
      return data;
    }
    throw new Error('Vuelve a abrir El Muelle para renovar tu sesión.');
  }
  return {request,hex,local,endpoint:'nube',identity};
})();
