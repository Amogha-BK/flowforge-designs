import {readFileSync,writeFileSync} from 'node:fs';
const file=new URL('./dist/invitation.html',import.meta.url);
let html=readFileSync(file,'utf8');
const insertion=String.raw`
// Exported invitations embed their data here; shared invitations read the URL fragment.
const EMBEDDED_CONFIG = /* PERSONALIZED_CONFIG */ null;
let personalized = EMBEDDED_CONFIG;
if (!personalized && location.hash.length > 1 && location.hash.length < 30000) {
 try {
  const packed = location.hash.slice(1).replace(/-/g,'+').replace(/_/g,'/');
  personalized = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(packed),c=>c.charCodeAt(0))));
 } catch { document.addEventListener('DOMContentLoaded',()=>{const p=document.createElement('p');p.textContent='This invitation link is incomplete. Showing a sample invitation; please ask the couple for their latest link.';p.style.cssText='position:fixed;top:0;left:0;right:0;z-index:200;background:#fff4d4;padding:12px;text-align:center;font:13px Arial;color:#732c39';document.body.append(p);}); }
}
if (personalized && typeof personalized === 'object' && !Array.isArray(personalized)) {
 const str=(key,max=120)=>typeof personalized[key]==='string'?personalized[key].slice(0,max).trim():'';
 if (/^#[0-9a-f]{6}$/i.test(str('accent'))) document.documentElement.style.setProperty('--wine',str('accent'));
 if (/^#[0-9a-f]{6}$/i.test(str('paper'))) {
  const paper=str('paper');document.documentElement.style.setProperty('--paper',paper);
  const rgb=paper.slice(1).match(/../g).map(x=>parseInt(x,16));
  if(rgb.reduce((a,b)=>a+b,0)<390){document.documentElement.style.setProperty('--ink','#eee6d5');document.documentElement.style.setProperty('--line','#ac97605c');document.documentElement.classList.add('dark-invite');}
 }
 if(str('bride')&&str('groom')) {
  WEDDING.bride=str('bride',60);WEDDING.groom=str('groom',60);
  WEDDING.initials=WEDDING.bride.charAt(0)+' & '+WEDDING.groom.charAt(0);
  WEDDING.brideParents='her loving family';WEDDING.groomParents='his loving family';
  WEDDING.familyNames='Together with our families';
  WEDDING.blessing='With love, joy and the blessings of our families';
  WEDDING.city=str('city',80);WEDDING.hashtag='#'+WEDDING.bride.split(' ')[0]+'And'+WEDDING.groom.split(' ')[0];
  WEDDING.story=str('story',1200)||'Our favourite chapter is about to begin. With full hearts and our families by our side, we invite you to join us as we celebrate our wedding.';
  const number=str('phone',25).replace(/\D/g,'');
  if(/^[1-9]\d{7,14}$/.test(number)){WEDDING.rsvpWhatsApp=number;WEDDING.contactPhone=number;}
  WEDDING.contactName='The wedding hosts';WEDDING.stay='Please contact the hosts for accommodation recommendations and room availability.';
  WEDDING.travel='Please use the location links below for directions to the wedding venue. Contact the hosts if you need help planning your arrival.';
  const date=str('date',10), time=str('time',5);
  if(/^\d{4}-\d{2}-\d{2}$/.test(date)&&/^\d{2}:\d{2}$/.test(time)&&Number.isFinite(new Date(date+'T'+time+':00+05:30').getTime())){
   WEDDING.weddingDate=date+'T'+time+':00+05:30';
   WEDDING.replyBy=new Date(new Date(WEDDING.weddingDate).getTime()-7*86400000).toISOString();
   const receptionStart=new Date(new Date(WEDDING.weddingDate).getTime()+2.5*3600000).toISOString();
   const event=(name,start,duration,dress,description)=>({name,start,end:new Date(new Date(start).getTime()+duration*3600000).toISOString(),venue:str('venue',120),address:str('address',200),map:'',dress,description,schedule:[]});
   WEDDING.events=[event('The Wedding',WEDDING.weddingDate,2,'Celebration attire','Join us as we begin our forever, surrounded by the people we love.'),event('Reception',receptionStart,3,'Evening celebration wear','Celebrate the newlyweds with dinner, warm wishes and an evening to remember.')];
  }
 }
}
`;
if(!html.includes('const EMBEDDED_CONFIG')) html=html.replace('const $ = id =>',insertion+'\nconst $ = id =>');
html=html.replace("text('blessing',WEDDING.blessing);","text('blessing',WEDDING.blessing);document.querySelector('.seal p').textContent='WITH LOVE & BLESSINGS';");
html=html.replace("$('families').innerHTML=`<p>Daughter of ${esc(WEDDING.brideParents)}</p><p>&</p><p>Son of ${esc(WEDDING.groomParents)}</p>`;","$('families').textContent='Together with our families, we invite you to join our celebration.';");
html=html.replace('</style>',String.raw`
.event-card,.tile{background:color-mix(in srgb,var(--paper),white 5%)}
input:not([type=radio]):not([type=checkbox]),select,textarea{background:var(--paper);color:var(--ink)}
.message{background:color-mix(in srgb,var(--paper),black 8%)}
.dark-invite .muted{color:#c0b9a7}.dark-invite nav,.dark-invite #music{background:var(--paper)}
.dark-invite .gate{background-color:var(--paper)}
.dark-invite .eyebrow{color:#c5b58b}.dark-invite .message{color:#eee6d5}
.flowforge-credit{display:block;text-align:center;margin-top:22px;font:11px Arial,sans-serif;letter-spacing:.4px}
</style>`);
html=html.replace('<p id="footerFamilies"></p>','<p id="footerFamilies"></p><a class="flowforge-credit" href="https://flowforge-wedding-designs.localsmile1.chatgpt.site">Made with love · FlowForge.designs ↗</a>');
html=html.replace('No API keys are needed.','No API keys are needed.');
html=html.replace('-//Shubh Milan//Wedding//EN','-//FlowForge.designs//Wedding//EN');
writeFileSync(file,html);
console.log('Invitation personalization and export are ready.');
