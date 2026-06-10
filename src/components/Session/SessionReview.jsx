export default function SessionReview({P,rv,beat,sessionStart,fmtDur,sessionSnaps,uploadAfterSession,quickSnap,analyseAll,analysingAll,analyzing,analyzeFish,aiDescribe,sessionTrack,showSessionMap,setShowSessionMap,mapsLoaded,setGallery,updateSnap,sessionNotes,setSessionNotes,generateSummary,sessionSummary,saveSession}){
  return(
    <div style={{background:P.c1,borderRadius:12,border:`1px solid ${P.bd}`,padding:14,marginBottom:12}}>
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust,marginBottom:4}}>SESSION REVIEW</div>
      <div style={{fontSize:11,color:P.txM,lineHeight:1.6,marginBottom:10}}>{rv.n} / {beat} — {sessionStart?new Date(sessionStart).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"}):""} — {sessionStart?fmtDur(Date.now()-sessionStart):""}</div>

      <div style={{display:"flex",gap:6,marginBottom:12}}>
        <button onClick={uploadAfterSession} style={{flex:1,padding:"10px",borderRadius:8,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📁 Add Photos & Video</button>
        <button onClick={quickSnap} style={{padding:"10px 14px",borderRadius:8,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📷</button>
      </div>
      <div style={{fontSize:8,color:P.txD,marginBottom:10,lineHeight:1.5}}>Upload photos from today — timestamps are read from the image data so catches appear in the order you took them.</div>

      {sessionSnaps.filter(s=>s.photo&&!s.analysis).length>0&&(
        <button onClick={analyseAll} disabled={analysingAll} style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${P.gn}`,background:analysingAll?P.c2:"transparent",color:analysingAll?P.txD:P.gn,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>
          {analysingAll?`Analysing... (${sessionSnaps.filter(s=>s.analysis).length}/${sessionSnaps.length})`:`🐟 AI Analyse All Photos (${sessionSnaps.filter(s=>s.photo&&!s.analysis).length})`}
        </button>
      )}

      {sessionTrack.length>0&&(
        <div style={{marginBottom:10}}>
          <div onClick={()=>setShowSessionMap(!showSessionMap)} style={{background:P.c2,borderRadius:showSessionMap?"8px 8px 0 0":8,border:`1px solid ${P.bd}`,padding:"10px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:8,fontWeight:700,letterSpacing:"0.12em",color:P.gn}}>CATCH LOCATIONS</div><div style={{fontSize:9,color:P.txM,marginTop:2}}>{sessionTrack.filter(t=>t.label&&t.label.startsWith("Catch")).length} catch{sessionTrack.filter(t=>t.label&&t.label.startsWith("Catch")).length!==1?"es":""} geotagged</div></div>
            <span style={{color:P.txD,fontSize:11}}>{showSessionMap?"−":"+"}</span>
          </div>
          {showSessionMap&&(
            <div style={{background:P.c2,borderRadius:"0 0 8px 8px",border:`1px solid ${P.bd}`,borderTop:"none",overflow:"hidden"}}>
              <div style={{height:220,width:"100%"}} ref={el=>{
                if(!el||el.dataset.init||!mapsLoaded||!window.google||!sessionTrack.length)return;
                el.dataset.init="1";
                const map=new window.google.maps.Map(el,{center:{lat:sessionTrack[0].lat,lng:sessionTrack[0].lng},zoom:15,disableDefaultUI:true,zoomControl:true,styles:[{featureType:"water",stylers:[{color:"#c8d7d4"}]},{featureType:"landscape",stylers:[{color:"#e8e4dc"}]},{featureType:"road",stylers:[{visibility:"simplified"}]},{featureType:"poi",stylers:[{visibility:"off"}]}]});
                const bounds=new window.google.maps.LatLngBounds();
                sessionTrack.forEach(p=>{
                  const pos={lat:p.lat,lng:p.lng};bounds.extend(pos);
                  const isCatch=p.label&&p.label.startsWith("Catch");
                  const isStart=p.label==="Start";
                  new window.google.maps.Marker({position:pos,map,
                    label:isCatch?{text:p.label.replace("Catch ",""),color:"#fff",fontSize:"9px",fontWeight:"700"}:undefined,
                    icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:isCatch?10:6,fillColor:isCatch?"#C36A3D":isStart?"#7A9E7E":"#5F6F7B",fillOpacity:1,strokeColor:"#fff",strokeWeight:2},
                    title:`${p.label} — ${p.time}`});
                });
                if(sessionTrack.length>1)map.fitBounds(bounds,{padding:30});
              }}/>
            </div>
          )}
        </div>
      )}

      {sessionSnaps.length===0&&(
        <div style={{textAlign:"center",padding:16,color:P.txD}}>
          <div style={{fontSize:13,fontWeight:600}}>No photos yet</div>
          <div style={{fontSize:10,marginTop:4,lineHeight:1.6}}>Upload photos from your camera roll above — EXIF timestamps will order them chronologically. Or add notes and save a blank session.</div>
        </div>
      )}

      {sessionSnaps.map((snap,idx)=>(
        <div key={snap.id} style={{background:P.c2,borderRadius:10,border:`1px solid ${P.bd}`,padding:12,marginBottom:8}}>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            {!snap.photo
              ?<div style={{width:72,height:72,borderRadius:8,background:P.c1,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${P.bd}`}}><span style={{fontSize:10,color:P.txD}}>No photo</span></div>
              :<img src={`data:image/jpeg;base64,${snap.photo}`} alt="" onClick={()=>{const items=sessionSnaps.filter(s=>s.photo).map((s,i)=>({src:`data:image/jpeg;base64,${s.photo}`,type:"image",caption:`Catch ${i+1} — ${s.timestamp}`}));const i=sessionSnaps.filter(s=>s.photo).findIndex(s=>s.id===snap.id);if(i>=0)setGallery({items,idx:i})}} style={{width:72,height:72,borderRadius:8,objectFit:"cover",flexShrink:0,cursor:"pointer"}}/>
            }
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:11,fontWeight:700,color:P.tx}}>Catch {idx+1}</span><span style={{fontSize:9,color:P.txD}}>{snap.dateLabel?snap.dateLabel+" ":""}{snap.timestamp}{snap.exifDate?"":" ⏎"}</span></div>

              {snap.analysis&&!snap.analysis.error&&!snap.analysis.unusable&&!snap.aiCaption&&(
                <div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`}}>
                  <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI IDENTIFICATION</div>
                  <div style={{fontSize:10,fontWeight:600,color:P.tx}}>{snap.analysis.species} — {snap.analysis.species_confidence} confidence</div>
                  <div style={{fontSize:9,color:P.txM}}>{snap.analysis.wild_stocked}: {snap.analysis.wild_notes}</div>
                  {snap.analysis.weight_range&&<div style={{fontSize:9,color:P.txM}}>Est. {snap.analysis.weight_range}</div>}
                  {snap.analysis.condition&&<div style={{fontSize:9,color:P.txM}}>Condition: {snap.analysis.condition}</div>}
                </div>
              )}
              {snap.aiCaption&&(
                <div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`}}>
                  <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI DESCRIPTION</div>
                  <div style={{fontSize:10,color:P.tx,lineHeight:1.5}}>{snap.aiCaption}</div>
                  {snap.analysis?.transcription&&<div style={{marginTop:4,padding:"4px 6px",background:P.c2,borderRadius:3,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,color:P.txD}}>TRANSCRIPTION</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.5,fontStyle:"italic"}}>{snap.analysis.transcription}</div></div>}
                </div>
              )}
              {snap.analysis&&snap.analysis.unusable&&(
                <div style={{marginTop:4,padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.rust}40`}}>
                  <div style={{fontSize:8,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div>
                  <div style={{fontSize:9,color:P.txM}}>{snap.analysis.quality_note||"Image too blurry or unclear."}</div>
                </div>
              )}
              {snap.analysis&&snap.analysis.quality==="poor"&&!snap.analysis.unusable&&<div style={{fontSize:8,color:P.rust,marginTop:2}}>⚠ {snap.analysis.quality_note}</div>}
              {snap.analysis&&snap.analysis.error&&<div style={{fontSize:9,color:P.rust,marginTop:4}}>Analysis failed — fill in manually</div>}

              {snap.photo&&(
                <div style={{display:"flex",gap:4,marginTop:6}}>
                  <button onClick={()=>analyzeFish(snap.id)} disabled={analyzing===snap.id} style={{padding:"5px 8px",borderRadius:5,border:`1px solid ${analyzing===snap.id?P.bd:P.gn}`,background:"transparent",color:analyzing===snap.id?P.txD:P.gn,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{analyzing===snap.id?"...":snap.analysis&&!snap.aiCaption?"Re-ID":"🐟 Fish"}</button>
                  <button onClick={()=>aiDescribe(snap.id)} disabled={analyzing===snap.id} style={{padding:"5px 8px",borderRadius:5,border:`1px solid ${analyzing===snap.id?P.bd:P.rust}`,background:"transparent",color:analyzing===snap.id?P.txD:P.rust,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{snap.aiCaption?"Re-describe":"📝 Describe"}</button>
                </div>
              )}
            </div>
          </div>

          <div style={{display:"grid",gap:6}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>SPECIES</div><div style={{display:"flex",gap:2,flexWrap:"wrap"}}>{["Trout","Grayling","Sea Trout","Salmon","Other"].map(t=><button key={t} onClick={()=>updateSnap(snap.id,"species",t)} style={{padding:"3px 6px",borderRadius:3,border:snap.species===t?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:snap.species===t?P.gn+"18":"transparent",color:snap.species===t?P.gn:P.txD,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>)}</div></div>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>WILD / STOCKED</div><div style={{display:"flex",gap:2}}>{["Wild","Stocked","Unsure"].map(w=><button key={w} onClick={()=>updateSnap(snap.id,"wild",w)} style={{padding:"3px 6px",borderRadius:3,border:snap.wild===w?`1px solid ${P.gn}`:`1px solid ${P.bd}`,background:snap.wild===w?P.gn+"18":"transparent",color:snap.wild===w?P.gn:P.txD,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{w}</button>)}</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>WEIGHT (LB)</div><input value={snap.weight} onChange={e=>updateSnap(snap.id,"weight",e.target.value)} placeholder="e.g. 2.5" type="number" step="0.25" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
              <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>FLY</div><input value={snap.fly} onChange={e=>updateSnap(snap.id,"fly",e.target.value)} placeholder="CDC #16" style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
            </div>
            <div><div style={{fontSize:7,color:P.txD,marginBottom:2}}>NOTES</div><input value={snap.notes} onChange={e=>updateSnap(snap.id,"notes",e.target.value)} placeholder="Rising steadily, took first cast..." style={{background:P.c1,border:`1px solid ${P.bd}`,borderRadius:4,padding:"5px 7px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%"}}/></div>
          </div>
        </div>
      ))}

      <div style={{marginTop:6}}><div style={{fontSize:8,color:P.txD,marginBottom:4}}>SESSION NOTES</div><textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="How was the day? Conditions, highlights, lessons..." rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:11,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>

      {sessionSnaps.length>0&&<button onClick={generateSummary} style={{width:"100%",marginTop:8,padding:"8px",borderRadius:6,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{sessionSummary?"Regenerate AI Summary":"Generate AI Summary"}</button>}
      {sessionSummary&&(
        <div style={{marginTop:8,padding:"10px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
          <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI SESSION SUMMARY</div>
          <div style={{fontSize:11,color:P.tx,lineHeight:1.7,fontStyle:"italic"}}>{sessionSummary}</div>
        </div>
      )}

      <button onClick={saveSession} style={{width:"100%",marginTop:10,padding:"12px",borderRadius:8,border:"none",background:P.gn,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SAVE SESSION</button>
    </div>
  );
}
