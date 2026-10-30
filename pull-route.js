(function pullRouteFeature() {
  'use strict';
  const KEY='pull-list-saved-route-v1';
  const screen=document.getElementById('pullRouteScreen');
  const partContainer=document.getElementById('parts');
  const list=document.getElementById('pullRouteItems');
  if(!screen||!partContainer||!list) return;
  const text=v=>String(v??'').trim();
  const html=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const usd=v=>Number.isFinite(Number(v))?Number(v).toLocaleString('en-US',{style:'currency',currency:'USD'}):'—';
  const collator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});
  const storageNotice=()=>{const e=document.getElementById('routeStorageNotice');if(e)e.textContent='Saving failed in this browser. Export a JSON backup before leaving.';};
  let entries=[];
  try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(value))entries=value.filter(e=>e&&typeof e.key==='string');}
  catch(err){console.warn('[Pull List] Route load failed',err);storageNotice();}
  const vehicleKey=car=>text(car.yard)+'|'+(text(car.stock)?'stock:'+text(car.stock):text(car.vin)?'vin:'+text(car.vin).toUpperCase():'id:'+text(car.id));
  const entryKey=(car,p)=>vehicleKey(car)+'|part:'+text(p.id);
  const updateBadge=()=>{const b=document.getElementById('pullRouteCount');if(b)b.textContent=String(entries.filter(e=>!e.pulled).length);};
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(entries));}catch(err){console.error('[Pull List] Saved route write failed',err);storageNotice();}updateBadge();};
  function updatePartButtons(){
    if(!current||document.getElementById('detail')?.hidden)return;
    partContainer.querySelectorAll('.part [data-editpart]').forEach(edit=>{
      const row=edit.closest('.buttonrow');
      const part=carParts(current).find(p=>text(p.id)===text(edit.dataset.editpart));
      if(!row||!part)return;
      let button=row.querySelector('[data-route-save]');
      if(!button){button=document.createElement('button');button.type='button';button.className='btn route-save';row.append(button);}
      button.dataset.routeSave=text(part.id);
      const exists=entries.some(e=>e.key===entryKey(current,part));
      button.textContent=exists?'✓ Saved to pull list':'+ Save to pull list';
      button.classList.toggle('route-saved',exists);
      button.setAttribute('aria-pressed',String(exists));
    });
  }
  function togglePart(partId){
    if(!current)return;
    const part=carParts(current).find(p=>text(p.id)===text(partId));
    if(!part)return;
    const key=entryKey(current,part);
    const position=entries.findIndex(e=>e.key===key);
    if(position>=0)entries.splice(position,1);
    else entries.push({
      key,partId:text(part.id),carId:text(current.id),
      yard:text(current.yard),yardName:text(YARDS[current.yard]?.name||current.yard),
      row:text(current.row),space:text(current.space),stock:text(current.stock),
      vin:text(current.vin),year:text(current.year),make:text(current.make),
      model:text(current.model),trim:text(current.trim),
      name:text(part.name),variant:text(part.variant),group:text(part.group),
      profit:Number(profit(part))||0,pulled:false,note:'',savedAt:new Date().toISOString()
    });
    save();updatePartButtons();if(!screen.hidden)renderRoute();
  }
  partContainer.addEventListener('click',event=>{
    const b=event.target.closest('[data-route-save]');
    if(b)togglePart(b.dataset.routeSave);
  });
  const oldDetail=renderDetail;
  renderDetail=function(...args){const result=oldDetail.apply(this,args);updatePartButtons();return result;};
  const yardOrder=['north','south','island','summit','demo'];
  function compare(a,b){
    const ya=yardOrder.indexOf(a.yard),yb=yardOrder.indexOf(b.yard);
    const aIndex=ya<0?99:ya,bIndex=yb<0?99:yb;
    if(aIndex!==bIndex)return aIndex-bIndex;
    if(!text(a.row)&&text(b.row))return 1;
    if(text(a.row)&&!text(b.row))return -1;
    const row=collator.compare(text(a.row),text(b.row));
    if(row)return row;
    return collator.compare([a.year,a.make,a.model].join(' '),[b.year,b.make,b.model].join(' '));
  }
  function findCar(e){
    return allCars().find(c=>text(c.id)===e.carId&&text(c.yard)===e.yard)||
      allCars().find(c=>text(c.yard)===e.yard&&(
        (e.stock&&text(c.stock)===e.stock)||
        (e.vin&&text(c.vin).toUpperCase()===text(e.vin).toUpperCase())
      ));
  }
  function renderRoute(){
    if(screen.hidden)return;
    const summary=document.getElementById('pullRouteSummary');
    const filter=document.getElementById('pullRouteFilter')?.value||'remaining';
    const open=entries.filter(e=>!e.pulled);
    const vehicles=new Set(open.map(e=>e.key.split('|part:')[0]));
    const profitSum=open.reduce((sum,e)=>sum+(Number(e.profit)||0),0);
    summary.innerHTML=`<div class="route-stats"><span><b>${open.length}</b><small>Parts remaining</small></span><span><b>${vehicles.size}</b><small>Vehicles</small></span><span><b>${usd(profitSum)}</b><small>Est. net profit remaining</small></span></div><p class="muted small">${entries.length-open.length} of ${entries.length} parts marked pulled · Estimates are saved snapshots</p>`;
    const visible=entries.filter(e=>filter==='all'||(filter==='pulled'?e.pulled:!e.pulled)).slice().sort(compare);
    if(!visible.length){list.innerHTML=`<div class="empty">${entries.length?'No parts match this filter.':'No saved parts yet. Open a vehicle and tap “+ Save to pull list” beside an exact recommendation.'}</div>`;return;}
    const yards=new Map();
    for(const e of visible){
      if(!yards.has(e.yard))yards.set(e.yard,{name:e.yardName,cars:new Map()});
      const yard=yards.get(e.yard);
      const vehicle=e.key.split('|part:')[0];
      if(!yard.cars.has(vehicle))yard.cars.set(vehicle,{car:e,parts:[]});
      yard.cars.get(vehicle).parts.push(e);
    }
    let content='';
    for(const [yardId,yard] of yards){
      content+=`<section class="route-yard"><h2>${html(yard.name||YARDS[yardId]?.name||yardId)}</h2>`;
      for(const vehicle of yard.cars.values()){
        const c=vehicle.car,live=findCar(c);
        const vehicleId=c.key.split('|part:')[0];
        content+=`<article class="route-vehicle"><div class="route-vehicle-heading"><div><span class="route-row">Row ${html(c.row||'unknown')}</span><h3>${html([c.year,c.make,c.model].join(' '))}</h3><small>${html([c.space?'Space '+c.space:'',c.stock?'Stock '+c.stock:'',c.vin?'VIN '+c.vin:''].filter(Boolean).join(' · '))}</small></div>${live?`<button type="button" class="btn" data-route-open="${html(vehicleId)}">View vehicle</button>`:'<small class="route-unavailable">Not currently in inventory</small>'}</div>`;
        for(const e of vehicle.parts){
          content+=`<div class="route-item ${e.pulled?'route-done':''}"><label class="route-toggle"><input type="checkbox" data-route-check="${html(e.key)}" ${e.pulled?'checked':''} aria-label="Mark ${html(e.name)} pulled"></label><div class="route-item-main"><strong>${html(e.name)}</strong>${e.variant?`<small>${html(e.variant)}</small>`:''}${e.group!=='general'?`<small class="route-verify">${e.group==='fitment'?'Verify fitment / equipment':'Thin sales evidence — verify'}</small>`:''}<input class="route-note" data-route-note="${html(e.key)}" type="text" value="${html(e.note||'')}" placeholder="Notes / condition / location" aria-label="Notes for ${html(e.name)}"></div><div class="route-item-actions"><strong>${usd(e.profit)}</strong><button type="button" class="btn route-remove" data-route-remove="${html(e.key)}">Remove</button></div></div>`;
        }
        content+='</article>';
      }
      content+='</section>';
    }
    list.innerHTML=content;
  }
  const oldNav=nav;
  nav=function(screenName,...args){const result=oldNav.call(this,screenName,...args);if(screenName==='pullRouteScreen')renderRoute();return result;};
  list.addEventListener('change',event=>{
    const target=event.target;
    if(target.dataset.routeCheck){
      const e=entries.find(item=>item.key===target.dataset.routeCheck);
      if(e){e.pulled=target.checked;save();renderRoute();}
    }else if(target.dataset.routeNote){
      const e=entries.find(item=>item.key===target.dataset.routeNote);
      if(e){e.note=target.value.slice(0,500);save();}
    }
  });
  list.addEventListener('click',event=>{
    const remove=event.target.closest('[data-route-remove]');
    if(remove){entries=entries.filter(e=>e.key!==remove.dataset.routeRemove);save();renderRoute();return;}
    const open=event.target.closest('[data-route-open]');
    if(!open)return;
    const found=entries.find(e=>e.key.startsWith(open.dataset.routeOpen+'|part:'));
    const car=found&&findCar(found);
    if(car){current=car;nav('detail');renderDetail();}
  });
  document.getElementById('pullRouteFilter')?.addEventListener('change',renderRoute);
  function download(content,name,type){
    const url=URL.createObjectURL(new Blob([content],{type}));
    const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  }
  const stamp=()=>new Date().toISOString().slice(0,10);
  document.getElementById('routeExportJson')?.addEventListener('click',()=>download(
    JSON.stringify({format:'pull-list-saved-route-v1',entries},null,2),
    `saved-pull-list-${stamp()}.json`,'application/json'
  ));
  const csv=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  document.getElementById('routeExportCsv')?.addEventListener('click',()=>{
    const columns=['yardName','row','space','year','make','model','stock','vin','name','variant','group','profit','pulled','note'];
    const lines=[columns.join(','),...entries.slice().sort(compare).map(e=>columns.map(k=>csv(e[k])).join(','))];
    download(lines.join('\r\n'),`pull-route-${stamp()}.csv`,'text/csv;charset=utf-8');
  });
  const input=document.getElementById('routeImportFile');
  document.getElementById('routeImportJson')?.addEventListener('click',()=>input?.click());
  input?.addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      if(data?.format!=='pull-list-saved-route-v1'||!Array.isArray(data.entries))throw Error('Not a Saved Pull List JSON backup');
      const imported=data.entries.filter(e=>e&&typeof e.key==='string'&&e.key.length<500&&typeof e.name==='string').slice(0,5000);
      const merged=new Map(entries.map(e=>[e.key,e]));
      for(const e of imported)if(!merged.has(e.key))merged.set(e.key,e);
      entries=Array.from(merged.values());save();renderRoute();
    }catch(error){alert('Import failed: '+error.message);}
    finally{input.value='';}
  });
  document.getElementById('pullRouteBack')?.addEventListener('click',()=>{
    if(history.state?.pullListView==='pullRouteScreen')history.back();else nav('browse');
  });
  updateBadge();
  updatePartButtons();
  console.log('[Pull List] Saved yard route ready');
})();
