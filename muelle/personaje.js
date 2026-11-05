const RopaMinaArt={
 casco:{hat:'M11 28Q10 5 40 5t29 23l5 5H7Z',details:'<path d="M40 7v16M17 27h46"/><rect x="30" y="15" width="20" height="14" rx="4" fill="#58738b"/><circle cx="40" cy="22" r="5" fill="#fff0ac"/><path d="M26 67v30m28-30v30M23 81h34" stroke="#ecdd9a" stroke-width="5"/><rect x="30" y="76" width="19" height="14" rx="2" fill="#546a81"/>'},
 rescate:{hat:'M11 28Q11 6 40 6t29 22l4 6H7Z',hatColor:'#edb65c',details:'<rect x="31" y="15" width="18" height="14" rx="4" fill="#faf1c8"/><path d="M40 17v10m-5-5h10" stroke="#be6057"/><path d="M25 68v26m29-26v26M23 83h34" stroke="#f2eab2" stroke-width="5"/>'},
 mecanico:{hat:'M13 25Q13 8 39 8q25 0 26 17l12 8H38Z',details:'<path d="M28 64v21h24V64M28 84v13m23-13v13" fill="#c7d4d8"/><path d="m45 77 8-9 4 2-7 9m-5-1 3 3" stroke="#f2d388" stroke-width="4"/><circle cx="29" cy="68" r="2" fill="#f2d388"/>'},
 rana:{hat:'M10 30Q6 13 21 12 18-3 30 0q10 0 10 14Q43 0 55 1q13 3 8 14 11 4 8 16l-14-4q-17-8-33 1Z',details:'<circle cx="29" cy="9" r="5" fill="#fff"/><circle cx="53" cy="10" r="5" fill="#fff"/><path d="M29 7v3m24-2v3"/><ellipse cx="40" cy="84" rx="14" ry="13" fill="#e0d6a0"/><path d="M23 100h18m3 0h16" stroke="#688c5c" stroke-width="5"/>'},
 cangrejo:{hat:'M11 30Q7 10 40 12q32-2 30 18l-15-5q-16-6-31 1Z',back:'M21 71 3 63 1 49l9 4 7-9 4 17 8 10M57 69 78 58 79 43l-9 7-7-7-2 20Z',details:'<path d="M27 15 24 2m29 13 4-13"/><circle cx="24" cy="3" r="4" fill="#fff"/><circle cx="57" cy="3" r="4" fill="#fff"/><path d="M24 82h33m-34 8h34" stroke="#ae654f"/>'},
 pinguino:{hat:'M12 31Q6 8 39 7q31 0 30 24L55 25 48 29l-9-7-9 7-9-4Z',hatColor:'#46566b',back:'M23 64 8 91l14-5M57 64l14 27-14-5Z',details:'<path d="M31 16 40 12l9 4-9 8Z" fill="#edbe64"/><path d="M30 69Q40 65 50 69l6 26H24Z" fill="#fff9e7"/><path d="m31 68 9 6 9-6-1 10-8-4-9 4Z" fill="#bd6470"/>'},
 topo:{hat:'M9 31V16Q12 2 39 2q30 0 32 16v15l-15-8q-15-9-33 1Z',hatColor:'#ba8b70',details:'<ellipse cx="40" cy="15" rx="9" ry="5" fill="#df9d9e"/><path d="M27 13h1m24 0h1" stroke-width="4"/><path d="M25 85q15-9 31 0" stroke="#9d725a"/><path d="m24 102-5 8m10-8-2 9m25-9 5 8" stroke="#d5c9b4"/>'},
 roca:{hat:'M9 29 5 18 18 4 39 0 61 6 73 22 66 32 54 24 41 22 23 29Z',hatColor:'#a5aaa8',back:'M25 65 7 60 2 70 14 83 22 78M55 65l17-7 10 11-8 16-16-5Z',details:'<path d="m16 17 11-6 10 5 13-7 12 9M23 75l11 6 14-9 10 13-16 9-18-6Z" fill="none" stroke="#737e83"/>'},
 gemas:{hat:'M11 29Q10 9 39 10 68 8 69 30l-13-5-17-5-16 8Z',back:'M22 65 9 49 3 64l12 24M57 67l13-17 8 19-14 25Z',details:'<path d="m23 15 2-17 12 10-4 15Zm16-1 8-21 7 21-8 13Zm14 5 13-14 2 20-11 7Z" fill="#bbdfe4" stroke="#648aab" stroke-width="2"/><path d="m33 75 8-6 9 9-9 13Z" fill="#b8e0e4"/>'},
 dragon:{hat:'M9 30 12 11 17-8 31 8 45 6 62-8 65 15 73 30 56 25 48 30 39 22 27 30 20 24Z',back:'M54 65q32 4 23 33l-11-8-1 19-16-13Z',details:'<path d="m14 15 7-9 7 13m27-2 6-11 5 15" fill="#6f8871"/><path d="m32 74 9-7 11 8-10 8Zm0 14 10-5 10 8-11 7Z" fill="#506f77"/>'},
 abisal:{hat:'M8 30 17 13 14 0 30 7 40-4 51 8 68 0 62 17 73 30 57 25 41 21 23 28Z',back:'M23 63Q5 75 8 106l14-6 16 13 22-10-5-39Z',details:'<path d="M29 16h21M24 74l17-8 14 9-15 14Z" fill="#acbdde"/><path d="m39 71 6 7-6 7-5-7Z" fill="#e9d68a"/><path d="M21 95h10m18 0h10" stroke="#c2cae6"/>'},
 marinero:{hat:'M12 24Q16 8 40 8t28 16l-4 8H17Z',hatColor:'#f7f3e6',details:'<path d="M19 26h44M23 72h33m-34 9h35m-36 9h37" stroke="#456983" stroke-width="4"/><path d="M28 62 40 73l13-11-7 18-6-6-6 6Z" fill="#b96267"/>'},
 pez:{hat:'M8 30Q6 14 27 11L37-4 48 10q23 2 24 20l-16-5-16-3-16 6Z',back:'M22 65 4 72 9 88 21 83M55 67 75 74l-7 18-14-5Z',details:'<path d="M27 12q-12-8-16-1m42 2q11-8 17 0" fill="none" stroke="#e2bc78"/><path d="m39 74-9 7 10 11 11-11Z" fill="#f0d394"/><path d="M26 18h2m25 0h2" stroke-width="4"/>'},
 tortuga:{hat:'M10 30Q7 7 38 7q30 0 32 23l-15-5-16-6-17 9Z',back:'M20 63Q-4 64 3 91l19 13 15-17Z',details:'<path d="m28 9 10 4 13-5 5 10-17 3-15-4Z" fill="#596e91"/><path d="m29 72 12-6 13 8 2 19-15 5-14-7Z" fill="#e3c78b"/><path d="M29 80h24m-11-11v26" stroke="#b39364"/><path d="M60 92q25 2 13 15-9 8-11-2" fill="none" stroke="#76a8be" stroke-width="5"/>'},
 sirena:{hat:'M12 30Q9 7 39 5q30 2 31 25l-16-6-15-4-17 8Z',details:'<path d="m17 21 3-11 9 9m24-1 9-10 3 15" fill="#edc3ad"/><path d="m26 74 7 6 7-6 7 6 8-6m-29 13 7 6 7-6 7 6 8-6" fill="none" stroke="#d6e0b4" stroke-width="3"/>'},
 serpmar:{hat:'M8 30 12 12 22 15 23-3 37 8 49-6 53 12 65 7 72 30 56 25 48 30 40 22 26 31 18 25Z',back:'M55 66q34-2 24 31l-13-6 4 18-21-14Z',details:'<path d="M24 17Q2 13 6 31m49-14q25-5 22 15" fill="none" stroke="#ead9a4" stroke-width="3"/><path d="M30 72h22l5 22H25Z" fill="#e9dbb1"/><path d="M29 81h25m-26 8h28" stroke="#bcad82"/>'},
 almirante:{hat:'M12 24Q12 4 39 4t29 20l-8 9H20Z',hatColor:'#f3edda',back:'M24 65 9 103l18-4 14 10 22-9-8-35Z',details:'<path d="M20 26h40M34 14h12m-6-5v12" stroke="#d9b558" stroke-width="4"/><path d="M22 66h13m13 0h12M24 72h9m17 0h9" stroke="#e7ca75" stroke-width="5"/><path d="M38 79h4m-4 8h4m-4 8h4" stroke="#edcf79"/>'},
 brigada:{hat:'M11 28Q10 5 40 5t29 23l5 5H7Z',details:'<path d="M25 67v26m29-26v26" stroke="#eee1b6" stroke-width="4"/><path d="m40 12 4 6 7 1-5 5 1 7-7-3-6 3 1-7-5-5 7-1Z" fill="#f8e6a7" stroke-width="1.5"/><path d="M31 76h19v15H31Z" fill="#526a85"/><path d="m35 83 4 4 7-7" fill="none" stroke="#f5df9d" stroke-width="2"/>'}
};

window.PescaCenaPersonaje=(()=>{
const hatPaths={
 aurora:"M12 28Q8 8 28 7l12 5 12-5q20 1 16 21l-12 3-16-8-16 8Z",
 capitan:"M13 23Q12 8 40 8t27 15l-7 7H20Z",
 medusa:"M8 26Q8 2 40 2t32 24l-8 5-8-5-8 5-8-5-8 5-8-5-8 5Z",
 corona:"M17 22 13 5 29 13 40 1 51 13 67 5 63 22Z",
 hood:"M14 30Q11 8 38 7q27-1 29 23l-9-4Q38 14 22 30Z",
 cap:"M13 26Q12 8 37 8q24 0 26 19l14 4q-22 10-37-5Z",
 beanie:"M13 26Q11 7 38 7q27 0 28 19l-1 8q-26-10-52 0Z"
};
function colorOutfit(figure,outfit){
 const bare=!outfit||outfit.id==="blanco", id=outfit?.id;
 const color=outfit?.color||"#fff";
 const style=outfit?.hat||(id==="amarillo"?"hood":id==="marino"?"beanie":"cap");
 const get=selector=>figure.querySelector(selector);
 for(const selector of [".vest",".seams",".hat",".sleeve",".boots",".hat-detail",".scarf",".outfit-back"]){get(selector).toggleAttribute("hidden",bare);}
 get(".vest").setAttribute("fill",color);
 get(".vest").setAttribute("d","M26 63 21 68 18 96Q39 102 62 96L58 68 53 63 41 70Z");
 get(".sleeve").setAttribute("fill",color);
 get(".seams").setAttribute("d","M40 72v25m-15-14h9v9h-10m23-9h9v9h-9");
 const back=get(".outfit-back");
 back.setAttribute("fill",style==="corona"?"#773c67":color);
 back.setAttribute("d",style==="corona"?"M24 60Q8 69 8 101q28 13 58 1L56 63Z":style==="hood"?"M20 65Q-2 45 7 20 14 0 40 1q27 0 34 24 5 22-16 41Z":"");
 const scarf=get(".scarf");scarf.setAttribute("fill",id==="amarillo"?"#df9478":style==="corona"?"#edcf79":style==="aurora"?"#c6aeec":"#d8e6ed");
 scarf.setAttribute("d",style==="medusa"?"":"M25 59q15 6 29 0l3 7q-15 9-32 0l-8 12-6-10Z");
 get(".hat").setAttribute("d",hatPaths[style]||hatPaths.cap);
 get(".hat").setAttribute("fill",style==="corona"?"#f1ce67":style==="capitan"?"#f4f2e9":color);
 get(".hat-detail").setAttribute("d",({
  beanie:"M15 27q24-8 48 0M23 15l-1 9m11-12v10m10-10v10m10-7 1 9M34 6q6-10 12 0",
  capitan:"M20 25q20-5 40 0l-2 7q-19 6-36 0ZM37 15h7m-4-3v7",
  medusa:"M14 29v12q0 7 5 5m10-16v9m25-9v14q0 7 6 4M32 15h1m15 0h1",
  corona:"M19 22h42M37 13l3-4 3 4-3 4Z",
  aurora:"M22 19l8-4m20 0 8 4M37 12l3 4 3-4",
  hood:"M20 22Q37 8 58 22",
  cap:"M38 25q17-3 26 2"
 })[style]||"");
 dressCostume(figure,style,bare,color);
}

// Shared art for shop previews, the player and real peers.
const costumes={...RopaMinaArt,
 pirata:{hat:"M7 26Q8 9 25 17L40 5 57 17q16-8 17 10l-16 7H22Z",hatColor:"#35465f",details:'<path d="M32 18h16m-13-4 10 8m0-8-10 8" stroke="#f4ead7" stroke-width="2"/><path d="M20 32 58 45"/><ellipse cx="49" cy="38" rx="7" ry="8" fill="#35465f"/><path d="M20 87h40v7H20Z" fill="#35465f"/><path d="M35 86h12v9H35Z" fill="#ebce76"/>'},
 buzo:{hat:"M14 28Q9 6 39 6q32 0 29 22l6 5v18l-10 7V29Q40 17 17 31v26L7 50V33Z",hatColor:"#c79559",back:"M57 57h15v44H57Z",details:'<rect x="15" y="23" width="50" height="33" rx="16" fill="#a9d7df" fill-opacity=".35"/><path d="M11 37H5m62 0h9M28 16h24M27 72h25v20H27Z" fill="#e5bf76"/><circle cx="40" cy="82" r="5" fill="#edf2df"/><path d="M61 63q22 1 16 24" fill="none"/>'},
 tiburon:{hat:"M10 31Q6 8 28 8L40 0 49 8q23 2 23 24l-9-6-7 6-7-7-8 6-8-6-8 7-8-6Z",back:"M24 61 7 78 19 81 10 96 27 91ZM55 61 72 88 58 91Z",details:'<path d="M30 72Q40 65 50 72l7 24H24Z" fill="#f5f5ed"/><path d="M16 17h2m43 0h2" stroke-width="4"/><path d="M25 84h28" stroke="#9cb8c4"/>'},
 langostino:{hat:"M13 29Q12 9 31 9L38 2 44 10q20 0 22 19L55 24 48 29 40 23 31 29 23 24Z",back:"M25 66Q-1 73 8 95l13-6-5 14 14-7M53 89q27 7 19 20l-13-4 2 10-16-10Z",details:'<path d="M23 14Q-3 11 5 2q7-6 11 1M55 13Q79 9 73 2q-6-5-11 1" fill="none" stroke="#d77a48" stroke-width="2"/><path d="M24 62q17 8 32 0l1 8q-15 8-32 0l-5 13-8-11Z" fill="#3d6695"/><path d="M23 81h34m-35 9h37" stroke="#c87141"/>'},
 chef:{hat:"M17 24V14Q2 9 13 2q8-5 15 2 10-9 20 0 15-7 20 4 4 9-9 10v9Z",hatColor:"#fffdf4",details:'<path d="M20 24h39M31 68v27h22V68" fill="#fffdf4"/><path d="M27 65 39 72 53 65" fill="#bd6170"/><path d="M34 83h15v8H34Z" fill="#f4ead7"/>'},
 pato:{hat:"M12 31Q9 8 35 7q28 0 32 23l-13-4q-14-11-27 0Z",details:'<path d="M31 15q9-6 17 0l-2 7H33Z" fill="#e79a50"/><path d="M20 17h1m36 0h1" stroke-width="4"/><ellipse cx="40" cy="89" rx="31" ry="12" fill="#edcb66"/><ellipse cx="40" cy="86" rx="19" ry="5" fill="#f5ead5"/><path d="M59 83q-5-10 3-13 10-1 9 10l7 3-8 3" fill="#edcb66"/><circle cx="66" cy="75" r="1.6" fill="#19283e" stroke="none"/>'},
 mago:{hat:"M8 29 27 20 36 1 53 6 44 11 59 26 73 30Q41 41 8 29Z",back:"M25 61Q7 75 8 103l17-3 16 9 23-8-9-38Z",details:'<path d="m34 14 3 3 4-1-2 4 1 3-4-1-3 2 1-5Z" fill="#edd48b" stroke-width="1"/><path d="m28 80 3 4 5-1-3 4 1 4-4-2-4 2 1-5-2-3Z" fill="#edd48b" stroke-width="1"/><path d="M25 64 40 75 55 64" fill="#c8b4e1"/>'},
 disco:{hat:"M11 28Q-1 23 7 15-2 5 13 3q8-8 17-2 9-7 18 0 12-6 18 4 14 0 9 13 9 11-7 16l-9-7q-19-11-38 3Z",hatColor:"#514665",details:'<path d="m24 32 3 4 6-1-3 5 2 5-6-2-4 3 1-6-4-3 5-1Zm23 0 3 4 6-1-3 5 2 5-6-2-4 3 1-6-4-3 5-1Z" fill="#edcf79" stroke-width="1.7"/><path d="M32 38h13M25 64 40 78 55 64" fill="#eed993"/><path d="M38 82h4m-4 6h4m-4 6h4" stroke="#edcf79"/>'}
};
function dressCostume(figure,style,bare,color){
 const art=figure.querySelector('.costume-details');art.replaceChildren();
 const c=costumes[style];if(!c||bare)return;
 figure.querySelector('.hat').setAttribute('d',c.hat);
 figure.querySelector('.hat').setAttribute('fill',c.hatColor||color);
 figure.querySelector('.hat-detail').setAttribute('d','');
 figure.querySelector('.scarf').setAttribute('d','');
 figure.querySelector('.outfit-back').setAttribute('d',c.back||'');
 figure.querySelector('.seams').setAttribute('d',style==='buzo'?'':style==='disco'?'M40 77v22':'M40 72v25');
 art.innerHTML=c.details;
}


function vestir(figure,outfit='blanco'){colorOutfit(figure,Pesca.gearItem(outfit));return figure;}
function crear(avatar={}){const holder=document.createElement('template');holder.innerHTML="<svg viewBox=\"0 0 100 120\">\n<g stroke=\"#19283e\" stroke-width=\"3.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n  <ellipse cx=\"40\" cy=\"117\" rx=\"26\" ry=\"2\" fill=\"#b2c2ce\" stroke=\"none\" opacity=\".45\"/>\n  <path class=\"outfit-back\" d=\"\" fill=\"none\" hidden/>\n  <path class=\"body-base\" d=\"M25 88v26q0 5 9 4 6 0 6-5V99h3v14q0 6 9 5 6 0 6-5V88Z\" fill=\"#fff\"/>\n  <path class=\"body-base\" d=\"M25 65q15-8 30 0l6 28q-20 9-41 0Z\" fill=\"#fff\"/>\n  <path class=\"vest\" d=\"M24 64q16-7 32 0l9 33q-22 7-49 0Z\" fill=\"#e6bd51\" hidden/>\n  <path class=\"seams\" d=\"M40 64v33m-16-11h9v7h-11m26-7h10l2 7H48\" fill=\"none\" stroke-width=\"2\" hidden/>\n  <path class=\"body-base\" d=\"M53 69q8 7 17-3l8 2q-8 19-22 13\" fill=\"#fff\"/>\n  <path class=\"sleeve\" d=\"M54 69q9 5 14-2l5 8q-10 13-17 6Z\" fill=\"#fff\" hidden/>\n  <path class=\"boots\" d=\"M25 106h15v8q0 5-8 4h-8Zm18 0h15v7q0 6-8 5h-7Z\" fill=\"#35465f\" hidden/>\n  <g class=\"fishing-rod\"></g>\n  <circle class=\"body-base\" cx=\"76\" cy=\"67\" r=\"7\" fill=\"#fff\"/>\n  <ellipse class=\"body-base\" cx=\"40\" cy=\"38\" rx=\"25\" ry=\"24\" fill=\"#fff\"/>\n  <path d=\"M33 34v8m16-8v8\" stroke-width=\"4.5\"/>\n  <path class=\"scarf\" d=\"\" hidden/>\n  <path class=\"hat\" d=\"\" fill=\"#fff\" hidden/>\n<g class=\"costume-details\"></g>\n<path class=\"hat-detail\" d=\"\" fill=\"none\" stroke-width=\"2\" hidden/>\n</g>\n</svg>";const svg=holder.content.firstElementChild;svg.querySelector('.fishing-rod')?.remove();return vestir(svg,avatar.outfit);}
async function cargar(){return (await MuelleConnection.request('avatar')).avatar;}
return {crear,vestir,cargar};
})();
