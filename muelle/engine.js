/* Shared simulation. The browser and server advance the same 60 Hz ticks. */
const Pesca = (() => {
  const fish = [
    ["sardina","Sardina","común","Nada cerca del primer pilote.","pilotes",0,14,26,"#89c6d1"],
    ["jurel","Jurel","común","Busca el agua clara junto a la madera.","pilotes",1,18,43,"#82b8a4"],
    ["salpa","Salpa","común","Muerde a media distancia entre las algas.","pilotes",2,19,41,"#edc874"],
    ["mugil","Múgil","común","Suele quedarse a media profundidad.","pilotes",3,28,64,"#adbbd0"],
    ["lubina","Lubina","poco común","Prefiere un lance a media distancia.","pilotes",4,33,84,"#b0d1da"],
    ["sepia","Sepia","raro","Prueba lejos de la sombra del primer poste.","pilotes",5,17,48,"#efa783"],
    ["caballa","Caballa","común","Sigue la corriente mar adentro.","punta",6,24,54,"#80c6b4"],
    ["faneca","Faneca","común","Sale con lances cortos y largos.","punta",7,16,36,"#e6b088"],
    ["rodaballo","Rodaballo","poco común","Busca el fondo arenoso, mar adentro.","punta",8,24,79,"#d3ac8c"],
    ["congrio","Congrio","raro","Se esconde lejos, entre las rocas de la punta.","punta",9,55,168,"#d3a6da"],
    ["luna","Pez luna","legendario","Lanza lejos hacia mar abierto.","punta",10,72,185,"#a9bce9"],
    ["cristal","Calamar de cristal","legendario","Aparece en el banco que abre el encargo semanal.","banco",11,32,95,"#99e5df"],
    ["aguja","Pez aguja","común","Se desliza cerca de la superficie.","pilotes",12,17,49,"#78b0a3"],
    ["gallo","Gallo","poco común","Busca aguas abiertas, cerca del fondo.","punta",13,24,65,"#c8a487"],
    ["rubio","Rubio de aletas azules","raro","Da tirones cortos cerca del fondo.","punta",14,27,69,"#5c99c5"],
    ["dragon","Dragón de marea","legendario","Se asoma al banco del encargo semanal.","banco",15,39,102,"#8c81c2"],
    ["rodolfo","Langostino Rodolfo","ultrararo","A veces aparece mar adentro. Prueba lances largos.","punta",16,15,29,"#ed8a4a"]
  ].map(([id,name,rarity,hint,zone,pattern,min,max,color])=>({id,name,rarity,hint,zone,pattern,min,max,color}));
  const dayNames=["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
  const rotation=[
    [["boqueron","Boquerón","común","pilotes",12,9,20,"#9ac1d7"],["dorada","Dorada","poco común","punta",4,24,71,"#d6ad5b"],["pulpo","Pulpo jaspeado","raro","punta",5,32,86,"#b482a4"]],
    [["pejerrey","Pejerrey","común","pilotes",1,11,34,"#a2b4c9"],["lenguado","Lenguado","poco común","punta",13,24,65,"#a28a72"],["pezvolador","Pez volador","raro","punta",10,18,44,"#78b2dc"]],
    [["espadin","Espadín","común","pilotes",0,8,18,"#86a8c2"],["sargo","Sargo","poco común","punta",8,21,50,"#95a6bc"],["morena","Morena moteada","raro","punta",9,40,97,"#ab9b6e"]],
    [["gobio","Gobio de roca","común","pilotes",3,8,21,"#ab9e8a"],["salmonete","Salmonete","poco común","punta",4,17,38,"#d28076"],["farol","Pez farol","raro","punta",14,20,48,"#689fa8"]],
    [["herrera","Herrera","común","pilotes",2,15,36,"#b9af85"],["merluza","Merluza plateada","poco común","punta",8,31,93,"#8295a6"],["caballito","Caballito dorado","raro","pilotes",5,9,24,"#d5a064"]],
    [["bogavante","Bogavante azul","raro","pilotes",5,21,49,"#627ac5"],["bonito","Bonito del norte","poco común","punta",6,36,97,"#6d9bca"],["remo","Pez remo","legendario","punta",15,74,205,"#b38fbd"]],
    [["breca","Breca","común","pilotes",3,13,33,"#cf9f9a"],["rape","Rape de las sombras","raro","punta",14,26,90,"#8a849a"],["manta","Manta estrellada","legendario","punta",11,51,147,"#786eb8"]]
  ];
  rotation.forEach((entries,day)=>entries.forEach(([id,name,rarity,zone,pattern,min,max,color])=>{
    fish.push({id,name,rarity,zone,pattern,min,max,color,day,
      hint:zone==="pilotes"?"Prueba un lance corto cerca del muelle.":"Prueba un lance largo hacia mar abierto."});
  }));
  const loot=[
    {id:"basura",name:"Basura",detail:"Una lata vieja. Hoy el mar se ríe de ti.",coins:0},
    {id:"etiqueta",name:"Una etiqueta",detail:"El agua se ha llevado hasta el precio.",coins:0},
    {id:"periodico",name:"Un periódico mojado",detail:"La noticia del día: no era un pez.",coins:0},
    {id:"monedas",name:"Un puñado de monedas",detail:"Esta vez el mar te invita.",coins:10}
  ];
  const findLoot=id=>loot.find(item=>item.id===id);
  function rollLoot(seed){
    const random=rng(seed^0x7a65e921);
    if(random()>=.16)return null;
    const roll=random();
    return roll<.33?loot[0]:roll<.61?loot[1]:roll<.88?loot[2]:loot[3];
  }
  function water(seed,power,bankOpen){
    const roll=rng(seed^0x3187bd45)();
    if(bankOpen&&roll<.03+.12*power)return "banco";
    return roll<.69-.45*power?"pilotes":"punta";
  }
  const fishHats={none:"Sin gorro",birthday:"Gorro de cumpleaños",captain:"Gorra de capitán",crown:"Corona dorada"};
  const catalog=[
    ["blanco","Monigote blanco","clothes",0,0,"Tu personaje base, sin ropa ni gorro.",0,0,"#ffffff"],
    ["amarillo","Chaleco amarillo","clothes",0,0,"El equipo de cubierta de PescaCena.",0,0,"#e6bd51"],
    ["marino","Chaqueta marinera","clothes",0,25,"Azul marino de la tripulación.",0,0,"#7893b3"],
    ["salvia","Impermeable salvia","clothes",2,45,"Verde suave para los días de mar.",0,0,"#a7b49b"],
    ["coral","Chaleco coral","clothes",4,80,"Un color de rescate que se ve desde lejos.",0,0,"#de897b"],
    ["capitan","Capitán del puerto","clothes",3,70,"Gorra con visera dorada y chaqueta de capitán.",0,0,"#445b7d","capitan","raro"],
    ["medusa","Traje de medusa","clothes",5,115,"Sombrero de medusa con tentáculos y traje violeta.",0,0,"#997dc5","medusa","raro"],
    ["corona","Realeza del muelle","clothes",8,175,"Corona dorada y capa morada.",0,0,"#915978","corona","legendario"],
    ["aurora","Traje Aurora del Puerto","clothes",0,0,"Premio por completar cinco encargos diarios.",0,0,"#278b8b","aurora","legendario",true],
    ["pirata","Pirata de charco","clothes",1,55,"Tricornio, parche y cinturón. El botín son sardinas.",0,0,"#984e60","pirata","raro"],
    ["buzo","Buzo de secano","clothes",2,85,"Escafandra de cobre y botella. Para pescar desde fuera.",0,0,"#c79559","buzo","raro"],
    ["tiburon","Tiburón de oficina","clothes",3,110,"Aleta, dientes de pega y barriga blanca. Reunión a las cinco.",0,0,"#7cabc1","tiburon","raro"],
    ["langostino","Rodolfo en prácticas","clothes",5,160,"Antenas, cola y pañuelo azul. Contratado por el mar.",0,0,"#ed995b","langostino","legendario"],
    ["chef","Chef del muelle","clothes",1,60,"Gorro alto, delantal y cero estrellas de mar Michelin.",0,0,"#f4ead7","chef","raro"],
    ["pato","Patito de emergencia","clothes",2,90,"Pico, capucha y flotador. Cuac por si acaso.",0,0,"#edcb66","pato","raro"],
    ["mago","Mago del caladero","clothes",4,140,"Sombrero torcido, estrellas y una capa con mucho cuento.",0,0,"#9581bc","mago","raro"],
    ["disco","Sardina disco","clothes",6,190,"Afro, gafas de estrella y traje de fiesta. Pica el ritmo.",0,0,"#d181ad","disco","legendario"],
    ["bambu","Caña de bambú","rod",0,0,"Para empezar: los peces comunes son más tranquilos.",0,0],
    ["aprendiz","Caña de entrenamiento","rod",0,30,"Barra más ancha. Solo peces fáciles.",0,0],
    ["fibra","Caña de fibra","rod",2,120,"Barra más ancha y menos pérdida de progreso. Admite cebo.",1,0],
    ["iridio","Caña de iridio","rod",6,360,"Más control y margen fuera de la barra. Admite cebo y atrae peces raros.",1,1],
    ["avanzada","Caña de iridio avanzada","rod",10,650,"La barra más ancha y la menor pérdida de progreso. Admite cebo y atrae peces raros.",1,2],
    ["cebo","Cebo normal","bait",2,12,"Cinco usos. Reduce a la mitad la espera.",5],
    ["lujo","Cebo deluxe","bait",4,25,"Cinco usos. Picada más rápida y barra más ancha.",5],
    ["salvaje","Cebo salvaje","bait",5,32,"Cinco usos. Opción de captura doble, salvo legendarios.",5],
  ].map(([id,name,type,level,cost,description,quantity,slots,color,hat,rarity,rewardOnly])=>({id,name,type,level,cost,description,quantity,slots,color,hat,rarity,rewardOnly}));
  const gearItem=id=>catalog.find(item=>item.id===id);
  const level=xp=>[0,12,28,48,72,102,138,180,230,290,360].filter(n=>xp>=n).length-1;
  const difficulty=[20,35,42,31,59,78,66,48,72,91,103,116,44,57,86,111,125];
  const motion=["mixto","rápido","ascendente","descendente","mixto","rápido","rápido","descendente","suave","rápido","ascendente","mixto","suave","descendente","rápido","ascendente","rápido"];
  const find = id => fish.find(f=>f.id===id);
  const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));
  function rng(seed) {
    let x=seed>>>0 || 1;
    return ()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};
  }
  function select(seed,zone,power,first,gear,day) {
    const roll=rng(seed)();
    const pool=fish.filter(f=>f.zone===zone&&(f.day===undefined||f.day===day)&&(!(gear?.rod==="aprendiz")||difficulty[f.pattern]<50));
    if(!pool.length)return null;
    if(first&&zone==="pilotes")return pool[0];
    const weights=pool.map(f=>({"común":32,"poco común":15,raro:7,legendario:3,ultrararo:.42})[f.rarity]*(f.rarity==="común"?1:0.45+1.4*power)*(gear?.target===f.id?3:1)*(gear?.tackle?.includes("curiosidad")&&["raro","legendario"].includes(f.rarity)?1.7:1));
    let at=roll*weights.reduce((a,b)=>a+b,0);
    return pool.find((_,i)=>(at-=weights[i])<0)||pool[0];
  }
  const MAX=1800, HEIGHT=300, BAR=76;
  // Rarity sets the challenge; patterns add character within each tier.
  function balance(ticket){
    const f=find(ticket.fish), tier=["común","poco común","raro","legendario","ultrararo"].indexOf(f.rarity);
    const rod=({bambu:0,aprendiz:0,fibra:1,iridio:2,avanzada:3})[ticket.gear?.rod]||0;
    return {tier,rod,speed:[1.15,1.65,2.25,2.85,3.35][tier],
      range:[90,125,175,225,270][tier],interval:[110,90,69,53,42][tier],
      gain:[.00135,.0013,.00125,.0012,.00115][tier],
      loss:[.0018,.0022,.00265,.0031,.0035][tier]*(1-rod*.1)};
  }
  function start(ticket) {
    const random=rng(ticket.seed^0x69843311);
    const g=ticket.gear;
    const tackle=g?.tackle||[];
    const tuning=ticket.version>=4?balance(ticket):null;
    const bar=tuning?64+4*(g?.level||0)+12*tuning.rod+(g?.rod==="aprendiz"?22:0)+(g?.bait==="lujo"?6:0)
      :g?Math.round(HEIGHT*(96+8*(g.rod==="aprendiz"?Math.max(5,g.level):g.level))/568)+(g.bait==="lujo"?6:0)+tackle.filter(x=>x==="corcho").length*13:BAR;
    return {bar,tuning,gear:g,tackle,longFight:ticket.version>=2, fastDrain:ticket.version>=3, limit:ticket.version===2||ticket.version>=4?2700:MAX,tick:0,pos:HEIGHT-bar,velocity:0,fishY:HEIGHT-27,target:HEIGHT-27,fishV:0,
      progress:ticket.version===2?.18:.24,perfect:true,result:null,random,pattern:find(ticket.fish).pattern};
  }
  function step(s,held) {
    if(s.result)return s;
    const i=s.pattern, t=++s.tick;
    let interval=[152,85,73,120,62,55,57,77,92,43,37,34,95,81,72,65,118][i];
    let range=[47,67,82,66,95,111,116,106,129,162,192,205,74,95,116,137,113][i];
    if(s.longFight&&i===0){interval=104;range=74;}
    if(s.gear&&i>0){
      interval=Math.max(s.longFight?35:19,Math.round(interval*(1.12-difficulty[i]/185)));
      range=Math.min(285,range*(1+difficulty[i]/150));
    }
    if(s.tuning){
      interval=Math.round(s.tuning.interval*(.9+(difficulty[i]%17)/85));
      range=s.tuning.range;
    }
    if(t%interval===1) {
      const behavior=motion[i];
      const center=s.gear?(behavior==="ascendente"?112:behavior==="descendente"?217:152):(i===7?200:i===8?222:i===2?135:154);
      const offset=(s.random()-.5)*range;
      s.target=clamp(t<40?232+offset*.28:center+offset+((i>=9&&i<=11||i>=15)&&s.random()<(i===16?.2:.4)?(s.random()-.5)*142:0),12,288);
    }
    const speed=s.tuning?s.tuning.speed:s.longFight?Math.min(3.55,2.2+i*.23):2.2+i*.29;
    const fishAccel=(s.target-s.fishY)*(.0018+(i<12?i:difficulty[i]/11)*.00021)*(s.gear&&motion[i]==="rápido"?1.45:1);
    s.fishV=clamp((s.fishV+fishAccel)*(.89+i*.004),-speed,speed);
    s.fishY=clamp(s.fishY+s.fishV,10,290);
    s.velocity=clamp(s.velocity+(held?-.27:.21),-6.2,6.4);
    s.pos+=s.velocity;
    if(s.pos>HEIGHT-s.bar){s.pos=HEIGHT-s.bar;s.velocity=s.tackle.includes("plomo")?0:-s.velocity*.33;if(Math.abs(s.velocity)<.45)s.velocity=0;}
    if(s.pos<0){s.pos=0;s.velocity=0;}
    const inside=s.fishY>=s.pos&&s.fishY<=s.pos+s.bar;
    if(!inside)s.perfect=false;
    const gain=s.tuning?s.tuning.gain:s.longFight?(i<4?.00165:i<9?.00145:.00135):.0054;
    const loss=s.tuning?s.tuning.loss:s.fastDrain?(i<4?.00245:i<9?.00295:.0032)
      :s.longFight?(i<4?.00155:i<9?.00185:.00195):(s.gear&&i>3?.0045:.00365);
    const drain=loss*(s.tackle.includes("trampa")?.67:1);
    s.progress=clamp(s.progress+(inside?gain:-drain),0,1);
    if(s.progress>=1)s.result="caught";
    else if(s.progress<=0||t>=s.limit)s.result="lost";
    return s;
  }
  function replay(ticket,ticks,changes) {
    if(!Number.isInteger(ticks)||ticks<1||ticks>(ticket.version===2||ticket.version>=4?2700:MAX)||!Array.isArray(changes)||changes.length>ticks)return null;
    let last=-1;
    for(const tick of changes){if(!Number.isInteger(tick)||tick<=last||tick<0||tick>=ticks)return null;last=tick;}
    const s=start(ticket);let index=0,held=false;
    while(s.tick<ticks&&!s.result){if(changes[index]===s.tick){held=!held;index++;}step(s,held);}
    return s.result&&s.tick===ticks?s:null;
  }
  function length(ticket,perfect) {
    const f=find(ticket.fish);
    const q=clamp(.12+ticket.power*.24+rng(ticket.seed^0x215410ad)()*.48+(perfect?.16:0),0,1);
    return Math.round(f.min+(f.max-f.min)*q);
  }
  function madridDate(now,localDate) {
    const parts=localDate?null:new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(now));
    const get=type=>Number(parts.find(p=>p.type===type).value);
    return localDate?new Date(localDate+"T12:00:00Z"):new Date(Date.UTC(get("year"),get("month")-1,get("day")));
  }
  function day(now,localDate){
    const d=madridDate(now,localDate), index=(d.getUTCDay()+6)%7;
    return {id:d.toISOString().slice(0,10),index,name:dayNames[index]};
  }
  function week(now,localDate){
    const d=madridDate(now,localDate);
    d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));
    const index=Math.round((d-Date.UTC(2025,0,6))/604800000);
    const list=["sardina","jurel","salpa","mugil","lubina","sepia"];
    const offshore=["caballa","faneca","rodaballo","congrio","luna"];
    const shift=((index%6)+6)%6, off=((index%5)+5)%5;
    return {id:d.toISOString().slice(0,10),ids:[list[shift],list[(shift+1)%6],list[(shift+3)%6],offshore[off],offshore[(off+2)%5]]};
  }
  return {fish,find,fishHats,findLoot,rollLoot,water,catalog,gearItem,level,difficulty,motion,select,start,step,replay,length,week,day,dayNames,HEIGHT,BAR};
})();
if(typeof module!=="undefined")module.exports=Pesca;





