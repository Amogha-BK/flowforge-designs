'use strict';
const designs = [
 {id:'royal-vows',name:'Royal Vows',category:'Traditional',style:'royal',description:'Timeless · Rich · Regal',background:'#e9e0d0',accent:'#792e3c',paper:'#f2e5c6',tag:'THE SIGNATURE EDIT'},
 {id:'blush-bloom',name:'Blush & Bloom',category:'Floral',style:'floral',description:'Romantic · Soft · Dreamy',background:'#efe1dd',accent:'#9a5b66',paper:'#fff6f0',tag:'A LITTLE ROMANCE'},
 {id:'the-modern-muse',name:'The Modern Muse',category:'Minimal',style:'minimal',description:'Clean · Effortless · Modern',background:'#e3e3d9',accent:'#555f4e',paper:'#fbfaf3',tag:'LESS, BUT LOVELIER'},
 {id:'palace-affair',name:'A Palace Affair',category:'Royal',style:'royal',description:'Opulent · Grand · Golden',background:'#e3d9c7',accent:'#caab65',paper:'#632637',tag:'ROYAL BEGINNINGS'},
 {id:'wildflower',name:'Wildflower Whispers',category:'Floral',style:'floral',description:'Botanical · Warm · Organic',background:'#e1e6dc',accent:'#667650',paper:'#f6f3e7',tag:'NATURE’S LOVE LETTER'},
 {id:'forever-us',name:'Forever, Us',category:'Minimal',style:'minimal photo',description:'Intimate · Personal · Timeless',background:'#d8d8cb',accent:'#6c6150',paper:'#fff9eb',tag:'YOUR MOMENT, FRAMED'},
 {id:'shubh-aarambh',name:'Shubh Aarambh',category:'Traditional',style:'royal',description:'Festive · Auspicious · Joyful',background:'#edddc6',accent:'#a05427',paper:'#fff0cc',tag:'AUSPICIOUS BEGINNINGS'},
 {id:'midnight-garden',name:'Midnight Garden',category:'Floral',style:'floral',description:'Moody · Botanical · Elegant',background:'#d8ddd7',accent:'#cfbb87',paper:'#29463b',tag:'AFTER-DARK ROMANCE'},
 {id:'ivory-promise',name:'The Ivory Promise',category:'Minimal',style:'minimal',description:'Understated · Refined · Forever',background:'#e9e4dc',accent:'#8c7656',paper:'#fffdf5',tag:'SIMPLY FOREVER'}
];
const $ = id => document.getElementById(id);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function readSaved(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
function saveLocal(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{toast('Browser storage is unavailable. Copy your invitation link to keep it.');return false;}}
let saved = new Set(readSaved('flowforge-favourites',[])), filter='All', selected=designs[0], currentConfig=null;
let draft=readSaved('flowforge-draft',null);
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function render(){
 const term=$('search').value.toLowerCase().trim();
 const visible=designs.filter(d=>(filter==='All'||(filter==='saved'?saved.has(d.id):d.category===filter))&&`${d.name} ${d.description} ${d.category}`.toLowerCase().includes(term));
 $('templates').innerHTML=visible.map(d=>`<article class="template-card"><div class="template-art style-${d.style.replace(' ',' style-')}" style="background:${d.background}"><span class="template-tag">${d.tag}</span><button class="save" data-save="${d.id}" aria-label="${saved.has(d.id)?'Unsave':'Save'} ${d.name}" aria-pressed="${saved.has(d.id)}">${saved.has(d.id)?'♥':'♡'}</button><div class="paper-card" style="--accent:${d.accent};--card:${d.paper}"><div class="paper-inner"><p class="paper-small">TOGETHER WITH OUR FAMILIES</p><p class="paper-names">Meera<br><i>&</i><br>Aarav</p><p class="paper-small">THE BEGINNING OF FOREVER</p><p class="paper-date">13 · 02 · 2027</p><p class="paper-small">JAIPUR, RAJASTHAN</p>${d.category==='Floral'?'<span class="paper-flower" aria-hidden="true">❦</span><span class="paper-flower top" aria-hidden="true">❦</span>':''}</div></div></div><div class="template-info"><div><h3>${d.name}</h3><p>${d.description}</p></div><strong>₹699</strong></div><div class="card-actions"><button data-preview="${d.id}">▷ &nbsp; Live preview</button><button data-create="${d.id}">Make it yours ↗</button></div></article>`).join('');
 $('empty').hidden=visible.length>0;
 $('result-count').textContent=`${visible.length} thoughtfully designed ${visible.length===1?'beginning':'beginnings'}`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();});
$('search').addEventListener('input',render);
$('templates').onclick=event=>{const target=event.target.closest('button');if(!target)return;const id=target.dataset.save||target.dataset.preview||target.dataset.create;const design=designs.find(d=>d.id===id);if(!design)return;if(target.dataset.save){saved.has(id)?saved.delete(id):saved.add(id);saveLocal('flowforge-favourites',[...saved]);render();}else if(target.dataset.preview)openPreview(design);else openBuilder(design);};
function encode(config){const bytes=new TextEncoder().encode(JSON.stringify(config));return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function invitationURL(config){const url=new URL('invitation.html',location.href);url.hash=encode(config);return url.href;}
function demoConfig(design){return {design:design.id,accent:design.accent,paper:design.paper};}
function openPreview(design,config){selected=design;$('preview-title').textContent=design.name;$('preview-frame').src=invitationURL(config||demoConfig(design));$('preview-customize').hidden=!!config;$('preview-dialog').showModal();}
document.querySelectorAll('dialog .close').forEach(button=>button.onclick=()=>button.closest('dialog').close());
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}));
$('preview-dialog').addEventListener('close',()=>{$('preview-frame').src='about:blank';});
['hero-preview','card-preview','experience-preview'].forEach(id=>$(id).onclick=()=>openPreview(designs[0]));
$('preview-customize').onclick=()=>{$('preview-dialog').close();openBuilder(selected);};
$('design').innerHTML=designs.map(d=>`<option value="${d.id}">${esc(d.name)} · ₹699</option>`).join('');
function openBuilder(design){selected=design;$('builder').hidden=false;$('share-panel').hidden=true;const values=draft||{bride:'',groom:'',date:'2027-02-13',time:'18:00',city:'',venue:'',address:'',story:'',phone:''};for(const [key,value]of Object.entries(values)){if($('builder').elements.namedItem(key))$('builder').elements.namedItem(key).value=value;}$('design').value=design.id;$('form-error').textContent='';$('builder-dialog').showModal();}
$('resume').onclick=()=>openBuilder(designs.find(d=>d.id===draft?.design)||designs[0]);
if(draft)$('resume').innerHTML='My invitation <span>↗</span>';
$('builder').addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.target));for(const key of ['bride','groom','city','venue','address']){data[key]=data[key].trim();if(!data[key]){$('form-error').textContent='Please fill in the names, city and venue details.';event.target.elements.namedItem(key).focus();return;}}
 data.phone=data.phone.replace(/\D/g,'');if(!/^[1-9]\d{7,14}$/.test(data.phone)){$('form-error').textContent='Enter a valid WhatsApp number with country code (8–15 digits).';return;}
 const weddingDate=new Date(`${data.date}T${data.time}:00+05:30`);if(!Number.isFinite(weddingDate.getTime())){$('form-error').textContent='Please enter a valid wedding date and time.';return;}
 selected=designs.find(d=>d.id===data.design)||designs[0];draft=data;saveLocal('flowforge-draft',data);$('resume').innerHTML='My invitation <span>↗</span>';
 currentConfig={...data,accent:selected.accent,paper:selected.paper};const url=invitationURL(currentConfig);$('share-url').value=url;
 $('whatsapp-share').href=`https://wa.me/?text=${encodeURIComponent(`Together with our families, ${data.bride} & ${data.groom} invite you to celebrate our wedding. Open your invitation: ${url}`)}`;
 $('builder').hidden=true;$('share-panel').hidden=false;$('builder-dialog').scrollTop=0;
});
$('copy-link').onclick=async()=>{try{await navigator.clipboard.writeText($('share-url').value);toast('Invitation link copied. Share a little joy!');}catch{$('share-url').select();toast('Select and copy the invitation link above.');}};
$('open-created').onclick=()=>{const config=currentConfig;$('builder-dialog').close();openPreview(selected,config);};
$('edit-again').onclick=()=>{$('share-panel').hidden=true;$('builder').hidden=false;};
$('download').onclick=async()=>{try{const response=await fetch('invitation.html');if(!response.ok)throw Error('Template unavailable');let html=await response.text();html=html.replace('/* PERSONALIZED_CONFIG */ null',JSON.stringify(currentConfig).replace(/</g,'\\u003c'));const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='our-wedding-invitation.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Invitation downloaded. Keep it forever.');}catch{toast('Download unavailable. Use the invitation link to share instead.');}};
$('privacy').onclick=()=>$('info-dialog').showModal();
$('clear-data').onclick=()=>{try{localStorage.removeItem('flowforge-draft');localStorage.removeItem('flowforge-favourites');saved=new Set();draft=null;currentConfig=null;$('builder').reset();$('share-url').value='';$('resume').innerHTML='Create your invite <span>↗</span>';render();$('clear-status').textContent='Your draft and favourites have been cleared from this browser.';}catch{$('clear-status').textContent='Browser storage is unavailable.';}};
document.querySelector('.menu-toggle').onclick=function(){const expanded=this.getAttribute('aria-expanded')!=='true';this.setAttribute('aria-expanded',String(expanded));document.querySelector('header nav').classList.toggle('expanded',expanded);};
document.querySelectorAll('header nav a').forEach(link=>link.onclick=()=>{document.querySelector('header nav').classList.remove('expanded');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');});
$('year').textContent=new Date().getFullYear();render();
