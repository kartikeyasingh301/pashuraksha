import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ClipboardList, List, BookOpen, Syringe, Bell, MapPin, CheckCircle, AlertCircle, Clock, ChevronRight, Camera, Mic, Send, Plus, Search, ArrowRight } from "lucide-react";

// --- DATA ---------------------------------------------------------------------

const ANIMALS = [
  { id:"A001", tagId:"MH-KL-4821", species:"Cattle", breed:"Gir", sex:"Female", age:"4 yrs", vaccinated:true, lastVaccine:"FMD — Apr 2026", healthy:true },
  { id:"A002", tagId:"MH-KL-4822", species:"Buffalo", breed:"Murrah", sex:"Female", age:"6 yrs", vaccinated:true, lastVaccine:"HS — Jan 2026", healthy:true },
  { id:"A003", tagId:"MH-KL-4830", species:"Goat", breed:"Osmanabadi", sex:"Male", age:"2 yrs", vaccinated:false, lastVaccine:"None", healthy:false },
  { id:"A004", tagId:"MH-KL-4831", species:"Cattle", breed:"HF Cross", sex:"Female", age:"3 yrs", vaccinated:true, lastVaccine:"BQ — Mar 2026", healthy:true },
];

const VACCINES = [
  { id:1, vaccine:"Foot & Mouth Disease (FMD)", batch:"VB-FMD-2026-441", animal:"MH-KL-4821", date:"15 Apr 2026", nextDue:"15 Oct 2026", status:"valid" },
  { id:2, vaccine:"Hemorrhagic Septicemia (HS)", batch:"VB-HS-2026-112", animal:"MH-KL-4822", date:"10 Jan 2026", nextDue:"10 Jan 2027", status:"valid" },
  { id:3, vaccine:"PPR (Goat Plague)", batch:"VB-PPR-2025-204", animal:"MH-KL-4830", date:"20 Nov 2025", nextDue:"20 Nov 2026", status:"due_soon" },
  { id:4, vaccine:"Brucellosis S19", batch:"VB-BR-2025-031", animal:"MH-KL-4821", date:"8 Feb 2025", nextDue:"8 Feb 2026", status:"overdue" },
];

const ADVISORIES = [
  { id:1, disease:"FMD", icon:"??", color:"#E53935", title:"Foot & Mouth Disease", tip:"Isolate affected animals. Avoid shared water troughs. No animal movement.", lang:{ en:"Isolate affected cattle immediately. Avoid shared water troughs. No movement of livestock.", hi:"???????? ????? ?? ????? ??? ????? ???? ???? ?? ???? ?? ?????", mr:"???????? ?????? ??????? ????? ???. ???? ???? ????." } },
  { id:2, disease:"PPR", icon:"??", color:"#F57C00", title:"PPR — Goat Plague", tip:"Separate sick goats. Do not sell or move animals. Contact vet.", lang:{ en:"Separate sick goats and sheep. Do not sell or move. Contact nearest vet.", hi:"????? ??????? ?? ??? ????? ????? ????? ??? ???????? ?? ?????? ?????", mr:"????? ?????? ??????? ???. ???? ???. ???????????? ?????? ???." } },
  { id:3, disease:"Anthrax", icon:"??", color:"#B71C1C", title:"Anthrax Alert", tip:"Do NOT touch dead animals. Call 1962 immediately.", lang:{ en:"Do NOT touch dead animals with bare hands. Burn carcasses. Call 1962.", hi:"??? ????? ?? ???? ??? ?? ? ????? ?? ?????? 1962 ?? ??? ?????", mr:"??? ??????????? ?????? ??? ???. ?????? ????. 1962 ?? ??? ???." } },
];

const SYMPTOMS = ["Fever","Salivation","Lameness","Nasal discharge","Mouth sores","Skin lesions","Loss of appetite","Diarrhoea","Swelling","Mortality"];

const STATUS_CFG = {
  valid:    { Icon:CheckCircle, color:"#22c55e", bg:"#f0fdf4", label:"Valid" },
  due_soon: { Icon:Clock,       color:"#f59e0b", bg:"#fffbeb", label:"Due Soon" },
  overdue:  { Icon:AlertCircle, color:"#ef4444", bg:"#fef2f2", label:"Overdue" },
};

const LANG_OPTS = [{ code:"en",label:"English" },{ code:"hi",label:"?????" },{ code:"mr",label:"?????" }];

// --- TAB: REPORT --------------------------------------------------------------
function ReportTab() {
  const [species,setSpecies] = useState("");
  const [symptoms,setSymptoms] = useState([]);
  const [mortality,setMortality] = useState(0);
  const [submitted,setSubmitted] = useState(false);

  const toggleSymptom = s => setSymptoms(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);

  if(submitted) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h3 className="text-xl font-bold text-gray-800">Report Submitted!</h3>
      <p className="text-gray-500 text-sm text-center">Your report is queued for sync. A vet will review it shortly.</p>
      <button onClick={()=>setSubmitted(false)} className="mt-2 px-5 py-2 bg-green-600 text-white rounded-xl font-semibold text-sm">Submit Another</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-5 text-white">
        <p className="text-green-200 text-xs font-semibold uppercase tracking-wide mb-1">Quick Report</p>
        <h2 className="text-xl font-bold">Report Sick Animal</h2>
        <p className="text-green-100 text-sm mt-1">Your report reaches a vet in minutes.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Animal Type</label>
          <div className="grid grid-cols-3 gap-2">
            {["?? Cattle","?? Buffalo","?? Goat","?? Sheep","?? Pig","?? Poultry"].map(s=>(
              <button key={s} onClick={()=>setSpecies(s)}
                className={`py-2 rounded-xl text-sm font-medium border transition ${species===s?"bg-green-600 text-white border-green-600":"border-gray-200 text-gray-600"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Symptoms (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s=>(
              <button key={s} onClick={()=>toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${symptoms.includes(s)?"bg-red-100 text-red-700 border-red-200":"border-gray-200 text-gray-600"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Mortality Count</label>
          <div className="flex items-center gap-3">
            <button onClick={()=>setMortality(m=>Math.max(0,m-1))} className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 flex items-center justify-center">-</button>
            <span className="text-2xl font-bold text-gray-800 w-8 text-center">{mortality}</span>
            <button onClick={()=>setMortality(m=>m+1)} className="w-9 h-9 rounded-xl border border-gray-200 text-lg font-bold text-gray-600 flex items-center justify-center">+</button>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium"><Camera className="w-4 h-4"/>Photo</button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium"><Mic className="w-4 h-4"/>Voice</button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium"><MapPin className="w-4 h-4"/>GPS</button>
        </div>

        <button onClick={()=>setSubmitted(true)} disabled={!species||symptoms.length===0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${species&&symptoms.length>0?"bg-green-600 text-white":"bg-gray-100 text-gray-400"}`}>
          <Send className="w-4 h-4"/> Submit Report
        </button>
      </div>
    </div>
  );
}

// --- TAB: HERD ----------------------------------------------------------------
function HerdTab() {
  const [search,setSearch] = useState("");
  const [sel,setSel] = useState(null);

  const filtered = ANIMALS.filter(a=>a.tagId.toLowerCase().includes(search.toLowerCase())||a.species.toLowerCase().includes(search.toLowerCase()));

  if(sel) return (
    <div className="space-y-4">
      <button onClick={()=>setSel(null)} className="flex items-center gap-2 text-gray-500 text-sm font-medium">? Back to Herd</button>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex justify-between items-start mb-4">
          <div><h2 className="text-lg font-bold text-gray-800">{sel.tagId}</h2><p className="text-gray-400 text-sm">{sel.species} · {sel.breed} · {sel.sex}</p></div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${sel.healthy?"bg-green-100 text-green-700":"bg-red-100 text-red-700"}`}>{sel.healthy?"Healthy":"Sick"}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-400 mb-1">Age</p><p className="font-semibold text-sm">{sel.age}</p></div>
          <div className="bg-gray-50 p-3 rounded-xl"><p className="text-xs text-gray-400 mb-1">Last Vaccine</p><p className="font-semibold text-sm">{sel.lastVaccine}</p></div>
        </div>
        {!sel.vaccinated && <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600 font-medium">?? No vaccinations recorded. Contact your vet.</div>}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by tag or species..." className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400"/></div>
      <div className="flex justify-between items-center"><p className="text-sm text-gray-500">{filtered.length} animals</p><button className="flex items-center gap-1.5 bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-semibold"><Plus className="w-3.5 h-3.5"/>Add Animal</button></div>
      <div className="space-y-2">
        {filtered.map(a=>(
          <div key={a.id} onClick={()=>setSel(a)} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">{a.species==="Cattle"?"??":a.species==="Buffalo"?"??":a.species==="Goat"?"??":"??"}</div>
              <div>
                <div className="flex items-center gap-2"><p className="font-semibold text-sm text-gray-800">{a.tagId}</p>{!a.healthy&&<span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">Sick</span>}</div>
                <p className="text-xs text-gray-400">{a.species} · {a.breed} · {a.age}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">?? {a.lastVaccine}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300"/>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TAB: PASSBOOK ------------------------------------------------------------
function PassbookTab() {
  const [filter,setFilter] = useState("all");
  const filtered = VACCINES.filter(v=>filter==="all"||v.status===filter);
  const overdue = VACCINES.filter(v=>v.status==="overdue").length;

  return (
    <div className="space-y-4">
      {overdue>0&&<div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0"/><p className="text-sm text-red-700"><strong>{overdue} vaccination(s) overdue.</strong> Contact your vet today.</p></div>}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[["all","All"],["valid","Valid"],["due_soon","Due Soon"],["overdue","Overdue"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${filter===k?"bg-blue-600 text-white":"bg-gray-100 text-gray-600"}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(v=>{
          const {Icon,color,bg,label}=STATUS_CFG[v.status];
          return (
            <div key={v.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2"><p className="font-semibold text-sm text-gray-800">{v.vaccine}</p><p className="text-xs text-gray-400 mt-0.5">Animal: {v.animal}</p></div>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{background:bg,color}}><Icon className="w-3 h-3"/>{label}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                <div>Batch: <span className="font-mono text-gray-700">{v.batch}</span></div>
                <div>Given: {v.date}</div>
                <div className="col-span-2">Next Due: <span style={{color:v.status==="overdue"?"#ef4444":"inherit",fontWeight:v.status==="overdue"?"700":"400"}}>{v.nextDue}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- TAB: ADVISORY ------------------------------------------------------------
function AdvisoryTab() {
  const [lang,setLang] = useState("en");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {LANG_OPTS.map(l=>(
          <button key={l.code} onClick={()=>setLang(l.code)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${lang===l.code?"bg-blue-600 text-white border-blue-600":"border-gray-200 text-gray-600"}`}>{l.label}</button>
        ))}
      </div>
      <div className="space-y-3">
        {ADVISORIES.map(a=>(
          <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:a.color+"22"}}>{a.icon}</div>
              <div><p className="font-bold text-sm text-gray-800">{a.title}</p><p className="text-xs text-gray-400">{a.tip}</p></div>
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{a.lang[lang]||a.lang.en}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP -----------------------------------------------------------------
const TABS = [
  { id:"report",  label:"Report",   Icon:ClipboardList },
  { id:"herd",    label:"My Herd",  Icon:List },
  { id:"passbook",label:"Passbook", Icon:Syringe },
  { id:"advisory",label:"Advisory", Icon:BookOpen },
];

export default function FarmerApp() {
  const { user } = useAuth();
  const [tab, setTab] = useState("report");
  const hour = new Date().getHours();
  const greeting = hour<12?"Good Morning":hour<17?"Good Afternoon":"Good Evening";

  const renderTab = () => {
    if(tab==="report")   return <ReportTab/>;
    if(tab==="herd")     return <HerdTab/>;
    if(tab==="passbook") return <PassbookTab/>;
    if(tab==="advisory") return <AdvisoryTab/>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-3 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-medium">{greeting} ??</p>
            <h1 className="text-lg font-bold text-gray-800">{user?.name || "Farmer"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-semibold">Pashuraksha</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {renderTab()}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex z-20 shadow-lg">
        {TABS.map(({id,label,Icon})=>(
          <button key={id} onClick={()=>setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition ${tab===id?"text-green-600":"text-gray-400"}`}>
            <Icon className={`w-5 h-5 ${tab===id?"stroke-[2.5px]":""}`}/>
            {label}
            {tab===id&&<div className="w-1 h-1 bg-green-600 rounded-full"/>}
          </button>
        ))}
      </div>
    </div>
  );
}
