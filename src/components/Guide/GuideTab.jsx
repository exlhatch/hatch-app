import {DOY,isNight,hC,scClr,futureDayGuide} from "../../lib/scoring.js";
import {FLYMAP} from "../../data/hatches.js";
import SessionReview from "../Session/SessionReview.jsx";

export default function GuideTab({
  P,guideNote,speak,speaking,topH,dan,spp,timeline,
  cT,cC,cW,wxDays,gDay,setGDay,H,rv,beat,method,
  advanced,setAdvanced,onRiver,reviewing,rig,ex,toggle,nowWin,
  sessionSnaps,quickSnap,setGallery,sessionStart,fmtDur,
  recovered,setRecovered,
  /* SessionReview props */
  uploadAfterSession,analyseAll,analysingAll,analyzing,analyzeFish,aiDescribe,
  sessionTrack,showSessionMap,setShowSessionMap,mapsLoaded,updateSnap,
  sessionNotes,setSessionNotes,generateSummary,sessionSummary,saveSession
}){
  return(
    <div>
      {recovered&&(
        <div style={{background:P.gn+"18",borderRadius:8,border:`1px solid ${P.gn}40`,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,fontWeight:700,color:P.gn}}>Session recovered</div><div style={{fontSize:9,color:P.txM,marginTop:2}}>Your session was restored after the app closed. {sessionSnaps.length} snap{sessionSnaps.length!==1?"s":""} saved.</div></div>
          <button onClick={()=>setRecovered(false)} style={{background:"none",border:"none",color:P.txD,fontSize:14,cursor:"pointer"}}>✕</button>
        </div>
      )}

      {/* GUIDE NOTE */}
      <div style={{padding:"14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}>
        <div style={{fontSize:14,color:P.tx,lineHeight:1.7}}>{guideNote}</div>
        <button onClick={()=>speak(guideNote)} style={{marginTop:8,background:"none",border:`1px solid ${speaking?P.gn:P.bd}`,borderRadius:6,padding:"5px 12px",color:speaking?P.gn:P.txD,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{speaking?"Stop":"Listen"}</button>
      </div>

      {/* TIE ON + BEST WINDOW */}
      {!isNight&&(
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <div style={{flex:1,background:P.gn+"18",border:`1px solid ${P.gn}30`,borderRadius:10,padding:"14px"}}>
            <div style={{fontSize:9,color:P.gn,letterSpacing:"0.08em",fontWeight:600}}>TIE ON</div>
            <div style={{fontSize:16,fontWeight:600,color:P.tx,marginTop:4}}>{FLYMAP[topH?.id]||"Adams #16"}</div>
            <div style={{fontSize:11,color:P.gn,marginTop:3}}>{topH?.cm||"Olives"}</div>
          </div>
          <div style={{flex:1,background:P.rust+"18",border:`1px solid ${P.rust}30`,borderRadius:10,padding:"14px"}}>
            <div style={{fontSize:9,color:P.rust,letterSpacing:"0.08em",fontWeight:600}}>BEST TIME TO FISH</div>
            {(()=>{
              const best=timeline.reduce((a,e)=>e.hi>a.hi?e:a,{hi:0,hr:12});
              const bestEnd=timeline.filter(e=>e.hi>=best.hi-1&&e.hr>=best.hr).pop();
              const window=best.hr===bestEnd?.hr?`Around ${best.hr}:00`:`${best.hr}:00 to ${bestEnd?.hr||best.hr+2}:00`;
              const reason=cT>=12&&best.hr>=17?"Evening rise":cC>50&&best.hr>=11&&best.hr<=14?"Midday hatch window":best.hr>=13?"Afternoon hatch":"Late morning";
              return<><div style={{fontSize:16,fontWeight:600,color:P.tx,marginTop:4}}>{window}</div><div style={{fontSize:11,color:P.rust,marginTop:3}}>{reason}</div></>;
            })()}
          </div>
        </div>
      )}

      {/* HATCH OF THE DAY */}
      {!isNight&&topH&&topH.score>5&&(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600}}>HATCH OF THE DAY</div>
              <div style={{fontSize:18,fontWeight:700,color:P.tx,marginTop:4}}>{topH.cm}</div>
              <div style={{fontSize:12,color:P.gn,fontWeight:600,marginTop:2}}>{FLYMAP[topH.id]||"Match the hatch"}</div>
            </div>
            <div style={{fontSize:28,fontWeight:700,color:hC(topH.score)}}>{Math.round(topH.score/10)}<span style={{fontSize:12,color:P.txD}}>/10</span></div>
          </div>
          {spp.filter(s=>s.score>15&&s.id!==topH.id).length>0&&<div style={{marginTop:8,fontSize:11,color:P.txM}}>Also active: {spp.filter(s=>s.score>15&&s.id!==topH.id).slice(0,3).map(s=>s.cm).join(", ")}</div>}
        </div>
      )}

      {/* MAYFLY STRENGTH */}
      {DOY>=135&&DOY<=175&&dan&&dan.score>5&&(
        <div style={{background:"#C36A3D12",borderRadius:10,border:`1px solid #C36A3D30`,padding:"14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:P.rust}}>MAYFLY SEASON</div>
            <div style={{fontSize:9,color:P.txD}}>{DOY<145?"Building":DOY<160?"Peak":DOY<170?"Tailing":"Final days"}</div>
          </div>
          {(()=>{const str=Math.round(Math.min(10,dan.score/10*(cT>=13?1.2:cT>=11?1:0.6)*(cC>50?1.2:cC>30?1:0.7)*(cW<12?1:0.7)));return(
            <div>
              <div style={{display:"flex",gap:2,marginBottom:6}}>{Array.from({length:10}).map((_,i)=><div key={i} style={{flex:1,height:6,borderRadius:3,background:i<str?P.rust:P.bd}}/>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}>
                <span style={{color:P.rust,fontWeight:600}}>Hatch strength: {str}/10</span>
                <span style={{color:P.txD}}>{str>=8?"Exceptional":str>=6?"Strong":str>=4?"Moderate":"Light"}</span>
              </div>
              <div style={{fontSize:10,color:P.txM,marginTop:6,lineHeight:1.6}}>
                {str>=7?"Conditions are ideal. Overcast, warm water, low wind. Expect a memorable hatch from early afternoon with spinner falls into the evening."
                :str>=4?`Decent conditions. ${cT>=13?"Water temp is good.":"Water could be warmer."} ${cC>50?"Cloud cover will help.":"Brighter conditions may push the hatch later."} Duns from 1-2pm, spinners from 7pm.`
                :"Conditions aren't ideal but mayfly still emerge in all weathers. They tend to come off in shorter bursts. Stay ready and watch for the first rise."}
              </div>
            </div>
          )})()}
        </div>
      )}

      {/* HATCH OF THE WEEK */}
      {!isNight&&spp.filter(s=>s.score>10).length>0&&(
        <div onClick={()=>toggle("hotw")} style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10,cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600}}>WHAT'S HATCHING THIS WEEK</div>
            <span style={{color:P.txD,fontSize:11}}>{ex.hotw?"−":"+"}</span>
          </div>
          {ex.hotw&&(
            <div style={{marginTop:8}}>
              {spp.filter(s=>s.score>5).slice(0,6).map(sp=>(
                <div key={sp.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${P.bd}`}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:P.tx}}>{sp.cm}</div><div style={{fontSize:10,color:P.gn,marginTop:1}}>{FLYMAP[sp.id]||""}</div></div>
                  <div style={{fontSize:16,fontWeight:700,color:hC(sp.score)}}>{Math.round(sp.score/10)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 10-DAY FORECAST */}
      {wxDays.length>0&&!onRiver&&!reviewing&&(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
          <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:P.txD,marginBottom:10}}>UPCOMING</div>
          <div style={{display:"flex",gap:3}}>
            {wxDays.map((d,i)=>{
              const futDoy=DOY+i;
              const pjH=H.reduce((s,sp)=>{
                if(futDoy<sp.s-10||futDoy>sp.e+10)return s;
                let sf=0;
                if(sp.e<sp.s?(futDoy>=sp.s||futDoy<=sp.e):(futDoy>=sp.s&&futDoy<=sp.e)){
                  const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;
                  sf=sp.e<sp.s?1:Math.max(0,1-((futDoy-m)/r)**2);
                }
                return s+sf*(sp.t===1?30:sp.t===2?12:5);
              },0);
              let sc=0;
              sc+=Math.min(30,pjH*0.30);
              const avg=((d.aH||14)+(d.aL||8))/2;
              sc+=avg>=13?15:avg>=10?10:5;
              sc+=(d.rain||0)<2?7:4;
              sc+=(d.windMax||8)<=10?15:(d.windMax||8)<=18?7:2;
              sc+=7+Math.round((rv.q||5)*1.5);
              sc=Math.round(Math.min(100,sc));
              const s10=Math.round(sc/10);
              return(
                <div key={i} onClick={()=>setGDay(gDay===i?-1:i)} style={{flex:1,textAlign:"center",padding:"8px 2px",background:gDay===i?P.gn+"18":i===0?P.gn+"08":"transparent",borderRadius:6,cursor:"pointer"}}>
                  <div style={{fontSize:9,fontWeight:600,color:i===0?P.gn:P.txM}}>{d.dn}</div>
                  <div style={{fontSize:18,fontWeight:700,color:scClr(sc),marginTop:3}}>{s10}</div>
                  <div style={{fontSize:8,color:P.txD,marginTop:1}}>{d.aH||"--"}°</div>
                  {(d.rain||0)>0&&<div style={{fontSize:7,color:P.rust}}>rain</div>}
                </div>
              );
            })}
          </div>

          {gDay>=0&&wxDays[gDay]&&(()=>{
            const fg=futureDayGuide(H,FLYMAP,wxDays[gDay],gDay,cT,rv,beat,method);
            if(!fg)return null;
            return(
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${P.bd}`}}>
                <div style={{fontSize:15,fontWeight:700,color:P.tx,marginBottom:2}}>{wxDays[gDay].df}</div>
                <div style={{fontSize:11,color:P.txM,marginBottom:10}}>{wxDays[gDay].aH||"--"}°/{wxDays[gDay].aL||"--"}° · {fg.avgWind}mph · {fg.avgCloud>70?"Overcast":fg.avgCloud>40?"Cloudy":"Clear"}</div>

                {fg.topH&&fg.topH.score>5&&(
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:P.gn+"12",borderRadius:8,marginBottom:8}}>
                    <div><div style={{fontSize:16,fontWeight:700,color:P.tx}}>{fg.topH.cm}</div><div style={{fontSize:12,color:P.gn,fontWeight:600,marginTop:2}}>{FLYMAP[fg.topH.id]||"Match the hatch"}</div></div>
                    <div style={{fontSize:24,fontWeight:700,color:hC(fg.topH.score)}}>{Math.round(fg.topH.score/10)}</div>
                  </div>
                )}

                <div style={{padding:"10px 12px",background:P.c2,borderRadius:8,marginBottom:8}}>
                  <div style={{fontSize:14,fontWeight:600,color:P.tx}}>{fg.rig.a}</div>
                  <div style={{fontSize:11,color:P.txM,marginTop:2}}>{fg.rig.fly}</div>
                </div>

                <div style={{fontSize:9,fontWeight:600,color:P.txD,letterSpacing:"0.08em",marginBottom:4}}>FLIES TO HAVE READY</div>
                {fg.futSpp.filter(s=>s.score>15).slice(0,4).map(sp=>(
                  <div key={sp.id} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11}}>
                    <span style={{color:P.tx}}>{sp.cm}</span>
                    <span style={{color:P.gn,fontWeight:600}}>{FLYMAP[sp.id]||""}</span>
                  </div>
                ))}

                {advanced&&(
                  <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${P.bd}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:8}}>
                      {[{l:"Rod",v:fg.rig.rod},{l:"Leader",v:fg.rig.ldr},{l:"Tippet",v:fg.rig.tip},{l:"Fly",v:fg.rig.fly}].map((r,ri)=>(
                        <div key={ri} style={{padding:"5px 8px",background:P.c1,borderRadius:4}}>
                          <div style={{fontSize:7,color:P.txD}}>{r.l.toUpperCase()}</div>
                          <div style={{fontSize:10,fontWeight:600,color:ri===3?P.gn:P.tx,marginTop:1}}>{r.v}</div>
                        </div>
                      ))}
                    </div>
                    {fg.antic.length>0&&<div style={{marginBottom:6}}>{fg.antic.map((n,ni)=><div key={ni} style={{fontSize:10,color:P.txM,lineHeight:1.6}}>{n}</div>)}</div>}
                    <div style={{fontSize:9,fontWeight:600,color:P.txD,letterSpacing:"0.08em",marginBottom:4}}>HOURLY TIMELINE</div>
                    {fg.tl.map((e,ti)=>(
                      <div key={ti} style={{display:"flex",gap:8,padding:"3px 0",borderBottom:ti<fg.tl.length-1?`1px solid ${P.bd}`:""}}>
                        <span style={{fontSize:10,fontWeight:700,color:e.hi>=3?P.gn:e.hi>=1?P.rust:P.txD,minWidth:28}}>{e.hr}:00</span>
                        <span style={{fontSize:10,color:P.txM,flex:1}}>{e.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ADVANCED TOGGLE */}
      {!onRiver&&!reviewing&&(
        <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
          <button onClick={()=>setAdvanced(!advanced)} style={{background:"none",border:`1px solid ${P.bd}`,borderRadius:6,padding:"6px 16px",color:advanced?P.gn:P.txD,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{advanced?"Simple mode":"Advanced"}</button>
        </div>
      )}

      {/* ADVANCED: approach + river info */}
      {advanced&&!onRiver&&!reviewing&&(
        <>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"14px",marginBottom:10}}>
            <div style={{fontSize:9,color:P.txD,letterSpacing:"0.1em",fontWeight:600,marginBottom:4}}>APPROACH</div>
            <div style={{fontSize:15,fontWeight:700,color:P.tx}}>{rig.a}</div>
            <div style={{fontSize:11,color:P.txM,marginTop:2,fontStyle:"italic"}}>{rig.why}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:8}}>
              {[{l:"Rod",v:rig.rod},{l:"Leader",v:rig.ldr},{l:"Tippet",v:rig.tip},{l:"Fly",v:rig.fly}].map((r,ri)=>(
                <div key={ri} style={{padding:"5px 8px",background:P.c2,borderRadius:4}}>
                  <div style={{fontSize:7,color:P.txD}}>{r.l.toUpperCase()}</div>
                  <div style={{fontSize:10,fontWeight:600,color:ri===3?P.gn:P.tx,marginTop:1}}>{r.v}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop:6,padding:"5px 8px",background:P.c2,borderRadius:4}}>
              <div style={{fontSize:7,color:P.txD}}>GUIDE TIP</div>
              <div style={{fontSize:10,color:P.txM,marginTop:1,lineHeight:1.6}}>{rig.guide}</div>
            </div>
          </div>
          <div style={{padding:"10px 14px",background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,marginBottom:10}}>
            <div style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",color:P.txD,marginBottom:4}}>{rv.n.toUpperCase()}</div>
            <div style={{fontSize:11,color:P.txM,lineHeight:1.7,fontStyle:"italic"}}>{rv.p}</div>
          </div>
        </>
      )}

      {/* SESSION ACTIVE */}
      {onRiver&&(
        <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.gn}}>SESSION ACTIVE — {beat}</div>
            <div style={{fontSize:9,color:P.txD}}>{new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:P.tx,lineHeight:1.5}}>
            {isNight?"Night time. Rest up for tomorrow."
            :cC>60&&cT>=12?"Cloud thickening — hatches should build. Stay on dries."
            :cC<30&&cT>=14?"Bright conditions. Fish the shade. Consider emergers in the film."
            :cW>14?"Wind making presentation tough. Try the sheltered bank."
            :cT<10?"Cool water. Keep nymphing. Watch for olive activity after 11am."
            :nowWin&&nowWin.cur&&nowWin.cur.hi>=4?"Hatch building now. Watch for rises and match the size."
            :"Conditions stable. Work upstream, cover water methodically."}
          </div>
          {nowWin&&nowWin.nxt&&!isNight&&<div style={{fontSize:10,color:P.gn,marginTop:6}}>Next: {nowWin.nxt.hr}:00 — {nowWin.nxt.note}</div>}

          {sessionSnaps.length>0&&(
            <div style={{marginTop:10,display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
              {sessionSnaps.map(s=>(
                <div key={s.id} style={{flexShrink:0,textAlign:"center"}} onClick={()=>{
                  if(!s.photo)return;
                  const items=sessionSnaps.filter(sn=>sn.photo).map(sn=>({src:`data:image/jpeg;base64,${sn.photo}`,type:"image",caption:sn.timestamp}));
                  const idx=sessionSnaps.filter(sn=>sn.photo).findIndex(sn=>sn.id===s.id);
                  if(idx>=0)setGallery({items,idx});
                }}>
                  {!s.photo
                    ?<div style={{width:48,height:48,borderRadius:6,background:P.c2,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${P.bd}`,fontSize:10,color:P.txD}}>?</div>
                    :<img src={`data:image/jpeg;base64,${s.photo}`} alt="" style={{width:48,height:48,borderRadius:6,objectFit:"cover",border:`2px solid ${P.gn}`}}/>
                  }
                  <div style={{fontSize:7,color:P.txD,marginTop:2}}>{s.timestamp}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{marginTop:8,textAlign:"center"}}>
            <button onClick={quickSnap} style={{background:P.gn,border:"none",borderRadius:8,padding:"10px 24px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📷 Quick Snap</button>
            <div style={{fontSize:8,color:P.txD,marginTop:4}}>Take photo, log details later</div>
          </div>
        </div>
      )}

      {/* SESSION REVIEW */}
      {reviewing&&(
        <SessionReview
          P={P} rv={rv} beat={beat} sessionStart={sessionStart} fmtDur={fmtDur}
          sessionSnaps={sessionSnaps} uploadAfterSession={uploadAfterSession} quickSnap={quickSnap}
          analyseAll={analyseAll} analysingAll={analysingAll} analyzing={analyzing}
          analyzeFish={analyzeFish} aiDescribe={aiDescribe}
          sessionTrack={sessionTrack} showSessionMap={showSessionMap} setShowSessionMap={setShowSessionMap}
          mapsLoaded={mapsLoaded} setGallery={setGallery} updateSnap={updateSnap}
          sessionNotes={sessionNotes} setSessionNotes={setSessionNotes}
          generateSummary={generateSummary} sessionSummary={sessionSummary} saveSession={saveSession}
        />
      )}
    </div>
  );
}
