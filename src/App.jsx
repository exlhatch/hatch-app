import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════════
   HATCH — GUIDING INTELLIGENCE
   Phase 1: Live EA Hydrology + Open-Meteo Weather
   ═══════════════════════════════════════════════════════════════════════════════ */

const MiniLogo = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 5 Q14.5 0 16.5 4 Q13.5 6.5 11 7.5Z" fill="#D4A030" opacity="0.35"/><path d="M11 5 Q7.5 0 5.5 4 Q8.5 6.5 11 7.5Z" fill="#D4A030" opacity="0.35"/><line x1="11" y1="4" x2="11" y2="18" stroke="#D4A030" strokeWidth="0.8" opacity="0.25"/><path d="M11 18 Q9.5 20 8 21" stroke="#D4A030" strokeWidth="0.5" opacity="0.2" fill="none"/><path d="M11 18 Q12.5 20 14 21" stroke="#D4A030" strokeWidth="0.5" opacity="0.2" fill="none"/></svg>
    <span style={{ fontFamily: "var(--sf)", fontSize: 17, fontWeight: 900, color: "#E8E0D0", letterSpacing: "0.14em" }}>HATCH</span>
  </div>
);

const FooterLogo = () => (
  <svg width="160" height="72" viewBox="0 0 260 117" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 28 Q42 4 56 14 Q48 22 38 28Z" fill="#D4A030" opacity="0.2"/><path d="M32 28 Q22 4 8 14 Q16 22 26 28Z" fill="#D4A030" opacity="0.2"/>
    <line x1="32" y1="18" x2="32" y2="72" stroke="#D4A030" strokeWidth="1" opacity="0.2"/>
    <path d="M32 72 Q28 82 24 88" stroke="#D4A030" strokeWidth="0.6" opacity="0.15" fill="none"/><path d="M32 72 Q36 82 40 88" stroke="#D4A030" strokeWidth="0.6" opacity="0.15" fill="none"/><path d="M32 72 Q32 84 32 90" stroke="#D4A030" strokeWidth="0.6" opacity="0.15" fill="none"/>
    <text x="130" y="68" textAnchor="middle" fontFamily="'Playfair Display',Georgia,serif" fontSize="58" fontWeight="900" fill="#E8E0D0" letterSpacing="8">HATCH</text>
    <text x="130" y="90" textAnchor="middle" fontFamily="'Barlow',sans-serif" fontSize="10" fontWeight="600" fill="#D4A030" letterSpacing="6">GUIDING INTELLIGENCE</text>
    <line x1="45" y1="16" x2="215" y2="16" stroke="#D4A030" strokeWidth="0.5" opacity="0.3"/><line x1="45" y1="100" x2="215" y2="100" stroke="#D4A030" strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

/* ═══ RIVER & BEAT DATA WITH COORDINATES ═══ */

const RIVERS = {
  test: { n: "River Test", eaName: "Test", desc: "The quintessential chalkstream. Birthplace of dry fly fishing.",
    beats: [
      { id: "broadlands", n: "Broadlands", lat: 50.988, lng: -1.499 },
      { id: "nursling", n: "Nursling", lat: 50.948, lng: -1.429 },
      { id: "timsbury", n: "Timsbury", lat: 51.015, lng: -1.488 },
      { id: "mottisfont", n: "Mottisfont", lat: 51.057, lng: -1.533 },
      { id: "horsebridge", n: "Horsebridge", lat: 51.078, lng: -1.533 },
      { id: "park-stream", n: "Park Stream", lat: 51.079, lng: -1.530 },
      { id: "stockbridge", n: "Stockbridge", lat: 51.089, lng: -1.494 },
      { id: "leckford", n: "Leckford", lat: 51.112, lng: -1.478 },
      { id: "longparish", n: "Longparish", lat: 51.178, lng: -1.401 },
      { id: "whitchurch", n: "Whitchurch", lat: 51.225, lng: -1.337 },
      { id: "laverstoke", n: "Laverstoke", lat: 51.228, lng: -1.296 },
    ]},
  itchen: { n: "River Itchen", eaName: "Itchen", desc: "Premier chalkstream. Technical, cathedral water.",
    beats: [
      { id: "itchen-abbas", n: "Itchen Abbas", lat: 51.089, lng: -1.227 },
      { id: "martyr-worthy", n: "Martyr Worthy", lat: 51.083, lng: -1.262 },
      { id: "abbotts-barton", n: "Abbotts Barton", lat: 51.072, lng: -1.313 },
      { id: "twyford", n: "Twyford", lat: 51.023, lng: -1.328 },
    ]},
  kennet: { n: "River Kennet", eaName: "Kennet", desc: "Diverse chalkstream. Strong olives, fine grayling.",
    beats: [
      { id: "ramsbury", n: "Ramsbury", lat: 51.443, lng: -1.596 },
      { id: "littlecote", n: "Littlecote", lat: 51.428, lng: -1.541 },
      { id: "hungerford", n: "Hungerford", lat: 51.413, lng: -1.515 },
      { id: "kintbury", n: "Kintbury", lat: 51.399, lng: -1.448 },
    ]},
  anton: { n: "River Anton", eaName: "Anton", desc: "Intimate Test tributary. Reliable early hatches.",
    beats: [
      { id: "goodworth", n: "Goodworth Clatford", lat: 51.184, lng: -1.513 },
      { id: "anton-lakes", n: "Anton Lakes", lat: 51.205, lng: -1.481 },
    ]},
  avon: { n: "Hampshire Avon", eaName: "Avon Hampshire", desc: "Broad, powerful. Excellent mayfly. Big fish.",
    beats: [
      { id: "amesbury", n: "Amesbury", lat: 51.172, lng: -1.774 },
      { id: "netheravon", n: "Netheravon", lat: 51.226, lng: -1.792 },
      { id: "salisbury", n: "Salisbury", lat: 51.068, lng: -1.798 },
    ]},
  wylye: { n: "River Wylye", eaName: "Wylye", desc: "Beautiful, underrated. Superb evening rises.",
    beats: [
      { id: "heytesbury", n: "Heytesbury", lat: 51.186, lng: -2.099 },
      { id: "codford", n: "Codford", lat: 51.169, lng: -2.059 },
    ]},
};

/* ═══ HATCHES ═══ */
const HATCHES = [
  { id:"danica", nm:"Ephemera danica", cm:"The Mayfly", cat:"mayfly", t:1, sz:"20-25mm", hk:"10-12 LD", s:135, e:172, tMin:12, tMax:18, pk:[12,13,14,15,16], note:"THE event. Fish lose all caution." },
  { id:"vulgata", nm:"Ephemera vulgata", cm:"Dark Mackerel", cat:"mayfly", t:2, sz:"18-22mm", hk:"10-12", s:140, e:178, tMin:13, tMax:17, pk:[13,14,15,16], note:"Overlaps danica. Darker body." },
  { id:"ldo", nm:"Baetis rhodani", cm:"Large Dark Olive", cat:"olive", t:2, sz:"10-12mm", hk:"14-16", s:60, e:150, tMin:7, tMax:14, pk:[10,11,12,13], note:"Spring staple. Overcast days." },
  { id:"mo", nm:"Baetis vernus", cm:"Medium Olive", cat:"olive", t:3, sz:"8-10mm", hk:"16", s:100, e:180, tMin:10, tMax:16, pk:[11,12,13,14], note:"Consistent all season." },
  { id:"bwo", nm:"Serratella ignita", cm:"Blue-winged Olive", cat:"olive", t:2, sz:"9-11mm", hk:"14-16", s:150, e:290, tMin:12, tMax:18, pk:[17,18,19,20], note:"The great evening fly." },
  { id:"ib", nm:"Baetis niger", cm:"Iron Blue", cat:"olive", t:2, sz:"6-8mm", hk:"16-18", s:105, e:165, tMin:8, tMax:14, pk:[11,12,13,14], note:"Loves foul weather." },
  { id:"pw", nm:"Baetis fuscatus", cm:"Pale Watery", cat:"olive", t:3, sz:"6-8mm", hk:"16-18", s:125, e:260, tMin:12, tMax:18, pk:[14,15,16,17,18], note:"Afternoon/evening." },
  { id:"ss", nm:"Centroptilum luteolum", cm:"Small Spurwing", cat:"olive", t:3, sz:"5-7mm", hk:"18-20", s:135, e:270, tMin:13, tMax:18, pk:[15,16,17,18], note:"Tiny but plentiful." },
  { id:"ymd", nm:"Heptagenia sulphurea", cm:"Yellow May Dun", cat:"olive", t:3, sz:"12-14mm", hk:"14", s:135, e:180, tMin:12, tMax:17, pk:[18,19,20], note:"Evening emerger." },
  { id:"ped", nm:"Procloeon bifidum", cm:"Pale Evening Dun", cat:"olive", t:3, sz:"7-9mm", hk:"16-18", s:150, e:250, tMin:14, tMax:18, pk:[18,19,20,21], note:"Warm still evenings." },
  { id:"caen", nm:"Caenis spp.", cm:"Angler's Curse", cat:"olive", t:3, sz:"3-5mm", hk:"20-22", s:155, e:250, tMin:15, tMax:20, pk:[5,6,7,19,20,21], note:"Dawn/dusk. Tiny." },
  { id:"gran", nm:"Brachycentrus subnubilus", cm:"Grannom", cat:"caddis", t:2, sz:"10-12mm", hk:"14-16", s:100, e:130, tMin:9, tMax:14, pk:[11,12,13,14,15], note:"Mass April hatches." },
  { id:"sedge", nm:"Various Trichoptera", cm:"Sedges", cat:"caddis", t:2, sz:"8-18mm", hk:"12-16", s:135, e:275, tMin:13, tMax:20, pk:[19,20,21], note:"Evening skitterers." },
  { id:"haw", nm:"Bibio marci", cm:"Hawthorn Fly", cat:"terr", t:2, sz:"12-14mm", hk:"12-14", s:108, e:135, tMin:10, tMax:16, pk:[11,12,13,14,15,16], note:"Breezy days." },
  { id:"bg", nm:"Bibio johannis", cm:"Black Gnat", cat:"terr", t:3, sz:"5-8mm", hk:"16-18", s:120, e:250, tMin:12, tMax:20, pk:[12,13,14,15,16,17], note:"All summer." },
  { id:"smut", nm:"Simulium spp.", cm:"Reed Smuts", cat:"terr", t:3, sz:"2-4mm", hk:"20-24", s:135, e:270, tMin:13, tMax:20, pk:[10,11,12,13,14,15,16,17], note:"Fish sip from the film." },
];

const CATC = { mayfly:"#D4A030", olive:"#7A9E7E", caddis:"#8B7355", terr:"#6B8DA6" };
const CATL = { mayfly:"M", olive:"U", caddis:"C", terr:"T" };

/* ═══ FLY BOX ═══ */
const FLIES = {
  nymph: [
    { nm:"Pheasant Tail Nymph", sz:"14-18", wt:"Weighted", match:["ldo","mo","bwo","ib","pw"], eff:5, note:"Desert island nymph. Dead drift or induced take." },
    { nm:"Gold-Ribbed Hare's Ear", sz:"14-16", wt:"Weighted", match:["ldo","mo","bwo"], eff:5, note:"Buggy, impressionistic. Works when nothing else does." },
    { nm:"Sawyer's Killer Bug", sz:"14-16", wt:"Copper wire", match:["ldo","mo","pw"], eff:4, note:"Deadly in cold water. Simplest fly that works." },
    { nm:"Danica Nymph", sz:"10-12 LD", wt:"Weighted", match:["danica","vulgata"], eff:4, note:"Pre-hatch essential. Fish deep along gravel." },
    { nm:"Czech Nymph", sz:"12-16", wt:"Heavy jig", match:["ldo","mo","gran"], eff:3, note:"Check beat rules. Some waters restrict." },
    { nm:"Caddis Larva", sz:"14-16", wt:"Light", match:["gran","sedge"], eff:3, note:"Effective pre-grannom and through summer." },
  ],
  emerger: [
    { nm:"Klinkhamer Special", sz:"12-18", wt:"Unweighted", match:["ldo","mo","bwo","danica"], eff:5, note:"Most versatile fly on chalkstreams." },
    { nm:"Danica Emerger", sz:"10-12 LD", wt:"Unweighted", match:["danica","vulgata"], eff:5, note:"THE fly during the mayfly. Fish in the film." },
    { nm:"CDC Shuttlecock", sz:"14-20", wt:"Unweighted", match:["ldo","mo","bwo","ib","pw"], eff:5, note:"CDC trapped in film. Tie sparse." },
    { nm:"Suspender Buzzer", sz:"14-18", wt:"Unweighted", match:["ldo","mo"], eff:4, note:"Foam ball keeps it in the film. Patience." },
    { nm:"F Fly", sz:"16-20", wt:"Unweighted", match:["pw","ss","smut","caen"], eff:4, note:"Two CDC feathers. Devastatingly simple." },
    { nm:"Grannom Pupa", sz:"14-16", wt:"Light", match:["gran"], eff:3, note:"Green body. Fish subsurface during grannom." },
  ],
  dry: [
    { nm:"Grey Wulff", sz:"10-14", wt:"Dry", match:["danica","vulgata"], eff:5, note:"Classic mayfly dry. Robust, visible, floats forever." },
    { nm:"Spent Gnat", sz:"10-12", wt:"Dry", match:["danica","vulgata"], eff:5, note:"Spinner fall essential. Flat on the surface." },
    { nm:"Kite's Imperial", sz:"14-16", wt:"Dry", match:["ldo","mo"], eff:5, note:"THE olive pattern. Nothing better." },
    { nm:"Sherry Spinner", sz:"14-16", wt:"Dry", match:["bwo"], eff:5, note:"BWO spinner. Evening essential." },
    { nm:"Iron Blue Dun", sz:"16-18", wt:"Dry", match:["ib"], eff:4, note:"Small, dark. Foul weather days." },
    { nm:"Adams", sz:"14-18", wt:"Dry", match:["ldo","mo","bwo"], eff:4, note:"Good searching pattern." },
    { nm:"Last Hope", sz:"16-20", wt:"Dry", match:["pw","ss","caen"], eff:4, note:"Ultra-selective fish on pale wateries." },
    { nm:"Elk Hair Caddis", sz:"12-16", wt:"Dry", match:["sedge"], eff:4, note:"Sedge pattern. Static or skated." },
    { nm:"G&H Sedge", sz:"10-14", wt:"Dry", match:["sedge"], eff:4, note:"Skate it. Explosive takes." },
    { nm:"Hawthorn Fly", sz:"12-14", wt:"Dry", match:["haw"], eff:3, note:"Trailing legs. Breezy days." },
    { nm:"Griffith's Gnat", sz:"18-24", wt:"Dry", match:["smut","caen"], eff:3, note:"For smuts and caenis. Tiny." },
  ],
};

/* ═══ LOCAL AMENITIES ═══ */
const LOCALS = {
  test: {
    tackle: [{ nm:"Robjents of Stockbridge", addr:"High Street, Stockbridge", note:"THE chalkstream tackle shop." }, { nm:"Orvis Stockbridge", addr:"High Street, Stockbridge", note:"Orvis flagship. Rod demos." }],
    food: [{ nm:"The Mayfly", tp:"Pub", addr:"Testcombe", note:"ON the river. Book during mayfly." }, { nm:"The Greyhound", tp:"Pub", addr:"Stockbridge", note:"Coaching inn. Good food." }, { nm:"Thyme & Tides", tp:"Cafe", addr:"Stockbridge", note:"Quick fuel." }, { nm:"The Peat Spade", tp:"Inn", addr:"Longstock", note:"Boutique. Great food." }, { nm:"The White Hart", tp:"Pub", addr:"Whitchurch", note:"Upper river beats." }],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   LIVE DATA API LAYER
   ═══════════════════════════════════════════════════════════════════════════════ */

// Cache to avoid re-fetching
const cache = { stations: {}, weather: {}, readings: {} };

// --- EA HYDROLOGY API ---
// Docs: https://environment.data.gov.uk/hydrology/doc/reference
const EA_BASE = "https://environment.data.gov.uk/hydrology";

async function fetchEAStations(riverName) {
  const key = `stations_${riverName}`;
  if (cache[key]) return cache[key];
  try {
    const res = await fetch(`${EA_BASE}/id/stations?riverName=${encodeURIComponent(riverName)}&_limit=50`);
    if (!res.ok) throw new Error(`EA API ${res.status}`);
    const data = await res.json();
    const stations = (data.items || []).map(s => ({
      id: s["@id"]?.split("/").pop() || s.notation,
      label: s.label,
      lat: s.lat,
      lng: s.long,
      measures: (s.measures || []).map(m => ({
        id: typeof m === "string" ? m : m["@id"],
        param: typeof m === "string" ? null : m.parameter,
        paramName: typeof m === "string" ? null : (m.parameterName || m.parameter),
        unit: typeof m === "string" ? null : m.unitName,
      })),
    }));
    cache[key] = stations;
    return stations;
  } catch (err) {
    console.warn("EA stations fetch failed:", err);
    return null;
  }
}

function findNearestStation(stations, lat, lng) {
  if (!stations?.length) return null;
  let best = null, bestDist = Infinity;
  stations.forEach(s => {
    const d = Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2);
    if (d < bestDist) { bestDist = d; best = s; }
  });
  return best;
}

async function fetchEAReadings(measureId, days = 30) {
  if (!measureId) return null;
  const cacheKey = `read_${measureId}`;
  const now = Date.now();
  if (cache[cacheKey] && now - cache[cacheKey].ts < 900000) return cache[cacheKey].data; // 15min cache
  try {
    const since = new Date(Date.now() - days * 864e5).toISOString().split("T")[0];
    // measureId could be a full URL or just an ID
    const url = measureId.startsWith("http") 
      ? `${measureId}/readings?since=${since}&_sorted&_limit=2000`
      : `${EA_BASE}/id/measures/${measureId}/readings?since=${since}&_sorted&_limit=2000`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`EA readings ${res.status}`);
    const data = await res.json();
    const readings = (data.items || []).map(r => ({
      dateTime: r.dateTime,
      value: r.value,
    })).filter(r => r.value != null && !isNaN(r.value));
    cache[cacheKey] = { data: readings, ts: now };
    return readings;
  } catch (err) {
    console.warn("EA readings fetch failed:", err);
    return null;
  }
}

// Get level and temperature measures from a station
function getMeasures(station) {
  if (!station?.measures) return { level: null, temp: null, flow: null };
  const find = (param) => station.measures.find(m => {
    const p = (m.param || m.paramName || m.id || "").toLowerCase();
    return p.includes(param);
  });
  return {
    level: find("level") || find("stage"),
    temp: find("temp") || find("water-temperature"),
    flow: find("flow") || find("discharge"),
  };
}

// --- OPEN-METEO WEATHER API ---
async function fetchWeather(lat, lng) {
  const key = `wx_${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const now = Date.now();
  if (cache[key] && now - cache[key].ts < 3600000) return cache[key].data; // 1hr cache
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&hourly=temperature_2m,precipitation_probability,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
      `&timezone=Europe/London&forecast_days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather API ${res.status}`);
    const data = await res.json();
    cache[key] = { data, ts: now };
    return data;
  } catch (err) {
    console.warn("Weather fetch failed:", err);
    return null;
  }
}

function parseWeather(wx) {
  if (!wx?.hourly || !wx?.daily) return null;
  const { hourly, daily } = wx;
  const days = [];
  for (let d = 0; d < (daily.time?.length || 0) && d < 7; d++) {
    const dt = new Date(daily.time[d]);
    const dn = d === 0 ? "Today" : d === 1 ? "Tmrw" : dt.toLocaleDateString("en-GB", { weekday: "short" });
    const df = dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const hours = [];
    for (let h = 5; h <= 22; h++) {
      const idx = d * 24 + h;
      if (idx >= (hourly.time?.length || 0)) break;
      hours.push({
        h,
        airTemp: hourly.temperature_2m?.[idx] ?? null,
        rain: hourly.precipitation_probability?.[idx] ?? null,
        pressure: hourly.pressure_msl?.[idx] ? Math.round(hourly.pressure_msl[idx]) : null,
        windSpeed: hourly.wind_speed_10m?.[idx] ? Math.round(hourly.wind_speed_10m[idx] * 0.621) : null, // km/h to mph approx
        windDir: hourly.wind_direction_10m?.[idx] ?? null,
        cloud: hourly.cloud_cover?.[idx] ?? null,
      });
    }
    const midPressure = hours.find(h => h.h === 12)?.pressure || hours[0]?.pressure;
    days.push({
      dn, df,
      aH: daily.temperature_2m_max?.[d] ? Math.round(daily.temperature_2m_max[d]) : null,
      aL: daily.temperature_2m_min?.[d] ? Math.round(daily.temperature_2m_min[d]) : null,
      rain: Math.round(hours.reduce((s, h) => Math.max(s, h.rain || 0), 0)),
      pr: midPressure,
      ws: daily.wind_speed_10m_max?.[d] ? Math.round(daily.wind_speed_10m_max[d] * 0.621) : null,
      wd: degToCompass(hours.find(h => h.h === 12)?.windDir),
      hours,
    });
  }
  return days;
}

function degToCompass(deg) {
  if (deg == null) return "?";
  const dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

// --- AGGREGATE LIVE DATA ---
async function fetchLiveData(riverId, beatObj) {
  const rv = RIVERS[riverId];
  const [stations, weather] = await Promise.all([
    fetchEAStations(rv.eaName),
    fetchWeather(beatObj.lat, beatObj.lng),
  ]);

  let liveLevel = null, liveTemp = null, liveFlow = null, levelHistory = null;
  
  if (stations) {
    const nearest = findNearestStation(stations, beatObj.lat, beatObj.lng);
    if (nearest) {
      const measures = getMeasures(nearest);
      const [levelR, tempR, flowR] = await Promise.all([
        measures.level ? fetchEAReadings(measures.level.id, 45) : null,
        measures.temp ? fetchEAReadings(measures.temp.id, 45) : null,
        measures.flow ? fetchEAReadings(measures.flow.id, 45) : null,
      ]);
      if (levelR?.length) {
        liveLevel = levelR[levelR.length - 1].value;
        levelHistory = levelR;
      }
      if (tempR?.length) liveTemp = tempR[tempR.length - 1].value;
      if (flowR?.length) liveFlow = flowR[flowR.length - 1].value;
    }
  }

  return {
    level: liveLevel,
    temp: liveTemp,
    flow: liveFlow,
    levelHistory,
    weather: parseWeather(weather),
    stationCount: stations?.length || 0,
    isLive: liveLevel !== null || weather !== null,
  };
}

/* ═══ FALLBACK SIMULATED DATA ═══ */
function sR(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function simData(rId, bId) {
  const seed = (rId + bId).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const r = sR(seed); const now = new Date(); const out = [];
  for (let i = 45; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const dy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    out.push({ date: d.toISOString().split("T")[0], temp: +(7.5 + 7.5 * Math.sin((dy - 80) * Math.PI / 183) + (r() - 0.5) * 3).toFixed(1), level: +(0.42 + 0.18 * Math.sin((dy - 30) * Math.PI / 183) + (r() - 0.4) * 0.12).toFixed(3), flow: 0, dy });
  }
  out.forEach(d => d.flow = +(d.level * 2.6 + 0.3).toFixed(2));
  return out;
}

function simWeather(seed) {
  const r = sR(seed + 777); const now = new Date();
  return Array.from({ length: 7 }, (_, d) => {
    const dt = new Date(now); dt.setDate(dt.getDate() + d);
    const aH = Math.round(16 + d * 0.6 + (r() - 0.3) * 4), aL = Math.round(aH - 7 - r() * 3);
    return {
      dn: d === 0 ? "Today" : d === 1 ? "Tmrw" : dt.toLocaleDateString("en-GB", { weekday: "short" }),
      df: dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      aH, aL, pr: Math.round(1016 + (r() - 0.5) * 16 - d * 1.2),
      rain: Math.round(Math.max(0, Math.min(95, 10 + d * 8 + (r() - 0.5) * 30))),
      ws: Math.round(5 + r() * 10), wd: ["SW","S","SE","W","NW"][Math.floor(r() * 5)],
      hours: Array.from({ length: 18 }, (_, h) => ({ h: h + 5, airTemp: +(aL + (aH - aL) * Math.sin((h) * Math.PI / 18)).toFixed(1), rain: Math.round(r() * 30), pressure: Math.round(1016 + (r() - 0.5) * 10), windSpeed: Math.round(5 + r() * 8), cloud: Math.round(r() * 80) })),
    };
  });
}

/* ═══ PREDICTION ENGINE ═══ */
function predict(waterTemp, level, dayOfYear) {
  const avg = waterTemp, aL = level;
  return HATCHES.map(sp => {
    let sF = 0;
    if (dayOfYear >= sp.s && dayOfYear <= sp.e) { const m = (sp.s + sp.e) / 2, r = (sp.e - sp.s) / 2; sF = Math.max(0, 1 - ((dayOfYear - m) / r) ** 2); }
    else if (dayOfYear >= sp.s - 14 && dayOfYear < sp.s) sF = (dayOfYear - sp.s + 14) / 28;
    let tF = 0; const tm = (sp.tMin + sp.tMax) / 2, tr = (sp.tMax - sp.tMin) / 2;
    if (avg >= sp.tMin && avg <= sp.tMax) tF = Math.max(0, 1 - ((avg - tm) / (tr * 1.2)) ** 2);
    else if (avg >= sp.tMin - 2) tF = Math.max(0, (avg - sp.tMin + 2) / 4);
    const sc = Math.round(Math.max(0, Math.min(100, (sF * 0.55 + tF * 0.35) * (aL > 0.65 ? 0.7 : aL < 0.3 ? 0.85 : 1) * 100)));
    return { ...sp, score: sc, lb: sc > 70 ? "Strong" : sc > 40 ? "Moderate" : sc > 15 ? "Sparse" : "Unlikely" };
  }).sort((a, b) => b.score - a.score);
}

function hourlyIntensity(waterTemp, dayOfYear, hour) {
  let hi = 0;
  HATCHES.forEach(sp => {
    if (dayOfYear < sp.s - 10 || dayOfYear > sp.e + 10) return;
    let sf = 0;
    if (dayOfYear >= sp.s && dayOfYear <= sp.e) { const m = (sp.s + sp.e) / 2, rr = (sp.e - sp.s) / 2; sf = Math.max(0, 1 - ((dayOfYear - m) / rr) ** 2); }
    const hf = sp.pk.includes(hour) ? 1 : sp.pk.includes(hour - 1) || sp.pk.includes(hour + 1) ? 0.4 : 0.05;
    let tf = 0;
    if (waterTemp >= sp.tMin && waterTemp <= sp.tMax) { const tm = (sp.tMin + sp.tMax) / 2; tf = Math.max(0, 1 - ((waterTemp - tm) / ((sp.tMax - sp.tMin) / 2 * 1.3)) ** 2); }
    hi += Math.max(0, sf * hf * tf * (sp.t === 1 ? 3 : sp.t === 2 ? 1.5 : 0.8));
  });
  return Math.min(10, Math.max(0, hi));
}

function genLR(waterTemp, dayOfYear) {
  const now = new Date();
  return Array.from({ length: 8 }, (_, w) => {
    const s = new Date(now); s.setDate(s.getDate() + w * 7);
    const e2 = new Date(s); e2.setDate(e2.getDate() + 6);
    const md = dayOfYear + w * 7 + 3;
    const pt = +(waterTemp + w * 0.4 + Math.sin((md - 80) * Math.PI / 183) * 1.5).toFixed(1);
    let ds = 0;
    if (md >= 125 && md <= 182) ds = Math.max(0, 1 - ((md - 153) / 28) ** 2) * (pt >= 12 && pt <= 18 ? 1 : pt >= 10 ? 0.5 : 0.2);
    let oa = 0;
    HATCHES.forEach(sp => { if (md >= sp.s && md <= sp.e) oa += Math.max(0, 1 - ((md - (sp.s + sp.e) / 2) / ((sp.e - sp.s) / 2)) ** 2) * (sp.t === 1 ? 3 : sp.t === 2 ? 1.5 : 0.8); });
    return { l: w === 0 ? "This week" : w === 1 ? "Next week" : `${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} - ${e2.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`, pt, ds: +(ds*100).toFixed(0), oa: +Math.min(10,oa).toFixed(1), cf: w<2?"High":w<4?"Med":"Low" };
  });
}

function getRpts(rId) {
  const all = {
    test: [
      { d:"May 8", bt:"Stockbridge", au:"River Keeper", src:"Field", tx:"Sustained danica from 12:30. Fish up everywhere. Spinners by 4:30. Best mayfly day yet.", tg:["danica","spinners"], v:true },
      { d:"May 7", bt:"Park Stream", au:"Beat Guide", src:"Guide", tx:"First danica midday. Two good fish on emergers. Water 13.8C. Park Stream fishes ahead of main river.", tg:["danica","emergers"], v:true },
      { d:"May 6", bt:"Leckford", au:"Estate Keeper", src:"Estate", tx:"Strong olives. Hawthorn about. Ranunculus thriving. Water climbing.", tg:["olives","hawthorn"], v:true },
      { d:"May 5", bt:"Stockbridge", au:"Test Valley FC", src:"Club", tx:"Iron blues and olives. Ranunculus excellent. Early danica seen.", tg:["iron blue","olives"], v:true },
    ],
    itchen: [{ d:"May 8", bt:"Abbotts Barton", au:"Winchester AC", src:"Club", tx:"Steady olives. Handful of early danica.", tg:["olives","danica"], v:true }],
    kennet: [{ d:"May 8", bt:"Ramsbury", au:"@kennet_fly", src:"Social", tx:"Olive hatch midday. Grayling on nymphs.", tg:["olives"], v:false }],
    anton: [{ d:"May 7", bt:"Goodworth Clatford", au:"Guide", src:"Guide", tx:"Olives from 10am. Water 13.1C.", tg:["olives"], v:true }],
    avon: [{ d:"May 7", bt:"Amesbury", au:"Salisbury AC", src:"Club", tx:"Avon in fine form. Big fish showing. Danica imminent.", tg:["olives","big fish"], v:true }],
    wylye: [{ d:"May 6", bt:"Heytesbury", au:"@wylye_ff", src:"Social", tx:"Gorgeous evening rise. Pale wateries.", tg:["evening rise"], v:false }],
  };
  return all[rId] || [];
}

/* ═══ KIT & TIPS ═══ */
function getKit(temp, level, topH) {
  const tippet = topH?.id === "danica" ? { sz: "3X-4X (6-8lb)", n: "Mayfly fish fight hard." }
    : topH?.cat === "olive" && (topH.sz||"").includes("6") ? { sz: "6X-7X (2-3lb)", n: "Fine tippets for small flies." }
    : { sz: "5X (4lb)", n: "Good all-round chalkstream tippet." };
  const leader = temp > 15 ? "12-15ft tapered. Fluoro tippet. Longer in clear low water." : temp > 10 ? "9-12ft tapered. Nylon for dries, fluoro for nymphs." : "9ft tapered. Shorter leaders fine in cooler water.";
  const tips = [
    "Rub mud or leader sink on the last 3ft. Critical in clear water.",
    level < 0.4 ? "Low water: stay low, longer casts. Fish spook easily." : level > 0.55 ? "Higher water: fish margins and slack behind weed beds." : "Levels good: fish the classic positions, tail of pools, weed lanes.",
    temp >= 12 && temp <= 18 ? "Water temp ideal for surface activity. Keep a dry ready." : temp < 10 ? "Cool water: slow deep nymphing. Patience." : "Warm: dawn and dusk best.",
    "Debarb hooks. Most beats require it.",
    "Carry amadou or desiccant. False casting dries flies but spooks fish.",
  ];
  return { tippet, leader, tips };
}

function getBeatTips(temp, level) {
  const a = [];
  if (temp >= 12) { a.push({ w: "Carriers and side streams", y: "Warmer, sheltered. Mayfly hatches start here first." }); a.push({ w: "Weed bed margins", y: "Nymphs emerge from weed. Fish station downstream." }); }
  if (level > 0.5) a.push({ w: "Slack water and eddies", y: "Fish conserve energy. Food collects." });
  if (level < 0.4) a.push({ w: "Deeper pools and runs", y: "Fish retreat when levels drop." });
  a.push({ w: "Under overhanging trees", y: "Shade, cover, terrestrials. Big fish." });
  a.push({ w: "Tail of pools", y: "Shallow even flow. Classic dry fly water." });
  if (temp >= 14) a.push({ w: "Shallow gravel runs", y: "Mayfly nymphs burrow in gravel." });
  return a;
}

/* ═══ STYLES ═══ */
const K = {
  bg:"#111210", c1:"#1A1916", c2:"#222120", c3:"#2C2A27", bd:"#363330",
  tx:"#E8E0D0", txM:"#9B907F", txD:"#5A5448",
  ac:"#D4A030", acS:"#D4A03018", acB:"#D4A03038",
  gn:"#7A9E7E", gnD:"#5A7A5E", rd:"#C17B6A", og:"#D4893A", bl:"#6B8DA6", cr:"#F0E8D8",
};
const hColor = s => s > 70 ? K.ac : s > 40 ? K.gn : s > 15 ? K.txM : K.txD;
const iColor = v => v >= 7 ? "#D4A030" : v >= 5 ? "#B8922E" : v >= 3 ? "#7A9E7E" : v >= 1.5 ? "#3E5A40" : v > 0.3 ? "#252E26" : K.c2;

/* ═══ MAIN APP ═══ */
export default function App() {
  const [riv, setRiv] = useState("test");
  const [beatIdx, setBeatIdx] = useState(6); // Stockbridge
  const [adv, setAdv] = useState(false);
  const [tab, setTab] = useState("forecast");
  const [pick, setPick] = useState(false);
  const [hDay, setHDay] = useState(0);
  const [flyTab, setFlyTab] = useState("dry");
  const [planBeat, setPlanBeat] = useState("");
  const [planDate, setPlanDate] = useState("");
  const [plans, setPlans] = useState([]);

  // Live data state
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dataSource, setDataSource] = useState("loading");
  const refreshRef = useRef(null);

  const rv = RIVERS[riv];
  const bt = rv.beats[beatIdx] || rv.beats[0];
  const seed = (riv + bt.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  // Fallback simulated data
  const simD = useMemo(() => simData(riv, bt.id), [riv, bt.id]);
  const simWx = useMemo(() => simWeather(seed), [seed]);

  // Fetch live data on mount and river/beat change
  const doFetch = useCallback(async () => {
    setLoading(true);
    try {
      const live = await fetchLiveData(riv, bt);
      setLiveData(live);
      setDataSource(live.isLive ? "live" : "simulated");
      setLastUpdate(new Date());
    } catch {
      setDataSource("simulated");
    }
    setLoading(false);
  }, [riv, bt]);

  useEffect(() => { doFetch(); }, [doFetch]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    refreshRef.current = setInterval(doFetch, 900000);
    return () => clearInterval(refreshRef.current);
  }, [doFetch]);

  // Reset beat when river changes
  useEffect(() => { setBeatIdx(0); }, [riv]);

  // Derive current conditions from live or fallback
  const curTemp = liveData?.temp ?? simD[simD.length - 1].temp;
  const curLevel = liveData?.level ?? simD[simD.length - 1].level;
  const curFlow = liveData?.flow ?? simD[simD.length - 1].flow;
  const prevLevel = simD.length > 1 ? simD[simD.length - 2].level : curLevel;
  const prevTemp = simD.length > 1 ? simD[simD.length - 2].temp : curTemp;
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 864e5);

  // Weather from live or fallback
  const weather = liveData?.weather || simWx;

  // Predictions from real data
  const spp = useMemo(() => predict(curTemp, curLevel, dayOfYear), [curTemp, curLevel, dayOfYear]);
  const lr = useMemo(() => genLR(curTemp, dayOfYear), [curTemp, dayOfYear]);
  const rpts = useMemo(() => getRpts(riv), [riv]);
  const dan = spp.find(s => s.id === "danica");
  const topH = spp[0];
  const hIdx = Math.round(spp.reduce((s, h) => s + h.score * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) / spp.reduce((s, h) => s + 100 * (h.t === 1 ? 3 : h.t === 2 ? 1.5 : 0.8), 0) * 100);
  const lv = curLevel > 0.6 ? { t:"HIGH", c:K.rd } : curLevel > 0.45 ? { t:"NORMAL", c:K.gn } : { t:"LOW", c:K.bl };
  const kit = getKit(curTemp, curLevel, topH);
  const beatTips = getBeatTips(curTemp, curLevel);
  const activeIds = spp.filter(s => s.score > 10).map(s => s.id);

  // Hourly forecast: combine live weather air temp with water temp estimate
  const hourlyDays = useMemo(() => {
    if (!weather) return [];
    return weather.map((day, d) => ({
      ...day,
      hours: (day.hours || []).map(h => {
        // Estimate water temp from air temp (chalkstreams are buffered, ~60% of air swing)
        const baseWater = curTemp;
        const airDelta = (h.airTemp || 15) - (day.aH + day.aL) / 2;
        const estWaterTemp = +(baseWater + airDelta * 0.15).toFixed(1);
        const hi = hourlyIntensity(estWaterTemp, dayOfYear + d, h.h);
        return { ...h, wt: estWaterTemp, hi: +hi.toFixed(1) };
      }),
    }));
  }, [weather, curTemp, dayOfYear]);

  const Sec = ({ label, children }) => <div style={{ marginBottom: 20 }}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", color: K.txD, marginBottom: 10 }}>{label}</div>{children}</div>;
  const Card = ({ children, accent, style: s }) => <div style={{ background: accent ? K.acS : K.c1, borderRadius: 10, border: `1px solid ${accent ? K.acB : K.bd}`, overflow: "hidden", ...s }}>{children}</div>;

  const tabs = [{ id:"forecast", l:"Forecast" },{ id:"hourly", l:"Hourly" },{ id:"longrange", l:"Long Range" },{ id:"flybox", l:"Fly Box" },{ id:"kit", l:"Kit & Tips" },{ id:"plan", l:"Plan" },{ id:"reports", l:"Reports" },{ id:"local", l:"Local" }];

  const SRow = ({ sp }) => {
    const isM = sp.id === "danica";
    return (
      <div style={{ padding: isM ? "18px 16px" : "12px 16px", borderBottom: `1px solid ${K.bd}`, background: isM ? K.acS : "transparent" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: CATC[sp.cat], minWidth: 14 }}>{CATL[sp.cat]}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontWeight: 700, color: isM ? K.ac : K.tx, fontSize: isM ? 16 : 13, fontFamily: "var(--sf)" }}>{sp.cm}</span>
              {isM && <span style={{ fontSize: 8, fontWeight: 700, color: K.ac, letterSpacing: "0.12em" }}>PEAK</span>}
            </div>
            {adv && <div style={{ fontSize: 10, color: K.txD, fontStyle: "italic" }}>{sp.nm}</div>}
            <div style={{ height: isM ? 6 : 4, background: K.c2, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${sp.score}%`, background: `linear-gradient(90deg, ${hColor(sp.score)}66, ${hColor(sp.score)})`, borderRadius: 3, transition: "width .6s" }} />
            </div>
            {adv && <div style={{ fontSize: 10, color: K.txD, marginTop: 4 }}>{sp.sz} | Hook {sp.hk} | {sp.tMin}-{sp.tMax}°C</div>}
          </div>
          <div style={{ textAlign: "right", minWidth: 42 }}>
            <div style={{ fontSize: isM ? 26 : 20, fontWeight: 700, fontFamily: "var(--sf)", color: hColor(sp.score), lineHeight: 1 }}>{sp.score}</div>
            <div style={{ fontSize: 8, fontWeight: 600, color: hColor(sp.score), marginTop: 2 }}>{sp.lb}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ "--sf":"'Playfair Display',Georgia,serif", "--sn":"'Barlow',sans-serif", fontFamily:"var(--sn)", background:K.bg, minHeight:"100vh", color:K.tx, WebkitFontSmoothing:"antialiased", maxWidth:480, margin:"0 auto" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`*{box-sizing:border-box;margin:0}input,select,textarea{font-family:inherit;background:${K.c2};color:${K.tx};border:1px solid ${K.bd};border-radius:6px;padding:10px 12px;font-size:13px;width:100%}input:focus,select:focus{outline:none;border-color:${K.ac}}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${K.bd};border-radius:2px}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.fu{animation:fu .3s ease both}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.pulse{animation:pulse 1.5s infinite}`}</style>

      {/* ══ HEADER ══ */}
      <div style={{ background: `linear-gradient(170deg, ${K.bg}, ${K.c3} 60%, #1A2418)`, padding: "24px 16px 18px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-conic-gradient(#E8DFD0 0% 25%, transparent 0% 50%)", backgroundSize: "3px 3px" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <MiniLogo />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 44, fontWeight: 900, fontFamily: "var(--sf)", color: K.ac, lineHeight: 1 }}>{hIdx}</div>
              <div style={{ fontSize: 7, color: K.txD, letterSpacing: "0.25em" }}>HATCH INDEX</div>
            </div>
          </div>

          {/* Live data indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <div className={loading ? "pulse" : ""} style={{ width: 6, height: 6, borderRadius: 3, background: dataSource === "live" ? K.gn : dataSource === "loading" ? K.og : K.rd }} />
            <span style={{ fontSize: 9, color: K.txD, letterSpacing: "0.08em" }}>
              {loading ? "FETCHING LIVE DATA..." : dataSource === "live" ? `LIVE DATA / Updated ${lastUpdate?.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) || ""}` : "SIMULATED / APIs unavailable - will retry"}
            </span>
            {!loading && <button onClick={doFetch} style={{ background: "none", border: `1px solid ${K.bd}`, borderRadius: 4, padding: "2px 6px", color: K.txD, fontSize: 8, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>↻</button>}
          </div>

          {dan && (
            <Card accent style={{ padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: K.ac }}>THE MAYFLY / E. DANICA</div>
                  <div style={{ fontSize: 12, color: K.txM, marginTop: 4, lineHeight: 1.5 }}>
                    {dan.score > 70 ? "Full hatch. Get on the water." : dan.score > 40 ? "Building. Daily emergence." : dan.score > 15 ? "Early signs. Days away." : "Not yet. Patience."}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "var(--sf)", color: K.ac, lineHeight: 1 }}>{dan.score}</div>
                  <div style={{ fontSize: 8, color: K.ac, fontWeight: 700 }}>{dan.lb.toUpperCase()}</div>
                </div>
              </div>
            </Card>
          )}

          <button onClick={() => setPick(!pick)} style={{ width: "100%", background: K.c2, border: `1px solid ${K.bd}`, borderRadius: 8, padding: "10px 14px", color: K.tx, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
            <span>{rv.n} / {bt.n}</span><span style={{ color: K.txD }}>{pick ? "−" : "+"}</span>
          </button>
          {pick && (
            <div className="fu" style={{ marginTop: 8, background: K.c1, borderRadius: 10, padding: 12, border: `1px solid ${K.bd}` }}>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {Object.entries(RIVERS).map(([k, r]) => <button key={k} onClick={() => setRiv(k)} style={{ padding: "4px 10px", borderRadius: 5, border: riv===k?`1px solid ${K.ac}`:`1px solid ${K.bd}`, background: riv===k?K.acS:"transparent", color: riv===k?K.ac:K.txM, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{r.n}</button>)}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {rv.beats.map((b, i) => <button key={b.id} onClick={() => { setBeatIdx(i); setPick(false); }} style={{ padding: "3px 8px", borderRadius: 4, border: beatIdx===i?`1px solid ${K.cr}`:`1px solid ${K.bd}`, background: beatIdx===i?K.c3:"transparent", color: beatIdx===i?K.cr:K.txD, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>{b.n}</button>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${K.bd}` }}>
        {[{ l:"WATER", v:`${curTemp}°`, s:`${curTemp>prevTemp?"▲":"▼"}${Math.abs(curTemp-prevTemp).toFixed(1)}°`, c:curTemp>=12&&curTemp<=18?K.gn:K.bl },
          { l:"LEVEL", v:`${curLevel}m`, s:lv.t, c:lv.c },
          { l:"FLOW", v:curFlow||"--", s:"m³/s", c:K.txM }
        ].map((s,i) => (
          <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i<2?`1px solid ${K.bd}`:"", background: K.c1 }}>
            <div style={{ fontSize: 7, letterSpacing: "0.2em", color: K.txD }}>{s.l}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--sf)", color: s.c, lineHeight: 1, marginTop: 3 }}>{s.v}</div>
            <div style={{ fontSize: 9, color: s.c, fontWeight: 600, marginTop: 2 }}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* ══ TABS ══ */}
      <div style={{ display: "flex", background: K.c1, borderBottom: `1px solid ${K.bd}`, overflowX: "auto" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 10px 8px", border: "none", borderBottom: tab===t.id?`2px solid ${K.ac}`:"2px solid transparent", background: "none", color: tab===t.id?K.ac:K.txD, fontWeight: 600, fontSize: 10, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginBottom: -1, whiteSpace: "nowrap" }}>{t.l}</button>)}
      </div>
      <div style={{ padding: "8px 16px", background: K.c2, borderBottom: `1px solid ${K.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: K.txD, letterSpacing: "0.1em" }}>ADVANCED</span>
        <button onClick={() => setAdv(!adv)} style={{ width: 34, height: 18, borderRadius: 9, border: `1px solid ${adv?K.ac:K.bd}`, background: adv?K.ac:K.c1, cursor: "pointer", position: "relative" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: adv?K.bg:K.txD, position: "absolute", top: 2, left: adv?18:2, transition: "left .3s" }} />
        </button>
      </div>

      {/* ══ CONTENT ══ */}
      <div style={{ padding: 16 }}>

        {tab === "forecast" && <div className="fu">
          <Sec label="THE MAYFLY"><Card>{spp.filter(s=>s.cat==="mayfly").map(s=><SRow key={s.id} sp={s}/>)}</Card></Sec>
          <Sec label="ALL HATCHES"><Card>{spp.filter(s=>s.cat!=="mayfly"&&(adv||s.score>5)).map(s=><SRow key={s.id} sp={s}/>)}</Card></Sec>
          <Sec label="TODAY'S TOP FLIES"><Card style={{ padding: 16 }}>
            {["dry","emerger","nymph"].map(cat => {
              const rel = FLIES[cat].filter(f => f.match.some(m => activeIds.includes(m))).slice(0, 3);
              if (!rel.length) return null;
              return <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: cat==="dry"?K.ac:cat==="emerger"?K.gn:K.bl, marginBottom: 6 }}>{cat.toUpperCase()}</div>
                {rel.map(f => <div key={f.nm} style={{ padding: "6px 0", borderBottom: `1px solid ${K.bd}`, display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 12, fontWeight: 600 }}>{f.nm}</div><div style={{ fontSize: 10, color: K.txD }}>Size {f.sz}</div></div>
                  <div style={{ display: "flex", gap: 2, alignItems: "center" }}>{Array.from({length:f.eff},(_,i)=><div key={i} style={{ width: 5, height: 5, borderRadius: 3, background: K.ac }}/>)}</div>
                </div>)}
              </div>;
            })}
          </Card></Sec>
        </div>}

        {tab === "hourly" && (() => {
          const day = hourlyDays[hDay]; if (!day) return <div style={{ color: K.txM, padding: 20 }}>Loading weather data...</div>;
          const pk = day.hours.reduce((a,b) => (a.hi||0) > (b.hi||0) ? a : b, day.hours[0]);
          return <div className="fu">
            <div style={{ display: "flex", gap: 4, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {hourlyDays.map((d,i) => <button key={i} onClick={() => setHDay(i)} style={{ padding: "6px 10px", borderRadius: 6, border: hDay===i?`1px solid ${K.ac}`:`1px solid ${K.bd}`, background: hDay===i?K.acS:K.c1, color: hDay===i?K.ac:K.txM, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}><div>{d.dn}</div><div style={{ fontSize: 8, marginTop: 1 }}>{d.df}</div></button>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 }}>
              {[{ l:"AIR", v:`${day.aH||"--"}°/${day.aL||"--"}°` },{ l:"WIND", v:`${day.wd||"?"} ${day.ws||"--"}mph` },{ l:"RAIN", v:`${day.rain||0}%` },{ l:"PRESS", v:`${day.pr||"--"}mb` }].map((s,i)=>(
                <div key={i} style={{ background: K.c1, borderRadius: 6, border: `1px solid ${K.bd}`, padding: "8px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 7, letterSpacing: "0.12em", color: K.txD }}>{s.l}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: K.tx, marginTop: 2 }}>{s.v}</div>
                </div>
              ))}
            </div>
            {pk && <Card accent style={{ padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: K.ac }}>PEAK WINDOW</div><div style={{ fontSize: 12, color: K.tx, marginTop: 3 }}>{pk.h}:00 / Water ~{pk.wt}°C / Intensity {(pk.hi||0).toFixed(1)}</div></div>
                <div style={{ fontSize: 26, fontFamily: "var(--sf)", fontWeight: 900, color: K.ac }}>{(pk.hi||0).toFixed(0)}</div>
              </div>
            </Card>}
            <Card style={{ padding: 14 }}>
              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: K.txD, marginBottom: 8 }}>HATCH INTENSITY</div>
              <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {(day.hours||[]).map(h => <div key={h.h} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 7, color: K.txD, marginBottom: 2 }}>{h.h}</div>
                  <div style={{ width: 24, height: 24, borderRadius: 3, background: iColor(h.hi||0), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: (h.hi||0) >= 3 ? K.bg : K.txD, fontWeight: (h.hi||0) >= 5 ? 700 : 400 }}>{(h.hi||0) >= 1 ? (h.hi||0).toFixed(0) : ""}</div>
                </div>)}
              </div>
            </Card>
          </div>;
        })()}

        {tab === "longrange" && <div className="fu">
          <Sec label="8-WEEK OUTLOOK"><Card>{lr.map((w,i) => (
            <div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${K.bd}`, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ minWidth: 80 }}><div style={{ fontSize: 11, fontWeight: 600, color: i===0?K.ac:K.tx }}>{w.l}</div><div style={{ fontSize: 8, color: w.cf==="High"?K.gn:w.cf==="Med"?K.og:K.txD, fontWeight: 600, marginTop: 2 }}>{w.cf.toUpperCase()}</div></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><span style={{ fontSize: 8, color: K.ac, fontWeight: 600, minWidth: 36 }}>Danica</span><div style={{ flex: 1, height: 6, background: K.c2, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${w.ds}%`, background: K.ac, borderRadius: 3 }}/></div><span style={{ fontSize: 10, fontWeight: 700, color: K.ac, minWidth: 24, textAlign: "right" }}>{w.ds}%</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 8, color: K.gn, fontWeight: 600, minWidth: 36 }}>Overall</span><div style={{ flex: 1, height: 4, background: K.c2, borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${w.oa*10}%`, background: K.gn, borderRadius: 2 }}/></div><span style={{ fontSize: 9, fontWeight: 600, color: K.gn, minWidth: 24, textAlign: "right" }}>{w.oa}</span></div>
              </div>
              <div style={{ fontSize: 9, color: K.txD, minWidth: 36, textAlign: "right" }}>~{w.pt}°C</div>
            </div>
          ))}</Card></Sec>
        </div>}

        {tab === "flybox" && <div className="fu">
          <div style={{ background: K.rd+"18", border: `1px solid ${K.rd}44`, borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: K.rd, marginBottom: 4 }}>⚠ CHECK BEAT REGULATIONS</div>
            <div style={{ fontSize: 11, color: K.txM, lineHeight: 1.5 }}>Fly restrictions vary by beat. Some are upstream dry fly only. Always confirm with the beat keeper before fishing.</div>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {[{id:"dry",l:"DRIES",c:K.ac},{id:"emerger",l:"EMERGERS",c:K.gn},{id:"nymph",l:"NYMPHS",c:K.bl}].map(t=>(
              <button key={t.id} onClick={()=>setFlyTab(t.id)} style={{ flex: 1, padding: "10px 8px", borderRadius: 8, border: flyTab===t.id?`1px solid ${t.c}`:`1px solid ${K.bd}`, background: flyTab===t.id?t.c+"18":K.c1, color: flyTab===t.id?t.c:K.txD, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit" }}>{t.l}</button>
            ))}
          </div>
          <Card>{FLIES[flyTab].map((f,i) => {
            const isM = f.match.some(m => activeIds.includes(m));
            return <div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${K.bd}`, background: isM ? K.acS : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontSize: 14, fontWeight: 700, color: isM?K.ac:K.tx, fontFamily: "var(--sf)" }}>{f.nm}</span>{isM && <span style={{ fontSize: 8, fontWeight: 700, color: K.ac, marginLeft: 6, letterSpacing: "0.1em", background: K.acB, padding: "1px 6px", borderRadius: 3 }}>MATCH</span>}</div>
                <div style={{ display: "flex", gap: 2 }}>{Array.from({length:f.eff},(_,j)=><div key={j} style={{ width: 5, height: 5, borderRadius: 3, background: isM?K.ac:K.txD }}/>)}</div>
              </div>
              <div style={{ fontSize: 10, color: K.txD, marginTop: 4 }}>Size {f.sz} | {f.wt}</div>
              {adv && <div style={{ fontSize: 11, color: K.txM, marginTop: 4, lineHeight: 1.5 }}>{f.note}</div>}
            </div>;
          })}</Card>
        </div>}

        {tab === "kit" && <div className="fu">
          <Sec label="TODAY'S KIT CHECK"><Card style={{ padding: 16 }}>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: K.ac, marginBottom: 6 }}>TIPPET</div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--sf)", color: K.tx }}>{kit.tippet.sz}</div><div style={{ fontSize: 11, color: K.txM, marginTop: 4 }}>{kit.tippet.n}</div></div>
            <div style={{ marginBottom: 14 }}><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: K.ac, marginBottom: 6 }}>LEADER</div><div style={{ fontSize: 12, color: K.tx, lineHeight: 1.6 }}>{kit.leader}</div></div>
            <div><div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: K.ac, marginBottom: 6 }}>GUIDE TIPS</div>
              {kit.tips.map((t,i) => <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${K.bd}`, fontSize: 12, color: K.txM, lineHeight: 1.6, display: "flex", gap: 8 }}><span style={{ color: K.ac, flexShrink: 0 }}>•</span>{t}</div>)}
            </div>
          </Card></Sec>
          <Sec label="WHERE TO FISH"><Card style={{ padding: 16 }}>
            {beatTips.map((a,i) => <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${K.bd}` }}><div style={{ fontSize: 13, fontWeight: 600 }}>{a.w}</div><div style={{ fontSize: 11, color: K.txM, marginTop: 3 }}>{a.y}</div></div>)}
          </Card></Sec>
          <Sec label="WEATHER TACTICS"><Card style={{ padding: 16 }}>
            {[{ c:"Overcast & warm", t:"Best for danica. Fish confident. Big dries." },{ c:"Bright sunshine", t:"Fish in shade. Longer tippets. Early/evening best." },{ c:"Cold & blustery", t:"Iron blue day. Small dark flies. Don't give up." },{ c:"Falling pressure", t:"Triggers hatches. Fish sense the front." },{ c:"After rain", t:"Slight colour helps. Nymphs early, dries as it clears." }].map((w,i)=>(
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${K.bd}` }}><div style={{ fontSize: 12, fontWeight: 600, color: K.ac }}>{w.c}</div><div style={{ fontSize: 11, color: K.txM, marginTop: 2, lineHeight: 1.5 }}>{w.t}</div></div>
            ))}
          </Card></Sec>
        </div>}

        {tab === "plan" && <div className="fu">
          <Sec label="PLAN YOUR DAY"><Card style={{ padding: 16 }}>
            <div style={{ marginBottom: 12 }}><label style={{ fontSize: 10, color: K.txD, letterSpacing: "0.1em", marginBottom: 4, display: "block" }}>BEAT</label>
              <select value={planBeat} onChange={e=>setPlanBeat(e.target.value)}><option value="">Select beat...</option>{Object.entries(RIVERS).map(([k,r])=>r.beats.map(b=><option key={`${k}-${b.id}`} value={`${r.n} / ${b.n}`}>{r.n} - {b.n}</option>))}</select></div>
            <div style={{ marginBottom: 12 }}><label style={{ fontSize: 10, color: K.txD, letterSpacing: "0.1em", marginBottom: 4, display: "block" }}>DATE</label><input type="date" value={planDate} onChange={e=>setPlanDate(e.target.value)}/></div>
            <button onClick={() => { if (planBeat&&planDate) { setPlans(p=>[...p,{b:planBeat,d:planDate,id:Date.now()}]); setPlanBeat(""); setPlanDate(""); }}} style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: K.ac, color: K.bg, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer", fontFamily: "inherit" }}>ADD TO PLAN</button>
          </Card></Sec>
          {plans.length>0 && <Sec label="YOUR PLANS"><Card>{plans.map(p=><div key={p.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${K.bd}`, display: "flex", justifyContent: "space-between" }}><div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.b}</div><div style={{ fontSize: 10, color: K.txD }}>{new Date(p.d).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</div></div><button onClick={()=>setPlans(x=>x.filter(z=>z.id!==p.id))} style={{ background: "none", border: "none", color: K.rd, cursor: "pointer", fontSize: 14 }}>×</button></div>)}</Card></Sec>}
          <Sec label="TYPICAL DAY"><Card style={{ padding: 16 }}>
            {[{ t:"06:00-08:00", n:"Dawn. Caenis if warm. Spot fish, plan approach." },{ t:"09:00-11:00", n:"Olives start. LDO, medium olives. Nymphs effective." },{ t:"11:00-14:00", n:"Prime danica window. Iron blues if cold." },{ t:"14:00-16:00", n:"Pale wateries, spurwings. Morning spinner falls." },{ t:"16:00-18:00", n:"Danica spinners. Some of the best dry fly fishing." },{ t:"18:00-21:00", n:"Evening rise. BWO, sedges, sherry spinners. Magic hour." }].map((s,i)=>(
              <div key={i} style={{ padding: "8px 0", borderBottom: `1px solid ${K.bd}`, display: "flex", gap: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: K.ac, minWidth: 70, flexShrink: 0 }}>{s.t}</div><div style={{ fontSize: 11, color: K.txM, lineHeight: 1.5 }}>{s.n}</div></div>
            ))}
          </Card></Sec>
        </div>}

        {tab === "reports" && <div className="fu">
          <Card style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: K.ac, marginBottom: 8 }}>RIVER'S EYE VIEW</div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.8, color: K.txM }}>
              {riv==="test" ? `The Test is in superb form. Olives consistent, first danica emerging around Stockbridge and Mottisfont. Clarity exceptional. Emergers outperforming duns in the carriers. The main event is building.` : `The ${rv.n} is in ${curLevel>0.5?"good heart":"fine form"}. Water at ${curTemp}°C. ${rv.desc}`}
            </p>
          </Card>
          <Sec label="FIELD REPORTS"><Card style={{ padding: "4px 16px" }}>
            {rpts.map((r,i) => {
              const sc = {Field:K.gn,Guide:K.bl,Club:K.gnD,Estate:K.og,Social:K.txM};
              return <div key={i} style={{ padding: "14px 0", borderBottom: `1px solid ${K.bd}` }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: sc[r.src], border: `1px solid ${(sc[r.src]||K.txM)}33`, padding: "1px 6px", borderRadius: 3 }}>{r.src.toUpperCase()}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{r.bt}</span><span style={{ fontSize: 10, color: K.txD }}>{r.d}</span>
                  <span style={{ marginLeft: "auto", fontSize: 8, color: r.v?K.gn:K.og, fontWeight: 600 }}>{r.v?"VERIFIED":"ANECDOTAL"}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: K.txM }}>{r.tx}</p>
              </div>;
            })}
          </Card></Sec>
        </div>}

        {tab === "local" && <div className="fu">
          {(() => { const loc = LOCALS[riv] || LOCALS.test; return <>
            <Sec label="TACKLE SHOPS"><Card>{(loc.tackle||[]).map((l,i)=><div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${K.bd}` }}><div style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--sf)" }}>{l.nm}</div><div style={{ fontSize: 10, color: K.txD, marginTop: 2 }}>{l.addr}</div><div style={{ fontSize: 11, color: K.txM, marginTop: 4 }}>{l.note}</div></div>)}</Card></Sec>
            <Sec label="PUBS & CAFES"><Card>{(loc.food||[]).map((l,i)=><div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${K.bd}` }}><div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--sf)" }}>{l.nm}</span><span style={{ fontSize: 9, color: K.gn, fontWeight: 600 }}>{l.tp}</span></div><div style={{ fontSize: 10, color: K.txD, marginTop: 2 }}>{l.addr}</div><div style={{ fontSize: 11, color: K.txM, marginTop: 4 }}>{l.note}</div></div>)}</Card></Sec>
          </>; })()}
        </div>}
      </div>

      {/* ══ FOOTER ══ */}
      <div style={{ textAlign: "center", padding: "28px 16px 36px", borderTop: `1px solid ${K.bd}` }}>
        <FooterLogo />
        <div style={{ fontSize: 8, color: K.txD, marginTop: 10, letterSpacing: "0.05em", lineHeight: 1.7 }}>
          {dataSource === "live" ? "Live data: EA Hydrology API / Open-Meteo" : "Simulated data / APIs connect on deployment"}<br/>
          Auto-refreshes every 15 minutes<br/>
          {new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </div>
      </div>
    </div>
  );
}
