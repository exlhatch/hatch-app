import { useState, useMemo, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   E P H E M E R A
   Timely Insight. Better Days.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══ BRAND MARK — exact SVG paths ═══ */
const HatchWing = ({ size = 32, color = "#F3F0E8", rustLine = false }) => (
  <svg width={size} height={size} viewBox="100 40 320 380" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <g stroke={color}>
      <path d="M176 306 C205 197 286 103 382 62 C360 158 297 250 176 306 Z" strokeWidth="18"/>
      <path d="M179 304 C232 245 292 189 374 68" strokeWidth="10"/>
      <path d="M221 269 C252 261 287 246 323 221" strokeWidth="9"/>
      <path d="M252 222 C281 215 312 202 344 178" strokeWidth="9"/>
      <path d="M118 334 H394" strokeWidth="14"/>
      <path d="M151 368 H357" strokeWidth="10"/>
    </g>
    <path d="M198 398 H310" stroke={rustLine ? "#C36A3D" : color} strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

const WordMark = ({ size = 140 }) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <HatchWing size={28} color="#DDE1DE" rustLine />
    <div>
      <div style={{fontFamily:"var(--sn)",fontSize:14,fontWeight:600,color:"#DDE1DE",letterSpacing:"0.22em"}}>EPHEMERA</div>
    </div>
  </div>
);

const FooterMark = () => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
    <HatchWing size={48} color="#5F6F7B" rustLine />
    <div style={{fontFamily:"var(--sn)",fontSize:12,fontWeight:600,color:"#5F6F7B",letterSpacing:"0.25em"}}>EPHEMERA</div>
    <div style={{fontFamily:"var(--sn)",fontSize:8,fontWeight:500,color:"#5F6F7B",letterSpacing:"0.15em",opacity:0.7}}>TIMELY INSIGHT. BETTER DAYS.</div>
  </div>
);

/* ═══ PALETTE ═══ */
const P = {
  spruce:"#1F2D2A", glacier:"#5F6F7B", stone:"#8A948F", fog:"#DDE1DE", rust:"#C36A3D", bone:"#F3F0E8",
  bg:"#161E1B", c1:"#1B2421", c2:"#212C28", c3:"#283632",
  bd:"#2E3B36", tx:"#DDE1DE", txM:"#8A948F", txD:"#5F6F7B",
  rustS:"#C36A3D18", rustB:"#C36A3D40",
};

/* ═══ RIVERS ═══ */
const RIVERS = [
  {id:"test",n:"River Test",ea:"Test",d:"The quintessential chalkstream. Birthplace of dry fly fishing.",lat:51.09,lng:-1.49,beats:[
    {n:"Broadlands",la:50.988,lo:-1.499},{n:"Timsbury",la:51.015,lo:-1.488},{n:"Mottisfont",la:51.057,lo:-1.533},{n:"Horsebridge",la:51.078,lo:-1.533},{n:"Park Stream",la:51.079,lo:-1.530},{n:"Stockbridge",la:51.089,lo:-1.494},{n:"Leckford",la:51.112,lo:-1.478},{n:"Longparish",la:51.178,lo:-1.401},{n:"Whitchurch",la:51.225,lo:-1.337},{n:"Laverstoke",la:51.228,lo:-1.296}]},
  {id:"itchen",n:"River Itchen",ea:"Itchen",d:"Premier chalkstream. Technical, cathedral water.",lat:51.06,lng:-1.30,beats:[
    {n:"Itchen Abbas",la:51.089,lo:-1.227},{n:"Martyr Worthy",la:51.083,lo:-1.262},{n:"Abbotts Barton",la:51.072,lo:-1.313},{n:"Twyford",la:51.023,lo:-1.328}]},
  {id:"kennet",n:"River Kennet",ea:"Kennet",d:"Diverse chalkstream. Strong olives, fine grayling.",lat:51.42,lng:-1.52,beats:[
    {n:"Ramsbury",la:51.443,lo:-1.596},{n:"Littlecote",la:51.428,lo:-1.541},{n:"Hungerford",la:51.413,lo:-1.515},{n:"Kintbury",la:51.399,lo:-1.448}]},
  {id:"anton",n:"River Anton",ea:"Anton",d:"Intimate Test tributary. Early hatches.",lat:51.19,lng:-1.50,beats:[
    {n:"Goodworth Clatford",la:51.184,lo:-1.513},{n:"Anton Lakes",la:51.205,lo:-1.481}]},
  {id:"avon",n:"Hampshire Avon",ea:"Avon Hampshire",d:"Broad, powerful. Excellent mayfly water.",lat:51.17,lng:-1.78,beats:[
    {n:"Amesbury",la:51.172,lo:-1.774},{n:"Netheravon",la:51.226,lo:-1.792},{n:"Salisbury",la:51.068,lo:-1.798}]},
  {id:"wylye",n:"River Wylye",ea:"Wylye",d:"Beautiful, underrated. Superb evening rises.",lat:51.17,lng:-2.06,beats:[
    {n:"Heytesbury",la:51.186,lo:-2.099},{n:"Codford",la:51.169,lo:-2.059}]},
];

/* ═══ HATCHES ═══ */
const H = [
  {id:"danica",cm:"The Mayfly",nm:"Ephemera danica",cat:"m",t:1,sz:"20-25mm",hk:"10-12 LD",s:135,e:172,tMn:12,tMx:18,pk:[12,13,14,15,16],nt:"THE event. Fish abandon all caution. Duns ride the surface. Spinner falls extraordinary."},
  {id:"vulgata",cm:"Dark Mackerel",nm:"E. vulgata",cat:"m",t:2,sz:"18-22mm",hk:"10-12",s:140,e:178,tMn:13,tMx:17,pk:[13,14,15,16],nt:"Overlaps danica. Darker body, mackerel markings."},
  {id:"ldo",cm:"Large Dark Olive",nm:"Baetis rhodani",cat:"o",t:2,sz:"10-12mm",hk:"14-16",s:60,e:150,tMn:7,tMx:14,pk:[10,11,12,13],nt:"Spring staple. Overcast days best."},
  {id:"mo",cm:"Medium Olive",nm:"Baetis vernus",cat:"o",t:3,sz:"8-10mm",hk:"16",s:100,e:180,tMn:10,tMx:16,pk:[11,12,13,14],nt:"Consistent all season."},
  {id:"bwo",cm:"Blue-winged Olive",nm:"Serratella ignita",cat:"o",t:2,sz:"9-11mm",hk:"14-16",s:150,e:290,tMn:12,tMx:18,pk:[17,18,19,20],nt:"The great evening fly. Sherry spinners legendary."},
  {id:"ib",cm:"Iron Blue",nm:"Baetis niger",cat:"o",t:2,sz:"6-8mm",hk:"16-18",s:105,e:165,tMn:8,tMx:14,pk:[11,12,13,14],nt:"Loves foul weather. Small but irresistible."},
  {id:"pw",cm:"Pale Watery",nm:"Baetis fuscatus",cat:"o",t:3,sz:"6-8mm",hk:"16-18",s:125,e:260,tMn:12,tMx:18,pk:[14,15,16,17,18],nt:"Afternoon and evening. Very selective fish."},
  {id:"ss",cm:"Small Spurwing",nm:"C. luteolum",cat:"o",t:3,sz:"5-7mm",hk:"18-20",s:135,e:270,tMn:13,tMx:18,pk:[15,16,17,18],nt:"Tiny but plentiful."},
  {id:"ymd",cm:"Yellow May Dun",nm:"H. sulphurea",cat:"o",t:3,sz:"12-14mm",hk:"14",s:135,e:180,tMn:12,tMx:17,pk:[18,19,20],nt:"Beautiful evening emerger."},
  {id:"caen",cm:"Angler's Curse",nm:"Caenis spp.",cat:"o",t:3,sz:"3-5mm",hk:"20-22",s:155,e:250,tMn:15,tMx:20,pk:[5,6,7,19,20,21],nt:"Dawn and dusk. Incredibly small."},
  {id:"gran",cm:"Grannom",nm:"B. subnubilus",cat:"c",t:2,sz:"10-12mm",hk:"14-16",s:100,e:130,tMn:9,tMx:14,pk:[11,12,13,14,15],nt:"Mass April hatches."},
  {id:"sedge",cm:"Sedges",nm:"Trichoptera",cat:"c",t:2,sz:"8-18mm",hk:"12-16",s:135,e:275,tMn:13,tMx:20,pk:[19,20,21],nt:"Evening skitterers. Exciting sport."},
  {id:"haw",cm:"Hawthorn Fly",nm:"Bibio marci",cat:"t",t:2,sz:"12-14mm",hk:"12-14",s:108,e:135,tMn:10,tMx:16,pk:[11,12,13,14,15,16],nt:"Breezy days. Dangly legs."},
  {id:"bg",cm:"Black Gnat",nm:"Bibio johannis",cat:"t",t:3,sz:"5-8mm",hk:"16-18",s:120,e:250,tMn:12,tMx:20,pk:[12,13,14,15,16,17],nt:"All summer swarms."},
  {id:"smut",cm:"Reed Smuts",nm:"Simulium spp.",cat:"t",t:3,sz:"2-4mm",hk:"20-24",s:135,e:270,tMn:13,tMx:20,pk:[10,11,12,13,14,15,16,17],nt:"Fish sip from the film."},
];
const CC = {m:P.rust,o:"#7A9E7E",c:"#8B7355",t:P.glacier};
const CL = {m:"MAYFLY",o:"UPWINGED",c:"CADDIS",t:"TERRESTRIAL"};

/* ═══ FLY BOX ═══ */
const FL = {
  dry:[
    {nm:"Grey Wulff",sz:"10-14",mt:["danica","vulgata"],ef:5,nt:"Classic mayfly. Floats forever."},
    {nm:"Spent Gnat",sz:"10-12",mt:["danica","vulgata"],ef:5,nt:"Spinner fall essential."},
    {nm:"Kite's Imperial",sz:"14-16",mt:["ldo","mo"],ef:5,nt:"THE olive pattern."},
    {nm:"Sherry Spinner",sz:"14-16",mt:["bwo"],ef:5,nt:"BWO spinner. Evening essential."},
    {nm:"Iron Blue Dun",sz:"16-18",mt:["ib"],ef:4,nt:"Foul weather days."},
    {nm:"Adams",sz:"14-18",mt:["ldo","mo","bwo"],ef:4,nt:"Searching pattern."},
    {nm:"Last Hope",sz:"16-20",mt:["pw","ss","caen"],ef:4,nt:"Ultra-selective fish."},
    {nm:"Elk Hair Caddis",sz:"12-16",mt:["sedge"],ef:4,nt:"Static or skated."},
    {nm:"G&H Sedge",sz:"10-14",mt:["sedge"],ef:4,nt:"Skate it. Explosive takes."},
    {nm:"Griffith's Gnat",sz:"18-24",mt:["smut","caen"],ef:3,nt:"Smuts and caenis."},
    {nm:"Hawthorn Fly",sz:"12-14",mt:["haw"],ef:3,nt:"Breezy days. Trailing legs."},
  ],
  emerger:[
    {nm:"Klinkhamer Special",sz:"12-18",mt:["ldo","mo","bwo","danica"],ef:5,nt:"Most versatile chalkstream fly."},
    {nm:"Danica Emerger",sz:"10-12 LD",mt:["danica","vulgata"],ef:5,nt:"THE fly during the mayfly."},
    {nm:"CDC Shuttlecock",sz:"14-20",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Tie sparse. Devastating."},
    {nm:"Suspender Buzzer",sz:"14-18",mt:["ldo","mo"],ef:4,nt:"In the film. Patience."},
    {nm:"F Fly",sz:"16-20",mt:["pw","ss","smut","caen"],ef:4,nt:"Two CDC feathers. Simple, deadly."},
    {nm:"Grannom Pupa",sz:"14-16",mt:["gran"],ef:3,nt:"Green body. Subsurface."},
  ],
  nymph:[
    {nm:"Pheasant Tail Nymph",sz:"14-18",mt:["ldo","mo","bwo","ib","pw"],ef:5,nt:"Desert island nymph."},
    {nm:"Gold-Ribbed Hare's Ear",sz:"14-16",mt:["ldo","mo","bwo"],ef:5,nt:"Buggy. Works when nothing else does."},
    {nm:"Sawyer's Killer Bug",sz:"14-16",mt:["ldo","mo","pw"],ef:4,nt:"Cold water killer."},
    {nm:"Danica Nymph",sz:"10-12 LD",mt:["danica","vulgata"],ef:4,nt:"Pre-hatch essential. Deep gravel."},
    {nm:"Czech Nymph",sz:"12-16",mt:["ldo","mo","gran"],ef:3,nt:"Check beat rules first."},
  ],
};

/* ═══ REPORTS ═══ */
const RPT = {
  test:[
    {d:"May 8",bt:"Stockbridge",au:"River Keeper",src:"Field",tx:"Sustained danica from 12:30. Fish up everywhere. Spinners falling by 4:30. Best day yet.",v:true},
    {d:"May 7",bt:"Park Stream",au:"Beat Guide",src:"Guide",tx:"First danica midday. Two good fish on emergers. Water 13.8C. Park Stream fishes ahead of the main river.",v:true},
    {d:"May 7",bt:"Mottisfont",au:"@chalkstream_life",src:"Social",tx:"First danica spotted. Shucks on the ranunculus. One fish to a Grey Wulff.",v:false},
    {d:"May 6",bt:"Leckford",au:"Estate Keeper",src:"Estate",tx:"Strong olives. Hawthorn about. Ranunculus thriving. Water climbing.",v:true},
    {d:"May 5",bt:"Stockbridge",au:"Test Valley FC",src:"Club",tx:"Iron blues and olives. Ranunculus excellent. Early danica seen.",v:true},
    {d:"May 4",bt:"Horsebridge",au:"Beat Keeper",src:"Field",tx:"Afternoon olive hatch good. Water 12.1C. Trout in fine condition.",v:true},
  ],
  itchen:[{d:"May 8",bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Steady olives. Handful of early danica.",v:true}],
  kennet:[{d:"May 8",bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Olive hatch midday. Grayling on nymphs.",v:false}],
  anton:[{d:"May 7",bt:"Goodworth Clatford",au:"Guide",src:"Guide",tx:"Olives from 10am. Water 13.1C. Anton fishes mayfly before the main Test.",v:true}],
  avon:[{d:"May 7",bt:"Amesbury",au:"Salisbury AC",src:"Club",tx:"Avon in fine form. Big fish showing. Danica imminent.",v:true}],
  wylye:[{d:"May 6",bt:"Heytesbury",au:"@wylye_ff",src:"Social",tx:"Gorgeous evening rise. Pale wateries.",v:false}],
};

/* ═══ API LAYER ═══ */
const cache = {};
async function fetchWx(la, lo) {
  const k = `w${la.toFixed(1)}_${lo.toFixed(1)}`; if (cache[k]) return cache[k];
  try { const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,precipitation_probability,pressure_msl,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/London&forecast_days=7`);
    const d = await r.json(); cache[k] = d; return d; } catch { return null; }
}
async function fetchEA(name) {
  const k = `e_${name}`; if (cache[k]) return cache[k];
  try { const r = await fetch(`https://environment.data.gov.uk/hydrology/id/stations?riverName=${encodeURIComponent(name)}&_limit=5`);
    const d = await r.json(); const out = { level: null, temp: null };
    for (const s of (d.items || [])) { for (const m of (s.measures || [])) {
      const id = typeof m === "string" ? m : m["@id"]; const p = (typeof m === "string" ? "" : m.parameterName || m.parameter || "").toLowerCase();
      if (p.includes("level") && !out.levelId) out.levelId = id; if (p.includes("temp") && !out.tempId) out.tempId = id; }}
    if (out.levelId) { try { const r2 = await fetch(out.levelId.startsWith("http") ? `${out.levelId}/readings?latest` : `https://environment.data.gov.uk/hydrology/id/measures/${out.levelId}/readings?latest`); const d2 = await r2.json(); if (d2.items?.[0]) out.level = d2.items[0].value; } catch {} }
    if (out.tempId) { try { const r3 = await fetch(out.tempId.startsWith("http") ? `${out.tempId}/readings?latest` : `https://environment.data.gov.uk/hydrology/id/measures/${out.tempId}/readings?latest`); const d3 = await r3.json(); if (d3.items?.[0]) out.temp = d3.items[0].value; } catch {} }
    cache[k] = out; return out; } catch { return null; }
}

/* ═══ PREDICTION ═══ */
function simTemp(lat) { const dy = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5); return +(6 + 8 * Math.sin((dy - 80) * Math.PI / 183) + (lat - 51) * -0.8).toFixed(1); }
const DOY = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);

function predict(wt) {
  return H.map(sp => {
    let sF = 0; if (DOY >= sp.s && DOY <= sp.e) { const m = (sp.s + sp.e) / 2, r = (sp.e - sp.s) / 2; sF = Math.max(0, 1 - ((DOY - m) / r) ** 2); } else if (DOY >= sp.s - 14 && DOY < sp.s) sF = (DOY - sp.s + 14) / 28;
    let tF = 0; const tm = (sp.tMn + sp.tMx) / 2, tr = (sp.tMx - sp.tMn) / 2;
    if (wt >= sp.tMn && wt <= sp.tMx) tF = Math.max(0, 1 - ((wt - tm) / (tr * 1.2)) ** 2); else if (wt >= sp.tMn - 2) tF = Math.max(0, (wt - sp.tMn + 2) / 4);
    const sc = Math.round(Math.max(0, Math.min(100, (sF * 0.55 + tF * 0.35) * 100)));
    return { ...sp, score: sc, lb: sc > 70 ? "Strong" : sc > 40 ? "Moderate" : sc > 15 ? "Sparse" : "Unlikely" };
  }).sort((a, b) => b.score - a.score);
}

function hInt(wt, hr) {
  let hi = 0; H.forEach(sp => { if (DOY < sp.s - 10 || DOY > sp.e + 10) return;
    let sf = 0; if (DOY >= sp.s && DOY <= sp.e) { const m = (sp.s + sp.e) / 2, r = (sp.e - sp.s) / 2; sf = Math.max(0, 1 - ((DOY - m) / r) ** 2); }
    const hf = sp.pk.includes(hr) ? 1 : sp.pk.includes(hr - 1) || sp.pk.includes(hr + 1) ? 0.4 : 0.05;
    let tf = 0; if (wt >= sp.tMn && wt <= sp.tMx) { const tm = (sp.tMn + sp.tMx) / 2; tf = Math.max(0, 1 - ((wt - tm) / ((sp.tMx - sp.tMn) / 2 * 1.3)) ** 2); }
    hi += Math.max(0, sf * hf * tf * (sp.t === 1 ? 3 : sp.t === 2 ? 1.5 : 0.8));
  }); return Math.min(10, Math.max(0, hi));
}

function genLR(wt) {
  const now = new Date();
  return Array.from({ length: 8 }, (_, w) => {
    const s = new Date(now); s.setDate(s.getDate() + w * 7); const e = new Date(s); e.setDate(e.getDate() + 6);
    const md = DOY + w * 7 + 3, pt = +(wt + w * 0.4 + Math.sin((md - 80) * Math.PI / 183) * 1.5).toFixed(1);
    let ds = 0; if (md >= 125 && md <= 182) ds = Math.max(0, 1 - ((md - 153) / 28) ** 2) * (pt >= 12 && pt <= 18 ? 1 : pt >= 10 ? 0.5 : 0.2);
    let oa = 0; H.forEach(sp => { if (md >= sp.s && md <= sp.e) oa += Math.max(0, 1 - ((md - (sp.s + sp.e) / 2) / ((sp.e - sp.s) / 2)) ** 2) * (sp.t === 1 ? 3 : sp.t === 2 ? 1.5 : 0.8); });
    return { l: w === 0 ? "This week" : w === 1 ? "Next week" : `${s.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} - ${e.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`, pt, ds: +(ds * 100).toFixed(0), oa: +Math.min(10, oa).toFixed(1), cf: w < 2 ? "High" : w < 4 ? "Med" : "Low" };
  });
}

/* ═══ KIT ═══ */
function getKit(temp, level, topH) {
  const tippet = topH?.id === "danica" || topH?.id === "vulgata" ? "3X-4X (6-8lb)" : topH?.cat === "o" && (topH.sz || "").includes("6") ? "6X-7X (2-3lb)" : "5X (4lb)";
  const tips = [
    "Rub mud or leader sink on the last 3ft of tippet. Critical in clear water.",
    level < 0.4 ? "Low water: stay low, longer casts. Fish spook easily." : level > 0.55 ? "Higher water: fish margins and slack behind weed beds." : "Levels good. Classic positions: tail of pools, weed lanes.",
    temp >= 12 && temp <= 18 ? "Water temp ideal for surface activity. Keep a dry ready." : temp < 10 ? "Cool water: slow deep nymphing. Patience." : "Warm water: dawn and dusk best.",
    "Debarb hooks. Most beats require it.",
    "Carry amadou or desiccant. False casting dries flies but spooks fish.",
  ];
  return { tippet, tips };
}

/* ═══ HELPERS ═══ */
const hC = s => s > 70 ? P.rust : s > 40 ? "#7A9E7E" : s > 15 ? P.stone : P.txD;
const iC = v => v >= 7 ? P.rust : v >= 5 ? "#A85C2E" : v >= 3 ? "#7A9E7E" : v >= 1.5 ? "#3E5A40" : v > 0.3 ? "#1E2E26" : P.c2;
function mapUrl(la, lo) { return `https://www.google.com/maps?q=${la},${lo}`; }
function distKm(a, b, c, d) { const R = 6371, dL = (c - a) * Math.PI / 180, dN = (d - b) * Math.PI / 180; const x = Math.sin(dL / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dN / 2) ** 2; return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)); }

/* ═══ APP ═══ */
export default function App() {
  const [riv, setRiv] = useState("test");
  const [beatIdx, setBeatIdx] = useState(5); // Stockbridge
  const [tab, setTab] = useState("forecast");
  const [adv, setAdv] = useState(false);
  const [pick, setPick] = useState(false);
  const [flyT, setFlyT] = useState("dry");
  const [hDay, setHDay] = useState(0);
  const [live, setLive] = useState({});
  const [loading, setLoading] = useState(true);
  const [dSrc, setDSrc] = useState("loading");
  const [nearMe, setNearMe] = useState(false);
  const [uLat, setULat] = useState(null);
  const [uLng, setULng] = useState(null);
  const [userRpts, setUserRpts] = useState([]);
  const [rptBeat, setRptBeat] = useState("");
  const [rptText, setRptText] = useState("");

  const rv = RIVERS.find(r => r.id === riv);
  const bt = rv.beats[beatIdx] || rv.beats[0];

  // Fetch live data
  const doFetch = useCallback(async () => {
    setLoading(true);
    try { const [ea, wx] = await Promise.all([fetchEA(rv.ea), fetchWx(bt.la, bt.lo)]);
      setLive({ ea, wx }); setDSrc(ea?.level ? "live" : "sim"); } catch { setDSrc("sim"); }
    setLoading(false);
  }, [rv, bt]);

  useEffect(() => { doFetch().catch(() => {}); }, [doFetch]);
  useEffect(() => { const i = setInterval(() => doFetch().catch(() => {}), 9e5); return () => clearInterval(i); }, [doFetch]);
  useEffect(() => { setBeatIdx(0); }, [riv]);

  // Near me
  useEffect(() => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => { setULat(p.coords.latitude); setULng(p.coords.longitude); }, () => {}, { timeout: 5000 }); }, []);

  const nearbyRivers = useMemo(() => {
    if (!uLat) return RIVERS;
    return [...RIVERS].map(r => ({ ...r, dist: distKm(uLat, uLng, r.lat, r.lng) })).sort((a, b) => a.dist - b.dist);
  }, [uLat, uLng]);

  const cT = live.ea?.temp || simTemp(rv.lat);
  const cL = live.ea?.level || 0.45;
  const spp = useMemo(() => predict(cT), [cT]);
  const dan = spp.find(s => s.id === "danica");
  const actIds = spp.filter(s => s.score > 10).map(s => s.id);
  const hIdx = Math.round(spp.reduce((s, h) => s + h.score * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) / spp.reduce((s, h) => s + 100 * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) * 100);
  const lv = cL > 0.6 ? { t: "HIGH", c: P.rust } : cL > 0.45 ? { t: "NORMAL", c: "#7A9E7E" } : { t: "LOW", c: P.glacier };
  const topH = spp[0];
  const kit = getKit(cT, cL, topH);
  const lr = useMemo(() => genLR(cT), [cT]);
  const rpts = RPT[riv] || [];
  const srcC = { Field: "#7A9E7E", Guide: P.glacier, Club: "#5A7A5E", Estate: "#8B7355", Social: P.stone };

  // Weather parse
  const wxDays = useMemo(() => {
    const wx = live.wx; if (!wx?.hourly || !wx?.daily) return [];
    try { return Array.from({ length: Math.min(7, wx.daily.time?.length || 0) }, (_, d) => {
      const dt = new Date(wx.daily.time[d]);
      const hrs = []; for (let hr = 5; hr <= 22; hr++) { const idx = d * 24 + hr; if (idx >= (wx.hourly.time?.length || 0)) break;
        const air = wx.hourly.temperature_2m?.[idx] || 15;
        const baseAir = ((wx.daily.temperature_2m_max?.[d] || 15) + (wx.daily.temperature_2m_min?.[d] || 8)) / 2;
        const wt = +(cT + (air - baseAir) * 0.15).toFixed(1);
        hrs.push({ h: hr, air, wt, hi: +hInt(wt, hr).toFixed(1), rain: wx.hourly.precipitation_probability?.[idx] || 0, pr: wx.hourly.pressure_msl?.[idx] ? Math.round(wx.hourly.pressure_msl[idx]) : null, ws: wx.hourly.wind_speed_10m?.[idx] ? Math.round(wx.hourly.wind_speed_10m[idx] * 0.621) : null }); }
      return { dn: d === 0 ? "Today" : d === 1 ? "Tmrw" : dt.toLocaleDateString("en-GB", { weekday: "short" }), df: dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), aH: wx.daily.temperature_2m_max?.[d] ? Math.round(wx.daily.temperature_2m_max[d]) : null, aL: wx.daily.temperature_2m_min?.[d] ? Math.round(wx.daily.temperature_2m_min[d]) : null, hrs };
    }); } catch { return []; }
  }, [live.wx, cT]);

  const Cd = ({ children, accent, style: s }) => <div style={{ background: accent ? P.rustS : P.c1, borderRadius: 12, border: `1px solid ${accent ? P.rustB : P.bd}`, overflow: "hidden", ...s }}>{children}</div>;

  const tabs = [{ id: "forecast", l: "Forecast" }, { id: "hourly", l: "Hourly" }, { id: "longrange", l: "Long Range" }, { id: "fly", l: "Fly Box" }, { id: "kit", l: "Kit" }, { id: "reports", l: "Reports" }];

  return (
    <div style={{ "--sn": "'Barlow',sans-serif", fontFamily: "var(--sn)", background: P.bg, minHeight: "100vh", color: P.tx, WebkitFontSmoothing: "antialiased", maxWidth: 480, margin: "0 auto", paddingBottom: 66 }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0}input,select,textarea{font-family:inherit;background:${P.c2};color:${P.tx};border:1px solid ${P.bd};border-radius:8px;padding:10px 12px;font-size:13px;width:100%}input:focus,select:focus,textarea:focus{outline:none;border-color:${P.rust}}::placeholder{color:${P.txD}}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .3s ease both}`}</style>

      {/* ══ NEAR ME OVERLAY ══ */}
      {nearMe && <div style={{ position: "fixed", inset: 0, background: P.bg, zIndex: 200, padding: 16, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: P.fog }}>Near Me</div>
          <button onClick={() => setNearMe(false)} style={{ background: "none", border: "none", color: P.rust, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Close</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {nearbyRivers.map(r => {
            const temp = simTemp(r.lat); const idx = Math.round(predict(temp).reduce((s, h) => s + h.score * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) / predict(temp).reduce((s, h) => s + 100 * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) * 100);
            return (<div key={r.id} onClick={() => { setRiv(r.id); setNearMe(false); }} style={{ background: P.c1, borderRadius: 12, border: `1px solid ${P.bd}`, padding: 16, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 15, fontWeight: 700, color: P.fog }}>{r.n}</div><div style={{ fontSize: 10, color: P.stone, marginTop: 2 }}>{r.dist ? `${Math.round(r.dist)} miles` : ""} / {r.beats.length} beats</div></div>
                <div style={{ fontSize: 22, fontWeight: 700, color: idx > 30 ? P.rust : P.stone }}>{idx}</div>
              </div>
            </div>);
          })}
        </div>
      </div>}

      {/* ══ HEADER ══ */}
      <div style={{ background: `linear-gradient(170deg, ${P.bg}, ${P.c3})`, padding: "20px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <WordMark />
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 36, fontWeight: 700, color: P.rust, lineHeight: 1 }}>{hIdx}</div><div style={{ fontSize: 7, color: P.txD, letterSpacing: "0.2em" }}>HATCH INDEX</div></div>
        </div>

        {/* Danica hero */}
        {dan && dan.score > 10 && <Cd accent style={{ padding: "12px 14px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: P.rust }}>THE MAYFLY / E. DANICA</div><div style={{ fontSize: 12, color: P.stone, marginTop: 4, lineHeight: 1.5 }}>{dan.score > 70 ? "Full hatch. Get on the water." : dan.score > 40 ? "Building. Daily emergence." : "Early signs. Days away."}</div></div>
            <div style={{ fontSize: 30, fontWeight: 700, color: P.rust, lineHeight: 1 }}>{dan.score}</div>
          </div>
        </Cd>}

        {/* River / beat selector */}
        <button onClick={() => setPick(!pick)} style={{ width: "100%", background: P.c2, border: `1px solid ${P.bd}`, borderRadius: 8, padding: "10px 14px", color: P.tx, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
          <span>{rv.n} / {bt.n}</span><span style={{ color: P.txD }}>{pick ? "−" : "+"}</span>
        </button>
        {pick && <div className="fu" style={{ marginTop: 8, background: P.c1, borderRadius: 10, padding: 12, border: `1px solid ${P.bd}` }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>{RIVERS.map(r => <button key={r.id} onClick={() => setRiv(r.id)} style={{ padding: "4px 10px", borderRadius: 6, border: riv === r.id ? `1px solid ${P.rust}` : `1px solid ${P.bd}`, background: riv === r.id ? P.rustS : "transparent", color: riv === r.id ? P.rust : P.txD, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{r.n}</button>)}</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{rv.beats.map((b, i) => <button key={b.n} onClick={() => { setBeatIdx(i); setPick(false); }} style={{ padding: "3px 8px", borderRadius: 5, border: beatIdx === i ? `1px solid ${P.fog}` : `1px solid ${P.bd}`, background: beatIdx === i ? P.c3 : "transparent", color: beatIdx === i ? P.fog : P.txD, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{b.n}</button>)}</div>
        </div>}
      </div>

      {/* ══ STATS ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${P.bd}` }}>
        {[{ l: "WATER", v: `${cT}°C`, c: cT >= 12 && cT <= 18 ? "#7A9E7E" : P.glacier }, { l: "LEVEL", v: `${cL}m`, c: lv.c }, { l: "STATUS", v: lv.t, c: lv.c }].map((s, i) =>
          <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${P.bd}` : "", background: P.c1 }}>
            <div style={{ fontSize: 7, letterSpacing: "0.2em", color: P.txD }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.c, lineHeight: 1, marginTop: 4 }}>{s.v}</div>
          </div>)}
      </div>

      {/* Live indicator + map link */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: P.c1, borderBottom: `1px solid ${P.bd}` }}>
        <div style={{ width: 5, height: 5, borderRadius: 3, background: dSrc === "live" ? "#7A9E7E" : P.rust }} />
        <span style={{ fontSize: 8, color: P.txD, letterSpacing: "0.06em" }}>{loading ? "FETCHING..." : dSrc === "live" ? "LIVE DATA" : "SIMULATED"}</span>
        <a href={mapUrl(bt.la, bt.lo)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", fontSize: 9, color: P.rust, fontWeight: 600, textDecoration: "none" }}>VIEW ON MAP →</a>
      </div>

      {/* ══ TABS ══ */}
      <div style={{ display: "flex", background: P.c1, borderBottom: `1px solid ${P.bd}`, overflowX: "auto" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "11px 12px 9px", border: "none", borderBottom: tab === t.id ? `2px solid ${P.rust}` : "2px solid transparent", background: "none", color: tab === t.id ? P.rust : P.txD, fontWeight: 600, fontSize: 10, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginBottom: -1, whiteSpace: "nowrap" }}>{t.l}</button>)}
      </div>

      {/* Advanced toggle */}
      <div style={{ padding: "8px 16px", background: P.c2, borderBottom: `1px solid ${P.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: P.txD, letterSpacing: "0.1em" }}>ADVANCED</span>
        <button onClick={() => setAdv(!adv)} style={{ width: 34, height: 18, borderRadius: 9, border: `1px solid ${adv ? P.rust : P.bd}`, background: adv ? P.rust : P.c1, cursor: "pointer", position: "relative" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: adv ? P.bg : P.txD, position: "absolute", top: 2, left: adv ? 18 : 2, transition: "left .3s" }} />
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ padding: 16 }}>

        {/* FORECAST */}
        {tab === "forecast" && <div className="fu">
          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginBottom: 8 }}>SPECIES ACTIVITY</div>
          <Cd>{spp.filter(s => adv || s.score > 5).map(sp => {
            const isM = sp.id === "danica";
            return (<div key={sp.id} style={{ padding: isM ? "16px 14px" : "11px 14px", borderBottom: `1px solid ${P.bd}`, background: isM ? P.rustS : "transparent" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: CC[sp.cat], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontWeight: 700, color: isM ? P.rust : P.fog, fontSize: isM ? 15 : 13 }}>{sp.cm}</span>
                    {isM && <span style={{ fontSize: 8, fontWeight: 700, color: P.rust, letterSpacing: "0.1em" }}>PEAK</span>}
                    {adv && <span style={{ fontSize: 9, color: P.txD, fontStyle: "italic" }}>{sp.nm}</span>}
                  </div>
                  <div style={{ height: isM ? 5 : 3, background: P.c2, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${sp.score}%`, background: hC(sp.score), borderRadius: 3, transition: "width .6s" }} />
                  </div>
                  {adv && <div style={{ fontSize: 10, color: P.txD, marginTop: 4 }}>{sp.sz} | Hook {sp.hk} | {sp.tMn}-{sp.tMx}°C</div>}
                  {adv && <div style={{ fontSize: 10, color: P.stone, marginTop: 3, lineHeight: 1.5 }}>{sp.nt}</div>}
                </div>
                <div style={{ textAlign: "right", minWidth: 40 }}>
                  <div style={{ fontSize: isM ? 24 : 18, fontWeight: 700, color: hC(sp.score), lineHeight: 1 }}>{sp.score}</div>
                  <div style={{ fontSize: 7, fontWeight: 600, color: hC(sp.score), marginTop: 2 }}>{sp.lb}</div>
                </div>
              </div>
            </div>);
          })}</Cd>

          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginTop: 16, marginBottom: 8 }}>TODAY'S FLIES</div>
          <Cd style={{ padding: 14 }}>
            {["dry", "emerger", "nymph"].map(cat => {
              const rel = FL[cat].filter(f => f.mt.some(m => actIds.includes(m))).slice(0, 3);
              if (!rel.length) return null;
              return <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: cat === "dry" ? P.rust : cat === "emerger" ? "#7A9E7E" : P.glacier, marginBottom: 4 }}>{cat.toUpperCase()}</div>
                {rel.map(f => <div key={f.nm} style={{ padding: "5px 0", borderBottom: `1px solid ${P.bd}`, display: "flex", justifyContent: "space-between" }}>
                  <div><span style={{ fontSize: 12, fontWeight: 600 }}>{f.nm}</span>{adv && <span style={{ fontSize: 10, color: P.txD, marginLeft: 6 }}>{f.nt}</span>}</div>
                  <span style={{ fontSize: 10, color: P.txD }}>#{f.sz}</span>
                </div>)}
              </div>;
            })}
          </Cd>
        </div>}

        {/* HOURLY */}
        {tab === "hourly" && <div className="fu">
          {wxDays.length > 0 ? <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
              {wxDays.map((d, i) => <button key={i} onClick={() => setHDay(i)} style={{ padding: "6px 10px", borderRadius: 6, border: hDay === i ? `1px solid ${P.rust}` : `1px solid ${P.bd}`, background: hDay === i ? P.rustS : P.c1, color: hDay === i ? P.rust : P.txM, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}><div>{d.dn}</div><div style={{ fontSize: 8, marginTop: 1 }}>{d.df}</div></button>)}
            </div>
            {wxDays[hDay] && (() => { const day = wxDays[hDay]; const pk = day.hrs.reduce((a, b) => (a.hi || 0) > (b.hi || 0) ? a : b, day.hrs[0]);
              return <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 12 }}>
                  {[{ l: "AIR", v: `${day.aH || "--"}°/${day.aL || "--"}°` }, { l: "WIND", v: `${pk?.ws || "--"}mph` }, { l: "RAIN", v: `${Math.max(...day.hrs.map(h => h.rain))}%` }, { l: "PRESS", v: `${pk?.pr || "--"}mb` }].map((s, i) =>
                    <div key={i} style={{ background: P.c1, borderRadius: 6, border: `1px solid ${P.bd}`, padding: "8px 4px", textAlign: "center" }}>
                      <div style={{ fontSize: 7, letterSpacing: "0.12em", color: P.txD }}>{s.l}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: P.tx, marginTop: 2 }}>{s.v}</div>
                    </div>)}
                </div>
                {pk && <Cd accent style={{ padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: P.rust }}>PEAK WINDOW</div><div style={{ fontSize: 12, color: P.tx, marginTop: 3 }}>{pk.h}:00 / ~{pk.wt}°C / Intensity {(pk.hi || 0).toFixed(1)}</div></div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: P.rust }}>{(pk.hi || 0).toFixed(0)}</div>
                  </div>
                </Cd>}
                <Cd style={{ padding: 14 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.txD, marginBottom: 8 }}>HATCH INTENSITY BY HOUR</div>
                  <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {day.hrs.map(h => <div key={h.h} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 7, color: P.txD, marginBottom: 2 }}>{h.h}</div>
                      <div style={{ width: 22, height: 22, borderRadius: 4, background: iC(h.hi || 0), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: (h.hi || 0) >= 3 ? P.bg : P.txD, fontWeight: (h.hi || 0) >= 5 ? 700 : 400 }}>{(h.hi || 0) >= 1 ? (h.hi || 0).toFixed(0) : ""}</div>
                    </div>)}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 8, fontSize: 8, color: P.txD, alignItems: "center" }}>
                    <span>Low</span>{[0, 1.5, 3, 5, 7].map(v => <div key={v} style={{ width: 10, height: 8, borderRadius: 2, background: iC(v) }} />)}<span>Peak</span>
                  </div>
                </Cd>
              </div>;
            })()}
          </div> : <div style={{ color: P.txM, fontSize: 12 }}>Weather data loads on deployment. Hourly forecasts will appear here.</div>}
        </div>}

        {/* LONG RANGE */}
        {tab === "longrange" && <div className="fu">
          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginBottom: 8 }}>8-WEEK OUTLOOK</div>
          <Cd>{lr.map((w, i) => <div key={i} style={{ padding: "12px 14px", borderBottom: `1px solid ${P.bd}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: 75 }}><div style={{ fontSize: 11, fontWeight: 600, color: i === 0 ? P.rust : P.fog }}>{w.l}</div><div style={{ fontSize: 8, color: w.cf === "High" ? "#7A9E7E" : w.cf === "Med" ? P.rust : P.txD, fontWeight: 600, marginTop: 2 }}>{w.cf.toUpperCase()}</div></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 8, color: P.rust, fontWeight: 600, minWidth: 34 }}>Danica</span>
                <div style={{ flex: 1, height: 5, background: P.c2, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${w.ds}%`, background: P.rust, borderRadius: 3 }} /></div>
                <span style={{ fontSize: 10, fontWeight: 700, color: P.rust, minWidth: 24, textAlign: "right" }}>{w.ds}%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 8, color: "#7A9E7E", fontWeight: 600, minWidth: 34 }}>Overall</span>
                <div style={{ flex: 1, height: 3, background: P.c2, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${w.oa * 10}%`, background: "#7A9E7E", borderRadius: 2 }} /></div>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#7A9E7E", minWidth: 24, textAlign: "right" }}>{w.oa}</span>
              </div>
            </div>
            <div style={{ fontSize: 9, color: P.txD, minWidth: 34, textAlign: "right" }}>~{w.pt}°C</div>
          </div>)}</Cd>
        </div>}

        {/* FLY BOX */}
        {tab === "fly" && <div className="fu">
          <div style={{ background: P.rust + "18", border: `1px solid ${P.rust}44`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: P.rust }}>CHECK BEAT REGULATIONS</div>
            <div style={{ fontSize: 10, color: P.stone, marginTop: 3, lineHeight: 1.5 }}>Fly restrictions vary by beat. Some are upstream dry fly only. Always confirm with the beat keeper before fishing.</div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {[{ id: "dry", l: "Dries" }, { id: "emerger", l: "Emergers" }, { id: "nymph", l: "Nymphs" }].map(t =>
              <button key={t.id} onClick={() => setFlyT(t.id)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: flyT === t.id ? `1px solid ${P.rust}` : `1px solid ${P.bd}`, background: flyT === t.id ? P.rustS : P.c1, color: flyT === t.id ? P.rust : P.txD, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.l}</button>)}
          </div>
          <Cd>{FL[flyT].map((f, i) => {
            const isM = f.mt.some(m => actIds.includes(m));
            return <div key={i} style={{ padding: "12px 14px", borderBottom: `1px solid ${P.bd}`, background: isM ? P.rustS : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontSize: 14, fontWeight: 700, color: isM ? P.rust : P.fog }}>{f.nm}</span>{isM && <span style={{ fontSize: 7, fontWeight: 700, color: P.rust, marginLeft: 6, background: P.rustB, padding: "2px 6px", borderRadius: 4 }}>MATCH</span>}</div>
                <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: f.ef }, (_, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: 2, background: isM ? P.rust : P.txD }} />)}</div>
              </div>
              <div style={{ fontSize: 10, color: P.txD, marginTop: 4 }}>Size {f.sz}</div>
              {adv && <div style={{ fontSize: 10, color: P.stone, marginTop: 3, lineHeight: 1.5 }}>{f.nt}</div>}
            </div>;
          })}</Cd>
        </div>}

        {/* KIT */}
        {tab === "kit" && <div className="fu">
          <Cd style={{ padding: 14 }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.rust, marginBottom: 4 }}>TIPPET</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: P.fog }}>{kit.tippet}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: P.rust, marginBottom: 6 }}>GUIDE TIPS</div>
              {kit.tips.map((t, i) => <div key={i} style={{ padding: "7px 0", borderBottom: `1px solid ${P.bd}`, fontSize: 11, color: P.stone, lineHeight: 1.6, display: "flex", gap: 8 }}><span style={{ color: P.rust, flexShrink: 0 }}>-</span>{t}</div>)}
            </div>
          </Cd>
          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginTop: 16, marginBottom: 8 }}>BEATS & MAP</div>
          {rv.beats.map((b, i) => <Cd key={i} style={{ padding: 14, marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: P.fog }}>{b.n}</div>
              <a href={mapUrl(b.la, b.lo)} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 12px", background: P.rust, color: "#fff", borderRadius: 6, fontSize: 9, fontWeight: 700, textDecoration: "none" }}>MAP</a>
            </div>
          </Cd>)}
        </div>}

        {/* REPORTS */}
        {tab === "reports" && <div className="fu">
          <Cd style={{ padding: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: P.rust, marginBottom: 6 }}>RIVER'S EYE VIEW</div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, color: P.stone }}>
              {riv === "test" ? `The Test is in superb form. Olives consistent, first danica emerging around Stockbridge and Mottisfont. Clarity exceptional. Emergers outperforming duns in the carriers. The main event is building.` : `The ${rv.n} is fishing well. Water at ${cT}°C. ${rv.d}`}
            </p>
          </Cd>

          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginBottom: 8 }}>SUBMIT A REPORT</div>
          <Cd style={{ padding: 14, marginBottom: 14 }}>
            <select value={rptBeat} onChange={e => setRptBeat(e.target.value)} style={{ marginBottom: 8 }}><option value="">Select beat...</option>{rv.beats.map(b => <option key={b.n} value={b.n}>{b.n}</option>)}</select>
            <textarea rows={3} value={rptText} onChange={e => setRptText(e.target.value)} placeholder="What's happening on the river?" style={{ marginBottom: 8, resize: "none" }} />
            <button onClick={() => { if (rptBeat && rptText.length > 10) { setUserRpts(p => [{ d: new Date().toLocaleDateString("en-GB", { month: "short", day: "numeric" }), bt: rptBeat, tx: rptText, au: "You", src: "User", v: false }, ...p]); setRptText(""); setRptBeat(""); } }} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: P.rust, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", fontFamily: "inherit" }}>SUBMIT REPORT</button>
          </Cd>

          <div style={{ fontSize: 9, color: P.txD, letterSpacing: "0.2em", marginBottom: 8 }}>FIELD REPORTS</div>
          <Cd style={{ padding: "4px 14px" }}>
            {[...userRpts, ...rpts].map((r, i) => <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid ${P.bd}` }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: srcC[r.src] || P.rust, border: `1px solid ${(srcC[r.src] || P.rust)}33`, padding: "1px 5px", borderRadius: 3 }}>{r.src.toUpperCase()}</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{r.bt}</span><span style={{ fontSize: 9, color: P.txD }}>{r.d}</span>
                <span style={{ marginLeft: "auto", fontSize: 7, color: r.v ? "#7A9E7E" : P.rust, fontWeight: 600 }}>{r.v ? "VERIFIED" : "UNVERIFIED"}</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: P.stone }}>{r.tx}</p>
              <div style={{ fontSize: 9, color: P.txD, marginTop: 3 }}>{r.au}</div>
            </div>)}
          </Cd>
        </div>}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ textAlign: "center", padding: "24px 16px 16px", borderTop: `1px solid ${P.bd}` }}>
        <FooterMark />
        <div style={{ fontSize: 7, color: P.txD, marginTop: 10, lineHeight: 1.7, letterSpacing: "0.03em" }}>
          Forecasts are indicative and based on modelled data. Always check local conditions.<br />
          River data: Environment Agency. Weather: Open-Meteo. Both under open licence.<br />
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: P.c1, borderTop: `1px solid ${P.bd}`, display: "flex", zIndex: 100 }}>
        <button onClick={() => setNearMe(true)} style={{ flex: 1, padding: "10px 0 8px", border: "none", background: "none", color: P.txD, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
          <div style={{ fontSize: 14, lineHeight: 1 }}>◎</div>
          <div style={{ fontSize: 8, fontWeight: 600, marginTop: 2 }}>Near Me</div>
        </button>
        {[{ id: "forecast", l: "Forecast", i: "◉" }, { id: "fly", l: "Fly Box", i: "◈" }, { id: "reports", l: "Reports", i: "◇" }].map(n =>
          <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "10px 0 8px", border: "none", background: "none", color: tab === n.id ? P.rust : P.txD, cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
            <div style={{ fontSize: 14, lineHeight: 1 }}>{n.i}</div>
            <div style={{ fontSize: 8, fontWeight: 600, marginTop: 2 }}>{n.l}</div>
          </button>)}
      </div>
    </div>
  );
}
