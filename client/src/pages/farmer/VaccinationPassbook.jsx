import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { Syringe, CheckCircle, AlertCircle, Clock, Download, Filter } from 'lucide-react';

const VaccinationPassbook = () => {
  const [filter, setFilter] = useState('all');

  const records = [
    { id: 1, vaccine: 'Foot & Mouth Disease (FMD)', batch: 'VB-FMD-2026-441', manufacturer: 'Indian Immunologicals', animal: 'MH-NK-4821', date: '15 Apr 2026', nextDue: '15 Oct 2026', vet: 'Dr. Priya Sharma', status: 'vaccinated' },
    { id: 2, vaccine: 'Hemorrhagic Septicemia (HS)', batch: 'VB-HS-2026-112', manufacturer: 'Hester Biosciences', animal: 'MH-NK-4830', date: '10 Jan 2026', nextDue: '10 Jan 2027', vet: 'Dr. R. Patil', status: 'vaccinated' },
    { id: 3, vaccine: 'Black Quarter (BQ)', batch: 'VB-BQ-2026-889', manufacturer: 'Venkys India', animal: 'MH-NK-4850', date: '5 Mar 2026', nextDue: '5 Mar 2027', vet: 'Dr. Priya Sharma', status: 'vaccinated' },
    { id: 4, vaccine: 'PPR (Goat Plague)', batch: 'VB-PPR-2025-204', manufacturer: 'Indian Immunologicals', animal: 'MH-NK-4840', date: '20 Nov 2025', nextDue: '20 Nov 2026', vet: 'Dr. R. Patil', status: 'due_soon' },
    { id: 5, vaccine: 'Brucellosis S19', batch: 'VB-BR-2025-031', manufacturer: 'IVRI Izatnagar', animal: 'MH-NK-4821', date: '8 Feb 2025', nextDue: '8 Feb 2026', vet: 'Dr. Priya Sharma', status: 'overdue' },
    { id: 6, vaccine: 'FMD', batch: 'VB-FMD-2026-442', manufacturer: 'Indian Immunologicals', animal: 'MH-NK-4822', date: '15 Apr 2026', nextDue: '15 Oct 2026', vet: 'Dr. Priya Sharma', status: 'vaccinated' },
    { id: 7, vaccine: 'Anthrax Spore Vaccine', batch: 'VB-ANT-2025-077', manufacturer: 'IVRI Izatnagar', animal: 'MH-NK-4870', date: '12 Dec 2025', nextDue: '12 Dec 2026', vet: 'Dr. R. Patil', status: 'due_soon' },
    { id: 8, vaccine: 'HS', batch: 'VB-HS-2025-331', manufacturer: 'Hester Biosciences', animal: 'MH-NK-4831', date: '5 Jun 2025', nextDue: '5 Jun 2026', vet: 'Dr. Priya Sharma', status: 'overdue' }
  ];

  const filteredRecords = (filter === 'all' ? records : records.filter(r => r.status === filter)).sort((a, b) => {
      const order = { 'overdue': 1, 'due_soon': 2, 'vaccinated': 3 };
      return order[a.status] - order[b.status];
    });

  const statusConfig = {
    vaccinated: { color: '#2E7D32', bg: '#E8F5E9', border: '#C8E6C9', label: 'Vaccinated', icon: CheckCircle },
    due_soon: { color: '#F57F17', bg: '#FFF8E1', border: '#FFE082', label: 'Due Soon', icon: Clock },
    overdue: { color: '#C62828', bg: '#FFEBEE', border: '#FFCDD2', label: 'Overdue', icon: AlertCircle }
  };

  const getStatusStyle = (status) => statusConfig[status];

  return (
    <Layout title="Vaccination Passbook" showBack>
      <div className="page-content" style={{ paddingBottom: '120px', padding: '16px' }}>
        
        {/* Coverage Section */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: '#E8F5E9', padding: '8px', borderRadius: '50%' }}>
                <Syringe size={20} color="#2E7D32" />
              </div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>Herd Vaccination Coverage</h2>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2E7D32' }}>85%</div>
          </div>
          
          <div style={{ height: '8px', background: '#E0E0E0', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
            <div style={{ width: '85%', height: '100%', background: '#2E7D32', borderRadius: '4px' }}></div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32' }}></span>
              Vaccinated: 17
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F57F17' }}></span>
              Due Soon: 2
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C62828' }}></span>
              Overdue: 1
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {[
            { id: 'all', label: 'All (20)' },
            { id: 'vaccinated', label: 'Vaccinated (17)' },
            { id: 'due_soon', label: 'Due Soon (2)' },
            { id: 'overdue', label: 'Overdue (1)' }
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={"chip " + (filter === f.id ? "active" : "")}>{f.label}</button>
          ))}
        </div>

        {/* Warning Banner */}
        {filter === 'all' && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#FFEBEE', border: '1px solid #FFCDD2', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <AlertCircle size={20} color="#C62828" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '14px', color: '#B71C1C', lineHeight: '1.4' }}>
              <span style={{ fontWeight: '600' }}>1 vaccination(s) overdue.</span> Contact your field vet to schedule immediately.
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredRecords.map(record => {
            const styleConfig = getStatusStyle(record.status);
            const StatusIcon = styleConfig.icon;
            
            return (
              <div key={record.id} className="card" style={{ borderLeftColor: styleConfig.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '700', color: '#333' }}>{record.vaccine}</h3>
                    <div style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Tag: {record.animal}</div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    background: styleConfig.bg, 
                    color: styleConfig.color, 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    border: `1px solid ${styleConfig.border}`
                  }}>
                    <StatusIcon size={14} />
                    {styleConfig.label}
                  </div>
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '12px', 
                  background: '#F9F9F9', 
                  padding: '12px', 
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#777', marginBottom: '2px' }}>Administered</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{record.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#777', marginBottom: '2px' }}>Next Due</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{record.nextDue}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#777', marginBottom: '2px' }}>Batch</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{record.batch}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#777', marginBottom: '2px' }}>Manufacturer</div>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{record.manufacturer}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                  <span>Administered by: {record.vet}</span>
                  <button style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#2E7D32', fontSize: '13px', fontWeight: '700', cursor: 'pointer', padding: '6px 12px', borderRadius: '6px'
                  }}>
                    <Download size={14} /> Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Layout>
  );
};

export default VaccinationPassbook;
