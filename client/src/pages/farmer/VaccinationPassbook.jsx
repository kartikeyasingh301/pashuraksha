import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Syringe, CheckCircle, AlertCircle, Clock, Download } from "lucide-react";

const RECORDS = [
  { id: 1, vaccine: "Foot & Mouth Disease (FMD)", batch: "VB-FMD-2026-441", manufacturer: "Indian Immunologicals", animal: "MH-KL-4821", date: "15 Apr 2026", nextDue: "15 Oct 2026", vet: "Dr. Priya Sharma", status: "valid" },
  { id: 2, vaccine: "Hemorrhagic Septicemia (HS)", batch: "VB-HS-2026-112", manufacturer: "Hester Biosciences", animal: "MH-KL-4822", date: "10 Jan 2026", nextDue: "10 Jan 2027", vet: "Dr. R. Patil", status: "valid" },
  { id: 3, vaccine: "Black Quarter (BQ)", batch: "VB-BQ-2026-889", manufacturer: "Venkys India", animal: "MH-KL-4831", date: "5 Mar 2026", nextDue: "5 Mar 2027", vet: "Dr. Priya Sharma", status: "valid" },
  { id: 4, vaccine: "PPR (Goat Plague)", batch: "VB-PPR-2025-204", manufacturer: "Indian Immunologicals", animal: "MH-KL-4830", date: "20 Nov 2025", nextDue: "20 Nov 2026", vet: "Dr. R. Patil", status: "due_soon" },
  { id: 5, vaccine: "Brucellosis S19", batch: "VB-BR-2025-031", manufacturer: "IVRI Izatnagar", animal: "MH-KL-4821", date: "8 Feb 2025", nextDue: "8 Feb 2026", vet: "Dr. Priya Sharma", status: "overdue" },
];

const STATUS_CONFIG = {
  valid:     { icon: CheckCircle, color: "text-green-600",  bg: "bg-green-50",  border: "border-green-100", label: "Valid" },
  due_soon:  { icon: Clock,       color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100", label: "Due Soon" },
  overdue:   { icon: AlertCircle, color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100",   label: "Overdue" },
};

export default function VaccinationPassbook() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = RECORDS.filter(r => filter === "all" || r.status === filter);
  const counts = { all: RECORDS.length, valid: RECORDS.filter(r => r.status === "valid").length, due_soon: RECORDS.filter(r => r.status === "due_soon").length, overdue: RECORDS.filter(r => r.status === "overdue").length };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10">
        <button onClick={() => navigate("/farmer")} className="flex items-center text-gray-500 gap-2 mb-3 text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Vaccination Passbook</h1>
          <button className="flex items-center gap-1.5 text-blue-600 text-sm font-medium border border-blue-200 px-3 py-1.5 rounded-lg">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.entries({ all: "All", valid: "Valid", due_soon: "Due Soon", overdue: "Overdue" }).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${filter === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {counts.overdue > 0 && filter === "all" && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700"><strong>{counts.overdue} vaccination(s) overdue.</strong> Contact your field vet to schedule immediately.</p>
          </div>
        )}

        {filtered.map(r => {
          const cfg = STATUS_CONFIG[r.status];
          const Icon = cfg.icon;
          return (
            <div key={r.id} className={`bg-white rounded-xl border ${cfg.border} p-4`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-sm text-gray-800">{r.vaccine}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Animal: {r.animal}</p>
                </div>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                  <Icon className="w-3 h-3" /> {cfg.label}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><span className="text-gray-400">Batch:</span> <span className="font-mono font-medium text-gray-700">{r.batch}</span></div>
                <div><span className="text-gray-400">Manufacturer:</span> {r.manufacturer}</div>
                <div><span className="text-gray-400">Administered:</span> {r.date}</div>
                <div><span className="text-gray-400">Next Due:</span> <span className={r.status === "overdue" ? "text-red-600 font-semibold" : ""}>{r.nextDue}</span></div>
                <div className="col-span-2"><span className="text-gray-400">Vet:</span> {r.vet}</div>
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-50">
                <Syringe className="w-3 h-3 text-blue-400" />
                <p className="text-xs text-gray-400">{r.manufacturer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
