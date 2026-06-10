export default function HatchesTab({P,spp,FLYMAP,FLYCONF,CC,hC,rv,cT,identifyFly,flyAnalyzing,flyAnalysis,flyQ,setFlyQ,DOY}){
  return(
    <div>
      {/* FLY IDENTIFICATION */}
      <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>FLY IDENTIFICATION</div>
            <div style={{fontSize:10,color:P.txM,marginTop:2}}>Photo or describe what you see</div>
          </div>
          <div style={{display:"flex",gap:4}}>
            <button onClick={()=>identifyFly(false)} disabled={flyAnalyzing} style={{background:"transparent",border:`1px solid ${P.rust}`,borderRadius:6,padding:"8px 10px",color:P.rust,fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyAnalyzing?"...":"🔍 Describe"}</button>
            <button onClick={()=>identifyFly(true)} disabled={flyAnalyzing} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 10px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyAnalyzing?"Analysing...":"📷 Photo"}</button>
          </div>
        </div>
        <div style={{marginTop:8,display:"grid",gap:6}}>
          <div>
            <div style={{fontSize:7,color:P.txD,marginBottom:3}}>SIZE (MM)</div>
            <div style={{display:"flex",gap:3}}>
              {["<5mm","5-8mm","8-12mm","12-18mm","18-25mm"].map(s=>(
                <button key={s} onClick={()=>setFlyQ(q=>({...q,size:q.size===s?"":s}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.size===s?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.size===s?P.rustS:"transparent",color:flyQ.size===s?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:P.txD,marginBottom:3}}>COLOUR</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {["Dark olive","Pale olive","Brown","Black","Grey","Cream","Yellow","Ginger"].map(c=>(
                <button key={c} onClick={()=>setFlyQ(q=>({...q,colour:q.colour===c?"":c}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.colour===c?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.colour===c?P.rustS:"transparent",color:flyQ.colour===c?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{fontSize:7,color:P.txD,marginBottom:3}}>BEHAVIOUR</div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {["Sitting in film","Skittering on surface","Drifting upright","Flat on surface","Skating across","Flying low","In a swarm","Crawling on rocks"].map(b=>(
                <button key={b} onClick={()=>setFlyQ(q=>({...q,behaviour:q.behaviour===b?"":b}))} style={{padding:"3px 6px",borderRadius:3,border:flyQ.behaviour===b?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyQ.behaviour===b?P.rustS:"transparent",color:flyQ.behaviour===b?P.rust:P.txD,fontSize:8,cursor:"pointer",fontFamily:"inherit"}}>{b}</button>
              ))}
            </div>
          </div>
        </div>
        {flyAnalysis&&!flyAnalysis.error&&(
          <div style={{marginTop:10,padding:"10px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
            {flyAnalysis.quality==="unusable"?<div><div style={{fontSize:9,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div><div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyAnalysis.quality_note}</div></div>:<>
              <div style={{fontSize:13,fontWeight:700,color:P.tx}}>{flyAnalysis.likely_species||flyAnalysis.common_group||"Unknown"}</div>
              <div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyAnalysis.order} — {flyAnalysis.life_stage} — ~{flyAnalysis.size_mm}</div>
              {flyAnalysis.quality==="poor"&&<div style={{fontSize:9,color:P.rust,marginTop:2}}>⚠ {flyAnalysis.quality_note}</div>}
              <div style={{fontSize:9,color:P.txM,marginTop:4,lineHeight:1.6}}>{flyAnalysis.identification_notes}</div>
              {flyAnalysis.matching_artificials?.length>0&&<div style={{marginTop:6}}><div style={{fontSize:8,fontWeight:700,color:P.gn,marginBottom:2}}>MATCH WITH</div>{flyAnalysis.matching_artificials.map((f,i)=><div key={i} style={{fontSize:10,color:P.gn,fontWeight:600}}>{f}</div>)}</div>}
              {flyAnalysis.tie_on_now&&<div style={{marginTop:6,padding:"6px 8px",background:P.gn+"18",borderRadius:5,border:`1px solid ${P.gn}40`}}><div style={{fontSize:8,fontWeight:700,color:P.gn}}>TIE ON NOW</div><div style={{fontSize:12,fontWeight:700,color:P.tx,marginTop:2}}>{flyAnalysis.tie_on_now}</div></div>}
              {flyAnalysis.fishing_notes&&<div style={{fontSize:9,color:P.txM,marginTop:4,fontStyle:"italic"}}>{flyAnalysis.fishing_notes}</div>}
            </>}
          </div>
        )}
        {flyAnalysis?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Analysis failed — {flyAnalysis.error}</div>}
        {flyAnalysis?.textId&&flyAnalysis.summary&&(
          <div style={{marginTop:10,padding:"10px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`}}>
            <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:4}}>AI IDENTIFICATION</div>
            <div style={{fontSize:11,color:P.tx,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{flyAnalysis.summary}</div>
          </div>
        )}
      </div>

      {/* ACTIVE HATCHES */}
      {spp.filter(s=>s.score>15).length>0&&(
        <div style={{marginBottom:12}}>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>ACTIVE NOW</div>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
            {spp.filter(s=>s.score>15).map(sp=>(
              <div key={sp.id} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:sp.id==="danica"?P.rustS:"transparent"}}>
                <div style={{display:"flex",gap:8}}>
                  <div style={{width:3,height:3,borderRadius:2,background:CC[sp.cat]||P.txD,marginTop:6}}/>
                  <div style={{flex:1}}>
                    <span style={{fontSize:12,fontWeight:700,color:sp.id==="danica"?P.rust:P.tx}}>{sp.cm}</span>
                    <div style={{fontSize:9,color:P.txD,marginTop:2}}>Hook {sp.hk} · {sp.sz}</div>
                    <div style={{fontSize:9,color:P.gn,marginTop:1}}>{FLYMAP[sp.id]||""} — <i>{FLYCONF[sp.id]||""}</i></div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:700,color:hC(sp.score)}}>{sp.score}</div>
                    <div style={{fontSize:7,color:hC(sp.score)}}>{sp.lb}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPECTED LATER */}
      {spp.filter(s=>s.score>0&&s.score<=15).length>0&&(
        <div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:6}}>EXPECTED LATER THIS SEASON</div>
          <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
            {spp.filter(s=>s.score>0&&s.score<=15).map(sp=>(
              <div key={sp.id} style={{padding:"8px 12px",borderBottom:`1px solid ${P.bd}`,opacity:0.5}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:P.txM}}>{sp.cm}</span>
                  <span style={{fontSize:11,color:P.txD}}>{sp.score}% — {sp.lb}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
