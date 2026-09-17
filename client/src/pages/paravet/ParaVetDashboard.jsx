import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, MapPin, FlaskConical, Wifi, WifiOff, Plus, AlertTriangle, CheckCircle } from "lucide-react";

const QUEUE = [
  { id: "C-001", animal: "MH-KL-4821", species: "Cattle", village: "Kalamb", symptoms: ["Salivation", "Foot lesions"], triage: "YELLOW", synced: true, time: "Today 09:15" },
  { id: "C-002", animal: "Herd #7", species: "Goat (12 animals)", village: "Wadgaon", symptoms: ["Fever", "Nasal discharge", "Mouth sores"], triage: "RED", synced: false, time: "Today 11:42" },
  { id: "C-003", animal: "MH-KL-5001", species: "Buffalo", village: "Pimple", symptoms: ["Lameness", "Swelling"], triage: "GREEN", synced: true, time: "Yesterday" },
];

const SAMPLES = [
  { id: "S-8921", qr: "QR-8921", animal: "MH-KL-4821", disease: "FMD", status: "IN_TRANSIT", collected: "Today 09:30" },
  { id: "S-8922", qr: "QR-8922", animal: "Herd #7", disease: "PPR", status: "COLLECTED", collected: "Today 11:50" },
];

const TRIAGE_COLOR = { RED: "bg-red-100 text-red-700", YELLOW: "bg-amber-100 text-amber-700", GREEN: "bg-green-100 text-green-700" };
const STATUS_COLOR = { COLLECTED: "bg-blue-100 text-blue-700", IN_TRANSIT: "bg-purple-100 text-purple-700", LAB_INGESTED: "bg-gray-100 text-gray-700", TESTING: "bg-orange-100 text-orange-700", RESULT_PUBLISHED: "bg-green-100 text-green-700" };
const STAGES = ["COLLECTED","IN_TRANSIT","LAB_INGESTED","TESTING","RESULT_PUBLISHED"];

export default function ParaVetDashboard() {
  const navigate = useNavigate();
  const [isOnline] = useState(navigator.onLine);
  const [tab, setTab] = useState("queue");
  const pending = QUEUE.filter(c => !c.synced).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Para-Vet Field App</h1>
            <p className="text-xs text-gray-400">Kalamb Block, Pune Dist.</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </div>
            {pending > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">{pending} pending sync</span>}
          </div>
        </div>
        <div className="flex gap-1 mt-3 bg-gray-100 p-1 rounded-lg">
          {[["queue", "Case Queue", ClipboardList], ["samples", "Lab Samples", FlaskConical]].map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-semibold transition ${tab === key ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {tab === "queue" && (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">{QUEUE.length} cases logged today</p>
              <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-semibold"><Plus className="w-3.5 h-3.5" /> New Case</button>
            </div>
            <div className="space-y-3">
              {QUEUE.map(c => (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm text-gray-800">{c.animal}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${TRIAGE_COLOR[c.triage]}`}>{c.triage}</span>
                        {c.synced ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">Queued</span>}
                      </div>
                      <p className="text-xs text-gray-400">{c.species}</p>
                    </div>
                    <p className="text-[10px] text-gray-400">{c.time}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-2"><MapPin className="w-3 h-3 text-gray-400" /><p className="text-xs text-gray-500">{c.village}</p></div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.symptoms.map(s => <span key={s} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                  {c.triage === "RED" && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg p-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-700">Zoonotic risk suspected. Collect sample immediately and notify VTO.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "samples" && (
          <>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm text-gray-500">{SAMPLES.length} samples tracked</p>
              <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-semibold"><Plus className="w-3.5 h-3.5" /> Collect Sample</button>
            </div>
            <div className="space-y-3">
              {SAMPLES.map(s => {
                const ci = STAGES.indexOf(s.status);
                return (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div><p className="font-semibold text-sm text-gray-800">{s.id}</p><p className="text-xs text-gray-400">{s.animal} · {s.disease}</p></div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${STATUS_COLOR[s.status]}`}>{s.status.replace(/_/g," ")}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-3 overflow-x-auto pb-1">
                      {STAGES.map((stage, i) => (
                        <React.Fragment key={stage}>
                          <div className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap ${i <= ci ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                            {stage.replace(/_/g," ")}
                          </div>
                          {i < 4 && <div className={`flex-shrink-0 h-0.5 w-2 ${i < ci ? "bg-blue-600" : "bg-gray-200"}`} />}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">QR: <span className="font-mono font-medium text-gray-600">{s.qr}</span> · Collected: {s.collected}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
