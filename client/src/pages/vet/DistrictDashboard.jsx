import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Activity, FlaskConical, Users, RefreshCw } from 'lucide-react';
import Layout from '../../components/Layout.jsx';

// Mock Data
const MOCK_CHART_DATA = [
  { name: 'Mon', cases: 12 }, { name: 'Tue', cases: 19 }, { name: 'Wed', cases: 15 },
  { name: 'Thu', cases: 22 }, { name: 'Fri', cases: 30 }, { name: 'Sat', cases: 28 }
];

const MOCK_SPECIES_DATA = [
  { name: 'Cattle', value: 400 }, { name: 'Buffalo', value: 300 }, { name: 'Goat', value: 300 }
];
const COLORS = ['var(--cat-1)', 'var(--cat-2)', 'var(--cat-3)', 'var(--cat-4)'];

const MAHARASHTRA_DISTRICTS = [
  'Pune', 'Nashik', 'Ahilyanagar', 'Nagpur', 'Mumbai', 'Thane', 'Kolhapur', 'Solapur', 'Satara', 'Jalgaon', 'Amravati', 'Aurangabad'
];

export default function DistrictDashboard() {
  const [time, setTime] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(new Date()));
    }, 1000);
    setTimeout(() => setLoading(false), 1000); // Simulate API load
    return () => clearInterval(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    // Randomize mock data slightly for demo
    MOCK_CHART_DATA.forEach(d => d.cases = Math.floor(Math.random() * 40) + 5);
    MOCK_SPECIES_DATA.forEach(d => d.value = Math.floor(Math.random() * 500) + 100);
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const cardStyle = { background: "white", borderRadius: "14px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0" };

  return (
    <Layout title="District Command Center" showBack>
      <div className="page-content" style={{ paddingBottom: "120px", maxWidth: "1200px" }}>
        
        {/* Header */}
        <div style={{ ...cardStyle, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <select 
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  refreshData();
                }}
                style={{ 
                  margin: 0, fontSize: "20px", fontWeight: "800", color: "#1B5E20", 
                  border: "none", background: "transparent", outline: "none", cursor: "pointer",
                  WebkitAppearance: "none", paddingRight: "16px",
                  backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231B5E20%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')",
                  backgroundRepeat: "no-repeat", backgroundPosition: "right center"
                }}
              >
                {MAHARASHTRA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d} District Analytics</option>
                ))}
              </select>
            </div>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#666", fontWeight: "600" }}>Maharashtra Veterinary Command</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4CAF50" }}></div>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Online</span>
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", fontFamily: "monospace" }}>{time}</div>
            <button onClick={refreshData} style={{ background: "#E3F2FD", color: "#1565C0", border: "none", padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex" }}>
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {[ 
            { title: "Active Outbreaks", val: "3", icon: AlertTriangle, color: "#D32F2F", bg: "#FFEBEE", trend: "+2" },
            { title: "Reports Today", val: "142", icon: Activity, color: "#1976D2", bg: "#E3F2FD", trend: "+12%" },
            { title: "Lab SLA Breached", val: "1", icon: FlaskConical, color: "#F57F17", bg: "#FFF8E1", trend: "-1" },
            { title: "Animals at Risk", val: "4.2k", icon: Users, color: "#7B1FA2", bg: "#F3E5F5", trend: "+5%" }
          ].map((kpi, i) => (
            <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", margin: 0 }}>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#666", fontWeight: "600" }}>{kpi.title}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: "#333" }}>{kpi.val}</h3>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: kpi.trend.includes('-') ? "#2E7D32" : "#D32F2F" }}>{kpi.trend}</span>
                </div>
              </div>
              <div style={{ padding: "12px", borderRadius: "50%", background: kpi.bg, color: kpi.color, display: "flex" }}>
                <kpi.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          
          <div style={cardStyle}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: "0 0 16px 0" }}>Epidemic Curve (7 Days)</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="cases" stroke="#D32F2F" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: "0 0 16px 0" }}>Species Affected</h3>
            <div style={{ height: "250px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOCK_SPECIES_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {MOCK_SPECIES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
                {MOCK_SPECIES_DATA.map((entry, index) => (
                  <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: COLORS[index % COLORS.length] }}></div>
                    <span style={{ fontSize: "12px", color: "#555", fontWeight: "600" }}>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
