$content = @"
import React, { useState } from 'react';
import Layout from '../../components/Layout.jsx';
import { Search, Plus, ChevronRight, Syringe, Heart, AlertCircle, Calendar, ArrowLeft, Filter } from 'lucide-react';

const animalsData = [
  { id: 'C-001', tagId: 'GJ-RJ-4821', species: 'Cattle', breed: 'Gir', sex: 'Female', age: '4 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'FMD — Apr 2026', vaccinated: true },
  { id: 'C-002', tagId: 'GJ-RJ-4822', species: 'Cattle', breed: 'Sahiwal', sex: 'Female', age: '3 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'FMD — Apr 2026', vaccinated: true },
  { id: 'B-001', tagId: 'GJ-RJ-4830', species: 'Buffalo', breed: 'Murrah', sex: 'Female', age: '6 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'HS — Jan 2026', vaccinated: true },
  { id: 'B-002', tagId: 'GJ-RJ-4831', species: 'Buffalo', breed: 'Jafarabadi', sex: 'Female', age: '5 yrs', village: 'Dhoraji', status: 'under_observation', lastVaccine: 'HS — Jan 2026', vaccinated: true },
  { id: 'G-001', tagId: 'GJ-RJ-4840', species: 'Goat', breed: 'Osmanabadi', sex: 'Male', age: '2 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'None', vaccinated: false },
  { id: 'G-002', tagId: 'GJ-RJ-4841', species: 'Goat', breed: 'Sirohi', sex: 'Female', age: '1.5 yrs', village: 'Upleta', status: 'healthy', lastVaccine: 'PPR — Nov 2025', vaccinated: true },
  { id: 'C-003', tagId: 'GJ-RJ-4850', species: 'Cattle', breed: 'HF Cross', sex: 'Female', age: '3 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'BQ — Mar 2026', vaccinated: true },
  { id: 'S-001', tagId: 'GJ-RJ-4860', species: 'Sheep', breed: 'Marwari', sex: 'Male', age: '2 yrs', village: 'Dhoraji', status: 'healthy', lastVaccine: 'PPR — Nov 2025', vaccinated: true },
  { id: 'C-004', tagId: 'GJ-RJ-4870', species: 'Cattle', breed: 'Gir', sex: 'Male', age: '5 yrs', village: 'Upleta', status: 'under_observation', lastVaccine: 'FMD — Apr 2026', vaccinated: true },
  { id: 'G-003', tagId: 'GJ-RJ-4880', species: 'Goat', breed: 'Surti', sex: 'Female', age: '3 yrs', village: 'Gondal', status: 'healthy', lastVaccine: 'None', vaccinated: false },
];

const getSpeciesColor = (species) => {
  switch (species) {
    case 'Cattle': return { bg: '#FFF8E1', color: '#F57F17' };
    case 'Buffalo': return { bg: '#ECEFF1', color: '#546E7A' };
    case 'Goat': return { bg: '#E8F5E9', color: '#2E7D32' };
    case 'Sheep': return { bg: '#E3F2FD', color: '#1565C0' };
    default: return { bg: '#F5F5F5', color: '#9E9E9E' };
  }
};

const getStatusBadge = (status) => {
  if (status === 'healthy') {
    return <span style={{ background: '#E8F5E9', color: '#2E7D32', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Healthy</span>;
  }
  if (status === 'under_observation') {
    return <span style={{ background: '#FFF8E1', color: '#F57F17', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Under Observation</span>;
  }
  return null;
};

export default function HerdLedger() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('All');
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const filteredAnimals = animalsData.filter(animal => {
    const matchesSearch = animal.tagId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          animal.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          animal.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSpecies === 'All' || animal.species === filterSpecies;
    return matchesSearch && matchesFilter;
  });

  if (selectedAnimal) {
    return (
      <Layout title={\`Details: \${selectedAnimal.tagId}\`} showBack>
        <div className="page-content" style={{ paddingBottom: '120px', padding: '16px' }}>
          <button 
            onClick={() => setSelectedAnimal(null)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#2E7D32', fontWeight: '600', marginBottom: '16px', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={20} /> Back to Herd
          </button>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: getSpeciesColor(selectedAnimal.species).bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={30} color={getSpeciesColor(selectedAnimal.species).color} />
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1B5E20' }}>{selectedAnimal.tagId}</h2>
                <div style={{ color: '#666', fontSize: '14px' }}>{selectedAnimal.species} • {selectedAnimal.breed}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#999' }}>Sex</div>
                <div style={{ fontWeight: '500' }}>{selectedAnimal.sex}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#999' }}>Age</div>
                <div style={{ fontWeight: '500' }}>{selectedAnimal.age}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#999' }}>Village</div>
                <div style={{ fontWeight: '500' }}>{selectedAnimal.village}</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '700', color: '#1B5E20' }}>Health Status</h3>
            {getStatusBadge(selectedAnimal.status)}
            <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#666' }}>Last updated: Today</p>
          </div>

          <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700', color: '#1B5E20', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Syringe size={20} /> Vaccination History
            </h3>
            {selectedAnimal.vaccinated ? (
              <div style={{ borderLeft: '2px solid #E8F5E9', paddingLeft: '16px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-6px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#2E7D32' }}></div>
                <div style={{ fontWeight: '600' }}>{selectedAnimal.lastVaccine.split(' — ')[0]}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Date: {selectedAnimal.lastVaccine.split(' — ')[1]}</div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>Status: Completed</div>
              </div>
            ) : (
              <div style={{ color: '#666', fontSize: '14px' }}>No vaccination records found.</div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Herd Ledger" showBack>
      <div className="page-content" style={{ paddingBottom: '120px', padding: '16px' }}>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Total Animals</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1B5E20' }}>27</div>
          </div>
          <div style={{ background: '#E8F5E9', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '13px', color: '#2E7D32', marginBottom: '8px' }}>Healthy</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2E7D32' }}>24</div>
          </div>
          <div style={{ background: '#FFF8E1', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '13px', color: '#F57F17', marginBottom: '8px' }}>Under Obs.</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#F57F17' }}>2</div>
          </div>
          <div style={{ background: '#FFEBEE', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            <div style={{ fontSize: '13px', color: '#C62828', marginBottom: '8px' }}>Vax Due</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#C62828' }}>4</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Search by tag, species, or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', scrollbarWidth: 'none' }}>
          {['All', 'Cattle', 'Buffalo', 'Goat', 'Sheep'].map(species => (
            <button
              key={species}
              onClick={() => setFilterSpecies(species)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filterSpecies === species ? '#2E7D32' : 'white',
                color: filterSpecies === species ? 'white' : '#666',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              {species}
            </button>
          ))}
        </div>

        {/* Animal List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAnimals.map(animal => (
            <div 
              key={animal.id} 
              onClick={() => setSelectedAnimal(animal)}
              style={{ background: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: getSpeciesColor(animal.species).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Heart size={24} color={getSpeciesColor(animal.species).color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: '#1B5E20' }}>{animal.tagId}</span>
                  {getStatusBadge(animal.status)}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                  {animal.species} • {animal.breed} • {animal.sex} • {animal.age}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: animal.vaccinated ? '#2E7D32' : '#C62828', fontWeight: '500' }}>
                  <Syringe size={14} />
                  {animal.vaccinated ? \`Vax: \${animal.lastVaccine}\` : 'Vaccination Due'}
                </div>
              </div>
              <ChevronRight size={20} color="#ccc" style={{ flexShrink: 0 }} />
            </div>
          ))}
          {filteredAnimals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#666' }}>
              No animals found matching your search.
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
"@
Set-Content -Path "C:\Users\KARTIKEYA\.gemini\antigravity\scratch\pashusuraksha\client\src\pages\farmer\HerdLedger.jsx" -Value $content -Encoding UTF8
