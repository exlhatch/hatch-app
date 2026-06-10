import {useState} from "react";

export default function FlyBoxTab({P,FLIES,actIds,flyT,setFlyT,openFly,setOpenFly,scanFlyBox,flyBoxScanning,flyBoxScan,ex,toggle}){
  return(
    <div>
      {/* SCAN MY FLY BOX */}
      <div style={{background:P.rustS,borderRadius:10,border:`1px solid ${P.rustB}`,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.12em",color:P.rust}}>SCAN MY FLY BOX</div>
            <div style={{fontSize:10,color:P.txM,marginTop:2}}>Photograph your box — AI picks the best fly</div>
          </div>
          <button onClick={scanFlyBox} disabled={flyBoxScanning} style={{background:P.rust,border:"none",borderRadius:6,padding:"8px 14px",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{flyBoxScanning?"Scanning...":"📷 Scan"}</button>
        </div>
        {flyBoxScan&&!flyBoxScan.error&&flyBoxScan.quality!=="unusable"&&(
          <div style={{marginTop:10}}>
            {flyBoxScan.tie_on_now&&(
              <div style={{padding:"10px 12px",background:P.gn+"18",borderRadius:8,border:`1px solid ${P.gn}40`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.gn,letterSpacing:"0.1em",marginBottom:3}}>TIE ON NOW</div>
                <div style={{fontSize:15,fontWeight:700,color:P.tx}}>{flyBoxScan.tie_on_now.name}</div>
                <div style={{fontSize:10,color:P.txM,marginTop:2,lineHeight:1.5}}>{flyBoxScan.tie_on_now.reason}</div>
              </div>
            )}
            {flyBoxScan.backup&&(
              <div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em",marginBottom:2}}>BACKUP</div>
                <div style={{fontSize:12,fontWeight:700,color:P.tx}}>{flyBoxScan.backup.name}</div>
                <div style={{fontSize:9,color:P.txM,marginTop:1}}>{flyBoxScan.backup.reason}</div>
              </div>
            )}
            {flyBoxScan.fishing_plan&&(
              <div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em",marginBottom:2}}>SESSION PLAN</div>
                <div style={{fontSize:10,color:P.txM,lineHeight:1.6}}>{flyBoxScan.fishing_plan}</div>
              </div>
            )}
            {flyBoxScan.flies_identified?.length>0&&(
              <div onClick={()=>toggle("boxflies")} style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8,cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:8,fontWeight:700,color:P.txD,letterSpacing:"0.1em"}}>IDENTIFIED {flyBoxScan.flies_identified.length} FLIES</div><span style={{fontSize:10,color:P.txD}}>{ex.boxflies?"−":"+"}</span></div>
                {ex.boxflies&&<div style={{marginTop:6}}>{flyBoxScan.flies_identified.map((f,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:i<flyBoxScan.flies_identified.length-1?`1px solid ${P.bd}`:""}}>
                  <span style={{fontSize:10,color:P.tx,fontWeight:600}}>{f.name}</span>
                  <span style={{fontSize:9,color:P.txD}}>#{f.size_estimate} · {f.type}</span>
                </div>)}</div>}
              </div>
            )}
            {flyBoxScan.missing?.length>0&&(
              <div style={{padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.bd}`,marginBottom:8}}>
                <div style={{fontSize:8,fontWeight:700,color:P.rust,letterSpacing:"0.1em",marginBottom:3}}>YOU'RE MISSING</div>
                {flyBoxScan.missing.map((f,i)=><div key={i} style={{fontSize:10,color:P.txM,lineHeight:1.5}}>• {f}</div>)}
              </div>
            )}
            {flyBoxScan.box_notes&&<div style={{fontSize:9,color:P.txD,lineHeight:1.5,fontStyle:"italic"}}>{flyBoxScan.box_notes}</div>}
          </div>
        )}
        {flyBoxScan&&flyBoxScan.quality==="unusable"&&(
          <div style={{marginTop:8,padding:"8px 12px",background:P.c2,borderRadius:8,border:`1px solid ${P.rust}40`}}>
            <div style={{fontSize:9,fontWeight:700,color:P.rust}}>BETTER PHOTO NEEDED</div>
            <div style={{fontSize:10,color:P.txM,marginTop:2}}>{flyBoxScan.quality_note||"Open the box flat, good light, shoot from above."}</div>
          </div>
        )}
        {flyBoxScan?.error&&<div style={{marginTop:6,fontSize:10,color:P.rust}}>Scan failed — {flyBoxScan.error}</div>}
      </div>

      {/* FLY TABS */}
      <div style={{display:"flex",gap:4,marginBottom:10}}>
        {[{id:"dry",l:"Dries"},{id:"emerger",l:"Emergers"},{id:"nymph",l:"Nymphs"}].map(t=>(
          <button key={t.id} onClick={()=>{setFlyT(t.id);setOpenFly(null)}} style={{flex:1,padding:"9px",borderRadius:8,border:flyT===t.id?`1px solid ${P.rust}`:`1px solid ${P.bd}`,background:flyT===t.id?P.rustS:"transparent",color:flyT===t.id?P.rust:P.txD,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t.l}</button>
        ))}
      </div>

      {/* FLY LIST */}
      <div style={{background:P.c1,borderRadius:10,border:`1px solid ${P.bd}`,overflow:"hidden"}}>
        {FLIES[flyT].map((f,i)=>{
          const isM=f.mt.some(m=>actIds.includes(m));
          const isO=openFly===f.nm;
          return(
            <div key={i}>
              <div onClick={()=>setOpenFly(isO?null:f.nm)} style={{padding:"10px 12px",borderBottom:`1px solid ${P.bd}`,background:isM?P.rustS:"transparent",cursor:"pointer"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <span style={{fontSize:13,fontWeight:700,color:isM?P.rust:P.tx}}>{f.nm}</span>
                    {isM&&<span style={{fontSize:7,fontWeight:700,color:P.rust,marginLeft:6,background:P.rustB,padding:"1px 5px",borderRadius:3}}>MATCH</span>}
                    <div style={{fontSize:9,color:P.txD,marginTop:2}}>#{f.sz} — <i>{f.cf}</i></div>
                  </div>
                  <span style={{color:P.txD,fontSize:11}}>{isO?"−":"+"}</span>
                </div>
              </div>
              {isO&&<div style={{padding:12,background:P.c2,borderBottom:`1px solid ${P.bd}`}}><div style={{fontSize:11,color:P.txM,lineHeight:1.7}}>{f.nt}</div></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
