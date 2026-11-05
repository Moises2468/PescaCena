'use strict';
const PozoVisual=(()=>{
 function position(blocks){
  const targetRow=Math.floor(blocks/5),targetCol=targetRow%2?5-blocks%5:1+blocks%5;
  const dugRow=blocks?Math.floor((blocks-1)/5):-1;
  const dugCol=blocks?(dugRow%2?5-(blocks-1)%5:1+(blocks-1)%5):targetCol;
  return {targetRow,targetCol,dugRow,dugCol,depth:dugRow+1,down:!blocks||blocks%5===0};
 }
 function create(root){
  const tiles=root.querySelector('#tiles'),miner=root.querySelector('#miner'),peers=root.querySelector('#peers'),particles=root.querySelector('#particles'),badge=root.querySelector('#descent');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,nodes=new Map();
  let shown=null,highest=0,part=0,pending=null,camera=0,cameraWanted=0,cameraAt=0,lastDepth=0,badgeAt=0;
  function tile(row,col,cell){
   const key=row+':'+col;let node=nodes.get(key);
   if(!node){node=document.createElement('div');node.className='tile';node.dataset.row=row;node.dataset.col=col;const land=Pozo.terrain(row*5);node.style.setProperty('--rock',land.color);node.style.setProperty('--edge',land.edge);node.innerHTML='<svg class="cracks" viewBox="0 0 100 100"><path class="crack-one" d="m58 12-8 20 13 12-15 16 5 18"/><path class="crack-two" d="m50 32-19 2-8 15m40-5 16-6 11 9M48 60l-19 9-5 19"/><path class="crack-three" d="m58 12 17-9M31 34 13 17M53 78 70 94M29 69 7 65"/></svg>';tiles.append(node);nodes.set(key,node);}
   if(typeof MineralesArte!=='undefined'&&!node.querySelector('.mineral-art')&&col>0&&col<6&&(row*5+col)%3===0){const art=MineralesArte.draw(Pozo.terrain(row*5).index);art.classList.add('mineral-art');node.append(art);}
   node.style.left=(col/7*100)+'%';node.style.top=(row*cell)+'px';node.style.width=cell+'px';node.style.height=cell+'px';return node;
  }
  function fragments(row,col,cell,air){
   if(reduced)return;
   const color=Pozo.terrain(row*5).color;
   for(let i=0;i<7;i++){const bit=document.createElement('i');bit.className='rock-fragment';bit.style.left=((col+.5)*cell)+'px';bit.style.top=(air+(row-camera+.5)*cell)+'px';bit.style.background=color;bit.style.setProperty('--dx',((i-3)*10)+'px');bit.style.setProperty('--dy',(-14-(i%3)*9)+'px');bit.style.setProperty('--spin',((i%2?1:-1)*(55+i*25))+'deg');particles.append(bit);bit.addEventListener('animationend',()=>bit.remove(),{once:true});}
  }
  function render(view,t){
   const cell=root.clientWidth/7,air=cell>65?140:90;
   root.style.setProperty('--air',air+'px');root.style.setProperty('--cell-px',cell+'px');
   if(shown===null){shown=view.blocks;highest=shown;part=view.part;const p=position(shown);camera=cameraWanted=Math.max(0,p.dugRow-2);lastDepth=p.depth;}
   highest=Math.max(highest,view.blocks);
   if(view.blocks===shown)part=Math.max(part,view.part);
   if(pending&&t>=pending.at){
    const p=position(shown);fragments(p.targetRow,p.targetCol,cell,air);shown++;part=0;pending=null;
    const now=position(shown);
    if(now.depth>lastDepth){lastDepth=now.depth;badge.textContent='↓ Bajáis a la fila '+now.depth;badge.classList.remove('show');void badge.offsetWidth;badge.classList.add('show');badgeAt=t;}
    cameraWanted=Math.max(0,now.dugRow-2);if(cameraWanted!==camera&&!cameraAt)cameraAt=t+(reduced?0:430);
   }
   if(cameraAt&&t>=cameraAt){camera=cameraWanted;cameraAt=0;}
   const p=position(shown);
   if(shown<highest&&!pending){pending={at:t+(reduced?0:200)};}
   if(badgeAt&&t-badgeAt>1900){badge.classList.remove('show');badgeAt=0;}
   const start=Math.max(0,Math.floor(camera)-1),end=Math.max(start+8,p.targetRow+3);
   for(let r=start;r<=end;r++)for(let c=0;c<7;c++){
    const node=tile(r,c,cell),index=r*5+(r%2?5-c:c-1),border=c===0||c===6,empty=!border&&index<shown,target=!border&&index===shown;
    node.classList.toggle('empty',empty);node.classList.toggle('gold',!border&&!empty&&index%11===10);node.classList.toggle('target',target);node.classList.toggle('breaking',target&&!!pending);
    node.dataset.damage=target?(pending?'3':String(Math.min(3,Math.floor(part/Pozo.hardness(shown)*4)))):'0';
   }
   for(const [key,node]of nodes)if(+node.dataset.row<start||+node.dataset.row>end){node.remove();nodes.delete(key);}
   tiles.style.transform='translateY('+(-camera*cell)+'px)';
   const footY=air+(p.depth-camera)*cell,x=(p.dugCol+.5)*cell;
   miner.style.left=x+'px';miner.style.top=footY+'px';miner.classList.toggle('facing-left',!p.down&&p.targetCol<p.dugCol);miner.classList.toggle('digging-down',p.down);
   root.classList.toggle('underground',camera>0);
   [...peers.children].forEach((el,i)=>{el.style.left=((1+(i%4)+.5)*cell)+'px';el.style.top=(air+Math.max(0,p.depth-camera-1)*cell)+'px';});
   return {blocks:shown,depth:p.depth,part:pending?Pozo.hardness(shown):part,breaking:!!pending};
  }
  return {render};
 }
 return {create,position};
})();
if(typeof module!=='undefined')module.exports=PozoVisual;
