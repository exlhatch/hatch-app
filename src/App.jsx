import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   E P H E M E R A — Your pocket fly fishing guide
   Diagnose what's happening. Make the next best change.
   ═══════════════════════════════════════════════════════════════════════════ */

const W=({s=24,c="#F3F0E8",r=false})=><svg width={s} height={s} viewBox="100 40 320 380" fill="none" strokeLinecap="round" strokeLinejoin="round"><g stroke={c}><path d="M176 306C205 197 286 103 382 62C360 158 297 250 176 306Z" strokeWidth="18"/><path d="M179 304C232 245 292 189 374 68" strokeWidth="10"/><path d="M221 269C252 261 287 246 323 221" strokeWidth="9"/><path d="M252 222C281 215 312 202 344 178" strokeWidth="9"/><path d="M118 334H394" strokeWidth="14"/><path d="M151 368H357" strokeWidth="10"/></g><path d="M198 398H310" stroke={r?"#C36A3D":c} strokeWidth="8" strokeLinecap="round"/></svg>;

const D={bg:"#161E1B",c1:"#1B2421",c2:"#212C28",c3:"#283632",bd:"#2E3B36",tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",rust:"#C36A3D",gn:"#7A9E7E",rustS:"#C36A3D18",rustB:"#C36A3D40"};
const L={bg:"#F3F0E8",c1:"#FFFFFF",c2:"#EBE8E0",c3:"#E0DDD5",bd:"#D0CCC2",tx:"#1F2D2A",txM:"#5F6F7B",txD:"#8A948F",rust:"#C36A3D",gn:"#5A7A5E",rustS:"#C36A3D12",rustB:"#C36A3D30"};

/* ── RIVERS ── */
const RV=[
  {id:"test",n:"River Test",ea:"Test",lat:51.09,lng:-1.49,b:["Broadlands","Nursling","Timsbury","Mottisfont","Horsebridge","Park Stream","Stockbridge","Leckford","Longparish","Whitchurch","Laverstoke"]},
  {id:"itchen",n:"River Itchen",ea:"Itchen",lat:51.06,lng:-1.30,b:["Itchen Abbas","Martyr Worthy","Easton","Abbotts Barton","Twyford","Shawford"]},
  {id:"kennet",n:"River Kennet",ea:"Kennet",lat:51.42,lng:-1.52,b:["Marlborough","Ramsbury","Littlecote","Hungerford","Kintbury","Thatcham"]},
  {id:"lambourn",n:"River Lambourn",ea:"Lambourn",lat:51.50,lng:-1.53,b:["Upper Lambourn","Great Shefford","Welford"]},
  {id:"anton",n:"River Anton",ea:"Anton",lat:51.19,lng:-1.50,b:["Goodworth Clatford","Upper Clatford","Anton Lakes"]},
  {id:"dever",n:"River Dever",ea:"Dever",lat:51.16,lng:-1.27,b:["Micheldever","Bullington"]},
  {id:"avon",n:"Hampshire Avon",ea:"Avon Hampshire",lat:51.17,lng:-1.78,b:["Upavon","Figheldean","Netheravon","Amesbury","Salisbury"]},
  {id:"wylye",n:"River Wylye",ea:"Wylye",lat:51.17,lng:-2.06,b:["Warminster","Heytesbury","Codford","Wylye Village"]},
  {id:"nadder",n:"River Nadder",ea:"Nadder",lat:51.08,lng:-1.98,b:["Tisbury","Barford St Martin","Wilton"]},
  {id:"ebble",n:"River Ebble",ea:"Ebble",lat:51.03,lng:-1.92,b:["Broad Chalke","Bishopstone"]},
  {id:"meon",n:"River Meon",ea:"Meon",lat:50.94,lng:-1.14,b:["East Meon","West Meon","Droxford"]},
  {id:"piddle",n:"River Piddle",ea:"Piddle",lat:50.73,lng:-2.21,b:["Piddletrenthide","Puddletown"]},
  {id:"frome",n:"Frome (Dorset)",ea:"Frome",lat:50.71,lng:-2.44,b:["Maiden Newton","Dorchester"]},
  {id:"mimram",n:"River Mimram",ea:"Mimram",lat:51.80,lng:-0.22,b:["Welwyn","Tewin"]},
  {id:"chess",n:"River Chess",ea:"Chess",lat:51.65,lng:-0.60,b:["Chesham","Latimer","Rickmansworth"]},
  {id:"darent",n:"River Darent",ea:"Darent",lat:51.37,lng:0.18,b:["Shoreham","Eynsford","Lullingstone"]},
  {id:"ver",n:"River Ver",ea:"Ver",lat:51.72,lng:-0.34,b:["Redbourn","St Albans"]},
  {id:"wandle",n:"River Wandle",ea:"Wandle",lat:51.42,lng:-0.17,b:["Carshalton","Wandsworth"]},
];

/* ── HATCHES ── */
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

/* ── REFUSAL DIAGNOSIS ── */
const SCENARIOS = [
  {id:"rising",label:"Fish are rising",icon:"◉",advice:[
    {h:"Match the size first, pattern second",d:"Forget the specific pattern. Get the size right. A size 16 when they want 18 will get refused every time. Watch what's on the water, match the silhouette.",conf:85},
    {h:"Check your drift",d:"Micro-drag is invisible to you but not to the fish. Throw slack, mend upstream, or try a reach cast. A dragging fly gets inspected and refused.",conf:80},
    {h:"Drop your tippet",d:"If they're looking and turning away, go one size finer. 5X to 6X can make the difference. Fluorocarbon in the tippet section helps.",conf:75},
  ]},
  {id:"refusing",label:"Fish are refusing",icon:"✕",advice:[
    {h:"Go smaller and lighter",d:"Drop one hook size AND one tippet size. If you're on a 16, try an 18 on 6X. Present it 6 inches upstream of the last refusal position.",conf:90},
    {h:"Switch from dun to emerger",d:"Fish often key on emergers trapped in the film, not the fully hatched dun sitting on top. Try a CDC shuttlecock or Klinkhamer instead of a hackled dry.",conf:85},
    {h:"Change your angle",d:"If you're casting upstream, try a curve cast to put the fly ahead of the leader. Or move to the other bank entirely. Leader shadow or line flash may be spooking them.",conf:70},
    {h:"Wait and watch for 5 minutes",d:"Stop casting. Watch the rhythm. Is the fish moving to every fly or selecting? Count the time between rises. Match your cast timing to the fish's feeding rhythm.",conf:80},
  ]},
  {id:"nothing",label:"No signs of life",icon:"—",advice:[
    {h:"Go subsurface",d:"Fish a weighted nymph — Pheasant Tail or Hare's Ear, size 14-16, dead drifted along the bottom. Use enough weight to tick the gravel. They're down there, they're just not advertising.",conf:75},
    {h:"Try an induced take",d:"Cast upstream, let the nymph sink, then lift the rod tip to swing it up through the water column. This mimics an ascending nymph and triggers takes from otherwise passive fish.",conf:70},
    {h:"Fish the structure",d:"On a blank day, target the features: weed bed margins, undercut banks, overhanging trees, bridge pools. Fish hold tight to cover when they're not feeding actively.",conf:65},
    {h:"Be patient — check the clock",d:"Chalkstream hatches have rhythm. Olives 10am-1pm, mayfly midday-4pm, BWO from 6pm. If you're between windows, nymph or wait.",conf:60},
  ]},
  {id:"cruising",label:"Fish cruising",icon:"↺",advice:[
    {h:"Intercept, don't chase",d:"Watch the patrol route. Fish in chalkstreams often cruise a circuit. Position yourself ahead of the route and put the fly in the path. One cast, placed right.",conf:85},
    {h:"Go emerger in the film",d:"Cruising fish are often looking for opportunistic food in the film. A CDC shuttlecock or suspended buzzer, dead still, in the cruising lane. Let them find it.",conf:80},
    {h:"Use a longer leader",d:"Cruising fish in clear water see everything. Extend your leader to 12-15ft minimum. Degreased tippet. No flash.",conf:75},
  ]},
  {id:"windy",label:"It's windy",icon:"≈",advice:[
    {h:"Fish the sheltered bank",d:"Fish move to the lee bank because food collects there. The wind pushes terrestrials onto the water — hawthorn flies, black gnats, beetles. Switch to a terrestrial pattern.",conf:85},
    {h:"Use bigger flies",d:"Wind ripple hides your leader and approach. Fish are less spooky. Use a size 12-14 Adams, a Wulff pattern, or a foam beetle. Heavier flies cut through wind better.",conf:80},
    {h:"Shorten your cast and lower your rod",d:"Don't fight the wind with distance. Wade closer (carefully), keep your backcast low, punch into the wind on the forward cast. Accuracy beats distance.",conf:75},
  ]},
  {id:"bright",label:"Bright & clear",icon:"☀",advice:[
    {h:"Fish the shade",d:"Bright sun pushes fish under cover — overhanging trees, bridge shadows, deep weed channels. These fish are often big and confident in their lies. Present from downstream.",conf:85},
    {h:"Go fine",d:"Fine tippets (6X minimum), long leaders (12-15ft), small flies (18-20). Degreased leader. Rub mud on the last 3 feet. Every detail matters when the sun's on the water.",conf:90},
    {h:"Wait for evening",d:"The best bright-day fishing is often the last two hours. As the sun drops, fish move out of cover. The evening BWO hatch on a bright day can be extraordinary.",conf:70},
  ]},
  {id:"coloured",label:"Water is coloured",icon:"◐",advice:[
    {h:"Go bigger and flashier",d:"Coloured water means fish rely more on vibration and silhouette. Larger nymphs (size 12-14), gold-ribbed patterns, a bit of flash in the thorax. They need to find it.",conf:80},
    {h:"Fish the margins",d:"Fish push to the edges in coloured water where flow is slower and visibility better. Tight to the bank, in slack water, behind weed beds.",conf:85},
    {h:"Nymph deep and slow",d:"Surface fishing is largely pointless in coloured water. Heavy nymph, close to the bottom, dead drift. Czech nymphing if the beat allows it.",conf:75},
  ]},
  {id:"spooking",label:"Fish spooking",icon:"!",advice:[
    {h:"Stop moving",d:"Stand still for 2 full minutes. Fish have short memories but long attention spans. Once spooked they'll return to position within 5-10 minutes if you're motionless.",conf:90},
    {h:"Approach from downstream",d:"Fish face upstream. Come from behind. Low profile, slow steps, no sudden movements. Kneel if you need to. Your silhouette against the sky is the biggest giveaway.",conf:85},
    {h:"Reduce false casting",d:"Every false cast is a chance to line the fish. Measure your cast off to the side, then deliver in one shoot. Rod flash spooks more fish than bad flies.",conf:80},
    {h:"Check your wading",d:"In chalkstreams, gravel crunching underfoot transmits through the water. Slow down. Felt soles are quieter than studs. Or stay on the bank entirely.",conf:70},
  ]},
  {id:"missed",label:"Takes missed",icon:"↗",advice:[
    {h:"Slow your strike",d:"On dry fly, wait until you see the mouth close or the nose go down. 'God save the Queen' before lifting. Striking at the rise, not the take, is the number one reason for missed fish.",conf:90},
    {h:"Check your hook",d:"Barbless hooks need to be sharp. Run it across your thumbnail — if it slides, sharpen it or change it. A sticky-sharp hook point converts follows into hookups.",conf:85},
    {h:"Tighten your connection",d:"Slack line between rod tip and fly means delayed hook sets. Keep the rod tip low, line straight, minimal slack on the water. You need instant contact.",conf:75},
  ]},
];

/* ── RIG BUILDER ── */
function buildRig(wt,wind,cloud,level){
  const clear=level<0.55;const warm=wt>=12;
  if(warm&&cloud>60)return{method:"Dry fly upstream",rod:"9ft 4-5wt",leader:`${clear?"12-15ft":"9-12ft"} tapered`,tippet:clear?"5X-6X nylon":"4X-5X nylon",fly:"Match the hatch — check today's top fly above",depth:"Surface",indicator:"None",conf:85,why:"Overcast warm conditions ideal for surface. Fish confident, hatches likely. Classic upstream dry fly."};
  if(warm&&cloud<40)return{method:"Emerger in the film",rod:"9ft 4-5wt",leader:"12-15ft tapered, degreased",tippet:"6X fluorocarbon tippet",fly:"CDC Shuttlecock or Klinkhamer, match size to hatch",depth:"In the film",indicator:"None — watch the leader",conf:75,why:"Bright conditions. Fish selective, feeding subsurface. Emergers outperform duns in bright light."};
  if(!warm&&wind<10)return{method:"Upstream nymph",rod:"9-10ft 4-5wt",leader:"9-12ft tapered",tippet:"5X fluorocarbon",fly:"Pheasant Tail #16 or Hare's Ear #14, weighted",depth:"Close to bottom",indicator:"Small yarn or Nezone",conf:80,why:"Cool water. Fish feeding subsurface. Dead drift nymph along gravel runs and weed margins."};
  if(wind>12)return{method:"Terrestrial / bushy dry",rod:"9ft 5wt",leader:"9ft tapered",tippet:"4X-5X nylon",fly:"Hawthorn, Black Gnat, Adams #12-14, or foam beetle",depth:"Surface",indicator:"The fly is the indicator",conf:80,why:"Wind blowing food onto the water. Fish the sheltered bank. Bigger flies, shorter casts."};
  return{method:"Nymph and watch",rod:"9-10ft 4-5wt",leader:"9-12ft tapered",tippet:"5X fluorocarbon",fly:"Pheasant Tail #16, dead drift or induced take",depth:"Mid-water to bottom",indicator:"Small yarn if needed",conf:70,why:"Mixed conditions. Start subsurface, switch to dry if you see rises. Stay versatile."};
}

/* ── ENGINE ── */
const cache={};
async function fetchWx(la,lo){const k=`w${la.toFixed(1)}_${lo.toFixed(1)}`;if(cache[k])return cache[k];try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,precipitation_probability,pressure_msl,wind_speed_10m,cloud_cover&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/London&forecast_days=7&current=temperature_2m,wind_speed_10m,pressure_msl,cloud_cover,precipitation`);const d=await r.json();cache[k]=d;return d}catch{return null}}
async function fetchEA(name){const k=`e_${name}`;if(cache[k])return cache[k];try{const r=await fetch(`https://environment.data.gov.uk/hydrology/id/stations?riverName=${encodeURIComponent(name)}&_limit=5`);const d=await r.json();const out={level:null,temp:null};for(const s of(d.items||[]))for(const m of(s.measures||[])){const id=typeof m==="string"?m:m["@id"];const p=(typeof m==="string"?"":m.parameterName||m.parameter||"").toLowerCase();if(p.includes("level")&&!out._l)out._l=id;if(p.includes("temp")&&!out._t)out._t=id}
  if(out._l){try{const r2=await fetch(out._l.startsWith("http")?`${out._l}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${out._l}/readings?latest`);const d2=await r2.json();if(d2.items?.[0])out.level=d2.items[0].value}catch{}}
  if(out._t){try{const r3=await fetch(out._t.startsWith("http")?`${out._t}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${out._t}/readings?latest`);const d3=await r3.json();if(d3.items?.[0])out.temp=d3.items[0].value}catch{}}
  cache[k]=out;return out}catch{return null}}

const DOY=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/864e5);
function simT(lat){return+(6+8*Math.sin((DOY-80)*Math.PI/183)+(lat-51)*-0.8).toFixed(1)}
function pred(wt){return H.map(sp=>{let sF=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=Math.max(0,1-((DOY-m)/r)**2)}else if(DOY>=sp.s-14&&DOY<sp.s)sF=(DOY-sp.s+14)/28;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(wt>=sp.tMn&&wt<=sp.tMx)tF=Math.max(0,1-((wt-tm)/(tr*1.2))**2);else if(wt>=sp.tMn-2)tF=Math.max(0,(wt-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score)}
function hInt(wt,hr){let hi=0;H.forEach(sp=>{if(DOY<sp.s-10||DOY>sp.e+10)return;let sf=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((DOY-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}
const hC=s=>s>70?D.rust:s>40?D.gn:s>15?D.txM:D.txD;
const iC=v=>v>=6?D.rust:v>=4?"#A85C2E":v>=2?D.gn:v>=1?"#3E5A40":"#1E2E26";
function danSt(wt){const as=139;if(DOY>172)return{s:"Season ended",c:D.txD};if(DOY>as+14&&wt>=12)return{s:"On the water",c:D.rust};if(DOY>as&&wt>=12)return{s:"Underway",c:D.rust};if(DOY>as-7&&wt>=11)return{s:"On time",c:D.gn};if(DOY>as-7)return{s:"Late — cool water",c:D.txD};if(DOY>as-14&&wt>=13)return{s:"Early — warm spring",c:D.rust};if(DOY>as-14)return{s:"Days away",c:D.txM};return{s:"Not yet",c:D.txD}}

function condRating(wind,rain,press,cloud){
  let s=0,mx=0;
  if(press>1020){s+=1;mx+=3}else if(press<1008){s+=3;mx+=3}else{s+=2;mx+=3}
  if(cloud>70){s+=3;mx+=3}else if(cloud>40){s+=2;mx+=3}else{s+=1;mx+=3}
  if(wind>15){s+=1;mx+=3}else if(wind<8){s+=2;mx+=3}else{s+=3;mx+=3}
  if(rain>50){s+=1;mx+=3}else{s+=2;mx+=3}
  const pct=Math.round(s/mx*100);return{label:pct>=75?"Excellent":pct>=50?"Good":pct>=30?"Fair":"Poor",pct,clr:pct>=75?D.rust:pct>=50?D.gn:pct>=30?D.txM:D.txD};
}

function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);let oa=0;H.forEach(sp=>{if(md>=sp.s&&md<=sp.e)oa+=Math.max(0,1-((md-(sp.s+sp.e)/2)/((sp.e-sp.s)/2))**2)*(sp.t===1?3:sp.t===2?1.5:0.8)});return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),oa:+Math.min(10,oa).toFixed(1),cf:w<2?"High":w<4?"Med":"Low"}})}

/* ── APP ── */
export default function App(){
  const[riv,setRiv]=useState("test");const[beat,setBeat]=useState("Stockbridge");const[tab,setTab]=useState("guide");const[pick,setPick]=useState(false);const[hDay,setHDay]=useState(0);const[live,setLive]=useState({});const[loading,setLoading]=useState(true);const[dSrc,setDSrc]=useState("loading");const[light,setLight]=useState(false);const[scenario,setScenario]=useState(null);
  const P=light?L:D;const rv=RV.find(r=>r.id===riv);

  const doFetch=useCallback(async()=>{setLoading(true);try{const[ea,wx]=await Promise.all([fetchEA(rv.ea),fetchWx(rv.lat,rv.lng)]);setLive({ea,wx});setDSrc(ea?.level?"live":"sim")}catch{setDSrc("sim")}setLoading(false)},[rv]);
  useEffect(()=>{doFetch().catch(()=>{})},[doFetch]);useEffect(()=>{const i=setInterval(()=>doFetch().catch(()=>{}),9e5);return()=>clearInterval(i)},[doFetch]);useEffect(()=>{setBeat(rv.b[0]||"")},[riv]);

  const cT=live.ea?.temp||simT(rv.lat);const cL=live.ea?.level||0.45;
  const curWind=live.wx?.current?.wind_speed_10m?Math.round(live.wx.current.wind_speed_10m*0.621):8;
  const curPress=live.wx?.current?.pressure_msl?Math.round(live.wx.current.pressure_msl):1016;
  const curCloud=live.wx?.current?.cloud_cover??50;
  const curRain=live.wx?.hourly?.precipitation_probability?.[new Date().getHours()]||10;

  const spp=useMemo(()=>pred(cT),[cT]);const topH=spp[0];const dan=spp.find(s=>s.id==="danica");const actIds=spp.filter(s=>s.score>10).map(s=>s.id);
  const cond=condRating(curWind,curRain,curPress,curCloud);
  const rig=buildRig(cT,curWind,curCloud,cL);
  const ds=danSt(cT);const lr=useMemo(()=>genLR(cT),[cT]);

  const wxDays=useMemo(()=>{const wx=live.wx;if(!wx?.hourly||!wx?.daily)return[];try{return Array.from({length:Math.min(7,wx.daily.time?.length||0)},(_,d)=>{const dt=new Date(wx.daily.time[d]);const hrs=[];for(let hr=5;hr<=22;hr++){const idx=d*24+hr;if(idx>=(wx.hourly.time?.length||0))break;const air=wx.hourly.temperature_2m?.[idx]||15;const bA=((wx.daily.temperature_2m_max?.[d]||15)+(wx.daily.temperature_2m_min?.[d]||8))/2;const wt=+(cT+(air-bA)*0.15).toFixed(1);hrs.push({h:hr,wt,hi:+hInt(wt,hr).toFixed(1)})}
    return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH:wx.daily.temperature_2m_max?.[d]?Math.round(wx.daily.temperature_2m_max[d]):null,aL:wx.daily.temperature_2m_min?.[d]?Math.round(wx.daily.temperature_2m_min[d]):null,hrs}})}catch{return[]}},[live.wx,cT]);

  const Cd=({children:c,accent:a,style:s})=><div style={{background:a?P.rustS:P.c1,borderRadius:10,border:`1px solid ${a?P.rustB:P.bd}`,overflow:"hidden",...s}}>{c}</div>;
  const Lb=({children:c})=><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8,marginTop:4}}>{c}</div>;
  const tabs=[{id:"guide",l:"Guide"},{id:"diagnose",l:"Diagnose"},{id:"hatches",l:"Hatches"},{id:"hourly",l:"Hourly"},{id:"outlook",l:"Outlook"}];

  return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:P.bg,minHeight:"100vh",color:P.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:62}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}`}</style>

      {/* ══ HEADER ══ */}
      <div style={{background:P.c1,padding:"14px 14px 10px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><W s={22} c={P.tx} r/><span style={{fontSize:13,fontWeight:600,color:P.tx,letterSpacing:"0.2em"}}>EPHEMERA</span></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"3px 7px",color:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{light?"◐":"☀"}</button>
            <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:cond.clr,lineHeight:1}}>{cond.label}</div><div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em"}}>{cond.pct}% CONDITIONS</div></div>
          </div>
        </div>
        <button onClick={()=>setPick(!pick)} style={{width:"100%",background:P.c2,border:`1px solid ${P.bd}`,borderRadius:7,padding:"9px 12px",color:P.tx,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{rv.n} / {beat}</span><span style={{color:P.txD}}>{pick?"−":"+"}</span></button>
        {pick&&<div style={{marginTop:6,background:P.c2,borderRadius:7,padding:10,border:`1px solid ${P.bd}`,maxHeight:200,overflowY:"auto"}}>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>{RV.map(r=><button key={r.id} onClick={()=>setRiv(r.id)} style={{padding:"3px 8px",borderRadius:4,border:riv===r.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:riv===r.id?P.rustS:"transparent",color:riv===r.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r.n}</button>)}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>{setBeat(b);setPick(false)}} style={{padding:"2px 7px",borderRadius:4,border:beat===b?`1px solid ${P.tx}`:`1px solid ${P.bd}`,background:beat===b?P.c3:"transparent",color:beat===b?P.tx:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div>
        </div>}
      </div>

      {/* ══ STATS ══ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",borderBottom:`1px solid ${P.bd}`}}>
        {[{l:"WATER",v:`${cT}°`,c:cT>=12&&cT<=18?P.gn:P.txD},{l:"LEVEL",v:cL>0.6?"High":cL>0.45?"OK":"Low",c:cL>0.6?P.rust:P.gn},{l:"WIND",v:`${curWind}`,c:curWind>15?P.rust:P.txM},{l:"PRESS",v:`${curPress}`,c:P.txM},{l:"CLOUD",v:`${curCloud}%`,c:curCloud>60?P.gn:P.txD}].map((s,i)=>
          <div key={i} style={{padding:"9px 4px",textAlign:"center",borderRight:i<4?`1px solid ${P.bd}`:"",background:P.c1}}>
            <div style={{fontSize:6,letterSpacing:"0.15em",color:P.txD}}>{s.l}</div><div style={{fontSize:13,fontWeight:700,color:s.c,lineHeight:1,marginTop:2}}>{s.v}</div>
          </div>)}
      </div>

      {/* ══ TABS ══ */}
      <div style={{display:"flex",background:P.c1,borderBottom:`1px solid ${P.bd}`,overflowX:"auto"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 12px 8px",border:"none",borderBottom:tab===t.id?`2px solid ${P.rust}`:"2px solid transparent",background:"none",color:tab===t.id?P.rust:P.txD,fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginBottom:-1}}>{t.l}</button>)}
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{padding:14}}>

        {/* ── GUIDE (home) ── */}
        {tab==="guide"&&<div>
          {/* Rig recommendation */}
          <Cd accent style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.15em",color:P.rust}}>RECOMMENDED APPROACH</div><div style={{fontSize:18,fontWeight:700,color:P.tx,marginTop:4}}>{rig.method}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:24,fontWeight:700,color:P.rust,lineHeight:1}}>{rig.conf}%</div><div style={{fontSize:7,color:P.txD}}>CONF</div></div>
            </div>
            <div style={{fontSize:11,color:P.txM,lineHeight:1.6,marginBottom:10}}>{rig.why}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {[{l:"Rod",v:rig.rod},{l:"Leader",v:rig.leader},{l:"Tippet",v:rig.tippet},{l:"Depth",v:rig.depth}].map((r,i)=><div key={i} style={{padding:"6px 8px",background:P.c2,borderRadius:5}}><div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em"}}>{r.l.toUpperCase()}</div><div style={{fontSize:11,fontWeight:600,color:P.tx,marginTop:2}}>{r.v}</div></div>)}
            </div>
            <div style={{marginTop:8,padding:"8px 8px",background:P.c2,borderRadius:5}}><div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em"}}>FLY</div><div style={{fontSize:12,fontWeight:600,color:P.rust,marginTop:2}}>{rig.fly}</div></div>
          </Cd>

          {/* Hatch of the day */}
          {topH&&topH.score>5&&<Cd style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><Lb>HATCH OF THE DAY</Lb><div style={{fontSize:16,fontWeight:700,color:hC(topH.score)}}>{topH.cm}</div><div style={{fontSize:10,color:P.txD,marginTop:2}}>Hook {topH.hk} / {topH.sz}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:26,fontWeight:700,color:hC(topH.score),lineHeight:1}}>{topH.score}</div><div style={{fontSize:7,color:hC(topH.score)}}>{topH.lb}</div></div>
            </div>
            {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).length>0&&<div style={{marginTop:8,borderTop:`1px solid ${P.bd}`,paddingTop:6}}><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>ALSO ACTIVE</div>
              {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:P.txM}}>{s.cm}</span><span style={{fontSize:11,fontWeight:700,color:hC(s.score)}}>{s.score}%</span></div>)}</div>}
          </Cd>}

          {/* Mayfly tracker */}
          {dan&&<Cd style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><Lb>MAYFLY TRACKER</Lb><div style={{fontSize:14,fontWeight:700,color:ds.c}}>{ds.s}</div><div style={{fontSize:10,color:P.txD,marginTop:3}}>Avg start: May 18-22 / Peak: Jun 1-7</div></div>
              <div style={{fontSize:22,fontWeight:700,color:P.rust}}>{dan.score}%</div>
            </div>
          </Cd>}

          {/* Quick conditions intel */}
          <Lb>CONDITIONS INTEL</Lb>
          <Cd style={{padding:14}}>
            {[
              curCloud>70?"Overcast — excellent for hatches. Fish confident. Classic dry fly conditions.":curCloud>40?"Mixed cloud — hatches come in pulses. Be ready to switch.":"Bright — fish in shade, go fine, think evening.",
              curWind>15?`Wind ${curWind}mph — terrestrials blown onto the water. Fish the lee bank. Bigger flies.`:curWind<5?"Calm — flat water, fish see everything. Fine tippets, careful wading.":"Moderate breeze — helpful ripple. Good conditions.",
              curPress>1020?"High pressure — fish can be dour. Patience. Go finer.":curPress<1008?"Falling pressure — often triggers feeding. Be ready for a good hatch.":"Steady pressure — reliable conditions.",
            ].map((t,i)=><div key={i} style={{padding:"6px 0",borderBottom:i<2?`1px solid ${P.bd}`:"none",fontSize:11,color:P.txM,lineHeight:1.6}}>{t}</div>)}
          </Cd>
        </div>}

        {/* ── DIAGNOSE ── */}
        {tab==="diagnose"&&<div>
          <Lb>WHAT'S HAPPENING?</Lb>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
            {SCENARIOS.map(sc=><button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)} style={{padding:"14px 10px",borderRadius:8,border:scenario===sc.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:scenario===sc.id?P.rustS:P.c1,color:scenario===sc.id?P.rust:P.tx,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}><div style={{fontSize:16,marginBottom:4}}>{sc.icon}</div>{sc.label}</button>)}
          </div>
          {scenario&&<Cd style={{padding:0}}>
            {SCENARIOS.find(s=>s.id===scenario)?.advice.map((a,i)=><div key={i} style={{padding:"14px",borderBottom:`1px solid ${P.bd}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:700,color:P.tx,flex:1,paddingRight:10}}>{a.h}</div>
                <div style={{textAlign:"center",flexShrink:0}}><div style={{fontSize:18,fontWeight:700,color:a.conf>=80?P.rust:a.conf>=60?P.gn:P.txM,lineHeight:1}}>{a.conf}%</div><div style={{fontSize:7,color:P.txD}}>CONF</div></div>
              </div>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{a.d}</div>
            </div>)}
          </Cd>}
          {!scenario&&<div style={{textAlign:"center",padding:"30px 20px",color:P.txD,fontSize:12}}>Tap a situation above for specific tactical advice with confidence scores.</div>}
        </div>}

        {/* ── HATCHES ── */}
        {tab==="hatches"&&<div>
          <Cd>{spp.map(sp=><div key={sp.id} style={{padding:"9px 12px",borderBottom:`1px solid ${P.bd}`,background:sp.id==="danica"?P.rustS:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat]}}/><div style={{flex:1}}>
                <span style={{fontSize:12,fontWeight:700,color:sp.id==="danica"?P.rust:P.tx}}>{sp.cm}</span>
                <div style={{height:3,background:P.c2,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${sp.score}%`,background:hC(sp.score),borderRadius:2}}/></div>
                <div style={{fontSize:9,color:P.txD,marginTop:3}}>Hook {sp.hk} / {sp.sz} / {sp.tMn}-{sp.tMx}°C</div>
              </div>
              <div style={{textAlign:"right",minWidth:32}}><div style={{fontSize:16,fontWeight:700,color:hC(sp.score),lineHeight:1}}>{sp.score}</div><div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div></div>
            </div>
          </div>)}</Cd>
        </div>}

        {/* ── HOURLY ── */}
        {tab==="hourly"&&<div>
          {wxDays.length>0?<div>
            <div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto",paddingBottom:4}}>{wxDays.map((d,i)=><button key={i} onClick={()=>setHDay(i)} style={{padding:"5px 9px",borderRadius:5,border:hDay===i?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:hDay===i?P.rustS:P.c1,color:hDay===i?P.rust:P.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{d.dn}<br/><span style={{fontSize:8}}>{d.df}</span></button>)}</div>
            {wxDays[hDay]&&(()=>{const day=wxDays[hDay];const pk=day.hrs.reduce((a,b)=>(a.hi||0)>(b.hi||0)?a:b,day.hrs[0]);return<div>
              <Cd accent style={{padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.12em"}}>PEAK</div><div style={{fontSize:13,color:P.tx,marginTop:2}}>{pk.h}:00 / ~{pk.wt}°C</div></div><div style={{fontSize:24,fontWeight:700,color:P.rust}}>{Math.round(pk.hi||0)}</div></div>
              </Cd>
              <Cd style={{padding:12}}>
                <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{day.hrs.map(h=><div key={h.h} style={{textAlign:"center"}}><div style={{fontSize:6,color:P.txD,marginBottom:1}}>{h.h}</div><div style={{width:20,height:20,borderRadius:3,background:iC(h.hi||0),display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:(h.hi||0)>=2?P.bg:P.txD,fontWeight:(h.hi||0)>=4?700:400}}>{(h.hi||0)>=1?Math.round(h.hi):""}</div></div>)}</div>
              </Cd>
            </div>})()}
          </div>:<div style={{color:P.txM,fontSize:12}}>Hourly data loads on deployment.</div>}
        </div>}

        {/* ── OUTLOOK ── */}
        {tab==="outlook"&&<div>
          <Lb>8-WEEK FORECAST</Lb>
          <Cd>{lr.map((w,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{minWidth:68}}><div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div><div style={{fontSize:8,color:w.cf==="High"?P.gn:w.cf==="Med"?P.rust:P.txD,fontWeight:600}}>{w.cf}</div></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:28}}>Mayfly</span><div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:8,color:P.gn,fontWeight:600,minWidth:28}}>All</span><div style={{flex:1,height:3,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.oa*10}%`,background:P.gn,borderRadius:2}}/></div><span style={{fontSize:8,fontWeight:600,color:P.gn,minWidth:22,textAlign:"right"}}>{w.oa}</span></div>
            </div>
            <span style={{fontSize:9,color:P.txD}}>~{w.pt}°C</span>
          </div>)}</Cd>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>
            {[{l:"MAYFLY STATUS",v:ds.s},{l:"AVG START",v:"May 18-22"},{l:"PEAK",v:"Jun 1-7"},{l:"THIS YEAR",v:cT>13?"Warm spring":"On schedule"}].map((h,i)=><div key={i} style={{padding:10,background:P.c1,borderRadius:8,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,letterSpacing:"0.1em",color:P.txD}}>{h.l}</div><div style={{fontSize:12,fontWeight:700,color:P.rust,marginTop:3}}>{h.v}</div></div>)}
          </div>
        </div>}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{textAlign:"center",padding:"14px",borderTop:`1px solid ${P.bd}`}}>
        <W s={24} c={P.txD} r/><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginTop:4}}>EPHEMERA / Timely insight. Better days.</div>
        <div style={{fontSize:7,color:P.txD,marginTop:4}}>Forecasts indicative. Check conditions locally. EA / Open-Meteo.<br/>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>

      {/* ══ NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100}}>
        {[{id:"guide",l:"Guide",i:"◉"},{id:"diagnose",l:"Diagnose",i:"⊕"},{id:"hatches",l:"Hatches",i:"◎"},{id:"hourly",l:"Hourly",i:"◔"},{id:"outlook",l:"Outlook",i:"◑"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"9px 0 6px",border:"none",background:"none",color:tab===n.id?P.rust:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:14,lineHeight:1}}>{n.i}</div><div style={{fontSize:7,fontWeight:600,marginTop:2}}>{n.l}</div></button>)}
      </div>
    </div>
  );
}
