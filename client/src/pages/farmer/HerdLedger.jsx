import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, ChevronRight, Tag, Calendar, Syringe, Pill } from "lucide-react";

const MOCK_ANIMALS = [
  { id: "A001", tagId: "MH-KL-4821", species: "Cattle", breed: "Gir", sex: "Female", age: "4 yrs", village: "Kalamb", vaccinated: true, lastVaccine: "FMD — Apr 2026", drugs: 0, healthy: true },
  { id: "A002", tagId: "MH-KL-4822", species: "Buffalo", breed: "Murrah", sex: "Female", age: "6 yrs", village: "Kalamb", vaccinated: true, lastVaccine: "HS — Jan 2026", drugs: 1, healthy: true },
  { id: "A003", tagId: "MH-KL-4830", species: "Goat", breed: "Osmanabadi", sex: "Male", age: "2 yrs", village: "Kalamb", vaccinated: false, lastVaccine: "None", drugs: 0, healthy: false },
  { id: "A004", tagId: "MH-KL-4831", species: "Cattle", breed: "HF Cross", sex: "Female", age: "3 yrs", village: "Kalamb", vaccinated: true, lastVaccine: "BQ — Mar 2026", drugs: 0, healthy: true },
];

const SPECIES_COLORS = { Cattle: "bg-amber-100 text-amber-800", Buffalo: "bg-slate-100 text-slate-800", Goat: "bg-green-100 text-green-800", Sheep: "bg-blue-100 text-blue-800" };

export default function HerdLedger() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_ANIMALS.filter(a =>
    a.tagId.toLowerCase().includes(search.toLowerCase()) ||
    a.species.toLowerCase().includes(search.toLowerCase()) ||
    a.breed.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    const a = selected;
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <button onClick={() => setSelected(null)} className="flex items-center text-gray-600 mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Herd
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{a.tagId}</h2>
              <p className="text-gray-500 text-sm">{a.species} — {a.breed} — {a.sex}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${a.healthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {a.healthy ? "Healthy" : "Under Observation"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-400 text-xs mb-1">Age</p><p className="font-medium">{a.age}</p></div>
            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-gray-400 text-xs mb-1">Village</p><p className="font-medium">{a.village}</p></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Syringe className="w-4 h-4 text-blue-500" /> Vaccination History</h3>
          {a.vaccinated ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div><p className="font-medium text-sm">{a.lastVaccine}</p><p className="text-xs text-gray-400">Batch: VB-2024-881 | Dr. Priya Sharma</p></div>
                <span className="text-xs text-blue-600 font-semibold">Valid</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div><p className="font-medium text-sm text-gray-500">PPR — Nov 2025</p><p className="text-xs text-gray-400">Batch: VB-2025-112 | Dr. R. Patil</p></div>
                <span className="text-xs text-gray-400">Past</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">No vaccinations recorded. Contact your nearest vet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Pill className="w-4 h-4 text-purple-500" /> Drug Administration</h3>
          {a.drugs > 0 ? (
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-sm">Oxytetracycline 10mg/kg IM</p>
              <p className="text-xs text-gray-400 mt-1">Administered: 12 Sep 2026 | Withdrawal ends: 26 Sep 2026</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No drug administration recorded.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10">
        <button onClick={() => navigate("/farmer")} className="flex items-center text-gray-500 gap-2 mb-3 text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </button>
        <h1 className="text-xl font-bold text-gray-800 mb-3">My Herd Ledger</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by tag, species or breed..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm text-gray-500">{filtered.length} animals</p>
          <button className="flex items-center gap-1.5 bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium">
            <Plus className="w-4 h-4" /> Add Animal
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} onClick={() => setSelected(a)}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${SPECIES_COLORS[a.species] || "bg-gray-100 text-gray-600"}`}>
                  {a.species[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800">{a.tagId}</p>
                    {!a.healthy && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Sick</span>}
                  </div>
                  <p className="text-xs text-gray-400">{a.species} · {a.breed} · {a.age}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] flex items-center gap-1 text-gray-400"><Syringe className="w-3 h-3" />{a.vaccinated ? a.lastVaccine : "Not vaccinated"}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
