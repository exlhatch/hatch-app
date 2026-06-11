import {useState,useCallback} from "react";
import {sbInsert,sbSelect} from "../../lib/supabase.js";

function compress(file,maxW=1080){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const sc=Math.min(1,maxW/img.width);c.width=img.width*sc;c.height=img.height*sc;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",0.82).split(",")[1])};img.src=r.result};r.readAsDataURL(file)})}
function ago(iso){const d=new Date(iso),m=Math.floor((Date.now()-d)/60000);if(m<2)return"just now";if(m<60)return`${m}m`;const h=Math.floor(m/60);if(h<24)return`${h}h`;return d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}
function getLikes(){try{return JSON.parse(localStorage.getItem("eph_likes"))||{}}catch{return{}}}
function setLikesStore(l){try{localStorage.setItem("eph_likes",JSON.stringify(l))}catch{}}
function getSavedStore(){try{return JSON.parse(localStorage.getItem("eph_saved"))||[]}catch{return[]}}
function setSavedStore(s){try{localStorage.setItem("eph_saved",JSON.stringify(s))}catch{}}
function getLocalComments(){try{return JSON.parse(localStorage.getItem("eph_comments"))||{}}catch{return{}}}
function setLocalComments(c){try{localStorage.setItem("eph_comments",JSON.stringify(c))}catch{}}

export default function FeedTab({P,user,posts,loadingPosts,onCreatePost,onDeletePost,currentRv,cT,cAir,cW,cHumidity,sessionSnaps=[]}){
  const[likes,setLikes]=useState(getLikes);
  const[saved,setSaved]=useState(getSavedStore);
  const[comments,setComments]=useState(getLocalComments);
  const[commentPostId,setCommentPostId]=useState(null);
  const[commentText,setCommentText]=useState("");
  const[loadingComments,setLoadingComments]=useState(false);
  const[showCreate,setShowCreate]=useState(false);
  const[fromSession,setFromSession]=useState(false);
  const[np,setNp]=useState({image:null,caption:"",species:"",weight:"",fly:"",river:"",beat:"",isPublic:true});
  const[posting,setPosting]=useState(false);
  const[analyzing,setAnalyzing]=useState(false);
  const[aiResult,setAiResult]=useState(null);

  const fileRef=typeof document!=="undefined"?document.createElement("input"):null;
  if(fileRef){fileRef.type="file";fileRef.accept="image/*";}

  /* ── PHOTO + AI ── */
  const analyzePhoto=async(b64)=>{
    setAnalyzing(true);setAiResult(null);
    try{
      const r=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:b64,mode:"fish"})});
      const d=await r.json();
      if(d&&d.quality!=="unusable"&&!d.error){
        setAiResult(d);
        setNp(p=>({...p,
          species:p.species||d.species||"",
          weight:p.weight||(d.weight_estimate_lb?String(d.weight_estimate_lb):"")
        }));
      }
    }catch{}
    setAnalyzing(false);
  };

  const pickPhoto=()=>{
    if(!fileRef)return;
    fileRef.onchange=async(e)=>{
      const f=e.target.files?.[0];if(!f)return;
      const b64=await compress(f);
      setNp(p=>({...p,image:b64}));
      analyzePhoto(b64);
      fileRef.value="";
    };
    fileRef.click();
  };

  const useSnap=(snap)=>{
    const b64=snap.photo;
    setNp(p=>({...p,image:b64,species:snap.species||p.species,weight:snap.weight||p.weight,fly:snap.fly||p.fly}));
    setFromSession(false);
    if(!snap.species&&!snap.weight)analyzePhoto(b64);
    else setAiResult({species:snap.species,weight_estimate_lb:snap.weight,quality:"good"});
  };

  /* ── RESET FORM ── */
  const resetForm=()=>{setNp({image:null,caption:"",species:"",weight:"",fly:"",river:"",beat:"",isPublic:true});setAiResult(null);setFromSession(false);};

  /* ── SUBMIT POST ── */
  const submit=async()=>{
    if(!np.image&&!np.caption.trim())return;
    setPosting(true);
    let lat=currentRv?.lat||null,lng=currentRv?.lng||null;
    try{await new Promise(res=>navigator.geolocation?.getCurrentPosition(p=>{lat=p.coords.latitude;lng=p.coords.longitude;res()},()=>res(),{timeout:4000}));}catch{}
    await onCreatePost({
      id:Date.now(),user_email:user?.email||"",user_name:user?.name||"Anon",
      image:np.image||null,caption:np.caption,
      species:np.species,weight:np.weight,fly:np.fly,
      river_name:np.river||currentRv?.n||"",beat:np.beat,
      lat,lng,temp:cT,air_temp:cAir,wind:cW,humidity:cHumidity,
      created_at:new Date().toISOString(),is_public:np.isPublic,
      likes_count:0,comments_count:0
    });
    resetForm();setShowCreate(false);setPosting(false);
  };

  /* ── LIKES ── */
  const toggleLike=(postId)=>{
    setLikes(prev=>{
      const next={...prev,[postId]:!prev[postId]};
      setLikesStore(next);return next;
    });
  };

  /* ── SAVE ── */
  const toggleSave=(postId)=>{
    setSaved(prev=>{
      const next=prev.includes(postId)?prev.filter(x=>x!==postId):[...prev,postId];
      setSavedStore(next);return next;
    });
  };

  /* ── COMMENTS ── */
  const loadComments=useCallback(async(postId)=>{
    setLoadingComments(true);
    try{
      const remote=await sbSelect("comments",`post_id=eq.${postId}&order=created_at.asc`);
      if(remote&&remote.length>0){
        setComments(prev=>{const next={...prev,[postId]:remote};setLocalComments(next);return next});
      }
    }catch{}
    setLoadingComments(false);
  },[]);

  const openComments=(postId)=>{setCommentPostId(postId);setCommentText("");loadComments(postId);};

  const addComment=async()=>{
    if(!commentText.trim()||!commentPostId)return;
    const c={id:Date.now(),post_id:commentPostId,user_email:user?.email||"",user_name:user?.name||"Anon",text:commentText.trim(),created_at:new Date().toISOString()};
    setComments(prev=>{const list=[...(prev[commentPostId]||[]),c];const next={...prev,[commentPostId]:list};setLocalComments(next);return next});
    setCommentText("");
    sbInsert("comments",c);
  };

  const postComments=(id)=>comments[id]||[];

  /* ── INPUT STYLE ── */
  const inp={background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"10px 12px",color:P.tx,fontSize:12,fontFamily:"inherit",width:"100%"};

  return(
    <div style={{position:"relative",margin:"-14px -14px 0"}}>
      {loadingPosts&&<div style={{textAlign:"center",padding:48,color:P.txD,fontSize:11}}>Loading...</div>}

      {!loadingPosts&&posts.length===0&&(
        <div style={{textAlign:"center",padding:"80px 24px"}}>
          <div style={{fontSize:44,marginBottom:16}}>📸</div>
          <div style={{fontSize:16,fontWeight:700,color:P.tx,marginBottom:8}}>Nothing in the feed yet</div>
          <div style={{fontSize:12,color:P.txM,lineHeight:1.7,maxWidth:260,margin:"0 auto"}}>Share your first catch and start the community.</div>
        </div>
      )}

      {/* ── FEED ── */}
      {posts.map(post=>{
        const liked=!!likes[post.id];
        const isSaved=saved.includes(post.id);
        const commentCount=postComments(post.id).length||(post.comments_count||0);
        const likeCount=(post.likes_count||0)+(liked?1:0);
        return(
          <div key={post.id} style={{marginBottom:1,background:P.c1,overflow:"hidden"}}>

            {/* Full-bleed photo */}
            {post.image&&(
              <div style={{position:"relative"}}>
                <img src={`data:image/jpeg;base64,${post.image}`} alt="" style={{width:"100%",maxHeight:500,objectFit:"cover",display:"block"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.4) 50%,transparent 100%)",padding:"48px 14px 12px"}}>
                  <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:36,height:36,borderRadius:18,background:"rgba(122,158,126,0.4)",border:"2px solid rgba(255,255,255,0.4)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>{(post.user_name||"A")[0].toUpperCase()}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:"#fff",textShadow:"0 1px 6px rgba(0,0,0,0.6)"}}>{post.user_name||"Anon"}</div>
                        <div style={{fontSize:10,color:"rgba(255,255,255,0.72)"}}>{post.river_name||"Unknown water"}{post.beat?" / "+post.beat:""} · {ago(post.created_at)}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {(post.species||post.weight)&&(
                        <div style={{background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",borderRadius:20,padding:"5px 10px"}}>
                          {post.species&&<span style={{fontSize:11,color:"#fff",fontWeight:600}}>🐟 {post.species}</span>}
                          {post.weight&&<span style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}> {post.weight}lb</span>}
                        </div>
                      )}
                      {post.user_email===user?.email&&(
                        <button onClick={()=>onDeletePost(post.id)} style={{background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)",border:"none",borderRadius:14,width:28,height:28,color:"rgba(255,255,255,0.65)",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* No-photo header */}
            {!post.image&&(
              <div style={{padding:"14px 14px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:38,height:38,borderRadius:19,background:P.gn+"25",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:P.gn,flexShrink:0}}>{(post.user_name||"A")[0].toUpperCase()}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:P.tx}}>{post.user_name||"Anon"}</div>
                    <div style={{fontSize:10,color:P.txD}}>{post.river_name||"Unknown water"}{post.beat?" / "+post.beat:""} · {ago(post.created_at)}</div>
                  </div>
                </div>
                {post.user_email===user?.email&&<button onClick={()=>onDeletePost(post.id)} style={{background:"none",border:"none",color:P.txD,fontSize:12,cursor:"pointer",padding:4}}>✕</button>}
              </div>
            )}

            {/* Actions */}
            <div style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:18}}>
                <button onClick={()=>toggleLike(post.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:liked?P.rust:P.txD,fontFamily:"inherit",padding:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  {likeCount>0&&<span style={{fontSize:12,fontWeight:600}}>{likeCount}</span>}
                </button>
                <button onClick={()=>openComments(post.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:P.txD,fontFamily:"inherit",padding:0}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  {commentCount>0&&<span style={{fontSize:12,color:P.txM,fontWeight:600}}>{commentCount}</span>}
                </button>
              </div>
              <button onClick={()=>toggleSave(post.id)} style={{background:"none",border:"none",cursor:"pointer",color:isSaved?P.gn:P.txD,fontFamily:"inherit",padding:0}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved?"currentColor":"none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              </button>
            </div>

            {/* Caption + fly + conditions */}
            {(post.caption||post.fly||(post.temp!=null||post.wind!=null))&&(
              <div style={{padding:"0 14px 14px"}}>
                {post.fly&&<div style={{marginBottom:7}}><span style={{fontSize:10,padding:"3px 10px",borderRadius:20,background:P.rust+"18",color:P.rust,fontWeight:500}}>🪰 {post.fly}</span></div>}
                {post.caption&&<div style={{fontSize:13,color:P.tx,lineHeight:1.65}}>{post.caption}</div>}
                {(post.temp!=null||post.wind!=null||post.humidity!=null)&&(
                  <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid ${P.bd}`}}>
                    {post.temp!=null&&<span style={{fontSize:10,color:P.txD}}>💧 {post.temp}°C water</span>}
                    {post.air_temp!=null&&<span style={{fontSize:10,color:P.txD}}>🌡 {post.air_temp}°C air</span>}
                    {post.wind!=null&&<span style={{fontSize:10,color:P.txD}}>💨 {post.wind}mph</span>}
                    {post.humidity!=null&&<span style={{fontSize:10,color:P.txD}}>💦 {post.humidity}%</span>}
                  </div>
                )}
              </div>
            )}

            <div style={{height:1,background:P.bd,opacity:0.5}}/>
          </div>
        );
      })}

      <div style={{height:90}}/>

      {/* FAB */}
      <button onClick={()=>setShowCreate(true)} style={{position:"fixed",bottom:"calc(76px + env(safe-area-inset-bottom,0px))",right:20,width:54,height:54,borderRadius:27,border:"none",background:P.gn,color:"#fff",fontSize:26,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.3)",zIndex:50,lineHeight:1}}>+</button>

      {/* ── COMMENTS MODAL ── */}
      {commentPostId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.72)",zIndex:350,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget){setCommentPostId(null);setCommentText("")}}}>
          <div style={{background:P.c1,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"72vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 16px 10px",borderBottom:`1px solid ${P.bd}`,flexShrink:0}}>
              <div style={{width:36,height:4,background:P.bd,borderRadius:2,margin:"0 auto 10px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",color:P.tx}}>COMMENTS</div>
                <button onClick={()=>{setCommentPostId(null);setCommentText("")}} style={{background:"none",border:"none",color:P.txD,fontSize:18,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
              </div>
            </div>
            <div style={{overflowY:"auto",flex:1,padding:"12px 16px"}}>
              {loadingComments&&<div style={{textAlign:"center",fontSize:11,color:P.txD,padding:20}}>Loading...</div>}
              {!loadingComments&&postComments(commentPostId).length===0&&(
                <div style={{textAlign:"center",fontSize:12,color:P.txD,padding:24}}>No comments yet. Be the first.</div>
              )}
              {postComments(commentPostId).map((c,i)=>(
                <div key={c.id||i} style={{marginBottom:14,display:"flex",gap:10}}>
                  <div style={{width:30,height:30,borderRadius:15,background:P.gn+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:P.gn,flexShrink:0}}>{(c.user_name||"A")[0].toUpperCase()}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:6,alignItems:"baseline",marginBottom:3}}>
                      <span style={{fontSize:12,fontWeight:700,color:P.tx}}>{c.user_name||"Anon"}</span>
                      <span style={{fontSize:9,color:P.txD}}>{ago(c.created_at)}</span>
                    </div>
                    <div style={{fontSize:13,color:P.tx,lineHeight:1.55}}>{c.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{padding:"10px 14px 20px",borderTop:`1px solid ${P.bd}`,flexShrink:0,display:"flex",gap:8,alignItems:"center"}}>
              <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();addComment()}}} placeholder="Add a comment..." style={{flex:1,background:P.c2,border:`1px solid ${P.bd}`,borderRadius:22,padding:"10px 14px",color:P.tx,fontSize:13,fontFamily:"inherit"}}/>
              <button onClick={addComment} disabled={!commentText.trim()} style={{background:commentText.trim()?P.gn:P.c3,border:"none",borderRadius:22,padding:"10px 18px",color:commentText.trim()?"#fff":P.txD,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE POST SHEET ── */}
      {showCreate&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget){setShowCreate(false);resetForm();}}}>
          <div style={{background:P.c1,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:480,maxHeight:"95vh",overflowY:"auto"}}>

            {/* Header */}
            <div style={{padding:"12px 16px 14px",borderBottom:`1px solid ${P.bd}`,position:"sticky",top:0,background:P.c1,zIndex:1}}>
              <div style={{width:36,height:4,background:P.bd,borderRadius:2,margin:"0 auto 12px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:P.tx}}>SHARE A CATCH</div>
                <button onClick={()=>{setShowCreate(false);resetForm()}} style={{background:"none",border:"none",color:P.txD,fontSize:20,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
              </div>
            </div>

            {/* Photo section */}
            {!np.image?(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",borderBottom:`1px solid ${P.bd}`}}>
                  <button onClick={pickPhoto} style={{padding:"26px 16px",background:P.c2,border:"none",borderRight:`1px solid ${P.bd}`,color:P.txM,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                    <span style={{fontSize:30}}>📷</span>
                    <span style={{fontWeight:600,color:P.tx}}>Camera / Roll</span>
                    <span style={{fontSize:10,color:P.txD}}>Upload any photo</span>
                  </button>
                  <button onClick={()=>setFromSession(s=>!s)} style={{padding:"26px 16px",background:fromSession?P.gn+"12":P.c2,border:"none",color:fromSession?P.gn:P.txM,fontSize:12,cursor:"pointer",fontFamily:"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                    <span style={{fontSize:30}}>🎣</span>
                    <span style={{fontWeight:600,color:fromSession?P.gn:P.tx}}>From Session</span>
                    <span style={{fontSize:10,color:P.txD}}>{sessionSnaps.length>0?`${sessionSnaps.length} snap${sessionSnaps.length!==1?"s":""}`:""}</span>
                  </button>
                </div>
                {fromSession&&(
                  <div style={{borderBottom:`1px solid ${P.bd}`}}>
                    {sessionSnaps.length>0?(
                      <div style={{padding:"12px 0 12px"}}>
                        <div style={{fontSize:9,color:P.txD,letterSpacing:"0.08em",padding:"0 14px",marginBottom:10}}>TAP TO USE</div>
                        <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 14px",paddingBottom:4}}>
                          {sessionSnaps.map((s,i)=>(
                            <div key={s.id||i} onClick={()=>useSnap(s)} style={{flexShrink:0,width:86,height:86,borderRadius:10,overflow:"hidden",cursor:"pointer",border:`2px solid ${P.bd}`}}>
                              <img src={`data:image/jpeg;base64,${s.photo}`} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    ):(
                      <div style={{padding:"20px 16px",textAlign:"center"}}>
                        <div style={{fontSize:12,color:P.txD,lineHeight:1.65}}>No session snaps yet.<br/>Start a session and use Quick Snap to capture catches.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ):(
              /* Photo preview with AI overlay */
              <div style={{position:"relative"}}>
                <img src={`data:image/jpeg;base64,${np.image}`} alt="" style={{width:"100%",maxHeight:340,objectFit:"cover",display:"block"}}/>
                {/* AI status */}
                {analyzing&&(
                  <div style={{position:"absolute",bottom:12,left:12,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(8px)",borderRadius:22,padding:"7px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:4,background:P.gn,animation:"pulse 1s infinite"}}/>
                    <span style={{fontSize:11,color:"#fff",fontWeight:500}}>AI analysing...</span>
                  </div>
                )}
                {!analyzing&&aiResult&&!aiResult.error&&aiResult.species&&aiResult.species!=="Unknown"&&(
                  <div style={{position:"absolute",bottom:12,left:12,background:"rgba(0,0,0,0.72)",backdropFilter:"blur(8px)",borderRadius:22,padding:"7px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:P.gn,fontWeight:700}}>✓ AI</span>
                    <span style={{fontSize:11,color:"#fff",fontWeight:500}}>
                      {aiResult.species}
                      {aiResult.weight_range?" · "+aiResult.weight_range:""}
                      {aiResult.wild_stocked&&aiResult.wild_stocked!=="Uncertain"?" · "+aiResult.wild_stocked:""}
                    </span>
                  </div>
                )}
                <button onClick={()=>{setNp(p=>({...p,image:null}));setAiResult(null)}} style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",border:"none",borderRadius:16,width:32,height:32,color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              </div>
            )}

            {/* Form */}
            <div style={{padding:"14px 16px 32px",display:"grid",gap:10}}>
              <textarea value={np.caption} onChange={e=>setNp(p=>({...p,caption:e.target.value}))} placeholder="What happened? Fly choice, conditions, tips..." rows={3} style={{...inp,borderRadius:10,padding:"12px",fontSize:13,resize:"none",lineHeight:1.6}}/>

              {/* Species + weight — highlighted green if AI-filled */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:4}}>
                    SPECIES {aiResult&&np.species&&!analyzing&&<span style={{color:P.gn,fontWeight:700}}>✓ AI</span>}
                  </div>
                  <input value={np.species} onChange={e=>setNp(p=>({...p,species:e.target.value}))} placeholder="Brown Trout" style={{...inp,border:`1px solid ${aiResult&&np.species?P.gn+"55":P.bd}`}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em",display:"flex",alignItems:"center",gap:4}}>
                    WEIGHT (LB) {aiResult&&np.weight&&!analyzing&&<span style={{color:P.gn,fontWeight:700}}>✓ AI</span>}
                  </div>
                  <input value={np.weight} onChange={e=>setNp(p=>({...p,weight:e.target.value}))} placeholder="2.5" type="number" step="0.25" style={{...inp,border:`1px solid ${aiResult&&np.weight?P.gn+"55":P.bd}`}}/>
                </div>
              </div>

              <div>
                <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>FLY USED</div>
                <input value={np.fly} onChange={e=>setNp(p=>({...p,fly:e.target.value}))} placeholder="Adams #16" style={inp}/>
              </div>

              {/* Location */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>RIVER / WATER</div>
                  <input
                    value={np.river}
                    onChange={e=>setNp(p=>({...p,river:e.target.value}))}
                    placeholder={currentRv?.n||"River name"}
                    style={inp}
                  />
                </div>
                <div>
                  <div style={{fontSize:9,color:P.txD,marginBottom:4,letterSpacing:"0.08em"}}>BEAT / SECTION</div>
                  <input value={np.beat} onChange={e=>setNp(p=>({...p,beat:e.target.value}))} placeholder="e.g. Stockbridge" style={inp}/>
                </div>
              </div>

              {/* Conditions auto-filled badge */}
              {(cT||cW||cAir)&&(
                <div style={{background:P.c2,border:`1px solid ${P.bd}`,borderRadius:8,padding:"9px 12px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontSize:9,color:P.txD,letterSpacing:"0.06em",marginRight:2}}>CONDITIONS</span>
                  {cT&&<span style={{fontSize:10,color:P.txM}}>💧 {cT}°C</span>}
                  {cAir&&<span style={{fontSize:10,color:P.txM}}>🌡 {cAir}°C</span>}
                  {cW&&<span style={{fontSize:10,color:P.txM}}>💨 {cW}mph</span>}
                  {cHumidity&&<span style={{fontSize:10,color:P.txM}}>💦 {cHumidity}%</span>}
                  <span style={{fontSize:9,color:P.gn,marginLeft:"auto"}}>Auto-tagged</span>
                </div>
              )}

              {/* Public toggle */}
              <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"12px",background:P.c2,borderRadius:10,border:`1px solid ${np.isPublic?P.gn+"50":P.bd}`}} onClick={()=>setNp(p=>({...p,isPublic:!p.isPublic}))}>
                <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${np.isPublic?P.gn:P.bd}`,background:np.isPublic?P.gn:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {np.isPublic&&<span style={{color:"#fff",fontSize:11,fontWeight:700,lineHeight:1}}>✓</span>}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:P.tx}}>Share publicly</div>
                  <div style={{fontSize:10,color:P.txD}}>Visible to all Ephemera users</div>
                </div>
              </label>

              <button onClick={submit} disabled={posting||(!np.image&&!np.caption.trim())} style={{width:"100%",padding:"15px",borderRadius:12,border:"none",background:posting||(!np.image&&!np.caption.trim())?P.c3:P.gn,color:posting||(!np.image&&!np.caption.trim())?P.txD:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {posting?"Posting...":"Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
