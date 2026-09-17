import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, Activity, FlaskConical, MapPin, Users, Skull, RefreshCw, Syringe, Send, CheckCircle, Bell, LogOut, Shield, BarChart2, Map, MessageSquare, Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

// --- MOCK DATA ----------------------------------------------------------------
const ALERTS = [
  { id:1, disease:"Anthrax Suspected", location:"Khed, Pune", count:4, triage:"RED",    time:"10 min ago" },
  { id:2, disease:"FMD Cluster",       location:"Baramati, Pune", count:12, triage:"YELLOW", time:"2 hrs ago" },
  { id:3, disease:"LSD Endemic",       location:"Shirur, Pune",  count:2,  triage:"GREEN",  time:"5 hrs ago" },
];
const CLUSTERS = [
  { id:1, lat:18.84, lng:73.9,  triage:"RED",    disease:"Anthrax", district:"Khed",    count:4  },
  { id:2, lat:18.15, lng:74.58, triage:"YELLOW", disease:"FMD",     district:"Baramati",count:12 },
  { id:3, lat:18.52, lng:73.85, triage:"GREEN",  disease:"HS",      district:"Shirur",  count:2  },
];
const LAB_SLA = [
  { id:"S-8921", disease:"Anthrax",    status:"TESTING",    hoursLeft:-2,  breached:true  },
  { id:"S-8922", disease:"FMD",        status:"IN_TRANSIT", hoursLeft:12,  breached:false },
  { id:"S-8923", disease:"Brucellosis",status:"LAB_INGESTED",hoursLeft:18, breached:false },
];
const TREND = [{d:"Mon",c:12},{d:"Tue",c:19},{d:"Wed",c:15},{d:"Thu",c:22},{d:"Fri",c:30},{d:"Sat",c:28},{d:"Sun",c:35}];
const SPECIES = [{name:"Cattle",value:400},{name:"Buffalo",value:300},{name:"Goat",value:180}];
const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6"];
const TRIAGE_MAP = { RED:{color:"red",fill:"red",radius:20}, YELLOW:{color:"orange",fill:"orange",radius:15}, GREEN:{color:"green",fill:"green",radius:10} };

const BROADCAST_TEMPLATES = {
  fmd:{  en:"FMD suspected within 10 km. Isolate cattle. Avoid shared troughs. Notify field worker.", hi:"FMD ??????? ??? ??? ??? ????? ???? ???? ? ?????", mr:"FMD ??????. ?????? ????? ???. ???? ???? ??? ???." },
  anthrax:{ en:"URGENT: Anthrax suspected. Do NOT touch dead animals. Call 1962.", hi:"????????? ???????? ??? ??? ? ????? 1962 ?? ??? ?????", mr:"?????: ????????? ??????. ??? ??????????? ?????? ??? ???. 1962 ?? ??? ???." },
  ppr:{  en:"PPR detected. Separate sick goats. No animal movement. Contact vet.", hi:"PPR ??? ???? ????? ???? ??? ????? ??? ? ??????", mr:"PPR ?????. ????? ?????? ??????? ???. ?????? ???? ???." },
};

// --- SECTIONS -----------------------------------------------------------------

function AlertsSection() {
  const [filter,setFilter] = useState("ALL");
  const filtered = ALERTS.filter(a=>filter==="ALL"||a.triage===filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["ALL","RED","YELLOW","GREEN"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filter===f?"bg-gray-800 text-white border-gray-800":"border-gray-200 text-gray-500"}`}>{f}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(a=>(
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${a.triage==="RED"?"bg-red-500 animate-pulse":a.triage==="YELLOW"?"bg-amber-400":"bg-green-500"}`}/>
              <div><p className="font-semibold text-sm text-gray-800">{a.disease}</p><p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3"/>{a.location}</p></div>
            </div>
            <div className="text-right"><span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{a.count} cases</span><p className="text-[10px] text-gray-400 mt-1">{a.time}</p></div>
          </div>
        ))}
      </div>
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        {[{label:"Active Outbreaks",val:"3",Icon:AlertTriangle,color:"text-red-500",bg:"bg-red-50"},{label:"Reports Today",val:"142",Icon:Activity,color:"text-blue-500",bg:"bg-blue-50"},{label:"SLA Breached",val:"1",Icon:FlaskConical,color:"text-amber-500",bg:"bg-amber-50"},{label:"Animals at Risk",val:"4.2k",Icon:Users,color:"text-purple-500",bg:"bg-purple-50"}].map((k,i)=>(
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${k.bg}`}><k.Icon className={`w-5 h-5 ${k.color}`}/></div>
            <div><p className="text-xs text-gray-400">{k.label}</p><p className="text-xl font-bold text-gray-800">{k.val}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapSection() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-[420px] relative">
        <MapContainer center={[18.5204,73.8567]} zoom={9} style={{height:"100%",width:"100%"}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {CLUSTERS.map(c=>(
            <CircleMarker key={c.id} center={[c.lat,c.lng]} radius={TRIAGE_MAP[c.triage].radius}
              pathOptions={{color:TRIAGE_MAP[c.triage].color,fillColor:TRIAGE_MAP[c.triage].fill,fillOpacity:0.4}}>
              <Popup><div className="text-xs font-semibold">{c.disease}<br/>{c.district} · {c.count} cases</div></Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[["RED","#ef4444","Critical"],["YELLOW","#f59e0b","Suspected"],["GREEN","#22c55e","Routine"]].map(([t,c,l])=>(
          <div key={t} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
            <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{background:c}}/>
            <p className="text-xs font-semibold text-gray-600">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LabSection() {
  return (
    <div className="space-y-3">
      {LAB_SLA.map(s=>(
        <div key={s.id} className={`bg-white rounded-xl border p-4 ${s.breached?"border-red-100":"border-gray-100"}`}>
          <div className="flex justify-between items-center mb-2">
            <div><p className="font-semibold text-sm text-gray-800">{s.id}</p><p className="text-xs text-gray-400">{s.disease}</p></div>
            <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{s.status.replace(/_/g," ")}</span>
          </div>
          {s.breached
            ? <p className="text-xs text-red-600 font-bold flex items-center gap-1"><Skull className="w-3.5 h-3.5"/>{Math.abs(s.hoursLeft)}h Overdue — Escalate Now</p>
            : <p className="text-xs text-green-600 font-semibold">{s.hoursLeft}h remaining within SLA</p>
          }
        </div>
      ))}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold text-sm text-gray-700 mb-4">7-Day Trend</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={TREND}><XAxis dataKey="d" fontSize={10}/><Tooltip/><Line type="monotone" dataKey="c" stroke="#3b82f6" strokeWidth={2} dot={false}/></LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BroadcastSection() {
  const [disease,setDisease] = useState("fmd");
  const [lang,setLang] = useState("en");
  const [channel,setChannel] = useState("sms");
  const [sent,setSent] = useState(false);
  const msg = BROADCAST_TEMPLATES[disease]?.[lang]||"";

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[["fmd","FMD"],["anthrax","Anthrax"],["ppr","PPR"]].map(([k,l])=>(
            <button key={k} onClick={()=>setDisease(k)} className={`py-2 rounded-xl text-xs font-bold border ${disease===k?"bg-red-600 text-white border-red-600":"border-gray-200 text-gray-600"}`}>{l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {[["en","English"],["hi","?????"],["mr","?????"]].map(([k,l])=>(
            <button key={k} onClick={()=>setLang(k)} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${lang===k?"bg-blue-600 text-white border-blue-600":"border-gray-200 text-gray-600"}`}>{l}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {["sms","whatsapp","ivr"].map(c=>(
            <button key={c} onClick={()=>setChannel(c)} className={`flex-1 py-2 rounded-xl text-xs font-bold border ${channel===c?"bg-green-600 text-white border-green-600":"border-gray-200 text-gray-600"}`}>{c.toUpperCase()}</button>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3"><p className="text-sm text-gray-700 leading-relaxed">{msg}</p><p className="text-[10px] text-gray-400 mt-2">~1,240 farmers in target zone</p></div>
        <button onClick={()=>{setSent(true);setTimeout(()=>setSent(false),3000)}}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${sent?"bg-green-600 text-white":"bg-blue-600 text-white"}`}>
          {sent?<><CheckCircle className="w-4 h-4"/>Sent!</>:<><Send className="w-4 h-4"/>Send Broadcast</>}
        </button>
      </div>
    </div>
  );
}

// --- MAIN ---------------------------------------------------------------------
const NAV = [
  { id:"alerts",    label:"Alerts",    Icon:Bell },
  { id:"map",       label:"Map",       Icon:Map },
  { id:"lab",       label:"Lab SLA",   Icon:FlaskConical },
  { id:"broadcast", label:"Broadcast", Icon:MessageSquare },
];

export default function VetApp() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState("alerts");
  const [time, setTime] = useState("");
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date().toLocaleTimeString()),1000); return ()=>clearInterval(t); },[]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-3 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">District Epidemiology</p>
            <h1 className="text-lg font-bold text-gray-800">{user?.name||"Vet Officer"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-gray-500">{time}</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full border border-green-200">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-xs text-green-600 font-semibold">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-1 flex-shrink-0">
          {NAV.map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setSection(id)} title={label}
              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition ${section===id?"bg-blue-50 text-blue-600":"text-gray-400 hover:bg-gray-50"}`}>
              <Icon className="w-5 h-5"/>
              <span className="text-[8px] font-semibold">{label.split(" ")[0]}</span>
            </button>
          ))}
          <div className="flex-1"/>
          {logout && <button onClick={logout} title="Logout" className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-400 transition"><LogOut className="w-5 h-5"/></button>}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="text-base font-bold text-gray-800 mb-4">{NAV.find(n=>n.id===section)?.label}</h2>
          {section==="alerts"    && <AlertsSection/>}
          {section==="map"       && <MapSection/>}
          {section==="lab"       && <LabSection/>}
          {section==="broadcast" && <BroadcastSection/>}
        </div>
      </div>
    </div>
  );
}
