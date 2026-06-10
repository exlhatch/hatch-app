export default function TipsTab({P,SC,scenario,setScenario,analyzeRiver,riverAnalyzing,riverAnalysis,startListening,listening,voiceResult,speak,speaking}){
  return(
    <div>
      {/* READ THE WATER */}
      <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>READ THE WATER</div>
            <div style={{fontSize:10,color:P.txM,marginTop:2}}>Photo a stretch and AI shows where to fish</div>
          </div>
          <button onClick={analyzeRiver} disabled={riverAnalyzing} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 12px",color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{riverAnalyzing?"Analysing...":"📷 Analyse"}</button>
        </div>
        {riverAnalysis&&!riverAnalysis.error&&riverAnalysis.quality!=="unusable"&&(
          <div style={{marginTop:10,display:"grid",gap:6}}>
            <div style={{padding:"8px 10px",background:P.gn+"18",borderRadius:6,border:`1px solid ${P.gn}40`}}><div style={{fontSize:8,fontWeight:700,color:P.gn}}>WHERE TO STAND</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.6}}>{riverAnalysis.where_to_stand}</div></div>
            <div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.rust}}>WHERE TO CAST</div><div style={{fontSize:10,color:P.tx,marginTop:2,lineHeight:1.6}}>{riverAnalysis.where_to_cast}</div></div>
            {riverAnalysis.likely_fish_lies?.length>0&&(
              <div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.txD}}>FISH LIES</div>{riverAnalysis.likely_fish_lies.map((l,li)=><div key={li} style={{fontSize:9,color:P.txM,marginTop:2}}>• {l}</div>)}</div>
            )}
            <div style={{padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}><div style={{fontSize:8,fontWeight:700,color:P.txD}}>APPROACH</div><div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.6}}>{riverAnalysis.approach}</div></div>
            <div style={{fontSize:10,color:P.txM,lineHeight:1.6,fontStyle:"italic"}}>{riverAnalysis.overall}</div>
            <button onClick={()=>speak(riverAnalysis.overall+" "+riverAnalysis.where_to_stand+" "+riverAnalysis.where_to_cast)} style={{padding:"6px",borderRadius:5,border:`1px solid ${P.bd}`,background:"transparent",color:P.txD,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>🔊 Read aloud</button>
          </div>
        )}
        {riverAnalysis&&riverAnalysis.quality==="unusable"&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Need a clearer photo. Try landscape showing the full stretch.</div>}
        {riverAnalysis?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Analysis failed. Check your connection.</div>}
      </div>

      {/* ASK THE GUIDE */}
      <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,padding:"10px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.txD}}>ASK THE GUIDE</div>
            <div style={{fontSize:9,color:P.txM,marginTop:2}}>Tap mic, ask anything</div>
          </div>
          <button onClick={startListening} style={{background:listening?P.rust:P.gn,border:"none",borderRadius:"50%",width:36,height:36,color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>{listening?"...":"🎙"}</button>
        </div>
        {voiceResult&&(
          <div style={{marginTop:8,padding:"8px 10px",background:P.c2,borderRadius:6,border:`1px solid ${P.bd}`}}>
            <div style={{fontSize:11,color:P.tx,lineHeight:1.7}}>{voiceResult}</div>
          </div>
        )}
      </div>

      {/* SCENARIOS */}
      <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.18em",color:P.txD,marginBottom:8}}>WHAT'S HAPPENING?</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
        {SC.map(sc=>(
          <button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)} style={{padding:"14px 10px",borderRadius:8,border:scenario===sc.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:scenario===sc.id?P.rustS:P.c1,color:scenario===sc.id?P.rust:P.tx,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
            <div style={{fontSize:16,marginBottom:4}}>{sc.i}</div>{sc.l}
          </button>
        ))}
      </div>
      {scenario&&(
        <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
          {SC.find(s=>s.id===scenario)?.a.map((a,i)=>(
            <div key={i} style={{padding:14,borderBottom:`1px solid ${P.bd}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontSize:13,fontWeight:700,color:P.tx,flex:1}}>{a.h}</div>
                <span style={{fontSize:14,fontWeight:700,color:a.c>=80?P.gn:P.rust}}>{a.c}%</span>
              </div>
              <div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{a.d}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
