/* UK hatches */
export const UK_HATCHES=[
  {id:"danica",cm:"Mayfly",cat:"m",t:1,s:135,e:172,tMn:12,tMx:18,pk:[13,14,15,16,17],hk:"10-12 LD",sz:"20-25mm",avgS:139},
  {id:"ldo",cm:"Large Dark Olive",cat:"o",t:2,s:60,e:150,tMn:7,tMx:14,pk:[10,11,12,13],hk:"14-16",sz:"10-12mm"},
  {id:"mo",cm:"Medium Olive",cat:"o",t:3,s:100,e:180,tMn:10,tMx:16,pk:[11,12,13,14],hk:"16",sz:"8-10mm"},
  {id:"bwo",cm:"Blue-winged Olive",cat:"o",t:2,s:150,e:290,tMn:12,tMx:18,pk:[17,18,19,20],hk:"14-16",sz:"9-11mm"},
  {id:"ib",cm:"Iron Blue",cat:"o",t:2,s:105,e:165,tMn:8,tMx:14,pk:[11,12,13,14],hk:"16-18",sz:"6-8mm"},
  {id:"pw",cm:"Pale Watery",cat:"o",t:3,s:125,e:260,tMn:12,tMx:18,pk:[14,15,16,17,18],hk:"16-18",sz:"6-8mm"},
  {id:"gran",cm:"Grannom",cat:"c",t:2,s:100,e:130,tMn:9,tMx:14,pk:[11,12,13,14,15],hk:"14-16",sz:"10-12mm"},
  {id:"sedge",cm:"Sedges",cat:"c",t:2,s:135,e:275,tMn:13,tMx:20,pk:[19,20,21],hk:"12-16",sz:"8-18mm"},
  {id:"haw",cm:"Hawthorn Fly",cat:"t",t:2,s:108,e:135,tMn:10,tMx:16,pk:[11,12,13,14,15,16],hk:"12-14",sz:"12-14mm"},
  {id:"bg",cm:"Black Gnat",cat:"t",t:3,s:120,e:250,tMn:12,tMx:20,pk:[12,13,14,15,16,17],hk:"16-18",sz:"5-8mm"},
  {id:"smut",cm:"Reed Smuts",cat:"t",t:3,s:135,e:270,tMn:13,tMx:20,pk:[10,11,12,13,14,15,16,17],hk:"20-24",sz:"2-4mm"},
  {id:"caen",cm:"Caenis",cat:"o",t:3,s:155,e:250,tMn:15,tMx:20,pk:[5,6,7,19,20,21],hk:"20-22",sz:"3-5mm"},
];

/* USA hatches — northern hemisphere timing */
export const USA_HATCHES=[
  {id:"pmd",cm:"Pale Morning Dun",cat:"o",t:1,s:130,e:220,tMn:10,tMx:17,pk:[9,10,11,14,15],hk:"16-20",sz:"6-9mm"},
  {id:"greendrak",cm:"Green Drake",cat:"o",t:1,s:145,e:185,tMn:11,tMx:17,pk:[13,14,15,16,17],hk:"10-12",sz:"16-20mm"},
  {id:"browndrak",cm:"Brown Drake",cat:"o",t:1,s:148,e:178,tMn:14,tMx:20,pk:[20,21],hk:"10-12",sz:"14-18mm"},
  {id:"trico",cm:"Trico",cat:"o",t:2,s:170,e:255,tMn:16,tMx:22,pk:[7,8,9],hk:"22-26",sz:"3-6mm"},
  {id:"sulfur",cm:"Sulfur",cat:"o",t:2,s:128,e:205,tMn:12,tMx:19,pk:[18,19,20],hk:"14-18",sz:"8-12mm"},
  {id:"usbwo",cm:"Blue-winged Olive",cat:"o",t:2,s:75,e:155,tMn:7,tMx:14,pk:[11,12,13,14],hk:"18-22",sz:"4-7mm"},
  {id:"usmarchbrown",cm:"March Brown",cat:"o",t:2,s:90,e:145,tMn:9,tMx:15,pk:[12,13,14,15],hk:"12-14",sz:"10-14mm"},
  {id:"uscaddis",cm:"Caddis",cat:"c",t:2,s:100,e:255,tMn:10,tMx:20,pk:[18,19,20,21],hk:"12-16",sz:"8-16mm"},
  {id:"stonefly",cm:"Stonefly (Small)",cat:"c",t:2,s:55,e:155,tMn:4,tMx:12,pk:[10,11,12,13],hk:"12-16",sz:"8-20mm"},
  {id:"salmonfly",cm:"Salmonfly",cat:"c",t:1,s:118,e:165,tMn:9,tMx:16,pk:[11,12,13,14],hk:"4-8",sz:"35-50mm"},
  {id:"goldenstone",cm:"Golden Stonefly",cat:"c",t:1,s:128,e:185,tMn:12,tMx:18,pk:[13,14,15,16],hk:"8-12",sz:"20-30mm"},
  {id:"callibaetis",cm:"Callibaetis",cat:"o",t:2,s:145,e:265,tMn:13,tMx:20,pk:[10,11,12,13],hk:"14-18",sz:"8-12mm"},
  {id:"hex",cm:"Hexagenia",cat:"o",t:1,s:160,e:198,tMn:18,tMx:24,pk:[21,22],hk:"4-8",sz:"25-40mm"},
  {id:"isonychia",cm:"Isonychia",cat:"o",t:2,s:140,e:205,tMn:12,tMx:18,pk:[17,18,19,20],hk:"10-14",sz:"12-18mm"},
];

/* NZ hatches — season windows calibrated to southern hemisphere:
   when it's UK June-August (DOY 152-243), NZ is in its December-February summer fishing peak */
export const NZ_HATCHES=[
  {id:"deleatidium",cm:"Deleatidium (NZ Mayfly)",cat:"m",t:1,s:155,e:245,tMn:10,tMx:18,pk:[11,12,13,14,15],hk:"14-18",sz:"8-14mm"},
  {id:"nzcaddis",cm:"NZ Caddis",cat:"c",t:2,s:145,e:265,tMn:10,tMx:18,pk:[18,19,20,21],hk:"12-16",sz:"8-16mm"},
  {id:"nzolive",cm:"NZ Olive Dun",cat:"o",t:2,s:135,e:255,tMn:9,tMx:17,pk:[11,12,13,14],hk:"14-18",sz:"7-11mm"},
];

export function getHatches(territory){
  if(territory==="usa")return USA_HATCHES;
  if(territory==="nz")return NZ_HATCHES;
  return UK_HATCHES;
}

/* FLYMAP: hatch id → recommended pattern */
export const FLYMAP={
  /* UK */
  danica:"Grey Wulff #12",ldo:"Kite's Imperial #16",mo:"Adams #16",bwo:"Sherry Spinner #14",
  ib:"Iron Blue Dun #18",pw:"Last Hope #18",gran:"Grannom Pupa #14",sedge:"Elk Hair Caddis #14",
  haw:"Hawthorn #12",bg:"Black Gnat #16",smut:"Griffith's Gnat #22",caen:"Last Hope #20",
  /* USA */
  pmd:"PMD Sparkle Dun #18",greendrak:"Paradrake #12",browndrak:"Brown Drake Comparadun #12",
  trico:"Trico Spinner #22",sulfur:"Sulfur CDC Emerger #16",usbwo:"Parachute BWO #18",
  usmarchbrown:"March Brown Comparadun #14",uscaddis:"Elk Hair Caddis #14",
  stonefly:"Pat's Rubber Legs #8",salmonfly:"Chubby Chernobyl #6",
  goldenstone:"Yellow Stimulator #10",callibaetis:"Callibaetis Parachute #16",
  hex:"Hex Paradrake #6",isonychia:"Isonychia Comparadun #12",
  /* NZ */
  deleatidium:"Elk Hair Caddis #14",nzcaddis:"Soft Hackle Pupa #14",nzolive:"Parachute Adams #16",
};

export const FLYCONF={
  danica:"high confidence",ldo:"high confidence",mo:"good match",bwo:"evening essential",
  ib:"cold weather pick",pw:"search pattern",gran:"seasonal",sedge:"evening only",
  haw:"opportunistic",bg:"search pattern",smut:"last resort",caen:"early/late only",
  pmd:"morning essential",greendrak:"afternoon hatch",browndrak:"evening only",trico:"early morning",
  sulfur:"evening essential",usbwo:"overcast key",usmarchbrown:"spring staple",uscaddis:"versatile",
  stonefly:"subsurface",salmonfly:"big fly time",goldenstone:"summer standard",callibaetis:"stillwater",
  hex:"evening only",isonychia:"evening",deleatidium:"NZ staple",nzcaddis:"evening",nzolive:"versatile",
};

export const CC={m:"#C36A3D",o:"#7A9E7E",c:"#8B7355",t:"#5F6F7B"};
