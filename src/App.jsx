import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══ EPHEMERA — Your pocket fly fishing guide ═══ */

const Wing=({s=24,c="#F3F0E8",r=false})=><svg width={s} height={s} viewBox="100 40 320 380" fill="none" strokeLinecap="round" strokeLinejoin="round"><g stroke={c}><path d="M176 306C205 197 286 103 382 62C360 158 297 250 176 306Z" strokeWidth="18"/><path d="M179 304C232 245 292 189 374 68" strokeWidth="10"/><path d="M221 269C252 261 287 246 323 221" strokeWidth="9"/><path d="M252 222C281 215 312 202 344 178" strokeWidth="9"/><path d="M118 334H394" strokeWidth="14"/><path d="M151 368H357" strokeWidth="10"/></g><path d="M198 398H310" stroke={r?"#C36A3D":c} strokeWidth="8" strokeLinecap="round"/></svg>;

const D={bg:"#161E1B",c1:"#1B2421",c2:"#212C28",c3:"#283632",bd:"#2E3B36",tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",rust:"#C36A3D",gn:"#7A9E7E",rustS:"#C36A3D18",rustB:"#C36A3D40"};
const L={bg:"#F3F0E8",c1:"#FFFFFF",c2:"#EBE8E0",c3:"#E0DDD5",bd:"#D0CCC2",tx:"#1F2D2A",txM:"#5F6F7B",txD:"#8A948F",rust:"#C36A3D",gn:"#5A7A5E",rustS:"#C36A3D12",rustB:"#C36A3D30"};

/* ── FLY SVG ILLUSTRATIONS ── */
function FlyIllustration({type,P}){
  const hk="#8A948F",bd="#5F6F7B",ac="#C36A3D";
  const flies={
    wulff:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 55 L20 35 C20 20 35 15 50 18 C60 20 68 30 68 40" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="68" y1="38" x2="62" y2="30" stroke={hk} strokeWidth="1.5" strokeLinecap="round"/><circle cx="20" cy="55" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M25 35 Q30 30 35 35 Q40 40 35 42" fill="none" stroke={bd} strokeWidth="2.5"/><path d="M35 35 Q40 30 45 35 Q50 40 45 42" fill="none" stroke={bd} strokeWidth="2.5"/><path d="M48 30 Q42 18 38 10" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.7"/><path d="M48 30 Q54 18 58 10" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.7"/><path d="M30 40 Q25 44 20 42" fill="none" stroke={bd} strokeWidth="1" opacity="0.5"/><path d="M30 40 Q25 48 18 48" fill="none" stroke={bd} strokeWidth="1" opacity="0.5"/><path d="M55 38 Q60 34 65 30" fill="none" stroke={bd} strokeWidth="1" opacity="0.5"/><path d="M55 38 Q60 38 65 35" fill="none" stroke={bd} strokeWidth="1" opacity="0.5"/><path d="M65 40 Q75 38 85 36" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.4"/><path d="M65 40 Q77 40 88 40" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.4"/><path d="M65 41 Q77 44 88 46" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.4"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Grey Wulff #12</text></svg>,
    spent:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 45 L20 35 C20 22 35 18 50 22 C60 25 68 32 68 40" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="68" y1="38" x2="62" y2="30" stroke={hk} strokeWidth="1.5"/><circle cx="20" cy="45" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M40 28 Q25 18 12 14" fill="none" stroke={bd} strokeWidth="1.8" opacity="0.6"/><path d="M40 28 Q55 18 68 14" fill="none" stroke={bd} strokeWidth="1.8" opacity="0.6"/><path d="M30 30 Q28 28 30 26" fill="none" stroke={bd} strokeWidth="1"/><path d="M50 30 Q52 28 50 26" fill="none" stroke={bd} strokeWidth="1"/><path d="M65 40 Q78 38 90 36" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.4"/><path d="M65 40 Q78 42 90 44" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.4"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Spent Gnat #10</text></svg>,
    imperial:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 50 L20 34 C20 22 32 18 44 20 C54 22 62 30 62 38" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="62" y1="36" x2="56" y2="28" stroke={hk} strokeWidth="1.5"/><circle cx="20" cy="50" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M38 24 Q36 14 34 6" fill="none" stroke="#A8832E" strokeWidth="1.5" opacity="0.6"/><path d="M42 24 Q44 14 46 6" fill="none" stroke="#A8832E" strokeWidth="1.5" opacity="0.6"/><path d="M28 28 Q32 32 36 28 Q40 24 44 28 Q48 32 52 28" fill="none" stroke="#A8832E" strokeWidth="1.2" opacity="0.5"/><path d="M60 38 Q70 36 80 34" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.3"/><path d="M60 38 Q70 38 80 38" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.3"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Kite's Imperial #14</text></svg>,
    ehc:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 50 L20 34 C20 22 32 18 46 20 C56 22 64 30 64 38" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="64" y1="36" x2="58" y2="28" stroke={hk} strokeWidth="1.5"/><circle cx="20" cy="50" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M32 26 Q38 16 48 12 Q58 10 68 14 Q78 18 82 24" fill="#8B7355" opacity="0.25" stroke="#8B7355" strokeWidth="1.5"/><path d="M30 30 Q36 26 42 30 Q48 34 54 30" fill="none" stroke={bd} strokeWidth="1" opacity="0.4"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Elk Hair Caddis #14</text></svg>,
    klink:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M30 20 L30 35 C30 50 40 60 55 58 C65 56 70 48 68 42" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="68" y1="40" x2="62" y2="34" stroke={hk} strokeWidth="1.5"/><circle cx="30" cy="16" r="3" fill="none" stroke={hk} strokeWidth="2"/><line x1="40" y1="32" x2="40" y2="14" stroke="white" strokeWidth="1.5" opacity="0.5"/><circle cx="40" cy="12" r="5" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/><path d="M35 12 Q40 8 45 12 Q40 16 35 12" fill="white" opacity="0.15"/><path d="M34 30 Q38 34 42 30 Q46 26 50 30" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.5"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Klinkhamer #14</text></svg>,
    shuttlecock:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M30 22 L30 38 C30 52 42 58 54 55" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><circle cx="30" cy="18" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M34 28 Q32 16 30 8" fill="none" stroke={bd} strokeWidth="2" opacity="0.5"/><path d="M36 28 Q36 16 38 8" fill="none" stroke={bd} strokeWidth="2" opacity="0.5"/><path d="M32 12 Q34 6 36 12" fill={bd} opacity="0.1"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">CDC Shuttlecock #16</text></svg>,
    ptn:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 45 L20 32 C20 22 30 18 42 20 C52 22 62 28 65 35 Q68 42 66 48" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="45" r="2.5" fill="none" stroke={hk} strokeWidth="2"/><circle cx="44" cy="24" r="2.5" fill="#8B7355" opacity="0.4"/><line x1="28" y1="28" x2="30" y2="24" stroke="#A8832E" strokeWidth="0.8" opacity="0.4"/><line x1="34" y1="26" x2="36" y2="22" stroke="#A8832E" strokeWidth="0.8" opacity="0.4"/><line x1="40" y1="24" x2="42" y2="20" stroke="#A8832E" strokeWidth="0.8" opacity="0.4"/><line x1="48" y1="24" x2="50" y2="20" stroke="#A8832E" strokeWidth="0.8" opacity="0.4"/><path d="M62 40 Q70 38 80 36" fill="none" stroke={bd} strokeWidth="1" opacity="0.3"/><path d="M62 42 Q70 42 80 42" fill="none" stroke={bd} strokeWidth="1" opacity="0.3"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Pheasant Tail #16</text></svg>,
    grhe:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 45 L20 30 C20 20 32 16 46 18 C56 20 64 28 64 36 Q66 44 64 50" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="45" r="2.5" fill="none" stroke={hk} strokeWidth="2"/><circle cx="48" cy="22" r="3" fill="#8B7355" opacity="0.3"/><path d="M32 24 Q38 20 44 24 Q50 28 56 24" fill="none" stroke="#8B7355" strokeWidth="2" opacity="0.3"/><line x1="30" y1="26" x2="32" y2="22" stroke="#C4973A" strokeWidth="0.8" opacity="0.4"/><line x1="38" y1="24" x2="40" y2="20" stroke="#C4973A" strokeWidth="0.8" opacity="0.4"/><line x1="46" y1="23" x2="48" y2="19" stroke="#C4973A" strokeWidth="0.8" opacity="0.4"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Hare's Ear #14</text></svg>,
    adams:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 50 L20 34 C20 22 34 18 48 20 C58 22 66 30 66 38" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><line x1="66" y1="36" x2="60" y2="28" stroke={hk} strokeWidth="1.5"/><circle cx="20" cy="50" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M42 24 Q40 12 38 4" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.5"/><path d="M46 24 Q48 12 50 4" fill="none" stroke={bd} strokeWidth="1.5" opacity="0.5"/><path d="M30 28 Q34 32 38 28 Q42 24 46 28 Q50 32 54 28 Q58 24 62 28" fill="none" stroke={bd} strokeWidth="1.2" opacity="0.5"/><path d="M64 38 Q74 36 84 34" fill="none" stroke={bd} strokeWidth="1" opacity="0.3"/><path d="M64 39 Q74 40 84 40" fill="none" stroke={bd} strokeWidth="1" opacity="0.3"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Adams #16</text></svg>,
    killer:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M20 45 L20 30 C20 20 30 16 44 18 C54 20 62 28 62 36" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="45" r="2.5" fill="none" stroke={hk} strokeWidth="2"/><path d="M26 32 Q34 28 42 30 Q50 32 58 28" fill="#C4973A" opacity="0.15" stroke="#C4973A" strokeWidth="1"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Killer Bug #14</text></svg>,
    danicae:<svg viewBox="0 0 140 80" width="100%" style={{maxWidth:200}}><path d="M30 20 L30 38 C30 52 44 60 58 56 C68 52 72 44 70 38" fill="none" stroke={hk} strokeWidth="2.5" strokeLinecap="round"/><circle cx="30" cy="16" r="3" fill="none" stroke={hk} strokeWidth="2"/><path d="M36 30 Q34 18 30 10" fill="none" stroke="#C4973A" strokeWidth="2" opacity="0.5"/><path d="M38 30 Q40 18 44 10" fill="none" stroke="#C4973A" strokeWidth="2" opacity="0.5"/><path d="M38 34 Q42 30 46 34 Q50 38 54 34" fill="none" stroke="#A8832E" strokeWidth="1.2" opacity="0.4"/><text x="4" y="75" fill={P.txD} fontSize="8" fontFamily="inherit">Danica Emerger #10</text></svg>,
  };
  return flies[type]||null;
}

/* ── DATA ── */
// q = river quality 1-10 (10=world class). bq = beat quality overrides
const RV=[
  {id:"test",n:"River Test",ea:"Test",lat:51.09,lng:-1.49,q:10,b:["Broadlands","Nursling","Timsbury","Mottisfont","Horsebridge","Park Stream","Stockbridge","Leckford","Longparish","Whitchurch","Laverstoke"],bq:{Stockbridge:10,Leckford:9,"Park Stream":9,Mottisfont:9,Horsebridge:8,Longparish:8,Whitchurch:7,Laverstoke:7,Timsbury:7,Broadlands:7,Nursling:6}},
  {id:"itchen",n:"River Itchen",ea:"Itchen",lat:51.06,lng:-1.30,q:10,b:["Itchen Abbas","Martyr Worthy","Easton","Abbotts Barton","Twyford"],bq:{"Abbotts Barton":10,"Martyr Worthy":9,"Itchen Abbas":9,Easton:8,Twyford:7}},
  {id:"kennet",n:"River Kennet",ea:"Kennet",lat:51.42,lng:-1.52,q:8,b:["Marlborough","Ramsbury","Littlecote","Hungerford","Kintbury"],bq:{Ramsbury:9,Littlecote:8,Hungerford:7,Kintbury:7,Marlborough:6}},
  {id:"lambourn",n:"River Lambourn",ea:"Lambourn",lat:51.50,lng:-1.53,q:8,b:["Upper Lambourn","Great Shefford"],bq:{"Upper Lambourn":8,"Great Shefford":7}},
  {id:"anton",n:"River Anton",ea:"Anton",lat:51.19,lng:-1.50,q:7,b:["Goodworth Clatford","Anton Lakes"],bq:{"Goodworth Clatford":7,"Anton Lakes":6}},
  {id:"avon",n:"Hampshire Avon",ea:"Avon Hampshire",lat:51.17,lng:-1.78,q:9,b:["Upavon","Netheravon","Amesbury","Salisbury"],bq:{Amesbury:8,Netheravon:8,Upavon:7,Salisbury:7}},
  {id:"wylye",n:"River Wylye",ea:"Wylye",lat:51.17,lng:-2.06,q:8,b:["Heytesbury","Codford"],bq:{Heytesbury:8,Codford:7}},
  {id:"nadder",n:"River Nadder",ea:"Nadder",lat:51.08,lng:-1.98,q:7,b:["Tisbury","Wilton"],bq:{Tisbury:7,Wilton:6}},
  {id:"meon",n:"River Meon",ea:"Meon",lat:50.94,lng:-1.14,q:7,b:["East Meon","Droxford"],bq:{"East Meon":7,Droxford:6}},
  {id:"piddle",n:"River Piddle",ea:"Piddle",lat:50.73,lng:-2.21,q:7,b:["Puddletown"],bq:{Puddletown:7}},
  {id:"frome",n:"Frome (Dorset)",ea:"Frome",lat:50.71,lng:-2.44,q:7,b:["Dorchester"],bq:{Dorchester:6}},
  {id:"mimram",n:"River Mimram",ea:"Mimram",lat:51.80,lng:-0.22,q:5,b:["Welwyn"],bq:{Welwyn:5}},
  {id:"chess",n:"River Chess",ea:"Chess",lat:51.65,lng:-0.60,q:6,b:["Chesham","Latimer","Nr. Sarratt","Rickmansworth"],bq:{Latimer:7,"Nr. Sarratt":6,Chesham:5,Rickmansworth:5}},
  {id:"darent",n:"River Darent",ea:"Darent",lat:51.37,lng:0.18,q:5,b:["Shoreham","Eynsford"],bq:{Shoreham:6,Eynsford:5}},
  {id:"wandle",n:"River Wandle",ea:"Wandle",lat:51.42,lng:-0.17,q:4,b:["Carshalton"],bq:{Carshalton:4}},
];

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

/* ── FLY BOX with illustrations ── */
const FLIES={
  dry:[
    {nm:"Grey Wulff",sz:"10-14",mt:["danica"],ef:5,img:"wulff",nt:"Classic mayfly pattern. Bushy calf-tail wings, thick hackle. Floats forever in rough water. The go-to during the mayfly."},
    {nm:"Spent Gnat",sz:"10-12",mt:["danica"],ef:5,img:"spent",nt:"Flat-winged spinner. Fish it dead drift during spinner falls. Deadly when mayfly are dying on the surface."},
    {nm:"Kite's Imperial",sz:"14-16",mt:["ldo","mo"],ef:5,img:"imperial",nt:"Oliver Kite's masterpiece. THE olive pattern for chalkstreams. Heron herl body, honey hackle. Simple and devastating."},
    {nm:"Adams",sz:"14-18",mt:["ldo","mo","bwo"],ef:4,img:"adams",nt:"Versatile searching pattern. Grizzly and brown hackle mix. Works when you're not sure what they're taking."},
    {nm:"Elk Hair Caddis",sz:"12-16",mt:["sedge"],ef:4,img:"ehc",nt:"Al Troth's classic. Elk hair wing, palmered hackle. Fish it static or skate it across the surface. Evening essential."},
  ],
  emerger:[
    {nm:"Klinkhamer Special",sz:"12-18",mt:["ldo","mo","bwo","danica"],ef:5,img:"klink",nt:"Hans van Klinken's design. Curved hook, parachute hackle. Hangs in the film. The most versatile chalkstream fly ever tied."},
    {nm:"Danica Emerger",sz:"10-12 LD",mt:["danica"],ef:5,img:"danicae",nt:"Big emerger for the mayfly. Sits in the film with CDC wing buds. Fish it dead still in the current seam. Often outperforms the dry."},
    {nm:"CDC Shuttlecock",sz:"14-20",mt:["ldo","mo","bwo","ib","pw"],ef:5,img:"shuttlecock",nt:"CDC feather tips pointing up, body hanging below the film. Tie it sparse — less is more. The fish see the trapped emerger silhouette."},
  ],
  nymph:[
    {nm:"Pheasant Tail Nymph",sz:"14-18",mt:["ldo","mo","bwo","ib","pw"],ef:5,img:"ptn",nt:"Frank Sawyer's original. Pheasant tail fibres, copper wire. Dead drift or induced take. The desert island nymph."},
    {nm:"Hare's Ear",sz:"14-16",mt:["ldo","mo","bwo"],ef:5,img:"grhe",nt:"Buggy, translucent, alive-looking. Gold rib catches the light. Works when nothing else does. Tie it scruffy."},
    {nm:"Killer Bug",sz:"14-16",mt:["ldo","mo"],ef:4,img:"killer",nt:"Frank Sawyer's secret weapon. Chadwick's 477 wool, copper wire. Simple, deadly, especially in cold water on grayling."},
  ],
};

/* ── METHOD RIGS ── */
const METHODS=[{id:"dry",l:"Dry Fly Only"},{id:"drynymph",l:"Dry & Nymph"},{id:"any",l:"Any Method"}];
function buildRig(wt,wind,cloud,method,topH){
  const warm=wt>=12,oc=cloud>60,br=cloud<40,wd=wind>12;
  const fly=topH?`Match the ${topH.cm} — ${topH.hk}`:"Match the hatch";
  if(method==="dry"){if(warm&&oc)return{a:"Upstream dry to risers",rod:"9ft 4wt",ldr:wt>13?"12-15ft degreased":"9-12ft tapered",tip:"5X-6X nylon",fly,guide:"Wait for a rise. Position below. One accurate cast. No false casting over the fish.",c:85,why:"Overcast + warm = classic dry fly."};if(wd)return{a:"Terrestrial on the lee bank",rod:"9ft 5wt",ldr:"9ft tapered",tip:"4X-5X nylon",fly:"Hawthorn #12 or Black Gnat #14",guide:"Wind blows terrestrials onto water. Fish sheltered bank. Shorter casts.",c:75,why:"Wind ripple gives cover."};return{a:"Upstream dry — fine and far",rod:"9ft 4wt",ldr:"14-16ft, mud on last 3ft",tip:"6X nylon",fly:"Small pattern — CDC or Last Hope #18",guide:"Bright or calm — go fine. Long leaders. Wait for evening if it's tough.",c:65,why:"Tough conditions demand stealth."};}
  if(method==="drynymph"){if(warm&&oc)return{a:"Start dry. Nymph as backup.",rod:"9ft 4-5wt",ldr:"12ft tapered",tip:"5X nylon / 5X fluoro",fly:`Dry: ${fly}. Nymph: PTN #16`,guide:"Dries first in warm overcast. Switch to upstream nymph if quiet.",c:82,why:"Dual approach."};return{a:"Upstream nymph, dry ready",rod:"9-10ft 4-5wt",ldr:"10-12ft",tip:"5X fluoro",fly:"PTN #16 or Killer Bug. Dry: Klinkhamer.",guide:"Dead drift nymph along bottom. Watch leader for takes. Switch to dry if rises appear.",c:78,why:"Cool or bright — nymph covers water."};}
  // Any method
  if(warm&&oc)return{a:"Dry fly — conditions are perfect",rod:"9ft 4-5wt",ldr:"12ft",tip:"5X nylon",fly,guide:"Don't go subsurface too early. These are prime dry fly conditions. If quiet, try a Klinkhamer with PTN dropper — covers both zones.",c:85,why:"Best conditions for dries. Dropper rig as backup."};
  if(warm&&!oc)return{a:"Klinkhamer + nymph dropper",rod:"9ft 5wt",ldr:"9-12ft tapered",tip:"5X nylon to Klink, 18in 5X fluoro dropper",fly:"Klinkhamer #14 point. PTN #16 on 18in dropper.",guide:"Klink acts as indicator and fly. If it goes under, strike. Adjust dropper length for depth. Covers surface and subsurface simultaneously.",c:80,why:"Bright/mixed. Dropper rig covers two zones at once."};
  return{a:"Euro nymph or heavy nymph rig",rod:"10ft 3-4wt",ldr:"20ft straight fluoro",tip:"5X-6X fluoro",fly:"Jig nymph #14 point, PTN #16 dropper. Or Klinkhamer + PTN dropper if rises appear.",guide:"Short line, high rod. Work seams and gravel runs. Switch to dry dropper if you see surface activity.",c:78,why:"Cool water. Subsurface first, stay versatile."};
}

/* ── SCENARIOS ── */
const SC=[
  {id:"rising",l:"Fish rising",i:"◉",a:[{h:"Match the size first",d:"Size matters more than pattern. Watch what's on the water.",c:85},{h:"Check your drift",d:"Micro-drag gets you refused. Throw slack, mend upstream.",c:80},{h:"Drop tippet one size",d:"5X to 6X can make the difference on selective fish.",c:75}]},
  {id:"refusing",l:"Refusing",i:"✕",a:[{h:"Go smaller AND lighter",d:"Drop one hook AND one tippet size. Present 6in upstream of last refusal.",c:90},{h:"Switch to emerger",d:"CDC shuttlecock or Klinkhamer. Fish often key on the film, not on top.",c:85},{h:"Change angle",d:"Curve cast to show fly before leader. Or change bank.",c:70},{h:"Stop and watch",d:"Count rise rhythm. Match your cast timing to it.",c:80}]},
  {id:"nothing",l:"No signs",i:"—",a:[{h:"Nymph the bottom",d:"Weighted PTN #16, dead drifted. Tick the gravel.",c:75},{h:"Induced take",d:"Cast up, let sink, then lift rod to swing nymph upward.",c:70},{h:"Fish the structure",d:"Weed margins, undercuts, overhanging trees.",c:65}]},
  {id:"cruising",l:"Cruising",i:"↺",a:[{h:"Intercept the circuit",d:"Watch the route. Position ahead. One cast in the path.",c:85},{h:"Emerger in the lane",d:"CDC shuttlecock, dead still. Let them find it.",c:80},{h:"15ft leader minimum",d:"Cruising fish see everything.",c:75}]},
  {id:"windy",l:"Windy",i:"≈",a:[{h:"Lee bank + terrestrials",d:"Wind pushes food to sheltered side. Hawthorn or beetle.",c:85},{h:"Bigger flies",d:"Ripple = less wary. Size 12-14 Adams or Wulff.",c:80},{h:"Short casts, low rod",d:"Punch into wind. Accuracy over distance.",c:75}]},
  {id:"bright",l:"Bright & clear",i:"☀",a:[{h:"Fish the shade",d:"Under trees, bridge shadows. Present from downstream.",c:85},{h:"Go fine — 6X, size 18-20",d:"Mud on leader. Every detail matters.",c:90},{h:"Wait for evening",d:"Last 2 hours of a bright day can be extraordinary.",c:70}]},
  {id:"spooking",l:"Spooking",i:"!",a:[{h:"Stand still 2 minutes",d:"Fish return to position within 5-10 minutes.",c:90},{h:"Come from behind",d:"Low profile, slow steps. Kneel if needed.",c:85},{h:"One shoot, no false casts",d:"Rod flash spooks more fish than bad flies.",c:80}]},
  {id:"missed",l:"Missed takes",i:"↗",a:[{h:"Slow your strike",d:"Wait for the mouth to close. 'God save the Queen' then lift.",c:90},{h:"Sharpen the hook",d:"Thumbnail test. If it slides, change it.",c:85},{h:"Tighten connection",d:"Rod tip low, minimal slack for instant contact.",c:75}]},
];

function relDate(daysAgo){const d=new Date();d.setDate(d.getDate()-daysAgo);return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
const RPT={test:[{d:relDate(0),bt:"Stockbridge",au:"River Keeper",src:"Keeper",tx:"Good olive hatch through the morning. Water clarity excellent. Ranunculus in superb condition. A few early danica shucks spotted.",v:true},{d:relDate(1),bt:"Park Stream",au:"Guide",src:"Guide",tx:"Afternoon olives brought fish up. Two good trout on CDC shuttlecocks. Water temp 13.2C. Carriers fishing better than the main river.",v:true},{d:relDate(2),bt:"Mottisfont",au:"@chalkstream_life",src:"Social",tx:"Iron blues in the drizzle. Lovely sport on small dries. Ranunculus beds looking healthy.",v:false},{d:relDate(3),bt:"Leckford",au:"Estate Keeper",src:"Keeper",tx:"Strong LDO hatch midmorning. Hawthorn about on the meadow stretches. Weed growth on track.",v:true},{d:relDate(4),bt:"Longparish",au:"Test Valley FC",src:"Club",tx:"Steady olives and pale wateries. A few grayling showing in the deeper runs. River in fine order.",v:true}],itchen:[{d:relDate(1),bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Consistent olive hatch. Technical fish as always. Fine tippets essential.",v:true}],kennet:[{d:relDate(2),bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Good olives through midday. Grayling on nymphs in the afternoon.",v:false}]};

/* ── ENGINE ── */
const cache={};
async function fetchWx(la,lo){const k=`w${la.toFixed(1)}_${lo.toFixed(1)}`;if(cache[k])return cache[k];try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,precipitation_probability,precipitation,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset&timezone=Europe/London&forecast_days=7&current=temperature_2m,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,precipitation,relative_humidity_2m`);const d=await r.json();cache[k]=d;return d}catch{return null}}
async function fetchEA(name){const k=`e_${name}`;if(cache[k])return cache[k];try{const r=await fetch(`https://environment.data.gov.uk/hydrology/id/stations?riverName=${encodeURIComponent(name)}&_limit=5`);const d=await r.json();const o={level:null,temp:null};for(const s of(d.items||[]))for(const m of(s.measures||[])){const id=typeof m==="string"?m:m["@id"];const p=(typeof m==="string"?"":m.parameterName||m.parameter||"").toLowerCase();if(p.includes("level")&&!o._l)o._l=id;if(p.includes("temp")&&!o._t)o._t=id}if(o._l){try{const r2=await fetch(o._l.startsWith("http")?`${o._l}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${o._l}/readings?latest`);const d2=await r2.json();if(d2.items?.[0])o.level=d2.items[0].value}catch{}}if(o._t){try{const r3=await fetch(o._t.startsWith("http")?`${o._t}/readings?latest`:`https://environment.data.gov.uk/hydrology/id/measures/${o._t}/readings?latest`);const d3=await r3.json();if(d3.items?.[0])o.temp=d3.items[0].value}catch{}}cache[k]=o;return o}catch{return null}}

const DOY=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/864e5);
function simT(lat){return+(6+8*Math.sin((DOY-80)*Math.PI/183)+(lat-51)*-0.8).toFixed(1)}
function pred(wt){return H.map(sp=>{let sF=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=Math.max(0,1-((DOY-m)/r)**2)}else if(DOY>=sp.s-14&&DOY<sp.s)sF=(DOY-sp.s+14)/28;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(wt>=sp.tMn&&wt<=sp.tMx)tF=Math.max(0,1-((wt-tm)/(tr*1.2))**2);else if(wt>=sp.tMn-2)tF=Math.max(0,(wt-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score)}
function hInt(wt,hr){let hi=0;H.forEach(sp=>{if(DOY<sp.s-10||DOY>sp.e+10)return;let sf=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((DOY-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}
const hC=s=>s>70?D.rust:s>40?D.gn:s>15?D.txM:D.txD;
const iC=v=>v>=6?D.rust:v>=4?"#A85C2E":v>=2?D.gn:v>=1?"#3E5A40":"#1E2E26";
const hrScore=(hi,wind,cloud,press,rq,bq)=>{let s=0;s+=Math.min(30,hi*3);if(cloud>70)s+=10;else if(cloud>40)s+=7;else s+=3;if(wind>=3&&wind<=10)s+=12;else if(wind<3)s+=8;else if(wind<=14)s+=6;else if(wind<=18)s+=3;else s+=0;if(press<1010)s+=8;else if(press<1018)s+=5;else s+=2;const avgQ=((rq||6)+(bq||rq||6))/2;s+=Math.round(avgQ*1.2);return Math.round(Math.min(100,Math.max(0,s)))};
const hrLb=s=>s>=75?"Excellent":s>=55?"Good":s>=35?"Fair":"Poor";
const hrClr=s=>s>=75?D.rust:s>=55?D.gn:s>=35?D.txM:D.txD;
const windDir=d=>{const dirs=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];return dirs[Math.round(d/22.5)%16]};
function dayRating(hi,lo,rain,windMax,hatchScore,riverQ){
  let s=0;
  // Hatch activity (35%)
  const hs=hatchScore||0;
  s+=Math.min(35,hs*0.35);
  // Temperature (15%) - ideal 13-19°C
  const avg=(hi+lo)/2;
  if(avg>=13&&avg<=19)s+=15;else if(avg>=10&&avg<=22)s+=10;else if(avg>=7)s+=6;else s+=2;
  // Rain (10%) - light drizzle great, heavy bad
  if(rain>=0.5&&rain<=4)s+=10;else if(rain<0.5)s+=7;else if(rain<=10)s+=5;else s+=2;
  // Wind (15%) - strong wind really hurts
  const w=windMax||8;
  if(w>=3&&w<=10)s+=15;else if(w<3)s+=10;else if(w<=14)s+=8;else if(w<=18)s+=4;else if(w<=22)s+=1;else s+=0;
  // Cloud (10%)
  s+=7; // moderate default (can't get per-day cloud easily)
  // River quality (15%)
  const rq=riverQ||5;
  s+=Math.round(rq*1.5);
  return Math.round(Math.min(100,Math.max(0,s)));
}
function condScore(wind,press,cloud,waterT,hatchIdx,riverQ,beatQ){
  // Comprehensive fishing conditions score
  // 90-100: Peak. Mayfly, overcast, warm, world-class beat. Fish freely rising. Multiple catches.
  // 70-89: Excellent. Strong hatches, good conditions, quality water.
  // 50-69: Good. Some activity. Fish rising in windows. Need to work for it.
  // 30-49: Fair. Sparse hatches, challenging conditions. Nymphing day.
  // 0-29: Poor. Minimal hatches, fish unlikely to rise.
  let s=0;
  // Hatch activity (30%) — biggest natural factor
  s+=Math.min(30,hatchIdx*0.30);
  // Water temp (18%) — 13-17°C sweet spot for surface feeding
  if(waterT>=13&&waterT<=17)s+=18;else if(waterT>=11&&waterT<=19)s+=13;else if(waterT>=9&&waterT<=21)s+=8;else if(waterT>=7)s+=4;else s+=1;
  // Cloud cover (12%) — overcast = hatches
  if(cloud>70)s+=12;else if(cloud>50)s+=9;else if(cloud>30)s+=6;else s+=3;
  // Pressure (10%) — falling/low = feeding trigger
  if(press<1008)s+=10;else if(press<1015)s+=8;else if(press<1022)s+=6;else s+=3;
  // Wind (15%) — critical factor. Strong wind hammers the score
  if(wind>=3&&wind<=10)s+=15;   // ideal: light breeze, ripple helps
  else if(wind<3)s+=10;          // dead calm: tricky but fishable
  else if(wind<=14)s+=9;         // moderate: manageable with effort
  else if(wind<=18)s+=5;         // strong: hard to cast, harder to present
  else if(wind<=22)s+=2;         // very strong: really tough day
  else s+=0;                     // gale: go to the pub
  // River & beat quality (18%) — prestige, fish density, habitat quality
  // World-class beat (10/10) adds up to 18. Urban stream (4/4) adds ~7.
  // This means switching Test/Stockbridge to Wandle/Carshalton drops score ~11pts
  const rq=riverQ||5;const bq=beatQ||rq;const avgQ=(rq+bq)/2;
  s+=Math.round(avgQ*1.8); // 10=+18, 7=+12.6, 5=+9, 3=+5.4
  const pct=Math.round(Math.min(100,Math.max(0,s)));
  const label=pct>=90?"Exceptional":pct>=75?"Excellent":pct>=55?"Good":pct>=35?"Fair":"Poor";
  const clr=pct>=75?D.rust:pct>=55?D.gn:pct>=35?D.txM:D.txD;
  const desc=pct>=90?"Fish freely rising. Multiple catches likely. A day to remember."
    :pct>=75?"Strong hatches expected. Fish active on the surface. Good sport ahead."
    :pct>=55?"Some activity. Fish rising in windows. Work the hatches, stay patient."
    :pct>=35?"Tough conditions. Sparse hatches. Nymphing likely the best approach."
    :"Minimal hatch activity. Fish unlikely to rise. Deep nymphing or wait for conditions to change.";
  return{label,pct,clr,desc};
}
function danSt(wt){const as=139;if(DOY>172)return{s:"Season ended",c:D.txD};if(DOY>as+14&&wt>=12)return{s:"On the water",c:D.rust};if(DOY>as&&wt>=12)return{s:"Underway",c:D.rust};if(DOY>as-7&&wt>=11)return{s:"On time",c:D.gn};if(DOY>as-7)return{s:"Late — cool water",c:D.txD};if(DOY>as-14&&wt>=13)return{s:"Early — warm spring",c:D.rust};if(DOY>as-14)return{s:"Days away",c:D.txM};return{s:"Not yet",c:D.txD}}
function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);let oa=0;H.forEach(sp=>{if(md>=sp.s&&md<=sp.e)oa+=Math.max(0,1-((md-(sp.s+sp.e)/2)/((sp.e-sp.s)/2))**2)*(sp.t===1?3:sp.t===2?1.5:0.8)});return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),oa:+Math.min(10,oa).toFixed(1),cf:w<2?"High":w<4?"Med":"Low"}})}

/* ── APP ── */
export default function App(){
  const[riv,setRiv]=useState("test");const[beat,setBeat]=useState("Stockbridge");const[tab,setTab]=useState("guide");const[pick,setPick]=useState(false);const[hDay,setHDay]=useState(0);const[gDay,setGDay]=useState(0);const[live,setLive]=useState({});const[loading,setLoading]=useState(true);const[dSrc,setDSrc]=useState("loading");const[light,setLight]=useState(false);const[scenario,setScenario]=useState(null);const[method,setMethod]=useState("dry");const[flyT,setFlyT]=useState("dry");const[openFly,setOpenFly]=useState(null);
  const[sessions,setSessions]=useState([]);const[showForm,setShowForm]=useState(false);
  const[fName,setFName]=useState("");const[fBeat,setFBeat]=useState("");const[fFish,setFish]=useState("");const[fBig,setFBig]=useState("");const[fFly,setFFly]=useState("");const[fHatch,setFHatch]=useState("");const[fNotes,setFNotes]=useState("");const[fRating,setFRating]=useState("");
  const P=light?L:D;const rv=RV.find(r=>r.id===riv);

  const doFetch=useCallback(async()=>{setLoading(true);try{const[ea,wx]=await Promise.all([fetchEA(rv.ea),fetchWx(rv.lat,rv.lng)]);setLive({ea,wx});setDSrc(ea?.level?"live":"sim")}catch{setDSrc("sim")}setLoading(false)},[rv]);
  useEffect(()=>{doFetch().catch(()=>{})},[doFetch]);useEffect(()=>{const i=setInterval(()=>doFetch().catch(()=>{}),9e5);return()=>clearInterval(i)},[doFetch]);useEffect(()=>{setBeat(rv.b[0]||"")},[riv]);

  // Simulated weather varies per river (live data from Open-Meteo will be river-specific on deployment)
  const rSeed=rv.id.split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0);
  const cT=live.ea?.temp||simT(rv.lat);const cL=live.ea?.level||(0.35+((rSeed%20)/100));
  const cW=live.wx?.current?.wind_speed_10m?Math.round(live.wx.current.wind_speed_10m*0.621):(4+(rSeed%12));
  const cP=live.wx?.current?.pressure_msl?Math.round(live.wx.current.pressure_msl):(1008+(rSeed%18));
  const cC=live.wx?.current?.cloud_cover??(30+(rSeed%50));
  const cWD=live.wx?.current?.wind_direction_10m||(rSeed%360);
  const cHum=live.wx?.current?.relative_humidity_2m??(55+(rSeed%30));
  const cAir=live.wx?.current?.temperature_2m?Math.round(live.wx.current.temperature_2m):(11+(rSeed%8));
  const cRain=live.wx?.current?.precipitation||0;
  const todayHi=live.wx?.daily?.temperature_2m_max?.[0]?Math.round(live.wx.daily.temperature_2m_max[0]):null;
  const todayLo=live.wx?.daily?.temperature_2m_min?.[0]?Math.round(live.wx.daily.temperature_2m_min[0]):null;
  const todayRain=live.wx?.daily?.precipitation_sum?.[0]??null;
  const todayUV=live.wx?.daily?.uv_index_max?.[0]??null;
  const todaySunrise=live.wx?.daily?.sunrise?.[0]?live.wx.daily.sunrise[0].slice(11,16):null;
  const todaySunset=live.wx?.daily?.sunset?.[0]?live.wx.daily.sunset[0].slice(11,16):null;
  const spp=useMemo(()=>pred(cT),[cT]);const topH=spp[0];const dan=spp.find(s=>s.id==="danica");const actIds=spp.filter(s=>s.score>10).map(s=>s.id);
  const cond=useMemo(()=>{const hIdx=spp.reduce((s,h)=>s+h.score*(h.t===1?3:h.t===2?1.5:0.8),0)/spp.reduce((s,h)=>s+100*(h.t===1?3:h.t===2?1.5:0.8),0)*100;return condScore(cW,cP,cC,cT,hIdx,rv.q,rv.bq?.[beat])},[cW,cP,cC,cT,spp,rv,beat]);const rig=buildRig(cT,cW,cC,method,topH);const ds=danSt(cT);const lr=useMemo(()=>genLR(cT),[cT]);
  const rpts=RPT[riv]||[];const srcC={Keeper:D.gn,Guide:D.txD,Club:"#5A7A5E",Social:D.txM};
  const wxDays=useMemo(()=>{const wx=live.wx;if(!wx?.hourly||!wx?.daily)return[];try{return Array.from({length:Math.min(7,wx.daily.time?.length||0)},(_,d)=>{const dt=new Date(wx.daily.time[d]);const hrs=[];for(let hr=7;hr<=21;hr++){const idx=d*24+hr;if(idx>=(wx.hourly.time?.length||0))break;const air=wx.hourly.temperature_2m?.[idx]||15;const bA=((wx.daily.temperature_2m_max?.[d]||15)+(wx.daily.temperature_2m_min?.[d]||8))/2;const wt=+(cT+(air-bA)*0.15).toFixed(1);hrs.push({h:hr,wt,air:Math.round(air),hi:+hInt(wt,hr).toFixed(1),rain:wx.hourly.precipitation_probability?.[idx]||0,mm:wx.hourly.precipitation?.[idx]||0,pr:wx.hourly.pressure_msl?.[idx]?Math.round(wx.hourly.pressure_msl[idx]):null,ws:wx.hourly.wind_speed_10m?.[idx]?Math.round(wx.hourly.wind_speed_10m[idx]*0.621):null,wd:wx.hourly.wind_direction_10m?.[idx]||0,cl:wx.hourly.cloud_cover?.[idx]??50,hum:wx.hourly.relative_humidity_2m?.[idx]||65})}return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH:wx.daily.temperature_2m_max?.[d]?Math.round(wx.daily.temperature_2m_max[d]):null,aL:wx.daily.temperature_2m_min?.[d]?Math.round(wx.daily.temperature_2m_min[d]):null,rain:wx.daily.precipitation_sum?.[d]??null,windMax:wx.daily.wind_speed_10m_max?.[d]?Math.round(wx.daily.wind_speed_10m_max[d]*0.621):null,uv:wx.daily.uv_index_max?.[d]??null,sunrise:wx.daily.sunrise?.[d]?wx.daily.sunrise[d].slice(11,16):null,sunset:wx.daily.sunset?.[d]?wx.daily.sunset[d].slice(11,16):null,hrs}})}catch{return[]}},[live.wx,cT]);

  const Cd=({children:c,accent:a,style:s})=><div style={{background:a?P.rustS:P.c1,borderRadius:10,border:`1px solid ${a?P.rustB:P.bd}`,overflow:"hidden",...s}}>{c}</div>;
  const Lb=({children:c})=><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8,marginTop:4}}>{c}</div>;

  return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:P.bg,minHeight:"100vh",color:P.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:"calc(68px + env(safe-area-inset-bottom, 0px))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%}input,textarea,select{font-family:inherit;-webkit-appearance:none;appearance:none}input:focus,textarea:focus,select:focus{outline:none}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}`}</style>

      {/* HEADER */}
      <div style={{background:P.c1,padding:"14px 14px 10px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><Wing s={22} c={P.tx} r/><span style={{fontSize:13,fontWeight:600,color:P.tx,letterSpacing:"0.2em"}}>EPHEMERA</span></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"3px 7px",color:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{light?"◐":"☀"}</button>
            <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:700,color:cond.clr,lineHeight:1}}>{cond.label}</div><div style={{fontSize:7,color:P.txD}}>{cond.pct}%</div></div>
          </div>
        </div>
        <button onClick={()=>setPick(!pick)} style={{width:"100%",background:P.c2,border:`1px solid ${P.bd}`,borderRadius:7,padding:"9px 12px",color:P.tx,fontSize:11,fontWeight:600,fontFamily:"inherit",cursor:"pointer",display:"flex",justifyContent:"space-between"}}><span>{rv.n} / {beat}</span><span style={{color:P.txD}}>{pick?"−":"+"}</span></button>
        {pick&&<div style={{marginTop:6,background:P.c2,borderRadius:7,padding:10,border:`1px solid ${P.bd}`,maxHeight:200,overflowY:"auto"}}>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:6}}>{RV.map(r=><button key={r.id} onClick={()=>setRiv(r.id)} style={{padding:"3px 8px",borderRadius:4,border:riv===r.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:riv===r.id?P.rustS:"transparent",color:riv===r.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r.n}</button>)}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>{setBeat(b);setPick(false)}} style={{padding:"2px 7px",borderRadius:4,border:beat===b?`1px solid ${P.tx}`:`1px solid ${P.bd}`,background:beat===b?P.c3:"transparent",color:beat===b?P.tx:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div>
        </div>}
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",borderBottom:`1px solid ${P.bd}`}}>
        {[{l:"AIR",v:`${cAir}°`,c:P.tx},{l:"WATER",v:`${cT}°`,c:cT>=12&&cT<=18?P.gn:P.txD},{l:"WIND",v:`${cW}mph`,c:cW>15?P.rust:P.txM},{l:"PRESS",v:`${cP}`,c:cP<1008?P.gn:cP>1020?P.rust:P.txM},{l:"STATUS",v:cond.label,c:cond.clr}].map((s,i)=>
          <div key={i} style={{padding:"9px 4px",textAlign:"center",borderRight:i<4?`1px solid ${P.bd}`:"",background:P.c1}}>
            <div style={{fontSize:6,letterSpacing:"0.15em",color:P.txD}}>{s.l}</div><div style={{fontSize:13,fontWeight:700,color:s.c,lineHeight:1,marginTop:2}}>{s.v}</div>
          </div>)}
      </div>

      {/* TABS */}
      <div style={{display:"flex",background:P.c1,borderBottom:`1px solid ${P.bd}`,overflowX:"auto"}}>
        {[{id:"guide",l:"Guide"},{id:"hatches",l:"Hatches"},{id:"fly",l:"Fly Box"},{id:"hourly",l:"Hourly"},{id:"outlook",l:"Outlook"},{id:"reports",l:"Reports"},{id:"diagnose",l:"Diagnose"}].map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 10px 8px",border:"none",borderBottom:tab===t.id?`2px solid ${P.rust}`:"2px solid transparent",background:"none",color:tab===t.id?P.rust:P.txD,fontWeight:600,fontSize:9,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginBottom:-1}}>{t.l}</button>)}
      </div>

      <div style={{padding:14}}>

        {/* GUIDE */}
        {tab==="guide"&&<div>
          {/* Weather NOW */}
          <Cd style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div><Lb>WEATHER NOW</Lb><div style={{fontSize:28,fontWeight:700,color:P.tx,lineHeight:1}}>{cAir}°C</div><div style={{fontSize:10,color:P.txD,marginTop:2}}>{todayHi!==null?`High ${todayHi}° / Low ${todayLo}°`:"--"}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:cC>70?P.gn:cC>40?P.txM:P.rust}}>{cC>70?"Overcast":cC>40?"Partly cloudy":"Clear"}</div><div style={{fontSize:10,color:P.txD,marginTop:2}}>{cC}% cloud</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:5}}>
              {[
                {l:"WIND",v:`${cW}mph ${windDir(cWD)}`,c:cW>15?P.rust:P.txM},
                {l:"PRESSURE",v:`${cP}mb`,c:cP<1008?P.gn:cP>1020?P.rust:P.txM},
                {l:"HUMIDITY",v:`${cHum}%`,c:P.txM},
                {l:"RAIN",v:cRain>0?`${cRain}mm`:"Dry",c:cRain>0?P.txD:P.gn},
              ].map((s,i)=><div key={i} style={{padding:"6px 4px",background:P.c2,borderRadius:5,textAlign:"center"}}><div style={{fontSize:6,letterSpacing:"0.1em",color:P.txD}}>{s.l}</div><div style={{fontSize:11,fontWeight:600,color:s.c,marginTop:2}}>{s.v}</div></div>)}
            </div>
            {(todaySunrise||todayUV!==null)&&<div style={{display:"flex",gap:12,marginTop:8,fontSize:10,color:P.txD}}>
              {todaySunrise&&<span>☀ {todaySunrise}</span>}
              {todaySunset&&<span>☽ {todaySunset}</span>}
              {todayUV!==null&&<span>UV {todayUV}</span>}
              {todayRain!==null&&todayRain>0&&<span>{todayRain}mm today</span>}
            </div>}
            <div style={{marginTop:10,padding:"10px",background:P.c2,borderRadius:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1}}><div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em"}}>FISHING CONDITIONS</div><div style={{fontSize:11,color:P.txM,marginTop:3,lineHeight:1.5}}>{cond.desc}</div></div>
              <div style={{textAlign:"center",flexShrink:0,marginLeft:12}}><div style={{fontSize:28,fontWeight:700,color:cond.clr,lineHeight:1}}>{cond.pct}</div><div style={{fontSize:8,fontWeight:700,color:cond.clr}}>{cond.label}</div></div>
            </div>
          </Cd>

          {/* Today's hourly rating */}
          {wxDays.length>0&&wxDays[0]&&<Cd style={{marginBottom:12,padding:14}}>
            <Lb>TODAY'S RATING BY HOUR</Lb>
            <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
              {wxDays[0].hrs.map(h=>{const sc=hrScore(h.hi||0,h.ws||8,h.cl||50,h.pr||1016,rv.q,rv.bq?.[beat]);return<div key={h.h} style={{textAlign:"center",flex:"1 0 auto",minWidth:22}}>
                <div style={{fontSize:7,color:P.txD}}>{h.h}</div>
                <div style={{width:22,height:22,borderRadius:4,background:hrClr(sc),opacity:sc>=35?1:0.4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:sc>=55?700:400,color:sc>=55?"#fff":P.txD,margin:"2px auto"}}>{sc>=35?sc:""}</div>
              </div>})}
            </div>
            {(()=>{const best=wxDays[0].hrs.reduce((a,b)=>{const sa=hrScore(a.hi||0,a.ws||8,a.cl||50,a.pr||1016,rv.q,rv.bq?.[beat]);const sb=hrScore(b.hi||0,b.ws||8,b.cl||50,b.pr||1016,rv.q,rv.bq?.[beat]);return sa>sb?a:b},wxDays[0].hrs[0]);const bsc=hrScore(best.hi||0,best.ws||8,best.cl||50,best.pr||1016,rv.q,rv.bq?.[beat]);return<div style={{marginTop:8,fontSize:10,color:P.txM}}>Peak: <span style={{fontWeight:700,color:hrClr(bsc)}}>{best.h}:00 — {bsc}% {hrLb(bsc)}</span></div>})()}
          </Cd>}

          {/* 7-day overview — tap a day to see hourly breakdown */}
          {wxDays.length>0&&<Cd style={{marginBottom:12,padding:0}}>
            <div style={{padding:"10px 12px 6px"}}><Lb>7-DAY FORECAST — tap a day</Lb></div>
            <div style={{overflowX:"auto"}}>
              <div style={{display:"flex",minWidth:wxDays.length*72}}>
                {wxDays.map((d,i)=>{
                  const futDoy=DOY+i;
                  const projHatch=H.reduce((s,sp)=>{if(futDoy<sp.s-10||futDoy>sp.e+10)return s;let sf=0;if(futDoy>=sp.s&&futDoy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((futDoy-m)/r)**2)}return s+sf*(sp.t===1?30:sp.t===2?12:5)},0);
                  const sc=dayRating(d.aH||14,d.aL||8,d.rain||0,d.windMax,projHatch,rv.q);
                  const lb=sc>=90?"Exceptional":sc>=75?"Excellent":sc>=55?"Good":sc>=35?"Fair":"Poor";
                  const clr=sc>=75?P.rust:sc>=55?P.gn:sc>=35?P.txM:P.txD;
                  return<div key={i} onClick={()=>setGDay(gDay===i?-1:i)} style={{flex:1,padding:"6px 6px 10px",textAlign:"center",borderRight:i<wxDays.length-1?`1px solid ${P.bd}`:"",background:sc>=75?P.rustS:gDay===i?P.c2:"transparent",cursor:"pointer"}}>
                  <div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{d.dn}</div>
                  <div style={{fontSize:8,color:P.txD}}>{d.df}</div>
                  <div style={{fontSize:9,fontWeight:700,color:clr,marginTop:4}}>{sc}</div>
                  <div style={{fontSize:7,color:clr}}>{lb}</div>
                  <div style={{fontSize:12,fontWeight:700,color:P.tx,marginTop:2}}>{d.aH||"--"}°</div>
                  <div style={{fontSize:9,color:P.txD}}>{d.aL||"--"}°</div>
                  {d.rain!==null&&<div style={{fontSize:7,color:d.rain>2?P.txD:P.gn,marginTop:2}}>{d.rain>0?`${d.rain}mm`:"Dry"}</div>}
                </div>})}
              </div>
            </div>
            {/* Expanded hourly breakdown for selected day */}
            {gDay>=0&&wxDays[gDay]&&<div style={{padding:"10px 12px",borderTop:`1px solid ${P.bd}`}}>
              <div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em",marginBottom:6}}>{wxDays[gDay].dn.toUpperCase()} HOURLY BREAKDOWN</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
                {wxDays[gDay].hrs.map(h=>{const sc=hrScore(h.hi||0,h.ws||8,h.cl||50,h.pr||1016,rv.q,rv.bq?.[beat]);return<div key={h.h} style={{textAlign:"center",flex:"1 0 auto",minWidth:26}}>
                  <div style={{fontSize:7,color:P.txD}}>{h.h}</div>
                  <div style={{width:24,height:24,borderRadius:4,background:hrClr(sc),opacity:sc>=35?1:0.4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:sc>=55?700:400,color:sc>=55?"#fff":P.txD,margin:"2px auto"}}>{sc>=35?sc:""}</div>
                  <div style={{fontSize:6,color:P.txD,marginTop:1}}>{h.air}°</div>
                </div>})}
              </div>
              {(()=>{const best=wxDays[gDay].hrs.reduce((a,b)=>{const sa=hrScore(a.hi||0,a.ws||8,a.cl||50,a.pr||1016,rv.q,rv.bq?.[beat]);const sb=hrScore(b.hi||0,b.ws||8,b.cl||50,b.pr||1016,rv.q,rv.bq?.[beat]);return sa>sb?a:b},wxDays[gDay].hrs[0]);const bsc=hrScore(best.hi||0,best.ws||8,best.cl||50,best.pr||1016,rv.q,rv.bq?.[beat]);return<div style={{marginTop:6,fontSize:10,color:P.txM}}>Best window: <span style={{fontWeight:700,color:hrClr(bsc)}}>{best.h}:00 — {bsc}% {hrLb(bsc)}</span> / Wind {best.ws||"--"}mph / Cloud {best.cl||"--"}%</div>})()}
            </div>}
          </Cd>}

          {/* Beat rules + method */}
          <Lb>BEAT RULES</Lb>
          <div style={{display:"flex",gap:3,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{METHODS.map(m=><button key={m.id} onClick={()=>setMethod(m.id)} style={{padding:"7px 10px",borderRadius:7,border:method===m.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:method===m.id?P.rustS:P.c1,color:method===m.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0,whiteSpace:"nowrap"}}>{m.l}</button>)}</div>
          <Cd accent style={{padding:14,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
              <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.15em",color:P.rust}}>RECOMMENDED</div><div style={{fontSize:16,fontWeight:700,color:P.tx,marginTop:3}}>{rig.a}</div></div>
              <div style={{textAlign:"center",flexShrink:0}}><div style={{fontSize:20,fontWeight:700,color:P.rust,lineHeight:1}}>{rig.c}%</div><div style={{fontSize:7,color:P.txD}}>CONF</div></div>
            </div>
            <div style={{fontSize:10,color:P.txM,lineHeight:1.5,fontStyle:"italic",marginBottom:8}}>{rig.why}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>{[{l:"Rod",v:rig.rod},{l:"Leader",v:rig.ldr},{l:"Tippet",v:rig.tip},{l:"Fly",v:rig.fly}].map((r,i)=><div key={i} style={{padding:"5px 7px",background:P.c2,borderRadius:4}}><div style={{fontSize:6,color:P.txD,letterSpacing:"0.1em"}}>{r.l.toUpperCase()}</div><div style={{fontSize:10,fontWeight:600,color:i===3?P.rust:P.tx,marginTop:2}}>{r.v}</div></div>)}</div>
            <div style={{marginTop:6,padding:"6px 7px",background:P.c2,borderRadius:4}}><div style={{fontSize:6,color:P.txD,letterSpacing:"0.1em"}}>GUIDE TIP</div><div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.5}}>{rig.guide}</div></div>
          </Cd>
          {topH&&topH.score>5&&<Cd style={{padding:14,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between"}}><div><Lb>HATCH OF THE DAY</Lb><div style={{fontSize:15,fontWeight:700,color:hC(topH.score)}}>{topH.cm}</div><div style={{fontSize:10,color:P.txD}}>Hook {topH.hk}</div></div><div style={{fontSize:22,fontWeight:700,color:hC(topH.score)}}>{topH.score}</div></div>
            {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).map(s=><div key={s.id} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",marginTop:4}}><span style={{fontSize:10,color:P.txM}}>{s.cm}</span><span style={{fontSize:10,fontWeight:700,color:hC(s.score)}}>{s.score}%</span></div>)}
          </Cd>}
          {dan&&<Cd style={{padding:14}}><div style={{display:"flex",justifyContent:"space-between"}}><div><Lb>MAYFLY TRACKER</Lb><div style={{fontSize:13,fontWeight:700,color:ds.c}}>{ds.s}</div><div style={{fontSize:9,color:P.txD,marginTop:3}}>Avg start: May 18-22 / Peak: Jun 1-7</div></div><div style={{fontSize:20,fontWeight:700,color:P.rust}}>{dan.score}%</div></div></Cd>}
        </div>}

        {/* DIAGNOSE */}
        {tab==="diagnose"&&<div>
          <Lb>WHAT'S HAPPENING?</Lb>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>{SC.map(sc=><button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)} style={{padding:"14px 10px",borderRadius:8,border:scenario===sc.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:scenario===sc.id?P.rustS:P.c1,color:scenario===sc.id?P.rust:P.tx,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}><div style={{fontSize:16,marginBottom:4}}>{sc.i}</div>{sc.l}</button>)}</div>
          {scenario&&<Cd>{SC.find(s=>s.id===scenario)?.a.map((a,i)=><div key={i} style={{padding:14,borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><div style={{fontSize:13,fontWeight:700,color:P.tx,flex:1,paddingRight:10}}>{a.h}</div><div style={{flexShrink:0}}><span style={{fontSize:16,fontWeight:700,color:a.c>=80?P.rust:a.c>=60?P.gn:P.txM}}>{a.c}%</span></div></div><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{a.d}</div></div>)}</Cd>}
        </div>}

        {/* HATCHES */}
        {tab==="hatches"&&<div><Cd>{spp.map(sp=><div key={sp.id} style={{padding:"9px 12px",borderBottom:`1px solid ${P.bd}`,background:sp.id==="danica"?P.rustS:"transparent"}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat]}}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:sp.id==="danica"?P.rust:P.tx}}>{sp.cm}</span><div style={{height:3,background:P.c2,borderRadius:2,marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${sp.score}%`,background:hC(sp.score),borderRadius:2}}/></div><div style={{fontSize:9,color:P.txD,marginTop:3}}>Hook {sp.hk} / {sp.sz} / {sp.tMn}-{sp.tMx}°C</div></div><div style={{textAlign:"right",minWidth:32}}><div style={{fontSize:16,fontWeight:700,color:hC(sp.score),lineHeight:1}}>{sp.score}</div><div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div></div></div></div>)}</Cd></div>}

        {/* FLY BOX */}
        {tab==="fly"&&<div>
          <div style={{background:P.rust+"15",border:`1px solid ${P.rust}33`,borderRadius:8,padding:"8px 10px",marginBottom:10}}><div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em"}}>CHECK BEAT REGULATIONS</div></div>
          <div style={{display:"flex",gap:4,marginBottom:10}}>{[{id:"dry",l:"Dries"},{id:"emerger",l:"Emergers"},{id:"nymph",l:"Nymphs"}].map(t=><button key={t.id} onClick={()=>{setFlyT(t.id);setOpenFly(null)}} style={{flex:1,padding:"9px",borderRadius:8,border:flyT===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyT===t.id?P.rustS:"transparent",color:flyT===t.id?P.rust:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>
          <Cd>{FLIES[flyT].map((f,i)=>{const isM=f.mt.some(m=>actIds.includes(m));const isOpen=openFly===f.nm;return<div key={i}>
            <div onClick={()=>setOpenFly(isOpen?null:f.nm)} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontSize:13,fontWeight:700,color:isM?P.rust:P.tx}}>{f.nm}</span>{isM&&<span style={{fontSize:7,fontWeight:700,color:P.rust,marginLeft:6,background:P.rustB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}<div style={{fontSize:10,color:P.txD,marginTop:2}}>#{f.sz}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{display:"flex",gap:2}}>{Array.from({length:f.ef},(_,j)=><div key={j} style={{width:4,height:4,borderRadius:2,background:isM?P.rust:P.txD}}/>)}</div>
                  <span style={{color:P.txD,fontSize:12}}>{isOpen?"−":"+"}</span>
                </div>
              </div>
            </div>
            {isOpen&&<div style={{padding:"12px",background:P.c2,borderBottom:`1px solid ${P.bd}`}}>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{f.nt}</div>
            </div>}
          </div>})}</Cd>
        </div>}

        {/* HOURLY */}
        {tab==="hourly"&&<div>{wxDays.length>0?<div>
          <div style={{display:"flex",gap:4,marginBottom:10,overflowX:"auto",paddingBottom:4}}>{wxDays.map((d,i)=><button key={i} onClick={()=>setHDay(i)} style={{padding:"5px 9px",borderRadius:5,border:hDay===i?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:hDay===i?P.rustS:P.c1,color:hDay===i?P.rust:P.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{d.dn}<br/><span style={{fontSize:8}}>{d.df}</span></button>)}</div>
          {wxDays[hDay]&&(()=>{const day=wxDays[hDay];const pk=day.hrs.reduce((a,b)=>(a.hi||0)>(b.hi||0)?a:b,day.hrs[0]);return<div>
            {/* Day summary */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
              {[{l:"HIGH / LOW",v:`${day.aH||"--"}° / ${day.aL||"--"}°`},{l:"RAIN",v:day.rain!==null?(day.rain>0?`${day.rain}mm`:"None"):"--"},{l:"WIND MAX",v:day.windMax?`${day.windMax}mph`:"--"},{l:"UV",v:day.uv!==null?`${day.uv}`:"--"}].map((s,i)=><div key={i} style={{background:P.c1,borderRadius:5,border:`1px solid ${P.bd}`,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:6,letterSpacing:"0.1em",color:P.txD}}>{s.l}</div><div style={{fontSize:11,fontWeight:600,color:P.tx,marginTop:2}}>{s.v}</div></div>)}
            </div>
            {day.sunrise&&<div style={{display:"flex",gap:12,marginBottom:10,fontSize:9,color:P.txD,justifyContent:"center"}}><span>Sunrise {day.sunrise}</span><span>Sunset {day.sunset}</span></div>}
            {/* Peak window */}
            <Cd accent style={{padding:12,marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em"}}>PEAK HATCH WINDOW</div><div style={{fontSize:13,color:P.tx,marginTop:2}}>{pk.h}:00 / Air {pk.air}° / Water ~{pk.wt}°C</div></div><div style={{fontSize:24,fontWeight:700,color:P.rust}}>{Math.round(pk.hi||0)}</div></div></Cd>
            {/* Hatch heat map */}
            <Cd style={{padding:12,marginBottom:10}}>
              <div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em",marginBottom:6}}>HATCH INTENSITY</div>
              <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{day.hrs.map(h=><div key={h.h} style={{textAlign:"center"}}><div style={{fontSize:6,color:P.txD,marginBottom:1}}>{h.h}</div><div style={{width:20,height:20,borderRadius:3,background:iC(h.hi||0),display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:(h.hi||0)>=2?P.bg:P.txD,fontWeight:(h.hi||0)>=4?700:400}}>{(h.hi||0)>=1?Math.round(h.hi):""}</div></div>)}</div>
            </Cd>
            {/* Hourly weather table */}
            <Cd style={{padding:0}}>
              <div style={{padding:"10px 12px 6px"}}><div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em"}}>HOURLY WEATHER</div></div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:10,minWidth:420}}>
                  <thead><tr style={{borderBottom:`1px solid ${P.bd}`}}>
                    {["HR","AIR","WIND","","RAIN","CLOUD","PRESS"].map((h,i)=><th key={i} style={{padding:"4px 6px",textAlign:"left",fontSize:7,letterSpacing:"0.08em",color:P.txD,fontWeight:600}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{day.hrs.filter((_,i)=>i%2===0).map(h=>{
                    const isPk=h.h===pk.h;
                    return<tr key={h.h} style={{borderBottom:`1px solid ${P.bd}`,background:isPk?P.rustS:"transparent"}}>
                      <td style={{padding:"6px",fontWeight:700,color:isPk?P.rust:P.tx}}>{h.h}:00</td>
                      <td style={{padding:"6px",color:P.tx}}>{h.air}°</td>
                      <td style={{padding:"6px",color:(h.ws||0)>15?P.rust:P.txM}}>{h.ws||"--"}</td>
                      <td style={{padding:"6px",color:P.txD,fontSize:8}}>{windDir(h.wd)}</td>
                      <td style={{padding:"6px",color:(h.rain||0)>30?P.txD:P.gn}}>{h.rain}%{(h.mm||0)>0?` ${h.mm}mm`:""}</td>
                      <td style={{padding:"6px",color:(h.cl||0)>70?P.gn:P.txD}}>{h.cl}%</td>
                      <td style={{padding:"6px",color:P.txD}}>{h.pr||"--"}</td>
                    </tr>})}</tbody>
                </table>
              </div>
            </Cd>
          </div>})()}</div>:<div style={{color:P.txM,fontSize:12}}>Weather data loads on deployment.</div>}</div>}

        {/* OUTLOOK */}
        {tab==="outlook"&&<div>
          <Cd>{lr.map((w,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}>
            <div style={{minWidth:68}}><div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div><div style={{fontSize:8,color:w.cf==="High"?P.gn:w.cf==="Med"?P.rust:P.txD,fontWeight:600}}>{w.cf}</div></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}><span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:28}}>Mayfly</span><div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span></div>
              <div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:8,color:P.gn,fontWeight:600,minWidth:28}}>All</span><div style={{flex:1,height:3,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.oa*10}%`,background:P.gn,borderRadius:2}}/></div><span style={{fontSize:8,fontWeight:600,color:P.gn,minWidth:22,textAlign:"right"}}>{w.oa}</span></div>
            </div><span style={{fontSize:9,color:P.txD}}>~{w.pt}°C</span>
          </div>)}</Cd>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:12}}>{[{l:"MAYFLY",v:ds.s},{l:"AVG START",v:"May 18-22"},{l:"PEAK",v:"Jun 1-7"},{l:"THIS YEAR",v:cT>13?"Warm":"On schedule"}].map((h,i)=><div key={i} style={{padding:10,background:P.c1,borderRadius:8,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,letterSpacing:"0.1em",color:P.txD}}>{h.l}</div><div style={{fontSize:12,fontWeight:700,color:P.rust,marginTop:3}}>{h.v}</div></div>)}</div>
        </div>}

        {/* REPORTS */}
        {tab==="reports"&&<div>
          {/* Submit session */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <Lb>LOG A SESSION</Lb>
            <button onClick={()=>setShowForm(!showForm)} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showForm?"CANCEL":"+ LOG SESSION"}</button>
          </div>

          {showForm&&<div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:14,marginBottom:14}}>
            <div style={{display:"grid",gap:8}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>YOUR NAME</div><input value={fName} onChange={e=>setFName(e.target.value)} placeholder="e.g. Josh" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
                <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>FISH CAUGHT</div><input value={fFish} onChange={e=>setFish(e.target.value)} placeholder="0" type="number" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
              </div>
              <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>BEAT</div>
                <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>setFBeat(b)} style={{padding:"4px 8px",borderRadius:4,border:fBeat===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fBeat===b?P.rustS:"transparent",color:fBeat===b?P.rust:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>BIGGEST FISH</div><input value={fBig} onChange={e=>setFBig(e.target.value)} placeholder="e.g. 2lb 4oz" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
                <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>BEST FLY</div><input value={fFly} onChange={e=>setFFly(e.target.value)} placeholder="e.g. CDC #16" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
              </div>
              <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>HATCHES SEEN</div><input value={fHatch} onChange={e=>setFHatch(e.target.value)} placeholder="e.g. LDO, Iron Blues, Hawthorn" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
              <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>RATING</div>
                <div style={{display:"flex",gap:4}}>{["Poor","Fair","Good","Excellent"].map(r=><button key={r} onClick={()=>setFRating(r)} style={{flex:1,padding:"7px 4px",borderRadius:5,border:fRating===r?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fRating===r?P.rustS:"transparent",color:fRating===r?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r}</button>)}</div>
              </div>
              <div><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>NOTES</div><textarea value={fNotes} onChange={e=>setFNotes(e.target.value)} placeholder="What happened on the river? Conditions, refusals, tips for others..." rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
              <button onClick={()=>{if(fBeat&&(fNotes||fFish)){const now=new Date();setSessions(p=>[{d:now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})+` ${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}`,name:fName||"Anon",bt:fBeat,fish:fFish||"0",big:fBig,fly:fFly,hatch:fHatch,rating:fRating,notes:fNotes,river:rv.n},...p]);setFName("");setFBeat("");setFish("");setFBig("");setFFly("");setFHatch("");setFNotes("");setFRating("");setShowForm(false)}}} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:P.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.05em"}}>SUBMIT SESSION LOG</button>
            </div>
          </div>}

          {/* User sessions */}
          {sessions.filter(s=>s.river===rv.n).length>0&&<div style={{marginBottom:14}}>
            <Lb>YOUR SESSIONS</Lb>
            <Cd style={{padding:"4px 12px"}}>{sessions.filter(s=>s.river===rv.n).map((s,i)=><div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${P.bd}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <div><span style={{fontSize:7,fontWeight:700,color:P.rust,border:`1px solid ${P.rustB}`,padding:"1px 5px",borderRadius:3}}>SESSION</span><span style={{fontSize:11,fontWeight:600,marginLeft:6}}>{s.bt}</span><span style={{fontSize:9,color:P.txD,marginLeft:6}}>{s.d}</span></div>
                {s.rating&&<span style={{fontSize:8,fontWeight:700,color:s.rating==="Excellent"?P.rust:s.rating==="Good"?P.gn:P.txM}}>{s.rating.toUpperCase()}</span>}
              </div>
              {s.name&&<div style={{fontSize:9,color:P.txM,marginBottom:4}}>By {s.name}</div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
                <div style={{background:P.c2,borderRadius:4,padding:"4px 6px"}}><div style={{fontSize:7,color:P.txD}}>CAUGHT</div><div style={{fontSize:14,fontWeight:700,color:P.tx}}>{s.fish}</div></div>
                {s.big&&<div style={{background:P.c2,borderRadius:4,padding:"4px 6px"}}><div style={{fontSize:7,color:P.txD}}>BIGGEST</div><div style={{fontSize:11,fontWeight:600,color:P.tx}}>{s.big}</div></div>}
                {s.fly&&<div style={{background:P.c2,borderRadius:4,padding:"4px 6px"}}><div style={{fontSize:7,color:P.txD}}>BEST FLY</div><div style={{fontSize:11,fontWeight:600,color:P.rust}}>{s.fly}</div></div>}
              </div>
              {s.hatch&&<div style={{fontSize:10,color:P.txM,marginBottom:4}}>Hatches: {s.hatch}</div>}
              {s.notes&&<div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>{s.notes}</div>}
            </div>)}</Cd>
          </div>}

          {/* Keeper/guide reports */}
          <Lb>RIVER REPORTS</Lb>
          {rpts.length>0?<Cd style={{padding:"4px 12px"}}>{rpts.map((r,i)=><div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${P.bd}`}}>
            <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
              <span style={{fontSize:7,fontWeight:700,color:srcC[r.src]||P.txM,border:`1px solid ${(srcC[r.src]||P.txM)}33`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span>
              <span style={{fontSize:11,fontWeight:600}}>{r.bt}</span><span style={{fontSize:9,color:P.txD}}>{r.d}</span>
              <span style={{marginLeft:"auto",fontSize:7,color:r.v?P.gn:P.txD,fontWeight:600}}>{r.v?"VERIFIED":"UNVERIFIED"}</span>
            </div><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{r.tx}</div><div style={{fontSize:9,color:P.txD,marginTop:2}}>{r.au}</div>
          </div>)}</Cd>:<Cd style={{padding:20,textAlign:"center"}}><span style={{fontSize:12,color:P.txM}}>No reports yet for this river.</span></Cd>}

          {/* Coming soon - web scraped */}
          <div style={{marginTop:14}}>
            <Lb>LIVE WEB REPORTS</Lb>
            <Cd style={{padding:20,textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:8}}>◇</div>
              <div style={{fontSize:13,fontWeight:700,color:P.tx,marginBottom:6}}>Coming soon</div>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>Automated reports scraped from fishing clubs, tackle shops, keeper blogs, and social media. Live intelligence from around the chalkstreams, updated daily.</div>
              <div style={{fontSize:10,color:P.txD,marginTop:10,display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
                {["Club websites","Tackle shop reports","Keeper blogs","Social media","Forum posts"].map(s=><span key={s} style={{padding:"3px 8px",border:`1px solid ${P.bd}`,borderRadius:4,fontSize:8}}>{s}</span>)}
              </div>
            </Cd>
          </div>

          <div style={{marginTop:10,padding:10,background:P.c1,borderRadius:8,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,color:P.txD,lineHeight:1.6}}>Session data is stored locally and will sync to your account when user accounts launch. Reports from keepers and guides are indicative. EA: Open Government Licence. Weather: Open-Meteo CC BY 4.0.</div></div>
        </div>}
      </div>

      <div style={{textAlign:"center",padding:"14px",borderTop:`1px solid ${P.bd}`}}><Wing s={24} c={P.txD} r/><div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginTop:4}}>EPHEMERA / Timely insight. Better days.</div><div style={{fontSize:7,color:P.txD,marginTop:3}}>{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>
        {[{id:"guide",l:"Guide",i:"◉"},{id:"hatches",l:"Hatches",i:"◎"},{id:"fly",l:"Flies",i:"◈"},{id:"hourly",l:"Hourly",i:"◔"},{id:"outlook",l:"Outlook",i:"◑"},{id:"reports",l:"Reports",i:"◇"},{id:"diagnose",l:"Diagnose",i:"⊕"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"9px 0 6px",border:"none",background:"none",color:tab===n.id?P.rust:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:13,lineHeight:1}}>{n.i}</div><div style={{fontSize:7,fontWeight:600,marginTop:2}}>{n.l}</div></button>)}
      </div>
    </div>
  );
}
