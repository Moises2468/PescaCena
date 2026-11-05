window.GrupoUI=(()=>{
 function mount(nav,items,onSelect,initial=0){
  nav.classList.add('grupo-tabs');nav.setAttribute('role','tablist');
  function select(index,focus=false){
   items.forEach(({button,panel},i)=>{const active=i===index;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;panel.hidden=!active;if(panel.tagName==='DIALOG'){if(active&&!panel.open)panel.show();else if(!active&&panel.open)panel.close();}});
   onSelect?.(index);if(focus)items[index].button.focus({preventScroll:true});
  }
  items.forEach(({button,panel},index)=>{
   button.classList.add('grupo-tab');button.setAttribute('role','tab');button.setAttribute('aria-controls',panel.id);panel.classList.add('grupo-panel');panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);
   button.onclick=()=>select(index);
   button.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowRight'?1:items.length-1))%items.length;select(next,true);}};
  });
  queueMicrotask(()=>select(initial));return {select};
 }
 return {mount};
})();
