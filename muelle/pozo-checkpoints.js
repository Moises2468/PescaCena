'use strict';
const PozoCheckpoints=(()=>{
 // Completed work triggers saves. Coalesce fast cooperative progress so more
 // players or better tools cannot turn this into one request per block.
 function create(){
  let base=null,lastAttempt=-Infinity;
  return {
   accept(data,t){if(base)lastAttempt=t;base={personal:data.player.blocks,layer:Pozo.layer(data.view.blocks)};},
   due(personal,blocks,t){return !!base&&t-lastAttempt>=55000&&(personal-base.personal>=5||Pozo.layer(blocks)>base.layer);},
   attempted(t){lastAttempt=t;}
  };
 }
 return {create};
})();
if(typeof module!=='undefined')module.exports=PozoCheckpoints;
