import {useState,useMemo,useEffect,useCallback} from "react";
import {D,L} from "./lib/theme.js";
import {SB_URL,SB_KEY,sbInsert,sbSelect,sbUpdate,sbDelete} from "./lib/supabase.js";
import {fetchWx,fetchEA} from "./lib/api.js";
import {DOY,HOUR,isNight,simT,scClr,scLb,hC,pred,hInt,hatchesAtHr,condScore,danSt,whatChanged,buildTimeline,nowWindow,buildAntic,genLR,buildRig,fmtDur} from "./lib/scoring.js";
import {getHatches,FLYMAP,FLYCONF,CC} from "./data/hatches.js";
import {UK_RIVERS,UK_REGIONS} from "./data/rivers.js";
import {USA_RIVERS,USA_REGIONS} from "./data/rivers_usa.js";
import {NZ_RIVERS,NZ_REGIONS} from "./data/rivers_nz.js";
import {FLIES} from "./data/flies.js";
import {BL} from "./data/beats.js";
import GuideTab from "./components/Guide/GuideTab.jsx";
import HatchesTab from "./components/Hatches/HatchesTab.jsx";
import FlyBoxTab from "./components/FlyBox/FlyBoxTab.jsx";
import LogTab from "./components/Log/LogTab.jsx";
import TipsTab from "./components/Tips/TipsTab.jsx";
import MapHome from "./components/Map/MapHome.jsx";
import FeedTab from "./components/Feed/FeedTab.jsx";

/* ── REGISTER SERVICE WORKER ── */
if(typeof window!=="undefined"&&"serviceWorker"in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}

/* ── LOGO + WORDMARK ── */
const Logo=({s=24})=><img src="/logo-mark.svg" alt="Ephemera" width={s} height={s} style={{borderRadius:s*0.2}}/>;
const Wordmark=({w=120,dark=true})=><img src="/wordmark.svg" alt="EPHEMERA" width={w} height={Math.round(w*168/1054)} style={{display:"block",filter:dark?"invert(0.85) brightness(1.5)":"none"}}/>;

/* ── CONSTANTS ── */
const BETA_CODE="RIVERTEST";
const STORE_USER="eph_user";const STORE_SESSIONS="eph_sessions";const STORE_PREFS="eph_prefs";const STORE_FAVS="eph_favs";
function getUser(){try{return JSON.parse(localStorage.getItem(STORE_USER))}catch{return null}}
function setUser(u){localStorage.setItem(STORE_USER,JSON.stringify(u))}
function getSessions(){try{return JSON.parse(localStorage.getItem(STORE_SESSIONS))||[]}catch{return[]}}
function saveSessions(s){localStorage.setItem(STORE_SESSIONS,JSON.stringify(s))}
function getPrefs(){try{return JSON.parse(localStorage.getItem(STORE_PREFS))||{}}catch{return{}}}
function savePrefs(p){localStorage.setItem(STORE_PREFS,JSON.stringify(p))}
function getFavs(){try{return JSON.parse(localStorage.getItem(STORE_FAVS))||[]}catch{return[]}}
function saveFavs(f){localStorage.setItem(STORE_FAVS,JSON.stringify(f))}
const STORE_POSTS="eph_posts";
function getCachedPosts(){try{return JSON.parse(localStorage.getItem(STORE_POSTS))||[]}catch{return[]}}
function cachePosts(p){try{localStorage.setItem(STORE_POSTS,JSON.stringify(p.slice(0,60)))}catch{}}
async function hashPw(pw){const enc=new TextEncoder().encode(pw+"eph_salt_2026");const buf=await crypto.subtle.digest("SHA-256",enc);return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("")}

/* ── ALL RIVERS — UK + USA + NZ ── */
const ALL_RV=[...UK_RIVERS,...USA_RIVERS,...NZ_RIVERS];
const ALL_REGIONS_UK=UK_REGIONS;
const ALL_REGIONS_USA=USA_REGIONS;
const ALL_REGIONS_NZ=NZ_RIVERS.map(r=>r.rg).filter((v,i,a)=>a.indexOf(v)===i).sort();

/* ── SCENARIOS ── */
const SC=[
  {id:"rising",i:"🐟",l:"Fish rising, won't take",a:[
    {h:"Match the size exactly",c:85,d:"If they're refusing, the fly is too big. Go one hook size smaller. Tiny differences matter. An #18 when they want a #20 is the difference between a take and a refusal."},
    {h:"Degrease your leader",c:80,d:"A shiny leader is a warning sign. Mud the last 3 feet. Fish the leader, not just the fly. A tippet cutting through surface film spooks selective fish."},
    {h:"Change your position",c:75,d:"You might be casting across a current seam — try approaching from directly downstream. One drag-free drift is worth ten sloppy ones."},
    {h:"Try a spent or emerger pattern",c:70,d:"If they're refusing duns, they might be taking emergers or spinners in the film. A CDC shuttlecock or spent gnat often works when nothing else will."}
  ]},
  {id:"nothing",i:"😶",l:"Nothing showing at all",a:[
    {h:"Nymph the deep channels",c:85,d:"If there's no surface activity, the fish are feeding sub-surface. A weighted PTN or hare's ear in the deep channels will find them."},
    {h:"Work the shaded banks",c:75,d:"In bright conditions fish retreat to shade. Run your fly along overhanging vegetation. Dapple it if you can."},
    {h:"Try a terrestrial",c:70,d:"Even without a hatch, ants, beetles and black gnats blow onto the water. Try a Black Ant on a calm reach and wait. It can produce surprising results."},
    {h:"Rest the water and wait",c:65,d:"Sometimes conditions just aren't right yet. Find a comfortable spot with a view of a good rise-line and wait. The afternoon can change everything."}
  ]},
  {id:"refusing",i:"🙄",l:"Refusing at the last second",a:[
    {h:"Go finer on tippet",c:88,d:"Last-second refusals often mean the fish can see the tippet. Drop to 6X or even 7X if conditions allow. You'll lose more fish but get more takes."},
    {h:"Change the pattern",c:82,d:"Try a CDC fly over a traditional hackled pattern. The soft, natural fibres create a much more convincing surface footprint."},
    {h:"Reduce drag completely",c:78,d:"A tiny amount of drag is enough to put a selective fish off. Reach cast, pile cast, or simply shorten your drift."},
    {h:"Switch to a smaller size",c:72,d:"One hook size down often makes the difference. If on #16, try #18. The fish are being very specific about what they want."}
  ]},
  {id:"cruising",i:"🔄",l:"Fish cruising, not feeding",a:[
    {h:"Intercept ahead of the fish",c:80,d:"Don't cast at the fish — cast where it's going. Lead it by 2-3 feet. Land the fly and let the fish swim to it, not the other way around."},
    {h:"Try a static fly",c:75,d:"For cruising fish, sometimes a completely static fly works better than drag-free drift. Let it sit and wait."},
    {h:"Match the prevailing food",c:70,d:"Cruising fish are often looking for something specific. Watch what they're doing when they briefly pause — they might be taking emerging buzzers or daphnia."},
    {h:"Wait for a feeding fish",c:65,d:"A cruising fish is much harder to catch than one in a feeding lie. If possible, move on and find a fish that's actually eating."}
  ]},
  {id:"windy",i:"💨",l:"Too windy for dry fly",a:[
    {h:"Fish the lee bank",c:88,d:"Wind pushes terrestrials and surface food to the sheltered bank. Position yourself to fish along the lee side where food accumulates."},
    {h:"Shorten your cast",c:82,d:"In wind, accuracy beats distance every time. Get closer, make shorter casts, and use the wind when it's behind you. A 10-metre cast in wind beats a 20-metre one any day."},
    {h:"Try a beetle or ant",c:78,d:"Wind brings terrestrials onto the water. A Black Ant or Foam Beetle worked slowly into pockets of calm water can produce when dries won't."},
    {h:"Switch to nymph",c:85,d:"Wind destroys dry fly presentation. A nymph fished upstream through the broken water is often far more productive."}
  ]},
  {id:"bright",i:"☀",l:"Too bright, fish gone shy",a:[
    {h:"Fish smaller and finer",c:88,d:"In bright sun every imperfection is magnified. Go down two tippet sizes and one hook size. Fish low, long, and slow."},
    {h:"Target shaded spots only",c:85,d:"Fish retreat to shade in bright conditions. Under bridges, overhanging trees, and deep pools. The open glides are empty."},
    {h:"Wait for cloud cover",c:75,d:"The fishing will be transformed when a cloud covers the sun. Take a break, eat your lunch, and be ready when the light changes."},
    {h:"Try evenings",c:80,d:"Bright sunny days often produce excellent evening rises as temperatures drop and light angles improve. The evening rise can be exceptional after a tough day."}
  ]},
  {id:"spooking",i:"😱",l:"Spooking every fish",a:[
    {h:"Approach from further downstream",c:90,d:"Stay low, move slowly, and keep further back than you think necessary. In clear water, approach from 12 metres not 8. Your shadow is the enemy."},
    {h:"Wear drab clothing",c:75,d:"Bright colours and movement are visible to trout. Wear dull greens, browns, khaki. And stop waving your rod around when observing the water."},
    {h:"Crouch or kneel",c:85,d:"Get your profile down. A kneeling angler is almost invisible. Use the riverbank vegetation for cover and move like you're stalking, not strolling."},
    {h:"Wait longer between casts",c:78,d:"Continuous casting movement spooks fish. Make one good cast, wait, then cast again. Pause for a full minute before re-casting to the same fish."}
  ]},
  {id:"missed",i:"🎣",l:"Missing strikes",a:[
    {h:"Slow your strike",c:82,d:"The most common mistake. On dry fly, pause a beat before lifting. Say 'God save the king' before striking. You're striking too fast."},
    {h:"Keep a tighter line",c:78,d:"Slack line means missed fish. Keep contact with the fly at all times. Fish a slightly shorter cast to reduce slack."},
    {h:"Check your hook point",c:85,d:"Run your thumbnail across the hook point after every fish and snag. A dulled hook will miss 80% of takes. Sharpen or replace."},
    {h:"Lower your rod tip",c:72,d:"Striking with a high rod tip means you're lifting line off the water before the hook tightens. Keep the rod lower and strike sideways."}
  ]}
];

/* ── SAMPLE REPORTS ── */
function relDate(n){const d=new Date();d.setDate(d.getDate()-n);return d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}
const RPT={test:[{d:relDate(0),bt:"Stockbridge",au:"River Keeper",src:"Keeper",tx:"Good olive hatch through the morning. Water clarity excellent. Ranunculus in superb condition.",v:true},{d:relDate(1),bt:"Park Stream",au:"Guide",src:"Guide",tx:"Afternoon olives brought fish up. Two good trout on CDC shuttlecocks. Water temp 13.2C.",v:true},{d:relDate(2),bt:"Mottisfont",au:"@chalkstream_life",src:"Social",tx:"Iron blues in the drizzle. Lovely sport on small dries.",v:false},{d:relDate(3),bt:"Leckford",au:"Estate Keeper",src:"Keeper",tx:"Strong LDO hatch midmorning. Hawthorn about on the meadow stretches.",v:true},{d:relDate(4),bt:"Longparish",au:"Test Valley FC",src:"Club",tx:"Steady olives and pale wateries. River in fine order.",v:true}],itchen:[{d:relDate(1),bt:"Abbotts Barton",au:"Winchester AC",src:"Club",tx:"Consistent olive hatch. Technical fish. Fine tippets essential.",v:true}],kennet:[{d:relDate(2),bt:"Ramsbury",au:"@kennet_fly",src:"Social",tx:"Good olives midday. Grayling on nymphs in the afternoon.",v:false}]};

/* ═══ APP ═══ */
export default function App(){
  /* AUTH */
  const[user,setUserState]=useState(()=>getUser());
  const[authStep,setAuthStep]=useState("beta");
  const[authName,setAuthName]=useState("");const[authEmail,setAuthEmail]=useState("");
  const[authUsername,setAuthUsername]=useState("");
  const[authPw,setAuthPw]=useState("");const[authPw2,setAuthPw2]=useState("");
  const[betaCode,setBetaCode]=useState("");const[betaErr,setBetaErr]=useState("");
  const[authErr,setAuthErr]=useState("");
  const[optNewsletter,setOptNewsletter]=useState(true);const[optBeta,setOptBeta]=useState(true);
  const[confirmCode,setConfirmCode]=useState("");const[confirmErr,setConfirmErr]=useState("");
  const[showProfile,setShowProfile]=useState(false);
  const[editIg,setEditIg]=useState("");const[igSaved,setIgSaved]=useState(false);
  const[resetSent,setResetSent]=useState(false);
  const[showFeedback,setShowFeedback]=useState(false);
  const[fbRating,setFbRating]=useState(0);const[fbBest,setFbBest]=useState("");
  const[fbWorse,setFbWorse]=useState("");const[fbFeature,setFbFeature]=useState("");const[fbSubmitted,setFbSubmitted]=useState(false);

  const register=async()=>{
    if(!authName.trim()||!authEmail.trim()){setAuthErr("Name and email required.");return}
    const uname=authUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g,"");
    if(uname.length<3||uname.length>20){setAuthErr("Username must be 3-20 characters (letters, numbers, underscore).");return}
    if(authPw.length<6){setAuthErr("Password must be 6+ characters.");return}
    if(authPw!==authPw2){setAuthErr("Passwords don't match.");return}
    if(!authEmail.includes("@")){setAuthErr("Enter a valid email.");return}
    setAuthErr("Creating account...");
    const pwHash=await hashPw(authPw);const email=authEmail.trim().toLowerCase();
    const existing=await sbSelect("signups",`email=eq.${encodeURIComponent(email)}&select=email`);
    if(existing&&existing.length>0){setAuthErr("Email already registered. Try signing in.");return}
    const takenUn=await sbSelect("signups",`username=eq.${encodeURIComponent(uname)}&select=username`);
    if(takenUn&&takenUn.length>0){setAuthErr(`@${uname} is already taken. Try another.`);return}
    const code=String(100000+Math.floor(((email.length*7+authName.trim().length*13)%900000))).slice(0,6);
    const u={name:authName.trim(),email,username:uname,pwHash,joined:new Date().toISOString(),newsletter:optNewsletter,betaTester:optBeta,confirmed:false,confirmCode:code};
    setUser(u);setUserState(u);setAuthStep("confirm");setAuthErr("");
    sbInsert("signups",{name:authName.trim(),email,username:uname,pw_hash:pwHash,newsletter:optNewsletter,beta_tester:optBeta,confirmed:false,beta_code:BETA_CODE});
    fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:authName.trim(),email,username:uname,newsletter:optNewsletter,betaTester:optBeta})}).catch(()=>{});
  };
  const signIn=async()=>{
    if(!authEmail.trim()||!authPw){setAuthErr("Email and password required.");return}
    setAuthErr("Signing in...");
    const email=authEmail.trim().toLowerCase();const pwHash=await hashPw(authPw);
    const rows=await sbSelect("signups",`email=eq.${encodeURIComponent(email)}&select=*`);
    if(rows&&rows.length>0){
      const row=rows[0];
      if(row.pw_hash!==pwHash){setAuthErr("Wrong password.");return}
      const u={name:row.name,email:row.email,username:row.username||"",instagramHandle:row.instagram_handle||"",pwHash:row.pw_hash,joined:row.created_at,newsletter:row.newsletter,betaTester:row.beta_tester,confirmed:row.confirmed};
      setUser(u);setUserState(u);
      if(!row.confirmed){setAuthStep("confirm");u.confirmCode=String(100000+Math.floor(((email.length*7+row.name.length*13)%900000))).slice(0,6);setUser(u);setUserState(u)}
      setAuthErr("");
      const remoteSessions=await sbSelect("sessions",`user_email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=50`);
      if(remoteSessions&&remoteSessions.length>0){const mapped=remoteSessions.map(s=>({id:s.id,d:new Date(s.created_at).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(s.created_at).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),river:s.river,beat:s.beat,fish:s.fish||0,big:s.biggest,fly:s.best_fly,notes:s.notes,rating:s.rating,dur:s.duration||"",user:s.user_name,score:s.score,topHatch:s.top_hatch}));setSessions(mapped);saveSessions(mapped)}
    }else{
      /* Supabase unreachable or account not found — check localStorage cache */
      const cached=getUser();
      if(cached&&cached.email===email&&cached.pwHash===pwHash){
        setUserState(cached);setAuthErr("");
        if(!cached.confirmed)setAuthStep("confirm");
      }else{
        setAuthErr("No account found. Create one first, or check your connection.");
      }
    }
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
  const saveIgHandle=async()=>{
    const handle=editIg.trim().replace(/^@/,"").toLowerCase().replace(/[^a-z0-9._]/g,"");
    const u={...user,instagramHandle:handle};setUser(u);setUserState(u);
    await sbUpdate("signups",`email=eq.${encodeURIComponent(user.email)}`,{instagram_handle:handle});
    setIgSaved(true);setTimeout(()=>setIgSaved(false),2500);
  };

  const submitFeedback=async()=>{
    await sbInsert("feedback",{user_email:user?.email,user_name:user?.name,rating:fbRating,best:fbBest,worse:fbWorse,feature:fbFeature});
    setFbSubmitted(true);
  };

  /* CORE STATE */
  const[riv,setRiv]=useState(()=>getPrefs().lastRiver||"test");
  const[beat,setBeat]=useState(()=>getPrefs().lastBeat||"Stockbridge");
  const[tab,setTab]=useState("map");const[pick,setPick]=useState(false);const[gDay,setGDay]=useState(-1);
  const[live,setLive]=useState({});const[light,setLight]=useState(()=>getPrefs().light||false);
  const[scenario,setScenario]=useState(null);const[method,setMethod]=useState("dry");
  const[flyT,setFlyT]=useState("dry");const[openFly,setOpenFly]=useState(null);
  const[ex,setEx]=useState({});const toggle=k=>setEx(p=>({...p,[k]:!p[k]}));
  const[riverSearch,setRiverSearch]=useState("");
  const[regionFilter,setRegionFilter]=useState("");
  const[territoryFilter,setTerritoryFilter]=useState("uk");
  const[favs,setFavs]=useState(()=>getFavs());
  const toggleFav=(id)=>{const nf=favs.includes(id)?favs.filter(f=>f!==id):[...favs,id];setFavs(nf);saveFavs(nf)};
  const[advanced,setAdvanced]=useState(false);
  const[customBeat,setCustomBeat]=useState("");
  const[customRv,setCustomRv]=useState(null);

  /* SESSION STATE */
  const[sessions,setSessions]=useState(()=>getSessions());
  const[showForm,setShowForm]=useState(false);
  const[onRiver,setOnRiver]=useState(false);
  const[sessionStart,setSessionStart]=useState(null);
  const[sessionSnaps,setSessionSnaps]=useState([]);
  const[sessionNotes,setSessionNotes]=useState("");
  const[sessionTick,setSessionTick]=useState(0);
  const[sessionTrack,setSessionTrack]=useState([]);
  const[showSessionMap,setShowSessionMap]=useState(false);
  const[recovered,setRecovered]=useState(false);
  const[gallery,setGallery]=useState(null);
  const[speaking,setSpeaking]=useState(false);
  const[listening,setListening]=useState(false);const[voiceResult,setVoiceResult]=useState("");
  const[riverAnalysis,setRiverAnalysis]=useState(null);const[riverAnalyzing,setRiverAnalyzing]=useState(false);
  const riverPhotoRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(riverPhotoRef){riverPhotoRef.type="file";riverPhotoRef.accept="image/*"}
  const[reviewing,setReviewing]=useState(false);
  const[sessionPublic,setSessionPublic]=useState(false);
  const[analyzing,setAnalyzing]=useState(null);
  const[sessionSummary,setSessionSummary]=useState("");
  const[flyAnalysis,setFlyAnalysis]=useState(null);
  const[flyQ,setFlyQ]=useState({size:"",colour:"",behaviour:""});
  const[flyAnalyzing,setFlyAnalyzing]=useState(false);
  const[flyBoxScan,setFlyBoxScan]=useState(null);const[flyBoxScanning,setFlyBoxScanning]=useState(false);
  const[archiveOverview,setArchiveOverview]=useState("");const[archiveLoading,setArchiveLoading]=useState(false);
  const[expandedSession,setExpandedSession]=useState(null);
  const[hatchObs,setHatchObs]=useState({});
  const[posts,setPosts]=useState(()=>getCachedPosts());
  const[loadingPosts,setLoadingPosts]=useState(false);
  const[mapsKey,setMapsKey]=useState(null);const[mapsLoaded,setMapsLoaded]=useState(false);
  const fileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(fileRef){fileRef.type="file";fileRef.accept="image/*";fileRef.setAttribute("capture","environment")}
  const flyFileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(flyFileRef){flyFileRef.type="file";flyFileRef.accept="image/*";flyFileRef.setAttribute("capture","environment")}
  const uploadRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(uploadRef){uploadRef.type="file";uploadRef.accept="image/*";uploadRef.multiple=true}

  /* EXIF TIMESTAMP */
  const extractExifTime=(file)=>new Promise(res=>{
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const view=new DataView(reader.result);
        if(view.getUint16(0)!==0xFFD8){res(null);return}
        let offset=2;
        while(offset<view.byteLength-2){
          const marker=view.getUint16(offset);
          if(marker===0xFFE1){
            const exifStart=offset+10;
            const le=view.getUint16(exifStart)===0x4949;
            const g=(o,s)=>le?(s===2?view.getUint16(o,true):view.getUint32(o,true)):(s===2?view.getUint16(o):view.getUint32(o));
            const ifdOff=exifStart+g(exifStart+4,4);
            const entries=g(ifdOff,2);
            for(let i=0;i<entries;i++){
              const eOff=ifdOff+2+i*12;
              if(g(eOff,2)===0x8769){
                const subOff=exifStart+g(eOff+8,4);
                const subEntries=g(subOff,2);
                for(let j=0;j<subEntries;j++){
                  const sOff=subOff+2+j*12;
                  const sTag=g(sOff,2);
                  if(sTag===0x9003||sTag===0x9004){
                    const strOff=exifStart+g(sOff+8,4);
                    let str="";for(let k=0;k<19;k++)str+=String.fromCharCode(view.getUint8(strOff+k));
                    const[date,time]=str.split(" ");
                    if(date&&time){const d=new Date(date.replace(/:/g,"-")+"T"+time);if(!isNaN(d.getTime())){res(d);return}}
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
    reader.readAsArrayBuffer(file.slice(0,128*1024));
  });

  /* COMPRESS IMAGE */
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

  /* UPLOAD AFTER SESSION */
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

  /* SESSION FORM STATE */
  const[fName,setFName]=useState(()=>user?.name||"");
  const[fBeat,setFBeat]=useState("");const[fFish,setFish]=useState("");
  const[fBig,setFBig]=useState("");const[fFly,setFFly]=useState("");
  const[fNotes,setFNotes]=useState("");const[fRating,setFRating]=useState("");
  const[fDate,setFDate]=useState(()=>new Date().toISOString().slice(0,10));
  const[fPhotos,setFPhotos]=useState([]);
  const manualPhotoRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(manualPhotoRef){manualPhotoRef.type="file";manualPhotoRef.accept="image/*";manualPhotoRef.multiple=true}

  const P=light?L:D;
  const rv=customRv||ALL_RV.find(r=>r.id===riv)||UK_RIVERS[0];

  /* SAVE PREFS */
  useEffect(()=>{savePrefs({lastRiver:riv,lastBeat:beat,light})},[riv,beat,light]);

  /* DATA FETCH */
  const doFetch=useCallback(async()=>{try{const[ea,wx]=await Promise.all([fetchEA(rv.ea||null),fetchWx(rv.lat,rv.lng)]);setLive({ea,wx})}catch{}},[rv]);
  useEffect(()=>{doFetch()},[doFetch]);
  useEffect(()=>{const i=setInterval(doFetch,onRiver?3e5:9e5);return()=>clearInterval(i)},[doFetch,onRiver]);
  useEffect(()=>{setBeat(rv.b?.[0]||"")},[riv]);

  /* LOAD GOOGLE MAPS */
  useEffect(()=>{
    if(mapsLoaded||window.google)return;
    fetch("/api/maps-key").then(r=>r.json()).then(d=>{
      const key=d.key||d.GOOGLE_MAPS_KEY;if(!key)return;
      setMapsKey(key);
      const s=document.createElement("script");
      s.src=`https://maps.googleapis.com/maps/api/js?key=${key}`;
      s.async=true;s.defer=true;
      s.onload=()=>setMapsLoaded(true);
      document.head.appendChild(s);
    }).catch(()=>{});
  },[]);

  /* SESSION TIMER */
  useEffect(()=>{if(!onRiver)return;const i=setInterval(()=>setSessionTick(t=>t+1),60000);return()=>clearInterval(i)},[onRiver]);

  /* LOAD POSTS WHEN FEED TAB OPENS */
  useEffect(()=>{if(tab==="feed")loadPosts()},[tab]);

  /* HATCH ARRAY — changes with territory */
  const H=useMemo(()=>getHatches(rv?.territory||"uk"),[rv?.territory]);

  /* COMPUTED CONDITIONS */
  const rSeed=rv.id.split("").reduce((a,c,i)=>a+c.charCodeAt(0)*(i+1),0);
  const cT=live.ea?.temp||simT(rv.lat,rv.territory||"uk");
  const cW=live.wx?.current?.wind_speed_10m?Math.round(live.wx.current.wind_speed_10m*0.621):(4+(rSeed%12));
  const cP=live.wx?.current?.pressure_msl?Math.round(live.wx.current.pressure_msl):(1008+(rSeed%18));
  const cC=live.wx?.current?.cloud_cover??(30+(rSeed%50));
  const cAir=live.wx?.current?.temperature_2m?Math.round(live.wx.current.temperature_2m):(11+(rSeed%8));
  const cHumidity=live.wx?.current?.relative_humidity_2m??70;

  const spp=useMemo(()=>pred(H,cT),[H,cT]);
  const dan=spp.find(s=>s.id==="danica");
  const topH=spp[0];
  const mayflyAbout=DOY>=130&&DOY<=175&&dan&&dan.score>5;

  const guideNote=useMemo(()=>{
    if(isNight)return"Rest up. The river will be there tomorrow.";
    const top=spp[0];const second=spp[1];
    const hr=new Date().getHours();
    const riverShort=rv.n.replace("River ","");
    const isMayflySeason=DOY>=135&&DOY<=175;
    const mayflyPeak=DOY>=140&&DOY<=165;
    const mayflyStr=isMayflySeason&&dan?Math.round(Math.min(10,dan.score/10*(cT>=13?1.2:cT>=11?1:0.6)*(cC>50?1.2:cC>30?1:0.7)*(cW<12?1:0.7)*(cP<1015?1.1:1))):0;

    let note=hr<10?"Morning. ":hr<13?"Good timing. ":hr<17?"Afternoon. ":"Evening session. ";
    note+=`${riverShort}${beat?" at "+beat:""}. `;

    if(isMayflySeason&&dan&&dan.score>5&&rv.territory!=="usa"&&rv.territory!=="nz"){
      if(mayflyPeak)note+=`It's mayfly time. The biggest event of the chalkstream year. `;
      else note+=`Early mayfly season. The first duns are starting to show. `;
      if(hr<11)note+=`Mayfly nymphs will be stirring in the silt. Fish a weighted mayfly nymph slow and deep through the morning. The duns usually start appearing after midday${cC>50?", maybe earlier with this cloud":""}. `;
      else if(hr<14)note+=`Watch the water carefully now. The first duns should start appearing. Trout often take emergers in the film before they commit to duns off the top. Start with a Danica Emerger or Klinkhamer. When you see confident splashy rises, switch to a Grey Wulff or Shadow Mayfly. `;
      else if(hr<17)note+=`This is prime time. ${mayflyStr>=7?"The hatch should be in full swing.":mayflyStr>=4?"The hatch is building.":"A few mayfly about."} Fish are looking up and abandoning their usual caution. Emergers and cripples often outfish the upright duns. Match the size, get a good drag-free drift, and hold your nerve on the take. `;
      else note+=`Evening spinner fall territory. Female mayfly return to lay eggs then die spent on the surface, wings splayed in that classic crucifix posture. Fish gorge on them. Try a Spent Gnat or Sherry Spinner fished dead in the film. Some of the biggest trout of the year come to spent mayfly at dusk. `;
      if(mayflyStr>=8)note+=`Conditions are ideal for a strong hatch today. Overcast, mild water, low wind. Should be a memorable day. `;
      else if(mayflyStr>=5)note+=`Decent conditions for the hatch. `;
      else if(mayflyStr<4&&mayflyStr>0)note+=`Conditions aren't ideal but mayfly still come off in all weathers. Stay ready. `;
    }else{
      if(top&&top.score>60)note+=`${top.cm} should be hatching well. Start with ${FLYMAP[top.id]||"a matching pattern"} and work upstream to rising fish. `;
      else if(top&&top.score>30)note+=`${top.cm} activity expected${cC>50?"":", once the cloud builds"}. Have ${FLYMAP[top.id]||"a matching pattern"} ready. `;
      else if(top&&top.score>10)note+=`Hatches look sparse. Start with a search pattern and watch the water. `;
      else note+=`Not much hatching expected. Nymph the deeper runs. Stay patient. `;
      if(cC<30&&cT>=14)note+=`Bright conditions. Keep low, stay back, fine tippet. Fish the shade. `;
      else if(cC>70)note+=`Cloud cover is ideal. Fish should feed confidently. `;
      if(cW>14)note+=`Wind making presentation tough. Shorten up, try a Black Ant or Beetle on the lee bank. `;
    }
    if(cAir>=24)note+=`Very warm. Drink plenty of water, wear a hat, and take breaks in the shade. Fishing may slow in the heat. `;
    else if(cAir>=20)note+=`Warm day. Stay hydrated and wear sunscreen. `;
    else if(cAir<8)note+=`Cold one. Dress warm and keep moving between pools. Hot drink in the bag. `;
    if(cAir>=18&&cC<40)note+=`Sunscreen and polaroids essential. `;
    if(!isMayflySeason&&second&&second.score>25)note+=`Also watch for ${second.cm}. `;
    if(cT>=12&&hr<16)note+=`If you can stay for the evening, do. The last hour of light often produces the best fishing of the day. `;
    return note.trim();
  },[spp,dan,cC,cW,cT,cP,cAir,mayflyAbout,isNight,rv,beat,H]);

  const actIds=spp.filter(s=>s.score>10).map(s=>s.id);
  const hIdx=spp.reduce((s,h)=>s+h.score*(h.t===1?3:h.t===2?1.5:0.8),0)/spp.reduce((s,h)=>s+100*(h.t===1?3:h.t===2?1.5:0.8),0)*100;
  const cond=useMemo(()=>condScore(H,cW,cP,cC,cT,hIdx,rv.q,rv.bq?.[beat]),[H,cW,cP,cC,cT,hIdx,rv,beat]);
  const rig=buildRig(cT,cW,cC,method,topH);
  const ds=danSt(cT);
  const antic=useMemo(()=>buildAntic(cW,cC,cP,cT,spp),[cW,cC,cP,cT,spp]);
  const delta=useMemo(()=>whatChanged(H,cW,cP,cC,cT,hIdx,rv.q,rv.bq?.[beat]),[H,cW,cP,cC,cT,hIdx,rv,beat]);
  const lr=useMemo(()=>genLR(cT),[cT]);
  const rpts=RPT[riv]||[];
  const srcC={Keeper:D.gn,Guide:D.txD,Club:"#5A7A5E",Social:D.txM};

  const wxDays=useMemo(()=>{
    const wx=live.wx;if(!wx?.hourly||!wx?.daily)return[];
    try{
      return Array.from({length:Math.min(7,wx.daily.time?.length||0)},(_,d)=>{
        const dt=new Date(wx.daily.time[d]);
        const hrs=[];
        for(let hr=7;hr<=21;hr++){
          const idx=d*24+hr;if(idx>=(wx.hourly.time?.length||0))break;
          const air=wx.hourly.temperature_2m?.[idx]||15;
          const bA=((wx.daily.temperature_2m_max?.[d]||15)+(wx.daily.temperature_2m_min?.[d]||8))/2;
          const wt=+(cT+(air-bA)*0.15).toFixed(1);
          hrs.push({h:hr,wt,air:Math.round(air),hi:+hInt(H,wt,hr).toFixed(1),ws:wx.hourly.wind_speed_10m?.[idx]?Math.round(wx.hourly.wind_speed_10m[idx]*0.621):null,cl:wx.hourly.cloud_cover?.[idx]??50});
        }
        return{dn:d===0?"Today":d===1?"Tmrw":dt.toLocaleDateString("en-GB",{weekday:"short"}),df:dt.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),aH:wx.daily.temperature_2m_max?.[d]?Math.round(wx.daily.temperature_2m_max[d]):null,aL:wx.daily.temperature_2m_min?.[d]?Math.round(wx.daily.temperature_2m_min[d]):null,rain:wx.daily.precipitation_sum?.[d]??null,windMax:wx.daily.wind_speed_10m_max?.[d]?Math.round(wx.daily.wind_speed_10m_max[d]*0.621):null,hrs};
      });
    }catch{return[]}
  },[live.wx,cT,H]);

  const timeline=useMemo(()=>wxDays[0]?buildTimeline(H,wxDays[0].hrs,cT):[],[wxDays,cT,H]);
  const nowWin=useMemo(()=>nowWindow(timeline),[timeline]);

  /* SESSION ACTIONS */
  const startSession=()=>{
    setOnRiver(true);setSessionStart(Date.now());setSessionSnaps([]);setSessionNotes("");setSessionTick(0);setReviewing(false);setSessionSummary("");setSessionTrack([]);setShowSessionMap(false);
    if(navigator.geolocation)navigator.geolocation.getCurrentPosition(
      pos=>setSessionTrack([{lat:pos.coords.latitude,lng:pos.coords.longitude,time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),label:"Start"}]),
      ()=>{},{enableHighAccuracy:true,timeout:10000}
    );
  };

  useEffect(()=>{
    if(!onRiver||!sessionStart)return;
    const save=()=>{try{localStorage.setItem("eph_live_session",JSON.stringify({start:sessionStart,river:rv.n,beat,snaps:sessionSnaps,notes:sessionNotes,track:sessionTrack,hatchObs,ts:Date.now()}))}catch{}};
    save();const i=setInterval(save,30000);return()=>clearInterval(i);
  },[onRiver,sessionStart,sessionSnaps,sessionNotes,sessionTrack,hatchObs]);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem("eph_live_session"));
      if(saved&&saved.start&&Date.now()-saved.ts<86400000){
        setOnRiver(true);setSessionStart(saved.start);setSessionSnaps(saved.snaps||[]);setSessionNotes(saved.notes||"");setSessionTrack(saved.track||[]);setHatchObs(saved.hatchObs||{});setRecovered(true);
      }else{localStorage.removeItem("eph_live_session")}
    }catch{localStorage.removeItem("eph_live_session")}
  },[]);

  const clearSavedSession=()=>{try{localStorage.removeItem("eph_live_session")}catch{}};

  const saveToRoll=(b64)=>{
    try{const link=document.createElement("a");link.href=`data:image/jpeg;base64,${b64}`;link.download=`ephemera-catch-${Date.now()}.jpg`;document.body.appendChild(link);link.click();document.body.removeChild(link)}catch{}
  };

  const getPos=()=>new Promise(res=>{
    if(!navigator.geolocation){res(null);return}
    navigator.geolocation.getCurrentPosition(pos=>res({lat:pos.coords.latitude,lng:pos.coords.longitude}),()=>res(null),{enableHighAccuracy:true,timeout:8000});
  });

  const onFishHere=(lat,lng,name)=>{
    let territory="uk";
    if(lng<-30)territory="usa";
    else if(lat<-20)territory="nz";
    setCustomRv({id:"__custom",n:name||"My Location",lat,lng,territory,q:5,b:[]});
  };

  function parsePostImages(p){
    if(p.images){try{const a=JSON.parse(p.images);if(Array.isArray(a))return{...p,images:a}}catch{}}
    return{...p,images:p.image?[p.image]:[]};
  }

  const loadPosts=useCallback(async()=>{
    setLoadingPosts(true);
    try{
      const remote=await sbSelect("posts","is_public=eq.true&order=created_at.desc&limit=60");
      if(remote&&remote.length>0){
        const parsed=remote.map(parsePostImages);
        setPosts(parsed);cachePosts(parsed);
      }else{const local=getCachedPosts();if(local.length>0)setPosts(local)}
    }catch{const local=getCachedPosts();if(local.length>0)setPosts(local)}
    setLoadingPosts(false);
  },[]);

  const createPost=async(post)=>{
    const newPost={...post,username:user?.username||"",instagram_handle:user?.instagramHandle||"",created_at:post.created_at||new Date().toISOString()};
    setPosts(p=>{const np=[newPost,...p];cachePosts(np);return np});
    const sbPost={...newPost,images:newPost.images?.length?JSON.stringify(newPost.images):null};
    sbInsert("posts",sbPost);
  };

  const deletePost=async(postId)=>{
    setPosts(p=>{const np=p.filter(x=>x.id!==postId);cachePosts(np);return np});
    sbDelete("posts",`id=eq.${postId}`);
  };

  const quickSnap=()=>{
    if(!fileRef)return;
    fileRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);const pos=await getPos();
      const time=new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});
      const snap={id:Date.now(),photo:b64,timestamp:time,species:"",weight:"",fly:"",wild:"",notes:"",analysis:null,lat:pos?.lat||null,lng:pos?.lng||null};
      setSessionSnaps(s=>[...s,snap]);
      if(pos)setSessionTrack(t=>[...t,{lat:pos.lat,lng:pos.lng,time,label:`Catch ${sessionSnaps.length+1}`}]);
      saveToRoll(b64);fileRef.value="";
    };
    fileRef.click();
  };

  /* AI FISH ID */
  const analyzeFish=async(snapId)=>{
    const snap=sessionSnaps.find(s=>s.id===snapId);if(!snap)return;
    setAnalyzing(snapId);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:snap.photo,mode:"fish"})});
      const data=await r.json();
      if(data.quality==="unusable"){setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:{...data,unusable:true}}:sn))}
      else{setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:data,species:data.species||"",weight:data.weight_estimate_lb?String(data.weight_estimate_lb):"",wild:data.wild_stocked||""}:sn))}
    }catch(e){setSessionSnaps(s=>s.map(sn=>sn.id===snapId?{...sn,analysis:{error:e.message}}:sn))}
    setAnalyzing(null);
  };

  const[analysingAll,setAnalysingAll]=useState(false);
  const[archiveAnalyzing,setArchiveAnalyzing]=useState(null);

  const analyzeArchiveCatch=async(sessionId,catchIdx)=>{
    const sess=sessions.find(s=>(s.id||0)===sessionId);
    if(!sess||!sess.catches?.[catchIdx]?.photo)return;
    const key=`${sessionId}-${catchIdx}`;setArchiveAnalyzing(key);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:sess.catches[catchIdx].photo,mode:"fish"})});
      const data=await r.json();
      const updated=sessions.map(s=>{
        if((s.id||0)!==sessionId)return s;
        const catches=[...s.catches];
        if(data.quality!=="unusable"){catches[catchIdx]={...catches[catchIdx],analysis:data,species:data.species||catches[catchIdx].species,weight:data.weight_estimate_lb?String(data.weight_estimate_lb):catches[catchIdx].weight,wild:data.wild_stocked||catches[catchIdx].wild}}
        else{catches[catchIdx]={...catches[catchIdx],analysis:{...data,unusable:true}}}
        return{...s,catches};
      });
      setSessions(updated);try{saveSessions(updated)}catch{}
    }catch{}
    setArchiveAnalyzing(null);
  };

  const analyseAll=async()=>{
    const unanalysed=sessionSnaps.filter(s=>s.photo&&!s.analysis);
    if(!unanalysed.length)return;setAnalysingAll(true);
    for(const snap of unanalysed){
      setAnalyzing(snap.id);
      try{
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:snap.photo,mode:"fish"})});
        const data=await r.json();
        if(data.quality==="unusable"){setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:{...data,unusable:true}}:sn))}
        else{setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:data,species:data.species||sn.species,weight:data.weight_estimate_lb?String(data.weight_estimate_lb):sn.weight,wild:data.wild_stocked||sn.wild}:sn))}
      }catch(e){setSessionSnaps(s=>s.map(sn=>sn.id===snap.id?{...sn,analysis:{error:e.message}}:sn))}
    }
    setAnalyzing(null);setAnalysingAll(false);
  };

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

  const speak=(text)=>{
    if(!window.speechSynthesis)return;
    if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return}
    const u=new SpeechSynthesisUtterance(text);u.rate=0.9;u.pitch=1;u.lang="en-GB";
    const voices=window.speechSynthesis.getVoices();
    const british=voices.find(v=>v.lang==="en-GB"&&v.name.includes("Daniel"))||voices.find(v=>v.lang==="en-GB")||voices[0];
    if(british)u.voice=british;u.onend=()=>setSpeaking(false);setSpeaking(true);window.speechSynthesis.speak(u);
  };

  const startListening=()=>{
    if(!window.SpeechRecognition&&!window.webkitSpeechRecognition){setVoiceResult("Voice not supported in this browser.");return}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();rec.lang="en-GB";rec.continuous=false;rec.interimResults=false;
    rec.onresult=async(e)=>{
      const q=e.results[0][0].transcript;setListening(false);setVoiceResult("Thinking...");
      try{
        const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`You are Ephemera, a calm, expert fly fishing guide on ${rv.n} (${beat}). Water temp ${cT}°C, air ${cAir}°C, wind ${cW}mph, ${cC>70?"overcast":cC>40?"cloudy":"clear"}. Top hatch: ${topH?.cm||"olives"}. The angler asks: "${q}". Give practical, specific advice in 2-3 sentences. Calm, encouraging, British tone. If they sound frustrated, reassure them — one good cast beats twenty bad ones.`})});
        const d=await r.json();const answer=d.summary||"I didn't catch that. Try again.";setVoiceResult(answer);speak(answer);
      }catch{setVoiceResult("Couldn't connect. Check your signal.")}
    };
    rec.onerror=()=>{setListening(false);setVoiceResult("Couldn't hear you. Tap and try again.")};
    rec.onend=()=>setListening(false);setListening(true);setVoiceResult("");rec.start();
  };

  const analyzeRiver=()=>{
    if(!riverPhotoRef)return;
    riverPhotoRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);setRiverAnalyzing(true);setRiverAnalysis(null);
      try{const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"river"})});setRiverAnalysis(await r.json())}
      catch(e){setRiverAnalysis({error:e.message})}
      setRiverAnalyzing(false);riverPhotoRef.value="";
    };
    riverPhotoRef.click();
  };

  const identifyFly=(withPhoto)=>{
    if(withPhoto){
      if(!flyFileRef)return;
      flyFileRef.onchange=async(e)=>{
        const file=e.target.files?.[0];if(!file)return;
        const b64=await compressImg(file,800);setFlyAnalyzing(true);setFlyAnalysis(null);
        const extra=[];if(flyQ.size)extra.push(`Size: ${flyQ.size}`);if(flyQ.colour)extra.push(`Colour: ${flyQ.colour}`);if(flyQ.behaviour)extra.push(`Behaviour: ${flyQ.behaviour}`);
        try{const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"fly",observations:extra.join(". ")})});setFlyAnalysis(await r.json())}
        catch(e){setFlyAnalysis({error:e.message})}
        setFlyAnalyzing(false);flyFileRef.value="";
      };
      flyFileRef.click();
    }else{
      const obs=[];if(flyQ.size)obs.push(`Size: ${flyQ.size}`);if(flyQ.colour)obs.push(`Colour: ${flyQ.colour}`);if(flyQ.behaviour)obs.push(`Behaviour: ${flyQ.behaviour}`);
      if(!obs.length){setFlyAnalysis({error:"Select at least size, colour, or behaviour first."});return}
      setFlyAnalyzing(true);setFlyAnalysis(null);
      fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`You are an expert fly fishing entomologist. Identify the most likely insect from these observations and recommend artificial flies. Give: likely species, common group, life stage, confidence, matching artificials with hook sizes, and a single "tie on now" recommendation. Current: River ${rv.n}, ${cT}°C water, ${new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}. Observations: ${obs.join(". ")}`})})
        .then(r=>r.json()).then(d=>setFlyAnalysis({textId:true,summary:d.summary||"Could not identify."}))
        .catch(e=>setFlyAnalysis({error:e.message})).finally(()=>setFlyAnalyzing(false));
    }
  };

  const updateSnap=(id,field,val)=>setSessionSnaps(s=>s.map(sn=>sn.id===id?{...sn,[field]:val}:sn));

  const flyBoxRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(flyBoxRef){flyBoxRef.type="file";flyBoxRef.accept="image/*";flyBoxRef.setAttribute("capture","environment")}
  const scanFlyBox=()=>{
    if(!flyBoxRef)return;
    flyBoxRef.onchange=async(e)=>{
      const file=e.target.files?.[0];if(!file)return;
      const b64=await compressImg(file,800);setFlyBoxScanning(true);setFlyBoxScan(null);
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

  const generateArchiveOverview=async()=>{
    if(!sessions.length)return;setArchiveLoading(true);
    const data=sessions.slice(0,20).map(s=>`${s.d}: ${s.river}/${s.beat||s.bt}, ${s.fish||0} fish, ${s.dur||""}, best fly: ${s.fly||"?"}, rating: ${s.rating||"?"}, score: ${s.score||"?"}/100, hatch: ${s.topHatch||"?"}, ${s.notes||""}${s.summary?", AI: "+s.summary:""}`).join("\n");
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:`Analyse this angler's fishing history and give a detailed overview. Include: patterns in what's working (flies, conditions, times), rivers where they do best, areas to improve, and specific advice for their next session. Be specific and data-driven, not generic. Warm but honest guide tone.\n\nAngler: ${user?.name||"Unknown"}\nSessions:\n${data}`})});
      const d=await r.json();setArchiveOverview(d.summary||"Could not generate overview.");
    }catch{setArchiveOverview("Overview unavailable — check your connection.")}
    setArchiveLoading(false);
  };

  const endToReview=()=>{
    setOnRiver(false);setReviewing(true);
    if(navigator.geolocation)navigator.geolocation.getCurrentPosition(
      pos=>setSessionTrack(t=>[...t,{lat:pos.coords.latitude,lng:pos.coords.longitude,time:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),label:"End"}]),
      ()=>{},{enableHighAccuracy:true,timeout:8000}
    );
  };

  const generateSummary=async()=>{
    const catchData=sessionSnaps.map(s=>`${s.timestamp}: ${s.species||"Unknown species"}, ${s.weight?s.weight+"lb":"weight unknown"}, ${s.wild||"unknown origin"}, fly: ${s.fly||"not recorded"}, ${s.notes||""}`).join("\n");
    const data=`River: ${rv.n}, Beat: ${beat}, Date: ${new Date(sessionStart).toLocaleDateString("en-GB")}, Duration: ${fmtDur(Date.now()-sessionStart)}, Fish caught: ${sessionSnaps.length}, Conditions score: ${cond.pct}/100, Top hatch: ${topH?.cm||"none"}, Water temp: ${cT}°C, Air: ${cAir}°C, Wind: ${cW}mph\n\nCatches:\n${catchData}\n\nAngler notes: ${sessionNotes}`;
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"summary",sessionData:data})});
      const d=await r.json();setSessionSummary(d.summary||"Could not generate summary.");
    }catch{setSessionSummary("Summary unavailable — check your connection.")}
  };

  const saveSession=()=>{
    const fishCount=sessionSnaps.length;
    const bestFly=sessionSnaps.map(f=>f.fly).filter(Boolean).sort((a,b)=>sessionSnaps.filter(s=>s.fly===b).length-sessionSnaps.filter(s=>s.fly===a).length)[0]||"";
    const biggest=sessionSnaps.reduce((a,s)=>parseFloat(s.weight||0)>parseFloat(a)?s.weight:a,"0");
    const sess={id:Date.now(),d:new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:new Date(sessionStart).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}),dur:fmtDur(Date.now()-sessionStart),river:rv.n,beat,fish:fishCount,big:biggest!=="0"?biggest+"lb":"",fly:bestFly,notes:sessionNotes,user:user?.name||"Anon",score:cond.pct,topHatch:topH?.cm||"",summary:sessionSummary,isPublic:sessionPublic,gpsTrack:sessionTrack.length?sessionTrack:null,catches:sessionSnaps.map(s=>({timestamp:s.timestamp,species:s.species,weight:s.weight,fly:s.fly,wild:s.wild,notes:s.notes,photo:s.photo||null,lat:s.lat,lng:s.lng}))};
    try{const updated=[sess,...sessions];setSessions(updated);saveSessions(updated)}catch{
      const lite={...sess,catches:sess.catches.map(c=>({...c,photo:null}))};
      try{const ul=[lite,...sessions];setSessions(ul);saveSessions(ul)}catch{}
    }
    sbInsert("sessions",{user_email:user?.email,user_name:user?.name,river:rv.n,beat,fish:fishCount,biggest:biggest!=="0"?biggest+"lb":"",best_fly:bestFly,notes:sessionNotes+(sessionSummary?"\n\nAI Summary: "+sessionSummary:""),duration:sess.dur,score:cond.pct,top_hatch:topH?.cm||""});
    setReviewing(false);setSessionStart(null);setSessionSnaps([]);setSessionSummary("");setHatchObs({});setSessionTrack([]);clearSavedSession();
  };

  const addManualPhotos=()=>{
    if(!manualPhotoRef)return;
    manualPhotoRef.onchange=async(e)=>{
      const files=Array.from(e.target.files||[]);const newPhotos=[];
      for(const file of files){
        const b64=await compressImg(file,800);const exifDate=await extractExifTime(file);
        newPhotos.push({b64,time:exifDate?exifDate.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}):"",exifDate:exifDate?.toISOString()||null});
      }
      setFPhotos(p=>[...p,...newPhotos]);manualPhotoRef.value="";
    };
    manualPhotoRef.click();
  };

  const saveManualSession=()=>{
    if(fBeat&&(fNotes||fFish)){
      const dateObj=new Date(fDate+"T12:00:00");
      const sess={id:Date.now(),d:dateObj.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}),time:"",river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,big:fBig,fly:fFly,notes:fNotes,rating:fRating,user:fName||user?.name||"Anon",dur:"Manual",photos:fPhotos.map(p=>({b64:p.b64,time:p.time})),catches:fPhotos.map((p,i)=>({timestamp:p.time||"Photo "+(i+1),species:"",weight:"",fly:fFly,wild:"",notes:""}))};
      const updated=[sess,...sessions];setSessions(updated);saveSessions(updated);
      sbInsert("sessions",{user_email:user?.email,user_name:user?.name||fName,river:rv.n,beat:fBeat,fish:parseInt(fFish)||0,biggest:fBig,best_fly:fFly,notes:fNotes,rating:fRating,duration:"Manual"});
      setFBeat("");setFish("");setFBig("");setFFly("");setFNotes("");setFRating("");setFPhotos([]);setFDate(new Date().toISOString().slice(0,10));setShowForm(false);
    }
  };

  /* ── ONBOARDING ── */
  if(!user||!user.confirmed)return(
    <div style={{fontFamily:"'Barlow',sans-serif",background:D.bg,minHeight:"100vh",color:D.tx,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;margin:0}input{font-family:inherit;-webkit-appearance:none}input:focus{outline:none}`}</style>
      <Logo s={56}/>
      <div style={{marginTop:12}}><Wordmark w={140} dark={true}/></div>
      <div style={{fontSize:10,color:D.txD,marginTop:4,marginBottom:32}}>Timely insight. Better days.</div>

      {authStep==="beta"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:8}}>PRIVATE BETA</div>
        <div style={{fontSize:12,color:D.txM,lineHeight:1.6,marginBottom:16}}>Ephemera is currently in private beta. Enter your access code to continue.</div>
        <div style={{marginBottom:10}}><div style={{fontSize:8,color:D.txD,marginBottom:4}}>BETA ACCESS CODE</div><input value={betaCode} onChange={e=>{setBetaCode(e.target.value);setBetaErr("")}} placeholder="Enter code" style={{background:D.c2,border:`1px solid ${betaErr?D.rust:D.bd}`,borderRadius:6,padding:"12px",color:D.tx,fontSize:16,fontFamily:"inherit",width:"100%",letterSpacing:"0.1em",textAlign:"center",fontWeight:700}}/></div>
        {betaErr&&<div style={{fontSize:10,color:D.rust,marginBottom:8}}>{betaErr}</div>}
        <button onClick={()=>{if(betaCode.toUpperCase()===BETA_CODE){setAuthStep("register");setBetaErr("")}else setBetaErr("Invalid code. Contact ephemeraguideapp@gmail.com for access.")}} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>ENTER</button>
        <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:16,opacity:0.5}}>Don't have a code? Email ephemeraguideapp@gmail.com</div>
        <div style={{textAlign:"center",fontSize:10,color:D.txD,cursor:"pointer",marginTop:8}} onClick={()=>setAuthStep("signin")}>Already have an account? <span style={{color:D.rust}}>Sign in</span></div>
      </div>}

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

      {authStep==="register"&&<div style={{width:"100%",maxWidth:320}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.rust,marginBottom:4}}>BETA ACCESS GRANTED</div>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:D.txD,marginBottom:12}}>CREATE YOUR ACCOUNT</div>
        <div style={{display:"grid",gap:10}}>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>FULL NAME</div><input value={authName} onChange={e=>{setAuthName(e.target.value);setAuthErr("")}} placeholder="Your name" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div>
            <div style={{fontSize:8,color:D.txD,marginBottom:4}}>USERNAME</div>
            <div style={{display:"flex",alignItems:"center",background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",gap:2}}>
              <span style={{color:D.txD,fontSize:14}}>@</span>
              <input value={authUsername} onChange={e=>{setAuthUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""));setAuthErr("")}} placeholder="yourhandle" maxLength={20} style={{flex:1,background:"none",border:"none",color:D.tx,fontSize:14,fontFamily:"inherit"}}/>
            </div>
            <div style={{fontSize:9,color:D.txD,marginTop:3}}>3-20 characters. Letters, numbers, underscore.</div>
          </div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>EMAIL</div><input value={authEmail} onChange={e=>{setAuthEmail(e.target.value);setAuthErr("")}} placeholder="you@example.com" type="email" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>PASSWORD</div><input value={authPw} onChange={e=>{setAuthPw(e.target.value);setAuthErr("")}} placeholder="6+ characters" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div><div style={{fontSize:8,color:D.txD,marginBottom:4}}>CONFIRM PASSWORD</div><input value={authPw2} onChange={e=>{setAuthPw2(e.target.value);setAuthErr("")}} placeholder="Confirm" type="password" style={{background:D.c2,border:`1px solid ${D.bd}`,borderRadius:6,padding:"10px 12px",color:D.tx,fontSize:14,fontFamily:"inherit",width:"100%"}}/></div>
          <div style={{display:"grid",gap:6,padding:"8px 0"}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOptBeta(!optBeta)}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${optBeta?D.rust:D.bd}`,background:optBeta?D.rustS:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{optBeta&&<span style={{color:D.rust,fontSize:12,fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:11,color:D.txM}}>I'd like to be a <strong style={{color:D.rust}}>Beta Tester</strong> and help shape Ephemera</span>
            </label>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOptNewsletter(!optNewsletter)}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${optNewsletter?D.rust:D.bd}`,background:optNewsletter?D.rustS:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{optNewsletter&&<span style={{color:D.rust,fontSize:12,fontWeight:700}}>✓</span>}</div>
              <span style={{fontSize:11,color:D.txM}}>Subscribe to the Ephemera newsletter</span>
            </label>
          </div>
          {authErr&&<div style={{fontSize:10,color:D.rust}}>{authErr}</div>}
          <button onClick={register} style={{width:"100%",padding:14,borderRadius:8,border:"none",background:D.rust,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>CREATE ACCOUNT</button>
          <div style={{textAlign:"center",fontSize:9,color:D.txD,marginTop:4,opacity:0.5}}>Your data is stored locally during beta.</div>
        </div>
      </div>}

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
      <style>{`*{box-sizing:border-box;margin:0}html{-webkit-text-size-adjust:100%}input,textarea{font-family:inherit;-webkit-appearance:none}input:focus,textarea:focus{outline:none}::-webkit-scrollbar{height:4px}::-webkit-scrollbar-thumb{background:${P.bd};border-radius:2px}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>

      {/* HEADER */}
      <div style={{background:P.c1,padding:"14px 14px 12px",borderBottom:`1px solid ${P.bd}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><Logo s={28}/><Wordmark w={100} dark={!light}/></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>setLight(!light)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:6,padding:"4px 8px",color:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{light?"◐":"☀"}</button>
            <div onClick={()=>{setShowProfile(p=>!p);setEditIg(user.instagramHandle||"");setIgSaved(false)}} style={{width:28,height:28,borderRadius:14,background:P.c2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:P.txM,fontWeight:600,cursor:"pointer",border:`1px solid ${P.bd}`}}>{user.name[0]}</div>
          </div>
        </div>

        {/* PROFILE DROPDOWN */}
        {showProfile&&(
          <div style={{background:P.c2,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px 14px 12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:P.tx}}>{user.name}</div>
                {user.username&&<div style={{fontSize:11,color:P.gn,marginTop:1}}>@{user.username}</div>}
                <div style={{fontSize:10,color:P.txD,marginTop:2}}>{user.email}</div>
              </div>
              <button onClick={()=>setShowProfile(false)} style={{background:"none",border:"none",color:P.txD,fontSize:14,cursor:"pointer",padding:"2px 4px"}}>✕</button>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:8,color:P.txD,marginBottom:4,fontWeight:600,letterSpacing:"0.1em"}}>INSTAGRAM HANDLE</div>
              <div style={{display:"flex",gap:6}}>
                <div style={{flex:1,display:"flex",alignItems:"center",background:P.bg,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",gap:4}}>
                  <span style={{color:P.txD,fontSize:13}}>@</span>
                  <input value={editIg} onChange={e=>setEditIg(e.target.value.replace(/^@/,"").replace(/\s/g,""))} placeholder="yourhandle" style={{flex:1,background:"none",border:"none",color:P.tx,fontSize:13,fontFamily:"inherit"}}/>
                </div>
                <button onClick={saveIgHandle} style={{background:igSaved?P.gn:P.rust,border:"none",borderRadius:6,padding:"8px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>{igSaved?"Saved":"Save"}</button>
              </div>
              {user.instagramHandle&&<div style={{fontSize:9,color:P.txD,marginTop:4}}>Links to instagram.com/{user.instagramHandle}</div>}
            </div>
            <button onClick={()=>{setShowProfile(false);logout()}} style={{width:"100%",padding:"8px",borderRadius:6,border:`1px solid ${P.bd}`,background:"none",color:P.txD,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Sign out</button>
          </div>
        )}

        {/* RIVER SEARCH + NEAR ME */}
        <div style={{display:"flex",gap:6}}>
          <div onClick={()=>{setPick(!pick);setRiverSearch("");setRegionFilter("")}} style={{flex:1,background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:P.txM,cursor:"pointer"}}>{rv.n+(beat?" / "+beat:"")}</div>
          <button onClick={()=>{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(pos=>{const lat=pos.coords.latitude,lng=pos.coords.longitude;let best=ALL_RV[0],bestD=999;ALL_RV.forEach(r=>{const d=Math.sqrt((r.lat-lat)**2+(r.lng-lng)**2);if(d<bestD){bestD=d;best=r}});setRiv(best.id);setCustomRv(null);setPick(false)},()=>{},{enableHighAccuracy:true,timeout:8000})}} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"9px 12px",color:P.txM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Near me</button>
        </div>

        {/* PICKER */}
        {pick&&<div style={{marginTop:8,background:P.c2,borderRadius:8,padding:10,border:`1px solid ${P.bd}`}}>
          <input value={riverSearch} onChange={e=>setRiverSearch(e.target.value)} placeholder="Search rivers..." autoFocus style={{width:"100%",background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",marginBottom:8}}/>

          {/* TERRITORY + REGION FILTERS */}
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            {[{id:"uk",l:"UK"},{id:"usa",l:"USA"},{id:"nz",l:"NZ"}].map(t=>(
              <button key={t.id} onClick={()=>{setTerritoryFilter(t.id);setRegionFilter("")}} style={{padding:"5px 10px",borderRadius:5,border:territoryFilter===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:territoryFilter===t.id?P.rustS:"transparent",color:territoryFilter===t.id?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
            ))}
            <select value={regionFilter} onChange={e=>setRegionFilter(e.target.value)} style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:6,padding:"5px 8px",color:P.tx,fontSize:10,fontFamily:"inherit",flex:1}}>
              <option value="">All {territoryFilter==="uk"?"regions":territoryFilter==="usa"?"regions":"regions"}</option>
              {territoryFilter==="uk"&&<option value="chalk">Chalkstreams</option>}
              {territoryFilter==="uk"&&<option value="Stillwater">Stillwater</option>}
              {(territoryFilter==="uk"?ALL_REGIONS_UK:territoryFilter==="usa"?ALL_REGIONS_USA:ALL_REGIONS_NZ).filter(r=>r!=="Stillwater").map(rg=><option key={rg} value={rg}>{rg}</option>)}
            </select>
          </div>

          {favs.length>0&&<div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:6,marginBottom:6,borderBottom:`1px solid ${P.bd}`}}>
            {favs.map(fid=>{const fr=ALL_RV.find(r=>r.id===fid);if(!fr)return null;return<button key={fid} onClick={()=>{setRiv(fid);setPick(false)}} style={{flexShrink:0,padding:"4px 10px",borderRadius:5,border:riv===fid?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:riv===fid?P.gn+"18":"transparent",color:riv===fid?P.gn:P.tx,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{fr.n.replace("River ","")}</button>})}
          </div>}

          <div style={{maxHeight:180,overflowY:"auto"}}>{(()=>{
            let rivers=ALL_RV.filter(r=>(r.territory||"uk")===territoryFilter);
            if(territoryFilter==="uk"&&regionFilter==="chalk")rivers=rivers.filter(r=>r.premium);
            else if(regionFilter)rivers=rivers.filter(r=>r.rg===regionFilter);
            if(riverSearch.trim())rivers=rivers.filter(r=>r.n.toLowerCase().includes(riverSearch.toLowerCase())||r.rg?.toLowerCase().includes(riverSearch.toLowerCase()));
            rivers=rivers.sort((a,b)=>{const af=favs.includes(a.id)?0:1,bf=favs.includes(b.id)?0:1;if(af!==bf)return af-bf;const ap=a.premium?0:1,bp=b.premium?0:1;if(ap!==bp)return ap-bp;return a.n.localeCompare(b.n)});
            if(!rivers.length)return<div style={{textAlign:"center",padding:12,color:P.txD,fontSize:11}}>No rivers found</div>;
            return rivers.slice(0,20).map(r=><div key={r.id} onClick={()=>{setRiv(r.id);setCustomRv(null);if(!r.b||r.b.length<=1)setPick(false);setRiverSearch("")}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 4px",borderBottom:`1px solid ${P.bd}`,cursor:"pointer"}}>
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

      {/* HERO CARD — hidden on map (map has its own score badge) */}
      {tab!=="map"&&tab!=="feed"&&<div style={{padding:"12px 14px",background:P.bg}}>
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
      </div>}

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
            <button onClick={async()=>{const pos=await getPos();if(pos){const url=`https://maps.google.com/?q=${pos.lat},${pos.lng}`;const text=`I'm fishing on ${rv.n}${beat?" / "+beat:""} — find me here: ${url}`;if(navigator.share)navigator.share({title:"Ephemera — Live Location",text}).catch(()=>{});else{navigator.clipboard.writeText(text).catch(()=>{});alert("Location link copied!")}}else alert("GPS not available — check location permissions")}} style={{background:"transparent",border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 8px",color:P.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>📍</button>
            <button onClick={endToReview} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 10px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>END</button>
          </div>
        </div>
        :reviewing?<div style={{display:"flex",alignItems:"center",gap:8,width:"100%",justifyContent:"space-between"}}>
          <div style={{fontSize:10,fontWeight:700,color:P.rust}}>SESSION REVIEW — {sessionSnaps.length} catch{sessionSnaps.length!==1?"es":""}</div>
          <button onClick={()=>{setReviewing(false);setSessionStart(null);setSessionSnaps([]);clearSavedSession()}} style={{fontSize:9,color:P.txD,background:"none",border:`1px solid ${P.bd}`,borderRadius:5,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit"}}>Discard</button>
        </div>:null}
      </div>

      {/* TABS */}
      {/* MAP TAB — full bleed, no padding */}
      {tab==="map"&&<MapHome
        P={P} rv={rv} riv={riv} beat={beat}
        cond={cond} topH={topH} cT={cT} cW={cW} cC={cC} cHumidity={cHumidity}
        mapsLoaded={mapsLoaded} allRivers={[...UK_RIVERS,...USA_RIVERS,...NZ_RIVERS]}
        setRiv={(id)=>{setRiv(id);setCustomRv(null)}}
        setBeat={setBeat}
        onFishHere={onFishHere}
        customRv={customRv}
      />}

      {/* FEED TAB — full bleed */}
      {tab==="feed"&&<FeedTab
        P={P} user={user}
        posts={posts} loadingPosts={loadingPosts}
        onCreatePost={createPost} onDeletePost={deletePost}
        currentRv={rv} cT={cT} cAir={cAir} cW={cW} cHumidity={cHumidity}
        sessionSnaps={sessionSnaps} sessions={sessions}
      />}

      <div style={{padding:tab==="map"||tab==="feed"?0:14}}>

        {/* GUIDE */}
        {tab==="guide"&&<GuideTab
          P={P} guideNote={guideNote} speak={speak} speaking={speaking}
          topH={topH} dan={dan} spp={spp} timeline={timeline}
          cT={cT} cC={cC} cW={cW} wxDays={wxDays} gDay={gDay} setGDay={setGDay}
          H={H} rv={rv} beat={beat} method={method}
          advanced={advanced} setAdvanced={setAdvanced}
          onRiver={onRiver} reviewing={reviewing} rig={rig}
          ex={ex} toggle={toggle} nowWin={nowWin}
          sessionSnaps={sessionSnaps} quickSnap={quickSnap} setGallery={setGallery}
          sessionStart={sessionStart} fmtDur={fmtDur}
          recovered={recovered} setRecovered={setRecovered}
          uploadAfterSession={uploadAfterSession} analyseAll={analyseAll} analysingAll={analysingAll}
          analyzing={analyzing} analyzeFish={analyzeFish} aiDescribe={aiDescribe}
          sessionTrack={sessionTrack} showSessionMap={showSessionMap} setShowSessionMap={setShowSessionMap}
          mapsLoaded={mapsLoaded} updateSnap={updateSnap}
          sessionNotes={sessionNotes} setSessionNotes={setSessionNotes}
          generateSummary={generateSummary} sessionSummary={sessionSummary} saveSession={saveSession}
        />}

        {/* HATCHES */}
        {tab==="hatches"&&<HatchesTab
          P={P} spp={spp} FLYMAP={FLYMAP} FLYCONF={FLYCONF} CC={CC} hC={hC}
          rv={rv} cT={cT}
          identifyFly={identifyFly} flyAnalyzing={flyAnalyzing} flyAnalysis={flyAnalysis}
          flyQ={flyQ} setFlyQ={setFlyQ} DOY={DOY}
        />}

        {/* FLY BOX */}
        {(tab==="flies"||tab==="fly")&&<FlyBoxTab
          P={P} FLIES={FLIES} actIds={actIds}
          flyT={flyT} setFlyT={setFlyT} openFly={openFly} setOpenFly={setOpenFly}
          scanFlyBox={scanFlyBox} flyBoxScanning={flyBoxScanning} flyBoxScan={flyBoxScan}
          ex={ex} toggle={toggle}
        />}

        {/* OUTLOOK */}
        {tab==="outlook"&&<div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>8-WEEK FORECAST</div>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
            {lr.map((w,i)=>(
              <div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,display:"flex",alignItems:"center",gap:8}}>
                <div style={{minWidth:68}}><div style={{fontSize:10,fontWeight:600,color:i===0?P.rust:P.tx}}>{w.l}</div></div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <span style={{fontSize:8,color:P.rust,fontWeight:600,minWidth:28}}>Mayfly</span>
                    <div style={{flex:1,height:4,background:P.c2,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${w.ds}%`,background:P.rust,borderRadius:2}}/></div>
                    <span style={{fontSize:9,fontWeight:700,color:P.rust,minWidth:22,textAlign:"right"}}>{w.ds}%</span>
                  </div>
                </div>
                <span style={{fontSize:9,color:P.txD}}>~{w.pt}°C</span>
              </div>
            ))}
          </div>
        </div>}

        {/* LOG */}
        {(tab==="log"||tab==="reports")&&<LogTab
          P={P} sessions={sessions} rv={rv} beat={beat}
          showForm={showForm} setShowForm={setShowForm}
          fDate={fDate} setFDate={setFDate}
          fBeat={fBeat} setFBeat={setFBeat}
          fFish={fFish} setFish={setFish}
          fBig={fBig} setFBig={setFBig}
          fFly={fFly} setFFly={setFFly}
          fNotes={fNotes} setFNotes={setFNotes}
          fRating={fRating} setFRating={setFRating}
          fPhotos={fPhotos} addManualPhotos={addManualPhotos} setFPhotos={setFPhotos}
          saveManualSession={saveManualSession}
          expandedSession={expandedSession} setExpandedSession={setExpandedSession}
          archiveOverview={archiveOverview} archiveLoading={archiveLoading}
          generateArchiveOverview={generateArchiveOverview}
          analyzeArchiveCatch={analyzeArchiveCatch} archiveAnalyzing={archiveAnalyzing}
          rpts={rpts} srcC={srcC} user={user} light={light}
        />}

        {/* TIPS */}
        {tab==="tips"&&<TipsTab
          P={P} SC={SC} scenario={scenario} setScenario={setScenario}
          analyzeRiver={analyzeRiver} riverAnalyzing={riverAnalyzing} riverAnalysis={riverAnalysis}
          startListening={startListening} listening={listening} voiceResult={voiceResult}
          speak={speak} speaking={speaking}
        />}
      </div>

      {/* FEEDBACK MODAL */}
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

      {/* FOOTER */}
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
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:light?"rgba(255,255,255,0.92)":"rgba(22,30,27,0.95)",backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",borderTop:`1px solid ${P.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom, 0px)"}}>
        {[
          {id:"map",l:"Map",ic:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>},
          {id:"guide",l:"Guide",ic:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>},
          {id:"feed",l:"Feed",ic:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>},
          {id:"log",l:"Log",ic:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
          {id:"flies",l:"Flies",ic:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
        ].map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:"none",color:tab===n.id?P.gn:P.txD,cursor:"pointer",fontFamily:"inherit",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:3,position:"relative"}}>
            {tab===n.id&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:20,height:2,background:P.gn,borderRadius:"0 0 2px 2px"}}/>}
            {n.ic}
            <div style={{fontSize:9,fontWeight:tab===n.id?700:400,letterSpacing:"0.03em"}}>{n.l}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
