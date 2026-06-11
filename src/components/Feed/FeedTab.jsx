import {useState} from "react";

function compress(file,maxW=1080){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const sc=Math.min(1,maxW/img.width);c.width=img.width*sc;c.height=img.height*sc;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",0.82).split(",")[1])};img.src=r.result};r.readAsDataURL(file)})}

function ago(iso){const d=new Date(iso),m=Math.floor((Date.now()-d)/60000);if(m<2)return"just now";if(m<60)return`${m}m`;const h=Math.floor(m/60);if(h<24)return`${h}h`;return d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}

export default function FeedTab({P,user,posts,loadingPosts,onCreatePost,onDeletePost,currentRv,cT,cAir,cW,cHumidity}){
  const[showCreate,setShowCreate]=useState(false);
  const[np,setNp]=useState({image:null,caption:"",species:"",weight:"",fly:"",isPublic:true});
  const[posting,setPosting]=useState(false);
  const[expanded,setExpanded]=useState(null);

  const fileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(fileRef){fileRef.type="file";fileRef.accept="image/*";}

  const pickPhoto=()=>{
    if(!fileRef)return;
    fileRef.onchange=async(e)=>{
      const f=e.target.files?.[0];if(!f)return;
      setNp(p=>({...p,image:null}));
      const b64=await compress(f);
      setNp(p=>({...p,image:b64}));
      fileRef.value="";
    };
    fileRef.click();
  };

  const submit=async()=>{
    if(!np.image&&!np.caption.trim())return;
    setPosting(true);
    let lat=currentRv?.lat||null,lng=currentRv?.lng||null;
    try{await new Promise(res=>navigator.geolocation?.getCurrentPosition(p=>{lat=p.coords.latitude;lng=p.coords.longitude;res()},()=>res(),{timeout:4000}));}catch{}
    await onCreatePost({
      id:Date.now(),
      user_email:user?.email||"",user_name:user?.name||"Anon",
      image:np.image||null,caption:np.caption,
      species:np.species,weight:np.weight,fly:np.fly,
      river_name:currentRv?.n||"",lat,lng,
      temp:cT,air_temp:cAir,wind:cW,humidity:cHumidity,
      created_at:new Date().toISOString(),is_public:np.isPublic
    });
    setNp({image:null,caption:"",species:"",weight:"",fly:"",isPublic:true});
    setShowCreate(false);setPosting(false);
  };

  return(
    <div style={{position:"relative",margin:"-14px -14px 0"}}>

      {loadingPosts&&<div style={{textAlign:"center",padding:40,color:P.txD,fontSize:11}}>Loading...</div>}

      {!loadingPosts&&posts.length===0&&(
        <div style={{textAlign:"center",padding:"80px 24px",color:P.txD}}>
          <div style={{fontSize:44,marginBottom:16}}>📸</div>
          <div style={{fontSize:16,fontWeight:700,color:P.tx,marginBottom:8}}>Nothing in the feed yet</div>
          <div style={{fontSize:12,color:P.txM,lineHeight:1.7,maxWidth:260,margin:"0 auto"}}>Share your first catch and start the community. Tap the button below.</div>
        </div>
      )}

      {posts.map(post=>(
        <div key={post.id} style={{marginBottom:1,background:P.c1,overflow:"hidden"}}>

          {/* Full-bleed photo with overlay */}
          {post.image&&(
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setExpanded(expanded===post.id?null:post.id)}>
              <img
                src={`data:image/jpeg;base64,${post.image}`}
                alt=""
                style={{width:"100%",maxHeight:480,objectFit:"cover",display:"block"}}
              />
              {/* Bottom gradient overlay */}
              <div style={{
                position:"absolute",bottom:0,left:0,right:0,
                background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
                padding:"40px 14px 12px"
              }}>
                <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{
                      width:36,height:36,borderRadius:18,
                      background:"rgba(122,158,126,0.4)",
                      border:"2px solid rgba(255,255,255,0.35)",
                      backdropFilter:"blur(6px)",
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:14,fontWeight:700,color:"#fff",flexShrink:0
                    }}>{(post.user_name||"A")[0].toUpperCase()}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#fff",textShadow:"0 1px 4px rgba(0,0,0,0.5)"}}>{post.user_name||"Anon"}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.7)"}}>{post.river_name||"Unknown water"} &middot; {ago(post.created_at)}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {(post.species||post.weight)&&(
                      <div style={{background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)",borderRadius:20,padding:"4px 10px",display:"flex",gap:6,alignItems:"center"}}>
                        {post.species&&<span style={{fontSize:11,color:"#fff",fontWeight:600}}>🐟 {post.species}</span>}
                        {post.weight&&<span style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}>{post.weight}lb</span>}
                      </div>
                    )}
                    {post.user_email===user?.email&&(
                      <button onClick={e=>{e.stopPropagation();onDeletePost(post.id)}} style={{background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",border:"none",borderRadius:14,width:28,height:28,color:"rgba(255,255,255,0.7)",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No-photo header */}
          {!post.image&&(
            <div style={{padding:"14px 14px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:19,background:P.gn+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:P.gn,flexShrink:0}}>{(post.user_name||"A")[0].toUpperCase()}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:P.tx}}>{post.user_name||"Anon"}</div>
                  <div style={{fontSize:10,color:P.txD}}>{post.river_name||"Unknown water"} &middot; {ago(post.created_at)}</div>
                </div>
              </div>
              {post.user_email===user?.email&&(
                <button onClick={()=>onDeletePost(post.id)} style={{background:"none",border:"none",color:P.txD,fontSize:12,cursor:"pointer",padding:4}}>✕</button>
              )}
            </div>
          )}

          {/* Post body */}
          <div style={{padding:"10px 14px 14px"}}>
            {post.fly&&(
              <div style={{marginBottom:8}}>
                <span style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:P.rust+"18",color:P.rust,fontWeight:500}}>🪰 {post.fly}</span>
              </div>
            )}
            {post.caption&&<div style={{fontSize:13,color:P.tx,lineHeight:1.65}}>{post.caption}</div>}

            {(post.temp!=null||post.wind!=null||post.humidity!=null)&&(
              <div style={{display:"flex",gap:12,marginTop:10,paddingTop:10,borderTop:`1px solid ${P.bd}`}}>
                {post.temp!=null&&<span style={{fontSize:10,color:P.txD}}>💧 {post.temp}°C water</span>}
                {post.air_temp!=null&&<span style={{fontSize:10,color:P.txD}}>🌡 {post.air_temp}°C air</span>}
                {post.wind!=null&&<span style={{fontSize:10,color:P.txD}}>💨 {post.wind}mph</span>}
                {post.humidity!=null&&<span style={{fontSize:10,color:P.txD}}>💦 {post.humidity}%</span>}
              </div>
            )}
          </div>

          <div style={{height:1,background:P.bd,opacity:0.6}}/>
        </div>
      ))}

      {/* Bottom padding so last post isn't hidden by FAB */}
      <div style={{height:80}}/>

      {/* Floating action button */}
      <button
        onClick={()=>setShowCreate(true)}
        style={{
          position:"fixed",
          bottom:"calc(76px + env(safe-area-inset-bottom, 0px))",
          right:20,
          width:54,height:54,borderRadius:27,
          border:"none",background:P.gn,
          color:"#fff",fontSize:24,
          cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 4px 24px rgba(0,0,0,0.35)",
          zIndex:50,
          lineHeight:1
        }}
      >+</button>

      {/* Create post bottom sheet */}
      {showCreate&&(
        <div
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}
          onClick={e=>{if(e.target===e.currentTarget)setShowCreate(false);}}
        >
          <div style={{background:P.c1,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto"}}>

            {/* Sheet handle + header */}
            <div style={{padding:"12px 16px 14px",borderBottom:`1px solid ${P.bd}`,position:"sticky",top:0,background:P.c1,zIndex:1}}>
              <div style={{width:36,height:4,background:P.bd,borderRadius:2,margin:"0 auto 12px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:P.tx}}>SHARE A CATCH</div>
                <button onClick={()=>setShowCreate(false)} style={{background:"none",border:"none",color:P.txD,fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
              </div>
            </div>

            {/* Photo area */}
            {np.image
              ?<div style={{position:"relative"}}>
                <img src={`data:image/jpeg;base64,${np.image}`} alt="" style={{width:"100%",maxHeight:300,objectFit:"cover",display:"block"}}/>
                <button onClick={()=>setNp(p=>({...p,image:null}))} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.6)",border:"none",borderRadius:16,width:32,height:32,color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>✕</button>
              </div>
              :<button onClick={pickPhoto} style={{width:"100%",height:160,background:P.c2,border:"none",color:P.txD,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,borderBottom:`1px solid ${P.bd}`}}>
                <span style={{fontSize:32}}>📷</span>
                <span style={{fontWeight:500}}>Add a photo</span>
              </button>
            }

            <div style={{padding:"14px 16px 28px",display:"grid",gap:10}}>
              <textarea
                value={np.caption}
                onChange={e=>setNp(p=>({...p,caption:e.target.value}))}
                placeholder="What happened? Fly, tactics, anything useful..."
                rows={3}
                style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:10,padding:"12px",color:P.tx,fontSize:13,fontFamily:"inherit",width:"100%",resize:"none",lineHeight:1.6}}
              />

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>SPECIES</div>
                  <input value={np.species} onChange={e=>setNp(p=>({...p,species:e.target.value}))} placeholder="Brown Trout" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"10px 12px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>WEIGHT (LB)</div>
                  <input value={np.weight} onChange={e=>setNp(p=>({...p,weight:e.target.value}))} placeholder="2.5" type="number" step="0.25" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"10px 12px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/>
                </div>
              </div>

              <div>
                <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>FLY USED</div>
                <input value={np.fly} onChange={e=>setNp(p=>({...p,fly:e.target.value}))} placeholder="Adams #16" style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"10px 12px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"}}/>
              </div>

              <label
                style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"12px",background:P.c2,borderRadius:10,border:`1px solid ${np.isPublic?P.gn+"50":P.bd}`}}
                onClick={()=>setNp(p=>({...p,isPublic:!p.isPublic}))}
              >
                <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${np.isPublic?P.gn:P.bd}`,background:np.isPublic?P.gn:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {np.isPublic&&<span style={{color:"#fff",fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:P.tx}}>Share publicly</div>
                  <div style={{fontSize:10,color:P.txD}}>Visible to all Ephemera users</div>
                </div>
              </label>

              <button
                onClick={submit}
                disabled={posting||(!np.image&&!np.caption.trim())}
                style={{width:"100%",padding:"15px",borderRadius:12,border:"none",background:posting||(!np.image&&!np.caption.trim())?P.c3:P.gn,color:posting||(!np.image&&!np.caption.trim())?P.txD:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}
              >
                {posting?"Posting...":"Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
