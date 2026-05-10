import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   E P H E M E R A — Timely Insight. Better Days.
   I'm going fishing today. Help me make the most of it.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── BRAND MARK (exact SVG from uploaded assets) ── */
const W=({s=32,c="#F3F0E8",r=false})=><svg width={s} height={s} viewBox="100 40 320 380" fill="none" strokeLinecap="round" strokeLinejoin="round"><g stroke={c}><path d="M176 306C205 197 286 103 382 62C360 158 297 250 176 306Z" strokeWidth="18"/><path d="M179 304C232 245 292 189 374 68" strokeWidth="10"/><path d="M221 269C252 261 287 246 323 221" strokeWidth="9"/><path d="M252 222C281 215 312 202 344 178" strokeWidth="9"/><path d="M118 334H394" strokeWidth="14"/><path d="M151 368H357" strokeWidth="10"/></g><path d="M198 398H310" stroke={r?"#C36A3D":c} strokeWidth="8" strokeLinecap="round"/></svg>;

/* ── PALETTE ── */
const D={bg:"#161E1B",c1:"#1B2421",c2:"#212C28",c3:"#283632",bd:"#2E3B36",tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",rust:"#C36A3D",gn:"#7A9E7E",bone:"#F3F0E8",rustS:"#C36A3D18",rustB:"#C36A3D40"};
const L={bg:"#F3F0E8",c1:"#FFFFFF",c2:"#EBE8E0",c3:"#E0DDD5",bd:"#D0CCC2",tx:"#1F2D2A",txM:"#5F6F7B",txD:"#8A948F",rust:"#C36A3D",gn:"#5A7A5E",bone:"#1F2D2A",rustS:"#C36A3D12",rustB:"#C36A3D30"};

/* ── CHALKSTREAM RIVERS (ALL) ── */
const RV=[
  {id:"test",n:"River Test",ea:"Test",lat:51.09,lng:-1.49,d:"The quintessential chalkstream. Prolific hatches, gin-clear water.",b:["Broadlands","Nursling","Timsbury","Mottisfont","Horsebridge","Park Stream","Stockbridge","Leckford","Longparish","Whitchurch","Laverstoke"]},
  {id:"itchen",n:"River Itchen",ea:"Itchen",lat:51.06,lng:-1.30,d:"Premier chalkstream. Technical, demanding, cathedral water.",b:["Itchen Abbas","Martyr Worthy","Easton","Abbotts Barton","Twyford","Shawford"]},
  {id:"kennet",n:"River Kennet",ea:"Kennet",lat:51.42,lng:-1.52,d:"Diverse chalkstream. Strong olives, excellent grayling.",b:["Marlborough","Ramsbury","Littlecote","Hungerford","Kintbury","Thatcham"]},
  {id:"lambourn",n:"River Lambourn",ea:"Lambourn",lat:51.50,lng:-1.53,d:"Berkshire gem. Beautiful wild trout water.",b:["Upper Lambourn","Great Shefford","Welford"]},
  {id:"anton",n:"River Anton",ea:"Anton",lat:51.19,lng:-1.50,d:"Intimate Test tributary. Reliable early hatches, smaller water.",b:["Goodworth Clatford","Upper Clatford","Anton Lakes"]},
  {id:"dever",n:"River Dever",ea:"Dever",lat:51.16,lng:-1.27,d:"Tiny Test tributary. Spring-fed, crystal clear.",b:["Micheldever","Bullington"]},
  {id:"bourne",n:"River Bourne",ea:"Bourne",lat:51.15,lng:-1.72,d:"Winterbourne chalkstream. Seasonal flow, wild trout.",b:["Porton","Idmiston"]},
  {id:"avon",n:"Hampshire Avon",ea:"Avon Hampshire",lat:51.17,lng:-1.78,d:"Broad, powerful chalkstream. Excellent mayfly water, big fish.",b:["Upavon","Figheldean","Netheravon","Amesbury","Salisbury"]},
  {id:"wylye",n:"River Wylye",ea:"Wylye",lat:51.17,lng:-2.06,d:"Beautiful, underrated. Superb evening rises.",b:["Warminster","Heytesbury","Codford","Wylye Village"]},
  {id:"nadder",n:"River Nadder",ea:"Nadder",lat:51.08,lng:-1.98,d:"Lovely Avon tributary. Small chalkstream character.",b:["Tisbury","Barford St Martin","Wilton"]},
  {id:"ebble",n:"River Ebble",ea:"Ebble",lat:51.03,lng:-1.92,d:"Tiny winterbourne. Intimate, wild.",b:["Broad Chalke","Bishopstone"]},
  {id:"meon",n:"River Meon",ea:"Meon",lat:50.94,lng:-1.14,d:"Hampshire chalk. Wild trout, intimate water.",b:["East Meon","West Meon","Droxford","Wickham"]},
  {id:"piddle",n:"River Piddle",ea:"Piddle",lat:50.73,lng:-2.21,d:"Dorset chalkstream. Pristine, rarely fished.",b:["Piddletrenthide","Puddletown"]},
  {id:"frome",n:"Frome (Dorset)",ea:"Frome",lat:50.71,lng:-2.44,d:"Dorset chalk. Lovely wild brown trout.",b:["Maiden Newton","Dorchester","Wareham"]},
  {id:"tarrant",n:"River Tarrant",ea:"Tarrant",lat:50.85,lng:-2.08,d:"Tiny Dorset winterbourne. Very intimate.",b:["Tarrant Monkton"]},
  {id:"allen",n:"River Allen",ea:"Allen",lat:50.85,lng:-1.98,d:"Small Avon tributary. Chalk character.",b:["Wimborne St Giles"]},
  {id:"mimram",n:"River Mimram",ea:"Mimram",lat:51.80,lng:-0.22,d:"Hertfordshire chalkstream. Rare, close to London.",b:["Welwyn","Tewin"]},
  {id:"beane",n:"River Beane",ea:"Beane",lat:51.82,lng:-0.08,d:"Herts chalk. Small but characterful.",b:["Watton-at-Stone"]},
  {id:"rib",n:"River Rib",ea:"Rib",lat:51.83,lng:-0.01,d:"Hertfordshire chalkstream.",b:["Braughing","Standon"]},
  {id:"ver",n:"River Ver",ea:"Ver",lat:51.72,lng:-0.34,d:"St Albans chalkstream. Urban but genuine chalk.",b:["Redbourn","St Albans"]},
  {id:"gade",n:"River Gade",ea:"Gade",lat:51.73,lng:-0.49,d:"Chilterns chalk. Small but improving.",b:["Great Gaddesden","Hemel Hempstead"]},
  {id:"chess",n:"River Chess",ea:"Chess",lat:51.65,lng:-0.60,d:"Chilterns chalkstream. Wild trout, close to London.",b:["Chesham","Latimer","Rickmansworth"]},
  {id:"misbourne",n:"River Misbourne",ea:"Misbourne",lat:51.63,lng:-0.65,d:"Chilterns chalk. Intermittent but genuine.",b:["Great Missenden","Amersham"]},
  {id:"colne",n:"River Colne",ea:"Colne",lat:51.60,lng:-0.50,d:"Chalk-fed. Some excellent trout water.",b:["Watford","Denham"]},
  {id:"darent",n:"River Darent",ea:"Darent",lat:51.37,lng:0.18,d:"Kent chalkstream. Southernmost chalk, urban trout.",b:["Shoreham","Eynsford","Lullingstone"]},
  {id:"wandle",n:"River Wandle",ea:"Wandle",lat:51.42,lng:-0.17,d:"South London chalk. Remarkably restored urban fishery.",b:["Carshalton","Morden","Wandsworth"]},
];

/* ── HATCHES ── */
const H=[
  {id:"danica",cm:"Mayfly (Green Drake)",nm:"Ephemera danica",cat:"m",t:1,s:135,e:172,tMn:12,tMx:18,pk:[12,13,14,15,16],hk:"10-12 LD",sz:"20-25mm",avgS:139,avgP:153,nt:"THE event. Fish lose all caution. Spinner falls can be extraordinary."},
  {id:"vulgata",cm:"Dark Mackerel Mayfly",nm:"Ephemera vulgata",cat:"m",t:2,s:140,e:178,tMn:13,tMx:17,pk:[13,14,15,16],hk:"10-12",sz:"18-22mm",nt:"Overlaps danica. Darker body."},
  {id:"ldo",cm:"Large Dark Olive",nm:"Baetis rhodani",cat:"o",t:2,s:60,e:150,tMn:7,tMx:14,pk:[10,11,12,13],hk:"14-16",sz:"10-12mm",nt:"Spring staple. Overcast drizzly days produce the best hatches."},
  {id:"mo",cm:"Medium Olive",nm:"Baetis vernus",cat:"o",t:3,s:100,e:180,tMn:10,tMx:16,pk:[11,12,13,14],hk:"16",sz:"8-10mm",nt:"Consistent performer right through the season."},
  {id:"bwo",cm:"Blue-winged Olive",nm:"Serratella ignita",cat:"o",t:2,s:150,e:290,tMn:12,tMx:18,pk:[17,18,19,20],hk:"14-16",sz:"9-11mm",nt:"The great evening fly. Sherry spinner falls are legendary."},
  {id:"ib",cm:"Iron Blue",nm:"Baetis niger",cat:"o",t:2,s:105,e:165,tMn:8,tMx:14,pk:[11,12,13,14],hk:"16-18",sz:"6-8mm",nt:"Loves foul weather. Cold blustery days bring the best hatches."},
  {id:"pw",cm:"Pale Watery",nm:"Baetis fuscatus",cat:"o",t:3,s:125,e:260,tMn:12,tMx:18,pk:[14,15,16,17,18],hk:"16-18",sz:"6-8mm",nt:"Afternoon and evening. Selective fish key on these."},
  {id:"ss",cm:"Small Spurwing",nm:"Centroptilum luteolum",cat:"o",t:3,s:135,e:270,tMn:13,tMx:18,pk:[15,16,17,18],hk:"18-20",sz:"5-7mm",nt:"Tiny but plentiful. Often mixed with pale wateries."},
  {id:"ymd",cm:"Yellow May Dun",nm:"Heptagenia sulphurea",cat:"o",t:3,s:135,e:180,tMn:12,tMx:17,pk:[18,19,20],hk:"14",sz:"12-14mm",nt:"Beautiful pale yellow. Evening emerger."},
  {id:"caen",cm:"Angler's Curse",nm:"Caenis spp.",cat:"o",t:3,s:155,e:250,tMn:15,tMx:20,pk:[5,6,7,19,20,21],hk:"20-22",sz:"3-5mm",nt:"Dawn and dusk. Incredibly small, incredibly frustrating."},
  {id:"gran",cm:"Grannom",nm:"Brachycentrus subnubilus",cat:"c",t:2,s:100,e:130,tMn:9,tMx:14,pk:[11,12,13,14,15],hk:"14-16",sz:"10-12mm",nt:"Mass April hatches. Fish become preoccupied."},
  {id:"sedge",cm:"Sedges",nm:"Trichoptera spp.",cat:"c",t:2,s:135,e:275,tMn:13,tMx:20,pk:[19,20,21],hk:"12-16",sz:"8-18mm",nt:"Evening. Skittering across the surface. Exciting takes."},
  {id:"haw",cm:"Hawthorn Fly",nm:"Bibio marci",cat:"t",t:2,s:108,e:135,tMn:10,tMx:16,pk:[11,12,13,14,15,16],hk:"12-14",sz:"12-14mm",nt:"St Mark's Day. Blown onto the water on breezy days."},
  {id:"bg",cm:"Black Gnat",nm:"Bibio johannis",cat:"t",t:3,s:120,e:250,tMn:12,tMx:20,pk:[12,13,14,15,16,17],hk:"16-18",sz:"5-8mm",nt:"All summer swarms. Small but taken readily."},
  {id:"smut",cm:"Reed Smuts",nm:"Simulium spp.",cat:"t",t:3,s:135,e:270,tMn:13,tMx:20,pk:[10,11,12,13,14,15,16,17],hk:"20-24",sz:"2-4mm",nt:"Fish sip from the film. Maddening but rewarding."},
  {id:"mb",cm:"March Brown",nm:"Rhithrogena germanica",cat:"o",t:3,s:70,e:110,tMn:7,tMx:12,pk:[11,12,13],hk:"12-14",sz:"12-14mm",nt:"Early season. More common on faster water."},
];
const CC={m:"#C36A3D",o:"#7A9E7E",c:"#8B7355",t:"#5F6F7B"};
const CL={m:"MAYFLY",o:"UPWINGED",c:"CADDIS",t:"TERRESTRIAL"};

/* ── FLY BOX ── */
const FL={
  dry:[{nm:"Grey Wulff",sz:"10-14",mt:["danica","vulgata"],ef:5,nt:"Classic mayfly. Robust, visible, floats forever."},{nm:"Spent Gnat",sz:"10-12",mt:["danica","vulgata"],ef:5,nt:"Spinner fall essential. Flat on the surface."},{nm:"Kite's Imperial",sz:"14-16",mt:["ldo","mo"],ef:5,nt:"THE olive pattern on chalkstreams."},{nm:"Sherry Spinner",sz:"14-16",mt:["bwo"],ef:5,nt:"BWO spinner. Evening essential."},{nm:"Iron Blue Dun",sz:"16-18",mt:["ib"],ef:4,nt:"Small, dark. Foul weather days."},{nm:"Adams",sz:"14-18",mt:["ldo","mo","bwo"],ef:4,nt:"Searching pattern."},{nm:"Last Hope",sz:"16-20",mt:["pw","ss","caen"],ef:4,nt:"Ultra-selective fish on pale wateries."},{nm:"Elk Hair Caddis",sz:"12-16",mt:["sedge"],ef:4,nt:"Static or skated. Evening."},{nm:"G&H Sedge",sz:"10-14",mt:["sedge"],ef:4,nt:"Deer hair. Skate it."},{nm:"Hawthorn Fly",sz:"12-14",mt:["haw"],ef:3,nt:"Trailing legs. Breezy days."},{nm:"Griffith's Gnat",sz:"18-24",mt:["smut","caen"],ef:3,nt:"Tiny. For smuts and caenis."}],
  emerger:[{nm:"Klinkhamer Special",sz:"12-18",mt:["ldo","mo","bwo","danica"],ef:5,nt:"Most versatile fly on chalkstreams."},{nm:"Danica Emerger",sz:"10-12 LD",mt:["danica","vulgata"],ef:5,nt:"THE mayfly fly. Fish in the film."},{nm:"CDC Shuttlecock",sz:"14-20",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Sparse CDC. Devastating."},{nm:"Suspender Buzzer",sz:"14-18",mt:["ldo","mo"],ef:4,nt:"In the film. Patience rewarded."},{nm:"F Fly",sz:"16-20",mt:["pw","ss","smut","caen"],ef:4,nt:"Two CDC feathers. Simple, deadly."},{nm:"Grannom Pupa",sz:"14-16",mt:["gran"],ef:3,nt:"Green body. Subsurface during falls."}],
  nymph:[{nm:"Pheasant Tail Nymph",sz:"14-18",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Desert island nymph. Dead drift or induced take."},{nm:"Gold-Ribbed Hare's Ear",sz:"14-16",mt:["ldo","mo","bwo"],ef:5,nt:"Buggy. Works when nothing else does."},{nm:"Sawyer's Killer Bug",sz:"14-16",mt:["ldo","mo","pw"],ef:4,nt:"Cold water killer. Simple."},{nm:"Danica Nymph",sz:"10-12 LD",mt:["danica","vulgata"],ef:4,nt:"Pre-hatch essential. Deep gravel runs."},{nm:"Czech Nymph",sz:"12-16",mt:["ldo","mo","gran"],ef:3,nt:"Check beat rules first. Some waters restrict."}],
};

/* ── WEATHER INTELLIGENCE ── */
function getConditionTips(airT,wind,rain,pressure,cloud){
  const tips=[];const rating={score:0,max:0};
  // Pressure
  if(pressure>1020){tips.push({t:"High pressure",tip:"Fish can be dour. Longer leaders, finer tippets. Stealth essential.",cat:"caution"});rating.score+=1;rating.max+=3}
  else if(pressure<1008){tips.push({t:"Low pressure",tip:"Often triggers hatches. Fish sense the change and feed hard before the front.",cat:"good"});rating.score+=3;rating.max+=3}
  else{tips.push({t:"Moderate pressure",tip:"Steady conditions. Good baseline for surface activity.",cat:"good"});rating.score+=2;rating.max+=3}
  // Cloud
  if(cloud>70){tips.push({t:"Overcast",tip:"Excellent for hatches. Fish feel safer. Olives and iron blues love cloud cover. Best conditions for dry fly.",cat:"great"});rating.score+=3;rating.max+=3}
  else if(cloud>40){tips.push({t:"Partly cloudy",tip:"Good mix of light. Fish will rise. Hatches often come in pulses as cloud moves through.",cat:"good"});rating.score+=2;rating.max+=3}
  else{tips.push({t:"Bright sunshine",tip:"Fish in shade and broken water. Approach from behind, longer leaders. Early morning and evening best. Use finer tippets.",cat:"caution"});rating.score+=1;rating.max+=3}
  // Wind
  if(wind>15){tips.push({t:"Strong wind",tip:"Harder to cast but terrestrials get blown onto the water. Fish the sheltered bank. Hawthorn, black gnat, beetles. Bigger flies.",cat:"mixed"});rating.score+=1;rating.max+=3}
  else if(wind>8){tips.push({t:"Moderate breeze",tip:"Helpful ripple breaks the surface. Fish less wary. Good casting conditions with a bit of thought.",cat:"good"});rating.score+=2;rating.max+=3}
  else if(wind<4){tips.push({t:"Dead calm",tip:"Flat water. Fish see everything. Fine tippets, delicate presentation. Can be incredible during spinner falls.",cat:"mixed"});rating.score+=2;rating.max+=3}
  else{tips.push({t:"Light breeze",tip:"Perfect casting conditions. Slight surface movement helps your approach.",cat:"great"});rating.score+=3;rating.max+=3}
  // Rain
  if(rain>60){tips.push({t:"Rain likely",tip:"Light rain can trigger excellent hatches, especially olives and iron blues. Heavy rain may colour the water. Nymphs effective if it does.",cat:"mixed"});rating.score+=2;rating.max+=3}
  else if(rain>20){tips.push({t:"Chance of showers",tip:"Showers often bring a burst of insect activity. Be ready to switch to dry fly when it passes.",cat:"good"});rating.score+=2;rating.max+=3}
  else{tips.push({t:"Dry",tip:"Stable. Plan around the hatch cycle.",cat:"good"});rating.score+=2;rating.max+=3}
  // Overall
  const pct=Math.round(rating.score/rating.max*100);
  const label=pct>=75?"Excellent":pct>=50?"Good":pct>=30?"Fair":"Poor";
  const clr=pct>=75?"#C36A3D":pct>=50?"#7A9E7E":pct>=30?"#8A948F":"#5F6F7B";
  return{tips,label,pct,clr};
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
function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);let oa=0;H.forEach(sp=>{if(md>=sp.s&&md<=sp.e)oa+=Math.max(0,1-((md-(sp.s+sp.e)/2)/((sp.e-sp.s)/2))**2)*(sp.t===1?3:sp.t===2?1.5:0.8)});return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),oa:+Math.min(10,oa).toFixed(1),cf:w<2?"High":w<4?"Med":"Low"}})}
const hC=s=>s>70?D.rust:s>40?D.gn:s>15?D.txM:D.txD;
const iC=v=>v>=6?D.rust:v>=4?"#A85C2E":v>=2?D.gn:v>=1?"#3E5A40":"#1E2E26";
function danicaSt(wt){const as=139;if(DOY>172)return{s:"Season ended",c:D.txD};if(DOY>as+14&&wt>=12)return{s:"On the water",c:D.rust};if(DOY>as&&wt>=12)return{s:"Underway",c:D.rust};if(DOY>as-7&&wt>=11)return{s:"On time",c:D.gn};if(DOY>as-7)return{s:"Tracking late",c:D.txD};if(DOY>as-14&&wt>=13)return{s:"Tracking early",c:D.rust};if(DOY>as-14)return{s:"Days away",c:D.txM};if(DOY>as-28)return{s:"2-4 weeks",c:D.txM};return{s:"Not yet",c:D.txD}}

/* ── REPORTS (simulated live) ── */
const RPT={test:[{d:"Today 14:20",bt:"Stockbridge",au:"River Keeper",src:"Keeper",tx:"Sustained danica from 12:30. Fish up everywhere. Spinners falling by 4:30pm. Best day yet.",v:true},{d:"Today 11:45",bt:"Park Stream",au:"Guide",src:"Guide",tx:"First danica midday. Two good fish on emergers. Water 13.8C. Park Stream fishes ahead of the main river.",v:true},{d:"Yesterday",bt:"Mottisfont",au:"@chalkstream_life",src:"Social",tx:"First danica spotted. Shucks on the ranunculus. One fish to a Grey Wulff.",v:false},{d:"Yesterday",bt:"Leckford",au:"Estate Keeper",src:"Keeper",tx:"Strong olives all morning. Hawthorn still about. Ranunculus thriving.",v:true},{d:"2 days ago",bt:"Stockbridge",au:"Test Valley FC",src:"Club",tx:"Iron blues and olives. Early danica seen but no sustained hatch yet.",v:true}],itchen:[{d:"Today",bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Steady olives. Handful of early danica.",v:true}],kennet:[{d:"Today",bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Olive hatch through midday. Grayling on nymphs.",v:false}]};

/* ── APP ── */
export default function App(){
  const[riv,setRiv]=useState("test");const[beat,setBeat]=useState("Stockbridge");const[tab,setTab]=useState("today");const[pick,setPick]=useState(false);const[flyT,setFlyT]=useState("dry");const[hDay,setHDay]=useState(0);const[live,setLive]=useState({});const[loading,setLoading]=useState(true);const[dSrc,setDSrc]=useState("loading");const[light,setLight]=useState(false);
  const P=light?L:D;

  const rv=RV.find(r=>r.id===riv);
  const doFetch=useCallback(async()=>{setLoading(true);try{const[ea,wx]=await Promise.all([fetchEA(rv.ea),fetchWx(rv.lat,rv.lng)]);setLive({ea,wx});setDSrc(ea?.level?"live":"sim")}catch{setDSrc("sim")}setLoading(false)},[rv]);
  useEffect(()=>{doFetch().catch(()=>{})},[doFetch]);useEffect(()=>{const i=setInterval(()=>doFetch().catch(()=>{}),9e5);return()=>clearInterval(i)},[doFetch]);useEffect(()=>{setBeat(rv.b[0]||"")},[riv]);

  const cT=live.ea?.temp||simT(rv.lat);const cL=live.ea?.level||0.45;
  const curWind=live.wx?.current?.wind_speed_10m?Math.round(live.wx.current.wind_speed_10m*0.621):8;
  const curPress=live.wx?.current?.pressure_msl?Math.round(live.wx.current.pressure_msl):1016;
  const curCloud=live.wx?.current?.cloud_cover||50;
  const curRain=live.wx?.hourly?.precipitation_probability?.[new Date().getHours()]||10;

  const spp=useMemo(()=>pred(cT),[cT]);const dan=spp.find(s=>s.id==="danica");const topH=spp[0];const actIds=spp.filter(s=>s.score>10).map(s=>s.id);
  const hIdx=Math.round(spp.reduce((s,h)=>s+h.score*(h.t===1?3:h.t===2?1.5:0.8),0)/spp.reduce((s,h)=>s+100*(h.t===1?3:h.t===2?1.5:0.8),0)*100);
  const lv=cL>0.6?{t:"HIGH",c:P.rust}:cL>0.45?{t:"NORMAL",c:P.gn}:{t:"LOW",c:P.txD};
  const danSt=danicaSt(cT);
  const cond=getConditionTips(cT,curWind,curRain,curPress,curCloud);
  const lr=useMemo(()=>genLR(cT),[cT]);

  // Top 3 flies for hatch of the day
  const topFlies=useMemo(()=>{if(!topH)return[];return FL.dry.filter(f=>f.mt.some(m=>m===topH.id)).slice(0,3)},[topH]);

  // Weather hourly
  const wxDays=useMemo(()=>{const wx=live.wx;if(!wx?.hourly||!wx?.daily)return[];try{return Array.from({length:Math.min(7,wx.daily.time?.length||0)},(_,d)=>{const dt=new Date(wx.daily.time[d]);const hrs=[];for(let hr=5;hr<=22;hr++){const idx=d*24+hr;if(idx>=(wx.hourly.time?.length||0))break;const air=wx.hourly.temperature_2m?.[idx]||15;const bA=((wx.daily.temperature_2m_max?.[d]||15)+(wx.daily.temperature_2m_min?.[d]||8))/2;const wt=+(cT+(air-bA)*0.15).toFixed(1);hrs.push({h:hr,wt,hi:+hInt(wt,hr).toFixed(1),rain:wx.hourly.precipitation_probability?.[idx]||0,pr:wx.hourly.pressure_msl?.[idx]?Math.round(wx.hourly.pressure_msl[idx]):null,ws:wx.hourly.wind_speed_10m?.[idx]?Math.round(wx.hourly.wind_speed_10m[idx]*0.621):null,cl:wx.hourly.cloud_cover?.[idx]||50})}
    return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH:wx.daily.temperature_2m_max?.[d]?Math.round(wx.daily.temperature_2m_max[d]):null,aL:wx.daily.temperature_2m_min?.[d]?Math.round(wx.daily.temperature_2m_min[d]):null,hrs}})}catch{return[]}},[live.wx,cT]);

  const Cd=({children:c,accent:a,style:s})=><div style={{background:a?P.rustS:P.c1,borderRadius:10,border:`1px solid ${a?P.rustB:P.bd}`,overflow:"hidden",...s}}>{c}</div>;
  const Lb=({children:c})=><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8}}>{c}</div>;
  const tabs=[{id:"today",l:"Today"},{id:"hourly",l:"Hourly"},{id:"hatches",l:"Hatches"},{id:"fly",l:"Fly Box"},{id:"outlook",l:"Outlook"},{id:"reports",l:"Reports"}];

  return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:P.bg,minHeight:"100vh",color:P.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:66}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}`}</style>

      {/* ══ HEADER ══ */}
      <div style={{background:P.c1,padding:"16px 16px 12px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><W s={24} c={P.tx} r/><span style={{fontSize:14,fontWeight:600,color:P.tx,letterSpacing:"0.22em"}}>EPHEMERA</span></div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:6,padding:"4px 8px",color:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{light?"DARK":"LIGHT"}</button>
            <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:700,color:P.rust,lineHeight:1}}>{hIdx}</div><div style={{fontSize:7,color:P.txD,letterSpacing:"0.15em"}}>HATCH</div></div>
          </div>
        </div>
        {/* River selector */}
        <button onClick={()=>setPick(!pick)} style={{width:"100%",background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"10px 14px",color:P.tx,fontSize:12,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{rv.n} / {beat}</span><span style={{color:P.txD}}>{pick?"−":"+"}</span></button>
        {pick&&<div style={{marginTop:8,background:P.c2,borderRadius:8,padding:10,border:`1px solid ${P.bd}`,maxHeight:220,overflowY:"auto"}}>
          <Lb>RIVER</Lb>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>{RV.map(r=><button key={r.id} onClick={()=>setRiv(r.id)} style={{padding:"4px 8px",borderRadius:5,border:riv===r.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:riv===r.id?P.rustS:"transparent",color:riv===r.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r.n}</button>)}</div>
          <Lb>BEAT</Lb>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>{setBeat(b);setPick(false)}} style={{padding:"3px 7px",borderRadius:4,border:beat===b?`1px solid ${P.tx}`:`1px solid ${P.bd}`,background:beat===b?P.c3:"transparent",color:beat===b?P.tx:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div>
        </div>}
      </div>

      {/* ══ STATS ══ */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",borderBottom:`1px solid ${P.bd}`}}>
        {[{l:"WATER",v:`${cT}°`,c:cT>=12&&cT<=18?P.gn:P.txD},{l:"LEVEL",v:lv.t,c:lv.c},{l:"WIND",v:`${curWind}mph`,c:curWind>15?P.rust:P.txM},{l:"CONDITIONS",v:cond.label,c:cond.clr}].map((s,i)=>
          <div key={i} style={{padding:"10px 6px",textAlign:"center",borderRight:i<3?`1px solid ${P.bd}`:"",background:P.c1}}>
            <div style={{fontSize:6,letterSpacing:"0.18em",color:P.txD}}>{s.l}</div><div style={{fontSize:14,fontWeight:700,color:s.c,lineHeight:1,marginTop:3}}>{s.v}</div>
          </div>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 16px",background:P.c1,borderBottom:`1px solid ${P.bd}`}}>
        <div style={{width:5,height:5,borderRadius:3,background:dSrc==="live"?P.gn:P.rust}}/><span style={{fontSize:8,color:P.txD}}>{loading?"...":dSrc==="live"?"LIVE DATA":"SIMULATED"}</span>
        <span style={{fontSize:8,color:P.txD,marginLeft:"auto"}}>{curPress}mb / {curCloud}% cloud</span>
      </div>

      {/* ══ TABS ══ */}
      <div style={{display:"flex",background:P.c1,borderBottom:`1px solid ${P.bd}`,overflowX:"auto"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 11px 8px",border:"none",borderBottom:tab===t.id?`2px solid ${P.rust}`:"2px solid transparent",background:"none",color:tab===t.id?P.rust:P.txD,fontWeight:600,fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginBottom:-1}}>{t.l}</button>)}
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{padding:14}}>

        {/* ── TODAY ── */}
        {tab==="today"&&<div>
          {/* Conditions rating */}
          <Cd accent style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.15em",color:P.rust}}>TODAY'S CONDITIONS</div><div style={{fontSize:20,fontWeight:700,color:cond.clr,marginTop:4}}>{cond.label}</div></div>
              <div style={{fontSize:36,fontWeight:700,color:cond.clr,lineHeight:1}}>{cond.pct}%</div>
            </div>
            {cond.tips.map((t,i)=><div key={i} style={{padding:"6px 0",borderTop:`1px solid ${P.bd}`,fontSize:11,lineHeight:1.6}}><span style={{fontWeight:700,color:t.cat==="great"?P.gn:t.cat==="good"?P.txM:t.cat==="caution"?P.rust:P.txD}}>{t.t}</span><span style={{color:P.txM,marginLeft:6}}>{t.tip}</span></div>)}
          </Cd>

          {/* Hatch of the day */}
          {topH&&topH.score>5&&<Cd style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><Lb>HATCH OF THE DAY</Lb><div style={{fontSize:16,fontWeight:700,color:hC(topH.score)}}>{topH.cm}</div><div style={{fontSize:10,color:P.txD,marginTop:2,fontStyle:"italic"}}>{topH.nm}</div><div style={{fontSize:11,color:P.txM,marginTop:4,lineHeight:1.5}}>{topH.nt}</div></div>
              <div style={{textAlign:"center",minWidth:44}}><div style={{fontSize:28,fontWeight:700,color:hC(topH.score),lineHeight:1}}>{topH.score}</div><div style={{fontSize:7,color:hC(topH.score),marginTop:2}}>{topH.lb}</div></div>
            </div>
            {topFlies.length>0&&<div style={{marginTop:10,borderTop:`1px solid ${P.bd}`,paddingTop:8}}>
              <div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em",marginBottom:6}}>TOP FLIES FOR THIS HATCH</div>
              {topFlies.map(f=><div key={f.nm} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:`1px solid ${P.bd}`}}><span style={{fontSize:12,fontWeight:600}}>{f.nm}</span><span style={{fontSize:10,color:P.txD}}>#{f.sz}</span></div>)}
            </div>}
          </Cd>}

          {/* Mayfly tracker */}
          {dan&&<Cd style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><Lb>MAYFLY TRACKER</Lb><div style={{fontSize:14,fontWeight:700,color:danSt.c}}>{danSt.s}</div><div style={{fontSize:10,color:P.txD,marginTop:4}}>Avg start: May 18-22 / Peak: Jun 1-7 / Duration: 3-4 weeks</div>
                {dan.score>0&&<div style={{height:4,background:P.c2,borderRadius:2,marginTop:8,overflow:"hidden"}}><div style={{height:"100%",width:`${dan.score}%`,background:P.rust,borderRadius:2}}/></div>}
              </div>
              <div style={{fontSize:24,fontWeight:700,color:P.rust,minWidth:40,textAlign:"right"}}>{dan.score}%</div>
            </div>
          </Cd>}

          {/* Quick species list */}
          <Lb>ALL ACTIVITY</Lb>
          <Cd>{spp.filter(s=>s.score>5).map(sp=><div key={sp.id} style={{padding:"8px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat]}}/><span style={{flex:1,fontSize:12,fontWeight:600,color:P.tx}}>{sp.cm}</span>
            <div style={{width:50,height:3,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${sp.score}%`,background:hC(sp.score),borderRadius:2}}/></div>
            <span style={{fontSize:13,fontWeight:700,color:hC(sp.score),minWidth:24,textAlign:"right"}}>{sp.score}</span>
          </div>)}</Cd>
        </div>}

        {/* ── HOURLY ── */}
        {tab==="hourly"&&<div>
          {wxDays.length>0?<div>
            <div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto",paddingBottom:4}}>{wxDays.map((d,i)=><button key={i} onClick={()=>setHDay(i)} style={{padding:"5px 9px",borderRadius:6,border:hDay===i?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:hDay===i?P.rustS:P.c1,color:hDay===i?P.rust:P.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}><div>{d.dn}</div><div style={{fontSize:8,marginTop:1}}>{d.df}</div></button>)}</div>
            {wxDays[hDay]&&(()=>{const day=wxDays[hDay];const pk=day.hrs.reduce((a,b)=>(a.hi||0)>(b.hi||0)?a:b,day.hrs[0]);return<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>{[{l:"AIR",v:`${day.aH||"--"}°/${day.aL||"--"}°`},{l:"PEAK",v:`${pk.h}:00`},{l:"INTENSITY",v:(pk.hi||0).toFixed(1)},{l:"WATER",v:`~${pk.wt}°C`}].map((s,i)=><div key={i} style={{background:P.c1,borderRadius:6,border:`1px solid ${P.bd}`,padding:"7px 4px",textAlign:"center"}}><div style={{fontSize:6,letterSpacing:"0.1em",color:P.txD}}>{s.l}</div><div style={{fontSize:12,fontWeight:600,color:P.tx,marginTop:2}}>{s.v}</div></div>)}</div>
              <Cd style={{padding:12}}><Lb>HATCH INTENSITY</Lb>
                <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{day.hrs.map(h=><div key={h.h} style={{textAlign:"center"}}><div style={{fontSize:7,color:P.txD,marginBottom:2}}>{h.h}</div><div style={{width:20,height:20,borderRadius:3,background:iC(h.hi||0),display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:(h.hi||0)>=2?P.bg:P.txD,fontWeight:(h.hi||0)>=4?700:400}}>{(h.hi||0)>=1?Math.round(h.hi):""}</div></div>)}</div>
              </Cd>
            </div>})()}
          </div>:<div style={{color:P.txM,fontSize:12}}>Hourly data loads on deployment.</div>}
        </div>}

        {/* ── HATCHES ── */}
        {tab==="hatches"&&<div>
          <Cd>{spp.map(sp=>{const isM=sp.id==="danica";return<div key={sp.id} style={{padding:isM?"14px 12px":"9px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontSize:8,fontWeight:700,color:CC[sp.cat],minWidth:10}}>{CL[sp.cat]?.charAt(0)}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{fontWeight:700,color:isM?P.rust:P.tx,fontSize:isM?14:12}}>{sp.cm}</span><span style={{fontSize:9,color:P.txD,fontStyle:"italic"}}>{sp.nm}</span></div>
                <div style={{height:isM?4:3,background:P.c2,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${sp.score}%`,background:hC(sp.score),borderRadius:2}}/></div>
                <div style={{fontSize:10,color:P.txD,marginTop:3}}>{sp.sz} / Hook {sp.hk} / {sp.tMn}-{sp.tMx}°C — {sp.nt}</div>
              </div>
              <div style={{textAlign:"right",minWidth:32}}><div style={{fontSize:isM?20:15,fontWeight:700,color:hC(sp.score),lineHeight:1}}>{sp.score}</div><div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div></div>
            </div>
          </div>})}</Cd>
        </div>}

        {/* ── FLY BOX ── */}
        {tab==="fly"&&<div>
          <div style={{background:P.rust+"15",border:`1px solid ${P.rust}33`,borderRadius:8,padding:"8px 10px",marginBottom:10}}><div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em"}}>CHECK BEAT REGULATIONS</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>Rules vary. Always confirm with the beat keeper.</div></div>
          <div style={{display:"flex",gap:4,marginBottom:10}}>{[{id:"dry",l:"Dries"},{id:"emerger",l:"Emergers"},{id:"nymph",l:"Nymphs"}].map(t=><button key={t.id} onClick={()=>setFlyT(t.id)} style={{flex:1,padding:"9px",borderRadius:8,border:flyT===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyT===t.id?P.rustS:"transparent",color:flyT===t.id?P.rust:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>
          <Cd>{FL[flyT].map((f,i)=>{const isM=f.mt.some(m=>actIds.includes(m));return<div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:700,color:isM?P.rust:P.tx}}>{f.nm}</span>{isM&&<span style={{fontSize:7,fontWeight:700,color:P.rust,marginLeft:6,background:P.rustB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}<div style={{fontSize:10,color:P.txD,marginTop:2}}>#{f.sz} — {f.nt}</div></div><div style={{display:"flex",gap:2}}>{Array.from({length:f.ef},(_,j)=><div key={j} style={{width:4,height:4,borderRadius:2,background:isM?P.rust:P.txD}}/>)}</div></div>
          </div>})}</Cd>
        </div>}

        {/* ── OUTLOOK ── */}
        {tab==="outlook"&&<div>
          <Lb>8-WEEK FORECAST</Lb>
          <Cd>{lr.map((w,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{minWidth:70}}><div style={{fontSize:11,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div><div style={{fontSize:8,color:w.cf==="High"?P.gn:w.cf==="Med"?P.rust:P.txD,fontWeight:600}}>{w.cf}</div></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:30}}>Danica</span><div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div><span style={{fontSize:10,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:8,color:P.gn,fontWeight:600,minWidth:30}}>All</span><div style={{flex:1,height:3,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.oa*10}%`,background:P.gn,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:600,color:P.gn,minWidth:22,textAlign:"right"}}>{w.oa}</span></div>
            </div>
            <span style={{fontSize:9,color:P.txD,minWidth:30,textAlign:"right"}}>~{w.pt}°C</span>
          </div>)}</Cd>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>
            {[{l:"MAYFLY STATUS",v:danSt.s},{l:"AVG START",v:"May 18-22"},{l:"PEAK WEEK",v:"Jun 1-7"},{l:"THIS YEAR",v:cT>13?"Warm spring":"On schedule"}].map((h,i)=><div key={i} style={{padding:10,background:P.c1,borderRadius:8,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,letterSpacing:"0.1em",color:P.txD}}>{h.l}</div><div style={{fontSize:13,fontWeight:700,color:P.rust,marginTop:3}}>{h.v}</div></div>)}
          </div>
        </div>}

        {/* ── REPORTS ── */}
        {tab==="reports"&&<div>
          <Lb>ON THE RIVER</Lb>
          <Cd style={{padding:"4px 12px"}}>
            {(RPT[riv]||[{d:"No reports yet",bt:rv.n,au:"",src:"",tx:"Be the first to report. Submit what you're seeing on the water.",v:false}]).map((r,i)=><div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${P.bd}`}}>
              <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                {r.src&&<span style={{fontSize:7,fontWeight:700,color:r.src==="Keeper"?P.gn:r.src==="Guide"?P.txD:r.src==="Club"?"#5A7A5E":P.txM,border:`1px solid ${P.bd}`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span>}
                <span style={{fontSize:11,fontWeight:600}}>{r.bt}</span><span style={{fontSize:9,color:P.txD}}>{r.d}</span>
                {r.v&&<span style={{marginLeft:"auto",fontSize:7,color:P.gn,fontWeight:600}}>VERIFIED</span>}
              </div>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>{r.tx}</div>
              {r.au&&<div style={{fontSize:9,color:P.txD,marginTop:2}}>{r.au}</div>}
            </div>)}
          </Cd>
          <Cd style={{padding:12,marginTop:12}}>
            <div style={{fontSize:8,fontWeight:700,letterSpacing:"0.1em",color:P.txD,marginBottom:6}}>DISCLAIMER</div>
            <div style={{fontSize:9,color:P.txM,lineHeight:1.6}}>Forecasts based on modelled data from Environment Agency and Open-Meteo. All predictions indicative only. Check local conditions and regulations before fishing. Reports are unverified unless marked. Fishing at your own risk. EA: Open Government Licence. Weather: Open-Meteo CC BY 4.0.</div>
          </Cd>
        </div>}

      </div>

      {/* ══ FOOTER ══ */}
      <div style={{textAlign:"center",padding:"16px",borderTop:`1px solid ${P.bd}`}}>
        <W s={30} c={P.txD} r/><div style={{fontSize:9,color:P.txD,letterSpacing:"0.12em",marginTop:4}}>EPHEMERA</div>
        <div style={{fontSize:7,color:P.txD,marginTop:4}}>Timely insight. Better days. / Forecasts are indicative.<br/>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100}}>
        {[{id:"today",l:"Today",i:"◉"},{id:"hourly",l:"Hourly",i:"◔"},{id:"hatches",l:"Hatches",i:"◎"},{id:"fly",l:"Flies",i:"◈"},{id:"outlook",l:"Outlook",i:"◑"},{id:"reports",l:"Reports",i:"◇"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"9px 0 7px",border:"none",background:"none",color:tab===n.id?P.rust:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:14,lineHeight:1}}>{n.i}</div><div style={{fontSize:7,fontWeight:600,marginTop:2}}>{n.l}</div></button>)}
      </div>
    </div>
  );
}
