import {useEffect,useRef} from "react";
import {scClr} from "../../lib/scoring.js";

export default function MapHome({P,rv,riv,beat,cond,topH,cT,cW,cC,cHumidity,mapsLoaded,allRivers,setRiv,setBeat,onFishHere,customRv}){
  const mapRef=useRef(null);
  const mapObj=useRef(null);
  const markersRef=useRef([]);

  useEffect(()=>{
    if(!mapRef.current||!mapsLoaded||!window.google||mapObj.current)return;
    mapObj.current=new window.google.maps.Map(mapRef.current,{
      center:{lat:rv.lat,lng:rv.lng},zoom:10,
      disableDefaultUI:true,zoomControl:true,gestureHandling:"greedy",
      styles:[
        {featureType:"water",stylers:[{color:"#7da8b0"}]},
        {featureType:"landscape.natural",stylers:[{color:"#e8e4d8"}]},
        {featureType:"landscape.man_made",stylers:[{color:"#ddd9cd"}]},
        {featureType:"road",stylers:[{visibility:"simplified"},{color:"#c8c4b8"}]},
        {featureType:"road.highway",stylers:[{visibility:"off"}]},
        {featureType:"poi",stylers:[{visibility:"off"}]},
        {featureType:"transit",stylers:[{visibility:"off"}]},
        {elementType:"labels.text.fill",stylers:[{color:"#4a5c58"}]},
        {elementType:"labels.text.stroke",stylers:[{color:"#f0ede6"}]},
        {featureType:"administrative.locality",elementType:"labels",stylers:[{visibility:"simplified"}]}
      ]
    });
    mapObj.current.addListener("click",(e)=>{
      onFishHere(e.latLng.lat(),e.latLng.lng(),"Custom Location");
    });
  },[mapsLoaded]);

  useEffect(()=>{
    if(!mapObj.current||!window.google)return;
    markersRef.current.forEach(m=>m.setMap(null));
    markersRef.current=[];
    const territory=rv.territory||"uk";
    const rivers=allRivers.filter(r=>(r.territory||"uk")===territory);
    rivers.forEach(r=>{
      const isSel=customRv?r.id==="__custom":r.id===riv;
      const m=new window.google.maps.Marker({
        position:{lat:r.lat,lng:r.lng},map:mapObj.current,title:r.n,
        icon:{
          path:window.google.maps.SymbolPath.CIRCLE,
          scale:isSel?13:r.premium?6:4,
          fillColor:isSel?"#7A9E7E":r.premium?"#C36A3D":"#8A948F",
          fillOpacity:1,strokeColor:"#fff",strokeWeight:isSel?2:1
        },
        zIndex:isSel?10:1
      });
      m.addListener("click",()=>{setRiv(r.id);setBeat(r.b?.[0]||"");mapObj.current.panTo({lat:r.lat,lng:r.lng});});
      markersRef.current.push(m);
    });
    if(customRv){
      const cm=new window.google.maps.Marker({
        position:{lat:customRv.lat,lng:customRv.lng},map:mapObj.current,title:customRv.n,
        icon:{path:window.google.maps.SymbolPath.CIRCLE,scale:13,fillColor:"#7A9E7E",fillOpacity:1,strokeColor:"#fff",strokeWeight:2},
        zIndex:10
      });
      markersRef.current.push(cm);
    }
    mapObj.current.panTo({lat:rv.lat,lng:rv.lng});
  },[riv,mapsLoaded,customRv]);

  const s10=Math.round(cond.pct/10);

  return(
    <div style={{margin:"-14px -14px 0",position:"relative"}}>
      <div ref={mapRef} style={{width:"100%",height:"52vh",minHeight:260}}/>
      {!mapsLoaded&&(
        <div style={{position:"absolute",inset:0,background:P.c2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
          <div style={{fontSize:22}}>🗺</div>
          <div style={{fontSize:12,color:P.txM}}>Map loading...</div>
          <div style={{fontSize:9,color:P.txD}}>Tap anywhere below to see conditions</div>
        </div>
      )}

      {/* Score badge top-right */}
      <div style={{position:"absolute",top:12,right:12,background:"rgba(22,30,27,0.92)",borderRadius:12,padding:"8px 14px",textAlign:"center",backdropFilter:"blur(8px)"}}>
        <div style={{fontSize:32,fontWeight:700,color:cond.clr,lineHeight:1}}>{s10}</div>
        <div style={{fontSize:7,color:"#8A948F",marginTop:1}}>/10 today</div>
      </div>

      {/* Fish Here button top-left */}
      <button onClick={()=>{
        if(navigator.geolocation)navigator.geolocation.getCurrentPosition(
          pos=>onFishHere(pos.coords.latitude,pos.coords.longitude,"My Location"),
          ()=>alert("GPS unavailable — check permissions"),
          {enableHighAccuracy:true,timeout:8000}
        );
        else alert("Location not available on this device.");
      }} style={{position:"absolute",top:12,left:12,background:"rgba(22,30,27,0.92)",border:"none",borderRadius:8,padding:"8px 12px",color:"#DDE1DE",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",backdropFilter:"blur(8px)"}}>
        📍 Fish Here
      </button>

      {/* Conditions strip */}
      <div style={{background:P.c1,borderTop:`1px solid ${P.bd}`,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:P.tx}}>{rv.n}{customRv?" (custom)":""}</div>
            {beat&&<div style={{fontSize:10,color:P.txM}}>{beat}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:10,fontWeight:700,color:cond.clr}}>{cond.label}</div>
            {topH&&topH.score>10&&<div style={{fontSize:9,color:P.txD}}>{topH.cm}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {[{l:"Water",v:`${cT}°C`},{l:"Wind",v:`${cW}mph`},{l:"Cloud",v:`${cC}%`},{l:"Humid",v:`${cHumidity}%`}].map((item,i)=>(
            <div key={i} style={{flex:1,background:P.c2,borderRadius:6,padding:"5px 4px",textAlign:"center"}}>
              <div style={{fontSize:7,color:P.txD,marginBottom:1}}>{item.l}</div>
              <div style={{fontSize:11,fontWeight:600,color:P.tx}}>{item.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
