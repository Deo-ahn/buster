'use strict';
(() => {
 const items = window.BUSTER_GALLERY;
 if (!Array.isArray(items) || !items.length) return;
 const byId = id => document.getElementById(id);
 const gallery = byId('figure-gallery');
 const dialog = byId('figure-dialog');
 const viewport = byId('figure-viewport');
 let selected = 0, filter = 'All', zoom = 100;
 const groups = ['All','Overview','Main paper','Supplementary','Normal','Failure cases','Source variant'];
 const groupLabels = {Overview:'Method', 'Failure cases':'Failure cases'};
 let visible = items.map((_, i) => i);
 function element(tag, className, text) { const el = document.createElement(tag); if(className) el.className = className; if(text) el.textContent = text; return el; }
 const filters = gallery.querySelector('.gallery-filters');
 groups.forEach(group => {
  const count = group === 'All' ? items.length : items.filter(item => item.group === group).length;
  const button = element('button','gallery-filter'); button.dataset.group = group;
  button.append(document.createTextNode((groupLabels[group] || group)+' '),element('span','',String(count)));
  button.addEventListener('click', () => {
   filter = group; visible = items.map((item,i)=>group === 'All' || item.group === group ? i : -1).filter(i=>i>=0);
   selected = visible.includes(selected) ? selected : visible[0]; renderThumbnails(); render();
  }); filters.append(button);
 });
 function renderThumbnails(){
  const holder=gallery.querySelector('.gallery-thumbnails');holder.replaceChildren();
  visible.forEach(index=>{
   const item=items[index],button=element('button','gallery-thumb');button.dataset.index=String(index);button.setAttribute('aria-label',item.label+': '+item.title);
   const image=element('img');image.src=item.thumb;image.alt='';image.loading='lazy';image.width=180;image.height=90;
   const copy=element('span','thumb-copy');copy.append(element('span','thumb-label',item.label),element('strong','',item.title));
   button.append(image,copy);button.addEventListener('click',()=>{selected=index;render();});holder.append(button);
  });
 }
 function setZoom(value){
  zoom=Math.max(100,Math.min(400,value));byId('figure-zoom').value=zoom;byId('zoom-value').textContent=zoom+'%';
  byId('expanded-figure').style.width=(viewport.clientWidth * zoom / 100)+'px';
  viewport.classList.toggle('zoomed',zoom>100);byId('zoom-out').disabled=zoom===100;byId('zoom-in').disabled=zoom===400;
  if(zoom===100){viewport.scrollTop=0;viewport.scrollLeft=0;}
 }
 function render(){
  const item=items[selected],position=String(visible.indexOf(selected)+1).padStart(2,'0')+' / '+String(visible.length).padStart(2,'0');
  byId('gallery-image').src=item.svg;byId('gallery-image').alt=item.source+': '+item.title+'. '+item.caption;
  byId('gallery-image').width=item.width;byId('gallery-image').height=item.height;
  byId('gallery-expand').setAttribute('aria-label','Enlarge '+item.title);
  byId('gallery-label').textContent=item.label;byId('gallery-position').textContent=position;
  byId('gallery-source').textContent=item.source;byId('gallery-title').textContent=item.title;byId('gallery-description').textContent=item.caption;
  byId('gallery-svg').href=item.svg;byId('gallery-pdf').href=item.pdf;
  filters.querySelectorAll('button').forEach(b=>{const active=b.dataset.group===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  gallery.querySelectorAll('.gallery-thumb').forEach(b=>{const active=Number(b.dataset.index)===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  ['gallery-prev','gallery-next','inspector-prev','inspector-next'].forEach(id=>{byId(id).disabled=visible.length<2;});
  if(dialog.open){byId('expanded-figure').src=item.svg;byId('expanded-figure').alt=byId('gallery-image').alt;byId('figure-caption').textContent=item.source+' — '+item.title;byId('inspector-pdf').href=item.pdf;byId('inspector-position').textContent=position;setZoom(100);}
 }
 function step(direction){const current=visible.indexOf(selected);selected=visible[(current+direction+visible.length)%visible.length];render();if(!dialog.open)gallery.querySelector('.gallery-thumb.active')?.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});}
 byId('gallery-prev').addEventListener('click',()=>step(-1));byId('gallery-next').addEventListener('click',()=>step(1));
 byId('inspector-prev').addEventListener('click',()=>step(-1));byId('inspector-next').addEventListener('click',()=>step(1));
 byId('gallery-expand').addEventListener('click',()=>{dialog.showModal();document.body.style.overflow='hidden';render();});
 byId('close-figure').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow='';});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 byId('figure-zoom').addEventListener('input',e=>setZoom(Number(e.target.value)));
 byId('zoom-in').addEventListener('click',()=>setZoom(zoom+25));byId('zoom-out').addEventListener('click',()=>setZoom(zoom-25));byId('zoom-reset').addEventListener('click',()=>setZoom(100));
 dialog.addEventListener('keydown',e=>{if(zoom!==100||e.target.matches('input'))return;if(e.key==='ArrowRight'){e.preventDefault();step(1);}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});
 let drag=null;
 viewport.addEventListener('pointerdown',e=>{if(zoom>100&&e.pointerType==='mouse'){drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);e.preventDefault();}});
 viewport.addEventListener('pointermove',e=>{if(drag){viewport.scrollLeft=drag.left-(e.clientX-drag.x);viewport.scrollTop=drag.top-(e.clientY-drag.y);}});
 viewport.addEventListener('pointerup',()=>drag=null);viewport.addEventListener('pointercancel',()=>drag=null);
 window.addEventListener('resize',()=>{if(dialog.open)setZoom(zoom);});
 renderThumbnails();render();
})();
