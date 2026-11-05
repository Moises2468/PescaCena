"use strict";
const FishArt=(()=>{
const ns="http://www.w3.org/2000/svg";
const svgNode=(tag,attrs={})=>{
  const el=document.createElementNS(ns,tag);
  for(const [key,val] of Object.entries(attrs))el.setAttribute(key,val);
  return el;
};
function drawFish(f,known){
  if(f.id==="rodolfo"&&known){
    const art=document.createElement("img");art.src="rodolfo.svg";art.alt="Caricatura de Rodolfo";return art;
  }
  const svg=svgNode("svg",{viewBox:"0 0 64 36","aria-hidden":"true", "shape-rendering":"crispEdges"});
  const silhouette=f.id==="rodolfo"?"M8 12 25 7 41 8 52 15 45 25 35 29 28 27 33 23 38 17 28 14 15 16Z":f.id==="sepia"||f.id==="cristal"?"M8 18 23 5 37 5 46 15 46 22 57 29 51 31 40 25 52 35 46 35 36 25 39 33 33 34 26 24 16 25Z":
    f.id==="congrio"?"M3 15 11 10 24 10 39 17 52 20 61 14 60 24 49 27 34 25 22 19 10 20 5 19Z":
    ["luna","rodaballo","salpa","gallo"].includes(f.id)?"M5 18 13 11 24 8 34 2 42 10 46 16 60 9 59 27 46 22 41 25 35 34 26 27 16 26Z":
    "M4 18 12 11 24 10 30 5 36 10 45 14 58 8 60 8 56 18 60 28 57 28 45 22 33 25 29 30 23 26 12 24Z";
  svg.append(svgNode("path",{d:silhouette,fill:known?f.color:"#405667"}));
  if(known){
    svg.append(svgNode("path",{d:"M10 19 20 20 28 21 38 19 32 24 17 24Z",fill:"#f8e8c2",opacity:".62"}));
    svg.append(svgNode("path",{d:"M13 14h4v4h-4z",fill:"#203244"}));
    if(f.pattern%2===0)svg.append(svgNode("path",{d:"M24 12h2v5h-2zm6 1h2v4h-2zm7 2h2v4h-2z",fill:"#294352",opacity:".48"}));
  }
  return svg;
}
return {drawFish};
})();
