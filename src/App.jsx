import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══ EPHEMERA — A calm expert beside you ═══ */

/* Register service worker for offline support */
if(typeof window!=="undefined"&&"serviceWorker"in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}

/* Logo Mark + Wordmark — served from /public as actual image files */
const Logo=({s=24})=><img src="/logo-mark.svg" alt="Ephemera" width={s} height={s} style={{borderRadius:s*0.2}}/>;
const Wordmark=({w=120,dark=true})=><img src="/wordmark.svg" alt="EPHEMERA" width={w} height={Math.round(w*168/1054)} style={{display:"block",filter:dark?"invert(0.85) brightness(1.5)":"none"}}/>;

const D={bg:"#161E1B",c1:"#1B2421",c2:"#212C28",c3:"#283632",bd:"#2E3B36",tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",rust:"#C36A3D",gn:"#7A9E7E",rustS:"#C36A3D18",rustB:"#C36A3D40"};
const L={bg:"#F3F0E8",c1:"#FFFFFF",c2:"#EBE8E0",c3:"#E0DDD5",bd:"#D0CCC2",tx:"#1F2D2A",txM:"#5F6F7B",txD:"#8A948F",rust:"#C36A3D",gn:"#5A7A5E",rustS:"#C36A3D12",rustB:"#C36A3D30"};

/* ── SUPABASE ── */
const SB_URL="https://vjuhpnuiwhbxmnqrraqt.supabase.co";
const SB_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdWhwbnVpd2hieG1ucXJyYXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MTY3MDcsImV4cCI6MjA5NDA5MjcwN30.NkfQyKb1E4ijADieEmie3h0mmsRHJHOrhaH2dhMnmpA";
const sbHeaders={"Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=representation"};
async function sbInsert(table,data){try{const r=await fetch(`${SB_URL}/rest/v1/${table}`,{method:"POST",headers:sbHeaders,body:JSON.stringify(data)});return r.ok}catch{return false}}
async function sbSelect(table,query=""){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?${query}`,{headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`}});return r.ok?await r.json():[]}catch{return[]}}
async function sbUpdate(table,match,data){try{const r=await fetch(`${SB_URL}/rest/v1/${table}?${match}`,{method:"PATCH",headers:sbHeaders,body:JSON.stringify(data)});return r.ok}catch{return false}}

/* ── LOCAL STORAGE (fast fallback + local user state) ── */
const STORE_USER="eph_user";const STORE_SESSIONS="eph_sessions";const STORE_PREFS="eph_prefs";
const BETA_CODE="RIVERTEST";
function getUser(){try{return JSON.parse(localStorage.getItem(STORE_USER))}catch{return null}}
function setUser(u){localStorage.setItem(STORE_USER,JSON.stringify(u))}
function getSessions(){try{return JSON.parse(localStorage.getItem(STORE_SESSIONS))||[]}catch{return[]}}
function saveSessions(s){localStorage.setItem(STORE_SESSIONS,JSON.stringify(s))}
function getPrefs(){try{return JSON.parse(localStorage.getItem(STORE_PREFS))||{}}catch{return{}}}
function savePrefs(p){localStorage.setItem(STORE_PREFS,JSON.stringify(p))}
async function hashPw(pw){const enc=new TextEncoder().encode(pw+"eph_salt_2026");const buf=await crypto.subtle.digest("SHA-256",enc);return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("")}

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

/* ── UK RIVERS DATABASE — all regions ── */
const UK=[
  /* South West */
  {id:"exe",n:"River Exe",ea:"Exe",lat:50.87,lng:-3.52,q:7,rg:"South West",b:["Tiverton","Dulverton","Exebridge"]},
  {id:"taw",n:"River Taw",ea:"Taw",lat:50.99,lng:-3.95,q:7,rg:"South West",b:["Umberleigh","Chulmleigh"]},
  {id:"torridge",n:"River Torridge",ea:"Torridge",lat:50.95,lng:-4.18,q:6,rg:"South West",b:["Great Torrington","Sheepwash"]},
  {id:"lyn",n:"River Lyn",ea:"Lyn",lat:51.22,lng:-3.82,q:7,rg:"South West",b:["Lynmouth","Watersmeet"]},
  {id:"barle",n:"River Barle",ea:"Barle",lat:51.07,lng:-3.55,q:7,rg:"South West",b:["Dulverton","Withypool"]},
  {id:"camel",n:"River Camel",ea:"Camel",lat:50.56,lng:-4.83,q:6,rg:"South West",b:["Wadebridge","Bodmin"]},
  {id:"fowey",n:"River Fowey",ea:"Fowey",lat:50.40,lng:-4.65,q:6,rg:"South West",b:["Lostwithiel","Restormel"]},
  {id:"teign",n:"River Teign",ea:"Teign",lat:50.62,lng:-3.62,q:6,rg:"South West",b:["Chagford","Steps Bridge"]},
  {id:"dart",n:"River Dart",ea:"Dart",lat:50.48,lng:-3.70,q:7,rg:"South West",b:["Buckfastleigh","Dartmeet"]},
  {id:"avondevon",n:"River Avon (Devon)",ea:"Avon",lat:50.32,lng:-3.78,q:5,rg:"South West",b:["Aveton Gifford"]},
  {id:"axe",n:"River Axe",ea:"Axe",lat:50.75,lng:-3.03,q:5,rg:"South West",b:["Axminster"]},
  {id:"otter",n:"River Otter",ea:"Otter",lat:50.73,lng:-3.28,q:5,rg:"South West",b:["Ottery St Mary"]},
  {id:"frome_somerset",n:"River Frome (Somerset)",ea:"Frome",lat:51.23,lng:-2.32,q:5,rg:"South West",b:["Frome"]},
  {id:"brue",n:"River Brue",ea:"Brue",lat:51.15,lng:-2.70,q:4,rg:"South West",b:["Bruton"]},
  /* Wales */
  {id:"usk",n:"River Usk",ea:"Usk",lat:51.77,lng:-3.08,q:8,rg:"Wales",b:["Brecon","Crickhowell","Abergavenny"]},
  {id:"wye",n:"River Wye",ea:"Wye",lat:51.95,lng:-2.73,q:9,rg:"Wales",b:["Hay-on-Wye","Ross-on-Wye","Builth Wells","Rhayader"]},
  {id:"teifi",n:"River Teifi",ea:"Teifi",lat:52.10,lng:-4.32,q:7,rg:"Wales",b:["Newcastle Emlyn","Llandysul","Tregaron"]},
  {id:"towy",n:"River Towy",ea:"Towy",lat:51.88,lng:-4.00,q:7,rg:"Wales",b:["Llandeilo","Carmarthen"]},
  {id:"dee_wales",n:"River Dee (Wales)",ea:"Dee",lat:52.97,lng:-3.08,q:8,rg:"Wales",b:["Llangollen","Corwen","Bala"]},
  {id:"conwy",n:"River Conwy",ea:"Conwy",lat:53.12,lng:-3.82,q:6,rg:"Wales",b:["Betws-y-Coed","Llanrwst"]},
  {id:"mawddach",n:"River Mawddach",ea:"Mawddach",lat:52.78,lng:-3.88,q:6,rg:"Wales",b:["Dolgellau"]},
  {id:"dovey",n:"River Dovey",ea:"Dyfi",lat:52.58,lng:-3.75,q:6,rg:"Wales",b:["Machynlleth"]},
  {id:"irfon",n:"River Irfon",ea:"Irfon",lat:52.15,lng:-3.50,q:7,rg:"Wales",b:["Builth Wells"]},
  {id:"taff",n:"River Taff",ea:"Taff",lat:51.52,lng:-3.28,q:4,rg:"Wales",b:["Merthyr Tydfil","Pontypridd"]},
  /* Midlands */
  {id:"dove",n:"River Dove",ea:"Dove",lat:53.05,lng:-1.78,q:8,rg:"Midlands",b:["Dovedale","Hartington","Beresford"]},
  {id:"derwent_derbys",n:"River Derwent (Derbys)",ea:"Derwent",lat:53.05,lng:-1.52,q:7,rg:"Midlands",b:["Matlock","Baslow","Bamford"]},
  {id:"manifold",n:"River Manifold",ea:"Manifold",lat:53.10,lng:-1.82,q:7,rg:"Midlands",b:["Ilam","Wetton"]},
  {id:"wye_derbys",n:"River Wye (Derbys)",ea:"Wye",lat:53.25,lng:-1.72,q:7,rg:"Midlands",b:["Bakewell","Ashford"]},
  {id:"teme",n:"River Teme",ea:"Teme",lat:52.32,lng:-2.62,q:7,rg:"Midlands",b:["Ludlow","Tenbury Wells","Knighton"]},
  {id:"lugg",n:"River Lugg",ea:"Lugg",lat:52.12,lng:-2.80,q:6,rg:"Midlands",b:["Leominster","Presteigne"]},
  {id:"arrow",n:"River Arrow",ea:"Arrow",lat:52.22,lng:-2.92,q:5,rg:"Midlands",b:["Pembridge"]},
  /* North West */
  {id:"ribble",n:"River Ribble",ea:"Ribble",lat:53.87,lng:-2.30,q:7,rg:"North West",b:["Settle","Clitheroe","Ribchester"]},
  {id:"lune",n:"River Lune",ea:"Lune",lat:54.15,lng:-2.65,q:8,rg:"North West",b:["Kirkby Lonsdale","Tebay","Sedbergh"]},
  {id:"eden",n:"River Eden",ea:"Eden",lat:54.67,lng:-2.78,q:8,rg:"North West",b:["Appleby","Kirkby Stephen","Lazonby"]},
  {id:"derwent_cumbria",n:"River Derwent (Cumbria)",ea:"Derwent",lat:54.58,lng:-3.37,q:7,rg:"North West",b:["Cockermouth","Bassenthwaite"]},
  {id:"kent_river",n:"River Kent",ea:"Kent",lat:54.33,lng:-2.75,q:7,rg:"North West",b:["Kendal","Staveley"]},
  {id:"wenning",n:"River Wenning",ea:"Wenning",lat:54.10,lng:-2.52,q:5,rg:"North West",b:["Wennington"]},
  {id:"hodder",n:"River Hodder",ea:"Hodder",lat:53.92,lng:-2.50,q:6,rg:"North West",b:["Whitewell","Slaidburn"]},
  {id:"irwell",n:"River Irwell",ea:"Irwell",lat:53.50,lng:-2.28,q:4,rg:"North West",b:["Bury","Ramsbottom"]},
  /* North East */
  {id:"tyne_ne",n:"River Tyne",ea:"Tyne",lat:54.97,lng:-2.15,q:7,rg:"North East",b:["Hexham","Wylam","Corbridge"]},
  {id:"wear",n:"River Wear",ea:"Wear",lat:54.78,lng:-1.72,q:6,rg:"North East",b:["Bishop Auckland","Stanhope"]},
  {id:"tees",n:"River Tees",ea:"Tees",lat:54.55,lng:-2.10,q:7,rg:"North East",b:["Barnard Castle","Middleton"]},
  {id:"coquet",n:"River Coquet",ea:"Coquet",lat:55.33,lng:-1.72,q:7,rg:"North East",b:["Rothbury","Warkworth"]},
  {id:"north_tyne",n:"North Tyne",ea:"Tyne",lat:55.12,lng:-2.35,q:7,rg:"North East",b:["Bellingham","Kielder"]},
  {id:"south_tyne",n:"South Tyne",ea:"Tyne",lat:54.82,lng:-2.50,q:6,rg:"North East",b:["Alston","Haltwhistle"]},
  {id:"tweed",n:"River Tweed",ea:"Tweed",lat:55.60,lng:-2.32,q:9,rg:"North East",b:["Kelso","Coldstream","Peebles"]},
  {id:"till",n:"River Till",ea:"Till",lat:55.58,lng:-2.05,q:6,rg:"North East",b:["Wooler","Chillingham"]},
  /* Yorkshire */
  {id:"swale",n:"River Swale",ea:"Swale",lat:54.37,lng:-1.65,q:6,rg:"Yorkshire",b:["Richmond","Reeth"]},
  {id:"ure",n:"River Ure",ea:"Ure",lat:54.30,lng:-1.78,q:7,rg:"Yorkshire",b:["Leyburn","Hawes","Middleham"]},
  {id:"wharfe",n:"River Wharfe",ea:"Wharfe",lat:53.95,lng:-1.72,q:7,rg:"Yorkshire",b:["Bolton Abbey","Grassington","Burnsall"]},
  {id:"nidd",n:"River Nidd",ea:"Nidd",lat:54.02,lng:-1.55,q:6,rg:"Yorkshire",b:["Pateley Bridge","Knaresborough"]},
  {id:"aire",n:"River Aire",ea:"Aire",lat:53.88,lng:-2.02,q:5,rg:"Yorkshire",b:["Skipton","Malham"]},
  {id:"derbyshire_wye",n:"River Rye",ea:"Rye",lat:54.25,lng:-1.08,q:5,rg:"Yorkshire",b:["Helmsley"]},
  {id:"esk_yorks",n:"River Esk (Yorks)",ea:"Esk",lat:54.45,lng:-0.75,q:6,rg:"Yorkshire",b:["Whitby","Grosmont"]},
  {id:"derwent_yorks",n:"River Derwent (Yorks)",ea:"Derwent",lat:54.10,lng:-0.78,q:5,rg:"Yorkshire",b:["Malton","Stamford Bridge"]},
  {id:"costa",n:"Costa Beck",ea:"Costa",lat:54.22,lng:-0.82,q:7,rg:"Yorkshire",b:["Pickering"]},
  /* South East & East */
  {id:"itchensurrey",n:"River Wey",ea:"Wey",lat:51.23,lng:-0.67,q:5,rg:"South East",b:["Guildford","Farnham"]},
  {id:"mole",n:"River Mole",ea:"Mole",lat:51.25,lng:-0.33,q:4,rg:"South East",b:["Dorking","Leatherhead"]},
  {id:"medway",n:"River Medway",ea:"Medway",lat:51.17,lng:0.50,q:4,rg:"South East",b:["Tonbridge","Yalding"]},
  {id:"stour_kent",n:"River Stour (Kent)",ea:"Stour",lat:51.28,lng:1.05,q:4,rg:"South East",b:["Canterbury","Wye"]},
  {id:"rother",n:"River Rother",ea:"Rother",lat:51.00,lng:0.65,q:4,rg:"South East",b:["Robertsbridge"]},
  {id:"arun",n:"River Arun",ea:"Arun",lat:50.92,lng:-0.55,q:4,rg:"South East",b:["Arundel","Pulborough"]},
  {id:"loddon",n:"River Loddon",ea:"Loddon",lat:51.37,lng:-0.90,q:5,rg:"South East",b:["Twyford"]},
  {id:"colne",n:"River Colne",ea:"Colne",lat:51.70,lng:-0.47,q:5,rg:"South East",b:["Watford","Rickmansworth"]},
  {id:"lea",n:"River Lea",ea:"Lea",lat:51.80,lng:-0.10,q:4,rg:"South East",b:["Hertford","Broxbourne"]},
  {id:"ver",n:"River Ver",ea:"Ver",lat:51.75,lng:-0.35,q:5,rg:"South East",b:["St Albans","Redbourn"]},
  {id:"gade",n:"River Gade",ea:"Gade",lat:51.75,lng:-0.48,q:5,rg:"South East",b:["Hemel Hempstead"]},
  {id:"misbourne",n:"River Misbourne",ea:"Misbourne",lat:51.65,lng:-0.58,q:4,rg:"South East",b:["Amersham","Chalfont"]},
  /* Scotland */
  {id:"spey",n:"River Spey",ea:"Spey",lat:57.35,lng:-3.22,q:10,rg:"Scotland",b:["Grantown","Aberlour","Craigellachie"]},
  {id:"tay",n:"River Tay",ea:"Tay",lat:56.42,lng:-3.43,q:9,rg:"Scotland",b:["Pitlochry","Dunkeld","Perth"]},
  {id:"dee_scotland",n:"River Dee (Scotland)",ea:"Dee",lat:57.05,lng:-2.97,q:9,rg:"Scotland",b:["Banchory","Aboyne","Braemar"]},
  {id:"don_scotland",n:"River Don (Scotland)",ea:"Don",lat:57.17,lng:-2.48,q:7,rg:"Scotland",b:["Inverurie","Alford"]},
  {id:"findhorn",n:"River Findhorn",ea:"Findhorn",lat:57.55,lng:-3.63,q:7,rg:"Scotland",b:["Forres","Tomatin"]},
  {id:"deveron",n:"River Deveron",ea:"Deveron",lat:57.52,lng:-2.72,q:7,rg:"Scotland",b:["Huntly","Turriff"]},
  {id:"nith",n:"River Nith",ea:"Nith",lat:55.22,lng:-3.60,q:6,rg:"Scotland",b:["Dumfries","Thornhill"]},
  {id:"annan",n:"River Annan",ea:"Annan",lat:55.20,lng:-3.28,q:7,rg:"Scotland",b:["Moffat","Lockerbie"]},
  {id:"clyde",n:"River Clyde",ea:"Clyde",lat:55.68,lng:-3.78,q:5,rg:"Scotland",b:["Lanark","Biggar"]},
  {id:"esk_scotland",n:"Border Esk",ea:"Esk",lat:55.03,lng:-3.05,q:6,rg:"Scotland",b:["Langholm","Canonbie"]},
  {id:"helmsdale",n:"River Helmsdale",ea:"Helmsdale",lat:58.12,lng:-3.65,q:8,rg:"Scotland",b:["Helmsdale"]},
  {id:"oykel",n:"River Oykel",ea:"Oykel",lat:57.95,lng:-4.70,q:7,rg:"Scotland",b:["Oykel Bridge"]},
  {id:"shin",n:"River Shin",ea:"Shin",lat:57.97,lng:-4.38,q:7,rg:"Scotland",b:["Lairg"]},
  {id:"beauly",n:"River Beauly",ea:"Beauly",lat:57.47,lng:-4.47,q:7,rg:"Scotland",b:["Beauly"]},
  {id:"conon",n:"River Conon",ea:"Conon",lat:57.58,lng:-4.65,q:6,rg:"Scotland",b:["Conon Bridge"]},
  {id:"naver",n:"River Naver",ea:"Naver",lat:58.38,lng:-4.22,q:8,rg:"Scotland",b:["Bettyhill"]},
  {id:"thurso",n:"River Thurso",ea:"Thurso",lat:58.48,lng:-3.55,q:7,rg:"Scotland",b:["Halkirk"]},
  {id:"lochy",n:"River Lochy",ea:"Lochy",lat:56.85,lng:-5.08,q:7,rg:"Scotland",b:["Fort William"]},
  {id:"awe",n:"River Awe",ea:"Awe",lat:56.40,lng:-5.18,q:7,rg:"Scotland",b:["Taynuilt"]},
  {id:"earn",n:"River Earn",ea:"Earn",lat:56.35,lng:-3.62,q:6,rg:"Scotland",b:["Comrie","Crieff"]},
  {id:"teith",n:"River Teith",ea:"Teith",lat:56.22,lng:-4.08,q:6,rg:"Scotland",b:["Callander","Doune"]},
  {id:"tummel",n:"River Tummel",ea:"Tummel",lat:56.70,lng:-3.73,q:7,rg:"Scotland",b:["Pitlochry"]},
  {id:"ness",n:"River Ness",ea:"Ness",lat:57.48,lng:-4.23,q:7,rg:"Scotland",b:["Inverness"]},
  /* Stillwaters — trout lakes and reservoirs */
  {id:"rutland",n:"Rutland Water",ea:"",lat:52.65,lng:-0.68,q:8,rg:"Stillwater",b:["North Arm","South Arm","Dam"],p:"England's finest big-water stillwater. Rainbow and brown trout. Bank and boat. Buzzer fishing supreme."},
  {id:"grafham",n:"Grafham Water",ea:"",lat:52.30,lng:-0.32,q:8,rg:"Stillwater",b:["Dam","Church Bay","Savages Creek"],p:"Premier reservoir. Strong buzzer and sedge hatches. Big rainbows. Good bank fishing."},
  {id:"chew",n:"Chew Valley Lake",ea:"",lat:51.33,lng:-2.63,q:8,rg:"Stillwater",b:["Woodford","Herriott's Pool","Nunnery"],p:"Bristol Water reservoir. Excellent wild brown trout. Famous for buzzer fishing."},
  {id:"blagdon",n:"Blagdon Lake",ea:"",lat:51.33,lng:-2.70,q:8,rg:"Stillwater",b:["Dam","Green Lawn","Butcombe Bay"],p:"Historic stillwater. Where stillwater fly fishing began. Nymph fishing paradise."},
  {id:"bewl",n:"Bewl Water",ea:"",lat:51.07,lng:0.38,q:7,rg:"Stillwater",b:["Dam","Ferry Point","Tinkers"],p:"Kent/Sussex border reservoir. Bank and boat. Good hatches of sedge and buzzer."},
  {id:"eyebrook",n:"Eyebrook Reservoir",ea:"",lat:52.52,lng:-0.82,q:7,rg:"Stillwater",b:["Dam","Stoke Dry"],p:"Small reservoir with big fish. Excellent sedge hatches. Intimate water."},
  {id:"draycote",n:"Draycote Water",ea:"",lat:52.33,lng:-1.33,q:7,rg:"Stillwater",b:["Dam","Toft","Farborough"],p:"Warwickshire reservoir. Good rainbow fishing. Bank and boat."},
  {id:"llyn_brenig",n:"Llyn Brenig",ea:"",lat:53.05,lng:-3.55,q:7,rg:"Stillwater",b:["Dam","North Shore"],p:"Welsh upland reservoir. Wild brown trout. Beautiful setting."},
  {id:"lake_vyrnwy",n:"Lake Vyrnwy",ea:"",lat:52.78,lng:-3.47,q:7,rg:"Stillwater",b:["Dam","Tower"],p:"Iconic Welsh reservoir. Wild brown trout in stunning scenery."},
  {id:"pitsford",n:"Pitsford Reservoir",ea:"",lat:52.32,lng:-0.88,q:6,rg:"Stillwater",b:["Dam","Fishing Lodge"],p:"Northampton reservoir. Good buzzer fishing. Consistent sport."},
  {id:"ravensthorpe",n:"Ravensthorpe Reservoir",ea:"",lat:52.33,lng:-1.03,q:6,rg:"Stillwater",b:["Dam"],p:"Small Northants water. Intimate fishing. Good for beginners."},
  {id:"loch_leven",n:"Loch Leven",ea:"",lat:56.20,lng:-3.38,q:9,rg:"Stillwater",b:["Boat only"],p:"Scotland's most famous trout loch. Wild brown trout. Boat fishing. Legendary hatches."},
  {id:"menteith",n:"Lake of Menteith",ea:"",lat:56.17,lng:-4.28,q:7,rg:"Stillwater",b:["Boat only"],p:"Scotland's only lake (not loch). Rainbow and brown. Sheltered boat fishing."},
  {id:"hanningfield",n:"Hanningfield Reservoir",ea:"",lat:51.63,lng:0.52,q:6,rg:"Stillwater",b:["Dam","South Bank"],p:"Essex reservoir. Good rainbow trout fishing close to London."},
  {id:"farmoor",n:"Farmoor Reservoir",ea:"",lat:51.75,lng:-1.35,q:5,rg:"Stillwater",b:["Farmoor I","Farmoor II"],p:"Two concrete bowls near Oxford. Consistent stocked rainbow fishing."},
];

/* Merge: premium chalkstreams + UK rivers */
const ALL_RV=[...RV,...UK.map(r=>({...r,p:r.p||`${r.rg} river. Weather and hatch data available.`,b:r.b||[],bq:r.bq||{},premium:false}))];
RV.forEach(r=>r.premium=true);
const REGIONS=[...new Set(UK.map(r=>r.rg))].sort();

/* ── BEAT GPS COORDINATES ── */
const BL={
  /* River Test — downstream to upstream */
  "test:Broadlands":{lat:50.947,lng:-1.497},"test:Nursling":{lat:50.960,lng:-1.467},
  "test:Timsbury":{lat:51.003,lng:-1.477},"test:Mottisfont":{lat:51.038,lng:-1.492},
  "test:Horsebridge":{lat:51.065,lng:-1.503},"test:Park Stream":{lat:51.075,lng:-1.508},
  "test:Stockbridge":{lat:51.087,lng:-1.508},"test:Leckford":{lat:51.107,lng:-1.503},
  "test:Longparish":{lat:51.142,lng:-1.430},"test:Whitchurch":{lat:51.157,lng:-1.337},
  "test:Laverstoke":{lat:51.162,lng:-1.307},
  /* River Itchen */
  "itchen:Twyford":{lat:51.017,lng:-1.327},"itchen:Abbotts Barton":{lat:51.072,lng:-1.312},
  "itchen:Easton":{lat:51.088,lng:-1.302},"itchen:Martyr Worthy":{lat:51.097,lng:-1.292},
  "itchen:Itchen Abbas":{lat:51.107,lng:-1.278},
  /* River Kennet */
  "kennet:Kintbury":{lat:51.400,lng:-1.440},"kennet:Hungerford":{lat:51.413,lng:-1.515},
  "kennet:Littlecote":{lat:51.423,lng:-1.540},"kennet:Ramsbury":{lat:51.437,lng:-1.590},
  "kennet:Marlborough":{lat:51.420,lng:-1.728},
  /* River Lambourn */
  "lambourn:Great Shefford":{lat:51.472,lng:-1.478},"lambourn:Upper Lambourn":{lat:51.520,lng:-1.535},
  /* Hampshire Avon */
  "avon:Salisbury":{lat:51.068,lng:-1.798},"avon:Amesbury":{lat:51.170,lng:-1.770},
  "avon:Netheravon":{lat:51.225,lng:-1.780},"avon:Upavon":{lat:51.265,lng:-1.782},
  /* River Wylye */
  "wylye:Codford":{lat:51.153,lng:-2.058},"wylye:Heytesbury":{lat:51.163,lng:-2.085},
  /* River Anton */
  "anton:Anton Lakes":{lat:51.195,lng:-1.487},"anton:Goodworth Clatford":{lat:51.160,lng:-1.498},
  /* River Meon */
  "meon:Droxford":{lat:50.937,lng:-1.133},"meon:East Meon":{lat:50.975,lng:-1.058},
  /* Chess */
  "chess:Rickmansworth":{lat:51.638,lng:-0.475},"chess:Nr. Sarratt":{lat:51.665,lng:-0.510},
  "chess:Latimer":{lat:51.680,lng:-0.537},"chess:Chesham":{lat:51.705,lng:-0.610},
  /* Darent */
  "darent:Eynsford":{lat:51.370,lng:0.202},"darent:Shoreham":{lat:51.342,lng:0.187},
  /* Wye (Wales) */
  "wye:Rhayader":{lat:52.298,lng:-3.510},"wye:Builth Wells":{lat:52.157,lng:-3.405},
  "wye:Hay-on-Wye":{lat:52.073,lng:-3.122},"wye:Ross-on-Wye":{lat:51.912,lng:-2.577},
  /* Usk */
  "usk:Brecon":{lat:51.945,lng:-3.395},"usk:Crickhowell":{lat:51.858,lng:-3.137},
  "usk:Abergavenny":{lat:51.822,lng:-3.022},
  /* Dee (Wales) */
  "dee_wales:Bala":{lat:52.910,lng:-3.593},"dee_wales:Corwen":{lat:52.980,lng:-3.378},
  "dee_wales:Llangollen":{lat:52.970,lng:-3.168},
  /* Dove */
  "dove:Beresford":{lat:53.115,lng:-1.808},"dove:Hartington":{lat:53.105,lng:-1.805},
  "dove:Dovedale":{lat:53.055,lng:-1.775},
  /* Ribble */
  "ribble:Settle":{lat:54.068,lng:-2.278},"ribble:Clitheroe":{lat:53.870,lng:-2.390},
  "ribble:Ribchester":{lat:53.820,lng:-2.528},
  /* Eden */
  "eden:Kirkby Stephen":{lat:54.472,lng:-2.348},"eden:Appleby":{lat:54.580,lng:-2.488},
  "eden:Lazonby":{lat:54.737,lng:-2.698},
  /* Lune */
  "lune:Sedbergh":{lat:54.322,lng:-2.525},"lune:Tebay":{lat:54.437,lng:-2.590},
  "lune:Kirkby Lonsdale":{lat:54.197,lng:-2.597},
  /* Wharfe */
  "wharfe:Burnsall":{lat:54.045,lng:-1.935},"wharfe:Grassington":{lat:54.067,lng:-1.998},
  "wharfe:Bolton Abbey":{lat:53.985,lng:-1.885},
  /* Tweed */
  "tweed:Peebles":{lat:55.652,lng:-3.188},"tweed:Coldstream":{lat:55.648,lng:-2.248},
  "tweed:Kelso":{lat:55.598,lng:-2.432},
  /* Tyne */
  "tyne_ne:Corbridge":{lat:54.968,lng:-2.020},"tyne_ne:Hexham":{lat:54.972,lng:-2.098},
  "tyne_ne:Wylam":{lat:54.975,lng:-1.815},
  /* Spey */
  "spey:Grantown":{lat:57.330,lng:-3.610},"spey:Aberlour":{lat:57.468,lng:-3.228},
  "spey:Craigellachie":{lat:57.453,lng:-3.182},
  /* Tay */
  "tay:Perth":{lat:56.395,lng:-3.430},"tay:Dunkeld":{lat:56.565,lng:-3.582},
  "tay:Pitlochry":{lat:56.707,lng:-3.732},
  /* Dee (Scotland) */
  "dee_scotland:Braemar":{lat:57.005,lng:-3.397},"dee_scotland:Aboyne":{lat:57.075,lng:-2.783},
  "dee_scotland:Banchory":{lat:57.055,lng:-2.498},
  /* Stillwaters */
  "rutland:North Arm":{lat:52.665,lng:-0.680},"rutland:South Arm":{lat:52.638,lng:-0.655},
  "rutland:Dam":{lat:52.640,lng:-0.720},
  "grafham:Dam":{lat:52.292,lng:-0.325},"grafham:Church Bay":{lat:52.307,lng:-0.322},
  "grafham:Savages Creek":{lat:52.312,lng:-0.300},
  "chew:Woodford":{lat:51.342,lng:-2.618},"chew:Herriott's Pool":{lat:51.330,lng:-2.635},
  "chew:Nunnery":{lat:51.325,lng:-2.648},
  "blagdon:Dam":{lat:51.332,lng:-2.698},"blagdon:Green Lawn":{lat:51.330,lng:-2.712},
  "blagdon:Butcombe Bay":{lat:51.338,lng:-2.720},
};

const STORE_FAVS="eph_favs";
function getFavs(){try{return JSON.parse(localStorage.getItem(STORE_FAVS))||[]}catch{return[]}}
function saveFavs(f){localStorage.setItem(STORE_FAVS,JSON.stringify(f))}

/* ── HATCH DATA ── */
const H=[
  {id:"danica",cm:"Mayfly",cat:"m",t:1,s:135,e:172,tMn:12,tMx:18,pk:[13,14,15,16,17],hk:"10-12 LD",sz:"20-25mm",avgS:139},
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
    {nm:"F Fly",sz:"14-18",mt:["ldo","mo","bwo"],cf:"High confidence",nt:"CDC wing, thread body. Does everything."},
    {nm:"Parachute Adams",sz:"14-18",mt:["ldo","mo","bwo"],cf:"Search pattern",nt:"Easier to see than standard Adams. White post."},
    {nm:"Goddard Caddis",sz:"12-16",mt:["sedge"],cf:"Evening essential",nt:"Deer hair caddis. Unsinkable. Skate it."},
    {nm:"Griffith's Gnat",sz:"20-24",mt:["smut","bg"],cf:"Last resort",nt:"Peacock herl and grizzle hackle. For midge feeders."},
    {nm:"Grey Duster",sz:"14-18",mt:["ldo","mo","pw"],cf:"Search pattern",nt:"Badger hackle, rabbit body. Old school and effective."},
    {nm:"Greenwell's Glory",sz:"14-16",mt:["ldo","mo"],cf:"High confidence",nt:"Waxed olive thread. One of the oldest chalkstream patterns."},
    {nm:"Tup's Indispensable",sz:"14-16",mt:["pw","mo"],cf:"Good match",nt:"Pink thorax, cream body. Pale watery and spinner."},
    {nm:"Daddy Long Legs",sz:"8-12",mt:["haw"],cf:"Autumn essential",nt:"Crane fly. Big mouthful. September gold."},
    {nm:"Flying Ant",sz:"14-18",mt:["bg"],cf:"Opportunistic",nt:"Ant falls are rare but devastating. Fish gorge."},
    {nm:"Black Ant",sz:"16-18",mt:["bg"],cf:"Windy day pick",nt:"Wind blows ants onto the water. Fish the lee bank."},
    {nm:"Beetle (Coch-y-bondhu)",sz:"14-16",mt:["haw","bg"],cf:"Terrestrial",nt:"Peacock herl body. Classic beetle imitation."},
    {nm:"Black Beetle",sz:"14-18",mt:["bg"],cf:"Windy day pick",nt:"Foam back, black body. Land it with a splat."},
    {nm:"Hawthorn Fly",sz:"12-14",mt:["haw"],cf:"Seasonal",nt:"Trailing legs are the key. April-May on warm days."},
    {nm:"Wickham's Fancy",sz:"14-16",mt:["ldo","mo","bg"],cf:"Attractor",nt:"Gold body, palmered hackle. When nothing else works."},
    {nm:"Blue Upright",sz:"14-16",mt:["ldo","ib"],cf:"Good match",nt:"Classic sparse dry. Dark and deadly."},
    {nm:"Alder Fly",sz:"12-14",mt:["sedge"],cf:"Seasonal",nt:"Dark winged. Fish go mad for them."},
    {nm:"Red Ant",sz:"16-18",mt:["bg"],cf:"Windy day pick",nt:"Cinnamon body. Wind drops them on the water."},
    {nm:"Drone Fly",sz:"12-14",mt:["bg"],cf:"Opportunistic",nt:"Bee-like. Fish take them confidently."},
    {nm:"Terry's Terror",sz:"14-16",mt:["ldo","mo"],cf:"Search pattern",nt:"Peacock herl body, versatile. Works on everything."},
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
function hInt(wt,hr){if(hr<5||hr>=22)return 0;let hi=0;H.forEach(sp=>{if(DOY<sp.s-10||DOY>sp.e+10)return;let sf=0;if(DOY>=sp.s&&DOY<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((DOY-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}
function hatchesAtHr(wt,hr){return H.filter(sp=>{if(DOY<sp.s-7||DOY>sp.e+7)return false;if(!sp.pk.includes(hr)&&!sp.pk.includes(hr-1)&&!sp.pk.includes(hr+1))return false;return wt>=sp.tMn-2&&wt<=sp.tMx+2}).sort((a,b)=>b.t-a.t).slice(0,3)}

const hC=s=>s>70?D.gn:s>40?D.rust:s>15?D.txM:D.txD;
const windDir=d=>{const dirs=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];return dirs[Math.round(d/22.5)%16]};
const scClr=s=>s>=75?D.gn:s>=55?D.rust:s>=35?D.txM:D.txD;
const scLb=s=>s>=90?"Exceptional":s>=75?"Excellent":s>=55?"Good":s>=35?"Fair":"Poor";
const HOUR=new Date().getHours();const isNight=HOUR<5||HOUR>=22;

/* ── SCORING with transparency ── */
function condScore(wind,press,cloud,wt,hIdx,rq,bq){
  if(isNight)return{pct:0,label:"Night",clr:D.txD,why:"No fishing activity at night."};
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
    else if(hr<=18)note=hi>=2?"Late activity. BWO possible. Watch for spinner falls.":"Waiting for the evening rise. Spinner falls can start any time.";
    else note=hi>=3?"Evening rise underway. Spinner falls — fish sipping spent flies in the film.":hi>=1?"Sedge chance if warm enough. Try skating an Elk Hair Caddis.":"Cooling off. Day winding down.";
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
  /* Mayfly afternoon + spinner fall */
  const dan=spp.find(s=>s.id==="danica");
  if(dan&&dan.score>15){n.push("Mayfly most likely from early afternoon. Watch for spinner falls from 7pm — fish sipping spent flies in the film.");if(wt>=14)n.push("Warm enough for a strong hatch. Emergers first, then switch to a Grey Wulff when duns appear.")}
  /* BWO evening */
  if(wt>=12&&spp.find(s=>s.id==="bwo"&&s.score>20))n.push("BWO possible from late afternoon. Evening spinner fall can produce the best fishing of the day.");
  if(wt>=13&&spp.find(s=>s.id==="sedge"&&s.score>15))n.push("Evening sedge activity likely if it stays warm. Elk Hair Caddis skated on the surface.");
  /* Terrestrials */
  if(cW>12&&wt>=12)n.push("Wind will blow terrestrials onto the water — try ants and beetles on the lee bank.");
  if(wt<11)n.push("Water still cool. Nymphing will outperform dries until it warms.");
  if(!n.length)n.push("Conditions settled. Fish the hatches as they come.");
  return n.slice(0,4);
}

/* ── 8-WEEK OUTLOOK ── */
function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),cf:w<2?"High":w<4?"Med":"Low"}})}

/* ── FUTURE DAY GUIDE: full predictions for a forecast day ── */
function futureDayGuide(dayData,dayIdx,wt,rv,beat,method){
  if(!dayData||!dayData.hrs||!dayData.hrs.length)return null;
  const futDoy=DOY+dayIdx;
  /* Predict hatches for that day */
  const futSpp=H.map(sp=>{let sF=0;if(futDoy>=sp.s&&futDoy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=Math.max(0,1-((futDoy-m)/r)**2)}else if(futDoy>=sp.s-14&&futDoy<sp.s)sF=(futDoy-sp.s+14)/28;const avgT=dayData.hrs.reduce((s,h)=>s+(h.wt||wt),0)/dayData.hrs.length;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(avgT>=sp.tMn&&avgT<=sp.tMx)tF=Math.max(0,1-((avgT-tm)/(tr*1.2))**2);else if(avgT>=sp.tMn-2)tF=Math.max(0,(avgT-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score);
  /* Top hatch for this future day */
  const topH=futSpp[0];
  /* Avg conditions */
  const midHrs=dayData.hrs.filter(h=>h.h>=10&&h.h<=16);
  const avgWind=midHrs.length?Math.round(midHrs.reduce((s,h)=>s+(h.ws||5),0)/midHrs.length):8;
  const avgCloud=midHrs.length?Math.round(midHrs.reduce((s,h)=>s+(h.cl||50),0)/midHrs.length):50;
  const avgWt=midHrs.length?+(midHrs.reduce((s,h)=>s+(h.wt||wt),0)/midHrs.length).toFixed(1):wt;
  /* Build rig */
  const rig=buildRig(avgWt,avgWind,avgCloud,method,topH);
  /* Timeline */
  const tl=buildTimeline(dayData.hrs,wt);
  /* Anticipation */
  const antic=buildAntic(avgWind,avgCloud,1013,avgWt,futSpp);
  /* Best window */
  const bestHr=tl.reduce((best,e)=>e.hi>best.hi?e:best,{hi:0,hr:0,note:""});
  return{futSpp,topH,avgWind,avgCloud,avgWt,rig,tl,antic,bestHr};
}

/* ── SESSION TIMER ── */
function fmtDur(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);if(h>0)return`${h}h ${m%60}m`;return`${m}m`}

/* ═══ APP ═══ */
export default function App(){
  /* AUTH */
  const[user,setUserState]=useState(()=>getUser());
  const[authStep,setAuthStep]=useState("beta");/* beta → register → confirm → signin → reset → done */
  const[authName,setAuthName]=useState("");const[authEmail,setAuthEmail]=useState("");
  const[authPw,setAuthPw]=useState("");const[authPw2,setAuthPw2]=useState("");
  const[betaCode,setBetaCode]=useState("");const[betaErr,setBetaErr]=useState("");
  const[authErr,setAuthErr]=useState("");
  const[optNewsletter,setOptNewsletter]=useState(true);const[optBeta,setOptBeta]=useState(true);
  const[confirmCode,setConfirmCode]=useState("");const[confirmErr,setConfirmErr]=useState("");
  const[resetSent,setResetSent]=useState(false);
  const[showFeedback,setShowFeedback]=useState(false);
  const[fbRating,setFbRating]=useState(0);const[fbBest,setFbBest]=useState("");
  const[fbWorse,setFbWorse]=useState("");const[fbFeature,setFbFeature]=useState("");const[fbSubmitted,setFbSubmitted]=useState(false);
  const register=async()=>{
    if(!authName.trim()||!authEmail.trim()){setAuthErr("Name and email required.");return}
    if(authPw.length<6){setAuthErr("Password must be 6+ characters.");return}
    if(authPw!==authPw2){setAuthErr("Passwords don't match.");return}
    if(!authEmail.includes("@")){setAuthErr("Enter a valid email.");return}
    setAuthErr("Creating account...");
    const pwHash=await hashPw(authPw);
    const email=authEmail.trim().toLowerCase();
    /* Check if email already exists */
    const existing=await sbSelect("signups",`email=eq.${encodeURIComponent(email)}&select=email`);
    if(existing&&existing.length>0){setAuthErr("Email already registered. Try signing in.");return}
    /* Write to Supabase */
    const ok=await sbInsert("signups",{name:authName.trim(),email,pw_hash:pwHash,newsletter:optNewsletter,beta_tester:optBeta,confirmed:false,beta_code:BETA_CODE});
    if(!ok){setAuthErr("Signup failed — check your connection and try again.");return}
    const code=String(100000+Math.floor(((email.length*7+authName.length*13)%900000))).slice(0,6);
    const u={name:authName.trim(),email,pwHash,joined:new Date().toISOString(),newsletter:optNewsletter,betaTester:optBeta,confirmed:false,confirmCode:code};
    setUser(u);setUserState(u);setAuthStep("confirm");setAuthErr("");
  };
  const signIn=async()=>{
    if(!authEmail.trim()||!authPw){setAuthErr("Email and password required.");return}
    setAuthErr("Signing in...");
    const email=authEmail.trim().toLowerCase();
    const pwHash=await hashPw(authPw);
    const rows=await sbSelect("signups",`email=eq.${encodeURIComponent(email)}&select=*`);
    if(!rows||rows.length===0){setAuthErr("No account found. Create one first.");return}
    const row=rows[0];
    if(row.pw_hash!==pwHash){setAuthErr("Wrong password.");return}
    const u={name:row.name,email:row.email,pwHash:row.pw_hash,joined:row.created_at,newsletter:row.newsletter,betaTester:row.beta_tester,confirmed:row.confirmed};
    setUser(u);setUserState(u);
    if(!row.confirmed){setAuthStep("confirm");u.confirmCode=String(100000+Math.floor(((email.length*7+row.name.length*13)%900000))).slice(0,6);setUser(u);setUserState(u)}
    setAuthErr("");
    /* Load their sessions from Supabase */
    const remoteSessions=await sbSelect("sessions",`user_email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=50`);
    if(remoteSessions&&remoteSessions.length>0){const mapped=remoteSessions.map(s=>({id:s.id,d:new Date(s.created_at).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(s.created_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),river:s.river,beat:s.beat,fish:s.fish||0,big:s.biggest,fly:s.best_fly,notes:s.notes,rating:s.rating,dur:s.duration||"",user:s.user_name,score:s.score,topHatch:s.top_hatch}));setSessions(mapped);saveSessions(mapped)}
  };
  const confirmAccount=async()=>{
    if(confirmCode===user?.confirmCode||confirmCode==="000000"){
      const u={...user,confirmed:true};setUser(u);setUserState(u);setConfirmErr("");
      await sbUpdate("signups",`email=eq.${encodeURIComponent(user.email)}`,{confirmed:true});
    }else{setConfirmErr("Invalid code. Use 000000 for beta.")}
  };
  const logout=()=>{localStorage.removeItem(STORE_USER);setUserState(null);setAuthStep("beta")};
  const resetPassword=async()=>{
    if(!authEmail.trim()){setAuthErr("Enter your email address.");return}
    if(authPw.length<6){setAuthErr("New password must be 6+ characters.");return}
    if(authPw!==authPw2){setAuthErr("Passwords don't match.");return}
    setAuthErr("Resetting...");
    const email=authEmail.trim().toLowerCase();
    const rows=await sbSelect("signups",`email=eq.${encodeURIComponent(email)}&select=email`);
    if(!rows||rows.length===0){setAuthErr("No account found with that email.");return}
    const pwHash=await hashPw(authPw);
    const ok=await sbUpdate("signups",`email=eq.${encodeURIComponent(email)}`,{pw_hash:pwHash});
    if(!ok){setAuthErr("Reset failed. Try again or email ephemeraguideapp@gmail.com");return}
    setResetSent(true);setAuthErr("");
  };
  const submitFeedback=async()=>{
    await sbInsert("feedback",{user_email:user?.email,user_name:user?.name,rating:fbRating,best:fbBest,worse:fbWorse,feature:fbFeature});
    setFbSubmitted(true);
  };

  /* CORE STATE */
  const[riv,setRiv]=useState(()=>getPrefs().lastRiver||"test");
  const[beat,setBeat]=useState(()=>getPrefs().lastBeat||"Stockbridge");
  const[tab,setTab]=useState("guide");const[pick,setPick]=useState(false);const[gDay,setGDay]=useState(-1);
  const[live,setLive]=useState({});const[light,setLight]=useState(()=>getPrefs().light||false);
  const[scenario,setScenario]=useState(null);const[method,setMethod]=useState("dry");
  const[flyT,setFlyT]=useState("dry");const[openFly,setOpenFly]=useState(null);
  const[ex,setEx]=useState({});const toggle=k=>setEx(p=>({...p,[k]:!p[k]}));
  const[riverSearch,setRiverSearch]=useState("");
  const[regionFilter,setRegionFilter]=useState("");
  const[favs,setFavs]=useState(()=>getFavs());
  const toggleFav=(id)=>{const nf=favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];setFavs(nf);saveFavs(nf)};
  const[advanced,setAdvanced]=useState(false);
  const[customBeat,setCustomBeat]=useState("");

  /* SESSION TRACKING — quick snap, log later */
  const[sessions,setSessions]=useState(()=>getSessions());
  const[showForm,setShowForm]=useState(false);
  const[onRiver,setOnRiver]=useState(false);
  const[sessionStart,setSessionStart]=useState(null);
  const[sessionSnaps,setSessionSnaps]=useState([]);/* {id,photo,timestamp,species,weight,fly,wild,notes,analysis} */
  const[sessionNotes,setSessionNotes]=useState("");
  const[sessionTick,setSessionTick]=useState(0);
  const[sessionTrack,setSessionTrack]=useState([]);/* GPS points [{lat,lng,time,label}] */
  const[showSessionMap,setShowSessionMap]=useState(false);
  const[recovered,setRecovered]=useState(false);
  const[gallery,setGallery]=useState(null);/* {items:[{src,type,caption}], idx:0} */
  const[speaking,setSpeaking]=useState(false);
  const[listening,setListening]=useState(false);const[voiceResult,setVoiceResult]=useState("");
  const[riverAnalysis,setRiverAnalysis]=useState(null);const[riverAnalyzing,setRiverAnalyzing]=useState(false);
  const riverPhotoRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(riverPhotoRef){riverPhotoRef.type="file";riverPhotoRef.accept="image/*"}
  const[reviewing,setReviewing]=useState(false);/* end-of-session review screen */
  const[sessionPublic,setSessionPublic]=useState(false);
  const[analyzing,setAnalyzing]=useState(null);/* snap id being analyzed */
  const[sessionSummary,setSessionSummary]=useState("");
  const[flyIdMode,setFlyIdMode]=useState(false);/* fly identification mode */
  const[flyAnalysis,setFlyAnalysis]=useState(null);
  const[flyQ,setFlyQ]=useState({size:"",colour:"",behaviour:""});
  const[flyAnalyzing,setFlyAnalyzing]=useState(false);
  const[flyBoxScan,setFlyBoxScan]=useState(null);const[flyBoxScanning,setFlyBoxScanning]=useState(false);
  const[archiveOverview,setArchiveOverview]=useState("");const[archiveLoading,setArchiveLoading]=useState(false);
  const[expandedSession,setExpandedSession]=useState(null);
  const[hatchObs,setHatchObs]=useState({});/* {hatchId: "yes"|"no"|"unsure"} */
  const[mapsKey,setMapsKey]=useState(null);const[mapsLoaded,setMapsLoaded]=useState(false);
  const fileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(fileRef){fileRef.type="file";fileRef.accept="image/*";fileRef.setAttribute("capture","environment")}
  const flyFileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(flyFileRef){flyFileRef.type="file";flyFileRef.accept="image/*";flyFileRef.setAttribute("capture","environment")}
  const uploadRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(uploadRef){uploadRef.type="file";uploadRef.accept="image/*";uploadRef.multiple=true}

  /* EXIF timestamp extraction — reads JPEG binary for DateTimeOriginal */
  const extractExifTime=(file)=>new Promise(res=>{
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const view=new DataView(reader.result);
        if(view.getUint16(0)!==0xFFD8){res(null);return}/* not JPEG */
        let offset=2;
        while(offset<view.byteLength-2){
          const marker=view.getUint16(offset);
          if(marker===0xFFE1){/* APP1 = EXIF */
            const len=view.getUint16(offset+2);
            const exifStart=offset+10;
            const le=view.getUint16(exifStart)===0x4949;/* little endian */
            const g=(o,s)=>le?(s===2?view.getUint16(o,true):view.getUint32(o,true)):(s===2?view.getUint16(o):view.getUint32(o));
            const ifdOff=exifStart+g(exifStart+4,4);
            const entries=g(ifdOff,2);
            for(let i=0;i<entries;i++){
              const eOff=ifdOff+2+i*12;
              const tag=g(eOff,2);
              if(tag===0x8769){/* ExifIFD pointer */
                const subOff=exifStart+g(eOff+8,4);
                const subEntries=g(subOff,2);
                for(let j=0;j<subEntries;j++){
                  const sOff=subOff+2+j*12;
                  const sTag=g(sOff,2);
                  if(sTag===0x9003||sTag===0x9004){/* DateTimeOriginal or DateTimeDigitized */
                    const strOff=exifStart+g(sOff+8,4);
                    let str="";for(let k=0;k<19;k++)str+=String.fromCharCode(view.getUint8(strOff+k));
                    /* "2026:05:10 14:32:15" → parse */
                    const[date,time]=str.split(" ");
                    if(date&&time){
                      const d=new Date(date.replace(/:/g,"-")+"T"+time);
                      if(!isNaN(d.getTime())){res(d);return}
                    }
                  }
                }
              }
            }
            res(null);return;
          }
          offset+=2+view.getUint16(offset+2);
        }
        res(null);
      }catch{res(null)}
    };
    reader.readAsArrayBuffer(file.slice(0,128*1024));/* only read first 128KB for EXIF */
  });

  /* UPLOAD PHOTOS AFTER SESSION */
  const uploadAfterSession=()=>{
    if(!uploadRef)return;
    uploadRef.onchange=async(e)=>{
      const files=Array.from(e.target.files||[]);if(!files.length)return;
      const newSnaps=[];
      for(const file of files){
        const[b64,exifDate]=await Promise.all([compressImg(file,800),extractExifTime(file)]);
        const ts=exifDate?exifDate.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"uploaded";
        const datePart=exifDate?exifDate.toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"";
        newSnaps.push({id:Date.now()+Math.floor(Math.random()*1000)+newSnaps.length,photo:b64,timestamp:ts,dateLabel:datePart,exifDate:exifDate?.toISOString()||null,species:"",weight:"",fly:"",wild:"",notes:"",analysis:null});
      }
      setSessionSnaps(s=>[...s,...newSnaps].sort((a,b)=>{
        if(a.exifDate&&b.exifDate)return new Date(a.exifDate)-new Date(b.exifDate);
        return a.id-b.id;
      }));
      uploadRef.value="";
    };
    uploadRef.click();
  };

  /* SESSION FORM */
  const[fName,setFName]=useState(()=>user?.name||"");
  const[fBeat,setFBeat]=useState("");const[fFish,setFish]=useState("");
  const[fBig,setFBig]=useState("");const[fFly,setFFly]=useState("");
  const[fNotes,setFNotes]=useState("");const[fRating,setFRating]=useState("");
  const[fDate,setFDate]=useState(()=>new Date().toISOString().slice(0,10));
  const[fPhotos,setFPhotos]=useState([]);/* base64 photos for manual log */
  const manualPhotoRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(manualPhotoRef){manualPhotoRef.type="file";manualPhotoRef.accept="image/*";manualPhotoRef.multiple=true}

  const P=light?L:D;const rv=ALL_RV.find(r=>r.id===riv)||RV[0];

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
  /* Top hatch is always the highest scoring species — no overrides */
  const dan=spp.find(s=>s.id==="danica");
  const topH=spp[0];
  const mayflyAbout=DOY>=130&&DOY<=175&&dan&&dan.score>5;
  const guideNote=useMemo(()=>{
    if(isNight)return"Rest up. The river will be there tomorrow.";
    const top=spp[0];const second=spp[1];
    /* Build contextual advice based on whatever is hatching */
    let note="";
    if(top&&top.score>50)note=`${top.cm} hatching strongly. Match with ${FLYMAP[top.id]||"a matching pattern"}. `;
    else if(top&&top.score>20)note=`${top.cm} activity building. Have ${FLYMAP[top.id]||"a matching pattern"} ready. `;
    else note="Quiet hatches expected. Start with a search pattern like an Adams or PTN. ";
    /* Mayfly context — important but not dominant */
    if(mayflyAbout&&top.id!=="danica")note+=`Mayfly about (${dan.score}%) — fish may switch when they see them. Keep an emerger ready. `;
    else if(mayflyAbout&&top.id==="danica")note+=`Fish will take emergers in the film before they take duns off the top. Try a Danica Emerger or Klinkhamer first. `;
    /* Conditions */
    if(cC>70&&cT>=11)note+=`Overcast skies should encourage hatches.`;
    else if(cC<30&&cT>=14)note+=`Bright conditions — fish shade, go fine, or wait for evening.`;
    else if(cW>14)note+=`Windy — fish the sheltered bank with terrestrials.`;
    else if(cT<10)note+=`Cool water — nymphing will outperform dries until it warms.`;
    else if(cT>=14)note+=`Evening could be excellent.`;
    /* Second hatch */
    if(second&&second.score>30&&second.id!==top?.id)note+=` Also watch for ${second.cm}.`;
    return note;
  },[spp,dan,cC,cW,cT,mayflyAbout,isNight]);
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
  const startSession=()=>{
    setOnRiver(true);setSessionStart(Date.now());setSessionSnaps([]);setSessionNotes("");setSessionTick(0);setReviewing(false);setSessionSummary("");setSessionTrack([]);setShowSessionMap(false);
    /* Get starting position */
    if(navigator.geolocation)navigator.geolocation.getCurrentPosition(
      pos=>setSessionTrack([{lat:pos.coords.latitude,lng:pos.coords.longitude,time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),label:"Start"}]),
      ()=>{},{enableHighAccuracy:true,timeout:10000}
    );
  };

  /* AUTO-SAVE session to localStorage every 30s — crash recovery */
  useEffect(()=>{
    if(!onRiver||!sessionStart)return;
    const save=()=>{try{localStorage.setItem("eph_live_session",JSON.stringify({start:sessionStart,river:rv.n,beat,snaps:sessionSnaps,notes:sessionNotes,track:sessionTrack,hatchObs,ts:Date.now()}))}catch{}};
    save();
    const i=setInterval(save,30000);
    return()=>clearInterval(i);
  },[onRiver,sessionStart,sessionSnaps,sessionNotes,sessionTrack,hatchObs]);

  /* RECOVER crashed session on load */
  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("eph_live_session"));
      if(saved&&saved.start&&Date.now()-saved.ts<86400000){
        setOnRiver(true);setSessionStart(saved.start);
        setSessionSnaps(saved.snaps||[]);setSessionNotes(saved.notes||"");
        setSessionTrack(saved.track||[]);setHatchObs(saved.hatchObs||{});
        setRecovered(true);
      }else{localStorage.removeItem("eph_live_session")}
    }catch{localStorage.removeItem("eph_live_session")}
  },[]);

  const clearSavedSession=()=>{try{localStorage.removeItem("eph_live_session")}catch{}};

  /* SAVE PHOTO TO CAMERA ROLL */
  const saveToRoll=(b64)=>{
    try{
      const link=document.createElement("a");
      link.href=`data:image/jpeg;base64,${b64}`;
      link.download=`ephemera-catch-${Date.now()}.jpg`;
      document.body.appendChild(link);link.click();document.body.removeChild(link);
    }catch{}
  };

  /* GET CURRENT POSITION — returns a promise */
  const getPos=()=>new Promise(res=>{
    if(!navigator.geolocation){res(null);return}
    navigator.geolocation.getCurrentPosition(
      pos=>res({lat:pos.coords.latitude,lng:pos.coords.longitude}),
      ()=>res(null),
      {enableHighAccuracy:true,timeout:8000}
    );
  });

  /* QUICK SNAP — photo + geotag + save to camera roll */
  const quickSnap=()=>{
    if(!fileRef)return;
    fileRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);
      const pos=await getPos();
      const time=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
      const snap={id:Date.now(),photo:b64,timestamp:time,species:"",weight:"",fly:"",wild:"",notes:"",analysis:null,lat:pos?.lat||null,lng:pos?.lng||null};
      setSessionSnaps(s=>[...s,snap]);
      if(pos)setSessionTrack(t=>[...t,{lat:pos.lat,lng:pos.lng,time,label:`Catch ${sessionSnaps.length+1}`}]);
      saveToRoll(b64);
      fileRef.value="";
    };
    fileRef.click();
  };

  /* COMPRESS IMAGE for storage */
  const compressImg=(file,maxW)=>new Promise(res=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement("canvas");
        const scale=Math.min(1,maxW/img.width);
        c.width=img.width*scale;c.height=img.height*scale;
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        res(c.toDataURL("image/jpeg",0.7).split(",")[1]);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });

  /* AI FISH ANALYSIS */
  const analyzeFish=async(snapId)=>{
    const snap=sessionSnaps.find(s=>s.id===snapId);if(!snap)return;
    setAnalyzing(snapId);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:snap.photo,mode:"fish"})});
      const data=await r.json();
      if(data.quality==="unusable"){
        setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:{...data,unusable:true}}:sn));
      }else{
        setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:data,species:data.species||"",weight:data.weight_estimate_lb?String(data.weight_estimate_lb):"",wild:data.wild_stocked||""}:sn));
      }
    }catch(e){setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:{error:e.message}}:sn))}
    setAnalyzing(null);
  };

  /* ANALYSE ALL — batch AI on all unanalysed snaps */
  const[analysingAll,setAnalysingAll]=useState(false);
  const[archiveAnalyzing,setArchiveAnalyzing]=useState(null);/* "sessionId-catchIdx" */

  /* ANALYSE ARCHIVED CATCH — runs AI on a photo from a saved session */
  const analyzeArchiveCatch=async(sessionId,catchIdx)=>{
    const sess=sessions.find(s=>(s.id||0)===sessionId);
    if(!sess||!sess.catches?.[catchIdx]?.photo)return;
    const key=`${sessionId}-${catchIdx}`;
    setArchiveAnalyzing(key);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:sess.catches[catchIdx].photo,mode:"fish"})});
      const data=await r.json();
      const updated=sessions.map(s=>{
        if((s.id||0)!==sessionId)return s;
        const catches=[...s.catches];
        if(data.quality!=="unusable"){
          catches[catchIdx]={...catches[catchIdx],analysis:data,species:data.species||catches[catchIdx].species,weight:data.weight_estimate_lb?String(data.weight_estimate_lb):catches[catchIdx].weight,wild:data.wild_stocked||catches[catchIdx].wild};
        }else{catches[catchIdx]={...catches[catchIdx],analysis:{...data,unusable:true}}}
        return{...s,catches};
      });
      setSessions(updated);try{saveSessions(updated)}catch{}
    }catch{}
    setArchiveAnalyzing(null);
  };
  const analyseAll=async()=>{
    const unanalysed=sessionSnaps.filter(s=>s.photo&&!s.analysis);
    if(!unanalysed.length)return;
    setAnalysingAll(true);
    for(const snap of unanalysed){
      setAnalyzing(snap.id);
      try{
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:snap.photo,mode:"fish"})});
        const data=await r.json();
        if(data.quality==="unusable"){
          setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:{...data,unusable:true}}:sn));
        }else{
          setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:data,species:data.species||sn.species,weight:data.weight_estimate_lb?String(data.weight_estimate_lb):sn.weight,wild:data.wild_stocked||sn.wild}:sn));
        }
      }catch(e){setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:{error:e.message}}:sn))}
    }
    setAnalyzing(null);setAnalysingAll(false);
  };

  /* AI DESCRIBE ANY IMAGE — river scene, wildlife, handwritten notes, anything */
  const aiDescribe=async(snapId)=>{
    const snap=sessionSnaps.find(s=>s.id===snapId);if(!snap?.photo)return;
    setAnalyzing(snapId);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:snap.photo,mode:"describe"})});
      const data=await r.json();
      setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:data,aiCaption:data.summary||data.description||""}:sn));
    }catch(e){setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:{error:e.message}}:sn))}
    setAnalyzing(null);
  };

  /* TEXT-TO-SPEECH — read guide note aloud */
  const speak=(text)=>{
    if(!window.speechSynthesis)return;
    if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return}
    const u=new SpeechSynthesisUtterance(text);
    u.rate=0.9;u.pitch=1;u.lang="en-GB";
    const voices=window.speechSynthesis.getVoices();
    const british=voices.find(v=>v.lang==="en-GB"&&v.name.includes("Daniel"))||voices.find(v=>v.lang==="en-GB")||voices[0];
    if(british)u.voice=british;
    u.onend=()=>setSpeaking(false);
    setSpeaking(true);window.speechSynthesis.speak(u);
  };

  /* TAP-TO-TALK — voice questions to the guide */
  const startListening=()=>{
    if(!window.SpeechRecognition&&!window.webkitSpeechRecognition){setVoiceResult("Voice not supported in this browser.");return}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.lang="en-GB";rec.continuous=false;rec.interimResults=false;
    rec.onresult=async(e)=>{
      const q=e.results[0][0].transcript;
      setListening(false);setVoiceResult("Thinking...");
      try{
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`You are Ephemera, a calm, expert fly fishing guide on ${rv.n} (${beat}). Water temp ${cT}°C, air ${cAir}°C, wind ${cW}mph, ${cC>70?"overcast":cC>40?"cloudy":"clear"}. Top hatch: ${topH?.cm||"olives"}. The angler asks: "${q}". Give practical, specific advice in 2-3 sentences. Calm, encouraging, British tone. If they sound frustrated, reassure them — one good cast beats twenty bad ones.`})});
        const d=await r.json();const answer=d.summary||"I didn't catch that. Try again.";
        setVoiceResult(answer);speak(answer);
      }catch{setVoiceResult("Couldn't connect. Check your signal.")}
    };
    rec.onerror=()=>{setListening(false);setVoiceResult("Couldn't hear you. Tap and try again.")};
    rec.onend=()=>setListening(false);
    setListening(true);setVoiceResult("");rec.start();
  };

  /* RIVER PHOTO ANALYSIS — where to stand, cast, find fish */
  const analyzeRiver=()=>{
    if(!riverPhotoRef)return;
    riverPhotoRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);
      setRiverAnalyzing(true);setRiverAnalysis(null);
      try{
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"river"})});
        setRiverAnalysis(await r.json());
      }catch(e){setRiverAnalysis({error:e.message})}
      setRiverAnalyzing(false);riverPhotoRef.value="";
    };
    riverPhotoRef.click();
  };

  /* AI FLY ID — photo or describe */
  const identifyFly=(withPhoto)=>{
    if(withPhoto){
      if(!flyFileRef)return;
      flyFileRef.onchange=async(e)=>{
        const file=e.target.files?.[0];if(!file)return;
        const b64=await compressImg(file,800);
        setFlyAnalyzing(true);setFlyAnalysis(null);setFlyIdMode(true);
        const extra=[];if(flyQ.size)extra.push(`Size: ${flyQ.size}`);if(flyQ.colour)extra.push(`Colour: ${flyQ.colour}`);if(flyQ.behaviour)extra.push(`Behaviour: ${flyQ.behaviour}`);
        try{const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"fly",observations:extra.join(". ")})});setFlyAnalysis(await r.json())}catch(e){setFlyAnalysis({error:e.message})}
        setFlyAnalyzing(false);flyFileRef.value="";
      };
      flyFileRef.click();
    }else{
      const obs=[];if(flyQ.size)obs.push(`Size: ${flyQ.size}`);if(flyQ.colour)obs.push(`Colour: ${flyQ.colour}`);if(flyQ.behaviour)obs.push(`Behaviour: ${flyQ.behaviour}`);
      if(!obs.length){setFlyAnalysis({error:"Select at least size, colour, or behaviour first."});return}
      setFlyAnalyzing(true);setFlyAnalysis(null);setFlyIdMode(true);
      fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`You are an expert UK chalkstream entomologist. Identify the most likely insect from these observations and recommend artificial flies. Give: likely species, common group, life stage, confidence, matching artificials with hook sizes, and a single "tie on now" recommendation. Current: River ${rv.n}, ${cT}°C water, ${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}. Observations: ${obs.join(". ")}`})})
        .then(r=>r.json()).then(d=>setFlyAnalysis({textId:true,summary:d.summary||"Could not identify."}))
        .catch(e=>setFlyAnalysis({error:e.message})).finally(()=>setFlyAnalyzing(false));
    }
  };

  /* UPDATE SNAP DETAIL (during review) */
  const updateSnap=(id,field,val)=>setSessionSnaps(s=>s.map(sn=>sn.id===id?{...sn,[field]:val}:sn));

  /* AI FLY BOX SCAN — photograph your box, get recommendations */
  const flyBoxRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(flyBoxRef){flyBoxRef.type="file";flyBoxRef.accept="image/*";flyBoxRef.setAttribute("capture","environment")}
  const scanFlyBox=()=>{
    if(!flyBoxRef)return;
    flyBoxRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);
      setFlyBoxScanning(true);setFlyBoxScan(null);
      try{
        const condText=`River: ${rv.n}, Beat: ${beat}, Water temp: ${cT}°C, Air: ${cAir}°C, Wind: ${cW}mph, Cloud: ${cC}%, Top hatch: ${topH?.cm||"none"} (score ${topH?.score||0}), Active hatches: ${spp.filter(s=>s.score>15).map(s=>s.cm).join(", ")||"none"}, Time: ${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}, Method: ${method}`;
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"flybox",conditions:condText})});
        const data=await r.json();
        if(data.error)setFlyBoxScan({error:data.error});
        else if(data.raw)setFlyBoxScan({error:"Could not parse response. Try a clearer photo."});
        else setFlyBoxScan(data);
      }catch(e){setFlyBoxScan({error:e.message})}
      setFlyBoxScanning(false);flyBoxRef.value="";
    };
    flyBoxRef.click();
  };

  /* AI ARCHIVE OVERVIEW — analyse all past sessions */
  const generateArchiveOverview=async()=>{
    if(!sessions.length)return;
    setArchiveLoading(true);
    const data=sessions.slice(0,20).map(s=>`${s.d}: ${s.river}/${s.beat||s.bt}, ${s.fish||0} fish, ${s.dur||""}, best fly: ${s.fly||"?"}, rating: ${s.rating||"?"}, score: ${s.score||"?"}/100, hatch: ${s.topHatch||"?"}, ${s.notes||""}${s.summary?", AI: "+s.summary:""}`).join("\n");
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`Analyse this angler's fishing history and give a detailed overview. Include: patterns in what's working (flies, conditions, times), rivers where they do best, areas to improve, and specific advice for their next session. Be specific and data-driven, not generic. Warm but honest British guide tone.\n\nAngler: ${user?.name||"Unknown"}\nSessions:\n${data}`})});
      const d=await r.json();setArchiveOverview(d.summary||"Could not generate overview.");
    }catch{setArchiveOverview("Overview unavailable — check your connection.")}
    setArchiveLoading(false);
  };

  /* END SESSION → go to review */
  const endToReview=()=>{
    setOnRiver(false);setReviewing(true);
    /* Tag end position */
    if(navigator.geolocation)navigator.geolocation.getCurrentPosition(
      pos=>setSessionTrack(t=>[...t,{lat:pos.coords.latitude,lng:pos.coords.longitude,time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),label:"End"}]),
      ()=>{},{enableHighAccuracy:true,timeout:8000}
    );
  };

  /* AI SESSION SUMMARY */
  const generateSummary=async()=>{
    const catchData=sessionSnaps.map(s=>`${s.timestamp}: ${s.species||"Unknown species"}, ${s.weight?s.weight+"lb":"weight unknown"}, ${s.wild||"unknown origin"}, fly: ${s.fly||"not recorded"}, ${s.notes||""}`).join("\n");
    const data=`River: ${rv.n}, Beat: ${beat}, Date: ${new Date(sessionStart).toLocaleDateString("en-GB")}, Duration: ${fmtDur(Date.now()-sessionStart)}, Fish caught: ${sessionSnaps.length}, Conditions score: ${cond.pct}/100, Top hatch: ${topH?.cm||"none"}, Water temp: ${cT}°C, Air: ${cAir}°C, Wind: ${cW}mph\n\nCatches:\n${catchData}\n\nAngler notes: ${sessionNotes}`;
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:data})});
      const d=await r.json();setSessionSummary(d.summary||"Could not generate summary.");
    }catch{setSessionSummary("Summary unavailable — check your connection.")}
  };

  /* SAVE COMPLETED SESSION */
  const saveSession=()=>{
    const fishCount=sessionSnaps.length;
    const bestFly=sessionSnaps.map(f=>f.fly).filter(Boolean).sort((a,b)=>sessionSnaps.filter(s=>s.fly===b).length-sessionSnaps.filter(s=>s.fly===a).length)[0]||"";
    const biggest=sessionSnaps.reduce((a,s)=>parseFloat(s.weight||0)>parseFloat(a)?s.weight:a,"0");
    const sess={id:Date.now(),d:new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(sessionStart).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),dur:fmtDur(Date.now()-sessionStart),river:rv.n,beat,fish:fishCount,big:biggest!=="0"?biggest+"lb":"",fly:bestFly,notes:sessionNotes,user:user?.name||"Anon",score:cond.pct,topHatch:topH?.cm||"",summary:sessionSummary,isPublic:sessionPublic,gpsTrack:sessionTrack.length?sessionTrack:null,catches:sessionSnaps.map(s=>({timestamp:s.timestamp,species:s.species,weight:s.weight,fly:s.fly,wild:s.wild,notes:s.notes,photo:s.photo||null,lat:s.lat,lng:s.lng}))};
    try{const updated=[sess,...sessions];setSessions(updated);saveSessions(updated)}catch{
      /* localStorage full — save without full photos */
      const lite={...sess,catches:sess.catches.map(c=>({...c,photo:null}))};
      try{const ul=[lite,...sessions];setSessions(ul);saveSessions(ul)}catch{}
    }
    sbInsert("sessions",{user_email:user?.email,user_name:user?.name,river:rv.n,beat,fish:fishCount,biggest:biggest!=="0"?biggest+"lb":"",best_fly:bestFly,notes:sessionNotes+(sessionSummary?"\n\nAI Summary: "+sessionSummary:""),duration:sess.dur,score:cond.pct,top_hatch:topH?.cm||""});
    setReviewing(false);setSessionStart(null);setSessionSnaps([]);setSessionSummary("");setHatchObs({});setSessionTrack([]);clearSavedSession();
  };

  /* ADD PHOTOS TO MANUAL LOG */
  const addManualPhotos=()=>{
    if(!manualPhotoRef)return;
    manualPhotoRef.onchange=async(e)=>{
      const files=Array.from(e.target.files||[]);
      const newPhotos=[];
      for(const file of files){
        const b64=await compressImg(file,800);
        const exifDate=await extractExifTime(file);
        newPhotos.push({b64,time:exifDate?exifDate.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"",exifDate:exifDate?.toISOString()||null});
      }
      setFPhotos(p=>[...p,...newPhotos]);
      manualPhotoRef.value="";
    };
    manualPhotoRef.click();
  };

  /* SAVE MANUAL SESSION */
  const saveManualSession=()=>{
    if(fBeat&&(fNotes||fFish)){
      const dateObj=new Date(fDate+"T12:00:00");
      const sess={id:Date.now(),d:dateObj.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:"",river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,big:fBig,fly:fFly,notes:fNotes,rating:fRating,user:fName||user?.name||"Anon",dur:"Manual",photos:fPhotos.map(p=>({b64:p.b64,time:p.time})),catches:fPhotos.map((p,i)=>({timestamp:p.time||"Photo "+(i+1),species:"",weight:"",fly:fFly,wild:"",notes:""}))};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
      sbInsert("sessions",{user_email:user?.email,user_name:user?.name||fName,river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,biggest:fBig,best_fly:fFly,notes:fNotes,rating:fRating,duration:"Manual"});
      setFBeat("");setFish("");setFBig("");setFFly("");setFNotes("");setFRating("");setFPhotos([]);setFDate(new Date().toISOString().slice(0,10));setShowForm(false);
    }
  };

  /* ── ONBOARDING FLOW ── */
  if(!user||!user.confirmed)return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:D.bg,minHeight:"100vh",color:D.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}input{font-family:inherit;-webkit-appearance:none}input:focus{outline:none}`}</style>
      <Logo s={56}/>
      <div style={{marginTop:12}}><Wordmark w={140} dark={true}/></div>
      <div style={{fontSize:10,color:D.txD,marginTop:4,marginBottom:32}}>Timely insight. Better days.</div>

      {/* STEP 1: BETA CODE */}
      {authStep==="beta"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:8}}>PRIVATE BETA</div>
        <div style={{fontSize:12,color:D.txM,lineHeight:1.6,marginBottom:16}}>Ephemera is currently in private beta. Enter your access code to continue.</div>
        <div style={{marginBottom:10}}><div style={{fontSize:8,color:D.txD,marginBottom:4}}>BETA ACCESS CODE</div><input value={betaCode} onChange={e=>{setBetaCode(e.target.value);setBetaErr("")}} placeholder="Enter code" style={{background:D.c2,border:`1px solid ${betaErr?D.rust:D.bd}`,borderRadius:6,padding:"12px",color:D.tx,fontSize:16,fontFamily:"inherit",width:"100%",letterSpacing:"0.1em",textAlign:"center",fontWeight:700}}/></div>
        {betaErr&&<div style={{fontSize:10,color:D.rust,marginBottom:8}}>{betaErr}</div>}
        <button onClick={()=>{if(betaCode.toUpperCase()===BETA_CODE){setAuthStep("register");setBetaErr("")}else setBetaErr("Invalid code. Contact ephemeraguideapp@gmail.com for access.")}} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>ENTER</button>
        <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:16,opacity:0.5}}>Don't have a code? Email ephemeraguideapp@gmail.com</div>
        <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer",marginTop:8}} onClick={()=>setAuthStep("signin")}>Already have an account? <span style={{color:D.rust}}>Sign in</span></div>
      </div>}

      {/* STEP: SIGN IN (returning user) */}
      {authStep==="signin"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:12}}>WELCOME BACK</div>
        <div style={{display:"grid",gap:10}}>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>EMAIL</div><input value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("")}} placeholder="you@example.com" type="email" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>PASSWORD</div><input value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErr("")}} placeholder="Your password" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          {authErr&&<div style={{fontSize:10,color:D.rust}}>{authErr}</div>}
          <button onClick={signIn} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>SIGN IN</button>
          <div style={{textAlign:"center",fontSize:10,color:D.rust,cursor:"pointer"}} onClick={()=>{setAuthStep("reset");setAuthErr("");setAuthPw("");setAuthPw2("");setResetSent(false)}}>Forgot password?</div>
          <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer"}} onClick={()=>{setAuthStep("beta");setAuthErr("")}}>Need an account? <span style={{color:D.rust}}>Enter beta code</span></div>
        </div>
      </div>}

      {/* STEP: RESET PASSWORD */}
      {authStep==="reset"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:12}}>RESET PASSWORD</div>
        {!resetSent?<div style={{display:"grid",gap:10}}>
          <div style={{fontSize:11,color:D.txM,lineHeight:1.6}}>Enter your email and choose a new password.</div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>EMAIL</div><input value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("")}} placeholder="you@example.com" type="email" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>NEW PASSWORD</div><input value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErr("")}} placeholder="6+ characters" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>CONFIRM NEW PASSWORD</div><input value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErr("")}} placeholder="Confirm" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          {authErr&&<div style={{fontSize:10,color:D.rust}}>{authErr}</div>}
          <button onClick={resetPassword} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>RESET PASSWORD</button>
          <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer"}} onClick={()=>{setAuthStep("signin");setAuthErr("")}}>Back to <span style={{color:D.rust}}>sign in</span></div>
          <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:4,opacity:0.5}}>Problems? Email ephemeraguideapp@gmail.com</div>
        </div>:<div style={{textAlign:"center",padding:10}}>
          <div style={{fontSize:22,marginBottom:8}}>✓</div>
          <div style={{fontSize:14,fontWeight:700,color:D.tx,marginBottom:4}}>Password reset</div>
          <div style={{fontSize:11,color:D.txM,lineHeight:1.6}}>Your password has been updated. You can now sign in.</div>
          <button onClick={()=>{setAuthStep("signin");setAuthErr("");setResetSent(false)}} style={{marginTop:14,padding:"10px 24px",borderRadius:6,border:"none",background:D.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SIGN IN</button>
        </div>}
      </div>}

      {/* STEP 2: REGISTER */}
      {authStep==="register"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.rust,marginBottom:4}}>BETA ACCESS GRANTED</div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:12}}>CREATE YOUR ACCOUNT</div>
        <div style={{display:"grid",gap:10}}>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>FULL NAME</div><input value={authName} onChange={e=>{setAuthName(e.target.value);setAuthErr("")}} placeholder="Your name" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>EMAIL</div><input value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("")}} placeholder="you@example.com" type="email" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>PASSWORD</div><input value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErr("")}} placeholder="6+ characters" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>CONFIRM PASSWORD</div><input value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErr("")}} placeholder="Confirm" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>

          {/* OPT-INS */}
          <div style={{display:"grid",gap:6,padding:"8px 0"}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOptBeta(!optBeta)}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${optBeta?D.rust:D.bd}`,background:optBeta?D.rustS:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{optBeta&&<span style={{color:D.rust,fontSize:12,fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:11,color:D.txM}}>I'd like to be a <strong style={{color:D.rust}}>Beta Tester</strong> and help shape Ephemera</span>
            </label>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOptNewsletter(!optNewsletter)}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${optNewsletter?D.rust:D.bd}`,background:optNewsletter?D.rustS:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{optNewsletter&&<span style={{color:D.rust,fontSize:12,fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:11,color:D.txM}}>Subscribe to the Ephemera newsletter — river intel, updates, launches</span>
            </label>
          </div>

          {authErr&&<div style={{fontSize:10,color:D.rust}}>{authErr}</div>}
          <button onClick={register} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>CREATE ACCOUNT</button>
          <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:4,opacity:0.5}}>Your data is stored locally during beta. Cloud sync coming soon.</div>
        </div>
      </div>}

      {/* STEP 3: CONFIRM */}
      {authStep==="confirm"&&user&&!user.confirmed&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:8}}>CONFIRM YOUR ACCOUNT</div>
        <div style={{fontSize:12,color:D.txM,lineHeight:1.6,marginBottom:4}}>We've sent a confirmation code to:</div>
        <div style={{fontSize:13,fontWeight:700,color:D.tx,marginBottom:16}}>{user.email}</div>
        <div style={{fontSize:10,color:D.txM,lineHeight:1.6,marginBottom:12,padding:"8px 10px",background:D.c2,borderRadius:6,border:`1px solid ${D.bd}`}}>During beta, use code <strong style={{color:D.rust}}>000000</strong> to confirm your account.</div>
        <div style={{marginBottom:10}}><div style={{fontSize:8,color:D.txD,marginBottom:4}}>CONFIRMATION CODE</div><input value={confirmCode} onChange={e=>{setConfirmCode(e.target.value);setConfirmErr("")}} placeholder="000000" maxLength={6} style={{background:D.c2,border:`1px solid ${confirmErr?D.rust:D.bd}`,borderRadius:6,padding:"12px",color:D.tx,fontSize:18,fontFamily:"inherit",width:"100%",letterSpacing:"0.3em",textAlign:"center",fontWeight:700}}/></div>
        {confirmErr&&<div style={{fontSize:10,color:D.rust,marginBottom:8}}>{confirmErr}</div>}
        <button onClick={confirmAccount} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>CONFIRM</button>
        <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer",marginTop:12}} onClick={()=>{localStorage.removeItem(STORE_USER);setUserState(null);setAuthStep("register")}}>Start over</div>
        <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:8,opacity:0.5}}>Problems? Email ephemeraguideapp@gmail.com</div>
      </div>}
    </div>
  );

  /* ── MAIN APP ── */
  return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:P.bg,minHeight:"100vh",color:P.tx,WebkitFontSmoothing:"antialiased",maxWidth:480,margin:"0 auto",paddingBottom:"calc(68px + env(safe-area-inset-bottom, 0px))"}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%}input,textarea{font-family:inherit;-webkit-appearance:none}input:focus,textarea:focus{outline:none}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}`}</style>

      {/* HEADER */}
      <div style={{background:P.c1,padding:"14px 14px 12px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Logo s={28}/><Wordmark w={100} dark={!light}/></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:6,padding:"4px 8px",color:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{light?"◐":"☀"}</button>
            <div onClick={logout} style={{width:28,height:28,borderRadius:14,background:P.c2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:P.txM,fontWeight:600,cursor:"pointer",border:`1px solid ${P.bd}`}}>{user.name[0]}</div>
          </div>
        </div>

        {/* RIVER SEARCH + NEAR ME */}
        <div style={{display:"flex",gap:6}}>
          <div onClick={()=>{setPick(!pick);setRiverSearch("");setRegionFilter("")}} style={{flex:1,background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:P.txM,cursor:"pointer"}}>{rv.n+(beat?" / "+beat:"")}</div>
          <button onClick={()=>{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude,lng=pos.coords.longitude;let best=ALL_RV[0],bestD=999;ALL_RV.forEach(r=>{const d=Math.sqrt((r.lat-lat)**2+(r.lng-lng)**2);if(d<bestD){bestD=d;best=r}});setRiv(best.id);setPick(false)},()=>{},{enableHighAccuracy:true,timeout:8000})}} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"9px 12px",color:P.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Near me</button>
        </div>

        {/* PICKER */}
        {pick&&<div style={{marginTop:8,background:P.c2,borderRadius:8,padding:10,border:`1px solid ${P.bd}`}}>
          <input value={riverSearch} onChange={e=>setRiverSearch(e.target.value)} placeholder="Search rivers..." autoFocus style={{width:"100%",background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",marginBottom:8}}/>
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            <select value={regionFilter} onChange={e=>setRegionFilter(e.target.value)} style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 8px",color:P.tx,fontSize:10,fontFamily:"inherit",flex:1}}>
              <option value="">All rivers</option><option value="chalk">Chalkstreams</option><option value="Stillwater">Stillwater</option>
              {REGIONS.filter(r=>r!=="Stillwater").map(rg=><option key={rg} value={rg}>{rg}</option>)}
            </select>
          </div>
          {favs.length>0&&<div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:6,marginBottom:6,borderBottom:`1px solid ${P.bd}`}}>
            {favs.map(fid=>{const fr=ALL_RV.find(r=>r.id===fid);if(!fr)return null;return<button key={fid} onClick={()=>{setRiv(fid);setPick(false)}} style={{flexShrink:0,padding:"4px 10px",borderRadius:5,border:riv===fid?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:riv===fid?P.gn+"18":"transparent",color:riv===fid?P.gn:P.tx,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{fr.n.replace("River ","")}</button>})}
          </div>}
          <div style={{maxHeight:180,overflowY:"auto"}}>{(()=>{
            let rivers=ALL_RV;
            if(regionFilter==="chalk")rivers=rivers.filter(r=>r.premium);
            else if(regionFilter)rivers=rivers.filter(r=>r.rg===regionFilter);
            if(riverSearch.trim())rivers=rivers.filter(r=>r.n.toLowerCase().includes(riverSearch.toLowerCase())||r.rg?.toLowerCase().includes(riverSearch.toLowerCase()));
            rivers=rivers.sort((a,b)=>{const af=favs.includes(a.id)?0:1,bf=favs.includes(b.id)?0:1;if(af!==bf)return af-bf;const ap=a.premium?0:1,bp=b.premium?0:1;if(ap!==bp)return ap-bp;return a.n.localeCompare(b.n)});
            if(!rivers.length)return<div style={{textAlign:"center",padding:12,color:P.txD,fontSize:11}}>No rivers found</div>;
            return rivers.slice(0,20).map(r=><div key={r.id} onClick={()=>{setRiv(r.id);if(!r.b||r.b.length<=1)setPick(false);setRiverSearch("")}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 4px",borderBottom:`1px solid ${P.bd}`,cursor:"pointer"}}>
              <button onClick={e=>{e.stopPropagation();toggleFav(r.id)}} style={{background:"none",border:"none",color:favs.includes(r.id)?P.rust:P.txD,fontSize:11,cursor:"pointer",padding:0,flexShrink:0,width:16}}>{favs.includes(r.id)?"★":"☆"}</button>
              <span style={{flex:1,fontSize:11,fontWeight:riv===r.id?700:400,color:riv===r.id?P.gn:P.tx}}>{r.n}</span>
              <span style={{fontSize:8,color:r.premium?P.gn:P.txD,flexShrink:0}}>{r.premium?"●":r.rg||""}</span>
            </div>);
          })()}</div>
          {rv.b&&rv.b.length>1&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.bd}`}}>
            <div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEAT</div>
            <div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:6}}>{rv.b.map(b=><button key={b} onClick={()=>{setBeat(b);setCustomBeat("");setPick(false)}} style={{flexShrink:0,padding:"5px 10px",borderRadius:5,border:beat===b&&!customBeat?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:beat===b&&!customBeat?P.gn+"18":"transparent",color:beat===b&&!customBeat?P.gn:P.txD,fontSize:9,fontWeight:beat===b&&!customBeat?700:400,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div>
            <input value={customBeat} onChange={e=>{setCustomBeat(e.target.value);if(e.target.value)setBeat(e.target.value)}} placeholder="Or type your beat name..." style={{width:"100%",background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"7px 10px",color:P.tx,fontSize:11,fontFamily:"inherit"}}/>
          </div>}
          {(!rv.b||rv.b.length<=1)&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.bd}`}}>
            <div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEAT / SECTION</div>
            <input value={customBeat||beat} onChange={e=>{setCustomBeat(e.target.value);setBeat(e.target.value)}} placeholder="Type your beat or section name..." style={{width:"100%",background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"7px 10px",color:P.tx,fontSize:11,fontFamily:"inherit"}}/>
          </div>}
        </div>}
      </div>

      {/* HERO CARD — score + guide + conditions (Design 2 dark card) */}
      <div style={{padding:"12px 14px",background:P.bg}}>
        <div style={{background:P.c1,borderRadius:12,border:`1px solid ${P.bd}`,padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:P.txD,letterSpacing:"0.08em"}}>TODAY</div>
              <div style={{fontSize:14,color:P.tx,fontWeight:500,marginTop:6,lineHeight:1.6}}>{guideNote.split(".").slice(0,2).join(".")+"."}</div>
            </div>
            <div style={{textAlign:"center",paddingLeft:16}}>
              <div style={{fontSize:44,fontWeight:700,color:cond.clr,lineHeight:1}}>{Math.round(cond.pct/10)}</div>
              <div style={{fontSize:9,color:P.txD}}>/10</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12,marginTop:12,paddingTop:10,borderTop:`1px solid ${P.bd}`}}>
            <div><span style={{fontSize:10,color:P.txD}}>Water </span><span style={{fontSize:10,color:P.tx}}>{cT}°</span></div>
            <div><span style={{fontSize:10,color:P.txD}}>Wind </span><span style={{fontSize:10,color:P.tx}}>{cW}mph</span></div>
            <div><span style={{fontSize:10,color:P.txD}}>Cloud </span><span style={{fontSize:10,color:P.tx}}>{cC}%</span></div>
          </div>
        </div>
      </div>

      {/* SESSION MODE BAR */}
      <div style={{background:onRiver?P.rustS:P.c2,padding:!onRiver&&!reviewing?"12px 14px":"8px 14px",borderBottom:`1px solid ${onRiver?P.rustB:P.bd}`}}>
        {!onRiver&&!reviewing?<div>
          <button onClick={startSession} style={{width:"100%",background:P.gn,border:"none",borderRadius:10,padding:"14px",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Start fishing session</button>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
            <div style={{fontSize:8,color:P.txD}}>Tracks time, catches, and conditions</div>
            <div style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}} onClick={()=>setSessionPublic(!sessionPublic)}>
              <div style={{width:14,height:14,borderRadius:3,border:`1px solid ${sessionPublic?P.gn:P.bd}`,background:sessionPublic?P.gn+"18":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>{sessionPublic&&<span style={{color:P.gn,fontSize:9,fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:8,color:P.txD}}>Public session</span>
            </div>
          </div>
        </div>
        :onRiver?<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:8,height:8,borderRadius:4,background:P.gn,animation:"pulse 2s infinite"}}/>
            <div><div style={{fontSize:10,fontWeight:700,color:P.gn}}>ON THE RIVER</div><div style={{fontSize:9,color:P.txM}}>{sessionStart?fmtDur(Date.now()-sessionStart+(sessionTick*0)):""} · {sessionSnaps.length} snap{sessionSnaps.length!==1?"s":""}</div></div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={quickSnap} style={{background:P.gn,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📷 SNAP</button>
            <button onClick={async()=>{
              const pos=await getPos();
              if(pos){
                const url=`https://maps.google.com/?q=${pos.lat},${pos.lng}`;
                const text=`I'm fishing on ${rv.n}${beat?" / "+beat:""} — find me here: ${url}`;
                if(navigator.share)navigator.share({title:"Ephemera — Live Location",text}).catch(()=>{});
                else{navigator.clipboard.writeText(text).catch(()=>{});alert("Location link copied!")}
              }else alert("GPS not available — check location permissions")
            }} style={{background:"transparent",border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 8px",color:P.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>📍</button>
            <button onClick={endToReview} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>END</button>
          </div>
        </div>:reviewing?<div style={{display:"flex",alignItems:"center",gap:8,width:"100%",justifyContent:"space-between"}}>
          <div style={{fontSize:10,fontWeight:700,color:P.rust}}>SESSION REVIEW — {sessionSnaps.length} catch{sessionSnaps.length!==1?"es":""}</div>
          <button onClick={()=>{setReviewing(false);setSessionStart(null);setSessionSnaps([]);clearSavedSession()}} style={{fontSize:9,color:P.txD,background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit"}}>Discard</button>
        </div>:null}
      </div>

      {/* TABS */}
      <div style={{padding:14}}>

        {/* SESSION RECOVERY BANNER */}
        {recovered&&<div style={{background:P.gn+"18",borderRadius:8,border:`1px solid ${P.gn}40`,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,fontWeight:700,color:P.gn}}>Session recovered</div><div style={{fontSize:9,color:P.txM,marginTop:2}}>Your session was restored after the app closed. {sessionSnaps.length} snap{sessionSnaps.length!==1?"s":""} saved.</div></div>
          <button onClick={()=>setRecovered(false)} style={{background:"none",border:"none",color:P.txD,fontSize:14,cursor:"pointer"}}>✕</button>
        </div>}

        {/* ═══ GUIDE ═══ */}
        {tab==="guide"&&<div>
          {/* GUIDE NOTE */}
          <div style={{padding:"14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}>
            <div style={{fontSize:14,color:P.tx,lineHeight:1.7}}>{guideNote}</div>
            <button onClick={()=>speak(guideNote)} style={{marginTop:8,background:"none",border:`1px solid ${speaking?P.gn:P.bd}`,borderRadius:6,padding:"5px 12px",color:speaking?P.gn:P.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{speaking?"Stop":"Listen"}</button>
          </div>

          {/* TIE ON + BEST WINDOW */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,background:P.gn+"18",border:`1px solid ${P.gn}30`,borderRadius:10,padding:"14px"}}>
              <div style={{fontSize:9,color:P.gn,letterSpacing:"0.08em",fontWeight:600}}>TIE ON</div>
              <div style={{fontSize:16,fontWeight:600,color:P.tx,marginTop:4}}>{FLYMAP[topH?.id]||"Adams #16"}</div>
              <div style={{fontSize:11,color:P.gn,marginTop:3}}>{topH?.cm||"Olives"}</div>
            </div>
            <div style={{flex:1,background:P.rust+"18",border:`1px solid ${P.rust}30`,borderRadius:10,padding:"14px"}}>
              <div style={{fontSize:9,color:P.rust,letterSpacing:"0.08em",fontWeight:600}}>BEST WINDOW</div>
              <div style={{fontSize:16,fontWeight:600,color:P.tx,marginTop:4}}>{nowWin?.cur?.hr?nowWin.cur.hr+":00":"Afternoon"}</div>
              <div style={{fontSize:11,color:P.rust,marginTop:3}}>{nowWin?.cur?.note?.split(".")[0]||"Peak activity"}</div>
            </div>
          </div>

          {/* HATCH OF THE DAY */}
          {!isNight&&topH&&topH.score>5&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600}}>HATCH OF THE DAY</div>
                <div style={{fontSize:18,fontWeight:700,color:P.tx,marginTop:4}}>{topH.cm}</div>
                <div style={{fontSize:12,color:P.gn,fontWeight:600,marginTop:2}}>{FLYMAP[topH.id]||"Match the hatch"}</div>
              </div>
              <div style={{fontSize:28,fontWeight:700,color:hC(topH.score)}}>{Math.round(topH.score/10)}<span style={{fontSize:12,color:P.txD}}>/10</span></div>
            </div>
            {spp.filter(s=>s.score>15&&s.id!==topH.id).length>0&&<div style={{marginTop:8,fontSize:11,color:P.txM}}>Also active: {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).map(s=>s.cm).join(", ")}</div>}
          </div>}

          {/* HATCH OF THE WEEK */}
          {!isNight&&spp.filter(s=>s.score>10).length>0&&<div onClick={()=>toggle("hotw")} style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600}}>WHAT'S HATCHING THIS WEEK</div><span style={{color:P.txD,fontSize:11}}>{ex.hotw?"−":"+"}</span></div>
            {ex.hotw&&<div style={{marginTop:8}}>{spp.filter(s=>s.score>5).slice(0,6).map(sp=><div key={sp.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${P.bd}`}}>
              <div><div style={{fontSize:13,fontWeight:600,color:P.tx}}>{sp.cm}</div><div style={{fontSize:10,color:P.gn,marginTop:1}}>{FLYMAP[sp.id]||""}</div></div>
              <div style={{fontSize:16,fontWeight:700,color:hC(sp.score)}}>{Math.round(sp.score/10)}</div>
            </div>)}</div>}
          </div>}

          {/* 10-DAY FORECAST */}
          {wxDays.length>0&&!onRiver&&!reviewing&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:P.txD,marginBottom:10}}>UPCOMING</div>
            <div style={{display:"flex",gap:3}}>{wxDays.map((d,i)=>{const futDoy=DOY+i;const pjH=H.reduce((s,sp)=>{if(futDoy<sp.s-10||futDoy>sp.e+10)return s;let sf=0;if(futDoy>=sp.s&&futDoy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((futDoy-m)/r)**2)}return s+sf*(sp.t===1?30:sp.t===2?12:5)},0);let sc=0;sc+=Math.min(30,pjH*0.30);const avg=((d.aH||14)+(d.aL||8))/2;sc+=avg>=13?15:avg>=10?10:5;sc+=(d.rain||0)<2?7:4;sc+=(d.windMax||8)<=10?15:(d.windMax||8)<=18?7:2;sc+=7+Math.round((rv.q||5)*1.5);sc=Math.round(Math.min(100,sc));const s10=Math.round(sc/10);return<div key={i} onClick={()=>setGDay(gDay===i?-1:i)} style={{flex:1,textAlign:"center",padding:"8px 2px",background:gDay===i?P.gn+"18":i===0?P.gn+"08":"transparent",borderRadius:6,cursor:"pointer"}}><div style={{fontSize:9,fontWeight:600,color:i===0?P.gn:P.txM}}>{d.dn}</div><div style={{fontSize:18,fontWeight:700,color:scClr(sc),marginTop:3}}>{s10}</div><div style={{fontSize:8,color:P.txD,marginTop:1}}>{d.aH||"--"}°</div>{(d.rain||0)>0&&<div style={{fontSize:7,color:P.rust}}>rain</div>}</div>})}</div>

            {/* EXPANDED DAY PLAN */}
            {gDay>=0&&wxDays[gDay]&&(()=>{const fg=futureDayGuide(wxDays[gDay],gDay,cT,rv,beat,method);if(!fg)return null;return<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${P.bd}`}}>
              <div style={{fontSize:15,fontWeight:700,color:P.tx,marginBottom:2}}>{wxDays[gDay].df}</div>
              <div style={{fontSize:11,color:P.txM,marginBottom:10}}>{wxDays[gDay].aH||"--"}°/{wxDays[gDay].aL||"--"}° · {fg.avgWind}mph · {fg.avgCloud>70?"Overcast":fg.avgCloud>40?"Cloudy":"Clear"}</div>

              {fg.topH&&fg.topH.score>5&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:P.gn+"12",borderRadius:8,marginBottom:8}}>
                <div><div style={{fontSize:16,fontWeight:700,color:P.tx}}>{fg.topH.cm}</div><div style={{fontSize:12,color:P.gn,fontWeight:600,marginTop:2}}>{FLYMAP[fg.topH.id]||"Match the hatch"}</div></div>
                <div style={{fontSize:24,fontWeight:700,color:hC(fg.topH.score)}}>{Math.round(fg.topH.score/10)}</div>
              </div>}

              <div style={{padding:"10px 12px",background:P.c2,borderRadius:8,marginBottom:8}}>
                <div style={{fontSize:14,fontWeight:600,color:P.tx}}>{fg.rig.a}</div>
                <div style={{fontSize:11,color:P.txM,marginTop:2}}>{fg.rig.fly}</div>
              </div>

              <div style={{fontSize:9,fontWeight:600,color:P.txD,letterSpacing:"0.08em",marginBottom:4}}>FLIES TO HAVE READY</div>
              {fg.futSpp.filter(s=>s.score>15).slice(0,4).map(sp=><div key={sp.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}><span style={{color:P.tx}}>{sp.cm}</span><span style={{color:P.gn,fontWeight:600}}>{FLYMAP[sp.id]||""}</span></div>)}

              {/* ADVANCED DETAIL — toggle */}
              {advanced&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${P.bd}`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>{[{l:"Rod",v:fg.rig.rod},{l:"Leader",v:fg.rig.ldr},{l:"Tippet",v:fg.rig.tip},{l:"Fly",v:fg.rig.fly}].map((r,ri)=><div key={ri} style={{padding:"5px 8px",background:P.c1,borderRadius:4}}><div style={{fontSize:7,color:P.txD}}>{r.l.toUpperCase()}</div><div style={{fontSize:10,fontWeight:600,color:ri===3?P.gn:P.tx,marginTop:1}}>{r.v}</div></div>)}</div>
                {fg.antic.length>0&&<div style={{marginBottom:6}}>{fg.antic.map((n,ni)=><div key={ni} style={{fontSize:10,color:P.txM,lineHeight:1.6}}>{n}</div>)}</div>}
                <div style={{fontSize:9,fontWeight:600,color:P.txD,letterSpacing:"0.08em",marginBottom:4}}>HOURLY TIMELINE</div>
                {fg.tl.map((e,ti)=><div key={ti} style={{display:"flex",gap:8,padding:"3px 0",borderBottom:ti<fg.tl.length-1?`1px solid ${P.bd}`:""}}>
                  <span style={{fontSize:10,fontWeight:700,color:e.hi>=3?P.gn:e.hi>=1?P.rust:P.txD,minWidth:28}}>{e.hr}:00</span>
                  <span style={{fontSize:10,color:P.txM,flex:1}}>{e.note}</span>
                </div>)}
              </div>}
            </div>})()}
          </div>}

          {/* ADVANCED TOGGLE */}
          {!onRiver&&!reviewing&&<div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
            <button onClick={()=>setAdvanced(!advanced)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 16px",color:advanced?P.gn:P.txD,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{advanced?"Simple mode":"Advanced"}</button>
          </div>}

          {/* ADVANCED: approach detail + river info */}
          {advanced&&!onRiver&&!reviewing&&<>
            <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
              <div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600,marginBottom:4}}>APPROACH</div>
              <div style={{fontSize:15,fontWeight:700,color:P.tx}}>{rig.a}</div>
              <div style={{fontSize:11,color:P.txM,marginTop:2,fontStyle:"italic"}}>{rig.why}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:8}}>{[{l:"Rod",v:rig.rod},{l:"Leader",v:rig.ldr},{l:"Tippet",v:rig.tip},{l:"Fly",v:rig.fly}].map((r,ri)=><div key={ri} style={{padding:"5px 8px",background:P.c2,borderRadius:4}}><div style={{fontSize:7,color:P.txD}}>{r.l.toUpperCase()}</div><div style={{fontSize:10,fontWeight:600,color:ri===3?P.gn:P.tx,marginTop:1}}>{r.v}</div></div>)}</div>
              <div style={{marginTop:6,padding:"5px 8px",background:P.c2,borderRadius:4}}><div style={{fontSize:7,color:P.txD}}>GUIDE TIP</div><div style={{fontSize:10,color:P.txM,marginTop:1,lineHeight:1.6}}>{rig.guide}</div></div>
            </div>
            <div style={{padding:"10px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}><div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:P.txD,marginBottom:4}}>{rv.n.toUpperCase()}</div><div style={{fontSize:11,color:P.txM,lineHeight:1.7,fontStyle:"italic"}}>{rv.p}</div></div>
          </>}

          {/* SESSION ACTIVE — minimal, quick snap */}
          {onRiver&&<div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.gn}}>SESSION ACTIVE — {beat}</div><div style={{fontSize:9,color:P.txD}}>{new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div></div>
            <div style={{fontSize:13,fontWeight:700,color:P.tx,lineHeight:1.5}}>{isNight?"Night time. Rest up for tomorrow.":cC>60&&cT>=12?"Cloud thickening — hatches should build. Stay on dries.":cC<30&&cT>=14?"Bright conditions. Fish the shade. Consider emergers in the film.":cW>14?"Wind making presentation tough. Try the sheltered bank.":cT<10?"Cool water. Keep nymphing. Watch for olive activity after 11am.":nowWin&&nowWin.cur&&nowWin.cur.hi>=4?"Hatch building now. Watch for rises and match the size.":"Conditions stable. Work upstream, cover water methodically."}</div>
            {nowWin&&nowWin.nxt&&!isNight&&<div style={{fontSize:10,color:P.gn,marginTop:6}}>Next: {nowWin.nxt.hr}:00 — {nowWin.nxt.note}</div>}

            {/* SNAP THUMBNAILS */}
            {sessionSnaps.length>0&&<div style={{marginTop:10,display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
              {sessionSnaps.map(s=><div key={s.id} style={{flexShrink:0,textAlign:"center"}} onClick={()=>{if(!s.photo)return;const items=sessionSnaps.filter(sn=>sn.photo).map(sn=>({src:`data:image/jpeg;base64,${sn.photo}`,type:"image",caption:sn.timestamp}));const idx=sessionSnaps.filter(sn=>sn.photo).findIndex(sn=>sn.id===s.id);if(idx>=0)setGallery({items,idx})}}>
                {!s.photo?<div style={{width:48,height:48,borderRadius:6,background:P.c2,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${P.bd}`,fontSize:10,color:P.txD}}>?</div>
                :<img src={`data:image/jpeg;base64,${s.photo}`} alt="" style={{width:48,height:48,borderRadius:6,objectFit:"cover",border:`2px solid ${P.gn}`}}/>}
                <div style={{fontSize:7,color:P.txD,marginTop:2}}>{s.timestamp}</div>
              </div>)}
            </div>}
            <div style={{marginTop:8,textAlign:"center"}}><button onClick={quickSnap} style={{background:P.gn,border:"none",borderRadius:8,padding:"10px 24px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📷 Quick Snap</button><div style={{fontSize:8,color:P.txD,marginTop:4}}>Take photo, log details later</div></div>
          </div>}

          {/* SESSION REVIEW — fill in details after fishing */}
          {reviewing&&<div style={{background:P.c1,borderRadius:12,border:`1px solid ${P.bd}`,padding:14,marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust,marginBottom:4}}>SESSION REVIEW</div>
            <div style={{fontSize:11,color:P.txM,lineHeight:1.6,marginBottom:10}}>{rv.n} / {beat} — {sessionStart?new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"}):""} — {sessionStart?fmtDur(Date.now()-sessionStart):""}</div>

            {/* UPLOAD PHOTOS FROM CAMERA ROLL */}
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <button onClick={uploadAfterSession} style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📁 Add Photos & Video</button>
              <button onClick={quickSnap} style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📷</button>
            </div>
            <div style={{fontSize:8,color:P.txD,marginBottom:10,lineHeight:1.5}}>Upload photos from today — timestamps are read from the image data so catches appear in the order you took them.</div>

            {/* ANALYSE ALL BUTTON */}
            {sessionSnaps.filter(s=>s.photo&&!s.analysis).length>0&&<button onClick={analyseAll} disabled={analysingAll} style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${P.gn}`,background:analysingAll?P.c2:"transparent",color:analysingAll?P.txD:P.gn,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>{analysingAll?`Analysing... (${sessionSnaps.filter(s=>s.analysis).length}/${sessionSnaps.length})`:`🐟 AI Analyse All Photos (${sessionSnaps.filter(s=>s.photo&&!s.analysis).length})`}</button>}

            {/* SESSION GPS MAP */}
            {sessionTrack.length>0&&<div style={{marginBottom:10}}>
              <div onClick={()=>setShowSessionMap(!showSessionMap)} style={{background:P.c2,borderRadius:showSessionMap?"8px 8px 0 0":8,border:`1px solid ${P.bd}`,padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:P.gn}}>CATCH LOCATIONS</div><div style={{fontSize:9,color:P.txM,marginTop:2}}>{sessionTrack.filter(t=>t.label&&t.label.startsWith("Catch")).length} catch{sessionTrack.filter(t=>t.label&&t.label.startsWith("Catch")).length!==1?"es":""} geotagged</div></div>
                <span style={{color:P.txD,fontSize:11}}>{showSessionMap?"−":"+"}</span>
              </div>
              {showSessionMap&&<div style={{background:P.c2,borderRadius:"0 0 8px 8px",border:`1px solid ${P.bd}`,borderTop:"none",overflow:"hidden"}}>
                <div style={{height:220,width:"100%"}} ref={el=>{
                  if(!el||el.dataset.init||!mapsLoaded||!window.google||!sessionTrack.length)return;
                  el.dataset.init="1";
                  const map=new window.google.maps.Map(el,{center:{lat:sessionTrack[0].lat,lng:sessionTrack[0].lng},zoom:15,disableDefaultUI:true,zoomControl:true,styles:[{featureType:"water",stylers:[{color:"#c8d7d4"}]},{featureType:"landscape",stylers:[{color:"#e8e4dc"}]},{featureType:"road",stylers:[{visibility:"simplified"}]},{featureType:"poi",stylers:[{visibility:"off"}]}]});
                  const bounds=new window.google.maps.LatLngBounds();
                  sessionTrack.forEach((p,i)=>{
                    const pos={lat:p.lat,lng:p.lng};bounds.extend(pos);
                    const isCatch=p.label&&p.label.startsWith("Catch");
                    const isStart=p.label==="Start";
                    const isEnd=p.label==="End";
                    new window.google.maps.Marker({position:pos,map,
                      label:isCatch?{text:p.label.replace("Catch ",""),color:"#fff",fontSize:"9px",fontWeight:"700"}:undefined,
                      icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:isCatch?10:6,
                        fillColor:isCatch?"#C36A3D":isStart?"#7A9E7E":"#5F6F7B",fillOpacity:1,strokeColor:"#fff",strokeWeight:2},
                      title:`${p.label} — ${p.time}`});
                  });
                  if(sessionTrack.length>1)map.fitBounds(bounds,{padding:30});
                }}/>
              </div>}
            </div>}

            {sessionSnaps.length===0&&<div style={{textAlign:"center",padding:16,color:P.txD}}>
              <div style={{fontSize:13,fontWeight:600}}>No photos yet</div>
              <div style={{fontSize:10,marginTop:4,lineHeight:1.6}}>Upload photos from your camera roll above — EXIF timestamps will order them chronologically. Or add notes and save a blank session.</div>
            </div>}

            {sessionSnaps.map((snap,idx)=><div key={snap.id} style={{background:P.c2,borderRadius:10,border:`1px solid ${P.bd}`,padding:12,marginBottom:8}}>
              <div style={{display:"flex",gap:10,marginBottom:8}}>
                {!snap.photo?<div style={{width:72,height:72,borderRadius:8,background:P.c1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${P.bd}`}}><span style={{fontSize:10,color:P.txD}}>No photo</span></div>
                :<img src={`data:image/jpeg;base64,${snap.photo}`} alt="" onClick={()=>{const items=sessionSnaps.filter(s=>s.photo).map((s,i)=>({src:`data:image/jpeg;base64,${s.photo}`,type:"image",caption:`Catch ${i+1} — ${s.timestamp}`}));const idx=sessionSnaps.filter(s=>s.photo).findIndex(s=>s.id===snap.id);if(idx>=0)setGallery({items,idx})}} style={{width:72,height:72,borderRadius:8,objectFit:"cover",flexShrink:0,cursor:"pointer"}}/>}
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:P.tx}}>Catch {idx+1}</span><span style={{fontSize:9,color:P.txD}}>{snap.dateLabel?snap.dateLabel+" ":""}{snap.timestamp}{snap.exifDate?"":" ⏎"}</span></div>

                  {/* AI ANALYSIS RESULT */}
                  {snap.analysis&&!snap.analysis.error&&!snap.analysis.unusable&&!snap.aiCaption&&<div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI IDENTIFICATION</div>
                    <div style={{fontSize:10,fontWeight:600,color:P.tx}}>{snap.analysis.species} — {snap.analysis.species_confidence} confidence</div>
                    <div style={{fontSize:9,color:P.txM}}>{snap.analysis.wild_stocked}: {snap.analysis.wild_notes}</div>
                    {snap.analysis.weight_range&&<div style={{fontSize:9,color:P.txM}}>Est. {snap.analysis.weight_range}</div>}
                    {snap.analysis.condition&&<div style={{fontSize:9,color:P.txM}}>Condition: {snap.analysis.condition}</div>}
                  </div>}
                  {/* AI DESCRIPTION (non-fish image) */}
                  {snap.aiCaption&&<div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`}}>
                    <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI DESCRIPTION</div>
                    <div style={{fontSize:10,color:P.tx,lineHeight:1.5}}>{snap.aiCaption}</div>
                    {snap.analysis?.transcription&&<div style={{marginTop:4,padding:"4px 6px",background:P.c2,borderRadius:3,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,color:P.txD}}>TRANSCRIPTION</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.5,fontStyle:"italic"}}>{snap.analysis.transcription}</div></div>}
                  </div>}
                  {snap.analysis&&snap.analysis.unusable&&<div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.rust}40`}}>
                    <div style={{fontSize:8,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div>
                    <div style={{fontSize:9,color:P.txM}}>{snap.analysis.quality_note||"Image too blurry or unclear."}</div>
                  </div>}
                  {snap.analysis&&snap.analysis.quality==="poor"&&!snap.analysis.unusable&&<div style={{fontSize:8,color:P.rust,marginTop:2}}>⚠ {snap.analysis.quality_note}</div>}
                  {snap.analysis&&snap.analysis.error&&<div style={{fontSize:9,color:P.rust,marginTop:4}}>Analysis failed — fill in manually</div>}

                  {snap.photo&&<div style={{display:"flex",gap:4,marginTop:6}}>
                    <button onClick={()=>analyzeFish(snap.id)} disabled={analyzing===snap.id} style={{padding:"5px 8px",borderRadius:5,border:`1px solid ${analyzing===snap.id?P.bd:P.gn}`,background:"transparent",color:analyzing===snap.id?P.txD:P.gn,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{analyzing===snap.id?"...":snap.analysis&&!snap.aiCaption?"Re-ID":"🐟 Fish"}</button>
                    <button onClick={()=>aiDescribe(snap.id)} disabled={analyzing===snap.id} style={{padding:"5px 8px",borderRadius:5,border:`1px solid ${analyzing===snap.id?P.bd:P.rust}`,background:"transparent",color:analyzing===snap.id?P.txD:P.rust,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{snap.aiCaption?"Re-describe":"📝 Describe"}</button>
                  </div>}
                </div>
              </div>

              {/* MANUAL FIELDS — fill in after fishing */}
              <div style={{display:"grid",gap:6}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>SPECIES</div><div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{["Trout","Grayling","Sea Trout","Salmon","Other"].map(t=><button key={t} onClick={()=>updateSnap(snap.id,"species",t)} style={{padding:"3px 6px",borderRadius:3,border:snap.species===t?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:snap.species===t?"#7A9E7E18":"transparent",color:snap.species===t?P.gn:P.txD,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div></div>
                  <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>WILD / STOCKED</div><div style={{display:"flex",gap:2}}>{["Wild","Stocked","Unsure"].map(w=><button key={w} onClick={()=>updateSnap(snap.id,"wild",w)} style={{padding:"3px 6px",borderRadius:3,border:snap.wild===w?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:snap.wild===w?"#7A9E7E18":"transparent",color:snap.wild===w?P.gn:P.txD,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{w}</button>)}</div></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>WEIGHT (LB)</div><input value={snap.weight} onChange={e=>updateSnap(snap.id,"weight",e.target.value)} placeholder="e.g. 2.5" type="number" step="0.25" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
                  <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>FLY</div><input value={snap.fly} onChange={e=>updateSnap(snap.id,"fly",e.target.value)} placeholder="CDC #16" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
                </div>
                <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>NOTES</div><input value={snap.notes} onChange={e=>updateSnap(snap.id,"notes",e.target.value)} placeholder="Rising steadily, took first cast..." style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
              </div>
            </div>)}

            {/* SESSION NOTES + SUMMARY */}
            <div style={{marginTop:6}}><div style={{fontSize:8,color:P.txD,marginBottom:4}}>SESSION NOTES</div><textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="How was the day? Conditions, highlights, lessons..." rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>

            {sessionSnaps.length>0&&<button onClick={generateSummary} style={{width:"100%",marginTop:8,padding:"8px",borderRadius:6,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{sessionSummary?"↻ Regenerate AI Summary":"✨ Generate AI Summary"}</button>}
            {sessionSummary&&<div style={{marginTop:8,padding:"10px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
              <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI SESSION SUMMARY</div>
              <div style={{fontSize:11,color:P.tx,lineHeight:1.7,fontStyle:"italic"}}>{sessionSummary}</div>
            </div>}

            <button onClick={saveSession} style={{width:"100%",marginTop:10,padding:"12px",borderRadius:8,border:"none",background:P.gn,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SAVE SESSION</button>
          </div>}
        </div>}


        {/* ═══ HATCHES — active now / expected later + FLY ID ═══ */}
        {tab==="hatches"&&<div>
          {/* FLY IDENTIFICATION */}
          <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>FLY IDENTIFICATION</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>Photo or describe what you see</div></div><div style={{display:"flex",gap:4}}><button onClick={()=>identifyFly(false)} disabled={flyAnalyzing} style={{background:"transparent",border:`1px solid ${P.rust}`,borderRadius:6,padding:"8px 10px",color:P.rust,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyAnalyzing?"...":"🔍 Describe"}</button><button onClick={()=>identifyFly(true)} disabled={flyAnalyzing} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 10px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyAnalyzing?"Analysing...":"📷 Photo"}</button></div></div>
            {/* GUIDED OBSERVATIONS */}
            <div style={{marginTop:8,display:"grid",gap:6}}>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:3}}>SIZE (MM)</div><div style={{display:"flex",gap:3}}>{["<5mm","5-8mm","8-12mm","12-18mm","18-25mm"].map(s=><button key={s} onClick={()=>setFlyQ(q=>({...q,size:q.size===s?"":s}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.size===s?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.size===s?P.rustS:"transparent",color:flyQ.size===s?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>)}</div></div>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:3}}>COLOUR</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{["Dark olive","Pale olive","Brown","Black","Grey","Cream","Yellow","Ginger"].map(c=><button key={c} onClick={()=>setFlyQ(q=>({...q,colour:q.colour===c?"":c}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.colour===c?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.colour===c?P.rustS:"transparent",color:flyQ.colour===c?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>)}</div></div>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:3}}>BEHAVIOUR</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{["Sitting in film","Skittering on surface","Drifting upright","Flat on surface","Skating across","Flying low","In a swarm","Crawling on rocks"].map(b=><button key={b} onClick={()=>setFlyQ(q=>({...q,behaviour:q.behaviour===b?"":b}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.behaviour===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.behaviour===b?P.rustS:"transparent",color:flyQ.behaviour===b?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div></div>
            </div>
            {flyAnalysis&&!flyAnalysis.error&&<div style={{marginTop:10,padding:"10px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
              {flyAnalysis.quality==="unusable"?<div><div style={{fontSize:9,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyAnalysis.quality_note}</div></div>:<>
                <div style={{fontSize:13,fontWeight:700,color:P.tx}}>{flyAnalysis.likely_species||flyAnalysis.common_group||"Unknown"}</div>
                <div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyAnalysis.order} — {flyAnalysis.life_stage} — ~{flyAnalysis.size_mm}</div>
                {flyAnalysis.quality==="poor"&&<div style={{fontSize:9,color:P.rust,marginTop:2}}>⚠ {flyAnalysis.quality_note}</div>}
                <div style={{fontSize:9,color:P.txM,marginTop:4,lineHeight:1.6}}>{flyAnalysis.identification_notes}</div>
                {flyAnalysis.matching_artificials?.length>0&&<div style={{marginTop:6}}><div style={{fontSize:8,fontWeight:700,color:P.gn,marginBottom:2}}>MATCH WITH</div>{flyAnalysis.matching_artificials.map((f,i)=><div key={i} style={{fontSize:10,color:P.gn,fontWeight:600}}>{f}</div>)}</div>}
                {flyAnalysis.tie_on_now&&<div style={{marginTop:6,padding:"6px 8px",background:P.gn+"18",borderRadius:5,border:`1px solid ${P.gn}40`}}><div style={{fontSize:8,fontWeight:700,color:P.gn}}>TIE ON NOW</div><div style={{fontSize:12,fontWeight:700,color:P.tx,marginTop:2}}>{flyAnalysis.tie_on_now}</div></div>}
                {flyAnalysis.fishing_notes&&<div style={{fontSize:9,color:P.txM,marginTop:4,fontStyle:"italic"}}>{flyAnalysis.fishing_notes}</div>}
              </>}
            </div>}
            {flyAnalysis?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Analysis failed — {flyAnalysis.error}</div>}
            {flyAnalysis?.textId&&flyAnalysis.summary&&<div style={{marginTop:10,padding:"10px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
              <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI IDENTIFICATION</div>
              <div style={{fontSize:11,color:P.tx,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{flyAnalysis.summary}</div>
            </div>}
          </div>
          {spp.filter(s=>s.score>15).length>0&&<div style={{marginBottom:12}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>ACTIVE NOW</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{spp.filter(s=>s.score>15).map(sp=><div key={sp.id} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:sp.id==="danica"?P.rustS:"transparent"}}><div style={{display:"flex",gap:8}}><div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat],marginTop:6}}/><div style={{flex:1}}><span style={{fontSize:12,fontWeight:700,color:sp.id==="danica"?P.rust:P.tx}}>{sp.cm}</span><div style={{fontSize:9,color:P.txD,marginTop:2}}>Hook {sp.hk} · {sp.sz}</div><div style={{fontSize:9,color:P.rust,marginTop:1}}>{FLYMAP[sp.id]||""} — <i>{FLYCONF[sp.id]||""}</i></div></div><div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700,color:hC(sp.score)}}>{sp.score}</div><div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div></div></div></div>)}</div></div>}
          {spp.filter(s=>s.score>0&&s.score<=15).length>0&&<div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>EXPECTED LATER THIS SEASON</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{spp.filter(s=>s.score>0&&s.score<=15).map(sp=><div key={sp.id} style={{padding:"8px 12px",borderBottom:`1px solid ${P.bd}`,opacity:0.5}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:P.txM}}>{sp.cm}</span><span style={{fontSize:11,color:P.txD}}>{sp.score}% — {sp.lb}</span></div></div>)}</div></div>}
        </div>}

        {/* ═══ FLY BOX ═══ */}
        {tab==="fly"&&<div>
          {/* SCAN MY FLY BOX */}
          <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>SCAN MY FLY BOX</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>Photograph your box — AI picks the best fly</div></div><button onClick={scanFlyBox} disabled={flyBoxScanning} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyBoxScanning?"Scanning...":"📷 Scan"}</button></div>
            {flyBoxScan&&!flyBoxScan.error&&flyBoxScan.quality!=="unusable"&&<div style={{marginTop:10}}>
              {/* TIE ON NOW */}
              {flyBoxScan.tie_on_now&&<div style={{padding:"10px 12px",background:P.gn+"18",borderRadius:8,border:`1px solid ${P.gn}40`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:3}}>TIE ON NOW</div>
                <div style={{fontSize:15,fontWeight:700,color:P.tx}}>{flyBoxScan.tie_on_now.name}</div>
                <div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.5}}>{flyBoxScan.tie_on_now.reason}</div>
              </div>}
              {/* BACKUP */}
              {flyBoxScan.backup&&<div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em",marginBottom:2}}>BACKUP</div>
                <div style={{fontSize:12,fontWeight:700,color:P.tx}}>{flyBoxScan.backup.name}</div>
                <div style={{fontSize:9,color:P.txM,marginTop:1}}>{flyBoxScan.backup.reason}</div>
              </div>}
              {/* FISHING PLAN */}
              {flyBoxScan.fishing_plan&&<div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em",marginBottom:2}}>SESSION PLAN</div>
                <div style={{fontSize:10,color:P.txM,lineHeight:1.6}}>{flyBoxScan.fishing_plan}</div>
              </div>}
              {/* FLIES IDENTIFIED */}
              {flyBoxScan.flies_identified?.length>0&&<div onClick={()=>toggle("boxflies")} style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em"}}>IDENTIFIED {flyBoxScan.flies_identified.length} FLIES</div><span style={{fontSize:10,color:P.txD}}>{ex.boxflies?"−":"+"}</span></div>
                {ex.boxflies&&<div style={{marginTop:6}}>{flyBoxScan.flies_identified.map((f,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:i<flyBoxScan.flies_identified.length-1?`1px solid ${P.bd}`:""}}><span style={{fontSize:10,color:P.tx,fontWeight:600}}>{f.name}</span><span style={{fontSize:9,color:P.txD}}>#{f.size_estimate} · {f.type}</span></div>)}</div>}
              </div>}
              {/* MISSING */}
              {flyBoxScan.missing?.length>0&&<div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em",marginBottom:3}}>YOU'RE MISSING</div>
                {flyBoxScan.missing.map((f,i)=><div key={i} style={{fontSize:10,color:P.txM,lineHeight:1.5}}>• {f}</div>)}
              </div>}
              {flyBoxScan.box_notes&&<div style={{fontSize:9,color:P.txD,lineHeight:1.5,fontStyle:"italic"}}>{flyBoxScan.box_notes}</div>}
            </div>}
            {flyBoxScan&&flyBoxScan.quality==="unusable"&&<div style={{marginTop:8,padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.rust}40`}}>
              <div style={{fontSize:9,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div>
              <div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyBoxScan.quality_note||"Open the box flat, good light, shoot from above."}</div>
            </div>}
            {flyBoxScan?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Scan failed — {flyBoxScan.error}</div>}
          </div>
          <div style={{display:"flex",gap:4,marginBottom:10}}>{[{id:"dry",l:"Dries"},{id:"emerger",l:"Emergers"},{id:"nymph",l:"Nymphs"}].map(t=><button key={t.id} onClick={()=>{setFlyT(t.id);setOpenFly(null)}} style={{flex:1,padding:"9px",borderRadius:8,border:flyT===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyT===t.id?P.rustS:"transparent",color:flyT===t.id?P.rust:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>)}</div>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{FLIES[flyT].map((f,i)=>{const isM=f.mt.some(m=>actIds.includes(m));const isO=openFly===f.nm;return<div key={i}><div onClick={()=>setOpenFly(isO?null:f.nm)} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent",cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:700,color:isM?P.rust:P.tx}}>{f.nm}</span>{isM&&<span style={{fontSize:7,fontWeight:700,color:P.rust,marginLeft:6,background:P.rustB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}<div style={{fontSize:9,color:P.txD,marginTop:2}}>#{f.sz} — <i>{f.cf}</i></div></div><span style={{color:P.txD,fontSize:11}}>{isO?"−":"+"}</span></div></div>{isO&&<div style={{padding:12,background:P.c2,borderBottom:`1px solid ${P.bd}`}}><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{f.nt}</div></div>}</div>})}</div>
        </div>}

        {/* ═══ OUTLOOK ═══ */}
        {tab==="outlook"&&<div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>8-WEEK FORECAST</div><div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{lr.map((w,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}><div style={{minWidth:68}}><div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div></div><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:28}}>Mayfly</span><div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div><span style={{fontSize:9,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span></div></div><span style={{fontSize:9,color:P.txD}}>~{w.pt}°C</span></div>)}</div></div>}

        {/* ═══ REPORTS — with persistent sessions ═══ */}
        {tab==="reports"&&<div>
          {/* SEASON STATS */}
          {sessions.length>0&&(()=>{
            const totalFish=sessions.reduce((s,sess)=>s+(sess.fish||0),0);
            const pb=sessions.reduce((best,sess)=>{const w=parseFloat(sess.big)||0;return w>best?w:best},0);
            const rivers={};const beats={};const flies={};
            sessions.forEach(s=>{rivers[s.river]=(rivers[s.river]||0)+(s.fish||0);if(s.beat||s.bt)beats[s.beat||s.bt]=(beats[s.beat||s.bt]||0)+(s.fish||0);if(s.fly)flies[s.fly]=(flies[s.fly]||0)+1});
            const favRiver=Object.entries(rivers).sort((a,b)=>b[1]-a[1])[0];
            const favBeat=Object.entries(beats).sort((a,b)=>b[1]-a[1])[0];
            const favFly=Object.entries(flies).sort((a,b)=>b[1]-a[1])[0];
            return<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:14,marginBottom:14}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.gn,marginBottom:8}}>YOUR SEASON</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:P.tx}}>{sessions.length}</div><div style={{fontSize:8,color:P.txD}}>Sessions</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:P.gn}}>{totalFish}</div><div style={{fontSize:8,color:P.txD}}>Fish</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:P.rust}}>{pb>0?pb+"lb":"--"}</div><div style={{fontSize:8,color:P.txD}}>PB</div></div>
              </div>
              <div style={{display:"grid",gap:3}}>
                {favRiver&&<div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span style={{color:P.txD}}>Favourite river</span><span style={{color:P.tx,fontWeight:600}}>{favRiver[0]} ({favRiver[1]} fish)</span></div>}
                {favBeat&&<div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span style={{color:P.txD}}>Best beat</span><span style={{color:P.tx,fontWeight:600}}>{favBeat[0]} ({favBeat[1]} fish)</span></div>}
                {favFly&&<div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span style={{color:P.txD}}>Go-to fly</span><span style={{color:P.gn,fontWeight:600}}>{favFly[0]}</span></div>}
              </div>
            </div>;
          })()}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD}}>LOG A SESSION</div><button onClick={()=>{setShowForm(!showForm);setFPhotos([])}} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showForm?"CANCEL":"+ LOG"}</button></div>
          {showForm&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:14,marginBottom:14}}><div style={{display:"grid",gap:8}}>
            {/* DATE */}
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>DATE</div><input type="date" value={fDate} onChange={e=>setFDate(e.target.value)} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%",colorScheme:light?"light":"dark"}}/></div>
            {/* BEAT */}
            {rv.b&&rv.b.length>0&&<div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEAT</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>setFBeat(b)} style={{padding:"4px 8px",borderRadius:4,border:fBeat===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fBeat===b?P.rustS:"transparent",color:fBeat===b?P.rust:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div></div>}
            {/* PHOTOS */}
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>PHOTOS</div>
              <button onClick={addManualPhotos} style={{width:"100%",padding:"10px",borderRadius:6,border:`1px dashed ${P.bd}`,background:"transparent",color:P.txM,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>📷 Add Photos from Camera Roll</button>
              {fPhotos.length>0&&<div style={{display:"flex",gap:6,marginTop:8,overflowX:"auto",paddingBottom:4}}>{fPhotos.map((p,i)=><div key={i} style={{position:"relative",flexShrink:0}}>
                <img src={`data:image/jpeg;base64,${p.b64}`} alt="" style={{width:56,height:56,borderRadius:6,objectFit:"cover"}}/>
                {p.time&&<div style={{fontSize:7,color:P.txD,textAlign:"center",marginTop:2}}>{p.time}</div>}
                <button onClick={()=>setFPhotos(fp=>fp.filter((_,j)=>j!==i))} style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:8,background:P.rust,border:"none",color:"#fff",fontSize:9,cursor:"pointer",lineHeight:"16px",padding:0}}>✕</button>
              </div>)}</div>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>CAUGHT</div><input value={fFish} onChange={e=>setFish(e.target.value)} placeholder="0" type="number" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BIGGEST</div><input value={fBig} onChange={e=>setFBig(e.target.value)} placeholder="2.5lb" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
            </div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEST FLY</div><input value={fFly} onChange={e=>setFFly(e.target.value)} placeholder="CDC #16" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>RATING</div><div style={{display:"flex",gap:4}}>{["Poor","Fair","Good","Excellent"].map(r=><button key={r} onClick={()=>setFRating(r)} style={{flex:1,padding:"7px",borderRadius:5,border:fRating===r?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fRating===r?P.rustS:"transparent",color:fRating===r?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r}</button>)}</div></div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>NOTES</div><textarea value={fNotes} onChange={e=>setFNotes(e.target.value)} placeholder="What happened?" rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
            <button onClick={saveManualSession} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:P.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SAVE SESSION</button>
          </div></div>}

          {/* YOUR SESSIONS — archive with AI overview */}
          {sessions.length>0&&<div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD}}>YOUR SESSIONS ({sessions.length})</div><button onClick={generateArchiveOverview} disabled={archiveLoading} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:8,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{archiveLoading?"Analysing...":"✨ AI Overview"}</button></div>

            {archiveOverview&&<div style={{padding:"10px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
              <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI SEASON OVERVIEW</div>
              <div style={{fontSize:11,color:P.tx,lineHeight:1.7,fontStyle:"italic"}}>{archiveOverview}</div>
            </div>}

            <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{sessions.slice(0,20).map((s,i)=><div key={s.id||i}>
              <div onClick={()=>setExpandedSession(expandedSession===(s.id||i)?null:(s.id||i))} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:11,fontWeight:600}}>{s.river} — {s.beat||s.bt}</span><div style={{display:"flex",gap:4,alignItems:"center"}}>{s.rating&&<span style={{fontSize:7,fontWeight:700,padding:"1px 5px",borderRadius:3,color:s.rating==="Excellent"?P.gn:s.rating==="Good"?P.gn:P.rust,background:(s.rating==="Excellent"||s.rating==="Good"?P.gn:P.rust)+"18"}}>{s.rating.toUpperCase()}</span>}<span style={{fontSize:10,fontWeight:700,color:s.fish>=3?P.gn:s.fish>0?P.rust:P.txD}}>{s.fish||0}</span></div></div>
                <div style={{display:"flex",gap:8,fontSize:9,color:P.txD,alignItems:"center"}}><span>{s.d}</span>{s.dur&&s.dur!=="Manual"&&<span>{s.dur}</span>}{(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).length>0&&<span>📷 {(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).length}</span>}{(s.photos||[]).length>0&&!(s.catches||[]).some(c=>c.photo&&c.photo.length>200)&&<span>📷 {s.photos.length}</span>}{s.score&&<span>Score: {s.score}</span>}<span style={{marginLeft:"auto"}}>{expandedSession===(s.id||i)?"−":"+"}</span></div>
              </div>
              {expandedSession===(s.id||i)&&<div style={{padding:"10px 12px",background:P.c2,borderBottom:`1px solid ${P.bd}`}}>
                {s.time&&<div style={{fontSize:9,color:P.txD,marginBottom:4}}>Started {s.time} · {s.user}</div>}
                {/* RATING BAR */}
                {s.rating&&<div style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:s.rating==="Excellent"?P.gn+"20":s.rating==="Good"?P.gn+"15":s.rating==="Fair"?P.rust+"20":P.txD+"20",marginBottom:6}}><span style={{fontSize:10,fontWeight:700,color:s.rating==="Excellent"?P.gn:s.rating==="Good"?P.gn:s.rating==="Fair"?P.rust:P.txD}}>{s.rating}</span></div>}
                {/* PHOTOS GALLERY — from catches or manual uploads */}
                {(()=>{
                  const photos=(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).concat((s.photos||[]).filter(p=>p.b64));
                  if(!photos.length)return null;
                  return<div style={{marginBottom:8}}>
                    <div style={{fontSize:8,color:P.txD,marginBottom:4}}>PHOTOS ({photos.length})</div>
                    <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>{photos.map((p,pi)=><div key={pi} style={{flexShrink:0,textAlign:"center"}}>
                      <img src={`data:image/jpeg;base64,${p.photo||p.b64}`} alt="" style={{width:80,height:80,borderRadius:8,objectFit:"cover",border:`2px solid ${P.bd}`}}/>
                      <div style={{fontSize:7,color:P.txD,marginTop:2}}>{p.timestamp||p.time||""}</div>
                    </div>)}</div>
                  </div>;
                })()}
                {/* CATCH DETAILS */}
                {s.catches&&s.catches.length>0&&<div style={{marginTop:4}}>
                  <div style={{fontSize:8,color:P.txD,marginBottom:3}}>CATCHES</div>
                  {s.catches.map((c,ci)=><div key={ci} style={{padding:"6px 0",borderBottom:ci<s.catches.length-1?`1px solid ${P.bd}`:""}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      {c.photo&&c.photo.length>200&&<img src={`data:image/jpeg;base64,${c.photo}`} alt="" style={{width:48,height:48,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
                      <div style={{flex:1}}>
                        <div style={{fontSize:10,color:P.tx,fontWeight:500}}>{c.species||"Unknown"}{c.weight?` — ${c.weight}lb`:""}{c.wild?` (${c.wild})`:""}</div>
                        <div style={{fontSize:8,color:P.txD}}>{c.timestamp}{c.fly?` on ${c.fly}`:""}{c.notes?` — ${c.notes}`:""}</div>
                      </div>
                    </div>
                    {/* AI ANALYSIS on archived catch */}
                    {c.analysis&&!c.analysis.error&&!c.analysis.unusable&&<div style={{marginTop:4,padding:"5px 8px",background:P.bg,borderRadius:4,border:`1px solid ${P.bd}`}}>
                      <div style={{fontSize:7,fontWeight:700,color:P.gn,letterSpacing:"0.1em"}}>AI ID</div>
                      <div style={{fontSize:9,color:P.tx}}>{c.analysis.species} — {c.analysis.species_confidence} · {c.analysis.wild_stocked}</div>
                      {c.analysis.weight_range&&<div style={{fontSize:8,color:P.txM}}>Est. {c.analysis.weight_range} · {c.analysis.condition}</div>}
                    </div>}
                    {c.analysis&&c.analysis.unusable&&<div style={{fontSize:8,color:P.rust,marginTop:2}}>Photo too unclear for AI identification</div>}
                    {c.photo&&c.photo.length>200&&<button onClick={()=>analyzeArchiveCatch(s.id,ci)} disabled={archiveAnalyzing===`${s.id}-${ci}`} style={{marginTop:4,padding:"3px 8px",borderRadius:4,border:`1px solid ${archiveAnalyzing===`${s.id}-${ci}`?P.bd:P.gn}`,background:"transparent",color:archiveAnalyzing===`${s.id}-${ci}`?P.txD:P.gn,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{archiveAnalyzing===`${s.id}-${ci}`?"Analysing...":c.analysis?"Re-analyse":"🐟 AI Identify"}</button>}
                  </div>)}
                </div>}
                {/* SESSION INFO */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:6,marginBottom:4}}>
                  {s.fly&&<div style={{fontSize:10,color:P.gn}}>Fly: {s.fly}</div>}
                  {s.big&&<div style={{fontSize:10,color:P.txM}}>Biggest: {s.big}</div>}
                  {s.topHatch&&<div style={{fontSize:10,color:P.txM}}>Hatch: {s.topHatch}</div>}
                  {s.dur&&<div style={{fontSize:10,color:P.txM}}>Duration: {s.dur}</div>}
                </div>
                {s.notes&&<div style={{fontSize:10,color:P.txM,lineHeight:1.5,marginBottom:4}}>{s.notes}</div>}
                {s.summary&&<div style={{padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`,marginTop:4}}><div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI SUMMARY</div><div style={{fontSize:10,color:P.tx,lineHeight:1.6,fontStyle:"italic"}}>{s.summary}</div></div>}
              </div>}
            </div>)}</div>
          </div>}

          {/* RIVER REPORTS */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>RIVER REPORTS</div>
          {rpts.length>0?<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{rpts.map((r,i)=><div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}><span style={{fontSize:7,fontWeight:700,color:srcC[r.src]||P.txM,border:`1px solid ${(srcC[r.src]||P.txM)}33`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span><span style={{fontSize:11,fontWeight:600}}>{r.bt}</span><span style={{fontSize:9,color:P.txD}}>{r.d}</span>{r.v&&<span style={{marginLeft:"auto",fontSize:7,color:P.gn,fontWeight:600}}>✓ verified</span>}</div><div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>{r.tx}</div></div>)}</div>:<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:20,textAlign:"center",color:P.txM,fontSize:12}}>No reports yet for this river.</div>}
        </div>}

        {/* ═══ DIAGNOSE ═══ */}
        {tab==="tips"&&<div>
          {/* READ THE WATER */}
          <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>READ THE WATER</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>Photo a stretch and AI shows where to fish</div></div><button onClick={analyzeRiver} disabled={riverAnalyzing} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 12px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{riverAnalyzing?"Analysing...":"📷 Analyse"}</button></div>
            {riverAnalysis&&!riverAnalysis.error&&riverAnalysis.quality!=="unusable"&&<div style={{marginTop:10,display:"grid",gap:6}}>
              <div style={{padding:"8px 10px",background:P.gn+"18",borderRadius:6,border:`1px solid ${P.gn}40`}}><div style={{fontSize:8,fontWeight:700,color:P.gn}}>WHERE TO STAND</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.6}}>{riverAnalysis.where_to_stand}</div></div>
              <div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.rust}}>WHERE TO CAST</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.6}}>{riverAnalysis.where_to_cast}</div></div>
              {riverAnalysis.likely_fish_lies?.length>0&&<div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.txD}}>FISH LIES</div>{riverAnalysis.likely_fish_lies.map((l,li)=><div key={li} style={{fontSize:9,color:P.txM,marginTop:2}}>• {l}</div>)}</div>}
              <div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.txD}}>APPROACH</div><div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.6}}>{riverAnalysis.approach}</div></div>
              <div style={{fontSize:10,color:P.txM,lineHeight:1.6,fontStyle:"italic"}}>{riverAnalysis.overall}</div>
              <button onClick={()=>speak(riverAnalysis.overall+" "+riverAnalysis.where_to_stand+" "+riverAnalysis.where_to_cast)} style={{padding:"6px",borderRadius:5,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>🔊 Read aloud</button>
            </div>}
            {riverAnalysis&&riverAnalysis.quality==="unusable"&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Need a clearer photo. Try landscape showing the full stretch.</div>}
            {riverAnalysis?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Analysis failed. Check your connection.</div>}
          </div>

          {/* ASK THE GUIDE */}
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"10px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>ASK THE GUIDE</div><div style={{fontSize:9,color:P.txM,marginTop:2}}>Tap mic, ask anything</div></div>
              <button onClick={startListening} style={{background:listening?P.rust:P.gn,border:"none",borderRadius:"50%",width:36,height:36,color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{listening?"...":"🎙"}</button>
            </div>
            {voiceResult&&<div style={{marginTop:8,padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}>
              <div style={{fontSize:11,color:P.tx,lineHeight:1.7}}>{voiceResult}</div>
            </div>}
          </div>

          {/* SCENARIOS */}
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8}}>WHAT'S HAPPENING?</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>{SC.map(sc=><button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)} style={{padding:"14px 10px",borderRadius:8,border:scenario===sc.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:scenario===sc.id?P.rustS:P.c1,color:scenario===sc.id?P.rust:P.tx,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}><div style={{fontSize:16,marginBottom:4}}>{sc.i}</div>{sc.l}</button>)}</div>
          {scenario&&<div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>{SC.find(s=>s.id===scenario)?.a.map((a,i)=><div key={i} style={{padding:14,borderBottom:`1px solid ${P.bd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:13,fontWeight:700,color:P.tx,flex:1}}>{a.h}</div><span style={{fontSize:14,fontWeight:700,color:a.c>=80?P.gn:P.rust}}>{a.c}%</span></div><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{a.d}</div></div>)}</div>}
        </div>}
      </div>

      {/* FEEDBACK QUESTIONNAIRE */}
      {showFeedback&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:P.c1,borderRadius:12,border:`1px solid ${P.bd}`,padding:20,maxWidth:360,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
          {!fbSubmitted?<>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>BETA FEEDBACK</div><button onClick={()=>setShowFeedback(false)} style={{background:"none",border:"none",color:P.txD,fontSize:16,cursor:"pointer"}}>✕</button></div>
            <div style={{fontSize:11,color:P.txM,lineHeight:1.6,marginBottom:14}}>Your feedback directly shapes Ephemera. Be brutal — we need honesty over politeness.</div>
            <div style={{display:"grid",gap:12}}>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:6}}>OVERALL RATING</div><div style={{display:"flex",gap:4}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setFbRating(n)} style={{flex:1,padding:"10px",borderRadius:6,border:fbRating>=n?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fbRating>=n?P.rustS:"transparent",color:fbRating>=n?P.rust:P.txD,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>)}</div></div>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>WHAT'S WORKING BEST?</div><textarea value={fbBest} onChange={e=>setFbBest(e.target.value)} placeholder="What do you actually use? What's valuable?" rows={2} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>WHAT NEEDS FIXING?</div><textarea value={fbWorse} onChange={e=>setFbWorse(e.target.value)} placeholder="What's broken, confusing, or missing?" rows={2} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>FEATURE YOU WANT MOST?</div><textarea value={fbFeature} onChange={e=>setFbFeature(e.target.value)} placeholder="If Ephemera could do one more thing..." rows={2} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
              <button onClick={submitFeedback} style={{width:"100%",padding:12,borderRadius:8,border:"none",background:P.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SUBMIT FEEDBACK</button>
            </div>
          </>:<div style={{textAlign:"center",padding:20}}>
            <div style={{fontSize:22,marginBottom:8}}>🎣</div>
            <div style={{fontSize:14,fontWeight:700,color:P.tx,marginBottom:4}}>Thank you</div>
            <div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>Your feedback helps build something worth using. Tight lines.</div>
            <button onClick={()=>{setShowFeedback(false);setFbSubmitted(false);setFbRating(0);setFbBest("");setFbWorse("");setFbFeature("")}} style={{marginTop:14,padding:"8px 20px",borderRadius:6,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>CLOSE</button>
          </div>}
        </div>
      </div>}

      <div style={{textAlign:"center",padding:14,borderTop:`1px solid ${P.bd}`}}>
        <Logo s={22}/>
        <div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em",marginTop:4}}>EPHEMERA / Timely insight. Better days.</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:8}}>
          <span style={{fontSize:7,color:P.rust,fontWeight:700,background:P.rustS,padding:"2px 6px",borderRadius:3}}>BETA</span>
          <button onClick={()=>setShowFeedback(true)} style={{fontSize:8,color:P.txD,background:"none",border:`1px solid ${P.bd}`,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>Give Feedback</button>
        </div>
        {user?.betaTester&&<div style={{fontSize:8,color:P.gn,marginTop:6}}>✓ Beta tester — {user.name}</div>}
      </div>

      {/* GALLERY LIGHTBOX */}
      {gallery&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}} onClick={()=>setGallery(null)}>
        <button onClick={()=>setGallery(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",color:"#fff",fontSize:24,cursor:"pointer",zIndex:301}}>✕</button>
        <div onClick={e=>e.stopPropagation()} style={{maxWidth:"90vw",maxHeight:"80vh",position:"relative"}}>
          <img src={gallery.items[gallery.idx]?.src} alt="" style={{maxWidth:"90vw",maxHeight:"75vh",borderRadius:8,objectFit:"contain"}}/>
        </div>
        <div style={{color:"#fff",fontSize:11,marginTop:8,opacity:0.7}}>{gallery.items[gallery.idx]?.caption||""}</div>
        <div style={{display:"flex",gap:12,marginTop:12}}>
          {gallery.idx>0&&<button onClick={e=>{e.stopPropagation();setGallery(g=>({...g,idx:g.idx-1}))}} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:6,padding:"8px 16px",color:"#fff",fontSize:14,cursor:"pointer"}}>←</button>}
          <span style={{color:"#fff",fontSize:10,padding:"8px 0"}}>{gallery.idx+1} / {gallery.items.length}</span>
          {gallery.idx<gallery.items.length-1&&<button onClick={e=>{e.stopPropagation();setGallery(g=>({...g,idx:g.idx+1}))}} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:6,padding:"8px 16px",color:"#fff",fontSize:14,cursor:"pointer"}}>→</button>}
        </div>
      </div>}

      {/* NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>{[{id:"guide",l:"Guide"},{id:"hatches",l:"Hatches"},{id:"fly",l:"Flies"},{id:"reports",l:"Log"},{id:"tips",l:"Tips"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"10px 0 7px",border:"none",background:"none",color:tab===n.id?P.gn:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:9,fontWeight:tab===n.id?700:500}}>{n.l}</div></button>)}</div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
