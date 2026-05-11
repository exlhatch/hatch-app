import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══ EPHEMERA — A calm expert beside you ═══ */

const W=({s=24,c="#F3F0E8",r=false})=><svg width={s} height={s} viewBox="100 40 320 380" fill="none" strokeLinecap="round" strokeLinejoin="round"><g stroke={c}><path d="M176 306C205 197 286 103 382 62C360 158 297 250 176 306Z" strokeWidth="18"/><path d="M179 304C232 245 292 189 374 68" strokeWidth="10"/><path d="M221 269C252 261 287 246 323 221" strokeWidth="9"/><path d="M252 222C281 215 312 202 344 178" strokeWidth="9"/><path d="M118 334H394" strokeWidth="14"/><path d="M151 368H357" strokeWidth="10"/></g><path d="M198 398H310" stroke={r?"#C36A3D":c} strokeWidth="8" strokeLinecap="round"/></svg>;

const D={bg:"#161E1B",c1:"#1B2421",c2:"#212C28",c3:"#283632",bd:"#2E3B36",tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",rust:"#C36A3D",gn:"#7A9E7E",rustS:"#C36A3D18",rustB:"#C36A3D40"};
const L={bg:"#F3F0E8",c1:"#FFFFFF",c2:"#EBE8E0",c3:"#E0DDD5",bd:"#D0CCC2",tx:"#1F2D2A",txM:"#5F6F7B",txD:"#8A948F",rust:"#C36A3D",gn:"#5A7A5E",rustS:"#C36A3D12",rustB:"#C36A3D30"};

/* ── ACCOUNT helpers (localStorage) ── */
const STORE_USER="eph_user";const STORE_SESSIONS="eph_sessions";const STORE_PREFS="eph_prefs";
function getUser(){try{return JSON.parse(localStorage.getItem(STORE_USER))}catch{return null}}
function setUser(u){localStorage.setItem(STORE_USER,JSON.stringify(u))}
function getSessions(){try{return JSON.parse(localStorage.getItem(STORE_SESSIONS))||[]}catch{return[]}}
function saveSessions(s){localStorage.setItem(STORE_SESSIONS,JSON.stringify(s))}
function getPrefs(){try{return JSON.parse(localStorage.getItem(STORE_PREFS))||{}}catch{return{}}}
function savePrefs(p){localStorage.setItem(STORE_PREFS,JSON.stringify(p))}

/* ── RIVERS with personality ── */
const RV=[
  {id:"test",n:"River Test",ea:"Test",lat:51.09,lng:-1.49,q:10,p:"Technical and demanding. The birthplace of dry fly fishing. Match the hatch or go home. Fine tippets, precise presentation. Rewards patience over ambition.",b:["Broadlands","Nursling","Timsbury","Mottisfont","Horsebridge","Park Stream","Stockbridge","Leckford","Longparish","Whitchurch","Laverstoke"],bq:{Stockbridge:10,Leckford:9,"Park Stream":9,Mottisfont:9,Horsebridge:8,Longparish:8,Whitchurch:7,Laverstoke:7,Timsbury:7,Broadlands:7,Nursling:6}},
  {id:"itchen",n:"River Itchen",ea:"Itchen",lat:51.06,lng:-1.30,q:10,p:"Crystal clear and unforgiving. The most selective trout in England. Longer leaders, lighter tippets, smaller flies. Every cast counts.",b:["Itchen Abbas","Martyr Worthy","Easton","Abbotts Barton","Twyford"],bq:{"Abbotts Barton":10,"Martyr Worthy":9,"Itchen Abbas":9,Easton:8,Twyford:7}},
  {id:"kennet",n:"River Kennet",ea:"Kennet",lat:51.42,lng:-1.52,q:8,p:"Broader and more forgiving. Excellent grayling. Nymphing is productive here. Good hatches in the riffles. Less pressured, more generous.",b:["Marlborough","Ramsbury","Littlecote","Hungerford","Kintbury"],bq:{Ramsbury:9,Littlecote:8,Hungerford:7,Kintbury:7,Marlborough:6}},
  {id:"lambourn",n:"River Lambourn",ea:"Lambourn",lat:51.50,lng:-1.53,q:8,p:"A jewel of a small chalkstream. Intimate water, wild trout, classic dry fly. What it lacks in size it makes up in charm.",b:["Upper Lambourn","Great Shefford"],bq:{"Upper Lambourn":8,"Great Shefford":7}},
  {id:"anton",n:"River Anton",ea:"Anton",lat:51.19,lng:-1.50,q:7,p:"Small but characterful. Good access, steady hatches. A fine river for building chalkstream skills.",b:["Goodworth Clatford","Anton Lakes"],bq:{"Goodworth Clatford":7,"Anton Lakes":6}},
  {id:"avon",n:"Hampshire Avon",ea:"Avon Hampshire",lat:51.17,lng:-1.78,q:9,p:"Big water, big fish. Specimen trout and grayling. Carriers are intimate; the main river demands distance. Superb mayfly.",b:["Upavon","Netheravon","Amesbury","Salisbury"],bq:{Amesbury:8,Netheravon:8,Upavon:7,Salisbury:7}},
  {id:"wylye",n:"River Wylye",ea:"Wylye",lat:51.17,lng:-2.06,q:8,p:"Underrated and beautiful. Excellent olive hatches, willing fish. The evening rise here can be extraordinary.",b:["Heytesbury","Codford"],bq:{Heytesbury:8,Codford:7}},
  {id:"nadder",n:"River Nadder",ea:"Nadder",lat:51.08,lng:-1.98,q:7,p:"Pretty and productive. Good brown trout. Flows through lovely countryside.",b:["Tisbury","Wilton"],bq:{Tisbury:7,Wilton:6}},
  {id:"meon",n:"River Meon",ea:"Meon",lat:50.94,lng:-1.14,q:7,p:"Short, spring-fed Hampshire stream. Small but perfectly formed. Wild trout in the upper reaches.",b:["East Meon","Droxford"],bq:{"East Meon":7,Droxford:6}},
  {id:"piddle",n:"River Piddle",ea:"Piddle",lat:50.73,lng:-2.21,q:7,p:"Dorset chalkstream. Excellent wild trout. Remote, peaceful, unspoilt.",b:["Puddletown"],bq:{Puddletown:7}},
  {id:"frome",n:"Frome (Dorset)",ea:"Frome",lat:50.71,lng:-2.44,q:7,p:"Rich Dorset chalkstream. Good hatches, willing fish in the carriers.",b:["Dorchester"],bq:{Dorchester:6}},
  {id:"mimram",n:"River Mimram",ea:"Mimram",lat:51.80,lng:-0.22,q:5,p:"Tiny Hertfordshire chalkstream. Short intense windows when hatches come.",b:["Welwyn"],bq:{Welwyn:5}},
  {id:"chess",n:"River Chess",ea:"Chess",lat:51.65,lng:-0.60,q:6,p:"Chilterns chalkstream with improving water quality. Intimate, tree-lined, surprisingly good hatches.",b:["Chesham","Latimer","Nr. Sarratt","Rickmansworth"],bq:{Latimer:7,"Nr. Sarratt":6,Chesham:5,Rickmansworth:5}},
  {id:"darent",n:"River Darent",ea:"Darent",lat:51.37,lng:0.18,q:5,p:"Kent's chalkstream. Restoration has brought trout back. Short windows but rewarding.",b:["Shoreham","Eynsford"],bq:{Shoreham:6,Eynsford:5}},
  {id:"wandle",n:"River Wandle",ea:"Wandle",lat:51.42,lng:-0.17,q:4,p:"London's chalkstream. Urban but remarkable. Brown trout in zone 3. An achievement to catch one here.",b:["Carshalton"],bq:{Carshalton:4}},
];

/* ── HATCH DATA ── */
const H=[
  {id:"danica",cm:"Mayfly",cat:"m",t:1,s:135,e:172,tMn:12,tMx:18,pk:[12,13,14,15,16],hk:"10-12 LD",sz:"20-25mm",avgS:139},
  {id:"ldo",cm:"Large Dark Olive",cat:"o",t:2,s:60,e:150,tMn:7,tMx:14,pk:[10,11,12,13],hk:"14-16",sz:"10-12mm"},
  {id:"mo",cm:"Medium Olive",cat:"o",t:3,s:100,e:180,tMn:10,tMx:16,pk:[11,12,13,14],hk:"16",sz:"8-10mm"},
  {id:"bwo",cm:"Blue-winged Olive",cat:"o",t:2,s:150,e:290,tMn:12,tMx:18,pk:[17,18,19,20],hk:"14-16",sz:"9-11mm"},
  {id:"ib",cm:"Iron Blue",cat:"o",t:2,s:105,e:165,tMn:8,tMx:14,pk:[11,12,13,14],hk:"16-18",sz:"6-8mm"},
  {id:"pw",cm:"Pale Watery",cat:"o",t:3,s:125,e:260,tMn:12,tMx:18,pk:[14,15,16,17,18],hk:"16-18",sz:"6-8mm"},
  {id:"gran",cm:"Grannom",cat:"c",t:2,s:100,e:130,tMn:9,tMx:14,pk:[11,12,13,14,15],hk:"14-16",sz:"10-12mm"},
  {id:"sedge",cm:"Sedges",cat:"c",t:2,s:135,e:275,tMn:13,tMx:20,pk:[19,20,21],hk:"12-16",sz:"8-18mm"},
  {id:"haw",cm:"Hawthorn Fly",cat:"t",t:2,s:108,e:135,tMn:10,tMx:16,pk:[11,12,13,14,15,16],hk:"12-14",sz:"12-14mm"},
  {id:"bg",cm:"Black Gnat",cat:"t",t:3,s:120,e:250,tMn:12,tMx:20,pk:[12,13,14,15,16,17],hk:"16-18",sz:"5-8mm"},
  {id:"smut",cm:"Reed Smuts",cat:"t",t:3,s:135,e:270,tMn:13,tMx:20,pk:[10,11,12,13,14,15,16,17],hk:"20-24",sz:"2-4mm"},
  {id:"caen",cm:"Caenis",cat:"o",t:3,s:155,e:250,tMn:15,tMx:20,pk:[5,6,7,19,20,21],hk:"20-22",sz:"3-5mm"},
];
const CC={m:D.rust,o:D.gn,c:"#8B7355",t:D.txD};
const FLYMAP={danica:"Grey Wulff #12",ldo:"Kite's Imperial #16",mo:"Adams #16",bwo:"Sherry Spinner #14",ib:"Iron Blue Dun #18",pw:"Last Hope #18",gran:"Grannom Pupa #14",sedge:"Elk Hair Caddis #14",haw:"Hawthorn #12",bg:"Black Gnat #16",smut:"Griffith's Gnat #22",caen:"Last Hope #20"};
const FLYCONF={danica:"high confidence",ldo:"high confidence",mo:"good match",bwo:"evening essential",ib:"cold weather pick",pw:"search pattern",gran:"seasonal",sedge:"evening only",haw:"opportunistic",bg:"search pattern",smut:"last resort",caen:"early/late only"};

/* ── FLY BOX ── */
const FLIES={
  dry:[
    {nm:"Grey Wulff",sz:"10-14",mt:["danica"],cf:"High confidence",nt:"Classic mayfly. Bushy, visible, floats forever. The go-to during the duffer's fortnight."},
    {nm:"Spent Gnat",sz:"10-12",mt:["danica"],cf:"Spinner falls",nt:"Flat-winged spinner. Dead drift during spinner falls. Essential for evenings."},
    {nm:"Kite's Imperial",sz:"14-16",mt:["ldo","mo"],cf:"High confidence",nt:"THE olive pattern. Heron herl, honey hackle. Simple, devastating."},
    {nm:"Adams",sz:"14-18",mt:["ldo","mo","bwo"],cf:"Search pattern",nt:"When unsure, start here. Versatile across hatches."},
    {nm:"Elk Hair Caddis",sz:"12-16",mt:["sedge"],cf:"Evening essential",nt:"Skate or dead drift. Evening sedge sessions on warm nights."},
    {nm:"Iron Blue Dun",sz:"16-18",mt:["ib"],cf:"Cold weather pick",nt:"Small, dark. Fish love them on drizzly, cool days."},
    {nm:"Black Gnat",sz:"16-18",mt:["bg"],cf:"Search pattern",nt:"Midsummer staple. Fish it when nothing specific is hatching."},
    {nm:"Last Hope",sz:"16-20",mt:["pw","caen"],cf:"Desert island fly",nt:"Clarke's classic. For the most selective fish on the smallest food."},
  ],
  emerger:[
    {nm:"Klinkhamer Special",sz:"12-18",mt:["ldo","mo","bwo","danica"],cf:"High confidence",nt:"Hangs in the film. The most versatile chalkstream fly ever tied."},
    {nm:"Danica Emerger",sz:"10-12 LD",mt:["danica"],cf:"Mayfly season",nt:"Sits in the film with CDC wing buds. Often outperforms the dry."},
    {nm:"CDC Shuttlecock",sz:"14-20",mt:["ldo","mo","bwo","ib","pw"],cf:"High confidence",nt:"CDC tips up, body hangs below film. Tie sparse. Deadly."},
    {nm:"Sherry Spinner",sz:"14-16",mt:["bwo"],cf:"Evening essential",nt:"BWO spinner imitation. Late evening, flat water, sipping rises."},
  ],
  nymph:[
    {nm:"Pheasant Tail Nymph",sz:"14-18",mt:["ldo","mo","bwo","ib","pw"],cf:"Desert island fly",nt:"Sawyer's original. Dead drift or induced take. If you could only carry one nymph."},
    {nm:"Hare's Ear",sz:"14-16",mt:["ldo","mo","bwo"],cf:"High confidence",nt:"Buggy, translucent. Works when nothing else does. Gold ribbed."},
    {nm:"Killer Bug",sz:"14-16",mt:["ldo","mo"],cf:"Cold water pick",nt:"Chadwick's 477 wool, copper wire. Deadly in cold water. Grayling killer."},
  ],
};

/* ── METHODS + APPROACH BUILDER ── */
const METHODS=[{id:"dry",l:"Dry Fly Only"},{id:"drynymph",l:"Dry & Nymph"},{id:"any",l:"Any Method"}];
function buildRig(wt,wind,cloud,method,topH){
  const warm=wt>=12,oc=cloud>60,wd=wind>12;
  const fly=topH?`${topH.cm} — ${topH.hk}`:"Match the hatch";
  if(method==="dry"){
    if(warm&&oc)return{a:"Single dry to risers. Watch and wait.",rod:"9ft 4wt",ldr:"12-15ft degreased",tip:"5X-6X",fly,guide:"Position below. One accurate cast. Don't rush the first fish.",c:85,why:"Classic dry fly conditions."};
    if(wd)return{a:"Terrestrials on the lee bank",rod:"9ft 5wt",ldr:"9ft",tip:"4X-5X",fly:"Hawthorn #12 or Black Gnat #14",guide:"Wind pushes food to sheltered side. Short casts, tight loops.",c:75,why:"Wind ripple gives cover."};
    if(wt>=14&&cloud<30)return{a:"Target shaded weed lines",rod:"9ft 4wt",ldr:"15ft, mud last 3ft",tip:"6X-7X",fly:"CDC Shuttlecock #18 or Last Hope",guide:"Fish holding in shade. Approach from downstream, kneel.",c:60,why:"Bright and warm. Shade is everything."};
    return{a:"Fine and far off. Stealth fishing.",rod:"9ft 4wt",ldr:"14-16ft, mud last 3ft",tip:"6X",fly:"CDC or Last Hope #18",guide:"Go fine. Go long. Wait for evening if needed.",c:65,why:"Tough conditions demand patience."};
  }
  if(method==="drynymph"){
    if(warm&&oc)return{a:"Dry first. Nymph the quiet stretches.",rod:"9ft 4-5wt",ldr:"12ft",tip:"5X nylon / fluoro",fly:`Dry: ${fly}. Nymph: PTN #16`,guide:"Surface first when cloud thickens. Switch when it clears.",c:82,why:"Best of both."};
    if(wt<11)return{a:"Shallow nymph under cover",rod:"9-10ft 4-5wt",ldr:"10-12ft",tip:"5X fluoro",fly:"PTN #16 weighted. Dry: Klinkhamer spare.",guide:"Tick the gravel. Induced take through weed channels.",c:78,why:"Cool water. Fish deep."};
    return{a:"Upstream nymph, dry in the pocket",rod:"9-10ft 4-5wt",ldr:"10-12ft",tip:"5X fluoro",fly:"PTN #16. Klinkhamer ready.",guide:"Dead drift nymph. Switch the moment you see rises.",c:78,why:"Nymph covers water."};
  }
  if(warm&&oc)return{a:"Dry fly — don't go subsurface too early",rod:"9ft 4-5wt",ldr:"12ft",tip:"5X",fly,guide:"Ideal conditions. Klink+PTN dropper if nothing shows in 20 min.",c:85,why:"Prime dry fly conditions."};
  if(warm&&!oc)return{a:"Klinkhamer + nymph dropper through the runs",rod:"9ft 5wt",ldr:"9-12ft",tip:"5X, 18in fluoro dropper",fly:"Klinkhamer #14 + PTN #16",guide:"Covers surface and bottom. Adjust dropper depth for each pool.",c:80,why:"Mixed. Dropper covers both."};
  if(wd&&wt>=11)return{a:"Streamer along the margins if cloud builds",rod:"9ft 6wt",ldr:"9ft",tip:"4X fluoro",fly:"Woolly Bugger #8 or Minkie",guide:"Strip slow along undercuts. Aggressive takes in coloured water.",c:70,why:"Wind + cloud = predator mode."};
  return{a:"Euro nymph — fish the bottom, seams and gravel",rod:"10ft 3-4wt",ldr:"20ft fluoro",tip:"5X-6X",fly:"Jig #14 + PTN #16",guide:"Short line, high rod. Work every seam systematically.",c:78,why:"Cool water. Subsurface first."};
}

/* ── DIAGNOSE SCENARIOS ── */
const SC=[
  {id:"rising",l:"Fish rising",i:"◉",a:[{h:"Match the size first",d:"Size matters more than pattern. Watch what's on the water.",c:85},{h:"Check your drift",d:"Micro-drag gets you refused. Throw slack, mend upstream.",c:80},{h:"Drop tippet one size",d:"5X to 6X can make the difference on educated fish.",c:75}]},
  {id:"refusing",l:"Refusing flies",i:"✕",a:[{h:"Go smaller AND lighter",d:"Drop one hook AND one tippet size simultaneously.",c:90},{h:"Switch to emerger",d:"CDC shuttlecock or Klinkhamer. They're keying on the film.",c:85},{h:"Change angle entirely",d:"Curve cast. Or change bank. Or wait 10 minutes.",c:70},{h:"Stop and watch",d:"Count the rise rhythm. Match your timing to theirs.",c:80}]},
  {id:"nothing",l:"No signs of life",i:"—",a:[{h:"Nymph the bottom",d:"Weighted PTN #16, dead drifted. Tick the gravel.",c:75},{h:"Induced take",d:"Cast up, let sink, then lift rod to swing nymph up.",c:70},{h:"Fish the structure",d:"Weed margins, undercuts, overhanging trees. That's where they hide.",c:65}]},
  {id:"cruising",l:"Cruising fish",i:"↺",a:[{h:"Intercept the circuit",d:"Watch the route. Position ahead. One cast.",c:85},{h:"Emerger in the lane",d:"CDC shuttlecock, dead still. Let them find it.",c:80}]},
  {id:"windy",l:"Too windy",i:"≈",a:[{h:"Lee bank + terrestrials",d:"Wind pushes food to sheltered side. Fish know this.",c:85},{h:"Bigger flies, shorter casts",d:"Ripple means less wary fish. Punch into wind.",c:80}]},
  {id:"bright",l:"Bright sun",i:"☀",a:[{h:"Fish the shade",d:"Under trees, bridge shadows, weed channels.",c:85},{h:"Go fine — 6X, size 18-20",d:"Every detail matters in bright light.",c:90},{h:"Wait for evening",d:"Last 2 hours can be the best fishing of the day.",c:70}]},
  {id:"spooking",l:"Spooking fish",i:"!",a:[{h:"Stand completely still for 2 minutes",d:"Fish return within 5-10 minutes. Every time.",c:90},{h:"Approach from directly behind",d:"Low profile, slow steps. Kneel at the water's edge.",c:85}]},
  {id:"missed",l:"Missed takes",i:"↗",a:[{h:"Slow your strike",d:"Wait for the mouth to close. Count 'God save the Queen' then lift.",c:90},{h:"Sharpen the hook",d:"Thumbnail test. If it slides, change the fly.",c:85}]},
];

/* ── SAMPLE REPORTS ── */
function relDate(n){const d=new Date();d.setDate(d.getDate()-n);return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
const RPT={test:[{d:relDate(0),bt:"Stockbridge",au:"River Keeper",src:"Keeper",tx:"Good olive hatch through the morning. Water clarity excellent. Ranunculus in superb condition.",v:true},{d:relDate(1),bt:"Park Stream",au:"Guide",src:"Guide",tx:"Afternoon olives brought fish up. Two good trout on CDC shuttlecocks. Water temp 13.2C.",v:true},{d:relDate(2),bt:"Mottisfont",au:"@chalkstream_life",src:"Social",tx:"Iron blues in the drizzle. Lovely sport on small dries.",v:false},{d:relDate(3),bt:"Leckford",au:"Estate Keeper",src:"Keeper",tx:"Strong LDO hatch midmorning. Hawthorn about on the meadow stretches.",v:true},{d:relDate(4),bt:"Longparish",au:"Test Valley FC",src:"Club",tx:"Steady olives and pale wateries. River in fine order.",v:true}],itchen:[{d:relDate(1),bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Consistent olive hatch. Technical fish. Fine tippets essential.",v:true}],kennet:[{d:relDate(2),bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Good olives midday. Grayling on nymphs in the afternoon.",v:false}]};

/* ── ENGINE ── */
const cache={};
async function fetchWx(la,lo){const k=`w${la.toFixed(1)}_${lo.toFixed(1)}`;if(cache[k])return cache[k];try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,precipitation_probability,precipitation,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset&timezone=Europe/London&forecast_days=7&current=temperature_2m,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,precipitation`);const d=await r.json();cache[k]=d;return d}catch{return null}}
async function fetchEA(name){const k=`e_${name}`;if(cache[k])return cache[k];try{const r=await fetch(`https://environment.data.gov.uk/hydrology/id/stations?riverName=${encodeURIComponent(name)}&_limit=5`);const d=await r.json();const o={level:null,temp:null};for(const s of(d.items||[]))for(const m of(s.measures||[])){const id=typeof m==="string"?m:m["@id"];const p=(typeof m==="string"?"":m.parameterName||m.parameter||"").toLowerCase();if(p.includes("level")&&!o._l)o._l=id;if(p.includes("temp")&&!o._t)o._t=id}if(o._l){try{const r2=await fetch(o._l.startsWith("http")?`${o._l}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${o._l}/readings?latest`);const d2=await r2.json();if(d2.items?.[0])o.level=d2.items[0].value}catch{}}if(o._t){try{const r3=await fetch(o._t.startsWith("http")?`${o._t}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${o._t}/readings?latest`);const d3=await r3.json();if(d3.items?.[0])o.temp=d3.items[0].value}catch{}}cache[k]=o;return o}catch{return null}}

const DOY=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/864e5);
function simT(lat){return+(6+8*Math.sin((DOY-80)*Math.PI/183)+(lat-51)*-0.8).toFixed(1)}
function pred(wt){return H.map(sp=>{let sF=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=Math.max(0,1-((DOY-m)/r)**2)}else if(DOY>=sp.s-14&&DOY<sp.s)sF=(DOY-sp.s+14)/28;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(wt>=sp.tMn&&wt<=sp.tMx)tF=Math.max(0,1-((wt-tm)/(tr*1.2))**2);else if(wt>=sp.tMn-2)tF=Math.max(0,(wt-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score)}
function hInt(wt,hr){let hi=0;H.forEach(sp=>{if(DOY<sp.s-10||DOY>sp.e+10)return;let sf=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((DOY-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}
function hatchesAtHr(wt,hr){return H.filter(sp=>{if(DOY<sp.s-7||DOY>sp.e+7)return false;if(!sp.pk.includes(hr)&&!sp.pk.includes(hr-1)&&!sp.pk.includes(hr+1))return false;return wt>=sp.tMn-2&&wt<=sp.tMx+2}).sort((a,b)=>b.t-a.t).slice(0,3)}

const hC=s=>s>70?D.rust:s>40?D.gn:s>15?D.txM:D.txD;
const windDir=d=>{const dirs=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];return dirs[Math.round(d/22.5)%16]};
const scClr=s=>s>=75?D.rust:s>=55?D.gn:s>=35?D.txM:D.txD;
const scLb=s=>s>=90?"Exceptional":s>=75?"Excellent":s>=55?"Good":s>=35?"Fair":"Poor";

/* ── SCORING with transparency ── */
function condScore(wind,press,cloud,wt,hIdx,rq,bq){
  let s=0;const why=[];
  const hp=Math.min(30,hIdx*0.30);s+=hp;
  if(hIdx>60)why.push("strong hatch activity");else if(hIdx>30)why.push("moderate hatches");else why.push("limited hatches");
  if(wt>=13&&wt<=17){s+=18;why.push("ideal water temp")}else if(wt>=11&&wt<=19)s+=13;else{s+=6;why.push("cool water")}
  if(cloud>70){s+=12;why.push("overcast")}else if(cloud>50)s+=9;else if(cloud>30)s+=6;else{s+=3;why.push("bright")}
  if(press<1008){s+=10;why.push("low pressure")}else if(press<1015)s+=8;else if(press<1022)s+=6;else s+=3;
  if(wind>=3&&wind<=10)s+=15;else if(wind<3)s+=10;else if(wind<=14)s+=9;else if(wind<=18){s+=5;why.push("windy")}else{s+=2;why.push("gale")}
  const avgQ=((rq||5)+(bq||rq||5))/2;s+=Math.round(avgQ*1.5);
  const pct=Math.round(Math.min(100,Math.max(0,s)));
  const pos=why.filter(r=>!["limited hatches","cool water","bright","windy","gale"].includes(r));
  const neg=why.filter(r=>["limited hatches","cool water","bright","windy","gale"].includes(r));
  let txt=pos.length?pos.slice(0,2).join(", "):"Mixed conditions";
  if(neg.length)txt+=" but "+neg[0];
  return{pct,label:scLb(pct),clr:scClr(pct),why:txt.charAt(0).toUpperCase()+txt.slice(1)+"."};
}

function danSt(wt){const as=139;if(DOY>172)return{s:"Season ended",c:D.txD};if(DOY>as+14&&wt>=12)return{s:"On the water",c:D.rust};if(DOY>as&&wt>=12)return{s:"Underway",c:D.rust};if(DOY>as-7&&wt>=11)return{s:"On time",c:D.gn};if(DOY>as-7)return{s:"Late",c:D.txD};if(DOY>as-14&&wt>=13)return{s:"Early",c:D.rust};if(DOY>as-14)return{s:"Days away",c:D.txM};return{s:"Not yet",c:D.txD}}

/* ── WHAT CHANGED: delta vs yesterday (deterministic) ── */
function whatChanged(wind,press,cloud,wt,hIdx,rq,bq){
  const t=condScore(wind,press,cloud,wt,hIdx,rq,bq);
  const sd=(DOY*137+Math.round(wt*10))%100/100;
  const sd2=(DOY*251+Math.round(wind*10))%100/100;
  const yWt=+(wt-0.3+sd*0.6).toFixed(1);const yWind=Math.max(1,wind+Math.round((sd-0.5)*6));
  const yCloud=Math.min(100,Math.max(0,cloud+Math.round((sd2-0.5)*30)));const yPress=press+Math.round((sd-0.5)*6);
  const yHi=Math.max(0,hIdx+(sd2-0.5)*15);
  const y=condScore(yWind,yPress,yCloud,yWt,yHi,rq,bq);
  const d=t.pct-y.pct;if(Math.abs(d)<3)return null;
  const reasons=[];
  if(wind<yWind-3)reasons.push("dropping wind");else if(wind>yWind+3)reasons.push("rising wind");
  if(cloud>yCloud+15)reasons.push("more cloud");else if(cloud<yCloud-15)reasons.push("less cloud");
  if(wt>yWt+0.3)reasons.push("warmer water");else if(wt<yWt-0.3)reasons.push("cooler water");
  if(press<yPress-3)reasons.push("falling pressure");
  const cause=reasons.length?` — ${reasons.slice(0,2).join(" and ")}`:"";
  return{d,txt:`${d>0?"+":""}${d}% vs yesterday${cause}`};
}

/* ── TIMELINE: river evolving through the day ── */
function buildTimeline(hrs,wt){
  if(!hrs||!hrs.length)return[];
  return[7,9,11,13,15,17,19].map(hr=>{
    const hd=hrs.find(h=>h.h===hr);if(!hd)return null;
    const hi=hInt(hd.wt||wt,hr);const hatches=hatchesAtHr(hd.wt||wt,hr);
    let note;
    if(hr<=8)note=hi<1?"Cold. Little activity yet.":hi>=2?"Warming up. Early risers possible.":"First signs of life.";
    else if(hr<=10)note=hi>=3?"Olives hatching. Fish looking up.":hi>=1?"Building slowly. Watch for the first rises.":"Still quiet. Nymph or wait.";
    else if(hr<=12)note=hi>=5?"Strong hatch. Fish rising freely.":hi>=3?"Steady hatch developing. Good sport.":hi>=1?"Sparse activity. Pick your spots.":"Quiet. Nymph the runs.";
    else if(hr<=14)note=hi>=6?"Peak window. Best of the day.":hi>=3?"Good activity continuing.":"Lull. Try emergers in the film.";
    else if(hr<=16)note=hi>=3?"Afternoon hatch holding up.":hi>=1?"Activity fading. Fish becoming selective.":"Afternoon lull. Rest the water.";
    else if(hr<=18)note=hi>=2?"Late activity. BWO possible.":"Waiting for the evening rise.";
    else note=hi>=3?"Evening rise underway.":hi>=1?"Sedge chance if warm enough.":"Cooling off. Day winding down.";
    const fly=hatches.length?FLYMAP[hatches[0].id]||"":"";
    return{hr,note,fly,hatches:hatches.map(h=>h.cm),hi};
  }).filter(Boolean);
}

/* ── NOW WINDOW: current + next ── */
function nowWindow(timeline){
  if(!timeline||!timeline.length)return null;
  const hr=new Date().getHours();
  const cur=timeline.find(e=>Math.abs(e.hr-hr)<=1)||timeline.find(e=>e.hr<=hr+2&&e.hr>=hr-1)||timeline[0];
  const nxt=timeline.find(e=>e.hr>=(cur?cur.hr:0)+2);
  return{cur:cur||null,nxt:nxt||null};
}

/* ── ANTICIPATION: what might happen next ── */
function buildAntic(cW,cC,cP,wt,spp){
  const n=[];
  if(cC>60&&wt>=11)n.push("Overcast skies should encourage hatches through midday.");
  else if(cC<30&&wt>=12)n.push("Bright conditions — fish the shade or wait for evening.");
  if(cP<1010)n.push("Low pressure dropping. Fish often feed harder before fronts.");
  if(cW>14)n.push("Wind dropping later could improve dry fly presentation.");
  if(wt>=12&&spp.find(s=>s.id==="bwo"&&s.score>20))n.push("BWO possible from late afternoon if temperature holds.");
  if(wt>=13&&spp.find(s=>s.id==="sedge"&&s.score>15))n.push("Evening sedge activity likely if it stays warm.");
  if(wt<11)n.push("Water still cool. Nymphing will outperform dries until it warms.");
  if(!n.length)n.push("Conditions settled. Fish the hatches as they come.");
  return n.slice(0,3);
}

/* ── 8-WEEK OUTLOOK ── */
function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),cf:w<2?"High":w<4?"Med":"Low"}})}

/* ── SESSION TIMER ── */
function fmtDur(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);if(h>0)return`${h}h ${m%60}m`;return`${m}m`}

/* ═══ APP ═══ */
export default function App(){
  /* AUTH */
  const[user,setUserState]=useState(()=>getUser());
  const[authMode,setAuthMode]=useState("login");
  const[authName,setAuthName]=useState("");const[authEmail,setAuthEmail]=useState("");
  const login=(name,email)=>{const u={name,email,joined:new Date().toISOString()};setUser(u);setUserState(u)};
  const logout=()=>{localStorage.removeItem(STORE_USER);setUserState(null)};

  /* CORE STATE */
  const[riv,setRiv]=useState(()=>getPrefs().lastRiver||"test");
  const[beat,setBeat]=useState(()=>getPrefs().lastBeat||"Stockbridge");
  const[tab,setTab]=useState("guide");const[pick,setPick]=useState(false);const[gDay,setGDay]=useState(-1);
  const[live,setLive]=useState({});const[light,setLight]=useState(()=>getPrefs().light||false);
  const[scenario,setScenario]=useState(null);const[method,setMethod]=useState("dry");
  const[flyT,setFlyT]=useState("dry");const[openFly,setOpenFly]=useState(null);
  const[ex,setEx]=useState({});const toggle=k=>setEx(p=>({...p,[k]:!p[k]}));

  /* SESSION TRACKING */
  const[sessions,setSessions]=useState(()=>getSessions());
  const[showForm,setShowForm]=useState(false);
  const[onRiver,setOnRiver]=useState(false);
  const[sessionStart,setSessionStart]=useState(null);
  const[sessionFish,setSessionFish]=useState(0);
  const[sessionFlies,setSessionFlies]=useState([]);
  const[sessionNotes,setSessionNotes]=useState("");
  const[sessionTick,setSessionTick]=useState(0);

  /* SESSION FORM */
  const[fName,setFName]=useState(()=>user?.name||"");
  const[fBeat,setFBeat]=useState("");const[fFish,setFish]=useState("");
  const[fBig,setFBig]=useState("");const[fFly,setFFly]=useState("");
  const[fNotes,setFNotes]=useState("");const[fRating,setFRating]=useState("");

  const P=light?L:D;const rv=RV.find(r=>r.id===riv);

  /* SAVE PREFS */
  useEffect(()=>{savePrefs({lastRiver:riv,lastBeat:beat,light})},[riv,beat,light]);

  /* DATA FETCH */
  const doFetch=useCallback(async()=>{try{const[ea,wx]=await Promise.all([fetchEA(rv.ea),fetchWx(rv.lat,rv.lng)]);setLive({ea,wx})}catch{}},[rv]);
  useEffect(()=>{doFetch()},[doFetch]);
  useEffect(()=>{const i=setInterval(doFetch,onRiver?3e5:9e5);return()=>clearInterval(i)},[doFetch,onRiver]);
  useEffect(()=>{setBeat(rv.b[0]||"")},[riv]);

  /* SESSION TIMER TICK */
  useEffect(()=>{if(!onRiver)return;const i=setInterval(()=>setSessionTick(t=>t+1),60000);return()=>clearInterval(i)},[onRiver]);

  /* COMPUTED */
  const rSeed=rv.id.split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0);
  const cT=live.ea?.temp||simT(rv.lat);
  const cW=live.wx?.current?.wind_speed_10m?Math.round(live.wx.current.wind_speed_10m*0.621):(4+(rSeed%12));
  const cP=live.wx?.current?.pressure_msl?Math.round(live.wx.current.pressure_msl):(1008+(rSeed%18));
  const cC=live.wx?.current?.cloud_cover??(30+(rSeed%50));
  const cWD=live.wx?.current?.wind_direction_10m||(rSeed%360);
  const cAir=live.wx?.current?.temperature_2m?Math.round(live.wx.current.temperature_2m):(11+(rSeed%8));

  const spp=useMemo(()=>pred(cT),[cT]);
  const topH=spp[0];const dan=spp.find(s=>s.id==="danica");
  const actIds=spp.filter(s=>s.score>10).map(s=>s.id);
  const hIdx=spp.reduce((s,h)=>s+h.score*(h.t===1?3:h.t===2?1.5:0.8),0)/spp.reduce((s,h)=>s+100*(h.t===1?3:h.t===2?1.5:0.8),0)*100;
  const cond=useMemo(()=>condScore(cW,cP,cC,cT,hIdx,rv.q,rv.bq?.[beat]),[cW,cP,cC,cT,hIdx,rv,beat]);
  const rig=buildRig(cT,cW,cC,method,topH);const ds=danSt(cT);
  const antic=useMemo(()=>buildAntic(cW,cC,cP,cT,spp),[cW,cC,cP,cT,spp]);
  const delta=useMemo(()=>whatChanged(cW,cP,cC,cT,hIdx,rv.q,rv.bq?.[beat]),[cW,cP,cC,cT,hIdx,rv,beat]);
  const lr=useMemo(()=>genLR(cT),[cT]);
  const rpts=RPT[riv]||[];const srcC={Keeper:D.gn,Guide:D.txD,Club:"#5A7A5E",Social:D.txM};

  const wxDays=useMemo(()=>{const wx=live.wx;if(!wx?.hourly||!wx?.daily)return[];try{return Array.from({length:Math.min(7,wx.daily.time?.length||0)},(_,d)=>{const dt=new Date(wx.daily.time[d]);const hrs=[];for(let hr=7;hr<=21;hr++){const idx=d*24+hr;if(idx>=(wx.hourly.time?.length||0))break;const air=wx.hourly.temperature_2m?.[idx]||15;const bA=((wx.daily.temperature_2m_max?.[d]||15)+(wx.daily.temperature_2m_min?.[d]||8))/2;const wt=+(cT+(air-bA)*0.15).toFixed(1);hrs.push({h:hr,wt,air:Math.round(air),hi:+hInt(wt,hr).toFixed(1),ws:wx.hourly.wind_speed_10m?.[idx]?Math.round(wx.hourly.wind_speed_10m[idx]*0.621):null,cl:wx.hourly.cloud_cover?.[idx]??50})}return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH:wx.daily.temperature_2m_max?.[d]?Math.round(wx.daily.temperature_2m_max[d]):null,aL:wx.daily.temperature_2m_min?.[d]?Math.round(wx.daily.temperature_2m_min[d]):null,rain:wx.daily.precipitation_sum?.[d]??null,windMax:wx.daily.wind_speed_10m_max?.[d]?Math.round(wx.daily.wind_speed_10m_max[d]*0.621):null,hrs}})}catch{return[]}},[live.wx,cT]);

  const timeline=useMemo(()=>wxDays[0]?buildTimeline(wxDays[0].hrs,cT):[],[wxDays,cT]);
  const nowWin=useMemo(()=>nowWindow(timeline),[timeline]);

  /* SESSION ACTIONS */
  const startSession=()=>{setOnRiver(true);setSessionStart(Date.now());setSessionFish(0);setSessionFlies([]);setSessionNotes("");setSessionTick(0)};
  const endSession=()=>{
    if(sessionStart){
      const sess={id:Date.now(),d:new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(sessionStart).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),dur:fmtDur(Date.now()-sessionStart),river:rv.n,beat,fish:sessionFish,flies:sessionFlies,notes:sessionNotes,user:user?.name||"Anon",score:cond.pct,topHatch:topH?.cm||""};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
    }
    setOnRiver(false);setSessionStart(null);
  };
  const addFishToSession=()=>{setSessionFish(f=>f+1)};

  /* SAVE MANUAL SESSION */
  const saveManualSession=()=>{
    if(fBeat&&(fNotes||fFish)){
      const now=new Date();
      const sess={id:Date.now(),d:now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,big:fBig,fly:fFly,notes:fNotes,rating:fRating,user:fName||user?.name||"Anon",dur:"Manual"};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
      setFBeat("");setFish("");setFBig("");setFFly("");setFNotes("");setFRating("");setShowForm(false);
    }
  };

  /* ── LOGIN SCREEN ── */
  if(!user)return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:D.bg,minHeight:"100vh",color:D.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <W s={48} c={D.tx} r/>
      <div style={{fontSize:16,fontWeight:600,letterSpacing:"0.25em",marginTop:12}}>EPHEMERA</div>
      <div style={{fontSize:10,color:D.txD,marginTop:4}}>Timely insight. Better days.</div>
      <div style={{marginTop:32,width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:12}}>{authMode==="login"?"WELCOME BACK":"CREATE ACCOUNT"}</div>
        <div style={{display:"grid",gap:10}}>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>NAME</div><input value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Your name" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>EMAIL</div><input value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com" type="email" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <button onClick={()=>{if(authName.trim()&&authEmail.trim())login(authName.trim(),authEmail.trim())}} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>{authMode==="login"?"SIGN IN":"CREATE ACCOUNT"}</button>
          <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer"}} onClick={()=>setAuthMode(authMode==="login"?"register":"login")}>{authMode==="login"?"New here? Create an account":"Already have an account? Sign in"}</div>
          <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:8,opacity:0.5}}>Your data is stored locally on this device.</div>
        </div>
      </div>
    </div>
  );

  /* ── MAIN APP ── */
  return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:P.bg,minHeight:"100vh",color:P.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:"calc(68px + env(safe-area-inset-bottom, 0px))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%}input,textarea{font-family:inherit;-webkit-appearance:none}input:focus,textarea:focus{outline:none}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}`}</style>

      {/* HEADER */}
      <div style={{background:P.c1,padding:"14px 14px 10px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><W s={22} c={P.tx} r/><span style={{fontSize:13,fontWeight:600,letterSpacing:"0.2em"}}>EPHEMERA</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"3px 7px",color:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{light?"◐":"☀"}</button>
            <button onClick={logout} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"3px 7px",color:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{user.name.split(" ")[0]} ✕</button>
          </div>
        </div>
        <button onClick={()=>setPick(!pick)} style={{width:"100%",background:P.c2,border:`1px solid ${P.bd}`,borderRadius:7,padding:"9px 12px",color:P.tx,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{rv.n} / {beat}</span><span style={{color:P.txD}}>{pick?"−":"+"}</span></button>
        {pick&&<div style={{marginTop:6,background:P.c2,borderRadius:7,padding:10,border:`1px solid ${P.bd}`,maxHeight:200,overflowY:"auto"}}><div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>{RV.map(r=><button key={r.id} onClick={()=>setRiv(r.id)} style={{padding:"3px 8px",borderRadius:4,border:riv===r.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:riv===r.id?P.rustS:"transparent",color:riv===r.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r.n}</button>)}</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>{setBeat(b);setPick(false)}} style={{padding:"2px 7px",borderRadius:4,border:beat===b?`1px solid ${P.tx}`:`1px solid ${P.bd}`,background:beat===b?P.c3:"transparent",color:beat===b?P.tx:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div></div>}
      </div>

      {/* SCORE BAR — 3 second answer */}
      <div style={{background:P.c1,padding:"14px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:14}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:38,fontWeight:700,color:cond.clr,lineHeight:1}}>{cond.pct}</div><div style={{fontSize:8,fontWeight:700,color:cond.clr,marginTop:2}}>{cond.label}</div>{delta&&<div style={{fontSize:9,fontWeight:700,color:delta.d>0?P.gn:P.rust,marginTop:3}}>{delta.d>0?"▲":"▼"} {Math.abs(delta.d)}</div>}</div>
        <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:P.tx}}>{cond.why}</div>{delta&&<div style={{fontSize:9,color:delta.d>0?P.gn:P.txD,marginTop:2}}>{delta.txt}</div>}<div style={{fontSize:10,color:P.txM,marginTop:3}}>{cAir}° air / {cT}° water / {cW}mph {windDir(cWD)} / {cC>70?"Overcast":cC>40?"Cloud":"Clear"}</div></div>
      </div>

      {/* SESSION MODE BAR */}
      <div style={{background:onRiver?P.rustS:P.c2,padding:"8px 14px",borderBottom:`1px solid ${onRiver?P.rustB:P.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {!onRiver?<button onClick={startSession} style={{background:"transparent",border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 14px",color:P.txD,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>◯ I'm on the river</button>
        :<>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:4,background:P.rust,animation:"pulse 2s infinite"}}/>
            <div><div style={{fontSize:10,fontWeight:700,color:P.rust}}>ON THE RIVER</div><div style={{fontSize:9,color:P.txM}}>{sessionStart?fmtDur(Date.now()-sessionStart+(sessionTick*0)):""} · {sessionFish} fish</div></div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={addFishToSession} style={{background:P.gn,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ FISH</button>
            <button onClick={endSession} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>END</button>
          </div>
        </>}
      </div>

      {/* TABS */}
      <div style={{display:"flex",background:P.c1,borderBottom:`1px solid ${P.bd}`,overflowX:"auto"}}>{[{id:"guide",l:"Guide"},{id:"hatches",l:"Hatches"},{id:"fly",l:"Fly Box"},{id:"outlook",l:"Outlook"},{id:"reports",l:"Reports"},{id:"diagnose",l:"Diagnose"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 12px 8px",border:"none",borderBottom:tab===t.id?`2px solid ${P.rust}`:"2px solid transparent",background:"none",color:tab===t.id?P.rust:P.txD,fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginBottom:-1}}>{t.l}</button>)}</div>

      <div style={{padding:14}}>

        {/* ═══ GUIDE ═══ */}
        {tab==="guide"&&<div>
          {/* SESSION ACTIVE ADVICE */}
          {onRiver&&<div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>SESSION ACTIVE — {beat}</div><div style={{fontSize:9,color:P.txD}}>Updated {new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div></div>
            <div style={{fontSize:13,fontWeight:700,color:P.tx,lineHeight:1.5}}>{cC>60&&cT>=12?"Cloud thickening — hatches should build. Stay on dries.":cC<30&&cT>=14?"Bright conditions. Fish the shade. Consider emergers in the film.":cW>14?"Wind making presentation tough. Try the sheltered bank.":cT<10?"Cool water. Keep nymphing. Watch for olive activity after 11am.":nowWin&&nowWin.cur&&nowWin.cur.hi>=4?"Hatch building now. Watch for rises and match the size.":"Conditions stable. Work upstream, cover water methodically."}</div>
            {nowWin&&nowWin.nxt&&<div style={{fontSize:10,color:P.rust,marginTop:6}}>Next: {nowWin.nxt.hr}:00 — {nowWin.nxt.note}</div>}
            <div style={{marginTop:8}}><div style={{fontSize:8,color:P.txD,marginBottom:4}}>SESSION NOTES</div><textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="What's happening on the water..." rows={2} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 8px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.4}}/></div>
          </div>}

          {/* HATCH OF THE DAY — dominates */}
          {topH&&topH.score>5&&<div style={{background:P.rustS,borderRadius:12,border:`1px solid ${P.rustB}`,padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.15em",color:P.rust}}>HATCH OF THE DAY</div><div style={{fontSize:22,fontWeight:700,color:P.tx,marginTop:6}}>{topH.cm}</div><div style={{fontSize:13,color:P.rust,fontWeight:600,marginTop:4}}>{FLYMAP[topH.id]||"Match the hatch"}</div><div style={{fontSize:9,color:P.txD,marginTop:2,fontStyle:"italic"}}>{FLYCONF[topH.id]||""}</div></div><div style={{textAlign:"center"}}><div style={{fontSize:38,fontWeight:700,color:hC(topH.score),lineHeight:1}}>{topH.score}</div><div style={{fontSize:9,color:hC(topH.score),marginTop:2}}>{topH.lb}</div></div></div>
            {spp.filter(s=>s.score>15&&s.id!==topH.id).length>0&&<div style={{marginTop:10,fontSize:10,color:P.txM}}>Also active: {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).map(s=>`${s.cm} ${s.score}%`).join(" · ")}</div>}
          </div>}

          {/* APPROACH */}
          <div onClick={()=>toggle("rig")} style={{background:P.rustS,borderRadius:ex.rig?"12px 12px 0 0":12,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:ex.rig?0:10,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>RECOMMENDED APPROACH</div><div style={{fontSize:16,fontWeight:700,color:P.tx,marginTop:4}}>{rig.a}</div><div style={{fontSize:10,color:P.txM,marginTop:2,fontStyle:"italic"}}>{rig.why}</div></div><div style={{textAlign:"center",flexShrink:0,marginLeft:10}}><div style={{fontSize:20,fontWeight:700,color:P.rust}}>{rig.c}%</div></div></div>
          {ex.rig&&<div style={{background:P.rustS,borderRadius:"0 0 12px 12px",border:`1px solid ${P.rustB}`,borderTop:"none",padding:14,marginBottom:10}}>
            <div style={{display:"flex",gap:3,marginBottom:10}}>{METHODS.map(m=><button key={m.id} onClick={e=>{e.stopPropagation();setMethod(m.id)}} style={{padding:"5px 9px",borderRadius:5,border:method===m.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:method===m.id?P.c2:"transparent",color:method===m.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{m.l}</button>)}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>{[{l:"Rod",v:rig.rod},{l:"Leader",v:rig.ldr},{l:"Tippet",v:rig.tip},{l:"Fly",v:rig.fly}].map((r,i)=><div key={i} style={{padding:"5px 7px",background:P.c2,borderRadius:4}}><div style={{fontSize:6,color:P.txD,letterSpacing:"0.1em"}}>{r.l.toUpperCase()}</div><div style={{fontSize:10,fontWeight:600,color:i===3?P.rust:P.tx,marginTop:2}}>{r.v}</div></div>)}</div>
            <div style={{marginTop:6,padding:"6px 7px",background:P.c2,borderRadius:4}}><div style={{fontSize:6,color:P.txD}}>GUIDE TIP</div><div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.5}}>{rig.guide}</div></div>
          </div>}

          {/* ANTICIPATION */}
          <div style={{padding:"10px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD,marginBottom:6}}>LOOKING AHEAD</div>
            {antic.map((n,i)=><div key={i} style={{fontSize:11,color:P.txM,lineHeight:1.6,marginBottom:2}}>{n}</div>)}
          </div>

          {/* RIGHT NOW — always visible */}
          {nowWin&&nowWin.cur&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"10px 14px",marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD,marginBottom:6}}>RIGHT NOW</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{fontSize:14,fontWeight:700,color:nowWin.cur.hi>=3?P.rust:nowWin.cur.hi>=1?P.gn:P.txD}}>{nowWin.cur.hr}:00</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:P.tx}}>{nowWin.cur.note}</div>{nowWin.cur.fly&&<div style={{fontSize:9,color:P.rust,marginTop:2}}>{nowWin.cur.hatches.join(", ")} → {nowWin.cur.fly}</div>}</div></div>
            {nowWin.nxt&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.bd}`,display:"flex",gap:10,alignItems:"center",opacity:0.7}}><div style={{fontSize:12,fontWeight:700,color:nowWin.nxt.hi>=3?P.rust:P.txD}}>{nowWin.nxt.hr}:00</div><div style={{flex:1}}><div style={{fontSize:11,color:P.txM}}>{nowWin.nxt.note}</div></div></div>}
          </div>}

          {/* FULL TIMELINE — collapsible */}
          {timeline.length>0&&<><div onClick={()=>toggle("tl")} style={{background:P.c1,borderRadius:ex.tl?"10px 10px 0 0":10,border:`1px solid ${P.bd}`,padding:"12px 14px",marginBottom:ex.tl?0:10,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>TODAY ON THE RIVER</div><div style={{fontSize:11,color:P.txM,marginTop:2}}>Full day timeline</div></div><span style={{color:P.txD,fontSize:11}}>{ex.tl?"−":"+"}</span></div>
          {ex.tl&&<div style={{background:P.c1,borderRadius:"0 0 10px 10px",border:`1px solid ${P.bd}`,borderTop:"none",padding:"6px 14px 10px",marginBottom:10}}>
            {timeline.map((e,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<timeline.length-1?`1px solid ${P.bd}`:""}}><div style={{width:32,textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:e.hi>=3?P.rust:e.hi>=1?P.gn:P.txD}}>{e.hr}:00</div></div><div style={{flex:1}}><div style={{fontSize:11,color:P.tx,lineHeight:1.5}}>{e.note}</div>{e.fly&&<div style={{fontSize:9,color:P.rust,marginTop:1}}>{e.hatches.join(", ")} → {e.fly}</div>}</div></div>)}
          </div>}</>}

          {/* 7-DAY */}
          {wxDays.length>0&&<><div onClick={()=>toggle("7d")} style={{background:P.c1,borderRadius:ex["7d"]?"10px 10px 0 0":10,border:`1px solid ${P.bd}`,padding:"12px 14px",marginBottom:ex["7d"]?0:10,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>7-DAY OUTLOOK</div><div style={{fontSize:11,color:P.txM,marginTop:2}}>Compare days</div></div><span style={{color:P.txD,fontSize:11}}>{ex["7d"]?"−":"+"}</span></div>
          {ex["7d"]&&<div style={{background:P.c1,borderRadius:"0 0 10px 10px",border:`1px solid ${P.bd}`,borderTop:"none",overflow:"hidden",marginBottom:10}}>
            <div style={{overflowX:"auto"}}><div style={{display:"flex",minWidth:wxDays.length*68}}>{wxDays.map((d,i)=>{const futDoy=DOY+i;const pjH=H.reduce((s,sp)=>{if(futDoy<sp.s-10||futDoy>sp.e+10)return s;let sf=0;if(futDoy>=sp.s&&futDoy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((futDoy-m)/r)**2)}return s+sf*(sp.t===1?30:sp.t===2?12:5)},0);let sc=0;sc+=Math.min(30,pjH*0.30);const avg=((d.aH||14)+(d.aL||8))/2;sc+=avg>=13?15:avg>=10?10:5;sc+=(d.rain||0)<2?7:4;sc+=(d.windMax||8)<=10?15:(d.windMax||8)<=18?7:2;sc+=7+Math.round((rv.q||5)*1.5);sc=Math.round(Math.min(100,sc));return<div key={i} onClick={e=>{e.stopPropagation();setGDay(gDay===i?-1:i)}} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRight:i<wxDays.length-1?`1px solid ${P.bd}`:"",background:sc>=75?P.rustS:gDay===i?P.c2:"transparent",cursor:"pointer"}}><div style={{fontSize:9,fontWeight:600,color:i===0?P.rust:P.tx}}>{d.dn}</div><div style={{fontSize:14,fontWeight:700,color:scClr(sc),marginTop:3}}>{sc}</div><div style={{fontSize:7,color:scClr(sc)}}>{scLb(sc)}</div><div style={{fontSize:10,fontWeight:600,color:P.tx,marginTop:2}}>{d.aH||"--"}°/{d.aL||"--"}°</div>{(d.rain||0)>0&&<div style={{fontSize:7,color:P.txD}}>{d.rain}mm</div>}</div>})}</div></div>
            {gDay>=0&&wxDays[gDay]&&<div style={{padding:"8px 12px",borderTop:`1px solid ${P.bd}`}}>{buildTimeline(wxDays[gDay].hrs,cT).filter((_,i)=>i%2===0).map((e,i)=><div key={i} style={{display:"flex",gap:8,padding:"3px 0"}}><span style={{fontSize:10,fontWeight:700,color:e.hi>=3?P.rust:P.txD,minWidth:30}}>{e.hr}:00</span><span style={{fontSize:10,color:P.txM,flex:1}}>{e.note}</span>{e.fly&&<span style={{fontSize:9,color:P.rust,flexShrink:0}}>{e.fly}</span>}</div>)}</div>}
          </div>}</>}

          {/* RIVER PERSONALITY */}
          <div style={{padding:"10px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD,marginBottom:4}}>{rv.n.toUpperCase()}</div><div style={{fontSize:11,color:P.txM,lineHeight:1.7,fontStyle:"italic"}}>{rv.p}</div></div>

          {/* MAYFLY TRACKER */}
          {dan&&<div style={{padding:"10px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>MAYFLY TRACKER</div><div style={{fontSize:13,fontWeight:700,color:ds.c,marginTop:3}}>{ds.s}</div><div style={{fontSize:9,color:P.txD,marginTop:2}}>Avg May 18-22 / Peak Jun 1-7</div></div><div style={{fontSize:22,fontWeight:700,color:P.rust}}>{dan.score}%</div></div>}
        </div>}

        {/* ═══ HATCHES — active now / expected later ═══ */}
        {tab==="hatches"&&<div>
          {spp.filter(s=>s.score>15).length>0&&<div style={{marginBottom:12}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>ACTIVE NOW</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{spp.filter(s=>s.score>15).map(sp=><div key={sp.id} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:sp.id==="danica"?P.rustS:"transparent"}}><div style={{display:"flex",gap:8}}><div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat],marginTop:6}}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:sp.id==="danica"?P.rust:P.tx}}>{sp.cm}</span><div style={{fontSize:9,color:P.txD,marginTop:2}}>Hook {sp.hk} · {sp.sz}</div><div style={{fontSize:9,color:P.rust,marginTop:1}}>{FLYMAP[sp.id]||""} — <i>{FLYCONF[sp.id]||""}</i></div></div><div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:hC(sp.score)}}>{sp.score}</div><div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div></div></div></div>)}</div></div>}
          {spp.filter(s=>s.score>0&&s.score<=15).length>0&&<div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>EXPECTED LATER THIS SEASON</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{spp.filter(s=>s.score>0&&s.score<=15).map(sp=><div key={sp.id} style={{padding:"8px 12px",borderBottom:`1px solid ${P.bd}`,opacity:0.5}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:P.txM}}>{sp.cm}</span><span style={{fontSize:11,color:P.txD}}>{sp.score}% — {sp.lb}</span></div></div>)}</div></div>}
        </div>}

        {/* ═══ FLY BOX ═══ */}
        {tab==="fly"&&<div>
          <div style={{display:"flex",gap:4,marginBottom:10}}>{[{id:"dry",l:"Dries"},{id:"emerger",l:"Emergers"},{id:"nymph",l:"Nymphs"}].map(t=><button key={t.id} onClick={()=>{setFlyT(t.id);setOpenFly(null)}} style={{flex:1,padding:"9px",borderRadius:8,border:flyT===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyT===t.id?P.rustS:"transparent",color:flyT===t.id?P.rust:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{FLIES[flyT].map((f,i)=>{const isM=f.mt.some(m=>actIds.includes(m));const isO=openFly===f.nm;return<div key={i}><div onClick={()=>setOpenFly(isO?null:f.nm)} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:700,color:isM?P.rust:P.tx}}>{f.nm}</span>{isM&&<span style={{fontSize:7,fontWeight:700,color:P.rust,marginLeft:6,background:P.rustB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}<div style={{fontSize:9,color:P.txD,marginTop:2}}>#{f.sz} — <i>{f.cf}</i></div></div><span style={{color:P.txD,fontSize:11}}>{isO?"−":"+"}</span></div></div>{isO&&<div style={{padding:12,background:P.c2,borderBottom:`1px solid ${P.bd}`}}><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{f.nt}</div></div>}</div>})}</div>
        </div>}

        {/* ═══ OUTLOOK ═══ */}
        {tab==="outlook"&&<div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>8-WEEK FORECAST</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{lr.map((w,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}><div style={{minWidth:68}}><div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div></div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:28}}>Mayfly</span><div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span></div></div><span style={{fontSize:9,color:P.txD}}>~{w.pt}°C</span></div>)}</div></div>}

        {/* ═══ REPORTS — with persistent sessions ═══ */}
        {tab==="reports"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD}}>LOG A SESSION</div><button onClick={()=>setShowForm(!showForm)} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showForm?"CANCEL":"+ LOG"}</button></div>
          {showForm&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:14,marginBottom:14}}><div style={{display:"grid",gap:8}}><div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEAT</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>setFBeat(b)} style={{padding:"4px 8px",borderRadius:4,border:fBeat===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fBeat===b?P.rustS:"transparent",color:fBeat===b?P.rust:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>CAUGHT</div><input value={fFish} onChange={e=>setFish(e.target.value)} placeholder="0" type="number" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div><div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEST FLY</div><input value={fFly} onChange={e=>setFFly(e.target.value)} placeholder="CDC #16" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div></div><div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>RATING</div><div style={{display:"flex",gap:4}}>{["Poor","Fair","Good","Excellent"].map(r=><button key={r} onClick={()=>setFRating(r)} style={{flex:1,padding:"7px",borderRadius:5,border:fRating===r?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fRating===r?P.rustS:"transparent",color:fRating===r?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r}</button>)}</div></div><div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>NOTES</div><textarea value={fNotes} onChange={e=>setFNotes(e.target.value)} placeholder="What happened?" rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div><button onClick={saveManualSession} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:P.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SUBMIT</button></div></div>}

          {/* YOUR SESSIONS — persistent */}
          {sessions.length>0&&<div style={{marginBottom:14}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>YOUR SESSIONS ({sessions.length})</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{sessions.slice(0,20).map((s,i)=><div key={s.id||i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600}}>{s.river} — {s.beat||s.bt}</span><span style={{fontSize:8,fontWeight:700,color:s.rating==="Excellent"||s.fish>=3?P.rust:P.gn}}>{s.rating||`${s.fish} fish`}</span></div><div style={{display:"flex",gap:8,fontSize:9,color:P.txD}}><span>{s.d}</span>{s.time&&<span>{s.time}</span>}{s.dur&&<span>{s.dur}</span>}<span>{s.user}</span></div>{s.fish>0&&!s.rating&&<div style={{fontSize:10,color:P.txM,marginTop:2}}>{s.fish} fish caught{s.topHatch?` during ${s.topHatch}`:""}</div>}{s.notes&&<div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.5}}>{s.notes}</div>}{s.fly&&<div style={{fontSize:9,color:P.rust,marginTop:2}}>Best fly: {s.fly}</div>}</div>)}</div></div>}

          {/* RIVER REPORTS */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>RIVER REPORTS</div>
          {rpts.length>0?<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{rpts.map((r,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}><span style={{fontSize:7,fontWeight:700,color:srcC[r.src]||P.txM,border:`1px solid ${(srcC[r.src]||P.txM)}33`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span><span style={{fontSize:11,fontWeight:600}}>{r.bt}</span><span style={{fontSize:9,color:P.txD}}>{r.d}</span>{r.v&&<span style={{marginLeft:"auto",fontSize:7,color:P.gn,fontWeight:600}}>✓ verified</span>}</div><div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>{r.tx}</div></div>)}</div>:<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:20,textAlign:"center",color:P.txM,fontSize:12}}>No reports yet for this river.</div>}
        </div>}

        {/* ═══ DIAGNOSE ═══ */}
        {tab==="diagnose"&&<div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8}}>WHAT'S HAPPENING?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>{SC.map(sc=><button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)} style={{padding:"14px 10px",borderRadius:8,border:scenario===sc.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:scenario===sc.id?P.rustS:P.c1,color:scenario===sc.id?P.rust:P.tx,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}><div style={{fontSize:16,marginBottom:4}}>{sc.i}</div>{sc.l}</button>)}</div>
          {scenario&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{SC.find(s=>s.id===scenario)?.a.map((a,i)=><div key={i} style={{padding:14,borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:13,fontWeight:700,color:P.tx,flex:1}}>{a.h}</div><span style={{fontSize:14,fontWeight:700,color:a.c>=80?P.rust:P.gn}}>{a.c}%</span></div><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{a.d}</div></div>)}</div>}
        </div>}
      </div>

      <div style={{textAlign:"center",padding:14,borderTop:`1px solid ${P.bd}`}}><W s={20} c={P.txD} r/><div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em",marginTop:4}}>EPHEMERA / Timely insight. Better days.</div></div>

      {/* NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>{[{id:"guide",l:"Guide",i:"◉"},{id:"hatches",l:"Hatches",i:"◎"},{id:"fly",l:"Flies",i:"◈"},{id:"outlook",l:"Outlook",i:"◑"},{id:"reports",l:"Reports",i:"◇"},{id:"diagnose",l:"Diagnose",i:"⊕"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"9px 0 6px",border:"none",background:"none",color:tab===n.id?P.rust:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:13,lineHeight:1}}>{n.i}</div><div style={{fontSize:7,fontWeight:600,marginTop:2}}>{n.l}</div></button>)}</div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
