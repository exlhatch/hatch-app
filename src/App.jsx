import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══ EPHEMERA — A calm expert beside you ═══ */

const Logo=({s=24})=><svg width={s} height={s} viewBox="0 0 394 404" fill="none"><path fill="currentColor" d="M107.572 22.362C125.145 22.121 142.148 22.308 158.832 22.306L267.446 22.31C276.357 22.295 288.05 21.863 296.527 23.834C312.479 27.543 323.689 33.75 335.237 45.127C350.069 59.737 358.359 78.982 358.403 99.808L358.507 268.721C358.504 280.878 359.126 291.633 356.502 303.554C353.417 317.735 346.35 330.742 336.13 341.046C321.026 356.444 302.176 364.074 280.758 364.265L124.018 364.31C112.813 364.32 100.538 364.854 89.619 362.272C55.313 354.16 29.766 322.879 29.309 287.5C29.135 274.098 29.269 260.842 29.258 247.516L29.185 122.705C29.177 110.758 28.321 97.224 30.863 85.618C39.118 47.927 69.663 23.587 107.572 22.362Z"/><path fill="#F1F0EE" d="M268.25 71.759C270.779 71.555 272.636 90.057 272.778 92.808C275.158 138.928 260.802 193.884 219.151 219.374C195.752 233.694 165.102 238.523 138.449 231.979C135.847 231.356 132.432 230.558 130.221 229.14C130.54 221.382 138.102 203.655 142.072 196.04C164.098 153.796 202.026 114.913 240.649 87.315C247.764 82.23 260.325 74.504 268.25 71.759Z"/><path fill="currentColor" d="M265.644 77.977C266.564 78.911 266.793 81.653 266.944 82.832C268.325 93.55 268.628 104.378 267.85 115.156C261.34 118.59 254.743 121.193 248.274 124.991C212.081 146.238 179.673 173.637 151.639 204.808C147.604 209.294 143.117 213.709 139.278 218.354C138.214 218.247 140.094 213.636 141.071 211.096C145.29 200.127 151.881 188.911 158.184 178.979C187.902 139.316 213.933 113.244 242.229 92.386C248.979 87.411 258.093 81.344 265.644 77.977Z"/><path fill="currentColor" d="M145.453 218.504C171.395 187.723 201.568 160.773 235.072 138.458C245.033 131.932 256.065 125.297 266.974 120.476C265.656 134.944 263.344 146.152 258.322 159.826C257.433 162.247 256.365 166.652 254.141 167.912C250.957 169.717 246.918 171.145 243.477 172.445L207.834 187.373C187.976 196.411 169.104 208.713 149.548 218.237C147.435 219.308 144.282 220.895 142.067 221.696L145.453 218.504Z"/><path fill="currentColor" d="M251.29 174.31L251.628 174.988C245.612 186.715 237.344 197.992 227.301 206.598C208.325 222.861 180.792 231.493 155.908 229.385C151.86 229.042 147.88 228.74 143.852 228.465C142.605 228.474 142.085 228.023 142.242 227.551C143.209 226.693 146.565 225.039 147.935 224.292C152.488 221.799 157.054 219.329 161.632 216.882C173.169 210.695 184.816 204.028 196.393 198.044C208.041 192.057 219.937 186.561 232.047 181.573C236.109 179.89 247.215 175.337 251.29 174.31Z"/><path fill="#F1F0EE" d="M197.861 251.113C202.818 250.983 313.785 253.489 313.735 254.827C313.066 255.437 312.316 255.786 311.403 255.839C295.886 256.742 279.948 257.137 264.435 257.043C238.534 256.651 212.629 256.563 186.725 256.779C158.796 257.546 130.849 257.451 102.926 256.496C78.621 255.69 71.571 255.704 70.809 254.677C70.713 253.945 70.873 253.048 71.613 252.563C114.86 250.867 156.562 252.385 197.861 251.113Z"/><path fill="#F1F0EE" d="M244.601 273.12C249.511 273.091 278.029 273.325 280.547 275.314C280.48 276.643 279.156 277.45 244.723 278.523C218.305 278.463 190.668 279.219 172.756 279.643C154.838 279.646 136.926 279.226 128.037 278.955C110.467 278.274 100.876 277.159 100.519 275.609C100.938 275.08 104.025 273.124 162.554 273.758C189.904 273.818 217.254 273.605 244.601 273.12Z"/><path fill="#F1F0EE" d="M192.722 294.863C245.228 294.556 247.085 296.58 246.808 298.545C244.323 299.324 229.617 299.197 226.234 299.315C199.358 299.52 186.109 299.949 135.351 300.595C131.865 298.47 131.529 296.45 131.767 296.254C133.608 294.739 173.342 295.317 177.813 295.273C182.784 295.184 187.754 295.048 192.722 294.863Z"/><path fill="#F1F0EE" d="M176.619 313.107C185.071 313.11 188.75 313.219 213.194 314.573C213.15 316.373 213.133 317.234 205.999 317.465C190.837 318.04 177.008 318.747 165.466 316.946C164.936 315.287 165.365 314.685 167.831 313.529C173.794 313.273 176.619 313.107 176.619 313.107Z"/></svg>;
const Wordmark=({w=120})=><svg width={w} height={w*168/1054} viewBox="0 0 1054 168" fill="none"><path fill="currentColor" d="M43.2 40.278C63.602 40.604 73.341 40.752 101.646 41.005C102.539 42.011 102.198 43.398 102.199 45.058C100.819 46.442 80.429 45.382 76.818 45.318C64.536 45.356 59.673 45.341 59.559 56.695C59.565 68.05 59.691 79.404 92.223 80.012C92.451 81.655 92.33 82.253 92.075 83.9C63.793 84.409 59.642 84.441 59.505 96.658C59.521 108.876 59.69 121.093 86.46 120.918C101.578 119.003 104.271 122.934 104.099 124.763C103.187 125.713 97.909 126.589 79.903 126.188L43.353 126.189C43.505 98.111 43.751 68.276 43.2 40.278Z"/><path fill="currentColor" d="M161.122 40.9L180.915 41.122C212.129 39.457 223.289 50.004 231.936 58.176C231.209 73.83 222.896 81.999 214.899 89.858C205.303 90.811 194.666 90.846 177.295 90.833C176.914 102.495 177.024 114.485 177.005 126.178L161.13 126.228L161.122 40.9Z"/><path fill="currentColor" d="M283.169 40.319C299.505 40.548 299.606 79.387 315.733 79.582C331.861 79.584 347.987 79.393 348.249 66.283C348.111 53.401 348.245 40.318 364.59 40.362C364.022 60.71 365.051 82.536 364.526 102.984C364.937 123.514 364.297 126.218 348.305 126.234C348.242 98.737 348.157 85.02 332.554 84.465C315.359 84.86 299.66 84.934 299.432 126.197C288.684 126.168 283.429 126.179 282.828 97.998C283.145 68.592 283.169 40.319 283.169 40.319Z"/><path fill="currentColor" d="M425.327 40.468C447.909 40.687 459.119 40.771 484.153 41.067C484.992 42.004 484.784 43.182 484.885 44.668C475.555 45.457 472.999 45.313 441.861 45.36C441.826 56.668 441.869 67.975 441.99 79.283C470.559 78.924 474.29 79.59 475.061 80.621C474.679 83.143 474.596 84.552 442.066 84.574C441.898 96.731 441.877 108.89 442.003 121.047C471.744 120.949 486.61 120.558 486.56 126.143C445.37 126.175 425.423 126.233 425.326 97.68C425.699 68.975 425.327 40.468 425.327 40.468Z"/><path fill="currentColor" d="M542.174 40.917L559.212 41.036C578.218 82.526 587.553 102.957 597.139 82.827C615.442 40.903 631.86 41.051 632.222 69.182C631.981 98.08 631.861 126.221 615.504 126.203C615.429 84.942 615.442 64.546 609.429 67.278C590.764 110.977 582.943 125.901 581.891 126.317C551.976 63.425 548.37 54.924 547.633 70.899C548.401 88.092 548.115 104.137 547.923 125.778C543.736 126.256 542.088 126.258 542.351 97.812C542.379 69.364 542.174 40.917 542.174 40.917Z"/><path fill="currentColor" d="M694.033 40.423C733.139 40.491 750.463 40.786 753.428 41.603C754.089 43.309 753.428 44.402 744.961 45.325L710.301 45.422C710.128 67.998 710.251 79.285 742.541 79.643C743.107 81.067 742.751 83.801 714.905 84.591C710.304 84.672 710.162 96.803 710.27 121.067C736.787 121.228 749.923 120.713 755.175 123.42L754.703 124.638C737.949 126.14 733.846 126.134 694.132 126.225L694.033 40.423Z"/><path fill="currentColor" d="M812.91 40.943C860.545 39.334 869.192 46.63 888.329 62.778C876.901 82.852 855.398 87.648 864.418 100.213C874.865 113.609 884.244 126.031 866.539 126.15C865.939 126.164 865.632 126.108 863.393 125.7C841.305 93.485 838.318 89.014 828.612 89.007L828.5 126.175L812.338 126.228L812.409 63.175C812.399 59.873 811.725 42.505 812.91 40.943Z"/><path fill="currentColor" d="M964.501 38.436C965.992 38.997 966.78 39.517 967.244 40.419C975.597 57.935 979.513 66.436 1006.49 126.224L988.199 126.265C980.423 107.051 977.516 100.471 967.706 99.981C951.149 99.877 943.107 100.497 932.034 126.221L925.262 126.129C942.338 88.451 950.424 69.725 964.501 38.436Z"/></svg>;

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
const BETA_CODE="EPHEMERABETA";
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
  const[authStep,setAuthStep]=useState("beta");/* beta → register → confirm → done */
  const[authName,setAuthName]=useState("");const[authEmail,setAuthEmail]=useState("");
  const[authPw,setAuthPw]=useState("");const[authPw2,setAuthPw2]=useState("");
  const[betaCode,setBetaCode]=useState("");const[betaErr,setBetaErr]=useState("");
  const[authErr,setAuthErr]=useState("");
  const[optNewsletter,setOptNewsletter]=useState(true);const[optBeta,setOptBeta]=useState(true);
  const[confirmCode,setConfirmCode]=useState("");const[confirmErr,setConfirmErr]=useState("");
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

  /* SESSION TRACKING */
  const[sessions,setSessions]=useState(()=>getSessions());
  const[showForm,setShowForm]=useState(false);
  const[onRiver,setOnRiver]=useState(false);
  const[sessionStart,setSessionStart]=useState(null);
  const[sessionFish,setSessionFish]=useState([]);/* array of fish objects */
  const[sessionNotes,setSessionNotes]=useState("");
  const[sessionTick,setSessionTick]=useState(0);
  const[showCatchForm,setShowCatchForm]=useState(false);
  const[catchType,setCatchType]=useState("Trout");
  const[catchWeight,setCatchWeight]=useState("");
  const[catchFly,setCatchFly]=useState("");
  const[catchWild,setCatchWild]=useState("Wild");
  const[catchNotes,setCatchNotes]=useState("");

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
  const startSession=()=>{setOnRiver(true);setSessionStart(Date.now());setSessionFish([]);setSessionNotes("");setSessionTick(0)};
  const endSession=()=>{
    if(sessionStart){
      const fishCount=sessionFish.length;const bestFly=sessionFish.map(f=>f.fly).filter(Boolean).reduce((a,b,_,arr)=>{const counts={};arr.forEach(x=>counts[x]=(counts[x]||0)+1);return(counts[a]||0)>=(counts[b]||0)?a:b},"");
      const biggestFish=sessionFish.reduce((a,f)=>parseFloat(f.weight||0)>parseFloat(a)?f.weight:a,"0");
      const sess={id:Date.now(),d:new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(sessionStart).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),dur:fmtDur(Date.now()-sessionStart),river:rv.n,beat,fish:fishCount,big:biggestFish!=="0"?biggestFish+"lb":"",fly:bestFly,notes:sessionNotes,user:user?.name||"Anon",score:cond.pct,topHatch:topH?.cm||"",catches:sessionFish};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
      sbInsert("sessions",{user_email:user?.email,user_name:user?.name,river:rv.n,beat,fish:fishCount,biggest:biggestFish!=="0"?biggestFish+"lb":"",best_fly:bestFly,notes:sessionNotes+"\n\nCatches: "+JSON.stringify(sessionFish),duration:sess.dur,score:cond.pct,top_hatch:topH?.cm||""});
    }
    setOnRiver(false);setSessionStart(null);setShowCatchForm(false);
  };
  const logCatch=()=>{
    const fish={type:catchType,weight:catchWeight,fly:catchFly,wild:catchWild,notes:catchNotes,time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})};
    setSessionFish(f=>[...f,fish]);
    setCatchType("Trout");setCatchWeight("");setCatchFly("");setCatchWild("Wild");setCatchNotes("");setShowCatchForm(false);
  };

  /* SAVE MANUAL SESSION */
  const saveManualSession=()=>{
    if(fBeat&&(fNotes||fFish)){
      const now=new Date();
      const sess={id:Date.now(),d:now.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,big:fBig,fly:fFly,notes:fNotes,rating:fRating,user:fName||user?.name||"Anon",dur:"Manual"};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
      /* Write to Supabase */
      sbInsert("sessions",{user_email:user?.email,user_name:user?.name||fName,river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,biggest:fBig,best_fly:fFly,notes:fNotes,rating:fRating,duration:"Manual"});
      setFBeat("");setFish("");setFBig("");setFFly("");setFNotes("");setFRating("");setShowForm(false);
    }
  };

  /* ── ONBOARDING FLOW ── */
  if(!user||!user.confirmed)return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:D.bg,minHeight:"100vh",color:D.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}input{font-family:inherit;-webkit-appearance:none}input:focus{outline:none}`}</style>
      <div style={{color:D.tx}}><Logo s={56}/></div>
      <div style={{fontSize:16,fontWeight:600,letterSpacing:"0.25em",marginTop:12}}>EPHEMERA</div>
      <div style={{fontSize:10,color:D.txD,marginTop:4,marginBottom:32}}>Timely insight. Better days.</div>

      {/* STEP 1: BETA CODE */}
      {authStep==="beta"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:8}}>PRIVATE BETA</div>
        <div style={{fontSize:12,color:D.txM,lineHeight:1.6,marginBottom:16}}>Ephemera is currently in private beta. Enter your access code to continue.</div>
        <div style={{marginBottom:10}}><div style={{fontSize:8,color:D.txD,marginBottom:4}}>BETA ACCESS CODE</div><input value={betaCode} onChange={e=>{setBetaCode(e.target.value.toUpperCase());setBetaErr("")}} placeholder="Enter code" style={{background:D.c2,border:`1px solid ${betaErr?D.rust:D.bd}`,borderRadius:6,padding:"12px",color:D.tx,fontSize:16,fontFamily:"inherit",width:"100%",letterSpacing:"0.15em",textAlign:"center",fontWeight:700}}/></div>
        {betaErr&&<div style={{fontSize:10,color:D.rust,marginBottom:8}}>{betaErr}</div>}
        <button onClick={()=>{if(betaCode===BETA_CODE){setAuthStep("register");setBetaErr("")}else setBetaErr("Invalid code. Contact hello@ephemera.fish for access.")}} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>ENTER</button>
        <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:16,opacity:0.5}}>Don't have a code? Email hello@ephemera.fish</div>
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
          <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer"}} onClick={()=>{setAuthStep("beta");setAuthErr("")}}>Need an account? <span style={{color:D.rust}}>Enter beta code</span></div>
        </div>
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
      </div>}
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
          <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{color:P.tx,display:"flex",alignItems:"center",gap:8}}><Logo s={28}/><Wordmark w={100}/></div></div>
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
            <div style={{width:8,height:8,borderRadius:4,background:P.gn,animation:"pulse 2s infinite"}}/>
            <div><div style={{fontSize:10,fontWeight:700,color:P.gn}}>ON THE RIVER</div><div style={{fontSize:9,color:P.txM}}>{sessionStart?fmtDur(Date.now()-sessionStart+(sessionTick*0)):""} · {sessionFish.length} fish</div></div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>setShowCatchForm(true)} style={{background:P.gn,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ CATCH</button>
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
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.gn}}>SESSION ACTIVE — {beat}</div><div style={{fontSize:9,color:P.txD}}>Updated {new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div></div>
            <div style={{fontSize:13,fontWeight:700,color:P.tx,lineHeight:1.5}}>{isNight?"Night time. Rest up for tomorrow.":cC>60&&cT>=12?"Cloud thickening — hatches should build. Stay on dries.":cC<30&&cT>=14?"Bright conditions. Fish the shade. Consider emergers in the film.":cW>14?"Wind making presentation tough. Try the sheltered bank.":cT<10?"Cool water. Keep nymphing. Watch for olive activity after 11am.":nowWin&&nowWin.cur&&nowWin.cur.hi>=4?"Hatch building now. Watch for rises and match the size.":"Conditions stable. Work upstream, cover water methodically."}</div>
            {nowWin&&nowWin.nxt&&!isNight&&<div style={{fontSize:10,color:P.gn,marginTop:6}}>Next: {nowWin.nxt.hr}:00 — {nowWin.nxt.note}</div>}

            {/* CATCH FORM */}
            {showCatchForm&&<div style={{marginTop:10,padding:10,background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.gn,marginBottom:8}}>LOG A CATCH</div>
              <div style={{display:"grid",gap:6}}>
                <div><div style={{fontSize:8,color:P.txD,marginBottom:3}}>SPECIES</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{["Trout","Grayling","Sea Trout","Salmon","Other"].map(t=><button key={t} onClick={()=>setCatchType(t)} style={{padding:"4px 8px",borderRadius:4,border:catchType===t?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:catchType===t?"#7A9E7E18":"transparent",color:catchType===t?P.gn:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  <div><div style={{fontSize:8,color:P.txD,marginBottom:3}}>WEIGHT (LB)</div><input value={catchWeight} onChange={e=>setCatchWeight(e.target.value)} placeholder="e.g. 2.5" type="number" step="0.25" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:5,padding:"6px 8px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/></div>
                  <div><div style={{fontSize:8,color:P.txD,marginBottom:3}}>WILD / STOCKED</div><div style={{display:"flex",gap:3}}>{["Wild","Stocked"].map(w=><button key={w} onClick={()=>setCatchWild(w)} style={{flex:1,padding:"6px",borderRadius:4,border:catchWild===w?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:catchWild===w?"#7A9E7E18":"transparent",color:catchWild===w?P.gn:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{w}</button>)}</div></div>
                </div>
                <div><div style={{fontSize:8,color:P.txD,marginBottom:3}}>FLY USED</div><input value={catchFly} onChange={e=>setCatchFly(e.target.value)} placeholder="e.g. CDC Shuttlecock #16" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:5,padding:"6px 8px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/></div>
                <div><div style={{fontSize:8,color:P.txD,marginBottom:3}}>REMARKS</div><input value={catchNotes} onChange={e=>setCatchNotes(e.target.value)} placeholder="Rising steadily, took first cast..." style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:5,padding:"6px 8px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/></div>
                <div style={{display:"flex",gap:4}}><button onClick={logCatch} style={{flex:1,padding:"8px",borderRadius:6,border:"none",background:P.gn,color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>LOG CATCH</button><button onClick={()=>setShowCatchForm(false)} style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button></div>
              </div>
            </div>}

            {/* FISH CAUGHT THIS SESSION */}
            {sessionFish.length>0&&<div style={{marginTop:8}}>
              <div style={{fontSize:8,color:P.txD,letterSpacing:"0.1em",marginBottom:4}}>CATCHES TODAY ({sessionFish.length})</div>
              {sessionFish.map((f,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<sessionFish.length-1?`1px solid ${P.bd}`:""}}>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <span style={{fontSize:9,color:P.txD}}>{f.time}</span>
                  <span style={{fontSize:10,fontWeight:600,color:f.type==="Trout"?P.gn:f.type==="Grayling"?P.rust:P.tx}}>{f.type}</span>
                  {f.weight&&<span style={{fontSize:9,color:P.txM}}>{f.weight}lb</span>}
                  <span style={{fontSize:8,color:f.wild==="Wild"?P.gn:P.txD}}>{f.wild}</span>
                </div>
                {f.fly&&<span style={{fontSize:9,color:P.rust}}>{f.fly}</span>}
              </div>)}
            </div>}

            <div style={{marginTop:8}}><div style={{fontSize:8,color:P.txD,marginBottom:4}}>SESSION NOTES</div><textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="What's happening on the water..." rows={2} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 8px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.4}}/></div>
          </div>}

          {/* NIGHTTIME */}
          {isNight&&<div style={{padding:"16px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:12,textAlign:"center"}}><div style={{fontSize:22,marginBottom:6}}>☾</div><div style={{fontSize:14,fontWeight:700,color:P.tx}}>Night fishing</div><div style={{fontSize:11,color:P.txM,marginTop:4,lineHeight:1.6}}>No hatch activity. Rest up — the river will be here tomorrow.</div></div>}

          {/* HATCH OF THE DAY — dominates */}
          {!isNight&&topH&&topH.score>5&&<div style={{background:P.rustS,borderRadius:12,border:`1px solid ${P.rustB}`,padding:16,marginBottom:12}}>
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
            <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{fontSize:14,fontWeight:700,color:nowWin.cur.hi>=3?P.gn:nowWin.cur.hi>=1?P.rust:P.txD}}>{nowWin.cur.hr}:00</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:P.tx}}>{nowWin.cur.note}</div>{nowWin.cur.fly&&<div style={{fontSize:9,color:P.gn,marginTop:2}}>{nowWin.cur.hatches.join(", ")} → {nowWin.cur.fly}</div>}</div></div>
            {nowWin.nxt&&<div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.bd}`,display:"flex",gap:10,alignItems:"center",opacity:0.7}}><div style={{fontSize:12,fontWeight:700,color:nowWin.nxt.hi>=3?P.gn:P.txD}}>{nowWin.nxt.hr}:00</div><div style={{flex:1}}><div style={{fontSize:11,color:P.txM}}>{nowWin.nxt.note}</div></div></div>}
          </div>}

          {/* FULL TIMELINE — collapsible */}
          {timeline.length>0&&<><div onClick={()=>toggle("tl")} style={{background:P.c1,borderRadius:ex.tl?"10px 10px 0 0":10,border:`1px solid ${P.bd}`,padding:"12px 14px",marginBottom:ex.tl?0:10,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>TODAY ON THE RIVER</div><div style={{fontSize:11,color:P.txM,marginTop:2}}>Full day timeline</div></div><span style={{color:P.txD,fontSize:11}}>{ex.tl?"−":"+"}</span></div>
          {ex.tl&&<div style={{background:P.c1,borderRadius:"0 0 10px 10px",border:`1px solid ${P.bd}`,borderTop:"none",padding:"6px 14px 10px",marginBottom:10}}>
            {timeline.map((e,i)=><div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<timeline.length-1?`1px solid ${P.bd}`:""}}><div style={{width:32,textAlign:"right",flexShrink:0}}><div style={{fontSize:12,fontWeight:700,color:e.hi>=3?P.gn:e.hi>=1?P.rust:P.txD}}>{e.hr}:00</div></div><div style={{flex:1}}><div style={{fontSize:11,color:P.tx,lineHeight:1.5}}>{e.note}</div>{e.fly&&<div style={{fontSize:9,color:P.gn,marginTop:1}}>{e.hatches.join(", ")} → {e.fly}</div>}</div></div>)}
          </div>}</>}

          {/* 7-DAY */}
          {wxDays.length>0&&<><div onClick={()=>toggle("7d")} style={{background:P.c1,borderRadius:ex["7d"]?"10px 10px 0 0":10,border:`1px solid ${P.bd}`,padding:"12px 14px",marginBottom:ex["7d"]?0:10,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>7-DAY OUTLOOK</div><div style={{fontSize:11,color:P.txM,marginTop:2}}>Compare days</div></div><span style={{color:P.txD,fontSize:11}}>{ex["7d"]?"−":"+"}</span></div>
          {ex["7d"]&&<div style={{background:P.c1,borderRadius:"0 0 10px 10px",border:`1px solid ${P.bd}`,borderTop:"none",overflow:"hidden",marginBottom:10}}>
            <div style={{overflowX:"auto"}}><div style={{display:"flex",minWidth:wxDays.length*68}}>{wxDays.map((d,i)=>{const futDoy=DOY+i;const pjH=H.reduce((s,sp)=>{if(futDoy<sp.s-10||futDoy>sp.e+10)return s;let sf=0;if(futDoy>=sp.s&&futDoy<=sp.e){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=Math.max(0,1-((futDoy-m)/r)**2)}return s+sf*(sp.t===1?30:sp.t===2?12:5)},0);let sc=0;sc+=Math.min(30,pjH*0.30);const avg=((d.aH||14)+(d.aL||8))/2;sc+=avg>=13?15:avg>=10?10:5;sc+=(d.rain||0)<2?7:4;sc+=(d.windMax||8)<=10?15:(d.windMax||8)<=18?7:2;sc+=7+Math.round((rv.q||5)*1.5);sc=Math.round(Math.min(100,sc));return<div key={i} onClick={e=>{e.stopPropagation();setGDay(gDay===i?-1:i)}} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRight:i<wxDays.length-1?`1px solid ${P.bd}`:"",background:sc>=75?P.rustS:gDay===i?P.c2:"transparent",cursor:"pointer"}}><div style={{fontSize:9,fontWeight:600,color:i===0?P.rust:P.tx}}>{d.dn}</div><div style={{fontSize:14,fontWeight:700,color:scClr(sc),marginTop:3}}>{sc}</div><div style={{fontSize:7,color:scClr(sc)}}>{scLb(sc)}</div><div style={{fontSize:10,fontWeight:600,color:P.tx,marginTop:2}}>{d.aH||"--"}°/{d.aL||"--"}°</div>{(d.rain||0)>0&&<div style={{fontSize:7,color:P.txD}}>{d.rain}mm</div>}</div>})}</div></div>
            {gDay>=0&&wxDays[gDay]&&<div style={{padding:"8px 12px",borderTop:`1px solid ${P.bd}`}}>{buildTimeline(wxDays[gDay].hrs,cT).filter((_,i)=>i%2===0).map((e,i)=><div key={i} style={{display:"flex",gap:8,padding:"3px 0"}}><span style={{fontSize:10,fontWeight:700,color:e.hi>=3?P.gn:P.txD,minWidth:30}}>{e.hr}:00</span><span style={{fontSize:10,color:P.txM,flex:1}}>{e.note}</span>{e.fly&&<span style={{fontSize:9,color:P.gn,flexShrink:0}}>{e.fly}</span>}</div>)}</div>}
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
        <div style={{color:P.txD}}><Logo s={22}/></div>
        <div style={{fontSize:7,color:P.txD,letterSpacing:"0.1em",marginTop:4}}>EPHEMERA / Timely insight. Better days.</div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:8}}>
          <span style={{fontSize:7,color:P.rust,fontWeight:700,background:P.rustS,padding:"2px 6px",borderRadius:3}}>BETA</span>
          <button onClick={()=>setShowFeedback(true)} style={{fontSize:8,color:P.txD,background:"none",border:`1px solid ${P.bd}`,borderRadius:4,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>Give Feedback</button>
        </div>
        {user?.betaTester&&<div style={{fontSize:8,color:P.gn,marginTop:6}}>✓ Beta tester — {user.name}</div>}
      </div>

      {/* NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.c1,borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>{[{id:"guide",l:"Guide",i:"◉"},{id:"hatches",l:"Hatches",i:"◎"},{id:"fly",l:"Flies",i:"◈"},{id:"outlook",l:"Outlook",i:"◑"},{id:"reports",l:"Reports",i:"◇"},{id:"diagnose",l:"Diagnose",i:"⊕"}].map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"9px 0 6px",border:"none",background:"none",color:tab===n.id?P.rust:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}><div style={{fontSize:13,lineHeight:1}}>{n.i}</div><div style={{fontSize:7,fontWeight:600,marginTop:2}}>{n.l}</div></button>)}</div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
