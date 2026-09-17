import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Shield, TrendingUp, Users, Syringe, Truck, AlertTriangle, Activity, Globe, ChevronRight, RefreshCw } from "lucide-react";
import "leaflet/dist/leaflet.css";

// TODO: Replace with live API calls to /api/govt/metrics, /api/clusters, /api/govt/stockpile
const NATIONAL_CLUSTERS = [
  { id: 1, lat: 18.84, lng: 73.9, triage: "RED", disease: "Anthrax", district: "Pune", state: "Maharashtra", count: 4, radius: 25 },
  { id: 2, lat: 18.15, lng: 74.58, triage: "YELLOW", disease: "FMD", district: "Solapur", state: "Maharashtra", count: 12, radius: 18 },
  { id: 3, lat: 22.3, lng: 70.8, triage: "RED", disease: "Brucellosis", district: "Rajkot", state: "Gujarat", count: 7, radius: 20 },
  { id: 4, lat: 25.4, lng: 81.8, triage: "YELLOW", disease: "PPR", district: "Allahabad", state: "UP", count: 9, radius: 15 },
  { id: 5, lat: 15.3, lng: 75.1, triage: "GREEN", disease: "HS", district: "Dharwad", state: "Karnataka", count: 3, radius: 10 },
];

const STOCKPILE = [
  { vaccine: "FMD Multivalent", stock: 42000, required: 60000, unit: "doses", state: "Maharashtra" },
  { vaccine: "PPR", stock: 28000, required: 35000, unit: "doses", state: "Gujarat" },
  { vaccine: "HS + BQ Combined", stock: 15000, required: 15000, unit: "doses", state: "UP" },
  { vaccine: "Anthrax Spore", stock: 800, required: 5000, unit: "doses", state: "Rajasthan" },
];

const TREND_14D = [
  {d:"1 Sep",cases:8},{d:"2 Sep",cases:11},{d:"3 Sep",cases:9},{d:"4 Sep",cases:14},{d:"5 Sep",cases:18},
  {d:"6 Sep",cases:22},{d:"7 Sep",cases:19},{d:"8 Sep",cases:24},{d:"9 Sep",cases:31},{d:"10 Sep",cases:28},
  {d:"11 Sep",cases:35},{d:"12 Sep",cases:41},{d:"13 Sep",cases:38},{d:"14 Sep",cases:44},
];

const STATE_BAR = [
  {state:"MH",cases:44},{state:"GJ",cases:28},{state:"UP",cases:22},{state:"RJ",cases:17},{state:"KA",cases:12},{state:"MP",cases:9},
];

const EPI_METRICS = [
  { label: "Attack Rate", value: "4.2%", sub: "Cattle — Last 30 days", color: "text-red-600", bg: "bg-red-50" },
  { label: "Case Fatality Rate", value: "1.8%", sub: "All species — Active clusters", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Vaccination Coverage", value: "61%", sub: "FMD — Maharashtra", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Containment Rate", value: "78%", sub: "Clusters resolved < 14 days", color: "text-green-600", bg: "bg-green-50" },
];

const TRIAGE_OPTS = { RED: { color: "red", fill: "red" }, YELLOW: { color: "orange", fill: "orange" }, GREEN: { color: "green", fill: "green" } };
const COLORS = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6"];

export default function GovtCommandCenter() {
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 1200); };

  const critical = NATIONAL_CLUSTERS.filter(c => c.triage === "RED").length;
  const totalAnimals = 284000;
  const mmuDeployed = 3;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Globe className="w-5 h-5" /></div>
          <div>
            <h1 className="text-lg font-bold">National Animal Health Command Center</h1>
            <p className="text-slate-400 text-xs">Ministry of Fisheries, Animal Husbandry & Dairying — GOI</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-slate-400 text-xs">IST</p>
            <p className="text-lg font-mono font-semibold">{time}</p>
          </div>
          <button onClick={refresh} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition">
            <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-900/50 border border-green-700 rounded-lg">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-green-400 font-semibold">LIVE</span>
          </div>
        </div>
      </div>

      {/* Epi Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {EPI_METRICS.map((m, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-1">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-slate-500 text-[10px] mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Critical Clusters", val: critical, icon: AlertTriangle, color: "text-red-400" },
          { label: "Active Districts", val: NATIONAL_CLUSTERS.length, icon: Activity, color: "text-amber-400" },
          { label: "Animals at Risk", val: "2.84L", icon: Users, color: "text-purple-400" },
          { label: "MMU Deployed", val: mmuDeployed, icon: Truck, color: "text-blue-400" },
          { label: "Vaccine Drives", val: 7, icon: Syringe, color: "text-green-400" },
        ].map((k, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1">
            <k.icon className={`w-5 h-5 ${k.color}`} />
            <p className="text-2xl font-bold">{k.val}</p>
            <p className="text-slate-400 text-xs">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Map + Stockpile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[420px] relative">
          <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-lg">
            <p className="text-xs font-semibold text-slate-300">National Geospatial Outbreak Map</p>
          </div>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%", zIndex: 0 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {NATIONAL_CLUSTERS.map(c => (
              <CircleMarker key={c.id} center={[c.lat, c.lng]} radius={c.radius}
                pathOptions={{ color: TRIAGE_OPTS[c.triage].color, fillColor: TRIAGE_OPTS[c.triage].fill, fillOpacity: 0.35, weight: 2 }}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{c.disease}</p>
                    <p>{c.district}, {c.state}</p>
                    <p>{c.count} cases · {c.triage}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Vaccine Stockpile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2 text-slate-200"><Syringe className="w-4 h-4 text-blue-400" /> Vaccine Stockpile Monitor</h3>
          <div className="space-y-4">
            {STOCKPILE.map((s, i) => {
              const pct = Math.min(100, Math.round((s.stock / s.required) * 100));
              const low = pct < 50;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium text-slate-300">{s.vaccine}</p>
                    <p className={`text-xs font-bold ${low ? "text-red-400" : "text-green-400"}`}>{pct}%</p>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${low ? "bg-red-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-[10px] text-slate-500">{s.stock.toLocaleString()} / {s.required.toLocaleString()} {s.unit}</p>
                    <p className="text-[10px] text-slate-500">{s.state}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-lg transition">
              <Truck className="w-3.5 h-3.5" /> Request MMU Deployment
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-200 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> National Case Trend — Last 14 Days</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_14D}>
              <XAxis dataKey="d" fontSize={9} tick={{ fill: "#64748b" }} />
              <YAxis fontSize={9} tick={{ fill: "#64748b" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
              <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-4 text-slate-200 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-400" /> Cases by State</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={STATE_BAR} barSize={28}>
              <XAxis dataKey="state" fontSize={10} tick={{ fill: "#64748b" }} />
              <YAxis fontSize={9} tick={{ fill: "#64748b" }} />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", fontSize: "11px" }} />
              <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                {STATE_BAR.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
