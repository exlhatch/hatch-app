export default function LogTab({P,sessions,rv,beat,showForm,setShowForm,fDate,setFDate,fBeat,setFBeat,fFish,setFish,fBig,setFBig,fFly,setFFly,fNotes,setFNotes,fRating,setFRating,fPhotos,addManualPhotos,setFPhotos,saveManualSession,expandedSession,setExpandedSession,archiveOverview,archiveLoading,generateArchiveOverview,analyzeArchiveCatch,archiveAnalyzing,rpts,srcC,user,light}){
  const totalFish=sessions.reduce((s,sess)=>s+(sess.fish||0),0);
  const pb=sessions.reduce((best,sess)=>{const w=parseFloat(sess.big)||0;return w>best?w:best},0);
  const rivers={};const beats={};const flies={};
  sessions.forEach(s=>{rivers[s.river]=(rivers[s.river]||0)+(s.fish||0);if(s.beat||s.bt)beats[s.beat||s.bt]=(beats[s.beat||s.bt]||0)+(s.fish||0);if(s.fly)flies[s.fly]=(flies[s.fly]||0)+1});
  const favRiver=Object.entries(rivers).sort((a,b)=>b[1]-a[1])[0];
  const favBeat=Object.entries(beats).sort((a,b)=>b[1]-a[1])[0];
  const favFly=Object.entries(flies).sort((a,b)=>b[1]-a[1])[0];

  return(
    <div>
      {/* SEASON STATS */}
      {sessions.length>0&&(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:14,marginBottom:14}}>
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
        </div>
      )}

      {/* LOG BUTTON */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD}}>LOG A SESSION</div>
        <button onClick={()=>{setShowForm(!showForm);setFPhotos([])}} style={{background:P.rust,border:"none",borderRadius:6,padding:"6px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{showForm?"CANCEL":"+ LOG"}</button>
      </div>

      {/* MANUAL LOG FORM */}
      {showForm&&(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:14,marginBottom:14}}>
          <div style={{display:"grid",gap:8}}>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>DATE</div><input type="date" value={fDate} onChange={e=>setFDate(e.target.value)} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%",colorScheme:light?"light":"dark"}}/></div>
            {rv.b&&rv.b.length>0&&(
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEAT</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{rv.b.map(b=><button key={b} onClick={()=>setFBeat(b)} style={{padding:"4px 8px",borderRadius:4,border:fBeat===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fBeat===b?P.rustS:"transparent",color:fBeat===b?P.rust:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>)}</div></div>
            )}
            <div>
              <div style={{fontSize:8,color:P.txD,marginBottom:4}}>PHOTOS</div>
              <button onClick={addManualPhotos} style={{width:"100%",padding:"10px",borderRadius:6,border:`1px dashed ${P.bd}`,background:"transparent",color:P.txM,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>📷 Add Photos from Camera Roll</button>
              {fPhotos.length>0&&(
                <div style={{display:"flex",gap:6,marginTop:8,overflowX:"auto",paddingBottom:4}}>
                  {fPhotos.map((p,i)=>(
                    <div key={i} style={{position:"relative",flexShrink:0}}>
                      <img src={`data:image/jpeg;base64,${p.b64}`} alt="" style={{width:56,height:56,borderRadius:6,objectFit:"cover"}}/>
                      {p.time&&<div style={{fontSize:7,color:P.txD,textAlign:"center",marginTop:2}}>{p.time}</div>}
                      <button onClick={()=>setFPhotos(fp=>fp.filter((_,j)=>j!==i))} style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:8,background:P.rust,border:"none",color:"#fff",fontSize:9,cursor:"pointer",lineHeight:"16px",padding:0}}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>CAUGHT</div><input value={fFish} onChange={e=>setFish(e.target.value)} placeholder="0" type="number" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
              <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BIGGEST</div><input value={fBig} onChange={e=>setFBig(e.target.value)} placeholder="2.5lb" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
            </div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>BEST FLY</div><input value={fFly} onChange={e=>setFFly(e.target.value)} placeholder="CDC #16" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%"}}/></div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>RATING</div><div style={{display:"flex",gap:4}}>{["Poor","Fair","Good","Excellent"].map(r=><button key={r} onClick={()=>setFRating(r)} style={{flex:1,padding:"7px",borderRadius:5,border:fRating===r?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:fRating===r?P.rustS:"transparent",color:fRating===r?P.rust:P.txD,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{r}</button>)}</div></div>
            <div><div style={{fontSize:8,color:P.txD,marginBottom:4}}>NOTES</div><textarea value={fNotes} onChange={e=>setFNotes(e.target.value)} placeholder="What happened?" rows={3} style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:6,padding:"8px 10px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.5}}/></div>
            <button onClick={saveManualSession} style={{width:"100%",padding:"12px",borderRadius:8,border:"none",background:P.rust,color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>SAVE SESSION</button>
          </div>
        </div>
      )}

      {/* SESSION ARCHIVE */}
      {sessions.length>0&&(
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD}}>YOUR SESSIONS ({sessions.length})</div>
            <button onClick={generateArchiveOverview} disabled={archiveLoading} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${P.gn}`,background:"transparent",color:P.gn,fontSize:8,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{archiveLoading?"Analysing...":"✨ AI Overview"}</button>
          </div>
          {archiveOverview&&(
            <div style={{padding:"10px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
              <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI SEASON OVERVIEW</div>
              <div style={{fontSize:11,color:P.tx,lineHeight:1.7,fontStyle:"italic"}}>{archiveOverview}</div>
            </div>
          )}
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
            {sessions.slice(0,20).map((s,i)=>(
              <div key={s.id||i}>
                <div onClick={()=>setExpandedSession(expandedSession===(s.id||i)?null:(s.id||i))} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,cursor:"pointer"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:11,fontWeight:600}}>{s.river} — {s.beat||s.bt}</span>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      {s.rating&&<span style={{fontSize:7,fontWeight:700,padding:"1px 5px",borderRadius:3,color:(s.rating==="Excellent"||s.rating==="Good")?P.gn:P.rust,background:((s.rating==="Excellent"||s.rating==="Good")?P.gn:P.rust)+"18"}}>{s.rating.toUpperCase()}</span>}
                      <span style={{fontSize:10,fontWeight:700,color:s.fish>=3?P.gn:s.fish>0?P.rust:P.txD}}>{s.fish||0}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,fontSize:9,color:P.txD,alignItems:"center"}}>
                    <span>{s.d}</span>
                    {s.dur&&s.dur!=="Manual"&&<span>{s.dur}</span>}
                    {(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).length>0&&<span>📷 {(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).length}</span>}
                    {(s.photos||[]).length>0&&!(s.catches||[]).some(c=>c.photo&&c.photo.length>200)&&<span>📷 {s.photos.length}</span>}
                    {s.score&&<span>Score: {s.score}</span>}
                    <span style={{marginLeft:"auto"}}>{expandedSession===(s.id||i)?"−":"+"}</span>
                  </div>
                </div>
                {expandedSession===(s.id||i)&&(
                  <div style={{padding:"10px 12px",background:P.c2,borderBottom:`1px solid ${P.bd}`}}>
                    {s.time&&<div style={{fontSize:9,color:P.txD,marginBottom:4}}>Started {s.time} · {s.user}</div>}
                    {s.rating&&<div style={{display:"inline-block",padding:"3px 10px",borderRadius:4,background:s.rating==="Excellent"?P.gn+"20":s.rating==="Good"?P.gn+"15":s.rating==="Fair"?P.rust+"20":P.txD+"20",marginBottom:6}}><span style={{fontSize:10,fontWeight:700,color:(s.rating==="Excellent"||s.rating==="Good")?P.gn:s.rating==="Fair"?P.rust:P.txD}}>{s.rating}</span></div>}
                    {(()=>{const photos=(s.catches||[]).filter(c=>c.photo&&c.photo.length>200).concat((s.photos||[]).filter(p=>p.b64));if(!photos.length)return null;return(
                      <div style={{marginBottom:8}}>
                        <div style={{fontSize:8,color:P.txD,marginBottom:4}}>PHOTOS ({photos.length})</div>
                        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4}}>
                          {photos.map((p,pi)=><div key={pi} style={{flexShrink:0,textAlign:"center"}}>
                            <img src={`data:image/jpeg;base64,${p.photo||p.b64}`} alt="" style={{width:80,height:80,borderRadius:8,objectFit:"cover",border:`2px solid ${P.bd}`}}/>
                            <div style={{fontSize:7,color:P.txD,marginTop:2}}>{p.timestamp||p.time||""}</div>
                          </div>)}
                        </div>
                      </div>
                    )})()}
                    {s.catches&&s.catches.length>0&&(
                      <div style={{marginTop:4}}>
                        <div style={{fontSize:8,color:P.txD,marginBottom:3}}>CATCHES</div>
                        {s.catches.map((c,ci)=>(
                          <div key={ci} style={{padding:"6px 0",borderBottom:ci<s.catches.length-1?`1px solid ${P.bd}`:""}}>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              {c.photo&&c.photo.length>200&&<img src={`data:image/jpeg;base64,${c.photo}`} alt="" style={{width:48,height:48,borderRadius:6,objectFit:"cover",flexShrink:0}}/>}
                              <div style={{flex:1}}>
                                <div style={{fontSize:10,color:P.tx,fontWeight:500}}>{c.species||"Unknown"}{c.weight?` — ${c.weight}lb`:""}{c.wild?` (${c.wild})`:""}</div>
                                <div style={{fontSize:8,color:P.txD}}>{c.timestamp}{c.fly?` on ${c.fly}`:""}{c.notes?` — ${c.notes}`:""}</div>
                              </div>
                            </div>
                            {c.analysis&&!c.analysis.error&&!c.analysis.unusable&&<div style={{marginTop:4,padding:"5px 8px",background:P.bg,borderRadius:4,border:`1px solid ${P.bd}`}}><div style={{fontSize:7,fontWeight:700,color:P.gn,letterSpacing:"0.1em"}}>AI ID</div><div style={{fontSize:9,color:P.tx}}>{c.analysis.species} — {c.analysis.species_confidence} · {c.analysis.wild_stocked}</div>{c.analysis.weight_range&&<div style={{fontSize:8,color:P.txM}}>Est. {c.analysis.weight_range} · {c.analysis.condition}</div>}</div>}
                            {c.analysis&&c.analysis.unusable&&<div style={{fontSize:8,color:P.rust,marginTop:2}}>Photo too unclear for AI identification</div>}
                            {c.photo&&c.photo.length>200&&<button onClick={()=>analyzeArchiveCatch(s.id,ci)} disabled={archiveAnalyzing===`${s.id}-${ci}`} style={{marginTop:4,padding:"3px 8px",borderRadius:4,border:`1px solid ${archiveAnalyzing===`${s.id}-${ci}`?P.bd:P.gn}`,background:"transparent",color:archiveAnalyzing===`${s.id}-${ci}`?P.txD:P.gn,fontSize:8,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{archiveAnalyzing===`${s.id}-${ci}`?"Analysing...":c.analysis?"Re-analyse":"🐟 AI Identify"}</button>}
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:6,marginBottom:4}}>
                      {s.fly&&<div style={{fontSize:10,color:P.gn}}>Fly: {s.fly}</div>}
                      {s.big&&<div style={{fontSize:10,color:P.txM}}>Biggest: {s.big}</div>}
                      {s.topHatch&&<div style={{fontSize:10,color:P.txM}}>Hatch: {s.topHatch}</div>}
                      {s.dur&&<div style={{fontSize:10,color:P.txM}}>Duration: {s.dur}</div>}
                    </div>
                    {s.notes&&<div style={{fontSize:10,color:P.txM,lineHeight:1.5,marginBottom:4}}>{s.notes}</div>}
                    {s.summary&&<div style={{padding:"6px 8px",background:P.bg,borderRadius:5,border:`1px solid ${P.bd}`,marginTop:4}}><div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:2}}>AI SUMMARY</div><div style={{fontSize:10,color:P.tx,lineHeight:1.6,fontStyle:"italic"}}>{s.summary}</div></div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RIVER REPORTS */}
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>RIVER REPORTS</div>
      {rpts.length>0?(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
          {rpts.map((r,i)=>(
            <div key={i} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`}}>
              <div style={{display:"flex",gap:4,alignItems:"center",marginBottom:3}}>
                <span style={{fontSize:7,fontWeight:700,color:srcC[r.src]||P.txM,border:`1px solid ${(srcC[r.src]||P.txM)}33`,padding:"1px 5px",borderRadius:3}}>{r.src.toUpperCase()}</span>
                <span style={{fontSize:11,fontWeight:600}}>{r.bt}</span>
                <span style={{fontSize:9,color:P.txD}}>{r.d}</span>
                {r.v&&<span style={{marginLeft:"auto",fontSize:7,color:P.gn,fontWeight:600}}>✓ verified</span>}
              </div>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.6}}>{r.tx}</div>
            </div>
          ))}
        </div>
      ):(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:20,textAlign:"center",color:P.txM,fontSize:12}}>No reports yet for this river.</div>
      )}
    </div>
  );
}
