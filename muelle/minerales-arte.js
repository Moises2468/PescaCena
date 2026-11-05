const MineralesArte=(()=>{
 const shapes=[
  '<path d="m7 19 3-9 10-3 8 7-5 11-11 2Z" fill="#b59e79"/><path d="m22 32 3-7 9 1 3 7-7 5Z" fill="#d5c29b"/>',
  '<path d="m5 19 9-12 14 1 10 15-9 13-17-3Z" fill="#a8b5bd"/><path d="m14 7 3 15 21 1m-21-1-5 11m5-11 12 14" fill="none"/>',
  '<path d="m4 16 21-8 13 8-21 9Z" fill="#70839f"/><path d="m5 22 13 8 20-8m-33 6 13 8 20-8" stroke="#61738d" stroke-width="4" fill="none"/>',
  '<path d="m5 19 8-11 12 5-2 14-12 4Z" fill="#c38156"/><path d="m22 25 4-10 12 5-1 12-11 5Z" fill="#dfaa72"/><path d="m13 8 3 13-5 10m5-10 9-8m-9 8 7 6" fill="none"/>',
  '<path d="m5 29 5-17 8-5 8 11-2 18-12 2Z" fill="#9bd5d9"/><path d="m22 31 2-22 7-6 8 12-8 22Z" fill="#d0ece5"/><path d="m10 12 7 9 1-14m-1 14-5 17m7-17 5 15M24 9l7 10 8-4m-8 4v18" fill="none"/>',
  '<path d="m5 22 7-14 17-2 10 12-4 16-21 4Z" fill="#717287"/><g fill="#42495e" stroke="none"><circle cx="15" cy="18" r="3"/><circle cx="28" cy="15" r="2"/><circle cx="25" cy="28" r="4"/><circle cx="12" cy="29" r="2"/></g>',
  '<path d="M21 4Q7 12 7 25q0 14 15 14t15-13Q35 12 21 4Z" fill="#dfa94b"/><path d="M21 10q-9 8-8 17" stroke="#f4db88" stroke-width="3" fill="none"/><path d="m23 19 5 2-4 4 4 5-7-1" fill="none"/>',
  '<path d="m21 3 9 11 10 7-10 9-9 11-9-11L2 21l10-7Z" fill="#8d90bd"/><path d="m21 3 1 18 18 0m-18 0-1 20m1-20L2 21" fill="none" stroke="#d9daf0"/>'
 ];
 const fossilShapes={ammonite:'<path d="M34 30Q8 44 5 23 2 4 23 4q18 0 15 16-3 14-17 9-11-5-3-14 6-6 10 1 3 5-4 6" fill="#d7c5a3"/><path d="m9 12 6 3m-9 6h7m-3 10 5-6m7 9 1-6m9 4-4-6"/>',trilobite:'<path d="M21 3Q6 6 8 25l5 12h16l5-12Q36 6 21 3Z" fill="#9aafa8"/><path d="M21 7v29M10 13h22M9 19h24M10 25h22M12 31h18" fill="none"/><path d="m9 12-5-3m29 3 5-3M8 21l-5 3m31-3 5 3"/>',helecho:'<path d="m9 5 24-1 7 29-10 8-25-6Z" fill="#c9b797"/><path d="M20 35V10m0 5-9-5m9 10-11-4m11 10L8 22m12 8-9-3m9-10 9-8m-9 15 12-9m-12 14 12-8" stroke="#718c73" fill="none" stroke-width="2"/>'};
 function svg(markup){const n=document.createElementNS('http://www.w3.org/2000/svg','svg');n.setAttribute('viewBox','0 0 44 44');n.setAttribute('aria-hidden','true');n.innerHTML='<g stroke="#556a79" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">'+markup+'</g>';return n;}
 return {draw:i=>svg(shapes[i%8]),fossil:id=>svg(fossilShapes[id]||''),shapes};
})();
