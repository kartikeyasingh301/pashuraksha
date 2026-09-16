import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  AlertTriangle, Activity, FlaskConical, MapPin, 
  Users, Skull, RefreshCw 
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock Data
const MOCK_ALERTS = [
  { id: 1, disease: "Anthrax Suspected", location: "Khed, Pune", count: 4, triage: "RED", time: "10 min ago" },
  { id: 2, disease: "FMD Cluster", location: "Baramati, Pune", count: 12, triage: "YELLOW", time: "2 hrs ago" },
  { id: 3, disease: "LSD Endemic", location: "Shirur, Pune", count: 2, triage: "GREEN", time: "5 hrs ago" }
];

const MOCK_LAB_SLA = [
  { id: "S-8921", disease: "Anthrax", collected: "2023-10-24 10:00", status: "TESTING", hoursLeft: -2, breached: true },
  { id: "S-8922", disease: "FMD", collected: "2023-10-25 08:00", status: "IN_TRANSIT", hoursLeft: 12, breached: false },
  { id: "S-8923", disease: "Brucellosis", collected: "2023-10-25 14:00", status: "LAB_INGESTED", hoursLeft: 18, breached: false }
];

const MOCK_CHART_DATA = [
  { name: 'Mon', cases: 12 }, { name: 'Tue', cases: 19 }, { name: 'Wed', cases: 15 },
  { name: 'Thu', cases: 22 }, { name: 'Fri', cases: 30 }, { name: 'Sat', cases: 28 }
];

const MOCK_SPECIES_DATA = [
  { name: 'Cattle', value: 400 }, { name: 'Buffalo', value: 300 }, { name: 'Goat', value: 300 }
];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

export default function DistrictDashboard() {
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    setTimeout(() => setLoading(false), 1000); // Simulate API load
    return () => clearInterval(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredAlerts = MOCK_ALERTS.filter(a => filter === 'ALL' || a.triage === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      
      {/* SECTION 1: Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">District Epidemiology Command Center</h1>
          <p className="text-gray-500 text-sm">Pune District, Maharashtra</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">System Online</span>
          </div>
          <div className="text-lg font-mono font-semibold">{time}</div>
          <button onClick={refreshData} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SECTION 2: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[ 
          { title: "Active Outbreaks", val: "3", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100", trend: "+2" },
          { title: "Reports Today", val: "142", icon: Activity, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
          { title: "Lab SLA Breached", val: "1", icon: FlaskConical, color: "text-amber-600", bg: "bg-amber-100", trend: "-1" },
          { title: "Animals at Risk", val: "4.2k", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5%" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
              <div className="flex items-end space-x-2">
                <h3 className="text-3xl font-bold">{kpi.val}</h3>
                <span className={`text-sm font-medium ${kpi.trend.includes('-') ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-full ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* SECTION 3: Triage Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg flex items-center"><Activity className="w-5 h-5 mr-2 text-gray-500"/> Live Alerts</h2>
          </div>
          <div className="flex border-b border-gray-100">
            {['ALL', 'RED', 'YELLOW', 'GREEN'].map(f => (
              <button 
                key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-2 text-xs font-semibold ${filter === f ? 'bg-gray-100 border-b-2 border-blue-500 text-gray-800' : 'text-gray-500'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="p-3 border border-gray-100 rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${alert.triage === 'RED' ? 'bg-red-500 animate-pulse' : alert.triage === 'YELLOW' ? 'bg-amber-400' : 'bg-green-500'}`}></div>
                  <div>
                    <h4 className="font-semibold text-sm">{alert.disease}</h4>
                    <p className="text-xs text-gray-500 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1"/> {alert.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">{alert.count} cases</span>
                  <p className="text-[10px] text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[500px] relative z-0">
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-md shadow font-semibold">
            Real-time Outbreak Heatmap
          </div>
          <MapContainer center={[18.5204, 73.8567]} zoom={9} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[18.84, 73.9]} radius={20} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.4 }}>
              <Popup>Anthrax Suspected - Khed</Popup>
            </CircleMarker>
            <CircleMarker center={[18.15, 74.58]} radius={15} pathOptions={{ color: 'orange', fillColor: 'orange', fillOpacity: 0.4 }}>
              <Popup>FMD Cluster - Baramati</Popup>
            </CircleMarker>
          </MapContainer>
        </div>
      </div>

      {/* SECTIONS 5 & 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Lab SLA Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center"><FlaskConical className="w-5 h-5 mr-2 text-gray-500"/> Lab Diagnostics SLA Monitor</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="p-3 rounded-tl-lg">Sample ID</th><th className="p-3">Disease</th><th className="p-3">Status</th><th className="p-3 rounded-tr-lg">SLA Status</th></tr>
              </thead>
              <tbody>
                {MOCK_LAB_SLA.map(sample => (
                  <tr key={sample.id} className={`border-b border-gray-50 ${sample.breached ? 'bg-red-50/50' : ''}`}>
                    <td className="p-3 font-mono font-medium">{sample.id}</td>
                    <td className="p-3">{sample.disease}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold">{sample.status}</span>
                    </td>
                    <td className="p-3">
                      {sample.breached ? (
                        <span className="text-red-600 font-bold flex items-center"><Skull className="w-4 h-4 mr-1"/> {Math.abs(sample.hoursLeft)}h Overdue</span>
                      ) : (
                        <span className="text-green-600 font-semibold">{sample.hoursLeft}h remaining</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Epi Charts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
          <div className="w-1/2 h-[250px]">
            <h3 className="text-center text-sm font-semibold text-gray-600 mb-2">Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_CHART_DATA}>
                <XAxis dataKey="name" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 h-[250px]">
            <h3 className="text-center text-sm font-semibold text-gray-600 mb-2">Species Affected</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_SPECIES_DATA} innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {MOCK_SPECIES_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
