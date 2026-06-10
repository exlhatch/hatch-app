export const DOY=Math.floor((new Date()-new Date(new Date().getFullYear(),0,0))/864e5);
export const HOUR=new Date().getHours();
export const isNight=HOUR<5||HOUR>=22;

export function simT(lat,territory){
  if(territory==="nz"){
    // Southern hemisphere: peak in December (DOY ~355)
    return+(8+7*Math.sin((DOY-263)*Math.PI/183)+(Math.abs(lat)-45)*-0.5).toFixed(1);
  }
  return+(6+8*Math.sin((DOY-80)*Math.PI/183)+(lat-51)*-0.8).toFixed(1);
}

export const scClr=s=>s>=75?"#7A9E7E":s>=55?"#C36A3D":s>=35?"#8A948F":"#5F6F7B";
export const scLb=s=>s>=90?"Exceptional":s>=75?"Excellent":s>=55?"Good":s>=35?"Fair":"Poor";
export const hC=s=>s>70?"#7A9E7E":s>40?"#C36A3D":s>15?"#8A948F":"#5F6F7B";
export const windDir=d=>{const dirs=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];return dirs[Math.round(d/22.5)%16]};

/* pred: score each hatch species for today */
export function pred(H,wt){return H.map(sp=>{let sF=0;const inS=sp.e<sp.s?DOY>=sp.s||DOY<=sp.e:DOY>=sp.s&&DOY<=sp.e;const preS=sp.e<sp.s?(DOY>=(sp.s-14)&&DOY<sp.s):(DOY>=sp.s-14&&DOY<sp.s);if(inS){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=sp.e<sp.s?1:Math.max(0,1-((DOY-m)/r)**2)}else if(preS)sF=(DOY-sp.s+14)/28;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(wt>=sp.tMn&&wt<=sp.tMx)tF=Math.max(0,1-((wt-tm)/(tr*1.2))**2);else if(wt>=sp.tMn-2)tF=Math.max(0,(wt-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score)}

export function hInt(H,wt,hr){if(hr<5||hr>=22)return 0;let hi=0;H.forEach(sp=>{const inS=sp.e<sp.s?DOY>=sp.s||DOY<=sp.e:DOY>=sp.s&&DOY<=sp.e;if(!inS&&(DOY<sp.s-10))return;let sf=0;if(inS){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sf=sp.e<sp.s?1:Math.max(0,1-((DOY-m)/r)**2)}const hf=sp.pk.includes(hr)?1:sp.pk.includes(hr-1)||sp.pk.includes(hr+1)?0.4:0.05;let tf=0;if(wt>=sp.tMn&&wt<=sp.tMx){const tm=(sp.tMn+sp.tMx)/2;tf=Math.max(0,1-((wt-tm)/((sp.tMx-sp.tMn)/2*1.3))**2)}hi+=Math.max(0,sf*hf*tf*(sp.t===1?3:sp.t===2?1.5:0.8))});return Math.min(10,Math.max(0,hi))}

export function hatchesAtHr(H,wt,hr){return H.filter(sp=>{const inS=sp.e<sp.s?DOY>=sp.s||DOY<=sp.e:DOY>=sp.s&&DOY<=sp.e;if(!inS&&DOY<sp.s-7)return false;if(!sp.pk.includes(hr)&&!sp.pk.includes(hr-1)&&!sp.pk.includes(hr+1))return false;return wt>=sp.tMn-2&&wt<=sp.tMx+2}).sort((a,b)=>b.t-a.t).slice(0,3)}

export function condScore(H,wind,press,cloud,wt,hIdx,rq,bq){
  if(isNight)return{pct:0,label:"Night",clr:"#5F6F7B",why:"No fishing activity at night."};
  let s=0;const why=[];
  const hp=Math.min(30,hIdx*0.30);s+=hp;
  if(hIdx>60)why.push("strong hatch activity");else if(hIdx>30)why.push("moderate hatches");else why.push("limited hatches");
  if(wt>=13&&wt<=17){s+=18;why.push("ideal water temp")}else if(wt>=11&&wt<=19)s+=13;else{s+=6;why.push("cool water")}
  if(cloud>70){s+=12;why.push("overcast")}else if(cloud>50)s+=9;else if(cloud>30)s+=6;else{s+=3;why.push("bright")}
  if(press<1008){s+=10;why.push("low pressure")}else if(press<1015)s+=8;else if(press<1022)s+=6;else s+=3;
  if(wind>=3&&wind<=10)s+=15;else if(wind<3)s+=10;else if(wind<=14)s+=9;else if(wind<=18){s+=5;why.push("windy")}else{s+=2;why.push("gale")}
  const avgQ=((rq||5)+(bq||rq||5))/2;s+=Math.round(avgQ*1.5);
  const pct=Math.round(Math.min(100,Math.max(0,s)));
  const pos=why.filter(r=>!["limited hatches","cool water","bright","windy","gale"].includes(r));
  const neg=why.filter(r=>["limited hatches","cool water","bright","windy","gale"].includes(r));
  let txt=pos.length?pos.slice(0,2).join(", "):"Mixed conditions";
  if(neg.length)txt+=" but "+neg[0];
  return{pct,label:scLb(pct),clr:scClr(pct),why:txt.charAt(0).toUpperCase()+txt.slice(1)+"."};
}

export function danSt(wt){const as=139;if(DOY>172)return{s:"Season ended",c:"#5F6F7B"};if(DOY>as+14&&wt>=12)return{s:"On the water",c:"#C36A3D"};if(DOY>as&&wt>=12)return{s:"Underway",c:"#C36A3D"};if(DOY>as-7&&wt>=11)return{s:"On time",c:"#7A9E7E"};if(DOY>as-7)return{s:"Late",c:"#5F6F7B"};if(DOY>as-14&&wt>=13)return{s:"Early",c:"#C36A3D"};if(DOY>as-14)return{s:"Days away",c:"#8A948F"};return{s:"Not yet",c:"#5F6F7B"}}

export function whatChanged(H,wind,press,cloud,wt,hIdx,rq,bq){
  const t=condScore(H,wind,press,cloud,wt,hIdx,rq,bq);
  const sd=(DOY*137+Math.round(wt*10))%100/100;
  const sd2=(DOY*251+Math.round(wind*10))%100/100;
  const yWt=+(wt-0.3+sd*0.6).toFixed(1);const yWind=Math.max(1,wind+Math.round((sd-0.5)*6));
  const yCloud=Math.min(100,Math.max(0,cloud+Math.round((sd2-0.5)*30)));const yPress=press+Math.round((sd-0.5)*6);
  const yHi=Math.max(0,hIdx+(sd2-0.5)*15);
  const y=condScore(H,yWind,yPress,yCloud,yWt,yHi,rq,bq);
  const d=t.pct-y.pct;if(Math.abs(d)<3)return null;
  const reasons=[];
  if(wind<yWind-3)reasons.push("dropping wind");else if(wind>yWind+3)reasons.push("rising wind");
  if(cloud>yCloud+15)reasons.push("more cloud");else if(cloud<yCloud-15)reasons.push("less cloud");
  if(wt>yWt+0.3)reasons.push("warmer water");else if(wt<yWt-0.3)reasons.push("cooler water");
  if(press<yPress-3)reasons.push("falling pressure");
  const cause=reasons.length?` — ${reasons.slice(0,2).join(" and ")}`:"";
  return{d,txt:`${d>0?"+":""}${d}% vs yesterday${cause}`};
}

export function buildTimeline(H,hrs,wt){
  if(!hrs||!hrs.length)return[];
  return[7,9,11,13,15,17,19].map(hr=>{
    const hd=hrs.find(h=>h.h===hr);if(!hd)return null;
    const hi=hInt(H,hd.wt||wt,hr);const hatches=hatchesAtHr(H,hd.wt||wt,hr);
    let note;
    if(hr<=8)note=hi<1?"Cold. Little activity yet.":hi>=2?"Warming up. Early risers possible.":"First signs of life.";
    else if(hr<=10)note=hi>=3?"Olives hatching. Fish looking up.":hi>=1?"Building slowly. Watch for the first rises.":"Still quiet. Nymph or wait.";
    else if(hr<=12)note=hi>=5?"Strong hatch. Fish rising freely.":hi>=3?"Steady hatch developing. Good sport.":hi>=1?"Sparse activity. Pick your spots.":"Quiet. Nymph the runs.";
    else if(hr<=14)note=hi>=6?"Peak window. Best of the day.":hi>=3?"Good activity continuing.":"Lull. Try emergers in the film.";
    else if(hr<=16)note=hi>=3?"Afternoon hatch holding up.":hi>=1?"Activity fading. Fish becoming selective.":"Afternoon lull. Rest the water.";
    else if(hr<=18)note=hi>=2?"Late activity. BWO possible. Watch for spinner falls.":"Waiting for the evening rise. Spinner falls can start any time.";
    else note=hi>=3?"Evening rise underway. Spinner falls — fish sipping spent flies in the film.":hi>=1?"Sedge chance if warm enough. Try skating an Elk Hair Caddis.":"Cooling off. Day winding down.";
    return{hr,note,hatches:hatches.map(h=>h.cm),hi};
  }).filter(Boolean);
}

export function nowWindow(timeline){
  if(!timeline||!timeline.length)return null;
  const hr=new Date().getHours();
  const cur=timeline.find(e=>Math.abs(e.hr-hr)<=1)||timeline.find(e=>e.hr<=hr+2&&e.hr>=hr-1)||timeline[0];
  const nxt=timeline.find(e=>e.hr>=(cur?cur.hr:0)+2);
  return{cur:cur||null,nxt:nxt||null};
}

export function buildAntic(cW,cC,cP,wt,spp){
  const n=[];
  if(cC>60&&wt>=11)n.push("Overcast skies should encourage hatches through midday.");
  else if(cC<30&&wt>=12)n.push("Bright conditions — fish the shade or wait for evening.");
  if(cP<1010)n.push("Low pressure dropping. Fish often feed harder before fronts.");
  if(cW>14)n.push("Wind dropping later could improve dry fly presentation.");
  const dan=spp.find(s=>s.id==="danica");
  if(dan&&dan.score>15){n.push("Mayfly most likely from early afternoon. Watch for spinner falls from 7pm — fish sipping spent flies in the film.");if(wt>=14)n.push("Warm enough for a strong hatch. Emergers first, then switch to a Grey Wulff when duns appear.")}
  if(wt>=12&&spp.find(s=>s.id==="bwo"&&s.score>20))n.push("BWO possible from late afternoon. Evening spinner fall can produce the best fishing of the day.");
  if(wt>=13&&spp.find(s=>s.id==="sedge"&&s.score>15))n.push("Evening sedge activity likely if it stays warm. Elk Hair Caddis skated on the surface.");
  if(cW>12&&wt>=12)n.push("Wind will blow terrestrials onto the water — try ants and beetles on the lee bank.");
  if(wt<11)n.push("Water still cool. Nymphing will outperform dries until it warms.");
  if(!n.length)n.push("Conditions settled. Fish the hatches as they come.");
  return n.slice(0,4);
}

export function genLR(wt){const now=new Date();return Array.from({length:8},(_,w)=>{const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);const md=DOY+w*7+3,pt=+(wt+w*0.4+Math.sin((md-80)*Math.PI/183)*1.5).toFixed(1);let ds=0;if(md>=125&&md<=182)ds=Math.max(0,1-((md-153)/28)**2)*(pt>=12&&pt<=18?1:pt>=10?0.5:0.2);return{l:w===0?"This week":w===1?"Next week":`${s.toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("en-GB",{day:"numeric",month:"short"})}`,pt,ds:+(ds*100).toFixed(0),cf:w<2?"High":w<4?"Med":"Low"}})}

export function futureDayGuide(H,FLYMAP,dayData,dayIdx,wt,rv,beat,method){
  if(!dayData||!dayData.hrs||!dayData.hrs.length)return null;
  const futDoy=DOY+dayIdx;
  const futSpp=H.map(sp=>{let sF=0;const inS=sp.e<sp.s?(futDoy>=sp.s||futDoy<=sp.e):(futDoy>=sp.s&&futDoy<=sp.e);if(inS){const m=(sp.s+sp.e)/2,r=(sp.e-sp.s)/2;sF=sp.e<sp.s?1:Math.max(0,1-((futDoy-m)/r)**2)}else if(futDoy>=sp.s-14&&futDoy<sp.s)sF=(futDoy-sp.s+14)/28;const avgT=dayData.hrs.reduce((s,h)=>s+(h.wt||wt),0)/dayData.hrs.length;let tF=0;const tm=(sp.tMn+sp.tMx)/2,tr=(sp.tMx-sp.tMn)/2;if(avgT>=sp.tMn&&avgT<=sp.tMx)tF=Math.max(0,1-((avgT-tm)/(tr*1.2))**2);else if(avgT>=sp.tMn-2)tF=Math.max(0,(avgT-sp.tMn+2)/4);const sc=Math.round(Math.max(0,Math.min(100,(sF*0.55+tF*0.35)*100)));return{...sp,score:sc,lb:sc>70?"Strong":sc>40?"Moderate":sc>15?"Sparse":"Unlikely"}}).sort((a,b)=>b.score-a.score);
  const topH=futSpp[0];
  const midHrs=dayData.hrs.filter(h=>h.h>=10&&h.h<=16);
  const avgWind=midHrs.length?Math.round(midHrs.reduce((s,h)=>s+(h.ws||5),0)/midHrs.length):8;
  const avgCloud=midHrs.length?Math.round(midHrs.reduce((s,h)=>s+(h.cl||50),0)/midHrs.length):50;
  const avgWt=midHrs.length?+(midHrs.reduce((s,h)=>s+(h.wt||wt),0)/midHrs.length).toFixed(1):wt;
  const rig=buildRig(avgWt,avgWind,avgCloud,method,topH);
  const tl=buildTimeline(H,dayData.hrs,wt);
  const antic=buildAntic(avgWind,avgCloud,1013,avgWt,futSpp);
  const bestHr=tl.reduce((best,e)=>e.hi>best.hi?e:best,{hi:0,hr:0,note:""});
  return{futSpp,topH,avgWind,avgCloud,avgWt,rig,tl,antic,bestHr};
}

export function buildRig(wt,wind,cloud,method,topH){
  const warm=wt>=12,oc=cloud>60,wd=wind>12;
  const fly=topH?`${topH.cm} — ${topH.hk}`:"Match the hatch";
  if(method==="dry"){
    if(warm&&oc)return{a:"Single dry to risers. Watch and wait.",rod:"9ft 4wt",ldr:"12-15ft degreased",tip:"5X-6X",fly,guide:"Position below. One accurate cast. Don't rush the first fish.",c:85,why:"Classic dry fly conditions."};
    if(wd)return{a:"Terrestrials on the lee bank",rod:"9ft 5wt",ldr:"9ft",tip:"4X-5X",fly:"Hawthorn #12 or Black Gnat #14",guide:"Wind pushes food to sheltered side. Short casts, tight loops.",c:75,why:"Wind ripple gives cover."};
    if(wt>=14&&cloud<30)return{a:"Target shaded weed lines",rod:"9ft 4wt",ldr:"15ft, mud last 3ft",tip:"6X-7X",fly:"CDC Shuttlecock #18 or Last Hope",guide:"Fish holding in shade. Approach from downstream, kneel.",c:60,why:"Bright and warm. Shade is everything."};
    return{a:"Fine and far off. Stealth fishing.",rod:"9ft 4wt",ldr:"14-16ft, mud last 3ft",tip:"6X",fly:"CDC or Last Hope #18",guide:"Go fine. Go long. Wait for evening if needed.",c:65,why:"Tough conditions demand patience."};
  }
  if(method==="drynymph"){
    if(warm&&oc)return{a:"Dry first. Nymph the quiet stretches.",rod:"9ft 4-5wt",ldr:"12ft",tip:"5X nylon / fluoro",fly:`Dry: ${fly}. Nymph: PTN #16`,guide:"Surface first when cloud thickens. Switch when it clears.",c:82,why:"Best of both."};
    if(wt<11)return{a:"Shallow nymph under cover",rod:"9-10ft 4-5wt",ldr:"10-12ft",tip:"5X fluoro",fly:"PTN #16 weighted. Dry: Klinkhamer spare.",guide:"Tick the gravel. Induced take through weed channels.",c:78,why:"Cool water. Fish deep."};
    return{a:"Upstream nymph, dry in the pocket",rod:"9-10ft 4-5wt",ldr:"10-12ft",tip:"5X fluoro",fly:"PTN #16. Klinkhamer ready.",guide:"Dead drift nymph. Switch the moment you see rises.",c:78,why:"Nymph covers water."};
  }
  if(warm&&oc)return{a:"Dry fly — don't go subsurface too early",rod:"9ft 4-5wt",ldr:"12ft",tip:"5X",fly,guide:"Ideal conditions. Klink+PTN dropper if nothing shows in 20 min.",c:85,why:"Prime dry fly conditions."};
  if(warm&&!oc)return{a:"Klinkhamer + nymph dropper through the runs",rod:"9ft 5wt",ldr:"9-12ft",tip:"5X, 18in fluoro dropper",fly:"Klinkhamer #14 + PTN #16",guide:"Covers surface and bottom. Adjust dropper depth for each pool.",c:80,why:"Mixed. Dropper covers both."};
  if(wd&&wt>=11)return{a:"Streamer along the margins if cloud builds",rod:"9ft 6wt",ldr:"9ft",tip:"4X fluoro",fly:"Woolly Bugger #8 or Minkie",guide:"Strip slow along undercuts. Aggressive takes in coloured water.",c:70,why:"Wind + cloud = predator mode."};
  return{a:"Euro nymph — fish the bottom, seams and gravel",rod:"10ft 3-4wt",ldr:"20ft fluoro",tip:"5X-6X",fly:"Jig #14 + PTN #16",guide:"Short line, high rod. Work every seam systematically.",c:78,why:"Cool water. Subsurface first."};
}

export function fmtDur(ms){const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60);if(h>0)return`${h}h ${m%60}m`;return`${m}m`}
