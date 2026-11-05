'use strict';
const Pozo=(()=>{
 const layers=[['Tierra','#dfd2af','#b9a883'],['Piedra','#cbd5d9','#9caeb8'],['Pizarra','#aab7c9','#778ca9'],['Cobre','#cfaa8b','#aa7b60'],['Cristal','#bbd8d5','#80b5b4'],['Basalto','#a9a5bd','#79758e'],['Ámbar','#dfc28a','#b99559'],['Profundidades','#aab1cf','#727d9f']];
 const picks=[['Piedra',1,0],['Hierro',1.7,10],['Acero',2.8,25],['Cobre reforzado',4.5,65],['Cristal',7,140],['Titanio',11,300],['Iridio',17,600],['Estelar',26,1100],['Abisal',40,1800]];
 const layer=blocks=>Math.floor(blocks/30);
 const hardness=blocks=>Math.round(2000*(1+layer(blocks)*.6+Math.pow(layer(blocks),1.2)*.06));
 function advance(world,work){
  let blocks=world.blocks,part=world.part||0,broken=0,minerals=0;
  work=Math.max(0,Math.min(1000000000,Math.floor(work)));
  while(work>0){const need=hardness(blocks)-part;if(work<need){part+=work;break;}work-=need;blocks++;part=0;broken++;minerals+=blocks%11===0?4:1;}
  return {blocks,part,broken,minerals};
 }
 const terrain=blocks=>{const i=layer(blocks),a=layers[i%layers.length];return {index:i,name:a[0]+(i>=layers.length?' '+(Math.floor(i/layers.length)+1):''),color:a[1],edge:a[2]};};
 const speed=level=>1+Math.max(0,Math.min(8,level||0))*.15;
 const speedCost=level=>[12,30,75,160,330,650,1200,2000][level];
 return {layers,picks,layer,hardness,advance,terrain,speed,speedCost};
})();
if(typeof module!=='undefined')module.exports=Pozo;
