import { useState, useMemo, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   E P H E M E R A  —  v3.0
   Timely Insight. Better Days.
   Premium fly fishing intelligence — 64 UK trout rivers
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══ PALETTE ═══ */
const C={
  bg:"#141A14",c1:"#1A221A",c2:"#202A20",c3:"#283228",
  bd:"#2E3E2E",bdL:"#3A4E3A",
  tx:"#DDE1DE",txM:"#8A948F",txD:"#5F6F7B",
  rust:"#C36A3D",rustDim:"rgba(195,106,61,0.15)",rustGlow:"rgba(195,106,61,0.3)",
  grn:"#5A9E6F",grnDim:"rgba(90,158,111,0.15)",
  warn:"#D4A843",warnDim:"rgba(212,168,67,0.12)",
  hi:"#C75B4A",
  fog:"#DDE1DE",bone:"#F3F0E8",
  bar:{strong:"#C36A3D",mod:"#D4A843",sparse:"#5A9E6F",off:"#3A4A3A"},
};
const ff="'Barlow',sans-serif";

/* ═══ BRAND MARK ═══ */
const Mark=({s=32})=>(
<svg width={s} height={s} viewBox="0 0 48 48" fill="none">
  <path d="M24 4C24 4 14 14 14 25C14 32 18 36 24 37C30 36 34 32 34 25C34 14 24 4 24 4Z" stroke={C.fog} strokeWidth="1.6" strokeLinejoin="round"/>
  <path d="M24 10L24 34" stroke={C.fog} strokeWidth="0.5" opacity="0.3"/>
  <path d="M20 18Q24 15 28 18" stroke={C.fog} strokeWidth="0.5" opacity="0.25"/>
  <path d="M18 23Q24 19 30 23" stroke={C.fog} strokeWidth="0.5" opacity="0.25"/>
  <path d="M17 28Q24 24 31 28" stroke={C.fog} strokeWidth="0.5" opacity="0.2"/>
  <path d="M10 40Q17 38.5 24 40Q31 38.5 38 40" stroke={C.fog} strokeWidth="1" opacity="0.35" fill="none"/>
  <path d="M12 43Q18 41.5 24 43Q30 41.5 36 43" stroke={C.fog} strokeWidth="0.8" opacity="0.25" fill="none"/>
  <path d="M14 46Q19 44.5 24 46Q29 44.5 34 46" stroke={C.rust} strokeWidth="0.9" opacity="0.75" fill="none"/>
</svg>);

/* ═══ REGIONS ═══ */
const REGS={chalk:"Hampshire Chalkstreams",chalk2:"Other Chalkstreams",west:"West Country",wales:"Wales",peak:"Peak District",yorks:"Yorkshire",ne:"North East",nw:"North West",scot:"Scotland",mid:"Midlands"};
const REG_ORDER=["chalk","chalk2","west","wales","peak","yorks","ne","nw","scot","mid"];
const RTYPES={chalk:"Chalkstream",lime:"Limestone",spate:"Spate",free:"Freestone"};

/* ═══ RIVER DATABASE — 64 UK trout rivers ═══ */
const RV=[
{id:"test",n:"River Test",rg:"chalk",rt:"chalk",lat:51.09,lng:-1.49,ea:"3400TH",d:"The birthplace of dry fly fishing.",a:[{n:"Upper Test, nr Whitchurch",la:51.225,lo:-1.337},{n:"Longparish",la:51.178,lo:-1.401},{n:"Stockbridge",la:51.089,lo:-1.494},{n:"Leckford",la:51.112,lo:-1.478},{n:"Horsebridge",la:51.078,lo:-1.533},{n:"Mottisfont",la:51.057,lo:-1.533},{n:"Broadlands, nr Romsey",la:50.988,lo:-1.499}]},
{id:"itchen",n:"River Itchen",rg:"chalk",rt:"chalk",lat:51.06,lng:-1.30,ea:"2682TH",d:"Premier technical chalkstream. Cathedral water.",a:[{n:"Ovington",la:51.09,lo:-1.19},{n:"Itchen Abbas",la:51.09,lo:-1.24},{n:"Easton",la:51.08,lo:-1.27},{n:"Martyr Worthy",la:51.08,lo:-1.29},{n:"Winchester",la:51.06,lo:-1.32},{n:"Twyford",la:51.02,lo:-1.33}]},
{id:"kennet",n:"River Kennet",rg:"chalk",rt:"chalk",lat:51.41,lng:-1.48,ea:"2641TH",d:"Marlborough to Reading. Prolific grayling.",a:[{n:"Upper Kennet, nr Marlborough",la:51.42,lo:-1.73},{n:"Ramsbury",la:51.44,lo:-1.60},{n:"Hungerford",la:51.41,lo:-1.51},{n:"Kintbury",la:51.40,lo:-1.44},{n:"Newbury",la:51.40,lo:-1.32}]},
{id:"anton",n:"River Anton",rg:"chalk",rt:"chalk",lat:51.21,lng:-1.47,ea:"3401TH",d:"Intimate Hampshire chalk tributary.",a:[{n:"Andover",la:51.21,lo:-1.49},{n:"Goodworth Clatford",la:51.18,lo:-1.48}]},
{id:"avon_h",n:"Hampshire Avon",rg:"chalk",rt:"chalk",lat:51.08,lng:-1.78,ea:"2504TH",d:"Wide, powerful chalk. Grayling and trout.",a:[{n:"Amesbury",la:51.17,lo:-1.78},{n:"Salisbury",la:51.06,lo:-1.80},{n:"Downton",la:51.00,lo:-1.74},{n:"Fordingbridge",la:50.93,lo:-1.79}]},
{id:"wylye",n:"River Wylye",rg:"chalk",rt:"chalk",lat:51.12,lng:-2.02,ea:"2505TH",d:"Quiet Wiltshire chalk through meadows.",a:[{n:"Warminster",la:51.21,lo:-2.18},{n:"Heytesbury",la:51.20,lo:-2.09},{n:"Wylye village",la:51.15,lo:-2.00},{n:"Wilton",la:51.08,lo:-1.86}]},
{id:"lambourn",n:"River Lambourn",rg:"chalk2",rt:"chalk",lat:51.45,lng:-1.52,ea:"2642TH",d:"Pristine Berkshire chalk. Crystal clear.",a:[{n:"Upper Lambourn",la:51.52,lo:-1.53},{n:"Lambourn village",la:51.51,lo:-1.53},{n:"Great Shefford",la:51.46,lo:-1.50}]},
{id:"dever",n:"River Dever",rg:"chalk2",rt:"chalk",lat:51.17,lng:-1.36,ea:"3401TH",d:"Tiny chalk jewel. Test tributary.",a:[{n:"Bullington",la:51.18,lo:-1.36},{n:"Wonston",la:51.14,lo:-1.38}]},
{id:"ebble",n:"River Ebble",rg:"chalk2",rt:"chalk",lat:51.02,lng:-1.90,ea:"2506TH",d:"Small unspoilt Wiltshire chalk.",a:[{n:"Broad Chalke",la:51.03,lo:-1.96},{n:"Bishopstone",la:51.04,lo:-1.89}]},
{id:"nadder",n:"River Nadder",rg:"chalk2",rt:"chalk",lat:51.08,lng:-2.05,ea:"2507TH",d:"Wiltshire chalk through Tisbury.",a:[{n:"Tisbury",la:51.06,lo:-2.08},{n:"Fovant",la:51.06,lo:-1.99},{n:"Wilton",la:51.08,lo:-1.86}]},
{id:"piddle",n:"River Piddle",rg:"chalk2",rt:"chalk",lat:50.73,lng:-2.19,ea:"2803TH",d:"Dorset chalkstream. Wild browns.",a:[{n:"Piddletrenthide",la:50.80,lo:-2.36},{n:"Puddletown",la:50.72,lo:-2.29},{n:"Tolpuddle",la:50.74,lo:-2.24}]},
{id:"mimram",n:"River Mimram",rg:"chalk2",rt:"chalk",lat:51.82,lng:-0.20,ea:"2280TH",d:"Hertfordshire chalk spring.",a:[{n:"Whitwell",la:51.85,lo:-0.24},{n:"Welwyn",la:51.83,lo:-0.21}]},
{id:"chess",n:"River Chess",rg:"chalk2",rt:"chalk",lat:51.66,lng:-0.53,ea:"2211TH",d:"Chilterns chalkstream. Short but characterful.",a:[{n:"Chesham",la:51.71,lo:-0.61},{n:"Latimer",la:51.68,lo:-0.55},{n:"Rickmansworth",la:51.64,lo:-0.47}]},
{id:"darent",n:"River Darent",rg:"chalk2",rt:"chalk",lat:51.37,lng:0.17,ea:"2109TH",d:"Kent's only true chalkstream.",a:[{n:"Westerham",la:51.27,lo:0.07},{n:"Shoreham",la:51.33,lo:0.18},{n:"Eynsford",la:51.37,lo:0.21}]},
{id:"exe",n:"River Exe",rg:"west",rt:"spate",lat:50.87,lng:-3.40,ea:"4502TH",d:"Classic Devon spate. Salmon and sea trout.",a:[{n:"Exmoor headwaters",la:51.10,lo:-3.55},{n:"Exebridge",la:50.99,lo:-3.50},{n:"Tiverton",la:50.90,lo:-3.49},{n:"Bickleigh",la:50.78,lo:-3.49}]},
{id:"dart",n:"River Dart",rg:"west",rt:"spate",lat:50.50,lng:-3.72,ea:"4602TH",d:"Dartmoor spate. Boulder-strewn pockets.",a:[{n:"Dartmeet",la:50.53,lo:-3.82},{n:"Holne",la:50.52,lo:-3.78},{n:"Buckfastleigh",la:50.48,lo:-3.77},{n:"Totnes",la:50.43,lo:-3.68}]},
{id:"tamar",n:"River Tamar",rg:"west",rt:"spate",lat:50.62,lng:-4.24,ea:"4803TH",d:"Devon-Cornwall border. Sea trout legendary.",a:[{n:"nr Bude",la:50.82,lo:-4.41},{n:"Launceston",la:50.64,lo:-4.36},{n:"Gunnislake",la:50.53,lo:-4.22}]},
{id:"torridge",n:"River Torridge",rg:"west",rt:"spate",lat:50.95,lng:-4.15,ea:"4507TH",d:"North Devon. Tarka country.",a:[{n:"Hatherleigh",la:50.82,lo:-4.06},{n:"Torrington",la:50.95,lo:-4.14},{n:"Bideford",la:51.02,lo:-4.21}]},
{id:"taw",n:"River Taw",rg:"west",rt:"spate",lat:50.95,lng:-3.80,ea:"4508TH",d:"Exmoor to Barnstaple.",a:[{n:"South Molton",la:51.01,lo:-3.83},{n:"Umberleigh",la:50.97,lo:-3.86},{n:"Barnstaple",la:51.08,lo:-4.06}]},
{id:"barle",n:"River Barle",rg:"west",rt:"spate",lat:51.07,lng:-3.60,ea:"4503TH",d:"Exmoor gem. Tumbling moorland.",a:[{n:"Simonsbath",la:51.14,lo:-3.77},{n:"Withypool",la:51.10,lo:-3.68},{n:"Dulverton",la:51.04,lo:-3.55}]},
{id:"lyn",n:"River Lyn",rg:"west",rt:"spate",lat:51.22,lng:-3.82,ea:"4509TH",d:"Dramatic Exmoor gorge fishing.",a:[{n:"Watersmeet",la:51.22,lo:-3.79},{n:"Lynmouth",la:51.23,lo:-3.83}]},
{id:"camel",n:"River Camel",rg:"west",rt:"spate",lat:50.54,lng:-4.82,ea:"4902TH",d:"North Cornwall. Bodmin Moor headwaters.",a:[{n:"Camelford",la:50.62,lo:-4.68},{n:"Dunmere",la:50.50,lo:-4.76},{n:"Wadebridge",la:50.51,lo:-4.83}]},
{id:"usk",n:"River Usk",rg:"wales",rt:"free",lat:51.80,lng:-3.10,ea:"5604TH",d:"Premier Welsh trout and salmon river.",a:[{n:"Sennybridge",la:51.95,lo:-3.58},{n:"Brecon",la:51.95,lo:-3.40},{n:"Crickhowell",la:51.86,lo:-3.14},{n:"Abergavenny",la:51.82,lo:-3.02},{n:"Usk town",la:51.70,lo:-2.90}]},
{id:"wye",n:"River Wye",rg:"wales",rt:"free",lat:51.90,lng:-2.90,ea:"5504TH",d:"One of the great UK rivers.",a:[{n:"Rhayader",la:52.30,lo:-3.52},{n:"Builth Wells",la:52.15,lo:-3.40},{n:"Hay-on-Wye",la:52.07,lo:-3.12},{n:"Hereford",la:52.05,lo:-2.72},{n:"Ross-on-Wye",la:51.91,lo:-2.58},{n:"Monmouth",la:51.81,lo:-2.72}]},
{id:"dee_w",n:"River Dee (Wales)",rg:"wales",rt:"spate",lat:53.00,lng:-3.30,ea:"6702TH",d:"Bala to Chester. Grayling stronghold.",a:[{n:"Bala",la:52.91,lo:-3.60},{n:"Corwen",la:52.98,lo:-3.38},{n:"Llangollen",la:52.97,lo:-3.17},{n:"Bangor-on-Dee",la:52.94,lo:-2.94}]},
{id:"teifi",n:"River Teifi",rg:"wales",rt:"spate",lat:52.10,lng:-4.40,ea:"6004TH",d:"Wild Welsh spate. Sea trout from June.",a:[{n:"Tregaron",la:52.22,lo:-3.93},{n:"Lampeter",la:52.11,lo:-4.08},{n:"Llandysul",la:52.04,lo:-4.29},{n:"Newcastle Emlyn",la:52.04,lo:-4.47},{n:"Cenarth",la:52.05,lo:-4.54}]},
{id:"towy",n:"River Towy",rg:"wales",rt:"spate",lat:51.88,lng:-3.90,ea:"5906TH",d:"Longest river in Wales.",a:[{n:"Llandovery",la:51.99,lo:-3.80},{n:"Llandeilo",la:51.88,lo:-3.98},{n:"Carmarthen",la:51.85,lo:-4.31}]},
{id:"cothi",n:"River Cothi",rg:"wales",rt:"spate",lat:51.95,lng:-3.93,ea:"5907TH",d:"Beautiful Towy tributary.",a:[{n:"Pumsaint",la:52.01,lo:-3.92},{n:"Brechfa",la:51.94,lo:-4.12}]},
{id:"irfon",n:"River Irfon",rg:"wales",rt:"spate",lat:52.12,lng:-3.55,ea:"5505TH",d:"Wild Wye tributary. Remote.",a:[{n:"Llanwrtyd Wells",la:52.10,lo:-3.63},{n:"Builth confluence",la:52.15,lo:-3.40}]},
{id:"monnow",n:"River Monnow",rg:"wales",rt:"free",lat:51.85,lng:-2.85,ea:"5507TH",d:"Welsh borders. Intimate freestone.",a:[{n:"Longtown",la:51.95,lo:-2.98},{n:"Skenfrith",la:51.84,lo:-2.85},{n:"Monmouth",la:51.81,lo:-2.72}]},
{id:"derwent_p",n:"Derwent (Derbys)",rg:"peak",rt:"free",lat:53.10,lng:-1.50,ea:"3003TH",d:"Peak District freestone.",a:[{n:"Bamford",la:53.36,lo:-1.69},{n:"Baslow",la:53.24,lo:-1.62},{n:"Chatsworth",la:53.22,lo:-1.61},{n:"Matlock",la:53.14,lo:-1.56}]},
{id:"dove",n:"River Dove",rg:"peak",rt:"lime",lat:53.07,lng:-1.78,ea:"3004TH",d:"Izaak Walton's river. Dovedale.",a:[{n:"Longnor",la:53.15,lo:-1.84},{n:"Dovedale",la:53.07,lo:-1.78},{n:"Mappleton",la:53.00,lo:-1.75},{n:"Rocester",la:52.93,lo:-1.82}]},
{id:"manifold",n:"River Manifold",rg:"peak",rt:"lime",lat:53.07,lng:-1.83,ea:"3005TH",d:"Disappears underground in dry summers.",a:[{n:"Longnor",la:53.14,lo:-1.85},{n:"Wetton Mill",la:53.08,lo:-1.82},{n:"Ilam",la:53.06,lo:-1.77}]},
{id:"wye_p",n:"Wye (Derbys)",rg:"peak",rt:"lime",lat:53.25,lng:-1.68,ea:"3006TH",d:"Crystal limestone. Monsal Dale.",a:[{n:"Buxton",la:53.26,lo:-1.91},{n:"Monsal Dale",la:53.24,lo:-1.72},{n:"Bakewell",la:53.21,lo:-1.68}]},
{id:"lathkill",n:"River Lathkill",rg:"peak",rt:"lime",lat:53.18,lng:-1.72,ea:"3007TH",d:"Purest limestone stream in England.",a:[{n:"Monyash",la:53.19,lo:-1.76},{n:"Over Haddon",la:53.19,lo:-1.70},{n:"Alport",la:53.18,lo:-1.67}]},
{id:"wharfe",n:"River Wharfe",rg:"yorks",rt:"lime",lat:53.92,lng:-1.65,ea:"2702TH",d:"Yorkshire Dales classic.",a:[{n:"Langstrothdale",la:54.18,lo:-2.10},{n:"Buckden",la:54.16,lo:-2.04},{n:"Grassington",la:54.07,lo:-1.98},{n:"Burnsall",la:54.02,lo:-1.94},{n:"Bolton Abbey",la:53.98,lo:-1.89},{n:"Ilkley",la:53.92,lo:-1.82}]},
{id:"ure",n:"River Ure",rg:"yorks",rt:"free",lat:54.18,lng:-1.78,ea:"2703TH",d:"Wensleydale. Wild browns and grayling.",a:[{n:"Hawes",la:54.30,lo:-2.20},{n:"Aysgarth",la:54.30,lo:-1.96},{n:"Middleham",la:54.28,lo:-1.81},{n:"Masham",la:54.22,lo:-1.66},{n:"Ripon",la:54.13,lo:-1.52}]},
{id:"swale",n:"River Swale",rg:"yorks",rt:"free",lat:54.30,lng:-1.60,ea:"2704TH",d:"Fastest-rising river in England.",a:[{n:"Keld",la:54.39,lo:-2.17},{n:"Muker",la:54.38,lo:-2.11},{n:"Reeth",la:54.39,lo:-1.94},{n:"Richmond",la:54.40,lo:-1.74}]},
{id:"nidd",n:"River Nidd",rg:"yorks",rt:"lime",lat:54.00,lng:-1.55,ea:"2705TH",d:"Nidderdale limestone.",a:[{n:"Lofthouse",la:54.14,lo:-1.84},{n:"Pateley Bridge",la:54.08,lo:-1.76},{n:"Birstwith",la:54.04,lo:-1.64},{n:"Knaresborough",la:54.00,lo:-1.46}]},
{id:"rye",n:"River Rye",rg:"yorks",rt:"free",lat:54.22,lng:-1.05,ea:"2706TH",d:"North York Moors freestone.",a:[{n:"Helmsley",la:54.25,lo:-1.06},{n:"Nunnington",la:54.21,lo:-0.99}]},
{id:"costa",n:"Costa Beck",rg:"yorks",rt:"chalk",lat:54.21,lng:-0.80,ea:"2707TH",d:"England's northernmost chalkstream.",a:[{n:"Costa, nr Pickering",la:54.21,lo:-0.80}]},
{id:"esk_y",n:"Esk (Yorks)",rg:"yorks",rt:"spate",lat:54.45,lng:-0.72,ea:"2708TH",d:"North York Moors to Whitby.",a:[{n:"Castleton",la:54.44,lo:-1.06},{n:"Danby",la:54.46,lo:-0.98},{n:"Lealholm",la:54.46,lo:-0.85},{n:"Grosmont",la:54.44,lo:-0.73}]},
{id:"styne",n:"South Tyne",rg:"ne",rt:"free",lat:54.90,lng:-2.25,ea:"2302TH",d:"North Pennines freestone.",a:[{n:"Alston",la:54.81,lo:-2.44},{n:"Haltwhistle",la:54.97,lo:-2.46},{n:"Haydon Bridge",la:54.97,lo:-2.25}]},
{id:"ntyne",n:"North Tyne",rg:"ne",rt:"free",lat:55.10,lng:-2.20,ea:"2303TH",d:"Kielder to Hexham. Strong grayling.",a:[{n:"Bellingham",la:55.14,lo:-2.33},{n:"Wark",la:55.08,lo:-2.25},{n:"Chollerford",la:55.03,lo:-2.13}]},
{id:"coquet",n:"River Coquet",rg:"ne",rt:"spate",lat:55.30,lng:-1.80,ea:"2304TH",d:"Northumberland gem. Sea trout.",a:[{n:"Alwinton",la:55.38,lo:-2.11},{n:"Harbottle",la:55.36,lo:-2.06},{n:"Rothbury",la:55.31,lo:-1.91},{n:"Felton",la:55.28,lo:-1.72}]},
{id:"wear",n:"River Wear",rg:"ne",rt:"free",lat:54.70,lng:-1.60,ea:"2306TH",d:"Pennine headwaters to Durham.",a:[{n:"Wearhead",la:54.72,lo:-2.20},{n:"Stanhope",la:54.74,lo:-2.00},{n:"Wolsingham",la:54.73,lo:-1.88},{n:"Durham",la:54.77,lo:-1.57}]},
{id:"tees",n:"River Tees",rg:"ne",rt:"free",lat:54.55,lng:-1.70,ea:"2307TH",d:"High Force to lowlands. Wild browns.",a:[{n:"Upper Teesdale",la:54.64,lo:-2.20},{n:"Middleton",la:54.63,lo:-2.09},{n:"Barnard Castle",la:54.54,lo:-1.92}]},
{id:"eden",n:"River Eden",rg:"nw",rt:"free",lat:54.70,lng:-2.60,ea:"7604TH",d:"One of England's finest trout rivers.",a:[{n:"Kirkby Stephen",la:54.47,lo:-2.35},{n:"Appleby",la:54.58,lo:-2.49},{n:"Temple Sowerby",la:54.63,lo:-2.60},{n:"Langwathby",la:54.68,lo:-2.68},{n:"Armathwaite",la:54.78,lo:-2.77}]},
{id:"lune",n:"River Lune",rg:"nw",rt:"spate",lat:54.18,lng:-2.65,ea:"7205TH",d:"Lancashire/Cumbria. Sea trout from July.",a:[{n:"Tebay",la:54.44,lo:-2.58},{n:"Sedbergh",la:54.32,lo:-2.53},{n:"Kirkby Lonsdale",la:54.20,lo:-2.60},{n:"Caton",la:54.08,lo:-2.72}]},
{id:"ribble",n:"River Ribble",rg:"nw",rt:"free",lat:53.90,lng:-2.35,ea:"7106TH",d:"Three Peaks to Preston. Strong grayling.",a:[{n:"Horton-in-Ribblesdale",la:54.15,lo:-2.30},{n:"Settle",la:54.07,lo:-2.28},{n:"Long Preston",la:54.02,lo:-2.26},{n:"Clitheroe",la:53.87,lo:-2.39}]},
{id:"kent_r",n:"River Kent",rg:"nw",rt:"lime",lat:54.33,lng:-2.72,ea:"7605TH",d:"South Lakeland limestone.",a:[{n:"Kentmere",la:54.43,lo:-2.82},{n:"Staveley",la:54.38,lo:-2.82},{n:"Burneside",la:54.35,lo:-2.75},{n:"Kendal",la:54.33,lo:-2.74}]},
{id:"rawthey",n:"River Rawthey",rg:"nw",rt:"free",lat:54.35,lng:-2.50,ea:"7206TH",d:"Lune tributary. Howgill Fells.",a:[{n:"Cautley",la:54.38,lo:-2.47},{n:"Sedbergh",la:54.32,lo:-2.53}]},
{id:"tweed",n:"River Tweed",rg:"scot",rt:"free",lat:55.60,lng:-2.50,ea:null,d:"Borders legend. World-class trout.",a:[{n:"Peebles",la:55.65,lo:-3.19},{n:"Innerleithen",la:55.62,lo:-3.07},{n:"Melrose",la:55.60,lo:-2.72},{n:"Kelso",la:55.60,lo:-2.43},{n:"Coldstream",la:55.65,lo:-2.25}]},
{id:"tay",n:"River Tay",rg:"scot",rt:"spate",lat:56.45,lng:-3.50,ea:null,d:"Scotland's mightiest river.",a:[{n:"Aberfeldy",la:56.62,lo:-3.87},{n:"Dunkeld",la:56.56,lo:-3.58},{n:"Stanley",la:56.47,lo:-3.44},{n:"Perth",la:56.40,lo:-3.43}]},
{id:"dee_s",n:"Dee (Scotland)",rg:"scot",rt:"spate",lat:57.05,lng:-2.75,ea:null,d:"Royal Deeside. Classic Highland spate.",a:[{n:"Braemar",la:57.01,lo:-3.40},{n:"Ballater",la:57.05,lo:-3.04},{n:"Aboyne",la:57.08,lo:-2.78},{n:"Banchory",la:57.05,lo:-2.50}]},
{id:"spey",n:"River Spey",rg:"scot",rt:"spate",lat:57.30,lng:-3.30,ea:null,d:"Fastest major river in Britain.",a:[{n:"Newtonmore",la:57.07,lo:-4.12},{n:"Aviemore",la:57.20,lo:-3.83},{n:"Grantown-on-Spey",la:57.33,lo:-3.61},{n:"Aberlour",la:57.46,lo:-3.23},{n:"Fochabers",la:57.59,lo:-3.10}]},
{id:"don_s",n:"Don (Scotland)",rg:"scot",rt:"free",lat:57.20,lng:-2.60,ea:null,d:"Aberdeenshire. Underrated.",a:[{n:"Strathdon",la:57.22,lo:-3.04},{n:"Alford",la:57.23,lo:-2.70},{n:"Monymusk",la:57.21,lo:-2.54},{n:"Inverurie",la:57.29,lo:-2.37}]},
{id:"findhorn",n:"River Findhorn",rg:"scot",rt:"spate",lat:57.48,lng:-3.75,ea:null,d:"Wild Highland spate. Deep gorges.",a:[{n:"Tomatin",la:57.35,lo:-4.08},{n:"Dulsie Bridge",la:57.42,lo:-3.88},{n:"Forres",la:57.61,lo:-3.63}]},
{id:"nith",n:"River Nith",rg:"scot",rt:"spate",lat:55.25,lng:-3.60,ea:null,d:"Dumfriesshire salmon and sea trout.",a:[{n:"Sanquhar",la:55.37,lo:-3.93},{n:"Thornhill",la:55.25,lo:-3.77},{n:"Dumfries",la:55.07,lo:-3.60}]},
{id:"annan",n:"River Annan",rg:"scot",rt:"spate",lat:55.15,lng:-3.25,ea:null,d:"Borders spate. Fast responding.",a:[{n:"Moffat",la:55.33,lo:-3.44},{n:"Lockerbie",la:55.12,lo:-3.35},{n:"Annan town",la:54.98,lo:-3.26}]},
{id:"deveron",n:"River Deveron",rg:"scot",rt:"spate",lat:57.50,lng:-2.60,ea:null,d:"Aberdeenshire. Underrated sea trout.",a:[{n:"Huntly",la:57.45,lo:-2.79},{n:"Turriff",la:57.54,lo:-2.46},{n:"Banff",la:57.67,lo:-2.53}]},
{id:"teme",n:"River Teme",rg:"mid",rt:"free",lat:52.30,lng:-2.60,ea:"5406TH",d:"Welsh Marches. Best wild trout in England.",a:[{n:"Knighton",la:52.35,lo:-3.04},{n:"Leintwardine",la:52.37,lo:-2.87},{n:"Ludlow",la:52.37,lo:-2.72},{n:"Tenbury Wells",la:52.31,lo:-2.60}]},
{id:"lugg",n:"River Lugg",rg:"mid",rt:"free",lat:52.15,lng:-2.78,ea:"5408TH",d:"Herefordshire. Gentle freestone.",a:[{n:"Presteigne",la:52.27,lo:-3.00},{n:"Kingsland",la:52.23,lo:-2.84},{n:"Leominster",la:52.23,lo:-2.74}]},
{id:"arrow",n:"River Arrow",rg:"mid",rt:"free",lat:52.22,lng:-2.90,ea:"5409TH",d:"Lugg tributary. Welsh borders.",a:[{n:"New Radnor",la:52.24,lo:-3.15},{n:"Pembridge",la:52.20,lo:-2.91}]},
];

/* ═══ HATCH SPECIES — 12 key species ═══ */
const SP=[
{id:"ed",n:"The Mayfly",latin:"Ephemera danica",hook:"8-10",months:[5,6],tempMin:11,tempMax:18,optMin:13,optMax:16,note:"Green Drake. The headline event.",clr:"#D4C472",peak:true},
{id:"ldo",n:"Large Dark Olive",latin:"Baetis rhodani",hook:"14-16",months:[1,2,3,4,5,10,11,12],tempMin:4,tempMax:14,optMin:7,optMax:12,note:"Year-round stalwart. Best overcast.",clr:"#5A7E4D"},
{id:"mdo",n:"Medium Olive",latin:"Baetis vernus",hook:"14-16",months:[4,5,6,7,8,9],tempMin:8,tempMax:18,optMin:10,optMax:15,note:"Summer olive. Replaces LDO.",clr:"#6B8E4E"},
{id:"ib",n:"Iron Blue",latin:"Baetis niger",hook:"16-18",months:[4,5,9,10],tempMin:5,tempMax:13,optMin:7,optMax:11,note:"Cold blustery days. April & autumn.",clr:"#3D4E6B"},
{id:"bwo",n:"Blue-Winged Olive",latin:"Serratella ignita",hook:"14-16",months:[5,6,7,8,9],tempMin:10,tempMax:20,optMin:12,optMax:17,note:"Summer evenings. Sherry spinners at dusk.",clr:"#5E7848"},
{id:"hw",n:"Hawthorn Fly",latin:"Bibio marci",hook:"12-14",months:[4,5],tempMin:8,tempMax:16,optMin:10,optMax:14,note:"Wind-blown terrestrial. Dangly legs.",clr:"#2D2D2D"},
{id:"gr",n:"Grannom",latin:"Brachycentrus subnubilis",hook:"14-16",months:[3,4,5],tempMin:6,tempMax:14,optMin:8,optMax:12,note:"First major caddis. Huge hatches.",clr:"#7A6E52"},
{id:"pmb",n:"Yellow May Dun",latin:"Heptagenia sulphurea",hook:"12-14",months:[5,6,7],tempMin:10,tempMax:18,optMin:12,optMax:16,note:"Evening hatches on fast water.",clr:"#C4B062"},
{id:"bk",n:"Black Gnat",latin:"Bibio johannis",hook:"18-20",months:[5,6,7,8],tempMin:10,tempMax:22,optMin:13,optMax:18,note:"Summer staple. Calm evenings.",clr:"#1D1D1D"},
{id:"sdo",n:"Small Spurwing",latin:"Centroptilum luteolum",hook:"18-20",months:[5,6,7,8,9],tempMin:10,tempMax:20,optMin:12,optMax:17,note:"Delicate. Slow water.",clr:"#7E9E6E"},
{id:"os",n:"Sedges",latin:"Various Trichoptera",hook:"12-14",months:[5,6,7,8,9],tempMin:10,tempMax:20,optMin:13,optMax:17,note:"Skittering egg-layers at dusk.",clr:"#6E7E4E"},
{id:"rs",n:"Reed Smuts",latin:"Simulium spp.",hook:"22-26",months:[5,6,7,8,9],tempMin:10,tempMax:22,optMin:12,optMax:18,note:"Tiny. Maddening rises. Fish feed hard.",clr:"#3A3A3A"},
];

/* ═══ FLY BOX ═══ */
const FLIES={
dry:[
  {n:"CDC F-Fly (Olive)",sz:"14-16",sp:["ldo","mdo"],note:"Universal. First fly on."},
  {n:"Klinkhammer (Olive)",sz:"14-16",sp:["ldo","mdo","bwo"],note:"Parachute emerger. In the film."},
  {n:"Adams",sz:"14-18",sp:["ldo","mdo","bwo"],note:"All-round searching dry."},
  {n:"Iron Blue CDC",sz:"16-18",sp:["ib"],note:"Essential cold blustery days."},
  {n:"Grey Wulff",sz:"10-12",sp:["ed"],note:"Mayfly. High-floating, visible."},
  {n:"French Partridge Mayfly",sz:"10-12",sp:["ed"],note:"Spent mayfly. Evening fall."},
  {n:"Elk Hair Caddis",sz:"14-16",sp:["gr","os"],note:"Sedge and grannom. Skate it."},
  {n:"Hawthorn Fly",sz:"12-14",sp:["hw"],note:"Big, black, dangly legs."},
  {n:"Black Gnat",sz:"18-20",sp:["bk"],note:"Summer evenings. Keep them small."},
  {n:"Sherry Spinner",sz:"14-16",sp:["bwo"],note:"BWO spinner. Dusk."},
  {n:"Blue-Winged Olive",sz:"14-16",sp:["bwo"],note:"No-hackle. Technical water."},
],
emerger:[
  {n:"CDC Shuttlecock (Olive)",sz:"14-16",sp:["ldo","mdo"],note:"Deadly in the film."},
  {n:"Deer Hair Emerger",sz:"14-18",sp:["ldo","mdo","bwo"],note:"Emerging dun. Simple."},
  {n:"Suspender Buzzer",sz:"14-18",sp:["ldo","mdo"],note:"Hangs in the film."},
  {n:"Snowshoe Emerger",sz:"14-16",sp:["bwo","mdo"],note:"Sits flush. Good visibility."},
  {n:"CDC Mayfly Emerger",sz:"10-12",sp:["ed"],note:"Through the film."},
],
nymph:[
  {n:"Pheasant Tail Nymph",sz:"14-18",sp:["ldo","mdo","bwo"],note:"The universal nymph."},
  {n:"Hare's Ear (GRHE)",sz:"14-16",sp:["ldo","mdo","bwo"],note:"Buggy, impressionistic."},
  {n:"Copper John",sz:"14-18",sp:["ldo","ib"],note:"Fast sink. Deeper runs."},
  {n:"Perdigon",sz:"16-20",sp:["mdo","sdo","ib"],note:"Euro-nymph. Heavy, slim."},
  {n:"Sawyer's Killer Bug",sz:"14-16",sp:["ldo","mdo"],note:"Avon legend. Grayling magnet."},
],
};

/* ═══ HELPERS ═══ */
const haversine=(a,b,c,d)=>{const R=3959,r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,s=Math.sin(x/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))};
const fmtD=d=>d<1?`${Math.round(d*5280)}ft`:d<10?`${d.toFixed(1)}mi`:`${Math.round(d)}mi`;
const tScore=(sp,t)=>{if(t==null)return 0.5;if(t<sp.tempMin||t>sp.tempMax)return 0;if(t>=sp.optMin&&t<=sp.optMax)return 1;return t<sp.optMin?(t-sp.tempMin)/(sp.optMin-sp.tempMin):(sp.tempMax-t)/(sp.tempMax-sp.optMax)};
const mScore=sp=>sp.months.includes(new Date().getMonth()+1)?1:0;
const hScore=(sp,t)=>Math.round(tScore(sp,t)*mScore(sp)*100);
const wxI=c=>{if(c<=1)return"☀";if(c<=3)return"⛅";if(c<=48)return"☁";if(c<=67)return"🌧";if(c<=82)return"🌦";if(c<=86)return"❄";return"⛈"};
const scoreLbl=s=>s>=70?"Strong":s>=40?"Moderate":s>0?"Sparse":"Off";
const scoreClr=s=>s>=70?C.rust:s>=40?C.warn:s>0?C.grn:C.txD;

/* ═══ DATA FETCHING ═══ */
const fetchEA=async(ref)=>{
  if(!ref)return{level:null,temp:null,trend:null};
  try{
    const r=await fetch(`https://environment.data.gov.uk/hydrology/id/stations/${ref}`);
    if(!r.ok)return{level:null,temp:null,trend:null};
    const d=await r.json();const ms=d?.items?.measures||[];
    let level=null,temp=null,trend=null;
    for(const m of ms){
      const mid=typeof m==='string'?m:m?.["@id"]||"";
      if(mid.includes("level")){try{const x=await fetch(`${mid}/readings?_sorted&_limit=6`);if(x.ok){const j=await x.json();const it=j?.items||[];if(it.length>0){level=parseFloat(it[0].value);if(it.length>=6){const o=parseFloat(it[5].value);trend=level>o+0.02?"RISING":level<o-0.02?"FALLING":"STEADY";}}}}catch(e){}}
      if(mid.includes("emp")){try{const x=await fetch(`${mid}/readings?_sorted&_limit=1`);if(x.ok){const j=await x.json();const it=j?.items||[];if(it.length>0)temp=parseFloat(it[0].value);}}catch(e){}}
    }
    return{level,temp,trend};
  }catch(e){return{level:null,temp:null,trend:null};}
};
const fetchWx=async(la,lo)=>{try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${la}&longitude=${lo}&hourly=temperature_2m,precipitation_probability,windspeed_10m,cloudcover,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&current_weather=true&timezone=Europe%2FLondon&forecast_days=7`);return r.ok?await r.json():null;}catch(e){return null;}};

/* ═══ UK MAP COMPONENT ═══ */
const UKMap=({rivers,loc,onSelect})=>{
  // Simplified UK outline, projects lat/lng to SVG coordinates
  const proj=(la,lo)=>{
    const x=((lo+8)/14)*300+50;
    const y=((59-la)/10)*450+20;
    return[x,y];
  };
  return(
    <svg viewBox="0 0 400 500" style={{width:"100%",maxHeight:420}}>
      {/* Simplified UK coastline */}
      <path d="M180,480 L160,460 L140,430 L120,400 L115,370 L120,350 L140,340 L130,310 L100,300 L90,280 L100,260 L115,240 L110,220 L90,210 L80,190 L75,160 L85,140 L95,120 L100,100 L90,80 L100,60 L120,45 L140,35 L165,30 L185,25 L210,20 L230,22 L250,30 L260,35 L270,50 L280,70 L275,90 L260,95 L250,110 L255,130 L270,140 L280,155 L270,170 L255,175 L250,190 L260,200 L270,210 L265,230 L250,240 L245,260 L250,280 L260,300 L275,310 L285,330 L280,350 L265,360 L255,380 L260,400 L250,420 L235,440 L220,450 L200,465 L180,480Z"
        fill="none" stroke={C.bd} strokeWidth="1.5" opacity="0.5"/>
      {/* Scotland */}
      <path d="M100,60 L90,40 L100,20 L130,10 L150,15 L170,10 L200,15 L220,12 L240,20 L250,30"
        fill="none" stroke={C.bd} strokeWidth="1" opacity="0.3"/>
      {/* Wales approx */}
      <path d="M115,370 L100,360 L90,340 L85,320 L90,300 L100,280 L90,260 L100,260"
        fill="none" stroke={C.bd} strokeWidth="1" opacity="0.3"/>

      {/* River dots */}
      {rivers.map(r=>{
        const[x,y]=proj(r.lat,r.lng);
        const isChalk=r.rt==="chalk";
        return <g key={r.id} onClick={()=>onSelect(r)} style={{cursor:"pointer"}}>
          <circle cx={x} cy={y} r={isChalk?5:4}
            fill={isChalk?C.rust:r.rt==="lime"?C.grn:r.rt==="spate"?C.txD:C.txM}
            opacity={0.7} stroke={C.c1} strokeWidth="1"/>
          <circle cx={x} cy={y} r={8} fill="transparent"/>
        </g>;
      })}

      {/* User location */}
      {loc&&(()=>{const[x,y]=proj(loc.lat,loc.lng);return<>
        <circle cx={x} cy={y} r={6} fill="none" stroke={C.rust} strokeWidth="1.5" opacity="0.6">
          <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx={x} cy={y} r={4} fill={C.rust}/>
      </>;})()}

      {/* Legend */}
      <g transform="translate(10,460)">
        <circle cx={6} cy={0} r={4} fill={C.rust} opacity="0.7"/><text x={14} y={4} fill={C.txD} fontSize="9" fontFamily={ff}>Chalk</text>
        <circle cx={66} cy={0} r={4} fill={C.grn} opacity="0.7"/><text x={74} y={4} fill={C.txD} fontSize="9" fontFamily={ff}>Limestone</text>
        <circle cx={146} cy={0} r={4} fill={C.txD} opacity="0.7"/><text x={154} y={4} fill={C.txD} fontSize="9" fontFamily={ff}>Spate</text>
        <circle cx={206} cy={0} r={4} fill={C.txM} opacity="0.7"/><text x={214} y={4} fill={C.txD} fontSize="9" fontFamily={ff}>Freestone</text>
        {loc&&<><circle cx={286} cy={0} r={4} fill={C.rust}/><text x={294} y={4} fill={C.txD} fontSize="9" fontFamily={ff}>You</text></>}
      </g>
    </svg>
  );
};

/* ═══ MAIN APP ═══ */
export default function App(){
  const[nav,setNav]=useState("near"); // near|forecast
  const[rv,setRv]=useState(null);
  const[area,setArea]=useState(null);
  const[sub,setSub]=useState("forecast");
  const[loc,setLoc]=useState(null);
  const[ea,setEa]=useState({});
  const[wx,setWx]=useState(null);
  const[loading,setLoading]=useState(false);
  const[adv,setAdv]=useState(false);
  const[rgF,setRgF]=useState("all");
  const[search,setSearch]=useState("");
  const[reports,setReports]=useState([]);
  const[showRpt,setShowRpt]=useState(false);
  const[rptForm,setRptForm]=useState({name:"",text:"",flies:"",rating:3});
  const timer=useRef(null);

  useEffect(()=>{if(navigator.geolocation)navigator.geolocation.getCurrentPosition(p=>setLoc({lat:p.coords.latitude,lng:p.coords.longitude}),()=>{},{enableHighAccuracy:false,timeout:8000});},[]);

  const rivers=useMemo(()=>{
    let l=RV.map(r=>({...r,dist:loc?haversine(loc.lat,loc.lng,r.lat,r.lng):null}));
    if(rgF!=="all")l=l.filter(r=>r.rg===rgF);
    if(search){const s=search.toLowerCase();l=l.filter(r=>r.n.toLowerCase().includes(s)||r.a.some(a=>a.n.toLowerCase().includes(s))||REGS[r.rg]?.toLowerCase().includes(s));}
    if(loc)l.sort((a,b)=>(a.dist||9999)-(b.dist||9999));else l.sort((a,b)=>a.n.localeCompare(b.n));
    return l;
  },[loc,rgF,search]);

  const selRiver=useCallback(async(r,a)=>{
    setRv(r);setArea(a||r.a[0]);setSub("forecast");setNav("forecast");
    setLoading(true);setWx(null);setEa({});
    const tgt=a||r.a[0];
    const[eaD,wxD]=await Promise.all([r.ea?fetchEA(r.ea):Promise.resolve({level:null,temp:null,trend:null}),fetchWx(tgt.la,tgt.lo)]);
    setEa(eaD);setWx(wxD);setLoading(false);
  },[]);

  useEffect(()=>{
    if(timer.current)clearInterval(timer.current);
    if(rv){timer.current=setInterval(()=>{const t=area||rv.a[0];if(rv.ea)fetchEA(rv.ea).then(d=>setEa(d));fetchWx(t.la,t.lo).then(d=>{if(d)setWx(d);});},900000);}
    return()=>{if(timer.current)clearInterval(timer.current);};
  },[rv,area]);

  const wTemp=ea?.temp??(wx?.current_weather?.temperature?Math.round(wx.current_weather.temperature*0.6+2):null);
  const aTemp=wx?.current_weather?.temperature;
  const wind=wx?.current_weather?.windspeed;
  const wxC=wx?.current_weather?.weathercode;

  const hatches=useMemo(()=>SP.map(s=>({...s,score:hScore(s,wTemp)})).sort((a,b)=>b.score-a.score),[wTemp]);
  const hatchIdx=useMemo(()=>{const top=hatches.slice(0,5);return top.length?Math.round(top.reduce((s,h)=>s+h.score,0)/top.length):0;},[hatches]);
  const activeIds=useMemo(()=>new Set(hatches.filter(h=>h.score>20).map(h=>h.id)),[hatches]);
  const danica=hatches.find(h=>h.id==="ed");

  // Hourly heatmap
  const heatmap=useMemo(()=>{
    if(!wx?.hourly)return null;
    const hrs=wx.hourly.temperature_2m,tms=wx.hourly.time;if(!hrs||!tms)return null;
    const days=[];
    for(let d=0;d<7;d++){
      const dh=[];
      for(let h=6;h<=20;h++){const i=d*24+h;if(i>=hrs.length)break;const at=hrs[i],ew=Math.round(at*0.6+2);
        const sc=SP.reduce((s,sp)=>{const m=mScore(sp),t=tScore(sp,ew);let tw=1;if(h>=10&&h<=14)tw=1.2;if(h>=17&&h<=20)tw=1.3;if(h<8||h>19)tw=0.5;return s+m*t*tw;},0);
        dh.push({h,score:Math.min(sc/4,1),airT:at,estW:ew});}
      const dt=new Date(tms[d*24]);
      days.push({date:dt,hours:dh,day:dt.toLocaleDateString('en-GB',{weekday:'short'}),dateStr:dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'})});
    }
    return days;
  },[wx]);

  // Long range
  const longRange=useMemo(()=>{
    const now=new Date(),wks=[];
    for(let w=0;w<8;w++){
      const s=new Date(now);s.setDate(s.getDate()+w*7);const e=new Date(s);e.setDate(e.getDate()+6);
      const mid=new Date(s);mid.setDate(mid.getDate()+3);const mo=mid.getMonth()+1;
      const act=SP.filter(sp=>sp.months.includes(mo)),hl=act.length>0?act[0]:null;
      wks.push({label:`${s.toLocaleDateString('en-GB',{day:'numeric',month:'short'})} – ${e.toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`,act,hl,int:act.length>4?"High":act.length>2?"Moderate":"Low"});
    }return wks;
  },[]);

  const levelStatus=ea?.level!=null?(ea.level<0.3?"LOW":ea.level<0.6?"NORMAL":"HIGH"):"—";

  return(
  <div style={{fontFamily:ff,background:C.bg,color:C.tx,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:72,WebkitFontSmoothing:"antialiased",position:"relative"}}>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet"/>

    {/* ═══ HEADER ═══ */}
    <div style={{padding:"14px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.bd}`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>{setNav("near");setRv(null);}}>
        <Mark s={30}/>
        <span style={{fontSize:15,fontWeight:600,letterSpacing:"0.22em",color:C.fog}}>EPHEMERA</span>
      </div>
      {rv&&<div style={{textAlign:"right"}}>
        <div style={{fontSize:28,fontWeight:700,color:scoreClr(hatchIdx),lineHeight:1}}>{hatchIdx}</div>
        <div style={{fontSize:8,color:C.txD,letterSpacing:"0.1em",fontWeight:600}}>HATCH INDEX</div>
      </div>}
    </div>

    {/* ═══════════════════ NEAR ME VIEW ═══════════════════ */}
    {nav==="near"&&<div style={{padding:"0 16px"}}>
      {/* Hero */}
      <div style={{textAlign:"center",padding:"20px 0 12px"}}>
        <Mark s={42}/>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:"0.2em",color:C.fog,marginTop:8}}>EPHEMERA</div>
        <div style={{fontSize:10,color:C.txM,marginTop:3}}>Timely Insight. Better Days.</div>
        <div style={{fontSize:9,color:C.txD,marginTop:2}}>{RV.length} rivers · {RV.reduce((s,r)=>s+r.a.length,0)} areas · Live data</div>
      </div>

      {/* UK Map */}
      <div style={{background:C.c1,borderRadius:10,border:`1px solid ${C.bd}`,padding:12,marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:C.txM,letterSpacing:"0.06em",marginBottom:6}}>UK TROUT RIVERS</div>
        <UKMap rivers={RV} loc={loc} onSelect={r=>selRiver(r)}/>
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:10}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search rivers, areas, regions..."
          style={{width:"100%",boxSizing:"border-box",padding:"10px 14px 10px 30px",borderRadius:8,border:`1px solid ${C.bd}`,background:C.c1,color:C.tx,fontSize:12,fontFamily:ff,outline:"none"}}/>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:13,color:C.txD}}>⌕</span>
        {search&&<span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:11,color:C.txD,cursor:"pointer"}} onClick={()=>setSearch("")}>✕</span>}
      </div>

      {/* Region filter */}
      <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8,WebkitOverflowScrolling:"touch"}}>
        <button onClick={()=>setRgF("all")} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${rgF==="all"?C.rust:C.bd}`,background:rgF==="all"?C.rustDim:"transparent",color:rgF==="all"?C.rust:C.txD,fontSize:10,fontWeight:600,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>All</button>
        {REG_ORDER.map(rg=><button key={rg} onClick={()=>setRgF(rg)} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${rgF===rg?C.rust:C.bd}`,background:rgF===rg?C.rustDim:"transparent",color:rgF===rg?C.rust:C.txD,fontSize:10,fontWeight:600,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>{REGS[rg].split(" ")[0]}</button>)}
      </div>

      <div style={{fontSize:9,color:C.txD,marginBottom:6}}>{rivers.length} river{rivers.length!==1?"s":""}{loc?" · nearest first":""}</div>

      {/* River list */}
      {rivers.map(r=>(
        <div key={r.id} onClick={()=>selRiver(r)} style={{background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:12,marginBottom:6,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:13,fontWeight:700,color:C.fog}}>{r.n}</span>
              <span style={{fontSize:8,padding:"1px 5px",borderRadius:3,background:r.rt==="chalk"?C.rustDim:r.rt==="lime"?C.grnDim:C.warnDim,color:r.rt==="chalk"?C.rust:r.rt==="lime"?C.grn:C.txM,fontWeight:600}}>{RTYPES[r.rt]}</span>
            </div>
            <div style={{fontSize:9,color:C.txD,marginTop:2}}>{REGS[r.rg]} · {r.a.length} area{r.a.length!==1?"s":""}</div>
          </div>
          {r.dist!=null&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:C.rust}}>{fmtD(r.dist)}</div></div>}
        </div>
      ))}
    </div>}

    {/* ═══════════════════ FORECAST VIEW ═══════════════════ */}
    {nav==="forecast"&&rv&&<div>
      {/* Danica hero */}
      {danica&&danica.score>0&&<div style={{margin:"12px 16px",padding:12,borderRadius:8,border:`1px solid ${C.rustGlow}`,background:C.rustDim}}>
        <div style={{fontSize:10,fontWeight:700,color:C.rust,letterSpacing:"0.06em"}}>THE MAYFLY / E. DANICA</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
          <div style={{fontSize:12,color:C.txM}}>{danica.score>=70?"Hatch underway. Get on the water.":danica.score>=40?"Building. Watch the water.":"Early signs. Days away."}</div>
          <div style={{fontSize:28,fontWeight:700,color:C.rust}}>{danica.score}</div>
        </div>
      </div>}

      {/* River / area selector */}
      <div style={{margin:"0 16px 8px",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.bd}`,background:C.c1,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}
        onClick={()=>{/* could open area picker */}}>
        <span style={{fontSize:13,fontWeight:600,color:C.fog}}>{rv.n}{area?` / ${area.n}`:""}</span>
        <span style={{fontSize:12,color:C.txD}}>+</span>
      </div>

      {/* Area selector row */}
      {rv.a.length>1&&<div style={{padding:"0 16px 8px",display:"flex",gap:5,overflowX:"auto"}}>
        {rv.a.map(a=><button key={a.n} onClick={()=>{setArea(a);fetchWx(a.la,a.lo).then(d=>{if(d)setWx(d);});}}
          style={{padding:"4px 9px",borderRadius:5,border:`1px solid ${area?.n===a.n?C.rust:C.bd}`,background:area?.n===a.n?C.rustDim:"transparent",color:area?.n===a.n?C.rust:C.txD,fontSize:9,fontWeight:500,fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"}}>{a.n}</button>)}
      </div>}

      {/* Stat strip */}
      <div style={{display:"flex",padding:"10px 16px",background:C.c1,borderTop:`1px solid ${C.bd}`,borderBottom:`1px solid ${C.bd}`}}>
        {[
          {l:"WATER",v:wTemp!=null?`${typeof wTemp==='number'?wTemp.toFixed(1):wTemp}°C`:"—"},
          {l:"LEVEL",v:ea?.level!=null?`${ea.level.toFixed(2)}m`:"—"},
          {l:"STATUS",v:levelStatus},
        ].map((s,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
          <div style={{fontSize:8,color:C.txD,letterSpacing:"0.06em",fontWeight:600}}>{s.l}</div>
          <div style={{fontSize:16,fontWeight:700,color:C.fog,marginTop:2}}>{s.v}</div>
        </div>)}
      </div>

      {/* Simulated / live indicator + map link */}
      <div style={{display:"flex",justifyContent:"space-between",padding:"6px 16px",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,borderRadius:3,background:ea?.temp?C.grn:C.warn}}/>
          <span style={{fontSize:9,color:C.txD}}>{ea?.temp?"LIVE":"SIMULATED"}</span>
        </div>
        {area&&<span style={{fontSize:10,color:C.rust,fontWeight:600,cursor:"pointer"}} onClick={()=>window.open(`https://www.google.com/maps/@${area.la},${area.lo},14z`,"_blank")}>VIEW ON MAP →</span>}
      </div>

      {loading&&<div style={{textAlign:"center",padding:20,color:C.txD,fontSize:11}}>Loading river data...</div>}

      {/* Sub tabs */}
      <div style={{display:"flex",gap:0,padding:"0 16px",borderBottom:`1px solid ${C.bd}`,overflowX:"auto"}}>
        {["Forecast","Hourly","Long Range","Fly Box","Kit","Reports"].map(t=>{
          const tid=t.toLowerCase().replace(/ /g,"_");
          return<button key={tid} onClick={()=>setSub(tid)} style={{
            padding:"8px 12px",border:"none",borderBottom:`2px solid ${sub===tid?C.rust:"transparent"}`,
            background:"none",color:sub===tid?C.rust:C.txD,fontSize:11,fontWeight:sub===tid?600:400,
            fontFamily:ff,cursor:"pointer",whiteSpace:"nowrap"
          }}>{t}</button>;
        })}
      </div>

      <div style={{padding:"0 16px 16px"}}>

      {/* Advanced toggle */}
      {(sub==="forecast"||sub==="hourly")&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0"}}>
        <span style={{fontSize:10,color:C.txD,letterSpacing:"0.06em",fontWeight:600}}>ADVANCED</span>
        <div onClick={()=>setAdv(!adv)} style={{width:36,height:20,borderRadius:10,background:adv?C.rust:C.bd,cursor:"pointer",position:"relative",transition:"background 0.2s"}}>
          <div style={{width:16,height:16,borderRadius:8,background:C.fog,position:"absolute",top:2,left:adv?18:2,transition:"left 0.2s"}}/>
        </div>
      </div>}

      {/* ── FORECAST TAB ── */}
      {sub==="forecast"&&<>
        <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:10}}>SPECIES ACTIVITY</div>
        {hatches.map(h=>(
          <div key={h.id} style={{background:h.peak&&h.score>0?C.rustDim:C.c1,borderRadius:8,border:`1px solid ${h.peak&&h.score>0?C.rustGlow:C.bd}`,padding:"10px 12px",marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:3,background:h.clr}}/>
                <span style={{fontSize:13,fontWeight:700,color:h.score>0?C.fog:C.txD}}>{h.n}</span>
                {h.peak&&h.score>0&&<span style={{fontSize:8,fontWeight:700,color:C.rust,letterSpacing:"0.08em"}}>PEAK</span>}
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:20,fontWeight:700,color:scoreClr(h.score)}}>{h.score}</div>
                <div style={{fontSize:8,color:scoreClr(h.score),fontWeight:600}}>{scoreLbl(h.score)}</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{height:3,background:C.bd,borderRadius:2,marginTop:6,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${h.score}%`,background:scoreClr(h.score),borderRadius:2,transition:"width 0.5s"}}/>
            </div>
            {adv&&<div style={{fontSize:9,color:C.txD,marginTop:6}}>
              <span style={{fontStyle:"italic"}}>{h.latin}</span> · Hook {h.hook} · {h.note}
            </div>}
          </div>
        ))}
      </>}

      {/* ── HOURLY TAB ── */}
      {sub==="hourly"&&heatmap&&<>
        <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:10,marginTop:10}}>7-DAY HATCH INTENSITY</div>
        <div style={{background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:10,overflowX:"auto"}}>
          <div style={{display:"grid",gridTemplateColumns:`50px repeat(${heatmap[0]?.hours.length||15},1fr)`,gap:1,minWidth:380}}>
            <div/>
            {heatmap[0]?.hours.map(h=><div key={h.h} style={{fontSize:7,color:C.txD,textAlign:"center"}}>{h.h}</div>)}
            {heatmap.map(d=>(
              <div key={d.dateStr} style={{display:"contents"}}>
                <div style={{fontSize:9,color:C.txM,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontWeight:600}}>{d.day}</div>
                  <div style={{fontSize:7,color:C.txD}}>{d.dateStr}</div>
                </div>
                {d.hours.map(h=>{
                  const g=Math.round(60+h.score*140);const r=Math.round(40+h.score*155);const b=Math.round(50-h.score*30);
                  return<div key={h.h} title={`${h.h}:00 — Air ${h.airT}°C, Water ~${h.estW}°C`}
                    style={{background:`rgba(${r},${g},${b},${0.12+h.score*0.65})`,borderRadius:2,minHeight:16}}/>;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 7-day weather */}
        {wx?.daily&&<div style={{marginTop:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:8}}>7-DAY WEATHER</div>
          <div style={{display:"flex",gap:2,background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:8,overflowX:"auto"}}>
            {wx.daily.time.map((t,i)=>{const d=new Date(t);return<div key={i} style={{flex:1,textAlign:"center",minWidth:42,padding:"4px 2px",background:i===0?C.rustDim:"transparent",borderRadius:5}}>
              <div style={{fontSize:8,color:i===0?C.rust:C.txD,fontWeight:i===0?600:400}}>{d.toLocaleDateString('en-GB',{weekday:'short'})}</div>
              <div style={{fontSize:16,margin:"3px 0"}}>{wxI(wx.daily.weathercode[i])}</div>
              <div style={{fontSize:10,fontWeight:600,color:C.fog}}>{Math.round(wx.daily.temperature_2m_max[i])}°</div>
              <div style={{fontSize:9,color:C.txD}}>{Math.round(wx.daily.temperature_2m_min[i])}°</div>
              {wx.daily.precipitation_sum[i]>0&&<div style={{fontSize:7,color:"#5A9BBF",marginTop:1}}>{wx.daily.precipitation_sum[i].toFixed(1)}mm</div>}
            </div>;})}
          </div>
        </div>}
      </>}

      {/* ── LONG RANGE TAB ── */}
      {sub==="long_range"&&<>
        <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",margin:"10px 0"}}>8-WEEK OUTLOOK</div>
        <div style={{background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:10}}>
          {longRange.map((w,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:i<longRange.length-1?`1px solid ${C.bd}22`:"none"}}>
              <div style={{fontSize:9,color:C.txM,width:100,flexShrink:0}}>{w.label}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:600,color:w.hl?C.fog:C.txD}}>{w.hl?w.hl.n:"Low activity"}</div>
                <div style={{fontSize:8,color:C.txD}}>{w.act.length} species</div>
              </div>
              <div style={{fontSize:9,fontWeight:600,color:w.int==="High"?C.grn:w.int==="Moderate"?C.warn:C.txD}}>{w.int}</div>
            </div>
          ))}
        </div>
      </>}

      {/* ── FLY BOX TAB ── */}
      {sub==="fly_box"&&<>
        {["dry","emerger","nymph"].map(cat=>(
          <div key={cat} style={{marginTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:6}}>{cat==="dry"?"DRIES":cat==="emerger"?"EMERGERS":"NYMPHS"}</div>
            <div style={{background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:10}}>
              {FLIES[cat].map((f,i)=>{const match=f.sp.some(s=>activeIds.has(s));return(
                <div key={i} style={{padding:"6px 0",borderBottom:i<FLIES[cat].length-1?`1px solid ${C.bd}22`:"none",display:"flex",alignItems:"flex-start",gap:8}}>
                  {match&&<span style={{fontSize:7,padding:"2px 5px",borderRadius:3,background:C.rustDim,color:C.rust,fontWeight:700,flexShrink:0,marginTop:2}}>MATCH</span>}
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:match?C.fog:C.txM}}>{f.n}</div>
                    <div style={{fontSize:9,color:C.txD}}>Hook {f.sz} · {f.note}</div>
                  </div>
                </div>
              );})}
            </div>
          </div>
        ))}
      </>}

      {/* ── KIT TAB ── */}
      {sub==="kit"&&<>
        <div style={{marginTop:10,background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:6}}>TIPPET & LEADER</div>
          <div style={{fontSize:11,color:C.txM,lineHeight:1.5}}>
            {rv.rt==="chalk"?"12-15ft tapered leader to 6X (0.12mm) or 7X (0.10mm) fluorocarbon. Degreased for nymphs. For mayfly, 5X (0.14mm).":
             rv.rt==="lime"?"9-12ft tapered leader to 5X or 6X. Clear water demands fine tippet. Fluorocarbon for nymphs.":
             rv.rt==="spate"?"9ft leader to 4X or 5X. Water colour allows heavier. 3X for streamers.":
             "9-12ft leader to 5X. Adjust based on clarity. Go finer in low, clear conditions."}
          </div>
        </div>
        <div style={{marginTop:8,background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:6}}>GUIDE TIPS</div>
          <div style={{fontSize:11,color:C.txM,lineHeight:1.6}}>
            {rv.rt==="chalk"&&"Approach from downstream. Keep low. Spot fish before casting. Fish the edges first. Mud on the leader kills flash. In bright sun, wait for cloud before presenting."}
            {rv.rt==="lime"&&"Clear water means caution. Look for fish in pool tails and along weed edges. Rising fish are priority targets. Degreased tippet sinks the fly tip."}
            {rv.rt==="spate"&&"Read the water. Pocket water behind boulders, seams between fast and slow. After rain, give 24-48hrs to drop and clear. Best fishing on the drop."}
            {rv.rt==="free"&&"Varied water calls for varied tactics. Don't ignore fast shallow runs — big fish hold there. Cover water systematically."}
          </div>
        </div>
        <div style={{marginTop:8,background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em",marginBottom:6}}>RIVER TYPE: {RTYPES[rv.rt]?.toUpperCase()}</div>
          <div style={{fontSize:11,color:C.txM,lineHeight:1.5}}>{rv.d}</div>
        </div>
        {/* Regulation warning */}
        <div style={{marginTop:8,background:C.warnDim,borderRadius:8,border:`1px solid rgba(212,168,67,0.3)`,padding:12}}>
          <div style={{fontSize:10,fontWeight:700,color:C.warn,marginBottom:4}}>⚠ CHECK REGULATIONS</div>
          <div style={{fontSize:10,color:C.txM,lineHeight:1.5}}>Most UK rivers require an EA rod licence and permission from the riparian owner or club.{rv.rt==="chalk"?" Chalkstream beats are typically private — day ticket or syndicate.":""}{rv.rg==="scot"?" Scotland has different access rights but you still need a permit.":""} Always confirm season dates and rules before fishing.</div>
        </div>
      </>}

      {/* ── REPORTS TAB ── */}
      {sub==="reports"&&<>
        <div style={{marginTop:10,background:C.c1,borderRadius:8,border:`1px solid ${C.bd}`,padding:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:C.txD,letterSpacing:"0.08em"}}>RIVER REPORTS</div>
            <button onClick={()=>setShowRpt(!showRpt)} style={{fontSize:9,padding:"3px 8px",borderRadius:4,border:`1px solid ${C.rust}`,background:C.rustDim,color:C.rust,fontWeight:600,cursor:"pointer",fontFamily:ff}}>{showRpt?"Cancel":"+ Report"}</button>
          </div>
          {showRpt&&<div style={{padding:8,background:C.c2,borderRadius:6,marginBottom:8}}>
            <input placeholder="Name" value={rptForm.name} onChange={e=>setRptForm({...rptForm,name:e.target.value})} style={{width:"100%",boxSizing:"border-box",padding:7,marginBottom:5,borderRadius:4,border:`1px solid ${C.bd}`,background:C.c1,color:C.tx,fontSize:11,fontFamily:ff}}/>
            <textarea placeholder="How was the fishing?" value={rptForm.text} onChange={e=>setRptForm({...rptForm,text:e.target.value})} rows={2} style={{width:"100%",boxSizing:"border-box",padding:7,marginBottom:5,borderRadius:4,border:`1px solid ${C.bd}`,background:C.c1,color:C.tx,fontSize:11,fontFamily:ff,resize:"vertical"}}/>
            <input placeholder="Flies that worked" value={rptForm.flies} onChange={e=>setRptForm({...rptForm,flies:e.target.value})} style={{width:"100%",boxSizing:"border-box",padding:7,marginBottom:5,borderRadius:4,border:`1px solid ${C.bd}`,background:C.c1,color:C.tx,fontSize:11,fontFamily:ff}}/>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:9,color:C.txM}}>Rating:</span>
              {[1,2,3,4,5].map(r=><span key={r} onClick={()=>setRptForm({...rptForm,rating:r})} style={{cursor:"pointer",fontSize:14,color:r<=rptForm.rating?C.rust:C.txD}}>★</span>)}
            </div>
            <button onClick={()=>{if(rptForm.name&&rptForm.text){setReports([{...rptForm,date:new Date().toISOString(),river:rv.n,area:area?.n},...reports]);setRptForm({name:"",text:"",flies:"",rating:3});setShowRpt(false);}}} style={{width:"100%",padding:8,borderRadius:5,border:"none",background:C.rust,color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:ff}}>Submit</button>
          </div>}
          {reports.filter(r=>r.river===rv.n).length===0&&!showRpt&&<div style={{fontSize:10,color:C.txD,textAlign:"center",padding:12}}>No reports yet. Be the first.</div>}
          {reports.filter(r=>r.river===rv.n).map((r,i)=>(
            <div key={i} style={{padding:"6px 0",borderBottom:`1px solid ${C.bd}22`}}>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,fontWeight:600,color:C.fog}}>{r.name}</span><span style={{fontSize:8,color:C.txD}}>{new Date(r.date).toLocaleDateString('en-GB')}</span></div>
              {r.area&&<div style={{fontSize:8,color:C.txD}}>{r.area}</div>}
              <div style={{fontSize:9,color:C.rust}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
              <div style={{fontSize:10,color:C.txM,marginTop:3,lineHeight:1.4}}>{r.text}</div>
              {r.flies&&<div style={{fontSize:9,color:C.txD,marginTop:2}}>Flies: {r.flies}</div>}
            </div>
          ))}
        </div>
      </>}

      </div>

      {/* Legal footer */}
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.bd}`}}>
        <div style={{fontSize:7,color:C.txD,lineHeight:1.6,textAlign:"center"}}>
          Forecasts are indicative. Always check local conditions and regulations. EA data under Open Government Licence. Weather from Open-Meteo. © {new Date().getFullYear()} Ephemera Ltd.
        </div>
      </div>
    </div>}

    {/* ═══ BOTTOM NAV ═══ */}
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.c1,borderTop:`1px solid ${C.bd}`,display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
      {[{id:"near",l:"Near Me",ic:"◎"},{id:"forecast",l:"Forecast",ic:"◉"},{id:"flybox",l:"Fly Box",ic:"◈"},{id:"rpts",l:"Reports",ic:"◇"}].map(n=>(
        <button key={n.id} onClick={()=>{
          if(n.id==="near"){setNav("near");setRv(null);}
          if(n.id==="forecast"){if(!rv)setNav("near");else{setNav("forecast");setSub("forecast");}}
          if(n.id==="flybox"){if(!rv)setNav("near");else{setNav("forecast");setSub("fly_box");}}
          if(n.id==="rpts"){if(!rv)setNav("near");else{setNav("forecast");setSub("reports");}}
        }} style={{flex:1,padding:"10px 0 8px",border:"none",background:"none",color:(nav==="near"&&n.id==="near")||(nav==="forecast"&&n.id==="forecast"&&sub==="forecast")||(nav==="forecast"&&n.id==="flybox"&&sub==="fly_box")||(nav==="forecast"&&n.id==="rpts"&&sub==="reports")?C.rust:C.txD,cursor:"pointer",fontFamily:ff,textAlign:"center"}}>
          <div style={{fontSize:16,lineHeight:1}}>{n.ic}</div>
          <div style={{fontSize:8,fontWeight:600,marginTop:2}}>{n.l}</div>
        </button>
      ))}
    </div>
  </div>);
}
