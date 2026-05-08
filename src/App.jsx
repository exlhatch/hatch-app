import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   E P H E M E R A  —  G U I D I N G   I N T E L L I G E N C E
   Live river intelligence for fly fishers
   ═══════════════════════════════════════════════════════════════════════════ */

// ── BRAND ──
const EphemeraLogo = ({ s = 140 }) => (
  <svg width={s} height={s * 0.5} viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M150 45 Q120 10 95 30 Q115 40 140 48Z" fill="#C4973A" opacity="0.25"/><path d="M150 45 Q180 10 205 30 Q185 40 160 48Z" fill="#C4973A" opacity="0.25"/>
    <path d="M150 52 Q135 35 125 42 Q135 48 146 52Z" fill="#C4973A" opacity="0.15"/><path d="M150 52 Q165 35 175 42 Q165 48 154 52Z" fill="#C4973A" opacity="0.15"/>
    <line x1="150" y1="38" x2="150" y2="68" stroke="#C4973A" strokeWidth="0.8" opacity="0.2"/>
    <path d="M150 68 Q147 76 144 82" stroke="#C4973A" strokeWidth="0.5" opacity="0.15" fill="none"/>
    <path d="M150 68 Q153 76 156 82" stroke="#C4973A" strokeWidth="0.5" opacity="0.15" fill="none"/>
    <line x1="50" y1="88" x2="250" y2="88" stroke="#C4973A" strokeWidth="0.4" opacity="0.25"/>
    <text x="150" y="115" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="38" fontWeight="900" fill="#EDE5D5" letterSpacing="6">EPHEMERA</text>
    <text x="150" y="136" textAnchor="middle" fontFamily="'Barlow',sans-serif" fontSize="8" fontWeight="600" fill="#C4973A" letterSpacing="5">GUIDING INTELLIGENCE</text>
    <line x1="50" y1="143" x2="250" y2="143" stroke="#C4973A" strokeWidth="0.4" opacity="0.25"/>
  </svg>
);
const Mark = () => (
  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
    <svg width="18" height="18" viewBox="0 0 20 20"><path d="M10 5 Q13.5 1 15.5 4 Q12.5 6.5 10 7.5Z" fill="#C4973A" opacity="0.3"/><path d="M10 5 Q6.5 1 4.5 4 Q7.5 6.5 10 7.5Z" fill="#C4973A" opacity="0.3"/></svg>
    <span style={{ fontFamily:"var(--sf)", fontSize:15, fontWeight:900, color:"#EDE5D5", letterSpacing:"0.15em" }}>EPHEMERA</span>
  </div>
);

/* ═══ DATA ═══ */
const RIVERS = {
  test:{n:"River Test",ea:"Test",desc:"The quintessential chalkstream. Birthplace of dry fly fishing.",beats:[
    {id:"broadlands",n:"Broadlands",lat:50.988,lng:-1.499},{id:"timsbury",n:"Timsbury",lat:51.015,lng:-1.488},{id:"mottisfont",n:"Mottisfont",lat:51.057,lng:-1.533},{id:"horsebridge",n:"Horsebridge",lat:51.078,lng:-1.533},{id:"park-stream",n:"Park Stream",lat:51.079,lng:-1.530},{id:"stockbridge",n:"Stockbridge",lat:51.089,lng:-1.494},{id:"leckford",n:"Leckford",lat:51.112,lng:-1.478},{id:"longparish",n:"Longparish",lat:51.178,lng:-1.401},{id:"whitchurch",n:"Whitchurch",lat:51.225,lng:-1.337},{id:"laverstoke",n:"Laverstoke",lat:51.228,lng:-1.296}]},
  itchen:{n:"River Itchen",ea:"Itchen",desc:"Premier chalkstream. Technical, cathedral water.",beats:[
    {id:"itchen-abbas",n:"Itchen Abbas",lat:51.089,lng:-1.227},{id:"martyr-worthy",n:"Martyr Worthy",lat:51.083,lng:-1.262},{id:"abbotts-barton",n:"Abbotts Barton",lat:51.072,lng:-1.313},{id:"twyford",n:"Twyford",lat:51.023,lng:-1.328}]},
  kennet:{n:"River Kennet",ea:"Kennet",desc:"Diverse chalkstream. Strong olives. Fine grayling.",beats:[
    {id:"ramsbury",n:"Ramsbury",lat:51.443,lng:-1.596},{id:"littlecote",n:"Littlecote",lat:51.428,lng:-1.541},{id:"hungerford",n:"Hungerford",lat:51.413,lng:-1.515},{id:"kintbury",n:"Kintbury",lat:51.399,lng:-1.448}]},
  anton:{n:"River Anton",ea:"Anton",desc:"Intimate Test tributary. Reliable early hatches.",beats:[
    {id:"goodworth",n:"Goodworth Clatford",lat:51.184,lng:-1.513},{id:"anton-lakes",n:"Anton Lakes",lat:51.205,lng:-1.481}]},
  avon:{n:"Hampshire Avon",ea:"Avon Hampshire",desc:"Broad, powerful. Excellent mayfly. Big fish.",beats:[
    {id:"amesbury",n:"Amesbury",lat:51.172,lng:-1.774},{id:"netheravon",n:"Netheravon",lat:51.226,lng:-1.792},{id:"salisbury",n:"Salisbury",lat:51.068,lng:-1.798}]},
  wylye:{n:"River Wylye",ea:"Wylye",desc:"Beautiful, underrated. Superb evening rises.",beats:[
    {id:"heytesbury",n:"Heytesbury",lat:51.186,lng:-2.099},{id:"codford",n:"Codford",lat:51.169,lng:-2.059}]},
};

const H=[
  {id:"danica",nm:"Ephemera danica",cm:"The Mayfly",cat:"m",t:1,s:135,e:172,tMn:12,tMx:18,pk:[12,13,14,15,16],hk:"10-12 LD",sz:"20-25mm"},
  {id:"vulgata",nm:"E. vulgata",cm:"Dark Mackerel",cat:"m",t:2,s:140,e:178,tMn:13,tMx:17,pk:[13,14,15,16],hk:"10-12",sz:"18-22mm"},
  {id:"ldo",nm:"Baetis rhodani",cm:"Large Dark Olive",cat:"o",t:2,s:60,e:150,tMn:7,tMx:14,pk:[10,11,12,13],hk:"14-16",sz:"10-12mm"},
  {id:"mo",nm:"Baetis vernus",cm:"Medium Olive",cat:"o",t:3,s:100,e:180,tMn:10,tMx:16,pk:[11,12,13,14],hk:"16",sz:"8-10mm"},
  {id:"bwo",nm:"Serratella ignita",cm:"Blue-winged Olive",cat:"o",t:2,s:150,e:290,tMn:12,tMx:18,pk:[17,18,19,20],hk:"14-16",sz:"9-11mm"},
  {id:"ib",nm:"Baetis niger",cm:"Iron Blue",cat:"o",t:2,s:105,e:165,tMn:8,tMx:14,pk:[11,12,13,14],hk:"16-18",sz:"6-8mm"},
  {id:"pw",nm:"Baetis fuscatus",cm:"Pale Watery",cat:"o",t:3,s:125,e:260,tMn:12,tMx:18,pk:[14,15,16,17,18],hk:"16-18",sz:"6-8mm"},
  {id:"ss",nm:"C. luteolum",cm:"Small Spurwing",cat:"o",t:3,s:135,e:270,tMn:13,tMx:18,pk:[15,16,17,18],hk:"18-20",sz:"5-7mm"},
  {id:"ymd",nm:"H. sulphurea",cm:"Yellow May Dun",cat:"o",t:3,s:135,e:180,tMn:12,tMx:17,pk:[18,19,20],hk:"14",sz:"12-14mm"},
  {id:"caen",nm:"Caenis spp.",cm:"Angler's Curse",cat:"o",t:3,s:155,e:250,tMn:15,tMx:20,pk:[5,6,7,19,20,21],hk:"20-22",sz:"3-5mm"},
  {id:"gran",nm:"B. subnubilus",cm:"Grannom",cat:"c",t:2,s:100,e:130,tMn:9,tMx:14,pk:[11,12,13,14,15],hk:"14-16",sz:"10-12mm"},
  {id:"sedge",nm:"Trichoptera",cm:"Sedges",cat:"c",t:2,s:135,e:275,tMn:13,tMx:20,pk:[19,20,21],hk:"12-16",sz:"8-18mm"},
  {id:"haw",nm:"Bibio marci",cm:"Hawthorn Fly",cat:"t",t:2,s:108,e:135,tMn:10,tMx:16,pk:[11,12,13,14,15,16],hk:"12-14",sz:"12-14mm"},
  {id:"bg",nm:"Bibio johannis",cm:"Black Gnat",cat:"t",t:3,s:120,e:250,tMn:12,tMx:20,pk:[12,13,14,15,16,17],hk:"16-18",sz:"5-8mm"},
  {id:"smut",nm:"Simulium",cm:"Reed Smuts",cat:"t",t:3,s:135,e:270,tMn:13,tMx:20,pk:[10,11,12,13,14,15,16,17],hk:"20-24",sz:"2-4mm"},
];

const CC={m:"#C4973A",o:"#7A9E7E",c:"#8B7355",t:"#6B8DA6"};
const CL={m:"MAYFLY",o:"UPWINGED",c:"CADDIS",t:"TERRESTRIAL"};

const FL={
  dry:[{nm:"Grey Wulff",sz:"10-14",mt:["danica","vulgata"],ef:5,nt:"Classic mayfly. Floats forever."},{nm:"Spent Gnat",sz:"10-12",mt:["danica","vulgata"],ef:5,nt:"Spinner fall essential."},{nm:"Kite's Imperial",sz:"14-16",mt:["ldo","mo"],ef:5,nt:"THE olive pattern."},{nm:"Sherry Spinner",sz:"14-16",mt:["bwo"],ef:5,nt:"BWO spinner. Evening essential."},{nm:"Iron Blue Dun",sz:"16-18",mt:["ib"],ef:4,nt:"Foul weather."},{nm:"Adams",sz:"14-18",mt:["ldo","mo","bwo"],ef:4,nt:"Searching pattern."},{nm:"Last Hope",sz:"16-20",mt:["pw","ss","caen"],ef:4,nt:"Ultra-selective fish."},{nm:"Elk Hair Caddis",sz:"12-16",mt:["sedge"],ef:4,nt:"Static or skated."},{nm:"Griffith's Gnat",sz:"18-24",mt:["smut","caen"],ef:3,nt:"Smuts and caenis."}],
  emerger:[{nm:"Klinkhamer Special",sz:"12-18",mt:["ldo","mo","bwo","danica"],ef:5,nt:"Most versatile chalkstream fly."},{nm:"Danica Emerger",sz:"10-12 LD",mt:["danica","vulgata"],ef:5,nt:"THE mayfly fly. In the film."},{nm:"CDC Shuttlecock",sz:"14-20",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Tie sparse. Devastating."},{nm:"F Fly",sz:"16-20",mt:["pw","ss","smut","caen"],ef:4,nt:"Two CDC feathers. Simple, deadly."},{nm:"Grannom Pupa",sz:"14-16",mt:["gran"],ef:3,nt:"Green body. Subsurface."}],
  nymph:[{nm:"Pheasant Tail Nymph",sz:"14-18",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Desert island nymph."},{nm:"Gold-Ribbed Hare's Ear",sz:"14-16",mt:["ldo","mo","bwo"],ef:5,nt:"Buggy. Works when nothing else does."},{nm:"Sawyer's Killer Bug",sz:"14-16",mt:["ldo","mo","pw"],ef:4,nt:"Cold water killer."},{nm:"Danica Nymph",sz:"10-12 LD",mt:["danica","vulgata"],ef:4,nt:"Pre-hatch essential. Deep gravel."},{nm:"Czech Nymph",sz:"12-16",mt:["ldo","mo","gran"],ef:3,nt:"Check beat rules."}],
};

const WEBCAMS=[
  {nm:"River Test, Whitchurch",url:"https://www.farsondigitalwatercams.com/locations/whitchurch",river:"test",desc:"HD live cam. Whitchurch Fulling Mill beat. Farson Digital Watercams.",embed:"https://www.farsondigitalwatercams.com/locations/whitchurch"},
  {nm:"River Test, Testcombe",url:"https://www.farsondigitalwatercams.com/",river:"test",desc:"Check Farson Digital for additional Test cameras."},
  {nm:"River Itchen, Winchester",url:"https://www.farsondigitalwatercams.com/",river:"itchen",desc:"Check Farson Digital for Itchen cameras."},
];

const LEARN=[
  {lvl:"Beginner",clr:"#6B8DA6",items:[
    {t:"What is fly fishing?",d:"The basics. How it differs from other fishing. Why chalkstreams are special."},
    {t:"Essential kit",d:"Rod, reel, line, leader, tippet. What you actually need to start. Nothing else."},
    {t:"Your first cast",d:"The overhead cast. How to load the rod. Common mistakes and how to fix them."},
    {t:"Reading the water",d:"Where fish sit and why. Current, depth, cover. What to look for."},
    {t:"Your first fly",d:"The Klinkhamer. Why it works. How to tie it on. How to fish it."},
    {t:"Watercraft basics",d:"How to approach the river. Why stealth matters. Walking, wading, watching."},
    {t:"Catch and release",d:"How to handle fish properly. Barbless hooks. Net, unhook, return."},
    {t:"River etiquette",d:"The unwritten rules. Upstream right of way. Spacing. Respect the beat."},
  ]},
  {lvl:"Intermediate",clr:"#7A9E7E",items:[
    {t:"Understanding hatches",d:"Mayflies, olives, sedges. What they look like. When they hatch. Why it matters."},
    {t:"Matching the hatch",d:"Identifying what's on the water. Choosing the right fly. Size over pattern."},
    {t:"Presentation",d:"Drag-free drift. Mending line. Slack line casts. Why presentation beats pattern."},
    {t:"Nymph fishing",d:"Upstream nymph. Czech nymphing. Induced take. Reading the leader."},
    {t:"Emerger techniques",d:"Fishing the film. Klinkhamer, shuttlecock, suspender. The crucial transition zone."},
    {t:"Leader construction",d:"Tapered leaders. Tippet rings. Fluorocarbon vs nylon. When to use what."},
    {t:"Spotting fish",d:"Polaroids, angles, shadows. Seeing fish before they see you. Reading behaviour."},
    {t:"Evening rise tactics",d:"BWO, sherry spinners, sedges. The magic hour. How to fish it."},
  ]},
  {lvl:"Advanced",clr:"#C4973A",items:[
    {t:"Selective trout",d:"Why fish refuse. Micro-drag. Tippet diameter. The Last Hope approach."},
    {t:"Entomology deep dive",d:"Life cycles. Nymph behaviour. Emergence triggers. Temperature and pressure."},
    {t:"Upstream dry fly",d:"The Halford method. Casting to rising fish. Position, timing, accuracy."},
    {t:"Sight nymphing",d:"Watching the take. Plume tips. Indicator-free fishing. The ultimate skill."},
    {t:"Low water tactics",d:"Summer conditions. Longer leaders. Smaller flies. Dawn and dusk."},
    {t:"River management",d:"Weed cutting, stocking policy, habitat. Understanding the beat you fish."},
    {t:"Fly tying for chalkstreams",d:"Tying the essential patterns. Materials, proportions, the key dozen flies."},
    {t:"Guiding and teaching",d:"Sharing the knowledge. Teaching casting. Building a guiding business."},
  ]},
];

const GUIDES=[
  {nm:"Charles Jardine",type:"Guide & Casting Coach",river:"Test, Itchen",note:"One of the UK's finest. Author, artist, instructor.",verified:true},
  {nm:"Alex Jardine",type:"Professional Guide",river:"Test, Itchen, Kennet",note:"Chalkstream specialist. Full day and half day guided sessions.",verified:true},
  {nm:"Dermot Wilson School",type:"Fishing School",river:"River Test",note:"Established school at Nether Wallop. Beginners to advanced.",verified:true},
  {nm:"Orvis Stockbridge",type:"Guide Service & School",river:"River Test",note:"Guided days, casting instruction, equipment demos.",verified:true},
];

const LOCALS={
  test:{tackle:[{nm:"Robjents of Stockbridge",a:"High Street, Stockbridge",n:"THE chalkstream shop."},{nm:"Orvis Stockbridge",a:"High Street, Stockbridge",n:"Flagship. Rod demos."}],
  food:[{nm:"The Mayfly",tp:"Pub",a:"Testcombe",n:"ON the river. Book during mayfly."},{nm:"The Greyhound",tp:"Pub",a:"Stockbridge",n:"Good food, good beer."},{nm:"Thyme & Tides",tp:"Cafe",a:"Stockbridge",n:"Quick fuel."},{nm:"The Peat Spade",tp:"Inn",a:"Longstock",n:"Boutique. Great food."},{nm:"The White Hart",tp:"Pub",a:"Whitchurch",n:"Upper river."}]},
};

/* ═══ API LAYER ═══ */
const cache={};
const EA="https://environment.data.gov.uk/hydrology";

async function fetchEA(riverName){const k=`st_${riverName}`;if(cache[k])return cache[k];try{const r=await fetch(`${EA}/id/stations?riverName=${encodeURIComponent(riverName)}&_limit=50`);if(!r.ok)throw 0;const d=await r.json();const s=(d.items||[]).map(s=>({id:s["@id"]?.split("/").pop(),lat:s.lat,lng:s.long,measures:(s.measures||[]).map(m=>({id:typeof m==="string"?m:m["@id"],p:typeof m==="string"?null:(m.parameterName||m.parameter)}))}));cache[k]=s;return s}catch{return null}}

async function fetchR(mId,days=30){if(!mId)return null;const k=`r_${mId}`;const n=Date.now();if(cache[k]&&n-cache[k].t<9e5)return cache[k].d;try{const since=new Date(Date.now()-days*864e5).toISOString().split("T")[0];const u=mId.startsWith("http")?`${mId}/readings?since=${since}&_sorted&_limit=2000`:`${EA}/id/measures/${mId}/readings?since=${since}&_sorted&_limit=2000`;const r=await fetch(u);if(!r.ok)throw 0;const d=await r.json();const rd=(d.items||[]).map(r=>({dt:r.dateTime,v:r.value})).filter(r=>r.v!=null);cache[k]={d:rd,t:n};return rd}catch{return null}}

async function fetchWx(lat,lng){const k=`wx_${lat.toFixed(2)}_${lng.toFixed(2)}`;const n=Date.now();if(cache[k]&&n-cache[k].t<36e5)return cache[k].d;try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,precipitation_probability,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=Europe/London&forecast_days=7`);if(!r.ok)throw 0;const d=await r.json();cache[k]={d,t:n};return d}catch{return null}}

function nearStn(stns,lat,lng){if(!stns?.length)return null;let b=null,bd=Infinity;stns.forEach(s=>{const d=Math.sqrt((s.lat-lat)**2+(s.lng-lng)**2);if(d<bd){bd=d;b=s}});return b}

function parseWx(wx){if(!wx?.hourly||!wx?.daily)return null;const{hourly:h,daily:d}=wx;const days=[];for(let i=0;i<(d.time?.length||0)&&i<7;i++){const dt=new Date(d.time[i]);const dn=i===0?"Today":i===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"});const df=dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"});const hrs=[];for(let hr=5;hr<=22;hr++){const idx=i*24+hr;if(idx>=(h.time?.length||0))break;hrs.push({h:hr,airT:h.temperature_2m?.[idx],rain:h.precipitation_probability?.[idx],pr:h.pressure_msl?.[idx]?Math.round(h.pressure_msl[idx]):null,ws:h.wind_speed_10m?.[idx]?Math.round(h.wind_speed_10m[idx]*0.621):null,wd:h.wind_direction_10m?.[idx]})}
  days.push({dn,df,aH:d.temperature_2m_max?.[i]?Math.round(d.temperature_2m_max[i]):null,aL:d.temperature_2m_min?.[i]?Math.round(d.temperature_2m_min[i]):null,rain:Math.round(hrs.reduce((s,h)=>Math.max(s,h.rain||0),0)),pr:hrs.find(h=>h.h===12)?.pr,ws:d.wind_speed_10m_max?.[i]?Math.round(d.wind_speed_10m_max[i]*0.621):null,wd:degC(hrs.find(h=>h.h===12)?.wd),hrs})}return days}

function degC(d){if(d==null)return"?";return["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"][Math.round(d/22.5)%16]}

async function fetchLive(rId,bt){const rv=RIVERS[rId];const[stns,wx]=await Promise.all([fetchEA(rv.ea),fetchWx(bt.lat,bt.lng)]);let lL=null,lT=null,lF=null;if(stns){const nr=nearStn(stns,bt.lat,bt.lng);if(nr){const ms=nr.measures;const lm=ms.find(m=>(m.p||m.id||"").toLowerCase().includes("level"));const tm=ms.find(m=>(m.p||m.id||"").toLowerCase().includes("temp"));const fm=ms.find(m=>(m.p||m.id||"").toLowerCase().includes("flow"));const[lr,tr,fr]=await Promise.all([lm?fetchR(lm.id,45):null,tm?fetchR(tm.id,45):null,fm?fetchR(fm.id,45):null]);if(lr?.length)lL=lr[lr.length-1].v;if(tr?.length)lT=tr[tr.length-1].v;if(fr?.length)lF=fr[fr.length-1].v}}
return{level:lL,temp:lT,flow:lF,weather:parseWx(wx),live:lL!==null||wx!==null}}

/* ═══ FALLBACK SIM ═══ */
function sR(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
function simD(r,b){const seed=(r+b).split("").reduce((a,c)=>a+c.charCodeAt(0),0);const rn=sR(seed);const now=new Date();const o=[];for(let i=45;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const dy=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);o.push({temp:+(7.5+7.5*Math.sin((dy-80)*Math.PI/183)+(rn()-0.5)*3).toFixed(1),level:+(0.42+0.18*Math.sin((dy-30)*Math.PI/183)+(rn()-0.4)*0.12).toFixed(3),dy})}o.forEach(d=>d.flow=+(d.level*2.6+0.3).toFixed(2));return o}
function simWx(seed){const r=sR(seed+777);const now=new Date();return Array.from({length:7},(_,d)=>{const dt=new Date(now);dt.setDate(dt.getDate()+d);const aH=Math.round(16+d*0.6+(r()-0.3)*4),aL=Math.round(aH-7-r()*3);return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH,aL,pr:Math.round(1016+(r()-0.5)*16-d*1.2),rain:Math.round(Math.max(0,Math.min(95,10+d*8+(r()-0.5)*30))),ws:Math.round(5+r()*10),wd:["SW","S","SE","W","NW"][Math.floor(r()*5)],hrs:Array.from({length:18},(_,h)=>({h:h+5,airT:+(aL+(aH-aL)*Math.sin(h*Math.PI/18)).toFixed(1),rain:Math.round(r()*30),pr:Math.round(1016+(r()-0.5)*10),ws:Math.round(5+r()*8)}))}});}

/* ═══ PREDICTION ═══ */
function pred(wt,lv,dy){return H.map(sp=>{let sF=0;if(dy>=sp.s&&dy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=Math.max(0,1-((dy-m)/r)**2)}else if(dy>=sp.s-14&&dy<sp.s)sF=(dy-sp.s+14)/28;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(wt>=sp.tMn&&wt<=sp.tMx)tF=Math.max(0,1-((wt-tm)/(tr*1.2))**2);else if(wt>=sp.tMn-2)tF=Math.max(0,(wt-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*(lv>0.65?0.7:lv<0.3?0.85:1)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score)}

function hInt(wt,dy,hr){let hi=0;H.forEach(sp=>{if(dy<sp.s-10||dy>sp.e+10)return;let sf=0;if(dy>=sp.s&&dy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((dy-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}

function genLR(wt,dy){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=dy+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);let oa=0;H.forEach(sp=>{if(md>=sp.s&&md<=sp.e)oa+=Math.max(0,1-((md-(sp.s+sp.e)/2)/((sp.e-sp.s)/2))**2)*(sp.t===1?3:sp.t===2?1.5:0.8)});return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} - ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),oa:+Math.min(10,oa).toFixed(1),cf:w<2?"High":w<4?"Med":"Low"}})}

function getRpts(r){const a={test:[{d:"May 8",bt:"Stockbridge",au:"River Keeper",src:"Field",tx:"Sustained danica from 12:30. Fish up everywhere. Spinners falling by 4:30. Best mayfly day yet.",tg:["danica","spinners"],v:true},{d:"May 7",bt:"Park Stream",au:"Beat Guide",src:"Guide",tx:"First danica midday. Two good fish on emergers. Water 13.8C. Park Stream fishes ahead of main river.",tg:["danica","emergers"],v:true},{d:"May 6",bt:"Leckford",au:"Estate Keeper",src:"Estate",tx:"Strong olives. Hawthorn about. Water climbing. Ranunculus thriving.",tg:["olives","hawthorn"],v:true},{d:"May 5",bt:"Stockbridge",au:"Test Valley FC",src:"Club",tx:"Iron blues and olives. Ranunculus excellent. Early danica seen.",tg:["iron blue","olives"],v:true}],itchen:[{d:"May 8",bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Steady olives. Handful of early danica.",tg:["olives"],v:true}],kennet:[{d:"May 8",bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Olive hatch midday. Grayling on nymphs.",tg:["olives"],v:false}],anton:[{d:"May 7",bt:"Goodworth Clatford",au:"Guide",src:"Guide",tx:"Olives from 10am. Water 13.1C.",tg:["olives"],v:true}],avon:[{d:"May 7",bt:"Amesbury",au:"Salisbury AC",src:"Club",tx:"Big fish showing. Danica imminent.",tg:["big fish"],v:true}],wylye:[{d:"May 6",bt:"Heytesbury",au:"@wylye_ff",src:"Social",tx:"Gorgeous evening rise. Pale wateries.",tg:["evening rise"],v:false}]};return a[r]||[]}

/* ═══ STYLES ═══ */
const K={bg:"#0F0E0C",c1:"#181714",c2:"#201E1A",c3:"#2A2722",bd:"#332F29",tx:"#EDE5D5",txM:"#9B907F",txD:"#5A5448",ac:"#C4973A",acS:"#C4973A18",acB:"#C4973A38",gn:"#7A9E7E",rd:"#C17B6A",og:"#D4893A",bl:"#6B8DA6"};
const hC=s=>s>70?K.ac:s>40?K.gn:s>15?K.txM:K.txD;
const iC=v=>v>=7?"#C4973A":v>=5?"#A8832E":v>=3?"#7A9E7E":v>=1.5?"#3E5A40":v>0.3?"#252E26":K.c2;

/* ═══ MAIN ═══ */
export default function App(){
  const[riv,setRiv]=useState("test");
  const[bIdx,setBIdx]=useState(5);
  const[adv,setAdv]=useState(false);
  const[nav,setNav]=useState("river");
  const[sub,setSub]=useState("forecast");
  const[pick,setPick]=useState(false);
  const[hDay,setHDay]=useState(0);
  const[flyT,setFlyT]=useState("dry");
  const[loading,setLoading]=useState(true);
  const[live,setLive]=useState(null);
  const[dSrc,setDSrc]=useState("loading");
  const[lastUp,setLastUp]=useState(null);
  const[userRpts,setUserRpts]=useState([]);
  const[rptBeat,setRptBeat]=useState("");
  const[rptText,setRptText]=useState("");
  const[learnLvl,setLearnLvl]=useState(0);
  const[planBeat,setPlanBeat]=useState("");
  const[planDate,setPlanDate]=useState("");
  const[plans,setPlans]=useState([]);

  const rv=RIVERS[riv],bt=rv.beats[bIdx]||rv.beats[0];
  const seed=(riv+bt.id).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  const simulated=useMemo(()=>simD(riv,bt.id),[riv,bt.id]);
  const simWxD=useMemo(()=>simWx(seed),[seed]);

  const doFetch=useCallback(async()=>{setLoading(true);try{const d=await fetchLive(riv,bt);setLive(d);setDSrc(d.live?"live":"sim");setLastUp(new Date())}catch{setDSrc("sim")}setLoading(false)},[riv,bt]);
  useEffect(()=>{doFetch()},[doFetch]);
  useEffect(()=>{const i=setInterval(doFetch,9e5);return()=>clearInterval(i)},[doFetch]);
  useEffect(()=>{setBIdx(0)},[riv]);

  const cT=live?.temp??simulated[simulated.length-1].temp;
  const cL=live?.level??simulated[simulated.length-1].level;
  const cF=live?.flow??simulated[simulated.length-1].flow;
  const pT=simulated.length>1?simulated[simulated.length-2].temp:cT;
  const dy=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/864e5);
  const wx=live?.weather||simWxD;

  const spp=useMemo(()=>pred(cT,cL,dy),[cT,cL,dy]);
  const lr=useMemo(()=>genLR(cT,dy),[cT,dy]);
  const rpts=useMemo(()=>getRpts(riv),[riv]);
  const dan=spp.find(s=>s.id==="danica");
  const topH=spp[0];
  const hIdx=Math.round(spp.reduce((s,h)=>s+h.score*(h.t===1?3:h.t===2?1.5:0.8),0)/spp.reduce((s,h)=>s+100*(h.t===1?3:h.t===2?1.5:0.8),0)*100);
  const lv=cL>0.6?{t:"HIGH",c:K.rd}:cL>0.45?{t:"NORMAL",c:K.gn}:{t:"LOW",c:K.bl};
  const actIds=spp.filter(s=>s.score>10).map(s=>s.id);

  const hourlyD=useMemo(()=>{if(!wx)return[];return wx.map((d,i)=>({...d,hrs:(d.hrs||[]).map(h=>{const wt=+(cT+(((h.airT||15)-(d.aH+d.aL)/2)*0.15)).toFixed(1);return{...h,wt,hi:+hInt(wt,dy+i,h.h).toFixed(1)}})}));},[wx,cT,dy]);

  const submitRpt=()=>{if(rptBeat&&rptText.length>10){setUserRpts(p=>[{d:new Date().toLocaleDateString("en-GB",{month:"short",day:"numeric"}),bt:rptBeat,tx:rptText,au:"You",src:"User",v:false,tg:[],id:Date.now()},...p]);setRptText("");setRptBeat("")}};

  const Sec=({label:l,children:c})=><div style={{marginBottom:20}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.25em",color:K.txD,marginBottom:10}}>{l}</div>{c}</div>;
  const Cd=({children:c,accent:a,style:s})=><div style={{background:a?K.acS:K.c1,borderRadius:10,border:`1px solid ${a?K.acB:K.bd}`,overflow:"hidden",...s}}>{c}</div>;

  const navItems=[{id:"river",l:"River",i:"◉"},{id:"forecast",l:"Forecast",i:"◔"},{id:"fly",l:"Fly Box",i:"◎"},{id:"onriver",l:"Live",i:"◈"},{id:"more",l:"More",i:"☰"}];

  return(
    <div style={{"--sf":"'Playfair Display',Georgia,serif","--sn":"'Barlow',sans-serif",fontFamily:"var(--sn)",background:K.bg,minHeight:"100vh",color:K.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:70}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}input,select,textarea{font-family:inherit;background:${K.c2};color:${K.tx};border:1px solid ${K.bd};border-radius:6px;padding:10px 12px;font-size:13px;width:100%}input:focus,select:focus,textarea:focus{outline:none;border-color:${K.ac}}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${K.bd};border-radius:2px}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .3s ease both}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.pulse{animation:pulse 1.5s infinite}`}</style>

      {/* ══ HEADER ══ */}
      <div style={{background:`linear-gradient(170deg,${K.bg},${K.c3} 60%,#161A14)`,padding:"22px 16px 16px",position:"relative"}}>
        <div style={{position:"absolute",inset:0,opacity:0.02,backgroundImage:"repeating-conic-gradient(#EDE5D5 0% 25%,transparent 0% 50%)",backgroundSize:"3px 3px"}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <Mark/>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:40,fontWeight:900,fontFamily:"var(--sf)",color:K.ac,lineHeight:1}}>{hIdx}</div>
              <div style={{fontSize:7,color:K.txD,letterSpacing:"0.25em"}}>HATCH INDEX</div>
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <div className={loading?"pulse":""} style={{width:6,height:6,borderRadius:3,background:dSrc==="live"?K.gn:dSrc==="loading"?K.og:K.rd}}/>
            <span style={{fontSize:8,color:K.txD,letterSpacing:"0.06em"}}>{loading?"FETCHING...":dSrc==="live"?`LIVE / ${lastUp?.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}`:"SIMULATED / Connects on deploy"}</span>
          </div>

          {dan&&<Cd accent style={{padding:"12px 14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.2em",color:K.ac}}>THE MAYFLY / E. DANICA</div><div style={{fontSize:12,color:K.txM,marginTop:4,lineHeight:1.5}}>{dan.score>70?"Full hatch. Get on the water.":dan.score>40?"Building. Daily emergence.":dan.score>15?"Early signs. Days away.":"Not yet. Patience."}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:34,fontWeight:900,fontFamily:"var(--sf)",color:K.ac,lineHeight:1}}>{dan.score}</div><div style={{fontSize:8,color:K.ac,fontWeight:700}}>{dan.lb.toUpperCase()}</div></div>
            </div>
          </Cd>}

          <button onClick={()=>setPick(!pick)} style={{width:"100%",background:K.c2,border:`1px solid ${K.bd}`,borderRadius:8,padding:"10px 14px",color:K.tx,fontSize:12,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{rv.n} / {bt.n}</span><span style={{color:K.txD}}>{pick?"−":"+"}</span></button>
          {pick&&<div className="fu" style={{marginTop:8,background:K.c1,borderRadius:10,padding:12,border:`1px solid ${K.bd}`}}>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{Object.entries(RIVERS).map(([k,r])=><button key={k} onClick={()=>setRiv(k)} style={{padding:"4px 10px",borderRadius:5,border:riv===k?`1px solid ${K.ac}`:`1px solid ${K.bd}`,background:riv===k?K.acS:"transparent",color:riv===k?K.ac:K.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r.n}</button>)}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{rv.beats.map((b,i)=><button key={b.id} onClick={()=>{setBIdx(i);setPick(false)}} style={{padding:"3px 8px",borderRadius:4,border:bIdx===i?`1px solid ${K.tx}`:`1px solid ${K.bd}`,background:bIdx===i?K.c3:"transparent",color:bIdx===i?K.tx:K.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{b.n}</button>)}</div>
          </div>}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:`1px solid ${K.bd}`}}>
        {[{l:"WATER",v:`${cT}°`,s:`${cT>pT?"▲":"▼"}${Math.abs(cT-pT).toFixed(1)}°`,c:cT>=12&&cT<=18?K.gn:K.bl},{l:"LEVEL",v:`${cL}m`,s:lv.t,c:lv.c},{l:"FLOW",v:cF||"--",s:"m³/s",c:K.txM}].map((s,i)=>
          <div key={i} style={{padding:"12px 8px",textAlign:"center",borderRight:i<2?`1px solid ${K.bd}`:"",background:K.c1}}>
            <div style={{fontSize:7,letterSpacing:"0.2em",color:K.txD}}>{s.l}</div>
            <div style={{fontSize:20,fontWeight:700,fontFamily:"var(--sf)",color:s.c,lineHeight:1,marginTop:3}}>{s.v}</div>
            <div style={{fontSize:9,color:s.c,fontWeight:600,marginTop:2}}>{s.s}</div>
          </div>)}
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{padding:16}}>

      {/* ── RIVER (main dashboard) ── */}
      {nav==="river"&&<div className="fu">
        <Sec label="SPECIES ACTIVITY"><Cd>{spp.filter(s=>adv||s.score>5).slice(0,adv?20:8).map(sp=>{const isM=sp.id==="danica";return(
          <div key={sp.id} style={{padding:isM?"16px":"10px 16px",borderBottom:`1px solid ${K.bd}`,background:isM?K.acS:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:8,fontWeight:700,color:CC[sp.cat],minWidth:12}}>{CL[sp.cat]?.charAt(0)}</span>
              <div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontWeight:700,color:isM?K.ac:K.tx,fontSize:isM?15:12,fontFamily:"var(--sf)"}}>{sp.cm}</span>{isM&&<span style={{fontSize:8,fontWeight:700,color:K.ac,letterSpacing:"0.1em"}}>PEAK</span>}</div>
                {adv&&<div style={{fontSize:9,color:K.txD,fontStyle:"italic"}}>{sp.nm} | {sp.sz} | Hook {sp.hk}</div>}
                <div style={{height:isM?5:3,background:K.c2,borderRadius:3,marginTop:5,overflow:"hidden"}}><div style={{height:"100%",width:`${sp.score}%`,background:`linear-gradient(90deg,${hC(sp.score)}66,${hC(sp.score)})`,borderRadius:3,transition:"width .6s"}}/></div>
              </div>
              <div style={{textAlign:"right",minWidth:40}}><div style={{fontSize:isM?24:18,fontWeight:700,fontFamily:"var(--sf)",color:hC(sp.score),lineHeight:1}}>{sp.score}</div><div style={{fontSize:7,fontWeight:600,color:hC(sp.score),marginTop:1}}>{sp.lb}</div></div>
            </div>
          </div>)})}</Cd></Sec>

        <Sec label="TODAY'S TOP FLIES"><Cd style={{padding:14}}>
          {["dry","emerger","nymph"].map(cat=>{const rel=FL[cat].filter(f=>f.mt.some(m=>actIds.includes(m))).slice(0,2);if(!rel.length)return null;return<div key={cat} style={{marginBottom:10}}><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:cat==="dry"?K.ac:cat==="emerger"?K.gn:K.bl,marginBottom:4}}>{cat.toUpperCase()}</div>{rel.map(f=><div key={f.nm} style={{padding:"5px 0",borderBottom:`1px solid ${K.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:12,fontWeight:600}}>{f.nm}</span><span style={{fontSize:10,color:K.txD,marginLeft:6}}>#{f.sz}</span></div><div style={{display:"flex",gap:2}}>{Array.from({length:f.ef},(_,i)=><div key={i} style={{width:4,height:4,borderRadius:2,background:K.ac}}/>)}</div></div>)}</div>})}
        </Cd></Sec>

        <div style={{display:"flex",gap:4}}>
          <button onClick={()=>setAdv(!adv)} style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${adv?K.ac:K.bd}`,background:adv?K.acS:K.c1,color:adv?K.ac:K.txD,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{adv?"ADVANCED ON":"ADVANCED OFF"}</button>
        </div>
      </div>}

      {/* ── FORECAST ── */}
      {nav==="forecast"&&<div className="fu">
        <div style={{display:"flex",gap:4,marginBottom:16}}>{[{id:"hourly",l:"HOURLY"},{id:"longrange",l:"LONG RANGE"},{id:"kit",l:"KIT & TIPS"}].map(t=><button key={t.id} onClick={()=>setSub(t.id)} style={{flex:1,padding:"10px 6px",borderRadius:8,border:sub===t.id?`1px solid ${K.ac}`:`1px solid ${K.bd}`,background:sub===t.id?K.acS:K.c1,color:sub===t.id?K.ac:K.txD,fontSize:9,fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>

        {sub==="hourly"&&(()=>{const day=hourlyD[hDay];if(!day)return<div style={{color:K.txM}}>Loading...</div>;const pk=day.hrs.reduce((a,b)=>(a.hi||0)>(b.hi||0)?a:b,day.hrs[0]);return<div>
          <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{hourlyD.map((d,i)=><button key={i} onClick={()=>setHDay(i)} style={{padding:"6px 9px",borderRadius:6,border:hDay===i?`1px solid ${K.ac}`:`1px solid ${K.bd}`,background:hDay===i?K.acS:K.c1,color:hDay===i?K.ac:K.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}><div>{d.dn}</div><div style={{fontSize:8,marginTop:1}}>{d.df}</div></button>)}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:12}}>{[{l:"AIR",v:`${day.aH||"--"}°/${day.aL||"--"}°`},{l:"WIND",v:`${day.wd||"?"} ${day.ws||"--"}mph`},{l:"RAIN",v:`${day.rain||0}%`},{l:"PRESS",v:`${day.pr||"--"}mb`}].map((s,i)=><div key={i} style={{background:K.c1,borderRadius:6,border:`1px solid ${K.bd}`,padding:"8px 4px",textAlign:"center"}}><div style={{fontSize:7,letterSpacing:"0.1em",color:K.txD}}>{s.l}</div><div style={{fontSize:11,fontWeight:600,color:K.tx,marginTop:2}}>{s.v}</div></div>)}</div>
          {pk&&<Cd accent style={{padding:"12px 14px",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.2em",color:K.ac}}>PEAK WINDOW</div><div style={{fontSize:12,color:K.tx,marginTop:3}}>{pk.h}:00 / ~{pk.wt}°C / Intensity {(pk.hi||0).toFixed(1)}</div></div><div style={{fontSize:26,fontFamily:"var(--sf)",fontWeight:900,color:K.ac}}>{(pk.hi||0).toFixed(0)}</div></div></Cd>}
          <Cd style={{padding:14}}><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.txD,marginBottom:8}}>HATCH INTENSITY BY HOUR</div><div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{(day.hrs||[]).map(h=><div key={h.h} style={{textAlign:"center"}}><div style={{fontSize:7,color:K.txD,marginBottom:2}}>{h.h}</div><div style={{width:22,height:22,borderRadius:3,background:iC(h.hi||0),display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:(h.hi||0)>=3?K.bg:K.txD,fontWeight:(h.hi||0)>=5?700:400}}>{(h.hi||0)>=1?(h.hi||0).toFixed(0):""}</div></div>)}</div></Cd>
        </div>})()}

        {sub==="longrange"&&<div>
          <Cd>{lr.map((w,i)=><div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${K.bd}`,display:"flex",alignItems:"center",gap:10}}>
            <div style={{minWidth:75}}><div style={{fontSize:11,fontWeight:600,color:i===0?K.ac:K.tx}}>{w.l}</div><div style={{fontSize:8,color:w.cf==="High"?K.gn:w.cf==="Med"?K.og:K.txD,fontWeight:600,marginTop:2}}>{w.cf.toUpperCase()}</div></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontSize:8,color:K.ac,fontWeight:600,minWidth:34}}>Danica</span><div style={{flex:1,height:5,background:K.c2,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:K.ac,borderRadius:3}}/></div><span style={{fontSize:10,fontWeight:700,color:K.ac,minWidth:24,textAlign:"right"}}>{w.ds}%</span></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:8,color:K.gn,fontWeight:600,minWidth:34}}>Overall</span><div style={{flex:1,height:3,background:K.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.oa*10}%`,background:K.gn,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:600,color:K.gn,minWidth:24,textAlign:"right"}}>{w.oa}</span></div>
            </div>
            <div style={{fontSize:9,color:K.txD,minWidth:34,textAlign:"right"}}>~{w.pt}°C</div>
          </div>)}</Cd>
        </div>}

        {sub==="kit"&&<div>
          <Cd style={{padding:14}}>
            <div style={{marginBottom:12}}><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.ac,marginBottom:4}}>TIPPET</div><div style={{fontSize:16,fontWeight:700,fontFamily:"var(--sf)"}}>{topH?.id==="danica"?"3X-4X (6-8lb)":topH?.cat==="o"&&(topH.sz||"").includes("6")?"6X-7X (2-3lb)":"5X (4lb)"}</div></div>
            <div style={{marginBottom:12}}><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.ac,marginBottom:4}}>LEADER</div><div style={{fontSize:11,color:K.tx,lineHeight:1.6}}>{cT>15?"12-15ft tapered. Fluoro tippet. Longer in clear water.":cT>10?"9-12ft tapered. Nylon for dries, fluoro for nymphs.":"9ft tapered. Shorter fine in cooler water."}</div></div>
            <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.ac,marginBottom:4}}>GUIDE TIPS</div>
              {["Rub mud on the last 3ft of tippet. Critical in clear water.",cL<0.4?"Low water: stay low, longer casts.":cL>0.55?"Higher water: fish margins and slack.":"Levels good: classic positions, tail of pools.",cT>=12?"Water ideal for surface. Keep a dry ready.":"Cool water: slow deep nymphing.","Debarb hooks. Most beats require it.","Carry amadou or desiccant for dries."].map((t,i)=><div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${K.bd}`,fontSize:11,color:K.txM,lineHeight:1.5,display:"flex",gap:8}}><span style={{color:K.ac,flexShrink:0}}>•</span>{t}</div>)}
            </div>
          </Cd>
          {[{c:"Overcast & warm",t:"Best for danica. Big dries."},{c:"Bright sun",t:"Fish in shade. Long tippets."},{c:"Cold & blustery",t:"Iron blue day. Don't give up."},{c:"Falling pressure",t:"Triggers hatches."},{c:"After rain",t:"Nymphs early, dries as it clears."}].map((w,i)=><div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${K.bd}`}}><span style={{fontSize:11,fontWeight:600,color:K.ac}}>{w.c}</span><span style={{fontSize:11,color:K.txM,marginLeft:8}}>{w.t}</span></div>)}
        </div>}
      </div>}

      {/* ── FLY BOX ── */}
      {nav==="fly"&&<div className="fu">
        <div style={{background:K.rd+"18",border:`1px solid ${K.rd}44`,borderRadius:8,padding:"10px 12px",marginBottom:14}}>
          <div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.rd,marginBottom:3}}>⚠ CHECK BEAT REGULATIONS</div>
          <div style={{fontSize:10,color:K.txM,lineHeight:1.5}}>Fly restrictions vary by beat. Some are upstream dry fly only. Always confirm with the beat keeper.</div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:14}}>{[{id:"dry",l:"DRIES",c:K.ac},{id:"emerger",l:"EMERGERS",c:K.gn},{id:"nymph",l:"NYMPHS",c:K.bl}].map(t=><button key={t.id} onClick={()=>setFlyT(t.id)} style={{flex:1,padding:"10px 6px",borderRadius:8,border:flyT===t.id?`1px solid ${t.c}`:`1px solid ${K.bd}`,background:flyT===t.id?t.c+"18":K.c1,color:flyT===t.id?t.c:K.txD,fontSize:9,fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>
        <Cd>{FL[flyT].map((f,i)=>{const isM=f.mt.some(m=>actIds.includes(m));return<div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${K.bd}`,background:isM?K.acS:"transparent"}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div><span style={{fontSize:13,fontWeight:700,color:isM?K.ac:K.tx,fontFamily:"var(--sf)"}}>{f.nm}</span>{isM&&<span style={{fontSize:7,fontWeight:700,color:K.ac,marginLeft:6,background:K.acB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}</div><div style={{display:"flex",gap:2}}>{Array.from({length:f.ef},(_,j)=><div key={j} style={{width:4,height:4,borderRadius:2,background:isM?K.ac:K.txD}}/>)}</div></div>
          <div style={{fontSize:10,color:K.txD,marginTop:3}}>Size {f.sz}</div>
          {adv&&<div style={{fontSize:10,color:K.txM,marginTop:3}}>{f.nt}</div>}
        </div>})}</Cd>
      </div>}

      {/* ── ON THE RIVER (Live) ── */}
      {nav==="onriver"&&<div className="fu">
        <div style={{display:"flex",gap:4,marginBottom:14}}>{[{id:"reports",l:"REPORTS"},{id:"webcams",l:"WEBCAMS"},{id:"submit",l:"SUBMIT"}].map(t=><button key={t.id} onClick={()=>setSub(t.id)} style={{flex:1,padding:"10px 6px",borderRadius:8,border:sub===t.id?`1px solid ${K.ac}`:`1px solid ${K.bd}`,background:sub===t.id?K.acS:K.c1,color:sub===t.id?K.ac:K.txD,fontSize:9,fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>

        {sub==="reports"&&<div>
          <Cd style={{padding:14,marginBottom:14}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:"0.2em",color:K.ac,marginBottom:6}}>RIVER'S EYE VIEW</div>
            <p style={{margin:0,fontSize:12,lineHeight:1.8,color:K.txM}}>{riv==="test"?`The Test is in superb form. Olives consistent, first danica emerging around Stockbridge and Mottisfont. Clarity exceptional. Emergers outperforming duns in carriers. The main event is building.`:`The ${rv.n} is in ${cL>0.5?"good heart":"fine form"}. Water at ${cT}°C. ${rv.desc}`}</p>
          </Cd>
          <Sec label="FIELD REPORTS"><Cd style={{padding:"4px 14px"}}>
            {[...userRpts,...rpts].map((r,i)=>{const sc={Field:K.gn,Guide:K.bl,Club:"#5A7A5E",Estate:K.og,Social:K.txM,User:K.ac};return<div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${K.bd}`}}>
              <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}><span style={{fontSize:7,fontWeight:700,color:sc[r.src],border:`1px solid ${(sc[r.src]||K.txM)}33`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span><span style={{fontSize:11,fontWeight:600}}>{r.bt}</span><span style={{fontSize:9,color:K.txD}}>{r.d}</span><span style={{marginLeft:"auto",fontSize:7,color:r.v?K.gn:K.og,fontWeight:600}}>{r.v?"VERIFIED":"UNVERIFIED"}</span></div>
              <p style={{margin:0,fontSize:11,lineHeight:1.6,color:K.txM}}>{r.tx}</p>
            </div>})}
          </Cd></Sec>
        </div>}

        {sub==="webcams"&&<div>
          <Sec label="RIVER WEBCAMS">
            {WEBCAMS.filter(w=>!riv||w.river===riv||!w.river).map((w,i)=><Cd key={i} style={{padding:14,marginBottom:10}}>
              <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--sf)",color:K.tx}}>{w.nm}</div>
              <div style={{fontSize:10,color:K.txM,marginTop:4}}>{w.desc}</div>
              <a href={w.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,padding:"8px 14px",background:K.ac,color:K.bg,borderRadius:6,fontSize:10,fontWeight:700,textDecoration:"none",letterSpacing:"0.08em"}}>VIEW LIVE CAM →</a>
            </Cd>)}
          </Sec>
          <div style={{fontSize:10,color:K.txD,lineHeight:1.5}}>Webcams provided by Farson Digital Watercams. More cameras being added. Want your river cam listed? Contact us.</div>
        </div>}

        {sub==="submit"&&<div>
          <Sec label="SUBMIT A RIVER REPORT"><Cd style={{padding:14}}>
            <div style={{marginBottom:10}}><label style={{fontSize:9,color:K.txD,letterSpacing:"0.1em",display:"block",marginBottom:4}}>BEAT</label><select value={rptBeat} onChange={e=>setRptBeat(e.target.value)}><option value="">Select beat...</option>{rv.beats.map(b=><option key={b.id} value={b.n}>{b.n}</option>)}</select></div>
            <div style={{marginBottom:10}}><label style={{fontSize:9,color:K.txD,letterSpacing:"0.1em",display:"block",marginBottom:4}}>YOUR REPORT</label><textarea rows={4} value={rptText} onChange={e=>setRptText(e.target.value)} placeholder="What's happening on the river? Hatches, conditions, fish activity..."/></div>
            <button onClick={submitRpt} style={{width:"100%",padding:12,borderRadius:8,border:"none",background:K.ac,color:K.bg,fontSize:11,fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",fontFamily:"inherit"}}>SUBMIT REPORT</button>
            <div style={{fontSize:9,color:K.txD,marginTop:8,lineHeight:1.5}}>Reports appear as unverified. Verified status granted to recognised guides and keepers.</div>
          </Cd></Sec>
        </div>}
      </div>}

      {/* ── MORE ── */}
      {nav==="more"&&<div className="fu">
        <div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>{[{id:"learn",l:"LEARN"},{id:"guides",l:"GUIDES"},{id:"plan",l:"PLANNER"},{id:"local",l:"LOCAL"},{id:"legal",l:"LEGAL"}].map(t=><button key={t.id} onClick={()=>setSub(t.id)} style={{flex:"1 1 28%",padding:"10px 6px",borderRadius:8,border:sub===t.id?`1px solid ${K.ac}`:`1px solid ${K.bd}`,background:sub===t.id?K.acS:K.c1,color:sub===t.id?K.ac:K.txD,fontSize:9,fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>

        {sub==="learn"&&<div>
          <div style={{display:"flex",gap:4,marginBottom:14}}>{LEARN.map((l,i)=><button key={i} onClick={()=>setLearnLvl(i)} style={{flex:1,padding:"10px 6px",borderRadius:8,border:learnLvl===i?`1px solid ${l.clr}`:`1px solid ${K.bd}`,background:learnLvl===i?l.clr+"18":K.c1,color:learnLvl===i?l.clr:K.txD,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l.lvl.toUpperCase()}</button>)}</div>
          <Cd>{LEARN[learnLvl].items.map((it,i)=><div key={i} style={{padding:"14px 14px",borderBottom:`1px solid ${K.bd}`}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:"var(--sf)",color:K.tx}}>{it.t}</div>
            <div style={{fontSize:11,color:K.txM,marginTop:4,lineHeight:1.5}}>{it.d}</div>
            <div style={{fontSize:9,color:K.ac,marginTop:6,fontWeight:600}}>Coming soon</div>
          </div>)}</Cd>
        </div>}

        {sub==="guides"&&<div>
          <Sec label="GUIDE DIRECTORY"><Cd>{GUIDES.map((g,i)=><div key={i} style={{padding:"14px 14px",borderBottom:`1px solid ${K.bd}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:14,fontWeight:700,fontFamily:"var(--sf)"}}>{g.nm}</div><div style={{fontSize:10,color:K.ac,fontWeight:600,marginTop:2}}>{g.type}</div></div>{g.verified&&<span style={{fontSize:7,fontWeight:700,color:K.gn,border:`1px solid ${K.gn}33`,padding:"2px 6px",borderRadius:3}}>VERIFIED</span>}</div>
            <div style={{fontSize:10,color:K.txD,marginTop:3}}>Rivers: {g.river}</div>
            <div style={{fontSize:11,color:K.txM,marginTop:4}}>{g.note}</div>
          </div>)}</Cd></Sec>
          <Cd style={{padding:14,marginTop:10}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.ac,marginBottom:6}}>LIST YOUR SERVICES</div>
            <div style={{fontSize:11,color:K.txM,lineHeight:1.6,marginBottom:10}}>Are you a guide, casting coach, or fishing instructor? List your services on Ephemera and reach anglers planning their next day on the river.</div>
            <button style={{width:"100%",padding:12,borderRadius:8,border:`1px solid ${K.ac}`,background:"transparent",color:K.ac,fontSize:11,fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",fontFamily:"inherit"}}>APPLY TO LIST →</button>
          </Cd>
        </div>}

        {sub==="plan"&&<div>
          <Sec label="DAY PLANNER"><Cd style={{padding:14}}>
            <div style={{marginBottom:10}}><label style={{fontSize:9,color:K.txD,letterSpacing:"0.1em",display:"block",marginBottom:4}}>BEAT</label><select value={planBeat} onChange={e=>setPlanBeat(e.target.value)}><option value="">Select...</option>{Object.entries(RIVERS).map(([k,r])=>r.beats.map(b=><option key={`${k}-${b.id}`} value={`${r.n} / ${b.n}`}>{r.n} - {b.n}</option>))}</select></div>
            <div style={{marginBottom:10}}><label style={{fontSize:9,color:K.txD,letterSpacing:"0.1em",display:"block",marginBottom:4}}>DATE</label><input type="date" value={planDate} onChange={e=>setPlanDate(e.target.value)}/></div>
            <button onClick={()=>{if(planBeat&&planDate){setPlans(p=>[...p,{b:planBeat,d:planDate,id:Date.now()}]);setPlanBeat("");setPlanDate("")}}} style={{width:"100%",padding:12,borderRadius:8,border:"none",background:K.ac,color:K.bg,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>ADD TO PLAN</button>
          </Cd></Sec>
          {plans.length>0&&<Cd>{plans.map(p=><div key={p.id} style={{padding:"10px 14px",borderBottom:`1px solid ${K.bd}`,display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:12,fontWeight:600}}>{p.b}</div><div style={{fontSize:10,color:K.txD}}>{new Date(p.d).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div></div><button onClick={()=>setPlans(x=>x.filter(z=>z.id!==p.id))} style={{background:"none",border:"none",color:K.rd,cursor:"pointer",fontSize:14}}>×</button></div>)}</Cd>}
        </div>}

        {sub==="local"&&<div>
          {(()=>{const loc=LOCALS[riv]||LOCALS.test;return<>
            <Sec label="TACKLE SHOPS"><Cd>{(loc.tackle||[]).map((l,i)=><div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${K.bd}`}}><div style={{fontSize:13,fontWeight:700,fontFamily:"var(--sf)"}}>{l.nm}</div><div style={{fontSize:10,color:K.txD,marginTop:2}}>{l.a}</div><div style={{fontSize:10,color:K.txM,marginTop:3}}>{l.n}</div></div>)}</Cd></Sec>
            <Sec label="PUBS & CAFES"><Cd>{(loc.food||[]).map((l,i)=><div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${K.bd}`}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700,fontFamily:"var(--sf)"}}>{l.nm}</span><span style={{fontSize:9,color:K.gn,fontWeight:600}}>{l.tp}</span></div><div style={{fontSize:10,color:K.txD,marginTop:2}}>{l.a}</div><div style={{fontSize:10,color:K.txM,marginTop:3}}>{l.n}</div></div>)}</Cd></Sec>
          </>})()}
        </div>}

        {sub==="legal"&&<div>
          <Cd style={{padding:14}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:K.ac,marginBottom:8}}>DISCLAIMER</div>
            <div style={{fontSize:10,color:K.txM,lineHeight:1.7}}>
              <p style={{marginBottom:10}}>Ephemera provides forecasts and predictions based on modelled data from publicly available sources including the Environment Agency Hydrology API and Open-Meteo weather services. All hatch predictions, species activity scores, and recommendations are indicative only and should not be relied upon as guaranteed outcomes.</p>
              <p style={{marginBottom:10}}>River conditions can change rapidly. Always check local conditions on arrival and consult with beat keepers or fishery managers regarding current regulations, fly restrictions, and access arrangements before fishing.</p>
              <p style={{marginBottom:10}}>Ephemera accepts no liability for any loss, damage, or disappointment arising from the use of this application or its forecasts. Fishing is undertaken at your own risk.</p>
              <p style={{marginBottom:10}}>User-submitted reports are unverified unless marked otherwise and represent the personal observations of contributors. Ephemera does not guarantee the accuracy of user-submitted content.</p>
              <p style={{marginBottom:10}}>River level and flow data is sourced from the Environment Agency under the Open Government Licence. Weather data is provided by Open-Meteo under CC BY 4.0. Attribution is given to both services.</p>
              <p>© {new Date().getFullYear()} Ephemera. All rights reserved.</p>
            </div>
          </Cd>
        </div>}
      </div>}

      </div>

      {/* ══ FOOTER ══ */}
      <div style={{textAlign:"center",padding:"24px 16px 20px",borderTop:`1px solid ${K.bd}`}}>
        <EphemeraLogo s={130}/>
        <div style={{fontSize:7,color:K.txD,marginTop:8,letterSpacing:"0.04em",lineHeight:1.7}}>
          EA Hydrology API / Open-Meteo / Keeper logs / User reports<br/>
          Forecasts are indicative. Always check local conditions.<br/>
          {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:K.c1,borderTop:`1px solid ${K.bd}`,display:"flex",zIndex:100,backdropFilter:"blur(10px)"}}>
        {navItems.map(n=><button key={n.id} onClick={()=>{setNav(n.id);if(n.id==="forecast")setSub("hourly");if(n.id==="onriver")setSub("reports");if(n.id==="more")setSub("learn")}} style={{flex:1,padding:"10px 0 8px",border:"none",background:"none",color:nav===n.id?K.ac:K.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>
          <div style={{fontSize:16,lineHeight:1}}>{n.i}</div>
          <div style={{fontSize:8,fontWeight:600,marginTop:2,letterSpacing:"0.05em"}}>{n.l}</div>
        </button>)}
      </div>
    </div>
  );
}
